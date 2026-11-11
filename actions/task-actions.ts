"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Priority, Status } from "@prisma/client";

export interface CreateTaskInput {
  title: string;
  description?: string;
  category: string;
  priority: Priority;
  employeeId?: number | null;
  scheduledStartDate?: string | null;
  links?: string[];
}

export interface TaskActionResult {
  success: boolean;
  message?: string;
  taskId?: number;
  promotedTaskId?: number | null;
}

/**
 * Fetch all employees for task assignment dropdown
 */
export async function getEmployees() {
  try {
    const employees = await prisma.user.findMany({
      where: {
        Role: "EMPLOYEE",
      },
      select: {
        ID: true,
        Full_Name: true,
        Username: true,
      },
      orderBy: {
        Full_Name: "asc",
      },
    });
    return employees;
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return [];
  }
}

/**
 * Helper to determine task status and scheduled start date based on employee workload:
 * - If employee has an IN_PROGRESS task: status = SCHEDULED, start date = 3 days from Date.now()
 * - If employee has NO in-progress tasks: status = PENDING, start date = null
 */
async function resolveAssignmentStatus(
  employeeId: number | null | undefined,
  requestedStartDate?: string | null
): Promise<{ status: Status; scheduledStartDate: Date | null }> {
  if (!employeeId) {
    return {
      status: requestedStartDate ? Status.SCHEDULED : Status.PENDING,
      scheduledStartDate: requestedStartDate ? new Date(requestedStartDate) : null,
    };
  }

  // Check if this Employee currently has ANY task with Status = IN_PROGRESS
  const hasInProgressTask = await prisma.task.findFirst({
    where: {
      Employee_ID: employeeId,
      Status: Status.IN_PROGRESS,
    },
    select: { ID: true },
  });

  if (hasInProgressTask) {
    // Override to SCHEDULED and set Scheduled_Start_Date to exactly 3 days from Date.now()
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    return {
      status: Status.SCHEDULED,
      scheduledStartDate: new Date(Date.now() + THREE_DAYS_MS),
    };
  }

  // No active in-progress task: set to PENDING
  return {
    status: Status.PENDING,
    scheduledStartDate: null,
  };
}

/**
 * ACTION 1: Create a new Task with workload-based assignment logic
 */
export async function createTaskAction(
  input: CreateTaskInput
): Promise<TaskActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.User_ID) {
      return {
        success: false,
        message: "Unauthorized: You must be logged in to create tasks.",
      };
    }

    const managerId = session.user.User_ID;
    const title = input.title?.trim();
    if (!title) {
      return { success: false, message: "Task title is required." };
    }

    const category = input.category?.trim();
    if (!category) {
      return { success: false, message: "Category is required." };
    }

    const targetEmployeeId = input.employeeId ? Number(input.employeeId) : null;

    // Apply workload assignment business rule
    const { status, scheduledStartDate } = await resolveAssignmentStatus(
      targetEmployeeId,
      input.scheduledStartDate
    );

    // Filter valid URLs
    const validUrls = (input.links || [])
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const task = await prisma.task.create({
      data: {
        Title: title,
        Description: input.description?.trim() || null,
        Category: category,
        Priority: input.priority || Priority.MEDIUM,
        Status: status,
        Scheduled_Start_Date: scheduledStartDate,
        Manager_ID: managerId,
        Employee_ID: targetEmployeeId,
        Links:
          validUrls.length > 0
            ? {
                create: validUrls.map((url) => ({
                  URL: url,
                })),
              }
            : undefined,
      },
      include: {
        Links: true,
      },
    });

    revalidatePath("/manager/dashboard");
    revalidatePath("/manager/tasks");
    revalidatePath("/employee/dashboard");
    revalidatePath("/employee/my-tasks");

    return {
      success: true,
      taskId: task.ID,
      message:
        status === Status.SCHEDULED
          ? "Task created and queued as SCHEDULED (Employee currently has an active in-progress task)."
          : "Task created successfully.",
    };
  } catch (error: any) {
    console.error("createTaskAction error:", error);
    return {
      success: false,
      message: error?.message || "Failed to create task.",
    };
  }
}

/**
 * ACTION 1 (Variant for re-assigning existing task):
 * When a Manager assigns an existing task to an Employee
 */
export async function assignTaskAction(
  taskId: number,
  employeeId: number | null
): Promise<TaskActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.User_ID) {
      return { success: false, message: "Unauthorized." };
    }

    const targetEmployeeId = employeeId ? Number(employeeId) : null;
    const { status, scheduledStartDate } = await resolveAssignmentStatus(
      targetEmployeeId
    );

    const updatedTask = await prisma.task.update({
      where: { ID: taskId },
      data: {
        Employee_ID: targetEmployeeId,
        Status: status,
        Scheduled_Start_Date: scheduledStartDate,
      },
    });

    revalidatePath("/manager/dashboard");
    revalidatePath("/manager/tasks");
    revalidatePath("/employee/dashboard");
    revalidatePath("/employee/my-tasks");

    return {
      success: true,
      taskId: updatedTask.ID,
      message:
        status === Status.SCHEDULED
          ? "Assigned to employee: Status set to SCHEDULED (3 days out) due to active in-progress workload."
          : "Task assigned and set to PENDING.",
    };
  } catch (error: any) {
    console.error("assignTaskAction error:", error);
    return {
      success: false,
      message: error?.message || "Failed to assign task.",
    };
  }
}

