// app.jsx — BharatStox shell: router, bottom tabs, tweaks panel
/* global React, ReactDOM */
const { useState, useEffect, useRef, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "skipOnboarding": false,
  "showFrame": false,
  "fontPair": "geist"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [onboarded, setOnboarded] = useState(false);
  const [stack, setStack] = useState([{ name: 'leaderboard' }]);
  const [tab, setTab] = useState('leaderboard');
  const credits = useCredits(); // single source of truth — call once, here only
  const [following, setFollowing] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [leaderboardSort, setLeaderboardSort] = useState('value');
  const [requestedRefresh, setRequestedRefresh] = useState(new Set()); // set of trader handles
  const [selfRefreshUsed, setSelfRefreshUsed] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [celebratingSignup, setCelebratingSignup] = useState(false);
  const [referralCelebration, setReferralCelebration] = useState(null);
  const haptic = useHaptic();

  const tabScreens = ['leaderboard', 'refer', 'analysis', 'notifications', 'profile']; // analysis shown via AnalysisStrip

  // Set theme on document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
  }, [t.theme]);

  function navigate(name, params = {}) {
    setStack(s => [...s, { name, params }]);
  }
  function back() {
    setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  }
  function switchTab(name) {
    setTab(name);
    setStack([{ name }]);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function handleOpenTrader(handleOrMe) {
    haptic(15);
    if (handleOrMe === 'me') navigate('my-portfolio');
    else navigate('trader', { handle: handleOrMe });
  }

  function handleUnlock(row) {
    const label = `Unlocked ${row.handle} · ₹${window.BS.fmt.inrCompact(row.portfolio)}`;
    const ok = credits.spend(label, row.unlockCost, { unlockHandle: row.handle });
    if (!ok) {
      showToast(`Need ${row.unlockCost - credits.balance} more credits`);
      return;
    }
    credits.earn('First unlock bonus', 50, { onceKey: 'firstUnlock' });
    haptic(25);
    showToast(`Unlocked ${row.handle} · −${row.unlockCost} ◎`);
    setTimeout(() => navigate('trader', { handle: row.handle }), 280);
  }

  function toggleFollow(handle) {
    setFollowing(s => {
      const n = new Set(s);
      if (n.has(handle)) n.delete(handle); else n.add(handle);
      return n;
    });
    haptic(12);
  }

  function handleRequestRefresh(handle) {
    if (!credits.spend(`Requested refresh · ${handle}`, 50)) {
      showToast(`Need ${50 - credits.balance} more credits`);
      return;
    }
    setRequestedRefresh(s => new Set(s).add(handle));
    haptic(15);
    showToast(`Refresh request sent · −50 ◎`);
  }

  function handleSelfRefresh() {
    setSelfRefreshUsed(true);
    showToast('Portfolio synced · next refresh in 24h');
  }

  // Referral bonus — fires when a referred friend connects their portfolio.
  // In this prototype that moment is simulated by the user claiming a pending
  // invite on the Refer screen. App owns the earn so the celebration popup
  // can hook in here.
  function claimReferral(invite) {
    const ok = credits.earn(`Referral · ${invite.handle} joined`, 500, { onceKey: 'ref:' + invite.handle });
    if (!ok) return;
    haptic('confirm');
    setReferralCelebration({ handle: invite.handle, amount: 500 });
  }

  // Onboarding
  if (!onboarded && !t.skipOnboarding) {
    return (
      <AppFrame theme={t.theme} showFrame={t.showFrame} setTweak={setTweak} t={t}>
        <Onboarding onDone={() => {
          setOnboarded(true);
          if (!credits.claimed.signupCelebrated) setCelebratingSignup(true);
        }} />
      </AppFrame>
    );
  }

  const top = stack[stack.length - 1];

  let screen;
  if (top.name === 'leaderboard') {
    screen = (
      <Leaderboard
        rows={window.BS.rows}
        me={window.BS.me}
        credits={credits.balance}
        sort={leaderboardSort}
        onChangeSort={setLeaderboardSort}
        onOpenTrader={handleOpenTrader}
        onSpendCredits={handleUnlock}
        onOpenCreditLog={() => navigate('credit-log')}
        onOpenEarnCredits={() => navigate('earn-credits')}
      />
    );
  } else if (top.name === 'analysis') {
    screen = (
      <AnalysisScreen
        waitlistSubmitted={waitlistSubmitted}
        onSubmitWaitlist={data => { setWaitlistSubmitted(true); }}
      />
    );
  } else if (top.name === 'earn-credits') {
    screen = (
      <EarnCreditsScreen
        credits={credits.balance}
        claimed={credits.claimed}
        streakCount={credits.streakCount}
        checkedInToday={credits.checkedInToday}
        onClaim={(label, amount, onceKey) => {
          if (credits.earn(label, amount, { onceKey })) { haptic('confirm'); showToast(`Earned +${amount} ◎`); }
        }}
        onCheckin={() => {
          if (credits.claimDailyCheckin()) { haptic('confirm'); showToast('Checked in · +10 ◎'); }
        }}
        onOpenRefer={() => navigate('refer')}
        onBack={back}
      />
    );
  } else if (top.name === 'refer') {
    screen = (
      <ReferScreen
        me={window.BS.me}
        network={window.BS.network}
        invites={window.BS.invites}
        claimed={credits.claimed}
        onClaimReferral={claimReferral}
        onBack={back}
        onShowToast={showToast}
      />
    );
  } else if (top.name === 'notifications') {
    screen = <NotificationsScreen notifications={window.BS.notifications} onBack={back} />;
  } else if (top.name === 'profile') {
    screen = (
      <ProfileScreen
        me={{ ...window.BS.me, credits: credits.balance }}
        brokers={window.BS.brokers}
        theme={t.theme}
        onChangeTheme={v => setTweak('theme', v)}
        onOpenCreditLog={() => navigate('credit-log')}
        onOpenBrokers={() => navigate('brokers')}
        onOpenMyPortfolio={() => navigate('my-portfolio')}
        onOpenEarnCredits={() => navigate('earn-credits')}
        onLogout={() => {
          setOnboarded(false);
          setStack([{ name: 'leaderboard' }]);
          setTab('leaderboard');
          setLeaderboardSort('value');
          setRequestedRefresh(new Set());
          setSelfRefreshUsed(false);
        }}
      />
    );
  } else if (top.name === 'trader') {
    const data = window.BS.traderDetail;
    const handle = top.params.handle || data.handle;
    screen = (
      <PortfolioScreen
        data={{ ...data, handle }}
        onBack={back}
        requestedRefresh={requestedRefresh.has(handle)}
        onRequestRefresh={() => handleRequestRefresh(handle)}
        onAlert={() => {
          if (credits.spend('Price alert · ' + handle, 15)) {
            haptic(12);
            showToast('Alert set · −15 ◎');
          } else {
            showToast(`Need ${15 - credits.balance} more credits`);
          }
        }}
      />
    );
  } else if (top.name === 'my-portfolio') {
    screen = (
      <PortfolioScreen
        data={{ ...window.BS.myPortfolio, handle: window.BS.me.handle }}
        isMe
        onBack={back}
        selfRefreshUsed={selfRefreshUsed}
        onSelfRefresh={handleSelfRefresh}
      />
    );
  } else if (top.name === 'brokers') {
    screen = (
      <BrokersScreen
        brokers={window.BS.brokers}
        onBack={back}
        onToggle={(id) => {
          const b = window.BS.brokers.find(x => x.id === id);
          if (b) { b.connected = !b.connected; b.syncedAt = b.connected ? 'Just now' : null; }
          haptic(15);
          if (b && b.connected) {
            const granted = credits.earn(`Connected portfolio · ${b.name}`, 500, { onceKey: 'portfolioConnected' });
            showToast(granted ? `${b.name} connected · +500 ◎` : `${b.name} connected`);
          } else {
            showToast(b ? `${b.name} disconnected` : '');
          }
        }}
      />
    );
  } else if (top.name === 'credit-log') {
    screen = (
      <CreditLogScreen me={{...window.BS.me, credits: credits.balance}} log={credits.log} onBack={back} onOpenEarnCredits={() => navigate('earn-credits')} />
    );
  }

  const showTabs = stack.length === 1 && tabScreens.includes(top.name);

  return (
    <AppFrame theme={t.theme} showFrame={t.showFrame} setTweak={setTweak} t={t}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
          {screen}
        </div>
        {showTabs && (
          <BottomBar
            active={tab}
            onChange={switchTab}
            unreadCount={window.BS.notifications.filter(n=>n.unread).length}
          />
        )}
        {toast && <Toast msg={toast} />}
        {referralCelebration && (
          <ReferralPopup
            handle={referralCelebration.handle}
            amount={referralCelebration.amount}
            onDone={() => setReferralCelebration(null)}
          />
        )}
        {celebratingSignup && (
          <SignupCelebration
            amount={500}
            onDone={() => {
              credits.markClaimed('signupCelebrated');
              setCelebratingSignup(false);
            }}
          />
        )}
      </div>
    </AppFrame>
  );
}

