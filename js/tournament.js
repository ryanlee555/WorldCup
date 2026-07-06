/* ============================================================
   tournament.js — 2026 tournament state
   DATA PATCH: July 6, 2026 (morning) — during the Round of 16.
   To update after new matches: edit MATCHES + ODDS below,
   then flip status flags. Scores marked null = won, exact
   score not tracked; UI shows a W badge.
   ============================================================ */

/* ---- Group stage final standings ----
   pts is null where the exact tally wasn't confirmed at patch time.
   res: W = won group, Q = qualified, T = qualified as best 3rd, X = out */
const GROUPS = {
  A: [ {t:"mex",res:"W",pts:9}, {t:"rsa",res:"Q",pts:4}, {t:"kor",res:"X",pts:null}, {t:"cze",res:"X",pts:null} ],
  B: [ {t:"sui",res:"W",pts:7}, {t:"can",res:"Q",pts:4}, {t:"bih",res:"T",pts:null}, {t:"qat",res:"X",pts:null} ],
  C: [ {t:"bra",res:"W",pts:7}, {t:"mar",res:"Q",pts:7}, {t:"hai",res:"X",pts:null}, {t:"sco",res:"X",pts:null} ],
  D: [ {t:"usa",res:"W",pts:6}, {t:"par",res:"Q",pts:null}, {t:"aus",res:"T",pts:null}, {t:"tur",res:"X",pts:null} ],
  E: [ {t:"ger",res:"W",pts:null}, {t:"ecu",res:"Q",pts:null}, {t:"civ",res:"T",pts:null}, {t:"cuw",res:"X",pts:null} ],
  F: [ {t:"ned",res:"W",pts:null}, {t:"jpn",res:"Q",pts:null}, {t:"swe",res:"T",pts:null}, {t:"tun",res:"X",pts:null} ],
  G: [ {t:"bel",res:"W",pts:null}, {t:"egy",res:"Q",pts:null}, {t:"irn",res:"X",pts:null}, {t:"nzl",res:"X",pts:null} ],
  H: [ {t:"esp",res:"W",pts:null}, {t:"cpv",res:"Q",pts:null}, {t:"uru",res:"X",pts:null}, {t:"ksa",res:"X",pts:null} ],
  I: [ {t:"fra",res:"W",pts:null}, {t:"nor",res:"Q",pts:null}, {t:"sen",res:"T",pts:null}, {t:"irq",res:"X",pts:null} ],
  J: [ {t:"arg",res:"W",pts:null}, {t:"aut",res:"Q",pts:null}, {t:"alg",res:"T",pts:null}, {t:"jor",res:"X",pts:null} ],
  K: [ {t:"por",res:"W",pts:null}, {t:"col",res:"Q",pts:null}, {t:"cod",res:"T",pts:null}, {t:"uzb",res:"X",pts:null} ],
  L: [ {t:"eng",res:"W",pts:null}, {t:"cro",res:"Q",pts:null}, {t:"gha",res:"T",pts:null}, {t:"pan",res:"X",pts:null} ]
};

/* ---- Knockout matches ----
   status: played | today | upcoming | tbd
   sa/sb: goals (null = unknown exact score); note: AET / PENS info */
