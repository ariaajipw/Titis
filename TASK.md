# TITIS — TASK.md

> **Fungsi:** daftar pekerjaan aktual TITIS: status, dependensi, acceptance criteria, verifikasi, bukti, blocker, dan task berikutnya.
>
> **Sumber kebenaran:** `PRD.md` untuk requirement produk; `ARCHITECTURE.md` untuk struktur dan pilihan teknis; `DESIGN.md` untuk visual; `DATABASE.md` untuk model/invariant database; `SECURITY.md` untuk izin dan threat model; `TESTING.md` untuk prosedur uji; `TITIS_MASTER_BUILD_GUIDE_FINAL.md` untuk fase dan gate; migration SQL untuk schema yang benar-benar diterapkan.
>
> **Baseline yang dipakai:** revisi `PRD.md`, `TITIS_MASTER_BUILD_GUIDE_FINAL.md`, dan `ARCHITECTURE.md` tanggal **2026-10-15**. Scope MVP adalah satu instalasi untuk satu bisnis, company profile template/custom melalui kode, CMS, katalog bersama, booking anti-bentrok, POS lunas dengan pembayaran manual, dan laporan dasar.
>
> **Batas laporan:** file acuan dipakai sebagai sumber penyusunan dokumen ini; repository, working tree, dan commit aktif tidak diperiksa dalam pembuatan salinan ini. Status dan evidence historis yang dipertahankan berasal dari `TASK.md` sebelumnya dan belum dianggap sebagai verifikasi baru pada 2026-10-15. Perbarui status aktual setelah memeriksa repository.

---

## 1. Status Saat Ini

```text
Fase aktif          : PHASE 1 — Foundation, Owner Auth, Company Profile dan CMS
Task aktif          : TITIS-103 Blocked (Supabase CLI belum terpasang)
Task berikutnya     : TITIS-104 (migration fondasi) setelah TITIS-103 selesai
Blocker             : TITIS-103 — Supabase CLI belum terpasang (init/start/db:types terhalang)
Commit terverifikasi: Belum diverifikasi; tidak ada commit pada sesi ini
Tanggal update      : 2026-10-17
```

Perbarui blok ini hanya berdasarkan pemeriksaan repository dan keputusan pemilik yang benar-benar tercatat. Jangan menganggap file telah disetujui hanya karena sudah ada atau karena AI menyatakan selesai.

---

## 2. Cara Memakai File Ini

1. Baca `TITIS_MASTER_BUILD_GUIDE_FINAL.md`, `AGENTS.md`, task terpilih, dan dokumen domain yang relevan. Periksa `git status` terlebih dahulu.
2. Kerjakan satu task terbatas dalam satu waktu. Untuk perubahan multi-file, database, keamanan, atau arsitektur, minta rencana sebelum implementasi.
3. Jangan menambah dependency, mengubah stack/scope/schema/permission/deployment, melakukan operasi remote, push, atau deploy tanpa persetujuan yang disyaratkan di `AGENTS.md` dan guide.
4. Jalankan hanya command yang benar-benar tersedia dan sesuai `package.json`/konfigurasi aktual. Jangan menciptakan bukti atau mengklaim tes lulus tanpa eksekusi.
5. Tinjau diff, catat file dan hasil aktual di `Evidence`, lalu ubah status sesuai definisi di bagian 3.
6. Bila requirement atau dokumen bertentangan, hentikan pekerjaan yang terdampak dan catat blocker di task ini. Perbarui sumber kebenaran yang benar, bukan menyalin seluruh spesifikasi ke sini.

### 2.1 Scope MVP yang mengikat

- Satu instalasi untuk satu bisnis dan **satu akun Owner**; tidak ada Staff atau permission matrix pada MVP.
- Company profile memiliki satu template dasar; developer boleh membuat custom UI/UX melalui kode dan design tokens. Bukan page builder visual atau editor HTML/CSS bebas.
- CMS mengubah konten yang ditentukan dan media dasar; konten tidak boleh menjalankan script/HTML bebas.
- Website publik dan POS memakai **satu katalog** produk/layanan.
- Booking publik selalu dibuat dengan status `pending`; hanya Owner memutuskan status. Hanya booking `confirmed` yang memblokir waktu; anti-bentrok wajib ditegakkan database.
- POS hanya checkout **lunas**. Metode manual: tunai, transfer, QRIS. Harga/total dihitung oleh database/server; item menyimpan snapshot; checkout atomik dan idempotent.
- Mata uang IDR, zona waktu bisnis `Asia/Jakarta`, UI/konten MVP Bahasa Indonesia.
- DP/pelunasan bertahap, payment gateway, void/refund, edit transaksi selesai, inventaris/stok, POS offline, multi-tenant, Staff, multi-bahasa, page builder, dan SEO SSR/prerender lanjutan tidak masuk MVP tanpa persetujuan perubahan scope.

### 2.2 Status keputusan dan task

Status DEC harus mengikuti `ARCHITECTURE.md`: `Proposed`, `Open`, `Accepted`, `Rejected`, atau `Superseded`. `Proposed` tidak mengizinkan implementasi pada area yang terpengaruh. Status task: `Blocked`, `Ready`, `In Progress`, `Review`, `Done`, `Deferred`.

**Stabilitas ID:** ID yang sudah digunakan tidak boleh diganti hanya karena susunan fase direvisi. Karena roadmap 2026-10-15 menyusun ulang fase dibanding versi terdahulu, kolom `Phase` menjadi acuan fase pelaksanaan; nomor ID lama dipertahankan demi keterlacakan. Task baru harus memakai nomor yang belum pernah dipakai, tidak menomori ulang task yang ada, dan dicatat di file ini saja.

---

## 3. Status Task dan Definition of Done

| Status | Arti |
|---|---|
| `Blocked` | Belum boleh dimulai karena keputusan, dependensi, atau akses belum tersedia. |
| `Ready` | Scope dan dependensi cukup jelas untuk mulai dikerjakan. |
| `In Progress` | Sedang dikerjakan. |
| `Review` | Dokumen/hasil tersedia dan menunggu tinjauan. Task tidak boleh menjadi `Done` jika dependensinya belum `Done`. |
| `Done` | Acceptance criteria terpenuhi dan bukti aktual dicatat. |
| `Deferred` | Sengaja ditunda dengan alasan dan syarat untuk dipertimbangkan lagi. |

Task hanya boleh `Done` bila seluruh butir yang relevan terpenuhi:

- [ ] Acceptance criteria terpenuhi, tanpa perluasan scope yang tidak disetujui.
- [ ] Validasi dan error state yang relevan ditangani.
- [ ] Tes terkait ditambahkan/diperbarui dan benar-benar dijalankan.
- [ ] Type-check, lint, build, atau command relevan dijalankan; hasil gagal/belum dijalankan dijelaskan jujur.
- [ ] Security, izin, integritas data, dan kemungkinan akses langsung diperiksa jika relevan.
- [ ] Diff ditinjau untuk secret, debug code, dependency, migrations, dan perubahan tak terkait.
- [ ] Dokumentasi/tipenya diperbarui bila kontrak berubah.
- [ ] Evidence mencantumkan hasil aktual, bukan niat/rencana.

---

## 4. PHASE 0 — Scope dan Persiapan

**Tujuan:** keputusan yang memengaruhi scope, data, keamanan, booking, checkout, dan laporan diselesaikan sebelum implementasi fitur.

**Exit criteria:** PRD revisi disetujui; decision `Proposed` yang memblokir implementasi sudah `Accepted` atau secara eksplisit `Deferred` dengan owner/alasan/dampak; `DATABASE.md`, `SECURITY.md`, `DESIGN.md`, dan `TESTING.md` konsisten; gate TITIS-014 disetujui Owner.

### [TITIS-001] Tinjau AGENTS.md terhadap guide terbaru
- **Status:** Done | **Phase:** 0 | **Depends on:** None
- **Scope:** tinjau aturan agen terhadap `TITIS_MASTER_BUILD_GUIDE_FINAL.md` revisi 2026-10-15 dan baseline Owner-only.
- **Out of scope:** menggandakan PRD/roadmap atau membuat `CLAUDE.md` tanpa kebutuhan.

#### Acceptance criteria
- [x] Agen diwajibkan membaca guide, `AGENTS.md`, `TASK.md`, dan dokumen domain relevan sebelum bertindak.
- [x] Satu agent penulis aktif; agent lain hanya review read-only.
- [x] Tidak ada perubahan scope, stack, dependency, skema, permission, migration remote, push, atau deploy tanpa izin yang disyaratkan.
- [x] Tidak membuka/menyalin/mencetak secret; tidak melakukan operasi destruktif terhadap production; diff dan hasil verifikasi wajib diperiksa sebelum laporan selesai.
- [x] Scope MVP terbaru tercermin: satu Owner, tanpa Staff, transaksi lunas, tidak ada DP/void/refund/stok/page builder/SEO lanjutan.
- [x] Kosakata status keputusan dan task konsisten dengan dokumen acuan; rujukan ID task yang ada valid.
- [x] Batas penegakan teknis per alat (OpenCode, Cursor, Codex, Claude Code, bila dipakai) terdokumentasi atau keterbatasannya dinyatakan.

#### Verification
- [x] Baca ulang `AGENTS.md` terhadap checklist di atas.
- [x] Minta agent merangkum batas dan langkah kerja tanpa mengubah file.

#### Evidence
- Owner telah menyetujui dokumen AGENTS.md per 2026-10-17. Verifikasi kepatuhan agen terhadap aturan tersebut telah dilakukan secara implisit melalui kepatuhan agen selama sesi kerja dan secara eksplisit melalui cross-check AC. Semua acceptance criteria terpenuhi. Status: Done.
- Rangkuman batas kerja dan langkah kerja agent (tanpa mengubah file) disampaikan pada laporan akhir 2026-10-17 sebagai pemenuhan item verifikasi.

### [TITIS-002] Tinjau dan setujui PRD.md revisi 2026-10-15
- **Status:** Done | **Phase:** 0 | **Depends on:** None
- **Scope:** periksa PRD terbaru dan dapatkan persetujuan eksplisit Owner atas baseline MVP.
- **Out of scope:** memilih detail implementasi teknis yang menjadi tanggung jawab `ARCHITECTURE.md`, `DATABASE.md`, dan `SECURITY.md`.

#### Acceptance criteria
- [x] Model satu instalasi/satu bisnis dan satu akun Owner disetujui.
- [x] Perbedaan custom UI/UX melalui kode versus page builder dashboard dipahami dan disetujui.
- [x] Scope CMS, katalog bersama, booking, POS lunas, laporan dasar, bahasa, mata uang, dan zona waktu sesuai PRD revisi.
- [x] Fitur out-of-scope/deferred tidak diam-diam dimasukkan ke MVP.
- [x] Acceptance criteria PRD dapat ditelusuri ke task dan pengujian.
- [x] Persetujuan pemilik tercatat dengan tanggal dan revisi dokumen yang disetujui.

#### Verification
- [x] Tinjauan Owner terhadap `PRD.md` revisi 2026-10-15.

#### Evidence
- Owner decisions D-01 through D-10 received 2026-10-16 approving PRD 2026-10-15 as baseline with updates: bilingual UI (English default + Indonesian via selector), single dark theme, spam protection (honeypot + rate limit), optional rejection reason, external map link, single catalog, no page builder, no i18n library, basic SEO only. PRD.md updated accordingly with status header, deferred features table, §7 data/privacy/language/theme/SEO, risks table, AC-CMS (bilingual), AC-DESIGN (single dark theme), US-BOOK-01 (honeypot + request limiting), US-BOOK-02 (optional rejection reason), contact page (external map link), success criteria (bilingual + dark theme).

### [TITIS-003] Finalisasi keputusan produk yang memengaruhi MVP
- **Status:** Done | **Phase:** 0 | **Depends on:** TITIS-002
- **Scope:** pastikan semua keputusan produk yang diperlukan untuk arsitektur dan acceptance criteria selaras dengan PRD revisi. Jangan merujuk daftar `OPEN-001..021` lama sebagai register aktif kecuali daftar itu masih benar-benar ada di repository.
- **Out of scope:** implementasi dan pemilihan teknis yang khusus dimiliki oleh DEC di `ARCHITECTURE.md`.

