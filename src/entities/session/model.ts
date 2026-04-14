// ─── /v1/sessions (GET) - 세션 목록 조회 ───

export type SessionStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'SAVED';

export interface SessionListQuery {
  page?: number;
  size?: number;
  start_date?: string;
  end_date?: string;
}

export interface SessionListItem {
  sessionId: string;
  title: string;
  status: SessionStatus;
  startedAt: string;
}

export interface Pagination {
  page: number;
  size: number;
  total_count: number;
  total_pages: number;
}

export interface SessionListResponse {
  sessions: SessionListItem[];
  pagination: Pagination;
}

// ─── /v1/sessions/active (GET) - 미완료 세션 확인 ───

export interface ActiveSessionResponse {
  session_id: string;
  title: string;
  started_at: string;
}

// ─── /v1/sessions (POST) - 세션 생성 (SSE) ───

export interface CreateSessionRequest {
  first_content: string;
}

// SSE 이벤트 순서: [ai_chunk × N] → ai_complete → session_title → done
export interface CreateSessionAiCompleteEvent {
  session_id: string;
  status: string;
  started_at: string;
}

export interface CreateSessionSessionTitleEvent {
  title: string;
}

// ─── /v1/sessions/{session_id} (POST) - 상담 메시지 전송 ───

// Request
export interface SendMessageRequest {
  content: string;
}

// SSE 이벤트 타입
export type SSEEventType = 'ai_chunk' | 'ai_complete' | 'crisis_check' | 'done' | 'error';

export interface SSEChunkEvent {
  content: string;
}

export interface CounselingSessions {
  session_id: string; // PK / UUID
  user_id: string; // FK / 사용자_ID / UUID
  status: string | null; // 세션_상태 / VARCHAR(20)
  started_at: Date | null; // 시작_시간 / TIMESTAMP
  ended_at: Date | null; // 종료_시간 / TIMESTAMP
  concern_keywords: string | null; // 고민_키워드(기획에 따라 고민중) / TEXT
  emotion_keywords: string | null; // 감정_키워드(기획에 따라 고민중) / TEXT
  created_at: Date | null; // 생성일시 / TIMESTAMP
  updated_at: Date | null; // 수정일시 / TIMESTAMP
}

export interface SessionMessages {
  message_id: string; // PK / UUID
  session_id: string; // FK / 세션_ID / UUID
  role: string; // 역할 / VARCHAR(20)
  content: string; // 메시지_내용 / TEXT
  sequence_num: number; // 메시지_순서 / INTEGER
  is_meaningful: boolean | null; // 분석_포함_여부(안쓸 수 있음) / BOOLEAN
  created_at: Date | null; // 발화_시간 / TIMESTAMP
}

export interface SessionSummaries {
  summary_id: string; // PK / UUID
  session_id: string; // FK / 세션_ID / UUID
  user_id: string; // FK / 사용자_ID / UUID
  fact: string | null; // 사건_요약 / TEXT
  emotion: string | null; // 감정_요약 / TEXT
  insight: string | null; // 인사이트 / TEXT
  is_edited: boolean | null; // 사용자_수정_여부 / BOOLEAN
  visibility: string | null; // 공개_범위(고민중...확장성 떄문에 넣음) / VARCHAR(20)
  created_at: Date | null; // 생성일시 / TIMESTAMP
  updated_at: Date | null; // 수정일시 / TIMESTAMP
}
// ─── /v1/sessions/{session_id}/finalize (POST) - 세션 종료 ───

export interface FinalizeStatusEvent {
  step: 'analyzing' | 'summarizing' | 'creating_card';
  message: string;
}

export interface FinalizeEmotionItem {
  intensity: number;
  source_keyword: string;
  emotion_type: string;
}

export interface FinalizeCompleteEvent {
  summary_id: string;
  emotions: FinalizeEmotionItem[];
  card_image_url: string;
  summary: {
    fact: string;
    emotion: string;
    insight: string;
  };
}

// ─── /v1/sessions/{session_id} (GET) - 세션 상세 조회 ───

export interface SessionDetailMessage {
  message_id: string;
  role: 'assistant' | 'user';
  content: string;
  sequence_num: number;
  created_at: string;
}

export interface SessionDetailResponse {
  session_id: string;
  persona_image_url: string;
  persona_name: string;
  status: string;
  messages: SessionDetailMessage[];
  has_summary: boolean;
  card_image_url?: string;
}

export interface SessionCheckpointMapping {
  mapping_id: string; // PK / UUID
  session_id: string; // FK / 세션_ID / UUID
  thread_id: string; // Thread_ID / VARCHAR(100)
  created_at: Date | null; // 생성일시 / TIMESTAMP
  updated_at: Date | null; // 수정일시 / TIMESTAMP
}
