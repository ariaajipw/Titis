# ARCHITECTURE — TITIS

> **Status:** **Draft (Phase 0)**. Seluruh keputusan di bawah berstatus `Proposed` atau `Open` sampai disetujui pemilik proyek (`TASK.md` → TITIS-004). Tidak ada kode yang boleh di-scaffold sebelum DEC yang ditandai “final sebelum” untuk task terkait berstatus `Accepted`.
> **Sumber kebenaran untuk:** struktur aplikasi, aliran data, modul, routing, integrasi, batas frontend/server, dan keputusan library.
> **Bukan pengganti:** migration files (definisi schema), `docs/DATABASE.md` (penjelasan data), `docs/SECURITY.md` (izin dan model ancaman).
> **Label:** `DEC-xxx` = keputusan arsitektur (format log: `MASTER_BUILD_GUIDE.md` §13.4). Status: `Proposed` (ada usulan, belum disetujui) · `Open` (belum ada usulan; perlu data/keputusan) · `Accepted` · `Rejected` · `Superseded`. `OPEN-xxx` → `PRD.md` §8.

---

## 1. Tujuan dokumen dan cara memakainya

1. Sebelum scaffold, baca §3 dan pastikan DEC yang relevan dengan task berstatus `Accepted`.
2. Untuk mengubah keputusan: ubah status entri DEC, catat alasan dan dampak, perbarui dokumen terdampak. Jangan mengubah stack/library/dependency secara sepihak (`AGENTS.md` §3.2).
3. Versi paket **tidak** dikunci di sini. Versi dipilih dan dikunci saat scaffold (TITIS-101) dengan memeriksa dokumentasi resmi dan kompatibilitas pada saat itu, lalu dikunci lewat lockfile.
4. ID task (`TITIS-NNN`) hanya didefinisikan di `TASK.md`; dokumen ini merujuknya dan tidak menomori sendiri.

## 2. Prinsip arsitektur

Turunan dari `MASTER_BUILD_GUIDE.md` §2.3, dalam bentuk yang dapat diperiksa:

1. **Batas frontend:** frontend berisi UI dan logika presentasi; bukan tempat secret dan bukan satu-satunya penjaga aturan bisnis kritis.
2. **Validasi tepercaya:** status booking, harga, total checkout, hak akses, dan kepemilikan data ditegakkan di database/server (DEC-006, DEC-007, DEC-008).
3. **RLS secara default** untuk setiap tabel yang diakses client (`docs/SECURITY.md` §5, §9).
4. **Operasi bisnis majemuk bersifat atomik** (checkout, pembayaran) — DEC-008.
5. **Satu definisi data:** tipe TypeScript dihasilkan dari schema, bukan ditulis tangan (DEC-010).
6. **Kegagalan eksplisit:** loading, empty, validation error, permission denied, network error, retry dirancang di setiap alur (DEC-019).
7. **Aksesibilitas dan responsivitas sejak awal** (`DESIGN.md`).
8. **Observability secukupnya** tanpa membocorkan secret/data sensitif (DEC-019).
9. **Hindari backend terpisah** bila kemampuan Supabase cukup; RPC atau Edge Function hanya bila ada kebutuhan jelas dan disetujui.

## 3. Daftar keputusan (register)

