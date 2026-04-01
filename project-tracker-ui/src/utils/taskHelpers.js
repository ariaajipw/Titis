// src/utils/taskHelpers.js

/**
 * Filter tasks berdasarkan status kolom (Case-Insensitive)
 * Menyamakan input dari database (misal: "Todo") dengan key kolom (misal: "todo")
 */
export const filterTasksByStatus = (tasks, statusKey) => {
  if (!Array.isArray(tasks)) return [];
  
  return tasks.filter((task) => {
    const taskStatus = task?.status?.toLowerCase();
    const targetKey = statusKey?.toLowerCase();

    // Mapping khusus jika di DB pakai 'in_progress' tapi di UI pakai 'doing' (atau sebaliknya)
    if (targetKey === 'in_progress' || targetKey === 'doing') {
      return taskStatus === 'in_progress' || taskStatus === 'doing';
    }

    return taskStatus === targetKey;
  });
};

/**
 * Format tanggal ISO → "25 Mar 2026"
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
 */
export const isOverdue = (dateString, status) => {
  if (!dateString) return false;
  
  // Jika sudah selesai (done), tidak dianggap overdue
  const currentStatus = status?.toLowerCase();
  if (currentStatus === 'done') return false;

  return new Date(dateString) < new Date(new Date().toDateString());
};

/**
 * Ambil inisial dari nama untuk avatar
 */
export const getInitial = (initial) => {
  if (!initial) return '?';
  if (initial.trim().length <= 3) return initial.trim().toUpperCase();
  
  return initial
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

/**
 * Hitung statistik ringkasan dari semua tasks (Case-Insensitive)
 */
export const computeStats = (tasks) => {
  if (!Array.isArray(tasks)) {
    return { total: 0, todo: 0, in_progress: 0, done: 0, overdue: 0 };
  }

  return {
    total: tasks.length,
    todo: tasks.filter((t) => t?.status?.toLowerCase() === 'todo').length,
    in_progress: tasks.filter((t) => {
      const s = t?.status?.toLowerCase();
      return s === 'in_progress' || s === 'doing';
    }).length,
    done: tasks.filter((t) => t?.status?.toLowerCase() === 'done').length,
    overdue: tasks.filter((t) => isOverdue(t.due_date, t.status)).length,
  };
};