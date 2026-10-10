# TESTING — Strategi Pengujian TITIS

> **Status:** **Draft strategi (Phase 0)**. Belum ada test yang dijalankan; **tidak ada klaim lulus** di dokumen ini. Peninjauan: `TASK.md` → TITIS-007.
> **Sumber kebenaran untuk:** strategi tes, test case, lingkungan tes, dan verifikasi rilis.
> **Bukan untuk:** mengklaim tes lulus. Hasil aktual dicatat di `TASK.md`/CI dengan format §10.
> **Label:** `TEST-xxx` = test case (katalog §5, **sumber kebenaran pemetaan test → requirement**). `AC-`/`US-`/`NFR-` → `PRD.md`; `INV-` → `docs/DATABASE.md` §8; `THR-` dan `PERM-` → `docs/SECURITY.md`; `DEC-` → `ARCHITECTURE.md`; `OPEN-` → `PRD.md` §8.
> Kolom pemetaan di dokumen lain (INV→TEST, THR→TEST) adalah **tampilan navigasi**; bila berbeda dari katalog §5, katalog ini yang berlaku dan dokumen lain diperbaiki.

---

## 1. Prinsip

1. Pengujian adalah **bukti perilaku**, bukan formalitas agar command hijau.
2. Strategi diputuskan sejak awal, terutama untuk authorization, konflik booking, checkout, pembayaran, dan laporan; kriteria rinci boleh berkembang per fase.
3. Setiap AC P0 dan setiap invariant/ancaman harus punya test yang dipetakan (§9). Item tanpa test dicatat sebagai risiko terbuka.
4. Test yang bergantung pada keputusan terbuka (OPEN/DEC) ditandai dan **tidak boleh diubah asal-asalan** agar lulus; bila keputusan berubah, perbarui test dan alasan.

## 2. Aturan verifikasi

Diturunkan dari `MASTER_BUILD_GUIDE.md` §10.1:

- Periksa `package.json` untuk script nyata sebelum menulis command CI atau mengklaim cakupan. Dokumen ini **tidak** menulis nama script yang belum ada.
- Jalankan verifikasi yang relevan dengan scope. Task kecil tidak selalu memerlukan seluruh e2e; perubahan lintas modul, schema, role, checkout, atau booking memerlukan verifikasi lebih menyeluruh.
- **Jangan** mengubah/menghapus/`skip` test yang gagal agar pipeline hijau. Perbaiki akar masalah atau dokumentasikan alasan perubahan test.
- **Jangan** memakai database production untuk test, benchmark, reset, atau fixture.
- Bila test tidak dapat dijalankan: catat alasan, verifikasi alternatif, dan risiko yang belum tertutup.
- Jangan menyalin secret atau data pribadi ke bukti.
- Tidak ada angka cakupan kode yang ditetapkan; fokus pada cakupan **berbasis risiko** (§9).

## 3. Lapisan pengujian dan alat

Alat adalah usulan (DEC-013); versi mengikuti lockfile saat scaffold.

| Area | Jenis verifikasi minimum | Alat (Usulan) | Test |
|---|---|---|---|
| Static/type quality | TypeScript check, lint sesuai script yang tersedia | tooling proyek | TEST-PROC-01 |
| UI components | Unit/komponen: input, validasi, state, interaksi | Vitest + React Testing Library | TEST-UI-*, TEST-CMS-*, TEST-PUB-* |
| Auth | Login/logout/kedaluwarsa sesi, akses halaman per role | integrasi + e2e | TEST-AUTH-* |
| RLS | Query/mutasi sebagai anonymous, Staff, Owner; verifikasi akses yang **ditolak** | pgTAP (`supabase test db`) | TEST-RLS-* |
| Public booking | Validasi field, status awal, spam/error, tanpa info sensitif di respons | pgTAP + integrasi | TEST-BKG-* |
| Booking concurrency | Dua request overlap pada resource sama; hasil akhir tidak dapat mengonfirmasi keduanya | skrip integrasi dua-koneksi | TEST-BKG-06 |
| POS checkout | Total valid, harga tidak dimanipulasi, atomicity saat gagal, double-submit | pgTAP + integrasi | TEST-POS-* |
| Manual payments | DP/pelunasan, saldo, void/refund, tanpa hitung ganda | pgTAP + integrasi | TEST-PAY-* |
| Reports | Rekonsiliasi metrik terhadap fixture hitung manual | pgTAP | TEST-RPT-* |
| Database | Migration dari basis bersih, constraint, policy, SQL tests | Supabase CLI | TEST-DB-* |
| Browser/e2e | Alur kritis dari pengguna hingga hasil tersimpan | Open (DEC-013; kandidat Playwright) | TEST-E2E-* |
| UI quality | Responsive, keyboard/fokus, label, kontras, state | manual + alat a11y (Open) | TEST-UI-* |
| Keamanan | Secret scan, bundle, log, dependency | tooling pemindai (dipilih TITIS-072) | TEST-SEC-* |
| Build/deploy | Build reproducible dan smoke test | CI + manual | TEST-REL-* |

