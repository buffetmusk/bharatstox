// screens.jsx — all secondary screens for BharatStox
/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// ═══════════════════════════════════════════════════════════════════
// ONBOARDING — 3 slides
// ═══════════════════════════════════════════════════════════════════
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const fmt = window.BS.fmt;

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
        <button onClick={onDone} style={{
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
  const brokers = window.BS.brokers.slice(0, 6);
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

// ═══════════════════════════════════════════════════════════════════
// PORTFOLIO DETAIL — shared between Trader detail and My Portfolio
// ═══════════════════════════════════════════════════════════════════
function PortfolioScreen({ data, isMe = false, onBack, requestedRefresh, onRequestRefresh, onSelfRefresh, selfRefreshUsed, onAlert }) {
  const [tf, setTf] = useState('1M');
  const [tab, setTab] = useState('overview');
  const [hoverIdx, setHoverIdx] = useState(null);
  const fmt = window.BS.fmt;
  const haptic = useHaptic();

  const series     = data.charts[tf];
  const niftySeries = data.niftyCharts ? data.niftyCharts[tf] : null;
  const delta      = data.deltas[tf];

  // For hover: show % gain at that point vs period start
  const hoverGainPct = hoverIdx !== null
    ? ((series[hoverIdx] / series[0]) - 1) * 100
    : delta.pct;
  const hoverGainAbs = hoverIdx !== null
    ? series[hoverIdx] - series[0]
    : delta.abs;
  const hoverLabel = hoverIdx !== null
    ? pointLabel(tf, hoverIdx, series.length)
    : (tf === 'All' ? 'All time' : `Last ${tf}`);

  const allTimeGain = data.deltas['All'];

  return (
    <div className="bs-screen">
      <TopBar
        leading={<IconBtn onClick={onBack}><Icon name="back" size={18} /></IconBtn>}
        trailing={!isMe ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <IconBtn onClick={onAlert}><Icon name="bell" size={16} /></IconBtn>
          </div>
        ) : null}
        title={data.handle}
      />

      {/* Identity */}
      <div style={{ padding: '4px 20px 10px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar initial={data.handle[0]} tone={isMe ? 'mint' : 'sky'} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: -0.4 }}>{data.handle}</div>
          <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 1 }}>
            {isMe
              ? <span>Your portfolio · anonymous</span>
              : <span><span className="tnum">{data.followers.toLocaleString('en-IN')}</span> followers · Equity only</span>}
          </div>
        </div>
        {!isMe && (
          <Button
            size="sm"
            variant={requestedRefresh ? 'secondary' : 'primary'}
            onClick={() => { if (!requestedRefresh) { haptic('success'); onRequestRefresh && onRequestRefresh(); } }}
            icon={<Icon name={requestedRefresh ? 'check' : 'arc'} size={14} />}
          >
            {requestedRefresh ? 'Requested' : 'Request Refresh'}
          </Button>
        )}
        {isMe && (
          <Button
            size="sm"
            variant={selfRefreshUsed ? 'secondary' : 'primary'}
            onClick={() => { if (!selfRefreshUsed) { haptic('success'); onSelfRefresh && onSelfRefresh(); } }}
            icon={<Icon name={selfRefreshUsed ? 'check' : 'arc'} size={14} />}
            style={selfRefreshUsed ? { opacity: 0.6 } : {}}
          >
            {selfRefreshUsed ? 'Synced' : 'Refresh'}
          </Button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 0 24px' }}>

        {/* Gain Hero */}
        <div style={{ padding: '8px 20px 14px' }}>
          <GainHero gainPct={allTimeGain.pct} gainAbs={allTimeGain.abs} label="All-time return" />
        </div>

        {/* Invested vs Returns split bar */}
        {data.invested && (
          <div style={{ padding: '0 20px 16px' }}>
            <SplitBar invested={data.invested} current={data.portfolio} />
          </div>
        )}

        {/* Chart section */}
        <div style={{ padding: '0 20px 8px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-mute)', marginBottom: 2 }}>
            {hoverLabel}
            <span className="tnum" style={{
              marginLeft: 8, fontWeight: 600,
              color: hoverGainPct >= 0 ? 'var(--accent)' : 'var(--loss)',
            }}>
              {hoverGainPct >= 0 ? '+' : ''}{hoverGainPct.toFixed(2)}%
              {' · '}
              {hoverGainPct >= 0 ? '+' : '−'}₹{fmt.inrCompact(Math.abs(hoverGainAbs))}
            </span>
          </div>
        </div>

        <div style={{ padding: '0 0 4px' }}>
          {niftySeries ? (
            <DualLineChart
              portfolioData={series}
              niftyData={niftySeries}
              height={140}
              hoverIndex={hoverIdx}
              onHover={setHoverIdx}
              onLeave={() => setHoverIdx(null)}
            />
          ) : (
            <AreaChart data={series} height={140} hoverIndex={hoverIdx}
              onHover={setHoverIdx} onLeave={() => setHoverIdx(null)} />
          )}
        </div>

        <div style={{ padding: '6px 20px 16px' }}>
          <Segmented value={tf} onChange={setTf}
            options={[{value:'1W',label:'1W'},{value:'1M',label:'1M'},{value:'1Y',label:'1Y'},{value:'All',label:'All'}]} />
        </div>

        {/* Overview / Holdings / Activity tabs */}
        <div style={{ padding: '0 20px 4px' }}>
          <div style={{ display: 'flex', gap: 18, borderBottom: '1px solid var(--hairline)' }}>
            {['overview','holdings','activity'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '10px 0', background: 'transparent', border: 0, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, letterSpacing: -0.2,
                color: tab === t ? 'var(--text)' : 'var(--text-mute)',
                borderBottom: tab === t ? '2px solid var(--text)' : '2px solid transparent',
                marginBottom: -1, whiteSpace: 'nowrap',
              }}>
                {t === 'holdings' ? `Holdings · ${data.holdings.length}` : t === 'overview' ? 'Overview' : 'Activity'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 20px 20px' }}>
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {/* Period return stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {Object.entries(data.deltas).map(([k, d]) => (
                  <div key={k} style={{ padding: '12px 14px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--hairline)' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{k}</div>
                    <div className="tnum" style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5,
                      color: d.pct >= 0 ? 'var(--accent)' : 'var(--loss)' }}>
                      {d.pct >= 0 ? '+' : ''}{d.pct.toFixed(1)}%
                    </div>
                    <div className="tnum" style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>
                      {d.abs >= 0 ? '+' : '−'}₹{fmt.inrCompact(Math.abs(d.abs))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Sector allocation */}
              {data.sectorAllocation && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dim)', marginBottom: 12 }}>Sector allocation</div>
                  <SectorBars sectors={data.sectorAllocation} />
                </div>
              )}
            </div>
          )}
          {tab === 'holdings' && <HoldingsList items={data.holdings} />}
          {tab === 'activity' && <ActivityList items={data.activity} />}
        </div>
      </div>
    </div>
  );
}

