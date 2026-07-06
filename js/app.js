/* ============================================================
   app.js — navigation, sound, and screen renderers
   ============================================================ */

/* ---------------- chiptune SFX (WebAudio) ---------------- */
const SFX = (() => {
  let ac = null, muted = false;
  const ensure = () => { if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)(); return ac; };
  function tone(freq, dur, type = "square", vol = 0.06, when = 0, slide = 0) {
    if (muted) return;
    const ctx = ensure();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, ctx.currentTime + when);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), ctx.currentTime + when + dur);
    g.gain.setValueAtTime(vol, ctx.currentTime + when);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
    o.connect(g).connect(ctx.destination);
    o.start(ctx.currentTime + when); o.stop(ctx.currentTime + when + dur + 0.02);
  }
  return {
    blip:  () => tone(660, 0.06),
    move:  () => tone(440, 0.05, "square", 0.04),
    kick:  () => { tone(220, 0.08, "square", 0.08, 0, -160); tone(880, 0.05, "square", 0.04, 0.02); },
    start: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, "square", 0.07, i * 0.09)); },
    goal:  () => { [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.15, "square", 0.06, i * 0.07)); },
    toggleMute() { muted = !muted; return muted; }
  };
})();
window.SFX = SFX;

/* ---------------- alive flags for globe markers ---------------- */
const ALIVE = new Set(["fra","mar","eng","nor","por","esp","usa","bel","arg","egy","sui","col"]);
for (const [id, t] of Object.entries(TEAMS)) t._alive = ALIVE.has(id);

/* ---------------- navigation ---------------- */
const screens = ["intro", "globe", "country", "hub", "history"];
let currentPlayer = null;
let globe = null;

function show(name) {
  for (const s of screens) document.getElementById("screen-" + s).classList.toggle("active", s === name);
  document.getElementById("navbar").classList.toggle("hidden", name === "intro");
  document.querySelectorAll(".nav-btn[data-nav]").forEach(b =>
    b.classList.toggle("current", b.dataset.nav === name));
  if (name !== "country" && currentPlayer) { currentPlayer.stop(); currentPlayer = null; }
  window.scrollTo(0, 0);
}

document.getElementById("btn-start").addEventListener("click", () => { SFX.start(); enterSite(); });
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && document.getElementById("screen-intro").classList.contains("active")) {
    SFX.start(); enterSite();
  }
});
document.querySelectorAll("[data-nav]").forEach(b =>
  b.addEventListener("click", () => { SFX.blip(); show(b.dataset.nav); }));
document.getElementById("btn-sound").addEventListener("click", function () {
  this.textContent = SFX.toggleMute() ? "🔇" : "🔊";
});

function enterSite() {
  show("globe");
  if (!globe) initGlobe();
}

/* ---------------- globe screen ---------------- */
function initGlobe() {
  const tooltip = document.getElementById("globe-tooltip");
  globe = new Globe(
    document.getElementById("globe"),
    TEAMS,
    id => { SFX.blip(); openCountry(id); },
    (id, e) => {
      if (!id) { tooltip.classList.add("hidden"); return; }
      const t = TEAMS[id];
      tooltip.textContent = `${t.flag} ${t.name}`;
      tooltip.classList.remove("hidden");
      const wrap = document.querySelector(".globe-wrap").getBoundingClientRect();
      tooltip.style.left = (e.clientX - wrap.left + 14) + "px";
      tooltip.style.top = (e.clientY - wrap.top - 10) + "px";
    }
  );
  document.getElementById("globe-spin").addEventListener("click", function () {
    globe.spinning = !globe.spinning;
    this.textContent = globe.spinning ? "⏸ PAUSE SPIN" : "▶ RESUME SPIN";
    SFX.move();
  });
  document.getElementById("globe-left").addEventListener("click", () => { globe.rot -= 18; SFX.move(); });
  document.getElementById("globe-right").addEventListener("click", () => { globe.rot += 18; SFX.move(); });

  buildRoster();
  renderLiveBanner(document.getElementById("live-banner"));
}

function renderLiveBanner(el) {
  el.innerHTML = `<span class="live-label">${LIVE_TODAY.label}</span>` +
    LIVE_TODAY.items.map(i => `<span class="live-item">▸ ${i}</span>`).join("");
}

function buildRoster() {
  const host = document.getElementById("team-roster");
  let html = "";
  for (const g of GROUP_ORDER) {
    html += `<div class="roster-group"><h4>GROUP ${g}</h4><div class="roster-row">`;
    for (const { t } of GROUPS[g]) {
      const team = TEAMS[t];
      html += `<button class="roster-btn ${team._alive ? "alive" : ""}" data-team="${t}" title="${team.name}">
        <span class="roster-flag">${team.flag}</span><span class="roster-name">${team.name}</span>
        ${team._alive ? '<span class="alive-dot">●</span>' : ""}</button>`;
    }
    html += "</div></div>";
  }
  host.innerHTML = html;
  host.querySelectorAll(".roster-btn").forEach(b =>
    b.addEventListener("click", () => { SFX.blip(); openCountry(b.dataset.team); }));
}

