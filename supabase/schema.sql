-- someshthakur.tech: guestbook + visitor counter.
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to run again; it only creates what's missing and replaces the policies.

-- ───────── settings (only the admin can change) ─────────
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  require_approval boolean not null default false
);
insert into public.site_settings (id) values (1) on conflict do nothing;

-- ───────── guestbook ─────────
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null default '' check (char_length(name) <= 40),
  message text not null check (char_length(btrim(message)) between 1 and 240),
  doodle text check (doodle is null or char_length(doodle) <= 8000),
  color text not null default 'mustard' check (color in ('mustard', 'olive', 'terracotta', 'paper')),
  hidden boolean not null default false
);
create index if not exists guestbook_created_idx on public.guestbook (created_at desc);

-- New notes: forced visible/hidden by the approval setting, and a flood guard
-- (at most 15 notes a minute across the whole site).
create or replace function public.guestbook_before_insert() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.guestbook where created_at > now() - interval '1 minute') >= 15 then
    raise exception 'Too many notes right now. Try again in a minute.';
  end if;
  new.hidden := (select require_approval from public.site_settings where id = 1);
  new.created_at := now();
  new.name := btrim(new.name);
  new.message := btrim(new.message);
  return new;
end $$;

drop trigger if exists guestbook_before_insert on public.guestbook;
create trigger guestbook_before_insert before insert on public.guestbook
  for each row execute function public.guestbook_before_insert();

-- ───────── visitor counter ─────────
create table if not exists public.site_stats (
  id int primary key default 1 check (id = 1),
  visits bigint not null default 0
);
insert into public.site_stats (id) values (1) on conflict do nothing;

-- +1 and return the new total (the site calls this once per browser per day)
create or replace function public.bump_visits() returns bigint
language sql security definer set search_path = public as $$
  update public.site_stats set visits = visits + 1 where id = 1 returning visits;
$$;

-- read without counting
create or replace function public.get_visits() returns bigint
language sql security definer stable set search_path = public as $$
  select visits from public.site_stats where id = 1;
$$;

grant execute on function public.bump_visits() to anon, authenticated;
grant execute on function public.get_visits() to anon, authenticated;

-- ───────── who is the admin ─────────
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'someshrthakur@gmail.com'
     and coalesce((auth.jwt() ->> 'email_verified')::boolean, true);
$$;

-- ───────── row level security ─────────
alter table public.guestbook enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_stats enable row level security;

drop policy if exists "read visible notes" on public.guestbook;
drop policy if exists "admin reads all notes" on public.guestbook;
drop policy if exists "anyone can sign" on public.guestbook;
drop policy if exists "admin edits notes" on public.guestbook;
drop policy if exists "admin removes notes" on public.guestbook;
drop policy if exists "read settings" on public.site_settings;
drop policy if exists "admin changes settings" on public.site_settings;

create policy "read visible notes" on public.guestbook for select using (hidden = false);
create policy "admin reads all notes" on public.guestbook for select to authenticated using (public.is_admin());
create policy "anyone can sign" on public.guestbook for insert to anon, authenticated with check (true);
create policy "admin edits notes" on public.guestbook for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin removes notes" on public.guestbook for delete to authenticated using (public.is_admin());

create policy "read settings" on public.site_settings for select using (true);
create policy "admin changes settings" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- site_stats has no policies: it is only touched through the two functions above.
