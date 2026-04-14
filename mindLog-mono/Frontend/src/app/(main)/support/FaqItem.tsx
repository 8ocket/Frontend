'use client';

import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface FaqItemProps {
  readonly question: string;
  readonly answer: string;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
}

const FALLBACK_ANSWER = '현재 답변을 정성껏 준비 중입니다. 잠시만 기다려 주세요.';

export default function FaqItem({ question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border bg-white transition-shadow ${
        isOpen ? 'border-cta-200 shadow-md' : 'border-prime-100 shadow-sm hover:shadow-md'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-all focus:outline-none sm:items-center sm:px-8 sm:py-6"
      >
        <span
          className={`text-[15px] leading-relaxed font-bold transition-colors sm:text-[16px] ${
            isOpen ? 'text-prime-950' : 'text-prime-900 group-hover:text-prime-950'
          }`}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`flex shrink-0 items-center justify-center rounded-full p-1.5 transition-colors ${
            isOpen
              ? 'bg-cta-100 text-cta-600'
              : 'bg-prime-50 text-prime-400 group-hover:bg-cta-50 group-hover:text-cta-500'
          }`}
        >
          <ChevronDown size={18} strokeWidth={2.5} />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-7 sm:px-8 sm:pb-8">
          <div className="border-cta-300 text-prime-700 border-l-[3px] py-1 pl-5 text-[14px] leading-[1.8] whitespace-pre-line sm:text-[15px]">
            {answer || FALLBACK_ANSWER}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
