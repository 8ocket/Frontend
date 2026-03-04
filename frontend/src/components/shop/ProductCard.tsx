import React from 'react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  productNumber: string;
  productName: string;
  credits: number;
  price: string;
  discount?: string;
  benefits: string[];
  onPurchase: () => void;
}

/**
 * 크레딧 상품 카드 컴포넌트
 * Figma: 1738:3816, 1738:3841, 1738:3870
 */
export function ProductCard({
  productNumber,
  productName,
  credits,
  price,
  discount,
  benefits,
  onPurchase,
}: ProductCardProps) {
  return (
    <div
      className={cn(
        'bg-secondary-100 dark:bg-prime-800 relative flex h-[401px] w-[268px] flex-col overflow-hidden rounded-lg'
      )}
    >
      {/* 상품 번호 배지 */}
      <div className="bg-prime-900 dark:bg-secondary-100 absolute top-0 right-0 flex items-center justify-center rounded-lg px-2 py-1">
        <span className="text-secondary-100 dark:text-prime-900 text-xs font-medium">
          {productNumber}
        </span>
      </div>

      {/* 카드 내용 */}
      <div className="flex flex-col gap-6 p-2 pt-4">
        {/* 헤더: 아이콘 + 상품명 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-3">
            {/* 아이콘 (임시 placeholder) */}
            <div className="bg-prime-200 dark:bg-prime-700 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
              <span className="text-xl">💳</span>
            </div>
            <h3 className="text-prime-500 dark:text-prime-400 text-xl font-semibold">
              {productName}
            </h3>
          </div>

          {/* 크레딧 정보 */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-prime-700 dark:text-prime-300 text-base font-semibold">
                {credits} 크레딧
              </p>
            </div>

            {/* 가격 정보 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-end gap-2">
                <span className="text-prime-900 dark:text-secondary-100 text-xl font-semibold whitespace-nowrap">
                  {price}₩
                </span>
                <span className="text-prime-900 dark:text-secondary-100 text-lg whitespace-nowrap">
                  (부가세 포함)
                </span>
                <span className="text-prime-500 dark:text-prime-400 text-xs font-normal whitespace-nowrap">
                  건당 결제
                </span>
              </div>

              {/* 할인 정보 */}
              {discount && (
                <p className="text-success-700 dark:text-success-500 text-xs font-medium">
                  {discount}
                </p>
              )}
            </div>
          </div>

          {/* 구매 버튼 */}
          <button
            onClick={onPurchase}
            className="bg-cta-300 text-secondary-100 hover:bg-cta-400 active:bg-cta-500 dark:bg-cta-300 dark:text-prime-900 dark:hover:bg-cta-400 w-full rounded-lg px-6 py-3.5 font-medium transition-colors"
          >
            구매하기
          </button>
        </div>

        {/* 혜택 섹션 */}
        <div className="flex flex-col gap-2">
          <h4 className="text-prime-700 dark:text-prime-300 text-sm font-semibold">
            1회 구매시 경험하시는 혜택
          </h4>
          <ul className="flex flex-col gap-2">
            {benefits.map((benefit, index) => (
              <li
                key={index}
                className="text-prime-500 dark:text-prime-400 flex items-start gap-2 text-xs font-medium"
              >
                <span className="mt-0.5 shrink-0">•</span>
                <span className="flex-1 break-keep">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 하단 안내 텍스트 */}
      <div className="absolute right-2 bottom-2 left-2">
        <p className="text-warning-500 dark:text-warning-500 text-xs font-normal">
          혜택의 수치는 평균 사용패턴 기준이며, 개인 이용 방식에 따라 달라질 수 있습니다.
        </p>
      </div>
    </div>
  );
}
