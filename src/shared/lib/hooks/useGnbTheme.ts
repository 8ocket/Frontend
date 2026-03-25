'use client';

import { useEffect } from 'react';
import { useGnbStore, type GnbTheme } from '@/widgets/gnb/gnbStore';

const GNB_HEIGHT = 64;

/**
 * 페이지 섹션의 data-gnb-theme 속성을 감지해 GNB 배경 테마를 전환합니다.
 *
 * 사용법:
 *   1. 섹션에 data-gnb-theme="light" | "dark" 를 추가
 *   2. 페이지 컴포넌트 최상단에서 useGnbTheme() 호출
 */
export function useGnbTheme() {
  const setTheme = useGnbStore((s) => s.setTheme);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-gnb-theme]')
    );

    if (sections.length === 0) return;

    // 초기값: 첫 번째 섹션의 테마로 설정
    setTheme((sections[0].dataset.gnbTheme as GnbTheme) ?? 'light');

    const observer = new IntersectionObserver(
      (entries) => {
        // 현재 뷰포트에 진입한 섹션 중 가장 위에 있는 것의 테마 적용
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const theme = (visible[0].target as HTMLElement).dataset.gnbTheme as GnbTheme;
          setTheme(theme ?? 'light');
        }
      },
      {
        // GNB 아래 ~ 뷰포트 하단 50% 사이에 들어올 때 트리거
        rootMargin: `-${GNB_HEIGHT}px 0px -50% 0px`,
        threshold: 0,
      }
    );

    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [setTheme]);
}
