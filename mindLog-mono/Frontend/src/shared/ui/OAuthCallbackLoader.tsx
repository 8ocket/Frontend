// src/features/auth/OAuthCallbackLoader.tsx
export function OAuthCallbackLoader({ message = '로그인 처리 중입니다...' }: { readonly message?: string }) {
  return (
    <div className="min-h-screen-safe flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
