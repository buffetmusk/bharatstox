import { Icon } from '../../components/Icon';
import { useHaptic } from '../../hooks/useHaptic';
import { fmt } from '../../data/mockData';

// Bottom action bar — adapts to the active row: open (self), unlock (locked),
// or view (unlocked peer).
export function ActionBar({ row, credits, onOpen, onUnlock, sortMode = 'value', rows, gainsRanked, onOpenEarnCredits }) {
  const haptic = useHaptic();
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
          <button onClick={() => { haptic(); onOpenEarnCredits(); }} style={{
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
