# DESIGN — Panduan Desain TITIS

> **Status:** **Draft kerangka (Phase 0)**. Nilai visual (warna, font, skala) **sengaja belum diisi** karena harus berasal dari referensi desain **Portfolio** yang disetujui. Bagian aksesibilitas, state, dan pola interaksi sudah berlaku sebagai standar. Peninjauan: `TASK.md` → TITIS-009.
> **Sumber kebenaran untuk:** design tokens, layout, komponen, perilaku responsif, aksesibilitas, dan referensi visual yang disetujui.
> **Bukan untuk:** hak akses atau aturan transaksi (lihat `SECURITY.md`, `DATABASE.md`).
> **Label:** `DQ-xx` = pertanyaan desain terbuka (§15). `OPEN-xxx` → `PRD.md` §8. `DEC-xxx` → `ARCHITECTURE.md`.
> **Owner directions applied:** A1–A8 (public company-profile framing, admin/POS operational priorities, complete page/function inventory, future mockup plan, mockup≠QA viewport distinction, final review checklist). **Portfolio references sourced only from existing DESIGN.md content (no external directory access).**
> **Cross-doc sync:** OPEN-021 (PRD.md §8) direkonsiliasi via TITIS-012: **EN primary/default + ID MVP** (2026-10-11). TITIS-012 status: **Active** (cross-doc consistency). DEC-019 (ARCHITECTURE.md) dirujuk untuk theme behavior — verifikasi konten aktual di ARCHITECTURE.md §3.

---

## 1. Cara memakai dokumen ini

1. Gunakan referensi desain **Portfolio** sebagai sumber kebenaran visual (token warna, tipografi, spasi, radius, elevasi, gerak, komponen header/footer/section). Portfolio sudah mencakup design system lengkap untuk public website dan admin dashboard.
2. Untuk layar yang **belum tercakup di Portfolio** (booking, dashboard, POS), gunakan Google Stitch sebagai alat komposisi **hanya untuk layout/komposisi halaman**, dengan token desain yang **wajib berasal dari Portfolio**.
3. Simpan screenshot/mockup yang **disetujui** di `docs/design/references/` dan catat di §12.
4. Isi nilai token (§4) dari referensi Portfolio yang disetujui; ubah status `DQ-xx` yang terkait.
5. Implementasi mengikuti dokumen ini; mockup adalah referensi visual, **bukan** spesifikasi perilaku, arsitektur, atau akses data.
6. **Jangan menyalin kode hasil Stitch secara membabi buta.** Kode generator harus disesuaikan dengan stack (`ARCHITECTURE.md`), aksesibilitas (§8), model data, dan komponen proyek; jangan menambah library hanya karena generator memakainya.

## 2. Tujuan visual dan prinsip desain

**Tujuan (Usulan):** tampilan yang terasa hangat, jelas, dan tepercaya bagi bisnis lokal; admin yang cepat dipakai saat operasional sibuk.

**Situs publik = Company-profile landing page.** Enam halaman publik (Beranda, Tentang, Layanan/Menu, Ruang/Fasilitas, Booking, Kontak) bersama-sama membentuk halaman profil bisnis yang mengarah ke konversi booking. **Bukan situs aplikasi lengkap; tidak ada dashboard pengunjung, tidak ada area akun publik.** Setiap halaman publik memiliki tujuan konversi yang jelas (CTA ke Booking).

**Identitas visual yang dipertahankan (Owner direction):**
- Palet: krem, navy, hijau, satu aksen koral.
- Font: **JetBrains Mono** (heading & body; monospace untuk data uang/angka tabular) — **lisensi BELUM TERVERIFIKASI DARI SUMBER RESMI** (DQ-03 Open).
- Semantic design tokens (Tailwind v4, DEC-004).
- Mode gelap sesuai keputusan MODE_GELAP (A — Masuk MVP, 2026-10-11).
- Aksesibilitas dan pemisahan public website/dashboard.

| Prinsip | Arti praktis |
|---|---|
| Jelas sebelum indah | Hierarki informasi, label, dan status mudah dibaca dalam sekali pandang. |
| Mobile-first | Pengunjung umumnya memakai ponsel; booking harus nyaman satu tangan. |
| Konsisten | Satu design system untuk dua area; komponen dan pola yang sama berperilaku sama. |
| Jujur terhadap status | Sistem tidak berpura-pura berhasil; loading, gagal, dan “permintaan diterima” (bukan “dikonfirmasi”) dibedakan jelas. |
| Aman secara visual | Aksi destruktif/keuangan tidak mudah terklik tidak sengaja. |
| Aksesibel secara default | Keyboard, fokus, label, dan kontras adalah syarat, bukan tambahan. |
| Performa sebagai fitur | Target PageSpeed Insights ≥ 90 di keempat kategori untuk mobile & desktop, kedua bahasa. |
| **UI ≠ Product Feature** | Perilaku UI (state, animasi, layout) terdokumentasi di DESIGN.md; fitur produk (bisnis logic, hak akses, validasi server) di `PRD.md`, `SECURITY.md`, `DATABASE.md`. Jangan mencampurkan keduanya. |

## 3. Referensi dan alur persetujuan desain

- Lokasi referensi: `docs/design/references/`.
- Penamaan usulan: `<area>-<halaman>-<viewport>.png`, mis. `public-booking-mobile.png`, `admin-booking-list-desktop.png`.
- Sebuah referensi dianggap **disetujui** hanya bila dicatat di §12 dengan tanggal dan catatan keputusan yang belum selesai.
- Perubahan yang memengaruhi perilaku (bukan sekadar visual) harus dituliskan di dokumen ini atau `PRD.md`, bukan hanya tersirat di gambar.

## 4. Design tokens

Token diekspos sebagai variabel tema (Tailwind v4, DEC-004) dengan **nama semantik** (berdasarkan peran, bukan nilai). Nilai berasal dari referensi **Portfolio** yang disetujui.

### 4.1 Warna (peran)

| Token (peran) | Kegunaan | Nilai | Syarat kontras |
|---|---|---|---|
| `color-bg` | Latar halaman | DQ-01 | — |
| `color-surface` | Kartu/panel | DQ-01 | — |
| `color-surface-muted` | Latar sekunder | DQ-01 | — |
| `color-text` | Teks utama | DQ-01 | ≥ 4.5:1 terhadap `bg` dan `surface` |
| `color-text-muted` | Teks sekunder | DQ-01 | ≥ 4.5:1 |
| `color-primary` / `color-primary-contrast` | Aksi utama dan teks di atasnya | DQ-01 | teks ≥ 4.5:1; batas komponen ≥ 3:1 |
| `color-accent` / `color-accent-contrast` | Aksen visual sekunder (identitas brand) | DQ-01 | teks ≥ 4.5:1; batas komponen ≥ 3:1 |
| `color-border` | Garis/pembatas | DQ-01 | batas kontrol input ≥ 3:1 |
| `color-focus-ring` | Indikator fokus | DQ-01 | ≥ 3:1 terhadap latar sekitar |
| `color-success` | Status sukses / positif | DQ-01 | teks ≥ 4.5:1; **tidak** boleh jadi satu-satunya pembeda (sertakan ikon/teks) |
| `color-warning` | Status peringatan | DQ-01 | teks ≥ 4.5:1; **tidak** boleh jadi satu-satunya pembeda (sertakan ikon/teks) |
| `color-danger` | Status error / destruktif | DQ-01 | teks ≥ 4.5:1; **tidak** boleh jadi satu-satunya pembeda (sertakan ikon/teks) |
| `color-info` | Status informasi | DQ-01 | teks ≥ 4.5:1; **tidak** boleh jadi satu-satunya pembeda (sertakan ikon/teks) |

**Palet identitas visual (Owner direction, nilai final mengisi DQ-01):**
- Krem (cream) — latar utama `color-bg` mode terang.
- Navy — teks utama `color-text`, heading, border primer.
- Hijau — `color-success`, aksi positif, indikator status aktif.
- Koral (coral) — `color-accent` (identitas visual), aksen visual sekunder.

