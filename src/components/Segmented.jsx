import { useRef, useState, useLayoutEffect } from 'react';
import { useHaptic } from '../hooks/useHaptic';

// Segmented control with an animated thumb.
export function Segmented({ value, options, onChange, fullWidth = true }) {
  const ref = useRef(null);
  const haptic = useHaptic();
  const [thumb, setThumb] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const el = ref.current?.querySelector(`[data-seg="${value}"]`);
    if (el) setThumb({ left: el.offsetLeft, width: el.offsetWidth });
  }, [value, options]);
  return (
    <div ref={ref} style={{
      display: 'flex', position: 'relative',
      background: 'var(--elevated)',
      borderRadius: 12, padding: 3,
      width: fullWidth ? '100%' : 'auto',
    }}>
      <div style={{
        position: 'absolute', top: 3, bottom: 3,
        left: thumb.left, width: thumb.width,
        background: 'var(--surface)',
        borderRadius: 10,
        boxShadow: 'var(--shadow-pill)',
        transition: 'left 0.22s cubic-bezier(0.32,0.72,0,1), width 0.22s cubic-bezier(0.32,0.72,0,1)',
      }} />
      {options.map(o => {
        const v = typeof o === 'string' ? o : o.value;
        const label = typeof o === 'string' ? o : o.label;
        const active = v === value;
        return (
          <button key={v}
            data-seg={v}
            onClick={() => { if (v !== value) haptic(); onChange(v); }}
            style={{
              position: 'relative', flex: 1, padding: '7px 8px',
              background: 'transparent', border: 0, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
              color: active ? 'var(--text)' : 'var(--text-mute)',
              transition: 'color 0.15s ease',
            }}>{label}</button>
        );
      })}
    </div>
  );
}
