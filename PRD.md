# PRD — TITIS (Product Requirements Document)

> **Status:** Draft untuk ditinjau pemilik proyek (`TASK.md` → TITIS-002). Belum disetujui.
> **Sumber kebenaran untuk:** tujuan produk, pengguna, scope, requirements, user stories, dan acceptance criteria.
> **Bukan untuk:** keputusan teknis (lihat `ARCHITECTURE.md`), skema (lihat `docs/DATABASE.md`), atau hak akses teknis (lihat `docs/SECURITY.md`).
> **Konvensi label:**
> - **OPEN-xxx** — keputusan produk yang belum disetujui. Agent tidak boleh memilihnya sendiri (`MASTER_BUILD_GUIDE.md` §1.5).
> - **(Usulan)** — isi yang diturunkan dari rencana proyek atau diusulkan sebagai titik awal; **belum menjadi requirement final** sampai pemilik proyek menyetujuinya.
> - **P0 / P1 / P2** — prioritas usulan: P0 wajib untuk MVP, P1 masuk MVP bila OPEN terkait diputuskan masuk scope, P2 setelah MVP.
> - **Status OPEN:** `Open` (belum diputuskan) · `Decided` (diputuskan pemilik; tanggal dicatat) · `Deferred` (ditunda dengan owner, alasan, dan tenggat). Hanya `Decided` yang membolehkan implementasi bergantung padanya.

---

## 1. Masalah dan tujuan

### 1.1 Masalah

Bisnis lokal kecil (contoh referensi: kafe dengan ruang privat) umumnya mengelola halaman publik, reservasi, kasir, pencatatan pembayaran, dan laporan di alat yang terpisah: media sosial, chat, buku catatan, atau spreadsheet. Akibatnya: info publik tidak seragam, reservasi bentrok, angka penjualan sulit dipercaya, dan pencatatan DP/pelunasan tidak konsisten.

### 1.2 Tujuan produk

TITIS membantu **satu bisnis lokal** mengelola, dalam satu sistem:

1. Halaman publik dan konten bisnis yang dapat diubah tanpa developer.
2. Permintaan booking dari pengunjung dan keputusan Owner/Staff atasnya, tanpa bentrok jadwal.
3. Transaksi POS sederhana.
4. Pencatatan pembayaran manual (termasuk DP dan pelunasan bila disetujui).
5. Laporan operasional yang dapat direkonsiliasi dengan data transaksi sebenarnya.

### 1.3 Tujuan non-produk (proyek)

- Open-source (lisensi: lihat OPEN-017).
- Dibangun bertahap oleh solo developer dengan bantuan AI agent, dengan kontrol mutu berbasis dokumen, test, dan gate fase.

## 2. Pengguna dan model bisnis referensi

### 2.1 Model bisnis referensi (Usulan — OPEN-016)

Kafe dengan ruang privat:

- Satu instalasi mewakili satu bisnis.
- Fasilitas/resource tertentu (mis. ruang privat) dapat dipesan berdasarkan jadwal.
- Pengunjung hanya **mengajukan** booking; keputusan ada pada Owner/Staff berwenang.
- Booking baru berstatus awal yang ditetapkan sistem (umumnya `pending`).
- Booking terkonfirmasi tidak boleh bentrok pada resource dan rentang waktu yang sama.
- Pembayaran dicatat manual pada MVP.

Jika calon pengguna pilot menunjukkan model lain lebih tepat, revisi asumsi ini di sini dan catat dampaknya pada data, desain, dan arsitektur. Jangan diam-diam membuat sistem “universal untuk semua bisnis”.

### 2.2 Persona

| ID | Persona | Kebutuhan utama |
|---|---|---|
| PER-1 | **Pengunjung** (anonim) | Melihat info bisnis, layanan/produk, kontak; mengajukan booking dengan mudah dari ponsel. |
| PER-2 | **Owner** | Mengendalikan seluruh data bisnis, konten, akun Staff, keuangan, dan laporan. |
| PER-3 | **Staff** | Menjalankan operasional harian (booking, kasir) sesuai izin yang diberikan Owner. |

Role sistem hanya **Owner** dan **Staff**. Pengunjung adalah aktor tanpa akun. Role lain tidak ada pada MVP kecuali scope diubah.

### 2.3 Kemampuan Staff

Kemampuan Staff **belum diputuskan** dan ditandai OPEN pada §8 (OPEN-001 s.d. OPEN-005, OPEN-010). Matriks izin teknis ada di `docs/SECURITY.md` §4 dan harus mengikuti keputusan ini.

