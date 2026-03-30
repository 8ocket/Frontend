'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gift } from 'lucide-react';
import { CreditProductCard } from '@/features/purchase-credit';
import { PurchaseConfirmDialog } from '@/features/purchase-credit';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import type { CreditProduct } from '@/types/credit';

// ── Figma: 크레딧 상품 데이터 (node 1738:3773) ─────────────────
const CREDIT_PRODUCTS: CreditProduct[] = [
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

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'credit');
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex w-full flex-col items-center">
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
            <div className="flex flex-col items-center gap-4 py-24">
              <div className="flex size-16 items-center justify-center rounded-full bg-secondary-100">
                <Gift size={28} strokeWidth={1.5} className="text-prime-400" />
              </div>
              <p className="text-prime-400 text-base">진행 중인 이벤트가 없습니다.</p>
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
