import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { CreditProduct } from '@/types/credit';

// ── Figma: 크레딧 상품 카드 (node 1738:3816) ──────────────────
// 258×auto, bg secondary-100, rounded-lg (8px)
// Badge: bg prime-900, text-inverse, rounded-lg
// Title: Heading 03 (SemiBold 20px), prime-500
// Credits: Heading 04 (SemiBold 16px), prime-700
// Price: Heading 03 (SemiBold 20px), prime-900
// Benefits heading: Subtitle 01 (SemiBold 14px), prime-700
// Benefits item: Caption 01 (Medium 12px), prime-500
// Disclaimer: Caption 02 (Regular 12px), warning-500
// ─────────────────────────────────────────────────────────────────

interface CreditProductCardProps {
  product: CreditProduct;
  onPurchase: (product: CreditProduct) => void;
  /** 강조 스타일 (추천 상품 등) */
  featured?: boolean;
  className?: string;
}

export function CreditProductCard({
  product,
  onPurchase,
  featured = false,
  className,
}: CreditProductCardProps) {
  return (
    <div
      className={cn(
        'bg-secondary-100 relative flex w-64.5 flex-col overflow-clip rounded-lg p-2',
        featured && 'ring-cta-300 ring-2',
        className
      )}
    >
      {/* 뱃지 — 우상단 */}
      <div className="bg-prime-900 absolute top-0 right-0 z-10 flex h-4 items-center justify-center rounded-lg px-2 py-2">
        <span className="text-inverse text-xs leading-[1.2] font-medium">
          상품 {product.id}
        </span>
      </div>

      {/* 메인 컨텐츠 — disclaimer는 항상 카드 하단 */}
      <div className="flex flex-1 flex-col justify-between gap-15">
        {/* 상단 콘텐츠 — Figma: gap-24px (icon+button group → benefits) */}
        <div className="flex flex-col gap-6">
          {/* 아이콘+제목+크레딧+가격+버튼 — Figma: 할인 없음 gap-40px / 할인 있음 gap-[22px] */}
          <div className={cn('flex flex-col', product.discount ? 'gap-5.5' : 'gap-10')}>
            {/* 아이콘+제목 / 크레딧+가격 — Figma: gap-16px */}
            <div className="flex flex-col gap-4">
              {/* 아이콘 + 제목 */}
              <div className="flex items-end gap-0">
                <Image
                  src="/images/icons/credit.svg"
                  alt="credit icon"
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0"
                />
                <h3 className="text-prime-500 text-xl leading-[1.3] font-semibold tracking-[-0.3px] whitespace-nowrap">
                  {product.name}
                </h3>
              </div>

              {/* 크레딧 & 가격 — Figma: gap-16px credits→price, gap-4px price→discount */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-4">
                  <p className="text-prime-700 text-base leading-[1.3] font-semibold tracking-[-0.24px]">
                    {product.credits.toLocaleString()} 크레딧
                  </p>
                  {/* 가격 행 */}
                  <div className="flex items-end gap-1 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-prime-900 text-xl leading-[1.3] font-semibold tracking-[-0.3px]">
                        {product.priceFormatted}₩
                      </span>
                      <span className="text-prime-900 text-xl leading-[1.3] font-semibold tracking-[-0.3px]">
                        (부가세 포함)
                      </span>
                    </div>
                    <span className="text-prime-500 text-xs leading-[1.2] font-normal tracking-[-0.18px]">
                      {product.paymentType}
                    </span>
                  </div>
                </div>
                {product.discount && (
                  <p className="text-success-700 text-xs leading-[1.2] font-medium tracking-[-0.18px]">
                    {product.discount}
                  </p>
                )}
              </div>
            </div>

            {/* 구매 버튼 */}
            <Button
              variant="primary"
              size="default"
              onClick={() => onPurchase(product)}
              className="w-full"
            >
              구매하기
            </Button>
          </div>

          {/* 혜택 목록 */}
          <div className="flex flex-col gap-2">
            <h4 className="text-prime-700 text-sm leading-[1.3] font-semibold tracking-[-0.21px]">
              1회 구매시 경험하시는 혜택
            </h4>
            <ul className="text-prime-500 flex flex-col gap-2 text-xs leading-[1.2] font-medium tracking-[-0.18px]">
              {product.benefits.map((benefit, idx) => (
                <li key={idx} className="ml-4.5 list-disc whitespace-nowrap">
                  <span className="leading-[1.2]">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 주의사항 — Figma: gap-60px above */}
        <p className="text-warning-500 text-center text-xs leading-[1.2] font-normal tracking-[-0.18px]">
          본 혜택은 단일 업무를 반복적으로 수행시 측정되는
          <br />
          결과값입니다. 전체 혜택이 아님을 유념하십시오.
        </p>
      </div>
    </div>
  );
}