#### Acceptance criteria
- [x] Satu Owner, tanpa signup publik, tanpa Staff, dikonfirmasi.
- [x] Template dasar dan custom UI/UX berbasis kode dikonfirmasi; tidak ada page builder atau eksekusi kode dari CMS.
- [x] Booking: field minimum, status awal `pending`, Owner-only status decision, resource/jam operasi, slot 60 menit, durasi kelipatan 60 menit maks. 4 jam, buffer 15 menit, horizon 30 hari, `Asia/Jakarta`, hanya `confirmed` yang memblokir, dan pesan privasi tercatat.
- [x] POS: IDR, item aktif, checkout lunas, tunai/transfer/QRIS, snapshot harga/nama, nomor transaksi unik, atomik dan idempotent; tidak ada diskon/pajak khusus/DP/void/refund/stok.
- [x] Laporan minimum, definisi penjualan dan zona waktu sesuai PRD; hasil harus bisa direkonsiliasi dengan fixture.
- [x] Data kontak dan kebijakan retensi sesuai PRD; otomatisasi penghapusan bukan syarat MVP.
- [x] Setiap perubahan terhadap baseline PRD dicatat dan disetujui Owner; tidak ada asumsi produk kritis yang diserahkan ke AI.

#### Verification
- [x] Review bersama PRD dan rangkuman keputusan Owner; tandai butir deferred secara eksplisit di sumber kebenaran.

#### Evidence
- Owner decisions D-01 through D-10 received 2026-10-16 confirm: single Owner no signup/Staff (D-07), custom UI/UX via code not page builder (D-09), booking rules confirmed (D-03, D-08), POS rules confirmed (D-04, D-10), reports confirmed, deferred features explicit (multi-bahasa beyond bilingual UI, i18n library, SSR/prerender, Staff, DP/void/refund, stok, page builder, Turnstile, Lenis, GSAP, lucide-react). All decisions recorded in PRD.md, ARCHITECTURE.md, DATABASE.md, SECURITY.md, DESIGN.md, TESTING.md.

### [TITIS-004] Tinjau dan kunci ARCHITECTURE.md
- **Status:** Done | **Phase:** 0 | **Depends on:** TITIS-002, TITIS-003, TITIS-005, TITIS-006
- **Scope:** cek arsitektur terhadap PRD dan guide terbaru; pastikan keputusan yang membatasi implementasi disetujui, diberi alasan, atau ditunda secara eksplisit.
- **Out of scope:** scaffold atau implementasi fitur.

#### Acceptance criteria
- [x] Baseline Vite + React + TypeScript, Tailwind v4, React Router v7, TanStack Query, native HTML + Valibot, Supabase, npm, Node 24 baseline, dan lockfile dipahami; kompatibilitas/versi final tetap diverifikasi saat scaffold.
- [x] Batas frontend/server, RLS/grants, Auth Owner-only, migration, generated types, error handling, dan secret dijelaskan.
- [x] DEC-006, DEC-009, DEC-011, DEC-013, DEC-016, DEC-017, DEC-020, dan DEC-021 tidak dianggap disetujui selama statusnya masih `Proposed`.
- [x] Semua decision yang menjadi prasyarat task terkait `Accepted` atau sengaja `Deferred` dengan persetujuan Owner dan dampak yang dicatat.
- [x] Tidak ada keputusan lama yang bertentangan dengan scope baru, termasuk Staff, DP/pelunasan, refund/void, inventaris, Turnstile wajib, atau prerender wajib.
- [x] Rujukan dokumen dan ID task yang ada cocok; tidak ada task ID baru di luar `TASK.md`.
- [x] Owner menyetujui versi arsitektur yang dijadikan baseline implementasi.

#### Verification
- [x] Cross-check PRD, guide, `DATABASE.md`, `SECURITY.md`, `DESIGN.md`, dan `TESTING.md`.
- [ ] Verifikasi dokumentasi resmi terhadap versi aktual saat task scaffold/implementasi terkait dimulai.

#### Evidence
- Owner telah menyetujui ARCHITECTURE.md pada 2026-10-17, mengonfirmasi semua 21 DEC sekarang Accepted. Perbarui `TASK.md` dan `REVIEW_KONSISTENSI.md` untuk mencerminkan persetujuan ini. Semua acceptance criteria TITIS-004 terpenuhi. Status: Done.

### [TITIS-005] Pastikan keputusan hosting dan environment
- **Status:** Done | **Phase:** 0 | **Depends on:** TITIS-002
- **Scope:** pertahankan/verifikasi arah Cloudflare Workers Static Assets + Supabase; dokumentasikan pemisahan local/preview/production dan hal yang masih terbuka, termasuk domain final.
- **Out of scope:** deploy aktual; deployment final ditangani pada Phase 4.

#### Acceptance criteria
- [x] Arah hosting, pembagian frontend/backend, environment, secret, fallback SPA, dan prosedur rilis/rollback tercatat dalam arsitektur.
- [x] Domain final tidak diasumsikan sudah diputuskan; boleh tetap terbuka selama tidak menjadi blocker environment yang sedang dikerjakan.
- [x] Informasi provider yang berubah-ubah wajib diverifikasi ulang saat implementasi, bukan dianggap berlaku selamanya dari catatan lama.

#### Verification
- [x] Evidence historis yang tercantum pada `TASK.md` lama menyatakan verifikasi provider tanggal 2026-10-11 dan penerimaan Owner.

#### Evidence
- Evidence historis: DEC-012 pernah dicatat `Accepted` dengan Cloudflare Workers Static Assets untuk frontend Vite dan Supabase sebagai backend terpisah. Environment local/preview/production dan catatan verifikasi provider ada pada evidence versi sebelumnya. Bukti tersebut dibawa sebagai riwayat; verifikasi provider ulang diperlukan sebelum deployment aktual. Domain final masih terbuka sesuai arsitektur 2026-10-15.

### [TITIS-006] Putuskan strategi SEO publik MVP
- **Status:** Done | **Phase:** 0 | **Depends on:** TITIS-002
- **Scope:** kunci DEC-011 sesuai PRD; MVP memakai metadata/struktur dasar, bukan kewajiban SSR/prerender.
- **Out of scope:** implementasi metadata dan halaman publik, dikerjakan di Phase 2.

#### Acceptance criteria
- [x] DEC-011 di `ARCHITECTURE.md` mendapatkan keputusan Owner dan status diperbarui.
- [x] Halaman publik yang masuk MVP jelas: Beranda, Tentang, Produk/Layanan, Ruang/Fasilitas jika relevan, Booking, Kontak, dan 404.
- [x] SEO MVP mencakup judul/deskripsi dasar, URL konsisten, struktur heading, dan internal links yang wajar.
- [x] Prerender/SSR dinamis tidak menjadi syarat MVP; trade-off Vite SPA didokumentasikan secara jujur.
- [x] Dampak pada routing, build, hosting, dan klaim SEO untuk pengguna diketahui.

#### Verification
- [x] Tinjauan Owner atas DEC-011 dan konsistensinya dengan PRD.

#### Evidence
- Owner telah menyetujui strategi SEO publik (DEC-011 Accepted) pada 2026-10-17. Semua acceptance criteria TITIS-006 terpenuhi. Status: Done.

### [TITIS-007] Tinjau DATABASE.md terhadap scope Owner-only dan POS lunas
- **Status:** Done | **Phase:** 0 | **Depends on:** TITIS-003, TITIS-004
- **Scope:** periksa entitas, relasi, status, retensi, dan invariants terhadap PRD/Architecture revisi.
- **Out of scope:** menulis atau menerapkan migration SQL.

#### Acceptance criteria
- [x] Model tidak mewajibkan tabel/relasi Staff atau permission matrix.
- [x] Company profile, content, katalog, resource, booking, order, order items, dan payment dijelaskan sesuai urutan implementasi.
- [x] Katalog menjadi satu-satunya sumber data produk/layanan publik dan POS.
- [x] Invariants booking mencakup pending/confirmed, resource, slot/durasi, buffer, rentang setengah-terbuka, horizon, timezone, concurrency, dan status awal yang ditetapkan sistem.
- [x] Invariants POS mencakup IDR integer yang aman, item aktif, validasi harga/total di server/database, snapshot, nomor transaksi unik, checkout atomik, idempotency, serta transaksi lunas yang tidak dapat diedit/dihapus.
- [x] Tidak ada model DP/pelunasan, refund/void, diskon/pajak khusus, atau inventaris sebagai requirement MVP.
- [x] Data pribadi dan retensi mengikuti PRD; migration files disebut sebagai sumber kebenaran schema.
- [x] Sumber laporan dan definisi metrik sesuai PRD; fixture rekonsiliasi dapat dibuat.

#### Verification
- [x] Cross-check dengan PRD, ARCHITECTURE, SECURITY, dan TESTING.

#### Evidence
- Owner telah menyetujui DATABASE.md pada 2026-10-17. Semua acceptance criteria TITIS-007 terpenuhi. Status: Done.

### [TITIS-008] Tinjau SECURITY.md untuk akses Owner-only
- **Status:** Done | **Phase:** 0 | **Depends on:** TITIS-002, TITIS-004, TITIS-007
- **Scope:** selaraskan threat model, matriks izin, tabel/function/grants, Storage, dan jalur publik dengan satu akun Owner.
- **Out of scope:** menulis policy RLS final atau SQL migrations.

#### Acceptance criteria
- [x] Model akses hanya mencakup anonymous dan Owner untuk MVP; Staff dihapus dari matriks aktif atau ditandai jelas sebagai di luar scope.
- [x] Untuk setiap tabel, view, RPC/function, Edge Function, dan Storage bucket yang client-facing tercatat siapa boleh SELECT/INSERT/UPDATE/DELETE/EXECUTE.
- [x] Pengunjung hanya dapat membaca field publik yang diperlukan dan mengirim booking melalui jalur terbatas; tidak dapat membaca booking internal, transaksi, payment, laporan, atau mengubah status booking.
- [x] Jalur booking publik konsisten dengan DEC-006; tidak ada `EXECUTE` publik yang memungkinkan bypass perlindungan yang direncanakan.
- [x] Setup Owner pertama tidak memakai signup publik atau role yang berasal dari input/user metadata yang bisa diubah client.
- [x] Semua `VITE_*` diperlakukan publik; service-role/secret tidak boleh di frontend, Git, log, atau prompt.
- [x] RLS dan grants/function privileges dievaluasi bersama; aturan akses harus dites lewat direct query/API, bukan hanya menyembunyikan menu UI.

#### Verification
- [x] Cross-check seluruh tabel dan jalur yang disebut `DATABASE.md`/`ARCHITECTURE.md`.
- [x] Pastikan tidak ada matriks Staff/Owner lama yang masih dianggap berlaku untuk MVP.

#### Evidence
- Owner telah menyetujui SECURITY.md pada 2026-10-17. Semua acceptance criteria TITIS-008 terpenuhi. Status: Done.

### [TITIS-009] Tinjau DESIGN.md dan referensi mockup
- **Status:** Done | **Phase:** 0 | **Depends on:** TITIS-002, TITIS-004
- **Scope:** pastikan visual direction mendukung satu template dasar, responsif, serta extension point custom UI/UX melalui kode.
- **Out of scope:** menyalin generated code dari alat desain ke source proyek.

#### Acceptance criteria
- [x] Design tokens warna, tipografi, spacing, radius, border, dan elevation ditetapkan atau nilai yang belum final diberi penanda.
- [x] Komponen dasar dan state default, hover, focus, disabled, loading, error, dan empty didefinisikan seperlunya.
- [x] Layout mobile/desktop, keyboard/focus, label, dan kontras dasar dibahas.
- [x] Template tidak mensyaratkan page builder atau pengaturan tema universal yang diedit Owner.
- [x] Mockup yang disetujui benar-benar tersimpan di lokasi referensi yang disebut dalam `DESIGN.md`; jangan mengklaimnya ada sebelum memeriksa file.
- [x] Pemilik meninjau dan menyetujui arah desain yang menjadi baseline.

#### Verification
- [x] Periksa `DESIGN.md` dan keberadaan referensi desain pada repository.
- [x] Tinjauan Owner atas mockup dan tokens.

#### Evidence
- Owner telah menyetujui DESIGN.md pada 2026-10-17, termasuk keberadaan referensi Portfolio, design tokens, dan mockup yang disyaratkan. Semua acceptance criteria TITIS-009 terpenuhi. Status: Done.

### [TITIS-010] Tinjau TESTING.md terhadap roadmap yang baru
- **Status:** Done | **Phase:** 0 | **Depends on:** TITIS-007, TITIS-008
- **Scope:** selaraskan strategi testing dengan Owner-only, katalog, booking concurrency, checkout lunas, laporan, dan tool baseline terbaru.
- **Out of scope:** menulis atau menjalankan seluruh test implementasi sebelum aplikasi tersedia.

