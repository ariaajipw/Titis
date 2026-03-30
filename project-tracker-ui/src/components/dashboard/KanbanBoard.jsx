// src/components/dashboard/KanbanBoard.jsx
import { KANBAN_COLUMNS } from '../../constants/kanban';
import { filterTasksByStatus } from '../../utils/taskHelpers';
import { KanbanColumn } from './KanbanColumn';

export const KanbanBoard = ({ tasks, loading }) => (
  /*
   * Desktop: 3 kolom sejajar (grid-cols-3)
   * Mobile:  scroll horizontal (flex + snap) agar UX tetap nyaman
   */
  <>
    {/* ── DESKTOP (lg ke atas) ── */}
    <div className="hidden lg:grid lg:grid-cols-3 gap-6">
      {KANBAN_COLUMNS.map((col) => (
        <KanbanColumn
          key={col.key}
          column={col}
          tasks={filterTasksByStatus(tasks, col.key)}
          loading={loading}
        />
      ))}
    </div>

    {/* ── MOBILE (< lg) — Horizontal Scroll dengan Snap ── */}
    <div className="lg:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4">
      {KANBAN_COLUMNS.map((col) => (
        <div
          key={col.key}
          className="flex-none w-[85vw] snap-start"
        >
          <KanbanColumn
            column={col}
            tasks={filterTasksByStatus(tasks, col.key)}
            loading={loading}
          />
        </div>
      ))}
    </div>
  </>
);
