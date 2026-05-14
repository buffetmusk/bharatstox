import { fmt } from '../../data/mockData';

// Split bar — invested vs current value, with the gain segment coloured.
export function SplitBar({ invested, current }) {
  const gain   = current - invested;
  const gainPct = ((current / invested) - 1) * 100;
  const investedW = (invested / current) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Labels row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-mute)' }}>
        <span>Invested  <span className="tnum" style={{ color: 'var(--text-dim)', fontWeight: 600 }}>
          ₹{fmt.inrCompact(invested)}
        </span></span>
        <span style={{ color: gain >= 0 ? 'var(--accent)' : 'var(--loss)', fontWeight: 700 }}>
          {gain >= 0 ? '+' : ''}₹{fmt.inrCompact(Math.abs(gain))}
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
          ₹{fmt.inrCompact(current)}
        </span>
      </div>
    </div>
  );
}
