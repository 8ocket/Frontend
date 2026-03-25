'use client';

import { SessionListItem } from './model';

/**
 * 미완성 상담(status='active') 존재 여부를 반환하는 훅
 *
 * [비즈니스 로직]
 * - 자정(00:00)을 기준으로 당일 마무리되지 않은 상담이 있으면 미완결로 간주
 * - 미완결 상담 있음 → 미완결 상담 모달
 * - 미완결 상담 없음 → sessionReady=false 유지, 입력창 탭 시 새로운 상담 모달
 *
 * TODO: 백엔드 API 연동 시 아래 주석 처리된 TanStack Query 구현으로 교체
 *   - API가 자정 기준 필터링을 처리해야 함 (e.g. started_at >= 오늘 00:00 AND status='active')
 *   - 백엔드 스펙 확인 필요: 자정 기준 필터가 쿼리 파라미터로 지원되는지 여부
 *   const { data } = useQuery({
 *     queryKey: ['unfinished-session'],
 *     queryFn: () => getSessionsApi({ status: 'active', size: 1 }),
 *   });
 *   const hasUnfinishedSession = (data?.sessions.length ?? 0) > 0;
 *   const unfinishedSession = data?.sessions[0] ?? null;
 */
export function useUnfinishedSession(): {
  hasUnfinishedSession: boolean;
  unfinishedSession: SessionListItem | null;
  isLoading: boolean;
} {
  // ─── Stub: API 연동 전까지 미완성 상담 없음으로 고정 ─────────────
  return {
    hasUnfinishedSession: false,
    unfinishedSession: null,
    isLoading: false,
  };
}
