# TITIS

Aplikasi web open-source untuk membantu satu bisnis lokal mengelola halaman publik, konten, booking, POS sederhana, pencatatan pembayaran manual, dan laporan operasional dalam satu sistem.

> **Status: tahap perencanaan (Phase 0).**
> Dokumen produk dan arsitektur sedang disusun dan ditinjau. Instruksi instalasi belum tersedia dan baru akan ditambahkan setelah diverifikasi dari repository yang benar-benar berjalan. Status terkini ada di [`TASK.md`](TASK.md).

---

## Apa itu TITIS

TITIS memiliki dua area yang dirancang sebagai pengalaman berbeda tetapi konsisten:

- **Public website** — pengunjung melihat informasi bisnis, layanan/produk, dan kontak, lalu mengirim permintaan booking.
- **Admin dashboard** — Owner dan Staff mengelola konten, booking, produk/layanan, transaksi, pembayaran, dan laporan sesuai izin masing-masing.

Untuk MVP, satu instalasi melayani **satu bisnis**. Alur awal dirancang dengan **kafe yang memiliki ruang privat** sebagai model referensi, bukan sebagai sistem universal untuk semua jenis usaha.

## Target fitur MVP

Daftar ini adalah **rencana**, bukan fitur yang sudah tersedia. Daftar final dan acceptance criteria ada di [`PRD.md`](PRD.md).

- Company profile dinamis dan CMS sederhana
- Formulir booking publik dan pengelolaan booking di dashboard, dengan pencegahan bentrok jadwal
- POS sederhana dengan katalog produk/layanan dan checkout
- Pencatatan pembayaran manual (termasuk DP dan pelunasan bila disepakati)
- Riwayat transaksi dan laporan penjualan/penerimaan
- Login dan otorisasi untuk role Owner dan Staff

## Di luar scope MVP

Inventaris berbasis resep, supplier dan purchase order, payment gateway/pembayaran otomatis, POS offline, multi-tenant SaaS, dan billing langganan.

## Stack (baseline)

Keputusan final dikunci di [`ARCHITECTURE.md`](ARCHITECTURE.md). Sampai saat itu, daftar ini bersifat arah, bukan komitmen.

| Area | Baseline |
|---|---|
| Frontend | Vite, React, TypeScript, Tailwind CSS v4 |
| Server state | TanStack Query (diusulkan) |
| Backend | Supabase: Auth, PostgreSQL, Row Level Security, SQL migrations, Storage; Edge Functions bila diperlukan |
| Hosting | Cloudflare (direncanakan) |
| Tooling | Git, GitHub, Supabase CLI |

## Dokumentasi

| File | Isi |
|---|---|
| [`MASTER_BUILD_GUIDE.md`](MASTER_BUILD_GUIDE.md) | Roadmap, fase, aturan kerja, dan gate |
| [`PRD.md`](PRD.md) | Tujuan produk, scope, requirements, acceptance criteria |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Struktur aplikasi, aliran data, keputusan teknis |
| [`DESIGN.md`](DESIGN.md) | Design tokens, komponen, layout, aksesibilitas |
| [`docs/DATABASE.md`](docs/DATABASE.md) | Penjelasan skema, relasi, dan invariants |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Matriks izin, RLS, dan model ancaman |
| [`docs/TESTING.md`](docs/TESTING.md) | Strategi dan verifikasi pengujian |
| [`AGENTS.md`](AGENTS.md) | Aturan kerja AI coding agent |
| [`TASK.md`](TASK.md) | Task aktif, status, dan bukti progres |

Skema database yang berlaku didefinisikan oleh file migration di `supabase/migrations/` (setelah dibuat), bukan oleh dokumen penjelasan.

## Prasyarat

Akan dikonfirmasi saat scaffold dan setup diverifikasi ([TITIS-101](TASK.md), [TITIS-103](TASK.md), [TITIS-112](TASK.md)). Perkiraan awal:

- Node.js (versi ditetapkan di file runtime repository setelah tersedia)
- Git
- Akun Supabase dan Supabase CLI
- Docker, kemungkinan diperlukan untuk Supabase lokal (dikonfirmasi saat setup)

## Menjalankan proyek

Belum tersedia. Bagian berikut akan diisi **hanya setelah** setiap langkahnya dicoba dari clone bersih:

- Instalasi dependency: _belum tersedia_
- Konfigurasi environment (`.env.example`): _belum tersedia_
- Migrasi database dan seed: _belum tersedia_
- Menjalankan aplikasi secara lokal: _belum tersedia_
- Menjalankan test: _belum tersedia_
- Deployment: _belum tersedia_

## Bekerja di repository ini

Untuk developer maupun AI agent:

1. Baca `MASTER_BUILD_GUIDE.md` dan `AGENTS.md`.
2. Buka `TASK.md`, pilih **satu** task yang siap dikerjakan, dan baca dependensinya.
3. Kerjakan hanya scope task tersebut, verifikasi hasilnya, lalu catat bukti di `TASK.md`.

Perubahan scope, stack, dependency, skema database, model akses, atau deployment memerlukan persetujuan pemilik proyek dan harus dicatat.

## Keamanan

- Jangan memasukkan secret ke Git, frontend, log, atau screenshot.
- Semua variabel `VITE_*` masuk ke bundle browser dan harus dianggap publik.
- Kunci `service_role` Supabase dan secret server tidak boleh berada di frontend.
- Proses pelaporan kerentanan publik belum tersedia dan akan ditambahkan menjelang rilis.

## Kontribusi

Proyek belum menerima kontribusi publik. Panduan kontribusi akan ditambahkan menjelang rilis.

## Batasan yang diketahui

Proyek masih tahap perencanaan; belum ada rilis. Daftar batasan akan diperbarui seiring pengembangan.

## Lisensi

Direncanakan **MIT**. File `LICENSE` akan ditambahkan setelah pemilik proyek menyetujui lisensi, nama pemegang hak cipta, dan tahun ([TITIS-011](TASK.md)).
