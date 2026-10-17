# PRD — TITIS

> **Status:** Disetujui sebagai baseline MVP — revisi 2026-10-15, diperbarui per keputusan Owner 2026-10-16.
> **Revisi:** 2026-10-16 (persetujuan Owner tertanggal 2026-10-16)
> **Tujuan dokumen:** Menetapkan masalah, target pengguna, cakupan MVP, alur produk, serta kriteria penerimaan TITIS.
> **Batas:** Detail implementasi teknis menjadi tanggung jawab `ARCHITECTURE.md`, `DATABASE.md`, dan `SECURITY.md`. Roadmap dan workflow proyek berada di `TITIS_MASTER_BUILD_GUIDE_FINAL.md`.

---

## 1. Ringkasan Produk

**TITIS adalah aplikasi open-source untuk satu bisnis lokal yang menggabungkan company profile fleksibel, CMS sederhana, booking dengan pencegahan bentrok, POS sederhana, dan laporan operasional dasar.**

Nilai utama TITIS adalah memberi bisnis website publik yang dapat dimulai dari template sederhana atau disesuaikan dengan desain UI/UX klien, tanpa harus membangun ulang sistem konten, booking, dan transaksi dari nol.

TITIS dikembangkan oleh solo developer dengan target MVP sekitar **satu bulan**, dengan asumsi kerja lima hari per minggu, sekitar 5–8 jam per hari, dan scope tidak terus bertambah. Target jam kerja terencana sekitar 100–110 jam produktif; ini estimasi, bukan jaminan.

### 1.1 Masalah yang ingin diselesaikan

Bisnis kecil sering mengelola informasi website, reservasi, kasir, dan laporan di alat yang terpisah. Akibatnya, informasi bisnis bisa tidak konsisten, booking dapat bertabrakan, dan data transaksi sulit diringkas.

TITIS menyatukan alur minimum tersebut dalam satu instalasi yang bisa dikembangkan sesuai kebutuhan bisnis.

### 1.2 Tujuan MVP

1. Menampilkan company profile yang rapi, responsif, dan mudah diperbarui.
2. Menyediakan dua pendekatan website: template sederhana atau tampilan custom yang dibuat melalui kode.
3. Mengelola konten dasar dan katalog produk/layanan dari dashboard.
4. Menerima permintaan booking publik dan mencegah dua booking terkonfirmasi berbenturan.
5. Mencatat transaksi POS yang dibayar lunas dengan metode pembayaran manual.
6. Menampilkan laporan operasional dasar dari data yang benar-benar tersimpan.
7. Menjaga data pribadi, transaksi, dan dashboard melalui kontrol akses di lapisan data.

### 1.3 Bukan tujuan MVP

TITIS versi pertama **bukan** sistem ERP, sistem akuntansi lengkap, SaaS multi-tenant, atau website builder drag-and-drop. Fokusnya adalah alur yang kecil tetapi berfungsi dan dapat diverifikasi.

---

## 2. Pengguna dan Model Bisnis

### 2.1 Model bisnis acuan

- Satu instalasi TITIS mewakili satu bisnis.
- Model contoh utama adalah kafe dengan ruang privat; sistem juga dapat cocok untuk studio foto, venue kecil, atau bisnis lokal yang menyewakan fasilitas.
- Pengunjung tidak perlu membuat akun untuk melihat website atau mengajukan booking.
- Dashboard internal pada MVP hanya memiliki **satu Owner account**.
- Tidak ada akun Staff pada MVP.
- Pembayaran dicatat manual; tidak ada payment gateway.

### 2.2 Persona

| Persona | Kebutuhan |
|---|---|
| Pengunjung | Mengenal bisnis, melihat produk/layanan dan fasilitas, menemukan kontak, serta mengajukan booking dari ponsel. |
| Owner | Mengubah konten dan katalog, mengatur fasilitas/jam operasional, memutuskan booking, membuat transaksi, serta melihat ringkasan laporan. |
| Developer/implementer | Menyesuaikan desain publik sesuai kebutuhan klien tanpa membangun ulang modul CMS, booking, dan POS. |

