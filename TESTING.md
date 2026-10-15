# TESTING.md — Strategi Pengujian TITIS

> **Tujuan:** mendefinisikan strategi, skenario uji, bukti verifikasi, dan release gate untuk MVP TITIS.
>
> **Status:** baseline pengujian; sesuaikan nama command dengan script yang benar-benar tersedia di repository.
>
> **Revisi:** 2026-10-15
>
> **Prinsip utama:** status tes hanya boleh dilaporkan sebagai lulus jika tes benar-benar dijalankan dan hasilnya tersedia. Tes yang belum dijalankan bukan tes lulus.

---

## 1. Sumber Kebenaran dan Batas Dokumen

Gunakan dokumen berikut sebagai acuan ketika menyusun atau memperbarui tes:

| Sumber | Acuan pengujian |
|---|---|
| `PRD.md` | Scope MVP, alur pengguna, requirement, dan acceptance criteria produk |
| `TITIS_MASTER_BUILD_GUIDE_FINAL.md` | Urutan verifikasi, workflow, dan release gate |
| `DESIGN.md` | Visual direction, design tokens, layout, responsive behavior, dan accessibility |
| `ARCHITECTURE.md` | Routing, data flow, batas frontend/server, dan struktur aplikasi |
| `DATABASE.md` | Schema, relasi, status, constraints, dan invariants database |
| `SECURITY.md` | Threat model, akses, RLS, grants, privilege, dan penanganan secrets |
| `supabase/migrations/*.sql` | Schema, function/RPC, constraint, index, dan policy yang benar-benar diterapkan |
| `package.json` dan konfigurasi test | Command serta konfigurasi tooling yang benar-benar tersedia |

`PRD.md` merupakan sumber kebenaran kebutuhan produk. Migration menjadi sumber kebenaran untuk schema yang dieksekusi. Jika dokumen bertentangan, hentikan tes atau implementasi yang terpengaruh, catat konflik, lalu selesaikan pada dokumen sumber yang tepat. Jangan menebak keputusan yang belum ditetapkan.

Dokumen ini menetapkan cakupan uji, bukan menyatakan bahwa implementasi atau tes sudah tersedia. Sebelum menambahkan atau mengubah skenario, periksa repository, script, migration, dan konfigurasi aktual. Nilai desain spesifik seperti warna, breakpoint, ukuran tipografi, dan aturan kontras harus diambil dari `DESIGN.md`; jangan menetapkan nilai baru di sini.

## 2. Tujuan dan Prinsip Testing

Pengujian harus memberikan bukti bahwa:

1. Halaman publik, CMS, dan dashboard Owner memenuhi acceptance criteria MVP.
2. UI mudah digunakan pada mobile dan desktop serta menyediakan state dan aksesibilitas dasar yang layak.
3. Pengguna anonim tidak dapat membaca atau mengubah data internal.
4. Aturan penting ditegakkan pada database/server, bukan hanya di browser.
5. Booking terkonfirmasi tidak saling berbenturan, termasuk ketika request terjadi bersamaan.
6. POS menyimpan transaksi lunas secara atomik, memakai harga resmi, menyimpan snapshot item, dan aman terhadap retry.
7. Laporan dihitung dari transaksi yang tersimpan serta cocok dengan fixture yang dapat dihitung manual.
8. Migrations, setup, tes, dan build dapat diverifikasi pada environment yang aman.

Aturan umum:

- Gunakan data sintetis; jangan menggunakan data pelanggan atau transaksi nyata dalam fixture.
- Jalankan integration/security test pada database development/test terisolasi, bukan production.
- Jangan menaruh service-role key, password database, atau secret lain di source control, log, browser, fixture, atau dokumentasi.
- Perlakukan semua variabel `VITE_*` sebagai nilai yang terlihat oleh browser.
- Jangan menghapus atau menonaktifkan test agar build terlihat hijau.
- Setiap bug yang ditemukan perlu direproduksi sebagai regression test jika memungkinkan.
- Bedakan `PASS`, `FAIL`, `BLOCKED`, dan `NOT RUN`; `BLOCKED` atau `NOT RUN` bukan bukti lulus.

## 3. Cakupan MVP dan Di Luar Cakupan

### 3.1 Termasuk pengujian MVP

- Website publik: Beranda, Tentang, Produk/Layanan, Ruang/Fasilitas bila relevan, Booking, Kontak, dan 404.
- Login/logout satu akun Owner; signup publik tidak tersedia.
- CMS untuk field profil/konten yang ditetapkan dan media minimum.
- Katalog produk/layanan bersama untuk website publik dan POS.
- Form booking publik tanpa akun, keputusan booking oleh Owner, validasi waktu/resource, serta pencegahan bentrok di database.
- POS dengan checkout lunas dan pembayaran manual: tunai, transfer, atau QRIS.
- Riwayat transaksi dan laporan operasional dasar.
- RLS, grants, izin function/RPC, validasi database/server, dan perlindungan secrets.
- Responsivitas, loading/empty/success/error state, label form, dan fokus keyboard.
- Migration dari database test bersih, build, dan smoke test end-to-end.

### 3.2 Tidak termasuk pengujian fitur yang belum masuk MVP

Jangan memperlakukan hal-hal berikut sebagai acceptance criteria MVP kecuali scope diubah secara eksplisit: akun Staff/permission matrix, page builder drag-and-drop, layout yang diedit Owner secara bebas, DP/pelunasan bertahap, payment gateway/webhook, refund/void, pengeditan transaksi selesai, diskon/kupon/pajak kompleks, stok/inventaris, POS offline, notifikasi otomatis, pembatalan/reschedule mandiri oleh pengunjung, multi-tenant SaaS, multi-bahasa, serta SEO dinamis SSR/prerender tingkat lanjut.

## 4. Strategi dan Lapisan Pengujian

