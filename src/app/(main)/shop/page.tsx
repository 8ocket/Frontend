'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gift } from 'lucide-react';
import {
  CreditProductCard,
  PurchaseConfirmDialog,
  RefundPolicyNotice,
} from '@/features/purchase-credit';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import type { CreditProduct } from '@/types/credit';
import { getCreditProductsApi } from '@/entities/credits/api';

const BENEFITS_MAP: Record<string, string[]> = {
  소형: ['추가 상담권 2번 구매 가능(140크레딧)', '주간 리포트 1번 발행(150크레딧)'],
  중형: [
    '추가 상담 7회 이용 가능(490크레딧)',
    '주간 리포트 3회 생성(450크레딧)',
    '월간 리포트 1번 발행(500크레딧)',
  ],
  대형: [
    '추가 상담 17회 이용 가능(1,190크레딧)',
    '주간 리포트 8번 발행(1,200크레딧)',
    '월간 리포트 2번 발행(1,000크레딧)',
  ],
};

function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'credit');
  const [selectedProduct, setSelectedProduct] = useState<CreditProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState<CreditProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getCreditProductsApi()
      .then((data) => {
        setProducts(
          data.map((item, index) => ({
            id: String(index + 1),
            name: item.name,
            credits: item.creditAmount,
            price: item.price,
            priceFormatted: item.price.toLocaleString(),
            paymentType: '건당 결제',
            benefits: BENEFITS_MAP[item.name] ?? [],
          }))
        );
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const handlePurchase = (product: CreditProduct) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <main className="layout-container px-gutter flex flex-col items-center py-16">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex w-full flex-col items-center"
        >
          <TabsList className="mb-12">
            <TabsTrigger value="credit">크레딧 구매하기</TabsTrigger>
            <TabsTrigger value="event">이벤트</TabsTrigger>
          </TabsList>

          {/* ── 크레딧 구매 탭 ─────────────────────────────────── */}
          <TabsContent value="credit" className="w-full">
            <div className="flex flex-col items-center gap-16">
              <div className="mx-auto grid w-full max-w-300 grid-cols-1 gap-10 md:grid-cols-3">
                {isLoading ? (
                  <div className="col-span-3 flex flex-col items-center gap-4 py-24">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-400" />
                    <p className="text-prime-400 text-base">상품을 불러오는 중입니다...</p>
                  </div>
                ) : isError ? (
                  <p className="text-error-500 col-span-3 py-24 text-center text-base">
                    상품을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
                  </p>
                ) : (
                  products.map((product) => (
                    <CreditProductCard
                      key={product.id}
                      product={product}
                      onPurchase={handlePurchase}
                    />
                  ))
                )}
              </div>
              <div className="w-full max-w-300">
                <RefundPolicyNotice />
              </div>
            </div>
          </TabsContent>

          {/* ── 이벤트 탭 ──────────────────────────────────────── */}
          <TabsContent value="event" className="w-full">
            <div className="flex flex-col items-center gap-4 py-24">
              <div className="bg-secondary-100 flex h-16 w-16 items-center justify-center rounded-full">
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
          router.push('/support');
        }}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopPageContent />
    </Suspense>
  );
}
