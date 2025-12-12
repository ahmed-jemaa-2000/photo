import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

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

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Cache-Control': 'no-store',
  };
}

function getStrapiUrl() {
  const raw = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return raw.replace(/\/+$/, '');
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401, headers });
    }

    const response = await fetch(`${getStrapiUrl()}/api/ai-generations/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const bodyText = await response.text();
    const body = (() => {
      try {
        return JSON.parse(bodyText);
      } catch {
        return { error: bodyText || 'Unexpected response from Strapi' };
      }
    })();

    return NextResponse.json(body, { status: response.status, headers });
  } catch (error) {
    console.error('AI generations proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch generations' }, { status: 500, headers });
  }
}