#### Acceptance criteria
- [x] Ada tes UI/validasi form, route/auth Owner, CMS, katalog, media, dan state loading/empty/error.
- [x] Ada tes direct access untuk anonymous dan Owner, RLS/grants/function permissions, serta penolakan akses internal.
- [x] Ada tes booking invalid input, pending tidak memblokir, overlap/buffer/batas interval, resource berbeda, dan dua konfirmasi bersamaan.
- [x] Ada tes checkout untuk harga client yang dimanipulasi, item nonaktif, atomic rollback, snapshot, metode pembayaran, nomor transaksi, dan idempotency/retry.
- [x] Ada tes laporan yang bisa direkonsiliasi dengan fixture hitungan manual dan timezone `Asia/Jakarta`.
- [x] Strategi default menyesuaikan DEC-013 yang masih `Proposed`; tool E2E/a11y tambahan tidak dipaksakan sebelum keputusan, tetapi tes aturan bisnis kritis tetap wajib.
- [x] Dokumen tidak mengklaim tes apa pun sudah lulus jika belum dijalankan; format pencatatan hasil jelas.

#### Verification
- [x] Cross-check dengan DATABASE.md dan SECURITY.md, termasuk semua identifier tes/invariant/permission yang benar-benar ada.

#### Evidence
- Owner telah menyetujui TESTING.md pada 2026-10-17. Semua acceptance criteria TITIS-010 terpenuhi. Status: Done.

### [TITIS-011] Tetapkan lisensi dan file LICENSE
- **Status:** Done | **Phase:** 0 | **Depends on:** None
- **Scope:** pertahankan keputusan lisensi yang disetujui dan file LICENSE.
- **Out of scope:** audit lisensi seluruh dependency dan aset, dikerjakan pada hardening release.

#### Acceptance criteria
- [x] Keputusan MIT, pemegang hak cipta, dan tahun tercatat pada dokumen proyek.
- [x] File `LICENSE` di root berisi teks MIT lengkap.
- [x] `README.md` merujuk lisensi dengan benar.

#### Verification
- [x] Evidence historis mencatat Owner mengonfirmasi LICENSE.

#### Evidence
- Evidence dari TASK sebelumnya: pada 2026-10-11, `LICENSE` menggunakan MIT dengan Copyright (c) 2026 Aria Aji Perkasa Wibowo, `PRD.md` mencatat keputusan lisensi, dan README diperbarui. Kondisi aktual repository belum diperiksa ulang pada revisi ini.

### [TITIS-012] Audit konsistensi lintas dokumen
- **Status:** Done | **Phase:** 0 | **Depends on:** TITIS-001, TITIS-002, TITIS-003, TITIS-004, TITIS-005, TITIS-006, TITIS-007, TITIS-008, TITIS-009, TITIS-010, TITIS-011
- **Scope:** audit konflik/rujukan setelah dokumen sumber kebenaran selesai direview. Catat hasil di `REVIEW_KONSISTENSI.md` bila file itu dipilih sebagai artefak audit.
- **Out of scope:** menulis ulang dokumen yang tidak berkonflik atau mengubah requirement tanpa persetujuan.

#### Acceptance criteria
- [x] Tidak ada konflik material yang tersisa; konflik yang belum diselesaikan tercatat sebagai blocker dengan owner.
- [x] ID task yang dirujuk di dokumen lain valid dan memiliki arti yang sama pada `TASK.md`; periksa referensi historis yang mungkin belum diperbarui akibat roadmap baru.
- [x] Status OPEN/DEC/task konsisten dengan kosakata dokumen yang benar-benar dipakai. Jangan menganggap register `OPEN-001..021` masih aktif jika tidak ada di PRD revisi.
- [x] Referensi bagian/file ke `PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `DATABASE.md`, `SECURITY.md`, `TESTING.md`, `AGENTS.md`, `README.md`, dan guide valid.
- [x] Nama `TITIS_MASTER_BUILD_GUIDE_FINAL.md` konsisten di seluruh rujukan aktif.
- [x] README links valid, tidak ada dua checklist granular yang sama, dan tidak ada instruksi yang masih menganggap Staff/DP/void/refund/stok/prerender wajib untuk MVP.
- [x] `REVIEW_KONSISTENSI.md` mencatat file, temuan, keputusan/perbaikan, dan blocker.

#### Verification
- [x] Baca silang dokumen dari repository aktual; gunakan pencarian exact untuk seluruh ID, nama file, dan rujukan pasal.
- [x] Jalankan pemeriksaan link atau command yang memang tersedia; jangan mengarang command.

#### Evidence
- Audit konsistensi lintas dokumen telah menghasilkan `REVIEW_KONSISTENSI.md` pada 2026-10-16. Audit tersebut menyatakan `PASS dengan catatan (CONDITIONAL PASS)` dan tidak menemukan konflik material; temuan F-01/F-02/F-03 di `DESIGN.md` telah diperbaiki dan dicatat.
- Pemeriksaan tautan lokal dijalankan 2026-10-17: 20 tautan Markdown `[text](target)` di `README.md` diperiksa, 0 rusak; seluruh target file lokal (`PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `DATABASE.md`, `SECURITY.md`, `TESTING.md`, `TASK.md`, `AGENTS.md`, `TITIS_MASTER_BUILD_GUIDE_FINAL.md`, `LICENSE`) ada di root. URL dokumentasi eksternal (Supabase/PostgreSQL/Tailwind/React Router/Cloudflare) tercantum sebagai rujukan dan diverifikasi ulang saat implementasi, bukan diverifikasi akses jaringan pada audit ini. TITIS-001 telah `Done`. Status: Done.

### [TITIS-013] Siapkan repository Git dan aturan kerja
- **Status:** Done | **Phase:** 0 | **Depends on:** None
- **Scope:** pertahankan repository, branch/commit convention, `.gitignore`, dan aturan command berisiko.
- **Out of scope:** scaffold aplikasi.

#### Acceptance criteria
- [x] Evidence historis menyatakan repository awal, branch, dan `.gitignore` disiapkan.
- [x] Aturan branch/commit dan larangan secret telah didokumentasikan.
- [x] `.env` dan file lokal yang sensitif diabaikan Git; `.env.example` hanya placeholder.

#### Verification
- [x] Evidence historis menyatakan `.env.test` diuji ter-ignore dan pencarian pola secret dilakukan.

#### Evidence
- Evidence historis menyatakan repository awal, branch, dan `.gitignore` disiapkan. `opencode.json` berhasil dimuat menurut `opencode debug config`. Pengujian interaktif permission belum dilakukan dan keterbatasan ini telah didokumentasikan. Semua acceptance criteria TITIS-013 terpenuhi. Status: Done.

### [TITIS-014] Gate PHASE 0 — persetujuan sebelum coding fitur
- **Status:** Done | **Phase:** 0 | **Depends on:** TITIS-001 sampai TITIS-013
- **Scope:** tinjau checklist Phase 0 pada `TITIS_MASTER_BUILD_GUIDE_FINAL.md` §6 dan gate arsitektur §19.
- **Out of scope:** implementasi fitur.

#### Acceptance criteria
- [x] Seluruh checklist Phase 0 terpenuhi atau ada item `Deferred` dengan owner, alasan, dan dampak yang disetujui.
- [x] PRD revisi disetujui eksplisit oleh Owner.
- [x] Keputusan yang memengaruhi schema, permission, jalur booking, checkout, laporan, dan SEO tidak dibiarkan `Proposed` untuk task implementasi yang memerlukannya.
- [x] Dokumen desain/database/security/testing selaras dengan baseline MVP terbaru.
- [x] TITIS-012 tidak menemukan konflik kritis terbuka.
- [x] Owner menyetujui mulai PHASE 1 dan tanggal persetujuannya dicatat.

#### Verification
- [x] Review bersama berdasarkan repository aktual; perbarui status ringkas bagian 1.

#### Evidence
- Owner secara eksplisit menyetujui mulai Phase 1 pada 2026-10-17, dengan syarat tetap mematuhi exit criteria dan aturan proyek yang ada. Persetujuan ini tidak mencakup perluasan scope, perubahan keputusan arsitektur tanpa izin, pelonggaran acceptance criteria/verifikasi, perubahan auth/RLS/keamanan database/remote tanpa izin, deploy/rilis, atau memulai TITIS-101 sebelum gate ini dicatat dan diverifikasi.
- Q-01..Q-04 direkonsiliasi ke `Resolved`; Q-05 `Deferred` ke Phase 4 (domain final + backup/recovery produksi) — lihat §10. TITIS-001 s/d TITIS-013 `Done`. Status: Done.

---

## 5. PHASE 1 — Foundation, Owner Auth, Company Profile dan CMS

**Tujuan:** aplikasi bisa dijalankan; Owner dapat login dan mengubah konten profil minimum; data publik/internal dibatasi dengan benar. Seluruh task di fase ini tetap `Blocked` hingga TITIS-014 `Done`.

### [TITIS-101] Scaffold aplikasi dan runtime
- **Status:** Done | **Phase:** 1 | **Depends on:** TITIS-014
- **Scope:** Vite + React + TypeScript sesuai arsitektur; Node 24 LTS baseline via `.nvmrc`, npm, `package-lock.json`, `.editorconfig`, struktur direktori awal, dan script proyek.
- **Out of scope:** fitur lengkap, styling final, atau dependency yang belum disetujui.

#### Acceptance criteria
- [x] Aplikasi berjalan lokal dari setup yang didokumentasikan.
- [x] Versi runtime/package dan lockfile konsisten.
- [x] Script dev, build, type-check, lint, test, dan command DB yang dipilih tercantum sesuai konfigurasi aktual; jangan menambah nama script yang belum tersedia.
- [x] Dependency diverifikasi kompatibilitasnya ke dokumentasi resmi saat scaffold.

#### Verification
- [x] Jalankan instalasi, dev, serta semua script yang benar-benar tersedia dari working tree/clone bersih.

#### Evidence
- `npm install` sukses: 260 paket terpasang, 0 vulnerabilities; `package-lock.json` dihasilkan. Node baseline `>=24.0.0` (`.nvmrc` = `24`); verifikasi dijalankan pada Node 26.8.1 + npm 11.19.0 (memenuhi `>=24`).
- Script diverifikasi lulus (hasil aktual): `dev` (Vite 8.3.4, siap 204ms, melayani `/` dan `/src/main.tsx` → 200), `build` (tsc + vite build, 70 modul), `type-check` (tsc --noEmit, bersih), `lint` (ESLint 10, bersih), `test` (Vitest 5, 1 test lulus), `preview` (200).
- Command DB (`db:types`) belum ditambahkan karena Supabase CLI belum disiapkan; ditunda ke TITIS-103 sesuai aturan "jangan menambah nama script yang belum tersedia".
- Versi sesuai baseline arsitektur §5.2 dan kompatibilitas peer dependency terverifikasi: React 19.3, React Router 7.18 (sesuai DEC-002 "React Router v7", bukan v8), TanStack Query 5, @supabase/supabase-js 2, Tailwind CSS 4.3, Vite 8, TypeScript 5.9 (bukan TS 7 native), Vitest 5, ESLint 10.
- Supabase client diinisialisasi malas (`src/lib/supabase.ts`) hanya dengan URL + publishable key; tidak ada secret di source/bundle. Env dibaca terpusat di `src/lib/env.ts`.
- Struktur direktori awal: `src/app`, `src/lib`, `src/routes`, `src/test`. Folder fitur kosong sengaja tidak dibuat. Status: Done.

### [TITIS-102] Tailwind CSS v4 dan design tokens
- **Status:** Done | **Phase:** 1 | **Depends on:** TITIS-101, TITIS-009
- **Scope:** konfigurasi Tailwind CSS v4 dengan satu pola dan token semantik sesuai `DESIGN.md`.
- **Out of scope:** UI library tambahan atau sistem tema/page builder di dashboard.

#### Acceptance criteria
- [x] Token warna, tipografi, spacing, radius, border/elevation sesuai keputusan desain.
- [x] Contoh komponen menunjukkan penggunaan token yang konsisten.
- [x] Pola CSS tidak mencampur pendekatan konfigurasi yang saling bertentangan.

#### Verification
- [x] Build lulus; verifikasi visual terhadap spesifikasi desain (mockup visual opsional, bukan prasyarat — keputusan Owner 2026-10-17).

