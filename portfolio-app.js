/* ═══════════════════════════════════════════════════════════════
   LDante Portfolio -- App Logic
   Handles: gate, landing, masonry, case studies, chat, fit, context menu
═══════════════════════════════════════════════════════════════ */

'use strict';

// ── Tailored landing config ────────────────────────────────────
const TAILORED = {
  lattice: {
    greeting: "Hello, Lattice team.",
    body: "I'm Dante. I'm a Product Designer with over a decade building the tools people use to do their best work. Lattice sits exactly at the intersection I love -- complex systems, real human needs, and the org-level trust that makes or breaks both.",
  },
  netflix: {
    greeting: "Hello, Netflix team.",
    body: "I'm Dante. A decade shipping complex products across ambiguous domains. I hold the product together when the rules haven't been written yet -- and I thrive where the problem space is still being defined.",
  },
  rippling: {
    greeting: "Hello, Rippling team.",
    body: "I'm Dante. I've spent my career at the seam between HR, finance, and the infrastructure underneath them. Rippling is building exactly the unified layer that I've seen teams struggle to assemble from parts -- and I want to help design it.",
  },
  five9: {
    greeting: "Hello, Five9 team.",
    body: "I'm Dante. I've spent years building complex, data-rich applications for power users. Design systems, multi-persona platforms, and the craft details that compound over an eight-hour shift.",
  },
  twitch: {
    greeting: "Hello, Twitch team.",
    body: "I'm Dante. I've designed for dual-persona platforms -- products that only work when both sides feel served. That tension is familiar to me. Creators need tools that get out of the way; viewers need immersion. Both truths have to coexist.",
  },
  circle: {
    greeting: "Hello, Circle team.",
    body: "I'm Dante. Trust is the hardest thing to design for. I've worked on payroll, hiring infrastructure, and data pipelines -- all places where a single confusing moment can cost someone money, a job, or credibility. That's the design problem Circle lives in.",
  },
  rivian: {
    greeting: "Hello, Rivian team.",
    body: "I'm Dante. I believe the moment a brand story becomes a transaction is one of the most fragile in product design. I've designed for B2B buyers, individual creators, and small business owners -- and the best commerce flows I've seen treat the story and the checkout as one thing.",
  },
};

const GENERAL_GREETING = "So glad you made it.";
const GENERAL_BODY = "I'm Dante. I'm a Product Designer with over a decade of experience specializing in B2B/SaaS and devops tools. If we drew a Venn diagram of complex systems, and real user needs -- I operate where the two overlap.";

// ── Screen manager ─────────────────────────────────────────────
let currentScreen = 'gate';

function showScreen(id, direction = 'up') {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => {
    if (s.id === id) {
      s.classList.remove('enter-up', 'exit-up', 'exit-down');
      s.classList.add('active');
    } else if (s.classList.contains('active')) {
      s.classList.remove('active');
      s.classList.add(direction === 'up' ? 'exit-up' : 'exit-down');
      setTimeout(() => s.classList.remove('exit-up', 'exit-down'), 600);
    }
  });
  currentScreen = id;
  // Persist current screen
  try { localStorage.setItem('ldg-screen', id); } catch(e) {}
}

// ── Gate logic ─────────────────────────────────────────────────
function setupGate() {
  const input    = document.getElementById('gatePwInput');
  const btn      = document.getElementById('gateGoBtn');
  const row      = document.getElementById('gateInputRow');
  const errEl    = document.getElementById('gateError');
  const resetBtn = document.getElementById('resetBtn');

  function showShake() {
    row.classList.remove('shake');
    void row.offsetWidth;
    row.classList.add('shake');
    errEl.classList.add('visible');
    input.value = '';
    setTimeout(() => errEl.classList.remove('visible'), 2500);
  }

  function advanceToLanding(experience) {
    input.blur();
    try {
      localStorage.setItem('ldg-auth', '1');
      localStorage.setItem('ldg-experience', experience || 'standard');
    } catch(e) {}
    // Pass experience as ?ref= so setupLanding picks up the tailored config
    const url = new URL(window.location.href);
    if (experience && experience !== 'standard') {
      url.searchParams.set('ref', experience);
    } else {
      url.searchParams.delete('ref');
    }
    window.history.replaceState({}, '', url);
    showScreen('screenLanding');
    setupLanding();
  }

  async function tryUnlock(password) {
    const val = (password || input.value).trim();
    if (!val) return;
    btn.disabled = true;
    try {
      const res  = await fetch('/api/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password: val }),
      });
      const data = await res.json();
      if (data.ok) {
        advanceToLanding(data.experience);
      } else {
        showShake();
      }
    } catch {
      showShake();
    } finally {
      btn.disabled = false;
    }
  }

  btn.addEventListener('click', () => tryUnlock());
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });

  // Auto-unlock from ?p= URL param (direct share links)
  const urlPw = new URLSearchParams(window.location.search).get('p');
  if (urlPw) {
    window.history.replaceState({}, '', window.location.pathname);
    tryUnlock(urlPw);
  }

  // Float letters on gate hero
  setupGateFloat(resetBtn);
}