## 3. Scope MVP

### 3.1 Dalam scope (baseline dari rencana proyek)

| Area | Ringkasan | Prioritas (Usulan) |
|---|---|---|
| Autentikasi & otorisasi | Login Owner/Staff, akses sesuai role | P0 |
| Company profile & CMS | Profil bisnis dan halaman publik dinamis yang bisa diedit | P0 |
| Public website | Halaman bisnis, layanan/produk, kontak | P0 |
| Booking publik | Formulir permintaan booking | P0 |
| Manajemen booking | Daftar, detail, keputusan status | P0 |
| Anti-bentrok jadwal | Pencegahan booking terkonfirmasi yang overlap | P0 |
| Katalog + POS | Katalog produk/layanan sederhana dan checkout | P0 |
| Pembayaran manual | Pencatatan pembayaran; DP & pelunasan bila disetujui (OPEN-011) | P0 / P1 |
| Riwayat transaksi | Daftar dan detail transaksi/pembayaran | P0 |
| Sales Insight | Laporan dari data transaksi/pembayaran sebenarnya | P0 |
| Manajemen media | Unggah gambar untuk konten (OPEN-006) | P1 |
| Pembatalan/reschedule/expiry | Sesuai OPEN-008 | P1 |
| Void/refund/koreksi | Sesuai OPEN-010 / OPEN-011 | P1 |

### 3.2 Di luar scope MVP

Tidak dibangun kecuali scope diubah secara sengaja dan dampaknya disetujui:

- Inventaris berbasis resep/BOM.
- Supplier dan purchase order.
- Payment gateway atau pembayaran otomatis.
- POS offline.
- Multi-tenant SaaS dan isolasi banyak bisnis dalam satu instalasi.
- Billing/langganan SaaS.
- Fitur lain yang tidak mendukung acceptance criteria MVP.

**Catatan:** katalog produk/layanan untuk POS **bukan** sistem inventaris berbasis resep. Katalog sederhana masuk scope; pengelolaan stok kompleks tidak ikut masuk.

## 4. Daftar halaman (Usulan — OPEN-006)

### 4.1 Public website

| Halaman | Isi | Sumber konten |
|---|---|---|
| Beranda | Hero, ringkasan bisnis, ajakan booking | CMS |
| Tentang | Cerita dan informasi bisnis | CMS |
| Layanan/Menu | Daftar layanan/produk | CMS atau katalog (OPEN-006) |
| Ruang/Fasilitas | Daftar resource yang dapat dipesan | Data resource |
| Booking | Formulir permintaan booking | Form |
| Kontak | Alamat, jam buka, kontak, peta/tautan | Profil bisnis |
| 404 | Halaman tidak ditemukan | Statis |

### 4.2 Admin dashboard

| Halaman | Isi | Role (lihat OPEN) |
|---|---|---|
| Login | Autentikasi | Semua |
| Ringkasan | Booking menunggu keputusan, transaksi hari ini | Sesuai izin |
| Konten | Profil bisnis, halaman publik, media | Owner; Staff sesuai OPEN-001 |
| Booking | Daftar, detail, keputusan | Owner; Staff sesuai OPEN-002 |
| Resource | Pengelolaan resource dan jam operasional | Owner |
| Katalog | Pengelolaan produk/layanan | Owner; Staff sesuai OPEN-010 |
| Kasir (POS) | Membuat transaksi | Owner, Staff |
| Transaksi | Riwayat dan detail, pembayaran | Owner; Staff sesuai OPEN-004 |
| Laporan | Sales Insight | Owner; Staff sesuai OPEN-005 |
| Pengaturan | Pengaturan bisnis, akun Staff | Owner |

## 5. User stories dan acceptance criteria

Format ID: `US-<AREA>-nn` untuk story, `AC-<AREA>-nn.m` untuk kriteria. Setiap AC harus dapat diamati dan diuji; pemetaan ke test ada di `docs/TESTING.md` §9. AC yang bergantung pada keputusan terbuka diberi tanda **[OPEN-xxx]**: rumusnya final setelah keputusan itu diambil.

### 5.1 Autentikasi dan akun (AUTH)

**US-AUTH-01 — Login (P0).** Sebagai Owner/Staff, saya ingin login dan logout agar dapat mengakses dashboard.

