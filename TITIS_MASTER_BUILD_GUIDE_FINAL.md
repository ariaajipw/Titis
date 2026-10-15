# TITIS — Master Build Guide

> **Fungsi:** peta roadmap, cara kerja, milestone, dan release gate TITIS untuk solo developer dengan bantuan AI coding agent.
>
> **Baseline produk:** company profile fleksibel (template atau custom UI/UX berbasis kode), CMS sederhana, booking anti-bentrok, POS paid-in-full, dan laporan dasar.
>
> **Target waktu:** sekitar satu bulan, dengan lima hari kerja per minggu, 5–8 jam per hari. Rencana kerja memakai target 100–110 jam produktif dan memiliki buffer terbatas; target bukan jaminan.
>
> **Stack baseline:** Vite + React + TypeScript + Tailwind CSS v4 + Supabase (PostgreSQL, Auth, dan Storage sesuai kebutuhan). TanStack Query untuk server state; React Context/useReducer untuk state lokal sederhana bila dibutuhkan. Satu frontend dan satu instalasi Supabase untuk satu bisnis.
>
> **Revisi:** 2026-10-15. File ini menggantikan guide sebelumnya sebagai baseline rencana. Periksa repository sebelum melaporkan status implementasi.

---

## 1. Tujuan dan Sumber Kebenaran

Guide ini mengatur **urutan kerja proyek dan aturan lintas fase**, bukan spesifikasi detail semua fitur atau schema SQL.

| Dokumen | Sumber kebenaran untuk |
|---|---|
| `PRD.md` | Tujuan produk, scope MVP, requirement, dan acceptance criteria |
| `TITIS_MASTER_BUILD_GUIDE_FINAL.md` | Fase, timeline, workflow, release gate, dan aturan proyek |
| `ARCHITECTURE.md` | Struktur aplikasi, routing, data flow, library, dan batas frontend/server |
| `DESIGN.md` | Visual direction, design tokens, layout, responsive behavior, dan accessibility |
| `DATABASE.md` | Penjelasan tabel, relasi, status, constraints, serta invariants |
| `SECURITY.md` | Threat model, permission, RLS, privilege, dan penanganan secrets |
| `TESTING.md` | Strategi pengujian, test cases, dan verifikasi release |
| `AGENTS.md` | Batas tindakan dan aturan AI coding agent |
| `TASK.md` | Task aktif, status, dependensi, acceptance criteria, bukti, dan blocker |
| `supabase/migrations/*.sql` | Sumber kebenaran schema/function/policy yang dieksekusi |
| `README.md` | Setup, environment, command, tes, dan deployment yang benar-benar diverifikasi |

Jangan menggandakan checklist granular ke beberapa file. Detail task harian berada di `TASK.md`; guide menyimpan roadmap dan aturan lintas fase.

### 1.1 Aturan menyelesaikan konflik dokumen

Jika dokumen bertentangan, hentikan implementasi yang terpengaruh. Tentukan apakah konflik berada pada produk, desain, arsitektur, database, security, atau task status. Perbarui sumber kebenaran yang tepat, cek dokumen terkait, lalu lanjutkan setelah konflik selesai. Jangan meminta agent menebak dokumen mana yang benar.

---

## 2. Scope yang Mengikat

### 2.1 Termasuk MVP

- Satu company profile template yang responsif dan layak digunakan.
- Struktur komponen/design tokens yang memungkinkan developer menyesuaikan custom UI/UX per instalasi melalui kode.
- CMS sederhana untuk profil bisnis, teks/konten yang ditetapkan, dan gambar penting.
- Satu katalog produk/layanan yang dipakai website publik dan POS.
- Booking publik dengan status awal `pending`, dashboard Owner, dan pencegahan bentrok di database.
- POS dengan checkout lunas dan metode pembayaran manual: tunai, transfer, atau QRIS.
- Riwayat transaksi dan laporan penjualan dasar.
- Satu akun Owner, RLS, validasi di database/server, tes aturan bisnis inti, serta deployment.

