import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/workflow",
  "/workflow/list",
  "/workflow/create",
  "/workflow/edit",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("AUTH_TOKEN_KEY")?.value;
  const userId = request.cookies.get("USER_ID")?.value;

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 👉 Redirect `/` to `/workflow/list`
  if (pathname === "/") {
    url.pathname = "/workflow/list";
    return NextResponse.redirect(url);
  }

  // 👉 Redirect `/auth` to `/auth/login`
  if (pathname === "/auth") {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // 🔐 Protected route check
  if (isProtected) {
    if (!token || !userId) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    // Normalize `/workflow` to `/workflow/list`
    if (pathname === "/workflow") {
      url.pathname = "/workflow/list";
      return NextResponse.redirect(url);
    }
  }

  // 🔁 Prevent access to login/signup when logged in
  if (pathname === "/auth/login" || pathname === "/auth/signup") {
    if (token && userId) {
      url.pathname = "/workflow/list";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth", "/auth/login", "/auth/signup", "/workflow/:path*"],
};
