import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1️⃣ Not logged in at all
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // 2️⃣ Restrict admin routes to admin users
    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Ensure the middleware runs even when token is null
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/my-registrations/:path*',
    '/events/:path*/register',
  ],
};









// import { withAuth } from 'next-auth/middleware';
// import { NextResponse } from 'next/server';

// export default withAuth(
//   function middleware(req) {
//     const token = req.nextauth.token;
//     const path = req.nextUrl.pathname;

//     // Check if trying to access admin routes
//     if (path.startsWith('/admin')) {
//       if (token?.role !== 'admin') {
//         return NextResponse.redirect(new URL('/dashboard', req.url));
//       }
//     }

//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/admin/:path*',
//     '/my-registrations/:path*',
//     '/events/:path*/register',
//   ],
// };