// src/pages/Reports.jsx
import { TrendingUp, CheckCircle2, Clock, AlertTriangle, BarChart2 } from 'lucide-react';
import { computeStats } from '../utils/taskHelpers';

const ProgressBar = ({ value, max, colorClass }) => {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-100 dark:bg-zinc-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 w-8 text-right">{pct}%</span>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, iconBg, iconColor }) => (
  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-5 py-4 flex items-center gap-4 transition-colors duration-200">
    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{value}</p>
      <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-300 dark:text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export const Reports = ({ tasks, loading }) => {
  const stats = computeStats(tasks);
  const completionRate = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);

  // Category breakdown
  const categories = ['Design', 'Development', 'Research'];
  const catCounts = categories.map((cat) => ({
    name: cat,
    total: tasks.filter((t) => t.category === cat).length,
    done:  tasks.filter((t) => t.category === cat && t.status === 'done').length,
  }));

  const catColors = {
    Design:      'bg-violet-500',
    Development: 'bg-blue-500',
    Research:    'bg-emerald-500',
  };

  return (
    <div className="max-w-full">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-slate-900 dark:text-zinc-100 text-2xl font-bold">Reports</h1>
        <p className="text-slate-400 dark:text-zinc-500 text-sm mt-1">
          Overview of your project progress and team activity.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard
              icon={BarChart2}    label="Total Tasks"      value={stats.total}
              iconBg="bg-slate-100 dark:bg-zinc-700/40"
              iconColor="text-slate-500 dark:text-zinc-300"
            />
            <StatCard
              icon={CheckCircle2} label="Completed"         value={stats.done}
              sub={`${completionRate}% completion rate`}
              iconBg="bg-emerald-50 dark:bg-emerald-500/10"
              iconColor="text-emerald-500 dark:text-emerald-400"
            />
            <StatCard
              icon={Clock}        label="In Progress"       value={stats.in_progress}
              iconBg="bg-blue-50 dark:bg-blue-500/10"
              iconColor="text-blue-500 dark:text-blue-400"
            />
            <StatCard
              icon={AlertTriangle} label="Overdue"          value={stats.overdue}
              iconBg="bg-red-50 dark:bg-red-500/10"
              iconColor="text-red-500 dark:text-red-400"
            />
          </div>

          {/* ── Overall Progress ── */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 mb-6 transition-colors duration-200">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              <h2 className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Overall Completion</h2>
            </div>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900 dark:text-zinc-100">{completionRate}%</span>
              <span className="text-xs text-slate-400 dark:text-zinc-500">{stats.done} / {stats.total} tasks done</span>
            </div>
            <ProgressBar value={stats.done} max={stats.total} colorClass="bg-gradient-to-r from-violet-500 to-indigo-500" />
          </div>

          {/* ── By Category ── */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 transition-colors duration-200">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-zinc-200 mb-4">Progress by Category</h2>
            {catCounts.every((c) => c.total === 0) ? (
              <p className="text-slate-400 dark:text-zinc-500 text-sm text-center py-6">No category data yet.</p>
            ) : (
              <div className="space-y-4">
                {catCounts.map(({ name, total, done }) => (
                  <div key={name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${catColors[name] ?? 'bg-slate-400'}`} />
                        <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">{name}</span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-zinc-500">{done}/{total} tasks</span>
                    </div>
                    <ProgressBar value={done} max={total} colorClass={catColors[name] ?? 'bg-slate-500'} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
