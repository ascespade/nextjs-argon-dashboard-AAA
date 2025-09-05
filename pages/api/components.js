import { getComponentsLibrary } from '../../lib/db';

export default function handler(req, res) {
  try {
    const components = getComponentsLibrary();
    res.status(200).json({ ok: true, components });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
