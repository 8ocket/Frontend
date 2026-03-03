export interface Users {
  user_id: string; // PK / UUID
  email: string; // 이메일 / VARCHAR(255)
  password_hash: string | null; // 암호화된_비밀번호 / VARCHAR(255)
  nickname: string | null; // 닉네임 / VARCHAR(50)
  profile_image_url: string | null; // 프로필_이미지_URL / VARCHAR(500)
  credit_balance: number | null; // 크레딧_잔액 / INTEGER
  selected_persona_id: string | null; // FK / 선택된_페르소나 / UUID
  onboarding_data: string | null; // 온보딩_설정_데이터 / TEXT
  created_at: Date | null; // 가입일시 / TIMESTAMP
  last_login_at: Date | null; // 마지막_접속 / TIMESTAMP
  is_active: boolean | null; // 활성_상태_여부 / BOOLEAN
}

export interface UserItems {
  user_item_id: string; // PK / UUID
  user_id: string; // FK / 사용자_ID / UUID
  item_id: string; // FK / 아이템_ID / UUID
  is_equipped: boolean | null; // 적용_여부 / BOOLEAN
  acquired_at: Date | null; // 획득_일시 / TIMESTAMP
}
