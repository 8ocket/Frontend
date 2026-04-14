export type ReportType = 'weekly' | 'monthly';
export type ReportStatus = 'idle' | 'creating' | 'success' | 'failed';

export interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  period: string;
  reportType: ReportType;
  isNew?: boolean;
  isFailed?: boolean;
  isGenerating?: boolean;
}
