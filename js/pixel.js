/* ============================================================
   pixel.js — retro rendering engine
   1) Rotating pixel-art globe (orthographic projection of a
      coarse land grid) with clickable team markers
   2) Procedural pixel player sprites wearing each team's kit
   ============================================================ */

/* ---------- coarse world land map (72 x 36, 5° cells) ----------
   Each entry: row -> list of [colStart, colEnd] inclusive land runs.
   row 0 = lat 90..85N, col 0 = lon -180..-175. Retro-blobby on purpose. */
const LAND_RUNS = {
  1:  [[15,21],[24,28]],
  2:  [[13,21],[23,31],[39,40],[54,55]],
  3:  [[11,21],[23,32],[41,42],[46,64]],
  4:  [[2,20],[24,30],[32,32],[39,67]],
  5:  [[2,21],[26,28],[32,33],[38,69]],
  6:  [[3,6],[9,16],[19,21],[34,35],[39,69]],
  7:  [[9,21],[33,64]],
  8:  [[12,21],[35,64]],
  9:  [[11,21],[34,36],[38,41],[42,65]],
  10: [[11,20],[34,35],[42,63],[64,66]],
  11: [[12,19],[33,61],[62,63]],
  12: [[13,16],[18,19],[33,43],[44,47],[50,61]],
  13: [[12,15],[17,19],[33,43],[44,48],[50,54],[55,60]],
  14: [[14,17],[19,20],[32,44],[45,46],[51,53],[56,59],[60,61]],
  15: [[15,17],[32,47],[51,52],[56,61]],
  16: [[16,21],[34,46],[52,52],[56,61]],
  17: [[17,25],[36,46],[55,61],[63,66]],
  18: [[16,27],[40,46],[56,62],[63,67]],
  19: [[16,27],[39,46],[57,60],[63,67]],
  20: [[16,26],[39,46],[47,47],[62,65]],
  21: [[17,25],[39,45],[46,47],[61,67]],
  22: [[17,26],[39,44],[47,47],[60,67]],
  23: [[18,23],[39,44],[60,67]],
  24: [[18,24],[39,42],[60,66]],
  25: [[18,22],[64,66],[70,70]],
  26: [[17,21],[65,65],[69,70]],
  27: [[17,20],[68,69]],
  28: [[18,19]],
  33: [[4,68]],
  34: [[0,71]],
  35: [[0,71]]
};

const MAP_W = 72, MAP_H = 36;
const LAND = (() => {
  const g = new Uint8Array(MAP_W * MAP_H);
  for (const [row, runs] of Object.entries(LAND_RUNS)) {
    const r = +row;
    for (const [c1, c2] of runs)
      for (let c = c1; c <= c2; c++) g[r * MAP_W + c] = 1;
  }
  return g;
})();

function isLand(latDeg, lonDeg) {
  let lon = lonDeg;
  while (lon < -180) lon += 360;
  while (lon >= 180) lon -= 360;
  const c = Math.min(MAP_W - 1, Math.max(0, Math.floor((lon + 180) / 5)));
  const r = Math.min(MAP_H - 1, Math.max(0, Math.floor((90 - latDeg) / 5)));
  return LAND[r * MAP_W + c] === 1;
}

