# TITIS — Master Build Guide

> **Fungsi:** peta utama untuk merencanakan, membangun, memverifikasi, dan merilis TITIS secara bertahap sebagai solo developer dengan bantuan AI coding agent.
>
> **Produk:** aplikasi open-source pengelolaan bisnis lokal: company profile dinamis, CMS, booking, POS sederhana, pembayaran manual, dan laporan operasional.
>
> **Model bisnis referensi MVP:** satu bisnis dalam satu instalasi, dengan role **Owner** dan **Staff**. Untuk merancang alur awal, gunakan **kafe dengan ruang privat** sebagai model referensi.
>
> **Stack awal yang diusulkan:** Vite + React 18 + TypeScript + Tailwind CSS v4 + Supabase. TanStack Query diusulkan untuk server state. Keputusan yang belum disetujui harus dikunci dalam `ARCHITECTURE.md` sebelum implementasi terkait dimulai.
>
> **Status dokumen:** living guide. Perbarui saat milestone, scope, atau alur kerja berubah—bukan setiap kali satu baris kode selesai.
> **Revisi dokumen:** 2026-10-10 · Baseline perencanaan; keputusan yang belum disetujui harus tetap ditandai terbuka.

---

## 0. Cara Menggunakan Guide Ini

### 0.1 Tujuan

Dokumen ini adalah **peta pengembangan tingkat proyek**. Buka file ini ketika memulai sesi baru untuk memahami fase aktif, aturan penting, serta kriteria untuk melanjutkan. Untuk pekerjaan harian, buka `TASK.md` dan kerjakan **satu task yang jelas pada satu waktu**.

Dokumen ini menghubungkan rencana produk, spesifikasi teknis, desain, aturan AI, pengujian, dan pelacakan progres. Dokumen ini **bukan** pengganti PRD, arsitektur, skema database, atau task tracker.

### 0.2 Pembagian tanggung jawab dokumen

- `TITIS_MASTER_BUILD_GUIDE_FINAL.md` — urutan fase, milestone, aturan kerja, gate, dan status proyek tingkat tinggi.
- `TASK.md` — daftar pekerjaan aktual, status per task, dependensi, bukti verifikasi, dan task berikutnya.
- Dokumen spesifikasi — definisi terperinci untuk tiap domain, sesuai bagian 3.

Jangan memelihara dua daftar checklist granular yang sama. Detail pekerjaan tinggal di `TASK.md`; guide ini hanya menyimpan milestone dan aturan lintas fase.

### 0.3 Prinsip yang tidak boleh dilanggar

1. **Tidak ada coding fitur sebelum kebutuhan dan acceptance criteria fitur tersebut cukup jelas.** Jika ada ambiguitas yang berpengaruh pada data, keamanan, alur pengguna, atau arsitektur, hentikan implementasi dan catat pertanyaannya.
2. **Satu sumber kebenaran untuk setiap jenis keputusan.** Jangan menyalin isi dokumen yang sama ke banyak tempat.
3. **Satu AI agent sebagai penulis aktif pada satu waktu.** Agent kedua boleh melakukan review tanpa mengedit, kecuali perubahan pertama sudah selesai dan working tree aman.
4. **Tidak ada perubahan scope, stack, dependency, skema database, model akses, atau deployment tanpa alasan yang tercatat dan persetujuan pemilik proyek.**
5. **Tidak ada perubahan langsung yang tidak tercatat pada database remote.** Semua perubahan skema harus berbentuk migration file dalam Git dan diuji pada lingkungan yang aman terlebih dahulu.
6. **Tidak ada secret dalam frontend, Git, log, prompt, screenshot, atau dokumentasi.** Jika secret terlanjur terungkap, rotasi secret; menghapus teks dari commit saja tidak cukup.
7. **Task belum selesai sampai ada bukti.** “Kode sudah ditulis” bukan bukti bahwa fitur berfungsi.
8. **Jangan lanjut ke fase berikutnya sebelum exit criteria fase aktif terpenuhi atau pengecualian disetujui secara eksplisit dan dicatat.**
9. **Deploy bukan pengganti pengujian.** Fitur yang berhasil tampil di production tetap harus memenuhi acceptance criteria dan pemeriksaan keamanan.
10. **Jangan menebak hasil command.** Jalankan command yang sesuai dengan `package.json`, konfigurasi repository, dan dokumentasi resmi versi tool yang dipakai.

### 0.4 Cara memulai sesi coding

1. Buka `TITIS_MASTER_BUILD_GUIDE_FINAL.md` untuk memahami milestone dan status tingkat tinggi.
2. Buka `AGENTS.md` dan dokumen spesifik yang relevan dengan task.
3. Buka `TASK.md`, pilih satu task berstatus `Ready`/siap dikerjakan (atau `Review` bila tugasnya meninjau dokumen), dan baca dependensinya.
4. Pastikan git working tree bersih atau perubahan sebelumnya sudah dipahami.
5. Minta agent menjelaskan rencana terlebih dahulu untuk task yang menyentuh beberapa file, database, keamanan, atau arsitektur.
6. Implementasikan perubahan dengan batasan task yang jelas.
7. Periksa diff, jalankan verifikasi, dan lakukan manual test bila diperlukan.
8. Catat hasil dan bukti di `TASK.md`; catat keputusan arsitektur jika ada.
9. Commit perubahan yang sudah diverifikasi. Push/deploy hanya sesuai workflow dan persetujuan yang ditentukan.

---

## 1. Identitas Produk dan Batas Scope

### 1.1 Definisi TITIS untuk MVP

TITIS adalah aplikasi open-source untuk membantu satu bisnis lokal mengelola halaman publik, konten, reservasi, transaksi POS sederhana, pencatatan pembayaran manual, dan laporan operasional melalui satu sistem.

Aplikasi memiliki dua area yang perlu dirancang sebagai pengalaman berbeda tetapi konsisten:

- **Public website:** pengunjung melihat informasi bisnis, layanan/produk, kontak, dan mengirim permintaan booking.
- **Admin dashboard:** Owner dan Staff mengelola konten, booking, produk/layanan yang dijual, transaksi, pembayaran, dan laporan sesuai izin masing-masing.

### 1.2 Fitur dalam target MVP

- Company profile dinamis dan CMS sederhana.
- Public website dengan halaman bisnis yang dibutuhkan.
- Formulir booking publik.
- Daftar dan pengelolaan booking di dashboard.
- Pencegahan konflik jadwal untuk fasilitas/resource yang sama.
- POS sederhana dengan katalog produk/layanan dan checkout.
- Pencatatan pembayaran manual, termasuk skenario DP dan pelunasan jika disepakati dalam PRD.
- Riwayat transaksi dan Sales Insight/laporan berdasarkan data transaksi sebenarnya.
- Autentikasi dan otorisasi Owner/Staff.
- Pengujian akses data, aturan bisnis kritis, responsivitas, dan proses rilis.

Daftar final, prioritas, dan acceptance criteria tiap fitur harus dikunci dalam `PRD.md`. Daftar di atas adalah baseline dari rencana proyek, bukan alasan untuk mengabaikan detail yang belum didefinisikan.

### 1.3 Di luar scope MVP

Jangan membangun fitur berikut kecuali scope diubah dengan sengaja dan dampaknya disetujui:

- Inventaris berbasis resep/BOM.
- Supplier dan purchase order.
- Payment gateway atau pembayaran otomatis.
- POS offline.
- Multi-tenant SaaS dan isolasi banyak bisnis dalam satu instalasi.
- Billing/langganan SaaS.
- Fitur tambahan yang tidak mendukung acceptance criteria MVP.

**Catatan:** katalog produk/layanan untuk POS bukan hal yang sama dengan sistem inventaris berbasis resep. Katalog sederhana boleh masuk scope; pengelolaan stok kompleks tidak otomatis ikut masuk.

### 1.4 Asumsi model bisnis

Untuk menghindari desain terlalu generik, gunakan kafe dengan ruang privat sebagai contoh awal:

- Satu instalasi mewakili satu bisnis.
- Fasilitas/resource tertentu dapat dipesan berdasarkan jadwal.
- Pengunjung hanya mengajukan booking.
- Booking baru dimulai dengan status yang ditetapkan sistem—umumnya `pending`—dan bukan dikonfirmasi oleh pengunjung.
- Owner/Staff yang berwenang memutuskan status booking.
- Booking terkonfirmasi harus mencegah bentrok dengan booking lain pada resource dan rentang waktu yang sama.
- Pembayaran dicatat manual untuk MVP.

