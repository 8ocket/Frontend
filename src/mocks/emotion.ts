/**
 * 감정카드 Mock 데이터 팩토리
 *
 * 개발/테스트용 감정카드 mock 데이터를 생성합니다.
 * 백엔드 연동 시 이 파일의 데이터는 API 응답으로 대체됩니다.
 */

import { buildEmotionLayers } from '@/widgets/emotion-card/constants';
import type { EmotionCardData, EmotionExtractions, EmotionType } from '@/entities/emotion';

// ─── Extractions 팩토리 ───

/** 단일 감정 EmotionExtractions 생성 */
export function mockSingleExtraction(type: EmotionType): EmotionExtractions[] {
  return [
    {
      extraction_id: `mock-${type}`,
      session_id: 'session-mock',
      emotion_type: type,
      intensity: 8,
      score: 100,
      is_primary: true,
      created_at: new Date(),
    },
  ];
}

/** 다중 감정 EmotionExtractions 생성 (최대 3개) */
export function mockExtractions(
  primary: EmotionType,
  secondary?: EmotionType,
  tertiary?: EmotionType
): EmotionExtractions[] {
  const extractions: EmotionExtractions[] = [
    {
      extraction_id: `mock-ext-${primary}`,
      session_id: 'session-mock',
      emotion_type: primary,
      intensity: 7,
      score: secondary ? (tertiary ? 60 : 65) : 100,
      is_primary: true,
      created_at: new Date(),
    },
  ];

  if (secondary) {
    extractions.push({
      extraction_id: `mock-ext-${secondary}`,
      session_id: 'session-mock',
      emotion_type: secondary,
      intensity: 5,
      score: tertiary ? 25 : 35,
      is_primary: false,
      created_at: new Date(),
    });
  }

  if (tertiary) {
    extractions.push({
      extraction_id: `mock-ext-${tertiary}`,
      session_id: 'session-mock',
      emotion_type: tertiary,
      intensity: 3,
      score: 15,
      is_primary: false,
      created_at: new Date(),
    });
  }

  return extractions;
}

// ─── CardData 팩토리 ───

/** EmotionCardData 생성 (기본 상담 내용 포함) */
export function mockCardData(
  cardId: string,
  date: Date,
  extractions: EmotionExtractions[],
  overrides?: Partial<EmotionCardData>
): EmotionCardData {
  return {
    cardId,
    summaryId: overrides?.summaryId ?? cardId,
    sessionId: `session-${cardId}`,
    userName: '민지',
    layers: buildEmotionLayers(extractions),
    keywords: [
      { keyword: '기획회의', percentage: 40 },
      { keyword: '인정욕구', percentage: 25 },
      { keyword: '부장님', percentage: 20 },
      { keyword: '차분한 슬픔', percentage: 10 },
      { keyword: '자기객관화', percentage: 5 },
    ],
    summary: {
      title: '상담 요약',
      description: '오늘 민지님의 마음을 그려보았어요. 긍정적인 에너지가 가득한 날이에요.',
    },
    fact: '오전 기획 회의에서 시안을 두고 회의를 진행하였는데, 부장님에게 여러 아이디어를 제안드렸음에도 거절을 당하였다.',
    emotion:
      '오전 기획 회의에서 내 제안이 수용되지 않아 무력감을 느꼈다. 부장님과의 대화에서 평소보다 더 큰 답답함을 경험한 하루였다.',
    insight:
      "단순한 화보다는 '나의 능력을 인정받지 못했다'는 서운함이 컸다. 상담을 통해 이 감정이 실패에 대한 두려움에서 기인했다는 것을 알게 되었다.",
    createdAt: date,
    ...overrides,
  };
}

// ─── 프리셋 데이터 ───

/** 이중 감정 프리셋 (기쁨 65% + 신뢰 35%) */
export const MOCK_DUAL_EXTRACTIONS = mockExtractions('joy', 'trust');