// ── Floating letter sandbox ─────────────────────────────────────
function setupGateFloat(resetBtn) {
  const hero = document.getElementById('gateHero');
  if (!hero) return;

  // Split into float-letter spans
  function splitText(el) {
    const words = el.textContent.split(' ');
    el.textContent = '';
    words.forEach((word, wi) => {
      const wrap = document.createElement('span');
      wrap.className = 'float-word';
      for (const ch of word) {
        const s = document.createElement('span');
        s.className = 'float-letter';
        s.textContent = ch;
        wrap.appendChild(s);
      }
      el.appendChild(wrap);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  splitText(hero);

  const FLOAT = [];
  document.querySelectorAll('#gateHero .float-letter').forEach((el, i) => {
    FLOAT.push({ el, radius: 130, boost: 1.0, rotSign: (i % 2) ? 1 : -1, ox: 0, oy: 0, cx: 0, cy: 0 });
  });

  let cached = false;
  function cachePositions() {
    FLOAT.forEach(item => {
      const prev = item.el.style.transform;
      item.el.style.transform = 'none';
      const r = item.el.getBoundingClientRect();
      item.cx = r.left + r.width / 2;
      item.cy = r.top  + r.height / 2;
      item.el.style.transform = prev;
    });
    cached = true;
  }
  setTimeout(cachePositions, 100);
  window.addEventListener('resize', () => { cached = false; setTimeout(cachePositions, 80); });

  function rotFor(item) {
    if (!item.rotSign) return 0;
    const d = Math.sqrt(item.ox * item.ox + item.oy * item.oy);
    return Math.min(d * 0.28, 52) * item.rotSign;
  }
  function applyTransform(item) {
    item.el.style.transform = `translate(${item.ox.toFixed(1)}px,${item.oy.toFixed(1)}px) rotate(${rotFor(item).toFixed(1)}deg)`;
  }

  let mouseX = -9999, mouseY = -9999, prevX = -9999, prevY = -9999;
  let resetActive = false;
  let hasScattered = false;

  function pushFromPoint(px, py, cx, cy) {
    if (px < -9000) return;
    const dmx = cx - px, dmy = cy - py;
    if (!cached) cachePositions();
    for (const item of FLOAT) {
      const dx = cx - (item.cx + item.ox);
      const dy = cy - (item.cy + item.oy);
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist >= item.radius) continue;
      const t = Math.pow((item.radius - dist) / item.radius, 1.3);
      const drag  = Math.min(t * 0.92, 0.78);
      const nudge = t * 0.2;
      const nx = dist > 1 ? dx/dist : 0;
      const ny = dist > 1 ? dy/dist : 0;
      item.ox += dmx * drag + nx * nudge;
      item.oy += dmy * drag + ny * nudge;
      applyTransform(item);
    }
  }

  document.getElementById('screenGate').addEventListener('mousemove', e => {
    if (resetActive) return;
    pushFromPoint(prevX, prevY, e.clientX, e.clientY);
    prevX = e.clientX; prevY = e.clientY;
    const scattered = FLOAT.some(i => i.ox !== 0 || i.oy !== 0);
    if (scattered !== hasScattered) {
      hasScattered = scattered;
      resetBtn.classList.toggle('visible', scattered);
    }
  });

  // Touch support
  let lastTouch = null;
  document.getElementById('screenGate').addEventListener('touchmove', e => {
    if (resetActive) return;
    const t = e.touches[0];
    const px = lastTouch ? lastTouch.clientX : -9999;
    const py = lastTouch ? lastTouch.clientY : -9999;
    pushFromPoint(px, py, t.clientX, t.clientY);
    lastTouch = { clientX: t.clientX, clientY: t.clientY };
  }, { passive: true });
  document.getElementById('screenGate').addEventListener('touchend', () => { lastTouch = null; });

  // Elastic reset
  function easeOutElastic(t) {
    if (t <= 0) return 0; if (t >= 1) return 1;
    const p = 0.42;
    return Math.pow(2, -10*t) * Math.sin((t - p/4) * (2*Math.PI) / p) + 1;
  }
  resetBtn.addEventListener('click', () => {
    const targets = FLOAT.filter(i => i.ox !== 0 || i.oy !== 0);
    if (!targets.length || resetActive) return;
    targets.forEach(i => { i._rsOx = i.ox; i._rsOy = i.oy; });
    resetActive = true;
    const DUR = 1100, t0 = performance.now();
    function tick(now) {
      const t = Math.min((now - t0) / DUR, 1);
      const e = easeOutElastic(t);
      for (const it of targets) { it.ox = it._rsOx*(1-e); it.oy = it._rsOy*(1-e); applyTransform(it); }
      if (t < 1) { requestAnimationFrame(tick); }
      else {
        for (const it of targets) { it.ox = 0; it.oy = 0; delete it._rsOx; delete it._rsOy; applyTransform(it); }
        resetActive = false; hasScattered = false; resetBtn.classList.remove('visible');
      }
    }
    requestAnimationFrame(tick);
  });
}

// ── Landing (role picker) ───────────────────────────────────────
function setupLanding() {
  // Determine if tailored
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref') || params.get('company') || '';
  const tailored = TAILORED[ref.toLowerCase()];

  const greeting = document.getElementById('landingGreeting');
  const bodyText = document.getElementById('landingBodyText');
  const btns     = document.getElementById('landingBtns');
  const blocks   = document.querySelectorAll('.landing-text-block');

  greeting.textContent = tailored ? tailored.greeting : GENERAL_GREETING;
  bodyText.textContent = tailored ? tailored.body : GENERAL_BODY;

  // Stagger in
  blocks.forEach((b, i) => {
    b.style.transitionDelay = `${0.05 + i * 0.12}s`;
    setTimeout(() => b.classList.add('visible'), 80 + i * 120);
  });
  setTimeout(() => btns.classList.add('visible'), 500);

  // Role selection
  btns.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      try { localStorage.setItem('ldg-role', role); } catch(e) {}
      showScreen('screenPortfolio');
      setupPortfolio(role);
    });
  });
}

// ── Portfolio ───────────────────────────────────────────────────
let portfolioReady = false;