## 4. Lingkungan dan data uji

- **Lokal:** Supabase lokal via CLI untuk test database dan integrasi. Reset hanya pada database lokal.
- **CI:** menjalankan script yang sama dengan lokal (DEC-015); tidak ada step untuk script yang belum ada.
- **Staging (opsional):** hanya untuk smoke test; bukan tempat uji destruktif.
- **Production:** tidak pernah dipakai untuk test, benchmark, reset, atau fixture.
- **Data:** sintetis (`docs/DATABASE.md` §10). Akun uji memakai kredensial acak yang dibuat saat dijalankan dan tidak disimpan di Git.
- **Isolasi:** test database berjalan dalam transaksi yang di-*rollback* atau memakai fixture unik; test tidak bergantung pada urutan eksekusi atau ID tetap.
- **Waktu:** test yang bergantung waktu memakai waktu yang dapat dikendalikan (tidak bergantung jam sistem) dan menguji zona waktu bisnis eksplisit.

## 5. Katalog test case

Kolom **Memverifikasi** adalah sumber kebenaran pemetaan. **Fase** = fase `MASTER_BUILD_GUIDE.md` §7 saat test pertama kali wajib ada. Level: `unit`, `komponen`, `db` (pgTAP), `integrasi`, `e2e`, `manual`, `proses`.

### 5.1 Autentikasi

| ID | Skenario | Level | Memverifikasi | Fase |
|---|---|---|---|---|
| TEST-AUTH-01 | Pengguna terdaftar login dan logout; setelah logout halaman admin tidak dapat diakses | e2e | AC-AUTH-01.1 | 1 |
| TEST-AUTH-02 | Kredensial salah memberi pesan generik identik untuk email terdaftar dan tidak | integrasi | AC-AUTH-01.2, THR-14 | 1 |
| TEST-AUTH-03 | Sesi kedaluwarsa mengarahkan ke login tanpa menampilkan data admin | e2e | AC-AUTH-01.3 | 1 |
| TEST-AUTH-04 | Tidak ada jalur pendaftaran publik yang menghasilkan Owner/Staff; percobaan signup anonim ditolak | integrasi | AC-AUTH-01.4, THR-02 | 1 |
| TEST-AUTH-05 | Anonim tidak dapat membuka halaman admin maupun memanggil data admin langsung | e2e + db | AC-AUTH-02.1 | 1 |
| TEST-AUTH-06 | Staff tidak dapat mengakses fitur/data terlarang lewat URL langsung maupun akses data langsung (menurut OPEN-001..005, 010) | e2e + db | AC-AUTH-02.2 | 1 |
| TEST-AUTH-07 | Owner menambah akun Staff dan menonaktifkannya | integrasi | AC-AUTH-03.1 | 1 |

### 5.2 RLS dan otorisasi