Bila calon pengguna pilot menunjukkan model bisnis lain lebih tepat, revisi asumsi melalui PRD dan catat dampak pada data, desain, serta arsitektur. Jangan diam-diam membuat sistem “universal untuk semua bisnis”.

### 1.5 Keputusan produk yang wajib ditetapkan sebelum fitur terkait dibuat

PRD harus menentukan atau secara eksplisit menandai hal-hal berikut sebagai keputusan tertunda. AI agent tidak boleh memilihnya sendiri tanpa persetujuan.

| Topik | Hal yang harus diputuskan |
|---|---|
| Pengguna dan role | Kemampuan Owner dan Staff; apakah Staff boleh mengedit konten, mengonfirmasi booking, memberi diskon, mengelola pembayaran, atau melihat laporan keuangan. |
| Public website/CMS | Halaman MVP, field yang bisa diedit, gambar/media, publikasi/draft bila diperlukan, serta metadata tiap halaman. |
| Booking | Resource yang dipesan, durasi, jam operasional, buffer time, zona waktu, batas pemesanan, pembatalan/reschedule, expiry request, status, dan siapa yang boleh mengubah status. |
| Pencegahan bentrok | Apakah bentrok diperiksa per resource, bagaimana rentang waktu dihitung, dan aturan saat dua request masuk hampir bersamaan. |
| POS | Produk/layanan yang dijual, diskon, pajak, pembulatan, metode pembayaran, nomor transaksi, pembatalan/void/refund jika masuk scope, dan aturan struk. |
| Pembayaran | Apakah DP diperlukan, bagaimana pelunasan dicatat, metode pembayaran yang didukung, status pembayaran, dan bagaimana koreksi transaksi ditangani. |
| Laporan | Definisi setiap metrik, rentang waktu, zona waktu, pengakuan penjualan vs penerimaan uang, serta perlakuan DP, pelunasan, pembatalan, dan refund. |
| Data bisnis | Mata uang, format angka/tanggal, zona waktu bisnis, retensi data, dan kebutuhan ekspor/backup. |
| Hosting dan deployment | Provider frontend, domain, lingkungan development/staging/production, proses rollback, dan siapa yang menyetujui rilis. |
| SEO | Kebutuhan indeksasi public pages, metadata, sitemap, dan apakah SPA Vite memerlukan prerendering atau solusi lain. |
| Komunikasi dan data pribadi | Bagaimana pengunjung mengetahui keputusan booking; notifikasi ke Owner/Staff; pemberitahuan privasi dan retensi data kontak pengunjung. |
| Bahasa | Bahasa antarmuka dan konten situs (satu bahasa atau multi-bahasa). |

Jika satu keputusan memengaruhi schema, keamanan, laporan, atau arsitektur, putuskan sebelum implementasinya—bukan setelah data produksi terkumpul.

---

## 2. Stack dan Prinsip Teknis

### 2.1 Baseline awal

Stack awal yang diusulkan dalam rencana proyek:

| Area | Baseline | Status |
|---|---|---|
| Frontend | Vite + React 18 + TypeScript | Usulan baseline; kunci dalam `ARCHITECTURE.md` sebelum scaffold. |
| Styling | Tailwind CSS v4 | Usulan baseline; gunakan satu pola konfigurasi yang konsisten. |
| Data fetching/server state | TanStack Query | Diusulkan; tetapkan aturan cache, invalidation, loading, dan error di arsitektur. |
| Database | Supabase PostgreSQL | Baseline. Skema dikelola melalui SQL migrations. |
| Authentication | Supabase Auth | Baseline; flow dan role authorization harus dirinci. |
| Access control | PostgreSQL RLS + server-side checks/RPC/Edge Function bila diperlukan | Mekanisme final per alur harus didokumentasikan dan diuji. |
| Frontend routing | Belum dikunci | Pilih dan dokumentasikan sebelum implementasi routing. |
| Form validation | Belum dikunci | Pilih pendekatan dan schema sharing bila diperlukan. |
| Testing | Vitest + React Testing Library; Supabase CLI/pgTAP bila sesuai | Usulan awal; sesuaikan dengan arsitektur dan versi tool. |
| UI reference | Google Stitch + screenshot/mockup yang disetujui | Referensi desain, bukan sumber kebenaran arsitektur. |
| Source control | Git + GitHub | Gunakan branch/commit yang terukur dan review diff. |

Versi paket yang pasti tidak ditetapkan di guide ini. Sebelum scaffold, periksa kompatibilitas versi tool yang dipilih dan catat versi runtime/package manager yang dipakai. Gunakan lockfile di repository agar instalasi dapat direproduksi.

### 2.2 Hal yang tidak boleh diasumsikan

- Jangan mengambil kembali FastAPI, Railway, Zustand, Web3, atau teknologi dari Master Build Guide lama. Itu berasal dari desain produk sebelumnya dan bukan bagian otomatis dari TITIS saat ini.
- Jangan menganggap deployment harus menggunakan provider tertentu sebelum keputusan deployment dicatat.
- Jangan menambahkan library hanya karena generated code dari Stitch menggunakannya.
- Jangan membuat backend terpisah hanya karena terdengar lebih lengkap. Gunakan kemampuan Supabase yang sesuai; tambahkan RPC atau Edge Function bila ada kebutuhan yang jelas dan telah disetujui.
- Jangan mengunci versi paket dengan mengandalkan ingatan atau output model. Periksa dokumentasi dan kompatibilitas saat implementasi.

### 2.3 Prinsip arsitektur

1. **Batas frontend:** frontend boleh berisi UI dan logika presentasi. Ia tidak boleh menjadi tempat menyimpan secret atau menjadi satu-satunya penjaga aturan bisnis kritis.
2. **Validasi di sisi tepercaya:** status booking, harga, total checkout, hak akses, dan relasi pemilik data harus ditegakkan pada lapisan database/server yang tepat, bukan hanya disabled button di UI.
3. **RLS secara default:** setiap tabel yang dapat diakses dari client harus mempunyai policy yang diuji. Jangan menganggap `anon key` berarti data aman tanpa RLS.
4. **Operasi transaksi konsisten:** proses yang mengubah beberapa record sebagai satu tindakan bisnis—misalnya checkout dan pembayaran—harus atomik atau mempunyai rancangan pemulihan yang terdokumentasi.
5. **Satu definisi data:** tipe TypeScript yang dihasilkan dari skema database, bila digunakan, harus disinkronkan dengan migrations. Jangan membiarkan tipe buatan tangan menyimpang dari database.
6. **Kegagalan eksplisit:** loading, empty state, validation error, permission denied, network error, dan retry harus dipikirkan; jangan hanya membangun happy path.
7. **Aksesibilitas dan responsivitas sejak awal:** semantic HTML, keyboard/focus, label input, kontras, layout mobile, dan status error yang jelas masuk kriteria penerimaan UI.
8. **Observability secukupnya:** kegagalan bisnis penting perlu pesan yang dapat ditindaklanjuti tanpa mencatat token, secret, atau data sensitif.

---

## 3. Dokumen dan Sumber Kebenaran

### 3.1 Peta dokumen wajib

| File | Sumber kebenaran untuk | Jangan gunakan untuk |
|---|---|---|
| `TITIS_MASTER_BUILD_GUIDE_FINAL.md` | Roadmap, fase, milestone, gate, workflow, dan status tingkat tinggi | Spesifikasi detail setiap fitur atau skema SQL. |
| `PRD.md` | Tujuan produk, pengguna, scope, requirements, user stories, dan acceptance criteria | Menetapkan implementasi teknis yang belum diputuskan. |
| `ARCHITECTURE.md` | Struktur aplikasi, aliran data, modul, routing, integrasi, batas frontend/server, serta keputusan library | Menggantikan migration files sebagai definisi schema. |
| `DESIGN.md` | Design tokens, layout, komponen, responsive behavior, aksesibilitas, dan referensi visual yang disetujui | Menentukan hak akses database atau aturan transaksi. |
| `AGENTS.md` | Aturan kerja dan batas kewenangan AI coding agent | Menggandakan roadmap atau seluruh isi PRD. |
| `TASK.md` | Task aktif, status, dependensi, acceptance criteria per task, bukti tes, blocker, dan task selanjutnya | Mengulangi isi dokumen spesifikasi. |
| `README.md` | Deskripsi repository, setup, konfigurasi, command, dan deployment yang telah benar-benar dikonfirmasi | Menjadi sumber utama scope atau keputusan internal yang belum selesai. |
| `DATABASE.md` | Penjelasan skema, relasi, status, invariants, dan alasan desain database | Menjadi sumber kebenaran schema yang bisa berbeda dari SQL. |
| `SECURITY.md` | Threat model ringkas, permission matrix, RLS, secrets, alur public access, dan mitigasi | Menggantikan enforcement aktual serta tes keamanan. |
| `TESTING.md` | Strategi tes, test cases, lingkungan tes, dan release verification | Mengklaim tes lolos tanpa hasil aktual. |
| `supabase/migrations/*.sql` | Definisi skema, constraint, policy, function/RPC, dan perubahan database yang berlaku | Digantikan oleh edit manual di dashboard tanpa migration. |
| `supabase/tests/` | Tes aturan database/security yang diotomatisasi | Menggantikan tes UI/e2e yang relevan. |
| `docs/design/references/` | Screenshot/mockup desain yang disetujui | Menjadi spesifikasi perilaku atau arsitektur tanpa penjelasan di DESIGN.md. |

