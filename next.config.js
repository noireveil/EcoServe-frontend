const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Menambahkan turbopack kosong agar Next.js 16 mengabaikan bentrok Webpack
  turbopack: {},

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://ecoserve-api.onrender.com/api/:path*",
      },
    ]
  },
}

module.exports = withPWA(nextConfig)