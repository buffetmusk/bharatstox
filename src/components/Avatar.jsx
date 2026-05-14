// Procedural avatar — deterministic, faux-3D SVG avatar generated from a seed
// string (the user's handle). Same seed → same avatar, always. Fully offline.

const AV_PALETTES = [
  { disc: ['#1b4a36', '#081f15'], body: ['#7CFFC4', '#00B25A'] },
  { disc: ['#4a3a12', '#1f1808'], body: ['#FFE08A', '#E09A00'] },
  { disc: ['#4a1f28', '#1f0c11'], body: ['#FFB3C0', '#E84B6B'] },
  { disc: ['#163b5c', '#0a1c2e'], body: ['#A9DBFF', '#3B8FE0'] },
  { disc: ['#3a2a5c', '#180f2e'], body: ['#D9C2FF', '#9A6BE0'] },
  { disc: ['#4a3010', '#1f1408'], body: ['#FFCB8A', '#E07B2B'] },
  { disc: ['#0f3f3c', '#06201e'], body: ['#9DEDE3', '#2BB9A8'] },
  { disc: ['#4a2418', '#1f0f0a'], body: ['#FFC2A6', '#E86A3B'] },
];
const AV_PUPIL = '#1b1b22';

function hashSeed(seed) {
  let h = 2166136261;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function avatarTraits(seed) {
  const h = hashSeed(seed || 'anon');
  return {
    h,
    palette: AV_PALETTES[h % AV_PALETTES.length],
    body: (h >> 4) % 5,
    eyes: (h >> 8) % 5,
    mouth: (h >> 12) % 4,
    accent: (h >> 16) % 4,
    rot: ((h >> 20) % 7) - 3, // slight -3..3° tilt for character
  };
}

function avBody(idx) {
  switch (idx) {
    case 0: return <circle cx="50" cy="54" r="29" />;
    case 1: return <rect x="22" y="26" width="56" height="56" rx="20" />;
    case 2: return <path d="M50 24C70 24 80 38 80 55C80 73 66 82 50 82C34 82 20 73 20 55C20 38 30 24 50 24Z" />;
    case 3: return <polygon points="50,24 76,39 76,69 50,84 24,69 24,39" />;
    default: return <path d="M24 31Q24 26 29 26L71 26Q76 26 76 31L76 56Q76 76 50 84Q24 76 24 56Z" />;
  }
}

function avEyes(idx) {
  const p = AV_PUPIL;
  switch (idx) {
    case 0: return <g fill={p}><circle cx="40" cy="48" r="4.5" /><circle cx="60" cy="48" r="4.5" /></g>;
    case 1: return <g><ellipse cx="40" cy="48" rx="5" ry="6.5" fill="#fff" /><ellipse cx="60" cy="48" rx="5" ry="6.5" fill="#fff" /><circle cx="40" cy="49" r="2.6" fill={p} /><circle cx="60" cy="49" r="2.6" fill={p} /></g>;
    case 2: return <g fill="none" stroke={p} strokeWidth="2.6" strokeLinecap="round"><path d="M34 48Q40 53 46 48" /><path d="M54 48Q60 53 66 48" /></g>;
    case 3: return <g><circle cx="40" cy="48" r="5.5" fill="#fff" stroke={p} strokeWidth="1.6" /><circle cx="60" cy="48" r="5.5" fill="#fff" stroke={p} strokeWidth="1.6" /><circle cx="40" cy="48" r="2.2" fill={p} /><circle cx="60" cy="48" r="2.2" fill={p} /></g>;
    default: return <g><circle cx="50" cy="48" r="11" fill="#fff" /><circle cx="50" cy="48" r="4.8" fill={p} /></g>;
  }
}

function avMouth(idx) {
  const p = AV_PUPIL;
  switch (idx) {
    case 0: return <path d="M42 64Q50 72 58 64" fill="none" stroke={p} strokeWidth="2.6" strokeLinecap="round" />;
    case 1: return <line x1="44" y1="66" x2="56" y2="66" stroke={p} strokeWidth="2.6" strokeLinecap="round" />;
    case 2: return <ellipse cx="50" cy="66" rx="4" ry="5" fill={p} />;
    default: return <path d="M43 66Q51 70 58 63" fill="none" stroke={p} strokeWidth="2.6" strokeLinecap="round" />;
  }
}

function avAccent(idx, bodyDark) {
  switch (idx) {
    case 1: return <g><circle cx="74" cy="27" r="7.5" fill="#FFB800" stroke="rgba(0,0,0,.25)" strokeWidth="1.2" /><path d="M74 23.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.2 3.1-.4z" fill="#fff" /></g>;
    case 2: return <g><line x1="50" y1="25" x2="50" y2="13" stroke={bodyDark} strokeWidth="2.6" strokeLinecap="round" /><circle cx="50" cy="11" r="3.6" fill={bodyDark} /></g>;
    case 3: return <g fill="#FF7A9C" opacity="0.55"><ellipse cx="33" cy="59" rx="5" ry="3" /><ellipse cx="67" cy="59" rx="5" ry="3" /></g>;
    default: return null;
  }
}

export function Avatar({ seed = 'anon', size = 32, ring = false }) {
  const t = avatarTraits(seed);
  const uid = 'av' + t.h.toString(36);
  const [bL, bD] = t.palette.body;
  const [dL, dD] = t.palette.disc;
  return (
    <div className="bs-avatar"
         style={{
           width: size, height: size, borderRadius: 999, overflow: 'hidden',
           boxShadow: ring ? `0 0 0 2px var(--bg), 0 0 0 3.5px ${bD}` : 'none',
         }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <defs>
          <radialGradient id={uid + 'd'} cx="0.32" cy="0.28" r="0.95">
            <stop offset="0%" stopColor={dL} />
            <stop offset="100%" stopColor={dD} />
          </radialGradient>
          <linearGradient id={uid + 'b'} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bL} />
            <stop offset="100%" stopColor={bD} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#${uid}d)`} />
        <ellipse cx="50" cy="86" rx="23" ry="5.5" fill="rgba(0,0,0,0.28)" />
        <g transform={`rotate(${t.rot} 50 54)`}>
          <g fill={`url(#${uid}b)`} stroke="rgba(0,0,0,0.22)" strokeWidth="1.5">
            {avBody(t.body)}
          </g>
          {avEyes(t.eyes)}
          {avMouth(t.mouth)}
          {avAccent(t.accent, bD)}
        </g>
        <ellipse cx="37" cy="31" rx="27" ry="16" fill="#fff" opacity="0.16" />
      </svg>
    </div>
  );
}