| ID | Topik | Status | Terkait | Harus `Accepted` sebelum |
|---|---|---|---|---|
| DEC-001 | Baseline frontend (Vite + React 18 + TypeScript, SPA) | Proposed | — | TITIS-101 |
| DEC-002 | Library routing | Open | DEC-011, DEC-016 | TITIS-106 |
| DEC-003 | Pendekatan validasi form | Open | DEC-019 | TITIS-107 |
| DEC-004 | Styling: Tailwind CSS v4 + design tokens | Proposed | `DESIGN.md` | TITIS-102 |
| DEC-005 | Server state: TanStack Query + aturan | Proposed | DEC-018, DEC-019 | TITIS-106 |
| DEC-006 | Jalur tulis booking publik | Proposed | OPEN-007, DEC-017 | TITIS-203 |
| DEC-007 | Penegakan anti-bentrok booking | Proposed | OPEN-009 | TITIS-202 |
| DEC-008 | Checkout atomik + idempotency | Proposed | OPEN-010, OPEN-011 | TITIS-304 |
| DEC-009 | Representasi uang dan angka | Proposed | OPEN-010, OPEN-013 | TITIS-104 |
| DEC-010 | Tipe database ter-generate dan representasi status | Proposed | — | TITIS-105 |
| DEC-011 | Strategi SEO untuk halaman publik | Open | OPEN-015 | TITIS-004 (dibahas di TITIS-006) |
| DEC-012 | Hosting, environment, dan deployment | Open | OPEN-014 | TITIS-111 (dibahas di TITIS-005) |
| DEC-013 | Tooling pengujian | Proposed (E2E & a11y: Open) | `docs/TESTING.md` | TITIS-101 (E2E: TITIS-404; a11y otomatis: TITIS-405) |
| DEC-014 | Model konten CMS dan rendering aman | Proposed | OPEN-006 | TITIS-109 |
| DEC-015 | Package manager, runtime Node, dan CI | Proposed | — | TITIS-101 |
| DEC-016 | Autentikasi, sesi, sumber role, dan penamaan kunci | Proposed | OPEN-018 | TITIS-103 |
| DEC-017 | Perlindungan spam/abuse form publik | Open | THR-09, OPEN-007 | TITIS-203 |
| DEC-018 | Manajemen state klien | Proposed | DEC-005 | TITIS-101 |
| DEC-019 | Penanganan error dan observability | Proposed | — | TITIS-106 |

Setiap keputusan di bawah memakai format log keputusan. Kolom **Tanggal** diisi saat status berubah menjadi `Accepted`.

---

## 4. Keputusan stack frontend dan styling

### DEC-001 — Baseline frontend
- **Status:** Proposed
- **Konteks:** Rencana proyek mengusulkan Vite + React 18 + TypeScript. Aplikasi memiliki area publik dan admin dengan kebutuhan interaksi tinggi di admin.
- **Pilihan yang dipertimbangkan:** (A) SPA Vite + React 18 + TypeScript; (B) framework dengan SSR/SSG.
- **Keputusan:** Usulan (A), sesuai baseline rencana. React 18 dipertahankan sampai kompatibilitas pustaka diperiksa; jangan upgrade mayor tanpa DEC baru.
- **Alasan:** Sederhana, cepat, cocok untuk admin; Supabase menangani backend.
- **Dampak/trade-off:** SEO halaman publik memerlukan keputusan terpisah (DEC-011). Struktur routing bergantung DEC-002.
- **Dokumen/task terdampak:** TITIS-101, README.
- **Tanggal:** —

### DEC-004 — Styling
- **Status:** Proposed
- **Konteks:** Rencana mengusulkan Tailwind CSS v4.
- **Pilihan:** (A) Tailwind v4 dengan konfigurasi berbasis CSS dan design tokens sebagai variabel tema; (B) CSS Modules; (C) CSS-in-JS.
- **Keputusan:** Usulan (A). **Satu** pola konfigurasi yang konsisten; tidak mencampur pendekatan styling lain.
- **Alasan:** Konsisten dengan baseline; tokens dapat dipetakan dari `DESIGN.md` ke tema.
- **Dampak:** Cara memuat tokens diverifikasi terhadap dokumentasi Tailwind versi terpasang saat TITIS-102. Komponen dasar dibangun di `components/` mengikuti `DESIGN.md`.
- **Task terdampak:** TITIS-102.
- **Tanggal:** —