| ID | Skenario | Level | Memverifikasi | Fase |
|---|---|---|---|---|
| TEST-RLS-01 | Setiap tabel yang dapat diakses client memiliki RLS aktif (pemeriksaan katalog sistem) | db | INV-ACC-03 | 1 |
| TEST-RLS-02 | Anonim ditolak untuk `SELECT/INSERT/UPDATE/DELETE` pada semua tabel/jalur admin | db | THR-03, PERM-02, PERM-03, PERM-05, PERM-07, PERM-09, PERM-10, PERM-11, PERM-13, PERM-14, PERM-15, PERM-16, PERM-17, PERM-18, PERM-19, PERM-20, PERM-21, PERM-22, PERM-23, PERM-24 | 1 |
| TEST-RLS-03 | Staff ditolak untuk aksi Owner-only dan aksi yang dibatasi keputusan OPEN | db | THR-03, PERM-02, PERM-03, PERM-05, PERM-07, PERM-10, PERM-11, PERM-13, PERM-15, PERM-16, PERM-17, PERM-18, PERM-19, PERM-20, PERM-21, PERM-22, PERM-23, PERM-24 | 1 |
| TEST-RLS-04 | Owner diizinkan pada seluruh aksi yang didokumentasikan | db | PERM-01, PERM-04, PERM-06, PERM-12 | 1 |
| TEST-RLS-05 | Staff tidak dapat mengubah `role` dirinya atau pengguna lain; field role/owner tidak dapat diubah lewat update biasa | db | INV-ACC-01, INV-ACC-02, THR-02, AC-AUTH-03.3 | 1 |
| TEST-RLS-06 | View, RPC, dan Edge Function menegakkan kontrol setara tabel; fungsi `SECURITY DEFINER` mematuhi `docs/SECURITY.md` §7 | db | INV-ACC-04, THR-18 | 1 |
| TEST-RLS-07 | Anonim hanya melihat konten `published` dan kolom publik (profil, resource, katalog) | db | PERM-01, PERM-04, PERM-06, PERM-12, AC-PUB-01.1, AC-PUB-02.1, THR-10 | 1 |
| TEST-RLS-08 | Staff yang dinonaktifkan kehilangan akses seketika di lapisan data | db | AC-AUTH-03.2 | 1 |

### 5.3 Public website dan CMS

| ID | Skenario | Level | Memverifikasi | Fase |
|---|---|---|---|---|
| TEST-PUB-01 | Rute tidak dikenal menampilkan 404 yang jelas | komponen | AC-PUB-01.4 | 1 |
| TEST-PUB-02 | Daftar layanan/ruang menampilkan hanya item aktif dan field publik; tanpa data internal | integrasi | AC-PUB-02.1 | 1 |
| TEST-PUB-03 | Metadata, URL, dan sitemap/indeksasi sesuai keputusan SEO | integrasi + manual | AC-PUB-01.3 | 1 |
| TEST-CMS-01 | Pengguna berwenang mengedit profil/konten dan hasilnya tampil di public website | e2e | AC-CMS-01.1, AC-CMS-02.1 | 1 |
| TEST-CMS-02 | Pengguna tanpa izin tidak dapat mengubah konten/profil, termasuk lewat akses data langsung | db + integrasi | AC-CMS-01.3 | 1 |
| TEST-CMS-03 | Muatan XSS pada input CMS dirender inert (tidak mengeksekusi skrip) | komponen + e2e | AC-CMS-02.3, THR-11 | 1 |
| TEST-CMS-04 | Konten draft tidak terlihat publik; terlihat setelah dipublikasikan | db + e2e | AC-CMS-02.2 | 1 |
| TEST-CMS-05 | Unggahan media: tipe/ukuran tidak sah ditolak; pengguna tanpa izin tidak dapat unggah/hapus | integrasi | AC-CMS-03.1, AC-CMS-03.3, THR-19 | 1 |
| TEST-CMS-06 | Gambar mendukung dan menampilkan teks alternatif | komponen | AC-CMS-03.2 | 1 |
| TEST-CMS-07 | Validasi field profil bisnis (panjang, format kontak/URL) dengan pesan per field | komponen | AC-CMS-01.2 | 1 |
| TEST-CMS-08 | Judul dan deskripsi meta dapat diedit dan dirender | integrasi | AC-CMS-02.4 | 1 |

### 5.4 Booking

