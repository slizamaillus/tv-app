import React, { useState } from 'react';
import { Play, Star, Sparkles, Monitor, Gamepad2, Tv, Code, Layers } from 'lucide-react';
import { AppItem, CardAspectRatio, CardScale } from '../types/launcher';

interface Props {
  app: AppItem;
  isFocused: boolean;
  onFocus: () => void;
  onSelect: () => void;
  onToggleFavorite: (id: string) => void;
  aspectRatio: CardAspectRatio;
  cardScale: CardScale;
  cardRadius: string;
  accentColor: string;
}

export const AppCard: React.FC<Props> = ({
  app,
  isFocused,
  onFocus,
  onSelect,
  onToggleFavorite,
  aspectRatio,
  cardScale,
  cardRadius,
  accentColor,
}) => {
  const [imageError, setImageError] = useState(false);

  // Aspect ratio styles
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case 'banner':
        return 'aspect-video'; // 16:9
      case 'square':
        return 'aspect-square'; // 1:1
      case 'tile':
        return 'h-24 aspect-[2.4/1]';
      case 'poster':
      default:
        return 'aspect-[2/3]'; // 2:3 Netflix/Playnite poster
    }
  };

  // Card scaling
  const getWidthClasses = () => {
    if (aspectRatio === 'banner') {
      switch (cardScale) {
        case 'compact': return 'w-56 shrink-0';
        case 'jumbo': return 'w-80 shrink-0';
        case 'normal': default: return 'w-68 shrink-0';
      }
    }
    if (aspectRatio === 'tile') {
      return 'w-64 shrink-0';
    }
    // Poster or square
    switch (cardScale) {
      case 'compact': return 'w-36 shrink-0';
      case 'jumbo': return 'w-52 shrink-0';
      case 'normal': default: return 'w-44 shrink-0';
    }
  };

  const getPlatformIcon = () => {
    switch (app.platform) {
      case 'steam': return <Layers className="w-3 h-3" />;
      case 'emulator': return <Gamepad2 className="w-3 h-3" />;
      case 'web': return <Tv className="w-3 h-3" />;
      case 'windows': return <Monitor className="w-3 h-3" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  const cardImage = aspectRatio === 'banner' ? (app.heroImage || app.posterImage) : (app.posterImage || app.heroImage);

  return (
    <div
      tabIndex={0}
      onMouseEnter={onFocus}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`relative group cursor-pointer transition-all duration-300 outline-none select-none ${getWidthClasses()}`}
      style={{
        transform: isFocused ? 'scale(1.06)' : 'scale(1)',
        zIndex: isFocused ? 20 : 1,
      }}
    >
      {/* Card container */}
      <div
        className={`w-full overflow-hidden relative border transition-all duration-300 shadow-md ${getAspectRatioClasses()}`}
        style={{
          borderRadius: cardRadius,
          borderColor: isFocused ? accentColor : 'rgba(255, 255, 255, 0.12)',
          boxShadow: isFocused 
            ? `0 12px 30px -6px ${accentColor}40, 0 0 0 2px ${accentColor}`
            : '0 4px 12px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Poster / Backdrop Image or Fallback */}
        {!imageError && cardImage ? (
          <img
            src={cardImage}
            alt={app.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-zinc-800 to-zinc-950 relative"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-inner"
              style={{ backgroundColor: `${app.accentColor || accentColor}25`, color: app.accentColor || accentColor }}
            >
              {getPlatformIcon()}
            </div>
            <span className="text-xs font-bold text-white line-clamp-2">{app.title}</span>
            <span className="text-[10px] text-zinc-400 mt-1 uppercase">{app.platform}</span>
          </div>
        )}

        {/* Gradient scrim at bottom of card */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

        {/* Favorite marker (unboxed subtle icon) */}
        {app.isFavorite && (
          <div className="absolute top-2 right-2 p-1 text-amber-400 drop-shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </div>
        )}

        {/* Focused / Hover Play Action Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 ${
            isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 active:scale-95"
            style={{ backgroundColor: accentColor, color: '#ffffff' }}
          >
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
        </div>

        {/* Bottom card info */}
        <div className="absolute bottom-2 inset-x-2 text-left pointer-events-none">
          <p className="text-xs font-semibold text-white truncate drop-shadow-sm">
            {app.title}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 drop-shadow-sm mt-0.5">
            <span className="uppercase font-mono">{app.platform}</span>
            {app.releaseYear && (
              <>
                <span aria-hidden="true">·</span>
                <span>{app.releaseYear}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
