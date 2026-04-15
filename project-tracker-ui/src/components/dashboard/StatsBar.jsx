// src/components/dashboard/StatsBar.jsx
import { ClipboardList, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

const STAT_ITEMS = [
  {
    key: 'total',
    label: 'Total Task',
    icon: ClipboardList,
    color: 'text-slate-600 dark:text-zinc-300',
    bg: 'bg-slate-100 dark:bg-zinc-700/40',
  },
  {
    key: 'in_progress',
    label: 'On-going',
    icon: Loader2,
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  {
    key: 'done',
    label: 'Done',
    icon: CheckCircle2,
    color: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  {
    key: 'overdue',
    label: 'Overdue',
    icon: AlertTriangle,
    color: 'text-red-500 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-500/10',
  },
];

export const StatsBar = ({ stats, loading }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
    {STAT_ITEMS.map(({ key, label, icon: Icon, color, bg }) => (
      <div
        key={key}
        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-4 flex items-center gap-3 transition-colors duration-200"
      >
        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="text-slate-700 dark:text-zinc-300 text-sm font-medium">{label}</p>
          <p className={`text-xl font-bold ${color} leading-none`}>
            {loading ? (
              <span className="inline-block w-6 h-5 bg-slate-200 dark:bg-zinc-700 rounded animate-pulse" />
            ) : (
              stats[key] ?? 0
            )}
          </p>
        </div>
      </div>
    ))}
  </div>
);
