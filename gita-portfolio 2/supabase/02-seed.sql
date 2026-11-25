-- 02-seed.sql — isi awal konten (diambil dari website lama). Aman dijalankan ulang: TIDAK menimpa editan kamu di admin.
-- Semua statement sederhana tanpa alias, supaya jalan di SQL Editor Supabase.

insert into public.journey_steps (position, tag_en, tag_id, title_en, title_id, short_en, short_id, story_en, story_id, chips_en, chips_id) values
(1, 'Background', 'Latar Belakang', 'Education', 'Pendidikan', 'Building my foundation in programming, algorithms, data structures, and software development.', 'Membangun fondasi di pemrograman, algoritma, struktur data, dan pengembangan software.', 'Currently pursuing a degree in Informatics, where I''m building my foundation in programming, algorithms, data structures, and software development.', 'Saat ini saya menempuh pendidikan di bidang Informatika, tempat saya membangun fondasi dalam pemrograman, algoritma, struktur data, dan pengembangan software.', 'Informatics, University Student, Semester 3', 'Informatika, Mahasiswa, Semester 3'),
(2, 'Interests', 'Ketertarikan', 'Interests', 'Ketertarikan', 'Software development, creative technology, and problem solving.', 'Software development, teknologi kreatif, dan pemecahan masalah.', 'I''m passionate about software development, creative technology, and designing digital experiences. I enjoy combining logical thinking with creativity to turn ideas into useful applications.', 'Saya antusias dengan pengembangan software, teknologi kreatif, dan merancang pengalaman digital. Saya suka memadukan logika dengan kreativitas untuk mengubah ide menjadi aplikasi yang berguna.', 'Software Development, Creative Tech, Problem Solving', 'Software Development, Teknologi Kreatif, Pemecahan Masalah'),
(3, 'Focus', 'Fokus', 'Currently Learning', 'Sedang Kupelajari', 'Expanding my knowledge through new tools and hands-on projects.', 'Terus memperluas ilmu lewat tools baru dan proyek langsung.', 'I''m continuously expanding my knowledge in technology and software development. Exploring different tools, discovering new approaches, and gaining experience through hands-on projects.', 'Saya terus memperluas pengetahuan di bidang teknologi dan pengembangan software: menjelajahi berbagai tools, menemukan pendekatan baru, dan mengumpulkan pengalaman lewat proyek langsung.', 'Technology, Software Development, Creative Exploration, Self Growth', 'Teknologi, Software Development, Eksplorasi Kreatif, Pengembangan Diri'),
(4, 'Direction', 'Arah', 'Goals', 'Tujuan', 'Becoming a Software Developer who builds meaningful, user-friendly applications.', 'Menjadi Software Developer yang membangun aplikasi bermakna dan mudah digunakan.', 'My goal is to become a skilled Software Developer who can build meaningful, functional, and user-friendly applications. I hope to keep growing through real-world projects, collaboration, and continuous learning.', 'Tujuan saya adalah menjadi Software Developer yang terampil dan mampu membangun aplikasi yang bermakna, fungsional, dan ramah pengguna. Saya berharap terus berkembang lewat proyek nyata, kolaborasi, dan pembelajaran tanpa henti.', 'Software Developer, Build Projects, Continuous Growth', 'Software Developer, Membangun Proyek, Berkembang Terus')
on conflict (position) do nothing;

insert into public.site_settings (key, value) values
('about', '{"lead_en":"I''m an Informatics Education student with a growing interest in software development, technology, and creative problem-solving. I enjoy exploring how things work, learning new concepts, and turning ideas into practical projects. From programming and digital design to educational technology, I''m always curious to discover new possibilities and grow through every experience.","lead_id":"Saya mahasiswa Pendidikan Informatika dengan minat yang terus tumbuh pada pengembangan software, teknologi, dan pemecahan masalah secara kreatif. Saya suka menjelajahi cara kerja berbagai hal, mempelajari konsep baru, dan mengubah ide menjadi proyek yang praktis. Mulai dari pemrograman dan desain digital hingga teknologi pendidikan, saya selalu penasaran menemukan kemungkinan baru dan bertumbuh lewat setiap pengalaman."}'::jsonb),
('contact', '{"email":"gitaacahyaaa@gmail.com","github":"https://github.com/gitaacahyaaa","linkedin":"https://www.linkedin.com/in/ni-luh-gede-gita-cahya-narayani-746859376","instagram":"https://www.instagram.com/gittaaccn","tiktok":"","extra":""}'::jsonb),
('general', '{}'::jsonb),
('texts', '{}'::jsonb)
on conflict (key) do nothing;

