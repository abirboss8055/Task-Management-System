import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.Role;
  const { pathname } = req.nextUrl;

  const isManagerRoute = pathname.startsWith("/manager");
  const isEmployeeRoute = pathname.startsWith("/employee");

  // 1. Redirect unauthenticated users to /login
  if (!isLoggedIn && (isManagerRoute || isEmployeeRoute)) {
    const callbackUrl = encodeURIComponent(pathname + req.nextUrl.search);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
  }

  // 2. If a user with the EMPLOYEE role attempts to access /manager/*, redirect to /employee/dashboard
  if (isManagerRoute && userRole === "EMPLOYEE") {
    return NextResponse.redirect(new URL("/employee/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths under /manager and /employee
     */
    "/manager/:path*",
    "/employee/:path*",
  ],
};
