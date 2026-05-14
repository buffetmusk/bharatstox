// Leaderboard container — header, sort + view-layout toggles, and either the
// 3D drum picker or the scrollable list view. Owns the unlock confirmation
// sheet so both views share one modal.
import { useState, useMemo } from 'react';
import { CreditsPill } from '../../components/CreditsPill';
import { Segmented } from '../../components/Segmented';
import { Icon } from '../../components/Icon';
import { LeaderboardDrum } from './LeaderboardDrum';
import { LeaderboardList } from './LeaderboardList';
import { UnlockSheet } from './UnlockSheet';

const VIEW_OPTIONS = [
  { value: 'drum', label: <Icon name="picker" size={16} /> },
  { value: 'list', label: <Icon name="list" size={16} /> },
];

export function Leaderboard({ rows, me, credits, onOpenTrader, onSpendCredits, onOpenCreditLog, onOpenEarnCredits, sort = 'value', onChangeSort }) {
  const [view, setView] = useState('drum');
  const [confirmRow, setConfirmRow] = useState(null);

  // value: rows arrive pre-sorted by portfolio desc. gains: re-rank by all-time %.
  const sortedRows = useMemo(() => (
    sort === 'gains' ? [...rows].sort((a, b) => b.allGainPct - a.allGainPct) : rows
  ), [rows, sort]);
  const gainsRanked = useMemo(() => [...rows].sort((a, b) => b.allGainPct - a.allGainPct), [rows]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>

      {/* Header */}
      <div style={{ padding: '0 20px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>Leaderboard</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-mute)', marginTop: 3 }}>
            You stand at{' '}
            <span className="tnum" style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>
              #{(sort === 'gains' ? me.gainsRank : me.rank).toLocaleString('en-IN')}
            </span>
            {' '}out of{' '}
            <span style={{ fontWeight: 600, color: 'var(--text-dim)' }}>7,700</span>
          </div>
        </div>
        <CreditsPill value={credits} onClick={onOpenCreditLog} />
      </div>

      {/* Sort + layout toggles */}
      <div style={{ padding: '6px 20px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Segmented
            value={sort}
            onChange={v => onChangeSort && onChangeSort(v)}
            options={[{ value: 'value', label: 'By Value' }, { value: 'gains', label: 'By Gains' }]}
          />
        </div>
        <Segmented
          fullWidth={false}
          value={view}
          onChange={setView}
          options={VIEW_OPTIONS}
        />
      </div>

      {/* Active view */}
      {view === 'drum' ? (
        <LeaderboardDrum
          sortedRows={sortedRows}
          rows={rows}
          gainsRanked={gainsRanked}
          sort={sort}
          credits={credits}
          onOpenTrader={onOpenTrader}
          onRequestUnlock={setConfirmRow}
          onOpenEarnCredits={onOpenEarnCredits}
        />
      ) : (
        <LeaderboardList
          sortedRows={sortedRows}
          sort={sort}
          onOpenTrader={onOpenTrader}
          onRequestUnlock={setConfirmRow}
        />
      )}

      {/* Unlock confirmation sheet — shared by both views */}
      {confirmRow && (
        <UnlockSheet
          row={confirmRow}
          credits={credits}
          onConfirm={() => { setConfirmRow(null); onSpendCredits(confirmRow); }}
          onCancel={() => setConfirmRow(null)}
          onEarn={onOpenEarnCredits}
        />
      )}
    </div>
  );
}
