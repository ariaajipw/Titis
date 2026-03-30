// src/utils/taskHelpers.js

/**
 * Filter tasks berdasarkan status kolom
 * @param {Array} tasks - Semua task dari API
 * @param {string} status - Status kolom ('todo' | 'in_progress' | 'done')
 * @returns {Array}
 */
export const filterTasksByStatus = (tasks, status) =>
  tasks.filter((task) => task.status === status);

/**
 * Format tanggal ISO → "25 Mar 2026"
 * @param {string} dateString - Date string dari backend
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '–';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

/**
 * Cek apakah task sudah overdue (melewati due_date)
 * @param {string} dateString
 * @returns {boolean}
 */
export const isOverdue = (dateString, status) => {
  if (!dateString || status === 'done') return false;
  return new Date(dateString) < new Date(new Date().toDateString());
};

/**
 * Ambil inisial dari nama untuk avatar
 * @param {string} initial - Bisa berupa inisial atau nama lengkap
 * @returns {string}
 */
export const getInitial = (initial) => {
  if (!initial) return '?';
  // Jika sudah berupa inisial pendek (≤3 huruf), langsung pakai
  if (initial.trim().length <= 3) return initial.trim().toUpperCase();
  // Jika nama lengkap, ambil huruf pertama tiap kata (maks 2)
  return initial
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

/**
 * Hitung statistik ringkasan dari semua tasks
 * @param {Array} tasks
 * @returns {Object}
 */
export const computeStats = (tasks) => ({
  total: tasks.length,
  todo: tasks.filter((t) => t.status === 'todo').length,
  in_progress: tasks.filter((t) => t.status === 'in_progress').length,
  done: tasks.filter((t) => t.status === 'done').length,
  overdue: tasks.filter((t) => isOverdue(t.due_date, t.status)).length,
});