### 2.2 Tidak dikerjakan pada MVP

Jangan mengimplementasikan item berikut kecuali pemilik proyek mengubah scope secara eksplisit:

- Akun Staff dan permission matrix.
- Page builder drag-and-drop atau editor HTML/CSS di dashboard.
- DP/pelunasan bertahap, payment gateway, refund, void, dan pengeditan transaksi selesai.
- Diskon, kupon, pajak kompleks, atau pembulatan khusus.
- Inventaris/stok, resep/BOM, supplier, dan purchase order.
- POS offline, notifikasi otomatis, reschedule/pembatalan mandiri oleh pengunjung.
- Multi-tenant SaaS, billing, analitik lanjutan, dan sistem akuntansi.
- Multi-bahasa dan SEO dinamis SSR/prerender tingkat lanjut.

Rincian kebutuhan dan kriteria penerimaan wajib mengikuti `PRD.md`. Fitur deferred tidak boleh diam-diam dianggap bagian MVP.

### 2.3 Definisi “custom UI/UX” untuk TITIS

Custom berarti developer menyesuaikan layout, komponen, token visual, dan presentasi melalui kode sambil tetap memakai backend, CMS, katalog, booking, dan POS yang sama. Custom tidak berarti klien dapat membangun layout sendiri dari dashboard. Perubahan konten sehari-hari harus tetap dapat dilakukan Owner tanpa developer.

---

## 3. Prinsip Teknis dan Keamanan

1. **Aturan bisnis penting tidak hanya dijaga UI.** Status booking, bentrok jadwal, harga, total checkout, dan izin harus diperkuat pada database/server.
2. **RLS dan grants ditinjau bersama.** RLS saja bukan pengganti pemeriksaan privilege untuk tabel, view, function, atau RPC.
3. **Tidak ada secret di frontend.** Kunci publishable dapat berada di frontend sesuai dokumentasi provider; service-role/secret key, password database, dan secret server tidak boleh berada dalam `VITE_*`, Git, log, atau prompt.
4. **Checkout atomik.** Order, item, dan pencatatan pembayaran harus berhasil atau gagal sebagai satu kesatuan.
5. **Harga dari database adalah acuan.** Frontend mengirim ID item dan kuantitas; server/database mengambil harga resmi dan menghitung total.
6. **Snapshot transaksi.** Simpan nama item dan harga saat transaksi agar katalog berikutnya tidak mengubah riwayat.
7. **Idempotensi checkout.** Retry dengan request ID yang sama tidak boleh membuat transaksi kedua.
8. **Booking anti-bentrok ditegakkan database.** Pemeriksaan UI saja tidak cukup untuk menghadapi permintaan bersamaan.
9. **Migration files adalah schema source of truth.** Jangan mengubah schema remote secara manual tanpa migration yang tercatat di Git.
10. **Dependency minimal.** Jangan menambah library kecuali ada kebutuhan jelas, kompatibilitas sudah dicek, dan manfaatnya disetujui.
11. **Error ditangani secara eksplisit.** Loading, empty, validation error, permission denied, network error, dan retry perlu UI yang bisa ditindaklanjuti.
12. **Tes yang dilaporkan harus benar-benar dijalankan.** Jangan mengklaim test/build lulus berdasarkan dugaan atau output agent tanpa bukti.

### 3.1 Booking anti-bentrok

Untuk kebutuhan resource dengan durasi dan buffer, gunakan strategi rentang waktu PostgreSQL yang menjaga aturan pada database, seperti `tstzrange` bersama exclusion constraint GiST dan `btree_gist` jika sesuai dengan schema final. Hanya booking berstatus `confirmed` yang memblokir resource. Tentukan dengan jelas bagaimana buffer 15 menit dimasukkan ke rentang yang dicek. Dua konfirmasi bersamaan tidak boleh menghasilkan dua booking overlap.

Jangan mengganti ini dengan unique index sederhana pada waktu mulai kecuali semua slot benar-benar fixed dan tidak mungkin mempunyai panjang/durasi berbeda.

