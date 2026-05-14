// screens3.jsx — Analysis waitlist + Earn Credits screens
/* global React */
const { useState } = React;

// ═══════════════════════════════════════════════════════════════════
// ANALYSIS — pre-launch waitlist
// A blurred preview of the live Analysis dashboard sits behind a
// frictionless glass waitlist card: optional focus chips + optional
// free-text, one email field, done.
// ═══════════════════════════════════════════════════════════════════

const ANALYSIS_INTERESTS = [
  'Peer comparison',
  'Sector gaps',
  'Entry / exit timing',
  'Concentration risk',
  'Tax efficiency',
];

// Faux data — purely decorative, lives behind heavy blur.
const ANALYSIS_MOVERS = [
  { name: 'POLYCAB',    holders: 318,   flow:  94, data: [3, 5, 4, 7, 6, 9, 8, 9] },
  { name: 'HAL',        holders: 642,   flow:  71, data: [4, 3, 3, 5, 6, 6, 8, 9] },
  { name: 'RELIANCE',   holders: 1247,  flow:  51, data: [2, 3, 2, 4, 3, 5, 6, 8] },
  { name: 'TATAMOTORS', holders: 511,   flow:  38, data: [4, 6, 3, 7, 5, 8, 6, 7] },
  { name: 'ADANIENT',   holders: 233,   flow: -58, data: [8, 6, 7, 5, 6, 4, 5, 3] },
];

