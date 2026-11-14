import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { useTileGesture } from '../../hooks/useTileGesture';
import { iosSpringSnappy } from '../../styles/motion';
import { CircleGlassButton } from '../../components/ui/GlassPrimitives';
import {
  CheckIcon,
  FocusCameraIcon,
  HeartPulseIcon,
  LockIcon,
  MinimizeIcon,
  PlusIcon,
  SettingsGearIcon,
  TrashIcon,
} from '../../components/ui/SFIcons';

interface HubTileProps {
  mode?: 'compact' | 'expanded';
}

export const HubTile: React.FC<HubTileProps> = ({ mode = 'compact' }) => {
  const todos = useAppStore((s) => s.todos);
  const addTodo = useAppStore((s) => s.addTodo);
  const toggleTodo = useAppStore((s) => s.toggleTodo);
  const deleteTodo = useAppStore((s) => s.deleteTodo);

  const wellnessModeEnabled = useAppStore((s) => s.wellnessModeEnabled);
  const focusGuardEnabled = useAppStore((s) => s.focusGuardEnabled);
  const toggleWellnessMode = useAppStore((s) => s.toggleWellnessMode);
  const toggleFocusGuard = useAppStore((s) => s.toggleFocusGuard);
  const setActiveModal = useAppStore((s) => s.setActiveModal);
  const triggerToast = useAppStore((s) => s.triggerToast);

  const setExpandedTile = useAppStore((s) => s.setExpandedTile);

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('23:00');

  const { pinchScale, bindPinch, handlePointerUp } = useTileGesture({
    tileId: 'hub',
  });

  const isExpanded = mode === 'expanded';
  const upcomingThree = todos.filter((t) => !t.completed).slice(0, 3);

  const handleLockClick = () => {
    triggerToast({
      type: 'info',
      title: 'Khóa điện thoại (Chưa kích hoạt ở MVP)',
      message: '',
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTodo(newTitle, newTime);
    setNewTitle('');
  };

  const renderControlButtons = (vertical: boolean) => (
    <div
      className={
        vertical
          ? 'flex flex-col items-center justify-center gap-[3cqh] pl-[2cqw] pr-[3.5cqw] border-l border-white/15 shrink-0'
          : 'flex items-center justify-between gap-[1cqh] pt-[1.5cqh] shrink-0'
      }
    >
      <CircleGlassButton
        size="md"
        onClick={handleLockClick}
        aria-label="Khóa điện thoại (Chưa kích hoạt)"
        title="Khóa điện thoại (Tạm thời chưa bàn tới)"
        className="opacity-85"
      >
        <LockIcon className="w-[5.8cqh] h-[5.8cqh]" />
      </CircleGlassButton>

      <CircleGlassButton
        size="md"
        active={wellnessModeEnabled}
        activeVariant="rose"
        onClick={toggleWellnessMode}
        aria-label={`Chế độ sức khỏe AI ${wellnessModeEnabled ? 'đang bật' : 'đang tắt'}`}
        title="Bật/Tắt AI Chế độ Sức khỏe (Nhắc đứng dậy, nghỉ ngơi)"
      >
        <HeartPulseIcon className="w-[5.8cqh] h-[5.8cqh]" />
      </CircleGlassButton>

      <CircleGlassButton
        size="md"
        active={focusGuardEnabled}
        activeVariant="cyan"
        onClick={toggleFocusGuard}
        aria-label={`AI theo dõi tập trung ${focusGuardEnabled ? 'đang bật' : 'đang tắt'}`}
        title="Bật/Tắt AI Theo dõi Tập trung (Cảnh báo làm việc riêng)"
      >
        <FocusCameraIcon className="w-[5.8cqh] h-[5.8cqh]" />
      </CircleGlassButton>

      <CircleGlassButton
        size="md"
        onClick={() => setActiveModal('settings')}
        aria-label="Mở cài đặt"
        title="Cài đặt"
      >
        <SettingsGearIcon className="w-[5.8cqh] h-[5.8cqh]" />
      </CircleGlassButton>
    </div>
  );

  return (
    <motion.section
      {...(bindPinch() as any)}
      onPointerUp={handlePointerUp}
      animate={{ scale: pinchScale }}
      transition={iosSpringSnappy}
      style={{ touchAction: 'none' }}
      aria-label="Công việc cần làm và nút chức năng"
      className={`liquid-glass-card w-full h-full flex overflow-hidden ${
        isExpanded
          ? 'flex-row px-[3cqw] py-[5cqh] gap-4'
          : 'flex-col justify-between px-[2.1cqw] py-[4.8cqh]'
      }`}
    >
      {isExpanded ? (
        /* EXPANDED MODE: Full Todo List + Vertical Action Buttons on Right */
        <>
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            <div className="flex items-center justify-between gap-3 mb-[2.5cqh]">
              <div className="flex items-center gap-2.5">
                <h2 className="text-[3.8cqh] font-semibold tracking-[0.06em] uppercase text-white/90">
                  Công việc cần làm
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[2.6cqh] text-white/80 tabular-nums">
                  {todos.filter((t) => !t.completed).length} sắp tới
                </span>
              </div>

              <button
                type="button"
                data-no-expand="true"
                onClick={() => setExpandedTile(null)}
                aria-label="Thu nhỏ danh sách công việc"
                className="liquid-circle-btn w-[7.8cqh] h-[7.8cqh] flex items-center justify-center text-white/85 hover:text-white cursor-pointer"
              >
                <MinimizeIcon className="w-[3.4cqh] h-[3.4cqh]" />
              </button>
            </div>

            {/* Add Todo Form */}
            <form
              data-no-expand="true"
              onSubmit={handleAddSubmit}
              className="flex items-center gap-2 mb-[2.5cqh]"
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Thêm công việc mới..."
                className="flex-1 min-w-0 rounded-full bg-white/12 border border-white/20 px-4 py-[1.6cqh] text-[3.1cqh] text-white placeholder-white/50 focus:outline-none focus:border-sky-300/60"
              />
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                aria-label="Thời hạn công việc"
                className="rounded-full bg-white/12 border border-white/20 px-3 py-[1.6cqh] text-[3.1cqh] text-white tabular-nums focus:outline-none focus:border-sky-300/60"
              />
              <CircleGlassButton size="sm" type="submit" aria-label="Thêm công việc">
                <PlusIcon className="w-[3.6cqh] h-[3.6cqh]" />
              </CircleGlassButton>
            </form>

            {/* Scrollable Full Todo List */}
            <div
              data-no-expand="true"
              className="flex-1 overflow-y-auto glass-scroll divide-y divide-white/15 pr-2"
            >
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between gap-3 py-[2cqh]"
                >
                  <button
                    type="button"
                    onClick={() => toggleTodo(todo.id)}
                    className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
                  >
                    <span
                      className={`w-[4.6cqh] h-[4.6cqh] rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        todo.completed
                          ? 'bg-sky-400 border-sky-300 text-slate-950'
                          : 'border-white/40 bg-white/8 text-transparent'
                      }`}
                    >
                      <CheckIcon className="w-[2.8cqh] h-[2.8cqh]" />
                    </span>
                    <span
                      className={`text-[3.8cqh] truncate transition-opacity ${
                        todo.completed ? 'line-through text-white/45' : 'text-white'
                      }`}
                    >
                      {todo.title}
                    </span>
                  </button>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[3.4cqh] text-white/70 tabular-nums">{todo.time}</span>
                    <button
                      type="button"
                      onClick={() => deleteTodo(todo.id)}
                      aria-label={`Xoá ${todo.title}`}
                      className="w-[6cqh] h-[6cqh] rounded-full flex items-center justify-center text-white/45 hover:text-rose-300 hover:bg-rose-500/20 cursor-pointer transition-colors"
                    >
                      <TrashIcon className="w-[3.1cqh] h-[3.1cqh]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Vertical Dock */}
          {renderControlButtons(true)}
        </>
      ) : (
        /* COMPACT MODE: Max 3 Upcoming Todos + Horizontal 4 Circular Buttons */
        <>
          <div className="flex-1 flex flex-col min-h-0">
            <h2 className="text-[3.6cqh] font-normal tracking-[0.03em] uppercase text-white/90 mb-[2.2cqh] drop-shadow-[0_2px_6px_rgba(0,0,0,0.28)]">
              Công việc cần làm
            </h2>

            <div className="flex-1 flex flex-col justify-start divide-y divide-white/20">
              {upcomingThree.length === 0 ? (
                <div className="py-[3cqh] text-[3.4cqh] text-white/55">
                  Không còn công việc sắp tới
                </div>
              ) : (
                upcomingThree.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between gap-2 py-[2.2cqh]"
                  >
                    <span className="text-[4.1cqh] font-normal text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] truncate">
                      {todo.title}
                    </span>
                    <span className="text-[4.1cqh] font-normal text-white/75 tabular-nums shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
                      {todo.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {renderControlButtons(false)}
        </>
      )}
    </motion.section>
  );
};
