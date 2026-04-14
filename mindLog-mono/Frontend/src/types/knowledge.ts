export interface KnowledgeEntities {
  entity_id: string; // PK / UUID
  user_id: string; // FK / 사용자_ID / UUID
  entity_type: string; // 엔티티_유형 / VARCHAR(20)
  name: string; // 이름_(익명화 필요한가?) / VARCHAR(100)
  properties: string | null; // 속성 / TEXT
  mention_count: number | null; // 언급_횟수 / INTEGER
  first_seen_at: Date | null; // 최초_등장 / TIMESTAMP
  last_seen_at: Date | null; // 최근_등장 / TIMESTAMP
  created_at: Date | null; // 생성일시 / TIMESTAMP
  updated_at: Date | null; // 수정일시 / TIMESTAMP
}

export interface KnowledgeRelations {
  relation_id: string; // PK / UUID
  source_entity_id: string; // FK / 출발_엔티티 / UUID
  target_entity_id: string; // FK / 도착_엔티티 / UUID
  relation_type: string; // 관계_유형 / VARCHAR(30)
  weight: number | null; // 관계_강도 / FLOAT
  occurrence_count: number | null; // 발생_횟수 / INTEGER
  session_id: string | null; // FK / 발견_세션 / UUID
  created_at: Date | null; // 생성일시 / TIMESTAMP
  updated_at: Date | null; // 수정일시 / TIMESTAMP
}

export interface Embeddings {
  embedding_id: string; // PK / UUID
  source_type: string; // 소스_유형 / VARCHAR(30)
  source_id: string; // 원본_ID / UUID
  user_id: string; // FK / 사용자_ID / UUID
  vector: string; // 벡터_데이터 / TEXT
  model_version: string | null; // 모델_버전 / VARCHAR(50)
  created_at: Date | null; // 생성일시 / TIMESTAMP
}
