// src/pages/Tasks.jsx
import { useState } from 'react';
import { Plus, Search, Calendar, AlertCircle, CheckCircle2, Clock, Circle } from 'lucide-react';
import AddTaskModal from '../components/dashboard/AddTaskModal';
import { PRIORITY_CONFIG } from '../constants/kanban';
import { formatDate, isOverdue } from '../utils/taskHelpers';

const STATUS_FILTERS = [
  { key: 'all',         label: 'All' },
  { key: 'todo',        label: 'To-do' },
  { key: 'in_progress', label: 'On-going' },
  { key: 'done',        label: 'Done' },
];

const StatusIcon = ({ status }) => {
  if (status === 'done')        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === 'in_progress') return <Clock className="w-4 h-4 text-blue-500" />;
  return <Circle className="w-4 h-4 text-slate-400 dark:text-zinc-500" />;
};

const StatusBadge = ({ status }) => {
  const map = {
    done:        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    in_progress: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    todo:        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-700/50 dark:text-zinc-400 dark:border-zinc-600/50',
  };
  const labels = { done: 'Done', in_progress: 'On-going', todo: 'To-do' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] ?? map.todo}`}>
      <StatusIcon status={status} />
      {labels[status] ?? status}
    </span>
  );
};

export const Tasks = ({ tasks, loading, addTask }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = tasks
    .filter((t) => statusFilter === 'all' || t.status === statusFilter)
    .filter((t) => !search.trim() || t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex flex-col">
      {/* ── Page Header ── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <h1 className="text-slate-900 dark:text-zinc-100 text-2xl font-bold">Tasks</h1>
          <p className="text-slate-400 dark:text-zinc-500 text-sm mt-1">
            {loading ? 'Loading...' : `${tasks.length} total task${tasks.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-violet-900/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-800/50 rounded-lg">
          {STATUS_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                statusFilter === key
                  ? 'bg-white dark:bg-zinc-700 text-violet-600 dark:text-violet-300 shadow-sm'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Task List ── */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-zinc-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-slate-300 dark:text-zinc-600" />
            </div>
            <p className="text-slate-600 dark:text-zinc-400 font-medium">No tasks found</p>
            <p className="text-slate-400 dark:text-zinc-600 text-sm mt-1">
              {search ? 'Try a different search term' : 'Create your first task to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {filtered.map((task) => {
              const priorityCfg = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG['Sedang'];
              const overdue = isOverdue(task.due_date, task.status);

              return (
                <div
                  key={task.id}
                  className="flex items-center gap-4 px-4 py-3.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <StatusIcon status={task.status} />

                  {/* Title + description */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors ${task.status === 'done' ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-800 dark:text-zinc-100'}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-slate-400 dark:text-zinc-500 truncate mt-0.5">{task.description}</p>
                    )}
                  </div>

                  {/* Meta — hidden on small screens */}
                  <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={task.status} />

                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${priorityCfg.className}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dot}`} />
                      {priorityCfg.label}
                    </span>

                    {task.due_date && (
                      <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-zinc-500'}`}>
                        {overdue && <AlertCircle className="w-3 h-3" />}
                        <Calendar className="w-3 h-3" />
                        {formatDate(task.due_date)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addTask={addTask}
      />
    </div>
  );
};
