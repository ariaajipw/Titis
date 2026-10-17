# SECURITY — Desain Keamanan TITIS

> **Status:** Disetujui sebagai baseline MVP — revisi 2026-10-15, diperbarui per keputusan Owner 2026-10-16.
>
> **Baseline dokumen:** revisi 2026-10-16. MVP satu instalasi untuk satu bisnis, satu akun Owner, website publik/CMS, katalog bersama, booking anti-bentrok, POS lunas dengan pembayaran manual, dan laporan operasional dasar.
>
> **Sumber kebenaran untuk:** prinsip keamanan, model ancaman, matriks izin, strategi RLS/grants, jalur akses publik, kebijakan secret/logging, dan security gate.
>
> **Bukan pengganti:** enforcement yang benar-benar diterapkan pada migrations, grants, RLS policies, database constraints, RPC/functions, Edge Functions, Storage policies, dan test. Dokumen menjelaskan desain; pemeriksaan dan test aktual membuktikan perilaku.
>
> **Rujukan:** `PRD.md` untuk scope produk; `ARCHITECTURE.md` untuk keputusan teknis; `DATABASE.md` untuk model data/invariants; `TESTING.md` untuk prosedur dan identifier test; `AGENTS.md` untuk batas kerja agent; `TASK.md` untuk status dan bukti.
>
> Semua keputusan arsitektur kini `Accepted` (Owner 2026-10-16); tidak ada `Proposed` yang membatasi implementasi keamanan.

---

## 1. Prinsip keamanan

1. **Autentikasi bukan otorisasi.** Sesi yang valid membuktikan identitas, tetapi setiap operasi internal tetap memerlukan pemeriksaan bahwa akun tersebut adalah Owner yang sah dan masih aktif.
2. **UI bukan batas keamanan.** Menyembunyikan menu, menonaktifkan tombol, atau memasang route guard tidak menggantikan RLS, grants, constraint, dan pemeriksaan dalam RPC/function.
3. **Default deny.** Berikan akses minimal per role, tabel, aksi, dan field yang diperlukan. Akses yang belum diputuskan dianggap ditolak.
4. **Input browser tidak tepercaya.** Jangan mempercayai identitas Owner, status booking, harga, total checkout, waktu pembayaran, atau field internal karena dikirim client.
5. **RLS dan grants dinilai bersama.** RLS membatasi baris, tetapi tidak dengan sendirinya membatasi seluruh kolom atau menjamin jalur view/function/Storage aman.
6. **Aturan bisnis kritis ditegakkan di lapisan tepercaya.** Anti-bentrok booking, transisi status, harga resmi, total checkout, dan idempotency tidak hanya dijaga oleh UI.
7. **Kegagalan aman.** Jika identitas, izin, input, atau hasil transaksi tidak dapat diverifikasi, tolak operasi tanpa membocorkan data internal.
8. **Secret tidak pernah masuk frontend.** Semua variabel `VITE_*` dianggap dapat dibaca di browser. Publishable key bukan rahasia; data tetap wajib dilindungi oleh grants dan RLS.
9. **Log seminimal mungkin.** Jangan mencatat secret, token, atau data pribadi lengkap yang tidak diperlukan.
10. **Klaim harus dibuktikan.** Draft policy bukan bukti kontrol telah aktif. Catat migration, command, hasil test, dan keterbatasan aktual.

## 2. Aktor dan aset

### 2.1 Aktor

| Aktor | Deskripsi | Tingkat kepercayaan |
|---|---|---|
| Anonymous | Pengunjung publik, termasuk pemanggil yang berniat menyalahgunakan endpoint | Tidak tepercaya |
| Owner | Satu akun admin yang dibuat melalui prosedur bootstrap terkontrol | Diberi akses bisnis sesuai aturan; sesi dan setiap operasi tetap diverifikasi |
| Operator proyek | Pemilik/pengelola environment, konfigurasi Supabase, dan secret server | Akses infrastruktur; harus memakai mekanisme resmi dan least privilege |
| AI coding agent | Alat bantu pengembangan yang mengikuti `AGENTS.md` | Terbatas; tidak boleh membaca secret atau melakukan tindakan remote tanpa izin |

**Tidak ada aktor Staff pada MVP.** Jangan menambahkan role, permission matrix, atau jalur Staff ke policy/test kecuali scope produk diubah secara eksplisit dan disetujui.

### 2.2 Aset yang dilindungi

