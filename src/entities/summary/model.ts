export interface SummaryListItem {
  summaryId: string;
  cardId: string;
  sessionId: string;
  frontImageUrl: string;
  backImageUrl: string;
  createdAt: string;
}

export interface SummaryListResponse {
  content: SummaryListItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface SummaryUpdateRequest {
  fact: string;
  emotion: string;
  insight: string;
}

export interface SummaryResponse {
  summary_id: string;
  session_id: string;
  fact: string | null;
  emotion: string | null;
  insight: string | null;
  is_edited: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
}

export interface SummaryCardResponse {
  card_id: string;
  front_image_url: string;
  back_image_url: string;
}
