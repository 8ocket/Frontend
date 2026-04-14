import type {
  CreateReportRequest,
  ReportStatusEvent,
  ReportCompleteEvent,
  GetReportListResponse,
  ReportDetailResponse,
  ReportListItem,
  SuggestionItem,
} from '@/entities/reports/model';

const MOCK_REPORTS: ReportListItem[] = [
  {
    report_id: 'mock_report_weekly_completed',
    report_type: 'weekly',
    period_start: '2026-03-17',
    period_end: '2026-03-23',
    session_count: 8,
    status: 'completed',
    created_at: '2026-03-24T09:00:00.000Z',
  },
  {
    report_id: 'mock_report_monthly_completed',
    report_type: 'monthly',
    period_start: '2026-03-01',
    period_end: '2026-03-31',
    session_count: 19,
    status: 'completed',
    created_at: '2026-03-31T09:00:00.000Z',
  },
];

function createCompletedDetail(reportId: string): ReportDetailResponse {
  return {
    report_id: reportId,
    report_type: reportId.includes('monthly') ? 'monthly' : 'weekly',
    period_start: '2026-03-01',
    period_end: '2026-03-31',
    created_at: new Date().toISOString(),
    emotion_graph: {
      data_points: [
        {
          graph_id: 'graph_1',
          session_id: 'session_1',
          avg_score: 24,
          is_inflection_point: false,
          inflection_type: null,
          recorded_at: '2026-03-03T09:00:00.000Z',
        },
        {
          graph_id: 'graph_2',
          session_id: 'session_2',
          avg_score: -12,
          is_inflection_point: true,
          inflection_type: 'drop',
          recorded_at: '2026-03-10T09:00:00.000Z',
        },
      ],
    },
    tendency_analysis: {
      analysis_id: 'analysis_1',
      tendency_summary:
        '전반적으로 회복 탄력성은 안정적이지만, 특정 스트레스 구간에서 감정 기복이 커집니다.',
      resilience_score: 72,
      avg_recovery_hours: 18,
      recovery_change_rate: 12,
    },
    action_suggestions: [
      {
        suggestion_id: 'suggestion_1',
        suggestion_type: 'routine',
        content: '하루 마무리 기록 시간을 10분 정도 고정해 보세요.',
        priority: 1,
        metadata: null,
      },
    ],
  };
}

/** POST /v1/reports */
export const mockCreateReport = async (
  req: CreateReportRequest,
  onStatus: (event: ReportStatusEvent) => void,
  onComplete: (event: ReportCompleteEvent) => void
): Promise<void> => {
  await new Promise((r) => setTimeout(r, 800));
  onStatus({ step: 'analyzing', message: '상담 기록을 분석 중입니다 ...' });
  await new Promise((r) => setTimeout(r, 2000));
  onStatus({ step: 'generating', message: '리포트를 생성 중입니다 ...' });
  await new Promise((r) => setTimeout(r, 2000));
  onComplete({
    report_id: `mock_report_${req.report_type}_${Date.now()}`,
    created_at: new Date().toISOString(),
  });
};

/** GET /v1/reports */
export const mockGetReportList = (reportType?: 'weekly' | 'monthly'): GetReportListResponse => ({
  reports: MOCK_REPORTS.filter((r) => !reportType || r.report_type === reportType),
  can_generate:
    reportType === 'weekly'
      ? { eligible: false, saved_session_count: 1, required_session_count: 3 }
      : { eligible: true, saved_session_count: 12, required_session_count: 3 },
});

/** GET /v1/reports/{report_id} */
export const mockGetReportDetail = (reportId: string): ReportDetailResponse => {
  // 기본 mock 리포트는 항상 완료 상태로 내려서 목록/상세 플로우를 바로 확인할 수 있게 합니다.
  if (reportId.startsWith('mock_report_weekly_completed')) {
    return createCompletedDetail(reportId);
  }

  if (reportId.startsWith('mock_report_monthly_completed')) {
    return createCompletedDetail(reportId);
  }

  const createdAtMs = Number(reportId.split('_').pop());
  // 방금 생성한 mock 리포트는 잠시 generating 상태를 유지해 폴링 UI를 검증할 수 있게 합니다.
  if (Number.isFinite(createdAtMs) && Date.now() - createdAtMs < 10_000) {
    return {
      report_id: reportId,
      status: 'generating',
      created_at: new Date(createdAtMs).toISOString(),
    };
  }

  return createCompletedDetail(reportId);
};

/** GET /v1/reports/{report_id}/suggestions */
export const mockGetReportSuggestions = (_reportId: string): SuggestionItem[] => [
  {
    title: '메모를 통한 감정 조절 연습',
    content:
      '날씨나 외부 상황에 따라 기분이 변하는 패턴을 인식한 후, 그날의 기분이 좋을 때와 그렇지 않을 때 각각 어떤 작은 행동이나 생각이 도움이 되었는지 메모해두면, 앞으로 기분이 내려갈 때 참고할 수 있는 자신만의 패턴을 찾을 수 있을 거예요.',
  },
  {
    title: '꾸준한 루틴 유지',
    content:
      '일정한 수면 패턴과 식사 시간을 지키는 것이 감정 안정에 도움이 됩니다. 작은 습관부터 시작해 보세요.',
  },
];
