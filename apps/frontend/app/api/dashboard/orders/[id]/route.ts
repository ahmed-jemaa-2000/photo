import { getAuthToken, getUserShopId } from '@/lib/auth-server';
import { getStrapiURL } from '@/lib/strapi';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shopId = await getUserShopId(token);
    if (!shopId) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Verify order belongs to shop
    const verifyRes = await fetch(`${getStrapiURL()}/api/orders/${params.id}?populate=shop`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = await verifyRes.json();
    if (orderData.data.attributes.shop.data.id !== shopId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update order
    const updateRes = await fetch(`${getStrapiURL()}/api/orders/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: { status },
      }),
    });

    if (!updateRes.ok) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: updateRes.status });
    }

    const updatedOrder = await updateRes.json();
    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
