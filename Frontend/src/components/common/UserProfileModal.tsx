'use client';

// Figma: User profile 변경하기 (1781:5049)
// 340px wide modal, rounded-xl, p-2, gap-4

import { useState, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { DialogRoot, DialogContent, DialogTitle } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

const MAX_NICKNAME_CHANGES = 3;

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  /** 이번 달 닉네임 변경 횟수 */
  nicknameChangesUsed?: number;
}

export function UserProfileModal({
  isOpen,
  onClose,
  userName = '',
  nicknameChangesUsed = 0,
}: UserProfileModalProps) {
  const [nickname, setNickname] = useState(userName);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canChangeNickname = nicknameChangesUsed < MAX_NICKNAME_CHANGES;
  const remaining = MAX_NICKNAME_CHANGES - nicknameChangesUsed;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfileImage(url);
  };

  const handleSave = () => {
    // TODO: API 연동
    onClose();
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showClose={false}
        maxWidth="max-w-[340px]"
        className="p-2"
      >
        <div className="flex flex-col gap-4">
          {/* 헤더 — 제목 + 닫기 */}
          <div className="flex items-center justify-between">
            <DialogTitle className="text-prime-900 dark:text-secondary-100 text-2xl font-semibold leading-[1.3] tracking-[-0.36px]">
              User profile
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-200 dark:hover:bg-prime-700"
            >
              <X size={20} className="text-prime-900 dark:text-secondary-100" />
            </button>
          </div>

          {/* 프로필 사진 영역 */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-prime-700 dark:text-prime-300 w-full text-center text-sm leading-[1.6]">
              프로필 사진을 바꾸고 싶다면 새로 업로드를 해주세요.
            </p>
            <button
              type="button"
              onClick={handleImageClick}
              className="border-cta-300 bg-secondary-100 dark:bg-prime-700 relative flex size-15 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 transition-opacity hover:opacity-80"
              aria-label="프로필 사진 변경"
            >
              {profileImage ? (
                <Image src={profileImage} alt="프로필" fill className="object-cover" />
              ) : (
                <div className="relative h-11 w-11">
                  <Image
                    src="/images/icons/profile-default.svg"
                    alt="기본 프로필"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* 닉네임 변경 영역 */}
          <div className="flex flex-col gap-2">
            <p className="text-prime-700 dark:text-prime-300 w-full text-center text-sm font-medium leading-none">
              닉네임을 바꾸고 싶으시다면 새로 입력해 주세요.
            </p>
            <div className="relative">
              <Input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력해 주세요"
                maxLength={20}
                disabled={!canChangeNickname}
              />
              <span className="text-prime-400 dark:text-prime-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                {nickname.length}/20
              </span>
            </div>
            <p
              className={cn(
                'w-full text-center text-xs leading-[1.2] tracking-[-0.18px]',
                canChangeNickname ? 'text-error-500' : 'text-neutral-400 dark:text-tertiary-500'
              )}
            >
              닉네임 교체는 매월 {MAX_NICKNAME_CHANGES}회까지 가능합니다 ({nicknameChangesUsed}/{MAX_NICKNAME_CHANGES})
            </p>
          </div>

          {/* 저장 영역 */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-prime-700 dark:text-prime-300 text-center text-sm leading-[1.6]">
              현재 바뀐 설정으로 저장하시겠습니까?
            </p>
            <Button
              onClick={handleSave}
              variant="primary"
              size="default"
              className="w-full"
            >
              저장하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
