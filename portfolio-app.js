/* ═══════════════════════════════════════════════════════════════
   LDante Portfolio -- App Logic
   Handles: gate, landing, masonry, case studies, chat, fit, context menu
═══════════════════════════════════════════════════════════════ */

'use strict';

// ── Tailored landing config ────────────────────────────────────
const TAILORED = {
  lattice: {
    greeting: "Hello, Lattice team.",
    body: "I'm Dante. I'm a Product Designer with over a decade building the tools people use to do their best work.\n\nLattice sits exactly at the intersection I love -- complex systems, real human needs, and the org-level trust that makes or breaks both.",
    jd: "Staff Product Designer — Core UI\nLattice\n\nDesign and evolve Lattice's design system as a Staff Product Designer on the Core UI team. Lead cross-product design patterns, build scalable and responsive component systems, and drive cohesion across Lattice's product suite. Requires deep systems thinking, front-end fluency (CSS, HTML, React), experience governing design systems at scale, and mentorship of other designers. B2B SaaS, complex workflows, platform-level impact.",
  },
  rippling: {
    greeting: "Hello, Rippling team.",
    body: "I'm Dante. I've spent my career at the seam between HR, finance, and the infrastructure underneath them.\n\nRippling is building exactly the unified layer that I've seen teams struggle to assemble from parts -- and I want to help design it.",
    jd: "Product Design Lead, Finance\nRippling\n\nSet the vision for Rippling's Spend Management Platform and drive it from concept to shipped reality. Lead design for cards, expenses, bill pay, procurement, travel, and reporting. Create experiences that feel effortless for employees and powerful enough for global finance teams. Define patterns that scale from one-person startup to 10,000-person company.\n\n6–8+ years shipping complex, high-impact products. Portfolio showing ambiguous problems turned into simple workflows. Strong interaction and visual design craft. Relentless customer focus. Excellent communication and storytelling. Track record with Product and Engineering in fast-moving environments.",
  },
  five9: {
    greeting: "Hello, Five9 team.",
    body: "I'm Dante. I've spent years building complex, data-rich applications for power users.\n\nDesign systems, multi-persona platforms, and the craft details that compound over an eight-hour shift.",
    jd: "Senior Product Designer\nFive9\n\nShape the user experience of Five9's cloud contact center platform, advocating for Agent, Supervisor, and Admin personas. Lead design from concept to launch for complex, data-rich applications. Contribute to and maintain the design system, ensuring consistency across all products. Drive the \"one platform\" strategy to create a seamless, integrated experience. Mentor other designers.\n\n5+ years on complex, data-rich applications. Proficiency in Figma, Sketch, Adobe. Web and mobile design principles. User research and usability testing. Strong communication and collaboration.",
  },
  twitch: {
    greeting: "Hello, Twitch team.",
    body: "I'm Dante. I've designed for dual-persona platforms -- products that only work when both sides feel served. That tension is familiar to me.\n\nCreators need tools that get out of the way; viewers need immersion. Both truths have to coexist.",
    jd: "Senior Product Designer\nTwitch\n\nDesign for content discovery and engagement experiences on Twitch. Hands-on research, close collaboration with engineers, PMs, and designers. Think creatively about sustaining streamer communities. Give back to the design community by using and improving existing patterns. Mentor junior designers.\n\n5+ years UX design. Content discovery and engagement. Interaction design and visual craft. Prototyping mobile experiences. Impact product strategy. Empathy for users. Figma expertise. Desirable: AI workflows, content creator or UGC platform experience, design systems knowledge.",
  },
  circle: {
    greeting: "Hello, Circle team.",
    body: "I'm Dante. Trust is the hardest thing to design for.\n\nI've worked on payroll, hiring infrastructure, and data pipelines -- all places where a single confusing moment can cost someone money, a job, or credibility. That's the design problem Circle lives in.",
    jd: "Lead Product Designer\nCircle\n\nOwn end-to-end design for currency, treasury, and payments solutions. Apply systems thinking to craft intuitive, scalable experiences serving thousands of businesses and millions of end users globally. Partner with Product and Engineering to define high-impact problem spaces. Drive cross-functional alignment on problem definition and solution strategy.\n\n7+ years UX/product design. Complex, high-impact product experiences. Strong systems thinking across interconnected product areas. Research and data-informed decisions. Experience with complex workflows, service design, enterprise-grade products.",
  },
  createmusic: {
    greeting: "Hello, Create Music Group.",
    body: "I'm Dante. I've built design systems that started as a set of best guesses and grew into the foundation that survived an acquisition and shaped what came after it.\n\nI've designed workflow tools for people who don't want to be operating software — they want to be talking to a network president, managing talent, or making music. The design job is to make the operational infrastructure so clear and effortless that the user stays focused on their actual work. That's the Create Music platform problem exactly.",
    jd: "Product Design Lead, Systems & Practice\nCreate Music Group\n\nLead the creation and evolution of Create Music Group's design system — defining modular foundations, patterns, and frameworks that unify products and scale quality across teams. Work directly with creators, partners, and teams to prototype and deliver intuitive, scalable solutions. Model high-quality design and foster a culture of critique and shared principles. Partner with engineering and product to embed platform-first thinking into roadmaps. Guide designers in systems thinking, platform design, and AI tools.\n\n8+ years designing and shipping complex products, platforms, or workflow systems. Proven design systems experience at scale across multiple teams. Deep design thinking and research capability. Passion for developing design practice and culture. Curiosity about AI in design.",
  },
  citrix: {
    greeting: "Hello, Citrix team.",
    body: "I'm Dante. I've designed for the seam where administrator control meets end-user experience — healthcare systems where an IT configuration shapes what every clinician can and can't do, data platforms where a single settings decision affects a whole engineering org.\n\nI've built design systems that held complex, multi-surface products together through acquisitions and pivots. And I've been using AI tooling — including Claude Code, which I used to build this portfolio — to close the gap between design intent and working prototype.",
    jd: "Principal Product Designer\nCitrix\n\nShape the future of administrator and end-user experiences for cloud and on-premises enterprise products. Lead major design initiatives collaborating with designers, PMs, and engineers across the globe. Drive key design initiatives, advocate for design excellence with product and engineering stakeholders. Leverage UX design, research, and strategy to influence product strategy. Contribute to the design system, mentor other designers, explore vision-level future thinking.\n\n12+ years product design with enterprise software focus. Deep design systems expertise. AI prototyping proficiency (Figma Make, Claude Code). Expert Figma skills. Exceptional communication with product and engineering leadership. Proven cross-functional project leadership.",
  },
  tacobell: {
    greeting: "Hello, Taco Bell team.",
    body: "I'm Dante. I've built design systems for platforms that can’t afford inconsistency — Marketo’s Sky library governed a multi-audience enterprise product and held through an Adobe acquisition. Multi-surface, many teams, one coherent system.\n\nTaco Bell’s problem is the interesting version of that: scaling across mobile, web, kiosk, and internal tools while keeping the brand’s personality intact. Consistency without flattening. That’s the constraint I’d design around.",
    jd: "Design Systems Lead\nTaco Bell\n\nBuild, scale, and govern Taco Bell's design system as a core product ecosystem across mobile apps, web platforms, kiosk experiences, and internal tools. Lead architecture, evolution, and governance across foundations, tokens, components, patterns, and documentation. Partner with Engineering, Product, Merchandising, Marketing, Brand, and Platform teams. Define contribution models, lifecycle management, versioning, and scalability standards.\n\n8+ years design experience with deep design systems specialization. Proven experience building and scaling enterprise design systems. Expert proficiency in Figma, design tokens, component libraries, and system architecture. Deep understanding of multi-surface platforms. Strong engineering partnership experience.",
  },
  '1password': {
    greeting: "Hello, 1Password team.",
    body: "I'm Dante. My background is in consequence spaces \u2014 payroll, healthcare, devops \u2014 where the failure mode isn\u2019t a bad review, it\u2019s an incident. That\u2019s shaped how I think about security UX: friction isn\u2019t just annoying, it\u2019s a vulnerability. The products that get this right treat it as a design problem.\n\nI built this portfolio with Claude Code. The agentic tools callout in your JD isn\u2019t aspirational \u2014 it\u2019s current.",
    jd: "Senior Product Designer\n1Password\n\nOwn the design of significant product areas end to end \u2014 from discovery through delivery. Partner closely with product managers, engineers, and researchers to define problems, explore opportunities, and deliver high-quality solutions. Advocate for customer needs and inclusive, accessible design while balancing security, technical, and business constraints. Mentor junior designers. Contribute to design processes, tools, and AI-assisted workflows.\n\n5+ years product design at a product-driven company. Hands-on experience with agentic development tools (Cursor, Claude Code, MCP-based tools). Proficiency in Figma and interest in Figma AI/Make. Strong product thinking. Experience with engineering, PM, content design, and research. Ability to reduce complex problems to the right balance of flexibility, power, and ease of use. Interest or experience in cybersecurity and/or SaaS products. Bonus: experience with security, privacy, enterprise, or regulated products; accessibility expertise; design systems.",
  },
  roland: {
    greeting: "Hello, Roland team.",
    body: "I'm Dante. I've spent a decade designing complex tools for expert users \u2014 people who live in software and know exactly when it\u2019s slowing them down. Music software is where I\u2019ve always wanted to apply that: your users are experts in sound, not UI, and the moment the interface makes them think about the interface, you\u2019ve lost the session.\n\nI got my start at Gibson Guitar \u2014 that\u2019s where I was first introduced to user-centered design. I\u2019m also based in OC, practically next door.",
    jd: "Product Designer (Cold Outreach)\nRoland \u2014 Music Software\n\nDesign musician-first software experiences across Roland\u2019s software portfolio, including Roland Cloud, Zenbeats, and hardware-integrated applications. Bridge the gap between Roland\u2019s hardware legacy and modern software UX. Design for expert users whose expertise is musical, not computational \u2014 and build systems that stay coherent across a growing product surface.",
  },
  ucla: {
    greeting: "Hello, UCLA Health team.",
    body: "I'm Dante. I designed for healthcare infrastructure at MEDHOST \u2014 systems running clinical operations at the facility level. I know what it means to design where errors carry real consequence, and where brand standards and accessibility aren\u2019t optional.\n\nI\u2019ve built component libraries that held through acquisitions and platform pivots, and I\u2019ve been hand-coding HTML and CSS since the start of my career \u2014 so I can close the gap between design intent and implementation myself.",
    jd: "UX Product Designer\nUCLA Health\n\nLead UX design for UCLA Health\u2019s enterprise web ecosystem, including the flagship UCLA Health and David Geffen School of Medicine websites and secondary sites. Develop and maintain a comprehensive web component library and UX standards. Design intuitive experiences across high-visibility platforms with significant consequence of error. Mentor web strategists on user-centered practices. Lead research, design, and implementation across tactical and multi-year programs. Ensure strict adherence to brand guidelines, accessibility standards (WCAG, ADA), and user-centered principles.\n\n5+ years UX/product design in enterprise web or SaaS. Advanced accessibility knowledge. Figma proficiency. Design systems experience. User research and usability testing. Agile fluency. HTML/CSS/JS a plus.",
  },
  yahoo: {
    greeting: "Hello, Yahoo Sports team.",
    body: "I'm Dante. I built the Marketo Sky design system from scratch \u2014 50+ components, full org adoption, governance that survived an Adobe acquisition and contributed patterns upstream to Spectrum.\n\nI also built this portfolio using Claude Code, which gives me a first-hand read on where design intent breaks down in AI-generated code. That gap is exactly what this role is about.",
    jd: "Principal, Design Systems\nYahoo Sports\n\nDefine the strategy and roadmap for an AI-ready design system at one of the internet\u2019s most-visited sports platforms. Architect frameworks where components and logic are structured for LLM consumption and automated UI generation. Drive design-to-code pipelines with design tokens as the universal source of truth across Web, iOS, and Android. Implement AI-driven efficiencies in the design lifecycle. Lead high-density data modeling for live sports and analytics. Mentor designers on prompt engineering, structured AI interaction, and systems thinking.\n\n8+ years product design with specialized design systems focus. AI tools integration experience. Advanced Figma (variables, tokens, component architecture). Front-end principles (HTML/CSS). Multi-platform systems leadership. Preferred: live data visualization, JSON/code-based system management, Git.",
  },
  ingram: {
    greeting: "Hello, Ingram Micro team.",
    body: "I'm Dante. I've built tools for expert users who won't forgive a bad interface \u2014 marketers running enterprise campaigns, operators managing multi-company financials, engineers watching systems fail in real time. The product has to earn their respect before it earns their workflow.\n\nXvantage is the interesting version of that problem: resellers, vendors, and business buyers, all with different jobs, all dependent on the same platform. Designing across personas at that scale \u2014 without losing coherence \u2014 is exactly what I want to be working on.",
    jd: "Sr. Principal, Product Designer\nIngram Micro Xvantage\u2122\n\nOwn entire categories of experience on a platform that reaches nearly 90% of the global IT population. Partner with engineering, product, and business leadership to deliver high-quality designs across multiple personas in complex B2B scenarios. Lead end-to-end feature design, conduct executive-level user research, direct in-house designers and external consultants, and contribute to design culture and practice. Present and defend solutions in executive settings.\n\n10+ years UX/UI with B2B SaaS focus. Expert Figma. Research leadership. Agile/Lean UX fluency. Strong executive communication and presentation skills. HTML/CSS/JS experience a plus. Master\u2019s preferred.",
  },
  pagerduty: {
    greeting: "Hello, PagerDuty team.",
    body: "I'm Dante. At Meroxa, I led the design pivot from a no-code pipeline builder to a real-time data observability platform — the kind where engineers watch systems under pressure, trying to understand what's wrong and move fast.\n\nDesigning AI that operators trust in high-stakes moments is exactly the kind of problem I want to be working on. The challenge isn't making the AI capable — it's making it legible enough that people are willing to let it act.",
    jd: "Principal Product Designer, AI & Automation\nPagerDuty\n\nLead design strategy for AI and Automation across the PagerDuty Operations Cloud. Define the vision for how AI agents, automation workflows, and intelligent insights are experienced by technical operations teams. Partner with AI/ML engineers, product managers, and data scientists. Establish design principles for AI transparency, explainability, and user control. Mentor designers on AI/UX best practices. Conduct strategic research on how technical teams adopt and trust AI in mission-critical contexts.\n\n10+ years product design with complex technical products. 3+ years designing AI/ML, intelligent systems, or automation platforms. Demonstrated design strategy leadership. Portfolio showcasing AI/UX, automation design, or intelligent agent experiences. Preferred: DevOps, developer tools, or technical operations experience.",
  },
  ethyca: {
    greeting: "Hello, Ethyca team.",
    body: "I'm Dante. I've spent my career building tools that help organizations operate with confidence — compliance workflows, data pipelines, payroll infrastructure where accuracy isn't a feature, it's the product.\n\nWhat Ethyca is doing sits at the intersection of design's highest-stakes territory: making the invisible machinery of data governance legible, auditable, and trustworthy — for the privacy engineers, compliance teams, and legal functions who have to live in it every day. That's not a UI problem. It's a systems problem. And it's the kind I know how to solve.",
    jd: "Senior Product Designer\nEthyca\n\nOwn end-to-end design for Fides, the operating system for Data Privacy & AI Governance. Translate ambiguous compliance and governance challenges into intuitive enterprise interfaces. Build and maintain scalable design systems. Collaborate with engineers, PMs, and stakeholders on complex, data-driven workflows. Conduct user research and testing. Deliver pixel-perfect, accessible designs.\n\n5+ years product design. Strong UX/UI portfolio. Expertise in Figma and prototyping tools. Experience with complex enterprise workflows. Deep understanding of accessibility standards. Proven ability to balance strategic thinking with hands-on execution.",
  },
  apollo: {
    greeting: "Hello, Apollo team.",
    body: "I'm Dante. I've spent my career building data-dense tools for teams that need to move fast and stay oriented.\n\nMarketo was my closest analog to the Apollo problem — a platform where revenue teams live and die by whether the right signal surfaces at the right time. I've thought a lot about what makes that work, and what makes it fail.",
    jd: "Staff Product Designer\nApollo.io\n\nHelp craft the future of Apollo\u2019s go-to-market platform, trusted by 500,000+ companies globally. Work within a Squad alongside a PM and engineers to brainstorm, build, and validate solutions for complex enterprise user problems. Map complex workflows and system interactions within the CRM product. Interview enterprise users, contribute to the design system, and integrate quantitative and qualitative data into product decisions.\n\n8+ years designing and shipping complex, enterprise-level SaaS products. Expert systems thinker. Experience in CRM, sales-tech, or B2B domains a strong plus. User research and experimentation experience. Strong Figma skills including component and design system work.",
  },
  machinify: {
    greeting: "Hello, Machinify team.",
    body: "I'm Dante. I've designed for healthcare infrastructure — the systems behind patient registration, supply chain, and document management at the facility level. Healthcare's complexity isn't theoretical to me.\n\nAnd I think AI in this space is only as valuable as the design that makes it legible, trustworthy, and actually usable by the people it's built for.",
    jd: "Senior Product Designer\nMachinify\n\nDesign for Machinify's AI-powered healthcare intelligence platform serving 85+ health plans across the payment continuum. Leverage design thinking to address complex challenges. Conduct and apply UX research. Create wireframes, mockups, and prototypes for new features. Develop design specifications and documentation. Collaborate with engineering on implementation. Contribute to and maintain design systems and style guides.\n\n6+ years UX/UI in fast-paced environments. Advanced Figma proficiency. Deep understanding of UX principles, design thinking, interaction design, and usability. Experience with wireframes, user flows, mockups, and prototypes. Strong communication and cross-functional collaboration. Bonus: design systems and platform design experience.",
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
const GENERAL_BODY = "I'm Dante. I'm a Product Designer with over a decade of experience specializing in B2B/SaaS and devops tools.\n\nIf we drew a Venn diagram of complex systems, and real user needs -- I operate where the two overlap.";

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
    // Pass experience as ?ref= so setupLanding picks up the tailored config.
    // If experience is generic/empty, leave any visitor-provided ?ref= intact.
    const url = new URL(window.location.href);
    if (experience && experience !== 'standard') {
      url.searchParams.set('ref', experience);
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
    // Strip only ?p= — preserve ?ref= and any other params
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('p');
    window.history.replaceState({}, '', cleanUrl);
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
  bodyText.innerHTML = (tailored ? tailored.body : GENERAL_BODY).split('\n\n').join('<br><br>');

  // Stagger in — only run the animation if btns aren't already visible
  if (!btns.classList.contains('visible')) {
    blocks.forEach((b, i) => {
      b.style.transitionDelay = `${0.05 + i * 0.12}s`;
      setTimeout(() => b.classList.add('visible'), 80 + i * 120);
    });
    setTimeout(() => btns.classList.add('visible'), 500);
  }
}

// ── Portfolio ───────────────────────────────────────────────────
let portfolioReady = false;
let returnPanel = 'caseListPanel'; // which panel to go back to when closing detail

function setupPortfolio(role) {
  if (portfolioReady) return;
  portfolioReady = true;

  // ── Recruiter ──
  if (role === 'recruiter') {
    document.getElementById('recruiterPanel').classList.add('active');
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

  // Both panels → back to experience selector (role picker)
  document.getElementById('rpToSelector').addEventListener('click', () => {
    showScreen('screenLanding', 'down');
    setupLanding();
  });
  document.getElementById('hmToSelector').addEventListener('click', () => {
    showScreen('screenLanding', 'down');
    setupLanding();
  });

  // Fit button in case detail (delegated)
  document.getElementById('caseDetailContent').addEventListener('click', e => {
    if (e.target.closest('.fit-btn')) openFitPanel();
  });

  // Fit panels
  setupFitPanel();

  // Context menu
  setupContextMenu();

  // Mobile tabs
  document.querySelectorAll('.mob-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.mob-tab').forEach(t => t.classList.remove('mob-tab--active'));
      tab.classList.add('mob-tab--active');
      if (tab.dataset.tab === 'fit') {
        openFitPanel();
      } else if (tab.dataset.tab === 'work') {
        // Close fit/detail panels and return to the case list
        document.getElementById('fitPanel').classList.remove('active');
        document.getElementById('caseDetailPanel').classList.remove('active');
        document.getElementById('recruiterPanel').classList.remove('active');
        document.getElementById('caseListPanel').classList.remove('hidden');
        document.getElementById('caseListPanel').scrollTop = 0;
        returnPanel = 'caseListPanel';
      }
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
    headline: 'The ask was a data display. The problem was three hours of work nobody should have been doing.',
    intro: 'Industry leads were spending half their day on manual prep before they could have a single useful conversation with a network president. The brief said "one place to view payroll data." The real job was getting that prep time down to zero.',
    metrics: [
      { value: '1.5 hrs', label: 'end-to-end workflow, down from 3' },
      { value: '135 hrs', label: 'saved per cycle across six leads' },
      { value: '$3.1M',   label: 'annual efficiency gains' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Solo Design Lead</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Discovery, product design, integration architecture</div></div>
        <div><div class="cs-meta-label">Partners</div><div class="cs-meta-val">PM, finance leadership, data engineering, 2 engineers</div></div>
        <div><div class="cs-meta-label">Pilot users</div><div class="cs-meta-val">6 industry leads across 90+ network companies</div></div>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/teamshares%20payroll.png" class="cd-hero-img" alt="Teamshares Payroll Dashboard" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">What industry leads actually do</span></div>
        <p class="cd-body">Teamshares acquires small businesses from retiring owners and hands them to new presidents &#8212; MBAs and aspiring operators who want to run something without starting from scratch. The employees get equity. The president gets a company. And Teamshares sends in industry leads to make sure the whole thing doesn&#39;t fall apart.</p>
        <p class="cd-body">Industry leads are the operational version of Gordon Ramsay. They walk into a network company, look at the books, find the leaks, and help the president fix them. Payroll is always on the list: it&#39;s one of the clearest windows into how a company is actually running. Headcount changes, overtime patterns, bonus timing &#8212; it all tells a story if you can read it fast enough.</p>
        <p class="cd-body">The ask made sense on the surface: one place to view payroll data per network company and generate reports. But that framing assumed the problem was display. It wasn&#39;t.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">What discovery actually found</span></div>
        <p class="cd-body">Before opening Figma I spent time with the leads &#8212; shadowing their workflow, studying the payroll tools they were already using, learning the vocabulary. The goal wasn&#39;t to understand what they wanted in a dashboard. It was to understand what they were doing before the dashboard existed.</p>
        <p class="cd-body">What I found: three hours of manual prep standing between a lead and every conversation that mattered.</p>
        <div class="workflow-block">
          <div class="workflow-row">
            <div class="workflow-step">Export</div>
            <div class="workflow-body">Pull a CSV from the payroll system &#8212; Gusto, ADP, Paychex, BambooHR, depending on the company.</div>
            <span class="workflow-tag tag-gone">eliminated</span>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Import</div>
            <div class="workflow-body">Bring it into a spreadsheet. Map columns. Clean the format. Every system exports slightly differently.</div>
            <span class="workflow-tag tag-gone">eliminated</span>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Calculate</div>
            <div class="workflow-body">Run formulas. Build waterfall charts by hand. Period-over-period comparisons. Changes in overtime, PTO, headcount, bonuses.</div>
            <span class="workflow-tag tag-gone">eliminated</span>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Import again</div>
            <div class="workflow-body">Pull into Metabase for visualization. Then analyze.</div>
            <span class="workflow-tag tag-gone">eliminated</span>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">The conversation</div>
            <div class="workflow-body">Finally: sit down with the president and share the insight.</div>
            <span class="workflow-tag tag-kept">the actual job</span>
          </div>
        </div>
        <p class="cd-body">Multiply that by six leads across 90+ network companies and you&#39;re looking at a significant operational drag on the whole model. The leads were highly paid operators doing spreadsheet work. That&#39;s a business problem &#8212; and it needed to be framed that way before any design work could start.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The reframe that changed the brief</div>
          <p class="cd-body">From: &#34;How do we display payroll data?&#34; To: &#34;How do we get leads straight to analysis &#8212; and straight to the conversation?&#34; Those are fundamentally different products. The second one is a workflow tool that happens to display data. Every design decision downstream came from that distinction.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">What the leads actually needed to see</span></div>
        <p class="cd-body">I got a full walkthrough of how leads did analysis in their spreadsheets before the dashboard existed. Waterfall charts. Period-over-period comparisons. Changes in overtime, PTO, headcount, bonuses &#8212; laid out so you could spot the story at a glance without doing math first.</p>
        <p class="cd-body">The key insight: leads needed comparative data. Prior period vs. current. The delta matters more than the number. A payroll run showing $180K in overtime means nothing in isolation. A payroll run showing overtime up 40% from the prior period is a conversation starter.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">Why this shaped every component decision</div>
          <p class="cd-body">Once I understood that the job was spotting change, the information hierarchy became clear. Deltas go at the top, in large type, with directional indicators. Absolute values are secondary &#8212; they provide context, while the deltas carry the signal. That distinction flows all the way down to arrow indicators at the component level.</p>
        </div>
        <p class="cd-body">I found a charting library that could replicate the waterfall and period-over-period views leads were already building by hand. Meeting them in their existing mental model meant less re-learning and faster adoption from a pilot group that didn&#39;t have time for a learning curve.</p>
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/teamshares-industry-lead-workflow.png" class="cd-screenshot" alt="Industry Lead workflow" />
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/teamshares-payroll-home.png" class="cd-screenshot" alt="Payroll home dashboard" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">04</span><span class="cs-section-title">The integration scope problem</span></div>
        <p class="cd-body">Payroll data at Teamshares doesn&#39;t live in one place. Ninety-plus network companies running everything from Gusto to ADP to Paychex to BambooHR. Disparate systems, disparate export formats, a lot of manual process stitching it together.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">Option A</div>
            <div class="cs-tc-title">Manual import flow</div>
            <div class="cs-tc-body">Leads upload CSVs. The dashboard handles display and calculation. Faster to build, simpler integration surface. But leads still own the export-import loop, which was most of the three hours we were trying to eliminate.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">Option B &#8212; chosen <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Live integrations via Merge</div>
            <div class="cs-tc-body">Connect directly to each payroll system. Leads open the dashboard and the data is already there. More engineering investment up front, but it&#39;s the only version that actually eliminates the prep work instead of just organizing it.</div>
          </div>
        </div>
        <p class="cd-body">We used Merge for implementation &#8212; it let us move fast against a fragmented vendor landscape without building bespoke connectors for every payroll system. The tradeoff was a dependency on a third-party integration layer. The alternative was more internal engineering work for every new payroll system added to the network. Given that Teamshares was acquiring companies constantly, the Merge dependency was the right bet.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">05</span><span class="cs-section-title">Designing for the platform</span></div>
        <p class="cd-body">Once the integrations were in place, payroll data was live and structured inside Teamshares for the first time. I pushed hard to design the integration layer to serve the full platform beyond the industry leads workflow.</p>
        <div class="finding-block">
          <div class="finding-row">
            <div class="finding-tag">Roster sync</div>
            <div class="finding-body">Once connected, payroll became the source of truth for employee rosters. A hire in BambooHR would surface automatically in TeamsharesOS. A departure would trigger a deactivation flow.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Cap table updates</div>
            <div class="finding-body">Employee roster changes cascaded into cap table updates automatically. New hires entering the equity program, departures exiting it &#8212; all flowing from the payroll integration without manual reconciliation.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Platform foundation</div>
            <div class="finding-body">The payroll section established a new pattern in TeamsharesOS for how financial data surfaces platform-wide. Every subsequent financial data feature had a template to build from instead of starting from scratch.</div>
          </div>
        </div>
        <p class="cd-body">The argument I made internally: the integration work is the expensive part. Building it for one workflow and then rebuilding it for three more is three times the cost for the same outcome. Do it once, do it right, and let the whole platform inherit it.</p>
      </div>

      <div class="cd-screenshots-row">
        <div class="cd-screenshot-frame">
          <img src="assets/teamshares-system-effect.png" alt="System effect" />
          <span>Platform-wide cascade</span>
        </div>
        <div class="cd-screenshot-frame">
          <img src="assets/teamshares-integration.png" alt="Integration hub" />
          <span>Integration hub</span>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">06</span><span class="cs-section-title">The concession: anomaly detection vs. delta highlighting</span></div>
        <p class="cd-body">The vision I wanted to ship was anomaly detection &#8212; a dashboard that could flag unusual patterns automatically before a lead even opened the screen. The problem was data maturity. The integrations were brand new. There was no historical baseline to define what &#34;normal&#34; looked like for any given company.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">What I wanted</div>
            <div class="cs-tc-title">Anomaly detection</div>
            <div class="cs-tc-body">Automatic flagging of unusual patterns against historical baselines. Leads open the dashboard and the outliers are already surfaced. Requires sufficient historical data to establish what normal looks like.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">What we shipped <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Delta highlighting</div>
            <div class="cs-tc-body">Surface change clearly. Make movement visible between pay periods at a glance. A deliberate foothold that starts collecting the behavioral signal needed for smarter detection later.</div>
          </div>
        </div>
        <p class="cd-body">The delta highlighting was the right call given the constraint. But I made a mistake in how I reasoned about it: I let the ideal version crowd out a good-enough intermediate. A simple threshold-based alert &#8212; flag any payroll run that&#39;s 20% or more above the prior period &#8212; doesn&#39;t require historical patterns, just a rule. That was buildable from day one and I didn&#39;t push for it. The lesson I&#39;ve carried since: the right question isn&#39;t &#34;can we ship the full vision?&#34; It&#39;s &#34;what&#39;s the best version of this we can ship now, given what we actually have?&#34;</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">07</span><span class="cs-section-title">What the outcomes actually mean</span></div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">1.5 hrs</div>
          <div class="outcome-detail">
            <div class="cs-od-title">End-to-end workflow, down from 3</div>
            <div class="cs-od-body">The 1.5 hours that remained after the dashboard shipped was the actual job: analysis, drafting advice, having the conversation with the president. The prep was gone. The 50% number undersells it. The remaining 1.5 hours was the actual job — analysis and conversation. The prep was gone entirely. Measured through workflow observation with pilot leads before and after launch.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">135 hrs</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Saved per cycle across six leads</div>
            <div class="cs-od-body">Six leads, 1.5 hours saved per company per cycle, across 90+ companies. The math compounds fast when you&#39;re operating at network scale. Worth noting: this is capacity freed — nobody was cut. The leads used that time for more companies, deeper analysis, and higher-value conversations &#8212; which was the point.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">$3.1M</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Annual efficiency gains</div>
            <div class="cs-od-body">Finance leadership calculated this based on fully-loaded lead costs against hours recovered. I didn&#39;t generate this number &#8212; they did, using the workflow time data from the pilot. It&#39;s the clearest signal that the reframe from &#34;display problem&#34; to &#34;workflow problem&#34; was the right one. A better dashboard wouldn&#39;t have gotten there. Eliminating the prep did.</div>
          </div>
        </div>
      </div>

      <div class="cd-video-wrap">
        <iframe src="https://www.youtube.com/embed/g3VFUV3jO3c?si=waezLVp14mnNbrpc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">08</span><span class="cs-section-title">What I&#39;d do differently</span></div>
        <p class="cd-body">The threshold-based alert is the obvious one. Letting the full anomaly detection vision crowd out a simpler, shippable version was a failure of prioritization that I owned.</p>
        <p class="cd-body">The other thing: I&#39;d push earlier and harder for the platform scope. The argument that the integration layer should serve the full platform rather than just the leads workflow landed eventually, but it landed mid-build rather than at the start of scoping. Some architectural decisions had already been made with a narrower surface in mind. That conversation needed to happen before the first design review.</p>
        <div class="cs-reflection">
          <div class="cs-reflection-title">The thing this project was really testing</div>
          <p class="cd-body">Every Teamshares network company is a small business with real employees who took a bet on employee ownership. The industry lead&#39;s job is to make sure that bet pays off. If they&#39;re spending half their day doing spreadsheet prep, they&#39;re not doing their job &#8212; and the companies they&#39;re responsible for are getting less of what they need. The dashboard was bigger than productivity — it was a lever on a model that matters. Getting the framing right at the start was what made everything else possible.</p>
        </div>
      </div>

      <div class="cd-block cd-closer">
        <p class="cd-body">Teamshares is a private company. Screens shown are representative of shipped work.</p>
      </div>
    `,
  },

  'teamshares-ats': {
    company: 'Teamshares',
    headline: 'The ask was "build an ATS." The real problem was a broken hiring model.',
    intro: 'Teamshares was acquiring small businesses faster than it could place leaders to run them. The tool holding the whole operation together was a spreadsheet. Fixing that wasn\'t a tooling problem. It was a system design problem.',
    metrics: [
      { value: '20+', label: 'leaders placed through the platform' },
      { value: '10+', label: 'qualified leaders benched for future placement' },
      { value: '1',   label: 'source of truth, replacing Lever and spreadsheets entirely' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Solo Design Lead</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Discovery, system design, product design</div></div>
        <div><div class="cs-meta-label">Partners</div><div class="cs-meta-val">PM, recruiting team, engineering</div></div>
        <div><div class="cs-meta-label">Constraint</div><div class="cs-meta-val">80+ acquired companies, growing fast</div></div>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/teamshares%20ats.png" class="cd-hero-img" alt="Teamshares ATS" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">Why this wasn&#39;t an ATS problem</span></div>
        <p class="cd-body">The brief was straightforward: build an applicant tracking system to replace the spreadsheet the recruiting team was running on. But a few conversations in, it was obvious that a better tracker wasn&#39;t going to solve what was actually broken.</p>
        <p class="cd-body">Teamshares&#39; business model is specific. They acquire small businesses, transition them to employee ownership, and install a President to run each one. That President placement is the unlock. Without the right person in place, the whole model stalls. And executive hiring takes 2 to 6 months on average &#8212; which meant every open President slot was a company sitting in limbo.</p>
        <p class="cd-body">They had 80+ companies acquired. Some Presidents were running two companies at once just to cover gaps. The spreadsheet wasn&#39;t failing because spreadsheets are bad. It was failing because nobody had designed for what recruiting at this volume and this stakes level actually required.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The reframe that changed the project</div>
          <p class="cd-body">The team was thinking: &#34;How do we track candidates better?&#34; The right question was: &#34;How do we build a talent pipeline that ensures Teamshares always has qualified leaders ready to place?&#34; A candidate tracker optimizes individual hires. A talent pipeline is infrastructure that compounds over time. I pushed for the second framing before a single screen was designed.</p>
        </div>
        <div class="cs-pull-quote">
          <p class="cs-pull-quote-text">"A knack for turning complex problems into clear, user-friendly solutions, always keeping the user's needs at the forefront."</p>
          <p class="cs-pull-quote-attr"><strong>Kevin Rikio Shiiba</strong> · Co-founder &amp; CTO, Teamshares</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">What discovery actually looked like</span></div>
        <p class="cd-body">Discovery here wasn&#39;t just recruiter interviews. It was mapping the entire operating model: how acquisitions flowed, how President slots opened, how candidates moved through the process, and what happened to the ones who didn&#39;t get placed. That last part mattered more than anyone had thought to document.</p>
        <div class="finding-block--padded">
          <div class="finding-row">
            <span class="finding-tag">No shared language</span>
            <span class="finding-body">Each recruiter tracked candidates differently. What one called &#34;phone screen&#34; another called &#34;intro call.&#34; There was no agreed-upon vocabulary for where someone stood &#8212; which made pipeline visibility across the team essentially impossible.</span>
          </div>
          <div class="finding-row">
            <span class="finding-tag">No bench</span>
            <span class="finding-body">Qualified candidates who didn&#39;t get placed would fall completely out of the system. Every new opening started from zero. The team was doing significant work to source and evaluate candidates, then throwing that work away when a hire didn&#39;t close.</span>
          </div>
          <div class="finding-row">
            <span class="finding-tag">No visibility</span>
            <span class="finding-body">Executives had no way to see pipeline health &#8212; how many Presidents-in-waiting were in the system, how close they were to placement-ready, or where bottlenecks were forming. Flying blind on a metric central to the business model.</span>
          </div>
          <div class="finding-row">
            <span class="finding-tag">Transaction mindset</span>
            <span class="finding-body">The team was treating each hire as a one-time event. Source, evaluate, place, done. What the business actually needed was a continuously warm talent pipeline. That&#39;s a fundamentally different operating model, and no amount of UI improvement would get there without first changing the underlying system.</span>
          </div>
        </div>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/ats-brads.jpg" class="cd-hero-img" alt="Teamshares candidates" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">The hardest design work happened before Figma opened</span></div>
        <p class="cd-body">Before I touched any UI, I mapped every state a candidate could be in across the full lifecycle &#8212; not just the happy path, but every edge case I could find. What happens when someone gets placed but the company folds six months later? What happens to a finalist who didn&#39;t get the offer? What happens when a placed President leaves?</p>
        <p class="cd-body">Those edge cases defined the data model. The data model defined the product. Getting that wrong in design would have meant building something that looked right but broke the moment it hit real operational load.</p>
        <div class="cs-callout cs-callout--problem">
          <div class="cs-callout-label">The stage vocabulary problem</div>
          <p class="cd-body">I spent significant time before designing any screens just getting the recruiting team aligned on a shared stage vocabulary. Recruiter by recruiter. What does &#34;screening&#34; mean? What moves someone from &#34;interested&#34; to &#34;qualified&#34;? When is someone on the bench vs. out of consideration? That alignment work was unglamorous and it was the most important design work on the project. Every workflow downstream depended on it being consistent.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">04</span><span class="cs-section-title">The core design decision: purpose-built vs. adapted</span></div>
        <p class="cd-body">Teamshares was already using Lever, a standard enterprise ATS. The obvious path was to configure Lever more intentionally and build tooling around it. I pushed back on that direction early.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">Option A</div>
            <div class="cs-tc-title">Extend Lever</div>
            <div class="cs-tc-body">Lean on the existing ATS. Add structure through custom fields, stages, and integrations. Less build, faster to ship, familiar to the team. The tradeoff: Lever was built for general hiring at volume. The Teamshares model didn&#39;t fit its assumptions.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">Option B &#8212; chosen <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Purpose-built internal tool</div>
            <div class="cs-tc-body">Design an ATS from scratch around the specific operating model. Slower to ship, more engineering investment. But it could model the bench, support placement-based workflows, give leadership pipeline visibility, and be built with a two-sided future in mind.</div>
          </div>
        </div>
        <p class="cd-body">Lever&#39;s data model treated every candidate as moving toward a single job opening. Teamshares needed candidates to exist independently of any specific opening and be matchable to future placements. That&#39;s a fundamentally different architecture — beyond what any configuration of Lever could support.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">05</span><span class="cs-section-title">Shipping incrementally, learning under real load</span></div>
        <p class="cd-body">The product shipped in sprints with the recruiting team using it in production throughout. That wasn&#39;t just a process choice &#8212; it was how I found the problems that don&#39;t show up in research.</p>
        <div class="sprint-block">
          <div class="sprint-row">
            <div class="sprint-label">Sprint 3</div>
            <div class="sprint-body">Candidate scoring rubric. Without a structured rubric, evaluation was left to individual recruiter judgment, which meant no consistent signal for who belonged on the bench vs. who was out. The rubric made &#34;qualified&#34; mean the same thing across the team.</div>
          </div>
          <div class="sprint-row">
            <div class="sprint-label">Post-pilot</div>
            <div class="sprint-body">Admin tools for assignment management. A gap that only surfaced once real volume hit. Recruiters needed to reassign candidates across openings without losing history. Didn&#39;t come up in research. Came up immediately in production.</div>
          </div>
          <div class="sprint-row">
            <div class="sprint-label">Later</div>
            <div class="sprint-body">Bulk actions. Volume grew faster than anyone projected. What worked fine at 20 candidates per recruiter was painful at 60. Bulk status updates and batch communication became necessary, not nice-to-have.</div>
          </div>
          <div class="sprint-row">
            <div class="sprint-label">Ongoing</div>
            <div class="sprint-body">Email hooks to cut the manual status-update loop. Recruiters were spending significant time on outbound communication that the system could handle. Automating status notifications freed up recruiting capacity for actual relationship work.</div>
          </div>
        </div>
        <div class="cd-screenshots-row">
          <div class="cd-screenshot-frame">
            <img src="assets/ats-candidate-detail.png" alt="Candidate detail" />
            <span>Candidate detail</span>
          </div>
          <div class="cd-screenshot-frame">
            <img src="assets/ats-scoring.png" alt="Scoring rubric" />
            <span>Scoring rubric</span>
          </div>
        </div>
        <div class="cd-screenshots-row">
          <div class="cd-screenshot-frame">
            <img src="assets/ats-archiving.png" alt="Archiving" />
            <span>Bench &amp; archiving</span>
          </div>
          <div class="cd-screenshot-frame">
            <img src="assets/ats-bulk-edits.png" alt="Bulk edits" />
            <span>Bulk actions</span>
          </div>
        </div>
      </div>

      <div class="cs-pull-quote">
        <p class="cs-pull-quote-text">"He's quick to step up and guide the team, especially in challenging situations."</p>
        <p class="cs-pull-quote-attr"><strong>Kevin Rikio Shiiba</strong> · Co-founder &amp; CTO, Teamshares</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">06</span><span class="cs-section-title">Candidate experience as a design constraint</span></div>
        <p class="cd-body">Most internal tools treat the candidate as a data object. The kind of person Teamshares was recruiting &#8212; experienced operators, often leaving stable roles &#8212; had real leverage. They could walk.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The design decision that came out of this</div>
          <p class="cd-body">Purpose-built candidate status messaging at each stage transition. Candidates knew what stage they were in, what came next, and roughly what the timeline looked like. This was a strategic retention mechanism for high-value candidates in a long process. Losing a finalist at week eight meant restarting a months-long process. The messaging investment paid for itself once.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">07</span><span class="cs-section-title">The future the data architecture was built for</span></div>
        <p class="cd-body">Late in the project I started talking to Network Presidents &#8212; candidates who&#39;d been through the process. What I heard shaped a direction nobody had formally proposed: a two-sided platform where candidates maintain profiles between application cycles, and Teamshares proactively matches upcoming openings to warm candidates already in the system.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">What we shipped</div>
            <div class="cs-tc-title">One-sided ATS</div>
            <div class="cs-tc-body">Recruiter-facing tool for managing the President placement pipeline. Candidates are tracked but passive. The system is operated entirely by Teamshares staff.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">What the architecture enables <span class="cs-chosen-badge">future state</span></div>
            <div class="cs-tc-title">Two-sided talent platform</div>
            <div class="cs-tc-body">Candidates maintain profiles, signal availability, and get matched to openings proactively. Teamshares stops starting from zero on every search. The bench becomes a living network.</div>
          </div>
        </div>
        <p class="cd-body">The resourcing wasn&#39;t there to build it at the time, and the company reorganized before it could be pursued. But identifying and architecting toward a future state &#8212; even one that doesn&#39;t ship on your watch &#8212; is part of the job at principal level. You&#39;re not just designing for the current sprint. You&#39;re making decisions that either open or close future possibilities.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">08</span><span class="cs-section-title">What the outcomes actually measured</span></div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">20+</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Leaders placed</div>
            <div class="cs-od-body">Presidents hired and placed into acquired companies through the platform. Executive placements at this level typically take 2 to 6 months each. 20+ placements through a purpose-built system, with a small recruiting team, represents serious throughput improvement over the spreadsheet baseline.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">10+</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Leaders benched</div>
            <div class="cs-od-body">Qualified candidates identified, evaluated, and retained in the system for future placement. Under the old model, these people would have fallen out of the system entirely. This number represents the bench strategy working: recruiting investment that compounds rather than evaporates. It&#39;s the number I&#39;m most proud of because it proves the pipeline model over the transaction model.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">1</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Source of truth</div>
            <div class="cs-od-body">All applicant management moved into the platform, replacing Lever and the spreadsheets entirely. With one system, leadership could see pipeline health for the first time. Recruiters stopped duplicating work across tools. Stage data became consistent enough to actually analyze. The product became core infrastructure &#8212; used daily until the team was dissolved in a company-wide reorganization.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">09</span><span class="cs-section-title">What I&#39;d do differently</span></div>
        <p class="cd-body">The stage vocabulary alignment work was the right call, but I&#39;d do it faster. I spent time working recruiter by recruiter to get buy-in on shared language when I could have run a structured workshop up front, documented the decisions, and moved on.</p>
        <p class="cd-body">On the candidate experience: I&#39;d push for it earlier. I raised it as a constraint mid-project, when it should have been in scope from the start. If I&#39;d framed candidate retention as a business risk in the initial scoping conversation, it would have been in scope from day one.</p>
        <div class="cs-reflection">
          <div class="cs-reflection-title">What this project was really about</div>
          <p class="cd-body">Getting the right President into an acquired small business isn&#39;t an HR milestone. It&#39;s the unlock for employee ownership to actually work. Every hire placed through this system represented a business moving from a retiring owner&#39;s legacy into something owned by the people who run it. The spreadsheet couldn&#39;t hold that weight. The platform could. Designing systems that hold serious weight &#8212; and that don&#39;t break when the business scales past what anyone originally planned for &#8212; is the job.</p>
        </div>
      </div>

      <div class="cd-block cd-closer">
        <p class="cd-body">Teamshares is a private company. Screens shown are representative of shipped work.</p>
      </div>
    `,
  },

  'marketo-sky': {
    company: 'Marketo / Adobe',
    headline: 'I didn\'t pitch a design solution. I pitched a structural one.',
    intro: 'Marketo was mid-platform-redesign with a component library maintained by one person and no governance holding it together. The patterns were diverging. The instinct would have been to clean up the components. I went after the org model instead.',
    metrics: [
      { value: '50+',   label: 'components audited and standardized' },
      { value: '100%',  label: 'adoption across product teams' },
      { value: '2.5 yrs', label: 'pre and post-acquisition runway' },
      { value: '3',     label: 'alumni now leading at LinkedIn, TikTok, AWS' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Design Systems Lead</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Governance, system design, team building</div></div>
        <div><div class="cs-meta-label">Timeline</div><div class="cs-meta-val">2.5 years, pre and post-acquisition</div></div>
        <div><div class="cs-meta-label">Team</div><div class="cs-meta-val">2 junior designers, front-end tech lead, rotating PMs</div></div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">What was actually broken</span></div>
        <p class="cd-body">Marketo was in the middle of a significant platform redesign. The component library existed, but it was maintained by a single person with no governance process and no real authority over what entered it. Patterns were diverging across the product. Teams were making local decisions that made sense for their surface and created inconsistency everywhere else.</p>
        <p class="cd-body">The standard response to this situation is a design audit. Clean up the components, establish a style guide, ship an updated library. I didn't think that would work because it treated the symptom without touching the cause.</p>
        <div class="cs-callout cs-callout--problem">
          <div class="cs-callout-label">The actual diagnosis</div>
          <p class="cd-body">A design system maintained by one person with no governance will diverge. That's structural — physics, really. One person can't be everywhere. Without authority over what enters the system, every team becomes a de facto exception. The model that produced the components needed to change first. Fixing the model first was the only way to make sure the work didn't need to be redone in two years.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">Selling the structural fix before touching anything</span></div>
        <p class="cd-body">Before any design work started, I got buy-in from my director and the VP of Product on a different model entirely. Not "we need better components." The pitch was: we need democratized ownership, embedded accountability, and governance that gives the design org actual authority over what enters the system.</p>
        <p class="cd-body">That conversation happened before I had a single artifact to show. That was intentional. If you bring a governance proposal with a component library attached, people react to the components. If you bring the governance proposal alone, they react to the argument. The argument needed to land first.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tradeoff-label">Option A</div>
            <div class="cs-tradeoff-title">Centralized ownership</div>
            <div class="cs-tradeoff-body">One team owns the system. All contributions go through them. Consistency is high, velocity is a bottleneck. The model that was already failing — just with more people in the seat.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tradeoff-label">Option B — chosen <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tradeoff-title">Federated ownership with governance</div>
            <div class="cs-tradeoff-body">Every product team has a contributor with a stake in the system. Central governance sets standards and reviews contributions. Ownership is distributed, quality control is centralized. Adoption comes built in.</div>
          </div>
        </div>
        <p class="cd-body">The tradeoff with federated ownership: it's harder to manage. Contributors have other jobs. They're not full-time on the system, which means quality variance is a real risk. The governance layer was the answer to that — not as bureaucracy, but as a review process that gave contributors a clear bar and gave the central team real authority to hold it.</p>
        <p class="cd-body">The thing I argued most directly: if you want 100% adoption, you need 100% of teams to feel like the system belongs to them. You can't mandate that. You have to architect it.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">Building the team deliberately</span></div>
        <p class="cd-body">I was assigned two junior designers. I added a front-end tech lead and built a rotating PM model — product managers rotated in based on which component areas were in scope for their pods. That structure kept the work connected to real product needs instead of becoming a design-org-only exercise that shipped into a vacuum.</p>
        <div class="finding-block">
          <div class="finding-row">
            <div class="finding-tag">Junior designers</div>
            <div class="finding-body">The right call for execution work, and an opportunity to develop people through real systems-level work. I was responsible for vetting subsequent designers who joined. I looked for people who could think in patterns — a different skill than strong visual design.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Front-end tech lead</div>
            <div class="finding-body">Non-negotiable. A design system that engineering can't implement consistently is just a reference document. Having a technical lead embedded from the start meant components were designed with implementation in mind from day one, not retrofitted after.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Rotating PMs</div>
            <div class="finding-body">The part most people skip. Product managers rotated in based on which component areas were in scope for their pods. This kept the system tethered to actual product work. It also meant PMs had direct accountability for the components their teams would use — which made adoption a product goal too.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">04</span><span class="cs-section-title">Solving adoption before it was a problem</span></div>
        <p class="cd-body">Most design systems fight for adoption after they ship. Teams have already built things their own way. Migrating is work. The system becomes a political negotiation instead of a shared resource.</p>
        <p class="cd-body">I didn't want to have that fight. The federated model was partly a governance decision and partly an adoption strategy. When every team has a contributor with skin in the game, every team has a reason to use what comes out of it. The 100% adoption number was baked into the architecture from the start.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The specific mechanism that made it work</div>
          <p class="cd-body">Embedded evangelists. Each product pod had someone who had contributed to the system and understood it from the inside. When new components shipped, that person was an advocate who could answer questions, explain decisions, and reduce the friction of adoption at the team level. You can't document your way to that. You have to build it into the org model.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">05</span><span class="cs-section-title">The audit and the new color system</span></div>
        <p class="cd-body">Once the governance model was in place, the component work started. 50+ components audited, rationalized, and standardized. The audit surfaced the decisions that had never been made explicitly and were producing inconsistency across the product.</p>
        <p class="cd-body">Color was the clearest example. The existing palette had grown by accretion. Colors got added when someone needed them, without a system behind the choices. The audit produced a new color system built around a coherent semantic model — not just a palette, but rules for how colors were used, when, and why. That made it defensible in review and teachable to contributors who weren't color-system specialists.</p>

        <div class="cd-screenshot-wrap">
          <img src="assets/sky-brandcolor.jpeg" class="cd-screenshot" alt="App framework colors and brand color integration" />
        </div>

        <div class="cd-screenshot-wrap">
          <img src="assets/sky-primitivecolor.jpeg" class="cd-screenshot" alt="Semantic color system — red, orange, green, blue scales with usage definitions" />
        </div>

        <div class="cs-callout">
          <div class="cs-callout-label">Why the semantic layer mattered</div>
          <p class="cd-body">A color system tells you which color to use in which context and why. Without that layer, every new component becomes a judgment call, and judgment calls at scale produce drift. The semantic model gave contributors a framework to make consistent decisions without needing to escalate every choice to the central team. That's what made the governance scalable.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">06</span><span class="cs-section-title">Grounding in industry standards, which turned out to matter more than expected</span></div>
        <p class="cd-body">In building Sky, we drew heavily from the leading design systems of the time: Predix, Polaris, Lightning, Spectrum. Not because there was any awareness that an acquisition was coming — there wasn't — but because building to industry-standard patterns was the right call for a platform at Marketo's scale. Enterprise B2B software has established conventions for a reason. Working against them costs you in onboarding, in accessibility, and in credibility with technical stakeholders.</p>
        <p class="cd-body">That decision turned out to be a significant factor when Adobe acquired Marketo. The migration to Adobe's design language was less disruptive than it could have been precisely because Sky was already built on patterns that Adobe's Spectrum system recognized. That's a case where doing the right thing for the wrong-sounding reason — "just because it's good practice" — turned out to have real strategic value after the fact.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tradeoff-label">The path not taken</div>
            <div class="cs-tradeoff-title">Marketo-native patterns</div>
            <div class="cs-tradeoff-body">Build a system tailored entirely to Marketo's specific product context. Higher short-term coherence within the product, but disconnected from broader industry conventions and harder to migrate when the acquisition happened.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tradeoff-label">What we built <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tradeoff-title">Industry-grounded patterns</div>
            <div class="cs-tradeoff-body">Sky drew from Predix, Polaris, Lightning, and Spectrum. More onboarding investment up front to align contributors, but the system spoke a language the broader industry understood — including Adobe's design org.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">07</span><span class="cs-section-title">The acquisition: Sky's patterns going upstream into Spectrum</span></div>
        <p class="cd-body">Adobe acquired Marketo. The expectation would be that the acquired company's design system gets absorbed into the acquirer's. That's mostly what happened. But not entirely.</p>
        <p class="cd-body">Several Sky patterns — data visualization approaches, card treatments — found their way upstream into Spectrum, Adobe's own design language. An acquired company leaving fingerprints on the acquirer's system. That's not a common outcome, and it happened because Sky was built to a standard that Adobe's design org could recognize and evaluate on its merits, not dismiss as a legacy artifact from an acquired product.</p>

        <div class="cd-screenshot-wrap">
          <img src="assets/sky-colorpalette.jpeg" class="cd-screenshot" alt="Data visualization color system — Midnight and Twilight palettes" />
        </div>

        <div class="cd-screenshot-wrap">
          <img src="assets/sky-dataviz.jpeg" class="cd-screenshot" alt="Data visualization examples — trend reports and radar charts" />
        </div>

        <div class="cd-screenshot-wrap">
          <img src="assets/sky-dataviz2.jpeg" class="cd-screenshot" alt="Data visualization examples — cluster analysis and segmentation" />
        </div>

        <div class="cs-callout">
          <div class="cs-callout-label">What this means in practice</div>
          <p class="cd-body">The upstream contribution is evidence that the system was built with enough rigor that one of the largest design organizations in tech looked at it and said: this is better than what we have in this area. That happens with a system that has a real point of view, documented decisions, and patterns that generalize beyond the product they were built for.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">08</span><span class="cs-section-title">What the team became</span></div>
        <p class="cd-body">The designers I developed through this work went on to lead design systems and design functions at some of the most design-mature organizations in the industry. That's not incidental to the project — it's a result of it. Working on a real system, with real governance, real contributors, and real stakes is a different kind of development than working on a product feature.</p>
        <div class="alumni-row">
          <div class="alumni-card"><div class="alumni-co">LinkedIn</div><div class="alumni-role">Design systems lead</div></div>
          <div class="alumni-card"><div class="alumni-co">TikTok</div><div class="alumni-role">Design systems lead</div></div>
          <div class="alumni-card"><div class="alumni-co">AWS</div><div class="alumni-role">Design lead</div></div>
        </div>
        <p class="cd-body">I take that seriously as a measure of the work. A design system that produced three alumni at that level means the people who worked on it learned something real. That's only possible if the work itself had depth — if there were hard decisions to make, real tradeoffs to navigate, and a governance model that required people to think in systems rather than in screens.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">09</span><span class="cs-section-title">What the numbers actually mean</span></div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">100%</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">Adoption</div>
            <div class="cs-od-body">Every product team using Sky. Worth being clear about what produced this: it was an architectural decision made before the system launched. When every team has a contributor with skin in the game, adoption is a natural outcome. The 100% is the federated model working as intended.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">50+</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">Components audited and standardized</div>
            <div class="cs-od-body">The audit was the mechanism. What it actually produced: a shared vocabulary across the design org, a semantic color system, a governance process with real teeth, and a component library that contributors could extend without breaking. The 50+ number represents the scope of the problem that existed before the governance model was in place.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">2.5 yrs</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">Pre and post-acquisition runway</div>
            <div class="cs-od-body">Sky ran for 2.5 years spanning the Adobe acquisition. A design system that survives an acquisition without being immediately deprecated is a system that was built with enough rigor to be recognized on its merits. Most acquired systems don't make it. Sky not only survived but contributed patterns upstream. The 2.5 years matters because it includes the period when Adobe could have simply replaced it, and chose not to immediately.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">3</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">Alumni at LinkedIn, TikTok, AWS</div>
            <div class="cs-od-body">This is the outcome I didn't know to measure while the work was happening. You can't predict where the people you develop will go. But the fact that three of them ended up leading design systems and design functions at organizations that take design seriously tells you something about the quality of the work they did — and the environment that produced it.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">10</span><span class="cs-section-title">What I'd do differently</span></div>
        <p class="cd-body">The governance model worked, but it took longer to fully operationalize than it should have. The federated ownership concept was sound. The documentation of what that meant in practice — how contributions got reviewed, what the bar was, who had final authority on edge cases — lagged behind the system itself. That created ambiguity in the early months that I had to resolve one conversation at a time instead of by pointing to a process.</p>
        <p class="cd-body">I'd write the governance playbook first, before the first contributor joined. Not a long document — a one-pager that answered the three questions every contributor needed: what's my responsibility, how does my work get reviewed, and who has final say. That clarity would have shortened the ramp-up time considerably.</p>
        <p class="cd-body">On the upstream Spectrum contribution: I'd document the pattern decisions more rigorously in real time. Some of what we contributed worked its way into Spectrum through conversations and informal knowledge transfer rather than clean handoffs. The patterns landed, but the reasoning behind them was harder to transfer than it would have been if we'd been writing decision records as we made the decisions. That discipline would have made the contribution more durable.</p>
        <div class="cs-reflection">
          <div class="cs-reflection-title">What this was really about</div>
          <p class="cd-body">A design system is a bet on how a team will make decisions over time. The components are almost beside the point. What matters is whether the governance model produces consistent decisions at scale without requiring a central authority to weigh in on everything. Sky worked because the model worked — and the model worked because it was designed before the components were. That sequencing is the lesson. Get the org right, then build the thing.</p>
        </div>
      </div>

    `,
  },

  'meroxa': {
    company: 'Meroxa',
    headline: 'We built the right product for the wrong person. Here\'s how we figured that out.',
    intro: 'Growth stalled. The team\'s first instinct was better onboarding. My instinct was that the market assumption underneath the whole product was off. This is what happened when we followed that thread all the way down.',
    metrics: [
      { value: '10x', label: 'addressable market expansion' },
      { value: '4x',  label: 'improvement in user engagement' },
      { value: '33%', label: 'reduction in time to resource creation' },
      { value: '3',   label: 'enterprise contracts tied directly to the pivot' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Principal Product Designer</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Research, strategy, IA, design system</div></div>
        <div><div class="cs-meta-label">Partners</div><div class="cs-meta-val">VP of Product, Engineering, Exec</div></div>
        <div><div class="cs-meta-label">Duration</div><div class="cs-meta-val">~9 months (pivot + rebuild)</div></div>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/meroxa-observability.png" class="cd-hero-img" alt="Meroxa observability platform" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">What was actually going on</span></div>
        <p class="cd-body">Meroxa had a working product. Visual pipeline builder: connect a source, connect a destination, watch data flow. Clean concept, demos well, early traction. Then the growth curve went flat.</p>
        <p class="cd-body">The instinct in the room was that something was wrong with the experience. Better onboarding. Cleaner UI. Smoother first run. I had a different read after the first few research sessions: we weren&#39;t talking to the person we thought we were building for, and that wasn&#39;t a UX problem.</p>
        <div class="cs-callout cs-callout--problem">
          <div class="cs-callout-label">The uncomfortable part</div>
          <p class="cd-body">We&#39;d built the product for Data Engineers. The people actually using it and bumping against its limits were Software Engineers on production teams. Those aren&#39;t the same role. They have different mental models, different tooling expectations, and completely different anxieties. We&#39;d accidentally found a different market. The question was whether we had the nerve to acknowledge it and go there on purpose.</p>
        </div>
      </div>

      <div class="cd-screenshots-row">
        <div class="cd-screenshot-frame">
          <img src="assets/meroxa-pipelines.png" alt="Meroxa original pipeline builder" />
          <span>Pipeline builder — the original product</span>
        </div>
        <div class="cd-screenshot-frame">
          <img src="assets/meroxa-og-builder.png" alt="Meroxa connector view" />
          <span>Connector view</span>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">How I ran the research</span></div>
        <p class="cd-body">The VP of Product had started picking up on this in customer calls. I took ownership of making it rigorous: 14 sessions across active users, churned users, and prospects we re-recruited specifically to stress-test the persona assumption. I wasn&#39;t looking for feature requests. I was looking for three things.</p>
        <p class="cd-body">Who is actually reaching for this product and why &#8212; not what they say in intake surveys, but what prompted them to show up. What workarounds they&#39;d built that the product couldn&#39;t support. And what a bad Tuesday looks like for them operationally, because that&#39;s where the real job-to-be-done lives.</p>
        <div class="cs-hypothesis-block">
          <div class="cs-hyp-row">
            <span class="cs-hyp-tag assumed">Assumed</span>
            <span class="cs-hyp-body">Data Engineers building pipelines. Their job is construction. They want a visual, no-code tool so they can move faster without writing infrastructure code from scratch.</span>
          </div>
          <div class="cs-hyp-row">
            <span class="cs-hyp-tag actual">Actual</span>
            <span class="cs-hyp-body">Software Engineers on production teams. Their job is reliability. They write code already, that&#39;s not the problem. What they don&#39;t have is visibility into what&#39;s happening inside their data streams when something breaks at 2am.</span>
          </div>
          <div class="cs-hyp-row">
            <span class="cs-hyp-tag implication">Implication</span>
            <span class="cs-hyp-body">This wasn&#39;t a demographic swap. The job-to-be-done was completely different: &#34;diagnose faster&#34; rather than &#34;build faster.&#34; That one distinction changed the interaction model, the IA, the vocabulary, and the onboarding. Everything.</span>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">Taking it to leadership</span></div>
        <p class="cd-body">Research findings are only worth something if they move decisions. The VP of Product and I didn&#39;t bring this to exec leadership as a design presentation. We brought it as a business case.</p>
        <p class="cd-body">The framing was deliberate. Don&#39;t lead with &#34;our users aren&#39;t who we thought.&#34; Lead with &#34;here&#39;s the market we&#39;re currently walking past.&#34; Production engineering teams are a 10x larger addressable market than the Data Engineer segment we&#39;d been targeting. We&#39;d accidentally landed in that market with a product that couldn&#39;t serve it. A focused pivot toward a code-first developer experience, real-time observability, and multi-environment support would turn a lucky accident into a real position.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">Why the framing mattered</div>
          <p class="cd-body">Leadership was already worried about growth. The hard part wasn&#39;t convincing them something was wrong. It was giving them a path forward that felt like opportunity rather than retreat. &#34;There&#39;s a 10x market one pivot away&#34; reframes the same facts into an opportunity. That reframe was intentional, and it&#39;s what got us a yes.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">04</span><span class="cs-section-title">The call that unlocked everything else: code-first vs. visual</span></div>
        <p class="cd-body">The original product was built around drag-and-drop. The new audience didn&#39;t want that. Software Engineers are skeptical of tools that abstract away what&#39;s actually happening. They want to write code, version control their infrastructure, and know exactly what&#39;s running where. The first big design decision was whether to evolve the visual paradigm for the new user or walk away from it entirely.</p>
        <p class="cd-body">We ran two weeks of concept testing. The answer wasn&#39;t close.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">Option A</div>
            <div class="cs-tc-title">Evolve the visual builder</div>
            <div class="cs-tc-body">Add code views alongside the GUI. Let engineers toggle between visual and code representations of the same pipeline. Keep the existing mental model alive for anyone still using it.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">Option B &#8212; chosen <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Code-first, visual as secondary</div>
            <div class="cs-tc-body">Lead with the Turbine SDK. Engineers write real code, push to environments, and use the UI for observability: seeing what&#39;s running, reading logs, managing access. The GUI serves monitoring.</div>
          </div>
        </div>
        <p class="cd-body">Option A felt safer. It preserved more of what we&#39;d built. But engineers in testing kept asking the same question: &#34;which one is the source of truth?&#34; A hybrid that doesn&#39;t fully commit to either mental model serves nobody well. The visual builder wasn&#39;t wrong &#8212; it was solving the wrong problem. Keeping it on life support would have diluted both experiences.</p>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/stream-to-dag.jpg" class="cd-hero-img" alt="Directed Acyclic Graph" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">05</span><span class="cs-section-title">Rethinking the IA from scratch</span></div>
        <p class="cd-body">The original IA was pipeline-centric. Pipelines were the top-level object and everything nested under them. That made sense when the UI was the construction tool. It made no sense when the UI was the observability layer.</p>
        <p class="cd-body">For production engineers, the primary objects are environments (where things run), apps (what&#39;s running), and logs (what&#39;s happening right now). Pipelines become an implementation detail inside an app.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The principle that shaped every IA decision</div>
          <p class="cd-body">Navigate by operational concern. &#34;What&#39;s running in production and is anything wrong?&#34; should be answerable from the home state with no drilling down required. That pushed environment health, app status, and recent log activity to the top level instead of burying them three screens deep inside a pipeline detail view.</p>
        </div>
        <p class="cd-body">The DAG view was the most debated call internally. The concern: DAGs are harder to scan at a glance than linear flows. My position: the complexity was already there. We were just hiding it. Surfacing the real topology honestly &#8212; with good visual hierarchy and progressive disclosure for the details &#8212; was better than a simplified metaphor that would break down the first time an engineer encountered a real production setup. Engineers don&#39;t want you to lie to them about how their system works.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">06</span><span class="cs-section-title">Observability: the feature that wasn&#39;t really a feature</span></div>
        <p class="cd-body">Early in research I asked every production engineer the same question: what do you do when something breaks in a data stream? Same answer every time. Open terminal, pull logs, grep for errors, cross-reference with another service, hope the relevant event is still in the window. Fragmented, slow, and often requiring escalated permissions just to see anything useful.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">What we almost built</div>
            <div class="cs-tc-title">Metrics-first observability</div>
            <div class="cs-tc-body">Aggregate charts showing throughput, latency, and error rates over time. Familiar to anyone who&#39;s used Datadog or Grafana. Would have looked complete on a roadmap slide.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">What we built instead <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Log-first observability</div>
            <div class="cs-tc-body">Real-time log streaming as the primary surface. Metrics exist but they&#39;re secondary. The job was diagnosis, and logs are where diagnosis actually happens.</div>
          </div>
        </div>
        <p class="cd-body">Charts tell you something broke. Logs tell you what broke and why. When you&#39;re in an incident, you don&#39;t pull up a graph to understand it &#8212; you go straight to the logs. Building metrics-first would have looked complete on a roadmap and been useless under pressure.</p>
        <div class="cd-screenshots-row">
          <div class="cd-screenshot-frame">
            <img src="assets/meroxa-iteration.png" alt="Meroxa Iteration" />
            <span>Observability dashboard, an iteration</span>
          </div>
          <div class="cd-screenshot-frame">
            <img src="assets/meroxa-log.png" alt="Meroxa log explorer" />
            <span>Log explorer</span>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">07</span><span class="cs-section-title">The enterprise problem nobody told us about</span></div>
        <p class="cd-body">The first enterprise deals surfaced a requirement we hadn&#39;t designed for: real organizational structure. Solo developers can share one environment. A team of 20 engineers with dev, staging, and production cannot. They need isolation, role-based access, and a way for team leads to see across all environments without drowning in noise.</p>
        <p class="cd-body">We&#39;d built assuming one environment per user. Enterprise reality was three to five environments per team with overlapping ownership. The hard design problem wasn&#39;t the technical model &#8212; engineering had that mostly figured out. It was the mental model question: how does a user know which environment they&#39;re in before they touch anything? A mis-deploy to production instead of staging isn&#39;t recoverable.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The specific call that mattered most</div>
          <p class="cd-body">Persistent environment context in the top nav. The modal approach was cleaner and kept less visual clutter in the main UI. But it put environment context one click away rather than always visible. For a mistake with that severity, one click away isn&#39;t good enough. The nav stays slightly noisier. The user always knows where they are. Right tradeoff.</p>
        </div>
        <div class="cd-screenshots-row">
          <div class="cd-screenshot-frame">
            <img src="assets/meroxa-environments.png" alt="Meroxa Environments" />
            <span>Environment selection</span>
          </div>
          <div class="cd-screenshot-frame">
            <img src="assets/meroxa-common-env.png" alt="Meroxa Common Environment" />
            <span>Common environment selected</span>
          </div>
        </div>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/meroxa-app-detail.png" class="cd-hero-img" alt="App Detail Screen" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">08</span><span class="cs-section-title">Design system as the thing that kept us from falling apart</span></div>
        <p class="cd-body">The pivot compressed everything. We were redesigning core IA, building new interaction patterns, and supporting a completely different user mental model &#8212; simultaneously, with a small team, on a startup timeline.</p>
        <p class="cd-body">The Yoshi design system work wasn&#39;t a separate track. It was what kept the pace from collapsing into chaos. Component patterns for log display, environment switching, and DAG visualization got built once and reused across every new surface. Without those building blocks, every screen would have required from-scratch decisions about density, type scale, and information hierarchy.</p>
        <p class="cd-body">The tradeoff I navigated: velocity vs. consistency. Under pressure the temptation is to one-off components &#8212; ship something that works for this screen right now and reconcile later. I pushed against that every time, because &#34;later&#34; almost never comes at an early-stage startup, and a fragmented component library accrues design debt faster than anything else. Slightly more time on each component upfront meant every subsequent screen moved faster. That math is always right.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">09</span><span class="cs-section-title">What the numbers actually mean</span></div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">10x</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Addressable market</div>
            <div class="cs-od-body">Worth being precise: this was a pre-pivot projection, not a post-pivot measurement. We sized the production engineering segment against our original Data Engineer TAM using analyst data and our own customer data. The 10x figure shaped the business case. I include it because I helped generate it, and because there&#39;s a real difference between &#34;design produced good outcomes&#34; and &#34;design helped identify a strategic opportunity.&#34; This was the second thing.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">4x</div>
          <div class="outcome-detail">
            <div class="cs-od-title">User engagement</div>
            <div class="cs-od-body">Sessions per active user per week, 90 days post-pivot vs. 90 days pre-pivot. The hypothesis was that stronger product-market fit shows up as more frequent, longer sessions. It did. What I can&#39;t cleanly separate: how much came from the new user persona vs. the new feature set. Honest answer is both, and the data doesn&#39;t let me split them cleanly.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">33%</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Time to resource creation</div>
            <div class="cs-od-body">Task-based usability tests, consistent scenario (deploy an app, check its logs, add a collaborator), before and after the redesign, 12 participants. The prior flow required 4 screens. The redesign reduced it to 2. 33% faster on average. Controlled population, controlled scenario. This is the number that holds up.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">3</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Enterprise contracts</div>
            <div class="cs-od-body">Three enterprise deals in the first two quarters post-pivot where the account team cited multi-environment support as a deciding factor. Sales attribution is always imprecise. I include it because it represents the specific intersection of the strategic repositioning and the organizational account model I designed. It closed deals. That counts.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">10</span><span class="cs-section-title">What I&#39;d do differently</span></div>
        <p class="cd-body">The pivot worked. We were slower to it than we should have been.</p>
        <p class="cd-body">The signal that the assumed market was wrong existed in early research. It was there in how users described their workflows and in the workarounds they&#39;d already built. We spent several months improving the existing product experience before stepping back to ask whether we were building for the right person at all. That&#39;s a question that should be in the research cadence from day one &#8212; not just &#34;are users happy&#34; but &#34;does the person using this match the person we designed for.&#34; Different question. Needs to be asked on purpose.</p>
        <p class="cd-body">On observability specifically: I made the right call going log-first, but I made it two weeks too late. The metrics-first direction got design work before we killed it. If I&#39;d done the job-level research before any scoping conversation started, I would have landed at log-first from the beginning. The lesson is simple and I&#39;ve carried it since: understand the job before you touch the scope. Not during. Before.</p>
        <div class="cs-reflection">
          <div class="cs-reflection-title">The real job</div>
          <p class="cd-body">This project wasn&#39;t about making the product more usable. It was about catching the moment when a research finding becomes a business decision and being ready to make that handoff clearly. That means being willing to say something uncomfortable and having enough strategic context to turn it into a path forward. The design that followed was only possible because that framing happened first. When research changes the direction of a company, that&#39;s the job at its highest level.</p>
        </div>
      </div>

    `,
  },
  'marketo-migration': {
    company: 'Marketo / Adobe',
    headline: '733% adoption increase. The product was ready. Users weren\'t — and that was a design problem.',
    intro: 'Sky had been in development for years. The platform was better. The investment was massive. And fewer than 600 users had opted in. The VP of Product and CPO assembled a task force. The product was ready. Nobody had designed the transition.',
    metrics: [
      { value: '733%', label: 'Increase in user adoption' },
      { value: '600 to 5K+', label: 'Opt-ins before and after' },
      { value: 'Q1 2020', label: 'Shipped on schedule' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Lead Product Designer, Group Lead</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Research, strategy, migration design, workshop facilitation</div></div>
        <div><div class="cs-meta-label">Team</div><div class="cs-meta-val">2 designers, 2 PMs, 1 researcher</div></div>
        <div><div class="cs-meta-label">Timeline</div><div class="cs-meta-val">3 months</div></div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">Why a better product wasn&#39;t enough</span></div>
        <p class="cd-body">Marketo&#39;s Classic platform had been the operating environment for thousands of marketing teams since 2008. Sky was years in the making &#8212; a full redesign of the technology stack and user experience. By the time I was pulled onto this effort, Sky was substantially built. The design team had grown from six to twelve people under my tenure. The investment was enormous.</p>
        <p class="cd-body">And fewer than 600 users had opted in.</p>
        <p class="cd-body">The instinct from leadership was to push harder on awareness, maybe force the migration. My read after the first round of research was different: the product being better wasn&#39;t the problem. The transition being undesigned was the problem. Users weren&#39;t resistant to Sky specifically &#8212; they were resistant to disruption of workflows they&#39;d been running on for five-plus years with business-critical data. That&#39;s a rational response, not an irrational one. And it required a different solution than better marketing.</p>
        <div class="cs-callout cs-callout--problem">
          <div class="cs-callout-label">The real risk on the table</div>
          <p class="cd-body">Low adoption wasn&#39;t just a UX metric. It was a business risk: the ROI case for the entire Sky redesign investment depended on users actually moving to it. If adoption stayed under 600, years of engineering and design work would depreciate against a user base that never showed up. The CPO was involved for a reason. This was a company-level problem dressed up as a product problem.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">What research actually surfaced</span></div>
        <p class="cd-body">We interviewed 13 users &#8212; a mix of power users (Champions) and typical users. I also ran competitive analysis on how other enterprise platforms had handled similar transitions, specifically looking for what Salesforce, Asana, Pendo, and Amplitude did differently.</p>
        <p class="cd-body">What the research surfaced wasn&#39;t primarily a feature parity problem, though that was real. It was a trust problem.</p>
        <div class="finding-block">
          <div class="finding-row">
            <div class="finding-tag">Trust damage</div>
            <div class="finding-body">Previous negative experiences with Sky had left lasting resistance. Users who&#39;d tried Sky early, hit incomplete features, and retreated to Classic weren&#39;t neutral anymore &#8212; they were actively skeptical. Rebuilding that trust required transparency and user control.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Workflow anxiety</div>
            <div class="finding-body">The anxiety wasn&#39;t about learning a new UI. It was about making mistakes with business-critical data during the learning curve. Marketing workflows at this level &#8212; campaign automation, lead management, reporting &#8212; don&#39;t have room for errors.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Parity gaps</div>
            <div class="finding-body">Feature parity between Classic and Sky was incomplete in enough areas that users couldn&#39;t commit fully to Sky without maintaining Classic access as a fallback. Any migration strategy had to account for an incomplete product, not assume completion first.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Familiarity over aesthetics</div>
            <div class="finding-body">Across every session, users expressed clear preference for Classic navigation even while acknowledging Sky&#39;s visual improvements. Familiarity wasn&#39;t nostalgia &#8212; it was efficiency. Users had years of muscle memory invested in Classic.</div>
          </div>
        </div>
        <div class="cs-callout">
          <div class="cs-callout-label">The competitive analysis finding that shaped the strategy</div>
          <p class="cd-body">Salesforce&#39;s Classic to Lightning migration is the canonical enterprise platform transition. The lesson: forced migration with an incomplete feature set produces backlash that takes years to recover from. Pendo and Amplitude&#39;s phased, modular approaches produced steadier adoption curves with less resistance. The pattern was clear &#8212; user control over timing, combined with progressive enhancement, outperformed any version of forced migration.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">Four options, one winner</span></div>
        <p class="cd-body">I led workshops to evaluate four distinct migration approaches before any design work started. The point was to genuinely stress-test each option against the research findings and force explicit tradeoffs into the open before we committed to a direction.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card rejected">
            <div class="cs-tc-label">Option 1 <span class="cs-reject-badge">rejected</span></div>
            <div class="cs-tc-title">Complete migration</div>
            <div class="cs-tc-body">Finish Sky entirely before transitioning any users. Clean from a product standpoint, but required full feature parity first. Timeline was unacceptable &#8212; adoption crisis couldn&#39;t wait for complete parity.</div>
          </div>
          <div class="cs-tradeoff-card rejected">
            <div class="cs-tc-label">Option 2 <span class="cs-partial-badge">partial</span></div>
            <div class="cs-tc-title">Functional-level switching</div>
            <div class="cs-tc-body">Allow switching between complete functional areas (email, campaigns, reporting). Viable in concept but required significant resource reallocation to reach functional completeness across enough areas.</div>
          </div>
          <div class="cs-tradeoff-card rejected">
            <div class="cs-tc-label">Option 3 <span class="cs-partial-badge">partial</span></div>
            <div class="cs-tc-title">Feature-level switching</div>
            <div class="cs-tc-body">Enable switching on individual ready features while keeping Classic access. More granular than Option 2. The risk: too granular creates a confusing, fragmented experience with no coherent narrative for users.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">Option 4 <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Merge and blend</div>
            <div class="cs-tc-body">Phased hybrid: keep Classic navigation while introducing ready Sky features into the main interface. Gradually align visuals, then transition navigation once parity is achieved. Users experience improvement without disruption.</div>
          </div>
        </div>
        <p class="cd-body">The reason merge and blend won wasn&#39;t that it was the most elegant solution &#8212; it wasn&#39;t. Running two systems in parallel is expensive to maintain and complex to communicate. It won because it was the only option that addressed the actual barrier: trust. Users needed to experience Sky improving their work before they&#39;d commit to it.</p>
        <p class="cd-body">The explicit tradeoff we accepted: engineering and design complexity. Maintaining Classic navigation while gradually introducing Sky meant more states to manage, more edge cases, and a longer period of dual-system support. I made the case that this complexity was the cost of addressing a trust problem correctly rather than a technical problem incorrectly.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">04</span><span class="cs-section-title">The four-phase rollout</span></div>
        <p class="cd-body">Merge and blend wasn&#39;t a single design decision &#8212; it was a sequenced strategy with distinct phases, each with a specific job to do. The sequencing mattered as much as the phases themselves.</p>
        <div class="sprint-block">
          <div class="sprint-row">
            <div class="sprint-label">Phase 1: Hybrid interface</div>
            <div class="sprint-body">Classic navigation stays. Ready Sky features surface in the main interface. Users get improvements without any navigation disruption. This is where trust starts to rebuild &#8212; Sky demonstrating value inside a familiar environment.</div>
          </div>
          <div class="sprint-row">
            <div class="sprint-label">Phase 2: Visual alignment</div>
            <div class="sprint-body">Sky&#39;s visual design gradually introduced to Classic navigation. Users start associating the new aesthetic with familiar patterns. Preparing for navigation change without triggering it yet.</div>
          </div>
          <div class="sprint-row">
            <div class="sprint-label">Phase 3: Nav transition</div>
            <div class="sprint-body">Classic navigation replaced with Sky navigation once feature parity is achieved. By this point users have been working with Sky features for weeks or months. The navigation change lands on a foundation of trust.</div>
          </div>
          <div class="sprint-row">
            <div class="sprint-label">Phase 4: Full Sky</div>
            <div class="sprint-body">Complete Sky experience delivered. Classic fully deprecated. The transition is complete, but users arrived here through choice and incremental familiarity, every step earned.</div>
          </div>
        </div>
        <div class="cs-callout">
          <div class="cs-callout-label">The sequencing principle that everything depended on</div>
          <p class="cd-body">Each phase had to earn the next one. Users needed to experience Sky as better before they&#39;d accept Sky as their navigation. Navigation as their anchor before they&#39;d accept full Sky as their home. The order wasn&#39;t arbitrary &#8212; it was designed to follow the order in which trust actually rebuilds.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">05</span><span class="cs-section-title">The key design decisions inside the strategy</span></div>
        <p class="cd-body">The strategy was the hard part. The implementation had its own tradeoffs worth documenting.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">Considered</div>
            <div class="cs-tc-title">Forced migration with rollback</div>
            <div class="cs-tc-body">Move all users to Sky by default, with Classic available as a rollback option. Faster path to full adoption on paper. In practice, users who&#39;d already lost trust in Sky would exercise the rollback immediately and never return.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">Chosen <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Opt-in with progressive defaults</div>
            <div class="cs-tc-body">Users choose when to try Sky features. Features become Sky-default as they reach readiness. Admin controls let organizations enable Sky preview for their teams. Control stays with users throughout.</div>
          </div>
        </div>
        <p class="cd-body">The opt-in model felt slower. It was. The alternative was faster in the short term and would have produced a trust collapse in the medium term. Users who feel forced into a platform they don&#39;t trust don&#39;t adapt &#8212; they escalate to their admins, file support tickets, and generate noise that slows adoption for everyone else.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">Considered</div>
            <div class="cs-tc-title">Single entry point to Sky</div>
            <div class="cs-tc-body">One clear path for users to discover and try Sky. Simpler to design and communicate. But puts all adoption eggs in one basket &#8212; if users miss or ignore that entry point, there&#39;s no recovery mechanism.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">Chosen <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Multiple discovery pathways</div>
            <div class="cs-tc-body">Sky preview widget in My Marketo. Periodic gentle nudges for opted-out users. Admin-level enablement. Feature-specific entry points. Different users discover Sky through different paths &#8212; meeting them where they are rather than forcing them to find a single door.</div>
          </div>
        </div>
        <p class="cd-body">The multiple pathways decision came directly from the Champions interviews. Power users wanted feature-level discovery. Typical users wanted a simpler, guided path. Designing one entry point would have served one of those users and frustrated the other.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">06</span><span class="cs-section-title">Validation before commit</span></div>
        <p class="cd-body">Before anything shipped, I ran validation sessions with 13 users &#8212; same split of Champions and typical users as the discovery phase. The specific thing I was testing wasn&#39;t &#34;do users like this&#34; &#8212; it was &#34;does the merge and blend approach actually reduce the anxiety that research identified as the primary barrier?&#34;</p>
        <p class="cd-body">Champions were unanimous in their preference for merge and blend in the forum session. The specific finding that shaped final decisions: users wanted experience toggles to remember their last state. A toggle that resets to default every session creates cognitive overhead every session. State persistence was a prerequisite for the opt-in model to feel like genuine control rather than a daily choice tax.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The validation finding I didn&#39;t expect</div>
          <p class="cd-body">Users consistently preferred Classic navigation during the transition even when they acknowledged Sky looked better. That confirmed the research finding about familiarity, but the strength of the preference surprised me. It recalibrated how aggressively to sequence Phase 2 and Phase 3. We slowed down the visual alignment phase specifically because of this &#8212; users needed more time in Phase 1 than the original timeline assumed.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">07</span><span class="cs-section-title">What the outcomes actually mean</span></div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">733%</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">Adoption increase</div>
            <div class="cs-od-body">From fewer than 600 opt-ins to 5,000+ after launch. Worth contextualizing: this is opt-in adoption, not total user base. The 5,000+ represents users who actively chose to try Sky &#8212; which, given the trust problem we started with, is a more meaningful signal than forced migration numbers would have been.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">Q1 2020</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">On-schedule launch</div>
            <div class="cs-od-body">Three months from task force assembly to shipped switching experience. The merge and blend approach added engineering complexity. The reason it shipped on time: the option evaluation workshops happened early, the direction was committed to quickly, and the phased model meant we weren&#39;t trying to ship everything at once.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">1</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">Cross-functional process improvement</div>
            <div class="cs-od-body">The work prompted formalization of Product Requirement Documentation across the org &#8212; a process artifact that outlasted the project. The migration effort exposed communication gaps between design, product, and research that the PRD process was built to address.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">08</span><span class="cs-section-title">What I&#39;d do differently</span></div>
        <p class="cd-body">The phased timeline was adjusted mid-project based on validation feedback &#8212; users needed more time in Phase 1 than originally planned. That was the right call, but it was reactive. If I&#39;d weighted the familiarity finding more heavily in the initial timeline, the adjustment would have been built in rather than bolted on.</p>
        <p class="cd-body">On the measurement side: we tracked opt-ins clearly, but we didn&#39;t instrument engagement depth within Sky post-adoption. Getting a user to opt in and getting a user to actually do meaningful work in Sky are different things. I&#39;d push for active usage instrumentation alongside opt-in tracking from day one.</p>
        <p class="cd-body">The process improvement &#8212; the PRD formalization &#8212; happened as a consequence of this project rather than as an intentional design. Looking back, the communication gaps we discovered were visible in the early workshops. I could have raised them explicitly to leadership during the project rather than letting the solution emerge organically afterward.</p>
        <div class="cs-reflection">
          <div class="cs-reflection-title">What this project was really testing</div>
          <p class="cd-body">Enterprise users don&#39;t resist change because they&#39;re stubborn. They resist it because their workflows carry real business risk and they&#39;ve learned &#8212; often through bad experiences &#8212; that platform transitions are where things break. The design challenge here wasn&#39;t making Sky better. Sky was already better. It was making the path to Sky feel safe enough that users would take it. Trust is a design problem. It responds to design solutions. That&#39;s what this project proved.</p>
        </div>
      </div>

    `,
  },
};

// ── Thought articles ────────────────────────────────────────────
const THOUGHTS = {
  'charlie-murphys-law': {
    kicker: 'Thoughts',
    title:  "Charlie Murphy's Law",
    hero: {
      src: 'assets/charlie.jpeg',
      alt: "Charlie Murphy's Law — article image",
      w:   1500,
      h:   900,
    },
    dek: "Habitual Line-Steppers — on the surprises product design keeps in its back pocket, and the only thing that really matters when one of them lands.",
    sections: [
      {
        paragraphs: [
          "Surprises in product design come in a few flavors. There are the ones you bring on yourself by not staying close enough to your PM or Engineering. There are the last minute asks that appear from nowhere. And then there's the category that gets you even when you're doing everything right, in lockstep with your team, following the process, checking every box. Those ones hit different. They almost always feel like a punch to the face a la Charlie Murphy via Rick James. The habitual line-steppers of Product Design.",
          "The Marketo Sales Insight redesign had been going well. I'd done the due diligence. Vetted the design with customers, confirmed feasibility with Engineering, met acceptance criteria with my PM. Got buy-in from the VP of Product with high fives all around. T'was a good day. Handoff happened and all was lovely.",
          "Until standup.",
          "The Engineering team in Ukraine had flagged something. Salesforce's VisualForce specs had a height constraint the Engineers hadn't accounted for. I had designed a panel somewhere between 700 and 800 pixels tall. VisualForce allows 400. Max.",
          "Keeping the freak-out quiet, I got back into the design. My PM and I worked through it together, the two of us figuring out what could be reduced, what could move, and what had to go altogether. That collaboration mattered. I could have spiraled alone. Instead we problem-solved our way back to something that worked, and the high fives resumed.",
          "The response to the surprise was the whole thing.",
        ],
      },
    ],
  },

  'navigating-ambiguity': {
    kicker: 'Thoughts',
    title:  'Navigating Ambiguity',
    hero: {
      src: 'assets/karl.jpeg',
      alt: 'The Golden Gate Bridge emerging from a thick blanket of fog over the bay',
      w:   1366,
      h:   768,
    },
    dek: "Ambiguity isn\u2019t just one thing. How you navigate it depends on what kind you\u2019re actually in \u2014 and confusing the types is how teams end up solving the wrong problem with confidence.",
    sections: [
      {
        paragraphs: [
          "Ambiguity isn\u2019t just one thing. It\u2019s shapeless. How you navigate it depends on what kind you\u2019re actually in, and confusing the types is how teams end up solving the wrong problem with confidence. Full-chest confidence.",
          "The way I think about it: there\u2019s fog where you don\u2019t know the destination, and fog where you know the destination but can\u2019t see the path. Both require you to move carefully and stay close to what\u2019s in your proximity. But they demand different orientations from the start.",
        ],
      },
      {
        heading: 'When the destination is unknown',
        paragraphs: [
          "The Teamshares Leadership ATS started as a surface ask: build a system to curate a queue of qualified Network Presidents. Simple enough on its face. But Teamshares had roughly 80 acquired companies at the time, some Presidents were covering two companies at once, and executive hiring typically runs two to six months. The pressure was real before we wrote a single spec.",
          "Every conversation revealed something the last one didn\u2019t. Recruiters were managing candidates across Lever, spreadsheets, and email chains with no centralized workflow and no consistent way to track where anyone stood. There was no stage vocabulary. No visibility. The ask was \u201cbuild an ATS\u201d but the actual problem was that nobody could see what was happening or move with confidence.",
          "The real work was figuring out what we were actually building before building it.",
          "In that kind of fog you only know what\u2019s in your proximity. You take your steps, learn what\u2019s there, and let that inform the next ones. The destination reveals itself through the process.",
        ],
      },
      {
        heading: 'When the destination is known but the path isn\u2019t',
        paragraphs: [
          "The Marketo Sales Insight redesign was a different kind of ambiguous. The ask was to rekindle good faith between Marketo and their customers around a plugin that hadn\u2019t been touched since its original launch in the mid-2000s. We knew what success looked like emotionally, restored trust, but had no idea what it looked like in the product.",
          "In sessions with my PM and tech lead, we kept pushing on one question: what are customers actually trying to accomplish when they open this? Validation interviews gave us a clear answer. They weren\u2019t interested in a redesign for its own sake. They wanted recency and frequency of lead activity, surfaced quickly and reliably. That became the anchor for every decision that followed, and the product we shipped reflected that clarity back to customers in a way the original never had.",
          "The fog lifted not through exploration but through focus.",
        ],
      },
      {
        heading: 'The work before the work',
        paragraphs: [
          "Both of these started with someone handing me something underspecified and expecting a solution. What I\u2019ve learned is that the quality of the problem definition almost always determines the quality of the outcome. No matter the type of fog you find yourself in, getting the approach right is the work before the work, and it\u2019s where the most valuable design thinking happens.",
        ],
      },
    ],
  },

  'growing-leaders': {
    kicker: 'Thoughts',
    title:  'Growing leaders',
    hero: {
      src: 'assets/growth.jpg',
      alt: 'A seedling growing toward sunlight',
      w:   800,
      h:   534,
    },
    dek: "On the quiet work of helping people find their direction — and why the real legacy isn't the projects or the pixels.",
    sections: [
      {
        paragraphs: [
          "Mentorship didn't start as a title or a goal. It started with people just hitting me up — asking for advice, a little direction, maybe a sounding board.",
          "Those were the first seedlings — the people I helped first. I listened, offered what I knew. Sometimes I just reminded them they already were what they sought to be.",
        ],
      },
      {
        paragraphs: [
          "One story sticks with me. An aspiring creative director, talented but hitting a ceiling, feeling like he might give up on design altogether. The story is richer and more complex, but I'll keep it simple here. We talked, and I introduced him to user-centered design — a whole new way of thinking and creating. Just like my director at Gibson Guitar did for me. Today, he's thriving as a Principal Designer at Microsoft. Watching that transformation — from doubt to purpose — is what mentorship is about.",
          "Over time, that quiet tending grew into something bigger. Designers I mentored early on now lead design systems at TikTok, build developer tools at AWS, direct university design programs, head teams at Adobe, and serve as principals at Microsoft.",
          "One still calls me dalao — a term from Mandarin slang meaning \"big brother.\" It's not about hierarchy. It's respect mixed with a little gratitude. A nod to someone who was there when it mattered.",
        ],
      },
      {
        heading: "Mentorship isn't management. It's gardening.",
        paragraphs: [
          "You don't force growth. You clear the weeds. Loosen the soil. Protect fragile sprouts. At Marketo, I built a team from scratch — hiring young designers full of promise, tripling the research team, even hiring my own director. But more than building org charts, I was tending people. Helping them find the sunlight they needed. All while the very director I had a hand in hiring gave me the space to grow and thrive.",
        ],
      },
      {
        heading: "Growth is theirs, not mine. And that's the point.",
        paragraphs: [
          "They do the heavy lifting. They face the struggles, the questions, the doubt. I'm just a gardener — steady and patient, offering support and space. Sometimes a gentle nudge or the right question. Other times, just quiet presence.",
          "Most days, it's slow and unseen work. But years later, a message arrives. A thank you. A recognition.",
          "That's the real legacy. Not the projects or pixels. The people.",
        ],
      },
      {
        heading: "I still love designing — always will.",
        paragraphs: [
          "But if you ask what I'm proudest of,\nit's the garden I've been lucky enough to tend.\nThe growth I helped nurture.",
          "And I'd do it all again.",
        ],
      },
    ],
  },

  'spongebob-would': {
    kicker: 'Thoughts',
    title:  'Squidward would never. SpongeBob would.',
    hero: {
      src: 'assets/spongebob.jpeg',
      alt: 'SpongeBob and Squidward in a fish costume — article image',
      w:   1920,
      h:   1080,
    },
    dek: "On why the weird, metaphor-happy sketches almost always beat the sensible ones — and why I keep betting on SpongeBob over Squidward.",
    sections: [
      {
        // intro run — no heading, reads as the opening of the piece
        paragraphs: [
          "Squidward is the designer who's seen it all. Too experienced to be surprised. Too \"sensible\" to chase anything that might not scale. His process is efficient, his feedback is brutal, and his best ideas are three versions behind him.",
          "SpongeBob, though? He's the one sketching fish with arms just to see what happens. Clicking every button in the prototype, narrating the user journey like it's a Broadway show. He's annoying. He's relentless. He's probably onto something.",
          "If you've been in this field long enough, you've got a little of both in you.",
          "But the longer I've been doing this, the more I think: SpongeBob gets the better ideas.",
        ],
      },
      {
        heading: 'Play is professionalism',
        paragraphs: [
          "Somewhere along the way, \"playfulness\" got turned into a design aesthetic—rounded corners, pastel gradients, kawaii characters, and the occasional microinteraction that spins before it lands.",
          "That's not what I mean.",
          "SpongeBob-level play is how you approach the work. It's about curiosity. Lightness. Movement. Willingness to try the thing that might not work because something about it feels interesting.",
          "Squidward would rather not. He doesn't want to waste time. He's been burned by too many brainstorms that led nowhere, too many stakeholders who said \"cute, but no.\"",
          "But here's the thing: Squidward is rarely surprised. SpongeBob is, constantly. And in design, surprise is a feature.",
        ],
      },
      {
        heading: 'How the TV Guide happened',
        paragraphs: [
          "In a recent project for Adobe Sales Insights, we were trying to help sales reps understand buyer behavior—who was doing what, when, and why it mattered.",
          "The expected solution was… exactly what you'd expect. Tables, calendars, maybe a feed. All reasonable. All very Squidward.",
          "But that didn't sit right.",
          "So I sketched something dumb: a TV Guide.",
          "Not literally, but close. Blocks of scheduled behavior, horizontal rhythm, a visual metaphor pulled from old cable interfaces. A completely unserious reference applied to a very serious tool.",
          "And it worked.",
          "The TV Guide reframed the conversation. It helped the team—designers, salespeople, even execs—understand the pacing of buyer intent like a schedule you could tune into. It made behavior feel broadcastable. It turned noise into programming.",
          "It was weird. It was fun.\nSpongeBob would.",
        ],
      },
      {
        heading: 'Play breaks sameness',
        paragraphs: [
          "A lot of \"serious\" design processes are really just safe.",
          "Squidward knows what the pattern library says. He knows the system constraints. He builds what's been proven. He optimizes.",
          "SpongeBob plays.",
          "He breaks things early and often. He follows an idea until it collapses, then glues it back together just to see what happens. He mocks up things no one asked for. Half of it is nonsense. The other half contains seeds that become the final solution.",
          "And honestly? It's usually the stuff no one asked for that shifts the work from fine to right.",
        ],
      },
      {
        heading: 'Play is structure, too',
        paragraphs: [
          "This doesn't mean chaos. SpongeBob is just open.",
          "Real play happens within structure. That's what makes it meaningful. Boundaries make the choices sharper.",
          "In practice, this might look like:",
          { list: [
            "Setting aside a sprint for weird ideas that break the model",
            "Prototyping metaphors instead of screens",
            "Asking \"what would make this fun for the user to experience?\"",
            "Letting the new hire own the risky concept",
            "Laughing in the design review because someone snuck in an idea shaped like a sea cucumber, and it's actually pretty good",
          ] },
          "You still ship. You still measure. But you get there with a little more air in the process.",
        ],
      },
      {
        heading: "Squidward is useful. He's just not where the ideas start.",
        paragraphs: [
          "There's a time and place for structure, critique, pruning. That's where Squidward shines. You need him to stress-test the ideas, poke holes, trim fat.",
          "But if he shows up too early, party done.",
          "SpongeBob, on the other hand, doesn't worry about looking smart. He's not trying to impress anyone. He just wants to know what happens if you move the button here or name the feature that or explain the concept with a metaphor from children's TV.",
          "And in my experience, that's where the real ideas tend to live—in the playful sketches you almost deleted.",
        ],
      },
      {
        heading: 'So what?',
        paragraphs: [
          "I'm not saying every design project needs to feel like Saturday morning cartoons.",
          "But when work becomes too serious too fast, it collapses under its own weight. When we forget how to play, we forget how to see.",
          "So yeah—Squidward might roll his eyes. But I'll keep choosing SpongeBob.",
          "Because SpongeBob prototypes the weird thing.\nSpongeBob uses metaphors no one asked for.\nSpongeBob asks the dumb question that unlocks the actual insight.",
          "And SpongeBob gets to the better work.",
        ],
      },
    ],
  },
  'design-systems-that-last': {
    kicker: 'Point of View',
    title:  'What I\u2019ve learned building design systems that last',
    dek: 'On governance, breaking patterns intentionally, and why the org chart matters more than the component library.',
    sections: [
      {
        paragraphs: [
          'Design systems are easy to start. The hard part is keeping them alive two years later, when the original team has turned over, the product has outgrown half the components, and three teams are quietly forking the button because \u201Cour use case is different.\u201D',
          'I\u2019ve built systems from scratch, inherited systems mid-drift, and watched good systems die slow deaths from neglect. The lessons that stuck have almost nothing to do with tokens or components. They\u2019re about people, governance, and knowing when the system should bend.',
        ],
      },
      {
        heading: 'The org chart is the real architecture',
        paragraphs: [
          'Every design system inherits the shape of the organization that builds it. If the org is siloed, the system will be fragmented. If the org has unclear ownership, the system will have inconsistent adoption. You can have the cleanest component library in the world and still fail if the team structure doesn\u2019t support it.',
          'At Marketo, when I founded Sky, one of the first things I did was audit how teams were organized \u2014 not how components were organized. Who owned what surfaces? Who made decisions about shared patterns? Where did authority actually live versus where the org chart said it lived?',
          'That mapping told me more about what the system needed than any component audit ever could. The components came later. The governance model came first.',
        ],
      },
      {
        heading: 'Governance is a habit',
        paragraphs: [
          'The worst design systems I\u2019ve seen have beautiful governance documents that no one follows. The best ones have almost no documentation about governance, but everyone knows how decisions get made because the process is embedded in how the team already works.',
          'With Sky, I democratized governance deliberately. Designers across product teams could propose patterns, challenge existing ones, and contribute directly. A federated model where ownership was distributed but standards were shared — replacing the bottleneck of a centralized request queue.',
          'That\u2019s harder than it sounds. Federated governance means you need clear principles people can apply independently. You need to trust that a designer on the campaign tools team can make a sound call about a pattern without escalating it. And you need to be comfortable with the fact that sometimes they\u2019ll make a different call than you would \u2014 and that\u2019s fine, as long as the reasoning holds.',
          'The 50+ component audit was about establishing a shared vocabulary. Once everyone could name the same pattern the same way, contribution became natural instead of forced.',
        ],
      },
      {
        heading: 'Break patterns on purpose',
        paragraphs: [
          'Consistency is the point of a design system, right up until it isn\u2019t.',
          'The biggest mistake I see in mature systems is treating consistency as an absolute. It\u2019s a default. And defaults should be broken when there\u2019s a good enough reason \u2014 but only when the break is intentional, documented, and reversible.',
          'At Marketo, there were moments where the right design for a specific product surface didn\u2019t fit the system. The temptation is always to force it \u2014 reshape the design to match the components. But sometimes the design is right and the system needs to stretch. The question is \u201Cshould it?\u201D',
          'The distinction matters. Drift is when teams break patterns because they don\u2019t know the pattern exists, or because it\u2019s easier to build custom. Intentional deviation is when a team breaks a pattern because the user\u2019s context demands it, and they document why. One erodes the system. The other strengthens it, because now you have a signal about where the system needs to grow.',
        ],
      },
      {
        heading: 'Cross-product cohesion is a design problem',
        paragraphs: [
          'Components alone don\u2019t create cohesion. You can ship the same button, the same card, the same modal to every product surface and still end up with experiences that feel nothing alike.',
          'Cohesion comes from shared interaction patterns, consistent information hierarchy, predictable navigation models, and aligned mental models across products. Those are design decisions.',
          'This is where systems thinking pays off. Before touching any surface, I study how the pieces connect \u2014 not just within a product, but across them. How does a user\u2019s mental model shift when they move from one tool to another? Where do workflows cross product boundaries? Those seams are where cohesion either lives or dies.',
          'At Marketo, the system\u2019s real value was that a user could move between products and feel like they were still in the same world. That\u2019s harder than matching hex values.',
        ],
      },
      {
        heading: 'Adoption is a design problem too',
        paragraphs: [
          'Getting to 100% adoption on Sky took a campaign. I treated internal adoption the same way I\u2019d treat a product launch. Who are the users (in this case, designers and engineers)? What are their objections? Where\u2019s the friction in adoption? What does the onboarding experience look like?',
          'Most systems fail at adoption because they optimize for the system and forget about the people using it. Engineers don\u2019t care that your tokens are semantically named if the DX is painful. Designers won\u2019t use the Figma library if the component naming doesn\u2019t match how they think about the UI.',
          'Adoption is the design problem hiding inside every design system.',
        ],
      },
      {
        heading: 'What I\u2019d bring to a platform team',
        paragraphs: [
          'If you\u2019re building a design system at a company with multiple product surfaces, complex workflows, and teams that need to move fast without breaking each other\u2019s work \u2014 that\u2019s the exact problem I\u2019ve spent the last decade learning how to solve.',
          'I think in systems before I think in screens. I care about governance as much as I care about components. I\u2019ve shipped systems that achieved full adoption not because they were mandated, but because they were genuinely better than the alternative.',
          'And I believe the best design systems are culture \u2014 a shared language that lets teams build coherently without coordinating on every detail.',
          'That\u2019s the kind of work I\u2019m built for.',
        ],
      },
    ],
  },

  'financial-platforms-systems-problems': {
    kicker: 'Point of View',
    title:  'Why financial platforms are systems problems',
    dek: 'On fragmentation, dual personas, and what payroll across 90+ companies taught me about designing for money that moves.',
    sections: [
      {
        paragraphs: [
          'Financial products tend to start as individual tools. A card program here, an expense workflow there, bill pay in one system, travel booking in another. Each one solves its slice well enough. But the moment you try to connect them, the seams show.',
          'I\u2019ve spent the last few years designing platforms where financial data sits at the center. The pattern keeps repeating: the design problem that matters most lives in the connections between surfaces.',
        ],
      },
      {
        heading: 'Fragmentation is the default',
        paragraphs: [
          'Most companies run their spend across five or six tools. Each tool has its own data model, its own approval flow, its own reporting structure. Finance teams spend hours reconciling across systems because the data was never meant to talk.',
          'At Teamshares, I saw this firsthand. Payroll data lived in disparate systems across 90+ companies. Industry Leads had no centralized visibility into payroll health. Analyses were delayed three to five days by manual processes. The original ask was to make reports easier to generate, but through discovery we found the data architecture couldn\u2019t support real-time visibility at scale.',
          'We reframed the project from "better reports" to "centralized visibility." That reframe changed every design decision downstream, and the result was a 50% increase in team productivity and 135 hours saved per cycle.',
          'When you solve for the connections first, the individual surfaces get simpler. Data flows through instead of getting stuck at the boundaries.',
        ],
      },
      {
        heading: 'Two users, one workflow',
        paragraphs: [
          'The hardest tension in financial platform design is that every workflow serves two users with opposing needs. The employee wants speed and minimal friction. The finance team wants control, compliance, and audit trails. Both are right.',
          'The temptation is to optimize for one and tolerate the other. The strongest financial products encode the tension into the system itself. Policies apply automatically so employees don\u2019t need to think about compliance and finance teams don\u2019t need to chase approvals.',
          'At Teamshares, the payroll reporting work served both audiences through the same underlying system. Network Company operators got simple visibility into their own data. Industry Leads got aggregated views across all 90+ companies. The experience adapted to the role. The infrastructure was shared.',
          'That pattern scales across every financial domain. Cards, expenses, travel, bill pay, procurement. Each has its own version of the employee-versus-admin tension. The design work is figuring out where the policy layer lives and making it invisible to the person who just needs to get something done.',
        ],
      },
      {
        heading: 'Policy is invisible design',
        paragraphs: [
          'In financial products, the policy layer is where the real design lives. Approval routing, spending limits, compliance rules, budget controls. These decisions shape whether a product feels effortless or adversarial.',
          'Good policy design means the employee rarely encounters a wall. The guardrails are built into the workflow so that by the time they submit something, it\u2019s already compliant. The finance team gets clean data because the system enforced the rules upstream.',
          'This is systems thinking applied to money. Before you design any screen, you map the policy logic. Who can approve what, up to what amount, under what conditions, with what exceptions. Those rules shape every interface decision downstream.',
        ],
      },
      {
        heading: 'Consumer-grade craft in enterprise complexity',
        paragraphs: [
          'Complex doesn\u2019t have to mean complicated. The best B2B financial products feel like consumer apps on the surface while handling enterprise-grade logic underneath.',
          'At Marketo, the Sky design system achieved 100% adoption across product teams because we treated internal adoption like a product launch. We studied how designers and engineers actually used the system, identified friction points, and designed the DX around their real workflows. Several Sky patterns were later contributed upstream to Adobe\u2019s Spectrum system after the acquisition.',
          'That same thinking applies to financial platforms. An expense report should feel as easy as texting a photo. A procurement approval should be as clear as a notification. The craft is in making the complexity disappear while keeping the controls accessible for the people who need them.',
        ],
      },
      {
        heading: 'What I\u2019d bring to a spend platform',
        paragraphs: [
          'Unifying fragmented financial domains into a single platform is the exact kind of problem I\u2019ve been solving. At Teamshares, I turned fragmented payroll data across 90+ companies into centralized visibility that saved $3.1M in annual efficiency gains. At Marketo, I built a design system that unified 50+ components across every product surface and achieved full adoption. At Meroxa, I led a strategic pivot that expanded the addressable market by 10x through rethinking who the product actually served.',
          'The through line: I start with the system, understand how the pieces connect, and design the logic underneath the screens. Financial platforms reward that approach because the complexity is structural. The payoff for getting the structure right compounds across every surface you ship.',
        ],
      },
    ],
  },

  'designing-platforms-where-two-sides-need-each-other': {
    kicker: 'Point of View',
    title:  'Designing platforms where two sides need each other',
    dek: 'On dual-persona design, the craft of making both sides feel served, and what payroll networks and data pipelines share with creator platforms.',
    sections: [
      {
        paragraphs: [
          'Every platform with two distinct user types faces the same structural challenge: each side has different needs, different mental models, and different definitions of success. The platform has to serve both without compromising either.',
          'I\u2019ve designed for this dynamic across my career. At Teamshares, employees and network operators. At Upwork, freelancers and the clients hiring them. At Meroxa, data engineers building pipelines and the teams consuming the output. The design challenge repeats: how do you build one product that feels purpose-built for two very different people?',
        ],
      },
      {
        heading: 'The relationship is the product',
        paragraphs: [
          'In two-sided platforms, the most important surface is the connection between them. The moment where one side\u2019s work reaches the other. How that handoff feels shapes whether both sides keep coming back.',
          'At Teamshares, Industry Leads depended on data that Network Company operators produced. The reporting system had to make the operator\u2019s job feel simple and give the Industry Lead confidence that the data was accurate and current. If either side lost trust in the system, both sides suffered.',
          'That dynamic maps directly to creator platforms. A streamer needs tools that feel powerful and immediate. A viewer needs an experience that feels effortless and engaging. The platform succeeds when both sides feel like the product was designed specifically for them.',
        ],
      },
      {
        heading: 'Empathy multiplied',
        paragraphs: [
          'Designing for one persona requires deep empathy. Designing for two requires holding both perspectives simultaneously, and knowing when they conflict.',
          'At Upwork, I worked at the intersection of freelancer experience and client experience. The platform had to give freelancers visibility and control over how they presented their work, while giving clients confidence and clarity in evaluating candidates. The research I did there taught me that the most productive design decisions came from understanding where both sides\u2019 motivations aligned and designing for that overlap.',
          'In creator platforms, the overlap is the content itself. Both creators and audiences care about the quality of what\u2019s being shared. Both benefit from discovery that surfaces the right content. The design work is in amplifying that shared interest.',
        ],
      },
      {
        heading: 'Systems that scale community',
        paragraphs: [
          'When a platform grows, consistency becomes community infrastructure. A shared interaction language across every surface means that both creators and viewers can navigate the product intuitively, regardless of which feature they\u2019re using.',
          'At Marketo, Sky\u2019s design system unified 50+ components across every product surface. The outcome was coherence at scale. Users moved between tools without having to relearn the interface. That same principle applies to platforms where creators and viewers interact across live streams, chat, clips, profiles, and discovery surfaces. The design system is what keeps the experience feeling like one product.',
        ],
      },
      {
        heading: 'What I\u2019d bring to a creator platform',
        paragraphs: [
          'I\u2019ve spent my career designing platforms that serve multiple user types through shared infrastructure. Systems thinking, research-driven empathy, design systems that scale. These are the tools that make two-sided platforms coherent.',
          'Twitch\u2019s challenge is a version of the same problem I\u2019ve been solving: how do you give creators the power they need and viewers the experience they want, all within one product that feels intentional? That\u2019s the intersection of craft and systems where I do my best work.',
        ],
      },
    ],
  },

  'designing-infrastructure-people-trust': {
    kicker: 'Point of View',
    title:  'Designing infrastructure people trust with their money',
    dek: 'On visibility, complex workflows, and why the design patterns that matter in traditional payments carry directly into digital currency.',
    sections: [
      {
        paragraphs: [
          'Every product that touches money has the same foundational design constraint: trust. The interface has to communicate precision, status, and control at every step. Users need to know exactly where their money is, what\u2019s happening to it, and that they can intervene if something goes wrong.',
          'I\u2019ve designed financial infrastructure at Teamshares, where payroll data flowed across 90+ companies. The patterns I learned there, around visibility, status clarity, and policy-driven workflows, are the same patterns that matter in currency, treasury, and payments. The design principles hold regardless of the underlying asset.',
        ],
      },
      {
        heading: 'Visibility is trust',
        paragraphs: [
          'In financial products, the most important design decision is what you make visible. At Teamshares, Industry Leads had no real-time visibility into payroll health across their network. Analyses were delayed days by manual processes. The system worked, but nobody could see it working. That invisibility eroded confidence.',
          'We redesigned the reporting system around centralized visibility. Real-time data across 90+ companies. The result was a 50% increase in team productivity, and the deeper outcome was trust. When people can see the state of their money at a glance, they stop worrying about whether the system is doing its job.',
          'That principle applies directly to treasury and payments infrastructure. Whether someone is managing USDC reserves or routing cross-border payments, they need to see the state of every transaction, every balance, every policy in real time. Visibility is how you build trust at scale.',
        ],
      },
      {
        heading: 'Complex workflows need calm design',
        paragraphs: [
          'Financial workflows are inherently complex. Multi-step approvals, compliance checks, reconciliation across systems, edge cases for every jurisdiction. The design challenge is making this complexity navigable without hiding it.',
          'At Teamshares, payroll reporting involved disparate data sources, multiple user roles, and compliance requirements that varied by company. The design work was in creating clear paths through the complexity: progressive disclosure that surfaced the right information at the right moment, status indicators that made the current state unambiguous, and defaults that handled the common case so users only had to intervene on exceptions.',
          'That same discipline scales to crypto payments infrastructure. The workflows share the same structure: multi-party transactions, regulatory requirements, global variation, and users who need confidence in every step.',
        ],
      },
      {
        heading: 'Systems thinking across interconnected products',
        paragraphs: [
          'Currency, treasury, and payments are interconnected domains. A change in how currency is issued affects how treasury manages reserves affects how payments settle. Designing any one surface in isolation misses the connections.',
          'This is where my experience at Marketo and Meroxa maps directly. At Marketo, I built a design system that unified 50+ components across every product surface because the real value was in the connections between tools. At Meroxa, the strategic pivot from a pipeline builder to an observability platform came from recognizing that the product\u2019s surfaces were more connected than the team realized.',
          'Designing across interconnected product areas requires mapping the system before designing any screen. Where does data flow? Where do user workflows cross product boundaries? Where do changes in one area cascade into others? Those are the questions that shape a cohesive platform.',
        ],
      },
      {
        heading: 'What I\u2019d bring to Circle',
        paragraphs: [
          'I\u2019ve spent my career designing complex, interconnected systems that handle high-stakes data. Payroll across 90+ companies. Design systems that unified dozens of product surfaces. Data infrastructure pivots that reshaped entire platforms. The common thread is infrastructure that people rely on, and the design discipline required to keep it clear, trustworthy, and scalable.',
          'Circle\u2019s challenge, building intuitive experiences for currency, treasury, and payments at global scale, sits at the exact intersection of systems thinking, financial domain knowledge, and craft that my career has been building toward.',
        ],
      },
    ],
  },

  'designing-for-people-who-live-in-the-product': {
    kicker: 'Point of View',
    title:  'Designing for people who live in the product',
    dek: 'On cognitive load, multi-persona platforms, and what full-day software demands from a design system.',
    sections: [
      {
        paragraphs: [
          'Contact center software, marketing automation, data pipelines. These are products people inhabit. When someone spends eight hours inside your product, every design decision either compounds into clarity or compounds into fatigue.',
          'I\u2019ve spent most of my career designing platforms that people live in. Marketo, where marketers built and managed campaigns across dozens of surfaces. Teamshares, where operators managed hiring and payroll across 90+ companies. Meroxa, where engineers monitored real-time data pipelines. These users are working. And the bar for what "intuitive" means goes up dramatically when the session never ends.',
        ],
      },
      {
        heading: 'Cognitive load is a design debt',
        paragraphs: [
          'In full-day software, every unnecessary interaction is a tax. An extra click to reach a common action. A dashboard that shows everything but highlights nothing. A label that\u2019s technically accurate but takes a beat too long to parse.',
          'These are compounding debt. Over an eight-hour shift, a three-click workflow costs twenty minutes more than a one-click workflow. A noisy dashboard creates decision fatigue by lunch.',
          'At Marketo, I learned this building Sky. The design system unified 50+ components across every product surface. The deeper value was in the decisions we made about information density. Which data needed to be visible at a glance. Which actions deserved primary placement. Which elements could be progressively disclosed to reduce noise. Those decisions scaled across every product team that adopted the system.',
        ],
      },
      {
        heading: 'Three personas, one platform',
        paragraphs: [
          'Platform products often serve multiple personas with fundamentally different relationships to the same data. An agent needs speed and simplicity. A supervisor needs oversight and intervention tools. An admin needs configuration and control.',
          'The design challenge is building a unified experience that adapts to each persona without fragmenting into three separate products. Shared navigation, shared mental models, shared language. Differentiated workflows, differentiated information hierarchy, differentiated defaults.',
          'At Teamshares, the payroll reporting system served network company operators and industry leads through the same underlying platform. Operators saw their own company data. Industry leads saw aggregated views across all 90+ companies. The interface adapted to the role. The architecture was shared. That pattern is how you build "one platform" for multiple personas without losing coherence.',
        ],
      },
      {
        heading: 'Design systems carry the weight',
        paragraphs: [
          'When a platform spans dozens of surfaces and serves multiple personas, the design system is what keeps the experience from fragmenting. Consistent interaction patterns, predictable layouts, shared vocabulary. These are infrastructure.',
          'At Marketo, Sky achieved 100% adoption across product teams. Patterns were eventually contributed upstream to Adobe Spectrum. That happened because the system was built to serve the people using it: both the end users of the product and the designers and engineers building on it. We treated internal adoption as a design problem and solved it the same way we\u2019d solve any product problem: by studying real behavior, identifying friction, and designing the DX around actual workflows.',
        ],
      },
      {
        heading: 'What I\u2019d bring to a platform people live in',
        paragraphs: [
          'I\u2019ve spent my career on the kind of products where users set up camp. Designing for that context means caring about information density, cognitive load over long sessions, multi-persona flexibility, and the design system infrastructure that holds it all together.',
          'The "one platform" challenge is one I\u2019ve solved before, at different companies and at different scales. The underlying problem is always the same: how do you give three very different users a coherent experience without building three separate products? That\u2019s systems thinking applied to product design, and it\u2019s the work I do best.',
        ],
      },
    ],
  },

  'when-the-platform-knows-more-than-you-do': {
    kicker: 'Point of View',
    title:  'When the platform knows more than you do',
    dek: 'On AI transparency, healthcare stakes, and why the hardest design problem isn\u2019t the intelligence \u2014 it\u2019s the interface between AI confidence and human judgment.',
    sections: [
      {
        paragraphs: [
          'Healthcare is the domain where the gap between system intelligence and human trust matters most. A payment integrity platform can surface patterns across hundreds of millions of lives that no analyst could see manually. The AI is genuinely smarter than any individual user at certain tasks. The design problem is what happens at the handoff \u2014 when the platform\u2019s recommendation meets a human being who has to decide whether to act on it.',
          'I learned the healthcare stakes early, designing patient registration, supply chain, and document management systems at MEDHOST. Errors there weren\u2019t just UX failures \u2014 they had downstream consequences in care delivery, billing, and compliance. That experience shaped how I think about any system where the cost of confusion is high.',
        ],
      },
      {
        heading: 'The AI confidence problem',
        paragraphs: [
          'Most AI-powered enterprise tools make the same mistake: they surface a recommendation and expect the user to either accept or ignore it. The design treats the AI as an oracle. That\u2019s a trust problem. Healthcare operators \u2014 utilization managers, payment reviewers, clinical ops teams \u2014 have seen enough edge cases to be appropriately skeptical of any automated system. They\u2019re not technophobes. They\u2019ve learned what happens when a system is wrong and nobody caught it.',
          'The right design pattern isn\u2019t \u201ctrust the AI.\u201d It\u2019s \u201chere\u2019s what the platform found, here\u2019s why it thinks so, and here\u2019s how to verify it.\u201d Transparency about the reasoning \u2014 not just the recommendation \u2014 is what moves a tool from liability to asset.',
        ],
      },
      {
        heading: 'Visibility at the right altitude',
        paragraphs: [
          'Healthcare payment workflows operate at enormous scale. The AI handles the volume. What operators need is visibility at the right level of abstraction \u2014 aggregate patterns that surface anomalies, drill paths that let you investigate, and status indicators that make the system\u2019s current state unambiguous.',
          'At Teamshares, I built a payroll reporting system for Industry Leads managing 90+ portfolio companies. The design challenge was structurally identical: enormous data volume, patterns that crossed company boundaries, and operators who needed to understand what required their attention without reviewing every transaction. The Machinify context adds AI-generated pattern detection to the same underlying problem: make the invisible visible, at the right altitude, for the right person.',
        ],
      },
      {
        heading: 'Designing for audit',
        paragraphs: [
          'Healthcare is one of the few domains where the decision trail matters as much as the decision. Claim denials get appealed. Utilization reviews get scrutinized. Payment adjustments carry regulatory implications. Every AI-powered recommendation needs to produce a record a human can reconstruct and defend.',
          'This is a constraint most AI products ignore. When a platform surfaces a flag or a denial recommendation, the downstream workflow isn\u2019t just the action \u2014 it\u2019s the documentation of why. Designing for audit isn\u2019t an afterthought in healthcare. It\u2019s part of the primary workflow, and it shapes every interaction pattern.',
        ],
      },
      {
        heading: 'What I\u2019d bring to Machinify',
        paragraphs: [
          'I\u2019ve designed infrastructure that operators rely on daily \u2014 payroll systems, data pipelines, document management at the facility level \u2014 where the cost of a missed state or an unclear status is real. I\u2019ve built the design systems that keep complex, multi-surface platforms coherent. And I\u2019ve learned from MEDHOST that healthcare software has different tolerances for confusion than any other domain.',
          'The opportunity at Machinify is to design AI-powered intelligence that health plan operators actually trust \u2014 not because they\u2019re asked to, but because the interface shows its work.',
        ],
      },
    ],
  },

  'the-platform-underneath-the-art': {
    kicker: 'Point of View',
    title:  'The platform underneath the art',
    dek: 'On designing workflow infrastructure for creative industries \u2014 and why the best operational tools are the ones the user never has to think about.',
    sections: [
      {
        paragraphs: [
          'The most important tools in a creative career are the ones the creator never has to think about. Royalty distribution, release scheduling, analytics, sync licensing \u2014 the infrastructure behind modern music is complex and consequential. A missed payment, a delayed release, a gap in data: these have real stakes for people whose livelihood depends on the platform working. The design problem is making all of that complexity invisible to the artist while keeping it fully navigable for the label operators and managers who live in it every day.',
          'That dual demand \u2014 invisible to one user, powerful to another \u2014 is one of the most interesting problems in product design. It\u2019s not about simplification. It\u2019s about knowing who sees what, and making both experiences feel effortless.',
        ],
      },
      {
        heading: 'Two users, one platform',
        paragraphs: [
          'A distribution platform serving 75,000 artists and 5,000 label clients has at least two distinct users whose needs don\u2019t overlap much. The artist wants to know: did my music get distributed, are my royalties right, what\u2019s performing? The label client wants: portfolio management, analytics across hundreds of releases, workflow automation for a team. The patterns that work for a power user managing a catalog won\u2019t be the same as those for an independent artist checking in once a month.',
          'At Teamshares, I built a payroll reporting tool for industry leads managing 90+ portfolio companies simultaneously. The design challenge was structurally identical: one surface, two different mental models and information needs. The solution wasn\u2019t one view with a toggle. It was understanding what each user was actually trying to accomplish and building the right entry points for both \u2014 without making either feel like a second-class experience.',
        ],
      },
      {
        heading: 'Design systems for creative industries',
        paragraphs: [
          'A design system built for a music platform has to earn trust differently than one built for a SaaS dashboard. It can\u2019t just be consistent and accessible \u2014 it has to feel like it was made by people who care about music. Typography, the way information breathes on a page, color decisions, motion \u2014 these communicate cultural credibility before a user reads a single label. The system has to carry both the rigor of enterprise infrastructure and the sensibility of the creative industry it serves.',
          'Those aren\u2019t in conflict. The most respected creative tools \u2014 Ableton, Figma, Final Cut \u2014 are also technically rigorous. The craft isn\u2019t a layer on top of the engineering. It\u2019s baked into every decision about what the system owns and what it leaves open.',
        ],
      },
      {
        heading: 'Systems that survive',
        paragraphs: [
          'At Marketo, I built a design system that started as a collection of best guesses about what a rebuilt platform needed. By the time Adobe acquired Marketo, Sky\u2019s patterns had become the foundation that outlasted the product and fed upstream into Adobe Spectrum. The lesson wasn\u2019t about being comprehensive from day one \u2014 it was about getting the governance model right. Knowing what the system owns versus what product teams decide locally. Building a contribution process that designers actually use. Creating the conditions for the system to evolve without requiring a single person to be the bottleneck.',
          'That model \u2014 clear ownership, real governance, room for local decisions \u2014 is what makes a design system scale. Without it, you get a component library that teams fork instead of contribute to.',
        ],
      },
      {
        heading: 'What I\u2019d bring to Create Music Group',
        paragraphs: [
          'I\u2019ve built design systems that outlasted the products they were built for. I\u2019ve designed workflow tools for people who don\u2019t want to be operating software \u2014 they want to be doing their actual job \u2014 and I\u2019ve figured out how to get out of their way without sacrificing depth. I\u2019ve led the governance decisions that made systems scale and the mentorship that made design teams stronger.',
          'The Create Music platform problem \u2014 modular infrastructure for a creative industry, serving a spectrum of users from independent artists to enterprise label clients, with a design system holding it all together \u2014 is exactly the kind of problem I want to be working on.',
        ],
      },
    ],
  },

  'the-instrument-is-the-interface': {
    kicker: 'Point of View',
    title:  'The instrument is the interface',
    dek: 'On designing music software for people whose expertise is in sound, not UI \u2014 and what that changes about how you work.',
    sections: [
      {
        paragraphs: [
          'Music software has a design problem most enterprise software doesn\u2019t: the user isn\u2019t trying to complete a task. They\u2019re trying to create something. And the moment the UI makes them think about the UI instead of the music, you\u2019ve broken the session.',
          'The best music tools feel like instruments, not applications. They respond in ways that feel physical. They map to how musicians already think. They get out of the way.',
        ],
      },
      {
        heading: 'Expert users with a different kind of expertise',
        paragraphs: [
          'Musicians who use Roland software are experts \u2014 but their expertise is in sound, rhythm, and feeling. Not in navigating interfaces. A UI pattern that works perfectly for a project management tool will feel wrong in a synthesizer editor because the mental model is completely different.',
          'Designing for musicians means learning their vocabulary, their workflow, and their instincts. Where do they start? What do they tweak obsessively? What do they never touch? The answers determine what belongs on the surface, what\u2019s reachable one level down, and what stays hidden until it\u2019s specifically needed.',
        ],
      },
      {
        heading: 'Hardware and software as one experience',
        paragraphs: [
          'Roland products blur the line between hardware and software in ways that create unique design challenges. The software layer of a hardware+software experience doesn\u2019t need to replicate the hardware\u2019s controls \u2014 it needs to extend them intelligently. That requires understanding what the hardware already communicates, and designing only what it can\u2019t.',
          'The seam between the physical and the digital is where the experience either holds together or falls apart. Getting that right is a different kind of systems problem than most product teams are used to solving.',
        ],
      },
      {
        heading: 'The tempo of creative tools',
        paragraphs: [
          'Productivity software can tolerate friction. A creative tool cannot. Every extra click, every mode the user has to remember, every animation that delays feedback \u2014 these interrupt the creative state. Musicians work at the tempo of music. The software has to keep up.',
          'This doesn\u2019t mean simplification. A professional synthesizer editor needs to expose enormous complexity. It means understanding which parts of that complexity belong on the surface, which belong one level down, and which should only appear when specifically summoned. That\u2019s a judgment call that has to be made instrument by instrument, workflow by workflow.',
        ],
      },
    ],
  },

  'the-digital-front-door': {
    kicker: 'Point of View',
    title:  'The digital front door',
    dek: 'On designing the public-facing web presence of a healthcare institution \u2014 and why the stakes are categorically different from most product work.',
    sections: [
      {
        paragraphs: [
          'When someone is trying to find a specialist after a diagnosis, or navigate to the right emergency department, or understand what a procedure means before they sign a consent form \u2014 the healthcare website isn\u2019t a marketing channel. It\u2019s infrastructure.',
          'The design stakes for a system like UCLA Health\u2019s digital footprint are different from the stakes for most products. Bad information architecture doesn\u2019t cost a conversion. It costs someone finding the right care.',
        ],
      },
      {
        heading: 'Accessibility is the baseline, not the add-on',
        paragraphs: [
          'Healthcare audiences are inherently diverse in ways most product audiences aren\u2019t. Older patients. People with visual impairments. Non-native English speakers. People in acute stress with reduced cognitive capacity. People accessing from a mobile device in a waiting room.',
          'In this context, WCAG compliance isn\u2019t a legal checkbox \u2014 it\u2019s the minimum viable design. The real accessibility work is in reducing cognitive load: clear wayfinding, plain language, predictable patterns. The component library that powers this work needs to be built with these constraints as first principles, not retrofitted in QA.',
        ],
      },
      {
        heading: 'Multiple audiences, one system',
        paragraphs: [
          'An academic medical center website serves patients, students, physicians, researchers, and donors \u2014 often on the same page. Each is navigating with different intent, different prior knowledge, and different urgency. Designing for this without fragmenting the experience requires a design system sophisticated enough to flex across contexts while maintaining coherence.',
          'The component library is what makes that possible at scale \u2014 not as a collection of UI elements, but as a system of semantic decisions that encodes the right experience for each audience into the components themselves.',
        ],
      },
      {
        heading: 'What I\u2019d bring to this',
        paragraphs: [
          'At MEDHOST, I designed for healthcare IT \u2014 systems running clinical operations at the facility level. That experience gave me an early understanding of what it means to design in high-consequence environments where errors have real costs.',
          'At Marketo, I built a design system that governed a complex, multi-audience platform and held through an acquisition. The discipline required to build something that stays coherent across a growing team, multiple surfaces, and significant organizational change is the same discipline this role requires.',
          'I started my career hand-coding HTML and CSS, which means I can speak precisely to implementation decisions, catch issues in QA, and write specs that don\u2019t lose anything in translation.',
        ],
      },
    ],
  },

  'from-library-to-language': {
    kicker: 'Point of View',
    title:  'From library to language',
    dek: 'On what it actually takes to build a design system that AI tools can reason about \u2014 and why most systems aren\u2019t there yet.',
    sections: [
      {
        paragraphs: [
          'Design systems started as shared libraries \u2014 a place to put reusable components so teams didn\u2019t rebuild buttons for the fifth time. That problem is largely solved. The next version of that problem is harder and more interesting: how do you build a system that not only humans can use, but that AI tools can reason about, generate from, and extend without breaking things?',
          'Most design systems aren\u2019t ready for that. They\u2019re rich in visual spec and sparse in semantic meaning. The gap between the two is where the AI-first design system lives.',
        ],
      },
      {
        heading: 'A component is documentation, not just code',
        paragraphs: [
          'An AI model consuming your Figma tokens to generate layout code needs to understand not just what a component looks like, but what it\u2019s for, when it applies, what it combines with, and what it doesn\u2019t do. Most systems describe appearance. Few describe intent.',
          'The AI-ready design system inverts that priority. Tokens aren\u2019t just style values \u2014 they\u2019re vocabulary. Component relationships aren\u2019t just inheritance trees \u2014 they\u2019re grammar. When the system is structured to express intent, it can be read and reasoned about by machines, not just consumed by designers.',
        ],
      },
      {
        heading: 'Tokens as the universal source of truth',
        paragraphs: [
          'The design-to-code promise has always been: one definition, everywhere. Design tokens get close. But the gap between a Figma variable and a compiled CSS custom property \u2014 and the further gap between that CSS and a SwiftUI modifier \u2014 is where intent erodes.',
          'The work is in building the connective layer: not just defining tokens, but defining their relationships, constraints, and platform-specific expressions. When you do that, you get more than consistency \u2014 you get a system that can be queried by a Copilot integration or an LLM-assisted code generator and produce something that reflects design intent, not just design proximity.',
        ],
      },
      {
        heading: 'What I\u2019d bring to Yahoo Sports',
        paragraphs: [
          'At Marketo, I built a design system that had to survive an Adobe acquisition and contribute patterns upstream to Spectrum. That pressure \u2014 design decisions that had to hold at a much larger scale than the one they were built for \u2014 shaped how I think about system architecture. You build for extensibility from the start, or you rebuild from scratch later.',
          'I\u2019ve been using Claude Code to build production interfaces directly, including this portfolio. That work has given me a concrete sense of where the seams are between design intent and generated code. The systems that work best aren\u2019t the ones that describe what things look like \u2014 they\u2019re the ones that describe what things mean.',
          'High-density live sports data is a genuinely hard design problem: time-sensitive, multi-format, platform-specific, and load-bearing. The system that powers it needs to be as precise as the data it displays.',
        ],
      },
    ],
  },

  'when-the-platform-is-the-job': {
    kicker: 'Point of View',
    title:  'When the platform is the job',
    dek: 'On designing B2B platforms where users aren\u2019t passing through \u2014 they live there. And what that changes about how you design.',
    sections: [
      {
        paragraphs: [
          'There\u2019s an assumption that sneaks into most product design: the user has a goal outside the product, and the product is a means to reach it. You design to help them get there faster with less friction, then they close the tab and go do the thing.',
          'B2B distribution platforms break this assumption. For an IT reseller working in a platform like Xvantage, the platform isn\u2019t a means to an end. It\u2019s the environment. They configure, quote, order, track, and reconcile inside it. They live there.',
        ],
      },
      {
        heading: 'Familiarity is a feature',
        paragraphs: [
          'When someone uses a product every single day as their primary work surface, the design stakes shift. You\u2019re not optimizing for delight \u2014 you\u2019re optimizing for fluency. A power user who\u2019s been in your platform for 200 days knows where everything is. A redesign that moves things for aesthetic reasons will cost them weeks of relearning with zero upside for them.',
          'The best-designed professional tools are the ones where experienced users stop thinking about the tool and start thinking about their work. The interface recedes. Their judgment takes over. Getting there requires extreme discipline about when to introduce change and why.',
        ],
      },
      {
        heading: 'Multiple personas, one platform',
        paragraphs: [
          'B2B ecosystems have a compounding persona problem. The reseller has one job. The vendor rep has another. The IT buyer has a third. They interact through the same platform but approach it with different mental models, different vocabularies, and different definitions of success.',
          'The mistake is designing for the average. There is no average user here. Designing for multiple expert personas means deeply understanding each \u2014 and building an experience architecture that serves each without building entirely separate products.',
        ],
      },
      {
        heading: 'What I\u2019d bring to this',
        paragraphs: [
          'At Marketo, I designed across personas that had fundamentally different relationships with the same platform: campaign managers, marketing operations leads, sales users, and admins. Each had a different mental model. Each had different things they needed to do quickly. Building a design system that served all of them without becoming a least-common-denominator product was the core challenge.',
          'At Teamshares, I designed tools used by network presidents running individual businesses alongside industry leads managing those businesses in aggregate \u2014 two personas, same data, completely different questions they needed to answer.',
          'Complex persona landscapes are a design strength for me. The work before the interface work is always the same: get close enough to each user\u2019s actual job that you can design from their context, not your assumptions.',
        ],
      },
    ],
  },

  'when-the-system-acts-alone': {
    kicker: 'Point of View',
    title:  'When the system acts alone',
    dek: 'On designing AI agents for high-stakes operations \u2014 and why trust is a design problem before it\u2019s an engineering one.',
    sections: [
      {
        paragraphs: [
          'Operations teams have always been on-call. The shift is that increasingly, the first responder isn\u2019t a person \u2014 it\u2019s a system.',
          'AI agents in an operations platform don\u2019t just alert. They diagnose. They correlate. They\u2019re beginning to remediate. The design challenge that follows isn\u2019t whether the AI can do these things. It\u2019s whether the operator will trust it enough to let it.',
        ],
      },
      {
        heading: 'Autonomy without visibility is anxiety',
        paragraphs: [
          'When a system acts on your behalf, you need to understand what it did, why, and what it decided not to do. Without that, operators don\u2019t gain confidence \u2014 they gain unease. They override everything just to feel in control. The automation exists, but nobody uses it.',
          'Designing for AI in operations means making autonomous action legible \u2014 not through disclaimer modals nobody reads, but through the right signal surfaced at the right moment in the right context. The cognitive load of \u201cwhat did it do?\u201d has to cost less than the cognitive load of doing it yourself.',
        ],
      },
      {
        heading: 'The trust gradient isn\u2019t binary',
        paragraphs: [
          'Not all AI actions require the same level of trust. Suppressing a known-flapping alert is different from escalating an incident to the CTO. Grouping correlated events is different from triggering an automated rollback.',
          'The design work is in mapping that gradient explicitly: what can the system do silently? What needs a confirmation? What should always stay in human hands? These aren\u2019t engineering decisions \u2014 they\u2019re design decisions. And they need to be grounded in how operators actually work under pressure: fast, stressed, context-loaded, with zero patience for friction that slows down resolution.',
        ],
      },
      {
        heading: 'What I\u2019d bring to this',
        paragraphs: [
          'At Meroxa, I led the product shift from a no-code pipeline builder to a data observability platform \u2014 a product where engineers watch systems under pressure and need to understand what\u2019s wrong fast. The core design challenge was trust: how do you make complex, automated system behavior feel transparent enough that engineers can act on it confidently, not just acknowledge it and move on?',
          'That work taught me something I\u2019d bring to PagerDuty\u2019s AI layer directly: operator trust isn\u2019t won at onboarding. It\u2019s built interaction by interaction, decision by decision. Every time the system explains itself clearly, every time it gets it right and the operator knows why \u2014 that\u2019s a deposit. Design builds the account.',
        ],
      },
    ],
  },

  'when-trust-is-the-whole-product': {
    kicker: 'Point of View',
    title:  'When trust is the whole product',
    dek: 'On designing for data governance and privacy compliance \u2014 and why the hardest part isn\u2019t building the controls, it\u2019s making them understandable to the people who have to live in them every day.',
    sections: [
      {
        paragraphs: [
          'Privacy compliance tools have a visibility problem. The controls work. The audit logs run. But nobody in the organization fully understands what the system does, who owns what, or whether the policy they set six months ago still reflects how data actually moves today.',
          'That gap \u2014 between what a system does and what the people operating it believe it does \u2014 is a design problem. Not a legal one. Not an engineering one. A design one.',
        ],
      },
      {
        heading: 'The invisible user',
        paragraphs: [
          'Privacy and governance tools are built for audits. The audit is the official user. The persona in every product spec is the compliance officer preparing for a regulator\u2019s review.',
          'But the actual daily users are different. The privacy engineer who needs to know whether a new integration is in scope before they ship it. The legal team member trying to understand what data a vendor actually touches. The security analyst mapping flows they didn\u2019t build and can\u2019t fully trace. Designing only for the audit means designing for a moment that happens twice a year. The people who keep the system current are an afterthought.',
        ],
      },
      {
        heading: 'Governance as a workflow problem',
        paragraphs: [
          'Most governance tools are good at storage and bad at process. You can define a policy. You can log a consent event. But the workflow that keeps the policy accurate as the product evolves? That\u2019s often email threads, spreadsheets, and somebody\u2019s memory.',
          'The design work in a platform like Fides isn\u2019t in the policy model \u2014 it\u2019s in the annotation workflow, the review queue, the \u201cwho needs to know this changed\u201d notification. It\u2019s making data mapping feel like something a team maintains continuously, not something they reconstruct annually for a questionnaire.',
        ],
      },
      {
        heading: 'What I\u2019d bring to Ethyca',
        paragraphs: [
          'I\u2019ve spent years building tools where accuracy is the product \u2014 payroll systems, compliance workflows, data observability platforms where a wrong answer isn\u2019t just a UX failure, it\u2019s an operational one. The mental model I\u2019ve developed: the interface is a trust statement. Every label, every status, every empty state is either building confidence that the system knows what it\u2019s doing, or eroding it.',
          'Fides operates in exactly that territory. The people using it have to stake professional credibility on what it tells them. That means the design work is about legibility at every layer \u2014 not just what the system does, but what it decided, what it\u2019s uncertain about, and what it needs the operator to verify. I\u2019d bring that precision to Ethyca\u2019s product.',
        ],
      },
    ],
  },

  'when-the-system-has-to-hold-the-brand': {
    kicker: 'Point of View',
    title:  'When the system has to hold the brand',
    dek: 'On designing systems that scale across surfaces without flattening the thing that made the brand worth scaling in the first place.',
    sections: [
      {
        paragraphs: [
          'Most design systems are built to solve a consistency problem. Buttons look the same. Spacing follows rules. Colors are tokenized. That’s necessary, but it’s not the hard part — especially when the brand you’re systematizing has a genuine personality. Scale is a homogenizing force. Left unchecked, it produces interfaces that are consistent and characterless.',
          'Taco Bell’s design problem is the interesting version of this. The brand is specific, irreverent, and recognized. The surfaces — mobile app, web, kiosk, internal tools — are wildly different in context, constraint, and audience. The system has to hold all of that without turning every surface into a generic rectangle with correct hex values.',
        ],
      },
      {
        heading: 'Tokens aren’t personality',
        paragraphs: [
          'A design token can encode a color. It can’t encode irreverence. The hex value for Taco Bell purple doesn’t tell a designer how to handle an empty state, how much motion is appropriate on a kiosk screen, or when to let the brand voice through and when to stay out of the way. That judgment layer is what separates a style guide from a design system.',
          'Personality lives in the patterns — the component variants, the motion language, the copy guidelines baked into the component API, the decision frameworks that help contributors make the right call when the rules don’t cover the edge case. The token system is the foundation. The personality is the structure built on top of it.',
        ],
      },
      {
        heading: 'Multi-surface means multi-constraint',
        paragraphs: [
          'A kiosk is not a mobile app. Touch targets are different. The user is standing. The transaction is time-pressured and in public. The failure mode — a mis-tap on a $12 order — has a consequence that a swipe-dismiss on a phone screen doesn’t. Designing a component that works across a kiosk, a mobile app, and an internal ordering tool isn’t just responsive design. It’s a different problem at each surface.',
          'The system architecture has to be explicit about which decisions are global — the brand tokens, the interaction principles, the accessibility baseline — and which are surface-specific. Teams building kiosk experiences need different primitives than teams building the app. Trying to force one component to do too much produces components that do nothing well.',
        ],
      },
      {
        heading: 'What I’d bring to Taco Bell',
        paragraphs: [
          'At Marketo, I built Sky — a design system that governed a multi-audience enterprise product and held through an Adobe acquisition, a complete rebrand, and three years of aggressive feature expansion. The hardest part wasn’t the component library. It was the governance model: how do you let 40+ designers and engineers contribute without letting the system drift? How do you evolve foundations without breaking the teams that built on them? Those are the questions I’ve spent years learning how to answer.',
          'Taco Bell’s version of that problem is more interesting because the stakes include brand equity, not just engineering velocity. A system that makes it easy to build fast but easy to build off-brand is a liability. The constraint I’d design around: consistency without flattening, speed without drift, and brand personality treated as a first-class system requirement.',
        ],
      },
    ],
  },

  'when-security-gets-the-ux-it-deserves': {
    kicker: 'Point of View',
    title:  'When security gets the UX it deserves',
    dek: 'On designing products where friction isn\u2019t just annoying \u2014 it\u2019s a vulnerability. And why the strongest security posture starts at the interface layer.',
    sections: [
      {
        paragraphs: [
          'Most security products fail not at the cryptography layer, but at the interface layer. The strongest password policy in the world is bypassed by a sticky note on a monitor. The most sophisticated SSO flow gets circumvented by a shared credentials doc in Google Drive.',
          'The security problem is often a design problem. And that changes what it means to get the design right.',
        ],
      },
      {
        heading: 'Friction is an attack surface',
        paragraphs: [
          'Every time a legitimate user finds a workaround \u2014 sharing credentials, staying logged in on shared devices, choosing the weak password that technically meets requirements, disabling MFA because the flow breaks on mobile \u2014 the threat model has failed. Not because the cryptography failed. Because the UX did.',
          'Good security design isn\u2019t just about making things pleasant. It\u2019s about closing the human-error attack surface. The users who matter most are the ones who are busy, distracted, and optimizing for getting their actual work done. If the secure path isn\u2019t also the easy path, they\u2019ll find a different path.',
        ],
      },
      {
        heading: 'Security UX is consequence UX',
        paragraphs: [
          'Most UX mistakes are recoverable. A confusing checkout flow loses a sale. A broken onboarding step creates a support ticket. A bad security UX decision \u2014 one that causes a user to bypass, ignore, or misunderstand a security control \u2014 can result in a breach, a compliance failure, a career-ending incident for someone in the organization.',
          'This changes the stakes for every design decision. The empty state matters more. The error message matters more. The confirmation dialog matters more. Every touchpoint where a user is making a security decision \u2014 even implicitly \u2014 needs to communicate exactly what that decision means, in language they understand, at the moment they need it.',
        ],
      },
      {
        heading: 'What I\u2019d bring to 1Password',
        paragraphs: [
          'I\u2019ve built tools in the consequence spaces: payroll systems where a configuration error costs someone a month\u2019s income, healthcare infrastructure where a settings decision affects clinical operations, devops platforms where engineers are watching systems fail in real time. That\u2019s taught me how to design with appropriate gravity \u2014 to take the stakes seriously without making the interface feel serious.',
          '1Password\u2019s challenge is distinctive: the trust argument is already won. \u201cMost loved brand in cybersecurity\u201d means people actually want to use the product. The design work now is in keeping that trust as the product grows \u2014 from password manager to Unified Access Management, from individual users to enterprise teams, from human logins to AI agents authenticating against APIs. That expansion is a genuinely hard design problem. It\u2019s exactly the kind I want to work on.',
        ],
      },
    ],
  },

  'the-signal-in-the-noise': {
    kicker: 'Point of View',
    title:  'The signal in the noise',
    dek: 'On designing data-dense GTM platforms \u2014 and why the hardest problem isn\u2019t organizing the data, it\u2019s knowing which signal matters when.',
    sections: [
      {
        paragraphs: [
          'Sales intelligence platforms have an abundance problem dressed as an access problem. The contacts are there. The engagement history is there. The intent signals are there. But surface all of it and you\u2019ve built a very expensive noise machine.',
          'The rep doesn\u2019t want to browse. They want to know. They want the platform to have an opinion about what matters right now \u2014 and they want to trust it.',
        ],
      },
      {
        heading: 'A database and a tool are not the same thing',
        paragraphs: [
          'A database surfaces everything. A tool makes a recommendation. The design work in a platform like Apollo isn\u2019t in the data model \u2014 it\u2019s in the judgment layer. Which contacts rise to the top? When does recency matter more than fit? When does fit matter more than recency? These aren\u2019t engineering decisions. They\u2019re design decisions with engineering consequences.',
          'I\u2019ve seen this up close at Marketo. The engagement timeline existed \u2014 every email open, web visit, and form fill was tracked. The original Sales Insight design surfaced all of it. What reps actually needed were the two or three data points that told them whether to call today or wait a week. The redesign built around that insight. The data didn\u2019t change. The judgment layer did.',
        ],
      },
      {
        heading: 'The rep\u2019s world is not a dashboard',
        paragraphs: [
          'Revenue tools often get designed for the reporting view \u2014 the one the VP of Sales checks on Tuesday morning. But the rep lives somewhere else. They\u2019re moving between 40 accounts, context-switching constantly, trying to remember where they left off with someone they last touched three weeks ago.',
          'The design that serves the VP\u2019s review is often exactly wrong for the rep\u2019s Thursday morning. Designing for both means understanding both workflows at the task level \u2014 not just the feature level. What does the rep need to stay oriented? What should surface without being asked? What stays out of the way until it\u2019s needed?',
        ],
      },
      {
        heading: 'What I\u2019d bring to Apollo',
        paragraphs: [
          'I\u2019m drawn to this problem space because it\u2019s genuinely hard. The data is complex, the users are experts, and the margin for making them feel like the tool is slowing them down is zero. The best GTM platforms are the ones that make experienced reps feel like the system knows them \u2014 and that takes precise design work to get right.',
          'The systems thinking required here \u2014 understanding how search, enrichment, sequencing, and CRM sync interact as a coherent experience rather than separate features \u2014 is the kind of work I do well.',
        ],
      },
    ],
  },

  'the-control-plane-problem': {
    kicker: 'Point of View',
    title:  'The control plane problem',
    dek: 'On designing for administrators and end users at once \u2014 and why the person who configures the system is the most overlooked user in enterprise software.',
    sections: [
      {
        paragraphs: [
          'Enterprise software always has at least two users. The person who configures the system. The person who uses it. Product teams tend to fall in love with one and neglect the other \u2014 and the choice reveals itself everywhere. A polished end-user experience built on a configuration system so rigid that IT can\u2019t make it fit real organizational needs. Or a powerful admin console that nobody can navigate without a support ticket and three hours of documentation.',
          'Both failures have the same root cause: the design process treated one persona as primary and the other as an afterthought. The result is a product that works for one group at the expense of the other, and an IT team that spends its time compensating for what the design didn\u2019t solve.',
        ],
      },
      {
        heading: 'The admin is a user too',
        paragraphs: [
          'Administrator tooling is where enterprise software design debt accumulates fastest. It\u2019s often built last, designed by engineers for engineers, and tested almost never with actual IT staff. The result: support burden, workarounds, and misconfigured environments that end users experience as product failures \u2014 even though the problem started in a settings panel nobody spent design time on.',
          'The administrator isn\u2019t a secondary persona. They\u2019re the ones who make the product work for everyone else. At MEDHOST, I learned that the person configuring a clinical system shapes what every nurse and administrator downstream can and can\u2019t do. That invisible dependency is a design problem. It deserves design attention.',
        ],
      },
      {
        heading: 'Complexity is real. Hiding it isn\u2019t the answer.',
        paragraphs: [
          'The mistake enterprise teams make is treating complexity as something to abstract away. Sometimes that\u2019s right. Often it isn\u2019t. An administrator configuring a global access policy that affects thousands of users is doing something genuinely complex \u2014 and the design should make the scope of that action legible, not hide it behind a simplified interface that makes the risk invisible.',
          'At Teamshares, I built reporting tools for industry leads managing 90+ portfolio companies. The complexity was real: payroll data crossing company boundaries, patterns that only meant something in aggregate. The design job wasn\u2019t to simplify the problem \u2014 it was to bring the right information to the surface at the right moment so a lead could act confidently in minutes instead of hours. Enterprise complexity demands that kind of precision, not false simplicity.',
        ],
      },
      {
        heading: 'The cloud / on-premises coherence problem',
        paragraphs: [
          'When a product ships across both cloud and on-premises deployments, the design challenge is maintaining a coherent experience across radically different operational contexts. Cloud admins deal with one set of concerns \u2014 update cadences, SLA expectations, shared infrastructure. On-prem admins deal with another. But the end user shouldn\u2019t be able to tell the difference.',
          'That invisible consistency is a design system problem presenting as a product problem. The system has to absorb enough variation that each environment feels purpose-built, without maintaining two entirely separate products. At Marketo, I built a design system that had to work across a legacy platform and a rebuilt one simultaneously \u2014 keeping both coherent while the migration was in progress and users were split between them. Same structural challenge, different surface.',
        ],
      },
      {
        heading: 'What I\u2019d bring to Citrix',
        paragraphs: [
          'I\u2019ve designed for power users who need precision control and end users who need simplicity \u2014 often in the same product. I\u2019ve built design systems that created coherence across multiple surfaces and survived the organizational changes that followed. And I\u2019ve led the research that reframed a brief, the strategy that changed a roadmap, and the system that made it all hold together.',
          'The Citrix design challenge \u2014 administrator control alongside end-user experience, cloud alongside on-premises, a design system holding all of it together \u2014 is exactly the kind of problem I want to be working on.',
        ],
      },
    ],
  },
};


function openCase(id) {
  const data = CASES[id];
  if (!data) return;
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
  // Resolve any lazy images injected into the new content
  content.querySelectorAll('img[data-lazy-src]').forEach(img => {
    img.src = img.dataset.lazySrc;
    delete img.dataset.lazySrc;
  });
}

function buildCaseHTML(d) {
  const metricsHtml = (d.metrics || []).map(m =>
    `<div class="cd-metric"><span class="cd-metric-value">${m.value || m.val}</span><span class="cd-metric-label">${m.label}</span></div>`
  ).join('');

  let html = `<p class="cd-company">${d.company}</p>`;
  html += `<h1 class="cd-headline">${d.headline || d.title}</h1>`;
  if (d.intro) html += `<p class="cd-intro">${d.intro}</p>`;
  if (metricsHtml) html += `<div class="cd-metrics">${metricsHtml}</div>`;

  if (d.content) {
    // Old format — raw HTML, convert inline src= to data-lazy-src= for images
    html += d.content.replace(
      /<img(\s+[^>]*?)src="(assets\/[^"]+)"([^>]*?)>/g,
      '<img$1data-lazy-src="$2"$3>'
    );
  } else if (d.sections) {
    // New simplified format
    d.sections.forEach(s => {
      html += '<div class="cd-block">';
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
        html += '<div class="cd-screenshots-row">';
        s.screenshots.forEach(sc => {
          html += `<div class="cd-screenshot-frame"><img src="${sc.src}" alt="${sc.caption}"><span>${sc.caption}</span></div>`;
        });
        html += '</div>';
      }
      html += '</div>';
    });
  }

  if (d.haiku?.length) {
    html += `<div class="cd-haiku">${d.haiku.map(l => `<p>${l}</p>`).join('')}</div>`;
  }

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
  const rPanel = document.getElementById('recruiterPanel');
  if (rPanel && rPanel.classList.contains('active')) {
    returnPanel = 'recruiterPanel';
    rPanel.classList.remove('active');
  } else {
    returnPanel = 'caseListPanel';
    document.getElementById('caseListPanel').classList.add('hidden');
  }
  const content = document.getElementById('caseDetailContent');

  // Build HTML
  const heroSrc = data.hero ? data.hero.src : data.img;
  const heroAlt = data.hero ? data.hero.alt : '';

  let html = '';
  if (heroSrc) {
    html += `<div class="cd-hero-img-wrap"><img data-lazy-src="${heroSrc}" class="cd-hero-img" alt="${heroAlt}" width="${data.hero ? data.hero.w : ''}" height="${data.hero ? data.hero.h : ''}"></div>`;
  }
  if (data.kicker) html += `<p class="cd-company">${data.kicker}</p>`;
  html += `<h1 class="cd-headline">${data.title}</h1>`;
  if (data.dek) html += `<p class="cd-intro">${data.dek}</p>`;

  if (data.sections) {
    // Rich article format — sections with heading + paragraphs[]
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    let titledCount = 0;
    data.sections.forEach(section => {
      const blocks = (section.paragraphs || []).map(p => {
        if (typeof p === 'string') {
          return `<p class="cd-body">${esc(p).replace(/\n/g, '<br>')}</p>`;
        }
        if (p.list) {
          return `<ul class="cd-list">${p.list.map(li => `<li class="cd-body">${esc(li)}</li>`).join('')}</ul>`;
        }
        return '';
      }).join('');

      if (!section.heading) {
        html += `<div class="cs-section cs-section--plain">${blocks}</div>`;
      } else {
        titledCount++;
        const num = String(titledCount).padStart(2, '0');
        html += `<div class="cs-section"><div class="cs-section-header"><span class="cs-section-num">${num}</span><span class="cs-section-title">${esc(section.heading)}</span></div>${blocks}</div>`;
      }
    });
  } else if (data.content) {
    // Flat HTML content (legacy)
    html += data.content;
  }

  content.innerHTML = html;
  content.querySelectorAll('img[data-lazy-src]').forEach(img => {
    img.src = img.dataset.lazySrc;
    delete img.dataset.lazySrc;
  });
  content.classList.remove('content-entering');
  void content.offsetWidth;
  content.classList.add('content-entering');
  document.getElementById('caseDetailPanel').classList.add('active');
  document.getElementById('caseDetailPanel').scrollTop = 0;
}


// ── Fit panel ────────────────────────────────────────────────────
const DANTE_CONTEXT = `You are assessing whether L Dante Guarin is a fit for a given role.

WHO HE IS:
Principal Product Designer, 13+ years. IC contributor — not a people manager. Based in Irvine, CA. Web-based product design is his focus; no deep native iOS/Android work.

CAREER:
- Marketo / Adobe: Founded Sky design system (50+ components, patterns contributed upstream to Adobe Spectrum). Led design through acquisition.
- Teamshares: Payroll reporting across 90+ portfolio companies (~$3.1M annual savings) and ATS built from scratch for network-wide hiring.
- Meroxa: Principal IC designer on developer-facing data observability platform. Led pivot from ETL tooling to observability.
- Upwork / T-Mobile: B2C exposure at scale, though his depth is enterprise B2B.

WHAT HE'S GOOD AT:
- B2B / SaaS product design — his entire career
- Design systems at scale
- Complex data-heavy tools, dashboards, and reporting
- Financial infrastructure and HR tech
- Developer tooling and data pipeline products
- Discovery research that reshapes product direction
- Dual-persona platforms (operators + admins, creators + consumers)
- IC design leadership on 0-to-1 products

WHERE HE HAS NO TRACK RECORD:
- Consumer entertainment, social, or gaming
- People management — IC only, not looking to manage
- Native mobile-first products (iOS/Android)
- Healthcare, government, education, non-profit
- Pure e-commerce or DTC consumer
- Brand, marketing, or motion design`;

// ── Recruiter panel ─────────────────────────────────────────────
function setupRecruiterPanel() {
  const ta       = document.getElementById('recruiterFitTextarea');
  const counter  = document.getElementById('recruiterFitCharCount');
  const btn      = document.getElementById('recruiterFitAssessBtn');
  const clearBtn = document.getElementById('recruiterFitClearBtn');
  const errEl    = document.getElementById('recruiterFitError');
  const result   = document.getElementById('rpResult');
  if (!ta || ta.dataset.rpReady) return;
  ta.dataset.rpReady = '1';

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
      const res = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: jd }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!data.isJobDescription) {
        errEl.textContent = "That doesn't look like a job description. Try pasting the text directly.";
        errEl.hidden = false;
        return;
      }
      renderAssessResult(data);
    } catch(e) {
      console.error('Fit assessment error:', e);
      errEl.textContent = e.message || 'Assessment failed. Try again.';
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
    lattice:   'design-systems-that-last',
    rippling:  'financial-platforms-systems-problems',
    twitch:    'designing-platforms-where-two-sides-need-each-other',
    circle:    'designing-infrastructure-people-trust',
    five9:     'designing-for-people-who-live-in-the-product',
    machinify:  'when-the-platform-knows-more-than-you-do',
    citrix:       'the-control-plane-problem',
    createmusic:  'the-platform-underneath-the-art',
    apollo:       'the-signal-in-the-noise',
    pagerduty:    'when-the-system-acts-alone',
    ethyca:       'when-trust-is-the-whole-product',
    '1password':  'when-security-gets-the-ux-it-deserves',
    ingram:       'when-the-platform-is-the-job',
    yahoo:        'from-library-to-language',
    ucla:         'the-digital-front-door',
    roland:       'the-instrument-is-the-interface',
    tacobell:     'when-the-system-has-to-hold-the-brand',
  };

  const matchedId = POV_MAP[ref] || null;
  const stack = document.getElementById('caseStack');
  let matchedEl = null;

  // Reset: un-hide everything so this function is safe to call multiple times
  // (dev switcher, role switch, session restore can all call it with different refs)
  document.querySelectorAll('#caseStack .case-item--photo, #caseStack .case-item--thought').forEach(el => {
    el.style.display = '';
  });

  // Hide photo tiles in the HM experience
  document.querySelectorAll('#caseStack .case-item--photo').forEach(el => {
    el.style.display = 'none';
  });

  // Hide all POV/Perspective tiles; surface only the matched one
  document.querySelectorAll('#caseStack .case-item--thought').forEach(el => {
    if (!el.querySelector('.thought-tile--pov')) return; // skip non-POV tiles
    if (matchedId && el.dataset.thought === matchedId) {
      el.style.display = ''; // explicitly visible even if previously hidden
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
  if (/VERY STRONG/i.test(verdict))      pill.classList.add('very-strong');
  else if (/GOOD/i.test(verdict))        pill.classList.add('good');
  else if (/MODERATE/i.test(verdict))   pill.classList.add('moderate');
  else if (/WEAK/i.test(verdict))        pill.classList.add('weak');
  // plain STRONG MATCH stays default green

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
      li.innerHTML = `<span class="rp-icon">&#x25CF;</span><span>${escapeHTML(line.replace(/^-\s*/, ''))}</span>`;
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

function renderAssessResult(data) {
  const result       = document.getElementById('rpResult');
  const pill         = document.getElementById('rpResultPill');
  const summaryEl    = document.getElementById('rpResultSummary');
  const strengthList = document.getElementById('rpStrengthList');
  const discussList  = document.getElementById('rpDiscussList');
  const recCards     = document.getElementById('rpRecCards');

  const LEVEL = {
    strong:  { label: 'STRONG MATCH',   cls: '' },
    good:    { label: 'GOOD MATCH',     cls: 'good' },
    partial: { label: 'MODERATE MATCH', cls: 'moderate' },
    low:     { label: 'WEAK MATCH',     cls: 'weak' },
  };
  const level = LEVEL[data.fitLevel] || { label: 'MATCH', cls: '' };
  pill.textContent = level.label;
  pill.className = 'rp-result-pill' + (level.cls ? ' ' + level.cls : '');

  summaryEl.textContent = data.fitHeadline || '';

  strengthList.innerHTML = '';
  (data.strengths || []).forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="rp-icon">&#x2705;</span><span>${escapeHTML(s)}</span>`;
    strengthList.appendChild(li);
  });

  discussList.innerHTML = '';
  (data.considerations || []).forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="rp-icon">&#x25CF;</span><span>${escapeHTML(c)}</span>`;
    discussList.appendChild(li);
  });

  recCards.innerHTML = '';
  (data.suggestedCases || []).forEach(id => {
    const caseData = CASES[id];
    if (!caseData) return;
    const srcEl    = document.querySelector(`#caseStack .case-item[data-case="${id}"] .case-card-logo`);
    const logoSrc  = srcEl ? srcEl.getAttribute('src') : '';
    const isWhite  = srcEl ? srcEl.classList.contains('logo-white') : false;
    const itemEl   = document.querySelector(`#caseStack .case-item[data-case="${id}"]`);
    const cardColor = itemEl ? itemEl.style.getPropertyValue('--card-color') : '#1f1f1f';
    const card = document.createElement('div');
    card.className = 'rp-rec-card';
    card.style.setProperty('--card-color', cardColor);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="case-card-v">
        <span class="case-study-badge">Case Study</span>
        ${logoSrc ? `<img src="${logoSrc}" alt="${escapeHTML(caseData.company)}" class="case-card-logo${isWhite ? ' logo-white' : ''}">` : ''}
        <div class="case-card-content">
          <p class="case-company">${escapeHTML(caseData.company)}</p>
          <h3 class="case-title-h">${escapeHTML(caseData.headline || caseData.title)}</h3>
          <p class="case-desc-h">${escapeHTML((caseData.intro || '').slice(0, 110))}...</p>
        </div>
      </div>`;
    card.addEventListener('click', () => openCase(id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openCase(id); });
    recCards.appendChild(card);
  });

  result.hidden = false;
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


// ── Context menu ─────────────────────────────────────────────────
function setupContextMenu() {
  const menu = document.getElementById('ctxMenu');

  function showMenu(x, y) {
    menu.style.left = Math.min(x, window.innerWidth - 220) + 'px';
    menu.style.top  = Math.min(y, window.innerHeight - 300) + 'px';
    menu.classList.add('visible');
  }
  function hideMenu() { menu.classList.remove('visible'); }

  // Desktop right-click
  document.addEventListener('contextmenu', e => {
    if (currentScreen !== 'screenPortfolio') return;
    e.preventDefault();
    clearTimeout(_lpTimer);
    _lpTimer = null;
    showMenu(e.clientX || _touchX, e.clientY || _touchY);
  });

  // Mobile long-press (500 ms)
  let _touchX = 0, _touchY = 0, _lpTimer = null;

  document.addEventListener('touchstart', e => {
    if (currentScreen !== 'screenPortfolio') return;
    if (e.touches.length !== 1) { clearTimeout(_lpTimer); return; }
    _touchX = e.touches[0].clientX;
    _touchY = e.touches[0].clientY;
    _lpTimer = setTimeout(() => {
      _lpTimer = null;
      showMenu(_touchX, _touchY);
    }, 500);
  }, { passive: true });

  const cancelLP = () => { clearTimeout(_lpTimer); _lpTimer = null; };
  document.addEventListener('touchend',    cancelLP, { passive: true });
  document.addEventListener('touchmove',   cancelLP, { passive: true });
  document.addEventListener('touchcancel', cancelLP, { passive: true });

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
  if (str == null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&quot;');
}

// ── Dev ref switcher (admin mode only) ──────────────────────────
const ADMIN_KEY = 'ldante';

function setupDevSwitcher() {
  const switcher = document.getElementById('devSwitcher');
  if (!switcher) return;

  // Remove any old persistent admin flag from previous builds
  try { localStorage.removeItem('ldg-admin'); } catch(e) {}

  // Detect ?admin=ldante — store in sessionStorage (tab-session only, not persistent)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === ADMIN_KEY) {
    try { sessionStorage.setItem('ldg-admin', '1'); } catch(e) {}
    const clean = new URL(window.location.href);
    clean.searchParams.delete('admin');
    window.history.replaceState({}, '', clean);
  }

  // Only activate if admin flag exists in this session
  const isAdmin = sessionStorage.getItem('ldg-admin') === '1';
  if (!isAdmin) return;

  // Reveal the switcher
  switcher.classList.add('admin-on');

  function syncActive() {
    const current = (new URLSearchParams(window.location.search).get('ref') || '').toLowerCase();
    switcher.querySelectorAll('.dev-ref-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.ref === current);
    });
  }

  switcher.querySelectorAll('.dev-ref-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ref = btn.dataset.ref;
      const url = new URL(window.location.href);
      if (ref) { url.searchParams.set('ref', ref); }
      else      { url.searchParams.delete('ref'); }
      window.history.replaceState({}, '', url);
      try { localStorage.setItem('ldg-experience', ref || 'standard'); } catch(e) {}

      syncActive();
      setupLanding(); // refresh greeting + body copy from new ref

      // If already in portfolio, update JD prefill + re-apply tile filter
      if (portfolioReady) {
        const jd = ref && TAILORED[ref] ? TAILORED[ref].jd || '' : '';
        prefillFitJD(jd);
        // Re-filter POV tiles for the new ref when in hiring-manager mode
        try {
          if (localStorage.getItem('ldg-role') === 'hiring-manager') {
            setupHiringManagerView();
            layoutMasonry();
          }
        } catch(e) {}
      }
    });
  });

  syncActive();
}

// ── Role switch (when portfolio already initialized) ────────────
function switchPortfolioRole(role) {
  try { localStorage.setItem('ldg-role', role); } catch(e) {}

  const recruiterPanel  = document.getElementById('recruiterPanel');
  const caseListPanel   = document.getElementById('caseListPanel');
  const caseDetailPanel = document.getElementById('caseDetailPanel');
  const fitPanel        = document.getElementById('fitPanel');

  // Close any open overlapping panels
  if (caseDetailPanel) caseDetailPanel.classList.remove('active');
  if (fitPanel)        fitPanel.classList.remove('active');
  returnPanel = 'caseListPanel';

  if (role === 'recruiter') {
    caseListPanel.classList.remove('hidden');
    recruiterPanel.classList.add('active');
    setupRecruiterPanel(); // idempotent — has its own guard
  } else {
    // hiring-manager
    recruiterPanel.classList.remove('active');
    caseListPanel.classList.remove('hidden');
    setupHiringManagerView(); // filters POV tiles; safe to call again
    layoutMasonry();          // re-layout after any tile visibility changes
  }
}

// ── Design System Mode (experimental) ────────────────────────────
function renderDSMode() {
  document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');

  const COLORS = [
    { name: 'Background',      token: '--bg',        bg: 'rgb(38,38,38)',          value: '#262626'             },
    { name: 'Background Dark', token: '--bg-darker',  bg: 'rgb(31,31,31)',          value: '#1F1F1F'             },
    { name: 'Pink',            token: '--pink',       bg: 'rgb(249,149,172)',       value: '#F995AC'             },
    { name: 'Magenta',         token: '--magenta',    bg: 'rgb(191,48,120)',        value: '#BF3078'             },
    { name: 'White',           token: '--white',      bg: 'rgb(255,255,255)',       value: '#FFFFFF'             },
    { name: 'White / 55%',     token: '--white-dim',  bg: 'rgba(255,255,255,0.55)', value: 'rgba(255,255,255,.55)' },
  ];

  const swatchesHTML = COLORS.map(c => `
    <div class="ds-swatch">
      <div class="ds-swatch-chip" style="background:${c.bg};"></div>
      <div class="ds-swatch-info">
        <div class="ds-swatch-name">${c.name}</div>
        <code class="ds-swatch-token">${c.token}</code>
        <span class="ds-swatch-value">${c.value}</span>
      </div>
    </div>`).join('');

  const TYPE_ROWS = [
    { role: 'Display',       spec: "Cal Sans \xB7 400\nclamp(3.5rem\u20138.75rem)\nls: \u22120.02em \xB7 lh: 1.0",    style: "font-family:'Cal Sans',sans-serif;font-size:2.75rem;line-height:1;letter-spacing:-0.02em;color:var(--ds-fg);",                                          sample: 'Aa' },
    { role: 'Section Title', spec: "Cal Sans \xB7 400\n1.75\u20132rem\nls: \u22120.02em \xB7 lh: 1.1",                style: "font-family:'Cal Sans',sans-serif;font-size:1.75rem;line-height:1.1;letter-spacing:-0.02em;color:var(--ds-fg);",                                         sample: 'Growing leaders' },
    { role: 'Body Large',    spec: "Golos Text \xB7 400\nclamp(1rem\u20131.875rem)\nls: \u22120.02em \xB7 lh: 1.5",   style: "font-family:'Golos Text',sans-serif;font-size:1.2rem;line-height:1.5;letter-spacing:-0.02em;color:var(--ds-fg);",                                        sample: 'I\u2019m Dante. I think in systems first, then UI.' },
    { role: 'Body',          spec: "Golos Text \xB7 400\n1rem \xB7 lh: 1.7",                                           style: "font-family:'Golos Text',sans-serif;font-size:1rem;line-height:1.7;color:var(--ds-fg-muted);",                                               sample: 'The rep doesn\u2019t want to browse. They want to know.' },
    { role: 'UI Default',    spec: "Inter \xB7 400\u2013500\n0.9375rem \xB7 lh: 1.5",                                  style: "font-family:'Inter',system-ui,sans-serif;font-size:0.9375rem;color:var(--ds-fg-dim);",                                                     sample: 'Senior Product Designer' },
    { role: 'Label',         spec: "Inter \xB7 600\n0.625\u20130.6875rem\nls: 0.1em \xB7 uppercase",                  style: "font-family:'Inter',system-ui,sans-serif;font-size:0.6875rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--pink);", sample: 'Point of View' },
  ];

  const typeHTML = TYPE_ROWS.map(r => `
    <div class="ds-type-row">
      <div class="ds-type-meta">
        <div class="ds-type-role">${r.role}</div>
        <div class="ds-type-spec">${r.spec.replace(/\n/g, '<br>')}</div>
      </div>
      <div style="${r.style}flex:1;">${r.sample}</div>
    </div>`).join('');

  const SKY_PHASES = [
    { name: 'Teal Horizon', slug: 'lattice',     bg: 'radial-gradient(ellipse 80% 60% at 20% 80%,rgba(0,128,128,.5) 0%,transparent 70%),linear-gradient(160deg,#001f1f 0%,#003d3d 50%,#001f1f 100%)' },
    { name: 'Ember',        slug: 'rippling',    bg: 'radial-gradient(ellipse 80% 60% at 20% 80%,rgba(255,90,0,.4) 0%,transparent 70%),linear-gradient(160deg,#0a0a0a 0%,#1a0f00 50%,#0a0a0a 100%)' },
    { name: 'Nebula',       slug: 'twitch',      bg: 'radial-gradient(ellipse 80% 60% at 20% 80%,rgba(145,71,255,.45) 0%,transparent 70%),radial-gradient(ellipse 60% 50% at 80% 30%,rgba(191,148,255,.2) 0%,transparent 70%),linear-gradient(160deg,#0e0e10 0%,#1f1f23 50%,#0e0e10 100%)' },
    { name: 'Midnight',     slug: 'circle',      bg: 'radial-gradient(ellipse 80% 60% at 20% 80%,rgba(0,120,210,.4) 0%,transparent 70%),linear-gradient(160deg,#050d1a 0%,#0a1a30 50%,#050d1a 100%)' },
    { name: 'Crimson',      slug: 'five9',       bg: 'radial-gradient(ellipse 80% 60% at 30% 70%,rgba(230,30,30,.35) 0%,transparent 70%),linear-gradient(160deg,#100000 0%,#1a0505 50%,#100000 100%)' },
    { name: 'Deep Current', slug: 'machinify',   bg: 'radial-gradient(ellipse 75% 55% at 25% 75%,rgba(0,160,140,.45) 0%,transparent 70%),radial-gradient(ellipse 50% 40% at 78% 28%,rgba(80,40,180,.2) 0%,transparent 70%),linear-gradient(155deg,#060e12 0%,#0b1e24 55%,#060e12 100%)' },
    { name: 'Cobalt',       slug: 'citrix',      bg: 'radial-gradient(ellipse 68% 50% at 22% 78%,rgba(0,100,210,.42) 0%,transparent 68%),radial-gradient(ellipse 45% 35% at 80% 24%,rgba(0,180,255,.14) 0%,transparent 68%),linear-gradient(155deg,#040810 0%,#071526 55%,#040810 100%)' },
    { name: 'Aurora',       slug: 'createmusic', bg: 'radial-gradient(ellipse 72% 55% at 22% 80%,rgba(140,50,200,.44) 0%,transparent 68%),radial-gradient(ellipse 45% 35% at 80% 22%,rgba(220,55,110,.22) 0%,transparent 68%),linear-gradient(155deg,#090510 0%,#14071e 55%,#090510 100%)' },
    { name: 'Sunrise',      slug: 'apollo',      bg: 'radial-gradient(ellipse 75% 55% at 22% 80%,rgba(255,100,20,.45) 0%,transparent 68%),radial-gradient(ellipse 50% 38% at 80% 25%,rgba(255,180,60,.18) 0%,transparent 68%),linear-gradient(155deg,#0d0700 0%,#1a0e00 55%,#0d0700 100%)' },
    { name: 'Jade',         slug: 'pagerduty',   bg: 'radial-gradient(ellipse 72% 55% at 20% 80%,rgba(6,172,56,.42) 0%,transparent 68%),radial-gradient(ellipse 45% 35% at 80% 22%,rgba(0,255,100,.12) 0%,transparent 68%),linear-gradient(155deg,#010d04 0%,#021a08 55%,#010d04 100%)' },
    { name: 'Glacier',      slug: 'ethyca',      bg: 'radial-gradient(ellipse 72% 55% at 20% 80%,rgba(0,140,180,.42) 0%,transparent 68%),radial-gradient(ellipse 45% 35% at 80% 22%,rgba(0,210,200,.15) 0%,transparent 68%),linear-gradient(155deg,#00090f 0%,#021018 55%,#00090f 100%)' },
    { name: 'Scarlet',      slug: 'ingram',      bg: 'radial-gradient(ellipse 72% 55% at 20% 80%,rgba(200,30,40,.42) 0%,transparent 68%),radial-gradient(ellipse 45% 35% at 80% 22%,rgba(255,80,60,.14) 0%,transparent 68%),linear-gradient(155deg,#0d0102 0%,#1a0304 55%,#0d0102 100%)' },
    { name: 'Ultraviolet',  slug: 'yahoo',       bg: 'radial-gradient(ellipse 72% 55% at 20% 80%,rgba(96,1,210,.50) 0%,transparent 68%),radial-gradient(ellipse 45% 35% at 80% 22%,rgba(150,60,255,.18) 0%,transparent 68%),linear-gradient(155deg,#060010 0%,#0e0020 55%,#060010 100%)' },
    { name: 'Nightfall',    slug: 'ucla',        bg: 'radial-gradient(ellipse 72% 55% at 20% 80%,rgba(0,59,115,.58) 0%,transparent 68%),radial-gradient(ellipse 45% 35% at 80% 22%,rgba(255,180,0,.14) 0%,transparent 68%),linear-gradient(155deg,#010508 0%,#020b14 55%,#010508 100%)' },
    { name: 'Blood Moon',   slug: 'roland',      bg: 'radial-gradient(ellipse 72% 55% at 20% 80%,rgba(210,15,25,.52) 0%,transparent 68%),radial-gradient(ellipse 45% 35% at 80% 22%,rgba(255,50,30,.12) 0%,transparent 68%),linear-gradient(155deg,#0d0000 0%,#1c0101 55%,#0d0000 100%)' },
    { name: 'Blueprint',    slug: '1password',   bg: 'radial-gradient(ellipse 72% 55% at 20% 80%,rgba(6,60,200,.50) 0%,transparent 68%),radial-gradient(ellipse 45% 35% at 80% 22%,rgba(100,150,255,.15) 0%,transparent 68%),linear-gradient(155deg,#020614 0%,#051840 55%,#020614 100%)' },
    { name: 'Live Más',     slug: 'tacobell',    bg: 'radial-gradient(ellipse 72% 55% at 20% 80%,rgba(112,32,130,.55) 0%,transparent 68%),radial-gradient(ellipse 45% 35% at 80% 22%,rgba(180,80,220,.18) 0%,transparent 68%),linear-gradient(155deg,#0d0018 0%,#1e0038 55%,#0d0018 100%)' },
  ];
  const skyHTML = SKY_PHASES.map(p => `
    <div class="ds-sky-swatch">
      <div class="ds-sky-chip" style="background:${p.bg};"></div>
      <div class="ds-sky-info">
        <div class="ds-sky-name">${p.name}</div>
        <div class="ds-sky-slug">${p.slug}</div>
      </div>
    </div>`).join('');

  const shell = document.createElement('div');
  shell.className = 'ds-shell';
  shell.innerHTML = `
    <div class="ds-topbar">
      <span class="ds-topbar-wordmark">Wallabee</span>
      <button class="ds-topbar-btn" id="dsMenuBtn" aria-label="Open navigation">☰</button>
    </div>
    <aside class="ds-sidebar">
      <button class="ds-sidebar-close" id="dsSidebarClose" aria-label="Close navigation">✕</button>
      <div class="ds-wordmark">Wallabee</div>
      <nav>
        <div class="ds-nav-group">
          <span class="ds-nav-label">Overview</span>
          <a class="ds-nav-link" data-target="ds-intro">Introduction</a>
        </div>
        <div class="ds-nav-group">
          <span class="ds-nav-label">Principles</span>
          <a class="ds-nav-link" data-target="ds-principles">Clarity Drives Everything</a>
        </div>
        <div class="ds-nav-group">
          <span class="ds-nav-label">Foundations</span>
          <a class="ds-nav-link" data-target="ds-color">Color</a>
          <a class="ds-nav-link" data-target="ds-type">Typography</a>
          <a class="ds-nav-link" data-target="ds-spacing">Spacing</a>
        </div>
        <div class="ds-nav-group">
          <span class="ds-nav-label">Components</span>
          <a class="ds-nav-link" data-target="ds-buttons">Role Buttons</a>
          <a class="ds-nav-link" data-target="ds-badges">Badges</a>
          <a class="ds-nav-link" data-target="ds-cards">Cards</a>
        </div>
        <div class="ds-nav-group">
          <span class="ds-nav-label">Animation</span>
          <a class="ds-nav-link" data-target="ds-motion-sky">Sky Phases</a>
          <a class="ds-nav-link" data-target="ds-motion-letters">Letter Motion</a>
          <a class="ds-nav-link" data-target="ds-motion-entry">Content Entry</a>
        </div>
        <div class="ds-nav-group">
          <span class="ds-nav-label">Patterns</span>
          <a class="ds-nav-link" data-target="ds-pat-stat-tiles">Stat Tiles</a>
          <a class="ds-nav-link" data-target="ds-pat-callouts">Callouts</a>
          <a class="ds-nav-link" data-target="ds-pat-pull-quote">Pull Quote</a>
          <a class="ds-nav-link" data-target="ds-pat-reframe">Reframe</a>
          <a class="ds-nav-link" data-target="ds-pat-inputs">Input Fields</a>
        </div>
      </nav>
      <div class="ds-sidebar-foot">
        <button class="ds-mode-toggle" id="dsModeToggle">
          <span class="ds-mode-toggle-icon">◑</span>
          <span id="dsModeLabel">Light mode</span>
        </button>
      </div>
    </aside>
    <main class="ds-main" id="dsMainScroll">

      <section class="ds-section" id="ds-intro">
        <div class="ds-eyebrow">Overview</div>
        <h1 class="ds-section-title">Wallabee</h1>
        <p class="ds-section-body">Wallabee is the design system behind ldante.com. The same discipline that built the Marketo Sky design system \u2014 50+ components, full-org adoption, governance that held through an Adobe acquisition \u2014 structures how this portfolio is built and maintained.</p>
        <p class="ds-section-body">This view documents the tokens, typography, and components that form Wallabee\u2019s visual language. It is a work in progress.</p>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-principles">
        <div class="ds-eyebrow">Principles</div>
        <h2 class="ds-section-title">Clarity Drives Everything</h2>
        <p class="ds-principle-lede">Most teams don\u2019t struggle because of a lack of ideas.<br>They struggle because of a lack of clarity.</p>
        <div class="ds-principle-chain">
          <p>Unclear problems lead to weak decisions.</p>
          <p>Weak decisions lead to slow execution.</p>
          <p>Slow execution leads to missed outcomes.</p>
        </div>
        <div class="ds-principle-resolution">
          <p>My role is to remove that ambiguity.</p>
          <p>To align teams around what matters.</p>
          <p>To turn direction into action.</p>
          <p>And to ship products that perform.</p>
        </div>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-color">
        <div class="ds-eyebrow">Foundations</div>
        <h2 class="ds-section-title">Color</h2>
        <p class="ds-section-body">Six tokens cover the full palette. The system is intentionally minimal \u2014 dark backgrounds, one warm accent, and white at two opacities for text hierarchy.</p>
        <div class="ds-swatch-grid">${swatchesHTML}</div>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-type">
        <div class="ds-eyebrow">Foundations</div>
        <h2 class="ds-section-title">Typography</h2>
        <p class="ds-section-body">Three families, three roles. Cal Sans handles display and headings \u2014 it has one weight and earns every headline. Golos Text owns body copy. Inter runs the UI layer: labels, metadata, interface copy.</p>
        ${typeHTML}
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-spacing">
        <div class="ds-eyebrow">Foundations</div>
        <h2 class="ds-section-title">Spacing</h2>
        <p class="ds-section-body">The system uses <span class="ds-inline-code">clamp()</span> for responsive spacing rather than fixed breakpoints. Key values scale between a mobile minimum and a desktop maximum, maintaining proportional rhythm at any viewport width.</p>
        <table class="ds-spec-table">
          <thead><tr><th>Name</th><th>Value</th><th>Usage</th></tr></thead>
          <tbody>
            <tr><td>Page edge</td><td><code>clamp(32px, 8vw, 120px)</code></td><td>Outer horizontal padding on all screens</td></tr>
            <tr><td>Page top</td><td><code>clamp(40px, 6vw, 80px)</code></td><td>Top padding on gate and landing screens</td></tr>
            <tr><td>Grid gap</td><td><code>clamp(12px, 1.5vw, 20px)</code></td><td>Case study grid cell spacing</td></tr>
            <tr><td>Component gap</td><td><code>16\u201324px</code></td><td>Gap between inline elements and button groups</td></tr>
          </tbody>
        </table>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-buttons">
        <div class="ds-eyebrow">Components</div>
        <h2 class="ds-section-title">Role Buttons</h2>
        <p class="ds-section-body">The primary interactive surface on the landing screen. Padding-based sizing scales responsively with no fixed height. Two variants \u2014 Recruiter and Hiring Manager \u2014 share identical structure.</p>
        <div class="ds-canvas">
          <div style="display:flex;gap:16px;flex-wrap:wrap;">
            <button class="role-btn" style="pointer-events:none;">Recruiter</button>
            <button class="role-btn" style="pointer-events:none;">Hiring Manager</button>
          </div>
        </div>
        <div class="ds-canvas-label">Default state</div>
        <table class="ds-spec-table" style="margin-top:20px;">
          <thead><tr><th>Property</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>Font family</td><td><code>Golos Text</code></td></tr>
            <tr><td>Font weight</td><td><code>600</code></td></tr>
            <tr><td>Font size</td><td><code>clamp(1.2rem, 3vw, 3.125rem)</code></td></tr>
            <tr><td>Padding</td><td><code>clamp(12px,1.5vw,20px) clamp(24px,3vw,40px)</code></td></tr>
            <tr><td>Background</td><td><code>--bg-darker</code></td></tr>
            <tr><td>Border radius</td><td><code>8px</code></td></tr>
            <tr><td>Hover</td><td>Scale 1.03 \xB7 background lightens</td></tr>
            <tr><td>Active</td><td>Scale 0.97</td></tr>
          </tbody>
        </table>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-badges">
        <div class="ds-eyebrow">Components</div>
        <h2 class="ds-section-title">Badges</h2>
        <p class="ds-section-body">Small uppercase labels that categorize content tiles. Case study cards use <span class="ds-inline-code">.case-study-badge</span>; thought tiles use <span class="ds-inline-code">.thought-tile-badge</span>. Both share the same typographic spec \u2014 Inter 600, 10px, wide tracking \u2014 but live in different visual contexts.</p>
        <div class="ds-canvas" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
          <span class="thought-tile-badge" style="position:static;opacity:1;">Thoughts</span>
          <span class="thought-tile-badge" style="position:static;opacity:1;">Perspective</span>
          <span class="case-study-badge" style="position:static;opacity:1;">Case Study</span>
        </div>
        <div class="ds-canvas-label">Badge variants</div>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-cards">
        <div class="ds-eyebrow">Components</div>
        <h2 class="ds-section-title">Cards</h2>
        <p class="ds-section-body">The portfolio grid uses four card types, all sharing a common <span class="ds-inline-code">.case-item</span> wrapper and participating in the masonry layout. Card type is determined by a modifier class.</p>
        <table class="ds-spec-table">
          <thead><tr><th>Variant</th><th>Class</th><th>Hero treatment</th></tr></thead>
          <tbody>
            <tr><td>Case Study</td><td><code>.case-item--cs</code></td><td>Photo, lazy-loaded</td></tr>
            <tr><td>Thought</td><td><code>.case-item--thought</code></td><td>Photo with gradient overlay</td></tr>
            <tr><td>POV</td><td><code>.thought-tile--pov</code></td><td>CSS radial gradient per brand</td></tr>
            <tr><td>Photo</td><td><code>.case-item--photo</code></td><td>Grayscale \u2192 color on hover</td></tr>
          </tbody>
        </table>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-motion-sky">
        <div class="ds-eyebrow">Animation</div>
        <h2 class="ds-section-title">Sky phases</h2>
        <p class="ds-section-body">The POV tile backgrounds are a family of gradient atmospheres \u2014 each one a unique composition of radial glows over a near-black field. They read as dark and calm but carry enough color identity to feel distinct from each other and anchored to their brand.</p>
        <div class="ds-sky-grid">${skyHTML}</div>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-motion-letters">
        <div class="ds-eyebrow">Animation</div>
        <h2 class="ds-section-title">Letter motion</h2>
        <p class="ds-section-body">On the gate screen, the hero headline is split into individual character spans. Cursor movement pushes letters away using a velocity-drag physics model \u2014 letters carry mouse momentum, not just react to proximity. On reset, they return home with an elastic spring.</p>
        <div class="ds-canvas" style="cursor:default;" id="dsLetterCanvas">
          <div id="dsLetterDemo" style="font-family:'Cal Sans',sans-serif;font-size:2rem;line-height:1.2;letter-spacing:-0.02em;color:#fff;user-select:none;"></div>
        </div>
        <div class="ds-canvas-label">Hover to interact \xB7 mouse leave springs back</div>
        <table class="ds-spec-table" style="margin-top:20px;">
          <thead><tr><th>Property</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>Repulsion radius</td><td><code>130px</code></td></tr>
            <tr><td>Force model</td><td><code>velocity drag + outward nudge</code></td></tr>
            <tr><td>Max rotation</td><td><code>\xB152\xB0</code></td></tr>
            <tr><td>Reset duration</td><td><code>1100ms</code></td></tr>
            <tr><td>Reset easing</td><td><code>easeOutElastic (p\u202F=\u202F0.42)</code></td></tr>
          </tbody>
        </table>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-motion-entry">
        <div class="ds-eyebrow">Animation</div>
        <h2 class="ds-section-title">Content entry</h2>
        <p class="ds-section-body">When portfolio content loads, child elements enter with a staggered fade-up. Each item translates from 12px below and fades from opacity 0, with 50ms of stagger between children. The easing is a fast ease-out that gives the motion a settled, confident feel.</p>
        <div class="ds-canvas" id="dsEntryCanvas"></div>
        <div class="ds-canvas-label"><button class="ds-replay-btn" id="dsReplayBtn">Replay</button></div>
        <table class="ds-spec-table" style="margin-top:20px;">
          <thead><tr><th>Property</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>Enter from</td><td><code>translateY(12px) \xB7 opacity 0</code></td></tr>
            <tr><td>Duration</td><td><code>380ms</code></td></tr>
            <tr><td>Easing</td><td><code>cubic-bezier(0.22, 1, 0.36, 1)</code></td></tr>
            <tr><td>Stagger</td><td><code>50ms per child</code></td></tr>
          </tbody>
        </table>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-pat-stat-tiles">
        <div class="ds-eyebrow">Patterns</div>
        <h2 class="ds-section-title">Stat Tiles</h2>
        <p class="ds-section-body">Case study headers lead with outcomes, not context. Each tile pairs a display-scale number with a short label. The value renders in Cal Sans at fluid display size; the label uses Inter at caption scale. Tiles are a flex row that wraps at mobile widths.</p>
        <div class="ds-canvas">
          <div class="cd-metrics" style="margin-bottom:0;">
            <div class="cd-metric"><span class="cd-metric-value">2\xD7</span><span class="cd-metric-label">Faster to insight</span></div>
            <div class="cd-metric"><span class="cd-metric-value">94%</span><span class="cd-metric-label">Adoption rate</span></div>
            <div class="cd-metric"><span class="cd-metric-value">50+</span><span class="cd-metric-label">Components shipped</span></div>
          </div>
        </div>
        <div class="ds-canvas-label">Three stat tiles at rest</div>
        <table class="ds-spec-table" style="margin-top:20px;">
          <thead><tr><th>Property</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>Value font</td><td><code>Cal Sans \xB7 clamp(1.8rem, 2.6vw, 2.8rem)</code></td></tr>
            <tr><td>Label font</td><td><code>Inter 500 \xB7 0.7rem \xB7 letter-spacing 0.02em</code></td></tr>
            <tr><td>Container</td><td><code>border-radius 14px \xB7 padding 18px 24px</code></td></tr>
            <tr><td>Gap</td><td><code>10px</code></td></tr>
          </tbody>
        </table>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-pat-callouts">
        <div class="ds-eyebrow">Patterns</div>
        <h2 class="ds-section-title">Callouts</h2>
        <p class="ds-section-body">Used inside case study narrative to lift a key insight or reframe out of the body copy. The default variant is neutral \u2014 a muted background with a left border. The problem variant signals a constraint or tension using an orange accent.</p>
        <div class="ds-canvas" style="display:flex;flex-direction:column;gap:16px;">
          <div class="cs-callout">
            <div class="cs-callout-label">The reframe that changed the brief</div>
            <p class="cd-body" style="font-size:14px;margin-bottom:0;color:rgba(255,255,255,0.68);">From: \u201CHow do we display the data?\u201D To: \u201CHow do we get the user straight to the conversation?\u201D Those are fundamentally different products.</p>
          </div>
          <div class="cs-callout cs-callout--problem">
            <div class="cs-callout-label">The constraint</div>
            <p class="cd-body" style="font-size:14px;margin-bottom:0;color:rgba(255,255,255,0.68);">Without authority over what enters the system, every team becomes a de facto exception. The model that produced the components needed to change first.</p>
          </div>
        </div>
        <div class="ds-canvas-label">Default callout \xB7 Problem callout</div>
        <table class="ds-spec-table" style="margin-top:20px;">
          <thead><tr><th>Variant</th><th>Class</th><th>Border color</th></tr></thead>
          <tbody>
            <tr><td>Default</td><td><code>.cs-callout</code></td><td><code>rgba(255,255,255,0.15)</code></td></tr>
            <tr><td>Problem</td><td><code>.cs-callout--problem</code></td><td><code>#ea580c</code></td></tr>
          </tbody>
        </table>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-pat-pull-quote">
        <div class="ds-eyebrow">Patterns</div>
        <h2 class="ds-section-title">Pull Quote</h2>
        <p class="ds-section-body">A heavier editorial moment than a callout \u2014 used when a single statement is strong enough to stand alone. Cal Sans at 1.15rem gives it display weight without competing with section headings. The left border is three pixels versus two for callouts.</p>
        <div class="ds-canvas">
          <div class="cs-pull-quote">
            <p class="cs-pull-quote-text">\u201CYou can\u2019t document your way to adoption. You have to build it into the org model.\u201D</p>
            <p class="cs-pull-quote-attr"><strong>Dante</strong> \xB7 Marketo Sky case study</p>
          </div>
        </div>
        <div class="ds-canvas-label">Pull quote with attribution</div>
        <table class="ds-spec-table" style="margin-top:20px;">
          <thead><tr><th>Property</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>Quote font</td><td><code>Cal Sans \xB7 1.15rem \xB7 line-height 1.5</code></td></tr>
            <tr><td>Attribution</td><td><code>Inter 500 \xB7 12px</code></td></tr>
            <tr><td>Left border</td><td><code>3px solid rgba(255,255,255,0.25)</code></td></tr>
            <tr><td>Padding</td><td><code>28px 32px</code></td></tr>
          </tbody>
        </table>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-pat-reframe">
        <div class="ds-eyebrow">Patterns</div>
        <h2 class="ds-section-title">Reframe</h2>
        <p class="ds-section-body">A two-column contrast component used to show how a problem was repositioned before design work began. The \u201Cbefore\u201D column is dimmed and reads as the old framing; the \u201Cafter\u201D column is brighter and reads as the new brief. The visual hierarchy communicates the argument before the user reads the words.</p>
        <div class="ds-canvas">
          <div class="cd-reframe">
            <div class="cd-reframe-from"><span class="cd-reframe-label">Before</span>How do we display payroll data?</div>
            <div class="cd-reframe-to"><span class="cd-reframe-label">After</span>How do we get leads straight to analysis \u2014 and straight to the conversation?</div>
          </div>
        </div>
        <div class="ds-canvas-label">Before / After reframe</div>
        <table class="ds-spec-table" style="margin-top:20px;">
          <thead><tr><th>Column</th><th>Background</th><th>Text opacity</th></tr></thead>
          <tbody>
            <tr><td>Before</td><td><code>rgba(255,255,255,0.03)</code></td><td><code>0.35</code></td></tr>
            <tr><td>After</td><td><code>rgba(255,255,255,0.06)</code></td><td><code>1.0 (white)</code></td></tr>
          </tbody>
        </table>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-pat-inputs">
        <div class="ds-eyebrow">Patterns</div>
        <h2 class="ds-section-title">Input Fields</h2>
        <p class="ds-section-body">The primary input surface is the gate screen password field \u2014 a full-height flex row pairing a text input with a submit button. The input uses <span class="ds-inline-code">--bg-darker</span> at rest and lightens on focus. The button uses the brand pink with a scale hover and active state.</p>
        <div class="ds-canvas">
          <div style="max-width:480px;">
            <div class="gate-input-row" style="height:56px;border-radius:8px;">
              <input class="gate-pw-input" type="text" placeholder="Enter password" style="pointer-events:none;border-radius:8px 0 0 8px;font-size:1rem;" tabindex="-1">
              <button class="gate-go-btn" style="pointer-events:none;font-size:1rem;border-radius:0 8px 8px 0;">Go</button>
            </div>
          </div>
        </div>
        <div class="ds-canvas-label">Password input \xB7 default state</div>
        <table class="ds-spec-table" style="margin-top:20px;">
          <thead><tr><th>Property</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>Height</td><td><code>clamp(64px, 8vw, 100px)</code></td></tr>
            <tr><td>Input background</td><td><code>--bg-darker</code> \xB7 <code>rgb(45,45,45)</code> on focus</td></tr>
            <tr><td>Placeholder</td><td><code>rgba(255,255,255,0.3)</code></td></tr>
            <tr><td>Button background</td><td><code>var(--pink)</code> \xB7 hover lightens</td></tr>
            <tr><td>Button hover</td><td>Scale <code>1.03</code></td></tr>
            <tr><td>Button active</td><td>Scale <code>0.97</code></td></tr>
          </tbody>
        </table>
      </section>

    </main>
    <div class="ds-drawer-backdrop" id="dsBackdrop"></div>`;

  document.body.appendChild(shell);

  // Smooth scroll nav
  shell.querySelectorAll('.ds-nav-link[data-target]').forEach(link => {
    link.addEventListener('click', () => {
      const target = shell.querySelector('#' + link.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Light / dark mode toggle
  const modeToggle = shell.querySelector('#dsModeToggle');
  const modeLabel  = shell.querySelector('#dsModeLabel');
  modeToggle.addEventListener('click', () => {
    const isLight = shell.classList.toggle('ds-light');
    modeLabel.textContent = isLight ? 'Dark mode' : 'Light mode';
  });

  // Mobile drawer
  const dsSidebar  = shell.querySelector('.ds-sidebar');
  const dsBackdrop = shell.querySelector('#dsBackdrop');
  const dsMenuBtn  = shell.querySelector('#dsMenuBtn');
  const dsCloseBtn = shell.querySelector('#dsSidebarClose');
  function dsOpenDrawer()  { dsSidebar.classList.add('ds-open');    dsBackdrop.classList.add('ds-open'); }
  function dsCloseDrawer() { dsSidebar.classList.remove('ds-open'); dsBackdrop.classList.remove('ds-open'); }
  if (dsMenuBtn)  dsMenuBtn.addEventListener('click', dsOpenDrawer);
  if (dsCloseBtn) dsCloseBtn.addEventListener('click', dsCloseDrawer);
  if (dsBackdrop) dsBackdrop.addEventListener('click', dsCloseDrawer);
  // Close drawer when any nav link is tapped
  shell.querySelectorAll('.ds-nav-link[data-target]').forEach(l =>
    l.addEventListener('click', dsCloseDrawer)
  );

  // Active link via IntersectionObserver
  const mainEl = shell.querySelector('#dsMainScroll');
  const sections = shell.querySelectorAll('.ds-section[id]');
  const navLinks = shell.querySelectorAll('.ds-nav-link[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('ds-active'));
        const active = shell.querySelector(`.ds-nav-link[data-target="${entry.target.id}"]`);
        if (active) active.classList.add('ds-active');
      }
    });
  }, { root: mainEl, threshold: 0.25 });
  sections.forEach(s => observer.observe(s));

  // ── Letter motion demo ────────────────────────────────
  (function initLetterDemo() {
    const demo = shell.querySelector('#dsLetterDemo');
    const canvas = shell.querySelector('#dsLetterCanvas');
    if (!demo || !canvas) return;

    Array.from('Product Designer').forEach(ch => {
      const s = document.createElement('span');
      s.className = ch === ' ' ? 'ds-fl-sp' : 'ds-fl';
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      demo.appendChild(s);
    });

    const letters = Array.from(demo.querySelectorAll('.ds-fl'));
    const ITEMS = [];
    function cache() {
      ITEMS.length = 0;
      letters.forEach((el, i) => {
        const prev = el.style.transform;
        el.style.transform = 'none';
        const r = el.getBoundingClientRect();
        ITEMS.push({ el, cx: r.left + r.width/2, cy: r.top + r.height/2, ox: 0, oy: 0, rotSign: i%2 ? 1 : -1 });
        el.style.transform = prev;
      });
    }
    setTimeout(cache, 120);

    function applyFL(item) {
      const d = Math.sqrt(item.ox*item.ox + item.oy*item.oy);
      const rot = Math.min(d*0.28, 52) * item.rotSign;
      item.el.style.transform = `translate(${item.ox.toFixed(1)}px,${item.oy.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`;
    }

    let prevX = null, prevY = null;
    canvas.addEventListener('mousemove', e => {
      if (!ITEMS.length) cache();
      const cx = e.clientX, cy = e.clientY;
      const dmx = prevX != null ? cx - prevX : 0;
      const dmy = prevY != null ? cy - prevY : 0;
      prevX = cx; prevY = cy;
      for (const item of ITEMS) {
        const dx = cx - (item.cx + item.ox);
        const dy = cy - (item.cy + item.oy);
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist >= 130) continue;
        const t = Math.pow((130 - dist) / 130, 1.3);
        const drag = Math.min(t * 0.92, 0.78);
        const nudge = t * 0.2;
        const nx = dist > 1 ? dx/dist : 0, ny = dist > 1 ? dy/dist : 0;
        item.ox += dmx * drag + nx * nudge;
        item.oy += dmy * drag + ny * nudge;
        item.ox = Math.max(-70, Math.min(70, item.ox));
        item.oy = Math.max(-50, Math.min(50, item.oy));
        applyFL(item);
      }
    });
    canvas.addEventListener('mouseleave', () => {
      prevX = null; prevY = null;
      function eoeFL(t) {
        if (t <= 0) return 0; if (t >= 1) return 1;
        const p = 0.42;
        return Math.pow(2, -10*t) * Math.sin((t - p/4) * (2*Math.PI) / p) + 1;
      }
      ITEMS.forEach(item => {
        if (!item.ox && !item.oy) return;
        const rsOx = item.ox, rsOy = item.oy;
        const DUR = 1100, t0 = performance.now();
        function tick(now) {
          const t = Math.min((now - t0) / DUR, 1);
          const e = eoeFL(t);
          item.ox = rsOx * (1 - e); item.oy = rsOy * (1 - e);
          applyFL(item);
          if (t < 1) requestAnimationFrame(tick);
          else { item.ox = 0; item.oy = 0; item.el.style.transform = ''; }
        }
        requestAnimationFrame(tick);
      });
    });
  })();

  // ── Content entry demo ────────────────────────────────
  (function initEntryDemo() {
    const canvas = shell.querySelector('#dsEntryCanvas');
    const btn = shell.querySelector('#dsReplayBtn');
    if (!canvas || !btn) return;

    function play() {
      canvas.innerHTML = '';
      canvas.classList.remove('content-entering');
      [
        ['ds-entry-badge', 'Case Study'],
        ['ds-entry-title', 'Payroll Reporting System'],
        ['ds-entry-body',  'Unified fragmented workflows across 100+ employee-owned businesses. Saved $3.1M annually by replacing a manual reporting process with a purpose-built dashboard.'],
        ['ds-entry-meta',  'Teamshares \xB7 2023'],
      ].forEach(([cls, text]) => {
        const el = document.createElement('div');
        el.className = cls; el.textContent = text;
        canvas.appendChild(el);
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => canvas.classList.add('content-entering'));
      });
    }
    play();
    btn.addEventListener('click', play);
  })();
}

// ── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Capture ?p= before setupGate() cleans it from the URL
  const incomingPw = new URLSearchParams(window.location.search).get('p');

  // Experimental design system view — bypasses auth entirely
  if (incomingPw === 'designsystems') {
    renderDSMode();
    return;
  }

  setupGate();
  setupDevSwitcher();

  // Role buttons — wired once at startup, always available no matter which
  // screen the user is on when they reach the landing screen.
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      try { localStorage.setItem('ldg-role', role); } catch(e) {}
      showScreen('screenPortfolio');
      if (portfolioReady) {
        switchPortfolioRole(role);
      } else {
        setupPortfolio(role);
      }
    });
  });

  // Restore a previous authenticated session.
  // Skip entirely when arriving via ?p= — the gate auth flow owns the session.
  if (!incomingPw) try {
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
  } catch(e) {} // end session restore
});
