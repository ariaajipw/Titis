// src/pages/Dashboard.jsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { StatsBar } from '../components/dashboard/StatsBar';
import { KanbanBoard } from '../components/dashboard/KanbanBoard';
import { computeStats } from '../utils/taskHelpers';
import AddTaskModal from '../components/dashboard/AddTaskModal';

export const Dashboard = ({ tasks, loading, addTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stats = computeStats(tasks);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-slate-900 dark:text-zinc-100 text-2xl font-bold">Dashboard</h1>
          <p className="text-slate-400 dark:text-zinc-500 text-sm mt-1">
            Monitor all of your tasks progress.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-violet-900/20"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <StatsBar stats={stats} loading={loading} />

      <div className="flex-1 min-h-0 mt-6">
        <KanbanBoard tasks={tasks} loading={loading} />
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addTask={addTask}
      />
    </div>
  );
};