| ID | Skenario | Level | Memverifikasi | Fase |
|---|---|---|---|---|
| TEST-BKG-01 | Pengajuan valid menghasilkan booking `pending`, `reference_code` acak, dan konfirmasi “diterima” (bukan “dikonfirmasi”) | db + e2e | AC-BKG-01.1, AC-BKG-01.4, INV-BKG-01, PERM-08 | 2 |
| TEST-BKG-02 | Pengajuan yang memalsukan status/pemilik/harga/field privilege diabaikan atau ditolak | db | AC-BKG-01.2, THR-01 | 2 |
| TEST-BKG-03 | Input tidak valid ditolak di server: selesai ≤ mulai, waktu lampau, resource tidak ada/nonaktif, luar jam operasional, di luar batas pemesanan | db | AC-BKG-01.3, INV-BKG-02, INV-BKG-03 | 2 |
| TEST-BKG-04 | Database menolak dua booking `confirmed` beririsan pada resource yang sama | db | AC-BKG-04.1, INV-BKG-04 | 2 |
| TEST-BKG-05 | Batas interval: booking berurutan tanpa jeda diizinkan; irisan 1 menit ditolak (sesuai OPEN-009) | db | AC-BKG-04.2, INV-BKG-04 | 2 |
| TEST-BKG-06 | Dua konfirmasi overlap yang berjalan bersamaan: tepat satu berhasil | integrasi (dua koneksi) | AC-BKG-04.3, INV-BKG-05, THR-05 | 2 |
| TEST-BKG-07 | Transisi status ilegal ditolak; hanya pengguna berwenang yang dapat mengubah status | db | AC-BKG-03.1, INV-BKG-06 | 2 |
| TEST-BKG-08 | Respons publik tidak memuat data pribadi atau data booking lain | db + integrasi | AC-BKG-01.5, THR-10 | 2 |
| TEST-BKG-09 | Perlindungan spam/abuse berperilaku sesuai keputusan (DEC-017) | integrasi | AC-BKG-01.6, THR-09 | 2 |
| TEST-BKG-10 | Batas waktu pada zona waktu bisnis (mis. 00:30 lokal berbeda tanggal dari UTC) ditangani benar | db | INV-BKG-03 | 2 |
| TEST-BKG-11 | Pembatalan, reschedule, dan kedaluwarsa sesuai OPEN-008 tidak menciptakan bentrok | db + integrasi | AC-BKG-05.1 | 2 |
| TEST-BKG-12 | Konfirmasi/penolakan mencatat pelaku, waktu, dan alasan; masuk audit | db | AC-BKG-03.2, INV-BKG-07 | 2 |
| TEST-BKG-13 | Pengunjung tidak punya jalur apa pun untuk mengonfirmasi booking sendiri | db + integrasi | AC-BKG-03.3 | 2 |
| TEST-BKG-14 | Daftar booking admin dapat difilter (status, tanggal, resource); pengguna tanpa izin ditolak | integrasi | AC-BKG-02.1, AC-BKG-02.2, PERM-09 | 2 |
| TEST-BKG-15 | Konfirmasi yang ditolak karena bentrok menampilkan pesan penyebab yang jelas | komponen + e2e | AC-BKG-04.4 | 2 |
| TEST-BKG-16 | Resource nonaktif tidak dapat dipesan; jam operasional dan batas pemesanan memengaruhi validasi | db | AC-BKG-06.1, AC-BKG-06.2 | 2 |

### 5.5 POS

