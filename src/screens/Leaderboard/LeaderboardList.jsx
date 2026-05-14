import { useRef, useState, useMemo, useLayoutEffect, useEffect } from 'react';
import { Icon } from '../../components/Icon';
import { useHaptic } from '../../hooks/useHaptic';
import { LeaderboardListRow } from './LeaderboardListRow';

// List view of the leaderboard — a calm, scrollable, directly-tappable
// alternative to the drum picker. The user's row is auto-centred on entry,
// and a floating pill offers a one-tap jump back when they scroll away.
export function LeaderboardList({ sortedRows, sort, onOpenTrader, onRequestUnlock }) {
  const scrollRef = useRef(null);
  const meRowRef = useRef(null);
  const haptic = useHaptic();
  const [meVisible, setMeVisible] = useState(true);
  const [meDir, setMeDir] = useState('down');

  const meIdx = useMemo(() => sortedRows.findIndex(r => r.isMe), [sortedRows]);

  function openRow(row) {
    if (row.isMe) onOpenTrader('me');
    else if (row.locked) onRequestUnlock(row);
    else onOpenTrader(row.handle);
  }

  // Centre the user's row on entry and whenever the sort order changes.
  useLayoutEffect(() => {
    meRowRef.current?.scrollIntoView({ block: 'center' });
  }, [sort]);

  // Track whether the user's row is on screen — drives the floating jump pill.
  useEffect(() => {
    const root = scrollRef.current;
    const el = meRowRef.current;
    if (!root || !el) return;
    const io = new IntersectionObserver(([entry]) => {
      setMeVisible(entry.isIntersecting);
      if (!entry.isIntersecting) {
        const rootBox = root.getBoundingClientRect();
        setMeDir(entry.boundingClientRect.top < rootBox.top ? 'up' : 'down');
      }
    }, { root, threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [sort]);

  function jumpToMe() {
    haptic();
    meRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
      <div ref={scrollRef} className="bs-scroll" style={{
        position: 'absolute', inset: 0, overflowY: 'auto',
        padding: '4px 16px 16px',
      }}>
        {sortedRows.map((r, i) => (
          <LeaderboardListRow
            key={r.handle + '-' + sort}
            row={r}
            rank={i + 1}
            sortMode={sort}
            isLast={i === sortedRows.length - 1}
            rowRef={r.isMe ? meRowRef : null}
            onOpen={openRow}
          />
        ))}
      </div>

      {/* Floating "jump to your row" pill */}
      {!meVisible && meIdx >= 0 && (
        <button onClick={jumpToMe} style={{
          position: 'absolute', left: '50%', bottom: 14,
          transform: 'translateX(-50%)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 34, padding: '0 14px 0 11px', borderRadius: 999,
          background: 'var(--accent)', color: '#04140C',
          border: 0, cursor: 'pointer', fontFamily: 'inherit',
          fontSize: 12.5, fontWeight: 700, letterSpacing: -0.1,
          boxShadow: '0 6px 20px rgba(0,0,0,0.28)',
          animation: 'bs-fade-in 0.2s ease both',
        }}>
          <Icon name={meDir === 'up' ? 'arrow-up' : 'arrow-dn'} size={14} color="#04140C" />
          <span className="tnum">You · #{meIdx + 1}</span>
        </button>
      )}
    </div>
  );
}
