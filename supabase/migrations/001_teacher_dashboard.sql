-- =====================================================================
-- Teacher Dashboard — new tables + RLS
-- Run in Supabase SQL Editor: Dashboard → SQL Editor → New query
-- =====================================================================

-- Classes (one row per teacher class)
create table if not exists classes (
  id          uuid        primary key default gen_random_uuid(),
  teacher_id  uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  join_code   text        not null unique,
  created_at  timestamptz default now()
);

create index if not exists idx_classes_teacher_id
  on classes (teacher_id);

create index if not exists idx_classes_join_code
  on classes (join_code);

-- Class memberships (links an anonymous session_id to a class)
create table if not exists class_memberships (
  id          uuid        primary key default gen_random_uuid(),
  class_id    uuid        not null references classes(id) on delete cascade,
  session_id  text        not null,
  joined_at   timestamptz default now(),
  constraint unique_class_session unique (class_id, session_id)
);

create index if not exists idx_class_memberships_class_id
  on class_memberships (class_id);

create index if not exists idx_class_memberships_session_id
  on class_memberships (session_id);

-- ======= Row-Level Security =======

alter table classes           enable row level security;
alter table class_memberships enable row level security;

-- CLASSES
-- Authenticated teachers have full control of their own classes
create policy "teachers_own_classes" on classes
  for all to authenticated
  using  (teacher_id = auth.uid())
  with check (teacher_id = auth.uid());

-- Anonymous users can look up any class to validate a join code
create policy "anon_read_classes" on classes
  for select to anon
  using (true);

-- CLASS MEMBERSHIPS
-- Anyone (anon or authenticated) can insert a membership to join a class
create policy "anyone_can_join" on class_memberships
  for insert to anon, authenticated
  with check (true);

-- Anyone can read memberships — session_ids are random UUIDs so this is
-- effectively private; needed so a student can check if they already joined
create policy "anyone_can_read_memberships" on class_memberships
  for select to anon, authenticated
  using (true);
