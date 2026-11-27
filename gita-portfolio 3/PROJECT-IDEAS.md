# Ide project Semester 4–8
Ide ini dikeluarkan dari website supaya Semester 4–8 kosong dulu. Saat sudah dikerjakan, tambahkan lewat dashboard `/admin` → Projects (salin teks di bawah ke form, status → published). Semua ide masih boleh diganti.

## Semester 4 — Mini Library — Borrowing System
- Kategori: Web App / Aplikasi Web
- Deskripsi (EN): A web app for a small library to manage books, members, and borrowing.
- Deskripsi (ID): Aplikasi web untuk perpustakaan kecil mengelola buku, anggota, dan peminjaman.
- Masalah (EN): Borrowing is recorded by hand, so due dates, late fines, and book availability are often wrong.
- Masalah (ID): Peminjaman dicatat manual sehingga tanggal kembali, denda, dan ketersediaan buku sering keliru.
- Solusi (EN): A database-backed app with a catalog, member login, automatic due dates, and fine calculation, with a separate admin panel for the librarian.
- Solusi (ID): Aplikasi berbasis database dengan katalog, login anggota, tanggal kembali otomatis, dan hitungan denda, plus panel admin terpisah untuk pustakawan.
- Fitur (EN): Book catalog with search; Member and admin roles; Automatic due date and fine; Borrowing history report
- Fitur (ID): Katalog buku dengan pencarian; Peran anggota dan admin; Tanggal kembali dan denda otomatis; Laporan riwayat peminjaman
- Tools: Laravel, PHP, MySQL, Tailwind CSS, Git
- Peran: Full-stack Developer / Full-stack Developer

## Semester 4 — Study Habit Dashboard
- Kategori: Data & Analytics / Data & Analitik
- Deskripsi (EN): A dashboard that turns my daily study log into charts and simple insights.
- Deskripsi (ID): Dashboard yang mengubah catatan belajar harianku menjadi grafik dan insight sederhana.
- Masalah (EN): I study a lot but cannot tell which courses get the most time or when I am most productive.
- Masalah (ID): Aku banyak belajar tetapi tidak tahu mata kuliah mana yang paling banyak menyita waktu atau kapan aku paling produktif.
- Solusi (EN): Log study sessions in a short form, then read weekly trends: hours per course, best time of day, and streaks.
- Solusi (ID): Catat sesi belajar lewat form singkat, lalu lihat tren mingguan: jam per mata kuliah, waktu terbaik, dan konsistensi harian.
- Fitur (EN): Quick study-session form; Weekly and monthly charts; Hours per course; Export data to CSV
- Fitur (ID): Form sesi belajar cepat; Grafik mingguan dan bulanan; Jam belajar per mata kuliah; Ekspor data ke CSV
- Tools: Python, Pandas, Streamlit, Plotly, SQLite
- Peran: Solo Developer & Analyst / Developer & Analis Mandiri

## Semester 5 — Course Catalog REST API
- Kategori: Backend / API / Backend / API
- Deskripsi (EN): A documented REST API that serves course, lecturer, and schedule data.
- Deskripsi (ID): REST API terdokumentasi yang menyediakan data mata kuliah, dosen, dan jadwal.
- Masalah (EN): Course and schedule information lives in separate files, so every app that needs it has to copy the data again.
- Masalah (ID): Informasi mata kuliah dan jadwal ada di file terpisah, sehingga setiap aplikasi yang membutuhkannya harus menyalin ulang datanya.
- Solusi (EN): A single API with token-based authentication, clear endpoints, input validation, and an API doc that other projects can reuse.
- Solusi (ID): Satu API dengan autentikasi berbasis token, endpoint yang jelas, validasi input, dan dokumentasi yang bisa dipakai proyek lain.
- Fitur (EN): CRUD for courses, lecturers, schedules; JWT authentication; Pagination and filtering; Postman collection and docs
- Fitur (ID): CRUD mata kuliah, dosen, jadwal; Autentikasi JWT; Paginasi dan filter; Koleksi Postman dan dokumentasi
- Tools: Node.js, Express, PostgreSQL, JWT, Postman
- Peran: Backend Developer / Backend Developer

## Semester 5 — UMKM Catalog — Online Storefront
- Kategori: Web App / Aplikasi Web
- Deskripsi (EN): A simple online catalog for small local sellers, with ordering through WhatsApp.
- Deskripsi (ID): Katalog online sederhana untuk penjual UMKM lokal dengan pemesanan lewat WhatsApp.
- Masalah (EN): Small sellers share products as photos in chats, which is hard to browse, and full e-commerce platforms feel too heavy and costly.
- Masalah (ID): Penjual kecil membagikan produk lewat foto di chat sehingga sulit ditelusuri, sedangkan platform e-commerce lengkap terasa berat dan mahal.
- Solusi (EN): A fast catalog page with categories and search. Buyers tap one button to send a prepared order message, and the seller updates products from an admin page.
- Solusi (ID): Halaman katalog cepat dengan kategori dan pencarian. Pembeli cukup menekan satu tombol untuk mengirim pesan pesanan yang sudah disiapkan, dan penjual memperbarui produk dari halaman admin.
- Fitur (EN): Product catalog with categories; Order via WhatsApp button; Admin page to edit products; Responsive on phones
- Fitur (ID): Katalog produk dengan kategori; Tombol pesan via WhatsApp; Halaman admin untuk edit produk; Responsif di ponsel
- Tools: React, Vite, Supabase, Tailwind CSS, Vercel
- Peran: Full-stack Developer / Full-stack Developer

