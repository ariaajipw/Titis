// src/hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import api from '../api/axiosInstance';

/**
 * Custom hook untuk fetch, state, dan refresh data tasks
 * Pisahkan data-fetching logic dari komponen UI (Separation of Concerns)
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/tasks');

      /**
       * Sesuaikan dengan struktur response Laravel kamu.
       * Jika pakai API Resource: response.data.data
       * Jika plain collection: response.data
       */
      const data = response.data?.data ?? response.data;
      setTasks(Array.isArray(data) ? data : []);

    } catch (err) {
      const message = err.message || 'Gagal memuat data tasks.';
      setError(message);
      toast.error(message, {
        description: 'Pastikan Laravel API sudah running dan CORS dikonfigurasi.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch saat hook pertama kali dipakai
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  };
};
