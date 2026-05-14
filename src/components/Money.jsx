import { fmt } from '../data/mockData';

// Money — Bharat grouping with optional compact + sign.
export function Money({ value, compact = false, signed = false, decimals = 2, className = '' }) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  const abs = Math.abs(value);
  const out = compact ? fmt.inrCompact(abs, { decimals }) : fmt.inrGroup(abs);
  return <span className={'tnum ' + className}>{signed ? sign : ''}₹{out}</span>;
}
