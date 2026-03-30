// src/constants/kanban.js

/**
 * Konfigurasi kolom Kanban.
 * 'key' harus match persis dengan nilai enum di database Laravel.
 */
export const KANBAN_COLUMNS = [
  {
    key: 'todo',
    label: 'Belum Mulai',
    color: 'text-zinc-400',
    borderColor: 'border-zinc-600',
    badgeColor: 'bg-zinc-700 text-zinc-300',
    dotColor: 'bg-zinc-400',
    headerBg: 'bg-zinc-800/60',
  },
  {
    key: 'in_progress',
    label: 'Sedang Jalan',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/50',
    badgeColor: 'bg-blue-500/20 text-blue-300',
    dotColor: 'bg-blue-400',
    headerBg: 'bg-blue-950/40',
  },
  {
    key: 'done',
    label: 'Selesai',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    badgeColor: 'bg-emerald-500/20 text-emerald-300',
    dotColor: 'bg-emerald-400',
    headerBg: 'bg-emerald-950/40',
  },
];

export const PRIORITY_CONFIG = {
  // Nilai enum dari Laravel: 'Tinggi', 'Sedang', 'Rendah'
  Tinggi: {
    label: 'Tinggi',
    className: 'bg-red-500/20 text-red-400 border border-red-500/30',
    dot: 'bg-red-400',
  },
  Sedang: {
    label: 'Sedang',
    className: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    dot: 'bg-amber-400',
  },
  Rendah: {
    label: 'Rendah',
    className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
};