- AC-AUTH-01.1 Pengguna terdaftar dapat login dan logout; setelah logout, halaman admin tidak dapat diakses tanpa login ulang.
- AC-AUTH-01.2 Kredensial salah menampilkan pesan generik yang tidak mengungkap apakah email terdaftar.
- AC-AUTH-01.3 Sesi kedaluwarsa mengarahkan ke login tanpa menampilkan data admin.
- AC-AUTH-01.4 Tidak ada pendaftaran mandiri publik yang dapat menghasilkan akun Owner atau Staff.

**US-AUTH-02 — Akses sesuai role (P0).** Sebagai pemilik bisnis, saya ingin setiap pengguna hanya mengakses fitur yang diizinkan.

- AC-AUTH-02.1 Pengguna anonim tidak dapat membuka halaman admin maupun memanggil data admin secara langsung.
- AC-AUTH-02.2 Staff tidak dapat membuka atau memanggil fitur/data yang dilarang bagi Staff, baik lewat URL langsung maupun akses data langsung. **[OPEN-001..005, OPEN-010]**

**US-AUTH-03 — Kelola akun Staff (P0).** Sebagai Owner, saya ingin menambah dan menonaktifkan Staff. **[OPEN-018]**

- AC-AUTH-03.1 Owner dapat menambah akun Staff dan menonaktifkan akun Staff.
- AC-AUTH-03.2 Staff yang dinonaktifkan kehilangan akses ke seluruh data dan fitur admin.
- AC-AUTH-03.3 Staff tidak dapat mengubah role dirinya atau pengguna lain.

### 5.2 Public website (PUB)

**US-PUB-01 — Melihat info bisnis (P0).** Sebagai Pengunjung, saya ingin melihat halaman bisnis agar mengenal bisnis ini.

- AC-PUB-01.1 Hanya konten berstatus publish yang tampil kepada pengunjung; konten draft tidak terlihat. **[OPEN-006]**
- AC-PUB-01.2 Setiap halaman publik terbaca dan dapat dipakai pada layar ponsel, tablet, dan desktop.
- AC-PUB-01.3 Setiap halaman publik memiliki metadata dan URL sesuai keputusan SEO. **[OPEN-015]**
- AC-PUB-01.4 Halaman yang tidak ada menampilkan 404 yang jelas, bukan layar kosong.

**US-PUB-02 — Melihat layanan/produk dan ruang (P0).** Sebagai Pengunjung, saya ingin melihat daftar layanan/produk dan ruang yang dapat dipesan.

- AC-PUB-02.1 Daftar menampilkan hanya item aktif dan field publik yang ditetapkan; tidak ada data internal (mis. biaya, catatan internal). **[OPEN-006]**
- AC-PUB-02.2 Kondisi kosong dan kondisi gagal memuat ditampilkan dengan pesan yang jelas.

### 5.3 CMS (CMS)

**US-CMS-01 — Kelola profil bisnis (P0).** Sebagai Owner, saya ingin mengubah informasi bisnis (nama, alamat, kontak, jam buka, tautan sosial).

- AC-CMS-01.1 Pengguna berwenang dapat mengubah profil bisnis dan hasilnya tampil di public website.
- AC-CMS-01.2 Input divalidasi (panjang, format kontak/URL) dengan pesan error per field.
- AC-CMS-01.3 Pengguna tanpa izin tidak dapat mengubah profil bisnis, termasuk lewat akses data langsung. **[OPEN-001]**

**US-CMS-02 — Kelola halaman publik (P0).** Sebagai Owner, saya ingin menyunting konten halaman dan mengatur tampil/tidaknya.

- AC-CMS-02.1 Pengguna berwenang dapat menyunting field konten yang ditetapkan per halaman dan perubahannya tampil di public website. **[OPEN-006]**
- AC-CMS-02.2 Konten draft tidak tampil publik sampai dipublikasikan. **[OPEN-006]**
- AC-CMS-02.3 Konten yang dirender di halaman publik tidak dapat mengeksekusi skrip yang disisipkan lewat input CMS.
- AC-CMS-02.4 Setiap halaman mempunyai judul dan deskripsi meta yang dapat diedit. **[OPEN-006, OPEN-015]**

**US-CMS-03 — Kelola gambar (P1).** Sebagai Owner, saya ingin mengunggah gambar untuk konten. **[OPEN-006]**

- AC-CMS-03.1 Hanya tipe dan ukuran file yang diizinkan yang diterima; yang lain ditolak dengan pesan jelas.
- AC-CMS-03.2 Setiap gambar mempunyai teks alternatif yang dapat diisi.
- AC-CMS-03.3 Pengguna tanpa izin tidak dapat mengunggah atau menghapus gambar.

### 5.4 Booking (BKG)

