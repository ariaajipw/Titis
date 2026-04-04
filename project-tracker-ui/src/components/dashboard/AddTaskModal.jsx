// src/components/AddTaskModal.jsx
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
} from "lucide-react";

// ─── Konstanta ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "Design",      label: "🎨 Design" },
  { value: "Development", label: "💻 Development" },
  { value: "Research",    label: "🔬 Research" },
];

const STATUS_DEFAULT = "pending"; // nilai default untuk kolom `status`

const INITIAL_FORM = {
  title:       "",
  description: "",
  category:    "",
  status:      STATUS_DEFAULT,
  due_date:    "",
};

// ─── Helper: validasi sederhana ───────────────────────────────────────────────
function validateForm(form) {
  if (!form.title.trim())    return "Judul task tidak boleh kosong.";
  if (!form.category)        return "Pilih kategori task terlebih dahulu.";
  return null; // valid
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────
/**
 * @param {boolean}  isOpen    - Kontrol visibilitas modal
 * @param {Function} onClose   - Callback untuk menutup modal
 * @param {Function} addTask   - Fungsi dari useTasks hook
 */
export default function AddTaskModal({ isOpen, onClose, addTask }) {
  const [form, setForm]         = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Guard: jangan render jika tidak open ──────────────────
  if (!isOpen) return null;

  // ─── Handlers ──────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setForm(INITIAL_FORM); // reset form saat tutup
    onClose();
  };

  const handleOverlayClick = (e) => {
    // Tutup modal hanya jika klik di area overlay (bukan konten modal)
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sisi klien
    const validationError = validateForm(form);
    if (validationError) {
      toast.error(validationError, { duration: 3000 });
      return;
    }

    setIsSubmitting(true);

    // Siapkan payload — hapus due_date jika kosong
    const payload = {
      title:       form.title.trim(),
      description: form.description.trim(),
      category:    form.category,
      status:      form.status,
      ...(form.due_date && { due_date: form.due_date }),
    };

    const { success, error } = await addTask(payload);

    setIsSubmitting(false);

    if (success) {
      toast.success("Task berhasil ditambahkan! 🎉", {
        description: `"${payload.title}" telah masuk ke daftar tugasmu.`,
        duration: 4000,
      });
      handleClose();
    } else {
      toast.error("Gagal menambahkan task.", {
        description: error ?? "Terjadi kesalahan, coba lagi.",
        duration: 5000,
      });
    }
  };

  // ─── UI ────────────────────────────────────────────────────
  return (
    /* Overlay */
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Panel Modal */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl shadow-black/40 animate-in fade-in zoom-in-95 duration-200">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-700/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30">
              <ClipboardList className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h2
                id="modal-title"
                className="text-base font-semibold text-zinc-100"
              >
                Tambah Task Baru
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Isi detail task yang ingin ditambahkan
              </p>
            </div>
          </div>

          {/* Tombol Tutup */}
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/70 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Form Body ── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-5">

            {/* Field: Title */}
            <div className="space-y-1.5">
              <label
                htmlFor="title"
                className="flex items-center gap-2 text-sm font-medium text-zinc-300"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                Judul Task
                <span className="text-rose-400 text-xs">*</span>
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Contoh: Buat desain wireframe halaman login"
                disabled={isSubmitting}
                autoFocus
                className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500
                           focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/70
                           hover:border-zinc-600 transition-all duration-150
                           disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Field: Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="flex items-center gap-2 text-sm font-medium text-zinc-300"
              >
                <AlignLeft className="w-3.5 h-3.5 text-zinc-400" />
                Deskripsi
                <span className="text-xs text-zinc-500 font-normal">(opsional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Jelaskan detail task ini..."
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500
                           focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/70
                           hover:border-zinc-600 transition-all duration-150 resize-none
                           disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Baris: Category + Due Date */}
            <div className="grid grid-cols-2 gap-4">

              {/* Field: Category */}
              <div className="space-y-1.5">
                <label
                  htmlFor="category"
                  className="flex items-center gap-2 text-sm font-medium text-zinc-300"
                >
                  <Tag className="w-3.5 h-3.5 text-zinc-400" />
                  Kategori
                  <span className="text-rose-400 text-xs">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/70
                             hover:border-zinc-600 transition-all duration-150 cursor-pointer
                             disabled:opacity-60 disabled:cursor-not-allowed
                             text-zinc-100 appearance-none"
                >
                  <option value="" className="text-zinc-500 bg-zinc-900">
                    Pilih kategori...
                  </option>
                  {CATEGORIES.map(({ value, label }) => (
                    <option
                      key={value}
                      value={value}
                      className="bg-zinc-900 text-zinc-100"
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field: Due Date */}
              <div className="space-y-1.5">
                <label
                  htmlFor="due_date"
                  className="flex items-center gap-2 text-sm font-medium text-zinc-300"
                >
                  <span className="text-zinc-400 text-xs">📅</span>
                  Due Date
                  <span className="text-xs text-zinc-500 font-normal">(opsional)</span>
                </label>
                <input
                  id="due_date"
                  type="date"
                  name="due_date"
                  value={form.due_date}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min={new Date().toISOString().split("T")[0]} // tidak bisa pilih tanggal lampau
                  className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-zinc-100
                             focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/70
                             hover:border-zinc-600 transition-all duration-150
                             disabled:opacity-60 disabled:cursor-not-allowed
                             [color-scheme:dark]" // agar date picker native ikut dark mode
                />
              </div>
            </div>

          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-zinc-950/60 border-t border-zinc-700/60 rounded-b-2xl">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 bg-transparent hover:bg-zinc-700/50
                         border border-zinc-700 rounded-xl transition-all duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white
                         bg-violet-600 hover:bg-violet-500 active:bg-violet-700
                         rounded-xl transition-all duration-150 shadow-lg shadow-violet-900/30
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Tambah Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
