import { CreateReportRequest, CreateReportResponse } from '@/entities/reports/model';

/** POST /v1/reports */
export const mockCreateReport = (req: CreateReportRequest): CreateReportResponse => ({
  report_id: `mock_report_${req.report_type}_${Date.now()}`,
  status: 'generating',
  estimated_seconds: 10,
});
