import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'public';

let supabase: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { 'x-from': 'server' } },
  });
}

// Filesystem fallback (keeps previous behavior when Supabase is not configured)
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

async function readPage(slug: string) {
  if (supabase) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  const file = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

async function writePage(slug: string, data: any) {
  if (supabase) {
    // Upsert page row and create a page_versions entry
    const { data: existing, error: selErr } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();
    if (selErr) throw selErr;

    if (existing) {
      const updated = {
        ...existing,
        ...data,
        slug,
        updated_at: new Date().toISOString(),
      };
      const { error: updErr } = await supabase
        .from('pages')
        .update(updated)
        .eq('id', existing.id);
      if (updErr) throw updErr;
      // insert version
      const version = (existing.version || 0) + 1;
      const { error: verErr } = await supabase
        .from('page_versions')
        .insert([
          {
            page_id: existing.id,
            version,
            components_json: updated.components_json,
            created_by: updated.updated_by || 'unknown',
          },
        ]);
      if (verErr) throw verErr;
      return updated;
    } else {
      const toInsert = {
        slug,
        title_json: data.title_json || null,
        components_json: data.components_json || data.components || [],
        status: data.status || 'draft',
        version: data.version || 1,
        updated_by: data.updated_by || 'unknown',
        updated_at: new Date().toISOString(),
      };
      const { data: insData, error: insErr } = await supabase
        .from('pages')
        .insert([toInsert])
        .select()
        .single();
      if (insErr) throw insErr;
      // insert initial version
      const { error: verErr } = await supabase
        .from('page_versions')
        .insert([
          {
            page_id: insData.id,
            version: insData.version || 1,
            components_json: toInsert.components_json,
            created_by: toInsert.updated_by,
          },
        ]);
      if (verErr) throw verErr;
      return insData;
    }
  }

  const file = path.join(DATA_DIR, `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  return true;
}

async function publishPage(slug: string) {
  if (supabase) {
    const { data: existing, error: selErr } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();
    if (selErr) throw selErr;
    if (!existing) throw new Error('Page not found');
    const draft = {
      ...existing,
      status: 'published',
      version: (existing.version || 0) + 1,
      updated_at: new Date().toISOString(),
    };
    const { error: updErr } = await supabase
      .from('pages')
      .update(draft)
      .eq('id', existing.id);
    if (updErr) throw updErr;
    const { error: verErr } = await supabase
      .from('page_versions')
      .insert([
        {
          page_id: existing.id,
          version: draft.version,
          components_json: draft.components_json,
          created_by: draft.updated_by,
        },
      ]);
    if (verErr) throw verErr;
    return draft;
  }

  const file = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    const existing = JSON.parse(raw);
    existing.status = 'published';
    existing.version = (existing.version || 0) + 1;
    existing.updated_at = new Date().toISOString();
    fs.writeFileSync(file, JSON.stringify(existing, null, 2), 'utf-8');
    return existing;
  } catch (e) {
    throw e;
  }
}

async function uploadImageFromBase64(filename: string, base64Data: string) {
  const base64 = base64Data.replace(
    /^data:image\/(png|jpeg|jpg|webp);base64,/,
    ''
  );
  const buffer = Buffer.from(base64, 'base64');
  const filepath = `uploads/${filename}`;

  if (supabase) {
    // Ensure bucket exists or rely on existing bucket
    const { error: upErr } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(filepath, buffer, { upsert: true, contentType: 'image/png' });
    if (upErr) throw upErr;
    const { data } = supabase.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(filepath);
    return data.publicUrl;
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
}

async function ensureDemoPage() {
  if (supabase) {
    const { data: existing, error: selErr } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', 'home')
      .limit(1)
      .maybeSingle();
    if (selErr) throw selErr;
    if (existing) return;
    const sample = {
      slug: 'home',
      title_json: { en: 'NextJS Enterprise Dashboard', ar: 'لوحة التحكم' },
      components_json: [
        {
          type: 'hero_banner',
          props: {
            title: 'NextJS Enterprise Dashboard',
            subtitle:
              'A modern, responsive, and feature-rich dashboard built with Next.js and Tailwind + Preline',
            ctaText: 'View Dashboard',
            ctaHref: '/admin/dashboard',
          },
        },
        { type: 'features', props: {} },
        { type: 'stats', props: {} },
      ],
      status: 'published',
      version: 1,
      updated_by: 'system',
      updated_at: new Date().toISOString(),
    };
    const { data: insData, error: insErr } = await supabase
      .from('pages')
      .insert([sample])
      .select()
      .single();
    if (insErr) throw insErr;
    await supabase
      .from('page_versions')
      .insert([
        {
          page_id: insData.id,
          version: 1,
          components_json: sample.components_json,
          created_by: 'system',
        },
      ]);
    return;
  }

  const demo = await readPage('home');
  if (demo) return;
  const sample = {
    id: 'home',
    slug: 'home',
    title_json: { en: 'NextJS Enterprise Dashboard', ar: 'لوحة التحكم' },
    components_json: [
      {
        type: 'hero_banner',
        props: {
          title: 'NextJS Enterprise Dashboard',
          subtitle:
            'A modern, responsive, and feature-rich dashboard built with Next.js and Tailwind + Preline',
          ctaText: 'View Dashboard',
          ctaHref: '/admin/dashboard',
        },
      },
      { type: 'features', props: {} },
      { type: 'stats', props: {} },
    ],
    status: 'published',
    version: 1,
    updated_by: 'system',
    updated_at: new Date().toISOString(),
  };
  const file = path.join(DATA_DIR, `home.json`);
  fs.writeFileSync(file, JSON.stringify(sample, null, 2), 'utf-8');
}

export {
  readPage,
  writePage,
  publishPage,
  uploadImageFromBase64,
  ensureDemoPage,
};
const supabaseApi = {
  readPage,
  writePage,
  publishPage,
  uploadImageFromBase64,
  ensureDemoPage,
};
export default supabaseApi;