### 3.2 Cara menyelesaikan konflik antardokumen

Jika dua file bertentangan:

1. Hentikan implementasi yang terpengaruh.
2. Tentukan jenis keputusan yang konflik—produk, desain, arsitektur, database, security, atau task status.
3. Perbarui file sumber kebenaran yang benar terlebih dahulu.
4. Perbarui dokumen lain hanya jika memang perlu dirujuk silang.
5. Catat alasan dan dampak perubahan.
6. Lanjutkan setelah perubahan disepakati.

Jangan menyelesaikan konflik dengan memilih file yang paling baru dibaca atau dengan meminta AI menebak mana yang benar.

### 3.3 Dokumen pendukung tambahan

Tambahkan hanya bila dibutuhkan:

- `CLAUDE.md` — dibuat saat Claude Code akan digunakan; sebaiknya pendek dan merujuk aturan canonical dari `AGENTS.md`.
- `CONTRIBUTING.md` — menjelang kontribusi publik.
- `SECURITY.md` pada root — berisi dua bagian: (1) desain keamanan aplikasi TITIS (§1–12) dan (2) kebijakan pelaporan kerentanan publik (§13). Keduanya dalam satu file; file terpisah untuk pelaporan kerentanan tidak dibuat sebelum TITIS-077.
- `CHANGELOG.md` — saat mulai menerbitkan versi/rilis yang perlu dicatat.
- `docs/decisions/` — untuk Architectural Decision Records jika keputusan penting mulai sulit dilacak lewat git history.

Tidak perlu membuat semua dokumen tambahan sebelum ada kebutuhan nyata.

---

## 4. Struktur Repository yang Ditargetkan

Struktur ini adalah arah, bukan alasan untuk membuat seluruh file kosong pada hari pertama.

```text
titis/
├── TITIS_MASTER_BUILD_GUIDE_FINAL.md
├── PRD.md
├── ARCHITECTURE.md
├── DESIGN.md
├── AGENTS.md
├── TASK.md
├── README.md
├── LICENSE
├── .env.example
├── .gitignore
├── .editorconfig
├── .nvmrc                     # atau .node-version; pilih satu
├── package.json
├── package-lock.json          # sesuaikan package manager yang dipilih
├── public/
├── src/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── routes/                # nama/folder final ditentukan oleh arsitektur
│   ├── services/
│   ├── types/
│   └── ...
├── docs/
│   ├── DATABASE.md
│   ├── SECURITY.md
│   ├── TESTING.md
│   └── design/
│       └── references/
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   ├── seed.sql
│   ├── tests/
│   └── functions/              # hanya bila Edge Functions diperlukan
└── .github/
    └── workflows/
        └── ci.yml
```

Struktur `src/` di atas adalah gambaran awal. Setelah `ARCHITECTURE.md` disepakati, jangan memaksakan folder yang tidak membantu desain modul sebenarnya.

### 4.1 File konfigurasi dan secret

- `LICENSE`: gunakan MIT sesuai rencana open-source, setelah pemilik proyek menyetujui keputusan lisensi dan memastikan nama/tahun benar.
- `.env.example`: hanya nama variabel dan placeholder kosong. Tidak boleh berisi token asli.
- `.gitignore`: sekurang-kurangnya mengecualikan `.env`, `.env.*` yang berisi nilai lokal, `node_modules/`, build output, cache, log, dan file lokal tool; pastikan file contoh yang aman tetap bisa di-commit.
- `.editorconfig`: aturan format dasar agar editor konsisten.
- `.nvmrc` atau `.node-version`: pilih satu dan samakan dengan runtime yang teruji di lokal serta CI.
- `package-lock.json` atau lockfile package manager yang dipilih: commit lockfile.
- `supabase/config.toml`: dihasilkan/ditetapkan saat Supabase CLI disiapkan; jangan menyalin konfigurasi yang belum diperiksa.
- `.github/workflows/ci.yml`: dibuat setelah command tes dan build bisa dijalankan secara lokal.

Contoh variabel frontend minimum yang diusulkan:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Gunakan nama yang konsisten dengan client dan konfigurasi Supabase yang benar-benar dipilih. Nama di atas hanyalah baseline; tetapkan nama final dalam keputusan arsitektur yang tercatat setelah memeriksa dashboard project dan dokumentasi resmi. Menurut dokumentasi Supabase (dicek 2026-10-10), *publishable key* menggantikan `anon` key lama dan *secret key* menggantikan `service_role`; legacy keys dijadwalkan dihentikan pada akhir 2026. Lihat [panduan resmi migrasi API keys Supabase](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys). Semua nilai aktual bersifat environment-specific.

**Dilarang keras:** menaruh `service_role` key atau secret key Supabase (`sb_secret_…`), secret Edge Function, password database, atau credential payment provider dalam variable `VITE_*`, source code frontend, file yang di-commit, atau browser bundle. Semua variable `VITE_*` harus dianggap dapat dilihat publik.

---

## 5. Urutan Pembuatan Dokumen

Pembuatan dokumen dilakukan bertahap. Jangan meminta agent menghasilkan sepuluh dokumen penuh sekaligus sebelum keputusan produk diketahui.

### Langkah 0 — Buat pagar awal `AGENTS.md`

Buat versi minimal sebelum meminta agent melakukan pekerjaan repository. Isinya sekurang-kurangnya:

- Baca guide dan dokumen task yang relevan sebelum bertindak.
- Jangan memperluas scope atau mengganti stack/dependency tanpa persetujuan.
- Jangan melakukan operasi destruktif pada database remote.
- Jangan membuka, menyalin, atau mencetak secrets.
- Jangan push, deploy, atau menjalankan migrasi remote tanpa izin eksplisit.
- Periksa diff sebelum menyatakan pekerjaan selesai.
- Jalankan verifikasi yang relevan dan laporkan hasil aktual.
- Jika instruksi/dokumen bertentangan atau requirement tidak jelas, berhenti dan laporkan pertanyaan.

### Langkah 1 — Susun `PRD.md`

Pastikan PRD mencakup:

- Masalah dan tujuan produk.
- Persona/pengguna dan model bisnis referensi.
- Scope MVP dan out-of-scope.
- Daftar halaman public website dan dashboard.
- User stories serta acceptance criteria yang bisa diuji.
- Definisi role dan kebutuhan akses pada tingkat produk.
- Alur booking, POS, pembayaran, dan laporan.
- Definisi metrik bisnis yang ingin ditampilkan.
- Risiko, asumsi, dependency, serta pertanyaan yang belum terjawab.
- Prioritas dan kriteria keberhasilan MVP.

Requirement yang belum disepakati harus diberi label `OPEN`/tertunda. Jangan mengubah asumsi menjadi requirement final diam-diam.

### Langkah 2 — Susun `ARCHITECTURE.md`, `DATABASE.md`, dan `SECURITY.md`

Setelah PRD ditinjau, tentukan:

- Modul frontend, routing, dan batas komponen.
- Penggunaan Supabase client dan strategi pengambilan data.
- Sumber autentikasi dan bagaimana role diperiksa.
- Tabel utama, hubungan, status, constraints, dan invariants.
- Operasi yang harus atomik, termasuk checkout dan perubahan pembayaran.
- Pola aman untuk booking publik.
- RLS untuk setiap tabel yang dapat diakses client.
- Kapan SQL/RPC cukup dan kapan Edge Function diperlukan.
- Strategi secret, logging, backup, migrasi, dan generated database types.
- Keputusan SEO untuk konten publik Vite.

