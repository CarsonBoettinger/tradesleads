import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      {
        source: "/trades/builders",
        destination: "/trades/general-contractors",
        permanent: true,
      },
      {
        source: "/trades/butcher",
        destination: "/trades",
        permanent: true,
      },
      {
        source: "/trades/baker",
        destination: "/trades",
        permanent: true,
      },
      {
        source: "/trades/brewing",
        destination: "/trades",
        permanent: true,
      },
      {
        source: "/trades/commercial-kitchen-equipment-repair",
        destination: "/trades",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