function setupPortfolio(role) {
  if (portfolioReady) return;
  portfolioReady = true;

  // ── Recruiter: full-width, no chat rail ──
  if (role === 'recruiter') {
    const chatRail = document.getElementById('chatRail');
    if (chatRail) chatRail.style.display = 'none';
    document.getElementById('recruiterPanel').classList.add('active');
    // Wire recruiter panel events
    setupRecruiterPanel();
  }

  // Masonry layout
  layoutMasonry();
  window.addEventListener('resize', () => {
    clearTimeout(window._masonryTimer);
    window._masonryTimer = setTimeout(layoutMasonry, 120);
  });

  // Lazy images
  setupLazyImages();

  // Case click handlers
  document.querySelectorAll('[data-case]').forEach(el => {
    el.addEventListener('click', () => openCase(el.dataset.case));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openCase(el.dataset.case); });
  });
  document.querySelectorAll('[data-thought]').forEach(el => {
    el.addEventListener('click', () => openThought(el.dataset.thought));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openThought(el.dataset.thought); });
  });

  // Back buttons
  document.getElementById('caseBackBtn').addEventListener('click', () => closeDetail());
  document.getElementById('fitBackBtn').addEventListener('click', () => closeDetail());

  // Fit button in case detail (delegated)
  document.getElementById('caseDetailContent').addEventListener('click', e => {
    if (e.target.closest('.fit-btn')) openFitPanel();
  });

  // Chat rail
  setupChatRail(role);

  // Fit panels
  setupFitPanel();

  // Context menu
  setupContextMenu();

  // Show recruiter view if role === recruiter — now handled above via setupRecruiterPanel()
  // (no-op kept for safety)

  // Mobile tabs
  document.querySelectorAll('.mob-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.mob-tab').forEach(t => t.classList.remove('mob-tab--active'));
      tab.classList.add('mob-tab--active');
      const t = tab.dataset.tab;
      document.getElementById('chatRail').classList.toggle('mob-active', t === 'chat');
      if (t === 'fit') openFitPanel();
    });
  });

  // Toast hint
  setTimeout(() => {
    const toast = document.getElementById('ctxToast');
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 5000);
  }, 3000);
}

// ── Masonry layout ──────────────────────────────────────────────
function layoutMasonry() {
  const stack = document.getElementById('caseStack');
  if (!stack) return;
  const items = Array.from(stack.querySelectorAll('.case-item:not([style*="display: none"])'));
  const GAP = 16;
  const containerW = stack.offsetWidth;
  const isMobile = window.innerWidth < 640;
  const COL_COUNT = isMobile ? 1 : (containerW > 900 ? 3 : 2);
  const colW = (containerW - GAP * (COL_COUNT - 1)) / COL_COUNT;
  const colHeights = Array(COL_COUNT).fill(0);

  // Assign random tilt to case cards (once)
  items.forEach(item => {
    const card = item.querySelector('.case-card-v');
    if (card && !card.dataset.tiltSet) {
      const tilt = (Math.random() * 2 - 1).toFixed(2) + 'deg';
      card.style.setProperty('--tilt', tilt);
      card.dataset.tiltSet = '1';
    }
  });

  items.forEach((item, i) => {
    item.style.width = colW + 'px';
    // Find shortest column
    const minH = Math.min(...colHeights);
    const col = colHeights.indexOf(minH);
    item.style.left = (col * (colW + GAP)) + 'px';
    item.style.top  = colHeights[col] + 'px';
    item.style.opacity = '1';
    colHeights[col] += item.offsetHeight + GAP;
  });
  stack.style.height = Math.max(...colHeights) + 'px';
}

// ── Lazy images ──────────────────────────────────────────────────
function setupLazyImages() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const img = e.target.tagName === 'IMG' ? e.target : e.target.querySelector('img[data-lazy-src]');
      if (!img || !img.dataset.lazySrc) return;
      const src = img.dataset.lazySrc;
      img.src = src;
      img.addEventListener('load', () => {
        delete img.dataset.lazySrc;
        const host = img.closest('.lazy-host');
        if (host) host.classList.add('lazy-loaded');
        layoutMasonry();
      }, { once: true });
    });
  }, { rootMargin: '400px' });

  document.querySelectorAll('img[data-lazy-src]').forEach(img => obs.observe(img));
}

// ── Panel helpers ────────────────────────────────────────────────
function closeDetail() {
  document.getElementById('caseDetailPanel').classList.remove('active');
  document.getElementById('fitPanel').classList.remove('active');
  document.getElementById('caseListPanel').classList.remove('hidden');
  // Reset scroll
  document.getElementById('caseListPanel').scrollTop = 0;
}

function openFitPanel() {
  document.getElementById('caseListPanel').classList.add('hidden');
  document.getElementById('caseDetailPanel').classList.remove('active');
  document.getElementById('fitPanel').classList.add('active');
  document.getElementById('fitPanel').scrollTop = 0;
}

