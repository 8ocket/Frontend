'use client';

import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}

const FALLBACK_ANSWER = '현재 답변을 정성껏 준비 중입니다. 잠시만 기다려 주세요.';

export default function FaqItem({ question, answer, isOpen, onToggle, isLast }: FaqItemProps) {
  return (
    <div className={!isLast ? 'border-b border-prime-100' : ''}>
      <button
        type="button"
        onClick={onToggle}
        className="group hover:bg-secondary-50 focus:bg-secondary-100/80 flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition-all focus:outline-none sm:items-center sm:px-8 sm:py-6"
      >
        <span
          className={`text-[15px] leading-relaxed font-semibold transition-colors sm:text-[16px] ${
            isOpen ? 'text-prime-900' : 'text-prime-900 group-hover:text-prime-700'
          }`}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`shrink-0 transition-colors ${
            isOpen ? 'text-prime-700' : 'text-prime-300 group-hover:text-prime-500'
          }`}
        >
          <ChevronDown size={20} strokeWidth={2.5} />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-6 sm:px-8 sm:pb-7">
          <div className="bg-secondary-100 text-prime-600 rounded-2xl p-6 text-[14px] leading-relaxed whitespace-pre-line sm:text-[15px]">
            {answer || FALLBACK_ANSWER}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
