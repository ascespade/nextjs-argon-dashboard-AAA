import { saveDraft } from '../../../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      res.status(405).end('Method Not Allowed');
      return;
    }
    const { slug } = req.query;
    const data = req.body;
    const saved = saveDraft('/' + (slug === 'home' ? '' : slug), data);
    res.status(200).json({ ok: true, page: saved.draft });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
