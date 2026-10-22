# Supabase setup for portfolio projects

## 1. Create the cloud project

The Supabase MCP in Cursor currently only exposed `mcp_auth` (no org/project APIs). Create the project in the dashboard:

1. [Supabase Dashboard](https://supabase.com/dashboard) → your **portfolio** organization.
2. **New project** → name: `portfolio`, region: **Singapore (ap-southeast-1)**.
3. **Free plan** — $0/month within [free-tier limits](https://supabase.com/pricing).

## 2. Apply migrations

```bash
cd c:\Users\LOQ\Documents\Portofolio
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Migrations create `projects`, `project_images`, `portfolio_admin`, RLS, and the `project-images` storage bucket.

## 3. Admin user (for INSERT/UPDATE)

1. In the dashboard: **Authentication** → enable Email → sign up with your admin email.
2. Copy your user UUID from **Authentication → Users**.
3. Run in SQL editor:

```sql
update public.portfolio_admin
set user_id = 'YOUR-USER-UUID', email = 'you@example.com'
where id = 1;
```

## 4. Environment variables

**Local** (copy `.env.example` → `.env`):

- `VITE_SUPABASE_URL` — Project Settings → API → Project URL
- `VITE_SUPABASE_ANON_KEY` — `anon` `public` key

**Hosting** (Netlify/Vercel/etc.): same `VITE_*` vars at build time.

**Upload script only** (never in the app):

- `SUPABASE_SERVICE_ROLE_KEY` — service role secret

## 5. Upload images

```bash
set SUPABASE_URL=https://YOUR_REF.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=...
npm run upload-images -- nsbm-recreation-center ./public/assets/projects/nsbm-recreation-center
```

Repeat per slug folder.

## 6. Security advisor

After linking the project, run **Database → Security Advisor** and **Storage** advisories in the dashboard. Expected fixes: ensure RLS stays enabled; no public write policies.

## 7. Add a new project

1. Insert a row in `projects` (as admin via SQL or a future admin UI).
2. Upload images with `npm run upload-images -- <slug> <folder>`.
3. Set `sort_order` and `published = true`.