// ─── Tiny sparkline ────────────────────────────────────────────────
function MiniSpark({ data, color }) {
  const w = 60, h = 24, pad = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (w - pad * 2) * (i / (data.length - 1));
    const y = pad + (h - pad * 2) * (1 - (v - min) / range);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block', flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Faux "Today" dashboard — rendered blurred behind the overlay ──
function AnalysisBackdrop() {
  const card = {
    background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 18,
  };
  const kicker = {
    fontSize: 11.5, letterSpacing: 0.9, color: 'var(--text-mute)', fontWeight: 600,
  };
  return (
    <div style={{ padding: '10px 0 40px' }}>
      {/* Header */}
      <div style={{ padding: '8px 20px 6px' }}>
        <div style={kicker}>TUESDAY, 12 MAY</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>Today</div>
          <div style={{
            width: 40, height: 40, borderRadius: 999, border: '1px solid var(--hairline)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          </div>
        </div>
      </div>

      {/* Dark hero card */}
      <div style={{
        margin: '10px 20px 0', background: 'var(--text)', color: 'var(--bg)',
        borderRadius: 24, padding: '22px 22px 20px',
      }}>
        <div style={{ fontSize: 11.5, letterSpacing: 1, opacity: 0.55, fontWeight: 600 }}>
          WHERE THE VERIFIED RETAIL IS MOVING
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
          <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>+312</div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>net positions opened</div>
        </div>
        <div style={{ fontSize: 13, opacity: 0.6, marginTop: 10 }}>
          across <b>8,431</b> traders in the last 24 hours
        </div>
        <div style={{ height: 1, background: 'currentColor', opacity: 0.13, margin: '18px 0 16px' }} />
        <div style={{ display: 'flex', gap: 44 }}>
          <div>
            <div style={{ fontSize: 10.5, letterSpacing: 0.8, opacity: 0.5, fontWeight: 600 }}>MOST ACCUMULATED</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 5, textDecoration: 'underline' }}>POLYCAB</div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, letterSpacing: 0.8, opacity: 0.5, fontWeight: 600 }}>MOST EXITED</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 5, textDecoration: 'underline' }}>ADANIENT</div>
          </div>
        </div>
      </div>

      {/* Movers list */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={kicker}>MOVERS IN YOUR BRACKET</div>
          <div style={{ fontSize: 12, color: 'var(--text-mute)' }}>Net flow · 7d</div>
        </div>
        <div style={{ ...card, marginTop: 10 }}>
          {ANALYSIS_MOVERS.map((m, i) => (
            <div key={m.name} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderBottom: i < ANALYSIS_MOVERS.length - 1 ? '1px solid var(--hairline)' : 'none',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: -0.2 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 2 }}>
                  {m.holders.toLocaleString('en-IN')} holders
                </div>
              </div>
              <MiniSpark data={m.data} color={m.flow >= 0 ? 'var(--accent)' : 'var(--loss)'} />
              <div className="tnum" style={{
                width: 46, textAlign: 'right', fontSize: 15, fontWeight: 700,
                color: m.flow >= 0 ? 'var(--accent)' : 'var(--loss)',
              }}>{m.flow >= 0 ? '+' : ''}{m.flow}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Your week */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={kicker}>YOUR WEEK</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
          {[
            { label: 'WATCHING', value: '8', sub: 'portfolios · 6 stocks' },
            { label: 'OVERLAP', value: '64%', sub: 'avg w/ bracket' },
          ].map(s => (
            <div key={s.label} style={{ ...card, flex: 1, padding: 16 }}>
              <div style={{ fontSize: 11, letterSpacing: 0.6, color: 'var(--text-mute)', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6, letterSpacing: -1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Discover */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={kicker}>DISCOVER</div>
        <div style={{ ...card, marginTop: 10 }}>
          {[
            { t: 'Portfolios in your bracket', r: '142' },
            { t: 'Stocks adding holders fastest', r: '24 today' },
            { t: 'New on Mirror this week', r: '+38' },
          ].map((d, i, a) => (
            <div key={d.t} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '15px 16px',
              borderBottom: i < a.length - 1 ? '1px solid var(--hairline)' : 'none',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: 'var(--elevated)', flexShrink: 0,
              }} />
              <div style={{ flex: 1, fontSize: 14.5, fontWeight: 600 }}>{d.t}</div>
              <div style={{ fontSize: 13, color: 'var(--text-mute)' }}>{d.r}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalysisScreen({ waitlistSubmitted, onSubmitWaitlist }) {
  const [selected, setSelected]   = useState([]);
  const [email, setEmail]         = useState('');
  const [note, setNote]           = useState('');
  const [submitted, setSubmitted] = useState(waitlistSubmitted || false);
  const haptic = useHaptic();

  const canSubmit = /\S+@\S+\.\S+/.test(email.trim());

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
    onSubmitWaitlist && onSubmitWaitlist({ email, note, interests: selected });
  }

  // Glass card shell — shared by form + success states.
  const glassCard = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 28,
    boxShadow: '0 24px 60px rgba(0,0,0,0.30), 0 2px 10px rgba(0,0,0,0.14)',
    padding: '24px 22px',
  };

  return (
    <div className="bs-screen">
      {/* Blurred live-dashboard preview */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
        filter: 'blur(15px) saturate(140%)',
        transform: 'scale(1.15)', transformOrigin: 'center top',
      }}>
        <AnalysisBackdrop />
      </div>

      {/* Scrim — gently mutes the background so the card reads first */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'var(--bg)', opacity: 0.42,
      }} />

      {/* Frictionless waitlist overlay */}
      <div className="bs-scroll" style={{
        position: 'absolute', inset: 0, zIndex: 2,
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        <div style={{
          minHeight: '100%', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '20px 16px',
        }}>
        {submitted ? (
          <div className="bs-fade-in" style={glassCard}>
            <div style={{
              width: 60, height: 60, borderRadius: 999, margin: '4px auto 18px',
              background: 'var(--accent-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="check" size={28} color="var(--accent)" />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, textAlign: 'center' }}>
              You are on the list
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text-dim)', lineHeight: 1.6, textAlign: 'center', marginTop: 8 }}>
              We will email <span style={{ color: 'var(--text)', fontWeight: 600 }}>{email}</span> the
              day Analysis goes live — you will be among the first in.
            </div>
            {selected.length > 0 && (
              <div style={{
                marginTop: 18, padding: '14px 16px', borderRadius: 16,
                background: 'var(--elevated)',
              }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>
                  We will build for
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {selected.map(s => (
                    <div key={s} style={{
                      padding: '5px 12px', borderRadius: 999,
                      background: 'var(--accent-soft)', color: 'var(--accent)',
                      fontSize: 12.5, fontWeight: 600,
                    }}>{s}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={glassCard}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px 4px 8px', borderRadius: 999,
              background: 'var(--accent-soft)', marginBottom: 14,
            }}>
              <Icon name="sparkle" size={13} color="var(--accent)" />
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--accent)', letterSpacing: 0.6 }}>
                ANALYSIS · LAUNCHING SOON
              </span>
            </div>

            {/* Headline */}
            <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.7, lineHeight: 1.15 }}>
              Get early access to Analysis
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text-dim)', lineHeight: 1.55, marginTop: 8 }}>
              Portfolio intelligence built around how India's top traders actually move.
              Tell us what to focus on — we will build it for you first.
            </div>

            {/* Focus chips — optional, one tap */}
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 10px' }}>
              What should it focus on?
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {ANALYSIS_INTERESTS.map(s => {
                const on = selected.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggleInterest(s)} style={{
                    padding: '7px 13px', borderRadius: 999,
                    border: '1px solid ' + (on ? 'var(--accent)' : 'var(--hairline)'),
                    background: on ? 'var(--accent-soft)' : 'var(--surface)',
                    color: on ? 'var(--accent)' : 'var(--text-dim)',
                    fontFamily: 'inherit', fontSize: 12.5, fontWeight: on ? 600 : 400,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    {on && <span style={{ marginRight: 5 }}>✓</span>}{s}
                  </button>
                );
              })}
            </div>

            {/* Optional free-text */}
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Anything specific you'd want analysed? (optional)"
              rows={2}
              style={{
                width: '100%', marginTop: 14, borderRadius: 14, resize: 'none',
                border: '1px solid var(--border)', background: 'var(--surface)',
                color: 'var(--text)', fontFamily: 'inherit', fontSize: 13.5,
                padding: '11px 14px', boxSizing: 'border-box', outline: 'none',
                lineHeight: 1.5,
              }}
            />

            {/* Email — the only required field */}
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              style={{
                width: '100%', height: 50, marginTop: 10, borderRadius: 14,
                border: '1px solid var(--border)', background: 'var(--surface)',
                color: 'var(--text)', fontFamily: 'inherit', fontSize: 14,
                padding: '0 14px', boxSizing: 'border-box', outline: 'none',
              }}
            />

            <button type="submit" disabled={!canSubmit} style={{
              width: '100%', height: 52, marginTop: 14, borderRadius: 16, border: 'none',
              background: canSubmit ? 'var(--accent)' : 'var(--elevated)',
              color: canSubmit ? '#04140C' : 'var(--text-mute)',
              fontFamily: 'inherit', fontWeight: 700, fontSize: 15.5,
              cursor: canSubmit ? 'pointer' : 'default',
              transition: 'all 0.18s', letterSpacing: -0.2,
            }}>
              Join the waitlist
            </button>
            <div style={{ fontSize: 11.5, color: 'var(--text-mute)', textAlign: 'center', marginTop: 10 }}>
              No spam. One email when we launch.
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EARN CREDITS
// ═══════════════════════════════════════════════════════════════════
function EarnCreditsScreen({ credits, claimed = {}, streakCount = 0, checkedInToday = false, onClaim, onCheckin, onOpenRefer, onBack }) {
  const data = window.BS.earnCredits;

  // Trailing control for an earn row — varies by the row's `action`.
  function earnTrailing(w) {
    const amount = parseInt(String(w.reward).replace(/[^0-9]/g, ''), 10) || 0;
    if (w.action === 'refer') {
      return <Button size="sm" variant="secondary" onClick={() => onOpenRefer && onOpenRefer()}>Invite</Button>;
    }
    if (w.action === 'claim') {
      const done = !!claimed[w.key];
      return done
        ? <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>Claimed ✓</span>
        : <Button size="sm" variant="primary" onClick={() => onClaim && onClaim('Completed profile', amount, w.key)}>Claim {w.reward}</Button>;
    }
    if (w.action === 'checkin') {
      return checkedInToday
        ? <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>Checked in ✓</span>
        : <Button size="sm" variant="primary" onClick={() => onCheckin && onCheckin()}>Claim {w.reward}</Button>;
    }
    // 'auto' — granted by an in-app action; show reward, or a tick once earned.
    const done = w.key && claimed[w.key];
    return done
      ? <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>Earned ✓</span>
      : <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)' }}>{w.reward}</span>;
  }

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
          <div style={{ fontSize: 14, color: 'var(--text-mute)', marginTop: 6 }}>
            Your credit balance{streakCount > 1 ? ` · ${streakCount}-day streak` : ''}
          </div>
        </div>

        {/* Earn ways */}
        <div style={{ padding: '0 20px 6px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            How to earn
          </div>
          <Card padding={0}>
            {data.earnWays.map((w, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
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
                <div style={{ flexShrink: 0 }}>{earnTrailing(w)}</div>
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
              Each friend who joins earns you <strong style={{ color: 'var(--accent)' }}>500 ◎</strong>. Three referrals = 1,500 ◎ = 15 portfolio unlocks.
            </div>
            <Button full variant="primary" size="md" onClick={() => onOpenRefer && onOpenRefer()}>
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