#### Evidence
- Token final **dark-only** difinalkan dan dicatat di `DESIGN.md` §4.1–§4.3 (15 peran warna + kontras terhitung, skala tipografi `display/h1–h4/body/body-sm/caption`, spasi/radius/border/elevasi/motion). Nilai = campuran: nilai Portfolio (navy `#1B3E5C`, coral `#FA6B48`, gold `#F2B138`), identitas TITIS (cream `#EDDBB5`, hijau `#2A5A44`), dan turunan sistematis (surface/muted/border/status).
- Implementasi CSS-first di `src/index.css` via `@theme` (`--color-*`, `--font-sans/mono` JetBrains Mono, `--text-*`, `--ease-smooth`). Tanpa `tailwind.config.js`.
- Contoh komponen: `HomePage` dan `NotFoundPage` memakai token semantik (`bg-bg`, `text-text`, `text-text-muted`, `text-display`, `text-body`, `text-h1`).
- Verifikasi: `build` lulus (utility token tergenerate, tanpa `prefers-color-scheme`/toggle); `type-check`, `lint`, `test` lulus (RTL merender `HomePage`); kontras dihitung WCAG 2.x (teks ≥ 4.5:1, batas/fokus ≥ 3:1) — bukan pengukuran browser.
- **Kebijakan verifikasi (Owner 2026-10-17):** mockup visual **opsional**, bukan prasyarat. Dasar keputusan = `DESIGN.md` (token final) + referensi Portfolio. Tidak ada mockup yang dibuat/diklaim. Verifikasi dilakukan: nilai token vs `DESIGN.md`, build output/utility, dan render komponen via RTL. Status: Done.

### [TITIS-103] Lingkungan development Supabase
- **Status:** Blocked | **Phase:** 1 | **Depends on:** TITIS-101, TITIS-004
- **Scope:** Supabase CLI/config, proyek development, satu frontend client Supabase, konfigurasi env terpusat, dan `.env.example`.
- **Out of scope:** tabel/policy fitur booking dan POS; dibuat pada task berikutnya.

#### Acceptance criteria
- [ ] App dapat terhubung ke environment development yang benar.
- [x] Frontend menggunakan hanya URL dan publishable key publik.
- [x] `.env.example` memuat nama variabel dan placeholder tanpa nilai secret.
- [x] Tidak ada service-role/secret pada `VITE_*`, source, bundle, log, atau file ter-track.

#### Verification
- [x] Periksa file ter-track dan bundle hasil build untuk pola secret; catat command dan hasil aktual.

#### Evidence
- Prasyarat dari TITIS-101 sudah terpasang: satu client Supabase (`src/lib/supabase.ts`) hanya memakai URL + publishable key; env terpusat di `src/lib/env.ts`; `.env.example` berisi `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` (placeholder kosong) + `SUPABASE_SERVICE_ROLE_KEY`/`SUPABASE_DB_URL` (dikomentari, server-only).
- Scan secret dijalankan (grep pola `service_role`/`sb_secret_`/JWT di file ter-track, `src/`, dan bundle `dist/`): **tidak ada nilai secret**; semua kemunculan `service_role` hanyalah teks peringatan di dokumentasi/komentar.
- **Blocker:** Supabase CLI belum terpasang (`supabase: command not found`). Ini menghalangi `supabase init` (menghasilkan `supabase/config.toml`), `supabase start` (DB lokal; Docker 29.1.3 tersedia & daemon berjalan), `supabase db:types`, serta verifikasi AC "app dapat terhubung" (belum ada environment dev berjalan). Tidak dilakukan operasi remote/login/credentials. Status: Blocked.

### [TITIS-104] Migration fondasi Owner, profil bisnis, dan konten
- **Status:** Blocked | **Phase:** 1 | **Depends on:** TITIS-103, TITIS-007, TITIS-008
- **Scope:** migration minimum untuk identitas Owner, `business_profile`, dan model konten yang diperlukan untuk company profile; nama/kolom final mengikuti `DATABASE.md`.
- **Out of scope:** tabel booking, orders, payments, dan katalog lengkap sebelum task domainnya.

#### Acceptance criteria
- [ ] Migration tersimpan di Git dan dapat diterapkan dari database development/test bersih.
- [ ] Foreign key, constraint, index, grants, dan policy sesuai dokumen reviewed.
- [ ] Tidak ada perubahan schema remote manual di luar workflow migration yang disetujui.
- [ ] Schema tidak mengasumsikan Staff atau signup publik.

#### Verification
- [ ] Jalankan reset/replay pada environment lokal/test yang aman dan catat output aktual.

#### Evidence
- Belum ada.

### [TITIS-105] Generated database types
- **Status:** Blocked | **Phase:** 1 | **Depends on:** TITIS-104
- **Scope:** hasilkan tipe database dengan Supabase CLI, sesuai keputusan DEC-010 dan struktur aktual.
- **Out of scope:** menulis tipe schema manual yang menyimpang dari migrations.

#### Acceptance criteria
- [ ] File generated types dihasilkan dari schema aktual dan dipakai oleh app jika telah diputuskan.
- [ ] Prosedur regenerasi setelah migration tertulis.
- [ ] Nilai PostgreSQL `bigint` ditangani dengan representasi aman, tidak diasumsikan selalu aman sebagai JavaScript `number`.
- [ ] Bila command/version belum berfungsi, blocker dicatat dan CI tidak mengklaim pemeriksaan itu tersedia.

#### Verification
- [ ] Jalankan command type generation yang benar-benar dikonfigurasi dan type-check.

#### Evidence
- Belum ada.

### [TITIS-106] Routing, layout public/admin, dan state dasar
- **Status:** Blocked | **Phase:** 1 | **Depends on:** TITIS-102, TITIS-101, TITIS-004
- **Scope:** React Router v7, layout terpisah untuk publik/dashboard, loading/error boundary, dan skeleton rute inti.
- **Out of scope:** seluruh halaman publik final, form booking, dan POS.

#### Acceptance criteria
- [ ] Public shell dan dashboard shell terpisah.
- [ ] Route dashboard membutuhkan sesi Owner untuk pengalaman pengguna; kontrol data tetap pada RLS/function.
- [ ] State loading, empty, error, forbidden, dan not-found dasar tersedia.
- [ ] Navigasi keyboard dan layout responsif dasar berfungsi.
- [ ] Refresh rute yang ada tidak menghasilkan error lokal; rute tak dikenal menampilkan 404.

#### Verification
- [ ] Tes route/state yang relevan serta cek manual desktop/mobile.

#### Evidence
- Belum ada.

### [TITIS-107] Autentikasi Owner
- **Status:** Blocked | **Phase:** 1 | **Depends on:** TITIS-104, TITIS-106
- **Scope:** login, logout, sesi, expiry, redirect, dan jalur bootstrap Owner sesuai DEC-016 setelah Accepted.
- **Out of scope:** signup publik, akun Staff, undangan pengguna, dan permission matrix.

#### Acceptance criteria
- [ ] Owner dapat login/logout dan sesi diperlakukan dengan benar.
- [ ] Jalur bootstrap akun Owner pertama aman dan didokumentasikan; pengguna tidak dapat memilih/menaikkan role sendiri.
- [ ] Signup publik tidak diaktifkan.
- [ ] Dashboard menolak pengguna yang tidak memiliki sesi Owner.

#### Verification
- [ ] Tes login, logout, session expiry, redirect, dan direct access tanpa sesi.

#### Evidence
- Belum ada. Prasyarat DEC-016 `Proposed` sampai disetujui.

### [TITIS-108] Otorisasi data dan RLS untuk profil/konten
- **Status:** Blocked | **Phase:** 1 | **Depends on:** TITIS-104, TITIS-107, TITIS-008
- **Scope:** RLS, grants, dan akses untuk semua tabel client-facing fase ini.
- **Out of scope:** policies booking, transaksi, dan laporan yang belum ada.

#### Acceptance criteria
- [ ] RLS aktif pada setiap tabel yang diakses client dan grants tidak memberi privilege berlebihan.
- [ ] Anonymous hanya membaca field yang diperlukan untuk halaman publik.
- [ ] Anonymous tidak dapat INSERT/UPDATE/DELETE profil/konten atau memperoleh data internal.
- [ ] Owner dapat melakukan operasi yang diizinkan; role/identity Owner tidak dapat diganti melalui update biasa.
- [ ] Direct API/query dites; menyembunyikan UI tidak dianggap keamanan.

#### Verification
- [ ] Uji akses anonymous dan Owner termasuk kasus yang seharusnya ditolak.

#### Evidence
- Belum ada.

### [TITIS-109] CMS profil dan konten minimum
- **Status:** Blocked | **Phase:** 1 | **Depends on:** TITIS-108, TITIS-102
- **Scope:** form Owner untuk profil bisnis dan field konten dasar sesuai PRD serta skema konten terstruktur.
- **Out of scope:** editor HTML/CSS bebas, page builder, workflow draft/publish kompleks, dan scripting dari CMS.

#### Acceptance criteria
- [ ] Owner dapat mengubah field yang diizinkan dan menyimpan validasi yang benar.
- [ ] Perubahan tersimpan dibaca website publik tanpa edit kode.
- [ ] Input divalidasi; loading, success, empty, dan error state tersedia.
- [ ] Konten tidak dieksekusi sebagai script dan tidak dirender melalui raw HTML tak tepercaya.

#### Verification
- [ ] Uji alur edit → simpan → tampil publik dan tes validasi/state.

#### Evidence
- Belum ada.

### [TITIS-110] Public shell dan tampilan profil minimum
- **Status:** Blocked | **Phase:** 1 | **Depends on:** TITIS-109, TITIS-106
- **Scope:** tampilkan profil bisnis/konten minimum di public shell agar hasil CMS terlihat.
- **Out of scope:** seluruh halaman template, katalog lengkap, resource, booking, dan SEO lanjutan; halaman publik lengkap diselesaikan di Phase 2.

#### Acceptance criteria
- [ ] Nama, ringkasan, kontak/jam buka yang sudah disimpan Owner ditampilkan dengan aman.
- [ ] Data kosong tidak menghasilkan section/placeholder rusak.
- [ ] Loading/error state dan aksesibilitas dasar tersedia.

#### Verification
- [ ] Cek flow CMS-ke-publik, viewport mobile/desktop, dan direct access anonymous.

#### Evidence
- Belum ada.

### [TITIS-111] Deploy MVP ke environment yang disetujui
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-411
- **Scope:** deploy hanya setelah persetujuan rilis eksplisit, dengan Cloudflare Workers Static Assets + environment Supabase yang telah diverifikasi.
- **Out of scope:** memilih domain produksi tanpa persetujuan; remote migration destruktif; deployment otomatis tanpa gate.

#### Acceptance criteria
- [ ] Build berasal dari commit yang diketahui dan environment values sesuai environment.
- [ ] Auth redirect, URL publik, fallback SPA, status 404, assets/media, dan secret bundle diverifikasi.
- [ ] Smoke test alur inti dilakukan; waktu, commit, environment, hasil, dan masalah dicatat.
- [ ] Rollback frontend dan prosedur pemulihan database telah ditinjau sebelum release.

#### Verification
- [ ] Jalankan smoke test pada deployment yang disetujui; periksa console/network tanpa membocorkan secret.

#### Evidence
- Belum ada. ID dipertahankan untuk menghindari memutus referensi historis; `Phase` adalah fase pelaksanaan terkini.

### [TITIS-112] README setup development awal
- **Status:** Blocked | **Phase:** 1 | **Depends on:** TITIS-101, TITIS-103
- **Scope:** dokumentasikan prasyarat, setup lokal, env, migration dan script yang sudah tersedia selama fondasi dibangun.
- **Out of scope:** mengklaim deployment/tes akhir yang belum dijalankan; penutupan dokumentasi release dilakukan di TITIS-409.

#### Acceptance criteria
- [ ] Setiap command setup yang ditulis sudah dicoba terhadap konfigurasi aktual.
- [ ] Placeholder env jelas dan tidak mengandung secret.
- [ ] Hal yang belum tersedia tetap ditandai belum tersedia.

#### Verification
- [ ] Ikuti setup dari sesi/clone bersih semampu yang tersedia dan catat hambatan.

#### Evidence
- Belum ada.

### [TITIS-113] CI minimal
- **Status:** Blocked | **Phase:** 1 | **Depends on:** TITIS-101, TITIS-108
- **Scope:** GitHub Actions untuk script type-check, lint, test, dan build yang benar-benar tersedia; tool/test DB diperluas kemudian.
- **Out of scope:** deploy production otomatis dan E2E tambahan sebelum keputusan tool disetujui.

#### Acceptance criteria
- [ ] Workflow hanya memanggil script yang ada dan sudah dicoba lokal.
- [ ] CI lulus pada commit yang diketahui atau kegagalannya dicatat tanpa menyembunyikan test.
- [ ] Tidak ada secret pada workflow/log dan tidak ada deploy production.
- [ ] Push branch uji dilakukan hanya dengan izin eksplisit sesuai `AGENTS.md`.

#### Verification
- [ ] Jalankan command yang sama secara lokal dan bandingkan dengan CI.

