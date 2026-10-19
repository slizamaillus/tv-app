import React from 'react';
import { ControllerStyle } from '../types/launcher';
import { Gamepad2, Keyboard } from 'lucide-react';

interface Props {
  controllerLayout: ControllerStyle;
  inputMode: 'gamepad' | 'keyboard' | 'mouse';
  hasGamepad: boolean;
  gamepadName: string | null;
  onOpenCustomizer: () => void;
  onToggleSearch: () => void;
  accentColor: string;
}

export const GamepadPromptBar: React.FC<Props> = ({
  controllerLayout,
  inputMode,
  hasGamepad,
  gamepadName,
  onOpenCustomizer,
  onToggleSearch,
  accentColor,
}) => {
  const renderGlyph = (type: 'A' | 'B' | 'X' | 'Y' | 'LB' | 'RB' | 'START') => {
    if (controllerLayout === 'playstation') {
      switch (type) {
        case 'A': return <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/40">✕</span>;
        case 'B': return <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center border border-red-500/40">○</span>;
        case 'X': return <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 font-bold text-xs flex items-center justify-center border border-pink-500/40">□</span>;
        case 'Y': return <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40">△</span>;
        case 'LB': return <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">L1</span>;
        case 'RB': return <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">R1</span>;
        case 'START': return <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">OPTIONS</span>;
      }
    }

    if (controllerLayout === 'nintendo') {
      switch (type) {
        case 'A': return <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center border border-red-500/40">B</span>;
        case 'B': return <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/40">A</span>;
        case 'X': return <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold text-xs flex items-center justify-center border border-yellow-500/40">Y</span>;
        case 'Y': return <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40">X</span>;
        case 'LB': return <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">L</span>;
        case 'RB': return <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">R</span>;
        case 'START': return <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">+</span>;
      }
    }

    if (controllerLayout === 'keyboard' || (inputMode === 'keyboard' && !hasGamepad)) {
      switch (type) {
        case 'A': return <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[11px] border border-zinc-700">ENTER</kbd>;
        case 'B': return <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[11px] border border-zinc-700">ESC</kbd>;
        case 'X': return <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[11px] border border-zinc-700">ESPACIO</kbd>;
        case 'Y': return <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[11px] border border-zinc-700">F</kbd>;
        case 'LB': return <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[11px] border border-zinc-700">Q</kbd>;
        case 'RB': return <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[11px] border border-zinc-700">E</kbd>;
        case 'START': return <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[11px] border border-zinc-700">C</kbd>;
      }
    }

    // Default Xbox
    switch (type) {
      case 'A': return <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40">A</span>;
      case 'B': return <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center border border-red-500/40">B</span>;
      case 'X': return <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/40">X</span>;
      case 'Y': return <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/40">Y</span>;
      case 'LB': return <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">LB</span>;
      case 'RB': return <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">RB</span>;
      case 'START': return <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">START</span>;
    }
  };

  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 bg-black/80 backdrop-blur-md border-t border-white/10 px-6 py-2.5 flex items-center justify-between text-xs text-zinc-400 select-none">
      <div className="flex items-center gap-2">
        {hasGamepad ? (
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span className="truncate max-w-[200px] text-[11px]">
              {gamepadName ? gamepadName.split('(')[0].trim() : 'Mando Conectado'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Keyboard className="w-4 h-4" />
            <span className="text-[11px]">Teclado / Control Remoto</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 sm:gap-7">
        <div className="flex items-center gap-2">
          {renderGlyph('A')}
          <span className="text-zinc-300 font-medium">Lanzar</span>
        </div>

        <div className="flex items-center gap-2">
          {renderGlyph('X')}
          <span className="text-zinc-300 font-medium">Favorito</span>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {renderGlyph('LB')}
          {renderGlyph('RB')}
          <span className="text-zinc-400">Menú</span>
        </div>

        <button 
          onClick={onToggleSearch}
          className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
        >
          {renderGlyph('Y')}
          <span className="text-zinc-300 font-medium">Buscar</span>
        </button>

        <button 
          onClick={onOpenCustomizer}
          className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
        >
          {renderGlyph('START')}
          <span className="text-zinc-300 font-medium">Ajustes</span>
        </button>
      </div>

      <div className="hidden md:flex items-center gap-2 text-[11px] text-zinc-500">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
        <span>10-Foot UI</span>
      </div>
    </footer>
  );
};
