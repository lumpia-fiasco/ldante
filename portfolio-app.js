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
    jd: "Staff Product Designer — Core UI\nLattice\n\nDesign and evolve Lattice's design system as a Staff Product Designer on the Core UI team. Lead cross-product design patterns, build scalable and responsive component systems, and drive cohesion across Lattice's product suite. Requires deep systems thinking, front-end fluency (CSS, HTML, React), experience governing design systems at scale, and mentorship of other designers. B2B SaaS, complex workflows, platform-level impact.",
  },
  netflix: {
    greeting: "Hello, Netflix team.",
    body: "I'm Dante. A decade shipping complex products across ambiguous domains. I hold the product together when the rules haven't been written yet -- and I thrive where the problem space is still being defined.",
  },
  rippling: {
    greeting: "Hello, Rippling team.",
    body: "I'm Dante. I've spent my career at the seam between HR, finance, and the infrastructure underneath them. Rippling is building exactly the unified layer that I've seen teams struggle to assemble from parts -- and I want to help design it.",
    jd: "Product Design Lead, Finance\nRippling\n\nSet the vision for Rippling's Spend Management Platform and drive it from concept to shipped reality. Lead design for cards, expenses, bill pay, procurement, travel, and reporting. Create experiences that feel effortless for employees and powerful enough for global finance teams. Define patterns that scale from one-person startup to 10,000-person company.\n\n6–8+ years shipping complex, high-impact products. Portfolio showing ambiguous problems turned into simple workflows. Strong interaction and visual design craft. Relentless customer focus. Excellent communication and storytelling. Track record with Product and Engineering in fast-moving environments.",
  },
  five9: {
    greeting: "Hello, Five9 team.",
    body: "I'm Dante. I've spent years building complex, data-rich applications for power users. Design systems, multi-persona platforms, and the craft details that compound over an eight-hour shift.",
    jd: "Senior Product Designer\nFive9\n\nShape the user experience of Five9's cloud contact center platform, advocating for Agent, Supervisor, and Admin personas. Lead design from concept to launch for complex, data-rich applications. Contribute to and maintain the design system, ensuring consistency across all products. Drive the \"one platform\" strategy to create a seamless, integrated experience. Mentor other designers.\n\n5+ years on complex, data-rich applications. Proficiency in Figma, Sketch, Adobe. Web and mobile design principles. User research and usability testing. Strong communication and collaboration.",
  },
  twitch: {
    greeting: "Hello, Twitch team.",
    body: "I'm Dante. I've designed for dual-persona platforms -- products that only work when both sides feel served. That tension is familiar to me. Creators need tools that get out of the way; viewers need immersion. Both truths have to coexist.",
    jd: "Senior Product Designer\nTwitch\n\nDesign for content discovery and engagement experiences on Twitch. Hands-on research, close collaboration with engineers, PMs, and designers. Think creatively about sustaining streamer communities. Give back to the design community by using and improving existing patterns. Mentor junior designers.\n\n5+ years UX design. Content discovery and engagement. Interaction design and visual craft. Prototyping mobile experiences. Impact product strategy. Empathy for users. Figma expertise. Desirable: AI workflows, content creator or UGC platform experience, design systems knowledge.",
  },
  circle: {
    greeting: "Hello, Circle team.",
    body: "I'm Dante. Trust is the hardest thing to design for. I've worked on payroll, hiring infrastructure, and data pipelines -- all places where a single confusing moment can cost someone money, a job, or credibility. That's the design problem Circle lives in.",
    jd: "Lead Product Designer\nCircle\n\nOwn end-to-end design for currency, treasury, and payments solutions. Apply systems thinking to craft intuitive, scalable experiences serving thousands of businesses and millions of end users globally. Partner with Product and Engineering to define high-impact problem spaces. Drive cross-functional alignment on problem definition and solution strategy.\n\n7+ years UX/product design. Complex, high-impact product experiences. Strong systems thinking across interconnected product areas. Research and data-informed decisions. Experience with complex workflows, service design, enterprise-grade products.",
  },
  rivian: {
    greeting: "Hello, Rivian team.",
    body: "I'm Dante. I believe the moment a brand story becomes a transaction is one of the most fragile in product design. I've designed for B2B buyers, individual creators, and small business owners -- and the best commerce flows I've seen treat the story and the checkout as one thing.",
    jd: "Product Designer, Digital Studio\nRivian\n\nCreate customer-facing experiences on Rivian's website with a focus on product stories and commerce flows. Design the end-to-end user experience from brand discovery through product comprehension through multi-step purchase. Work across narrative storytelling and transactional checkout experiences. Contribute to and stretch the design system.\n\n5–7+ years product design with web expertise. 2+ years e-commerce. Deep knowledge of commerce and checkout flows. Experience localizing DTC purchase experiences across domestic and global geographies. Strong visual design and experience design craft.",
  },
};

