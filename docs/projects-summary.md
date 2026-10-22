# Portfolio project summaries

Captured from shallow clones under `Documents/_project-capture/repos` (October 2026).

---

## nsbm-recreation-center

- **Name:** NSBM Recreation Center
- **Tagline:** Staff portal for NSBM Green University recreation data.
- **Description:** A staff-facing web app (and optional Electron shell) for managing recreation-center operations at NSBM Green University. Signed-in staff browse students by faculty and batch, sports achievements, athletic records, team cards, and equipment inventory. Super users can mutate data; other roles are read-only. Data lives in Supabase with invite-only auth and RLS.
- **Tech stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Supabase (`@supabase/ssr`), Papa Parse, Electron (optional shell), Netlify deploy
- **Repo:** https://github.com/dacy472/NSBM-Recreation-Center
- **Run locally:** `npm install` → copy `.env.example` to `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → `npm run dev` → http://localhost:3000
- **Main screens:** Login, Dashboard, Students, Achievements (Sports Fiesta / Inter University), Team Cards, Inventory, CSV import flows

---

## radiant

- **Name:** Radiant
- **Tagline:** Open-source Android reader for webtoons, manhwa, manga, and comics.
- **Description:** Radiant is a free Android app that does not host content. Users install Tachiyomi-style extensions to browse sources, save a personal library, read in a vertical webtoon reader, track progress, download chapters, migrate series between sources, and back up library data—all on device.
- **Tech stack:** Kotlin, Jetpack Compose, Material 3, Room (KSP), OkHttp, Coil, Navigation Compose, DataStore, WorkManager
- **Repo:** https://github.com/dacy472/Radiant
- **Run locally:** Android Studio or JDK 17+ → `./gradlew :app:assembleDebug` → install `app/build/outputs/apk/debug/app-debug.apk` (no web UI for Playwright)
- **Main screens:** Browse (Sources / Channels), Library, Reader, Downloads, Settings, extension install flow

---

## healthqor

- **Name:** Healthqor
- **Tagline:** Digital health identity for Sri Lanka with encrypted records and AI-assisted care tools.
- **Description:** Healthqor Health ID gives users a unique Health ID, encrypted sensitive fields, AI symptom triage and diet analysis, a Three.js organ viewer, Find Care map search, and e-Channeling. Separate doctor and admin portals support appointments, schedules, and platform management. Backend is Spring Boot; frontend is React on Vite.
- **Tech stack:** Spring Boot 3, Java 21, React 18, Vite, Tailwind, MongoDB, Redis (optional), OpenAI, Three.js, Leaflet
- **Repo:** https://github.com/Poojana-Fernando/healthqor_HealthID
- **Run locally:** MongoDB replica set URI + `.env` from `.env.example` → backend via `backend/run.ps1` → frontend `npm install && npm run dev` (see README for ports)
- **Live:** https://healthqor-health-id.vercel.app
- **Main screens:** Home, Login/Signup, Dashboard, AI symptom checker, 3D organ viewer, Find Care, e-Channeling, doctor portal (`/doctor`), admin panel

---

## crisisiq

- **Name:** CrisisIQ
- **Tagline:** AI-powered real-time crisis response coordination.
- **Description:** CrisisIQ connects citizens who need help, volunteers who respond, and coordinators who dispatch assignments. Anonymous help requests, live status tracking, an awareness map, AI news digest, and OpenAI-backed triage and chat run on React with Supabase Realtime and Netlify serverless functions.
- **Tech stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, react-router-dom 7, Leaflet, Supabase, Netlify Functions, OpenAI
- **Repo:** https://github.com/RadinReanula/CrisisIQ
- **Run locally:** Copy `.env.example` to `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (plus server keys for Netlify functions via `netlify dev`) → `npm install` → `npm run dev` (Vite default http://localhost:5173)
- **Main screens:** Home, Submit help request, Request status, Global awareness map, AI news, Volunteer register/dashboard, Coordinator login/panel
