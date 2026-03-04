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
        'relative flex h-[401px] w-[268px] flex-col overflow-hidden rounded-lg bg-secondary-100 dark:bg-prime-800'
      )}
    >
      {/* 상품 번호 배지 - 16px 높이 */}
      <div className="absolute right-2 top-2 flex h-4 items-center justify-center rounded-lg bg-prime-900 px-2 dark:bg-secondary-100">
        <span className="text-xs font-medium leading-none text-secondary-100 dark:text-prime-900">
          {productNumber}
        </span>
      </div>

      {/* 카드 내용 - 8px padding */}
      <div className="flex flex-col gap-6 px-2 py-2">
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
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold text-prime-900 dark:text-secondary-100">
                  {price}₩
                </span>
                <span className="text-base text-prime-900 dark:text-secondary-100">
                  (부가세 포함)
                </span>
              </div>
              <span className="text-xs font-normal text-prime-500 dark:text-prime-400">
                건당 결제
              </span>

              {/* 할인 정보 */}
              {discount && (
                <p className="text-xs font-medium text-success-700 dark:text-success-500">
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
          <h4 className="text-sm font-semibold text-prime-700 dark:text-prime-300">
            1회 구매시 경험하시는 혜택
          </h4>
          <ul className="flex flex-col gap-2">
            {benefits.map((benefit, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs font-medium text-prime-500 dark:text-prime-400"
              >
                <span className="mt-0.5 shrink-0">•</span>
                <span className="break-keep">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 하단 안내 텍스트 */}
      <div className="absolute bottom-2 left-2 right-2">
        <p className="text-xs font-normal text-warning-500 dark:text-warning-500">
          혜택의 수치는 평균 사용패턴 기준이며, 개인 이용 방식에 따라 달라질 수 있습니다.
        </p>
      </div>
    </div>
  );
}
