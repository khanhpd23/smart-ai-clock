import React, { useId, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface RotaryDialProps {
  expanded?: boolean;
  children?: React.ReactNode;
}

export function formatHMS(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const RotaryDial: React.FC<RotaryDialProps> = ({ expanded = false, children }) => {
  const timerRemainingSec = useAppStore((s) => s.timerRemainingSec);
  const setTimerByDeltaSeconds = useAppStore((s) => s.setTimerByDeltaSeconds);

  const gradId = useId();
  const trackGradId = useId();
  const ringGlowId = useId();
  const knobGlowId = useId();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingRef = useRef(false);
  const prevAngleRef = useRef(0);
  const accumSecRef = useRef(0);

  const getAngleFromPointer = (clientX: number, clientY: number): number => {
    const el = svgRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Shift so 12 o'clock is 0 rad and clockwise is positive
    return Math.atan2(clientX - cx, -(clientY - cy));
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    accumSecRef.current = 0;
    prevAngleRef.current = getAngleFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current) return;
    e.stopPropagation();

    const angle = getAngleFromPointer(e.clientX, e.clientY);
    const deltaAngle = Math.atan2(
      Math.sin(angle - prevAngleRef.current),
      Math.cos(angle - prevAngleRef.current)
    );
    prevAngleRef.current = angle;

    // 1 full clockwise turn (2π) = +1 hour (3600s); counter-clockwise = -1 hour
    accumSecRef.current += (deltaAngle / (Math.PI * 2)) * 3600;

    // Step cleanly in 1-minute (60s) detents
    if (Math.abs(accumSecRef.current) >= 60) {
      const steps = Math.trunc(accumSecRef.current / 60);
      accumSecRef.current -= steps * 60;
      setTimerByDeltaSeconds(steps * 60);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current) return;
    e.stopPropagation();
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Apple Watch thick capsule ring geometry
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const modHour = timerRemainingSec % 3600;
  const hourFraction =
    timerRemainingSec === 0 ? 0 : modHour === 0 ? 1 : modHour / 3600;

  const dashOffset = circumference * (1 - hourFraction);
  const knobAngleRad = hourFraction * Math.PI * 2;
  const knobX = 100 + radius * Math.sin(knobAngleRad);
  const knobY = 100 - radius * Math.cos(knobAngleRad);

  const wholeHours = Math.floor(timerRemainingSec / 3600);

  return (
    <div
      className={`relative flex items-center justify-center ${
        expanded ? 'w-[56cqh] h-[56cqh]' : 'w-[53cqh] h-[53cqh]'
      }`}
    >
      <svg
        ref={svgRef}
        data-no-expand="true"
        viewBox="0 0 200 200"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
        aria-label="Vòng xoay đặt giờ đếm ngược"
      >
        <defs>
          {/* Apple Watch Activity / Timer vibrant sweep gradient */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="28%" stopColor="#0A84FF" />
            <stop offset="56%" stopColor="#5E5CE6" />
            <stop offset="82%" stopColor="#FF2D55" />
            <stop offset="100%" stopColor="#FF9F0A" />
          </linearGradient>

          <linearGradient id={trackGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 245, 212, 0.14)" />
            <stop offset="50%" stopColor="rgba(10, 132, 255, 0.14)" />
            <stop offset="100%" stopColor="rgba(255, 45, 85, 0.14)" />
          </linearGradient>

          <filter id={ringGlowId} x="-35%" y="-35%" width="170%" height="170%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="#38bdf8" floodOpacity="0.45" />
          </filter>

          <filter id={knobGlowId} x="-70%" y="-70%" width="240%" height="240%">
            <feDropShadow dx="0" dy="1" stdDeviation="2.8" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Glass dial backdrop & Apple Watch tinted ring track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="rgba(8, 14, 30, 0.22)"
          stroke={`url(#${trackGradId})`}
          strokeWidth="11.5"
        />

        {/* Completed full-hour ghost layer for multi-turn Apple Watch overlap */}
        {wholeHours >= 1 && (
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="11.5"
            opacity="0.32"
          />
        )}

        {/* Active Apple Watch Gradient Ring */}
        {timerRemainingSec > 0 && (
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="11.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 100 100)"
            filter={`url(#${ringGlowId})`}
          />
        )}

        {/* Invisible wide hit ring for effortless touch dragging */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="transparent"
          strokeWidth="30"
        />

        {/* Rotary Knob seated smoothly inside the thick Watch ring */}
        <g filter={`url(#${knobGlowId})`}>
          <circle
            cx={knobX}
            cy={knobY}
            r="8.2"
            fill="#ffffff"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.2"
          />
          <circle cx={knobX} cy={knobY} r="2.8" fill="rgba(10, 132, 255, 0.55)" />
        </g>
      </svg>

      {/* Center Bold Digital Time Readout — Strictly centered regardless of hours */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          className={`tabular-nums font-bold tracking-[-0.02em] leading-none text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)] ${
            expanded ? 'text-[7.8cqh]' : 'text-[6.8cqh]'
          }`}
        >
          {formatHMS(timerRemainingSec)}
        </span>
      </div>

      {/* Optional slot (e.g. compact mic button at bottom-right of dial) */}
      {children}
    </div>
  );
};