| Lapisan | Tujuan | Tool/pendekatan baseline |
|---|---|---|
| Unit | Menguji fungsi murni, validasi input, pemformatan, perhitungan UI, dan utility | Vitest |
| Component/UI | Menguji perilaku komponen yang terlihat pengguna, interaksi, label, dan state | Vitest + React Testing Library |
| Integration frontend/API | Menguji interaksi antar-komponen, query/mutation, penanganan error, dan boundary data | Vitest serta test setup repository |
| Database/security | Menguji constraints, function/RPC, transaction atomicity, RLS, grants, dan izin | Supabase test database; pgTAP bila sudah tersedia/terkonfigurasi |
| End-to-end/smoke | Memeriksa alur lintas fitur secara manual atau menggunakan E2E tooling yang memang tersedia | Checklist alur; jangan mengasumsikan framework E2E sudah terpasang |
| Release verification | Memeriksa type-check, lint, test, build, migrations, konfigurasi environment, dan dokumentasi | Script aktual dari repository serta checklist manual |

Gunakan Vitest dan React Testing Library untuk unit/component test. Gunakan database test terisolasi untuk aturan yang harus ditegakkan oleh PostgreSQL/Supabase. Jika `supabase test db` atau pgTAP belum tersedia, tandai sebagai gap tooling dan sepakati cara verifikasi sebelum release; jangan menganggap tes database telah dilakukan hanya karena tes frontend lulus.

## 5. Environment, Data, dan Persiapan

### 5.1 Environment

1. Gunakan instalasi lokal/test yang terpisah dari production.
2. Pastikan konfigurasi Supabase lokal/test, migration, dan environment variable sesuai dokumentasi repository.
3. Pastikan akun/role untuk skenario anonim dan Owner dapat dibuat atau disediakan secara aman.
4. Bersihkan data fixture sebelum suite berjalan dan setelah suite selesai jika diperlukan.
5. Jalankan tes concurrency dalam environment khusus tes agar hasil tidak dipengaruhi aktivitas pengguna lain.
6. Jangan jalankan reset database, migration destruktif, atau tes yang mengubah banyak data di production.

### 5.2 Fixture minimum

Buat fixture sintetis dan stabil untuk kebutuhan uji berikut. ID boleh tetap agar test deterministik; gunakan ID unik bila test dijalankan paralel.

| Fixture | Data uji minimum | Tujuan |
|---|---|---|
| Owner | Satu akun Owner sintetis | Login dan operasi administratif |
| Anonymous | Session tanpa login | Uji akses publik dan penolakan akses internal |
| Profil bisnis | Nama, kontak, jam buka, konten opsional terisi dan kosong | CMS, halaman publik, empty state |
| Katalog aktif | Minimal dua item dengan harga berbeda | Katalog, POS, laporan |
| Katalog nonaktif | Satu item nonaktif | Memastikan item tidak dijual atau ditampilkan publik |
| Resource aktif | Satu resource dengan jam operasional yang diketahui | Booking valid dan batas jam |
| Resource nonaktif | Satu resource nonaktif | Penolakan booking |
| Booking | Data `pending`, `confirmed`, ditolak, dan dibatalkan sesuai state yang didukung | Dashboard, overlap, laporan status |
| Transaksi | Beberapa transaksi lunas dengan item dan metode pembayaran berbeda | Riwayat dan rekonsiliasi laporan |
| Waktu | Waktu tetap/terkontrol dengan zona waktu bisnis | Pengujian batas tanggal, jam operasional, dan laporan |

Jangan mengandalkan waktu sistem yang berubah selama test. Gunakan clock/fixed timestamp untuk unit test, atau siapkan waktu fixture eksplisit untuk integration test.

### 5.3 Aturan tanggal dan uang yang harus dihormati tes

- Zona waktu bisnis: `Asia/Jakarta`.
- Mata uang: Rupiah (IDR); pemformatan UI menggunakan format Indonesia.
- Jangan menggunakan floating-point untuk menghitung nominal uang.
- Laporan dan filter tanggal harus memakai definisi rentang waktu yang konsisten dengan implementasi database dan aturan bisnis.
- Booking mengikuti slot mulai 60 menit, durasi kelipatan 60 menit dengan maksimum 4 jam, buffer 15 menit, dan horizon pemesanan maksimum 30 hari ke depan.
- Detail batas waktu, interval, dan buffer harus cocok dengan `PRD.md`, `DATABASE.md`, serta migration yang berlaku.

## 6. Frontend, UX, Desain, dan Aksesibilitas

Untuk seluruh halaman publik, bandingkan implementasi dengan `DESIGN.md` dan acceptance criteria pada `PRD.md`. Jangan mengunci angka breakpoint atau nilai token baru di `TESTING.md`.