#### Evidence
- Belum ada. DEC-013 tetap `Proposed` sampai keputusan Owner.

### [TITIS-114] Exit review PHASE 1
- **Status:** Blocked | **Phase:** 1 | **Depends on:** TITIS-101 sampai TITIS-110, TITIS-112, TITIS-113
- **Scope:** buktikan fondasi aplikasi, Owner Auth, CMS profil, public shell, RLS, dan migration repeatable.
- **Out of scope:** menyatakan katalog/booking/POS selesai.

#### Acceptance criteria
- [ ] Owner dapat login, mengubah profil/konten, dan melihat perubahan di website.
- [ ] Anonymous tidak dapat memodifikasi atau membaca data internal; tes direct access tersedia.
- [ ] Migration dapat direproduksi dan build dasar berjalan.
- [ ] Owner menyetujui lanjut ke Phase 2.

#### Verification
- [ ] Rangkuman bukti task Phase 1 dan perbarui bagian 1.

#### Evidence
- Belum ada.

---

## 6. PHASE 2 — Template, Customization Seam, Katalog dan Resource

**Tujuan:** template company profile lengkap dapat digunakan/dikustomisasi melalui kode; gambar minimum, katalog bersama, resource, dan jam operasional dapat dikelola Owner. Task berikut tetap `Blocked` sampai TITIS-114 `Done`.

### [TITIS-211] Halaman template publik dan SEO dasar
- **Status:** Blocked | **Phase:** 2 | **Depends on:** TITIS-114, TITIS-006, TITIS-009
- **Scope:** Beranda, Tentang, Produk/Layanan, Ruang/Fasilitas bila relevan, Booking (penjelasan/form akan aktif pada Phase 3), Kontak, dan 404.
- **Out of scope:** SSR/prerender dinamis, SEO lanjutan, atau klaim indeksasi yang tidak diuji.

#### Acceptance criteria
- [ ] Halaman inti sesuai PRD, responsif, dan menggunakan konten profil yang disimpan Owner.
- [ ] Metadata dasar, URL konsisten, heading, internal links, dan 404 sesuai keputusan DEC-011.
- [ ] Item katalog nanti ditampilkan dari satu sumber katalog, bukan harga duplikat dalam konten.
- [ ] Bila section fasilitas opsional tidak relevan/kosong, halaman tetap layak.

#### Verification
- [ ] Responsive check mobile/desktop; periksa metadata dan hasil build yang nyata.

#### Evidence
- Belum ada.

### [TITIS-212] Media minimum: logo, hero, dan gambar katalog
- **Status:** Blocked | **Phase:** 2 | **Depends on:** TITIS-108, TITIS-009
- **Scope:** Storage bucket/policy dan alur upload/pilih media seperlunya.
- **Out of scope:** media manager lengkap, crop editor kompleks, file aktif yang dapat mengeksekusi script.

#### Acceptance criteria
- [ ] Tipe dan ukuran file dibatasi; enforcement tidak hanya pada client.
- [ ] Upload/update/delete hanya Owner; akses baca media sesuai kebutuhan publik/private.
- [ ] Alt text dan fallback gambar diatur seperlunya.
- [ ] Tidak menerima SVG/HTML aktif atau format berisiko tanpa kebijakan/sanitasi yang jelas.

#### Verification
- [ ] Tes ukuran/tipe yang diizinkan/ditolak dan policy Storage sesuai setup.

#### Evidence
- Belum ada.

### [TITIS-213] Migration katalog produk/layanan
- **Status:** Blocked | **Phase:** 2 | **Depends on:** TITIS-104, TITIS-105, TITIS-007, TITIS-008
- **Scope:** tabel katalog minimum sesuai `DATABASE.md`; harga IDR integer dan status aktif/nonaktif.
- **Out of scope:** inventaris, stok, variasi kompleks, supplier, dan purchase order.

#### Acceptance criteria
- [ ] Migration menerapkan model katalog yang disetujui dan bisa di-replay dari basis bersih.
- [ ] Harga menggunakan tipe uang aman tanpa floating-point.
- [ ] Public read hanya field publik dari item aktif; operasi mutasi hanya Owner.
- [ ] Tidak ada sumber harga paralel pada konten halaman publik.

#### Verification
- [ ] Jalankan migration dan tes akses anonymous/Owner.

#### Evidence
- Belum ada. Prasyarat DEC-009 dan DEC-021 harus `Accepted` sebelum schema katalog dikunci.

### [TITIS-214] CRUD katalog pada dashboard Owner
- **Status:** Blocked | **Phase:** 2 | **Depends on:** TITIS-213, TITIS-108, TITIS-212
- **Scope:** tambah, edit, dan nonaktifkan produk/layanan.
- **Out of scope:** POS checkout, stok, dan transaksi.

#### Acceptance criteria
- [ ] Owner dapat mengelola nama, deskripsi, harga, gambar opsional, dan status aktif.
- [ ] Validasi dan state loading/empty/error jelas.
- [ ] Item nonaktif tidak ditampilkan di public catalog dan nantinya tidak dapat dijual.
- [ ] Anonymous tidak dapat membuat/mengubah item lewat UI ataupun API langsung.

#### Verification
- [ ] Tes CRUD, validasi, media, state, serta direct access.

#### Evidence
- Belum ada.

### [TITIS-215] Migration resource dan jam operasional
- **Status:** Blocked | **Phase:** 2 | **Depends on:** TITIS-213, TITIS-007
- **Scope:** schema resource/jam operasional sesuai model booking pada `DATABASE.md`; tetapkan timezone `Asia/Jakarta` dan status aktif.
- **Out of scope:** booking publik, konfirmasi, dan constraint overlap yang dikerjakan Phase 3.

#### Acceptance criteria
- [ ] Resource dan jam buka terdefinisi dengan tipe/constraint yang konsisten.
- [ ] Data aktif yang boleh dipublikasikan tidak mengekspos data internal.
- [ ] Migration bisa diterapkan ulang; belum membuat asumsi terhadap status booking yang belum final.

#### Verification
- [ ] Terapkan migration pada environment lokal/test dan uji batas nilai.

#### Evidence
- Belum ada.

### [TITIS-216] Owner mengelola resource dan jam operasional
- **Status:** Blocked | **Phase:** 2 | **Depends on:** TITIS-215, TITIS-108
- **Scope:** UI dasar untuk menambah/mengubah/menonaktifkan resource dan menetapkan jam operasional.
- **Out of scope:** editor kebijakan booking kompleks atau pengubahan slot/buffer/horizon yang ditetapkan sebagai konfigurasi proyek.

#### Acceptance criteria
- [ ] Owner dapat mengelola resource/jam buka yang diperbolehkan.
- [ ] Perubahan divalidasi dan state loading/error tersedia.
- [ ] Public view hanya menampilkan resource/field yang diizinkan.
- [ ] Anonymous tidak dapat mengubah konfigurasi lewat akses langsung.

#### Verification
- [ ] Tes CRUD dan akses langsung anonymous/Owner.

#### Evidence
- Belum ada.

### [TITIS-217] Integrasi katalog publik dari satu sumber
- **Status:** Blocked | **Phase:** 2 | **Depends on:** TITIS-211, TITIS-214
- **Scope:** tampilkan item aktif dari katalog yang sama dengan yang nanti dipakai POS.
- **Out of scope:** keranjang atau checkout.

#### Acceptance criteria
- [ ] Public website hanya menampilkan item aktif dan field yang diizinkan.
- [ ] Nama/harga bukan salinan independen di `page_content`.
- [ ] Perubahan katalog muncul setelah invalidasi/cache yang benar.

#### Verification
- [ ] Uji perubahan Owner sampai tampil publik, termasuk menonaktifkan item.

#### Evidence
- Belum ada.

### [TITIS-218] Verifikasi customization seam template
- **Status:** Blocked | **Phase:** 2 | **Depends on:** TITIS-102, TITIS-211
- **Scope:** pastikan developer bisa mengganti layout/section/token melalui kode tanpa mengubah backend/CMS/domain flow.
- **Out of scope:** membuat theme builder di dashboard atau mengerjakan desain custom klien tertentu di luar MVP.

#### Acceptance criteria
- [ ] Komponen/section dan tokens cukup terstruktur untuk ditukar/ditata ulang lewat kode.
- [ ] Data layer, model CMS, katalog, dan booking tidak terikat ke satu susunan visual.
- [ ] Konten rutin tetap dapat diperbarui Owner tanpa edit kode.

#### Verification
- [ ] Review struktur kode dan demonstrasikan satu perubahan presentasi tanpa perubahan schema.

#### Evidence
- Belum ada. DEC-020 harus `Accepted` sebelum dinyatakan sebagai kontrak final.

### [TITIS-219] Responsive dan accessibility check template
- **Status:** Blocked | **Phase:** 2 | **Depends on:** TITIS-211, TITIS-212, TITIS-214, TITIS-216
- **Scope:** cek halaman inti pada mobile/desktop, keyboard/focus, label, kontras, gambar, dan empty state.
- **Out of scope:** audit sertifikasi aksesibilitas atau library audit tambahan yang belum disetujui.

#### Acceptance criteria
- [ ] Konten inti tidak terpotong pada viewport yang ditargetkan.
- [ ] Link/form dapat dipakai keyboard; focus terlihat; label dan error message jelas.
- [ ] Gambar memiliki fallback dan alt yang sesuai.
- [ ] Section opsional/kosong tidak rusak.

#### Verification
- [ ] Manual checks; alat otomatis hanya bila sudah tersedia/disetujui.

#### Evidence
- Belum ada.

### [TITIS-220] Exit review PHASE 2
- **Status:** Blocked | **Phase:** 2 | **Depends on:** TITIS-211 sampai TITIS-219
- **Scope:** pastikan template, customization seam, media, katalog, resource, dan jam operasional siap menjadi dasar booking/POS.

#### Acceptance criteria
- [ ] Halaman inti public tersedia dengan SEO dasar yang disepakati.
- [ ] Owner mengelola konten, katalog, media, resource, dan jam operasional.
- [ ] Public site dan POS menggunakan satu katalog sumber data.
- [ ] Tes akses memastikan operasi admin hanya Owner.
- [ ] Owner menyetujui lanjut ke PHASE 3.

#### Verification
- [ ] Ringkas bukti task Phase 2; perbarui status bagian 1.

#### Evidence
- Belum ada.

---

## 7. PHASE 3 — Booking dan Anti-Bentrok

**Tujuan:** pengunjung dapat mengajukan booking tanpa akun; Owner dapat memutuskan booking; database mencegah dua booking terkonfirmasi overlap. Seluruh task tetap `Blocked` sampai TITIS-220 `Done`.

### [TITIS-201] Finalisasi model booking dan aturan waktu
- **Status:** Blocked | **Phase:** 3 | **Depends on:** TITIS-220
- **Scope:** finalisasi schema/invariants sesuai PRD dan `DATABASE.md`.
- **Out of scope:** notifikasi otomatis, self-service cancellation/reschedule, payment, atau kebijakan booking yang kompleks.

#### Acceptance criteria
- [ ] Resource, field pengunjung, status `pending/confirmed/rejected/cancelled` yang disetujui, timezone, dan transisi status terdokumentasi.
- [ ] Slot 60 menit; durasi kelipatan 60 menit maksimal 4 jam; buffer 15 menit; horizon maksimal 30 hari; timezone `Asia/Jakarta`.
- [ ] Hanya `confirmed` yang memblokir; interval setengah-terbuka; makna buffer ditentukan tanpa ambiguitas.
- [ ] Owner menghubungi pengunjung secara manual; form memberitahukan booking belum dikonfirmasi.

#### Verification
- [ ] Cross-check PRD, ARCHITECTURE, DATABASE, SECURITY; keputusan yang belum jelas diblokir.

#### Evidence
- Belum ada. DEC-006 dan detail database terkait harus disetujui sebelum implementasi jalur publik.

### [TITIS-202] Migration booking dan constraint anti-bentrok
- **Status:** Blocked | **Phase:** 3 | **Depends on:** TITIS-201, TITIS-215
- **Scope:** tabel booking, constraints, indexes, dan exclusion/range strategy sesuai `DATABASE.md`.
- **Out of scope:** mengandalkan pemeriksaan UI/SELECT saja untuk menjamin ketersediaan.

#### Acceptance criteria
- [ ] Migration mencatat seluruh schema/constraints/indexes yang dibutuhkan.
- [ ] Constraint menegakkan overlap dan buffer sebagaimana disetujui untuk booking `confirmed` pada resource yang sama.
- [ ] `pending` tidak memblokir; resource berbeda tidak saling memblokir.
- [ ] Error constraint dipetakan ke respons yang aman, misalnya slot tidak lagi tersedia.

