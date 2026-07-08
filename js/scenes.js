/* ============================================================
   scenes.js — cinematic country backdrops
   Layered parallax scenes: sky → celestial → far → mid → near
   plus ambient FX (clouds, birds, fireflies, snow, aurora…)
   and an entry "flourish" (e.g. a toucan swooshing across).
   ============================================================ */

const CountryScenes = (() => {
  const W = 1600, H = 900;

  /* ---------- seeded rng so scenes are stable ---------- */
  function rng(seed) {
    let s = (seed >>> 0) || 1;
    return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  }

  /* ================= terrain / landmark generators =================
     Every generator returns an SVG fragment string (viewBox 1600x900). */

  function ridge(o) { // jagged mountain range
    const { c, y = .55, amp = .17, n = 9, seed = 1, snow = null, op = 1 } = o;
    const r = rng(seed); const pk = [];
    for (let i = 0; i <= n; i++) {
      const x = i / n * W;
      const yy = H * (y - (i % 2 ? amp * (.55 + r() * .8) : amp * .18 * r()));
      pk.push([Math.round(x), Math.round(yy)]);
    }
    let s = `<polygon points="0,${H} ${pk.map(p => p.join(",")).join(" ")} ${W},${H}" fill="${c}" opacity="${op}"/>`;
    if (snow) s += pk.filter((_, i) => i % 2 === 1).map(([x, yy]) =>
      `<polygon points="${x - 40},${yy + 52} ${x - 20},${yy + 30} ${x - 8},${yy + 42} ${x},${yy} ${x + 10},${yy + 44} ${x + 24},${yy + 32} ${x + 40},${yy + 52}" fill="${snow}"/>`).join("");
    return s;
  }

  function hills(o) { // soft rolling hills
    const { c, y = .68, amp = .07, n = 5, seed = 2, op = 1 } = o;
    const r = rng(seed); let d = `M0,${H} L0,${H * y}`;
    for (let i = 0; i < n; i++) {
      const x1 = (i + .5) / n * W, x2 = (i + 1) / n * W;
      d += ` Q${x1},${H * (y - amp * (.4 + r()))} ${x2},${H * (y + amp * .3 * (r() - .5))}`;
    }
    return `<path d="${d} L${W},${H} Z" fill="${c}" opacity="${op}"/>`;
  }

  function dunes(o) { // smooth desert dunes with lit crests
    const { c, hi = null, y = .7, amp = .09, n = 3, seed = 5, op = 1 } = o;
    const r = rng(seed); let d = `M0,${H} L0,${H * y}`; const crest = [];
    for (let i = 0; i < n; i++) {
      const xm = (i + .45 + r() * .2) / n * W, xe = (i + 1) / n * W;
      const yp = H * (y - amp * (.6 + r() * .7));
      d += ` Q${xm},${yp} ${xe},${H * (y + amp * .2)}`;
      crest.push([xm, yp, xe]);
    }
    let s = `<path d="${d} L${W},${H} Z" fill="${c}" opacity="${op}"/>`;
    if (hi) s += crest.map(([xm, yp, xe]) =>
      `<path d="M${xm - 120},${yp + 34} Q${xm},${yp - 2} ${xe},${H * (y + amp * .2)}" stroke="${hi}" stroke-width="5" fill="none" opacity=".55"/>`).join("");
    return s;
  }

  function canopy(o) { // jungle tree-top bumps
    const { c, y = .6, seed = 3, bump = 90, op = 1 } = o;
    const r = rng(seed); let s = `<rect x="0" y="${H * y + bump * .6}" width="${W}" height="${H}" fill="${c}" opacity="${op}"/>`;
    for (let x = -60; x < W + 60; x += 52 + r() * 60)
      s += `<ellipse cx="${x}" cy="${H * y + r() * 40}" rx="${bump * (.7 + r() * .7)}" ry="${bump * (.5 + r() * .5)}" fill="${c}" opacity="${op}"/>`;
    return s;
  }

  function water(o) { // sea / river band with shimmer lines
    const { c1, c2, y = .78 } = o;
    const id = "wg" + Math.round(y * 100) + c1.replace(/[^a-z0-9]/gi, "");
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      <rect x="0" y="${H * y}" width="${W}" height="${H * (1 - y)}" fill="url(#${id})"/>`;
    for (let i = 0; i < 5; i++)
      s += `<rect class="shimmer" x="${80 + i * 300}" y="${H * y + 20 + i * 26}" width="${140 + i * 40}" height="3" fill="#fff" opacity=".25" style="animation-delay:${i * .9}s"/>`;
    return s;
  }

  function city(o) { // skyline of towers with flickering windows
    const { c, y = .74, n = 15, seed = 8, lit = "#ffd27f", maxH = .3, litP = .5, op = 1 } = o;
    const r = rng(seed); let s = ""; let x = -20;
    while (x < W + 20) {
      const w = 46 + r() * 90, h = H * maxH * (.35 + r() * .65);
      const ty = H * y - h;
      s += `<rect x="${x}" y="${ty}" width="${w}" height="${h + H * (1 - y)}" fill="${c}" opacity="${op}"/>`;
      if (r() < .35) s += `<rect x="${x + w / 2 - 3}" y="${ty - 26}" width="6" height="26" fill="${c}"/>`;
      for (let wy = ty + 14; wy < H * y - 10; wy += 26)
        for (let wx = x + 8; wx < x + w - 10; wx += 20)
          if (r() < litP * .45) s += `<rect class="wlit" x="${wx}" y="${wy}" width="7" height="9" fill="${lit}" style="animation-delay:${(r() * 6).toFixed(1)}s"/>`;
      x += w + 6 + r() * 30;
    }
    return s;
  }

  function pines(o) { // conifer row
    const { c, y = .8, n = 26, seed = 4, hMax = 120 } = o;
    const r = rng(seed); let s = "";
    for (let i = 0; i < n; i++) {
      const x = r() * W, h = hMax * (.5 + r() * .5), b = H * (y + r() * .12);
      s += `<polygon points="${x},${b - h} ${x - h * .3},${b} ${x + h * .3},${b}" fill="${c}"/>
            <polygon points="${x},${b - h * 1.4} ${x - h * .22},${b - h * .5} ${x + h * .22},${b - h * .5}" fill="${c}"/>`;
    }
    return s;
  }

  function palm(x, yB, s, flip, c) { // single palm silhouette
    const f = flip ? -1 : 1;
    let out = `<path d="M${x},${yB} q${18 * f},${-s * .5} ${s * .34 * f},${-s}" stroke="${c}" stroke-width="${s * .09}" fill="none" stroke-linecap="round"/>`;
    const tx = x + s * .34 * f, ty = yB - s;
    for (let i = 0; i < 6; i++) {
      const a = -140 + i * 52, rad = a * Math.PI / 180;
      out += `<path d="M${tx},${ty} q${Math.cos(rad) * s * .35},${Math.sin(rad) * s * .3 - 8} ${Math.cos(rad) * s * .62},${Math.sin(rad) * s * .5 + s * .12}" stroke="${c}" stroke-width="${s * .055}" fill="none" stroke-linecap="round"/>`;
    }
    return out;
  }
  function palms(o) {
    const { c, y = .97, seed = 6, n = 3, size = 300 } = o;
    const r = rng(seed); let s = "";
    for (let i = 0; i < n; i++) {
      const left = r() < .5;
      s += palm(left ? r() * W * .2 : W - r() * W * .2, H * y, size * (.7 + r() * .5), !left, c);
    }
    return s;
  }

  function leafframe(o) { // giant jungle leaves framing screen edges
    const { c } = o;
    let s = "";
    const leaf = (x, y, a, sc) => `<g transform="translate(${x},${y}) rotate(${a}) scale(${sc})">
      <path d="M0,0 Q60,-90 190,-96 Q120,-40 116,0 Q120,40 190,96 Q60,90 0,0" fill="${c}"/>
      <path d="M0,0 L150,0" stroke="${c}" stroke-width="10"/></g>`;
    s += leaf(-30, 120, 24, 1.5) + leaf(-40, 380, -6, 1.9) + leaf(-20, 700, -30, 1.6);
    s += leaf(W + 30, 160, 156, 1.7) + leaf(W + 40, 470, 186, 2) + leaf(W + 20, 760, 210, 1.5);
    return s;
  }

  /* ---------- landmarks ---------- */
  function eiffel(o) {
    const { c, x = 800, y = .86, s = 1 } = o; const b = H * y;
    const t = (px, py) => `${x + px * s},${b - py * s}`;
    return `<g>
      <polygon points="${t(-150, 0)} ${t(-96, 8)} ${t(-44, 150)} ${t(-30, 260)} ${t(-16, 380)} ${t(-7, 470)} ${t(7, 470)} ${t(16, 380)} ${t(30, 260)} ${t(44, 150)} ${t(96, 8)} ${t(150, 0)} ${t(64, 0)} ${t(0, 92)} ${t(-64, 0)}" fill="${c}"/>
      <rect x="${x - 78 * s}" y="${b - 165 * s}" width="${156 * s}" height="${14 * s}" fill="${c}"/>
      <rect x="${x - 46 * s}" y="${b - 275 * s}" width="${92 * s}" height="${11 * s}" fill="${c}"/>
      <rect x="${x - 18 * s}" y="${b - 480 * s}" width="${36 * s}" height="${10 * s}" fill="${c}"/>
      <rect x="${x - 2.5 * s}" y="${b - 520 * s}" width="${5 * s}" height="${44 * s}" fill="${c}"/>
    </g>`;
  }

  function bigben(o) {
    const { c, x = 1080, y = .84, s = 1, lit = "#ffe9a0" } = o; const b = H * y;
    return `<g>
      <rect x="${x - 30 * s}" y="${b - 330 * s}" width="${60 * s}" height="${330 * s}" fill="${c}"/>
      <polygon points="${x - 34 * s},${b - 330 * s} ${x + 34 * s},${b - 330 * s} ${x},${b - 420 * s}" fill="${c}"/>
      <rect x="${x - 22 * s}" y="${b - 310 * s}" width="${44 * s}" height="${44 * s}" fill="${c}" stroke="${lit}" stroke-width="3"/>
      <circle cx="${x}" cy="${b - 288 * s}" r="${15 * s}" fill="${lit}" opacity=".9"/>
      <rect x="${x + 40 * s}" y="${b - 150 * s}" width="${430 * s}" height="${150 * s}" fill="${c}"/>
      ${Array.from({ length: 11 }, (_, i) => `<rect x="${x + (52 + i * 38) * s}" y="${b - 168 * s}" width="${12 * s}" height="${18 * s}" fill="${c}"/>`).join("")}
      <rect x="${x + 445 * s}" y="${b - 230 * s}" width="${46 * s}" height="${230 * s}" fill="${c}"/>
      <polygon points="${x + 440 * s},${b - 230 * s} ${x + 496 * s},${b - 230 * s} ${x + 468 * s},${b - 280 * s}" fill="${c}"/>
    </g>`;
  }

  function londoneye(o) {
    const { c, x = 380, y = .8, r = 130 } = o; const cy = H * y - r;
    let sp = "";
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      sp += `<line x1="${x}" y1="${cy}" x2="${x + Math.cos(a) * r}" y2="${cy + Math.sin(a) * r}" stroke="${c}" stroke-width="4"/>
             <circle cx="${x + Math.cos(a) * r}" cy="${cy + Math.sin(a) * r}" r="7" fill="${c}"/>`;
    }
    return `<g><circle cx="${x}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="6"/>${sp}
      <polygon points="${x - 60},${H * y} ${x},${cy} ${x + 60},${H * y}" fill="none" stroke="${c}" stroke-width="8"/></g>`;
  }

  function pyramids(o) {
    const { c, hi, y = .78 } = o; const b = H * y;
    const py = (x, w, h) => `<polygon points="${x - w},${b} ${x},${b - h} ${x + w},${b}" fill="${c}"/>` +
      (hi ? `<polygon points="${x},${b - h} ${x + w * .18},${b - h * .55} ${x - w * .1},${b - h * .5}" fill="${hi}" opacity=".7"/>` : "");
    return py(430, 260, 300) + py(880, 210, 240) + py(1230, 150, 170);
  }

  function fuji(o) {
    const { c, snow = "#f6f2ff", x = 800, y = .82, w = 620, h = 430 } = o; const b = H * y;
    return `<g><path d="M${x - w},${b} Q${x - w * .35},${b - h * .55} ${x - w * .13},${b - h} L${x + w * .13},${b - h} Q${x + w * .35},${b - h * .55} ${x + w},${b} Z" fill="${c}"/>
      <path d="M${x - w * .16},${b - h * .96} L${x + w * .16},${b - h * .96} L${x + w * .22},${b - h * .68} l-40,26 -38,-30 -44,34 -40,-26 -42,28 -34,-22 Z" fill="${snow}"/></g>`;
  }

  function aztec(o) {
    const { c, x = 800, y = .84, s = 1 } = o; const b = H * y;
    let out = "", widths = [300, 240, 180, 120], hh = 52 * s;
    widths.forEach((w, i) => {
      out += `<rect x="${x - w * s / 2}" y="${b - hh * (i + 1)}" width="${w * s}" height="${hh}" fill="${c}"/>`;
    });
    out += `<rect x="${x - 40 * s}" y="${b - hh * 5}" width="${80 * s}" height="${hh}" fill="${c}"/>
      <rect x="${x - 14 * s}" y="${b - hh * 4 - 30 * s}" width="${28 * s}" height="${30 * s}" fill="#ffca5f" opacity=".85"/>
      <rect x="${x - 12 * s}" y="${b - hh * 4}" width="${24 * s}" height="${hh * 4}" fill="${c}"/>`;
    return out;
  }

  function pagoda(o) {
    const { c, x = 350, y = .86, s = 1 } = o; const b = H * y;
    let out = ""; const tiers = [[190, 0], [150, 95], [110, 180]];
    tiers.forEach(([w, dy]) => {
      const ty = b - dy * s;
      out += `<path d="M${x - w * s},${ty} Q${x - w * s * .6},${ty - 26 * s} ${x},${ty - 34 * s} Q${x + w * s * .6},${ty - 26 * s} ${x + w * s},${ty} L${x + w * s * .8},${ty - 8 * s} Q${x},${ty - 52 * s} ${x - w * s * .8},${ty - 8 * s} Z" fill="${c}"/>
        <rect x="${x - w * s * .5}" y="${ty - 90 * s}" width="${w * s}" height="${56 * s}" fill="${c}"/>`;
    });
    out += `<rect x="${x - 4 * s}" y="${b - 300 * s}" width="${8 * s}" height="${40 * s}" fill="${c}"/>`;
    return out;
  }

  function mosque(o) {
    const { c, x = 800, y = .8, s = 1, lit = "#ffd98f" } = o; const b = H * y;
    return `<g>
      <rect x="${x - 170 * s}" y="${b - 110 * s}" width="${340 * s}" height="${110 * s}" fill="${c}"/>
      <path d="M${x - 95 * s},${b - 110 * s} Q${x - 95 * s},${b - 235 * s} ${x},${b - 245 * s} Q${x + 95 * s},${b - 235 * s} ${x + 95 * s},${b - 110 * s} Z" fill="${c}"/>
      <line x1="${x}" y1="${b - 245 * s}" x2="${x}" y2="${b - 285 * s}" stroke="${c}" stroke-width="${5 * s}"/>
      <circle cx="${x}" cy="${b - 290 * s}" r="${7 * s}" fill="${c}"/>
      ${[-1, 1].map(f => `
        <rect x="${x + f * 250 * s - 12 * s}" y="${b - 330 * s}" width="${24 * s}" height="${330 * s}" fill="${c}"/>
        <rect x="${x + f * 250 * s - 20 * s}" y="${b - 240 * s}" width="${40 * s}" height="${14 * s}" fill="${c}"/>
        <polygon points="${x + f * 250 * s - 16 * s},${b - 330 * s} ${x + f * 250 * s + 16 * s},${b - 330 * s} ${x + f * 250 * s},${b - 375 * s}" fill="${c}"/>`).join("")}
      ${Array.from({ length: 5 }, (_, i) => `<rect x="${x - 130 * s + i * 60 * s}" y="${b - 80 * s}" width="${16 * s}" height="${34 * s}" rx="${8 * s}" fill="${lit}" opacity=".8"/>`).join("")}
    </g>`;
  }

  function opera(o) {
    const { c, x = 760, y = .8, s = 1 } = o; const b = H * y;
    const shell = (dx, w, h) => `<path d="M${x + dx * s},${b} Q${x + (dx + w * .28) * s},${b - h * s} ${x + (dx + w) * s},${b} Z" fill="${c}"/>`;
    return shell(-260, 300, 210) + shell(-60, 280, 250) + shell(130, 240, 185) +
      `<rect x="${x - 290 * s}" y="${b - 14 * s}" width="${680 * s}" height="${14 * s}" fill="${c}"/>`;
  }

  function harborbridge(o) {
    const { c, x = 800, y = .8, w = 700 } = o; const b = H * y;
    return `<g fill="none" stroke="${c}">
      <path d="M${x - w / 2},${b} Q${x},${b - 320} ${x + w / 2},${b}" stroke-width="16"/>
      <path d="M${x - w / 2},${b - 60} Q${x},${b - 250} ${x + w / 2},${b - 60}" stroke-width="10"/>
      <line x1="${x - w / 2}" y1="${b - 56}" x2="${x + w / 2}" y2="${b - 56}" stroke-width="10"/>
      ${Array.from({ length: 9 }, (_, i) => { const px = x - w / 2 + (i + 1) * w / 10; return `<line x1="${px}" y1="${b - 60}" x2="${px}" y2="${b - 175}" stroke-width="5"/>`; }).join("")}
    </g>`;
  }

  function windmill(o) {
    const { c, x = 1150, y = .8, s = 1 } = o; const b = H * y; const cy = b - 235 * s;
    return `<g>
      <polygon points="${x - 55 * s},${b} ${x + 55 * s},${b} ${x + 30 * s},${b - 200 * s} ${x - 30 * s},${b - 200 * s}" fill="${c}"/>
      <path d="M${x - 32 * s},${b - 200 * s} Q${x},${b - 260 * s} ${x + 32 * s},${b - 200 * s} Z" fill="${c}"/>
      <g class="mill" style="transform-origin:${x}px ${cy}px">
        ${[0, 90, 180, 270].map(a => `<rect x="${x - 8 * s}" y="${cy - 150 * s}" width="${16 * s}" height="${150 * s}" fill="${c}" transform="rotate(${a + 18} ${x} ${cy})"/>`).join("")}
      </g></g>`;
  }

  function obelisk(o) {
    const { c, x = 800, y = .84, s = 1 } = o; const b = H * y;
    return `<polygon points="${x - 26 * s},${b} ${x + 26 * s},${b} ${x + 14 * s},${b - 330 * s} ${x - 14 * s},${b - 330 * s}" fill="${c}"/>
      <polygon points="${x - 14 * s},${b - 330 * s} ${x + 14 * s},${b - 330 * s} ${x},${b - 368 * s}" fill="${c}"/>
      <rect x="${x - 44 * s}" y="${b - 18 * s}" width="${88 * s}" height="${18 * s}" fill="${c}"/>`;
  }

  function castle(o) {
    const { c, x = 800, y = .74, s = 1, lit = "#ffd98f" } = o; const b = H * y;
    const tower = (dx, w, h, cone) => `
      <rect x="${x + (dx - w / 2) * s}" y="${b - h * s}" width="${w * s}" height="${h * s}" fill="${c}"/>
      ${cone ? `<polygon points="${x + (dx - w / 2 - 8) * s},${b - h * s} ${x + (dx + w / 2 + 8) * s},${b - h * s} ${x + dx * s},${b - (h + 85) * s}" fill="${c}"/>` : ""}
      <rect x="${x + (dx - 6) * s}" y="${b - (h - 30) * s}" width="${12 * s}" height="${20 * s}" rx="${6 * s}" fill="${lit}" opacity=".85"/>`;
    return `<g>
      <rect x="${x - 240 * s}" y="${b - 130 * s}" width="${480 * s}" height="${130 * s}" fill="${c}"/>
      ${Array.from({ length: 12 }, (_, i) => `<rect x="${x + (-240 + i * 42) * s}" y="${b - 148 * s}" width="${20 * s}" height="${18 * s}" fill="${c}"/>`).join("")}
      ${tower(-230, 70, 230, 1)}${tower(0, 90, 300, 1)}${tower(230, 70, 230, 1)}
    </g>`;
  }

  function archbridge(o) {
    const { c, x = 800, y = .78, w = 560 } = o; const b = H * y;
    return `<g>
      <path d="M${x - w / 2},${b + 80} Q${x},${b - 190} ${x + w / 2},${b + 80}" stroke="${c}" stroke-width="26" fill="none"/>
      <rect x="${x - w / 2 - 60}" y="${b - 108}" width="${w + 120}" height="20" fill="${c}"/>
      <rect x="${x - w / 2 - 40}" y="${b - 190}" width="46" height="90" fill="${c}"/>
      <rect x="${x + w / 2 - 6}" y="${b - 190}" width="46" height="90" fill="${c}"/>
    </g>`;
  }

  function fjordcliffs(o) {
    const { cL, cR } = o;
    return `<polygon points="0,${H} 0,${H * .12} ${W * .18},${H * .3} ${W * .34},${H * .62} ${W * .4},${H}" fill="${cL}"/>
      <polygon points="${W},${H} ${W},${H * .08} ${W * .84},${H * .26} ${W * .66},${H * .58} ${W * .6},${H}" fill="${cR}"/>`;
  }

  function tablemt(o) {
    const { c, x = 800, y = .72, w = 900, h = 330 } = o; const b = H * y;
    return `<polygon points="${x - w / 2},${b} ${x - w * .3},${b - h} ${x + w * .3},${b - h} ${x + w / 2},${b}" fill="${c}"/>`;
  }

  function matterhorn(o) {
    const { c, snow = "#eef2ff", x = 700, y = .78 } = o; const b = H * y;
    return `<g><polygon points="${x - 340},${b} ${x - 90},${b - 330} ${x - 30},${b - 420} ${x + 30},${b - 470} ${x + 70},${b - 380} ${x + 130},${b - 300} ${x + 360},${b}" fill="${c}"/>
      <polygon points="${x + 30},${b - 470} ${x + 70},${b - 380} ${x + 40},${b - 330} ${x - 10},${b - 370} ${x - 30},${b - 420}" fill="${snow}"/>
      <polygon points="${x - 30},${b - 420} ${x - 10},${b - 370} ${x - 60},${b - 300} ${x - 90},${b - 330}" fill="${snow}" opacity=".75"/></g>`;
  }

  function baobabs(o) {
    const { c, y = .82, seed = 12, n = 2 } = o; const r = rng(seed); let s = "";
    for (let i = 0; i < n; i++) {
      const x = 200 + r() * 1200, b = H * (y + r() * .08), sc = .7 + r() * .6;
      s += `<g><polygon points="${x - 44 * sc},${b} ${x - 26 * sc},${b - 170 * sc} ${x + 26 * sc},${b - 170 * sc} ${x + 44 * sc},${b}" fill="${c}"/>
        ${[-60, -25, 15, 55].map(a => `<line x1="${x}" y1="${b - 165 * sc}" x2="${x + a * sc}" y2="${b - 230 * sc}" stroke="${c}" stroke-width="${10 * sc}"/>`).join("")}
        <ellipse cx="${x}" cy="${b - 235 * sc}" rx="${120 * sc}" ry="${26 * sc}" fill="${c}"/></g>`;
    }
    return s;
  }

  function acacias(o) {
    const { c, y = .8, seed = 9, n = 3 } = o; const r = rng(seed); let s = "";
    for (let i = 0; i < n; i++) {
      const x = 150 + r() * 1300, b = H * (y + r() * .1), sc = .5 + r() * .7;
      s += `<line x1="${x}" y1="${b}" x2="${x + 14 * sc}" y2="${b - 130 * sc}" stroke="${c}" stroke-width="${9 * sc}"/>
        <line x1="${x + 14 * sc}" y1="${b - 130 * sc}" x2="${x - 30 * sc}" y2="${b - 165 * sc}" stroke="${c}" stroke-width="${6 * sc}"/>
        <ellipse cx="${x + 8 * sc}" cy="${b - 172 * sc}" rx="${105 * sc}" ry="${20 * sc}" fill="${c}"/>`;
    }
    return s;
  }

  function waxpalms(o) {
    const { c, y = .88, seed = 21, n = 5 } = o; const r = rng(seed); let s = "";
    for (let i = 0; i < n; i++) {
      const x = 120 + r() * 1360, b = H * (y + r() * .1), h = 300 + r() * 260;
      s += `<path d="M${x},${b} q${(r() - .5) * 40},${-h / 2} ${(r() - .5) * 60},${-h}" stroke="${c}" stroke-width="9" fill="none"/>`;
      const tx = x + (r() - .5) * 50, ty = b - h;
      for (let j = 0; j < 5; j++) {
        const a = (-150 + j * 60) * Math.PI / 180;
        s += `<path d="M${tx},${ty} q${Math.cos(a) * 34},${Math.sin(a) * 26 - 6} ${Math.cos(a) * 62},${Math.sin(a) * 48 + 16}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      }
    }
    return s;
  }

  function cactus(o) {
    const { c, y = .9, seed = 14, n = 3 } = o; const r = rng(seed); let s = "";
    for (let i = 0; i < n; i++) {
      const x = 100 + r() * 1400, b = H * (y + r() * .08), sc = .5 + r() * .8;
      s += `<rect x="${x - 16 * sc}" y="${b - 190 * sc}" width="${32 * sc}" height="${190 * sc}" rx="${16 * sc}" fill="${c}"/>
        <rect x="${x - 62 * sc}" y="${b - 150 * sc}" width="${24 * sc}" height="${70 * sc}" rx="${12 * sc}" fill="${c}"/>
        <rect x="${x - 62 * sc}" y="${b - 104 * sc}" width="${50 * sc}" height="${22 * sc}" rx="${11 * sc}" fill="${c}"/>
        <rect x="${x + 38 * sc}" y="${b - 170 * sc}" width="${24 * sc}" height="${90 * sc}" rx="${12 * sc}" fill="${c}"/>
        <rect x="${x + 12 * sc}" y="${b - 124 * sc}" width="${50 * sc}" height="${22 * sc}" rx="${11 * sc}" fill="${c}"/>`;
    }
    return s;
  }

  function petra(o) {
    const { rock = "#3d1620", facade = "#8a4a52", glow = "#ffb26b" } = o;
    const cols = Array.from({ length: 6 }, (_, i) =>
      `<rect x="${640 + i * 56}" y="${H * .42}" width="22" height="${H * .4}" fill="${facade}"/>`).join("");
    return `<g>
      <polygon points="0,${H} 0,0 ${W * .38},0 ${W * .42},${H * .3} ${W * .38},${H}" fill="${rock}"/>
      <polygon points="${W},${H} ${W},0 ${W * .62},0 ${W * .58},${H * .34} ${W * .62},${H}" fill="${rock}"/>
      <rect x="${W * .38}" y="${H * .3}" width="${W * .24}" height="${H * .7}" fill="${glow}" opacity=".28"/>
      <polygon points="610,${H * .42} 990,${H * .42} 800,${H * .3}" fill="${facade}"/>
      ${cols}
      <rect x="610" y="${H * .82}" width="380" height="26" fill="${facade}"/>
    </g>`;
  }

  function lighthouse(o) {
    const { c = "#2a2036", x = 1220, y = .78, s = 1 } = o; const b = H * y;
    return `<g>
      <polygon points="${x - 34 * s},${b} ${x + 34 * s},${b} ${x + 22 * s},${b - 190 * s} ${x - 22 * s},${b - 190 * s}" fill="${c}"/>
      <rect x="${x - 26 * s}" y="${b - 214 * s}" width="${52 * s}" height="${24 * s}" fill="${c}"/>
      <circle cx="${x}" cy="${b - 232 * s}" r="${16 * s}" fill="#ffe9a0" class="beam"/>
      <polygon points="${x},${b - 232 * s} ${x - 300 * s},${b - 300 * s} ${x - 300 * s},${b - 190 * s}" fill="#ffe9a0" opacity=".14" class="beam"/>
    </g>`;
  }

  function cabins(o) {
    const { c = "#1a0f14", y = .82, seed = 17, n = 5, lit = "#ffb45f" } = o;
    const r = rng(seed); let s = "";
    for (let i = 0; i < n; i++) {
      const x = 100 + r() * 1400, b = H * (y + r() * .1), w = 60 + r() * 40, h = 40 + r() * 24;
      s += `<rect x="${x}" y="${b - h}" width="${w}" height="${h}" fill="${c}"/>
        <polygon points="${x - 8},${b - h} ${x + w + 8},${b - h} ${x + w / 2},${b - h - 34}" fill="${c}"/>
        <rect x="${x + w / 2 - 7}" y="${b - h + 10}" width="14" height="14" fill="${lit}" class="wlit" style="animation-delay:${(r() * 5).toFixed(1)}s"/>`;
    }
    return s;
  }

  function sails(o) {
    const { c = "#101226", y = .84, seed = 19, n = 3 } = o;
    const r = rng(seed); let s = "";
    for (let i = 0; i < n; i++) {
      const x = 150 + r() * 1300, b = H * (y + r() * .08), sc = .5 + r() * .6;
      s += `<g class="bob" style="animation-delay:${(r() * 3).toFixed(1)}s">
        <path d="M${x - 40 * sc},${b} q${40 * sc},${16 * sc} ${80 * sc},0 l-${8 * sc},-${10 * sc} h-${64 * sc} Z" fill="${c}"/>
        <polygon points="${x},${b - 8 * sc} ${x},${b - 70 * sc} ${x + 34 * sc},${b - 12 * sc}" fill="${c}"/>
        <polygon points="${x - 4 * sc},${b - 10 * sc} ${x - 4 * sc},${b - 58 * sc} ${x - 30 * sc},${b - 12 * sc}" fill="${c}"/></g>`;
    }
    return s;
  }

  function torii(o) {
    const { c = "#7a1420", x = 320, y = .88, s = 1 } = o; const b = H * y;
    return `<g fill="${c}">
      <rect x="${x - 90 * s}" y="${b - 190 * s}" width="${180 * s}" height="${16 * s}"/>
      <path d="M${x - 118 * s},${b - 230 * s} q${118 * s},${-26 * s} ${236 * s},0 l0,${18 * s} q${-118 * s},${-24 * s} ${-236 * s},0 Z"/>
      <rect x="${x - 74 * s}" y="${b - 214 * s}" width="${14 * s}" height="${214 * s}"/>
      <rect x="${x + 60 * s}" y="${b - 214 * s}" width="${14 * s}" height="${214 * s}"/>
      <rect x="${x - 8 * s}" y="${b - 214 * s}" width="${16 * s}" height="${24 * s}"/>
    </g>`;
  }

  function nycspire(o) { // empire-state style setback tower
    const { c, x = 500, y = .74, s = 1, lit = "#ffd27f" } = o; const b = H * y;
    let out = ""; const lv = [[150, 120], [110, 250], [70, 360], [36, 430]];
    lv.forEach(([w, h]) => { out += `<rect x="${x - w * s / 2}" y="${b - h * s}" width="${w * s}" height="${h * s}" fill="${c}"/>`; });
    out += `<rect x="${x - 3 * s}" y="${b - 500 * s}" width="${6 * s}" height="${70 * s}" fill="${c}"/>`;
    const r = rng(31);
    for (let wy = b - 420 * s; wy < b - 20; wy += 24 * s)
      for (let wx = x - 60 * s; wx < x + 55 * s; wx += 22 * s)
        if (r() < .4) out += `<rect class="wlit" x="${wx}" y="${wy}" width="${6 * s}" height="${9 * s}" fill="${lit}" style="animation-delay:${(r() * 6).toFixed(1)}s"/>`;
    return out;
  }

  const GEN = {
    ridge, hills, dunes, canopy, water, city, pines, palms, leafframe,
    eiffel, bigben, londoneye, pyramids, fuji, aztec, pagoda, mosque, opera,
    harborbridge, windmill, obelisk, castle, archbridge, fjordcliffs, tablemt,
    matterhorn, baobabs, acacias, waxpalms, cactus, petra, lighthouse, cabins,
    sails, torii, nycspire
  };

  /* ================= ambient FX (DOM layers) ================= */
  const FX = {
    clouds(host, o = {}) {
      const { n = 4, tint = "#ffffff", op = .4, seed = 40 } = o; const r = rng(seed);
      for (let i = 0; i < n; i++) {
        const el = document.createElement("span");
        el.className = "fx-cloud";
        const sc = .6 + r() * 1.1;
        el.innerHTML = `<svg viewBox="0 0 220 80" width="${220 * sc}" height="${80 * sc}">
          <ellipse cx="70" cy="52" rx="66" ry="24" fill="${tint}"/>
          <ellipse cx="130" cy="40" rx="56" ry="28" fill="${tint}"/>
          <ellipse cx="170" cy="56" rx="46" ry="18" fill="${tint}"/></svg>`;
        el.style.cssText = `top:${4 + r() * 34}%;opacity:${op * (.6 + r() * .5)};
          animation-duration:${70 + r() * 90}s;animation-delay:-${r() * 120}s;`;
        host.appendChild(el);
      }
    },
    stars(host, o = {}) {
      const { density = 60, seed = 41 } = o; const r = rng(seed);
      const el = document.createElement("div"); el.className = "fx-stars";
      let bg = [];
      for (let i = 0; i < density; i++)
        bg.push(`radial-gradient(${r() < .2 ? 2 : 1.4}px ${r() < .2 ? 2 : 1.4}px at ${(r() * 100).toFixed(1)}% ${(r() * 55).toFixed(1)}%, ${r() < .15 ? "#ffe9a0" : "#fff"} 100%, transparent)`);
      el.style.backgroundImage = bg.join(",");
      host.appendChild(el);
    },
    aurora(host, o = {}) {
      const { c1 = "#3bf0a4", c2 = "#5a9cf8" } = o;
      for (let i = 0; i < 2; i++) {
        const el = document.createElement("span"); el.className = "fx-aurora";
        el.style.cssText = `left:${8 + i * 30}%;top:${2 + i * 7}%;
          background:linear-gradient(100deg, transparent 0%, ${c1} 30%, ${c2} 60%, transparent 100%);
          animation-delay:-${i * 5}s;`;
        host.appendChild(el);
      }
    },
    snow(host, o = {}) {
      const { n = 34, seed = 42 } = o; const r = rng(seed);
      for (let i = 0; i < n; i++) {
        const el = document.createElement("span"); el.className = "fx-flake";
        const s = 2 + r() * 4;
        el.style.cssText = `left:${r() * 100}%;width:${s}px;height:${s}px;
          animation-duration:${7 + r() * 9}s,${3 + r() * 3}s;animation-delay:-${r() * 16}s,-${r() * 3}s;opacity:${.4 + r() * .5};`;
        host.appendChild(el);
      }
    },
    sand(host, o = {}) {
      const { n = 22, c = "#ffd9a0", seed = 43 } = o; const r = rng(seed);
      for (let i = 0; i < n; i++) {
        const el = document.createElement("span"); el.className = "fx-grain";
        el.style.cssText = `top:${30 + r() * 65}%;width:${20 + r() * 60}px;background:${c};
          animation-duration:${4 + r() * 7}s;animation-delay:-${r() * 10}s;opacity:${.15 + r() * .3};`;
        host.appendChild(el);
      }
    },
    petals(host, o = {}) {
      const { n = 22, c = "#ffb7d5", seed = 44 } = o; const r = rng(seed);
      for (let i = 0; i < n; i++) {
        const el = document.createElement("span"); el.className = "fx-petal";
        const s = 6 + r() * 7;
        el.style.cssText = `left:${r() * 100}%;width:${s}px;height:${s * .8}px;background:${c};
          animation-duration:${9 + r() * 8}s,${2.4 + r() * 2}s;animation-delay:-${r() * 17}s,-${r() * 2}s;`;
        host.appendChild(el);
      }
    },
    leaves(host, o = {}) { FX.petals(host, { n: o.n || 18, c: o.c || "#d2543a", seed: 45 }); },
    fireflies(host, o = {}) {
      const { n = 16, c = "#d8ff7a", seed = 46 } = o; const r = rng(seed);
      for (let i = 0; i < n; i++) {
        const el = document.createElement("span"); el.className = "fx-fly";
        el.style.cssText = `left:${r() * 100}%;top:${35 + r() * 60}%;background:${c};box-shadow:0 0 8px 2px ${c};
          --dx:${(r() * 120 - 60).toFixed(0)}px;--dy:${(r() * 90 - 45).toFixed(0)}px;
          animation-duration:${8 + r() * 10}s,${1.6 + r() * 2.4}s;animation-delay:-${r() * 12}s,-${r() * 2}s;`;
        host.appendChild(el);
      }
    },
    butterflies(host, o = {}) {
      const { n = 8, c = "#ffe14d", seed = 47 } = o; const r = rng(seed);
      for (let i = 0; i < n; i++) {
        const el = document.createElement("span"); el.className = "fx-butterfly";
        el.innerHTML = `<svg viewBox="0 0 20 14" width="${14 + r() * 10}">
          <path class="bwing" d="M10,7 Q2,0 1,5 Q1,10 10,7" fill="${c}"/>
          <path class="bwing2" d="M10,7 Q18,0 19,5 Q19,10 10,7" fill="${c}"/></svg>`;
        el.style.cssText = `left:${r() * 90}%;top:${30 + r() * 55}%;
          --dx:${(r() * 200 - 100).toFixed(0)}px;--dy:${(r() * 120 - 80).toFixed(0)}px;
          animation-duration:${10 + r() * 9}s;animation-delay:-${r() * 14}s;`;
        host.appendChild(el);
      }
    },
    flock(host, o = {}) {
      const { n = 6, c = "#101020", seed = 48 } = o; const r = rng(seed);
      for (let i = 0; i < n; i++) {
        const el = document.createElement("span"); el.className = "fx-bird";
        const s = 10 + r() * 14;
        el.innerHTML = `<svg viewBox="0 0 24 10" width="${s}"><path class="flap" d="M0,8 Q6,0 12,6 Q18,0 24,8 Q18,4 12,9 Q6,4 0,8" fill="${c}"/></svg>`;
        el.style.cssText = `top:${6 + r() * 34}%;animation-duration:${26 + r() * 30}s;animation-delay:-${r() * 50}s;`;
        host.appendChild(el);
      }
    },
    mist(host, o = {}) {
      const { n = 3, c = "255,255,255", seed = 49 } = o; const r = rng(seed);
      for (let i = 0; i < n; i++) {
        const el = document.createElement("span"); el.className = "fx-mist";
        el.style.cssText = `top:${35 + r() * 45}%;left:${r() * 60 - 20}%;width:${40 + r() * 40}%;height:${8 + r() * 10}%;
          background:radial-gradient(ellipse, rgba(${c},.22), transparent 70%);
          animation-duration:${30 + r() * 30}s;animation-delay:-${r() * 40}s;`;
        host.appendChild(el);
      }
    },
    sparkle(host, o = {}) {
      const { x = 50, y = 45, n = 14, c = "#ffe9a0", spread = 9, seed = 50 } = o; const r = rng(seed);
      for (let i = 0; i < n; i++) {
        const el = document.createElement("span"); el.className = "fx-spark";
        el.style.cssText = `left:${x + (r() - .5) * spread}%;top:${y + (r() - .5) * spread * 2.4}%;background:${c};
          animation-duration:${.9 + r() * 1.4}s;animation-delay:-${r() * 2}s;`;
        host.appendChild(el);
      }
    }
  };

  /* ================= flourish birds ================= */
  const BIRDS = {
    toucan:   { body: "#14181c", belly: "#ffd94d", wing: "#0c0f12", beak: "#ff8c1a", beakLen: 40, beakDrop: 10, eye: "#fff" },
    parrot:   { body: "#2fae4e", belly: "#8fdc5a", wing: "#1c7a34", beak: "#e03e2f", beakLen: 18, tail: "#e03e2f" },
    eagle:    { body: "#4a3020", belly: "#6b4a30", wing: "#33210f", beak: "#e8b23a", beakLen: 16, head: "#f4efe4" },
    condor:   { body: "#16121a", belly: "#241c26", wing: "#0d0a10", beak: "#c9b18f", beakLen: 14, collar: "#f4efe4" },
    falcon:   { body: "#5d5a66", belly: "#cfc9be", wing: "#3f3c48", beak: "#e8b23a", beakLen: 14 },
    gull:     { body: "#f2f4f8", belly: "#ffffff", wing: "#b8c2d4", beak: "#f2a71b", beakLen: 16 },
    crane:    { body: "#f4f6fa", belly: "#ffffff", wing: "#d8dee8", beak: "#e8b23a", beakLen: 26, neck: 1, crest: "#d1273a" },
    flamingo: { body: "#ff8fb2", belly: "#ffb7cc", wing: "#f26a92", beak: "#2b2530", beakLen: 18, neck: 1, legs: 1 },
    cockatoo: { body: "#f7f7f2", belly: "#ffffff", wing: "#e4e2d8", beak: "#57534e", beakLen: 14, crest: "#ffd94d" },
    swallow:  { body: "#1c2c54", belly: "#f2ece2", wing: "#12203f", beak: "#3a3530", beakLen: 8, fork: 1 },
    goose:    { body: "#6e5b45", belly: "#d9cdb8", wing: "#503f2c", beak: "#2b2530", beakLen: 16, neck: 1, head: "#17131c" },
    dove:     { body: "#f4f4fa", belly: "#ffffff", wing: "#d4d6e4", beak: "#e8a03a", beakLen: 10 }
  };

  function birdSVG(t) {
    const o = BIRDS[t] || BIRDS.gull;
    const hx = o.neck ? 26 : 40, hy = o.neck ? 18 : 34;
    return `<svg viewBox="0 0 170 110" width="150" class="flourish-bird">
      ${o.legs ? `<line x1="112" y1="66" x2="152" y2="84" stroke="${o.body}" stroke-width="4"/>` : ""}
      ${o.fork
        ? `<polygon points="118,58 158,44 138,60 160,72" fill="${o.tail || o.wing}"/>`
        : `<polygon points="116,52 156,46 150,68 116,66" fill="${o.tail || o.wing}"/>`}
      <ellipse cx="88" cy="58" rx="36" ry="20" fill="${o.body}"/>
      <ellipse cx="94" cy="66" rx="28" ry="13" fill="${o.belly}"/>
      ${o.neck ? `<path d="M62,52 Q40,44 ${hx + 6},${hy + 8}" stroke="${o.body}" stroke-width="9" fill="none"/>` : ""}
      <circle cx="${hx}" cy="${hy}" r="14" fill="${o.head || o.body}"/>
      ${o.crest ? `<polygon points="${hx - 2},${hy - 12} ${hx + 10},${hy - 30} ${hx + 12},${hy - 10}" fill="${o.crest}"/>` : ""}
      <polygon points="${hx - 12},${hy - 4} ${hx - 12 - o.beakLen},${hy + (o.beakDrop || 2)} ${hx - 10},${hy + 7}" fill="${o.beak}"/>
      <circle cx="${hx - 3}" cy="${hy - 4}" r="3" fill="${o.eye || "#fff"}"/>
      <circle cx="${hx - 3}" cy="${hy - 4}" r="1.6" fill="#111"/>
      ${o.collar ? `<path d="M70,44 Q86,36 102,46" stroke="${o.collar}" stroke-width="7" fill="none"/>` : ""}
      <path class="fwing" d="M84,52 Q66,10 34,6 Q60,34 70,56 Z" fill="${o.wing}"/>
      <path class="fwing fwing2" d="M92,56 Q112,20 146,14 Q116,42 104,60 Z" fill="${o.wing}" opacity=".8"/>
    </svg>`;
  }

  /* ================= scene definitions (48 nations) =================
     sky: gradient stops · orb: sun/moon · layers use GEN generators
     fx: ambient effect list · flourish: entry bird */
  const SCENES = {
    /* --- GROUP A --- */
    mex: {
      sky: ["#2b1030 0%", "#8a2b3d 45%", "#f2a444 78%", "#ffd98f 100%"],
      orb: { x: 70, y: 40, r: 58, c: "#ffe9b0", glow: "rgba(255,160,70,.5)" },
      clouds: { n: 3, tint: "#ffc9a0", op: .35 },
      far: [["ridge", { c: "#3d1a33", y: .6, amp: .12, seed: 3 }]],
      mid: [["aztec", { c: "#1d0d1f", x: 760, y: .86, s: 1.1 }], ["hills", { c: "#241026", y: .82, seed: 8 }]],
      near: [["cactus", { c: "#120716", y: .96, seed: 5 }]],
      fx: [["fireflies", { n: 10, c: "#ffcf6a" }], ["flock", { c: "#1d0d1f", n: 4 }]],
      flourish: "eagle", scrim: "rgba(20,6,18,.36)"
    },
    rsa: {
      sky: ["#26123a 0%", "#8a3d2b 40%", "#e88f3d 72%", "#ffce7a 100%"],
      orb: { x: 46, y: 58, r: 70, c: "#ffdf9a", glow: "rgba(255,150,60,.55)" },
      far: [["tablemt", { c: "#3a1c2e", x: 800, y: .68, w: 1100, h: 300 }]],
      mid: [["hills", { c: "#2a1220", y: .78, seed: 4 }], ["acacias", { c: "#160812", y: .8, n: 3 }]],
      near: [["hills", { c: "#12060e", y: .92, amp: .04, seed: 6 }]],
      fx: [["flock", { c: "#1d0c16", n: 7 }], ["sand", { n: 10, c: "#ffcf8a" }]],
      flourish: "eagle", scrim: "rgba(24,8,14,.34)"
    },
    kor: {
      sky: ["#0d0d2e 0%", "#3d1846 55%", "#a03d5c 100%"],
      orb: { x: 26, y: 24, r: 40, c: "#fff3d6", glow: "rgba(255,235,190,.35)", crescent: 1 },
      stars: { density: 60 },
      far: [["ridge", { c: "#1c1136", y: .58, amp: .1, seed: 12 }], ["city", { c: "#241540", y: .74, n: 18, maxH: .22, lit: "#7ce0ff", litP: .8, seed: 22 }]],
      mid: [["pagoda", { c: "#120a20", x: 420, y: .88, s: 1.25 }]],
      near: [["hills", { c: "#0a0516", y: .93, amp: .03, seed: 7 }]],
      fx: [["petals", { n: 20, c: "#ffb7d5" }], ["sparkle", { x: 70, y: 60, n: 8, c: "#7ce0ff", spread: 26 }]],
      flourish: "crane", scrim: "rgba(10,6,22,.34)"
    },
    cze: {
      sky: ["#0c1030 0%", "#28325c 55%", "#8a5a4a 100%"],
      orb: { x: 78, y: 30, r: 34, c: "#f6f2e4", glow: "rgba(240,230,200,.3)", crescent: 1 },
      stars: { density: 45 },
      far: [["hills", { c: "#16204a", y: .6, seed: 9 }]],
      mid: [["castle", { c: "#0d132e", x: 760, y: .72, s: 1.15 }], ["archbridge", { c: "#0a0f26", x: 700, y: .88, w: 720 }]],
      near: [["water", { c1: "#141c40", c2: "#080b1e", y: .88 }]],
      fx: [["mist", { n: 2 }], ["fireflies", { n: 8, c: "#ffd98f" }]],
      flourish: "dove", scrim: "rgba(8,10,26,.34)"
    },

    /* --- GROUP B --- */
    can: {
      sky: ["#0e1e38 0%", "#2b5068 50%", "#d98a54 88%", "#ffc98a 100%"],
      orb: { x: 58, y: 50, r: 46, c: "#ffe9c0", glow: "rgba(255,190,120,.4)" },
      far: [["ridge", { c: "#1a2d48", y: .55, amp: .16, snow: "#dfeaf4", seed: 15 }]],
      mid: [["pines", { c: "#0e1c2a", y: .74, n: 30, hMax: 140 }]],
      near: [["water", { c1: "#22405c", c2: "#0c1826", y: .82 }], ["pines", { c: "#081018", y: .96, n: 12, hMax: 190, seed: 8 }]],
      fx: [["leaves", { n: 20, c: "#d2543a" }], ["flock", { c: "#12100e", n: 4 }]],
      flourish: "goose", scrim: "rgba(8,14,24,.34)"
    },
    bih: {
      sky: ["#101c30 0%", "#2e4a5e 55%", "#c9855c 100%"],
      orb: { x: 34, y: 40, r: 44, c: "#ffe4b0", glow: "rgba(255,190,120,.35)" },
      far: [["ridge", { c: "#1a2c3e", y: .55, amp: .14, seed: 18 }]],
      mid: [["archbridge", { c: "#10141f", x: 800, y: .74, w: 520 }], ["cabins", { c: "#131722", y: .78, n: 6 }]],
      near: [["water", { c1: "#1f4a52", c2: "#0a1a20", y: .84 }]],
      fx: [["mist", { n: 2 }], ["fireflies", { n: 10, c: "#cfe98a" }]],
      flourish: "gull", scrim: "rgba(10,14,24,.34)"
    },
    qat: {
      sky: ["#080a24 0%", "#241442 55%", "#68304e 100%"],
      orb: { x: 24, y: 22, r: 42, c: "#fdf6e0", glow: "rgba(250,240,210,.35)", crescent: 1 },
      stars: { density: 70 },
      far: [["city", { c: "#160f30", y: .72, n: 12, maxH: .34, lit: "#7ce0ff", litP: .9, seed: 27 }]],
      mid: [["dunes", { c: "#241536", hi: "#4a2c5a", y: .8, seed: 11 }]],
      near: [["dunes", { c: "#120a20", y: .92, amp: .05, seed: 13 }]],
      fx: [["sand", { n: 16, c: "#c9a0ff" }]],
      flourish: "falcon", scrim: "rgba(10,7,24,.34)"
    },
    sui: {
      sky: ["#12284a 0%", "#3d6488 55%", "#c9dced 100%"],
      orb: { x: 74, y: 26, r: 44, c: "#fffef4", glow: "rgba(255,255,240,.45)" },
      clouds: { n: 4, tint: "#ffffff", op: .5 },
      far: [["matterhorn", { c: "#22364e", snow: "#e8f0fa", x: 640, y: .74 }], ["ridge", { c: "#2c445c", y: .68, amp: .1, snow: "#d4e2f0", seed: 21 }]],
      mid: [["pines", { c: "#152436", y: .8, n: 22 }], ["cabins", { c: "#10141f", y: .82, n: 4 }]],
      near: [["hills", { c: "#0c1524", y: .93, amp: .03, seed: 17 }]],
      fx: [["snow", { n: 30 }]],
      flourish: "eagle", scrim: "rgba(10,18,30,.3)"
    },

    /* --- GROUP C --- */
    bra: {
      sky: ["#123a20 0%", "#2e7a42 40%", "#e8b84e 78%", "#ffe49a 100%"],
      orb: { x: 68, y: 28, r: 56, c: "#fff3c4", glow: "rgba(255,200,90,.55)" },
      clouds: { n: 3, tint: "#ffe9c0", op: .4 },
      far: [["canopy", { c: "#2e6b40", y: .52, seed: 7, op: .75 }], ["canopy", { c: "#1e5230", y: .6, seed: 11 }]],
      mid: [["canopy", { c: "#1a4a2c", y: .7, seed: 4 }], ["water", { c1: "#3a8a55", c2: "#164028", y: .85 }]],
      near: [["canopy", { c: "#0c2c16", y: .9, seed: 9, bump: 110 }], ["leafframe", { c: "#072012" }]],
      fx: [["fireflies", { n: 18, c: "#d8ff7a" }], ["flock", { c: "#0a1f10", n: 5 }], ["mist", { n: 2, c: "210,255,220" }], ["butterflies", { n: 6, c: "#4dc9ff" }]],
      flourish: "toucan", scrim: "rgba(4,18,10,.26)"
    },
    mar: {
      sky: ["#1c0d30 0%", "#5c2440 50%", "#d97a3d 85%", "#ffbf70 100%"],
      orb: { x: 30, y: 38, r: 60, c: "#ffdf9a", glow: "rgba(255,150,60,.5)" },
      stars: { density: 30 },
      far: [["dunes", { c: "#3a1c33", hi: "#6b3652", y: .62, seed: 23 }]],
      mid: [["mosque", { c: "#1c0d22", x: 900, y: .82, s: 1.05 }], ["dunes", { c: "#28122b", y: .8, seed: 25 }]],
      near: [["palms", { c: "#100618", y: .99, n: 3, size: 320, seed: 10 }]],
      fx: [["sand", { n: 18, c: "#ffca8a" }]],
      flourish: "falcon", scrim: "rgba(20,8,22,.34)"
    },
    hai: {
      sky: ["#0e2440 0%", "#2472a0 55%", "#f2a05c 88%", "#ffd98f 100%"],
      orb: { x: 62, y: 48, r: 54, c: "#fff0c0", glow: "rgba(255,190,110,.45)" },
      clouds: { n: 4, tint: "#ffe4c9", op: .45 },
      far: [["ridge", { c: "#173454", y: .58, amp: .13, seed: 29 }]],
      mid: [["water", { c1: "#1a7a8c", c2: "#0a2c3a", y: .74 }], ["sails", { c: "#0e1c30", y: .8, n: 3 }]],
      near: [["hills", { c: "#0a1626", y: .92, amp: .04, seed: 30 }], ["palms", { c: "#050e1c", y: .99, n: 3, size: 340, seed: 12 }]],
      fx: [["flock", { c: "#e8ecf4", n: 5 }]],
      flourish: "parrot", scrim: "rgba(6,16,30,.32)"
    },
    sco: {
      sky: ["#141830 0%", "#2c3654 55%", "#5c5a74 100%"],
      orb: { x: 24, y: 26, r: 36, c: "#e8ecf4", glow: "rgba(220,230,250,.25)", crescent: 1 },
      clouds: { n: 5, tint: "#9aa4c4", op: .4 },
      far: [["ridge", { c: "#1c2440", y: .55, amp: .12, seed: 33 }], ["hills", { c: "#222c4c", y: .68, seed: 34 }]],
      mid: [["castle", { c: "#0e1226", x: 500, y: .66, s: 1 }], ["hills", { c: "#141a34", y: .8, seed: 35 }]],
      near: [["water", { c1: "#1c2846", c2: "#0a0f20", y: .87 }]],
      fx: [["mist", { n: 3, c: "200,210,240" }], ["flock", { c: "#0c1020", n: 4 }]],
      flourish: "eagle", scrim: "rgba(12,14,28,.36)"
    },

    /* --- GROUP D --- */
    usa: {
      sky: ["#160f36 0%", "#4a1e56 48%", "#c9503d 82%", "#ff9d5c 100%"],
      orb: { x: 78, y: 26, r: 52, c: "#ffdf9a", glow: "rgba(255,150,80,.5)" },
      stars: { density: 40 },
      far: [["city", { c: "#1e1240", y: .76, n: 20, maxH: .28, lit: "#ffd27f", litP: .8, seed: 37 }]],
      mid: [["nycspire", { c: "#120a2a", x: 560, y: .8, s: 1.15 }], ["city", { c: "#160d30", y: .82, n: 14, maxH: .3, lit: "#ffca5f", litP: .9, seed: 38 }]],
      near: [["water", { c1: "#2a1846", c2: "#0e081e", y: .88 }]],
      fx: [["sparkle", { x: 50, y: 70, n: 10, c: "#ffca5f", spread: 40 }]],
      flourish: "eagle", scrim: "rgba(14,8,28,.36)"
    },
    par: {
      sky: ["#122036 0%", "#3d5470 52%", "#e0925c 88%", "#ffce8f 100%"],
      orb: { x: 40, y: 50, r: 52, c: "#ffe9b0", glow: "rgba(255,180,100,.45)" },
      clouds: { n: 3, tint: "#ffd9b0", op: .4 },
      far: [["hills", { c: "#1c2c44", y: .62, seed: 39 }]],
      mid: [["water", { c1: "#3d6478", c2: "#122430", y: .78 }], ["acacias", { c: "#101a2a", y: .74, n: 2, seed: 40 }]],
      near: [["hills", { c: "#0a1220", y: .92, amp: .04, seed: 41 }]],
      fx: [["fireflies", { n: 14, c: "#d8ff7a" }], ["flock", { c: "#0e1626", n: 4 }]],
      flourish: "parrot", scrim: "rgba(8,14,26,.32)"
    },
    aus: {
      sky: ["#1a1034 0%", "#68284a 50%", "#e8703d 85%", "#ffb75c 100%"],
      orb: { x: 30, y: 46, r: 56, c: "#ffdf9a", glow: "rgba(255,140,70,.5)" },
      stars: { density: 35 },
      far: [["city", { c: "#241236", y: .72, n: 10, maxH: .22, lit: "#ffd27f", seed: 43 }]],
      mid: [["harborbridge", { c: "#160a26", x: 500, y: .76, w: 660 }], ["opera", { c: "#f2ede0", x: 1120, y: .76, s: .95 }]],
      near: [["water", { c1: "#4a2440", c2: "#140a1e", y: .8 }]],
      fx: [["flock", { c: "#f4f0e8", n: 4 }]],
      flourish: "cockatoo", scrim: "rgba(16,8,24,.34)"
    },
    tur: {
      sky: ["#141034 0%", "#4a2450 52%", "#c96a4a 85%", "#ffb77a 100%"],
      orb: { x: 68, y: 44, r: 52, c: "#ffe4a0", glow: "rgba(255,160,90,.45)" },
      far: [["hills", { c: "#241638", y: .6, seed: 45 }]],
      mid: [["mosque", { c: "#140a24", x: 700, y: .78, s: 1.25 }]],
      near: [["water", { c1: "#3a2244", c2: "#120a1e", y: .84 }], ["sails", { c: "#0e0818", y: .89, n: 3, seed: 22 }]],
      fx: [["flock", { c: "#e8e0d4", n: 6 }], ["stars", { density: 25 }]],
      flourish: "gull", scrim: "rgba(14,8,24,.34)"
    },

    /* --- GROUP E --- */
    ger: {
      sky: ["#0e1a2e 0%", "#2c4258 55%", "#8a9aa8 100%"],
      orb: { x: 26, y: 30, r: 40, c: "#f6f6ec", glow: "rgba(240,240,230,.3)" },
      clouds: { n: 4, tint: "#c4d0dc", op: .4 },
      far: [["ridge", { c: "#16283c", y: .55, amp: .13, seed: 47 }]],
      mid: [["castle", { c: "#0c1424", x: 880, y: .68, s: 1.2 }], ["pines", { c: "#0e1e2a", y: .8, n: 26 }]],
      near: [["pines", { c: "#081218", y: .95, n: 10, hMax: 180, seed: 30 }]],
      fx: [["mist", { n: 3 }], ["fireflies", { n: 8, c: "#cfe98a" }]],
      flourish: "eagle", scrim: "rgba(8,14,24,.34)"
    },
    cuw: {
      sky: ["#0c2a48 0%", "#1e7ca0 55%", "#ffca7a 100%"],
      orb: { x: 74, y: 50, r: 54, c: "#fff0c0", glow: "rgba(255,200,120,.45)" },
      clouds: { n: 4, tint: "#ffffff", op: .5 },
      far: [["water", { c1: "#1a8ca8", c2: "#0c3a50", y: .62 }]],
      mid: [["city", { c: "#5c2440", y: .78, n: 16, maxH: .12, lit: "#ffe9a0", litP: .9, seed: 51 }], ["sails", { c: "#12283a", y: .68, n: 3, seed: 24 }]],
      near: [["hills", { c: "#0e2438", y: .92, amp: .03, seed: 52 }], ["palms", { c: "#061422", y: .99, n: 3, size: 330, seed: 14 }]],
      fx: [["flock", { c: "#f4f0e8", n: 5 }]],
      flourish: "flamingo", scrim: "rgba(6,18,30,.3)"
    },
    ecu: {
      sky: ["#122c3e 0%", "#2c6470 52%", "#e8b45c 100%"],
      orb: { x: 52, y: 40, r: 50, c: "#fff0c0", glow: "rgba(255,210,130,.4)" },
      clouds: { n: 4, tint: "#e4ecf0", op: .5 },
      far: [["fuji", { c: "#1a3448", snow: "#e8f0f4", x: 900, y: .7, w: 560, h: 380 }]],
      mid: [["canopy", { c: "#123626", y: .72, seed: 53 }], ["ridge", { c: "#0e2c20", y: .78, amp: .06, seed: 54 }]],
      near: [["canopy", { c: "#081e12", y: .9, seed: 55, bump: 100 }]],
      fx: [["butterflies", { n: 8, c: "#4dc9ff" }], ["mist", { n: 2 }], ["fireflies", { n: 10, c: "#d8ff7a" }]],
      flourish: "condor", scrim: "rgba(6,16,16,.32)"
    },
    civ: {
      sky: ["#1a1430 0%", "#7a3d30 52%", "#e89a3d 85%", "#ffd27a 100%"],
      orb: { x: 44, y: 38, r: 62, c: "#ffe4a0", glow: "rgba(255,160,70,.5)" },
      far: [["hills", { c: "#2c1626", y: .64, seed: 57 }]],
      mid: [["baobabs", { c: "#180a1a", y: .78, n: 2, seed: 58 }], ["canopy", { c: "#20102a", y: .8, seed: 59, bump: 70 }]],
      near: [["hills", { c: "#0e0616", y: .93, amp: .04, seed: 60 }]],
      fx: [["flock", { c: "#160a18", n: 6 }], ["fireflies", { n: 10, c: "#ffcf6a" }]],
      flourish: "parrot", scrim: "rgba(16,8,20,.34)"
    },

    /* --- GROUP F --- */
    ned: {
      sky: ["#182448 0%", "#4a5480 52%", "#e8944a 85%", "#ffc987 100%"],
      orb: { x: 36, y: 48, r: 54, c: "#ffe9b0", glow: "rgba(255,180,100,.45)" },
      clouds: { n: 6, tint: "#e8d9c4", op: .5 },
      far: [["hills", { c: "#1c2440", y: .72, amp: .02, seed: 61 }]],
      mid: [["windmill", { c: "#10142a", x: 1150, y: .78, s: 1.05 }], ["windmill", { c: "#141a34", x: 380, y: .76, s: .75 }]],
      near: [["water", { c1: "#26304e", c2: "#0e1224", y: .86 }], ["hills", { c: "#0a0e20", y: .95, amp: .015, seed: 62 }]],
      fx: [["petals", { n: 14, c: "#ff8f4a" }]],
      flourish: "gull", scrim: "rgba(10,12,26,.32)"
    },
    jpn: {
      sky: ["#1c1038 0%", "#5c2c56 50%", "#e87a6b 85%", "#ffc4a0 100%"],
      orb: { x: 50, y: 42, r: 58, c: "#ffe4c4", glow: "rgba(255,160,120,.45)" },
      far: [["fuji", { c: "#241a44", snow: "#f4eefa", x: 800, y: .76, w: 640, h: 420 }]],
      mid: [["canopy", { c: "#1c1234", y: .8, seed: 63, bump: 60 }], ["pagoda", { c: "#100a22", x: 1220, y: .88, s: 1 }]],
      near: [["torii", { c: "#2a0e1e", x: 300, y: .94, s: 1.1 }], ["hills", { c: "#0c0618", y: .95, amp: .02, seed: 64 }]],
      fx: [["petals", { n: 26, c: "#ffb7d5" }]],
      flourish: "crane", scrim: "rgba(14,8,24,.32)"
    },
    swe: {
      sky: ["#060d24 0%", "#0e2440 55%", "#1c4258 100%"],
      orb: { x: 70, y: 20, r: 36, c: "#f4f6e8", glow: "rgba(240,250,230,.3)", crescent: 1 },
      stars: { density: 80 },
      far: [["ridge", { c: "#0c1c30", y: .6, amp: .08, seed: 65, snow: "#b8d4e0" }]],
      mid: [["pines", { c: "#081624", y: .78, n: 28 }], ["cabins", { c: "#0e0a14", y: .8, n: 5, lit: "#ffb45f", seed: 33 }]],
      near: [["hills", { c: "#040c16", y: .93, amp: .03, seed: 66 }]],
      fx: [["aurora", { c1: "#3bf0a4", c2: "#5a9cf8" }], ["snow", { n: 26 }]],
      flourish: "gull", scrim: "rgba(4,10,20,.3)"
    },
    tun: {
      sky: ["#101c40 0%", "#2c5474 55%", "#e8a45c 100%"],
      orb: { x: 30, y: 40, r: 48, c: "#fff0c0", glow: "rgba(255,210,130,.4)" },
      far: [["water", { c1: "#1a6a8c", c2: "#0c3048", y: .6 }]],
      mid: [["city", { c: "#e8ecf0", y: .74, n: 14, maxH: .1, lit: "#4a90d0", litP: .7, seed: 67 }], ["mosque", { c: "#c9d4dc", x: 400, y: .74, s: .7, lit: "#4a90d0" }]],
      near: [["hills", { c: "#12283c", y: .9, amp: .04, seed: 68 }], ["palms", { c: "#081824", y: .99, n: 2, size: 300, seed: 16 }]],
      fx: [["flock", { c: "#f4f0e8", n: 5 }], ["stars", { density: 20 }]],
      flourish: "falcon", scrim: "rgba(8,16,28,.32)"
    },

    /* --- GROUP G --- */
    bel: {
      sky: ["#12142e 0%", "#33305c 55%", "#a4685c 100%"],
      orb: { x: 76, y: 28, r: 36, c: "#f4f0e0", glow: "rgba(240,230,200,.3)", crescent: 1 },
      stars: { density: 35 },
      far: [["hills", { c: "#181c38", y: .66, seed: 69 }]],
      mid: [["castle", { c: "#0e1024", x: 700, y: .74, s: 1.05 }], ["city", { c: "#12142c", y: .8, n: 16, maxH: .14, lit: "#ffd98f", seed: 70 }]],
      near: [["hills", { c: "#080a1a", y: .94, amp: .02, seed: 71 }]],
      fx: [["mist", { n: 2 }], ["fireflies", { n: 8, c: "#ffd98f" }]],
      flourish: "gull", scrim: "rgba(10,10,24,.34)"
    },
    egy: {
      sky: ["#1a0e2e 0%", "#6b2c3d 48%", "#e8933d 82%", "#ffcf7a 100%"],
      orb: { x: 34, y: 36, r: 64, c: "#ffe4a0", glow: "rgba(255,150,60,.55)" },
      stars: { density: 25 },
      far: [["dunes", { c: "#3d1e33", hi: "#6b3652", y: .64, seed: 72 }]],
      mid: [["pyramids", { c: "#200e26", hi: "#4a2440", y: .8 }]],
      near: [["water", { c1: "#2c4a4a", c2: "#101e22", y: .88 }], ["palms", { c: "#0c0616", y: .99, n: 2, size: 300, seed: 18 }]],
      fx: [["sand", { n: 16, c: "#ffca8a" }]],
      flourish: "falcon", scrim: "rgba(18,8,22,.34)"
    },
    irn: {
      sky: ["#100c2e 0%", "#3a2054 55%", "#8a4a5c 100%"],
      orb: { x: 22, y: 24, r: 38, c: "#f6f2e0", glow: "rgba(240,230,200,.3)", crescent: 1 },
      stars: { density: 55 },
      far: [["fuji", { c: "#1c1440", snow: "#d4dcf0", x: 1150, y: .68, w: 480, h: 340 }], ["ridge", { c: "#241848", y: .66, amp: .08, seed: 73 }]],
      mid: [["mosque", { c: "#140c2c", x: 560, y: .8, s: 1.15, lit: "#5ce0d8" }]],
      near: [["hills", { c: "#0a0620", y: .93, amp: .03, seed: 74 }]],
      fx: [["sand", { n: 10, c: "#c9a0ff" }], ["sparkle", { x: 35, y: 62, n: 8, c: "#5ce0d8", spread: 14 }]],
      flourish: "falcon", scrim: "rgba(10,6,22,.34)"
    },
    nzl: {
      sky: ["#0e2030 0%", "#2c5464 55%", "#a4c4b8 100%"],
      orb: { x: 66, y: 32, r: 42, c: "#fffef0", glow: "rgba(255,255,240,.35)" },
      clouds: { n: 5, tint: "#e4f0ec", op: .5 },
      far: [["fjordcliffs", { cL: "#16303c", cR: "#122834" }]],
      mid: [["ridge", { c: "#0e2028", y: .66, amp: .12, snow: "#d4e8e0", seed: 75 }]],
      near: [["water", { c1: "#1c4a50", c2: "#0a1e24", y: .78 }], ["canopy", { c: "#061812", y: .94, seed: 76, bump: 70 }]],
      fx: [["mist", { n: 3, c: "220,240,235" }], ["flock", { c: "#f0f4f0", n: 4 }]],
      flourish: "gull", scrim: "rgba(6,16,20,.3)"
    },

    /* --- GROUP H --- */
    esp: {
      sky: ["#1c0e2e 0%", "#6b2438 50%", "#e8823d 85%", "#ffc46b 100%"],
      orb: { x: 66, y: 36, r: 58, c: "#ffe0a0", glow: "rgba(255,140,60,.5)" },
      far: [["ridge", { c: "#301630", y: .6, amp: .1, seed: 77 }]],
      mid: [["castle", { c: "#180a20", x: 620, y: .7, s: 1.1 }], ["pines", { c: "#1c0c22", y: .78, n: 14, hMax: 150, seed: 36 }]],
      near: [["hills", { c: "#0e0616", y: .93, amp: .03, seed: 78 }]],
      fx: [["fireflies", { n: 12, c: "#ffcf6a" }], ["flock", { c: "#160a18", n: 4 }]],
      flourish: "swallow", scrim: "rgba(16,7,20,.34)"
    },
    cpv: {
      sky: ["#0e2444 0%", "#1e6a94 55%", "#ffc27a 100%"],
      orb: { x: 28, y: 48, r: 54, c: "#fff0c0", glow: "rgba(255,200,110,.45)" },
      clouds: { n: 4, tint: "#ffffff", op: .45 },
      far: [["fuji", { c: "#143048", snow: null, x: 1100, y: .66, w: 520, h: 320 }]],
      mid: [["water", { c1: "#1a7a94", c2: "#0c3448", y: .72 }], ["sails", { c: "#0e2234", y: .78, n: 3, seed: 26 }]],
      near: [["hills", { c: "#0a1e30", y: .92, amp: .03, seed: 79 }], ["palms", { c: "#04121e", y: .99, n: 3, size: 320, seed: 20 }]],
      fx: [["flock", { c: "#f4f0e8", n: 5 }]],
      flourish: "gull", scrim: "rgba(6,16,28,.3)"
    },
    ksa: {
      sky: ["#0c0a26 0%", "#2c1440 55%", "#7a3648 100%"],
      orb: { x: 74, y: 22, r: 44, c: "#fdf6e0", glow: "rgba(250,240,210,.35)", crescent: 1 },
      stars: { density: 75 },
      far: [["city", { c: "#160e2e", y: .68, n: 8, maxH: .26, lit: "#7ce0ff", litP: .8, seed: 80 }]],
      mid: [["dunes", { c: "#241332", hi: "#4a2648", y: .78, seed: 81 }]],
      near: [["dunes", { c: "#100820", y: .92, amp: .06, seed: 82 }], ["palms", { c: "#0a0518", y: .99, n: 2, size: 280, seed: 28 }]],
      fx: [["sand", { n: 18, c: "#e8b48a" }]],
      flourish: "falcon", scrim: "rgba(10,6,22,.34)"
    },
    uru: {
      sky: ["#101c38 0%", "#345070 52%", "#e09a5c 88%", "#ffd08f 100%"],
      orb: { x: 46, y: 50, r: 52, c: "#ffe9b0", glow: "rgba(255,180,100,.45)" },
      clouds: { n: 3, tint: "#ffd9b0", op: .4 },
      far: [["hills", { c: "#1a2844", y: .68, amp: .03, seed: 83 }]],
      mid: [["water", { c1: "#2c5468", c2: "#101f2c", y: .76 }], ["lighthouse", { c: "#141c30", x: 1180, y: .78, s: 1 }]],
      near: [["hills", { c: "#0a1222", y: .93, amp: .02, seed: 84 }], ["palms", { c: "#060e1a", y: .99, n: 2, size: 280, seed: 32 }]],
      fx: [["flock", { c: "#e8ecf4", n: 5 }]],
      flourish: "gull", scrim: "rgba(8,12,24,.32)"
    },

    /* --- GROUP I --- */
    fra: {
      sky: ["#0e1236 0%", "#2c2c5e 50%", "#8a4a6b 85%", "#d98a7a 100%"],
      orb: { x: 26, y: 30, r: 38, c: "#f6f2e4", glow: "rgba(240,230,210,.3)", crescent: 1 },
      stars: { density: 50 },
      far: [["city", { c: "#181438", y: .78, n: 22, maxH: .12, lit: "#ffd98f", litP: .6, seed: 85 }]],
      mid: [["eiffel", { c: "#0e0a26", x: 820, y: .88, s: 1.15 }]],
      near: [["water", { c1: "#22204a", c2: "#0c0a20", y: .9 }]],
      fx: [["sparkle", { x: 51, y: 42, n: 16, c: "#ffe9a0", spread: 8 }], ["mist", { n: 2, c: "200,200,240" }]],
      flourish: "dove", scrim: "rgba(10,8,26,.34)"
    },
    sen: {
      sky: ["#241030 0%", "#8a3648 48%", "#e88a3d 82%", "#ffce7a 100%"],
      orb: { x: 58, y: 40, r: 66, c: "#ffdf9a", glow: "rgba(255,150,60,.55)" },
      far: [["hills", { c: "#33162e", y: .66, amp: .03, seed: 87 }]],
      mid: [["baobabs", { c: "#1c0a1e", y: .76, n: 3, seed: 88 }]],
      near: [["hills", { c: "#100616", y: .92, amp: .03, seed: 89 }]],
      fx: [["flock", { c: "#180a18", n: 7 }], ["sand", { n: 10, c: "#ff9a8a" }]],
      flourish: "eagle", scrim: "rgba(18,8,20,.34)"
    },
    irq: {
      sky: ["#160e2c 0%", "#4a2440 52%", "#c9763d 85%", "#ffbf70 100%"],
      orb: { x: 70, y: 36, r: 56, c: "#ffdf9a", glow: "rgba(255,150,60,.5)" },
      stars: { density: 30 },
      far: [["dunes", { c: "#2e1630", y: .66, seed: 90 }]],
      mid: [["mosque", { c: "#180c22", x: 640, y: .8, s: 1.1 }]],
      near: [["water", { c1: "#2c4444", c2: "#101e20", y: .88 }], ["palms", { c: "#0c0616", y: .99, n: 3, size: 300, seed: 34 }]],
      fx: [["sand", { n: 14, c: "#ffca8a" }]],
      flourish: "falcon", scrim: "rgba(16,8,22,.34)"
    },
    nor: {
      sky: ["#040a1e 0%", "#0c2038 55%", "#16405c 100%"],
      orb: { x: 30, y: 18, r: 38, c: "#f4f6e8", glow: "rgba(240,250,230,.3)", crescent: 1 },
      stars: { density: 90 },
      far: [["fjordcliffs", { cL: "#0c1e30", cR: "#0a1a2a" }]],
      mid: [["ridge", { c: "#081624", y: .62, amp: .1, snow: "#a8ccdc", seed: 91 }], ["cabins", { c: "#0c0a12", y: .74, n: 4, lit: "#ffb45f", seed: 37 }]],
      near: [["water", { c1: "#0e3040", c2: "#040e16", y: .8 }]],
      fx: [["aurora", { c1: "#3bf0a4", c2: "#7a5af8" }], ["snow", { n: 20 }]],
      flourish: "gull", scrim: "rgba(3,8,16,.3)"
    },

    /* --- GROUP J --- */
    arg: {
      sky: ["#0e1638 0%", "#2c4468 52%", "#d9925c 88%", "#ffd08f 100%"],
      orb: { x: 54, y: 46, r: 54, c: "#ffe9b0", glow: "rgba(255,190,110,.45)" },
      clouds: { n: 3, tint: "#c9d4e8", op: .35 },
      far: [["city", { c: "#141a3a", y: .76, n: 18, maxH: .2, lit: "#ffd98f", litP: .7, seed: 93 }]],
      mid: [["obelisk", { c: "#0c1028", x: 800, y: .84, s: 1.1 }], ["city", { c: "#101430", y: .84, n: 12, maxH: .14, lit: "#ffca5f", seed: 94 }]],
      near: [["hills", { c: "#080a1c", y: .95, amp: .015, seed: 95 }]],
      fx: [["sparkle", { x: 50, y: 55, n: 8, c: "#9ecfff", spread: 20 }]],
      flourish: "condor", scrim: "rgba(8,10,24,.34)"
    },
    alg: {
      sky: ["#180e2c 0%", "#5c2840 50%", "#d9823d 85%", "#ffc470 100%"],
      orb: { x: 36, y: 36, r: 58, c: "#ffdf9a", glow: "rgba(255,150,60,.5)" },
      stars: { density: 25 },
      far: [["dunes", { c: "#361a33", hi: "#5e3050", y: .62, seed: 96 }]],
      mid: [["mosque", { c: "#1c0c20", x: 860, y: .8, s: 1 }], ["dunes", { c: "#26122a", y: .8, seed: 97 }]],
      near: [["dunes", { c: "#120818", y: .93, amp: .05, seed: 98 }]],
      fx: [["sand", { n: 16, c: "#ffca8a" }]],
      flourish: "falcon", scrim: "rgba(18,8,22,.34)"
    },
    aut: {
      sky: ["#122442 0%", "#3a5c80 55%", "#d4b8c4 100%"],
      orb: { x: 70, y: 28, r: 42, c: "#fffef4", glow: "rgba(255,255,240,.4)" },
      clouds: { n: 4, tint: "#ffffff", op: .5 },
      far: [["ridge", { c: "#1e3450", y: .6, amp: .16, snow: "#e4ecf8", seed: 99 }]],
      mid: [["pines", { c: "#122436", y: .78, n: 24 }], ["castle", { c: "#0e1626", x: 400, y: .74, s: .8 }]],
      near: [["hills", { c: "#0a1420", y: .93, amp: .03, seed: 100 }]],
      fx: [["snow", { n: 24 }]],
      flourish: "eagle", scrim: "rgba(8,14,26,.3)"
    },
    jor: {
      sky: ["#1c0c22 0%", "#5c2436 52%", "#c96a4a 88%", "#ff9d6b 100%"],
      orb: { x: 50, y: 20, r: 46, c: "#ffe4c0", glow: "rgba(255,170,110,.4)" },
      stars: { density: 40 },
      far: [], mid: [["petra", { rock: "#2c0f1c", facade: "#7a3644", glow: "#ffb26b" }]],
      near: [["dunes", { c: "#160816", y: .94, amp: .04, seed: 101 }]],
      fx: [["sand", { n: 14, c: "#ffb28a" }], ["fireflies", { n: 8, c: "#ffcf9a" }]],
      flourish: "falcon", scrim: "rgba(16,6,16,.32)"
    },

    /* --- GROUP K --- */
    por: {
      sky: ["#101a3a 0%", "#345074 52%", "#e89a5c 88%", "#ffcf8f 100%"],
      orb: { x: 32, y: 48, r: 54, c: "#ffe9b0", glow: "rgba(255,180,100,.45)" },
      clouds: { n: 3, tint: "#ffd9b0", op: .4 },
      far: [["hills", { c: "#1c2444", y: .62, seed: 103 }]],
      mid: [["city", { c: "#241428", y: .74, n: 18, maxH: .12, lit: "#ffca5f", seed: 104 }], ["castle", { c: "#141026", x: 1150, y: .76, s: .85 }]],
      near: [["water", { c1: "#2c4a64", c2: "#101c2c", y: .82 }], ["sails", { c: "#0a1424", y: .88, n: 3, seed: 38 }]],
      fx: [["flock", { c: "#e8ecf4", n: 6 }]],
      flourish: "gull", scrim: "rgba(8,12,26,.32)"
    },
    cod: {
      sky: ["#0a1c14 0%", "#164030 48%", "#8a5c2c 100%"],
      orb: { x: 76, y: 44, r: 48, c: "#ffedb0", glow: "rgba(255,180,80,.4)" },
      far: [["fuji", { c: "#142c22", snow: null, x: 1200, y: .62, w: 480, h: 300 }], ["canopy", { c: "#123222", y: .58, seed: 105 }]],
      mid: [["canopy", { c: "#0c2618", y: .7, seed: 106 }], ["water", { c1: "#26543c", c2: "#0e2418", y: .84 }]],
      near: [["canopy", { c: "#061a0e", y: .92, seed: 107, bump: 100 }], ["leafframe", { c: "#03120a" }]],
      fx: [["fireflies", { n: 16, c: "#d8ff7a" }], ["mist", { n: 2, c: "200,240,210" }], ["flock", { c: "#0a1c10", n: 4 }]],
      flourish: "parrot", scrim: "rgba(4,16,10,.36)"
    },
    uzb: {
      sky: ["#140e30 0%", "#3a2450 55%", "#c9825c 100%"],
      orb: { x: 26, y: 26, r: 40, c: "#f6f2e0", glow: "rgba(240,230,200,.3)", crescent: 1 },
      stars: { density: 60 },
      far: [["dunes", { c: "#241640", y: .66, seed: 108 }]],
      mid: [["mosque", { c: "#160e2c", x: 500, y: .8, s: 1, lit: "#5ce0d8" }], ["mosque", { c: "#1a1032", x: 1100, y: .8, s: .85, lit: "#5ce0d8" }]],
      near: [["dunes", { c: "#0e081e", y: .93, amp: .04, seed: 109 }]],
      fx: [["sand", { n: 12, c: "#c9a0ff" }], ["sparkle", { x: 31, y: 62, n: 6, c: "#5ce0d8", spread: 12 }]],
      flourish: "falcon", scrim: "rgba(10,6,22,.34)"
    },
    col: {
      sky: ["#0e2c22 0%", "#1e5c46 48%", "#e8b45c 100%"],
      orb: { x: 60, y: 42, r: 52, c: "#fff0c0", glow: "rgba(255,210,130,.4)" },
      clouds: { n: 3, tint: "#d4ecd8", op: .45 },
      far: [["ridge", { c: "#14382c", y: .58, amp: .12, seed: 110 }]],
      mid: [["hills", { c: "#0e2c20", y: .74, seed: 111 }], ["waxpalms", { c: "#081e12", y: .86, n: 6, seed: 112 }]],
      near: [["canopy", { c: "#04160c", y: .94, seed: 113, bump: 80 }]],
      fx: [["butterflies", { n: 10, c: "#ffe14d" }], ["mist", { n: 2, c: "210,240,220" }], ["fireflies", { n: 10, c: "#d8ff7a" }]],
      flourish: "condor", scrim: "rgba(4,16,10,.32)"
    },

    /* --- GROUP L --- */
    eng: {
      sky: ["#10142e 0%", "#2c3054 55%", "#8a5c64 100%"],
      orb: { x: 20, y: 26, r: 36, c: "#f0f0e4", glow: "rgba(240,240,220,.28)", crescent: 1 },
      clouds: { n: 5, tint: "#a4aac4", op: .4 },
      far: [["city", { c: "#161230", y: .78, n: 20, maxH: .12, lit: "#ffd98f", litP: .6, seed: 114 }]],
      mid: [["bigben", { c: "#0e0a22", x: 900, y: .84, s: 1.05 }], ["londoneye", { c: "#141030", x: 340, y: .84, r: 120 }]],
      near: [["water", { c1: "#1e2240", c2: "#0a0c1c", y: .88 }]],
      fx: [["mist", { n: 3, c: "190,200,230" }], ["flock", { c: "#0c1020", n: 5 }]],
      flourish: "gull", scrim: "rgba(10,10,24,.36)"
    },
    cro: {
      sky: ["#141034 0%", "#5c2c4a 50%", "#e8824a 85%", "#ffc077 100%"],
      orb: { x: 64, y: 46, r: 54, c: "#ffe4a0", glow: "rgba(255,160,90,.45)" },
      far: [["hills", { c: "#241634", y: .6, seed: 115 }]],
      mid: [["castle", { c: "#180c24", x: 560, y: .72, s: 1 }], ["city", { c: "#1e1028", y: .76, n: 14, maxH: .1, lit: "#ffca5f", seed: 116 }]],
      near: [["water", { c1: "#2c3a58", c2: "#101426", y: .82 }], ["sails", { c: "#0a0e1e", y: .88, n: 3, seed: 40 }]],
      fx: [["flock", { c: "#e8e0d4", n: 5 }], ["stars", { density: 20 }]],
      flourish: "gull", scrim: "rgba(14,8,22,.32)"
    },
    gha: {
      sky: ["#1c1230 0%", "#7a3d33 50%", "#e8a03d 85%", "#ffd67a 100%"],
      orb: { x: 40, y: 36, r: 60, c: "#ffe4a0", glow: "rgba(255,170,70,.5)" },
      far: [["hills", { c: "#2c1828", y: .64, seed: 117 }]],
      mid: [["water", { c1: "#8a5c3c", c2: "#33200f", y: .78 }], ["sails", { c: "#160c14", y: .84, n: 4, seed: 42 }], ["baobabs", { c: "#1a0c18", y: .74, n: 1, seed: 118 }]],
      near: [["hills", { c: "#0e0612", y: .93, amp: .03, seed: 119 }], ["palms", { c: "#0a0410", y: .99, n: 3, size: 320, seed: 44 }]],
      fx: [["flock", { c: "#160c14", n: 6 }]],
      flourish: "eagle", scrim: "rgba(16,8,18,.34)"
    },
    pan: {
      sky: ["#0e1e38 0%", "#245470 52%", "#e8945c 88%", "#ffca87 100%"],
      orb: { x: 70, y: 48, r: 52, c: "#fff0c0", glow: "rgba(255,190,110,.45)" },
      clouds: { n: 4, tint: "#ffe4c9", op: .45 },
      far: [["city", { c: "#142440", y: .72, n: 12, maxH: .24, lit: "#7ce0ff", litP: .7, seed: 120 }]],
      mid: [["water", { c1: "#1a6478", c2: "#0c2c38", y: .78 }], ["sails", { c: "#0e1c2c", y: .84, n: 2, seed: 46 }]],
      near: [["canopy", { c: "#06201a", y: .9, seed: 121, bump: 90 }], ["leafframe", { c: "#04140e" }]],
      fx: [["fireflies", { n: 12, c: "#d8ff7a" }], ["flock", { c: "#0a1c14", n: 4 }]],
      flourish: "toucan", scrim: "rgba(5,16,18,.34)"
    }
  };

  /* ================= builder ================= */
  function svgLayer(cls, items) {
    if (!items || !items.length) return "";
    const inner = items.map(([type, opts]) => (GEN[type] ? GEN[type](opts || {}) : "")).join("");
    return `<svg class="sc-svg ${cls}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${inner}</svg>`;
  }

  function genericScene(id) {
    const t = (typeof TEAMS !== "undefined" && TEAMS[id]) || { bg: { g1: "#101030", g2: "#303060" } };
    return {
      sky: [`${t.bg.g1} 0%`, `${t.bg.g2} 100%`],
      far: [["ridge", { c: "rgba(0,0,0,.35)", y: .6, seed: 5 }]],
      mid: [["hills", { c: "rgba(0,0,0,.45)", y: .78, seed: 6 }]],
      near: [], fx: [["flock", { c: "rgba(0,0,0,.6)", n: 4 }]],
      flourish: "gull", scrim: "rgba(0,0,10,.3)"
    };
  }

  function build(id, host) {
    const sc = SCENES[id] || genericScene(id);
    host.className = "country-bg scene";
    let orb = "";
    if (sc.orb) {
      const o = sc.orb;
      orb = `<div class="sc-orb${o.crescent ? " crescent" : ""}" style="left:${o.x}%;top:${o.y}%;width:${o.r * 2}px;height:${o.r * 2}px;
        background:radial-gradient(circle at 42% 40%, ${o.c}, ${o.c} 60%, transparent 72%);
        box-shadow:0 0 ${o.r * 1.6}px ${o.r * .7}px ${o.glow};"></div>`;
    }
    host.innerHTML = `<div class="sc-zoom">
      <div class="sc-sky" style="background:linear-gradient(180deg, ${sc.sky.join(", ")})"></div>
      <div class="sc-fx sc-fx-back"></div>${orb}
      ${svgLayer("sc-far", sc.far)}${svgLayer("sc-mid", sc.mid)}${svgLayer("sc-near", sc.near)}
      <div class="sc-fx sc-fx-front"></div>
      <div class="sc-scrim" style="background:${sc.scrim || "rgba(0,0,10,.3)"}"></div>
    </div>`;
    const back = host.querySelector(".sc-fx-back"), front = host.querySelector(".sc-fx-front");
    if (sc.stars) FX.stars(back, sc.stars);
    if (sc.clouds) FX.clouds(back, sc.clouds);
    (sc.fx || []).forEach(([name, opts]) => { if (FX[name]) FX[name](name === "flock" || name === "mist" ? back : front, opts || {}); });
    return sc;
  }

  function flourish(host, type) {
    const el = document.createElement("div");
    el.className = "flourish";
    el.innerHTML = birdSVG(type || "gull");
    host.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
    return el;
  }

  return { build, flourish, has: id => !!SCENES[id] };
})();
window.CountryScenes = CountryScenes;
