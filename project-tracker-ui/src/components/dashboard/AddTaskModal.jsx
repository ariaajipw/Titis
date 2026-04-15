// src/components/dashboard/AddTaskModal.jsx
import { useState } from "react";
import { toast } from "sonner";
import {
  X,
  Plus,
  FileText,
  Tag,
  AlignLeft,
  Loader2,
  ClipboardList,
  Calendar,
} from "lucide-react";

const CATEGORIES = [
  { value: "Design",      label: "Design" },
  { value: "Development", label: "Development" },
  { value: "Research",    label: "Research" },
];

const PRIORITIES = [
  { value: "Tinggi", label: "High",   dot: "bg-red-500" },
  { value: "Sedang", label: "Medium", dot: "bg-amber-500" },
  { value: "Rendah", label: "Low",    dot: "bg-emerald-500" },
];

const INITIAL_FORM = {
  title:       "",
  description: "",
  category:    "",
  priority:    "Sedang",
  status:      "todo",
  due_date:    "",
};

function validateForm(form) {
  if (!form.title.trim()) return "Task title cannot be empty.";
  if (!form.category)     return "Please select a category.";
  return null;
}

export default function AddTaskModal({ isOpen, onClose, addTask }) {
  const [form, setForm]               = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateForm(form);
    if (err) { toast.error(err, { duration: 3000 }); return; }

    setIsSubmitting(true);
    const payload = {
      title:       form.title.trim(),
      description: form.description.trim(),
      category:    form.category,
      priority:    form.priority,
      status:      form.status,
      ...(form.due_date && { due_date: form.due_date }),
    };

    const { success, error } = await addTask(payload);
    setIsSubmitting(false);

    if (success) {
      toast.success("Task added!", { description: `"${payload.title}" has been created.`, duration: 4000 });
      handleClose();
    } else {
      toast.error("Failed to add task.", { description: error ?? "Something went wrong, please try again.", duration: 5000 });
    }
  };

  const inputCls = `
    w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150
    bg-slate-50 dark:bg-zinc-800
    border border-slate-200 dark:border-zinc-700
    text-slate-800 dark:text-zinc-100
    placeholder-slate-400 dark:placeholder-zinc-500
    focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/70
    hover:border-slate-300 dark:hover:border-zinc-600
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/60 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 animate-in fade-in zoom-in-95 duration-200">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-zinc-700/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-600/20 border border-violet-200 dark:border-violet-500/30">
              <ClipboardList className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-semibold text-slate-800 dark:text-zinc-100">
                Add New Task
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                Fill in the details below
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-zinc-700/70 transition-all duration-150 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-5">

            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
                <FileText className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                Task Title <span className="text-rose-500 text-xs">*</span>
              </label>
              <input
                id="title" type="text" name="title"
                value={form.title} onChange={handleChange}
                placeholder="e.g. Design the login wireframe"
                disabled={isSubmitting} autoFocus
                className={inputCls}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
                <AlignLeft className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                Description <span className="text-xs text-slate-400 dark:text-zinc-500 font-normal">(optional)</span>
              </label>
              <textarea
                id="description" name="description"
                value={form.description} onChange={handleChange}
                rows={3} placeholder="Add more details about this task..."
                disabled={isSubmitting}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
                Priority
              </label>
              <div className="flex gap-2">
                {PRIORITIES.map(({ value, label, dot }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, priority: value }))}
                    disabled={isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                      form.priority === value
                        ? 'border-violet-400 bg-violet-50 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300'
                        : 'border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-600 bg-slate-50 dark:bg-zinc-800/50'
                    } disabled:opacity-60`}
                  >
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category + Due Date */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label htmlFor="category" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
                  <Tag className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                  Category <span className="text-rose-500 text-xs">*</span>
                </label>
                <select
                  id="category" name="category"
                  value={form.category} onChange={handleChange}
                  disabled={isSubmitting}
                  className={`${inputCls} cursor-pointer appearance-none`}
                >
                  <option value="">Select...</option>
                  {CATEGORIES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <label htmlFor="due_date" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                  Due Date <span className="text-xs text-slate-400 dark:text-zinc-500 font-normal">(opt.)</span>
                </label>
                <input
                  id="due_date" type="date" name="due_date"
                  value={form.due_date} onChange={handleChange}
                  disabled={isSubmitting}
                  min={new Date().toISOString().split("T")[0]}
                  className={`${inputCls} [color-scheme:light] dark:[color-scheme:dark]`}
                />
              </div>
            </div>

          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-zinc-950/60 border-t border-slate-100 dark:border-zinc-700/60 rounded-b-2xl">
            <button
              type="button" onClick={handleClose} disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-700/50 border border-slate-200 dark:border-zinc-700 rounded-xl transition-all duration-150 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 active:bg-violet-700 rounded-xl transition-all duration-150 shadow-lg shadow-violet-900/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
              ) : (
                <><Plus className="w-4 h-4" />Add Task</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
