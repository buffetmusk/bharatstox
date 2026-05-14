// components.jsx — shared UI primitives for BharatStox
/* global React */
const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;

const fmt = window.BS.fmt;

// ─── Procedural avatar ─────────────────────────────────────
// Deterministic, faux-3D SVG avatar generated from a seed string (the user's
// handle). Same seed → same avatar, always. Fully offline, no external service.
const AV_PALETTES = [
  { disc: ['#1b4a36', '#081f15'], body: ['#7CFFC4', '#00B25A'] },
  { disc: ['#4a3a12', '#1f1808'], body: ['#FFE08A', '#E09A00'] },
  { disc: ['#4a1f28', '#1f0c11'], body: ['#FFB3C0', '#E84B6B'] },
  { disc: ['#163b5c', '#0a1c2e'], body: ['#A9DBFF', '#3B8FE0'] },
  { disc: ['#3a2a5c', '#180f2e'], body: ['#D9C2FF', '#9A6BE0'] },
  { disc: ['#4a3010', '#1f1408'], body: ['#FFCB8A', '#E07B2B'] },
  { disc: ['#0f3f3c', '#06201e'], body: ['#9DEDE3', '#2BB9A8'] },
  { disc: ['#4a2418', '#1f0f0a'], body: ['#FFC2A6', '#E86A3B'] },
];
const AV_PUPIL = '#1b1b22';

