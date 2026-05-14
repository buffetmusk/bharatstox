// Profile — identity, stats, brokers, appearance, settings.
import { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Card } from '../components/Card';
import { CreditsPill } from '../components/CreditsPill';
import { Section } from '../components/Section';
import { Row } from '../components/Row';
import { useHaptic } from '../hooks/useHaptic';
import { fmt } from '../data/mockData';

export function ProfileScreen({ me, brokers, theme, onChangeTheme, onOpenCreditLog, onOpenBrokers, onOpenMyPortfolio, onOpenEarnCredits, onLogout }) {
  const connected = brokers.filter(b => b.connected);
  const haptic = useHaptic();

  return (
    <div className="bs-screen">
      <TopBar
        leading={<div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>Profile</div>}
        trailing={<CreditsPill value={me.credits} onClick={onOpenCreditLog} />}
      />
      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 0 110px' }}>
        {/* Identity */}
        <div style={{ padding: '12px 20px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar seed={me.handle} size={64} ring />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4 }}>{me.handle}</div>
            <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 3 }}>Anonymous · Joined Apr 2026</div>
          </div>
          <Button size="sm" variant="ghost">Edit</Button>
        </div>

        {/* Stat row */}
        <div style={{ padding: '0 20px 14px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            background: 'var(--surface)', borderRadius: 18,
            border: '1px solid var(--hairline)',
            overflow: 'hidden',
          }}>
            <ProfileStat label="Portfolio" value={`₹${fmt.inrCompact(me.portfolio)}`} sub={`#${me.rank.toLocaleString('en-IN')} rank`} onClick={onOpenMyPortfolio} clickable />
            <ProfileStat label="Bracket" value={`₹${me.bracket}`} sub={`Top ${100-me.pctile}%`} divider />
            <ProfileStat label="Credits" value={`${me.credits} ◎`} sub="View log" onClick={onOpenCreditLog} clickable divider />
          </div>
        </div>

        {/* Earn Credits */}
        <div style={{ padding: '0 20px 14px' }}>
          <button onClick={() => { haptic(); onOpenEarnCredits(); }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px',
            background: 'var(--surface)', borderRadius: 18,
            border: '1px solid var(--hairline)',
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: 'var(--gold-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, color: 'var(--gold)',
            }}>◎</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Earn Credits</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-mute)', marginTop: 1 }}>{me.credits} ◎ balance · tap to earn more</div>
            </div>
            <Icon name="chevron-r" size={16} color="var(--text-mute)" />
          </button>
        </div>

        {/* Brokers */}
        <Section label="Brokers">
          <Card padding={0}>
            <Row
              left={<Icon name="plus" size={16} color="var(--accent)" />}
              title="Connect a broker"
              right={<Icon name="chevron-r" size={16} color="var(--text-mute)" />}
              onClick={onOpenBrokers}
              divider={connected.length > 0}
            />
            {connected.map((b, i) => (
              <Row key={b.id}
                left={<div style={{ width: 28, height: 28, borderRadius: 8, background: b.accent, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{b.name[0]}</div>}
                title={b.name}
                subtitle={`Synced ${b.syncedAt}`}
                right={<div style={{ fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>Live</div>}
                divider={i < connected.length - 1}
              />
            ))}
          </Card>
        </Section>

        {/* Theme */}
        <Section label="Appearance">
          <Card padding={16}>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 10 }}>Theme</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <ThemeSwatch label="Dark"   theme="dark"  active={theme === 'dark'}  onClick={() => onChangeTheme('dark')} />
              <ThemeSwatch label="Light"  theme="light" active={theme === 'light'} onClick={() => onChangeTheme('light')} />
              <ThemeSwatch label="Sepia"  theme="sepia" active={theme === 'sepia'} onClick={() => onChangeTheme('sepia')} />
            </div>
          </Card>
        </Section>

        {/* Notification settings */}
        <Section label="Notifications">
          <Card padding={0}>
            <Toggle title="Leaderboard moves"   subtitle="When your bracket position changes" defaultOn />
            <Toggle title="Referral activity"   subtitle="When friends use your invite link" defaultOn divider />
            <Toggle title="Weekly digest"       subtitle="Monday morning recap email" divider />
          </Card>
        </Section>

        {/* Privacy & data */}
        <Section label="Privacy & data">
          <Card padding={0}>
            <Row title="Anonymous handle" right={<span className="mono" style={{ fontSize: 12, color: 'var(--text-mute)' }}>{me.handle}</span>} divider />
            <Row title="Hide my portfolio value" right={<MiniToggle defaultOn={false} />} divider />
            <Row title="Allow followers" right={<MiniToggle defaultOn />} divider />
            <Row title="Data & export" right={<Icon name="chevron-r" size={16} color="var(--text-mute)" />} />
          </Card>
        </Section>

        {/* About */}
        <Section label="About">
          <Card padding={0}>
            <Row title="Help & support"            right={<Icon name="chevron-r" size={16} color="var(--text-mute)" />} divider />
            <Row title="Community guidelines"      right={<Icon name="chevron-r" size={16} color="var(--text-mute)" />} divider />
            <Row title="Terms & privacy"           right={<Icon name="chevron-r" size={16} color="var(--text-mute)" />} divider />
            <Row title="Version"                   right={<span className="mono" style={{ fontSize: 12, color: 'var(--text-mute)' }}>0.7.2 · build 408</span>} />
          </Card>
        </Section>

        <div style={{ padding: '18px 20px 8px' }}>
          <Button full size="md" variant="ghost" icon={<Icon name="logout" size={15} />} onClick={onLogout}>Sign out</Button>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-mute)', padding: '6px 0 0' }}>BharatStox · Made in Bharat · SEBI registered partner</div>
      </div>
    </div>
  );
}

