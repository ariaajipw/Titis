# SECURITY — Desain Keamanan TITIS

> **Status:** **Draft (Phase 0)**. Menunggu tinjauan pemilik proyek (`TASK.md` → TITIS-005). Belum ada kontrol yang diimplementasikan.
> **Sumber kebenaran untuk:** model ancaman ringkas, matriks izin, strategi RLS, alur akses publik, kebijakan secret/logging, mitigasi, dan kebijakan pelaporan kerentanan publik.
> **Bukan pengganti:** enforcement aktual (policy, constraint, function di `supabase/migrations/`) dan test keamanan (`supabase/tests/`, `TESTING.md`). Dokumen ini hanya menjelaskan; **test membuktikan**.
> **Struktur:** Bagian 1–12 menjelaskan desain keamanan aplikasi TITIS. Bagian 13 menjelaskan kebijakan pelaporan kerentanan publik. Keduanya berada dalam satu file `SECURITY.md` di root; file terpisah tidak dibuat sebelum ada kebutuhan nyata (TITIS-077).
> **Label:** `OPEN-xxx` → `PRD.md` §8; `DEC-xxx` → `ARCHITECTURE.md` §3; `INV-xxx` → `DATABASE.md` §8; `TEST-xxx` → `TESTING.md`.

---

## 1. Prinsip

1. **Autentikasi bukan otorisasi.** Login membuktikan identitas sesi; hak akses diverifikasi pada setiap operasi di lapisan tepercaya.
2. **UI bukan penjaga.** Menyembunyikan menu atau menonaktifkan tombol bukan kontrol keamanan. Setiap aturan akses harus tetap berlaku bila pemanggil melewati UI dan memanggil API/data langsung.
3. **Default tolak.** Akses diberikan secara eksplisit per tabel, per aksi, per aktor. Tidak ada policy “semua pengguna login boleh semua”.
4. **Kunci publik ≠ data aman.** Kunci publik Supabase (publishable/anon) ada di browser; keamanan data bergantung sepenuhnya pada RLS dan grant yang benar.
5. **Input dari browser tidak tepercaya**, termasuk status, harga, total, ID pemilik, dan role.
6. **Kegagalan aman.** Bila ragu, tolak dan catat tanpa membocorkan data.

## 2. Aktor dan aset

| Aktor | Deskripsi | Kepercayaan |
|---|---|---|
| Anonymous | Pengunjung tanpa akun (juga penyerang anonim) | Tidak tepercaya |
| Staff | Akun admin terbatas | Tepercaya sebagian (sesuai matriks) |
| Owner | Pemilik/administrator bisnis | Tepercaya penuh atas data bisnis |
| Agent AI | Pembantu coding | Tepercaya terbatas oleh `AGENTS.md`; tidak memegang secret production |
| Operator | Pemilik proyek yang mengelola infrastruktur | Memegang secret server |

**Aset yang dilindungi:** data kontak pengunjung (booking), data transaksi dan pembayaran, konfigurasi bisnis, akun dan role, secret server (secret/service_role key, password database), integritas jadwal dan laporan.

## 3. Batas kepercayaan

```text
[Browser: Anonymous / Staff / Owner]   <- tidak tepercaya; semua input divalidasi ulang
        │  kunci publik + token sesi (JWT)
        ▼
[Supabase API (PostgREST / Auth / Storage / Edge Functions)]
        │  role database: anon / authenticated (RLS berlaku)
        ▼
[PostgreSQL: RLS, constraint, trigger, RPC]  <- penegak aturan; sumber kebenaran data
        ▲
        │  hanya runtime server (secret key / service_role)
[Edge Function / skrip operator]  <- satu-satunya tempat secret server
```

- Frontend **tidak pernah** memegang secret server.
- Segala yang melintasi batas browser→server diperlakukan sebagai input tidak tepercaya.
- Secret server hanya berada di runtime/secret storage yang sesuai (§8).

## 4. Matriks izin

Aktor × aksi. Sel berisi: **Ya**, **Tidak**, **Ya\*** (hanya jalur terkontrol/RPC), atau **OPEN-xxx** (menunggu keputusan produk; sampai diputuskan perlakukan sebagai **Tidak**). Nilai bertanda *(usulan)* belum disetujui.

