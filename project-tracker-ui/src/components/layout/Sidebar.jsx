// src/components/layout/Sidebar.jsx
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  BarChart2,
  Settings,
  ChevronRight,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks',     label: 'Tasks',     icon: CheckSquare },
  { id: 'team',      label: 'Tim',       icon: Users },
  { id: 'reports',   label: 'Laporan',   icon: BarChart2 },
  { id: 'settings',  label: 'Pengaturan',icon: Settings },
];

export const Sidebar = ({ activeMenu, onMenuClick }) => (
  <aside className="hidden lg:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 h-screen">
    {/* ── Logo ── */}
    <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-800">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
        <Zap className="w-4 h-4 text-white" fill="white" />
      </div>
      <div>
        <p className="text-white font-bold text-lg leading-none">Titis</p>
        <p className="text-zinc-500 text-xs mt-0.5">Project Tracker</p>
      </div>
    </div>

    {/* ── Nav ── */}
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = activeMenu === id;
        return (
          <button
            key={id}
            onClick={() => onMenuClick(id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-150 group
              ${isActive
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70'}
            `}
          >
            <Icon
              className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}
            />
            <span className="flex-1 text-left">{label}</span>
            {isActive && <ChevronRight className="w-3.5 h-3.5 text-violet-400" />}
          </button>
        );
      })}
    </nav>

    {/* ── User Footer ── */}
    <div className="px-3 pb-4 border-t border-zinc-800 pt-4">
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
          AD
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-zinc-200 text-sm font-medium truncate">Admin</p>
          <p className="text-zinc-500 text-xs truncate">admin@titis.app</p>
        </div>
      </div>
    </div>
  </aside>
);
