# ARCHITECTURE — TITIS

> **Status:** Draft Phase 0 — disejajarkan dengan `PRD.md` dan `TITIS_MASTER_BUILD_GUIDE_FINAL.md` revisi 2026-10-15. Keputusan yang ditandai `Proposed` masih memerlukan persetujuan pemilik proyek sebelum task implementasi terkait dimulai.
> **Sumber kebenaran:** struktur aplikasi, aliran data, modul, routing, integrasi, batas frontend/server, dan keputusan library.
> **Bukan sumber kebenaran untuk:** product scope/acceptance criteria (`PRD.md`), schema yang benar-benar diterapkan (migration files), penjelasan domain database (`DATABASE.md`), security policy/threat model (`SECURITY.md`), desain visual (`DESIGN.md`), dan status task (`TASK.md`).
> **Revisi:** 2026-10-15 — scope diselaraskan dengan MVP satu bulan: company profile fleksibel, booking anti-bentrok, POS lunas, dan satu akun Owner.

---

## 1. Tujuan dan aturan penggunaan

1. Dokumen ini menerangkan **bagaimana** TITIS disusun; `PRD.md` menerangkan **apa** yang harus produk lakukan.
2. Sebelum coding pada area yang terkait keputusan `Proposed`/`Open`, minta persetujuan pemilik proyek atau catat penundaan secara eksplisit di dokumen sumber kebenaran.
3. Versi library harus diperiksa terhadap dokumentasi resmi saat scaffold, lalu dipin dengan `package-lock.json`. Versi yang disebut di sini adalah baseline, bukan pengganti verifikasi kompatibilitas.
4. Perubahan schema harus melalui migration file dalam Git. Jangan mengubah schema production secara manual tanpa migration yang sesuai dan proses rilis yang disetujui.
5. Jangan memperbesar scope lewat pilihan arsitektur. Bila opsi menambah kompleksitas (dependency, layanan, atau pekerjaan operasional), jelaskan manfaat, risiko, biaya, dan alternatif minimum sebelum meminta persetujuan.
6. ID task hanya ditetapkan di `TASK.md`. Jangan membuat ID task baru dalam dokumen ini.

### 1.1 Urutan sumber kebenaran

Jika dokumen bertentangan:

1. Persyaratan produk dan batas MVP mengikuti `PRD.md` yang disetujui.
2. Aliran aplikasi dan pilihan teknologi mengikuti `ARCHITECTURE.md` yang disetujui.
3. Schema aktif selalu ditentukan migration SQL yang dieksekusi, bukan deskripsi Markdown.
4. Permission dan batas akses perlu cocok antara `SECURITY.md`, migrations, function/grants, serta tes.
5. `TITIS_MASTER_BUILD_GUIDE_FINAL.md` menentukan urutan fase dan gate; `TASK.md` menentukan task aktual.

Jika ketidaksesuaian memengaruhi data, security, perilaku bisnis, atau waktu MVP, hentikan implementasi yang terkait sampai konflik diselesaikan.

---

## 2. Batas arsitektur produk

### 2.1 Scope yang memengaruhi desain

TITIS MVP adalah satu instalasi untuk satu bisnis lokal. Area utamanya:

- **Website publik:** template company profile, halaman konten, katalog aktif, fasilitas bila relevan, kontak, serta form permintaan booking.
- **Dashboard Owner:** edit konten, kelola katalog dan resource, putuskan booking, jalankan POS, dan lihat laporan dasar.
- **Backend:** satu proyek Supabase untuk Auth, PostgreSQL, RLS, migrations, dan Storage bila dibutuhkan. Supabase Edge Function dipakai hanya untuk jalur publik yang membutuhkannya.

MVP hanya mempunyai **satu akun Owner**. Tidak ada akun Staff, permission matrix, signup publik, multi-tenant SaaS, payment gateway, DP/pelunasan, refund/void, inventaris stok, POS offline, page builder drag-and-drop, atau analitik lanjutan.

### 2.2 Company profile: template dan custom UI/UX

TITIS menyediakan satu template dasar yang layak digunakan dan struktur kode yang memungkinkan developer menyesuaikan desain publik untuk kebutuhan klien.

- **Konten:** Owner mengubah informasi bisnis, teks, gambar yang disediakan, dan data katalog melalui dashboard.
- **Presentasi:** developer dapat mengganti layout, susunan section, komponen, warna, tipografi, spacing, dan elemen visual melalui kode serta design tokens.
- **Data/backend:** mode template dan mode custom tetap memakai CMS, katalog, booking, POS, Auth, dan database yang sama.
- **Batas:** tidak ada page builder visual, editor HTML/CSS bebas, sistem tema universal yang dapat diubah sembarang oleh Owner, atau script yang dapat dijalankan dari CMS.

Penyesuaian desain per klien merupakan pekerjaan implementasi yang perlu disepakati serta diperkirakan terpisah. Jangan mengubahnya menjadi kewajiban membuat editor visual di dashboard.

---

## 3. Prinsip arsitektur

