import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { uploadImageFromBase64 } from '../../lib/supabase';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { filename = `img-${Date.now()}.png`, data } = req.body;
    if (!data) return res.status(400).json({ error: 'No data' });
    const url = await uploadImageFromBase64(filename, data);
    return res.status(200).json({ ok: true, url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
