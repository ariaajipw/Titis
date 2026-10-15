# DESIGN — Panduan Desain TITIS

> **Status:** **Draft kerangka (Phase 0) — revisi 2026-10-16.** Nilai visual final (warna, skala tipografi, spasi) **sengaja belum diisi** karena harus berasal dari referensi desain **Portfolio** yang disetujui. Aturan aksesibilitas, state, pola interaksi, dan aturan motion sudah berlaku sebagai standar.
> **Sumber kebenaran untuk:** design tokens, layout, komponen, perilaku responsif, aksesibilitas, motion publik, dan referensi visual yang disetujui.
> **Bukan untuk:** scope produk (`PRD.md`), hak akses dan aturan transaksi (`SECURITY.md`, `DATABASE.md`), pilihan library dan routing (`ARCHITECTURE.md`), roadmap dan workflow (`TITIS_MASTER_BUILD_GUIDE_FINAL.md`).
> **Label:** `DQ-xx` = pertanyaan desain terbuka (§17). `DEC-xxx` = keputusan di `ARCHITECTURE.md` §4. `AC-xxx` = acceptance criteria di `PRD.md` §6. ID task hanya ditetapkan di `TASK.md` dan tidak dikutip di dokumen ini.
> **Dasar revisi:** `PRD.md` (rev. 2026-10-15), `ARCHITECTURE.md` (Draft Phase 0, rev. 2026-10-15), dan `TITIS_MASTER_BUILD_GUIDE_FINAL.md` (rev. 2026-10-15). `SECURITY.md`, `DATABASE.md`, `TESTING.md`, `TASK.md`, dan `AGENTS.md` **tidak diperiksa** pada revisi ini; referensi silang ke dokumen tersebut harus dicek ulang (lihat §18).

---

## 0. Catatan revisi 2026-10-16

**Dipertahankan (karakter desain yang sudah ditetapkan):**
- Palet: krem, navy, hijau, satu aksen koral.
- Font: **JetBrains Mono** (heading dan body; angka uang/tabular memakai monospace).
- Semantic design tokens (Tailwind v4, DEC-004) dan struktur §4.
- Mode gelap masuk MVP (keputusan A, 2026-10-11) dengan toggle tema.
- Situs publik = company-profile landing page dengan CTA Booking; pemisahan public website dan dashboard.
- Alur booking tiga tahap + layar hasil; daftar menjadi kartu di ponsel; laporan berupa tabel yang menggulir di dalam wadahnya.
- Aksesibilitas WCAG 2.2 AA, state UI standar, target PageSpeed ≥ 90, rencana empat layar mockup.

**Diselaraskan dengan PRD/ARCHITECTURE/Guide revisi 2026-10-15 (fitur yang sebelumnya tertulis di dokumen ini tetapi kini deferred atau tidak ada):**
- Role Staff/Manager dan referensi `PERM-xx` → **satu akun Owner**.
- Void/refund, DP/pelunasan, metode kartu/e-wallet → **POS lunas dengan metode `cash`, `transfer`, `qris`** saja.
- Pemindaian barcode, cetak struk/print stylesheet, ekspor CSV, notifikasi, jadwal ulang booking, form kontak, halaman Pengaturan/akun Staff → **dihapus dari MVP** (daftar di §16).
- **Multi-bahasa EN/ID dan SEO multilingual** → PRD §4.2/§7 menetapkan *Bahasa Indonesia saja* dan multi-bahasa *Deferred*. Keputusan lama (EN utama + ID) digantikan; lihat DQ-08.
- Referensi `OPEN-xxx`, `TITIS-xxx`, `TEST-xxx` yang tidak lagi ada di PRD/ARCHITECTURE dihapus. Referensi `DEC-xxx` diperbarui ke nomor yang berlaku (mis. DEC-018 sekarang = client state, bukan tema; DEC-019 = error handling, bukan lisensi font).

**Dikoreksi:**
- Daftar viewport wajib berisi **10 ukuran tetap** (sebelumnya tertulis "11" padahal hanya 10 yang terdaftar) ditambah tiga pemeriksaan tambahan (§7).
- Lisensi JetBrains Mono kini **terverifikasi dari repositori resmi** (§4.2).

**Ditambahkan:**
- §4.5 seam kustomisasi (template vs custom UI/UX).
- §9 **Motion publik dengan Lenis + GSAP** (permintaan Owner 2026-10-16).
- §14 **Verifikasi visual dan penggunaan skill agent** (Frontend Design, UI/UX Pro Max, UI Skills, Playwright).
- Catatan strategi LCP untuk Vite SPA di §7.1.

**Perlu keputusan Owner:** DQ-08 (bahasa), DQ-09 (dependency Lenis + GSAP), DQ-10 (Playwright sebagai dev dependency), DQ-11 (alasan penolakan booking), DQ-12 (peta di halaman Kontak).

---

## 1. Cara memakai dokumen ini

1. Gunakan referensi desain **Portfolio** sebagai sumber kebenaran visual (token warna, tipografi, spasi, radius, elevasi, gerak, komponen header/footer/section).
2. Untuk layar yang **belum tercakup di Portfolio** (booking, dashboard, POS), Google Stitch boleh dipakai **hanya untuk komposisi layout**, dengan token yang **wajib berasal dari Portfolio**.
3. Simpan screenshot/mockup yang **disetujui** di `docs/design/references/` dan catat di §3.
4. Isi nilai token (§4) dari referensi Portfolio yang disetujui, lalu ubah status `DQ-xx` terkait.
5. Implementasi mengikuti dokumen ini. Mockup adalah referensi visual, **bukan** spesifikasi perilaku, arsitektur, atau akses data.
6. **Jangan menyalin kode hasil generator (Stitch atau lainnya) secara membabi buta.** Sesuaikan dengan stack (`ARCHITECTURE.md`), aksesibilitas (§8), model data, dan komponen proyek. Jangan menambah library hanya karena generator memakainya (ARCHITECTURE §5.1).
7. Skill agent (§14) membantu kualitas eksekusi. Jika output skill bertentangan dengan dokumen ini, **dokumen ini yang berlaku**.

## 2. Tujuan visual dan prinsip desain

**Tujuan (Usulan):** tampilan yang terasa hangat, jelas, dan tepercaya bagi bisnis lokal; dashboard Owner yang cepat dipakai saat operasional sibuk.

**Situs publik = company-profile landing page.** Enam halaman konten (Beranda, Tentang, Layanan/Menu, Ruang/Fasilitas, Booking, Kontak) plus halaman 404 membentuk profil bisnis yang mengarah ke konversi booking. **Bukan situs aplikasi lengkap; tidak ada dashboard pengunjung dan tidak ada akun publik.** Halaman Ruang/Fasilitas boleh disembunyikan bila bisnis tidak memakai booking resource (PRD §5.1).

| Prinsip | Arti praktis |
|---|---|
| Jelas sebelum indah | Hierarki informasi, label, dan status mudah dibaca sekali pandang. |
| Mobile-first | Pengunjung umumnya memakai ponsel; booking harus nyaman satu tangan. |
| Konsisten | Satu design system untuk dua area; komponen yang sama berperilaku sama. |
| Jujur terhadap status | Sistem tidak berpura-pura berhasil; loading, gagal, dan "permintaan diterima" (bukan "dikonfirmasi") dibedakan jelas. |
| Aman secara visual | Aksi permanen (checkout, konfirmasi/pembatalan booking) tidak mudah terklik tidak sengaja. Karena tidak ada void/refund, **checkout selalu melewati langkah periksa keranjang**. |
| Aksesibel secara default | Keyboard, fokus, label, dan kontras adalah syarat, bukan tambahan. |
| Performa sebagai fitur | Target PageSpeed Insights ≥ 90 untuk halaman publik (§7.1). Motion tidak boleh menurunkannya. |
| Motion = peningkatan progresif | Semua konten dan fungsi bekerja tanpa animasi. Motion hanya di situs publik, dapat dimatikan, dan **dipangkas lebih dulu** bila waktu meleset (Guide §10). |
| UI ≠ fitur produk | Perilaku UI (state, animasi, layout) ada di dokumen ini; logika bisnis, hak akses, dan validasi server ada di `PRD.md`, `SECURITY.md`, `DATABASE.md`. |

