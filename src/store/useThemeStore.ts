import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
}

interface ThemeActions {
  init: () => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState & ThemeActions>((set) => ({
  theme: 'light',
  init: () => {
    const stored = (localStorage.getItem('theme') as Theme) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', stored === 'dark');
    set({ theme: stored });
  },
  toggle: () => set((state) => {
    const next = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
    return { theme: next };
  }),
}));
