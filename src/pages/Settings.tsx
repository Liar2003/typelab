import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../store/settingsStore';
import { Navigation } from '../components/layout/Navigation';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const resetSettings = useSettingsStore((s) => s.resetSettings);

  const sections = [
    {
      title: 'Typing',
      settings: [
        {
          key: 'showLiveWpm' as const,
          label: 'Show Live WPM',
          type: 'toggle' as const,
        },
        {
          key: 'showErrors' as const,
          label: 'Show Errors',
          type: 'toggle' as const,
        },
        {
          key: 'smoothCaret' as const,
          label: 'Smooth Caret',
          type: 'toggle' as const,
        },
        {
          key: 'autoFocus' as const,
          label: 'Auto Focus',
          type: 'toggle' as const,
        },
        {
          key: 'stopOnError' as const,
          label: 'Stop on Error',
          type: 'toggle' as const,
        },
      ],
    },
    {
      title: '3D',
      settings: [
        {
          key: 'enable3D' as const,
          label: 'Enable 3D',
          type: 'toggle' as const,
        },
        {
          key: 'showHands' as const,
          label: 'Show Hands',
          type: 'toggle' as const,
        },
        {
          key: 'showKeyboard' as const,
          label: 'Show Keyboard',
          type: 'toggle' as const,
        },
        {
          key: 'animationQuality' as const,
          label: 'Animation Quality',
          type: 'select' as const,
          options: ['low', 'medium', 'high'],
        },
        {
          key: 'shadows' as const,
          label: 'Shadows',
          type: 'toggle' as const,
        },
        {
          key: 'postProcessing' as const,
          label: 'Post Processing',
          type: 'toggle' as const,
        },
      ],
    },
    {
      title: 'Sound',
      settings: [
        {
          key: 'soundEnabled' as const,
          label: 'Sound Effects',
          type: 'toggle' as const,
        },
        {
          key: 'soundVolume' as const,
          label: 'Volume',
          type: 'slider' as const,
          min: 0,
          max: 1,
          step: 0.1,
        },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-2xl mx-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-type-dim hover:text-type-text transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="text-sm">Back</span>
              </button>
              <h1 className="text-lg font-semibold text-type-text">Settings</h1>
              <button
                onClick={resetSettings}
                className="flex items-center gap-2 text-type-dim hover:text-type-text transition-colors"
              >
                <RotateCcw size={18} />
                <span className="text-sm">Reset</span>
              </button>
            </div>

            <div className="space-y-6">
              {sections.map((section) => (
                <div key={section.title} className="rounded-2xl glass p-4">
                  <h2 className="text-sm font-medium text-type-dim mb-4 uppercase tracking-wider">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.settings.map((setting) => (
                      <div
                        key={setting.key}
                        className="flex items-center justify-between"
                      >
                        <label className="text-type-text">{setting.label}</label>
                        {setting.type === 'toggle' && (
                          <button
                            onClick={() =>
                              updateSettings({ [setting.key]: !settings[setting.key] })
                            }
                            className={`w-12 h-6 rounded-full transition-colors ${
                              settings[setting.key]
                                ? 'bg-type-accent'
                                : 'bg-type-border'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                settings[setting.key]
                                  ? 'translate-x-6'
                                  : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        )}
                        {setting.type === 'select' && 'options' in setting && (
                          <select
                            value={settings[setting.key] as string}
                            onChange={(e) =>
                              updateSettings({ [setting.key]: e.target.value as any })
                            }
                            className="bg-type-border text-type-text px-3 py-1.5 rounded-lg text-sm"
                          >
                            {setting.options.map((opt: string) => (
                              <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </option>
                            ))}
                          </select>
                        )}
                        {setting.type === 'slider' && 'min' in setting && 'max' in setting && 'step' in setting && (
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min={setting.min}
                              max={setting.max}
                              step={setting.step}
                              value={settings[setting.key] as number}
                              onChange={(e) =>
                                updateSettings({
                                  [setting.key]: parseFloat(e.target.value) as any,
                                })
                              }
                              className="w-32 accent-type-accent"
                            />
                            <span className="text-sm text-type-dim w-10">
                              {Math.round((settings[setting.key] as number) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
