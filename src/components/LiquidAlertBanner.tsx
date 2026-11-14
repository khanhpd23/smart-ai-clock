import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { iosSpringSnappy } from '../styles/motion';
import { FocusCameraIcon, HeartPulseIcon, SparklesIcon } from './ui/SFIcons';

export const LiquidAlertBanner: React.FC = () => {
  const toastAlert = useAppStore((s) => s.toastAlert);
  const dismissToast = useAppStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toastAlert) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 2800);
    return () => clearTimeout(timer);
  }, [toastAlert, dismissToast]);

  return (
    <div className="pointer-events-none absolute top-[2.4cqh] inset-x-0 z-50 flex justify-center px-4">
      <AnimatePresence mode="wait">
        {toastAlert && (
          <motion.button
            type="button"
            key={toastAlert.id}
            data-no-expand="true"
            onClick={dismissToast}
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.92 }}
            transition={iosSpringSnappy}
            className="pointer-events-auto liquid-glass-modal rounded-full px-[2.4cqh] py-[1.15cqh] flex items-center gap-[1.5cqh] max-w-[72cqw] border border-white/25 shadow-[0_12px_30px_rgba(0,0,0,0.45)] cursor-pointer"
          >
            <span
              className={`w-[4.6cqh] h-[4.6cqh] rounded-full flex items-center justify-center shrink-0 ${
                toastAlert.type === 'focus'
                  ? 'bg-sky-400/25 text-sky-200'
                  : toastAlert.type === 'wellness'
                    ? 'bg-rose-400/25 text-rose-200'
                    : 'bg-white/15 text-white'
              }`}
            >
              {toastAlert.type === 'focus' ? (
                <FocusCameraIcon className="w-[2.6cqh] h-[2.6cqh]" />
              ) : toastAlert.type === 'wellness' ? (
                <HeartPulseIcon className="w-[2.6cqh] h-[2.6cqh]" />
              ) : (
                <SparklesIcon className="w-[2.4cqh] h-[2.4cqh]" />
              )}
            </span>

            <span className="text-[2.85cqh] font-medium text-white tracking-[-0.01em] truncate">
              {toastAlert.title}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
