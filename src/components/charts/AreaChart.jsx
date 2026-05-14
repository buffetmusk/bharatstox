import { useRef, useState, useLayoutEffect, useMemo } from 'react';

// Area chart with a hover crosshair.
export function AreaChart({ data, height = 160, onHover, onLeave, hoverIndex = null, label = '' }) {
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
