import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserShopId } from '@/lib/auth-server';
import { getShopById, updateShop, deleteFile } from '@/lib/strapi';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const dynamic = 'force-dynamic';

// GET - Fetch current shop
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

    const shop = await getShopById(shopId, token);

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    return NextResponse.json(shop);
  } catch (error: any) {
    console.error('Error fetching shop:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update shop settings
export async function PUT(request: NextRequest) {
  console.log('PUT /api/dashboard/shop started');
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      console.log('No token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shopId = await getUserShopId(token);
    console.log('Shop ID:', shopId);

    if (!shopId) {
      return NextResponse.json({ error: 'No shop found' }, { status: 400 });
    }

    // Get FormData from request
    const formData = await request.formData();
    console.log('FormData received');

    // Parse the data JSON
    const dataStr = formData.get('data') as string;
    if (!dataStr) {
      return NextResponse.json({ error: 'Missing shop data' }, { status: 400 });
    }

    const data = JSON.parse(dataStr);
    console.log('Parsed data:', data);

    // Handle logo upload if present
    const logoFile = formData.get('files.logo');

    let response;

    if (logoFile) {
      console.log('Logo file present, using FormData');
      // Create FormData for Strapi
      const strapiFormData = new FormData();
      strapiFormData.append('data', JSON.stringify(data));

      // Get current shop to delete old logo if exists
      const currentShop = await getShopById(shopId, token);
      if (currentShop?.logo) {
        try {
          await deleteFile(currentShop.logo.id, token);
        } catch (error) {
          console.error('Failed to delete old logo:', error);
          // Continue even if delete fails
        }
      }

      strapiFormData.append('files.logo', logoFile);

      console.log('Sending FormData to Strapi...');
      response = await fetch(`${STRAPI_URL}/api/shops/${shopId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: strapiFormData,
      });
    } else {
      console.log('No logo file, using JSON');
      console.log('Sending JSON to Strapi...');
      response = await fetch(`${STRAPI_URL}/api/shops/${shopId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
    }

    console.log('Strapi response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('Strapi error:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: error.error?.message || 'Failed to update shop' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error updating shop:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
