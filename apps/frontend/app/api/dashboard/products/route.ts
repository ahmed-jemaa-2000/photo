import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserShopId } from '@/lib/auth-server';
import { getProductsByShop } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const shopId = await getUserShopId(token);

        if (!shopId) {
            return NextResponse.json({ error: 'No shop found' }, { status: 400 });
        }

        // Fetch only active products for the order form
        const products = await getProductsByShop(shopId, {
            token,
            active: true
        });

        return NextResponse.json(products);
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