function hashSeed(seed) {
  let h = 2166136261;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function avatarTraits(seed) {
  const h = hashSeed(seed || 'anon');
  return {
    h,
    palette: AV_PALETTES[h % AV_PALETTES.length],
    body: (h >> 4) % 5,
    eyes: (h >> 8) % 5,
    mouth: (h >> 12) % 4,
    accent: (h >> 16) % 4,
    rot: ((h >> 20) % 7) - 3, // slight -3..3° tilt for character
  };
}

function avBody(idx) {
  switch (idx) {
    case 0: return <circle cx="50" cy="54" r="29" />;
    case 1: return <rect x="22" y="26" width="56" height="56" rx="20" />;
    case 2: return <path d="M50 24C70 24 80 38 80 55C80 73 66 82 50 82C34 82 20 73 20 55C20 38 30 24 50 24Z" />;
    case 3: return <polygon points="50,24 76,39 76,69 50,84 24,69 24,39" />;
    default: return <path d="M24 31Q24 26 29 26L71 26Q76 26 76 31L76 56Q76 76 50 84Q24 76 24 56Z" />;
  }
}

function avEyes(idx) {
  const p = AV_PUPIL;
  switch (idx) {
    case 0: return <g fill={p}><circle cx="40" cy="48" r="4.5" /><circle cx="60" cy="48" r="4.5" /></g>;
    case 1: return <g><ellipse cx="40" cy="48" rx="5" ry="6.5" fill="#fff" /><ellipse cx="60" cy="48" rx="5" ry="6.5" fill="#fff" /><circle cx="40" cy="49" r="2.6" fill={p} /><circle cx="60" cy="49" r="2.6" fill={p} /></g>;
    case 2: return <g fill="none" stroke={p} strokeWidth="2.6" strokeLinecap="round"><path d="M34 48Q40 53 46 48" /><path d="M54 48Q60 53 66 48" /></g>;
    case 3: return <g><circle cx="40" cy="48" r="5.5" fill="#fff" stroke={p} strokeWidth="1.6" /><circle cx="60" cy="48" r="5.5" fill="#fff" stroke={p} strokeWidth="1.6" /><circle cx="40" cy="48" r="2.2" fill={p} /><circle cx="60" cy="48" r="2.2" fill={p} /></g>;
    default: return <g><circle cx="50" cy="48" r="11" fill="#fff" /><circle cx="50" cy="48" r="4.8" fill={p} /></g>;
  }
}

function avMouth(idx) {
  const p = AV_PUPIL;
  switch (idx) {
    case 0: return <path d="M42 64Q50 72 58 64" fill="none" stroke={p} strokeWidth="2.6" strokeLinecap="round" />;
    case 1: return <line x1="44" y1="66" x2="56" y2="66" stroke={p} strokeWidth="2.6" strokeLinecap="round" />;
    case 2: return <ellipse cx="50" cy="66" rx="4" ry="5" fill={p} />;
    default: return <path d="M43 66Q51 70 58 63" fill="none" stroke={p} strokeWidth="2.6" strokeLinecap="round" />;
  }
}

function avAccent(idx, bodyDark) {
  switch (idx) {
    case 1: return <g><circle cx="74" cy="27" r="7.5" fill="#FFB800" stroke="rgba(0,0,0,.25)" strokeWidth="1.2" /><path d="M74 23.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.2 3.1-.4z" fill="#fff" /></g>;
    case 2: return <g><line x1="50" y1="25" x2="50" y2="13" stroke={bodyDark} strokeWidth="2.6" strokeLinecap="round" /><circle cx="50" cy="11" r="3.6" fill={bodyDark} /></g>;
    case 3: return <g fill="#FF7A9C" opacity="0.55"><ellipse cx="33" cy="59" rx="5" ry="3" /><ellipse cx="67" cy="59" rx="5" ry="3" /></g>;
    default: return null;
  }
}

function Avatar({ seed = 'anon', size = 32, ring = false }) {
  const t = avatarTraits(seed);
  const uid = 'av' + t.h.toString(36);
  const [bL, bD] = t.palette.body;
  const [dL, dD] = t.palette.disc;
  return (
    <div className="bs-avatar"
         style={{
           width: size, height: size, borderRadius: 999, overflow: 'hidden',
           boxShadow: ring ? `0 0 0 2px var(--bg), 0 0 0 3.5px ${bD}` : 'none',
         }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <defs>
          <radialGradient id={uid + 'd'} cx="0.32" cy="0.28" r="0.95">
            <stop offset="0%" stopColor={dL} />
            <stop offset="100%" stopColor={dD} />
          </radialGradient>
          <linearGradient id={uid + 'b'} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bL} />
            <stop offset="100%" stopColor={bD} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#${uid}d)`} />
        <ellipse cx="50" cy="86" rx="23" ry="5.5" fill="rgba(0,0,0,0.28)" />
        <g transform={`rotate(${t.rot} 50 54)`}>
          <g fill={`url(#${uid}b)`} stroke="rgba(0,0,0,0.22)" strokeWidth="1.5">
            {avBody(t.body)}
          </g>
          {avEyes(t.eyes)}
          {avMouth(t.mouth)}
          {avAccent(t.accent, bD)}
        </g>
        <ellipse cx="37" cy="31" rx="27" ry="16" fill="#fff" opacity="0.16" />
      </svg>
    </div>
  );
}

// ─── Icon set (line / 1.6sw / round) ───────────────────────
function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.6 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'back':       return <svg {...props}><path d="M15 18l-6-6 6-6"/></svg>;
    case 'forward':    return <svg {...props}><path d="M9 18l6-6-6-6"/></svg>;
    case 'close':      return <svg {...props}><path d="M18 6L6 18M6 6l12 12"/></svg>;
    case 'bell':       return <svg {...props}><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 004 0"/></svg>;
    case 'plus':       return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'check':      return <svg {...props}><path d="M5 12l5 5L20 7"/></svg>;
    case 'lock':       return <svg {...props}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>;
    case 'unlock':     return <svg {...props}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0"/></svg>;
    case 'spark':      return <svg {...props}><path d="M12 3l2.2 5.6L20 10l-4.5 3.5L17 20l-5-3-5 3 1.5-6.5L4 10l5.8-1.4L12 3z"/></svg>;
    case 'gear':       return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.5-2.4.9a7 7 0 00-2-1.2L14 3h-4l-.5 2.5a7 7 0 00-2 1.2L5 5.8 3 9.3l2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-.9a7 7 0 002 1.2L10 21h4l.5-2.5a7 7 0 002-1.2l2.4.9 2-3.5-2-1.5c0-.4.1-.8.1-1.2z"/></svg>;
    case 'user':       return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>;
    case 'leaderboard':return <svg {...props}><path d="M4 21V11M12 21V4M20 21v-7"/></svg>;
    case 'gift':       return <svg {...props}><rect x="4" y="9" width="16" height="12" rx="2"/><path d="M4 14h16M12 9v12M9 9a3 3 0 010-6c2 0 3 3 3 6 0-3 1-6 3-6a3 3 0 010 6"/></svg>;
    case 'copy':       return <svg {...props}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/></svg>;
    case 'share':      return <svg {...props}><path d="M12 3v13M12 3l-4 4M12 3l4 4"/><path d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"/></svg>;
    case 'qr':         return <svg {...props}><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><path d="M14 14h2v2M18 14v6M14 18h2"/></svg>;
    case 'sun':        return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>;
    case 'moon':       return <svg {...props}><path d="M21 13a8 8 0 01-10-10 8 8 0 1010 10z"/></svg>;
    case 'paper':      return <svg {...props}><path d="M6 3h9l5 5v13a0 0 0 010 0H6a0 0 0 010 0V3z"/><path d="M15 3v5h5"/></svg>;
    case 'logout':     return <svg {...props}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>;
    case 'chevron-r':  return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>;
    case 'arrow-up':   return <svg {...props}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case 'arrow-dn':   return <svg {...props}><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
    case 'haptic':     return <svg {...props}><circle cx="12" cy="12" r="2.5"/><path d="M7.8 7.8a6 6 0 000 8.4M16.2 16.2a6 6 0 000-8.4M5 5a10 10 0 000 14M19 19a10 10 0 000-14"/></svg>;
    case 'flame':      return <svg {...props}><path d="M12 3s5 5 5 10a5 5 0 01-10 0c0-2 1-3 1-3s1 1 2 1c0-3 2-5 2-8z"/></svg>;
    case 'sliders':    return <svg {...props}><path d="M4 6h12M20 6h0M4 12h4M12 12h8M4 18h10M18 18h2"/><circle cx="18" cy="6" r="1.5"/><circle cx="10" cy="12" r="1.5"/><circle cx="16" cy="18" r="1.5"/></svg>;
    case 'eye':        return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'eye-off':    return <svg {...props}><path d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A10.4 10.4 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.4 4.4M6 6.5A17 17 0 002 12s4 7 10 7c1.4 0 2.7-.4 3.9-1"/></svg>;
    case 'arc':        return <svg {...props}><path d="M3 18a9 9 0 0118 0"/><path d="M12 18V8"/></svg>;
    case 'sparkle':    return <svg {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></svg>;
    case 'follow':     return <svg {...props}><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0114 0"/><path d="M19 8v6M22 11h-6"/></svg>;
    case 'following':  return <svg {...props}><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0114 0"/><path d="M17 12l2 2 4-4"/></svg>;
    default:           return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

// ─── Money ─ Bharat grouping with optional compact + sign ──
function Money({ value, compact = false, signed = false, decimals = 2, className = '' }) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  const abs = Math.abs(value);
  const out = compact ? fmt.inrCompact(abs, { decimals }) : fmt.inrGroup(abs);
  return <span className={'tnum ' + className}>{signed ? sign : ''}₹{out}</span>;
}

// ─── Delta pill ──────────────────────────────────────────────
function Delta({ pct, abs, compact = true }) {
  const up = (pct ?? abs) >= 0;
  const color = up ? 'var(--accent)' : 'var(--loss)';
  return (
    <span className="tnum" style={{ color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ transform: up ? 'none' : 'rotate(180deg)', display: 'inline-block', fontSize: 10, lineHeight: 1 }}>▲</span>
      {abs !== undefined && <span>₹{fmt.inrCompact(Math.abs(abs))}</span>}
      {pct !== undefined && <span>{pct >= 0 ? '+' : ''}{pct.toFixed(2)}%</span>}
    </span>
  );
}

// ─── Card ──────────────────────────────────────────────────
function Card({ children, padding = 16, style = {}, ...rest }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--hairline)',
      borderRadius: 20,
      padding,
      ...style,
    }} {...rest}>{children}</div>
  );
}

