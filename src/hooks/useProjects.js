import { useEffect, useState } from 'react';
import { getProjects } from '../lib/getProjects.js';
import { projectsData as fallbackProjects } from '../data/projects.fallback.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';

export function useProjects() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('fallback');

  useEffect(() => {
    let active = true;
    getProjects()
      .then((list) => {
        if (!active) return;
        setProjects(list);
        setSource(isSupabaseConfigured() && list.length ? 'supabase' : 'fallback');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { projects, loading, source };
}