---

## 3. Nilai Utama: Company Profile Fleksibel

### 3.1 Mode template

MVP menyediakan satu template company profile yang layak digunakan tanpa custom coding per halaman. Template menampilkan bagian yang umum dibutuhkan bisnis: hero, ringkasan bisnis, tentang, produk/layanan, fasilitas (jika relevan), ajakan booking, kontak, jam buka, dan tautan sosial.

Owner dapat memperbarui konten melalui dashboard. Katalog publik mengambil data dari katalog produk/layanan yang sama dengan POS; harga tidak boleh dimasukkan ulang pada halaman publik.

### 3.2 Mode custom UI/UX

Untuk kebutuhan klien yang berbeda, developer dapat menyesuaikan tampilan publik melalui kode dengan menggunakan design tokens dan komponen yang dapat dipakai ulang. Penyesuaian dapat mencakup:

- layout dan hierarki section;
- warna, tipografi, spacing, dan elemen visual;
- komposisi halaman dan variasi komponen;
- gaya visual sesuai brand klien;
- penambahan komponen presentasi yang memang diperlukan.

Kedua mode tetap memakai sumber data, CMS, katalog, booking, dan backend yang sama.

### 3.3 Batas fleksibilitas yang disengaja

- **Konten** (teks, gambar, informasi bisnis, produk/layanan, kontak, jam buka) diubah oleh Owner di dashboard.
- **Desain/layout kompleks** diubah oleh developer melalui kode atau konfigurasi proyek yang disepakati.
- MVP tidak menyediakan page builder drag-and-drop, editor HTML/CSS bebas, atau sistem plugin desain.
- Owner tidak dapat mengeksekusi kode atau script melalui field CMS.

Pendekatan ini memberi ruang untuk custom design tanpa mengubah proyek menjadi pembuat website universal.

---

## 4. Cakupan MVP

### 4.1 Fitur yang masuk MVP

| Area | Requirement MVP | Prioritas |
|---|---|---|
| Company profile publik | Template dasar, halaman inti, responsif, navigasi dan CTA yang jelas | P0 |
| Custom UI/UX | Struktur komponen dan design tokens yang dapat disesuaikan developer per instalasi | P0 sebagai kapabilitas implementasi; bukan editor visual di dashboard |
| CMS | Owner mengedit profil bisnis dan field konten yang disediakan | P0 |
| Media | Unggah/pilih logo, hero, dan gambar katalog dengan pembatasan dasar | P0, sebatas kebutuhan halaman inti |
| Katalog | CRUD produk/layanan sederhana, status aktif/nonaktif, nama, deskripsi, harga, dan gambar opsional | P0 |
| Booking publik | Formulir tanpa akun; status awal ditetapkan sistem sebagai `pending` | P0 |
| Pengelolaan booking | Owner melihat detail booking, lalu mengonfirmasi, menolak, atau membatalkan | P0 |
| Anti-bentrok | Booking `confirmed` tidak boleh overlap pada resource yang sama, termasuk saat ada request bersamaan | P0 |
| POS | Keranjang, checkout lunas, metode pembayaran manual | P0 |
| Riwayat transaksi | Daftar dan detail transaksi dengan snapshot item/harga | P0 |
| Laporan | Penjualan berdasarkan periode, jumlah transaksi, penjualan per metode, dan ringkasan booking | P0 |
| Auth & security | Satu akun Owner, RLS, validasi aturan kritis di database/server | P0 |
| Deployment | Frontend dan backend dapat digunakan di lingkungan yang disepakati | P0 |

### 4.2 Fitur yang ditunda

