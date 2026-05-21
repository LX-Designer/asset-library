-- Run this in your Supabase SQL editor to set up the required tables.
-- Dashboard → SQL Editor → New query → paste & run.

-- Stores individual learner responses within an asset (one row per question)
create table if not exists asset_responses (
  id           uuid        primary key default gen_random_uuid(),
  session_id   text        not null,
  asset_id     text        not null,
  question_id  text        not null,
  response     jsonb       not null,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  constraint unique_response unique (session_id, asset_id, question_id)
);

-- Stores a completion record when a learner finishes an asset
create table if not exists asset_completions (
  id           uuid        primary key default gen_random_uuid(),
  session_id   text        not null,
  asset_id     text        not null,
  score        numeric,
  metadata     jsonb,
  completed_at timestamptz default now(),
  constraint unique_completion unique (session_id, asset_id)
);

-- Indexes for fast session + asset lookups
create index if not exists idx_asset_responses_session_asset
  on asset_responses (session_id, asset_id);

create index if not exists idx_asset_completions_session_asset
  on asset_completions (session_id, asset_id);

-- Row-level security — open policies for now; lock down when auth is added
alter table asset_responses   enable row level security;
alter table asset_completions enable row level security;

create policy "public_all" on asset_responses
  for all using (true) with check (true);

create policy "public_all" on asset_completions
  for all using (true) with check (true);