// ── JD prefill helper ─────────────────────────────────────────
function prefillFitJD(text) {
  ['fitTextarea', 'recruiterFitTextarea'].forEach(id => {
    const ta = document.getElementById(id);
    if (!ta) return;
    ta.value = text;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

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
let returnPanel = 'caseListPanel'; // which panel to go back to when closing detail

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

  // ── Hiring manager: filter POV tiles before masonry runs ──
  if (role === 'hiring-manager') {
    setupHiringManagerView();
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

  // JD prefill if entering via a tailored experience link
  const _ref = (new URLSearchParams(window.location.search).get('ref') || '').toLowerCase();
  const _tailored = TAILORED[_ref];
  if (_tailored && _tailored.jd) prefillFitJD(_tailored.jd);

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
  if (returnPanel === 'recruiterPanel') {
    document.getElementById('recruiterPanel').classList.add('active');
    document.getElementById('recruiterPanel').scrollTop = 0;
  } else {
    document.getElementById('caseListPanel').classList.remove('hidden');
    document.getElementById('caseListPanel').scrollTop = 0;
  }
  returnPanel = 'caseListPanel';
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

  // ── Point of View / Perspective articles ───────────────────────

  'design-systems-that-last': {
    kicker: 'Point of View',
    title: 'What I\u2019ve learned building design systems that last',
    dek: 'On governance, breaking patterns intentionally, and why the org chart matters more than the component library.',
    content: `
      <p class="cd-body">Design systems are easy to start. The hard part is keeping them alive two years later, when the original team has turned over, the product has outgrown half the components, and three teams are quietly forking the button because \u201Cour use case is different.\u201D</p>
      <p class="cd-body">I\u2019ve built systems from scratch, inherited systems mid-drift, and watched good systems die slow deaths from neglect. The lessons that stuck have almost nothing to do with tokens or components. They\u2019re about people, governance, and knowing when the system should bend.</p>
      <h2 class="cd-h2">The org chart is the real architecture</h2>
      <p class="cd-body">Every design system inherits the shape of the organization that builds it. If the org is siloed, the system will be fragmented. If the org has unclear ownership, the system will have inconsistent adoption. You can have the cleanest component library in the world and still fail if the team structure doesn\u2019t support it.</p>
      <p class="cd-body">At Marketo, when I founded Sky, one of the first things I did was audit how teams were organized \u2014 not how components were organized. Who owned what surfaces? Who made decisions about shared patterns? Where did authority actually live versus where the org chart said it lived? That mapping told me more than any component audit ever could. The components came later. The governance model came first.</p>
      <h2 class="cd-h2">Governance is a habit</h2>
      <p class="cd-body">The worst design systems I\u2019ve seen have beautiful governance documents that no one follows. The best ones have almost no documentation about governance, but everyone knows how decisions get made because the process is embedded in how the team already works.</p>
      <p class="cd-body">With Sky, I democratized governance deliberately. Designers across product teams could propose patterns, challenge existing ones, and contribute directly. A federated model where ownership was distributed but standards were shared \u2014 replacing the bottleneck of a centralized request queue. That\u2019s harder than it sounds. Federated governance means you need clear principles people can apply independently, and you need to be comfortable with the fact that sometimes they\u2019ll make a different call than you would \u2014 and that\u2019s fine, as long as the reasoning holds.</p>
      <h2 class="cd-h2">Break patterns on purpose</h2>
      <p class="cd-body">Consistency is the point of a design system, right up until it isn\u2019t. The biggest mistake I see in mature systems is treating consistency as an absolute. It\u2019s a default. And defaults should be broken when there\u2019s a good enough reason \u2014 but only when the break is intentional, documented, and reversible.</p>
      <p class="cd-body">Drift is when teams break patterns because they don\u2019t know the pattern exists, or because it\u2019s easier to build custom. Intentional deviation is when a team breaks a pattern because the user\u2019s context demands it, and they document why. One erodes the system. The other strengthens it, because now you have a signal about where the system needs to grow.</p>
      <h2 class="cd-h2">Cross-product cohesion is a design problem</h2>
      <p class="cd-body">Components alone don\u2019t create cohesion. You can ship the same button, the same card, the same modal to every product surface and still end up with experiences that feel nothing alike. Cohesion comes from shared interaction patterns, consistent information hierarchy, predictable navigation models, and aligned mental models across products.</p>
      <p class="cd-body">At Marketo, the system\u2019s real value was that a user could move between products and feel like they were still in the same world. That\u2019s harder than matching hex values.</p>
      <h2 class="cd-h2">Adoption is a design problem too</h2>
      <p class="cd-body">Getting to 100% adoption on Sky took a campaign. I treated internal adoption the same way I\u2019d treat a product launch. Who are the users? What are their objections? Where\u2019s the friction? Most systems fail at adoption because they optimize for the system and forget about the people using it. Engineers don\u2019t care that your tokens are semantically named if the DX is painful. Adoption is the design problem hiding inside every design system.</p>
      <p class="cd-body">I think in systems before I think in screens. I care about governance as much as I care about components. And I believe the best design systems are culture \u2014 a shared language that lets teams build coherently without coordinating on every detail.</p>
    `,
  },

  'financial-platforms-systems-problems': {
    kicker: 'Point of View',
    title: 'Why financial platforms are systems problems',
    dek: 'On fragmentation, dual personas, and what payroll across 90+ companies taught me about designing for money that moves.',
    content: `
      <p class="cd-body">Financial products tend to start as individual tools. A card program here, an expense workflow there, bill pay in one system, travel booking in another. Each one solves its slice well enough. But the moment you try to connect them, the seams show.</p>
      <p class="cd-body">I\u2019ve spent the last few years designing platforms where financial data sits at the center. The pattern keeps repeating: the design problem that matters most lives in the connections between surfaces.</p>
      <h2 class="cd-h2">Fragmentation is the default</h2>
      <p class="cd-body">At Teamshares, payroll data lived in disparate systems across 90+ companies. Industry Leads had no centralized visibility into payroll health. Analyses were delayed three to five days by manual processes. The original ask was to make reports easier to generate, but through discovery we found the data architecture couldn\u2019t support real-time visibility at scale.</p>
      <p class="cd-body">We reframed the project from \u201Cbetter reports\u201D to \u201Ccentralized visibility.\u201D That reframe changed every design decision downstream, and the result was a 50% increase in team productivity and 135 hours saved per cycle. When you solve for the connections first, the individual surfaces get simpler.</p>
      <h2 class="cd-h2">Two users, one workflow</h2>
      <p class="cd-body">The hardest tension in financial platform design is that every workflow serves two users with opposing needs. The employee wants speed and minimal friction. The finance team wants control, compliance, and audit trails. Both are right. The strongest financial products encode the tension into the system itself \u2014 policies apply automatically so employees don\u2019t need to think about compliance and finance teams don\u2019t need to chase approvals.</p>
      <p class="cd-body">At Teamshares, Network Company operators got simple visibility into their own data. Industry Leads got aggregated views across all 90+ companies. The experience adapted to the role. The infrastructure was shared. That pattern scales across every financial domain.</p>
      <h2 class="cd-h2">Policy is invisible design</h2>
      <p class="cd-body">In financial products, the policy layer is where the real design lives. Approval routing, spending limits, compliance rules, budget controls. Good policy design means the employee rarely encounters a wall. The guardrails are built into the workflow so that by the time they submit something, it\u2019s already compliant. This is systems thinking applied to money \u2014 before you design any screen, you map the policy logic.</p>
      <h2 class="cd-h2">Consumer-grade craft in enterprise complexity</h2>
      <p class="cd-body">Complex doesn\u2019t have to mean complicated. The best B2B financial products feel like consumer apps on the surface while handling enterprise-grade logic underneath. An expense report should feel as easy as texting a photo. A procurement approval should be as clear as a notification. The craft is in making the complexity disappear while keeping the controls accessible for the people who need them.</p>
      <p class="cd-body">At Teamshares, I turned fragmented payroll data across 90+ companies into centralized visibility that saved $3.1M in annual efficiency gains. At Marketo, I built a design system that unified 50+ components across every product surface. The through line: I start with the system, understand how the pieces connect, and design the logic underneath the screens. Financial platforms reward that approach because the complexity is structural.</p>
    `,
  },

  'designing-platforms-where-two-sides-need-each-other': {
    kicker: 'Point of View',
    title: 'Designing platforms where two sides need each other',
    dek: 'On dual-persona design, the craft of making both sides feel served, and what payroll networks and data pipelines share with creator platforms.',
    content: `
      <p class="cd-body">Every platform with two distinct user types faces the same structural challenge: each side has different needs, different mental models, and different definitions of success. The platform has to serve both without compromising either.</p>
      <p class="cd-body">I\u2019ve designed for this dynamic across my career. At Teamshares, employees and network operators. At Upwork, freelancers and the clients hiring them. At Meroxa, data engineers building pipelines and the teams consuming the output. The design challenge repeats: how do you build one product that feels purpose-built for two very different people?</p>
      <h2 class="cd-h2">The relationship is the product</h2>
      <p class="cd-body">In two-sided platforms, the most important surface is the connection between them \u2014 the moment where one side\u2019s work reaches the other. At Teamshares, Industry Leads depended on data that Network Company operators produced. The reporting system had to make the operator\u2019s job feel simple and give the Industry Lead confidence that the data was accurate and current. If either side lost trust in the system, both sides suffered.</p>
      <p class="cd-body">That dynamic maps directly to creator platforms. A streamer needs tools that feel powerful and immediate. A viewer needs an experience that feels effortless and engaging. The platform succeeds when both sides feel like the product was designed specifically for them.</p>
      <h2 class="cd-h2">Empathy multiplied</h2>
      <p class="cd-body">Designing for one persona requires deep empathy. Designing for two requires holding both perspectives simultaneously, and knowing when they conflict. At Upwork, the platform had to give freelancers visibility and control over how they presented their work, while giving clients confidence and clarity in evaluating candidates. The most productive design decisions came from understanding where both sides\u2019 motivations aligned and designing for that overlap.</p>
      <h2 class="cd-h2">Systems that scale community</h2>
      <p class="cd-body">When a platform grows, consistency becomes community infrastructure. A shared interaction language across every surface means that both creators and viewers can navigate the product intuitively, regardless of which feature they\u2019re using. At Marketo, Sky\u2019s design system unified 50+ components across every product surface. Users moved between tools without having to relearn the interface. That same principle applies across live streams, chat, clips, profiles, and discovery surfaces.</p>
      <p class="cd-body">I\u2019ve spent my career designing platforms that serve multiple user types through shared infrastructure. Twitch\u2019s challenge is a version of the same problem I\u2019ve been solving: how do you give creators the power they need and viewers the experience they want, all within one product that feels intentional? That\u2019s the intersection of craft and systems where I do my best work.</p>
    `,
  },

  'designing-infrastructure-people-trust': {
    kicker: 'Point of View',
    title: 'Designing infrastructure people trust with their money',
    dek: 'On visibility, complex workflows, and why the design patterns that matter in traditional payments carry directly into digital currency.',
    content: `
      <p class="cd-body">Every product that touches money has the same foundational design constraint: trust. The interface has to communicate precision, status, and control at every step. Users need to know exactly where their money is, what\u2019s happening to it, and that they can intervene if something goes wrong.</p>
      <p class="cd-body">I\u2019ve designed financial infrastructure at Teamshares, where payroll data flowed across 90+ companies. The patterns I learned there \u2014 around visibility, status clarity, and policy-driven workflows \u2014 are the same patterns that matter in currency, treasury, and payments.</p>
      <h2 class="cd-h2">Visibility is trust</h2>
      <p class="cd-body">In financial products, the most important design decision is what you make visible. At Teamshares, Industry Leads had no real-time visibility into payroll health across their network. We redesigned the reporting system around centralized visibility \u2014 real-time data across 90+ companies. The result was a 50% increase in team productivity, and the deeper outcome was trust. When people can see the state of their money at a glance, they stop worrying about whether the system is doing its job.</p>
      <p class="cd-body">That principle applies directly to treasury and payments infrastructure. Whether someone is managing USDC reserves or routing cross-border payments, they need to see the state of every transaction, every balance, every policy in real time. Visibility is how you build trust at scale.</p>
      <h2 class="cd-h2">Complex workflows need calm design</h2>
      <p class="cd-body">Financial workflows are inherently complex. Multi-step approvals, compliance checks, reconciliation across systems, edge cases for every jurisdiction. The design challenge is making this complexity navigable without hiding it. At Teamshares, the design work was in creating clear paths: progressive disclosure that surfaced the right information at the right moment, status indicators that made the current state unambiguous, and defaults that handled the common case so users only had to intervene on exceptions.</p>
      <h2 class="cd-h2">Systems thinking across interconnected products</h2>
      <p class="cd-body">Currency, treasury, and payments are interconnected domains. A change in how currency is issued affects how treasury manages reserves affects how payments settle. Designing any one surface in isolation misses the connections. At Marketo, I built a design system that unified 50+ components across every product surface because the real value was in the connections between tools. At Meroxa, the strategic pivot came from recognizing that the product\u2019s surfaces were more connected than the team realized.</p>
      <p class="cd-body">I\u2019ve spent my career designing complex, interconnected systems that handle high-stakes data. Payroll across 90+ companies. Design systems that unified dozens of product surfaces. Data infrastructure pivots that reshaped entire platforms. Circle\u2019s challenge \u2014 building intuitive experiences for currency, treasury, and payments at global scale \u2014 sits at the exact intersection of systems thinking, financial domain knowledge, and craft that my career has been building toward.</p>
    `,
  },

  'where-brand-meets-the-buy-button': {
    kicker: 'Point of View',
    title: 'Where brand storytelling meets the buy button',
    dek: 'On product narratives, commerce flows, and what selling guitars taught me about the moment a story becomes a transaction.',
    content: `
      <p class="cd-body">The best product pages do two things at once. They build emotional connection and they move you toward a purchase. Most e-commerce experiences hand the story off to the funnel somewhere in the middle, and the experience breaks at the seam.</p>
      <p class="cd-body">I\u2019ve worked on both sides. Brand campaigns for Gibson Guitar and Nashville\u2019s country music labels. Complex product platforms at Marketo, Teamshares, and Meroxa. The lesson from both worlds is the same: the story and the transaction are one continuous experience. When you design them together, both get better.</p>
      <h2 class="cd-h2">Product comprehension is emotional first</h2>
      <p class="cd-body">At Gibson, a guitar page had to make you hear the tone before you ever touched the fretboard. The specs matter, but they matter after you\u2019ve already felt something. You fall in love with a Les Paul before you ever check the specs. The product page has to honor that sequence.</p>
      <p class="cd-body">Electric vehicles work the same way. The adventure, the terrain, the silence of the motor on a trail \u2014 these are stories that create desire. The range, the towing capacity, the charging network: those are the rational confirmations that close the deal. The product page needs to carry both, in the right order.</p>
      <h2 class="cd-h2">Commerce flows need the brand to follow through</h2>
      <p class="cd-body">The story can\u2019t stop at the product page. Configuration, checkout, financing, delivery tracking \u2014 each step is still the brand experience. When the visual language drops from cinematic to generic during checkout, you lose the emotional thread that got the customer there.</p>
      <p class="cd-body">At Gibson, this meant carrying the craftsmanship narrative through the entire purchase journey. In my platform work at Marketo, the design system\u2019s value was that a user could move between products and feel like they were still in the same world. That discipline applied to commerce means visual consistency, interaction consistency, and tonal consistency from first impression through post-purchase.</p>
      <h2 class="cd-h2">Global means adapting the story</h2>
      <p class="cd-body">Working with country music labels across markets taught me that localization goes deeper than translation. Cultural context shapes how people discover products, evaluate them, and decide to buy. The story that resonates in Nashville lands differently in Tokyo or Berlin. Effective localization means knowing which product attributes lead in which market, and designing the experience to flex accordingly.</p>
      <p class="cd-body">Rivian\u2019s website sits at the intersection of product storytelling and commerce infrastructure. Product pages that tell adventure stories. Commerce flows that handle configuration, financing, and global checkout. A design system that holds it all together. That\u2019s the synthesis of everything I\u2019ve spent my career building.</p>
    `,
  },

  'designing-for-people-who-live-in-the-product': {
    kicker: 'Point of View',
    title: 'Designing for people who live in the product',
    dek: 'On cognitive load, multi-persona platforms, and what full-day software demands from a design system.',
    content: `
      <p class="cd-body">Contact center software, marketing automation, data pipelines. These are products people inhabit. When someone spends eight hours inside your product, every design decision either compounds into clarity or compounds into fatigue.</p>
      <p class="cd-body">I\u2019ve spent most of my career designing platforms that people live in. Marketo, where marketers built and managed campaigns across dozens of surfaces. Teamshares, where operators managed hiring and payroll across 90+ companies. Meroxa, where engineers monitored real-time data pipelines. These users are working. And the bar for what \u201Cintuitive\u201D means goes up dramatically when the session never ends.</p>
      <h2 class="cd-h2">Cognitive load is a design debt</h2>
      <p class="cd-body">In full-day software, every unnecessary interaction is a tax. An extra click to reach a common action. A dashboard that shows everything but highlights nothing. A label that\u2019s technically accurate but takes a beat too long to parse. These compound. Over an eight-hour shift, a three-click workflow costs twenty minutes more than a one-click workflow. A noisy dashboard creates decision fatigue by lunch.</p>
      <p class="cd-body">At Marketo, I learned this building Sky. The design system unified 50+ components across every product surface. The deeper value was in the decisions we made about information density \u2014 which data needed to be visible at a glance, which actions deserved primary placement, which elements could be progressively disclosed to reduce noise.</p>
      <h2 class="cd-h2">Three personas, one platform</h2>
      <p class="cd-body">Platform products often serve multiple personas with fundamentally different relationships to the same data. An agent needs speed and simplicity. A supervisor needs oversight and intervention tools. An admin needs configuration and control. The design challenge is building a unified experience that adapts to each persona without fragmenting into three separate products.</p>
      <p class="cd-body">At Teamshares, the payroll reporting system served network company operators and industry leads through the same underlying platform. Operators saw their own company data. Industry leads saw aggregated views across all 90+ companies. The interface adapted to the role. The architecture was shared. That pattern is how you build \u201Cone platform\u201D for multiple personas without losing coherence.</p>
      <h2 class="cd-h2">Design systems carry the weight</h2>
      <p class="cd-body">When a platform spans dozens of surfaces and serves multiple personas, the design system is what keeps the experience from fragmenting. Consistent interaction patterns, predictable layouts, shared vocabulary. At Marketo, Sky achieved 100% adoption across product teams and patterns were eventually contributed upstream to Adobe Spectrum \u2014 because the system was built to serve the people using it, treating internal adoption as a design problem the same way we\u2019d solve any product problem.</p>
      <p class="cd-body">I\u2019ve spent my career on the kind of products where users set up camp. The \u201Cone platform\u201D challenge is one I\u2019ve solved before, at different companies and at different scales. The underlying problem is always the same: how do you give three very different users a coherent experience without building three separate products? That\u2019s systems thinking applied to product design, and it\u2019s the work I do best.</p>
    `,
  },
};

function openCase(id) {
  const data = CASES[id];
  if (!data) return;
  // Track which panel to return to
  const rPanel = document.getElementById('recruiterPanel');
  if (rPanel && rPanel.classList.contains('active')) {
    returnPanel = 'recruiterPanel';
    rPanel.classList.remove('active');
  } else {
    returnPanel = 'caseListPanel';
    document.getElementById('caseListPanel').classList.add('hidden');
  }
  const content = document.getElementById('caseDetailContent');
  content.innerHTML = buildCaseHTML(data);
  content.classList.remove('content-entering');
  void content.offsetWidth;
  content.classList.add('content-entering');
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
  // Track which panel to return to
  const rPanel = document.getElementById('recruiterPanel');
  if (rPanel && rPanel.classList.contains('active')) {
    returnPanel = 'recruiterPanel';
    rPanel.classList.remove('active');
  } else {
    returnPanel = 'caseListPanel';
    document.getElementById('caseListPanel').classList.add('hidden');
  }
  const content = document.getElementById('caseDetailContent');
  let html = '';
  if (data.img) html += `<div style="width:calc(100% + 120px);margin-left:-60px;margin-bottom:40px;overflow:hidden"><img src="${data.img}" style="width:100%;display:block;height:auto" alt=""></div>`;
  if (data.kicker) html += `<p class="cd-company">${data.kicker}</p>`;
  html += `<h1 class="cd-headline">${data.title}</h1>`;
  if (data.dek) html += `<p class="cd-intro">${data.dek}</p>`;
  html += data.content;
  content.innerHTML = html;
  content.classList.remove('content-entering');
  void content.offsetWidth;
  content.classList.add('content-entering');
  document.getElementById('caseDetailPanel').classList.add('active');
  document.getElementById('caseDetailPanel').scrollTop = 0;
}

// ── Fit panel ────────────────────────────────────────────────────
const DANTE_CONTEXT = `You are an objective third-party reviewer assessing whether L Dante Guarin is a fit for a given role. Be direct and honest. Do not flatter. Do not default to positivity. If there are genuine gaps, name them plainly.

WHO HE IS:
Principal Product Designer, 13+ years. IC contributor — not a people manager, not looking to manage a team. Based in Irvine, CA. His depth is web-based product design; not native mobile.

WHERE HE GENUINELY FITS (use these to argue STRONG MATCH):
- B2B / SaaS product design — this is his entire career
- Design systems at scale: founded Sky at Marketo/Adobe, 50+ components, patterns contributed upstream to Adobe Spectrum
- Complex data-heavy tools and dashboards (Teamshares payroll reporting, Meroxa observability platform)
- Financial infrastructure and HR tech (payroll, ATS, employee ownership workflows)
- Developer tooling and data pipeline products
- Discovery research that reshapes product strategy, not just validates it
- Dual-persona platform design (operators + admins, creators + consumers, engineers + stakeholders)
- IC design leadership at scale — has been the only or lead designer on multiple 0-to-1 products

WHERE HE IS A WEAKER OR UNKNOWN FIT (use these to argue MODERATE or WEAK MATCH):
- Consumer social, entertainment, gaming — no direct experience in these domains
- People management / design leadership roles — he is an IC and wants to stay one
- Native mobile-first products (iOS/Android) — his portfolio is web and responsive; no deep native work
- Healthcare, government, education, non-profit — limited or no domain exposure
- Pure e-commerce, retail, DTC consumer — not his background
- Brand design, marketing design, motion design — product design only
- B2C at consumer scale — Upwork and T-Mobile are the closest, but his real depth is enterprise B2B
- Roles that require specific unlisted skills (AR/VR, game UI, etc.)`;

// ── Recruiter panel ─────────────────────────────────────────────
function setupRecruiterPanel() {
  const ta       = document.getElementById('recruiterFitTextarea');
  const counter  = document.getElementById('recruiterFitCharCount');
  const btn      = document.getElementById('recruiterFitAssessBtn');
  const clearBtn = document.getElementById('recruiterFitClearBtn');
  const errEl    = document.getElementById('recruiterFitError');
  const result   = document.getElementById('rpResult');
  if (!ta) return;

  ta.addEventListener('input', () => {
    counter.textContent = ta.value.length;
    if (clearBtn) clearBtn.hidden = ta.value.length === 0;
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      ta.value = '';
      counter.textContent = '0';
      clearBtn.hidden = true;
      errEl.hidden = true;
      result.hidden = true;
    });
  }

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
            content: `${DANTE_CONTEXT}\n\nJob description:\n${jd}\n\nAssess this role honestly against Dante's profile. Do not default to positivity. Name gaps directly.\n\nSCORING GUIDE:\n- STRONG MATCH: His specific experience maps directly to the core requirements. Domain, platform, and user type align closely. He could contribute immediately.\n- MODERATE MATCH: Transferable skills exist but meaningful gaps are present — domain mismatch, missing platform experience, or significant unknowns. Worth a conversation, not an obvious hire.\n- WEAK MATCH: The role requires things he hasn't done — wrong domain, people management, mobile-native depth, or an industry he has no track record in.\n\nWhen in doubt between two verdicts, choose the lower one. Only use STRONG MATCH when it genuinely applies.\n\nFormat your response EXACTLY as:\n\nVERDICT: [STRONG MATCH / MODERATE MATCH / WEAK MATCH]\n\nSUMMARY: [One direct, unspun sentence about fit. No filler. No padding.]\n\nSTRENGTHS:\n- [Specific JD requirement he directly meets]\n- [Another direct match]\n- [Another direct match]\n\nGAPS:\n- [Specific requirement from the JD he lacks or has limited experience with]\n- [Another gap, or 'None identified' if genuinely none]\n\nRECOMMENDED CASES: [exactly 3 comma-separated IDs chosen from: teamshares-payroll, teamshares-ats, marketo-sky, marketo-migration, meroxa — pick the 3 most relevant to this role]`
          }]
        });
      } else {
        raw = "VERDICT: MODERATE MATCH\n\nSUMMARY: Strong B2B and design systems background, but domain alignment depends on how much this role leans into enterprise vs. consumer.\n\nSTRENGTHS:\n- 13+ years of B2B/SaaS product design across complex, data-heavy tools\n- Design systems depth: founded Sky at Marketo/Adobe, 50+ components, contributed to Adobe Spectrum\n- Solo IC leadership at scale — has been the lead or only designer on multiple 0-to-1 products\n\nGAPS:\n- Paste the actual job description to get an accurate assessment\n- Domain fit can't be determined without knowing the role's focus area\n\nRECOMMENDED CASES: teamshares-ats, marketo-sky, meroxa";
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

}

