// Top bar — minimal, centred title, optional leading/trailing slots.
export function TopBar({ leading, trailing, title, subtitle, dense = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: dense ? '8px 16px 8px' : '6px 16px 12px',
      minHeight: 44,
    }}>
      <div style={{ width: 36, display: 'flex', justifyContent: 'flex-start' }}>{leading}</div>
      <div style={{ flex: 1, textAlign: 'center', overflow: 'hidden' }}>
        {title && <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{title}</div>}
        {subtitle && <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{ width: 36, display: 'flex', justifyContent: 'flex-end' }}>{trailing}</div>
    </div>
  );
}
