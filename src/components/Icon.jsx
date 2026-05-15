// Icon set — line / 1.6 stroke-width / round caps.
export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.6 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'back':       return <svg {...props}><path d="M15 18l-6-6 6-6"/></svg>;
    case 'forward':    return <svg {...props}><path d="M9 18l6-6-6-6"/></svg>;
    case 'close':      return <svg {...props}><path d="M18 6L6 18M6 6l12 12"/></svg>;
    case 'bell':       return <svg {...props}><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 004 0"/></svg>;
    case 'plus':       return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'check':      return <svg {...props}><path d="M5 12l5 5L20 7"/></svg>;
    case 'lock':       return <svg {...props}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>;
    case 'unlock':     return <svg {...props}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0"/></svg>;
    case 'spark':      return <svg {...props}><path d="M12 3l2.2 5.6L20 10l-4.5 3.5L17 20l-5-3-5 3 1.5-6.5L4 10l5.8-1.4L12 3z"/></svg>;
    case 'gear':       return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.5-2.4.9a7 7 0 00-2-1.2L14 3h-4l-.5 2.5a7 7 0 00-2 1.2L5 5.8 3 9.3l2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-.9a7 7 0 002 1.2L10 21h4l.5-2.5a7 7 0 002-1.2l2.4.9 2-3.5-2-1.5c0-.4.1-.8.1-1.2z"/></svg>;
    case 'user':       return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>;
    case 'leaderboard':return <svg {...props}><path d="M4 21V11M12 21V4M20 21v-7"/></svg>;
    case 'gift':       return <svg {...props}><rect x="4" y="9" width="16" height="12" rx="2"/><path d="M4 14h16M12 9v12M9 9a3 3 0 010-6c2 0 3 3 3 6 0-3 1-6 3-6a3 3 0 010 6"/></svg>;
    case 'copy':       return <svg {...props}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/></svg>;
    case 'share':      return <svg {...props}><path d="M12 3v13M12 3l-4 4M12 3l4 4"/><path d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"/></svg>;
    case 'qr':         return <svg {...props}><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><path d="M14 14h2v2M18 14v6M14 18h2"/></svg>;
    case 'sun':        return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>;
    case 'moon':       return <svg {...props}><path d="M21 13a8 8 0 01-10-10 8 8 0 1010 10z"/></svg>;
    case 'paper':      return <svg {...props}><path d="M6 3h9l5 5v13a0 0 0 010 0H6a0 0 0 010 0V3z"/><path d="M15 3v5h5"/></svg>;
    case 'logout':     return <svg {...props}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>;
    case 'chevron-r':  return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>;
    case 'arrow-up':   return <svg {...props}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case 'arrow-dn':   return <svg {...props}><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
    case 'haptic':     return <svg {...props}><circle cx="12" cy="12" r="2.5"/><path d="M7.8 7.8a6 6 0 000 8.4M16.2 16.2a6 6 0 000-8.4M5 5a10 10 0 000 14M19 19a10 10 0 000-14"/></svg>;
    case 'flame':      return <svg {...props}><path d="M12 3s5 5 5 10a5 5 0 01-10 0c0-2 1-3 1-3s1 1 2 1c0-3 2-5 2-8z"/></svg>;
    case 'sliders':    return <svg {...props}><path d="M4 6h12M20 6h0M4 12h4M12 12h8M4 18h10M18 18h2"/><circle cx="18" cy="6" r="1.5"/><circle cx="10" cy="12" r="1.5"/><circle cx="16" cy="18" r="1.5"/></svg>;
    case 'eye':        return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'eye-off':    return <svg {...props}><path d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A10.4 10.4 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.4 4.4M6 6.5A17 17 0 002 12s4 7 10 7c1.4 0 2.7-.4 3.9-1"/></svg>;
    case 'arc':        return <svg {...props}><path d="M3 18a9 9 0 0118 0"/><path d="M12 18V8"/></svg>;
    case 'sparkle':    return <svg {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></svg>;
    case 'follow':     return <svg {...props}><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0114 0"/><path d="M19 8v6M22 11h-6"/></svg>;
    case 'following':  return <svg {...props}><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0114 0"/><path d="M17 12l2 2 4-4"/></svg>;
    case 'list':       return <svg {...props}><circle cx="4" cy="6" r="1.5" fill={color} stroke="none"/><circle cx="4" cy="12" r="1.5" fill={color} stroke="none"/><circle cx="4" cy="18" r="1.5" fill={color} stroke="none"/><path d="M9 6h11M9 12h11M9 18h11"/></svg>;
    case 'picker':     return <svg {...props}><rect x="3" y="10" width="18" height="4" rx="2"/><path d="M7 6h10M7 18h10"/></svg>;
    case 'map':        return <svg {...props}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>;
    case 'minus':      return <svg {...props}><path d="M5 12h14"/></svg>;
    case 'pin':        return <svg {...props}><path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case 'target':     return <svg {...props}><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="2.2" fill={color} stroke="none"/></svg>;
    default:           return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
}
