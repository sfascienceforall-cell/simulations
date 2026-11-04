/* Chimie BA1 · c05 · Thermochimie et spontanéité — contenu SFA original */
(function(){
var R = 8.314;

/* ---------- 1. Cycle de Born–Haber ---------- */
var MET = {Li:{sub:159.4, ie:520.2, r:76}, Na:{sub:107.5, ie:495.8, r:102}, K:{sub:89.0, ie:418.8, r:138}, Cs:{sub:76.5, ie:375.7, r:167}};
var HAL = {F:{at:79.4, ea:-328.0, r:133, nom:"½F₂(g) → F(g)"}, Cl:{at:121.3, ea:-349.0, r:181, nom:"½Cl₂(g) → Cl(g)"}, Br:{at:111.9, ea:-324.6, r:196, nom:"½Br₂(l) → Br(g)"}, I:{at:106.8, ea:-295.2, r:220, nom:"½I₂(s) → I(g)"}};
var DF = {LiF:-616.0,LiCl:-408.6,LiBr:-351.2,LiI:-270.4,NaF:-573.6,NaCl:-411.2,NaBr:-361.1,NaI:-287.8,KF:-568.6,KCl:-436.5,KBr:-393.8,KI:-327.9,CsF:-553.5,CsCl:-443.0,CsBr:-405.8,CsI:-346.6};
function lat(m, x){ var a = MET[m], b = HAL[x]; return a.sub + a.ie + b.at + b.ea - DF[m + x]; }
SFA.sim({
  id:"uc-c05-born-haber", ch:"c05", tag:"Thermochimie",
  titre:"Cycle de Born–Haber : l'énergie réticulaire des halogénures alcalins",
  resume:"Construis le cycle de formation d'un sel MX et déduis l'énergie réticulaire ; observe qu'elle suit environ 1/(r₊ + r₋).",
  but:"Choisis un métal alcalin et un halogène. Le diagramme additionne sublimation, ionisation, atomisation de l'halogène et affinité électronique, puis la formation du réseau ramène à ΔfH°. Le graphique de droite compare les 16 sels.",
  aRetenir:"Loi de Hess : ΔfH°(MX) = ΔsubH(M) + I₁(M) + ΔatH(X) + ΔH<sub>ea</sub>(X) + ΔH<sub>réseau</sub>. L'énergie réticulaire U = −ΔH<sub>réseau</sub> se déduit par différence. Elle croît quand les ions sont petits : U est ≈ proportionnelle à 1/(r₊ + r₋) (loi de Coulomb), d'où LiF &gt; NaF &gt; … &gt; CsI.",
  piege:"Chaque étape a son signe : sublimation, ionisation et atomisation sont endothermiques ; l'affinité électronique du chlore est exothermique (−349 kJ/mol) ; la formation du réseau l'est très fortement. Si ΔfH° d'un sel est très négative, ce n'est pas seulement le réseau : c'est le bilan de tout le cycle. Les valeurs sont des moyennes de tables à 298 K.",
  build:function(k, S){
    var c = k.canvas(400);
    var ms = k.select("Métal alcalin M", [["Li","Li"],["Na","Na"],["K","K"],["Cs","Cs"]], "Na");
    var hs = k.select("Halogène X", [["F","F"],["Cl","Cl"],["Br","Br"],["I","I"]], "Cl");
    var ro = k.readouts(["ΔfH°(MX, s)", "Somme des étapes avant réseau", "Énergie réticulaire U", "r₊ + r₋"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, m = ms.value, x = hs.value, a = MET[m], b = HAL[x], key = m + x;
      c.clear();
      var split = Math.min(W * 0.58, 420);
      var steps = [["M(s) + ½X₂", 0], ["M(g)", a.sub], ["M⁺(g)", a.ie], ["X(g)", b.at], ["X⁻(g)", b.ea], ["MX(s)", 0]];
      var E = [0]; E.push(E[0] + a.sub); E.push(E[1] + a.ie); E.push(E[2] + b.at); E.push(E[3] + b.ea); var Uv = lat(m, x); E.push(E[4] - Uv);
      var emin = Math.min.apply(null, E) - 80, emax = Math.max.apply(null, E) + 80, top = 24, bot = H - 24;
      function Y(e){ return bot - (e - emin) / (emax - emin) * (bot - top); }
      var labels = ["M(s)+½X₂(g)", "M(g)+½X₂", "M⁺(g)+e⁻+½X₂", "M⁺(g)+e⁻+X(g)", "M⁺(g)+X⁻(g)", "MX(s)"];
      var desc = ["", "+ " + S.fmt(a.sub, 1) + " (sublimation)", "+ " + S.fmt(a.ie, 1) + " (I₁)", "+ " + S.fmt(b.at, 1) + " (atomisation X)", S.fmt(b.ea, 1) + " (affinité él.)", "− " + S.fmt(Uv, 0) + " (réseau)"];
      var cw = (split - 40) / 6;
      for (var i = 0; i < 6; i++){
        var x0 = 30 + i * cw, y = Y(E[i]);
        S.draw.line(c, x0, y, x0 + cw - 8, y, i === 5 ? P.red : P.ink, 3);
        S.draw.text(c, labels[i].replace(/M|X/g, function(q){ return q === "M" ? m : x; }), x0 + (cw - 8) / 2, y + (i === 5 ? 14 : -12), {size:9, color:P.grey});
        if (i > 0){
          var prev = Y(E[i - 1]);
          S.draw.arrow(c, x0 - 4, prev, x0 - 4, y, i === 5 ? P.red : (E[i] > E[i - 1] ? P.amber : P.green), 2.4);
          S.draw.text(c, desc[i], x0 - 2, (prev + y) / 2, {size:9, color:P.ink, align:"left"});
        }
      }
      S.draw.text(c, "énergie (kJ/mol)", 40, 10, {size:10, color:P.grey, align:"left"});
      /* nuage U contre 1/d */
      var sx0 = split + 30, sx1 = W - 12, sy0 = 40, sy1 = H - 36;
      S.draw.text(c, "U en fonction de 1/(r₊ + r₋)", (sx0 + sx1) / 2, 16, {size:11, color:P.grey});
      var inv = function(mm, xx){ return 1000 / (MET[mm].r + HAL[xx].r); };
      function X2(v){ return sx0 + (v - 3) / (6 - 3) * (sx1 - sx0); } function Y2(u){ return sy1 - (u - 550) / (1100 - 550) * (sy1 - sy0); }
      S.draw.line(c, sx0, sy1, sx1, sy1, P.grey, 1); S.draw.line(c, sx0, sy0, sx0, sy1, P.grey, 1);
      [3, 4, 5, 6].forEach(function(t){ S.draw.text(c, String(t), X2(t), sy1 + 10, {size:9, color:P.grey}); });
      [600, 800, 1000].forEach(function(u){ S.draw.text(c, String(u), sx0 - 4, Y2(u), {size:9, color:P.grey, align:"right"}); });
      S.draw.text(c, "1000/(r₊+r₋) (nm⁻¹)", (sx0 + sx1) / 2, sy1 + 24, {size:10, color:P.grey});
      Object.keys(MET).forEach(function(mm){ Object.keys(HAL).forEach(function(xx){ var on = mm === m && xx === x; S.draw.dot(c, X2(inv(mm, xx)), Y2(lat(mm, xx)), on ? 7 : 3.5, on ? P.red : P.acc); if (on) S.draw.text(c, mm + xx, X2(inv(mm, xx)) - 6, Y2(lat(mm, xx)) - 12, {size:11, color:P.red, align:"right"}); }); });
      var sumSteps = a.sub + a.ie + b.at + b.ea;
      ro.set(0, S.fmt(DF[key], 1) + " kJ/mol"); ro.set(1, S.fmt(sumSteps, 1) + " kJ/mol"); ro.set(2, S.fmt(Uv, 0) + " kJ/mol"); ro.set(3, (MET[m].r + HAL[x].r) + " pm");
      nt.set("U = " + S.fmt(a.sub, 1) + " + " + S.fmt(a.ie, 1) + " + " + S.fmt(b.at, 1) + " + (" + S.fmt(b.ea, 1) + ") − (" + S.fmt(DF[key], 1) + ") = " + S.fmt(Uv, 0) + " kJ/mol. Le sel est stable car le gain de réseau (" + S.fmt(Uv, 0) + ") dépasse nettement le coût de formation des ions gazeux (" + S.fmt(sumSteps, 0) + ").", "ok");
    });
  }
});

/* ---------- 2. ΔG, ΔG°, K et Q ---------- */
var RXN = [
  ["nh3","N₂ + 3 H₂ ⇌ 2 NH₃ (synthèse)",-92.2,-198.7],
  ["caco3","CaCO₃(s) ⇌ CaO(s) + CO₂(g)",178.3,160.5],
  ["h2og","H₂O(l) ⇌ H₂O(g)",44.0,118.8],
  ["glace","H₂O(s) ⇌ H₂O(l)",6.01,22.0],
  ["ch4","CH₄ + 2 O₂ → CO₂ + 2 H₂O(g)",-802.3,-5.3]
];
SFA.sim({
  id:"uc-c05-deltag-k", ch:"c05", tag:"Thermochimie",
  titre:"ΔG° = ΔH° − TΔS° = −RT ln K : le sens d'une réaction selon T et Q",
  resume:"Fais varier T : ΔG° change de signe à T = ΔH°/ΔS°, K bascule. Fais glisser Q : ΔG = ΔG° + RT ln Q donne le sens spontané.",
  but:"Choisis une réaction (ΔH° et ΔS° supposés constants), puis règle la température et le quotient réactionnel Q. Lis ΔG°, K, ΔG et le sens d'évolution.",
  aRetenir:"ΔG° = ΔH° − TΔS° et ΔG° = −RT ln K ; ΔG = ΔG° + RT ln Q. ΔG &lt; 0 : sens direct spontané ; ΔG &gt; 0 : sens inverse ; ΔG = 0 : équilibre (Q = K). Si ΔH° et ΔS° ont le même signe, ΔG° change de signe à T<sub>c</sub> = ΔH°/ΔS°.",
  piege:"ΔG° n'est pas ΔG : le signe de ΔG° fixe K, pas le sens réel, qui dépend de Q. ΔG° &lt; 0 donne K &gt; 1 mais pas « la réaction se fait toujours ». ΔH° et ΔS° varient un peu avec T : le simulateur les suppose constants (approximation raisonnable sur quelques centaines de K). Unités : ΔH° en kJ/mol, ΔS° en J/(mol·K).",
  build:function(k, S){
    var c = k.canvas(360);
    var rs = k.select("Réaction", RXN.map(function(r){ return [r[0], r[1] + " (ΔH° = " + S.fmt(r[2], 1) + " kJ/mol ; ΔS° = " + S.fmt(r[3], 1) + " J/(mol·K))"]; }), "nh3");
    var tt = k.slider("Température T", 100, 1500, 5, 298, "K");
    var lq = k.slider("log₁₀ Q", -6, 6, 0.1, 0, "");
    var ro = k.readouts(["ΔG°", "K", "ΔG", "T<sub>c</sub> = ΔH°/ΔS°", "Sens spontané"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, r = RXN.filter(function(x){ return x[0] === rs.value; })[0], dH = r[2] * 1000, dS = r[3], T = tt.value, Q = Math.pow(10, lq.value);
      var dG0 = dH - T * dS, K = Math.exp(-dG0 / (R * T)), dG = dG0 + R * T * Math.log(Q), Tc = dH / dS;
      c.clear();
      var lo = Math.min(dH - 100 * dS, dH - 1500 * dS) / 1000, hi = Math.max(dH - 100 * dS, dH - 1500 * dS) / 1000, pad = (hi - lo) * 0.1 + 5;
      var ax = S.draw.axes(c, {x0:100, x1:1500, y0:lo - pad, y1:hi + pad, xl:"T (K)", yl:"ΔG° (kJ/mol)", stepX:250});
      S.draw.fn(c, ax, function(t){ return (dH - t * dS) / 1000; }, P.acc, 2.8);
      S.draw.line(c, ax.X(T), ax.Y(lo - pad), ax.X(T), ax.Y(hi + pad), P.red, 1.3, [4,3]);
      S.draw.dot(c, ax.X(T), ax.Y(dG0 / 1000), 6, P.red);
      if (Tc > 100 && Tc < 1500 && dH * dS > 0){ S.draw.dot(c, ax.X(Tc), ax.Y(0), 6, P.green); S.draw.text(c, "T c = " + S.fmt(Tc, 0) + " K", ax.X(Tc), ax.Y(0) - 14, {size:12, color:P.green}); }
      var sens = Math.abs(dG) < 100 ? "équilibre (Q ≈ K)" : (dG < 0 ? "→ sens direct" : "← sens inverse");
      ro.set(0, S.fmt(dG0 / 1000, 1) + " kJ/mol"); ro.set(1, S.sci(K, 2)); ro.set(2, S.fmt(dG / 1000, 1) + " kJ/mol");
      ro.set(3, (Tc > 0 && dH * dS > 0) ? S.fmt(Tc, 0) + " K" : "pas de changement de signe"); ro.set(4, sens);
      var why = dH < 0 && dS < 0 ? "ΔH° &lt; 0 et ΔS° &lt; 0 : favorable à basse température, défavorable à haute T." : dH > 0 && dS > 0 ? "ΔH° &gt; 0 et ΔS° &gt; 0 : favorisée par l'entropie, spontanée à haute T." : dH < 0 && dS > 0 ? "ΔH° &lt; 0 et ΔS° &gt; 0 : spontanée à toute température." : "ΔH° &gt; 0 et ΔS° &lt; 0 : jamais spontanée.";
      nt.set("ΔG° = " + S.fmt(r[2], 1) + " − " + S.fmt(T, 0) + " × (" + S.fmt(dS, 1) + ")/1000 = " + S.fmt(dG0 / 1000, 1) + " kJ/mol ; K = exp(−ΔG°/RT) = " + S.sci(K, 2) + ". " + why + (Math.abs(T - Tc) < 60 && dH * dS > 0 ? " Près de T<sub>c</sub>, ΔG° est faible : la constante varie très vite avec T." : ""), "ok");
    });
  }
});

/* ---------- 3. Énergies de liaison ---------- */
var EB = {HH:436, ClCl:243, HCl:431, NN3:945, NH:391, CH:413, CC:347, CC2:614, OO2:498, CO2:799, CO2c:745, OH:463};
var NAMES = {HH:"H–H", ClCl:"Cl–Cl", HCl:"H–Cl", NN3:"N≡N", NH:"N–H", CH:"C–H", CC:"C–C", CC2:"C=C", OO2:"O=O", CO2:"C=O (dans CO₂)", OH:"O–H"};
var REAC = [
  ["hcl","H₂ + Cl₂ → 2 HCl",[["HH",1],["ClCl",1]],[["HCl",2]],-184.6,0],
  ["nh3","N₂ + 3 H₂ → 2 NH₃",[["NN3",1],["HH",3]],[["NH",6]],-92.2,0],
  ["h2o","2 H₂ + O₂ → 2 H₂O(g)",[["HH",2],["OO2",1]],[["OH",4]],-483.6,2],
  ["ch4","CH₄ + 2 O₂ → CO₂ + 2 H₂O(g)",[["CH",4],["OO2",2]],[["CO2",2],["OH",4]],-802.3,2],
  ["c2h4","C₂H₄ + H₂ → C₂H₆",[["CC2",1],["HH",1]],[["CC",1],["CH",2]],-136.4,0]
];
SFA.sim({
  id:"uc-c05-energies-liaison", ch:"c05", tag:"Thermochimie",
  titre:"Estimer ΔH par les énergies de liaison",
  resume:"ΔH ≈ Σ liaisons rompues − Σ liaisons formées. Compare l'estimation à la valeur mesurée et mesure l'erreur.",
  but:"Choisis une réaction : les liaisons rompues et formées sont listées avec leur énergie moyenne. Teste l'effet de la valeur de l'énergie C=O et de l'état de l'eau (gaz ou liquide).",
  aRetenir:"ΔH ≈ Σ E(liaisons rompues) − Σ E(liaisons formées) en phase gazeuse. Rompre coûte de l'énergie (+), former en libère (−). C'est une estimation : les énergies sont des moyennes sur de nombreuses molécules.",
  piege:"Les liaisons formées s'écrivent en négatif : ne les additionne pas avec le même signe. Valable en phase gazeuse : si l'eau est liquide, ajoute −44 kJ par mole d'eau condensée. Les énergies de C=O varient : 799 kJ/mol dans CO₂, ≈ 745 dans un aldéhyde ou une cétone ; choisir la mauvaise valeur fausse le résultat de ≈ 100 kJ.",
  build:function(k, S){
    var c = k.canvas(340);
    var rs = k.select("Réaction", REAC.map(function(r){ return [r[0], r[1]]; }), "ch4");
    var co = k.seg("E(C=O) retenue", [[799,"799 (dans CO₂)"],[745,"745 (carbonyle)"]], 799);
    var lq = k.toggle("H₂O formée à l'état liquide (−44 kJ/mol)", false);
    var ro = k.readouts(["Σ liaisons rompues", "Σ liaisons formées", "ΔH estimé", "ΔH mesuré", "Écart"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, r = REAC.filter(function(x){ return x[0] === rs.value; })[0];
      function en(key){ return key === "CO2" ? +co.value : EB[key]; }
      var sb = 0, sf = 0;
      r[2].forEach(function(b){ sb += en(b[0]) * b[1]; }); r[3].forEach(function(b){ sf += en(b[0]) * b[1]; });
      var dH = sb - sf - (lq.value ? 44 * r[5] : 0), exp = r[4] - (lq.value ? 44 * r[5] : 0);
      c.clear();
      var max = Math.max(sb, sf) * 1.1, bx = 50, bw = Math.min(110, W * 0.2), yb = H - 40, yt = 36, Hh = yb - yt;
      function Yv(v){ return yb - v / max * Hh; }
      /* barre rompues */
      var acc = 0; var cols = [P.amber, "#d89a3f", "#e7b86b"];
      r[2].forEach(function(b, i){ var v = en(b[0]) * b[1]; ctx.fillStyle = cols[i % 3]; ctx.fillRect(bx, Yv(acc + v), bw, Yv(acc) - Yv(acc + v)); S.draw.text(c, b[1] + " × " + NAMES[b[0]] + (b[0] === "CO2" ? "" : ""), bx + bw / 2, (Yv(acc) + Yv(acc + v)) / 2, {size:11, color:"#fff"}); acc += v; });
      S.draw.text(c, "Rompues : + " + sb, bx + bw / 2, yt - 12, {size:12, color:P.amber});
      var bx2 = bx + bw + 60; acc = 0; var cols2 = [P.green, "#4c8b73", "#7ab5a0"];
      r[3].forEach(function(b, i){ var v = en(b[0]) * b[1]; ctx.fillStyle = cols2[i % 3]; ctx.fillRect(bx2, Yv(acc + v), bw, Yv(acc) - Yv(acc + v)); S.draw.text(c, b[1] + " × " + NAMES[b[0]], bx2 + bw / 2, (Yv(acc) + Yv(acc + v)) / 2, {size:11, color:"#fff"}); acc += v; });
      S.draw.text(c, "Formées : − " + sf, bx2 + bw / 2, yt - 12, {size:12, color:P.green});
      var xr = bx2 + bw + 40;
      S.draw.text(c, "ΔH ≈ " + S.fmt(dH, 0) + " kJ/mol", xr, H / 2 - 20, {size:16, color:dH < 0 ? P.acc : P.red, align:"left"});
      S.draw.text(c, "mesuré : " + S.fmt(exp, 0), xr, H / 2 + 6, {size:13, color:P.grey, align:"left"});
      S.draw.text(c, dH < 0 ? "réaction exothermique" : "réaction endothermique", xr, H / 2 + 28, {size:12, color:P.ink, align:"left"});
      ro.set(0, "+" + sb + " kJ"); ro.set(1, "−" + sf + " kJ"); ro.set(2, S.fmt(dH, 0) + " kJ/mol"); ro.set(3, S.fmt(exp, 0) + " kJ/mol"); ro.set(4, S.fmt(dH - exp, 0) + " kJ/mol (" + S.fmt(Math.abs(dH - exp) / Math.abs(exp) * 100, 0) + " %)");
      var warn = Math.abs(dH - exp) / Math.abs(exp) > 0.08;
      nt.set("ΔH ≈ " + sb + " − " + sf + (lq.value && r[5] ? " − " + (44 * r[5]) : "") + " = " + S.fmt(dH, 0) + " kJ/mol, mesure " + S.fmt(exp, 1) + " kJ/mol. " + (warn ? "Écart supérieur à 8 % : valeurs moyennes d'énergie de liaison peu adaptées à cette réaction ou mauvais choix de la liaison C=O / de l'état de l'eau." : "Estimation correcte pour une méthode aussi simple."), warn ? "warn" : "ok");
    });
  }
});

/* ---------- 4. Calorimétrie ---------- */
var METAUX = [["Cu","cuivre",0.385],["Al","aluminium",0.897],["Fe","fer",0.449],["Zn","zinc",0.388],["Ag","argent",0.235],["Pb","plomb",0.129]];
SFA.sim({
  id:"uc-c05-calorimetrie", ch:"c05", tag:"Thermochimie",
  titre:"Calorimétrie : mélange thermique et neutralisation",
  resume:"Q = m·c·ΔT, bilan de chaleur nul dans un calorimètre : trouve la température finale d'un mélange ou la ΔT d'une neutralisation HCl/NaOH.",
  but:"Mode mélange : plonge un métal chaud dans de l'eau et trouve T<sub>f</sub>. Mode neutralisation : mélange un acide et une base fortes et lis l'élévation de température ; la quantité limitante fixe la chaleur dégagée.",
  aRetenir:"Σ Q = 0 dans un système isolé : m₁c₁(T<sub>f</sub> − T₁) + m₂c₂(T<sub>f</sub> − T₂) + C<sub>cal</sub>(T<sub>f</sub> − T₂) = 0. Pour une réaction : q = −n·ΔH, absorbée par la solution : ΔT = q/(m·c + C<sub>cal</sub>). ΔH<sub>neutralisation</sub> ≈ −55,8 kJ/mol de H₂O formée, acide fort + base forte.",
  piege:"Le calorimètre absorbe aussi de la chaleur (capacité C<sub>cal</sub>) : l'ignorer fait sous-estimer la chaleur dégagée. La réaction est limitée par le réactif en défaut. Modèle : solution diluée de masse volumique 1,00 g/mL et capacité thermique massique 4,18 J/(g·K), pertes de chaleur négligées.",
  build:function(k, S){
    var c = k.canvas(300);
    var md = k.seg("Mode", [["mix","Mélange eau + métal"],["neu","Neutralisation HCl + NaOH"]], "mix");
    var mt = k.select("Métal (mélange)", METAUX.map(function(m){ return [m[0], m[1] + " (c = " + S.fmt(m[2], 3) + " J/(g·K))"]; }), "Cu");
    var m1 = k.slider("Masse du métal", 10, 500, 5, 100, "g");
    var t1 = k.slider("Température du métal", 30, 300, 5, 150, "°C");
    var m2 = k.slider("Masse d'eau", 50, 500, 5, 200, "g");
    var t2 = k.slider("Température initiale de l'eau", 5, 40, 1, 20, "°C");
    var cc = k.slider("Capacité du calorimètre C<sub>cal</sub>", 0, 200, 5, 20, "J/K");
    var ca = k.slider("Concentration HCl", 0.2, 2, 0.1, 1, "mol/L");
    var cb = k.slider("Concentration NaOH", 0.2, 2, 0.1, 1, "mol/L");
    var vv = k.slider("Volume de chaque solution", 25, 100, 5, 50, "mL");
    var ro = k.readouts(["Résultat", "Chaleur échangée", "Détail"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H;
      c.clear();
      if (md.value === "mix"){
        var M = METAUX.filter(function(x){ return x[0] === mt.value; })[0], cm = M[2], cw = 4.184;
        var Tf = (m1.value * cm * t1.value + (m2.value * cw + cc.value) * t2.value) / (m1.value * cm + m2.value * cw + cc.value);
        var q = m1.value * cm * (t1.value - Tf);
        function col(T){ var f = Math.max(0, Math.min(1, (T - 5) / 295)); return "rgb(" + Math.round(60 + 195 * f) + "," + Math.round(120 - 80 * f) + "," + Math.round(230 - 190 * f) + ")"; }
        [["avant", t1.value, t2.value, W * 0.28], ["après", Tf, Tf, W * 0.72]].forEach(function(b){
          ctx.fillStyle = col(b[2]); ctx.fillRect(b[3] - 60, 100, 120, 110); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.strokeRect(b[3] - 60, 60, 120, 150);
          ctx.fillStyle = col(b[1]); ctx.fillRect(b[3] - 20, 160, 40, 36);
          S.draw.text(c, b[0] === "avant" ? "eau " + S.fmt(t2.value, 0) + " °C ; métal " + S.fmt(t1.value, 0) + " °C" : "Tf = " + S.fmt(Tf, 1) + " °C", b[3], 232, {size:12});
          S.draw.text(c, b[0], b[3], 44, {size:12, color:P.grey});
        });
        S.draw.arrow(c, W * 0.42, 140, W * 0.58, 140, P.red, 3);
        S.draw.text(c, "Q = " + S.fmt(q / 1000, 2) + " kJ", W / 2, 120, {size:12, color:P.red});
        ro.set(0, "T<sub>f</sub> = " + S.fmt(Tf, 1) + " °C"); ro.set(1, S.fmt(q, 0) + " J cédés par le métal"); ro.set(2, "ΔT eau = " + S.fmt(Tf - t2.value, 1) + " K");
        nt.set("T<sub>f</sub> = (" + m1.value + " × " + S.fmt(cm, 3) + " × " + t1.value + " + (" + m2.value + " × 4,184 + " + cc.value + ") × " + t2.value + ") / (" + m1.value + " × " + S.fmt(cm, 3) + " + " + m2.value + " × 4,184 + " + cc.value + ") = " + S.fmt(Tf, 1) + " °C." + (Tf > 95 ? " Attention : eau proche de l'ébullition, la vaporisation (non modélisée) fausserait le résultat." : ""), Tf > 95 ? "warn" : "ok");
      } else {
        var na = ca.value * vv.value / 1000, nb = cb.value * vv.value / 1000, nr = Math.min(na, nb), qq = nr * 55.8e3, mtot = 2 * vv.value * 1.0;
        var dT = qq / (mtot * 4.18 + cc.value);
        var lim = Math.abs(na - nb) < 1e-9 ? "mélange stœchiométrique" : (na < nb ? "HCl en défaut : NaOH en excès" : "NaOH en défaut : HCl en excès");
        ctx.fillStyle = "#f6d7cf"; ctx.fillRect(W / 2 - 70, 80, 140, 120); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.strokeRect(W / 2 - 70, 50, 140, 150);
        S.draw.text(c, "ΔT = + " + S.fmt(dT, 2) + " K", W / 2, 140, {size:16, color:P.red});
        S.draw.text(c, "n(HCl) = " + S.fmt(na, 3) + " mol ; n(NaOH) = " + S.fmt(nb, 3) + " mol", W / 2, 230, {size:12});
        S.draw.text(c, lim, W / 2, 252, {size:12, color:P.amber});
        ro.set(0, "ΔT = " + S.fmt(dT, 2) + " K"); ro.set(1, S.fmt(qq, 0) + " J"); ro.set(2, "n limitant = " + S.fmt(nr, 3) + " mol");
        nt.set("q = n·|ΔH| = " + S.fmt(nr, 3) + " × 55,8·10³ = " + S.fmt(qq, 0) + " J ; ΔT = q/(m·c + C<sub>cal</sub>) = " + S.fmt(qq, 0) + " / (" + S.fmt(mtot, 0) + " × 4,18 + " + cc.value + ") = " + S.fmt(dT, 2) + " K. " + lim + ".", "ok");
      }
    });
  }
});

/* ---------- 5. Couplage de l'ATP ---------- */
SFA.sim({
  id:"uc-c05-couplage-atp", ch:"c05", tag:"Biologie",
  titre:"Couplage à l'ATP : rendre possible une réaction défavorable",
  resume:"ΔG = ΔG°′ + RT ln([ADP][Pi]/[ATP]) : avec les concentrations cellulaires, l'hydrolyse de l'ATP libère ≈ −50 kJ/mol et déplace l'équilibre de millions de fois.",
  but:"Choisis une réaction A → B défavorable (ΔG°′ &gt; 0). Règle les concentrations d'ATP, d'ADP et de Pi : compare le rapport [B]/[A] à l'équilibre sans et avec couplage.",
  aRetenir:"ATP + H₂O → ADP + Pi : ΔG°′ = −30,5 kJ/mol (pH 7), mais ΔG réel = ΔG°′ + RT ln([ADP][Pi]/[ATP]) ≈ −50 kJ/mol dans la cellule, car le rapport ATP/ADP est maintenu très élevé. Pour une réaction couplée, les ΔG s'additionnent : le rapport [B]/[A] à l'équilibre est multiplié par exp(−ΔG<sub>ATP</sub>/RT).",
  piege:"Le couplage exige un intermédiaire commun (ou un transfert de groupe phosphoryle), pas seulement deux réactions « en même temps ». Le simulateur suppose 310 K, pH 7, Mg²⁺ ignoré, états standard de 1 mol/L pour ADP, Pi et ATP : il donne l'ordre de grandeur. Le rapport ATP/ADP cellulaire est maintenu loin de l'équilibre par le métabolisme.",
  build:function(k, S){
    var c = k.canvas(330);
    var dga = k.slider("ΔG°′ de A → B", -10, 40, 0.5, 13.8, "kJ/mol");
    var atp = k.slider("[ATP]", 0.5, 10, 0.1, 3, "mmol/L");
    var adp = k.slider("[ADP]", 0.01, 2, 0.01, 0.3, "mmol/L");
    var pi = k.slider("[Pi]", 0.5, 10, 0.1, 3, "mmol/L");
    var ro = k.readouts(["ΔG réel de l'hydrolyse de l'ATP", "[B]/[A] sans couplage", "[B]/[A] avec couplage", "Facteur gagné"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, T = 310.15, RT = R * T / 1000;
      var q = (adp.value / 1000) * (pi.value / 1000) / (atp.value / 1000);
      var dgatp = -30.5 + RT * Math.log(q), A = dga.value, tot = A + dgatp;
      var K0 = Math.exp(-A / RT), K1 = Math.exp(-tot / RT);
      c.clear();
      var bars = [["A → B", A, P.red], ["Hydrolyse ATP", dgatp, P.green], ["Réaction couplée", tot, P.acc]];
      var zero = H * 0.5, sc = (H * 0.4) / 80, bw = Math.min(100, W * 0.2);
      S.draw.line(c, 30, zero, W - 30, zero, P.grey, 1.5); S.draw.text(c, "ΔG = 0", 36, zero - 10, {size:10, color:P.grey, align:"left"});
      bars.forEach(function(b, i){
        var x = W * 0.12 + i * (bw + 40), y = zero - b[1] * sc;
        ctx.fillStyle = b[2]; ctx.fillRect(x, Math.min(zero, y), bw, Math.abs(y - zero));
        S.draw.text(c, S.fmt(b[1], 1), x + bw / 2, b[1] > 0 ? y - 12 : y + 12, {size:12, color:P.ink});
        S.draw.text(c, b[0], x + bw / 2, b[1] > 0 ? zero + 16 : zero - 16, {size:11, color:P.grey});
      });
      S.draw.text(c, "kJ/mol", W - 40, 16, {size:10, color:P.grey});
      ro.set(0, S.fmt(dgatp, 1) + " kJ/mol"); ro.set(1, S.sci(K0, 2)); ro.set(2, S.sci(K1, 2)); ro.set(3, "× " + S.sci(K1 / K0, 2));
      nt.set("ΔG(ATP) = −30,5 + 2,579 × ln[(" + S.fmt(adp.value, 2) + "·10⁻³ × " + S.fmt(pi.value, 1) + "·10⁻³)/(" + S.fmt(atp.value, 1) + "·10⁻³)] = " + S.fmt(dgatp, 1) + " kJ/mol. Couplée à A → B : ΔG = " + S.fmt(A, 1) + " + (" + S.fmt(dgatp, 1) + ") = " + S.fmt(tot, 1) + " kJ/mol, " + (tot < 0 ? "réaction globale favorable." : "encore défavorable : il faut un ATP/ADP plus élevé ou un couplage à plusieurs ATP.") , tot < 0 ? "ok" : "warn");
    });
  }
});
})();
