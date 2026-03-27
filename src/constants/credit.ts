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

export const CREDIT_PRODUCTS: CreditProduct[] = [
  {
    id: '01',
    name: '소형 상품',
    credits: 300,
    price: 3300,
    priceFormatted: '3,300',
    paymentType: '건당 결제',
    benefits: ['추가 상담권 4번 구매 가능(280크레딧)', '디자인 1종 해금(200크레딧)'],
  },
  {
    id: '02',
    name: '중형 상품',
    credits: 1000,
    price: 9900,
    priceFormatted: '9,900',
    paymentType: '건당 결제',
    discount: '소형 상품보다 10% 혜택',
    benefits: [
      '추가 상담권 14번 구매 가능(980크레딧)',
      '디자인 5종 해금(1000크레딧)',
      '주간 리포트 2번 발행(1000크레딧)',
      '월간 리포트 1번 발행(800크레딧)',
    ],
  },
  {
    id: '03',
    name: '대형 상품',
    credits: 3000,
    price: 27000,
    priceFormatted: '27,000',
    paymentType: '건당 결제',
    discount: '소형 상품보다 18.18% 혜택',
    benefits: [
      '추가 상담권 42번 구매 가능(2940크레딧)',
      '디자인 15종 해금(3000크레딧)',
      '주간 리포트 6번 발행(3000크레딧)',
      '월간 리포트 3번 발행(2400크레딧)',
    ],
  },
];