`DATABASE.md` menjelaskan schema yang direalisasikan; SQL migrations tetap sumber kebenaran yang dieksekusi.

### Langkah 3 — Susun `DESIGN.md` dengan Google Stitch

Rancang public website dan admin dashboard sebagai area terpisah yang berbagi design system. Simpan screenshot/mockup yang disetujui ke `docs/design/references/`.

`DESIGN.md` harus mencatat:

- Tujuan visual dan prinsip desain.
- Warna, tipografi, spacing, radius, border, elevation, dan tokens lain yang digunakan.
- Komponen dasar dan state (default, hover, focus, disabled, loading, error, empty).
- Pola layout desktop/tablet/mobile.
- Navigasi dan hierarki informasi.
- Form validation, feedback, konfirmasi destructive action, dan empty state.
- Standar keyboard/focus, label, semantic structure, dan kontras.
- Referensi per halaman yang disetujui serta keputusan yang belum selesai.

Jangan menyalin generated code Stitch secara membabi buta. Kode hasil generator harus mengikuti stack, aksesibilitas, data model, dan komponen proyek.

### Langkah 4 — Susun `TESTING.md`

Definisikan strategi pengujian sejak awal, terutama untuk authorization, booking conflicts, checkout, pembayaran, dan laporan. Kriteria rinci dapat berkembang per fase, tetapi pendekatan testing tidak boleh baru dipikirkan setelah sistem selesai.

### Langkah 5 — Buat `TASK.md` dan README awal

Pecah implementasi menjadi task kecil. Setiap task harus menyatakan:

- ID atau judul yang unik.
- Tujuan dan scope yang eksplisit.
- Dependensi.
- Acceptance criteria.
- File/area yang boleh diubah bila perlu.
- Tes yang wajib dilakukan.
- Bukti yang harus dicatat.
- Status dan blocker.

README boleh diawali dengan deskripsi, prasyarat, dan status dokumentasi. Tambahkan perintah setup/deployment hanya setelah diverifikasi dari repository yang sebenarnya.

---

## 6. Workflow AI Agent dan Developer

### 6.1 Pembagian peran alat

| Alat | Peran utama | Batas penggunaan |
|---|---|---|
| **OpenCode** | Coding agent utama untuk implementasi task | Satu task jelas per sesi; jangan minta membangun seluruh aplikasi sekaligus. |
| **Cursor IDE** | Membaca repository, navigasi kode, menjalankan aplikasi, memeriksa diff, dan debugging visual | Developer tetap bertanggung jawab memahami serta menyetujui perubahan. |
| **Codex CLI** | Reviewer independen atau alternatif agent untuk task terisolasi | Awali dengan mode review/read-only; jangan mengedit file bersamaan dengan agent utama. |
| **Google Stitch** | Eksplorasi UI dan referensi visual | Bukan sumber kebenaran arsitektur, akses data, atau keamanan. |
| **Claude Code** | Alternatif untuk task yang terbukti sulit atau ketika manfaatnya sepadan | Tidak wajib digunakan sejak awal; jika dipakai, ikuti `AGENTS.md`. |

Pembagian ini berdasarkan workflow yang direncanakan, bukan klaim bahwa satu agent selalu lebih baik daripada yang lain. Ketersediaan fitur, batas paket, dan integrasi tool dapat berubah; verifikasi sesuai akun dan versi yang dipakai.

### 6.2 Aturan penulisan dan review

- Jangan biarkan dua agent mengubah file yang sama secara bersamaan dalam satu working tree.
- Satu agent menulis; agent lain boleh meninjau tanpa mengubah file.
- Agent bekerja di branch fitur dan tidak commit langsung ke `main`; eksperimen besar atau perubahan berisiko tetap dipisah ke branch sendiri.
- Jangan menerima patch hanya karena agent mengatakan sudah selesai.
- Tinjau `git diff`, termasuk perubahan dependency, lockfile, generated files, policies, migrations, dan test.
- Pastikan agent tidak menyisipkan perubahan tak terkait.
- Jika agent gagal atau berputar-putar, hentikan percobaan dan persempit diagnosis—jangan memberikan mandat tanpa batas.

### 6.3 Siklus task standar

**A. Sebelum implementasi**

1. Baca task dan dokumen yang relevan.
2. Minta agent menyatakan pemahamannya tentang masalah, batas scope, file yang mungkin berubah, dan acceptance criteria.
3. Untuk task lintas modul/DB/security, minta rencana singkat sebelum kode dibuat.
4. Periksa apakah dependency/keputusan baru diperlukan. Jika iya, minta opsi dan konsekuensinya; jangan izinkan perubahan sepihak.

**B. Saat implementasi**

1. Kerjakan hanya scope task aktif.
2. Gunakan pola yang sudah ada jika sesuai.
3. Validasi input dan hak akses pada lapisan yang tepercaya.
4. Tambah atau perbarui test untuk behavior yang berubah.
5. Jangan menyembunyikan error atau menonaktifkan tes agar build hijau.

**C. Setelah implementasi**

1. Periksa diff dan file yang ikut berubah.
2. Jalankan type-check, lint, unit/integration tests, build, dan database tests sesuai task dan script yang benar-benar tersedia.
3. Jalankan manual/e2e test untuk alur pengguna yang kritis.
4. Laporkan command dan hasil sebenarnya; jangan mengatakan lulus jika belum dijalankan.
5. Perbarui `TASK.md` dengan status, bukti, dan blocker.
6. Perbarui dokumen sumber kebenaran apabila behavior/keputusan memang berubah.
7. Commit perubahan yang telah diverifikasi.

### 6.4 Aturan otorisasi perubahan

Wajib meminta persetujuan pemilik proyek sebelum:

- Mengubah scope atau acceptance criteria produk.
- Mengganti framework, library utama, atau menambah dependency penting.
- Mengubah role/permission model, kebijakan RLS, atau akses publik.
- Membuat migration yang menghapus, memindahkan, atau mengubah makna data.
- Menghapus data, mereset database remote, atau menyentuh production.
- Mengubah environment variable/secrets di environment mana pun selain lokal.
- Push ke remote, merge, deploy, atau melakukan tindakan yang berdampak pada pengguna nyata bila belum diizinkan dalam workflow.
- Menambah fitur di luar task aktif.
- Mengubah status `OPEN-xxx` menjadi `Decided`, `DEC-xxx` menjadi `Accepted`, atau task menjadi `Done`. Hanya pemilik proyek yang memutuskan; agent mencatat setelah persetujuan eksplisit.

Agent boleh mengusulkan perubahan dengan dampak, alternatif, biaya pemeliharaan, dan risiko. Agent tidak boleh memperlakukan usulan sebagai persetujuan.

### 6.5 Template prompt pembuka task

```text
Baca file berikut sebelum bertindak:
- TITIS_MASTER_BUILD_GUIDE_FINAL.md
- AGENTS.md
- TASK.md
- Dokumen yang secara spesifik relevan dengan task ini

Task aktif: [ID dan judul]

Sebelum mengubah file:
1. Ringkas masalah dan acceptance criteria dengan bahasamu sendiri.
2. Sebutkan asumsi atau ambiguitas yang dapat mengubah hasil.
3. Sebutkan file/area yang diperkirakan berubah.
4. Berikan rencana implementasi singkat dan strategi tes.
5. Jangan coding bila ada keputusan produk, schema, security, atau arsitektur yang belum disepakati.

Batasan:
- Jangan memperluas scope.
- Jangan menambah dependency atau mengganti stack tanpa persetujuan.
- Jangan melakukan operasi remote/destruktif, push, atau deploy tanpa izin eksplisit.
- Jangan membaca, menampilkan, atau memasukkan secret ke output.
- Jangan mengklaim tes lulus bila belum dijalankan.

Setelah disetujui, implementasikan task saja, jalankan verifikasi yang relevan,
periksa diff, lalu laporkan file yang berubah, hasil tes aktual, risiko tersisa,
dan status task. Jangan otomatis mengambil task berikutnya.
```

### 6.6 Template prompt review read-only