1. **Frontend untuk UI dan pengalaman pengguna.** Frontend tidak menyimpan secret dan tidak menjadi satu-satunya penjaga aturan bisnis penting.
2. **Validasi tepercaya.** Permission, status booking, ketersediaan resource, harga, total checkout, serta idempotency ditegakkan di database/server.
3. **RLS dan grants ditinjau bersama.** RLS tidak menggantikan pemeriksaan privilege untuk view, RPC, function, dan Edge Function.
4. **Operasi checkout atomik.** Header order, item, dan catatan pembayaran harus tersimpan seluruhnya atau tidak tersimpan sama sekali.
5. **Anti-bentrok di database.** Pemeriksaan jadwal di UI hanya untuk pengalaman pengguna; constraint database menjadi penjaga akhir saat permintaan bersamaan.
6. **Satu sumber data katalog.** Produk/layanan publik dan POS memakai katalog yang sama; jangan menyimpan harga duplikat di CMS.
7. **Perubahan konten tidak memerlukan edit kode.** Perubahan layout kompleks dapat memerlukan developer.
8. **Dependency minimal.** Jangan menambah library atau layanan tanpa kebutuhan tertulis, alasan, dan persetujuan.
9. **Migration sebagai schema source of truth.** Semua perubahan schema, constraint, index, RLS, dan function dicatat dalam migrations.
10. **Error eksplisit dan aman.** Loading, empty, invalid input, permission denied, kegagalan jaringan, dan retry memiliki perilaku yang jelas. Log tidak berisi secret atau data pribadi yang tidak diperlukan.
11. **Tes harus nyata.** Jangan menyatakan tes lulus sebelum command atau pemeriksaan benar-benar dijalankan.

---

## 4. Register keputusan arsitektur

Status keputusan mengikuti konvensi: `Proposed` = diajukan tetapi belum disetujui; `Open` = belum ada opsi yang cukup; `Accepted` = disetujui; `Rejected` = ditolak; `Superseded` = digantikan keputusan lain. Keputusan yang berubah dari arsitektur lama kembali ditandai `Proposed` sampai selaras dengan baseline PRD revisi disetujui.

| ID | Topik | Status saat revisi | Ringkasan | Gate terkait |
|---|---|---|---|---|
| DEC-001 | Frontend Vite + React + TypeScript | Accepted | SPA; versi paket dikunci saat scaffold | Scaffold |
| DEC-002 | Routing | Accepted* | React Router v7; tidak mewajibkan prerender/SSR | Routing |
| DEC-003 | Form validation | Accepted | Native HTML + Valibot; validasi server tetap wajib | Forms |
| DEC-004 | Styling | Accepted | Tailwind CSS v4 + design tokens | Design system |
| DEC-005 | Server state | Accepted | TanStack Query; aturan cache/error di §7 | Data fetching |
| DEC-006 | Public booking write path | Proposed | Jalur publik terbatas melalui Edge Function dan operasi database internal; tidak memberi akses write luas ke `anon` | Sebelum booking |
| DEC-007 | Booking anti-bentrok | Accepted* | PostgreSQL exclusion constraint untuk booking confirmed; detail buffer diverifikasi bersama schema dan tes | Sebelum booking |
| DEC-008 | Atomic checkout + idempotency | Accepted | Satu operasi terpercaya untuk order, items, payment | Sebelum POS |
| DEC-009 | Representasi uang | Proposed | Menggantikan model generik multi-currency/discount lama: IDR, integer rupiah (`bigint`/string di TypeScript); tanpa diskon/pajak/pembulatan khusus | Sebelum schema POS |
| DEC-010 | Database TypeScript types | Accepted | Generate dari schema/migrations, bukan ketik manual | Scaffold + schema changes |
| DEC-011 | SEO publik | Proposed | Menggantikan keputusan lama yang mewajibkan prerender: metadata dasar pada MVP; prerender/SSR lanjutan deferred | Public pages |
| DEC-012 | Hosting dan environment | Accepted* | Cloudflare Workers Static Assets + Supabase; domain final tetap terbuka | Deployment |
| DEC-013 | Tooling testing | Proposed | Meninjau ulang rencana lama yang mewajibkan Playwright/axe: Vitest/RTL dan tes database wajib; E2E tooling tambahan tidak boleh menghambat core MVP | Testing setup |
| DEC-014 | CMS content/rendering | Accepted* | Konten terstruktur dan rendering aman; tanpa HTML/script bebas | CMS |
| DEC-015 | Runtime/package manager/CI | Accepted | npm, Node 24 LTS baseline, lockfile; CI mengikuti scripts nyata | Scaffold |
| DEC-016 | Authentication | Proposed | Menggantikan model Owner/Staff lama: satu akun Owner, tanpa signup publik; Staff/role matrix dikeluarkan dari MVP | Sebelum auth |
| DEC-017 | Booking spam/abuse | Proposed | Menggantikan rencana Turnstile wajib: proteksi sederhana; Turnstile tidak wajib kecuali disetujui atau diperlukan berdasarkan risiko | Sebelum booking publik |
| DEC-018 | Client state | Accepted | Tanpa global state library tambahan; Context hanya bila diperlukan | Scaffold |
| DEC-019 | Error handling/observability | Accepted* | Error state konsisten; tanpa error-tracking pihak ketiga pada MVP | Data UI |
| DEC-020 | Template vs custom UI/UX | Proposed | Perubahan konten oleh Owner; custom layout oleh developer melalui kode | Sebelum CMS/design |
| DEC-021 | Domain data/catalog | Proposed | Katalog bersama publik/POS; tabel minimum dan relasi dijelaskan di §8 | Sebelum migrations |

`*` Accepted mengikuti keputusan terdahulu yang tidak bertentangan secara prinsip; tetap cek kecocokan dengan dokumen dan versi aktual saat implementasi. Tanggal approval dari keputusan baru diisi setelah persetujuan pemilik proyek. Jangan menafsirkan keputusan `Proposed` sebagai izin implementasi.

---

## 5. Baseline stack dan dependency

