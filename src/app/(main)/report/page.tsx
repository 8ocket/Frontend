'use client';

import { useCallback, useState, useEffect } from 'react';
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
import { CanGenerate } from '@/entities/reports/model';
import { createReportApi, getReportDetailApi, getReportListApi } from '@/entities/reports/api';

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
  const [creatingReportId, setCreatingReportId] = useState<string | null>(null);
  const [canGenerate, setCanGenerate] = useState<CanGenerate | null>(null);

  // 리포트 페이지에서는 body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 목록 로딩
  useEffect(() => {
    getReportListApi()
      .then((data) => {
        // TODO: ReportListItem → Report 변환 함수 작성 후 적용
        // setReports(data.reports.map(mapToReport));
        setCanGenerate(data.can_generate);
      })
      .catch(() => {
        toast('리포트 목록을 불러오는 데 실패했어요.', 'error');
      });
  }, [toast]);

  // 3초 간격 폴링 — creating 상태일 때 실행
  useEffect(() => {
    if (viewState !== 'creating' || !creatingReportId) return;

    const poll = async () => {
      try {
        const data = await getReportDetailApi(creatingReportId);
        if (!('status' in data)) {
          setViewState('success');
          setIsLoadingDetail(true);
          setTimeout(() => setIsLoadingDetail(false), SKELETON_MS);
          toast('리포트가 완성됐어요!', 'success');
        }
      } catch {
        setViewState('failed');
      }
    };

    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [creatingReportId, toast, viewState]);

  // 상담 횟수 — 실제 API 연동 시 교체
  const consultationCount = canGenerate?.saved_session_count ?? 0;

  const selectedReport = reports.find((r) => r.id === selectedId);

  const showDetail = useCallback((id: string) => {
    setIsLoadingDetail(true);
    setTimeout(() => setIsLoadingDetail(false), SKELETON_MS);
    // NEW 배지 제거 — 실제 API 연동 시 isNew 플래그 제거
    setReports((prev) => prev.map((r) => (r.id === id && r.isNew ? { ...r, isNew: false } : r)));
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

  const handleCreateReport = async (type: ReportType, start: string, end: string) => {
    try {
      const { report_id } = await createReportApi({
        report_type: type,
        period_start: start,
        period_end: end,
      });
      setCreatingReportId(report_id);
      setViewState('creating');
    } catch {
      // TODO: 크레딧 부족 에러 코드 백엔드 확인 후 분기 처리
      toast('리포트 생성 요청에 실패했어요.');
    }
  };

  const handleRetry = () => {
    setCreatingReportId(null);
    setViewState('idle');
  };
  const handleCreateNew = () => setViewState('idle');

  return (
    <div className="layout-container bg-bg-light relative flex h-[calc(100dvh-4rem)] min-h-0 overflow-hidden md:h-[calc(100dvh-5rem)]">
      {/* 사이드바 */}
      <ReportSidebar
        reports={reports}
        selectedId={selectedId}
        onSelect={handleSelect}
        onCreateNew={handleCreateNew}
        isCreating={viewState === 'idle' || viewState === 'creating'}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {viewState === 'idle' && (
          <div className="relative flex min-h-full items-center justify-center border-r border-black/5 px-6 py-12 sm:px-12">
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
        {viewState === 'creating' && <ReportPolling onComplete={() => {}} />}

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
              selectedReport && <ReportDetail report={selectedReport} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
