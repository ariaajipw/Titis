// src/components/dashboard/KanbanColumn.jsx
import { TaskCard } from './TaskCard';
import { TaskSkeleton } from './TaskSkeleton';

export const KanbanColumn = ({ column, tasks, loading }) => {
  const skeletonCount = 2;

  return (
    <div className="flex flex-col justify-center min-w-0">
      {/* ── Column Header ── */}
      <div className={`
        flex items-center justify-center justify-between
        px-4 py-3 rounded-xl mb-3
        border ${column.borderColor} ${column.headerBg}
        transition-colors duration-200
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
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border-2 border-dashed border-slate-100 dark:border-zinc-300/50 mb-5">
                <p className="text-slate-400 dark:text-zinc-600 text-sm">No tasks</p>
                <p className="text-slate-300 dark:text-zinc-700 text-xs mt-1">in this column</p>
              </div>
            )
        }
      </div>
    </div>
  );
};
