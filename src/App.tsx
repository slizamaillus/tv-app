import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  AppItem, 
  CustomTheme, 
  CategoryType, 
  PlatformType 
} from './types/launcher';
import { INITIAL_APPS, THEME_PRESETS } from './data/defaultApps';
import { sounds } from './services/soundEffects';
import { useGamepad } from './hooks/useGamepad';

// Components
import { TopBannerMenu } from './components/TopBannerMenu';
import { HeroSpotlight } from './components/HeroSpotlight';
import { AppRow } from './components/AppRow';
import { GamepadPromptBar } from './components/GamepadPromptBar';
import { AddAppModal } from './components/AddAppModal';
import { AppDetailsModal } from './components/AppDetailsModal';
import { CustomizerModal } from './components/CustomizerModal';
import { SearchModal } from './components/SearchModal';
import { LaunchOverlay } from './components/LaunchOverlay';
import { Sparkles, Plus } from 'lucide-react';

const STORAGE_KEY_APPS = 'aether_launcher_apps_v1';
const STORAGE_KEY_THEME = 'aether_launcher_theme_v1';

export default function App() {
  // 1. Persistent State
  const [apps, setApps] = useState<AppItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load apps from localStorage', e);
    }
    return INITIAL_APPS;
  });

  const [theme, setTheme] = useState<CustomTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved) {
        return { ...THEME_PRESETS[0], ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load theme from localStorage', e);
    }
    return THEME_PRESETS[0];
  });

  // 2. Navigation & UI State
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('favorites');
  const [focusedAppId, setFocusedAppId] = useState<string>(() => {
    const initialFav = apps.find(a => a.isFavorite);
    return initialFav ? initialFav.id : (apps[0]?.id || 'cyberpunk-odyssey');
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [detailsModalApp, setDetailsModalApp] = useState<AppItem | null>(null);
  const [launchingApp, setLaunchingApp] = useState<AppItem | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
    } catch (err) {
      console.error(err);
    }
  }, [apps]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify(theme));
      sounds.setVolume(theme.soundVolume);
      sounds.setSoundPack(theme.soundPack);
    } catch (err) {
      console.error(err);
    }
  }, [theme]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Categorized lists
  const favoriteApps = useMemo(() => apps.filter(a => a.isFavorite), [apps]);
  const gameApps = useMemo(() => apps.filter(a => a.category === 'games'), [apps]);
  const streamingApps = useMemo(() => apps.filter(a => a.category === 'streaming'), [apps]);
  const emulatorApps = useMemo(() => apps.filter(a => a.category === 'emulators'), [apps]);
  const productivityApps = useMemo(() => apps.filter(a => a.category === 'productivity' || a.category === 'tools'), [apps]);

  // The single current section's apps list
  const currentSectionApps = useMemo(() => {
    if (selectedCategory === 'favorites') return favoriteApps;
    if (selectedCategory === 'streaming') return streamingApps;
    if (selectedCategory === 'games') return gameApps;
    if (selectedCategory === 'emulators') return emulatorApps;
    if (selectedCategory === 'productivity') return productivityApps;
    return apps; // 'all'
  }, [selectedCategory, favoriteApps, streamingApps, gameApps, emulatorApps, productivityApps, apps]);

  // Currently focused app (fallback to first in section or first overall)
  const focusedApp = useMemo(() => {
    const found = currentSectionApps.find(a => a.id === focusedAppId);
    if (found) return found;
    return currentSectionApps[0] || apps.find(a => a.id === focusedAppId) || apps[0] || null;
  }, [currentSectionApps, focusedAppId, apps]);

  // Section title for the single preview bar
  const getSectionTitle = (cat: CategoryType) => {
    switch (cat) {
      case 'favorites': return 'Favoritos';
      case 'streaming': return 'Streaming & Cine';
      case 'games': return 'Video Juegos';
      case 'emulators': return 'Emuladores';
      case 'productivity': return 'Herramientas';
      case 'all': default: return 'Todas las Aplicaciones';
    }
  };

  // Category list order for bumper navigation (matches top banner menu)
  const categoriesList: CategoryType[] = ['favorites', 'streaming', 'games', 'emulators', 'productivity', 'all'];

  // Switch category handler (updates section and automatically focuses first app)
  const handleSelectCategory = useCallback((cat: CategoryType) => {
    sounds.playMove();
    setSelectedCategory(cat);
    let targetList: AppItem[] = [];
    if (cat === 'favorites') targetList = apps.filter(a => a.isFavorite);
    else if (cat === 'streaming') targetList = apps.filter(a => a.category === 'streaming');
    else if (cat === 'games') targetList = apps.filter(a => a.category === 'games');
    else if (cat === 'emulators') targetList = apps.filter(a => a.category === 'emulators');
    else if (cat === 'productivity') targetList = apps.filter(a => a.category === 'productivity' || a.category === 'tools');
    else targetList = apps;

    if (targetList.length > 0) {
      setFocusedAppId(targetList[0].id);
    }
  }, [apps]);

  // Handle app launch
  const handleLaunchApp = useCallback((app: AppItem) => {
    sounds.playLaunch();
    setApps(prev => prev.map(item => {
      if (item.id === app.id) {
        return {
          ...item,
          playCount: (item.playCount || 0) + 1,
          lastPlayed: new Date().toISOString(),
        };
      }
      return item;
    }));
    setLaunchingApp(app);
  }, []);

  // Handle toggle favorite
  const handleToggleFavorite = useCallback((appId: string) => {
    sounds.playSelect();
    setApps(prev => prev.map(item => {
      if (item.id === appId) {
        const next = !item.isFavorite;
        showToast(next ? `★ "${item.title}" añadida a Favoritos` : `Removida de Favoritos`);
        return { ...item, isFavorite: next };
      }
      return item;
    }));
  }, []);

  // Handle add app
  const handleAddApp = useCallback((newApp: AppItem) => {
    sounds.playSelect();
    setApps(prev => [newApp, ...prev]);
    setFocusedAppId(newApp.id);
    showToast(`✓ "${newApp.title}" agregada al catálogo`);
  }, []);

  // Handle update app
  const handleUpdateApp = useCallback((updated: AppItem) => {
    sounds.playSelect();
    setApps(prev => prev.map(item => item.id === updated.id ? updated : item));
    showToast(`✓ Cambios guardados para "${updated.title}"`);
  }, []);

  // Handle delete app
  const handleDeleteApp = useCallback((appId: string) => {
    sounds.playBack();
    setApps(prev => prev.filter(item => item.id !== appId));
    showToast(`Aplicación eliminada del catálogo`);
  }, []);

  // Theme update helpers
  const handleUpdateTheme = useCallback((updated: Partial<CustomTheme>) => {
    setTheme(prev => ({ ...prev, ...updated }));
  }, []);

  const handleApplyPreset = useCallback((preset: CustomTheme) => {
    setTheme(preset);
    showToast(`Tema aplicado: ${preset.name}`);
  }, []);

  const handleResetToDefaults = useCallback(() => {
    setApps(INITIAL_APPS);
    setTheme(THEME_PRESETS[0]);
    localStorage.removeItem(STORAGE_KEY_APPS);
    localStorage.removeItem(STORAGE_KEY_THEME);
    showToast(`Se han restablecido los ajustes iniciales`);
  }, []);

  // Export / Import
  const handleExportConfig = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      theme,
      apps,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aether-launcher-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Configuración exportada correctamente`);
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.apps && Array.isArray(imported.apps)) {
          setApps(imported.apps);
        }
        if (imported.theme) {
          setTheme(prev => ({ ...prev, ...imported.theme }));
        }
        showToast(`✓ Datos importados con éxito`);
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Any modal open flag
  const isAnyModalOpen = isAddModalOpen || isCustomizerOpen || isSearchOpen || Boolean(detailsModalApp) || Boolean(launchingApp);

  // Close all modals helper
  const closeAllModals = useCallback(() => {
    sounds.playBack();
    setIsAddModalOpen(false);
    setIsCustomizerOpen(false);
    setIsSearchOpen(false);
    setDetailsModalApp(null);
    setLaunchingApp(null);
  }, []);

  // Gamepad / Keyboard actions
  const gamepadActions = useMemo(() => ({
    onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => {
      if (isAnyModalOpen) return;
      sounds.playMove();

      if (currentSectionApps.length === 0) return;
      const currentIndex = currentSectionApps.findIndex(a => a.id === focusedAppId);

      if (direction === 'left') {
        const nextIdx = (currentIndex - 1 + currentSectionApps.length) % currentSectionApps.length;
        setFocusedAppId(currentSectionApps[nextIdx].id);
      } else if (direction === 'right') {
        const nextIdx = (currentIndex + 1) % currentSectionApps.length;
        setFocusedAppId(currentSectionApps[nextIdx].id);
      } else if (direction === 'up') {
        // Move to previous section in menu
        const currentCatIdx = categoriesList.indexOf(selectedCategory);
        const nextCatIdx = (currentCatIdx - 1 + categoriesList.length) % categoriesList.length;
        handleSelectCategory(categoriesList[nextCatIdx]);
      } else if (direction === 'down') {
        // Move to next section in menu
        const currentCatIdx = categoriesList.indexOf(selectedCategory);
        const nextCatIdx = (currentCatIdx + 1) % categoriesList.length;
        handleSelectCategory(categoriesList[nextCatIdx]);
      }
    },
    onSelect: () => {
      if (isAnyModalOpen) return;
      if (focusedApp) {
        handleLaunchApp(focusedApp);
      }
    },
    onBack: () => {
      if (isAnyModalOpen) {
        closeAllModals();
      } else {
        sounds.playBack();
      }
    },
    onActionX: () => {
      if (isAnyModalOpen) return;
      if (focusedApp) {
        handleToggleFavorite(focusedApp.id);
      }
    },
    onActionY: () => {
      sounds.playSelect();
      setIsSearchOpen(prev => !prev);
    },
    onBumper: (side: 'left' | 'right') => {
      if (isAnyModalOpen) return;
      sounds.playMove();
      const currentIdx = categoriesList.indexOf(selectedCategory);
      const nextIdx = side === 'left' 
        ? (currentIdx - 1 + categoriesList.length) % categoriesList.length 
        : (currentIdx + 1) % categoriesList.length;
      handleSelectCategory(categoriesList[nextIdx]);
    },
    onMenu: () => {
      sounds.playSelect();
      setIsCustomizerOpen(prev => !prev);
    },
  }), [isAnyModalOpen, currentSectionApps, focusedAppId, focusedApp, handleLaunchApp, closeAllModals, handleToggleFavorite, categoriesList, selectedCategory, handleSelectCategory]);

  // Hook for Gamepad & Keyboard
  const { hasGamepad, activeGamepadName, inputMode } = useGamepad(gamepadActions, true);

  return (
    <div 
      className="min-h-screen text-white relative transition-colors duration-500 overflow-x-hidden pb-16 selection:bg-white/20"
      style={{
        backgroundColor: theme.bgColor,
        fontFamily: theme.fontFamily === 'Outfit' ? '"Outfit", sans-serif' : '"Plus Jakarta Sans", sans-serif',
        ['--bg-main' as string]: theme.bgColor,
        ['--surface-main' as string]: theme.surfaceColor,
        ['--accent-main' as string]: theme.accentColor,
      }}
    >
      {/* Dynamic Ambient Glow matching focused app */}
      {theme.ambientBackdropBlur && focusedApp && (
        <div 
          className="fixed inset-0 pointer-events-none transition-opacity duration-1000 ease-out z-0 opacity-25 filter blur-[120px] scale-125"
          style={{
            backgroundImage: `url(${focusedApp.heroImage || focusedApp.posterImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      )}

      {/* 1. TOP BANNER MENU: "Favoritos, Streaming, Video Juegos, Emuladores, Herramientas" */}
      <TopBannerMenu
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onOpenAddModal={() => {
          sounds.playSelect();
          setIsAddModalOpen(true);
        }}
        onOpenCustomizer={() => {
          sounds.playSelect();
          setIsCustomizerOpen(true);
        }}
        onOpenSearch={() => {
          sounds.playSelect();
          setIsSearchOpen(true);
        }}
        accentColor={theme.accentColor}
      />

      {/* 2. UPPER / MIDDLE AREA: Hero Spotlight of the Focused App */}
      <HeroSpotlight
        app={focusedApp}
        onLaunch={handleLaunchApp}
        onToggleFavorite={handleToggleFavorite}
        onOpenDetails={(app) => {
          sounds.playSelect();
          setDetailsModalApp(app);
        }}
        accentColor={theme.accentColor}
        heroStyle={theme.heroStyle}
        showPlaytime={theme.showPlaytime}
      />

      {/* 3. LOWER AREA: EXACTLY ONE APP PREVIEW BAR CORRESPONDING TO THE SELECTED SECTION */}
      <section 
        aria-label="Barra de Previsualización de Aplicaciones"
        className="relative z-10 -mt-2 pb-10"
      >
        {currentSectionApps.length > 0 ? (
          <AppRow
            title={getSectionTitle(selectedCategory)}
            apps={currentSectionApps}
            focusedAppId={focusedAppId}
            onSelectApp={handleLaunchApp}
            onFocusApp={(app) => setFocusedAppId(app.id)}
            onToggleFavorite={handleToggleFavorite}
            aspectRatio={theme.cardAspectRatio}
            cardScale={theme.cardScale}
            cardRadius={theme.cardRadius}
            accentColor={theme.accentColor}
          />
        ) : (
          <div className="px-8 lg:px-14 py-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-7 h-7 text-zinc-500 mb-2 opacity-50" />
              <p className="text-sm font-semibold text-zinc-300">
                No hay aplicaciones en {getSectionTitle(selectedCategory)}
              </p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Puedes agregar nuevas aplicaciones o marcarlas como favoritas con el botón [X] o la estrella.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-3.5 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer hover:brightness-110"
                style={{ backgroundColor: theme.accentColor }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Aplicación</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 px-4 py-2 rounded-xl bg-zinc-900/95 text-white border border-white/20 shadow-2xl backdrop-blur-md text-xs font-medium animate-bounce flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Bottom Gamepad / Keyboard Prompts Bar */}
      {theme.showPromptBar && (
        <GamepadPromptBar
          controllerLayout={theme.controllerLayout}
          inputMode={inputMode}
          hasGamepad={hasGamepad}
          gamepadName={activeGamepadName}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onToggleSearch={() => setIsSearchOpen(true)}
          accentColor={theme.accentColor}
        />
      )}

      {/* Modals */}
      <AddAppModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddApp={handleAddApp}
        existingApps={apps}
        accentColor={theme.accentColor}
      />

      <AppDetailsModal
        app={detailsModalApp}
        isOpen={Boolean(detailsModalApp)}
        onClose={() => setDetailsModalApp(null)}
        onUpdateApp={handleUpdateApp}
        onDeleteApp={handleDeleteApp}
        onLaunch={handleLaunchApp}
        accentColor={theme.accentColor}
      />

      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        theme={theme}
        onUpdateTheme={handleUpdateTheme}
        onApplyPreset={handleApplyPreset}
        onResetToDefaults={handleResetToDefaults}
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        apps={apps}
        onSelectApp={handleLaunchApp}
        onToggleFavorite={handleToggleFavorite}
        aspectRatio={theme.cardAspectRatio}
        cardScale={theme.cardScale}
        cardRadius={theme.cardRadius}
        accentColor={theme.accentColor}
      />

      <LaunchOverlay
        app={launchingApp}
        isOpen={Boolean(launchingApp)}
        onClose={() => setLaunchingApp(null)}
        accentColor={theme.accentColor}
      />
    </div>
  );
}
