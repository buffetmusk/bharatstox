// screens3.jsx — Analysis + Earn Credits screens
/* global React */
const { useState, useRef } = React;

// ═══════════════════════════════════════════════════════════════════
// ANALYSIS — chat interface
// ═══════════════════════════════════════════════════════════════════

const ANALYSIS_CHIPS = [
  "Why am I underperforming Nifty?",
  "Which sectors am I missing?",
  "Am I buying at the wrong time?",
  "What is dragging my portfolio?",
];

function AnalysisScreen({ waitlistSubmitted, onSubmitWaitlist }) {
  const me = window.BS.me;
  const [msgs, setMsgs]           = useState([
    { from: 'bot', text: 'Hey ' + me.handle + '! Ask me anything about your portfolio — performance, sectors, timing, concentration, anything.' },
  ]);
  const [query, setQuery]         = useState('');
  const [interim, setInterim]     = useState('');
  const [listening, setListening] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [email, setEmail]         = useState('');
  const [done, setDone]           = useState(waitlistSubmitted || false);
  const recogRef  = useRef(null);
  const scrollRef = useRef(null);
  const haptic    = useHaptic();
  const speechOK  = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const displayQuery = query + (interim ? (query ? ' ' : '') + interim : '');
  const canSend = displayQuery.trim().length > 0 && !analyzing;

  function scrollBottom() {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 60);
  }

  function send() {
    const q = displayQuery.trim();
    if (!q || analyzing) return;
    haptic('success');
    setMsgs(prev => [...prev, { from: 'user', text: q }]);
    setQuery('');
    setInterim('');
    setAnalyzing(true);
    scrollBottom();
    onSubmitWaitlist && onSubmitWaitlist({ query: q });
  }

  function submitEmail(e) {
    e.preventDefault();
    if (!email) return;
    haptic('confirm');
    setDone(true);
    setMsgs(prev => [...prev, { from: 'bot', text: 'Perfect — analysis heading to ' + email + '. We will crunch the numbers and get back to you.' }]);
    scrollBottom();
  }

  function fillChip(s) {
    setQuery(s);
    haptic(8);
  }

  function toggleVoice() {
    if (listening) { recogRef.current && recogRef.current.stop(); return; }
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
      } else { setInterim(t); }
    };
    r.onend   = () => { setListening(false); setInterim(''); };
    r.onerror = () => { setListening(false); setInterim(''); };
    r.start();
    recogRef.current = r;
    setListening(true);
    haptic(10);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <style>{`
        @keyframes bs-mic-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.55); }
          70%  { box-shadow: 0 0 0 18px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        @keyframes bs-wave {
          0%,100% { transform: scaleY(0.3); }
          50%     { transform: scaleY(1.0); }
        }
        @keyframes bs-dot {
          0%, 60%, 100% { opacity: 0.25; transform: scale(0.8); }
          30%            { opacity: 1;    transform: scale(1.1); }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <Icon name="sparkle" size={20} color="var(--accent)" />
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Analysis</div>
      </div>

      {/* Chat thread */}
      <div ref={scrollRef} className="bs-scroll" style={{
        flex: 1, overflowY: 'auto',
        padding: '4px 16px 16px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '84%',
              padding: '10px 14px',
              borderRadius: m.from === 'user' ? '18px 18px 5px 18px' : '5px 18px 18px 18px',
              background: m.from === 'user' ? 'var(--accent)' : 'var(--surface)',
              border: m.from === 'bot' ? '1px solid var(--hairline)' : 'none',
              color: m.from === 'user' ? '#04140C' : 'var(--text)',
              fontSize: 14, lineHeight: 1.5,
            }}>
              {m.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {analyzing && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '5px 18px 18px 18px',
              background: 'var(--surface)', border: '1px solid var(--hairline)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: 'bs-dot 1.3s ease ' + (j * 0.2) + 's infinite',
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Email collection — appears as a bot message after analyzing starts */}
        {analyzing && !done && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              maxWidth: '90%',
              padding: '12px 14px',
              borderRadius: '5px 18px 18px 18px',
              background: 'var(--surface)', border: '1px solid var(--hairline)',
            }}>
              <div style={{ fontSize: 14, color: 'var(--text)', marginBottom: 10, lineHeight: 1.45 }}>
                Where should I send the analysis?
              </div>
              <form onSubmit={submitEmail} style={{ display: 'flex', gap: 7 }}>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1, height: 38, borderRadius: 10,
                    border: '1px solid var(--border)', background: 'var(--elevated)',
                    color: 'var(--text)', fontFamily: 'inherit', fontSize: 13,
                    padding: '0 11px', boxSizing: 'border-box', outline: 'none',
                  }}
                />
                <button type="submit" style={{
                  height: 38, padding: '0 14px', borderRadius: 10, border: 'none',
                  background: email ? 'var(--accent)' : 'var(--elevated)',
                  color: email ? '#04140C' : 'var(--text-mute)',
                  fontFamily: 'inherit', fontWeight: 700, fontSize: 13,
                  cursor: email ? 'pointer' : 'default', transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}>
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion chips — only before first send */}
      {!analyzing && (
        <div style={{ padding: '0 16px 8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2, WebkitOverflowScrolling: 'touch' }}>
            {ANALYSIS_CHIPS.map((s, i) => (
              <button key={i} onClick={() => fillChip(s)} style={{
                flexShrink: 0,
                height: 32, padding: '0 12px', borderRadius: 999,
                border: '1px solid var(--hairline)',
                background: 'var(--surface)', color: 'var(--text-dim)',
                fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compose bar */}
      <div style={{
        flexShrink: 0,
        padding: '8px 12px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        borderTop: '0.5px solid var(--hairline)',
        background: 'var(--backdrop-tab)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        display: 'flex', alignItems: 'flex-end', gap: 8,
      }}>
        <div style={{
          flex: 1,
          borderRadius: 20,
          border: '1px solid ' + (listening ? 'rgba(239,68,68,0.5)' : 'var(--border)'),
          background: 'var(--surface)',
          display: 'flex', alignItems: 'flex-end', padding: '6px 10px 6px 14px', gap: 6,
          transition: 'border-color 0.2s',
        }}>
          <textarea
            value={displayQuery}
            onChange={e => { if (!listening) setQuery(e.target.value); }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={listening ? '' : (analyzing ? 'Ask a follow-up...' : 'Ask about your portfolio...')}
            rows={1}
            style={{
              flex: 1, border: 'none', background: 'transparent',
              color: 'var(--text)', fontFamily: 'inherit', fontSize: 14,
              lineHeight: 1.5, outline: 'none', resize: 'none',
              padding: '3px 0', maxHeight: 80, overflowY: 'auto',
            }}
          />
          {listening && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 18, marginBottom: 3 }}>
              {[0,1,2,3,4].map(j => (
                <div key={j} style={{
                  width: 2.5, borderRadius: 2, background: '#EF4444',
                  animation: 'bs-wave 0.8s ease ' + (j * 0.1) + 's infinite',
                  height: '100%',
                }} />
              ))}
            </div>
          )}
          {speechOK && (
            <button onClick={toggleVoice} style={{
              width: 30, height: 30, borderRadius: 999, border: 'none',
              background: listening ? '#EF4444' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
              animation: listening ? 'bs-mic-pulse 1.4s ease infinite' : 'none',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={listening ? '#fff' : 'var(--text-mute)'}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="9" y1="22" x2="15" y2="22" />
              </svg>
            </button>
          )}
        </div>

        <button onClick={send} disabled={!canSend} style={{
          width: 40, height: 40, borderRadius: 999, border: 'none',
          background: canSend ? 'var(--accent)' : 'var(--elevated)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: canSend ? 'pointer' : 'default', flexShrink: 0,
          transition: 'background 0.18s',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={canSend ? '#04140C' : 'var(--text-mute)'}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
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
