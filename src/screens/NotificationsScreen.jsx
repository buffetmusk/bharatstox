// Notifications — filterable activity feed.
import { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { IconBtn } from '../components/IconBtn';
import { Icon } from '../components/Icon';
import { Segmented } from '../components/Segmented';
import { useHaptic } from '../hooks/useHaptic';

export function NotificationsScreen({ notifications, onBack, showBack = false }) {
  const [filter, setFilter] = useState('all');
  const filtered = notifications.filter(n => filter === 'all' || n.kind === filter);
  const unread = notifications.filter(n => n.unread).length;
  const haptic = useHaptic();

  return (
    <div className="bs-screen">
      <TopBar
        leading={showBack ? <IconBtn onClick={onBack}><Icon name="back" size={18} /></IconBtn> : <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>Activity</div>}
        trailing={unread > 0 ? <button onClick={() => haptic()} style={{ background: 'transparent', border: 0, color: 'var(--accent)', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Mark read</button> : null}
        title={showBack ? 'Activity' : undefined}
      />
      <div style={{ padding: '8px 20px 12px' }}>
        <Segmented value={filter} onChange={setFilter} options={[
          {value:'all',label:`All ${unread ? '· ' + unread : ''}`},
          {value:'follow',label:'Follows'},
          {value:'alert',label:'Alerts'},
          {value:'credit',label:'Credits'},
        ]} />
      </div>
      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 110px' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-mute)', fontSize: 13 }}>No notifications</div>
        )}
        {filtered.map(n => (
          <NotifRow key={n.id} n={n} />
        ))}
      </div>
    </div>
  );
}

function NotifRow({ n }) {
  const tones = {
    alert:  { bg: 'var(--loss-soft)',   fg: 'var(--loss)' },
    follow: { bg: 'var(--accent-soft)', fg: 'var(--accent)' },
    credit: { bg: 'var(--gold-soft)',   fg: 'var(--gold)' },
    system: { bg: 'var(--elevated)',    fg: 'var(--text-dim)' },
  }[n.kind] || { bg: 'var(--elevated)', fg: 'var(--text-dim)' };
  const iconName = {
    alert: 'bell', follow: 'arrow-up', credit: 'gift', system: 'sparkle',
  }[n.kind];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 0',
      borderBottom: '1px solid var(--hairline)',
      position: 'relative',
    }}>
      {n.unread && (
        <div style={{
          position: 'absolute', left: -8, top: 22,
          width: 5, height: 5, borderRadius: 999, background: 'var(--accent)',
        }} />
      )}
      <div style={{
        width: 38, height: 38, borderRadius: 12,
        background: tones.bg, color: tones.fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={iconName} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', flexShrink: 0 }}>{n.at}</div>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 3, lineHeight: 1.45 }}>{n.body}</div>
      </div>
    </div>
  );
}