/* ============================ GLOBE ============================ */
class Globe {
  constructor(canvas, teams, onPick, onHover) {
    this.cv = canvas;
    this.ctx = canvas.getContext("2d");
    this.teams = teams;              // {id: {lat, lon, ...}}
    this.onPick = onPick;
    this.onHover = onHover;
    this.rot = 0;                    // center longitude, degrees
    this.tilt = 12 * Math.PI / 180;  // slight north tilt
    this.spinning = true;
    this.speed = 0.22;               // deg per frame
    this.markers = [];               // computed each frame

    // drag state
    this.dragging = false;
    this.dragMoved = false;
    this.lastX = 0; this.lastY = 0;
    this.wasSpinning = true;

    // low-res offscreen buffer for the chunky look
    this.N = 96;
    this.buf = document.createElement("canvas");
    this.buf.width = this.buf.height = this.N;
    this.bctx = this.buf.getContext("2d");
    this.img = this.bctx.createImageData(this.N, this.N);
    this.ctx.imageSmoothingEnabled = false;

    // pointer drag-to-spin (mouse + touch)
    canvas.addEventListener("mousedown", e => this.dragStart(e.clientX, e.clientY));
    window.addEventListener("mousemove", e => this.dragMove(e.clientX, e.clientY, e));
    window.addEventListener("mouseup", e => this.dragEnd(e));
    canvas.addEventListener("mousemove", e => { if (!this.dragging) this.hover(e); });
    canvas.addEventListener("click", e => this.click(e));
    canvas.addEventListener("mouseleave", () => this.onHover(null));
    canvas.addEventListener("touchstart", e => { const t = e.touches[0]; this.dragStart(t.clientX, t.clientY); }, { passive: true });
    canvas.addEventListener("touchmove", e => { const t = e.touches[0]; this.dragMove(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
    canvas.addEventListener("touchend", () => this.dragEnd());
    requestAnimationFrame(() => this.frame());
  }

  dragStart(x, y) {
    this.dragging = true;
    this.dragMoved = false;
    this.lastX = x; this.lastY = y;
    this.wasSpinning = this.spinning;
    this.spinning = false;
    this.cv.style.cursor = "grabbing";
  }
  dragMove(x, y) {
    if (!this.dragging) return;
    const dx = x - this.lastX, dy = y - this.lastY;
    if (Math.abs(dx) + Math.abs(dy) > 3) this.dragMoved = true;
    this.rot -= dx * 0.4;                                  // horizontal spin
    this.tilt = Math.max(-1.2, Math.min(1.2, this.tilt + dy * 0.006)); // vertical tilt
    this.lastX = x; this.lastY = y;
    this.onHover(null);
  }
  dragEnd() {
    if (!this.dragging) return;
    this.dragging = false;
    this.spinning = this.wasSpinning;                     // resume prior spin state
    this.cv.style.cursor = "grab";
  }

  frame() {
    if (this.spinning) this.rot += this.speed;
    this.render();
    requestAnimationFrame(() => this.frame());
  }

  render() {
    const N = this.N, d = this.img.data;
    const cx = N / 2, cy = N / 2, R = N / 2 - 3;
    const lam0 = this.rot * Math.PI / 180;
    const sinT = Math.sin(this.tilt), cosT = Math.cos(this.tilt);
    let i = 0;
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++, i += 4) {
        const dx = (x - cx) / R, dy = (cy - y) / R;
        const rho2 = dx * dx + dy * dy;
        if (rho2 > 1) {                    // space
          const tw = ((x * 7 + y * 13) % 97 === 0);
          d[i] = tw ? 90 : 4; d[i+1] = tw ? 90 : 4; d[i+2] = tw ? 120 : 12; d[i+3] = 255;
          continue;
        }
        const z = Math.sqrt(1 - rho2);
        // inverse orthographic (centered lat = tilt)
        const lat = Math.asin(z * sinT + dy * cosT);
        const lon = lam0 + Math.atan2(dx, z * cosT - dy * sinT);
        const land = isLand(lat * 180 / Math.PI, lon * 180 / Math.PI);
        // limb shading + 2-tone dither
        const shade = z > 0.45 ? 0 : 1;
        const dith = (x + y) % 2 === 0;
        let r, g, b;
        if (land) {
          if (shade) { r = 24; g = 94;  b = 44; }
          else       { r = dith ? 46 : 58; g = dith ? 160 : 190; b = dith ? 70 : 92; }
        } else {
          if (shade) { r = 8;  g = 24;  b = 66; }
          else       { r = dith ? 18 : 24; g = dith ? 60 : 80; b = dith ? 130 : 170; }
        }
        d[i] = r; d[i+1] = g; d[i+2] = b; d[i+3] = 255;
      }
    }
    this.bctx.putImageData(this.img, 0, 0);
    const ctx = this.ctx, S = this.cv.width;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, S, S);
    ctx.drawImage(this.buf, 0, 0, S, S);

    // team markers
    this.markers = [];
    const scale = S / N, CX = cx * scale, CY = cy * scale, RR = R * scale;
    const blink = Math.floor(performance.now() / 350) % 2 === 0;
    for (const [id, t] of Object.entries(this.teams)) {
      const phi = t.lat * Math.PI / 180, lam = t.lon * Math.PI / 180;
      const cosc = sinT * Math.sin(phi) + cosT * Math.cos(phi) * Math.cos(lam - lam0);
      if (cosc < 0.12) continue;         // back of the globe
      const mx = Math.cos(phi) * Math.sin(lam - lam0);
      const my = cosT * Math.sin(phi) - sinT * Math.cos(phi) * Math.cos(lam - lam0);
      const sx = CX + mx * RR, sy = CY - my * RR;
      this.markers.push({ id, x: sx, y: sy });
      const alive = t._alive;
      ctx.fillStyle = alive ? (blink ? "#ffe94a" : "#ff8c00") : (blink ? "#ff5555" : "#cc2222");
      ctx.fillRect(sx - 4, sy - 4, 8, 8);
      ctx.fillStyle = "#000";
      ctx.fillRect(sx - 2, sy - 2, 4, 4);
    }
  }

