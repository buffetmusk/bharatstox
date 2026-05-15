// Leaderboard heat-map view — a stylized India where every BharatStox metro
// glows by investor density or combined net worth. Pan / pinch / double-tap /
// button zoom; tap a city for its aggregates. A one-time privacy gate decides
// whether the signed-in user's own city joins the picture.
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Segmented } from '../../components/Segmented';
import { IconBtn } from '../../components/IconBtn';
import { Icon } from '../../components/Icon';
import { useMapZoom } from './useMapZoom';
import { MapPrivacyGate } from './MapPrivacyGate';
import { RegionSheet } from './RegionSheet';
import {
  INDIA_PATH, INDIA_VIEWBOX, CITIES, YOU_CITY, METRICS, intensity,
} from '../../data/geoData';

const GEO_KEY = 'bharatstox.geo.v1';
const METRIC_OPTIONS = [
  { value: 'users', label: 'Users' },
  { value: 'networth', label: 'Net worth' },
];

export function LeaderboardMap({ onOpenTrader }) {
  // 'granted' | 'declined' | null  — null shows the one-time privacy gate.
  const [consent, setConsent] = useState(() => {
    try { return localStorage.getItem(GEO_KEY); } catch (e) { return null; }
  });
  const [metric, setMetric] = useState('users');
  const [selectedCity, setSelectedCity] = useState(null);

  const { containerRef, handlers, transform, transition, scale, zoomIn, zoomOut, reset } = useMapZoom();

  useEffect(() => {
    try { if (consent) localStorage.setItem(GEO_KEY, consent); } catch (e) { /* private mode */ }
  }, [consent]);

  const selectCity = useCallback((c) => setSelectedCity(c), []);
  const gated = consent === null;
  const showLabels = scale > 1.8;

  // City labels only become legible past a zoom threshold, so the SVG only has
  // to rebuild when the metric, that threshold, or consent changes — never on
  // a pan frame.
  const mapSvg = useMemo(() => {
    const m = METRICS[metric];
    const gradId = metric === 'users' ? 'heatUsers' : 'heatNw';
    return (
      <svg viewBox={`0 0 ${INDIA_VIEWBOX.w} ${INDIA_VIEWBOX.h}`} width="100%" height="100%"
        style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <radialGradient id="heatUsers">
            <stop offset="0%"   style={{ stopColor: 'var(--accent)', stopOpacity: 0.85 }} />
            <stop offset="55%"  style={{ stopColor: 'var(--accent)', stopOpacity: 0.28 }} />
            <stop offset="100%" style={{ stopColor: 'var(--accent)', stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id="heatNw">
            <stop offset="0%"   style={{ stopColor: 'var(--gold)', stopOpacity: 0.85 }} />
            <stop offset="55%"  style={{ stopColor: 'var(--gold)', stopOpacity: 0.28 }} />
            <stop offset="100%" style={{ stopColor: 'var(--gold)', stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Stylized landmass — a calm backdrop, not a survey map */}
        <path d={INDIA_PATH} fill="var(--elevated)" stroke="var(--border)" strokeWidth="1" />

        {/* Heat glows — overlapping radial fields form the density picture */}
        <g>
          {CITIES.map(c => {
            const t = intensity(c, metric);
            return (
              <circle key={c.id} cx={c.x} cy={c.y} r={15 + t * 50}
                fill={`url(#${gradId})`} opacity={0.16 + t * 0.44} />
            );
          })}
        </g>

        {/* City nodes + generous invisible hit targets + zoom-gated labels */}
        {CITIES.map(c => {
          const t = intensity(c, metric);
          const nr = 2.6 + t * 4.2;
          return (
            <g key={c.id} style={{ cursor: 'pointer' }} onClick={() => selectCity(c)}>
              <circle cx={c.x} cy={c.y} r={nr + 2.4} fill="var(--bg)" opacity="0.55" />
              <circle cx={c.x} cy={c.y} r={nr} fill={m.color} />
              <circle cx={c.x} cy={c.y} r={nr * 0.42} fill="#fff" opacity="0.75" />
              {showLabels && (
                <text x={c.x} y={c.y - nr - 4} textAnchor="middle"
                  fontFamily="Geist, sans-serif" fontSize="8" fontWeight="600"
                  fill="var(--text-dim)">{c.name}</text>
              )}
              <circle cx={c.x} cy={c.y} r={Math.max(13, nr + 7)} fill="transparent" />
            </g>
          );
        })}

        {/* The signed-in user's own pin — the only individual point ever shown */}
        {consent === 'granted' && YOU_CITY && (
          <g style={{ cursor: 'pointer' }} onClick={() => selectCity(YOU_CITY)}>
            <circle cx={YOU_CITY.x} cy={YOU_CITY.y} r="11" fill="none"
              stroke="var(--accent)" strokeWidth="1.4" opacity="0.5"
              style={{ animation: 'bs-pulse 2.4s ease-in-out infinite' }} />
            <circle cx={YOU_CITY.x} cy={YOU_CITY.y} r="6" fill="var(--accent)"
              stroke="var(--bg)" strokeWidth="2" />
            <text x={YOU_CITY.x} y={YOU_CITY.y - 15} textAnchor="middle"
              fontFamily="Geist, sans-serif" fontSize="8.5" fontWeight="700"
              fill="var(--accent)">You</text>
          </g>
        )}
      </svg>
    );
  }, [metric, showLabels, consent, selectCity]);

  return (
    <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
      {/* Map stage — blurred + inert while the privacy gate is up */}
      <div
        ref={containerRef}
        {...(gated ? {} : handlers)}
        style={{
          position: 'absolute', inset: 0, overflow: 'hidden',
          touchAction: 'none', cursor: 'grab', background: 'var(--bg)',
          filter: gated ? 'blur(14px)' : 'none',
          pointerEvents: gated ? 'none' : 'auto',
        }}
      >
        <div style={{
          width: '100%', height: '100%', transformOrigin: '0 0',
          transform, transition, willChange: 'transform',
        }}>
          {mapSvg}
        </div>
      </div>

      {!gated && (
        <>
          {/* Metric toggle — floats over the map, maps-app style */}
          <div style={{
            position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
            zIndex: 10, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}>
            <Segmented fullWidth={false} value={metric} onChange={setMetric} options={METRIC_OPTIONS} />
          </div>

          {/* Zoom controls */}
          <div style={{
            position: 'absolute', right: 14, bottom: 16, zIndex: 10,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <IconBtn onClick={zoomIn}><Icon name="plus" size={16} /></IconBtn>
            <IconBtn onClick={zoomOut}><Icon name="minus" size={16} /></IconBtn>
            {scale > 1.05 && <IconBtn onClick={reset}><Icon name="target" size={16} /></IconBtn>}
          </div>

          {/* Legend */}
          <div style={{
            position: 'absolute', left: 16, bottom: 18, zIndex: 10,
            display: 'flex', flexDirection: 'column', gap: 5,
            background: 'var(--surface)', border: '1px solid var(--hairline)',
            borderRadius: 10, padding: '8px 10px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.14)',
          }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {metric === 'users' ? 'Investors' : 'Net worth'}
            </div>
            <div style={{
              width: 96, height: 6, borderRadius: 3,
              background: `linear-gradient(90deg, var(--elevated), ${METRICS[metric].color})`,
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text-mute)' }}>
              <span>{metric === 'users' ? 'Fewer' : 'Lower'}</span>
              <span>{metric === 'users' ? 'More' : 'Higher'}</span>
            </div>
          </div>

          {/* Re-offer location if the user chose to just browse */}
          {consent === 'declined' && (
            <button onClick={() => setConsent('granted')} style={{
              position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
              zIndex: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 32, padding: '0 13px 0 10px', borderRadius: 999,
              background: 'var(--surface)', border: '1px solid var(--accent)',
              color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 12, fontWeight: 700, letterSpacing: -0.1,
              boxShadow: '0 4px 14px rgba(0,0,0,0.16)',
            }}>
              <Icon name="pin" size={13} color="var(--accent)" />
              Add your city
            </button>
          )}
        </>
      )}

      {gated && (
        <MapPrivacyGate
          onShare={() => setConsent('granted')}
          onLater={() => setConsent('declined')}
        />
      )}

      {selectedCity && (
        <RegionSheet
          city={selectedCity}
          metric={metric}
          onClose={() => setSelectedCity(null)}
          onOpenTrader={(h) => { setSelectedCity(null); onOpenTrader && onOpenTrader(h); }}
        />
      )}
    </div>
  );
}
