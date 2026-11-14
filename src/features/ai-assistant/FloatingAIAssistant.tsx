import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import {
  iosSpringBubble,
  iosSpringExpand,
  iosSpringSnappy,
} from '../../styles/motion';
import {
  ChevronUpIcon,
  MicIcon,
  SendIcon,
} from '../../components/ui/SFIcons';

interface FloatingAIAssistantProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const getBubbleSize = (containerHeight: number) =>
  Math.round(Math.max(50, Math.min(92, containerHeight * 0.145)));
const EDGE_PADDING = 10;

const QUICK_PROMPTS = [
  'Đếm ngược 25p',
  'Camera tập trung',
  'Nhắc sức khỏe',
  'Đồng hồ cơ',
  'Thêm việc 23:00',
];

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  containerRef,
}) => {
  const aiChatOpen = useAppStore((s) => s.aiChatOpen);
  const setAiChatOpen = useAppStore((s) => s.setAiChatOpen);
  const messages = useAppStore((s) => s.messages);
  const sendAiMessage = useAppStore((s) => s.sendAiMessage);

  const [input, setInput] = useState('');
  const [voiceListening, setVoiceListening] = useState(false);
  const [bubbleSize, setBubbleSize] = useState(64);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<{
    active: boolean;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
    moved: boolean;
  }>({
    active: false,
    startClientX: 0,
    startClientY: 0,
    startX: 0,
    startY: 0,
    moved: false,
  });

  const pageSwipeRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    canSwipeDown: boolean;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    canSwipeDown: false,
  });

  const messagesFeedRef = useRef<HTMLDivElement | null>(null);
  const voiceTimerRef = useRef<number | null>(null);

  // Initialize & keep orb bounded inside 21:9 container
  useEffect(() => {
    const syncBounds = () => {
      const el = containerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w === 0 || h === 0) return;

      const nextSize = getBubbleSize(h);
      setBubbleSize(nextSize);

      setPos((prev) => {
        if (!prev) {
          return {
            x: Math.max(EDGE_PADDING, w - nextSize - EDGE_PADDING),
            y: Math.max(EDGE_PADDING, Math.round(h * 0.56 - nextSize / 2)),
          };
        }
        return {
          x: Math.min(
            Math.max(EDGE_PADDING, prev.x),
            Math.max(EDGE_PADDING, w - nextSize - EDGE_PADDING)
          ),
          y: Math.min(
            Math.max(EDGE_PADDING, prev.y),
            Math.max(EDGE_PADDING, h - nextSize - EDGE_PADDING)
          ),
        };
      });
    };

    syncBounds();
    window.addEventListener('resize', syncBounds);
    return () => window.removeEventListener('resize', syncBounds);
  }, [containerRef]);

  // Scroll ONLY the inner message feed so outer <main>/viewport never shifts
  useEffect(() => {
    if (!aiChatOpen) return;
    const feed = messagesFeedRef.current;
    if (!feed) return;
    feed.scrollTo({
      top: feed.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, aiChatOpen]);

  useEffect(() => {
    return () => {
      if (voiceTimerRef.current) {
        window.clearTimeout(voiceTimerRef.current);
      }
    };
  }, []);

  // Floating orb drag & edge snap
  const handleOrbPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!pos) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragRef.current = {
      active: true,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: pos.x,
      startY: pos.y,
      moved: false,
    };
  };

  const handleOrbPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.active) return;
    const el = containerRef.current;
    if (!el) return;

    const dx = e.clientX - dragRef.current.startClientX;
    const dy = e.clientY - dragRef.current.startClientY;

    if (Math.hypot(dx, dy) > 6) {
      dragRef.current.moved = true;
    }

    const maxX = Math.max(EDGE_PADDING, el.clientWidth - bubbleSize - EDGE_PADDING);
    const maxY = Math.max(EDGE_PADDING, el.clientHeight - bubbleSize - EDGE_PADDING);

    setPos({
      x: Math.min(Math.max(EDGE_PADDING, dragRef.current.startX + dx), maxX),
      y: Math.min(Math.max(EDGE_PADDING, dragRef.current.startY + dy), maxY),
    });
  };

  const handleOrbPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.active) return;
    e.stopPropagation();
    dragRef.current.active = false;
    setIsDragging(false);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (!dragRef.current.moved) {
      setAiChatOpen(true);
      return;
    }

    const el = containerRef.current;
    if (!el || !pos) return;
    const maxX = el.clientWidth - bubbleSize - EDGE_PADDING;
    const maxY = el.clientHeight - bubbleSize - EDGE_PADDING;

    const distLeft = pos.x - EDGE_PADDING;
    const distRight = maxX - pos.x;
    const distTop = pos.y - EDGE_PADDING;
    const distBottom = maxY - pos.y;

    const minDist = Math.min(distLeft, distRight, distTop, distBottom);

    let nextX = pos.x;
    let nextY = pos.y;

    if (minDist === distLeft) nextX = EDGE_PADDING;
    else if (minDist === distRight) nextX = maxX;
    else if (minDist === distTop) nextY = EDGE_PADDING;
    else nextY = maxY;

    setPos({ x: nextX, y: nextY });
  };

  // Swipe-down handler on the bottom AI Chat page to return to Clock page above
  const handlePagePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (!aiChatOpen || !e.isPrimary) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('button:not([data-swipe-trigger="true"]), input, textarea')) {
      return;
    }

    const inScrollFeed = Boolean(target?.closest('.glass-scroll'));
    const atFeedTop = (messagesFeedRef.current?.scrollTop ?? 0) <= 4;

    pageSwipeRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      canSwipeDown: !inScrollFeed || atFeedTop,
    };
  };

  const handlePagePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!pageSwipeRef.current.active || !pageSwipeRef.current.canSwipeDown) return;

    const dx = e.clientX - pageSwipeRef.current.startX;
    const dy = e.clientY - pageSwipeRef.current.startY;

    if (dy > 42 && Math.abs(dy) > Math.abs(dx) * 1.2) {
      pageSwipeRef.current.active = false;
      setAiChatOpen(false);
    }
  };

  const handlePagePointerUp = () => {
    pageSwipeRef.current.active = false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendAiMessage(input);
    setInput('');
  };

  const handleInputBlur = () => {
    window.scrollTo(0, 0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const handleVoiceToggle = () => {
    if (voiceListening) {
      setVoiceListening(false);
      if (voiceTimerRef.current) {
        window.clearTimeout(voiceTimerRef.current);
        voiceTimerRef.current = null;
      }
      return;
    }

    setVoiceListening(true);
    voiceTimerRef.current = window.setTimeout(() => {
      setVoiceListening(false);
      setInput('Đặt đếm ngược 25 phút');
      voiceTimerRef.current = null;
    }, 1100);
  };

  return (
    <>
      {/* Draggable Edge-Snapping AI Orb (hidden cleanly on the bottom AI Chat page) */}
      {pos && (
        <motion.button
          type="button"
          data-no-expand="true"
          aria-label="Mở Trợ lý AI"
          tabIndex={aiChatOpen ? -1 : 0}
          onPointerDown={handleOrbPointerDown}
          onPointerMove={handleOrbPointerMove}
          onPointerUp={handleOrbPointerUp}
          onPointerCancel={handleOrbPointerUp}
          animate={{
            x: pos.x,
            y: pos.y,
            scale: aiChatOpen ? 0.7 : isDragging ? 1.08 : 1,
            opacity: aiChatOpen ? 0 : 1,
          }}
          transition={isDragging ? { duration: 0 } : iosSpringBubble}
          whileTap={{ scale: 0.92 }}
          style={{
            width: bubbleSize,
            height: bubbleSize,
            left: 0,
            top: 0,
            touchAction: 'none',
            pointerEvents: aiChatOpen ? 'none' : 'auto',
          }}
          className="ai-iridescent-orb absolute z-40 cursor-grab active:cursor-grabbing focus:outline-none"
        >
          <div className="ai-iridescent-orb-inner flex items-center justify-center">
            <span className="text-[3.8cqh] font-semibold tracking-tight text-white">
              AI
            </span>
          </div>
        </motion.button>
      )}

      {/* iPhone Messages (iMessage) White Light Theme AI Chat Page */}
      <motion.section
        aria-label="Trang Trợ lý AI phong cách iPhone Messages"
        aria-hidden={!aiChatOpen}
        initial={false}
        animate={{
          y: aiChatOpen ? '0%' : '100%',
          opacity: aiChatOpen ? 1 : 0,
        }}
        transition={iosSpringExpand}
        style={{
          pointerEvents: aiChatOpen ? 'auto' : 'none',
          touchAction: 'none',
        }}
        onPointerDown={handlePagePointerDown}
        onPointerMove={handlePagePointerMove}
        onPointerUp={handlePagePointerUp}
        onPointerCancel={handlePagePointerUp}
        className="absolute inset-0 w-full h-full z-30 flex flex-col bg-white text-[#1C1C1E] overflow-hidden"
      >
        {/* Crisp White Frosted iOS Messages Top Header */}
        <header className="w-full shrink-0 bg-white/90 backdrop-blur-md border-b border-black/[0.07] px-[4cqw] pt-[1.8cqh] pb-[1.5cqh] flex items-center justify-between">
          <div className="w-[7.2cqh] h-[7.2cqh]" aria-hidden="true" />

          <button
            type="button"
            data-swipe-trigger="true"
            tabIndex={aiChatOpen ? 0 : -1}
            onClick={() => setAiChatOpen(false)}
            aria-label="Vuốt xuống hoặc chạm để quay lại đồng hồ"
            className="flex flex-col items-center gap-[1cqh] px-[2.4cqw] rounded-full cursor-pointer group focus:outline-none"
          >
            <span className="w-[7.5cqw] h-[0.75cqh] rounded-full bg-black/20 group-hover:bg-black/35 transition-colors" />
            <span className="inline-flex items-center gap-[0.9cqw]">
              <span className="w-[4.6cqh] h-[4.6cqh] rounded-full bg-gradient-to-b from-[#9AA8BC] to-[#7C8B9E] text-white text-[1.9cqh] font-semibold flex items-center justify-center shadow-xs">
                AI
              </span>
              <span className="text-[2.8cqh] font-semibold tracking-tight text-[#1C1C1E]">
                Trợ lý AI
              </span>
            </span>
          </button>

          <motion.button
            type="button"
            tabIndex={aiChatOpen ? 0 : -1}
            whileTap={{ scale: 0.9 }}
            onClick={() => setAiChatOpen(false)}
            aria-label="Quay lại trang đồng hồ"
            className="w-[7.2cqh] h-[7.2cqh] rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] flex items-center justify-center text-[#007AFF] cursor-pointer transition-colors focus:outline-none"
          >
            <ChevronUpIcon className="w-[3.4cqh] h-[3.4cqh]" />
          </motion.button>
        </header>

        {/* Centered iMessage Conversation Stream */}
        <div
          ref={messagesFeedRef}
          className="w-full flex-1 min-h-0 overflow-y-auto glass-scroll bg-white"
        >
          <div className="w-full max-w-[74cqw] mx-auto px-[2cqw] py-[2.4cqh] space-y-[1.8cqh]">
            {messages.map((m, idx) => {
              const prev = messages[idx - 1];
              const next = messages[idx + 1];
              const isIncoming = m.role === 'assistant';
              const isFirstInGroup = !prev || prev.role !== m.role;
              const isLastInGroup = !next || next.role !== m.role;
              const showTimeDivider = idx === 0 || (prev && prev.time !== m.time);

              return (
                <React.Fragment key={m.id}>
                  {showTimeDivider && (
                    <div className="text-center text-[2.15cqh] font-medium text-[#8E8E93] py-[0.5cqh]">
                      Hôm nay, {m.time}
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={iosSpringSnappy}
                    className={`flex ${isIncoming ? 'justify-start' : 'justify-end'}`}
                  >
                    {isIncoming ? (
                      <div className="flex items-end gap-[1.1cqw] max-w-[78%]">
                        {/* Incoming circular avatar aligned to bottom of bubble */}
                        <div className="w-[5.2cqh] h-[5.2cqh] shrink-0 flex items-center justify-center">
                          {isLastInGroup && (
                            <span className="w-[5.2cqh] h-[5.2cqh] rounded-full bg-gradient-to-b from-[#9BA8B8] to-[#808E9F] text-white text-[2cqh] font-semibold flex items-center justify-center select-none">
                              AI
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col items-start">
                          {isFirstInGroup && (
                            <span className="text-[2.1cqh] text-[#8E8E93] ml-[1.4cqw] mb-[0.45cqh]">
                              Trợ lý AI
                            </span>
                          )}
                          <div className="relative rounded-[3.4cqh] rounded-bl-[1cqh] bg-[#E9E9EB] text-[#000000] px-[2.2cqw] py-[1.55cqh] text-[3.05cqh] leading-snug">
                            {m.text}
                            {isLastInGroup && (
                              <svg
                                viewBox="0 0 14 18"
                                aria-hidden="true"
                                className="absolute -left-[0.8cqh] bottom-0 w-[1.5cqh] h-[1.9cqh] text-[#E9E9EB] pointer-events-none"
                              >
                                <path
                                  d="M14 1 C14 9.5 10.2 15.2 0 18 C6.8 18 11.5 15.8 14 11.5 Z"
                                  fill="currentColor"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative max-w-[76%] rounded-[3.4cqh] rounded-br-[1cqh] bg-[#007AFF] text-white px-[2.2cqw] py-[1.55cqh] text-[3.05cqh] leading-snug">
                        {m.text}
                        {isLastInGroup && (
                          <svg
                            viewBox="0 0 14 18"
                            aria-hidden="true"
                            className="absolute -right-[0.8cqh] bottom-0 w-[1.5cqh] h-[1.9cqh] text-[#007AFF] pointer-events-none"
                          >
                            <path
                              d="M0 1 C0 9.5 3.8 15.2 14 18 C7.2 18 2.5 15.8 0 11.5 Z"
                              fill="currentColor"
                            />
                          </svg>
                        )}
                      </div>
                    )}
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Crisp White Bottom Dock (Quick Pills + iMessage Composer Capsule) */}
        <div className="w-full shrink-0 bg-white border-t border-black/[0.06] px-[4cqw] pt-[1.3cqh] pb-[2.2cqh]">
          <div className="w-full max-w-[74cqw] mx-auto flex flex-col gap-[1.3cqh]">
            {/* Minimalist iOS Light Suggestion Pills */}
            <div className="flex flex-wrap items-center justify-center gap-[0.8cqw]">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  tabIndex={aiChatOpen ? 0 : -1}
                  onClick={() => sendAiMessage(q)}
                  className="shrink-0 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] border border-black/[0.06] px-[1.5cqw] py-[0.7cqh] text-[2.25cqh] font-medium text-[#1C1C1E] cursor-pointer transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* White Capsule Composer Bar */}
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-[#C6C6C8] rounded-full pl-[2.2cqw] pr-[0.75cqw] py-[0.65cqh] flex items-center gap-[0.8cqw]"
            >
              <input
                type="text"
                tabIndex={aiChatOpen ? 0 : -1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onBlur={handleInputBlur}
                placeholder={
                  voiceListening
                    ? 'Đang nghe lệnh giọng nói...'
                    : 'iMessage • Nhắn cho AI...'
                }
                className="flex-1 min-w-0 bg-transparent text-[3.05cqh] text-[#1C1C1E] placeholder-[#8E8E93] focus:outline-none"
              />

              <motion.button
                type="button"
                tabIndex={aiChatOpen ? 0 : -1}
                whileTap={{ scale: 0.9 }}
                onClick={handleVoiceToggle}
                aria-label={voiceListening ? 'Dừng thu giọng nói' : 'Nhập bằng giọng nói'}
                className={`w-[6.3cqh] h-[6.3cqh] rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors focus:outline-none ${
                  voiceListening
                    ? 'bg-[#FF3B30] text-white animate-pulse'
                    : 'bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#8E8E93]'
                }`}
              >
                <MicIcon className="w-[3cqh] h-[3cqh]" />
              </motion.button>

              <motion.button
                type="submit"
                tabIndex={aiChatOpen ? 0 : -1}
                whileTap={{ scale: 0.9 }}
                aria-label="Gửi tin nhắn"
                className={`w-[6.3cqh] h-[6.3cqh] rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors focus:outline-none ${
                  input.trim()
                    ? 'bg-[#007AFF] hover:bg-[#0066D6] text-white'
                    : 'bg-[#E5E5EA] text-[#8E8E93]'
                }`}
              >
                <SendIcon className="w-[3cqh] h-[3cqh]" />
              </motion.button>
            </form>
          </div>
        </div>
      </motion.section>
    </>
  );
};
