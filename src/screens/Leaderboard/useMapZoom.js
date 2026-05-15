import { useRef, useState, useCallback, useEffect } from 'react';

// Pan + pinch + double-tap + button zoom for the heat-map stage.
//
// The transform lives on a wrapper <div> in screen-pixel space, so every
// gesture calculation stays in plain client coordinates — no SVG matrix
// juggling. Pan keeps the content covering the viewport (clamped); pinch and
// double-tap zoom keep the focal point pinned under the fingers.
const MIN_K = 1;
const MAX_K = 6;
const SPRING = 'transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)';
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_DIST = 30;

export function useMapZoom() {
  const containerRef = useRef(null);
  const size = useRef({ w: 1, h: 1 });
  const [view, setView] = useState({ k: 1, x: 0, y: 0, animated: false });
  const viewRef = useRef(view);
  viewRef.current = view;

  const pointers = useRef(new Map()); // pointerId -> { x, y }
  const gesture = useRef(null);       // { mode, ... }
  const lastTap = useRef({ t: 0, x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) size.current = { w: r.width, h: r.height };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clamp = (k, x, y) => {
    const kk = Math.max(MIN_K, Math.min(MAX_K, k));
    const { w, h } = size.current;
    return {
      k: kk,
      x: Math.min(0, Math.max(w * (1 - kk), x)),
      y: Math.min(0, Math.max(h * (1 - kk), y)),
    };
  };

  const apply = (k, x, y, animated) => setView({ ...clamp(k, x, y), animated });

  const local = (e) => {
    const r = containerRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  // Zoom to `nextK` while keeping the content point under `focus` (screen px) fixed.
  const zoomToward = (nextK, focus, animated) => {
    const v = viewRef.current;
    const k = Math.max(MIN_K, Math.min(MAX_K, nextK));
    const cx = (focus.x - v.x) / v.k;
    const cy = (focus.y - v.y) / v.k;
    apply(k, focus.x - k * cx, focus.y - k * cy, animated);
  };

  // Capture is deferred until a drag actually crosses the threshold — a pure
  // tap never captures, so `click` still reaches the SVG city nodes underneath.
  const onPointerDown = useCallback((e) => {
    const p = local(e);
    pointers.current.set(e.pointerId, p);

    if (pointers.current.size === 1) {
      const now = Date.now();
      const lt = lastTap.current;
      const isDoubleTap =
        now - lt.t < DOUBLE_TAP_MS &&
        Math.hypot(p.x - lt.x, p.y - lt.y) < DOUBLE_TAP_DIST;
      if (isDoubleTap) {
        lastTap.current = { t: 0, x: 0, y: 0 };
        gesture.current = null;
        zoomToward(viewRef.current.k < 2.3 ? 2.8 : 1, p, true);
      } else {
        lastTap.current = { t: now, x: p.x, y: p.y };
        gesture.current = { mode: 'pan', start: p, base: { ...viewRef.current }, active: false };
      }
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = {
        mode: 'pinch',
        base: { ...viewRef.current },
        d0: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        mid0: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
      // a two-finger gesture is unambiguous — capture both pointers immediately
      for (const id of pointers.current.keys()) {
        try { containerRef.current?.setPointerCapture?.(id); } catch (err) { /* ignore */ }
      }
    }
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, local(e));
    const g = gesture.current;
    if (!g) return;

    if (g.mode === 'pan' && pointers.current.size === 1) {
      const p = [...pointers.current.values()][0];
      const dx = p.x - g.start.x;
      const dy = p.y - g.start.y;
      if (!g.active) {
        if (Math.hypot(dx, dy) < 4) return; // still within tap tolerance
        g.active = true;
        try { containerRef.current?.setPointerCapture?.(e.pointerId); } catch (err) { /* ignore */ }
      }
      apply(g.base.k, g.base.x + dx, g.base.y + dy, false);
    } else if (g.mode === 'pinch' && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const k = Math.max(MIN_K, Math.min(MAX_K, g.base.k * (d / g.d0)));
      // content point under the original midpoint, pinned to the live midpoint
      const cx = (g.mid0.x - g.base.x) / g.base.k;
      const cy = (g.mid0.y - g.base.y) / g.base.k;
      apply(k, mid.x - k * cx, mid.y - k * cy, false);
    }
  }, []);

  const onPointerUp = useCallback((e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 1) {
      // pinch released down to one finger — re-baseline so panning doesn't jump
      const p = [...pointers.current.values()][0];
      gesture.current = { mode: 'pan', start: p, base: { ...viewRef.current }, active: true };
    } else if (pointers.current.size === 0) {
      gesture.current = null;
    }
  }, []);

  const zoomIn = useCallback(() => {
    const { w, h } = size.current;
    zoomToward(viewRef.current.k * 1.7, { x: w / 2, y: h / 2 }, true);
  }, []);
  const zoomOut = useCallback(() => {
    const { w, h } = size.current;
    zoomToward(viewRef.current.k / 1.7, { x: w / 2, y: h / 2 }, true);
  }, []);
  const reset = useCallback(() => apply(1, 0, 0, true), []);

  return {
    containerRef,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
    transition: view.animated ? SPRING : 'none',
    scale: view.k,
    zoomIn,
    zoomOut,
    reset,
  };
}