| Fitur | Status | Alasan |
|---|---|---|
| Akun Staff dan permission matrix | Deferred | Mengurangi kompleksitas autentikasi dan RLS pada MVP. |
| Page builder drag-and-drop | Deferred / out of scope | Kompleks dan tidak diperlukan untuk custom design yang dikerjakan developer. |
| Layout bebas yang diedit Owner | Out of scope | Konten dan struktur desain perlu dipisahkan demi keamanan dan konsistensi. |
| DP dan pelunasan bertahap | Deferred | Membuat model pembayaran, status transaksi, dan laporan lebih rumit. |
| Payment gateway/webhook/refund otomatis | Out of scope | Pembayaran manual mencukupi untuk MVP. |
| Diskon, kupon, pajak kompleks, pembulatan otomatis | Deferred | Mengurangi variasi perhitungan checkout dan laporan. |
| Void/refund/koreksi transaksi | Deferred | Memerlukan aturan audit dan laporan khusus. Transaksi selesai tidak dapat diedit atau dihapus di MVP. |
| Inventaris/stok, resep/BOM, supplier, purchase order | Out of scope | Tidak diperlukan untuk POS berbasis katalog sederhana. |
| POS offline | Out of scope | Memerlukan sinkronisasi serta penanganan konflik tambahan. |
| Notifikasi email/WhatsApp otomatis | Deferred | Owner menghubungi pengunjung secara manual menggunakan kontak yang diberikan. |
| Pembatalan/reschedule mandiri oleh pengunjung | Deferred | Perubahan booking ditangani Owner di luar alur publik. |
| Multi-tenant SaaS dan billing | Out of scope | Satu instalasi untuk satu bisnis. |
| Multi-bahasa otomatis / i18n library | Deferred | Antarmuka UI bilingual (English default + Indonesian via selector) tanpa library i18n; konten CMS bilingual tetapi tidak diterjemahkan otomatis. |
| Analitik lanjutan dan laporan akuntansi | Deferred | MVP hanya laporan operasional sederhana. |
| Workflow draft/publish yang kompleks | Deferred | Perubahan konten yang disimpan langsung berlaku pada website publik. |
| SEO lanjutan dan prerender/SSR dinamis | Deferred | Perlu diputuskan sebagai pengembangan terpisah; MVP tidak boleh mengklaim SEO teknis tingkat lanjut. |
| Otomatisasi penghapusan data berdasarkan retensi | Deferred | Kebijakan retensi dicatat, tetapi scheduled deletion bukan syarat MVP. |

### 4.3 Batas produk penting

MVP tidak dirancang sebagai sistem akuntansi resmi. Laporan penjualan merupakan laporan operasional yang dihitung dari transaksi POS yang tersimpan. Karena tidak ada void/refund, transaksi yang sudah selesai bersifat tidak dapat diubah pada MVP; Owner harus memeriksa keranjang sebelum checkout.

---

## 5. Halaman dan Area Aplikasi

### 5.1 Website publik

| Halaman | Isi minimum |
|---|---|
| Beranda | Hero, ringkasan bisnis, pilihan layanan/produk, fasilitas jika relevan, CTA booking/kontak |
| Tentang | Deskripsi dan cerita bisnis |
| Produk/Layanan | Katalog item aktif dengan field publik dan harga yang sama dengan POS |
| Ruang/Fasilitas | Daftar resource yang bisa dipesan; boleh disembunyikan jika bisnis tidak memakai booking resource |
| Booking | Formulir permintaan booking dan keterangan bahwa booking belum dikonfirmasi sampai Owner menyetujuinya |
| Kontak | Alamat, jam buka, telepon/WhatsApp, tautan sosial, dan **tautan peta eksternal** bila diisi (tidak ada peta embedded) |
| 404 | Pesan halaman tidak ditemukan dan tautan kembali |

Halaman tambahan boleh dibuat melalui custom coding ketika memang diperlukan dalam proyek klien, tetapi tidak menjadi syarat pada template dasar MVP.

### 5.2 Dashboard Owner

