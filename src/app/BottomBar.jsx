import { Icon } from '../components/Icon';
import { useHaptic } from '../hooks/useHaptic';
import { TabBtn } from './TabBtn';

// Bottom tab bar with a protruding center FAB for the Analysis screen.
export function BottomBar({ active, onChange, unreadCount }) {
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
