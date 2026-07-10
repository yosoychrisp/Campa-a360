/** @type {import('next').NextConfig} */
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://backend:8000";
// Si Render nos da solo el hostname (sin protocolo), le anteponemos https automáticamente.
const apiUrl = rawApiUrl.startsWith("http") ? rawApiUrl : `https://${rawApiUrl}`;

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