function ProfileStat({ label, value, sub, divider, onClick, clickable }) {
  const haptic = useHaptic();
  return (
    <div onClick={onClick ? (e) => { haptic(); onClick(e); } : undefined} style={{
      padding: '14px 14px',
      borderLeft: divider ? '1px solid var(--hairline)' : 'none',
      cursor: clickable ? 'pointer' : 'default',
    }}>
      <div style={{ fontSize: 10.5, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
      <div className="tnum" style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: clickable ? 'var(--accent)' : 'var(--text-mute)', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function MiniToggle({ defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  const haptic = useHaptic();
  return (
    <button onClick={() => { haptic(); setOn(!on); }} style={{
      width: 40, height: 24, borderRadius: 999,
      background: on ? 'var(--accent)' : 'var(--elevated)',
      border: 0, position: 'relative', cursor: 'pointer', padding: 0,
      transition: 'background 0.18s ease',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 18 : 2,
        width: 20, height: 20, borderRadius: 999,
        background: on ? '#04140C' : 'var(--text-mute)',
        transition: 'left 0.22s cubic-bezier(0.32,0.72,0,1)',
      }} />
    </button>
  );
}

function Toggle({ title, subtitle, defaultOn, divider }) {
  return (
    <Row title={title} subtitle={subtitle} right={<MiniToggle defaultOn={defaultOn} />} divider={divider} />
  );
}

function ThemeSwatch({ label, theme, active, onClick }) {
  const colors = {
    dark:  { bg: '#0A0A0B', surf: '#1C1C20', accent: '#00E676', text: '#FAFAFA' },
    light: { bg: '#FAFAF9', surf: '#FFFFFF', accent: '#00B85A', text: '#0A0A0B' },
    sepia: { bg: '#F2EDDF', surf: '#FBF7EA', accent: '#1F7A4D', text: '#2A241B' },
  }[theme];
  const haptic = useHaptic();
  return (
    <button onClick={(e) => { haptic(); onClick && onClick(e); }} style={{
      padding: 0, border: '0', background: 'transparent',
      cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{
        height: 64, borderRadius: 12, padding: 8,
        background: colors.bg,
        border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        boxShadow: active ? '0 0 0 4px var(--accent-soft)' : 'none',
        transition: 'all 0.18s ease',
        position: 'relative',
      }}>
        <div style={{ height: 6, background: colors.text, opacity: 0.85, borderRadius: 3, width: '60%' }} />
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          <div style={{ flex: 1, height: 22, background: colors.surf, borderRadius: 6 }} />
          <div style={{ width: 22, height: 22, background: colors.accent, borderRadius: 6 }} />
        </div>
        {active && <div style={{
          position: 'absolute', top: 6, right: 6,
          width: 16, height: 16, borderRadius: 999,
          background: 'var(--accent)', color: '#04140C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="check" size={11} /></div>}
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: active ? 'var(--text)' : 'var(--text-dim)' }}>{label}</div>
    </button>
  );
}