/** 삼중 감정 프리셋 (신뢰 63% + 분노 19% + 두려움 11%) */
export const MOCK_TRIPLE_EXTRACTIONS: EmotionExtractions[] = [
  {
    extraction_id: 'mock-triple-1',
    session_id: 'session-mock',
    emotion_type: 'trust',
    intensity: 9,
    score: 63,
    is_primary: true,
    created_at: new Date(),
  },
  {
    extraction_id: 'mock-triple-2',
    session_id: 'session-mock',
    emotion_type: 'anger',
    intensity: 4,
    score: 19,
    is_primary: false,
    created_at: new Date(),
  },
  {
    extraction_id: 'mock-triple-3',
    session_id: 'session-mock',
    emotion_type: 'fear',
    intensity: 3,
    score: 11,
    is_primary: false,
    created_at: new Date(),
  },
];

/** 카드 뒷면 데모용 프리셋 (삼중 감정) */
export const MOCK_BACK_CARD_DATA: EmotionCardData = mockCardData(
  'card-demo-back',
  new Date(),
  MOCK_TRIPLE_EXTRACTIONS,
  {
    keywords: [
      { keyword: '신뢰', emotionType: 'trust', percentage: 63 },
      { keyword: '공격성', emotionType: 'anger', percentage: 19 },
      { keyword: '불안', emotionType: 'fear', percentage: 11 },
    ],
  }
);

/** 오늘 기준 n일 전 날짜 반환 */
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

