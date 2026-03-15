export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  const correct = process.env.SITE_PASSWORD;

  if (!correct) {
    // Env var not set — fail closed
    return res.status(500).json({ error: 'Auth not configured' });
  }

  if (password === correct) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ ok: false });
}
