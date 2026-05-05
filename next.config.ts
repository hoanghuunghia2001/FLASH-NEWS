import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Đăng ký hostname này
      },
      {
        protocol: 'https',
        hostname: 'vcdn1-kinhdoanh.vnecdn.net', // Thêm luôn cái này cho ảnh từ VnExpress
      },
      {
        protocol: 'https',
        hostname: 'vcdn1-giaitri.vnecdn.net', // Các subdomain khác của VnExpress
      },
      {
        protocol: 'https',
        hostname: '*.vnecdn.net', // Hoặc dùng wildcard cho tất cả subdomain của VnExpress
      },
      {
        protocol: 'https',
        hostname: '**.vnecdn.net', // Cho ảnh từ VnExpress
      },
       {
        protocol: 'https',
        hostname: '**.vnncdn.net', // Cho ảnh từ VnExpress
      },
    ],
  },
};

export default nextConfig;