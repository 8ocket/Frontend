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
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden pt-40 pb-20">
      {/* --- [1번 전략] 배경 이미지 연장 --- */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-15 transition-opacity duration-1000"
          style={{
            backgroundImage: "url('/images/backgrounds/brandinfo-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center', // 물결의 하단부가 보이도록 설정
          }}
        />
        {/* 하단 페이드: 배경색(#F8FAFC)으로 아주 길고 부드럽게 녹아들게 합니다. */}
        <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-[#F8FAFC] to-transparent" />
      </div>

      {/* 콘텐츠 영역 */}
      <div
        className="relative z-10 flex flex-col items-center px-4 text-center"
        style={{ width: '100%', maxWidth: 1077 }}
      >
        {/* 메인 메시지 및 버튼 */}
        <div className="mb-12 flex flex-col items-center gap-6">
          <h2 className="text-[40px] font-bold tracking-tight text-[#1A222E]">물처럼, 유연하게</h2>
          <p className="max-w-2xl text-[20px] leading-[1.7] whitespace-pre-line text-[#3F527E] opacity-90">
            {`감정을 억누르거나 부정하실 필요는 없어요.\n때로는 흘러가게 두고, 가만히 들여다보는 것만으로도 충분합니다.`}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCTA}
          className="mb-[25vh] rounded-full bg-[#82C8FF] px-16 py-5 text-[18px] font-semibold text-white shadow-xl shadow-blue-100/50"
        >
          AI 상담 시작하기
        </motion.button>

        {/* --- [3번 전략] 최소 보안 및 법적 푸터 --- */}
        {/* 아주 연한 opacity(20~30%)를 주어 시선을 방해하지 않게 배치합니다. */}
        <div className="flex flex-col items-center gap-5 text-[#3F527E] opacity-30">
          <div className="flex gap-8 text-[13px] font-medium">
            <span className="cursor-pointer hover:text-[#1A222E] hover:underline">
              개인정보처리방침
            </span>
            <span className="cursor-pointer hover:text-[#1A222E] hover:underline">이용약관</span>
            <span className="cursor-pointer hover:text-[#1A222E] hover:underline">고객지원</span>
          </div>

          <div className="flex flex-col items-center gap-1 text-[12px]">
            <p>© 2026 마인드 로그 (MindLog). All rights reserved.</p>
            <p className="tracking-tight">
              본 서비스의 상담 내용은 암호화되어 안전하게 보호됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
