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
    benefits: ['추가 상담권 2번 구매 가능(140크레딧)', '주간 리포트 1번 발행(150크레딧)'],
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
      '월간 리포트 1번 발행(500크레딧)',
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
      '주간 리포트 8번 발행(1,200크레딧)',
      '월간 리포트 2번 발행(1,000크레딧)',
    ],
  },
];

// 리포트 유형별 크레딧 비용
export const REPORT_CREDIT_COST = {
  weekly: 150,
  monthly: 500,
} as const;
