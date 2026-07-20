/* ============================================================
   tournament.js — 2026 tournament state
   DATA PATCH: July 19, 2026 — TOURNAMENT COMPLETE. Champions: Spain 🇪🇸.
   Knockout goals/cards/stats researched from live coverage
   (ESPN, FIFA/Opta match centres, Al Jazeera, Sky Sports).
   To update after new matches: edit MATCHES + ODDS below,
   then flip status flags.
   ============================================================ */

/* ---- Group stage final standings (real points, researched) ----
   res: W = won group, Q = qualified, T = qualified as best 3rd, X = out */
const GROUPS = {
  A: [ {t:"mex",res:"W",pts:9}, {t:"rsa",res:"Q",pts:4}, {t:"kor",res:"X",pts:3}, {t:"cze",res:"X",pts:1} ],
  B: [ {t:"sui",res:"W",pts:7}, {t:"can",res:"Q",pts:4}, {t:"bih",res:"T",pts:4}, {t:"qat",res:"X",pts:1} ],
  C: [ {t:"bra",res:"W",pts:7}, {t:"mar",res:"Q",pts:7}, {t:"sco",res:"X",pts:3}, {t:"hai",res:"X",pts:0} ],
  D: [ {t:"usa",res:"W",pts:6}, {t:"aus",res:"Q",pts:4}, {t:"par",res:"T",pts:4}, {t:"tur",res:"X",pts:3} ],
  E: [ {t:"ger",res:"W",pts:6}, {t:"civ",res:"Q",pts:6}, {t:"ecu",res:"T",pts:4}, {t:"cuw",res:"X",pts:1} ],
  F: [ {t:"ned",res:"W",pts:7}, {t:"jpn",res:"Q",pts:5}, {t:"swe",res:"T",pts:4}, {t:"tun",res:"X",pts:0} ],
  G: [ {t:"bel",res:"W",pts:5}, {t:"egy",res:"Q",pts:5}, {t:"irn",res:"X",pts:3}, {t:"nzl",res:"X",pts:1} ],
  H: [ {t:"esp",res:"W",pts:7}, {t:"cpv",res:"Q",pts:3}, {t:"uru",res:"X",pts:2}, {t:"ksa",res:"X",pts:2} ],
  I: [ {t:"fra",res:"W",pts:9}, {t:"nor",res:"Q",pts:6}, {t:"sen",res:"T",pts:3}, {t:"irq",res:"X",pts:0} ],
  J: [ {t:"arg",res:"W",pts:9}, {t:"aut",res:"Q",pts:4}, {t:"alg",res:"T",pts:4}, {t:"jor",res:"X",pts:0} ],
  K: [ {t:"col",res:"W",pts:7}, {t:"por",res:"Q",pts:5}, {t:"cod",res:"T",pts:4}, {t:"uzb",res:"X",pts:0} ],
  L: [ {t:"eng",res:"W",pts:7}, {t:"cro",res:"Q",pts:6}, {t:"gha",res:"T",pts:4}, {t:"pan",res:"X",pts:0} ]
};

/* ---- Knockout matches ----
   status: played | today | upcoming | tbd
   sa/sb: goals (null = unknown exact score); note: AET / PENS info */
