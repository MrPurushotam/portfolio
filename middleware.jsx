import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
    const token = req.cookies.get('session_token');
    const url = req.nextUrl.clone();

    function isTokenValid(token) {
        if (!token) return false;

        try {
            jwt.verify(token.value, process.env.JWT_SECRET);
            return true;
        } catch (error) {
            console.log('Token validation failed:', error.message);
            return false;
        }
    }
    const isValidToken = isTokenValid(token);

    if (url.pathname.startsWith('/login') && isValidToken) {
        url.pathname = '/admin';
        return NextResponse.redirect(url);
    }
    if (url.pathname.startsWith('/admin') && !isValidToken) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith('/api/') && !isValidToken) {
        const PrivateApis = ['/api/logout/', '/api/profile/', '/api/project', '/api/resume', '/api/revalidate', '/api/skill', '/api/updateOrder'];
        const isPrivateApi = PrivateApis.some(path => url.pathname.startsWith(path));

        if (isPrivateApi) {
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