**US-BKG-01 — Mengajukan booking (P0).** Sebagai Pengunjung, saya ingin mengajukan permintaan booking tanpa membuat akun.

- AC-BKG-01.1 Pengunjung dapat mengirim permintaan dengan field minimum: resource, waktu mulai/selesai, nama, kontak, jumlah orang, catatan opsional. **[OPEN-007]**
- AC-BKG-01.2 Sistem menetapkan status awal (`pending`); pengunjung tidak dapat menetapkan status, pemilik data, harga resmi, atau field privilege.
- AC-BKG-01.3 Input tidak valid (waktu selesai ≤ mulai, waktu lampau, resource tidak ada/nonaktif, di luar jam operasional/batas pemesanan) ditolak oleh lapisan tepercaya dengan pesan yang dapat ditindaklanjuti. **[OPEN-007]**
- AC-BKG-01.4 Setelah berhasil, pengunjung melihat konfirmasi bahwa permintaan **diterima** (bukan bahwa booking dikonfirmasi).
- AC-BKG-01.5 Respons publik tidak mengandung data pribadi atau data internal booking lain.
- AC-BKG-01.6 Form publik memiliki perlindungan spam/abuse yang sepadan dengan risikonya. **[OPEN-007]**
- AC-BKG-01.7 Loading, sukses, dan error ditampilkan jelas; kegagalan jaringan memberi kesempatan mencoba ulang tanpa kehilangan isian.
- AC-BKG-01.8 *(Usulan review)* Pengunjung diberi tahu cara dan perkiraan waktu keputusan booking akan disampaikan. **[OPEN-019]**
- AC-BKG-01.9 *(Usulan review)* Form booking menampilkan pemberitahuan penggunaan data pribadi sesuai keputusan. **[OPEN-020]**

**US-BKG-02 — Melihat booking (P0).** Sebagai Owner/Staff, saya ingin melihat daftar dan detail booking.

- AC-BKG-02.1 Daftar dapat difilter menurut status, tanggal, dan resource.
- AC-BKG-02.2 Pengguna tanpa izin tidak dapat membaca data booking, termasuk lewat akses data langsung.
- AC-BKG-02.3 Kondisi kosong, loading, dan error ditangani.

**US-BKG-03 — Memutuskan booking (P0).** Sebagai Owner/Staff berwenang, saya ingin mengonfirmasi atau menolak booking. **[OPEN-002, OPEN-008]**

- AC-BKG-03.1 Hanya pengguna berwenang yang dapat mengubah status; perubahan hanya mengikuti transisi yang diizinkan. **[OPEN-008]**
- AC-BKG-03.2 Konfirmasi dan penolakan mencatat siapa dan kapan memutuskan; penolakan dapat menyertakan alasan.
- AC-BKG-03.3 Tidak ada jalur yang memungkinkan pengunjung mengonfirmasi booking sendiri.

**US-BKG-04 — Mencegah bentrok (P0).** Sebagai Owner, saya ingin booking terkonfirmasi tidak pernah bentrok.

- AC-BKG-04.1 Dua booking terkonfirmasi pada resource yang sama dengan rentang waktu yang beririsan tidak dapat sama-sama ada. **[OPEN-009]**
- AC-BKG-04.2 Aturan batas interval (mis. selesai tepat saat booking lain mulai) berperilaku sesuai keputusan dan teruji. **[OPEN-009]**
- AC-BKG-04.3 Pencegahan bentrok tetap berlaku ketika dua keputusan masuk hampir bersamaan, bukan hanya pemeriksaan di UI.
- AC-BKG-04.4 Ketika konfirmasi ditolak karena bentrok, pengguna melihat pesan yang menjelaskan alasannya.

**US-BKG-05 — Pembatalan, reschedule, dan kedaluwarsa (P1).** **[OPEN-008]**

- AC-BKG-05.1 Pembatalan, reschedule, dan kedaluwarsa permintaan (jika termasuk scope) mengikuti aturan yang diputuskan dan tidak menciptakan bentrok.

**US-BKG-06 — Kelola resource dan jam operasional (P0).** Sebagai Owner, saya ingin mengatur resource yang dapat dipesan. **[OPEN-007]**

- AC-BKG-06.1 Owner dapat menambah, mengubah, dan menonaktifkan resource; resource nonaktif tidak dapat dipesan.
- AC-BKG-06.2 Jam operasional dan batas pemesanan yang ditetapkan memengaruhi validasi booking. **[OPEN-007]**

### 5.5 POS dan transaksi (POS)

**US-POS-01 — Kelola katalog (P0).** Sebagai Owner, saya ingin mengelola produk/layanan yang dijual. **[OPEN-010]**

