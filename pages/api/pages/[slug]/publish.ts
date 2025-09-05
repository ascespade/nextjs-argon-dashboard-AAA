import { NextApiRequest, NextApiResponse } from 'next';
import { readPage, publishPage } from '../../../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query as { slug: string };
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });
  try {
    const existing = (await readPage(slug)) || {};
    const draft = existing;
    const published = await publishPage(slug);
    return res.status(200).json({ ok: true, data: published });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to publish' });
  }
}
