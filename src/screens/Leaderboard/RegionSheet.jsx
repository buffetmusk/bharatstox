import { Avatar } from '../../components/Avatar';
import { Icon } from '../../components/Icon';
import { BracketPill } from '../../components/BracketPill';
import { fmt } from '../../data/mockData';

// Bottom sheet for a tapped city — aggregate stats + a few traders based there.
export function RegionSheet({ city, metric, onClose, onOpenTrader }) {
  if (!city) return null;
  const isUsers = metric === 'users';
  const accent = isUsers ? 'var(--accent)' : 'var(--gold)';

  const headline = isUsers
    ? { big: city.users.toLocaleString('en-IN'), cap: 'investors here' }
    : { big: `₹${city.netWorthCr.toLocaleString('en-IN')} Cr`, cap: 'combined portfolio' };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 90,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bs-fade-in"
        style={{
          width: '100%', background: 'var(--bg)',
          borderRadius: '24px 24px 0 0', padding: '8px 20px 28px',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--hairline)', margin: '0 auto 18px' }} />

        {/* Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12, flexShrink: 0,
            background: isUsers ? 'var(--accent-soft)' : 'var(--gold-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="pin" size={18} color={accent} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4 }}>
              {city.name}{city.you && <span style={{ color: 'var(--accent)', fontSize: 12.5, fontWeight: 700, marginLeft: 8 }}>· YOU</span>}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-mute)', marginTop: 1 }}>{city.state}</div>
          </div>
        </div>

        {/* Headline metric */}
        <div style={{ marginBottom: 16 }}>
          <div className="tnum" style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1, lineHeight: 1, color: accent }}>
            {headline.big}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-mute)', marginTop: 4 }}>{headline.cap}</div>
        </div>

        {/* Stat strip */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <BracketPill label="Investors" value={city.users.toLocaleString('en-IN')} />
          <BracketPill label="Combined" value={`₹${city.netWorthCr.toLocaleString('en-IN')} Cr`} />
          <BracketPill label="Median" value={`₹${city.medianL} L`} />
        </div>

        {/* Traders based here */}
        <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, marginBottom: 8 }}>
          Traders based here
        </div>
        <div style={{
          background: 'var(--surface)', borderRadius: 16,
          border: '1px solid var(--hairline)', overflow: 'hidden',
        }}>
          {city.topTraders.map((tr, i) => (
            <button
              key={tr.handle}
              onClick={() => onOpenTrader && onOpenTrader(tr.handle)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', cursor: 'pointer', fontFamily: 'inherit',
                background: 'transparent', border: 0, textAlign: 'left',
                borderBottom: i === city.topTraders.length - 1 ? 'none' : '1px solid var(--hairline)',
              }}
            >
              <Avatar seed={tr.handle} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tr.handle}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-mute)', marginTop: 1 }}>
                  +{tr.allGainPct.toFixed(1)}% all-time
                </div>
              </div>
              <div className="tnum" style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: -0.2 }}>
                ₹{fmt.inrCompact(tr.portfolio)}
              </div>
              <Icon name="chevron-r" size={15} color="var(--text-mute)" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
