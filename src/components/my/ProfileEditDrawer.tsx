'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Camera, X } from 'lucide-react';
import { DialogRoot, DialogPortal, DialogOverlay } from '@/shared/ui';
import { ToggleGroup } from '@/shared/ui/toggle-group';
import { ProfileAvatar } from '@/shared/ui/profile-avatar';
import { useAuthStore } from '@/entities/user/store';
import { getMyProfileApi, updateMyProfileApi } from '@/entities/user/api';
import { NicknameSchema } from '@/entities/user/schema';
import { useToast } from '@/shared/ui/toast';
import {
  OCCUPATION_MAP,
  AGE_MAP,
  GENDER_MAP,
  OCCUPATION_LABEL,
  AGE_LABEL,
  GENDER_LABEL,
} from '@/entities/user/model';

interface ProfileEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function ProfileEditDrawer({ isOpen, onClose, onSaved }: ProfileEditDrawerProps) {
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 프로필 사진 / 닉네임
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState<string>('/images/icons/profile-default.png');
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [nicknameChangeCount, setNicknameChangeCount] = useState(0);

  // 나이 / 직업 / 성별
  const [occupation, setOccupation] = useState<keyof typeof OCCUPATION_MAP>('대학생 / 대학원생');
  const [ageGroup, setAgeGroup] = useState<keyof typeof AGE_MAP>('20대');
  const [gender, setGender] = useState<keyof typeof GENDER_MAP>('남성');

  // 초기값 (변경 감지용)
  const initialRef = useRef({
    nickname: '',
    occupation: '대학생 / 대학원생' as keyof typeof OCCUPATION_MAP,
    ageGroup: '20대' as keyof typeof AGE_MAP,
    gender: '남성' as keyof typeof GENDER_MAP,
  });

  const nicknameChanged = nickname !== initialRef.current.nickname;
  const isNicknameChangeLimitReached = nicknameChangeCount >= 3 && nicknameChanged;

  const hasChanges =
    nicknameChanged ||
    occupation !== initialRef.current.occupation ||
    ageGroup !== initialRef.current.ageGroup ||
    gender !== initialRef.current.gender ||
    !!selectedFile;

  // 실시간 닉네임 유효성 검사
  const nicknameValidation = (() => {
    const trimmed = nickname.trim();
    if (!trimmed) return null;
    if (isNicknameChangeLimitReached) return '이번 달 닉네임 변경 횟수를 초과했습니다.';
    const result = NicknameSchema.safeParse(trimmed);
    if (!result.success) return result.error.issues[0].message;
    return null;
  })();

  // 프로필 조회 (drawer 열릴 때마다)
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setSelectedFile(undefined);

