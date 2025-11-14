import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect admin routes
  if (path.startsWith("/admin")) {
    // Allow access to login page
    if (path === "/admin/login") {
      return NextResponse.next();
    }
    
    // Get the session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
    });
    
    // If user is not logged in, redirect to admin login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    // If user is logged in but doesn't have admin role, redirect to home
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    // If user is logged in and trying to access login page, redirect to admin dashboard
    if (token && path === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }
  
  return NextResponse.next();
}
