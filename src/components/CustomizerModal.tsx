import React, { useRef } from 'react';
import { X, Palette, Volume2, Sliders, Check, Download, Upload, RotateCcw, Monitor, Gamepad2, Sparkles, Layout } from 'lucide-react';
import { CustomTheme, CardAspectRatio, CardScale, HeroStyle, ControllerStyle, SoundPack } from '../types/launcher';
import { THEME_PRESETS } from '../data/defaultApps';
import { sounds } from '../services/soundEffects';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  theme: CustomTheme;
  onUpdateTheme: (updated: Partial<CustomTheme>) => void;
  onApplyPreset: (preset: CustomTheme) => void;
  onResetToDefaults: () => void;
  onExportConfig: () => void;
  onImportConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomizerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  theme,
  onUpdateTheme,
  onApplyPreset,
  onResetToDefaults,
  onExportConfig,
  onImportConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const colorSwatches = [
    '#E50914', // Netflix Red
    '#9333ea', // HBO Purple
    '#06b6d4', // Playnite Cyan
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#3b82f6', // Cobalt
    '#ec4899', // Pink
    '#f97316', // Orange
    '#ffffff', // Pure White
  ];

  const bgSwatches = [
    '#141414', // Netflix Charcoal
    '#0c0a14', // HBO Midnight
    '#0b1120', // Playnite Deep Slate
    '#09090b', // Zinc Black
    '#000000', // Pure OLED
    '#171923', // Dark Navy
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5" style={{ color: theme.accentColor }} />
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Personalización Visual 100%</h2>
              <p className="text-xs text-zinc-400">Temas, colores, tarjetas, estilo cinemático y mandos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable controls body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-7">
          {/* 1. Theme Presets */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5">
              Temas Preconfigurados (Estilo Netflix / HBO / Playnite)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {THEME_PRESETS.map((preset) => {
                const isSelected = theme.name === preset.name;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onApplyPreset(preset);
                      sounds.playSelect();
                    }}
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'border-white bg-zinc-800 shadow-md ring-1 ring-white/50'
                        : 'border-white/10 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs" 
                          style={{ backgroundColor: preset.accentColor }} 
                        />
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/20" 
                          style={{ backgroundColor: preset.bgColor }} 
                        />
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-xs font-semibold text-white truncate w-full">{preset.name}</span>
                    <span className="text-[10px] text-zinc-400 capitalize">{preset.heroStyle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Color & Atmosphere Builder */}
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
              <span>Colores & Fondo</span>
            </h3>

            {/* Accent Color */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-300 font-medium">Color de Acento Principal</span>
                <span className="text-xs font-mono text-zinc-400 uppercase">{theme.accentColor}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {colorSwatches.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateTheme({ accentColor: color })}
                    className={`w-7 h-7 rounded-full border transition-transform cursor-pointer ${
                      theme.accentColor === color ? 'scale-125 border-white ring-2 ring-white/30' : 'border-black/30 hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Color ${color}`}
                  />
                ))}
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => onUpdateTheme({ accentColor: e.target.value })}
                  className="w-7 h-7 rounded-full border border-white/20 cursor-pointer bg-transparent ml-1"
                  title="Color personalizado"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-300 font-medium">Tono de Fondo del Lienzo</span>
                <span className="text-xs font-mono text-zinc-400 uppercase">{theme.bgColor}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {bgSwatches.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateTheme({ bgColor: color })}
                    className={`w-7 h-7 rounded-lg border transition-transform cursor-pointer ${
                      theme.bgColor === color ? 'scale-115 border-white ring-2 ring-white/30' : 'border-white/10 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Fondo ${color}`}
                  />
                ))}
                <input
                  type="color"
                  value={theme.bgColor}
                  onChange={(e) => onUpdateTheme({ bgColor: e.target.value })}
                  className="w-7 h-7 rounded-lg border border-white/20 cursor-pointer bg-transparent ml-1"
                  title="Fondo personalizado"
                />
              </div>
            </div>

            {/* Ambient blur toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <p className="text-xs text-zinc-200 font-medium">Desenfoque Ambiental Dinámico</p>
                <p className="text-[11px] text-zinc-400">Proyecta la iluminación del póster activo en el fondo</p>
              </div>
              <button
                onClick={() => onUpdateTheme({ ambientBackdropBlur: !theme.ambientBackdropBlur })}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  theme.ambientBackdropBlur ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    theme.ambientBackdropBlur ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 3. Card Geometry & Layout */}
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Layout className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
              <span>Geometría de Tarjetas y Hero</span>
            </h3>

            {/* Aspect Ratio */}
            <div>
              <span className="block text-xs text-zinc-300 font-medium mb-2">Proporción de Tarjetas</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'poster', label: 'Poster (2:3 Netflix)' },
                  { id: 'banner', label: 'Banner (16:9 Steam)' },
                  { id: 'square', label: 'Cuadrado (1:1)' },
                  { id: 'tile', label: 'Tile Horizontal' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onUpdateTheme({ cardAspectRatio: item.id as CardAspectRatio })}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      theme.cardAspectRatio === item.id
                        ? 'border-white bg-white/10 text-white font-semibold'
                        : 'border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Corner Radius */}
            <div>
              <span className="block text-xs text-zinc-300 font-medium mb-2">Redondeo de Bordes</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: '0px', label: 'Recto (0px)' },
                  { value: '8px', label: 'Sutil (8px)' },
                  { value: '14px', label: 'Curvado (14px)' },
                  { value: '22px', label: 'Ultra (22px)' },
                ].map((rad) => (
                  <button
                    key={rad.value}
                    onClick={() => onUpdateTheme({ cardRadius: rad.value as CustomTheme['cardRadius'] })}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      theme.cardRadius === rad.value
                        ? 'border-white bg-white/10 text-white font-semibold'
                        : 'border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {rad.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Style */}
            <div>
              <span className="block text-xs text-zinc-300 font-medium mb-2">Estilo del Spotlight (Hero)</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cinematic', label: 'Cinemático (HBO / Netflix)' },
                  { id: 'split', label: 'Dividido (Playnite / Steam)' },
                  { id: 'minimal', label: 'Minimalista Compacto' },
                ].map((hero) => (
                  <button
                    key={hero.id}
                    onClick={() => onUpdateTheme({ heroStyle: hero.id as HeroStyle })}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      theme.heroStyle === hero.id
                        ? 'border-white bg-white/10 text-white font-semibold'
                        : 'border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {hero.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Audio & Navigation Controls */}
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Gamepad2 className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
              <span>Audio y Mandos</span>
            </h3>

            {/* Sound pack selection */}
            <div>
              <span className="block text-xs text-zinc-300 font-medium mb-2">Efectos de Sonido de Navegación</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'console', label: 'Consola (Playnite)' },
                  { id: 'modern', label: 'Moderno (TV)' },
                  { id: 'arcade', label: 'Arcade Retro' },
                  { id: 'muted', label: 'Silencioso' },
                ].map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => {
                      onUpdateTheme({ soundPack: pack.id as SoundPack });
                      sounds.setSoundPack(pack.id as SoundPack);
                      sounds.playMove();
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      theme.soundPack === pack.id
                        ? 'border-white bg-white/10 text-white font-semibold'
                        : 'border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {pack.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  Volumen de Efectos
                </span>
                <span className="text-xs font-mono text-zinc-400 tabular-nums">{theme.soundVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={theme.soundVolume}
                onChange={(e) => {
                  const vol = Number(e.target.value);
                  onUpdateTheme({ soundVolume: vol });
                  sounds.setVolume(vol);
                }}
                className="w-full accent-white cursor-pointer"
              />
            </div>

            {/* Controller Button Style */}
            <div>
              <span className="block text-xs text-zinc-300 font-medium mb-2">Botones de Guía en Pantalla</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'xbox', label: 'Xbox (A/B/X/Y)' },
                  { id: 'playstation', label: 'PlayStation (✕/○)' },
                  { id: 'nintendo', label: 'Nintendo (B/A)' },
                  { id: 'keyboard', label: 'Teclado (Enter/Esc)' },
                ].map((ctl) => (
                  <button
                    key={ctl.id}
                    onClick={() => onUpdateTheme({ controllerLayout: ctl.id as ControllerStyle })}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      theme.controllerLayout === ctl.id
                        ? 'border-white bg-white/10 text-white font-semibold'
                        : 'border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {ctl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Backup, Import & Export */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={onExportConfig}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/10 cursor-pointer"
                title="Descargar archivo JSON con tu catálogo y personalizaciones"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Copia JSON</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/10 cursor-pointer"
                title="Cargar archivo de respaldo JSON"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Importar JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={onImportConfig}
                className="hidden"
              />
            </div>

            <button
              onClick={() => {
                if (confirm('¿Restablecer tema y ajustes a los valores iniciales?')) {
                  onResetToDefaults();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Todo</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-zinc-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-bold text-white transition-all transform active:scale-95 cursor-pointer hover:brightness-110"
            style={{ backgroundColor: theme.accentColor }}
          >
            Listo / Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
