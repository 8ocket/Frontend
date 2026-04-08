'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale/ko';

import { cn } from '@/shared/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={ko}
      showOutsideDays={showOutsideDays}
      className={cn('p-4', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4',
        month_caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label: 'text-sm font-semibold text-prime-800 tracking-tight',
        nav: 'flex items-center gap-1',
        button_previous:
          'absolute left-1 h-7 w-7 inline-flex items-center justify-center rounded-md border border-prime-100 bg-secondary-100 text-prime-700 hover:bg-prime-100 transition-colors',
        button_next:
          'absolute right-1 h-7 w-7 inline-flex items-center justify-center rounded-md border border-prime-100 bg-secondary-100 text-prime-700 hover:bg-prime-100 transition-colors',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex border-b border-prime-100 pb-1',
        weekday:
          'text-prime-500 rounded-md w-10 text-[0.8rem] font-medium text-center first:text-red-400 last:text-blue-400',
        weeks: '',
        week: 'flex w-full mt-2',
        day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 first:[&>button]:text-red-400 last:[&>button]:text-blue-400',
        day_button:
          'h-10 w-10 inline-flex items-center justify-center rounded-md text-sm font-normal text-prime-700 hover:bg-prime-100 hover:text-prime-900 aria-selected:hover:bg-transparent transition-colors aria-selected:opacity-100',
        selected: 'bg-cta-300 text-prime-900 hover:bg-cta-300 focus:bg-cta-300 rounded-md',
        today:
          '[&>button]:ring-2 [&>button]:ring-main-blue [&>button]:ring-inset [&>button]:font-bold',
        outside: 'text-prime-300 opacity-30',
        disabled: 'text-prime-300 opacity-50 [&>button]:cursor-not-allowed',
        range_start: 'bg-cta-300 text-white rounded-l-md',
        range_end: 'bg-cta-300 text-white rounded-r-md',
        range_middle: 'bg-cta-300/20 text-prime-700',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...rest }) =>
          orientation === 'left' ? (
            <ChevronLeft className="size-4" {...rest} />
          ) : (
            <ChevronRight className="size-4" {...rest} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
