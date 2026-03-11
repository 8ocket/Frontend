import type {
  EmotionType,
  EmotionMeta,
  BrushRole,
  EmotionLayer,
  EmotionExtractions,
} from '@/types/emotion';

// ─── 감정별 메타데이터 ───
//
// CSS 변수: globals.css → --color-emotion-*

export const EMOTION_META: Record<EmotionType, EmotionMeta> = {
  joy: {
    type: 'joy',
    label: '기쁨',
    englishLabel: 'Joy',
    intensityLabels: { mild: 'Serenity', basic: 'Joy', intense: 'Ecstasy' },
    cssVar: '--color-emotion-ecstasy',
    hex: '#ffb900',
    brushShape: 'circle',
  },
  trust: {
    type: 'trust',
    label: '신뢰',
    englishLabel: 'Trust',
    intensityLabels: { mild: 'Acceptance', basic: 'Trust', intense: 'Admiration' },
    cssVar: '--color-emotion-admiration',
    hex: '#16781e',
    brushShape: 'circle',
  },
  fear: {
    type: 'fear',
    label: '두려움',
    englishLabel: 'Fear',
    intensityLabels: { mild: 'Apprehension', basic: 'Fear', intense: 'Terror' },
    cssVar: '--color-emotion-terror',
    hex: '#00735f',
    brushShape: 'textured-circle',
  },
  surprise: {
    type: 'surprise',
    label: '놀람',
    englishLabel: 'Surprise',
    intensityLabels: { mild: 'Distraction', basic: 'Surprise', intense: 'Amazement' },
    cssVar: '--color-emotion-amazement',
    hex: '#1c5ac3',
    brushShape: 'four-point-star',
  },
  sadness: {
    type: 'sadness',
    label: '슬픔',
    englishLabel: 'Sadness',
    intensityLabels: { mild: 'Pensiveness', basic: 'Sadness', intense: 'Grief' },
    cssVar: '--color-emotion-grief',
    hex: '#411e9b',
    brushShape: 'gradient-circle',
  },
  disgust: {
    type: 'disgust',
    label: '혐오',
    englishLabel: 'Disgust',
    intensityLabels: { mild: 'Boredom', basic: 'Disgust', intense: 'Loathing' },
    cssVar: '--color-emotion-loathing',
    hex: '#7314aa',
    brushShape: 'spiky-star',
  },
  anger: {
    type: 'anger',
    label: '분노',
    englishLabel: 'Anger',
    intensityLabels: { mild: 'Annoyance', basic: 'Anger', intense: 'Rage' },
    cssVar: '--color-emotion-rage',
    hex: '#c40a0a',
    brushShape: 'lightning',
  },
  anticipation: {
    type: 'anticipation',
    label: '기대',
    englishLabel: 'Anticipation',
    intensityLabels: { mild: 'Interest', basic: 'Anticipation', intense: 'Vigilance' },
    cssVar: '--color-emotion-vigilance',
    hex: '#da5500',
    brushShape: 'circle',
  },
} as const;

// ─── 브러시 레이어 규칙 (Figma 색상 배치 원칙) ───

/**
 * 브러시 역할별 시각 속성
 *
 * | 역할       | opacity | blur | 설명             |
 * |-----------|---------|------|-----------------|
 * | primary   | 60%     | 10px | 주감정 (Brush 01) |
 * | secondary | 30%     | 20px | 부감정 (Brush 02) |
 * | background| 10%     | 30px | 보조감정 (배경)    |
 */
export const BRUSH_LAYER_CONFIG: Record<BrushRole, { opacity: number; blur: number }> = {
  primary: { opacity: 0.6, blur: 10 },
  secondary: { opacity: 0.3, blur: 20 },
  background: { opacity: 0.1, blur: 30 },
} as const;

// ─── 카드 크기 (Figma 기준) ───

export const CARD_SIZES = {
  /** 기본 카드 (400 × 686) */
  default: { width: 400, height: 686 },
  /** 샘플 카드 (350 × 600) */
  sample: { width: 350, height: 600 },
  /** 뒷면 카드 (422 × 723) */
  back: { width: 422, height: 723 },
} as const;

// ─── 감정 타입 목록 (순회용) ───

export const EMOTION_TYPES: EmotionType[] = [
  'joy',
  'trust',
  'fear',
  'surprise',
  'sadness',
  'disgust',
  'anger',
  'anticipation',
] as const;

// ─── 유틸리티 함수 ───

