import { useRef, useState } from 'react';
import { usePinch } from '@use-gesture/react';
import { useAppStore, type TileId } from '../store/useAppStore';

interface UseTileGestureOptions {
  tileId: TileId;
}

const INTERACTIVE_SELECTOR =
  'button, input, textarea, select, a, [data-no-expand="true"]';

export function useTileGesture({ tileId }: UseTileGestureOptions) {
  const expandedTile = useAppStore((s) => s.expandedTile);
  const setExpandedTile = useAppStore((s) => s.setExpandedTile);
  const toggleExpandedTile = useAppStore((s) => s.toggleExpandedTile);

  const [pinchScale, setPinchScale] = useState(1);
  const pinchHandledRef = useRef(false);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);

  const isExpanded = expandedTile === tileId;

  const bindPinch = usePinch(
    ({ active, first, offset: [scale], movement: [ms], velocity: [vs] }) => {
      if (first) {
        pinchHandledRef.current = false;
      }

      if (!active) {
        setPinchScale(1);
        return;
      }

      const currentScale = ms || scale || 1;
      const clampedPreview = Math.max(0.9, Math.min(1.12, currentScale));
      setPinchScale(clampedPreview);

      if (pinchHandledRef.current) return;

      // Pinch out -> Expand
      if (!isExpanded && (currentScale > 1.15 || (currentScale > 1.07 && vs > 0.18))) {
        pinchHandledRef.current = true;
        setPinchScale(1);
        setExpandedTile(tileId);
      }

      // Pinch in -> Collapse back to 3-tile grid
      if (isExpanded && (currentScale < 0.86 || (currentScale < 0.94 && vs > 0.18))) {
        pinchHandledRef.current = true;
        setPinchScale(1);
        setExpandedTile(null);
      }
    },
    {
      scaleBounds: { min: 0.7, max: 1.5 },
      from: () => [1, 0],
    }
  );

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    // Only single-finger / primary pointer triggers double-tap
    if (!e.isPrimary) return;

    const target = e.target as HTMLElement | null;
    if (target?.closest(INTERACTIVE_SELECTOR)) {
      lastTapRef.current = null;
      return;
    }

    const now = performance.now();
    const prev = lastTapRef.current;

    if (prev && now - prev.time < 300) {
      const dist = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);
      if (dist < 28) {
        lastTapRef.current = null;
        toggleExpandedTile(tileId);
        return;
      }
    }

    lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };
  };

  return {
    isExpanded,
    pinchScale,
    bindPinch,
    handlePointerUp,
  };
}
