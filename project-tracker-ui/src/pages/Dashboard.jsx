// src/pages/Dashboard.jsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { StatsBar } from '../components/dashboard/StatsBar';
import { KanbanBoard } from '../components/dashboard/KanbanBoard';
import { computeStats } from '../utils/taskHelpers';

// 1. Pastikan Path Benar (Asumsi file ada di folder components/dashboard)
// 2. Hapus kurung kurawal karena ini Default Export
import AddTaskModal from '../components/dashboard/AddTaskModal'; 

export const Dashboard = ({ tasks, loading, addTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stats = computeStats(tasks);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-zinc-100 text-2xl font-bold">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Pantau semua progress task tim kamu.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-violet-900/20"
        >
          <Plus className="w-4 h-4" />
          Task Baru
        </button>
      </div>

      <StatsBar stats={stats} loading={loading} />

      <div className="flex-1 min-h-0 mt-6">
        <KanbanBoard tasks={tasks} loading={loading} />
      </div>

      {/* ✅ Nama props harus 'addTask' agar sesuai dengan file dari Claude */}
      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        addTask={addTask} 
      />
    </div>
  );
};