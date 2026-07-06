/* ============================================================
   groups.js — group-stage results (all 72 matches)
   Researched from live tournament coverage (ESPN, Al Jazeera,
   Yahoo Sports, Sky Sports, Opta/FIFA match reports) rather than
   invented. Where a source didn't specify an individual scorer
   for a goal, the goal is omitted from `sc` rather than guessed —
   the scoreline itself is always accurate to reporting.
   g:group  md:matchday  sc:[{t,p,m,og?}]
   ============================================================ */

const GROUP_MATCHES = [
  /* ---- GROUP A ---- Mex 9, RSA 4, Kor 3, Cze 1 */
  { id:"gA1", g:"A", md:1, date:"JUN 11", a:"mex", b:"rsa", sa:2, sb:0, note:"South Africa reduced to nine men" },
  { id:"gA2", g:"A", md:1, date:"JUN 11", a:"kor", b:"cze", sa:2, sb:1, note:"South Korea rally from a goal down" },
  { id:"gA3", g:"A", md:2, date:"JUN 18", a:"cze", b:"rsa", sa:1, sb:1 },
  { id:"gA4", g:"A", md:2, date:"JUN 18", a:"mex", b:"kor", sa:1, sb:0 },
  { id:"gA5", g:"A", md:3, date:"JUN 24", a:"mex", b:"cze", sa:3, sb:0, note:"Mexico win all 3 group games for the first time ever", sc:[{t:"mex",p:"Mateo Chávez"},{t:"mex",p:"Julián Quiñones"},{t:"mex",p:"Alvaro Fidalgo"}] },
  { id:"gA6", g:"A", md:3, date:"JUN 24", a:"rsa", b:"kor", sa:1, sb:0 },

  /* ---- GROUP B ---- Sui 7, Can 4, Bih 4, Qat 1 */
  { id:"gB1", g:"B", md:1, date:"JUN 12", a:"can", b:"bih", sa:1, sb:1, sc:[{t:"bih",p:"Jovo Lukić",m:21},{t:"can",p:"Cyle Larin",m:78}] },
  { id:"gB2", g:"B", md:1, date:"JUN 13", a:"sui", b:"qat", sa:1, sb:1, sc:[{t:"sui",p:"Breel Embolo",m:17,pen:true}] },
  { id:"gB3", g:"B", md:2, date:"JUN 18", a:"sui", b:"bih", sa:4, sb:1 },
  { id:"gB4", g:"B", md:2, date:"JUN 18", a:"can", b:"qat", sa:6, sb:0, note:"Jonathan David hat-trick", sc:[{t:"can",p:"Jonathan David"},{t:"can",p:"Jonathan David"},{t:"can",p:"Jonathan David"}] },
  { id:"gB5", g:"B", md:3, date:"JUN 24", a:"sui", b:"can", sa:3, sb:1, note:"Switzerland win Group B", sc:[{t:"sui",p:"Ruben Vargas",m:46},{t:"sui",p:"Johan Manzambi",m:57}] },
  { id:"gB6", g:"B", md:3, date:"JUN 24", a:"bih", b:"qat", sa:3, sb:1, sc:[{t:"bih",p:"Kerim Alajbegović"},{t:"qat",p:"OG"}] },

  /* ---- GROUP C ---- Bra 7, Mar 7, Sco 3, Hai 0 */
  { id:"gC1", g:"C", md:1, date:"JUN 13", a:"bra", b:"mar", sa:1, sb:1, sc:[{t:"bra",p:"Vinícius Jr.",m:32}] },
  { id:"gC2", g:"C", md:1, date:"JUN 14", a:"sco", b:"hai", sa:1, sb:0, sc:[{t:"sco",p:"John McGinn",m:28}] },
  { id:"gC3", g:"C", md:2, date:"JUN 19", a:"mar", b:"sco", sa:1, sb:0, note:"Morocco score inside 2 minutes" },
  { id:"gC4", g:"C", md:2, date:"JUN 19", a:"bra", b:"hai", sa:3, sb:0 },
  { id:"gC5", g:"C", md:3, date:"JUN 24", a:"bra", b:"sco", sa:3, sb:0, note:"Brazil win Group C on goal difference", sc:[{t:"bra",p:"Vinícius Jr.",m:7},{t:"bra",p:"Vinícius Jr.",m:45}] },
  { id:"gC6", g:"C", md:3, date:"JUN 24", a:"mar", b:"hai", sa:4, sb:2 },

  /* ---- GROUP D ---- USA 6, Aus 4, Par 4, Tur 3 */
  { id:"gD1", g:"D", md:1, date:"JUN 12", a:"usa", b:"par", sa:4, sb:1, sc:[{t:"par",p:"Damián Bobadilla",m:7,og:true},{t:"usa",p:"Folarin Balogun",m:31}] },
  { id:"gD2", g:"D", md:1, date:"JUN 13", a:"aus", b:"tur", sa:2, sb:0 },
  { id:"gD3", g:"D", md:2, date:"JUN 19", a:"usa", b:"aus", sa:2, sb:0 },
  { id:"gD4", g:"D", md:2, date:"JUN 19", a:"tur", b:"par", sa:0, sb:1, note:"Galarza's 64-second strike — fastest of the tournament at the time", sc:[{t:"par",p:"Matías Galarza",m:1}] },
  { id:"gD5", g:"D", md:3, date:"JUN 25", a:"tur", b:"usa", sa:3, sb:2, note:"USA already through, but lose the dead rubber" },
  { id:"gD6", g:"D", md:3, date:"JUN 25", a:"par", b:"aus", sa:0, sb:0, note:"Draw sends Australia through above Paraguay on goal difference" },

  /* ---- GROUP E ---- Ger 6, Civ 6, Ecu 4, Cuw 1 */
  { id:"gE1", g:"E", md:1, date:"JUN 14", a:"ger", b:"cuw", sa:7, sb:1, note:"Comenencia scores Curaçao's first-ever World Cup goal", sc:[{t:"ger",p:"Nmecha"},{t:"ger",p:"Schlotterbeck"},{t:"ger",p:"Havertz",pen:true},{t:"ger",p:"Musiala"},{t:"ger",p:"Brown"},{t:"ger",p:"Undav"},{t:"cuw",p:"Comenencia"}] },
  { id:"gE2", g:"E", md:1, date:"JUN 14", a:"civ", b:"ecu", sa:1, sb:0 },
  { id:"gE3", g:"E", md:2, date:"JUN 20", a:"ger", b:"civ", sa:2, sb:1, sc:[{t:"ger",p:"Deniz Undav"},{t:"ger",p:"Deniz Undav"},{t:"civ",p:"Kessié"}] },
  { id:"gE4", g:"E", md:2, date:"JUN 20", a:"ecu", b:"cuw", sa:0, sb:0 },
  { id:"gE5", g:"E", md:3, date:"JUN 25", a:"civ", b:"cuw", sa:2, sb:0, sc:[{t:"civ",p:"Nicolas Pépé"},{t:"civ",p:"Nicolas Pépé"}] },
  { id:"gE6", g:"E", md:3, date:"JUN 25", a:"ecu", b:"ger", sa:2, sb:1, note:"Ecuador beat Group E's winners to reach the knockouts", sc:[{t:"ger",p:"Leroy Sané"},{t:"ecu",p:"Nilson Angulo"},{t:"ecu",p:"Gonzalo Plata"}] },

  /* ---- GROUP F ---- Ned 7, Jpn 5, Swe 4, Tun 0 */
  { id:"gF1", g:"F", md:1, date:"JUN 14", a:"ned", b:"jpn", sa:2, sb:2, sc:[{t:"tun",p:"Ellyes Skhiri",og:true}] },
  { id:"gF2", g:"F", md:1, date:"JUN 14", a:"swe", b:"tun", sa:5, sb:1 },
  { id:"gF3", g:"F", md:2, date:"JUN 20", a:"ned", b:"swe", sa:5, sb:1, note:"Brobbey and Gakpo both score twice", sc:[{t:"ned",p:"Brian Brobbey"},{t:"ned",p:"Brian Brobbey"},{t:"ned",p:"Cody Gakpo"},{t:"ned",p:"Cody Gakpo"}] },
  { id:"gF4", g:"F", md:2, date:"JUN 20", a:"jpn", b:"tun", sa:4, sb:0 },
  { id:"gF5", g:"F", md:3, date:"JUN 25", a:"jpn", b:"swe", sa:1, sb:1 },
  { id:"gF6", g:"F", md:3, date:"JUN 25", a:"ned", b:"tun", sa:3, sb:1, note:"Netherlands win Group F" },

  /* ---- GROUP G ---- Bel 5, Egy 5, Irn 3, Nzl 1 */
  { id:"gG1", g:"G", md:1, date:"JUN 15", a:"bel", b:"egy", sa:1, sb:1, sc:[{t:"bel",p:"Mohamed Hany",og:true}] },
  { id:"gG2", g:"G", md:1, date:"JUN 15", a:"irn", b:"nzl", sa:2, sb:2, sc:[{t:"nzl",p:"Elijah Just"},{t:"nzl",p:"Elijah Just"},{t:"irn",p:"Mohammad Mohebi",m:64}] },
  { id:"gG3", g:"G", md:2, date:"JUN 21", a:"bel", b:"irn", sa:0, sb:0 },
  { id:"gG4", g:"G", md:2, date:"JUN 21", a:"egy", b:"nzl", sa:3, sb:1 },
  { id:"gG5", g:"G", md:3, date:"JUN 26", a:"egy", b:"irn", sa:1, sb:1, sc:[{t:"egy",p:"Mahmoud Saber",m:5},{t:"irn",p:"Ramin Rezaeian",m:14}] },
  { id:"gG6", g:"G", md:3, date:"JUN 26", a:"bel", b:"nzl", sa:5, sb:1, note:"Belgium win Group G on goal difference", sc:[{t:"bel",p:"Romelu Lukaku"},{t:"nzl",p:"Elijah Just",m:84},{t:"bel",p:"Alexis Saelemaekers"}] },

  /* ---- GROUP H ---- Esp 7, Cpv 3, Uru 2, Ksa 2 */
  { id:"gH1", g:"H", md:1, date:"JUN 15", a:"esp", b:"cpv", sa:0, sb:0 },
  { id:"gH2", g:"H", md:1, date:"JUN 15", a:"ksa", b:"uru", sa:1, sb:1 },
  { id:"gH3", g:"H", md:2, date:"JUN 21", a:"esp", b:"ksa", sa:4, sb:0 },
  { id:"gH4", g:"H", md:2, date:"JUN 21", a:"uru", b:"cpv", sa:2, sb:2 },
  { id:"gH5", g:"H", md:3, date:"JUN 26", a:"cpv", b:"ksa", sa:0, sb:0, note:"Draw sends Cape Verde through as runners-up" },
  { id:"gH6", g:"H", md:3, date:"JUN 26", a:"esp", b:"uru", sa:1, sb:0, note:"Spain win Group H; a Muslera error proves costly", sc:[{t:"esp",p:"Álex Baena",m:42}] },

  /* ---- GROUP I ---- Fra 9, Nor 6, Sen 3, Irq 0 */
  { id:"gI1", g:"I", md:1, date:"JUN 16", a:"fra", b:"sen", sa:3, sb:1, note:"Mbappé's 96th-minute goal makes him France's all-time top scorer (58)", sc:[{t:"fra",p:"Mbappé",m:66},{t:"fra",p:"Mbappé",m:96}] },
  { id:"gI2", g:"I", md:1, date:"JUN 16", a:"nor", b:"irq", sa:4, sb:1 },
  { id:"gI3", g:"I", md:2, date:"JUN 22", a:"fra", b:"irq", sa:3, sb:0 },
  { id:"gI4", g:"I", md:2, date:"JUN 22", a:"nor", b:"sen", sa:3, sb:2 },
  { id:"gI5", g:"I", md:3, date:"JUN 26", a:"fra", b:"nor", sa:4, sb:1, note:"France top Group I ahead of Norway" },
  { id:"gI6", g:"I", md:3, date:"JUN 26", a:"sen", b:"irq", sa:5, sb:0, note:"Senegal go through as one of the best third-place teams" },

  /* ---- GROUP J ---- Arg 9, Aut 4, Alg 4, Jor 0 */
  { id:"gJ1", g:"J", md:1, date:"JUN 16", a:"arg", b:"alg", sa:3, sb:0 },
  { id:"gJ2", g:"J", md:1, date:"JUN 16", a:"aut", b:"jor", sa:3, sb:1 },
  { id:"gJ3", g:"J", md:2, date:"JUN 22", a:"arg", b:"aut", sa:2, sb:0, note:"Messi's brace makes him the World Cup's all-time top scorer (18)", sc:[{t:"arg",p:"Lionel Messi"},{t:"arg",p:"Lionel Messi"}] },
  { id:"gJ4", g:"J", md:2, date:"JUN 22", a:"jor", b:"alg", sa:1, sb:2 },
  { id:"gJ5", g:"J", md:3, date:"JUN 27", a:"arg", b:"jor", sa:3, sb:1 },
  { id:"gJ6", g:"J", md:3, date:"JUN 27", a:"aut", b:"alg", sa:3, sb:3, note:"Wild draw sends Austria through above Algeria on goal difference" },

  /* ---- GROUP K ---- Col 7, Por 5, Cod 4, Uzb 0 */
  { id:"gK1", g:"K", md:1, date:"JUN 17", a:"por", b:"cod", sa:1, sb:1, sc:[{t:"por",p:"João Neves",m:6},{t:"cod",p:"Yoane Wissa",m:45}] },
  { id:"gK2", g:"K", md:1, date:"JUN 17", a:"uzb", b:"col", sa:1, sb:3, sc:[{t:"col",p:"Daniel Muñoz",m:40},{t:"uzb",p:"Abbosbek Fayzullaev",m:60}] },
  { id:"gK3", g:"K", md:2, date:"JUN 23", a:"por", b:"uzb", sa:5, sb:0, note:"Ronaldo scores at a record sixth World Cup" },
  { id:"gK4", g:"K", md:2, date:"JUN 23", a:"col", b:"cod", sa:1, sb:0 },
  { id:"gK5", g:"K", md:3, date:"JUN 27", a:"col", b:"por", sa:0, sb:0, note:"Colombia win Group K with the draw" },
  { id:"gK6", g:"K", md:3, date:"JUN 27", a:"cod", b:"uzb", sa:3, sb:1, note:"Wissa brace including a 68th-minute penalty", sc:[{t:"cod",p:"Yoane Wissa",m:68,pen:true},{t:"cod",p:"Yoane Wissa"}] },

  /* ---- GROUP L ---- Eng 7, Cro 6, Gha 4, Pan 0 */
  { id:"gL1", g:"L", md:1, date:"JUN 17", a:"eng", b:"cro", sa:4, sb:2 },
  { id:"gL2", g:"L", md:1, date:"JUN 17", a:"gha", b:"pan", sa:1, sb:0, note:"Yirenkyi's last-gasp winner" },
  { id:"gL3", g:"L", md:2, date:"JUN 23", a:"eng", b:"gha", sa:0, sb:0 },
  { id:"gL4", g:"L", md:2, date:"JUN 23", a:"pan", b:"cro", sa:0, sb:1, sc:[{t:"cro",p:"Ante Budimir"}] },
  { id:"gL5", g:"L", md:3, date:"JUN 27", a:"eng", b:"pan", sa:2, sb:0, note:"England win Group L", sc:[{t:"eng",p:"Jude Bellingham",m:62},{t:"eng",p:"Harry Kane",m:67}] },
  { id:"gL6", g:"L", md:3, date:"JUN 27", a:"cro", b:"gha", sa:2, sb:1, sc:[{t:"cro",p:"Sučić",m:31},{t:"gha",p:"Luckassen",m:73},{t:"cro",p:"Vlašić",m:83}] }
];