insert into public.semester_journeys (semester, progress, tagline, tagline_id, headline, headline_id, lead, lead_id, intro, intro_id, tech_learning, tech_explored, tech_used, reflection, reflection_id) values
(1, 'completed', 'Building the Foundation', 'Membangun Fondasi', 'The Foundation', 'Sang Fondasi', 'Where my learning journey began.', 'Tempat perjalanan belajarku dimulai.', 'Semester 1 was about building the fundamentals of education, mathematics, and computer technology. These subjects shaped the way I understand technology and its role in learning.', 'Semester 1 adalah tentang membangun dasar-dasar pendidikan, matematika, dan teknologi komputer. Mata kuliah ini membentuk cara pandangku terhadap teknologi dan perannya dalam pembelajaran.', array[]::text[], array[]::text[], array[]::text[], null, null),
(2, 'completed', 'Exploring Programming & Data', 'Menjelajahi Pemrograman & Data', null, null, null, null, null, null, array[]::text[], array[]::text[], array[]::text[], null, null),
(3, 'current', 'Programming & Creative Development', 'Pemrograman & Pengembangan Kreatif', null, null, null, null, null, null, array['Java', 'Figma', 'Illustrator']::text[], array[]::text[], array[]::text[], null, null),
(4, 'upcoming', 'Exploring Modern Technology', 'Menjelajahi Teknologi Modern', null, null, null, null, null, null, array[]::text[], array[]::text[], array[]::text[], null, null),
(5, 'upcoming', 'Expanding Development Skills', 'Memperluas Keterampilan Pengembangan', null, null, null, null, null, null, array[]::text[], array[]::text[], array[]::text[], null, null),
(6, 'upcoming', 'Building Interactive Solutions', 'Membangun Solusi Interaktif', null, null, null, null, null, null, array[]::text[], array[]::text[], array[]::text[], null, null),
(7, 'upcoming', 'Applying Knowledge in Education', 'Menerapkan Ilmu dalam Pendidikan', null, null, null, null, null, null, array[]::text[], array[]::text[], array[]::text[], null, null),
(8, 'upcoming', 'Research & Professional Growth', 'Riset & Pertumbuhan Profesional', null, null, null, null, null, null, array[]::text[], array[]::text[], array[]::text[], null, null)
on conflict (semester) do update set tagline_id = coalesce(nullif(semester_journeys.tagline_id, ''), excluded.tagline_id), headline_id = coalesce(nullif(semester_journeys.headline_id, ''), excluded.headline_id), lead_id = coalesce(nullif(semester_journeys.lead_id, ''), excluded.lead_id), intro_id = coalesce(nullif(semester_journeys.intro_id, ''), excluded.intro_id), reflection_id = coalesce(nullif(semester_journeys.reflection_id, ''), excluded.reflection_id);

-- Bidang pengetahuan: ditambah hanya kalau belum ada; terjemahan ID dilengkapi hanya kalau masih kosong
insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select 1, 0, 'Mathematical Foundations', 'Fondasi Matematika', 'Engineering Mathematics
Linear Algebra', 'Matematika Teknik
Aljabar Linear', 'Mathematical reasoning, equations, matrices, and basic linear algebra concepts.', 'Penalaran matematis, persamaan, matriks, dan konsep dasar aljabar linear.'
where not exists (select 1 from public.semester_areas where semester = 1 and name = 'Mathematical Foundations');
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), 'Fondasi Matematika'), courses_id = coalesce(nullif(courses_id, ''), 'Matematika Teknik
Aljabar Linear'), description_id = coalesce(nullif(description_id, ''), 'Penalaran matematis, persamaan, matriks, dan konsep dasar aljabar linear.') where semester = 1 and name = 'Mathematical Foundations';

insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select 1, 1, 'Computer Fundamentals', 'Dasar-dasar Komputer', 'Computer Organization and Architecture', 'Organisasi dan Arsitektur Komputer', 'Understanding computer components, hardware, architecture, and how computer systems work.', 'Memahami komponen komputer, perangkat keras, arsitektur, dan cara kerja sistem komputer.'
where not exists (select 1 from public.semester_areas where semester = 1 and name = 'Computer Fundamentals');
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), 'Dasar-dasar Komputer'), courses_id = coalesce(nullif(courses_id, ''), 'Organisasi dan Arsitektur Komputer'), description_id = coalesce(nullif(description_id, ''), 'Memahami komponen komputer, perangkat keras, arsitektur, dan cara kerja sistem komputer.') where semester = 1 and name = 'Computer Fundamentals';

insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select 1, 2, 'Educational Foundations', 'Fondasi Pendidikan', 'Educational Insights
Philosophy of Indonesian Education
Inclusive Education', 'Wawasan Kependidikan
Filsafat Pendidikan Indonesia
Pendidikan Inklusif', 'Understanding education, teaching principles, educational philosophy, and inclusive learning.', 'Memahami pendidikan, prinsip mengajar, filsafat pendidikan, dan pembelajaran yang inklusif.'
where not exists (select 1 from public.semester_areas where semester = 1 and name = 'Educational Foundations');
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), 'Fondasi Pendidikan'), courses_id = coalesce(nullif(courses_id, ''), 'Wawasan Kependidikan
Filsafat Pendidikan Indonesia
Pendidikan Inklusif'), description_id = coalesce(nullif(description_id, ''), 'Memahami pendidikan, prinsip mengajar, filsafat pendidikan, dan pembelajaran yang inklusif.') where semester = 1 and name = 'Educational Foundations';

insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select 1, 3, 'Communication & Citizenship', 'Komunikasi & Kewarganegaraan', 'English
Pancasila', 'Bahasa Inggris
Pancasila', 'Developing communication skills, critical thinking, and understanding civic values.', 'Mengembangkan kemampuan komunikasi, berpikir kritis, dan memahami nilai-nilai kewarganegaraan.'
where not exists (select 1 from public.semester_areas where semester = 1 and name = 'Communication & Citizenship');
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), 'Komunikasi & Kewarganegaraan'), courses_id = coalesce(nullif(courses_id, ''), 'Bahasa Inggris
Pancasila'), description_id = coalesce(nullif(description_id, ''), 'Mengembangkan kemampuan komunikasi, berpikir kritis, dan memahami nilai-nilai kewarganegaraan.') where semester = 1 and name = 'Communication & Citizenship';

insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select 2, 0, 'Algorithms and Programming (C++)', 'Algoritma dan Pemrograman (C++)', null, null, null, null
where not exists (select 1 from public.semester_areas where semester = 2 and name = 'Algorithms and Programming (C++)');
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), 'Algoritma dan Pemrograman (C++)'), courses_id = coalesce(nullif(courses_id, ''), null), description_id = coalesce(nullif(description_id, ''), null) where semester = 2 and name = 'Algorithms and Programming (C++)';

insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select 2, 1, 'Database Fundamentals (SQL), PHP', 'Dasar Basis Data (SQL), PHP', null, null, null, null
where not exists (select 1 from public.semester_areas where semester = 2 and name = 'Database Fundamentals (SQL), PHP');
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), 'Dasar Basis Data (SQL), PHP'), courses_id = coalesce(nullif(courses_id, ''), null), description_id = coalesce(nullif(description_id, ''), null) where semester = 2 and name = 'Database Fundamentals (SQL), PHP';

insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select 2, 2, 'Basic Statistics (SPSS)', 'Statistika Dasar (SPSS)', null, null, null, null
where not exists (select 1 from public.semester_areas where semester = 2 and name = 'Basic Statistics (SPSS)');
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), 'Statistika Dasar (SPSS)'), courses_id = coalesce(nullif(courses_id, ''), null), description_id = coalesce(nullif(description_id, ''), null) where semester = 2 and name = 'Basic Statistics (SPSS)';

insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select 2, 3, 'Information Systems (SDLC)', 'Sistem Informasi (SDLC)', null, null, null, null
where not exists (select 1 from public.semester_areas where semester = 2 and name = 'Information Systems (SDLC)');
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), 'Sistem Informasi (SDLC)'), courses_id = coalesce(nullif(courses_id, ''), null), description_id = coalesce(nullif(description_id, ''), null) where semester = 2 and name = 'Information Systems (SDLC)';

insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select 3, 0, 'Object-Oriented Programming (Java)', 'Pemrograman Berorientasi Objek (Java)', null, null, null, null
where not exists (select 1 from public.semester_areas where semester = 3 and name = 'Object-Oriented Programming (Java)');
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), 'Pemrograman Berorientasi Objek (Java)'), courses_id = coalesce(nullif(courses_id, ''), null), description_id = coalesce(nullif(description_id, ''), null) where semester = 3 and name = 'Object-Oriented Programming (Java)';

insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select 3, 1, 'Data Structures', 'Struktur Data', null, null, null, null
where not exists (select 1 from public.semester_areas where semester = 3 and name = 'Data Structures');
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), 'Struktur Data'), courses_id = coalesce(nullif(courses_id, ''), null), description_id = coalesce(nullif(description_id, ''), null) where semester = 3 and name = 'Data Structures';

insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select 3, 2, 'Graphic Design (Figma, Illustrator)', 'Desain Grafis (Figma, Illustrator)', null, null, null, null
where not exists (select 1 from public.semester_areas where semester = 3 and name = 'Graphic Design (Figma, Illustrator)');
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), 'Desain Grafis (Figma, Illustrator)'), courses_id = coalesce(nullif(courses_id, ''), null), description_id = coalesce(nullif(description_id, ''), null) where semester = 3 and name = 'Graphic Design (Figma, Illustrator)';

insert into public.semester_areas (semester, sort_order, name, name_id, courses, courses_id, description, description_id)
select 3, 3, 'Software Development (UI/UX)', 'Pengembangan Software (UI/UX)', null, null, null, null
where not exists (select 1 from public.semester_areas where semester = 3 and name = 'Software Development (UI/UX)');
update public.semester_areas set name_id = coalesce(nullif(name_id, ''), 'Pengembangan Software (UI/UX)'), courses_id = coalesce(nullif(courses_id, ''), null), description_id = coalesce(nullif(description_id, ''), null) where semester = 3 and name = 'Software Development (UI/UX)';

-- Project: ditambah hanya kalau judul yang sama belum ada
insert into public.projects (title, description, description_id, semester, category, category_id, technologies, problem, problem_id, solution, solution_id, features, features_id, role, role_id, sort_order, created_date, status)
select 'Student Grade Calculator (C++)', 'A C++ console program that calculates weighted grades and ranks students.', 'Program konsol C++ yang menghitung nilai berbobot dan meranking mahasiswa.', 'Semester 2', 'Console App (C++)', 'Aplikasi Konsol (C++)', array['C++', 'Functions', 'Arrays', 'File I/O', 'Git']::text[], 'Calculating final grades by hand is slow and easy to get wrong, especially with different weights for assignments, midterm, and final exam.', 'Menghitung nilai akhir secara manual lambat dan mudah salah, apalagi dengan bobot berbeda untuk tugas, UTS, dan UAS.', 'Enter scores once and the program applies the weights, assigns a letter grade, and sorts the class by result. Data is saved to a file so it is not lost.', 'Cukup masukkan nilai sekali, program menerapkan bobot, menentukan nilai huruf, dan mengurutkan kelas berdasarkan hasil. Data disimpan ke file agar tidak hilang.', 'Weighted average and letter grade
Ranking with sorting
Menu with functions and arrays
Save and load from a file', 'Rata-rata berbobot dan nilai huruf
Ranking dengan pengurutan
Menu dengan fungsi dan array
Simpan dan muat dari file', 'Solo Developer', 'Developer Mandiri', 0, date '2026-01-01', 'published'
where not exists (select 1 from public.projects where title = 'Student Grade Calculator (C++)');

insert into public.projects (title, description, description_id, semester, category, category_id, technologies, problem, problem_id, solution, solution_id, features, features_id, role, role_id, sort_order, created_date, status)
select 'Student Data Management (PHP + MySQL)', 'A simple web app to add, view, edit, and delete student records.', 'Aplikasi web sederhana untuk menambah, melihat, mengubah, dan menghapus data mahasiswa.', 'Semester 2', 'Web App', 'Aplikasi Web', array['PHP', 'MySQL', 'SQL', 'HTML & CSS', 'XAMPP']::text[], 'Student data kept in spreadsheets gets duplicated and inconsistent, and it is hard to search.', 'Data mahasiswa di spreadsheet mudah terduplikasi dan tidak konsisten, serta sulit dicari.', 'A normalized MySQL database behind a PHP interface with forms, search, and validation, so every record lives in one place.', 'Database MySQL yang sudah dinormalisasi dengan antarmuka PHP berisi form, pencarian, dan validasi, sehingga semua data ada di satu tempat.', 'Full CRUD with forms
Search and filter
Input validation
ERD and normalized tables', 'CRUD lengkap dengan form
Pencarian dan filter
Validasi input
ERD dan tabel ternormalisasi', 'Full-stack Developer', 'Full-stack Developer', 10, date '2026-01-01', 'published'
where not exists (select 1 from public.projects where title = 'Student Data Management (PHP + MySQL)');

