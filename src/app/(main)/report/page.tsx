'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ReportSidebar,
  ReportCreationForm,
  ReportPolling,
  ReportError,
  ReportDetail,
  ReportDetailSkeleton,
  DeleteReportModal,
  type Report,
  type ReportStatus,
  type ReportType,
} from '@/components/report';
import { useToast } from '@/shared/ui/toast';
import { ReportCompleteEvent, ReportListItem, ReportStatusEvent } from '@/entities/reports/model';
import { createReportApi, deleteReportApi, getReportListApi } from '@/entities/reports/api';

function mapToReport(item: ReportListItem): Report {
  const reportType = item.report_type.toLowerCase() as ReportType;
  const [, startM, startD] = item.period_start.split('-').map(Number);
  const [, _endM, _endD] = item.period_end.split('-').map(Number);
  const weekNum = Math.ceil(startD / 7);
  const title =
    reportType === 'weekly'
      ? `${startM}월 ${weekNum}주차 감정 분석`
      : `${startM}월 월간 종합 리포트`;
  const period = `${item.period_start.replace(/-/g, '.')} - ${item.period_end.replace(/-/g, '.')}`;
  const date = item.created_at.split('T')[0].replace(/-/g, '.');

  return {
    id: item.report_id,
    title,
    date,
    type: reportType === 'weekly' ? '주간 리포트' : '월간 리포트',
    period,
    reportType,
    isFailed: item.status.toLowerCase() === 'failed',
    isGenerating: item.status.toLowerCase() === 'generating',
  };
}

const SKELETON_MS = 600;

export default function ReportPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reportData } = useQuery({
    queryKey: ['reports'],
    queryFn: () => getReportListApi(),
  });

  const reports = (reportData?.reports ?? []).map(mapToReport);
  const _canGenerate = reportData?.can_generate ?? null;

  const [viewState, setViewState] = useState<ReportStatus>('idle');
  const [selectedId, setSelectedId] = useState('');
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [sseStep, setSseStep] = useState<'analyzing' | 'generating' | undefined>();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 리포트 페이지에서는 body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const loadReports = useCallback(
    async (selectId?: string) => {
      await queryClient.invalidateQueries({ queryKey: ['reports'] });
      if (selectId) setSelectedId(selectId);
    },
    [queryClient]
  );

  const selectedReport = reports.find((r) => r.id === selectedId);

  const showDetail = useCallback((_id: string) => {
    setIsLoadingDetail(true);
    setTimeout(() => setIsLoadingDetail(false), SKELETON_MS);
  }, []);

  const handleSelect = (id: string) => {
    const report = reports.find((r) => r.id === id);
    setSelectedId(id);
    if (report?.isGenerating) {
      setSseStep(undefined);
      setViewState('creating');
    } else if (report?.isFailed) {
      setViewState('failed');
    } else {
      setViewState('success');
      showDetail(id);
    }
  };

  const handleCreateReport = async (type: ReportType, start: string, end: string) => {
    setViewState('creating');
    setSseStep(undefined);

    try {
      await createReportApi(
        { report_type: type, period_start: start, period_end: end },
        (event: ReportStatusEvent) => setSseStep(event.step),
        async (event: ReportCompleteEvent) => {
          setViewState('success');
          setIsLoadingDetail(true);
          await loadReports(event.report_id);
          setTimeout(() => setIsLoadingDetail(false), SKELETON_MS);
        },
        (message: string) => {
          toast(message || 'AI 분석 중 오류가 발생했어요.', 'error');
          setViewState('failed');
        }
      );
    } catch (err) {
      const code = err instanceof Error ? err.message : '';
      if (code === 'INSUFFICIENT_SESSIONS') {
        toast('기간 내 상담 기록이 3개 이상이어야 해요.', 'error');
      } else if (code === 'REPORT_ALREADY_EXISTS') {
        toast('해당 기간의 리포트가 이미 존재해요.', 'error');
      } else {
        toast('리포트 생성 요청에 실패했어요.', 'error');
      }
      setViewState('idle');
    }
  };

  const handleDeleteReport = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteReportApi(deleteTargetId);
      await queryClient.invalidateQueries({ queryKey: ['reports'] });
      if (selectedId === deleteTargetId) {
        setSelectedId('');
        setViewState('idle');
      }
      toast('리포트가 삭제되었어요.', 'success');
    } catch {
      toast('리포트 삭제에 실패했어요.', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
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
        onDelete={setDeleteTargetId}
        isCreating={viewState === 'idle' || viewState === 'creating'}
      />

      {/* 삭제 확인 다이얼로그 */}
      <DeleteReportModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteReport}
        isDeleting={isDeleting}
      />

      {/* 메인 콘텐츠 */}
      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
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
              <ReportCreationForm onCreateReport={handleCreateReport} />
            </div>
          </div>
        )}

        {/* creating: 폴링 */}
        {viewState === 'creating' && <ReportPolling onComplete={() => {}} sseStep={sseStep} />}

        {/* failed: 에러 */}
        {viewState === 'failed' && <ReportError onDismiss={handleCreateNew} />}

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
