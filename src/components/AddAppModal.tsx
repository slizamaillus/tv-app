import React, { useState } from 'react';
import { X, Plus, Sparkles, FolderOpen, Link as LinkIcon, Check, Image as ImageIcon } from 'lucide-react';
import { AppItem, CategoryType, PlatformType } from '../types/launcher';
import { PRESET_LIBRARY_CATALOG } from '../data/defaultApps';

// Fallback images
import heroScifi from '../assets/images/launcher_hero_scifi_1792442782665.jpg';
import heroFantasy from '../assets/images/launcher_hero_fantasy_1792442783729.jpg';
import heroRacing from '../assets/images/launcher_hero_racing_1792442784879.jpg';
import heroCinema from '../assets/images/launcher_cinema_lounge_1792442783993.jpg';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddApp: (newApp: AppItem) => void;
  existingApps: AppItem[];
  accentColor: string;
}

export const AddAppModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAddApp,
  existingApps,
  accentColor,
}) => {
  const [activeTab, setActiveTab] = useState<'custom' | 'presets'>('custom');

  // Form states
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('games');
  const [platform, setPlatform] = useState<PlatformType>('windows');
  const [path, setPath] = useState('');
  const [heroImage, setHeroImage] = useState(heroScifi);
  const [posterImage, setPosterImage] = useState(heroScifi);
  const [developer, setDeveloper] = useState('');
  const [releaseYear, setReleaseYear] = useState<number>(2026);
  const [isFavorite, setIsFavorite] = useState(false);
  const [appAccent, setAppAccent] = useState('#38bdf8');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newApp: AppItem = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      tagline: tagline.trim() || undefined,
      description: description.trim() || 'Aplicación añadida por el usuario.',
      category,
      platform,
      path: path.trim() || 'https://www.google.com',
      heroImage: heroImage.trim() || heroScifi,
      posterImage: posterImage.trim() || heroImage.trim() || heroScifi,
      developer: developer.trim() || 'Personalizado',
      releaseYear: releaseYear || 2026,
      accentColor: appAccent,
      isFavorite,
      playCount: 0,
      rating: 5.0,
      genre: [platform.toUpperCase(), category.toUpperCase()],
    };

    onAddApp(newApp);
    onClose();
    resetForm();
  };

  const handleAddPreset = (preset: typeof PRESET_LIBRARY_CATALOG[0]) => {
    const newApp: AppItem = {
      ...preset,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isFavorite: false,
      playCount: 0,
    };
    onAddApp(newApp);
  };

  const resetForm = () => {
    setTitle('');
    setTagline('');
    setDescription('');
    setPath('');
    setDeveloper('');
  };

  const isPresetAdded = (presetTitle: string) => {
    return existingApps.some(a => a.title.toLowerCase() === presetTitle.toLowerCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/60">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Agregar Aplicación</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Configura una app de escritorio, emulador, streaming o juego</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Tab Controls (Interactive Filter Controls - zero-pill conformant) */}
        <div className="flex items-center border-b border-white/10 px-6 bg-zinc-900/30">
          <button
            onClick={() => setActiveTab('custom')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'custom'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Crear Nueva Aplicación
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'presets'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Catálogo Rápido (1-Click)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'custom' ? (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Nombre de la Aplicación *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Starfield, Kodi, Photoshop, etc."
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none"
                  />
                </div>

                {/* Developer */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Desarrollador / Estudio
                  </label>
                  <input
                    type="text"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    placeholder="Ej: Bethesda, Adobe, Valve"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Subtítulo / Lema Breve
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Ej: La próxima aventura espacial en mundos infinitos"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none"
                />
              </div>

              {/* Path / Executable URI */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Ruta Ejecutable / Protocolo URI / URL Web *
                  </label>
                  <span className="text-[11px] text-zinc-500 font-mono">steam://, spotify:, https://</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="Ej: steam://run/1716740 o spotify: o https://kodi.tv o C:\Games\App.exe"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none font-mono"
                  />
                  <LinkIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Admite protocolos directos del sistema (ej: <code className="text-zinc-300">steam://run/ID</code>, <code className="text-zinc-300">discord:</code>, <code className="text-zinc-300">spotify:</code>), enlaces web o rutas locales.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none cursor-pointer"
                  >
                    <option value="games">Juegos</option>
                    <option value="streaming">Streaming & Cine</option>
                    <option value="emulators">Emuladores</option>
                    <option value="productivity">Herramientas</option>
                    <option value="tools">Utilidades</option>
                  </select>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Plataforma</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as PlatformType)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none cursor-pointer"
                  >
                    <option value="windows">Windows / PC</option>
                    <option value="steam">Steam</option>
                    <option value="web">Web / Navegador</option>
                    <option value="emulator">Emulador</option>
                    <option value="xbox">Xbox App</option>
                    <option value="epic">Epic Games</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                {/* Release Year */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Año</label>
                  <input
                    type="number"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              {/* Artwork Selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Fondo Cinemático / Portada (URL o Preset de Estudio)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={heroImage}
                    onChange={(e) => {
                      setHeroImage(e.target.value);
                      setPosterImage(e.target.value);
                    }}
                    placeholder="URL de imagen (https://...)"
                    className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none"
                  />
                </div>

                {/* Preset artwork selector */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-zinc-400">Presets visuales:</span>
                  <button
                    type="button"
                    onClick={() => { setHeroImage(heroScifi); setPosterImage(heroScifi); }}
                    className="text-[11px] px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                  >
                    Sci-Fi
                  </button>
                  <button
                    type="button"
                    onClick={() => { setHeroImage(heroFantasy); setPosterImage(heroFantasy); }}
                    className="text-[11px] px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                  >
                    Fantasía
                  </button>
                  <button
                    type="button"
                    onClick={() => { setHeroImage(heroRacing); setPosterImage(heroRacing); }}
                    className="text-[11px] px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                  >
                    Carreras
                  </button>
                  <button
                    type="button"
                    onClick={() => { setHeroImage(heroCinema); setPosterImage(heroCinema); }}
                    className="text-[11px] px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                  >
                    Cine Lounge
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Descripción o Sinopsis
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre la aplicación, jugabilidad o funciones principales..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none resize-none"
                />
              </div>

              {/* Checkboxes & Color */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={isFavorite}
                    onChange={(e) => setIsFavorite(e.target.checked)}
                    className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                  />
                  <span>Marcar como favorita inmediatamente</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Color de Acento:</span>
                  <input
                    type="color"
                    value={appAccent}
                    onChange={(e) => setAppAccent(e.target.value)}
                    className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white shadow-lg transition-transform active:scale-95 cursor-pointer hover:brightness-110"
                  style={{ backgroundColor: accentColor }}
                >
                  Guardar en el Lanzador
                </button>
              </div>
            </form>
          ) : (
            /* Presets 1-Click Catalog */
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 mb-3">
                Selecciona aplicaciones populares para agregarlas a tu lanzador al instante con arte en alta definición y configuración lista:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_LIBRARY_CATALOG.map((preset) => {
                  const added = isPresetAdded(preset.title);
                  return (
                    <div
                      key={preset.title}
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/70 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div 
                          className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-zinc-800"
                        >
                          <img
                            src={preset.posterImage}
                            alt={preset.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{preset.title}</p>
                          <p className="text-[11px] text-zinc-400 truncate">{preset.tagline}</p>
                        </div>
                      </div>

                      {added ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 px-2 py-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Agregada</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddPreset(preset)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all transform active:scale-95 cursor-pointer whitespace-nowrap hover:brightness-110"
                          style={{ backgroundColor: accentColor }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
