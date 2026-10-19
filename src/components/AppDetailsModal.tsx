import React, { useState } from 'react';
import { X, Play, Trash2, Star, Save, ExternalLink, Calendar, Flame, Layers } from 'lucide-react';
import { AppItem, CategoryType, PlatformType } from '../types/launcher';

interface Props {
  app: AppItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateApp: (updated: AppItem) => void;
  onDeleteApp: (appId: string) => void;
  onLaunch: (app: AppItem) => void;
  accentColor: string;
}

export const AppDetailsModal: React.FC<Props> = ({
  app,
  isOpen,
  onClose,
  onUpdateApp,
  onDeleteApp,
  onLaunch,
  accentColor,
}) => {
  if (!isOpen || !app) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(app.title);
  const [tagline, setTagline] = useState(app.tagline || '');
  const [description, setDescription] = useState(app.description);
  const [path, setPath] = useState(app.path);
  const [platform, setPlatform] = useState<PlatformType>(app.platform);
  const [category, setCategory] = useState<CategoryType>(app.category);
  const [heroImage, setHeroImage] = useState(app.heroImage);
  const [posterImage, setPosterImage] = useState(app.posterImage);
  const [developer, setDeveloper] = useState(app.developer || '');
  const [releaseYear, setReleaseYear] = useState(app.releaseYear || 2026);

  const handleSave = () => {
    const updated: AppItem = {
      ...app,
      title: title.trim(),
      tagline: tagline.trim() || undefined,
      description: description.trim(),
      path: path.trim(),
      platform,
      category,
      heroImage: heroImage.trim(),
      posterImage: posterImage.trim(),
      developer: developer.trim(),
      releaseYear: releaseYear,
    };
    onUpdateApp(updated);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar "${app.title}" del lanzador?`)) {
      onDeleteApp(app.id);
      onClose();
    }
  };

  const formattedLastPlayed = app.lastPlayed 
    ? new Date(app.lastPlayed).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }) 
    : 'Nunca';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with hero backdrop teaser */}
        <div className="relative h-44 overflow-hidden border-b border-white/10 shrink-0">
          <img
            src={heroImage || posterImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/60 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                <span className="uppercase font-mono font-bold" style={{ color: accentColor }}>
                  {platform}
                </span>
                <span aria-hidden="true">·</span>
                <span>{category.toUpperCase()}</span>
                {developer && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{developer}</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-none">{title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onLaunch(app);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-transform active:scale-95 cursor-pointer hover:brightness-110"
                style={{ backgroundColor: accentColor }}
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Iniciar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-zinc-900/60 border border-white/5">
            <div>
              <p className="text-[11px] text-zinc-400">Total Lanzamientos</p>
              <p className="text-base font-bold text-white font-mono tabular-nums flex items-center gap-1.5 mt-0.5">
                <Flame className="w-4 h-4 text-orange-400" />
                {app.playCount} veces
              </p>
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Última Vez</p>
              <p className="text-sm font-semibold text-zinc-200 mt-0.5">{formattedLastPlayed}</p>
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Año de Lanzamiento</p>
              <p className="text-sm font-semibold text-zinc-200 mt-0.5">{releaseYear}</p>
            </div>
          </div>

          {isEditing ? (
            /* Editing form */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Título</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Desarrollador</label>
                  <input
                    type="text"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Ruta o Protocolo de Lanzamiento</label>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">URL de Fondo (Hero)</label>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Ruta de Ejecución / URI
                </h4>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-white/5 font-mono text-xs text-zinc-300 overflow-x-auto">
                  <span className="truncate">{app.path}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-2" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Sinopsis
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/40 p-3 rounded-lg border border-white/5">
                  {app.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar del Lanzador</span>
                </button>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Editar Metadatos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
