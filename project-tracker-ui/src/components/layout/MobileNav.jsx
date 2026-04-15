// src/components/layout/MobileNav.jsx
import { LayoutDashboard, CheckSquare, Users, BarChart2, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks',     label: 'Tasks',     icon: CheckSquare },
  { id: 'team',      label: 'Team',      icon: Users },
  { id: 'reports',   label: 'Reports',   icon: BarChart2 },
  { id: 'settings',  label: 'Settings',  icon: Settings },
];

export const MobileNav = ({ activeMenu, onMenuClick }) => (
  <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-slate-200 dark:border-zinc-800 transition-colors duration-200">
    <div className="flex items-center justify-around px-2 py-2">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = activeMenu === id;
        return (
          <button
            key={id}
            onClick={() => onMenuClick(id)}
            className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg min-w-0 flex-1 transition-all"
          >
            <Icon
              className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-violet-500 dark:text-violet-400' : 'text-slate-400 dark:text-zinc-500'}`}
            />
            <span
              className={`text-[10px] font-medium leading-none truncate ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-zinc-500'}`}
            >
              {label}
            </span>
            {isActive && (
              <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-violet-500 rounded-b-full" />
            )}
          </button>
        );
      })}
    </div>
  </nav>
);
