'use client';

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
    <aside className="hidden w-72 shrink-0 flex-col border-r border-prime-100 bg-white xl:flex">
      {/* 헤더 */}
      <div className="border-b border-prime-100 px-5 py-4">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-prime-400">
          Report History
        </p>
        <button
          type="button"
          onClick={onCreateNew}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all',
            isCreating
              ? 'bg-main-blue text-prime-900'
              : 'border-2 border-dashed border-prime-200 text-prime-500 hover:border-main-blue hover:text-main-blue',
          )}
        >
          <PlusCircle className="size-4" />
          새 리포트 생성
        </button>
      </div>

      {/* 리포트 목록 */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {reports.length === 0 ? (
          <p className="py-8 text-center text-xs text-prime-400">생성된 리포트가 없습니다</p>
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
                      : isSelected
                        ? 'border-l-2 border-main-blue bg-(--main-blue)/10'
                        : 'hover:bg-prime-100/50',
                  )}
                >
                  {/* 배지 */}
                  <div className="mb-1.5 flex items-center gap-1.5">
                    {report.isNew && !report.isFailed && (
                      <span className="inline-block rounded bg-main-blue px-2 py-0.5 text-[10px] font-bold text-prime-900">
                        NEW
                      </span>
                    )}
                    <span className="text-[10px] font-medium text-prime-400">{report.type}</span>
                    {report.isFailed && <AlertCircle className="size-3 text-error-500" />}
                  </div>

                  {/* 기간 */}
                  <p
                    className={cn(
                      'text-[13px] font-semibold leading-snug',
                      report.isFailed
                        ? 'text-prime-400'
                        : isSelected
                          ? 'text-prime-900'
                          : 'text-prime-600',
                    )}
                  >
                    {report.period}
                  </p>

                  {/* 날짜 */}
                  <div className="mt-1 flex items-center gap-1">
                    <Calendar className="size-3 text-prime-400" />
                    <span className="text-[11px] text-prime-400">{report.date}</span>
                  </div>

                  {/* 실패 안내 */}
                  {report.isFailed && (
                    <p className="mt-1.5 text-[11px] font-medium text-error-500">
                      생성 실패 · 크레딧 복구됨
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
