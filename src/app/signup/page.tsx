'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/navigation';
import AuroraBackground from '@/shared/ui/AuroraBackground';
import { Button, CheckboxItem, TermsDetailPanel } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import {
  AgreementKey,
  TERMS_GROUPS,
  TERMS_LIST,
  TermsGroup,
  TERMS_CONTENT,
} from '@/shared/constants/terms';

export default function SignupPage() {
  const router = useRouter();
  const [selectedTerm, setSelectedTerm] = useState<AgreementKey | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem('pendingSignup')) {
      router.replace('/');
    }
  }, [router]);
  const [agreements, setAgreements] = useState<Record<AgreementKey, boolean>>(
    () => Object.fromEntries(TERMS_LIST.map((t) => [t.key, false])) as Record<AgreementKey, boolean>
  );

  const allAgree = Object.values(agreements).every(Boolean);

  const handleToggleAll = () => {
    const newState = !allAgree;
    setAgreements(
      Object.fromEntries(TERMS_LIST.map((t) => [t.key, newState])) as Record<AgreementKey, boolean>
    );
  };

  const handleToggleGroup = (group: TermsGroup) => {
    const allChecked = group.items.every((item) => agreements[item.key]);
    const newAgreements = { ...agreements };
    group.items.forEach((item) => {
      newAgreements[item.key] = !allChecked;
    });
    setAgreements(newAgreements);
  };

  const handleToggleAgreement = (key: AgreementKey) => {
    setAgreements({ ...agreements, [key]: !agreements[key] });
  };

  const handleTermClick = (key: AgreementKey) => {
    setSelectedTerm((prev) => (prev === key ? null : key));
  };

  const getNextTerm = (key: AgreementKey): AgreementKey | null => {
    const currentIndex = TERMS_LIST.findIndex((t) => t.key === key);
    return TERMS_LIST[currentIndex + 1]?.key ?? null;
  };

  const handleAgree = (key: AgreementKey) => {
    setAgreements({ ...agreements, [key]: true });
    setSelectedTerm(getNextTerm(key));
  };

  const handleDisagree = (key: AgreementKey) => {
    setAgreements({ ...agreements, [key]: false });
    setSelectedTerm(getNextTerm(key));
  };

  const isAllRequiredAgree = TERMS_GROUPS.filter((g) => g.required)
    .flatMap((g) => g.items)
    .every((item) => agreements[item.key]);

  const handleNext = () => {
    if (!isAllRequiredAgree) return;
    router.push('/signup/nickname');
  };

  return (
    <AuroraBackground>
      <div className="min-h-screen-safe relative w-full overflow-y-auto">
        {/* 모바일/태블릿: 세로 스택, 데스크톱(lg+): 좌우 flex */}
        <div className="relative z-10 flex min-h-screen-safe flex-col lg:flex-row lg:items-center lg:justify-start lg:gap-10 lg:pl-[12.5%] lg:pr-[2%]">
        <div className="flex w-full flex-col gap-12 px-6 py-8 md:absolute md:top-1/2 md:left-[12.5%] md:w-89.5 md:-translate-y-1/2 md:px-0 md:py-0 md:max-h-[90vh] md:overflow-y-auto lg:relative lg:top-auto lg:left-auto lg:translate-y-0 lg:shrink-0 lg:w-89.5">
          {/* 헤더 */}
          <div className="flex flex-col gap-4.75">
            <div className="flex items-center justify-between">
              <p className="text-prime-900 text-[20px] leading-[1.3] font-semibold tracking-[-0.3px]">
                회원가입
              </p>
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-cta-300 flex h-6 w-6 items-center justify-center overflow-hidden rounded-full"
              >
                <Image src="/images/icons/Back.png" alt="뒤로가기" width={24} height={24} />
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="text-prime-900 text-[24px] leading-[1.3] font-semibold tracking-[-0.36px]">
                이용약관 및 정책 동의
              </p>
              <p className="text-prime-900 text-[12px] leading-[1.2] font-medium tracking-[-0.18px]">
                서비스 이용을 위해 약관에 동의해 주세요.
              </p>
            </div>
          </div>

          {/* 약관 동의 목록 */}
          <div className="flex flex-col gap-8">
            <p className="text-[11px] text-prime-500">
              <span className="text-error-500">*</span> 표시 항목은 필수 동의 항목입니다.
            </p>
            <div className="flex flex-col gap-6">
              {TERMS_GROUPS.map((group) => {
                const isMulti = group.items.length > 1;
                const groupChecked = group.items.every((item) => agreements[item.key]);
                const groupIndeterminate =
                  !groupChecked && group.items.some((item) => agreements[item.key]);
                return (
                  <div key={group.label} className="flex flex-col gap-3">
                    {isMulti && (
                      <button
                        type="button"
                        onClick={() => handleToggleGroup(group)}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-300 transition-colors',
                            groupChecked ? 'bg-cta-300' : 'bg-secondary-100'
                          )}
                        >
                          {groupChecked && (
                            <span className="text-secondary-100 text-[12px] leading-none font-semibold">✓</span>
                          )}
                          {groupIndeterminate && (
                            <span className="text-neutral-400 text-[12px] leading-none font-semibold">-</span>
                          )}
                        </div>
                        <span className="text-prime-800 text-base font-medium">
                          {group.label}
                        </span>
                        <span className={cn('text-base font-medium', group.required ? 'text-error-500' : 'text-warning-500')}>
                          {group.required ? '*' : '(선택)'}
                        </span>
                      </button>
                    )}
                    <div className={cn('flex flex-col gap-3', isMulti && 'ml-6')}>
                      {group.items.map((item) => (
                        <CheckboxItem
                          key={item.key}
                          label={item.label}
                          required={group.required}
                          showTag={!isMulti}
                          checked={agreements[item.key]}
                          onChange={() => handleToggleAgreement(item.key)}
                          onLabelClick={() => handleTermClick(item.key)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 전체 동의 */}
            <button
              type="button"
              onClick={handleToggleAll}
              className="border-cta-300 bg-interactive-glass-blue-50 flex h-11 items-center gap-2 rounded-xl border px-3.75"
            >
              <div
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-300 transition-colors',
                  allAgree ? 'bg-cta-300' : 'bg-secondary-100'
                )}
              >
                {allAgree && (
                  <span className="text-secondary-100 text-[12px] leading-none font-semibold">✓</span>
                )}
              </div>
              <span className="text-secondary-100 text-[16px] leading-none font-medium">
                전체 동의하기
              </span>
            </button>
          </div>

          {/* 가입하기 버튼 */}
          <Button
            onClick={handleNext}
            disabled={!isAllRequiredAgree}
            variant="primary"
            size="cta"
          >
            가입하기
          </Button>
        </div>

          {/* 우측: 약관 세부내용 패널 — 모바일: 전체화면 오버레이, 데스크톱: flex 우측 패널 */}
          {selectedTerm && (
            <div className="fixed inset-0 z-20 bg-white/95 p-4 lg:inset-auto lg:top-1/2 lg:right-[6%] lg:max-h-[90vh] lg:h-[62vh] lg:w-[44%] lg:-translate-y-1/2 lg:bg-transparent lg:p-0">
              <TermsDetailPanel
                key={selectedTerm}
                title={TERMS_LIST.find((t) => t.key === selectedTerm)!.label}
                required={TERMS_GROUPS.find((g) => g.items.some((i) => i.key === selectedTerm))?.required}
                onClose={() => setSelectedTerm(null)}
                onAgree={() => handleAgree(selectedTerm)}
                onDisagree={() => handleDisagree(selectedTerm)}
                isAgreed={agreements[selectedTerm]}
              >
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {TERMS_CONTENT[selectedTerm]}
                  </ReactMarkdown>
                </div>
              </TermsDetailPanel>
            </div>
          )}
        </div>
      </div>
    </AuroraBackground>
  );
}
