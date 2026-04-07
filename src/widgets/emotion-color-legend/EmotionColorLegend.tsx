'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { EMOTION_META, EMOTION_TYPES } from '@/entities/emotion';

export function EmotionColorLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        'w-full rounded-2xl border transition-colors duration-300',
        'border-[rgba(130,201,255,0.5)] bg-[rgba(130,201,255,0.06)]'
      )}
    >
      {/* 헤더 (항상 노출) */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4"
        aria-expanded={open}
      >
        <span className="subtitle-1 text-prime-800">감정카드 색상의 의미</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-prime-500 shrink-0"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      {/* 펼쳐지는 콘텐츠 */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-5 px-6 pb-6">
              {/* 설명 */}
              <p className="body-01 text-prime-600">
                각 색상은 어떤 감정을 담고 있는지 살펴보세요. 이를 통해 여러분들의 카드를 보시고
                내 감정은 어땠는지 파악하는 시간을 가져보시길 바랍니다.
              </p>

              {/* 감정 색상 배지 목록 */}
              <div className="flex flex-wrap gap-3">
                {EMOTION_TYPES.map((type) => {
                  const meta = EMOTION_META[type];
                  return (
                    <div
                      key={type}
                      className="flex items-center gap-2.5 rounded-sm border border-[rgba(130,201,255,0.5)] bg-secondary px-2 py-1.5"
                    >
                      <span
                        className="shrink-0 rounded-full"
                        style={{
                          width: 16,
                          height: 16,
                          backgroundColor: meta.hex,
                        }}
                      />
                      <span className="caption-01 text-prime-900">{meta.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
