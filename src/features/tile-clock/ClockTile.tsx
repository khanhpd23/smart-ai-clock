import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { useTileGesture } from '../../hooks/useTileGesture';
import { iosSpringSnappy } from '../../styles/motion';
import { CircleGlassButton, IOSToggle } from '../../components/ui/GlassPrimitives';
import { AlarmClockIcon, MinimizeIcon, SoundwaveIcon } from '../../components/ui/SFIcons';
import { AnalogClock } from './AnalogClock';

const WEEKDAYS_VI = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

function formatDateVi(d: Date): string {
  const weekday = WEEKDAYS_VI[d.getDay()];
  const day = d.getDate();
  const month = d.getMonth() + 1;
  return `${weekday}, ${day} thg ${month}`;
}

interface ClockTileProps {
  mode?: 'compact' | 'expanded';
}

export const ClockTile: React.FC<ClockTileProps> = ({ mode = 'compact' }) => {
  const [now, setNow] = useState(() => new Date());

  const clockMode = useAppStore((s) => s.clockMode);
  const toggleClockMode = useAppStore((s) => s.toggleClockMode);
  const alarmEnabled = useAppStore((s) => s.alarmEnabled);
  const alarmTime = useAppStore((s) => s.alarmTime);
  const toggleAlarm = useAppStore((s) => s.toggleAlarm);
  const whiteNoiseEnabled = useAppStore((s) => s.whiteNoiseEnabled);
  const toggleWhiteNoise = useAppStore((s) => s.toggleWhiteNoise);
  const setExpandedTile = useAppStore((s) => s.setExpandedTile);

  const { pinchScale, bindPinch, handlePointerUp } = useTileGesture({
    tileId: 'clock',
  });

  const isExpanded = mode === 'expanded';

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(id);
  }, []);

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  return (
    <motion.section
      {...(bindPinch() as any)}
      onPointerUp={handlePointerUp}
      animate={{ scale: pinchScale }}
      transition={iosSpringSnappy}
      style={{ touchAction: 'none' }}
      aria-label="Đồng hồ, báo thức và tiếng ồn trắng"
      className={`liquid-glass-card w-full h-full flex flex-col justify-between overflow-hidden ${
        isExpanded ? 'px-[3cqw] py-[5cqh]' : 'px-[2.2cqw] py-[4.8cqh]'
      }`}
    >
      {/* Top Row */}
      <div className="flex items-center justify-between gap-2 z-10 min-h-[5.5cqh]">
        {!isExpanded ? (
          <span className="text-[3.7cqh] font-medium tracking-[-0.01em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] truncate">
            {formatDateVi(now)}
          </span>
        ) : (
          <button
            type="button"
            data-no-expand="true"
            onClick={() => setExpandedTile(null)}
            aria-label="Thu nhỏ đồng hồ"
            className="liquid-circle-btn w-[7.8cqh] h-[7.8cqh] flex items-center justify-center text-white/85 hover:text-white cursor-pointer"
          >
            <MinimizeIcon className="w-[3.4cqh] h-[3.4cqh]" />
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <IOSToggle
            checked={clockMode === 'analog'}
            onChange={toggleClockMode}
            ariaLabel="Chuyển chế độ đồng hồ điện tử và đồng hồ cơ"
          />
        </div>
      </div>

      {/* Center Clock Display — Bold Digits */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <AnimatePresence mode="wait">
          {clockMode === 'digital' ? (
            <motion.div
              key={isExpanded ? 'digital-expanded' : 'digital-compact'}
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
              transition={iosSpringSnappy}
              className="flex items-start justify-center tabular-nums select-none"
            >
              {isExpanded ? (
                <div className="flex items-baseline justify-center text-[27cqh] font-bold tracking-[-0.04em] leading-none text-white drop-shadow-[0_8px_28px_rgba(0,0,0,0.4)]">
                  <span>{hh}</span>
                  <span className="mx-[0.04em] opacity-85">:</span>
                  <span>{mm}</span>
                  <span className="mx-[0.04em] opacity-85">:</span>
                  <span className="text-white/90">{ss}</span>
                </div>
              ) : (
                <div className="flex items-start justify-center">
                  <span className="text-[17.2cqh] font-normal tracking-[-0.045em] leading-[0.88] text-white drop-shadow-[0_6px_22px_rgba(0,0,0,0.35)]">
                    {hh}:{mm}
                  </span>
                  <span className="text-[6.6cqh] font-normal tracking-[-0.02em] leading-none text-white/95 ml-[0.5cqh] -mt-[0.3cqh] drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
                    {ss}
                  </span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={isExpanded ? 'analog-expanded' : 'analog-compact'}
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
              transition={iosSpringSnappy}
              className="w-full h-full flex items-center justify-center"
            >
              <AnalogClock expanded={isExpanded} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Row — Only in compact mode */}
      {!isExpanded && (
        <div className="flex items-center justify-center gap-[4.2cqh] z-10 pb-[0.6cqh]">
          <div className="relative flex flex-col items-center">
            <CircleGlassButton
              size="lg"
              active={alarmEnabled}
              activeVariant="amber"
              onClick={toggleAlarm}
              aria-label={`Báo thức ${alarmEnabled ? 'đang bật' : 'đang tắt'}`}
              title={`Báo thức (${alarmTime})`}
            >
              <AlarmClockIcon className="w-[8.2cqh] h-[8.2cqh]" />
            </CircleGlassButton>
            {alarmEnabled && (
              <span className="absolute -bottom-[3.2cqh] text-[2.4cqh] font-medium text-amber-200/95 tabular-nums drop-shadow">
                {alarmTime}
              </span>
            )}
          </div>

          <div className="relative flex flex-col items-center">
            <CircleGlassButton
              size="lg"
              active={whiteNoiseEnabled}
              activeVariant="indigo"
              onClick={toggleWhiteNoise}
              aria-label={`Tiếng ồn trắng ${whiteNoiseEnabled ? 'đang phát' : 'đã tắt'}`}
              title="Tiếng ồn trắng"
            >
              <SoundwaveIcon className="w-[8.2cqh] h-[8.2cqh]" />
            </CircleGlassButton>
          </div>
        </div>
      )}
    </motion.section>
  );
};
