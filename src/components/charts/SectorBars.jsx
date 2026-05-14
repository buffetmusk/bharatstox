import { useState, useEffect } from 'react';

// Sector allocation — horizontal bars with a staggered grow-in animation.
export function SectorBars({ sectors }) {
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
