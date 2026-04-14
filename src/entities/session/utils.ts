import type { BrushRole, EmotionCardData, EmotionKeywordTag, EmotionLayer } from '@/entities/emotion';
import { BRUSH_LAYER_CONFIG, toEmotionType } from '@/widgets/emotion-card/constants';
import type { FinalizeCompleteEvent } from './model';

/**
 * FinalizeCompleteEvent → EmotionCardData 변환
 * finalize SSE 완료 데이터를 EmotionCard 렌더링에 필요한 형태로 매핑
 */
export function finalizeToEmotionCardData(
  result: FinalizeCompleteEvent,
  sessionId: string
): EmotionCardData {
  // intensity 내림차순 정렬 후 상위 3개
  const sorted = [...result.emotions].sort((a, b) => b.intensity - a.intensity);
  const top3 = sorted.slice(0, 3);

  const roles: BrushRole[] = ['primary', 'secondary', 'background'];
  const baseType = toEmotionType(top3[0]?.emotion_type ?? '') ?? 'joy';

  // 감정 레이어 생성 — 3개 미만이면 첫 번째 감정으로 채움
  const layers: EmotionLayer[] = roles.map((role, i) => {
    const em = top3[i] ?? top3[0];
    const type = toEmotionType(em?.emotion_type ?? '') ?? baseType;
    return { type, role, ...BRUSH_LAYER_CONFIG[role] };
  });

  const keywords: EmotionKeywordTag[] = top3.map((em) => ({
    keyword: em.source_keyword,
    emotionType: toEmotionType(em.emotion_type) ?? undefined,
  }));
  return {
    cardId: result.summary_id,
    summaryId: result.summary_id,
    sessionId,
    layers,
    keywords,
    summary: { title: '', description: result.summary.fact ?? '' },
    fact: result.summary.fact,
    emotion: result.summary.emotion,
    insight: result.summary.insight,
    createdAt: new Date(),
  };
}