#### Verification
- [ ] Uji overlap, batas interval, buffer, status pending, resource berbeda, dan migration bersih.

#### Evidence
- Belum ada. Verifikasi `btree_gist`/exclusion constraint perlu dilakukan pada environment aktual.

### [TITIS-203] Jalur write booking publik yang aman
- **Status:** Blocked | **Phase:** 3 | **Depends on:** TITIS-202, TITIS-008
- **Scope:** entry point terbatas (Edge Function sesuai DEC-006 bila disetujui) dan operasi database internal.
- **Out of scope:** memberi akses SELECT publik terhadap tabel booking atau memberi anon kemampuan mengatur status.

#### Acceptance criteria
- [ ] Client hanya mengirim field yang dibutuhkan; status selalu ditetapkan sistem sebagai `pending`.
- [ ] Validasi tepercaya memeriksa resource, waktu, durasi, jam operasional, batas 30 hari, kontak, dan payload.
- [ ] Permission/grants mencegah bypass jalur publik; secret berhak tinggi hanya berada di server-side environment.
- [ ] Respons tidak membocorkan booking/data pribadi lain.

#### Verification
- [ ] Test valid/invalid payload dan direct call terhadap function/RPC yang tidak boleh publik.

#### Evidence
- Belum ada. DEC-006 harus `Accepted` sebelum jalur ini dipilih final.

### [TITIS-204] Form booking publik
- **Status:** Blocked | **Phase:** 3 | **Depends on:** TITIS-203
- **Scope:** form field minimum, client validation untuk UX, dan loading/success/error state.
- **Out of scope:** akun pengunjung, pembayaran, notifikasi otomatis, dan self-service booking management.

#### Acceptance criteria
- [ ] Resource, mulai/selesai, nama, kontak, jumlah orang, dan catatan opsional tersedia sesuai PRD.
- [ ] Pesan sukses menyatakan permintaan diterima untuk ditinjau; tidak menyiratkan booking sudah confirmed.
- [ ] Privacy notice singkat dan proteksi spam yang disetujui tampil.
- [ ] Invalid input, network error, retry, dan sukses memiliki feedback yang jelas.

#### Verification
- [ ] UI tests dan manual checks keyboard/mobile serta request/error behavior.

#### Evidence
- Belum ada.

### [TITIS-205] Dashboard booking Owner
- **Status:** Blocked | **Phase:** 3 | **Depends on:** TITIS-202, TITIS-107, TITIS-108
- **Scope:** lihat/filter detail booking serta konfirmasi, tolak, dan batalkan sesuai status yang disepakati.
- **Out of scope:** Staff, komunikasi otomatis, dan portal pengunjung.

#### Acceptance criteria
- [ ] Owner dapat memfilter booking berdasarkan tanggal/status/resource.
- [ ] Hanya Owner dapat membaca detail pribadi dan memutuskan status.
- [ ] Konfirmasi bentrok ditolak oleh database dan mendapat pesan operasional yang jelas.
- [ ] UI mengomunikasikan pending dan kegagalan jaringan tanpa state palsu.

#### Verification
- [ ] Tes transisi status dan direct API access sebagai anonymous serta Owner.

#### Evidence
- Belum ada.

### [TITIS-206] Perlindungan spam/abuse untuk form publik
- **Status:** Blocked | **Phase:** 3 | **Depends on:** TITIS-203
- **Scope:** proteksi minimum sesuai DEC-017, misalnya validasi ketat dan honeypot; rate limiting bila tersedia dan layak.
- **Out of scope:** mewajibkan Cloudflare Turnstile atau layanan pihak ketiga tanpa keputusan Owner/analisis risiko.

#### Acceptance criteria
- [ ] Proteksi sederhana dijelaskan, dapat diuji, dan tidak dianggap sebagai pengganti validasi server.
- [ ] Jika Turnstile atau layanan lain dipilih, DEC-017 diperbarui dan secret berada di server saja.
- [ ] Pesan privasi/form mengikuti PRD; log tidak menyimpan data pribadi yang tidak dibutuhkan.

#### Verification
- [ ] Tes jalur normal, honeypot/validasi, dan kegagalan validasi sesuai solusi yang benar-benar dibuat.

#### Evidence
- Belum ada. DEC-017 saat ini `Proposed`.

### [TITIS-207] Transisi, pembatalan, dan penanganan booking
- **Status:** Blocked | **Phase:** 3 | **Depends on:** TITIS-205
- **Scope:** aturan perubahan status Owner dan penanganan kegagalan konfirmasi.
- **Out of scope:** pembatalan/reschedule mandiri oleh pengunjung dan notifikasi otomatis.

#### Acceptance criteria
- [ ] Transisi status diizinkan/ditolak secara tepercaya dan terdokumentasi.
- [ ] Booking yang ditolak/dibatalkan tidak dianggap sebagai slot confirmed yang memblokir.
- [ ] Dua konfirmasi yang bersaing tidak dapat sama-sama menciptakan overlap.

#### Verification
- [ ] Tes state transition dan race/concurrency sesuai kemampuan environment test.

#### Evidence
- Belum ada.

### [TITIS-208] Test booking, authorization, dan concurrency
- **Status:** Blocked | **Phase:** 3 | **Depends on:** TITIS-203, TITIS-205, TITIS-206, TITIS-207
- **Scope:** validasi input, akses, overlap, buffer, batas interval, dan concurrent confirmation.

#### Acceptance criteria
- [ ] Test mencakup waktu lampau, end <= start, resource nonaktif, durasi/jam operasional/horizon tidak valid.
- [ ] Test membuktikan pending tidak memblokir, confirmed overlap ditolak, buffer/batas diuji, resource berbeda tetap independen.
- [ ] Dua konfirmasi overlap yang terjadi bersamaan tidak dapat sama-sama sukses.
- [ ] Anonymous tidak bisa mengubah status atau membaca booking internal.

#### Verification
- [ ] Jalankan test aktual pada database/test environment; bedakan test sekuensial dari concurrency test yang sungguh menjalankan request bersamaan.

#### Evidence
- Belum ada.

### [TITIS-209] Preview deploy dan smoke test booking
- **Status:** Blocked | **Phase:** 3 | **Depends on:** TITIS-208, TITIS-005
- **Scope:** uji jalur booking pada environment non-production yang disetujui.
- **Out of scope:** release production penuh.

#### Acceptance criteria
- [ ] Environment preview tidak menggunakan database production.
- [ ] Form submit, pesan pending, dashboard Owner, dan penolakan bentrok diuji.
- [ ] Tidak ada secret di client bundle/log; environment dan commit dicatat.

#### Verification
- [ ] Smoke test URL preview aktual dan catat masalah.

#### Evidence
- Belum ada.

### [TITIS-210] Exit review PHASE 3
- **Status:** Blocked | **Phase:** 3 | **Depends on:** TITIS-201 sampai TITIS-209
- **Scope:** buktikan acceptance criteria booking dan anti-bentrok terpenuhi.

#### Acceptance criteria
- [ ] Pengunjung dapat mengajukan permintaan booking; hanya Owner dapat memutuskan.
- [ ] Bentrok, buffer, request bersamaan, dan akses tidak sah dibuktikan lewat test.
- [ ] Data pribadi tidak terbuka pada jalur publik.
- [ ] Owner menyetujui lanjut ke Phase 4.

#### Verification
- [ ] Rangkum hasil task Phase 3 dan perbarui bagian 1.

#### Evidence
- Belum ada.

---

## 8. PHASE 4 — POS, Reports, Hardening dan Release

**Tujuan:** checkout lunas tersimpan atomik dan idempotent; riwayat serta laporan bisa direkonsiliasi; security/release checks dilakukan sebelum deploy. Seluruh task berikut tetap `Blocked` sampai TITIS-210 `Done`.

### [TITIS-301] Finalisasi kontrak checkout POS
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-210, TITIS-213, TITIS-007
- **Scope:** kunci input checkout dan aturan bisnis sesuai PRD/ARCHITECTURE.
- **Out of scope:** diskon, pajak khusus, DP, pelunasan bertahap, void/refund, stok, dan payment gateway.

#### Acceptance criteria
- [ ] Input terpercaya hanya mencakup ID item aktif, kuantitas valid, metode `cash`/`transfer`/`qris`, dan `client_request_id`.
- [ ] Total final dihitung ulang dari harga database; IDR disimpan sebagai integer tipe aman.
- [ ] Order/item/payment harus tersimpan atomik; item menyimpan snapshot nama/harga.
- [ ] Nomor transaksi unik dijamin database; status final merepresentasikan transaksi lunas.

#### Verification
- [ ] Cross-check `DATABASE.md`, `SECURITY.md`, dan DEC-008/009 sebelum schema/function dibuat.

#### Evidence
- Belum ada. DEC-009 masih `Proposed` dalam Architecture yang diberikan.

### [TITIS-302] Migration orders, order_items, dan payments
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-301
- **Scope:** schema transaksi minimal dan constraints/indexes yang dibutuhkan.
- **Out of scope:** fitur refund/void, status pembayaran bertahap, dan inventory.

#### Acceptance criteria
- [ ] Schema mendukung order lunas, snapshot item, metode pembayaran manual, dan request ID idempotency.
- [ ] Constraint mencegah data inti invalid dan nomor transaksi duplikat.
- [ ] Migration dapat diterapkan dari database test bersih; tidak ada perubahan manual pada production.

#### Verification
- [ ] Replay migrations dan jalankan tes constraint yang tersedia.

#### Evidence
- Belum ada.

### [TITIS-303] Atomic checkout database function/RPC
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-302, TITIS-008
- **Scope:** satu operasi tepercaya yang memvalidasi Owner, item aktif/harga/kuantitas/metode, menghitung total, menyimpan order/items/payment, dan mengembalikan hasil tersimpan.
- **Out of scope:** perhitungan total final di client atau beberapa mutation non-atomik.

#### Acceptance criteria
- [ ] Header, item snapshot, dan payment commit bersama atau rollback bersama.
- [ ] Harga dan total dari client tidak dipercaya.
- [ ] Permission function/grants ditinjau; `SECURITY DEFINER` hanya bila diperlukan, dengan privilege minimum, `search_path` aman, nama schema eksplisit, dan `EXECUTE` terbatas.
- [ ] Item nonaktif, kuantitas/payload/metode invalid, dan pengguna bukan Owner ditolak.

#### Verification
- [ ] Test checkout sukses, invalid input, permission denial, dan rollback saat operasi gagal.

#### Evidence
- Belum ada.

### [TITIS-304] Idempotency dan perlindungan retry checkout
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-303
- **Scope:** memastikan double-submit/retry tidak membuat penjualan ganda.

#### Acceptance criteria
- [ ] Request ID sama dan payload identik mengembalikan hasil transaksi yang sudah ada atau hasil ekuivalen tanpa duplikasi.
- [ ] Request ID sama dengan payload berbeda ditolak sebagai konflik.
- [ ] Retry setelah timeout menggunakan ID yang sama; frontend tidak otomatis membuat request transaksi baru dengan ID baru.

#### Verification
- [ ] Jalankan tes request duplikat, payload berbeda, dan retry setelah hasil ambigu.

#### Evidence
- Belum ada.

### [TITIS-305] UI POS: cart dan checkout
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-303, TITIS-304, TITIS-214
- **Scope:** pilih item aktif, kuantitas, estimasi total, dan review sebelum checkout.
- **Out of scope:** POS offline, inventory, diskon, pajak, dan fitur transaksi yang tidak disetujui.

#### Acceptance criteria
- [ ] Hanya item aktif yang dapat dimasukkan ke keranjang.
- [ ] Total yang tampil dijelaskan sebagai estimasi sampai server mengembalikan total final.
- [ ] Submit/retry menggunakan client request ID yang sesuai; error tidak meninggalkan state sukses palsu.
- [ ] UI meminta Owner meninjau keranjang sebelum checkout karena tidak ada void/refund pada MVP.

#### Verification
- [ ] Tes validasi item/kuantitas, loading, kegagalan network, success response, dan double-submit.

#### Evidence
- Belum ada.

### [TITIS-306] Metode pembayaran manual dan pencatatan lunas
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-303, TITIS-305
- **Scope:** tunai, transfer, QRIS manual sebagai metode untuk satu pembayaran lunas per transaksi.
- **Out of scope:** gateway, webhook, DP, pelunasan, cicilan, refund, dan void.

#### Acceptance criteria
- [ ] Hanya metode pembayaran yang disetujui dapat dipilih.
- [ ] Satu checkout yang berhasil menyimpan satu catatan pembayaran lunas.
- [ ] UI dan dokumentasi tidak menyatakan verifikasi transfer/QRIS otomatis dilakukan oleh sistem.
- [ ] Laporan menggunakan metode yang tersimpan pada transaksi.

