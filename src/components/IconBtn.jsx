import { useHaptic } from '../hooks/useHaptic';

// Round icon button.
export function IconBtn({ children, onClick, active = false, size = 36 }) {
  const haptic = useHaptic();
  return (
    <button
      onClick={(e) => { haptic(); onClick && onClick(e); }}
      style={{
        width: size, height: size, borderRadius: 999,
        border: '1px solid var(--hairline)',
        background: active ? 'var(--accent-soft)' : 'var(--surface)',
        color: active ? 'var(--accent)' : 'var(--text-dim)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', padding: 0,
        transition: 'all 0.15s ease',
      }}>
      {children}
    </button>
  );
}