| ID | Prioritas | Skenario | Langkah ringkas | Hasil yang diharapkan |
|---|---|---|---|---|
| UI-001 | P0 | Halaman publik pada mobile | Buka semua halaman inti pada ukuran mobile yang disepakati proyek | Konten utama tidak terpotong; navigasi, CTA, dan form dapat digunakan; tidak ada overflow yang menghalangi penggunaan |
| UI-002 | P0 | Halaman publik pada desktop | Buka halaman inti pada ukuran desktop yang disepakati | Layout mengikuti `DESIGN.md`; konten tidak saling menimpa dan CTA tetap jelas |
| UI-003 | P0 | Navigasi dan 404 | Klik tautan navigasi/CTA dan akses route yang tidak dikenal | Tautan menuju tujuan yang benar; route tidak dikenal menampilkan 404 dengan cara kembali yang jelas |
| UI-004 | P0 | Konten opsional kosong | Kosongkan field/section opsional pada fixture | Section disembunyikan atau ditampilkan sesuai desain; tidak ada placeholder rusak atau error |
| UI-005 | P0 | Loading state | Simulasikan query lambat pada halaman yang memuat data | Indikator/loading state tampil dan tidak memberi kesan data kosong atau berhasil sebelum waktunya |
| UI-006 | P0 | Empty state | Kosongkan konten, katalog, booking, atau transaksi sesuai skenario | Pesan empty state tepat, tidak menampilkan data lama, dan tidak menawarkan aksi yang tidak diizinkan |
| UI-007 | P0 | Error state | Simulasikan error jaringan/server untuk operasi baca dan tulis | Pesan error dapat dipahami; UI tidak melaporkan operasi berhasil; pengguna mendapat langkah yang masuk akal |
| UI-008 | P0 | Retry | Setelah error, pulihkan layanan lalu coba ulang | Retry mengulang operasi yang tepat, tidak menggandakan mutasi, dan status UI diperbarui |
| UI-009 | P0 | Form valid | Isi seluruh field wajib dengan nilai valid | Validasi lolos dan operasi berjalan; loading dan success state ditampilkan pada waktu yang benar |
| UI-010 | P0 | Form invalid | Kosongkan field wajib atau isi format yang tidak valid | Submit ditolak; pesan validasi terkait field jelas; data yang belum valid tidak dikirim sebagai sukses |
| UI-011 | P0 | Keyboard/focus | Navigasikan halaman dan form tanpa mouse | Elemen interaktif dapat dicapai; urutan fokus masuk akal; fokus terlihat sesuai `DESIGN.md` |
| UI-012 | P0 | Label form | Periksa semua input dan pesan kesalahan dengan accessibility tree/tes komponen | Input mempunyai label yang dapat dikenali; pesan validasi terhubung secara layak dengan input terkait |
| UI-013 | P0 | Kontras dan keterbacaan | Periksa teks, state, kontrol, dan fokus terhadap panduan desain | Kontras serta keterbacaan memenuhi kriteria pada `DESIGN.md`; status tidak hanya dibedakan oleh warna jika itu melanggar standar proyek |
| UI-014 | P0 | CMS memperbarui website | Owner simpan perubahan pada konten fixture | Data baru tampil di website publik tanpa perubahan kode; state success/error benar |
| UI-015 | P0 | Validasi unggahan gambar | Unggah file tipe/ukuran yang diperbolehkan lalu file yang dilarang | File valid diterima; file invalid ditolak dengan pesan jelas; aturan sama ditegakkan pada lapisan tepercaya jika diwajibkan |
| UI-016 | P0 | Keamanan render konten CMS | Simpan teks yang menyerupai HTML/script pada field uji yang mengizinkan teks biasa | Konten tampil sebagai teks aman; tidak ada script/HTML berbahaya yang dieksekusi |
| UI-017 | P1 | Komponen dan design token | Periksa halaman publik terhadap token/komponen yang didefinisikan | Komponen konsisten; custom UI/UX dapat mengubah presentasi tanpa mengubah model data inti |
| UI-018 | P1 | Format bahasa dan angka | Periksa tanggal, waktu, angka dan nominal pada UI | Bahasa utama Indonesia; tanggal/angka/nominal mengikuti format yang disepakati dan IDR |

**Kriteria lulus UI:** seluruh kasus P0 lulus pada halaman/flow yang tersedia; tidak ada blocker responsivitas atau aksesibilitas dasar. Catat ukuran layar, browser, halaman, bukti visual, dan defect yang ditemukan.

## 7. Autentikasi, Otorisasi, RLS, dan Keamanan

Tes akses harus dilakukan melalui jalur yang benar-benar diekspos aplikasi—termasuk API/database, tabel, view, function/RPC, dan operasi Storage jika digunakan. Keberhasilan menyembunyikan tombol di UI bukan bukti keamanan.

| ID | Prioritas | Skenario | Langkah ringkas | Hasil yang diharapkan |
|---|---|---|---|---|
| SEC-001 | P0 | Login Owner valid | Login memakai akun Owner test | Session valid; dashboard internal dapat diakses |
| SEC-002 | P0 | Login invalid | Gunakan kredensial salah/kosong | Login ditolak; tidak ada session baru; pesan tidak membocorkan informasi sensitif |
| SEC-003 | P0 | Logout Owner | Logout lalu akses route internal langsung | Session dibersihkan dan akses internal ditolak/dialihkan sesuai desain aplikasi |
| SEC-004 | P0 | Signup publik | Periksa UI dan endpoint signup yang relevan | Tidak tersedia alur signup Owner publik; permintaan signup tidak memberi akses administratif |
| SEC-005 | P0 | Anon membaca data internal | Dari session anonim, coba akses booking pribadi, transaksi, dan data dashboard | Akses ditolak atau hanya data publik yang memang diizinkan kembali; tidak ada informasi pribadi/internal yang bocor |
| SEC-006 | P0 | Anon mengubah data Owner | Coba insert/update/delete profil, katalog, resource, jam operasional, booking internal, dan transaksi melalui jalur data | Operasi ditolak oleh lapisan database/server; data tetap tidak berubah |
| SEC-007 | P0 | Owner melakukan operasi sah | Login Owner lalu jalankan operasi administratif yang memang masuk scope | Operasi yang diizinkan berhasil dan perubahan tersimpan |
| SEC-008 | P0 | Pengunjung memalsukan status booking | Submit booking dengan status `confirmed` atau status administratif lain | Server/database mengabaikan atau menolak status yang dikirim; booking publik baru tetap `pending` |
| SEC-009 | P0 | Akses function/RPC | Panggil function/RPC dengan role anonim dan Owner | Hanya role yang diperlukan dapat menjalankan operasi; permission ditolak untuk role yang tidak berhak |
| SEC-010 | P0 | Grants dan RLS ditinjau bersama | Audit grants, RLS policies, view, function/RPC, dan tabel yang diekspos | Tidak ada jalur akses yang tidak sengaja melewati kontrol yang dibutuhkan; bukti review dicatat |
| SEC-011 | P0 | Baca booking orang lain | Coba mengambil booking menggunakan ID/identifier milik fixture lain dari konteks publik | Pengunjung tidak memperoleh detail pribadi atau dapat mengubah booking orang lain |
| SEC-012 | P0 | Secret tidak terekspos | Periksa source, bundle frontend, konfigurasi, log, dan file contoh environment | Tidak ada service-role key, password database, atau server secret di frontend/repository/log; `.env.example` hanya berisi placeholder |
| SEC-013 | P0 | Validasi server-side | Kirim nilai invalid langsung melewati UI untuk aturan kritis yang relevan | Database/server menolak input; validasi client tidak menjadi satu-satunya enforcement |
| SEC-014 | P1 | Penanganan error permission | Jalankan operasi tanpa izin dari UI | UI menampilkan error yang sesuai dan tidak mengklaim operasi berhasil |
| SEC-015 | P1 | Proteksi spam booking | Jalankan skenario sederhana sesuai mekanisme yang benar-benar diterapkan, mis. honeypot/rate limit bila tersedia | Mekanisme yang diterapkan bekerja; tidak membuat klaim perlindungan yang belum diimplementasikan |