| ID | Aksi | Anonymous | Staff | Owner |
|---|---|---|---|---|
| PERM-01 | Membaca konten publik berstatus `published` | Ya | Ya | Ya |
| PERM-02 | Membaca konten `draft` | Tidak | OPEN-001 | Ya |
| PERM-03 | Membuat/mengubah/mempublikasikan konten | Tidak | OPEN-001 | Ya |
| PERM-04 | Membaca profil bisnis (kolom publik) | Ya | Ya | Ya |
| PERM-05 | Mengubah profil/pengaturan bisnis | Tidak | Tidak *(usulan)* | Ya |
| PERM-06 | Membaca resource aktif (kolom publik) | Ya | Ya | Ya |
| PERM-07 | Mengelola resource dan jam operasional | Tidak | Tidak *(usulan)* | Ya |
| PERM-08 | Mengajukan permintaan booking | Ya\* | Ya\* | Ya\* |
| PERM-09 | Membaca daftar/detail booking | Tidak | Ya *(usulan)* | Ya |
| PERM-10 | Mengonfirmasi/menolak booking | Tidak | OPEN-002 | Ya\* |
| PERM-11 | Membatalkan/menjadwal ulang booking | Tidak (kecuali OPEN-008) | OPEN-002 | Ya\* |
| PERM-12 | Membaca katalog (kolom publik, item aktif & listed) | Ya | Ya | Ya |
| PERM-13 | Mengelola katalog | Tidak | OPEN-010 | Ya |
| PERM-14 | Membuat transaksi (checkout) | Tidak | Ya\* | Ya\* |
| PERM-15 | Memberi diskon | Tidak | OPEN-003 | Ya\* |
| PERM-16 | Membaca riwayat transaksi | Tidak | OPEN-010 | Ya |
| PERM-17 | Void/koreksi transaksi | Tidak | OPEN-010 | Ya\* |
| PERM-18 | Mencatat pembayaran | Tidak | OPEN-004 | Ya\* |
| PERM-19 | Koreksi/refund/void pembayaran | Tidak | OPEN-004 | Ya\* |
| PERM-20 | Membaca laporan keuangan | Tidak | OPEN-005 | Ya |
| PERM-21 | Mengelola akun Staff (tambah/nonaktifkan) | Tidak | Tidak | Ya\* |
| PERM-22 | Mengubah role | Tidak | Tidak | Ya\* (jalur istimewa) |
| PERM-23 | Membaca audit log | Tidak | Tidak *(usulan)* | Ya |
| PERM-24 | Mengunggah/menghapus media | Tidak | OPEN-001 | Ya |

Aturan tambahan:

- Setiap perubahan pada matriks ini adalah perubahan model izin dan memerlukan persetujuan pemilik proyek (`AGENTS.md` §3.2).
- Setiap baris matriks harus mempunyai test akses (diizinkan **dan** ditolak) — pemetaan di `TESTING.md` §9.
- Staff **tidak dapat** mengubah role dirinya maupun orang lain (INV-ACC-02).

## 5. Strategi RLS per tabel (Usulan)

Untuk setiap tabel yang dapat diakses client, jawab pertanyaan wajib: siapa boleh `SELECT/INSERT/UPDATE/DELETE`; apakah akses anonim perlu dan untuk field apa; bagaimana keterikatan ke record yang benar dijamin; apakah field sensitif dapat diubah client; apakah view/RPC/Edge Function menegakkan kontrol yang sama; test apa yang membuktikan.

Catatan umum:

- RLS membatasi **baris**. Pembatasan **kolom** publik dilakukan dengan view/RPC berdaftar kolom eksplisit atau column privileges (dipilih saat TITIS-013/018). Jangan membuka seluruh kolom tabel ke `anon`.
- Pada Supabase, tabel di schema yang terekspos secara default dapat memberi hak luas kepada role `anon`/`authenticated`; **cabut hak yang tidak dibutuhkan secara eksplisit** dan jangan mengandalkan RLS sebagai satu-satunya lapisan. Verifikasi perilaku default pada versi yang dipakai.
- View yang membaca tabel ber-RLS harus berjalan dengan hak pemanggil (mis. opsi `security_invoker` pada PostgreSQL versi yang mendukung), bukan hak pemilik view (INV-ACC-04).
- Fungsi pembantu pemeriksa role dibaca dari tabel `profiles` (bukan dari metadata yang dapat diubah pengguna; lihat §12).