### 3.2 POS checkout

Gunakan fungsi/RPC database untuk operasi checkout multi-record bila sesuai dengan threat model. Validasi permission, status katalog, kuantitas, harga resmi, total, dan idempotency key. Defaultkan fungsi ke privilege yang paling rendah; bila fungsi `SECURITY DEFINER` benar-benar diperlukan, batasi `EXECUTE`, tetapkan `search_path` yang aman, dan gunakan referensi tabel yang eksplisit. Tinjau dokumentasi resmi Supabase pada saat implementasi.

---

## 4. Batas Arsitektur Baseline

| Area | Baseline |
|---|---|
| Frontend | Vite + React + TypeScript |
| Styling | Tailwind CSS v4 dan design tokens |
| Server state | TanStack Query bila dibutuhkan; jangan menambahkan state library lain tanpa alasan |
| Routing | Tetapkan di `ARCHITECTURE.md` sebelum membuat semua halaman; gunakan satu pola yang konsisten |
| Backend | Supabase PostgreSQL + Auth; Storage hanya untuk media yang diperlukan |
| Database changes | Supabase CLI migrations dalam Git |
| Auth | Satu akun Owner; signup publik dimatikan |
| Hosting frontend | Cloudflare Workers Static Assets sesuai baseline proyek; verifikasi setup aktual sebelum deployment |
| Repository | Git + GitHub; lockfile dan runtime version disimpan |
| Language | Bahasa Indonesia untuk UI MVP |
| Deployment model | Satu frontend dan satu proyek backend per instalasi bisnis; bukan multi-tenant SaaS |

Versi paket dan runtime harus diverifikasi saat scaffold berdasarkan dokumentasi resmi dan dikunci di lockfile. Jangan mengandalkan versi yang hanya disebut model AI.

### 4.1 Trade-off SEO yang harus dipahami

Baseline Vite adalah SPA yang mengambil konten dari Supabase. Metadata dasar dapat disediakan pada MVP, tetapi konten dinamis dan metadata tidak otomatis setara dengan SSR/prerender. Jangan menjanjikan SEO teknis lengkap kepada klien. Kebutuhan prerender/SSR perlu dievaluasi terpisah setelah MVP agar tidak diam-diam memperbesar scope.

---

## 5. Rencana Satu Bulan

Target rencana adalah sekitar **100–110 jam produktif**. Dengan 5 hari kerja per minggu, target ini setara rata-rata 5–6 jam fokus pada setiap hari kerja selama empat minggu. Jika implementasi aktual membutuhkan lebih banyak waktu, prioritaskan acceptance criteria inti; jangan menghapus tes keamanan atau integritas data demi mengejar tanggal.

| Minggu | Fokus | Perkiraan | Hasil akhir |
|---|---|---:|---|
| Minggu 1 | Scope freeze, repo/tooling, design tokens, auth Owner, schema awal, template publik dan CMS dasar | 22–27 jam | App berjalan, Owner dapat login, profil dasar dapat diubah dan ditampilkan |
| Minggu 2 | Halaman publik, CMS inti, gambar minimum, katalog dan resource/jam operasional | 25–28 jam | Template usable, konten/katalog terkelola, layout siap disesuaikan melalui kode |
| Minggu 3 | Booking form, dashboard booking, aturan waktu, anti-bentrok database, tes concurrency dan authorization | 23–28 jam | Booking dapat diajukan dan diputuskan; bentrok tidak dapat dikonfirmasi |
| Minggu 4 | POS checkout, riwayat transaksi, laporan dasar, integrasi end-to-end, hardening dan deployment | 28–32 jam | Alur booking + POS bekerja, laporan diverifikasi, build/deployment dan dokumentasi diperiksa |

**Catatan realisme:** minggu keempat padat. Jika waktu mulai meleset, bekukan desain visual pada komponen yang sudah ada, kurangi animasi/varian template, dan tunda item non-kritis. Jangan mengurangi RLS, validasi backend, atomic checkout, anti-bentrok booking, atau tes utama.

