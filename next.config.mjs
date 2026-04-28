import { createRequire } from "module"
const nodeRequire = createRequire(import.meta.url)
const withPWA = nodeRequire("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
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

<<<<<<< Updated upstream:next.config.js
module.exports = withPWA(nextConfig)
=======
export default withPWA(nextConfig)
>>>>>>> Stashed changes:next.config.mjs
