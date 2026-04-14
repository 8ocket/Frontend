// Figma 1508:2541 — Send buttons > Type=Send, Vector (1508:2510), 36×28

type IconProps = {
  readonly size?: number;
  readonly className?: string;
};

export function SendIcon({ size = 36, className }: IconProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 28 / 36)}
      viewBox="0 0 36 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2.769 28C1.99467 28 1.33967 27.732 0.804 27.196C0.268 26.6603 0 26.0053 0 25.231V2.769C0 1.99467 0.268 1.33967 0.804 0.804001C1.33967 0.268001 1.99467 0 2.769 0H33.231C34.0053 0 34.6603 0.268001 35.196 0.804001C35.732 1.33967 36 1.99467 36 2.769V25.231C36 26.0053 35.732 26.6603 35.196 27.196C34.6603 27.732 34.0053 28 33.231 28H2.769ZM18 13.7075L34.4615 2.7115L33.846 1.5385L18 11.9385L2.154 1.5385L1.5385 2.7115L18 13.7075Z"
        fill="currentColor"
      />
    </svg>
  );
}
