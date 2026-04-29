import { NextResponse, type NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("jwt")?.value

  // Protect consumer routes
  if (pathname.startsWith("/consumer")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url))
    }
  }

  // Protect technician routes
  if (pathname.startsWith("/technician")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url))
    }
  }

  // Redirect ke dashboard kalau sudah login tapi akses /auth
  if (pathname === "/auth" && token) {
    return NextResponse.redirect(
      new URL("/consumer/dashboard", request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/consumer/:path*",
    "/technician/:path*",
    "/auth",
  ],
}