| Area | Baseline | Aturan |
|---|---|---|
| Frontend | Vite + React 19.x + TypeScript | SPA; periksa versi yang kompatibel saat scaffold |
| Styling | Tailwind CSS v4 | CSS-first configuration dan token semantik dari `DESIGN.md` |
| Routing | React Router v7 | Public routes dan admin routes memiliki layout terpisah; guard bukan keamanan data |
| Server state | TanStack Query | Cache, invalidation, retry, dan mutation mengikuti §7 |
| Form | HTML native + Valibot | Tidak memakai React Hook Form untuk MVP kecuali keputusan scope berubah |
| Backend | Supabase PostgreSQL + Auth | Gunakan satu client frontend; semua jalur data harus punya model permission |
| Media | Supabase Storage, jika diperlukan | Unggah hanya tipe/ukuran yang disetujui; tidak wajib membuat media manager kompleks |
| Database changes | Supabase CLI migrations | Migrations disimpan di Git dan diuji pada environment non-production |
| Database types | Supabase CLI type generation | Generated file di-commit; regenerate setelah perubahan schema |
| Test | Vitest + React Testing Library; `supabase test db`/pgTAP bila tersedia | Tes aturan bisnis kritis wajib; tes konkurensi booking tidak boleh hanya simulasi UI |
| Runtime/package manager | Node 24 LTS baseline + npm | Gunakan `.nvmrc`, `package.json` engines, dan `package-lock.json` konsisten |
| CI | GitHub Actions | Tambahkan langkah hanya untuk script yang benar-benar ada dan dapat dijalankan lokal |
| Hosting frontend | Cloudflare Workers Static Assets | Uji route fallback, asset, environment variables, dan status HTTP 404 aktual |
| Backend hosting | Supabase | Pisahkan development/preview/production; preview tidak pernah memakai database produksi |

### 5.1 Aturan dependency

Dependency baru hanya boleh ditambahkan jika:

1. Ada kebutuhan yang tidak tertangani dengan baik oleh platform atau dependency yang sudah dipakai.
2. Manfaat, kompleksitas, ukuran bundle, lisensi, dan pemeliharaan dipertimbangkan.
3. Perubahan disetujui pemilik proyek dan dicatat di dokumen yang relevan.
4. Lockfile diperbarui dan tes/build yang relevan dijalankan.

Jangan menambah Zustand, React Hook Form, page-builder library, payment SDK, error-tracking SaaS, atau library lain hanya karena generator UI menghasilkannya.

---

## 6. Struktur aplikasi frontend

Struktur ini merupakan arah minimum, bukan kewajiban membuat folder kosong. Sesuaikan detail setelah scaffold, tetapi pertahankan batas domain yang jelas.

```text
src/
├── app/                  # bootstrap, providers, router, error boundaries
├── components/           # komponen generik tanpa aturan domain
├── features/
│   ├── auth/             # login/logout dan sesi Owner
│   ├── site/             # layout publik, template, section renderer
│   ├── cms/              # edit profil dan konten terstruktur
│   ├── catalog/          # katalog tunggal untuk publik dan POS
│   ├── booking/          # form publik dan dashboard Owner
│   ├── pos/              # cart, checkout client, riwayat transaksi
│   └── reports/          # ringkasan laporan dasar
├── hooks/                # hook generik lintas fitur bila diperlukan
├── lib/                  # satu client Supabase, env config, formatter
├── routes/               # komponen halaman/router mengikuti DEC-002
└── types/                # generated database types dan tipe aplikasi turunan
```

### 6.1 Aturan arah impor

1. `app` menghubungkan `features`, `components`, `hooks`, `lib`, dan `types`.
2. Satu fitur tidak mengimpor file internal fitur lain; gunakan public export bila perlu berbagi perilaku.
3. `components` tidak mengimpor `features`; `lib` tidak mengimpor UI/domain; `types` tidak mengimpor modul aplikasi.
4. Hanya ada satu instance client Supabase frontend.
5. Variabel lingkungan dibaca dan divalidasi dalam satu modul konfigurasi; jangan menyebar `import.meta.env` ke seluruh kode.
6. Bundle admin sebaiknya dimuat secara lazy agar tidak ikut membesarkan halaman publik. Verifikasi hasil build sebelum menyatakan pemisahan berhasil.
7. Komponen website publik harus bisa ditukar atau ditata ulang tanpa mengubah skema, alur booking, atau POS.

### 6.2 Batas public site dan Owner dashboard

- Layout, navigasi, dan error boundary public site terpisah dari dashboard.
- Route guard dashboard hanya untuk UX. RLS/function permissions tetap menjadi pengaman sebenarnya.
- Area dashboard tidak diindeks; metadata dasar bukan pengganti kontrol akses.
- Data booking, transaksi, payment, dan konfigurasi internal tidak boleh ikut ke bundle HTML publik atau respons API publik.

---

## 7. Routing, data fetching, dan penanganan error

### 7.1 Routing

Gunakan React Router v7 sebagai pilihan baseline yang telah ditetapkan sebelumnya. Rute publik minimum dari `PRD.md`:

- `/` — Beranda
- `/tentang` — Tentang
- `/layanan` — Produk/Layanan
- `/ruang` — Ruang/Fasilitas bila relevan
- `/booking` — Form booking
- `/kontak` — Kontak
- `*` — halaman 404

Rute dashboard berada di bawah prefix konsisten (misalnya `/admin`), mempunyai layout terpisah, dan memerlukan sesi Owner. URL final dashboard dapat dikunci saat implementasi routing.

Halaman tambahan untuk desain custom boleh dibuat sesuai kebutuhan klien, tetapi tidak wajib dalam template dasar. Rute yang tidak dikenal harus menampilkan halaman 404. Konfigurasi hosting perlu diuji agar status HTTP 404 benar bila didukung jalur deploy.

