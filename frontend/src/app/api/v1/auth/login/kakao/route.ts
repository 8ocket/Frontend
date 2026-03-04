import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: '인가 코드가 필요합니다' }, { status: 400 });
    }

    // 백엔드 API로 코드 전달
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';

    const response = await fetch(`${backendUrl}/api/v1/auth/login/kakao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || '인증 실패' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Kakao login error:', error);
    return NextResponse.json({ error: '로그인 실패' }, { status: 500 });
  }
}
