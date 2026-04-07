'use client';

import Link from 'next/link';
import { AlertCircle, Calendar, PlusCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Report } from './types';

interface ReportSidebarProps {
  reports: Report[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  isCreating: boolean;
}

export function ReportSidebar({
  reports,
  selectedId,
  onSelect,
  onCreateNew,
  isCreating,
}: ReportSidebarProps) {
  return (
    <aside className="border-prime-100 hidden w-72 shrink-0 flex-col border-r bg-white xl:flex">
      {/* 헤더 */}
      <div className="border-prime-100 border-b px-5 py-4">
        <p className="text-prime-400 mb-4 text-[11px] font-semibold tracking-widest uppercase">
          Report History
        </p>
        <button
          type="button"
          onClick={onCreateNew}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all',
            isCreating
              ? 'bg-main-blue text-prime-900'
              : 'border-prime-200 text-prime-500 hover:border-main-blue hover:text-main-blue border-2 border-dashed'
          )}
        >
          <PlusCircle className="size-4" />새 리포트 생성
        </button>
      </div>

      {/* 리포트 목록 */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {reports.length === 0 ? (
          <p className="text-prime-400 py-8 text-center text-xs">생성된 리포트가 없습니다</p>
        ) : (
          <div className="space-y-1">
            {reports.map((report) => {
              const isSelected = selectedId === report.id && !isCreating;
              return (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => onSelect(report.id)}
                  className={cn(
                    'w-full rounded-lg px-3 py-3 text-left transition-all',
                    report.isFailed
                      ? 'opacity-60 grayscale hover:opacity-80'
                      : report.isGenerating
                        ? 'hover:bg-prime-100/50 opacity-70'
                        : isSelected
                          ? 'border-main-blue bg-main-blue/10 border-l-2'
                          : 'hover:bg-prime-100/50'
                  )}
                >
                  {/* 배지 */}
                  <div className="mb-1.5 flex items-center gap-1.5">
                    {report.isGenerating && (
                      <span className="bg-prime-200 text-prime-500 inline-block rounded px-2 py-0.5 text-[10px] font-bold">
                        생성 중
                      </span>
                    )}
                    {report.isNew && !report.isFailed && !report.isGenerating && (
                      <span className="bg-main-blue size-2 inline-block rounded-full" />
                    )}
                    <span className="text-prime-400 text-[10px] font-medium">{report.type}</span>
                    {report.isFailed && <AlertCircle className="text-prime-400 size-3" />}
                  </div>

                  {/* 기간 */}
                  <p
                    className={cn(
                      'text-[13px] leading-snug font-semibold',
                      report.isFailed
                        ? 'text-prime-400'
                        : isSelected
                          ? 'text-prime-900'
                          : 'text-prime-600'
                    )}
                  >
                    {report.period}
                  </p>

                  {/* 날짜 */}
                  <div className="mt-1 flex items-center gap-1">
                    <Calendar className="text-prime-400 size-3" />
                    <span className="text-prime-400 text-[11px]">{report.date}</span>
                  </div>

                  {/* 실패 안내 */}
                  {report.isFailed && (
                    <p className="text-error-500 mt-1.5 text-[11px] font-medium">
                      생성 실패 · 크레딧 복구됨
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className="shrink-0 px-5 pt-4 pb-5">
        <div className="border-prime-100 mb-4 border-t" />
        <div className="mb-3 flex flex-col gap-1">
          {[
            { label: '개인정보처리방침', href: '/terms/personalInfo' },
            { label: '이용약관', href: '/terms/serviceTerm' },
            { label: 'AI 이용 안내', href: '/terms/aiServiceTerm' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-prime-700/70 hover:text-cta-300 -mx-1 rounded px-1 py-1 text-[11px] font-semibold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-prime-700/40 text-[10px] leading-relaxed">
          © 2026 마인드 로그 (MindLog).
          <br />
          All rights reserved.
        </p>
      </div>
    </aside>
  );
}
