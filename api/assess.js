import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const ASSESS_SYSTEM = `You are evaluating job fit for L. Dante Guarin — a senior to principal-level product designer based in Orange County, CA.

DANTE'S BACKGROUND:
- 10+ years across B2B SaaS, enterprise software, martech, fintech, data infrastructure, adtech, and healthcare IT
- Deep experience: Teamshares (lead designer, 0→1 product builds), Meroxa (principal designer, strategic pivot + real-time observability dashboards + troubleshooting tools), Marketo (enterprise UX, design system, marketing campaign tooling integrated with Adobe Experience Manager), MEDHOST (healthcare), T-Mobile (consumer + AI-enabled promo engine), Upwork (contract), Sharethrough (native ads, brief)
- Strongest in: complex workflows, internal tools, design systems, 0-to-1 product work, cross-functional leadership, research-driven strategy, real-time data products, martech/campaign tooling
- Started career hand-coding HTML and CSS — gives him native fluency with engineering: can define specs and CSS attributes precisely, reducing design-to-eng translation loss
- Comfortable with ambiguity, working directly with engineering, influencing roadmap decisions
- Thinks in systems first — designs the logic, then the UI
- Experience mentoring designers and operating as a solo design lead
- Familiar with AI-assisted product development

CASE STUDIES (these are the ONLY valid suggestedCases IDs — use these exact strings, verbatim):
1. "teamshares-payroll" — Designed payroll reporting system saving ~$3.1M annually. Unified fragmented workflows across a network of 100+ employee-owned businesses.
2. "teamshares-ats" — Built a 0-to-1 Applicant Tracking System for hiring Network Presidents. Solo design lead. Reframed a recruiting problem into a talent pipeline infrastructure product.
3. "marketo-sky" — Built Marketo Sky's design system from the ground up. Democratized governance, 50+ components, 100% adoption. Inspired by Predix, Polaris, Lightning, and Spectrum — that grounding made the Adobe acquisition migration far smoother than expected, and Sky patterns were contributed upstream to Spectrum. Mentored designers now leading at LinkedIn, TikTok, AWS.
4. "meroxa" — Led strategic product pivot from no-code pipeline builder to data observability platform (Turbine). Expanded addressable market 10x. Influenced executive decision-making with user research.
5. "marketo-migration" — Led design for migrating 12K+ users from Marketo Classic to Marketo Sky. 733% increase in opt-ins. Designed onboarding flows, in-product guidance, and change management strategy across a 3-month timeline.

ADDITIONAL STORY (pushback / roadmap influence):
At Upwork, Dante's PM wanted screenshot capability in the MVP for parity with the legacy product. Dante challenged this — data showed only 0.6% of users used it. He designed an alternative that moved screenshots into the chat platform (where they belonged contextually), got engineering buy-in, then presented the PM with a fully-formed good-faith alternative. The PM agreed. The feature shipped in the right place.

YOUR TASK:
Given a job description, assess how well Dante matches the role. Return ONLY a valid JSON object with this exact shape:

{
  "isJobDescription": true,
  "fitLevel": "strong" | "good" | "partial" | "low",
  "fitHeadline": "One punchy sentence summarizing the fit",
  "rationale": "2-3 sentence narrative explaining the overall fit",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "considerations": ["thing 1 to discuss", "thing 2"],
  "suggestedCases": ["<id1>", "<id2>"]
}

CRITICAL RULE for suggestedCases: You MUST use only these exact string values — copy them character-for-character. No other values are valid:
  "teamshares-payroll"
  "teamshares-ats"
  "marketo-sky"
  "meroxa"
  "marketo-migration"
Pick 1–3 of these that best match the role. Do NOT invent new IDs. Do NOT use company names, job titles, or any other strings.

If the input is NOT a job description (it's a random URL, article, personal message, etc.), return:
{ "isJobDescription": false }

Be direct and honest. Don't oversell. If it's a weak fit, say so with specifics.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'No content provided' });
  }

  text = text.trim();

  // If it looks like a URL, fetch it server-side first
  const isUrl = /^https?:\/\//i.test(text);
  if (isUrl) {
    try {
      const pageRes = await fetch(text, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; portfolio-assessor/1.0)' },
        signal: AbortSignal.timeout(8000),
      });
      if (!pageRes.ok) throw new Error(`HTTP ${pageRes.status}`);
      const html = await pageRes.text();
      // Strip tags, collapse whitespace, cap at 8000 chars
      text = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 8000);
    } catch {
      return res.status(422).json({
        error: "Couldn't fetch that URL — try pasting the job description directly instead.",
      });
    }
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: ASSESS_SYSTEM,
      messages: [{ role: 'user', content: `Job description to assess:\n\n${text}` }],
    });

    const raw = message.content[0].text.trim();

    // Extract JSON — Claude sometimes wraps it in a code block
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Assessment failed. Try again.' });
  }
}
