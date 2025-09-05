import { getPage, saveDraft } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const { slug } = req.query;
    if (req.method === 'GET') {
      const mode = (req.query.mode === 'draft') ? 'draft' : 'published';
      const page = getPage('/' + (slug === 'home' ? '' : slug), { mode });
      res.status(200).json({ ok: true, page: mode === 'draft' ? page.draft : page.published });
      return;
    }
    if (req.method === 'POST') {
      const data = req.body;
      if (!data || typeof data !== 'object') {
        res.status(400).json({ ok: false, error: 'Invalid body' });
        return;
      }
      const saved = saveDraft('/' + (slug === 'home' ? '' : slug), data);
      res.status(200).json({ ok: true, page: saved.draft });
      return;
    }
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end('Method Not Allowed');
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
