import { NextResponse } from 'next/server';

export function middleware(req) {
    // Try multiple ways to get the token
    const sessionCookie = req.cookies.get('session_token');
    const tokenValue = sessionCookie?.value;
    
    // Also try getting from request headers as fallback
    const cookieHeader = req.headers.get('cookie');
    
    const url = req.nextUrl.clone();

    console.log('Middleware Debug:', {
        pathname: url.pathname,
        hasSessionCookie: !!sessionCookie,
        tokenValue: tokenValue || 'No token',
        cookieHeader,
        allCookies: req.cookies.getAll()
    });

    // Simple token validation - check if token exists and has basic JWT structure
    let isValidToken = false;
    if (tokenValue) {
        try {
            // Basic JWT structure check (should have 3 parts separated by dots)
            const parts = tokenValue.split('.');
            if (parts.length === 3) {
                // Basic validation - token exists and has JWT structure
                isValidToken = true;
                console.log('Token has valid JWT structure');
            }
        } catch (error) {
            console.log('Token validation error:', error.message);
            isValidToken = false;
        }
    }

    console.log('isValidToken:', isValidToken);

    if (url.pathname.startsWith('/login') && isValidToken) {
        console.log('Redirecting from login to admin');
        url.pathname = '/admin';
        return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith('/admin') && !isValidToken) {
        console.log('Redirecting from admin to login');
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith('/api/') && !isValidToken) {
        const PrivateApis = ['/api/logout', '/api/profile', '/api/project', '/api/resume', '/api/revalidate', '/api/skill', '/api/updateOrder'];
        const isPrivateApi = PrivateApis.some(path => url.pathname.startsWith(path));

        if (isPrivateApi) {
            console.log('Blocking access to private API:', url.pathname);
            return NextResponse.json(
                { message: 'Unauthorized access. Session expired or invalid.', success: false },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login', '/api/:path*'],
};
