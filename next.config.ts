/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/ws',
        destination: '/ws' // Let WebSocket requests bypass the rewrite
      },
      {
        source: '/api/:path*',
        destination: 'https://api.allcaps.lol/api/:path*', // Production API
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ipfs.nftstorage.link',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'arweave.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',  // Remove the /* from hostname
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gateway.irys.xyz',  // Remove the /* from hostname
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.nftstorage.link',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.filebase.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ore.supply',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ore.supply',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      }
    ]
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;