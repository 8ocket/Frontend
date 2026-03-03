'use client';

import { useState } from 'react';
import { TermsItem } from './TermsItem';
import { TermsCheckbox } from './TermsCheckbox';

interface TermsAgreementProps {
  onAgree?: () => void;
  onCancel?: () => void;
}

export function TermsAgreement({ onAgree, onCancel }: TermsAgreementProps) {
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreePersonalInfo, setAgreePersonalInfo] = useState(false);
  const [agreeSensitiveInfo, setAgreeSensitiveInfo] = useState(false);
  const [agreeMultiModal, setAgreeMultiModal] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeAge(checked);
    setAgreePersonalInfo(checked);
    setAgreeSensitiveInfo(checked);
    setAgreeMultiModal(checked);
    setAgreeMarketing(checked);
  };

  const isAllRequired = agreeAge && agreePersonalInfo && agreeSensitiveInfo && agreeMultiModal;
  const isSignupEnabled = isAllRequired;

  return (
    <div className="absolute top-1/2 left-1/2 w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2">
      {/* Left Panel - Terms */}
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
          {/* Terms Items */}
          <div className="space-y-6">
            <TermsItem
              checked={agreeAge}
              onChange={setAgreeAge}
              label="만 14세 이상 이용 확인"
              required
            />
            <TermsItem
              checked={agreePersonalInfo}
              onChange={setAgreePersonalInfo}
              label="개인정보 수집 및 이용 동의"
              required
            />
            <TermsItem
              checked={agreeSensitiveInfo}
              onChange={setAgreeSensitiveInfo}
              label="민감정보(상담 관련 정보) 수집 및 이용 동의"
              required
            />
            <TermsItem
              checked={agreeMultiModal}
              onChange={setAgreeMultiModal}
              label="AI 멀티모달 데이터 처리 동의"
              required
            />
            <TermsItem
              checked={agreeMarketing}
              onChange={setAgreeMarketing}
              label="마케팅 정보 수신 동의"
              required={false}
              type="optional"
            />
          </div>

          {/* Agree All */}
          <div className="flex h-11 items-center rounded-lg border border-[#82c9ff] bg-white px-4 py-2">
            <div className="flex items-center gap-2">
              <TermsCheckbox checked={agreeAll} onChange={handleAgreeAll} />
              <span className="text-base leading-none font-medium text-[#1a222e]">
                전체 동의하기
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onAgree}
          disabled={!isSignupEnabled}
          className={`h-11 w-full rounded-[22px] text-base leading-[1.3] font-medium transition-opacity duration-200 ${
            isSignupEnabled ? 'bg-[#82c9ff] text-white hover:opacity-90' : 'bg-[#cacaca] text-white'
          }`}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
