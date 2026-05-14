// Transient toast — pill notification near the bottom of the screen.
export function Toast({ msg }) {
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
