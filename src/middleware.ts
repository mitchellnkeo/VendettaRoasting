import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Middleware can be used for future route protection if needed
  return NextResponse.next();
}
