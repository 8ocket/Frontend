'use client';

import { EmotionCardFront } from '@/components/emotion/EmotionCardFront';
import { EmotionCardBack } from '@/components/emotion/EmotionCardBack';
import { EmotionBrush } from '@/components/emotion/EmotionBrush';
import { EmotionCard } from '@/components/emotion/EmotionCard';
import {
  EMOTION_META,
  EMOTION_TYPES,
  CARD_SIZES,
  buildEmotionLayers,
  getEmotionDisplayName,
} from '@/components/emotion/constants';
import type { EmotionType, EmotionExtractions, EmotionCardData } from '@/entities/emotion';
import {
  mockSingleExtraction,
  MOCK_DUAL_EXTRACTIONS,
  MOCK_TRIPLE_EXTRACTIONS,
  MOCK_BACK_CARD_DATA,
} from '@/mocks/emotion';

export default function EmotionCardDemoPage() {
  const { width: cardW, height: cardH } = CARD_SIZES.sample;
  const { width: backW, height: backH } = CARD_SIZES.back;

  return (
    <div className="min-h-screen bg-white px-8 py-12">
      <div className="mx-auto max-w-[1400px]">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="heading-01 text-prime-900 mb-2">감정카드 데모</h1>
          <p className="body-2 text-prime-500">
            Phase 2~4 — EmotionCardLabel / EmotionBrush / EmotionCardFront / EmotionCardBack /
            EmotionCard 플립 컴포넌트 확인용
          </p>
        </div>

        {/* ─── 섹션 1: 브러시 형태 미리보기 ─── */}
        <section className="mb-16">
          <h2 className="heading-02 text-prime-900 mb-6">1. 감정별 브러시 (8종)</h2>
          <div className="grid grid-cols-4 gap-6">
            {EMOTION_TYPES.map((type) => {
              const meta = EMOTION_META[type];
              return (
                <div
                  key={type}
                  className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-sm"
                >
                  <div className="relative size-[160px]">
                    <EmotionBrush
                      emotionType={type}
                      color={meta.hex}
                      opacity={0.8}
                      blur={0}
                      size={160}
                      className="!relative"
                      style={{ position: 'relative' }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="subtitle-1 text-prime-900">{meta.label}</p>
                    <p className="caption-1 text-prime-500">{meta.englishLabel}</p>
                    <div
                      className="mx-auto mt-2 size-4 rounded-full border"
                      style={{ backgroundColor: meta.hex }}
                    />
                    <p className="caption-1 text-prime-400 mt-1">{meta.hex}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 섹션 2: 단일 감정 카드 ─── */}
        <section className="mb-16">
          <h2 className="heading-02 text-prime-900 mb-6">2. 단일 감정 카드 (8종)</h2>
          <div className="grid grid-cols-4 gap-6">
            {EMOTION_TYPES.map((type) => {
              const layers = buildEmotionLayers(mockSingleExtraction(type));
              const label = getEmotionDisplayName(type).toUpperCase();
              return (
                <div key={type} className="flex flex-col items-center gap-3">
                  <EmotionCardFront
                    layers={layers}
                    emotionLabel={label}
                    width={cardW}
                    height={cardH}
                  />
                  <p className="subtitle-1 text-prime-700">
                    {EMOTION_META[type].label} ({label})
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 섹션 3: 이중 감정 카드 ─── */}
        <section className="mb-16">
          <h2 className="heading-02 text-prime-900 mb-6">3. 이중 감정 카드</h2>
          <p className="body-2 text-prime-500 mb-4">
            기쁨(65%) + 신뢰(35%) — 규칙: A(60%) / B(30%) / A(10%)
          </p>
          <div className="flex items-end gap-8">
            <EmotionCardFront
              layers={buildEmotionLayers(MOCK_DUAL_EXTRACTIONS)}
              emotionLabel="ECSTASY"
              width={cardW}
              height={cardH}
            />
            <div className="max-w-sm rounded-xl bg-white p-6 shadow-sm">
              <h3 className="subtitle-1 text-prime-900 mb-3">레이어 구성</h3>
              {buildEmotionLayers(MOCK_DUAL_EXTRACTIONS).map((layer) => (
                <div key={layer.role} className="mb-2 flex items-center gap-3">
                  <div
                    className="size-4 rounded-full"
                    style={{
                      backgroundColor: EMOTION_META[layer.type].hex,
                      opacity: layer.opacity,
                    }}
                  />
                  <span className="caption-1 text-prime-700">
                    {layer.role} — {EMOTION_META[layer.type].label} (opacity:{' '}
                    {Math.round(layer.opacity * 100)}%, blur: {layer.blur}px)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 섹션 4: 삼중 감정 카드 ─── */}
        <section className="mb-16">
          <h2 className="heading-02 text-prime-900 mb-6">4. 삼중 감정 카드</h2>
          <p className="body-2 text-prime-500 mb-4">
            신뢰(63%) + 분노(19%) + 두려움(11%) — 규칙: A(60%) / B(30%) / C(10%)
          </p>
          <div className="flex items-end gap-8">
            <EmotionCardFront
              layers={buildEmotionLayers(MOCK_TRIPLE_EXTRACTIONS)}
              emotionLabel="ADMIRATION"
              width={cardW}
              height={cardH}
            />
            <div className="max-w-sm rounded-xl bg-white p-6 shadow-sm">
              <h3 className="subtitle-1 text-prime-900 mb-3">레이어 구성</h3>
              {buildEmotionLayers(MOCK_TRIPLE_EXTRACTIONS).map((layer) => (
                <div key={layer.role} className="mb-2 flex items-center gap-3">
                  <div
                    className="size-4 rounded-full"
                    style={{
                      backgroundColor: EMOTION_META[layer.type].hex,
                      opacity: layer.opacity,
                    }}
                  />
                  <span className="caption-1 text-prime-700">
                    {layer.role} — {EMOTION_META[layer.type].label} (opacity:{' '}
                    {Math.round(layer.opacity * 100)}%, blur: {layer.blur}px)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 섹션 5: 카드 사이즈 비교 ─── */}
        <section className="mb-16">
          <h2 className="heading-02 text-prime-900 mb-6">5. 카드 사이즈 비교</h2>
          <div className="flex items-end gap-8">
            {(
              [
                { label: 'Sample (350×600)', ...CARD_SIZES.sample },
                { label: 'Default (400×686)', ...CARD_SIZES.default },
              ] as const
            ).map(({ label, width, height }) => {
              const layers = buildEmotionLayers(mockSingleExtraction('joy'));
              return (
                <div key={label} className="flex flex-col items-center gap-3">
                  <EmotionCardFront
                    layers={layers}
                    emotionLabel="ECSTASY"
                    width={width}
                    height={height}
                  />
                  <p className="caption-1 text-prime-500">{label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 섹션 6: 카드 뒷면 ─── */}
        <section className="mb-16">
          <h2 className="heading-02 text-prime-900 mb-6">6. 카드 뒷면 (글래스모피즘)</h2>
          <p className="body-2 text-prime-500 mb-4">
            신뢰(63%) + 분노(19%) + 두려움(11%) — 뒷면: 상담 요약 + 키워드 + 사건 + 감정 + 인사이트
          </p>
          <div className="flex items-start gap-8">
            {/* 앞면 */}
            <div className="flex flex-col items-center gap-3">
              <EmotionCardFront
                layers={MOCK_BACK_CARD_DATA.layers}
                emotionLabel="ADMIRATION"
                width={cardW}
                height={cardH}
              />
              <p className="caption-1 text-prime-500">앞면</p>
            </div>

            {/* 뒷면 */}
            <div className="flex flex-col items-center gap-3">
              <EmotionCardBack
                data={MOCK_BACK_CARD_DATA}
                layers={MOCK_BACK_CARD_DATA.layers}
                emotionLabel="ADMIRATION"
                width={backW}
                height={backH}
              />
              <p className="caption-1 text-prime-500">
                뒷면 ({backW}×{backH})
              </p>
            </div>

            {/* 뒷면 — 기쁨 단일 감정 */}
            <div className="flex flex-col items-center gap-3">
              <EmotionCardBack
                data={{
                  ...MOCK_BACK_CARD_DATA,
                  layers: buildEmotionLayers(mockSingleExtraction('joy')),
                  keywords: [{ keyword: '기쁨', emotionType: 'joy', percentage: 100 }],
                }}
                layers={buildEmotionLayers(mockSingleExtraction('joy'))}
                emotionLabel="ECSTASY"
                width={backW}
                height={backH}
              />
              <p className="caption-1 text-prime-500">뒷면 — 기쁨 단일</p>
            </div>
          </div>
        </section>

        {/* ─── 섹션 7: 플립 인터랙션 ─── */}
        <section className="mb-16">
          <h2 className="heading-02 text-prime-900 mb-6">
            7. 카드 플립 인터랙션 (클릭하여 뒤집기)
          </h2>
          <p className="body-2 text-prime-500 mb-4">
            카드를 클릭하면 CSS 3D 플립으로 앞/뒤가 전환됩니다. 키보드(Enter/Space)도 지원합니다.
          </p>
          <div className="flex flex-wrap items-start gap-8">
            {/* 삼중 감정 — backMockData */}
            <div className="flex flex-col items-center gap-3">
              <EmotionCard data={MOCK_BACK_CARD_DATA} size="sample" />
              <p className="caption-1 text-prime-500">신뢰 + 분노 + 두려움 (sample)</p>
            </div>

            {/* 단일 감정 — 기쁨 */}
            <div className="flex flex-col items-center gap-3">
              <EmotionCard
                data={{
                  ...MOCK_BACK_CARD_DATA,
                  cardId: 'card-flip-joy',
                  layers: buildEmotionLayers(mockSingleExtraction('joy')),
                  keywords: [{ keyword: '기쁨', emotionType: 'joy', percentage: 100 }],
                }}
                size="sample"
              />
              <p className="caption-1 text-prime-500">기쁨 단일 (sample)</p>
            </div>

            {/* 이중 감정 */}
            <div className="flex flex-col items-center gap-3">
              <EmotionCard
                data={{
                  ...MOCK_BACK_CARD_DATA,
                  cardId: 'card-flip-dual',
                  layers: buildEmotionLayers(MOCK_DUAL_EXTRACTIONS),
                  keywords: [
                    { keyword: '기쁨', emotionType: 'joy', percentage: 65 },
                    { keyword: '신뢰', emotionType: 'trust', percentage: 35 },
                  ],
                }}
                size="sample"
              />
              <p className="caption-1 text-prime-500">기쁨 + 신뢰 (sample)</p>
            </div>

            {/* 슬픔 단일 — default 사이즈 */}
            <div className="flex flex-col items-center gap-3">
              <EmotionCard
                data={{
                  ...MOCK_BACK_CARD_DATA,
                  cardId: 'card-flip-sadness',
                  layers: buildEmotionLayers(mockSingleExtraction('sadness')),
                  keywords: [{ keyword: '슬픔', emotionType: 'sadness', percentage: 100 }],
                }}
                size="default"
              />
              <p className="caption-1 text-prime-500">슬픔 단일 (default)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
