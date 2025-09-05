-- Supabase demo schema (pages, page_versions, components_library, uploads)

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_json jsonb,
  components_json jsonb,
  status text default 'draft',
  version int default 1,
  updated_by text,
  updated_at timestamptz default now()
);

create table if not exists page_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade,
  version int,
  components_json jsonb,
  created_by text,
  created_at timestamptz default now()
);

create table if not exists components_library (
  id uuid primary key default gen_random_uuid(),
  type text,
  preview_meta jsonb,
  props_template jsonb
);

create table if not exists uploads (
  id uuid primary key default gen_random_uuid(),
  path text,
  url text,
  metadata jsonb,
  created_at timestamptz default now()
);
