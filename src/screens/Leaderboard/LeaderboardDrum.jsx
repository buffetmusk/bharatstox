// Leaderboard drum picker — smooth 3D wheel.
// Architecture: pointer-event drag → translateY track → rotateX per-row.
// Key: perspective on a wrapper ABOVE overflow:hidden (fixes Firefox/Safari 3D bug).
import { useRef, useState, useLayoutEffect, useEffect, useMemo, useCallback } from 'react';
import { useHaptic } from '../../hooks/useHaptic';
import { ROW_H } from './constants';
import { DrumRow } from './DrumRow';
import { ActionBar } from './ActionBar';

function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

export function LeaderboardDrum({ sortedRows, rows, gainsRanked, sort, credits, onOpenTrader, onRequestUnlock, onOpenEarnCredits }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [drumH, setDrumH] = useState(0);

  const meIdx = useMemo(() => sortedRows.findIndex(r => r.isMe), [sortedRows]);

  // All mutable animation state — no re-renders during frames
  const S = useRef({
    offset: 0,        // current translateY of track (px)
    drumH: 0,
    activeIdx: meIdx,
    anim: null,       // RAF handle
    drag: null,       // { startY, startOffset, yList: [[y, ms], …] }
    isDragging: false,
  }).current;

  const containerRef = useRef(null); // overflow:hidden event target
  const trackRef    = useRef(null);  // translateY'd track
  const rowRefs     = useRef([]);
  const justDragged = useRef(false); // suppress click after drag

  const haptic = useHaptic();

  // ── Coordinate helpers ──────────────────────────────────────────────
  function rowToOffset(i, h) {
    return h / 2 - ROW_H / 2 - i * ROW_H;
  }

  function nearestRow(offset, h) {
    const center = h / 2 - offset;          // row-space center
    let best = 0, bestD = Infinity;
    for (let i = 0; i < sortedRows.length; i++) {
      const d = Math.abs(i * ROW_H + ROW_H / 2 - center);
      if (d < bestD) { bestD = d; best = i; }
    }
    return Math.max(0, Math.min(sortedRows.length - 1, best));
  }

  function rubberClamp(offset, h) {
    const min = rowToOffset(sortedRows.length - 1, h);
    const max = rowToOffset(0, h);
    if (offset > max) return max + (offset - max) * 0.28;
    if (offset < min) return min + (offset - min) * 0.28;
    return offset;
  }

  // ── DOM mutations (no React state — called every RAF frame) ─────────
  function applyTransforms(offset, h) {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateY(${offset}px)`;
    }
    const center = h / 2 - offset;          // position of "center" in track-local coords
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const rowMid = i * ROW_H + ROW_H / 2;
      const d  = (rowMid - center) / ROW_H; // signed distance in rows (positive = below center)
      const ad = Math.abs(d);
      const rot     = Math.max(-62, Math.min(62, d * 15));   // degrees
      const scale   = Math.max(0.74, 1 - ad * 0.062);
      const opacity = Math.max(0.18, 1 - ad * 0.18);
      const blur    = ad > 1.8 ? Math.min(2.5, (ad - 1.8) * 1.8) : 0;
      el.style.transform = `rotateX(${-rot}deg) scale(${scale})`;
      el.style.opacity   = String(opacity);
      el.style.filter    = blur ? `blur(${blur}px)` : '';
    });
  }

  function notifyActiveChange(newIdx) {
    if (newIdx !== S.activeIdx) {
      // One detent tick per row crossed. A fast flick or snap can jump
      // several indices between RAF frames — tick for each so every row
      // passing the center is felt, like a real iOS picker drum.
      const crossed = Math.abs(newIdx - S.activeIdx);
      S.activeIdx = newIdx;
      setActiveIdx(newIdx);
      for (let k = 0; k < crossed; k++) haptic(6);
    }
  }

  // ── Snap animation (easeOutQuart — no overshoot, iOS picker feel) ───
  function snapTo(targetIdx) {
    const target = rowToOffset(targetIdx, S.drumH);
    const start  = S.offset;
    const dist   = Math.abs(target - start);
    if (dist < 0.5) { applyTransforms(target, S.drumH); return; }

    // Duration scales with sqrt of distance in rows
    const duration = Math.min(520, Math.max(160, Math.sqrt(dist / ROW_H) * 185));
    const t0 = performance.now();

    if (S.anim) { cancelAnimationFrame(S.anim); S.anim = null; }

    const tick = (now) => {
      const t      = Math.min(1, (now - t0) / duration);
      const offset = start + (target - start) * easeOutQuart(t);
      S.offset = offset;
      applyTransforms(offset, S.drumH);
      notifyActiveChange(nearestRow(offset, S.drumH));
      if (t < 1) {
        S.anim = requestAnimationFrame(tick);
      } else {
        S.offset = target;
        S.anim   = null;
        applyTransforms(target, S.drumH);
        notifyActiveChange(targetIdx);
      }
    };
    S.anim = requestAnimationFrame(tick);
  }

  // ── Initialise once drum height is known ────────────────────────────
  useLayoutEffect(() => {
    if (!drumH) return;
    S.drumH  = drumH;
    S.offset = rowToOffset(meIdx, drumH);
    S.activeIdx = meIdx;
    setActiveIdx(meIdx);
    applyTransforms(S.offset, drumH);
  }, [drumH]);

  // ── Reset drum position when sort changes ────────────────────────────
  useEffect(() => {
    if (!S.drumH) return;
    if (S.anim) { cancelAnimationFrame(S.anim); S.anim = null; }
    S.offset = rowToOffset(meIdx, S.drumH);
    S.activeIdx = meIdx;
    setActiveIdx(meIdx);
    applyTransforms(S.offset, S.drumH);
  }, [sort, meIdx]);

  // ── Measure drum viewport ───────────────────────────────────────────
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      const h = e.contentRect.height;
      if (h > 0) setDrumH(h);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Pointer events ──────────────────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    if (S.anim) { cancelAnimationFrame(S.anim); S.anim = null; }
    S.isDragging = false;
    S.drag = { startY: e.clientY, startOffset: S.offset, yList: [[e.clientY, Date.now()]] };
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!S.drag) return;
    const dy = e.clientY - S.drag.startY;

    if (!S.isDragging) {
      if (Math.abs(dy) < 5) return;
      S.isDragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    // Track last 5 y/time samples for velocity
    const yl = S.drag.yList;
    yl.push([e.clientY, Date.now()]);
    if (yl.length > 5) yl.shift();

    const clamped = rubberClamp(S.drag.startOffset + dy, S.drumH);
    S.offset = clamped;
    applyTransforms(clamped, S.drumH);
    notifyActiveChange(nearestRow(clamped, S.drumH));
  }, []);

  const onPointerUp = useCallback((e) => {
    if (containerRef.current) containerRef.current.style.cursor = 'grab';
    if (!S.drag) return;

    const { yList }    = S.drag;
    const wasDragging  = S.isDragging;
    S.isDragging       = false;
    S.drag             = null;

    if (!wasDragging) return;

    justDragged.current = true;
    setTimeout(() => { justDragged.current = false; }, 50);

    let velocity = 0;
    if (yList.length >= 2) {
      const [y0, t0] = yList[yList.length - 2];
      const [y1, t1] = yList[yList.length - 1];
      const dt = Math.max(1, t1 - t0);
      velocity = ((y1 - y0) / ROW_H * 1000) / dt;
    }
    const v      = Math.sign(velocity) * Math.min(Math.abs(velocity), 28);
    const decel  = 30;
    const travel = (v * v) / (2 * decel) * Math.sign(v);
    const raw    = nearestRow(S.offset, S.drumH) - travel;
    const target = Math.max(0, Math.min(sortedRows.length - 1, Math.round(raw)));
    snapTo(target);
  }, [sortedRows.length]);

  // ── Mouse wheel (desktop) ───────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !drumH) return;
    let wheelTimer;
    const onWheel = (e) => {
      e.preventDefault();
      if (S.anim) { cancelAnimationFrame(S.anim); S.anim = null; }
      const clamped = rubberClamp(S.offset - e.deltaY * 0.65, S.drumH);
      S.offset = clamped;
      applyTransforms(clamped, S.drumH);
      notifyActiveChange(nearestRow(clamped, S.drumH));
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => snapTo(S.activeIdx), 160);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => { el.removeEventListener('wheel', onWheel); clearTimeout(wheelTimer); };
  }, [drumH]); // re-registers if drumH changes

  function scrollToRow(i) { snapTo(i); }

  const active        = sortedRows[activeIdx];
  const activeIsLocked = active?.locked;

  return (
    <>
      {/* perspective wrapper sets the 3D vanishing point; the overflow clip
          below it is a SEPARATE element to dodge the overflow/3D browser bug */}
      <div style={{ flex: 1, position: 'relative', perspective: '900px', perspectiveOrigin: '50% 50%' }}>

        {/* Overflow clip + pointer target (NO perspective here) */}
        <div
          ref={containerRef}
          style={{
            position: 'absolute', inset: 0,
            overflow: 'hidden',
            touchAction: 'none',
            cursor: 'grab',
            userSelect: 'none',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Center highlight band (flat 2D — above track in z) */}
          <div style={{
            position: 'absolute', left: 12, right: 12, zIndex: 2,
            top: '50%', height: ROW_H, transform: 'translateY(-50%)',
            borderRadius: 16,
            background: activeIsLocked ? 'var(--gold-soft)' : 'var(--accent-soft)',
            border: `1px solid ${activeIsLocked ? 'rgba(255,184,0,0.22)' : 'rgba(0,230,118,0.18)'}`,
            pointerEvents: 'none',
            transition: 'background 0.25s ease, border-color 0.25s ease',
          }} />

          {/* Top + bottom fade masks */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
            background: 'linear-gradient(180deg, var(--bg) 0%, transparent 25%, transparent 75%, var(--bg) 100%)',
          }} />

          {/* Track — only this element moves; preserve-3d passes perspective to row children */}
          <div
            ref={trackRef}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            {sortedRows.map((r, i) => (
              <div
                key={r.handle + '-' + sort}
                ref={el => rowRefs.current[i] = el}
                onClick={() => {
                  if (justDragged.current) return;
                  if (i === activeIdx) {
                    haptic(15);
                    if (r.isMe)      onOpenTrader('me');
                    else if (r.locked) onRequestUnlock(r);
                    else             onOpenTrader(r.handle);
                  } else {
                    scrollToRow(i);
                  }
                }}
                style={{
                  height: ROW_H,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  willChange: 'transform, opacity',
                  transformOrigin: '50% 50%',
                  cursor: 'pointer',
                }}
              >
                <DrumRow row={r} active={i === activeIdx} sortMode={sort} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '4px 16px 12px', position: 'relative', zIndex: 5 }}>
        <ActionBar
          row={active}
          credits={credits}
          sortMode={sort}
          rows={rows}
          gainsRanked={gainsRanked}
          onOpen={() => { haptic(15); onOpenTrader(active.isMe ? 'me' : active.handle); }}
          onUnlock={() => { haptic(20); onRequestUnlock(active); }}
          onOpenEarnCredits={onOpenEarnCredits}
        />
      </div>
    </>
  );
}