// ── Case studies ────────────────────────────────────────────────
const CASES = {
  'teamshares-payroll': {
    company: 'Teamshares',
    title: 'Payroll reporting',
    chips: ['B2B SaaS','Product Design','System Design','Research'],
    metrics: [
      { val: '~$3.1M', label: 'Saved annually' },
      { val: '90+', label: 'Portfolio companies' },
      { val: '0', label: 'Headcount added' },
    ],
    intro: `Teamshares acquires small businesses and transitions them toward employee ownership. Each acquisition runs its own payroll -- but the reporting tools to manage that across the portfolio didn\'t exist. We had to design them.`,
    sections: [
      {
        h2: 'The problem',
        body: `Each of Teamshares\'s 90+ portfolio companies ran payroll in isolation. There was no way to roll it up, compare it, or spot issues before they became crises. The cost of that blind spot was measured in hours of manual reconciliation and, in some cases, errors that reached employees.`,
        img: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/teamshares-payroll-home.png',
        imgCaption: 'Home state of the new payroll reporting dashboard',
      },
      {
        h2: 'The design challenge',
        body: `We weren\'t building a payroll tool -- we were building the layer above payroll that made 90 different payroll tools legible. That reframe shaped every decision: what to surface, what to suppress, and where to push users toward action.`,
        screenshots: [
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/teamshares-payroll-home.png', caption: 'Dashboard overview' },
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/teamshares-integration.png', caption: 'Integration state' },
        ],
      },
      {
        h2: 'The outcome',
        body: `The reporting layer became the single source of truth for Teamshares\'s finance team. It eliminated the majority of the manual reconciliation work -- work that was estimated at $3.1M/year in labor cost -- without adding or removing anyone from the team. The design goal was to make invisible work visible, and measurable.`,
      },
    ],
    haiku: ['Payroll just happens.', 'Ninety quiet engines run.', 'You finally see.'],
  },

  'teamshares-ats': {
    company: 'Teamshares',
    title: 'A hiring engine for a company of companies',
    chips: ['B2B SaaS','Enterprise Design','Research','Systems'],
    metrics: [
      { val: '90+', label: 'Companies served' },
      { val: '1', label: 'Unified pipeline' },
      { val: '↑40%', label: 'Time-to-fill reduction' },
    ],
    intro: "Every Teamshares portfolio company hires independently -- without a shared view of the talent pool, without cross-company pipeline visibility, and without a way to standardize what 'a good hire' even means across industries. That was the problem.",
    sections: [
      {
        h2: 'From tool to infrastructure',
        reframe: {
          from: 'A recruiting app for individual companies to post jobs and track candidates.',
          to: 'A talent pipeline layer that surfaces signal across an entire portfolio.',
        },
      },
      {
        h2: 'What we built',
        body: `A unified ATS that treated each portfolio company as a node in a larger network. Hiring managers could see only their company\'s activity; Teamshares ops could see the full picture. The same underlying data served both views without overwhelming either.`,
        screenshots: [
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/teamshares ats.png', caption: 'Candidate pipeline' },
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/ats-candidate-detail.png', caption: 'Candidate detail' },
        ],
      },
      {
        h2: 'The details that mattered',
        body: "Scoring and bulk edits were the two biggest time drains for recruiters. We rebuilt both. The new scoring model made 'this person is worth a second look' a one-click action. Bulk edits turned a 20-minute status update into a 90-second one.",
        screenshots: [
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/ats-scoring.png', caption: 'Scoring interface' },
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/ats-bulk-edits.png', caption: 'Bulk edit flow' },
        ],
      },
    ],
    haiku: ['Ninety doors to jobs.', 'Same face walks through each of them.', 'Finally, a map.'],
  },

  'marketo-sky': {
    company: 'Marketo / Adobe',
    title: 'The design system that survived an acquisition',
    chips: ['Design Systems','Component Library','Adobe Spectrum','Scale'],
    metrics: [
      { val: 'Sky', label: 'Design system shipped' },
      { val: '→', label: 'Contributed to Spectrum' },
      { val: '100+', label: 'Components built' },
    ],
    intro: 'When Adobe acquired Marketo, we had a choice: wait for Spectrum to absorb us, or build something that could stand on its own and influence what came next. We chose the latter. Sky became the design language that gave Marketo Engage its coherence -- and sent patterns upstream into Adobe Spectrum.',
    sections: [
      {
        h2: 'The constraints',
        body: 'We were designing for a 15-year-old B2B product used by marketing operations teams who spent 8+ hours a day inside it. The system had to be accessible, dense, and calm. It could not be loud or aggressive. It needed to shrink out of the way of the work.',
        img: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/sky-brandcolor.jpeg',
        imgCaption: 'Sky brand color exploration',
      },
      {
        h2: 'Color and density',
        body: 'The Sky color system was built around a single principle: information density should not create cognitive noise. We derived a semantic palette from a restricted primitives set, and then validated every combination against WCAG AA at the data-table density our users required.',
        screenshots: [
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/sky-colorpalette.jpeg', caption: 'Color palette' },
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/sky-primitivecolor.jpeg', caption: 'Primitive tokens' },
        ],
      },
      {
        h2: 'Data visualization',
        body: 'Marketo Engage runs reporting at its core. The data visualization component set was one of the most complex parts of Sky -- charts, trend lines, comparison views -- all needing to read cleanly at multiple sizes inside a product where space was already at a premium.',
        screenshots: [
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/sky-dataviz.jpeg', caption: 'Data viz -- bar' },
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/sky-dataviz2.jpeg', caption: 'Data viz -- line' },
        ],
      },
    ],
    haiku: ['Colors not chosen.', 'Each one earned a second look.', 'The system holds still.'],
  },

  'marketo-migration': {
    company: 'Marketo / Adobe',
    title: '733% adoption increase through trust-first migration',
    chips: ['UX Strategy','Change Management','B2B SaaS','Research'],
    metrics: [
      { val: '733%', label: 'Adoption increase' },
      { val: 'Trust', label: 'First design principle' },
      { val: '↓62%', label: 'Support tickets' },
    ],
    intro: 'Users were resistant. That was the finding. Not confused, not blocked -- resistant. They had learned to work around the old interface, and they had no reason to trust a new one. That was the real design problem: not migration, but trust.',
    sections: [
      {
        h2: 'What the research found',
        body: `Every usability session we ran early in the Sky rollout surfaced the same pattern: users would encounter the new UI, recognize it was different, and immediately look for the old path. They weren\'t struggling -- they were avoiding. The product had to earn its way in.`,
        reframe: {
          from: 'Ship the new interface and let users adapt.',
          to: 'Design the migration itself as a product experience.',
        },
      },
      {
        h2: 'The migration design',
        body: 'We built a parallel-path system: users could opt in to the new experience on a feature-by-feature basis, with a clear path back if they needed it. Each new feature surfaced its value before asking for commitment. The old UI stayed available as a fallback, not a default.',
        img: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/design-sas.jpg',
        imgCaption: 'Migration flow and opt-in design',
      },
      {
        h2: 'The result',
        body: `Within two quarters, voluntary adoption of the new UI exceeded projections by 733%. Support tickets dropped 62%. The critical insight was that users didn\'t need a better UI -- they needed a reason to trust the one they had.`,
      },
    ],
    haiku: ['Trust is not assumed.', 'Each feature must earn its place.', 'Then: 733%.'],
  },

  'meroxa': {
    company: 'Meroxa',
    title: 'Pivoting from a builder to a data observability platform',
    chips: ['Developer Tools','Data Platform','Discovery Research','Pivot'],
    metrics: [
      { val: 'Pivot', label: 'Research-driven' },
      { val: '↑3x', label: 'Qualified pipeline' },
      { val: 'Series A', label: 'Raised post-pivot' },
    ],
    intro: 'Meroxa was a data pipeline builder. Then we ran research. What we found forced a pivot -- not because the product was wrong, but because the problem it was solving had already been solved elsewhere. The real opportunity was one layer up.',
    sections: [
      {
        h2: 'The discovery',
        body: `In user interviews, we kept hearing the same thing: "I don\'t need help building pipelines. I need to know when they break.' Pipeline observability -- not pipeline construction -- was the pain. Meroxa was building the wrong thing for the right market.`,
        img: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/meroxa-observability.png',
        imgCaption: 'Observability dashboard -- new platform direction',
      },
      {
        h2: 'Reframing the product',
        body: 'The pivot meant rebuilding the core product surface. We moved from a pipeline builder (a graph canvas) to a monitoring and alerting layer that gave data teams signal when something went wrong -- and enough context to fix it fast.',
        screenshots: [
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/meroxa-environments.png', caption: 'Environments view' },
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/meroxa-common-env.png', caption: 'Common environment' },
        ],
      },
      {
        h2: 'The new experience',
        body: `The Turbine apps experience gave developers a code-first entry point that didn\'t require them to leave their mental model. The UI surfaced just enough: status, throughput, error rate, last-seen. The complexity was in the backend. The experience was supposed to feel quiet.`,
        screenshots: [
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/meroxa-turbine-apps.png', caption: 'Turbine apps' },
          { src: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/meroxa-log.png', caption: 'Log view' },
        ],
      },
    ],
    haiku: ['We built the right thing.', 'Research said: look one floor up.', 'There was the problem.'],
  },
};

// ── Thought articles ────────────────────────────────────────────
const THOUGHTS = {
  'charlie-murphys-law': {
    title: `Charlie Murphy's Law`,
    img: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/charlie.jpeg',
    content: `
      <p class="cd-body">Surprises in product design come in a few flavors. There are the ones you bring on yourself by not staying close enough to your PM or Engineering. There are the last-minute asks that appear from nowhere -- a stakeholder's nephew had an idea, a competitor shipped something, a board deck needs a new slide by Thursday.</p>
      <p class="cd-body">And then there's Charlie Murphy's Law.</p>
      <p class="cd-body">Charlie Murphy's Law states: <em>if something can be misunderstood by the user, it will be misunderstood by the user.</em> Not might. Will.</p>
      <p class="cd-body">I've seen it play out in every product I've worked on. A tooltip that's too small. A modal that fires too early. A button label that tests fine in English and means something different in context. The gap between what we meant and what the user experienced is almost always a design gap -- even when it looks like a communication gap or an engineering gap.</p>
      <p class="cd-body">The antidote isn't more user testing, though that helps. It's design humility: the practice of assuming the user didn't read what you wrote, didn't see the indicator you added, didn't follow the flow in the order you imagined. Design for the path of least resistance, not the path of most thought.</p>
    `,
  },
  'culture-power-permits': {
    title: 'Culture lives in what power permits',
    img: 'https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/lumbergh.jpeg',
    content: `
      <p class="cd-body">I used to think culture was set by the people in the room. The tone of a standup. The way a lead gave feedback. But the more places I've worked, the more I believe culture is shaped by what leadership lets people get away with.</p>
      <p class="cd-body">Not what the handbook says. Not the all-hands slides. What actually happens when someone cuts a corner. What actually happens when a team ships without QA. What actually happens when a designer raises a concern that slows things down.</p>
      <p class="cd-body">Culture is the residue of consequences. Or the absence of them.</p>
      <p class="cd-body">The healthiest teams I've been on weren't the ones with the best stated values. They were the ones where stated values and actual behavior aligned -- where saying 'this is wrong" was welcomed, not tolerated. Where slowing down for quality wasn't martyrdom, it was standard.</p>
      <p class="cd-body">That alignment doesn't happen on its own. It's the result of leaders who act the way they say they want everyone else to act. Nothing else comes close.</p>
    `,
  },
  "spongebob-would": {
    title: 'Squidward would never. SpongeBob would.',
    img: "https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/spongebob.jpeg",
    content: `
      <p class="cd-body">Squidward is the designer who's seen it all. Too experienced to be surprised. Too 'sensible" to chase anything that might not scale. He's done the research. He knows how this ends. He won't waste his energy on that.</p>
      <p class="cd-body">SpongeBob, though? He's the one sketching fish with arms just to see what happens. He's genuinely excited about the ketchup bottle. He doesn't know the idea won't work, so he tries it anyway. Sometimes it doesn't work. Sometimes it becomes a Krabby Patty.</p>
      <p class="cd-body">I've been both. I prefer being SpongeBob.</p>
      <p class="cd-body">Seniority is useful -- pattern recognition, stakeholder navigation, knowing when to push and when to fold. But seniority can also calcify into cynicism. The antidote is to stay genuinely curious about the thing you're working on. Not because it helps your career. Because it makes the work better.</p>
      <p class="cd-body">The best design I've seen came from people who were enthusiastic in the face of constraints, not in spite of them. People who treated every boring form field like it might have a better version hiding inside it.</p>
      <p class="cd-body">SpongeBob would.</p>
    `,
  },
};

function openCase(id) {
  const data = CASES[id];
  if (!data) return;
  const content = document.getElementById('caseDetailContent');
  content.innerHTML = buildCaseHTML(data);
  content.classList.remove('content-entering');
  void content.offsetWidth;
  content.classList.add('content-entering');
  document.getElementById('caseListPanel').classList.add('hidden');
  document.getElementById('caseDetailPanel').classList.add('active');
  document.getElementById('caseDetailPanel').scrollTop = 0;
  // Reinit lazy images in new content
  content.querySelectorAll('img[data-lazy-src]').forEach(img => {
    img.src = img.dataset.lazySrc;
    delete img.dataset.lazySrc;
  });
}

function buildCaseHTML(d) {
  let html = `<p class="cd-company">${d.company}</p>`;
  html += `<h1 class="cd-headline">${d.title}</h1>`;
  if (d.chips?.length) {
    html += `<div class="cd-chips">${d.chips.map(c => `<span>${c}</span>`).join('')}</div>`;
  }
  if (d.metrics?.length) {
    html += `<div class="cd-metrics">${d.metrics.map(m => `<div class="cd-metric"><span class="cd-metric-value">${m.val}</span><span class="cd-metric-label">${m.label}</span></div>`).join('')}</div>`;
  }
  html += `<p class="cd-intro">${d.intro}</p>`;

  d.sections?.forEach(s => {
    html += `<div class="cd-block">`;
    if (s.h2) html += `<h2 class="cd-h2">${s.h2}</h2>`;
    if (s.body) html += `<p class="cd-body">${s.body}</p>`;
    if (s.reframe) {
      html += `<div class="cd-reframe">
        <div class="cd-reframe-from"><span class="cd-reframe-label">Before</span>${s.reframe.from}</div>
        <div class="cd-reframe-to"><span class="cd-reframe-label">After</span>${s.reframe.to}</div>
      </div>`;
    }
    if (s.img) {
      html += `<div class="cd-screenshot-wrap"><img src="${s.img}" alt="${s.imgCaption || ''}"></div>`;
      if (s.imgCaption) html += `<p class="cd-body" style="font-size:0.78rem;color:rgba(31,31,31,0.38);margin-top:-32px;margin-bottom:40px">${s.imgCaption}</p>`;
    }
    if (s.screenshots?.length) {
      html += `<div class="cd-screenshots-row">`;
      s.screenshots.forEach(sc => {
        html += `<div class="cd-screenshot-frame"><img src="${sc.src}" alt="${sc.caption}"><span>${sc.caption}</span></div>`;
      });
      html += `</div>`;
    }
    html += `</div>`;
  });

  if (d.haiku?.length) {
    html += `<div class="cd-haiku">${d.haiku.map(l => `<p>${l}</p>`).join('')}</div>`;
  }

  // Fit button
  html += `<div class="fit-btn-wrap" style="margin-top:48px">
    <button class="fit-btn">
      How do we match up?
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 10h10M10 5l5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  </div>`;

  return html;
}

function openThought(id) {
  const data = THOUGHTS[id];
  if (!data) return;
  const content = document.getElementById('caseDetailContent');
  let html = '';
  if (data.img) html += `<div style="width:calc(100% + 120px);margin-left:-60px;margin-bottom:40px;overflow:hidden"><img src="${data.img}" style="width:100%;display:block;height:auto" alt=""></div>`;
  html += `<h1 class="cd-headline">${data.title}</h1>`;
  html += data.content;
  content.innerHTML = html;
  content.classList.remove('content-entering');
  void content.offsetWidth;
  content.classList.add('content-entering');
  document.getElementById('caseListPanel').classList.add('hidden');
  document.getElementById('caseDetailPanel').classList.add('active');
  document.getElementById('caseDetailPanel').scrollTop = 0;
}

// ── Fit panel ────────────────────────────────────────────────────
const DANTE_CONTEXT = `You are helping evaluate L Dante Guarin as a product design candidate.

Background: L Dante Guarin is a Principal Product Designer with 13+ years of experience.
Key experience: Marketo/Adobe (design system: Sky, contributed patterns to Adobe Spectrum), Upwork, Teamshares (payroll reporting, ATS for 90+ companies), Meroxa (data observability pivot), T-Mobile.
Strengths: B2B/SaaS design systems, developer tools, complex data-heavy products, AI-integrated tools, discovery research that drives strategy.
Differentiators: Has designed for dual-persona platforms, data pipelines, financial infrastructure, and led product design through an acquisition.
Location: Irvine, CA.`;

// ── Recruiter panel ─────────────────────────────────────────────
function setupRecruiterPanel() {
  const ta      = document.getElementById('recruiterFitTextarea');
  const counter = document.getElementById('recruiterFitCharCount');
  const btn     = document.getElementById('recruiterFitAssessBtn');
  const errEl   = document.getElementById('recruiterFitError');
  const result  = document.getElementById('rpResult');
  if (!ta) return;

  ta.addEventListener('input', () => { counter.textContent = ta.value.length; });

  btn.addEventListener('click', async () => {
    const jd = ta.value.trim();
    if (!jd) return;
    const origText = btn.textContent;
    btn.textContent = 'Assessing...';
    btn.disabled = true;
    errEl.hidden = true;
    result.hidden = true;
    try {
      let raw;
      if (window.claude) {
        raw = await window.claude.complete({
          messages: [{
            role: 'user',
            content: `${DANTE_CONTEXT}\n\nJob description:\n${jd}\n\nProvide a structured fit assessment. Format your response EXACTLY as:\n\nVERDICT: [STRONG MATCH / MODERATE MATCH / WEAK MATCH]\n\nSUMMARY: [One bold declarative sentence about overall fit]\n\nSTRENGTHS:\n- [strength 1]\n- [strength 2]\n- [strength 3]\n\nWORTH DISCUSSING:\n- [consideration 1]\n- [consideration 2]\n\nRECOMMENDED CASES: [comma-separated from: teamshares-payroll, teamshares-ats, marketo-sky, marketo-migration, meroxa]`
          }]
        });
      } else {
        raw = "VERDICT: STRONG MATCH\n\nSUMMARY: Dante's system-first thinking, solo lead experience, and engineering fluency make him an ideal fit for this principled, collaborative design model.\n\nSTRENGTHS:\n- System-first problem framing across Teamshares, Meroxa, and Marketo aligns with first-principles design thinking\n- Solo design leadership at scale (ATS 0-1, Meroxa principal role) matches a lean, no-management structure\n- Design system expertise (Marketo Sky, 50+ components, contributed upstream to Adobe Spectrum)\n- Cross-functional roadmap influence via user research demonstrated throughout his career\n\nWORTH DISCUSSING:\n- Confirm visual design craft matches the role's quality bar\n- Confirm remote-first arrangement works for Dante\n\nRECOMMENDED CASES: teamshares-ats, meroxa";
      }
      const text = typeof raw === 'string' ? raw : (raw.content || raw.completion || '');
      renderRecruiterResult(text);
    } catch(e) {
      errEl.textContent = 'Assessment failed. Please try again.';
      errEl.hidden = false;
    } finally {
      btn.textContent = origText;
      btn.disabled = false;
    }
  });

  // Case card clicks
  document.querySelectorAll('#rpCards .rp-card[data-case]').forEach(el => {
    el.addEventListener('click', () => openCase(el.dataset.case));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openCase(el.dataset.case); });
  });
}

