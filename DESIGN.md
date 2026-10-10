# DESIGN — Panduan Desain TITIS

> **Status:** **Draft kerangka (Phase 0)**. Nilai visual (warna, font, skala) **sengaja belum diisi** karena harus berasal dari mockup Google Stitch yang disetujui (langkah 3 di `MASTER_BUILD_GUIDE.md` §5). Bagian aksesibilitas, state, dan pola interaksi sudah berlaku sebagai standar. Peninjauan: `TASK.md` → TITIS-006.
> **Sumber kebenaran untuk:** design tokens, layout, komponen, perilaku responsif, aksesibilitas, dan referensi visual yang disetujui.
> **Bukan untuk:** hak akses atau aturan transaksi (lihat `docs/SECURITY.md`, `docs/DATABASE.md`).
> **Label:** `DQ-xx` = pertanyaan desain terbuka (§13). `OPEN-xxx` → `PRD.md` §8. `DEC-xxx` → `ARCHITECTURE.md`.

---

## 1. Cara memakai dokumen ini

1. Rancang desain di Stitch untuk **public website** dan **admin dashboard** sebagai dua area terpisah yang berbagi satu design system.
2. Simpan screenshot/mockup yang **disetujui** di `docs/design/references/` dan catat di §12.
3. Isi nilai token (§4) dari mockup yang disetujui; ubah status `DQ-xx` yang terkait.
4. Implementasi mengikuti dokumen ini; mockup adalah referensi visual, **bukan** spesifikasi perilaku, arsitektur, atau akses data.
5. **Jangan menyalin kode hasil Stitch secara membabi buta.** Kode generator harus disesuaikan dengan stack (`ARCHITECTURE.md`), aksesibilitas (§8), model data, dan komponen proyek; jangan menambah library hanya karena generator memakainya.

## 2. Tujuan visual dan prinsip desain

**Tujuan (Usulan):** tampilan yang terasa hangat, jelas, dan tepercaya bagi bisnis lokal; admin yang cepat dipakai saat operasional sibuk.

| Prinsip | Arti praktis |
|---|---|
| Jelas sebelum indah | Hierarki informasi, label, dan status mudah dibaca dalam sekali pandang. |
| Mobile-first | Pengunjung umumnya memakai ponsel; booking harus nyaman satu tangan. |
| Konsisten | Satu design system untuk dua area; komponen dan pola yang sama berperilaku sama. |
| Jujur terhadap status | Sistem tidak berpura-pura berhasil; loading, gagal, dan “permintaan diterima” (bukan “dikonfirmasi”) dibedakan jelas. |
| Aman secara visual | Aksi destruktif/keuangan tidak mudah terklik tidak sengaja. |
| Aksesibel secara default | Keyboard, fokus, label, dan kontras adalah syarat, bukan tambahan. |

## 3. Referensi dan alur persetujuan desain

- Lokasi referensi: `docs/design/references/`.
- Penamaan usulan: `<area>-<halaman>-<viewport>.png`, mis. `public-booking-mobile.png`, `admin-booking-list-desktop.png`.
- Sebuah referensi dianggap **disetujui** hanya bila dicatat di §12 dengan tanggal dan catatan keputusan yang belum selesai.
- Perubahan yang memengaruhi perilaku (bukan sekadar visual) harus dituliskan di dokumen ini atau `PRD.md`, bukan hanya tersirat di gambar.

## 4. Design tokens

Token diekspos sebagai variabel tema (Tailwind v4, DEC-004) dengan **nama semantik** (berdasarkan peran, bukan nilai). Nilai berasal dari referensi Stitch yang disetujui.

### 4.1 Warna (peran)

| Token (peran) | Kegunaan | Nilai | Syarat kontras |
|---|---|---|---|
| `color-bg` | Latar halaman | DQ-01 | — |
| `color-surface` | Kartu/panel | DQ-01 | — |
| `color-surface-muted` | Latar sekunder | DQ-01 | — |
| `color-text` | Teks utama | DQ-01 | ≥ 4.5:1 terhadap `bg` dan `surface` |
| `color-text-muted` | Teks sekunder | DQ-01 | ≥ 4.5:1 |
| `color-primary` / `color-primary-contrast` | Aksi utama dan teks di atasnya | DQ-01 | teks ≥ 4.5:1; batas komponen ≥ 3:1 |
| `color-border` | Garis/pembatas | DQ-01 | batas kontrol input ≥ 3:1 |
| `color-focus-ring` | Indikator fokus | DQ-01 | ≥ 3:1 terhadap latar sekitar |
| `color-success`, `color-warning`, `color-danger`, `color-info` | Umpan balik | DQ-01 | teks ≥ 4.5:1; **tidak** boleh jadi satu-satunya pembeda (sertakan ikon/teks) |

