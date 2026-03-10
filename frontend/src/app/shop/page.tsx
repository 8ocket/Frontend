'use client';

import { useState } from 'react';
import { CreditProductCard } from '@/components/shop/CreditProductCard';
import { PurchaseConfirmDialog } from '@/components/shop/PurchaseConfirmDialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { CreditProduct } from '@/types/credit';

// ── Figma: 크레딧 상품 데이터 (node 1738:3773) ─────────────────
const CREDIT_PRODUCTS: CreditProduct[] = [
  {
    id: '01',
    name: '소형 상품',
    credits: 300,
    price: 3300,
    priceFormatted: '3,300',
    paymentType: '건당 결제',
    benefits: [
      '추가 상담권 4번 구매 가능(280크레딧)',
      '디자인 1종 해금(200크레딧)',
    ],
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

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<CreditProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePurchase = (product: CreditProduct) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="dark:bg-prime-900 min-h-screen bg-white">

      <main className="flex flex-col items-center px-4 py-12">
        {/* Radix Tabs — Figma: 탭 네비게이션 */}
        <Tabs defaultValue="credit" className="flex w-full flex-col items-center">
          <TabsList className="mt-6 mb-10">
            <TabsTrigger value="credit">크레딧 구매하기</TabsTrigger>
            <TabsTrigger value="persona">페르소나 해금하기</TabsTrigger>
            <TabsTrigger value="event">이벤트</TabsTrigger>
          </TabsList>

          {/* ── 크레딧 구매 탭 ─────────────────────────────────── */}
          <TabsContent value="credit" className="w-full">
            <div className="flex flex-col items-center gap-10">
              {/* 제목 — Figma: Heading 01 (32px SemiBold) */}
              <h2 className="text-prime-900 dark:text-secondary-100 text-[32px] leading-[1.3] font-semibold tracking-[-0.48px]">
                크레딧 구매하기
              </h2>

              {/* 상품 카드 3열 — Figma: 카드 간 gap 160px */}
              <div className="flex flex-wrap justify-center gap-10">
                {CREDIT_PRODUCTS.map((product) => (
                  <CreditProductCard
                    key={product.id}
                    product={product}
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ── 페르소나 해금 탭 ───────────────────────────────── */}
          <TabsContent value="persona" className="w-full">
            <div className="flex flex-col items-center gap-10 py-12">
              <h2 className="text-prime-900 dark:text-secondary-100 text-[32px] leading-[1.3] font-semibold tracking-[-1.5px]">
                페르소나 해금하기
              </h2>
              <p className="text-prime-600 dark:text-prime-400 text-center text-lg">
                페르소나 해금 기능은 준비 중입니다.
              </p>
            </div>
          </TabsContent>

          {/* ── 이벤트 탭 ──────────────────────────────────────── */}
          <TabsContent value="event" className="w-full">
            <div className="flex flex-col items-center gap-10 py-12">
              <h2 className="text-prime-900 dark:text-secondary-100 text-[32px] leading-[1.3] font-semibold tracking-[-1.5px]">
                이벤트
              </h2>
              <p className="text-prime-600 dark:text-prime-400 text-center text-lg">
                진행 중인 이벤트가 없습니다.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* 구매 확인 다이얼로그 */}
      <PurchaseConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
