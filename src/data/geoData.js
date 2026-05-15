// Geo data for the leaderboard heat map.
//
// This is a prototype: there is no real location tracking. The numbers below
// are synthetic city-level aggregates — never individual coordinates — which
// is the only shape a privacy-respecting heat map should ever expose.
import { BS } from './mockData';

// Stylized India silhouette. Deliberately abstract — a calm backdrop, not a
// survey map. The heat glows carry the information; the landmass just frames it.
export const INDIA_VIEWBOX = { w: 360, h: 440 };
export const INDIA_PATH =
  'M84,30 C92,42 110,52 120,61 C150,85 158,96 168,106 C220,118 250,128 300,137 ' +
  'C318,132 332,128 330,121 C320,140 290,158 264,167 C258,185 250,200 245,212 ' +
  'C238,224 224,236 214,246 C198,266 178,288 162,303 C156,318 152,335 148,349 ' +
  'C146,360 144,370 142,379 C128,398 120,414 114,425 C108,410 100,402 96,395 ' +
  'C86,372 78,340 72,314 C66,295 62,276 58,258 C44,242 30,230 24,228 ' +
  'C12,222 6,210 6,197 C10,182 18,166 24,152 C40,124 58,98 72,76 ' +
  'C76,60 80,44 84,30 Z';

// Approximate lat/lon → viewBox projection (equirectangular, good enough for a
// stylized map).
const LAT_MAX = 36, LAT_MIN = 7, LON_MIN = 68, LON_MAX = 98;
export function project(lat, lon) {
  return {
    x: ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * INDIA_VIEWBOX.w,
    y: ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * INDIA_VIEWBOX.h,
  };
}

// City-level aggregates — synthetic but plausible.
//   users      = BharatStox users in that metro
//   netWorthCr = combined portfolio value (₹ crore)
//   medianL    = median portfolio (₹ lakh)
// `you: true` marks the signed-in user's city (Tigerstripe → Bengaluru).
const RAW_CITIES = [
  { id: 'mumbai',    name: 'Mumbai',        state: 'Maharashtra',   lat: 19.07, lon: 72.87, users: 4820, netWorthCr: 9120, medianL: 14.2 },
  { id: 'delhi',     name: 'New Delhi',     state: 'Delhi',         lat: 28.61, lon: 77.21, users: 4310, netWorthCr: 8470, medianL: 13.6 },
  { id: 'bengaluru', name: 'Bengaluru',     state: 'Karnataka',     lat: 12.97, lon: 77.59, users: 5210, netWorthCr: 7980, medianL: 12.1, you: true },
  { id: 'hyderabad', name: 'Hyderabad',     state: 'Telangana',     lat: 17.39, lon: 78.49, users: 2980, netWorthCr: 4310, medianL: 11.4 },
  { id: 'pune',      name: 'Pune',          state: 'Maharashtra',   lat: 18.52, lon: 73.86, users: 2440, netWorthCr: 3160, medianL: 10.8 },
  { id: 'chennai',   name: 'Chennai',       state: 'Tamil Nadu',    lat: 13.08, lon: 80.27, users: 2210, netWorthCr: 3020, medianL: 10.2 },
  { id: 'ahmedabad', name: 'Ahmedabad',     state: 'Gujarat',       lat: 23.03, lon: 72.58, users: 1870, netWorthCr: 2640, medianL: 11.9 },
  { id: 'kolkata',   name: 'Kolkata',       state: 'West Bengal',   lat: 22.57, lon: 88.36, users: 1760, netWorthCr: 2210, medianL: 9.4 },
  { id: 'chandigarh',name: 'Chandigarh',    state: 'Chandigarh',    lat: 30.73, lon: 76.78, users: 1080, netWorthCr: 1520, medianL: 13.2 },
  { id: 'surat',     name: 'Surat',         state: 'Gujarat',       lat: 21.17, lon: 72.83, users: 1120, netWorthCr: 1680, medianL: 12.6 },
  { id: 'jaipur',    name: 'Jaipur',        state: 'Rajasthan',     lat: 26.91, lon: 75.79, users: 980,  netWorthCr: 1120, medianL: 8.7 },
  { id: 'indore',    name: 'Indore',        state: 'Madhya Pradesh',lat: 22.72, lon: 75.86, users: 940,  netWorthCr: 980,  medianL: 8.1 },
  { id: 'kochi',     name: 'Kochi',         state: 'Kerala',        lat: 9.93,  lon: 76.27, users: 720,  netWorthCr: 910,  medianL: 9.8 },
  { id: 'lucknow',   name: 'Lucknow',       state: 'Uttar Pradesh', lat: 26.85, lon: 80.95, users: 860,  netWorthCr: 770,  medianL: 6.9 },
  { id: 'coimbatore',name: 'Coimbatore',    state: 'Tamil Nadu',    lat: 11.02, lon: 76.96, users: 680,  netWorthCr: 780,  medianL: 9.1 },
  { id: 'vizag',     name: 'Visakhapatnam', state: 'Andhra Pradesh',lat: 17.69, lon: 83.22, users: 560,  netWorthCr: 620,  medianL: 8.3 },
  { id: 'nagpur',    name: 'Nagpur',        state: 'Maharashtra',   lat: 21.15, lon: 79.09, users: 610,  netWorthCr: 540,  medianL: 7.2 },
  { id: 'patna',     name: 'Patna',         state: 'Bihar',         lat: 25.59, lon: 85.14, users: 510,  netWorthCr: 380,  medianL: 5.6 },
  { id: 'bhubaneswar',name:'Bhubaneswar',   state: 'Odisha',        lat: 20.30, lon: 85.82, users: 430,  netWorthCr: 360,  medianL: 6.4 },
  { id: 'guwahati',  name: 'Guwahati',      state: 'Assam',         lat: 26.14, lon: 91.74, users: 290,  netWorthCr: 240,  medianL: 6.1 },
];

// Attach projected coordinates + a few sample traders (drawn from the existing
// leaderboard rows) so the region sheet has something real to show.
export const CITIES = RAW_CITIES.map((c, i) => ({
  ...c,
  ...project(c.lat, c.lon),
  topTraders: Array.from({ length: 3 }, (_, k) => BS.rows[(i * 3 + k) % BS.rows.length]),
}));

export const YOU_CITY = CITIES.find(c => c.you) || null;

export const METRICS = {
  users:    { key: 'users',      label: 'Users',     color: 'var(--accent)', unit: '' },
  networth: { key: 'netWorthCr', label: 'Net worth', color: 'var(--gold)',   unit: 'Cr' },
};

export const METRIC_MAX = {
  users:      Math.max(...CITIES.map(c => c.users)),
  netWorthCr: Math.max(...CITIES.map(c => c.netWorthCr)),
};

export const TOTALS = {
  users:      CITIES.reduce((s, c) => s + c.users, 0),
  netWorthCr: CITIES.reduce((s, c) => s + c.netWorthCr, 0),
  cities:     CITIES.length,
};

// Normalised 0..1 intensity for a city under the active metric.
export function intensity(city, metricKey) {
  const k = METRICS[metricKey].key;
  return city[k] / METRIC_MAX[k];
}