### DEC-018 — Manajemen state klien
- **Status:** Proposed
- **Konteks:** Zustand dan sejenisnya berasal dari desain lama dan tidak otomatis bagian dari TITIS.
- **Pilihan:** (A) Tanpa library state global: server state di TanStack Query, state UI lokal di komponen, state lintas-komponen minimal via React context (sesi/tema), filter/pagination di URL; (B) menambah store global.
- **Keputusan:** Usulan (A). Menambah store global memerlukan DEC baru dengan alasan konkret.
- **Alasan:** Mengurangi dependency dan sumber kebenaran ganda.
- **Dampak:** Filter daftar (booking, transaksi, laporan) disimpan di URL agar dapat dibagikan dan dipulihkan.
- **Task terdampak:** TITIS-101.
- **Tanggal:** —

## 5. Server state dan data fetching

### DEC-005 — Server state dengan TanStack Query
- **Status:** Proposed
- **Konteks:** Rencana mengusulkan TanStack Query; aturan cache, invalidation, loading, dan error harus ditetapkan.
- **Pilihan:** (A) TanStack Query; (B) fetch manual + state lokal.
- **Keputusan:** Usulan (A), dengan aturan:
  1. Akses data dibungkus di `features/<fitur>/api` (atau `services/` bila lintas fitur); komponen tidak memanggil klien Supabase langsung.
  2. Query key memakai factory per fitur (mis. `['bookings', 'list', filters]`) agar invalidasi presisi.
  3. Setelah mutasi sukses, invalidasi hanya key yang terdampak.
  4. **Tanpa optimistic update** untuk mutasi kritis: keputusan booking, checkout, pembayaran, void/refund. Hasil otoritatif datang dari server.
  5. Mutasi **tidak** di-retry otomatis; retry hanya lewat tindakan pengguna dengan `client_request_id` yang sama (DEC-008). Query boleh retry terbatas pada kegagalan jaringan.
  6. Setiap query/mutasi menyediakan state loading, empty, error, dan permission-denied yang dirender (DEC-019).
  7. Saat logout atau pergantian user, seluruh cache dibersihkan.
  8. Data yang tidak boleh terlihat user berikutnya tidak disimpan di storage browser persisten.
- **Alasan:** Mencegah data basi, mencegah transaksi ganda, memusatkan penanganan error.
- **Dampak:** Menambah satu dependency utama (perlu persetujuan saat scaffold).
- **Task terdampak:** TITIS-106 dan seluruh fitur data.
- **Tanggal:** —

### Aturan kelas data
- **Data publik** (halaman, katalog publik, resource aktif): boleh di-cache lebih lama.
- **Data admin** (booking, transaksi, laporan): selalu dianggap sensitif; waktu cache pendek; dibersihkan saat logout.
- **Hasil perhitungan uang/total**: ditampilkan dari respons server, bukan dihitung ulang sebagai sumber kebenaran di klien (DEC-009).

## 6. Struktur aplikasi (Usulan)

Struktur adalah arah, bukan alasan membuat folder kosong. Setelah disetujui, jangan memaksakan folder yang tidak membantu desain modul sebenarnya.

```text
src/
├── app/          # bootstrap: providers, router, error boundary
├── components/   # UI generik lintas fitur (tanpa logika domain)
├── features/     # satu folder per domain
│   ├── auth/  cms/  booking/  pos/  payments/  reports/  settings/
│   └── <fitur>/{components, hooks, api, schemas, index.ts}
├── hooks/        # hook generik lintas fitur
├── lib/          # klien Supabase tunggal, formatter uang/tanggal, util
├── routes/       # nama/isi final mengikuti DEC-002
├── services/     # akses data tipis lintas fitur (bila perlu)
└── types/        # tipe ter-generate + tipe bersama
```

Aturan ketergantungan (arah impor):