const MATCHES = [
  /* Round of 32 — Jun 28–Jul 3 */
  { id:"r32-1",  round:"R32", date:"JUN 30", a:"fra", b:"swe", sa:3, sb:0, status:"played" },
  { id:"r32-2",  round:"R32", date:"JUL 1",  a:"par", b:"ger", sa:null, sb:null, status:"played", note:"UPSET OF THE CUP" },
  { id:"r32-3",  round:"R32", date:"JUN 29", a:"mar", b:"ned", sa:null, sb:null, status:"played", note:"MOROCCO WIN ON PENS" },
  { id:"r32-4",  round:"R32", date:"JUN 28", a:"can", b:"rsa", sa:1, sb:0, status:"played" },
  { id:"r32-5",  round:"R32", date:"JUL 1",  a:"por", b:"cro", sa:null, sb:null, status:"played", note:"VAR DRAMA · MODRIĆ FAREWELL" },
  { id:"r32-6",  round:"R32", date:"JUL 2",  a:"esp", b:"aut", sa:2, sb:0, status:"played", note:"OYARZABAL ×2" },
  { id:"r32-7",  round:"R32", date:"JUN 30", a:"usa", b:"bih", sa:2, sb:0, status:"played" },
  { id:"r32-8",  round:"R32", date:"JUL 1",  a:"bel", b:"sen", sa:3, sb:2, status:"played", note:"AET — MATCH OF THE ROUND" },
  { id:"r32-9",  round:"R32", date:"JUL 2",  a:"nor", b:"civ", sa:null, sb:null, status:"played", note:"LATE HAALAND WINNER" },
  { id:"r32-10", round:"R32", date:"JUN 29", a:"bra", b:"jpn", sa:2, sb:1, status:"played" },
  { id:"r32-11", round:"R32", date:"JUL 2",  a:"eng", b:"cod", sa:2, sb:0, status:"played", note:"KANE LATE DOUBLE" },
  { id:"r32-12", round:"R32", date:"JUN 30", a:"mex", b:"ecu", sa:null, sb:null, status:"played", note:"HOSTS MARCH ON" },
  { id:"r32-13", round:"R32", date:"JUL 3",  a:"arg", b:"cpv", sa:3, sb:2, status:"played", note:"AET — CHAMPS SURVIVE SCARE" },
  { id:"r32-14", round:"R32", date:"JUL 1",  a:"egy", b:"aus", sa:null, sb:null, status:"played", note:"EGYPT WIN 4-2 ON PENS" },
  { id:"r32-15", round:"R32", date:"JUL 2",  a:"sui", b:"alg", sa:2, sb:0, status:"played" },
  { id:"r32-16", round:"R32", date:"JUL 3",  a:"col", b:"gha", sa:1, sb:0, status:"played" },

  /* Round of 16 — Jul 4–7 */
  { id:"r16-1", round:"R16", date:"JUL 4", a:"fra", b:"par", sa:1, sb:0, status:"played", venue:"HOUSTON" },
  { id:"r16-2", round:"R16", date:"JUL 4", a:"mar", b:"can", sa:3, sb:0, status:"played", venue:"PHILADELPHIA" },
  { id:"r16-3", round:"R16", date:"JUL 5", a:"eng", b:"mex", sa:3, sb:2, status:"played", note:"BELLINGHAM ×2 · KANE PEN", venue:"AZTECA, MEXICO CITY" },
  { id:"r16-4", round:"R16", date:"JUL 5", a:"nor", b:"bra", sa:null, sb:null, status:"played", note:"HAALAND BRACE 79' 90' — BRAZIL OUT!", venue:"SAN FRANCISCO" },
  { id:"r16-5", round:"R16", date:"JUL 6 · 3PM ET", a:"por", b:"esp", sa:null, sb:null, status:"today", venue:"DALLAS STADIUM" },
  { id:"r16-6", round:"R16", date:"JUL 6 · 8PM ET", a:"usa", b:"bel", sa:null, sb:null, status:"today", venue:"SEATTLE STADIUM" },
  { id:"r16-7", round:"R16", date:"JUL 7 · 12PM ET", a:"arg", b:"egy", sa:null, sb:null, status:"upcoming", venue:"ATLANTA STADIUM" },
  { id:"r16-8", round:"R16", date:"JUL 7 · 4PM ET", a:"sui", b:"col", sa:null, sb:null, status:"upcoming", venue:"VANCOUVER BC PLACE" },

  /* Quarterfinals — Jul 9–12 */
  { id:"qf-1", round:"QF", date:"JUL 9 · 4PM ET",  a:"fra", b:"mar", sa:null, sb:null, status:"upcoming", venue:"BOSTON STADIUM" },
  { id:"qf-2", round:"QF", date:"JUL 10 · 12PM ET", a:null, b:null, ph:"USA/BEL vs POR/ESP", sa:null, sb:null, status:"tbd", venue:"LOS ANGELES STADIUM" },
  { id:"qf-3", round:"QF", date:"JUL 11 · 5PM ET", a:"nor", b:"eng", sa:null, sb:null, status:"upcoming", venue:"MIAMI STADIUM" },
  { id:"qf-4", round:"QF", date:"JUL 12 · 8PM ET", a:null, b:null, ph:"ARG/EGY vs SUI/COL", sa:null, sb:null, status:"tbd", venue:"KANSAS CITY STADIUM" },

  /* Semifinals & Final */
  { id:"sf-1", round:"SF", date:"JUL 14", a:null, b:null, ph:"QF1 WINNER vs QF2 WINNER", sa:null, sb:null, status:"tbd", venue:"DALLAS STADIUM" },
  { id:"sf-2", round:"SF", date:"JUL 15", a:null, b:null, ph:"QF3 WINNER vs QF4 WINNER", sa:null, sb:null, status:"tbd", venue:"ATLANTA STADIUM" },
  { id:"f-3rd", round:"3RD", date:"JUL 18", a:null, b:null, ph:"THIRD PLACE PLAYOFF", sa:null, sb:null, status:"tbd", venue:"MIAMI STADIUM" },
  { id:"f-1",  round:"FINAL", date:"JUL 19", a:null, b:null, ph:"THE FINAL", sa:null, sb:null, status:"tbd", venue:"NEW YORK NEW JERSEY STADIUM" }
];

