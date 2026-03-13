'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import WaveBackground from '@/components/common/WaveBackground';
import { Button, Input, RadioGroup, SectionHeader, StatusModal } from '@/components/ui';
import { useAuthStore } from '@/stores/auth';
import { generatePositiveNickname } from '@/lib/utils/nickname';

const imgVector = '/images/icons/profile-default.svg';

type UserType = '대학생 / 대학원생' | '취업 준비생' | '직장인' | '이직 준비';
type AgeGroup = '20대' | '30대' | '40대';
type Gender = '남성' | '여성';

export default function NicknamePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState(generatePositiveNickname);
  const [userType, setUserType] = useState<UserType>('대학생 / 대학원생');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('20대');
  const [gender, setGender] = useState<Gender>('남성');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleNext = async () => {
    if (!nickname.trim()) return;

    try {
      setIsLoading(true);
      // TODO: 사용자 정보 저장 API 호출
      // const response = await personalInfoApi.save({
      //   nickname,
      //   userType,
      //   ageGroup,
      //   gender,
      // });

      // 성공 모달 표시
      setShowSuccessModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClick = () => {
    // 성공 모달 확인 → 메인 페이지로 이동
    setShowSuccessModal(false);

    // 임시: 회원가입 완료 후 인증 상태 저장
    const token = localStorage.getItem('accessToken');
    if (token) {
      const { login } = useAuthStore.getState();
      const mockUser = {
        id: Date.now(),
        email: 'user@example.com',
        name: nickname,
      };
      login(mockUser, token, localStorage.getItem('refreshToken') || '');
    }

    router.push('/');
  };

  const generateRandomNickname = () => {
    setNickname(generatePositiveNickname());
  };

  return (
    <WaveBackground>
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* 카드 — Figma: 340×707, glass blue-10, rounded-md, px-8 */}
        <div
          className="relative w-full max-w-85 rounded-md px-4 py-4 md:h-176.75 md:w-85 md:px-2 md:py-0"
          style={{ background: 'rgba(130, 201, 255, 0.10)' }}
        >
          {/* ── 헤더: 제목 + 뒤로가기 ── */}
          <div className="flex h-10.5 items-center justify-between">
            <h1 className="text-prime-900 text-[32px] leading-[1.3] font-semibold">
              개인정보 설정하기
            </h1>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-cta-300 flex h-6 w-6 items-center justify-center overflow-hidden rounded-full"
            >
              <Image src="/images/icons/back-arrow.svg" alt="뒤로가기" width={24} height={24} />
            </button>
          </div>

          {/* ── 콘텐츠 ── Figma: gap 16px(mt-4) from header */}
          <div className="mt-4 flex flex-col gap-4">
            {/* 프로필 영역 — Figma: 60×60 circle + helper text */}
            <div className="flex items-start gap-4">
              <div className="border-cta-300 bg-secondary-100 relative flex size-15 shrink-0 items-center justify-center overflow-hidden rounded-full border-2">
                <div className="relative h-8 w-8">
                  <Image src={imgVector} alt="profile" fill className="object-contain" />
                </div>
              </div>
              <p className="text-prime-500 flex-1 pt-2.25 text-xs leading-[1.2] font-normal tracking-[-0.18px]">
                프로필을 바꾸고 싶으시다면 아이콘을 눌러 사진을 추가하세요. 설정하지 않으시면 기본
                프로필로 접속합니다.
              </p>
            </div>

            {/* ── 폼 섹션들 — Figma: 각 섹션간 gap-8(32px) ── */}
            <div className="flex flex-col gap-8">
              {/* 닉네임 설정 — legend gap 8px, input↔buttons gap 16px, buttons gap 24px */}
              <div className="flex flex-col gap-2">
                <SectionHeader>닉네임 설정하기</SectionHeader>
                <div className="flex flex-col gap-4">
                  <Input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력해 주세요"
                  />
                  <div className="flex gap-6">
                    <Button onClick={() => {}} variant="primary" size="default" className="flex-1">
                      닉네임 사용하기
                    </Button>
                    <Button
                      onClick={generateRandomNickname}
                      variant="secondary"
                      size="default"
                      className="flex-1"
                    >
                      닉네임 랜덤 생성
                    </Button>
                  </div>
                </div>
              </div>

              {/* 직업 선택 — Figma: 2-col column-first flow, gap-x 35px, gap-y 8px */}
              <RadioGroup
                legend="직업 선택하기"
                name="userType"
                options={[
                  { label: '대학생 / 대학원생', value: '대학생 / 대학원생' },
                  { label: '취업 준비생', value: '취업 준비생' },
                  { label: '직장인', value: '직장인' },
                  { label: '이직 준비', value: '이직 준비' },
                ]}
                value={userType}
                onChange={(value) => setUserType(value as UserType)}
                legendGap="gap-2"
                contentClassName="grid grid-rows-2 grid-flow-col gap-x-[35px] gap-y-2"
              />

              {/* 나이 — Figma: 3-col flex, gap 16px, legend gap 16px */}
              <RadioGroup
                legend="나이"
                name="ageGroup"
                options={[
                  { label: '20대', value: '20대' },
                  { label: '30대', value: '30대' },
                  { label: '40대', value: '40대' },
                ]}
                value={ageGroup}
                onChange={(value) => setAgeGroup(value as AgeGroup)}
                legendGap="gap-4"
                contentClassName="flex gap-4"
                itemClassName="flex-1"
              />

              {/* 성별 — Figma: horizontal, gap 16px, legend gap 16px */}
              <RadioGroup
                legend="성별"
                name="gender"
                options={[
                  { label: '남성', value: '남성' },
                  { label: '여성', value: '여성' },
                ]}
                value={gender}
                onChange={(value) => setGender(value as Gender)}
                legendGap="gap-4"
                contentClassName="flex gap-4"
              />
            </div>
          </div>

          {/* CTA 버튼 — Figma: absolute bottom-4, w-324, h-41, rounded-[22px] */}
          <Button
            onClick={handleNext}
            disabled={!nickname.trim() || isLoading}
            variant="primary"
            size="cta"
            className="mt-8 h-10.25 w-full md:absolute md:bottom-4 md:left-2 md:mt-0 md:w-81"
          >
            {isLoading ? '처리 중...' : '다음 단계로 진행'}
          </Button>
        </div>

        {/* 성공 모달 */}
        <StatusModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          semantic="safe"
          title="가입해 주셔서 감사드립니다."
          description="감사의 의미로 150 크레딧을 선물로 드립니다."
          creditAmount={150}
          actions={[
            {
              label: '150 크레딧 받기',
              variant: 'primary',
              onClick: handleSuccessModalClick,
            },
          ]}
        />
      </div>
    </WaveBackground>
  );
}
