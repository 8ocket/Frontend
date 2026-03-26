'use client';

// Figma 2515:11384 — CtaSection 최적화 버전
// 배경: 화면 전체 너비(w-full), 맑은 물결 효과
// 콘텐츠: 중앙 정렬(max-w-[1077px])

import { motion } from 'framer-motion';

export function FooterCTASection() {
  return (
    // 1. 섹션 컨테이너: 너비 꽉 채움, 다음 섹션과의 간격을 위해 py 조정
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden py-60">
      {/* 2. 배경 레이어: 인트로보다 투명도를 대폭 낮춰 맑은 느낌 강조 */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-20 transition-opacity duration-1000"
          style={{
            backgroundImage: "url('/images/backgrounds/brandinfo-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* 상단 페이드: 이전 섹션의 흰색 배경과 부드럽게 연결 */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#F8FAFC] to-transparent" />
      </div>

      {/* 3. 콘텐츠 그룹: 1077px 너비 제한 및 중앙 정렬 */}
      <div
        className="relative z-10 flex flex-col items-center px-4 text-center"
        style={{ width: '100%', maxWidth: 1077, gap: 48 }}
      >
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-[40px] leading-tight font-bold tracking-tight text-[#1A222E]">
            물처럼, 유연하게
          </h2>

          <p className="max-w-2xl text-[20px] leading-[1.7] whitespace-pre-line text-[#3F527E] opacity-90">
            {`감정을 억누르거나 부정하실 필요는 없어요.\n때로는 흘러가게 두고, 때로는 가만히 들여다보는 것만으로도 충분합니다.\n여러분의 마음이 제자리를 찾아갈 수 있도록, 저희가 함께하겠습니다.`}
          </p>
        </div>

        {/* 4. 메인 버튼: Figma 스펙 반영 (#82C8FF) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full bg-[#82C8FF] px-14 py-5 text-[18px] font-semibold text-white shadow-xl shadow-blue-100 transition-all hover:bg-[#6DBBFF]"
        >
          AI 상담 시작하기
        </motion.button>
      </div>
    </section>
  );
}
