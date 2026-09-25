/* Terrain: contour lines (marching squares), the engagement route plate,
   the astrolabe instrument, and the map drawn underneath the panels. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const r1 = (v) => Math.round(v * 10) / 10;

  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  // Marching squares over a height function; returns one path string per level.
  function contours(fn, width, height, grid, levels, x0 = 0, y0 = 0) {
    const cols = Math.ceil(width / grid), rows = Math.ceil(height / grid);
    const h = [];
    for (let j = 0; j <= rows; j++) {
      const row = [];
      for (let i = 0; i <= cols; i++) row.push(fn(x0 + i * grid, y0 + j * grid));
      h.push(row);
    }
    return levels.map((lv) => {
      let d = '';
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const X = x0 + i * grid, Y = y0 + j * grid;
        const a = h[j][i], b = h[j][i + 1], c = h[j + 1][i + 1], e = h[j + 1][i];
        const code = (a >= lv ? 8 : 0) | (b >= lv ? 4 : 0) | (c >= lv ? 2 : 0) | (e >= lv ? 1 : 0);
        if (code === 0 || code === 15) continue;
        const T = () => `${r1(X + grid * (lv - a) / (b - a))} ${Y}`;
        const B = () => `${r1(X + grid * (lv - e) / (c - e))} ${Y + grid}`;
        const L = () => `${X} ${r1(Y + grid * (lv - a) / (e - a))}`;
        const R = () => `${X + grid} ${r1(Y + grid * (lv - b) / (c - b))}`;
        const seg = (p, q) => { d += `M${p}L${q}`; };
        switch (code) {
          case 1: case 14: seg(L(), B()); break;
          case 2: case 13: seg(B(), R()); break;
          case 3: case 12: seg(L(), R()); break;
          case 4: case 11: seg(T(), R()); break;
          case 5: seg(L(), T()); seg(B(), R()); break;
          case 6: case 9: seg(T(), B()); break;
          case 7: case 8: seg(L(), T()); break;
          case 10: seg(T(), R()); seg(L(), B()); break;
        }
      }
      return d;
    });
  }

  function peaksField(peaks, extra) {
    return (x, y) => {
      let u = 0;
      for (const p of peaks) {
        const dx = x - p.cx, dy = y - p.cy;
        const o = dx * Math.cos(p.rot) + dy * Math.sin(p.rot);
        const t = -dx * Math.sin(p.rot) + dy * Math.cos(p.rot);
        u += p.amp * Math.exp(-(o * o / (2 * p.sx * p.sx) + t * t / (2 * p.sy * p.sy)));
      }
      return u + (extra ? extra(x, y) : 0);
    };
  }

  /* ---------- Plate VII: the engagement route (data from the original site) ---------- */
  const CAMPS = [
    { n: 'I', name: 'Discovery', sub: 'Surveying the terrain', note: 'We audit your channels, data, and market before anything moves.', x: 90, y: 420 },
    { n: 'II', name: 'Foundations', sub: 'Base camp', note: 'Tracking, analytics, and access — set up before a dollar is spent.', x: 190, y: 380 },
    { n: 'III', name: 'Strategy', sub: 'The route plan', note: 'Media plan and creative direction, mapped against revenue.', x: 160, y: 300 },
    { n: 'IV', name: 'Build', sub: 'Fixed ropes', note: 'Automation and infrastructure installed ahead of you, so the hard crossings are walkable.', x: 260, y: 270 },
    { n: 'V', name: 'Launch', sub: 'The ascent', note: 'Campaigns go live across every channel in the plan.', x: 330, y: 300 },
    { n: 'VI', name: 'Optimize', sub: 'Weather windows', note: 'Weekly reads. Nothing risky moves without a human go.', x: 390, y: 230 },
    { n: 'VII', name: 'Scale', sub: 'The summit push', note: 'Budget follows proof into what is working.', x: 470, y: 160 },
    { n: 'VIII', name: 'Review & Renew', sub: 'The next peak', note: 'Honest measurement of the climb, then the next objective.', x: 545, y: 110 },
  ];
  const ROUTE_PEAKS = [
    { cx: 470, cy: 120, sx: 95, sy: 65, amp: 88, rot: .5 }, { cx: 565, cy: 85, sx: 55, sy: 42, amp: 72, rot: -.3 },
    { cx: 150, cy: 335, sx: 75, sy: 50, amp: 42, rot: .2 }, { cx: 300, cy: 245, sx: 120, sy: 60, amp: 34, rot: .7 },
    { cx: 60, cy: 120, sx: 70, sy: 55, amp: 26, rot: 0 },
  ];

  function drawRoute() {
    const svg = document.getElementById('routeMap');
    const keyList = document.getElementById('routeKey');
    const detail = document.getElementById('routeDetail');
    if (!svg) return;
    const W = 640, H = 480;
    const field = peaksField(ROUTE_PEAKS, (x, y) =>
      x / W * 9.9 + (H - y) / H * 12.1 + 4.5 * Math.sin(x * .021 + 1.7) + 3.5 * Math.cos(y * .027 + .4) + 2.5 * Math.sin((x + y) * .016 + 3.1));
    const levels = [6, 11, 16, 21, 26, 31, 37, 43, 49, 56, 63, 70, 78, 86, 94, 102];
    const g = el('g', { fill: 'none' }, svg);
    contours(field, W, H, 6, levels).forEach((d, i) =>
      el('path', { d, stroke: i % 4 === 3 ? 'rgb(129 79 39 / .55)' : 'rgb(129 79 39 / .25)', 'stroke-width': i % 4 === 3 ? 1.1 : .6 }, g));
    // spot heights + north arrow
    [[470, 120, '6488'], [565, 85, '6142'], [300, 245, '4210']].forEach(([x, y, t]) => {
      el('path', { d: `M${x} ${y - 5}l4 7h-8z`, fill: '#293040' }, svg);
      el('text', { x: x + 7, y: y + 3, 'font-size': 9, 'font-family': 'Geist Mono, monospace', fill: '#3c4a68' }, svg).textContent = t;
    });
    const na = el('g', { transform: 'translate(40 50)' }, svg);
    el('path', { d: 'M0 -18l6 18h-12z', fill: '#293040' }, na);
    el('text', { x: 0, y: 14, 'text-anchor': 'middle', 'font-size': 11, 'font-family': 'Fraunces, serif', fill: '#293040' }, na).textContent = 'N';
    // path
    const pts = CAMPS.map((c) => [c.x, c.y]);
    let d = `M${pts[0]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      d += `Q${(x0 + x1) / 2 + (y1 - y0) * .25} ${(y0 + y1) / 2 - (x1 - x0) * .25} ${x1} ${y1}`;
    }
    el('path', { d, fill: 'none', stroke: '#a16b2d', 'stroke-width': 2, 'stroke-dasharray': '5 5', 'stroke-linecap': 'round' }, svg);
    el('text', { x: 612, y: 450, 'text-anchor': 'end', 'font-size': 13, 'font-style': 'italic', 'font-family': 'Fraunces, serif', fill: '#293040' }, svg).textContent = 'The Engagement Route';
    el('text', { x: 612, y: 466, 'text-anchor': 'end', 'font-size': 7, 'letter-spacing': 1.5, 'font-family': 'Geist Mono, monospace', fill: '#3c4a68' }, svg).textContent = 'SURVEYED & DRAWN BY NOBLE BASE · CONTOUR INTERVAL 250';

    const camps = [], keys = [];
    function select(i) {
      camps.forEach((c, k) => c.classList.toggle('on', k === i));
      keys.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
      const c = CAMPS[i];
      detail.innerHTML = `<p class="mono">Camp ${c.n} · ${c.sub}</p><h4>${c.name}</h4><p>${c.note}</p>`;
    }
    CAMPS.forEach((c, i) => {
      const g2 = el('g', { class: 'camp', transform: `translate(${c.x} ${c.y})` }, svg);
      el('circle', { r: 14, fill: 'transparent' }, g2);
      el('circle', { class: 'dot', r: 6, fill: '#faf6ec', stroke: '#293040', 'stroke-width': 1.5 }, g2);
      el('text', { x: 0, y: -12, 'text-anchor': 'middle', 'font-size': 11, 'font-family': 'Fraunces, serif', fill: '#293040' }, g2).textContent = c.n;
      g2.addEventListener('click', () => select(i));
      camps.push(g2);
      const li = document.createElement('li');
      li.innerHTML = `<button aria-pressed="false"><span class="rn">${c.n}</span><span>${c.name}<em>${c.sub}</em></span></button>`;
      li.firstChild.addEventListener('click', () => select(i));
      keys.push(li.firstChild);
      keyList.appendChild(li);
    });
    select(0);
  }

  /* ---------- The astrolabe (Region V header) ---------- */
  function drawInstrument() {
    const svg = document.getElementById('instrument');
    if (!svg) return;
    const ink = '#3c4a68', gold = '#bb8837';
    el('circle', { r: 100, fill: 'none', stroke: ink, 'stroke-width': 1.4 }, svg);
    el('circle', { r: 94, fill: 'none', stroke: ink, 'stroke-width': .6 }, svg);
    el('circle', { r: 78, fill: 'none', stroke: ink, 'stroke-width': .6 }, svg);
    for (let i = 0; i < 360; i += 5) {
      const a = i * Math.PI / 180, r0 = i % 30 === 0 ? 84 : i % 15 === 0 ? 88 : 91;
      el('line', { x1: r0 * Math.cos(a), y1: r0 * Math.sin(a), x2: 94 * Math.cos(a), y2: 94 * Math.sin(a), stroke: ink, 'stroke-width': .6 }, svg);
    }
    const romans = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    romans.forEach((t, i) => {
      const a = (i * 30 - 90) * Math.PI / 180;
      el('text', { x: 71 * Math.cos(a), y: 71 * Math.sin(a) + 3, 'text-anchor': 'middle', 'font-size': 7, 'font-family': 'Fraunces, serif', fill: ink }, svg).textContent = t;
    });
    // almucantars
    for (let k = 0; k < 6; k++) el('circle', { cx: 0, cy: 14 + k * 4, r: 56 - k * 9, fill: 'none', stroke: ink, 'stroke-width': .45, opacity: .8 }, svg);
    el('circle', { r: 36, cy: -8, fill: 'none', stroke: gold, 'stroke-width': .9 }, svg);
    // rete + alidade (rotates slowly)
    const rete = el('g', { class: 'rete' }, svg);
    el('path', { d: 'M0 -62 C 28 -40 40 -8 22 18 C 8 36 -20 36 -34 16 C -48 -8 -30 -44 0 -62Z', fill: 'none', stroke: gold, 'stroke-width': 1 }, rete);
    [[0, -62], [22, 18], [-34, 16], [30, -30], [-22, -34]].forEach(([x, y]) => el('path', { d: `M${x} ${y}l3 -7 3 7z`, fill: gold }, rete));
    el('line', { x1: -96, y1: 0, x2: 96, y2: 0, stroke: ink, 'stroke-width': 1.6 }, rete).setAttribute('transform', 'rotate(-28)');
    el('circle', { r: 4, fill: ink }, svg);
    el('path', { d: 'M-10 -100 a10 10 0 0 1 20 0', fill: 'none', stroke: ink, 'stroke-width': 1.4 }, svg);
    let t0 = performance.now();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) (function spin(t) {
      rete.setAttribute('transform', `rotate(${((t - t0) / 1000) * 3})`);
      requestAnimationFrame(spin);
    })(t0);
  }

  /* ---------- The map under the panels ---------- */
  function drawWorld(svg, bounds, rects, links) {
    svg.innerHTML = '';
    const pad = 2400;
    const x0 = bounds.x - pad, y0 = bounds.y - pad, W = bounds.w + pad * 2, H = bounds.h + pad * 2;
    svg.setAttribute('viewBox', `${x0} ${y0} ${W} ${H}`);
    Object.assign(svg.style, { left: x0 + 'px', top: y0 + 'px', width: W + 'px', height: H + 'px' });

    // Peaks sit in the gutters and margins so the land rises between regions.
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const peaks = [];
    for (let i = 0; i < 34; i++) {
      peaks.push({ cx: x0 + rnd() * W, cy: y0 + rnd() * H, sx: 420 + rnd() * 900, sy: 320 + rnd() * 700, amp: 30 + rnd() * 70, rot: rnd() * 3 });
    }
    const field = peaksField(peaks, (x, y) => 6 * Math.sin(x * .0011 + 1.3) + 5 * Math.cos(y * .0009 + .2) + 3 * Math.sin((x + y) * .0017));
    const levels = []; for (let v = 4; v < 140; v += 8) levels.push(v);
    const g = el('g', { fill: 'none', 'stroke-linejoin': 'round' }, svg);
    contours(field, W, H, 110, levels, x0, y0).forEach((d, i) =>
      el('path', { d, stroke: i % 5 === 4 ? 'rgb(129 79 39 / .30)' : 'rgb(129 79 39 / .15)', 'stroke-width': i % 5 === 4 ? 5 : 2.5 }, g));

    // Graticule
    const gr = el('g', { stroke: 'rgb(41 48 64 / .10)', 'stroke-width': 2, 'stroke-dasharray': '2 18' }, svg);
    for (let x = Math.ceil(x0 / 1000) * 1000; x < x0 + W; x += 1000) el('line', { x1: x, y1: y0, x2: x, y2: y0 + H }, gr);
    for (let y = Math.ceil(y0 / 1000) * 1000; y < y0 + H; y += 1000) el('line', { x1: x0, y1: y, x2: x0 + W, y2: y }, gr);

    // Routes between adjacent regions
    const rg = el('g', { fill: 'none' }, svg);
    links.forEach(([a, b, dirLabel]) => {
      const A = rects[a], B = rects[b];
      let p, q;
      if (Math.abs(A.cx - B.cx) > Math.abs(A.cy - B.cy) && (A.x + A.w < B.x || B.x + B.w < A.x)) {
        const left = A.cx < B.cx ? A : B, right = left === A ? B : A;
        const y = Math.max(left.y, right.y) + 900;
        p = [left.x + left.w, Math.min(y, left.y + left.h - 200)];
        q = [right.x, Math.min(y, right.y + right.h - 200)];
      } else {
        const top = A.cy < B.cy ? A : B, bot = top === A ? B : A;
        p = [top.cx, top.y + top.h]; q = [bot.cx, bot.y];
      }
      const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
      const d = `M${p}C${mx} ${p[1]} ${mx} ${q[1]} ${q}`;
      el('path', { d, stroke: 'rgb(187 136 55 / .7)', 'stroke-width': 10, 'stroke-dasharray': '6 34', 'stroke-linecap': 'round' }, rg);
      el('circle', { cx: p[0], cy: p[1], r: 26, fill: '#bb8837' }, rg);
      el('circle', { cx: q[0], cy: q[1], r: 26, fill: '#bb8837' }, rg);
      const t = el('text', { x: mx, y: my - 40, 'text-anchor': 'middle', 'font-size': 84, 'letter-spacing': 18, 'font-family': 'Geist Mono, monospace', fill: 'rgb(129 79 39 / .8)' }, rg);
      t.textContent = dirLabel;
    });

    // Compass rose + cartouche in open ground
    const cr = el('g', { transform: `translate(${bounds.x - 1300} ${bounds.y + 900}) scale(1.6)` }, svg);
    el('circle', { r: 420, fill: 'none', stroke: 'rgb(41 48 64 / .35)', 'stroke-width': 3 }, cr);
    el('circle', { r: 390, fill: 'none', stroke: 'rgb(41 48 64 / .2)', 'stroke-width': 2 }, cr);
    for (let i = 0; i < 32; i++) {
      const a = i * Math.PI / 16, long = i % 4 === 0;
      el('line', { x1: Math.cos(a) * (long ? 300 : 360), y1: Math.sin(a) * (long ? 300 : 360), x2: Math.cos(a) * 390, y2: Math.sin(a) * 390, stroke: 'rgb(41 48 64 / .3)', 'stroke-width': 2 }, cr);
    }
    const star = (r, w, rot, fill) => {
      const s = el('g', { transform: `rotate(${rot})` }, cr);
      for (let k = 0; k < 4; k++) el('path', { d: `M0 ${-r}L${w} 0L0 0Z`, fill, transform: `rotate(${k * 90})` }, s),
        el('path', { d: `M0 ${-r}L${-w} 0L0 0Z`, fill: 'rgb(41 48 64 / .75)', transform: `rotate(${k * 90})` }, s);
    };
    star(260, 44, 45, 'rgb(187 136 55 / .55)');
    star(360, 60, 0, 'rgb(187 136 55 / .9)');
    [['N', 0, -450], ['E', 460, 16], ['S', 0, 490], ['W', -460, 16]].forEach(([l, x, y]) =>
      el('text', { x, y, 'text-anchor': 'middle', 'font-size': 80, 'font-family': 'Fraunces, serif', fill: '#293040' }, cr).textContent = l);

    const cart = el('g', { transform: `translate(${bounds.x + bounds.w + 500} ${bounds.y + 300}) scale(1.8)` }, svg);
    el('rect', { width: 1100, height: 520, fill: 'rgb(250 246 236 / .6)', stroke: 'rgb(41 48 64 / .45)', 'stroke-width': 3 }, cart);
    el('rect', { x: 18, y: 18, width: 1064, height: 484, fill: 'none', stroke: 'rgb(41 48 64 / .25)', 'stroke-width': 2 }, cart);
    const tl = (t, y, size, fam, fill, extra = {}) => el('text', Object.assign({ x: 550, y, 'text-anchor': 'middle', 'font-size': size, 'font-family': fam, fill }, extra), cart).textContent = t;
    tl('THE NOBLE BASE', 130, 38, 'Geist Mono, monospace', 'rgb(60 74 104 / .8)', { 'letter-spacing': 14 });
    tl('Atlas of Growth', 270, 120, 'Fraunces, serif', '#293040');
    tl('in six regions, drawn to scale', 350, 48, 'Fraunces, serif', '#814f27', { 'font-style': 'italic' });
    tl('MMXXVI · 48.4°N · 89.2°W', 440, 30, 'Geist Mono, monospace', 'rgb(60 74 104 / .7)', { 'letter-spacing': 8 });
  }

  window.Terrain = { drawRoute, drawInstrument, drawWorld };
})();