/**
 * ACTION 2 (Status Trigger):
 * When an Employee changes a task status to DONE:
 * 1. Set Completed_Date to Date.now().
 * 2. Query Prisma for the oldest task assigned to that Employee with Status = SCHEDULED.
 * 3. If one exists, automatically update its status to IN_PROGRESS.
 */
export async function completeTaskAction(taskId: number): Promise<TaskActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.User_ID) {
      return { success: false, message: "Unauthorized." };
    }

    // Run atomically in a Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch the target task to verify existence and get assignee
      const task = await tx.task.findUnique({
        where: { ID: taskId },
        select: {
          ID: true,
          Status: true,
          Employee_ID: true,
        },
      });

      if (!task) {
        throw new Error(`Task #${taskId} not found.`);
      }

      const now = new Date();

      // 2. Mark this task as DONE with Completed_Date = now
      const completedTask = await tx.task.update({
        where: { ID: taskId },
        data: {
          Status: Status.DONE,
          Completed_Date: now,
        },
      });

      let promotedTask = null;

      // 3. If an employee is assigned, find their oldest SCHEDULED task
      if (task.Employee_ID) {
        promotedTask = await tx.task.findFirst({
          where: {
            Employee_ID: task.Employee_ID,
            Status: Status.SCHEDULED,
            ID: { not: taskId },
          },
          orderBy: [
            { Scheduled_Start_Date: "asc" }, // Oldest scheduled start
            { Created_At: "asc" },            // Oldest created
          ],
        });

        // 4. Automatically promote it to IN_PROGRESS
        if (promotedTask) {
          await tx.task.update({
            where: { ID: promotedTask.ID },
            data: {
              Status: Status.IN_PROGRESS,
            },
          });
        }
      }

      return {
        completedTaskId: completedTask.ID,
        promotedTaskId: promotedTask ? promotedTask.ID : null,
      };
    });

    revalidatePath("/manager/dashboard");
    revalidatePath("/manager/tasks");
    revalidatePath("/employee/dashboard");
    revalidatePath("/employee/my-tasks");

    return {
      success: true,
      taskId: result.completedTaskId,
      promotedTaskId: result.promotedTaskId,
      message: result.promotedTaskId
        ? `Task completed. Next scheduled task #${result.promotedTaskId} has been automatically promoted to IN_PROGRESS.`
        : "Task completed successfully.",
    };
  } catch (error: any) {
    console.error("completeTaskAction error:", error);
    return {
      success: false,
      message: error?.message || "Failed to update task status to DONE.",
    };
  }
}

/**
 * General Task Status update action that routes to completeTaskAction when DONE,
 * or handles other status transitions (e.g., PENDING -> IN_PROGRESS).
 */
export async function updateTaskStatusAction(
  taskId: number,
  newStatus: Status
): Promise<TaskActionResult> {
  if (newStatus === Status.DONE) {
    return completeTaskAction(taskId);
  }

  try {
    const session = await auth();
    if (!session?.user?.User_ID) {
      return { success: false, message: "Unauthorized." };
    }

    const updatedTask = await prisma.task.update({
      where: { ID: taskId },
      data: {
        Status: newStatus,
        Completed_Date: null,
      },
    });

    revalidatePath("/manager/dashboard");
    revalidatePath("/manager/tasks");
    revalidatePath("/employee/dashboard");
    revalidatePath("/employee/my-tasks");

    return {
      success: true,
      taskId: updatedTask.ID,
      message: `Task status updated to ${newStatus}.`,
    };
  } catch (error: any) {
    console.error("updateTaskStatusAction error:", error);
    return {
      success: false,
      message: error?.message || "Failed to update task status.",
    };
  }
}

export interface TopPerformer {
  id: number;
  fullName: string;
  username: string;
  completedCount: number;
}

/**
 * FEATURE 1: Check for Top Performing Employees
 * Queries Prisma for any Employee who has 5 or more tasks marked DONE
 * where the Completed_Date is within the last 7 days.
 */
export async function checkTopPerformersAction(): Promise<TopPerformer[]> {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const qualifyingEmployees = await prisma.user.findMany({
      where: {
        Role: "EMPLOYEE",
        Assigned_Tasks: {
          some: {
            Status: Status.DONE,
            Completed_Date: {
              gte: sevenDaysAgo,
            },
          },
        },
      },
      select: {
        ID: true,
        Full_Name: true,
        Username: true,
        Assigned_Tasks: {
          where: {
            Status: Status.DONE,
            Completed_Date: {
              gte: sevenDaysAgo,
            },
          },
          select: {
            ID: true,
          },
        },
      },
    });

    return qualifyingEmployees
      .filter((emp) => emp.Assigned_Tasks.length >= 5)
      .map((emp) => ({
        id: emp.ID,
        fullName: emp.Full_Name,
        username: emp.Username,
        completedCount: emp.Assigned_Tasks.length,
      }));
  } catch (error) {
    console.error("checkTopPerformersAction error:", error);
    return [];
  }
}