function Toast({ msg }) {
  return (
    <div style={{
      position: 'absolute', left: '50%', bottom: 155,
      transform: 'translateX(-50%)',
      background: 'var(--text)',
      color: 'var(--bg)',
      padding: '10px 16px',
      borderRadius: 999,
      fontSize: 13, fontWeight: 600, letterSpacing: -0.1,
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      zIndex: 100,
      pointerEvents: 'none',
      animation: 'bs-fade-in 0.2s ease both',
    }}>{msg}</div>
  );
}

// ─── Bottom bar with center FAB ──────────────────────────────
function TabBtn({ tb, active, onChange }) {
  const isActive = tb.name === active;
  const haptic = useHaptic();
  return (
    <button onClick={() => { haptic(); onChange(tb.name); }} style={{
      flex: 1, background: 'transparent', border: 0, padding: '2px 2px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      color: isActive ? 'var(--text)' : 'var(--text-mute)',
      cursor: 'pointer', fontFamily: 'inherit',
      transition: 'color 0.15s',
    }}>
      <div style={{ position: 'relative' }}>
        <Icon name={tb.icon} size={21} strokeWidth={isActive ? 2 : 1.6} />
        {tb.badge > 0 && (
          <div style={{
            position: 'absolute', top: -4, right: -8,
            minWidth: 16, height: 16, padding: '0 4px',
            borderRadius: 999, background: 'var(--accent)', color: '#04140C',
            fontSize: 9.5, fontWeight: 800,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>{tb.badge}</div>
        )}
      </div>
      <span style={{ fontSize: 9.5, fontWeight: isActive ? 600 : 500, letterSpacing: -0.1 }}>{tb.label}</span>
    </button>
  );
}

function BottomBar({ active, onChange, unreadCount }) {
  const haptic = useHaptic();
  const leftTabs = [
    { name: 'leaderboard', label: 'Leaders', icon: 'leaderboard' },
    { name: 'refer',       label: 'Invite',  icon: 'gift' },
  ];
  const rightTabs = [
    { name: 'notifications', label: 'Activity', icon: 'bell', badge: unreadCount },
    { name: 'profile',       label: 'You',      icon: 'user' },
  ];
  return (
    <div style={{ position: 'relative', overflow: 'visible', flexShrink: 0, zIndex: 50 }}>
      {/* Center FAB — sits half above, half inside the tab row */}
      <button onClick={() => { haptic(12); onChange('analysis'); }} style={{
        position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
        width: 60, height: 60, borderRadius: 999,
        background: active === 'analysis' ? 'var(--accent)' : 'var(--surface)',
        border: '3px solid var(--bg)',
        boxShadow: '0 6px 24px rgba(0,0,0,0.28)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 10,
      }}>
        <Icon name="sparkle" size={24}
          color={active === 'analysis' ? '#04140C' : 'var(--accent)'} strokeWidth={2} />
      </button>

      {/* Tab row — extra top padding to clear the protruding FAB visually */}
      <div style={{
        display: 'flex',
        paddingTop: 14, paddingLeft: 6, paddingRight: 6,
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        background: 'var(--backdrop-tab)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '0.5px solid var(--hairline)',
      }}>
        {leftTabs.map(tb => <TabBtn key={tb.name} tb={tb} active={active} onChange={onChange} />)}
        <div style={{ flex: 1 }} />
        {rightTabs.map(tb => <TabBtn key={tb.name} tb={tb} active={active} onChange={onChange} />)}
      </div>
    </div>
  );
}

// ─── Device frame wrapper ────────────────────────────────────
function AppFrame({ children, theme, showFrame, setTweak, t }) {
  const dark = theme === 'dark';

  // Full-screen native mode (default on mobile)
  if (!showFrame) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'var(--bg)',
        // Push content below the real device status bar
        paddingTop: 'env(safe-area-inset-top)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
          {children}
        </div>
        {/* Developer tweaks: small gear icon, bottom-right */}
        <Tweaks t={t} setTweak={setTweak} />
      </div>
    );
  }

  // Desktop preview mode — phone frame + fake status bar
  const content = (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {children}
    </div>
  );
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#0F0F12',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, boxSizing: 'border-box',
    }}>
      <div style={{
        width: 402, height: 874,
        borderRadius: 48, overflow: 'hidden',
        position: 'relative',
        background: 'var(--bg)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
      }}>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
        }} />
        {/* status bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
          <IOSStatusBar dark={dark} />
        </div>
        {/* content */}
        <div style={{ position: 'absolute', top: 54, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
          {content}
        </div>
        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: 0, right: 0, zIndex: 60,
          display: 'flex', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <div style={{
            width: 139, height: 5, borderRadius: 100,
            background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)',
          }} />
        </div>
      </div>
      <Tweaks t={t} setTweak={setTweak} />
    </div>
  );
}

// ─── Tweaks panel ────────────────────────────────────────────
function Tweaks({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Theme" />
      <TweakRadio label="Mode" value={t.theme}
                  options={['dark', 'light', 'sepia']}
                  onChange={v => setTweak('theme', v)} />
      <TweakSection label="Demo" />
      <TweakToggle label="Show device frame" value={t.showFrame}
                   onChange={v => setTweak('showFrame', v)} />
      <TweakToggle label="Skip onboarding" value={t.skipOnboarding}
                   onChange={v => setTweak('skipOnboarding', v)} />
      <TweakSection label="Credits" />
      <TweakButton label="Reset credits" secondary
                   onClick={() => {
                     try { localStorage.removeItem('bharatstox.credits.v1'); } catch (e) {}
                     location.reload();
                   }} />
    </TweaksPanel>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
