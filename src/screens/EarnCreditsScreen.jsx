// Earn credits — ways to earn / spend, credit economics, refer CTA.
import { TopBar } from '../components/TopBar';
import { IconBtn } from '../components/IconBtn';
import { Icon } from '../components/Icon';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BS } from '../data/mockData';

export function EarnCreditsScreen({ credits, claimed = {}, streakCount = 0, checkedInToday = false, onClaim, onCheckin, onOpenRefer, onBack }) {
  const data = BS.earnCredits;

  // Trailing control for an earn row — varies by the row's `action`.
  function earnTrailing(w) {
    const amount = parseInt(String(w.reward).replace(/[^0-9]/g, ''), 10) || 0;
    if (w.action === 'refer') {
      return <Button size="sm" variant="secondary" onClick={() => onOpenRefer && onOpenRefer()}>Invite</Button>;
    }
    if (w.action === 'claim') {
      const done = !!claimed[w.key];
      return done
        ? <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>Claimed ✓</span>
        : <Button size="sm" variant="primary" onClick={() => onClaim && onClaim('Completed profile', amount, w.key)}>Claim {w.reward}</Button>;
    }
    if (w.action === 'checkin') {
      return checkedInToday
        ? <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>Checked in ✓</span>
        : <Button size="sm" variant="primary" onClick={() => onCheckin && onCheckin()}>Claim {w.reward}</Button>;
    }
    // 'auto' — granted by an in-app action; show reward, or a tick once earned.
    const done = w.key && claimed[w.key];
    return done
      ? <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>Earned ✓</span>
      : <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)' }}>{w.reward}</span>;
  }

  return (
    <div className="bs-screen">
      <TopBar
        leading={<IconBtn onClick={onBack}><Icon name="back" size={18} /></IconBtn>}
        title="Credits"
      />

      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 0 32px' }}>

        {/* Balance hero */}
        <div style={{ padding: '8px 20px 20px', textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 24, margin: '0 auto 12px',
            background: 'var(--gold-soft)', border: '1px solid rgba(255,184,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
          }}>◎</div>
          <div className="tnum" style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1.5, color: 'var(--gold)', lineHeight: 1 }}>
            {credits.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-mute)', marginTop: 6 }}>
            Your credit balance{streakCount > 1 ? ` · ${streakCount}-day streak` : ''}
          </div>
        </div>

        {/* Earn ways */}
        <div style={{ padding: '0 20px 6px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            How to earn
          </div>
          <Card padding={0}>
            {data.earnWays.map((w, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                borderBottom: i < data.earnWays.length - 1 ? '1px solid var(--hairline)' : 'none',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                  background: 'var(--elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={w.icon} size={18} color="var(--accent)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{w.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 1 }}>{w.desc}</div>
                </div>
                <div style={{ flexShrink: 0 }}>{earnTrailing(w)}</div>
              </div>
            ))}
          </Card>
        </div>

        {/* Spend ways */}
        <div style={{ padding: '20px 20px 6px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            How to spend
          </div>
          <Card padding={0}>
            {data.spendWays.map((w, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                borderBottom: i < data.spendWays.length - 1 ? '1px solid var(--hairline)' : 'none',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                  background: 'var(--elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={w.icon} size={18} color="var(--text-dim)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{w.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 1 }}>{w.desc}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-mute)', flexShrink: 0 }}>
                  {w.cost}
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Economics */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Credit economics
          </div>
          <Card padding={16}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.economics.map((e, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{e.label}</span>
                  <span className="tnum" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{e.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Refer CTA */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ padding: '18px', background: 'var(--accent-soft)', borderRadius: 20, border: '1px solid rgba(0,230,118,0.18)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, marginBottom: 4 }}>
              Fastest way to earn: referrals
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: 14 }}>
              Each friend who joins earns you <strong style={{ color: 'var(--accent)' }}>500 ◎</strong>. Three referrals = 1,500 ◎ = 15 portfolio unlocks.
            </div>
            <Button full variant="primary" size="md" onClick={() => onOpenRefer && onOpenRefer()}>
              Invite friends
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
