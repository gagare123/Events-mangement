import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow unauthenticated access to public pages
    const publicPaths = ["/", "/login", "/signup", "/events"];
    if (publicPaths.includes(path)) {
      return NextResponse.next();
    }

    // 1️⃣ Not logged in at all
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 2️⃣ Restrict admin routes to admin users only
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Always run middleware, even if no token
    },
  }
);

// ✅ Only apply middleware to these secure routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/my-registrations/:path*",
    "/events/:path*/register",
  ],
};