- Data kontak pengunjung dan catatan booking.
- Status, jadwal, dan integritas resource/booking.
- Data Owner, sesi autentikasi, dan mapping akun Owner.
- Konten bisnis, konfigurasi internal, katalog, dan referensi media.
- Order, snapshot item/harga, pembayaran, dan laporan.
- Secret server, kredensial database, token, konfigurasi environment, serta jejak log.

## 3. Batas kepercayaan

```text
[Browser: Anonymous / Owner]
        | input tidak tepercaya; publishable key dan sesi bila login
        v
[Supabase Auth / API / Storage / jalur Edge Function]
        | grants + RLS + validasi input
        v
[PostgreSQL: constraints, RLS, trigger, RPC]
        ^
        | secret server hanya pada runtime yang memang memerlukannya
[Edge Function / proses operator yang disetujui]
```

- Frontend tidak pernah menerima `service_role`, secret key Supabase, password database, atau secret server lainnya.
- Public site hanya menerima field yang sengaja dipublikasikan. Jangan mengekspos seluruh row tabel internal untuk memenuhi kebutuhan UI publik.
- Identitas Owner harus diperiksa melalui sumber data/claim yang tepercaya dan tidak dapat dimanipulasi sendiri oleh pengguna. Jangan memakai `user_metadata` yang dapat diedit pengguna sebagai satu-satunya dasar otorisasi.
- Jalur publik booking dan anti-abuse (DEC-006, DEC-017) **disetujui (Accepted)** Owner 2026-10-16; implementasi dikunci per keputusan tersebut.

## 4. Matriks izin konseptual

Matriks ini adalah **desain yang diusulkan**, bukan deskripsi policy aktif. Hak yang memerlukan jalur terbatas harus ditangani oleh view, RPC, atau Edge Function yang telah ditinjau. Untuk hal yang tidak disebutkan, akses ditolak secara default.

| ID | Operasi | Anonymous | Owner terautentikasi | Batas penting |
|---|---|---|---|---|
| SEC-PERM-01 | Membaca halaman/konten publik yang diizinkan | Ya, hanya field publik | Ya | Hanya key konten yang dipublikasikan ke website; tidak ada script/HTML bebas |
| SEC-PERM-02 | Membaca profil bisnis publik | Ya, field publik saja | Ya | Kolom internal/config tidak ikut terbuka |
| SEC-PERM-03 | Membaca produk/layanan aktif yang dipublikasikan | Ya, field publik saja | Ya | Item nonaktif atau tidak untuk publik tidak terekspos |
| SEC-PERM-04 | Membaca resource/jam yang diperlukan untuk form booking | Ya, subset publik | Ya | Tidak mengungkap booking lain, kontak pemesan, atau catatan internal |
| SEC-PERM-05 | Mengajukan booking baru | Ya, melalui jalur publik terbatas yang disetujui | Ya, sesuai alur dashboard bila diperlukan | Sistem memaksa `pending`; tidak menerima status/pelaku dari client |
| SEC-PERM-06 | Membaca daftar atau detail booking internal | Tidak | Ya | `reference_code` bukan kredensial untuk membaca booking |
| SEC-PERM-07 | Mengonfirmasi, menolak (dengan alasan opsional), atau membatalkan booking | Tidak | Ya, melalui jalur terkontrol | Validasi ulang transisi dan ketersediaan; constraint DB mencegah bentrok |
| SEC-PERM-08 | Mengelola profil, CMS, katalog, resource, dan jam operasional | Tidak | Ya | Validasi bentuk/field; operasi media memiliki kontrol tambahan |
| SEC-PERM-09 | Membaca atau membuat order, item transaksi, dan pembayaran | Tidak | Ya | Checkout hanya lunas; nilai resmi ditentukan lapisan tepercaya |
| SEC-PERM-10 | Membaca riwayat transaksi dan laporan | Tidak | Ya | Data tidak boleh tersedia pada endpoint publik |
| SEC-PERM-11 | Mengunggah/mengubah/menghapus media | Tidak | Ya | Batas MIME/ukuran; operasi objek tetap terproteksi walaupun gambar dapat dibaca publik |
| SEC-PERM-12 | Mengubah identitas Owner atau membuat akun admin dari UI publik | Tidak | Tidak melalui operasi umum | Bootstrap/pemulihan Owner harus melalui prosedur operator yang terdokumentasi; DEC-016 perlu diterima |
| SEC-PERM-13 | Membaca audit/log internal bila tersedia | Tidak | Hanya jika kebutuhan dan bentuk data disetujui | Jangan menambah dashboard audit sebagai fitur tersirat; jangan simpan secret/PII berlebihan |