/* Bracket layout: QF blocks with their feeder R16 + R32 matches */
const BRACKET = [
  { qf:"qf-1", r16:["r16-1","r16-2"], r32:["r32-1","r32-2","r32-3","r32-4"] },
  { qf:"qf-2", r16:["r16-6","r16-5"], r32:["r32-7","r32-8","r32-5","r32-6"] },
  { qf:"qf-3", r16:["r16-4","r16-3"], r32:["r32-9","r32-10","r32-11","r32-12"] },
  { qf:"qf-4", r16:["r16-7","r16-8"], r32:["r32-13","r32-14","r32-15","r32-16"] }
];

/* ---- Title odds (consensus sportsbook lines, Jul 5 2026) ----
   Odds shift fast — n/a means still alive but line not confirmed at patch time. */
const ODDS = [
  { t:"fra", line:"+170",  tier:"FAVORITE",   note:"No knockout goals conceded" },
  { t:"arg", line:"+470",  tier:"CONTENDER",  note:"Messi's title defense" },
  { t:"eng", line:"+500",  tier:"CONTENDER",  note:"Bellingham & Kane firing" },
  { t:"esp", line:"+600",  tier:"CONTENDER",  note:"Euro champs · Iberian derby today" },
  { t:"por", line:"n/a",   tier:"DARK HORSE", note:"Ronaldo's last dance" },
  { t:"nor", line:"n/a",   tier:"DARK HORSE", note:"Haaland: 7 goals & surging" },
  { t:"usa", line:"n/a",   tier:"DARK HORSE", note:"Last host standing" },
  { t:"mar", line:"n/a",   tier:"DARK HORSE", note:"2022 semifinalists, fearless" },
  { t:"bel", line:"n/a",   tier:"LONGSHOT",   note:"Survivors of the R32 classic" },
  { t:"sui", line:"n/a",   tier:"LONGSHOT",   note:"Quietly clinical" },
  { t:"col", line:"n/a",   tier:"LONGSHOT",   note:"Díaz in form" },
  { t:"egy", line:"n/a",   tier:"LONGSHOT",   note:"Salah vs destiny (and Messi)" }
];

/* ---- Live banner ---- */
const LIVE_TODAY = {
  label: "⚡ TODAY — JUL 6",
  items: [
    "PORTUGAL vs SPAIN · 3PM ET · DALLAS — the Iberian derby, in the ROUND OF 16?!",
    "USA vs BELGIUM · 8PM ET · SEATTLE — last host standing fights on"
  ]
};

