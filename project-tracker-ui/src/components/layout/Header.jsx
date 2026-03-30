// src/components/layout/Header.jsx
import { Bell, Search, RefreshCw, Zap } from 'lucide-react';

export const Header = ({ onRefresh, loading }) => (
  <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 px-4 lg:px-8 py-4 flex items-center gap-4">
    {/* Logo mobile (hanya muncul di mobile) */}
    <div className="flex lg:hidden items-center gap-2 mr-auto">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
        <Zap className="w-3.5 h-3.5 text-white" fill="white" />
      </div>
      <span className="text-white font-bold text-base">Titis</span>
    </div>

    {/* Search — hidden di mobile, tampil di lg */}
    <div className="hidden lg:flex flex-1 max-w-md">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Cari task..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
        />
      </div>
    </div>

    {/* Right Actions */}
    <div className="flex items-center gap-2 ml-auto lg:ml-0">
      {/* Refresh */}
      <button
        onClick={onRefresh}
        disabled={loading}
        title="Refresh data"
        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      </button>

      {/* Notifikasi */}
      <button className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
      </button>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer ml-1">
        AD
      </div>
    </div>
  </header>
);