## 3. Referensi dan alur persetujuan desain

- Lokasi referensi: `docs/design/references/`.
- Penamaan usulan: `<area>-<halaman>-<viewport>-<tema>.png`, mis. `public-booking-mobile-light.png`, `admin-booking-list-desktop-dark.png`.
- Sebuah referensi dianggap **disetujui** hanya bila dicatat di tabel di bawah dengan tanggal dan catatan keputusan yang belum selesai.
- Perubahan yang memengaruhi perilaku (bukan sekadar visual) harus ditulis di dokumen ini atau `PRD.md`, bukan hanya tersirat di gambar.

| Referensi | Layar | Viewport / tema | Tanggal disetujui | Catatan |
|---|---|---|---|---|
| *(belum ada)* | — | — | — | Diisi saat mockup disetujui |

## 4. Design tokens

Token diekspos sebagai variabel tema Tailwind v4 (CSS-first, DEC-004) dengan **nama semantik** (berdasarkan peran, bukan nilai). Nilai berasal dari referensi **Portfolio** yang disetujui.

### 4.1 Warna (peran)

| Token (peran) | Kegunaan | Nilai | Syarat kontras |
|---|---|---|---|
| `color-bg` | Latar halaman | DQ-01 | — |
| `color-surface` | Kartu/panel | DQ-01 | — |
| `color-surface-muted` | Latar sekunder | DQ-01 | — |
| `color-text` | Teks utama | DQ-01 | ≥ 4.5:1 terhadap `bg` dan `surface` |
| `color-text-muted` | Teks sekunder | DQ-01 | ≥ 4.5:1 |
| `color-primary` / `color-primary-contrast` | Aksi utama dan teks di atasnya | DQ-01 | teks ≥ 4.5:1; batas komponen ≥ 3:1 |
| `color-accent` / `color-accent-contrast` | Aksen visual (identitas brand) | DQ-01 | teks ≥ 4.5:1; batas komponen ≥ 3:1 |
| `color-border` | Garis/pembatas | DQ-01 | batas kontrol input ≥ 3:1 |
| `color-focus-ring` | Indikator fokus | DQ-01 | ≥ 3:1 terhadap latar sekitar |
| `color-success` | Status sukses/positif | DQ-01 | teks ≥ 4.5:1; **bukan** satu-satunya pembeda (sertakan ikon/teks) |
| `color-warning` | Status peringatan | DQ-01 | idem |
| `color-danger` | Status error/destruktif | DQ-01 | idem |
| `color-info` | Status informasi | DQ-01 | idem |

**Palet identitas visual (nilai final mengisi DQ-01):**
- Krem — latar utama `color-bg` mode terang.
- Navy — teks utama `color-text`, heading, border primer.
- Hijau — `color-success`, aksi positif, indikator status aktif.
- Koral — `color-accent` (identitas visual). **Catatan kontras:** koral di atas krem kemungkinan tidak memenuhi 4.5:1 untuk teks; gunakan koral untuk aksen, elemen besar, atau latar tombol dengan teks berkontras cukup. Putuskan setelah diukur (§8.1), tanpa mengubah identitas palet.

**Mode gelap — masuk MVP (keputusan A, 2026-10-11).** Token warna mendukung dua mode (terang/gelap) lewat CSS custom properties.
- Toggle tema wajib ada di header publik dan sidebar/menu admin.
- Hormati `prefers-color-scheme`, izinkan pilihan manual, simpan di `localStorage`; state tema boleh lewat React Context sederhana (selaras DEC-018: tanpa global state library).
- **Terapkan tema sebelum paint pertama** (inline script di `<head>` atau `color-scheme`) untuk mencegah flash tema (FOUC).
- Referensi visual disimpan dengan sufiks `-light` dan `-dark`.

### 4.2 Tipografi

| Peran | Keterangan | Nilai |
|---|---|---|
| Keluarga font | **JetBrains Mono** dengan *fallback stack* sistem (`ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace`) | Decided |
| Skala | `display`, `h1`–`h4`, `body`, `body-sm`, `caption` | DQ-03 |
| Aturan | Teks isi ≥ 16 px (1rem); baris isi ≤ ~75 karakter; tinggi baris longgar untuk paragraf; angka uang memakai angka tabular agar sejajar | — |
| Pengiriman font | *Self-host* berkas woff2 dari rilis resmi (tanpa Google Fonts dan tanpa dependency npm tambahan); subset Latin (+ Latin-ext bila perlu); `font-display: swap`; preload hanya berkas yang kritis | Usulan |
| Lisensi | **Terverifikasi 2026-10-16** dari repositori resmi `JetBrains/JetBrainsMono`: tipeface berlisensi **SIL OFL 1.1**, boleh dipakai gratis untuk komersial maupun non-komersial, kredit tidak diwajibkan. Saat font di-bundle, **sertakan salinan `OFL.txt` dan pemberitahuan hak cipta** dalam atribusi proyek (cek ulang pada rilis open-source). | Verified |

### 4.3 Spasi, bentuk, efek, dan gerak

| Token | Aturan | Nilai |
|---|---|---|
| Skala spasi | Berbasis kelipatan konstan (Usulan: 4 px) | DQ-04 |
| Radius | `sm`, `md`, `lg`, `full` | DQ-04 |
| Border | Ketebalan standar dan gaya | DQ-04 |
| Elevasi | 0–3 untuk kartu/dialog/menu | DQ-04 |
| Lapisan (z-index) | Konten < header lengket < menu < dialog < toast | DQ-04 |
| Gerak (UI) | Durasi singkat; **hormati `prefers-reduced-motion`** | DQ-04 |
| Gerak (motion publik) | Token durasi dan easing dipakai bersama oleh CSS dan preset GSAP (§9.4). Usulan awal: `fast` 0.2 s, `base` 0.5 s, `slow` 0.8 s, easing keluar yang halus. | DQ-04 |

### 4.4 Paritas dengan Portfolio

Status paritas hanya "SAMA" bila diverifikasi dari sumber Portfolio resmi. Karena sumber tersebut tidak dibuka saat revisi ini, **semua klaim tetap BELUM TERVERIFIKASI**.

| Aspek | Token/Pola TITIS | Status | Catatan |
|---|---|---|---|
| Warna (krem, navy, hijau, koral) | `color-*` (§4.1) | BELUM TERVERIFIKASI | Nilai kanonik mengisi DQ-01 |
| Tipografi (JetBrains Mono + fallback) | §4.2 | BELUM TERVERIFIKASI | Font family final; lisensi sudah terverifikasi |
| Skala tipografi | Skala semantik Tailwind v4 | BELUM TERVERIFIKASI | Menunggu DQ-03 |
| Spasi, radius, border, elevasi | §4.3 | BELUM TERVERIFIKASI | Menunggu DQ-04 |
| Container, grid, ritme section | `max-w-prose`, grid admin 12 kolom, `py-12` mobile / `py-20` desktop (usulan) | BELUM TERVERIFIKASI | Ikuti ritme Portfolio |
| Header dan footer | Komponen Header, Footer | BELUM TERVERIFIKASI | — |
| Motion (durasi, easing, pola reveal) | §9.4 | BELUM TERVERIFIKASI | Jika Portfolio sudah memakai Lenis/GSAP, ambil pola gerak dari sana; jika tidak, §9.4 menjadi acuan awal |
| Ikon | `lucide-react` atau SVG inline | BELUM TERVERIFIKASI | `lucide-react` = dependency baru, perlu persetujuan (ARCHITECTURE §5.1) |
| Komponen (7 MVP) | §5 | BELUM TERVERIFIKASI | — |

### 4.5 Seam kustomisasi: template vs custom UI/UX

Mengikuti PRD §3 dan AC-DESIGN-01.x:

| Siapa | Mengubah apa | Cara |
|---|---|---|
| **Owner** | Konten: teks, gambar, info bisnis, katalog, kontak, jam buka, visibilitas section yang diizinkan | Dashboard |
| **Developer** (per klien) | Token (warna, tipografi, spasi, radius), komposisi section, varian komponen publik, **preset motion** | Kode: token tema, komponen di `features/site`, konfigurasi motion |
| **Tidak berubah** | Model data, booking, POS, auth, RLS, dashboard | — |

