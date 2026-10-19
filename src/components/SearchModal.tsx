import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Play, Star, Sparkles } from 'lucide-react';
import { AppItem, CardAspectRatio, CardScale } from '../types/launcher';
import { AppCard } from './AppCard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  apps: AppItem[];
  onSelectApp: (app: AppItem) => void;
  onToggleFavorite: (id: string) => void;
  aspectRatio: CardAspectRatio;
  cardScale: CardScale;
  cardRadius: string;
  accentColor: string;
}

export const SearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  apps,
  onSelectApp,
  onToggleFavorite,
  aspectRatio,
  cardScale,
  cardRadius,
  accentColor,
}) => {
  const [query, setQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setFocusedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredApps = apps.filter((app) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      app.title.toLowerCase().includes(q) ||
      (app.developer && app.developer.toLowerCase().includes(q)) ||
      (app.tagline && app.tagline.toLowerCase().includes(q)) ||
      (app.genre && app.genre.some(g => g.toLowerCase().includes(q))) ||
      app.platform.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-zinc-900/60">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocusedIndex(0);
            }}
            placeholder="Buscar por título, género, plataforma o creador..."
            className="flex-1 bg-transparent text-white text-base focus:outline-none placeholder-zinc-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-white rounded border border-white/10 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Search results grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredApps.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 flex flex-col items-center">
              <Sparkles className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No se encontraron aplicaciones con "{query}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredApps.map((app, index) => (
                <div key={app.id} className="flex justify-center">
                  <AppCard
                    app={app}
                    isFocused={focusedIndex === index}
                    onFocus={() => setFocusedIndex(index)}
                    onSelect={() => {
                      onSelectApp(app);
                      onClose();
                    }}
                    onToggleFavorite={onToggleFavorite}
                    aspectRatio={aspectRatio}
                    cardScale="compact"
                    cardRadius={cardRadius}
                    accentColor={accentColor}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
