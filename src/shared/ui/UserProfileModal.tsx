'use client';

// Figma: UserProfileModal (18:499)

import { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Camera } from 'lucide-react';
import { DialogRoot, DialogPortal, DialogOverlay, DialogTitle } from '@/shared/ui';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useAuthStore } from '@/entities/user/store';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export function UserProfileModal({
  isOpen,
  onClose,
  userName = '',
}: UserProfileModalProps) {
  const { user, setUser } = useAuthStore();
  const [nickname, setNickname] = useState(userName);
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profileImage ?? '/images/icons/profile-default.svg'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        name: nickname,
        profileImage: profileImage ?? '/images/icons/profile-default.svg',
      });
    }
    // TODO: API 연동
    onClose();
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 focus:outline-none">
          <DialogTitle className="sr-only">User profile</DialogTitle>
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] backdrop-blur-md">

            {/* 헤더 */}
            <div className="flex h-[83px] items-center justify-between border-b border-white/60 px-8">
              <span className="text-lg font-medium tracking-[-0.27px] text-prime-900">
                User profile
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="flex size-6 items-center justify-center rounded-full transition-colors hover:bg-black/5"
              >
                <X size={20} className="text-prime-500" />
              </button>
            </div>

            {/* 바디 */}
            <div className="flex flex-col gap-6 px-8 py-6">

              {/* 프로필 사진 */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex size-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-cta-300 bg-secondary-100 transition-opacity hover:opacity-80"
                    aria-label="프로필 사진 변경"
                  >
                    {profileImage && profileImage !== '/images/icons/profile-default.svg' ? (
                      <Image src={profileImage} alt="프로필" fill className="object-cover" />
                    ) : (
                      <Image src="/images/icons/profile-default.svg" alt="기본 프로필" fill className="object-contain p-3" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="사진 업로드"
                    className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-cta-300 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-80"
                  >
                    <Camera size={14} className="text-white" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <p className="text-center text-xs leading-[1.5] tracking-[-0.18px] text-prime-500">
                  프로필 사진을 바꾸고 싶다면 새로 업로드를 해주세요.
                </p>
              </div>

              {/* 닉네임 입력 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium tracking-[-0.21px] text-prime-700">
                  닉네임을 바꾸고 싶으시다면 새로 입력해 주세요.
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  maxLength={20}
                  className="h-14 w-full rounded-xl border border-neutral-300 bg-white/50 px-5 text-sm text-prime-900 placeholder:text-neutral-300 focus:border-cta-300 focus:outline-none focus:ring-2 focus:ring-cta-300/20"
                />
                <p className="text-center text-xs tracking-[-0.18px] text-error-500">
                  닉네임 교체는 매월 3회까지 가능합니다 (0/3)
                </p>
              </div>

              {/* 저장 확인 문구 */}
              <p className="text-center text-sm leading-[1.5] tracking-[-0.21px] text-prime-700">
                현재 바뀐 설정으로 저장하시겠습니까?
              </p>

              {/* 저장 버튼 */}
              <button
                type="button"
                onClick={handleSave}
                disabled={!nickname.trim()}
                className="h-14 w-full rounded-xl bg-cta-300 text-sm font-medium text-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                저장하기
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogRoot>
  );
}