### 5.1 Urutan implementasi yang dianjurkan

1. Bekukan scope dan buat catatan teknis yang belum diputuskan.
2. Siapkan repository, lint/build/test commands, Supabase development, serta migration dasar.
3. Buat design tokens dan template public shell; siapkan login Owner.
4. Selesaikan profil/CMS dan katalog bersama sebelum booking/POS mengandalkan datanya.
5. Buat resource/jam operasional dan booking dengan constraints serta test terlebih dahulu.
6. Buat POS RPC/checkout dengan snapshot dan idempotency.
7. Buat laporan dari data transaksi yang sudah terverifikasi.
8. Jalankan tes lintas fitur, security review, build, smoke test, dan deployment.

---

## 6. Gate Fase dan Exit Criteria

### PHASE 0 — Scope dan Persiapan

**Tujuan:** tidak ada ambiguitas kritis yang akan mengubah struktur data, security, atau alur produk di tengah implementasi.

Checklist:

- [ ] Scope MVP dan deferred di `PRD.md` dipahami.
- [ ] Batas template versus custom UI/UX jelas.
- [ ] Model satu bisnis dan satu Owner disepakati.
- [ ] Aturan booking: resource, jam operasional, status, buffer, batas waktu, dan anti-bentrok dicatat.
- [ ] Aturan checkout: metode pembayaran, harga DB, snapshot, idempotency, dan transaksi lunas dicatat.
- [ ] Stack, data flow, auth, RLS, serta deployment direction tercatat di `ARCHITECTURE.md` / `SECURITY.md`.
- [ ] `AGENTS.md` dan `TASK.md` tersedia sebelum coding lintas modul.

**Exit criteria:** keputusan yang memengaruhi schema, akses data, booking, checkout, dan laporan sudah ditetapkan atau diberi label `Deferred` dengan alasan serta dampak yang disetujui. Tidak ada blocker penting yang diserahkan kepada AI untuk ditebak.

### PHASE 1 — Foundation, Owner Auth, Company Profile dan CMS

Deliverables:

- [ ] Repository dan lockfile tersedia; versi runtime dicatat.
- [ ] Frontend bisa dijalankan lokal dengan design tokens awal.
- [ ] Supabase development disiapkan; secrets tidak ditaruh di frontend.
- [ ] Migration awal untuk profil bisnis dan domain minimum tersedia di Git.
- [ ] Login/logout Owner bekerja; tidak ada signup publik.
- [ ] Public shell dan template dasar memiliki halaman inti.
- [ ] Owner dapat mengubah profil dan field konten minimum.
- [ ] Halaman publik membaca konten yang disimpan dan memiliki state loading/error/empty yang sesuai.
- [ ] RLS dan direct-access tests membuktikan pengguna anonim tidak dapat memodifikasi data internal.

**Exit criteria:** Owner bisa login, mengubah konten, dan melihat hasilnya pada website. Build dasar berjalan. Perubahan schema dapat direproduksi dari migration.

### PHASE 2 — Template, Customization seam, Katalog dan Resource

Deliverables:

- [ ] Halaman publik Beranda, Tentang, Produk/Layanan, fasilitas (jika relevan), Booking, Kontak, dan 404 tersedia.
- [ ] Design tokens dan komponen dasar ditata agar developer dapat menyesuaikan UI/UX tanpa mengubah data layer.
- [ ] Gambar minimum (logo/hero/katalog) dapat dikelola dengan validasi dasar.
- [ ] Produk/layanan dapat ditambah, diedit, dan dinonaktifkan.
- [ ] Website publik dan POS memakai katalog yang sama; item nonaktif tidak terlihat/dijual.
- [ ] Owner dapat mengelola resource dan jam operasional.
- [ ] Responsive checks dilakukan pada ukuran mobile dan desktop.

**Exit criteria:** konten dan katalog dapat dikelola tanpa mengedit kode. Penyesuaian layout tersedia melalui komponen/token kode. Tidak ada akses anonim untuk operasi admin.

