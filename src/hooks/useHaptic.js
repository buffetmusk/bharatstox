import { useCallback } from 'react';
import haptic from '../lib/haptics';

// Maps named feedback types onto the ios-haptics API:
//   single pulse  → haptic()          (selection, light, medium, heavy, tick, impact, or raw ms)
//   double pulse  → haptic.confirm()  (success, confirm)
//   triple pulse  → haptic.error()    (error, warning)
export function useHaptic() {
  return useCallback((type = 'selection') => {
    if (type === 'success' || type === 'confirm') {
      haptic.confirm();
    } else if (type === 'error' || type === 'warning') {
      haptic.error();
    } else {
      haptic();
    }
  }, []);
}
