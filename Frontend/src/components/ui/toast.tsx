'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

// ── Figma 디자인 시스템: 토스트 (node 340:1075 > 토스트) ─────────
// bg: secondary-100, border: glass-stroke/30 (rgba(130,201,255,0.3))
// rounded-xl, p-4, shadow-lg
// Semantic: blue(info) / green(success) / red(error) / yellow(warning)
// Auto-dismiss: 3000ms
// ─────────────────────────────────────────────────────────────────

export type ToastSemantic = 'info' | 'success' | 'error' | 'warning';

interface ToastItem {
  id: string;
  message: string;
  semantic: ToastSemantic;
}

interface ToastContextValue {
  toast: (message: string, semantic?: ToastSemantic) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const SEMANTIC_STYLES: Record<ToastSemantic, string> = {
  info: 'border-l-cta-300 text-cta-300',
  success: 'border-l-success-800 text-success-800',
  error: 'border-l-error-600 text-error-600',
  warning: 'border-l-warning-600 text-warning-600',
};

const SEMANTIC_ICONS: Record<ToastSemantic, string> = {
  info: 'ℹ',
  success: '✓',
  error: '✕',
  warning: '⚠',
};

const AUTO_DISMISS_MS = 3000;

function ToastCard({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(false), AUTO_DISMISS_MS);
    return () => clearTimeout(timerRef.current);
  }, []);

  // 애니메이션 종료 후 제거
  function handleAnimationEnd() {
    if (!visible) onRemove(item.id);
  }

  return (
    <div
      role="status"
      aria-live="polite"
      onAnimationEnd={handleAnimationEnd}
      className={cn(
        'bg-secondary-100 flex min-w-[260px] max-w-[360px] items-center gap-3 rounded-xl border-2 border-l-4 border-[rgba(130,201,255,0.3)] p-4 shadow-lg',
        SEMANTIC_STYLES[item.semantic],
        visible ? 'animate-in fade-in-0 slide-in-from-bottom-4' : 'animate-out fade-out-0 slide-out-to-bottom-4'
      )}
    >
      <span className="shrink-0 text-lg leading-none" aria-hidden>
        {SEMANTIC_ICONS[item.semantic]}
      </span>
      <p className="text-prime-900 flex-1 text-sm font-medium leading-snug">{item.message}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="text-prime-500 shrink-0 text-base leading-none transition-opacity hover:opacity-70"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, semantic: ToastSemantic = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, semantic }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast 컨테이너 — 우측 하단 고정 */}
      <div
        aria-label="알림"
        className="fixed right-4 bottom-4 z-[100] flex flex-col gap-2"
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
