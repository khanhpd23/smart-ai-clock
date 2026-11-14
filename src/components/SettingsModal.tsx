import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAppStore, type GlassOpacityLevel } from '../store/useAppStore';
import { iosSpringModal, iosSpringSnappy } from '../styles/motion';
import {
  AlarmClockIcon,
  ClockFaceIcon,
  FocusCameraIcon,
  GlassLayersIcon,
  HeartPulseIcon,
  SoundwaveIcon,
  SparklesIcon,
} from './ui/SFIcons';

interface AppleSwitchProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
}

const AppleSwitch: React.FC<AppleSwitchProps> = ({ checked, onChange, ariaLabel }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    onClick={onChange}
    className={`relative inline-flex items-center w-[8.8cqh] h-[5.1cqh] rounded-full p-[0.45cqh] cursor-pointer transition-colors duration-200 focus:outline-none ${
      checked
        ? 'bg-[#30D158] shadow-[inset_0_1px_2px_rgba(0,0,0,0.18)]'
        : 'bg-white/22 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]'
    }`}
  >
    <motion.span
      layout
      transition={iosSpringSnappy}
      className="w-[4.2cqh] h-[4.2cqh] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
      style={{
        marginLeft: checked ? 'auto' : '0px',
        marginRight: checked ? '0px' : 'auto',
      }}
    />
  </button>
);

const OPACITY_OPTIONS: Array<{ id: GlassOpacityLevel; label: string }> = [
  { id: 'clear', label: 'Trong suốt' },
  { id: 'balanced', label: 'Cân bằng' },
  { id: 'tinted', label: 'Đậm' },
];

