// screens3.jsx — Analysis waitlist + Earn Credits screens
/* global React */
const { useState } = React;

// ═══════════════════════════════════════════════════════════════════
// ANALYSIS — pre-launch waitlist
// ═══════════════════════════════════════════════════════════════════

const ANALYSIS_FEATURES = [
  { icon: 'sliders', title: 'Performance breakdown',  desc: 'See exactly how you rank vs traders in your bracket and where the gap comes from.' },
  { icon: 'arc',     title: 'Sector intelligence',    desc: 'Spot overexposure and gaps in your sector mix compared to top performers.' },
  { icon: 'flame',   title: 'Trade timing patterns',  desc: 'Find out if you consistently buy high and sell low — and what to do about it.' },
];

const ANALYSIS_INTERESTS = [
  'Peer comparison',
  'Sector gaps',
  'Entry / exit timing',
  'Portfolio concentration',
  'Tax efficiency',
  'Risk exposure',
];

function AnalysisScreen({ waitlistSubmitted, onSubmitWaitlist }) {
  const [selected, setSelected] = useState([]);
  const [phone, setPhone]       = useState('');
  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(waitlistSubmitted || false);
  const haptic = useHaptic();

  const canSubmit = phone.trim().length >= 10 && email.trim().length > 3;

  function toggleInterest(s) {
    haptic(8);
    setSelected(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    haptic('confirm');
    setSubmitted(true);
    onSubmitWaitlist && onSubmitWaitlist({ phone, email, interests: selected });
  }

  if (submitted) {
    return (
      <div className="bs-screen">
        <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '32px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: 68, height: 68, borderRadius: 999,
            background: 'var(--accent-soft)', marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={32} color="var(--accent)" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, marginBottom: 8, textAlign: 'center' }}>
            You are on the list
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6, textAlign: 'center', marginBottom: 28, maxWidth: 280 }}>
            We will reach you at {email} when Analysis launches. You will be among the first.
          </div>
          {selected.length > 0 && (
            <div style={{ width: '100%', padding: '14px 16px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--hairline)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                Your interests
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {selected.map(s => (
                  <div key={s} style={{
                    padding: '5px 12px', borderRadius: 999,
                    background: 'var(--accent-soft)', border: '1px solid rgba(0,230,118,0.2)',
                    fontSize: 12.5, color: 'var(--accent)', fontWeight: 600,
                  }}>{s}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bs-screen">
      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 0 40px' }}>

        {/* Hero */}
        <div style={{ padding: '4px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Icon name="sparkle" size={20} color="var(--accent)" />
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>Analysis</div>
            <div style={{
              marginLeft: 4, padding: '3px 9px', borderRadius: 999,
              background: 'var(--accent-soft)', border: '1px solid rgba(0,230,118,0.25)',
              fontSize: 10, fontWeight: 800, color: 'var(--accent)', letterSpacing: 0.5,
            }}>LAUNCHING SOON</div>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.55 }}>
            Deep portfolio intelligence — built around how top Indian traders actually think.
          </div>
        </div>

        {/* Feature cards */}
        <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ANALYSIS_FEATURES.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '14px 16px', borderRadius: 18,
              background: 'var(--surface)', border: '1px solid var(--hairline)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 13, flexShrink: 0,
                background: 'var(--elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={f.icon} size={19} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Interest selector */}
        <div style={{ padding: '0 20px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
            What matters most to you?
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ANALYSIS_INTERESTS.map(s => {
              const on = selected.includes(s);
              return (
                <button key={s} onClick={() => toggleInterest(s)} style={{
                  padding: '7px 14px', borderRadius: 999,
                  border: '1px solid ' + (on ? 'rgba(0,230,118,0.35)' : 'var(--hairline)'),
                  background: on ? 'var(--accent-soft)' : 'var(--surface)',
                  color: on ? 'var(--accent)' : 'var(--text-dim)',
                  fontFamily: 'inherit', fontSize: 13, fontWeight: on ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {on && <span style={{ marginRight: 5 }}>✓</span>}{s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact form */}
        <form onSubmit={handleSubmit} style={{ padding: '0 20px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
            Notify me when it launches
          </div>

          {/* Phone */}
          <div style={{
            display: 'flex', alignItems: 'center',
            border: '1px solid var(--border)', borderRadius: 14,
            background: 'var(--surface)', marginBottom: 10, overflow: 'hidden',
          }}>
            <div style={{
              padding: '0 12px', height: 50,
              display: 'flex', alignItems: 'center',
              borderRight: '1px solid var(--hairline)',
              fontSize: 14, fontWeight: 600, color: 'var(--text-dim)', flexShrink: 0,
            }}>+91</div>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Mobile number"
              style={{
                flex: 1, height: 50, border: 'none', background: 'transparent',
                color: 'var(--text)', fontFamily: 'inherit', fontSize: 14,
                padding: '0 14px', outline: 'none',
              }}
            />
          </div>

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            style={{
              width: '100%', height: 50, borderRadius: 14,
              border: '1px solid var(--border)', background: 'var(--surface)',
              color: 'var(--text)', fontFamily: 'inherit', fontSize: 14,
              padding: '0 14px', boxSizing: 'border-box', outline: 'none',
              marginBottom: 14, display: 'block',
            }}
          />

          <button type="submit" disabled={!canSubmit} style={{
            width: '100%', height: 54, borderRadius: 16, border: 'none',
            background: canSubmit ? 'var(--accent)' : 'var(--elevated)',
            color: canSubmit ? '#04140C' : 'var(--text-mute)',
            fontFamily: 'inherit', fontWeight: 700, fontSize: 16,
            cursor: canSubmit ? 'pointer' : 'default',
            transition: 'all 0.18s', letterSpacing: -0.2,
          }}>
            Join the waitlist
          </button>
          <div style={{ fontSize: 11.5, color: 'var(--text-mute)', textAlign: 'center', marginTop: 10 }}>
            No spam. One message when we launch.
          </div>
        </form>

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EARN CREDITS
// ═══════════════════════════════════════════════════════════════════
function EarnCreditsScreen({ credits, onBack }) {
  const data = window.BS.earnCredits;
  const haptic = useHaptic();

  return (
    <div className="bs-screen">
      <TopBar
        leading={<IconBtn onClick={onBack}><Icon name="back" size={18} /></IconBtn>}
        title="Credits"
      />

      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 0 32px' }}>

        {/* Balance hero */}
        <div style={{ padding: '8px 20px 20px', textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 24, margin: '0 auto 12px',
            background: 'var(--gold-soft)', border: '1px solid rgba(255,184,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
          }}>◎</div>
          <div className="tnum" style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1.5, color: 'var(--gold)', lineHeight: 1 }}>
            {credits.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-mute)', marginTop: 6 }}>Your credit balance</div>
        </div>

        {/* Earn ways */}
        <div style={{ padding: '0 20px 6px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            How to earn
          </div>
          <Card padding={0}>
            {data.earnWays.map((w, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                borderBottom: i < data.earnWays.length - 1 ? '1px solid var(--hairline)' : 'none',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                  background: 'var(--elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={w.icon} size={18} color="var(--accent)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{w.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 1 }}>{w.desc}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)', flexShrink: 0 }}>
                  {w.reward}
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Spend ways */}
        <div style={{ padding: '20px 20px 6px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            How to spend
          </div>
          <Card padding={0}>
            {data.spendWays.map((w, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                borderBottom: i < data.spendWays.length - 1 ? '1px solid var(--hairline)' : 'none',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                  background: 'var(--elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={w.icon} size={18} color="var(--text-dim)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{w.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 1 }}>{w.desc}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-mute)', flexShrink: 0 }}>
                  {w.cost}
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Economics */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Credit economics
          </div>
          <Card padding={16}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.economics.map((e, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{e.label}</span>
                  <span className="tnum" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{e.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Refer CTA */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ padding: '18px', background: 'var(--accent-soft)', borderRadius: 20, border: '1px solid rgba(0,230,118,0.18)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, marginBottom: 4 }}>
              Fastest way to earn: referrals
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: 14 }}>
              Each friend who joins earns you <strong style={{ color: 'var(--accent)' }}>500 ◎</strong>. Three referrals = 1,500 ◎ = ~6 portfolio unlocks.
            </div>
            <Button full variant="primary" size="md">
              Invite friends
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.AnalysisScreen = AnalysisScreen;
window.EarnCreditsScreen = EarnCreditsScreen;