| ID | Skenario | Level | Memverifikasi | Fase |
|---|---|---|---|---|
| TEST-POS-01 | Total dihitung server; nominal total/harga dari klien diabaikan atau ditolak | db | AC-POS-02.1, INV-POS-02, THR-06, PERM-14 | 3 |
| TEST-POS-02 | Snapshot nama/harga item bertahan setelah harga katalog berubah | db | AC-POS-02.4, INV-POS-01 | 3 |
| TEST-POS-03 | Injeksi kegagalan di tengah checkout tidak meninggalkan data parsial (order/item/pembayaran) | db | AC-POS-02.2, INV-POS-03, THR-07 | 3 |
| TEST-POS-04 | `client_request_id` yang sama dikirim ulang menghasilkan satu order | db + integrasi | AC-POS-02.3, INV-POS-04, THR-08 | 3 |
| TEST-POS-05 | Kasus emas diskon/pajak/pembulatan (fixture §8) sama antara server dan pratinjau klien (bila ada) | db + unit | AC-POS-03.1, INV-POS-02 | 3 |
| TEST-POS-06 | Uang tidak memakai floating-point (tipe kolom, fungsi, dan formatter) | db + unit | AC-POS-01.2, INV-POS-05 | 3 |
| TEST-POS-07 | Hanya pengguna berwenang yang dapat memberi diskon | db | AC-POS-03.2, PERM-15 | 3 |
| TEST-POS-08 | Item katalog dapat dikelola; item nonaktif/tidak ada ditolak saat checkout | db | AC-POS-01.1 | 3 |
| TEST-POS-09 | Nomor transaksi unik, termasuk pembuatan bersamaan | integrasi (dua koneksi) | AC-POS-02.5, INV-POS-07 | 3 |
| TEST-POS-10 | Riwayat transaksi dapat difilter, menampilkan detail item/pembayaran, dan mengikuti izin role | integrasi | AC-POS-04.1, AC-POS-04.2, PERM-16 | 3 |
| TEST-POS-11 | Void/koreksi hanya oleh pengguna berwenang dan tidak menghapus jejak audit | db | AC-POS-05.1, PERM-17 | 3 |
| TEST-POS-12 | Bukti/struk menampilkan data yang sama dengan data tersimpan | komponen | AC-POS-06.1 | 3 |

### 5.6 Pembayaran

| ID | Skenario | Level | Memverifikasi | Fase |
|---|---|---|---|---|
| TEST-PAY-01 | Pembayaran tersimpan dengan relasi, nominal > 0, waktu, metode, status; constraint menolak data tidak valid | db | AC-PAY-01.1, INV-PAY-01 | 3 |
| TEST-PAY-02 | DP lalu pelunasan: saldo benar, tidak ada penjualan/penerimaan kas terhitung dua kali (fixture §8) | db | AC-PAY-02.1, INV-PAY-02, INV-PAY-03, THR-12 | 3 |
| TEST-PAY-03 | Aturan kelebihan/kekurangan bayar berperilaku sesuai OPEN-011 | db | AC-PAY-02.2, INV-PAY-02 | 3 |
| TEST-PAY-04 | Void/refund menambah catatan pembalik; baris asli tidak dihapus/diubah; tanpa hard delete | db | AC-PAY-03.1, INV-PAY-04, THR-17, PERM-19 | 3 |
| TEST-PAY-05 | Hanya pengguna berwenang yang dapat mencatat pembayaran | db | AC-PAY-01.2, PERM-18 | 3 |
| TEST-PAY-06 | Pengiriman ganda pembayaran tidak mencatat dua kali | db + integrasi | AC-PAY-01.3, THR-08 | 3 |
| TEST-PAY-07 | Pembayaran dapat dikaitkan ke booking dan diperlakukan sesuai OPEN-012 pada laporan | db | AC-PAY-04.1 | 3 |

### 5.7 Laporan

| ID | Skenario | Level | Memverifikasi | Fase |
|---|---|---|---|---|
| TEST-RPT-01 | Seluruh metrik MET-01..MET-13 sama dengan nilai fixture hitung manual (§8) | db | AC-RPT-01.2, INV-RPT-01 | 3 |
| TEST-RPT-02 | Batas hari/rentang mengikuti zona waktu bisnis (order 00:30 lokal masuk tanggal lokal yang benar) | db | AC-RPT-02.1 | 3 |
| TEST-RPT-03 | Perlakuan DP, pelunasan, void, dan refund sesuai OPEN-012 tanpa hitung ganda | db | AC-RPT-01.3, INV-PAY-03 | 3 |
| TEST-RPT-04 | Laporan keuangan hanya dapat diakses role yang diizinkan, termasuk lewat akses data langsung | db | AC-RPT-03.1, PERM-20 | 3 |
| TEST-RPT-05 | Properti: hasil laporan = hitung ulang dari baris mentah untuk himpunan fixture acak | db | INV-RPT-01, AC-RPT-01.2 | 3 |
| TEST-RPT-06 | Setiap metrik yang tampil di UI memiliki definisi di katalog metrik | unit | AC-RPT-01.1 | 3 |

