// Refer & earn — invite link, network viz, invited list.
import { useState, useEffect } from 'react';
import { TopBar } from '../components/TopBar';
import { IconBtn } from '../components/IconBtn';
import { Icon } from '../components/Icon';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { BracketPill } from '../components/BracketPill';
import { useHaptic } from '../hooks/useHaptic';
import { fmt } from '../data/mockData';

export function ReferScreen({ me, network, invites, claimed = {}, onClaimReferral, onBack, onShowToast }) {
  const [copied, setCopied] = useState(false);
  const link = `bharatstox.app/i/${me.referralCode}`;
  const haptic = useHaptic();

  function copy() {
    haptic();
    try { navigator.clipboard?.writeText(link); } catch (e) { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const totalEarned = network.filter(n => !n.self).length * 500;

  return (
    <div className="bs-screen">
      <TopBar leading={<IconBtn onClick={onBack}><Icon name="back" size={18} /></IconBtn>} title="Refer friends" />
      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 0 110px' }}>
        {/* Hero */}
        <div style={{ padding: '0 20px 4px' }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6, lineHeight: 1.15 }}>
            <span style={{ color: 'var(--text)' }}>Earn </span>
            <span style={{ color: 'var(--gold)' }}>500 ◎</span>
            <span style={{ color: 'var(--text)' }}> for every friend who joins.</span>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.5 }}>
            Credits unlock portfolios above your bracket. Friends get 500 ◎ when they join.
          </div>
        </div>

        {/* Network viz */}
        <div style={{ padding: '20px 20px 4px' }}>
          <NetworkViz network={network} me={me} />
        </div>

        {/* Stats strip */}
        <div style={{ padding: '12px 20px 4px', display: 'flex', gap: 8 }}>
          <BracketPill label="Joined" value={String(network.filter(n=>!n.self).length)} />
          <BracketPill label="Pending" value={String(invites.filter(i=>i.status==='pending').length)} />
          <BracketPill label="Earned" value={`${totalEarned} ◎`} />
        </div>

        {/* Link card */}
        <div style={{ padding: '20px 20px 8px' }}>
          <Card padding={14}>
            <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>Your invite link</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="mono" style={{ flex: 1, fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link}</div>
              <button onClick={copy} style={{
                height: 34, padding: '0 12px', borderRadius: 999,
                background: copied ? 'var(--accent)' : 'var(--elevated)',
                color: copied ? '#04140C' : 'var(--text)',
                border: 0, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                {copied ? <Icon name="check" size={13} /> : <Icon name="copy" size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button full size="md" variant="primary" icon={<Icon name="share" size={15} />}
                onClick={() => onShowToast && onShowToast('Link shared!')}>Share invite</Button>
              <Button size="md" variant="secondary" icon={<Icon name="qr" size={15} />}
                onClick={() => onShowToast && onShowToast('QR code ready')}>QR</Button>
            </div>
          </Card>
        </div>

        {/* Invited list */}
        <div style={{ padding: '12px 20px 4px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600, padding: '6px 4px 10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Invited</span>
            <span className="tnum" style={{ color: 'var(--text-mute)', fontWeight: 500 }}>{invites.length} total</span>
          </div>
          <Card padding={0}>
            {invites.map((inv, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 14px',
                borderBottom: i === invites.length - 1 ? 'none' : '1px solid var(--hairline)',
              }}>
                <Avatar seed={inv.handle} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.handle}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-mute)', marginTop: 1 }}>{inv.status === 'joined' ? `Joined ${inv.joinedOn}` : `Invited ${inv.joinedOn} · awaiting signup`}</div>
                </div>
                {inv.status === 'joined' ? (
                  <div className="tnum" style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)' }}>+{inv.credits} ◎</div>
                ) : claimed['ref:' + inv.handle] ? (
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>Claimed ✓</span>
                ) : onClaimReferral ? (
                  <Button size="sm" variant="primary" onClick={() => onClaimReferral(inv)}>Claim +500 ◎</Button>
                ) : (
                  <div style={{
                    fontSize: 10.5, padding: '4px 8px', borderRadius: 999,
                    background: 'var(--elevated)', color: 'var(--text-mute)',
                    textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600,
                  }}>Pending</div>
                )}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// Network viz — portfolio comparison bar chart within your circle.
function NetworkViz({ network, me }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  const sorted = [...network].sort((a, b) => b.bracket - a.bracket);
  const maxVal = sorted[0].bracket;
  const totalPortfolio = sorted.reduce((s, n) => s + n.bracket, 0);
  const myRank = sorted.findIndex(n => n.self) + 1;

  const toneColors = {
    mint: '#00E676', gold: '#FFB800', rose: '#FF8095',
    sky: '#5AB6FF', lilac: '#B58CFF', amber: '#FFA53D',
    sand: '#D8B07A', teal: '#4DD0C2',
  };

  return (
    <div style={{
      borderRadius: 20,
      background: 'var(--surface)',
      border: '1px solid var(--hairline)',
      overflow: 'hidden',
    }}>
      {/* Header stats */}
      <div style={{
        padding: '14px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--elevated)',
        borderBottom: '1px solid var(--hairline)',
      }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>
            Circle ranking
          </div>
          <div className="tnum" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginTop: 2, letterSpacing: -0.5 }}>
            #{myRank}
            <span style={{ fontSize: 12, color: 'var(--text-mute)', fontWeight: 500, letterSpacing: 0 }}> of {sorted.length}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>
            Combined AUM
          </div>
          <div className="tnum" style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', marginTop: 2, letterSpacing: -0.5 }}>
            ₹{fmt.inrCompact(totalPortfolio)}
          </div>
        </div>
      </div>

      {/* Ranked bar chart */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.map((person, i) => {
          const isYou = person.self;
          const barPct = mounted ? (person.bracket / maxVal) * 100 : 0;
          const color = toneColors[person.tone] || '#00E676';
          const delay = `${i * 0.06}s`;

          return (
            <div key={person.handle} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px',
              borderRadius: 12,
              background: isYou ? 'var(--accent-soft)' : 'transparent',
              border: isYou ? '1px solid rgba(0,230,118,0.18)' : '1px solid transparent',
              transition: 'background 0.2s ease',
            }}>
              {/* Rank */}
              <div style={{ fontSize: 10.5, color: 'var(--text-mute)', width: 14, textAlign: 'right', fontWeight: 600, flexShrink: 0 }}>
                {i + 1}
              </div>
              {/* Avatar */}
              <Avatar seed={isYou ? me.handle : person.handle} size={28} />
              {/* Bar + labels */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: isYou ? 700 : 500, color: isYou ? 'var(--accent)' : 'var(--text)' }}>
                    {isYou ? 'You' : person.handle}
                  </span>
                  <span className="tnum" style={{ fontSize: 11.5, color: isYou ? 'var(--accent)' : 'var(--text-dim)', fontWeight: 600, letterSpacing: -0.2 }}>
                    ₹{fmt.inrCompact(person.bracket)}
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: 'var(--elevated)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${barPct}%`,
                    borderRadius: 2,
                    background: isYou
                      ? 'var(--accent)'
                      : `linear-gradient(90deg, ${color}60, ${color})`,
                    transition: `width 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