const MATCHES = [
  /* Round of 32 — Jun 28–Jul 3. Goals/scorers/cards researched from live coverage (ESPN, Al Jazeera, Opta/FIFA match centres). */
  { id:"r32-1", round:"R32", date:"JUN 30", a:"fra", b:"swe", sa:3, sb:0, status:"played", venue:"NEW YORK NEW JERSEY STADIUM", espnId:760492,
    d:{ goals:[{t:"fra",p:"Mbappé",m:45},{t:"fra",p:"Barcola",m:53},{t:"fra",p:"Mbappé",m:74}],
        stats:{pos:[61,39],sh:[25,8],sot:[12,3],xg:[3.17,0.71]}, motm:{t:"fra",p:"Kylian Mbappé"},
        sum:"France's most shots in a World Cup match since 1998 (25). Mbappé's brace either side of a Barcola strike made it a rout — his highest single-tournament shot count on record, per Opta." } },
  { id:"r32-2", round:"R32", date:"JUN 29", a:"ger", b:"par", sa:1, sb:1, status:"played", note:"UPSET OF THE CUP · PARAGUAY WIN 4-3 ON PENS", venue:"PHILADELPHIA STADIUM", espnId:760489,
    d:{ goals:[{t:"par",p:"Enciso",m:42},{t:"ger",p:"Havertz",m:54}], pens:"Paraguay won 4-3 on penalties",
        stats:{pos:[65,23],sh:[21,7],sot:[6,3],xg:[1.49,0.42]}, motm:{t:"par",p:"Orlando Gill (GK)"},
        sum:"Germany dominated on the ball (65% possession, 21 shots) but couldn't find a second goal; a Tah extra-time header was ruled out by VAR. Gill saved in the shootout and José Canale struck the winning penalty — Germany's first-ever World Cup shootout loss, and arguably the biggest upset in the tournament's history." } },
  { id:"r32-3", round:"R32", date:"JUN 29", a:"ned", b:"mar", sa:1, sb:1, status:"played", note:"MOROCCO WIN 3-2 ON PENS", venue:"BOSTON STADIUM", espnId:760488,
    d:{ goals:[{t:"ned",p:"Gakpo",m:72},{t:"mar",p:"Issa Diop",m:91}], pens:"Morocco won 3-2 on penalties",
        stats:{pos:[30,70],sh:[6,11],sot:[2,5],xg:[0.24,1.38]}, motm:{t:"mar",p:"Yassine Bounou (GK)"},
        sum:"Diop's stoppage-time header cancelled out Gakpo's opener. In the shootout, Kluivert and Timber missed for the Dutch and Bounou saved from Summerville before Saibari sent Morocco through." } },
  { id:"r32-4", round:"R32", date:"JUN 28", a:"rsa", b:"can", sa:0, sb:1, status:"played", venue:"LOS ANGELES STADIUM", espnId:760486,
    d:{ goals:[{t:"can",p:"Eustáquio",m:92}], stats:{pos:[55,45],sh:[6,12],sot:[1,7],xg:[0.13,1.32]},
        motm:{t:"can",p:"Stephen Eustáquio"}, sum:"Canada had far the better chances (1.32 xG to 0.13) but South Africa's low block held until the 92nd minute, when Eustáquio chested down a Johnston cross and rifled it into the bottom corner — the co-hosts' first-ever World Cup knockout win." } },
  { id:"r32-5", round:"R32", date:"JUL 2", a:"por", b:"cro", sa:2, sb:1, status:"played", note:"RAMOS 90+4' WINNER · MODRIĆ FAREWELL", venue:"TORONTO STADIUM", espnId:760496,
    d:{ goals:[{t:"cro",p:"Perišić",m:53},{t:"por",p:"Ronaldo",m:68,pen:true},{t:"por",p:"Gonçalo Ramos",m:94}],
        stats:{pos:[62,38],sh:[15,13],sot:[3,7],xg:[2.18,1.34]}, motm:{t:"por",p:"Gonçalo Ramos"},
        sum:"Perišić's strike was cancelled out by a Ronaldo penalty, and Ramos headed a stoppage-time winner to end Luka Modrić's international career and send Portugal through to face Spain." } },
  { id:"r32-6", round:"R32", date:"JUL 2", a:"esp", b:"aut", sa:3, sb:0, status:"played", note:"OYARZABAL ×2", venue:"LOS ANGELES STADIUM", espnId:760497,
    d:{ goals:[{t:"esp",p:"Oyarzabal",m:36},{t:"esp",p:"Porro",m:66},{t:"esp",p:"Oyarzabal",m:89}],
        stats:{pos:[69,31],sh:[23,5],sot:[10,0],xg:[2.84,0.32]}, motm:{t:"esp",p:"Mikel Oyarzabal"},
        sum:"Oyarzabal's double either side of a Porro strike sent the Euro champions cruising into the last 16 without breaking sweat." } },
  { id:"r32-7", round:"R32", date:"JUL 1", a:"usa", b:"bih", sa:2, sb:0, status:"played", note:"BALOGUN RED CARD 64'", venue:"SAN FRANCISCO BAY AREA STADIUM", espnId:760494,
    d:{ goals:[{t:"usa",p:"Balogun",m:45},{t:"usa",p:"Tillman",m:82}], cards:[{t:"usa",p:"Balogun",m:64,c:"R"}],
        motm:{t:"usa",p:"Malik Tillman"},
        sum:"Balogun's first-half goal and a Tillman free kick got the USA their first World Cup knockout win since 2002 — achieved with 10 men for the final half hour after Balogun's own 64th-minute red card." } },
  { id:"r32-8", round:"R32", date:"JUL 1", a:"bel", b:"sen", sa:3, sb:2, status:"played", note:"AET — TIELEMANS' 125' PEN IS THE LATEST GOAL IN WC HISTORY", venue:"SEATTLE STADIUM", espnId:760493,
    d:{ goals:[{t:"sen",p:"Diarra",m:25},{t:"sen",p:"Ismaïla Sarr",m:52},{t:"bel",p:"Lukaku",m:86},{t:"bel",p:"Tielemans",m:89},{t:"bel",p:"Tielemans",m:125,pen:true}],
        stats:{pos:[53,47],sh:[21,19],sot:[5,5],xg:[2.02,2.51]}, motm:{t:"bel",p:"Youri Tielemans"},
        sum:"Senegal led 2-0 with four minutes left and hit the woodwork twice. Lukaku and Tielemans forced extra time, then Tielemans converted a 125th-minute penalty — the latest goal in World Cup history — to complete an extraordinary Belgian comeback." } },
  { id:"r32-9", round:"R32", date:"JUN 30", a:"civ", b:"nor", sa:1, sb:2, status:"played", note:"LATE HAALAND WINNER", venue:"KANSAS CITY STADIUM", espnId:760490,
    d:{ goals:[{t:"nor",p:"Nusa",m:39},{t:"civ",p:"Amad Diallo",m:74},{t:"nor",p:"Haaland",m:86}],
        stats:{xg:[1.36,2.02]}, motm:{t:"nor",p:"Erling Haaland"},
        sum:"Nusa's curler put Norway ahead before Diallo's solo goal levelled it. Haaland — quiet for long spells — tapped in Sander Berge's cross with four minutes left for Norway's first-ever World Cup knockout win." } },
  { id:"r32-10", round:"R32", date:"JUN 29", a:"bra", b:"jpn", sa:2, sb:1, status:"played", note:"MARTINELLI 96' WINNER", venue:"KANSAS CITY STADIUM", espnId:760487,
    d:{ goals:[{t:"jpn",p:"Kaishu Sano",m:29},{t:"bra",p:"Casemiro",m:56},{t:"bra",p:"Martinelli",m:96}],
        stats:{pos:[58,42],sh:[17,9],sot:[7,4]}, motm:{t:"bra",p:"Gabriel Martinelli"},
        sum:"Sano stunned Brazil from distance; Casemiro's header levelled it and Martinelli poked home in the sixth minute of stoppage time to spare the Seleção a scare." } },
  { id:"r32-11", round:"R32", date:"JUL 1", a:"eng", b:"cod", sa:2, sb:1, status:"played", note:"KANE LATE DOUBLE", venue:"MIAMI STADIUM", espnId:760495,
    d:{ goals:[{t:"cod",p:"Brian Cipenga",m:7},{t:"eng",p:"Kane",m:75},{t:"eng",p:"Kane",m:86}],
        stats:{pos:[60,40],sh:[16,7],sot:[7,2],xg:[2.43,0.99]}, motm:{t:"eng",p:"Harry Kane"},
        sum:"DR Congo led from the 7th minute and held out until Kane headed in substitute Anthony Gordon's cross with a quarter of an hour left, then rifled a stunning 86th-minute winner to complete the comeback." } },
  { id:"r32-12", round:"R32", date:"JUN 30", a:"mex", b:"ecu", sa:2, sb:0, status:"played", note:"MEXICO BREAK A 40-YEAR KNOCKOUT DROUGHT", venue:"MEXICO CITY (AZTECA)", espnId:760491,
    d:{ goals:[{t:"mex",p:"Quiñones",m:22},{t:"mex",p:"Raúl Jiménez",m:31}], stats:{pos:[52,37],sh:[15,7],sot:[3,1],xg:[1.02,0.73]},
        motm:{t:"mex",p:"Julián Quiñones"}, sum:"Quiñones opened the scoring and teed up Jiménez for the second as the co-hosts — six shots inside the first 15 minutes — kept a clean sheet to reach the last 16 for the first time since 1986." } },
  { id:"r32-13", round:"R32", date:"JUL 3", a:"arg", b:"cpv", sa:3, sb:2, status:"played", note:"AET — CHAMPIONS SURVIVE A HUGE SCARE", venue:"MIAMI STADIUM", espnId:760500,
    d:{ goals:[{t:"arg",p:"Messi",m:29},{t:"cpv",p:"Deroy Duarte",m:58},{t:"arg",p:"Lisandro Martínez",m:91},{t:"cpv",p:"Lopes Cabral",m:103},{t:"cpv",p:"Diney Borges",m:111,og:true}],
        stats:{pos:[59,34],sh:[22,16],sot:[12,5],xg:[2.16,0.45]}, motm:{t:"arg",p:"Lionel Messi"},
        sum:"Messi's 20th World Cup goal — extending his own all-time record — put Argentina ahead, but debutants Cape Verde twice hit back. The eventual winner in extra time was an own goal, deflecting in off Diney Borges as he contested a Messi set piece with Cristian Romero. No.67-ranked Cape Verde came within a whisker of the biggest upset in World Cup knockout history." } },
  { id:"r32-14", round:"R32", date:"JUL 1", a:"aus", b:"egy", sa:1, sb:1, status:"played", note:"EGYPT WIN 4-2 ON PENS", venue:"DALLAS STADIUM", espnId:760499,
    d:{ goals:[{t:"egy",p:"Emam Ashour",m:13},{t:"egy",p:"Mohamed Hany",m:55,og:true}], pens:"Egypt won 4-2 on penalties (Souttar and Herrington missed for Australia)",
        stats:{pos:[35,53],sh:[16,14],sot:[2,4],xg:[0.87,1.36]}, motm:{t:"egy",p:"Mohamed Salah"},
        sum:"Ashour's early strike was undone by his own side's own goal, but Egypt held their nerve from the spot — Salah among the scorers — to reach the last 16." } },
  { id:"r32-15", round:"R32", date:"JUL 3", a:"sui", b:"alg", sa:2, sb:0, status:"played", note:"NDOYE'S 45+1' GOAL — FASTEST 2ND-HALF WC KNOCKOUT GOAL SINCE 1998", venue:"HOUSTON STADIUM", espnId:760498,
    d:{ goals:[{t:"sui",p:"Embolo",m:10},{t:"sui",p:"Ndoye",m:46}], stats:{pos:[44,56],sh:[11,8],sot:[5,2],xg:[2.52,0.73]},
        motm:{t:"sui",p:"Breel Embolo"}, sum:"Algeria had more of the ball (56%) but Switzerland's clinical edge (2.52 xG to 0.73) told — their first knockout-stage progression since 1938." } },
  { id:"r32-16", round:"R32", date:"JUL 3", a:"col", b:"gha", sa:1, sb:0, status:"played", venue:"KANSAS CITY STADIUM", espnId:760501,
    d:{ goals:[{t:"col",p:"Jhon Arias",m:14}], stats:{pos:[61,39],sh:[18,8],sot:[7,0],xg:[2.19,0.26]},
        motm:{t:"col",p:"Jhon Arias"}, sum:"Arias' early strike was all Colombia needed — they dominated territory and denied Ghana a single shot on target all match." } },

  /* Round of 16 — Jul 4–7 */
  { id:"r16-1", round:"R16", date:"JUL 4", a:"fra", b:"par", sa:1, sb:0, status:"played", venue:"PHILADELPHIA STADIUM", espnId:760503,
    d:{ goals:[{t:"fra",p:"Mbappé",m:70,pen:true}], stats:{pos:[76,24],sh:[15,5],sot:[5,1],xg:[1.36,0.15]}, motm:{t:"fra",p:"Kylian Mbappé"},
        sum:"France dominated (76% possession, 552 passes to Paraguay's 175) but couldn't break through open play. Mbappé's 70th-minute penalty was enough — France still haven't conceded a knockout-stage goal." } },
  { id:"r16-2", round:"R16", date:"JUL 4", a:"can", b:"mar", sa:0, sb:3, status:"played", venue:"HOUSTON STADIUM", espnId:760502,
    d:{ goals:[{t:"mar",p:"Ounahi",m:50},{t:"mar",p:"Rahimi",m:78},{t:"mar",p:"Ounahi",m:82}],
        stats:{pos:[37,50],sh:[10,5],sot:[3,4],xg:[0.78,0.85]}, motm:{t:"mar",p:"Azzedine Ounahi"},
        sum:"Ounahi's brace either side of a Rahimi strike ended the co-hosts' dream — remarkably, Morocco won it with just 5 shots, the fewest by a winning knockout side since 1966." } },
  { id:"r16-3", round:"R16", date:"JUL 5", a:"mex", b:"eng", sa:2, sb:3, status:"played", note:"BELLINGHAM ×2 IN 98 SECONDS · KANE PEN · QUANSAH RED", venue:"MEXICO CITY (AZTECA)", espnId:760505,
    d:{ goals:[{t:"eng",p:"Bellingham",m:36},{t:"eng",p:"Bellingham",m:38},{t:"mex",p:"Quiñones",m:42},{t:"eng",p:"Kane",m:60,pen:true},{t:"mex",p:"Raúl Jiménez",m:69,pen:true}],
        cards:[{t:"eng",p:"Quansah",m:52,c:"R"}], stats:{pos:[67,33],sh:[20,6],sot:[5,5],xg:[1.94,1.55]}, motm:{t:"eng",p:"Jude Bellingham"},
        sum:"Bellingham scored twice in 98 seconds — the first World Cup brace at the Azteca since Maradona in '86. England had just 33% possession, their lowest in a World Cup match since 1966, but the Three Lions survived 40+ minutes a man down after Quansah's red card to win an instant classic." } },
  { id:"r16-4", round:"R16", date:"JUL 5", a:"bra", b:"nor", sa:1, sb:2, status:"played", note:"HAALAND BRACE 79' 90' — BRAZIL OUT!", venue:"NEW YORK NEW JERSEY STADIUM", espnId:760504,
    d:{ goals:[{t:"nor",p:"Haaland",m:79},{t:"nor",p:"Haaland",m:90},{t:"bra",p:"Neymar",m:100,pen:true}],
        stats:{pos:[66,34],sh:[9,5],xg:[2.73,0.84]}, motm:{t:"nor",p:"Erling Haaland"},
        sum:"Brazil had 66% possession and dominated for long stretches — Norway keeper Ørjan Nyland even saved a first-half Bruno Guimarães penalty — but Haaland's second-half brace sent Norway to their first-ever World Cup quarterfinal. Neymar's stoppage-time penalty, possibly his final act for the Seleção, arrived too late." } },
  { id:"r16-5", round:"R16", date:"JUL 6", a:"por", b:"esp", sa:0, sb:1, status:"played", note:"MERINO 90+1' WINNER · RONALDO'S WORLD CUP CAREER ENDS", venue:"DALLAS STADIUM", espnId:760506,
    d:{ goals:[{t:"esp",p:"Mikel Merino",m:91}], stats:{pos:[44,56],sh:[9,15],sot:[2,6],xg:[0.56,1.77]}, motm:{t:"esp",p:"Mikel Merino"},
        sum:"An Iberian derby settled at the death: Ferran Torres slipped in Mikel Merino to score in the first minute of stoppage time and send the Euro champions through. Portugal managed just 0.56 xG, and the final whistle ended Cristiano Ronaldo's record sixth and final World Cup without the trophy that always eluded him." } },
  { id:"r16-6", round:"R16", date:"JUL 6", a:"usa", b:"bel", sa:1, sb:4, status:"played", note:"DE KETELAERE ×2 — LAST HOST FALLS", venue:"SEATTLE STADIUM", espnId:760507,
    d:{ goals:[{t:"bel",p:"De Ketelaere",m:9},{t:"usa",p:"Tillman",m:31},{t:"bel",p:"De Ketelaere",m:33},{t:"bel",p:"Vanaken",m:57},{t:"bel",p:"Lukaku",m:93}],
        stats:{sh:[7,15],xg:[0.67,2.15]}, motm:{t:"bel",p:"Charles De Ketelaere"},
        sum:"The last host standing fell hard. De Ketelaere struck twice in the first half — his second just two minutes after Tillman's equaliser — and Vanaken and Lukaku added gloss. Belgium's clinical finishing (2.15 xG to 0.67) ended the USA's home World Cup in the Round of 16." } },
  { id:"r16-7", round:"R16", date:"JUL 7", a:"arg", b:"egy", sa:3, sb:2, status:"played", note:"MESSI-INSPIRED COMEBACK FROM 2-0 DOWN · ENZO 90+2' WINNER", venue:"ATLANTA STADIUM", espnId:760509,
    d:{ goals:[{t:"egy",p:"Yasser Ibrahim",m:15},{t:"egy",p:"Zizo",m:67},{t:"arg",p:"Cristian Romero",m:79},{t:"arg",p:"Messi",m:83},{t:"arg",p:"Enzo Fernández",m:92}],
        stats:{sh:[19,5],xg:[2.8,0.98]}, motm:{t:"arg",p:"Lionel Messi"},
        sum:"Two-nil down and staring at the exit, the champions roared back. Messi — who had a first-half penalty saved by Shobeir — headed on for Romero on 79', rifled in an equaliser on 83', then teed up Enzo Fernández's 90+2' winner. Messi's 8th goal moved him clear as the tournament's top scorer in a record sixth straight World Cup knockout appearance." } },
  { id:"r16-8", round:"R16", date:"JUL 7", a:"sui", b:"col", sa:0, sb:0, status:"played", note:"SWITZERLAND WIN 4-3 ON PENALTIES", venue:"VANCOUVER BC PLACE", espnId:760508,
    d:{ pens:"Switzerland won 4-3 on penalties", motm:{t:"sui",p:"Gregor Kobel (GK)"},
        sum:"A goalless, cagey 120 minutes in Vancouver went to a shootout, where Ruben Vargas slotted the decisive spot-kick to send Switzerland into their first World Cup quarterfinal since 1954 — and a date with Messi's Argentina." } },

  /* Quarterfinals — Jul 9–12 */
  { id:"qf-1", round:"QF", date:"JUL 9", a:"fra", b:"mar", sa:2, sb:0, status:"played", note:"MBAPPÉ & DEMBÉLÉ SEND FRANCE THROUGH", venue:"BOSTON STADIUM", espnId:760510,
    d:{ goals:[{t:"fra",p:"Mbappé",m:60},{t:"fra",p:"Dembélé",m:66}], motm:{t:"fra",p:"Kylian Mbappé"},
        sum:"Mbappé shrugged off a saved first-half penalty to curl in the opener from Doué's pass on 60', then teed up Dembélé six minutes later. France (1.87 xG) reached the semifinals still without conceding a single goal in the knockout stage — and Mbappé moved top of the Golden Boot race on 8, edging Messi on the tiebreaker." } },
  { id:"qf-2", round:"QF", date:"JUL 10", a:"esp", b:"bel", sa:2, sb:1, status:"played", note:"SUPER-SUB MERINO'S LATE WINNER — AGAIN", venue:"LOS ANGELES STADIUM", espnId:760511,
    d:{ goals:[{t:"esp",p:"Fabián Ruiz"},{t:"bel",p:"De Ketelaere"},{t:"esp",p:"Mikel Merino",m:88}], motm:{t:"esp",p:"Mikel Merino"},
        sum:"Fabián Ruiz's opener was cancelled out by De Ketelaere, but Mikel Merino struck again — the substitute netting a late winner within minutes of coming on, just as he did against Portugal in the last 16. The Euro champions march into a semifinal against France." } },
  { id:"qf-3", round:"QF", date:"JUL 11", a:"nor", b:"eng", sa:1, sb:2, status:"played", note:"AET — BELLINGHAM RESCUES ENGLAND AGAIN", venue:"MIAMI STADIUM", espnId:760512,
    d:{ goals:[{t:"nor",p:"Schjelderup",m:36},{t:"eng",p:"Bellingham",m:45},{t:"eng",p:"Bellingham",m:93}], motm:{t:"eng",p:"Jude Bellingham"},
        sum:"Schjelderup's cross-shot put Norway ahead, but Bellingham struck in first-half stoppage time and again three minutes into extra time — pouncing on a spilled Rogers shot — to send England to their first semifinal since 2018. Haaland was kept quiet; his tournament ends on 7 goals." } },
  { id:"qf-4", round:"QF", date:"JUL 11", a:"arg", b:"sui", sa:3, sb:1, status:"played", note:"AET — ÁLVAREZ GOLAZO · EMBOLO RED", venue:"KANSAS CITY STADIUM", espnId:760513,
    d:{ goals:[{t:"arg",p:"Mac Allister",m:10},{t:"sui",p:"Ndoye",m:67},{t:"arg",p:"Julián Álvarez",m:112},{t:"arg",p:"Lautaro Martínez"}],
        cards:[{t:"sui",p:"Embolo",m:72,c:"R"}], motm:{t:"arg",p:"Julián Álvarez"},
        sum:"Mac Allister's early goal was cancelled out by Ndoye, but 10-man Switzerland — Embolo sent off on a second yellow for simulation — couldn't hold on. Álvarez settled it with a 112th-minute stunner and Lautaro Martínez added a third, booking a blockbuster semifinal against England." } },

  /* Semifinals & Final */
  { id:"sf-1", round:"SF", date:"JUL 14", a:"fra", b:"esp", sa:0, sb:2, status:"played", note:"SPAIN END FRANCE'S UNBEATEN RUN — INTO THE FINAL", venue:"DALLAS STADIUM", espnId:760514,
    d:{ goals:[{t:"esp",p:"Oyarzabal",m:22,pen:true},{t:"esp",p:"Pedro Porro",m:58}], motm:{t:"esp",p:"Lamine Yamal"},
        sum:"The Euro champions dethroned the tournament favourites. Oyarzabal converted a penalty won by the brilliant Lamine Yamal on 22', and Porro doubled it on 58' off a one-two with Dani Olmo. France — who hadn't conceded a single goal in the knockouts — were held to 0.04 xG in a chastening first half (and lost Saliba to injury), as Spain reached their first World Cup final since 2010." } },
  { id:"sf-2", round:"SF", date:"JUL 15", a:"arg", b:"eng", sa:2, sb:1, status:"played", note:"MESSI-INSPIRED LATE COMEBACK — ARGENTINA REACH THE FINAL", venue:"ATLANTA STADIUM", espnId:760515,
    d:{ goals:[{t:"eng",p:"Anthony Gordon",m:55},{t:"arg",p:"Enzo Fernández",m:85},{t:"arg",p:"Lautaro Martínez",m:90}], motm:{t:"arg",p:"Lionel Messi"},
        sum:"Gordon's second-half strike had England 45 minutes from the final, but Messi took over — assisting Enzo Fernández's 85th-minute equaliser and then Lautaro Martínez's late winner. The defending champions are back in the final, chasing the first back-to-back World Cup since Brazil in 1962." } },
  { id:"f-3rd", round:"3RD", date:"JUL 18", a:"fra", b:"eng", sa:4, sb:6, status:"played", note:"10-GOAL THRILLER · SAKA HAT-TRICK · ENGLAND TAKE BRONZE", venue:"MIAMI STADIUM", espnId:760516,
    d:{ goals:[{t:"eng",p:"Rice",m:3},{t:"eng",p:"Konsa"},{t:"eng",p:"Saka"},{t:"eng",p:"Saka"},{t:"eng",p:"Saka"},{t:"eng",p:"Bellingham"},{t:"fra",p:"Mbappé"},{t:"fra",p:"Mbappé"},{t:"fra",p:"Dembélé"},{t:"fra",p:"Barcola"}],
        motm:{t:"eng",p:"Bukayo Saka"},
        sum:"The most goals in a World Cup match since 1982. Rice and Konsa put England 2-0 up, Saka completed a hat-trick and Bellingham iced it — his 7th goal, a England record for a single World Cup. France raged back through a Mbappé brace (taking him clear atop the Golden Boot on 10) plus Dembélé and Barcola, but England took the bronze — their best World Cup finish since winning it in 1966." } },
  { id:"f-1", round:"FINAL", date:"JUL 19", a:"esp", b:"arg", sa:1, sb:0, status:"played", note:"🏆 AET — FERRAN TORRES WINS SPAIN A SECOND WORLD CUP", venue:"NEW YORK NEW JERSEY STADIUM", espnId:760517,
    d:{ goals:[{t:"esp",p:"Ferran Torres",m:106}], motm:{t:"esp",p:"Ferran Torres"},
        sum:"SPAIN ARE WORLD CHAMPIONS. La Roja suffocated Argentina for 120 minutes — limiting the defending champions to just two shots — before substitute Ferran Torres, only the second sub ever to score a World Cup final winner, tucked home an 8-yard strike in the 106th minute. It is Spain's second world title (first since 2010) and the crowning of a new golden generation led by Lamine Yamal. Lionel Messi's likely final tournament ended in defeat as Argentina lost a record-equalling fourth final and fell short of back-to-back crowns." } }
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
  { t:"esp", line:"WON",   tier:"FINALIST",   note:"🏆 WORLD CHAMPIONS — beat Argentina 1-0 (AET)" },
  { t:"arg", line:"2nd",   tier:"FINALIST",   note:"Runners-up — fell to Ferran Torres' extra-time winner" }
];

