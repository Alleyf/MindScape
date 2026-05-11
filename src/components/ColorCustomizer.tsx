// Color Customizer Component

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '../hooks/useThemeColors';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div className="color-input-row">
      <label className="color-input-label">{label}</label>
      <div className="color-input-wrapper">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="color-picker"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="color-text-input"
          pattern="^#[0-9A-Fa-f]{6}$"
        />
      </div>
    </div>
  );
}

export function ColorCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    darkColors,
    lightColors,
    currentColors,
    isLight,
    updateDarkColors,
    updateLightColors,
    resetToDefault,
  } = useThemeColors();

  const colors = isLight ? lightColors : darkColors;
  const updateColors = isLight ? updateLightColors : updateDarkColors;

  return (
    <>
      {/* Toggle Button */}
      <button
        className="color-customizer-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="自定义主题颜色"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="color-customizer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="color-customizer-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="color-customizer-header">
                <h3>主题颜色</h3>
                <button
                  className="color-customizer-close"
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="color-customizer-body">
                <p className="color-customizer-hint">
                  当前主题：{isLight ? '☀️ 明亮' : '🌙 暗黑'}
                </p>

                <div className="color-presets">
                  <button
                    className="preset-btn preset-default"
                    onClick={() => updateColors({ accent: '#d97757', glow: '#c96442', purple: '#8f4f32', blue: '#6f7669' })}
                    title="默认配色"
                  >
                    默认
                  </button>
                  <button
                    className="preset-btn preset-rose"
                    onClick={() => updateColors({ accent: '#f43f5e', glow: '#e11d48', purple: '#be185d', blue: '#9d174d' })}
                    title="玫瑰"
                  >
                    玫瑰
                  </button>
                  <button
                    className="preset-btn preset-emerald"
                    onClick={() => updateColors({ accent: '#10b981', glow: '#059669', purple: '#047857', blue: '#065f46' })}
                    title="翡翠"
                  >
                    翡翠
                  </button>
                  <button
                    className="preset-btn preset-sky"
                    onClick={() => updateColors({ accent: '#0ea5e9', glow: '#0284c7', purple: '#0369a1', blue: '#075985' })}
                    title="天蓝"
                  >
                    天蓝
                  </button>
                  <button
                    className="preset-btn preset-violet"
                    onClick={() => updateColors({ accent: '#8b5cf6', glow: '#7c3aed', purple: '#6d28d9', blue: '#5b21b6' })}
                    title="紫罗兰"
                  >
                    紫罗兰
                  </button>
                  <button
                    className="preset-btn preset-amber"
                    onClick={() => updateColors({ accent: '#f59e0b', glow: '#d97706', purple: '#b45309', blue: '#92400e' })}
                    title="琥珀"
                  >
                    琥珀
                  </button>
                </div>

                <div className="color-inputs">
                  <ColorInput
                    label="强调色"
                    value={colors.accent}
                    onChange={(color) => updateColors({ accent: color })}
                  />
                  <ColorInput
                    label="光晕色"
                    value={colors.glow}
                    onChange={(color) => updateColors({ glow: color })}
                  />
                  <ColorInput
                    label="紫色"
                    value={colors.purple}
                    onChange={(color) => updateColors({ purple: color })}
                  />
                  <ColorInput
                    label="蓝色"
                    value={colors.blue}
                    onChange={(color) => updateColors({ blue: color })}
                  />
                </div>

                <button
                  className="color-reset-btn"
                  onClick={resetToDefault}
                >
                  重置为默认
                </button>
              </div>

              <div className="color-customizer-footer">
                <p className="color-customizer-note">
                  颜色设置保存在本地
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
