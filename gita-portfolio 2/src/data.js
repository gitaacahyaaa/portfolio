const tones = ['peach', 'pink', 'mint', 'lav', 'butter']

// ───────── PROYEK ─────────
// Saat ini berisi project Semester 2 dan 3. Semester 4–8 sengaja KOSONG: nanti ditambah lewat dashboard /admin → Projects (tanpa coding).
// Ide untuk semester 4–8 disimpan di PROJECT-IDEAS.md.
// Tiap project: slug (dipakai link #project-slug), semester, year, cat, desc, problem, solution, features, tech, role, status.
// Teks dwibahasa: { en: '...', id: '...' }.  demo / github: isi URL kalau sudah ada. image: '/projects/nama.png' di folder public.
// Kalau kamu isi project dengan JUDUL yang sama lewat /admin, versi dashboard otomatis menggantikan yang ini.
const PLAN = { en: 'Planned', id: 'Direncanakan' }
const DONE = { en: 'Completed', id: 'Selesai' }
const P = (i, o) => ({ slug: o.slug, tone: tones[i % 5], tech: [], demo: '', github: '', image: '', status: PLAN, ...o })
export const PROJECTS = [
  P(0, {
  slug: "cpp-grade-calculator",
  semester: "Semester 2",
  year: "2026",
  title: "Student Grade Calculator (C++)",
  cat: {
    "en": "Console App (C++)",
    "id": "Aplikasi Konsol (C++)"
  },
  desc: {
    "en": "A C++ console program that calculates weighted grades and ranks students.",
    "id": "Program konsol C++ yang menghitung nilai berbobot dan meranking mahasiswa."
  },
  problem: {
    "en": "Calculating final grades by hand is slow and easy to get wrong, especially with different weights for assignments, midterm, and final exam.",
    "id": "Menghitung nilai akhir secara manual lambat dan mudah salah, apalagi dengan bobot berbeda untuk tugas, UTS, dan UAS."
  },
  solution: {
    "en": "Enter scores once and the program applies the weights, assigns a letter grade, and sorts the class by result. Data is saved to a file so it is not lost.",
    "id": "Cukup masukkan nilai sekali, program menerapkan bobot, menentukan nilai huruf, dan mengurutkan kelas berdasarkan hasil. Data disimpan ke file agar tidak hilang."
  },
  features: {
    "en": [
      "Weighted average and letter grade",
      "Ranking with sorting",
      "Menu with functions and arrays",
      "Save and load from a file"
    ],
    "id": [
      "Rata-rata berbobot dan nilai huruf",
      "Ranking dengan pengurutan",
      "Menu dengan fungsi dan array",
      "Simpan dan muat dari file"
    ]
  },
  tech: [
    "C++",
    "Functions",
    "Arrays",
    "File I/O",
    "Git"
  ],
  role: {
    "en": "Solo Developer",
    "id": "Developer Mandiri"
  },
  status: DONE
  }),
  P(1, {
  slug: "student-data-crud",
  semester: "Semester 2",
  year: "2026",
  title: "Student Data Management (PHP + MySQL)",
  cat: {
    "en": "Web App",
    "id": "Aplikasi Web"
  },
  desc: {
    "en": "A simple web app to add, view, edit, and delete student records.",
    "id": "Aplikasi web sederhana untuk menambah, melihat, mengubah, dan menghapus data mahasiswa."
  },
  problem: {
    "en": "Student data kept in spreadsheets gets duplicated and inconsistent, and it is hard to search.",
    "id": "Data mahasiswa di spreadsheet mudah terduplikasi dan tidak konsisten, serta sulit dicari."
  },
  solution: {
    "en": "A normalized MySQL database behind a PHP interface with forms, search, and validation, so every record lives in one place.",
    "id": "Database MySQL yang sudah dinormalisasi dengan antarmuka PHP berisi form, pencarian, dan validasi, sehingga semua data ada di satu tempat."
  },
  features: {
    "en": [
      "Full CRUD with forms",
      "Search and filter",
      "Input validation",
      "ERD and normalized tables"
    ],
    "id": [
      "CRUD lengkap dengan form",
      "Pencarian dan filter",
      "Validasi input",
      "ERD dan tabel ternormalisasi"
    ]
  },
  tech: [
    "PHP",
    "MySQL",
    "SQL",
    "HTML & CSS",
    "XAMPP"
  ],
  role: {
    "en": "Full-stack Developer",
    "id": "Full-stack Developer"
  },
  status: DONE
  }),
  P(2, {
  slug: "spss-survey-analysis",
  semester: "Semester 2",
  year: "2026",
  title: "Survey Data Analysis (SPSS)",
  cat: {
    "en": "Data Analysis",
    "id": "Analisis Data"
  },
  desc: {
    "en": "A small survey analysed with descriptive statistics and correlation.",
    "id": "Survei kecil yang dianalisis dengan statistika deskriptif dan korelasi."
  },
  problem: {
    "en": "Raw survey answers do not tell much until they are cleaned, summarised, and tested.",
    "id": "Jawaban survei mentah belum memberi banyak makna sebelum dibersihkan, diringkas, dan diuji."
  },
  solution: {
    "en": "Clean the data, summarise it with tables and charts, then test whether study hours relate to scores, and explain the result in plain language.",
    "id": "Membersihkan data, meringkasnya dengan tabel dan grafik, lalu menguji apakah jam belajar berhubungan dengan nilai, dan menjelaskan hasilnya dengan bahasa sederhana."
  },
  features: {
    "en": [
      "Data cleaning",
      "Descriptive statistics",
      "Correlation test",
      "Short written interpretation"
    ],
    "id": [
      "Pembersihan data",
      "Statistika deskriptif",
      "Uji korelasi",
      "Interpretasi singkat"
    ]
  },
  tech: [
    "SPSS",
    "Excel",
    "Google Forms"
  ],
  role: {
    "en": "Data Analyst",
    "id": "Analis Data"
  },
  status: DONE
  }),
  P(3, {
  slug: "sdlc-system-analysis",
  semester: "Semester 2",
  year: "2026",
  title: "Information System Analysis (SDLC)",
  cat: {
    "en": "System Analysis",
    "id": "Analisis Sistem"
  },
  desc: {
    "en": "The analysis and design documents for a small information system.",
    "id": "Dokumen analisis dan perancangan untuk sebuah sistem informasi kecil."
  },
  problem: {
    "en": "Building a system without clear requirements leads to rework and features nobody needs.",
    "id": "Membangun sistem tanpa kebutuhan yang jelas menyebabkan pengerjaan ulang dan fitur yang tidak dibutuhkan."
  },
  solution: {
    "en": "Follow the SDLC stages: gather requirements, model them with use case and flow diagrams, and design the data before any code is written.",
    "id": "Mengikuti tahapan SDLC: mengumpulkan kebutuhan, memodelkannya dengan use case dan diagram alur, serta merancang data sebelum menulis kode."
  },
  features: {
    "en": [
      "Requirements list",
      "Use case diagram",
      "Flowchart and DFD",
      "Data design"
    ],
    "id": [
      "Daftar kebutuhan",
      "Use case diagram",
      "Flowchart dan DFD",
      "Rancangan data"
    ]
  },
  tech: [
    "SDLC",
    "UML",
    "Draw.io",
    "Word"
  ],
  role: {
    "en": "System Analyst",
    "id": "Analis Sistem"
  },
  status: DONE
  }),
  P(4, {
  slug: "studyqueue-task-planner",
  tone: "peach",
  tech: [
    "Java",
    "OOP",
    "Data Structures",
    "JavaFX",
    "NetBeans",
    "Git"
  ],
  demo: "",
  github: "",
  image: "",
  semester: "Semester 3",
  year: "2026",
  title: "StudyQueue — Task Planner",
  cat: {
    "en": "Desktop App (Java)",
    "id": "Aplikasi Desktop (Java)"
  },
  desc: {
    "en": "A Java desktop app that sorts assignments and exams by deadline and priority.",
    "id": "Aplikasi desktop Java yang mengurutkan tugas dan ujian berdasarkan tenggat dan prioritas."
  },
  problem: {
    "en": "Assignments, deadlines, and exam dates are scattered across chat groups and notes, so urgent ones are easy to miss.",
    "id": "Tugas, tenggat, dan jadwal ujian tersebar di grup chat dan catatan, sehingga yang mendesak mudah terlewat."
  },
  solution: {
    "en": "One place to add tasks per course. A priority queue always shows what is due next, and reminders appear before the deadline.",
    "id": "Satu tempat untuk menambah tugas per mata kuliah. Priority queue selalu menampilkan yang paling dekat tenggatnya, lalu pengingat muncul sebelum tenggat."
  },
  features: {
    "en": [
      "Tasks grouped by course",
      "Priority queue sorted by deadline",
      "Reminder before due date",
      "Save and load data from a file"
    ],
    "id": [
      "Tugas dikelompokkan per mata kuliah",
      "Priority queue berdasarkan tenggat",
      "Pengingat sebelum tenggat",
      "Simpan dan muat data dari file"
    ]
  },
  role: {
    "en": "Solo Developer",
    "id": "Developer Mandiri"
  }
  }),
  P(5, {
  slug: "ecosort-ui-ux",
  tone: "pink",
  tech: [
    "Figma",
    "Illustrator",
    "Design System",
    "Usability Testing"
  ],
  demo: "",
  github: "",
  image: "",
  semester: "Semester 3",
  year: "2026",
  title: "EcoSort — Waste Sorting App UI/UX",
  cat: {
    "en": "UI/UX Design",
    "id": "Desain UI/UX"
  },
  desc: {
    "en": "A mobile app prototype that teaches people how to sort household waste correctly.",
    "id": "Prototipe aplikasi mobile yang mengajarkan cara memilah sampah rumah tangga dengan benar."
  },
  problem: {
    "en": "Many people are unsure which bin a piece of waste belongs to, so recyclable items end up mixed with the rest.",
    "id": "Banyak orang bingung sampah tertentu masuk tempat sampah yang mana, sehingga yang bisa didaur ulang ikut tercampur."
  },
  solution: {
    "en": "A clear flow: pick or search an item, see the right bin with a short reason. I tested the prototype with five users and revised the layout from their feedback.",
    "id": "Alur yang jelas: pilih atau cari barang, lihat tempat sampah yang tepat beserta alasan singkat. Prototipe diuji ke lima pengguna dan tata letaknya direvisi dari masukan mereka."
  },
  features: {
    "en": [
      "Search and category browsing",
      "Color-coded bin guide",
      "Quick tips and quiz",
      "Usability test report"
    ],
    "id": [
      "Pencarian dan jelajah kategori",
      "Panduan tempat sampah berkode warna",
      "Tips singkat dan kuis",
      "Laporan uji kegunaan"
    ]
  },
  role: {
    "en": "UI/UX Designer",
    "id": "UI/UX Designer"
  }
  }),
  P(6, {
  slug: "java-library-oop",
  semester: "Semester 3",
  year: "2026",
  title: "Library Console App (Java OOP)",
  cat: {
    "en": "Desktop App (Java)",
    "id": "Aplikasi Desktop (Java)"
  },
  desc: {
    "en": "A Java program that models books, members, and loans with object-oriented design.",
    "id": "Program Java yang memodelkan buku, anggota, dan peminjaman dengan desain berorientasi objek."
  },
  problem: {
    "en": "OOP concepts stay abstract until they are used to model something real.",
    "id": "Konsep OOP tetap abstrak sampai dipakai untuk memodelkan sesuatu yang nyata."
  },
  solution: {
    "en": "Design classes with inheritance, interfaces, and polymorphism, then handle errors with exceptions and draw the class diagram.",
    "id": "Merancang kelas dengan pewarisan, interface, dan polimorfisme, lalu menangani error dengan exception dan menggambar class diagram."
  },
  features: {
    "en": [
      "Book, Member, and Loan classes",
      "Inheritance and interfaces",
      "Exception handling",
      "Class diagram"
    ],
    "id": [
      "Kelas Buku, Anggota, dan Peminjaman",
      "Pewarisan dan interface",
      "Penanganan exception",
      "Class diagram"
    ]
  },
  tech: [
    "Java",
    "OOP",
    "UML",
    "NetBeans",
    "Git"
  ],
  role: {
    "en": "Solo Developer",
    "id": "Developer Mandiri"
  }
  }),
  P(7, {
  slug: "contact-book-data-structures",
  semester: "Semester 3",
  year: "2026",
  title: "Contact Book with Data Structures",
  cat: {
    "en": "Data Structures",
    "id": "Struktur Data"
  },
  desc: {
    "en": "A contact book built three ways to compare how data structures affect speed.",
    "id": "Buku kontak yang dibuat dengan tiga cara untuk membandingkan pengaruh struktur data terhadap kecepatan."
  },
  problem: {
    "en": "It is hard to feel the difference between data structures from theory alone.",
    "id": "Perbedaan antar struktur data sulit terasa hanya dari teori."
  },
  solution: {
    "en": "Implement the same contact book with a linked list, a hash map, and a binary search tree, then time searches as the data grows.",
    "id": "Membuat buku kontak yang sama dengan linked list, hash map, dan binary search tree, lalu mengukur waktu pencarian saat data bertambah."
  },
  features: {
    "en": [
      "Linked list, hash map, and BST versions",
      "Search, add, and delete",
      "Timing comparison",
      "Short report with a chart"
    ],
    "id": [
      "Versi linked list, hash map, dan BST",
      "Cari, tambah, dan hapus",
      "Perbandingan waktu",
      "Laporan singkat dengan grafik"
    ]
  },
  tech: [
    "Java",
    "LinkedList",
    "HashMap",
    "Binary Search Tree"
  ],
  role: {
    "en": "Solo Developer",
    "id": "Developer Mandiri"
  }
  }),
  P(8, {
  slug: "brand-identity-illustrator",
  semester: "Semester 3",
  year: "2026",
  title: "Personal Brand Identity (Illustrator)",
  cat: {
    "en": "Graphic Design",
    "id": "Desain Grafis"
  },
  desc: {
    "en": "A logo, colour palette, and typography set for my learning archive.",
    "id": "Logo, palet warna, dan tipografi untuk arsip belajarku."
  },
  problem: {
    "en": "My work looked inconsistent because it had no shared visual identity.",
    "id": "Karya-karyaku terlihat tidak konsisten karena belum punya identitas visual yang sama."
  },
  solution: {
    "en": "Define a small visual system: logo variations, a rose and cream palette, type pairing, and a few reusable assets such as stickers and covers.",
    "id": "Menentukan sistem visual kecil: variasi logo, palet rose dan krem, pasangan font, serta beberapa aset yang bisa dipakai ulang seperti stiker dan sampul."
  },
  features: {
    "en": [
      "Logo and variations",
      "Colour palette and type pairing",
      "Social media templates",
      "Mini brand guide PDF"
    ],
    "id": [
      "Logo dan variasinya",
      "Palet warna dan pasangan font",
      "Template media sosial",
      "Mini brand guide PDF"
    ]
  },
  tech: [
    "Illustrator",
    "Figma",
    "Typography",
    "Color Theory"
  ],
  role: {
    "en": "Graphic Designer",
    "id": "Desainer Grafis"
  }
  }),
  P(9, {
  slug: "learning-portfolio-ui-kit",
  semester: "Semester 3",
  year: "2026",
  title: "Learning Portfolio UI Kit (Figma)",
  cat: {
    "en": "UI/UX Design",
    "id": "Desain UI/UX"
  },
  desc: {
    "en": "A Figma design system and page layouts for this portfolio website.",
    "id": "Design system Figma dan tata letak halaman untuk website portofolio ini."
  },
  problem: {
    "en": "Designing each page from scratch makes the website inconsistent and slow to change.",
    "id": "Merancang tiap halaman dari nol membuat website tidak konsisten dan lambat diubah."
  },
  solution: {
    "en": "Build reusable components such as buttons, cards, and navigation, define spacing and type scales, and lay out mobile and desktop versions.",
    "id": "Membuat komponen yang bisa dipakai ulang seperti tombol, kartu, dan navigasi, menentukan skala spasi dan tipografi, lalu menyusun versi mobile dan desktop."
  },
  features: {
    "en": [
      "Components and variants",
      "Colour and type styles",
      "Mobile and desktop layouts",
      "Clickable prototype"
    ],
    "id": [
      "Komponen dan variannya",
      "Gaya warna dan tipografi",
      "Layout mobile dan desktop",
      "Prototipe yang bisa diklik"
    ]
  },
  tech: [
    "Figma",
    "Auto Layout",
    "Design System",
    "Prototyping"
  ],
  role: {
    "en": "UI/UX Designer",
    "id": "UI/UX Designer"
  }
  }),
  P(10, {
  slug: "java-quiz-game",
  semester: "Semester 3",
  year: "2026",
  title: "Informatics Quiz Game (Java)",
  cat: {
    "en": "Desktop App (Java)",
    "id": "Aplikasi Desktop (Java)"
  },
  desc: {
    "en": "A Java GUI quiz game with a timer, score, and question bank from a file.",
    "id": "Game kuis Java berbasis GUI dengan timer, skor, dan bank soal dari file."
  },
  problem: {
    "en": "Reviewing course material by reading again is passive and easy to skip.",
    "id": "Mengulang materi kuliah hanya dengan membaca ulang itu pasif dan mudah dilewatkan."
  },
  solution: {
    "en": "Turn review into a short game: random questions from a file, a countdown per question, instant feedback, and a high-score list.",
    "id": "Mengubah belajar ulang menjadi game singkat: soal acak dari file, hitung mundur tiap soal, umpan balik instan, dan daftar skor tertinggi."
  },
  features: {
    "en": [
      "Question bank loaded from a file",
      "Countdown timer",
      "Score and high-score list",
      "Clean GUI layout"
    ],
    "id": [
      "Bank soal dimuat dari file",
      "Timer hitung mundur",
      "Skor dan daftar skor tertinggi",
      "Tata letak GUI yang rapi"
    ]
  },
  tech: [
    "Java",
    "JavaFX",
    "File I/O",
    "Figma"
  ],
  role: {
    "en": "Developer & Designer",
    "id": "Developer & Desainer"
  }
  }),
]