insert into public.projects (title, description, description_id, semester, category, category_id, technologies, problem, problem_id, solution, solution_id, features, features_id, role, role_id, sort_order, created_date, status)
select 'Survey Data Analysis (SPSS)', 'A small survey analysed with descriptive statistics and correlation.', 'Survei kecil yang dianalisis dengan statistika deskriptif dan korelasi.', 'Semester 2', 'Data Analysis', 'Analisis Data', array['SPSS', 'Excel', 'Google Forms']::text[], 'Raw survey answers do not tell much until they are cleaned, summarised, and tested.', 'Jawaban survei mentah belum memberi banyak makna sebelum dibersihkan, diringkas, dan diuji.', 'Clean the data, summarise it with tables and charts, then test whether study hours relate to scores, and explain the result in plain language.', 'Membersihkan data, meringkasnya dengan tabel dan grafik, lalu menguji apakah jam belajar berhubungan dengan nilai, dan menjelaskan hasilnya dengan bahasa sederhana.', 'Data cleaning
Descriptive statistics
Correlation test
Short written interpretation', 'Pembersihan data
Statistika deskriptif
Uji korelasi
Interpretasi singkat', 'Data Analyst', 'Analis Data', 20, date '2026-01-01', 'published'
where not exists (select 1 from public.projects where title = 'Survey Data Analysis (SPSS)');

insert into public.projects (title, description, description_id, semester, category, category_id, technologies, problem, problem_id, solution, solution_id, features, features_id, role, role_id, sort_order, created_date, status)
select 'Information System Analysis (SDLC)', 'The analysis and design documents for a small information system.', 'Dokumen analisis dan perancangan untuk sebuah sistem informasi kecil.', 'Semester 2', 'System Analysis', 'Analisis Sistem', array['SDLC', 'UML', 'Draw.io', 'Word']::text[], 'Building a system without clear requirements leads to rework and features nobody needs.', 'Membangun sistem tanpa kebutuhan yang jelas menyebabkan pengerjaan ulang dan fitur yang tidak dibutuhkan.', 'Follow the SDLC stages: gather requirements, model them with use case and flow diagrams, and design the data before any code is written.', 'Mengikuti tahapan SDLC: mengumpulkan kebutuhan, memodelkannya dengan use case dan diagram alur, serta merancang data sebelum menulis kode.', 'Requirements list
Use case diagram
Flowchart and DFD
Data design', 'Daftar kebutuhan
Use case diagram
Flowchart dan DFD
Rancangan data', 'System Analyst', 'Analis Sistem', 30, date '2026-01-01', 'published'
where not exists (select 1 from public.projects where title = 'Information System Analysis (SDLC)');

insert into public.projects (title, description, description_id, semester, category, category_id, technologies, problem, problem_id, solution, solution_id, features, features_id, role, role_id, sort_order, created_date, status)
select 'StudyQueue — Task Planner', 'A Java desktop app that sorts assignments and exams by deadline and priority.', 'Aplikasi desktop Java yang mengurutkan tugas dan ujian berdasarkan tenggat dan prioritas.', 'Semester 3', 'Desktop App (Java)', 'Aplikasi Desktop (Java)', array['Java', 'OOP', 'Data Structures', 'JavaFX', 'NetBeans', 'Git']::text[], 'Assignments, deadlines, and exam dates are scattered across chat groups and notes, so urgent ones are easy to miss.', 'Tugas, tenggat, dan jadwal ujian tersebar di grup chat dan catatan, sehingga yang mendesak mudah terlewat.', 'One place to add tasks per course. A priority queue always shows what is due next, and reminders appear before the deadline.', 'Satu tempat untuk menambah tugas per mata kuliah. Priority queue selalu menampilkan yang paling dekat tenggatnya, lalu pengingat muncul sebelum tenggat.', 'Tasks grouped by course
Priority queue sorted by deadline
Reminder before due date
Save and load data from a file', 'Tugas dikelompokkan per mata kuliah
Priority queue berdasarkan tenggat
Pengingat sebelum tenggat
Simpan dan muat data dari file', 'Solo Developer', 'Developer Mandiri', 40, date '2026-01-01', 'published'
where not exists (select 1 from public.projects where title = 'StudyQueue — Task Planner');