| Tabel | Anonymous | Staff | Owner | Field sensitif | Jalur lain | Test |
|---|---|---|---|---|---|---|
| `profiles` | Tidak ada akses | `SELECT` baris sendiri; `UPDATE` hanya `display_name` sendiri | `SELECT` semua; ubah `role`/`is_active` lewat jalur istimewa | `role`, `is_active` | RPC administrasi akun | TEST-RLS-02, -03, -05, -08 |
| `business_settings` | `SELECT` kolom publik via view/RPC | `SELECT` | `SELECT`, `UPDATE` | `timezone`, `currency_*`, pajak | — | TEST-RLS-02, -04, -07 |
| `pages`, `page_sections` | `SELECT` hanya `published` | `SELECT`; tulis per OPEN-001 | Semua aksi | `status` | View publik | TEST-RLS-07, TEST-CMS-02, -04 |
| `media_assets` + storage | Baca objek publik saja | per OPEN-001 | Semua aksi | `storage_path` | Policy storage | TEST-CMS-05 |
| `resources`, `operating_hours` | `SELECT` aktif, kolom publik | `SELECT` | Semua aksi | — | RPC ketersediaan | TEST-RLS-02, -07 |
| `bookings` | **Tidak ada akses langsung**; kirim lewat RPC/Edge Function | `SELECT`; ubah status hanya via RPC (OPEN-002) | `SELECT`; ubah status via RPC | `status`, `decided_*`, data kontak | RPC `submit` dan `decide` | TEST-RLS-02, -03, TEST-BKG-02, -08 |
| `catalog_categories`, `catalog_items` | `SELECT` item aktif & listed, kolom publik | `SELECT`; tulis per OPEN-010 | Semua aksi | `unit_price`, `is_active` | View publik | TEST-RLS-02, -07 |
| `orders`, `order_items` | Tidak ada akses | `SELECT` (lingkup per OPEN-010); `INSERT` hanya via RPC checkout | `SELECT`; void via RPC | semua kolom nominal | RPC checkout | TEST-RLS-02, -03, TEST-POS-01 |
| `payments` | Tidak ada akses | `SELECT`; `INSERT` via RPC (OPEN-004); **tanpa** `UPDATE`/`DELETE` | `SELECT`; void/refund via RPC | `amount`, `status` | RPC pembayaran | TEST-RLS-03, TEST-PAY-04, -05 |
| `audit_log` | Tidak ada akses | Tidak ada akses | `SELECT` | seluruh isi | Ditulis trigger/RPC | TEST-RLS-02, TEST-DB-06 |

Hasil akhir: setelah policy dan grant direalisasikan, tabel ini diperbarui agar mencerminkan **policy aktual** (nama policy dan migration).

## 6. Jalur akses non-tabel

### 6.1 Public booking (anonymous)

- Anonim **tidak** mendapat izin tulis langsung ke tabel `bookings` (THR-01).
- Penulisan melalui satu jalur terkontrol yang: menerima daftar field terbatas; memaksa status awal `pending`; menurunkan nilai privilege di server; memvalidasi resource, waktu, jam operasional, dan batas pemesanan; membangkitkan `reference_code` acak; mengembalikan respons minimal (hanya `reference_code` dan status penerimaan; tanpa data booking lain, THR-10).
- Pilihan jalur: fungsi database (RPC) saja, atau Edge Function bila verifikasi anti-spam/rate-limit/integrasi diperlukan — keputusan di `ARCHITECTURE.md` DEC-006 dan DEC-017, harus teruji.
- Perlindungan spam/abuse sepadan dengan risiko (THR-09): batas laju, verifikasi bot, honeypot, dan/atau batas permintaan menunggu per kontak — pilihan di DEC-017.

### 6.2 View

Setiap view dievaluasi sebagai jalur akses sendiri (INV-ACC-04): kolom yang dikembalikan, hak yang dipakai, dan test akses per aktor.

### 6.3 Storage (bila media masuk scope)