Aturan penggunaan matriks:

- Setiap operasi punya test positif dan negatif melalui akses langsung—bukan hanya melalui UI.
- Owner tetap tidak boleh mengubah nilai final yang seharusnya dihitung sistem (misalnya total order) melalui payload client.
- Matriks final harus diselaraskan dengan model tabel pada `DATABASE.md`, keputusan yang telah `Accepted`, dan semua migrations/grants yang benar-benar diterapkan.

## 5. Strategi RLS, grants, dan akses per tabel

Prinsip minimum: aktifkan RLS pada setiap tabel yang diekspos kepada client; berikan grants eksplisit; cabut akses yang tidak dibutuhkan dari `anon`, `authenticated`, dan `PUBLIC`; lalu uji operasi melalui koneksi/client role yang sesuai. Jangan mengandalkan default provider tanpa memeriksanya pada versi yang dipakai.

| Tabel/area konseptual | Anonymous | Owner | Field/operasi sensitif | Jalur atau bukti yang diperlukan |
|---|---|---|---|---|
| `owner_profiles` | Tidak ada akses | Membaca mapping/profil sendiri sesuai desain; tidak mengubah mapping ke akun lain | `user_id`, `is_active` | Bootstrap/admin operation terkontrol; uji user non-Owner dan sesi invalid |
| `business_profile` | Hanya field publik melalui view/RPC atau mekanisme read yang dibatasi | Membaca dan mengubah field yang diizinkan | `updated_by`, konfigurasi internal | Uji bahwa kolom nonpublik tidak dapat dibaca publik dan pelaku tidak dapat dipalsukan |
| `page_content` | Hanya konten/key publik yang memang disediakan website | Membaca dan memperbarui field konten yang diizinkan | Key halaman, referensi aset, metadata dan JSONB | Validasi schema konten; tes stored-XSS dan akses langsung |
| `media_assets` dan Supabase Storage | Membaca objek website yang sengaja publik; tidak dapat upload/update/delete | Mengelola aset yang diizinkan | Path, MIME, ukuran, kepemilikan, operasi hapus | Bucket/policy eksplisit; validasi tipe/ukuran; uji akses object langsung |
| `products` | Hanya kolom publik pada item aktif yang diizinkan tampil | CRUD yang termasuk scope | Harga, status aktif, visibilitas, referensi media | View/endpoint publik terbatas; harga untuk checkout dibaca ulang di database |
| `resources`, `operating_hours` | Hanya kolom resource/jam yang diperlukan form/website | Mengelola resource/jam | Status aktif, parameter booking, pelaku perubahan | Jalur public read terbatas; server memvalidasi booking berdasarkan data terkini |
| `bookings` | Tidak ada SELECT/UPDATE/DELETE langsung; submit hanya melalui jalur yang disetujui | Membaca data booking internal; mengubah status melalui operasi terkontrol | Nama/kontak, catatan, status, `decided_by`, `decision_note`, rentang blocking | Tes status awal `pending`, transisi sah, PII tidak terekspos, concurrency anti-bentrok |
| `orders` | Tidak ada akses | Membaca riwayat; checkout hanya lewat fungsi tepercaya | `client_request_id`, total, nomor order, waktu, pelaku | Uji total manipulasi, idempotency, dan transaksi atomik |
| `order_items` | Tidak ada akses | Membaca snapshot transaksi; pembuatan hanya sebagai bagian checkout | Snapshot nama/harga, kuantitas, total baris | Tidak ada input harga/total tepercaya dari browser; tidak dapat mengubah transaksi selesai |
| `payments` | Tidak ada akses | Membaca pembayaran; satu catatan lunas dibuat dalam checkout atomik | Nominal, metode, `paid_at`, `recorded_by` | Satu payment per order; nominal cocok dengan total; tidak ada DP/refund/void pada MVP |
| View/RPC/database functions | Tidak ada akses kecuali jalur publik terbatas yang eksplisit | Hanya operasi yang perlu dan telah diverifikasi | Semua parameter, grants, `SECURITY DEFINER` | Uji EXECUTE, otorisasi, search path, schema qualification, output minimal |
| Reports/query agregasi | Tidak ada akses | Membaca metrik operasional | Data transaksi, tanggal, metode pembayaran | Akses Owner saja; hasil direkonsiliasi dengan fixture manual |

