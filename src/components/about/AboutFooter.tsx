'use client';

// Figma 1679:5021 — "1280 Footer / Sitemap"
// Root: 1920×383px, VERTICAL, CENTER, padding: 8px 48px
// fills: #82C9FF at 10% opacity
//
// Inner (2515:11931): 1181px wide, VERTICAL, gap: 40px
//   Nav row (2515:11930): 1181px, HORIZONTAL, gap: 16px
//     Logo Small: 80×80px
//     Menu group (2515:11929): 1085px, HORIZONTAL, SPACE_BETWEEN, gap: 80px
//       홈 / AI 상담 / 브랜드 소개 (TEXT only)
//       마음기록 모음 group (VERTICAL, gap: 15px)
//       심화 리포트 group (VERTICAL, gap: 21px)
//       상점 group (VERTICAL, gap: 21px)
//       고객지원 group (VERTICAL, gap: 23px)
//       계정관리 group (VERTICAL, gap: 21px)
//   Copyright row (2515:11923): 829px, VERTICAL, gap: 8px

import Image from 'next/image';

// 섹션 헤더: Pretendard SemiBold 16px, #1A222E, ls:-0.24px, lh:130%
// 서브링크:   Pretendard Regular 14px, #3F526F, lh:160%
// 심플 TEXT(하위 없음): 헤더 스타일만

const FOOTER_NAV = [
  { title: '홈',          items: [],                                                               gap: 0  },
  { title: 'AI 상담',     items: [],                                                               gap: 0  },
  { title: '브랜드 소개', items: [],                                                               gap: 0  },
  { title: '마음기록 모음', items: ['오로라 감정카드'],                                             gap: 15 },
  { title: '심화 리포트', items: ['주간 리포트', '월간 리포트'],                                   gap: 21 },
  { title: '상점',        items: ['크레딧 구매', '페르소나 구매', '이벤트'],                        gap: 21 },
  { title: '고객지원',    items: ['자주 묻는 질문', '결제 관련 문의', 'AI 상담 문의', '기타 오류', '연락처'], gap: 23 },
  { title: '계정관리',    items: ['회원 탈퇴'],                                                     gap: 21 },
];

const headerStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  lineHeight: '130%',
  letterSpacing: '-0.24px',
  color: '#1A222E',
  whiteSpace: 'nowrap',
};

const subStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '160%',
  letterSpacing: 0,
  color: '#3F526F',
  whiteSpace: 'nowrap',
};

const copyrightStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '120%',
  letterSpacing: '-0.18px',
  color: '#1A222E',
};

export function AboutFooter() {
  return (
    // 1679:5021 — 1920×383px, VERTICAL, CENTER, padding: 8px 48px, bg: #82C9FF 10%
    <footer
      className="flex w-full flex-col items-center"
      style={{
        background: 'rgba(130, 201, 255, 0.10)',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 48,
        paddingRight: 48,
      }}
    >
      {/* Inner 2515:11931 — 1181px, VERTICAL, gap: 40px */}
      <div className="flex flex-col" style={{ width: 1181, gap: 40 }}>

        {/* Nav row 2515:11930 — HORIZONTAL, gap: 16px */}
        <div className="flex flex-row items-start" style={{ gap: 16, paddingTop: 8 }}>

          {/* Logo Small — 80×80px */}
          <Image
            src="/images/logo/logo-small.svg"
            alt="MindLog"
            width={80}
            height={80}
            className="shrink-0"
          />

          {/* Menu group 2515:11929 — 1085px, HORIZONTAL, SPACE_BETWEEN */}
          <div
            className="flex flex-row flex-1 justify-between"
            style={{ gap: 80 }}
          >
            {FOOTER_NAV.map((section) => (
              <div
                key={section.title}
                className="flex flex-col"
                style={{ gap: section.items.length > 0 ? section.gap : 0 }}
              >
                {/* 섹션 헤더 — 16px SemiBold #1A222E */}
                <span style={headerStyle}>{section.title}</span>

                {/* 하위 링크 — 14px Regular #3F526F */}
                {section.items.map((item) => (
                  <span key={item} style={subStyle}>{item}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Copyright row 2515:11923 — VERTICAL, gap: 8px */}
        <div className="flex flex-col" style={{ gap: 8, paddingBottom: 8 }}>
          <p style={copyrightStyle}>
            본 서비스는 전문 심리 상담 이론(인지행동치료 등)을 바탕으로 설계되었습니다. 사용자의 모든 대화는 암호화되어 안전하게 보관됩니다
          </p>
          <p style={copyrightStyle}>
            All rights reserved by 마인드 로그(Mind-Log)©
          </p>
        </div>

      </div>
    </footer>
  );
}