### 7.2 SEO MVP

Mengikuti `PRD.md`, SEO MVP dibatasi pada:

- judul dan deskripsi metadata dasar;
- URL yang konsisten dan tautan internal yang masuk akal;
- struktur heading dan konten yang dapat diakses;
- halaman 404 yang jelas.

**Prerender, SSR, dan otomasi build ulang ketika konten berubah bukan syarat MVP.** Vite SPA mengambil konten secara dinamis sehingga hasil indeksasi mesin pencari mungkin terbatas. Dokumentasikan trade-off ini dan jangan menjanjikan SEO teknis lanjutan kepada klien sebelum kebutuhan tersebut dikaji sebagai scope terpisah.

### 7.3 Server state dengan TanStack Query

- Gunakan TanStack Query untuk request database/server dan status query/mutation.
- Data publik dapat memakai cache lebih lama; data admin harus memiliki cache yang sesuai sensitivitasnya dan dibersihkan saat logout.
- Jangan menggunakan optimistic update untuk checkout, konfirmasi booking, atau mutasi lain yang menentukan transaksi/availability.
- Jangan mengulang mutasi checkout secara otomatis. Retry oleh pengguna harus menggunakan `client_request_id` yang sama.
- Setelah mutasi berhasil, invalidasi query terkait; jangan mengandalkan state lokal sebagai bukti bahwa database sudah berubah.
- Total transaksi final berasal dari respons database/RPC, bukan hitungan frontend.

### 7.4 Error handling dan logging

- Definisikan pola error ter-normalisasi: kode internal, pesan yang aman untuk pengguna, dan detail teknis yang telah disanitasi.
- Tampilkan loading, empty, validation error, forbidden, network failure, success, dan retry state yang sesuai.
- Pesan publik tidak membocorkan apakah booking lain ada, identitas Owner, detail SQL, atau data pribadi lain.
- Jangan mencatat token, secret, kredensial, data pembayaran yang tidak dibutuhkan, atau detail kontak pribadi dalam log.
- Tidak perlu error-tracking SaaS pada MVP. Error tracking dapat dievaluasi setelah versi dasar stabil.

---

## 8. Domain data dan sumber kebenaran

Nama dan kolom di bawah adalah **model konseptual**, bukan pengganti migration final. Tipe, constraint, index, relasi, status, serta aturan retensi harus dirinci dalam `DATABASE.md` dan direalisasikan di `supabase/migrations/*.sql`.

### 8.1 Entitas minimum yang diperkirakan

| Entitas | Tujuan | Catatan |
|---|---|---|
| `owner_profiles` atau padanan | Mengaitkan user Supabase Auth yang sah dengan akun Owner aktif | Tidak ada tabel role matrix untuk Staff di MVP. Pilih nama yang konsisten di `DATABASE.md`. |
| `business_profile` | Satu baris profil/pengaturan bisnis untuk satu instalasi | Berisi nama, deskripsi, kontak, jam buka, zona waktu `Asia/Jakarta`, dan referensi media yang diperlukan. Hindari field publik berupa secret. |
| `page_content` | Konten terstruktur untuk halaman/section company profile | Field dan bentuk JSONB/relasi ditetapkan sesuai CMS. Tidak menyimpan HTML atau script bebas. Konten tersimpan berlaku ke website publik; workflow draft/publish kompleks tidak masuk MVP. |
| `products` | Katalog tunggal produk/layanan | Memiliki status aktif/nonaktif, nama, deskripsi, harga, dan gambar opsional. Website dan POS mengambil sumber yang sama. |
| `resources` | Ruang/fasilitas yang dapat dipesan | Owner mengatur nama, status aktif, dan jam operasional yang diperlukan. Bagian website dapat disembunyikan bila tidak relevan. |
| `bookings` | Permintaan booking dan statusnya | Data pribadi hanya untuk Owner; pengunjung tidak dapat membaca list/detail internal. |
| `orders` | Header transaksi POS | Menyimpan nomor transaksi unik, total, status final, waktu, dan idempotency key atau referensinya. |
| `order_items` | Detail item pada transaksi | Snapshot nama dan harga saat checkout, kuantitas, dan total baris. Riwayat tidak berubah ketika katalog berubah. |
| `payments` | Catatan pembayaran untuk satu checkout lunas | Satu pembayaran manual per transaksi pada MVP; metode `cash`, `transfer`, atau `qris`. Tidak mendukung DP, pelunasan, refund, atau payment gateway. |

Jangan membuat semua tabel lebih awal hanya karena muncul di daftar konsep. Finalisasi model sesuai alur yang disetujui dan uji migration dari environment bersih.

### 8.2 CMS terstruktur

- Simpan field bisnis dan section konten yang dibutuhkan template dasar.
- Konten fleksibel sebaiknya berupa data terstruktur (field biasa atau JSONB yang tervalidasi), bukan HTML bebas.
- Bentuk schema content harus memiliki validasi yang jelas per jenis section; jangan menerima sembarang object JSON untuk dirender secara langsung.
- Sanitasi teks kaya pada subset markup yang secara eksplisit diizinkan bila memang dibutuhkan. Hindari `dangerouslySetInnerHTML` dengan konten CMS tak tepercaya.
- Media disimpan di Storage dengan batas tipe/ukuran dan kontrol upload; referensi media divalidasi sebelum ditampilkan.
- Design/layout berasal dari komponen kode. CMS mengubah konten dan visibilitas section yang diizinkan, bukan script atau markup arbitrer.
- Kebutuhan SEO per halaman hanya metadata dasar pada MVP; konten SEO dinamis lanjutan tidak boleh membuat scope diam-diam berubah.

