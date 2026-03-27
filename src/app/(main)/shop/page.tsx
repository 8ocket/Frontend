'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditProductCard } from '@/features/purchase-credit';
import { PurchaseConfirmDialog } from '@/features/purchase-credit';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
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

export default function ShopPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<CreditProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePurchase = (product: CreditProduct) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    // [UX] 배경색은 요청에 따라 완전한 화이트(bg-white)를 유지
    <div className="min-h-screen bg-white">
      {/* [UX] GNB는 이미 구현되어 있으므로 코드를 추가하지 않음 */}

      {/* [8배수] 전체 섹션 상하 여백 py-16 (64px) 적용 */}
      <main className="layout-container px-gutter flex flex-col items-center py-16">
        {/* Radix Tabs — Figma: 탭 네비게이션 */}
        <Tabs defaultValue="credit" className="flex w-full flex-col items-center">
          {/* [8배수] 탭 리스트 마진 mb-12 (48px) 조정 */}
          <TabsList className="mb-12">
            <TabsTrigger value="credit">크레딧 구매하기</TabsTrigger>
            <TabsTrigger value="event">이벤트</TabsTrigger>
          </TabsList>

          {/* ── 크레딧 구매 탭 ─────────────────────────────────── */}
          <TabsContent value="credit" className="w-full">
            {/* [8배수] 요소 간 수직 간격 gap-16 (64px) 적용 */}
            <div className="flex flex-col items-center gap-16">
              {/* 제목 — Figma: Heading 01 (32px SemiBold)
              <h1 className="text-prime-950 display-01 text-center font-semibold tracking-[-1.5px]">
                크레딧 구매하기
              </h1> */}

              {/* 상품 카드 3열 — Figma: 카드 간 gap 40px (8*5) 적용 */}
              <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-3">
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

          {/* ── 이벤트 탭 ──────────────────────────────────────── */}
          <TabsContent value="event" className="w-full">
            <div className="flex flex-col items-center gap-10 py-12">
              <h2 className="heading-01 text-prime-900 font-semibold tracking-[-1.5px]">이벤트</h2>
              <p className="body-1 text-muted-foreground text-center">
                진행 중인 이벤트가 없습니다.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* 크레딧 구매 확인 다이얼로그 */}
      <PurchaseConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        product={selectedProduct}
        onViewHistory={() => {
          setIsDialogOpen(false);
          router.push('/credit');
        }}
        onGoHome={() => {
          setIsDialogOpen(false);
          router.push('/');
        }}
        onContactSupport={() => {
          setIsDialogOpen(false);
          // TODO: 고객지원 페이지 라우팅
        }}
      />
    </div>
  );
}