Nama tabel di atas mengikuti rancangan konseptual `DATABASE.md` tanggal 2026-10-15. Jangan membuat policy terhadap nama lama seperti `profiles`, `business_settings`, `pages`, `catalog_items`, atau `audit_log` tanpa keputusan skema baru dan pembaruan dokumen.

### 5.1 Views dan pembatasan kolom

RLS terutama mengontrol baris. Untuk data publik, pilih pola eksplisit: view dengan daftar kolom yang aman, RPC read-only dengan hasil minimal, atau column privileges yang ditinjau. Periksa apakah view berjalan menggunakan hak pemanggil, misalnya `security_invoker` jika didukung oleh versi PostgreSQL/Supabase yang dipakai. Jangan menganggap view otomatis mewarisi perlindungan seperti yang diharapkan tanpa menguji grants dan perilakunya.

### 5.2 RLS bukan satu-satunya lapisan

- Pastikan tabel dan schema mana yang diekspos ke API.
- Tinjau `GRANT`/`REVOKE` untuk tabel, view, sequence, schema, serta `EXECUTE` function.
- RLS harus aktif pada tabel client-facing dengan policy minimum yang spesifik per operasi.
- Jalur fungsi berprivilege tinggi tidak boleh menjadi bypass untuk policy; otorisasi dan validasi dilakukan di dalam fungsi.
- Uji anonymous dan Owner melalui akses langsung. Jangan menafsirkan hasil UI sebagai bukti RLS.

## 6. Jalur akses khusus

### 6.1 Pengajuan booking publik

Pengunjung dapat mengajukan booking tanpa akun. Namun, anonymous **tidak** boleh mendapat izin tulis umum ke tabel `bookings` atau akses untuk membaca booking lain.

Jalur publik yang disetujui harus:

1. Menerima hanya field yang diperlukan (resource, waktu mulai/selesai, nama, kontak, jumlah orang, catatan opsional).
2. Memvalidasi bentuk/panjang input dan aturan bisnis pada lapisan tepercaya.
3. Memaksa status awal `pending`; mengabaikan atau menolak `status`, ID pelaku, waktu keputusan, dan field internal lain dari client.
4. Memeriksa resource aktif, jam operasional, slot mulai 60 menit, durasi kelipatan 60 menit maksimum 4 jam, horizon 30 hari, zona `Asia/Jakarta`, dan buffer 15 menit sesuai spesifikasi produk.
5. Mengandalkan constraint/operasi database yang aman terhadap konkurensi saat Owner mengonfirmasi booking. Pemeriksaan awal di UI atau query pra-periksa saja tidak cukup.
6. Mengembalikan respons minimal, misalnya bahwa permintaan diterima dan kode referensi acak. Kode itu tidak memberikan izin membaca atau mengubah booking.
7. Tidak mengungkap data pemesan lain, detail ketersediaan internal yang sensitif, SQL, stack trace, atau detail konfigurasi.
8. Menyediakan pemberitahuan penggunaan data kontak dan perlindungan spam sederhana yang telah diputuskan.

DEC-006 (jalur booking publik) dan DEC-017 (anti-abuse) **disetujui (Accepted)** Owner 2026-10-16. Implementasi akhir menggunakan Edge Function sebagai entry point publik dengan operasi database internal; RPC internal tidak diberi `EXECUTE` ke `anon`. Anti-abuse: honeypot + request limiting; Turnstile tidak wajib. Jangan mengizinkan akses `anon` ke fungsi internal jika itu dapat melewati validasi yang dimaksudkan.

### 6.2 Checkout POS

Checkout hanya dijalankan oleh Owner terautentikasi melalui satu jalur terpercaya yang disetujui. Jalur itu harus:

- Memverifikasi Owner melalui sumber identitas tepercaya.
- Menerima ID produk, kuantitas, metode pembayaran yang diizinkan (`cash`, `transfer`, `qris`), dan `client_request_id`; tidak mempercayai total, harga, snapshot, pelaku, atau waktu pembayaran dari browser.
- Memuat harga dan status produk terkini di database; menolak produk nonaktif dan kuantitas invalid.
- Menghitung nominal rupiah sebagai integer tanpa floating-point.
- Membuat order, snapshot `order_items`, dan satu pembayaran lunas dalam satu transaksi database—semua berhasil atau semua rollback.
- Menjamin nomor order unik dan idempotency: request ID yang sama dengan payload sama tidak membuat transaksi kedua; request ID sama dengan payload berbeda ditolak sebagai konflik.
- Mengembalikan hasil transaksi yang telah tersimpan, bukan sekadar mengulang total dari frontend.
- Tidak menyediakan void, refund, DP/pelunasan, diskon, pajak tambahan, stok, atau edit/hapus transaksi selesai pada MVP.

