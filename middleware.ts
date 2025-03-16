import { NextRequest, NextResponse } from "next/server";

// const publicRoutes = ["/login"];
// const privateRoutes = ["/dashboard"];

export function middleware({ nextUrl, cookies, url }: NextRequest) {
  const token = cookies.get("token")?.value;
  const isLoginPage = nextUrl.pathname.startsWith("/login");

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
