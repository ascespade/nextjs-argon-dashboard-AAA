import { NextApiRequest, NextApiResponse } from 'next';
import storage from '../../../../../lib/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query as { slug: string };
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = req.body;
    const existing = storage.readPage(slug) || {};
    const next = {
      ...(existing || {}),
      components_json: body.components_json || existing.components_json || [],
      status: 'draft',
      version: (existing.version || 0) + 0,
      updated_by: body.updated_by || 'unknown',
      updated_at: new Date().toISOString(),
    };
    storage.writePage(slug, next);
    return res.status(200).json({ ok: true, data: next });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to save' });
  }
}
