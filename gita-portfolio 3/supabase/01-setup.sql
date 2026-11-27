-- =====================================================================
-- 01-setup.sql — jalankan di Supabase → SQL Editor (SATU KALI, aman diulang).
-- Bisa dipakai di project BARU maupun yang sudah pernah menjalankan SQL versi lama:
-- membuat tabel yang belum ada, menambah kolom baru (terjemahan ID, urutan, dst), merapikan aturan, RLS, dan storage.
-- =====================================================================

-- ---------- Admin ----------
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;   -- tanpa policy = tidak bisa diakses lewat API

create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Tabel ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  created_date date not null default current_date,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  status text not null default 'published' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);
create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 240),
  status text not null default 'published' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);
create table if not exists public.journey_steps (
  id uuid primary key default gen_random_uuid(),
  position int not null unique check (position between 1 and 4),
  images text[] not null default '{}'
);
create table if not exists public.semester_journeys (
  id uuid primary key default gen_random_uuid(),
  semester int not null unique check (semester between 1 and 8),
  progress text not null default 'upcoming' check (progress in ('completed','current','upcoming')),
  status text not null default 'published' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);
create table if not exists public.semester_areas (
  id uuid primary key default gen_random_uuid(),
  semester int not null check (semester between 1 and 8),
  name text not null check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now()
);
create table if not exists public.site_settings (key text primary key, value jsonb not null default '{}');

-- ---------- Kolom (ditambah kalau belum ada) ----------
alter table public.projects
  add column if not exists description text check (char_length(description) <= 4000),
  add column if not exists semester text,
  add column if not exists category text check (char_length(category) <= 80),
  add column if not exists course text check (char_length(course) <= 120),
  add column if not exists technologies text[] not null default '{}',
  add column if not exists thumbnail_url text,
  add column if not exists images text[] not null default '{}',
  add column if not exists github_url text check (github_url is null or github_url ~* '^https?://'),
  add column if not exists demo_url text check (demo_url is null or demo_url ~* '^https?://'),
  add column if not exists learned text check (char_length(learned) <= 4000),
  add column if not exists problem text check (char_length(problem) <= 2000),
  add column if not exists solution text check (char_length(solution) <= 2000),
  add column if not exists features text check (char_length(features) <= 2000),
  add column if not exists role text check (char_length(role) <= 120),
  add column if not exists sort_order int not null default 0,
  add column if not exists title_id text check (char_length(title_id) <= 160),
  add column if not exists description_id text check (char_length(description_id) <= 4000),
  add column if not exists category_id text check (char_length(category_id) <= 80),
  add column if not exists learned_id text check (char_length(learned_id) <= 4000),
  add column if not exists problem_id text check (char_length(problem_id) <= 2000),
  add column if not exists solution_id text check (char_length(solution_id) <= 2000),
  add column if not exists features_id text check (char_length(features_id) <= 2000),
  add column if not exists role_id text check (char_length(role_id) <= 120);
alter table public.projects drop constraint if exists projects_semester_check;
alter table public.projects add constraint projects_semester_check check (semester is null or semester in ('Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6','Semester 7','Semester 8'));

alter table public.certificates
  add column if not exists issuer text check (char_length(issuer) <= 160),
  add column if not exists issue_date date,
  add column if not exists credential_url text check (credential_url is null or credential_url ~* '^https?://'),
  add column if not exists image_url text,
  add column if not exists sort_order int not null default 0;

alter table public.publications
  add column if not exists description text check (char_length(description) <= 4000),
  add column if not exists publication_date date,
  add column if not exists external_url text check (external_url is null or external_url ~* '^https?://'),
  add column if not exists sort_order int not null default 0,
  add column if not exists title_id text check (char_length(title_id) <= 240),
  add column if not exists description_id text check (char_length(description_id) <= 4000),
  add column if not exists kind text check (char_length(kind) <= 80),
  add column if not exists kind_id text check (char_length(kind_id) <= 80),
  add column if not exists file_url text;

