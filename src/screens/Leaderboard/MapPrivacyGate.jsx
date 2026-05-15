import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';

// One-time opt-in shown the first time the heat map is opened. The map (every
// other user's anonymised heat) sits blurred behind it — what's gated is only
// whether *your* city is added to the picture.
export function MapPrivacyGate({ onShare, onLater }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px 18px',
    }}>
      {/* gentle scrim so the card reads first */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', opacity: 0.5 }} />

      <div className="bs-fade-in" style={{
        position: 'relative', width: '100%', maxWidth: 320, boxSizing: 'border-box',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 28, padding: '26px 22px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.34), 0 2px 10px rgba(0,0,0,0.14)',
        textAlign: 'center',
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 999, margin: '0 auto 16px',
          background: 'var(--accent-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="pin" size={28} color="var(--accent)" />
        </div>

        <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.5 }}>
          See where Bharat invests
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-dim)', lineHeight: 1.6, marginTop: 8 }}>
          A live heat map of BharatStox investors across India. Share your city to
          place yourself on it — only <span style={{ color: 'var(--text)', fontWeight: 600 }}>aggregated
          city totals</span> are ever shown, never an individual's pin but your own.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
          <Button full size="lg" variant="primary" haptic="success" onClick={onShare}>
            Share my city
          </Button>
          <button onClick={onLater} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            color: 'var(--text-mute)', padding: '8px 4px',
          }}>
            Maybe later — just browse the map
          </button>
        </div>
      </div>
    </div>
  );
}