function renderRecruiterResult(text) {
  const result       = document.getElementById('rpResult');
  const pill         = document.getElementById('rpResultPill');
  const summaryEl    = document.getElementById('rpResultSummary');
  const strengthList = document.getElementById('rpStrengthList');
  const discussList  = document.getElementById('rpDiscussList');
  const recCards     = document.getElementById('rpRecCards');

  // Verdict
  const verdictMatch = text.match(/VERDICT:\s*(.+)/i);
  const verdict = verdictMatch ? verdictMatch[1].trim() : 'MATCH';
  pill.textContent = verdict;
  pill.className = 'rp-result-pill';
  if (/MODERATE/i.test(verdict)) pill.classList.add('moderate');
  else if (/WEAK/i.test(verdict)) pill.classList.add('weak');

  // Summary
  const summaryMatch = text.match(/SUMMARY:\s*([\s\S]+?)(?=\n\nSTRENGTHS|\n\nWORTH|\n\nRECOMMENDED|$)/i);
  summaryEl.textContent = summaryMatch ? summaryMatch[1].trim() : '';

  // Strengths
  const strengthMatch = text.match(/STRENGTHS:\s*([\s\S]+?)(?=\n\nWORTH|\n\nRECOMMENDED|$)/i);
  strengthList.innerHTML = '';
  if (strengthMatch) {
    strengthMatch[1].split('\n').filter(l => l.trim().startsWith('-')).forEach(line => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="rp-icon">&#x2705;</span><span>${escapeHTML(line.replace(/^-\s*/, ''))}</span>`;
      strengthList.appendChild(li);
    });
  }

  // Worth discussing
  const discussMatch = text.match(/WORTH DISCUSSING:\s*([\s\S]+?)(?=\n\nRECOMMENDED|$)/i);
  discussList.innerHTML = '';
  if (discussMatch) {
    discussMatch[1].split('\n').filter(l => l.trim().startsWith('-')).forEach(line => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="rp-icon">&#x1F4AC;</span><span>${escapeHTML(line.replace(/^-\s*/, ''))}</span>`;
      discussList.appendChild(li);
    });
  }

  // Recommended cases
  const recMatch = text.match(/RECOMMENDED CASES:\s*(.+)/i);
  recCards.innerHTML = '';
  if (recMatch) {
    recMatch[1].split(',').map(s => s.trim()).filter(Boolean).forEach(id => {
      const data = CASES[id];
      if (!data) return;
      const card = document.createElement('div');
      card.className = 'rp-rec-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.innerHTML = `
        <div class="rp-rec-card-top">
          <span class="rp-rec-card-company">${escapeHTML(data.company.toUpperCase())}</span>
          <span class="rp-rec-card-badge">CASE STUDY</span>
        </div>
        <h3 class="rp-rec-card-title">${escapeHTML(data.title)}</h3>
        <p class="rp-rec-card-desc">${escapeHTML(data.intro.slice(0, 110))}...</p>`;
      card.addEventListener('click', () => openCase(id));
      card.addEventListener('keydown', e => { if (e.key === 'Enter') openCase(id); });
      recCards.appendChild(card);
    });
  }

  result.hidden = false;
  // Scroll to result smoothly
  setTimeout(() => result.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

function setupFitPanel() {
  // Main fit panel only (recruiter fit now handled by setupRecruiterPanel)
  const fitTA    = document.getElementById('fitTextarea');
  const fitCount = document.getElementById('fitCharCount');
  const fitBtn   = document.getElementById('fitAssessBtn');
  const fitErr   = document.getElementById('fitError');
  const fitRes   = document.getElementById('fitResults');
  if (!fitTA) return;

  fitTA.addEventListener('input', () => { fitCount.textContent = fitTA.value.length; });
  fitBtn.addEventListener('click', () => runFitAssess(fitTA.value, fitRes, fitErr, fitBtn));
}

async function runFitAssess(jd, resultsEl, errorEl, btn) {
  if (!jd.trim()) return;
  const origText = btn.textContent;
  btn.textContent = 'Assessing…';
  btn.disabled = true;
  errorEl.hidden = true;
  resultsEl.hidden = true;

  try {
    let result;
    if (window.claude) {
      result = await window.claude.complete({
        messages: [{
          role: 'user',
          content: `${DANTE_CONTEXT}\n\nJob description:\n${jd}\n\nGive a concise fit assessment (3-5 paragraphs). Structure it as: 1) Overall fit summary, 2) Where he's strongest for this role, 3) Any gaps or open questions, 4) Recommendation. Be honest and specific.`
        }]
      });
    } else {
      // Fallback if no Claude available
      result = `<h3>Fit Assessment</h3><p>Dante's background aligns well with this role. His experience building design systems at scale (Marketo Sky → Adobe Spectrum), leading research-driven pivots (Meroxa), and designing for complex B2B data products (Teamshares) maps directly to the core requirements. His 13+ years of experience and track record of measurable outcomes ($3.1M cost reduction, 733% adoption increase) speak to both craft and strategic impact.</p><p>The strongest match points are his design systems expertise and his comfort in ambiguous, infrastructure-level product work. He's built for the kind of problems where the design system <em>is</em> the product strategy.</p>`;
    }
    resultsEl.innerHTML = typeof result === 'string' ? result : result.content || result;
    resultsEl.hidden = false;
  } catch(e) {
    errorEl.textContent = 'Assessment failed. Please try again.';
    errorEl.hidden = false;
  } finally {
    btn.textContent = origText;
    btn.disabled = false;
  }
}

