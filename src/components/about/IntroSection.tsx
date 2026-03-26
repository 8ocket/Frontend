'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const TITLE = '여러분의 마음엔 무엇이 보이나요?';
const COPY_SLIDES = [
  '매일 반복되는 일상 속에서도,\n여러분은 묵묵히 하루를 살아내고 있습니다.',
  '지치고, 흔들리고, 때로는 무너질 것 같은\n순간도 있었을 거예요.',
  '지금 내 마음이 어떤 상태인지,\n스스로 알고 있으신가요?',
];

const CHAR_INTERVAL = Math.floor(1500 / TITLE.length);

export function IntroSection() {
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  // 타이핑 효과 (기존 로직 유지)
  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const delay = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayedTitle(TITLE.slice(0, i));
        if (i >= TITLE.length) {
          clearInterval(interval);
          setIsTypingDone(true);
        }
      }, CHAR_INTERVAL);
    }, 1000);
    return () => {
      clearTimeout(delay);
      clearInterval(interval);
    };
  }, []);

  // 슬라이더 효과 (기존 로직 유지)
  useEffect(() => {
    if (!isTypingDone) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % COPY_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isTypingDone]);

  return (
    // 1. 전체 화면을 꽉 채우는 컨테이너 설정
    <section className="relative flex h-screen w-full flex-col items-center overflow-hidden">
      {/* 2. 배경 레이어 그룹: AboutPage에서 이동됨 */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-90 transition-opacity duration-1000"
          style={{
            backgroundImage: "url('/images/backgrounds/brandinfo-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center',
          }}
        />
        {/* 블러 및 펄스 오버레이 */}
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <motion.div
          className="absolute inset-0 bg-white"
          animate={{ opacity: [0.03, 0.13, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* 하단 페이드: 다음 섹션인 #F8FAFC와 자연스럽게 연결 */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
      </div>

      {/* 3. 콘텐츠 그룹: 1077px 너비 안에서 정렬 */}
      <div
        className="relative z-10 flex h-full flex-col items-center justify-start pt-[30vh]"
        style={{ width: '100%', maxWidth: 1077, gap: 32 }}
      >
        <div className="flex flex-col items-center gap-6 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          <div className="relative text-center">
            <h1 className="invisible text-5xl leading-tight font-bold tracking-tighter">{TITLE}</h1>
            <h1 className="absolute inset-0 text-5xl leading-tight font-bold tracking-tighter text-[#1A222E]">
              {displayedTitle}
              {!isTypingDone && <span className="animate-pulse">|</span>}
            </h1>
          </div>

          <div className="relative min-h-[80px] w-full max-w-2xl px-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={slideIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className="text-center text-xl leading-relaxed whitespace-pre-line text-[#475467]"
              >
                {COPY_SLIDES[slideIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* 4. 스크롤 유도 화살표: 화면 하단에 고정 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isTypingDone ? 1 : 0 }}
          className="absolute bottom-12 flex flex-col items-center gap-2"
        >
          <span className="text-sm font-medium text-[#3F527E] opacity-60">스크롤하여 시작하기</span>
          <div className="animate-bounce">
            <ChevronDown size={28} strokeWidth={1.5} style={{ color: '#3F527E' }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
