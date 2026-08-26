import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "mednet_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET environment variable is required");
    }
    return new TextEncoder().encode("med-net-dev-secret-do-not-use-in-production");
  }
  return new TextEncoder().encode(secret);
}

async function isValidSession(token: string | undefined) {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  const isLogin = pathname === "/admin/login";
  const authenticated = await isValidSession(token);

  if (!authenticated && !isLogin) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("from", pathname + search);
    return NextResponse.redirect(url);
  }

  if (authenticated && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
