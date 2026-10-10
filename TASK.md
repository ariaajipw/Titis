# TITIS — TASK.md

> **Fungsi:** daftar pekerjaan aktual TITIS — status per task, dependensi, acceptance criteria, bukti verifikasi, blocker, dan task berikutnya.
>
> **Bukan untuk:** mengulang isi `PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `DATABASE.md`, `SECURITY.md`, atau `TESTING.md`. Rujuk dokumen itu; jangan menyalin isinya ke sini.
>
> **Roadmap tingkat tinggi:** `TITIS_MASTER_BUILD_GUIDE_FINAL.md` (bagian 7). Detail pekerjaan harian hidup di file ini.

---

## 1. Status Saat Ini

```text
Fase aktif          : PHASE 0 — Product Contract & Architecture
Task aktif          : Tidak ada
Task berikutnya     : TITIS-002 (PRD) — gerbang bagi sebagian besar task Phase 0; TITIS-001, 011, dan 013 dapat dikerjakan paralel
Blocker             : Tidak ada blocker teknis. Menunggu peninjauan pemilik atas dokumen Phase 0
Commit terverifikasi: Belum diverifikasi (isi setelah repository diperiksa)
Tanggal update      : 2026-10-10
```

Ganti blok ini hanya setelah kondisinya diverifikasi di repository. Jangan biarkan ia menjadi laporan progres palsu.

---

## 2. Cara Memakai File Ini

1. Pilih **satu** task berstatus `Ready` (atau `Review` bila tugasnya meninjau dokumen). Baca dependensinya.
2. Pastikan git working tree bersih atau perubahan sebelumnya sudah dipahami.
3. Untuk task yang menyentuh banyak file, database, keamanan, atau arsitektur: minta rencana dahulu, baru implementasi.
4. Kerjakan hanya scope task. Hal di luar scope dicatat di bagian 8 (Parking Lot), bukan dikerjakan.
5. Periksa diff, jalankan verifikasi yang **benar-benar tersedia**, lalu isi bagian `Evidence` dengan hasil aktual.
6. Ubah status hanya setelah syarat statusnya terpenuhi (bagian 3).
7. Perbarui dokumen sumber kebenaran bila behavior atau keputusan berubah; catat keputusan sulit dibalik sebagai `DEC-XXX`.

Aturan yang tidak boleh dilanggar ada di `TITIS_MASTER_BUILD_GUIDE_FINAL.md` (bagian 0.3) dan `AGENTS.md`. Singkatnya: satu agent penulis aktif dalam satu waktu, tidak ada perubahan scope/stack/dependency/skema/akses/deployment tanpa persetujuan pemilik, tidak ada secret di frontend atau Git, dan task belum selesai tanpa bukti.

---

## 3. Status Task

| Status | Arti |
|---|---|
| `Blocked` | Belum bisa dimulai: keputusan atau dependensi belum selesai. |
| `Ready` | Requirement, scope, dan dependensi cukup jelas untuk dikerjakan. |
| `In Progress` | Sedang dikerjakan. |
| `Review` | Hasil sudah ada, menunggu pemeriksaan atau tes. Untuk dokumen Phase 0: file sudah dibuat, menunggu tinjauan pemilik. Tinjauan boleh berjalan sebelum dependensinya `Done`, tetapi task tidak boleh ditutup (`Done`) sebelum semua dependensinya `Done`. |
| `Done` | Acceptance criteria lulus dan bukti dicatat. |
| `Deferred` | Ditunda secara sengaja, bukan lupa. |

`Done` tidak boleh dipakai hanya karena file sudah ada atau AI sudah menghasilkan kode.

### Definition of Done (ringkas, selengkapnya di `TITIS_MASTER_BUILD_GUIDE_FINAL.md` §10.2)

- [ ] Perilaku sesuai acceptance criteria dan tetap dalam scope.
- [ ] Validasi dan error state yang relevan ditangani.
- [ ] Test relevan ditambahkan/diperbarui **dan dijalankan**.
- [ ] Type-check/lint/build yang relevan lulus, atau kegagalannya dicatat jelas.
- [ ] Dampak security, permission, dan integritas data diperiksa.
- [ ] Diff ditinjau: tanpa secret, debug code, dependency, atau perubahan tak terkait.
- [ ] Dokumentasi dan tipe diperbarui bila kontrak berubah.
- [ ] Evidence tercatat di task ini.

---

## 4. Format Task

Format ini menyederhanakan template di guide (§13.2). Isi minimum tetap ada: scope, kriteria, dependensi, tes, bukti, dan status.

```markdown
## [TITIS-XXX] Judul
- Status: Ready | Phase: N | Depends on: [ID atau None]
- Scope: ...
- Out of scope: ...

### Acceptance criteria
- [ ] ...

### Verification
- [ ] ...

