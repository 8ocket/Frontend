'use client';

// Figma 2515:11326 — ChatDemoSection
// Frame: 1077×835px, VERTICAL, gap:40, counterAlign:CENTER
//
// TextBlock (2515:11327): 505×144px, VERTICAL, gap:40, CENTER
//   Title: 20px SemiBold #1A222E
//   Body:  16px Regular  #3F527E
//
// ChatBox (2515:11330): 1077×651px
//   fills: white visible:false — VECTOR 기반 장식 일러스트레이션
//   → ChatBubble 컴포넌트로 데모 대화 구현

import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInputBar } from '@/features/send-message';

export function ChatDemoSection() {
  return (
    // 2515:11326 — 1077×835px, VERTICAL, gap:40, counterAlign:CENTER
    <div className="flex flex-col items-center" style={{ width: 1077, gap: 40 }}>

      {/* TextBlock 2515:11327 — 505×144px, VERTICAL, gap:40, CENTER */}
      <div className="flex flex-col items-center text-center" style={{ width: 505, gap: 40 }}>

        {/* Title — 20px SemiBold #1A222E */}
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

        {/* Body — 16px Regular #3F527E, lh:25.6px */}
        <p
          className="body-1 whitespace-pre-line text-center"
          style={{ color: '#3F527E' }}
        >
          {'마음속 이야기를 꺼내고 싶어도, 어디서부터 어떻게 말해야 할지 막막할 때가 있죠.\n판단받을까봐, 혹은 괜한 걱정을 끼칠까봐 혼자 삼켜온 감정들이 있으셨을 거예요.\n여러분의 마음을 편하게 꺼내놓을 수 있는 곳, 여기 있습니다.'}
        </p>
      </div>

      {/* ChatBox 2515:11330 — 1077×651px */}
      {/* Figma 원본은 VECTOR 일러스트, 웹에서는 ChatBubble 컴포넌트로 데모 구현 */}
      <div
        className="pointer-events-none flex w-full flex-col overflow-hidden rounded-2xl"
        style={{
          width: 1077,
          height: 651,
          background: 'rgba(130, 201, 255, 0.05)',
          border: '1px solid rgba(130, 201, 255, 0.3)',
        }}
      >
        {/* 버블 영역 */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden px-8 py-6">
          <ChatBubble
            variant="user"
            senderName="YOU"
            content={'나도 힘든 걸 느끼는 사람인데...\n정작 다른 사람들에게 힘을 얻어보려고 하면...\n누구는 나약하다 욕하고...\n누구는 그걸 가지고 나를 놀리기도 하고, 심지어 소문까지 내곤 해.\n\n그러다보니 나 혼자 고민하고 나 혼자 속썩이게 되더라구.'}
            userAvatarSrc="/images/icons/profile-default.svg"
          />
          <ChatBubble
            variant="ai"
            senderName="정신건강 상담사"
            content={'혼자 고민하지 마세요.\n세상엔 너무나 다양한 사람들이 있고 그 사람들을 일일이 확인하는 것은 너무나도 어려운 일이에요.\n\n다만, 제 입장에선 저에게 찾아와서 이렇게 글을 남기는 것만으로도 그 고통에서 벗어나기 위한 좋은 시도라고 생각하고, 어떤 상황에 처하든 당신은 존중받고 대우받을 가치가 있는 사람이라는 걸 알려드리고 싶어요.\n\n앞으로도 찾아와서 당신의 마음을 솔직하게 이야기 해주세요.'}
            avatarSrc="/images/personas/mental.png"
          />
        </div>

        {/* 입력 바 — Figma 2515:11344 */}
        <div className="shrink-0 px-8 py-3">
          <ChatInputBar
            value=""
            onChange={() => {}}
            onSend={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