### PHASE 3 — Booking dan Anti-Bentrok

Deliverables:

- [ ] Form booking publik memerlukan field minimum yang disetujui.
- [ ] Sistem menetapkan status `pending`; response tidak menyatakan booking sudah dikonfirmasi.
- [ ] Validasi input dilakukan di client untuk UX dan di database/server untuk enforcement.
- [ ] Waktu/resource/jam operasional/batas durasi/buffer divalidasi.
- [ ] Constraint/database strategy mencegah booking `confirmed` overlap untuk resource sama.
- [ ] Status pending tidak memblokir slot, tetapi konfirmasi yang bertabrakan ditolak oleh database.
- [ ] Dashboard Owner dapat melihat, mengonfirmasi, menolak, dan membatalkan booking.
- [ ] Data pribadi booking tidak dapat dibaca publik.
- [ ] Ada perlindungan spam sederhana dan pesan privasi.
- [ ] Test mencakup input tidak valid, overlap, batas interval, dua konfirmasi bersamaan, unauthorized access, dan error network.

**Exit criteria:** acceptance criteria booking di `PRD.md` lulus, termasuk test concurrency/anti-bentrok di database. Tidak cukup hanya memeriksa jadwal di UI.

### PHASE 4 — POS, Reports, Hardening dan Release

Deliverables:

- [ ] Keranjang hanya menerima produk/layanan aktif.
- [ ] Checkout menghitung ulang harga dan total di database/server.
- [ ] Order, item, dan pembayaran tersimpan atomik.
- [ ] Detail item menyimpan snapshot nama/harga.
- [ ] Request ID idempotency mencegah transaksi ganda pada retry.
- [ ] Metode tunai, transfer, QRIS dicatat manual; tidak ada DP/payment gateway.
- [ ] Riwayat transaksi tidak memungkinkan edit/hapus transaksi selesai.
- [ ] Laporan dapat difilter berdasarkan periode dan direkonsiliasi dengan fixture.
- [ ] RLS/grants/function permissions diperiksa untuk semua tabel/jalur yang terekspos.
- [ ] Type-check/lint/test/build yang tersedia lulus berdasarkan hasil aktual.
- [ ] Login → edit konten → submit booking → keputusan Owner → checkout → laporan diuji.
- [ ] Environment, secrets, migrations, error states, dan responsive UI diperiksa.
- [ ] README menjelaskan instalasi, env, migrations, tes, deployment, serta batasan MVP.
- [ ] Lisensi dan atribusi aset/dependency diperiksa sebelum open-source release.

**Exit criteria:** tidak ada temuan security blocker yang diketahui; alur utama berjalan; laporan direkonsiliasi; build dan tes yang disepakati lulus; dokumentasi setup diuji; pemilik proyek menyetujui rilis.

---

## 7. Strategi Testing Minimum

### 7.1 Frontend dan UX

- Halaman publik pada ukuran mobile dan desktop.
- Form validasi: valid, invalid, loading, success, error, dan retry.
- Login/logout Owner dan akses route internal.
- Empty state saat belum ada konten, katalog, booking, atau transaksi.
- Input keyboard/focus dan label dasar.

### 7.2 Database dan akses

- Anonymous tidak dapat membaca data internal atau mengubah data Owner.
- Owner dapat melakukan operasi yang diizinkan.
- Fungsi/RPC hanya dapat dipanggil role yang diperlukan.
- Price/total yang dimanipulasi dari browser tidak mengubah total final.
- Checkout gagal di tengah proses tidak meninggalkan order/item/pembayaran parsial.
- Retry dengan idempotency key sama tidak membuat penjualan kedua.
- Migration berjalan dari database development/test yang bersih.

### 7.3 Booking

- Waktu lampau, selesai <= mulai, resource nonaktif, durasi di luar batas, serta di luar jam operasional ditolak.
- Pending tidak memblokir slot.
- Confirmed overlap pada resource yang sama ditolak.
- Rentang `[mulai, selesai)` dan buffer 15 menit diuji pada batas-batas waktunya.
- Dua konfirmasi overlap yang terjadi berdekatan tidak dapat sama-sama sukses.
- Pengunjung tidak bisa menetapkan status booking atau membaca booking lain.

