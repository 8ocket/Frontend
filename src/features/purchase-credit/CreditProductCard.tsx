import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import type { CreditProduct } from '@/types/credit';

interface CreditProductCardProps {
  product: CreditProduct;
  onPurchase: (product: CreditProduct) => void;
  className?: string;
}

export function CreditProductCard({ product, onPurchase, className }: CreditProductCardProps) {
  return (
    <div
      className={cn(
        'border-prime-100 flex w-full flex-col overflow-clip rounded-2xl border bg-white p-8 shadow-sm transition-colors',
        'hover:border-prime-200 hover:bg-secondary-50 *:transition-colors',
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-8">
        {/* 상단 영역: 이름 및 가격 정보 */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-prime-600 text-xl font-semibold tracking-tight">
              {product.name} 상품
            </h3>
            <div className="bg-prime-200 h-[1px] w-full" /> {/* 시각적 구분선 추가 */}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-prime-800 text-2xl font-bold tracking-tight">
              {product.credits.toLocaleString()} 크레딧
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-prime-950 text-3xl font-black">{product.priceFormatted}₩</span>
              <span className="text-prime-400 text-sm font-medium">(부가세 포함)</span>
            </div>
            {product.discount && (
              <p className="text-success-700 bg-success-50 w-fit rounded-md px-2 py-0.5 text-xs font-semibold">
                {product.discount}
              </p>
            )}
          </div>
        </div>

        {/* 중앙 영역: 혜택 리스트 (flex-1로 버튼을 하단 밀기) */}
        <div className="flex flex-1 flex-col gap-5">
          <h4 className="text-prime-700 text-sm font-bold">1회 구매 시 제공 혜택</h4>
          <ul className="text-prime-600 flex flex-col gap-3 text-[13px] leading-relaxed">
            {product.benefits.map((benefit, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-prime-300">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 하단 영역: 액션 및 안내 */}
        <div className="mt-auto flex flex-col gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onPurchase(product)}
            className="w-full py-6 text-base font-bold shadow-sm"
          >
            구매하기
          </Button>

          <p className="text-warning-500 text-center text-[11px] leading-normal opacity-90">
            혜택의 수치는 평균 사용패턴 기준이며, <br />
            개인 이용 방식에 따라 달라질 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