  pickAt(e) {
    const rect = this.cv.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (this.cv.width / rect.width);
    const y = (e.clientY - rect.top) * (this.cv.height / rect.height);
    let best = null, bd = 14 * 14;
    for (const m of this.markers) {
      const d2 = (m.x - x) ** 2 + (m.y - y) ** 2;
      if (d2 < bd) { bd = d2; best = m; }
    }
    return best;
  }
  hover(e) {
    const m = this.pickAt(e);
    this.cv.style.cursor = m ? "pointer" : "grab";
    this.onHover(m ? m.id : null, e);
  }
  click(e) {
    if (this.dragMoved) { this.dragMoved = false; return; }  // ignore click that ended a drag
    const m = this.pickAt(e);
    if (m) this.onPick(m.id);
  }
}

/* ======================== PLAYER SPRITE ======================== */
/* 12 x 18 cell figure, procedural kit patterns, 2-frame juggle */

function kitCell(kit, col, row) {
  const { p, s, pattern } = kit;
  switch (pattern) {
    case "stripes": return col % 2 === 0 ? p : s;
    case "hoops":   return row % 2 === 0 ? p : s;
    case "checks":  return (col + row) % 2 === 0 ? p : s;
    case "halves":  return col < 6 ? p : s;
    case "sash":    return (col + row) % 7 <= 1 ? s : p;
    default:        return p;      // solid (trim handled separately)
  }
}

class PlayerSprite {
  constructor(canvas, kit) {
    this.cv = canvas;
    this.ctx = canvas.getContext("2d");
    this.kit = kit;
    this.t = 0;
    this.kickBoost = 0;
    this.running = true;
    this.skin = "#e8b88a";
    this.hair = "#2b1a10";
    canvas.onclick = () => { this.kickBoost = 1; if (window.SFX) SFX.kick(); };
    requestAnimationFrame(() => this.frame());
  }
  stop() { this.running = false; this.cv.onclick = null; }
  setKit(kit) { this.kit = kit; }

  frame() {
    if (!this.running) return;
    this.t += 0.045 + this.kickBoost * 0.12;
    if (this.kickBoost > 0) this.kickBoost = Math.max(0, this.kickBoost - 0.012);
    this.draw();
    requestAnimationFrame(() => this.frame());
  }

