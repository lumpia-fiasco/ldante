/* The Atlas: an infinite canvas. Six regions, each a cluster of section panels.
   Three zoom levels: the atlas (all regions) → a region (its spread of panels) → a panel (reading).
   Camera: screen = world * s + (x, y). Flights use van Wijk & Nuij smooth zoom. */
(function () {
  const viewport = document.getElementById('viewport');
  const world = document.getElementById('world');
  const terrain = document.getElementById('terrain');
  const panels = [...document.querySelectorAll('.panel')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]instant/.test(location.search);

  // Where each region sits on the map follows the compass directions in the original site's
  // "Adjacent regions" footers: the five regions ring the Portal.
  const REGIONS = {
    portal:    { num: 'I',   name: 'The Portal',              sub: 'Where the route begins',          col: 1, row: 0 },
    team:      { num: 'II',  name: 'The Expedition Party',    sub: 'Who runs your account',           col: 1, row: 1 },
    work:      { num: 'III', name: 'Territories Surveyed',    sub: 'Case studies',                    col: 0, row: 0 },
    services:  { num: 'IV',  name: 'The Service Quadrant',    sub: 'What we offer, and what we don’t', col: 2, row: 0 },
    astrolabe: { num: 'V',   name: 'The Astrolabe',           sub: 'Our instrument',                  col: 0, row: 1 },
    contact:   { num: 'VI',  name: 'The Cartographers’ Post', sub: 'Get in touch',                    col: 2, row: 1 },
  };
  const ORDER = ['portal', 'team', 'work', 'services', 'astrolabe', 'contact'];
  const NEIGHBOURS = {
    portal:    { W: 'work', E: 'services', S: 'team' },
    team:      { N: 'portal', E: 'contact', W: 'astrolabe' },
    work:      { E: 'portal', S: 'astrolabe' },
    services:  { W: 'portal', S: 'contact' },
    astrolabe: { N: 'work', E: 'team' },
    contact:   { N: 'services', W: 'team' },
  };
  const LINKS = [
    ['work', 'portal', 'EAST · WEST'], ['portal', 'services', 'EAST · WEST'],
    ['portal', 'team', 'NORTH · SOUTH'], ['work', 'astrolabe', 'NORTH · SOUTH'],
    ['services', 'contact', 'NORTH · SOUTH'], ['astrolabe', 'team', 'EAST · WEST'],
    ['team', 'contact', 'EAST · WEST'],
  ];
  const panelsOf = Object.fromEntries(ORDER.map((r) => [r, panels.filter((p) => p.dataset.region === r)]));

  const HUD_H = 64, BOTTOM_UI = 76;
  const cam = { x: 0, y: 0, s: 1 };
  let pw = 1200, cols = 2, rects = {}, pRects = new Map(), bounds = null;
  let curRegion = null, curPanel = null, level = 'atlas', flight = null, idleTimer = 0;
  const vw = () => Math.max(viewport.clientWidth, 320), vh = () => Math.max(viewport.clientHeight, 400);
  const narrowView = () => vw() < 760;

  /* ---------------- Region labels (the map's lettering) ---------------- */
  const labels = {};
  ORDER.forEach((id) => {
    const r = REGIONS[id];
    const b = document.createElement('button');
    b.className = 'region-label';
    b.dataset.go = id;
    b.innerHTML = `<span class="rl-num">${r.num}</span><span class="rl-text"><span class="rl-k">Region ${r.num}</span><span class="rl-name">${r.name}</span><span class="rl-sub">${r.sub}</span></span>`;
    b.setAttribute('aria-label', `Region ${r.num}, ${r.name}`);
    world.appendChild(b);
    labels[id] = b;
  });

  /* ---------------- Layout ---------------- */
  function layout() {
    const w = vw();
    const narrow = w < 760;
    pw = narrow ? w : Math.min(1200, w - 80);
    cols = narrow ? 1 : 2;
    document.documentElement.style.setProperty('--pw', pw + 'px');
    const g = narrow ? 36 : 96;            // between panels
    const G = narrow ? 360 : 820;          // between regions
    const L = narrow ? 200 : 380;          // lettering above each cluster
    const clusterW = cols * pw + (cols - 1) * g;

    // Size each cluster: panels in rows of `cols`, each row as tall as its tallest panel.
    const clusters = {};
    ORDER.forEach((id) => {
      const list = panelsOf[id];
      list.forEach((p) => { p.style.height = 'auto'; });
      const rows = [];
      for (let i = 0; i < list.length; i += cols) rows.push(list.slice(i, i + cols));
      const heights = rows.map((row) => Math.max(narrow ? 0 : 760, ...row.map((p) => p.offsetHeight)));
      clusters[id] = { rows, heights, h: heights.reduce((a, b) => a + b, 0) + (rows.length - 1) * g };
    });

    // Stack clusters per map column, staggered a little so it reads as terrain, not a spreadsheet.
    const colTop = narrow ? [220, 0, 120] : [520, 0, 300];
    rects = {}; pRects = new Map();
    for (const row of [0, 1]) {
      ORDER.filter((id) => REGIONS[id].row === row).forEach((id) => {
        const c = REGIONS[id].col, cl = clusters[id];
        const x = c * (clusterW + G), y = colTop[c] + L;
        let yy = y;
        cl.rows.forEach((rowPanels, ri) => {
          rowPanels.forEach((p, ci) => {
            const px = x + ci * (pw + g);
            p.style.left = px + 'px'; p.style.top = yy + 'px'; p.style.height = cl.heights[ri] + 'px';
            pRects.set(p, { x: px, y: yy, w: pw, h: cl.heights[ri], cx: px + pw / 2, cy: yy + cl.heights[ri] / 2 });
          });
          yy += cl.heights[ri] + g;
        });
        const lab = labels[id];
        lab.style.left = x + 'px'; lab.style.top = (y - L) + 'px'; lab.style.width = clusterW + 'px'; lab.style.height = (L - g) + 'px';
        rects[id] = { x, y: y - L, w: clusterW, h: cl.h + L };
        rects[id].cx = x + clusterW / 2; rects[id].cy = rects[id].y + rects[id].h / 2;
        colTop[c] = y + cl.h + G;
      });
    }
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    Object.values(rects).forEach((r) => { x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h); });
    bounds = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    Terrain.drawWorld(terrain, bounds, rects, LINKS);
    buildMinimap();
  }

  /* ---------------- Camera ---------------- */
  const fitAllScale = () => Math.max(0.01, Math.min((vw() - 80) / bounds.w, (vh() - HUD_H - BOTTOM_UI) / bounds.h));
  const readScale = () => Math.min(1, (vw() - (narrowView() ? 0 : 80)) / pw);
  const clampS = (s) => Math.min(2.5, Math.max(fitAllScale() * 0.5, s));

  function apply() {
    world.style.transform = `translate3d(${cam.x}px, ${cam.y}px, 0) scale(${cam.s})`;
    let g = 26 * cam.s; if (!(g > 0) || !isFinite(g)) g = 26; while (g < 10) g *= 2;
    viewport.style.backgroundSize = `${g}px ${g}px`;
    viewport.style.backgroundPosition = `${cam.x}px ${cam.y}px`;
    const rs = readScale();
    const zoomedOut = cam.s < rs * 0.55;
    document.body.classList.toggle('zoomed-out', zoomedOut);
    level = !zoomedOut ? 'panel' : cam.s > Math.max(fitAllScale() * 1.5, rs * 0.12) ? 'region' : 'atlas';
    document.body.dataset.level = level;
    world.classList.add('moving');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => world.classList.remove('moving'), 160);
    updateHud();
    updateMinimapView();
  }

  function zoomAt(sx, sy, factor) {
    const s = clampS(cam.s * factor);
    const wx = (sx - cam.x) / cam.s, wy = (sy - cam.y) / cam.s;
    cam.s = s; cam.x = sx - wx * s; cam.y = sy - wy * s;
    apply();
  }

  const toView = (c) => [(vw() / 2 - c.x) / c.s, (vh() / 2 - c.y) / c.s, vw() / c.s];
  const fromView = ([cx, cy, w]) => { const s = vw() / w; return { s, x: vw() / 2 - cx * s, y: vh() / 2 - cy * s }; };

  function interpolateZoom(p0, p1) {
    const rho = Math.SQRT2, rho2 = 2, rho4 = 4;
    const [ux0, uy0, w0] = p0, [ux1, uy1, w1] = p1;
    const dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy;
    let i, S;
    if (d2 < 1e-12) {
      S = Math.log(w1 / w0) / rho;
      i = (t) => [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)];
    } else {
      const d1 = Math.sqrt(d2);
      const b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1);
      const b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1);
      const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = (t) => {
        const s = t * S, c0 = Math.cosh(r0);
        const u = w0 / (rho2 * d1) * (c0 * Math.tanh(rho * s + r0) - Math.sinh(r0));
        return [ux0 + u * dx, uy0 + u * dy, w0 * c0 / Math.cosh(rho * s + r0)];
      };
    }
    i.duration = Math.abs(S) * 1000;
    return i;
  }
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function flyTo(target, { duration, done } = {}) {
    cancelFlight();
    if (reduceMotion) { Object.assign(cam, target); apply(); done && done(); return; }
    const interp = interpolateZoom(toView(cam), toView(target));
    const d = duration || Math.min(1400, Math.max(420, interp.duration * 0.85));
    const t0 = performance.now();
    flight = { raf: 0 };
    const step = (now) => {
      const t = Math.min(1, (now - t0) / d);
      Object.assign(cam, fromView(interp(ease(t))));
      if (t >= 1) { Object.assign(cam, target); flight = null; }
      apply();
      if (flight) flight.raf = requestAnimationFrame(step);
      else done && done();
    };
    flight.raf = requestAnimationFrame(step);
  }
  function cancelFlight() { if (flight) { cancelAnimationFrame(flight.raf); flight = null; } }

  // Reading a panel: fit its width; centre it if it fits the screen, otherwise start at its top.
  function panelCam(p, offsetY = 0) {
    const r = pRects.get(p), s = readScale();
    const avail = vh() - HUD_H - BOTTOM_UI;
    const topPad = narrowView() ? 4 : 20;
    const y = r.h * s <= avail - topPad * 2 && !offsetY
      ? HUD_H + (avail - r.h * s) / 2 - r.y * s
      : HUD_H + topPad - (r.y + offsetY) * s;
    return { s, x: vw() / 2 - r.cx * s, y };
  }
  function regionCam(id) {
    const r = rects[id];
    if (narrowView()) { // a phone can't show a whole cluster legibly; show its top few panels instead
      const s = readScale() * 0.42;
      return { s, x: vw() / 2 - r.cx * s, y: HUD_H + 16 - r.y * s };
    }
    const s = Math.min(readScale() * 0.5, (vw() - 80) / r.w, (vh() - HUD_H - BOTTOM_UI - 20) / r.h);
    return { s, x: vw() / 2 - r.cx * s, y: HUD_H + (vh() - HUD_H - BOTTOM_UI) / 2 - r.cy * s };
  }
  function overviewCam() {
    const s = fitAllScale();
    return { s, x: vw() / 2 - (bounds.x + bounds.w / 2) * s, y: HUD_H + (vh() - HUD_H - BOTTOM_UI) / 2 - (bounds.y + bounds.h / 2) * s };
  }

  function goPanel(p, opts = {}) {
    closeMenu();
    flyTo(panelCam(p, opts.offsetY), Object.assign({
      done: () => { const h = p.querySelector('h1, h2, h3'); if (h && !opts.keepFocus) h.focus({ preventScroll: true }); },
    }, opts));
  }
  // `go` takes a region id (enters its first panel), a panel id (work-3), 'region:<id>' or 'overview'.
  function go(target, opts) {
    closeMenu();
    if (target === 'overview') return flyTo(overviewCam(), opts);
    if (target.startsWith('region:')) return flyTo(regionCam(target.slice(7)), opts);
    if (REGIONS[target]) return goPanel(panelsOf[target][0], opts);
    const p = document.getElementById(target);
    if (p && p.classList.contains('panel')) goPanel(p, opts);
  }
  function stepOut() {
    if (level === 'panel' && curRegion) go('region:' + curRegion);
    else go('overview');
  }

  /* ---------------- HUD ---------------- */
  const hudNum = document.getElementById('hudNum');
  const hudName = document.getElementById('hudName');
  const coords = document.getElementById('coords');
  const zoomPct = document.getElementById('zoomPct');
  const stepCount = document.getElementById('stepCount');

  function nearest(entries, cx, cy) {
    let best = null, bd = Infinity;
    for (const [k, r] of entries) {
      const dx = Math.max(r.x - cx, 0, cx - (r.x + r.w)), dy = Math.max(r.y - cy, 0, cy - (r.y + r.h));
      const d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = k; }
    }
    return best;
  }

  function updateHud() {
    const cx = (vw() / 2 - cam.x) / cam.s, cy = (HUD_H + (vh() - HUD_H) * 0.4 - cam.y) / cam.s;
    const region = level === 'atlas' ? null : nearest(Object.entries(rects), cx, cy);
    const panel = level === 'panel' ? nearest(pRects.entries(), cx, cy) : null;
    if (region !== curRegion) {
      curRegion = region;
      hudNum.textContent = region ? REGIONS[region].num : '◆';
      hudName.textContent = region ? REGIONS[region].name : 'The Atlas';
      document.querySelectorAll('.index-menu ol [data-go]').forEach((b) => b.setAttribute('aria-current', String(b.dataset.go === region)));
      Object.entries(labels).forEach(([id, l]) => l.classList.toggle('current', id === region));
      markMinimap();
    }
    if (panel !== curPanel) {
      if (curPanel) curPanel.classList.remove('current');
      curPanel = panel;
      if (panel) panel.classList.add('current');
      markMinimap();
    }
    if (region) {
      const list = panelsOf[region];
      stepCount.textContent = `${panel ? list.indexOf(panel) + 1 : '—'} / ${list.length}`;
    }
    if (!flight) {
      const h = panel ? '#' + panel.id : region ? '#' + region : '#atlas';
      if (location.hash !== h) history.replaceState(null, '', h);
    }
    const lat = 48.4 - cy / 60000, lon = 89.2 + cx / 60000;
    coords.textContent = `${lat.toFixed(2)}°N · ${lon.toFixed(2)}°W`;
    zoomPct.textContent = Math.round(cam.s * 100) + '%';
  }

  /* ---------------- Minimap ---------------- */
  const mm = document.getElementById('minimapSvg');
  const mmEl = document.getElementById('minimap');
  let mmView = null, mmBox = null;
  function buildMinimap() {
    const pad = Math.max(bounds.w, bounds.h) * 0.04;
    mmBox = { x: bounds.x - pad, y: bounds.y - pad, w: bounds.w + pad * 2, h: bounds.h + pad * 2 };
    mm.setAttribute('viewBox', `${mmBox.x} ${mmBox.y} ${mmBox.w} ${mmBox.h}`);
    const k = Math.max(mmBox.w / (mmEl.clientWidth || 180), mmBox.h / (mmEl.clientHeight || 150));
    const ns = 'http://www.w3.org/2000/svg';
    const mk = (tag, attrs) => { const n = document.createElementNS(ns, tag); for (const a in attrs) n.setAttribute(a, attrs[a]); mm.appendChild(n); return n; };
    mm.innerHTML = '';
    for (const id of ORDER) {
      const r = rects[id];
      mk('rect', { x: r.x, y: r.y, width: r.w, height: r.h, class: 'mm-region', 'data-id': id, 'stroke-width': k, rx: 3 * k });
      mk('text', { x: r.x + 5 * k, y: r.y + 11 * k, 'font-size': 10 * k, class: 'mm-num' }).textContent = REGIONS[id].num;
    }
    for (const [p, r] of pRects) mk('rect', { x: r.x, y: r.y, width: r.w, height: r.h, class: 'mm-panel', 'data-id': p.id });
    mmView = mk('rect', { class: 'mm-view', 'stroke-width': 1.5 * k });
    markMinimap();
  }
  function markMinimap() {
    mm.querySelectorAll('.mm-region').forEach((r) => r.classList.toggle('on', r.dataset.id === curRegion));
    mm.querySelectorAll('.mm-panel').forEach((r) => r.classList.toggle('on', !!curPanel && r.dataset.id === curPanel.id));
  }
  function updateMinimapView() {
    if (!mmView) return;
    mmView.setAttribute('x', -cam.x / cam.s); mmView.setAttribute('y', -cam.y / cam.s);
    mmView.setAttribute('width', vw() / cam.s); mmView.setAttribute('height', vh() / cam.s);
  }
  mmEl.addEventListener('click', (e) => {
    const b = mm.getBoundingClientRect();
    const k = Math.max(mmBox.w / b.width, mmBox.h / b.height);
    const ox = (b.width - mmBox.w / k) / 2, oy = (b.height - mmBox.h / k) / 2;
    const wx = mmBox.x + (e.clientX - b.left - ox) * k, wy = mmBox.y + (e.clientY - b.top - oy) * k;
    for (const [p, r] of pRects) if (wx >= r.x && wx <= r.x + r.w && wy >= r.y && wy <= r.y + r.h) return goPanel(p);
    const reg = ORDER.find((id) => { const r = rects[id]; return wx >= r.x && wx <= r.x + r.w && wy >= r.y && wy <= r.y + r.h; });
    if (reg) return go('region:' + reg);
    flyTo({ s: cam.s, x: vw() / 2 - wx * cam.s, y: vh() / 2 - wy * cam.s });
  });

  /* ---------------- Input: wheel ---------------- */
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    cancelFlight();
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vh() : 1;
    const dx = e.deltaX * k, dy = e.deltaY * k;
    if (e.ctrlKey || e.metaKey || document.body.classList.contains('zoomed-out')) {
      // trackpad pinch arrives as ctrl+wheel with small deltas; mouse wheels send large ones
      zoomAt(e.clientX, e.clientY, Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.002)));
    } else {
      cam.x -= e.shiftKey && !dx ? dy : dx;
      cam.y -= e.shiftKey && !dx ? 0 : dy;
      apply();
    }
  }, { passive: false });

  let gestureS = 1; // Safari trackpad pinch
  viewport.addEventListener('gesturestart', (e) => { e.preventDefault(); gestureS = 1; });
  viewport.addEventListener('gesturechange', (e) => { e.preventDefault(); zoomAt(e.clientX, e.clientY, e.scale / gestureS); gestureS = e.scale; });

  /* ---------------- Input: drag, pinch, glide ---------------- */
  const pointers = new Map();
  let drag = null, suppressClick = false, pinch = null, velocity = [0, 0], glideRaf = 0;
  const INTERACTIVE = 'a, button, input, textarea, select, summary, label, .camp, [contenteditable]';

  viewport.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.pointerType === 'mouse' && e.target.closest(INTERACTIVE) && !document.body.classList.contains('zoomed-out')) return;
    cancelFlight(); cancelAnimationFrame(glideRaf);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, t: performance.now(), lx: e.clientX, ly: e.clientY };
      velocity = [0, 0];
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: cam.s, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, cx: cam.x, cy: cam.y };
      drag = null;
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const s = clampS(pinch.s * d / pinch.d);
      const wx = (pinch.mx - pinch.cx) / pinch.s, wy = (pinch.my - pinch.cy) / pinch.s;
      cam.s = s; cam.x = mx - wx * s; cam.y = my - wy * s;
      suppressClick = true;
      apply();
      return;
    }
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    if (!drag.moved) { drag.moved = true; viewport.classList.add('dragging'); }
    const now = performance.now(), dt = Math.max(1, now - drag.t);
    velocity = [(e.clientX - drag.lx) / dt, (e.clientY - drag.ly) / dt];
    drag.t = now; drag.lx = e.clientX; drag.ly = e.clientY;
    cam.x = drag.cx + dx; cam.y = drag.cy + dy;
    apply();
  });

  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (drag && drag.moved) {
      suppressClick = true;
      viewport.classList.remove('dragging');
      if (!reduceMotion && performance.now() - drag.t < 80) glide();
    }
    if (pointers.size === 0) drag = null;
    else if (pointers.size === 1) {
      const [p] = [...pointers.values()];
      drag = { x: p.x, y: p.y, cx: cam.x, cy: cam.y, moved: true, t: performance.now(), lx: p.x, ly: p.y };
    }
  }
  window.addEventListener('pointerup', endPointer);
  window.addEventListener('pointercancel', endPointer);

  function glide() {
    let [vx, vy] = velocity.map((v) => v * 16);
    const step = () => {
      vx *= 0.93; vy *= 0.93;
      if (Math.hypot(vx, vy) < 0.3) return;
      cam.x += vx; cam.y += vy; apply();
      glideRaf = requestAnimationFrame(step);
    };
    glideRaf = requestAnimationFrame(step);
  }

  // Swallow the click that ends a drag. Zoomed out, clicking a panel enters it.
  viewport.addEventListener('click', (e) => {
    if (suppressClick) { suppressClick = false; e.preventDefault(); e.stopPropagation(); return; }
    if (document.body.classList.contains('zoomed-out')) {
      const p = e.target.closest('.panel');
      if (p) { e.preventDefault(); e.stopPropagation(); goPanel(p); }
    }
  }, true);

  // Keep the browser from scrolling the viewport itself (e.g. on focus); the camera owns position.
  viewport.addEventListener('scroll', () => { viewport.scrollTop = 0; viewport.scrollLeft = 0; });

  // Tabbing to something off-screen brings the camera to it.
  viewport.addEventListener('focusin', (e) => {
    const p = e.target.closest('.panel');
    if (!p || flight) return;
    const b = e.target.getBoundingClientRect();
    const onScreen = b.top >= HUD_H && b.bottom <= vh() - BOTTOM_UI && b.left >= 0 && b.right <= vw();
    if (onScreen && level === 'panel') return;
    const r = pRects.get(p), s = readScale(), avail = (vh() - HUD_H - BOTTOM_UI) / s;
    const localY = (b.top - cam.y) / cam.s - r.y;
    const off = r.h <= avail ? 0 : Math.max(1, Math.min(r.h - avail, localY - avail / 3));
    flyTo(panelCam(p, r.h <= avail ? 0 : off), { duration: 420 });
  });

  /* ---------------- Keyboard ---------------- */
  function stepPanel(delta) {
    let i;
    if (curPanel) i = panels.indexOf(curPanel);
    else if (curRegion) i = panels.indexOf(panelsOf[curRegion][0]) - (delta > 0 ? 1 : 0);
    else i = -1;
    goPanel(panels[(i + delta + panels.length) % panels.length]);
  }
  function panBy(dy) { flyTo({ s: cam.s, x: cam.x, y: cam.y - dy }, { duration: 240 }); }
  function neighbourRegion(dir) {
    const n = NEIGHBOURS[curRegion || 'portal'][dir];
    if (n) go(n);
    return !!n;
  }
  function vertical(dir, step) {
    if (!curPanel) { if (dir > 0) stepPanel(1); return; }
    const r = pRects.get(curPanel);
    const top = (HUD_H - cam.y) / cam.s - r.y;                         // how far into the panel we've read
    const bottom = (vh() - BOTTOM_UI - cam.y) / cam.s - (r.y + r.h);    // > 0 once past its end
    if (dir < 0 && top > 8) return panBy(-Math.min(step, top * cam.s + 20));
    if (dir > 0 && bottom < -8) return panBy(Math.min(step, -bottom * cam.s + 20));
    // at an edge: move to the panel above/below in this cluster, then to the neighbouring region
    const list = panelsOf[curRegion], j = list.indexOf(curPanel) + dir * cols;
    if (list[j]) {
      const avail = (vh() - HUD_H - BOTTOM_UI) / readScale(), h = pRects.get(list[j]).h;
      goPanel(list[j], dir < 0 && h > avail ? { offsetY: h - avail + 20 } : {});
    } else neighbourRegion(dir < 0 ? 'N' : 'S');
  }

  window.addEventListener('keydown', (e) => {
    const tgt = e.target instanceof Element ? e.target : document.body;
    if (tgt.closest('input, textarea, select, [contenteditable]')) return;
    if (e.key === 'Escape') { if (!menu.hidden) closeMenu(true); else stepOut(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.shiftKey && e.key.startsWith('Arrow')) {
      e.preventDefault();
      neighbourRegion({ ArrowLeft: 'W', ArrowRight: 'E', ArrowUp: 'N', ArrowDown: 'S' }[e.key]);
      return;
    }
    if (/^[1-6]$/.test(e.key)) { go(ORDER[+e.key - 1]); return; }
    if (e.key === '0') { go('overview'); return; }
    if (e.key === '+' || e.key === '=') { zoomAt(vw() / 2, vh() / 2, 1.25); return; }
    if (e.key === '-' || e.key === '_') { zoomAt(vw() / 2, vh() / 2, 0.8); return; }
    const page = (vh() - HUD_H - BOTTOM_UI) * 0.85;
    switch (e.key) {
      case 'ArrowLeft': e.preventDefault(); stepPanel(-1); break;
      case 'ArrowRight': e.preventDefault(); stepPanel(1); break;
      case 'ArrowUp': e.preventDefault(); vertical(-1, 140); break;
      case 'ArrowDown': e.preventDefault(); vertical(1, 140); break;
      case 'PageUp': e.preventDefault(); vertical(-1, page); break;
      case 'PageDown': e.preventDefault(); vertical(1, page); break;
      case ' ':
        if (tgt.closest('button, a')) return;
        e.preventDefault(); vertical(e.shiftKey ? -1 : 1, page); break;
      case 'Enter':
        if (level !== 'panel' && !tgt.closest('button, a')) { e.preventDefault(); stepPanel(1); }
        break;
    }
  });

  /* ---------------- Buttons ---------------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-go]');
    if (!t) return;
    e.preventDefault();
    // Region lettering on the map first zooms to the region's spread; a second click goes in.
    if (t.classList.contains('region-label')) {
      const reg = t.dataset.go;
      if (level === 'region' && curRegion === reg) go(reg); else go('region:' + reg);
    } else go(t.dataset.go);
  });
  document.getElementById('hudRegion').addEventListener('click', stepOut);
  document.getElementById('prevPanel').addEventListener('click', () => stepPanel(-1));
  document.getElementById('nextPanel').addEventListener('click', () => stepPanel(1));
  document.getElementById('zoomIn').addEventListener('click', () => flyToScale(1.5));
  document.getElementById('zoomOut').addEventListener('click', () => flyToScale(1 / 1.5));
  zoomPct.addEventListener('click', () => go('overview'));
  function flyToScale(f) {
    const s = clampS(cam.s * f), cx = vw() / 2, cy = vh() / 2;
    const wx = (cx - cam.x) / cam.s, wy = (cy - cam.y) / cam.s;
    flyTo({ s, x: cx - wx * s, y: cy - wy * s }, { duration: 320 });
  }

  const menu = document.getElementById('indexMenu');
  const indexBtn = document.getElementById('indexBtn');
  function closeMenu(refocus) {
    if (menu.hidden) return;
    menu.hidden = true; indexBtn.setAttribute('aria-expanded', 'false');
    if (refocus) indexBtn.focus();
  }
  indexBtn.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open; indexBtn.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector('button').focus();
  });
  document.addEventListener('pointerdown', (e) => { if (!menu.hidden && !menu.contains(e.target) && !indexBtn.contains(e.target)) closeMenu(); });

  /* ---------------- Hero: the engraving sharpens under the cursor ---------------- */
  const hero = document.getElementById('hero');
  hero.addEventListener('pointermove', (e) => {
    const art = hero.querySelector('.hero-art').getBoundingClientRect();
    hero.style.setProperty('--mx', ((e.clientX - art.left) / art.width * 100).toFixed(1) + '%');
    hero.style.setProperty('--my', ((e.clientY - art.top) / art.height * 100).toFixed(1) + '%');
  });

  /* ---------------- Boot ---------------- */
  function targetFromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h === 'atlas') return 'overview';
    if (REGIONS[h]) return 'region:' + h;
    const p = h && document.getElementById(h);
    return p && p.classList.contains('panel') ? h : null;
  }
  window.addEventListener('hashchange', () => { const t = targetFromHash(); if (t) go(t); });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const keepPanel = level === 'panel' ? curPanel : null, keepRegion = curRegion;
      const off = keepPanel ? Math.max(0, (HUD_H - cam.y) / cam.s - pRects.get(keepPanel).y) : 0;
      layout();
      Object.assign(cam, keepPanel ? panelCam(keepPanel, off) : keepRegion ? regionCam(keepRegion) : overviewCam());
      apply();
    }, 120);
  });

  panels.forEach((p) => { const h = p.querySelector('h1, h2, h3'); if (h) h.setAttribute('tabindex', '-1'); });
  Terrain.drawRoute();
  Terrain.drawInstrument();

  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    const target = targetFromHash(); // read before the first apply() rewrites the hash
    layout();
    Object.assign(cam, overviewCam());
    apply();
    const hint = document.getElementById('hint');
    let seen = false; try { seen = localStorage.getItem('nb-hint') === '1'; } catch (_) {}
    if (!seen) {
      setTimeout(() => { hint.hidden = false; }, 2600);
      setTimeout(() => { hint.hidden = true; try { localStorage.setItem('nb-hint', '1'); } catch (_) {} }, 9000);
    }
    if (target === 'overview') return;
    // First arrival: hold on the whole atlas for a beat, then descend.
    setTimeout(() => go(target || 'portal-1', { duration: 1700, keepFocus: true }), reduceMotion ? 0 : 900);
  });

  window.Atlas = { go, cam, get level() { return level; } };
})();
