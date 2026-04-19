'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface ReportErrorProps {
  onDismiss: () => void;
  errorMessage?: string;
}

export function ReportError({ onDismiss, errorMessage }: ReportErrorProps) {
  return (
    <div className="flex min-h-150 items-center justify-center px-4">
      <div className="w-full max-w-130 text-center">
        {/* 아이콘 */}
        <div className="bg-error-400/10 mb-8 inline-flex size-20 items-center justify-center rounded-full">
          <AlertTriangle className="text-error-400 size-10" />
        </div>

        <h2 className="text-prime-700 mb-4 text-2xl font-semibold tracking-tight">
          리포트 생성 실패
        </h2>
        <p className="text-prime-500 mb-10 text-[15px] leading-relaxed">
          리포트 생성에 실패하여 크레딧이 자동으로 복구되었습니다.
        </p>

        {/* 오류 상세 카드 */}
        <div className="border-error-300/40 mb-8 rounded-2xl border bg-white p-8 shadow-sm">
          <div className="space-y-4 text-left">
            {[
              {
                color: 'bg-error-400',
                title: '오류 원인',
                desc: errorMessage || 'AI 분석 서버와의 연결이 일시적으로 불안정합니다',
              },
              {
                color: 'bg-success-700',
                title: '크레딧 복구 완료',
                desc: '사용된 크레딧이 자동으로 환불되었습니다',
              },
              {
                color: 'bg-cta-300',
                title: '재시도 가능',
                desc: '잠시 후 다시 시도해 주세요.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className={`mt-2 size-1.5 shrink-0 rounded-full ${item.color}`} />
                <div>
                  <p className="text-prime-800 text-sm font-semibold">{item.title}</p>
                  <p className="text-prime-500 mt-0.5 text-[13px]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button onClick={onDismiss} variant="secondary" className="flex-1">
            확인
          </Button>
        </div>

        <p className="text-prime-400 mt-6 text-xs">문제가 계속되면 고객센터로 문의해주세요</p>
      </div>
    </div>
  );
}
