'use client';

import { Button } from '@/shared/ui/button';
import { DialogRoot, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';
import { REPORT_CREDIT_COST } from '@/constants/credit';
import type { ReportType } from './types';

interface ReportCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingCredits: number;
  reportType: ReportType;
  onPurchase: () => void;
}

function CreditIcon() {
  return (
    <div className="h-12 w-12">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23 35H25V33H28C28.2833 33 28.5208 32.9042 28.7125 32.7125C28.9042 32.5208 29 32.2833 29 32V26C29 25.7167 28.9042 25.4792 28.7125 25.2875C28.5208 25.0958 28.2833 25 28 25H21V21H29V19H25V17H23V19H20C19.7167 19 19.4792 19.0958 19.2875 19.2875C19.0958 19.4792 19 19.7167 19 20V26C19 26.2833 19.0958 26.5208 19.2875 26.7125C19.4792 26.9042 19.7167 27 20 27H27V31H19V33H23V35ZM13.231 42C12.3103 42 11.5417 41.6917 10.925 41.075C10.3083 40.4583 10 39.6897 10 38.769V9.231C10 8.31033 10.3083 7.54167 10.925 6.925C11.5417 6.30833 12.3103 6 13.231 6H27.154L38 16.846V38.769C38 39.6897 37.6917 40.4583 37.075 41.075C36.4583 41.6917 35.6897 42 34.769 42H13.231Z" fill="#BD1010"/>
      </svg>
    </div>
  );
}

export function ReportCreditModal({
  isOpen,
  onClose,
  remainingCredits,
  reportType,
  onPurchase,
}: ReportCreditModalProps) {
  const required = REPORT_CREDIT_COST[reportType];
  const label = reportType === 'weekly' ? '주간 리포트' : '월간 리포트';

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} maxWidth="max-w-[350px]" className="p-6">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex w-full flex-col items-center gap-2">
              <CreditIcon />
              <DialogTitle className="heading-02 text-prime-900 w-full text-center">
                크레딧이 부족합니다
              </DialogTitle>
            </div>

            <div className="flex w-full flex-col items-center gap-4">
              <DialogDescription className="body-1 text-prime-700 w-full text-center">
                {label} 생성에 <span className="text-prime-900 font-semibold">{required.toLocaleString()}C</span>가 필요해요.
                <br />
                크레딧을 충전하고 리포트를 만들어 보세요.
              </DialogDescription>

              <div className="flex w-full flex-col items-center gap-1">
                <div className="flex flex-row items-center justify-center gap-2">
                  <span className="body-1 text-tertiary-400">잔여 크레딧 :</span>
                  <span className="body-1 text-info-600">{remainingCredits.toLocaleString()}C</span>
                </div>
                <div className="flex flex-row items-center justify-center gap-2">
                  <span className="body-1 text-tertiary-400">필요 크레딧 :</span>
                  <span className="body-1 text-error-500">{required.toLocaleString()}C</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-row items-center justify-between gap-6">
            <Button variant="secondary" onClick={onClose} className="flex-1 px-6">
              닫기
            </Button>
            <Button variant="primary" onClick={onPurchase} className="flex-1 px-6">
              충전하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