// ── Fit panel ────────────────────────────────────────────────────
let userName = '';
let chatHistory = [];

function setupChatRail(role) {
  const nameInput  = document.getElementById('nameInput');
  const nameSend   = document.getElementById('nameSendBtn');
  const namePrompt = document.getElementById('railNamePrompt');
  const convo      = document.getElementById('railConvo');
  const convoInner = document.getElementById('convoInner');
  const chatInput  = document.getElementById('chatInput');
  const chatSend   = document.getElementById('chatSendBtn');
  const inputRow   = document.getElementById('chatInputRow');

  function submitName() {
    const val = nameInput.value.trim();
    if (!val) return;
    userName = val;
    namePrompt.classList.add('exiting');
    setTimeout(() => {
      namePrompt.style.display = 'none';
      convo.classList.add('active');
      inputRow.classList.add('visible');
      // Initial greeting
      addDanteMessage(`Hey ${userName}. What do you want to know?`);
    }, 350);
  }

  nameSend.addEventListener('click', submitName);
  nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitName(); });

  function sendChat() {
    const val = chatInput.value.trim();
    if (!val) return;
    chatInput.value = '';
    addUserMessage(val);
    streamDanteResponse(val, convoInner);
  }

  chatSend.addEventListener('click', sendChat);
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
}

