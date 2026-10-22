-- Seed four portfolio projects (text from repo READMEs / existing portfolio copy)
insert into public.projects (
  slug, name, tagline, description, tech_stack, live_url, github_url, theme, sort_order, featured, published
) values
(
  'nsbm-recreation-center',
  'NSBM Recreation Center',
  'Staff portal for NSBM Green University recreation data.',
  'A staff-facing web app (and optional Electron shell) for NSBM Green University recreation center operations. Staff browse students by faculty and batch, sports achievements, athletic records, team cards, and equipment inventory. Super users can mutate data; other roles are read-only. Data lives in Supabase with invite-only auth and RLS.',
  array['Next.js', 'TypeScript', 'Supabase', 'Electron', 'Tailwind CSS'],
  'https://nsbm-recreation-center.netlify.app',
  'https://github.com/dacy472/NSBM-Recreation-Center',
  '{"primary":"#5FE3F0","secondary":"#E8D5A3","fog":"#0E1420","sceneType":"grid","liveLabel":"View Live"}'::jsonb,
  1, true, true
),
(
  'radiant',
  'Radiant',
  'Open-source Android reader for webtoons, manhwa, manga, and comics.',
  'Radiant is a free Android app that does not host content. Users install Tachiyomi-style extensions to browse sources, save a personal library, read in a vertical webtoon reader, track progress, download chapters, migrate series between sources, and back up library data on device.',
  array['Kotlin', 'Jetpack Compose', 'Room', 'OkHttp', 'Material 3'],
  'https://github.com/dacy472/Radiant/releases',
  'https://github.com/dacy472/Radiant',
  '{"primary":"#D9453D","secondary":"#E8D5A3","fog":"#07090F","sceneType":"particles","liveLabel":"Download APK"}'::jsonb,
  2, true, true
),
(
  'healthqor',
  'Healthqor',
  'Digital health identity with encrypted records and AI-assisted care tools.',
  'Healthqor Health ID gives users a Health ID, encrypted sensitive fields, AI symptom triage and diet analysis, a Three.js organ viewer, Find Care map search, and e-Channeling. Doctor and admin portals support appointments and platform management. Spring Boot API with React frontend.',
  array['Spring Boot', 'React', 'MongoDB', 'Redis', 'OpenAI', 'Three.js'],
  'https://healthqor-health-id.vercel.app',
  'https://github.com/Poojana-Fernando/healthqor_HealthID',
  '{"primary":"#7DF2C8","secondary":"#5FE3F0","fog":"#0E1420","sceneType":"aurora","liveLabel":"View Live"}'::jsonb,
  3, true, true
),
(
  'crisisiq',
  'CrisisIQ',
  'AI-powered real-time crisis response coordination.',
  'CrisisIQ connects citizens who need help, volunteers who respond, and coordinators who dispatch assignments. Anonymous help requests, live status tracking, awareness tooling, AI-assisted triage, and Supabase Realtime for live updates. React frontend with Netlify serverless functions.',
  array['React', 'TypeScript', 'Vite', 'Supabase', 'OpenAI', 'Netlify'],
  'https://imaginative-kulfi-3e9086.netlify.app/',
  'https://github.com/RadinReanula/CrisisIQ',
  '{"primary":"#5FE3F0","secondary":"#D9453D","fog":"#07090F","sceneType":"skyline","liveLabel":"View Live"}'::jsonb,
  4, true, true
)
on conflict (slug) do nothing;