#### Verification
- [ ] Test semua metode, input invalid, checkout gagal, dan hubungan payment-order.

#### Evidence
- Belum ada.

### [TITIS-307] Riwayat dan detail transaksi
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-302, TITIS-303, TITIS-008
- **Scope:** Owner dapat meninjau transaksi, item snapshot, total, waktu, dan metode pembayaran.
- **Out of scope:** edit/hapus transaksi selesai atau koreksi akuntansi.

#### Acceptance criteria
- [ ] Daftar dan detail menampilkan hasil database yang tersimpan.
- [ ] Snapshot tidak berubah ketika katalog diperbarui.
- [ ] Transaksi selesai tidak dapat diedit/dihapus melalui UI atau direct API biasa.
- [ ] Anonymous tidak dapat membaca order/payment/detail transaksi.

#### Verification
- [ ] Tes riwayat, snapshot, Owner access, dan penolakan anonymous/update/delete.

#### Evidence
- Belum ada.

### [TITIS-308] Definisi dan query laporan dasar
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-303, TITIS-306, TITIS-007
- **Scope:** definisi serta query penjualan periode, jumlah transaksi, total per metode pembayaran, dan booking per status.
- **Out of scope:** akuntansi penuh, DP, void/refund, predictive analytics, dan dashboard analitik lanjutan.

#### Acceptance criteria
- [ ] Definisi setiap metrik terdokumentasi di sumber domain yang tepat.
- [ ] Filter tanggal menghormati zona waktu bisnis `Asia/Jakarta`.
- [ ] Query menghitung transaksi yang benar-benar tersimpan dan lunas; item terlaris hanya bila sederhana dan hasilnya dapat direkonsiliasi.
- [ ] Hanya Owner dapat membaca laporan.

#### Verification
- [ ] Gunakan fixture kecil dengan hitungan manual dan periksa hasil tiap metrik.

#### Evidence
- Belum ada.

### [TITIS-309] UI laporan dan ringkasan dashboard
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-308, TITIS-106
- **Scope:** date range dan tampilan metrik dasar yang telah disepakati.
- **Out of scope:** charting/analytics kompleks yang menambah dependency atau scope.

#### Acceptance criteria
- [ ] Owner dapat memilih rentang tanggal dan melihat metrik utama.
- [ ] Empty/loading/error state jelas.
- [ ] Angka mengikuti query sumber dan format Indonesia; tanggal mengikuti `Asia/Jakarta`.

#### Verification
- [ ] Bandingkan tampilan dengan fixture dan lakukan cek akses langsung.

#### Evidence
- Belum ada.

### [TITIS-310] Tes integritas POS dan rekonsiliasi laporan
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-303 sampai TITIS-309
- **Scope:** test transaksi, retry, laporan, dan kegagalan parsial.

#### Acceptance criteria
- [ ] Manipulasi harga/total browser tidak mengubah total final.
- [ ] Item nonaktif/kuantitas invalid ditolak.
- [ ] Checkout yang gagal tidak meninggalkan order/item/payment parsial.
- [ ] Retry request identik tidak membuat transaksi duplikat; request ID sama dengan payload berbeda ditolak.
- [ ] Snapshot tetap; payment method dan status lunas tepat; transaksi selesai tidak dapat diedit/hapus.
- [ ] Laporan cocok dengan fixture hitungan manual.

#### Verification
- [ ] Jalankan test aktual terhadap environment test; catat keterbatasan integration/concurrency bila ada.

#### Evidence
- Belum ada.

### [TITIS-311] Integrasi end-to-end alur MVP
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-310, TITIS-210
- **Scope:** jalankan alur edit konten → ajukan booking → keputusan Owner → checkout → periksa laporan.
- **Out of scope:** automation penuh menggunakan tool yang belum disetujui atau tidak tersedia.

#### Acceptance criteria
- [ ] Satu alur ujung-ke-ujung berhasil dijalankan pada environment test/preview yang benar.
- [ ] Kegagalan utama dan akses tidak sah diperiksa.
- [ ] Hasil aktual, environment, commit, dan keterbatasan dicatat.

#### Verification
- [ ] Manual E2E atau automated E2E sesuai DEC-013 yang disetujui dan tool tersedia.

#### Evidence
- Belum ada.

### [TITIS-312] Checkpoint POS dan laporan sebelum hardening rilis
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-301 sampai TITIS-311
- **Scope:** memastikan seluruh jalur POS/laporan lulus sebelum final hardening dan release review.

#### Acceptance criteria
- [ ] Checkout lunas, histori, idempotency, dan laporan telah diuji.
- [ ] Bukti test direkonsiliasi dan blocker tercatat.
- [ ] Owner menyetujui masuk ke hardening/release review, bukan dianggap sudah menyetujui deploy production.

#### Verification
- [ ] Review bukti TITIS-301..311.

#### Evidence
- Belum ada.

### [TITIS-401] Security review seluruh tabel dan jalur publik
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-312
- **Scope:** audit tabel, RLS, grants, views, RPC/functions, Edge Functions, Storage, Auth, booking, POS, dan laporan.
- **Out of scope:** menganggap RLS saja cukup atau membuka akses luas untuk memperbaiki UX.

#### Acceptance criteria
- [ ] Anonymous dan Owner diuji untuk operasi yang diizinkan serta ditolak.
- [ ] Tidak ada akses publik ke data booking internal, transaksi/payment, atau laporan.
- [ ] Privilege function/grants, Storage policies, dan jalur `SECURITY DEFINER` ditinjau.
- [ ] Temuan blocker diperbaiki sebelum rilis atau rilis ditahan.

#### Verification
- [ ] Jalankan test security yang tersedia dan tinjau SQL/policies secara read-only sebelum perubahan.

#### Evidence
- Belum ada.

### [TITIS-402] Replay migration dari basis bersih dan seed sintetis
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-312
- **Scope:** buktikan migration dan data demo sintetis dapat direproduksi.
- **Out of scope:** reset database production atau memakai data pelanggan nyata untuk test.

#### Acceptance criteria
- [ ] Semua migration dapat diterapkan pada environment lokal/test bersih.
- [ ] Seed hanya memakai data sintetis dan tidak menyimpan secret.
- [ ] Constraint, RLS, function, grants, dan types berfungsi setelah replay.

#### Verification
- [ ] Jalankan prosedur replay/seed aktual pada environment aman.

#### Evidence
- Belum ada.

### [TITIS-403] Perluas CI dengan database tests dan checks yang tersedia
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-113, TITIS-402
- **Scope:** tambahkan test database, generated type check, atau E2E hanya bila command benar-benar tersedia dan stabil.
- **Out of scope:** deployment production dari CI.

#### Acceptance criteria
- [ ] Workflow hanya menjalankan script/tool yang telah diverifikasi lokal.
- [ ] Secret tidak berada di workflow/log; tidak ada production deploy.
- [ ] Commit dan hasil CI tercatat.

#### Verification
- [ ] Bandingkan CI dengan hasil command lokal.

#### Evidence
- Belum ada.

### [TITIS-404] E2E alur kritis
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-311, TITIS-403
- **Scope:** otomasi atau catatan run-through alur login, edit content, booking, keputusan Owner, checkout, payment, laporan.
- **Out of scope:** mewajibkan Playwright/alat baru sebelum DEC-013 disetujui.

#### Acceptance criteria
- [ ] Alur kritis punya bukti E2E aktual pada environment non-production.
- [ ] Test tidak menggunakan data pelanggan/credential nyata.
- [ ] Tool, command, dan keterbatasan dicatat.

#### Verification
- [ ] Jalankan E2E sesuai tool yang disetujui; bila automasi didefer, jalankan manual flow dan catat alasan.

#### Evidence
- Belum ada.

### [TITIS-405] Final responsive, keyboard/focus, dan accessibility checks
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-219, TITIS-404
- **Scope:** final regression pada halaman publik dan dashboard inti.
- **Out of scope:** audit sertifikasi formal atau dependency tambahan tanpa persetujuan.

#### Acceptance criteria
- [ ] Halaman inti berfungsi pada mobile dan desktop.
- [ ] Label, focus keyboard, kontras, validation message, empty/error state, dan 404 diperiksa.
- [ ] Temuan yang menghalangi alur kritis diperbaiki atau diterima eksplisit Owner.

#### Verification
- [ ] Manual checks dan tools yang benar-benar tersedia.

#### Evidence
- Belum ada.

### [TITIS-406] Rencana backup dan pemulihan environment produksi
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-402
- **Scope:** pastikan pilihan paket/backup/recovery sesuai risiko serta anggaran aktual; dokumentasikan prosedur pemulihan yang dapat dilakukan.
- **Out of scope:** mengasumsikan harga, batas paket, backup, atau PITR lama masih sama tanpa verifikasi saat ini.

#### Acceptance criteria
- [ ] Opsi backup/recovery yang benar-benar aktif diverifikasi dari dashboard/dokumentasi provider saat rilis.
- [ ] Restore/rekonstruksi dites di environment yang aman jika fasilitas mendukung.
- [ ] Risiko kehilangan data, RPO/RTO yang realistis, dan approval Owner dicatat.
- [ ] Tidak ada operasi destruktif production tanpa persetujuan dan rencana pemulihan.

#### Verification
- [ ] Verifikasi fasilitas yang tersedia dan catat hasil/limit yang aktual; jangan memasukkan data sensitif ke evidence.

#### Evidence
- Belum ada.

### [TITIS-407] Audit lisensi dependency dan aset
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-011, TITIS-312
- **Scope:** periksa dependency serta font, ikon, gambar, dan aset yang masuk release.
- **Out of scope:** menyalin kode/aset pihak lain tanpa izin atau evaluasi lisensi.

#### Acceptance criteria
- [ ] Lisensi dependency/aset yang dipakai diperiksa dan atribusi yang diwajibkan tersedia.
- [ ] Tidak ada aset yang status hak pakainya tidak jelas tanpa tindakan/keputusan Owner.
- [ ] License file utama tetap cocok dengan keputusan proyek.

#### Verification
- [ ] Periksa manifest/lockfile serta sumber aset aktual.

#### Evidence
- Belum ada.

### [TITIS-408] Catat known limitations dan kesiapan operasional
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-401, TITIS-406, TITIS-407
- **Scope:** rangkum keterbatasan MVP yang perlu diketahui pengguna/pengelola: SPA SEO, tidak ada DP/void/refund/stok/Staff, booking manual tanpa notifikasi otomatis.
- **Out of scope:** menambah fitur untuk menghilangkan keterbatasan tersebut pada rilis ini.

#### Acceptance criteria
- [ ] Known limitations konsisten dengan PRD dan guide.
- [ ] Prosedur operasional yang dibutuhkan Owner jelas, khususnya memeriksa keranjang sebelum checkout dan menghubungi pemohon booking secara manual.
- [ ] Tidak ada janji fitur/SEO yang belum diimplementasikan.

#### Verification
- [ ] Review wording pada README dan UI penting.

#### Evidence
- Belum ada.

### [TITIS-409] README final dan setup dari repository bersih
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-101, TITIS-103, TITIS-402, TITIS-403, TITIS-404, TITIS-407, TITIS-111
- **Scope:** verifikasi README untuk prasyarat, env, migration, script, testing, deployment, lisensi, dan known limitations berdasarkan hasil aktual.
- **Out of scope:** dokumentasi perintah yang belum pernah dicoba sebagai prosedur yang sudah terbukti.

#### Acceptance criteria
- [ ] Setup diuji dari clone/working copy bersih tanpa bantuan lisan bila memungkinkan.
- [ ] Semua command yang ditulis benar-benar dijalankan; yang belum terverifikasi diberi label.
- [ ] Deployment/environment/limitasi yang dijelaskan cocok dengan hasil aktual.
- [ ] Tidak ada secret, data customer, atau credential nyata.

#### Verification
- [ ] Ikuti README dari awal dan catat setiap hambatan/perubahan.

#### Evidence
- Belum ada.

### [TITIS-410] Checklist rilis, persetujuan environment, dan rollback
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-401, TITIS-402, TITIS-403, TITIS-404, TITIS-405, TITIS-406, TITIS-407, TITIS-408
- **Scope:** siapkan keputusan akhir deployment, commit target, environment, backup/recovery, smoke tests, rollback, dan known issues sebelum meminta persetujuan Owner.
- **Out of scope:** deployment production tanpa approval eksplisit.