function pointLabel(tf, i, n) {
  // Simple synthetic dates relative to today
  const today = new Date('2026-05-13');
  let d = new Date(today);
  if (tf === '1W') d.setDate(today.getDate() - (n - 1 - i));
  else if (tf === '1M') d.setDate(today.getDate() - (n - 1 - i));
  else if (tf === '1Y') d.setDate(today.getDate() - (n - 1 - i) * 7);
  else d.setMonth(today.getMonth() - (n - 1 - i));
  const fmtDate = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: tf === 'All' ? 'numeric' : undefined });
  return fmtDate;
}

function HoldingsList({ items }) {
  const max = Math.max(...items.map(h => h.pct));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items.map(h => (
        <div key={h.ticker} style={{ padding: '12px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.2 }}>{h.ticker}</div>
            <div style={{ fontSize: 12, color: 'var(--text-mute)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</div>
            <div className="tnum" style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: -0.3 }}>{h.pct.toFixed(1)}%</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              flex: 1, height: 3, borderRadius: 2,
              background: 'var(--elevated)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${(h.pct / max) * 100}%`,
                background: 'var(--text)',
                borderRadius: 2,
              }} />
            </div>
            <div className="tnum" style={{
              fontSize: 11.5, minWidth: 50, textAlign: 'right',
              color: h.day > 0 ? 'var(--accent)' : h.day < 0 ? 'var(--loss)' : 'var(--text-mute)',
            }}>{h.day === 0 ? '—' : (h.day > 0 ? '+' : '') + h.day.toFixed(2) + '%'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityList({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((a, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i === items.length - 1 ? 'none' : '1px solid var(--hairline)' }}>
          <div style={{
            width: 30, height: 30, borderRadius: 999,
            background: a.type === 'buy' ? 'var(--accent-soft)' : 'var(--loss-soft)',
            color: a.type === 'buy' ? 'var(--accent)' : 'var(--loss)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4,
          }}>
            <Icon name={a.type === 'buy' ? 'arrow-up' : 'arrow-dn'} size={14} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{a.type === 'buy' ? 'Added' : 'Trimmed'} <span style={{ color: 'var(--text)' }}>{a.ticker}</span></div>
            <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 1 }}>{a.at}</div>
          </div>
          <div className="tnum" style={{
            fontSize: 13.5, fontWeight: 600,
            color: a.type === 'buy' ? 'var(--accent)' : 'var(--loss)',
          }}>
            {a.type === 'buy' ? '+' : '−'}{a.pct.toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// REFER & EARN
// ═══════════════════════════════════════════════════════════════════
function ReferScreen({ me, network, invites, onBack, onShowToast }) {
  const fmt = window.BS.fmt;
  const [copied, setCopied] = useState(false);
  const link = `bharatstox.app/i/${me.referralCode}`;

  function copy() {
    try { navigator.clipboard?.writeText(link); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const totalEarned = network.filter(n => !n.self).length * 500;

  return (
    <div className="bs-screen">
      <TopBar leading={<IconBtn onClick={onBack}><Icon name="back" size={18} /></IconBtn>} title="Refer friends" />
      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 0 110px' }}>
        {/* Hero */}
        <div style={{ padding: '0 20px 4px' }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6, lineHeight: 1.15 }}>
            <span style={{ color: 'var(--text)' }}>Earn </span>
            <span style={{ color: 'var(--gold)' }}>500 ◎</span>
            <span style={{ color: 'var(--text)' }}> for every friend who joins.</span>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.5 }}>
            Credits unlock portfolios above your bracket. Friends get 200 ◎ on signup.
          </div>
        </div>

        {/* Network viz */}
        <div style={{ padding: '20px 20px 4px' }}>
          <NetworkViz network={network} me={me} />
        </div>

        {/* Stats strip */}
        <div style={{ padding: '12px 20px 4px', display: 'flex', gap: 8 }}>
          <BracketPill label="Joined" value={String(network.filter(n=>!n.self).length)} />
          <BracketPill label="Pending" value={String(invites.filter(i=>i.status==='pending').length)} />
          <BracketPill label="Earned" value={`${totalEarned} ◎`} />
        </div>

        {/* Link card */}
        <div style={{ padding: '20px 20px 8px' }}>
          <Card padding={14}>
            <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>Your invite link</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="mono" style={{ flex: 1, fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link}</div>
              <button onClick={copy} style={{
                height: 34, padding: '0 12px', borderRadius: 999,
                background: copied ? 'var(--accent)' : 'var(--elevated)',
                color: copied ? '#04140C' : 'var(--text)',
                border: 0, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                {copied ? <Icon name="check" size={13} /> : <Icon name="copy" size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button full size="md" variant="primary" icon={<Icon name="share" size={15} />}
                onClick={() => onShowToast && onShowToast('Link shared!')}>Share invite</Button>
              <Button size="md" variant="secondary" icon={<Icon name="qr" size={15} />}
                onClick={() => onShowToast && onShowToast('QR code ready')}>QR</Button>
            </div>
          </Card>
        </div>

        {/* Invited list */}
        <div style={{ padding: '12px 20px 4px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600, padding: '6px 4px 10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Invited</span>
            <span className="tnum" style={{ color: 'var(--text-mute)', fontWeight: 500 }}>{invites.length} total</span>
          </div>
          <Card padding={0}>
            {invites.map((inv, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 14px',
                borderBottom: i === invites.length - 1 ? 'none' : '1px solid var(--hairline)',
              }}>
                <Avatar initial={inv.handle[0].toUpperCase()} tone={inv.status === 'joined' ? 'mint' : 'sand'} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.handle}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-mute)', marginTop: 1 }}>{inv.status === 'joined' ? `Joined ${inv.joinedOn}` : `Invited ${inv.joinedOn} · awaiting signup`}</div>
                </div>
                {inv.status === 'joined' ? (
                  <div className="tnum" style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)' }}>+{inv.credits} ◎</div>
                ) : (
                  <div style={{
                    fontSize: 10.5, padding: '4px 8px', borderRadius: 999,
                    background: 'var(--elevated)', color: 'var(--text-mute)',
                    textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600,
                  }}>Pending</div>
                )}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// Network viz — portfolio comparison bar chart within your circle
function NetworkViz({ network }) {
  const fmt = window.BS.fmt;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  const sorted = [...network].sort((a, b) => b.bracket - a.bracket);
  const maxVal = sorted[0].bracket;
  const totalPortfolio = sorted.reduce((s, n) => s + n.bracket, 0);
  const myRank = sorted.findIndex(n => n.self) + 1;

  const toneColors = {
    mint: '#00E676', gold: '#FFB800', rose: '#FF8095',
    sky: '#5AB6FF', lilac: '#B58CFF', amber: '#FFA53D',
    sand: '#D8B07A', teal: '#4DD0C2',
  };

  return (
    <div style={{
      borderRadius: 20,
      background: 'var(--surface)',
      border: '1px solid var(--hairline)',
      overflow: 'hidden',
    }}>
      {/* Header stats */}
      <div style={{
        padding: '14px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--elevated)',
        borderBottom: '1px solid var(--hairline)',
      }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>
            Circle ranking
          </div>
          <div className="tnum" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginTop: 2, letterSpacing: -0.5 }}>
            #{myRank}
            <span style={{ fontSize: 12, color: 'var(--text-mute)', fontWeight: 500, letterSpacing: 0 }}> of {sorted.length}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>
            Combined AUM
          </div>
          <div className="tnum" style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', marginTop: 2, letterSpacing: -0.5 }}>
            ₹{fmt.inrCompact(totalPortfolio)}
          </div>
        </div>
      </div>

      {/* Ranked bar chart */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.map((person, i) => {
          const isYou = person.self;
          const barPct = mounted ? (person.bracket / maxVal) * 100 : 0;
          const color = toneColors[person.tone] || '#00E676';
          const delay = `${i * 0.06}s`;

          return (
            <div key={person.handle} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px',
              borderRadius: 12,
              background: isYou ? 'var(--accent-soft)' : 'transparent',
              border: isYou ? '1px solid rgba(0,230,118,0.18)' : '1px solid transparent',
              transition: 'background 0.2s ease',
            }}>
              {/* Rank */}
              <div style={{ fontSize: 10.5, color: 'var(--text-mute)', width: 14, textAlign: 'right', fontWeight: 600, flexShrink: 0 }}>
                {i + 1}
              </div>
              {/* Avatar */}
              <div style={{
                width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                background: `${color}1A`,
                color: color, fontSize: 10.5, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${color}40`,
                boxSizing: 'border-box',
              }}>
                {isYou ? 'Y' : person.handle[0]}
              </div>
              {/* Bar + labels */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: isYou ? 700 : 500, color: isYou ? 'var(--accent)' : 'var(--text)' }}>
                    {isYou ? 'You' : person.handle}
                  </span>
                  <span className="tnum" style={{ fontSize: 11.5, color: isYou ? 'var(--accent)' : 'var(--text-dim)', fontWeight: 600, letterSpacing: -0.2 }}>
                    ₹{fmt.inrCompact(person.bracket)}
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: 'var(--elevated)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${barPct}%`,
                    borderRadius: 2,
                    background: isYou
                      ? 'var(--accent)'
                      : `linear-gradient(90deg, ${color}60, ${color})`,
                    transition: `width 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.Onboarding = Onboarding;
window.PortfolioScreen = PortfolioScreen;
window.ReferScreen = ReferScreen;
window.BracketPill = BracketPill;