insert into public.projects (title, description, description_id, semester, category, category_id, technologies, problem, problem_id, solution, solution_id, features, features_id, role, role_id, sort_order, created_date, status)
select 'EcoSort — Waste Sorting App UI/UX', 'A mobile app prototype that teaches people how to sort household waste correctly.', 'Prototipe aplikasi mobile yang mengajarkan cara memilah sampah rumah tangga dengan benar.', 'Semester 3', 'UI/UX Design', 'Desain UI/UX', array['Figma', 'Illustrator', 'Design System', 'Usability Testing']::text[], 'Many people are unsure which bin a piece of waste belongs to, so recyclable items end up mixed with the rest.', 'Banyak orang bingung sampah tertentu masuk tempat sampah yang mana, sehingga yang bisa didaur ulang ikut tercampur.', 'A clear flow: pick or search an item, see the right bin with a short reason. I tested the prototype with five users and revised the layout from their feedback.', 'Alur yang jelas: pilih atau cari barang, lihat tempat sampah yang tepat beserta alasan singkat. Prototipe diuji ke lima pengguna dan tata letaknya direvisi dari masukan mereka.', 'Search and category browsing
Color-coded bin guide
Quick tips and quiz
Usability test report', 'Pencarian dan jelajah kategori
Panduan tempat sampah berkode warna
Tips singkat dan kuis
Laporan uji kegunaan', 'UI/UX Designer', 'UI/UX Designer', 50, date '2026-01-01', 'published'
where not exists (select 1 from public.projects where title = 'EcoSort — Waste Sorting App UI/UX');

insert into public.projects (title, description, description_id, semester, category, category_id, technologies, problem, problem_id, solution, solution_id, features, features_id, role, role_id, sort_order, created_date, status)
select 'Library Console App (Java OOP)', 'A Java program that models books, members, and loans with object-oriented design.', 'Program Java yang memodelkan buku, anggota, dan peminjaman dengan desain berorientasi objek.', 'Semester 3', 'Desktop App (Java)', 'Aplikasi Desktop (Java)', array['Java', 'OOP', 'UML', 'NetBeans', 'Git']::text[], 'OOP concepts stay abstract until they are used to model something real.', 'Konsep OOP tetap abstrak sampai dipakai untuk memodelkan sesuatu yang nyata.', 'Design classes with inheritance, interfaces, and polymorphism, then handle errors with exceptions and draw the class diagram.', 'Merancang kelas dengan pewarisan, interface, dan polimorfisme, lalu menangani error dengan exception dan menggambar class diagram.', 'Book, Member, and Loan classes
Inheritance and interfaces
Exception handling
Class diagram', 'Kelas Buku, Anggota, dan Peminjaman
Pewarisan dan interface
Penanganan exception
Class diagram', 'Solo Developer', 'Developer Mandiri', 60, date '2026-01-01', 'published'
where not exists (select 1 from public.projects where title = 'Library Console App (Java OOP)');

insert into public.projects (title, description, description_id, semester, category, category_id, technologies, problem, problem_id, solution, solution_id, features, features_id, role, role_id, sort_order, created_date, status)
select 'Contact Book with Data Structures', 'A contact book built three ways to compare how data structures affect speed.', 'Buku kontak yang dibuat dengan tiga cara untuk membandingkan pengaruh struktur data terhadap kecepatan.', 'Semester 3', 'Data Structures', 'Struktur Data', array['Java', 'LinkedList', 'HashMap', 'Binary Search Tree']::text[], 'It is hard to feel the difference between data structures from theory alone.', 'Perbedaan antar struktur data sulit terasa hanya dari teori.', 'Implement the same contact book with a linked list, a hash map, and a binary search tree, then time searches as the data grows.', 'Membuat buku kontak yang sama dengan linked list, hash map, dan binary search tree, lalu mengukur waktu pencarian saat data bertambah.', 'Linked list, hash map, and BST versions
Search, add, and delete
Timing comparison
Short report with a chart', 'Versi linked list, hash map, dan BST
Cari, tambah, dan hapus
Perbandingan waktu
Laporan singkat dengan grafik', 'Solo Developer', 'Developer Mandiri', 70, date '2026-01-01', 'published'
where not exists (select 1 from public.projects where title = 'Contact Book with Data Structures');