- AC-POS-01.1 Pengguna berwenang dapat menambah, mengubah, dan menonaktifkan item katalog; item nonaktif tidak dapat dijual.
- AC-POS-01.2 Harga disimpan dalam satuan dan tipe yang tepat untuk uang (tanpa floating-point). **[OPEN-013]**

**US-POS-02 — Checkout (P0).** Sebagai Owner/Staff, saya ingin membuat transaksi dari item katalog.

- AC-POS-02.1 Transaksi memuat item, kuantitas, dan total yang dihitung oleh lapisan tepercaya; nominal dari browser tidak dipercaya.
- AC-POS-02.2 Checkout bersifat atomik: bila gagal di tengah proses, tidak ada data parsial yang tersimpan.
- AC-POS-02.3 Pengiriman ganda (double-submit/retry) tidak membuat transaksi ganda tanpa sengaja.
- AC-POS-02.4 Item transaksi menyimpan snapshot nama dan harga sehingga riwayat tidak berubah ketika harga katalog berubah.
- AC-POS-02.5 Nomor transaksi unik dan mengikuti format yang diputuskan. **[OPEN-010]**

**US-POS-03 — Diskon, pajak, pembulatan (P0).** **[OPEN-003, OPEN-010]**

- AC-POS-03.1 Diskon, pajak, dan pembulatan dihitung sesuai aturan yang diputuskan, konsisten antara tampilan dan data tersimpan.
- AC-POS-03.2 Hanya pengguna yang berwenang yang dapat memberi diskon. **[OPEN-003]**

**US-POS-04 — Riwayat transaksi (P0).** Sebagai Owner/Staff berwenang, saya ingin meninjau riwayat transaksi.

- AC-POS-04.1 Riwayat dapat difilter menurut tanggal dan status serta menampilkan detail item dan pembayaran.
- AC-POS-04.2 Akses riwayat mengikuti izin role. **[OPEN-010]**

**US-POS-05 — Void/koreksi (P1).** **[OPEN-010, OPEN-011]**

- AC-POS-05.1 Void atau koreksi (jika termasuk scope) tidak menghapus jejak audit dan hanya dapat dilakukan pengguna berwenang.

**US-POS-06 — Bukti transaksi (P1).** **[OPEN-010]**

- AC-POS-06.1 Bukti/struk (jika termasuk scope) menampilkan data yang sama dengan data tersimpan dan mengikuti aturan yang diputuskan.

### 5.6 Pembayaran manual (PAY)

**US-PAY-01 — Mencatat pembayaran (P0).** Sebagai Owner/Staff berwenang, saya ingin mencatat pembayaran manual. **[OPEN-004, OPEN-011]**

- AC-PAY-01.1 Pembayaran tercatat dengan relasi transaksi, nominal, waktu, metode, dan status sesuai keputusan.
- AC-PAY-01.2 Hanya pengguna berwenang yang dapat mencatat pembayaran.
- AC-PAY-01.3 Pengiriman ganda tidak mencatat pembayaran dua kali.

**US-PAY-02 — DP dan pelunasan (P1).** **[OPEN-011]**

- AC-PAY-02.1 DP dan pelunasan (jika termasuk MVP) tercatat sehingga saldo terhitung benar dan tidak ada penerimaan uang atau penjualan yang dihitung dua kali.
- AC-PAY-02.2 Aturan kelebihan/kekurangan bayar berperilaku sesuai keputusan.

**US-PAY-03 — Koreksi/refund (P1).** **[OPEN-011]**

- AC-PAY-03.1 Koreksi dan refund (jika termasuk scope) menambah catatan pembalik/penyesuaian dan tidak menghapus catatan asli.

**US-PAY-04 — Kaitan booking dan transaksi (P1).** **[OPEN-011]**

- AC-PAY-04.1 Bila DP booking termasuk scope, pembayaran dapat dikaitkan ke booking dan perlakuannya pada laporan mengikuti OPEN-012.

### 5.7 Laporan (RPT)

**US-RPT-01 — Sales Insight (P0).** Sebagai Owner, saya ingin melihat ringkasan penjualan. **[OPEN-012]**

- AC-RPT-01.1 Setiap metrik yang tampil mempunyai definisi tertulis yang disetujui (lihat `docs/DATABASE.md` §9 untuk katalog metrik).
- AC-RPT-01.2 Angka laporan dapat direkonsiliasi dengan data transaksi dan pembayaran yang mendasarinya.
- AC-RPT-01.3 DP, pelunasan, pembatalan/void, dan refund diperlakukan sesuai keputusan dan tidak terhitung dua kali.

