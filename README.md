# TITIS

TITIS adalah aplikasi web open-source untuk membantu satu bisnis lokal mengelola company profile, konten, booking, POS sederhana, pembayaran manual, dan laporan operasional dasar dalam satu sistem.

> **Status proyek: Phase 0 — perencanaan dan peninjauan kontrak.**
>
> Scope produk dan arsitektur sedang disejajarkan dan masih memerlukan persetujuan pemilik proyek sesuai status di `TASK.md`. Repository, instruksi instalasi, perintah pengujian, dan deployment belum dianggap terverifikasi hanya karena didokumentasikan. Lihat [`TASK.md`](TASK.md) untuk status, dependensi, bukti, dan blocker terbaru.

---

## Apa itu TITIS?

TITIS dirancang untuk satu instalasi yang mewakili satu bisnis lokal. Produk ini menggabungkan dua area dengan pengalaman yang berbeda tetapi konsisten:

- **Public website** — pengunjung melihat informasi bisnis, produk/layanan, fasilitas bila relevan, jam buka, dan kontak; pengunjung juga dapat mengirim permintaan booking.
- **Owner dashboard** — satu akun Owner mengelola profil dan konten, katalog, resource serta jam operasional, keputusan booking, transaksi POS, dan laporan dasar.

Kafe dengan ruang privat adalah model bisnis acuan, tetapi struktur aplikasi juga dapat digunakan untuk bisnis lokal lain yang membutuhkan katalog dan pemesanan resource. Penyesuaian desain untuk kebutuhan bisnis dilakukan developer melalui kode, bukan melalui page builder visual di dashboard.

## Cakupan MVP yang direncanakan

Daftar berikut merupakan **rencana**, bukan klaim bahwa fitur telah tersedia. Persyaratan dan acceptance criteria yang mengikat berada di [`PRD.md`](PRD.md).

- Company profile responsif dengan satu template dasar dan struktur komponen/design tokens yang dapat disesuaikan developer melalui kode.
- CMS sederhana untuk profil bisnis, teks/konten yang ditetapkan, dan gambar penting.
- Satu katalog produk/layanan yang menjadi sumber data untuk public website dan POS.
- Booking publik tanpa akun, dengan status awal `pending`, dashboard Owner, dan pencegahan bentrok booking terkonfirmasi di database.
- POS dengan checkout **lunas** dan pencatatan pembayaran manual: tunai, transfer, atau QRIS.
- Riwayat transaksi dengan snapshot nama dan harga item.
- Laporan operasional dasar dari transaksi tersimpan dan ringkasan booking.
- Satu akun Owner, kontrol akses di database, validasi tepercaya, migration, dan pengujian alur kritis.

## Di luar scope MVP

Hal-hal berikut tidak termasuk MVP kecuali pemilik proyek menyetujui perubahan scope secara eksplisit:

- Akun Staff dan permission matrix.
- DP, pelunasan bertahap, payment gateway, refund, void, atau pengeditan transaksi yang sudah selesai.
- Diskon, kupon, pajak tambahan, dan pembulatan khusus.
- Inventaris/stok, resep/BOM, supplier, dan purchase order.
- POS offline, notifikasi booking otomatis, dan pembatalan/reschedule mandiri oleh pengunjung.
- Page builder drag-and-drop atau editor HTML/CSS bebas di dashboard.
- Multi-tenant SaaS, billing langganan, multi-bahasa, sistem akuntansi lengkap, analitik lanjutan, dan SEO SSR/prerender tingkat lanjut.

## Stack teknis

Baseline dan keputusan teknis terbaru dicatat di [`ARCHITECTURE.md`](ARCHITECTURE.md). Keputusan yang berstatus `Proposed` belum boleh dianggap disetujui untuk implementasi.

