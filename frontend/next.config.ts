import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Strict Mode (개발 시 잠재적 문제 감지)
  reactStrictMode: true,

  // 이미지 최적화 설정
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com", // Google 프로필 이미지
      },
      {
        protocol: "https",
        hostname: "**.kakaocdn.net", // 카카오 프로필 이미지
      },
      // 필요시 백엔드 이미지 서버 추가
      // {
      //   protocol: "https",
      //   hostname: "api.mindlog.com",
      // },
    ],
  },

  // 보안 헤더
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // 환경변수 검증 (빌드 시 필수 환경변수 확인)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
