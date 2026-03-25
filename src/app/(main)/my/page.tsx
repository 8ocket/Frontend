'use client';

import { useState } from 'react';
import { useAuthStore } from '@/entities/user/store';
import { UserProfileModal } from '@/shared/ui/UserProfileModal';

export default function MyPage() {
  const { user } = useAuthStore();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-prime-900 text-4xl font-bold">마이페이지</h1>
          <button
            type="button"
            onClick={() => setProfileModalOpen(true)}
            className="bg-cta-300 text-prime-900 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-[#4ba1f0]"
          >
            프로필 편집
          </button>
        </div>
      </main>

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        userName={user?.name ?? ''}
      />
    </div>
  );
}
