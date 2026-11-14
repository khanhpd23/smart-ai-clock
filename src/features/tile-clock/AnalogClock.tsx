import React, { useEffect, useId, useState } from 'react';

interface AnalogClockProps {
  expanded?: boolean;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ expanded = false }) => {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const dialBgId = useId();

  useEffect(() => {
    let rafId = 0;
    const loop = () => {
      setNowMs(Date.now());
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const date = new Date(nowMs);
  const ms = date.getMilliseconds();
  const sec = date.getSeconds() + ms / 1000;
  const min = date.getMinutes() + sec / 60;
  const hour = (date.getHours() % 12) + min / 60;

  const secDeg = sec * 6;
  const minDeg = min * 6;
  const hourDeg = hour * 30;

  const ticks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div
      className={`relative flex items-center justify-center ${
        expanded ? 'h-[78cqh] w-[78cqh]' : 'w-[48cqh] h-[48cqh]'
      }`}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
        <defs>
          <radialGradient id={dialBgId} cx="35%" cy="28%" r="72%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
            <stop offset="65%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(10,14,28,0.35)" />
          </radialGradient>
        </defs>

        {/* Glass dial face */}
        <circle
          cx="100"
          cy="100"
          r="94"
          fill={`url(#${dialBgId})`}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.2"
        />
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        {/* 60 Ticks */}
        {ticks.map((i) => {
          const isMajor = i % 5 === 0;
          const angle = i * 6;
          return (
            <line
              key={i}
              x1="100"
              y1={isMajor ? '11' : '13'}
              x2="100"
              y2={isMajor ? '21' : '17.5'}
              stroke={isMajor ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.28)'}
              strokeWidth={isMajor ? '2.2' : '1'}
              strokeLinecap="round"
              transform={`rotate(${angle} 100 100)`}
            />
          );
        })}

        {/* Hour hand */}
        <g transform={`rotate(${hourDeg} 100 100)`}>
          <line
            x1="100"
            y1="106"
            x2="100"
            y2="54"
            stroke="#ffffff"
            strokeWidth="5.2"
            strokeLinecap="round"
          />
        </g>

        {/* Minute hand */}
        <g transform={`rotate(${minDeg} 100 100)`}>
          <line
            x1="100"
            y1="108"
            x2="100"
            y2="30"
            stroke="#ffffff"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </g>

        {/* Sweeping second hand (iOS StandBy accent) */}
        <g transform={`rotate(${secDeg} 100 100)`}>
          <line
            x1="100"
            y1="118"
            x2="100"
            y2="24"
            stroke="#38bdf8"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="4.4" fill="#38bdf8" />
          <circle cx="100" cy="100" r="2" fill="#0b1020" />
        </g>
      </svg>
    </div>
  );
};
