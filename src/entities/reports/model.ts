// 백엔드 공통 응답 포맷 (report 도메인 기준 확인)
// 다른 도메인도 동일 포맷 확인 시 user/model.ts의 ApiResponse로 통합
export interface ReportApiResponse<T> {
  code: string;
  message: string;
  data?: T;
  timestamp: string;
}

// --- POST /v1/reports 리포트 생성 요청
export type ReportType = 'weekly' | 'monthly';

export interface CreateReportRequest {
  report_type: ReportType;
  period_start: string; // 'yyyy-MM-dd'
  period_end: string; // 'yyyy-MM-dd'
}

export interface CreateReportResponse {
  report_id: string;
  status: 'generating';
  estimated_seconds: number;
}

// --- GET /v1/reports?report_type=weekly|monthly 리포트 목록 조회

export interface ReportListItem {
  report_id: string;
  report_type: ReportType;
  period_start: string; // 'yyyy-MM-dd'
  period_end: string; // 'yyyy-MM-dd'
  session_count: number;
  status: string; // 'completed' 확인, 'generating'/'failed' 백엔드 확인 필요
  created_at: string; // ISO timestamp
}

export interface CanGenerate {
  eligible: boolean;
  saved_session_count: number;
  required_session_count: number;
}

export interface GetReportListResponse {
  reports: ReportListItem[];
  can_generate: CanGenerate;
}

// --- GET /v1/reports/{report_id} 리포트 상세 조회

export interface ReportEmotionDataPoint {
  graph_id: string;
  session_id: string;
  avg_score: number | null;
  is_inflection_point: boolean;
  inflection_type: string | null;
  recorded_at: string; // ISO timestamp
}

export interface ReportTendencyAnalysis {
  analysis_id: string;
  tendency_summary: string;
  resilience_score: number | null;
  avg_recovery_hours: number | null;
  recovery_change_rate: number | null;
}

export interface ReportActionSuggestion {
  suggestion_id: string;
  suggestion_type: string;
  content: string;
  priority: number | null;
  metadata: string | null; // JSON string
}

// status: completed
export interface ReportDetailCompleted {
  report_id: string;
  report_type: ReportType;
  period_start: string; // 'yyyy-MM-dd'
  period_end: string; // 'yyyy-MM-dd'
  created_at: string;
  emotion_graph: {
    data_points: ReportEmotionDataPoint[];
  };
  tendency_analysis: ReportTendencyAnalysis;
  action_suggestions: ReportActionSuggestion[];
}

// status: generating
export interface ReportDetailGenerating {
  report_id: string;
  status: 'generating';
  created_at: string;
}

export type ReportDetailResponse = ReportDetailCompleted | ReportDetailGenerating;