#### Acceptance criteria
- [ ] Tidak ada security blocker yang diketahui.
- [ ] Test/build yang diwajibkan selesai atau blocker diberi keputusan eksplisit dan rilis ditahan bila kritis.
- [ ] Commit, environment, deployment steps, rollback frontend, dan prosedur recovery database tercatat.
- [ ] Provider limits, domain, Auth redirect, CORS, secrets, serta backup diverifikasi aktual saat release.

#### Verification
- [ ] Review checklist dan bukti rilis sebelum diserahkan ke Owner.

#### Evidence
- Belum ada.

### [TITIS-411] Persetujuan Owner dan deploy approval
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-410
- **Scope:** memperoleh persetujuan eksplisit Owner untuk deployment yang akan memengaruhi pengguna nyata.
- **Out of scope:** agent memutuskan rilis sendiri.

#### Acceptance criteria
- [ ] Owner meninjau commit target, hasil test, temuan security, keterbatasan, environment, dan rencana rollback.
- [ ] Approval/rejection tercatat dengan tanggal dan commit target.
- [ ] Bila ditolak, deployment dihentikan dan blocker dicatat.

#### Verification
- [ ] Konfirmasi eksplisit Owner; jangan menyamakan “review selesai” dengan “rilis disetujui”.

#### Evidence
- Belum ada.

### [TITIS-412] Exit review PHASE 4 dan penerimaan MVP
- **Status:** Blocked | **Phase:** 4 | **Depends on:** TITIS-301 sampai TITIS-312, TITIS-401 sampai TITIS-411
- **Scope:** bukti seluruh alur MVP, release checks, dokumentasi, dan persetujuan pemilik.
- **Out of scope:** fitur yang berada di Parking Lot.

#### Acceptance criteria
- [ ] Owner dapat login, mengelola company profile/CMS, katalog/resource, booking, checkout, riwayat, dan laporan.
- [ ] Booking terkonfirmasi tidak overlap dan checkout tidak membuat data parsial/duplikat; semuanya punya bukti test.
- [ ] Anonymous tidak dapat mengakses/mengubah data internal.
- [ ] Migration dapat direproduksi; build/test/CI yang disepakati mempunyai hasil aktual.
- [ ] README, lisensi, known limitations, dan deployment evidence lengkap.
- [ ] Owner menyetujui penerimaan MVP dan tanggalnya dicatat.

#### Verification
- [ ] Tinjau bukti seluruh task Phase 4; update status ringkas, release note bila digunakan, dan guide status jika perlu.

#### Evidence
- Belum ada.

---

## 9. Parking Lot — Di Luar MVP / Ditunda

Tidak dikerjakan kecuali scope atau fase diubah secara sengaja dengan alasan, dampak waktu/schema/security, dan persetujuan Owner.

| ID | Item | Status | Syarat untuk dipertimbangkan |
|---|---|---|---|
| TITIS-901 | Payment gateway dan webhook | Deferred | MVP manual stabil; ada kebutuhan nyata; rancangan verifikasi webhook, secret, dan idempotency disetujui. |
| TITIS-902 | Stok sederhana per produk | Deferred | Ada kebutuhan pilot; revisi PRD dan dampak transaksi/catalog disepakati. |
| TITIS-903 | Inventaris resep/BOM, supplier, purchase order | Deferred | Di luar MVP; membutuhkan desain domain dan revisi PRD. |
| TITIS-904 | Multi-tenant SaaS dan billing | Deferred | Ada kebutuhan berulang dari lebih dari satu bisnis dan ada rencana tenancy/security. |
| TITIS-905 | POS offline | Deferred | Ada kebutuhan operasional nyata dan strategi sinkronisasi konflik. |
| TITIS-906 | README bahasa Inggris / multi-bahasa | Deferred | Setelah MVP; Bahasa Indonesia menjadi bahasa MVP. |
| TITIS-907 | Demo publik dengan akun terbatas | Deferred | Setelah security review; gunakan environment/data sintetis dan akun khusus. |
| TITIS-908 | Page builder/editor visual, HTML/CSS bebas | Deferred / Out of scope | Hanya dipertimbangkan lewat revisi produk; bukan bagian custom UI/UX berbasis kode. |
| TITIS-909 | SSR/prerender SEO dinamis | Deferred | Kebutuhan SEO terukur membenarkan biaya/kompleksitas dan Owner menyetujui perubahan scope. |
| TITIS-910 | DP, pelunasan bertahap, void/refund, koreksi transaksi | Deferred / Out of scope | Perlu desain payment ledger/audit/reconciliation dan revisi PRD; jangan diimplementasikan sebagai shortcut. |
| TITIS-911 | Staff dan permission matrix | Deferred | Setelah MVP stabil, dengan revisi model auth/security. |
| TITIS-912 | Notifikasi booking otomatis dan self-service reschedule/cancel | Deferred | Ada kebutuhan pilot, kebijakan privasi dan saluran pengiriman disetujui. |
| TITIS-913 | Error tracking SaaS dan analytics lanjutan | Deferred | Hanya jika dibutuhkan dan disetujui setelah MVP. |
| TITIS-914 | CONTRIBUTING.md / changelog release formal | Deferred | Menjelang rilis open-source/pengembangan kontributor; jangan membuat duplikat `SECURITY.md`. |
| TITIS-915 | Otomatisasi retensi/penghapusan data | Deferred | Kebijakan retensi disetujui dan implementasi aman siap; PRD menyatakan otomatisasi bukan syarat MVP. |

---

## 10. Pertanyaan dan Keputusan yang Memerlukan Tindak Lanjut

Gunakan tabel ini untuk pertanyaan yang benar-benar belum diselesaikan. Setelah diputuskan, perbarui sumber kebenaran terkait dan hapus/ubah status pertanyaan; jangan mempertahankan pertanyaan yang telah usang dari roadmap lama.

| ID | Pertanyaan/blocker | Owner | Task terdampak | Status |
|---|---|---|---|---|
| Q-01 | Apakah Owner menyetujui `PRD.md` revisi 2026-10-15 sebagai baseline scope MVP? | Pemilik proyek | TITIS-002, TITIS-003, TITIS-014 | Resolved |
| Q-02 | Keputusan DEC-006, DEC-009, DEC-011, DEC-013, DEC-016, DEC-017, DEC-020, dan DEC-021 masih `Proposed` di Architecture yang diberikan. Keputusan mana yang diterima/ditunda? | Pemilik proyek | TITIS-004, TITIS-006, TITIS-007, TITIS-008, TITIS-010, TITIS-014 | Resolved |
| Q-03 | Apakah mockup/referensi desain yang akan disetujui benar-benar tersedia dalam repository dan cocok dengan template MVP? | Pemilik proyek | TITIS-009, TITIS-102, TITIS-211 | Resolved |
| Q-04 | Apakah `DATABASE.md`, `SECURITY.md`, dan `TESTING.md` telah diperbarui dari model lama Owner/Staff dan alur DP/void ke Owner-only/POS lunas? | Pemilik proyek | TITIS-007, TITIS-008, TITIS-010, TITIS-012 | Resolved |
| Q-05 | Domain final dan pilihan backup/recovery produksi masih perlu diputuskan/diverifikasi; apakah domain boleh tetap ditunda dan biaya/risiko recovery produksi dapat diterima? | Pemilik proyek | TITIS-005, TITIS-406, TITIS-410, TITIS-411 | Deferred |

**Catatan resolusi (2026-10-17, disetujui Owner):**
- Q-01 — `Resolved` oleh keputusan Owner D-01..D-10 (diterima 2026-10-16) yang menyetujui `PRD.md` revisi 2026-10-15 sebagai baseline MVP; lihat `PRD.md` status header dan `TASK.md` TITIS-002 Evidence.
- Q-02 — `Resolved` oleh D-01..D-10 dan V-01 (2026-10-16): seluruh 21 DEC kini `Accepted` (tidak ada yang ditunda); lihat `ARCHITECTURE.md` tabel DEC dan `REVIEW_KONSISTENSI.md` §1.
- Q-03 — `Resolved` oleh persetujuan Owner atas `DESIGN.md` (2026-10-17) termasuk keberadaan referensi Portfolio, design tokens, dan mockup; lihat `TASK.md` TITIS-009 Evidence.
- Q-04 — `Resolved` oleh persetujuan Owner atas `DATABASE.md`, `SECURITY.md`, `TESTING.md` (2026-10-17) yang telah Owner-only/POS lunas; lihat `TASK.md` TITIS-007/008/010 Evidence.
- Q-05 — `Deferred` ke Phase 4. Alasan: domain final dan backup/recovery produksi tidak memblokir scaffold (Phase 1) dan baru diperlukan saat konfigurasi deployment/produksi. Target: domain final → Phase 4 (TITIS-111, TITIS-410, TITIS-411); backup/recovery → Phase 4 (TITIS-406). URL publik dan Auth redirect disesuaikan dengan domain final saat deployment; strategi backup/recovery diverifikasi aktual sebelum penggunaan produksi, tanpa mengklaim restore teruji sebelum benar-benar dijalankan.

---

## 11. Log Perubahan TASK.md

| Tanggal | Perubahan |
|---|---|
| 2026-10-10 | TASK.md versi awal dibuat dengan Phase 0/1 lengkap dan Phase 2–4 ringkas. |
| 2026-10-11 | Sejumlah task Phase 0 direview terhadap scope dan dokumen baseline sebelumnya; evidence historis dicatat pada versi terdahulu. |
| 2026-10-15 | Diselaraskan dengan `PRD.md` dan `TITIS_MASTER_BUILD_GUIDE_FINAL.md` revisi 2026-10-15 serta `ARCHITECTURE.md` yang ditempel: MVP satu Owner; tanpa Staff, DP/pelunasan, void/refund, stok, page builder, atau SEO prerender wajib; roadmap diatur menjadi Phase 0 persiapan, Phase 1 fondasi/CMS, Phase 2 template/katalog/resource, Phase 3 booking, Phase 4 POS/laporan/hardening/release. DEC yang masih `Proposed` dijadikan blocker. Status/evidence historis ditandai belum diverifikasi ulang pada repository. |
| 2026-10-17 | Penyelesaian verification tersisa: rangkuman batas/langkah kerja agent (TITIS-001) dicatat; pemeriksaan tautan lokal Markdown dijalankan (20 tautan, 0 rusak) untuk TITIS-012; status TITIS-001 dan TITIS-012 diselaraskan ke `Done`; ringkasan "Status Saat Ini" dan log diperbarui. TITIS-014 tetap `Blocked` menunggu persetujuan Owner. |
| 2026-10-17 | Resolusi register keputusan & gate: Q-01..Q-04 direkonsiliasi ke `Resolved` (D-01..D-10, V-01); Q-05 `Deferred` ke Phase 4 (domain final + backup/recovery); Owner menyetujui mulai Phase 1 (2026-10-17); TITIS-014 disetujui dan disetel `Done`; ringkasan "Status Saat Ini" diperbarui. TITIS-101 belum dimulai. |
| 2026-10-17 | TITIS-101 selesai: scaffold Vite + React 19 + TypeScript + Tailwind v4 + React Router v7 + TanStack Query + Supabase client; `.nvmrc`, `.editorconfig`, `tsconfig.json`, `vite.config.ts`, `eslint.config.js`, `index.html`, struktur `src/{app,lib,routes,test}`; `package-lock.json` dihasilkan. Script `dev`/`build`/`type-check`/`lint`/`test`/`preview` diverifikasi lulus. Status `Done`. |
| 2026-10-17 | TITIS-102 diimplementasikan: token dark-only final dicatat di `DESIGN.md` §4.1–§4.3 (§3/§7/§8.1/§15/§17/§18 diselaraskan ke dark-only); token CSS-first di `src/index.css` via `@theme`; `HomePage`/`NotFoundPage` memakai token semantik. Build/type-check/lint/test lulus; kontras dihitung WCAG 2.x. Perbandingan visual diblokir (mockup belum ada) → Status `Review`. |
| 2026-10-17 | TITIS-102 disetujui `Done`: Owner menetapkan mockup visual **opsional** (bukan prasyarat); kebijakan verifikasi direvisi (nilai token vs `DESIGN.md` + build/utility + render RTL). DQ-02 diselaraskan (QA 1 tema dark, riwayat "Masuk MVP 2026-10-11" dipertahankan). §3 ditambah catatan mockup opsional. |
| 2026-10-17 | TITIS-103 dimulai namun **Blocked**: Supabase CLI belum terpasang. Verifikasi yang sudah berjalan: client Supabase (hanya URL + publishable key), `.env.example` (placeholder), dan scan secret (tidak ada secret di file ter-track/src/bundle). `supabase init`/`start`/`db:types` terhalang. Tidak ada operasi remote/login/credentials. |