DEC-008 dan DEC-009 **disetujui (Accepted)** Owner 2026-10-16. Uang: IDR integer `bigint` di DB, string di TS/JSON; tanpa floating-point. Kebijakan privilege dan fungsi final tetap harus ditinjau berdasarkan migration nyata.

### 6.3 Supabase Storage dan media

- Pisahkan hak membaca object publik dari hak upload, update, dan delete.
- Hanya aset yang memang ditampilkan di website yang boleh diakses publik; keberadaan URL gambar publik bukan alasan untuk memberi akses tulis publik.
- Tetapkan batas ukuran dan daftar MIME yang diizinkan. Validasi sisi client membantu UX, tetapi policy/lapisan tepercaya harus mencegah operasi tidak sah.
- Tolak file berbahaya/tidak diperlukan. Jangan menerima file yang dapat mengeksekusi script atau menyajikan SVG/HTML aktif tanpa desain dan sanitasi yang jelas.
- Simpan alt text bila diperlukan dan jangan memasukkan metadata berisi data pribadi yang tidak diperlukan.
- Jika implementasi Storage tidak diperlukan pada satu bagian, jangan menambahnya hanya untuk memenuhi rancangan konseptual.

## 7. Aturan database function/RPC

Gunakan `SECURITY INVOKER` dan privilege minimum sebagai default. `SECURITY DEFINER` hanya boleh digunakan bila ada kebutuhan nyata yang terdokumentasi dan review khusus.

Untuk setiap function berprivilege tinggi:

1. Cabut `EXECUTE` dari `PUBLIC` bila tidak dibutuhkan; berikan hanya ke role yang diperlukan.
2. Tetapkan `search_path` yang aman/eksplisit sesuai pola yang diverifikasi dan schema-qualify seluruh objek database yang dirujuk.
3. Verifikasi otorisasi di dalam function, bukan hanya di caller/UI. Jangan menganggap JWT valid otomatis berarti pengguna adalah Owner.
4. Validasi semua parameter, panjang teks, rentang waktu, ID referensi, kuantitas, metode, dan nilai enum/check yang relevan.
5. Jangan menerima parameter privilege seperti `decided_by`, `created_by`, status final, total resmi, harga resmi, `paid_at` tepercaya, atau mapping akun Owner dari browser.
6. Gunakan transaksi database yang atomik untuk checkout dan operasi multi-record terkait.
7. Kembalikan data paling sedikit yang diperlukan oleh caller.
8. Tangani error yang memang dapat ditindaklanjuti (misalnya konflik slot) tanpa membocorkan SQL, nama tabel sensitif, stack trace, atau data pelanggan.
9. Tinjau fungsi internal dan jalur publik secara terpisah. Function yang tidak diekspos langsung masih dapat dipanggil oleh function lain; chain hak akses juga harus diperiksa.
10. Tambahkan test positif dan negatif untuk role yang relevan (Anonymous dan Owner), termasuk akses langsung ke `EXECUTE`.

## 8. Secret, logging, dan respons insiden

### 8.1 Kebijakan secret

| Jenis | Lokasi yang boleh | Lokasi terlarang |
|---|---|---|
| Supabase URL dan publishable key | Frontend/environment `VITE_*`, sesuai penggunaan provider | Tidak boleh dianggap sebagai kontrol akses; jangan memakai key ini sebagai secret |
| Secret key/service role Supabase, password database, secret Edge Function, token privat | Secret storage/runtime server atau mekanisme operator yang disetujui | `VITE_*`, source frontend, bundle browser, Git, log, prompt AI, screenshot, dokumentasi |
| `.env.example` | Nama variable dan placeholder kosong/non-rahasia | Nilai secret atau kredensial nyata |
| Data test/demo | Fixture sintetis | Data pelanggan atau transaksi nyata yang tidak diizinkan |

