import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings } from '../types';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  soundEnabled: false,
  soundVolume: 0.5,
  showLiveWpm: true,
  showErrors: true,
  smoothCaret: true,
  autoFocus: true,
  stopOnError: false,
  restartKey: 'Tab',
  enable3D: true,
  showHands: true,
  showKeyboard: true,
  animationQuality: 'medium',
  shadows: true,
  postProcessing: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'typelab-settings',
    }
  )
);
