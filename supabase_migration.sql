-- =========================================================
-- Phase 1 Migration: Supabase Schema & Automated Profile Trigger
-- Run this script in your Supabase SQL Editor
-- =========================================================

-- 1. Create Public Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. RLS Security Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 4. PostgreSQL Function to Handle New User Profile Creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$;

-- 5. Trigger on auth.users Table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Create Messages Table for Realtime Chat
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  contact_id text not null,
  sender_id uuid references auth.users(id),
  sender_type text default 'user', -- 'user' | 'contact'
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Enable RLS on Messages
alter table public.messages enable row level security;

create policy "Allow all read messages"
  on public.messages for select
  using (true);

create policy "Allow authenticated users to insert messages"
  on public.messages for insert
  with check (true);

-- 8. Enable Realtime for Messages
alter publication supabase_realtime add table public.messages;

-- 9. Create Travel Buddies Directory Table
create table if not exists public.travel_buddies (
  id serial primary key,
  name text not null,
  role text not null,
  destination text not null,
  travel_style text not null,
  avatar text not null,
  bio text,
  is_online boolean default true,
  badge text default 'VERIFIED TRAVELER'
);

