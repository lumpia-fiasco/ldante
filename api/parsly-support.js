import { Resend } from 'resend';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, topic, message, company } = req.body || {};

  // Honeypot — bots fill hidden fields, real users never see this one.
  if (company) {
    return res.status(200).json({ ok: true });
  }

  if (!email || !message || !String(message).trim()) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Parsly Support <onboarding@resend.dev>',
      to: 'hello@ldante.com',
      replyTo: email,
      subject: `Parsly support — ${topic || 'General'} — ${name || email}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; font-size: 14px; color: #2A2926;">
          <p><strong>Name:</strong> ${escapeHtml(name || '(not provided)')}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Topic:</strong> ${escapeHtml(topic || 'General')}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Parsly support error:', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
