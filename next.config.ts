import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pkp.go.id",
      },
      {
        protocol: "https",
        hostname: "website-perumahan.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
}

export default nextConfig
