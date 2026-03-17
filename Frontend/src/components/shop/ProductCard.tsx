import React from 'react';

interface ProductCard1Props {
  onPurchase: () => void;
}

/**
 * 상품 01 - 소형 상품 (하드코딩)
 * Figma: 1738:3816, 1738:3819
 */
export function ProductCard({ onPurchase }: ProductCard1Props) {
  return (
    <div className="bg-secondary-100 relative h-[401px] w-[268px] overflow-clip rounded-lg">
      {/* Badge */}
      <div className="bg-prime-900 absolute top-0 right-0 z-10 flex h-4 items-center justify-center rounded-lg px-2 py-2">
        <span className="text-inverse text-xs leading-[1.2] font-medium">상품 01</span>
      </div>

      {/* Main Content Container */}
      <div className="absolute top-2 left-2 flex w-[252px] flex-col gap-[60px]">
        {/* Top Section */}
        <div className="flex w-full flex-col gap-[24px]">
          {/* Inner Group */}
          <div className="flex w-full flex-col gap-[40px]">
            {/* Icon & Title + Credits & Price */}
            <div className="flex w-full flex-col gap-[16px]">
              {/* Icon & Title Row */}
              <div className="flex items-end gap-0">
                <img
                  src="/images/icons/credit.svg"
                  alt="credit icon"
                  className="h-12 w-12 flex-shrink-0"
                />
                <h3 className="text-prime-500 text-xl leading-[1.3] font-semibold tracking-[-0.3px] whitespace-nowrap">
                  소형 상품
                </h3>
              </div>

              {/* Credits & Price */}
              <div className="flex w-full flex-col gap-[16px]">
                <div className="text-prime-700 text-base leading-[1.3] font-semibold tracking-[-0.24px]">
                  300 크레딧
                </div>

                {/* Price Row */}
                <div className="flex items-end gap-[6px] whitespace-nowrap">
                  <div className="flex items-center gap-[8px]">
                    <span className="text-prime-900 text-xl leading-[1.3] font-semibold tracking-[-0.3px]">
                      3,300₩
                    </span>
                    <span className="text-prime-900 text-xl leading-[1.3] font-semibold tracking-[-0.3px]">
                      (부가세 포함)
                    </span>
                  </div>
                  <span className="text-prime-500 text-xs leading-[1.2] font-normal tracking-[-0.18px]">
                    건당 결제
                  </span>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={onPurchase}
              className="bg-cta-300 hover:bg-opacity-90 text-inverse w-full overflow-clip rounded-lg px-[24px] py-[14px] text-base leading-none font-medium"
            >
              구매하기
            </button>
          </div>

          {/* Benefits Section */}
          <div className="flex w-[199px] flex-col gap-2">
            <h4 className="text-prime-700 text-sm leading-[1.3] font-semibold tracking-[-0.21px]">
              1회 구매시 경험하시는 혜택
            </h4>
            <ul className="text-prime-500 flex flex-col gap-[8px] text-xs leading-[1.2] font-medium tracking-[-0.18px]">
              <li className="ml-[18px] list-disc whitespace-nowrap">
                <span className="leading-[1.2]">추가 상담권 4번 구매 가능(280크레딧)</span>
              </li>
              <li className="ml-[18px] list-disc whitespace-nowrap">
                <span className="leading-[1.2]">디자인 1종 해금(200크레딧)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-warning-500 w-full text-xs leading-[1.2] font-normal tracking-[-0.18px]">
          혜택의 수치는 평균 사용패턴 기준이며, 개인 이용 방식에 따라 달라질 수 있습니다.
        </div>
      </div>
    </div>
  );
}

/**
 * 상품 02 - 중형 상품 (하드코딩)
 * Figma: 1738:3816, 1738:3819
 */
export function ProductCard2({ onPurchase }: ProductCard1Props) {
  return (
    <div className="bg-secondary-100 relative h-[401px] w-[268px] overflow-clip rounded-lg">
      {/* Badge */}
      <div className="bg-prime-900 absolute top-0 right-0 z-10 flex h-4 items-center justify-center rounded-lg px-2 py-2">
        <span className="text-inverse text-xs leading-[1.2] font-medium">상품 02</span>
      </div>

      {/* Main Content Container */}
      <div className="absolute top-2 left-2 flex w-[252px] flex-col gap-[19px]">
        {/* Top Section */}
        <div className="flex w-full flex-col gap-[24px]">
          {/* Inner Group */}
          <div className="flex w-full flex-col gap-[40px]">
            {/* Icon & Title + Credits & Price */}
            <div className="flex w-full flex-col gap-[16px]">
              {/* Icon & Title Row */}
              <div className="flex items-end gap-0">
                <img
                  src="/images/icons/credit.svg"
                  alt="credit icon"
                  className="h-12 w-12 flex-shrink-0"
                />
                <h3 className="text-prime-500 text-xl leading-[1.3] font-semibold tracking-[-0.3px] whitespace-nowrap">
                  중형 상품
                </h3>
              </div>

              {/* Credits & Price */}
              <div className="flex w-full flex-col gap-[16px]">
                <div className="text-prime-700 text-base leading-[1.3] font-semibold tracking-[-0.24px]">
                  1000 크레딧
                </div>

                {/* Price Row */}
                <div className="flex items-end gap-[6px] whitespace-nowrap">
                  <div className="flex items-center gap-[8px]">
                    <span className="text-prime-900 text-xl leading-[1.3] font-semibold tracking-[-0.3px]">
                      9,900₩
                    </span>
                    <span className="text-prime-900 text-xl leading-[1.3] font-semibold tracking-[-0.3px]">
                      (부가세 포함)
                    </span>
                  </div>
                  <span className="text-prime-500 text-xs leading-[1.2] font-normal tracking-[-0.18px]">
                    정당 결제
                  </span>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={onPurchase}
              className="bg-cta-300 hover:bg-opacity-90 text-inverse w-full overflow-clip rounded-lg px-[24px] py-[14px] text-base leading-none font-medium"
            >
              구매하기
            </button>
          </div>

          {/* Benefits Section */}
          <div className="flex w-[199px] flex-col gap-2">
            <h4 className="text-prime-700 text-sm leading-[1.3] font-semibold tracking-[-0.21px]">
              1회 구매시 경험하시는 혜택
            </h4>
            <ul className="text-prime-500 flex flex-col gap-[8px] text-xs leading-[1.2] font-medium tracking-[-0.18px]">
              <li className="ml-[18px] list-disc whitespace-nowrap">
                <span className="leading-[1.2]">추가 상담권 14번 구매 가능(800크레딧)</span>
              </li>
              <li className="ml-[18px] list-disc whitespace-nowrap">
                <span className="leading-[1.2]">디자인 6종 해금(1000크레딧)</span>
              </li>
              <li className="ml-[18px] list-disc whitespace-nowrap">
                <span className="leading-[1.2]">월간 리포트 2개 발급(800크레딧)</span>
              </li>
              <li className="ml-[18px] list-disc whitespace-nowrap">
                <span className="leading-[1.2]">월간 리포트 1번 분석(800크레딧)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-warning-500 w-full text-xs leading-[1.2] font-normal tracking-[-0.18px]">
          혜택의 수치는 평균 사용패턴 기준이며, 개인 이용 방식에 따라 달라질 수 있습니다.
        </div>
      </div>
    </div>
  );
}
