// Portfolio detail — shared between Trader detail and My Portfolio.
import { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { IconBtn } from '../components/IconBtn';
import { Icon } from '../components/Icon';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Segmented } from '../components/Segmented';
import { GainHero } from '../components/GainHero';
import { SplitBar } from '../components/charts/SplitBar';
import { SectorBars } from '../components/charts/SectorBars';
import { AreaChart } from '../components/charts/AreaChart';
import { DualLineChart } from '../components/charts/DualLineChart';
import { useHaptic } from '../hooks/useHaptic';
import { fmt } from '../data/mockData';

// Each detail tab carries its own identity colour so the active section reads
// at a glance — neutral overview, accent-green holdings, gold activity.
const TAB_COLORS = {
  overview: 'var(--text)',
  holdings: 'var(--accent)',
  activity: 'var(--gold)',
};

export function PortfolioScreen({ data, isMe = false, onBack, requestedRefresh, onRequestRefresh, onSelfRefresh, selfRefreshUsed, onAlert }) {
  const [tf, setTf] = useState('1M');
  const [tab, setTab] = useState('overview');
  const [hoverIdx, setHoverIdx] = useState(null);
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
        <Avatar seed={data.handle} size={48} />
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
            haptic="success"
            variant={requestedRefresh ? 'secondary' : 'primary'}
            onClick={() => { if (!requestedRefresh) { onRequestRefresh && onRequestRefresh(); } }}
            icon={<Icon name={requestedRefresh ? 'check' : 'arc'} size={14} />}
          >
            {requestedRefresh ? 'Requested' : 'Request Refresh'}
          </Button>
        )}
        {isMe && (
          <Button
            size="sm"
            haptic="success"
            variant={selfRefreshUsed ? 'secondary' : 'primary'}
            onClick={() => { if (!selfRefreshUsed) { onSelfRefresh && onSelfRefresh(); } }}
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
            {['overview','holdings','activity'].map(t => {
              const active = tab === t;
              const c = TAB_COLORS[t];
              // Holdings & Activity are content-rich destinations — keep them
              // gently tinted in their identity colour even when inactive, so
              // they read as inviting rather than dormant and pull the tap.
              const tinted = !active && t !== 'overview';
              const label = t === 'holdings'
                ? `Holdings · ${data.holdings.length}`
                : t === 'activity'
                  ? `Activity · ${data.activity.length}`
                  : 'Overview';
              return (
                <button key={t} onClick={() => { if (!active) haptic(); setTab(t); }} style={{
                  padding: '10px 0', background: 'transparent', border: 0, cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, letterSpacing: -0.2,
                  color: active || tinted ? c : 'var(--text-mute)',
                  opacity: active ? 1 : tinted ? 0.55 : 1,
                  borderBottom: active ? `2px solid ${c}` : '2px solid transparent',
                  marginBottom: -1, whiteSpace: 'nowrap',
                  transition: 'color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease',
                }}>
                  {label}
                </button>
              );
            })}
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
  const d = new Date(today);
  if (tf === '1W') d.setDate(today.getDate() - (n - 1 - i));
  else if (tf === '1M') d.setDate(today.getDate() - (n - 1 - i));
  else if (tf === '1Y') d.setDate(today.getDate() - (n - 1 - i) * 7);
  else d.setMonth(today.getMonth() - (n - 1 - i));
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: tf === 'All' ? 'numeric' : undefined });
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