  draw() {
    const ctx = this.ctx, W = this.cv.width, H = this.cv.height;
    const sc = Math.floor(H / 22);                 // cell size
    const ox = Math.floor(W / 2 - 6 * sc) - sc * 2; // sprite offset (left of center)
    const oy = Math.floor(H - 19 * sc);
    const px = (c, r, w = 1, h = 1, color = "#fff") => {
      ctx.fillStyle = color;
      ctx.fillRect(ox + c * sc, oy + r * sc, w * sc, h * sc);
    };
    ctx.clearRect(0, 0, W, H);

    // ball: juggled on the right foot
    const phase = Math.abs(Math.sin(this.t * 2.2));
    const ballLift = phase * (6 + this.kickBoost * 5) * sc * 0.8;
    const kicking = phase < 0.22;                  // ball near foot => leg out
    const k = this.kit;

    // shadow
    ctx.fillStyle = "rgba(0,0,0,.35)";
    ctx.fillRect(ox + 2 * sc, oy + 18 * sc, 8 * sc, sc * 0.6);
    ctx.fillRect(ox + 11.6 * sc, oy + 18 * sc, 2.4 * sc, sc * 0.6);

    // hair + head
    px(4, 0, 4, 1, this.hair);
    px(3.6, 1, 4.4, 1, this.hair);
    px(4, 1.6, 4, 3, this.skin);
    px(5, 2.4, 0.8, 0.8, "#111");                  // eyes
    px(6.6, 2.4, 0.8, 0.8, "#111");
    px(5, 5 - 0.6, 2, 0.6, this.skin);             // neck

    // jersey (rows 5..10, cols 3..8) with pattern
    for (let r = 5; r <= 10; r++)
      for (let c = 3; c <= 8; c++)
        px(c, r, 1, 1, kitCell(k, c, r));
    // collar + hem trim
    px(5, 5, 2, 0.5, k.s);
    px(3, 10.5, 6, 0.5, k.s);
    // sleeves
    for (let r = 5; r <= 7; r++) { px(1.8, r, 1.2, 1, kitCell(k, 1, r)); px(9, r, 1.2, 1, kitCell(k, 10, r)); }
    px(1.8, 7, 1.2, 0.5, k.s); px(9, 7, 1.2, 0.5, k.s); // cuffs
    px(1.8, 8, 1.2, 1.2, this.skin);               // hands
    px(9, 8, 1.2, 1.2, this.skin);

    // shorts
    px(3, 11, 6, 1.6, k.shorts);
    px(3, 12.6, 2.4, 0.8, k.shorts);
    px(6.6, 12.6, 2.4, 0.8, k.shorts);

    // legs: left planted, right kicks when ball is low
    px(3.4, 13.4, 1.6, 1.2, this.skin);            // left thigh gap -> sock
    px(3.4, 14.4, 1.6, 2.6, k.socks);
    px(2.8, 17, 2.4, 1, "#1a1a1a");                // left boot
    if (kicking) {
      px(7, 13.4, 2.2, 1.2, this.skin);
      px(8.4, 13.8, 1.6, 2, k.socks);
      px(9.6, 15, 2.2, 1, "#1a1a1a");              // boot out to ball
    } else {
      px(7, 13.4, 1.6, 1.2, this.skin);
      px(7, 14.4, 1.6, 2.6, k.socks);
      px(6.6, 17, 2.4, 1, "#1a1a1a");
    }

    // the ball (classic black & white)
    const bx = ox + 12.2 * sc, by = oy + 16.4 * sc - ballLift;
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(bx, by, sc * 1.8, sc * 1.8);
    ctx.fillStyle = "#111";
    ctx.fillRect(bx + sc * 0.6, by + sc * 0.6, sc * 0.6, sc * 0.6);
    ctx.fillRect(bx, by, sc * 0.45, sc * 0.45);
    ctx.fillRect(bx + sc * 1.35, by + sc * 1.35, sc * 0.45, sc * 0.45);
  }
}