- Semua `VITE_*` dianggap publik, termasuk jika file environment tidak di-commit.
- File `.env*` lokal harus diabaikan Git sesuai `.gitignore`, dengan pengecualian hanya untuk template aman seperti `.env.example` bila konfigurasinya memang demikian.
- Pisahkan environment development, preview/staging, dan production. Preview tidak menggunakan database production.
- Agent mengikuti larangan membaca secret di `AGENTS.md`. Bila berindikasi secret terekspos, jangan menyalin nilainya ke laporan.

### 8.2 Logging dan pesan error

- Jangan mencatat token, password, secret, URL yang mengandung kredensial, atau body request penuh yang dapat berisi nama/kontak pengunjung.
- Log audit (jika ada) harus menggunakan whitelist field non-sensitif, bukan menyalin payload mentah. Jangan menambahkan `audit_log` sebagai tabel wajib karena rancangan terbaru tidak memasukkannya sebagai entitas MVP.
- Pesan publik harus jelas tetapi minimal. Jangan membocorkan detail booking lain, identitas Owner, SQL, stack trace, atau apakah sebuah record privat tertentu ada.
- Error teknis dapat dicatat secara tersanitasi di server. Error yang diharapkan untuk pengguna—slot sudah tidak tersedia, input invalid, jaringan gagal—memiliki respons aman yang konsisten.
- Jangan menyimpan data kartu pembayaran atau rahasia finansial; MVP hanya mencatat metode pembayaran manual dan jumlah transaksi.

### 8.3 Jika secret diduga terekspos

1. Hentikan tindakan yang bisa memperluas paparan; jangan menyalin secret ke issue/chat/laporan.
2. Beri tahu Owner dengan lokasi dan jenis secret tanpa menyertakan nilainya.
3. Owner/operator menentukan pencabutan atau rotasi melalui layanan asal, memperbarui runtime yang sah, dan deploy ulang bila perlu.
4. Periksa log akses dan dampak yang mungkin terjadi.
5. Bersihkan repository/riwayat sebagai langkah tambahan setelah penanganan secret; penghapusan teks saja bukan rotasi.
6. Catat insiden dan tindak lanjut di `TASK.md` tanpa menulis nilai secret.

AI agent tidak boleh memutuskan sendiri untuk merotasi secret, mengubah environment remote, atau menjalankan tindakan pemulihan yang berdampak pada pengguna.

## 9. Checklist keamanan untuk tabel, function, dan jalur baru

- [ ] Model akses mengikuti satu aktor publik dan satu akun Owner; tidak menyisipkan Staff tanpa scope baru yang disetujui.
- [ ] Setiap tabel client-facing memiliki RLS aktif dan policy yang spesifik per operasi.
- [ ] Grants schema/table/view/sequence/function sudah ditinjau; akses tidak dibutuhkan dicabut secara eksplisit.
- [ ] Field sensitif (identitas Owner, status booking, nominal, snapshot, pelaku, catatan internal) tidak dapat dimanipulasi browser.
- [ ] Jalur view/RPC/Edge Function/Storage diuji terpisah dan menegakkan aturan yang setara.
- [ ] Public endpoint hanya mengembalikan field yang memang aman dipublikasikan.
- [ ] Test akses positif dan negatif dilakukan melalui API/database secara langsung.
- [ ] Booking diuji untuk status awal `pending`, status/transisi tidak sah, buffer, overlap, dan konfirmasi konkuren.
- [ ] Checkout diuji untuk manipulasi harga/total, product nonaktif, kuantitas invalid, atomic rollback, request duplikat, dan request ID dengan payload berbeda.
- [ ] Storage upload diuji dengan tipe/ukuran diizinkan dan ditolak bila fitur media dipakai.
- [ ] Secret scan/diff review tidak menampilkan secret, log debug, atau data pelanggan.
- [ ] Generated types dan dokumentasi disinkronkan setelah schema berubah.
- [ ] Hasil test dicatat hanya setelah test benar-benar dijalankan.

Katalog test formal dan ID `TEST-*` harus direkonsiliasi di `TESTING.md` melalui TITIS-010. Jangan menyalin ID test lama yang masih mengasumsikan Staff, DP, refund, void, atau multi-role tanpa audit.

## 10. Security gate

Rilis tidak boleh disetujui bila ditemukan salah satu kondisi berikut dan belum diperbaiki serta diuji ulang:

- Anonymous dapat membaca data kontak booking, transaksi, detail order, payment, data Owner, atau laporan internal.
- Anonymous dapat menetapkan status final, memalsukan pelaku, atau membaca/mengubah booking lain melalui ID/kode referensi.
- Pengguna tanpa sesi Owner yang sah dapat melakukan operasi dashboard melalui query langsung, view, RPC, function, atau Storage.
- Secret berada di frontend, bundle, Git, log, screenshot, atau dokumentasi.
- Tabel yang diekspos tidak memiliki RLS/grants yang sesuai dan test akses langsung.
- Fungsi `SECURITY DEFINER` memiliki `EXECUTE` terlalu luas, `search_path` berisiko, objek yang tidak schema-qualified, atau tidak memverifikasi otorisasi.
- Booking yang bertabrakan sama-sama berhasil dikonfirmasi; buffer yang disetujui tidak ditegakkan.
- Checkout mempercayai total browser, meninggalkan record parsial, atau membuat transaksi kedua saat retry yang sama.
- Owner dapat mengubah transaksi selesai melalui jalur aplikasi yang tidak diizinkan scope MVP.
- Log/error mengekspos data pribadi atau detail internal yang tidak diperlukan.

Temuan lain harus dicatat sebagai risiko/known issue dengan severity, dampak, mitigasi, dan persetujuan yang sesuai. Jangan menyatakan “aman sempurna”; nyatakan pemeriksaan spesifik yang benar-benar dilakukan.

## 11. Model ancaman

| ID | Ancaman | Dampak | Mitigasi yang direncanakan | Bukti yang perlu dikumpulkan |
|---|---|---|---|---|
| THR-01 | Anonymous menulis kolom booking selain input yang diizinkan | Status palsu atau data rusak | Tidak ada write umum; satu jalur publik terbatas; status `pending` dipaksa | Test payload status/pelaku tambahan ditolak/diabaikan |
| THR-02 | Pengunjung membaca booking/contact orang lain | Kebocoran PII | Tidak ada SELECT publik; respons minimal; kode referensi bukan otorisasi | Test akses langsung ke ID dan reference code |
| THR-03 | Sesi non-Owner mengakses dashboard/data internal | Pengambilalihan fungsi bisnis | Verifikasi Owner pada layer data/function, RLS dan grants | Test anonymous/sesi tidak sah untuk tiap jalur |
| THR-04 | Secret masuk `VITE_*`, Git, bundle, atau log | Pengambilalihan project/data | Secret server-only, ignore rules, diff/bundle review | Pemeriksaan source, tracked files, dan bundle tanpa mengekspos nilai |
| THR-05 | Dua konfirmasi booking overlap sama-sama sukses | Jadwal/resource bentrok | Constraint database dan transaksi/status update aman concurrency | Integration test dengan request bersamaan |
| THR-06 | Buffer booking dilewati | Waktu pemesanan berdekatan melanggar aturan | Representasi blocking interval atau enforcement tepercaya yang setara | Test batas interval serta buffer 15 menit |
| THR-07 | Harga/total dimanipulasi di browser | Nilai transaksi salah | Harga dan total dihitung/validasi di database | Test harga/total palsu tidak mengubah hasil tersimpan |
| THR-08 | Checkout gagal di tengah proses | Order/item/payment tidak konsisten | Satu transaksi database atomik | Test rollback yang membuktikan tidak ada record parsial |
| THR-09 | Retry/double-submit membuat transaksi kedua | Penjualan ganda | Unique request ID dan logika idempotency | Test retry identik dan request ID sama dengan payload berbeda |
| THR-10 | Spam pada endpoint booking | Data palsu/penyalahgunaan kapasitas | Validasi dan perlindungan anti-abuse yang disetujui | Test/rate control yang sesuai dengan DEC-017 final |
| THR-11 | Stored XSS/injection lewat konten CMS atau catatan | Eksekusi script atau kompromi sesi | Konten terstruktur, schema validation, renderer aman, pembatasan input | Test payload markup/script berbahaya |
| THR-12 | Upload file berbahaya atau terlalu besar | Penyajian konten aktif, konsumsi storage | Bucket/policy, MIME/ukuran, aturan file allow-list | Test file yang diizinkan dan yang ditolak |
| THR-13 | Migration atau perubahan manual merusak production | Kehilangan/korupsi data | Migration di Git, uji non-production, approval dan recovery plan | Review migration dan bukti test/release checklist |
| THR-14 | Enumerasi/brute force atau prosedur bootstrap Owner lemah | Akun Owner diambil alih | Signup publik nonaktif, bootstrap terkontrol, konfigurasi Auth sesuai kemampuan provider | Test/signup config dan dokumentasi bootstrap yang diverifikasi |
| THR-15 | Grants/function memberi bypass RLS | Eskalasi hak atau data bocor | Least privilege, review `SECURITY DEFINER`, uji EXECUTE/jalur alternatif | Review grant dan test langsung pada function/view |
| THR-16 | Agent AI melakukan tindakan di luar otorisasi | Perubahan tak terkendali atau secret terekspos | `AGENTS.md`, scope per task, diff review, konfirmasi command berisiko | Review tindakan dan laporan task/evidence |