- Pisahkan bucket publik (gambar situs) dari bucket privat bila ada.
- Batasi tipe MIME dan ukuran; validasi di sisi tepercaya, bukan hanya UI (THR-19).
- Policy storage mengikuti PERM-24; tulis hanya oleh pengguna berwenang.

### 6.4 Edge Function (bila ada)

- Secret hanya dibaca dari environment runtime function, tidak pernah dikembalikan ke klien atau dicatat.
- Verifikasi identitas dan role pemanggil di dalam function; jangan mengandalkan klien.
- Dicatat di `ARCHITECTURE.md` bersama alasan mengapa SQL/RPC saja tidak cukup.

## 7. Aturan function / RPC `SECURITY DEFINER`

Fungsi `SECURITY DEFINER` berjalan dengan hak pemiliknya dan merupakan sumber eskalasi hak yang umum (THR-18). Aturan:

1. Pakai `SECURITY INVOKER` secara default. Gunakan `DEFINER` hanya bila fungsi memang harus melakukan hal di luar hak pemanggil (mis. submit booking publik, checkout, administrasi akun).
2. Tetapkan `search_path` secara eksplisit dan **referensikan objek dengan nama berkualifikasi schema**.
3. Cabut `EXECUTE` dari `PUBLIC` dan berikan hanya ke role yang membutuhkan (mis. `anon` hanya untuk RPC submit booking).
4. Jangan menerima parameter yang membawa hak: `status`, `role`, `created_by`, `decided_by`, harga, total. Turunkan pelaku dari `auth.uid()`, harga dari katalog, total dari perhitungan server.
5. Validasi semua input (tipe, panjang, rentang, himpunan nilai) dan tolak sisanya.
6. Kembalikan data seminimal mungkin.
7. Fungsi pembantu internal diletakkan di schema yang tidak terekspos ke API publik.
8. Tulis jejak audit untuk aksi sensitif (`DATABASE.md` §4.5).
9. Setiap fungsi punya test sebagai anonymous, Staff, dan Owner (diizinkan dan ditolak).

## 8. Secret, logging, dan respons insiden

### 8.1 Kebijakan secret

| Jenis | Boleh di | Tidak boleh di |
|---|---|---|
| Kunci publik Supabase (publishable/anon), URL project | `VITE_*`, bundle browser | — |
| `service_role` / secret key Supabase, password database, secret Edge Function, kredensial penyedia pembayaran | Secret storage runtime server / CLI lokal operator | `VITE_*`, source frontend, Git, log, prompt AI, screenshot, dokumentasi |

- Semua variabel `VITE_*` dianggap **publik**.
- `.env.example` hanya berisi nama variabel dengan nilai kosong. `.gitignore` mengecualikan `.env*` kecuali template.
- Agent AI tidak membaca file secret (`AGENTS.md` §3.3).
- Secret per environment tidak boleh tercampur (development/staging/production).

### 8.2 Logging dan redaksi

- Jangan mencatat token, password, URL yang memuat secret, data pembayaran sensitif, atau data pribadi lengkap (nama+kontak) di log, `audit_log.details`, prompt, atau screenshot.
- Pesan error ke pengguna bersifat umum dan dapat ditindaklanjuti; detail teknis hanya di log tersanitasi.
- Pesan login tidak boleh mengungkap apakah email terdaftar (AC-AUTH-01.2).
- Kegagalan bisnis penting (mis. bentrok jadwal, checkout gagal) dicatat dengan konteks non-sensitif.

### 8.3 Respons bila secret terekspos

Menghapus teks dari commit **tidak cukup**. Urutan tindakan:

1. **Berhenti** dan jangan menyebarkan lebih lanjut (tidak menempel di chat/issue).
2. **Identifikasi** secret apa, di mana (repo, bundle, log, prompt), dan sejak kapan.
3. **Rotasi/cabut** secret di penyedia asal (kunci API, password database, secret function, kredensial pembayaran).
4. **Terapkan** secret baru melalui mekanisme resmi dan deploy ulang bila perlu.
5. **Tinjau** log akses untuk melihat pemakaian tidak sah.
6. **Bersihkan** repo/riwayat sebagai langkah tambahan (bukan pengganti rotasi).
7. **Catat** insiden di `TASK.md`/decision log tanpa menuliskan nilai secret.

