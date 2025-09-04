import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      res.status(405).end('Method Not Allowed');
      return;
    }
    const { dataUrl, filename } = req.body || {};
    if (!dataUrl || !/^data:image\//.test(dataUrl)) {
      res.status(400).json({ ok: false, error: 'Invalid image data' });
      return;
    }
    const base64 = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const safeName = (filename || `img-${Date.now()}.png`).replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);
    res.status(200).json({ ok: true, url: `/uploads/${safeName}` });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
