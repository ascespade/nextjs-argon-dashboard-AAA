import { NextApiRequest, NextApiResponse } from 'next';
import { readPage, writePage } from '../../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query as { slug: string };

  if (req.method === 'GET') {
    try {
      const page = await readPage(slug === 'home' ? 'home' : slug);
      if (!page) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ data: page });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to read page' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      const existing = (await readPage(slug)) || {};
      const next = {
        ...(existing || {}),
        ...body,
        slug,
        updated_at: new Date().toISOString(),
      };
      await writePage(slug, next);
      return res.status(200).json({ ok: true, data: next });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to save' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
