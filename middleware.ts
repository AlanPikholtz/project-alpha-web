import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login"];
// const privateRoutes = ["/dashboard"];

export function middleware({ nextUrl, cookies, url }: NextRequest) {
  const token = cookies.get("token")?.value;
  const isPublicPage = publicRoutes.some((page) =>
    nextUrl.pathname.startsWith(page)
  );

  // If user is on "/login" with a valid token, redirect to home
  if (token && nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", url));
  }

  // If no token & not on a public page, redirect to login
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
