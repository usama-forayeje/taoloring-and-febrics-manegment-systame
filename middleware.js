import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Auth routes - redirect if already logged in
  if (pathname.startsWith('/')) {
    // Check if user has session cookie
    const hasSession = request.cookies.has('a_session_console') || 
                      request.cookies.has('a_session_console_legacy');
    
    if (hasSession && !pathname.includes('/callback')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Protected routes
  const protectedRoutes = ['/dashboard', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const hasSession = request.cookies.has('a_session_console') || 
                      request.cookies.has('a_session_console_legacy');

    if (!hasSession) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*'
  ]
};