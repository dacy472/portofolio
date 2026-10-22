/**
 * Upload project screenshots to Supabase Storage and insert project_images rows.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-images.mjs <slug> <local-folder>
 *
 * Example:
 *   node scripts/upload-images.mjs nsbm-recreation-center ./public/assets/projects/nsbm-recreation-center
 *
 * Requires: npm install sharp @supabase/supabase-js (dev)
 */
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (service role only — never in the Vite app).');
  process.exit(1);
}

const slug = process.argv[2];
const folder = process.argv[3];

if (!slug || !folder) {
  console.error('Usage: node scripts/upload-images.mjs <slug> <local-folder>');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const { data: project, error: projectError } = await supabase
  .from('projects')
  .select('id')
  .eq('slug', slug)
  .maybeSingle();

if (projectError || !project) {
  console.error('Project not found for slug:', slug, projectError?.message);
  process.exit(1);
}

const files = fs
  .readdirSync(folder)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort();

let order = 0;
for (const file of files) {
  order += 1;
  const base = file.replace(/\.(png|jpe?g|webp)$/i, '');
  const webpBuffer = await sharp(path.join(folder, file))
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const storagePath = `${slug}/${String(order).padStart(2, '0')}-${base}.webp`;

  const { error: uploadError } = await supabase.storage
    .from('project-images')
    .upload(storagePath, webpBuffer, {
      contentType: 'image/webp',
      upsert: true,
    });

  if (uploadError) {
    console.error('Upload failed:', storagePath, uploadError.message);
    continue;
  }

  const { error: rowError } = await supabase.from('project_images').upsert(
    {
      project_id: project.id,
      storage_path: storagePath,
      alt: `${slug} ${base}`,
      sort_order: order,
    },
    { onConflict: 'project_id,storage_path', ignoreDuplicates: false },
  );

  if (rowError) {
    console.error('Row insert failed:', storagePath, rowError.message);
    continue;
  }

  console.log('OK', storagePath);
}

console.log('Done.');
