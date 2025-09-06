-- Supabase demo schema (pages, page_versions, components_library, uploads, users_profiles)
create table if not exists pages (
  id uuid primary key default gen_random_uuid (),
  slug text unique not null,
  title_json jsonb,
  components_json jsonb,
  status text default 'draft',
  version int default 1,
  updated_by text,
  updated_at timestamptz default now ()
);

create table if not exists page_versions (
  id uuid primary key default gen_random_uuid (),
  page_id uuid references pages (id) on delete cascade,
  version int,
  components_json jsonb,
  created_by text,
  created_at timestamptz default now ()
);

create table if not exists components_library (
  id uuid primary key default gen_random_uuid (),
  type text not null,
  name text not null,
  category text not null,
  description text,
  preview_meta jsonb,
  props_template jsonb,
  created_at timestamptz default now ()
);

create table if not exists uploads (
  id uuid primary key default gen_random_uuid (),
  path text,
  url text,
  metadata jsonb,
  created_at timestamptz default now ()
);

create table if not exists users_profiles (
  id uuid primary key default gen_random_uuid (),
  user_id uuid references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text default 'user',
  avatar_url text,
  created_at timestamptz default now (),
  updated_at timestamptz default now ()
);

-- Enable RLS
alter table pages enable row level security;

alter table page_versions enable row level security;

alter table components_library enable row level security;

alter table uploads enable row level security;

alter table users_profiles enable row level security;

-- Create policies
create policy "Allow all operations for authenticated users" on pages for all using (auth.role () = 'authenticated');

create policy "Allow all operations for authenticated users" on page_versions for all using (auth.role () = 'authenticated');

create policy "Allow read access to components library" on components_library for
select
  using (true);

create policy "Allow all operations for authenticated users" on uploads for all using (auth.role () = 'authenticated');

create policy "Users can view own profile" on users_profiles for
select
  using (auth.uid () = user_id);

create policy "Users can update own profile" on users_profiles for
update using (auth.uid () = user_id);

create policy "Admins can view all profiles" on users_profiles for
select
  using (
    exists (
      select
        1
      from
        users_profiles
      where
        user_id = auth.uid ()
        and role = 'admin'
    )
  );

create policy "Admins can update all profiles" on users_profiles for
update using (
  exists (
    select
      1
    from
      users_profiles
    where
      user_id = auth.uid ()
      and role = 'admin'
  )
);