### 7.4 Laporan

Gunakan data fixture yang kecil dan dapat dihitung manual. Bandingkan total penjualan, jumlah transaksi, totals per metode pembayaran, dan booking per status. Jangan menyatakan laporan akurat hanya karena angka tampak masuk akal.

---

## 8. Aturan Repository, Migration, dan Secret

- Gunakan Git dan commit kecil yang terkait dengan satu tujuan.
- Periksa `git status` dan diff sebelum dan sesudah setiap task lintas modul.
- Simpan perubahan schema, constraints, indexes, RLS policies, functions/RPC, dan seed yang diperlukan dalam repository.
- Jangan menerapkan migration remote yang berisiko tanpa meninjau SQL, memahami dampak, dan memiliki rencana pemulihan.
- Jangan menjalankan operasi destruktif pada production tanpa persetujuan eksplisit serta backup/recovery plan yang sesuai.
- `.env.example` berisi nama variabel dan placeholder, tidak pernah nilai secret asli.
- Anggap semua `VITE_*` terlihat di browser.
- Jangan memasukkan data pelanggan asli ke test fixture; gunakan data sintetis.
- Jika suatu secret terlanjur terekspos, rotasi secret; menghapus baris dari file saja tidak cukup.
- Setelah schema berubah, sinkronkan tipe database yang dihasilkan bila fitur itu digunakan dan jalankan tes terkait.

Referensi resmi yang perlu dicek saat implementasi:

- Supabase Database Migrations: https://supabase.com/docs/guides/local-development/database-migrations
- Supabase Database Functions: https://supabase.com/docs/guides/database/functions
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- PostgreSQL Range Types: https://www.postgresql.org/docs/current/rangetypes.html
- PostgreSQL Constraints: https://www.postgresql.org/docs/current/ddl-constraints.html

Dokumentasi dapat berubah. Gunakan dokumentasi versi aktual dan konfigurasi repository yang benar-benar tersedia.

---

## 9. Workflow AI Coding Agent

### 9.1 Sebelum task

1. Baca `TITIS_MASTER_BUILD_GUIDE_FINAL.md`, `AGENTS.md`, `TASK.md`, dan dokumen khusus domain task tersebut.
2. Periksa `git status`; pahami perubahan yang belum di-commit.
3. Minta agent merangkum masalah, scope, acceptance criteria, file yang akan berubah, dan cara verifikasi sebelum task yang menyentuh beberapa file, database, atau security.
4. Jika keputusan produk/teknis penting belum jelas, hentikan task dan catat blocker—jangan mengizinkan agent mengasumsikan keputusan.

### 9.2 Saat task

- Satu agent menjadi penulis aktif pada satu waktu.
- Agent lain boleh review read-only, bukan mengedit file sama secara bersamaan.
- Kerjakan satu task terbatas; jangan meminta agent membangun seluruh aplikasi sekaligus.
- Jangan menambah dependency, mengganti stack, memperluas scope, menjalankan migration remote, push, atau deploy tanpa izin yang sesuai.
- Jangan izinkan agent menghapus/menonaktifkan test hanya agar build hijau.

### 9.3 Setelah task

1. Periksa diff, termasuk dependency, lockfile, migrations, policies, functions, dan tests.
2. Jalankan command yang benar-benar tersedia di `package.json` atau konfigurasi proyek.
3. Laporkan command dan hasil aktual; bedakan test yang lulus, gagal, dan belum dijalankan.
4. Perbarui `TASK.md` dengan status, bukti, blocker, dan langkah berikutnya.
5. Perbarui dokumen sumber kebenaran jika keputusan/behavior memang berubah.
6. Commit hanya setelah review dan verifikasi yang relevan.

### 9.4 Format task minimum di `TASK.md`

