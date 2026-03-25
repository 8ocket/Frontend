const CARD = 'rounded-[24px] border border-prime-100 bg-white p-10 shadow-sm';
const SHIMMER = 'animate-pulse rounded-xl bg-prime-100';

function Bone({ className }: { className: string }) {
  return <div className={`${SHIMMER} ${className}`} />;
}

export function ReportDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="mb-12">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <Bone className="h-7 w-20" />
            </div>
            <Bone className="h-10 w-3/4 rounded-2xl" />
            <div className="flex items-center gap-4">
              <Bone className="h-5 w-48" />
              <Bone className="h-5 w-32" />
            </div>
          </div>
          <Bone className="h-14 w-36 shrink-0 rounded-3xl" />
        </div>
      </div>

      {/* 감정 변화 그래프 */}
      <div className={CARD}>
        <div className="mb-8 flex items-center justify-between">
          <Bone className="h-8 w-36" />
          <Bone className="h-8 w-12 rounded-full" />
        </div>
        <Bone className="h-5 w-52 rounded-lg" />
        <Bone className="mt-8 h-90 rounded-2xl" />
        <div className="mt-8 border-t border-prime-100 pt-8">
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Bone className="h-4 w-16" />
                <Bone className="h-8 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 주요 고민 키워드 */}
      <div className={CARD}>
        <div className="mb-8 space-y-3">
          <Bone className="h-8 w-40" />
          <Bone className="h-5 w-64" />
        </div>
        <div className="flex flex-wrap gap-3">
          {[80, 64, 56, 72, 88].map((w) => (
            <Bone key={w} className={`h-11 rounded-3xl`} style={{ width: `${w}px` }} />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-3 gap-6 border-t border-prime-100 pt-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Bone className="h-4 w-20" />
              <Bone className="h-8 w-14" />
            </div>
          ))}
        </div>
      </div>

      {/* 사용자 상태 요약 */}
      <div className={CARD}>
        <div className="mb-8 space-y-3">
          <Bone className="h-8 w-36" />
          <Bone className="h-5 w-56" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Bone className="h-5 w-24" />
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-5/6" />
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-prime-100 pt-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-bg-light space-y-3 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <Bone className="h-4 w-20" />
                <Bone className="h-5 w-8" />
              </div>
              <Bone className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* 맞춤 행동 제언 */}
      <div className="rounded-[24px] bg-prime-100 p-12">
        <div className="mb-10 flex flex-col items-center gap-4">
          <Bone className="size-16 rounded-full" />
          <Bone className="h-9 w-40" />
          <Bone className="h-5 w-56" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-4xl bg-prime-200/40 p-7">
              <div className="flex items-start gap-5">
                <Bone className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between gap-4">
                    <Bone className="h-6 w-32" />
                    <Bone className="h-6 w-16 rounded-xl" />
                  </div>
                  <Bone className="h-4 w-full" />
                  <Bone className="h-4 w-4/5" />
                </div>
                <Bone className="size-11 shrink-0 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
