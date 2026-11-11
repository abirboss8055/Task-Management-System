import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding initial users for Comrades Legacy...");

  const managerPasswordHash = await bcrypt.hash("captain123", 10);
  const employeePasswordHash = await bcrypt.hash("employee123", 10);

  // 1. Manager User (captain)
  const manager = await prisma.user.upsert({
    where: { Username: "captain" },
    update: {
      Password_Hash: managerPasswordHash,
      Role: Role.MANAGER,
    },
    create: {
      Full_Name: "Captain Abir",
      Username: "captain",
      Password_Hash: managerPasswordHash,
      Role: Role.MANAGER,
    },
  });

  // 2. Employee User (employee)
  const employee = await prisma.user.upsert({
    where: { Username: "employee" },
    update: {
      Password_Hash: employeePasswordHash,
      Role: Role.EMPLOYEE,
    },
    create: {
      Full_Name: "Comrades Staff",
      Username: "employee",
      Password_Hash: employeePasswordHash,
      Role: Role.EMPLOYEE,
    },
  });

  console.log("Seeding complete:");
  console.log(" - Manager user created:", manager.Username, `(Role: ${manager.Role})`);
  console.log(" - Employee user created:", employee.Username, `(Role: ${employee.Role})`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
