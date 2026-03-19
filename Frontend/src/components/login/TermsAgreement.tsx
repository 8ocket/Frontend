'use client';

import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import { CheckboxItem } from '@/shared/ui/checkbox-item';

import { TermsItem } from './TermsItem';

interface TermsAgreementProps {
  onAgree?: () => void;
}

export function TermsAgreement({ onAgree }: TermsAgreementProps) {
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreePersonalInfo, setAgreePersonalInfo] = useState(false);
  const [agreeSensitiveInfo, setAgreeSensitiveInfo] = useState(false);
  const [agreeMultiModal, setAgreeMultiModal] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);

  const handleAgreeAll = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgreeAge(next);
    setAgreePersonalInfo(next);
    setAgreeSensitiveInfo(next);
    setAgreeMultiModal(next);
    setAgreeMarketing(next);
  };

  const isAllRequired = agreeAge && agreePersonalInfo && agreeSensitiveInfo && agreeMultiModal;

  return (
    <div className="absolute top-1/2 left-1/2 w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <div className="space-y-4 sm:space-y-5">
          <p className="text-xs leading-[1.3] font-semibold tracking-tight text-[#1a222e] sm:text-sm">
            회원가입
          </p>
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-xl leading-[1.3] font-semibold tracking-tight text-[#1a222e] sm:text-2xl">
              이용약관 및 정책 동의
            </h1>
            <p className="text-xs leading-[1.2] font-medium tracking-tight text-[#1a222e] sm:text-sm">
              서비스 이용을 위해 약관에 동의해 주세요.
            </p>
          </div>
        </div>

        {/* Terms List */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-6">
            <TermsItem checked={agreeAge} onChange={setAgreeAge} label="만 14세 이상 이용 확인" required />
            <TermsItem checked={agreePersonalInfo} onChange={setAgreePersonalInfo} label="개인정보 수집 및 이용 동의" required />
            <TermsItem checked={agreeSensitiveInfo} onChange={setAgreeSensitiveInfo} label="민감정보(상담 관련 정보) 수집 및 이용 동의" required />
            <TermsItem checked={agreeMultiModal} onChange={setAgreeMultiModal} label="AI 멀티모달 데이터 처리 동의" required />
            <TermsItem checked={agreeMarketing} onChange={setAgreeMarketing} label="마케팅 정보 수신 동의" required={false} type="optional" />
          </div>

          {/* 전체 동의 */}
          <div className="flex h-11 items-center rounded-lg border border-cta-300 bg-white px-4 py-2">
            <CheckboxItem
              label="전체 동의하기"
              checked={agreeAll}
              showTag={false}
              onChange={handleAgreeAll}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onAgree}
          disabled={!isAllRequired}
          variant="primary"
          size="cta"
        >
          가입하기
        </Button>
      </div>
    </div>
  );
}