| Area | Kemampuan minimum |
|---|---|
| Login | Login dan logout Owner; tidak ada signup publik |
| Ringkasan | Booking pending, transaksi hari ini, dan ringkasan penjualan sederhana |
| Profil & konten | Edit profil bisnis dan konten field yang ditetapkan |
| Katalog | Tambah, edit, nonaktifkan produk/layanan; harga dan konten publik berada di satu tempat |
| Booking | Filter daftar, lihat detail, konfirmasi, menolak, atau membatalkan booking |
| Resource/jam buka | Kelola resource yang dapat dipesan dan jam operasional |
| POS | Cari/pilih item katalog, ubah kuantitas, lihat total, pilih metode pembayaran, checkout |
| Transaksi | Daftar transaksi, detail, item dan metode pembayaran; data transaksi selesai tidak dapat diedit/hapus |
| Laporan | Filter tanggal dan melihat metrik operasional dasar |

---

## 6. Requirement dan Acceptance Criteria

Acceptance criteria berikut menjadi batas untuk MVP. Detail teknis tes dapat dipetakan ke `TESTING.md` saat dokumen itu dibuat.

### 6.1 Company profile dan CMS

**US-WEB-01 — Pengunjung melihat website bisnis**

- AC-WEB-01.1 Halaman publik yang disepakati tampil pada ponsel dan desktop tanpa konten utama terpotong.
- AC-WEB-01.2 Data nama, kontak, jam buka, dan ringkasan bisnis bersumber dari data bisnis yang dikelola Owner.
- AC-WEB-01.3 Katalog publik hanya menampilkan item aktif serta field yang memang ditetapkan sebagai data publik.
- AC-WEB-01.4 Jika suatu bagian opsional tidak memiliki data, tampilan tidak menunjukkan placeholder rusak atau error.
- AC-WEB-01.5 Navigasi dan CTA booking/kontak bekerja; route yang tidak dikenal menampilkan halaman 404.
- AC-WEB-01.6 Field CMS tidak dapat menjalankan script/HTML berbahaya saat dirender.

**US-CMS-01 — Owner mengubah konten**

- AC-CMS-01.1 Owner yang login dapat mengedit field profil bisnis dan menyimpan perubahan.
- AC-CMS-01.2 Perubahan konten yang disimpan tampil di website tanpa developer harus mengubah kode.
- AC-CMS-01.3 Field wajib dan format input divalidasi, dengan pesan error yang dapat dipahami.
- AC-CMS-01.4 Gambar yang diunggah dibatasi oleh tipe dan ukuran yang diperbolehkan.
- AC-CMS-01.5 Pengunjung anonim tidak dapat mengubah konten, katalog, konfigurasi resource, atau data internal.
- AC-CMS-01.6 Owner dapat mengedit konten dalam dua bahasa (English + Indonesian) untuk field yang disediakan; tidak ada terjemahan otomatis.

**US-DESIGN-01 — Developer menyesuaikan tampilan untuk klien**

- AC-DESIGN-01.1 Template dasar menggunakan komponen dan design tokens yang konsisten dengan **single dark theme sebagai primary** (tidak ada light/dark toggle).
- AC-DESIGN-01.2 Developer dapat mengganti atau menata ulang komponen publik melalui kode tanpa mengganti model data atau membangun ulang modul booking/POS.
- AC-DESIGN-01.3 Custom design tidak mengharuskan Owner mengedit kode untuk memperbarui konten sehari-hari.
- AC-DESIGN-01.4 Perubahan desain tidak menurunkan aksesibilitas dasar atau responsivitas halaman inti.

### 6.2 Booking

**US-BOOK-01 — Pengunjung mengajukan booking**

- AC-BOOK-01.1 Pengunjung dapat mengajukan booking tanpa akun.
- AC-BOOK-01.2 Form meminta resource, waktu mulai/selesai, nama, kontak, jumlah orang, dan catatan opsional.
- AC-BOOK-01.3 Status baru selalu ditetapkan oleh sistem sebagai `pending`; pengunjung tidak dapat mengirim status `confirmed`.
- AC-BOOK-01.4 Waktu tidak valid, waktu lampau, resource nonaktif, durasi di luar batas, atau waktu di luar jam operasional ditolak oleh lapisan tepercaya.
- AC-BOOK-01.5 Setelah berhasil, pengunjung menerima pesan bahwa permintaannya diterima untuk ditinjau, bukan konfirmasi reservasi.
- AC-BOOK-01.6 Respons publik tidak menampilkan data pribadi atau rincian booking orang lain.
- AC-BOOK-01.7 Form memuat pemberitahuan singkat penggunaan data kontak dan perlindungan spam sederhana (honeypot + request limiting; Turnstile tidak diperlukan).