1. `app` → `features` → `components` / `hooks` / `lib` / `types`.
2. Fitur **tidak** mengimpor internal fitur lain; hanya lewat `index.ts` publik fitur tersebut.
3. `components` tidak mengimpor `features`; `lib` tidak mengimpor `features` atau `components`; `types` tidak mengimpor apa pun.
4. **Satu** instance klien Supabase, dibuat di `lib/`.
5. Area admin dimuat malas (lazy) sehingga bundle halaman publik tidak memuat kode admin. Pemisahan diverifikasi saat build (TEST-REL-01).
6. Variabel lingkungan hanya dibaca di satu modul konfigurasi dan divalidasi saat start; tidak ada `import.meta.env` tersebar.

## 7. Routing

### DEC-002 — Library routing
- **Status:** Open
- **Konteks:** Routing belum dikunci. Dibutuhkan: dua area (publik/admin) dengan layout berbeda, guard autentikasi/role, lazy loading, 404, dan kompatibilitas dengan strategi SEO.
- **Kriteria evaluasi:** dukungan guard/redirect per role; lazy loading rute; integrasi dengan TanStack Query (loader/prefetch); keamanan tipe parameter/search params (filter di URL, DEC-018); kompatibilitas prerender (DEC-011); ukuran bundle; kematangan dan pemeliharaan; kurva belajar bagi solo developer.
- **Pilihan:** kandidat yang dievaluasi saat TITIS-004: React Router, TanStack Router (kandidat lain boleh ditambah).
- **Keputusan:** Belum ada. **Tidak** ada usulan sampai DEC-011 punya arah, karena prerender dapat memengaruhi pilihan.
- **Dampak:** Menentukan struktur `routes/` dan pola guard.
- **Task terdampak:** TITIS-106.
- **Tanggal:** —

### Aturan routing (berlaku untuk pilihan apa pun)
- Guard rute adalah **kenyamanan UX**, bukan keamanan; keamanan ada di RLS/RPC.
- Rute admin diawali prefix tetap (mis. `/admin`) dan tidak diindeks mesin pencari.
- Sesi kedaluwarsa mengarahkan ke login tanpa menampilkan data admin (AC-AUTH-01.3).

## 8. Form dan validasi

### DEC-003 — Pendekatan validasi form
- **Status:** Open
- **Konteks:** Validasi harus ada di klien (UX) **dan** di lapisan tepercaya (penegakan). Aturan server berada di SQL/RPC, sehingga skema TypeScript tidak otomatis menjadi sumber kebenaran server.
- **Kriteria:** asosiasi error ke field secara aksesibel; ukuran bundle; kemudahan menjaga aturan klien selaras dengan aturan server; tipe aman.
- **Pilihan:** (A) pustaka skema + pustaka form; (B) validasi native HTML + utilitas kecil; kandidat lain boleh ditambah.
- **Keputusan:** Belum ada.
- **Aturan tetap:** validasi klien tidak pernah menggantikan validasi server; setiap aturan bisnis kritis ada di database/RPC dan diuji (TEST-BKG-03, TEST-POS-01).
- **Task terdampak:** TITIS-107, TITIS-109 dan seluruh form.
- **Tanggal:** —

## 9. Autentikasi dan role

### DEC-016 — Autentikasi, sesi, sumber role, dan penamaan kunci
- **Status:** Proposed
- **Konteks:** Supabase Auth adalah baseline. Role harus dapat dipercaya dan tidak dapat diubah pengguna sendiri.
- **Pilihan:** (A) email + password, tanpa pendaftaran publik, role di tabel `profiles`; (B) magic link/OTP; (C) role di metadata pengguna.
- **Keputusan:** Usulan (A). Role dibaca dari `profiles` oleh fungsi pembantu database yang dipakai RLS. **Jangan** memakai metadata yang dapat diubah pengguna sebagai dasar otorisasi.
- **Penamaan kunci:** `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` (kunci publik). Supabase merekomendasikan *publishable key* (`sb_publishable_…`) dan *secret key* (`sb_secret_…`); *anon key* dan `service_role` adalah legacy keys yang menurut dokumentasi Supabase dijadwalkan dihentikan pada akhir 2026 (dicek 2026-10-10). Pakai legacy keys hanya bila project memang masih memakainya. Verifikasi kunci pada dashboard project saat TITIS-012 (guide §2.2: jangan mengandalkan ingatan). Secret key/`service_role` tidak pernah di klien.
- **Alasan:** Sederhana, tanpa akun publik, sesuai AC-AUTH-01.4.
- **Dampak:** Prosedur bootstrap Owner dan siklus akun Staff (OPEN-018) harus dirancang; pengaturan sign-up publik dinonaktifkan.
- **Dokumen/task terdampak:** `docs/SECURITY.md` §12, `.env.example`, TITIS-103, TITIS-106, TITIS-107.
- **Tanggal:** —