Mode gelap: DQ-02 (belum diputuskan masuk MVP atau tidak).

### 4.2 Tipografi

| Peran | Keterangan | Nilai |
|---|---|---|
| Keluarga font | Dengan *fallback stack* sistem | DQ-03 |
| Skala | `display`, `h1`–`h4`, `body`, `body-sm`, `caption` | DQ-03 |
| Aturan | Teks isi ≥ 16 px (1rem); baris isi ≤ ~75 karakter; tinggi baris longgar untuk paragraf; angka uang memakai angka tabular agar sejajar | — |
| Lisensi font | Font harus berlisensi yang sesuai untuk proyek open-source dan dicatat di atribusi | DQ-03 |

### 4.3 Spasi, bentuk, dan efek

| Token | Aturan | Nilai |
|---|---|---|
| Skala spasi | Berbasis kelipatan konstan (Usulan: 4 px) | DQ-04 |
| Radius | `sm`, `md`, `lg`, `full` | DQ-04 |
| Border | Ketebalan standar dan gaya | DQ-04 |
| Elevasi | 0–3 untuk kartu/dialog/menu | DQ-04 |
| Lapisan (z-index) | Konten < header lengket < menu < dialog < toast | DQ-04 |
| Gerak | Durasi singkat; **hormati `prefers-reduced-motion`** (nonaktifkan animasi non-esensial) | DQ-04 |

## 5. Komponen dasar dan state

Setiap komponen mendefinisikan state yang berlaku. Kolom diisi `✓` bila state wajib tersedia; `—` bila tidak relevan.

| Komponen | default | hover | focus | active | disabled | loading | error | empty |
|---|---|---|---|---|---|---|---|---|
| Tombol (primer/sekunder/destruktif) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| Input teks / textarea / select | ✓ | ✓ | ✓ | — | ✓ | — | ✓ | — |
| Checkbox / radio / switch | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | — |
| Pemilih tanggal & waktu (booking) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Pemilih resource | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tabel / daftar data | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| Lencana status (booking/order/payment) | ✓ | — | — | — | — | — | — | — |
| Kartu | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| Dialog / konfirmasi | ✓ | — | ✓ | — | — | ✓ | ✓ | — |
| Toast / alert / banner | ✓ | — | ✓ | — | — | — | ✓ | — |
| Navigasi (header publik, sidebar admin, breadcrumb) | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Paginasi / filter | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tampilan uang | ✓ | — | — | — | — | ✓ | ✓ | — |

Aturan khusus:

- **Lencana status** memuat **teks** (dan ikon bila perlu); warna hanya penguat. Himpunan label mengikuti status final di `docs/DATABASE.md` §6.
- **Tampilan uang** selalu melalui satu formatter bersama (OPEN-013) dan menampilkan nilai dari server, bukan hasil hitung klien sebagai sumber kebenaran.
- **Tombol** yang memicu aksi asinkron masuk state `loading`, tidak dapat diklik ganda (mendukung idempotency, DEC-008), dan tetap fokusable.

## 6. Layout dan navigasi

### 6.1 Public website

- Header dengan nama bisnis, navigasi utama, dan tombol “Booking” yang menonjol; footer dengan kontak, jam buka, dan tautan.
- Konten dibatasi lebar baca; gambar responsif dengan teks alternatif.
- Alur booking: satu kolom di ponsel, ringkas, dengan ringkasan pilihan sebelum kirim dan konfirmasi “permintaan diterima”.

### 6.2 Admin dashboard

- Kerangka: sidebar (desktop) / menu geser atau bar bawah (ponsel) + area konten + header dengan identitas pengguna dan logout.
- Item navigasi yang tidak diizinkan untuk role **disembunyikan sebagai kenyamanan**; keamanan tetap di backend (`docs/SECURITY.md` §1).
- Hierarki informasi: Ringkasan → Booking → Kasir/Transaksi → Laporan → Konten → Pengaturan (urutan final: DQ-05).
- Halaman daftar: filter di atas, tabel/daftar, paginasi, state kosong yang menjelaskan langkah berikutnya.
- Halaman kasir (POS): dioptimalkan untuk tablet/desktop dengan target sentuh besar; total dan pembayaran selalu terlihat.

