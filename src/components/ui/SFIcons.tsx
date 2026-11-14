import React, { useId } from 'react';

interface IconProps {
  className?: string;
}

export const AlarmClockIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    {/* Left & right twin bells */}
    <path
      d="M4.2 6.8a3.2 3.2 0 0 1 4.2-4.2L4.2 6.8Zm15.6 0L15.6 2.6a3.2 3.2 0 0 1 4.2 4.2Z"
      fill="currentColor"
    />
    {/* Clock body + hands cutout + legs */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 4.6a7.9 7.9 0 1 0 0 15.8 7.9 7.9 0 0 0 0-15.8Zm.85 3.75a.85.85 0 0 0-1.7 0v4.15c0 .3.16.58.42.73l2.75 1.65a.85.85 0 1 0 .86-1.46l-2.33-1.4V8.35Z"
      fill="currentColor"
    />
    <path
      d="M6.4 18.8 4.8 20.9a.9.9 0 1 0 1.44 1.08l1.6-2.12M17.6 18.8l1.6 2.1a.9.9 0 1 1-1.44 1.08l-1.6-2.12"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);

export const SoundwaveIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="2.2" y="9.5" width="2" height="5" rx="1" fill="currentColor" />
    <rect x="5.4" y="6.8" width="2" height="10.4" rx="1" fill="currentColor" />
    <rect x="8.6" y="4.2" width="2" height="15.6" rx="1" fill="currentColor" />
    <rect x="11.8" y="2.6" width="2" height="18.8" rx="1" fill="currentColor" />
    <rect x="15" y="5.6" width="2" height="12.8" rx="1" fill="currentColor" />
    <rect x="18.2" y="7.6" width="2" height="8.8" rx="1" fill="currentColor" />
    <rect x="21.4" y="10" width="1.6" height="4" rx="0.8" fill="currentColor" />
  </svg>
);

export const MicIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="9" y="2.5" width="6" height="11" rx="3" fill="currentColor" />
    <path
      d="M5.75 11.2a6.25 6.25 0 0 0 12.5 0M12 17.5v3.5M8.75 21h6.5"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M7.6 10V7.7a4.4 4.4 0 1 1 8.8 0V10"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.4 9.6h11.2A2.4 2.4 0 0 1 20 12v7.1a2.4 2.4 0 0 1-2.4 2.4H6.4A2.4 2.4 0 0 1 4 19.1V12a2.4 2.4 0 0 1 2.4-2.4Zm6.55 4.7a1.35 1.35 0 1 0-1.9 0v2.45a.95.95 0 0 0 1.9 0V14.3Z"
      fill="currentColor"
    />
  </svg>
);

export const HeartPulseIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => {
  const maskId = useId();
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          <path
            d="M3.2 12.4h4.1l1.7-3.4 2.4 6.2 2-4 1.3 1.2h6.1"
            stroke="black"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <path
        mask={`url(#${maskId})`}
        d="M12 20.6s-8.2-4.9-8.2-11.2A4.65 4.65 0 0 1 12 6.3a4.65 4.65 0 0 1 8.2 3.1c0 6.3-8.2 11.2-8.2 11.2Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const FocusCameraIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3.2a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8Zm0 3.3a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z"
      fill="currentColor"
    />
    <circle cx="12" cy="9.6" r="1.45" fill="currentColor" />
    <path
      d="M12 16v3.1M8.2 20.6h7.6"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
  </svg>
);

export const SettingsGearIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.45 2.6h3.1l.45 2.04a7.3 7.3 0 0 1 1.67.7l1.78-1.1 2.2 2.2-1.1 1.78c.28.53.52 1.09.7 1.67l2.05.45v3.1l-2.05.45a7.3 7.3 0 0 1-.7 1.67l1.1 1.78-2.2 2.2-1.78-1.1a7.3 7.3 0 0 1-1.67.7l-.45 2.05h-3.1l-.45-2.05a7.3 7.3 0 0 1-1.67-.7l-1.78 1.1-2.2-2.2 1.1-1.78a7.3 7.3 0 0 1-.7-1.67l-2.05-.45v-3.1l2.05-.45c.18-.58.42-1.14.7-1.67l-1.1-1.78 2.2-2.2 1.78 1.1c.53-.28 1.09-.52 1.67-.7L10.45 2.6ZM12 8.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Z"
      fill="currentColor"
    />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M7.5 5.25a1.25 1.25 0 0 1 1.9-.1l10.2 6.75a1.25 1.25 0 0 1 0 2.1l-10.2 6.75a1.25 1.25 0 0 1-1.9-1.05V5.25Z" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <rect x="6.5" y="4.5" width="4" height="15" rx="1.5" />
    <rect x="13.5" y="4.5" width="4" height="15" rx="1.5" />
  </svg>
);

export const RotateCcwIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M4.5 9.5A7.8 7.8 0 1 1 6.3 17.2M4.5 4.8v4.7h4.7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="m5 12.5 4.5 4.5L19 7.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7M6.8 6.5l.8 12.2a1.8 1.8 0 0 0 1.8 1.7h5.2a1.8 1.8 0 0 0 1.8-1.7l.8-12.2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="m6.5 6.5 11 11m0-11-11 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 19V5m0 0-5.5 5.5M12 5l5.5 5.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.5c.45 3.65 2.15 5.35 5.8 5.8-3.65.45-5.35 2.15-5.8 5.8-.45-3.65-2.15-5.35-5.8-5.8 3.65-.45 5.35-2.15 5.8-5.8ZM18.5 14c.25 2.05 1.2 3 3.25 3.25-2.05.25-3 1.2-3.25 3.25-.25-2.05-1.2-3-3.25-3.25 2.05-.25 3-1.2 3.25-3.25ZM6 14.5c.22 1.75 1.03 2.56 2.78 2.78-1.75.22-2.56 1.03-2.78 2.78-.22-1.75-1.03-2.56-2.78-2.78 1.75-.22 2.56-1.03 2.78-2.78Z" />
  </svg>
);

export const PhoneLandscapeIcon: React.FC<IconProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect
      x="3"
      y="6.5"
      width="18"
      height="11"
      rx="2.6"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path
      d="M6.5 10.5v3"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path
      d="M17.5 3.5a4 4 0 0 1 3 3m-1.4-3.7 1.4.7-.7 1.4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MinimizeIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ClockFaceIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 7v5l3.5 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GlassLayersIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="m12 3.5 8.5 4.7L12 12.9 3.5 8.2 12 3.5Z"
      fill="currentColor"
      fillOpacity="0.9"
    />
    <path
      d="m3.5 12 8.5 4.7 8.5-4.7M3.5 15.8l8.5 4.7 8.5-4.7"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="m6 14.5 6-6 6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="m6 9.5 6 6 6-6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
