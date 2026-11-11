import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.User_ID = user.User_ID;
        token.Role = user.Role;
        token.Username = user.Username;
        token.Full_Name = user.Full_Name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.User_ID = token.User_ID as number;
        session.user.Role = token.Role as any;
        session.user.Username = token.Username as string;
        session.user.Full_Name = token.Full_Name as string;
      }
      return session;
    },
  },
  providers: [], // Configured with Credentials in auth.ts
};