insert into public.projects (title, description, description_id, semester, category, category_id, technologies, problem, problem_id, solution, solution_id, features, features_id, role, role_id, sort_order, created_date, status)
select 'Personal Brand Identity (Illustrator)', 'A logo, colour palette, and typography set for my learning archive.', 'Logo, palet warna, dan tipografi untuk arsip belajarku.', 'Semester 3', 'Graphic Design', 'Desain Grafis', array['Illustrator', 'Figma', 'Typography', 'Color Theory']::text[], 'My work looked inconsistent because it had no shared visual identity.', 'Karya-karyaku terlihat tidak konsisten karena belum punya identitas visual yang sama.', 'Define a small visual system: logo variations, a rose and cream palette, type pairing, and a few reusable assets such as stickers and covers.', 'Menentukan sistem visual kecil: variasi logo, palet rose dan krem, pasangan font, serta beberapa aset yang bisa dipakai ulang seperti stiker dan sampul.', 'Logo and variations
Colour palette and type pairing
Social media templates
Mini brand guide PDF', 'Logo dan variasinya
Palet warna dan pasangan font
Template media sosial
Mini brand guide PDF', 'Graphic Designer', 'Desainer Grafis', 80, date '2026-01-01', 'published'
where not exists (select 1 from public.projects where title = 'Personal Brand Identity (Illustrator)');

insert into public.projects (title, description, description_id, semester, category, category_id, technologies, problem, problem_id, solution, solution_id, features, features_id, role, role_id, sort_order, created_date, status)
select 'Learning Portfolio UI Kit (Figma)', 'A Figma design system and page layouts for this portfolio website.', 'Design system Figma dan tata letak halaman untuk website portofolio ini.', 'Semester 3', 'UI/UX Design', 'Desain UI/UX', array['Figma', 'Auto Layout', 'Design System', 'Prototyping']::text[], 'Designing each page from scratch makes the website inconsistent and slow to change.', 'Merancang tiap halaman dari nol membuat website tidak konsisten dan lambat diubah.', 'Build reusable components such as buttons, cards, and navigation, define spacing and type scales, and lay out mobile and desktop versions.', 'Membuat komponen yang bisa dipakai ulang seperti tombol, kartu, dan navigasi, menentukan skala spasi dan tipografi, lalu menyusun versi mobile dan desktop.', 'Components and variants
Colour and type styles
Mobile and desktop layouts
Clickable prototype', 'Komponen dan variannya
Gaya warna dan tipografi
Layout mobile dan desktop
Prototipe yang bisa diklik', 'UI/UX Designer', 'UI/UX Designer', 90, date '2026-01-01', 'published'
where not exists (select 1 from public.projects where title = 'Learning Portfolio UI Kit (Figma)');

insert into public.projects (title, description, description_id, semester, category, category_id, technologies, problem, problem_id, solution, solution_id, features, features_id, role, role_id, sort_order, created_date, status)
select 'Informatics Quiz Game (Java)', 'A Java GUI quiz game with a timer, score, and question bank from a file.', 'Game kuis Java berbasis GUI dengan timer, skor, dan bank soal dari file.', 'Semester 3', 'Desktop App (Java)', 'Aplikasi Desktop (Java)', array['Java', 'JavaFX', 'File I/O', 'Figma']::text[], 'Reviewing course material by reading again is passive and easy to skip.', 'Mengulang materi kuliah hanya dengan membaca ulang itu pasif dan mudah dilewatkan.', 'Turn review into a short game: random questions from a file, a countdown per question, instant feedback, and a high-score list.', 'Mengubah belajar ulang menjadi game singkat: soal acak dari file, hitung mundur tiap soal, umpan balik instan, dan daftar skor tertinggi.', 'Question bank loaded from a file
Countdown timer
Score and high-score list
Clean GUI layout', 'Bank soal dimuat dari file
Timer hitung mundur
Skor dan daftar skor tertinggi
Tata letak GUI yang rapi', 'Developer & Designer', 'Developer & Desainer', 100, date '2026-01-01', 'published'
where not exists (select 1 from public.projects where title = 'Informatics Quiz Game (Java)');
