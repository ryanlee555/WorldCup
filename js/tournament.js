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
  { id:"r32-1", round:"R32", date:"JUN 30", a:"fra", b:"swe", sa:3, sb:0, status:"played", venue:"LOS ANGELES STADIUM",
    d:{ goals:[{t:"fra",p:"Mbappé",m:22},{t:"fra",p:"Dembélé",m:51},{t:"fra",p:"Kolo Muani",m:78}],
        stats:{pos:[61,39],sh:[16,7],sot:[7,2],cor:[8,3],fouls:[9,12]}, motm:{t:"fra",p:"Ousmane Dembélé"},
        sum:"France cruised. Mbappé opened early, Dembélé doubled it after the break and Kolo Muani sealed a statement win." } },
  { id:"r32-2", round:"R32", date:"JUL 1", a:"par", b:"ger", sa:1, sb:1, status:"played", note:"UPSET OF THE CUP · PARAGUAY WIN 4-3 ON PENS", venue:"PHILADELPHIA STADIUM",
    d:{ goals:[{t:"ger",p:"Havertz",m:37},{t:"par",p:"Almirón",m:74}], pens:"Paraguay won 4-3 on penalties",
        stats:{pos:[38,62],sh:[8,17],sot:[4,6],cor:[3,9],fouls:[15,10]}, motm:{t:"par",p:"Roberto Fernández (GK)"},
        sum:"Germany dominated but Almirón's late leveller forced extra time. Paraguay's keeper saved the decisive spot-kick — cue a national holiday back in Asunción." } },
  { id:"r32-3", round:"R32", date:"JUN 29", a:"mar", b:"ned", sa:1, sb:1, status:"played", note:"MOROCCO WIN 5-4 ON PENS", venue:"BOSTON STADIUM",
    d:{ goals:[{t:"mar",p:"En-Nesyri",m:40},{t:"ned",p:"Gakpo",m:66}], pens:"Morocco won 5-4 on penalties",
        stats:{pos:[46,54],sh:[11,13],sot:[5,5],cor:[5,6],fouls:[12,11]}, motm:{t:"mar",p:"Yassine Bounou (GK)"},
        sum:"A tense Atlas Lions–Oranje classic went the distance. Bounou was the shootout hero as Morocco edged a five-goal-a-side lottery." } },
  { id:"r32-4", round:"R32", date:"JUN 28", a:"can", b:"rsa", sa:1, sb:0, status:"played", venue:"TORONTO STADIUM",
    d:{ goals:[{t:"can",p:"Jonathan David",m:63}], stats:{pos:[52,48],sh:[12,8],sot:[4,3],cor:[6,4],fouls:[10,13]},
        motm:{t:"can",p:"Jonathan David"}, sum:"David's clinical second-half finish gave the co-hosts their first-ever World Cup knockout win." } },
  { id:"r32-5", round:"R32", date:"JUL 1", a:"por", b:"cro", sa:2, sb:1, status:"played", note:"VAR DRAMA · MODRIĆ FAREWELL", venue:"NEW YORK NEW JERSEY STADIUM",
    d:{ goals:[{t:"por",p:"Bruno Fernandes",m:30},{t:"cro",p:"Kramarić",m:70},{t:"por",p:"Gonçalo Ramos",m:88}],
        stats:{pos:[55,45],sh:[14,10],sot:[6,4],cor:[7,5],fouls:[11,12]}, motm:{t:"por",p:"Gonçalo Ramos"},
        sum:"Ramos struck late and survived a VAR review that capped a wild finish — sending Portugal through and ending Luka Modrić's international career." } },
  { id:"r32-6", round:"R32", date:"JUL 2", a:"esp", b:"aut", sa:2, sb:0, status:"played", note:"OYARZABAL ×2", venue:"DALLAS STADIUM",
    d:{ goals:[{t:"esp",p:"Oyarzabal",m:25},{t:"esp",p:"Oyarzabal",m:61}], stats:{pos:[64,36],sh:[18,6],sot:[8,2],cor:[9,2],fouls:[8,14]},
        motm:{t:"esp",p:"Mikel Oyarzabal"}, sum:"Oyarzabal's double sent the Euro champions cruising into the last 16 with barely a bead of sweat." } },
  { id:"r32-7", round:"R32", date:"JUN 30", a:"usa", b:"bih", sa:2, sb:0, status:"played", venue:"SEATTLE STADIUM",
    d:{ goals:[{t:"usa",p:"Pulisic",m:33},{t:"usa",p:"Balogun",m:70}], stats:{pos:[57,43],sh:[15,7],sot:[6,2],cor:[7,3],fouls:[10,11]},
        motm:{t:"usa",p:"Christian Pulisic"}, sum:"Captain Pulisic set the tone and Balogun put it to bed — the hosts marched on in front of a roaring Seattle crowd." } },
  { id:"r32-8", round:"R32", date:"JUL 1", a:"bel", b:"sen", sa:3, sb:2, status:"played", note:"AET — MATCH OF THE ROUND", venue:"SEATTLE STADIUM",
    d:{ goals:[{t:"sen",p:"Diarra",m:25},{t:"sen",p:"Ismaïla Sarr",m:52},{t:"bel",p:"Lukaku",m:86},{t:"bel",p:"Tielemans",m:89},{t:"bel",p:"Tielemans",m:125,pen:true}],
        stats:{pos:[53,47],sh:[19,11],sot:[8,6],cor:[8,4],fouls:[14,16]}, motm:{t:"bel",p:"Youri Tielemans"},
        sum:"Senegal led 2-0 with four minutes left. Lukaku and Tielemans forced extra time, then Tielemans' 125th-minute penalty — the latest goal in World Cup history — completed a staggering comeback." } },
  { id:"r32-9", round:"R32", date:"JUL 2", a:"nor", b:"civ", sa:2, sb:1, status:"played", note:"LATE HAALAND WINNER", venue:"SAN FRANCISCO STADIUM",
    d:{ goals:[{t:"nor",p:"Haaland",m:44},{t:"civ",p:"Haller",m:70},{t:"nor",p:"Haaland",m:88}],
        stats:{pos:[51,49],sh:[13,10],sot:[6,4],cor:[6,5],fouls:[12,13]}, motm:{t:"nor",p:"Erling Haaland"},
        sum:"Haaland struck either side of Haller's equaliser, his 88th-minute winner sending Norway into the last 16 and announcing his tournament." } },
  { id:"r32-10", round:"R32", date:"JUN 29", a:"bra", b:"jpn", sa:2, sb:1, status:"played", note:"MARTINELLI 90+6' WINNER", venue:"KANSAS CITY STADIUM",
    d:{ goals:[{t:"jpn",p:"Kaishu Sano",m:29},{t:"bra",p:"Casemiro",m:56},{t:"bra",p:"Martinelli",m:96}],
        stats:{pos:[58,42],sh:[17,9],sot:[7,4],cor:[9,3],fouls:[13,10]}, motm:{t:"bra",p:"Gabriel Martinelli"},
        sum:"Sano stunned Brazil; Casemiro's header levelled it and Martinelli poked home in the sixth minute of stoppage time to spare the Seleção a scare." } },
  { id:"r32-11", round:"R32", date:"JUL 2", a:"eng", b:"cod", sa:2, sb:0, status:"played", note:"KANE LATE DOUBLE", venue:"MIAMI STADIUM",
    d:{ goals:[{t:"eng",p:"Kane",m:71},{t:"eng",p:"Kane",m:84}], stats:{pos:[62,38],sh:[16,6],sot:[6,2],cor:[8,2],fouls:[9,12]},
        motm:{t:"eng",p:"Harry Kane"}, sum:"A stubborn DR Congo held out for 70 minutes before Kane's clinical late double broke the deadlock and the resistance." } },
  { id:"r32-12", round:"R32", date:"JUN 30", a:"mex", b:"ecu", sa:2, sb:0, status:"played", note:"HOSTS MARCH ON", venue:"MEXICO CITY (AZTECA)",
    d:{ goals:[{t:"mex",p:"Raúl Jiménez",m:40},{t:"mex",p:"S. Giménez",m:75}], stats:{pos:[56,44],sh:[14,8],sot:[6,3],cor:[7,4],fouls:[11,12]},
        motm:{t:"mex",p:"Santiago Giménez"}, sum:"El Tri controlled the derby-flavoured tie; two second-half goals sent a delirious Azteca into the next round." } },
  { id:"r32-13", round:"R32", date:"JUL 3", a:"arg", b:"cpv", sa:3, sb:2, status:"played", note:"AET — CHAMPS SURVIVE SCARE", venue:"MIAMI STADIUM",
    d:{ goals:[{t:"arg",p:"Messi",m:29},{t:"cpv",p:"Deroy Duarte",m:58},{t:"arg",p:"Lisandro Martínez",m:91},{t:"cpv",p:"Lopes Cabral",m:103},{t:"arg",p:"Cristian Romero",m:118}],
        stats:{pos:[60,40],sh:[20,8],sot:[8,5],cor:[10,3],fouls:[12,15]}, motm:{t:"arg",p:"Lionel Messi"},
        sum:"Messi's 20th World Cup goal put the champions ahead, but debutants Cape Verde twice hit back — Lopes Cabral's stunner forcing a second period of extra time before Romero headed the winner." } },
  { id:"r32-14", round:"R32", date:"JUL 1", a:"egy", b:"aus", sa:1, sb:1, status:"played", note:"EGYPT WIN 4-2 ON PENS", venue:"VANCOUVER BC PLACE",
    d:{ goals:[{t:"egy",p:"Salah",m:55},{t:"aus",p:"Duke",m:70}], pens:"Egypt won 4-2 on penalties",
        stats:{pos:[55,45],sh:[13,9],sot:[5,4],cor:[6,5],fouls:[11,12]}, motm:{t:"egy",p:"Mohamed Salah"},
        sum:"Salah's opener was cancelled out by Duke, but the Pharaohs held their nerve from the spot to reach the last 16." } },
  { id:"r32-15", round:"R32", date:"JUL 2", a:"sui", b:"alg", sa:2, sb:0, status:"played", venue:"HOUSTON STADIUM",
    d:{ goals:[{t:"sui",p:"Embolo",m:30},{t:"sui",p:"Ndoye",m:66}], stats:{pos:[54,46],sh:[13,8],sot:[5,3],cor:[6,4],fouls:[10,13]},
        motm:{t:"sui",p:"Breel Embolo"}, sum:"Clinical as ever, Switzerland took their chances and quietly booked another knockout date." } },
  { id:"r32-16", round:"R32", date:"JUL 3", a:"col", b:"gha", sa:1, sb:0, status:"played", venue:"ATLANTA STADIUM",
    d:{ goals:[{t:"col",p:"Luis Díaz",m:58}], stats:{pos:[59,41],sh:[15,7],sot:[5,2],cor:[8,3],fouls:[10,11]},
        motm:{t:"col",p:"Luis Díaz"}, sum:"Díaz's moment of quality settled a tight, physical contest and sent Los Cafeteros through." } },

  /* Round of 16 — Jul 4–7 */
  { id:"r16-1", round:"R16", date:"JUL 4", a:"fra", b:"par", sa:1, sb:0, status:"played", venue:"HOUSTON STADIUM",
    d:{ goals:[{t:"fra",p:"Mbappé",m:68,pen:true}], stats:{pos:[63,37],sh:[17,6],sot:[6,2],cor:[9,2],fouls:[10,13]},
        motm:{t:"fra",p:"Kylian Mbappé"}, sum:"Paraguay's giant-killing run met a wall. Mbappé's second-half penalty — his 7th of the tournament — was enough, and France still haven't conceded in the knockouts." } },
  { id:"r16-2", round:"R16", date:"JUL 4", a:"mar", b:"can", sa:3, sb:0, status:"played", venue:"PHILADELPHIA STADIUM",
    d:{ goals:[{t:"mar",p:"Ounahi",m:50},{t:"mar",p:"Rahimi",m:66},{t:"mar",p:"Ounahi",m:82}],
        stats:{pos:[57,43],sh:[16,8],sot:[7,3],cor:[8,4],fouls:[9,12]}, motm:{t:"mar",p:"Azzedine Ounahi"},
        sum:"Ounahi's brace, sandwiching Rahimi's strike, ended the co-hosts' dream and rolled Morocco into a quarterfinal with France." } },
  { id:"r16-3", round:"R16", date:"JUL 5", a:"eng", b:"mex", sa:3, sb:2, status:"played", note:"BELLINGHAM ×2 · KANE PEN · QUANSAH RED", venue:"MEXICO CITY (AZTECA)",
    d:{ goals:[{t:"eng",p:"Bellingham",m:36},{t:"eng",p:"Bellingham",m:38},{t:"mex",p:"Quiñones",m:42},{t:"eng",p:"Kane",m:60,pen:true},{t:"mex",p:"Raúl Jiménez",m:69,pen:true}],
        cards:[{t:"eng",p:"Quansah",m:52,c:"R"}], stats:{pos:[46,54],sh:[10,15],sot:[5,6],cor:[4,8],fouls:[14,11]}, motm:{t:"eng",p:"Jude Bellingham"},
        sum:"Bellingham scored twice in 98 seconds — the first to net a World Cup brace at the Azteca since Maradona in '86. England then survived 40+ minutes a man down after Quansah's red to hold off a raucous Mexico." } },
  { id:"r16-4", round:"R16", date:"JUL 5", a:"nor", b:"bra", sa:2, sb:1, status:"played", note:"HAALAND BRACE 79' 90' — BRAZIL OUT!", venue:"NEW YORK NEW JERSEY STADIUM",
    d:{ goals:[{t:"bra",p:"Neymar",m:65,pen:true},{t:"nor",p:"Haaland",m:79},{t:"nor",p:"Haaland",m:90}],
        stats:{pos:[42,58],sh:[9,16],sot:[5,6],cor:[3,9],fouls:[13,11]}, motm:{t:"nor",p:"Erling Haaland"},
        sum:"Neymar's penalty — perhaps his last act in a Brazil shirt — looked like sending the Seleção through. Then Haaland headed home on 79' and rifled a low winner on 90' to complete a historic upset and reach Norway's first-ever quarterfinal." } },
  { id:"r16-5", round:"R16", date:"JUL 6 · 3PM ET", a:"por", b:"esp", sa:null, sb:null, status:"today", venue:"DALLAS STADIUM",
    d:{ preview:"The Iberian derby — in the Round of 16?! Ronaldo's Portugal against Lamine Yamal and the Euro champions. Two of the tournament's in-form attacks, one goes home. Kick-off 3PM ET in Dallas." } },
  { id:"r16-6", round:"R16", date:"JUL 6 · 8PM ET", a:"usa", b:"bel", sa:null, sb:null, status:"today", venue:"SEATTLE STADIUM",
    d:{ preview:"Last host standing. A roaring Seattle crowd behind Pulisic's USA, against a Belgium side that just survived the R32 classic of the tournament. Win and the co-hosts reach the quarters. Kick-off 8PM ET." } },
  { id:"r16-7", round:"R16", date:"JUL 7 · 12PM ET", a:"arg", b:"egy", sa:null, sb:null, status:"upcoming", venue:"ATLANTA STADIUM",
    d:{ preview:"Messi vs Salah — a dream marquee. The champions, fresh off surviving Cape Verde, meet Salah's Pharaohs and their shootout heroics. Atlanta, 12PM ET, Jul 7." } },
  { id:"r16-8", round:"R16", date:"JUL 7 · 4PM ET", a:"sui", b:"col", sa:null, sb:null, status:"upcoming", venue:"VANCOUVER BC PLACE",
    d:{ preview:"Two quietly dangerous sides. Switzerland's ruthless efficiency against Luis Díaz and a confident Colombia. The winner gets a very winnable quarterfinal. Vancouver, 4PM ET." } },

  /* Quarterfinals — Jul 9–12 */
  { id:"qf-1", round:"QF", date:"JUL 9 · 4PM ET", a:"fra", b:"mar", sa:null, sb:null, status:"upcoming", venue:"BOSTON STADIUM",
    d:{ preview:"Tournament favourites France (who haven't conceded in the knockouts) against the fearless Atlas Lions, 2022's semifinalists. A blockbuster in Boston." } },
  { id:"qf-2", round:"QF", date:"JUL 10 · 12PM ET", a:null, b:null, ph:"USA/BEL vs POR/ESP", sa:null, sb:null, status:"tbd", venue:"LOS ANGELES STADIUM",
    d:{ preview:"The winners of USA–Belgium and Portugal–Spain meet in Los Angeles. Both of today's ties feed this quarterfinal." } },
  { id:"qf-3", round:"QF", date:"JUL 11 · 5PM ET", a:"nor", b:"eng", sa:null, sb:null, status:"upcoming", venue:"MIAMI STADIUM",
    d:{ preview:"Haaland vs the Three Lions. Norway's conquerors of Brazil against Bellingham & Kane's England. Golden Boot fireworks expected in Miami." } },
  { id:"qf-4", round:"QF", date:"JUL 12 · 8PM ET", a:null, b:null, ph:"ARG/EGY vs SUI/COL", sa:null, sb:null, status:"tbd", venue:"KANSAS CITY STADIUM",
    d:{ preview:"The winners of Argentina–Egypt and Switzerland–Colombia collide in Kansas City for a semifinal spot." } },

  /* Semifinals & Final */
  { id:"sf-1", round:"SF", date:"JUL 14", a:null, b:null, ph:"QF1 WINNER vs QF2 WINNER", sa:null, sb:null, status:"tbd", venue:"DALLAS STADIUM",
    d:{ preview:"First semifinal — the QF1 (France/Morocco) winner meets the QF2 winner. Dallas, Jul 14." } },
  { id:"sf-2", round:"SF", date:"JUL 15", a:null, b:null, ph:"QF3 WINNER vs QF4 WINNER", sa:null, sb:null, status:"tbd", venue:"ATLANTA STADIUM",
    d:{ preview:"Second semifinal — the QF3 (Norway/England) winner meets the QF4 winner. Atlanta, Jul 15." } },
  { id:"f-3rd", round:"3RD", date:"JUL 18", a:null, b:null, ph:"THIRD PLACE PLAYOFF", sa:null, sb:null, status:"tbd", venue:"MIAMI STADIUM",
    d:{ preview:"The two beaten semifinalists play off for third place in Miami, Jul 18." } },
  { id:"f-1", round:"FINAL", date:"JUL 19", a:null, b:null, ph:"THE FINAL", sa:null, sb:null, status:"tbd", venue:"NEW YORK NEW JERSEY STADIUM",
    d:{ preview:"🏆 THE FINAL. July 19 at New York New Jersey Stadium, 82,500 seats. One match for the whole thing." } }
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
  "Erling Haaland and Lionel Messi share the Golden Boot lead on 7 goals apiece."
];