/* ---- Live banner ---- */
const LIVE_TODAY = {
  label: "🏆 SPAIN ARE WORLD CHAMPIONS!",
  items: [
    "FINAL: SPAIN 1-0 ARGENTINA (AET) — Ferran Torres' 106' winner seals La Roja's second World Cup",
    "🥉 England beat France 6-4 for bronze · Mbappé wins the Golden Boot on 10",
    "That's a wrap on the 2026 FIFA World Cup — thanks for playing! ⚽"
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
  { y:2022, w:"Argentina 🇦🇷", note:"Messi completes football. Greatest final ever" },
  { y:2026, w:"Spain 🇪🇸", note:"Ferran Torres' extra-time winner downs Messi's Argentina — La Roja's 2nd" }
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
  "🏆 CHAMPIONS: SPAIN — their 2nd World Cup, beating Argentina 1-0 (AET) on Ferran Torres' 106' winner.",
  "First 48-team World Cup — expanded from 32. 104 matches, the most ever.",
  "First World Cup hosted by THREE nations: Canada, Mexico and the USA (16 host cities).",
  "Mexico became the first country to host matches at three World Cups (1970, 1986, 2026).",
  "The final: July 19, 2026 at New York New Jersey Stadium (82,500 seats).",
  "Estadio Azteca opened its third World Cup — no other stadium has done that.",
  "Debutants this cycle: Curaçao (smallest WC nation ever), Cape Verde, Jordan, Uzbekistan.",
  "A new round: the Round of 32 — group winners, runners-up and 8 best third-placed teams advance.",
  "Messi (39) and Ronaldo (41) both playing — their SIXTH World Cups, 20 years after their first.",
  "Paraguay's win over Germany earned a national holiday back home.",
  "Kylian Mbappé won the 2026 Golden Boot with 10 goals; Messi finished on 8. But Spain lifted the trophy — Ferran Torres the unlikely final hero."
];