### Aturan di frontend
- Otorisasi di UI hanya menyembunyikan/mengarahkan; penegakan di database.
- Status sesi disediakan lewat satu provider; komponen tidak membaca token langsung.
- Tidak ada penyimpanan role di `localStorage` sebagai dasar keputusan.

## 10. Jalur tulis kritis

### DEC-006 — Jalur tulis booking publik
- **Status:** Proposed
- **Konteks:** Anonim harus dapat mengajukan booking tanpa mendapat akses tulis luas (THR-01).
- **Pilihan:** (A) `INSERT` langsung oleh `anon` dengan RLS — **tidak disarankan** (kontrol kolom/status lemah); (B) RPC database yang memaksa status dan memvalidasi; (C) Edge Function (untuk verifikasi bot, rate limit, atau integrasi notifikasi).
- **Keputusan:** Usulan (B). Naik ke (C) hanya bila DEC-017 memerlukan verifikasi/ratelimit yang tidak dapat dilakukan di database. Keputusan akhir dicatat di sini dan harus teruji (TEST-BKG-01, -02, -03, -08).
- **Alasan:** Daftar field terbatas, status dipaksa, validasi tepercaya, tanpa backend tambahan.
- **Dampak:** Kontrak input/output RPC menjadi bagian dari API yang diuji; respons publik minimal.
- **Dokumen/task terdampak:** `docs/SECURITY.md` §6.1, `docs/DATABASE.md`, TITIS-203.
- **Tanggal:** —

### DEC-017 — Perlindungan spam/abuse
- **Status:** Open
- **Konteks:** Form publik tanpa login rentan terhadap spam (THR-09; AC-BKG-01.6).
- **Opsi:** honeypot + batas permintaan menunggu per kontak (di RPC); verifikasi bot pihak ketiga yang diperiksa di Edge Function; pembatasan laju di lapisan hosting/edge.
- **Yang harus diputuskan:** tingkat risiko yang diterima, dampak UX, privasi, biaya, dan ketersediaan mekanisme sesuai hosting (DEC-012).
- **Keputusan:** Belum ada. Wajib `Accepted` sebelum TITIS-203 (jalur tulis publik); perlindungan yang dipilih diimplementasikan di RPC (TITIS-203) atau di TITIS-206 dan wajib selesai sebelum form publik dirilis.
- **Tanggal:** —

### DEC-007 — Penegakan anti-bentrok
- **Status:** Proposed
- **Konteks:** Pemeriksaan di UI/API tidak aman terhadap dua permintaan bersamaan (INV-BKG-05).
- **Pilihan:** (A) *exclusion constraint* pada booking `confirmed` per resource dan rentang waktu; (B) cek-lalu-tulis di RPC dengan kunci eksplisit; (C) cek di aplikasi — **ditolak**.
- **Keputusan:** Usulan (A) (ilustrasi di `docs/DATABASE.md` §7.1). Rincian batas interval, buffer, dan apakah `pending` memblokir mengikuti OPEN-009 dan OPEN-007.
- **Alasan:** Menegakkan invariant di database; aman terhadap konkurensi.
- **Dampak:** Memerlukan ekstensi PostgreSQL yang tersedia di Supabase; pelanggaran harus diterjemahkan menjadi pesan jelas.
- **Task terdampak:** TITIS-202, TITIS-205.
- **Tanggal:** —