function addUserMessage(text) {
  const convoInner = document.getElementById('convoInner');
  const msg = document.createElement('div');
  msg.className = 'msg msg--user visible';
  msg.innerHTML = `<div class="msg-bubble"><span class="msg-text">${escapeHTML(text)}</span></div>`;
  convoInner.appendChild(msg);
  chatHistory.push({ role: 'user', content: text });
  scrollConvo();
}

function addDanteMessage(text) {
  const convoInner = document.getElementById('convoInner');
  const msg = document.createElement('div');
  msg.className = 'msg visible';
  msg.innerHTML = `
    <img class="msg-avatar" src="https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/profile.png" alt="Dante">
    <div class="msg-bubble"><span class="msg-text">${text}</span></div>`;
  convoInner.appendChild(msg);
  chatHistory.push({ role: 'assistant', content: text });
  scrollConvo();
}

function addTypingIndicator() {
  const convoInner = document.getElementById('convoInner');
  const msg = document.createElement('div');
  msg.className = 'msg typing';
  msg.id = 'typingMsg';
  msg.innerHTML = `
    <img class="msg-avatar" src="https://raw.githubusercontent.com/lumpia-fiasco/ldante/main/assets/profile.png" alt="Dante">
    <div class="msg-bubble">
      <div class="msg-dot-wrap"><span></span><span></span><span></span></div>
      <span class="msg-text"></span>
    </div>`;
  convoInner.appendChild(msg);
  scrollConvo();
  return msg;
}

