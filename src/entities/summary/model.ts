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
