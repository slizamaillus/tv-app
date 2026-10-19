import React from 'react';
import { Play, Star, Settings, ExternalLink, Flame, Trophy } from 'lucide-react';
import { AppItem, HeroStyle } from '../types/launcher';

interface Props {
  app: AppItem | null;
  onLaunch: (app: AppItem) => void;
  onToggleFavorite: (appId: string) => void;
  onOpenDetails: (app: AppItem) => void;
  accentColor: string;
  heroStyle: HeroStyle;
  showPlaytime: boolean;
}

export const HeroSpotlight: React.FC<Props> = ({
  app,
  onLaunch,
  onToggleFavorite,
  onOpenDetails,
  accentColor,
  heroStyle,
  showPlaytime,
}) => {
  if (!app) return null;

  // Split view (Playnite style)
  if (heroStyle === 'split') {
    return (
      <section className="relative pt-20 md:pt-24 px-8 pb-6 flex flex-col md:flex-row items-center gap-8 max-w-7xl mx-auto z-10">
        <div className="w-full md:w-5/12 aspect-video rounded-xl overflow-hidden shadow-2xl relative border border-white/10 group">
          <img
            src={app.heroImage || app.posterImage}
            alt={app.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 text-xs text-white/90 font-medium">
            {app.platform.toUpperCase()}
          </div>
        </div>

        <div className="w-full md:w-7/12 flex flex-col gap-3">
          {/* Metadata: unboxed clean text */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            {app.developer && <span>{app.developer}</span>}
            {app.releaseYear && (
              <>
                <span aria-hidden="true">·</span>
                <span>{app.releaseYear}</span>
              </>
            )}
            {app.rating && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400">★ {app.rating.toFixed(1)}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {app.title}
          </h1>

          {app.tagline && (
            <p className="text-base text-zinc-300 font-medium leading-snug">
              {app.tagline}
            </p>
          )}

          <p className="text-sm text-zinc-400 line-clamp-2 max-w-2xl leading-relaxed">
            {app.description}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={() => onLaunch(app)}
              className="flex items-center gap-2.5 px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-lg transition-transform transform active:scale-95 cursor-pointer hover:brightness-110"
              style={{ backgroundColor: accentColor }}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Lanzar</span>
            </button>

            <button
              onClick={() => onToggleFavorite(app.id)}
              className={`p-2.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer ${
                app.isFavorite ? 'text-amber-400' : 'text-zinc-300'
              }`}
              title={app.isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
            >
              <Star className={`w-4 h-4 ${app.isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => onOpenDetails(app)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configurar</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Minimal style
  if (heroStyle === 'minimal') {
    return (
      <section className="relative pt-20 md:pt-24 px-8 pb-4 max-w-7xl mx-auto flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <span>{app.platform.toUpperCase()}</span>
            <span aria-hidden="true">·</span>
            <span>{app.developer || 'Instalada'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {app.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onLaunch(app)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer hover:brightness-110"
            style={{ backgroundColor: accentColor }}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Lanzar</span>
          </button>
          <button
            onClick={() => onOpenDetails(app)}
            className="p-2 rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:text-white cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </section>
    );
  }

  // Default Cinematic style (Netflix / HBO Max style)
  return (
    <section className="relative w-full h-[52vh] min-h-[380px] max-h-[580px] select-none flex items-end pb-8 pt-20 px-8 lg:px-14 z-10 overflow-hidden">
      {/* Cinematic Background Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src={app.heroImage || app.posterImage}
          alt={app.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-100 transition-all duration-1000 ease-out"
        />
        {/* Measured scrims to ensure 4.5:1 contrast regardless of picture brightness */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-[var(--bg-main)]/40 to-transparent w-3/4" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-3xl flex flex-col gap-3">
        {/* Unboxed clean metadata (Zero-Pill discipline) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-300">
          <span className="uppercase font-semibold tracking-wider text-white" style={{ color: accentColor }}>
            {app.platform.toUpperCase()}
          </span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>{app.developer || 'Estudio / Creador'}</span>
          {app.releaseYear && (
            <>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>{app.releaseYear}</span>
            </>
          )}
          {app.rating && (
            <>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-amber-400">★ {app.rating.toFixed(1)}</span>
            </>
          )}
          {showPlaytime && app.playCount > 0 && (
            <>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="font-mono tabular-nums text-zinc-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                {app.playCount} partidas
              </span>
            </>
          )}
        </div>

        {/* Big Display Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md text-balance leading-none py-1">
          {app.title}
        </h1>

        {/* Tagline */}
        {app.tagline && (
          <p className="text-base sm:text-lg text-zinc-200 font-medium max-w-xl line-clamp-1 drop-shadow-sm">
            {app.tagline}
          </p>
        )}

        {/* Description synopsis */}
        <p className="text-sm text-zinc-300 line-clamp-2 max-w-2xl leading-relaxed drop-shadow-sm">
          {app.description}
        </p>

        {/* Genre text tags */}
        {app.genre && app.genre.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
            {app.genre.slice(0, 4).map((g, idx) => (
              <React.Fragment key={g}>
                <span>{g}</span>
                {idx < Math.min(app.genre!.length - 1, 3) && <span aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3.5 pt-4">
          <button
            onClick={() => onLaunch(app)}
            className="flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-bold text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer hover:brightness-110"
            style={{ backgroundColor: accentColor }}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Lanzar Aplicación</span>
          </button>

          <button
            onClick={() => onToggleFavorite(app.id)}
            className={`p-3 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer ${
              app.isFavorite ? 'text-amber-400 border-amber-500/50' : 'text-zinc-200 hover:text-white'
            }`}
            title={app.isFavorite ? 'Quitar de Favoritos' : 'Marcar como Favorito'}
            aria-label="Favorito"
          >
            <Star className={`w-4 h-4 ${app.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => onOpenDetails(app)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Detalles</span>
          </button>
        </div>
      </div>
    </section>
  );
};
