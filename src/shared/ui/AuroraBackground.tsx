'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function AuroraBackground({ children, className = '' }: AuroraBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseActive, setIsMouseActive] = useState(false);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePosition({ x, y });
    setIsMouseActive(true);

    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    stopTimerRef.current = setTimeout(() => setIsMouseActive(false), 1200);
  }, []);

  return (
    <main
      className={`relative flex h-dvh w-full items-center justify-center overflow-hidden bg-white px-4 py-8 box-border ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* 오로라 1 — 블루 */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isMouseActive ? 1 : 0 }}
        transition={{ duration: isMouseActive ? 2.5 : 6, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ background: 'radial-gradient(circle at 20% 30%, rgba(141, 194, 238, 0.55) 0%, transparent 65%)' }}
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(141, 194, 238, 0.55) 0%, transparent 65%)',
              'radial-gradient(circle at 80% 70%, rgba(141, 194, 238, 0.55) 0%, transparent 65%)',
              'radial-gradient(circle at 20% 30%, rgba(141, 194, 238, 0.55) 0%, transparent 65%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      {/* 오로라 2 — 시안 */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isMouseActive ? 1 : 0 }}
        transition={{ duration: isMouseActive ? 3 : 6, ease: 'easeInOut', delay: isMouseActive ? 0.3 : 0 }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ background: 'radial-gradient(circle at 80% 20%, rgba(103, 232, 249, 0.45) 0%, transparent 65%)' }}
          animate={{
            background: [
              'radial-gradient(circle at 80% 20%, rgba(103, 232, 249, 0.45) 0%, transparent 65%)',
              'radial-gradient(circle at 20% 80%, rgba(103, 232, 249, 0.45) 0%, transparent 65%)',
              'radial-gradient(circle at 80% 20%, rgba(103, 232, 249, 0.45) 0%, transparent 65%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </motion.div>
      {/* 오로라 3 — 퍼플 */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isMouseActive ? 1 : 0 }}
        transition={{ duration: isMouseActive ? 3.5 : 6, ease: 'easeInOut', delay: isMouseActive ? 0.6 : 0 }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ background: 'radial-gradient(circle at 50% 50%, rgba(196, 181, 253, 0.4) 0%, transparent 65%)' }}
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(196, 181, 253, 0.4) 0%, transparent 65%)',
              'radial-gradient(circle at 30% 70%, rgba(196, 181, 253, 0.4) 0%, transparent 65%)',
              'radial-gradient(circle at 70% 30%, rgba(147, 197, 253, 0.4) 0%, transparent 65%)',
              'radial-gradient(circle at 50% 50%, rgba(196, 181, 253, 0.4) 0%, transparent 65%)',
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </motion.div>

      {/* 마우스 반응형 블롭 1 */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isMouseActive ? 0.4 : 0, x: mousePosition.x * 60, y: mousePosition.y * 60 }}
        transition={{ opacity: { duration: isMouseActive ? 2.5 : 6, ease: 'easeInOut' }, x: { type: 'spring', stiffness: 50, damping: 20 }, y: { type: 'spring', stiffness: 50, damping: 20 } }}
      >
        <div className="absolute h-200 w-200 rounded-full bg-linear-to-br from-blue-300/60 to-transparent blur-3xl -top-50 left-[10%]" />
      </motion.div>
      {/* 마우스 반응형 블롭 2 (반대 방향) */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isMouseActive ? 0.35 : 0, x: mousePosition.x * -50, y: mousePosition.y * -50 }}
        transition={{ opacity: { duration: isMouseActive ? 3 : 6, ease: 'easeInOut' }, x: { type: 'spring', stiffness: 40, damping: 25 }, y: { type: 'spring', stiffness: 40, damping: 25 } }}
      >
        <div className="absolute h-250 w-250 rounded-full bg-linear-to-tl from-cyan-200/60 to-transparent blur-3xl -bottom-75 right-[5%]" />
      </motion.div>
      {/* 마우스 반응형 블롭 3 */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isMouseActive ? 0.3 : 0, x: mousePosition.x * 35, y: mousePosition.y * 35 }}
        transition={{ opacity: { duration: isMouseActive ? 3.5 : 6, ease: 'easeInOut' }, x: { type: 'spring', stiffness: 30, damping: 30 }, y: { type: 'spring', stiffness: 30, damping: 30 } }}
      >
        <div className="absolute h-150 w-150 rounded-full bg-linear-to-br from-blue-200/70 to-transparent blur-2xl top-[20%] right-[20%]" />
      </motion.div>

      {children}
    </main>
  );
}
