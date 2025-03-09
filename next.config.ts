import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // 静的ファイルとして出力
  images: {
    unoptimized: true, // Cloudflareではデフォルトの画像最適化が使えないため
  },
};

export default nextConfig;
