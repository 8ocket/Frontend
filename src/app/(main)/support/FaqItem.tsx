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
    <div className={!isLast ? 'border-b border-slate-100' : ''}>
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition-all hover:bg-slate-50/60 focus:bg-slate-50/80 focus:outline-none sm:items-center sm:px-8 sm:py-6"
      >
        <span
          className={`text-[15px] leading-relaxed font-semibold transition-colors sm:text-[16px] ${
            isOpen ? 'text-[#1A222E]' : 'text-[#1A222E] group-hover:text-[#007AFF]'
          }`}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`shrink-0 transition-colors ${
            isOpen ? 'text-neutral-700' : 'text-[#94A3B8] group-hover:text-[#64748B]'
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
          <div className="rounded-2xl bg-[#F8FAFC] p-6 text-[14px] leading-relaxed whitespace-pre-line text-[#475467] sm:text-[15px]">
            {answer || FALLBACK_ANSWER}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