/* ---------------- country screen ---------------- */
function openCountry(id) {
  const t = TEAMS[id];
  show("country");

  // themed background
  const bg = document.getElementById("country-bg");
  bg.style.background = `linear-gradient(180deg, ${t.bg.g1} 0%, ${t.bg.g2} 100%)`;
  let motifs = "";
  for (let i = 0; i < 14; i++) {
    const m = t.bg.motifs[i % t.bg.motifs.length];
    const x = (i * 37 + 11) % 100, y = (i * 53 + 7) % 100;
    const s = 24 + ((i * 29) % 40);
    motifs += `<span class="motif" style="left:${x}%;top:${y}%;font-size:${s}px;animation-delay:${(i % 7) * 0.9}s">${m}</span>`;
  }
  bg.innerHTML = motifs;

  document.getElementById("country-flag").textContent = t.flag;
  document.getElementById("country-name").textContent = t.name;
  document.getElementById("country-tagline").textContent = t.tagline;
  document.getElementById("country-group").textContent = "GROUP " + t.group;
  document.getElementById("country-knownfor").textContent = t.knownFor;
  document.getElementById("country-culture").textContent = t.culture;
  document.getElementById("country-wc").textContent = t.wc;
  document.getElementById("country-fact").textContent = t.fact;
  document.getElementById("country-status").textContent = t.status;
  document.getElementById("country-sights").innerHTML = t.sights.map(s => `<li>▸ ${s}</li>`).join("");
  document.getElementById("country-foods").innerHTML = t.foods.map(s => `<li>▸ ${s}</li>`).join("");
  document.getElementById("country-legends").innerHTML = t.legends.map(s => `<li>⭐ ${s}</li>`).join("");
  document.getElementById("kit-desc").textContent =
    `${t.kit.pattern.toUpperCase()} KIT · HOME COLOURS`;

  if (currentPlayer) currentPlayer.stop();
  currentPlayer = new PlayerSprite(document.getElementById("player-canvas"), t.kit);
}

/* ---------------- tournament hub ---------------- */
document.querySelectorAll(".hub-tab").forEach(tab =>
  tab.addEventListener("click", () => {
    SFX.move();
    document.querySelectorAll(".hub-tab").forEach(t => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".hub-panel").forEach(p =>
      p.classList.toggle("active", p.id === "tab-" + tab.dataset.tab));
  }));

const RES_BADGE = { W: ["badge-win", "GROUP WINNER"], Q: ["badge-q", "QUALIFIED"], T: ["badge-t", "BEST 3RD"], X: ["badge-x", "ELIMINATED"] };

function teamChip(id, opts = {}) {
  if (!id) return `<span class="chip chip-tbd">${opts.ph || "TBD"}</span>`;
  const t = TEAMS[id];
  return `<button class="chip" data-team="${id}">${t.flag} ${opts.short ? id.toUpperCase() : t.name}</button>`;
}

function renderStandings() {
  let html = '<div class="standings-grid">';
  for (const g of GROUP_ORDER) {
    html += `<div class="group-card"><h4 class="group-title">GROUP ${g}</h4><table class="group-table">`;
    GROUPS[g].forEach((row, i) => {
      const t = TEAMS[row.t];
      const [cls, label] = RES_BADGE[row.res];
      html += `<tr class="${row.res === "X" ? "row-out" : ""}">
        <td class="pos">${i + 1}</td>
        <td class="tname"><button class="chip chip-plain" data-team="${row.t}">${t.flag} ${t.name}</button></td>
        <td class="pts">${row.pts ?? "—"}${row.pts != null ? " PTS" : ""}</td>
        <td><span class="badge ${cls}">${label}</span></td></tr>`;
    });
    html += "</table></div>";
  }
  html += "</div><p class='data-note'>— = final points not in this data patch. Badge shows the confirmed outcome.</p>";
  document.getElementById("tab-standings").innerHTML = html;
}

function matchCard(m, compact = false) {
  const score = (m.sa != null && m.sb != null) ? `${m.sa} - ${m.sb}` :
    m.status === "played" ? "W" : "VS";
  const cls = m.status === "today" ? "match-today" : m.status === "played" ? "match-played" : "match-up";
  const winnerA = m.status === "played" && (m.sa != null ? m.sa > m.sb : true);
  return `<div class="match-card ${cls} ${compact ? "compact" : ""}">
    <div class="match-meta">${m.round} · ${m.date}${m.venue ? " · " + m.venue : ""}${m.status === "today" ? ' <span class="live-tag">TODAY</span>' : ""}</div>
    <div class="match-line">
      ${m.a ? `<span class="mteam ${winnerA && m.status === "played" ? "mwin" : ""}">${teamChip(m.a)}</span>` : `<span class="mteam">${teamChip(null, { ph: m.ph })}</span>`}
      <span class="mscore">${m.a ? score : ""}</span>
      ${m.a ? `<span class="mteam ${!winnerA && m.status === "played" ? "mwin" : ""}">${teamChip(m.b)}</span>` : ""}
    </div>
    ${m.note ? `<div class="match-note">${m.note}</div>` : ""}
  </div>`;
}

