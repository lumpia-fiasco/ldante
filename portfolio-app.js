/* ═══════════════════════════════════════════════════════════════
   LDante Portfolio -- App Logic
   Handles: gate, landing, masonry, case studies, chat, fit, context menu
═══════════════════════════════════════════════════════════════ */

'use strict';

// ── Wallabee token store ──────────────────────────────────────────
// Single source of truth for all design tokens.
// wallabeeApply() sets them as CSS custom properties on :root so
// every element using var(--token) updates immediately. Edits in
// the DS color picker call wallabeeSet(), which also persists to
// localStorage so overrides survive page reloads.
const WALLABEE_TOKENS = {
  '--bg':        '#262626',
  '--bg-darker': '#1f1f1f',
  '--pink':      '#f995ac',
  '--magenta':   '#bf3078',
  '--white':     '#ffffff',
  '--white-dim': 'rgba(255,255,255,0.55)',
};
const WALLABEE_LS_KEY = 'wallabee-token-overrides';

function wallabeeGetActive() {
  try {
    const o = JSON.parse(localStorage.getItem(WALLABEE_LS_KEY) || '{}');
    return { ...WALLABEE_TOKENS, ...o };
  } catch { return { ...WALLABEE_TOKENS }; }
}
function wallabeeApply(tokens) {
  Object.entries(tokens || wallabeeGetActive()).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v);
  });
}
function wallabeeSet(name, value) {
  try {
    const o = JSON.parse(localStorage.getItem(WALLABEE_LS_KEY) || '{}');
    o[name] = value;
    localStorage.setItem(WALLABEE_LS_KEY, JSON.stringify(o));
  } catch {}
  document.documentElement.style.setProperty(name, value);
}
function wallabeeReset() {
  localStorage.removeItem(WALLABEE_LS_KEY);
  wallabeeApply(WALLABEE_TOKENS);
}
function _rgbToHex(rgb) {
  const m = (rgb || '').match(/\d+/g);
  if (!m || m.length < 3) return rgb;
  return '#' + m.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
}

// ── Tailored landing config ────────────────────────────────────
const TAILORED = {  five9: {
    greeting: "Hello, Five9 team.",
    body: "I'm Dante. I've spent years building complex, data-rich applications for power users.\n\nDesign systems, multi-persona platforms, and the craft details that compound over an eight-hour shift.",
    jd: "Senior Product Designer\nFive9\n\nShape the user experience of Five9's cloud contact center platform, advocating for Agent, Supervisor, and Admin personas. Lead design from concept to launch for complex, data-rich applications. Contribute to and maintain the design system, ensuring consistency across all products. Drive the \"one platform\" strategy to create a seamless, integrated experience. Mentor other designers.\n\n5+ years on complex, data-rich applications. Proficiency in Figma, Sketch, Adobe. Web and mobile design principles. User research and usability testing. Strong communication and collaboration.",
  },
  designsystems: {
    greeting: "Here for the systems.",
    body: "I'm Dante. I build design systems that travel well — from Figma variables to code tokens, from component specs to Code Connect mappings.\n\nThe interesting part isn't the component library. It's the structure beneath it: the token decisions that make the library coherent, the file organization that makes it legible to teammates and AI agents alike, and the Code Connect mappings that close the gap between design intent and implementation.",
    jd: '',
  },
};