### Evidence
- Hasil aktual / file / migration / commit / blocker: _belum ada_
```

Task Phase 0 dan Phase 1 ditulis lengkap. Task Phase 2–4 ditulis ringkas dan **di-expand menjadi format lengkap saat fasenya aktif**, karena detailnya bergantung pada keputusan Phase 0–1.

Penomoran ID: `TITIS-0xx` Phase 0, `-1xx` Phase 1, `-2xx` Phase 2, `-3xx` Phase 3, `-4xx` Phase 4, `-9xx` Parking Lot. ID hanya dibuat dan dinomori di file ini; dokumen lain (PRD, ARCHITECTURE, AGENTS, guide) hanya merujuknya. Bila menambah task, pakai nomor berikutnya yang belum terpakai; jangan menomori ulang task yang sudah dirujuk.

---

## 5. PHASE 0 — Product Contract & Architecture

**Tujuan:** keputusan penting dibuat sebelum codebase tumbuh.
**Exit criteria:** tidak ada ambiguitas kritis tentang scope MVP, role, lifecycle booking, alur checkout/pembayaran, sumber perhitungan laporan, atau strategi akses data. Keputusan yang boleh ditunda tercatat jelas.
**Jangan mulai:** menulis seluruh halaman aplikasi atau membuat schema final berdasarkan asumsi yang belum disetujui.

Dokumen berikut sudah dibuat sebelum `TASK.md` ada, tetapi isinya **belum diverifikasi terhadap guide**. Karena itu statusnya `Review`, bukan `Done`.

---

## [TITIS-001] Tinjau AGENTS.md (pagar awal agent)
- Status: Review | Phase: 0 | Depends on: None
- Scope: periksa `AGENTS.md` terhadap guide §5 Langkah 0 dan §6.4; lengkapi bila ada yang kurang.
- Out of scope: menggandakan roadmap atau isi PRD; membuat `CLAUDE.md`.

### Acceptance criteria
- [ ] Memuat aturan minimal: baca guide dan task sebelum bertindak; jangan perluas scope atau ganti stack/dependency tanpa persetujuan; tidak ada operasi destruktif pada database remote; tidak membuka/menyalin/mencetak secret; tidak push/deploy/migrasi remote tanpa izin eksplisit; periksa diff sebelum menyatakan selesai; laporkan hasil verifikasi aktual; berhenti dan lapor bila dokumen bertentangan atau requirement tidak jelas.
- [ ] Daftar perubahan yang wajib persetujuan pemilik (guide §6.4) tercermin.
- [ ] Menyatakan satu agent penulis aktif dalam satu waktu; agent lain hanya review read-only.
- [ ] Tidak menduplikasi roadmap atau isi PRD.
- [ ] Kosakata status keputusan selaras dengan guide §13.4 (OPEN: `Decided`; DEC: `Accepted`) dan rujukan ID task valid.
- [ ] Penegakan teknis aturan (deny-list/ignore per alat) dirujuk ke TITIS-013.

### Verification
- [ ] Baca ulang `AGENTS.md` terhadap daftar di atas.
- [ ] Uji pemahaman: minta agent meringkas aturan dan batasannya **tanpa mengubah file**.

### Evidence
- Review read-only 2026-10-11: aturan minimum dan daftar otorisasi pemilik selaras dengan guide; aturan satu penulis, non-duplikasi roadmap/PRD, kosakata OPEN/DEC dan ID TITIS-013, serta rujukan penegakan teknis ke TITIS-013 terverifikasi. Verifikasi referensi panduan kanonis pada `AGENTS.md` memastikan seluruh 6 lokasi menggunakan `TITIS_MASTER_BUILD_GUIDE_FINAL.md`; tidak ditemukan referensi aktif ke `MASTER_BUILD_GUIDE.md` yang masih perlu diperbaiki. `AGENTS.md` tidak diubah karena sudah konsisten.

---

## [TITIS-002] Tinjau dan setujui PRD.md
- Status: Review | Phase: 0 | Depends on: None
- Scope: periksa `PRD.md` terhadap guide §1 dan §5 Langkah 1; beri label `OPEN` pada requirement yang belum disepakati; setujui scope MVP.
- Out of scope: keputusan teknis implementasi.

### Acceptance criteria
- [ ] Memuat masalah dan tujuan produk, persona, serta model bisnis referensi (kafe dengan ruang privat, atau penggantinya yang dinyatakan eksplisit).
- [ ] Scope MVP dan out-of-scope selaras dengan guide §1.2–1.3.
- [ ] Daftar halaman public website dan dashboard.
- [ ] User stories dengan acceptance criteria yang bisa diuji.
- [ ] Role Owner/Staff dan kebutuhan akses tingkat produk.
- [ ] Alur booking, POS, pembayaran manual, dan laporan.
- [ ] Definisi metrik bisnis yang akan ditampilkan.
- [ ] Risiko, asumsi, dependency, dan pertanyaan terbuka; tidak ada asumsi yang diam-diam menjadi requirement final.
- [ ] Prioritas dan kriteria keberhasilan MVP.

### Verification
- [ ] Pemilik menyatakan scope MVP disetujui (catat tanggal di Evidence).

### Evidence
- Review read-only 2026-10-11: kriteria PRD 1–9 diperiksa terhadap guide; bagian-bagian utama tersedia, tetapi sejumlah kebutuhan masih bersyarat pada OPEN. OPEN-001–021 semuanya berstatus `Open`; persetujuan Owner atas scope belum tercatat. Keputusan tersisa mencakup model referensi (OPEN-016), izin role (OPEN-001–005/010), checkout/DP/laporan (OPEN-010–012), stok per SKU (belum didefinisikan), privasi/retensi pengunjung (OPEN-013/020), SEO (OPEN-015/DEC-011), dan bootstrap Owner (OPEN-018). Cross-check menemukan rujukan PRD/README ke `docs/DATABASE.md`, `docs/SECURITY.md`, dan `docs/TESTING.md` tidak sesuai lokasi file yang ditemukan (root); README menyebut Cloudflare direncanakan sementara OPEN-014/DEC-012 masih `Open`; PRD memetakan OPEN-001 ke TITIS-109 sedangkan TITIS-108 mencantumkan OPEN-001/006 sebagai prasyarat. Perbaikan referensi lintas dokumen telah diterapkan pada 10 file (AGENTS, ARCHITECTURE, DESIGN, PRD, README, DATABASE, TESTING, SECURITY, TASK, dan guide) untuk nama file guide kanonis dan prefix `docs/` pada file Markdown di root. 7 referensi aktif di AGENTS ditahan untuk persetujuan Owner dan sudah dikonfirmasi konsisten. Tidak ada keputusan produk, status, atau acceptance criteria PRD yang diubah. TITIS-002 tetap `Review` sampai Owner menyetujui scope.
- 2026-10-11: OPEN-001..021 telah diputuskan oleh Owner di `PRD.md` §8 (semua berstatus `Decided` dengan keputusan & tanggal tercatat). TITIS-002 tetap `Review` menunggu persetujuan scope MVP eksplisit.

---

## [TITIS-003] Selesaikan atau tandai keputusan produk terbuka
- Status: Blocked | Phase: 0 | Depends on: TITIS-002
- Scope: untuk tiap topik di guide §1.5 (pengguna & role, public website/CMS, booking, pencegahan bentrok, POS, pembayaran, laporan, data bisnis, hosting & deployment, SEO), ambil keputusan atau tandai `Deferred` dengan owner dan alasan. Setiap `OPEN-001` s.d. `OPEN-021` di `PRD.md` §8 diberi Status (`Open`/`Decided`/`Deferred`). Topik hosting dan SEO boleh `Deferred` ke TITIS-005 dan TITIS-006.
- Out of scope: implementasi apa pun. AI agent tidak boleh memilih keputusan ini sendiri.

### Acceptance criteria
- [ ] Setiap topik berstatus `Decided` atau `Deferred` (owner, alasan, batas waktu keputusan).
- [ ] Kolom Status dan Keputusan & tanggal di `PRD.md` §8 terisi; OPEN untuk role, lifecycle/bentrok booking, checkout/pembayaran, definisi laporan, dan data bisnis tidak `Deferred` melewati gate Phase 0.
- [ ] Minimal terjawab: kemampuan Staff (konten, konfirmasi booking, diskon, pembayaran, laporan keuangan); lifecycle booking (status, expiry, pembatalan); DP dan pelunasan; definisi metrik; zona waktu dan mata uang.
- [ ] Keputusan produk dicatat di PRD; keputusan sulit dibalik dicatat sebagai `DEC-XXX`.

### Verification
- [ ] Tinjauan pemilik; tidak ada topik tersisa tanpa status.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-004] Tinjau dan kunci ARCHITECTURE.md
- Status: Review | Phase: 0 | Depends on: TITIS-002, TITIS-003, TITIS-006
- Scope: periksa `ARCHITECTURE.md` terhadap guide §2, §5 Langkah 2, dan §9.3; kunci keputusan teknis.
- Out of scope: scaffold proyek.

### Acceptance criteria
- [ ] Stack dan versi baseline ditetapkan setelah dicek ke dokumentasi resmi, bukan ingatan model.
- [ ] Routing, data fetching/server state (aturan cache, invalidation, loading, error), dan pendekatan validasi form diputuskan.
- [ ] Batas frontend vs Supabase jelas; sumber auth dan cara role diperiksa dijelaskan.
- [ ] Kapan cukup SQL/RPC dan kapan perlu Edge Function dinyatakan; pilihan jalur booking publik tercatat.
- [ ] Strategi migrations, generated types, dan seed ditetapkan.
- [ ] Rencana struktur modul/folder; tidak ada teknologi dari desain lama (FastAPI, Railway, Zustand, Web3) tanpa alasan tercatat.
- [ ] DEC yang menjadi prasyarat task Phase 1 (kolom "Prasyarat keputusan") berstatus `Accepted`; DEC lain punya owner dan tenggat (DEC-012 di TITIS-005, DEC-017 sebelum TITIS-203, E2E/a11y pada DEC-013 sebelum TITIS-404).
- [ ] Rujukan ID task di `ARCHITECTURE.md` cocok dengan `TASK.md`.

### Verification
- [ ] Cross-check dengan PRD; konflik antardokumen diselesaikan menurut guide §3.2.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-005] Kunci keputusan deployment dan rencana rilis
- Status: Blocked | Phase: 0 | Depends on: TITIS-004
- Scope: putuskan hosting (DEC-012, OPEN-014). Kandidat yang disebut di draf awal file ini: **Cloudflare** (Workers dengan static assets atau Pages — bila dipilih, pilih satu, jangan campur); kandidat lain boleh dievaluasi. Catat juga domain, pemisahan environment (development/staging/production), cara mengelola env var dan secret, penanganan fallback SPA routing, rencana rollback, dan siapa yang menyetujui rilis. Tulis di `ARCHITECTURE.md` (DEC-012) atau dokumen rencana rilis.
- Out of scope: setup deployment aktual (TITIS-111).

### Acceptance criteria
- [ ] Keputusan tercatat; `DEC-XXX` dibuat bila sulit dibalik.
- [ ] Pilihan diverifikasi ke dokumentasi resmi penyedia saat ini terhadap kebutuhan minimum di DEC-012 (fallback SPA, env var saat build, HTTPS dan domain kustom, deploy pratinjau, rollback), opsi SEO (DEC-011), dan mekanisme perlindungan spam (DEC-017).
- [ ] Batas paket Supabase yang relevan (misalnya jeda proyek saat tidak aktif dan ketersediaan backup) diperiksa dari sumber resmi saat ini dan dicatat, tanpa menyalin angka dari ingatan.
- [ ] Dinyatakan environment mana yang boleh dipakai untuk demo dan mana yang untuk penggunaan nyata.

### Verification
- [ ] Tinjauan pemilik.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-006] Putuskan strategi SEO untuk public website (SPA Vite)
- Status: Blocked | Phase: 0 | Depends on: TITIS-002
- Scope: tentukan kebutuhan indeksasi, metadata, sitemap, dan apakah prerendering atau solusi lain diperlukan.
- Out of scope: implementasi (TITIS-110).

### Acceptance criteria
- [ ] Keputusan tercatat beserta dampaknya pada arsitektur dan hosting.
- [ ] Halaman publik mana yang perlu terindeks dinyatakan.
- [ ] Arah SEO tercatat sebagai DEC-011 sebelum routing (DEC-002) diputuskan di TITIS-004.

### Verification
- [ ] Tinjauan pemilik.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-007] Tinjau DATABASE.md
- Status: Review | Phase: 0 | Depends on: TITIS-003, TITIS-004
- Scope: periksa rancangan entitas, relasi, status, dan invariants terhadap guide §8.2.
- Out of scope: menulis migration SQL.

### Acceptance criteria
- [ ] Invariants booking (status awal oleh sistem, rentang waktu dan zona waktu, tidak ada overlap terkonfirmasi, aman terhadap request bersamaan).
- [ ] Invariants akses (role dan asosiasi bisnis tidak bisa diubah lewat update biasa; Staff tidak bisa menaikkan role sendiri).
- [ ] Invariants POS dan pembayaran (snapshot harga pada item, total tidak dipercaya dari browser, checkout atomik, DP/pelunasan tidak terhitung dua kali).
- [ ] Tipe dan unit penyimpanan uang ditetapkan tanpa floating-point.
- [ ] Dinyatakan bahwa migration files tetap sumber kebenaran schema.

### Verification
- [ ] Cross-check dengan PRD dan keputusan TITIS-003.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-008] Tinjau SECURITY.md
- Status: Review | Phase: 0 | Depends on: TITIS-007
- Scope: periksa terhadap guide §9.
- Out of scope: menulis policy RLS dalam SQL.

### Acceptance criteria
- [ ] Matriks izin awal untuk anonymous, Staff, dan Owner.
- [ ] Untuk setiap tabel yang diakses client: siapa boleh SELECT/INSERT/UPDATE/DELETE, dan field sensitif mana yang tidak boleh diubah client.
- [ ] Jalur booking publik (RPC atau Edge Function) dipilih dengan alasan dan sesuai `ARCHITECTURE.md`.
- [ ] Kebijakan secret: variabel `VITE_*` dianggap publik; `service_role` dan secret server tidak pernah di frontend.
- [ ] Security gate (guide §9.5) dinyatakan.

### Verification
- [ ] Cross-check dengan DATABASE.md dan PRD.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-009] Tinjau DESIGN.md dan referensi Stitch
- Status: Review | Phase: 0 | Depends on: TITIS-002
- Scope: periksa terhadap guide §5 Langkah 3; pastikan mockup yang disetujui tersimpan.
- Out of scope: menyalin generated code Stitch ke proyek.

### Acceptance criteria
- [ ] Design tokens (warna, tipografi, spacing, radius, border, elevation) tercatat.
- [ ] Komponen dasar dan state (default, hover, focus, disabled, loading, error, empty) didefinisikan.
- [ ] Pola layout desktop/tablet/mobile dan standar aksesibilitas (keyboard, fokus, label, kontras).
- [ ] Mockup public website dan dashboard yang disetujui ada di `docs/design/references/` dan dirujuk dari `DESIGN.md`.

### Verification
- [ ] Tinjauan pemilik terhadap mockup.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-010] Tinjau TESTING.md
- Status: Review | Phase: 0 | Depends on: TITIS-007, TITIS-008
- Scope: periksa strategi tes terhadap guide §10.
- Out of scope: menulis tes.

### Acceptance criteria
- [ ] Mencakup: type/lint, komponen UI, auth, RLS (anonymous/Owner/Staff), booking publik, concurrency booking, checkout, pembayaran manual, laporan (rekonsiliasi dengan fixture hitungan manual), database/migration, e2e, kualitas UI, build/deploy.
- [ ] Definition of Done selaras dengan guide §10.2.
- [ ] Tidak ada klaim tes lulus tanpa hasil aktual.

### Verification
- [ ] Cross-check dengan SECURITY.md dan DATABASE.md.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-011] Putuskan lisensi dan buat file LICENSE
- Status: Ready | Phase: 0 | Depends on: None
- Scope: pemilik memutuskan lisensi akhir (baseline guide: MIT), nama pemegang hak cipta, dan tahun; buat `LICENSE` di root.
- Out of scope: audit lisensi dependency (TITIS-407).

### Acceptance criteria
- [ ] Keputusan tercatat (`DEC-XXX`).
- [ ] `OPEN-017` di `PRD.md` §8 berstatus `Decided`.
- [ ] `LICENSE` ada di root dengan nama dan tahun yang benar.
- [ ] Bagian Lisensi di `README.md` diperbarui sesuai keputusan.
- [ ] Repo referensi lain hanya dipelajari alurnya; tidak ada kode berlisensi AGPL atau lisensi lain yang disalin tanpa evaluasi.

### Verification
- [ ] Baca isi `LICENSE`; pemilik mengonfirmasi.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-012] Cek konsistensi lintas dokumen
- Status: Blocked | Phase: 0 | Depends on: TITIS-001, 002, 003, 004, 005, 006, 007, 008, 009, 010
- Scope: cari konflik stack, role, status, dan istilah antardokumen (guide §3.2); pastikan nama file konsisten.
- Out of scope: menulis ulang dokumen yang tidak konflik.

### Acceptance criteria
- [ ] Tidak ada konflik tersisa, atau konflik tercatat sebagai blocker dengan owner.
- [ ] Setiap ID task yang dirujuk di PRD, ARCHITECTURE, AGENTS, dan guide ada di `TASK.md` dengan arti yang sama.
- [ ] Kosakata status konsisten: OPEN (`Open`/`Decided`/`Deferred`), DEC (`Proposed`/`Open`/`Accepted`/`Rejected`/`Superseded`), task (`Blocked`/`Ready`/`In Progress`/`Review`/`Done`/`Deferred`).
- [ ] Rujukan pasal ke `DATABASE.md`, `SECURITY.md`, `TESTING.md`, dan `DESIGN.md` dari PRD/ARCHITECTURE/AGENTS valid (daftar rujukan ada di `REVIEW_KONSISTENSI.md`).
- [ ] Nama file guide konsisten dengan semua rujukan (`TITIS_MASTER_BUILD_GUIDE_FINAL.md` dirujuk di guide, prompt template, dan README; sesuaikan nama file atau rujukannya).
- [ ] Tautan di `README.md` valid; tidak ada dua checklist granular yang sama.

### Verification
- [ ] Baca silang seluruh dokumen; catat temuan dan perbaikannya.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-013] Siapkan repository Git dan aturan kerja
- Status: Ready | Phase: 0 | Depends on: None
- Scope: inisialisasi repo, remote GitHub, konvensi branch dan commit, `.gitignore` awal. Putuskan dan catat visibilitas repo selama pengembangan (private atau public).
- Out of scope: scaffold aplikasi.

### Acceptance criteria
- [ ] Repo memiliki commit awal berisi dokumen proyek.
- [ ] `.gitignore` mengecualikan `.env` dan `.env.*` yang berisi nilai lokal, `node_modules/`, build output, cache, dan log, tanpa mengecualikan file contoh yang aman.
- [ ] Aturan branch dan commit tertulis (di `AGENTS.md` atau dokumen yang dirujuknya).
- [ ] Agent bekerja di branch fitur (tidak di `main`); proteksi branch `main` dipertimbangkan pada repo remote.
- [ ] Penegakan teknis disiapkan atau keterbatasannya dicatat: ignore/deny-list untuk `.env*` dan konfirmasi untuk command berisiko (`AGENTS.md` §6) pada konfigurasi tiap alat yang dipakai (OpenCode, Cursor, Codex CLI, Claude Code).
- [ ] Tidak ada secret di repo.

### Verification
- [ ] `git status` bersih setelah commit awal.
- [ ] Buat file `.env` dummy dan pastikan Git mengabaikannya.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-014] Gate: checklist sebelum coding pertama
- Status: Blocked | Phase: 0 | Depends on: TITIS-001 sampai TITIS-013
- Scope: tinjau seluruh checklist guide §16 (kontrak produk, teknis, desain/testing, workflow).
- Out of scope: implementasi fitur.

### Acceptance criteria
- [ ] Setiap item §16 tercentang, atau tercatat sebagai blocker/`Deferred` dengan owner.
- [ ] Exit criteria PHASE 0 (guide §7) terpenuhi.
- [ ] Pemilik menyetujui masuk ke PHASE 1.

### Verification
- [ ] Tinjauan bersama; catat tanggal dan hasil. Perbarui status ringkas di bagian 1.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## 6. PHASE 1 — Foundation, Auth, Public Website & CMS

**Tujuan:** fondasi aplikasi dapat dijalankan dan konten bisnis publik dapat dikelola dengan izin yang benar.
**Exit criteria:** Owner yang berwenang dapat login, mengelola konten MVP, melihat perubahan pada public website, dan pengguna tanpa izin tidak dapat mengakses/mengubah data admin. Migration dapat direproduksi dan test terkait lulus.

Semua task Phase 1 `Blocked` sampai TITIS-014 selesai. Perintah verifikasi memakai **script yang benar-benar ada di `package.json`**; jangan menulis atau mengklaim command yang belum dicoba.

---

## [TITIS-101] Scaffold aplikasi dan runtime
- Status: Blocked | Phase: 1 | Depends on: TITIS-014
- Scope: buat proyek sesuai `ARCHITECTURE.md`; package manager dan runtime mengikuti DEC-015 (usulan: npm dan `.nvmrc`; periksa jadwal rilis Node.js terbaru sebelum mengunci versi); tambah `.editorconfig`.
- Out of scope: fitur, styling final.
- Prasyarat keputusan: DEC-001, DEC-013, DEC-015, DEC-018 berstatus `Accepted`.

### Acceptance criteria
- [ ] Aplikasi dasar berjalan lokal.
- [ ] Versi runtime dan package manager tercatat; lockfile di-commit.
- [ ] Script untuk dev, build, type-check, lint, dan test tersedia dan dicatat apa adanya.

### Verification
- [ ] Clone bersih, instal, jalankan setiap script; catat hasil aktual.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-102] Tailwind CSS v4 dan design tokens
- Status: Blocked | Phase: 1 | Depends on: TITIS-101, TITIS-009
- Scope: konfigurasi Tailwind v4 dengan satu pola konsisten; terapkan tokens dari `DESIGN.md`.
- Out of scope: library UI tambahan tanpa persetujuan.
- Prasyarat keputusan: DEC-004 berstatus `Accepted`.

### Acceptance criteria
- [ ] Tokens (warna, tipografi, spacing, radius) terkonfigurasi sesuai `DESIGN.md`.
- [ ] Contoh komponen dasar menampilkan tokens dengan benar.

### Verification
- [ ] Build lulus; cek visual terhadap referensi di `docs/design/references/`.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-103] Lingkungan development Supabase
- Status: Blocked | Phase: 1 | Depends on: TITIS-101, TITIS-004
- Scope: siapkan Supabase CLI dan `config.toml`, proyek development, klien Supabase di frontend, dan `.env.example`.
- Out of scope: tabel dan policy (TITIS-104, 108).
- Prasyarat keputusan: DEC-016 berstatus `Accepted` (nama kunci publik mengikuti DEC-016).

### Acceptance criteria
- [ ] Aplikasi terhubung ke Supabase development.
- [ ] `.env.example` hanya berisi nama variabel dan placeholder kosong; nama sesuai klien yang benar-benar dipakai.
- [ ] Tidak ada `service_role` atau secret lain di variabel `VITE_*`, source, atau file yang di-commit; `.env` diabaikan Git.

### Verification
- [ ] Periksa source dan file yang ter-track untuk secret; catat hasilnya.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-104] Migration awal
- Status: Blocked | Phase: 1 | Depends on: TITIS-103, TITIS-007
- Scope: tabel fondasi sesuai `DATABASE.md` yang dibutuhkan Phase 1 saja (profil/role, konten situs, pengaturan).
- Out of scope: tabel booking, POS, dan pembayaran.
- Prasyarat keputusan: DEC-009 dan DEC-016 berstatus `Accepted`; OPEN-013 berstatus `Decided`.

### Acceptance criteria
- [ ] Migration ada di Git dan berjalan dari basis bersih.
- [ ] Constraint dan foreign key sesuai `DATABASE.md`.
- [ ] Tidak ada perubahan manual pada database remote di luar migration.

### Verification
- [ ] Reset database development lalu terapkan ulang seluruh migration; catat hasil.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-105] Generated database types (bila dipakai)
- Status: Blocked | Phase: 1 | Depends on: TITIS-104
- Scope: hasilkan tipe dari skema bila `ARCHITECTURE.md` memutuskan memakainya; tulis prosedur sinkronisasi.
- Out of scope: tipe buatan tangan yang menyimpang dari database.
- Prasyarat keputusan: DEC-010 berstatus `Accepted`.

### Acceptance criteria
- [ ] Tipe dihasilkan dari skema yang berlaku dan dipakai di klien.
- [ ] Prosedur memperbarui tipe setelah migration tertulis.
- [ ] Task ini `Deferred` bila arsitektur memutuskan tidak memakai tipe hasil generate.

### Verification
- [ ] Type-check lulus setelah sinkronisasi.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-106] Routing, layout public/admin, dan state dasar
- Status: Blocked | Phase: 1 | Depends on: TITIS-102, TITIS-004
- Scope: layout public dan admin terpisah yang berbagi design system; rute sesuai `ARCHITECTURE.md`.
- Out of scope: konten dan fitur halaman.
- Prasyarat keputusan: DEC-002, DEC-005, DEC-011, DEC-019 berstatus `Accepted`.

### Acceptance criteria
- [ ] Layout public dan admin berjalan; halaman not-found tersedia.
- [ ] State loading, empty, error, dan permission-denied tersedia.
- [ ] Navigasi dapat dipakai dengan keyboard; layout responsif.
- [ ] Refresh pada rute dalam tidak menghasilkan error (secara lokal).

### Verification
- [ ] Cek manual desktop dan viewport mobile; test komponen untuk state.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-107] Autentikasi Owner/Staff
- Status: Blocked | Phase: 1 | Depends on: TITIS-104, TITIS-106
- Scope: login, logout, session; jalur pembuatan akun Owner pertama dan Staff sesuai keputusan produk.
- Out of scope: otorisasi data (TITIS-108).
- Prasyarat keputusan: DEC-003 dan DEC-016 berstatus `Accepted`; OPEN-018 berstatus `Decided`.

### Acceptance criteria
- [ ] Login, logout, dan session expiry berfungsi.
- [ ] Akun Owner pertama dibuat lewat jalur aman yang terdokumentasi; pendaftar tidak dapat memilih role sendiri.
- [ ] Halaman admin menolak pengguna tanpa sesi.

### Verification
- [ ] Cek manual dan test untuk alur login/logout/redirect.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-108] Otorisasi data dan RLS (profil, konten)
- Status: Blocked | Phase: 1 | Depends on: TITIS-104, TITIS-107, TITIS-008
- Scope: RLS dan policy untuk semua tabel yang diakses client di Phase 1, sesuai matriks `SECURITY.md`.
- Out of scope: policy untuk booking dan POS.
- Prasyarat keputusan: DEC-016 berstatus `Accepted`; OPEN-001 dan OPEN-006 berstatus `Decided`.

### Acceptance criteria
- [ ] RLS aktif pada setiap tabel client-facing Phase 1.
- [ ] Staff tidak dapat menaikkan role sendiri; role tidak dapat diubah lewat update biasa.
- [ ] Publik hanya dapat membaca konten yang memang boleh dipublikasikan.
- [ ] Menyembunyikan menu di UI tidak dianggap pengamanan; akses ditolak pada query langsung.

### Verification
- [ ] Tes akses sebagai anonymous, Staff, dan Owner (query langsung, bukan lewat UI), termasuk kasus yang harus ditolak. Catat hasil aktual.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-109] CMS minimum
- Status: Blocked | Phase: 1 | Depends on: TITIS-108
- Scope: pengelolaan konten MVP di dashboard sesuai PRD.
- Out of scope: website builder bebas, fitur di luar PRD.
- Prasyarat keputusan: DEC-014 berstatus `Accepted`; OPEN-001, OPEN-006, OPEN-021 berstatus `Decided`.

### Acceptance criteria
- [ ] Pengguna yang berwenang dapat mengubah konten MVP; input divalidasi.
- [ ] Perubahan tampil di public website.
- [ ] Loading, error, dan empty state tersedia; hak akses sesuai PRD (misalnya apakah Staff boleh mengedit).

### Verification
- [ ] Uji manual alur dari edit sampai tampil di publik; test komponen untuk validasi.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-110] Halaman public website MVP dan SEO
- Status: Blocked | Phase: 1 | Depends on: TITIS-109, TITIS-006, TITIS-009
- Scope: halaman publik sesuai PRD dan keputusan SEO.
- Out of scope: form booking (Phase 2).
- Prasyarat keputusan: DEC-011 berstatus `Accepted`; OPEN-006 dan OPEN-015 berstatus `Decided`.

### Acceptance criteria
- [ ] Halaman sesuai PRD dan referensi desain; responsif.
- [ ] Metadata, URL, dan sitemap/indexing sesuai keputusan TITIS-006.
- [ ] Aksesibilitas dasar: struktur heading, label, kontras, fokus.

### Verification
- [ ] Cek responsif, periksa metadata pada hasil build, audit aksesibilitas manual.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-111] Deploy Phase 1 ke environment yang diputuskan di TITIS-005
- Status: Blocked | Phase: 1 | Depends on: TITIS-110, TITIS-005
- Scope: deploy ke environment yang disepakati; konfigurasi env var lewat mekanisme provider.
- Out of scope: domain produksi final bila belum diputuskan. Deploy yang memengaruhi pengguna nyata butuh persetujuan eksplisit.
- Prasyarat keputusan: DEC-012 berstatus `Accepted`; OPEN-014 berstatus `Decided`.

### Acceptance criteria
- [ ] Build berasal dari commit yang diketahui.
- [ ] Auth redirect URL dan URL publik sesuai konfigurasi.
- [ ] Refresh pada rute dalam tidak menghasilkan 404 (fallback SPA bekerja).
- [ ] Tidak ada secret di bundle.

### Verification
- [ ] Smoke test di URL deploy: login, halaman publik, edit konten. Periksa console tanpa menampilkan secret.
- [ ] Catat commit, waktu rilis, hasil, dan masalah yang diketahui.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-112] README setup diverifikasi
- Status: Blocked | Phase: 1 | Depends on: TITIS-101, TITIS-103, TITIS-104, TITIS-111
- Scope: lengkapi `README.md` dengan prasyarat, env, migrasi, command, testing, dan deployment yang sudah dicoba.
- Out of scope: menulis hal yang belum diverifikasi.

### Acceptance criteria
- [ ] Setiap perintah di README sudah dijalankan dari clone bersih.
- [ ] Bagian yang belum terverifikasi tetap bertanda "belum tersedia".

### Verification
- [ ] Ikuti README dari awal di sesi atau mesin bersih tanpa bantuan lisan; catat hambatan.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-113] CI minimal (type-check, lint, test, build)
- Status: Blocked | Phase: 1 | Depends on: TITIS-101, TITIS-108
- Scope: buat `.github/workflows/ci.yml` yang menjalankan script yang sama dengan lokal (type-check, lint, test, build). Test database dan pemeriksaan selisih tipe ter-generate ditambahkan bila TITIS-105 dan test RLS (TITIS-108) sudah dapat dijalankan di CI.
- Out of scope: e2e dan deploy otomatis (TITIS-403, TITIS-404).
- Prasyarat keputusan: DEC-015 berstatus `Accepted`.

### Acceptance criteria
- [ ] Workflow hanya memanggil script yang benar-benar ada di `package.json`; tidak ada step untuk script yang tidak ada.
- [ ] Workflow lulus pada commit yang diketahui; hasil dicatat.
- [ ] Tidak ada secret di file workflow atau log; tidak ada deploy ke production dari workflow ini.

### Verification
- [ ] Jalankan script yang sama secara lokal dan bandingkan hasilnya dengan CI. Mendorong (push) branch uji ke remote memerlukan izin eksplisit pemilik (`AGENTS.md` §3.2).

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## [TITIS-114] Exit review PHASE 1
- Status: Blocked | Phase: 1 | Depends on: TITIS-101 sampai TITIS-113
- Scope: buktikan exit criteria Phase 1.
- Out of scope: pekerjaan Phase 2.

### Acceptance criteria
- [ ] Owner dapat login, mengelola konten MVP, dan perubahan tampil di public website.
- [ ] Pengguna tanpa izin tidak dapat mengakses atau mengubah data admin (terbukti lewat tes).
- [ ] Migration dapat direproduksi dan test terkait lulus.

### Verification
- [ ] Rangkum bukti dari task Phase 1; perbarui status ringkas di bagian 1 dan status tingkat tinggi di guide.

### Evidence
- Hasil aktual / file / commit / blocker: _belum ada_

---

## 7. PHASE 2–4 — Daftar Ringkas

Semua `Blocked` sampai fase sebelumnya selesai. Setiap task di-expand ke format lengkap (bagian 4) saat fasenya menjadi aktif. Exit criteria tiap fase ada di `TITIS_MASTER_BUILD_GUIDE_FINAL.md` §7. Kolom "Prasyarat keputusan" memetakan OPEN (`PRD.md` §8) dan DEC (`ARCHITECTURE.md` §3) yang harus `Decided`/`Accepted` sebelum task dimulai.

### PHASE 2 — Booking & Resource Scheduling

| ID | Judul | Depends on | Prasyarat keputusan |
|---|---|---|---|
| TITIS-201 | Finalisasi model booking sesuai OPEN-007 s.d. 009 dan OPEN-019/020: resource, durasi, zona waktu (mengikuti OPEN-013), status, buffer, aturan bentrok, expiry | TITIS-114 | OPEN-007, 008, 009, 019 |
| TITIS-202 | Migration booking dan resource, termasuk pencegahan bentrok di database | TITIS-201 | DEC-007; OPEN-009, 020 |
| TITIS-203 | Jalur publik yang aman (RPC atau Edge Function sesuai arsitektur); status awal dipaksa sistem | TITIS-202 | DEC-006, DEC-017 |
| TITIS-204 | Form booking publik (validasi client untuk UX, state loading/sukses/error) | TITIS-203 | OPEN-007, 020 |
| TITIS-205 | Dashboard booking Owner/Staff: lihat, konfirmasi, tolak, ubah status sesuai izin | TITIS-202 | OPEN-002, 008 |
| TITIS-206 | Proteksi spam/abuse untuk form publik | TITIS-203 | DEC-017 |
| TITIS-207 | Pembatalan, reschedule, dan expiry (bila masuk scope PRD) | TITIS-205 | OPEN-008 |
| TITIS-208 | Test: anonymous/Staff/Owner, concurrency overlap, batas interval, input tidak valid, kegagalan request | TITIS-203, TITIS-205, TITIS-206 | — |
| TITIS-209 | Deploy dan smoke test booking | TITIS-208 | DEC-012 |
| TITIS-210 | Exit review PHASE 2 | TITIS-209 | — |

Inti exit criteria: aturan overlap tidak bergantung pada pemeriksaan UI; tidak ada jalur yang memungkinkan pengunjung mengonfirmasi booking sendiri.

### PHASE 3 — POS, Manual Payments & Sales Insight

| ID | Judul | Depends on | Prasyarat keputusan |
|---|---|---|---|
| TITIS-301 | Finalisasi aturan harga, diskon, pajak, dan pembulatan sesuai OPEN-003, -010, -011 (mata uang mengikuti OPEN-013) | TITIS-114 | OPEN-003, 010, 011, 012 |
| TITIS-302 | Katalog produk/layanan (skema, pengelolaan, RLS) | TITIS-301 | OPEN-010 |
| TITIS-303 | Skema order, item (snapshot harga), dan pembayaran | TITIS-302 | DEC-009; OPEN-010, 011 |
| TITIS-304 | Checkout atomik dengan validasi total di sisi tepercaya | TITIS-303 | DEC-008, DEC-009 |
| TITIS-305 | Perlindungan double-submit/retry (idempotency atau setara) | TITIS-304 | DEC-008 |
| TITIS-306 | Pembayaran manual: DP, pelunasan, dan saldo tanpa hitung ganda | TITIS-303, TITIS-304 | OPEN-004, 011 |
| TITIS-307 | Void/refund/koreksi dengan jejak audit (bila masuk scope PRD) | TITIS-306 | OPEN-010, 011 |
| TITIS-308 | UI POS: keranjang, checkout, struk sederhana dari browser, riwayat transaksi | TITIS-304, TITIS-305, TITIS-306 | OPEN-010 |
| TITIS-309 | Sales Insight: definisi metrik terdokumentasi, SQL view/function | TITIS-304, TITIS-306, TITIS-307 | OPEN-005, 012 |
| TITIS-310 | Test: transaksi gagal di tengah proses, manipulasi harga, double-submit, DP+pelunasan, pembatalan, rekonsiliasi dengan fixture hitungan manual | TITIS-304 s.d. 309 | — |
| TITIS-311 | Deploy dan smoke test POS | TITIS-310 | — |
| TITIS-312 | Exit review PHASE 3 | TITIS-311 | — |

Inti exit criteria: checkout gagal dengan aman tanpa data parsial; total dan saldo konsisten; laporan dapat direkonsiliasi.

### PHASE 4 — Hardening, Release & Open-Source Readiness

| ID | Judul | Depends on | Prasyarat keputusan |
|---|---|---|---|
| TITIS-401 | Review keamanan semua tabel, function, dan jalur publik (anonymous/Owner/Staff) | TITIS-312 | — |
| TITIS-402 | Migration dari basis bersih + seed demo sintetis | TITIS-312 | — |
| TITIS-403 | Perluas CI dari TITIS-113: test database, e2e, dan pemeriksaan lain — hanya dari script yang benar-benar ada | TITIS-113, TITIS-402 | DEC-015 |
| TITIS-404 | Tes e2e alur kritis: login, edit konten, booking, konfirmasi/penolakan, checkout, pembayaran, laporan | TITIS-312 | DEC-013 (alat E2E) |
| TITIS-405 | Responsif, keyboard/focus, dan aksesibilitas | TITIS-312 | DEC-013 (alat a11y) |
| TITIS-406 | Backup dan pemulihan: dokumentasi dan simulasi aman | TITIS-402 | — |
| TITIS-407 | Audit lisensi dan atribusi dependency/aset (font, ikon, gambar) | TITIS-312 | — |
| TITIS-408 | Dokumen kontribusi dan pelaporan kerentanan: `CONTRIBUTING.md`, `SECURITY.md` root, `CHANGELOG.md` bila mulai merilis | TITIS-407 | — |
| TITIS-409 | README final: setup, env, migrasi, testing, deployment, known limitations | TITIS-401 s.d. 406 | — |
| TITIS-410 | Prosedur rilis, rollback, persetujuan, dan known issues | TITIS-409 | DEC-012; OPEN-014 |
| TITIS-411 | Review rilis dan persetujuan pemilik | TITIS-410 | — |

Inti exit criteria: rilis dapat dibuat ulang dari repository dengan instruksi yang diuji; tidak ada temuan keamanan blocker; pemilik menyetujui rilis.

---

## 8. Parking Lot — Di Luar MVP / Ditunda

Tidak dikerjakan kecuali scope diubah secara sengaja, dengan dampak yang disetujui dan dicatat.

| ID | Item | Status | Syarat untuk dipertimbangkan |
|---|---|---|---|
| TITIS-901 | Payment gateway dan webhook pembayaran | Deferred | MVP stabil; ada kebutuhan nyata dari pengguna pilot; rencana sandbox, verifikasi webhook, dan idempotency |
| TITIS-902 | Stok sederhana per produk (direct stock) | Deferred | Ada kebutuhan nyata; keputusan skema dan dampak ke checkout |
| TITIS-903 | Inventaris berbasis resep, supplier, purchase order | Deferred | Di luar MVP; butuh revisi PRD |
| TITIS-904 | Multi-tenant SaaS dan billing langganan | Deferred | Permintaan berulang dari beberapa bisnis |
| TITIS-905 | POS offline | Deferred | Kebutuhan nyata dari pengguna pilot |
| TITIS-906 | README bahasa Inggris | Deferred | Menjelang rilis publik |
| TITIS-907 | Demo publik dengan akun terbatas | Deferred | Setelah TITIS-401; environment dan akun khusus, tanpa credential nyata |

---

## 9. Pertanyaan Terbuka

Catat pertanyaan yang memengaruhi data, keamanan, alur pengguna, atau arsitektur. Hentikan implementasi terkait sampai terjawab.

| # | Pertanyaan | Owner | Task terdampak | Status |
|---|---|---|---|---|
| Q-01 | Hosting: apakah Cloudflare sudah menjadi keputusan pemilik? Draf lama menyebutnya tanpa DEC-012 / OPEN-014. Bila ya, catat sebagai usulan dan pilih Workers static assets atau Pages. | Pemilik proyek | TITIS-005, TITIS-111 | Open |
| Q-02 | `DATABASE.md`, `SECURITY.md`, `TESTING.md`, dan `DESIGN.md` belum ikut diperiksa silang (tidak tersedia pada review 2026-10-10); rujukan pasal dan ID `TEST-*`/`THR-*`/`INV-*` ke dokumen itu belum terverifikasi. | Pemilik proyek | TITIS-012 | Open |
| Q-03 | OPEN-019, OPEN-020, OPEN-021 (komunikasi hasil booking, data pribadi pengunjung, bahasa) ditambahkan sebagai usulan review. Setujui, ubah, atau tolak. | Pemilik proyek | TITIS-003 | Open |
| Q-04 | Perubahan rencana kerja dari review 2026-10-10 (TITIS-113 CI minimal, dependensi TITIS-004/006/007/012/208/306/308/309/403) disetujui? | Pemilik proyek | TITIS-004, 006, 007, 012, 113 | Open |

---

## 10. Log Perubahan TASK.md

| Tanggal | Perubahan |
|---|---|
| 2026-10-10 | TASK.md dibuat. Phase 0 dan Phase 1 ditulis lengkap; Phase 2–4 berupa daftar ringkas. |
| 2026-10-10 | Review konsistensi pendahuluan oleh AI (bukan pengganti TITIS-012; mencakup guide, PRD, ARCHITECTURE, AGENTS, TASK): ID task di PRD/ARCHITECTURE disesuaikan ke penomoran file ini; urutan dependensi TITIS-004/006/007/012 diperbaiki; TITIS-005 dan TITIS-111 tidak lagi mengasumsikan Cloudflare; kolom "Prasyarat keputusan" ditambahkan; TITIS-113 (CI minimal) ditambahkan dan exit review Phase 1 menjadi TITIS-114; dependensi TITIS-208, 306, 308, 309, 403 diperketat. Menunggu persetujuan pemilik (lihat Q-04). |