```text
Lakukan review READ-ONLY terhadap perubahan pada git diff untuk task [ID].
Jangan mengubah file.

Periksa:
- Kesesuaian dengan PRD, ARCHITECTURE, SECURITY, dan acceptance criteria.
- Bug logika, authorization/RLS, validasi input, race condition, dan data integrity.
- Kemungkinan transaksi parsial atau angka laporan yang keliru.
- Regression, accessibility, responsive UI, error/loading/empty states.
- Test yang hilang atau terlalu lemah.
- Dependency/perubahan tak terkait dan pelanggaran scope.

Laporkan temuan berdasarkan severity, file/area, skenario reproduksi,
dan usulan perbaikan. Bedakan bug yang terbukti dari risiko/pertanyaan.
```

### 6.7 Template prompt perbaikan bug

```text
Investigasi bug berikut tanpa memperluas scope:
- Perilaku yang diharapkan: [...]
- Perilaku aktual: [...]
- Langkah reproduksi: [...]
- Error/log yang sudah disanitasi: [...]

Pertama, identifikasi hipotesis dan bukti yang dibutuhkan. Jangan langsung
mengubah banyak file. Temukan akar masalah, tambahkan/regresikan tes yang
membuktikan bug, lakukan perubahan sekecil mungkin, lalu jalankan tes terkait.
Jangan menonaktifkan aturan keamanan atau mengubah tipe menjadi any untuk
menghilangkan error. Laporkan hasil aktual dan risiko tersisa.
```

---

## 7. Roadmap, Milestone, dan Exit Criteria

Fase di bawah merupakan urutan kerja tingkat tinggi. Rincian checklist operasional hidup di `TASK.md`. Setiap fase hanya dinyatakan selesai jika exit criteria-nya dibuktikan.

### PHASE 0 — Product Contract & Architecture

**Tujuan:** keputusan penting dibuat sebelum codebase tumbuh.

**Deliverables:**

- [ ] `AGENTS.md` awal sudah membatasi perilaku agent.
- [ ] `PRD.md` ditinjau dan scope MVP disetujui.
- [ ] Model bisnis referensi dan fitur out-of-scope disepakati.
- [ ] `ARCHITECTURE.md` menetapkan stack, routing, data fetching, dan batas frontend/Supabase.
- [ ] `DATABASE.md` memuat rancangan entitas, relasi, status, dan invariants utama.
- [ ] `SECURITY.md` memuat matriks izin awal dan strategi RLS.
- [ ] `TESTING.md` memuat strategi tes untuk booking, POS, pembayaran, RLS, dan laporan.
- [ ] Keputusan yang masih terbuka diberi owner dan tidak menghalangi implementasi secara diam-diam.
- [ ] `TASK.md` memuat task implementasi terurut dengan acceptance criteria.

**Exit criteria:** tidak ada ambiguitas kritis tentang scope MVP, role, lifecycle booking, alur checkout/pembayaran, sumber perhitungan laporan, atau strategi akses data yang akan membuat implementasi berisiko. Keputusan yang boleh ditunda tercatat jelas.

**Jangan mulai:** menulis seluruh halaman aplikasi atau membuat schema final berdasarkan asumsi yang belum disetujui.

### PHASE 1 — Foundation, Auth, Public Website & CMS

**Tujuan:** fondasi aplikasi dapat dijalankan dan konten bisnis publik dapat dikelola dengan izin yang benar.

**Deliverables:**

- [ ] Repository dan package manager/runtime disiapkan; lockfile di-commit.
- [ ] Struktur frontend sesuai `ARCHITECTURE.md`.
- [ ] Tailwind CSS v4 terkonfigurasi dengan design tokens yang disetujui.
- [ ] Supabase project/config untuk development siap; secret tidak berada di frontend.
- [ ] Migration awal tersedia di Git dan dapat diterapkan pada lingkungan development.
- [ ] Routing dan layout public/admin dasar berjalan.
- [ ] Auth flow Owner/Staff berfungsi sesuai keputusan produk.
- [ ] Authorization bukan sekadar menyembunyikan menu; aturan akses ditegakkan di data/backend.
- [ ] CMS minimum bisa mengubah konten yang memang termasuk scope dan hasilnya tampil di public website.
- [ ] Loading, empty, error, dan permission-denied states tersedia untuk alur yang relevan.
- [ ] Keputusan SEO untuk halaman publik dijalankan: metadata dan URL yang tepat, sitemap/indexing, serta prerendering bila keputusan arsitektur menyatakannya perlu.
- [ ] Build, type-check, lint/test yang tersedia lulus.
- [ ] CI minimal menjalankan script yang sama dengan lokal dan lulus (diperluas di Phase 4).
- [ ] README setup awal sesuai prosedur yang benar-benar diuji.

**Exit criteria:** Owner yang berwenang dapat login, mengelola konten MVP, melihat perubahan pada public website, dan pengguna tanpa izin tidak dapat mengakses/mengubah data admin. Migration dapat direproduksi dan test terkait lulus.

**Deployment gate:** lakukan deployment ke lingkungan yang disepakati untuk menguji perilaku nyata bila konfigurasi sudah aman. Provider/domain belum boleh dianggap final sampai dicatat di arsitektur atau release plan.

### PHASE 2 — Booking & Resource Scheduling

**Tujuan:** pengunjung dapat mengajukan booking dan Staff/Owner dapat mengelola prosesnya tanpa konflik jadwal.

**Deliverables:**

- [ ] Model resource, waktu, zona waktu, durasi, status, dan aturan bentrok didefinisikan.
- [ ] Public booking form hanya menerima field yang diperlukan.
- [ ] Request publik tidak dapat menentukan status final, pemilik data, harga resmi, atau field privilege.
- [ ] Jalur penyimpanan publik aman: RLS/RPC/Edge Function dipilih berdasarkan threat model dan diuji.
- [ ] Input divalidasi di client untuk UX dan di lapisan tepercaya untuk enforcement.
- [ ] Default status request dipaksakan sistem sesuai PRD (misalnya `pending`).
- [ ] Owner/Staff dapat melihat dan mengubah status hanya sesuai izin.
- [ ] Dua booking bertabrakan pada resource dan rentang waktu sama tidak dapat sama-sama dikonfirmasi, termasuk ketika request berlangsung hampir bersamaan.
- [ ] Aturan pembatalan/reschedule/expiry ditangani jika termasuk scope.
- [ ] Proteksi spam/abuse yang sesuai dengan risiko disiapkan untuk endpoint/form publik.
- [ ] Test untuk anonymous, Staff, Owner, bentrok waktu, batas interval, invalid input, dan kegagalan request lulus.
- [ ] UI responsive dengan loading, success, empty, dan error state.

**Exit criteria:** semua acceptance criteria booking di PRD lulus; aturan overlap tidak hanya bergantung pada pemeriksaan UI; RLS/authorization telah diuji; tidak ada jalur yang memungkinkan pengunjung mengonfirmasi booking sendiri.

### PHASE 3 — POS, Manual Payments & Sales Insight

**Tujuan:** transaksi dan laporan dapat dipercaya, tidak hanya tampak benar pada UI.

**Deliverables:**

- [ ] Katalog produk/layanan untuk POS mengikuti scope yang disepakati.
- [ ] Harga, diskon, pajak, pembulatan, mata uang, dan aturan total disepakati serta dihitung secara konsisten.
- [ ] Harga/total final divalidasi pada lapisan tepercaya; jangan percaya nominal hasil hitung client.
- [ ] Checkout menggunakan operasi atomik atau pendekatan konsistensi yang terdokumentasi agar transaksi tidak setengah tersimpan.
- [ ] Retry/double-submit tidak membuat transaksi ganda tanpa sengaja; mekanisme idempotency atau perlindungan setara dipilih sesuai kebutuhan.
- [ ] Pembayaran manual memiliki model data/status yang jelas.
- [ ] Jika DP dan pelunasan termasuk MVP, keduanya dicatat tanpa menghitung penerimaan uang atau penjualan dua kali.
- [ ] Void/refund/correction tidak menghapus jejak audit dan ditangani sesuai keputusan produk.
- [ ] Riwayat transaksi dan detail pembayaran bisa ditinjau oleh role yang berhak.
- [ ] Sales Insight memakai definisi metrik yang disetujui dan dapat direkonsiliasi dengan data transaksi/pembayaran.
- [ ] Test transaksi gagal di tengah proses, validasi harga, double-submit, DP+pelunasan, pembatalan, batas tanggal, dan permission lulus.
- [ ] Tidak ada test yang bergantung pada data produksi atau mengubah produksi.

