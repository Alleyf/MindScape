// Theme Drawer - Beautiful side panel for theme customization

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '../hooks/useThemeColors';

// HSL color conversion utilities
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 25, s: 65, l: 55 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

interface ThemeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS = [
  { name: '熔岩', color: '#d97757', glow: '#c96442' },
  { name: '玫瑰', color: '#f43f5e', glow: '#e11d48' },
  { name: '翡翠', color: '#10b981', glow: '#059669' },
  { name: '天青', color: '#0ea5e9', glow: '#0284c7' },
  { name: '紫罗兰', color: '#8b5cf6', glow: '#7c3aed' },
  { name: '琥珀', color: '#f59e0b', glow: '#d97706' },
  { name: '薄荷', color: '#06b6d4', glow: '#0891b2' },
  { name: '珊瑚', color: '#fb7185', glow: '#f43b5e' },
];

function HueSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="theme-slider hue-slider">
      <input
        type="range"
        min="0"
        max="360"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
      <div className="slider-gradient" />
    </div>
  );
}

function SaturationSlider({ value, hue, onChange }: { value: number; hue: number; onChange: (v: number) => void }) {
  const bg = `linear-gradient(to right, hsl(${hue}, 0%, 55%), hsl(${hue}, 100%, 55%))`;
  return (
    <div className="theme-slider saturation-slider">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ background: bg }}
      />
    </div>
  );
}

function LightnessSlider({ value, hue, saturation, onChange }: { value: number; hue: number; saturation: number; onChange: (v: number) => void }) {
  const bg = `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`;
  return (
    <div className="theme-slider lightness-slider">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ background: bg }}
      />
    </div>
  );
}

export function ThemeDrawer({ isOpen, onClose }: ThemeDrawerProps) {
  const {
    darkColors,
    lightColors,
    isLight,
    toggleTheme,
    updateDarkColors,
    updateLightColors,
    resetToDefault,
  } = useThemeColors();

  const colors = isLight ? lightColors : darkColors;
  const updateColors = isLight ? updateLightColors : updateDarkColors;
  const hsl = hexToHsl(colors.accent);

  const updateAccentFromHsl = useCallback((h: number, s: number, l: number) => {
    const accent = hslToHex(h, s, l);
    const glow = hslToHex(h, Math.min(s + 5, 100), Math.max(l - 15, 10));
    const purple = hslToHex((h + 30) % 360, Math.max(s - 10, 0), Math.min(l + 5, 50));
    const blue = hslToHex((h + 180) % 360, Math.max(s - 20, 0), Math.min(l + 10, 60));
    updateColors({ accent, glow, purple, blue });
  }, [updateColors]);

  const handlePreset = (preset: typeof PRESETS[0]) => {
    const presetHsl = hexToHsl(preset.color);
    updateAccentFromHsl(presetHsl.h, presetHsl.s, presetHsl.l);
  };

  // Close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="theme-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="theme-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="theme-drawer-header">
              <div className="theme-drawer-title">
                <svg className="theme-drawer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
                <span>主题定制</span>
              </div>
              <button className="theme-drawer-close" onClick={onClose} aria-label="关闭">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="theme-drawer-content">
              {/* Theme Mode Toggle */}
              <section className="theme-section">
                <div className="theme-mode-toggle">
                  <button
                    className={`mode-btn ${!isLight ? 'active' : ''}`}
                    onClick={() => isLight && toggleTheme()}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                    <span>深色</span>
                  </button>
                  <button
                    className={`mode-btn ${isLight ? 'active' : ''}`}
                    onClick={() => !isLight && toggleTheme()}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                    </svg>
                    <span>浅色</span>
                  </button>
                </div>
              </section>

              {/* Color Preview */}
              <section className="theme-section">
                <h3 className="theme-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75 3.75h8.25a3.75 3.75 0 003.75-3.75V8.107M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-1.875c0-.621-.504-1.125-1.125-1.125h-8.25" />
                  </svg>
                  当前颜色
                </h3>
                <div className="color-preview-card">
                  <div className="color-preview-main" style={{ background: colors.accent }}>
                    <div className="color-preview-shine" />
                  </div>
                  <div className="color-preview-info">
                    <span className="color-preview-label">强调色</span>
                    <span className="color-preview-hex">{colors.accent.toUpperCase()}</span>
                    <div className="color-preview-hsl">
                      H {hsl.h}° · S {hsl.s}% · L {hsl.l}%
                    </div>
                  </div>
                </div>
              </section>

              {/* Presets */}
              <section className="theme-section">
                <h3 className="theme-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.4 2.701a1.151 1.151 0 00-3.998 0z" />
                  </svg>
                  预设主题
                </h3>
                <div className="preset-grid">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      className="preset-item"
                      onClick={() => handlePreset(preset)}
                      title={preset.name}
                    >
                      <div className="preset-swatch" style={{ background: preset.color }}>
                        <div className="preset-swatch-shine" />
                      </div>
                      <span className="preset-name">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* HSL Sliders */}
              <section className="theme-section">
                <h3 className="theme-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  自定义调节
                </h3>
                <div className="sliders-container">
                  <div className="slider-group">
                    <div className="slider-header">
                      <span className="slider-label">色相</span>
                      <span className="slider-value">{hsl.h}°</span>
                    </div>
                    <HueSlider value={hsl.h} onChange={(h) => updateAccentFromHsl(h, hsl.s, hsl.l)} />
                  </div>
                  <div className="slider-group">
                    <div className="slider-header">
                      <span className="slider-label">饱和度</span>
                      <span className="slider-value">{hsl.s}%</span>
                    </div>
                    <SaturationSlider value={hsl.s} hue={hsl.h} onChange={(s) => updateAccentFromHsl(hsl.h, s, hsl.l)} />
                  </div>
                  <div className="slider-group">
                    <div className="slider-header">
                      <span className="slider-label">亮度</span>
                      <span className="slider-value">{hsl.l}%</span>
                    </div>
                    <LightnessSlider value={hsl.l} hue={hsl.h} saturation={hsl.s} onChange={(l) => updateAccentFromHsl(hsl.h, hsl.s, l)} />
                  </div>
                </div>
              </section>

              {/* Reset */}
              <section className="theme-section">
                <button className="theme-reset-btn" onClick={resetToDefault}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  重置为默认
                </button>
              </section>
            </div>

            {/* Footer */}
            <div className="theme-drawer-footer">
              <p>颜色设置将保存在本地浏览器中</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