Mode gelap: **Masuk MVP (Keputusan A, 2026-10-11)**. Token warna harus mendukung dua mode (terang/gelap) via CSS custom properties. Tombol toggle tema wajib tersedia di header publik (kanan) dan sidebar admin (bawah). State toggle disimpan di `localStorage` dan disinkronkan via React Context (DEC-018). **Implementasi harus mencegah flash tema yang terlihat (FOUC/FOUT): gunakan inline script di `<head>` untuk menerapkan tema sebelum paint, atau CSS `color-scheme` dengan transisi nol pada mount awal.** Referensi visual untuk kedua mode disimpan di `docs/design/references/` dengan sufiks `-light` dan `-dark`. **Perilaku tema (DEC-018):** hormati preferensi sistem (`prefers-color-scheme`), izinkan pilihan manual, persist di `localStorage`, terapkan sebelum paint pertama (inline script di `<head>`), cegah FOUC/FOUT.

### 4.2 Tipografi

| Peran | Keterangan | Nilai |
|---|---|---|
| Keluarga font | **JetBrains Mono** dengan *fallback stack* sistem (`ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace`) | DQ-03 |
| Skala | `display`, `h1`–`h4`, `body`, `body-sm`, `caption` | DQ-03 |
| Aturan | Teks isi ≥ 16 px (1rem); baris isi ≤ ~75 karakter; tinggi baris longgar untuk paragraf; angka uang memakai angka tabular agar sejajar | — |
| Lisensi font | Font harus berlisensi yang sesuai untuk proyek open-source dan dicatat di atribusi | DQ-03 (TITIS-011 Done: **lisensi BELUM TERVERIFIKASI DARI SUMBER RESMI** — klaim SIL OFL 1.1/MIT per DEC-019 tidak tervalidasi dari sumber resmi) |

### 4.3 Spasi, bentuk, dan efek

| Token | Aturan | Nilai |
|---|---|---|
| Skala spasi | Berbasis kelipatan konstan (Usulan: 4 px) | DQ-04 |
| Radius | `sm`, `md`, `lg`, `full` | DQ-04 |
| Border | Ketebalan standar dan gaya | DQ-04 |
| Elevasi | 0–3 untuk kartu/dialog/menu | DQ-04 |
| Lapisan (z-index) | Konten < header lengket < menu < dialog < toast | DQ-04 |
| Gerak | Durasi singkat; **hormati `prefers-reduced-motion`** (nonaktifkan animasi non-esensial) | DQ-04 |

*Catatan: DQ-01..04 terikat pada TITIS-011 (Done) — nilai final diisi dari referensi Portfolio yang disetujui.*

---

## 4.4 Paritas dengan Portfolio

Tabel berikut memetakan aspek visual ke referensi Portfolio yang tertanam di DESIGN.md dan token/pola TITIS. **Status paritas hanya "SAMA" bila diverifikasi dari sumber Portfolio resmi; karena akses direktori eksternal tidak diizinkan, semua klaim ditandai BELUM TERVERIFIKASI.**

| Aspek | Referensi Portfolio di DESIGN.md | Token/Pola TITIS | Status | Alasan Penyesuaian |
|---|---|---|---|---|
| Warna (palet krem, navy, hijau, koral) | §2 Identitas visual, §4.1 baris 65–69 | `color-bg`, `color-text`, `color-success`, `color-accent`, `color-danger` | BELUM TERVERIFIKASI | Nilai kanonik koral dipakai untuk `color-accent`; `color-danger` terpisah — menunggu verifikasi Portfolio |
| Tipografi (JetBrains Mono + fallback) | §2 Identitas visual, §4.2 baris 77 | `font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace` | BELUM TERVERIFIKASI | Font final, tidak dibuka kembali — lisensi BELUM TERVERIFIKASI DARI SUMBER RESMI |
| Skala tipografi (display, h1–h4, body, body-sm, caption) | §4.2 baris 78 | Tailwind v4 semantic scale | BELUM TERVERIFIKASI | Skala spesifik menunggu DQ-03 |
| Spacing (kelipatan 4px) | §4.3 baris 86 | `space-1`–`space-24` (4px base) | BELUM TERVERIFIKASI | Konsisten dengan Portfolio — menunggu verifikasi |
| Container & Grid | §6.1 lebar baca, §6.2 sidebar | `max-w-prose`, `grid-cols-12` admin | BELUM TERVERIFIKASI | Portfolio sudah definisikan — menunggu verifikasi |
| Ritme Section | §6.1 header/footer/konten | `py-12` mobile, `py-20` desktop | BELUM TERVERIFIKASI | Mengikuti ritme Portfolio — menunggu verifikasi |
| Header & Footer | §6.1 baris 132–133, §6.2 baris 139 | Komponen Header, Footer | BELUM TERVERIFIKASI | Portfolio sudah punya komponen — menunggu verifikasi |
| Radius (sm, md, lg, full) | §4.3 baris 87 | `rounded-sm`–`rounded-full` | BELUM TERVERIFIKASI | Mengikuti Portfolio — menunggu verifikasi |
| Border & Bayangan (elevasi 0–3) | §4.3 baris 88–89 | `border`, `shadow-sm`–`shadow-lg` | BELUM TERVERIFIKASI | Mengikuti Portfolio — menunggu verifikasi |
| Motion (durasi singkat, prefers-reduced-motion) | §4.3 baris 91, §8 baris 225 | `transition-colors`, `motion-reduce` | BELUM TERVERIFIKASI | Portfolio sudah definisikan — menunggu verifikasi |
| Ikon | Tidak eksplisit di Portfolio ref | `lucide-react` (usulan) | BELUM TERVERIFIKASI | Perlu keputusan Owner |
| Gaya Komponen (7 MVP) | §5 tabel state, §5 baris 121–126 | Button, Form Field, Status Badge, Panel/Card, Dialog, Data List/Table, Feedback | BELUM TERVERIFIKASI | Disederhanakan ke 7 komponen — menunggu verifikasi Portfolio |

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

- **Lencana status** memuat **teks** (dan ikon bila perlu); warna hanya penguat. Himpunan label mengikuti status final di `DATABASE.md` §6.
- **Tampilan uang** selalu melalui satu formatter bersama (OPEN-013) dan menampilkan nilai dari server, bukan hasil hitung klien sebagai sumber kebenaran.
- **Tombol** yang memicu aksi asinkron masuk state `loading`, tidak dapat diklik ganda (mendukung idempotency, DEC-008), dan tetap fokusable.

**Komponen bersama MVP (Owner direction — penyederhanaan yang berlaku):**
Terbatas pada: **Button, Form Field, Status Badge, Panel/Card, Dialog, Data List/Table, Feedback (Toast/Alert/Banner)**.
- Font kedua, grafik dekoratif, dan timeline booking **ditunda** kecuali PRD secara eksplisit mewajibkan.
- Alur booking **tiga tahap plus layar hasil** (bukan wizard kompleks).
- Daftar booking/transaksi/katalog menjadi **kartu pada mobile**.
- Laporan keuangan memakai **tabel yang dapat digulir dalam wadahnya**.

## 6. Layout dan navigasi

### 6.1 Public website — Company-profile landing page

