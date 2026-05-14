import { Avatar } from '../../components/Avatar';
import { Icon } from '../../components/Icon';
import { fmt } from '../../data/mockData';
import { ROW_H } from './constants';

// A single drum row in the leaderboard picker.
export function DrumRow({ row, active, sortMode = 'value' }) {
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
      <Avatar seed={row.handle} size={28} ring={me} />

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
          color: row.allGainPct >= 0 ? 'var(--accent)' : 'var(--loss)',
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
