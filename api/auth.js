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
    [process.env.PW_LATTICE]:      'lattice',
    [process.env.PW_RIPPLING]:     'rippling',
    [process.env.PW_FIVE9]:        'five9',
    [process.env.PW_TWITCH]:       'twitch',
    [process.env.PW_CIRCLE]:       'circle',
    [process.env.PW_CREATEMUSIC]:  'createmusic',
    [process.env.PW_CITRIX]:       'citrix',
    [process.env.PW_ETHYCA]:       'ethyca',
    [process.env.PW_UCLA]:         'ucla',
    [process.env.PW_ROLAND]:       'roland',
    [process.env.PW_1PASSWORD]:    '1password',
    [process.env.PW_TACOBELL]:     'tacobell',
  };

  const experience = map[password];
  if (experience) {
    return res.status(200).json({ ok: true, experience });
  }

  // The experience slug itself also works as a case-insensitive password.
  // "LATTICE", "Lattice", and "lattice" all route to the Lattice experience.
  // "createmusic" routes to the Create Music Group experience, etc.
  const SLUG_PASSWORDS = [
    'lattice', 'rippling', 'five9', 'twitch', 'circle',
    'createmusic', 'citrix', 'ethyca', 'ucla', 'roland', '1password', 'tacobell',
  ];
  const slugMatch = SLUG_PASSWORDS.find(s => s === password.toLowerCase().trim());
  if (slugMatch) {
    return res.status(200).json({ ok: true, experience: slugMatch });
  }

  return res.status(401).json({ ok: false });
}
