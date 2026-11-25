# Portfolio + Admin (Supabase) — panduan final

## A. Langkah memasukkan ke Supabase (sekali saja, urut)
1. **SQL Editor → New query** → tempel isi `supabase/01-setup.sql` → **Run**.
   (Aman untuk project baru maupun yang sudah pernah menjalankan SQL versi lama.)
2. **SQL Editor** → tempel isi `supabase/02-seed.sql` → **Run**.
   Mengisi konten awal: 11 project (StudyQueue, EcoSort, dll — sekarang bisa diedit/dihapus di admin), Semester 1–8 + terjemahan Indonesia, checkpoint About, kontak. Aman diulang, tidak menimpa editanmu.
3. **Authentication → Providers → Email**: matikan **Allow new users to sign up**.
4. **Authentication → Users → Add user**: email + password kuat, centang *Auto Confirm User*.
5. Buka `supabase/03-make-admin.sql`, ganti `EMAIL-KAMU@gmail.com` dengan email di langkah 4 → **Run**. Harus muncul 1 baris hasil.
6. `.env` sudah berisi URL + anon key. (Hanya **anon** key; jangan pernah pakai service_role di frontend.)
7. `npm install` → `npm run dev` → website di `http://localhost:5173/`, admin di `http://localhost:5173/admin`.

## B. Yang bisa diedit di admin
| Menu | Isi |
|---|---|
| Projects | Semua teks **EN + ID** (judul, deskripsi, kategori, masalah, solusi, fitur, peran, yang dipelajari), semester, urutan, teknologi, gambar, link, draft/publish |
| About Me (bio) | Bio EN/ID |
| Peta About (checkpoint) | 4 titik peta: tag, judul, ringkas, cerita, chips (EN/ID) + gambar |
| Learning Journey | Halaman Semester 1–8: tagline, judul, pembuka, deskripsi, refleksi (EN/ID), tech, progress, draft/publish |
| Bidang & Showcase | Bidang tiap semester: nama, mata kuliah, deskripsi, catatan (EN/ID) + gambar |
| Certificates / Publications | Data, gambar, link, urutan (Publications juga EN/ID) |
| Contact & Sosial Media | Email, GitHub, LinkedIn, Instagram, **TikTok**, teks tampil tiap link, link lain. Kolom kosong = disembunyikan |
| Umum: CV, Foto, Tab | **CV** (unggah PDF / link, versi EN & ID), foto hero, judul tab, deskripsi SEO, favicon |
| Teks Website (EN/ID) | Semua teks tetap: tombol, judul section, label, footer, "hi!", nama di hero, dll |
| Media | Semua file yang pernah diunggah |
| Dashboard | Ringkasan + **Unduh backup** (JSON) |

Aturan umum: kolom (ID) kosong → website otomatis memakai versi EN. Kolom bertanda *satu per baris* diisi satu item per baris.

## C. Catatan
- Database terhubung = database satu-satunya sumber. Project yang dihapus di admin benar-benar hilang. Isi `data.js` hanya dipakai kalau Supabase tidak bisa dijangkau.
- Sertifikat kosong → section tampil pesan "segera hadir". Tombol Download CV muncul hanya kalau CV sudah diisi.
- Kalau kamu mengubah konten bawaan di `src/data.js`/`src/i18n.js`: `node scripts/generate-seed.mjs` membuat ulang `02-seed.sql`.

## D. Deploy (Vercel)
Tambahkan dua environment variable yang sama (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). `vercel.json` sudah mengarahkan `/admin` ke aplikasi. Setelah deploy, tambahkan domain situs di Supabase → Authentication → URL Configuration.

## E. Keamanan
RLS aktif di semua tabel: publik hanya membaca baris `published`; tulis hanya user di tabel `admins`. Upload hanya admin (gambar maks 5 MB, PDF maks 10 MB). Input divalidasi di dashboard dan database.
