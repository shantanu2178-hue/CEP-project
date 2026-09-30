import { useEffect, useRef, useState } from 'react';

const LOGO_PATH = 'M18 8L9 26H13.5L15.5 22H20.5L22.5 26H27L18 8Z';
const CUTOUT_PATH = 'M18 13 16.5 19 19.5 19';

export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState('draw');
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef(null);
  const pathRef = useRef(null);
  const cutoutRef = useRef(null);
  const dotRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches) {
      setPhase('hold');
      const timer = setTimeout(() => {
        setPhase('exit');
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 600);
      }, 400);
      return () => clearTimeout(timer);
    }

    const path = pathRef.current;
    const cutout = cutoutRef.current;
    const dot = dotRef.current;
    const glow = glowRef.current;

    if (!path || !cutout || !dot || !glow) return;

    const pathLength = path.getTotalLength();
    const cutoutLength = cutout.getTotalLength();

    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;
    cutout.style.strokeDasharray = `${cutoutLength}`;
    cutout.style.strokeDashoffset = `${cutoutLength}`;
    dot.style.opacity = '0';
    glow.style.opacity = '0';

    const tl = { start: null };

    const animate = (timestamp) => {
      if (!tl.start) tl.start = timestamp;
      const elapsed = timestamp - tl.start;

      const drawStart = 200;
      const drawDuration = 1800;
      const drawProgress = Math.min(Math.max((elapsed - drawStart) / drawDuration, 0), 1);
      const easedDraw = 1 - Math.pow(1 - drawProgress, 3);

      path.style.strokeDashoffset = `${pathLength * (1 - easedDraw)}`;

      const glowProgress = Math.min(Math.max((elapsed - drawStart) / drawDuration, 0), 1);
      glow.style.opacity = `${glowProgress * 0.3}`;

      const cutoutStart = drawStart + drawDuration * 0.6;
      const cutoutDuration = 600;
      const cutoutProgress = Math.min(Math.max((elapsed - cutoutStart) / cutoutDuration, 0), 1);
      const easedCutout = 1 - Math.pow(1 - cutoutProgress, 3);
      cutout.style.strokeDashoffset = `${cutoutLength * (1 - easedCutout)}`;

      const dotStart = cutoutStart + cutoutDuration * 0.5;
      const dotDuration = 400;
      const dotProgress = Math.min(Math.max((elapsed - dotStart) / dotDuration, 0), 1);
      const easedDot = 1 - Math.pow(1 - dotProgress, 2);
      dot.style.opacity = `${easedDot}`;

      if (elapsed < 3200) {
        requestAnimationFrame(animate);
      } else {
        setPhase('hold');
        setTimeout(() => {
          setPhase('exit');
          setTimeout(() => {
            setVisible(false);
            onComplete?.();
          }, 800);
        }, 400);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  if (!visible) return null;

  const isExiting = phase === 'exit';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{
        opacity: isExiting ? 0 : 1,
        transition: isExiting ? 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
        pointerEvents: isExiting ? 'none' : 'all',
      }}
      aria-hidden="true"
    >
      <div
        className="relative"
        style={{
          width: 'clamp(70px, 12vw, 140px)',
          height: 'clamp(70px, 12vw, 140px)',
          transform: isExiting ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          ref={glowRef}
          className="absolute inset-0"
          style={{
            filter: 'blur(20px)',
            opacity: 0,
          }}
        >
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path d={LOGO_PATH} fill="white" />
          </svg>
        </div>

        <svg
          viewBox="0 0 36 36"
          className="w-full h-full relative"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))' }}
        >
          <path
            ref={pathRef}
            d={LOGO_PATH}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={cutoutRef}
            d={CUTOUT_PATH}
            fill="none"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            ref={dotRef}
            cx="18"
            cy="8"
            r="2"
            fill="#C1432B"
            style={{ opacity: 0 }}
          />
        </svg>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: phase === 'hold' ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path d={LOGO_PATH} fill="white" />
            <polygon points="18,13 16.5,19 19.5,19" fill="black" />
            <circle cx="18" cy="8" r="2" fill="#C1432B" />
          </svg>
        </div>
      </div>
    </div>
  );
}
