import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Extract hostname without port
  const hostname = host.split(':')[0];
  const parts = hostname.split('.');

  // Determine if this is a subdomain request
  // For production: *.brandili.shop (3+ parts, not dashboard/api)
  // For development: *.brandini.test (3+ parts, not dashboard/api)
  const isDevelopment = hostname.includes('.test') || hostname.includes('localhost');
  const baseDomain = isDevelopment ? '.brandini.test' : '.brandili.shop';
  const minParts = isDevelopment || hostname.includes('.shop') ? 3 : 2;
  const isProd = process.env.NODE_ENV === 'production';

  const isSubdomain = parts.length >= minParts &&
    !hostname.startsWith('dashboard.') &&
    !hostname.startsWith('api.') &&
    !hostname.startsWith('studio.') &&
    !hostname.startsWith('www.');

  // STOREFRONT ROUTING (Subdomain-based)
  if (isSubdomain) {
    const subdomain = parts[0];

    // Skip API routes, static files, and Next.js internals
    if (
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/static/')
    ) {
      return NextResponse.next();
    }

    // Rewrite to storefront with subdomain in custom header
    const response = NextResponse.rewrite(new URL(pathname, request.url));
    response.headers.set('x-subdomain', subdomain);

    return response;
  }

  // AI STUDIO ROUTING (studio.brandini.*)
  if (hostname.startsWith('studio.')) {
    // In development, proxy to Vite dev server on port 3002
    // In production, serve the built AI studio app
    const aiStudioPort = process.env.AI_STUDIO_PORT || '3002';
    const aiApiPort = process.env.AI_API_PORT || '3001';

    // Skip Next.js internals and static files
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon.ico')
    ) {
      return NextResponse.next();
    }

    // Proxy API calls to AI API server
    if (pathname.startsWith('/api/')) {
      const aiApiUrl = new URL(pathname + url.search, `http://localhost:${aiApiPort}`);
      return NextResponse.rewrite(aiApiUrl);
    }

    // Proxy all other requests to AI Studio (Vite dev server)
    if (!isProd) {
      const aiStudioUrl = new URL(pathname + url.search, `http://localhost:${aiStudioPort}`);
      return NextResponse.rewrite(aiStudioUrl);
    }

    // In production, the AI studio will be served as static files
    // You can configure this to serve from a CDN or the same Next.js app
    return NextResponse.next();
  }

  // DASHBOARD ROUTING
  if (pathname.startsWith('/dashboard')) {
    // Only enforce dashboard subdomain in production to avoid dev redirect loops
    if (isProd && !hostname.startsWith('dashboard.')) {
      const dashboardUrl = new URL(request.url);
      dashboardUrl.host = `dashboard${baseDomain}`;
      return NextResponse.redirect(dashboardUrl);
    }

    // Check authentication for protected dashboard routes
    if (pathname !== '/dashboard/login') {
      const token = request.cookies.get('auth_token');

      if (!token) {
        // Redirect to login
        const loginUrl = new URL('/dashboard/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Optional: Verify token with Strapi
      // For now, we trust the cookie exists
      // You can add token verification here if needed
    }

    return NextResponse.next();
  }

  // MAIN DOMAIN ROUTING (brandili.shop or brandini.test)
  if (
    hostname === 'brandili.shop' ||
    hostname === 'brandini.test' ||
    hostname === 'localhost' ||
    hostname.startsWith('localhost:')
  ) {
    // Redirect main domain to dashboard
    if (pathname === '/' || pathname === '') {
      const dashboardUrl = new URL(request.url);
      dashboardUrl.host = `dashboard${baseDomain}`;
      dashboardUrl.pathname = '/dashboard';
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  }

  // Default: continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
