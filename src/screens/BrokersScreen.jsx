// Broker connect screen — connected + available broker lists.
import { TopBar } from '../components/TopBar';
import { IconBtn } from '../components/IconBtn';
import { Icon } from '../components/Icon';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Section } from '../components/Section';
import { Row } from '../components/Row';

export function BrokersScreen({ brokers, onBack, onToggle }) {
  return (
    <div className="bs-screen">
      <TopBar leading={<IconBtn onClick={onBack}><Icon name="back" size={18} /></IconBtn>} title="Brokers" />
      <div className="bs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 0 80px' }}>
        <div style={{ padding: '4px 20px 16px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Connect your brokers</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.5 }}>
            Read-only access via SEBI account aggregator framework. We never see your password and can never trade on your behalf.
          </div>
        </div>
        <Section label="Connected">
          <Card padding={0}>
            {brokers.filter(b => b.connected).map((b, i, arr) => (
              <BrokerRow key={b.id} broker={b} onToggle={() => onToggle(b.id)} divider={i < arr.length - 1} />
            ))}
            {brokers.filter(b => b.connected).length === 0 && (
              <div style={{ padding: '20px 16px', fontSize: 13, color: 'var(--text-mute)', textAlign: 'center' }}>No brokers connected yet.</div>
            )}
          </Card>
        </Section>
        <Section label="Available">
          <Card padding={0}>
            {brokers.filter(b => !b.connected).map((b, i, arr) => (
              <BrokerRow key={b.id} broker={b} onToggle={() => onToggle(b.id)} divider={i < arr.length - 1} />
            ))}
          </Card>
        </Section>
      </div>
    </div>
  );
}

function BrokerRow({ broker, onToggle, divider }) {
  return (
    <Row
      left={<div style={{ width: 36, height: 36, borderRadius: 10, background: broker.accent, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>{broker.name[0]}</div>}
      title={broker.name}
      subtitle={broker.connected ? `Synced ${broker.syncedAt}` : 'Bank-level read-only access'}
      right={
        broker.connected
          ? <Button size="sm" variant="ghost" onClick={onToggle}>Disconnect</Button>
          : <Button size="sm" variant="secondary" onClick={onToggle}>Connect</Button>
      }
      divider={divider}
    />
  );
}