**Daftar metrik tingkat produk (Usulan — OPEN-012).** `MASTER_BUILD_GUIDE.md` §5 Langkah 1 dan TITIS-002 meminta PRD memuat metrik yang ingin ditampilkan; rumus rinci tetap di `docs/DATABASE.md` §9. Samakan daftar ini dengan katalog di sana saat `docs/DATABASE.md` ditinjau (TITIS-007).

| Metrik | Pertanyaan bisnis yang dijawab |
|---|---|
| Penjualan per periode | Berapa nilai penjualan pada rentang tanggal tertentu? |
| Jumlah dan rata-rata nilai transaksi | Seberapa ramai, dan berapa rata-rata belanja? |
| Penerimaan pembayaran per metode | Berapa uang yang benar-benar diterima, lewat metode apa? |
| Saldo belum lunas (bila DP masuk MVP) | Berapa yang masih harus dibayar pelanggan? |
| Item terlaris | Produk/layanan apa yang paling sering terjual? |
| Booking per status | Berapa permintaan menunggu, terkonfirmasi, ditolak, dibatalkan, kedaluwarsa? |

Dasar pengakuan (penjualan vs penerimaan kas) dan perlakuan DP/pelunasan/void/refund ditentukan OPEN-012.

**US-RPT-02 — Filter periode (P0).** **[OPEN-013]**

- AC-RPT-02.1 Pengguna dapat memilih rentang tanggal; batas hari mengikuti zona waktu bisnis.

**US-RPT-03 — Akses laporan (P0).** **[OPEN-005]**

- AC-RPT-03.1 Laporan keuangan hanya dapat diakses role yang diizinkan, termasuk lewat akses data langsung.

### 5.8 Kualitas non-fungsional (NFR)

| ID | Persyaratan | Verifikasi |
|---|---|---|
| NFR-01 | **Keamanan akses:** aturan akses ditegakkan di lapisan data/server, bukan hanya UI (lihat `docs/SECURITY.md`). | Test RLS/akses |
| NFR-02 | **Integritas data:** invariants di `docs/DATABASE.md` §8 ditegakkan. | Test database |
| NFR-03 | **Aksesibilitas:** semantic HTML, keyboard/focus, label input, kontras, status error jelas (target di `DESIGN.md` §8). | Test UI/a11y |
| NFR-04 | **Responsivitas:** layout berfungsi pada ukuran layar yang disepakati di `DESIGN.md` §7. | Test UI |
| NFR-05 | **Kegagalan eksplisit:** loading, empty, validation error, permission denied, network error, dan retry dirancang untuk setiap alur. | Test UI |
| NFR-06 | **Reproduksibilitas:** pengguna lain dapat menjalankan proyek dari repository dengan instruksi yang teruji. | Test rilis |

## 6. Alur utama

1. **Booking:** Pengunjung mengajukan → sistem menetapkan `pending` → Owner/Staff berwenang memutuskan (konfirmasi/tolak) → bentrok dicegah saat konfirmasi.
2. **POS:** Owner/Staff memilih item → sistem menghitung total di lapisan tepercaya → transaksi tersimpan atomik → pembayaran dicatat manual.
3. **Pembayaran (bila DP termasuk MVP):** DP dicatat → pelunasan dicatat → saldo dan laporan konsisten.
4. **Laporan:** metrik dihitung dari data transaksi/pembayaran sesuai definisi yang disetujui.

Detail status dan transisi (Usulan) ada di `docs/DATABASE.md` §6.

## 7. Kriteria keberhasilan MVP

MVP dianggap berhasil bila **semua** berikut terbukti, bukan sekadar dinyatakan:

1. Semua AC berprioritas P0 lulus pada test yang dipetakan di `docs/TESTING.md`.
2. Exit criteria PHASE 1–4 di `MASTER_BUILD_GUIDE.md` §7 terpenuhi dan tercatat di `TASK.md`.
3. Tidak ada temuan keamanan berstatus blocker (`docs/SECURITY.md` §10).
4. Laporan direkonsiliasi dengan fixture hasil hitung manual (`docs/TESTING.md` §8).
5. Orang lain dapat menjalankan proyek dari repository bersih memakai README (TEST-REL-01).
6. Setidaknya satu calon pengguna pilot dapat menyelesaikan alur booking dan transaksi pada lingkungan uji. **(Usulan; calon pilot belum ditetapkan.)**

## 8. Keputusan terbuka (OPEN)

