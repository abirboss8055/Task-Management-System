import { Role as UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    User_ID?: number;
    Role?: UserRole;
    Username?: string;
    Full_Name?: string;
  }

  interface Session {
    user: {
      User_ID: number;
      Role: UserRole;
      Username?: string;
      Full_Name?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    User_ID?: number;
    Role?: UserRole;
    Username?: string;
    Full_Name?: string;
  }
}