### DEC-008 — Checkout atomik dan idempotency
- **Status:** Proposed
- **Konteks:** Checkout dan pembayaran mengubah beberapa record sebagai satu tindakan bisnis.
- **Pilihan:** (A) satu RPC yang menjalankan seluruh checkout dalam satu transaksi database; (B) beberapa panggilan dari klien — **ditolak**.
- **Keputusan:** Usulan (A). RPC menerima daftar item (rujukan katalog + kuantitas) dan `client_request_id`; **harga, total, pajak, diskon, dan nomor transaksi dihitung server**; hasil yang sama dikembalikan bila `client_request_id` diulang. Apakah pembayaran awal masuk RPC yang sama atau RPC terpisah ditentukan dengan OPEN-010/011.
- **Alasan:** Menghindari transaksi parsial dan ganda; menutup manipulasi harga.
- **Dampak:** Logika uang terpusat di database (DEC-009).
- **Task terdampak:** TITIS-304, TITIS-306, TITIS-310.
- **Tanggal:** —

## 11. Uang, waktu, dan tipe

### DEC-009 — Representasi uang dan angka
- **Status:** Proposed
- **Konteks:** Floating-point tidak boleh dipakai untuk uang (INV-POS-05).
- **Keputusan:** Usulan: `bigint` dalam satuan terkecil bisnis; jumlah desimal dari `business_settings.currency_decimals`; pajak/persen dalam *basis points*; aturan pembulatan diimplementasikan **sekali**, di database (fungsi kanonik). Jika klien menampilkan pratinjau total, ia hanya informatif dan wajib lulus uji paritas terhadap fungsi server (TEST-POS-05).
- **Dampak:** Format tampilan (pemisah ribuan, simbol) mengikuti OPEN-013 di lapisan presentasi.
- **Task terdampak:** TITIS-104, TITIS-302, TITIS-304.
- **Tanggal:** —

### Aturan waktu
- Semua instant `timestamptz`; zona waktu bisnis dari `business_settings.timezone`. Konversi hanya di lapisan presentasi dan di fungsi pelaporan. Lihat `docs/DATABASE.md` §3.2.

### DEC-010 — Tipe ter-generate dan representasi status
- **Status:** Proposed
- **Konteks:** Tipe buatan tangan dapat menyimpang dari database.
- **Keputusan:** Usulan: tipe TypeScript dihasilkan dari schema memakai tooling Supabase CLI dan di-commit; CI memeriksa tidak ada selisih terhadap schema (TEST-DB-04). Status bernilai terbatas (text + CHECK di database) dipetakan ke tipe union TS dari satu modul turunan, bukan diketik ulang.
- **Dampak:** Setiap perubahan migration diikuti sinkronisasi tipe.
- **Task terdampak:** TITIS-105 dan seterusnya.
- **Tanggal:** —

## 12. Konten publik dan SEO

### DEC-014 — Model konten CMS dan rendering aman
- **Status:** Proposed
- **Konteks:** Konten yang dapat diedit rentan terhadap XSS (THR-11; AC-CMS-02.3).
- **Pilihan:** (A) seksi terstruktur (`jsonb` dengan skema per jenis seksi) tanpa HTML bebas; teks kaya dibatasi pada subset markup sederhana yang dirender melalui sanitizer; (B) menyimpan HTML bebas lalu menyanitasi — risiko lebih tinggi.
- **Keputusan:** Usulan (A). Tautan hanya skema yang diizinkan (`http`, `https`, `mailto`, `tel`). Gambar hanya dari aset media terdaftar. Tidak pernah memakai pengaturan HTML mentah tanpa sanitizer.
- **Dampak:** Perlu skema field per seksi; editor sederhana. Daftar field final mengikuti OPEN-006; bahasa konten mengikuti OPEN-021.
- **Task terdampak:** TITIS-109, TITIS-110; TEST-CMS-03.
- **Tanggal:** —

