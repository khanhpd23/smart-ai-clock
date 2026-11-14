import { create } from 'zustand';

export type TileId = 'clock' | 'timer' | 'hub';
export type ClockMode = 'digital' | 'analog';
export type WhiteNoisePreset = 'Mưa đêm' | 'Tiếng ồn trắng' | 'Sóng biển';
export type GlassOpacityLevel = 'clear' | 'balanced' | 'tinted';

export interface TodoItem {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export interface RecordingItem {
  id: string;
  title: string;
  createdAt: string;
  durationSec: number;
}

export interface ToastAlert {
  id: string;
  title: string;
  message: string;
  type: 'focus' | 'wellness' | 'info';
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  time: string;
}

interface AppState {
  // Layout & UI
  expandedTile: TileId | null;
  activeModal: 'settings' | null;
  toastAlert: ToastAlert | null;
  auroraIntensity: 'vivid' | 'subtle';
  glassOpacity: GlassOpacityLevel;
  setExpandedTile: (tile: TileId | null) => void;
  toggleExpandedTile: (tile: TileId) => void;
  setActiveModal: (modal: 'settings' | null) => void;
  setAuroraIntensity: (intensity: 'vivid' | 'subtle') => void;
  setGlassOpacity: (level: GlassOpacityLevel) => void;
  triggerToast: (toast: Omit<ToastAlert, 'id'>) => void;
  dismissToast: () => void;

  // Tile 1: Clock, Alarm, White Noise
  clockMode: ClockMode;
  alarmEnabled: boolean;
  alarmTime: string;
  whiteNoiseEnabled: boolean;
  whiteNoisePreset: WhiteNoisePreset;
  toggleClockMode: () => void;
  setClockMode: (mode: ClockMode) => void;
  toggleAlarm: () => void;
  setAlarmTime: (time: string) => void;
  toggleWhiteNoise: () => void;
  cycleWhiteNoisePreset: () => void;

  // Tile 2: Countdown & Voice Recorder
  timerDurationSec: number;
  timerRemainingSec: number;
  timerRunning: boolean;
  setTimerDurationSec: (sec: number) => void;
  setTimerByDeltaSeconds: (deltaSec: number) => void;
  toggleTimerRunning: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  isRecording: boolean;
  recordingSeconds: number;
  recordings: RecordingItem[];
  playingRecordingId: string | null;
  toggleRecording: () => void;
  tickRecording: () => void;
  togglePlayRecording: (id: string) => void;
  deleteRecording: (id: string) => void;