// ── JD prefill helper ─────────────────────────────────────────
function prefillFitJD(text) {
  ['fitTextarea'].forEach(id => {
    const ta = document.getElementById(id);
    if (!ta) return;
    ta.value = text;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

const GENERAL_GREETING = "I'm Dante.";
const GENERAL_BODY = "Product Designer with over a decade of experience in B2B SaaS, devops tooling, and enterprise platforms.\n\nI design at the intersection of complex systems and real user needs — work that increasingly means integrating AI into product workflows, and designing applications that leverage agentic systems.";

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

// ── Push-from-below: gate → landing transition ─────────────────
// Landing rises from 100vh (below fold); gate drifts up and fades.
// Logo stays fixed above both screens throughout.
function pushToLanding() {
  const gate    = document.getElementById('screenGate');
  const landing = document.getElementById('screenLanding');

  // Snap landing below viewport — don't add .active yet (its transform:none!important would fight us)
  landing.classList.remove('enter-up', 'exit-up', 'exit-down');
  landing.style.transition   = 'none';
  landing.style.transform    = 'translateY(100vh)';
  landing.style.opacity      = '1';
  landing.style.pointerEvents = 'none';
  void landing.offsetHeight; // flush reflow before animating

  // Spring landing up into view
  landing.style.transition = 'transform 0.65s cubic-bezier(0.22,1,0.36,1)';
  landing.style.transform  = 'translateY(0)';

  // Gate drifts up and fades — the "pushed" feeling
  gate.style.transition = 'transform 0.55s cubic-bezier(0.55,0,1,0.45), opacity 0.4s ease';
  gate.style.transform  = 'translateY(-40px)';
  gate.style.opacity    = '0';

  setTimeout(() => {
    gate.classList.remove('active');
    gate.style.cssText = '';         // restore to class-driven state
    landing.classList.add('active'); // opacity:1, pointer-events:auto, transform:none!important
    landing.style.cssText = '';      // let .active take over cleanly
  }, 700);

  currentScreen = 'screenLanding';
  try { localStorage.setItem('ldg-screen', 'screenLanding'); } catch(e) {}
}

// ── Param gate helpers ─────────────────────────────────────────
let _paramIntroVisible = false;
let _paramScrollBound  = false;
let _paramGateReady    = false; // true after countdown completes first reveal
let _paramAnimating    = false; // true while a transition is in flight — blocks re-entry

// Circular countdown (3 s) — calls onComplete when done
function runParamCountdown(onComplete) {
  const wrap   = document.getElementById('paramCountdown');
  const prog   = document.getElementById('cdProgress');
  const numEl  = document.getElementById('cdNumber');
  const C      = 175.93; // 2π × 28

  wrap.removeAttribute('hidden');
  prog.style.strokeDashoffset = C;
  numEl.textContent = '3';

  let tick = 0;
  const iv = setInterval(() => {
    tick++;
    const rem = 3 - tick;
    prog.style.strokeDashoffset = C * (rem / 3);
    numEl.textContent = rem > 0 ? rem : '';

    if (tick >= 3) {
      clearInterval(iv);
      setTimeout(() => {
        wrap.classList.add('fading');
        setTimeout(() => {
          wrap.hidden = true;
          wrap.classList.remove('fading');
          onComplete();
        }, 320);
      }, 250);
    }
  }, 1000);
}

// Push gate-inner up, slide param intro in from below
function revealParamIntro() {
  if (_paramAnimating) return;
  _paramAnimating = true;
  _paramGateReady = true;

  const gateInner = document.querySelector('#screenGate .gate-inner');
  const paramEl   = document.getElementById('gateParamContent');

  // Un-hide the overlay; CSS default starts it at translateY(100vh)
  paramEl.removeAttribute('hidden');
  void paramEl.offsetHeight; // flush so browser captures the CSS starting position

  // Slide intro up — keep inline transform set so CSS 100vh default doesn't snap back
  paramEl.style.transition = 'transform 0.65s cubic-bezier(0.22,1,0.36,1)';
  paramEl.style.transform  = 'translateY(0)';

  // Gate-inner drifts up and fades
  gateInner.style.transition = 'transform 0.55s cubic-bezier(0.55,0,1,0.45), opacity 0.4s ease';
  gateInner.style.transform  = 'translateY(-40px)';
  gateInner.style.opacity    = '0';

  setTimeout(() => {
    gateInner.style.pointerEvents = 'none';
    paramEl.style.transition = '';
    // NOTE: intentionally do NOT clear paramEl.style.transform here.
    // Clearing it reverts to the CSS default translateY(100vh) and snaps content off-screen.
    // hideParamIntro() will override it when the user navigates back.

    // Stagger in the copy blocks and button
    const blocks = paramEl.querySelectorAll('.landing-text-block');
    blocks.forEach((b, i) => setTimeout(() => b.classList.add('visible'), 80 + i * 150));
    setTimeout(() => paramEl.querySelector('.landing-btns').classList.add('visible'), 480);

    _paramIntroVisible = true;
    _paramAnimating    = false;
  }, 700);
}

// Reverse: slide intro back down, return gate-inner to view
function hideParamIntro() {
  if (!_paramIntroVisible || _paramAnimating) return;
  _paramAnimating    = true;
  _paramIntroVisible = false;

  const gateInner = document.querySelector('#screenGate .gate-inner');
  const paramEl   = document.getElementById('gateParamContent');

  // Intro slides back down
  paramEl.style.transition = 'transform 0.55s cubic-bezier(0.55,0,1,0.45)';
  paramEl.style.transform  = 'translateY(100vh)';

  // Gate-inner returns
  gateInner.style.pointerEvents = '';
  gateInner.style.transition = 'transform 0.65s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease';
  gateInner.style.transform  = 'translateY(0)';
  gateInner.style.opacity    = '1';

  setTimeout(() => {
    paramEl.hidden = true;
    paramEl.style.transition = '';
    paramEl.style.transform  = ''; // safe to clear now — element is hidden, so CSS 100vh default is irrelevant
    gateInner.style.transition = '';

    // Reset visible classes so stagger re-runs on next reveal
    paramEl.querySelectorAll('.landing-text-block').forEach(b => b.classList.remove('visible'));
    paramEl.querySelector('.landing-btns').classList.remove('visible');

    _paramAnimating = false;
  }, 700);
}

// Wire scroll gestures on the gate — scroll up returns to "I design systems",
// scroll down returns to the param intro (once it has been revealed once).
function setupParamScrollBack() {
  if (_paramScrollBound) return;
  _paramScrollBound = true;

  const gate    = document.getElementById('screenGate');
  const paramEl = document.getElementById('gateParamContent');

  // Wheel: up at top of param → hide; down on gate-inner → reveal
  gate.addEventListener('wheel', (e) => {
    if (_paramIntroVisible && e.deltaY < 0 && paramEl.scrollTop === 0) {
      hideParamIntro();
    } else if (!_paramIntroVisible && _paramGateReady && e.deltaY > 0) {
      revealParamIntro();
    }
  }, { passive: true });

  // Touch: swipe down at top of param → hide; swipe up on gate-inner → reveal
  let _ty = 0;
  gate.addEventListener('touchstart', (e) => { _ty = e.touches[0].clientY; }, { passive: true });
  gate.addEventListener('touchmove', (e) => {
    const dy = e.touches[0].clientY - _ty;
    if (_paramIntroVisible && paramEl.scrollTop === 0 && dy > 56) {
      hideParamIntro();
      _ty = e.touches[0].clientY;
    } else if (!_paramIntroVisible && _paramGateReady && dy < -56) {
      revealParamIntro();
      _ty = e.touches[0].clientY;
    }
  }, { passive: true });
}

// ── Param gate: show countdown then reveal tailored intro in gate ──
// Called when a visitor arrives with a valid ?ref= param and no prior auth.
function setupParamGate(ref) {
  const tailored = TAILORED[ref];

  // Save auth & experience so session restore works on return visits
  try {
    localStorage.setItem('ldg-auth', '1');
    localStorage.setItem('ldg-experience', ref);
  } catch(e) {}
  showExitBtn();

  // Hide password block
  const pwBlock = document.getElementById('gateInputRow').closest('div');
  if (pwBlock) pwBlock.hidden = true;

  // Pre-populate intro copy (element stays hidden until countdown ends)
  document.getElementById('gateParamGreeting').textContent = tailored.greeting;
  document.getElementById('gateParamBody').innerHTML =
    tailored.body.split('\n\n').map(p => p.replace(/\n/g, ' ')).join('<br><br>');

  // Wire scroll-back gesture
  setupParamScrollBack();

  // Run countdown, then reveal
  runParamCountdown(() => revealParamIntro());
}

// ── Gate logic ─────────────────────────────────────────────────
function setupGate() {
  const resetBtn = document.getElementById('resetBtn');

  // Param mode: ?ref= links bypass the password field and show tailored intro directly
  const paramRef = new URLSearchParams(window.location.search).get('ref');
  if (paramRef && TAILORED[paramRef.toLowerCase()] && localStorage.getItem('ldg-auth') !== '1') {
    setupParamGate(paramRef.toLowerCase());
    setupGateFloat(resetBtn);
    return;
  }

  const input    = document.getElementById('gatePwInput');
  const btn      = document.getElementById('gateGoBtn');
  const row      = document.getElementById('gateInputRow');
  const errEl    = document.getElementById('gateError');

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
    showExitBtn();
    pushToLanding();
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

// ── Exit button (clears session, returns to gate) ────────────────
function showExitBtn() {
  document.getElementById('exitBtn').classList.add('visible');
}

// ── Draggable gate elements ──────────────────────────────────────
function setupGateFloat(resetBtn) {
  const SNAP_DUR = 1000;

  function easeOutElastic(t) {
    if (t <= 0) return 0; if (t >= 1) return 1;
    const p = 0.42;
    return Math.pow(2, -10*t) * Math.sin((t - p/4) * (2*Math.PI) / p) + 1;
  }

  const items = [];

  function makeDraggable(el) {
    let active = false;
    let sx = 0, sy = 0, sdx = 0, sdy = 0;
    let dx = 0, dy = 0;
    let rafId = null;

    el.style.cursor = 'grab';
    el.style.userSelect = 'none';
    el.style.webkitUserSelect = 'none';
    // Only block native touch scrolling on non-interactive containers.
    // Leave touch-action alone if the element contains inputs/buttons
    // so taps still register on those children.
    if (!el.querySelector('input, button')) {
      el.style.touchAction = 'none';
    }

    function applyTransform() {
      el.style.transform = (dx || dy) ? `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)` : '';
    }

    function startDrag(px, py) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      active = true;
      sx = px; sy = py; sdx = dx; sdy = dy;
      el.style.transition = 'none';
      el.style.zIndex = '60';
      el.style.cursor = 'grabbing';
    }

    function moveDrag(px, py) {
      if (!active) return;
      dx = sdx + (px - sx);
      dy = sdy + (py - sy);
      applyTransform();
    }

    function endDrag() {
      if (!active) return;
      active = false;
      el.style.cursor = 'grab';
      el.style.zIndex = '';
      syncReset();
    }

    function snapToOrigin() {
      const fromDX = dx, fromDY = dy;
      if (!fromDX && !fromDY) return;
      const t0 = performance.now();
      function tick(now) {
        const t = Math.min((now - t0) / SNAP_DUR, 1);
        const e = easeOutElastic(t);
        dx = fromDX * (1 - e);
        dy = fromDY * (1 - e);
        applyTransform();
        if (t < 1) { rafId = requestAnimationFrame(tick); }
        else { dx = 0; dy = 0; applyTransform(); rafId = null; syncReset(); }
      }
      rafId = requestAnimationFrame(tick);
    }

    el.addEventListener('mousedown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    });
    el.addEventListener('touchstart', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    items.push({ moveDrag, endDrag, snapToOrigin, isActive: () => active, isDirty: () => !!(dx || dy) });
  }

  // Window-level pointer tracking (drag works past element edge)
  window.addEventListener('mousemove', e => items.forEach(it => it.moveDrag(e.clientX, e.clientY)));
  window.addEventListener('mouseup',   () => items.forEach(it => it.endDrag()));
  window.addEventListener('touchmove', e => {
    if (!items.some(it => it.isActive())) return;
    const t = e.touches[0];
    items.forEach(it => it.moveDrag(t.clientX, t.clientY));
  }, { passive: true });
  window.addEventListener('touchend', () => items.forEach(it => it.endDrag()));

  function syncReset() {
    resetBtn.classList.toggle('visible', items.some(it => it.isDirty()));
  }

  resetBtn.addEventListener('click', () => items.forEach(it => it.snapToOrigin()));

  // ── Wire the draggable elements ─────────────────────────────────

  // Logo
  const logo = document.querySelector('#screenGate .ldg-logo');
  if (logo) makeDraggable(logo);

  // Each word in "I design systems"
  const hero = document.getElementById('gateHero');
  if (hero) {
    const words = hero.textContent.trim().split(/\s+/);
    hero.innerHTML = words.map(w => `<span class="drag-word">${w}</span>`).join(' ');
    hero.querySelectorAll('.drag-word').forEach(w => makeDraggable(w));
  }

  // Password input + button as a unit
  const inputRow = document.getElementById('gateInputRow');
  if (inputRow) makeDraggable(inputRow);
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

  // Param experience: rename HM button; restore on standard
  const hmBtn = btns.querySelector('[data-role="hiring-manager"]');
  if (tailored) {
    if (hmBtn) hmBtn.textContent = 'Come on in';
  } else {
    if (hmBtn) hmBtn.textContent = 'View Case Studies';
  }

  // Update HM panel back button label
  const hmBack = document.getElementById('hmToSelector');
  if (hmBack) {
    const svg = hmBack.querySelector('svg').outerHTML;
    hmBack.innerHTML = tailored
      ? svg + ' Back to intro'
      : svg + ' Back to intro';
    hmBack.setAttribute('aria-label', 'Back to intro');
  }

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

  // HM panel → back to experience selector (role picker)
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
  _layoutStack(document.getElementById('caseStack'));
  _layoutStack(document.getElementById('thoughtsStack'));
}

function _layoutStack(stack) {
  if (!stack) return;
  const items = Array.from(stack.querySelectorAll('.case-item:not([style*="display: none"])'));
  if (!items.length) { stack.style.height = '0'; return; }
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

// ── Analytics logging ─────────────────────────────────────────────
function logEvent(event, data = {}) {
  fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data }),
  }).catch(() => {}); // fire-and-forget, never block UI
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
  document.getElementById('caseListPanel').scrollTop = 0;
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
  'vyehealth': {
    company: 'Vye Health',
    headline: 'The product already existed. The experience didn\'t.',
    intro: 'Vye Health\'s patient flows had been vibecoded into existence — fast, individually functional, and collectively incoherent. Navigation patterns shifted screen to screen, components disagreed with each other, and there was no information hierarchy tying it together. My job was to build the real experience: coherent, end-to-end, and designed to compound on itself.',
    metrics: [
      { value: '5',         label: 'experience areas designed end to end' },
      { value: '1',         label: 'founding designer across patient + provider' },
      { value: 'July 2026', label: 'seed presentations begin' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Founding Designer (Contract)</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Product design, information architecture, AI-assisted prototyping</div></div>
        <div><div class="cs-meta-label">Deliverables</div><div class="cs-meta-val">Patient experience (5 areas), provider experience, design system, Claude Code skill</div></div>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/vyehealth-mob-home.png" class="cd-hero-img" alt="Vye Health mobile — Home and navigation menu" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">The situation</span></div>
        <p class="cd-body">By the time I turned my attention to the patient experience, Vye Health already had a working product. But it hadn&#39;t been designed so much as vibecoded into existence: individual flows had been generated quickly to prove out ideas, and while each one worked in isolation, none of them agreed with each other. Navigation patterns shifted screen to screen. Components that should have been identical looked and behaved differently. There was no real information hierarchy tying the experience together.</p>
        <p class="cd-body">Rebuilding the whole experience from scratch the traditional way &#8212; wireframes, static comps, long review cycles &#8212; wasn&#39;t viable on a short-term contract at a startup moving toward a seed raise. But treating the existing flows as disposable and starting over blind would have thrown away real product learning already embedded in them.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">Approach: prototype &#x2192; refine &#x2192; feedback &#x2192; codify</span></div>
        <p class="cd-body">Using the design system skill as the foundation, I worked at high velocity in Claude Code to prototype entire patient workflows end to end, then brought those prototypes into Figma for refinement against the system&#39;s tokens and components. That refinement surfaced feedback &#8212; from stakeholders, from engineering, from just seeing the flow in a more considered form &#8212; which I then codified back into the design system skill itself.</p>
        <p class="cd-body">That loop repeated across every workflow in the patient experience. Each cycle made the next one faster: as more of the system got codified, new prototypes inherited more correctness for free, and the gap between a first pass and something 60%+ production-ready kept shrinking. The result wasn&#39;t just a set of screens &#8212; it was an information architecture stress-tested against real flows repeatedly, not designed once and hoped into consistency.</p>
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/vyehealth-mob-booking.png" class="cd-screenshot" alt="Appointment booking — select time slot and enter details" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">The patient experience</span></div>
        <p class="cd-body">The rebuilt experience organized around five areas, each with a clear job to do &#8212; several working in direct tandem with the provider experience I also designed:</p>
        <div class="workflow-block">
          <div class="workflow-row">
            <div class="workflow-step">Home</div>
            <div class="workflow-body">An AI chatbot that persisted context across the relationship. As appointments approached, it surfaced join links and gave patients space to raise concerns ahead of time &#8212; concerns that appeared in provider encounter notes so the provider walked in already informed.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Care Journal</div>
            <div class="workflow-body">The system of record for appointments, medications, care notes, and care team messages. What a provider documented or ordered surfaced automatically in the patient&#39;s journal. What a patient raised surfaced in the provider&#39;s notes. Supplement and medication recommendations carried purchase links directly to Vye&#39;s shop.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Shop</div>
            <div class="workflow-body">Connected directly to recommendations and orders from the Care Journal &#8212; a closed loop from recommendation to purchase, not a disconnected storefront.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Profile</div>
            <div class="workflow-body">Personal details, contacts, and health history &#8212; the baseline information the rest of the experience and the care team relied on.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Integrations</div>
            <div class="workflow-body">Wearables, health platforms, and EHRs. Data the patient had already provided elsewhere followed them in so they were never asked to repeat it. Relevant device data surfaced on Home with guidance on what to ask the provider.</div>
          </div>
        </div>
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/vyehealth-mob-join.png" class="cd-screenshot" alt="Join the visit — appointment reminder and mobile video call" />
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/vyehealth-mob-after.png" class="cd-screenshot" alt="After the visit — care plan from V, medication changes, labs ordered" />
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/vyehealth-mob-journal.png" class="cd-screenshot" alt="Care Journal — appointments, care plans, and provider notes" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">04</span><span class="cs-section-title">Outcome</span></div>
        <p class="cd-body">A single, coherent patient experience replaced a set of disconnected vibecoded flows, with a purposeful information hierarchy across all five areas. The prototype &#x2192; refine &#x2192; feedback &#x2192; codify cycle turned every workflow built into a system improvement, compounding speed and consistency rather than trading one for the other.</p>
        <p class="cd-body">The matched provider experience &#8212; designed in tandem &#8212; ensured patient and provider actions resolved correctly on both sides. Encounter notes, orders, messages, and recommendations flowed the right direction without manual reconciliation.</p>
        <div class="cs-reflection">
          <div class="cs-reflection-title">Reflection</div>
          <p class="cd-body">This project was a test of whether a design system built for AI-assisted speed could also produce something coherent enough to stand in front of investors. The inherited vibecoded flows were a warning about what happens without that system: fast, disconnected, and ultimately more expensive to untangle than to have built right. The cycle of prototyping in Claude Code, refining in Figma, and codifying feedback back into the skill is what let velocity and coherence reinforce each other instead of trading off. Seed investment presentations are slated for late July 2026.</p>
        </div>
      </div>
    `,
  },

  'vyehealth-ds': {
    company: 'Vye Health',
    headline: 'A design system built to be read by a machine as well as a human.',
    intro: 'Vye Health\'s team wanted speed — the ability to put any idea in front of the room fast. Vibecoded prototyping made that possible in theory, but vibecoded output is only as good as the system underneath it. Without a rigorous, machine-readable design system, AI-generated interfaces would drift from the product\'s visual language immediately and couldn\'t be trusted for real decisions. My job was to build a system that made the vibecoding actually work.',
    metrics: [
      { value: '~60%',     label: 'prototype fidelity reached reliably out of the gate' },
      { value: '2',        label: 'component tracks — one for machines, one for designers' },
      { value: '1',        label: 'token foundation powering both' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Founding Designer (Contract)</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Design systems, AI-assisted prototyping, design engineering, mobile</div></div>
        <div><div class="cs-meta-label">Tools</div><div class="cs-meta-val">Figma (MCP + Code Connect), Claude Code, mobile-native token architecture</div></div>
      </div>

      <img src="assets/vyehealth-ds-foundations.png" class="cd-hero-img" alt="Vye Design System — color token scales, Geist type ramp, radius and shadow tokens" />

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">The situation</span></div>
        <p class="cd-body">I joined Vye Health as founding designer at a moment when the company had a product vision but no real design system to support it. Components existed in scattered Figma files. Naming was inconsistent. There was no shared language between design and engineering, which meant every new feature started from a blank page instead of a foundation.</p>
        <p class="cd-body">The team wanted to lean into AI-assisted prototyping &#8212; letting anyone describe an idea and generate a working interface. But vibecoded output is only as good as the system underneath it. Without a rigorous, semantically consistent design system, AI-generated interfaces drift from the product&#39;s visual language immediately and can&#39;t be trusted for real decision-making.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">The approach</span></div>
        <p class="cd-body">I worked across Figma and Claude Code simultaneously, using the Figma MCP to keep design and code in constant sync. Rather than building the design system and the AI workflow as separate efforts, I treated them as one problem: every token and every component had to be built with machine-readability in mind from day one.</p>
        <div class="workflow-block">
          <div class="workflow-row">
            <div class="workflow-step">Token architecture</div>
            <div class="workflow-body">Audited and restructured color, spacing, and typography tokens so that decisions in Figma mapped one-to-one with the codebase &#8212; by name and by semantic meaning. A &#8220;primary-action&#8221; token in Figma needed to resolve to the exact same concept in code, not just a visually similar one.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Unified naming</div>
            <div class="workflow-body">Closed the translation gap between what a designer calls something and what an engineer calls it &#8212; the consistency that makes it possible for an AI system to reason about the design system at all.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Two component tracks</div>
            <div class="workflow-body">One track built for machine consumption: components exposed through Code Connect via the Figma MCP, structured so the vibecoding skill could map Figma components to production code without guesswork. A second track built for human consumption: components tailored to Vye Health&#39;s growing design team, optimized for design velocity as the team scaled. Both drawing from the same token foundation.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Claude Code skill</div>
            <div class="workflow-body">A custom skill that could take a rough idea from anyone in the organization and generate a prototype at least 60% polished out of the gate &#8212; close enough to production quality to be genuinely useful for early decision-making, not just a proof of concept.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Mobile-native foundation</div>
            <div class="workflow-body">Extended the design system&#39;s mobile approach so the same token and component logic powering the vibecoding skill also scaled correctly to mobile layouts and interactions &#8212; built mobile-native rather than web-first with mobile bolted on.</div>
          </div>
        </div>
        <img src="assets/vyehealth-ds-codeconnect.png" class="cd-screenshot" alt="Code Connect pilot — button, badge, input, dialog, and card components with decision notes" />
        <p class="cd-body">Throughout, I partnered directly with engineering &#8212; validating the system in real code, not just Figma, through a continuous feedback loop, adjusting tokens and component structure based on what broke or drifted when engineers implemented against them.</p>
        <img src="assets/vyehealth-ds-mobile.png" class="cd-screenshot" alt="Mobile-native patterns — booking flow, consent, confirmation, profile, care plan, and product screens" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">Outcome</span></div>
        <div class="finding-block">
          <div class="finding-row">
            <div class="finding-tag">~60% fidelity</div>
            <div class="finding-body">Reliably reached by the vibecoding skill out of the gate &#8212; polished enough that engineers, PMs, and non-designers could generate credible prototypes without waiting on a designer.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Shifted bottleneck</div>
            <div class="finding-body">Design&#39;s time moved toward refining and directing high-quality concepts instead of producing every single one from scratch.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Trustworthy tokens</div>
            <div class="finding-body">A shared naming convention that eliminated design-to-dev translation errors and gave the AI tooling something it could actually reason about.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Two tracks, one foundation</div>
            <div class="finding-body">A Code Connect-ready component layer for machine consumption and a separate, faster-moving set for the design team &#8212; velocity gains on one side never came at the expense of consistency on the other.</div>
          </div>
        </div>
        <img src="assets/vyehealth-ds-patterns.png" class="cd-screenshot" alt="Shared patterns — alert variants, KPI metric cards, chart, and navigation components" />
        <div class="cs-reflection">
          <div class="cs-reflection-title">Reflection</div>
          <p class="cd-body">The most valuable part of this work wasn&#39;t the skill itself; it was the discipline of building a design system that was legible to a machine as well as a human. Getting components and tokens to match by name and by meaning is tedious, unglamorous work, but it&#39;s the actual precondition for AI-assisted design tools to be trustworthy rather than just fast. At Vye Health, that discipline turned vibecoding from a novelty into a real part of the product development workflow.</p>
          <a href="https://www.ldante.com/vye-styles" target="_blank" rel="noopener" class="cd-artifact-link">View component reference &rarr;</a>
        </div>
      </div>
    `,
  },

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










  'the-normalization-interface': {
    kicker: 'Point of View',
    title:  'The normalization interface',
    dek: 'On designing consumer and B2B products in regulated, stigmatized categories — and why every design decision is also a positioning decision.',
    sections: [
      {
        paragraphs: [
          'Cannabis has joined a familiar club: healthcare, financial services, legal tech. Industries where users arrive already carrying weight the product didn’t put there. A question that runs underneath every interaction — is this okay? is this real? can I trust this? — before anyone has touched a feature.',
          'Design inherits that ambient anxiety. Every confusing moment feels more suspicious than it would in a neutral context. Every slow confirmation reads differently when the user is already slightly on edge. Trust isn’t just desirable in these categories. It’s the pre-condition for everything else the product needs to do.',
        ],
      },
      {
        heading: 'What stigma does to user behavior',
        paragraphs: [
          'I learned this first at MEDHOST, building patient registration software for registrars and front desk staff who’d seen enough healthcare IT disasters to be suspicious of anything new. They weren’t resistant to the product — they were protecting themselves from being burned again. The interface wasn’t just a tool. It was a statement about whether this system was actually on their side.',
          'Cannabis users carry a different skepticism, but the mechanism is identical. Anything unclear reads as suspicious. Anything slow reads as unreliable. Anything inconsistent across pages reads as unfinished — and unfinished in a stigmatized category means untrustworthy. The solution isn’t only friction reduction. It’s making every remaining point of friction feel intentional, like it’s there to protect the user.',
        ],
      },
      {
        heading: 'The two-sided complication',
        paragraphs: [
          'Weedmaps is a marketplace. At minimum, two users who need to trust the platform in fundamentally different ways: the consumer who wants real products, real prices, and accurate availability; the business that wants tools worth the subscription and a platform that represents them professionally.',
          'These trust relationships amplify each other in both directions. A consumer experience that feels cheap undermines confidence in the businesses listed there. A business tool that looks like 2013 signals something to the consumer about what kind of platform this is. The ecosystem rises or falls together. At Meroxa, I led a product redesign after a strategic pivot — one surface for data engineers, another for platform operators, both groups trusting the same underlying system for different reasons. Coherence without uniformity is the design brief.',
        ],
      },
      {
        heading: 'Design systems as institutional legitimacy',
        paragraphs: [
          'At Marketo, I built a design system that became more than a component library. When Adobe acquired Marketo, Sky’s patterns were contributed upstream to Adobe Spectrum — not because anyone planned for an acquisition, but because a well-governed system is inherently portable and enduring. Consistency signals permanence. It communicates that the people building the product are thinking past the current sprint.',
          'This matters more in categories still earning credibility. An inconsistent product says: we’re figuring it out. A consistent one says: we’ve been here, we know what we’re doing, and we’ll be here when you come back. For a platform that serves both consumers making personal decisions and businesses making commercial bets, that signal of permanence isn’t cosmetic. It’s commercial.',
        ],
      },
      {
        heading: 'What I’d bring to Weedmaps',
        paragraphs: [
          'I’ve built design systems that outlasted the products they were built for. I’ve designed for regulated industries where confusion carries real stakes. I’ve led pivots on two-sided platforms where coherence across personas was the only path forward. And I’ve done it as both the person setting the design direction and the person building the components that made it real.',
          'Weedmaps is solving the right problem at the right moment — a high-stakes marketplace in a category still earning cultural legitimacy, where design quality is the differentiator. That’s a problem worth showing up for.',
        ],
      },
    ],
  },




  'when-ai-does-the-work-and-humans-stay-accountable': {
    kicker: 'Point of View',
    title:  'When AI does the work and humans stay accountable',
    dek: 'On designing clinical AI — where automation and professional responsibility share the same interface.',
    sections: [
      {
        paragraphs: [
          'Clinical AI has a trust problem that isn’t really about trust. It’s about accountability. When a system drafts a clinical note, flags a billing code, or surfaces a risk, someone still has to own the decision. That ownership doesn’t transfer to the model — it stays with the clinician. The interface is where that accountability lives.',
          'Designing for that dynamic is different from designing for most software categories. The challenge isn’t just making the AI capable. It’s making the human who uses it able to act with appropriate confidence — which means the interface has to communicate what the AI knows, how confident it is, and where a human needs to actually think.',
        ],
      },
      {
        heading: 'The handoff is the interface',
        paragraphs: [
          'Every AI output in a clinical workflow becomes a human decision. A drafted note gets reviewed and signed. A flagged risk gets acted on or dismissed. A suggested code gets submitted or corrected. The moment between the AI’s output and the clinician’s action is the most important moment in the workflow — and it’s almost always underdesigned.',
          'The interface at that moment has to do a specific job: give the clinician enough information to calibrate their response. Not so much that they re-read everything from scratch, not so little that they’re approving blindly. That calibration requires visible provenance, clear confidence signals, and an interaction model that makes the cost of review proportional to the risk of the decision.',
        ],
      },
      {
        heading: 'Legibility as a clinical requirement',
        paragraphs: [
          'Consumer AI gets a different trust budget than clinical AI. A consumer app that makes an error costs you time. A clinical tool that makes an error can cost a patient. That asymmetry has to be built into the interface — not as a disclaimer at the bottom of the screen, but as a functional design element woven into how outputs are presented.',
          'That means the interface has to be honest about what the AI doesn’t know. Uncertainty isn’t a weakness to hide — it’s information the clinician needs. A system that presents AI outputs with uniform confidence, regardless of actual certainty, trains clinicians to either trust everything or trust nothing. Neither is useful. Legibility about limitations is a clinical safety requirement.',
        ],
      },
      {
        heading: 'Orchestration without losing the thread',
        paragraphs: [
          'An AI copilot that handles chart prep, documentation, scheduling, patient communication, and follow-ups is doing a lot of work. The design challenge isn’t just making each task work — it’s maintaining the clinician’s understanding of what’s been delegated, what’s been done, and what still needs their attention. Delegation at scale is an oversight problem.',
          'Without good orchestration design, the cognitive load doesn’t go away — it just shifts from doing the work to tracking what the AI did. That’s a poor trade. The interface has to give clinicians a coherent model of the system’s state without turning oversight into a second full-time job.',
        ],
      },
      {
        heading: 'What I’d bring to Vye Health',
        paragraphs: [
          'My healthcare software background is on the clinical operations side — MEDHOST, building patient registration systems used by registrars and front desk staff in real clinical environments. That work taught me what high-stakes software actually has to do: surface the right information fast, communicate clearly under pressure, and never be the reason something goes wrong.',
          'The AI-native challenge at Vye Health is the part I want to be working on. Designing the trust architecture — the handoff moments, the legibility layer, the orchestration model — is exactly the kind of systems-level design problem I’m drawn to. I’d bring both the healthcare context and the interaction design discipline to help make VyeOS something clinicians actually want to use.',
        ],
      },
    ],
  },

  'design-systems-built-to-travel': {
    kicker: 'Point of View',
    title:  'Design Systems Built to Travel',
    dek: 'On building token-first systems that propagate intent from Figma to code — and why closing the gap between design and implementation is still a design problem.',
    sections: [
      {
        paragraphs: [
          'Most teams build the component layer first. It\'s the most tangible output: here\'s a button, here\'s a card, here\'s a form. You can show it in a presentation, demonstrate it in Figma, hand it off to engineers. The library becomes the artifact.',
          'The system is something else. It\'s the structure that gives the components their meaning — the token layer that defines what "primary" and "destructive" and "subtle" actually communicate across every surface and context. Without that layer, the library is just a folder of shapes. Consistent-looking, but not coherent.',
          'Token-first means starting with semantic intent before visual specifics. Not "what color is this button?" but "what is this button communicating, and how should that translate across color modes, density settings, and platform constraints?" The visual answer follows from the semantic one. When you sequence it correctly, a change at the semantic layer — redefining what "action-primary" means — propagates everywhere automatically. That\'s the system working.',
        ],
      },
      {
        heading: 'Token hierarchy as a decision layer',
        paragraphs: [
          'I think about tokens in three layers. Global tokens are the raw material: blue-500, space-4, font-weight-600. Values without intent. Semantic tokens map intent to that material: action-primary, spacing-inset-sm, label-weight. Intent without context. Component tokens point to semantic tokens for specific use cases: button-background, button-label-weight. Intent applied.',
          'The hierarchy matters because it controls where decisions live. When you need to change every primary action surface, you change one semantic token and the component tokens follow. When you retheme a product for a new context, you remap the semantic layer and everything downstream updates.',
          'Most teams collapse these layers and pay for it later — at a rebrand, a platform expansion, or an accessibility audit that forces systematic change. When "color values" are scattered across three hundred component files instead of one semantic layer, systematic change becomes manual work.',
        ],
      },
      {
        heading: 'What Figma MCP changes about design system work',
        paragraphs: [
          'The Figma MCP gives AI agents programmatic access to Figma files. An agent with this access can traverse your component library, read variable collections, understand the structure of your design system, and generate design-consistent work without a designer manually placing every element.',
          'That capability is only as valuable as the file it\'s working with.',
          'If your Figma variable structure is clean and semantic — if the naming reflects intent rather than visual description, if the component descriptions are legible to something other than a human with institutional context — then an agent can reason about your system. It can make choices that align with your decisions, not just your aesthetics.',
          'If the file is a mess — inconsistent naming, flattened hierarchy, components that grew organically rather than systematically — the agent makes a mess more efficiently.',
          'I architect Figma files with this in mind: semantic variable naming that reads as a vocabulary, not a color chart; component descriptions that capture intent and constraints; a library structure organized around roles and contexts rather than visual categories. This isn\'t extra work. It\'s the same discipline that makes a system readable to any new team member — the MCP just raises the stakes for getting it right.',
        ],
      },
      {
        heading: 'Code Connect and the last-mile problem',
        paragraphs: [
          'There\'s a perennial problem in design-to-development handoff: the gap between what\'s in the design file and what exists in the codebase. A Figma component named "Button / Primary / Large" may or may not correspond to a code component called Button with variant="primary" and size="lg". Figma variants and code props don\'t naturally mirror each other. Engineers reconcile this by convention, experience, or expensive back-and-forth.',
          'Code Connect makes the mapping explicit. You define the relationship between a Figma component and its code counterpart — which component, which props, how Figma variant values map to code prop values. That definition surfaces directly in Figma\'s Dev Mode, so engineers see real component usage alongside design specs.',
          'When Code Connect is maintained accurately — which requires the same discipline as the rest of the system — it reduces the gap between what was designed and what gets implemented to nearly zero. I set up Code Connect mappings as part of the system build, not as an afterthought. Component API decisions in Figma are designed with the code implementation in mind, and the mappings stay current as both the library and the codebase evolve.',
        ],
      },
      {
        heading: 'The system beneath the system',
        paragraphs: [
          'Tools amplify what\'s there. Figma MCP gives agents access to your design system. Code Connect surfaces your component library inside Dev Mode. These tools work when the underlying system is coherent and intentional. They surface the dysfunction when it isn\'t.',
          'The design system work that matters most isn\'t the component library launch. It\'s the sustained discipline of maintaining the token layer, keeping Code Connect mappings current, and naming things in ways that serve both human teammates and automated tooling. It\'s treating the file as a first-class product artifact, not a staging area for designs.',
          'When you do that work — when the design system is genuinely well-governed — the tooling becomes multiplicative. Changes propagate automatically. Agents generate design-consistent work. Engineers have accurate implementation references. The gap between design intent and implementation closes.',
          'That\'s the version of a design system worth building.',
        ],
      },
    ],
  },

  'the-skill-layer': {
    kicker: 'Point of View',
    title:  'The Skill Layer',
    dek: 'On writing AI skills that implement design systems — and what a design system has to become before a skill can carry it faithfully.',
    sections: [
      {
        paragraphs: [
          'Design system adoption has always been a distribution problem. You build the tokens, define the components, write the documentation — and then rely on every team building on top of the system to internalize the intent behind it, not just copy the output.',
          'Most of the time, they copy the output. They reach for the closest component rather than the right one. They make local decisions that quietly conflict with the system\'s reasoning — not because they\'re being careless, but because intent doesn\'t travel well in static documentation.',
          'AI skills are a new answer to that problem.',
        ],
      },
      {
        heading: 'What a skill is, in this context',
        paragraphs: [
          'A skill, in the AI agent tooling sense, is a structured set of instructions that gives an agent a specialized capability. When you write a skill for implementing a design system, you\'re encoding the system\'s decisions as agent instructions: which components to reach for in which contexts, how the token vocabulary maps to implementation choices, when to use a pattern and when to explicitly deviate from it.',
          'The skill becomes executable documentation. Not an artifact a designer reads and then applies — an artifact an agent reads and acts on directly. That\'s a meaningful upgrade to the distribution model.',
        ],
      },
      {
        heading: 'What the design system has to be first',
        paragraphs: [
          'A skill that implements a design system is only as good as the system underneath it. And the design system has to meet a higher bar to be skill-ready than it does to be designer-ready.',
          'Designers bring judgment. They infer from ambiguous documentation, ask when something is unclear, reason from precedent when a component doesn\'t quite fit. An agent can\'t do any of that without explicit guidance — the ambiguities experienced designers navigate invisibly become failure modes in generated output.',
          'Skill-readiness means semantic token naming that encodes intent rather than visual description. It means component descriptions that capture when to use something, when not to, and what alternatives exist. It means surfacing the decision logic that designers apply by feel — "use a modal for destructive confirmation; use a toast for non-blocking feedback" — rather than leaving it implicit in the file.',
          'The Figma MCP closes one gap here: a skill with access to Figma can read live token values rather than working from static documentation that drifts. Code Connect closes the other: a skill that knows how Figma components map to code can generate implementation-ready output rather than design intent. When both are in place, the skill produces work that travels from prompt to PR with minimal translation.',
        ],
      },
      {
        heading: 'Writing the skill',
        paragraphs: [
          'The practical work is in the sequencing. Start from the token layer — encode the semantic vocabulary before the component library. The skill should understand what "primary," "destructive," "subtle," and "disabled" mean in this system before it knows which component to reach for.',
          'Define the decision logic, not just the components. Not a lookup table but conditional reasoning: when is the right answer a modal versus a drawer? When does an error appear inline versus in a toast? When does a form submit with a primary button versus a floating action? This is where the skill earns its value — by carrying the reasoning, not just the reference.',
          'Include the anti-patterns explicitly. The things the system doesn\'t do are where generated output drifts most. A skill that knows what to avoid is more reliable than one that only knows what to reach for.',
        ],
      },
      {
        paragraphs: [
          'Design systems have always been about scaling decisions. A token system scales color decisions. A component library scales interaction patterns. Documentation scales the reasoning behind them.',
          'Skills scale the execution of those decisions. When you write a skill that genuinely implements a design system, you\'ve turned the system into something that actively participates in every piece of work built on top of it. It doesn\'t just live in a file. It travels with the work.',
        ],
      },
    ],
  },

};


function openCase(id) {
  const data = CASES[id];
  if (!data) return;
  logEvent('case_view', { case: id });
  returnPanel = 'caseListPanel';
  document.getElementById('caseListPanel').classList.add('hidden');
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
  returnPanel = 'caseListPanel';
  document.getElementById('caseListPanel').classList.add('hidden');
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

// ── Hiring manager tile filter ───────────────────────────────────
function setupHiringManagerView() {
  const params = new URLSearchParams(window.location.search);
  const ref = (params.get('ref') || params.get('company') || '').toLowerCase();

  // Map experience slug → POV thought(s) to surface (string or array)
  const POV_MAP = {
    five9:         'designing-for-people-who-live-in-the-product',
    designsystems: ['design-systems-built-to-travel', 'the-skill-layer'],
  };

  const matchedIds = [].concat(POV_MAP[ref] || []);
  const stack = document.getElementById('caseStack');
  const matchedEls = [];

  // Reset: un-hide everything so this function is safe to call multiple times
  document.querySelectorAll('#caseStack .case-item--thought').forEach(el => {
    el.style.display = '';
  });

  // Hide unmatched POV tiles; collect matched ones
  document.querySelectorAll('#caseStack .case-item--thought').forEach(el => {
    if (!el.querySelector('.thought-tile--pov')) return;
    if (matchedIds.length && matchedIds.includes(el.dataset.thought)) {
      el.style.display = '';
      matchedEls.push(el);
    } else {
      el.style.display = 'none';
    }
  });

  // Move matched tiles to the front in their declared order
  if (stack) {
    [...matchedEls].reverse().forEach(el => stack.insertBefore(el, stack.firstChild));
  }
}

function setupFitPanel() {
  // Main fit panel
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

  const caseListPanel   = document.getElementById('caseListPanel');
  const caseDetailPanel = document.getElementById('caseDetailPanel');
  const fitPanel        = document.getElementById('fitPanel');

  // Close any open overlapping panels
  if (caseDetailPanel) caseDetailPanel.classList.remove('active');
  if (fitPanel)        fitPanel.classList.remove('active');
  returnPanel = 'caseListPanel';

  // hiring-manager (only role remaining)
  caseListPanel.classList.remove('hidden');
  setupHiringManagerView(); // filters POV tiles; safe to call again
  layoutMasonry();          // re-layout after any tile visibility changes
}

// ── Design System Mode (experimental) ────────────────────────────
function renderDSMode() {
  document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');

  const COLORS = [
    { name: 'Background',      token: '--bg',        editable: true  },
    { name: 'Background Dark', token: '--bg-darker',  editable: true  },
    { name: 'Pink',            token: '--pink',       editable: true  },
    { name: 'Magenta',         token: '--magenta',    editable: true  },
    { name: 'White',           token: '--white',      editable: true  },
    { name: 'White / 55%',     token: '--white-dim',  editable: false },
  ];

  const _at = wallabeeGetActive();
  const swatchesHTML = COLORS.map(c => {
    const val = _at[c.token] || '';
    return `
    <div class="ds-swatch">
      ${c.editable
        ? `<label class="ds-swatch-label" title="Edit ${c.token}">
             <div class="ds-swatch-chip" style="background:var(${c.token});"></div>
             <input type="color" class="ds-color-input" data-token="${c.token}" value="${val}">
             <div class="ds-swatch-edit-icon">✎</div>
           </label>`
        : `<div class="ds-swatch-chip" style="background:var(${c.token});"></div>`}
      <div class="ds-swatch-info">
        <div class="ds-swatch-name">${c.name}</div>
        <code class="ds-swatch-token">${c.token}</code>
        <span class="ds-swatch-value ds-token-live" data-token="${c.token}">${val}</span>
      </div>
    </div>`;
  }).join('');

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
    { name: 'Crimson',      slug: 'five9',       bg: 'radial-gradient(ellipse 80% 60% at 30% 70%,rgba(230,30,30,.35) 0%,transparent 70%),linear-gradient(160deg,#100000 0%,#1a0505 50%,#100000 100%)' },
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
        <button class="ds-reset-btn" id="dsResetTokens" title="Clear all token overrides">&#8635; Reset tokens</button>
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
        <p class="ds-section-body">Six tokens cover the full palette. The system is intentionally minimal \u2014 dark backgrounds, one warm accent, and white at two opacities for text hierarchy. Click any swatch to edit the token live \u2014 changes propagate site-wide instantly and persist in your browser until you reset them.</p>
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
        <p class="ds-section-body">The primary interactive surface on the landing screen. Padding-based sizing scales responsively with no fixed height.</p>
        <div class="ds-canvas">
          <div style="display:flex;gap:16px;flex-wrap:wrap;">
            <button class="role-btn" style="pointer-events:none;">View Case Studies</button>
          </div>
        </div>
        <div class="ds-canvas-label">Default state</div>
        <table class="ds-spec-table" style="margin-top:20px;">
          <thead><tr><th>Property</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>Font family</td><td><code>Golos Text</code></td></tr>
            <tr><td>Font weight</td><td><code data-spec="btn-weight">—</code></td></tr>
            <tr><td>Font size</td><td><code data-spec="btn-size">—</code></td></tr>
            <tr><td>Padding</td><td><code>clamp(12px,1.5vw,20px) clamp(24px,3vw,40px)</code></td></tr>
            <tr><td>Background</td><td><code data-spec="btn-bg">—</code></td></tr>
            <tr><td>Color</td><td><code data-spec="btn-color">—</code></td></tr>
            <tr><td>Border radius</td><td><code data-spec="btn-radius">—</code></td></tr>
            <tr><td>Hover</td><td><code>translateY(-3px) scale(1.02)</code> \xB7 background lightens</td></tr>
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
        <p class="ds-section-body">The portfolio grid uses three card types, all sharing a common <span class="ds-inline-code">.case-item</span> wrapper and participating in the masonry layout. Card type is determined by a modifier class.</p>
        <div class="ds-canvas" style="overflow-x:auto;">
          <div style="display:flex;gap:16px;min-width:max-content;">

            <div style="width:200px;flex-shrink:0;">
              <div class="case-card-v" style="--card-color:#4c1d95;pointer-events:none;cursor:default;">
                <span class="case-study-badge">Case Study</span>
                <div style="position:absolute;top:22px;left:22px;width:48px;height:16px;background:rgba(255,255,255,0.22);border-radius:3px;z-index:2;"></div>
                <div class="case-card-content">
                  <p class="case-company">Company</p>
                  <h3 class="case-title-h" style="font-size:1.1rem;">A headline that tells the story</h3>
                  <p class="case-desc-h">Short description of the outcome and what was designed.</p>
                </div>
              </div>
            </div>

            <div style="width:200px;flex-shrink:0;">
              <article class="thought-tile" style="pointer-events:none;cursor:default;">
                <div style="width:100%;aspect-ratio:4/3;background:linear-gradient(145deg,#1e2e45 0%,#0d1622 100%);display:block;"></div>
                <span class="thought-tile-badge">Thoughts</span>
                <div class="thought-tile-overlay">
                  <h3 class="thought-tile-title" style="font-size:1.1rem;">Short article title</h3>
                  <p class="thought-tile-desc">A brief description of what this thought piece explores and why it matters.</p>
                </div>
              </article>
            </div>

            <div style="width:200px;flex-shrink:0;">
              <article class="thought-tile thought-tile--pov" style="pointer-events:none;cursor:default;">
                <div class="thought-tile-pov-bg"></div>
                <img class="case-card-logo" src="assets/logo.svg" alt="LDG">
                <span class="thought-tile-badge" style="background:#000;color:#fff;">Perspective</span>
                <div class="thought-tile-overlay">
                  <h3 class="thought-tile-title" style="color:#000;font-size:1.05rem;">A point of view on a design challenge</h3>
                  <p class="thought-tile-desc" style="color:rgba(0,0,0,0.72);">How this perspective shapes the approach to the work.</p>
                </div>
              </article>
            </div>

          </div>
        </div>
        <div class="ds-canvas-label">Case Study \xB7 Thought \xB7 POV</div>
        <table class="ds-spec-table" style="margin-top:20px;">
          <thead><tr><th>Variant</th><th>Class</th><th>Hero treatment</th></tr></thead>
          <tbody>
            <tr><td>Case Study</td><td><code>.case-item--cs</code></td><td>Photo, lazy-loaded</td></tr>
            <tr><td>Thought</td><td><code>.case-item--thought</code></td><td>Photo with gradient overlay</td></tr>
            <tr><td>POV</td><td><code>.thought-tile--pov</code></td><td>Flat <code>var(--pink)</code> \xB7 black text &amp; logo</td></tr>
          </tbody>
        </table>
      </section>
      <hr class="ds-divider">

      <section class="ds-section" id="ds-motion-sky">
        <div class="ds-eyebrow">Animation</div>
        <h2 class="ds-section-title">Sky phases</h2>
        <p class="ds-section-body">An earlier design direction for POV tiles \u2014 each phase a composition of radial glows over a near-black field, brand-anchored by color. The current implementation uses a flat <span class="ds-inline-code">var(--pink)</span> background with black text and logo for maximum consistency. These phases are retained here as a design reference.</p>
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

  // ── Token editing ─────────────────────────────────────────────
  function _updateComputedSpecs() {
    const btn = shell.querySelector('#ds-buttons .role-btn');
    if (!btn) return;
    const cs = getComputedStyle(btn);
    const s = (id, val) => { const el = shell.querySelector(`[data-spec="${id}"]`); if (el) el.textContent = val; };
    s('btn-weight', cs.fontWeight);
    s('btn-size',   cs.fontSize);
    s('btn-bg',     _rgbToHex(cs.backgroundColor));
    s('btn-color',  _rgbToHex(cs.color));
    s('btn-radius', cs.borderRadius);
  }
  requestAnimationFrame(_updateComputedSpecs);

  shell.querySelectorAll('.ds-color-input').forEach(input => {
    input.addEventListener('input', e => {
      const { token } = e.target.dataset;
      const value = e.target.value;
      wallabeeSet(token, value);
      shell.querySelectorAll(`.ds-token-live[data-token="${token}"]`).forEach(el => { el.textContent = value; });
      requestAnimationFrame(_updateComputedSpecs);
    });
  });

  const _resetBtn = shell.querySelector('#dsResetTokens');
  if (_resetBtn) {
    _resetBtn.addEventListener('click', () => { wallabeeReset(); shell.remove(); renderDSMode(); });
  }

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
  wallabeeApply(); // apply any localStorage token overrides before first paint

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
      // Fade out whichever in-screen logo is currently visible
      const logo = document.querySelector('.landing-header .ldg-logo');
      if (logo) logo.style.opacity = '0';
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
      showExitBtn();
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

  // Exit button — clears session and returns to the gate
  document.getElementById('exitBtn').addEventListener('click', () => {
    const caseDetailActive = document.getElementById('caseDetailPanel').classList.contains('active');
    const fitPanelActive   = document.getElementById('fitPanel').classList.contains('active');
    if (caseDetailActive || fitPanelActive) {
      closeDetail();
      return;
    }
    showScreen('screenLanding', 'down');
    setupLanding();
  });
});
