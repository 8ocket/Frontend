import { useEffect, useRef, useState, useCallback, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ColorPalette {
  light: RGB;
  dark: RGB;
  arc: RGB;
}

interface Arc {
  r: number;
  opacity: number;
  width: number;
  cx: number;
  cy: number;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  alpha: number;
  speed: number;
}

interface MousePosition {
  x: number;
  y: number;
}

interface WaveBackgroundProps {
  initialDark?: boolean;
  children?: ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR: ColorPalette = {
  light: { r: 75, g: 161, b: 240 }, // #4BA1F0
  dark: { r: 59, g: 82, b: 111 }, // #3B526F — prime-700, dark mode mouse effect
  arc: { r: 130, g: 201, b: 255 }, // CTA 컬러 (라이트)
};

const ARC_DARK: RGB = { r: 44, g: 62, b: 88 }; // #2C3E58 — dark mode arc color

// ─── Component ────────────────────────────────────────────────────────────────

const DARK_MODE_KEY = 'theme-dark';

export default function WaveBackground({ initialDark = false, children }: WaveBackgroundProps) {
  const [isDark, setIsDark] = useState<boolean>(initialDark);

  // useEffect(() => {
  //   const stored = localStorage.getItem(DARK_MODE_KEY);
  //   if (stored !== null) setIsDark(stored === 'true');
  // }, []);

  // const toggleDark = () => {
  //   setIsDark((v) => {
  //     const next = !v;
  //     localStorage.setItem(DARK_MODE_KEY, String(next));
  //     return next;
  //   });
  // };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<MousePosition>({ x: -500, y: -500 });
  const ripplesRef = useRef<Ripple[]>([]);
  const isDarkRef = useRef<boolean>(isDark);
  const animFrameRef = useRef<number | null>(null);

  // isDark state가 바뀌면 ref도 동기화
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  const getMouseColor = useCallback((): RGB => (isDarkRef.current ? COLOR.dark : COLOR.light), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W: number = 0;
    let H: number = 0;

    const resize = (): void => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent): void => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (Math.random() < 0.12) {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          r: 0,
          alpha: isDarkRef.current ? 0.28 : 0.45,
          speed: 1.2 + Math.random() * 1.2,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const getArcs = (): Arc[] => {
      const base = Math.max(W, H);
      const cx = W + W * 0.05;
      const cy = H + H * 0.05;
      return [
        { r: base * 0.18, opacity: 0.55, width: 0.8 },
        { r: base * 0.3, opacity: 0.5, width: 0.85 },
        { r: base * 0.42, opacity: 0.42, width: 0.9 },
        { r: base * 0.54, opacity: 0.35, width: 0.95 },
        { r: base * 0.66, opacity: 0.27, width: 1.0 },
        { r: base * 0.78, opacity: 0.2, width: 1.05 },
        { r: base * 0.9, opacity: 0.14, width: 1.1 },
        { r: base * 1.02, opacity: 0.09, width: 1.15 },
      ].map((a) => ({ ...a, cx, cy }));
    };

    const getGlow = (arc: Arc): number => {
      const { x, y } = mouseRef.current;
      const dist = Math.sqrt((x - arc.cx) ** 2 + (y - arc.cy) ** 2);
      const diff = Math.abs(dist - arc.r);
      return diff < 70 ? (1 - diff / 70) * 0.7 : 0;
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, W, H);
      const arcs = getArcs();
      const mc = getMouseColor();
      const ac = isDarkRef.current ? ARC_DARK : COLOR.arc;
      const { x: mx, y: my } = mouseRef.current;

      // 1. 브러시 번짐
      const brushAlpha = isDarkRef.current ? 0.07 : 0.13;
      const g = ctx.createRadialGradient(mx, my, 0, mx, my, 110);
      g.addColorStop(0, `rgba(${mc.r},${mc.g},${mc.b},${brushAlpha})`);
      g.addColorStop(0.4, `rgba(${mc.r},${mc.g},${mc.b},${brushAlpha * 0.5})`);
      g.addColorStop(1, `rgba(${mc.r},${mc.g},${mc.b},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // 2. 호선
      const arcMult = isDarkRef.current ? 0.7 : 1.4;
      arcs.forEach((arc) => {
        const glow = getGlow(arc);
        const alpha = Math.min((arc.opacity + glow * 0.4) * arcMult, 0.9);

        ctx.beginPath();
        ctx.arc(arc.cx, arc.cy, arc.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ac.r},${ac.g},${ac.b},${alpha})`;
        ctx.lineWidth = arc.width + glow * 1.5;
        ctx.stroke();

        if (glow > 0.08) {
          ctx.save();
          ctx.filter = 'blur(6px)';
          ctx.beginPath();
          ctx.arc(arc.cx, arc.cy, arc.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${mc.r},${mc.g},${mc.b},${glow * 0.25})`;
          ctx.lineWidth = (arc.width + glow * 1.5) * 8;
          ctx.stroke();
          ctx.restore();
        }
      });

      // 3. 파동
      ripplesRef.current = ripplesRef.current.filter((rp) => rp.alpha > 0.008);
      ripplesRef.current.forEach((rp) => {
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${mc.r},${mc.g},${mc.b},${rp.alpha})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
        rp.r += rp.speed;
        rp.alpha *= 0.91;
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
  }, [getMouseColor]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: isDark ? '#1a222e' : '#f8fafc',
        transition: 'background 0.4s',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }}
      />

      {/* 다크모드 토글 버튼 — Figma: top 40px, right 40px, h 44px, radius 8px */}
      {/* <button
        onClick={toggleDark}
        style={{
          position: 'fixed',
          top: 40,
          right: 40,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 44,
          padding: '8px 16px',
          borderRadius: 8,
          background: isDark ? '#f8fafc' : '#1a222e',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.4s',
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.24px',
            color: isDark ? '#1a222e' : '#f8fafc',
            transition: 'color 0.4s',
          }}
        >
          {isDark ? '라이트 모드 선택' : '다크 모드 선택'}
        </span>
      </button> */}

      {/* children은 캔버스 위에 렌더링 */}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
