'use client';

// 1번(배경 연장) + 3번(보안/법적 필수 정보) 통합 버전
// 비회원 및 회원 모두에게 안정감을 주는 클린 엔딩 구조입니다.

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/user/store';

export function FooterCTASection() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleCTA = () => {
    router.push(isAuthenticated ? '/chat' : '/login');
  };

  return (
    // min-h-screen을 사용하여 아랫 공간을 충분히 확보합니다.
    <section className="relative flex w-full flex-col items-center justify-center pt-32 pb-24">
      {/* 배경 레이어 — -bottom-32로 푸터 영역까지 연장 */}
      <div className="absolute inset-x-0 top-0 -bottom-32 z-0">
        {/* 물결 패턴 */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.85,
            backgroundImage: "url('/images/backgrounds/brandInfo-bg.png')",
            backgroundSize: '120%',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(248,250,252,0.82) 0%, rgba(248,250,252,0.35) 55%, transparent 80%)',
          }}
        />
        {/* 상단 페이드 */}
        <div className="absolute inset-x-0 top-0 h-[20vh] bg-linear-to-b from-[#F8FAFC] to-transparent" />
        {/* 하단 페이드 */}
        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-linear-to-t from-[#F8FAFC] to-transparent" />
      </div>

      {/* 콘텐츠 영역 */}
      <div
        className="relative z-10 flex flex-col items-center px-4 text-center"
        style={{ width: '100%', maxWidth: 1077 }}
      >
        {/* 메인 메시지 및 버튼 */}
        <div className="mb-12 flex flex-col items-center gap-6">
          <h2 className="font-sans text-[44px] leading-[1.35] font-extrabold tracking-[-1px] text-[#0D1520] drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            물처럼 유연하게
            <br />
            거울처럼 선명하게
          </h2>
          <p className="max-w-2xl text-[20px] leading-[1.7] whitespace-pre-line text-[#3F527E] opacity-90">
            {`감정을 억누르거나 부정하실 필요는 없어요.\n때로는 흘러가게 두고, 가만히 들여다보는 것만으로도 충분합니다.`}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCTA}
          className="rounded-full bg-[#82C8FF] px-16 py-5 text-[18px] font-semibold text-white shadow-xl shadow-blue-100/50"
        >
          AI 상담 시작하기
        </motion.button>
      </div>
    </section>
  );
}
