import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === "/admin/login" || 
    !path.startsWith("/admin");
  
  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
  });
  
  // Redirect logic for admin paths
  if (path.startsWith("/admin")) {
    // If user is not logged in and trying to access protected admin route
    if (!token && !isPublicPath) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    // If user is logged in but doesn't have admin role
    if (token && token.role !== "admin" && !isPublicPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    // If user is logged in and trying to access login page
    if (token && path === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }
  
  return NextResponse.next();
}
