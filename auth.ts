import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const username = String(credentials.username).trim();
        const password = String(credentials.password);

        // 1. Verify user against User Prisma model by Username
        const user = await prisma.user.findUnique({
          where: {
            Username: username,
          },
        });

        if (!user || !user.Password_Hash) {
          return null;
        }

        // 2. Verify password against Password_Hash
        const isValidPassword = await bcrypt.compare(password, user.Password_Hash);
        if (!isValidPassword) {
          return null;
        }

        // 3. Return user data with Role and User_ID for session & JWT
        return {
          id: String(user.ID),
          User_ID: user.ID,
          Role: user.Role,
          Username: user.Username,
          Full_Name: user.Full_Name,
          name: user.Full_Name,
        };
      },
    }),
  ],
});
