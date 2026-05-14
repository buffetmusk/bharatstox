// Mock data for BharatStox prototype

// ── Helpers ──
function inrGroup(n) {
  n = Math.round(n);
  const s = String(Math.abs(n));
  if (s.length <= 3) return (n < 0 ? '-' : '') + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return (n < 0 ? '-' : '') + rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
}
function inrCompact(n, opts = {}) {
  const { decimals = 2 } = opts;
  const sign = n < 0 ? '-' : '';
  n = Math.abs(n);
  if (n >= 1e7)  return sign + (n / 1e7).toFixed(decimals).replace(/\.?0+$/, '') + ' Cr';
  if (n >= 1e5)  return sign + (n / 1e5).toFixed(decimals).replace(/\.?0+$/, '') + ' L';
  if (n >= 1e3)  return sign + (n / 1e3).toFixed(1).replace(/\.?0+$/, '') + 'K';
  return sign + n.toFixed(0);
}
function inr(n) { return '₹' + inrGroup(n); }
function signedPct(pct) {
  return (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%';
}

// ── User ──
const me = {
  handle: 'Tigerstripe',
  portfolio: 1235380,
  portfolioDelta: 84120,
  portfolioDeltaPct: 7.31,
  invested: 609_000,        // total capital deployed
  credits: 500,
  bracket: '10–15 L',
  rank: 8412,
  pctile: 76,
  referralCode: 'TIGER580',
  invitesJoined: 4,
  invitesPending: 2,
};

// ── Leaderboard ──
const namePool = [
  'Northstar', 'Bluefin', 'Cobalt', 'Heron', 'Lantern', 'Magnolia', 'Saffron',
  'Onyx', 'Quill', 'Ember', 'Verdant', 'Bishop', 'Drift', 'Falcon', 'Glacier',
  'Halcyon', 'Indigo', 'Jasper', 'Kestrel', 'Lotus', 'Mosaic', 'Nimbus', 'Orchid',
  'Pelican', 'Quartz', 'Rook', 'Sable', 'Umbra', 'Vesper', 'Willow',
  'Xeric', 'Yarrow', 'Zenith', 'Aspen', 'Birch', 'Coral', 'Dune', 'Foxglove',
  'Gale', 'Helio', 'Iris', 'Junco', 'Kelp', 'Larch', 'Mistral', 'Nettle',
];
const N = 46;
const top = 22_00_00_000;
const bottom = 40_000;

const values = [];
for (let i = 0; i < N; i++) {
  values.push(Math.round(top * Math.pow(bottom / top, i / (N - 1))));
}
let userIdx = 0, bestDelta = Infinity;
values.forEach((v, i) => {
  const d = Math.abs(Math.log(v) - Math.log(me.portfolio));
  if (d < bestDelta) { bestDelta = d; userIdx = i; }
});
values[userIdx] = me.portfolio;
for (let i = 0; i < N; i++) {
  if (i === userIdx) continue;
  const jitter = 1 + ((Math.sin(i * 7.3) + Math.cos(i * 1.7)) * 0.02);
  let v = Math.round(values[i] * jitter);
  if (i > 0 && v >= values[i - 1]) v = Math.round(values[i - 1] * 0.985);
  if (i > 0 && v <= (values[i + 1] ?? 0)) v = Math.max(v, Math.round((values[i + 1] ?? 0) * 1.015));
  values[i] = Math.max(bottom, v);
}

const rows = values.map((v, i) => {
  const isMe = i === userIdx;
  const handle = isMe ? me.handle : namePool[i % namePool.length];
  const day = +(((i % 11) - 4.5) * 0.7 + (Math.sin(i * 2.71) * 0.6)).toFixed(2);
  // allGainPct: top traders have huge gains, scales down toward bottom, jittered
  const gainBase = isMe
    ? 102.7
    : Math.max(8, 15 + 400 * Math.pow((N - 1 - i) / (N - 1), 1.6) + (Math.sin(i * 4.1) * 18));
  const allGainPct = +gainBase.toFixed(1);
  return {
    handle,
    portfolio: v,
    day,
    allGainPct,
    followers: Math.round(20 + Math.pow(v / 1e5, 0.55) * 12),
    isMe,
    locked: i < userIdx,
    unlockCost: i < userIdx ? 100 : 0,
  };
});

me.rank = Math.round((userIdx / N) * 11_200 + 1200);

const gainsRanked = [...rows].sort((a, b) => b.allGainPct - a.allGainPct);
const meGainsIdx  = gainsRanked.findIndex(r => r.isMe);
me.gainsRank = Math.round((meGainsIdx / N) * 11_200 + 1200);

// ── Chart helpers ──
function makeChart(seedVal, points, drift, vol) {
  const arr = [];
  let v = seedVal;
  for (let i = 0; i < points; i++) {
    v *= (1 + drift / points + (Math.random() - 0.5) * vol);
    arr.push(v);
  }
  return arr;
}

// Nifty 50 chart — separate seeded random so it doesn't correlate with portfolio
function makeNifty(seedVal, points, drift, vol) {
  const arr = [];
  let v = seedVal;
  for (let i = 0; i < points; i++) {
    v *= (1 + drift / points + (Math.sin(i * 3.7 + 1.2) * vol * 0.8));
    arr.push(v);
  }
  return arr;
}

// ── Trader detail (Northstar) ──
const charts = {
  '1W':  makeChart(2_500_000, 7,  0.02,  0.018),
  '1M':  makeChart(2_400_000, 30, 0.06,  0.022),
  '1Y':  makeChart(1_650_000, 52, 0.55,  0.04),
  'All': makeChart(280_000,   96, 8.2,   0.06),
};
Object.keys(charts).forEach(k => {
  const arr = charts[k];
  const target = 2_590_000;
  const scale = target / arr[arr.length - 1];
  charts[k] = arr.map(v => v * scale);
});

// Nifty charts — matching timeframes, end near 24,200
const niftyBase = { '1W': 24_000, '1M': 23_500, '1Y': 21_800, 'All': 14_900 };
const niftyEnd  = 24_200;
const niftyDrift = { '1W': 0.008, '1M': 0.03, '1Y': 0.11, 'All': 0.62 };
const niftyPts   = { '1W': 7, '1M': 30, '1Y': 52, 'All': 96 };
const niftyVol   = { '1W': 0.006, '1M': 0.009, '1Y': 0.022, 'All': 0.03 };
const traderNiftyCharts = {};
const myNiftyCharts = {};
['1W','1M','1Y','All'].forEach(k => {
  const arr = makeNifty(niftyBase[k], niftyPts[k], niftyDrift[k], niftyVol[k]);
  const scale = niftyEnd / arr[arr.length - 1];
  const scaled = arr.map(v => v * scale);
  traderNiftyCharts[k] = scaled;
  myNiftyCharts[k] = scaled; // same index for both (both compare to same Nifty)
});

const traderDetail = {
  handle: 'Northstar',
  portfolio: 2_590_000,
  invested: 890_000,
  deltas: {
    '1W':  { abs: 24_000,    pct: 0.94 },
    '1M':  { abs: 142_000,   pct: 5.80 },
    '1Y':  { abs: 940_000,   pct: 56.9 },
    'All': { abs: 1_700_000, pct: 191.0 },
  },
  charts,
  niftyCharts: traderNiftyCharts,
  sectorAllocation: [
    { sector: 'IT',     pct: 21.7, color: '#5AB6FF' },
    { sector: 'Energy', pct: 20.4, color: '#FFA53D' },
    { sector: 'Bank',   pct: 15.8, color: '#FFB800' },
    { sector: 'NBFC',   pct:  8.2, color: '#B58CFF' },
    { sector: 'FMCG',   pct:  7.4, color: '#00E676' },
    { sector: 'Infra',  pct:  6.0, color: '#4DD0C2' },
    { sector: 'Paints', pct:  5.1, color: '#FF8095' },
    { sector: 'Cons.',  pct:  4.2, color: '#D8B07A' },
    { sector: 'Pharma', pct:  3.6, color: '#00E676' },
    { sector: 'Cash',   pct:  7.6, color: '#666' },
  ],
  followers: 1248,
  isFollowing: false,
  holdings: [
    { ticker: 'RELIANCE',  name: 'Reliance Industries',     pct: 20.4, day: +0.82, sector: 'Energy' },
    { ticker: 'HDFCBANK',  name: 'HDFC Bank',                pct: 15.8, day: -0.31, sector: 'Bank' },
    { ticker: 'INFY',      name: 'Infosys',                  pct: 12.1, day: +1.42, sector: 'IT' },
    { ticker: 'TCS',       name: 'Tata Consultancy',         pct:  9.6, day: +0.18, sector: 'IT' },
    { ticker: 'BAJFINANCE',name: 'Bajaj Finance',            pct:  8.2, day: -1.04, sector: 'NBFC' },
    { ticker: 'ITC',       name: 'ITC',                      pct:  7.4, day: +0.66, sector: 'FMCG' },
    { ticker: 'LT',        name: 'Larsen & Toubro',          pct:  6.0, day: +0.28, sector: 'Infra' },
    { ticker: 'ASIANPAINT',name: 'Asian Paints',             pct:  5.1, day: -0.92, sector: 'Paints' },
    { ticker: 'TITAN',     name: 'Titan Company',            pct:  4.2, day: +2.10, sector: 'Cons.' },
    { ticker: 'SUNPHARMA', name: 'Sun Pharmaceutical',       pct:  3.6, day: +0.40, sector: 'Pharma' },
    { ticker: 'DMART',     name: 'Avenue Supermarts',        pct:  3.0, day: -0.15, sector: 'Retail' },
    { ticker: 'CASH',      name: 'Cash & equivalents',       pct:  4.6, day:  0.00, sector: '—' },
  ],
  activity: [
    { type: 'buy',  ticker: 'TITAN',      pct: 0.6, at: '2h ago' },
    { type: 'sell', ticker: 'ASIANPAINT', pct: 1.1, at: 'Yesterday' },
    { type: 'buy',  ticker: 'INFY',       pct: 0.4, at: '2d ago' },
    { type: 'buy',  ticker: 'LT',         pct: 0.8, at: '4d ago' },
    { type: 'sell', ticker: 'HDFCBANK',   pct: 0.3, at: '1w ago' },
    { type: 'buy',  ticker: 'RELIANCE',   pct: 1.4, at: '2w ago' },
    { type: 'buy',  ticker: 'SUNPHARMA',  pct: 0.5, at: '3w ago' },
  ],
};

// ── My portfolio ──
const myCharts = {
  '1W':  makeChart(1_220_000, 7,  0.012, 0.012),
  '1M':  makeChart(1_180_000, 30, 0.043, 0.016),
  '1Y':  makeChart(  890_000, 52, 0.388, 0.035),
  'All': makeChart(  610_000, 96, 1.02,  0.05),
};
Object.keys(myCharts).forEach(k => {
  const arr = myCharts[k];
  const target = me.portfolio;
  const scale = target / arr[arr.length - 1];
  myCharts[k] = arr.map(v => v * scale);
});

const myPortfolio = {
  handle: me.handle,
  portfolio: me.portfolio,
  invested: me.invested,
  deltas: {
    '1W':  { abs:  13_800, pct: 1.13 },
    '1M':  { abs:  52_100, pct: 4.40 },
    '1Y':  { abs: 348_200, pct: 39.3 },
    'All': { abs: 626_400, pct: 102.7 },
  },
  charts: myCharts,
  niftyCharts: myNiftyCharts,
  sectorAllocation: [
    { sector: 'Bank',   pct: 25.2, color: '#FFB800' },
    { sector: 'IT',     pct: 22.6, color: '#5AB6FF' },
    { sector: 'Energy', pct: 11.8, color: '#FFA53D' },
    { sector: 'FMCG',   pct:  9.4, color: '#00E676' },
    { sector: 'NBFC',   pct:  6.5, color: '#B58CFF' },
    { sector: 'Cons.',  pct:  5.3, color: '#D8B07A' },
    { sector: 'Infra',  pct:  4.8, color: '#4DD0C2' },
    { sector: 'Auto',   pct:  3.9, color: '#FF8095' },
    { sector: 'Cash',   pct: 10.5, color: '#666' },
  ],
  holdings: [
    { ticker: 'HDFCBANK',  name: 'HDFC Bank',           pct: 18.2, day: -0.31, sector: 'Bank' },
    { ticker: 'INFY',      name: 'Infosys',             pct: 14.5, day: +1.42, sector: 'IT' },
    { ticker: 'RELIANCE',  name: 'Reliance Industries', pct: 11.8, day: +0.82, sector: 'Energy' },
    { ticker: 'ITC',       name: 'ITC',                 pct:  9.4, day: +0.66, sector: 'FMCG' },
    { ticker: 'TCS',       name: 'Tata Consultancy',    pct:  8.1, day: +0.18, sector: 'IT' },
    { ticker: 'KOTAKBANK', name: 'Kotak Mahindra',      pct:  7.0, day: -0.40, sector: 'Bank' },
    { ticker: 'BAJFINANCE',name: 'Bajaj Finance',       pct:  6.5, day: -1.04, sector: 'NBFC' },
    { ticker: 'TITAN',     name: 'Titan Company',       pct:  5.3, day: +2.10, sector: 'Cons.' },
    { ticker: 'LT',        name: 'Larsen & Toubro',     pct:  4.8, day: +0.28, sector: 'Infra' },
    { ticker: 'MARUTI',    name: 'Maruti Suzuki',       pct:  3.9, day: +0.55, sector: 'Auto' },
    { ticker: 'CASH',      name: 'Cash & equivalents',  pct: 10.5, day:  0.00, sector: '—' },
  ],
  activity: [
    { type: 'buy',  ticker: 'TITAN',    pct: 1.2, at: 'Today, 10:32' },
    { type: 'buy',  ticker: 'INFY',     pct: 0.6, at: 'Yesterday' },
    { type: 'sell', ticker: 'ZOMATO',   pct: 2.4, at: '2d ago' },
    { type: 'buy',  ticker: 'HDFCBANK', pct: 0.8, at: '5d ago' },
  ],
};

// ── Refer & earn ──
const invites = [
  { handle: 'Heron',       status: 'joined',  joinedOn: '12 May', credits: 500 },
  { handle: 'Saffron',     status: 'joined',  joinedOn: '04 May', credits: 500 },
  { handle: 'Drift',       status: 'pending', joinedOn: '28 Apr', credits: 0 },
  { handle: 'Quill',       status: 'pending', joinedOn: '19 Apr', credits: 0 },
  { handle: '+91 ••• 4421',status: 'pending', joinedOn: '14 May', credits: 0 },
  { handle: 'rohan@…',     status: 'pending', joinedOn: '11 May', credits: 0 },
];

const network = [
  { handle: 'Heron',   bracket: 7_00_000,    tone: 'rose'  },
  { handle: 'Saffron', bracket: 17_00_000,   tone: 'gold'  },
  { handle: 'Drift',   bracket: 4_20_000,    tone: 'sand'  },
  { handle: 'Quill',   bracket: 12_00_000,   tone: 'lilac' },
  { handle: 'You',     bracket: me.portfolio, tone: 'mint', self: true },
];

// ── Credit log ──
// Fresh-account seed — the live log (earn/spend events) is built at runtime
// by the useCredits hook and persisted to localStorage.
const creditLog = [
  { kind: 'earn', label: 'Sign-up bonus', amount: +500, at: 'Today · 09:00' },
];

// ── Notifications ──
const notifications = [
  { id: 1, kind: 'alert',  icon: '!', title: 'RELIANCE hit ₹2,850',    body: 'Your price alert triggered. +1.2% today.', at: '2m ago',    unread: true  },
  { id: 2, kind: 'follow', icon: '+', title: 'Northstar bought TITAN', body: 'Trader you follow added 0.6% to position.', at: '12m ago',   unread: true  },
  { id: 3, kind: 'credit', icon: '◎', title: 'Earned 500 credits',     body: 'Quill joined using your referral code.', at: '1h ago',     unread: true  },
  { id: 4, kind: 'system', icon: '↗', title: 'You ranked up',          body: 'Now in the top 24% of ₹10–15L bracket.', at: '4h ago',    unread: false },
  { id: 5, kind: 'follow', icon: '+', title: 'Bluefin sold HDFCBANK',  body: 'Trader you follow trimmed 0.4% of position.', at: 'Yesterday', unread: false },
  { id: 6, kind: 'alert',  icon: '!', title: 'INFY crossed ₹1,820',    body: 'Daily change: +1.42%.', at: 'Yesterday',    unread: false },
  { id: 7, kind: 'system', icon: '◎', title: 'Weekly digest ready',    body: 'See how your bracket performed this week.', at: '2d ago',   unread: false },
];

// ── Brokers ──
const brokers = [
  { id: 'zerodha', name: 'Zerodha',      accent: '#FF8B0D', connected: true,  syncedAt: 'Just now' },
  { id: 'groww',   name: 'Groww',        accent: '#00B386', connected: true,  syncedAt: '2h ago'   },
  { id: 'upstox',  name: 'Upstox',       accent: '#722BFF', connected: false, syncedAt: null       },
  { id: 'angel',   name: 'Angel One',    accent: '#E11E26', connected: false, syncedAt: null       },
  { id: 'icici',   name: 'ICICI Direct', accent: '#B02A30', connected: false, syncedAt: null       },
  { id: 'dhan',    name: 'Dhan',         accent: '#0061FF', connected: false, syncedAt: null       },
];

// ── Analysis teaser ──
const analysisTeaser = {
  todayPulse: {
    trades: 1248,
    date: '13 May 2026',
    topStocks: ['RELIANCE', 'INFY', 'HDFCBANK', 'TCS', 'BAJFINANCE'],
    mostBought: 'RELIANCE',
    mostSold: 'HDFCBANK',
    avgGain: '+1.4%',
  },
  premiumCards: [
    { title: 'Portfolio overlap',    desc: 'See how your holdings compare to top traders in your bracket' },
    { title: 'Smart money radar',    desc: 'Track where big portfolios are moving capital in real time' },
    { title: 'Sector heat map',      desc: 'Visualise capital flows across 11 sectors today' },
    { title: 'Top mover alerts',     desc: 'Get notified the moment your holdings trend on BharatStox' },
    { title: 'Correlation matrix',   desc: 'Understand how your stocks move together under market stress' },
  ],
};

// ── Earn credits content ──
// Earn rows carry an `action` key the EarnCreditsScreen uses to render the
// right control: 'claim' = claimable button, 'refer' = navigates to Refer,
// 'auto' = granted automatically by an in-app action (informational row).
const earnCredits = {
  earnWays: [
    { icon: 'gift',    label: 'Refer a friend',        reward: '+500 ◎', desc: 'When a friend joins and connects their portfolio', action: 'refer' },
    { icon: 'arc',     label: 'Connect your portfolio', reward: '+500 ◎', desc: 'One-time, when you link your first broker',       action: 'auto', key: 'portfolioConnected' },
    { icon: 'check',   label: 'Complete profile',      reward: '+60 ◎',  desc: 'One-time — set your handle + avatar',             action: 'claim', key: 'completeProfile' },
    { icon: 'flame',   label: 'Daily check-in',        reward: '+10 ◎',  desc: 'Once every day you open BharatStox',              action: 'checkin' },
    { icon: 'sparkle', label: 'First unlock',          reward: '+50 ◎',  desc: 'One-time bonus the first time you check a portfolio', action: 'auto', key: 'firstUnlock' },
  ],
  spendWays: [
    { icon: 'lock',  label: 'Check another portfolio', cost: '100 ◎',     desc: 'Unlock any locked trader in the leaderboard' },
    { icon: 'arc',   label: 'Request a refresh',       cost: '50 ◎',      desc: 'Ask a trader to sync their latest holdings' },
    { icon: 'bell',  label: 'Price alerts',            cost: '15 ◎',      desc: 'Per alert created' },
    { icon: 'spark', label: 'Premium analysis',        cost: '120 ◎/mo',  desc: 'Coming soon' },
  ],
  economics: [
    { label: 'Sign up + connect your portfolio', value: '1,000 ◎' },
    { label: '1 referral',                       value: '500 ◎ ≈ 5 unlocks' },
    { label: 'Checking another portfolio',       value: '100 ◎' },
  ],
};

export const fmt = { inrGroup, inrCompact, inr, signedPct };

export const BS = {
  me,
  rows,
  traderDetail,
  myPortfolio,
  invites,
  network,
  creditLog,
  notifications,
  brokers,
  analysisTeaser,
  earnCredits,
  fmt,
};
