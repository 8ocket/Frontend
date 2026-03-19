'use client';

// Figma 1457:2423 — 8×636, track neutral-300, thumb cta-300, radius 4

import { useRef, useCallback } from 'react';

type ChatScrollbarProps = {
  /** 0~1 스크롤 위치 비율 */
  scrollRatio?: number;
  /** clientHeight / scrollHeight 비율 (thumb 크기 결정) */
  thumbRatio?: number;
  /** 트랙 클릭 또는 드래그 시 호출 */
  onScrollTo?: (ratio: number) => void;
};

export function ChatScrollbar({
  scrollRatio = 0,
  thumbRatio = 0.2,
  onScrollTo,
}: ChatScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartRatio = useRef(0);

  const clampedRatio = Math.min(Math.max(scrollRatio, 0), 1);
  const thumbPercent = Math.max(thumbRatio * 100, 8); // 최소 8%
  const thumbTopPercent = clampedRatio * (100 - thumbPercent);

  const handleThumbMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      dragStartY.current = e.clientY;
      dragStartRatio.current = clampedRatio;

      function onMouseMove(ev: MouseEvent) {
        if (!isDragging.current || !trackRef.current) return;
        const trackH = trackRef.current.clientHeight;
        const usableH = trackH * (1 - thumbRatio);
        const delta = ev.clientY - dragStartY.current;
        const newRatio = dragStartRatio.current + delta / usableH;
        onScrollTo?.(Math.min(Math.max(newRatio, 0), 1));
      }

      function onMouseUp() {
        isDragging.current = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [clampedRatio, thumbRatio, onScrollTo],
  );

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const newRatio = (e.clientY - rect.top) / rect.height;
      onScrollTo?.(Math.min(Math.max(newRatio, 0), 1));
    },
    [onScrollTo],
  );

  return (
    <div
      ref={trackRef}
      className="bg-neutral-300 relative w-2 shrink-0 cursor-pointer rounded-sm"
      onClick={handleTrackClick}
      aria-hidden="true"
    >
      <div
        className="bg-cta-300 absolute left-0 w-2 cursor-grab rounded-sm active:cursor-grabbing"
        style={{
          top: thumbTopPercent + '%',
          height: thumbPercent + '%',
        }}
        onMouseDown={handleThumbMouseDown}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
