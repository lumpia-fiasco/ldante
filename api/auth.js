export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  if (!password) return res.status(401).json({ ok: false });

  // Custom password → experience map via env vars (Vercel dashboard).
  // Falls back to legacy SITE_PASSWORD so existing sessions keep working.
  const map = {
    [process.env.PW_STANDARD || process.env.SITE_PASSWORD]: 'standard',
    [process.env.PW_FIVE9]:     'five9',
    [process.env.PW_VYEHEALTH]: 'vyehealth',
  };

  const experience = map[password];
  if (experience) {
    return res.status(200).json({ ok: true, experience });
  }

  // The experience slug itself also works as a case-insensitive password.
  const SLUG_PASSWORDS = ['five9', 'vyehealth'];
  const slugMatch = SLUG_PASSWORDS.find(s => s === password.toLowerCase().trim());
  if (slugMatch) {
    return res.status(200).json({ ok: true, experience: slugMatch });
  }

  return res.status(401).json({ ok: false });
}
