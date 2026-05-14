import { Avatar } from '../../components/Avatar';
import { Icon } from '../../components/Icon';
import { useHaptic } from '../../hooks/useHaptic';
import { fmt } from '../../data/mockData';

// A single row in the leaderboard list view. Mirrors DrumRow's data choices
// (value vs gains) in a roomier, directly-tappable two-line layout. The user's
// own row is lifted out as a gently glowing accent card.
export function LeaderboardListRow({ row, rank, sortMode, isLast, rowRef, onOpen }) {
  const haptic = useHaptic();
  const isGains = sortMode === 'gains';
  const me = row.isMe;
  const locked = row.locked;

  const primary = isGains
    ? `+${row.allGainPct.toFixed(1)}%`
    : `₹${fmt.inrCompact(row.portfolio)}`;
  const secondary = isGains
    ? `₹${fmt.inrCompact(row.portfolio)}`
    : (locked ? null : `${row.day >= 0 ? '+' : ''}${row.day.toFixed(2)}% today`);

  const primaryColor = isGains
    ? (row.allGainPct >= 0 ? 'var(--accent)' : 'var(--loss)')
    : 'var(--text)';
  const secondaryColor = isGains
    ? 'var(--text-mute)'
    : (row.day >= 0 ? 'var(--accent)' : 'var(--loss)');

  // Top of the board gets a feather-light hierarchy cue; everyone else is muted.
  const rankColor = me
    ? 'var(--accent)'
    : rank === 1 ? 'var(--gold)' : rank <= 3 ? 'var(--text-dim)' : 'var(--text-mute)';

  return (
    <div
      ref={rowRef}
      onClick={() => { haptic(15); onOpen(row); }}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 12,
        height: 64,
        cursor: 'pointer',
        margin: me ? '8px 0' : 0,
        paddingLeft: me ? 12 : 6,
        paddingRight: me ? 12 : 6,
        background: me ? 'var(--accent-soft)' : 'transparent',
        border: me ? '1px solid rgba(0,230,118,0.30)' : '1px solid transparent',
        borderRadius: me ? 16 : 0,
      }}
    >
      {/* Rank */}
      <div className="tnum" style={{
        width: 24, textAlign: 'center', flexShrink: 0,
        fontSize: 13, fontWeight: 700, letterSpacing: -0.2,
        color: rankColor,
      }}>
        {rank}
      </div>

      {/* Avatar */}
      <Avatar seed={row.handle} size={38} ring={me} />

      {/* Handle + sublabel */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14.5, fontWeight: me ? 700 : 500, letterSpacing: -0.2,
          color: me ? 'var(--accent)' : 'var(--text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {me
            ? <span><span style={{ color: 'var(--text-mute)', fontWeight: 500 }}>You · </span>{row.handle}</span>
            : row.handle}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-mute)', marginTop: 2 }}>
          {locked ? 'Locked portfolio' : `${row.followers.toLocaleString('en-IN')} followers`}
        </div>
      </div>

      {/* Value block */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div className="tnum" style={{
          fontSize: 15, fontWeight: 700, letterSpacing: -0.3,
          color: primaryColor, opacity: locked ? 0.6 : 1,
        }}>
          {primary}
        </div>
        {secondary && (
          <div className="tnum" style={{
            fontSize: 11.5, color: secondaryColor, marginTop: 2,
            opacity: locked ? 0.6 : 1,
          }}>
            {secondary}
          </div>
        )}
      </div>

      {/* Trailing affordance — lock chip when gated, chevron otherwise */}
      {locked ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0,
          background: 'var(--gold-soft)', borderRadius: 999,
          height: 24, padding: '0 9px 0 7px',
        }}>
          <Icon name="lock" size={10} color="var(--gold)" />
          <span className="tnum" style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--gold)' }}>
            {row.unlockCost}◎
          </span>
        </div>
      ) : (
        <Icon name="chevron-r" size={16} color="var(--text-mute)" />
      )}

      {/* Inset divider — skipped on the last row and around the elevated me-card */}
      {!isLast && !me && (
        <div style={{
          position: 'absolute', left: 92, right: 0, bottom: 0,
          height: 1, background: 'var(--hairline)',
        }} />
      )}
    </div>
  );
}