Aturan: komponen publik dapat ditukar tanpa menyentuh data layer (ARCHITECTURE §6.1 butir 7). Motion publik harus bisa **dimatikan seluruhnya lewat satu konfigurasi** untuk klien yang tidak menginginkannya. Tidak ada page builder, editor tema, atau pengaturan animasi untuk Owner.

---

## 5. Komponen dasar dan state

`✓` = state wajib tersedia; `—` = tidak relevan.

| Komponen | default | hover | focus | active | disabled | loading | error | empty |
|---|---|---|---|---|---|---|---|---|
| Tombol (primer/sekunder/destruktif) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| Input teks / textarea / select | ✓ | ✓ | ✓ | — | ✓ | — | ✓ | — |
| Checkbox / radio / switch | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | — |
| Pemilih tanggal & waktu (booking) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Pemilih resource | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tabel / daftar data | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| Lencana status (booking/pembayaran) | ✓ | — | — | — | — | — | — | — |
| Kartu | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| Dialog / konfirmasi | ✓ | — | ✓ | — | — | ✓ | ✓ | — |
| Toast / alert / banner | ✓ | — | ✓ | — | — | — | ✓ | — |
| Navigasi (header publik, sidebar admin) | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Filter / paginasi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tampilan uang | ✓ | — | — | — | — | ✓ | ✓ | — |

Aturan khusus:
- **Lencana status** memuat **teks** (dan ikon bila perlu); warna hanya penguat. Himpunan label mengikuti status final di `DATABASE.md` (booking: `pending`, `confirmed`, dan status lain yang ditetapkan di sana; pembayaran: `cash`, `transfer`, `qris`).
- **Tampilan uang** selalu melalui satu formatter bersama (`src/lib`, ARCHITECTURE §6): Rupiah, format Indonesia (mis. `Rp 15.000`). Nilai uang dari server diperlakukan sebagai string/bigint-safe; **tidak ada aritmetika uang final di frontend** (ARCHITECTURE §8.4).
- **Tombol** yang memicu aksi asinkron masuk state `loading`, tidak dapat diklik ganda (mendukung idempotency, DEC-008), dan tetap dapat difokus.

**Komponen bersama MVP (penyederhanaan yang berlaku):** terbatas pada **Button, Form Field, Status Badge, Panel/Card, Dialog, Data List/Table, Feedback (Toast/Alert/Banner)**.
- Font kedua, grafik dekoratif, dan timeline booking visual **ditunda** (§16).
- Alur booking **tiga tahap plus layar hasil** (bukan wizard bercabang).
- Daftar booking/transaksi/katalog menjadi **kartu pada mobile**.
- Laporan memakai **tabel yang dapat digulir di dalam wadahnya**.

## 6. Layout dan navigasi

### 6.1 Situs publik — company-profile landing page

- **Header:** nama bisnis, navigasi utama (Tentang, Layanan/Menu, Ruang/Fasilitas bila aktif, Kontak), **toggle tema**, dan tombol **Booking** yang menonjol sebagai CTA utama. **Footer:** kontak, jam buka, tautan sosial.
- Header sederhana, **tidak menghilang otomatis saat scroll**; boleh mendapat gaya halus (border/bayangan) setelah scroll (§9.4, M5). Tidak ada sticky bottom bar Booking pada MVP.
- **Viewport 320 px:** header tetap utuh (nama bisnis, toggle tema, tombol Booking, menu) tanpa overflow horizontal; navigasi boleh collapse ke menu hamburger, semua fungsi tetap terjangkau.
- Konten dibatasi lebar baca; gambar responsif dengan teks alternatif. Bagian opsional tanpa data **tidak ditampilkan** (tanpa placeholder rusak, AC-WEB-01.4).
- Tujuan konversi per halaman:

| Halaman | Isi | CTA |
|---|---|---|
| Beranda | Hero, ringkasan bisnis, pilihan layanan/produk, fasilitas bila relevan | Booking / Kontak |
| Tentang | Narasi bisnis, jam buka | Booking |
| Layanan/Menu | Kartu item aktif dari katalog (harga sama dengan POS) | Booking |
| Ruang/Fasilitas | Kartu resource yang bisa dipesan | Booking per ruang |
| Booking | Formulir tiga tahap → layar hasil "permintaan diterima" | — |
| Kontak | Alamat, jam buka, telepon/WhatsApp, tautan sosial, peta/tautan bila diisi. **Tidak ada form kontak** (tidak ada di PRD §5.1). | Booking |

- **Alur Booking** (satu kolom di ponsel, ringkas):
  1. **Resource & tanggal** — dibatasi jam operasional dan maksimal 30 hari ke depan.
  2. **Waktu & detail** — waktu mulai pada slot 60 menit, durasi kelipatan 60 menit (maks 4 jam), nama, kontak, jumlah orang, catatan opsional. Waktu ditampilkan dalam zona waktu bisnis (WIB, `Asia/Jakarta`).
  3. **Ringkasan** — ringkasan pilihan, pemberitahuan singkat penggunaan data kontak (AC-BOOK-01.7), lalu kirim.
  4. **Layar hasil** — "Permintaan diterima untuk ditinjau; belum dikonfirmasi. Owner akan menghubungi Anda." (AC-BOOK-01.5). Tidak menampilkan data booking orang lain (AC-BOOK-01.6).
- Pending tidak memblokir slot dan pengunjung tidak dapat membaca booking lain, sehingga UI **tidak menampilkan "slot tersedia"**; salin yang jujur: ketersediaan dipastikan Owner.
- Proteksi spam sederhana (honeypot): kolom disembunyikan dari pengguna **dan** teknologi bantu (`aria-hidden`, di luar urutan tab) agar tidak menjadi jebakan aksesibilitas.

### 6.2 Dashboard Owner — prioritas operasional

Hanya **satu akun Owner**; tidak ada role, Staff, atau navigasi berbasis peran. Route guard hanyalah kenyamanan UX; keamanan tetap di backend (ARCHITECTURE §6.2, §9).

**Dua zona operasional:**

1. **Manajemen & pengawasan** — prioritas *visibility* dan *decision speed*.
   - **Ringkasan:** "Perlu Tindakan" (booking `pending`, ditonjolkan karena tidak ada notifikasi otomatis), "Hari Ini" (transaksi dan penjualan sederhana). Semua *at-a-glance* tanpa scroll.
   - **Booking:** daftar dengan filter tanggal/status/resource; aksi cepat konfirmasi / tolak / batalkan dari baris; detail dengan riwayat status dan kontak pengunjung (tautan telepon/WhatsApp, karena Owner menghubungi secara manual). Konfirmasi yang bentrok menampilkan pesan aman dan dapat ditindaklanjuti (mis. "Slot tidak lagi tersedia untuk ruang ini"), tanpa membocorkan data booking lain.
   - **Resource & jam buka:** CRUD sederhana, status aktif/nonaktif, jam operasional. Aturan slot/buffer/horizon adalah konfigurasi proyek, **bukan** halaman pengaturan.
   - **Katalog:** CRUD produk/layanan, aktif/nonaktif, harga (IDR bilangan bulat), gambar opsional. Sumber tunggal untuk situs publik dan POS.
   - **Profil & Konten:** profil bisnis dan field konten terstruktur, visibilitas section yang diizinkan, media (logo, hero, gambar katalog) dengan batas tipe/ukuran dan teks alternatif. **Simpan = langsung tampil di situs publik** (tidak ada draft/publish pada MVP); beri tahu Owner secara eksplisit.
   - **Laporan:** rentang tanggal (hari ini, minggu ini, bulan ini, kustom); total penjualan, jumlah transaksi, total per metode pembayaran, jumlah booking per status, item terlaris bila disertakan. Tabel yang dapat digulir di dalam wadahnya; **tanpa chart dan tanpa ekspor** pada MVP. Tanggal mengikuti `Asia/Jakarta`.
