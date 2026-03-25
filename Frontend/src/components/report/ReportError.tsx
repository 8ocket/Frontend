'use client';

import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface ReportErrorProps {
  onRetry: () => void;
  onDismiss: () => void;
}

export function ReportError({ onRetry, onDismiss }: ReportErrorProps) {
  return (
    <div className="flex min-h-[600px] items-center justify-center px-4">
      <div className="w-full max-w-[520px] text-center">
        {/* 아이콘 */}
        <div className="mb-8 inline-flex size-20 items-center justify-center rounded-full bg-error-400/10">
          <AlertTriangle className="size-10 text-error-400" />
        </div>

        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-prime-700">
          리포트 생성 실패
        </h2>
        <p className="mb-10 text-[15px] leading-relaxed text-prime-500">
          일시적인 오류로 리포트 생성에 실패했습니다.
          <br />
          사용된 크레딧은 자동으로 복구되었으니 안심하세요.
        </p>

        {/* 오류 상세 카드 */}
        <div className="mb-8 rounded-2xl border border-error-300/40 bg-white p-8 shadow-sm">
          <div className="space-y-4 text-left">
            {[
              {
                color: 'bg-error-400',
                title: '서버 연결 오류',
                desc: 'AI 분석 서버와의 연결이 일시적으로 불안정합니다',
              },
              {
                color: 'bg-success-700',
                title: '크레딧 복구 완료',
                desc: '사용하신 크레딧 1개가 자동으로 환불되었습니다',
              },
              {
                color: 'bg-cta-300',
                title: '재시도 가능',
                desc: '잠시 후 다시 시도해주시면 정상적으로 생성됩니다',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className={`mt-2 size-1.5 shrink-0 rounded-full ${item.color}`} />
                <div>
                  <p className="text-sm font-semibold text-prime-800">{item.title}</p>
                  <p className="mt-0.5 text-[13px] text-prime-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button onClick={onRetry} className="flex-1 gap-2">
            <RefreshCcw className="size-4" />
            다시 시도하기
          </Button>
          <Button onClick={onDismiss} variant="secondary" className="flex-1">
            확인
          </Button>
        </div>

        <p className="mt-6 text-xs text-prime-400">문제가 계속되면 고객센터로 문의해주세요</p>
      </div>
    </div>
  );
}