  // Tile 3: Todos & AI Controls
  todos: TodoItem[];
  addTodo: (title: string, time: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  wellnessModeEnabled: boolean;
  focusGuardEnabled: boolean;
  toggleWellnessMode: () => void;
  toggleFocusGuard: () => void;
  simulateFocusWarning: () => void;
  simulateWellnessReminder: () => void;

  // AI Assistant
  aiChatOpen: boolean;
  messages: ChatMessage[];
  setAiChatOpen: (open: boolean) => void;
  sendAiMessage: (prompt: string) => void;
}

const WHITE_NOISE_PRESETS: WhiteNoisePreset[] = ['Mưa đêm', 'Tiếng ồn trắng', 'Sóng biển'];

const formatNowTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const useAppStore = create<AppState>((set, get) => ({
  // Layout
  expandedTile: null,
  activeModal: null,
  toastAlert: null,
  auroraIntensity: 'vivid',
  glassOpacity: 'balanced',

  setExpandedTile: (tile) => set({ expandedTile: tile }),
  toggleExpandedTile: (tile) =>
    set((s) => ({ expandedTile: s.expandedTile === tile ? null : tile })),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setAuroraIntensity: (auroraIntensity) => set({ auroraIntensity }),
  setGlassOpacity: (glassOpacity) => set({ glassOpacity }),

  triggerToast: (toast) =>
    set({
      toastAlert: {
        ...toast,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      },
    }),
  dismissToast: () => set({ toastAlert: null }),

  // Tile 1
  clockMode: 'digital',
  alarmEnabled: false,
  alarmTime: '06:30',
  whiteNoiseEnabled: false,
  whiteNoisePreset: 'Mưa đêm',

  toggleClockMode: () =>
    set((s) => ({ clockMode: s.clockMode === 'digital' ? 'analog' : 'digital' })),
  setClockMode: (clockMode) => set({ clockMode }),

  toggleAlarm: () => {
    const next = !get().alarmEnabled;
    const alarmTime = get().alarmTime;
    set({ alarmEnabled: next });
    get().triggerToast({
      type: 'info',
      title: next ? `Báo thức đã bật (${alarmTime})` : 'Đã tắt báo thức',
      message: next
        ? 'Chuông báo thức iOS sẽ reo nhẹ nhàng đúng giờ hẹn.'
        : 'Không có lịch báo thức nào đang hoạt động.',
    });
  },

  setAlarmTime: (alarmTime) => set({ alarmTime }),

  toggleWhiteNoise: () => {
    const next = !get().whiteNoiseEnabled;
    const preset = get().whiteNoisePreset;
    set({ whiteNoiseEnabled: next });
    get().triggerToast({
      type: 'info',
      title: next ? `Tiếng ồn trắng: ${preset}` : 'Đã tắt tiếng ồn trắng',
      message: next
        ? 'Âm thanh nền thư giãn (mô phỏng UI MVP) đang phát.'
        : 'Đã dừng âm thanh nền.',
    });
  },

  cycleWhiteNoisePreset: () => {
    const current = get().whiteNoisePreset;
    const next =
      WHITE_NOISE_PRESETS[(WHITE_NOISE_PRESETS.indexOf(current) + 1) % WHITE_NOISE_PRESETS.length];
    set({ whiteNoisePreset: next, whiteNoiseEnabled: true });
    get().triggerToast({
      type: 'info',
      title: `Âm thanh: ${next}`,
      message: 'Chuyển chế độ âm thanh nền thành công.',
    });
  },

  // Tile 2
  timerDurationSec: 45 * 60,
  timerRemainingSec: 45 * 60,
  timerRunning: false,

  setTimerDurationSec: (sec) => {
    const clamped = Math.max(0, Math.min(99 * 3600, Math.round(sec)));
    set({
      timerDurationSec: clamped,
      timerRemainingSec: clamped,
      timerRunning: false,
    });
  },

  setTimerByDeltaSeconds: (deltaSec) => {
    set((s) => {
      const base = s.timerRunning ? s.timerRemainingSec : s.timerDurationSec;
      const next = Math.max(0, Math.min(99 * 3600, base + deltaSec));
      return {
        timerDurationSec: next,
        timerRemainingSec: next,
        timerRunning: false,
      };
    });
  },

  toggleTimerRunning: () => {
    const { timerRunning, timerRemainingSec } = get();
    if (!timerRunning && timerRemainingSec <= 0) {
      get().triggerToast({
        type: 'info',
        title: 'Chưa đặt thời gian',
        message: 'Xoay vòng tròn theo chiều kim đồng hồ để đặt thời gian đếm ngược.',
      });
      return;
    }
    set({ timerRunning: !timerRunning });
  },

  resetTimer: () =>
    set((s) => ({
      timerRunning: false,
      timerRemainingSec: s.timerDurationSec > 0 ? s.timerDurationSec : 45 * 60,
      timerDurationSec: s.timerDurationSec > 0 ? s.timerDurationSec : 45 * 60,
    })),

  tickTimer: () => {
    const { timerRunning, timerRemainingSec } = get();
    if (!timerRunning) return;
    if (timerRemainingSec <= 1) {
      set({ timerRunning: false, timerRemainingSec: 0 });
      get().triggerToast({
        type: 'info',
        title: 'Hết giờ đếm ngược',
        message: 'Phiên tập trung của bạn đã hoàn thành.',
      });
      return;
    }
    set({ timerRemainingSec: timerRemainingSec - 1 });
  },

  isRecording: false,
  recordingSeconds: 0,
  playingRecordingId: null,
  recordings: [
    {
      id: 'rec-1',
      title: 'Ghi chú ý tưởng dự án AI',
      createdAt: 'Hôm nay, 20:15',
      durationSec: 84,
    },
    {
      id: 'rec-2',
      title: 'Tóm tắt họp nhóm tối',
      createdAt: 'Hôm nay, 18:40',
      durationSec: 152,
    },
    {
      id: 'rec-3',
      title: 'Nhắc việc sáng mai',
      createdAt: 'Hôm qua, 22:10',
      durationSec: 46,
    },
  ],

  toggleRecording: () => {
    const { isRecording, recordingSeconds, recordings } = get();
    if (!isRecording) {
      set({ isRecording: true, recordingSeconds: 0 });
      get().triggerToast({
        type: 'info',
        title: 'Đang thu âm (MVP)',
        message: 'Chạm lại vào nút Micro để lưu bản ghi vào danh sách lịch sử.',
      });
    } else {
      const duration = Math.max(3, recordingSeconds);
      const newRec: RecordingItem = {
        id: `rec-${Date.now()}`,
        title: `Bản ghi nhanh #${recordings.length + 1}`,
        createdAt: `Hôm nay, ${formatNowTime()}`,
        durationSec: duration,
      };
      set({
        isRecording: false,
        recordingSeconds: 0,
        recordings: [newRec, ...recordings],
      });
      get().triggerToast({
        type: 'info',
        title: 'Đã lưu bản ghi âm',
        message: 'Phóng to Ô 2 (pinch hoặc double-tap) để xem lịch sử bản ghi.',
      });
    }
  },

  tickRecording: () =>
    set((s) => (s.isRecording ? { recordingSeconds: s.recordingSeconds + 1 } : s)),

  togglePlayRecording: (id) =>
    set((s) => ({
      playingRecordingId: s.playingRecordingId === id ? null : id,
    })),

  deleteRecording: (id) =>
    set((s) => ({
      recordings: s.recordings.filter((r) => r.id !== id),
      playingRecordingId: s.playingRecordingId === id ? null : s.playingRecordingId,
    })),

  // Tile 3
  todos: [
    { id: '1', title: 'Họp nhóm', time: '21:30', completed: false },
    { id: '2', title: 'Tập thể dục', time: '22:00', completed: false },
    { id: '3', title: 'Đọc sách', time: '22:30', completed: false },
    { id: '4', title: 'Chuẩn bị tài liệu sprint', time: '23:15', completed: false },
    { id: '5', title: 'Uống nước & giãn cơ', time: '20:45', completed: true },
  ],

  addTodo: (title, time) => {
    const clean = title.trim();
    if (!clean) return;
    set((s) => ({
      todos: [
        {
          id: `todo-${Date.now()}`,
          title: clean,
          time: time.trim() || formatNowTime(),
          completed: false,
        },
        ...s.todos,
      ],
    }));
  },

  toggleTodo: (id) =>
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),

  deleteTodo: (id) =>
    set((s) => ({
      todos: s.todos.filter((t) => t.id !== id),
    })),

  wellnessModeEnabled: false,
  focusGuardEnabled: false,

  toggleWellnessMode: () => {
    const next = !get().wellnessModeEnabled;
    set({ wellnessModeEnabled: next });
    get().triggerToast({
      type: 'wellness',
      title: next ? 'Chế độ Sức khỏe AI: Đã bật' : 'Chế độ Sức khỏe AI: Đã tắt',
      message: '',
    });
  },

  toggleFocusGuard: () => {
    const next = !get().focusGuardEnabled;
    set({ focusGuardEnabled: next });
    get().triggerToast({
      type: 'focus',
      title: next ? 'AI Theo dõi Tập trung: Đã bật' : 'AI Theo dõi Tập trung: Đã tắt',
      message: '',
    });
  },

  simulateFocusWarning: () => {
    set({ focusGuardEnabled: true });
    get().triggerToast({
      type: 'focus',
      title: 'Cảnh báo: Hãy tập trung vào công việc!',
      message: '',
    });
  },

  simulateWellnessReminder: () => {
    set({ wellnessModeEnabled: true });
    get().triggerToast({
      type: 'wellness',
      title: 'AI Sức khỏe: Hãy đứng dậy vươn vai & uống nước',
      message: '',
    });
  },

  // AI Assistant
  aiChatOpen: false,
  messages: [
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: 'Xin chào! Tôi là Trợ lý Đồng hồ AI. Bạn có thể bảo tôi đặt đếm ngược, thêm công việc hoặc bật chế độ Sức khỏe & Tập trung.',
      time: formatNowTime(),
    },
  ],

  setAiChatOpen: (aiChatOpen) => set({ aiChatOpen }),

  sendAiMessage: (prompt) => {
    const text = prompt.trim();
    if (!text) return;
    const now = formatNowTime();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      time: now,
    };

    const lower = text.toLowerCase();
    let reply = 'Tôi đã ghi nhận yêu cầu. Ở bản MVP, bạn có thể thử các lệnh nhanh như đặt đếm ngược, thêm việc, đổi đồng hồ cơ hoặc thử cảnh báo AI!';

    if (lower.includes('25 phút') || lower.includes('đếm ngược') || lower.includes('hẹn giờ')) {
      const match = lower.match(/(\d+)\s*(phút|p|giờ|h)/);
      let secs = 25 * 60;
      if (match) {
        const val = parseInt(match[1], 10);
        secs = match[2].startsWith('g') || match[2] === 'h' ? val * 3600 : val * 60;
      }
      get().setTimerDurationSec(secs);
      reply = `Đã đặt đồng hồ đếm ngược ${Math.round(secs / 60)} phút. Chạm "BẮT ĐẦU" ở Ô 2 khi bạn sẵn sàng.`;
    } else if (lower.includes('mất tập trung') || lower.includes('xao nhãng') || lower.includes('camera')) {
      get().simulateFocusWarning();
      reply = 'Đã kích hoạt AI Theo dõi Tập trung và phát thử cảnh báo khi làm việc riêng ở cạnh trên màn hình.';
    } else if (lower.includes('sức khỏe') || lower.includes('đứng dậy') || lower.includes('mệt')) {
      get().simulateWellnessReminder();
      reply = 'Đã bật Chế độ Sức khỏe AI và gửi thông báo nhắc đứng dậy giãn cơ.';
    } else if (lower.includes('đồng hồ cơ') || lower.includes('analog')) {
      set({ clockMode: 'analog' });
      reply = 'Đã chuyển Ô 1 sang chế độ Đồng hồ cơ với kim giây quét mượt.';
    } else if (lower.includes('điện tử') || lower.includes('digital')) {
      set({ clockMode: 'digital' });
      reply = 'Đã chuyển Ô 1 sang chế độ Đồng hồ điện tử.';
    } else if (lower.includes('thêm việc') || lower.includes('công việc')) {
      const timeMatch = text.match(/(\d{1,2}:\d{2})/);
      const timeStr = timeMatch ? timeMatch[1] : '23:00';
      const cleanedTitle = text
        .replace(/thêm việc[:\s]*/i, '')
        .replace(/lúc\s*\d{1,2}:\d{2}/i, '')
        .trim();
      const title = cleanedTitle || 'Ôn tập bài mới';
      get().addTodo(title, timeStr);
      reply = `Đã thêm "${title}" (${timeStr}) vào danh sách Công việc cần làm ở Ô 3.`;
    } else if (lower.includes('tiếng ồn') || lower.includes('mưa')) {
      if (!get().whiteNoiseEnabled) get().toggleWhiteNoise();
      reply = `Đã bật âm thanh nền (${get().whiteNoisePreset}) giúp bạn tập trung hơn.`;
    }

    const aiMsg: ChatMessage = {
      id: `a-${Date.now() + 1}`,
      role: 'assistant',
      text: reply,
      time: now,
    };

    set((s) => ({
      messages: [...s.messages, userMsg, aiMsg],
    }));
  },
}));
