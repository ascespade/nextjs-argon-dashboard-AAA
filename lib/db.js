import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

const defaultDB = {
  version: 1,
  pages: {
    home: {
      id: 'home',
      slug: '/',
      draft: {
        components: [
          {
            id: 'hero-1',
            type: 'hero_banner',
            props: {
              title: 'Empower your business for Vision 2030',
              subtitle: 'Modern solutions for Saudi SMEs — design, deploy, and scale with confidence.',
              buttonText: 'Get Started',
              buttonHref: '/dashboard',
              image: '/assets/img/hero-illustration.png',
              badge: 'Vision 2030 Ready'
            },
            layout: { fullWidth: true },
            style: {}
          },
          {
            id: 'features-1',
            type: 'features',
            props: {
              items: [
                { id: 'f1', icon: 'ni ni-globe-2', title: 'Global Reach', text: 'Scale your business internationally with localized tools.' },
                { id: 'f2', icon: 'ni ni-lock-circle-open', title: 'Secure', text: 'Enterprise-grade security and compliance.' },
                { id: 'f3', icon: 'ni ni-chart-bar-32', title: 'Analytics', text: 'Insights to grow revenue and improve performance.' }
              ]
            },
            layout: {},
            style: {}
          },
          {
            id: 'stats-1',
            type: 'stats_counter',
            props: { items: [ { id: 's1', label: 'Customers', value: '12,345' }, { id: 's2', label: 'Projects', value: '1,234' }, { id: 's3', label: 'Uptime', value: '99.99%' } ] },
            layout: {},
            style: {}
          },
          {
            id: 'gallery-1',
            type: 'gallery',
            props: { images: [ '/assets/img/gallery-1.jpg', '/assets/img/gallery-2.jpg', '/assets/img/gallery-3.jpg' ] },
            layout: {},
            style: {}
          },
          {
            id: 'testimonials-1',
            type: 'testimonials',
            props: { items: [ { id: 't1', name: 'Aisha', role: 'Founder', avatar: '/assets/img/team-1-800x800.jpg', quote: 'This platform helped our startup scale.' }, { id: 't2', name: 'Omar', role: 'CTO', avatar: '/assets/img/team-2-800x800.jpg', quote: 'Reliable and fast support.' } ] },
            layout: {},
            style: {}
          },
          {
            id: 'cta-1',
            type: 'cta_section',
            props: { title: 'Ready to transform your business?', buttonText: 'Start Free', buttonHref: '/register' },
            layout: {},
            style: {}
          },
          {
            id: 'faq-1',
            type: 'faq',
            props: { items: [ { id: 'q1', q: 'How to start?', a: 'Sign up and follow the onboarding steps.' }, { id: 'q2', q: 'Is support available?', a: '24/7 support in Arabic and English.' } ] },
            layout: {},
            style: {}
          }
        ]
      },
      published: {
        components: []
      }
    }
  },
  users: [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123'
    }
  ],
  components_library: [
    { id: 'lib-text', type: 'text_block', props: { text: 'Editable text' }, layout: {}, style: {} },
    { id: 'lib-image', type: 'image', props: { src: '/uploads/sample.jpg', alt: 'Image' }, layout: {}, style: {} },
    { id: 'lib-button', type: 'button', props: { label: 'Click me', href: '#' }, layout: {}, style: {} },
    { id: 'lib-hero', type: 'hero_banner', props: { title: 'Hero title', subtitle: 'Subtitle', buttonText: 'Action', buttonHref: '#' }, layout: { fullWidth: true }, style: {} },
    { id: 'lib-gallery', type: 'gallery', props: { images: [] }, layout: {}, style: {} },
    { id: 'lib-stats', type: 'stats_counter', props: { items: [] }, layout: {}, style: {} },
    { id: 'lib-testimonials', type: 'testimonials', props: { items: [] }, layout: {}, style: {} },
    { id: 'lib-cta', type: 'cta_section', props: { title: 'Call to action', buttonText: 'Do it', buttonHref: '#' }, layout: {}, style: {} }
  ],
  versions: {
    home: []
  }
};

function ensureDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2));
  }
}

function readDB() {
  ensureDB();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getPage(slug, { mode = 'published' } = {}) {
  const db = readDB();
  const key = slug === '/' ? 'home' : slug.replace(/^\//, '');
  const page = db.pages[key];
  if (!page) return { id: key, slug: slug, [mode]: { components: [] } };
  return { id: page.id, slug: page.slug, draft: page.draft || { components: [] }, published: page.published || { components: [] } };
}

export function saveDraft(slug, data) {
  const db = readDB();
  const key = slug === '/' ? 'home' : slug.replace(/^\//, '');
  db.pages[key] = db.pages[key] || { id: key, slug: slug, draft: { components: [] }, published: { components: [] } };
  // versioning: push previous draft
  db.versions[key] = db.versions[key] || [];
  db.versions[key].push({ ts: Date.now(), draft: db.pages[key].draft });
  db.pages[key].draft = data;
  writeDB(db);
  return db.pages[key];
}

export function publishPage(slug) {
  const db = readDB();
  const key = slug === '/' ? 'home' : slug.replace(/^\//, '');
  const page = db.pages[key];
  if (!page) throw new Error('Page not found');
  page.published = JSON.parse(JSON.stringify(page.draft || { components: [] }));
  writeDB(db);
  return page;
}

export function getComponentsLibrary() {
  const db = readDB();
  return db.components_library || [];
}

export function listVersions(slug) {
  const db = readDB();
  const key = slug === '/' ? 'home' : slug.replace(/^\//, '');
  return db.versions[key] || [];
}

export function rollbackToVersion(slug, index) {
  const db = readDB();
  const key = slug === '/' ? 'home' : slug.replace(/^\//, '');
  const versions = db.versions[key] || [];
  if (index < 0 || index >= versions.length) throw new Error('Invalid version index');
  db.pages[key].draft = JSON.parse(JSON.stringify(versions[index].draft));
  writeDB(db);
  return db.pages[key];
}

export function findUserByCredentials(email, password) {
  const db = readDB();
  return (db.users || []).find(u => u.email === email && u.password === password) || null;
}