    getMyProfileApi()
      .then((profile) => {
        const nick = profile.nickname;
        const occ = profile.occupation
          ? (OCCUPATION_LABEL[profile.occupation] ?? '대학생 / 대학원생')
          : '대학생 / 대학원생';
        const age = profile.age_group ? (AGE_LABEL[profile.age_group] ?? '20대') : '20대';
        const gen = profile.gender ? (GENDER_LABEL[profile.gender] ?? '남성') : '남성';

        setNickname(nick);
        setNicknameChangeCount(profile.nickname_change_count ?? 0);
        if (profile.profile_image_url) setProfileImage(profile.profile_image_url);
        else setProfileImage('/images/icons/profile-default.png');
        setOccupation(occ as keyof typeof OCCUPATION_MAP);
        setAgeGroup(age as keyof typeof AGE_MAP);
        setGender(gen as keyof typeof GENDER_MAP);

        initialRef.current = {
          nickname: nick,
          occupation: occ as keyof typeof OCCUPATION_MAP,
          ageGroup: age as keyof typeof AGE_MAP,
          gender: gen as keyof typeof GENDER_MAP,
        };
      })
      .finally(() => setLoading(false));

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [isOpen]);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast('이미지 크기는 5MB 이하여야 합니다.', 'error');
        e.target.value = '';
        return;
      }
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setProfileImage(url);
      setSelectedFile(file);
    },
    [toast]
  );

  const handleSave = async () => {
    if (nicknameValidation) {
      toast(nicknameValidation, 'error');
      return;
    }
    const trimmed = nickname.trim();
    setSaving(true);
    try {
      await updateMyProfileApi(trimmed, selectedFile, {
        age_group: AGE_MAP[ageGroup],
        occupation: OCCUPATION_MAP[occupation],
        gender: GENDER_MAP[gender],
      });

      if (user) {
        setUser({
          ...user,
          name: trimmed,
          profileImage: profileImage ?? '/images/icons/profile-default.png',
        });
      }

      onSaved?.();
      onClose();
      toast('프로필이 저장되었습니다.', 'success');
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : '프로필 저장에 실패했습니다. 다시 시도해 주세요.';
      toast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl focus:outline-none data-[state=closed]:duration-200 data-[state=open]:duration-300 sm:max-w-105"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">프로필 수정</DialogPrimitive.Title>

          {/* ── 헤더 ── */}
          <div className="border-prime-100 flex items-center justify-between border-b px-6 py-5">
            <h2 className="text-prime-900 text-base font-semibold tracking-[-0.24px]">
              프로필 수정
            </h2>
            <DialogPrimitive.Close className="hover:bg-secondary-100 flex size-8 items-center justify-center rounded-full transition-colors">
              <X size={18} className="text-prime-400" />
            </DialogPrimitive.Close>
          </div>

          {/* ── 본문 (스크롤) ── */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <p className="text-prime-400 text-sm">불러오는 중...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-7">
                {/* ── 프로필 사진 ── */}
                <section className="flex flex-col gap-2">
                  <p className="text-prime-700 text-sm font-medium">프로필 사진</p>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-cta-300/40 bg-secondary-100 group hover:border-cta-300 relative flex size-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 transition-all"
                      aria-label="프로필 사진 변경"
                    >
                      <ProfileAvatar src={profileImage} defaultPadding="p-2.5" />
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-all group-hover:bg-black/25">
                        <Camera
                          size={18}
                          className="text-white opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </div>
                    </button>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-cta-300 hover:text-cta-400 self-start text-sm font-medium transition-colors"
                      >
                        사진 변경
                      </button>
                      <p className="text-prime-400 text-xs">JPG, PNG 권장 · 최대 5MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </section>

                <hr className="border-prime-100" />

                {/* ── 닉네임 ── */}
                <section className="flex flex-col gap-2">
                  <label className="text-prime-700 text-sm font-medium">닉네임</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요 (2~30자)"
                    maxLength={30}
                    disabled={isNicknameChangeLimitReached}
                    className={`h-11 w-full rounded-xl border px-4 text-sm transition-colors focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                      nicknameValidation
                        ? 'border-error-400 bg-error-50 focus:border-error-400'
                        : 'border-prime-200 bg-secondary-50 focus:border-cta-300'
                    } text-prime-900 placeholder:text-prime-300 disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                  {nicknameValidation ? (
                    <p className="text-error-500 text-xs">{nicknameValidation}</p>
                  ) : (
                    <p className="text-prime-400 text-xs">
                      매월 3회까지 변경 가능 ({nicknameChangeCount}/3)
                    </p>
                  )}
                </section>

                <hr className="border-prime-100" />

                {/* ── 직업 ── */}
                <section className="flex flex-col gap-2">
                  <p className="text-prime-700 text-sm font-medium">직업</p>
                  <ToggleGroup
                    options={Object.keys(OCCUPATION_MAP) as (keyof typeof OCCUPATION_MAP)[]}
                    value={occupation}
                    onChange={setOccupation}
                    columns={2}
                  />
                </section>

                <hr className="border-prime-100" />

                {/* ── 나이 ── */}
                <section className="flex flex-col gap-2">
                  <p className="text-prime-700 text-sm font-medium">나이</p>
                  <ToggleGroup
                    options={Object.keys(AGE_MAP) as (keyof typeof AGE_MAP)[]}
                    value={ageGroup}
                    onChange={setAgeGroup}
                    columns={3}
                  />
                </section>

                <hr className="border-prime-100" />

                {/* ── 성별 ── */}
                <section className="flex flex-col gap-2">
                  <p className="text-prime-700 text-sm font-medium">성별</p>
                  <ToggleGroup
                    options={Object.keys(GENDER_MAP) as (keyof typeof GENDER_MAP)[]}
                    value={gender}
                    onChange={setGender}
                    columns={2}
                  />
                </section>
              </div>
            )}
          </div>

          {/* ── 하단 저장 버튼 ── */}
          <div className="border-prime-100 border-t px-6 py-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={!nickname.trim() || saving || !hasChanges || !!nicknameValidation}
              className="bg-cta-300 hover:bg-cta-400 w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogRoot>
  );
}
