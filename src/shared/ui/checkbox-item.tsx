import { cn } from '@/shared/lib/utils';

// ── Figma 디자인 시스템: Checkbox (node 1306:3235) ──────────────
// 20×20, rounded-sm (4px), border-1 neutral-300 (#e2e8f0)
// States:
//   Checked:  bg cta-300 (#82c9ff), border neutral-300, ✓ inverse (#f8fafc)
//   Default:  bg secondary-100 (#f8fafc), border neutral-300
//   Disabled: bg transparent, border neutral-300, ✓ neutral-400 (#cbd5e1)
//   Error:    bg transparent, border error-700 (#8e0c0c), ✓ neutral-400
// Label: Pretendard 16px Medium, lineHeight: 1
// ─────────────────────────────────────────────────────────────────

interface CheckboxItemProps {
  label: string;
  required?: boolean;
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  onChange?: () => void;
  /** 라벨 텍스트 클릭 시 (약관 상세 열기 등) */
  onLabelClick?: () => void;
  /** (필수)/(선택) 태그 표시 여부 — false면 라벨만 표시 */
  showTag?: boolean;
}

export function CheckboxItem({
  label,
  required = false,
  checked = false,
  disabled = false,
  error = false,
  onChange,
  onLabelClick,
  showTag = true,
}: CheckboxItemProps) {
  let tagColor: string;
  if (error) tagColor = 'text-error-700';
  else if (required) tagColor = 'text-error-500';
  else tagColor = 'text-warning-500';

  // 체크박스 박스 스타일 결정
  const boxClass = cn(
    'flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-colors',
    error
      ? 'border-error-700'
      : 'border-neutral-300',
    checked && !disabled && !error && 'bg-cta-300',
    !checked && !disabled && 'bg-secondary-100',
    disabled && 'bg-transparent cursor-not-allowed',
  );

  // ✓ 아이콘 색상
  const checkColor = disabled || error
    ? 'text-neutral-400'
    : 'text-secondary-100';

  return (
    <div className={cn('flex w-full items-center gap-2', disabled && 'opacity-60')}>
      {/* 체크박스 */}
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className="flex shrink-0"
      >
        <div className={boxClass}>
          {checked && (
            <span className={cn(checkColor, 'text-[12px] leading-none font-semibold')}>✓</span>
          )}
        </div>
      </button>
      {/* 라벨 텍스트 */}
      <button
        type="button"
        onClick={onLabelClick ?? onChange}
        disabled={disabled}
        className="min-w-0 flex-1 text-left"
      >
        <p
          className={cn(
            'text-base leading-6 font-medium',
            error ? 'text-error-700' : disabled ? 'text-neutral-400' : 'text-prime-800'
          )}
        >
          <span>{label}</span>
          {showTag && (
            <span className={cn('ml-1 font-medium', tagColor)}>
              {required ? '*' : '(선택)'}
            </span>
          )}
        </p>
      </button>
      {/* 보기 버튼 */}
      {onLabelClick && !disabled && (
        <button
          type="button"
          onClick={onLabelClick}
          className="shrink-0 rounded-full border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-prime-600"
        >
          보기
        </button>
      )}
    </div>
  );
}
