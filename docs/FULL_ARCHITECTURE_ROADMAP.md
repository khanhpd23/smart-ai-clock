# Kiến trúc Đầy đủ & Lộ trình Nâng cấp (Post-MVP Roadmap)

> Tài liệu này lưu trữ bản thiết kế kiến trúc đầy đủ các tính năng thực tế (On-device AI Vision, LLM Agent, Web Audio Synthesizer, IndexedDB, PWA) để dùng khi nâng cấp từ bản **Giao diện Mẫu MVP** lên sản phẩm hoàn chỉnh.

---

## 1. Tech Stack Sản phẩm Hoàn chỉnh (Production)

| Tầng | Công nghệ | Vai trò |
| :--- | :--- | :--- |
| **Core UI** | React 19 + TypeScript + Vite | SPA/PWA chạy mượt ở chế độ StandBy để bàn. |
| **Animation & Physics** | Motion (`motion/react`) | `layoutId` morphing, spring physics chuẩn iOS. |
| **Gestures** | `@use-gesture/react` | Pinch-to-zoom 2 ngón, rotary dial `atan2` nhiều vòng, edge-snapping bubble. |
| **State & Offline DB** | Zustand + Dexie.js (IndexedDB) | Lưu bền vững file ghi âm (`Blob`), công việc, báo thức, lịch sử chat AI. |
| **On-Device AI Vision** | `@mediapipe/tasks-vision` | `FaceLandmarker` + `ObjectDetector` chạy cục bộ trên WebGL/WASM (không gửi video ra ngoài). |
| **Audio & Device APIs** | Web Audio API + MediaRecorder + Screen Wake Lock | Tổng hợp tiếng ồn trắng/hồng/mưa realtime, thu âm đa nền tảng (`mp4` iOS / `webm` Android), giữ sáng màn hình. |
| **PWA & Backend** | `vite-plugin-pwa` + Node/Hono Proxy | Fullscreen không thanh URL; proxy bảo mật API key cho LLM Agent. |

---

## 2. Kiến trúc các Tính năng Thực tế (Triển khai sau MVP)

### 2.1. Ô 1: Đồng hồ, Báo thức & Tiếng ồn trắng
- **Báo thức thật**: Lưu lịch báo thức vào IndexedDB, kiểm tra theo chu kỳ chính xác, phát âm thanh chime tổng hợp bằng Web Audio API + rung/notification.
- **Tiếng ồn trắng (Web Audio Synthesizer)**: Tự tạo White/Pink/Brown Noise & âm thanh mưa bằng `AudioWorklet` / `BiquadFilterNode` không cần tải file MP3 lớn, hỗ trợ fade-in/fade-out.

### 2.2. Ô 2: Đếm ngược & Ghi âm thật
- **Đếm ngược chuẩn thời gian thực**: Tính theo `targetTimestamp - Date.now()` để không bị trôi giây khi trình duyệt tiết kiệm pin hoặc chuyển tab.
- **Thu âm (`MediaRecorder API`)**: Tự nhận diện MIME type hỗ trợ (`audio/mp4` trên iOS Safari, `audio/webm` trên Android Chrome), lưu `Blob` vào Dexie.js, hiển thị waveform thật từ `AnalyserNode`, cho phép nghe lại và tóm tắt bằng AI.

### 2.3. Ô 3: Công việc & Hai Chế độ AI (Camera + Sức khỏe)
- **Camera — AI Theo dõi Tập trung (`FocusMonitorService`)**:
  - Mở camera trước qua `getUserMedia` ở tần suất thấp (`2–4 fps`).
  - Dùng `@mediapipe/tasks-vision` phát hiện góc quay đầu (rời mắt khỏi khu vực làm việc quá lâu), vắng mặt trước bàn khi đang đếm ngược, hoặc cầm điện thoại phụ (`cell phone`) → phát cảnh báo Liquid Glass + âm thanh nhắc.
- **Nhịp tim — AI Chế độ Sức khỏe (`WellnessService`)**:
  - Bộ đếm thời gian ngồi liên tục (20-20-20 nghỉ mắt, 45–60 phút nhắc đứng dậy/uống nước).
  - Nếu Camera đang bật, tái sử dụng blendshapes từ `FaceLandmarker` để phát hiện dấu hiệu buồn ngủ/nhấp mắt chậm/cúi cổ → nhắc nghỉ sớm hơn.
- **Khóa điện thoại (Lock)**: Tích hợp Standby Lock Overlay (giảm sáng tối đa, khóa chạm nhầm, mở bằng trượt/PIN) hoặc Apple Shortcuts trigger (tuỳ nền tảng).

### 2.4. Trợ lý AI Agent (Function Calling)
- Thay `MockAgentProvider` bằng Gemini / OpenAI streaming API thông qua proxy backend.
- Hỗ trợ Tool Calling điều khiển trực tiếp store của ứng dụng:
  - `setTimer(hours, minutes)`
  - `toggleWhiteNoise(preset)`
  - `addTodo(title, deadline)`
  - `toggleFocusGuard(enabled)` / `toggleWellnessMode(enabled)`
  - `summarizeRecording(recordingId)`

---

## 3. Cấu trúc Tầng Service Mở rộng về sau

```text
src/services/
├── audio/        # WebAudio White/Pink/Rain synthesizer + Alarm chime
├── recorder/     # MediaRecorder wrapper (iOS mp4 / Android webm) + Dexie Blob storage
├── vision/       # IFocusVisionProvider -> MediaPipe FaceLandmarker & ObjectDetector
├── wellness/     # WellnessScheduler (nhắc đứng dậy, nghỉ mắt, chống mệt mỏi)
└── agent/        # IAgentProvider -> Gemini / OpenAI Streaming + Tool Calling
```
