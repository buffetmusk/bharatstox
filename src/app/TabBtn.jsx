import { Icon } from '../components/Icon';
import { useHaptic } from '../hooks/useHaptic';

// Single bottom-bar tab button with optional unread badge.
export function TabBtn({ tb, active, onChange }) {
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
