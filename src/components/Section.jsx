// Section — uppercase label heading + grouped content block.
export function Section({ label, children }) {
  return (
    <div style={{ padding: '6px 20px 14px' }}>
      <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, padding: '8px 4px 8px' }}>{label}</div>
      {children}
    </div>
  );
}
