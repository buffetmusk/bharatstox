// ios-haptics — inline of github.com/tijnjh/ios-haptics
// iOS path: create a <label><input type=checkbox switch></label>, click it,
// remove it — iOS fires UIFeedbackGenerator on the switch toggle.
// Android path: navigator.vibrate (unchanged).

export const supportsHaptics =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer: coarse)').matches;

function _haptic() {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(50);
      return;
    }
    if (!supportsHaptics) return;

    const labelEl = document.createElement('label');
    labelEl.ariaHidden = 'true';
    labelEl.style.display = 'none';

    const inputEl = document.createElement('input');
    inputEl.type = 'checkbox';
    inputEl.setAttribute('switch', '');
    labelEl.appendChild(inputEl);

    document.head.appendChild(labelEl);
    labelEl.click();
    document.head.removeChild(labelEl);
  } catch (e) {
    // haptics are best-effort — never throw into the UI
  }
}

function haptic() { _haptic(); }

haptic.confirm = function () {
  if (navigator.vibrate) {
    navigator.vibrate([50, 70, 50]);
    return;
  }
  _haptic();
  setTimeout(() => { _haptic(); }, 120);
};

haptic.error = function () {
  if (navigator.vibrate) {
    navigator.vibrate([50, 70, 50, 70, 50]);
    return;
  }
  _haptic();
  setTimeout(() => { _haptic(); }, 120);
  setTimeout(() => { _haptic(); }, 240);
};

export default haptic;
