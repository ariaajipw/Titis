// src/pages/Dashboard.jsx
import { StatsBar } from '../components/dashboard/StatsBar';
import { KanbanBoard } from '../components/dashboard/KanbanBoard';
import { computeStats } from '../utils/taskHelpers';

export const Dashboard = ({ tasks, loading }) => {
  const stats = computeStats(tasks);

  return (
    <div className="h-full flex flex-col">
      {/* ── Page Title ── */}
      <div className="mb-6">
        <h1 className="text-zinc-100 text-2xl font-bold">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Pantau semua progress task tim kamu.
        </p>
      </div>

      {/* ── Stats ── */}
      <StatsBar stats={stats} loading={loading} />

      {/* ── Kanban Board ── */}
      <div className="flex-1 min-h-0">
        <KanbanBoard tasks={tasks} loading={loading} />
      </div>
    </div>
  );
};