## 9. Checklist untuk setiap tabel, function, atau jalur akses baru

- [ ] RLS aktif (tabel).
- [ ] Policy per aksi (`SELECT/INSERT/UPDATE/DELETE`) ditulis eksplisit; tidak ada `USING (true)` pada data sensitif.
- [ ] Hak (`GRANT`) minimal; hak default yang tidak dibutuhkan dicabut dari `anon`/`authenticated`.
- [ ] Field sensitif (role, status, nominal, owner, audit) tidak dapat diubah client.
- [ ] View/RPC/Edge Function pada jalur yang sama menegakkan kontrol setara.
- [ ] Baris pada §4 dan §5 diperbarui.
- [ ] Test negatif untuk anonymous, Staff, dan Owner ada dan lulus.
- [ ] Tipe hasil generator disinkronkan.
- [ ] Tidak ada secret yang dimasukkan.

## 10. Security gate

Rilis **dilarang** bila salah satu berikut ditemukan, sampai diperbaiki dan diuji ulang:

- Akses lintas-user/lintas-role yang tidak sah.
- Privilege escalation (mis. Staff mengubah rolenya).
- Secret terekspos (Git, bundle, log, dokumentasi).
- Jalur publik dapat menetapkan status atau nominal kritis.
- Transaksi yang dapat merusak integritas data (parsial, ganda, total dimanipulasi).
- Tabel yang terekspos tanpa RLS/policy teruji.
- Fungsi `SECURITY DEFINER` tanpa kontrol §7.
- Booking dapat dikonfirmasi oleh pengunjung atau dua booking bentrok sama-sama terkonfirmasi.

Temuan lain dicatat sebagai known issue dengan tingkat risiko; jangan menyatakan “aman sempurna” tanpa dasar.

## 11. Model ancaman

| ID | Ancaman | Dampak | Mitigasi | Test |
|---|---|---|---|---|
| THR-01 | Anonim menulis kolom booking sembarang (status, pemilik, harga) | Booking dikonfirmasi sendiri, data rusak | Tanpa tulis langsung; RPC dengan daftar field & status dipaksa (§6.1) | TEST-BKG-02 |
| THR-02 | Staff menaikkan role dirinya | Eskalasi hak | `role` tidak dapat di-update client; jalur istimewa; trigger/policy penolak | TEST-RLS-05, TEST-AUTH-04 |
| THR-03 | Kebocoran data lintas role via query/RPC/view langsung meski menu disembunyikan | Data admin terbaca | RLS + grant minimal; negative test per role | TEST-RLS-02, TEST-RLS-03 |
| THR-04 | Secret bocor (service_role di `VITE_*`, Git, log, bundle) | Pengambilalihan database | Kebijakan §8; secret scan; pemeriksaan bundle | TEST-SEC-01, -02, -03 |
| THR-05 | Race: dua booking overlap sama-sama dikonfirmasi | Jadwal bentrok | Exclusion constraint di database | TEST-BKG-06 |
| THR-06 | Klien memanipulasi harga/total checkout | Kerugian finansial | Total dihitung server dari katalog | TEST-POS-01 |
| THR-07 | Checkout tersimpan sebagian | Data tidak konsisten | Satu transaksi atomik | TEST-POS-03 |
| THR-08 | Retry/double-submit menggandakan transaksi/pembayaran | Duplikasi uang | `client_request_id` unik | TEST-POS-04, TEST-PAY-06 |
| THR-09 | Spam/abuse endpoint publik | Beban/ketidakteraturan data | Anti-spam sepadan (DEC-017) | TEST-BKG-09 |
| THR-10 | Respons publik membocorkan PII/data internal | Pelanggaran privasi | Respons minimal; kolom publik eksplisit | TEST-BKG-08, TEST-RLS-07 |
| THR-11 | Stored XSS lewat konten CMS | Pengambilalihan sesi admin/pengunjung | Konten terstruktur + render aman (DEC-014) | TEST-CMS-03 |
| THR-12 | Penghitungan ganda DP/pelunasan pada laporan | Laporan keliru | Definisi metrik & ledger | TEST-PAY-02 |
| THR-13 | Migration destruktif/perubahan manual di production | Kehilangan data | Migration di Git, uji lokal, persetujuan, backup | TEST-DB-01, TEST-REL-03 |
| THR-14 | Enumerasi akun, brute force, sesi lemah | Pengambilalihan akun | Pesan generik, kebijakan password, batas sesi (§12) | TEST-AUTH-02 |
| THR-15 | Dependency/supply-chain berlebih atau rentan | Eksekusi kode berbahaya | Kebijakan dependency; lockfile; audit | TEST-SEC-04 |
| THR-16 | Agent AI melampaui kewenangan | Perubahan tak terkendali | `AGENTS.md`; review diff; Definition of Done | TEST-PROC-01 |
| THR-17 | Penghapusan/pengubahan jejak void/refund | Audit hilang | Append-only; audit log | TEST-PAY-04, TEST-DB-06 |
| THR-18 | Fungsi `SECURITY DEFINER` disalahgunakan (search_path, grant luas) | Eskalasi hak | Aturan §7; grant eksplisit | TEST-RLS-06 |
| THR-19 | Unggahan media berbahaya/berlebihan | Penyimpanan penuh, konten berbahaya | Batas tipe/ukuran; bucket terpisah | TEST-CMS-05 |

