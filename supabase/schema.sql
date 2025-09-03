-- Aletheia Supabase schema
create extension if not exists pgcrypto;

create table if not exists dilemmas_history (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  dilemma_key text,
  custom_text text,
  utilitarian_html text,
  deontologist_html text,
  virtue_ethicist_html text,
  created_at timestamptz not null default now()
);

-- Backfill schema for older deployments
do $$ begin
  if not exists (select 1 from information_schema.columns where table_name='dilemmas_history' and column_name='utilitarian_html') then
    alter table dilemmas_history add column utilitarian_html text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='dilemmas_history' and column_name='deontologist_html') then
    alter table dilemmas_history add column deontologist_html text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='dilemmas_history' and column_name='virtue_ethicist_html') then
    alter table dilemmas_history add column virtue_ethicist_html text;
  end if;
end $$;

alter table dilemmas_history enable row level security;

-- Re-runnable policies

drop policy if exists "insert any history" on dilemmas_history;
create policy "insert own history"
  on dilemmas_history for insert
  to authenticated
  with check (user_id = auth.uid()::text);


drop policy if exists "select own history" on dilemmas_history;
create policy "select own history"
  on dilemmas_history for select
  to authenticated
  using (user_id = auth.uid()::text);


drop policy if exists "delete own history" on dilemmas_history;
create policy "delete own history"
  on dilemmas_history for delete
  to authenticated
  using (user_id = auth.uid()::text);

-- Per-user settings
create table if not exists user_settings (
  user_id text primary key,
  notif_email boolean default true,
  notif_push boolean default false,
  notif_weekly boolean default true,
  theme text default 'dark', -- 'light' | 'dark' | 'auto'
  language text default 'en-US',
  timezone text default 'UTC',
  updated_at timestamptz not null default now()
);

alter table user_settings enable row level security;

drop policy if exists "select own settings" on user_settings;
create policy "select own settings"
  on user_settings for select
  to authenticated
  using (user_id = auth.uid()::text);

drop policy if exists "upsert own settings" on user_settings;
create policy "upsert own settings"
  on user_settings for insert
  to authenticated
  with check (user_id = auth.uid()::text);

-- Update policy needs drop-then-create; IF NOT EXISTS is not supported

drop policy if exists "update own settings" on user_settings;
create policy "update own settings"
  on user_settings for update
  to authenticated
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);
