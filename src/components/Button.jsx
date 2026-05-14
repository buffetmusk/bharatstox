import { useHaptic } from '../hooks/useHaptic';

// Primary button — variant + size matrix, haptic on press.
export function Button({ children, onClick, variant = 'primary', size = 'md', icon, full = false, style = {}, haptic: hapticType = 'selection' }) {
  const haptic = useHaptic();
  const sizes = {
    sm: { h: 32, px: 12, fs: 13, gap: 6 },
    md: { h: 44, px: 16, fs: 14, gap: 8 },
    lg: { h: 52, px: 20, fs: 15, gap: 10 },
  }[size];
  const variants = {
    primary:   { bg: 'var(--accent)', color: '#04140C', border: 'transparent' },
    secondary: { bg: 'var(--surface)', color: 'var(--text)', border: 'var(--border)' },
    ghost:     { bg: 'transparent', color: 'var(--text-dim)', border: 'var(--hairline)' },
    danger:    { bg: 'var(--loss-soft)', color: 'var(--loss)', border: 'transparent' },
  }[variant];
  return (
    <button onClick={(e) => { haptic(hapticType); onClick && onClick(e); }} style={{
      height: sizes.h, padding: `0 ${sizes.px}px`,
      borderRadius: 999, border: `1px solid ${variants.border}`,
      background: variants.bg, color: variants.color,
      fontFamily: 'inherit', fontSize: sizes.fs, fontWeight: 600,
      letterSpacing: -0.1, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: sizes.gap, width: full ? '100%' : 'auto',
      transition: 'transform 0.08s ease, filter 0.15s ease',
      ...style,
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
      {icon}{children}
    </button>
  );
}
