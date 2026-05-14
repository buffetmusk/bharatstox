// components.jsx — shared UI primitives for BharatStox
/* global React */
const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;

const fmt = window.BS.fmt;

// ─── Avatar ────────────────────────────────────────────────
function Avatar({ initial = 'A', tone = 'mint', size = 32, ring = false }) {
  const tones = {
    mint:  ['#0F3024', '#00E676'],
    gold:  ['#332311', '#FFB800'],
    rose:  ['#321216', '#FF8095'],
    sky:   ['#0E2238', '#5AB6FF'],
    lilac: ['#221636', '#B58CFF'],
    amber: ['#311E07', '#FFA53D'],
    sand:  ['#2A2317', '#D8B07A'],
    teal:  ['#0C2A2A', '#4DD0C2'],
  };
  const [bg, fg] = tones[tone] || tones.mint;
  return (
    <div className="bs-avatar"
         style={{
           width: size, height: size, borderRadius: 999,
           background: `radial-gradient(circle at 30% 30%, ${fg}24, ${bg})`,
           color: fg, fontSize: size * 0.42, lineHeight: 1,
           boxShadow: ring ? `0 0 0 2px var(--bg), 0 0 0 3.5px ${fg}` : 'none',
         }}>
      {initial}
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

Object.assign(window, {
  Avatar, Icon, Money, Delta, Card, TopBar, IconBtn, Segmented, AreaChart,
  Button, Stat, CreditsPill, useHaptic,
  DualLineChart, SplitBar, SectorBars, GainHero,
});