**Catatan:** review `SECURITY.md`, grants, policy, dan definisi function/RPC aktual wajib dilakukan. RLS saja bukan pengganti pemeriksaan privilege dan izin `EXECUTE` function.

## 8. Booking dan Pencegahan Bentrok

### 8.1 Aturan yang menjadi dasar tes

- Pengunjung dapat mengajukan booking tanpa akun.
- Status awal booking ditetapkan sistem sebagai `pending`.
- Waktu bisnis memakai `Asia/Jakarta`.
- Slot mulai harus mengikuti kelipatan 60 menit.
- Durasi merupakan kelipatan 60 menit dan maksimum 4 jam.
- Booking paling jauh 30 hari ke depan.
- Booking di luar jam operasional/resource aktif ditolak.
- Hanya booking `confirmed` yang memblokir waktu.
- Interval diperlakukan sebagai setengah-terbuka `[mulai, selesai)`.
- Buffer antar-booking adalah 15 menit dan harus dienforce oleh strategi database yang diterapkan.
- Dua konfirmasi yang overlap untuk resource yang sama tidak boleh sama-sama sukses, termasuk jika request berlangsung bersamaan.

Untuk batas buffer, hasil tes harus mengikuti definisi yang benar-benar dipakai pada `DATABASE.md` dan migration. Secara umum, rentang efektif yang diperiksa harus memasukkan buffer yang disepakati; jangan menguji UI saja sebagai bukti anti-bentrok.

### 8.2 Test cases booking

| ID | Prioritas | Skenario | Hasil yang diharapkan |
|---|---|---|---|
| BOOK-001 | P0 | Booking valid dengan resource aktif, waktu dalam jam operasional, slot dan durasi valid | Booking berhasil dibuat dengan status `pending`; pesan menyatakan permintaan menunggu keputusan Owner |
| BOOK-002 | P0 | Waktu mulai sudah lewat | Ditolak oleh validasi tepercaya; tidak ada booking tersimpan |
| BOOK-003 | P0 | Waktu selesai sama dengan waktu mulai | Ditolak; tidak ada booking tersimpan |
| BOOK-004 | P0 | Waktu selesai lebih awal daripada waktu mulai | Ditolak; tidak ada booking tersimpan |
| BOOK-005 | P0 | Waktu mulai tidak sesuai slot 60 menit | Ditolak oleh aturan yang berlaku |
| BOOK-006 | P0 | Durasi bukan kelipatan 60 menit | Ditolak |
| BOOK-007 | P0 | Durasi melebihi 4 jam | Ditolak |
| BOOK-008 | P0 | Booking lebih dari 30 hari ke depan | Ditolak |
| BOOK-009 | P0 | Resource nonaktif | Booking ditolak walaupun request dibuat langsung tanpa UI |
| BOOK-010 | P0 | Waktu di luar jam operasional | Booking ditolak berdasarkan jam operasional yang berlaku bagi resource/bisnis |
| BOOK-011 | P0 | Field wajib hilang atau format input tidak valid | UI menunjukkan validasi; server/database juga menolak request invalid yang dikirim langsung |
| BOOK-012 | P0 | Pengunjung mengirim status `confirmed` | Status tersebut tidak diterima dari input publik; booking valid tetap berstatus `pending` |
| BOOK-013 | P0 | Booking `pending` beririsan dengan booking `pending` lain pada resource sama | Kedua permintaan dapat ada sebagai pending sesuai kebijakan; pending tidak memblokir slot |
| BOOK-014 | P0 | Owner mengonfirmasi booking yang overlap dengan booking confirmed | Operasi konfirmasi ditolak database; booking confirmed yang sudah ada tetap valid |
| BOOK-015 | P0 | Booking pada resource berbeda dengan rentang waktu sama | Diterima jika resource, jam operasional, dan aturan lain valid |
| BOOK-016 | P0 | Dua rentang overlap pada resource sama | Tidak boleh ada dua booking `confirmed` yang overlap |
| BOOK-017 | P0 | Dua rentang bersentuhan tepat pada batas `[mulai, selesai)` | Uji bahwa batas akhir eksklusif tidak dianggap overlap; periksa lagi dampak buffer 15 menit |
| BOOK-018 | P0 | Jarak antar-booking tepat pada batas buffer 15 menit | Hasil mengikuti definisi batas buffer yang ditetapkan; batas diterima/ditolak harus konsisten dan terdokumentasi |
| BOOK-019 | P0 | Jarak antar-booking kurang dari buffer 15 menit | Konfirmasi yang melanggar buffer ditolak database |
| BOOK-020 | P0 | Dua permintaan konfirmasi overlap berjalan serentak | Maksimal satu konfirmasi sukses; hasil akhir database tidak memiliki overlap confirmed |
| BOOK-021 | P0 | Pengunjung mencoba membaca detail booking lain | Tidak memperoleh informasi pribadi atau detail internal |
| BOOK-022 | P0 | Pengunjung mencoba mengubah/membatalkan booking orang lain | Operasi ditolak; data tidak berubah |
| BOOK-023 | P0 | Owner melihat dan memfilter booking | Daftar/detail serta filter tanggal/status/resource cocok dengan fixture dan hanya tersedia untuk Owner |
| BOOK-024 | P0 | Owner menolak atau membatalkan booking | Status berubah sesuai state transition yang diizinkan; booking tidak diperlakukan sebagai confirmed aktif |
| BOOK-025 | P1 | Waktu melewati pergantian hari/bulan di `Asia/Jakarta` | Validasi dan daftar tanggal menggunakan zona waktu bisnis secara konsisten |
| BOOK-026 | P1 | Network error saat submit | UI tidak menyatakan booking berhasil tanpa konfirmasi; retry tidak membuat duplikasi yang tidak diinginkan jika mekanisme deduplikasi tersedia |

