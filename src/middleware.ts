import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  
  if (
    pathname.startsWith('/auth') || 
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/simulation') || 
    pathname.startsWith('/_next') || 
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  
  const sessionCookie = request.cookies.get('pinkman_session')?.value;

  if (!sessionCookie) {
    
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    
    const decodedString = Buffer.from(sessionCookie, 'base64').toString('utf-8');
    const userSession = JSON.parse(decodedString);
    const role = userSession.role;

    
    if (pathname.startsWith('/admin')) {
      
      
      if (role === 'EMPLOYEE') {
        return NextResponse.redirect(new URL('/auth/access-denied', request.url));
      }

      
      if (role === 'SECURITY_ADMIN') {
        if (pathname.startsWith('/admin/employees')) {
          return NextResponse.redirect(new URL('/auth/access-denied', request.url));
        }
      }

      
      if (role === 'HR_MANAGER') {
        if (
          pathname.startsWith('/admin/campaigns') || 
          pathname.startsWith('/admin/templates')
        ) {
          return NextResponse.redirect(new URL('/auth/access-denied', request.url));
        }
      }

      
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
