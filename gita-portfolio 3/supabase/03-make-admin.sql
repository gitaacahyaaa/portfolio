-- 03-make-admin.sql — jalankan SETELAH membuat user di Authentication → Users → Add user.
-- Ganti email di bawah dengan email admin kamu.
insert into public.admins (user_id)
select id from auth.users where email = 'EMAIL-KAMU@gmail.com'
on conflict do nothing;

-- Cek berhasil (harus muncul 1 baris):
select a.user_id, u.email from public.admins a join auth.users u on u.id = a.user_id;
