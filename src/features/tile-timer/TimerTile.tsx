import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { useTileGesture } from '../../hooks/useTileGesture';
import { iosSpringSnappy } from '../../styles/motion';
import { CircleGlassButton } from '../../components/ui/GlassPrimitives';
import { MicIcon, MinimizeIcon, RotateCcwIcon } from '../../components/ui/SFIcons';
import { RotaryDial } from './RotaryDial';
import { RecordingHistoryList } from './RecordingHistoryList';

interface TimerTileProps {
  mode?: 'compact' | 'expanded';
}

export const TimerTile: React.FC<TimerTileProps> = ({ mode = 'compact' }) => {
  const timerRunning = useAppStore((s) => s.timerRunning);
  const toggleTimerRunning = useAppStore((s) => s.toggleTimerRunning);
  const resetTimer = useAppStore((s) => s.resetTimer);
  const tickTimer = useAppStore((s) => s.tickTimer);

  const isRecording = useAppStore((s) => s.isRecording);
  const recordingSeconds = useAppStore((s) => s.recordingSeconds);
  const toggleRecording = useAppStore((s) => s.toggleRecording);
  const tickRecording = useAppStore((s) => s.tickRecording);

  const setExpandedTile = useAppStore((s) => s.setExpandedTile);

  const { pinchScale, bindPinch, handlePointerUp } = useTileGesture({
    tileId: 'timer',
  });

  const isExpanded = mode === 'expanded';

  useEffect(() => {
    // Only run timer interval once from the compact instance so ticking doesn't double-count
    if (isExpanded || !timerRunning) return;
    const id = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(id);
  }, [isExpanded, timerRunning, tickTimer]);

  useEffect(() => {
    if (isExpanded || !isRecording) return;
    const id = setInterval(() => tickRecording(), 1000);
    return () => clearInterval(id);
  }, [isExpanded, isRecording, tickRecording]);

  return (
    <motion.section
      {...(bindPinch() as any)}
      onPointerUp={handlePointerUp}
      animate={{ scale: pinchScale }}
      transition={iosSpringSnappy}
      style={{ touchAction: 'none' }}
      aria-label="Đồng hồ đếm ngược và thu âm"
      className={`liquid-glass-card w-full h-full flex flex-col justify-between overflow-hidden ${
        isExpanded ? 'px-[2.6cqw] py-[4.6cqh]' : 'px-[2.2cqw] py-[4.8cqh]'
      }`}
    >
      {isExpanded ? (
        /* EXPANDED 3-PART LAYOUT: Left History | Center Countdown | Right Mic (centered & unclipped) */
        <div className="relative w-full h-full flex items-center justify-between gap-[2.2cqw]">
          {/* Collapse button */}
          <button
            type="button"
            data-no-expand="true"
            onClick={() => setExpandedTile(null)}
            aria-label="Thu nhỏ đồng hồ đếm ngược"
            className="liquid-circle-btn absolute top-0 right-0 z-20 w-[7.8cqh] h-[7.8cqh] flex items-center justify-center text-white/85 hover:text-white cursor-pointer"
          >
            <MinimizeIcon className="w-[3.4cqh] h-[3.4cqh]" />
          </button>

          {/* Left: Recording History List */}
          <div className="w-[34%] h-full min-h-0">
            <RecordingHistoryList />
          </div>

          {/* Center: Large Apple Watch Rotary Countdown + Start Button */}
          <div className="flex-1 h-full flex flex-col items-center justify-center gap-[2.8cqh]">
            <RotaryDial expanded />

            <div className="flex items-center gap-[1.8cqh]">
              <motion.button
                type="button"
                data-no-expand="true"
                whileTap={{ scale: 0.94 }}
                transition={iosSpringSnappy}
                onClick={toggleTimerRunning}
                className={`liquid-pill-btn px-[7cqh] h-[11.2cqh] text-[3.7cqh] font-semibold tracking-[0.05em] uppercase cursor-pointer ${
                  timerRunning ? 'liquid-btn-active-indigo text-white' : 'text-white'
                }`}
              >
                {timerRunning ? 'TẠM DỪNG' : 'BẮT ĐẦU'}
              </motion.button>

              <CircleGlassButton
                size="sm"
                onClick={resetTimer}
                aria-label="Đặt lại đếm ngược"
                title="Đặt lại"
              >
                <RotateCcwIcon className="w-[3.6cqh] h-[3.6cqh]" />
              </CircleGlassButton>
            </div>
          </div>

          {/* Right: Centered Voice Recorder Button (clear of bottom & right AI orb) */}
          <div className="w-[22%] h-full flex flex-col items-center justify-center pr-[4.2cqw]">
            <div className="relative flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                {isRecording && (
                  <motion.span
                    animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0, 0.55] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full bg-rose-500/40 pointer-events-none"
                  />
                )}
                <CircleGlassButton
                  size="xl"
                  active={isRecording}
                  activeVariant="rose"
                  onClick={toggleRecording}
                  aria-label={isRecording ? 'Dừng thu âm' : 'Bắt đầu thu âm'}
                >
                  <MicIcon className="w-[8.8cqh] h-[8.8cqh]" />
                </CircleGlassButton>
              </div>
              <span className="mt-[2.2cqh] text-[3.1cqh] font-medium text-white/90 whitespace-nowrap">
                {isRecording
                  ? `Đang thu 00:${String(recordingSeconds).padStart(2, '0')}`
                  : 'Thu âm'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* COMPACT MODE: Rotary Dial + Bottom-Right Mic + Bottom Start Pill */
        <div className="w-full h-full flex flex-col items-center justify-between">
          <div className="flex-1 flex items-center justify-center min-h-0">
            <RotaryDial>
              {/* Mic button placed cleanly at bottom-right edge of the circular dial */}
              <div className="absolute -bottom-[1cqh] -right-[1.5cqh] z-10">
                {isRecording && (
                  <motion.span
                    animate={{ scale: [1, 1.38, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full bg-rose-500/45 pointer-events-none"
                  />
                )}
                <CircleGlassButton
                  size="md"
                  active={isRecording}
                  activeVariant="rose"
                  onClick={toggleRecording}
                  aria-label={isRecording ? 'Dừng thu âm' : 'Thu âm nhanh'}
                  title={isRecording ? `Đang ghi (${recordingSeconds}s)` : 'Thu âm nhanh'}
                >
                  <MicIcon className="w-[5.8cqh] h-[5.8cqh]" />
                </CircleGlassButton>
              </div>
            </RotaryDial>
          </div>

          <div className="w-full flex items-center justify-center pt-[1cqh]">
            <motion.button
              type="button"
              data-no-expand="true"
              whileTap={{ scale: 0.94 }}
              transition={iosSpringSnappy}
              onClick={toggleTimerRunning}
              className={`liquid-pill-btn w-[92%] h-[12.6cqh] text-[4.1cqh] font-semibold tracking-[0.04em] uppercase cursor-pointer ${
                timerRunning ? 'liquid-btn-active-indigo text-white' : 'text-white'
              }`}
            >
              {timerRunning ? 'TẠM DỪNG' : 'BẮT ĐẦU'}
            </motion.button>
          </div>
        </div>
      )}
    </motion.section>
  );
};
