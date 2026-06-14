create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.make_chat_title(message_content text)
returns text
language plpgsql
immutable
as $$
declare
  cleaned text;
begin
  cleaned := trim(regexp_replace(coalesce(message_content, ''), '\s+', ' ', 'g'));

  if cleaned = '' then
    return 'New conversation';
  end if;

  if char_length(cleaned) <= 64 then
    return cleaned;
  end if;

  return trim(left(cleaned, 61)) || '...';
end;
$$;

create or replace function public.sync_chat_from_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.chats
  set
    title = case
      when new.role = 'user' and (title = 'New conversation' or title = 'New Chat' or title is null)
        then public.make_chat_title(new.content)
      else title
    end,
    preview = public.make_chat_title(new.content),
    updated_at = now()
  where id = new.chat_id
    and user_id = new.user_id;

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team', 'enterprise')),
  billing_provider text check (billing_provider in ('stripe', 'razorpay')),
  billing_customer_id text,
  subscription_id text,
  subscription_status text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New conversation',
  preview text,
  model text,
  pinned boolean default false not null,
  archived_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  status text not null default 'complete' check (status in ('complete', 'streaming', 'stopped', 'error')),
  input_tokens integer default 0 not null check (input_tokens >= 0),
  output_tokens integer default 0 not null check (output_tokens >= 0),
  total_tokens integer generated always as (input_tokens + output_tokens) stored,
  model text,
  error_message text,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  language_preference text default 'auto' not null,
  memory_enabled boolean default false not null,
  web_search_enabled boolean default false not null,
  theme text default 'dark' not null check (theme in ('dark', 'light', 'system')),
  response_style text default 'balanced' not null check (response_style in ('concise', 'balanced', 'detailed')),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table if not exists public.usage_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null default current_date,
  period_end date not null default current_date,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team', 'enterprise')),
  messages_used integer default 0 not null check (messages_used >= 0),
  tokens_used integer default 0 not null check (tokens_used >= 0),
  message_limit integer default 50 not null check (message_limit >= 0),
  token_limit integer default 100000 not null check (token_limit >= 0),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique (user_id, period_start, period_end)
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chat_id uuid references public.chats(id) on delete cascade,
  message_id uuid references public.messages(id) on delete cascade,
  rating text not null check (rating in ('up', 'down')),
  comment text,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table if not exists public.pinned_chats (
  user_id uuid not null references auth.users(id) on delete cascade,
  chat_id uuid not null references public.chats(id) on delete cascade,
  created_at timestamp with time zone default now() not null,
  primary key (user_id, chat_id)
);

alter table public.profiles add column if not exists plan text not null default 'free';
alter table public.profiles add column if not exists billing_provider text;
alter table public.profiles add column if not exists billing_customer_id text;
alter table public.profiles add column if not exists subscription_id text;
alter table public.profiles add column if not exists subscription_status text;
alter table public.profiles add column if not exists updated_at timestamp with time zone default now() not null;

alter table public.chats add column if not exists pinned boolean default false not null;
alter table public.chats add column if not exists archived_at timestamp with time zone;
alter table public.chats add column if not exists metadata jsonb default '{}'::jsonb not null;
alter table public.chats add column if not exists updated_at timestamp with time zone default now() not null;

alter table public.messages add column if not exists status text not null default 'complete';
alter table public.messages add column if not exists input_tokens integer default 0 not null;
alter table public.messages add column if not exists output_tokens integer default 0 not null;
alter table public.messages add column if not exists total_tokens integer generated always as (input_tokens + output_tokens) stored;
alter table public.messages add column if not exists model text;
alter table public.messages add column if not exists error_message text;
alter table public.messages add column if not exists metadata jsonb default '{}'::jsonb not null;
alter table public.messages add column if not exists updated_at timestamp with time zone default now() not null;

alter table public.user_settings add column if not exists theme text default 'dark' not null;
alter table public.user_settings add column if not exists response_style text default 'balanced' not null;
alter table public.user_settings add column if not exists updated_at timestamp with time zone default now() not null;

