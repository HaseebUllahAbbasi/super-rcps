import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "./apis/auth-apis"

// Define which paths require authentication
const protectedPaths = ["/dashboard", "/admins", "/divisions", "/statuses", "/profile", "/settings"] 

// Define paths that should be accessible only to non-authenticated users
const authPaths = ["/", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // const admin_token = request.cookies.get("auth-token")?.value;
  const {success:token}=await getCurrentUser();

  
  // Check if the path is protected and user is not authenticated
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !token) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.some((path) => pathname === path) && token) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