### 5.8 Database, keamanan, UI, e2e, rilis, proses

| ID | Skenario | Level | Memverifikasi | Fase |
|---|---|---|---|---|
| TEST-DB-01 | Seluruh migration berjalan dari basis bersih tanpa error | db | THR-13, NFR-06 | 1 |
| TEST-DB-02 | Constraint, FK, dan unique menolak data tidak valid (uji negatif) | db | INV-POS-06, NFR-02 | 1 |
| TEST-DB-03 | Seed dapat dijalankan ulang dan hanya berisi data sintetis tanpa secret | db | NFR-06 | 1 |
| TEST-DB-04 | Tipe ter-generate selaras dengan schema (tanpa selisih) | proses | NFR-02 | 1 |
| TEST-DB-05 | Hanya satu baris `business_settings` yang dapat ada | db | INV-ACC-05 | 1 |
| TEST-DB-06 | `audit_log` append-only: tanpa update/delete; aksi sensitif tercatat | db | INV-AUD-01, THR-17 | 1 |
| TEST-UI-01 | Layout berfungsi pada viewport yang disepakati; tanpa scroll horizontal pada 320 px | manual + e2e | AC-PUB-01.2, NFR-04 | 1 |
| TEST-UI-02 | Seluruh fungsi dapat dioperasikan keyboard; fokus terlihat; urutan fokus logis; dialog mengelola fokus | manual + otomatis | NFR-03 | 1 |
| TEST-UI-03 | Label terhubung ke input; pesan error terkait field dan diumumkan | komponen | NFR-03 | 1 |
| TEST-UI-04 | Kontras teks dan komponen memenuhi target (`DESIGN.md` §8) | manual + otomatis | NFR-03 | 1 |
| TEST-UI-05 | Loading, empty, error, permission-denied, dan retry tersedia pada alur yang relevan | komponen | NFR-05, AC-PUB-02.2, AC-BKG-01.7, AC-BKG-02.3 | 1 |
| TEST-UI-06 | Aksi destruktif/keuangan memakai dialog konfirmasi dengan akibat jelas dan alasan wajib bila dibutuhkan | komponen | NFR-05 | 2 |
| TEST-SEC-01 | Pemindaian secret pada repo dan riwayat Git: tidak ada temuan | proses | THR-04 | 4 |
| TEST-SEC-02 | Bundle produksi tidak memuat `service_role`/secret key/variabel server | proses | THR-04 | 1 |
| TEST-SEC-03 | Log dan `audit_log.details` tidak memuat token/secret/data pribadi | integrasi | THR-04 | 4 |
| TEST-SEC-04 | Tinjauan/audit dependency: tidak ada dependency tak beralasan atau advisori blocker | proses | THR-15 | 4 |
| TEST-E2E-01 | Login → edit konten → terlihat di public website | e2e | NFR-01 | 1 |
| TEST-E2E-02 | Pengajuan booking publik → keputusan Staff/Owner → percobaan konfirmasi bentrok ditolak | e2e | NFR-01, NFR-02 | 2 |
| TEST-E2E-03 | Checkout → pembayaran (DP + pelunasan bila ada) → angka laporan sesuai | e2e | NFR-02 | 3 |
| TEST-E2E-04 | Staff vs Owner: menu dan akses data sesuai matriks izin | e2e | NFR-01 | 1 |
| TEST-REL-01 | Klon bersih + instruksi README menghasilkan build yang berjalan | manual | NFR-06 | 4 |
| TEST-REL-02 | Smoke test pascadeploy: login, halaman publik, satu jalur booking, jalur transaksi | manual | NFR-06 | 1 |
| TEST-REL-03 | Simulasi rollback berjalan sesuai prosedur | manual | THR-13 | 4 |
| TEST-REL-04 | Simulasi pemulihan backup berjalan sesuai prosedur | manual | NFR-02 | 4 |
| TEST-PROC-01 | Tinjauan `git diff` per task: tanpa secret, kode debug, dependency, atau perubahan tak terkait; lint/type-check lulus | proses | THR-16 | 1 |

