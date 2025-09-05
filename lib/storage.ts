import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

export function readPage(slug: string) {
  const file = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function writePage(slug: string, data: any) {
  const file = path.join(DATA_DIR, `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  return true;
}

export function ensureDemoPage() {
  const demo = readPage('home');
  if (demo) return;
  const sample = {
    id: 'home',
    slug: 'home',
    title_json: { en: 'NextJS Enterprise Dashboard', ar: 'لوحة التحكم' },
    components_json: [
      { type: 'hero_banner', props: { title: 'NextJS Enterprise Dashboard', subtitle: 'A modern, responsive, and feature-rich dashboard built with Next.js and Tailwind + Preline', ctaText: 'View Dashboard', ctaHref: '/admin/dashboard' } },
      { type: 'features', props: {} },
      { type: 'stats', props: {} },
    ],
    status: 'published',
    version: 1,
    updated_by: 'system',
    updated_at: new Date().toISOString(),
  };
  writePage('home', sample);
}

// initialize demo data at startup
ensureDemoPage();

export default { readPage, writePage, ensureDemoPage };
