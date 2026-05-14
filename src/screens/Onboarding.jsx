import { useState } from 'react';
import { Button } from '../components/Button';
import { useHaptic } from '../hooks/useHaptic';
import { BS } from '../data/mockData';

// ═══════════════════════════════════════════════════════════════════
// ONBOARDING — 3 slides
// ═══════════════════════════════════════════════════════════════════
export function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const haptic = useHaptic();

  const slides = [
    {
      eyebrow: 'No names. No numbers.',
      title: 'Real portfolios.\nRevealed anonymously.',
      body: 'Traders across Bharat share their entire holdings under a pseudonym. You see what they actually own — not what they tweet.',
      visual: <OnbVisualLeaderboard />,
    },
    {
      eyebrow: 'Pay less. See more.',
      title: 'Portfolios in your\nbracket are free.',
      body: 'Browse everyone at-or-below your bracket without paying. Unlock the bigger fish with credits — earn them by inviting friends.',
      visual: <OnbVisualBrackets />,
    },
    {
      eyebrow: 'Connected, not exposed.',
      title: 'Link your broker.\nWe handle the rest.',
      body: 'Bring in Zerodha, Groww, Upstox & more via secure read-only access. Your handle stays anonymous. Your data never gets sold.',
      visual: <OnbVisualBroker />,
    },
  ];

  const s = slides[step];

  return (
    <div className="bs-screen" style={{ padding: '0 0 24px' }}>
      <div style={{ height: 54 }} />
      {/* dots */}
      <div style={{ display: 'flex', gap: 6, padding: '8px 24px 18px', justifyContent: 'center' }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            height: 4, borderRadius: 999,
            width: i === step ? 22 : 6,
            background: i === step ? 'var(--accent)' : 'var(--border-strong)',
            transition: 'all 0.3s cubic-bezier(0.2,0.7,0.2,1)',
          }} />
        ))}
      </div>
      {/* visual */}
      <div key={step + '-vis'} className="bs-fade-in" style={{ flex: 1, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {s.visual}
      </div>
      {/* copy */}
      <div key={step + '-copy'} className="bs-fade-in" style={{ padding: '14px 24px 4px' }}>
        <div style={{ fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, marginBottom: 10 }}>{s.eyebrow}</div>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.8, lineHeight: 1.12, whiteSpace: 'pre-wrap' }}>{s.title}</div>
        <div style={{ fontSize: 14.5, color: 'var(--text-dim)', lineHeight: 1.5, marginTop: 12 }}>{s.body}</div>
      </div>
      {/* actions */}
      <div style={{ padding: '22px 24px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { haptic(); onDone(); }} style={{
          background: 'transparent', border: 0, color: 'var(--text-mute)',
          fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          padding: '8px 4px',
        }}>Skip</button>
        <div style={{ flex: 1 }} />
        <Button size="lg" variant="primary" onClick={() => step === slides.length - 1 ? onDone() : setStep(step + 1)}>
          {step === slides.length - 1 ? 'Get started' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}

// onboarding visuals — clean SVG illustrations using our color tokens
function OnbVisualLeaderboard() {
  const sample = [
    { name: 'Northstar', val: '₹4.2 Cr' },
    { name: 'Magnolia',  val: '₹1.8 Cr' },
    { name: 'Bluefin',   val: '₹62 L'   },
    { name: 'Saffron',   val: '₹38 L'   },
    { name: 'Tigerstripe (you)', val: '₹12.4 L', me: true },
    { name: 'Quill',     val: '₹8.5 L'  },
    { name: 'Drift',     val: '₹4.1 L'  },
    { name: 'Heron',     val: '₹2.7 L'  },
    { name: 'Foxglove',  val: '₹1.2 L'  },
  ];
  return (
    <svg viewBox="0 0 320 320" width="100%" height="100%" style={{ maxWidth: 320, maxHeight: 320 }}>
      <defs>
        <linearGradient id="ob1-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--bg)" stopOpacity="1" />
          <stop offset="0.18" stopColor="var(--bg)" stopOpacity="0" />
          <stop offset="0.82" stopColor="var(--bg)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--bg)" stopOpacity="1" />
        </linearGradient>
      </defs>
      {sample.map((row, i) => {
        const y = 32 + i * 30;
        const d = Math.abs(i - 4);
        const scale = 1 - d * 0.05;
        const op = 1 - d * 0.16;
        const center = row.me;
        const locked = i < 4;
        return (
          <g key={i} transform={`translate(160 ${y}) scale(${scale} ${scale}) translate(-160 0)`} opacity={op}>
            <rect x="30" y="-14" width="260" height="28" rx="10"
                  fill={center ? 'var(--accent-soft)' : 'var(--surface)'}
                  stroke={center ? 'var(--accent)' : 'var(--hairline)'} strokeWidth="1" />
            <circle cx="50" cy="0" r="7"
                    fill={center ? 'var(--accent)' : 'var(--text-mute)'}
                    opacity={center ? 1 : 0.4} />
            <text x="66" y="4" fontFamily="Geist, sans-serif" fontSize="11.5"
                  fontWeight={center ? 700 : 500}
                  fill={center ? 'var(--accent)' : 'var(--text)'}
                  opacity={center ? 1 : (locked ? 0.85 : 1)}>{row.name}</text>
            <text x="282" y="4" textAnchor="end"
                  fontFamily="Geist Mono, ui-monospace, monospace"
                  fontSize="11" fontWeight="600"
                  fill={center ? 'var(--accent)' : (locked ? 'var(--text-mute)' : 'var(--text)')}
                  style={locked ? { filter: 'blur(3px)' } : {}}>{row.val}</text>
            {locked && <circle cx="284" cy="0" r="3" fill="var(--gold)" />}
          </g>
        );
      })}
      <rect x="0" y="0" width="320" height="320" fill="url(#ob1-fade)" pointerEvents="none" />
    </svg>
  );
}