2. **POS / Kasir** — prioritas *throughput* dan *accuracy* saat antrian.
   - Layout dua panel (katalog kiri, keranjang kanan) pada tablet/desktop; satu panel bertumpuk pada mobile.
   - Target sentuh ≥ 48×48 CSS px; navigasi keyboard penuh; pencarian item.
   - Hanya item **aktif** yang tampil. Total di keranjang berlabel **"Estimasi"**; total resmi berasal dari respons server (DEC-008; ARCHITECTURE §11).
   - Alur: pilih item → ubah kuantitas → pilih metode (Tunai / Transfer / QRIS) → **dialog "Periksa keranjang"** (daftar item, kuantitas, estimasi total, metode; label tombol spesifik, mis. "Selesaikan transaksi") → transaksi tersimpan → hasil dari server (nomor transaksi, total resmi) → tombol "Transaksi baru".
   - **Tidak ada void/refund/edit/hapus.** Dialog periksa keranjang adalah satu-satunya pengaman; UI **tidak** menampilkan tombol edit/hapus yang dinonaktifkan pada transaksi selesai, melainkan keterangan "Transaksi selesai tidak dapat diubah" (PRD §4.3).
   - Gagal jaringan/timeout: pertahankan keranjang, tampilkan "Status transaksi belum pasti" dengan tombol **Coba lagi** yang memakai `client_request_id` yang sama (tidak ada retry otomatis, ARCHITECTURE §7.3). ID sama dengan payload berbeda ditolak server dan ditampilkan sebagai konflik.
   - Item yang menjadi nonaktif saat checkout ditolak server: tampilkan pesan, segarkan katalog, pertahankan sisa keranjang.

**Navigasi & shell:**
- Kerangka: sidebar (desktop) / **menu geser (ponsel)** + area konten + header dengan identitas Owner dan logout.
- Urutan navigasi (usulan, DQ-05): Ringkasan → Booking → Resource → Katalog → Kasir (POS) → Transaksi → Laporan → Profil & Konten.
- Halaman daftar: filter di atas, tabel/daftar, paginasi, state kosong yang menjelaskan langkah berikutnya.
- **Toggle tema** di bagian bawah sidebar (desktop) / menu geser (ponsel), dengan ikon matahari/bulan dan label aksesibel. Penempatan final menunggu keputusan Owner.
- Area dashboard tidak diindeks (ARCHITECTURE §6.2) dan **tidak memakai Lenis maupun animasi GSAP** (§9).

## 7. Perilaku responsif

