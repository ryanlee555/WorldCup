/* ============================================================
   groups.js — group-stage results (all 72 matches)
   Curated data patch. Scorelines are consistent with the final
   group standings in tournament.js. Goal detail is best-effort
   (real squads, representative scorers/minutes) — easy to edit.
   g:group  md:matchday  sc:[{t,p,m,pen?,og?}]
   ============================================================ */

const GROUP_MATCHES = [
  /* ---- GROUP A ---- Mex 9, RSA 4, Kor 3, Cze 1 */
  { id:"gA1", g:"A", md:1, a:"mex", b:"kor", sa:2, sb:0, sc:[{t:"mex",p:"S. Giménez",m:22},{t:"mex",p:"Raúl Jiménez",m:70}] },
  { id:"gA2", g:"A", md:1, a:"rsa", b:"cze", sa:1, sb:1, sc:[{t:"rsa",p:"Percy Tau",m:20},{t:"cze",p:"Schick",m:60}] },
  { id:"gA3", g:"A", md:2, a:"mex", b:"cze", sa:1, sb:0, sc:[{t:"mex",p:"Quiñones",m:55}] },
  { id:"gA4", g:"A", md:2, a:"rsa", b:"kor", sa:2, sb:1, sc:[{t:"rsa",p:"Percy Tau",m:30},{t:"rsa",p:"Mokoena",m:75},{t:"kor",p:"Son",m:88}] },
  { id:"gA5", g:"A", md:3, a:"mex", b:"rsa", sa:3, sb:1, note:"Host nation seals top spot", sc:[{t:"mex",p:"Raúl Jiménez",m:12},{t:"mex",p:"S. Giménez",m:40},{t:"mex",p:"Vásquez",m:66},{t:"rsa",p:"Percy Tau",m:80}] },
  { id:"gA6", g:"A", md:3, a:"kor", b:"cze", sa:2, sb:1, sc:[{t:"kor",p:"Son",m:15},{t:"kor",p:"Hwang",m:50},{t:"cze",p:"Hložek",m:70}] },

  /* ---- GROUP B ---- Sui 7, Can 4, Bih 3, Qat 3 */
  { id:"gB1", g:"B", md:1, a:"sui", b:"qat", sa:2, sb:0, sc:[{t:"sui",p:"Embolo",m:30},{t:"sui",p:"Ndoye",m:66}] },
  { id:"gB2", g:"B", md:1, a:"bih", b:"can", sa:1, sb:0, note:"Dragons stun the co-hosts", sc:[{t:"bih",p:"Demirović",m:71}] },
  { id:"gB3", g:"B", md:2, a:"sui", b:"can", sa:1, sb:1, sc:[{t:"sui",p:"Vargas",m:55},{t:"can",p:"Jonathan David",m:78}] },
  { id:"gB4", g:"B", md:2, a:"qat", b:"bih", sa:2, sb:1, sc:[{t:"qat",p:"Akram Afif",m:33},{t:"qat",p:"Almoez Ali",m:70},{t:"bih",p:"Džeko",m:50}] },
  { id:"gB5", g:"B", md:3, a:"sui", b:"bih", sa:2, sb:1, sc:[{t:"sui",p:"Embolo",m:12},{t:"sui",p:"Shaqiri",m:60},{t:"bih",p:"Džeko",m:84}] },
  { id:"gB6", g:"B", md:3, a:"can", b:"qat", sa:3, sb:0, note:"David & Larin fire Canada through", sc:[{t:"can",p:"Jonathan David",m:20},{t:"can",p:"Larin",m:45},{t:"can",p:"Buchanan",m:66}] },

  /* ---- GROUP C ---- Bra 7, Mar 7, Hai 1, Sco 1 */
  { id:"gC1", g:"C", md:1, a:"bra", b:"mar", sa:1, sb:1, note:"Group of the round openers trade blows", sc:[{t:"bra",p:"Vinícius Jr.",m:33},{t:"mar",p:"En-Nesyri",m:55}] },
  { id:"gC2", g:"C", md:1, a:"hai", b:"sco", sa:1, sb:1, sc:[{t:"hai",p:"Nazon",m:44},{t:"sco",p:"McGinn",m:77}] },
  { id:"gC3", g:"C", md:2, a:"bra", b:"hai", sa:3, sb:0, sc:[{t:"bra",p:"Raphinha",m:20},{t:"bra",p:"Vinícius Jr.",m:50},{t:"bra",p:"Rodrygo",m:75}] },
  { id:"gC4", g:"C", md:2, a:"mar", b:"sco", sa:2, sb:0, sc:[{t:"mar",p:"Hakimi",m:30},{t:"mar",p:"Rahimi",m:66}] },
  { id:"gC5", g:"C", md:3, a:"bra", b:"sco", sa:2, sb:0, sc:[{t:"bra",p:"Casemiro",m:40},{t:"bra",p:"Martinelli",m:80}] },
  { id:"gC6", g:"C", md:3, a:"mar", b:"hai", sa:2, sb:1, sc:[{t:"mar",p:"Brahim Díaz",m:25},{t:"mar",p:"Ounahi",m:70},{t:"hai",p:"Nazon",m:60}] },

  /* ---- GROUP D ---- USA 6, Par 5, Aus 4, Tur 1 */
  { id:"gD1", g:"D", md:1, a:"par", b:"usa", sa:3, sb:2, note:"Paraguay shock the hosts on opening night", sc:[{t:"par",p:"Almirón",m:20},{t:"usa",p:"Pulisic",m:40},{t:"par",p:"Enciso",m:55},{t:"usa",p:"Balogun",m:70},{t:"par",p:"Sanabria",m:80}] },
  { id:"gD2", g:"D", md:1, a:"aus", b:"tur", sa:2, sb:1, sc:[{t:"aus",p:"Duke",m:40},{t:"aus",p:"Irvine",m:70},{t:"tur",p:"Aktürkoğlu",m:88}] },
  { id:"gD3", g:"D", md:2, a:"usa", b:"aus", sa:2, sb:0, sc:[{t:"usa",p:"Pulisic",m:33},{t:"usa",p:"Weah",m:66}] },
  { id:"gD4", g:"D", md:2, a:"par", b:"tur", sa:1, sb:1, sc:[{t:"par",p:"Almirón",m:30},{t:"tur",p:"Yıldız",m:80}] },
  { id:"gD5", g:"D", md:3, a:"usa", b:"tur", sa:2, sb:1, note:"USA clinch Group D", sc:[{t:"usa",p:"Balogun",m:25},{t:"usa",p:"Reyna",m:70},{t:"tur",p:"Arda Güler",m:50}] },
  { id:"gD6", g:"D", md:3, a:"par", b:"aus", sa:1, sb:1, sc:[{t:"par",p:"Sanabria",m:60},{t:"aus",p:"Duke",m:75}] },

  /* ---- GROUP E ---- Ger 9, Ecu 4, Civ 2, Cuw 1 */
  { id:"gE1", g:"E", md:1, a:"ger", b:"ecu", sa:2, sb:1, sc:[{t:"ger",p:"Musiala",m:30},{t:"ger",p:"Havertz",m:66},{t:"ecu",p:"Kendry Páez",m:50}] },
  { id:"gE2", g:"E", md:1, a:"civ", b:"cuw", sa:1, sb:1, note:"Curaçao's tiny nation earns a historic point", sc:[{t:"civ",p:"Haller",m:40},{t:"cuw",p:"Bacuna",m:70}] },
  { id:"gE3", g:"E", md:2, a:"ger", b:"civ", sa:2, sb:0, sc:[{t:"ger",p:"Wirtz",m:25},{t:"ger",p:"Füllkrug",m:60}] },
  { id:"gE4", g:"E", md:2, a:"ecu", b:"cuw", sa:2, sb:0, sc:[{t:"ecu",p:"Valencia",m:35},{t:"ecu",p:"Kendry Páez",m:75}] },
  { id:"gE5", g:"E", md:3, a:"ger", b:"cuw", sa:1, sb:0, sc:[{t:"ger",p:"Musiala",m:55}] },
  { id:"gE6", g:"E", md:3, a:"ecu", b:"civ", sa:1, sb:1, sc:[{t:"ecu",p:"Rodríguez",m:20},{t:"civ",p:"Adingra",m:80}] },

  /* ---- GROUP F ---- Ned 9, Jpn 4, Swe 2, Tun 1 */
  { id:"gF1", g:"F", md:1, a:"ned", b:"jpn", sa:2, sb:1, sc:[{t:"ned",p:"Gakpo",m:30},{t:"ned",p:"Depay",m:66},{t:"jpn",p:"Kubo",m:50}] },
  { id:"gF2", g:"F", md:1, a:"swe", b:"tun", sa:1, sb:1, sc:[{t:"swe",p:"Gyökeres",m:40},{t:"tun",p:"Msakni",m:70}] },
  { id:"gF3", g:"F", md:2, a:"ned", b:"swe", sa:2, sb:0, sc:[{t:"ned",p:"Simons",m:25},{t:"ned",p:"Reijnders",m:60}] },
  { id:"gF4", g:"F", md:2, a:"jpn", b:"tun", sa:2, sb:0, sc:[{t:"jpn",p:"Mitoma",m:35},{t:"jpn",p:"Kubo",m:75}] },
  { id:"gF5", g:"F", md:3, a:"ned", b:"tun", sa:1, sb:0, sc:[{t:"ned",p:"Gakpo",m:55}] },
  { id:"gF6", g:"F", md:3, a:"jpn", b:"swe", sa:1, sb:1, sc:[{t:"jpn",p:"Ito",m:20},{t:"swe",p:"Isak",m:80}] },

  /* ---- GROUP G ---- Bel 9, Egy 4, Irn 2, Nzl 1 */
  { id:"gG1", g:"G", md:1, a:"bel", b:"egy", sa:2, sb:1, note:"De Bruyne vs Salah lives up to it", sc:[{t:"bel",p:"Lukaku",m:30},{t:"bel",p:"Doku",m:66},{t:"egy",p:"Salah",m:50}] },
  { id:"gG2", g:"G", md:1, a:"irn", b:"nzl", sa:1, sb:1, sc:[{t:"irn",p:"Taremi",m:40},{t:"nzl",p:"Chris Wood",m:70}] },
  { id:"gG3", g:"G", md:2, a:"bel", b:"irn", sa:2, sb:0, sc:[{t:"bel",p:"De Bruyne",m:25},{t:"bel",p:"Trossard",m:60}] },
  { id:"gG4", g:"G", md:2, a:"egy", b:"nzl", sa:2, sb:0, sc:[{t:"egy",p:"Salah",m:35},{t:"egy",p:"Marmoush",m:75}] },
  { id:"gG5", g:"G", md:3, a:"bel", b:"nzl", sa:1, sb:0, sc:[{t:"bel",p:"Lukaku",m:55}] },
  { id:"gG6", g:"G", md:3, a:"egy", b:"irn", sa:1, sb:1, sc:[{t:"egy",p:"Trézéguet",m:20},{t:"irn",p:"Azmoun",m:80}] },

  /* ---- GROUP H ---- Esp 9, Cpv 4, Uru 2, Ksa 1 */
  { id:"gH1", g:"H", md:1, a:"esp", b:"cpv", sa:2, sb:1, sc:[{t:"esp",p:"Lamine Yamal",m:30},{t:"esp",p:"Morata",m:66},{t:"cpv",p:"Ryan Mendes",m:50}] },
  { id:"gH2", g:"H", md:1, a:"uru", b:"ksa", sa:1, sb:1, note:"Uruguay stumble out of the blocks", sc:[{t:"uru",p:"Darwin Núñez",m:40},{t:"ksa",p:"Al-Dawsari",m:70}] },
  { id:"gH3", g:"H", md:2, a:"esp", b:"uru", sa:2, sb:0, sc:[{t:"esp",p:"Pedri",m:25},{t:"esp",p:"Oyarzabal",m:60}] },
  { id:"gH4", g:"H", md:2, a:"cpv", b:"ksa", sa:2, sb:0, note:"Blue Sharks roar toward the knockouts", sc:[{t:"cpv",p:"Bebé",m:35},{t:"cpv",p:"Lopes Cabral",m:75}] },
  { id:"gH5", g:"H", md:3, a:"esp", b:"ksa", sa:1, sb:0, sc:[{t:"esp",p:"Nico Williams",m:55}] },
  { id:"gH6", g:"H", md:3, a:"cpv", b:"uru", sa:1, sb:1, note:"Draw sends Cape Verde through, Uruguay out", sc:[{t:"cpv",p:"Deroy Duarte",m:20},{t:"uru",p:"Valverde",m:80}] },

  /* ---- GROUP I ---- Fra 9, Nor 4, Sen 2, Irq 1 */
  { id:"gI1", g:"I", md:1, a:"fra", b:"nor", sa:2, sb:1, note:"Mbappé edges the Haaland duel", sc:[{t:"fra",p:"Mbappé",m:30},{t:"fra",p:"Griezmann",m:66},{t:"nor",p:"Haaland",m:50}] },
  { id:"gI2", g:"I", md:1, a:"sen", b:"irq", sa:1, sb:1, sc:[{t:"sen",p:"Ismaïla Sarr",m:40},{t:"irq",p:"Aymen Hussein",m:70}] },
  { id:"gI3", g:"I", md:2, a:"fra", b:"sen", sa:2, sb:0, sc:[{t:"fra",p:"Dembélé",m:25},{t:"fra",p:"Mbappé",m:60}] },
  { id:"gI4", g:"I", md:2, a:"nor", b:"irq", sa:2, sb:0, sc:[{t:"nor",p:"Haaland",m:35},{t:"nor",p:"Sørloth",m:75}] },
  { id:"gI5", g:"I", md:3, a:"fra", b:"irq", sa:1, sb:0, sc:[{t:"fra",p:"Kolo Muani",m:55}] },
  { id:"gI6", g:"I", md:3, a:"nor", b:"sen", sa:1, sb:1, sc:[{t:"nor",p:"Ødegaard",m:20},{t:"sen",p:"Iliman Ndiaye",m:80}] },

  /* ---- GROUP J ---- Arg 9, Aut 4, Alg 2, Jor 1 */
  { id:"gJ1", g:"J", md:1, a:"arg", b:"aut", sa:2, sb:1, sc:[{t:"arg",p:"Messi",m:30},{t:"arg",p:"J. Álvarez",m:66},{t:"aut",p:"Sabitzer",m:50}] },
  { id:"gJ2", g:"J", md:1, a:"alg", b:"jor", sa:1, sb:1, sc:[{t:"alg",p:"Amoura",m:40},{t:"jor",p:"Al-Naimat",m:70}] },
  { id:"gJ3", g:"J", md:2, a:"arg", b:"alg", sa:2, sb:0, sc:[{t:"arg",p:"L. Martínez",m:25},{t:"arg",p:"Messi",m:60}] },
  { id:"gJ4", g:"J", md:2, a:"aut", b:"jor", sa:2, sb:0, sc:[{t:"aut",p:"Arnautović",m:35},{t:"aut",p:"Baumgartner",m:75}] },
  { id:"gJ5", g:"J", md:3, a:"arg", b:"jor", sa:1, sb:0, sc:[{t:"arg",p:"Mac Allister",m:55}] },
  { id:"gJ6", g:"J", md:3, a:"aut", b:"alg", sa:1, sb:1, sc:[{t:"aut",p:"Gregoritsch",m:20},{t:"alg",p:"Mahrez",m:80}] },

  /* ---- GROUP K ---- Por 9, Col 4, Cod 2, Uzb 1 */
  { id:"gK1", g:"K", md:1, a:"por", b:"col", sa:2, sb:1, sc:[{t:"por",p:"Ronaldo",m:30},{t:"por",p:"Leão",m:66},{t:"col",p:"James Rodríguez",m:50}] },
  { id:"gK2", g:"K", md:1, a:"cod", b:"uzb", sa:1, sb:1, note:"Uzbekistan's debut yields a first point", sc:[{t:"cod",p:"Bakambu",m:40},{t:"uzb",p:"Shomurodov",m:70}] },
  { id:"gK3", g:"K", md:2, a:"por", b:"cod", sa:2, sb:0, sc:[{t:"por",p:"Bernardo Silva",m:25},{t:"por",p:"Gonçalo Ramos",m:60}] },
  { id:"gK4", g:"K", md:2, a:"col", b:"uzb", sa:2, sb:0, sc:[{t:"col",p:"Luis Díaz",m:35},{t:"col",p:"Jhon Durán",m:75}] },
  { id:"gK5", g:"K", md:3, a:"por", b:"uzb", sa:1, sb:0, sc:[{t:"por",p:"Ronaldo",m:55}] },
  { id:"gK6", g:"K", md:3, a:"col", b:"cod", sa:1, sb:1, sc:[{t:"col",p:"Córdoba",m:20},{t:"cod",p:"Wissa",m:80}] },

  /* ---- GROUP L ---- Eng 9, Cro 4, Gha 2, Pan 1 */
  { id:"gL1", g:"L", md:1, a:"eng", b:"cro", sa:2, sb:1, note:"Kane & Bellingham down the 2018 finalists", sc:[{t:"eng",p:"Kane",m:30},{t:"eng",p:"Bellingham",m:66},{t:"cro",p:"Kramarić",m:50}] },
  { id:"gL2", g:"L", md:1, a:"gha", b:"pan", sa:1, sb:1, sc:[{t:"gha",p:"Kudus",m:40},{t:"pan",p:"Ismael Díaz",m:70}] },
  { id:"gL3", g:"L", md:2, a:"eng", b:"gha", sa:2, sb:0, sc:[{t:"eng",p:"Saka",m:25},{t:"eng",p:"Foden",m:60}] },
  { id:"gL4", g:"L", md:2, a:"cro", b:"pan", sa:2, sb:0, sc:[{t:"cro",p:"Budimir",m:35},{t:"cro",p:"Sučić",m:75}] },
  { id:"gL5", g:"L", md:3, a:"eng", b:"pan", sa:1, sb:0, sc:[{t:"eng",p:"Kane",m:55}] },
  { id:"gL6", g:"L", md:3, a:"cro", b:"gha", sa:1, sb:1, sc:[{t:"cro",p:"Kramarić",m:20},{t:"gha",p:"Jordan Ayew",m:80}] }
];
