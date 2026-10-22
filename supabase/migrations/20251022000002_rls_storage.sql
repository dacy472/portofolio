-- RLS + storage (replace admin UUID after you sign up — see STEP 7 report)
alter table public.projects enable row level security;
alter table public.project_images enable row level security;

-- TODO: run once after Auth signup:
-- update public.portfolio_admin set user_id = '<your-auth-users-id>' where id = 1;

create table if not exists public.portfolio_admin (
  id int primary key default 1 check (id = 1),
  user_id uuid,
  email text
);

insert into public.portfolio_admin (id, user_id, email)
values (1, null, null)
on conflict (id) do nothing;

alter table public.portfolio_admin enable row level security;

create policy "portfolio_admin_select_own"
  on public.portfolio_admin
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "projects_public_read"
  on public.projects
  for select
  to anon, authenticated
  using (published = true);

create policy "projects_admin_write"
  on public.projects
  for all
  to authenticated
  using (
    exists (
      select 1 from public.portfolio_admin pa
      where pa.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.portfolio_admin pa
      where pa.user_id = auth.uid()
    )
  );

create policy "project_images_public_read"
  on public.project_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_images.project_id
        and p.published = true
    )
  );

create policy "project_images_admin_write"
  on public.project_images
  for all
  to authenticated
  using (
    exists (
      select 1 from public.portfolio_admin pa
      where pa.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.portfolio_admin pa
      where pa.user_id = auth.uid()
    )
  );

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

create policy "project_images_storage_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'project-images');

create policy "project_images_storage_admin_write"
  on storage.objects
  for all
  to authenticated
  using (
    bucket_id = 'project-images'
    and exists (
      select 1 from public.portfolio_admin pa
      where pa.user_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'project-images'
    and exists (
      select 1 from public.portfolio_admin pa
      where pa.user_id = auth.uid()
    )
  );
