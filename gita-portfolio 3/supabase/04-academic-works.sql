-- 04-academic-works.sql — tambahan untuk "Karya Tulis & Proyek Akademik". Jalankan sekali di SQL Editor (aman diulang).
alter table public.publications
  add column if not exists kind text check (char_length(kind) <= 80),
  add column if not exists kind_id text check (char_length(kind_id) <= 80),
  add column if not exists file_url text;