### 8.3 Katalog bersama

- `products` menjadi satu-satunya sumber nama, deskripsi, harga, status aktif, dan gambar produk/layanan.
- Public site hanya memperlihatkan field publik dari item aktif.
- POS hanya menjual item aktif dan membaca harga resmi dari database.
- Harga di halaman publik tidak boleh dikelola sebagai salinan terpisah di `page_content`.
- Jika perlu menampilkan bagian pilihan produk pada beranda, simpan referensi ID produk/urutan tampil, bukan salinan harga/nama sebagai sumber kebenaran kedua.

### 8.4 Uang, waktu, dan tipe

- Mata uang MVP: **IDR**; tidak ada pilihan multi-currency pada MVP.
- Simpan nominal rupiah sebagai bilangan bulat dengan tipe database yang cukup (misalnya `bigint`); jangan gunakan floating-point.
- Karena PostgreSQL `bigint` bisa melampaui rentang aman JavaScript `number`, tipe uang hasil generate/adapter harus diperlakukan sebagai string atau dikonversi dengan aturan yang aman. Jangan melakukan aritmetika uang final di frontend.
- Kuantitas POS memakai integer positif dengan batas yang disepakati. Harga/kuantitas divalidasi di database.
- Simpan instant sebagai `timestamptz`. Zona waktu bisnis MVP adalah `Asia/Jakarta`; filter laporan menghormati batas hari pada zona waktu itu.
- Nomor transaksi unik harus dijamin database. Format tampilan final dapat mengikuti PRD, tetapi keunikan tidak boleh hanya bergantung pada counter frontend.

---

## 9. Authentication, authorization, dan RLS

### 9.1 Model akses MVP

- Hanya satu akun Owner yang dibuat melalui prosedur bootstrap/setup yang terdokumentasi.
- Signup publik dinonaktifkan. Pengunjung publik tidak perlu akun.
- Staff, pembagian izin, dan role matrix tidak termasuk MVP.
- Sesi dikelola melalui Supabase Auth. Komponen tidak membaca atau memproses token secara langsung.
- Role/identitas Owner tidak boleh berasal dari `user_metadata` atau input client yang dapat diubah pemakai.

Fungsi helper kanonik untuk memeriksa Owner boleh dipilih pada `SECURITY.md`/migrations, tetapi harus sederhana, didokumentasikan, dan diuji. Jika memakai `SECURITY DEFINER`, batasi `EXECUTE`, gunakan `search_path` aman (atau kosong), dan schema-qualify semua referensi objek.

### 9.2 Matriks akses konseptual

| Data/operasi | Pengunjung anonim | Owner |
|---|---|---|
| Membaca profil/halaman publik | Boleh, hanya field publik | Boleh |
| Membaca produk/layanan aktif | Boleh, hanya field publik | Boleh |
| Membaca resource aktif/jam yang dipublikasikan | Boleh sesuai kebutuhan form/website | Boleh |
| Mengirim booking baru | Boleh melalui jalur publik terbatas | Boleh mengelola booking melalui dashboard |
| Membaca seluruh/detail data booking | Tidak boleh | Boleh |
| Mengubah status booking | Tidak boleh | Boleh sesuai transisi yang diizinkan |
| Mengelola profil/konten/katalog/resource | Tidak boleh | Boleh |
| Membaca/membuat transaksi dan pembayaran | Tidak boleh | Boleh |
| Membaca laporan | Tidak boleh | Boleh |

RLS policy bukan satu-satunya kontrol. Evaluasi privilege table, views, RPC, Edge Functions, Storage policies, dan grants. Gunakan tampilan publik/view/RPC yang hanya mengekspos field yang dibutuhkan; jangan mengizinkan `anon` membaca seluruh row internal hanya untuk menampilkan beberapa kolom.

### 9.3 Supabase keys dan environment

- Frontend hanya menggunakan URL Supabase dan publishable key yang memang dimaksudkan untuk pemakaian publik.
- `service_role`, secret key, password database, dan secret Turnstile/layanan lain tidak boleh berada di `VITE_*`, source frontend, bundle browser, Git, log, atau prompt.
- Pisahkan local development, preview/staging, dan production. Preview tidak menggunakan database production.
- Auth redirect URLs, CORS/origins, dan environment values harus diatur sesuai setiap lingkungan.
- `.env.example` berisi nama variabel dan placeholder, bukan secret asli.

---

## 10. Jalur kritis: booking publik dan anti-bentrok

### 10.1 Alur booking

1. Pengunjung mengisi resource, waktu mulai/selesai, nama, kontak, jumlah orang, dan catatan opsional.
2. Frontend memvalidasi format untuk UX, lalu mengirim permintaan ke jalur publik yang ditetapkan.
3. Lapisan server menetapkan status `pending`; client tidak boleh memilih status atau field internal.
4. Validasi tepercaya memeriksa resource aktif, waktu, durasi, jam operasional, horizon pemesanan, dan input lain yang diwajibkan.
5. Owner melihat booking di dashboard, lalu mengonfirmasi, menolak, atau membatalkan.
6. Konfirmasi yang bertabrakan ditolak oleh database dan dipetakan ke pesan aman yang dapat ditindaklanjuti.
7. Owner menghubungi pengunjung secara manual; notifikasi otomatis dan reschedule mandiri bukan fitur MVP.

### 10.2 Aturan jadwal MVP

Mengikuti `PRD.md`:

