import { useEffect } from 'react';
import { CoinBurst } from './CoinBurst';
import { useHaptic } from '../../hooks/useHaptic';

// Transient referral-joined popup — auto-dismisses, or tap anywhere.
export function ReferralPopup({ handle, amount, onDone }) {
  const haptic = useHaptic();
  useEffect(() => {
    haptic('confirm');
    const id = setTimeout(onDone, 2800);
    return () => clearTimeout(id);
  }, []);
  return (
    <div onClick={onDone} style={{
      position: 'absolute', inset: 0, zIndex: 115,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <CoinBurst count={20} originY={46} />
      <div className="bs-burst-pop" style={{
        position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 300,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '24px 26px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        <div style={{ fontSize: 34, marginBottom: 4 }}>🎉</div>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>{handle} joined!</div>
        <div className="tnum" style={{ fontSize: 30, fontWeight: 800, color: 'var(--gold)', marginTop: 6, letterSpacing: -1 }}>
          +{amount} ◎
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text-mute)', marginTop: 4 }}>
          Referral bonus added to your balance
        </div>
      </div>
    </div>
  );
}
