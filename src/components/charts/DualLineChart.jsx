import { useRef, useState, useLayoutEffect, useMemo } from 'react';

// Dual-line chart — portfolio vs Nifty, normalised to % gain from the first point.
export function DualLineChart({ portfolioData, niftyData, height = 160, onHover, onLeave, hoverIndex = null }) {
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
