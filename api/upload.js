import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const type = req.headers['content-type'] || '';
  if (!type.startsWith('image/')) {
    return res.status(400).json({ error: '只能上傳圖片' });
  }

  const raw = String(req.query.filename || 'photo.jpg');
  const safe = raw.replace(/[^\w\u4e00-\u9fff.\- ]/g, '').slice(0, 60) || 'photo.jpg';

  try {
    const blob = await put(`memories/${Date.now()}-${safe}`, req, {
      access: 'public',
      contentType: type,
    });
    res.status(200).json({ url: blob.url, name: blob.pathname });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}