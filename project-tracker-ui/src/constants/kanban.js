// src/constants/kanban.js

/**
 * Konfigurasi kolom Kanban.
 * 'key' harus match persis dengan nilai enum di database Laravel.
 * Setiap property berisi kelas Tailwind untuk light & dark mode.
 */
export const KANBAN_COLUMNS = [
  {
    key: 'todo',
    label: 'To-do',
    color: 'text-slate-600 dark:text-zinc-400',
    borderColor: 'border-slate-300 dark:border-zinc-600',
    badgeColor: 'bg-slate-100 text-slate-600 dark:bg-zinc-700 dark:text-zinc-300',
    dotColor: 'bg-slate-400 dark:bg-zinc-400',
    headerBg: 'bg-slate-50 dark:bg-zinc-800/60',
  },
  {
    key: 'in_progress',
    label: 'On-going',
    color: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-300 dark:border-blue-500/50',
    badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    dotColor: 'bg-blue-500 dark:bg-blue-400',
    headerBg: 'bg-blue-50/80 dark:bg-blue-950/40',
  },
  {
    key: 'done',
    label: 'Done',
    color: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-300 dark:border-emerald-500/50',
    badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    dotColor: 'bg-emerald-500 dark:bg-emerald-400',
    headerBg: 'bg-emerald-50/80 dark:bg-emerald-950/40',
  },
];

export const PRIORITY_CONFIG = {
  // Nilai enum dari Laravel: 'Tinggi', 'Sedang', 'Rendah'
  Tinggi: {
    label: 'High',
    className: 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
    dot: 'bg-red-500 dark:bg-red-400',
  },
  Sedang: {
    label: 'Medium',
    className: 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  Rendah: {
    label: 'Low',
    className: 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
};
