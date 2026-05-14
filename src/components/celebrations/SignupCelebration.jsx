import { useEffect } from 'react';
import { CoinBurst } from './CoinBurst';
import { Button } from '../Button';
import { useHaptic } from '../../hooks/useHaptic';

// Full-screen sign-up celebration — revealed once, after first onboarding.
export function SignupCelebration({ amount, onDone }) {
  const haptic = useHaptic();
  useEffect(() => {
    haptic('confirm');
    const id = setTimeout(() => haptic(), 420);
    return () => clearTimeout(id);
  }, []);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 120,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <CoinBurst count={32} originY={36} />
      <div className="bs-burst-pop" style={{
        position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 320,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 28, padding: '30px 26px',
        boxShadow: '0 24px 70px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 22, margin: '0 auto 14px',
          background: 'var(--gold-soft)', border: '1px solid rgba(255,184,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
        }}>◎</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Welcome to BharatStox
        </div>
        <div className="tnum" style={{ fontSize: 50, fontWeight: 800, color: 'var(--gold)', letterSpacing: -2, lineHeight: 1.15, margin: '4px 0 2px' }}>
          +{amount} ◎
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: 22 }}>
          Your sign-up bonus is in. Spend it checking out the bigger portfolios above you.
        </div>
        <Button full size="lg" variant="primary" haptic="success" onClick={onDone}>Let's go</Button>
      </div>
    </div>
  );
}
