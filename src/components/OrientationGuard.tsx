import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PhoneLandscapeIcon } from './ui/SFIcons';

export const OrientationGuard: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[100] bg-[#040712]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="liquid-glass-card max-w-xs w-full p-7 flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: [0, -90, -90, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          className="text-sky-300"
        >
          <PhoneLandscapeIcon className="w-14 h-14" />
        </motion.div>

        <h1 className="text-lg font-semibold tracking-tight text-white">
          Vui lòng xoay ngang điện thoại
        </h1>

        <p className="text-xs leading-relaxed text-white/70">
          Giao diện Đồng hồ AI Thông minh được thiết kế riêng cho màn hình di động nằm ngang tỉ lệ{' '}
          <span className="text-white font-medium">21:9</span>. Chế độ dọc không được hỗ trợ.
        </p>
      </div>
    </div>
  );
};