**US-BOOK-02 — Owner mengelola booking**

- AC-BOOK-02.1 Owner dapat melihat dan memfilter daftar booking berdasarkan tanggal/status/resource.
- AC-BOOK-02.2 Owner dapat mengonfirmasi, menolak (dengan alasan opsional), atau membatalkan booking.
- AC-BOOK-02.3 Sistem menolak konfirmasi jika booking berbenturan dengan booking terkonfirmasi lain untuk resource yang sama.
- AC-BOOK-02.4 Pencegahan bentrok tetap berlaku jika dua permintaan konfirmasi terjadi hampir bersamaan; database hanya boleh menerima hasil yang tidak bentrok.
- AC-BOOK-02.5 Booking pending tidak memblokir waktu, sehingga Owner dapat menerima satu dan menolak yang lain.
- AC-BOOK-02.6 Pengunjung tidak dapat membaca booking internal melalui API/database atau mengubah status booking.

**Aturan booking untuk MVP**

- Zona waktu bisnis: `Asia/Jakarta`.
- Waktu mulai harus mengikuti slot 60 menit; durasi booking merupakan kelipatan 60 menit dengan durasi maksimum 4 jam.
- Buffer antar-booking: 15 menit.
- Pemesanan maksimal 30 hari ke depan.
- Resource dan jam operasional dapat dikelola Owner. Aturan slot/buffer/horizon merupakan konfigurasi proyek untuk MVP, bukan halaman pengaturan kompleks di dashboard.
- Hanya booking `confirmed` yang menghalangi waktu. Interval dianggap setengah-terbuka `[mulai, selesai)`, sehingga booking berikutnya boleh mulai tepat ketika rentang booking sebelumnya berakhir jika buffer tidak membuatnya overlap.
- Owner menolak booking dengan alasan opsional (`rejection_reason`).
- Tidak ada pembatalan atau reschedule mandiri oleh pengunjung. Owner mengelola perubahan secara manual.
- Tidak ada notifikasi otomatis. Owner menghubungi pengunjung melalui kontak yang disimpan.

### 6.3 Katalog dan POS

**US-POS-01 — Owner mengelola katalog**

- AC-POS-01.1 Owner dapat membuat, mengubah, dan menonaktifkan produk/layanan.
- AC-POS-01.2 Item nonaktif tidak muncul di katalog publik dan tidak dapat ditambahkan ke transaksi baru.
- AC-POS-01.3 Harga disimpan sebagai nilai uang dengan tipe yang aman untuk nominal; jangan menggunakan floating-point untuk perhitungan uang.

**US-POS-02 — Owner membuat transaksi**

- AC-POS-02.1 Owner dapat memilih item aktif dan kuantitas untuk checkout.
- AC-POS-02.2 Harga final dan total dihitung ulang pada lapisan database/server; nilai total yang dikirim browser tidak dipercaya.
- AC-POS-02.3 Checkout menyimpan order, item, dan pembayaran sebagai satu operasi atomik.
- AC-POS-02.4 Item transaksi menyimpan snapshot nama dan harga agar perubahan katalog tidak mengubah riwayat lama.
- AC-POS-02.5 Transaksi yang selesai dibayar sekaligus dengan metode tunai, transfer, atau QRIS manual.
- AC-POS-02.6 Retry/double-submit dengan request yang sama tidak menghasilkan transaksi duplikat.
- AC-POS-02.7 Nomor transaksi unik dijamin oleh database.
- AC-POS-02.8 Transaksi selesai tidak dapat diedit atau dihapus melalui dashboard pada MVP.

