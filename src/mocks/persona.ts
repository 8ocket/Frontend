import type { PersonaProduct } from '@/types/persona';

/** 동물 친구들 페르소나 */
export const ANIMAL_PERSONAS: PersonaProduct[] = [
  {
    id: 'animal-sichu',
    name: '시츄',
    quote: '"나랑 같이 놀아줘!"',
    description: '오늘은 뭐하고 놀지 상담해 보세요.',
    image: '/images/personas/sichu.png',
    unlockCredits: 200,
    category: 'animal',
    isUnlocked: false,
  },
  {
    id: 'animal-jindori',
    name: '진도리',
    quote: '"충성!"',
    description: '격려, 위로를 통해 사용자에게 접근해요.',
    image: '/images/personas/jindori.png',
    unlockCredits: 200,
    category: 'animal',
    isUnlocked: false,
  },
  {
    id: 'animal-aengmu',
    name: '앵무',
    quote: '"네가 하는 말 따라할거야."',
    description: '사용자의 말투를 똑같이 따라해요.',
    image: '/images/personas/aengmu.png',
    unlockCredits: 200,
    category: 'animal',
    isUnlocked: false,
  },
  {
    id: 'animal-nyangi',
    name: '냥이',
    quote: '"오늘은 뭐할 거냐옹?"',
    description: '하악질 하기 전까지 시간 제한이 있어요.',
    image: '/images/personas/nyangi.png',
    unlockCredits: 200,
    category: 'animal',
    isUnlocked: false,
  },
  {
    id: 'animal-gwansangyong',
    name: '관상용',
    quote: '"혹시 외국어...좋아하니?"',
    description: '외국어로 소통해 보세요.',
    image: '/images/personas/gwansangyong.png',
    unlockCredits: 200,
    category: 'animal',
    isUnlocked: false,
  },
];

/** 직업 관련 페르소나 */
export const JOB_PERSONAS: PersonaProduct[] = [
  {
    id: 'job-self-branding',
    name: '셀프 브랜딩',
    quote: '"당신의 가치를 찾으세요."',
    description: '자신을 브랜드로 만드세요.',
    image: '/images/personas/self-branding.png',
    unlockCredits: 200,
    category: 'job',
    isUnlocked: false,
  },
];

/** 한정판 페르소나 */
export const LIMITED_PERSONAS: PersonaProduct[] = [];