/**
 * 감정 문자열 → EmotionType 으로 변환
 * API 응답의 emotion_type (VARCHAR) 를 타입 안전하게 매핑
 */
export function toEmotionType(value: string): EmotionType | null {
  const normalized = value.toLowerCase().trim();

  // 직접 매핑
  if (EMOTION_TYPES.includes(normalized as EmotionType)) {
    return normalized as EmotionType;
  }

  // 한글 → EmotionType 역매핑
  const koreanMap: Record<string, EmotionType> = {
    기쁨: 'joy',
    신뢰: 'trust',
    두려움: 'fear',
    놀람: 'surprise',
    슬픔: 'sadness',
    혐오: 'disgust',
    분노: 'anger',
    기대: 'anticipation',
  };
  return koreanMap[normalized] ?? null;
}

/**
 * 감정 강도(1~10) → EmotionIntensity 변환
 */
export function toEmotionIntensity(intensity: number | null): 'mild' | 'basic' | 'intense' {
  if (intensity === null || intensity <= 3) return 'mild';
  if (intensity <= 6) return 'basic';
  return 'intense';
}

/**
 * 감정 추출 결과 → 카드 레이어 배열로 변환
 *
 * Figma 원칙:
 * - 단일 감정: A(60%) / A(30%) / A(10%)
 * - 이중 감정: A(60%) / B(30%) / A(10%)
 * - 삼중 감정: A(60%) / B(30%) / C(10%)
 * - 4개 이상:  상위 3개만 선택하여 위 규칙 적용
 */
export function buildEmotionLayers(extractions: EmotionExtractions[]): EmotionLayer[] {
  if (extractions.length === 0) return [];

  // 점수 내림차순 정렬, is_primary 우선
  const sorted = [...extractions].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (b.score ?? 0) - (a.score ?? 0);
  });

  // 상위 3개 선택
  const top3 = sorted.slice(0, 3);
  const emotionA = toEmotionType(top3[0].emotion_type);
  if (!emotionA) return [];

  const roles: BrushRole[] = ['primary', 'secondary', 'background'];

  switch (top3.length) {
    case 1:
      // 단일 감정: A / A / A
      return roles.map((role) => ({
        type: emotionA,
        role,
        ...BRUSH_LAYER_CONFIG[role],
        score: top3[0].score ?? undefined,
      }));

    case 2: {
      // 이중 감정: A / B / A
      const emotionB = toEmotionType(top3[1].emotion_type) ?? emotionA;
      return [
        {
          type: emotionA,
          role: 'primary',
          ...BRUSH_LAYER_CONFIG.primary,
          score: top3[0].score ?? undefined,
        },
        {
          type: emotionB,
          role: 'secondary',
          ...BRUSH_LAYER_CONFIG.secondary,
          score: top3[1].score ?? undefined,
        },
        {
          type: emotionA,
          role: 'background',
          ...BRUSH_LAYER_CONFIG.background,
          score: top3[0].score ?? undefined,
        },
      ];
    }

    default: {
      // 삼중 이상: A / B / C
      const emotionB = toEmotionType(top3[1].emotion_type) ?? emotionA;
      const emotionC = toEmotionType(top3[2].emotion_type) ?? emotionA;
      return [
        {
          type: emotionA,
          role: 'primary',
          ...BRUSH_LAYER_CONFIG.primary,
          score: top3[0].score ?? undefined,
        },
        {
          type: emotionB,
          role: 'secondary',
          ...BRUSH_LAYER_CONFIG.secondary,
          score: top3[1].score ?? undefined,
        },
        {
          type: emotionC,
          role: 'background',
          ...BRUSH_LAYER_CONFIG.background,
          score: top3[2].score ?? undefined,
        },
      ];
    }
  }
}

/**
 * 감정 타입으로 카드 배경 CSS 클래스 반환
 * Figma: bg-[var(--background/{emotion}, rgba({hex}, 0.1))]
 */
export function getEmotionBgClass(type: EmotionType): string {
  return `bg-[color-mix(in_srgb,var(${EMOTION_META[type].cssVar})_10%,transparent)]`;
}

/**
 * 감정 강도에 따른 카드 표시 이름 (영문) 반환
 */
export function getEmotionDisplayName(type: EmotionType, intensity: number | null = null): string {
  const meta = EMOTION_META[type];
  if (intensity === null) return meta.intensityLabels.intense; // 카드에는 intense 표시
  return meta.intensityLabels[toEmotionIntensity(intensity)];
}