function renderBracket() {
  const byId = Object.fromEntries(MATCHES.map(m => [m.id, m]));
  let html = '<div class="bracket-scroll"><div class="bracket">';
  // columns: R32, R16, QF, SF, FINAL
  html += '<div class="bracket-col"><h4>ROUND OF 32</h4>';
  for (const blk of BRACKET) for (const id of blk.r32) html += matchCard(byId[id], true);
  html += '</div><div class="bracket-col"><h4>ROUND OF 16</h4>';
  for (const blk of BRACKET) for (const id of blk.r16) html += `<div class="bspacer"></div>` + matchCard(byId[id], true);
  html += '</div><div class="bracket-col"><h4>QUARTERFINALS</h4>';
  for (const blk of BRACKET) html += `<div class="bspacer big"></div>` + matchCard(byId[blk.qf], true);
  html += '</div><div class="bracket-col"><h4>SEMIFINALS</h4><div class="bspacer huge"></div>' +
    matchCard(byId["sf-1"], true) + '<div class="bspacer huge"></div>' + matchCard(byId["sf-2"], true);
  html += '</div><div class="bracket-col"><h4>FINAL 🏆</h4><div class="bspacer mega"></div>' +
    matchCard(byId["f-1"], true) + '<div class="bspacer"></div>' + matchCard(byId["f-3rd"], true);
  html += "</div></div></div>";
  html += "<p class='data-note'>W = won, exact score not in this data patch. Scroll sideways for the full road to July 19 →</p>";
  document.getElementById("tab-bracket").innerHTML = html;
}

function renderMatches() {
  const played = MATCHES.filter(m => m.status === "played");
  const today = MATCHES.filter(m => m.status === "today");
  const upcoming = MATCHES.filter(m => m.status === "upcoming" || m.status === "tbd");
  let html = "";
  if (today.length) html += `<h4 class="match-section">⚡ TODAY — JUL 6</h4>` + today.map(m => matchCard(m)).join("");
  html += `<h4 class="match-section">📅 UPCOMING</h4>` + upcoming.map(m => matchCard(m)).join("");
  html += `<h4 class="match-section">✅ RESULTS</h4>` + [...played].reverse().map(m => matchCard(m)).join("");
  document.getElementById("tab-matches").innerHTML = html;
}

function renderOdds() {
  const maxImplied = 2.7; // +170 ≈ 37% implied, used to scale bars
  let html = `<div class="odds-list">`;
  for (const o of ODDS) {
    const t = TEAMS[o.t];
    let pct = 8;
    if (o.line.startsWith("+")) {
      const v = parseInt(o.line.slice(1), 10);
      pct = Math.round(100 / (v / 100 + 1) * maxImplied);
    }
    html += `<div class="odds-row">
      <button class="chip" data-team="${o.t}">${t.flag} ${t.name}</button>
      <div class="odds-bar-wrap"><div class="odds-bar tier-${o.tier.replace(" ", "-")}" style="width:${Math.min(96, pct)}%"></div></div>
      <span class="odds-line">${o.line}</span>
      <span class="odds-tier">${o.tier}</span>
      <span class="odds-note">${o.note}</span>
    </div>`;
  }
  html += `</div><p class="data-note">Consensus sportsbook lines, July 5 2026. n/a = line moving / not confirmed at patch time. Play responsibly — this cartridge accepts no coins.</p>`;
  document.getElementById("tab-odds").innerHTML = html;
}

/* ---------------- history ---------------- */
function renderHistory() {
  document.getElementById("history-timeline").innerHTML = CHAMPIONS.map(c =>
    `<div class="tl-row"><span class="tl-year">${c.y}</span><span class="tl-champ">${c.w}</span>
     <span class="tl-note">${c.note}</span></div>`).join("");
  document.getElementById("history-legends").innerHTML = LEGENDS.map(l =>
    `<div class="legend-card"><div class="legend-name">${l.c} ${l.n}</div><div class="legend-blurb">${l.blurb}</div></div>`).join("");
  document.getElementById("history-facts").innerHTML = FACTS_2026.map(f => `<li>▸ ${f}</li>`).join("");
}

/* chips anywhere open the country page */
document.addEventListener("click", e => {
  const chip = e.target.closest("[data-team]");
  if (chip && !chip.classList.contains("roster-btn")) { SFX.blip(); openCountry(chip.dataset.team); }
});

/* ---------------- boot ---------------- */
renderStandings();
renderBracket();
renderMatches();
renderOdds();
renderHistory();
renderLiveBanner(document.getElementById("hub-live"));