- Zona waktu bisnis: `Asia/Jakarta`.
- Mulai booking mengikuti slot 60 menit; durasi adalah kelipatan 60 menit, dengan durasi maksimum 4 jam.
- Buffer antar-booking: 15 menit. Aturan apakah buffer diterapkan setelah booking atau pada rentang reservasi yang diperiksa harus ditulis eksplisit pada `DATABASE.md` dan dibuktikan lewat tes batas.
- Pemesanan maksimal 30 hari ke depan.
- Resource dan jam operasional dapat diubah Owner. Slot, buffer, durasi maksimum, serta horizon pada MVP merupakan konfigurasi proyek yang ditetapkan; bukan editor kebijakan booking kompleks.
- Hanya status `confirmed` memblokir waktu. `pending` tidak memblokir.
- Interval waktu bersifat setengah-terbuka `[start, end)`. Booking lain boleh mulai persis ketika interval yang diblokir berakhir, termasuk buffer yang sudah dihitung.
- Jika dua konfirmasi bersamaan akan menghasilkan bentrok, database hanya boleh menerima satu.

### 10.3 Constraint dan strategi implementasi

- Pilihan yang disarankan adalah PostgreSQL range type (`tstzrange`) dan exclusion constraint GiST pada kombinasi resource dan rentang waktu yang diblokir, dengan filter status `confirmed`.
- Periksa kebutuhan extension `btree_gist` pada Supabase dan pastikan migration dapat diterapkan pada environment lokal/test.
- Representasi rentang yang dipakai constraint harus mencakup semantik buffer yang disepakati; jangan hanya memeriksa rentang asli bila buffer merupakan aturan bisnis.
- Jangan mengandalkan query `SELECT` untuk mencari slot kosong diikuti `INSERT` saja—dua request bersamaan dapat lolos cek yang sama.
- Tangani exclusion violation (misalnya SQLSTATE `23P01`) dengan hasil yang aman dan pesan “slot tidak lagi tersedia” atau padanan yang jelas.
- Tes harus mencakup overlap, batas interval tepat, buffer, booking pending, resource berbeda, input waktu invalid, serta dua upaya konfirmasi bersamaan.

### 10.4 Jalur publik dan anti-abuse

DEC-006/DEC-017 perlu mengunci implementasi tepat sebelum booking dibuat:

- Jalur publik hanya menerima field yang dibutuhkan dan tidak menyediakan `SELECT` publik atas data booking.
- Usulan jalur: Supabase Edge Function sebagai entry point publik, dengan operasi database internal yang hanya dapat dipanggil oleh jalur tepercaya. RPC internal tidak diberi `EXECUTE` ke `anon` jika hal itu memungkinkan bypass proteksi.
- Validasi aturan bisnis tetap dilakukan ulang pada lapisan database/internal; validasi Edge Function saja tidak cukup.
- MVP memerlukan perlindungan spam sederhana yang bisa diverifikasi, misalnya honeypot plus pembatasan permintaan yang layak pada jalur publik bila tersedia. Cloudflare Turnstile boleh dipakai bila disetujui atau risiko pilot membutuhkannya, tetapi integrasi pihak ketiga tidak menjadi kewajiban diam-diam dari PRD.
- Jika Edge Function menggunakan secret berhak tinggi, validasi input wajib ketat karena service role melewati RLS. Secret hanya berada di server-side environment.
- Respons publik tidak boleh memuat nama, kontak, waktu lengkap, atau detail booking pengguna lain.

---

## 11. Jalur kritis: POS checkout atomik

### 11.1 Alur checkout

1. Owner memilih item aktif dan kuantitas dari katalog.
2. Frontend boleh menampilkan estimasi subtotal, tetapi estimasi itu bukan sumber kebenaran.
3. Client mengirim daftar ID item, kuantitas, metode pembayaran (`cash`, `transfer`, `qris`), dan `client_request_id` unik untuk aksi checkout.
4. Satu operasi database tepercaya memvalidasi Owner, memuat item aktif dan harga resmi, menghitung total, menyimpan order, snapshots `order_items`, serta satu catatan payment lunas secara atomik.
5. Database menghasilkan/memastikan nomor transaksi unik dan mengembalikan detail hasil tersimpan.
6. Frontend menampilkan hasil dari respons server. Jika terjadi network timeout, retry menggunakan `client_request_id` yang sama.

### 11.2 Aturan wajib

- Gunakan RPC/fungsi database untuk checkout multi-record atau jalur server tepercaya lain yang menghasilkan transaksi atomik.
- Client tidak boleh menentukan total resmi, harga snapshot, status final, owner ID, atau timestamp pembayaran yang dipercaya tanpa validasi.
- Tolak item nonaktif, kuantitas tidak valid, payload kosong/tidak valid, dan metode pembayaran di luar enum yang diizinkan.
- Simpan snapshot nama dan harga pada detail transaksi. Perubahan katalog tidak mengubah transaksi yang sudah selesai.
- Retry dengan `client_request_id` yang sama dan payload identik mengembalikan transaksi yang sudah dibuat atau hasil ekuivalen tanpa membuat penjualan baru.
- ID sama dengan payload berbeda harus ditolak sebagai konflik, bukan dipakai untuk mengganti transaksi lama.
- Order, order items, dan payment harus commit bersama atau rollback bersama.
- Transaksi yang selesai dibayar tidak dapat diedit atau dihapus melalui dashboard pada MVP. Tidak ada flow refund/void/koreksi; jelaskan keterbatasan ini pada UI/dokumentasi operasional.
- Jangan menambahkan diskon, pajak, pembulatan khusus, DP, stok, atau payment gateway pada checkout MVP.

### 11.3 Keamanan fungsi database

