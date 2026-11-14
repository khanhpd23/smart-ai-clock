import React from 'react';
import { motion } from 'motion/react';
import { iosSpringSnappy } from '../../styles/motion';

interface CircleGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  activeVariant?: 'cyan' | 'rose' | 'amber' | 'indigo';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
  sm: 'w-[7.8cqh] h-[7.8cqh]',
  md: 'w-[12.2cqh] h-[12.2cqh]',
  lg: 'w-[17.2cqh] h-[17.2cqh]',
  xl: 'w-[20cqh] h-[20cqh]',
};

const ACTIVE_CLASS: Record<'cyan' | 'rose' | 'amber' | 'indigo', string> = {
  cyan: 'liquid-btn-active-cyan text-sky-100',
  rose: 'liquid-btn-active-rose text-rose-100',
  amber: 'liquid-btn-active-amber text-amber-100',
  indigo: 'liquid-btn-active-indigo text-violet-100',
};

export const CircleGlassButton: React.FC<CircleGlassButtonProps> = ({
  active = false,
  activeVariant = 'cyan',
  size = 'md',
  className = '',
  children,
  onClick,
  ...rest
}) => {
  return (
    <motion.button
      type="button"
      data-no-expand="true"
      whileTap={{ scale: 0.9 }}
      transition={iosSpringSnappy}
      onClick={onClick}
      className={`liquid-circle-btn flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
        SIZE_CLASSES[size]
      } ${active ? ACTIVE_CLASS[activeVariant] : 'text-white/95'} ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
};

interface IOSToggleProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
}

export const IOSToggle: React.FC<IOSToggleProps> = ({ checked, onChange, ariaLabel }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      data-no-expand="true"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative inline-flex items-center w-[9.2cqh] h-[5.0cqh] rounded-full p-[0.45cqh] cursor-pointer transition-colors duration-200 border border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
        checked
          ? 'bg-sky-400/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.25),0_0_14px_rgba(56,189,248,0.4)]'
          : 'bg-white/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.35)]'
      }`}
    >
      <motion.span
        layout
        transition={iosSpringSnappy}
        className="w-[4.1cqh] h-[4.1cqh] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
        style={{
          marginLeft: checked ? 'auto' : '0px',
          marginRight: checked ? '0px' : 'auto',
        }}
      />
    </button>
  );
};