**Batas perhitungan POS**

- Tidak ada diskon, kupon, pajak tambahan, pembulatan khusus, DP, cicilan, refund, atau void pada MVP.
- Tidak ada stok/inventaris pada MVP.
- Nama dan harga produk yang tersimpan pada detail transaksi adalah snapshot saat checkout.
- Penjualan diakui saat checkout berhasil dan lunas. Data ini merupakan laporan operasional, bukan buku besar akuntansi.

### 6.4 Laporan

**US-REPORT-01 — Owner melihat laporan sederhana**

- AC-REPORT-01.1 Owner dapat memilih rentang tanggal.
- AC-REPORT-01.2 Laporan menampilkan total penjualan, jumlah transaksi, dan total per metode pembayaran untuk transaksi yang berhasil.
- AC-REPORT-01.3 Jika disertakan, item terlaris dihitung dari kuantitas item transaksi, bukan status katalog saat ini.
- AC-REPORT-01.4 Ringkasan booking menampilkan jumlah booking menurut status.
- AC-REPORT-01.5 Nilai laporan dapat direkonsiliasi dengan fixture transaksi yang dihitung manual.
- AC-REPORT-01.6 Tanggal dihitung mengikuti zona waktu bisnis `Asia/Jakarta`.
- AC-REPORT-01.7 Laporan hanya dapat diakses oleh Owner yang terautentikasi.

### 6.5 Autentikasi, keamanan, dan kualitas

- AC-SEC-01.1 Tidak ada signup Owner publik; akun Owner dibuat melalui prosedur setup yang didokumentasikan.
- AC-SEC-01.2 Pengunjung anonim tidak dapat membaca atau mengubah data internal booking dan transaksi.
- AC-SEC-01.3 RLS aktif dan diuji pada tabel yang terekspos kepada client; grants dan function permissions juga ditinjau.
- AC-SEC-01.4 Kunci rahasia/service-role tidak pernah disimpan dalam frontend atau repository.
- AC-SEC-01.5 Aturan bisnis penting—termasuk status booking, anti-bentrok, harga, total, dan checkout—tidak bergantung pada UI saja.
- AC-QUAL-01.1 Halaman inti memiliki loading, empty, success, dan error state yang sesuai.
- AC-QUAL-01.2 Form memiliki label yang jelas, focus keyboard yang layak, pesan validasi, dan kontras yang memadai.
- AC-QUAL-01.3 Migration dapat diterapkan ulang pada environment development/test sesuai prosedur proyek.
- AC-QUAL-01.4 Build dan tes yang diwajibkan lulus sebelum release.

---

## 7. Data, Privasi, Bahasa, Tema, dan SEO

- Mata uang: Rupiah (IDR) — disimpan sebagai integer `bigint` rupiah di database; di TypeScript/JSON sebagai string; tidak menggunakan floating-point untuk uang.
- Format angka/tanggal: format Indonesia.
- Zona waktu bisnis: `Asia/Jakarta`.
- Bahasa antarmuka UI: **English default + Indonesian via selector** (public + admin); **tanpa library i18n** kecuali disetujui terpisah. Konten CMS bilingual tetapi tidak diterjemahkan otomatis.
- Tema UI MVP: **Single dark theme sebagai primary** — tidak ada light/dark toggle pada MVP.
- Form booking menampilkan pemberitahuan penggunaan data kontak yang singkat dan perlindungan spam sederhana (honeypot + request limiting; Turnstile tidak diperlukan).
- Kebijakan retensi yang direncanakan: data kontak pengunjung dipertahankan maksimum 12 bulan kecuali dibutuhkan lebih lama secara sah; catatan transaksi keuangan tidak dihapus otomatis. Otomatisasi retensi bukan bagian MVP dan perlu dirancang terpisah.
- SEO MVP terbatas pada: struktur halaman yang jelas, judul/deskripsi dasar (metadata), URL yang konsisten, heading yang bermakna, link internal, dan halaman 404. **Prerender/SSR dan multilingual SEO deferred** — tidak menjanjikan SEO teknis lengkap pada MVP.
- Karena frontend baseline adalah Vite SPA dan konten diambil secara dinamis, kebutuhan SEO berbasis konten dinamis perlu diuji dan strategi prerender/SSR dapat menjadi fase berikutnya. Keterbatasan ini harus disampaikan transparan dalam dokumentasi rilis.