### DEC-011 — Strategi SEO halaman publik
- **Status:** Open
- **Konteks:** SPA Vite merender di klien; konten dinamis penting mungkin tidak terindeks seperti yang diharapkan. Kebutuhan indeksasi belum diputuskan (OPEN-015).
- **Pilihan:**

  | Opsi | Ringkas | Kelebihan | Risiko/trade-off |
  |---|---|---|---|
  | A | SPA dengan metadata di klien saja | Paling sederhana | Tidak semua crawler/pratinjau sosial membaca konten klien |
  | B | SPA + *prerender* rute publik saat build | Tetap di Vite; HTML statis untuk crawler | Konten CMS berubah tanpa build ulang ⇒ perlu mekanisme pemicu/penyegaran |
  | C | Framework SSR/SSG untuk situs publik | SEO paling kuat | Mengubah baseline; kompleksitas lebih besar |
  | D | Situs publik statis terpisah dari admin | Pemisahan jelas | Dua artefak build dan deploy |

- **Keputusan:** Belum ada. Wajib dikunci (minimal arah) **sebelum DEC-002** (diputuskan di TITIS-004), karena memengaruhi routing. Keputusan SEO dicatat di TITIS-006. Perlu informasi dari OPEN-015: apakah indeksasi mesin pencari penting untuk bisnis pilot.
- **Dampak:** Memengaruhi routing, build, hosting (DEC-012), dan acceptance AC-PUB-01.3.
- **Task terdampak:** TITIS-106, TITIS-110.
- **Tanggal:** —

## 13. Lingkungan, hosting, dan tooling

### DEC-012 — Hosting, environment, dan deployment
- **Status:** Open
- **Konteks:** Provider, domain, dan prosedur belum dikunci (OPEN-014). Provider dari guide lama tidak boleh diambil otomatis.
- **Kebutuhan minimum penyedia:** hosting aset statis SPA dengan *fallback* rute klien; injeksi variabel lingkungan saat build; HTTPS dan domain kustom; deploy pratinjau (diutamakan); rollback ke build sebelumnya; kompatibel dengan opsi SEO yang dipilih.
- **Lingkungan:** development (Supabase lokal via CLI), staging (opsional; proyek Supabase terpisah), production. Credential, URL, seed, dan konfigurasi tidak tercampur. URL redirect autentikasi dan CORS disetel per lingkungan.
- **Keputusan:** Belum ada. Wajib `Accepted` sebelum setup deploy (TITIS-111); keputusannya dibahas di TITIS-005. Kandidat yang disebut di draf awal `TASK.md`: Cloudflare (Workers dengan static assets atau Pages); belum diputuskan.
- **Tanggal:** —

### DEC-015 — Package manager, runtime, dan CI
- **Status:** Proposed
- **Keputusan:** Usulan: `npm` dengan `package-lock.json` yang di-commit; Node.js 24 (Active LTS menurut jadwal rilis resmi Node.js) via `.nvmrc`; `engines` di `package.json` konsisten dengan `.nvmrc`; CI di GitHub Actions. Jadwal Node.js berubah per Oktober 2026 (Node 26 menuju LTS); tinjau ulang runtime saat TITIS-101 dan sebelum rilis (TITIS-410).
- **Aturan CI:** workflow dibuat **setelah** script nyata ada di `package.json` dan dapat dijalankan lokal; langkah CI = script yang sama (type-check, lint, test, build, test database bila tersedia). Tidak ada step CI untuk script yang tidak ada. CI minimal dibuat pada Phase 1 (TITIS-113) dan diperluas di Phase 4 (TITIS-403), agar pemeriksaan selisih tipe (DEC-010) dan test database berjalan sejak fondasi.
- **Dampak:** Versi paket dikunci saat scaffold lewat lockfile; reproduksi dari klon bersih diuji (TEST-REL-01).
- **Task terdampak:** TITIS-101, TITIS-403, TITIS-410.
- **Tanggal:** —

