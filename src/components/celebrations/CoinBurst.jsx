import { useMemo } from 'react';

// Zero-dependency particle burst: each particle is an outer div (arced
// trajectory via bs-coin-fall + per-particle CSS vars) wrapping an inner
// div (3D coin flip, or confetti flutter). Parent controls lifetime.
const BS_CONFETTI_COLORS = ['#00E676', '#FFB800', '#FF8095', '#5AB6FF', '#B58CFF'];

export function CoinBurst({ count = 26, originX = 50, originY = 40 }) {
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const isCoin = i % 3 !== 0; // ~2/3 coins, ~1/3 confetti
      arr.push({
        i, isCoin,
        dx: (Math.random() - 0.5) * 340,
        peak: -(70 + Math.random() * 150),
        dy: 230 + Math.random() * 260,
        delay: Math.random() * 0.35,
        dur: 1.5 + Math.random() * 1.1,
        spin: 0.45 + Math.random() * 0.5,
        size: isCoin ? 13 + Math.random() * 12 : 7 + Math.random() * 6,
        color: BS_CONFETTI_COLORS[i % BS_CONFETTI_COLORS.length],
      });
    }
    return arr;
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map(p => (
        <div key={p.i} className="bs-coin-fall" style={{
          position: 'absolute', left: originX + '%', top: originY + '%',
          '--dx': p.dx + 'px', '--peak': p.peak + 'px', '--dy': p.dy + 'px',
          animationDelay: p.delay + 's', animationDuration: p.dur + 's',
        }}>
          {p.isCoin ? (
            <div className="bs-coin-spin" style={{
              width: p.size, height: p.size, borderRadius: '50%',
              animationDuration: p.spin + 's',
              background: 'radial-gradient(circle at 35% 30%, #FFE9A8, #FFB800 55%, #C77F00)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.35), inset 0 0 0 1.5px rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#7A4F00', fontSize: p.size * 0.62, fontWeight: 800,
            }}>◎</div>
          ) : (
            <div className="bs-confetti-fall" style={{
              width: p.size, height: p.size * 0.45, borderRadius: 2, background: p.color,
            }} />
          )}
        </div>
      ))}
    </div>
  );
}
