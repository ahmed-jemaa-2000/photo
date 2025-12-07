/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.brandili.shop',
        pathname: '/uploads/**',
      },
    ],
  },
  transpilePackages: ['@busi/types'],
  productionBrowserSourceMaps: false,
};

export default nextConfig;