**Exit criteria:** checkout gagal dengan aman tanpa meninggalkan data parsial; total dan saldo pembayaran konsisten; laporan dapat direkonsiliasi terhadap fixture/test data yang dihitung manual; authorization Owner/Staff terbukti lewat test.

### PHASE 4 — Hardening, Release & Open-Source Readiness

**Tujuan:** mengurangi risiko sebelum rilis dan memudahkan orang lain menjalankan proyek.

**Deliverables:**

- [ ] Review keamanan seluruh tabel yang terekspos ke client: RLS, role, policies, functions, dan jalur publik.
- [ ] Uji akses sebagai anonymous, Owner, dan Staff; tambahkan role lain hanya bila scope berubah.
- [ ] Tidak ada secret dalam Git history aktif, source frontend, log, atau dokumentasi.
- [ ] Semua migrations berjalan dari basis bersih pada environment test yang sesuai.
- [ ] Test suite yang disepakati lulus; hasil dilaporkan secara jujur.
- [ ] Type-check, lint, build, dan CI lulus.
- [ ] Alur e2e kritis diuji: login, edit konten, booking, konfirmasi/penolakan, checkout, pembayaran, dan laporan sesuai scope.
- [ ] Responsive checks pada ukuran layar yang disepakati serta pemeriksaan keyboard/focus/accessibility.
- [ ] Strategi backup dan pemulihan didokumentasikan dan diuji/di-simulasikan dengan aman sesuai kemampuan provider.
- [ ] Error/loading/empty states dan log penting diperiksa.
- [ ] README berisi setup, env variables, migrations, testing, deployment, serta batasan yang diketahui.
- [ ] Lisensi MIT dan atribusi dependency/aset diperiksa.
- [ ] `.env.example`, `.gitignore`, `.editorconfig`, runtime declaration, dan lockfile benar.
- [ ] Prosedur rilis, rollback, dan siapa yang menyetujui deployment jelas.
- [ ] Known issues serta risiko sisa dicatat; jangan menyebut “aman sempurna” tanpa dasar.

**Exit criteria:** rilis dapat dibuat ulang dari repository dengan instruksi yang diuji, semua gate kritis lulus, tidak ada temuan keamanan blocker, dan pemilik proyek menyetujui rilis.

---

## 8. Standar Database, Integritas Data, dan Migrasi

### 8.1 Migrations adalah schema source of truth

- Simpan setiap perubahan schema, constraint, index, RLS policy, trigger, function/RPC, dan perubahan terkait dalam migration file yang terurut.
- Jangan mengubah database remote secara manual tanpa migration yang direpresentasikan di Git.
- `DATABASE.md` menjelaskan alasan dan struktur, tetapi migration files mendefinisikan apa yang diterapkan.
- Sebelum menerapkan migration, tinjau SQL, perkiraan dampak data, rollback/recovery, dan apakah operasi destruktif.
- Uji migration pada database lokal atau project development yang terpisah sebelum target remote yang lebih penting.
- Jangan jalankan reset/drop/truncate atau migration destruktif pada production tanpa rencana, backup yang sesuai, dan persetujuan eksplisit.
- Setelah schema berubah, sinkronkan types hasil generator bila dipakai dan jalankan test terkait.
- Perubahan data lama membutuhkan strategi backfill/compatibility bila diperlukan; jangan hanya menambah kolom dan mengasumsikan data lama otomatis valid.

Referensi alur migration Supabase: https://supabase.com/docs/guides/local-development/database-migrations

### 8.2 Invariants database yang wajib dirancang

Detail final tergantung PRD, tetapi minimal evaluasi invariant berikut:

**Booking**

- Status awal ditetapkan sistem.
- Pemilik/resource yang dipesan valid dan mengacu pada bisnis yang tepat.
- Rentang waktu valid dan zona waktu ditangani konsisten.
- Booking terkonfirmasi pada resource yang sama tidak dapat overlap menurut aturan bisnis.
- Pemeriksaan overlap aman terhadap dua request bersamaan; query pemeriksaan di UI/API saja tidak cukup sebagai perlindungan concurrency.

**Access control**

- User tidak dapat membaca atau mengubah record milik user/bisnis lain di luar izin.
- Staff tidak dapat menaikkan role dirinya sendiri.
- Role dan owner/business association tidak boleh dapat diubah melalui update field biasa oleh pengguna yang tidak berwenang.
- Semua jalur akses (table, view, RPC, Edge Function) dievaluasi—bukan hanya halaman UI.

**POS dan pembayaran**

- Item transaksi menyimpan snapshot data yang diperlukan untuk mempertahankan riwayat ketika harga katalog berubah.
- Total transaksi dihitung konsisten dan tidak mempercayai nominal dari browser.
- Checkout terkait harus atomic atau mempunyai desain pemulihan yang jelas.
- Pembayaran dicatat dengan relasi, nominal, waktu, metode, dan status sesuai PRD.
- DP, pelunasan, void, dan refund harus mempunyai definisi akuntansi/laporan yang jelas sehingga tidak terhitung dua kali.
- Jangan menggunakan floating-point untuk perhitungan uang; tentukan tipe database dan unit penyimpanan yang sesuai dengan mata uang yang dipakai.
- Constraint, foreign key, dan unique rules digunakan bila tepat untuk menegakkan invariant pada database.

### 8.3 Data development dan seed

- Gunakan data demo sintetis, bukan data pelanggan asli.
- Seed harus dapat dijalankan ulang sesuai strategi yang dipilih dan tidak bergantung pada ID production.
- Jangan menyimpan password atau secret ke seed file.
- Tes edge case dengan fixture yang sengaja dibuat: waktu bertabrakan, pembayaran parsial, transaksi gagal, record tanpa izin, dan nilai batas.

---

## 9. Standar Security dan Privilege

### 9.1 Autentikasi bukan otorisasi

Login membuktikan identitas sesi; itu tidak otomatis memberi hak akses pada semua data. Semua operasi harus memverifikasi user dan permission di lapisan tepercaya.

### 9.2 RLS

Untuk setiap tabel yang dapat diakses client, `SECURITY.md` harus menjawab:

- Siapa yang boleh `SELECT`, `INSERT`, `UPDATE`, dan `DELETE`?
- Apakah akses public/anonymous memang diperlukan? Untuk field apa?
- Bagaimana memastikan user terikat ke bisnis/record yang benar?
- Apakah field sensitif (role, status, nominal, owner, audit field) dapat diubah client?
- Apakah view, function, RPC, dan Edge Function mempertahankan kontrol yang sama?
- Tes apa yang membuktikan akses yang diizinkan dan yang ditolak?

Hindari policy luas seperti “semua pengguna yang login boleh melakukan semua operasi” tanpa alasan yang valid.

### 9.3 Public booking

- Jangan memberi pengguna anonim izin luas untuk menulis semua kolom tabel booking.
- Gunakan jalur yang membatasi input/field, menetapkan status awal, dan memvalidasi waktu/resource di sisi tepercaya.
- Pertimbangkan RPC database atau Edge Function berdasarkan aturan data dan kebutuhan rate-limit/integrasi. Pilihannya harus dicatat dalam `ARCHITECTURE.md` dan diuji.
- Tambahkan perlindungan spam/abuse yang sepadan dengan risiko, tanpa membocorkan data booking kepada publik.
- Pastikan response public tidak mengekspos informasi pribadi atau data internal.

### 9.4 Secrets dan logging

- Variable `VITE_*` masuk ke bundle browser; jangan pernah letakkan secret di sana.
- `service_role` key, secret key Supabase (`sb_secret_…`), dan secret server hanya berada di secret storage/runtime yang sesuai.
- Jangan memasukkan token, password, URL berisi secret, data pembayaran sensitif, atau detail personal ke log/prompt/screenshot.
- `.env.example` tidak pernah memakai credential aktif.
- Bila secret terkomit, segera rotasi/revoke dan tinjau akses; menghapus file lokal bukan remediasi yang cukup.

### 9.5 Security gate

Tidak boleh rilis jika ditemukan hal blocker seperti akses lintas user yang tidak sah, privilege escalation, secret terekspos, jalur public dapat menetapkan status/nominal kritis, atau transaksi yang dapat merusak integritas data. Temuan harus diperbaiki dan diuji ulang sebelum dinyatakan selesai.

---

## 10. Strategi Pengujian

Pengujian adalah bukti perilaku, bukan formalitas agar command hijau.

