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
        hostname: 'api.brandini.tn',
        pathname: '/uploads/**',
      },
    ],
  },
  transpilePackages: ['@busi/types'],
};

export default nextConfig;
