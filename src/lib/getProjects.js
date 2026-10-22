import { projectsData as fallbackProjects } from '../data/projects.fallback.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

let cachedProjects = null;
let inflight = null;

function themeFromRow(themeJson, liveUrl) {
  const theme = { ...(themeJson || {}) };
  const { liveLabel, ...scene } = theme;
  return {
    scene,
    liveLabel: liveLabel || (liveUrl ? 'View Live' : ''),
  };
}

function mapRow(row) {
  const images = (row.project_images || [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((img) => {
      if (!img.storage_path) return null;
      if (img.storage_path.startsWith('http') || img.storage_path.startsWith('/')) {
        return img.storage_path;
      }
      if (!supabase) return null;
      const { data } = supabase.storage.from('project-images').getPublicUrl(img.storage_path);
      return data.publicUrl;
    })
    .filter(Boolean);

  const { scene, liveLabel } = themeFromRow(row.theme, row.live_url);

  return {
    id: row.slug,
    title: row.name,
    shortDescription: row.tagline || '',
    longDescription: row.description || '',
    techStack: row.tech_stack || [],
    images,
    githubUrl: row.github_url || '',
    liveUrl: row.live_url || '',
    liveLabel,
    theme: scene,
  };
}

export async function getProjects() {
  if (cachedProjects) return cachedProjects;
  if (inflight) return inflight;

  inflight = (async () => {
    if (!isSupabaseConfigured()) {
      cachedProjects = fallbackProjects;
      return cachedProjects;
    }

    const { data, error } = await supabase
      .from('projects')
      .select(
        `
        slug,
        name,
        tagline,
        description,
        tech_stack,
        live_url,
        github_url,
        theme,
        sort_order,
        project_images (
          storage_path,
          alt,
          sort_order
        )
      `,
      )
      .eq('published', true)
      .order('sort_order', { ascending: true });

    if (error || !data?.length) {
      console.warn('[getProjects] Supabase fetch failed or empty; using fallback.', error?.message);
      cachedProjects = fallbackProjects;
      return cachedProjects;
    }

    cachedProjects = data.map(mapRow);
    return cachedProjects;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function clearProjectsCache() {
  cachedProjects = null;
  inflight = null;
}
