import { NextResponse } from 'next/server';
import { getStrapiURL } from '@/lib/strapi';

const PHONE_REGEX = /^[+]?[0-9]{8,15}$/;

const normalizePhone = (phone: string) => {
    const trimmed = (phone || '').trim();
    const digits = trimmed.replace(/\D/g, '');
    return trimmed.startsWith('+') ? `+${digits}` : digits;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const customerName = (body.customerName || '').toString().trim();
        const customerPhone = normalizePhone((body.customerPhone || '').toString());
        const customerAddress = (body.customerAddress || '').toString().trim();
        const shopId = Number(body.shopId);
        const rawItems = Array.isArray(body.items) ? body.items : [];

        // Basic validation aligned with Strapi schema
        if (!customerName || customerName.length < 2) {
            return NextResponse.json(
                { error: 'Customer name is required' },
                { status: 400 }
            );
        }

        if (customerName.length > 100) {
            return NextResponse.json(
                { error: 'Customer name must be 100 characters or less' },
                { status: 400 }
            );
        }

        if (!PHONE_REGEX.test(customerPhone)) {
            return NextResponse.json(
                { error: 'A valid phone number is required' },
                { status: 400 }
            );
        }

        if (!shopId || Number.isNaN(shopId) || shopId < 1) {
            return NextResponse.json(
                { error: 'Shop id is required' },
                { status: 400 }
            );
        }

        const items = rawItems
            .filter((item: any) => item?.productId && item?.quantity > 0 && item?.price >= 0)
            .map((item: any) => ({
                productId: Number(item.productId),
                quantity: Number(item.quantity) || 1,
                price: Number(item.price) || 0,
                size: item.size,
                color: item.color,
            }));

        if (items.length === 0) {
            return NextResponse.json(
                { error: 'At least one valid item is required' },
                { status: 400 }
            );
        }

        // transform items to match Strapi component structure if needed
        // Based on schema: items is a component "order.order-item"
        // It expects: product (relation), quantity, unitPrice, totalPrice, size, color

        const orderData = {
            data: {
                customerName,
                customerPhone,
                customerAddress: customerAddress || undefined,
                items: items.map((item: any) => ({
                    product: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    totalPrice: item.price * item.quantity,
                    size: item.size,
                    color: item.color,
                })),
                shop: shopId,
                status: 'pending',
                paymentMethod: 'cod', // Default to Cash on Delivery for WhatsApp orders
                notes: 'Order via WhatsApp',
            },
        };

        // We need to use a token that has permission to create orders.
        // Since this is a public storefront, we might need a specific API token or use a public role.
        // For now, I'll assume we can use the backend internal API or a configured public permission.
        // If we need an API token, we should use process.env.STRAPI_API_TOKEN

        const token = process.env.STRAPI_API_TOKEN;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${getStrapiURL()}/api/orders`, {
            method: 'POST',
            headers,
            body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('Strapi Order Create Error:', data);
            return NextResponse.json(
                { error: data.error?.message || 'Failed to create order' },
                { status: res.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Order API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
