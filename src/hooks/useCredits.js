import { useState, useEffect, useRef, useCallback } from 'react';
import {
  loadCreditsState,
  saveCreditsState,
  seedCreditsState,
  makeEntry,
  todayKey,
} from '../lib/credits';

// Single source of truth for the credit economy: balance, the unlocked-trader
// set, and the transaction log — all persisted to localStorage.
//
// IMPORTANT: useCredits() must be called exactly ONCE, at the top of App().
// The returned api is prop-drilled down. Calling it in more than one component
// creates independent, desynced states.
export function useCredits() {
  const [state, setState] = useState(loadCreditsState);
  const ref = useRef(state);
  ref.current = state;

  useEffect(() => { saveCreditsState(state); }, [state]);

  // earn(label, amount, { onceKey }) — onceKey guards one-time grants.
  // Returns true if granted, false if the onceKey was already claimed.
  const earn = useCallback((label, amount, opts = {}) => {
    const s = ref.current;
    if (opts.onceKey && s.claimed[opts.onceKey]) return false;
    setState(prev => ({
      ...prev,
      balance: prev.balance + amount,
      log: [makeEntry('earn', label, amount), ...prev.log],
      claimed: opts.onceKey ? { ...prev.claimed, [opts.onceKey]: true } : prev.claimed,
    }));
    return true;
  }, []);

  // spend(label, cost, { unlockHandle }) — no-op + false if balance < cost.
  // If unlockHandle is already unlocked, succeeds without re-charging.
  const spend = useCallback((label, cost, opts = {}) => {
    const s = ref.current;
    if (opts.unlockHandle && s.unlocked.includes(opts.unlockHandle)) return true;
    if (s.balance < cost) return false;
    setState(prev => ({
      ...prev,
      balance: prev.balance - cost,
      log: [makeEntry('spend', label, -cost), ...prev.log],
      unlocked: opts.unlockHandle
        ? Array.from(new Set([...prev.unlocked, opts.unlockHandle]))
        : prev.unlocked,
    }));
    return true;
  }, []);

  // claimDailyCheckin() — flat +10, at most once per calendar day.
  const claimDailyCheckin = useCallback(() => {
    const s = ref.current;
    const today = todayKey();
    if (s.lastCheckinDate === today) return false;
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const streak = s.lastCheckinDate === yesterday ? s.streakCount + 1 : 1;
    setState(prev => ({
      ...prev,
      balance: prev.balance + 10,
      streakCount: streak,
      lastCheckinDate: today,
      log: [makeEntry('earn', `Daily check-in · ${streak} day${streak > 1 ? 's' : ''}`, 10), ...prev.log],
    }));
    return true;
  }, []);

  const markClaimed = useCallback((key) => {
    setState(prev => prev.claimed[key] ? prev : { ...prev, claimed: { ...prev.claimed, [key]: true } });
  }, []);

  const resetCredits = useCallback(() => setState(seedCreditsState()), []);

  return {
    balance: state.balance,
    log: state.log,
    unlocked: new Set(state.unlocked),
    claimed: state.claimed,
    streakCount: state.streakCount,
    checkedInToday: state.lastCheckinDate === todayKey(),
    earn, spend, claimDailyCheckin, markClaimed, resetCredits,
  };
}
