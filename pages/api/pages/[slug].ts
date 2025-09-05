import { NextApiRequest, NextApiResponse } from 'next';
import storage from '../../../../lib/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query as { slug: string };
  if (req.method === 'GET') {
    const page = storage.readPage(slug === 'home' ? 'home' : slug);
    if (!page) return res.status(404).json({ error: 'Not found' });
    // return published by default
    return res.status(200).json({ data: page });
  }

  if (req.method === 'POST') {
    // save draft
    try {
      const body = req.body;
      const existing = storage.readPage(slug) || {};
      const next = {
        ...(existing || {}),
        ...body,
        slug,
        updated_at: new Date().toISOString(),
      };
      storage.writePage(slug, next);
      return res.status(200).json({ ok: true, data: next });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to save' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
