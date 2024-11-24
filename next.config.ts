/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:3000/api/:path*',
          },
        ]
      : [
          {
            source: '/api/:path*',
            destination: 'https://api.allcaps.lol/api/:path*',  // Your production API
          },
        ];
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;