Semua item berikut harus diputuskan atau secara eksplisit ditunda sebelum fitur terkait dibangun. **Owner keputusan: pemilik proyek.** Kolom “Blokir” menunjukkan task/fase yang tidak boleh dimulai sebelum keputusan dibuat. Kolom “Usulan awal” hanyalah titik awal diskusi — **bukan keputusan**.

| ID | Topik | Yang harus diputuskan | Usulan awal (belum disetujui) | Status | Keputusan & tanggal | Blokir |
|---|---|---|---|---|---|---|
| OPEN-001 | Staff & konten | Apakah Staff boleh mengedit profil bisnis, halaman, dan media? | Hanya Owner pada MVP | Open | — | TITIS-109 |
| OPEN-002 | Staff & booking | Apakah Staff boleh mengonfirmasi/menolak/membatalkan booking? | Boleh | Open | — | TITIS-205 |
| OPEN-003 | Staff & diskon | Apakah Staff boleh memberi diskon (batas nominal/persen)? | Tidak; hanya Owner | Open | — | TITIS-301 |
| OPEN-004 | Staff & pembayaran | Apakah Staff boleh mencatat pembayaran dan mengoreksinya? | Mencatat boleh; koreksi hanya Owner | Open | — | TITIS-306 |
| OPEN-005 | Staff & laporan | Apakah Staff boleh melihat laporan keuangan? | Tidak | Open | — | TITIS-309 |
| OPEN-006 | CMS & publik | Halaman MVP final, field editable per halaman, dukungan gambar/media, status draft/publish, metadata per halaman, sumber daftar layanan/menu (CMS vs katalog) | Halaman di §4.1; draft/publish; media sebagai P1 | Open | — | TITIS-109, TITIS-110 |
| OPEN-007 | Booking | Daftar resource, durasi min/maks, jam operasional, buffer antar-booking, batas pemesanan (lead time/jauh ke depan), zona waktu, field form, perlindungan spam | Durasi kelipatan slot tetap; zona waktu bisnis tunggal | Open | — | TITIS-201 |
| OPEN-008 | Siklus booking | Himpunan status, siapa mengubah status, pembatalan, reschedule, kedaluwarsa permintaan, apakah pengunjung boleh membatalkan | `pending → confirmed / rejected / cancelled / expired`; `confirmed → cancelled` | Open | — | TITIS-201 |
| OPEN-009 | Aturan bentrok | Bentrok per resource? Batas interval (rentang setengah-terbuka `[mulai, selesai)`?), apakah `pending` ikut memblokir, perilaku saat dua keputusan hampir bersamaan | Per resource; `[mulai, selesai)`; hanya `confirmed` memblokir | Open | — | TITIS-201 |
| OPEN-010 | POS | Item yang dijual, pajak, pembulatan, model diskon, metode pembayaran, format nomor transaksi, void/refund masuk scope atau tidak, aturan struk, akses Staff ke katalog/riwayat/void | Katalog sederhana; void sebagai P1; struk P1 | Open | — | TITIS-301 |
| OPEN-011 | Pembayaran | Apakah DP wajib/opsional, cara pelunasan, metode, status pembayaran, kelebihan/kekurangan bayar, koreksi, kaitan booking↔transaksi | DP opsional dan P1; koreksi lewat catatan pembalik | Open | — | TITIS-301, TITIS-306 |
| OPEN-012 | Laporan | Definisi tiap metrik, rentang waktu, dasar pengakuan (penjualan vs penerimaan kas), perlakuan DP/pelunasan/pembatalan/refund | Lihat katalog metrik `docs/DATABASE.md` §9 | Open | — | TITIS-309 |
| OPEN-013 | Data bisnis | Mata uang, format angka/tanggal, zona waktu bisnis, retensi data, kebutuhan ekspor/backup | IDR; zona waktu bisnis tunggal (mis. Asia/Jakarta); ekspor dasar P2 | Open | — | TITIS-104 |
| OPEN-014 | Hosting | Provider frontend, domain, lingkungan dev/staging/production, rollback, siapa menyetujui rilis | Belum ada usulan | Open | — | TITIS-005 |
| OPEN-015 | SEO | Kebutuhan indeksasi halaman publik, metadata, sitemap, apakah SPA Vite memerlukan prerendering | Lihat opsi `ARCHITECTURE.md` DEC-011 | Open | — | TITIS-006 |
| OPEN-016 | Model bisnis | Apakah kafe dengan ruang privat diterima sebagai model referensi, atau diganti | Diterima | Open | — | TITIS-002 |
| OPEN-017 | Lisensi | Konfirmasi lisensi (baseline MIT), nama pemegang hak cipta, dan tahun | MIT | Open | — | TITIS-011 |
| OPEN-018 | Akun | Bagaimana Owner pertama dibuat (bootstrap), bagaimana Staff ditambah/dinonaktifkan, reset password, kebijakan password | Owner dibuat sekali lewat prosedur setup; Staff dibuat/dinonaktifkan oleh Owner; tanpa signup publik | Open | — | TITIS-107 |
| OPEN-019 | Komunikasi booking *(usulan review)* | Bagaimana pengunjung mengetahui keputusan booking (terima/tolak/kedaluwarsa)? Apakah Owner/Staff diberi notifikasi saat ada permintaan baru, dan lewat kanal apa? | Pengunjung dihubungi manual oleh Owner/Staff lewat kontak yang diisi; ringkasan dashboard menampilkan booking menunggu keputusan; tanpa notifikasi otomatis pada MVP | Open | — | TITIS-201 |
| OPEN-020 | Data pribadi pengunjung *(usulan review)* | Pemberitahuan privasi pada form booking, jangka retensi data kontak pengunjung, dan siapa yang boleh melihatnya | Teks pemberitahuan singkat di form; retensi ditetapkan pemilik (bersama OPEN-013); hanya Owner/Staff berwenang yang melihat | Open | — | TITIS-202 |
| OPEN-021 | Bahasa *(usulan review)* | Bahasa antarmuka dan konten situs: satu bahasa atau multi-bahasa | Bahasa Indonesia saja pada MVP | Open | — | TITIS-109 |

