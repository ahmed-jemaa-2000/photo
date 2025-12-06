import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserShopId } from '@/lib/auth-server';
import { getOrdersByShop } from '@/lib/strapi';

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

    const orders = await getOrdersByShop(shopId, token);

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { customerName, customerPhone, items, notes } = body;

    // Basic validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must have at least one item' },
        { status: 400 }
      );
    }

    // Import createOrder dynamically to avoid circular dependencies if any, 
    // or just import it at the top if not already there.
    // Checking imports... we need to add createOrder to imports.
    const { createOrder } = await import('@/lib/strapi');

    const orderData = {
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '',
      items: items.map((item: any) => ({
        product: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        size: item.size,
        color: item.color,
      })),
      shop: shopId,
      status: 'pending', // Start in pending; workflow will move to confirmed -> shipped -> delivered -> completed
      paymentMethod: 'cod', // Default for manual entry
      notes: notes || 'Manual entry from dashboard',
      publishedAt: new Date().toISOString(),
    };

    const newOrder = await createOrder({ data: orderData } as any, token);

    return NextResponse.json(newOrder);
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
