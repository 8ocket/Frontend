// --- /v1/reports (POST) 리포트 생성 요청
export type ReportType = 'weekly' | 'monthly';

export interface CreateReportRequest {
  report_type: ReportType;
  period_start: string;
  period_end: string;
}

export interface CreateReportResponse {
  report_id: string;
  status: 'generating';
  estimated_seconds: number;
}
