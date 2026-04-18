// src/hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import api from '../api/axiosInstance'; // Pakai path asli kamu

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── 1. FUNGSI AMBIL DATA (GET) ──────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/tasks');
      
      // Menggabungkan logika 'smart-access' data dari kode kamu & Claude
      const data = response.data?.data ?? response.data ?? [];
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Failed to fetch tasks.';
      setError(message);
      // Tetap pakai toast di sini agar kalau API mati langsung ketahuan
      toast.error('Error Connection', { description: message });
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── 2. FUNGSI TAMBAH DATA (POST) ─────────────────────
  const addTask = async (taskData) => {
    try {
      // Kita tidak perlu setLoading(true) di sini agar UI tidak flicker
      // Karena kita akan melakukan refetch setelahnya
      await api.post('/tasks', taskData);
      
      // REFRESH DATA OTOMATIS
      await fetchTasks(); 
      
      return { success: true, error: null };
    } catch (err) {
      // Menangkap error validasi dari Laravel (misal: title wajib diisi)
      const message = 
        err?.response?.data?.message ?? 
        err?.response?.data?.errors?.title?.[0] ?? 
        "Failed to add task.";
        
      return { success: false, error: message };
    }
  };

  // ─── 3. AUTO-RUN ──────────────────────────────────────
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks, // Kita beri nama refetch agar konsisten dengan kodemu
    addTask,             // Ini "senjata" baru untuk Modal nanti
  };
};