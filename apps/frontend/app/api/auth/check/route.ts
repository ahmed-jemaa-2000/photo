import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Allowed origins for CORS (AI Studio ports)
const ALLOWED_ORIGINS = [
    'http://localhost:3002',
    'http://127.0.0.1:3002',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Production domains
    'https://studio.brandili.shop',
    'https://dashboard.brandili.shop',
    'https://brandili.shop',
];

/**
 * Get CORS headers with proper origin handling for credentials
 */
function getCorsHeaders(origin: string | null): Record<string, string> {
    const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    };
}

/**
 * OPTIONS /api/auth/check - Handle preflight for CORS
 */
export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

/**
 * GET /api/auth/check
 * 
 * Returns current authentication status and token for client components
 * Since httpOnly cookies can't be read client-side, this provides a way to check auth
 */
export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    const headers = getCorsHeaders(origin);

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({
                authenticated: false,
                token: null,
            }, { headers });
        }

        // Validate token by calling Strapi
        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        const response = await fetch(`${STRAPI_URL}/api/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json({
                authenticated: false,
                token: null,
            }, { headers });
        }

        const user = await response.json();

        return NextResponse.json({
            authenticated: true,
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        }, { headers });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({
            authenticated: false,
            token: null,
        }, { headers });
    }
}
