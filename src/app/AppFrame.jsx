import { IOSStatusBar } from '../ios/IOSStatusBar';
import { Tweaks } from './Tweaks';

// Device frame wrapper — full-screen native mode by default, or a desktop
// phone-frame preview when showFrame is on. Hosts the developer Tweaks panel.
export function AppFrame({ children, theme, showFrame, setTweak, t }) {
  const dark = theme === 'dark';

  // Full-screen native mode (default on mobile)
  if (!showFrame) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'var(--bg)',
        // Push content below the real device status bar
        paddingTop: 'env(safe-area-inset-top)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
          {children}
        </div>
        {/* Developer tweaks: small gear icon, bottom-right */}
        <Tweaks t={t} setTweak={setTweak} />
      </div>
    );
  }

  // Desktop preview mode — phone frame + fake status bar
  const content = (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {children}
    </div>
  );
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#0F0F12',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, boxSizing: 'border-box',
    }}>
      <div style={{
        width: 402, height: 874,
        borderRadius: 48, overflow: 'hidden',
        position: 'relative',
        background: 'var(--bg)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
      }}>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
        }} />
        {/* status bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
          <IOSStatusBar dark={dark} />
        </div>
        {/* content */}
        <div style={{ position: 'absolute', top: 54, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
          {content}
        </div>
        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: 0, right: 0, zIndex: 60,
          display: 'flex', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <div style={{
            width: 139, height: 5, borderRadius: 100,
            background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)',
          }} />
        </div>
      </div>
      <Tweaks t={t} setTweak={setTweak} />
    </div>
  );
}