### 8.3 Cara menjalankan test concurrency

1. Siapkan database test bersih atau fixture yang terisolasi.
2. Buat dua booking untuk resource yang sama dengan rentang waktu yang overlap dan status yang dapat dikonfirmasi.
3. Kirim dua operasi konfirmasi secara bersamaan, bukan berurutan.
4. Baca kembali state dari database setelah kedua operasi selesai.
5. Pastikan tidak ada kondisi ketika kedua booking berstatus `confirmed` dan overlap.
6. Simpan hasil request, status akhir, dan output test sebagai bukti.

Tes concurrency harus menguji constraint/transaction database yang sebenarnya. Dua klik berurutan di UI bukan pengganti tes request bersamaan.

## 9. Katalog, POS, dan Checkout

### 9.1 Test cases katalog/POS

| ID | Prioritas | Skenario | Hasil yang diharapkan |
|---|---|---|---|
| POS-001 | P0 | Owner membuat item katalog valid | Item tersimpan dengan field dan nominal yang valid |
| POS-002 | P0 | Owner mengubah harga item | Katalog menampilkan harga terbaru; transaksi lama tetap menyimpan snapshot sebelumnya |
| POS-003 | P0 | Item dinonaktifkan | Item tidak ditampilkan pada katalog publik dan tidak dapat ditambahkan ke transaksi baru |
| POS-004 | P0 | Keranjang menerima item aktif | Item aktif dan kuantitas valid dapat ditambahkan ke keranjang |
| POS-005 | P0 | Tambah item nonaktif melalui manipulasi request | Checkout ditolak; item nonaktif tidak dapat dijual hanya dengan melewati UI |
| POS-006 | P0 | Kuantitas kosong, nol, negatif, atau tidak valid | Ditolak oleh validasi yang berlaku; tidak ada transaksi tidak valid |
| POS-007 | P0 | Total browser dimanipulasi | Total dari browser diabaikan; database/server menghitung ulang dari ID item, kuantitas, dan harga resmi |
| POS-008 | P0 | Harga produk berubah di antara pemuatan keranjang dan checkout | Checkout memakai aturan harga tepercaya yang berlaku saat transaksi diproses; nominal tersimpan sesuai hasil perhitungan server/database |
| POS-009 | P0 | Penghitungan uang | Total dihitung tanpa error floating-point; nominal dan penjumlahan sesuai aturan uang yang ditetapkan |
| POS-010 | P0 | Checkout dengan tunai | Transaksi lunas tersimpan dengan metode pembayaran tunai |
| POS-011 | P0 | Checkout dengan transfer | Transaksi lunas tersimpan dengan metode pembayaran transfer |
| POS-012 | P0 | Checkout dengan QRIS manual | Transaksi lunas tersimpan dengan metode pembayaran QRIS; tidak memanggil payment gateway |
| POS-013 | P0 | Checkout valid multi-item | Order, item transaksi, dan pencatatan pembayaran tersimpan sebagai satu operasi atomik |
| POS-014 | P0 | Kegagalan di tengah checkout | Seluruh perubahan checkout rollback; tidak ada order, item, atau pembayaran parsial |
| POS-015 | P0 | Retry dengan request ID sama dan payload yang sama | Tidak terbentuk transaksi kedua; hasil retry sesuai kontrak idempotensi yang diterapkan |
| POS-016 | P0 | Double-submit cepat | Tidak tercipta dua transaksi untuk satu operasi checkout yang sama jika request ID/idempotency dipakai sesuai desain |
| POS-017 | P0 | Nomor transaksi | Database menjaga keunikan nomor transaksi; tidak ada duplikasi pada request bersamaan |
| POS-018 | P0 | Snapshot nama dan harga item | Detail transaksi menyimpan nama/harga saat checkout; perubahan katalog tidak mengubah transaksi lama |
| POS-019 | P0 | Edit/hapus transaksi selesai melalui dashboard | Operasi ditolak/tidak tersedia; transaksi selesai tidak dapat diedit atau dihapus pada MVP |
| POS-020 | P0 | Akses checkout oleh anonim | Checkout administratif ditolak untuk session anonim |
| POS-021 | P0 | Checkout dengan daftar item kosong atau payload cacat | Ditolak; tidak ada transaksi dibuat |
| POS-022 | P1 | Gangguan jaringan setelah server menerima checkout | Retry dengan request ID yang sama tidak menggandakan transaksi; UI merekonsiliasi hasil sesuai respons server |