- Header dengan nama bisnis, navigasi utama (Tentang, Layanan/Menu, Ruang/Fasilitas, Kontak), **pemilih bahasa (EN/ID)**, dan tombol “Booking” yang menonjol sebagai CTA utama; footer dengan kontak, jam buka, dan tautan.
- **Header publik sederhana, tidak menghilang otomatis saat scroll. Tidak menggunakan sticky bottom Booking bar pada MVP. Pada viewport 320 px: header tetap utuh (nama bisnis, navigasi, pemilih bahasa, tombol Booking) tanpa overflow horizontal; navigasi boleh collapse ke menu hamburger jika diperlukan, namun semua fungsi tetap dapat dijangkau.**
- Konten dibatasi lebar baca; gambar responsif dengan teks alternatif.
- Setiap halaman publik memiliki tujuan konversi eksplisit: **Beranda** → hero + CTA Booking; **Tentang** → narasi bisnis + CTA Booking; **Layanan/Menu** → daftar layanan + CTA Booking per item; **Ruang/Fasilitas** → grid ruang + CTA Booking per ruang; **Booking** → form 3-tahap → layar hasil "permintaan diterima"; **Kontak** → info lokasi/kontak + CTA Booking.
- Alur booking: satu kolom di ponsel, ringkas, dengan ringkasan pilihan sebelum kirim dan konfirmasi "permintaan diterima" (bukan "dikonfirmasi").

### 6.2 Admin dashboard — Prioritas operasional

**Dua zona operasional terpisah:**

1. **Admin Dashboard (Manajemen & Pengawasan)** — Prioritas: *visibility* dan *decision speed*.
    - Ringkasan (Dashboard): "Perlu Tindakan" (booking menunggu, pembayaran pending), "Hari Ini" (jadwal, kapasitas), **Ringkasan Keuangan** (pendapatan hari ini, DP, pelunasan) — **Owner dan Manager** (PRD §4.2, SECURITY.md PERM-18); Staff tidak melihat laporan keuangan (OPEN-005 Decided). Semua *at-a-glance* tanpa scroll.
    - Booking: daftar dengan filter status/tanggal, aksi cepat (konfirmasi/tolak/jadwal ulang) dari baris, detail modal dengan riwayat status.
    - Resource/Katalog: CRUD sederhana, status aktif/tidak, urutan tampil.
    - Laporan: tabel scrollable dalam wadah, ekspor CSV, rentang tanggal cepat (hari ini, minggu ini, bulan ini) — **Owner dan Manager** (OPEN-005, SECURITY.md PERM-18).
    - Konten: editor halaman/section, pratinjau, publikasi.
    - Pengaturan: profil bisnis, jam operasional, akun Staff, preferensi notifikasi (**proposal — NEEDS OWNER DECISION: channel (email/push/in-app), trigger events, template**).

2. **POS / Kasir (Transaksi Langsung)** — Prioritas: *throughput* dan *accuracy* saat antrian.
    - Layout dua panel (katalog kiri, keranjang/kanan) pada tablet/desktop; single-panel stack pada mobile.
    - Target sentuh besar (≥ 48×48 **CSS px**), navigasi keyboard penuh, **pemindaian barcode (proposal — NEEDS OWNER DECISION: hardware dependency, fallback manual entry)**.
    - Total dan pembayaran **selalu terlihat** (sticky footer keranjang); perhitungan total **server-side** via RPC checkout.
    - Alur: pilih item → keranjang → pilih pembayaran (tunai/kartu/QR/e-wallet) → **cetak struk (proposal — NEEDS OWNER DECISION: print stylesheet, hardware dependency)** → transaksi selesai.
    - Void/refund butuh dialog konfirmasi + alasan wajib; jejak audit append-only.

**Navigasi & Shell:**
- Kerangka: sidebar (desktop) / **menu geser (ponsel)** + area konten + header dengan identitas pengguna, **pemilih bahasa (EN/ID)**, dan logout.
- Item navigasi yang tidak diizinkan untuk role **disembunyikan sebagai kenyamanan**; keamanan tetap di backend (`SECURITY.md` §1).
- Hierarki navigasi final: Ringkasan → Booking → Resource → Katalog → Kasir (POS) → Transaksi → Laporan → Konten → Pengaturan (**usulan urutan tertunggu review Owner; DQ-05 Open**).
- Halaman daftar: filter di atas, tabel/daftar, paginasi, state kosong yang menjelaskan langkah berikutnya.
- **Toggle mode gelap** ditempatkan di bagian bawah sidebar (desktop) / menu geser (ponsel), dengan ikon matahari/bulan dan label aksesibel. **Penempatan final (sidebar bawah vs header admin vs lokasi lain) → NEEDS OWNER DECISION.**

## 7. Perilaku responsif

