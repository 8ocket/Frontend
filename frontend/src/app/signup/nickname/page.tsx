'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import WaveBackground from '@/components/common/WaveBackground';
import { Button, Input, RadioGroup, SectionHeader, SuccessModal } from '@/components/ui';

const imgVector = 'https://www.figma.com/api/mcp/asset/1d130480-0444-4c0b-926c-7cc10c5433d9';

type UserType = '대학생 / 대학원생' | '취업 준비생' | '직장인' | '이직 준비';
type AgeGroup = '20대' | '30대' | '40대';
type Gender = '남성' | '여성';

export default function NicknamePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
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
    // 성공 모달 확인 → 가입완료 페이지로 이동
    setShowSuccessModal(false);
    router.push('/signup/complete');
  };

  const generateRandomNickname = () => {
    const adjectives = ['행복한', '신나는', '멋진', '친절한', '똑똑한'];
    const nouns = ['사자', '호랑이', '독수리', '늑대', '여우'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    setNickname(`${randomAdj}${randomNoun}`);
  };

  return (
    <main className="bg-secondary-100 relative h-screen w-full overflow-hidden">
      <WaveBackground />
      <div className="bg-cta-100 absolute top-1/2 left-1/2 flex w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg px-2 py-8">
        {/* 제목 */}
        <div className="text-center">
          <h1 className="text-prime-900 text-3xl leading-[1.3] font-semibold tracking-[-0.48px]">
            개인정보 설정하기
          </h1>
        </div>

        {/* 프로필 영역 */}
        <div className="flex items-start gap-4 px-4">
          <div className="border-cta-300 bg-secondary-100 relative flex size-[60px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2">
            <div className="relative inset-[20%] h-8 w-8">
              <Image src={imgVector} alt="profile" fill className="object-contain" />
            </div>
          </div>
          <div className="text-prime-500 flex-1 pt-1 text-xs leading-[1.2] font-normal tracking-[-0.18px]">
            <p>프로필을 바꾸고 싶으시다면</p>
            <p>아이콘을 눌러 사진을 추가하세요.</p>
            <p>설정하지 않으시면 기본 프로필로 접속합니다.</p>
          </div>
        </div>

        {/* 섹션들 */}
        <div className="flex flex-col gap-8 px-4">
          {/* 닉네임 설정 */}
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

          {/* 직업 선택 */}
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
            columns={2}
            orientation="horizontal"
          />

          {/* 나이 선택 */}
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
            orientation="horizontal"
          />

          {/* 성별 선택 */}
          <RadioGroup
            legend="성별"
            name="gender"
            options={[
              { label: '남성', value: '남성' },
              { label: '여성', value: '여성' },
            ]}
            value={gender}
            onChange={(value) => setGender(value as Gender)}
            orientation="horizontal"
          />
        </div>

        {/* 다음 버튼 */}
        <Button
          onClick={handleNext}
          disabled={!nickname.trim() || isLoading}
          variant="primary"
          size="cta"
          className="mx-4"
        >
          {isLoading ? '처리 중...' : '다음 단계로 진행'}
        </Button>
      </div>

      {/* 성공 모달 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="가입해 주셔서 감사드립니다."
        subtitle="감사의 의미로 300 크레딧을 선물로 드립니다."
        buttonLabel="300 크레딧 받기"
        onButtonClick={handleSuccessModalClick}
      />
    </main>
  );
}