```markdown
## [TITIS-XXX] Judul
- Status: Ready / In Progress / Review / Done / Blocked / Deferred
- Phase: PHASE N
- Depends on: [task ID atau None]
- Scope:
- Out of scope:

### Acceptance criteria
- [ ] Hasil yang dapat diamati dan diuji

### Verification
- [ ] Tes/command/manual check

### Evidence / notes
- Hasil aktual:
- File/migration:
- Known issue/blocker:
```

Gunakan `Done` hanya ketika acceptance criteria lulus dan bukti tersedia.

---

## 10. Perubahan Scope dan Risiko

Sebelum menerima fitur baru, tulis:

1. Kebutuhan pengguna yang dipenuhi.
2. Perkiraan waktu dan risiko teknis.
3. Dampak pada database, security, desain, tes, dan dokumentasi.
4. Fitur atau varian visual apa yang harus ditunda agar target waktu tetap masuk akal.

Jika target bulan pertama berisiko lewat, urutan pengurangan scope adalah:

1. Kurangi animasi, efek visual, varian komponen, dan penyempurnaan yang tidak penting.
2. Tunda item terlaris bila query/visualisasi menambah waktu berarti.
3. Tunda pengaturan tema tambahan di dashboard; pertahankan custom design berbasis kode.
4. Tunda SEO lanjutan, multi-bahasa, notifikasi otomatis, dan workflow konten kompleks.

**Jangan dikurangi:** kontrol akses/RLS, validasi backend, database anti-bentrok, atomic checkout, snapshot harga, idempotensi checkout, tes skenario kritis, atau perlindungan secret.

Risiko utama yang perlu dimonitor adalah custom design yang terus bertambah, SEO dinamis SPA, spam booking, transaksi POS yang keliru tanpa fitur void, dan scope creep.

---

## 11. Checklist Sebelum Release

### Produk

- [ ] Alur company profile dan CMS berfungsi.
- [ ] Template mudah digunakan; extension point untuk custom UI/UX terdokumentasi.
- [ ] Katalog publik dan POS menggunakan sumber data yang sama.
- [ ] Booking dapat diajukan dan diputuskan oleh Owner.
- [ ] Bentrok booking dicegah di database dan diuji.
- [ ] Checkout, riwayat transaksi, dan laporan dapat direkonsiliasi.
- [ ] Batasan MVP (tanpa DP, void/refund, stok, notifikasi otomatis, dan multi-bahasa) tercatat.

### Security dan data

- [ ] RLS, grants, function/RPC access, serta operasi anonim ditinjau.
- [ ] Tidak ada secret di frontend, repo, log, atau dokumentasi.
- [ ] Migration yang dibutuhkan ada di Git dan diuji pada environment yang aman.
- [ ] Tidak ada data parsial setelah checkout gagal.
- [ ] Tidak ada transaksi duplikat dari retry dengan request ID sama.

### Kualitas dan release

- [ ] Tes yang disepakati, type-check, lint, dan build berjalan sesuai script proyek.
- [ ] Satu alur end-to-end diuji.
- [ ] Halaman publik responsif dan field form memiliki label/error yang layak.
- [ ] Setup dari repository bersih sudah dicoba.
- [ ] README menjelaskan setup dan deployment yang benar-benar diverifikasi.
- [ ] Known issues dan keterbatasan SEO SPA didokumentasikan.
- [ ] Pemilik proyek menyetujui release.

---

## 12. Ringkasan Pegangan

- **PRD menyatakan apa yang dibangun.**
- **Build Guide menyatakan urutan dan cara kerja proyek.**
- **Custom UI/UX berarti penyesuaian berbasis kode, bukan page builder.**
- **Booking yang terkonfirmasi tidak boleh overlap; constraint database menjadi penjaga terakhir.**
- **POS hanya transaksi lunas; harga dihitung oleh database, item menyimpan snapshot, dan retry harus idempotent.**
- **Satu Owner, tanpa Staff pada MVP.**
- **Fitur deferred tetap deferred sampai scope diubah secara eksplisit.**
- **Tidak ada klaim test selesai tanpa bukti aktual.**