Cara mencatat keputusan: ubah kolom **Status** menjadi `Decided`, isi **Keputusan & tanggal** (beserta alasan singkat), dan buat entri `DEC-xxx` di `ARCHITECTURE.md` bila keputusannya sulit dibalik. `Deferred` wajib mencantumkan owner, alasan, dan tenggat di kolom **Keputusan & tanggal**. Jangan mengubah asumsi menjadi requirement final secara diam-diam.

**Gate Phase 0:** semua OPEN harus berstatus `Decided` atau `Deferred` sebelum TITIS-014. OPEN yang memengaruhi role (OPEN-001 s.d. 005), lifecycle dan bentrok booking (OPEN-007 s.d. 009), alur checkout/pembayaran (OPEN-010, 011), definisi laporan (OPEN-012), dan data bisnis (OPEN-013) **tidak boleh `Deferred` melewati gate itu** (`MASTER_BUILD_GUIDE.md` §7, exit criteria PHASE 0). OPEN lain boleh `Deferred` bila owner, alasan, dan tenggat tercatat dan tenggatnya jatuh sebelum task yang diblokir. Kolom **Blokir** memakai ID task di `TASK.md`, satu-satunya sumber ID task.

## 9. Asumsi, dependensi, dan risiko produk

### 9.1 Asumsi

- A-1: Satu instalasi = satu bisnis; tidak ada isolasi multi-bisnis.
- A-2: Pembayaran dicatat manual; tidak ada integrasi payment gateway.
- A-3: Pengunjung tidak memiliki akun.
- A-4: Satu zona waktu bisnis per instalasi (OPEN-013).
- A-5: Data uji sintetis; tidak ada data pelanggan asli pada pengembangan.

### 9.2 Dependensi

- Supabase (database, auth, storage) sebagai backend terkelola — lihat `ARCHITECTURE.md`.
- Referensi desain Google Stitch yang disetujui — lihat `DESIGN.md`.
- Keputusan OPEN-001 s.d. OPEN-021.

### 9.3 Risiko produk

| Risiko | Pengendalian |
|---|---|
| Model kafe terlalu sempit/lebar untuk pilot | Konfirmasi OPEN-016; revisi PRD sebelum schema final |
| Definisi laporan berubah setelah data terkumpul | Putuskan OPEN-012 sebelum TITIS-309; rekonsiliasi dengan fixture |
| Scope creep (fitur di luar MVP) | §3.2 dan persetujuan perubahan scope (`AGENTS.md` §3.2) |
| Aturan booking tidak cocok dengan operasional nyata | Validasi dengan calon pilot sebelum TITIS-201 |

## 10. Pertanyaan yang belum terjawab

Seluruh pertanyaan terbuka dilacak sebagai OPEN pada §8. Tidak ada pertanyaan terbuka di luar daftar itu; jika muncul yang baru, tambahkan sebagai `OPEN-0nn` berikutnya.