### DEC-013 — Tooling pengujian
- **Status:** Proposed (komponen E2E dan a11y otomatis: Open)
- **Keputusan:** Usulan: Vitest + React Testing Library untuk unit/komponen; `supabase test db` (pgTAP) untuk constraint, RLS, dan RPC; skrip integrasi dua-koneksi untuk uji konkurensi. **Open:** alat E2E (kandidat: Playwright) dan alat cek aksesibilitas otomatis; putuskan sebelum TITIS-404.
- **Alasan:** Menutup lapisan test yang dipetakan di `docs/TESTING.md`.
- **Task terdampak:** TITIS-101, TITIS-404.
- **Tanggal:** —

## 14. Error handling dan observability

### DEC-019 — Penanganan error dan observability
- **Status:** Proposed
- **Keputusan:** Usulan: *error boundary* per area (publik/admin); satu tipe error ternormalisasi (kode, pesan pengguna, detail tersanitasi) yang memetakan error database/RPC ke pesan yang dapat ditindaklanjuti (mis. bentrok jadwal, izin ditolak); state `loading/empty/error/forbidden` disediakan komponen standar (`DESIGN.md` §9). Log klien dan server tidak memuat token, secret, atau data pribadi (`docs/SECURITY.md` §8.2). **Open:** apakah layanan pelacakan error produksi diperlukan; bila ya, putuskan lewat DEC baru dengan memperhatikan privasi.
- **Task terdampak:** TITIS-106.
- **Tanggal:** —

## 15. Kebijakan dependency

Setiap dependency harus memenuhi **semua**:

1. Ada alasan tertulis (apa yang tidak dapat dilakukan platform/library yang sudah ada).
2. Dipilih di arsitektur atau dicatat sebagai DEC bila signifikan; **disetujui pemilik proyek** sebelum ditambahkan (`AGENTS.md` §3.2).
3. Pemeliharaan aktif, lisensi kompatibel dengan lisensi proyek (OPEN-017), dan tanpa advisori keamanan terbuka yang relevan.
4. Dampak ukuran bundle publik dipertimbangkan.
5. Lockfile ikut di-commit; pembaruan dependency dikerjakan sebagai task sendiri.

Jangan menambah library hanya karena kode hasil generator (mis. Google Stitch) memakainya.

## 16. Teknologi yang tidak dipakai

Tidak menjadi bagian TITIS kecuali ada DEC baru yang `Accepted`: FastAPI, Railway, Zustand, Web3 (dari desain lama), backend terpisah di luar kemampuan Supabase, serta provider hosting dari guide lama.

## 17. Batas frontend–database

| Hal | Frontend | Database/server |
|---|---|---|
| Hak akses | Menyembunyikan/mengarahkan | **Menegakkan** (RLS, grant, RPC) |
| Status booking | Menampilkan, meminta transisi | **Menetapkan** dan memvalidasi transisi |
| Harga/total/pajak/diskon | Menampilkan hasil server | **Menghitung** |
| Anti-bentrok | Menampilkan hasil/penjelasan | **Menegakkan** (constraint) |
| Idempotency | Membuat `client_request_id` | **Menegakkan** keunikan |
| Secret | Hanya kunci publik | Secret server |
| Validasi | UX (cepat, ramah) | **Penegakan** (otoritatif) |

## 18. Pertanyaan arsitektur terbuka

Seluruh pertanyaan terbuka dilacak sebagai DEC berstatus `Open` pada §3 (DEC-002, -003, -011, -012, -017) beserta sub-keputusan E2E/a11y pada DEC-013 dan layanan pelacakan error pada DEC-019. Pertanyaan baru ditambahkan sebagai DEC berikutnya.