### 9.2 Verifikasi atomisitas checkout

Gunakan skenario test yang menyebabkan operasi gagal setelah sebagian operasi internal dicoba, melalui mekanisme test yang aman dan sesuai implementasi. Setelah kegagalan, periksa database secara langsung:

- Tidak ada order yang tersisa sendirian.
- Tidak ada item transaksi tanpa order yang sah.
- Tidak ada catatan pembayaran parsial.
- Tidak ada transaksi yang dilaporkan lunas jika checkout gagal.

Checkout dianggap atomik hanya jika semua record yang terkait berhasil bersama atau rollback bersama. Pengujian UI yang sekadar menampilkan pesan error belum membuktikan atomisitas database.

### 9.3 Batasan POS yang perlu ditegakkan

MVP tidak meliputi diskon, kupon, pajak kompleks, pembulatan khusus, DP/cicilan, payment gateway, refund, void, atau stok/inventaris. Jangan menambahkan kasus penerimaan seolah-olah fitur tersebut wajib tersedia. Pastikan implementasi tidak diam-diam menawarkan alur yang belum didukung.

## 10. Riwayat Transaksi dan Laporan

### 10.1 Test cases riwayat transaksi

| ID | Prioritas | Skenario | Hasil yang diharapkan |
|---|---|---|---|
| REP-001 | P0 | Owner melihat daftar transaksi | Daftar hanya menampilkan transaksi yang boleh diakses Owner dan cocok dengan fixture |
| REP-002 | P0 | Owner membuka detail transaksi | Detail menampilkan nomor transaksi, item snapshot, kuantitas, total, status, waktu, dan metode pembayaran yang tersimpan |
| REP-003 | P0 | Harga/nama katalog diubah setelah checkout | Detail transaksi lama tetap menunjukkan snapshot saat checkout |
| REP-004 | P0 | Anon mencoba membaca transaksi/summary laporan | Akses ditolak dan data transaksi tidak bocor |
| REP-005 | P0 | Mencoba mengedit/menghapus transaksi selesai | Perubahan ditolak/tidak tersedia untuk MVP |

### 10.2 Rekonsiliasi laporan menggunakan fixture

Gunakan fixture kecil yang dapat dihitung manual. Contoh berikut hanya data sintetis untuk menguji perhitungan; angka produksi atau isi data bisnis tidak boleh dipakai sebagai fixture.

| Transaksi | Item sintetis | Nilai item | Metode pembayaran | Status |
|---|---|---:|---|---|
| TX-TEST-001 | Item A × 2 | Rp20.000 per item | Tunai | Sukses/lunas |
| TX-TEST-002 | Item B × 1 | Rp35.000 | Transfer | Sukses/lunas |
| TX-TEST-003 | Item A × 1 | Rp20.000 | QRIS | Sukses/lunas |

Berdasarkan fixture tersebut, ekspektasi dasar untuk periode yang mencakup ketiga transaksi adalah:

- Total penjualan: **Rp95.000**.
- Jumlah transaksi sukses/lunas: **3**.
- Total metode tunai: **Rp40.000**.
- Total metode transfer: **Rp35.000**.
- Total metode QRIS: **Rp20.000**.

Jika format fixture atau definisi laporan berbeda di implementasi, revisi fixture/ekspektasi secara eksplisit agar cocok dengan kontrak laporan yang telah disetujui; jangan mengubah angka hanya untuk membuat test lulus.

### 10.3 Test cases laporan

| ID | Prioritas | Skenario | Hasil yang diharapkan |
|---|---|---|---|
| REP-006 | P0 | Total penjualan untuk periode fixture | Total cocok dengan hasil perhitungan manual berdasarkan definisi transaksi sukses/lunas |
| REP-007 | P0 | Jumlah transaksi | Jumlah transaksi sesuai fixture dan kriteria inklusi laporan |
| REP-008 | P0 | Total per metode pembayaran | Total tunai, transfer, dan QRIS cocok dengan nilai fixture |
| REP-009 | P0 | Ringkasan booking per status | Jumlah `pending`, `confirmed`, ditolak, dan dibatalkan cocok dengan fixture dan state yang didukung |
| REP-010 | P0 | Filter rentang tanggal | Hanya transaksi/booking dalam periode yang ditetapkan disertakan; batas awal/akhir konsisten |
| REP-011 | P0 | Periode melintasi tengah malam `Asia/Jakarta` | Transaksi masuk ke tanggal bisnis yang benar menurut zona waktu bisnis |
| REP-012 | P0 | Periode di batas bulan/tahun | Filter dan agregasi tidak kehilangan atau menggandakan record di batas periode |
| REP-013 | P0 | Item terlaris jika tersedia | Kuantitas dihitung dari item transaksi/snapshot, bukan dari status atau nama katalog saat ini |
| REP-014 | P0 | Data laporan kosong | Nilai nol/empty state ditampilkan dengan benar, tanpa NaN, error, atau angka dari cache lama |
| REP-015 | P0 | Laporan hanya untuk Owner | Session anonim tidak dapat membaca endpoint/query laporan |
| REP-016 | P1 | Perubahan katalog setelah transaksi | Laporan historis tetap menggunakan record transaksi yang tersimpan dan tidak berubah karena katalog |

**Aturan verifikasi:** laporan tidak boleh dianggap benar hanya karena angka terlihat masuk akal. Catat fixture, rumus hitung manual, periode, zona waktu, hasil query, dan nilai aktual yang ditampilkan UI.

## 11. Database, Migration, Constraint, dan Function/RPC

### 11.1 Database test

Gunakan test database yang terisolasi. Jika tooling proyek mendukung `supabase test db`/pgTAP, tempatkan tes database untuk hal-hal berikut pada struktur test yang mengikuti repository:

