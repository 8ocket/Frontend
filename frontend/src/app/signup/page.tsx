'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WaveBackground from '@/components/common/WaveBackground';
import { Button, CheckboxItem, SectionHeader } from '@/components/ui';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [allAgree, setAllAgree] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [agreements, setAgreements] = useState({
    age14: false,
    personalInfo: false,
    sensitiveInfo: false,
    multimodal: false,
    marketing: false,
  });

  const conditionTexts: Record<string, { title: string; required: boolean }> = {
    age14: { title: '만 14세 이상 이용 확인', required: true },
    personalInfo: { title: '개인정보 수집 및 이용 동의', required: true },
    sensitiveInfo: { title: '민감정보(상담 관련 정보) 수집 및 이용 동의', required: true },
    multimodal: { title: 'AI 멀티모달 데이터 처리 동의', required: true },
    marketing: { title: '마케팅 정보 수신 동의', required: false },
  };

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

  const handleToggleAgreement = (key: keyof typeof agreements) => {
    const newAgreements = { ...agreements, [key]: !agreements[key] };
    setAgreements(newAgreements);

    // 모든 필수 항목이 체크되었는지 확인
    const allRequired =
      newAgreements.age14 &&
      newAgreements.personalInfo &&
      newAgreements.sensitiveInfo &&
      newAgreements.multimodal;
    setAllAgree(allRequired);
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
      // 약관 동의 완료 → 닉네임 설정 페이지로 이동
      router.push('/signup/nickname');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConditionAgree = () => {
    if (!selectedCondition) return;

    const newAgreements = { ...agreements, [selectedCondition]: true };
    setAgreements(newAgreements);

    // 모든 필수 항목이 체크되었는지 확인
    const allRequired =
      newAgreements.age14 &&
      newAgreements.personalInfo &&
      newAgreements.sensitiveInfo &&
      newAgreements.multimodal;
    setAllAgree(allRequired);

    setSelectedCondition(null);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-white">
      <WaveBackground />
      <div className="absolute top-1/2 left-1/2 flex w-[1200px] -translate-x-1/2 -translate-y-1/2 justify-between">
        {/* 좌측: 회원가입 폼 */}
        <div className="flex w-[358px] flex-col">
          {/* 헤더 */}
          <div className="mb-8 flex flex-col gap-[19px]">
            <h2 className="text-prime-900 text-lg leading-[1.3] font-semibold tracking-[-0.3px]">
              회원가입
            </h2>
            <div className="flex flex-col gap-2">
              <h1 className="text-prime-900 text-2xl leading-[1.3] font-semibold tracking-[-0.36px]">
                이용약관 및 정책 동의
              </h1>
              <p className="text-prime-500 text-xs leading-[1.2] font-medium tracking-[-0.18px]">
                서비스 이용을 위해 약관에 동의해 주세요.
              </p>
            </div>
          </div>

          {/* 약관 동의 목록 */}
          <div className="mb-8 flex flex-col gap-8">
            {/* 약관 체크박스들 */}
            <div className="flex flex-col gap-6">
              {/* 만 14세 이상 이용 확인 */}
              <CheckboxItem
                label="만 14세 이상 이용 확인"
                required
                checked={agreements.age14}
                onChange={() => handleToggleAgreement('age14')}
                onViewClick={() => setSelectedCondition('age14')}
              />

              {/* 개인정보 수집 및 이용 동의 */}
              <CheckboxItem
                label="개인정보 수집 및 이용 동의"
                required
                checked={agreements.personalInfo}
                onChange={() => handleToggleAgreement('personalInfo')}
                onViewClick={() => setSelectedCondition('personalInfo')}
              />

              {/* 민감정보 수집 및 이용 동의 */}
              <CheckboxItem
                label="민감정보(상담 관련 정보) 수집 및 이용 동의"
                required
                checked={agreements.sensitiveInfo}
                onChange={() => handleToggleAgreement('sensitiveInfo')}
                onViewClick={() => setSelectedCondition('sensitiveInfo')}
              />

              {/* AI 멀티모달 데이터 처리 동의 */}
              <CheckboxItem
                label="AI 멀티모달 데이터 처리 동의"
                required
                checked={agreements.multimodal}
                onChange={() => handleToggleAgreement('multimodal')}
                onViewClick={() => setSelectedCondition('multimodal')}
              />
                  <input
                    type="checkbox"
                    checked={agreements.multimodal}
                    onChange={() => handleToggleAgreement('multimodal')}
                    className="accent-cta-300 mt-0.5 h-5 w-5 rounded"
                  />
                  <span className="text-prime-800 text-base leading-[1.4] font-medium">
                    AI 멀티모달 데이터 처리 동의 (<span className="text-cta-300">필수</span>)
                  </span>
                </label>
                <button
                  onClick={() => setSelectedCondition('multimodal')}
                  className="text-cta-300 hover:text-cta-500 mt-0.5 text-xs font-medium whitespace-nowrap"
                >
                  약관보기
                </button>
              </div>

              {/* 마케팅 정보 수신 동의 */}
              <CheckboxItem
                label="마케팅 정보 수신 동의"
                checked={agreements.marketing}
                onChange={() => handleToggleAgreement('marketing')}
                onViewClick={() => setSelectedCondition('marketing')}
              />
            </div>

            {/* 전체 동의 */}
            <button
              onClick={handleToggleAll}
              className="border-cta-300 hover:bg-cta-100 flex h-11 items-center gap-3 rounded-lg border-2 bg-white px-4 py-3 transition-colors"
            >
              <input
                type="checkbox"
                checked={allAgree}
                readOnly
                className="accent-cta-300 h-5 w-5 rounded"
              />
              <span className="text-prime-800 text-base leading-none font-medium">
                전체 동의하기
              </span>
            </button>
          </div>

          {/* 다음 버튼 */}
          <Button
            onClick={handleNext}
            disabled={!isAllRequiredAgree || isLoading}
            variant="primary"
            size="cta"
          >
            {isLoading ? '처리 중...' : '가입하기'}
          </Button>
        </div>

        {/* 우측: 약관 모달 */}
        <div className="h-[646px] w-[602px]">
          {selectedCondition && (
            <div className="border-secondary-200 relative flex h-full flex-col rounded-3xl border bg-white p-6 shadow-lg backdrop-blur-[20px]">
              {/* 헤더 */}
              <div className="border-secondary-200 mb-6 flex items-center justify-between border-b pb-4">
                <h2 className="text-prime-900 text-lg leading-[1.3] font-semibold">
                  {conditionTexts[selectedCondition]?.title}
                </h2>
                <button
                  onClick={() => setSelectedCondition(null)}
                  className="text-tertiary-400 hover:text-tertiary-500 text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* 약관 텍스트 */}
              <div className="mb-6 flex-1 overflow-y-auto pr-4">
                <p className="text-prime-500 text-sm leading-relaxed font-normal">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when
                  an unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.
                </p>
              </div>

              {/* 동의하기 버튼 */}
              <Button
                onClick={handleConditionAgree}
                variant="primary"
                size="cta"
              >
                동의하기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 모달이 없을 때 우측 빈 공간 */}
      {!selectedCondition && (
        <div className="absolute top-1/2 left-1/2 ml-[413px] h-[646px] w-[602px] -translate-x-1/2 -translate-y-1/2"></div>
      )}
    </main>
  );
}
