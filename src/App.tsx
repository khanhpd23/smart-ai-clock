import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAppStore, type TileId } from './store/useAppStore';
import { iosSpringExpand } from './styles/motion';
import { OrientationGuard } from './components/OrientationGuard';
import { LiquidAlertBanner } from './components/LiquidAlertBanner';
import { SettingsModal } from './components/SettingsModal';
import { ClockTile } from './features/tile-clock/ClockTile';
import { TimerTile } from './features/tile-timer/TimerTile';
import { HubTile } from './features/tile-hub/HubTile';
import { FloatingAIAssistant } from './features/ai-assistant/FloatingAIAssistant';

const ORIGIN_MAP: Record<TileId, string> = {
  clock: 'left center',
  timer: 'center center',
  hub: 'right center',
};

export function App() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const swipeUpRef = useRef<{ active: boolean; startX: number; startY: number }>({
    active: false,
    startX: 0,
    startY: 0,
  });

  const expandedTile = useAppStore((s) => s.expandedTile);
  const setExpandedTile = useAppStore((s) => s.setExpandedTile);
  const activeModal = useAppStore((s) => s.activeModal);
  const setActiveModal = useAppStore((s) => s.setActiveModal);
  const aiChatOpen = useAppStore((s) => s.aiChatOpen);
  const setAiChatOpen = useAppStore((s) => s.setAiChatOpen);
  const auroraIntensity = useAppStore((s) => s.auroraIntensity);
  const glassOpacity = useAppStore((s) => s.glassOpacity);

  // Desktop helper: Esc collapses modal -> chat -> expanded tile
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (activeModal) {
        setActiveModal(null);
      } else if (aiChatOpen) {
        setAiChatOpen(false);
      } else if (expandedTile) {
        setExpandedTile(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal, aiChatOpen, expandedTile, setActiveModal, setAiChatOpen, setExpandedTile]);

  // Lock viewport & prevent programmatic/keyboard scroll from creating bottom black gap
  useEffect(() => {
    const resetScroll = () => {
      if (stageRef.current) {
        stageRef.current.scrollTop = 0;
        stageRef.current.scrollLeft = 0;
      }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    };

    const handleFocusOut = () => {
      resetScroll();
      window.setTimeout(resetScroll, 80);
    };

    resetScroll();
    const vv = window.visualViewport;
    vv?.addEventListener('resize', resetScroll);
    vv?.addEventListener('scroll', resetScroll);
    window.addEventListener('focusout', handleFocusOut);

    return () => {
      vv?.removeEventListener('resize', resetScroll);
      vv?.removeEventListener('scroll', resetScroll);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, [aiChatOpen]);

  // Vertical swipe-up from Clock page to reveal minimalist AI Chat page below
  const handleStagePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (aiChatOpen || activeModal || !e.isPrimary) return;
    const target = e.target as HTMLElement | null;
    if (
      target?.closest(
        '[data-no-expand="true"], .glass-scroll, input, textarea, button:not([data-swipe-trigger="true"])'
      )
    ) {
      return;
    }
    swipeUpRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
    };
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!swipeUpRef.current.active || aiChatOpen || activeModal) return;
    const dx = e.clientX - swipeUpRef.current.startX;
    const dy = e.clientY - swipeUpRef.current.startY;
    if (dy < -42 && Math.abs(dy) > Math.abs(dx) * 1.25) {
      swipeUpRef.current.active = false;
      setAiChatOpen(true);
    }
  };

  const handleStagePointerUp = () => {
    swipeUpRef.current.active = false;
  };

  return (
    <div
      style={{ overflow: 'clip' }}
      className="relative w-screen h-[100dvh] bg-[#030714] flex items-center justify-center overflow-hidden overflow-clip p-[env(safe-area-inset-top)_env(safe-area-inset-right)_env(safe-area-inset-bottom)_env(safe-area-inset-left)]"
    >
      {/* Ambient outer wallpaper bleed for non-21:9 screens */}
      <img
        src="/bg-wallpaper.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 w-full h-full object-cover opacity-35 blur-2xl scale-110 select-none"
      />

      <OrientationGuard />

      {/* Strict 21:9 Horizontal Frame with Container Query Sizing */}
      <main
        ref={stageRef}
        data-glass-opacity={glassOpacity}
        aria-label="Giao diện Đồng hồ AI thông minh 21:9"
        onPointerDown={handleStagePointerDown}
        onPointerMove={handleStagePointerMove}
        onPointerUp={handleStagePointerUp}
        onPointerCancel={handleStagePointerUp}
        style={{
          width: 'min(100vw, calc(100dvh * 21 / 9))',
          height: 'min(100dvh, calc(100vw * 9 / 21))',
          containerType: 'size',
          overflow: 'clip',
        }}
        className="relative overflow-hidden overflow-clip rounded-[5.8cqh] bg-[#071126] shadow-[0_32px_90px_rgba(0,0,0,0.82)] border border-white/15"
      >
        {/* User Wallpaper Background */}
        <img
          src="/bg-wallpaper.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full object-cover select-none"
        />

        {/* Subtle contrast-balancing glaze */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            auroraIntensity === 'vivid'
              ? 'bg-gradient-to-b from-[#071026]/22 via-[#060d1f]/18 to-[#050a18]/32'
              : 'bg-gradient-to-b from-[#071026]/42 via-[#060d1f]/38 to-[#050a18]/50'
          }`}
        />

        {/* Minimalist iOS 27 Dynamic Capsule Notification */}
        <LiquidAlertBanner />

        {/* Page 1: 3-Tile Smart Clock Stage (slides up cleanly when AI Chat page opens) */}
        <motion.div
          aria-hidden={aiChatOpen}
          initial={false}
          animate={{
            y: aiChatOpen ? '-100%' : '0%',
            scale: aiChatOpen ? 0.95 : 1,
            opacity: aiChatOpen ? 0 : 1,
          }}
          transition={iosSpringExpand}
          style={{ pointerEvents: aiChatOpen ? 'none' : 'auto' }}
          className="relative z-10 w-full h-full"
        >
          {/* Layer 1: Stable 3-Column Compact Grid (Uniform scale fade — zero horizontal stretch) */}
          <motion.div
            animate={{
              opacity: expandedTile ? 0 : 1,
              scale: expandedTile ? 0.95 : 1,
              filter: expandedTile ? 'blur(8px)' : 'blur(0px)',
            }}
            transition={iosSpringExpand}
            style={{ pointerEvents: expandedTile ? 'none' : 'auto' }}
            className="w-full h-full px-[2.1cqw] py-[3.6cqh]"
          >
            <div className="w-full h-full grid grid-cols-3 gap-[1.6cqw]">
              <ClockTile mode="compact" />
              <TimerTile mode="compact" />
              <HubTile mode="compact" />
            </div>
          </motion.div>

          {/* Layer 2: Expanded Full-Screen Tile Overlay (Uniform scale morph — zero aspect distortion) */}
          <AnimatePresence>
            {expandedTile && (
              <motion.div
                key={expandedTile}
                initial={{ opacity: 0, scale: 0.88, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.88, filter: 'blur(10px)' }}
                transition={iosSpringExpand}
                style={{ transformOrigin: ORIGIN_MAP[expandedTile] }}
                className="absolute inset-0 z-20 px-[2.1cqw] py-[3.6cqh]"
              >
                {expandedTile === 'clock' && <ClockTile mode="expanded" />}
                {expandedTile === 'timer' && <TimerTile mode="expanded" />}
                {expandedTile === 'hub' && <HubTile mode="expanded" />}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimalist iOS Bottom Swipe-Up Home Indicator */}
          <button
            type="button"
            data-swipe-trigger="true"
            onClick={() => setAiChatOpen(true)}
            aria-label="Vuốt lên hoặc chạm để mở trang Chat AI"
            className="absolute bottom-[0.65cqh] left-1/2 -translate-x-1/2 z-30 py-[0.5cqh] px-[2cqw] cursor-pointer group focus:outline-none"
          >
            <span className="block w-[9cqw] h-[0.75cqh] rounded-full bg-white/30 group-hover:bg-white/55 transition-colors" />
          </button>
        </motion.div>

        {/* Page 2 & Edge-Snapping AI Orb */}
        <FloatingAIAssistant containerRef={stageRef} />

        {/* Authentic iOS 27 Settings Sheet */}
        <SettingsModal />
      </main>
    </div>
  );
}

export default App;