// ───────── SERTIFIKAT (10 slot) ─────────
// title, issuer, year, link (URL kredensial), image ('/certs/nama.png' di folder public).
const C = (i, o = {}) => ({ id: i, tone: tones[i % 5], title: '', issuer: '', year: '[YEAR]', link: '', image: '', ...o })
export const CERTS = Array.from({ length: 10 }, (_, i) => C(i))

export const LINKS = {
  email: 'mailto:gitaacahyaaa@gmail.com',
  github: 'https://github.com/gitaacahyaaa',
  linkedin: 'https://www.linkedin.com/in/ni-luh-gede-gita-cahya-narayani-746859376',
  instagram: 'https://www.instagram.com/gittaaccn',
  tiktok: '', // isi lewat admin → Contact
}
// Label yang tampil di bagian kontak (data pribadi, tidak diterjemahkan)
export const CONTACT_LABELS = {
  email: 'gitaacahyaaa@gmail.com',
  github: 'github.com/gitaacahyaaa',
  linkedin: 'Ni Luh Gede Gita Cahya Narayani',
  instagram: '@gittaaccn',
  tiktok: '',
}

// ───────── LEARNING JOURNEY (konten bawaan; dikelola dari /admin → Learning Journey) ─────────
// Nama kolom sama dengan di database. Akhiran _id = terjemahan Indonesia (kosong → otomatis pakai versi English).
// areas = bidang pengetahuan (What I Learned + Knowledge Showcase). notes/images diisi dari dashboard.
const A = (name, name_id, courses, courses_id, description = '', description_id = '') => ({ name, name_id, courses, courses_id, description, description_id, notes: [], notes_id: [], images: [] })
const S = (o) => ({ progress: 'upcoming', tagline: '', tagline_id: '', headline: '', headline_id: '', lead: '', lead_id: '', intro: '', intro_id: '', areas: [], tech_learning: [], tech_explored: [], tech_used: [], reflection: '', reflection_id: '', ...o })
export const JOURNEY = [
  S({ semester: 1, progress: 'completed', tagline: 'Building the Foundation', tagline_id: 'Membangun Fondasi', headline: 'The Foundation', headline_id: 'Sang Fondasi', lead: 'Where my learning journey began.', lead_id: 'Tempat perjalanan belajarku dimulai.',
    intro: 'Semester 1 was about building the fundamentals of education, mathematics, and computer technology. These subjects shaped the way I understand technology and its role in learning.',
    intro_id: 'Semester 1 adalah tentang membangun dasar-dasar pendidikan, matematika, dan teknologi komputer. Mata kuliah ini membentuk cara pandangku terhadap teknologi dan perannya dalam pembelajaran.',
    areas: [
      A('Mathematical Foundations', 'Fondasi Matematika', ['Engineering Mathematics', 'Linear Algebra'], ['Matematika Teknik', 'Aljabar Linear'], 'Mathematical reasoning, equations, matrices, and basic linear algebra concepts.', 'Penalaran matematis, persamaan, matriks, dan konsep dasar aljabar linear.'),
      A('Computer Fundamentals', 'Dasar-dasar Komputer', ['Computer Organization and Architecture'], ['Organisasi dan Arsitektur Komputer'], 'Understanding computer components, hardware, architecture, and how computer systems work.', 'Memahami komponen komputer, perangkat keras, arsitektur, dan cara kerja sistem komputer.'),
      A('Educational Foundations', 'Fondasi Pendidikan', ['Educational Insights', 'Philosophy of Indonesian Education', 'Inclusive Education'], ['Wawasan Kependidikan', 'Filsafat Pendidikan Indonesia', 'Pendidikan Inklusif'], 'Understanding education, teaching principles, educational philosophy, and inclusive learning.', 'Memahami pendidikan, prinsip mengajar, filsafat pendidikan, dan pembelajaran yang inklusif.'),
      A('Communication & Citizenship', 'Komunikasi & Kewarganegaraan', ['English', 'Pancasila'], ['Bahasa Inggris', 'Pancasila'], 'Developing communication skills, critical thinking, and understanding civic values.', 'Mengembangkan kemampuan komunikasi, berpikir kritis, dan memahami nilai-nilai kewarganegaraan.'),
    ] }),
  S({ semester: 2, progress: 'completed', tagline: 'Exploring Programming & Data', tagline_id: 'Menjelajahi Pemrograman & Data',
    areas: [A('Algorithms and Programming (C++)', 'Algoritma dan Pemrograman (C++)', [], []), A('Database Fundamentals (SQL), PHP', 'Dasar Basis Data (SQL), PHP', [], []), A('Basic Statistics (SPSS)', 'Statistika Dasar (SPSS)', [], []), A('Information Systems (SDLC)', 'Sistem Informasi (SDLC)', [], [])] }),
  S({ semester: 3, progress: 'current', tagline: 'Programming & Creative Development', tagline_id: 'Pemrograman & Pengembangan Kreatif', tech_learning: ['Java', 'Figma', 'Illustrator'],
    areas: [A('Object-Oriented Programming (Java)', 'Pemrograman Berorientasi Objek (Java)', [], []), A('Data Structures', 'Struktur Data', [], []), A('Graphic Design (Figma, Illustrator)', 'Desain Grafis (Figma, Illustrator)', [], []), A('Software Development (UI/UX)', 'Pengembangan Software (UI/UX)', [], [])] }),
  S({ semester: 4, tagline: 'Exploring Modern Technology', tagline_id: 'Menjelajahi Teknologi Modern' }),
  S({ semester: 5, tagline: 'Expanding Development Skills', tagline_id: 'Memperluas Keterampilan Pengembangan' }),
  S({ semester: 6, tagline: 'Building Interactive Solutions', tagline_id: 'Membangun Solusi Interaktif' }),
  S({ semester: 7, tagline: 'Applying Knowledge in Education', tagline_id: 'Menerapkan Ilmu dalam Pendidikan' }),
  S({ semester: 8, tagline: 'Research & Professional Growth', tagline_id: 'Riset & Pertumbuhan Profesional' }),
]
