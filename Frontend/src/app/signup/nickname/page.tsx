'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import WaveBackground from '@/shared/ui/WaveBackground';
import { Button, Input, RadioGroup, SectionHeader } from '@/shared/ui';
import { SignupCreditModal } from '@/features/auth';
import { useAuthStore } from '@/entities/user/store';
import { getCookie } from '@/shared/lib/utils/cookie';
import { generatePositiveNickname } from '@/shared/lib/utils/nickname';
import { signupApi } from '@/shared/api';
import { OCCUPATION_MAP, AGE_MAP, GENDER_MAP } from '@/entities/user/model';

const imgVector = '/images/icons/profile-default.svg';

export default function NicknamePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState(generatePositiveNickname);
  const [userType, setUserType] = useState<keyof typeof OCCUPATION_MAP>('대학생 / 대학원생');
  const [ageGroup, setAgeGroup] = useState<keyof typeof AGE_MAP>('20대');
  const [gender, setGender] = useState<keyof typeof GENDER_MAP>('남성');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null); // 프로필 미리보기 <URL>
  const [profileFile, setProfileFile] = useState<File | null>(null); // 실제 업로드할 파일 객체
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileClick = () => fileInputRef.current?.click();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfileImage(url);
    setProfileFile(file);
  };

  const handleNext = async () => {
    if (!nickname.trim()) return;
    try {
      setIsLoading(true);
      await signupApi(
        nickname,
        OCCUPATION_MAP[userType],
        AGE_MAP[ageGroup],
        GENDER_MAP[gender],
        profileFile ?? undefined
      );
      const { user, login } = useAuthStore.getState();
      const token = getCookie('accessToken') || '';
      login({ ...(user ?? { id: 0, email: '' }), name: nickname, creditBalance: 0 }, token);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('회원가입 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClick = () => {
    useAuthStore.getState().addCredit(150);
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
            <h1 className="text-prime-900 dark:text-secondary-100 text-[32px] leading-[1.3] font-semibold">
              개인정보 설정하기
            </h1>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-cta-300 flex h-6 w-6 items-center justify-center overflow-hidden rounded-full"
            >
              <Image src="/images/icons/Back.png" alt="뒤로가기" width={24} height={24} />
            </button>
          </div>

          {/* ── 콘텐츠 ── Figma: gap 16px(mt-4) from header */}
          <div className="mt-4 flex flex-col gap-4">
            {/* 프로필 영역 — Figma: 60×60 circle + helper text */}
            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={handleProfileClick}
                className="border-cta-300 bg-secondary-100 dark:bg-prime-700 relative flex size-15 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2"
              >
                {profileImage ? (
                  <Image src={profileImage} alt="profile" fill className="object-cover" />
                ) : (
                  <div className="relative h-8 w-8">
                    <Image src={imgVector} alt="profile" fill className="object-contain" />
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileChange}
              />
              <p className="text-prime-500 dark:text-prime-400 flex-1 pt-2.25 text-xs leading-[1.2] font-normal tracking-[-0.18px]">
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
                  <div className="relative">
                    <Input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="닉네임을 입력해 주세요"
                      maxLength={20}
                    />
                    <span className="text-prime-400 dark:text-prime-500 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">
                      {nickname.length}/20
                    </span>
                  </div>
                  <div className="flex gap-6">
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
                options={Object.keys(OCCUPATION_MAP).map((label) => ({ label, value: label }))}
                value={userType}
                onChange={(value) => setUserType(value as keyof typeof OCCUPATION_MAP)}
                legendGap="gap-2"
                contentClassName="grid grid-rows-2 grid-flow-col gap-x-[35px] gap-y-2"
              />

              {/* 나이 — Figma: 3-col flex, gap 16px, legend gap 16px */}
              <RadioGroup
                legend="나이"
                name="ageGroup"
                options={Object.keys(AGE_MAP).map((label) => ({ label, value: label }))}
                value={ageGroup}
                onChange={(value) => setAgeGroup(value as keyof typeof AGE_MAP)}
                legendGap="gap-4"
                contentClassName="flex gap-4"
                itemClassName="flex-1"
              />

              {/* 성별 — Figma: horizontal, gap 16px, legend gap 16px */}
              <RadioGroup
                legend="성별"
                name="gender"
                options={Object.keys(GENDER_MAP).map((label) => ({ label, value: label }))}
                value={gender}
                onChange={(value) => setGender(value as keyof typeof GENDER_MAP)}
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

        {/* 성공 모달 — Figma: 1303:3182 */}
        <SignupCreditModal isOpen={showSuccessModal} onConfirm={handleSuccessModalClick} />
      </div>
    </WaveBackground>
  );
}