- **Mobile-first.** Titik henti mengikuti bawaan Tailwind v4 (verifikasi pada versi terpasang saat scaffold): `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem.
- **Viewport verifikasi wajib (10 ukuran tetap):**
  - 320 × 640 · 360 × 800 · 375 × 667 · 390 × 844 (mobile portrait)
  - 667 × 375 (mobile landscape)
  - 768 × 1024 (tablet portrait) · 1024 × 768 (tablet landscape)
  - 1280 × 800 · 1440 × 900 · 1920 × 1080 (desktop)
- **Pemeriksaan tambahan:** (a) zoom browser 200%; (b) reflow setara 400% diuji pada 320 CSS px (zoom 200% **bukan** reflow 400%); (c) di atas 1920 px konten memakai lebar container terbatas.
- Konten tidak boleh memerlukan scroll horizontal pada halaman. Tabel lebar menggulir di dalam wadahnya.
- Formulir, navigasi, dashboard, dan POS tetap dapat digunakan pada semua viewport wajib; uji **kedua tema**.
- Rotasi layar tidak menghilangkan isian booking. Safe-area (`env(safe-area-inset-*)`) diperhitungkan. Gunakan `dvh`/`svh`, bukan `100vh`, bila perlu. Tidak ada fungsi penting yang hanya tersedia lewat hover.

| Breakpoint | Navigasi publik | Sidebar admin | Daftar | POS |
|---|---|---|---|---|
| < `md` (< 768 px) | Hamburger | Menu geser | Kartu | Satu panel |
| `md`–`lg` (768–1024 px) | Terbuka | Sidebar (collapse opsional) | Tabel | Dua panel |
| ≥ `lg` | Terbuka | Sidebar | Tabel | Dua panel |

**Kompatibilitas browser** (Chrome, Firefox, Safari iOS/macOS, Edge) perlu pengujian terpisah dan tidak diklaim pada tahap dokumentasi. Playwright WebKit **bukan** pengganti uji Safari sungguhan.

**Matriks uji (rencana, bukan klaim):** empat layar representatif (Beranda publik, Booking mobile, daftar Booking admin, Kasir POS tablet landscape) diuji penuh pada **10 viewport × 2 tema = 20 kombinasi per layar**; halaman lain memakai sampel prioritas yang dicatat.

### 7.1 Target PageSpeed Insights (MVP)

Target desain, **bukan jaminan**; jangan menyatakan tercapai sebelum diukur.

| Kategori | Target minimal | Perangkat | Halaman |
|---|---|---|---|
| Performance, Accessibility, Best Practices, SEO | ≥ 90 | Mobile dan Desktop | 6 halaman konten publik |

Halaman: `/`, `/tentang`, `/layanan`, `/ruang`, `/booking`, `/kontak`. Rute 404 diuji terpisah: **status HTTP 404 yang benar** (bukan 200 berisi halaman 404) bila didukung konfigurasi hosting Cloudflare Workers Static Assets (ARCHITECTURE §7.1, §15.3), tidak dimaksudkan untuk diindeks, tetap memakai token dan aksesibilitas yang sama.

**Prosedur:** tiga kali ukur per URL dan perangkat, gunakan median; jika target tidak tercapai, perbaiki atau catat pengecualian yang disetujui Owner. Skor lab Lighthouse ≠ data lapangan (CrUX); PSI tidak membuktikan kompatibilitas browser.

**Anggaran performa desain:**
- **Strategi LCP untuk Vite SPA:** konten dimuat dari Supabase setelah JS siap, sehingga LCP bergantung pada data. Utamakan **LCP berupa teks heading** yang tampil begitu data siap; gambar hero memakai dimensi eksplisit dan tidak diberi `opacity: 0` awal; tampilkan skeleton berdimensi tetap saat loading.
- Gambar: `width`/`height` eksplisit, format modern (WebP/AVIF), `loading="lazy"` di bawah lipatan.
- Hindari layout shift akibat font (`font-display: swap`, preload font kritis), tema (inline script), atau skeleton yang tidak berdimensi.
- JavaScript halaman publik minimal; **Lenis dan GSAP dimuat sebagai chunk terpisah setelah paint pertama** dan tidak boleh ikut ke bundle admin (§9.3). Ukur hasil build; jangan mengklaim pemisahan berhasil tanpa memeriksa output build (ARCHITECTURE §6.1 butir 6).
- Bila motion menyebabkan target tidak tercapai, **motion dikurangi lebih dulu** sebelum target diturunkan.

---

## 8. Aksesibilitas

**Target (DQ-07):** WCAG 2.2 level AA. Bagian ini adalah acceptance criteria UI (AC-QUAL-01.2, AC-DESIGN-01.4).

1. **Semantic HTML:** landmark (`header`, `nav`, `main`, `footer`), hierarki heading berurutan, daftar dan tabel semantik, tombol untuk aksi dan tautan untuk navigasi.
2. **Bahasa & judul:** `<html lang="id">`; judul halaman unik per rute; tautan "lompat ke konten utama".
3. **Keyboard:** semua fungsi dapat dioperasikan; urutan fokus logis; tanpa jebakan fokus; dialog memindahkan fokus ke dalam, menutup dengan `Esc`, dan mengembalikan fokus ke pemicu.
4. **Fokus terlihat:** indikator jelas pada semua kontrol; tidak boleh tertutup atau tersembunyi oleh animasi/header lengket.
5. **Label & instruksi:** setiap input punya label terhubung; petunjuk format tidak hanya di *placeholder*.
6. **Error:** teks, dikaitkan ke field, diumumkan ke teknologi bantu; tidak hanya warna. Ringkasan error di atas form panjang.
7. **Kontras:** teks ≥ 4.5:1 (≥ 3:1 untuk teks besar); batas komponen dan fokus ≥ 3:1.
8. **Status dinamis:** hasil aksi asinkron (sukses, gagal, memuat) diumumkan lewat wilayah *live*.
9. **Media:** gambar informatif punya teks alternatif (field alt di CMS); gambar dekoratif ditandai.
10. **Gerak:** hormati `prefers-reduced-motion`; tidak ada kilatan; tidak ada gerak yang diperlukan untuk memahami konten (§9).
11. **Waktu & tanggal:** input dapat dioperasikan dengan keyboard dan menyebut zona waktu bisnis (WIB).
12. **Ukuran target:** kontrol interaktif memenuhi ukuran target minimum WCAG 2.2; POS memakai ≥ 48×48 CSS px.

### 8.1 Verifikasi kontras warna

Semua pasangan harus diverifikasi pada mode terang dan gelap.

| Pasangan (token) | Terang | Gelap | Syarat |
|---|---|---|---|
| `color-text` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | ≥ 4.5:1 |
| `color-text` / `color-surface` | BELUM DIUKUR | BELUM DIUKUR | ≥ 4.5:1 |
| `color-text-muted` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | ≥ 4.5:1 |
| `color-primary` / `color-primary-contrast` | BELUM DIUKUR | BELUM DIUKUR | teks ≥ 4.5:1, batas ≥ 3:1 |
| `color-accent` / `color-accent-contrast` | BELUM DIUKUR | BELUM DIUKUR | teks ≥ 4.5:1, batas ≥ 3:1 |
| `color-border` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | batas input ≥ 3:1 |
| `color-focus-ring` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | ≥ 3:1 |
| `color-success`, `-warning`, `-danger`, `-info` / `color-bg` | BELUM DIUKUR | BELUM DIUKUR | teks ≥ 4.5:1 + ikon/teks |

Pengukuran dilakukan setelah token final (DQ-01) tersedia, memakai pemeriksa kontras dan/atau pemeriksaan otomatis sesuai keputusan DQ-10. Nilai tidak diisi sebelum diukur.

### 8.2 SEO MVP (Vite SPA)

Mengikuti PRD §7 dan ARCHITECTURE §7.2 (DEC-011 masih `Proposed`):
- Judul dan meta description dasar per halaman, URL konsisten, tautan internal, struktur heading yang jelas, halaman 404 yang jelas.
- Area dashboard tidak diindeks.
- **Prerender/SSR, hreflang, dan sitemap multibahasa tidak termasuk MVP.** Jangan menjanjikan SEO teknis lengkap; konten dinamis pada SPA dapat terindeks kurang ideal. Dokumentasikan trade-off ini pada rilis.
- Skor kategori "SEO" PageSpeed ≥ 90 adalah target untuk metadata dasar, bukan bukti SEO dinamis.
- Animasi tidak boleh menyembunyikan teks dari DOM; teks tetap hadir saat dirender (§9.3).

---

## 9. Motion publik: Lenis + GSAP

**Status:** permintaan Owner 2026-10-16. Dependency baru memerlukan persetujuan dan pencatatan di `ARCHITECTURE.md` sebelum dipasang (ARCHITECTURE §5.1; lihat DQ-09). Sampai saat itu, bagian ini adalah **spesifikasi desain**, bukan izin instal.

### 9.1 Tujuan dan batas

- Memberi situs publik rasa premium (scroll halus, reveal terkontrol) **tanpa** mengubah data layer, booking, atau POS, dan tanpa menurunkan aksesibilitas atau performa.
- **Hanya situs publik.** Dashboard Owner dan POS tidak memakai Lenis atau animasi GSAP; prioritasnya kecepatan dan akurasi.
- **Prioritas terendah dalam jadwal.** Motion dikerjakan *setelah* halaman publik statis lulus (Guide §5, §10: pangkas animasi lebih dulu bila waktu meleset). Motion **tidak pernah** mengorbankan RLS, validasi backend, checkout atomik, anti-bentrok, atau tes inti.

### 9.2 Dependency dan lisensi

| Paket | Peran | Lisensi | Aturan |
|---|---|---|---|
| `gsap` | Animasi; modul **core + ScrollTrigger** saja secara default | **GSAP Standard "No Charge" License** (bukan MIT). Terverifikasi 2026-10-16 dari halaman lisensi resmi gsap.com dan halaman paket npm: penggunaan komersial dicakup tanpa biaya, termasuk plugin yang dulu berbayar. Lisensi melarang penggunaan pada alat pembuat animasi visual tanpa kode yang bersaing dengan Webflow; TITIS tidak menyediakan itu (Owner tidak membuat animasi dari CMS, selaras PRD §3.3). | Plugin lain (mis. SplitText) tidak dipakai pada MVP kecuali disetujui. Pin versi di lockfile. Baca ulang teks lisensi aktual sebelum rilis open-source atau sebelum menjual jasa implementasi ke klien (DQ-09). |
| `lenis` | Smooth scroll | **BELUM TERVERIFIKASI** pada revisi ini | Gunakan paket bernama `lenis` (paket lama `@studio-freight/lenis` bukan target). Cek berkas LICENSE di repositori resmi saat instal dan catat atribusi. |

- `@gsap/react` (hook `useGSAP`) **tidak dipakai secara default**; gunakan `gsap.context()` dan `gsap.matchMedia()` langsung agar tidak menambah dependency.
- Versi paket diperiksa terhadap dokumentasi resmi saat instal dan dikunci di `package-lock.json`; jangan mengandalkan versi dari ingatan model AI (Guide §4).
- Hasil yang dicatat sebelum merge: ukuran chunk publik sebelum/sesudah, lisensi, dan hasil uji (§14).

### 9.3 Aturan wajib

1. **Konten tidak bergantung pada animasi.** Teks, tautan, dan form tetap hadir di DOM dan dapat dibaca tanpa JS, dengan pencarian di halaman, dan saat dicetak. Tidak ada teks yang baru dibuat oleh animasi.
2. **Elemen di atas lipatan (termasuk elemen LCP) tidak pernah disembunyikan** (`opacity: 0`) saat load. Hanya elemen sekunder yang boleh bergeser halus. Keadaan awal "tersembunyi" hanya diterapkan pada elemen **di bawah lipatan**, sebelum paint, oleh JS setelah mount; bila JS gagal, konten tetap terlihat.
3. **`prefers-reduced-motion: reduce`:** Lenis **tidak diinisialisasi**; semua elemen langsung berada pada keadaan akhir; tanpa parallax dan ScrollTrigger *scrub*. Gunakan `gsap.matchMedia()` sehingga perubahan preferensi saat berjalan ikut dihormati.
4. **Hanya `transform` dan `opacity`.** Jangan menganimasikan properti layout (`width`, `height`, `top`, `left`, margin). Jangan memasang `will-change` permanen.
5. **Tidak ada scroll-jacking.** Tidak ada pinned section yang menahan scroll, scroll horizontal yang dibajak, snap paksa, atau pengubahan perilaku scrollbar. Lenis hanya menghaluskan scroll roda; sentuhan tetap native.
6. **Keyboard dan fokus:** indikator fokus tidak tertutup animasi; tautan lompat dan jangkar tetap berfungsi; elemen yang sedang di-*reveal* harus terlihat saat menerima fokus lewat Tab (uji manual).
7. **Dialog dan menu:** saat menu mobile atau dialog terbuka, hentikan scroll Lenis (`lenis.stop()`) dan lanjutkan saat tertutup; kontainer yang dapat digulir sendiri memakai `data-lenis-prevent`.
8. **Routing (React Router) dan konten dinamis:** scroll kembali ke atas pada navigasi; **segarkan ScrollTrigger setelah konten dari TanStack Query dirender dan gambar/font siap** (tinggi halaman berubah setelah data tiba); bersihkan seluruh trigger dan ticker saat unmount (`gsap.context().revert()`, `lenis.destroy()`).
9. **Bundle:** `gsap` dan `lenis` dimuat lewat dynamic import dari layout publik setelah paint pertama; **tidak diimpor oleh kode admin**. Periksa output build sebelum menyatakan terpisah.
10. **Halaman konversi stabil:** `/booking` dan area form **tanpa** animasi scroll pada field; hanya reveal judul halaman (bila ada). Error validasi tidak dianimasikan secara bergerak.
11. **Satu saklar:** seluruh motion dapat dimatikan melalui satu konfigurasi (§4.5).

**Pola integrasi referensi** (dari dokumentasi resmi Lenis; sesuaikan dan uji saat implementasi, lokasi file usulan `src/features/site/`):

```ts
// MotionProvider (hanya di layout publik, dimuat lazy)
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
const tick = (time: number) => lenis.raf(time * 1000);
gsap.ticker.add(tick);
gsap.ticker.lagSmoothing(0);

