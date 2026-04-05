import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  // Vercel crons auto-send Authorization: Bearer <CRON_SECRET>
  // Also allow manual test via ?test=1 query param (remove after testing)
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;
  const isTest = req.query.test === '1';

  if (!isTest && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `events:${yesterday.toISOString().slice(0, 10)}`;
    const todayKey = `events:${today}`;

    const dateLabel = yesterday.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });

    // Try yesterday first, fall back to today for testing
    let raw = await redis.zrange(yesterdayKey, 0, -1);
    let label = dateLabel;
    if (!raw || raw.length === 0) {
      raw = await redis.zrange(todayKey, 0, -1);
      label = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
      }) + ' (today so far)';
    }

    if (!raw || raw.length === 0) {
      await resend.emails.send({
        from: 'ldante.com <onboarding@resend.dev>',
        to: 'hello@ldante.com',
        subject: `Portfolio digest — ${label}`,
        html: buildNoActivityEmail(label),
      });
      return res.status(200).json({ ok: true, events: 0 });
    }

    const events = raw.map(r => typeof r === 'string' ? JSON.parse(r) : r);
    const stats = compile(events);

    await resend.emails.send({
      from: 'ldante.com <onboarding@resend.dev>',
      to: 'hello@ldante.com',
      subject: `Portfolio digest — ${label} — ${events.length} events`,
      html: buildEmail(label, stats, events.length),
    });

    return res.status(200).json({ ok: true, events: events.length });
  } catch (err) {
    console.error('Digest error:', err);
    return res.status(500).json({ error: 'Failed to send digest', detail: err.message });
  }
}

function compile(events) {
  const caseViews = {};
  const fitSubmissions = [];
  const chatSessions = {};
  let totalVisitors = new Set();

  for (const e of events) {
    if (e.ip) totalVisitors.add(e.ip);
    switch (e.event) {
      case 'case_view':
        caseViews[e.data?.case || 'unknown'] = (caseViews[e.data?.case || 'unknown'] || 0) + 1;
        break;
      case 'fit_submit':
        fitSubmissions.push({
          jd_preview: (e.data?.jd || '').slice(0, 200),
          score: e.data?.score || '',
          headline: e.data?.headline || '',
          time: new Date(e.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        });
        break;
      case 'chat_message':
        const sid = e.data?.sessionId || 'unknown';
        if (!chatSessions[sid]) chatSessions[sid] = { count: 0, name: e.data?.name || '', firstMsg: '' };
        chatSessions[sid].count++;
        if (chatSessions[sid].count === 1) chatSessions[sid].firstMsg = (e.data?.message || '').slice(0, 120);
        break;
    }
  }

  return {
    uniqueVisitors: totalVisitors.size,
    caseViews,
    fitSubmissions,
    chatSessions: Object.values(chatSessions),
  };
}

function buildEmail(dateLabel, stats, totalEvents) {
  const caseRows = Object.entries(stats.caseViews)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;">${name}</td><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">${count}</td></tr>`)
    .join('');

  const fitRows = stats.fitSubmissions.map(f => `
    <div style="background:#f8f8f7;border-radius:8px;padding:14px 16px;margin-bottom:10px;">
      <div style="font-weight:600;margin-bottom:4px;">${f.headline || 'No headline'}</div>
      <div style="font-size:13px;color:#666;margin-bottom:6px;">${f.time}</div>
      <div style="font-size:13px;color:#444;">${f.jd_preview}${f.jd_preview.length >= 200 ? '...' : ''}</div>
    </div>
  `).join('');

  const chatRows = stats.chatSessions.map(c => `
    <div style="background:#f8f8f7;border-radius:8px;padding:14px 16px;margin-bottom:10px;">
      <div style="font-weight:600;">${c.name || 'Anonymous'}</div>
      <div style="font-size:13px;color:#666;">${c.count} message${c.count !== 1 ? 's' : ''}</div>
      <div style="font-size:13px;color:#444;margin-top:4px;">First: "${c.firstMsg}${c.firstMsg.length >= 120 ? '...' : ''}"</div>
    </div>
  `).join('');

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;color:#1f1f1f;">
      <div style="padding:32px 0 16px;">
        <h1 style="font-size:22px;font-weight:600;margin:0 0 4px;">ldante.com</h1>
        <p style="color:#888;font-size:14px;margin:0;">${dateLabel} — ${totalEvents} event${totalEvents !== 1 ? 's' : ''}</p>
      </div>
      <div style="display:flex;gap:12px;margin-bottom:24px;">
        <div style="background:#f8f8f7;border-radius:8px;padding:16px 20px;flex:1;">
          <div style="font-size:28px;font-weight:600;">${stats.uniqueVisitors}</div>
          <div style="font-size:12px;color:#888;margin-top:2px;">Unique visitors</div>
        </div>
        <div style="background:#f8f8f7;border-radius:8px;padding:16px 20px;flex:1;">
          <div style="font-size:28px;font-weight:600;">${stats.fitSubmissions.length}</div>
          <div style="font-size:12px;color:#888;margin-top:2px;">Fit evaluations</div>
        </div>
        <div style="background:#f8f8f7;border-radius:8px;padding:16px 20px;flex:1;">
          <div style="font-size:28px;font-weight:600;">${stats.chatSessions.length}</div>
          <div style="font-size:12px;color:#888;margin-top:2px;">Chat sessions</div>
        </div>
      </div>
      ${Object.keys(stats.caseViews).length > 0 ? `
        <h2 style="font-size:16px;font-weight:600;margin:24px 0 8px;">Case study views</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">${caseRows}</table>
      ` : ''}
      ${stats.fitSubmissions.length > 0 ? `
        <h2 style="font-size:16px;font-weight:600;margin:24px 0 8px;">Fit evaluations</h2>
        ${fitRows}
      ` : ''}
      ${stats.chatSessions.length > 0 ? `
        <h2 style="font-size:16px;font-weight:600;margin:24px 0 8px;">Chat sessions</h2>
        ${chatRows}
      ` : ''}
      <p style="font-size:12px;color:#bbb;margin-top:32px;padding-top:16px;border-top:1px solid #f0f0f0;">Sent automatically from ldante.com</p>
    </div>
  `;
}

function buildNoActivityEmail(dateLabel) {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;color:#1f1f1f;">
      <div style="padding:32px 0 16px;">
        <h1 style="font-size:22px;font-weight:600;margin:0 0 4px;">ldante.com</h1>
        <p style="color:#888;font-size:14px;margin:0;">${dateLabel}</p>
      </div>
      <p style="font-size:15px;color:#666;">No activity yesterday. Quiet day.</p>
      <p style="font-size:12px;color:#bbb;margin-top:32px;padding-top:16px;border-top:1px solid #f0f0f0;">Sent automatically from ldante.com</p>
    </div>
  `;
}