## 6. Pendekatan uji khusus

### 6.1 Konkurensi (TEST-BKG-06, TEST-POS-09)

Dua koneksi database independen mengeksekusi operasi yang saling bentrok **secara bersamaan** (mis. mengonfirmasi dua booking beririsan pada resource sama). Lulus bila tepat satu berhasil dan yang lain mendapat error terjemahan yang terdefinisi (bukan error mentah, bukan keduanya berhasil). Ulangi beberapa kali untuk mengurangi kebetulan waktu. Test deterministik penegakan constraint (TEST-BKG-04/-05) tetap diperlukan karena tidak bergantung pada waktu.

### 6.2 Injeksi kegagalan (TEST-POS-03)

Sisipkan kegagalan terkontrol di tengah operasi majemuk (mis. item tidak valid pada posisi kedua, pelanggaran constraint saat menyimpan pembayaran) dan pastikan **tidak ada** baris parsial pada `orders`, `order_items`, maupun `payments`, serta pesan error tidak membocorkan detail internal.

### 6.3 Negatif per role (TEST-RLS-*)

Untuk setiap tabel/RPC: jalankan semua aksi sebagai anonymous, Staff, dan Owner; verifikasi baik yang **diizinkan** maupun yang **ditolak**. Test akses yang hanya menguji “bisa” tidak memadai.

### 6.4 Rekonsiliasi (TEST-RPT-*)

Bandingkan keluaran laporan dengan nilai yang dihitung manual pada fixture §8, dan (TEST-RPT-05) dengan hitung ulang dari baris mentah.

## 7. Pengujian UI dan aksesibilitas

- **Otomatis:** komponen diuji dengan Testing Library (peran/label, bukan detail implementasi); alat cek a11y otomatis ditetapkan di DEC-013 (Open).
- **Manual (wajib sebelum rilis, TITIS-075):** navigasi keyboard penuh, fokus terlihat, zoom 200%, lebar 320 px, pembaca layar pada alur kritis (login, booking, kasir), serta pemeriksaan kontras.
- Viewport mengikuti `DESIGN.md` §7 (DQ-06).

## 8. Fixture rekonsiliasi (contoh hitung manual)

> **Ilustratif.** Angka, pajak 11%, dan aturan diskon di bawah hanya contoh untuk menunjukkan cara rekonsiliasi. Aturan final menunggu OPEN-010, OPEN-011, dan OPEN-012; fixture harus diperbarui saat keputusan itu final. Mata uang: rupiah utuh. Zona waktu bisnis: UTC+7.

**Katalog:** Kopi Susu 25.000 · Roti Bakar 30.000 · Sewa Ruang Privat 200.000.

| Order | Waktu (lokal) | Isi | Subtotal | Diskon | Pajak 11% | Total | Pembayaran |
|---|---|---|---|---|---|---|---|
| B | 8 Jan 2026 21:00 | 1 × Sewa Ruang Privat | 200.000 | 20.000 | 19.800 | 199.800 | DP 100.000 (8 Jan) + pelunasan 99.800 (10 Jan) |
| D | 9 Jan 2026 12:00 | 1 × Roti Bakar | 30.000 | 0 | 3.300 | 33.300 | 33.300 (9 Jan), lalu **void** + refund 33.300 (9 Jan) |
| A | 10 Jan 2026 10:00 | 2 × Kopi Susu + 1 × Roti Bakar | 80.000 | 0 | 8.800 | 88.800 | 88.800 (10 Jan) |
| C | 11 Jan 2026 00:30 | 1 × Kopi Susu | 25.000 | 0 | 2.750 | 27.750 | 27.750 (11 Jan 00:30) |

Order C pada 11 Jan 00:30 lokal = **10 Jan 17:30 UTC**: sengaja dipakai untuk menjebak penghitungan tanggal berbasis UTC (TEST-RPT-02, TEST-BKG-10).

**Hasil yang diharapkan untuk periode 8–11 Jan 2026 (zona bisnis):**

