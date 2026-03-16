export interface AiReports {
  report_id: string; // PK / UUID
  user_id: string; // FK / 사용자_ID / UUID
  report_type: string; // 리포트_유형 / VARCHAR(20)
  period_start: Date; // 분석_시작일 / DATE
  period_end: Date; // 분석_종료일 / DATE
  session_count: number | null; // 포함_세션_수 / INTEGER
  status: string | null; // 생성_상태 / VARCHAR(20)
  created_at: Date | null; // 생성일시 / TIMESTAMP
}

export interface ReportEmotionGraphs {
  graph_id: string; // PK / UUID
  report_id: string; // FK / 리포트_ID / UUID
  session_id: string; // FK / 세션_ID / UUID
  avg_score: number | null; // 평균_감정_점수 / INTEGER
  is_inflection_point: boolean | null; // 변곡점_여부 / BOOLEAN
  inflection_type: string | null; // 변곡점_유형 / VARCHAR(20)
  recorded_at: Date; // 데이터_시점 / TIMESTAMP
}

export interface ReportTendencyAnalysis {
  analysis_id: string; // PK / UUID
  report_id: string; // FK / 리포트_ID / UUID
  tendency_summary: string; // 성향_요약 / TEXT
  resilience_score: number | null; // 회복_탄력성 / FLOAT
  avg_recovery_hours: number | null; // 평균_회복_시간 / FLOAT
  recovery_change_rate: number | null; // 회복_속도_변화율 / FLOAT
  created_at: Date | null; // 생성일시 / TIMESTAMP
}

export interface ReportActionSuggestions {
  suggestion_id: string; // PK / UUID
  report_id: string; // FK / 리포트_ID / UUID
  suggestion_type: string; // 제언_유형 / VARCHAR(20)
  content: string; // 제언_내용 / TEXT
  priority: number | null; // 우선순위 / INTEGER
  metadata: string | null; // 메타데이터 / TEXT
}
