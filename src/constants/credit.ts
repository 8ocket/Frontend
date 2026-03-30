interface CreditProduct {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceFormatted: string;
  paymentType: string;
  discount?: string;
  benefits: string[];
}

// 구매 가능한 크레딧 상품 목록
export const CREDIT_PRODUCTS: CreditProduct[] = [
  {
    id: '01',
    name: '소형 상품',
    credits: 200,
    price: 2200,
    priceFormatted: '2,200',
    paymentType: '건당 결제',
    benefits: ['상담사 1종 해금 가능(200크레딧)'],
  },
  {
    id: '02',
    name: '중형 상품',
    credits: 500,
    price: 4900,
    priceFormatted: '4,900',
    paymentType: '건당 결제',
    benefits: [
      '추가 상담 7회 이용 가능(490크레딧)',
      '주간 리포트 3회 생성(450크레딧)',
      '페르소나 2종 해금(400크레딧)',
    ],
  },
  {
    id: '03',
    name: '대형 상품',
    credits: 1200,
    price: 10900,
    priceFormatted: '10,900',
    paymentType: '건당 결제',
    benefits: [
      '추가 상담 17회 이용 가능(1,190크레딧)',
      '월간 리포트 2회(1,000크레딧) + 추가 상담 2회 이용(140크레딧)',
      '페르소나 최대 6종 해금(1,200크레딧)',
    ],
  },
];

// 리포트 유형별 크레딧 비용
export const REPORT_CREDIT_COST = {
  weekly: 150,
  monthly: 500,
} as const;
