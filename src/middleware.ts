import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/account"];
const PRIVATE_ROUTES = ["/dashboard", "/profile", "/settings"];

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // If user has token and tries to access auth routes, redirect to dashboard
  if (token && AUTH_ROUTES.some((path) => pathname.startsWith(path))) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // If user has no token and tries to access private routes, redirect to login
  if (!token && PRIVATE_ROUTES.some((path) => pathname.startsWith(path))) {
    url.pathname = `/onboarding`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
