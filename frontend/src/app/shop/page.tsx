'use client';

import { useState } from 'react';
import { GNB } from '@/components/layout/gnb';
import { ProductCard, ShopTabs, type ShopTabType } from '@/components/shop';
import { Button } from '@/components/ui/button';

// 상품 데이터 (Figma 디자인 기반)
const PRODUCTS = [
  {
    id: '01',
    name: '소형 상품',
    credits: 300,
    price: '3,300',
    benefits: ['추가 상담권 4번 구매 가능(280크레딧)', '디자인 1종 해금(200크레딧)'],
  },
  {
    id: '02',
    name: '중형 상품',
    credits: 1000,
    price: '9,900',
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
    price: '27,000',
    discount: '소형 상품보다 18.18% 혜택',
    benefits: [
      '추가 상담권 42번 구매 가능(2940크레딧)',
      '디자인 15종 해금(3000크레딧)',
      '주간 리포트 6번 발행(3000크레딧)',
      '월간 리포트 3번 발행(2400크레딧)',
    ],
  },
];

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<ShopTabType>('credit');

  const handlePurchase = (productId: string) => {
    // TODO: 결제 프로세스 구현
    console.log(`Purchased product: ${productId}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'credit':
        return (
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-start gap-2.5 px-2.5 py-2.5">
              <h2 className="text-prime-900 dark:text-secondary-100 text-4xl font-semibold">
                크레딧 구매하기
              </h2>
            </div>

            {/* 상품 카드 그리드 */}
            <div className="flex flex-wrap justify-center gap-10">
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  productNumber={`상품 ${product.id}`}
                  productName={product.name}
                  credits={product.credits}
                  price={product.price}
                  discount={product.discount}
                  benefits={product.benefits}
                  onPurchase={() => handlePurchase(product.id)}
                />
              ))}
            </div>
          </div>
        );

      case 'persona':
        return (
          <div className="flex flex-col items-center gap-10 py-12">
            <h2 className="text-prime-900 dark:text-secondary-100 text-4xl font-semibold">
              페르소나 해금하기
            </h2>
            <p className="text-prime-600 dark:text-prime-400 text-center text-lg">
              페르소나 해금 기능은 준비 중입니다.
            </p>
          </div>
        );

      case 'event':
        return (
          <div className="flex flex-col items-center gap-10 py-12">
            <h2 className="text-prime-900 dark:text-secondary-100 text-4xl font-semibold">
              이벤트
            </h2>
            <p className="text-prime-600 dark:text-prime-400 text-center text-lg">
              진행 중인 이벤트가 없습니다.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dark:bg-prime-900 min-h-screen bg-white">
      <GNB />

      <main className="flex flex-col items-center gap-10 px-4 py-12">
        {/* 탭 네비게이션 */}
        <div className="pt-6">
          <ShopTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* 콘텐츠 */}
        <div className="w-full max-w-6xl">{renderContent()}</div>

        {/* 하단 버튼 (임시) */}
        <div className="pb-12">
          <Button variant="primary">확인</Button>
        </div>
      </main>
    </div>
  );
}
