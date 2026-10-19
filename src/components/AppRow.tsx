import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AppItem, CardAspectRatio, CardScale } from '../types/launcher';
import { AppCard } from './AppCard';

interface Props {
  title: string;
  apps: AppItem[];
  focusedAppId: string | null;
  onSelectApp: (app: AppItem) => void;
  onFocusApp: (app: AppItem) => void;
  onToggleFavorite: (id: string) => void;
  aspectRatio: CardAspectRatio;
  cardScale: CardScale;
  cardRadius: string;
  accentColor: string;
}

export const AppRow: React.FC<Props> = ({
  title,
  apps,
  focusedAppId,
  onSelectApp,
  onFocusApp,
  onToggleFavorite,
  aspectRatio,
  cardScale,
  cardRadius,
  accentColor,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll row when focused card changes
  useEffect(() => {
    if (!focusedAppId || !rowRef.current) return;
    const cardEl = rowRef.current.querySelector(`[data-app-id="${focusedAppId}"]`) as HTMLElement;
    if (cardEl) {
      cardEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [focusedAppId]);

  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  if (apps.length === 0) return null;

  return (
    <div className="relative group/row my-6 px-8 lg:px-14">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>{title}</span>
          <span className="text-xs font-normal text-zinc-500 font-mono tabular-nums">
            ({apps.length})
          </span>
        </h2>
      </div>

      {/* Row Carousel Area */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={scrollLeft}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black border border-white/20 shadow-xl cursor-pointer"
          aria-label="Desplazar a la izquierda"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable container */}
        <div
          ref={rowRef}
          className="flex items-center gap-4 overflow-x-auto overflow-y-visible no-scrollbar py-4 px-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {apps.map((app) => (
            <div key={app.id} data-app-id={app.id} className="shrink-0">
              <AppCard
                app={app}
                isFocused={focusedAppId === app.id}
                onFocus={() => onFocusApp(app)}
                onSelect={() => onSelectApp(app)}
                onToggleFavorite={onToggleFavorite}
                aspectRatio={aspectRatio}
                cardScale={cardScale}
                cardRadius={cardRadius}
                accentColor={accentColor}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black border border-white/20 shadow-xl cursor-pointer"
          aria-label="Desplazar a la derecha"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
