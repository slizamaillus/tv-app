export type PlatformType = 'steam' | 'windows' | 'web' | 'emulator' | 'xbox' | 'epic' | 'other';

export type CategoryType = 'all' | 'favorites' | 'games' | 'streaming' | 'productivity' | 'emulators' | 'tools';

export interface AppItem {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  category: CategoryType;
  platform: PlatformType;
  path: string; // URL, OS URI scheme (steam://, spotify:) or local path
  heroImage: string;
  posterImage: string;
  accentColor?: string;
  releaseYear?: number;
  developer?: string;
  genre?: string[];
  isFavorite: boolean;
  playCount: number;
  lastPlayed?: string; // ISO date string
  rating?: number; // e.g. 4.9
}

export type CardAspectRatio = 'poster' | 'banner' | 'square' | 'tile';
export type CardScale = 'compact' | 'normal' | 'jumbo';
export type HeroStyle = 'cinematic' | 'split' | 'minimal';
export type ControllerStyle = 'xbox' | 'playstation' | 'nintendo' | 'keyboard';
export type SoundPack = 'modern' | 'console' | 'arcade' | 'muted';

export interface CustomTheme {
  id: string;
  name: string;
  bgColor: string;
  surfaceColor: string;
  accentColor: string;
  textColor: string;
  glowIntensity: 'none' | 'subtle' | 'high' | 'ambient';
  cardRadius: '0px' | '8px' | '14px' | '22px';
  cardAspectRatio: CardAspectRatio;
  cardScale: CardScale;
  heroStyle: HeroStyle;
  ambientBackdropBlur: boolean;
  soundVolume: number; // 0 to 100
  soundPack: SoundPack;
  controllerLayout: ControllerStyle;
  fontFamily: 'Outfit' | 'Plus Jakarta Sans' | 'sans-serif';
  showPromptBar: boolean;
  showPlaytime: boolean;
}
