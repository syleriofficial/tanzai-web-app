create extension if not exists pgcrypto;

create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chat_id text not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  title text,
  created_at timestamp with time zone default now() not null
);

create index if not exists chat_history_user_chat_created_idx
  on public.chat_history (user_id, chat_id, created_at);

create index if not exists chat_history_user_created_idx
  on public.chat_history (user_id, created_at desc);

create index if not exists chat_history_user_chat_title_idx
  on public.chat_history (user_id, chat_id, title)
  where title is not null;

alter table public.chat_history enable row level security;

drop policy if exists "Users can read own chat history" on public.chat_history;
create policy "Users can read own chat history"
  on public.chat_history
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own chat history" on public.chat_history;
create policy "Users can insert own chat history"
  on public.chat_history
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own chat history" on public.chat_history;
create policy "Users can update own chat history"
  on public.chat_history
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own chat history" on public.chat_history;
create policy "Users can delete own chat history"
  on public.chat_history
  for delete
  to authenticated
  using (auth.uid() = user_id);
