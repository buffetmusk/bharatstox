// Credits engine storage — localStorage-backed state for the credit economy.
// Pure helpers; the React-facing API lives in hooks/useCredits.js.
import { BS } from '../data/mockData';

export const CREDITS_KEY = 'bharatstox.credits.v1';

export function seedCreditsState() {
  return {
    balance: BS.me.credits,
    unlocked: [],
    log: BS.creditLog.slice(),
    claimed: {},
    lastCheckinDate: null,
    streakCount: 0,
    seededVersion: 1,
  };
}

export function loadCreditsState() {
  try {
    const raw = localStorage.getItem(CREDITS_KEY);
    if (!raw) return seedCreditsState();
    return { ...seedCreditsState(), ...JSON.parse(raw) };
  } catch (e) {
    return seedCreditsState();
  }
}

export function saveCreditsState(state) {
  try {
    localStorage.setItem(CREDITS_KEY, JSON.stringify(state));
  } catch (e) {
    // private mode / quota exceeded — stay in-memory for the session
  }
}

export function makeEntry(kind, label, amount) {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return { kind, label, amount, at: `Today · ${hh}:${mm}` };
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
