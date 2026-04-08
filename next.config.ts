import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // React Strict Mode (개발 시 잠재적 문제 감지)
  reactStrictMode: true,

  // Docker 배포용 standalone 출력 (이미지 크기 최소화)
  output: 'standalone',

  // 이미지 최적화 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com', // Google 프로필 이미지
      },
      {
        protocol: 'https',
        hostname: '**.kakaocdn.net', // 카카오 프로필 이미지
      },
      {
        protocol: 'https',
        hostname: 'www.figma.com', // Figma 디자인 asset
      },
      {
        protocol: 'https',
        hostname: '*.s3.ap-northeast-2.amazonaws.com', // S3 프로필/페르소나 이미지
      },
    ],
  },

  // 보안 헤더
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // 환경변수 검증 (빌드 시 필수 환경변수 확인)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // API 프록시 설정 (middleware 대신 rewrites 사용)
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