## 7. Perilaku responsif

- **Mobile-first.** Titik henti mengikuti bawaan Tailwind v4 (Usulan): `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem (verifikasi pada versi terpasang saat TITIS-011).
- **Viewport uji (Usulan, DQ-06):** ponsel 360×640, tablet 768×1024, desktop 1280×800.
- Konten tidak boleh memerlukan *scroll* horizontal pada lebar 320 CSS px (kecuali area yang memang bergulir seperti tabel lebar di dalam wadahnya).
- Tabel data pada ponsel berubah menjadi daftar kartu atau bergulir di dalam wadahnya dengan kolom kunci tetap terlihat.
- Zoom hingga 200% tidak boleh memotong atau menyembunyikan fungsi (*reflow*).
- Target sentuh nyaman di ponsel (≥ 44 × 44 CSS px direkomendasikan; minimum mutlak 24 × 24).

## 8. Aksesibilitas

**Target (Usulan, DQ-07):** WCAG 2.2 level AA. Bagian ini adalah acceptance criteria UI (PRD NFR-03) dan diuji (TEST-UI-02, -03, -04).

1. **Semantic HTML:** elemen landmark (`header`, `nav`, `main`, `footer`), hierarki heading berurutan, daftar dan tabel semantik (`th` dengan cakupan, keterangan tabel bila perlu), tombol untuk aksi dan tautan untuk navigasi.
2. **Bahasa & judul:** atribut bahasa halaman diatur; setiap rute punya judul halaman unik; ada tautan “lompat ke konten utama”.
3. **Keyboard:** seluruh fungsi dapat dioperasikan dengan keyboard; urutan fokus logis; tidak ada jebakan fokus; dialog memindahkan fokus ke dalam, menutup dengan `Esc`, dan mengembalikan fokus ke pemicu.
4. **Fokus terlihat:** indikator fokus jelas pada semua kontrol interaktif; tidak dihapus tanpa pengganti.
5. **Label & instruksi:** setiap input punya label terhubung secara programatik; petunjuk format tidak hanya di *placeholder*.
6. **Error:** pesan error berupa teks, dikaitkan ke field, dan diumumkan ke teknologi bantu; tidak hanya mengandalkan warna. Ringkasan error di atas form untuk form panjang.
7. **Kontras:** teks ≥ 4.5:1 (≥ 3:1 untuk teks besar); batas komponen dan indikator fokus ≥ 3:1.
8. **Status dinamis:** hasil aksi asinkron (sukses, gagal, memuat) diumumkan lewat wilayah *live* yang sesuai.
9. **Media:** gambar informatif punya teks alternatif (AC-CMS-03.2); gambar dekoratif ditandai demikian.
10. **Gerak:** hormati `prefers-reduced-motion`; tidak ada kilatan.
11. **Waktu & tanggal:** input tanggal/waktu dapat dioperasikan dengan keyboard dan menjelaskan zona waktu bisnis.

## 9. State UI standar

Setiap alur data menyediakan state berikut (PRD NFR-05, DEC-019). Komponen standar dipakai agar konsisten.

| State | Perilaku |
|---|---|
| **Loading** | Placeholder (skeleton/spinner) dengan pengumuman aksesibel; tidak menggeser tata letak berlebihan. |
| **Empty** | Menjelaskan kosongnya dan langkah berikutnya (mis. “Belum ada booking. Bagikan tautan booking.”). |
| **Validation error** | Pesan per field + ringkasan; isian pengguna dipertahankan. |
| **Permission denied** | Pesan jelas “tidak memiliki izin” tanpa membocorkan data; arahan ke langkah yang tepat. |
| **Network/server error** | Pesan yang dapat ditindaklanjuti + tombol coba lagi; tidak menampilkan detail teknis atau secret. |
| **Success** | Konfirmasi tegas yang membedakan “diterima” vs “dikonfirmasi”/“tersimpan”. |
| **Sesi berakhir** | Arahkan ke login tanpa menampilkan data admin (AC-AUTH-01.3). |

## 10. Form, umpan balik, dan aksi destruktif

- Validasi bersifat membantu: ditampilkan saat pengguna selesai mengisi field atau saat kirim; tidak membanjiri saat mengetik.
- Setelah kirim gagal, fokus dipindahkan ke error pertama.
- Tombol kirim memasuki state `loading` dan mencegah kirim ganda.
- **Aksi destruktif atau keuangan** (menolak/membatalkan booking, void order, refund, menonaktifkan akun) memakai dialog konfirmasi yang: menyebut objek dan akibat, memakai label tombol spesifik (bukan “OK”), dan menyediakan kolom **alasan wajib** bila dibutuhkan (void, refund, penolakan). Fokus awal berada pada tindakan aman (batal).
- Untuk aksi yang tidak dapat dibatalkan, jelaskan bahwa jejak audit tetap tersimpan (tidak ada penghapusan data keuangan).
- Pesan bentrok jadwal menjelaskan penyebab dan tawaran langkah (mis. pilih waktu/resource lain).

## 11. Konten dan format

- Bahasa antarmuka: Indonesia (Usulan; DQ-08 bila perlu multi-bahasa — di luar MVP kecuali diputuskan).
- Format uang, angka, tanggal, dan jam mengikuti OPEN-013 dan memakai formatter bersama; zona waktu bisnis ditampilkan pada konteks booking dan laporan.
- Nada tulisan: sederhana, sopan, tidak teknis. Pesan error tidak menyalahkan pengguna.

## 12. Referensi per halaman

Status: `Belum ada` → `Dalam tinjauan` → `Disetujui` (isi tanggal dan keputusan terbuka).

| Area | Halaman | File referensi | Status | Catatan/keputusan terbuka |
|---|---|---|---|---|
| Public | Beranda | `docs/design/references/public-home-*.png` | Belum ada | — |
| Public | Tentang | `…/public-about-*.png` | Belum ada | — |
| Public | Layanan/Menu | `…/public-services-*.png` | Belum ada | Sumber konten (OPEN-006) |
| Public | Ruang/Fasilitas | `…/public-resources-*.png` | Belum ada | — |
| Public | Booking | `…/public-booking-*.png` | Belum ada | Field form (OPEN-007) |
| Public | Kontak | `…/public-contact-*.png` | Belum ada | — |
| Public | 404 | `…/public-404-*.png` | Belum ada | — |
| Admin | Login | `…/admin-login-*.png` | Belum ada | — |
| Admin | Ringkasan | `…/admin-dashboard-*.png` | Belum ada | Isi ringkasan |
| Admin | Konten | `…/admin-content-*.png` | Belum ada | OPEN-006 |
| Admin | Booking (daftar/detail) | `…/admin-booking-*.png` | Belum ada | OPEN-008 |
| Admin | Resource | `…/admin-resources-*.png` | Belum ada | OPEN-007 |
| Admin | Katalog | `…/admin-catalog-*.png` | Belum ada | OPEN-010 |
| Admin | Kasir (POS) | `…/admin-pos-*.png` | Belum ada | OPEN-010 |
| Admin | Transaksi | `…/admin-orders-*.png` | Belum ada | OPEN-010/011 |
| Admin | Laporan | `…/admin-reports-*.png` | Belum ada | OPEN-012 |
| Admin | Pengaturan & akun | `…/admin-settings-*.png` | Belum ada | OPEN-018 |

## 13. Pertanyaan desain terbuka

| ID | Pertanyaan | Dibutuhkan sebelum |
|---|---|---|
| DQ-01 | Palet warna final (nilai token warna). | TITIS-011 |
| DQ-02 | Apakah mode gelap termasuk MVP? | TITIS-011 |
| DQ-03 | Keluarga font, skala tipografi, dan lisensinya. | TITIS-011 |
| DQ-04 | Skala spasi, radius, border, elevasi, dan gerak. | TITIS-011 |
| DQ-05 | Urutan akhir navigasi admin dan isi halaman Ringkasan. | TITIS-014 |
| DQ-06 | Viewport uji responsif yang disepakati. | TITIS-075 |
| DQ-07 | Konfirmasi target aksesibilitas (WCAG 2.2 AA) dan alat cek otomatis (DEC-013). | TITIS-020 |
| DQ-08 | Apakah multi-bahasa dibutuhkan? | TITIS-006 |
