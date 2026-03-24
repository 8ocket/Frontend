'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuroraBackground from '@/shared/ui/AuroraBackground';
import { Button, Input, ToggleGroup } from '@/shared/ui';
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
      login({ ...(user ?? { id: 0, email: '' }), name: nickname, creditBalance: 0, profileImage: profileImage ?? '/images/icons/profile-default.svg' }, token);
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
    <AuroraBackground>
      <div className="flex min-h-screen items-center justify-center p-4 py-8">
        {/* 카드 — Figma: 568px, white glass, rounded-2xl, px-10 */}
        <div className="relative w-full max-w-142 rounded-2xl border border-white/40 bg-white/70 px-6 py-8 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.08)] md:px-10 md:py-10">
          {/* ── 헤더: 제목 + 뒤로가기 ── */}
          <div className="flex items-center justify-between">
            <h1 className="text-prime-900 text-2xl font-semibold leading-[1.3] tracking-[-0.36px]">
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

          {/* ── 콘텐츠 ── */}
          <div className="mt-6 flex flex-col gap-6">
            {/* 프로필 영역 — Figma: 60×60 circle + helper text */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleProfileClick}
                className="border-cta-300 bg-secondary-100 relative flex size-15 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2"
              >
                {profileImage ? (
                  <Image src={profileImage} alt="profile" fill className="object-cover" />
                ) : (
                  <div className="relative h-10.75 w-10.75">
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
              <p className="text-prime-500 flex-1 text-xs leading-[1.4] tracking-[-0.18px]">
                프로필을 바꾸고 싶으시다면 아이콘을 눌러 사진을 추가하세요.
                <br />
                설정하지 않으시면 기본 프로필로 접속합니다.
              </p>
            </div>

            {/* ── 폼 섹션들 ── */}
            <div className="flex flex-col gap-6">
              {/* 닉네임 설정 */}
              <div className="flex flex-col gap-2">
                <p className="text-prime-900 text-base font-medium leading-6 tracking-[-0.24px]">
                  닉네임 설정하기
                </p>
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <Input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="즐거운 몽상가"
                      maxLength={20}
                      className="h-14 rounded-xl bg-white/50 px-5 text-base"
                    />
                    <span className="text-prime-400 pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs">
                      {nickname.length}/20
                    </span>
                  </div>
                  <Button
                    onClick={generateRandomNickname}
                    variant="secondary"
                    size="default"
                    className="h-14 w-full rounded-xl text-base"
                  >
                    닉네임 랜덤 생성
                  </Button>
                </div>
              </div>

              <ToggleGroup
                legend="직업 선택하기"
                options={Object.keys(OCCUPATION_MAP) as (keyof typeof OCCUPATION_MAP)[]}
                value={userType}
                onChange={setUserType}
                columns={2}
              />

              <ToggleGroup
                legend="나이"
                options={Object.keys(AGE_MAP) as (keyof typeof AGE_MAP)[]}
                value={ageGroup}
                onChange={setAgeGroup}
                columns={3}
              />

              <ToggleGroup
                legend="성별"
                options={Object.keys(GENDER_MAP) as (keyof typeof GENDER_MAP)[]}
                value={gender}
                onChange={setGender}
                columns={2}
              />
            </div>
          </div>

          {/* CTA 버튼 */}
          <Button
            onClick={handleNext}
            disabled={!nickname.trim() || isLoading}
            variant="primary"
            size="cta"
            className="mt-8 h-14 w-full rounded-xl"
          >
            {isLoading ? '처리 중...' : '다음 단계로 진행'}
          </Button>
        </div>

        {/* 성공 모달 */}
        <SignupCreditModal isOpen={showSuccessModal} onConfirm={handleSuccessModalClick} />
      </div>
    </AuroraBackground>
  );
}