- Fungsi tidak aman secara otomatis hanya karena berjalan di PostgreSQL.
- Gunakan privilege serendah mungkin dan `SECURITY INVOKER` bila sesuai.
- Jika `SECURITY DEFINER` diperlukan, batasi `EXECUTE`, gunakan `search_path` aman/kosong, referensikan objek dengan nama schema yang eksplisit, dan periksa seluruh input serta otorisasi di fungsi.
- Tinjau grants tabel dan function bersama RLS. Jangan mengekspos service-role key ke browser.

---

## 12. Storage media dan content safety

- Gunakan Supabase Storage hanya untuk logo, hero, dan gambar produk/konten yang diperlukan oleh template.
- Batasi jenis dan ukuran file; validasi sisi client untuk UX dan server/storage policy untuk enforcement.
- Tetapkan apakah objek publik atau private sebelum membuat bucket/policy. Media yang memang tampil pada website dapat disajikan publik, tetapi operasi upload/update/delete tetap hanya untuk Owner.
- Jangan menyimpan file yang dapat mengeksekusi script atau menerima HTML/SVG aktif tanpa kebijakan dan sanitasi yang jelas.
- Field konten tidak boleh mengeksekusi JavaScript. Hindari raw HTML; bila teks kaya dibutuhkan, izinkan subset markup yang eksplisit dan sanitasi sebelum render.
- Tambahkan alt text pada gambar yang memerlukan deskripsi aksesibilitas.
- Jangan membangun media manager lengkap, crop editor, atau workflow aset lanjutan pada MVP.

---

## 13. Laporan dan query data

- Laporan awal menghitung penjualan POS yang berhasil dan lunas; tidak ada akuntansi accrual, DP, refund, atau adjustment.
- Metrik minimum: total penjualan per periode, jumlah transaksi, total per metode pembayaran, dan jumlah booking per status. Item terlaris boleh disertakan bila sederhana dan hasilnya dapat direkonsiliasi.
- Semua definisi metrik harus mengikuti `PRD.md` serta dituliskan di `DATABASE.md` sebelum laporan dianggap final.
- Filter tanggal menggunakan zona waktu bisnis `Asia/Jakarta`, lalu konversi batas waktu dengan benar ke `timestamptz`.
- Buat index berdasarkan query aktual yang penting (mis. status/tanggal booking, waktu order, item/order foreign keys); jangan menambah index spekulatif tanpa kebutuhan.
- Pengujian laporan harus menggunakan fixture yang hasil hitung manualnya diketahui.

---

## 14. Migration, generated types, dan database testing

### 14.1 Migration workflow

- Simpan schema, foreign keys, check/unique/exclusion constraints, indexes, RLS policies, grants, functions, dan perubahan Storage policy yang dikelola SQL dalam migrations.
- Jalankan migration pada Supabase lokal atau environment test terpisah lebih dahulu.
- Jangan reset/drop/truncate atau menjalankan migration destruktif pada production tanpa review, backup/recovery plan yang sesuai, dan persetujuan eksplisit.
- Setelah schema berubah, regenerate TypeScript database types dan jalankan semua tes yang terkait.
- `DATABASE.md` menjelaskan keputusan dan invariant; migration files tetap sumber kebenaran schema yang dieksekusi.

### 14.2 Generated TypeScript types

- Baseline script: `npm run db:types`, dengan command Supabase CLI yang disepakati di `package.json`.
- Hasil schema disimpan di `src/types/database.ts` jika struktur itu tetap dipakai saat scaffold.
- Jangan menulis ulang tipe tabel/function secara manual jika bisa dihasilkan dari schema.
- Perlakukan nominal `bigint` dengan representasi yang aman (umumnya string di batas TypeScript/JSON); jangan membuat asumsi bahwa nominal dapat diproses sebagai `number` tanpa pemeriksaan rentang.
- Verifikasi command `db:types` dan jenis status yang dihasilkan pada versi Supabase CLI saat implementasi; jangan menambahkan CI check untuk script yang belum berfungsi.

### 14.3 Tes wajib untuk database dan security

Minimal buktikan:

- akses anonim hanya membaca field publik yang diperlukan;
- pengunjung tidak dapat membaca/mengubah booking internal, transaksi, atau laporan;
- user non-Owner tidak dapat memanggil operasi Owner (signup publik tidak menghasilkan akun);
- validasi status awal dan transisi booking;
- exclusion constraint menghentikan bentrok, termasuk buffer dan request bersamaan;
- harga/total dari client tidak dipercaya;
- checkout atomik dan idempotency bekerja pada retry;
- snapshot item/harga tidak berubah ketika katalog diedit;
- transaksi nonaktif/invalid tidak dapat dijual;
- laporan cocok dengan fixture yang dihitung manual.

Gunakan pgTAP/`supabase test db` jika sesuai dengan versi/tooling proyek. Tes konkurensi dapat membutuhkan integration test atau skrip yang menjalankan request bersamaan terhadap database test; jangan menganggap tes SQL sekuensial telah membuktikan konkurensi.

---

## 15. Environment, deployment, dan secrets

### 15.1 Lingkungan

| Lingkungan | Frontend | Supabase | Aturan |
|---|---|---|---|
| Local | `vite dev` | Supabase lokal via CLI jika tersedia | Data sintetis; `.env.local` tidak di-commit |
| Preview/Staging | Cloudflare preview atau deployment non-production yang disetujui | Proyek Supabase staging terpisah | Tidak boleh menggunakan database production |
| Production | Cloudflare Workers Static Assets | Proyek Supabase production | Deploy hanya setelah persetujuan rilis |

Hosting/domain dan batas paket provider harus diverifikasi pada saat implementasi; dokumentasi ini bukan janji harga/limit yang tetap.

