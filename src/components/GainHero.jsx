import { fmt } from '../data/mockData';

// Gain hero — big % gain number with an optional absolute-return sub-label.
export function GainHero({ gainPct, gainAbs, label }) {
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
          {up ? '+' : '−'}₹{fmt.inrCompact(Math.abs(gainAbs))} absolute return
        </div>
      )}
    </div>
  );
}