function OnbVisualBrackets() {
  return (
    <svg viewBox="0 0 320 320" width="100%" height="100%" style={{ maxWidth: 320 }}>
      {/* Stacked brackets */}
      {[
        { y: 30,  w: 240, label: '₹50 L+',   locked: true,  cost: '420 ◎' },
        { y: 70,  w: 200, label: '₹20–50 L', locked: true,  cost: '180 ◎' },
        { y: 110, w: 168, label: '₹15–20 L', locked: true,  cost: '60 ◎'  },
        { y: 150, w: 200, label: '₹10–15 L', you: true                    },
        { y: 190, w: 168, label: '₹5–10 L',  free: true                   },
        { y: 230, w: 200, label: '₹1–5 L',   free: true                   },
        { y: 270, w: 240, label: 'Under 1 L',free: true                   },
      ].map((b, i) => (
        <g key={i} transform={`translate(${(320 - b.w)/2} ${b.y})`}>
          <rect width={b.w} height="30" rx="10"
                fill={b.you ? 'var(--accent-soft)' : 'var(--surface)'}
                stroke={b.you ? 'var(--accent)' : 'var(--hairline)'} strokeWidth="1" />
          <text x="14" y="20" fontFamily="Geist, sans-serif" fontSize="12" fontWeight="600"
                fill={b.you ? 'var(--accent)' : 'var(--text)'}>{b.label}</text>
          {b.you && <text x={b.w - 14} y="20" textAnchor="end" fontFamily="Geist Mono" fontSize="10" fontWeight="700" fill="var(--accent)">YOU</text>}
          {b.locked && <text x={b.w - 14} y="20" textAnchor="end" fontFamily="Geist Mono" fontSize="11" fill="var(--gold)">{b.cost}</text>}
          {b.free && <text x={b.w - 14} y="20" textAnchor="end" fontFamily="Geist Mono" fontSize="10" fontWeight="600" fill="var(--accent)">FREE</text>}
        </g>
      ))}
    </svg>
  );
}

function OnbVisualBroker() {
  const brokers = BS.brokers.slice(0, 6);
  return (
    <div style={{ position: 'relative', width: 280, height: 280 }}>
      {/* center logo */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        width: 88, height: 88, borderRadius: 28,
        background: 'var(--surface)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'var(--shadow-card)', zIndex: 2,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'var(--accent)', color: '#04140C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, letterSpacing: -1,
        }}>B</div>
      </div>
      {/* orbit */}
      <svg viewBox="0 0 280 280" width="280" height="280" style={{ position: 'absolute', inset: 0 }}>
        <circle cx="140" cy="140" r="100" fill="none" stroke="var(--hairline)" strokeDasharray="4 6" />
      </svg>
      {brokers.map((b, i) => {
        const angle = (i / brokers.length) * 2 * Math.PI - Math.PI / 2;
        const r = 100;
        const x = 140 + Math.cos(angle) * r;
        const y = 140 + Math.sin(angle) * r;
        return (
          <div key={b.id} style={{
            position: 'absolute', left: x - 22, top: y - 22,
            width: 44, height: 44, borderRadius: 14,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: b.accent,
            fontWeight: 700, fontSize: 16,
            boxShadow: 'var(--shadow-pill)',
          }}>{b.name[0]}</div>
        );
      })}
    </div>
  );
}
