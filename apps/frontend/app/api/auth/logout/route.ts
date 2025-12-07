import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const isProduction = process.env.NODE_ENV === 'production';

    // Delete auth cookie - must use same options as when it was set
    const cookieStore = await cookies();

    // Delete the cookie by setting it with expired maxAge
    // Must match the domain used when setting the cookie
    cookieStore.set('auth_token', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
      ...(isProduction && { domain: '.brandili.shop' }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
