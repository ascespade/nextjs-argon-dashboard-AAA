import { NextApiRequest, NextApiResponse } from 'next';
import storage from '../../../../../lib/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query as { slug: string };
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const existing = storage.readPage(slug) || {};
    const draft = existing;
    draft.status = 'published';
    draft.version = (existing.version || 0) + 1;
    draft.updated_at = new Date().toISOString();
    storage.writePage(slug, draft);
    return res.status(200).json({ ok: true, data: draft });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to publish' });
  }
}
