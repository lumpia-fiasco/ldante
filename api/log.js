import { createClient } from 'redis';

let client;
async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on('error', err => console.error('Redis error:', err));
    await client.connect();
  }
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event, data } = req.body;
    if (!event) return res.status(400).json({ error: 'Missing event' });

    const entry = {
      event,
      data: data || {},
      ts: Date.now(),
      date: new Date().toISOString(),
      ua: req.headers['user-agent'] || '',
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
    };

    const r = await getClient();
    const dayKey = `events:${new Date().toISOString().slice(0, 10)}`;
    await r.zAdd(dayKey, { score: entry.ts, value: JSON.stringify(entry) });
    await r.expire(dayKey, 90 * 24 * 60 * 60);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Log error:', err);
    return res.status(500).json({ error: 'Failed to log event', detail: err.message });
  }
}
