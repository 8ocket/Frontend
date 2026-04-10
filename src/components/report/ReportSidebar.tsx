'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Calendar, FileText, PlusCircle, Trash2, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Report, ReportType } from './types';

function shortenPeriod(period: string): string {
  const match = period.match(/^(\d{4})\.(\d{2})\.(\d{2})\s*-\s*(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!match) return period;
  const [, y1, m1, d1, y2, m2, d2] = match;
  if (y1 === y2 && m1 === m2) return `${m1}.${d1} - ${m1}.${d2}`;
  if (y1 === y2) return `${m1}.${d1} - ${m2}.${d2}`;
  return period;
}

interface ReportSidebarProps {
  reports: Report[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  isCreating: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function ReportSidebar({
  reports,
  selectedId,
  onSelect,
  onCreateNew,
  onDelete,
  isCreating,
  isMobileOpen,
  onMobileClose,
}: ReportSidebarProps) {
  const [filter, setFilter] = useState<'all' | ReportType>('all');

  const filteredReports = useMemo(
    () => (filter === 'all' ? reports : reports.filter((r) => r.reportType === filter)),
    [reports, filter]
  );

  const filterTabs = [
    { key: 'all' as const, label: '전체', count: reports.length },
    {
      key: 'weekly' as const,
      label: '주간',
      count: reports.filter((r) => r.reportType === 'weekly').length,
    },
    {
      key: 'monthly' as const,
      label: '월간',
      count: reports.filter((r) => r.reportType === 'monthly').length,
    },
  ];

  const sidebarContent = (
    <>
      {/* 헤더 */}
      <div className="border-prime-100 border-b px-5 py-4">
        {/* 모바일 닫기 버튼 */}
        <div className="mb-3 flex items-center justify-between lg:hidden">
          <span className="text-prime-900 text-sm font-bold">리포트 목록</span>
          <button
            type="button"
            onClick={onMobileClose}
            className="hover:bg-secondary-100 flex size-8 items-center justify-center rounded-lg transition-colors"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-prime-400 mb-4 text-[11px] font-semibold tracking-widest uppercase">
          Report History
        </p>
        <button
          type="button"
          onClick={onCreateNew}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all',
            isCreating
              ? 'bg-main-blue text-white'
              : 'bg-main-blue/10 text-main-blue hover:bg-main-blue/20 border-main-blue/30 border'
          )}
        >
          <PlusCircle className="size-4" />새 리포트 생성
        </button>
      </div>

      {/* 필터 탭 */}
      <div className="border-prime-100 flex border-b">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              '-mb-px flex-1 border-b-2 py-2.5 text-xs font-semibold transition-colors',
              filter === tab.key
                ? 'border-main-blue text-main-blue'
                : 'text-prime-400 hover:text-prime-600 border-transparent'
            )}
          >
            {tab.label}{' '}
            {tab.count > 0 && (
              <span
                className={cn(
                  'text-[10px]',
                  filter === tab.key ? 'text-main-blue' : 'text-prime-300'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 리포트 목록 */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center py-10">
            <div className="bg-prime-50 mb-3 flex size-12 items-center justify-center rounded-full">
              <FileText className="text-prime-300 size-5" />
            </div>
            <p className="text-prime-500 text-xs font-medium">
              {filter === 'all'
                ? '아직 생성된 리포트가 없어요'
                : `${filter === 'weekly' ? '주간' : '월간'} 리포트가 없어요`}
            </p>
            {filter === 'all' && (
              <p className="text-prime-400 mt-1 text-[11px]">
                위 버튼을 눌러 첫 리포트를 만들어 보세요
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredReports.map((report) => {
              const isSelected = selectedId === report.id && !isCreating;
              return (
                <div
                  key={report.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(report.id)}
                  onKeyDown={(e) => e.key === 'Enter' && onSelect(report.id)}
                  className={cn(
                    'group relative w-full cursor-pointer rounded-xl border px-4 py-3.5 text-left transition-all',
                    report.isFailed
                      ? 'border-prime-100 opacity-60 grayscale hover:opacity-80'
                      : report.isGenerating
                        ? 'border-prime-100 bg-prime-50 opacity-70 hover:opacity-80'
                        : isSelected
                          ? 'border-main-blue bg-main-blue/8 ring-main-blue/20 shadow-sm ring-1'
                          : 'border-prime-100 hover:border-prime-200 hover:bg-prime-50'
                  )}
                >
                  {/* 첫 줄: 배지 + 제목 */}
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide',
                        report.isFailed
                          ? 'bg-prime-100 text-prime-400'
                          : report.reportType === 'weekly'
                            ? 'text-main-blue bg-(--main-blue)/10'
                            : 'bg-success-700/10 text-success-700'
                      )}
                    >
                      {report.reportType === 'weekly' ? '주간 리포트' : '월간 리포트'}
                    </span>
                    {report.isGenerating && (
                      <span className="bg-prime-200 text-prime-500 rounded-full px-2 py-0.5 text-[10px] font-bold">
                        생성 중
                      </span>
                    )}
                    {report.isNew && !report.isFailed && !report.isGenerating && (
                      <span className="bg-main-blue size-2 rounded-full" />
                    )}
                    {report.isFailed && <AlertCircle className="text-error-500 size-3" />}
                  </div>

                  {/* 제목 */}
                  <p
                    className={cn(
                      'mt-1.5 text-sm leading-snug font-semibold',
                      report.isFailed
                        ? 'text-prime-400'
                        : isSelected
                          ? 'text-prime-900'
                          : 'text-prime-700'
                    )}
                  >
                    {report.title}
                  </p>

                  {/* 기간 · 생성일 */}
                  <div className="text-prime-400 mt-1.5 flex items-center gap-1.5 text-[11px]">
                    <Calendar className="size-3 shrink-0" />
                    <span>{shortenPeriod(report.period)}</span>
                    <span className="text-prime-200">·</span>
                    <span className="text-prime-300">생성 {report.date}</span>
                  </div>

                  {/* 실패 안내 */}
                  {report.isFailed && (
                    <p className="text-error-500 mt-1.5 text-[11px] font-medium">
                      생성 실패 · 크레딧 복구됨
                    </p>
                  )}

                  {/* 삭제 버튼 — 터치 기기 대응: 항상 표시 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(report.id);
                    }}
                    className="text-prime-300 hover:text-error-500 absolute top-2.5 right-2.5 rounded p-1 transition-all lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label="리포트 삭제"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
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
    </>
  );

  return (
    <>
      {/* 데스크톱 사이드바 (lg+) */}
      <aside className="border-prime-100 hidden w-80.75 shrink-0 flex-col border-r border-l bg-white lg:flex">
        {sidebarContent}
      </aside>

      {/* 모바일 드로어 (lg 미만) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />
            <motion.aside
              className="border-prime-100 fixed inset-y-0 left-0 z-50 flex w-[min(320px,85vw)] flex-col border-r border-l bg-white lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
