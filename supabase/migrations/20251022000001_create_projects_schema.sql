-- Portfolio projects schema
create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  tech_stack text[] not null default '{}',
  live_url text,
  github_url text,
  theme jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  storage_path text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists project_images_project_id_sort_idx
  on public.project_images (project_id, sort_order);

create unique index if not exists project_images_project_storage_uidx
  on public.project_images (project_id, storage_path);

create index if not exists projects_published_sort_idx
  on public.projects (published, sort_order);

comment on column public.projects.theme is 'JSON: primary, secondary, fog, accent?, sceneType, liveLabel?';
