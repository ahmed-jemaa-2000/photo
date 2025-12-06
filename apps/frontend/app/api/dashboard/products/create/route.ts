import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserShopId } from '@/lib/auth-server';
import { slugify } from '@/lib/slugify';
import { z } from 'zod';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const dynamic = 'force-dynamic';

// Define Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  slug: z.string().optional(),
  // Add other fields as necessary based on your Strapi model
});

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    console.log('[Create Product API] Token exists:', !!token);

    if (!token) {
      console.log('[Create Product API] No token found in cookies');
      return NextResponse.json({ error: 'Unauthorized - Please log in again' }, { status: 401 });
    }

    // Get user's shop ID
    const shopId = await getUserShopId(token);

    if (!shopId) {
      return NextResponse.json({ error: 'No shop found for user' }, { status: 400 });
    }

    // Get FormData from request
    const formData = await request.formData();

    // Parse the data JSON
    const dataStr = formData.get('data') as string;
    if (!dataStr) {
      return NextResponse.json({ error: 'Missing product data' }, { status: 400 });
    }

    let rawData;
    try {
      rawData = JSON.parse(dataStr);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON data' }, { status: 400 });
    }

    // Validate data with Zod
    const validationResult = productSchema.safeParse(rawData);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues.map((e: any) => e.message).join(', ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const data = validationResult.data;

    // Generate slug if not provided
    const finalSlug = data.slug || slugify(data.name) || `product-${Date.now()}`;

    // Prepare payload for Strapi
    const payload = {
      ...data,
      slug: finalSlug,
      shop: shopId,
    };

    console.log('[Create Product API] Sending to Strapi:', {
      shopId,
      dataKeys: Object.keys(payload),
      hasImages: formData.getAll('files.images').length > 0
    });

    // Create new FormData for Strapi
    const strapiFormData = new FormData();
    strapiFormData.append('data', JSON.stringify(payload));

    // Transfer image files
    const imageFiles = formData.getAll('files.images');
    imageFiles.forEach((file) => {
      strapiFormData.append('files.images', file);
    });

    // Send to Strapi
    const response = await fetch(`${STRAPI_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: strapiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Create Product API] Strapi error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      let error;
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        error = { error: { message: errorText || 'Failed to create product' } };
      }

      return NextResponse.json(
        { error: error.error?.message || 'Failed to create product' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