## 12. Autentikasi dan pengelolaan akun Owner

- MVP memiliki satu akun Owner dan tidak menyediakan signup publik.
- Metode Auth, mapping ke profil Owner, prosedur bootstrap pertama, pemulihan/ganti Owner, dan pencabutan akses mengikuti **DEC-016 (Accepted, Owner 2026-10-16)**.
- Sumber otorisasi harus dapat dipercaya dan tidak dikendalikan melalui metadata yang dapat diedit pengguna sendiri. Bila `owner_profiles` digunakan, mapping harus dibuat/dikelola lewat jalur operator/tepercaya yang terdokumentasi.
- Akun yang tidak aktif atau tidak lagi cocok dengan mapping Owner tidak boleh melakukan operasi bisnis. Kegagalan membaca sumber otorisasi harus menghasilkan penolakan, bukan pemberian akses.
- Prosedur login, logout, session expiry, reset password, redirect URL, dan error message harus diuji menggunakan kemampuan Supabase Auth versi aktual. Pesan login tidak perlu membocorkan apakah email tertentu terdaftar.
- Tidak ada kebijakan password/session buatan sendiri yang boleh diklaim aktif sebelum konfigurasi layanan benar-benar diverifikasi.

## 13. Kebijakan pelaporan kerentanan publik

Proyek masih dalam tahap perencanaan. Bagian ini merupakan rancangan kebijakan, **bukan pernyataan bahwa saluran pelaporan publik telah aktif**.

### 13.1 Status saat ini

- Jangan mengiklankan penerimaan laporan kerentanan melalui email, issue tracker, atau program bug bounty sebelum saluran resmi dibuat dan diuji.
- Temuan internal selama pembangunan dilaporkan langsung kepada Owner melalui proses proyek.
- Jangan mencantumkan alamat kontak keamanan yang belum dibuat atau diverifikasi.

### 13.2 Syarat aktivasi sebelum rilis publik

- [ ] Owner menyetujui teks kebijakan dan saluran pelaporan.
- [ ] Alamat/email atau mekanisme pelaporan telah dikonfigurasi dan diuji.
- [ ] Scope aset yang tercakup dan tidak tercakup ditetapkan.
- [ ] Prosedur penerimaan, triase, perbaikan, dan coordinated disclosure ditulis.
- [ ] Target waktu respons yang realistis disepakati; jangan menjanjikan SLA yang belum dapat dipenuhi.
- [ ] Cara memberi credit kepada pelapor dan opsi anonimitas dijelaskan.
- [ ] Dokumentasi kontribusi/release yang relevan diperiksa bersama task rilis di `TASK.md`.

### 13.3 Penanganan laporan setelah aktivasi

1. Catat laporan pada saluran yang ditetapkan dan konfirmasi penerimaan sesuai prosedur yang disetujui.
2. Triase dampak dan reproduksi dalam lingkungan aman tanpa mengakses data yang tidak diperlukan.
3. Batasi akses detail laporan pada pihak yang perlu mengetahuinya; jangan mempublikasikan detail eksploit sebelum mitigasi siap.
4. Terapkan perbaikan lewat perubahan yang direview dan diuji.
5. Koordinasikan pengungkapan publik setelah perbaikan/mitigasi diverifikasi dan sesuai persetujuan Owner.
6. Berikan credit sesuai keinginan pelapor dan batas privasi yang disepakati.

---

## Catatan status dokumen

Review dokumen dilakukan melalui `TASK.md` → TITIS-008. Sebelum menandai task `Done`, cocokkan matriks izin dan desain ini dengan `PRD.md`, `ARCHITECTURE.md`, serta `DATABASE.md`; selaraskan katalog test melalui TITIS-010; dan catat bukti tinjauan aktual. Semua DEC kini `Accepted` (Owner 2026-10-16).
