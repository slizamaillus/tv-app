import React, { useEffect, useState } from 'react';
import { Play, Check, ExternalLink, X, RotateCcw, Copy } from 'lucide-react';
import { AppItem } from '../types/launcher';
import { launchExternal } from '../services/host';

interface Props {
  app: AppItem | null;
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

export const LaunchOverlay: React.FC<Props> = ({
  app,
  isOpen,
  onClose,
  accentColor,
}) => {
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen && app) {
      setProgress(0);
      setCopied(false);

      // Trigger URL / URI / local path launch
      launchExternal(app.path);

      // Animate launch bar
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 12;
        });
      }, 80);

      return () => clearInterval(interval);
    }
  }, [isOpen, app]);

  if (!isOpen || !app) return null;

  const copyPath = () => {
    navigator.clipboard.writeText(app.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relaunch = () => launchExternal(app.path);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fadeIn select-none">
      <div className="relative w-full max-w-xl rounded-2xl overflow-hidden border border-white/15 bg-zinc-950 shadow-2xl">
        {/* Background artwork */}
        <div className="h-48 relative overflow-hidden">
          <img
            src={app.heroImage || app.posterImage}
            alt={app.title}
            className="w-full h-full object-cover scale-105 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Launch Status */}
        <div className="p-6 pt-0 relative z-10 flex flex-col items-center text-center -mt-8">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-4 border border-white/20"
            style={{ backgroundColor: accentColor }}
          >
            <Play className="w-7 h-7 fill-white text-white ml-1 animate-pulse" />
          </div>

          <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 font-semibold">
            Ejecutando en {app.platform.toUpperCase()}
          </span>

          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1 mb-2">
            Iniciando {app.title}...
          </h2>

          <p className="text-xs text-zinc-300 max-w-md mb-5">
            Se ha enviado la señal de inicio al sistema operativo mediante el protocolo o enlace directo:
          </p>

          <div className="w-full p-2.5 rounded-lg bg-zinc-900 border border-white/10 font-mono text-xs text-zinc-300 flex items-center justify-between gap-3 mb-4">
            <span className="truncate text-left">{app.path}</span>
            <button
              onClick={copyPath}
              className="text-zinc-400 hover:text-white shrink-0 cursor-pointer p-1"
              title="Copiar comando"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={relaunch}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Volver a Lanzar</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-transform active:scale-95 cursor-pointer hover:brightness-110"
              style={{ backgroundColor: accentColor }}
            >
              Regresar al Menú (ESC / B)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
