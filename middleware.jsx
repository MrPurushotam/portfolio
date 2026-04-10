import { NextResponse } from 'next/server';

/**
 * Enforces session-based routing and API access rules for incoming requests.
 * @param {import('next/server').NextRequest} req - Incoming Next.js request.
 * @returns {import('next/server').NextResponse} A response that redirects authenticated users away from /login to /admin, redirects unauthenticated users from /admin to /login, returns a 401 JSON for blocked private API routes when unauthenticated (except `GET /api/resume`), or continues the request chain.
 */
export function middleware(req) {
    const sessionCookie = req.cookies.get('session_token');
    const tokenValue = sessionCookie?.value;
    const cookieHeader = req.headers.get('cookie');

    const url = req.nextUrl.clone();
    let isValidToken = false;
    if (tokenValue) {
        isValidToken = true;
    }
    if (url.pathname.startsWith('/login') && isValidToken) {
        url.pathname = '/admin';
        return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith('/admin') && !isValidToken) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith('/api/') && !isValidToken) {
        const PrivateApis = ['/api/logout', '/api/profile', '/api/project', '/api/resume', '/api/revalidate', '/api/skill', '/api/updateOrder'];
        const isPublicResumeRead = url.pathname === '/api/resume' && req.method === 'GET';
        const isPrivateApi = !isPublicResumeRead && PrivateApis.some(path => url.pathname.startsWith(path));

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
