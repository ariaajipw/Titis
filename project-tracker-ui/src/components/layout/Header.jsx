// src/components/layout/Header.jsx
import { Bell, Search, RefreshCw, Zap, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const THEME_CYCLE = ['light', 'system', 'dark'];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];
    setTheme(next);
  };

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const label = theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System';

  return (
    <button
      onClick={cycle}
      title={`Theme: ${label} — click to cycle`}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-all"
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline text-xs font-medium">{label}</span>
    </button>
  );
};

export const Header = ({ onRefresh, loading }) => (
  <header className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-zinc-800 px-4 lg:px-8 py-3.5 flex justify-between gap-4 transition-colors duration-200">
    {/* Logo — mobile only */}
    <div className="flex lg:hidden items-center gap-2 mr-auto">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
        <Zap className="w-3.5 h-3.5 text-white" fill="white" />
      </div>
      <span className="text-slate-900 dark:text-white font-bold text-base">Titis</span>
    </div>

    {/* Search — desktop only */}
    <div className="hidden lg:flex flex-1 max-w-md">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
        />
      </div>
    </div>

    {/* Right actions */}
    <div className="flex items-center gap-1 ml-auto lg:ml-0">
      {/* Theme toggle */}
      <ThemeToggle />

      {/* Refresh */}
      <button
        onClick={onRefresh}
        disabled={loading}
        title="Refresh data"
        className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-all">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
      </button>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer ml-1 ring-2 ring-transparent hover:ring-violet-400 transition-all">
        AA
      </div>
    </div>
  </header>
);
