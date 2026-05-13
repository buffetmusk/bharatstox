// screens3.jsx — Analysis + Earn Credits screens
/* global React */
const { useState, useRef } = React;

// ═══════════════════════════════════════════════════════════════════
// ANALYSIS — compose-first tool interface
// ═══════════════════════════════════════════════════════════════════

const ANALYSIS_SUGGESTIONS = [
  "Why am I underperforming Nifty this quarter?",
  "Which sectors am I over or under-exposed to?",
  "Am I consistently buying or selling at the wrong time?",
  "What is the weakest part of my portfolio right now?",
];

function AnalysisScreen({ waitlistSubmitted, onSubmitWaitlist }) {
  const [query, setQuery]           = useState('');
  const [interim, setInterim]       = useState('');
  const [listening, setListening]   = useState(false);
  const [email, setEmail]           = useState('');
  const [submitted, setSubmitted]   = useState(waitlistSubmitted || false);
  const [savedQuery, setSavedQuery] = useState('');
  const recogRef = useRef(null);
  const haptic   = useHaptic();
  const speechOK = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const displayQuery = query + (interim ? (query ? ' ' : '') + interim : '');
  const canSend = displayQuery.trim().length > 0;

  function fillPrompt(s) {
    setQuery(s);
    haptic(8);
  }

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
    const q = displayQuery.trim();
    if (!q) return;
    haptic('success');
    setSavedQuery(q);
    setSubmitted(true);
    onSubmitWaitlist && onSubmitWaitlist({ email, query: q });
  }

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
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <Icon name="sparkle" size={22} color="var(--accent)" />
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>Analysis</div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-mute)', paddingLeft: 2 }}>
          Ask anything about your portfolio
        </div>
      </div>

      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px' }}>

        {submitted ? (
          /* ── Confirmation ── */
          <div style={{ paddingTop: 20 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 999,
              background: 'var(--accent-soft)', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="check" size={28} color="var(--accent)" />
            </div>
            <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, letterSpacing: -0.4, marginBottom: 6 }}>
              Question saved
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 20 }}>
              {email
                ? "We'll reach you at " + email + " when analysis launches."
                : "We'll notify you when analysis launches."}
            </div>
            <div style={{
              padding: '14px 16px', borderRadius: 16,
              background: 'var(--surface)', border: '1px solid var(--hairline)',
              fontSize: 14, color: 'var(--text)', lineHeight: 1.5, fontStyle: 'italic',
            }}>
              "{savedQuery}"
            </div>
          </div>
        ) : (
          /* ── Compose ── */
          <>
            {/* Compose card */}
            <div style={{
              borderRadius: 20,
              border: '1.5px solid ' + (listening ? 'rgba(239,68,68,0.4)' : 'var(--border)'),
              background: 'var(--surface)',
              transition: 'border-color 0.2s',
              marginBottom: 20,
            }}>
              <textarea
                value={displayQuery}
                onChange={e => { if (!listening) setQuery(e.target.value); }}
                placeholder={listening ? '' : "What do you want to know about your portfolio?"}
                rows={4}
                style={{
                  width: '100%', border: 'none', background: 'transparent',
                  color: 'var(--text)', fontFamily: 'inherit',
                  fontSize: 14, lineHeight: 1.6,
                  padding: '16px 16px 10px', boxSizing: 'border-box',
                  outline: 'none', resize: 'none', display: 'block',
                }}
              />
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px 12px', gap: 10,
              }}>
                {listening ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 18 }}>
                      {[0,1,2,3,4].map(i => (
                        <div key={i} style={{
                          width: 3, borderRadius: 2, background: '#EF4444',
                          animation: 'bs-wave 0.8s ease ' + (i * 0.12) + 's infinite',
                          height: '100%',
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>Listening…</span>
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>
                    {speechOK ? 'Type or tap the mic' : 'Type your question'}
                  </span>
                )}
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

            {/* Suggestion prompts */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-mute)', marginBottom: 10, letterSpacing: 0.1 }}>
                Try asking
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ANALYSIS_SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => fillPrompt(s)} style={{
                    textAlign: 'left',
                    border: '1px solid var(--hairline)',
                    borderRadius: 12,
                    padding: '11px 14px',
                    background: 'var(--surface)',
                    cursor: 'pointer',
                    fontSize: 13,
                    color: 'var(--text-dim)',
                    fontFamily: 'inherit',
                    lineHeight: 1.45,
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Email + send */}
            <form onSubmit={handleSend}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email to get notified when live"
                  style={{
                    flex: 1, height: 46, borderRadius: 14,
                    border: '1px solid var(--border)', background: 'var(--surface)',
                    color: 'var(--text)', fontFamily: 'inherit', fontSize: 13.5,
                    padding: '0 14px', boxSizing: 'border-box', outline: 'none',
                  }}
                />
                <button type="submit" disabled={!canSend} style={{
                  height: 46, padding: '0 18px', borderRadius: 14, border: 'none',
                  background: canSend ? 'var(--accent)' : 'var(--elevated)',
                  color: canSend ? '#04140C' : 'var(--text-mute)',
                  fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
                  cursor: canSend ? 'pointer' : 'default',
                  transition: 'all 0.18s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  Send
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        )}
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
