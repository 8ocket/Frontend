'use client';

// Figma 2515:11326 — ChatDemoSection

import { Send } from 'lucide-react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ChatBubble, ChatLogo } from '@/widgets/chat-main-area';

const USER_MESSAGE = '나도 힘든 걸 느끼는 사람인데...\n정작 다른 사람들에게 힘을 얻어보려고 하면...\n누구는 나약하다 욕하고...\n누구는 그걸 가지고 나를 놀리기도 하고, 심지어 소문까지 내곤 해.\n\n그러다보니 나 혼자 고민하고 나 혼자 속썩이게 되더라구.';
const AI_MESSAGE    = '혼자 고민하지 마세요.\n세상엔 너무나 다양한 사람들이 있고 그 사람들을 일일이 확인하는 것은 너무나도 어려운 일이에요.\n\n다만, 제 입장에선 저에게 찾아와서 이렇게 글을 남기는 것만으로도 그 고통에서 벗어나기 위한 좋은 시도라고 생각하고, 어떤 상황에 처하든 당신은 존중받고 대우받을 가치가 있는 사람이라는 걸 알려드리고 싶어요.\n\n앞으로도 찾아와서 당신의 마음을 솔직하게 이야기 해주세요.';

// 채팅 시퀀스 단계
type Phase = 'idle' | 'user' | 'typing' | 'ai';

// ─── 타이핑 인디케이터 ───

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl bg-white px-5 py-4 shadow-sm">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="size-2 rounded-full bg-slate-300"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ─── ChatDemoSection ───

export function ChatDemoSection() {
  const textRef  = useRef<HTMLDivElement>(null);
  const chatRef  = useRef<HTMLDivElement>(null);
  const textInView = useInView(textRef, { once: true, margin: '-80px' });
  const chatInView = useInView(chatRef, { once: true, margin: '-80px' });

  const [phase, setPhase] = useState<Phase>('idle');
  const started = useRef(false);

  // 섹션 진입 시 채팅 시퀀스 시작 — chatInView만 의존해야 타임아웃이 취소되지 않음
  useEffect(() => {
    if (!chatInView || started.current) return;
    started.current = true;

    const t1 = setTimeout(() => setPhase('user'),   200);
    const t2 = setTimeout(() => setPhase('typing'), 700);
    const t3 = setTimeout(() => setPhase('ai'),     1800);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [chatInView]);

  return (
    <div className="flex flex-col items-center" style={{ width: 1077, gap: 40 }}>
      {/* TextBlock */}
      <motion.div
        ref={textRef}
        className="flex flex-col items-center text-center"
        style={{ width: 505, gap: 40 }}
        initial={{ opacity: 0, y: 24 }}
        animate={textInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            lineHeight: '130%',
            letterSpacing: '-0.015em',
            color: '#1A222E',
          }}
        >
          여러분의 마음은 안전한가요?
        </h2>
        <p className="body-1 text-center whitespace-pre-line" style={{ color: '#3F527E' }}>
          {'마음속 이야기를 꺼내고 싶어도, 어디서부터 어떻게 말해야 할지 막막할 때가 있죠.\n판단받을까봐, 혹은 괜한 걱정을 끼칠까봐 혼자 삼켜온 감정들이 있으셨을 거예요.\n여러분의 마음을 편하게 꺼내놓을 수 있는 곳, 여기 있습니다.'}
        </p>
      </motion.div>

      {/* 채팅 카드 */}
      <div
        ref={chatRef}
        className="pointer-events-none relative flex w-full flex-col overflow-hidden rounded-3xl"
        style={{
          height: 651,
          backgroundColor: '#F8FAFF',
          boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
        }}
      >
        {/* 로고 워터마크 */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0.07 }}
          aria-hidden="true"
        >
          <ChatLogo size={500} />
        </div>

        {/* 버블 영역 */}
        <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-8">
          {/* 유저 메시지 */}
          <AnimatePresence>
            {phase !== 'idle' && (
              <motion.div
                className="flex flex-col items-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <ChatBubble
                  variant="user"
                  senderName="YOU"
                  content={USER_MESSAGE}
                  avatarSrc={undefined}
                  userAvatarSrc={undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 타이핑 인디케이터 */}
          <AnimatePresence>
            {phase === 'typing' && (
              <motion.div
                className="flex flex-col items-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI 메시지 */}
          <AnimatePresence>
            {phase === 'ai' && (
              <motion.div
                className="flex flex-col items-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <ChatBubble
                  variant="ai"
                  senderName="정신건강 상담사"
                  content={AI_MESSAGE}
                  avatarSrc="/images/personas/mental.png"
                  userAvatarSrc={undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 입력바 모사 */}
        <div className="relative shrink-0 px-3 pb-3">
          <div className="flex w-full items-center gap-3 rounded-3xl border border-blue-50 bg-white px-4 py-3 shadow-lg">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-50">
              <div className="size-3 rounded-full bg-slate-200" />
            </div>
            <span className="flex-1 text-sm text-slate-300">
              오늘 하루, 어떤 마음이 머물렀나요?
            </span>
            <div className="flex size-9 items-center justify-center rounded-full bg-blue-50">
              <Send size={16} strokeWidth={2} className="text-[#4A90E2]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