| Area | Baseline saat perencanaan |
|---|---|
| Frontend | Vite, React, TypeScript |
| Styling | Tailwind CSS v4 dan design tokens |
| Routing | React Router v7 |
| Server state | TanStack Query |
| Form validation | HTML native dan Valibot; validasi tepercaya tetap wajib |
| Backend | Supabase PostgreSQL dan Auth; Storage sesuai kebutuhan |
| Database changes | Supabase CLI migrations yang disimpan di Git |
| Database types | Tipe TypeScript yang dihasilkan dari schema |
| Testing | Vitest, React Testing Library, dan tes database sesuai tooling yang tersedia |
| Runtime/package manager | Node.js 24 LTS sebagai baseline dan npm; versi final dikunci saat scaffold |
| Hosting | Cloudflare Workers Static Assets untuk frontend dan Supabase untuk backend, mengikuti keputusan arsitektur; deployment aktual belum diverifikasi |

Versi dependency harus diperiksa terhadap dokumentasi resmi yang berlaku saat scaffold dan dikunci di `package-lock.json`. Jangan menganggap tabel ini sebagai bukti bahwa stack telah terpasang atau aplikasi telah berjalan.

## Dokumentasi proyek

Semua dokumen berikut direncanakan berada di root repository.

| File | Sumber kebenaran untuk |
|---|---|
| [`TITIS_MASTER_BUILD_GUIDE_FINAL.md`](TITIS_MASTER_BUILD_GUIDE_FINAL.md) | Roadmap, urutan fase, workflow, dan release gate |
| [`PRD.md`](PRD.md) | Tujuan produk, batas scope MVP, requirement, dan acceptance criteria |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Struktur aplikasi, data flow, library, dan keputusan teknis |
| [`DESIGN.md`](DESIGN.md) | Arah visual, design tokens, layout, responsive behavior, dan aksesibilitas |
| [`DATABASE.md`](DATABASE.md) | Entitas konseptual, relasi, status, dan invariants data |
| [`SECURITY.md`](SECURITY.md) | Threat model, kontrol akses, RLS, grants, dan secrets |
| [`TESTING.md`](TESTING.md) | Strategi pengujian dan verifikasi |
| [`AGENTS.md`](AGENTS.md) | Batas kewenangan dan aturan kerja AI coding agent |
| [`TASK.md`](TASK.md) | Status task, dependensi, acceptance criteria, bukti, dan blocker |
| [`LICENSE`](LICENSE) | Teks lisensi MIT |

Jika dokumentasi menjelaskan schema yang berbeda dari database aktif, hentikan pekerjaan terkait dan selesaikan konflik. Schema yang benar-benar dieksekusi ditentukan oleh file `supabase/migrations/*.sql`, bukan oleh `DATABASE.md`.

## Status implementasi

Proyek masih berada pada tahap perencanaan. Jangan menyimpulkan bahwa aplikasi, database, tes, atau deployment telah siap hanya berdasarkan adanya dokumen rancangan.

Roadmap tingkat tinggi:

1. **Phase 0 — Scope dan persiapan:** menyelesaikan review dokumen, keputusan Owner, konsistensi lintas dokumen, dan gate sebelum coding fitur.
2. **Phase 1 — Foundation, Owner Auth, company profile, dan CMS:** scaffold, environment development, migration fondasi, login Owner, RLS, dan konten dasar.
3. **Phase 2 — Template, katalog, dan resource:** halaman publik, media minimum, katalog bersama, resource/jam operasional, dan responsive checks.
4. **Phase 3 — Booking dan anti-bentrok:** jalur booking publik, dashboard Owner, aturan waktu, perlindungan spam sederhana, serta pengujian concurrency.
5. **Phase 4 — POS, laporan, hardening, dan release:** checkout atomik dan idempotent, transaksi lunas, laporan yang direkonsiliasi, pemeriksaan keamanan, dokumentasi, serta persetujuan rilis.

Task rinci dan urutannya berada di [`TASK.md`](TASK.md). Fase implementasi berikutnya tetap diblokir sesuai gate sampai dependensi dan persetujuan terkait dipenuhi.

## Prasyarat pengembangan

Prasyarat final akan ditetapkan dan diuji pada task scaffold/setup. Baseline yang direncanakan:

- Git.
- Node.js 24 LTS sebagai baseline, dengan versi final ditetapkan di `.nvmrc` dan `package.json` saat scaffold.
- npm dan `package-lock.json`.
- Akun/proyek Supabase sesuai environment yang disetujui.
- Supabase CLI.
- Docker bila diperlukan oleh workflow Supabase lokal yang akhirnya dipilih.

