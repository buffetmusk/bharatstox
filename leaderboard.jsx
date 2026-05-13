// leaderboard.jsx — smooth 3D drum picker
// Architecture: pointer-event drag → translateY track → rotateX per-row
// Key: perspective on a wrapper ABOVE overflow:hidden (fixes Firefox/Safari 3D bug)
/* global React */
const { useRef, useState, useLayoutEffect, useEffect, useMemo, useCallback } = React;

const ROW_H = 56;

function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

function Leaderboard({ rows, me, credits, onOpenTrader, onSpendCredits, onTabBar, onOpenCreditLog, onOpenEarnCredits, sort = 'value', onChangeSort }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [drumH, setDrumH] = useState(0);
  const [confirmRow, setConfirmRow] = useState(null);

  // Sort rows and find me-index in sorted order
  const sortedRows = useMemo(() => {
    if (sort === 'gains') {
      return [...rows].sort((a, b) => b.allGainPct - a.allGainPct);
    }
    return rows; // already sorted by portfolio value desc
  }, [rows, sort]);

  const meIdx = useMemo(() => sortedRows.findIndex(r => r.isMe), [sortedRows]);
  const gainsRanked = useMemo(() => [...rows].sort((a, b) => b.allGainPct - a.allGainPct), [rows]);

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
    for (let i = 0; i < rows.length; i++) {
      const d = Math.abs(i * ROW_H + ROW_H / 2 - center);
      if (d < bestD) { bestD = d; best = i; }
    }
    return Math.max(0, Math.min(rows.length - 1, best));
  }

  function rubberClamp(offset, h) {
    const min = rowToOffset(rows.length - 1, h);
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
      S.activeIdx = newIdx;
      setActiveIdx(newIdx);
      haptic(6);
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>

      {/* Header */}
      <div style={{ padding: '0 20px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>Leaderboard</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-mute)', marginTop: 3 }}>
            You stand at{' '}
            <span className="tnum" style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>
              #{(sort === 'gains' ? me.gainsRank : me.rank).toLocaleString('en-IN')}
            </span>
            {' '}out of{' '}
            <span style={{ fontWeight: 600, color: 'var(--text-dim)' }}>7,700</span>
          </div>
        </div>
        <CreditsPill value={credits} onClick={onOpenCreditLog} />
      </div>

      {/* Value / Gains sort toggle */}
      <div style={{ padding: '6px 20px 8px' }}>
        <Segmented
          value={sort}
          onChange={v => onChangeSort && onChangeSort(v)}
          options={[{ value: 'value', label: 'By Value' }, { value: 'gains', label: 'By Gains' }]}
        />
      </div>

      {/*
        ┌─ perspective wrapper ─────────────────────────────────────────┐
        │  perspective: 900px  (sets 3D vanishing point)               │
        │  ┌─ overflow clip + event target ───────────────────────────┐ │
        │  │  overflow: hidden  (clips rows — MUST be separate from   │ │
        │  │  perspective to avoid the overflow/3D browser bug)       │ │
        │  │  ┌─ track (translateY) ──────────────────────────────┐   │ │
        │  │  │  transformStyle: preserve-3d  (passes perspective  │   │ │
        │  │  │  down to row children)                             │   │ │
        │  │  │  ┌─ row div (rotateX + scale) ──────────────────┐ │   │ │
        │  │  │  │  JS-mutated style.transform on every frame   │ │   │ │
        │  │  │  └──────────────────────────────────────────────┘ │   │ │
        │  │  └───────────────────────────────────────────────────┘   │ │
        │  └───────────────────────────────────────────────────────────┘ │
        └───────────────────────────────────────────────────────────────┘
      */}
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
                    else if (r.locked) setConfirmRow(r);
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

      {/* Unlock confirmation sheet */}
      {confirmRow && (
        <UnlockSheet
          row={confirmRow}
          credits={credits}
          onConfirm={() => { setConfirmRow(null); onSpendCredits(confirmRow); }}
          onCancel={() => setConfirmRow(null)}
          onEarn={onOpenEarnCredits}
        />
      )}

      {/* Bottom CTA */}
      <div style={{ padding: '4px 16px 12px', position: 'relative', zIndex: 5 }}>
        <ActionBar
          row={active}
          credits={credits}
          sortMode={sort}
          rows={rows}
          gainsRanked={gainsRanked}
          onOpen={() => { haptic(15); onOpenTrader(active.isMe ? 'me' : active.handle); }}
          onUnlock={() => { haptic(20); setConfirmRow(active); }}
          onOpenEarnCredits={onOpenEarnCredits}
        />
      </div>
    </div>
  );
}

