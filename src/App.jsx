// BharatStox shell: router, bottom tabs, tweaks panel.
import { useState, useEffect } from 'react';
import { useTweaks } from './hooks/useTweaks';
import { useCredits } from './hooks/useCredits';
import { useHaptic } from './hooks/useHaptic';
import { BS, fmt } from './data/mockData';
import { AppFrame } from './app/AppFrame';
import { BottomBar } from './app/BottomBar';
import { Toast } from './app/Toast';
import { Onboarding } from './screens/Onboarding';
import { Leaderboard } from './screens/Leaderboard/Leaderboard';
import { AnalysisScreen } from './screens/AnalysisScreen';
import { EarnCreditsScreen } from './screens/EarnCreditsScreen';
import { ReferScreen } from './screens/ReferScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PortfolioScreen } from './screens/PortfolioScreen';
import { BrokersScreen } from './screens/BrokersScreen';
import { CreditLogScreen } from './screens/CreditLogScreen';
import { ReferralPopup } from './components/celebrations/ReferralPopup';
import { SignupCelebration } from './components/celebrations/SignupCelebration';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "skipOnboarding": false,
  "showFrame": false,
  "fontPair": "geist"
}/*EDITMODE-END*/;

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [onboarded, setOnboarded] = useState(false);
  const [stack, setStack] = useState([{ name: 'leaderboard' }]);
  const [tab, setTab] = useState('leaderboard');
  const credits = useCredits(); // single source of truth — call once, here only
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
    const label = `Unlocked ${row.handle} · ₹${fmt.inrCompact(row.portfolio)}`;
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
        rows={BS.rows}
        me={BS.me}
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
        onSubmitWaitlist={() => { setWaitlistSubmitted(true); }}
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
        me={BS.me}
        network={BS.network}
        invites={BS.invites}
        claimed={credits.claimed}
        onClaimReferral={claimReferral}
        onBack={back}
        onShowToast={showToast}
      />
    );
  } else if (top.name === 'notifications') {
    screen = <NotificationsScreen notifications={BS.notifications} onBack={back} />;
  } else if (top.name === 'profile') {
    screen = (
      <ProfileScreen
        me={{ ...BS.me, credits: credits.balance }}
        brokers={BS.brokers}
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
    const data = BS.traderDetail;
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
        data={{ ...BS.myPortfolio, handle: BS.me.handle }}
        isMe
        onBack={back}
        selfRefreshUsed={selfRefreshUsed}
        onSelfRefresh={handleSelfRefresh}
      />
    );
  } else if (top.name === 'brokers') {
    screen = (
      <BrokersScreen
        brokers={BS.brokers}
        onBack={back}
        onToggle={(id) => {
          const b = BS.brokers.find(x => x.id === id);
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
      <CreditLogScreen me={{ ...BS.me, credits: credits.balance }} log={credits.log} onBack={back} onOpenEarnCredits={() => navigate('earn-credits')} />
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
            unreadCount={BS.notifications.filter(n => n.unread).length}
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