create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_subscription_status_idx on public.profiles (subscription_status);
create index if not exists chats_user_updated_idx on public.chats (user_id, updated_at desc);
create index if not exists chats_user_pinned_updated_idx on public.chats (user_id, pinned desc, updated_at desc);
create index if not exists chats_user_archived_idx on public.chats (user_id, archived_at);
create index if not exists chats_user_title_idx on public.chats using gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(preview, '')));
create index if not exists messages_chat_created_idx on public.messages (chat_id, created_at);
create index if not exists messages_user_created_idx on public.messages (user_id, created_at desc);
create index if not exists messages_role_idx on public.messages (role);
create index if not exists usage_limits_user_period_idx on public.usage_limits (user_id, period_start desc, period_end desc);
create index if not exists feedback_user_created_idx on public.feedback (user_id, created_at desc);
create index if not exists feedback_message_idx on public.feedback (message_id);
create index if not exists pinned_chats_user_created_idx on public.pinned_chats (user_id, created_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_chats_updated_at on public.chats;
create trigger set_chats_updated_at
  before update on public.chats
  for each row execute function public.set_updated_at();

drop trigger if exists set_messages_updated_at on public.messages;
create trigger set_messages_updated_at
  before update on public.messages
  for each row execute function public.set_updated_at();

drop trigger if exists sync_chat_after_message_insert on public.messages;
create trigger sync_chat_after_message_insert
  after insert on public.messages
  for each row execute function public.sync_chat_from_message();

drop trigger if exists set_user_settings_updated_at on public.user_settings;
create trigger set_user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();

drop trigger if exists set_usage_limits_updated_at on public.usage_limits;
create trigger set_usage_limits_updated_at
  before update on public.usage_limits
  for each row execute function public.set_updated_at();

drop trigger if exists set_feedback_updated_at on public.feedback;
create trigger set_feedback_updated_at
  before update on public.feedback
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.user_settings enable row level security;
alter table public.usage_limits enable row level security;
alter table public.feedback enable row level security;
alter table public.pinned_chats enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "chats_select_own" on public.chats;
create policy "chats_select_own" on public.chats
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "chats_insert_own" on public.chats;
create policy "chats_insert_own" on public.chats
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "chats_update_own" on public.chats;
create policy "chats_update_own" on public.chats
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "chats_delete_own" on public.chats;
create policy "chats_delete_own" on public.chats
  for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own" on public.messages
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own" on public.messages
  for insert to authenticated with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.chats
      where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
    )
  );

drop policy if exists "messages_update_own" on public.messages;
create policy "messages_update_own" on public.messages
  for update to authenticated using (auth.uid() = user_id) with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.chats
      where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
    )
  );

drop policy if exists "messages_delete_own" on public.messages;
create policy "messages_delete_own" on public.messages
  for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "settings_select_own" on public.user_settings;
create policy "settings_select_own" on public.user_settings
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "settings_insert_own" on public.user_settings;
create policy "settings_insert_own" on public.user_settings
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "settings_update_own" on public.user_settings;
create policy "settings_update_own" on public.user_settings
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "usage_limits_select_own" on public.usage_limits;
create policy "usage_limits_select_own" on public.usage_limits
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "usage_limits_insert_own" on public.usage_limits;
create policy "usage_limits_insert_own" on public.usage_limits
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "usage_limits_update_own" on public.usage_limits;
create policy "usage_limits_update_own" on public.usage_limits
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "feedback_select_own" on public.feedback;
create policy "feedback_select_own" on public.feedback
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "feedback_insert_own" on public.feedback;
create policy "feedback_insert_own" on public.feedback
  for insert to authenticated with check (
    auth.uid() = user_id
    and (chat_id is null or exists (
      select 1 from public.chats
      where chats.id = feedback.chat_id
      and chats.user_id = auth.uid()
    ))
    and (message_id is null or exists (
      select 1 from public.messages
      where messages.id = feedback.message_id
      and messages.user_id = auth.uid()
    ))
  );

drop policy if exists "feedback_update_own" on public.feedback;
create policy "feedback_update_own" on public.feedback
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "feedback_delete_own" on public.feedback;
create policy "feedback_delete_own" on public.feedback
  for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "pinned_chats_select_own" on public.pinned_chats;
create policy "pinned_chats_select_own" on public.pinned_chats
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "pinned_chats_insert_own" on public.pinned_chats;
create policy "pinned_chats_insert_own" on public.pinned_chats
  for insert to authenticated with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.chats
      where chats.id = pinned_chats.chat_id
      and chats.user_id = auth.uid()
    )
  );

drop policy if exists "pinned_chats_delete_own" on public.pinned_chats;
create policy "pinned_chats_delete_own" on public.pinned_chats
  for delete to authenticated using (auth.uid() = user_id);