// ─── A single drum row ──────────────────────────────────────────────
function DrumRow({ row, active, sortMode = 'value' }) {
  const fmt    = window.BS.fmt;
  const locked = row.locked;
  const me     = row.isMe;
  const isGains = sortMode === 'gains';

  return (
    <div style={{
      width: 'calc(100% - 24px)', maxWidth: 360,
      height: ROW_H - 4,
      borderRadius: 14,
      display: 'flex', alignItems: 'center',
      padding: '0 14px', gap: 10,
      background: me && active ? 'var(--surface)' : 'transparent',
      border: me
        ? `1px solid ${active ? 'var(--accent)' : 'var(--border-strong)'}`
        : '1px solid transparent',
      boxShadow: me && active ? 'var(--shadow-card)' : 'none',
      transition: 'background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
    }}>
      <Avatar initial={row.avatar.initial} tone={row.avatar.tone} size={28} ring={me} />

      {/* Handle */}
      <div style={{
        flex: 1, minWidth: 0,
        fontSize: 14, fontWeight: 500, color: 'var(--text)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {me
          ? <span><span style={{ color: 'var(--text-mute)' }}>You · </span>{row.handle}</span>
          : row.handle}
      </div>

      {/* Primary value — always visible, muted when locked to entice unlock */}
      {isGains ? (
        <div className="tnum" style={{
          fontSize: 15, fontWeight: 700, letterSpacing: -0.3,
          color: locked
            ? (row.allGainPct >= 0 ? 'var(--accent)' : 'var(--loss)')
            : (row.allGainPct >= 0 ? 'var(--accent)' : 'var(--loss)'),
          opacity: locked ? 0.55 : 1,
          minWidth: 62, textAlign: 'right',
        }}>
          +{row.allGainPct.toFixed(1)}%
        </div>
      ) : (
        <div className="tnum" style={{
          fontSize: 15, fontWeight: 600, letterSpacing: -0.3,
          color: 'var(--text)',
          opacity: locked ? 0.5 : 1,
          minWidth: 76, textAlign: 'right',
        }}>
          ₹{fmt.inrCompact(row.portfolio)}
        </div>
      )}

      {/* Lock badge + cost */}
      {locked && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          background: 'var(--gold-soft)', borderRadius: 999,
          height: 22, padding: '0 7px 0 5px', flexShrink: 0,
        }}>
          <Icon name="lock" size={9} color="var(--gold)" />
          <span className="tnum" style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--gold)', letterSpacing: -0.1 }}>
            {row.unlockCost}◎
          </span>
        </div>
      )}

      {/* Secondary metric for unlocked rows */}
      {!locked && !me && (
        <div className="tnum" style={{
          fontSize: 11, flexShrink: 0, minWidth: 40, textAlign: 'right',
          color: row.day >= 0 ? 'var(--accent)' : 'var(--loss)',
        }}>
          {isGains ? `₹${fmt.inrCompact(row.portfolio)}` : (row.day >= 0 ? '+' : '') + row.day.toFixed(1) + '%'}
        </div>
      )}

      {/* "You" badge */}
      {me && !locked && (
        <span style={{ fontSize: 9.5, letterSpacing: 0.8, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', flexShrink: 0 }}>
          You
        </span>
      )}
    </div>
  );
}

