import { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
  delay?: number;
}

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ripples: Ripple[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (Math.random() < 0.1 && ripples.length < 4) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          r: 0,
          maxR: 320 + Math.random() * 180,
          alpha: 1,
        });
      }
    };

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        if (ripples.length >= 4) break;
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          r: 0,
          maxR: 280 + i * 120,
          alpha: 1,
          delay: i * 18,
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#f4f8fb';
      ctx.fillRect(0, 0, w, h);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];

        if (rip.delay !== undefined && rip.delay > 0) {
          rip.delay--;
          continue;
        }

        const progress = rip.r / rip.maxR;
        const eased = 1 - progress * progress;

        // 외곽 soft glow
        const g1 = ctx.createRadialGradient(rip.x, rip.y, 0, rip.x, rip.y, rip.r);
        g1.addColorStop(0, `rgba(190,220,240,0)`);
        g1.addColorStop(0.55, `rgba(185,218,238,${0.22 * eased})`);
        g1.addColorStop(0.78, `rgba(170,210,235,${0.28 * eased})`);
        g1.addColorStop(0.92, `rgba(155,200,230,${0.18 * eased})`);
        g1.addColorStop(1, `rgba(140,190,225,0)`);
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.fillStyle = g1;
        ctx.fill();

        // 안쪽 밝은 코어
        const innerR = rip.r * 0.38;
        const g2 = ctx.createRadialGradient(rip.x, rip.y, 0, rip.x, rip.y, innerR);
        g2.addColorStop(0, `rgba(230,242,250,${0.3 * eased})`);
        g2.addColorStop(1, `rgba(200,228,242,0)`);
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, innerR, 0, Math.PI * 2);
        ctx.fillStyle = g2;
        ctx.fill();

        rip.r += 0.55;
        if (rip.r >= rip.maxR) ripples.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
