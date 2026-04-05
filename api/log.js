import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return res.status(500).json({ error: 'Missing Redis config' });
    }

    const redis = new Redis({ url, token });

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

    const dayKey = `events:${new Date().toISOString().slice(0, 10)}`;
    await redis.zadd(dayKey, { score: entry.ts, member: JSON.stringify(entry) });
    await redis.expire(dayKey, 90 * 24 * 60 * 60);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Log error:', err);
    return res.status(500).json({ error: 'Failed to log event', detail: err.message });
  }
}
