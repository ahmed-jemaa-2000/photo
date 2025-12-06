import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { jwt, user } = await request.json();

    if (!jwt || !user) {
      return NextResponse.json(
        { error: 'Missing JWT or user data' },
        { status: 400 }
      );
    }

    const isProduction = process.env.NODE_ENV === 'production';

    // Set httpOnly cookie for security
    // In production, set domain to .brandini.tn to share across subdomains
    // (dashboard.brandini.tn and studio.brandini.tn)
    const cookieStore = await cookies();
    cookieStore.set('auth_token', jwt, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      // Domain for cross-subdomain SSO in production
      ...(isProduction && { domain: '.brandini.tn' }),
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
