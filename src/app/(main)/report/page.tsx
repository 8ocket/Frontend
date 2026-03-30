'use client';

import { useCallback, useState } from 'react';
import {
  ReportSidebar,
  ReportCreationForm,
  ReportPolling,
  ReportError,
  ReportDetail,
  ReportDetailSkeleton,
  type Report,
  type ReportStatus,
  type ReportType,
} from '@/components/report';
import { useToast } from '@/shared/ui/toast';
import { start } from 'repl';

const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    title: '3월 3주차 감정 분석',
    date: '2026.03.24',
    type: '주간 리포트',
    period: '2026.03.17 - 2026.03.23',
    reportType: 'weekly',
    isNew: true,
  },
  {
    id: '2',
    title: '3월 월간 종합 리포트',
    date: '2026.03.20',
    type: '월간 리포트',
    period: '2026.03.01 - 2026.03.31',
    reportType: 'monthly',
  },
  {
    id: '3',
    title: '업무 스트레스 심화 분석',
    date: '2026.03.15',
    type: '주간 리포트',
    period: '2026.03.08 - 2026.03.14',
    reportType: 'weekly',
  },
  {
    id: '4',
    title: '2월 감정 트렌드 분석',
    date: '2026.02.28',
    type: '월간 리포트',
    period: '2026.02.01 - 2026.02.28',
    reportType: 'monthly',
    isFailed: true,
  },
];

const SKELETON_MS = 600;

export default function ReportPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [viewState, setViewState] = useState<ReportStatus>('idle');
  const [selectedId, setSelectedId] = useState(MOCK_REPORTS[0].id);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // 상담 횟수 — 실제 API 연동 시 교체
  const consultationCount = 5;

  const selectedReport = reports.find((r) => r.id === selectedId);

  const showDetail = useCallback((id: string) => {
    setIsLoadingDetail(true);
    setTimeout(() => setIsLoadingDetail(false), SKELETON_MS);
    // NEW 배지 제거
    setReports((prev) =>
      prev.map((r) => (r.id === id && r.isNew ? { ...r, isNew: false } : r))
    );
  }, []);

  const handleSelect = (id: string) => {
    const report = reports.find((r) => r.id === id);
    setSelectedId(id);
    if (report?.isFailed) {
      setViewState('failed');
    } else {
      setViewState('success');
      showDetail(id);
    }
  };

  const handleCreateReport = async ( type, start, end) => {
    // API: GET /users/credits -> 잔여 크레딧 확인
    // 부족 시: 크레딧 부족 모달 노출
    // 충분 시: setViewState('creating') -> createReportApi 호출
  }

  // ReportPolling 완료 콜백 — 실제 API 결과에 따라 success/failed 분기
  const handlePollingComplete = () => {
    const succeeded = Math.random() > 0.2;
    if (succeeded) {
      setViewState('success');
      setIsLoadingDetail(true);
      setTimeout(() => setIsLoadingDetail(false), SKELETON_MS);
      toast('리포트가 완성됐어요!', 'success');
    } else {
      setViewState('failed');
    }
  };

  const handleRetry = () => setViewState('idle');
  const handleCreateNew = () => setViewState('idle');

  return (
    <div
      className="layout-container bg-bg-light flex overflow-hidden"
      style={{ height: 'calc(100dvh - var(--gnb-height))' }}
    >
      {/* 사이드바 */}
      <ReportSidebar
        reports={reports}
        selectedId={selectedId}
        onSelect={handleSelect}
        onCreateNew={handleCreateNew}
        isCreating={viewState === 'idle' || viewState === 'creating'}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {viewState === 'idle' && (
          <div className="relative flex min-h-full items-center justify-center bg-secondary-100 px-6 py-12 sm:px-12">
            {/* 배경 로고 — 채팅창과 동일한 브랜드 패턴 */}
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/logo-small.svg"
                width={884}
                height={884}
                alt=""
                className="opacity-[0.07]"
              />
            </div>

            {/* 폼 컨텐츠 */}
            <div className="relative z-10 w-full max-w-xl">
              <header className="mb-8 text-center">
                <h1 className="text-prime-900 text-3xl font-bold tracking-tight md:text-4xl">
                  나를 위한 마음 분석 리포트
                </h1>
                <p className="text-prime-500 mt-2 text-sm md:text-base">
                  차곡차곡 쌓인 상담 기록으로 내 마음의 흐름을 찾아낼게요.
                </p>
              </header>
              <ReportCreationForm
                onCreateReport={handleCreateReport}
                consultationCount={consultationCount}
              />
            </div>
          </div>
        )}

        {/* creating: 폴링 */}
        {viewState === 'creating' && <ReportPolling onComplete={handlePollingComplete} />}

        {/* failed: 에러 */}
        {viewState === 'failed' && (
          <ReportError onRetry={handleRetry} onDismiss={handleCreateNew} />
        )}

        {/* success: 스켈레톤 → 리포트 상세 */}
        {viewState === 'success' && (
          <div className="mx-auto max-w-6xl px-6 py-12 sm:px-12">
            {isLoadingDetail ? (
              <ReportDetailSkeleton />
            ) : (
              selectedReport && (
                <ReportDetail report={selectedReport} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
