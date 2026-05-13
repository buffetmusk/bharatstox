// screens3.jsx — Analysis + Earn Credits screens
/* global React */
const { useState, useRef } = React;

// ═══════════════════════════════════════════════════════════════════
// ANALYSIS — product preview + text/voice compose input
// ═══════════════════════════════════════════════════════════════════
function AnalysisScreen({ waitlistSubmitted, onSubmitWaitlist }) {
  const [query, setQuery]       = useState('');
  const [interim, setInterim]   = useState('');
  const [listening, setListening] = useState(false);
  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(waitlistSubmitted || false);
  const recogRef  = useRef(null);
  const haptic    = useHaptic();

  const speechOK = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  function toggleVoice() {
    if (listening) {
      recogRef.current && recogRef.current.stop();
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = 'en-IN';
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => {
      const t = Array.from(e.results).map(x => x[0].transcript).join('');
      if (e.results[e.results.length - 1].isFinal) {
        setQuery(prev => (prev ? prev + ' ' : '') + t);
        setInterim('');
      } else {
        setInterim(t);
      }
    };
    r.onend   = () => { setListening(false); setInterim(''); };
    r.onerror = () => { setListening(false); setInterim(''); };
    r.start();
    recogRef.current = r;
    setListening(true);
    haptic(10);
  }

  function handleSend(e) {
    e.preventDefault();
    if (!email || (!query && !submitted)) return;
    haptic('success');
    setSubmitted(true);
    onSubmitWaitlist && onSubmitWaitlist({ email, query });
  }

  const displayQuery = query + (interim ? (query ? ' ' : '') + interim : '');

  return (
    <div className="bs-screen">
      <style>{`
        @keyframes bs-mic-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.55); }
          70%  { box-shadow: 0 0 0 18px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        @keyframes bs-wave {
          0%,100% { transform: scaleY(0.4); }
          50%     { transform: scaleY(1.0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>Analysis</div>
          <div style={{ fontSize: 13, color: 'var(--text-mute)', marginTop: 3 }}>
            Your portfolio, deeply understood
          </div>
        </div>
        <div style={{
          padding: '4px 10px', borderRadius: 999, marginTop: 4,
          background: 'var(--elevated)', border: '1px solid var(--hairline)',
          fontSize: 10.5, fontWeight: 700, color: 'var(--text-mute)', letterSpacing: 0.4,
          whiteSpace: 'nowrap',
        }}>COMING SOON</div>
      </div>

      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 0 32px' }}>

        {/* Locked insight preview cards */}
        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Card 1 */}
          <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid var(--hairline)', background: 'var(--surface)', position: 'relative' }}>
            <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--hairline)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', letterSpacing: -0.1 }}>How you compare to 7,700 traders</div>
            </div>
            <div style={{ padding: '12px 14px', filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 48 }}>
                {[55,70,62,80,72,88,76,95,84,100,90,96].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ height: `${h * 0.55}%`, background: 'var(--accent)', borderRadius: '2px 2px 0 0' }} />
                    <div style={{ height: `${h * 0.32}%`, background: 'var(--text-mute)', borderRadius: '2px 2px 0 0', opacity: 0.5 }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 10 }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>● You  +102.7%</span>
                <span style={{ color: 'var(--text-mute)' }}>● Bracket avg  +67.3%</span>
              </div>
            </div>
            <LockedOverlay />
          </div>

          {/* Card 2 */}
          <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid var(--hairline)', background: 'var(--surface)', position: 'relative' }}>
            <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--hairline)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Sector exposure vs smart money</div>
            </div>
            <div style={{ padding: '12px 14px', filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
              {['IT / Tech', 'Banking', 'Energy', 'Consumer', 'Pharma'].map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <div style={{ width: 68, fontSize: 10.5, color: 'var(--text-dim)', flexShrink: 0 }}>{s}</div>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--elevated)' }}>
                    <div style={{ width: `${[82,61,44,38,27][i]}%`, height: '100%', borderRadius: 3, background: [1,3].includes(i) ? 'var(--accent)' : 'var(--text-mute)', opacity: 0.75 }} />
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: [1,3].includes(i) ? 'var(--accent)' : 'var(--text-mute)', width: 36, textAlign: 'right' }}>
                    {['+28%','–12%','+6%','+19%','–8%'][i]}
                  </div>
                </div>
              ))}
            </div>
            <LockedOverlay />
          </div>

          {/* Card 3 */}
          <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid var(--hairline)', background: 'var(--surface)', position: 'relative' }}>
            <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--hairline)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Where to improve</div>
            </div>
            <div style={{ padding: '12px 14px', filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
              {[
                { dot: 'var(--accent)', text: 'Over-indexed in IT vs bracket avg by 2.3×' },
                { dot: '#F59E0B',       text: 'Missing Banking rally — top performers are 18% allocated' },
                { dot: 'var(--accent)', text: 'Your timing on exits is in the top 15%' },
                { dot: '#EF4444',       text: 'Energy positions entered at a 12% premium' },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                  <div style={{ width: 7, height: 7, borderRadius: 999, background: p.dot, marginTop: 4, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.45 }}>{p.text}</div>
                </div>
              ))}
            </div>
            <LockedOverlay />
          </div>
        </div>

        {/* Compose section */}
        {submitted ? (
          <div style={{ padding: '0 20px 24px', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 999,
              background: 'var(--accent-soft)', margin: '0 auto 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="check" size={26} color="var(--accent)" />
            </div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.4, marginBottom: 6 }}>Saved — you're first in line</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.55 }}>
              We'll personalise the analysis around your question and reach you at <strong>{email}</strong> the day we launch.
            </div>
            {query ? (
              <div style={{
                marginTop: 16, padding: '12px 16px', borderRadius: 14,
                background: 'var(--surface)', border: '1px solid var(--hairline)',
                fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5,
                fontStyle: 'italic', textAlign: 'left',
              }}>"{query}"</div>
            ) : null}
          </div>
        ) : (
          <div style={{ padding: '0 20px' }}>

            {/* Divider label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--hairline)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-mute)', fontWeight: 600, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>
                ASK YOUR QUESTION
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--hairline)' }} />
            </div>

            {/* Compose card */}
            <div style={{
              borderRadius: 20,
              border: `1.5px solid ${listening ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`,
              background: 'var(--surface)',
              transition: 'border-color 0.2s',
              marginBottom: 12,
            }}>
              {/* Text area */}
              <textarea
                value={displayQuery}
                onChange={e => { if (!listening) setQuery(e.target.value); }}
                placeholder={listening ? '' : 'e.g. "Why am I underperforming vs Nifty?" or "Which sectors am I missing?"'}
                rows={4}
                style={{
                  width: '100%', border: 'none', background: 'transparent',
                  color: 'var(--text)', fontFamily: 'inherit',
                  fontSize: 14, lineHeight: 1.6,
                  padding: '16px 16px 10px', boxSizing: 'border-box',
                  outline: 'none', resize: 'none', display: 'block',
                }}
              />

              {/* Bottom row — status + mic */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px 12px', gap: 10,
              }}>
                {/* Waveform / hint */}
                {listening ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 18 }}>
                      {[0,1,2,3,4].map(i => (
                        <div key={i} style={{
                          width: 3, borderRadius: 2, background: '#EF4444',
                          animation: `bs-wave 0.8s ease ${i * 0.12}s infinite`,
                          height: '100%',
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>Listening…</span>
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>
                    {speechOK ? 'Type or tap the mic to speak' : 'Describe what you want to know'}
                  </span>
                )}

                {/* Mic button */}
                {speechOK && (
                  <button type="button" onClick={toggleVoice} style={{
                    width: 44, height: 44, borderRadius: 999, border: 'none', flexShrink: 0,
                    background: listening ? '#EF4444' : 'var(--elevated)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: listening ? 'bs-mic-pulse 1.4s ease infinite' : 'none',
                    transition: 'background 0.2s',
                  }}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                      stroke={listening ? '#fff' : 'var(--text-dim)'}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="2" width="6" height="12" rx="3" />
                      <path d="M5 10a7 7 0 0 0 14 0" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                      <line x1="9" y1="22" x2="15" y2="22" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Email + send row */}
            <form onSubmit={handleSend}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Your email"
                  style={{
                    flex: 1, height: 48, borderRadius: 14,
                    border: '1px solid var(--border)', background: 'var(--surface)',
                    color: 'var(--text)', fontFamily: 'inherit', fontSize: 14,
                    padding: '0 14px', boxSizing: 'border-box', outline: 'none',
                  }}
                />
                <button type="submit" style={{
                  height: 48, padding: '0 20px', borderRadius: 14, border: 'none',
                  background: email ? 'var(--accent)' : 'var(--elevated)',
                  color: email ? '#04140C' : 'var(--text-mute)',
                  fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
                  cursor: email ? 'pointer' : 'default',
                  transition: 'all 0.18s',
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                }}>
                  Notify me
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 8, paddingBottom: 4 }}>
                No spam · one notification when analysis goes live.
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function LockedOverlay() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, transparent 0%, var(--bg) 70%)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
      padding: '10px 14px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        background: 'var(--elevated)', border: '1px solid var(--hairline)',
        borderRadius: 999, padding: '4px 10px',
      }}>
        <Icon name="lock" size={10} color="var(--text-mute)" />
        <span style={{ fontSize: 10.5, color: 'var(--text-mute)', fontWeight: 600 }}>Personalised on launch</span>
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