---

## 8. Kriteria Keberhasilan MVP

MVP dianggap memenuhi target ketika seluruh hal berikut dibuktikan:

1. Owner dapat login, memperbarui konten (bilingual English/Indonesian), mengelola katalog, mengelola booking, membuat transaksi, dan melihat laporan.
2. Template company profile berjalan dengan **single dark theme**, dan struktur komponen memungkinkan custom UI/UX melalui kode tanpa mengubah backend inti.
3. Pengunjung dapat mengirim booking (UI bilingual English/Indonesian); hanya Owner dapat memutuskan status; booking terkonfirmasi tidak bisa berbenturan.
4. POS menghitung harga di lapisan tepercaya (IDR integer), menyimpan snapshot item/harga, serta tidak membuat transaksi ganda akibat retry yang sama.
5. Laporan dapat direkonsiliasi dengan data transaksi uji.
6. Pengujian akses membuktikan data internal tidak terbuka kepada pengguna anonim.
7. Halaman utama berfungsi pada ponsel dan desktop.
8. Proyek dapat dijalankan dari repository bersih menggunakan dokumentasi setup yang telah diuji.
9. Satu alur penuh diuji secara manual: edit konten → ajukan booking → konfirmasi/penolakan → checkout → periksa laporan.
10. Tidak ada fitur deferred yang diam-diam masuk scope hanya untuk menyempurnakan produk.

---

## 9. Risiko dan Trade-off yang Diketahui

| Risiko | Dampak | Mitigasi MVP |
|---|---|---|
| Custom design memperluas pekerjaan | Timeline melewati satu bulan | Batasi pada scope desain yang disetujui; reuse design tokens/komponen; custom layout tidak termasuk dalam jam pengembangan inti sampai scope per klien disepakati. |
| Vite SPA membatasi SEO dinamis | Konten mungkin tidak terindeks seideal halaman SSR/prerender | Batasi klaim SEO MVP; ukur kebutuhan SEO dan buat strategi lanjutan sebelum menjanjikan kepada klien. |
| Booking pending menumpuk | Owner dapat lupa mengambil keputusan | Dashboard menonjolkan pending; tidak ada notifikasi otomatis pada MVP. |
| Tidak ada void/refund | Kesalahan checkout sulit diperbaiki | Konfirmasi keranjang sebelum checkout; transaksi selesai tidak bisa dihapus; jelaskan keterbatasan ke pengguna pilot. |
| Form booking publik dapat disalahgunakan | Spam booking | Validasi, honeypot + request limiting pada MVP; Turnstile tidak diperlukan. |
| Scope creep | Fitur inti tidak selesai | Fitur di luar §4 tidak dikerjakan tanpa revisi scope dan dampak waktu tertulis. |
| Kebocoran data | Informasi pribadi atau transaksi terlihat publik | RLS, privilege minimum, tes akses negatif, dan review function/grants. |

---

## 10. Aturan Perubahan Scope

- PRD ini adalah sumber kebenaran kebutuhan produk.
- Perubahan requirement harus mencantumkan alasan, dampak waktu, dampak schema/security, serta fitur lain yang harus ditunda untuk mengimbanginya.
- AI agent boleh mengusulkan alternatif, tetapi tidak boleh memperluas scope atau mengubah prioritas tanpa persetujuan pemilik proyek.
- Fitur deferred hanya masuk setelah MVP inti selesai atau scope/schedule direvisi secara eksplisit.
- Detail skema database dan kontrol akses harus konsisten dengan PRD, tetapi didefinisikan pada dokumen teknis dan migration files.