// ─── Top bar — minimal, no large title ─────────────────────
function TopBar({ leading, trailing, title, subtitle, dense = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: dense ? '8px 16px 8px' : '6px 16px 12px',
      minHeight: 44,
    }}>
      <div style={{ width: 36, display: 'flex', justifyContent: 'flex-start' }}>{leading}</div>
      <div style={{ flex: 1, textAlign: 'center', overflow: 'hidden' }}>
        {title && <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{title}</div>}
        {subtitle && <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{ width: 36, display: 'flex', justifyContent: 'flex-end' }}>{trailing}</div>
    </div>
  );
}

// ─── Round icon button ─────────────────────────────────────
function IconBtn({ children, onClick, active = false, size = 36 }) {
  const haptic = useHaptic();
  return (
    <button
      onClick={(e) => { haptic(); onClick && onClick(e); }}
      style={{
        width: size, height: size, borderRadius: 999,
        border: '1px solid var(--hairline)',
        background: active ? 'var(--accent-soft)' : 'var(--surface)',
        color: active ? 'var(--accent)' : 'var(--text-dim)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', padding: 0,
        transition: 'all 0.15s ease',
      }}>
      {children}
    </button>
  );
}

// ─── Segmented control ─────────────────────────────────────
function Segmented({ value, options, onChange, fullWidth = true }) {
  const ref = useRef(null);
  const haptic = useHaptic();
  const [thumb, setThumb] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const el = ref.current?.querySelector(`[data-seg="${value}"]`);
    if (el) setThumb({ left: el.offsetLeft, width: el.offsetWidth });
  }, [value, options]);
  return (
    <div ref={ref} style={{
      display: 'flex', position: 'relative',
      background: 'var(--elevated)',
      borderRadius: 12, padding: 3,
      width: fullWidth ? '100%' : 'auto',
    }}>
      <div style={{
        position: 'absolute', top: 3, bottom: 3,
        left: thumb.left, width: thumb.width,
        background: 'var(--surface)',
        borderRadius: 10,
        boxShadow: 'var(--shadow-pill)',
        transition: 'left 0.22s cubic-bezier(0.32,0.72,0,1), width 0.22s cubic-bezier(0.32,0.72,0,1)',
      }} />
      {options.map(o => {
        const v = typeof o === 'string' ? o : o.value;
        const label = typeof o === 'string' ? o : o.label;
        const active = v === value;
        return (
          <button key={v}
            data-seg={v}
            onClick={() => { if (v !== value) haptic(); onChange(v); }}
            style={{
              position: 'relative', flex: 1, padding: '7px 8px',
              background: 'transparent', border: 0, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
              color: active ? 'var(--text)' : 'var(--text-mute)',
              transition: 'color 0.15s ease',
            }}>{label}</button>
        );
      })}
    </div>
  );
}