## 12. Autentikasi dan akun

- Metode autentikasi, sesi, dan sumber role diputuskan di DEC-016 (usulan: email + password lewat Supabase Auth, tanpa pendaftaran mandiri publik).
- **Sumber role:** tabel `profiles` (dikelola server). Jangan memakai metadata yang dapat diubah oleh pengguna sendiri sebagai dasar otorisasi.
- Pendaftaran publik untuk Owner/Staff dinonaktifkan (AC-AUTH-01.4); verifikasi pengaturan sign-up pada versi layanan/CLI yang dipakai.
- Akun Staff dibuat dan dinonaktifkan oleh Owner (OPEN-018). Akun nonaktif kehilangan akses seketika pada lapisan data (AC-AUTH-03.2).
- Owner pertama dibuat lewat prosedur setup operator yang terdokumentasi (bootstrap), bukan lewat form publik.
- Kebijakan password, reset password, dan batas percobaan login mengikuti kemampuan Supabase Auth dan dicatat saat TITIS-015/016.
- Pesan kegagalan login generik (AC-AUTH-01.2).

## 13. Kebijakan pelaporan kerentanan publik

Bagian ini mendokumentasikan kebijakan pelaporan kerentanan publik untuk proyek TITIS. Saat ini proyek **belum siap menerima laporan kerentanan dari publik**. Kebijakan ini ditulis sebagai persiapan dan akan diaktifkan pada TITIS-077 setelah persetujuan pemilik proyek.

### 13.1 Status saat ini

- Proyek tidak menerima laporan kerentanan melalui saluran publik (issue tracker, email publik, program bug bounty).
- Kerentanan yang ditemukan oleh pihak internal atau auditor dilaporkan langsung kepada pemilik proyek.
- Tidak ada alamat kontak keamanan publik, ruang lingkup program, atau SLA respons yang dipublikasikan.

### 13.2 Persyaratan aktivasi (TITIS-077)

Sebelum menerima laporan eksternal, berikut harus terpenuhi:

- [ ] Pemilik proyek menyetujui publikasi kebijakan.
- [ ] Alamat kontak keamanan (mis. `security@domain.tld`) dikonfigurasi dan diuji.
- [ ] Ruang lingkup (scope) program didefinisikan: aset yang termasuk/dikecualikan, tipe kerentanan yang dilaporkan, dan yang tidak.
- [ ] SLA wajar untuk konfirmasi awal, triase, dan resolusi dicatat.
- [ ] Prosedur koordinasi pembukaan informasi (coordinated disclosure) ditulis.
- [ ] Halaman/mekanisme pelaporan (form, email, atau platform pihak ketiga) siap digunakan.

### 13.3 Prosedur setelah aktif

- Laporan masuk melalui saluran yang ditentukan → dikonfirmasi dalam SLA → ditriage → diperbaiki → koordinasi publikasi jika perlu.
- Detail teknis kerentanan tidak dipublikasikan sebelum perbaikan diterapkan dan diverifikasi.
- Credit diberikan kepada pelapor sesuai preferensi mereka (anonim/terbuka).
