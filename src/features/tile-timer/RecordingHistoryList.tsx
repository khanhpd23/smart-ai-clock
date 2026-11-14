import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { iosSpringSnappy } from '../../styles/motion';
import { PauseIcon, PlayIcon, TrashIcon } from '../../components/ui/SFIcons';

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const RecordingHistoryList: React.FC = () => {
  const recordings = useAppStore((s) => s.recordings);
  const playingRecordingId = useAppStore((s) => s.playingRecordingId);
  const togglePlayRecording = useAppStore((s) => s.togglePlayRecording);
  const deleteRecording = useAppStore((s) => s.deleteRecording);

  const [playProgress, setPlayProgress] = useState(0);

  useEffect(() => {
    setPlayProgress(0);
    if (!playingRecordingId) return;
    const item = recordings.find((r) => r.id === playingRecordingId);
    if (!item) return;

    const interval = setInterval(() => {
      setPlayProgress((prev) => {
        if (prev >= 100) {
          togglePlayRecording(playingRecordingId);
          return 0;
        }
        return prev + 100 / Math.max(4, item.durationSec / 2);
      });
    }, 250);

    return () => clearInterval(interval);
  }, [playingRecordingId, recordings, togglePlayRecording]);

  return (
    <div
      data-no-expand="true"
      className="h-full flex flex-col rounded-[3.6cqh] bg-white/[0.06] border border-white/14 p-[2.8cqh] overflow-hidden"
    >
      <div className="flex items-center justify-between mb-[2cqh] px-1">
        <h3 className="text-[2.9cqh] font-semibold uppercase tracking-[0.07em] text-white/75">
          Lịch sử ghi âm
        </h3>
        <span className="text-[2.5cqh] text-white/55 tabular-nums">
          {recordings.length} bản
        </span>
      </div>

      <div className="flex-1 overflow-y-auto glass-scroll space-y-2 pr-1">
        {recordings.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-white/45 text-center px-3">
            Chưa có bản ghi âm nào. Bấm nút Micro bên phải để tạo bản ghi mẫu.
          </div>
        ) : (
          recordings.map((rec) => {
            const isPlaying = playingRecordingId === rec.id;
            return (
              <motion.div
                layout
                key={rec.id}
                transition={iosSpringSnappy}
                className={`group rounded-xl px-3 py-2.5 border transition-colors ${
                  isPlaying
                    ? 'bg-sky-500/15 border-sky-300/35'
                    : 'bg-white/[0.04] border-white/8 hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => togglePlayRecording(rec.id)}
                    aria-label={isPlaying ? `Tạm dừng ${rec.title}` : `Phát ${rec.title}`}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                      isPlaying
                        ? 'bg-sky-400 text-slate-950'
                        : 'bg-white/12 text-white hover:bg-white/20'
                    }`}
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-3.5 h-3.5" />
                    ) : (
                      <PlayIcon className="w-3.5 h-3.5 ml-0.5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="text-[3.1cqh] font-medium text-white/95 truncate">{rec.title}</p>
                    <div className="flex items-center justify-between text-[2.3cqh] text-white/55 mt-0.5 tabular-nums">
                      <span>{rec.createdAt}</span>
                      <span>{formatDuration(rec.durationSec)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteRecording(rec.id)}
                    aria-label={`Xoá ${rec.title}`}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-rose-300 hover:bg-rose-500/15 cursor-pointer transition-colors shrink-0"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isPlaying && (
                  <div className="mt-2 h-1 w-full rounded-full bg-white/12 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-300 to-fuchsia-400 transition-all duration-200"
                      style={{ width: `${Math.min(100, playProgress)}%` }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
