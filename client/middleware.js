import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
import checkAuth from '@/utils/checkAuth';

const protectedRoutes = [
    '/admin/dashboard',
    '/admin/category-manage',
    '/admin/skill-manage',
    '/admin/position-manage',
    '/admin/user-manage',
    '/admin/account/setting',
    '/employer/dashboard',
    '/employer/manage-jobs',
    '/employer/create-job',
    '/employer/edit-job',
    '/employer/all-applicants',
    '/employer/recommendation',
    '/employer/account/setting',
    '/account/setting-user-information',
    '/account/change-password',
    '/account/cv-manage',
    '/company/followed-company',
    '/job/applied-job',
    '/job/saved-job',
    '/job/recommend-job',
];

const authRoutes = ['/signin', '/register/employer', '/register/candidate', '/forgot-password', '/reset-password'];

export default function middleware(request) {
    const { pathname } = request.nextUrl.clone();

    /**
     * request.cookies not functioning correctly, it returns {"_parsed":{},"_headers":{}}
     * However request.headers.get('cookie') works as expected, it return all cookies
     * */
    // console.log(typeof request.headers.get('cookie'));
    const cookies = request.headers.get('cookie');
    // console.log(`cookies: ${cookies}`);

    let accessToken = null;
    if (cookies) {
        // Extract the accessToken from the cookies
        const accessTokenCookie = cookies
            .split(';')
            .map((row) => row.trim())
            .find((row) => row.startsWith('accessToken='));
        if (accessTokenCookie) {
            accessToken = accessTokenCookie.split('=')[1];
        }
    }
    // console.log(`accessToken: ${accessToken}`);

    // Check authentication status
    const authResult = checkAuth(accessToken);
    // console.log("authResult: ", authResult);

    // Redirect to root if not authenticated and trying to access protected routes
    if (!authResult?.authenticated && protectedRoutes.includes(pathname)) {
        // console.log('here 1!');
        return redirectToRoot(request);
    }

    // Redirect to root if authenticated and trying to access auth routes
    if (authResult?.authenticated && authRoutes.includes(pathname)) {
        // console.log('here 2!');
        return redirectToRoot(request);
    }

    // Role-based redirection logic
    if (authResult?.authenticated) {
        switch (authResult?.role) {
            case 1: // Job Seeker
                if (isEmployerOrAdminRoute(pathname)) {
                    // if access Employer Or Admin Route
                    // console.log("test1");
                    return redirectToRoot(request);
                }
                break;
            case 0: // Employer
                if (isAdminRoute(pathname)) {
                    // if access Admin Route
                    // console.log("test2");
                    return redirectToRoot(request);
                }
                break;
            case 2: // Admin
                if (isCompanyOrJobRelatedRoute(pathname)) {
                    // if access Employer or Job Route
                    // console.log("test3");
                    return redirectToAdmin(request);
                }
                break;
            default:
                break;
        }
    }
}

// Helper functions to check route categories
function isEmployerOrAdminRoute(pathname) {
    return pathname.includes('/employer') || pathname.includes('/admin');
}

function isAdminRoute(pathname) {
    return pathname.includes('/admin');
}

function isCompanyOrJobRelatedRoute(pathname) {
    return (
        pathname === '/' ||
        pathname === '/account/setting-user-information' ||
        pathname === '/account/change-password' ||
        pathname === '/account/cv-manage' ||
        pathname.includes('/employer') ||
        pathname.includes('/company') ||
        pathname.includes('/job')
    );
}

// Helper function to redirect to root
function redirectToRoot(request) {
    const absUrl = new URL('/', request.nextUrl.origin);
    const redirectResponse = NextResponse.redirect(absUrl.toString());
    redirectResponse.headers.set('x-middleware-cache', 'no-cache'); // ! FIX: Disable caching
    return redirectResponse;
}

function redirectToAdmin(request) {
    const absUrl = new URL('/admin/dashboard', request.nextUrl.origin);
    const redirectResponse = NextResponse.redirect(absUrl.toString());
    redirectResponse.headers.set('x-middleware-cache', 'no-cache'); // ! FIX: Disable caching
    return redirectResponse;
}
