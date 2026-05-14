import { Avatar } from '../../components/Avatar';
import { Icon } from '../../components/Icon';
import { useHaptic } from '../../hooks/useHaptic';
import { fmt } from '../../data/mockData';

// Unlock confirmation bottom sheet.
export function UnlockSheet({ row, credits, onConfirm, onCancel, onEarn }) {
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
          <Avatar seed={row.handle} size={48} />
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
            <button onClick={() => { haptic(); onCancel(); }} style={{
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
            <button onClick={() => { haptic(); onCancel(); }} style={{
              flex: 1, height: 52, borderRadius: 16, border: '1px solid var(--border)',
              background: 'var(--surface)', color: 'var(--text-dim)',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}>Cancel</button>
            <button onClick={() => { haptic(); onCancel(); onEarn && onEarn(); }} style={{
              flex: 2, height: 52, borderRadius: 16,
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
