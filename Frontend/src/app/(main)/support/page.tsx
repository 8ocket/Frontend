'use client';

import { useState } from 'react';
import { ChevronToggleIcon } from '@/shared/ui/ChevronToggleIcon';

// ── FAQ 데이터 (Figma node 2024-7747) ──────────────────────────
const FAQ_ITEMS = [
  {
    id: 1,
    question: '정신과 상담이나 심리치료를 대체할 수 있나요?',
    answer:
      '아니요. Mind-Log는 의학적 진단이나 치료를 제공하지 않습니다. 자신의 감정을 객관적으로 바라보게 돕는 \u2018자가 점검형 멘탈케어\u2019 보조 도구입니다.',
  },
  {
    id: 2,
    question: '마음 시각화 카드는 언제 생성되나요?',
    answer:
      '상담 도중에는 생성되지 않으며, 사용자가 [상담종료] 버튼을 클릭하여 세션을 확정하는 시점에 AI 분석이 시작됩니다. 분석이 완료되면 채팅창 최하단에서 앞면(마음기록)과 뒷면(감정카드)으로 구성된 카드를 확인하실 수 있습니다.',
  },
  {
    id: 3,
    question: '감정 카드의 색상은 어떤 의미인가요?',
    answer:
      '상담 세션에서 추출된 상위 3가지 감정을 기반으로 색상이 구성됩니다. 예를 들어 기쁨은 노란색, 우울은 파란색 계열로 표현되며, 감정의 비중(빈도)에 따라 하단 중앙, 상단 좌측, 상단 우측의 레이아웃에 배치됩니다.',
  },
  {
    id: 4,
    question: '감정 카드의 색상과 그림은 매번 바뀌나요?',
    answer:
      '네. 상담 세션의 핵심 사건을 바탕으로 생성되는 오로라 카드와, 등장 빈도가 높은 상위 3개 감정 색상이 조합되어 매번 고유한 카드가 생성됩니다.',
  },
  { id: 5, question: '상담 도중에 상담사(페르소나)를 바꿀 수 있나요?', answer: '' },
  {
    id: 6,
    question: '종료 버튼을 누르지 않고 화면을 나갔을 때는 어떻게 되나요?',
    answer: '',
  },
  { id: 7, question: '방금 나눈 대화가 왜 리포트에 바로 안 나오죠?', answer: '' },
  { id: 8, question: '제 고민을 남이 볼까봐 걱정돼요.', answer: '' },
  { id: 9, question: '크레딧은 어떻게 얻고 어디에 쓰나요?', answer: '' },
  { id: 10, question: '크레딧은 어떻게 모으고 어디에 사용하나요?', answer: '' },
  {
    id: 11,
    question: 'AI가 자해나 극단적 선택과 같은 위험한 단어를 감지하면 어떻게 하나요?',
    answer: '',
  },
];

export default function SupportPage() {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setOpenIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="mx-auto max-w-7xl px-10 py-10">
      {/* 헤더 */}
      <div className="mb-8 text-center">
        <h1 className="heading-01 text-prime-900">고객지원</h1>
      </div>

      {/* 콘텐츠 */}
      <div className="mx-auto max-w-4xl">
        <p className="mb-6 text-[20px] font-semibold leading-tight text-prime-800">
          자주 묻는 질문입니다.
          <br />
          문의를 주시기 전에 먼저 읽어주시면 감사드리겠습니다.
        </p>

        <ul className="divide-y divide-prime-100">
          {FAQ_ITEMS.map(item => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between py-3 text-left"
              >
                <span className="body-1 font-medium text-prime-900">{item.question}</span>
                <ChevronToggleIcon
                  open={openIds.has(item.id)}
                  className="ml-4 shrink-0 text-prime-900"
                  size={13}
                />
              </button>

              {openIds.has(item.id) && (
                <div className="pb-4 pr-10">
                  <p className="body-2 text-prime-700">
                    {item.answer || '답변을 준비 중입니다.'}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
