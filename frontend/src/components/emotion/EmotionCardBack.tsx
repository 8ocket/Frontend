'use client';

import { cn } from '@/lib/utils';
import { EMOTION_META } from './constants';
import { EmotionBrush } from './EmotionBrush';
import { EmotionCardLabel } from './EmotionCardLabel';
import type { EmotionCardBackProps } from './types';

/**
 * 감정 카드 뒷면
 *
 * Figma 레이어 구조 (아래 → 위):
 * 1. 배경 (secondary: #f8fafc)
 * 2. 브러시 3레이어 (앞면과 동일)
 * 3. 감정명 라벨 (좌상단 + 우하단)
 * 4. 글래스모피즘 정보 패널 (중앙)
 *    - 상담 요약 (제목 + 사용자명 하이라이트)
 *    - 마음 키워드 태그
 *    - 사건 / 느꼈던 감정 / AI 인사이트
 *    - 보안 고지문
 */
export function EmotionCardBack({
  data,
  layers,
  emotionLabel,
  width,
  height,
  className,
}: EmotionCardBackProps) {
  const primaryLayer = layers.find((l) => l.role === 'primary');
  const primaryMeta = primaryLayer ? EMOTION_META[primaryLayer.type] : null;
  const bgColor = primaryMeta?.hex ?? '#f8fafc';

  const brushSize = width;

  const sortedLayers = [...layers].sort((a, b) => {
    const order = { background: 0, secondary: 1, primary: 2 };
    return order[a.role] - order[b.role];
  });

  const positionMap: Record<string, { top: string; left: string }> = {
    primary: { top: '60%', left: '50%' },
    secondary: { top: '20%', left: '10%' },
    background: { top: '15%', left: '80%' },
  };

  // 글래스 패널 내부 패딩
  const panelPadding = 8;
  const panelWidth = width - panelPadding * 2;

  return (
    <div
      className={cn('bg-secondary-100 relative overflow-hidden rounded-3xl', className)}
      style={{ width, height }}
    >
      {/* 브러시 레이어 (앞면과 동일) */}
      {sortedLayers.map((layer) => {
        const meta = EMOTION_META[layer.type];
        const pos = positionMap[layer.role];

        return (
          <EmotionBrush
            key={layer.role}
            emotionType={layer.type}
            color={meta.hex}
            opacity={layer.opacity}
            blur={layer.blur}
            size={brushSize}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: pos.top, left: pos.left }}
          />
        );
      })}

      {/* 감정명 라벨 */}
      <EmotionCardLabel label={emotionLabel} position="top-left" />
      <EmotionCardLabel label={emotionLabel} position="bottom-right" />

      {/* ─── 글래스모피즘 정보 패널 ─── */}
      <div
        className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-2xl p-2 backdrop-blur-md"
        style={{
          width: panelWidth,
          backgroundColor: 'rgba(248, 250, 252, 0.3)',
        }}
      >
        <div className="flex w-full flex-col gap-4">
          {/* 상담 요약 헤더 */}
          <SummaryHeader
            title={data.summary.title}
            description={data.summary.description}
            userName={data.userName}
          />

          {/* 마음 키워드 */}
          {data.keywords.length > 0 && (
            <Section title="마음 키워드">
              <div className="flex flex-wrap gap-1">
                {data.keywords.map((kw, i) => (
                  <span key={i} className="caption-1 text-prime-700">
                    #{kw.keyword}
                    {kw.percentage != null && `[${kw.percentage}%]`}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* 사건 */}
          {data.fact && (
            <Section title="사건">
              <p className="body-2 text-prime-500 leading-relaxed">{data.fact}</p>
            </Section>
          )}

          {/* 느꼈던 감정 */}
          {data.emotion && (
            <Section title="느꼈던 감정">
              <p className="body-2 text-prime-500 leading-relaxed">{data.emotion}</p>
            </Section>
          )}

          {/* AI 인사이트 */}
          {data.insight && (
            <Section title="AI 인사이트">
              <p className="body-2 text-prime-500 leading-relaxed">{data.insight}</p>
            </Section>
          )}
        </div>

        {/* 보안 고지문 */}
        <p className="caption-1 text-warning-500 leading-[1.2]">
          본 기록은 비공개 보안 저장소에 암호화되어 저장되었으며 본인 외에는 관리자도 열람하지
          못합니다.
        </p>
      </div>
    </div>
  );
}

// ─── 내부 하위 컴포넌트 ───

/** 상담 요약 헤더 */
function SummaryHeader({
  title,
  description,
  userName,
}: {
  title: string;
  description: string;
  userName?: string;
}) {
  // description 내 "User Name" 또는 실제 userName 을 하이라이트
  const highlightName = userName ?? 'User Name';
  const parts = description.split(highlightName);

  return (
    <div className="flex flex-col gap-1">
      <h3 className="heading-03 text-prime-900">{title}</h3>
      <p className="caption-1 text-prime-500 leading-[1.2]">
        {parts.length > 1 ? (
          <>
            {parts[0]}
            <span className="text-cta-300">{highlightName}</span>
            {parts[1]}
          </>
        ) : (
          description
        )}
      </p>
    </div>
  );
}

/** 정보 섹션 (제목 + 내용) */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="subtitle-1 text-prime-900">{title}</h4>
      {children}
    </div>
  );
}
