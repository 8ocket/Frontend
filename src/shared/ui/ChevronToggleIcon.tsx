interface ChevronToggleIconProps {
  open?: boolean;
  className?: string;
  size?: number;
}

export function ChevronToggleIcon({
  open = false,
  className = '',
  size = 13,
}: ChevronToggleIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 13 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
      aria-hidden="true"
    >
      <path d="M6.49856 6.49216L0 0H12.9971L6.49856 6.49216Z" fill="currentColor" />
    </svg>
  );
}
