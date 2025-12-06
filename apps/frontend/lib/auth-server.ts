import { cookies } from 'next/headers';
import type { User } from '@busi/types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Get current user from JWT token (server-side)
 */
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
        return null;
    }

    try {
        const response = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
            headers: {
                'Authorization': `Bearer ${token.value}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

/**
 * Get auth token from cookies (server-side)
 */
export async function getAuthToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    return token?.value;
}

/**
 * Verify if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return user !== null;
}

/**
 * Get user's shop ID (server-side)
 */
export async function getUserShopId(token: string): Promise<number | null> {
    try {
        const userRes = await fetch(`${STRAPI_URL}/api/users/me?populate=shops`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!userRes.ok) {
            return null;
        }

        const user = await userRes.json() as any;

        if (!user?.id) {
            return null;
        }

        // Prefer shops populated on the user (more reliable for multi-tenant)
        if (Array.isArray(user.shops) && user.shops.length > 0) {
            return user.shops[0].id;
        }

        const response = await fetch(
            `${STRAPI_URL}/api/shops?filters[owner][id][$eq]=${user.id}&fields[0]=id`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            return data.data[0].id;
        }

        return null;
    } catch (error) {
        console.error('Error fetching user shop:', error);
        return null;
    }
}