| Area | Jenis verifikasi minimum |
|---|---|
| Static/type quality | TypeScript check dan lint sesuai script yang tersedia. |
| UI components | Unit/component tests untuk input, validasi, state, dan interaksi penting. |
| Auth | Login/logout/session expiry dan akses halaman sesuai role. |
| RLS | Query/mutation sebagai anonymous, Owner, dan Staff; verifikasi akses yang harus ditolak. |
| Public booking | Validasi field, status awal, spam/error cases, dan tidak ada informasi sensitif di response. |
| Booking concurrency | Dua request overlap untuk resource sama; pastikan hasil akhir tidak dapat mengonfirmasi keduanya. |
| POS checkout | Total valid, harga tidak dimanipulasi client, atomicity saat gagal, dan double-submit/retry. |
| Manual payments | DP/pelunasan, saldo, void/refund bila scope, serta tidak ada penghitungan ganda. |
| Reports | Rekonsiliasi metrik terhadap fixture transaksi/pembayaran yang dihitung manual. |
| Database | Migration dari basis bersih, constraints, policies, dan SQL tests yang sesuai. |
| Browser/e2e | Alur kritis dari pengguna hingga hasil tersimpan. |
| UI quality | Responsive layout, keyboard/focus, label, kontras, loading/empty/error states. |
| Build/deploy | Build reproducible dan smoke test pada deployment/environment yang disepakati. |

### 10.1 Aturan verifikasi

- Periksa `package.json` untuk script nyata sebelum menulis command CI atau mengklaim test coverage.
- Jalankan semua verifikasi yang relevan terhadap scope perubahan. Task kecil tidak selalu memerlukan seluruh e2e suite, tetapi perubahan lintas modul, schema, role, checkout, atau booking memerlukan verifikasi lebih menyeluruh.
- Jangan mengubah/menghapus tes yang gagal hanya agar pipeline hijau. Perbaiki akar masalah atau dokumentasikan alasan perubahan tes.
- Jangan memakai database production untuk test, benchmark, reset, atau fixture.
- Bila test tidak dapat dijalankan, catat alasannya, apa yang diverifikasi alternatif, dan risiko yang belum tertutup.
- Simpan hasil yang berguna di task/CI (command, pass/fail, environment). Jangan menyalin secret atau data pribadi ke bukti.

### 10.2 Definition of Done untuk task

Sebuah task hanya berstatus `Done` bila:

- [ ] Perilaku sesuai acceptance criteria.
- [ ] Perubahan tetap berada dalam scope yang disepakati.
- [ ] Validasi dan error states yang relevan sudah ditangani.
- [ ] Test relevan ditambahkan/diperbarui dan dijalankan.
- [ ] Type-check/lint/build yang relevan lulus, atau kegagalannya dicatat dengan jelas.
- [ ] Security/permission/data-integrity impact telah diperiksa.
- [ ] Diff ditinjau; tidak ada secret, debug code, dependency, atau perubahan tak terkait.
- [ ] Dokumentasi/tipenya diperbarui jika kontrak berubah.
- [ ] `TASK.md` mencatat bukti dan status final.
- [ ] Commit dibuat bila perubahan sudah diverifikasi dan workflow repository mengharuskannya.

---

## 11. Deployment, Environment, dan Release

### 11.1 Environment separation

Pisahkan development, test/staging bila tersedia, dan production. Credential, URL, seed data, serta konfigurasi masing-masing environment tidak boleh tercampur.

Provider frontend, domain, dan cara deployment belum dikunci di guide ini. Putuskan dalam `ARCHITECTURE.md`/release plan sebelum setup deployment. Jangan mengambil provider dari Master Build Guide lama secara otomatis.

### 11.2 Sebelum deployment

- [ ] Semua tes yang diwajibkan untuk rilis ini lulus.
- [ ] Build dilakukan dari commit yang diketahui.
- [ ] Variable environment dan secret production disiapkan melalui mekanisme resmi provider.
- [ ] Migration yang dibutuhkan ditinjau dan diterapkan sesuai prosedur aman.
- [ ] Tidak ada test data/demo yang tidak dimaksudkan untuk production.
- [ ] Auth redirect URL, URL publik, CORS (jika ada), domain, dan metadata sudah sesuai konfigurasi final.
- [ ] Ada rencana rollback/recovery yang sesuai jenis perubahan.
- [ ] Ada persetujuan eksplisit untuk deployment yang memengaruhi pengguna nyata.

### 11.3 Setelah deployment

- [ ] Jalankan smoke test pada URL dan environment yang benar.
- [ ] Uji login, public page, satu jalur booking, dan jalur transaksi sesuai perubahan yang dirilis.
- [ ] Periksa error console/log serta konfigurasi environment tanpa menampilkan secret.
- [ ] Pastikan migration/schema yang diharapkan benar-benar diterapkan.
- [ ] Catat commit, waktu rilis, hasil smoke test, dan masalah yang diketahui.
- [ ] Jika verifikasi gagal, hentikan perluasan rilis dan ikuti rencana rollback/fix.

Deployment berhasil hanya membuktikan aplikasi dapat diakses. Itu tidak otomatis membuktikan keamanan, correctness laporan, atau semua acceptance criteria sudah terpenuhi.

---

## 12. Open-Source Readiness

Sebelum rilis publik:

- [ ] `LICENSE` sesuai lisensi yang dipilih (baseline: MIT).
- [ ] README berisi tujuan, fitur, prasyarat, setup, environment, migration, testing, dan deployment.
- [ ] Tidak ada `.env`, token, service key, kredensial, dump database, atau data pelanggan dalam repository.
- [ ] `.gitignore` dan `.env.example` benar.
- [ ] Lockfile di-commit dan runtime ditetapkan.
- [ ] Aturan RLS dan konfigurasi database dapat dipahami serta direproduksi.
- [ ] Aset visual, font, ikon, gambar, serta dependency pihak ketiga memiliki lisensi/atribusi yang sesuai.
- [ ] Fitur yang belum selesai dan known limitations tercatat dengan jujur.
- [ ] Petunjuk kontribusi, pelaporan bug, dan pelaporan kerentanan ditambahkan bila proyek siap menerima kontribusi publik.
- [ ] Tidak ada klaim bahwa data production akan terisi otomatis saat instalasi bersih tanpa mekanisme seed/setup yang nyata.

Jangan menyertakan akun demo yang menggunakan credential nyata atau production secret. Jika menyediakan demo, buat environment dan akun khusus yang memiliki izin terbatas.

---

## 13. Pelacakan Progres dan Perubahan Keputusan

### 13.1 Status task yang disarankan

Gunakan status yang konsisten di `TASK.md`, misalnya:

- `Blocked` — belum dapat dimulai karena keputusan/dependensi belum selesai.
- `Ready` — requirement, scope, dan dependency cukup jelas untuk dikerjakan.
- `In Progress` — sedang dikerjakan.
- `Review` — implementasi ada, menunggu pemeriksaan/test.
- `Done` — acceptance criteria lulus dan bukti dicatat.
- `Deferred` — ditunda secara sengaja; bukan berarti lupa.

Jangan memakai `Done` hanya karena file sudah ada atau AI sudah menghasilkan kode.

### 13.2 Isi minimum pada task

```markdown
## [TITIS-XXX] Judul task
- Status: Ready
- Phase: PHASE N
- Depends on: [task ID atau None]
- Scope: [apa yang akan diubah]
- Out of scope: [apa yang tidak akan diubah]

### Acceptance criteria
- [ ] [hasil yang dapat diamati dan diuji]

### Verification
- [ ] [command/test/manual check]

### Evidence / notes
- Hasil aktual:
- File/migration terkait:
- Commit:
- Known issue/blocker:
```

Format bisa disederhanakan selama scope, kriteria, dependensi, tes, bukti, dan status tetap jelas.

Penomoran ID task (`TITIS-0xx` Phase 0, `-1xx` Phase 1, dan seterusnya) hanya dibuat di `TASK.md`; dokumen lain hanya merujuk ID tersebut dan tidak menomori sendiri.

### 13.3 Status tingkat tinggi pada guide ini

Perbarui bagian ini saat memulai atau menyelesaikan fase, bukan setiap perubahan kecil.

```text
Fase aktif       : [isi setelah memeriksa repository]
Milestone terakhir: [milestone terakhir yang sudah diverifikasi]
Commit terverifikasi: [hash commit atau Belum ada]
Task aktif       : [ID task atau Tidak ada]
Blocker          : [blocker aktual atau Tidak ada]
Checkpoint berikut: [langkah berikutnya yang sudah disepakati]
Tanggal update   : [tanggal pembaruan aktual]
```

