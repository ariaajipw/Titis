// src/components/dashboard/StatsBar.jsx
import { ClipboardList, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

const STAT_ITEMS = [
  {
    key: 'total',
    label: 'Total Task',
    icon: ClipboardList,
    color: 'text-zinc-300',
    bg: 'bg-zinc-700/40',
  },
  {
    key: 'in_progress',
    label: 'Sedang Jalan',
    icon: Loader2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    key: 'done',
    label: 'Selesai',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    key: 'overdue',
    label: 'Terlambat',
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
];

export const StatsBar = ({ stats, loading }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
    {STAT_ITEMS.map(({ key, label, icon: Icon, color, bg }) => (
      <div
        key={key}
        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 flex items-center gap-3"
      >
        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div className="min-w-0">
          <p className="text-zinc-500 text-xs truncate">{label}</p>
          <p className={`text-xl font-bold ${color} leading-none mt-0.5`}>
            {loading ? (
              <span className="inline-block w-6 h-5 bg-zinc-700 rounded animate-pulse" />
            ) : (
              stats[key] ?? 0
            )}
          </p>
        </div>
      </div>
    ))}
  </div>
);