/* ---- World Cup history ---- */
const CHAMPIONS = [
  { y:1930, w:"Uruguay 🇺🇾",  note:"First ever — hosts win at the Centenario" },
  { y:1934, w:"Italy 🇮🇹",    note:"" },
  { y:1938, w:"Italy 🇮🇹",    note:"First to repeat" },
  { y:1950, w:"Uruguay 🇺🇾",  note:"'Maracanazo' — silence 200,000 in Rio" },
  { y:1954, w:"West Germany 🇩🇪", note:"'Miracle of Bern' over mighty Hungary" },
  { y:1958, w:"Brazil 🇧🇷",   note:"17-year-old Pelé announces himself" },
  { y:1962, w:"Brazil 🇧🇷",   note:"Back-to-back — Garrincha's Cup" },
  { y:1966, w:"England 🏴󠁧󠁢󠁥󠁮󠁧󠁿",  note:"Wembley, Hurst hat-trick, ghost goal" },
  { y:1970, w:"Brazil 🇧🇷",   note:"Pelé's third — maybe the greatest team ever" },
  { y:1974, w:"West Germany 🇩🇪", note:"Beckenbauer beats Cruyff's Total Football" },
  { y:1978, w:"Argentina 🇦🇷", note:"Kempes in the ticker-tape storm" },
  { y:1982, w:"Italy 🇮🇹",    note:"Rossi's redemption hat-trick vs Brazil" },
  { y:1986, w:"Argentina 🇦🇷", note:"Maradona: Hand of God + Goal of the Century" },
  { y:1990, w:"West Germany 🇩🇪", note:"" },
  { y:1994, w:"Brazil 🇧🇷",   note:"First US World Cup, first final on penalties" },
  { y:1998, w:"France 🇫🇷",   note:"Zidane heads Les Bleus to glory at home" },
  { y:2002, w:"Brazil 🇧🇷",   note:"Ronaldo's 8-goal redemption — 5th star" },
  { y:2006, w:"Italy 🇮🇹",    note:"Zidane's headbutt, Grosso's penalty" },
  { y:2010, w:"Spain 🇪🇸",    note:"Iniesta 116' — tiki-taka immortal" },
  { y:2014, w:"Germany 🇩🇪",  note:"The 7-1. Götze wins it in extra time" },
  { y:2018, w:"France 🇫🇷",   note:"Teen Mbappé lights up Moscow" },
  { y:2022, w:"Argentina 🇦🇷", note:"Messi completes football. Greatest final ever" }
];

const LEGENDS = [
  { n:"PELÉ", c:"🇧🇷", blurb:"Only player with 3 World Cups (1958/62/70). O Rei." },
  { n:"DIEGO MARADONA", c:"🇦🇷", blurb:"1986: one tournament, carried a nation, two most famous goals ever." },
  { n:"ZINEDINE ZIDANE", c:"🇫🇷", blurb:"Two headers won '98. One headbutt ended '06. Icon either way." },
  { n:"RONALDO NAZÁRIO", c:"🇧🇷", blurb:"R9 — 15 WC goals, the '02 redemption arc, that haircut." },
  { n:"MIROSLAV KLOSE", c:"🇩🇪", blurb:"All-time WC top scorer: 16 goals, zero fuss, front-flip celebrations." },
  { n:"LIONEL MESSI", c:"🇦🇷", blurb:"2022 champion, record 26+ WC matches — still going in 2026 at 39." },
  { n:"CRISTIANO RONALDO", c:"🇵🇹", blurb:"Only man to score at SIX World Cups (2006–2026)." },
  { n:"FRANZ BECKENBAUER", c:"🇩🇪", blurb:"Der Kaiser — won it as captain (1974) AND coach (1990)." },
  { n:"JOHAN CRUYFF", c:"🇳🇱", blurb:"Never won it; changed how everyone plays it. The Cruyff Turn, born 1974." },
  { n:"KYLIAN MBAPPÉ", c:"🇫🇷", blurb:"Champion at 19, final hat-trick at 23, hunting title #2 right now." },
  { n:"ERLING HAALAND", c:"🇳🇴", blurb:"The 2026 breakout: 7 goals and Brazil's conqueror. Legend speedrun." },
  { n:"LEV YASHIN", c:"🥅", blurb:"The Black Spider — the only goalkeeper to win the Ballon d'Or." }
];

const FACTS_2026 = [
  "First 48-team World Cup — expanded from 32. 104 matches, the most ever.",
  "First World Cup hosted by THREE nations: Canada, Mexico and the USA (16 host cities).",
  "Mexico became the first country to host matches at three World Cups (1970, 1986, 2026).",
  "The final: July 19, 2026 at New York New Jersey Stadium (82,500 seats).",
  "Estadio Azteca opened its third World Cup — no other stadium has done that.",
  "Debutants this cycle: Curaçao (smallest WC nation ever), Cape Verde, Jordan, Uzbekistan.",
  "A new round: the Round of 32 — group winners, runners-up and 8 best third-placed teams advance.",
  "Messi (39) and Ronaldo (41) both playing — their SIXTH World Cups, 20 years after their first.",
  "Paraguay's win over Germany earned a national holiday back home.",
  "Norway's Erling Haaland leads the Golden Boot race with 7 goals."
];
