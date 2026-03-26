'use client';

// Figma 2515:11313 — IntroSection
// Frame: 968×511px, VERTICAL, gap:40, counterAlign:CENTER
//
// TextBlock (2515:11314): 456×168px, VERTICAL, gap:48, CENTER
//   Heading: 32px SemiBold #1A222E, lh:41.6px, ls:-0.48px, CENTER
//   Body:    16px Regular  #3F527E, lh:25.6px, ls:0, CENTER
//
// YOU Group (2515:11317): 968×303px
//   8개 user 메시지 버블 — 절대 위치 겹침 레이아웃

import { ChatBubble } from '@/widgets/chat-main-area';

// Figma 확인 텍스트 (2515:11318 ~ 2515:11325 "Input text" 노드)
const YOU_MESSAGES = [
  '누가 나의 힘듦을 알아줬으면 좋겠어.',
  '이제 간신히 취업했는데... 원래 이렇게 사는 게 힘든건가? 사수가 왜 일 시키는게 말도 안되는 것 같지?',
  '내가 힘들다는 걸 이야기 하면 다른 사람들에게 비난받고... 누구는 놀리기까지 하고... 왜 그렇지?',
  '왜 다른 사람들은 잘만 연애하고 다니는데 나는 안되는 걸까?',
  '나도 결혼하고 아이낳고 잘 살고 싶었는데... 어쩌다 이렇게 된 거지?',
  '나도 부모님 잘 모시고 살고 싶은데... 내 능력부족인가 봐...\n어떻게 해야하지?',
  '면접 보러가면 면접관들이 왜 태도가 그럼? 도대체 저 사람은 회사에서 왜 뽑아준거지?',
  '이직하고 싶은데 더 좋은 곳을 어떻게 뚫어야 하지?',
];

// 각 버블의 절대 위치 (Figma GROUP 원본 좌표 기반)
const BUBBLE_POSITIONS = [
  { left:   0, top: 120, zIndex: 1 },
  { left: 130, top:  60, zIndex: 2 },
  { left: 340, top:   0, zIndex: 3 },
  { left: 560, top:  55, zIndex: 2 },
  { left:  60, top: 190, zIndex: 4 },
  { left: 280, top: 150, zIndex: 3 },
  { left: 500, top: 165, zIndex: 4 },
  { left: 680, top: 110, zIndex: 1 },
];

export function IntroSection() {
  return (
    // 2515:11313 — 968×511px, VERTICAL, gap:40, counterAlign:CENTER
    <div className="flex flex-col items-center" style={{ width: 968, gap: 40 }}>

      {/* TextBlock 2515:11314 — 456×168px, VERTICAL, gap:48, CENTER */}
      <div className="flex flex-col items-center text-center" style={{ width: 456, gap: 48 }}>

        {/* Heading — 32px SemiBold #1A222E, lh:41.6px, ls:-0.48px */}
        <h1
          className="heading-01 text-center text-prime-900"
        >
          여러분의 마음엔 무엇이 보이나요?
        </h1>

        {/* Body — 16px Regular #3F527E, lh:25.6px */}
        <p
          className="body-1 whitespace-pre-line text-center text-prime-700"
        >
          {'매일 반복되는 일상 속에서도, 여러분은 묵묵히 하루를 살아내고 있습니다.\n그 안에서 지치고, 흔들리고, 때로는 무너질 것 같은 순간도 있었을 거예요.\n그런데 정작 지금 내 마음이 어떤 상태인지, 스스로 알고 있으신가요?'}
        </p>
      </div>

      {/* YOU Group 2515:11317 — 968×303px, Figma GROUP 절대위치 겹침 레이아웃 */}
      <div className="relative" style={{ width: 968, height: 303 }}>
        {YOU_MESSAGES.map((msg, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: BUBBLE_POSITIONS[i].left,
              top: BUBBLE_POSITIONS[i].top,
              zIndex: BUBBLE_POSITIONS[i].zIndex,
              maxWidth: 360,
            }}
          >
            <ChatBubble
              variant="user"
              senderName="YOU"
              content={msg}
              userAvatarSrc="/images/icons/profile-default.svg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
