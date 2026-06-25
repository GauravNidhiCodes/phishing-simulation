import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip middleware checks for auth pages, API authentication, mock simulation landing page, next resources, and favicons
  if (
    pathname.startsWith('/auth') || 
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/simulation') || 
    pathname.startsWith('/_next') || 
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Fetch the session cookie
  const sessionCookie = request.cookies.get('pinkman_session')?.value;

  if (!sessionCookie) {
    // Session is invalid/expired -> Redirect to login page
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    // 3. Decode session payload
    const decodedString = Buffer.from(sessionCookie, 'base64').toString('utf-8');
    const userSession = JSON.parse(decodedString);
    const role = userSession.role;

    // 4. Role-based route protection on /admin/*
    if (pathname.startsWith('/admin')) {
      
      // Employees are strictly restricted to /learning
      if (role === 'EMPLOYEE') {
        return NextResponse.redirect(new URL('/auth/access-denied', request.url));
      }

      // Security Administrator - manage campaigns, templates, analytics, reports. No employee registry.
      if (role === 'SECURITY_ADMIN') {
        if (pathname.startsWith('/admin/employees')) {
          return NextResponse.redirect(new URL('/auth/access-denied', request.url));
        }
      }

      // HR Manager - employee progress, reports, analytics. No campaigns or template builders.
      if (role === 'HR_MANAGER') {
        if (
          pathname.startsWith('/admin/campaigns') || 
          pathname.startsWith('/admin/templates')
        ) {
          return NextResponse.redirect(new URL('/auth/access-denied', request.url));
        }
      }

      // Department Manager - team analytics, reports, learning progress. No campaigns, templates, employees list.
      if (role === 'DEPT_MANAGER') {
        if (
          pathname.startsWith('/admin/campaigns') || 
          pathname.startsWith('/admin/templates') || 
          pathname.startsWith('/admin/employees')
        ) {
          return NextResponse.redirect(new URL('/auth/access-denied', request.url));
        }
      }
    }

  } catch (err) {
    // Corrupted session cookie -> delete and redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('pinkman_session');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/learning/:path*',
    '/reports/:path*',
    '/analytics/:path*',
    '/campaigns/:path*',
    '/employees/:path*',
    '/templates/:path*',
    '/settings/:path*'
  ]
};