export const SettingsModal: React.FC = () => {
  const activeModal = useAppStore((s) => s.activeModal);
  const setActiveModal = useAppStore((s) => s.setActiveModal);

  const clockMode = useAppStore((s) => s.clockMode);
  const toggleClockMode = useAppStore((s) => s.toggleClockMode);
  const alarmTime = useAppStore((s) => s.alarmTime);
  const setAlarmTime = useAppStore((s) => s.setAlarmTime);
  const auroraIntensity = useAppStore((s) => s.auroraIntensity);
  const setAuroraIntensity = useAppStore((s) => s.setAuroraIntensity);
  const glassOpacity = useAppStore((s) => s.glassOpacity);
  const setGlassOpacity = useAppStore((s) => s.setGlassOpacity);
  const whiteNoisePreset = useAppStore((s) => s.whiteNoisePreset);
  const cycleWhiteNoisePreset = useAppStore((s) => s.cycleWhiteNoisePreset);

  const simulateFocusWarning = useAppStore((s) => s.simulateFocusWarning);
  const simulateWellnessReminder = useAppStore((s) => s.simulateWellnessReminder);

  return (
    <AnimatePresence>
      {activeModal === 'settings' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[6px] flex items-center justify-center p-[3.2cqh]"
          onClick={() => setActiveModal(null)}
        >
          <motion.div
            data-no-expand="true"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={iosSpringModal}
            onClick={(e) => e.stopPropagation()}
            className="liquid-glass-modal w-[78cqw] h-[88cqh] rounded-[5.4cqh] flex flex-col overflow-hidden"
          >
            {/* iOS 27 Sheet Grabber & Navigation Header */}
            <div className="pt-[1.4cqh] pb-[2.2cqh] px-[2.8cqw] border-b border-white/12 flex flex-col items-center shrink-0 relative">
              <div className="w-[8cqh] h-[0.8cqh] rounded-full bg-white/28 mb-[1.4cqh]" />
              <div className="w-full flex items-center justify-between">
                <div className="w-[10cqh]" /> {/* Spacer to keep title centered */}
                <h2 className="text-[4.1cqh] font-semibold tracking-[-0.02em] text-white text-center">
                  Cài đặt
                </h2>
                <div className="w-[10cqh] flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="liquid-pill-btn px-[3.4cqh] py-[0.9cqh] text-[2.9cqh] font-semibold text-sky-200 hover:text-white cursor-pointer"
                  >
                    Xong
                  </button>
                </div>
              </div>
            </div>

            {/* 2-Column iOS 27 Inset Grouped Content */}
            <div className="flex-1 overflow-y-auto glass-scroll px-[2.4cqw] py-[3cqh]">
              <div className="grid grid-cols-2 gap-[2.2cqw] items-start">
                {/* Left Group: Giao diện & Đồng hồ */}
                <div className="space-y-[2.2cqh]">
                  <p className="px-[1cqw] text-[2.5cqh] font-medium uppercase tracking-[0.06em] text-white/55">
                    Hiển thị & Kính lỏng
                  </p>

                  <div className="rounded-[3.8cqh] bg-white/[0.08] border border-white/14 divide-y divide-white/10 overflow-hidden shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.22)]">
                    {/* Analog Clock Row */}
                    <div className="flex items-center justify-between gap-2 px-[1.5cqw] py-[2cqh]">
                      <div className="flex items-center gap-[1.1cqw] min-w-0">
                        <span className="w-[6.4cqh] h-[6.4cqh] rounded-[1.8cqh] bg-[#0A84FF] flex items-center justify-center shrink-0 shadow-sm">
                          <ClockFaceIcon className="w-[3.6cqh] h-[3.6cqh] text-white" />
                        </span>
                        <span className="text-[3.1cqh] font-normal text-white truncate">
                          Đồng hồ cơ
                        </span>
                      </div>
                      <AppleSwitch
                        checked={clockMode === 'analog'}
                        onChange={toggleClockMode}
                        ariaLabel="Bật đồng hồ cơ"
                      />
                    </div>

                    {/* Background Vividness */}
                    <div className="flex items-center justify-between gap-2 px-[1.5cqw] py-[2cqh]">
                      <div className="flex items-center gap-[1.1cqw] min-w-0">
                        <span className="w-[6.4cqh] h-[6.4cqh] rounded-[1.8cqh] bg-[#5E5CE6] flex items-center justify-center shrink-0 shadow-sm">
                          <SparklesIcon className="w-[3.4cqh] h-[3.4cqh] text-white" />
                        </span>
                        <span className="text-[3.1cqh] font-normal text-white truncate">
                          Nền sáng nổi bật
                        </span>
                      </div>
                      <AppleSwitch
                        checked={auroraIntensity === 'vivid'}
                        onChange={() =>
                          setAuroraIntensity(auroraIntensity === 'vivid' ? 'subtle' : 'vivid')
                        }
                        ariaLabel="Chỉnh độ sáng hình nền"
                      />
                    </div>

                    {/* Glass Opacity Segmented Control */}
                    <div className="px-[1.5cqw] py-[2cqh] space-y-[1.6cqh]">
                      <div className="flex items-center gap-[1.1cqw]">
                        <span className="w-[6.4cqh] h-[6.4cqh] rounded-[1.8cqh] bg-[#32ADE6] flex items-center justify-center shrink-0 shadow-sm">
                          <GlassLayersIcon className="w-[3.5cqh] h-[3.5cqh] text-white" />
                        </span>
                        <span className="text-[3.1cqh] font-normal text-white">
                          Độ trong suốt kính
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-[0.5cqw] p-[0.6cqh] rounded-full bg-black/30 border border-white/10">
                        {OPACITY_OPTIONS.map((opt) => {
                          const active = glassOpacity === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setGlassOpacity(opt.id)}
                              className={`py-[1.1cqh] rounded-full text-[2.6cqh] font-medium transition-all cursor-pointer ${
                                active
                                  ? 'bg-white/25 text-white shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.3)]'
                                  : 'text-white/60 hover:text-white/85'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Group: Âm thanh & Trợ lý AI */}
                <div className="space-y-[2.2cqh]">
                  <p className="px-[1cqw] text-[2.5cqh] font-medium uppercase tracking-[0.06em] text-white/55">
                    Âm thanh & Chế độ AI
                  </p>

                  <div className="rounded-[3.8cqh] bg-white/[0.08] border border-white/14 divide-y divide-white/10 overflow-hidden shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.22)]">
                    {/* Alarm Time */}
                    <div className="flex items-center justify-between gap-2 px-[1.5cqw] py-[2cqh]">
                      <div className="flex items-center gap-[1.1cqw] min-w-0">
                        <span className="w-[6.4cqh] h-[6.4cqh] rounded-[1.8cqh] bg-[#FF9F0A] flex items-center justify-center shrink-0 shadow-sm">
                          <AlarmClockIcon className="w-[3.5cqh] h-[3.5cqh] text-white" />
                        </span>
                        <span className="text-[3.1cqh] font-normal text-white truncate">
                          Giờ báo thức
                        </span>
                      </div>
                      <input
                        type="time"
                        value={alarmTime}
                        onChange={(e) => setAlarmTime(e.target.value)}
                        className="rounded-full bg-white/15 border border-white/20 px-[2.2cqh] py-[0.8cqh] text-[2.8cqh] text-white tabular-nums focus:outline-none"
                      />
                    </div>

                    {/* White Noise Preset */}
                    <div className="flex items-center justify-between gap-2 px-[1.5cqw] py-[2cqh]">
                      <div className="flex items-center gap-[1.1cqw] min-w-0">
                        <span className="w-[6.4cqh] h-[6.4cqh] rounded-[1.8cqh] bg-[#BF5AF2] flex items-center justify-center shrink-0 shadow-sm">
                          <SoundwaveIcon className="w-[3.5cqh] h-[3.5cqh] text-white" />
                        </span>
                        <span className="text-[3.1cqh] font-normal text-white truncate">
                          Tiếng ồn trắng
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={cycleWhiteNoisePreset}
                        className="rounded-full bg-white/14 hover:bg-white/22 border border-white/18 px-[2.4cqh] py-[0.9cqh] text-[2.7cqh] text-white/90 cursor-pointer shrink-0 transition-colors"
                      >
                        {whiteNoisePreset}
                      </button>
                    </div>

                    {/* AI Focus Test */}
                    <button
                      type="button"
                      onClick={() => {
                        simulateFocusWarning();
                        setActiveModal(null);
                      }}
                      className="w-full flex items-center justify-between gap-2 px-[1.5cqw] py-[2cqh] hover:bg-white/[0.06] cursor-pointer transition-colors text-left"
                    >
                      <div className="flex items-center gap-[1.1cqw] min-w-0">
                        <span className="w-[6.4cqh] h-[6.4cqh] rounded-[1.8cqh] bg-[#0A84FF] flex items-center justify-center shrink-0 shadow-sm">
                          <FocusCameraIcon className="w-[3.5cqh] h-[3.5cqh] text-white" />
                        </span>
                        <span className="text-[3.1cqh] font-normal text-white truncate">
                          Thử cảnh báo AI Tập trung
                        </span>
                      </div>
                      <span className="text-[2.7cqh] font-medium text-sky-300 shrink-0">
                        Chạy thử
                      </span>
                    </button>

                    {/* AI Wellness Test */}
                    <button
                      type="button"
                      onClick={() => {
                        simulateWellnessReminder();
                        setActiveModal(null);
                      }}
                      className="w-full flex items-center justify-between gap-2 px-[1.5cqw] py-[2cqh] hover:bg-white/[0.06] cursor-pointer transition-colors text-left"
                    >
                      <div className="flex items-center gap-[1.1cqw] min-w-0">
                        <span className="w-[6.4cqh] h-[6.4cqh] rounded-[1.8cqh] bg-[#FF375F] flex items-center justify-center shrink-0 shadow-sm">
                          <HeartPulseIcon className="w-[3.5cqh] h-[3.5cqh] text-white" />
                        </span>
                        <span className="text-[3.1cqh] font-normal text-white truncate">
                          Thử nhắc nhở AI Sức khỏe
                        </span>
                      </div>
                      <span className="text-[2.7cqh] font-medium text-rose-300 shrink-0">
                        Chạy thử
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
