// src/components/dashboard/KanbanColumn.jsx
import { TaskCard } from './TaskCard';
import { TaskSkeleton } from './TaskSkeleton';

export const KanbanColumn = ({ column, tasks, loading }) => {
  const skeletonCount = 2;

  return (
    <div className="flex flex-col min-w-0">
      {/* ── Column Header ── */}
      <div className={`
        flex items-center justify-between
        px-4 py-3 rounded-xl mb-3
        border ${column.borderColor} ${column.headerBg}
      `}>
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${column.dotColor}`} />
          <h2 className={`text-sm font-semibold ${column.color}`}>
            {column.label}
          </h2>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${column.badgeColor}`}>
          {loading ? '–' : tasks.length}
        </span>
      </div>

      {/* ── Cards ── */}
      <div className="flex flex-col gap-3 flex-1">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <TaskSkeleton key={i} />
            ))
          : tasks.length > 0
            ? tasks.map((task) => <TaskCard key={task.id} task={task} />)
            : (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border-2 border-dashed border-zinc-700/50">
                <p className="text-zinc-600 text-sm">Tidak ada task</p>
                <p className="text-zinc-700 text-xs mt-1">di kolom ini</p>
              </div>
            )
        }
      </div>
    </div>
  );
};