// cleanup saat unmount
gsap.ticker.remove(tick);
lenis.destroy();
```

### 9.4 Katalog preset motion

Himpunan **tertutup**; preset baru memerlukan perubahan dokumen ini.

| ID | Preset | Perilaku | Batas |
|---|---|---|---|
| M1 | `reveal` | Fade + geser ke atas ~16 px saat masuk viewport, sekali saja | Judul section, paragraf, kartu di bawah lipatan |
| M2 | `stagger` | Anak grid/daftar muncul berurutan (jeda ~0.06–0.1 s) | Maksimum ±8 elemen per batch; kartu layanan/ruang |
| M3 | `hero-intro` | Elemen sekunder hero (sub-judul, CTA) bergeser halus saat load | Headline dan gambar LCP **tidak** disembunyikan; tanpa preloader |
| M4 | `parallax-soft` | Gambar hero/section bergeser ±~6% mengikuti scroll (*scrub*) | Hanya `lg` ke atas dan tanpa reduced-motion; wadah `overflow: hidden`; tanpa CLS |
| M5 | `header-state` | Header mendapat border/bayangan halus setelah scroll | Header tidak hilang; boleh tanpa GSAP (kelas CSS) |

Durasi dan easing memakai token §4.3 (DQ-04).

**Matriks per halaman:**

| Halaman | Preset |
|---|---|
| Beranda | M1, M2, M3, M4, M5 |
| Tentang | M1, M3 (ringan), M5 |
| Layanan/Menu | M1, M2, M5 |
| Ruang/Fasilitas | M1, M2, M5 |
| Booking | M5 saja (+ reveal judul) |
| Kontak | M1, M5 |
| 404 | Tidak ada |

**Tidak dikerjakan pada MVP:** transisi antar-halaman, pinned/scrub storytelling, tipografi kinetik (split text), kursor kustom, tombol magnetik, marquee tak berujung, WebGL/3D, layar loading/preloader, dan animasi apa pun di dashboard/POS.

### 9.5 Posisi dalam timeline

Motion berada setelah template publik usable (akhir Minggu 2 hingga celah Minggu 4 pada Guide §5) dan **menjadi item pertama yang dipangkas** (Guide §10 butir 1). Minimal yang harus ada lebih dulu: halaman publik statis lengkap, state loading/empty/error, kedua tema, dan lolos pemeriksaan §7.

---

## 10. State UI standar

Setiap alur data menyediakan state berikut (AC-QUAL-01.1; ARCHITECTURE §7.4).

| State | Perilaku |
|---|---|
| **Loading** | Skeleton/spinner dengan pengumuman aksesibel; dimensi tetap agar tidak menggeser tata letak. |
| **Empty** | Menjelaskan kosongnya dan langkah berikutnya (mis. "Belum ada booking."). |
| **Validation error** | Pesan per field + ringkasan; isian pengguna dipertahankan. |
| **Permission denied** | Pesan "tidak memiliki izin" tanpa membocorkan data; arahan ke langkah yang tepat. |
| **Network/server error** | Pesan yang dapat ditindaklanjuti + tombol coba lagi; tanpa detail teknis atau secret. |
| **Success** | Konfirmasi tegas yang membedakan "diterima" vs "dikonfirmasi"/"tersimpan". |
| **Sesi berakhir** | Arahkan ke login tanpa menampilkan data admin; bersihkan cache admin saat logout (ARCHITECTURE §7.3). |

## 11. Form, umpan balik, dan aksi permanen

- Validasi membantu: tampil saat field selesai diisi atau saat kirim; tidak membanjiri saat mengetik. Validasi klien hanya untuk UX; server tetap menegakkan aturan (DEC-003).
- Setelah kirim gagal, fokus pindah ke error pertama. Tombol kirim masuk `loading` dan mencegah kirim ganda.
- **Aksi permanen** (konfirmasi/penolakan/pembatalan booking, checkout POS) memakai dialog yang menyebut objek dan akibatnya, memakai label tombol spesifik (bukan "OK"), dan menaruh fokus awal pada tindakan aman (Batal).
  - **Konfirmasi booking:** sebut bahwa waktu tersebut akan **memblokir** resource untuk booking lain.
  - **Penolakan/pembatalan booking:** apakah perlu kolom alasan menunggu `DATABASE.md` (DQ-11); jangan menambah field tanpa keputusan.
  - **Checkout:** dialog "Periksa keranjang" (§6.2); jelaskan bahwa transaksi selesai tidak dapat diubah atau dihapus.
- Pesan bentrok jadwal menjelaskan penyebab dan langkah berikutnya (pilih waktu/ruang lain).

## 12. Konten dan format

- **Bahasa antarmuka MVP: Bahasa Indonesia** (PRD §7). Multi-bahasa *Deferred* (DQ-08).
- Disarankan memusatkan teks UI di satu tempat sederhana (tanpa library i18n) agar penambahan bahasa kelak tidak menuntut penulisan ulang komponen.
- Format: Rupiah (IDR), format angka dan tanggal Indonesia, zona waktu bisnis `Asia/Jakarta` (WIB), satu formatter bersama. Format tidak ditentukan oleh preferensi browser.
- Nada tulisan: sederhana, sopan, tidak teknis; pesan error tidak menyalahkan pengguna.
- Konten CMS adalah teks terstruktur; **tidak dirender sebagai HTML bebas** (AC-WEB-01.6; ARCHITECTURE §8.2). Gambar memiliki teks alternatif.

---

## 13. Inventaris halaman dan fungsi

Setiap baris adalah kontrak desain: state yang bertanda `✓` wajib diimplementasikan dan diuji. Diverifikasi terhadap PRD §5 dan ARCHITECTURE §7.1.

**Ringkasan:** 7 rute publik (6 konten + 404); 9 area dashboard (Login, Ringkasan, Booking, Resource & jam buka, Katalog, POS, Transaksi, Laporan, Profil & Konten) ditambah 2 layar detail di dalam area (detail Booking, detail Transaksi). Rute dashboard di bawah adalah **usulan**; URL final dikunci saat implementasi routing (ARCHITECTURE §7.1).

| Area | Rute / modul | Deskripsi | Loading | Empty | Error | Success | Perm. denied | Network |
|---|---|---|---|---|---|---|---|---|
| Publik | `/` Beranda | Hero, ringkasan, layanan/ruang, CTA | ✓ | bagian disembunyikan | ✓ | — | — | ✓ |
| Publik | `/tentang` | Narasi, jam buka | ✓ | — | ✓ | — | — | ✓ |
| Publik | `/layanan` | Kartu item aktif + harga | ✓ | ✓ "Belum ada layanan" | ✓ | — | — | ✓ |
| Publik | `/ruang` | Kartu resource; boleh disembunyikan | ✓ | ✓ "Belum ada ruang" | ✓ | — | — | ✓ |
| Publik | `/booking` | Form 3 tahap → hasil | ✓ | — | ✓ | ✓ "Permintaan diterima" | — | ✓ |
| Publik | `/kontak` | Alamat, jam, telepon/WA, sosial, peta/tautan | ✓ | bagian disembunyikan | ✓ | — | — | ✓ |
| Publik | `*` (404) | Pesan + tautan Beranda/Booking | — | — | ✓ | — | — | — |
| Admin | `/admin/login` | Login Owner; pesan generik; tanpa signup | ✓ | — | ✓ | — | — | ✓ |
| Admin | `/admin` Ringkasan | Booking pending, transaksi hari ini, penjualan | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Admin | `/admin/booking` | Daftar + filter; konfirmasi/tolak/batalkan | ✓ | ✓ "Belum ada booking" | ✓ | ✓ | ✓ | ✓ |
| Admin | `/admin/booking/:id` (detail) | Detail, riwayat status, kontak, aksi | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| Admin | `/admin/resource` | CRUD resource + jam operasional | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Admin | `/admin/katalog` | CRUD produk/layanan, aktif/nonaktif | ✓ | ✓ "Belum ada item" | ✓ | ✓ | ✓ | ✓ |
| Admin | `/admin/pos` | Katalog + keranjang + periksa keranjang + checkout | ✓ | ✓ keranjang kosong | ✓ | ✓ | ✓ | ✓ |
| Admin | `/admin/transaksi` (+ detail) | Daftar, detail item snapshot, metode; tanpa edit/hapus | ✓ | ✓ "Belum ada transaksi" | ✓ | — | ✓ | ✓ |
| Admin | `/admin/laporan` | Filter tanggal; metrik dasar; tabel | ✓ | ✓ "Tidak ada data pada rentang ini" | ✓ | — | ✓ | ✓ |
| Admin | `/admin/konten` Profil & Konten | Profil bisnis, field konten, media | ✓ | ✓ | ✓ | ✓ "Tersimpan dan tampil" | ✓ | ✓ |

Legenda: `error` = validasi field + ringkasan, isian dipertahankan; `perm. denied` = pesan tanpa bocor data; `network` = pesan dapat ditindaklanjuti + coba lagi. Pemetaan state ke kasus uji di `TESTING.md` **belum diverifikasi** (dokumen tidak diperiksa pada revisi ini).

---

## 14. Verifikasi visual dan penggunaan skill agent

### 14.1 Peran skill

Empat skill membantu agent mengerjakan UI. Ringkasan peran di bawah adalah **penafsiran awal berdasarkan tujuan umum masing-masing**; periksa isi `SKILL.md` setiap skill saat dipasang.

| Skill | Dipakai untuk | Batas |
|---|---|---|
| **Frontend Design** | Komposisi, hierarki visual, dan kerapian halaman publik | Tidak boleh mengganti font, palet, atau identitas §4 |
| **UI/UX Pro Max** | Heuristik UX dan daftar periksa sebelum penyerahan (state, target sentuh, kontras, interaksi) | Rekomendasi palet, font, atau gaya diperlakukan sebagai **usulan**, bukan keputusan; tidak mengubah §4 |
| **UI Skills** | Aturan konstruksi UI saat agent menulis komponen | Bila bertentangan dengan dokumen ini, dokumen ini menang |
| **Playwright (verifikasi visual)** | Bukti visual dan perilaku hasil implementasi (§14.3) | Bukti pendukung, bukan persetujuan desain |

### 14.2 Aturan penggunaan

1. `DESIGN.md` mengalahkan output skill. Saran skill yang menambah font, palet, library, atau fitur di luar scope **ditolak** kecuali ada keputusan Owner dan pencatatan di dokumen sumber kebenaran terkait.
2. Skill bukan dependency aplikasi, tetapi **Playwright adalah dev dependency** dan perlu persetujuan (ARCHITECTURE §5.1) serta pembaruan DEC-013, yang saat ini hanya mewajibkan Vitest/RTL dan tes database dan menyatakan tooling E2E tambahan tidak boleh menghambat inti MVP (DQ-10).
3. Satu agent menjadi penulis aktif pada satu waktu; skill lain dipakai sebagai peninjau read-only (Guide §9.2). Jangan meminta agent membangun seluruh situs sekaligus.
4. Setiap task UI mencatat di `TASK.md`: bagian dokumen ini yang menjadi acuan, skill yang dipakai, dan bukti verifikasi aktual (Guide §9.4).
5. Dilarang menonaktifkan atau menghapus tes agar hasil terlihat hijau; laporkan command dan hasil aktual, bedakan lulus, gagal, dan belum dijalankan.

### 14.3 Urutan kerja per task UI

1. Baca bagian terkait di `DESIGN.md`, `TASK.md`, dan `AGENTS.md`.
2. Implementasikan dengan Frontend Design dan UI Skills, memakai token §4 dan komponen §5.
3. Tinjau dengan UI/UX Pro Max sebagai daftar periksa (bukan sumber token baru).
4. Verifikasi dengan Playwright (§14.4).
5. Laporkan bukti; perbarui `TASK.md`; commit setelah review.

### 14.4 Verifikasi visual dengan Playwright

**Yang diperiksa (rencana, bukan klaim):**
- Tangkapan layar pada viewport §7 × tema terang/gelap untuk empat layar representatif (§15.1); layar lain sesuai sampel prioritas.
- **Tidak ada scroll horizontal** pada halaman (lebar scroll ≤ lebar klien) di semua viewport.
- **Tidak ada error/peringatan konsol** saat memuat dan menavigasi.
- **Dua lintasan:** (a) emulasi `reducedMotion: 'reduce'` untuk *baseline* yang deterministik (keadaan akhir, tanpa Lenis); (b) lintasan dengan motion untuk memeriksa bahwa reveal bekerja, header tidak menghilang, dan tidak ada elemen yang tetap tersembunyi setelah scroll penuh.
- Navigasi keyboard pada alur Booking dan menu/dialog: fokus terlihat, `Esc` menutup dialog, scroll Lenis berhenti saat dialog terbuka.
- Rute 404: periksa status HTTP aktual pada deployment preview.

**Aturan:**
- Halaman admin diuji hanya dengan **akun Owner uji pada Supabase lokal/staging** dan data sintetis; **jangan memakai kredensial atau data production** (Guide §8). Kredensial uji tidak masuk Git.
- Tangkapan layar adalah **bukti pendukung**; persetujuan visual tetap oleh Owner (§15.2). Simpan hanya baseline yang disetujui di repositori; artefak lain (usulan: `docs/design/verification/`) boleh diabaikan Git.
- Playwright WebKit bukan Safari sungguhan; pemeriksaan otomatis aksesibilitas (mis. axe) adalah dependency terpisah dan mengikuti DQ-10.
- Hasil Playwright bukan skor PageSpeed dan bukan bukti kepatuhan WCAG penuh; keduanya diukur terpisah (§7.1, §8).

---

## 15. Rencana mockup

### 15.1 Empat layar representatif

Sebelum implementasi UI dimulai, empat layar berikut dirancang dan disetujui sebagai representasi design system, dalam **mode terang dan gelap**, dengan token Portfolio. Bahasa tunggal (Indonesia), sehingga tidak ada varian per bahasa.

| # | Layar | Area | Alasan | Viewport mockup | Varian |
|---|---|---|---|---|---|
| 1 | **Beranda Publik** (`/`) | Publik | Landing paling sering diakses: header, hero, footer, toggle tema, titik motion | 320×640, 1440×900 | 4 |
| 2 | **Booking Publik** (`/booking`) | Publik | Alur kritis: form 3 tahap, validasi, state loading/error/hasil | 320×640 | 2 |
| 3 | **Dashboard Owner — Ringkasan** (`/admin`) | Admin | Titik masuk harian: sidebar, header, booking pending, ringkasan | 1440×900, 375×667 | 4 |
| 4 | **Kasir / POS** (`/admin/pos`) | Admin | Alur transaksi: dua panel, keranjang, periksa keranjang, hasil | 1024×768 | 2 |

**Total: 12 varian.** Booking admin (daftar) adalah target QA tambahan, bukan pengganti layar representatif. Stitch hanya untuk komposisi layar yang belum ada di Portfolio, dengan token yang sama.

### 15.2 Mockup vs QA

| Aspek | Mockup (persetujuan visual) | QA / verifikasi |
|---|---|---|
| Tujuan | Owner menyetujui visual dan komposisi | Bukti responsif, aksesibilitas, performa, fungsi |
| Viewport | Sesuai tabel §15.1 | **10 viewport × 2 tema** (+ pemeriksaan tambahan §7) |
| Cakupan | 4 layar | 7 rute publik + 9 area dashboard (§13); 4 layar representatif diuji penuh |
| Alat | Figma/Stitch → `docs/design/references/` | Playwright (§14.4), PageSpeed Insights, uji manual keyboard dan browser |
| Lolos jika | Owner menyetujui dan mencatat di §3 | Kriteria §7.1 dan §8 terpenuhi dengan bukti aktual |

**Mockup disetujui ≠ halaman siap produksi.** Ini rencana pengujian, bukan klaim bahwa tes telah dijalankan.

### 15.3 Mockup layar MVP lainnya

Dirancang setelah layar representatif disetujui dan sebelum rilis, dengan pola dan token yang sama (varian minimum: 2 viewport × 2 tema).

| Prioritas | Layar | Jenis |
|---|---|---|
| Tinggi | Tentang, Layanan/Menu, Ruang/Fasilitas, Kontak, 404 | Halaman MVP publik |
| Tinggi | Booking Publik — layar hasil | State dari alur `/booking` |
| Tinggi | Login Owner, daftar & detail Booking, Resource, Katalog, Transaksi (daftar & detail), Laporan, Profil & Konten | Area/layar dashboard MVP |
| Sedang | Pola state kosong semua daftar | Pola state |

Jangan melabeli layar MVP sebagai fitur pasca-MVP hanya karena mockup-nya belum dibuat.

---

## 16. Ditunda atau di luar MVP

Tidak dikerjakan kecuali PRD diubah secara eksplisit (PRD §10; Guide §10).

| Item | Alasan | Referensi |
|---|---|---|
| Akun Staff/Manager, navigasi berbasis peran | Satu Owner pada MVP | PRD §4.2 |
| Void/refund/koreksi transaksi, DP/pelunasan | Deferred; transaksi selesai tidak dapat diubah | PRD §4.2 |
| Metode pembayaran selain tunai/transfer/QRIS (kartu, e-wallet) | Hanya pencatatan manual | PRD §6.3 |
| Pemindaian barcode, cetak struk/print stylesheet | Bukan bagian MVP; hardware dan print | PRD §4.1 |
| Ekspor CSV laporan, chart/visualisasi laporan | MVP: tabel saja | PRD §6.4 |
| Notifikasi dan preferensi notifikasi; jadwal ulang/pembatalan mandiri pengunjung | Deferred | PRD §4.2 |
| Form kontak, halaman Pengaturan/akun | Tidak ada di PRD | PRD §5 |
| Multi-bahasa (EN/ID), pemilih bahasa, SEO multibahasa (hreflang/sitemap variasi) | Deferred; Bahasa Indonesia saja | PRD §4.2, §7 |
| Prerender/SSR dan SEO teknis lanjutan | Deferred | PRD §7; ARCHITECTURE §7.2 |
| Draft/publish dan pratinjau konten | Perubahan tersimpan langsung berlaku | PRD §4.2 |
| Page builder, editor tema/animasi untuk Owner | Out of scope | PRD §3.3 |
| Font kedua, grafik dekoratif, timeline booking visual, wizard bercabang | Menambah kompleksitas | §5 |
| Sticky bottom bar Booking di mobile | Header sudah memuat CTA | §6.1 |
| Transisi antar-halaman, pinned/scrub storytelling, kursor kustom, WebGL, preloader | Di luar katalog motion | §9.4 |
| Animasi di dashboard/POS | Dashboard mengutamakan kecepatan | §9.1 |
| PWA/offline | Out of scope | PRD §4.2 |

---

## 17. Pertanyaan desain terbuka

| ID | Pertanyaan | Status | Keputusan / catatan | Dibutuhkan sebelum |
|---|---|---|---|---|
| DQ-01 | Palet warna final (nilai token) | Open | — | Referensi Portfolio disetujui |
| DQ-02 | Mode gelap masuk MVP? | **Decided** | **Masuk MVP** (2026-10-11). Dampak: QA ×2 tema. Bila waktu meleset, ajukan perubahan scope eksplisit; jangan dipangkas diam-diam. | Mockup |
| DQ-03 | Skala tipografi dan lisensi JetBrains Mono | Skala **Open**; font family **Decided**; lisensi **Verified** | Lisensi SIL OFL 1.1 terverifikasi 2026-10-16 dari repositori resmi (§4.2). Skala menunggu referensi Portfolio. | Referensi Portfolio disetujui |
| DQ-04 | Skala spasi, radius, border, elevasi, gerak (+ nilai token motion §9.4) | Open | — | Referensi Portfolio disetujui |
| DQ-05 | Urutan akhir navigasi admin dan isi Ringkasan | Open | Usulan: §6.2 | Gate Phase 0 |
| DQ-06 | Viewport uji responsif | **Decided** | 10 ukuran tetap + 3 pemeriksaan tambahan (§7). Belum diverifikasi via tes. | Scaffold |
| DQ-07 | Target aksesibilitas | **Target decided: WCAG 2.2 AA** | Konformansi belum diverifikasi. Alat otomatis mengikuti DQ-10. | Tes aksesibilitas |
| DQ-08 | Bahasa antarmuka | **Superseded** | Keputusan lama (EN utama + ID, 2026-10-11) digantikan PRD rev. 2026-10-15: **Bahasa Indonesia saja; multi-bahasa Deferred.** Bila Owner tetap menginginkan EN/ID di MVP: revisi PRD §4.2/§7, catat dampak waktu (Guide §10), dan kembalikan bagian pemilih bahasa + SEO multibahasa. | Persetujuan PRD |
| DQ-09 | Persetujuan dependency **Lenis + GSAP** | **Open** | Niat Owner 2026-10-16. Perlu: pencatatan di `ARCHITECTURE.md`, verifikasi lisensi Lenis, baca ulang lisensi GSAP terkait penjualan jasa ke klien, ukuran bundle, pin versi. | Sebelum `npm install` |
| DQ-10 | Playwright (dev dependency) dan, opsional, axe untuk verifikasi visual/aksesibilitas | **Open** | Memperbarui DEC-013 (`Proposed`). Tidak boleh menghambat inti MVP. | Setup testing |
| DQ-11 | Penolakan/pembatalan booking: perlu alasan? | Open | Bergantung `DATABASE.md`; PRD tidak mewajibkan. | Dashboard booking |
| DQ-12 | Peta di halaman Kontak | Open | Usulan: **tautan eksternal** (tanpa embed pihak ketiga, demi performa dan CSP). PRD mengizinkan "peta/tautan eksternal bila diisi". | Halaman Kontak |

---

## 18. Checklist review dokumen

Status header diubah menjadi **READY FOR OWNER REVIEW** hanya setelah semua butir ✓.

| # | Pemeriksaan | Status | Bukti / catatan |
|---|---|---|---|
| 1 | Konsisten dengan `PRD.md` rev. 2026-10-15 (rute publik, area dashboard, aturan booking, POS lunas, bahasa) | ✓ | Dibandingkan saat revisi 2026-10-16: PRD §3–§7 |
| 2 | Konsisten dengan `ARCHITECTURE.md` rev. 2026-10-15 (stack, routing, DEC, dependency minimal) | ✓ | Dibandingkan saat revisi: ARCHITECTURE §4–§7, §11 |
| 3 | Konsisten dengan `TITIS_MASTER_BUILD_GUIDE_FINAL.md` rev. 2026-10-15 (timeline, urutan pemangkasan, workflow agent) | ✓ | Dibandingkan saat revisi: Guide §5, §9, §10 |
| 4 | Referensi ke `SECURITY.md`, `DATABASE.md`, `TESTING.md`, `TASK.md`, `AGENTS.md` dicek | ☐ | Dokumen tidak tersedia pada revisi ini |
| 5 | Lisensi font diverifikasi dari sumber resmi | ✓ | Repositori resmi JetBrains Mono, 2026-10-16 (§4.2) |
| 6 | Lisensi GSAP diverifikasi | ✓ (sebagian) | Halaman lisensi resmi + npm, 2026-10-16; pembacaan ulang untuk jasa ke klien masih di DQ-09 |
| 7 | Lisensi Lenis diverifikasi | ☐ | Belum; DQ-09 |
| 8 | Persetujuan Owner atas Lenis + GSAP dicatat di `ARCHITECTURE.md` | ☐ | DQ-09 |
| 9 | Persetujuan Owner atas Playwright dicatat dan DEC-013 diperbarui | ☐ | DQ-10 |
| 10 | Keputusan bahasa (DQ-08) dikonfirmasi Owner | ☐ | Bertentangan dengan keputusan lama; perlu konfirmasi |
| 11 | Isi `SKILL.md` keempat skill diperiksa terhadap §14.1 | ☐ | Dilakukan saat skill dipasang |
| 12 | `git diff --check` dan `git diff --stat -- DESIGN.md` hanya menunjukkan DESIGN.md untuk perubahan ini | ☐ | Jalankan di repositori; jangan diklaim tanpa bukti |
| 13 | Nilai token final (DQ-01, DQ-03 skala, DQ-04) diisi dari Portfolio yang disetujui | ☐ | Menunggu referensi Portfolio |
