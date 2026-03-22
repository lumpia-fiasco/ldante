export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  if (!password) return res.status(401).json({ ok: false });

  // Each env var maps a password to an experience token.
  // Set these in Vercel dashboard → Settings → Environment Variables.
  const map = {
    [process.env.PW_STANDARD]:       'standard',
    [process.env.PW_DESIGN_SYSTEM]:  'designsystem',
    [process.env.PW_CREATIVE]:       'creative',
    [process.env.PW_MOBILE]:         'mobile',
  };

  const experience = map[password];

  if (experience) {
    return res.status(200).json({ ok: true, experience });
  }

  return res.status(401).json({ ok: false });
}