// ─── Area chart with hover crosshair ───────────────────────
function AreaChart({ data, height = 160, onHover, onLeave, hoverIndex = null, label = '' }) {
  const ref = useRef(null);
  const [w, setW] = useState(340);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(entries => setW(entries[0].contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const padX = 0, padY = 14;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const xs = data.map((_, i) => padX + (w - padX * 2) * (i / (data.length - 1 || 1)));
  const ys = data.map(v => padY + (height - padY * 2) * (1 - (v - min) / range));
  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${ys[i].toFixed(2)}`).join(' ');
  const areaPath = linePath + ` L ${xs[xs.length - 1].toFixed(2)} ${height} L ${xs[0].toFixed(2)} ${height} Z`;
  const gid = useMemo(() => 'g' + Math.random().toString(36).slice(2, 8), []);

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const i = Math.max(0, Math.min(data.length - 1, Math.round((x / w) * (data.length - 1))));
    onHover && onHover(i);
  }

  return (
    <div ref={ref} style={{ width: '100%', position: 'relative', userSelect: 'none', touchAction: 'pan-y' }}
      onMouseMove={onMove}
      onMouseLeave={() => onLeave && onLeave()}
      onTouchStart={onMove} onTouchMove={onMove} onTouchEnd={() => onLeave && onLeave()}>
      <svg width={w} height={height} style={{ display: 'block' }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--chart-fill-top)" />
            <stop offset="100%" stopColor="var(--chart-fill-bottom)" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gid})`} />
        <path d={linePath} fill="none" stroke="var(--chart-stroke)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {hoverIndex !== null && hoverIndex >= 0 && (
          <g>
            <line x1={xs[hoverIndex]} y1={0} x2={xs[hoverIndex]} y2={height} stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 4" />
            <circle cx={xs[hoverIndex]} cy={ys[hoverIndex]} r="6" fill="var(--bg)" stroke="var(--chart-stroke)" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
}

// ─── Haptic feedback ────────────────────────────────────────
// Uses ios-haptics (window._iosHaptic) on iOS Safari where navigator.vibrate
// is unsupported. Falls back to navigator.vibrate pattern on Android/desktop.
//
// Named types map to ios-haptics API:
//   single pulse  → haptic()          (selection, light, medium, heavy, tick, impact, or raw ms)
//   double pulse  → haptic.confirm()  (success, confirm)
//   triple pulse  → haptic.error()    (error, warning)
function useHaptic() {
  return useCallback((type = 'selection') => {
    const iosH = window._iosHaptic;
    if (iosH) {
      if (type === 'success' || type === 'confirm') {
        iosH.confirm();
      } else if (type === 'error' || type === 'warning') {
        iosH.error();
      } else {
        iosH();
      }
      return;
    }
    // Fallback for Android / non-iOS environments
    if (!navigator.vibrate) return;
    const patterns = {
      selection: [6],
      light:     [10],
      medium:    [18],
      heavy:     [28],
      success:   [8, 60, 12],
      warning:   [14, 40, 14],
      error:     [20, 50, 20, 50, 20],
      tick:      [5],
      impact:    [22],
    };
    const pat = typeof type === 'number' ? [type] : (patterns[type] || [type]);
    try { navigator.vibrate(pat); } catch {}
  }, []);
}

// ─── Credits engine ────────────────────────────────────────
// Single source of truth for the credit economy: balance, the unlocked-trader
// set, and the transaction log — all persisted to localStorage.
//
// IMPORTANT: useCredits() must be called exactly ONCE, at the top of App().
// The returned `creditsApi` is prop-drilled down. Calling it in more than one
// component creates independent, desynced states.
const CREDITS_KEY = 'bharatstox.credits.v1';

function seedCreditsState() {
  return {
    balance: window.BS.me.credits,
    unlocked: [],
    log: window.BS.creditLog.slice(),
    claimed: {},
    lastCheckinDate: null,
    streakCount: 0,
    seededVersion: 1,
  };
}

function loadCreditsState() {
  try {
    const raw = localStorage.getItem(CREDITS_KEY);
    if (!raw) return seedCreditsState();
    return { ...seedCreditsState(), ...JSON.parse(raw) };
  } catch (e) {
    return seedCreditsState();
  }
}

function saveCreditsState(state) {
  try {
    localStorage.setItem(CREDITS_KEY, JSON.stringify(state));
  } catch (e) {
    // private mode / quota exceeded — stay in-memory for the session
  }
}

function makeEntry(kind, label, amount) {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return { kind, label, amount, at: `Today · ${hh}:${mm}` };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function useCredits() {
  const [state, setState] = useState(loadCreditsState);
  const ref = useRef(state);
  ref.current = state;

  useEffect(() => { saveCreditsState(state); }, [state]);

  // earn(label, amount, { onceKey }) — onceKey guards one-time grants.
  // Returns true if granted, false if the onceKey was already claimed.
  const earn = useCallback((label, amount, opts = {}) => {
    const s = ref.current;
    if (opts.onceKey && s.claimed[opts.onceKey]) return false;
    setState(prev => ({
      ...prev,
      balance: prev.balance + amount,
      log: [makeEntry('earn', label, amount), ...prev.log],
      claimed: opts.onceKey ? { ...prev.claimed, [opts.onceKey]: true } : prev.claimed,
    }));
    return true;
  }, []);

  // spend(label, cost, { unlockHandle }) — no-op + false if balance < cost.
  // If unlockHandle is already unlocked, succeeds without re-charging.
  const spend = useCallback((label, cost, opts = {}) => {
    const s = ref.current;
    if (opts.unlockHandle && s.unlocked.includes(opts.unlockHandle)) return true;
    if (s.balance < cost) return false;
    setState(prev => ({
      ...prev,
      balance: prev.balance - cost,
      log: [makeEntry('spend', label, -cost), ...prev.log],
      unlocked: opts.unlockHandle
        ? Array.from(new Set([...prev.unlocked, opts.unlockHandle]))
        : prev.unlocked,
    }));
    return true;
  }, []);

  // claimDailyCheckin() — flat +10, at most once per calendar day.
  const claimDailyCheckin = useCallback(() => {
    const s = ref.current;
    const today = todayKey();
    if (s.lastCheckinDate === today) return false;
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const streak = s.lastCheckinDate === yesterday ? s.streakCount + 1 : 1;
    setState(prev => ({
      ...prev,
      balance: prev.balance + 10,
      streakCount: streak,
      lastCheckinDate: today,
      log: [makeEntry('earn', `Daily check-in · ${streak} day${streak > 1 ? 's' : ''}`, 10), ...prev.log],
    }));
    return true;
  }, []);

  const markClaimed = useCallback((key) => {
    setState(prev => prev.claimed[key] ? prev : { ...prev, claimed: { ...prev.claimed, [key]: true } });
  }, []);

  const resetCredits = useCallback(() => setState(seedCreditsState()), []);

  return {
    balance: state.balance,
    log: state.log,
    unlocked: new Set(state.unlocked),
    claimed: state.claimed,
    streakCount: state.streakCount,
    checkedInToday: state.lastCheckinDate === todayKey(),
    earn, spend, claimDailyCheckin, markClaimed, resetCredits,
  };
}

// ─── Primary button ─────────────────────────────────────────
function Button({ children, onClick, variant = 'primary', size = 'md', icon, full = false, style = {}, haptic: hapticType = 'selection' }) {
  const haptic = useHaptic();
  const sizes = {
    sm: { h: 32, px: 12, fs: 13, gap: 6 },
    md: { h: 44, px: 16, fs: 14, gap: 8 },
    lg: { h: 52, px: 20, fs: 15, gap: 10 },
  }[size];
  const variants = {
    primary:   { bg: 'var(--accent)', color: '#04140C', border: 'transparent' },
    secondary: { bg: 'var(--surface)', color: 'var(--text)', border: 'var(--border)' },
    ghost:     { bg: 'transparent', color: 'var(--text-dim)', border: 'var(--hairline)' },
    danger:    { bg: 'var(--loss-soft)', color: 'var(--loss)', border: 'transparent' },
  }[variant];
  return (
    <button onClick={(e) => { haptic(hapticType); onClick && onClick(e); }} style={{
      height: sizes.h, padding: `0 ${sizes.px}px`,
      borderRadius: 999, border: `1px solid ${variants.border}`,
      background: variants.bg, color: variants.color,
      fontFamily: 'inherit', fontSize: sizes.fs, fontWeight: 600,
      letterSpacing: -0.1, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: sizes.gap, width: full ? '100%' : 'auto',
      transition: 'transform 0.08s ease, filter 0.15s ease',
      ...style,
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
      {icon}{children}
    </button>
  );
}

// ─── Stat block — small label + big number ─────────────────
function Stat({ label, value, sub, align = 'left' }) {
  return (
    <div style={{ textAlign: align }}>
      <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: -0.4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ─── Credits chip (pill in top right) ──────────────────────
function CreditsPill({ value, onClick }) {
  const haptic = useHaptic();
  return (
    <button onClick={(e) => { haptic(); onClick && onClick(e); }} style={{
      height: 30, padding: '0 11px',
      borderRadius: 999,
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      color: 'var(--text)',
      fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: 999,
        background: 'var(--gold)', color: '#0B0B0C',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700,
      }}>◎</span>
      <span className="tnum">{value}</span>
    </button>
  );
}

// ─── Dual-line chart (portfolio vs Nifty, normalised to % gain) ───
function DualLineChart({ portfolioData, niftyData, height = 160, onHover, onLeave, hoverIndex = null }) {
  const ref = useRef(null);
  const [w, setW] = useState(340);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(entries => setW(entries[0].contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const padX = 0, padY = 14;
  // Normalise both series to % gain from first point
  const pBase = portfolioData[0] || 1;
  const nBase = niftyData[0] || 1;
  const pNorm = portfolioData.map(v => ((v / pBase) - 1) * 100);
  const nNorm = niftyData.map(v => ((v / nBase) - 1) * 100);
  const allVals = [...pNorm, ...nNorm];
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const range = maxV - minV || 1;
  const n = pNorm.length;

  function toXY(vals) {
    const xs = vals.map((_, i) => padX + (w - padX * 2) * (i / (n - 1 || 1)));
    const ys = vals.map(v => padY + (height - padY * 2) * (1 - (v - minV) / range));
    return { xs, ys };
  }
  const p = toXY(pNorm);
  const q = toXY(nNorm);

  function makeLine(xs, ys) {
    return xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${ys[i].toFixed(2)}`).join(' ');
  }
  const pPath = makeLine(p.xs, p.ys);
  const qPath = makeLine(q.xs, q.ys);
  const zeroY = padY + (height - padY * 2) * (1 - (0 - minV) / range);
  const gid = useMemo(() => 'dl' + Math.random().toString(36).slice(2, 7), []);

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const i = Math.max(0, Math.min(n - 1, Math.round((x / w) * (n - 1))));
    onHover && onHover(i);
  }

  const hoverPct  = hoverIndex !== null ? pNorm[hoverIndex] : pNorm[pNorm.length - 1];
  const hoverNifty = hoverIndex !== null ? nNorm[hoverIndex] : nNorm[nNorm.length - 1];

  return (
    <div style={{ position: 'relative' }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, padding: '0 4px 8px', fontSize: 11, color: 'var(--text-mute)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 12, height: 2, background: 'var(--chart-stroke)', display: 'inline-block', borderRadius: 2 }} />
          Portfolio {hoverPct >= 0 ? '+' : ''}{hoverPct.toFixed(1)}%
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 12, height: 2, background: 'var(--text-mute)', display: 'inline-block', borderRadius: 2, opacity: 0.6 }} />
          Nifty 50 {hoverNifty >= 0 ? '+' : ''}{hoverNifty.toFixed(1)}%
        </span>
      </div>
      <div ref={ref} style={{ width: '100%', position: 'relative', userSelect: 'none', touchAction: 'pan-y' }}
        onMouseMove={onMove} onMouseLeave={() => onLeave && onLeave()}
        onTouchStart={onMove} onTouchMove={onMove} onTouchEnd={() => onLeave && onLeave()}>
        <svg width={w} height={height} style={{ display: 'block' }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--chart-fill-top)" />
              <stop offset="100%" stopColor="var(--chart-fill-bottom)" />
            </linearGradient>
          </defs>
          {/* Zero baseline */}
          {zeroY > padY && zeroY < height - padY && (
            <line x1={padX} y1={zeroY} x2={w - padX} y2={zeroY}
              stroke="var(--hairline)" strokeWidth="1" strokeDasharray="3 4" />
          )}
          {/* Nifty line (muted) */}
          <path d={qPath} fill="none" stroke="var(--text-mute)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.5" strokeDasharray="4 3" />
          {/* Portfolio area + line */}
          <path d={pPath + ` L ${p.xs[p.xs.length-1].toFixed(2)} ${height} L ${p.xs[0].toFixed(2)} ${height} Z`}
            fill={`url(#${gid})`} />
          <path d={pPath} fill="none" stroke="var(--chart-stroke)" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
          {hoverIndex !== null && hoverIndex >= 0 && (
            <g>
              <line x1={p.xs[hoverIndex]} y1={0} x2={p.xs[hoverIndex]} y2={height}
                stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 4" />
              <circle cx={p.xs[hoverIndex]} cy={p.ys[hoverIndex]} r="5"
                fill="var(--bg)" stroke="var(--chart-stroke)" strokeWidth="2" />
              <circle cx={q.xs[hoverIndex]} cy={q.ys[hoverIndex]} r="4"
                fill="var(--bg)" stroke="var(--text-mute)" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

// ─── Split bar — invested vs current value ────────────────────
function SplitBar({ invested, current }) {
  const gain   = current - invested;
  const gainPct = ((current / invested) - 1) * 100;
  const investedW = (invested / current) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Labels row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-mute)' }}>
        <span>Invested  <span className="tnum" style={{ color: 'var(--text-dim)', fontWeight: 600 }}>
          ₹{window.BS.fmt.inrCompact(invested)}
        </span></span>
        <span style={{ color: gain >= 0 ? 'var(--accent)' : 'var(--loss)', fontWeight: 700 }}>
          {gain >= 0 ? '+' : ''}₹{window.BS.fmt.inrCompact(Math.abs(gain))}
          {' '}({gainPct >= 0 ? '+' : ''}{gainPct.toFixed(1)}%)
        </span>
      </div>
      {/* Bar */}
      <div style={{ height: 8, borderRadius: 4, background: 'var(--elevated)', overflow: 'hidden', display: 'flex' }}>
        <div style={{
          width: `${investedW}%`, background: 'var(--border-strong)',
          borderRadius: '4px 0 0 4px', transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
        <div style={{
          flex: 1, background: gain >= 0 ? 'var(--accent)' : 'var(--loss)',
          borderRadius: '0 4px 4px 0',
        }} />
      </div>
      {/* Current value */}
      <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-mute)' }}>
        Current  <span className="tnum" style={{ color: 'var(--text)', fontWeight: 600 }}>
          ₹{window.BS.fmt.inrCompact(current)}
        </span>
      </div>
    </div>
  );
}

// ─── Sector allocation horizontal bars ───────────────────────
function SectorBars({ sectors }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const id = setTimeout(() => setMounted(true), 80); return () => clearTimeout(id); }, []);
  const max = Math.max(...sectors.map(s => s.pct));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {sectors.map((s, i) => (
        <div key={s.sector} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 52, fontSize: 11, color: 'var(--text-mute)', textAlign: 'right', flexShrink: 0 }}>{s.sector}</div>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--elevated)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: s.color || 'var(--accent)',
              width: mounted ? `${(s.pct / max) * 100}%` : '0%',
              transition: `width 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.04}s`,
            }} />
          </div>
          <div className="tnum" style={{ fontSize: 11, color: 'var(--text-dim)', width: 36, textAlign: 'right', flexShrink: 0 }}>
            {s.pct.toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Gain hero — big % gain number with sub-label ─────────────
function GainHero({ gainPct, gainAbs, label }) {
  const up = gainPct >= 0;
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>
        {label}
      </div>
      <div className="tnum" style={{
        fontSize: 42, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1,
        color: up ? 'var(--accent)' : 'var(--loss)',
      }}>
        {up ? '+' : ''}{gainPct.toFixed(1)}%
      </div>
      {gainAbs !== undefined && (
        <div className="tnum" style={{ fontSize: 14, color: up ? 'var(--accent)' : 'var(--loss)', marginTop: 4, opacity: 0.8 }}>
          {up ? '+' : '−'}₹{window.BS.fmt.inrCompact(Math.abs(gainAbs))} absolute return
        </div>
      )}
    </div>
  );
}

// ─── Celebrations — hand-rolled confetti + 3D coins ────────
// Zero-dependency particle burst: each particle is an outer div (arced
// trajectory via bs-coin-fall + per-particle CSS vars) wrapping an inner
// div (3D coin flip, or confetti flutter). Parent controls lifetime.
const BS_CONFETTI_COLORS = ['#00E676', '#FFB800', '#FF8095', '#5AB6FF', '#B58CFF'];

function CoinBurst({ count = 26, originX = 50, originY = 40 }) {
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const isCoin = i % 3 !== 0; // ~2/3 coins, ~1/3 confetti
      arr.push({
        i, isCoin,
        dx: (Math.random() - 0.5) * 340,
        peak: -(70 + Math.random() * 150),
        dy: 230 + Math.random() * 260,
        delay: Math.random() * 0.35,
        dur: 1.5 + Math.random() * 1.1,
        spin: 0.45 + Math.random() * 0.5,
        size: isCoin ? 13 + Math.random() * 12 : 7 + Math.random() * 6,
        color: BS_CONFETTI_COLORS[i % BS_CONFETTI_COLORS.length],
      });
    }
    return arr;
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map(p => (
        <div key={p.i} className="bs-coin-fall" style={{
          position: 'absolute', left: originX + '%', top: originY + '%',
          '--dx': p.dx + 'px', '--peak': p.peak + 'px', '--dy': p.dy + 'px',
          animationDelay: p.delay + 's', animationDuration: p.dur + 's',
        }}>
          {p.isCoin ? (
            <div className="bs-coin-spin" style={{
              width: p.size, height: p.size, borderRadius: '50%',
              animationDuration: p.spin + 's',
              background: 'radial-gradient(circle at 35% 30%, #FFE9A8, #FFB800 55%, #C77F00)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.35), inset 0 0 0 1.5px rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#7A4F00', fontSize: p.size * 0.62, fontWeight: 800,
            }}>◎</div>
          ) : (
            <div className="bs-confetti-fall" style={{
              width: p.size, height: p.size * 0.45, borderRadius: 2, background: p.color,
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// Full-screen sign-up celebration — revealed once, after first onboarding.
function SignupCelebration({ amount, onDone }) {
  const haptic = useHaptic();
  useEffect(() => {
    haptic('confirm');
    const id = setTimeout(() => haptic(), 420);
    return () => clearTimeout(id);
  }, []);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 120,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <CoinBurst count={32} originY={36} />
      <div className="bs-burst-pop" style={{
        position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 320,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 28, padding: '30px 26px',
        boxShadow: '0 24px 70px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 22, margin: '0 auto 14px',
          background: 'var(--gold-soft)', border: '1px solid rgba(255,184,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
        }}>◎</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Welcome to BharatStox
        </div>
        <div className="tnum" style={{ fontSize: 50, fontWeight: 800, color: 'var(--gold)', letterSpacing: -2, lineHeight: 1.15, margin: '4px 0 2px' }}>
          +{amount} ◎
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: 22 }}>
          Your sign-up bonus is in. Spend it checking out the bigger portfolios above you.
        </div>
        <Button full size="lg" variant="primary" haptic="success" onClick={onDone}>Let's go</Button>
      </div>
    </div>
  );
}

// Transient referral-joined popup — auto-dismisses, or tap anywhere.
function ReferralPopup({ handle, amount, onDone }) {
  const haptic = useHaptic();
  useEffect(() => {
    haptic('confirm');
    const id = setTimeout(onDone, 2800);
    return () => clearTimeout(id);
  }, []);
  return (
    <div onClick={onDone} style={{
      position: 'absolute', inset: 0, zIndex: 115,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <CoinBurst count={20} originY={46} />
      <div className="bs-burst-pop" style={{
        position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 300,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '24px 26px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        <div style={{ fontSize: 34, marginBottom: 4 }}>🎉</div>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>{handle} joined!</div>
        <div className="tnum" style={{ fontSize: 30, fontWeight: 800, color: 'var(--gold)', marginTop: 6, letterSpacing: -1 }}>
          +{amount} ◎
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text-mute)', marginTop: 4 }}>
          Referral bonus added to your balance
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Avatar, Icon, Money, Delta, Card, TopBar, IconBtn, Segmented, AreaChart,
  Button, Stat, CreditsPill, useHaptic, useCredits,
  DualLineChart, SplitBar, SectorBars, GainHero,
  CoinBurst, SignupCelebration, ReferralPopup,
});
