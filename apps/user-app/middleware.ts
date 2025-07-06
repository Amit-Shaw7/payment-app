import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const unProtectedRoutes = ["/login", "/"];

export async function middleware(request: NextRequest) {

  if (unProtectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;
  if (token) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

// crate a matcher that only works for pages not for apis
export const config = {
  matcher: "/((?!api/).*)",
};