Daftar ini belum merupakan instruksi instalasi yang sudah diverifikasi.

## Menjalankan proyek

**Belum tersedia — belum diverifikasi dari clone bersih.** Instruksi hanya akan dipublikasikan setelah repository dapat dijalankan dan setiap langkah dicoba sesuai task setup.

| Aktivitas | Status |
|---|---|
| Instalasi dependency | Belum diverifikasi |
| Konfigurasi environment dari `.env.example` | Belum diverifikasi |
| Menjalankan Supabase lokal | Belum diverifikasi |
| Menerapkan migration dan seed sintetis | Belum tersedia / belum diverifikasi |
| Menjalankan aplikasi secara lokal | Belum tersedia / belum diverifikasi |
| Menjalankan type-check, lint, dan test | Belum tersedia / belum diverifikasi |
| Build | Belum tersedia / belum diverifikasi |
| Deployment dan smoke test | Belum tersedia / belum diverifikasi |

Jangan menjalankan command yang diasumsikan ada. Setelah scaffold, gunakan hanya script yang benar-benar didefinisikan di `package.json` dan catat hasil aktual di `TASK.md`.

## Bekerja di repository ini

Sebelum memulai pekerjaan:

1. Baca [`TITIS_MASTER_BUILD_GUIDE_FINAL.md`](TITIS_MASTER_BUILD_GUIDE_FINAL.md) dan [`AGENTS.md`](AGENTS.md).
2. Periksa [`TASK.md`](TASK.md), pilih satu task yang `Ready` atau tugas review yang memang ditugaskan, lalu baca dependensinya.
3. Baca dokumen domain yang relevan sebelum mengubah file.
4. Periksa status Git dan pahami perubahan yang belum di-commit.
5. Untuk perubahan lintas file, database, security, atau arsitektur, buat rencana dan selesaikan blocker keputusan sebelum implementasi.
6. Batasi perubahan pada scope task, tinjau diff, jalankan verifikasi yang tersedia, lalu catat bukti aktual.

Perubahan scope produk, stack, dependency, skema, akses, atau deployment memerlukan persetujuan eksplisit pemilik proyek sesuai `AGENTS.md`.

## Keamanan

- Jangan menyimpan secret, kredensial, atau data pelanggan asli di Git, frontend, log, prompt, fixture, atau screenshot.
- Semua variabel `VITE_*` dianggap publik karena dapat masuk ke bundle browser.
- Supabase `service_role`, secret key, password database, dan secret server lain tidak boleh digunakan di frontend.
- Setiap tabel client-facing harus menggunakan RLS yang sesuai; grants, view, RPC/function, Edge Function, dan Storage policy juga perlu diperiksa.
- Migration harus diuji pada environment lokal/non-production terlebih dahulu. Perubahan remote dan deployment membutuhkan izin sesuai aturan proyek.
- Pelaporan kerentanan publik dan panduan kontribusi belum tersedia; keduanya disiapkan menjelang rilis.

Lihat [`AGENTS.md`](AGENTS.md) dan [`SECURITY.md`](SECURITY.md) untuk aturan lengkap.

## Kontribusi

Proyek belum membuka proses kontribusi publik. Instruksi kontribusi akan ditambahkan setelah workflow pengembangan dan rilis siap diverifikasi. Perubahan selama tahap persiapan harus mengikuti aturan di `AGENTS.md` dan task yang tercatat.

## Batasan yang diketahui

- Proyek masih tahap perencanaan dan belum mempunyai rilis MVP yang terverifikasi.
- Vite SPA dengan konten dinamis memiliki keterbatasan SEO dibandingkan SSR/prerender; SEO lanjutan tidak dijanjikan dalam MVP.
- Desain custom untuk tiap bisnis memerlukan pekerjaan developer melalui kode.
- Tidak ada Staff, stok, pembayaran bertahap, refund/void, atau payment gateway pada scope MVP saat ini.
- Setup, test, migration, backup/recovery, dan deployment harus diverifikasi saat implementasi; jangan menganggapnya telah tersedia.

## Lisensi

TITIS menggunakan lisensi **MIT**. Lihat [`LICENSE`](LICENSE).

Hak cipta: Copyright (c) 2026 Aria Aji Perkasa Wibowo.
