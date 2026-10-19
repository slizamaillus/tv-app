import React, { useState, useEffect } from 'react';
import { Search, Plus, Palette, Clock, Star } from 'lucide-react';
import { CategoryType } from '../types/launcher';

interface Props {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  onOpenAddModal: () => void;
  onOpenCustomizer: () => void;
  onOpenSearch: () => void;
  accentColor: string;
}

export const TopBannerMenu: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  onOpenAddModal,
  onOpenCustomizer,
  onOpenSearch,
  accentColor,
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const menuItems: { id: CategoryType; label: string }[] = [
    { id: 'favorites', label: 'Favoritos' },
    { id: 'streaming', label: 'Streaming' },
    { id: 'games', label: 'Video Juegos' },
    { id: 'emulators', label: 'Emuladores' },
    { id: 'productivity', label: 'Herramientas' },
    { id: 'all', label: 'Todo' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent px-6 md:px-12 py-4 flex items-center justify-between gap-6 select-none transition-all">
      {/* Zone 1: Brand Wordmark & Clock */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onSelectCategory('all'); }}
          className="text-lg md:text-xl font-extrabold tracking-tight text-white uppercase whitespace-nowrap hover:opacity-90 transition-opacity"
        >
          Aether<span style={{ color: accentColor }}>.</span>
        </a>

        <div className="hidden lg:flex items-center gap-1.5 text-zinc-400 text-xs font-mono tabular-nums ml-2 border-l border-white/10 pl-3">
          <Clock className="w-3.5 h-3.5 opacity-60" />
          <span>{time}</span>
        </div>
      </div>

      {/* Zone 2: Navigation Menu Banner ("Favoritos, Streaming, Video Juegos, Emuladores, Herramientas") */}
      <nav 
        aria-label="Menú Superior"
        className="flex items-center gap-2 sm:gap-4 md:gap-7 text-xs md:text-sm font-medium overflow-x-auto no-scrollbar py-1"
      >
        {menuItems.map((item) => {
          const isActive = selectedCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className={`relative py-1 px-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer uppercase tracking-wider text-xs ${
                isActive 
                  ? 'text-white font-bold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.id === 'favorites' && (
                <Star className="inline w-3 h-3 mr-1 text-amber-400 fill-amber-400/40" />
              )}
              {item.label}
              {isActive && (
                <span 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full shadow-sm"
                  style={{ backgroundColor: accentColor }} 
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Actions (Search, Customize, Add App) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onOpenSearch}
          className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Buscar aplicación (F o Y)"
          aria-label="Buscar"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenCustomizer}
          className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Personalizar diseño (C o Start)"
          aria-label="Personalizar apariencia"
        >
          <Palette className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap hover:brightness-110"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Agregar App</span>
        </button>
      </div>
    </header>
  );
};
