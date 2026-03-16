'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WaveBackground from '@/components/common/WaveBackground';
import { Button, CheckboxItem, TermsDetailPanel } from '@/components/ui';
import { cn } from '@/lib/utils';

type AgreementKey = 'age14' | 'personalInfo' | 'sensitiveInfo' | 'multimodal' | 'marketing';

const TERMS_LIST: { key: AgreementKey; label: string; required: boolean }[] = [
  { key: 'age14', label: '만 14세 이상 이용 확인', required: true },
  { key: 'personalInfo', label: '개인정보 수집 및 이용 동의', required: true },
  { key: 'sensitiveInfo', label: '민감정보(상담 관련 정보) 수집 및 이용 동의', required: true },
  { key: 'multimodal', label: 'AI 멀티모달 데이터 처리 동의', required: true },
  { key: 'marketing', label: '마케팅 정보 수신 동의', required: false },
];

// TODO: 실제 약관 내용으로 교체
const TERMS_CONTENT: Record<AgreementKey, string> = {
  age14:
    '만 14세 이상의 이용자만 본 서비스를 이용할 수 있습니다. 본 서비스는 만 14세 미만 아동의 개인정보를 수집하지 않으며, 만 14세 미만임이 확인된 경우 즉시 해당 정보를 삭제합니다.',
  personalInfo:
    '개인정보 수집 및 이용에 관한 안내입니다. 수집 항목: 이메일, 닉네임, 프로필 이미지. 수집 목적: 회원 식별 및 서비스 제공. 보유 기간: 회원 탈퇴 시까지.',
  sensitiveInfo:
    '민감정보(상담 관련 정보) 수집 및 이용에 관한 안내입니다. 수집 항목: 상담 내용, 감정 분석 데이터. 수집 목적: 맞춤형 심리 상담 서비스 제공. 보유 기간: 회원 탈퇴 시까지.',
  multimodal:
    'AI 멀티모달 데이터 처리에 관한 안내입니다. 처리 항목: 텍스트, 음성, 이미지 데이터. 처리 목적: AI 기반 감정 분석 및 상담 서비스 향상. 처리 방식: 익명화 후 모델 학습에 활용.',
  marketing:
    '마케팅 정보 수신에 관한 안내입니다. 수신 항목: 이벤트, 프로모션, 서비스 업데이트 알림. 수신 방법: 앱 푸시, 이메일. 동의를 거부하셔도 서비스 이용에 제한은 없습니다.',
};

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [allAgree, setAllAgree] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<AgreementKey | null>(null);
  const [agreements, setAgreements] = useState<Record<AgreementKey, boolean>>({
    age14: false,
    personalInfo: false,
    sensitiveInfo: false,
    multimodal: false,
    marketing: false,
  });

  const handleToggleAll = () => {
    const newState = !allAgree;
    setAllAgree(newState);
    setAgreements({
      age14: newState,
      personalInfo: newState,
      sensitiveInfo: newState,
      multimodal: newState,
      marketing: newState,
    });
  };

  const handleToggleAgreement = (key: AgreementKey) => {
    const newAgreements = { ...agreements, [key]: !agreements[key] };
    setAgreements(newAgreements);
    const allChecked = Object.values(newAgreements).every(Boolean);
    setAllAgree(allChecked);
  };

  const handleAgree = (key: AgreementKey) => {
    const newAgreements = { ...agreements, [key]: true };
    setAgreements(newAgreements);
    const allChecked = Object.values(newAgreements).every(Boolean);
    setAllAgree(allChecked);
    setSelectedTerm(null);
  };

  const handleTermClick = (key: AgreementKey) => {
    setSelectedTerm((prev) => (prev === key ? null : key));
  };

  const isAllRequiredAgree =
    agreements.age14 &&
    agreements.personalInfo &&
    agreements.sensitiveInfo &&
    agreements.multimodal;

  const handleNext = () => {
    if (!isAllRequiredAgree) return;
    try {
      setIsLoading(true);
      router.push('/signup/nickname');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen-safe relative w-full overflow-y-auto bg-white dark:bg-prime-950">
      <WaveBackground />

      {/* 모바일: 세로 스택, 데스크톱: 좌측 고정 */}
      <div className="relative z-10 flex w-full flex-col gap-12 px-6 py-8 md:absolute md:top-1/2 md:left-[12.5%] md:w-89.5 md:-translate-y-1/2 md:px-0 md:py-0">
        {/* 헤더 */}
        <div className="flex flex-col gap-4.75">
          <div className="flex items-center justify-between">
            <p className="text-prime-900 dark:text-secondary-100 text-[20px] leading-[1.3] font-semibold tracking-[-0.3px]">
              회원가입
            </p>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-cta-300 flex h-6 w-6 items-center justify-center overflow-hidden rounded-3xl"
            >
              <svg
                width="15"
                height="14"
                viewBox="0 0 15 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2L5 7L10 12"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-prime-900 dark:text-secondary-100 text-[24px] leading-[1.3] font-semibold tracking-[-0.36px]">
              이용약관 및 정책 동의
            </p>
            <p className="text-prime-900 dark:text-prime-300 text-[12px] leading-[1.2] font-medium tracking-[-0.18px]">
              서비스 이용을 위해 약관에 동의해 주세요.
            </p>
          </div>
        </div>

        {/* 약관 동의 목록 */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            {TERMS_LIST.map((term) => (
              <CheckboxItem
                key={term.key}
                label={term.label}
                required={term.required}
                checked={agreements[term.key]}
                onChange={() => handleToggleAgreement(term.key)}
                onLabelClick={() => handleTermClick(term.key)}
              />
            ))}
          </div>

          {/* 전체 동의 */}
          <button
            type="button"
            onClick={handleToggleAll}
            className="border-cta-300 bg-interactive-glass-blue-50 dark:bg-prime-800/50 flex h-11 items-center gap-2 rounded-xl border px-3.75"
          >
            <div
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-300 transition-colors',
                allAgree ? 'bg-cta-300' : 'bg-white dark:bg-prime-700'
              )}
            >
              {allAgree && <span className="text-secondary-100 text-[12px] leading-[1.6]">✓</span>}
            </div>
            <span className="text-secondary-100 text-[16px] leading-none font-medium">
              전체 동의하기
            </span>
          </button>
        </div>

        {/* 가입하기 버튼 */}
        <Button
          onClick={handleNext}
          disabled={!isAllRequiredAgree || isLoading}
          variant="primary"
          size="cta"
        >
          {isLoading ? '처리 중...' : '가입하기'}
        </Button>
      </div>

      {/* 우측: 약관 세부내용 패널 — 모바일: 전체화면 오버레이, 데스크톱: 우측 패널 */}
      {selectedTerm && (
        <div className="fixed inset-0 z-20 bg-white/95 dark:bg-prime-950/95 p-4 md:absolute md:inset-auto md:top-[20.1%] md:left-[35.3%] md:h-[59.8vh] md:w-[50.4%] md:bg-transparent md:dark:bg-transparent md:p-0">
          <TermsDetailPanel
            title={TERMS_LIST.find((t) => t.key === selectedTerm)!.label}
            onClose={() => setSelectedTerm(null)}
            onAgree={() => handleAgree(selectedTerm)}
            isAgreed={agreements[selectedTerm]}
          >
            <p>{TERMS_CONTENT[selectedTerm]}</p>
          </TermsDetailPanel>
        </div>
      )}
    </main>
  );
}
