'use client';

import { useEffect, useState } from 'react';
import { Database, Brain, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const STEPS = [
  { icon: Database, label: '상담 데이터 수집 중' },
  { icon: Brain, label: '감정 패턴 분석 중' },
  { icon: Sparkles, label: '인사이트 생성 중' },
  { icon: FileText, label: '리포트 작성 중' },
];

interface ReportPollingProps {
  onComplete: () => void;
}

export function ReportPolling({ onComplete }: ReportPollingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 900;
    const progressTick = 30;
    const totalDuration = STEPS.length * stepDuration;

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + (progressTick / totalDuration) * 100, 99));
    }, progressTick);

    const stepInterval = setInterval(() => {
      setCurrentStep((s) => {
        const next = s + 1;
        if (next >= STEPS.length) {
          clearInterval(stepInterval);
          clearInterval(progressInterval);
          setProgress(100);
          setTimeout(onComplete, 600);
        }
        return next;
      });
    }, stepDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [onComplete]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 스피너 */}
        <div className="mb-8 flex justify-center">
          <div className="relative size-24">
            <svg className="size-24 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="#eceff4" strokeWidth="6" />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="var(--main-blue)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                className="transition-all duration-300"
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-xl font-bold"
              style={{ color: 'var(--main-blue)' }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* 타이틀 */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-prime-900">
            AI가 분석하고 있습니다
          </h2>
          <p className="mt-2 text-sm text-prime-500">잠시만 기다려 주세요</p>
        </div>

        {/* 단계 목록 */}
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            return (
              <div
                key={step.label}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300',
                  isDone
                    ? 'bg-bg-light'
                    : isActive
                      ? 'bg-(--main-blue)/10 ring-1 ring-main-blue/30'
                      : 'opacity-40',
                )}
              >
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full',
                    isDone ? 'bg-success-700' : isActive ? 'bg-main-blue' : 'bg-prime-200',
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="size-4 text-white" />
                  ) : (
                    <Icon
                      className={cn('size-4', isActive ? 'text-prime-900' : 'text-prime-400')}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium',
                    isDone ? 'text-prime-400 line-through' : isActive ? 'text-prime-900' : 'text-prime-400',
                  )}
                >
                  {step.label}
                </span>
                {isActive && (
                  <span className="ml-auto flex gap-0.5">
                    {[0, 1, 2].map((j) => (
                      <span
                        key={j}
                        className="size-1.5 animate-bounce rounded-full bg-main-blue"
                        style={{ animationDelay: `${j * 0.15}s` }}
                      />
                    ))}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* 진행 바 */}
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-prime-100">
          <div
            className="h-full rounded-full bg-main-blue transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
