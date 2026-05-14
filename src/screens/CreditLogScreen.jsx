// Credit log — balance hero, earn/spend filter, grouped transaction list.
import { useState, useMemo } from 'react';
import { TopBar } from '../components/TopBar';
import { IconBtn } from '../components/IconBtn';
import { Icon } from '../components/Icon';
import { Card } from '../components/Card';
import { Segmented } from '../components/Segmented';
import { BracketPill } from '../components/BracketPill';
import { useHaptic } from '../hooks/useHaptic';

export function CreditLogScreen({ me, log, onBack, onOpenEarnCredits }) {
  const [filter, setFilter] = useState('all');
  const haptic = useHaptic();
  const filtered = log.filter(l => filter === 'all' || (filter === 'earn' ? l.amount > 0 : l.amount < 0));

  // Group by date prefix
  const groups = useMemo(() => {
    const g = {};
    filtered.forEach(item => {
      const date = item.at.split(' · ')[0];
      if (!g[date]) g[date] = [];
      g[date].push(item);
    });
    return g;
  }, [filtered]);

  const totalEarned = log.filter(l => l.amount > 0).reduce((s, l) => s + l.amount, 0);
  const totalSpent = log.filter(l => l.amount < 0).reduce((s, l) => s + Math.abs(l.amount), 0);

  return (
    <div className="bs-screen">
      <TopBar leading={<IconBtn onClick={onBack}><Icon name="back" size={18} /></IconBtn>} title="Credit log" />
      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 0 80px' }}>
        {/* Balance hero */}
        <div style={{ padding: '0 20px 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Balance</div>
          <div className="tnum" style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1.4, lineHeight: 1 }}>{me.credits}</span>
            <span style={{ fontSize: 18, color: 'var(--gold)', fontWeight: 600 }}>◎</span>
            <span style={{ fontSize: 14, color: 'var(--text-mute)', marginLeft: 4 }}>credits</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
            <BracketPill label="Earned" value={`${totalEarned} ◎`} />
            <BracketPill label="Spent" value={`${totalSpent} ◎`} />
            <BracketPill label="Unlocks" value={String(log.filter(l => l.label.includes('Unlocked')).length)} />
          </div>
          {onOpenEarnCredits && (
            <button onClick={() => { haptic(); onOpenEarnCredits(); }} style={{
              marginTop: 12, background: 'none', border: 'none', padding: 0,
              color: 'var(--accent)', fontSize: 12.5, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span>◎</span> Earn more credits
              <Icon name="chevron-r" size={13} color="var(--accent)" />
            </button>
          )}
        </div>

        {/* Filter */}
        <div style={{ padding: '0 20px 14px' }}>
          <Segmented value={filter} onChange={setFilter} options={[
            {value:'all',label:'All'},
            {value:'earn',label:'Earned'},
            {value:'spend',label:'Spent'},
          ]} />
        </div>

        {/* Log */}
        <div style={{ padding: '0 20px' }}>
          {Object.entries(groups).map(([date, items]) => (
            <div key={date} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11.5, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.6, padding: '6px 4px 8px', fontWeight: 600 }}>{date}</div>
              <Card padding={0}>
                {items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 14px',
                    borderBottom: i === items.length - 1 ? 'none' : '1px solid var(--hairline)',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: item.amount > 0 ? 'var(--accent-soft)' : 'var(--gold-soft)',
                      color: item.amount > 0 ? 'var(--accent)' : 'var(--gold)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name={item.amount > 0 ? 'plus' : 'unlock'} size={15} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text)' }}>{item.label}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-mute)', marginTop: 1 }}>{item.at.split(' · ')[1] || ''}</div>
                    </div>
                    <div className="tnum" style={{
                      fontSize: 14.5, fontWeight: 700, letterSpacing: -0.2,
                      color: item.amount > 0 ? 'var(--accent)' : 'var(--text)',
                    }}>
                      {item.amount > 0 ? '+' : ''}{item.amount} ◎
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