Ganti status contoh di atas hanya setelah memverifikasinya di repository. Jangan membiarkannya menjadi laporan progres palsu.

### 13.4 Decision log

Untuk perubahan yang memengaruhi beberapa modul, security, schema, atau scope, catat di PRD/Architecture/Database/Security yang relevan. Jika alasan keputusan mudah hilang, tambahkan entri ringkas:

```markdown
### DEC-XXX — [Judul]
- Status: Open / Proposed / Accepted / Rejected / Superseded
- Konteks:
- Pilihan yang dipertimbangkan:
- Keputusan:
- Alasan:
- Dampak/trade-off:
- Dokumen/task terdampak:
- Tanggal:
```

Kosakata status keputusan (berlaku di semua dokumen): `OPEN-xxx` di `PRD.md` memakai `Open` / `Decided` / `Deferred`; `DEC-xxx` memakai status di atas. Hanya `Decided` (OPEN) dan `Accepted` (DEC) yang membolehkan implementasi bergantung pada keputusan itu. `Deferred` wajib mencantumkan owner, alasan, dan tenggat.

Jangan mencatat setiap pilihan kecil sebagai ADR. Gunakan log untuk keputusan yang sulit dibalik atau memengaruhi banyak bagian sistem.

---

## 14. Risiko Utama dan Cara Menguranginya

| Risiko | Tanda peringatan | Pengendalian |
|---|---|---|
| Scope creep | Agent menambahkan fitur yang tidak ada di task/PRD | Task kecil, out-of-scope eksplisit, persetujuan perubahan scope. |
| Dokumen saling bertentangan | Stack/role/status berbeda di file berbeda | Aturan source of truth; hentikan implementasi hingga konflik terselesaikan. |
| Kebocoran data antar-user/role | UI menyembunyikan menu tetapi direct query masih berhasil | RLS, server-side checks, negative tests sebagai tiap role. |
| Booking double-confirm | Dua request overlap dapat sama-sama berhasil | Constraint/transaction design pada database, concurrency testing. |
| Transaksi parsial | Header transaksi tersimpan tanpa item/pembayaran yang sesuai | Operasi atomik, failure-injection tests, recovery plan. |
| Laporan tidak cocok | Dashboard menjumlahkan DP dan pelunasan sebagai dua penjualan | Definisi metrik, ledger/transaction model, rekonsiliasi dengan fixture. |
| Secret masuk Git | Credential muncul di diff, screenshot, prompt, atau frontend bundle | `.gitignore`, review diff, secret storage, rotasi ketika terekspos. |
| Ketergantungan ke AI | Developer tidak memahami kode yang dihasilkan | Minta penjelasan alasan/perubahan, periksa diff, pelajari konsep terkait sebelum menambah kompleksitas. |
| Dependency berlebih | Generator menambah library tanpa kebutuhan | Semua dependency harus punya alasan, dipilih di arsitektur, dan disetujui. |
| Tidak bisa direproduksi | Setup bekerja hanya di laptop pembuat | Lockfile, runtime version, migrations, seed, README yang diuji. |
| SEO public page tidak memadai | Konten dinamis penting tidak muncul seperti yang diharapkan crawler | Putuskan strategi SEO lebih awal dan uji halaman publik secara nyata. |
| Deploy dianggap bukti selesai | App dapat dibuka tetapi flow/data/security belum diuji | Exit criteria dan smoke/e2e tests terpisah dari status deployment. |

---

## 15. Referensi dan Aturan Memperbarui Guide

Dokumentasi resmi yang relevan harus diperiksa sesuai versi tool saat implementasi:

- Supabase Database Migrations: https://supabase.com/docs/guides/local-development/database-migrations
- Google Developers — pengumuman Google Stitch: https://developers.googleblog.com/en/stitch-a-new-way-to-design-uis/
- Cursor Rules: https://cursor.com/docs/rules
- OpenAI Developers: https://developers.openai.com/
- Claude Code memory/instructions: https://docs.anthropic.com/en/docs/claude-code/memory

Harga, batas paket, sintaks CLI, dukungan file instruksi, dan kemampuan integrasi AI tools dapat berubah. Jangan mendasarkan keputusan operasional jangka panjang pada klaim harga/fitur di dokumen lama. Verifikasi kondisi aktual sebelum memilih tool atau merancang workflow.

### Kapan guide ini harus diperbarui

Perbarui guide bila:

- Scope/MVP atau urutan fase berubah.
- Exit criteria baru disetujui.
- Workflow AI atau aturan keselamatan berubah.
- Ada milestone yang selesai atau blocker tingkat proyek berubah.
- Deployment/release procedure disepakati atau berubah.

Jangan menyalin detail API, schema lengkap, daftar semua komponen, atau seluruh checklist harian ke dalam guide ini. Tempatkan detail pada dokumen khusus, lalu tambahkan rujukan dari guide jika membantu.

---

## 16. Checklist Sebelum Coding Pertama

Tidak ada implementasi fitur sebelum checklist ini ditinjau.

### Kontrak produk

- [ ] Definisi dan tujuan TITIS disetujui.
- [ ] Model bisnis referensi kafe dengan ruang privat diterima atau diganti secara eksplisit.
- [ ] Scope MVP dan fitur yang ditunda sudah tertulis di `PRD.md`.
- [ ] Halaman publik dan dashboard ditetapkan.
- [ ] Role Owner/Staff dan permission produk ditetapkan.
- [ ] Lifecycle booking, konflik waktu, dan perubahan status didefinisikan.
- [ ] Perhitungan POS, pembayaran manual/DP/pelunasan, dan definisi laporan ditetapkan atau ditandai blocker.

### Kontrak teknis

- [ ] Stack dan versi baseline disetujui dalam `ARCHITECTURE.md`.
- [ ] Routing, data fetching, validation, dan error-handling approach diputuskan.
- [ ] Strategi schema/migrations, generated types, dan seed ditetapkan.
- [ ] Rencana RLS dan jalur booking publik didokumentasikan.
- [ ] Strategi transaksi atomik untuk checkout ditetapkan.
- [ ] SEO strategy untuk public website ditentukan.
- [ ] Hosting/environment/deployment provider ditetapkan sebelum setup deploy.

### Kontrak desain dan testing

- [ ] Mockup utama public website dan dashboard ditinjau.
- [ ] `DESIGN.md` memuat design tokens, responsive behavior, accessibility, dan UI states.
- [ ] `TESTING.md` menetapkan verifikasi auth/RLS, booking, checkout, payments, reports, dan UI.

### Kontrak workflow

- [ ] `AGENTS.md` sudah ada dan membatasi tindakan agent.
- [ ] `TASK.md` berisi task kecil dengan acceptance criteria dan dependensi.
- [ ] Git repository dan aturan branch/commit siap.
- [ ] Secret tidak ditempatkan dalam repo atau frontend.
- [ ] Developer tahu cara memeriksa diff dan menjalankan tes aktual.

**Gate:** jika item yang kritis untuk fitur pertama belum jelas, selesaikan atau catat sebagai blocker terlebih dahulu. Checklist ini bukan formalitas; ia mencegah AI mengisi celah keputusan sendiri.

---

## 17. Ringkasan Aturan Kerja TITIS

- **PRD menjelaskan apa dan mengapa.**
- **ARCHITECTURE menjelaskan bagaimana sistem disusun.**
- **DESIGN menjelaskan tampilan dan interaksi yang disepakati.**
- **Migrations mendefinisikan schema database yang dieksekusi.**
- **SECURITY menjelaskan model ancaman dan kontrol; test membuktikan kontrol bekerja.**
- **TESTING menjelaskan cara verifikasi.**
- **AGENTS menetapkan bagaimana AI boleh bekerja.**
- **TASK mencatat pekerjaan dan bukti progres aktual.**
- **MASTER_BUILD_GUIDE menghubungkan semua dokumen dalam satu roadmap.**

Mulai dari kontrak produk dan arsitektur; implementasikan satu task pada satu waktu; periksa perubahan; buktikan behavior melalui test; catat hasil; lalu lanjut ke task berikutnya.

**TITIS dianggap maju bukan ketika banyak kode ditulis, melainkan ketika milestone yang disepakati benar-benar dapat diverifikasi.**