### 15.2 Environment variables

Nama baseline yang dipakai frontend:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Tambahkan public site key Turnstile hanya jika integrasinya disetujui. Site key publik boleh berada pada frontend; secret key hanya berada di environment server/Edge Function.

- Semua variable `VITE_*` dianggap bisa dilihat di browser.
- Jangan pernah menaruh `service_role`, secret Supabase, password database, atau secret integrasi pada `VITE_*`.
- `.env.example` berisi placeholder saja.
- Jika secret terpapar, rotasi secret; menghapus teks dari file saja tidak cukup.

### 15.3 Build dan release

- Gunakan command build/typecheck/lint/test yang benar-benar tersedia di `package.json`.
- Uji route publik, dashboard, login/logout, 404, asset/media, serta koneksi ke environment yang tepat pada preview.
- Deploy production memerlukan persetujuan eksplisit Owner.
- Simpan referensi deployment terakhir yang telah diverifikasi untuk rollback frontend.
- Perbaikan schema production dilakukan melalui migration lanjutan dan prosedur recovery yang disetujui; rollback frontend tidak membatalkan perubahan database.
- Jangan menyatakan rilis selesai hanya karena website bisa dibuka.

---

## 16. Risiko arsitektur dan trade-off yang diterima

| Risiko / trade-off | Konsekuensi | Penanganan MVP |
|---|---|---|
| Vite SPA dan konten dinamis | SEO tidak setara dengan SSR/prerender pada semua crawler | Metadata dasar; jangan klaim SEO lanjutan; kaji kebutuhan lanjutan secara terpisah |
| Custom UI/UX melalui kode | Setiap desain klien dapat menambah jam implementasi | Gunakan komponen/tokens; scope custom design disetujui per kebutuhan; backend tetap sama |
| Pending tidak memblokir slot | Beberapa request dapat memilih slot yang sama sebelum Owner meninjau | Dashboard pending; constraint mencegah dua konfirmasi yang berbenturan |
| Tidak ada void/refund | Kesalahan transaksi tidak bisa dikoreksi melalui UI MVP | Tinjau keranjang sebelum checkout; tampilkan keterbatasan; jangan edit/hapus transaksi selesai |
| Single Owner | Tidak ada operasional multipengguna | Sengaja dibatasi untuk menghemat waktu; Staff dapat menjadi fase lanjutan |
| Form publik rentan spam | Potensi request palsu | Validasi tepercaya dan perlindungan sederhana; evaluasi CAPTCHA/rate limit jika penggunaan nyata memerlukannya |
| Scope creep | Timeline satu bulan mudah terlewati | Fitur deferred tidak masuk tanpa keputusan dan trade-off tertulis |

---

## 17. Teknologi dan kapabilitas di luar baseline

Hal berikut bukan bagian MVP kecuali ada keputusan scope baru yang disetujui:

- FastAPI atau backend terpisah di luar Supabase;
- Zustand atau global state library lain;
- React Hook Form;
- payment gateway/SDK pembayaran;
- inventory/BOM, supplier, purchase order, POS offline;
- page builder drag-and-drop atau editor HTML/CSS bebas;
- multi-tenant, SaaS billing, dan multi-bahasa;
- SSR/prerender lanjutan, pipeline build otomatis untuk setiap perubahan CMS;
- error tracking pihak ketiga dan analitik lanjutan.

---

## 18. Referensi dan kewajiban verifikasi

Dokumentasi resmi harus diperiksa sesuai versi tool yang benar-benar dipakai, khususnya:

- Supabase Database Migrations: https://supabase.com/docs/guides/local-development/database-migrations
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Database Functions: https://supabase.com/docs/guides/database/functions
- PostgreSQL Range Types: https://www.postgresql.org/docs/current/rangetypes.html
- PostgreSQL Constraints: https://www.postgresql.org/docs/current/ddl-constraints.html
- Tailwind CSS v4: https://tailwindcss.com/docs
- React Router: https://reactrouter.com/
- Cloudflare Workers Static Assets: https://developers.cloudflare.com/workers/static-assets/

URL di atas adalah titik awal, bukan bukti bahwa implementasi aktual sudah memenuhi persyaratan. Catat versi dan hasil verifikasi saat task terkait dikerjakan.

---

## 19. Gate sebelum implementasi fitur

Sebelum memulai task fitur yang relevan, pastikan:

- [ ] `PRD.md` yang direvisi telah ditinjau dan scope template/custom UI/UX dipahami.
- [ ] Owner-only auth dan tidak adanya Staff pada MVP konsisten di `SECURITY.md`.
- [ ] Routing dan SEO dasar tidak bergantung pada prerender/SSR lanjutan.
- [ ] Jalur public booking, anti-abuse, dan pemanggilan RPC/function internal telah disetujui.
- [ ] Strategi buffer booking jelas serta dapat ditegakkan oleh constraint database.
- [ ] Checkout menggunakan IDR integer, paid-in-full, satu metode manual, atomic writes, snapshots, dan idempotency.
- [ ] Tabel, RLS, grants, Storage policies, dan RPC/function permissions telah dipetakan di `SECURITY.md`/`DATABASE.md`.
- [ ] Scripts migration, generated types, build, typecheck, lint, dan test yang direncanakan tersedia atau dicatat sebagai task setup.
- [ ] `AGENTS.md` dan `TASK.md` membatasi scope kerja AI dan mencatat bukti verifikasi.

**Tidak boleh** memperlakukan butir checklist sebagai hasil yang sudah tercapai tanpa memeriksa repository dan hasil command sebenarnya.
