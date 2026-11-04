/* Chapitre 3 · Alcènes, polymères et plastiques */
(function(){
function sub(s){ return String(s).replace(/(\d+)/g, "<sub>$1</sub>"); }
function brute(C, H, extra){ return "C" + (C > 1 ? "<sub>" + C + "</sub>" : "") + "H<sub>" + H + "</sub>" + (extra || ""); }
var ALK = {
  ethene: {nom: "éthène", n: 2, db: [0, 1], X: 1},
  propene: {nom: "propène", n: 3, db: [0, 1], X: 1},
  butene: {nom: "but-2-ène", n: 4, db: [1, 2], X: 1}
};
var NOMS = {
  ethene: {H2: "éthane", Br2: "1,2-dibromoéthane", HBr: "bromoéthane", H2O: "éthanol"},
  propene: {H2: "propane", Br2: "1,2-dibromopropane", HBr: "2-bromopropane (majoritaire)", H2O: "propan-2-ol (majoritaire)"},
  butene: {H2: "butane", Br2: "2,3-dibromobutane", HBr: "2-bromobutane", H2O: "butan-2-ol"}
};
var REA = {H2: {M: 2, nom: "hydrogénation", cond: "catalyseur Pt ou Ni", obs: "aucune couleur ne change"}, Br2: {M: 160, nom: "addition de dibrome", cond: "à température ambiante", obs: "l'eau de brome orange se décolore"},
  HBr: {M: 81, nom: "hydrobromation", cond: "HBr gazeux", obs: "—"}, H2O: {M: 18, nom: "hydratation", cond: "catalyseur acide (H⁺), chauffage", obs: "—"}};
SFA.sim({
  id: "c6-c03-addition", ch: "c03", tag: "Classique",
  titre: "Addition sur une double liaison C=C",
  resume: "Choisis un alcène et un réactif : suis la double liaison qui se transforme en liaison simple et lis le produit.",
  but: "Choisis l'alcène et le réactif, puis fais glisser l'avancement de 0 à 100 % : la 2e liaison de C=C s'efface et de nouveaux atomes se fixent.",
  aRetenir: "Dans une addition, la liaison π de C=C s'ouvre et deux nouveaux atomes ou groupes se fixent sur les deux carbones : le produit est saturé. Les masses s'ajoutent : M(produit) = M(alcène) + M(réactif). H₂ → alcane ; Br₂ → dérivé dibromé ; HBr → dérivé monobromé ; H₂O → alcool.",
  piege: "Avec le propène, HBr ou H₂O peuvent se fixer de deux façons : on obtient surtout le produit où X se fixe sur le carbone le plus substitué (règle de Markovnikov). Le test de décoloration de l'eau de brome ne marche que pour la double liaison, pas pour un alcane.",
  build: function(k, S){
    var c = k.canvas(270), P = S.draw.palette;
    var al = k.seg("Alcène", [["ethene", "Éthène"], ["propene", "Propène"], ["butene", "But-2-ène"]], "ethene");
    var re = k.seg("Réactif", [["H2", "H₂"], ["Br2", "Br₂"], ["HBr", "HBr"], ["H2O", "H₂O"]], "Br2");
    var av = k.slider("Avancement", 0, 100, 5, 0, "%");
    var ro = k.readouts(["Type de réaction", "Produit", "Formule brute", "Bilan de masse"]);
    var nt = k.note("", "ok");
    function group(ctx, txt, x, y, col, al){ ctx.save(); ctx.globalAlpha = al; S.draw.text(c, txt, x, y, {size: 15, color: col}); ctx.restore(); }
    k.draw(function(){
      c.clear();
      var A = ALK[al.value], r = re.value, t = av.value / 100, n = A.n, ctx = c.ctx;
      var dx = 70, a = 24, x0 = c.W / 2 - dx * (n - 1) / 2, yc = c.H / 2;
      var X = function(i){ return x0 + i * dx; }, Y = function(i){ return yc + (i % 2 === 0 ? a : -a); };
      var i;
      for (i = 0; i < n - 1; i++) S.draw.line(c, X(i), Y(i), X(i + 1), Y(i + 1), P.ink, 2.6);
      /* 2e liaison de la double liaison : s'efface */
      var i0 = A.db[0], i1 = A.db[1], dxx = X(i1) - X(i0), dyy = Y(i1) - Y(i0), l = Math.sqrt(dxx * dxx + dyy * dyy), nx = -dyy / l * 6, ny = dxx / l * 6;
      ctx.save(); ctx.globalAlpha = 1 - t; S.draw.line(c, X(i0) + nx, Y(i0) + ny, X(i1) + nx, Y(i1) + ny, P.red, 2.6); ctx.restore();
      var j0 = A.db[0], j1 = A.db[1];
      function above(j){ return Y(j) < yc ? -1 : 1; }
      var G0, G1, c0 = P.green, c1 = P.green;
      if (r === "H2"){ G0 = "H"; G1 = "H"; }
      if (r === "Br2"){ G0 = "Br"; G1 = "Br"; c0 = c1 = P.red; }
      if (r === "HBr"){ G0 = "H"; G1 = "Br"; c1 = P.red; }
      if (r === "H2O"){ G0 = "H"; G1 = "OH"; c1 = P.teal; }
      var jX = (r === "HBr" || r === "H2O") ? A.X : j1;   /* carbone qui reçoit X */
      var jH = (jX === j0) ? j1 : j0;
      var g = {};
      if (r === "H2" || r === "Br2"){ g[j0] = [G0, c0]; g[j1] = [G1, c1]; } else { g[jH] = ["H", P.green]; g[jX] = [G1, c1]; }
      for (var jj in g){ jj = +jj; var yy = Y(jj) + above(jj) * 44; ctx.save(); ctx.globalAlpha = t; S.draw.line(c, X(jj), Y(jj), X(jj), Y(jj) + above(jj) * 30, P.grey, 2); ctx.restore(); group(ctx, g[jj][0], X(jj), yy, g[jj][1], t); }
      for (i = 0; i < n; i++) S.draw.dot(c, X(i), Y(i), 3.5, P.grey);
      S.draw.text(c, t < 0.5 ? "double liaison C=C" : "liaison simple C–C : produit saturé", c.W / 2, 22, {size: 14, color: t < 0.5 ? P.red : P.green});
      var H0 = 2 * n, extra = r === "H2" ? [0, 2, ""] : r === "Br2" ? [0, 0, "Br<sub>2</sub>"] : r === "HBr" ? [0, 1, "Br"] : [0, 2, "O"];
      var Hp = r === "H2" ? H0 + 2 : r === "Br2" ? H0 : r === "HBr" ? H0 + 1 : H0 + 2;
      var Mal = 12 * n + H0, Mp = Mal + REA[r].M;
      ro.set(0, REA[r].nom); ro.set(1, NOMS[al.value][r]); ro.set(2, brute(n, Hp, extra[2]));
      ro.set(3, S.fmt(Mal, 1) + " + " + S.fmt(REA[r].M, 1) + " = " + S.fmt(Mp, 1) + " g/mol");
      nt.set(r === "Br2" ? "Observation : l'eau de brome orange se décolore (" + REA[r].cond + ")." : "Conditions : " + REA[r].cond + ".", "ok");
    });
  }
});

var MON = [
  {id: "pe", mon: "éthène", pol: "polyéthylène (PE)", M0: 28, unit: "–CH₂–CH₂–", usage: "sacs, films, bouteilles de lait"},
  {id: "pp", mon: "propène", pol: "polypropylène (PP)", M0: 42, unit: "–CH₂–CH(CH₃)–", usage: "bouchons, pots de yaourt, cordes"},
  {id: "pvc", mon: "chloroéthène", pol: "poly(chlorure de vinyle) (PVC)", M0: 62.5, unit: "–CH₂–CHCl–", usage: "tuyaux, cadres de fenêtre"},
  {id: "ps", mon: "styrène", pol: "polystyrène (PS)", M0: 104, unit: "–CH₂–CH(C₆H₅)–", usage: "boîtiers de CD, barquettes"},
  {id: "ptfe", mon: "tétrafluoroéthène", pol: "polytétrafluoroéthylène (PTFE)", M0: 100, unit: "–CF₂–CF₂–", usage: "revêtement antiadhésif"}
];
SFA.sim({
  id: "c6-c03-polyaddition", ch: "c03", tag: "Classique",
  titre: "Une chaîne de polymère : n monomères, quelle masse molaire ?",
  resume: "Choisis le monomère et le nombre n : la masse molaire du polymère vaut n × M(monomère).",
  but: "Choisis un monomère et fais varier n (échelle logarithmique). Défi : obtiens un polyéthylène de masse molaire 100 000 g/mol (à 3 % près).",
  aRetenir: "Polyaddition : n molécules de monomère à double liaison C=C s'additionnent sans rien perdre : n CH₂=CHX → [–CH₂–CHX–]ₙ. Donc M(polymère) = n × M(monomère) (les extrémités sont négligeables). Un polymère contient en réalité des chaînes de longueurs différentes : M est une valeur moyenne.",
  piege: "Le polymère n'a pas de double liaison C=C : elle a disparu dans l'addition. Et « n » est très grand (des centaines à des dizaines de milliers) : on ne peut pas écrire de formule brute simple, seulement le motif répété.",
  build: function(k, S){
    var c = k.canvas(250), P = S.draw.palette;
    var mo = k.select("Monomère", MON.map(function(m, i){ return [i, m.mon + " → " + m.pol.split(" (")[0]]; }), 0);
    var pn = k.slider("p, avec n = 10^p monomères", 1, 4.5, 0.05, 2, "");
    var ro = k.readouts(["n", "M du polymère", "Longueur étirée", "Usages"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var m = MON[mo.value], n = Math.round(Math.pow(10, pn.value)), M = n * m.M0, ctx = c.ctx, i;
      var cols = [P.acc, P.teal, P.green, P.amber, P.violet];
      var cnt = Math.min(7, n), w = Math.min(70, (c.W - 80) / (cnt + 1.2));
      var x = 30;
      S.draw.text(c, m.pol, c.W / 2, 22, {size: 14, color: P.green});
      for (i = 0; i < cnt; i++){
        ctx.fillStyle = cols[mo.value]; ctx.globalAlpha = 0.18; ctx.fillRect(x, 70, w * 0.9, 60); ctx.globalAlpha = 1; ctx.strokeStyle = cols[mo.value]; ctx.lineWidth = 2; ctx.strokeRect(x, 70, w * 0.9, 60);
        S.draw.line(c, x + w * 0.9, 100, x + w, 100, P.ink, 2.4);
        x += w;
      }
      if (n > cnt) S.draw.text(c, "… +" + S.fmt(n - cnt, 0), Math.min(x + 6, c.W - 60), 100, {size: 13, color: P.grey, align: "left"});
      S.draw.text(c, m.unit + "  ×  " + S.fmt(n, 0), c.W / 2, 165, {size: 15, math: true, color: P.ink});
      S.draw.text(c, "1 motif = 1 monomère, M = " + S.fmt(m.M0, 1) + " g/mol", c.W / 2, 195, {size: 13, color: P.grey});
      var L = n * 0.25;   /* nm, ordre de grandeur de la chaîne carbonée étirée */
      ro.set(0, S.fmt(n, 0)); ro.set(1, S.sci(M, 3) + " g/mol"); ro.set(2, "≈ " + (L >= 1000 ? S.fmt(L / 1000, 1) + " µm" : S.fmt(L, 0) + " nm")); ro.set(3, m.usage);
      if (+mo.value === 0){
        var err = Math.abs(M - 100000) / 100000;
        nt.set(err <= 0.03 ? "Défi réussi : M ≈ 100 000 g/mol, n ≈ " + S.fmt(n, 0) + "." : "Défi PE : vise 100 000 g/mol (n ≈ 3 571). Actuellement " + S.sci(M, 2) + " g/mol.", err <= 0.03 ? "ok" : "warn");
      } else nt.set("Longueur étirée : ordre de grandeur (≈ 0,25 nm par motif à deux carbones).", "ok");
    });
  }
});

var COND = [
  {id: "pet", nom: "PET (polyester)", A: "acide téréphtalique", MA: 166, B: "éthane-1,2-diol", MB: 62, rep: 192, cA: "#2c5f9a", cB: "#d98a1c", usage: "bouteilles en plastique, fibres textiles", lien: "ester"},
  {id: "nylon", nom: "Nylon 6,6 (polyamide)", A: "acide hexanedioïque", MA: 146, B: "hexane-1,6-diamine", MB: 116, rep: 226, cA: "#7a3fa0", cB: "#2e8b57", usage: "textiles, cordes, pièces mécaniques", lien: "amide"}
];
SFA.sim({
  id: "c6-c03-polycondensation", ch: "c03", tag: "Original",
  titre: "Polycondensation : l'eau qui s'échappe à chaque liaison",
  resume: "Un diacide et un dialcool (ou une diamine) s'assemblent en chaîne en libérant de l'eau : compte-la.",
  but: "Choisis le polymère et le nombre n de paires de monomères. Compte l'eau libérée et vérifie la conservation de la masse.",
  aRetenir: "Polycondensation : chaque liaison formée (ester ou amide) libère une molécule d'eau. n diacide + n diol → chaîne + (2n − 1) H₂O. Masse de la chaîne : n × M(motif) + 18 g/mol (les extrémités gardent un H et un OH), avec M(motif) = M(A) + M(B) − 2 × 18.",
  piege: "Contrairement à la polyaddition, la polycondensation perd de petites molécules : la masse du polymère est inférieure à la somme des masses des monomères. Et il faut deux fonctions par monomère ; un monomère à une seule fonction arrête la chaîne.",
  build: function(k, S){
    var c = k.canvas(260), P = S.draw.palette;
    var ty = k.seg("Polymère", COND.map(function(x){ return [x.id, x.nom.split(" (")[0]]; }), "pet");
    var nn = k.slider("n (paires de monomères)", 1, 12, 1, 4, "");
    var ro = k.readouts(["Eau libérée", "Masse de la chaîne", "Masse des monomères", "Liaisons"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var T = COND.filter(function(x){ return x.id === ty.value; })[0], n = nn.value, i, ctx = c.ctx;
      var w = Math.min(34, (c.W - 40) / (2 * n)), x = 20, y = 90;
      S.draw.text(c, T.nom, c.W / 2, 20, {size: 13, color: P.ink});
      for (i = 0; i < 2 * n; i++){
        var isA = i % 2 === 0;
        ctx.fillStyle = isA ? T.cA : T.cB; ctx.fillRect(x, y, w - 3, 44);
        if (i < 2 * n - 1){
          S.draw.dot(c, x + w - 1.5, y + 62 + (i % 2) * 14, 4.5, P.teal);
          S.draw.line(c, x + w - 1.5, y + 44, x + w - 1.5, y + 58 + (i % 2) * 14, P.teal, 1.2, [2, 2]);
        }
        x += w;
      }
      S.draw.text(c, "■ " + T.A, 20, 195, {size: 12, color: T.cA, align: "left"});
      S.draw.text(c, "■ " + T.B, 20, 215, {size: 12, color: T.cB, align: "left"});
      S.draw.text(c, "● H₂O libérée (" + (2 * n - 1) + ")", c.W - 20, 195, {size: 12, color: P.teal, align: "right"});
      var nEau = 2 * n - 1, Mch = n * T.rep + 18, Mmon = n * (T.MA + T.MB);
      ro.set(0, nEau + " H₂O par chaîne (" + S.fmt(nEau * 18, 0) + " g par mole de chaîne)"); ro.set(1, S.fmt(Mch, 0) + " g/mol"); ro.set(2, S.fmt(Mmon, 0) + " g/mol"); ro.set(3, nEau + " liaisons " + T.lien);
      nt.set("Bilan : " + S.fmt(Mmon, 0) + " = " + S.fmt(Mch, 0) + " + " + S.fmt(nEau * 18, 0) + " ✓  (usages : " + T.usage + ")", "ok");
    });
  }
});

/* ---------- tri des plastiques ---------- */
var PLA = [
  {code: 1, nom: "PET", rho: 1.38, usage: "bouteilles d'eau et de soda"},
  {code: 2, nom: "PEHD", rho: 0.95, usage: "flacons de lessive, bidons"},
  {code: 3, nom: "PVC", rho: 1.38, usage: "tuyaux, cadres de fenêtre"},
  {code: 4, nom: "PEBD", rho: 0.92, usage: "sacs, films souples"},
  {code: 5, nom: "PP", rho: 0.90, usage: "pots de yaourt, bouchons"},
  {code: 6, nom: "PS", rho: 1.05, usage: "pots, couverts jetables (compact)"}
];
SFA.sim({
  id: "c6-c03-tri", ch: "c03", tag: "Original",
  titre: "Trier les plastiques par flottaison",
  resume: "Règle la masse volumique du liquide et vois quels plastiques flottent ou coulent. Peux-tu séparer le PET du PVC ?",
  but: "Fais varier la masse volumique du liquide. Un plastique flotte si sa masse volumique est inférieure à celle du liquide. Défi : sépare le PEHD du PS, puis tente de séparer le PET du PVC.",
  aRetenir: "Flottaison : ρ(plastique) < ρ(liquide) → ça flotte. Dans l'eau (1,00 g/cm³), PE et PP flottent ; PET, PVC et PS (compact) coulent. En ajustant la masse volumique du liquide (eau salée…), on sépare des plastiques de densités différentes.",
  piege: "Le PET et le PVC ont pratiquement la même masse volumique (≈ 1,38 g/cm³) : on ne peut pas les séparer par flottaison. Or un peu de PVC mélangé au PET abîme le recyclage : les centres de tri utilisent donc d'autres méthodes (détecteurs optiques). Valeurs typiques arrondies : elles varient avec les additifs et la forme.",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette;
    var rl = k.slider("Masse volumique du liquide", 0.80, 1.50, 0.01, 1, "g/cm³");
    k.button("Eau (1,00)", function(){ rl.set(1.00); });
    k.button("Eau très salée (1,20)", function(){ rl.set(1.20); });
    k.button("Éthanol-eau (0,90)", function(){ rl.set(0.90); });
    var ro = k.readouts(["Flottent", "Coulent"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var rho = rl.value, ctx = c.ctx, i;
      var bx = 30, by = 50, bw = c.W - 60, bh = 240;
      ctx.fillStyle = "rgba(90,160,220,.25)"; ctx.fillRect(bx, by + 24, bw, bh - 24);
      ctx.strokeStyle = P.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
      S.draw.text(c, "liquide : " + S.fmt(rho, 2) + " g/cm³", c.W / 2, 28, {size: 14, color: P.acc});
      var fl = [], co = [];
      for (i = 0; i < PLA.length; i++){
        var p = PLA[i], x = bx + (i + 0.5) * bw / PLA.length, up = p.rho < rho - 0.005, mid = Math.abs(p.rho - rho) <= 0.005;
        var y = mid ? by + bh / 2 : (up ? by + 36 : by + bh - 28);
        if (up) fl.push(p.nom); else co.push(p.nom);
        ctx.fillStyle = up ? P.green : P.red; ctx.globalAlpha = .85; ctx.beginPath(); ctx.arc(x, y, 22, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
        S.draw.text(c, p.nom, x, y, {size: 12, color: "#fff"});
        S.draw.text(c, S.fmt(p.rho, 2), x, y + (up ? 36 : -34), {size: 12, color: P.ink});
        S.draw.text(c, "n°" + p.code, x, by + bh + 14, {size: 12, color: P.grey});
      }
      ro.set(0, fl.length ? fl.join(", ") : "aucun"); ro.set(1, co.length ? co.join(", ") : "aucun");
      var pet = rho > 1.38 - 0.005, nn = Math.abs(rho - 1.38) <= 0.005;
      if (nn) nt.set("PET et PVC : même masse volumique, le liquide ne les sépare pas (flottaison impossible).", "warn");
      else if (rho > 0.95 && rho < 1.05) nt.set("PEHD (0,95) flotte et PS (1,05) coule : séparation réussie. Il reste PET/PVC identiques dans le fond.", "ok");
      else nt.set("Essaie une masse volumique qui place PEHD (0,95) et PS (1,05) de part et d'autre.", "ok");
    });
  }
});

/* ---------- test au dibrome ---------- */
var ECH = [
  {nom: "pentane", type: "alcane", db: 0, form: "C₅H₁₂"},
  {nom: "pent-1-ène", type: "alcène", db: 1, form: "C₅H₁₀"},
  {nom: "cyclohexane", type: "cycloalcane (saturé)", db: 0, form: "C₆H₁₂"},
  {nom: "cyclohexène", type: "alcène cyclique", db: 1, form: "C₆H₁₀"},
  {nom: "hexa-1,5-diène", type: "alcène (2 C=C)", db: 2, form: "C₆H₁₀"}
];
SFA.sim({
  id: "c6-c03-dibrome", ch: "c03", tag: "Original",
  titre: "Le test au dibrome : l'alcène décolore, l'alcane non",
  resume: "Ajoute le dibrome goutte à goutte à un échantillon : la couleur orange persiste-t-elle ? Compte les C=C.",
  but: "Choisis l'échantillon et sa quantité, puis ajoute des gouttes d'eau de brome (0,010 mmol de Br₂ par goutte). Repère la goutte à partir de laquelle l'orange persiste.",
  aRetenir: "Le dibrome orange s'additionne sur chaque liaison C=C : 1 Br₂ par double liaison. Tant qu'il reste des C=C, la solution reste incolore ; l'orange persiste quand tout l'alcène a réagi. Avec un alcane, rien ne se passe à l'obscurité : l'orange reste dès la première goutte.",
  piege: "À la lumière vive, un alcane finit par décolorer lentement le dibrome, mais c'est une substitution (R–H + Br₂ → R–Br + HBr, avec dégagement de HBr), pas une addition : la décoloration est lente, et elle ne suit pas la règle « 1 Br₂ par liaison C=C ».",
  build: function(k, S){
    var c = k.canvas(290), P = S.draw.palette;
    var es = k.select("Échantillon", ECH.map(function(e, i){ return [i, e.nom + " (" + e.type + ")"]; }), 1);
    var q = k.slider("Quantité d'échantillon", 0.05, 0.5, 0.05, 0.2, "mmol");
    var dr = k.slider("Gouttes d'eau de brome ajoutées", 0, 60, 1, 10, "");
    var ro = k.readouts(["Br₂ ajouté", "Br₂ consommé", "Br₂ libre", "Observation"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var e = ECH[es.value], n = q.value, d = dr.value, ctx = c.ctx;
      var added = d * 0.010, cons = Math.min(added, n * e.db), left = added - cons;
      var V = 2 + 0.05 * d, conc = left / V, inten = Math.min(1, conc / 0.06);
      var tx = Math.max(12, c.W * 0.05), tw = 70, ty = 30, th = 210;
      var lvl = 70 + Math.min(70, d * 1.2);
      ctx.save(); ctx.fillStyle = "rgba(210,225,235,.5)"; ctx.fillRect(tx, ty + th - lvl - 40, tw, lvl + 40);
      ctx.fillStyle = "rgba(230,110,20," + (inten * 0.9).toFixed(2) + ")"; ctx.fillRect(tx, ty + th - lvl - 40, tw, lvl + 40);
      ctx.strokeStyle = P.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx, ty + th); ctx.lineTo(tx + tw, ty + th); ctx.lineTo(tx + tw, ty); ctx.stroke(); ctx.restore();
      S.draw.text(c, e.nom, tx + tw / 2, ty + th + 18, {size: 12, color: P.grey});
      /* barres : Br2 ajouté / nécessaire */
      var bx = tx + tw + 30, bw = c.W - bx - 14, need = n * e.db, mx = Math.max(0.6, need * 1.2, added);
      function bar(y, val, col, lab){ ctx.fillStyle = "#eef1f5"; ctx.fillRect(bx, y, bw, 22); ctx.fillStyle = col; ctx.fillRect(bx, y, bw * val / mx, 22); S.draw.text(c, lab, bx, y - 10, {size: 12, color: P.ink, align: "left"}); }
      bar(50, added, P.amber, "Br₂ ajouté : " + S.fmt(added, 2) + " mmol");
      bar(110, cons, P.green, "Br₂ consommé : " + S.fmt(cons, 2) + " mmol");
      bar(170, left, P.red, "Br₂ libre : " + S.fmt(left, 2) + " mmol");
      if (e.db > 0) S.draw.line(c, bx + bw * need / mx, 40, bx + bw * need / mx, 200, P.green, 1.6, [4, 3]);
      if (e.db > 0) S.draw.text(c, "nécessaire : " + S.fmt(need, 2), Math.min(bx + bw * need / mx, c.W - 70), 215, {size: 12, color: P.green});
      ro.set(0, S.fmt(added, 2) + " mmol"); ro.set(1, S.fmt(cons, 2) + " mmol"); ro.set(2, S.fmt(left, 2) + " mmol");
      var obs = d === 0 ? "—" : (e.db === 0 ? "orange dès la 1<sup>re</sup> goutte" : left > 1e-9 ? "l'orange persiste" : "décoloré instantanément");
      ro.set(3, obs);
      if (d === 0) nt.set("Ajoute des gouttes de brome.", "ok");
      else if (e.db === 0) nt.set("Pas d'addition possible : pas de C=C. (À la lumière vive, décoloration lente par substitution.)", "ok");
      else if (left > 1e-9) nt.set("Toute la double liaison a réagi : le Br₂ en excès colore la solution. Il en fallait " + S.fmt(need, 2) + " mmol (" + S.fmt(need / 0.010, 0) + " gouttes).", "ok");
      else nt.set("Chaque goutte est décolorée : il reste des liaisons C=C. Il manque " + S.fmt((need - added) / 0.010, 0) + " gouttes pour tout transformer.", "ok");
    });
  }
});
})();