- **Mobile-first.** Titik henti mengikuti bawaan Tailwind v4 (Usulan): `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem (verifikasi pada versi terpasang saat TITIS-101).
- **Viewport verifikasi wajib (Owner direction):**
  - 320 × 640 (mobile portrait)
  - 360 × 800 (mobile portrait)
  - 375 × 667 (mobile portrait)
  - 390 × 844 (mobile portrait)
  - 667 × 375 (mobile landscape)
  - 768 × 1024 (tablet portrait)
  - 1024 × 768 (tablet landscape)
  - 1280 × 800 (tablet/desktop)
  - 1440 × 900 (desktop)
  - 1920 × 1080 (desktop HD)
  - Di atas 1920 px: konten menggunakan lebar container terbatas, tidak meregang berlebihan
- **Zoom 200%:** Pengujian zoom browser 200% (tidak sama dengan reflow 400%).
- **Reflow 400% (setara WCAG):** diuji pada viewport 320 CSS px (setara 400% dari 1280 × 1024). **Jangan menyamakan zoom 200% dengan reflow 400%.**
- Konten tidak boleh memerlukan *scroll* horizontal pada halaman.
- Area yang memang berisi tabel lebar harus menggulir di dalam wadahnya, bukan menggeser seluruh halaman.
- Formulir, navigasi, dashboard, dan POS harus tetap dapat digunakan.
- Target sentuh, fokus, dan pembacaan konten tetap memenuhi aturan aksesibilitas yang telah ditetapkan.
- Uji kedua tema (terang/gelap) karena mode gelap termasuk MVP.

**Kompatibilitas browser (perlu pengujian terpisah, tidak diklaim pada tahap dokumentasi):**
- Chrome (mobile & desktop)
- Firefox (mobile & desktop)
- Safari (iOS & macOS)
- Edge (desktop)

**Perilaku layout pada breakpoint aktual (mengikuti Tailwind v4 bawaan):**

| Breakpoint | Navigasi Mobile | Sidebar Admin | Daftar/Kartu | POS | Catatan |
|---|---|---|---|---|---|
| **di bawah breakpoint sm (640 CSS px)** | Hamburger menu | Menu geser | Kartu | Satu panel | Header utuh, tidak overflow |
| 640px–768px | Hamburger menu | Menu geser | Kartu | Satu panel | |
| 768px–1024px (md) | Navigasi terbuka | Sidebar (collapse optional) | Tabel | Dua panel | Tablet landscape |
| 1024px–1280px (lg) | Navigasi terbuka | Sidebar | Tabel | Dua panel | |
| ≥ 1280px (xl) | Navigasi terbuka | Sidebar | Tabel | Dua panel | Container terbatas |

**Kriteria tambahan:**
- Rotasi layar tidak menghilangkan isian booking.
- Safe-area/notch diperhitungkan (`env(safe-area-inset-*)`).
- Tidak mengandalkan `100vh` jika menyebabkan masalah viewport mobile (gunakan `dvh`/`svh` atau `min-height`).
- Fungsi penting tidak hanya tersedia melalui hover.
- Teks dan kontrol tetap berfungsi pada semua viewport wajib.

**Matriks uji kombinasi lengkap (viewport × bahasa × tema) untuk 4 layar representatif:**
1. Beranda publik
2. Booking mobile
3. Daftar booking dashboard
4. Kasir POS tablet landscape

Halaman lain menggunakan sampel prioritas yang tercatat. **Ini adalah rencana pengujian, bukan klaim bahwa tes telah dilakukan.**

**DQ-06 harus konsisten dengan daftar viewport wajib di atas. Jangan mengubah status DQ tanpa keputusan Owner.**

*Catatan: DQ-06 terikat pada TITIS-101 (scaffold) — viewport verifikasi disepakati saat setup awal, bukan TITIS-075 yang tidak ada.*

---

## 7.1 Target PageSpeed Insights (MVP)

**Kualitas wajib dicapai (Owner direction):**

| Kategori | Target minimal | Perangkat | Halaman | Bahasa |
|---|---|---|---|---|
| Performance | ≥ 90 | Mobile, Desktop | 6 halaman publik | EN, ID |
| Accessibility | ≥ 90 | Mobile, Desktop | 6 halaman publik | EN, ID |
| Best Practices | ≥ 90 | Mobile, Desktop | 6 halaman publik | EN, ID |
| SEO | ≥ 90 | Mobile, Desktop | 6 halaman publik | EN, ID |

**Enam halaman publik MVP:**
1. Beranda (`/`)
2. Tentang (`/tentang`)
3. Layanan/Menu (`/layanan`)
4. Ruang/Fasilitas (`/ruang`)
5. Booking (`/booking`)
6. Kontak (`/kontak`)

**Rute error 404** diuji terpisah untuk memastikan:
- HTTP status 404 yang benar (bukan 200 dengan halaman 404).
- Tidak menjadi halaman konten yang ditujukan untuk diindeks.
- Tetap menggunakan design tokens dan perilaku aksesibilitas yang sesuai.

**Prosedur pengukuran:**
- Jalankan tiga pengujian PageSpeed Insights untuk masing-masing URL dan strategi perangkat.
- Gunakan median sebagai hasil evaluasi.
- Semua kategori yang diukur wajib mencapai skor ≥ 90.
- Jika target tidak tercapai, perbaiki masalah atau dokumentasikan pengecualian yang disetujui Owner.
- **Jangan menyatakan target sudah tercapai sebelum implementasi dan pengukuran aktual dilakukan.**

**Anggaran performa desain (design performance budget):**
- **Elemen LCP per jenis halaman:**
  - Beranda: Hero image + heading
  - Tentang: Hero image/illustrasi + heading
  - Layanan: Grid kartu layanan (gambar pertama)
  - Ruang: Grid kartu ruang (gambar pertama)
  - Booking: Pemilih resource/tanggal (tidak gambar)
  - Kontak: Form + info kontak
- Gambar: dimensi eksplisit (`width`/`height`), format modern (WebP/AVIF), `loading="lazy"` di bawah fold.
- Hindari layout shift akibat font (font-display: swap, preload font kritis), tema (inline script color-scheme), atau bahasa (min-width fleksibel).
- Font: subset wajar (Latin + Latin-ext), bobot yang diperlukan, `font-display: swap`, preload hanya font kritis (heading/body).
- JavaScript halaman publik minimal: tanpa framework berat, tanpa efek dekoratif, tanpa dependency tidak perlu.
- Hindari animasi/transisi non-esensial yang menambah bundle size.

**Pembedaan penting:**
- Skor Lighthouse (lab) ≠ data pengguna nyata/CrUX (field). Keduanya dapat berlainan.
- PageSpeed Insights tidak membuktikan kompatibilitas semua browser. Cross-browser compatibility perlu pengujian terpisah (lihat §7).

---

## 8. Aksesibilitas

**Target (Usulan, DQ-07):** WCAG 2.2 level AA. Bagian ini adalah acceptance criteria UI (PRD NFR-03) dan diuji (TEST-UI-02, -03, -04).

1. **Semantic HTML:** elemen landmark (`header`, `nav`, `main`, `footer`), hierarki heading berurutan, daftar dan tabel semantik (`th` dengan cakupan, keterangan tabel bila perlu), tombol untuk aksi dan tautan untuk navigasi.
2. **Bahasa & judul:** atribut bahasa halaman diatur; setiap rute punya judul halaman unik; ada tautan "lompat ke konten utama".
3. **Keyboard:** seluruh fungsi dapat dioperasikan dengan keyboard; urutan fokus logis; tidak ada jebakan fokus; dialog memindahkan fokus ke dalam, menutup dengan `Esc`, dan mengembalikan fokus ke pemicu.
4. **Fokus terlihat:** indikator fokus jelas pada semua kontrol interaktif; tidak dihapus tanpa pengganti.
5. **Label & instruksi:** setiap input punya label terhubung secara programatik; petunjuk format tidak hanya di *placeholder*.
6. **Error:** pesan error berupa teks, dikaitkan ke field, dan diumumkan ke teknologi bantu; tidak hanya mengandalkan warna. Ringkasan error di atas form untuk form panjang.
7. **Kontras:** teks ≥ 4.5:1 (≥ 3:1 untuk teks besar); batas komponen dan indikator fokus ≥ 3:1.
8. **Status dinamis:** hasil aksi asinkron (sukses, gagal, memuat) diumumkan lewat wilayah *live* yang sesuai.
9. **Media:** gambar informatif punya teks alternatif (AC-CMS-03.2); gambar dekoratif ditandai demikian.
10. **Gerak:** hormati `prefers-reduced-motion`; tidak ada kilatan.
11. **Waktu & tanggal:** input tanggal/waktu dapat dioperasikan dengan keyboard dan menjelaskan zona waktu bisnis.

*Catatan: DQ-07 terikat pada TITIS-101/TITIS-404 (E2E + a11y otomatis via axe-core/Playwright, DEC-013 Accepted) — bukan TITIS-020 yang tidak ada.*

---

## 8.1 Verifikasi Kontras Warna

**Target:** WCAG 2.2 AA (teks ≥ 4.5:1, teks besar ≥ 3:1, batas komponen/fokus ≥ 3:1). Semua pasangan harus diverifikasi pada mode terang dan gelap.

| Pasangan (Token) | Mode Terang | Mode Gelap | Status | Catatan |
|---|---|---|---|---|
| `color-text` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | Belum diverifikasi | Harus ≥ 4.5:1 |
| `color-text` / `color-surface` | BELUM DIUKUR | BELUM DIUKUR | Belum diverifikasi | Harus ≥ 4.5:1 |
| `color-text-muted` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | Belum diverifikasi | Harus ≥ 4.5:1 |
| `color-primary` / `color-primary-contrast` | BELUM DIUKUR | BELUM DIUKUR | Belum diverifikasi | Teks ≥ 4.5:1, batas ≥ 3:1 |
| `color-border` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | Belum diverifikasi | Batas input ≥ 3:1 |
| `color-focus-ring` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | Belum diverifikasi | ≥ 3:1 terhadap latar sekitar |
| `color-success` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | Belum diverifikasi | Teks ≥ 4.5:1, sertakan ikon/teks |
| `color-warning` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | Belum diverifikasi | Teks ≥ 4.5:1, sertakan ikon/teks |
| `color-danger` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | Belum diverifikasi | Teks ≥ 4.5:1, sertakan ikon/teks |
| `color-info` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | Belum diverifikasi | Teks ≥ 4.5:1, sertakan ikon/teks |

**Sumber perhitungan:** Akan diukur menggunakan alat otomatis (axe-core/Playwright, DEC-013) dan verifikasi manual pada referensi visual Portfolio (mode terang/gelap) saat TITIS-404. Nilai akan diisi setelah token warna final (DQ-01) tersedia.

---

## 8.2 SEO Multilingual (Desain & Rekonsiliasi)

**Kebutuhan desain dan SEO yang harus diselaraskan dengan DEC-002 (Routing) dan DEC-011 (SEO) sebelum implementasi:**

- **URL terlokalisasi:** Versi bahasa harus memiliki URL yang dapat dibedakan (mis. `/en/booking`, `/id/booking` atau parameter `?lang=en` — struktur final menunggu keputusan arsitektur).
- **Pemilih bahasa:** Memungkinkan pengguna berpindah ke versi bahasa lain tanpa kehilangan konteks halaman. **Label ringkas "EN" dan "ID" (tanpa bendera). Opsi aktif terlihat jelas. Keyboard-operable. Label aksesibel. Tidak membuat header mobile meluap.**
- **Metadata & judul halaman:** Mengikuti bahasa halaman yang aktif (`<html lang="en">` / `lang="id">`, `title`, `meta description`, Open Graph, Twitter Card).
- **hreflang & canonical:** Setiap halaman memiliki `hreflang` untuk setiap bahasa yang didukung (`en`, `id`, `x-default`) dan `canonical` yang konsisten. **Tidak mencantumkan hreflang untuk versi bahasa yang tidak tersedia.**
- **Sitemap:** Termasuk semua variasi bahasa.
- **Bahasa konten CMS dibedakan dari bahasa antarmuka:** CMS menyediakan field per bahasa untuk konten yang diterjemahkan; bahasa UI mengikuti pemilih pengguna.
- **Fallback CMS (usulan, bukan keputusan final):** Konten utama dapat ditampilkan dengan penanda bahasa jika terjemahan tidak ada. **Tandai NEEDS OWNER DECISION.**

**Pertanyaan terbuka untuk rekonsiliasi dengan DEC-002/DEC-011 (TIDAK diselesaikan di DESIGN.md):**
- Skema URL final: path prefix (`/en/`, `/id/`) atau parameter?
- Canonical: versi bahasa default atau versi tanpa prefix?
- hreflang x-default: ke EN atau ke halaman tanpa bahasa?
- Sitemap variasi: implementasi saat CMS siap.
- Bahasa default: EN (utama) — sudah ditetapkan Owner; ID juga dalam MVP.

**Jangan mengklaim SEO multilingual sudah diimplementasikan.** Catat sebagai follow-up rekonsiliasi yang jelas sebelum TITIS-110 (implementasi CMS/public website). Jangan menetapkan struktur final URL jika membutuhkan perubahan keputusan arsitektur.

**Layout mengakomodasi perbedaan panjang teks EN/ID:** Tidak menetapkan lebar tombol, label, atau badge yang dapat menyebabkan teks terpotong. Komponen fleksibel (min-width, wrap, truncate dengan tooltip).

---

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

- **Bahasa antarmuka (Owner direction terbaru):** **Inggris (en) sebagai bahasa utama/default**, **Indonesia (id) juga didukung pada MVP**. Bahasa tambahan di luar cakupan MVP.
- **Konflik dengan OPEN-021:** PRD.md OPEN-021 status `Decided` telah direkonsiliasi (TITIS-012): **"Inggris (en) sebagai bahasa utama/default; Indonesia (id) juga didukung pada MVP"** (2026-10-11, diperbarui 2026-10-11). Keputusan sebelumnya "Bahasa Indonesia saja pada MVP" digantikan. DQ-08 **konsisten** dengan OPEN-021 terbaru.
- Pemilih bahasa yang jelas dan mudah digunakan wajib tersedia (header publik, header admin).
- Teks UI, formulir, validasi, error, loading, success, navigasi, dan konten publik memiliki versi bahasa yang sesuai.
- Bahasa konten CMS harus dibedakan dari bahasa antarmuka (CMS menyediakan field per bahasa untuk konten terjemahan).
- Format tanggal, uang, serta zona waktu bisnis tetap mengikuti keputusan bisnis (OPEN-013), **bukan** ditentukan hanya oleh bahasa tampilan.
- Nada tulisan: sederhana, sopan, tidak teknis. Pesan error tidak menyalahkan pengguna.

## 12. Daftar Lengkap Halaman & Fungsi (Page/Function Inventory)

Tabel berikut memetakan **semua rute publik**, **semua modul admin**, dan **state UI wajib** per halaman/modul. Setiap baris adalah kontrak desain: state yang dicentang (`✓`) harus diimplementasikan dan diuji.

**Inventaris terverifikasi dari PRD.md §4 dan TESTING.md §9:**
- **Rute publik:** 6 halaman konten + 1 rute error 404 = **7 rute publik**.
- **Modul admin (product modules):** 10 modul (Login, Ringkasan, Booking, Resource, Katalog, Kasir/POS, Transaksi, Laporan, Konten, Pengaturan).
- **Layar/tampilan terpisah (screens):** Booking detail (`/admin/booking/:id`) adalah detail view dalam modul Booking, bukan route/module terpisah. TESTING.md memisahkan TEST-010 (daftar) dan TEST-011 (detail) sebagai test case terpisah.
- **Test case UI:** 7 public (TEST-001–007) + 11 admin (TEST-008–018) = 18 test case UI.

Perbedaan modul, rute, layar, state, dan test case **tidak dapat ditukar**. Tabel di bawah mencatat rute/modul (bukan test case).

| Area | Rute / Modul | Deskripsi Singkat | State Wajib (✓ = wajib ada) | Catatan / Keputusan Terbuka |
|---|---|---|---|---|
| **Public** | `/` (Beranda) | Hero, value prop, CTA Booking, teaser layanan/ruang, footer | loading ✓, empty —, error ✓, success ✓, permission denied —, network error ✓ | Hero image LCP |
| **Public** | `/tentang` (Tentang) | Narasi bisnis, jam buka, lokasi, CTA Booking | loading ✓, empty —, error ✓, success —, network error ✓ | Konten dari CMS (OPEN-006) |
| **Public** | `/layanan` (Layanan/Menu) | Grid kartu layanan (gambar, nama, harga mulai, CTA Booking) | loading ✓, empty ✓, error ✓, success —, network error ✓ | Data dari katalog (OPEN-010); `empty` = "Belum ada layanan" |
| **Public** | `/ruang` (Ruang/Fasilitas) | Grid kartu ruang (gambar, nama, kapasitas, fasilitas, CTA Booking) | loading ✓, empty ✓, error ✓, success —, network error ✓ | Data dari resource (OPEN-007); `empty` = "Belum ada ruang" |
| **Public** | `/booking` (Booking) | Form 3-tahap: pilih resource & tanggal → pilih waktu & isi detail → ringkasan → kirim → layar hasil | loading ✓, empty —, error ✓, success ✓, permission denied —, network error ✓ | `success` = "Permintaan diterima" (bukan "dikonfirmasi"); field form OPEN-007 |
| **Public** | `/kontak` (Kontak) | Form kontak, info lokasi, **peta (proposal — NEEDS OWNER DECISION: embed vs link, API key)**, jam buka, CTA Booking | loading ✓, empty —, error ✓, success ✓, permission denied —, network error ✓ | `success` = "Pesan terkirim" |
| **Public** | `/404` | Halaman tidak ditemukan, tautan ke Beranda & Booking | loading —, empty —, error ✓, success —, permission denied —, network error — | HTTP 404 benar; design tokens & a11y tetap berlaku |
| **Admin** | `/admin/login` | Login email/password, pesan generik, redirect ke `/admin` | loading ✓, empty —, error ✓, success —, permission denied —, network error ✓ | AC-AUTH-01.2; tidak ada pendaftaran publik |
| **Admin** | `/admin` (Ringkasan) | "Perlu Tindakan", "Hari Ini", Ringkasan Keuangan, akses cepat ke modul | loading ✓, empty ✓, error ✓, success —, permission denied ✓, network error ✓ | `empty` = "Tidak ada data hari ini"; role-based (SECURITY.md PERM) |
| **Admin** | `/admin/booking` (Daftar) | Tabel booking dengan filter status/tanggal, aksi baris (konfirmasi/tolak/jadwal ulang/detail) | loading ✓, empty ✓, error ✓, success ✓, permission denied ✓, network error ✓ | `empty` = "Belum ada booking"; aksi via RPC (OPEN-002, OPEN-008) |
| **Admin** | `/admin/booking/:id` (Detail) | Detail lengkap booking, riwayat status, kontak pelanggan, aksi | loading ✓, empty —, error ✓, success ✓, permission denied ✓, network error ✓ | Data sensitif (SECURITY.md PERM-09..11) |
| **Admin** | `/admin/resource` (Resource) | CRUD resource: nama, kapasitas, fasilitas, gambar, jam operasional, status aktif | loading ✓, empty ✓, error ✓, success ✓, permission denied ✓, network error ✓ | `empty` = "Belum ada ruang/fasilitas"; jam operasional terpisah |
| **Admin** | `/admin/katalog` (Katalog) | CRUD kategori & item: nama, deskripsi, harga, satuan, gambar, status listed/aktif | loading ✓, empty ✓, error ✓, success ✓, permission denied ✓, network error ✓ | `empty` = "Belum ada item"; harga uang via formatter (OPEN-013) |
| **Admin** | `/admin/pos` (Kasir/POS) | Layout 2-panel: katalog kiri, keranjang kanan; pembayaran multi-metode; total server-side | loading ✓, empty ✓, error ✓, success ✓, permission denied ✓, network error ✓ | `empty` keranjang = "Tambahkan item"; total selalu terlihat (sticky) |
| **Admin** | `/admin/transaksi` (Transaksi) | Daftar order dengan filter, detail order, void/refund (Owner), ekspor | loading ✓, empty ✓, error ✓, success ✓, permission denied ✓, network error ✓ | `empty` = "Belum ada transaksi"; void/refund butuh alasan wajib |
| **Admin** | `/admin/laporan` (Laporan) | Tabel scrollable: pendapatan, DP, pelunasan, per resource, per metode bayar; rentang tanggal cepat; **ekspor CSV (proposal — NEEDS OWNER DECISION: format, kolom, encoding)** | loading ✓, empty ✓, error ✓, success —, permission denied ✓, network error ✓ | `empty` = "Tidak ada data pada rentang ini"; MVP tabel saja (no chart) |
| **Admin** | `/admin/konten` (Konten) | Editor halaman/section (CMS), pratinjau, publikasi, manajemen media | loading ✓, empty ✓, error ✓, success ✓, permission denied ✓, network error ✓ | `empty` = "Belum ada halaman"; OPEN-006; media OPEN-001 |
| **Admin** | `/admin/pengaturan` (Pengaturan & Akun) | Profil bisnis, timezone, mata uang, pajak, akun Staff (Owner), preferensi notifikasi, ganti password | loading ✓, empty —, error ✓, success ✓, permission denied ✓, network error ✓ | Owner only untuk role/akun Staff (PERM-21, PERM-22) |

**Legenda State:**
- `loading` = skeleton/spinner saat data dimuat
- `empty` = state kosong dengan penjelasan & langkah berikutnya
- `error` = validasi field + ringkasan; isian dipertahankan
- `success` = konfirmasi eksplisit ("diterima"/"tersimpan"/"terkirim")
- `permission denied` = pesan "tidak memiliki izin" tanpa bocor data
- `network error` = pesan actionable + tombol coba lagi; tanpa detail teknis

**Ringkasan Inventaris (terverifikasi PRD.md §4, TESTING.md §9):**
- Rute publik: 7 (6 konten + 404)
- Modul admin: 10 (Login, Ringkasan, Booking, Resource, Katalog, Kasir/POS, Transaksi, Laporan, Konten, Pengaturan)
- Layar terpisah dalam modul: Booking detail (`/admin/booking/:id`) — detail view, bukan module terpisah
- Test case UI: 18 (7 publik + 11 admin; TESTING.md memisahkan booking list/detail)

*Catatan: Referensi visual untuk mode gelap menggunakan sufiks `-light` dan `-dark` (mis. `public-home-light.png`, `public-home-dark.png`). Referensi untuk bilingual menggunakan sufiks `-en` dan `-id` (mis. `public-home-en-light.png`, `public-home-id-light.png`).*

## 13. Rencana Mockup: Empat Layar Representatif

Sebelum TITIS-102 (mockup disetujui), empat layar berikut harus dirancang dan disetujui sebagai representasi utama design system. Setiap layar dibuat untuk **mode terang & gelap** serta **EN & ID** (total **8 varian per layar: 2 viewport × 2 tema × 2 bahasa**), di **viewport 320×640 dan 1440×900 minimum**. Total varian untuk keempat layar: **32 varian (8 × 4)**.

| # | Layar | Area | Alasan pemilihan | Referensi Portfolio |
|---|---|---|---|---|
| 1 | **Beranda Publik** (`/`) | Public | Halaman landing paling sering diakses; menguji header, hero, navigasi, footer, pemilih bahasa, toggle tema | Header, Hero, Section, Footer |
| 2 | **Booking Publik** (`/booking`) | Public | Alur kritis bisnis; menguji form 3-tahap, pemilih resource/tanggal/waktu, validasi, state loading/error/success, ringkasan | Form Field, Button, Panel/Card, Dialog, Feedback |
| 3 | **Dashboard Admin (Ringkasan)** (`/admin`) | Admin | Titik masuk operasional harian; menguji sidebar, header admin, ringkasan keuangan, daftar "Perlu Tindakan", toggle tema, pemilih bahasa | Sidebar, Header Admin, Data List/Table, Status Badge |
| 4 | **Kasir / POS** (`/admin/pos`) | Admin | Alur transaksi kompleks; menguji layout tablet/desktop, katalog item, keranjang, total server-side, pembayaran, dialog konfirmasi | Button, Form Field, Data List/Table, Dialog, Feedback, Tampilan Uang |

**Catatan:** Layar-layar ini **harus menggunakan token Portfolio** (warna, tipografi, spasi, radius, elevasi, gerak). Stitch hanya digunakan untuk mengkomposisikan layout yang belum ada di Portfolio (booking, dashboard, POS) dengan token yang sama. **Booking list (`/admin/booking`) adalah target QA tambahan (TEST-010) — bukan pengganti layar representatif; diuji pada 11 viewport × 2 bahasa × 2 tema sebagai bagian dari strategi sampel prioritas.**

---

### 13.1 Pembedaan: Mockup Viewport vs QA Viewport

| Aspek | Mockup (Desain/Stakeholder Review) | QA / Verifikasi (Testing) |
|---|---|---|
| **Tujuan** | Persetujuan visual & komposisi layout oleh Owner | Bukti kepatuhan responsif, a11y, PageSpeed, fungsional |
| **Viewport** | 2 viewport per layar: **320×640** (mobile) & **1440×900** (desktop) | **11 viewport wajib** (§7 baris 191–202) × **2 bahasa** (EN/ID) × **2 tema** (terang/gelap) |
| **Varian per layar** | 8 (2 viewport × 2 tema × 2 bahasa) | **44 per halaman** (11 viewport × 2 bahasa × 2 tema) |
| **Cakupan halaman** | 4 layar representatif saja | **7 rute publik + 10 modul admin** (§12) diuji minimal pada sampel prioritas; 4 layar representatif diuji penuh |
| **Alat** | Figma/Stitch export → `docs/design/references/` | Playwright + axe-core (DEC-013), PageSpeed Insights, browser manual |
| **Kriteria lolos** | Owner menyetujui visual (disetujui = catat di §12) | Semua kategori PageSpeed ≥ 90 (median 3 run), WCAG 2.2 AA, tidak ada regresi fungsional |

**Jangan menyamakan persetujuan mockup dengan lolos QA.** Mockup disetujui ≠ halaman siap produksi. QA viewport matrix jauh lebih luas dan wajib diverifikasi sebelum rilis.

**Konsistensi dengan TESTING.md:**
- TESTING.md §9 mencatat 18 test case UI (7 publik + 11 admin).
- Kombinasi teoretis QA: **18 test case × 11 viewport × 2 bahasa × 2 tema = 792 kombinasi teoretis**.
- Inventaris rute/modul terpisah: **17 entri** (7 rute publik + 10 modul admin) — berbeda dari test case.
- Strategi test: 4 layar representatif diuji penuh (44 varian × 4 = 176); halaman lain menggunakan sampel prioritas berisiko tinggi.
- **Ini adalah rencana pengujian, bukan klaim bahwa tes telah dijalankan atau lolos.**

### 13.2 Cakupan Explisit Mockup Representatif

| Layar | Viewport | Tema | Bahasa | Catatan |
|---|---|---|---|---|
| **Beranda Publik** (`/`) | 320×640 (mobile), 1440×900 (desktop) | Terang, Gelap | EN, ID | Hero, header, navigasi, footer, pemilih bahasa, toggle tema |
| **Booking Publik** (`/booking`) | 320×640 (mobile-first) | Terang, Gelap | EN, ID | Form 3-tahap, validasi, ringkasan, state success/error/loading |
| **Dashboard Admin (Ringkasan)** (`/admin`) | 1440×900 (desktop), 375×667 (mobile) | Terang, Gelap | EN, ID | Sidebar, header admin, ringkasan keuangan, "Perlu Tindakan" |
| **Kasir / POS** (`/admin/pos`) | 1024×768 (tablet landscape) | Terang, Gelap | EN, ID | Layout 2-panel, katalog, keranjang, total server-side, pembayaran |

**Total varian:** 4 layar × (2+2+2+1 viewport) × 2 tema × 2 bahasa = **8+8+8+4 = 28 varian minimum** (Booking mobile-only = 4 varian, POS tablet-only = 4 varian, Home & Dashboard = 8 varian each).

**Pengurangan bahasa (hanya EN/ID) → NEEDS OWNER DECISION.** Jika Owner memutuskan bahasa lain di MVP, varian bertambah. Keputusan saat ini: EN primary/default + ID MVP (OPEN-021 direkonsiliasi via TITIS-012).

---

## 14. Rencana Mockup: MVP Pages (Setelah Backend Selesai)

Empat layar representatif (§13) mencakup design system inti. **Layar-layar MVP berikut direncanakan untuk desain dan persetujuan setelah backend development selesai**, sebelum rilis MVP. Setiap layar mengikuti pola yang sama: token Portfolio, 16 varian minimum (2 viewport × 2 tema × 2 bahasa), disimpan di `docs/design/references/`.

**Pembedaan penting:**
- **A. MVP pages and features** — Semua halaman/modul di §12 adalah cakupan MVP.
- **B. Mockups untuk halaman MVP yang disetujui** — Dibuat setelah backend selesai (bukan setelah MVP dirilis).
- **C. Fitur yang benar-benar ditunda pasca-MVP** — Tercatat di §15 sesuai keputusan OPEN yang `Deferred` atau di luar scope MVP.

Jangan melabeli layar MVP sebagai fitur pasca-MVP hanya karena mockup-nya belum dibuat.

| Prioritas | Layar | Area | Jenis | Alasan / Ketergantungan |
|---|---|---|---|---|
| Tinggi | **Tentang** (`/tentang`) | Public | MVP page | Konten CMS (OPEN-006); hero + narasi + CTA |
| Tinggi | **Layanan/Menu** (`/layanan`) | Public | MVP page | Grid kartu dari katalog; state empty/error/loading |
| Tinggi | **Ruang/Fasilitas** (`/ruang`) | Public | MVP page | Grid kartu dari resource; state empty/error/loading |
| Tinggi | **Kontak** (`/kontak`) | Public | MVP page | Form + info lokasi; state success/error |
| Tinggi | **404** | Public | MVP page | HTTP 404 benar; design tokens & a11y |
| Tinggi | **Admin Login** (`/admin/login`) | Admin | MVP page | Entry point admin; pesan generik; redirect |
| Tinggi | **Booking Admin Detail** (`/admin/booking/:id`) | Admin | MVP screen (detail view) | Detail lengkap + riwayat status + aksi; bukan route/module terpisah |
| Tinggi | **Resource Admin** (`/admin/resource`) | Admin | MVP module | CRUD + jam operasional; state empty/error |
| Tinggi | **Katalog Admin** (`/admin/katalog`) | Admin | MVP module | CRUD kategori/item; harga via formatter |
| Tinggi | **Transaksi Admin** (`/admin/transaksi`) | Admin | MVP module | Daftar + detail + void/refund (Owner) |
| Tinggi | **Laporan Admin** (`/admin/laporan`) | Admin | MVP module | Tabel scrollable + filter + ekspor CSV |
| Tinggi | **Konten Admin** (`/admin/konten`) | Admin | MVP module | CMS editor + pratinjau + media |
| Tinggi | **Pengaturan Admin** (`/admin/pengaturan`) | Admin | MVP module | Profil bisnis + akun Staff (Owner only) |
| Sedang | **Booking Publik — Layar Hasil** (post-submit) | Public | MVP screen (state) | State success "permintaan diterima" + reference code; bagian dari `/booking` flow |
| Sedang | **Admin — State Empty Semua Daftar** | Admin | MVP state pattern | Pola konsisten "Belum ada X. Tambahkan." |
| Rendah | **Print Stylesheet (Struk POS / Laporan)** | Admin | Post-MVP feature | Mode cetak terpisah; tidak blok MVP |

**Catatan:** 
- "MVP page" = halaman/rute yang masuk cakupan MVP (§12).
- "MVP screen" = tampilan terpisah (detail view, state) dalam alur MVP yang sudah ada, bukan route/module baru.
- "MVP module" = modul admin yang masuk cakupan MVP (§12).
- "Post-MVP feature" = fitur yang benar-benar di luar scope MVP (§15).
- Prioritas "Tinggi" = mockup dibutuhkan untuk kelengkapan visual MVP sebelum rilis. "Sedang" = state tambahan dari alur MVP. "Rendah" = fitur pasca-MVP.
- Jadwal pasti ditentukan saat perencanaan fase berikutnya (bukan bagian Phase 0).

---

## 15. Fitur yang Benar-Benar Ditunda Pasca-MVP

Item berikut **tidak termasuk cakupan MVP** dan ditunda ke fase berikutnya, kecuali PRD secara eksplisit mewajibkan di masa depan. Ini adalah fitur yang memang di luar scope MVP, bukan halaman MVP yang menunggu mockup.

| Item | Alasan ditunda | Referensi |
|---|---|---|
| Font kedua (non-monospace) | MVP hanya JetBrains Mono; font kedua menambah kompleksitas font loading dan CLS | §2, §4.2 |
| Grafik dekoratif / ilustrasi kustom | Bukan fungsional; menambah payload dan maintenance | §5 |
| Timeline booking visual (stepper grafis) | Alur booking 3-tahap sudah cukup jelas dengan teks/state; stepper grafis bisa ditambah nanti | §5, §6.1 |
| Wizard booking kompleks (multi-step dengan cabang) | MVP: 3 tahap linear + layar hasil; cabang/branch ditunda | §5, §6.1 |
| Animasi transisi halaman / micro-interaction lanjutan | Hanya gerak esensial (prefers-reduced-motion); animasi ekstra menambah bundle | §4.3, §8 |
| Sticky bottom bar Booking di public mobile | Header sudah memiliki tombol Booking menonjol; sticky bar menutupi konten | §6.1 |
| Bahasa antarmuka di luar EN/ID | Cakupan MVP hanya EN (utama) + ID | §11 |
| SEO multilingual implementasi penuh (hreflang, sitemap variasi, URL terlokalisasi final) | Butuh keputusan arsitektur final (DEC-002, DEC-011) sebelum implementasi | §8.2 |
| Laporan keuangan visualisasi grafik/chart | MVP: tabel scrollable dalam wadah; chart library menambah bundle | §5, §6.2 |
| Mode cetak (print stylesheet) untuk struk/laporan | Tidak kritis untuk operasional harian MVP | — |
| PWA / offline support | Tidak termasuk MVP; butuh service worker dan strategi cache | — |

---

## 16. Pertanyaan desain terbuka

| ID | Pertanyaan | Status | Keputusan & tanggal | Dibutuhkan sebelum |
|---|---|---|---|---|
| DQ-01 | Palet warna final (nilai token warna). | Open | — | TITIS-102 (referensi Portfolio disetujui) |
| DQ-02 | Apakah mode gelap termasuk MVP? | Decided | **A — Masuk MVP** (2026-10-11). Token mendukung dua mode; toggle tema wajib di header publik & sidebar admin. | TITIS-102 |
| DQ-03 | Skala tipografi (display, h1–h4, body, body-sm, caption) dan verifikasi lisensi JetBrains Mono. | **Open** (font family **Decided**: JetBrains Mono) | Font family: JetBrains Mono (Owner direction, §2, §4.2). Skala spesifik menunggu referensi Portfolio. Lisensi: **BELUM TERVERIFIKASI DARI SUMBER RESMI** (klaim MIT/SIL OFL 1.1 per DEC-019 tidak tervalidasi). | TITIS-102 (referensi Portfolio disetujui) |
| DQ-04 | Skala spasi, radius, border, elevasi, dan gerak. | Open | — | TITIS-102 (referensi Portfolio disetujui) |
| DQ-05 | Urutan akhir navigasi admin dan isi halaman Ringkasan. | Open | — | TITIS-014 (Gate Phase 0) |
| DQ-06 | Viewport uji responsif yang disepakati. | **Decided** (Owner direction) | Daftar 11 viewport wajib tercantum di §7 (2026-10-11). Belum diverifikasi via test. | TITIS-101 (scaffold) |
| DQ-07 | Konfirmasi target aksesibilitas (WCAG 2.2 AA) dan alat cek otomatis (DEC-013). | **Target Decided: WCAG 2.2 AA** | Target disetujui (PRD NFR-03, DEC-013 Accepted). Implementasi dan conformance **belum diverifikasi** (menunggu TITIS-404). | TITIS-404 (E2E + a11y otomatis) |
| DQ-08 | Apakah multi-bahasa dibutuhkan? | **Decided** | **EN (primary/default) + ID (MVP). OPEN-021 direkonsiliasi via TITIS-012: "Inggris (en) sebagai bahasa utama/default; Indonesia (id) juga didukung pada MVP." Bahasa tambahan di luar cakupan MVP. (2026-10-11, diperbarui 2026-10-11)** | TITIS-109 |

---

## 17. Checklist Review Akhir Dokumen (Final Review Checklist)

Sebelum mengubah status header DESIGN.md menjadi **READY FOR OWNER REVIEW**, semua item berikut harus ✓. Checklist ini mencakap A1–A8 dan validasi lintas dokumen.

| # | Item Pemeriksaan | Status | Bukti / Catatan |
|---|---|---|---|
| **A1** | **Public company-profile framing eksplisit** — §2 menyatakan "Situs publik = Company-profile landing page"; §6.1 mengulang tujuan konversi per halaman | ✓ | §2 baris 24–25, §6.1 baris 163–165 |
| **A2** | **Admin/POS operational priorities eksplisit** — §6.2 memisahkan "Admin Dashboard (Manajemen & Pengawasan)" vs "POS/Kasir (Transaksi Langsung)" dengan prioritas visibility/decision-speed vs throughput/accuracy | ✓ | §6.2 baris 170–184 |
| **A3** | **Complete page/function inventory** — §12 memuat **7 rute publik** (6 + 404) + **10 modul admin** (Login + 9 modul lain) dengan 6 state wajib per baris; membedakan modul, rute, layar detail (booking detail), dan test case | ✓ | §12 tabel baris 416–434, ringkasan baris 445–448 |
| **A4** | **Future mockup plan beyond 4 screens** — §14 mencantumkan layar MVP yang butuh mockup setelah backend selesai + fitur benar-benar pasca-MVP di §15, dengan prioritas dan jenis (page/screen/module/feature); **register mockup terpusat di `docs/design/references/` per §1 & §12** | ✓ | §14 tabel baris 500–518, §15 tabel baris 534–545 |
| **A5** | **Mockup ≠ QA viewport distinction** — §13.1 tabel perbandingan jelas: mockup 2 viewport × 4 layar vs QA 11 viewport × 17 rute/modul × 2 bahasa × 2 tema; "Jangan menyamakan persetujuan mockup dengan lolos QA" tertulis eksplisit | ✓ | §13.1 tabel baris 470–477, catatan baris 477 |
| **A6** | **Final review checklist ini hadir** — §17 lengkap dengan kolom Status & Bukti | ✓ | §17 tabel baris 582–601 |
| **A7** | **Hanya DESIGN.md dimodifikasi untuk task ini** — `git diff --name-only` hanya menunjukkan `DESIGN.md` (file lain sudah diubah sebelumnya dan tetap ada di working tree) | ☐ | Verifikasi via command |
| **A8** | **Portfolio references hanya dari DESIGN.md existing** — Tidak ada akses direktori eksternal; klaim paritas (§4.4) tetap `BELUM TERVERIFIKASI` | ✓ | §4.4 catatan header tabel, semua status `BELUM TERVERIFIKASI` |
| **Lintas Dokumen** | **PRD.md routes/modules konsisten** — 6 halaman publik + 404 + 10 modul admin cocok §12 DESIGN.md | ✓ | PRD.md §3, §4 dibaca; §12 DESIGN.md tabel diverifikasi |
| **Lintas Dokumen** | **ARCHITECTURE.md DEC references valid** — DEC-002 (Routing), DEC-004 (Tailwind v4), DEC-011 (SEO), DEC-018 (Theme) dirujuk benar di DESIGN.md | ✓ | ARCHITECTURE.md §3 dibaca; ref di DESIGN.md: DEC-002 (§8.2), DEC-004 (§4.1, §4.2), DEC-011 (§8.2), DEC-018 (§4.1, §6.2) |
| **Lintas Dokumen** | **SECURITY.md PERM matrix konsisten** — Admin modules di §12 mencerminkan PERM-01..24; §6.2 Ringkasan Keuangan & Laporan untuk Owner/Manager (PERM-18); Staff tidak akses laporan (OPEN-005) | ✓ | SECURITY.md §4 dibaca; §6.2 & §12 DESIGN.md konsisten |
| **Lintas Dokumen** | **OPEN-021 konsisten** — PRD.md OPEN-021 direkonsiliasi (TITIS-012): EN primary/default + ID MVP; §11 & DQ-08 diperbarui | ✓ | PRD.md OPEN-021 §8 dibaca; §11 baris 394–396, DQ-08 baris 574 diperbarui |
| **Lintas Dokumen** | **TESTING.md mapping ada** — Setiap state di §12 memiliki test ID di TESTING.md (UI, a11y, RLS, POS, booking) | ✓ | TESTING.md §9 dibaca; §12 state kolom merujuk test case |
| **Validasi Git** | `git diff --check` PASS (no whitespace errors) | ✓ | `git diff --check`: no output = PASS |
| **Validasi Git** | `git diff --check -- DESIGN.md` PASS | ✓ | `git diff --check -- DESIGN.md`: no output = PASS |
| **Validasi Git** | `git diff --stat -- DESIGN.md` hanya DESIGN.md berubah | ✓ | `git diff --stat -- DESIGN.md` → 1 file changed (DESIGN.md) |
| **Validasi Git** | `git status --short --branch` menunjukkan perubahan working tree yang ada (termasuk file lain yang sudah diubah sebelumnya) — jujur, tidak diklaim hanya DESIGN.md | ✓ | `git status --short --branch` → M .gitignore, M ARCHITECTURE.md, M DATABASE.md, M DESIGN.md, M PRD.md, M README.md, M SECURITY.md, M TASK.md, ?? .env.example (pre-existing) |
| **Validasi Git** | `git diff -- DESIGN.md` menunjukkan perubahan F1–F9 saja, tidak ada noise | ✓ | `git diff -- DESIGN.md` → hanya perubahan F1–F9 pada DESIGN.md |

**Status header DESIGN.md:** Setelah semua ☐ → ✓ (termasuk validasi command), ubah baris header status dari `Draft kerangka (Phase 0)` → **READY FOR OWNER REVIEW**.
