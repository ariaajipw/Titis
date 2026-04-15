// src/components/dashboard/TaskCard.jsx
import { Calendar, AlertCircle } from 'lucide-react';
import { PRIORITY_CONFIG } from '../../constants/kanban';
import { formatDate, isOverdue, getInitial } from '../../utils/taskHelpers';

export const TaskCard = ({ task }) => {
  const priorityCfg = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG['Sedang'];
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div className="
      bg-white dark:bg-zinc-800/70
      border border-slate-200 dark:border-zinc-700/50
      rounded-xl p-4
      hover:border-slate-300 dark:hover:border-zinc-600/70
      hover:shadow-md dark:hover:shadow-black/20
      hover:-translate-y-0.5
      transition-all duration-200 cursor-pointer group
    ">
      {/* ── Priority Badge ── */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${priorityCfg.className}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dot}`} />
          {priorityCfg.label}
        </span>

        {overdue && (
          <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-full px-2 py-0.5">
            <AlertCircle className="w-3 h-3" />
            Late
          </span>
        )}
      </div>

      {/* ── Title ── */}
      <h3 className="text-slate-800 dark:text-zinc-100 text-sm font-semibold leading-snug mb-1.5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors line-clamp-2">
        {task.title}
      </h3>

      {/* ── Description ── */}
      {task.description && (
        <p className="text-slate-400 dark:text-zinc-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* ── Footer: Due Date + Avatar ── */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-700/50">
        <div className={`flex items-center gap-1.5 text-xs ${overdue ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-zinc-500'}`}>
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span>{formatDate(task.due_date)}</span>
        </div>

        {task.user_initial && (
          <div
            title={task.user_initial}
            className="
              w-6 h-6 rounded-full
              bg-gradient-to-br from-violet-500 to-indigo-500
              flex items-center justify-center
              text-white text-[10px] font-bold
              ring-2 ring-slate-100 dark:ring-zinc-700
            "
          >
            {getInitial(task.user_initial)}
          </div>
        )}
      </div>
    </div>
  );
};
