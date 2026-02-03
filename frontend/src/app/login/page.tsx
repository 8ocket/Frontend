'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// TODO: 백엔드에서 소셜 로그인 URL 받으면 수정
const KAKAO_LOGIN_URL = process.env.NEXT_PUBLIC_API_URL + '/auth/kakao';
const GOOGLE_LOGIN_URL = process.env.NEXT_PUBLIC_API_URL + '/auth/google';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_LOGIN_URL;
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">MindLog</CardTitle>
          <CardDescription>소셜 계정으로 간편하게 시작하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleKakaoLogin}
            className="w-full bg-[#FEE500] text-black hover:bg-[#FDD800]"
          >
            카카오로 시작하기
          </Button>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full"
          >
            Google로 시작하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