## Semester 6 — Algorithm Visualizer
- Kategori: Interactive Web / Web Interaktif
- Deskripsi (EN): An interactive page that animates sorting and searching algorithms step by step.
- Deskripsi (ID): Halaman interaktif yang menganimasikan algoritma pengurutan dan pencarian langkah demi langkah.
- Masalah (EN): Algorithms are hard to picture from code and static diagrams alone, especially for beginners.
- Masalah (ID): Algoritma sulit dibayangkan hanya dari kode dan diagram statis, terutama bagi pemula.
- Solusi (EN): Animate every comparison and swap, let users control speed and input size, and show the matching code line and complexity next to the animation.
- Solusi (ID): Menganimasikan setiap perbandingan dan pertukaran, pengguna bisa mengatur kecepatan dan ukuran data, dengan baris kode dan kompleksitasnya tampil di samping animasi.
- Fitur (EN): Bubble, selection, insertion, merge, quick sort; Play, pause, and step controls; Speed and array size sliders; Highlighted pseudocode
- Fitur (ID): Bubble, selection, insertion, merge, quick sort; Kontrol play, pause, dan langkah; Slider kecepatan dan ukuran array; Pseudocode yang ter-highlight
- Tools: React, Framer Motion, JavaScript, Figma
- Peran: Developer & Designer / Developer & Desainer

## Semester 6 — Smart Plant Monitor (IoT)
- Kategori: IoT / Hardware / IoT / Perangkat Keras
- Deskripsi (EN): A soil-moisture sensor that reports to a web dashboard and waters the plant automatically.
- Deskripsi (ID): Sensor kelembapan tanah yang melapor ke dashboard web dan menyiram tanaman secara otomatis.
- Masalah (EN): Plants are overwatered or forgotten when people are busy, and there is no way to check them remotely.
- Masalah (ID): Tanaman kelebihan air atau terlupakan saat pemiliknya sibuk, dan tidak ada cara untuk memeriksanya dari jauh.
- Solusi (EN): A microcontroller reads soil moisture, runs a small pump when it is too dry, and sends readings to a dashboard with history and alerts.
- Solusi (ID): Mikrokontroler membaca kelembapan tanah, menyalakan pompa kecil saat terlalu kering, dan mengirim data ke dashboard lengkap dengan riwayat dan notifikasi.
- Fitur (EN): Live moisture reading; Automatic watering threshold; History chart on the dashboard; Low-water alert
- Fitur (ID): Pembacaan kelembapan langsung; Ambang penyiraman otomatis; Grafik riwayat di dashboard; Notifikasi air habis
- Tools: Arduino IDE, ESP32, C++, Supabase, React
- Peran: Hardware & Software Developer / Developer Hardware & Software

## Semester 7 — Interactive Learning Media for Programming Basics
- Kategori: Educational Technology / Teknologi Pendidikan
- Deskripsi (EN): A web-based learning medium that teaches programming logic to high-school students.
- Deskripsi (ID): Media pembelajaran berbasis web yang mengajarkan logika pemrograman kepada siswa SMA.
- Masalah (EN): Students find variables, conditions, and loops abstract, and printed material does not give them a place to try things out.
- Masalah (ID): Siswa menganggap variabel, percabangan, dan perulangan itu abstrak, sedangkan materi cetak tidak memberi ruang untuk mencoba langsung.
- Solusi (EN): Short lessons with live examples, mini challenges with instant feedback, and a progress page. I will test it in a class and measure learning gains with a pre-test and post-test.
- Solusi (ID): Materi singkat dengan contoh langsung, tantangan kecil dengan umpan balik instan, dan halaman progres. Akan diuji di kelas dan peningkatan belajarnya diukur dengan pre-test dan post-test.
- Fitur (EN): Lessons with runnable examples; Challenges with instant feedback; Student progress page; Teacher guide and evaluation form
- Fitur (ID): Materi dengan contoh yang bisa dijalankan; Tantangan dengan umpan balik instan; Halaman progres siswa; Panduan guru dan formulir evaluasi
- Tools: React, Supabase, Figma, Google Forms, Vercel
- Peran: Developer, Designer & Researcher / Developer, Desainer & Peneliti

## Semester 8 — Local AI Study Assistant (Research)
- Kategori: Research / AI / Riset / AI
- Deskripsi (EN): A study assistant that runs a local language model and answers questions from course notes.
- Deskripsi (ID): Asisten belajar yang menjalankan model bahasa lokal dan menjawab pertanyaan dari catatan kuliah.
- Masalah (EN): Cloud AI tools need an internet connection and sending notes to a third party, and their answers are not always tied to what was taught in class.
- Masalah (ID): Alat AI berbasis cloud butuh internet dan mengirim catatan ke pihak ketiga, dan jawabannya belum tentu sesuai materi yang diajarkan di kelas.
- Solusi (EN): Run a model locally and retrieve answers from my own course notes, then study how well it helps students understand, using a short survey and comparison.
- Solusi (ID): Menjalankan model secara lokal dan mengambil jawaban dari catatan kuliahku sendiri, lalu meneliti seberapa membantu pemahaman mahasiswa lewat survei singkat dan perbandingan.
- Fitur (EN): Chat over uploaded notes; Answers cite the source note; Works offline; Evaluation survey and results
- Fitur (ID): Chat berdasarkan catatan yang diunggah; Jawaban menyebut catatan sumbernya; Bisa dipakai offline; Survei evaluasi dan hasilnya
- Tools: Ollama, Python, React, PostgreSQL, Git
- Peran: Researcher & Developer / Peneliti & Developer
