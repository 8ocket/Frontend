/**
 * 로그인 페이지 이미지 상수
 * Figma에서 추출한 이미지 URL 및 경로
 */

export const loginImages = {
  // 배경 이미지
  wave: '/images/background/wave.svg',

  // 로고
  logo: '/images/logo/logo-small.svg',

  // SNS 로그인 아이콘
  kakaoIcon: '/images/icons/kakao.svg',
  naverIcon: '/images/icons/naver.svg',
  googleIcon: '/images/icons/google.svg',
} as const;

export const loginTexts = {
  greeting: '당신의 마음을 열어 놓는 곳, 마인드 로그에 어서 오세요.',
  loginPrompt: '어떻게 로그인을 하시겠어요?',
  kakaoButton: '카카오로 계속하기',
  naverButton: '네이버로 계속하기',
  googleButton: 'Google로 계속하기',
  disclaimer: '회원가입이 되지 않은 계정으로 시작할 경우, 자동으로 회원가입이 함께 진행됩니다.',
  darkModeSelect: '다크 모드 선택',
} as const;

export const loginColors = {
  kakao: '#fee500',
  naver: '#03c75a',
  google: 'white',
} as const;