alter table public.journey_steps
  add column if not exists tag_en text, add column if not exists tag_id text, add column if not exists title_en text, add column if not exists title_id text,
  add column if not exists short_en text, add column if not exists short_id text, add column if not exists story_en text, add column if not exists story_id text,
  add column if not exists chips_en text, add column if not exists chips_id text;

alter table public.semester_journeys
  add column if not exists tagline text check (char_length(tagline) <= 120), add column if not exists tagline_id text check (char_length(tagline_id) <= 120),
  add column if not exists headline text check (char_length(headline) <= 120), add column if not exists headline_id text check (char_length(headline_id) <= 120),
  add column if not exists lead text check (char_length(lead) <= 300), add column if not exists lead_id text check (char_length(lead_id) <= 300),
  add column if not exists intro text check (char_length(intro) <= 3000), add column if not exists intro_id text check (char_length(intro_id) <= 3000),
  add column if not exists reflection text check (char_length(reflection) <= 4000), add column if not exists reflection_id text check (char_length(reflection_id) <= 4000),
  add column if not exists tech_learning text[] not null default '{}', add column if not exists tech_explored text[] not null default '{}', add column if not exists tech_used text[] not null default '{}';
alter table public.semester_journeys drop constraint if exists semester_journeys_semester_check;
alter table public.semester_journeys add constraint semester_journeys_semester_check check (semester between 1 and 8);

alter table public.semester_areas
  add column if not exists sort_order int not null default 0,
  add column if not exists courses text check (char_length(courses) <= 1000), add column if not exists courses_id text check (char_length(courses_id) <= 1000),
  add column if not exists name_id text check (char_length(name_id) <= 120),
  add column if not exists description text check (char_length(description) <= 1500), add column if not exists description_id text check (char_length(description_id) <= 1500),
  add column if not exists notes text check (char_length(notes) <= 6000), add column if not exists notes_id text check (char_length(notes_id) <= 6000),
  add column if not exists images text[] not null default '{}';
alter table public.semester_areas drop constraint if exists semester_areas_semester_check;
alter table public.semester_areas add constraint semester_areas_semester_check check (semester between 1 and 8);

-- site_settings: about, contact, general (CV, foto, judul tab), texts (editan teks UI)
alter table public.site_settings drop constraint if exists site_settings_key_check;
alter table public.site_settings add constraint site_settings_key_check check (key in ('about','contact','general','texts'));

-- ---------- Row Level Security ----------
do $$
declare t text;
begin
  foreach t in array array['projects','certificates','publications','journey_steps','semester_journeys','semester_areas','site_settings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "admin all" on public.%I', t);
    execute format('create policy "admin all" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
  -- publik: hanya baca. Yang punya status → hanya 'published'
  foreach t in array array['projects','certificates','publications','semester_journeys'] loop
    execute format('drop policy if exists "public read published" on public.%I', t);
    execute format('create policy "public read published" on public.%I for select to anon, authenticated using (status = ''published'')', t);
  end loop;
  foreach t in array array['journey_steps','semester_areas','site_settings'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
  end loop;
end $$;

-- ---------- Storage (bucket publik, tulis hanya admin; gambar maks 5 MB, PDF CV maks 10 MB) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 10485760, array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml','image/x-icon','image/vnd.microsoft.icon','application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 10485760,
  allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml','image/x-icon','image/vnd.microsoft.icon','application/pdf'];

drop policy if exists "portfolio read" on storage.objects;
create policy "portfolio read" on storage.objects for select to anon, authenticated using (bucket_id = 'portfolio');
drop policy if exists "portfolio admin write" on storage.objects;
create policy "portfolio admin write" on storage.objects for all to authenticated
  using (bucket_id = 'portfolio' and public.is_admin()) with check (bucket_id = 'portfolio' and public.is_admin());
