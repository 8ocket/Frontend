'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuroraBackground from '@/shared/ui/AuroraBackground';
import { Button, CheckboxItem, TermsDetailPanel } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

type AgreementKey = 'age14' | 'personalInfo' | 'sensitiveInfo' | 'multimodal' | 'marketing';

const TERMS_LIST: { key: AgreementKey; label: string; required: boolean }[] = [
  { key: 'age14', label: '만 14세 이상 이용 확인', required: true },
  { key: 'personalInfo', label: '개인정보 수집 및 이용 동의', required: true },
  { key: 'sensitiveInfo', label: '민감정보(상담 관련 정보) 수집 및 이용 동의', required: true },
  { key: 'multimodal', label: 'AI 멀티모달 데이터 처리 동의', required: true },
  { key: 'marketing', label: '마케팅 정보 수신 동의', required: false },
];

const TERMS_CONTENT: Record<AgreementKey, React.ReactNode> = {
  age14: (
    <>
      <p className="mb-0">제1조 (목적)</p>
      <p className="mb-0">본 약관은 마인드 로그 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제2조 (연령 제한)</p>
      <p className="mb-0">본 서비스는 만 14세 이상의 회원에게만 제공됩니다. 만 14세 미만의 아동은 본 서비스를 이용할 수 없으며, 회원가입 시 연령을 확인합니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제3조 (개인정보 보호)</p>
      <p className="mb-0">회사는 회원의 개인정보를 중요시하며, 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령을 준수합니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제4조 (서비스 이용)</p>
      <p className="mb-0">회원은 본 약관에 동의함으로써 서비스를 이용할 수 있는 권리를 부여받습니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제5조 (회원의 의무)</p>
      <p>회원은 본 약관 및 관계 법령을 준수하여야 하며, 서비스 이용 시 타인의 권리를 침해하거나 불법적인 행위를 하여서는 안됩니다.</p>
    </>
  ),
  personalInfo: (
    <>
      <p className="mb-0">제1조 (수집 항목)</p>
      <p className="mb-0">회사는 서비스 제공을 위해 이메일 주소, 닉네임, 프로필 이미지 등 최소한의 개인정보를 수집합니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제2조 (수집 목적)</p>
      <p className="mb-0">수집된 개인정보는 회원 식별 및 서비스 제공, 고객 지원, 서비스 개선 목적으로만 이용됩니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제3조 (보유 기간)</p>
      <p className="mb-0">개인정보는 회원 탈퇴 시까지 보유하며, 탈퇴 후 지체 없이 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제4조 (제3자 제공)</p>
      <p className="mb-0">회사는 회원의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의한 경우는 예외로 합니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제5조 (권리 및 의무)</p>
      <p>회원은 언제든지 자신의 개인정보를 조회, 수정, 삭제 요청할 수 있으며, 회사는 이에 신속히 응대합니다.</p>
    </>
  ),
  sensitiveInfo: (
    <>
      <p className="mb-0">제1조 (수집 항목)</p>
      <p className="mb-0">회사는 맞춤형 심리 상담 서비스 제공을 위해 상담 내용, 감정 분석 데이터 등 민감정보를 수집합니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제2조 (수집 목적)</p>
      <p className="mb-0">수집된 민감정보는 개인화된 심리 상담 서비스 제공 및 서비스 품질 향상을 위해서만 이용됩니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제3조 (보유 기간)</p>
      <p className="mb-0">민감정보는 회원 탈퇴 시까지 보유하며, 탈퇴 즉시 안전하게 파기합니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제4조 (보호 조치)</p>
      <p className="mb-0">회사는 민감정보 보호를 위해 암호화 저장, 접근 권한 제한 등 기술적·관리적 보호 조치를 시행합니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제5조 (동의 철회)</p>
      <p>회원은 언제든지 민감정보 수집 및 이용 동의를 철회할 수 있으며, 동의 철회 시 관련 서비스 이용이 제한될 수 있습니다.</p>
    </>
  ),
  multimodal: (
    <>
      <p className="mb-0">제1조 (처리 항목)</p>
      <p className="mb-0">회사는 AI 기반 서비스 제공을 위해 텍스트, 음성, 이미지 등 멀티모달 데이터를 처리합니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제2조 (처리 목적)</p>
      <p className="mb-0">멀티모달 데이터는 AI 기반 감정 분석 및 맞춤형 상담 서비스 향상을 위해 이용됩니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제3조 (처리 방식)</p>
      <p className="mb-0">수집된 데이터는 익명화 처리 후 AI 모델 학습에 활용되며, 개인 식별이 불가능한 형태로만 사용됩니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제4조 (보유 기간)</p>
      <p className="mb-0">멀티모달 데이터는 처리 목적 달성 후 즉시 파기하며, 익명화된 학습 데이터는 서비스 운영 기간 동안 보관합니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제5조 (동의 철회)</p>
      <p>동의 철회 시 AI 기반 기능 이용이 제한될 수 있으며, 기존 처리된 익명화 데이터는 삭제가 어려울 수 있습니다.</p>
    </>
  ),
  marketing: (
    <>
      <p className="mb-0">제1조 (수신 항목)</p>
      <p className="mb-0">이벤트, 프로모션, 신규 서비스 업데이트 등 마케팅 정보를 수신합니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제2조 (수신 방법)</p>
      <p className="mb-0">마케팅 정보는 앱 푸시 알림 및 이메일을 통해 발송됩니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제3조 (선택 동의)</p>
      <p className="mb-0">본 동의는 선택 사항으로, 동의를 거부하셔도 서비스 이용에 아무런 제한이 없습니다.</p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">제4조 (동의 철회)</p>
      <p>마케팅 정보 수신 동의는 앱 내 설정 또는 고객센터를 통해 언제든지 철회할 수 있습니다.</p>
    </>
  ),
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
    <AuroraBackground>
      <div className="min-h-screen-safe relative w-full overflow-y-auto px-0 py-0">

      {/* 모바일: 세로 스택, 데스크톱: 좌측 고정 */}
      <div className="relative z-10 flex w-full flex-col gap-12 px-6 py-8 md:absolute md:top-1/2 md:left-[12.5%] md:w-89.5 md:-translate-y-1/2 md:px-0 md:py-0">
        {/* 헤더 */}
        <div className="flex flex-col gap-4.75">
          <div className="flex items-center justify-between">
            <p className="text-prime-900 text-[20px] leading-[1.3] font-semibold tracking-[-0.3px]">
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
            className="border-cta-300 bg-interactive-glass-blue-50 flex h-11 items-center gap-2 rounded-xl border px-3.75"
          >
            <div
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-300 transition-colors',
                allAgree ? 'bg-cta-300' : 'bg-white'
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
        <div className="fixed inset-0 z-20 bg-white/95 p-4 md:absolute md:inset-auto md:top-[20.1%] md:left-[35.3%] md:h-[59.8vh] md:w-[50.4%] md:bg-transparent md:p-0">
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
      </div>
    </AuroraBackground>
  );
}