// ── Hiring manager tile filter ───────────────────────────────────
function setupHiringManagerView() {
  const params = new URLSearchParams(window.location.search);
  const ref = (params.get('ref') || params.get('company') || '').toLowerCase();

  // Map experience slug → which POV thought to surface
  const POV_MAP = {
    lattice:  'design-systems-that-last',
    rippling: 'financial-platforms-systems-problems',
    twitch:   'designing-platforms-where-two-sides-need-each-other',
    circle:   'designing-infrastructure-people-trust',
    rivian:   'where-brand-meets-the-buy-button',
    five9:    'designing-for-people-who-live-in-the-product',
    netflix:  'designing-for-people-who-live-in-the-product',
  };

  const matchedId = POV_MAP[ref] || null;
  const stack = document.getElementById('caseStack');
  let matchedEl = null;

  // Hide all POV/Perspective tiles; surface only the matched one
  document.querySelectorAll('#caseStack .case-item--thought').forEach(el => {
    if (!el.querySelector('.thought-tile--pov')) return; // skip non-POV tiles
    if (matchedId && el.dataset.thought === matchedId) {
      matchedEl = el;
    } else {
      el.style.display = 'none';
    }
  });

  // Move the matched tile to be first in the stack (before case studies)
  if (matchedEl && stack) {
    stack.insertBefore(matchedEl, stack.firstChild);
  }
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
  const summaryMatch = text.match(/SUMMARY:\s*([\s\S]+?)(?=\n\nSTRENGTHS|\n\nGAPS|\n\nRECOMMENDED|$)/i);
  summaryEl.textContent = summaryMatch ? summaryMatch[1].trim() : '';

  // Strengths
  const strengthMatch = text.match(/STRENGTHS:\s*([\s\S]+?)(?=\n\nGAPS|\n\nRECOMMENDED|$)/i);
  strengthList.innerHTML = '';
  if (strengthMatch) {
    strengthMatch[1].split('\n').filter(l => l.trim().startsWith('-')).forEach(line => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="rp-icon">&#x2705;</span><span>${escapeHTML(line.replace(/^-\s*/, ''))}</span>`;
      strengthList.appendChild(li);
    });
  }

  // Gaps
  const discussMatch = text.match(/GAPS:\s*([\s\S]+?)(?=\n\nRECOMMENDED|$)/i);
  discussList.innerHTML = '';
  if (discussMatch) {
    discussMatch[1].split('\n').filter(l => l.trim().startsWith('-')).forEach(line => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="rp-icon">&#x26A0;&#xFE0F;</span><span>${escapeHTML(line.replace(/^-\s*/, ''))}</span>`;
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
      // Pull logo src and card color from the matching case-item already in the DOM
      const srcEl  = document.querySelector(`#caseStack .case-item[data-case="${id}"] .case-card-logo`);
      const logoSrc = srcEl ? srcEl.getAttribute('src') : '';
      const isWhiteLogo = srcEl ? srcEl.classList.contains('logo-white') : false;
      const itemEl  = document.querySelector(`#caseStack .case-item[data-case="${id}"]`);
      const cardColor = itemEl ? itemEl.style.getPropertyValue('--card-color') : '#1f1f1f';

      const card = document.createElement('div');
      card.className = 'rp-rec-card';
      card.style.setProperty('--card-color', cardColor);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.innerHTML = `
        <div class="case-card-v">
          <span class="case-study-badge">Case Study</span>
          ${logoSrc ? `<img src="${logoSrc}" alt="${escapeHTML(data.company)}" class="case-card-logo${isWhiteLogo ? ' logo-white' : ''}">` : ''}
          <div class="case-card-content">
            <p class="case-company">${escapeHTML(data.company)}</p>
            <h3 class="case-title-h">${escapeHTML(data.title)}</h3>
            <p class="case-desc-h">${escapeHTML(data.intro.slice(0, 110))}...</p>
          </div>
        </div>`;
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
  const fitTA      = document.getElementById('fitTextarea');
  const fitCount   = document.getElementById('fitCharCount');
  const fitBtn     = document.getElementById('fitAssessBtn');
  const fitClear   = document.getElementById('fitClearBtn');
  const fitErr     = document.getElementById('fitError');
  const fitRes     = document.getElementById('fitResults');
  if (!fitTA) return;

  fitTA.addEventListener('input', () => {
    fitCount.textContent = fitTA.value.length;
    if (fitClear) fitClear.hidden = fitTA.value.length === 0;
  });

  if (fitClear) {
    fitClear.addEventListener('click', () => {
      fitTA.value = '';
      fitCount.textContent = '0';
      fitClear.hidden = true;
      fitErr.hidden = true;
      fitRes.hidden = true;
    });
  }

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