| Metrik | Nilai | Perhitungan |
|---|---|---|
| MET-01 Penjualan kotor | 305.000 | 200.000 + 80.000 + 25.000 (order D void dikeluarkan) |
| MET-02 Diskon | 20.000 | order B |
| MET-03 Penjualan bersih | 285.000 | 305.000 − 20.000 |
| MET-04 Pajak | 31.350 | 19.800 + 8.800 + 2.750 |
| MET-05 Total tagihan | 316.350 | 285.000 + 31.350 = 199.800 + 88.800 + 27.750 |
| MET-06 Penerimaan kas | 349.650 | 100.000 + 99.800 + 33.300 + 88.800 + 27.750 |
| MET-07 Refund | 33.300 | order D |
| MET-08 Penerimaan bersih | 316.350 | 349.650 − 33.300 |
| MET-09 Saldo belum dibayar | 0 | MET-05 − MET-08 |
| MET-10 Jumlah transaksi | 3 | A, B, C |
| MET-11 Rata-rata nilai transaksi | 105.450 | 316.350 / 3 |

**Rincian harian (zona bisnis):**

| Tanggal | Penjualan kotor | Penerimaan kas | Refund |
|---|---|---|---|
| 8 Jan | 200.000 (B) | 100.000 (DP B) | 0 |
| 9 Jan | 0 | 33.300 (D) | 33.300 (D) |
| 10 Jan | 80.000 (A) | 188.600 (A 88.800 + pelunasan B 99.800) | 0 |
| 11 Jan | 25.000 (C) | 27.750 (C) | 0 |

**Jebakan yang harus tertangkap oleh test:**

1. Menjumlahkan semua pembayaran sebagai penjualan memberi 349.650 (bukan 316.350) — itu menghitung DP, pelunasan, dan order void sebagai penjualan.
2. Memotong tanggal pada UTC menaruh order C pada 10 Jan.
3. Mengambil harga dari katalog saat laporan dibuat (bukan snapshot) akan mengubah riwayat bila harga berubah (TEST-POS-02).
4. Status bayar order B setelah DP harus “sebagian” dengan saldo 99.800.

Fixture tambahan yang dibutuhkan: booking yang bertabrakan (tepat bersebelahan, irisan 1 menit, identik), pembayaran berlebih/kurang, transaksi yang gagal di tengah, record tanpa izin, dan nilai batas (kuantitas 1 dan maksimum, harga 0, diskon 100%).

## 9. Keterlacakan (requirement → test)

Tabel di bawah **dihasilkan dari katalog §5** (kolom *Memverifikasi*). Untuk INV→TEST lihat `docs/DATABASE.md` §8; untuk THR→TEST lihat `docs/SECURITY.md` §11. Item tanpa test ditandai **BELUM ADA** dan dianggap risiko terbuka.

<!-- TRACE-TABLES -->

## 10. Format pencatatan hasil

Hasil dicatat di `TASK.md` (bagian *Evidence / notes*) dan/atau CI, **hanya dari eksekusi nyata**:

```text
Task/Rilis      : [ID / versi]
Tanggal         : [tanggal aktual]
Environment     : [lokal | CI | staging] — versi Node, versi Supabase CLI
Command         : [command yang dijalankan]
Hasil           : [lulus | gagal] — [n lulus, m gagal, k dilewati]
Test tidak jalan: [ID + alasan + risiko tersisa, atau "Tidak ada"]
Catatan         : [temuan, tanpa secret/data pribadi]
```

## 11. Verifikasi rilis

Prosedur dan checklist sebelum/sesudah deployment ada di `MASTER_BUILD_GUIDE.md` §11.2–§11.3; jangan disalin ke sini. Test rilis yang spesifik: TEST-REL-01..04. Deployment berhasil hanya membuktikan aplikasi dapat diakses; **tidak** membuktikan keamanan, kebenaran laporan, atau terpenuhinya AC.

## 12. Hal yang belum ditetapkan

- Alat E2E dan alat a11y otomatis (DEC-013).
- Alat pemindai secret (TITIS-072).
- Viewport uji final (DQ-06).
- Seluruh test yang bergantung pada keputusan OPEN: ditandai pada kolom skenario dan diperbarui saat keputusan final.
