import { TweaksPanel } from '../tweaks/TweaksPanel';
import { TweakSection, TweakRadio, TweakToggle, TweakButton } from '../tweaks/TweakControls';
import { CREDITS_KEY } from '../lib/credits';

// App-specific developer tweaks — theme, demo flags, credit reset.
export function Tweaks({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Theme" />
      <TweakRadio label="Mode" value={t.theme}
                  options={['dark', 'light', 'sepia']}
                  onChange={v => setTweak('theme', v)} />
      <TweakSection label="Demo" />
      <TweakToggle label="Show device frame" value={t.showFrame}
                   onChange={v => setTweak('showFrame', v)} />
      <TweakToggle label="Skip onboarding" value={t.skipOnboarding}
                   onChange={v => setTweak('skipOnboarding', v)} />
      <TweakSection label="Credits" />
      <TweakButton label="Reset credits" secondary
                   onClick={() => {
                     try { localStorage.removeItem(CREDITS_KEY); } catch (e) { /* ignore */ }
                     location.reload();
                   }} />
    </TweaksPanel>
  );
}
