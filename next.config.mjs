/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  trailingSlash: true,
  allowedDevOrigins: ['10.83.71.150'],
};

export default nextConfig;
