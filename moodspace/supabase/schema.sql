-- Skema Database MoodSpace untuk Supabase (PostgreSQL + RLS)

-- 1. Profil Pengguna (terhubung dengan auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  avatar text,
  created_at timestamptz default now() not null
);

-- 2. Catatan Suasana Hati (Mood Entries)
create table if not exists public.mood_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  mood text not null check (mood in ('happy', 'sad', 'angry', 'anxious', 'calm', 'tired')),
  intensity integer not null check (intensity between 1 and 5),
  note text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. Jurnal Pribadi (Journal Entries)
create table if not exists public.journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  mood_tag text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 4. Pengaturan Pengguna (User Settings)
create table if not exists public.user_settings (
  user_id uuid references auth.users on delete cascade primary key,
  theme text default 'light' check (theme in ('light', 'dark')),
  daily_reminder boolean default true,
  reminder_time text default '20:00',
  updated_at timestamptz default now() not null
);

-- Aktifkan Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.mood_entries enable row level security;
alter table public.journal_entries enable row level security;
alter table public.user_settings enable row level security;

-- Kebijakan akses privat: setiap pengguna hanya dapat mengakses datanya sendiri
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can manage own moods" on public.mood_entries for all using (auth.uid() = user_id);
create policy "Users can manage own journals" on public.journal_entries for all using (auth.uid() = user_id);
create policy "Users can manage own settings" on public.user_settings for all using (auth.uid() = user_id);

