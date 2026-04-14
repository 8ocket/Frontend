import { z } from 'zod';

// 리포트 타입
export const ReportTypeSchema = z
  .enum(['weekly', 'monthly', 'WEEKLY', 'MONTHLY'])
  .transform((v) => v.toLowerCase() as 'weekly' | 'monthly');

// 리포트 목록 아이템
export const ReportListItemSchema = z.object({
  report_id: z.string(),
  report_type: ReportTypeSchema,
  period_start: z.string(),
  period_end: z.string(),
  session_count: z.number().optional(),
  status: z.string(),
  created_at: z.string(),
  is_viewed: z.boolean().optional(),
});

// 생성 가능 여부
export const CanGenerateSchema = z.object({
  eligible: z.boolean(),
  saved_session_count: z.number(),
  required_session_count: z.number(),
});

// 리포트 목록 응답
export const GetReportListResponseSchema = z.object({
  reports: z.array(ReportListItemSchema),
  can_generate: CanGenerateSchema,
});

// 감정 그래프 데이터 포인트
export const ReportGraphDataPointSchema = z.object({
  session_id: z.string(),
  avg_score: z.number(),
  recorded_at: z.string(),
});

// 감정 그래프 응답
export const GetReportGraphsResponseSchema = z.object({
  graph_count: z.number(),
  graphs: z.array(ReportGraphDataPointSchema),
  graph_evaluation: z.string(),
});

// 행동 제언
export const SuggestionItemSchema = z.object({
  title: z.string(),
  content: z.string(),
});

// 경향 분석
export const TendencyResponseSchema = z.object({
  current_status: z.string(),
  tendency: z.string(),
});

// 키워드/토픽
export const AiReportTopicItemSchema = z.object({
  name: z.string(),
  category: z.string(),
  pattern: z.string(),
});

export const GetReportKeywordsResponseSchema = z.object({
  topics: z.array(AiReportTopicItemSchema),
  topics_evaluation: z.string(),
});

// SSE 이벤트
export const ReportStatusEventSchema = z.object({
  step: z.enum(['analyzing', 'generating']),
  message: z.string(),
});

export const ReportCompleteEventSchema = z.object({
  report_id: z.string(),
  created_at: z.string(),
});
