"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export interface CommentData {
  ID: number;
  Task_ID: number;
  User_ID: number;
  Content: string;
  Created_At: Date;
  User: {
    ID: number;
    Full_Name: string;
    Username: string;
    Role: string;
  };
}

export interface CommentActionResult {
  success: boolean;
  message?: string;
  comment?: CommentData;
}

/**
 * Server Action 1: Fetch all comments for a specific task including author details
 */
export async function getTaskComments(taskId: number): Promise<CommentData[]> {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        Task_ID: taskId,
      },
      include: {
        User: {
          select: {
            ID: true,
            Full_Name: true,
            Username: true,
            Role: true,
          },
        },
      },
      orderBy: {
        Created_At: "asc",
      },
    });

    return comments as unknown as CommentData[];
  } catch (error) {
    console.error("getTaskComments error:", error);
    return [];
  }
}

/**
 * Server Action 2: Post a new comment to a task as the authenticated user
 */
export async function createCommentAction(
  taskId: number,
  content: string
): Promise<CommentActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.User_ID) {
      return {
        success: false,
        message: "Unauthorized: You must be logged in to comment.",
      };
    }

    const trimmedContent = content?.trim();
    if (!trimmedContent) {
      return {
        success: false,
        message: "Comment content cannot be empty.",
      };
    }

    const newComment = await prisma.comment.create({
      data: {
        Task_ID: taskId,
        User_ID: session.user.User_ID,
        Content: trimmedContent,
      },
      include: {
        User: {
          select: {
            ID: true,
            Full_Name: true,
            Username: true,
            Role: true,
          },
        },
      },
    });

    // Revalidate paths for immediate real-time feedback
    revalidatePath("/employee/dashboard");
    revalidatePath("/employee/my-tasks");
    revalidatePath("/manager/dashboard");
    revalidatePath("/manager/tasks");

    return {
      success: true,
      comment: newComment as unknown as CommentData,
      message: "Comment added.",
    };
  } catch (error: any) {
    console.error("createCommentAction error:", error);
    return {
      success: false,
      message: error?.message || "Failed to add comment.",
    };
  }
}