async function streamDanteResponse(question, convoInner) {
  const typing = addTypingIndicator();

  const SYSTEM = `You are L Dante Guarin -- a Principal Product Designer based in Irvine, CA.
You have 13+ years of experience in B2B/SaaS and developer tools. You've worked at Marketo/Adobe (built the Sky design system, contributed to Adobe Spectrum), Upwork, Teamshares (payroll + ATS for 90+ companies), Meroxa (data observability), and T-Mobile.
You're currently talking to ${userName || 'a visitor'} who is on your portfolio site.
You speak directly, with confidence and a bit of warmth. You don't over-explain. You're honest about trade-offs.
Keep responses conversational and under 4 sentences unless the question genuinely needs more.`;

  try {
    const messages = [
      ...chatHistory.slice(-10),
      { role: 'user', content: question }
    ];

    let response;
    if (window.claude) {
      response = await window.claude.complete({
        messages: [{ role: 'user', content: `${SYSTEM}\n\nUser: ${question}\n\nRespond as Dante:` }]
      });
    } else {
      response = "That's a great question. I'd be happy to talk through it on a call -- book a 30-minute slot at tidycal.com/ldante.";
    }

    const text = typeof response === 'string' ? response : (response.content || response.completion || '');
    typing.classList.remove('typing');
    typing.querySelector('.msg-text').textContent = text;
    typing.classList.add('visible');
    typing.removeAttribute('id');
    chatHistory.push({ role: 'assistant', content: text });
    scrollConvo();
  } catch(e) {
    typing.classList.remove('typing');
    typing.querySelector('.msg-text').textContent = 'Something went sideways on my end. Try again?';
    typing.classList.add('visible');
    typing.removeAttribute('id');
    scrollConvo();
  }
}

function scrollConvo() {
  const convo = document.getElementById('railConvo');
  requestAnimationFrame(() => { convo.scrollTop = convo.scrollHeight; });
}

// ── Context menu ─────────────────────────────────────────────────
function setupContextMenu() {
  const menu = document.getElementById('ctxMenu');

  function showMenu(x, y) {
    menu.style.left = Math.min(x, window.innerWidth - 220) + 'px';
    menu.style.top  = Math.min(y, window.innerHeight - 300) + 'px';
    menu.classList.add('visible');
  }
  function hideMenu() { menu.classList.remove('visible'); }

  document.addEventListener('contextmenu', e => {
    if (currentScreen !== 'screenPortfolio') return;
    e.preventDefault();
    showMenu(e.clientX, e.clientY);
  });
  document.addEventListener('click', e => {
    if (!menu.contains(e.target)) hideMenu();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideMenu(); });

  menu.querySelectorAll('[data-case]').forEach(btn => {
    btn.addEventListener('click', () => { hideMenu(); openCase(btn.dataset.case); });
  });

  document.getElementById('ctxToastClose').addEventListener('click', () => {
    document.getElementById('ctxToast').classList.remove('visible');
  });
}

// ── Helpers ──────────────────────────────────────────────────────
function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&quot;');
}

// ── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupGate();

  // Restore a previous authenticated session
  try {
    const hasAuth   = localStorage.getItem('ldg-auth') === '1';
    const savedExp  = localStorage.getItem('ldg-experience') || '';
    const savedScreen = localStorage.getItem('ldg-screen');
    const savedRole   = localStorage.getItem('ldg-role');

    if (hasAuth) {
      // Re-inject the ref param so setupLanding resolves the right config
      const url = new URL(window.location.href);
      if (savedExp && savedExp !== 'standard') {
        url.searchParams.set('ref', savedExp);
      }
      window.history.replaceState({}, '', url);

      if (savedScreen === 'screenPortfolio' && savedRole) {
        setTimeout(() => {
          showScreen('screenPortfolio');
          setupPortfolio(savedRole);
        }, 150);
      } else {
        setTimeout(() => {
          showScreen('screenLanding');
          setupLanding();
        }, 100);
      }
    }
  } catch(e) {}
});
