// screens2.jsx — Profile, Credit Log, Notifications
/* global React */
const { useState, useMemo } = React;

// ═══════════════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════════════
function ProfileScreen({ me, brokers, theme, onChangeTheme, onOpenCreditLog, onOpenBrokers, onOpenMyPortfolio, onOpenEarnCredits, onLogout }) {
  const fmt = window.BS.fmt;
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

function Section({ label, children }) {
  return (
    <div style={{ padding: '6px 20px 14px' }}>
      <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, padding: '8px 4px 8px' }}>{label}</div>
      {children}
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

function Row({ left, title, subtitle, right, divider, onClick }) {
  const haptic = useHaptic();
  return (
    <div onClick={onClick ? (e) => { haptic(); onClick(e); } : undefined} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderBottom: divider ? '1px solid var(--hairline)' : 'none',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      {left && <div style={{ flexShrink: 0 }}>{left}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11.5, color: 'var(--text-mute)', marginTop: 1 }}>{subtitle}</div>}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
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

// ═══════════════════════════════════════════════════════════════════
// BROKER CONNECT SHEET
// ═══════════════════════════════════════════════════════════════════
function BrokersScreen({ brokers, onBack, onToggle }) {
  return (
    <div className="bs-screen">
      <TopBar leading={<IconBtn onClick={onBack}><Icon name="back" size={18} /></IconBtn>} title="Brokers" />
      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 0 80px' }}>
        <div style={{ padding: '4px 20px 16px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Connect your brokers</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.5 }}>
            Read-only access via SEBI account aggregator framework. We never see your password and can never trade on your behalf.
          </div>
        </div>
        <Section label="Connected">
          <Card padding={0}>
            {brokers.filter(b => b.connected).map((b, i, arr) => (
              <BrokerRow key={b.id} broker={b} onToggle={() => onToggle(b.id)} divider={i < arr.length - 1} />
            ))}
            {brokers.filter(b => b.connected).length === 0 && (
              <div style={{ padding: '20px 16px', fontSize: 13, color: 'var(--text-mute)', textAlign: 'center' }}>No brokers connected yet.</div>
            )}
          </Card>
        </Section>
        <Section label="Available">
          <Card padding={0}>
            {brokers.filter(b => !b.connected).map((b, i, arr) => (
              <BrokerRow key={b.id} broker={b} onToggle={() => onToggle(b.id)} divider={i < arr.length - 1} />
            ))}
          </Card>
        </Section>
      </div>
    </div>
  );
}

function BrokerRow({ broker, onToggle, divider }) {
  return (
    <Row
      left={<div style={{ width: 36, height: 36, borderRadius: 10, background: broker.accent, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>{broker.name[0]}</div>}
      title={broker.name}
      subtitle={broker.connected ? `Synced ${broker.syncedAt}` : 'Bank-level read-only access'}
      right={
        broker.connected
          ? <Button size="sm" variant="ghost" onClick={onToggle}>Disconnect</Button>
          : <Button size="sm" variant="secondary" onClick={onToggle}>Connect</Button>
      }
      divider={divider}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════
// CREDIT LOG
// ═══════════════════════════════════════════════════════════════════
function CreditLogScreen({ me, log, onBack, onOpenEarnCredits }) {
  const [filter, setFilter] = useState('all');
  const haptic = useHaptic();
  const filtered = log.filter(l => filter === 'all' || (filter === 'earn' ? l.amount > 0 : l.amount < 0));

  // Group by date prefix
  const groups = useMemo(() => {
    const g = {};
    filtered.forEach(item => {
      const date = item.at.split(' · ')[0];
      if (!g[date]) g[date] = [];
      g[date].push(item);
    });
    return g;
  }, [filtered]);

  const totalEarned = log.filter(l => l.amount > 0).reduce((s, l) => s + l.amount, 0);
  const totalSpent = log.filter(l => l.amount < 0).reduce((s, l) => s + Math.abs(l.amount), 0);

  return (
    <div className="bs-screen">
      <TopBar leading={<IconBtn onClick={onBack}><Icon name="back" size={18} /></IconBtn>} title="Credit log" />
      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 0 80px' }}>
        {/* Balance hero */}
        <div style={{ padding: '0 20px 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Balance</div>
          <div className="tnum" style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1.4, lineHeight: 1 }}>{me.credits}</span>
            <span style={{ fontSize: 18, color: 'var(--gold)', fontWeight: 600 }}>◎</span>
            <span style={{ fontSize: 14, color: 'var(--text-mute)', marginLeft: 4 }}>credits</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
            <BracketPill label="Earned" value={`${totalEarned} ◎`} />
            <BracketPill label="Spent" value={`${totalSpent} ◎`} />
            <BracketPill label="Unlocks" value={String(log.filter(l => l.label.includes('Unlocked')).length)} />
          </div>
          {onOpenEarnCredits && (
            <button onClick={() => { haptic(); onOpenEarnCredits(); }} style={{
              marginTop: 12, background: 'none', border: 'none', padding: 0,
              color: 'var(--accent)', fontSize: 12.5, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span>◎</span> Earn more credits
              <Icon name="chevron-r" size={13} color="var(--accent)" />
            </button>
          )}
        </div>

        {/* Filter */}
        <div style={{ padding: '0 20px 14px' }}>
          <Segmented value={filter} onChange={setFilter} options={[
            {value:'all',label:'All'},
            {value:'earn',label:'Earned'},
            {value:'spend',label:'Spent'},
          ]} />
        </div>

        {/* Log */}
        <div style={{ padding: '0 20px' }}>
          {Object.entries(groups).map(([date, items], gi) => (
            <div key={date} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11.5, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, padding: '6px 4px 8px', fontWeight: 600 }}>{date}</div>
              <Card padding={0}>
                {items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 14px',
                    borderBottom: i === items.length - 1 ? 'none' : '1px solid var(--hairline)',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: item.amount > 0 ? 'var(--accent-soft)' : 'var(--gold-soft)',
                      color: item.amount > 0 ? 'var(--accent)' : 'var(--gold)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name={item.amount > 0 ? 'plus' : 'unlock'} size={15} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text)' }}>{item.label}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-mute)', marginTop: 1 }}>{item.at.split(' · ')[1] || ''}</div>
                    </div>
                    <div className="tnum" style={{
                      fontSize: 14.5, fontWeight: 700, letterSpacing: -0.2,
                      color: item.amount > 0 ? 'var(--accent)' : 'var(--text)',
                    }}>
                      {item.amount > 0 ? '+' : ''}{item.amount} ◎
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════
function NotificationsScreen({ notifications, onBack, showBack = false }) {
  const [filter, setFilter] = useState('all');
  const filtered = notifications.filter(n => filter === 'all' || n.kind === filter);
  const unread = notifications.filter(n => n.unread).length;
  const haptic = useHaptic();

  return (
    <div className="bs-screen">
      <TopBar
        leading={showBack ? <IconBtn onClick={onBack}><Icon name="back" size={18} /></IconBtn> : <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>Activity</div>}
        trailing={unread > 0 ? <button onClick={() => haptic()} style={{ background: 'transparent', border: 0, color: 'var(--accent)', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Mark read</button> : null}
        title={showBack ? 'Activity' : undefined}
      />
      <div style={{ padding: '8px 20px 12px' }}>
        <Segmented value={filter} onChange={setFilter} options={[
          {value:'all',label:`All ${unread ? '· ' + unread : ''}`},
          {value:'follow',label:'Follows'},
          {value:'alert',label:'Alerts'},
          {value:'credit',label:'Credits'},
        ]} />
      </div>
      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 110px' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-mute)', fontSize: 13 }}>No notifications</div>
        )}
        {filtered.map(n => (
          <NotifRow key={n.id} n={n} />
        ))}
      </div>
    </div>
  );
}

function NotifRow({ n }) {
  const tones = {
    alert:  { bg: 'var(--loss-soft)',   fg: 'var(--loss)' },
    follow: { bg: 'var(--accent-soft)', fg: 'var(--accent)' },
    credit: { bg: 'var(--gold-soft)',   fg: 'var(--gold)' },
    system: { bg: 'var(--elevated)',    fg: 'var(--text-dim)' },
  }[n.kind] || { bg: 'var(--elevated)', fg: 'var(--text-dim)' };
  const iconName = {
    alert: 'bell', follow: 'arrow-up', credit: 'gift', system: 'sparkle',
  }[n.kind];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 0',
      borderBottom: '1px solid var(--hairline)',
      position: 'relative',
    }}>
      {n.unread && (
        <div style={{
          position: 'absolute', left: -8, top: 22,
          width: 5, height: 5, borderRadius: 999, background: 'var(--accent)',
        }} />
      )}
      <div style={{
        width: 38, height: 38, borderRadius: 12,
        background: tones.bg, color: tones.fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={iconName} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', flexShrink: 0 }}>{n.at}</div>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 3, lineHeight: 1.45 }}>{n.body}</div>
      </div>
    </div>
  );
}

window.ProfileScreen = ProfileScreen;
window.BrokersScreen = BrokersScreen;
window.CreditLogScreen = CreditLogScreen;
window.NotificationsScreen = NotificationsScreen;
