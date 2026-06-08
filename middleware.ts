import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  if (isAuthPage) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/admin', req.nextUrl));
    }
    return null;
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', req.nextUrl));
    }
    return null;
  }

  return null;
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