// ─── Bracket pill ────────────────────────────────────────────────────
function BracketPill({ label, value }) {
  return (
    <div style={{
      flex: 1, borderRadius: 12,
      border: '1px solid var(--hairline)',
      background: 'var(--surface)',
      padding: '8px 12px',
      display: 'flex', flexDirection: 'column',
    }}>
      <span style={{ fontSize: 10, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
      <span className="tnum" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>{value}</span>
    </div>
  );
}

// ─── Bottom action bar ───────────────────────────────────────────────
function ActionBar({ row, credits, onOpen, onUnlock, sortMode = 'value', rows, gainsRanked, onOpenEarnCredits }) {
  const fmt = window.BS.fmt;
  if (!row) return null;
  const { locked, isMe: me } = row;
  const isGains = sortMode === 'gains';
  const valueRank = rows ? rows.findIndex(r => r.handle === row.handle) + 1 : null;
  const gainsRank = gainsRanked ? gainsRanked.findIndex(r => r.handle === row.handle) + 1 : null;
  const needed = locked ? row.unlockCost - credits : 0;

  const baseBtn = {
    width: '100%', height: 56, borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 18px', cursor: 'pointer', fontFamily: 'inherit',
    transition: 'transform 0.1s ease',
  };
  const press = (e) => e.currentTarget.style.transform = 'scale(0.99)';
  const lift  = (e) => e.currentTarget.style.transform = 'scale(1)';

  if (me) {
    return (
      <button onClick={onOpen} onMouseDown={press} onMouseUp={lift} onMouseLeave={lift}
        style={{ ...baseBtn, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Your portfolio</span>
          <span style={{ fontSize: 15, fontWeight: 600, marginTop: 1 }}>Open detail</span>
        </div>
        <Icon name="chevron-r" size={18} color="var(--text-mute)" />
      </button>
    );
  }

  if (locked) {
    const enough = credits >= row.unlockCost;
    return (
      <div>
        <button onClick={enough ? onUnlock : undefined} onMouseDown={enough ? press : null} onMouseUp={lift} onMouseLeave={lift}
          style={{
            ...baseBtn,
            background: enough ? 'var(--accent)' : 'var(--elevated)',
            border: enough ? '0' : '1px solid var(--border)',
            color: enough ? '#04140C' : 'var(--text-dim)',
            cursor: enough ? 'pointer' : 'not-allowed',
          }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              {enough ? 'Unlock to view' : 'Not enough credits'}
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, marginTop: 1 }}>
              {row.handle} · ₹{fmt.inrCompact(row.portfolio)}
            </span>
          </div>
          <span style={{
            height: 36, padding: '0 12px', borderRadius: 999,
            background: enough ? 'rgba(0,0,0,0.18)' : 'var(--gold-soft)',
            color: enough ? '#04140C' : 'var(--gold)',
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 13, fontWeight: 700,
          }}>
            <span style={{
              width: 14, height: 14, borderRadius: 999,
              background: enough ? '#04140C' : 'var(--gold)',
              color: enough ? 'var(--accent)' : '#0B0B0C',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 800,
            }}>◎</span>
            {row.unlockCost}
          </span>
        </button>
        {!enough && onOpenEarnCredits && (
          <button onClick={onOpenEarnCredits} style={{
            display: 'block', width: '100%', marginTop: 6,
            background: 'none', border: 'none', padding: '2px 0',
            color: 'var(--text-mute)', fontSize: 11.5, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
          }}>
            Need {needed} more ◎ · <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Earn credits</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <button onClick={onOpen} onMouseDown={press} onMouseUp={lift} onMouseLeave={lift}
      style={{ ...baseBtn, background: 'var(--accent)', border: 0, color: '#04140C' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.4 }}>View portfolio</span>
        <span style={{ fontSize: 15, fontWeight: 700, marginTop: 1 }}>
          {row.handle} ·{' '}
          {isGains
            ? `+${row.allGainPct.toFixed(1)}% all-time`
            : `₹${fmt.inrCompact(row.portfolio)}`}
        </span>
        {valueRank && gainsRank && (
          <span className="tnum" style={{ fontSize: 11, opacity: 0.65, marginTop: 2 }}>
            Value #{valueRank} · Gains #{gainsRank}
          </span>
        )}
      </div>
      <Icon name="chevron-r" size={18} color="#04140C" />
    </button>
  );
}

// ─── Unlock confirmation bottom sheet ───────────────────────────────
function UnlockSheet({ row, credits, onConfirm, onCancel, onEarn }) {
  const fmt    = window.BS.fmt;
  const enough = credits >= row.unlockCost;
  const needed = row.unlockCost - credits;
  const haptic = useHaptic();

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onCancel}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'var(--bg)',
          borderRadius: '24px 24px 0 0',
          padding: '8px 20px 32px',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--hairline)', margin: '0 auto 20px' }} />

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <Avatar initial={row.avatar.initial} tone={row.avatar.tone} size={48} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4 }}>{row.handle}</div>
            <div style={{ fontSize: 13, color: 'var(--text-mute)', marginTop: 2 }}>
              ₹{fmt.inrCompact(row.portfolio)} portfolio · +{row.allGainPct.toFixed(1)}% all-time
            </div>
          </div>
        </div>

        {/* What they get */}
        <div style={{
          background: 'var(--surface)', borderRadius: 16,
          border: '1px solid var(--hairline)',
          padding: '14px 16px', marginBottom: 20,
        }}>
          {[
            'Full holdings breakdown',
            'Sector allocation vs smart money',
            'Entry / exit timing analysis',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
              <Icon name="check" size={14} color="var(--accent)" />
              <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Cost line */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '0 2px' }}>
          <span style={{ fontSize: 13, color: 'var(--text-mute)' }}>Your balance after unlock</span>
          <span className="tnum" style={{ fontSize: 14, fontWeight: 700, color: enough ? 'var(--text)' : '#EF4444' }}>
            {enough ? `${credits - row.unlockCost} ◎` : `–${needed} ◎ short`}
          </span>
        </div>

        {/* Buttons */}
        {enough ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onCancel} style={{
              flex: 1, height: 52, borderRadius: 16, border: '1px solid var(--border)',
              background: 'var(--surface)', color: 'var(--text-dim)',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}>Cancel</button>
            <button onClick={() => { haptic(25); onConfirm(); }} style={{
              flex: 2, height: 52, borderRadius: 16, border: 'none',
              background: 'var(--accent)', color: '#04140C',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              Unlock · {row.unlockCost} ◎
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onCancel} style={{
              flex: 1, height: 52, borderRadius: 16, border: '1px solid var(--border)',
              background: 'var(--surface)', color: 'var(--text-dim)',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}>Cancel</button>
            <button onClick={() => { onCancel(); onEarn && onEarn(); }} style={{
              flex: 2, height: 52, borderRadius: 16, border: 'none',
              background: 'var(--gold-soft)', color: 'var(--gold)',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              border: '1px solid rgba(255,184,0,0.3)',
            }}>
              Earn {needed} more ◎
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

window.Leaderboard = Leaderboard;