- Constraints dan tipe data yang menegakkan validitas nilai.
- Foreign key dan relasi data yang dibutuhkan.
- Unique constraint, termasuk nomor transaksi atau request ID sesuai desain.
- Range/overlap dan exclusion constraint booking bila digunakan schema final.
- RLS dan grants pada role yang relevan.
- Permission dan perilaku function/RPC.
- Rollback atomic checkout saat salah satu tahap gagal.
- Idempotensi checkout.
- Pembatasan status dan invariants penting lain yang tercatat di `DATABASE.md`.

Jangan membuat nama tabel, function, atau policy baru di test plan sebagai asumsi schema. Gunakan nama dan kontrak yang benar-benar ada pada migration aktual.

### 11.2 Migration dan bootstrap database

| ID | Prioritas | Skenario | Hasil yang diharapkan |
|---|---|---|---|
| DB-001 | P0 | Bangun database test dari basis bersih | Seluruh migration yang diperlukan dapat diterapkan sesuai urutan tanpa langkah manual tersembunyi |
| DB-002 | P0 | Periksa schema setelah migration | Tabel, relasi, index, constraint, policy, dan function yang diharapkan tersedia |
| DB-003 | P0 | Jalankan seed/fixture test | Data sintetis dapat dimuat secara deterministik tanpa data nyata |
| DB-004 | P0 | Jalankan suite database | Tes aturan bisnis dan permission lulus pada database test yang sesuai |
| DB-005 | P0 | Perubahan schema baru | Migration baru tersimpan di repository dan tes terkait diperbarui; tidak bergantung pada perubahan manual remote yang tidak tercatat |
| DB-006 | P0 | Validasi pemulihan dari database bersih | Developer lain dapat membangun kembali schema sesuai prosedur repository dan dokumentasi |
| DB-007 | P0 | Pemeriksaan secret dan konfigurasi database | Test environment memakai konfigurasi yang aman; tidak ada operasi destruktif terhadap production |

Maksud “dapat dijalankan ulang dari basis bersih” adalah schema dapat dibangun kembali pada database development/test baru atau yang telah di-reset dengan prosedur yang aman. Jangan menganggap setiap migration harus dieksekusi dua kali pada schema yang sudah termigrasi kecuali migration memang dirancang dan dinyatakan aman untuk itu.

## 12. Type-check, Lint, Test, Build, dan Smoke Test

Periksa `package.json` dan konfigurasi aktual terlebih dahulu. Gunakan hanya command yang benar-benar tersedia. Nama di bawah adalah kategori verifikasi, bukan klaim bahwa script dengan nama tertentu sudah ada.

| Pemeriksaan | Kriteria lulus | Bukti yang disimpan |
|---|---|---|
| Dependency/setup | Instalasi dapat diselesaikan mengikuti lockfile dan instruksi repository | Command, exit code, dan catatan environment |
| Type-check | Tidak ada error type-check yang memblokir release | Command dan output aktual |
| Lint | Tidak ada error lint yang melanggar gate proyek | Command dan output aktual |
| Unit/component tests | Suite yang diwajibkan berjalan dan lulus | Ringkasan jumlah pass/fail/skip dan output aktual |
| Database tests | Tes database/security yang diwajibkan lulus pada environment test | Output test serta migration/schema version |
| Build | Build produksi selesai tanpa error | Command dan output aktual |
| Smoke test | Alur utama dapat dijalankan pada build yang diperiksa | Checklist, tanggal, environment, dan hasil |

### 12.1 Alur smoke test end-to-end minimum

Jalankan satu alur lengkap menggunakan fixture/test business:

1. Buka website publik pada mobile dan desktop.
2. Login sebagai Owner.
3. Ubah satu field profil/konten dan simpan; pastikan perubahan tampil di website publik.
4. Tambah atau ubah item katalog aktif, lalu pastikan katalog publik dan POS menggunakan sumber data yang sama.
5. Ajukan booking dari konteks anonim; pastikan respons menyatakan `pending`, bukan dikonfirmasi.
6. Login sebagai Owner, tinjau booking dan konfirmasi booking yang tidak bertabrakan.
7. Coba mengonfirmasi booking overlap melalui jalur yang relevan; pastikan database menolak konflik.
8. Buat checkout lunas dengan satu metode pembayaran manual dan verifikasi transaksi serta snapshot item/harga.
9. Ulangi request checkout dengan request ID yang sama pada environment test; pastikan tidak ada transaksi duplikat.
10. Buka riwayat dan laporan; rekonsiliasi hasil dengan fixture manual.
11. Logout dan pastikan dashboard internal tidak lagi dapat diakses.

Jangan menjalankan skenario yang membuat data tidak dapat dipulihkan pada production. Untuk test idempotensi, concurrency, atau rollback, gunakan database test.

## 13. Prioritas dan Kriteria Release Gate

### P0 — wajib lulus sebelum release

- Website publik inti responsif; navigasi dan halaman 404 bekerja.
- Form utama memiliki validasi dan loading/success/error state yang sesuai.
- Login/logout Owner berfungsi dan rute internal terlindungi.
- Anonymous tidak bisa membaca atau mengubah data internal.
- RLS, grants, function/RPC permissions, dan secrets telah diperiksa.
- Booking memvalidasi waktu/resource, status awal `pending`, dan pencegahan overlap/buffer ditegakkan serta diuji pada database, termasuk concurrency.
- POS menghitung harga di database/server, menerima item aktif saja, checkout atomik, snapshot benar, pembayaran manual tercatat, dan idempotensi diuji.
- Transaksi selesai tidak bisa diedit/dihapus pada MVP.
- Laporan periode, jumlah transaksi, metode pembayaran, dan booking per status cocok dengan fixture manual serta menggunakan `Asia/Jakarta`.
- Migration dapat diterapkan dari database test bersih.
- Tes yang diwajibkan, type-check/lint/build yang memang tersedia, dan smoke test telah dijalankan.
- Tidak ada security blocker yang diketahui dan belum ditangani.

