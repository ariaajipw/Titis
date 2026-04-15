// src/pages/Team.jsx
import { UserPlus, Mail, MoreHorizontal, Shield, Eye, Edit3 } from 'lucide-react';

const ROLE_CONFIG = {
  owner:  { label: 'Owner',  className: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20' },
  admin:  { label: 'Admin',  className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20' },
  member: { label: 'Member', className: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-700/50 dark:text-zinc-300 dark:border-zinc-600/50' },
  viewer: { label: 'Viewer', className: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50' },
};

const MOCK_MEMBERS = [
  { id: 1, name: 'Aria Aji',     email: 'aria@titis.app',   role: 'owner',  initials: 'AA', joined: '1 Jan 2026',  tasks: 12, gradient: 'from-violet-500 to-indigo-500' },
  { id: 2, name: 'Budi Santoso', email: 'budi@titis.app',   role: 'admin',  initials: 'BS', joined: '5 Jan 2026',  tasks: 8,  gradient: 'from-blue-500 to-cyan-500' },
  { id: 3, name: 'Citra Dewi',   email: 'citra@titis.app',  role: 'member', initials: 'CD', joined: '10 Jan 2026', tasks: 5,  gradient: 'from-pink-500 to-rose-500' },
  { id: 4, name: 'Dimas Putra',  email: 'dimas@titis.app',  role: 'member', initials: 'DP', joined: '15 Feb 2026', tasks: 3,  gradient: 'from-amber-500 to-orange-500' },
  { id: 5, name: 'Eka Saputri',  email: 'eka@titis.app',    role: 'viewer', initials: 'ES', joined: '1 Mar 2026',  tasks: 0,  gradient: 'from-emerald-500 to-teal-500' },
];

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.member;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>
      {role === 'owner' && <Shield className="w-3 h-3" />}
      {role === 'admin' && <Edit3 className="w-3 h-3" />}
      {role === 'viewer' && <Eye className="w-3 h-3" />}
      {cfg.label}
    </span>
  );
};

export const Team = () => (
  <div className="max-w-3xl">
    {/* ── Header ── */}
    <div className="mb-6 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
      <div>
        <h1 className="text-slate-900 dark:text-zinc-100 text-2xl font-bold">Team</h1>
        <p className="text-slate-400 dark:text-zinc-500 text-sm mt-1">
          {MOCK_MEMBERS.length} member{MOCK_MEMBERS.length !== 1 ? 's' : ''} in this project
        </p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-violet-900/20 w-fit">
        <UserPlus className="w-4 h-4" />
        Invite Member
      </button>
    </div>

    {/* ── Members List ── */}
    <div className="space-y-2">
      {MOCK_MEMBERS.map((member) => (
        <div
          key={member.id}
          className="flex items-center gap-4 px-4 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all group"
        >
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
            {member.initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{member.name}</p>
              <RoleBadge role={member.role} />
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-slate-300 dark:text-zinc-600" />
              <p className="text-xs text-slate-400 dark:text-zinc-500">{member.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
            <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{member.tasks}</p>
            <p className="text-xs text-slate-400 dark:text-zinc-500">tasks</p>
          </div>

          {/* More */}
          <button className="p-1.5 rounded-lg text-slate-300 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>

    {/* ── Pending Invites ── */}
    <div className="mt-8">
      <h2 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Pending Invites</h2>
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border-2 border-dashed border-slate-200 dark:border-zinc-700/50">
        <Mail className="w-8 h-8 text-slate-300 dark:text-zinc-600 mb-2" />
        <p className="text-slate-500 dark:text-zinc-400 text-sm">No pending invites</p>
        <p className="text-slate-400 dark:text-zinc-600 text-xs mt-1">Invited members will appear here until they accept</p>
      </div>
    </div>
  </div>
);