/** 컬렉션 페이지용 카드 목록 (30개, 다양한 감정 조합) */
export const MOCK_COLLECTION_CARDS: EmotionCardData[] = [
  mockCardData('card-01', daysAgo(0), mockExtractions('joy'), {
    keywords: [{ keyword: '합격', emotionType: 'joy', percentage: 100 }],
    summary: { title: '오늘의 기쁨을 충분히 누려도 괜찮아요. 당신은 그럴 자격이 있어요.', description: '' },
    fact: '오랫동안 준비해온 취업 면접 결과가 나왔고, 최종 합격 통보를 받았다.',
    emotion: '몇 달간의 긴장과 불안이 한꺼번에 풀리는 느낌이었다.',
    insight: '이 기쁨이 단순한 성공이 아니라, 포기하지 않은 나 자신에 대한 보상임을 느꼈다.',
  }),
  mockCardData('card-02', daysAgo(1), mockExtractions('surprise', 'trust'), {
    keywords: [
      { keyword: '놀람', emotionType: 'surprise', percentage: 65 },
      { keyword: '신뢰', emotionType: 'trust', percentage: 35 },
    ],
  }),
  mockCardData('card-03', daysAgo(2), mockExtractions('joy', 'anticipation'), {
    keywords: [
      { keyword: '기쁨', emotionType: 'joy', percentage: 65 },
      { keyword: '기대', emotionType: 'anticipation', percentage: 35 },
    ],
  }),
  mockCardData('card-04', daysAgo(3), mockExtractions('trust', 'anger', 'fear'), {
    keywords: [
      { keyword: '신뢰', emotionType: 'trust', percentage: 60 },
      { keyword: '분노', emotionType: 'anger', percentage: 25 },
      { keyword: '두려움', emotionType: 'fear', percentage: 15 },
    ],
  }),
  mockCardData('card-05', daysAgo(4), mockExtractions('surprise'), {
    keywords: [{ keyword: '놀람', emotionType: 'surprise', percentage: 100 }],
  }),
  mockCardData('card-06', daysAgo(5), mockExtractions('sadness', 'fear'), {
    keywords: [
      { keyword: '이별', emotionType: 'sadness', percentage: 65 },
      { keyword: '외로움', emotionType: 'fear', percentage: 35 },
    ],
    summary: { title: '슬픔은 소중했던 것이 있었다는 증거예요. 충분히 슬퍼해도 괜찮아요.', description: '' },
    fact: '오랫동안 함께했던 친구가 멀리 이사를 가게 되었다는 소식을 들었다.',
    emotion: '앞으로 자주 볼 수 없다는 사실이 실감나면서 가슴이 먹먹해졌다.',
    insight: '이 슬픔은 관계를 소중히 여기는 내 마음에서 비롯된 것임을 알게 되었다.',
  }),
  mockCardData('card-07', daysAgo(6), mockExtractions('anger', 'disgust'), {
    keywords: [
      { keyword: '불공정', emotionType: 'anger', percentage: 65 },
      { keyword: '무시', emotionType: 'disgust', percentage: 35 },
    ],
    summary: { title: '그 분노는 당신의 기준과 가치관이 살아있다는 신호예요.', description: '' },
    fact: '팀 프로젝트에서 내가 작성한 보고서가 팀장의 이름으로 윗선에 보고되었다.',
    emotion: '배신감과 함께 억울함이 치밀어 올랐다.',
    insight: '이 분노의 근원은 공정함과 인정에 대한 나의 강한 욕구임을 이해하게 되었다.',
  }),
  mockCardData('card-08', daysAgo(7), mockExtractions('anticipation', 'joy'), {
    keywords: [
      { keyword: '설렘', emotionType: 'anticipation', percentage: 60 },
      { keyword: '기쁨', emotionType: 'joy', percentage: 40 },
    ],
  }),
  mockCardData('card-09', daysAgo(8), mockExtractions('fear', 'sadness'), {
    keywords: [
      { keyword: '걱정', emotionType: 'fear', percentage: 70 },
      { keyword: '우울', emotionType: 'sadness', percentage: 30 },
    ],
  }),
  mockCardData('card-10', daysAgo(9), mockExtractions('disgust', 'anger', 'sadness'), {
    keywords: [
      { keyword: '혐오', emotionType: 'disgust', percentage: 55 },
      { keyword: '분노', emotionType: 'anger', percentage: 30 },
      { keyword: '슬픔', emotionType: 'sadness', percentage: 15 },
    ],
  }),
  mockCardData('card-11', daysAgo(10), mockExtractions('trust'), {
    keywords: [{ keyword: '믿음', emotionType: 'trust', percentage: 100 }],
  }),
  mockCardData('card-12', daysAgo(11), mockExtractions('joy', 'trust', 'anticipation'), {
    keywords: [
      { keyword: '행복', emotionType: 'joy', percentage: 50 },
      { keyword: '신뢰', emotionType: 'trust', percentage: 30 },
      { keyword: '기대', emotionType: 'anticipation', percentage: 20 },
    ],
  }),
  mockCardData('card-13', daysAgo(12), mockExtractions('sadness'), {
    keywords: [{ keyword: '그리움', emotionType: 'sadness', percentage: 100 }],
  }),
  mockCardData('card-14', daysAgo(13), mockExtractions('anger', 'fear'), {
    keywords: [
      { keyword: '분노', emotionType: 'anger', percentage: 60 },
      { keyword: '불안', emotionType: 'fear', percentage: 40 },
    ],
  }),
  mockCardData('card-15', daysAgo(14), mockExtractions('surprise', 'joy'), {
    keywords: [
      { keyword: '놀람', emotionType: 'surprise', percentage: 55 },
      { keyword: '기쁨', emotionType: 'joy', percentage: 45 },
    ],
  }),
  mockCardData('card-16', daysAgo(15), mockExtractions('anticipation'), {
    keywords: [{ keyword: '기대', emotionType: 'anticipation', percentage: 100 }],
  }),
  mockCardData('card-17', daysAgo(16), mockExtractions('fear', 'disgust', 'anger'), {
    keywords: [
      { keyword: '두려움', emotionType: 'fear', percentage: 50 },
      { keyword: '혐오', emotionType: 'disgust', percentage: 30 },
      { keyword: '분노', emotionType: 'anger', percentage: 20 },
    ],
  }),
  mockCardData('card-18', daysAgo(17), mockExtractions('trust', 'anticipation'), {
    keywords: [
      { keyword: '신뢰', emotionType: 'trust', percentage: 65 },
      { keyword: '기대', emotionType: 'anticipation', percentage: 35 },
    ],
  }),
  mockCardData('card-19', daysAgo(18), mockExtractions('sadness', 'anger'), {
    keywords: [
      { keyword: '상실', emotionType: 'sadness', percentage: 60 },
      { keyword: '억울함', emotionType: 'anger', percentage: 40 },
    ],
  }),
  mockCardData('card-20', daysAgo(19), mockExtractions('joy', 'surprise', 'trust'), {
    keywords: [
      { keyword: '성취', emotionType: 'joy', percentage: 55 },
      { keyword: '놀람', emotionType: 'surprise', percentage: 25 },
      { keyword: '감사', emotionType: 'trust', percentage: 20 },
    ],
  }),
  mockCardData('card-21', daysAgo(20), mockExtractions('disgust'), {
    keywords: [{ keyword: '불쾌함', emotionType: 'disgust', percentage: 100 }],
  }),
  mockCardData('card-22', daysAgo(21), mockExtractions('anticipation', 'fear'), {
    keywords: [
      { keyword: '설렘', emotionType: 'anticipation', percentage: 55 },
      { keyword: '긴장', emotionType: 'fear', percentage: 45 },
    ],
  }),
  mockCardData('card-23', daysAgo(22), mockExtractions('anger'), {
    keywords: [{ keyword: '분노', emotionType: 'anger', percentage: 100 }],
  }),
  mockCardData('card-24', daysAgo(23), mockExtractions('trust', 'joy'), {
    keywords: [
      { keyword: '감사', emotionType: 'trust', percentage: 60 },
      { keyword: '기쁨', emotionType: 'joy', percentage: 40 },
    ],
  }),
  mockCardData('card-25', daysAgo(24), mockExtractions('sadness', 'fear', 'disgust'), {
    keywords: [
      { keyword: '우울', emotionType: 'sadness', percentage: 50 },
      { keyword: '불안', emotionType: 'fear', percentage: 30 },
      { keyword: '무기력', emotionType: 'disgust', percentage: 20 },
    ],
  }),
  mockCardData('card-26', daysAgo(25), mockExtractions('surprise', 'anticipation'), {
    keywords: [
      { keyword: '놀람', emotionType: 'surprise', percentage: 55 },
      { keyword: '기대', emotionType: 'anticipation', percentage: 45 },
    ],
  }),
  mockCardData('card-27', daysAgo(26), mockExtractions('joy', 'anticipation', 'trust'), {
    keywords: [
      { keyword: '희망', emotionType: 'joy', percentage: 50 },
      { keyword: '기대', emotionType: 'anticipation', percentage: 30 },
      { keyword: '신뢰', emotionType: 'trust', percentage: 20 },
    ],
  }),
  mockCardData('card-28', daysAgo(27), mockExtractions('fear'), {
    keywords: [{ keyword: '두려움', emotionType: 'fear', percentage: 100 }],
  }),
  mockCardData('card-29', daysAgo(28), mockExtractions('anger', 'disgust'), {
    keywords: [
      { keyword: '좌절', emotionType: 'anger', percentage: 65 },
      { keyword: '실망', emotionType: 'disgust', percentage: 35 },
    ],
  }),
  mockCardData('card-30', daysAgo(29), mockExtractions('trust', 'surprise', 'joy'), {
    keywords: [
      { keyword: '신뢰', emotionType: 'trust', percentage: 50 },
      { keyword: '놀람', emotionType: 'surprise', percentage: 30 },
      { keyword: '기쁨', emotionType: 'joy', percentage: 20 },
    ],
  }),
];