### P1 — penting, sesuai scope dan risiko

- Detail aksesibilitas/responsivitas tambahan.
- Penanganan boundary tanggal yang lebih luas.
- Error recovery untuk kondisi jaringan yang jarang terjadi.
- Pengujian proteksi spam lebih mendalam sesuai mekanisme yang benar-benar diterapkan.

P1 yang belum selesai harus dicatat dengan alasan dan dampak. P1 tidak boleh dipakai untuk menunda perbaikan temuan keamanan atau integritas data yang sebenarnya bersifat P0.

## 14. Pelaporan Hasil Tes

Setiap task yang menyentuh fitur, database, permission, atau konfigurasi harus mencatat hasil verifikasi. Gunakan format berikut pada PR/task atau `TASK.md`.

```markdown
### Verification
- Tanggal/waktu:
- Environment: local / test / staging (jangan cantumkan secret)
- Commit/revision:
- Command yang dijalankan:
  - [ ] type-check: PASS / FAIL / BLOCKED / NOT RUN
  - [ ] lint: PASS / FAIL / BLOCKED / NOT RUN
  - [ ] unit/component tests: PASS / FAIL / BLOCKED / NOT RUN
  - [ ] database/security tests: PASS / FAIL / BLOCKED / NOT RUN
  - [ ] build: PASS / FAIL / BLOCKED / NOT RUN
  - [ ] smoke test: PASS / FAIL / BLOCKED / NOT RUN
- Test case yang dijalankan:
- Expected result:
- Actual result:
- Evidence/log/artefak (tanpa secret atau data pelanggan):
- Known issue/blocker:
- Langkah berikutnya:
```

Aturan status:

- **PASS:** command/skenario dijalankan dan hasil aktual memenuhi expected result.
- **FAIL:** command/skenario dijalankan dan hasil tidak memenuhi expected result.
- **BLOCKED:** tes belum dapat dilakukan karena dependency, environment, atau keputusan belum tersedia; tulis sebabnya.
- **NOT RUN:** tes belum dijalankan; jangan menafsirkan status ini sebagai lulus.
- **SKIP:** hanya jika ada alasan yang ditulis dan konsekuensinya dipahami; jangan skip tes P0 tanpa keputusan eksplisit pemilik proyek.

Jangan menulis “semua test lulus” jika sebagian test belum berjalan. Sertakan daftar tes yang gagal, belum dijalankan, atau terblokir.

## 15. Checklist Sebelum Release

### Produk dan UX

- [ ] Halaman publik inti telah diperiksa pada mobile dan desktop.
- [ ] Empty/loading/success/error/retry state untuk flow utama sudah diperiksa.
- [ ] Navigasi, CTA, dan 404 bekerja.
- [ ] Konten opsional kosong tidak menghasilkan tampilan rusak.
- [ ] Label input, validasi, keyboard focus, dan kontras diperiksa terhadap `DESIGN.md`.
- [ ] CMS tidak memungkinkan script/HTML berbahaya dieksekusi.

### Akses dan data

- [ ] Login/logout Owner telah diperiksa; signup publik tidak memberi akses administratif.
- [ ] Tes anonim untuk read/write data internal lulus.
- [ ] RLS, grants, dan function/RPC permissions diperiksa bersama.
- [ ] Tidak ada secret di bundle frontend, Git, log, fixture, atau dokumentasi.
- [ ] Migration dapat membangun schema pada database test bersih.

### Booking

- [ ] Waktu lampau, slot/durasi invalid, resource nonaktif, jam operasional, dan horizon 30 hari diuji.
- [ ] Status awal selalu `pending` dan pending tidak memblokir slot.
- [ ] Overlap, interval setengah-terbuka, dan buffer 15 menit diuji di database.
- [ ] Uji dua konfirmasi bersamaan membuktikan hasil akhir tidak memiliki overlap confirmed.
- [ ] Pengunjung tidak dapat membaca/mengubah booking orang lain.

### POS dan laporan

- [ ] Item nonaktif tidak dapat ditampilkan/dijual.
- [ ] Harga/total dari browser tidak dipercaya.
- [ ] Checkout atomik, snapshot, metode pembayaran, nomor transaksi unik, dan idempotensi diuji.
- [ ] Transaksi selesai tidak dapat diedit atau dihapus.
- [ ] Laporan direkonsiliasi dengan fixture manual, termasuk `Asia/Jakarta`.

### Release

- [ ] Tes P0 yang disepakati lulus berdasarkan hasil aktual.
- [ ] Type-check, lint, test, dan build yang tersedia telah dijalankan.
- [ ] Smoke test alur end-to-end telah dicatat.
- [ ] README/setup dan environment telah diperiksa pada kondisi bersih.
- [ ] Known issues dan keterbatasan MVP dicatat.
- [ ] Tidak ada security blocker yang diketahui.
- [ ] Pemilik proyek menyetujui release.

---

## 16. Pegangan Singkat

- Tes UI memastikan UX; tes database memastikan aturan integritas data.
- Validasi client membantu pengguna, tetapi database/server tetap harus menegakkan aturan kritis.
- Anti-bentrok harus diuji pada database, termasuk request bersamaan.
- Checkout harus atomik; harga resmi berasal dari database/server; item transaksi menyimpan snapshot; retry dengan request ID sama tidak boleh membuat transaksi ganda.
- Laporan hanya dianggap benar setelah direkonsiliasi dengan fixture yang dapat dihitung manual.
- `DESIGN.md` adalah acuan untuk detail visual dan accessibility; jangan mengganti token atau breakpoint secara sepihak.
- Hanya laporkan hasil tes yang benar-benar dijalankan dengan bukti aktual.
