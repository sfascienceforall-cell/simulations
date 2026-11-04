/* Biostatistique BA1 · chapitre 5 : échantillonnage et théorème central limite */
(function(){
var P = SFA.draw.palette, F = SFA.fmt;
function rng(seed){ var s = seed >>> 0; return function(){ s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gauss(r){ var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function pct(x, d){ return F(x * 100, d === undefined ? 1 : d) + " %"; }
function npdf(x, m, s){ return Math.exp(-0.5 * Math.pow((x - m) / s, 2)) / (s * Math.sqrt(2 * Math.PI)); }

/* 1 ---------------------------------------------------------------- */
var POP = {
  normale: {nom: "normale N(50 ; 10²)", m: 50, s: 10, draw: function(r){ return 50 + 10 * gauss(r); }, f: function(x){ return npdf(x, 50, 10); }},
  uniforme: {nom: "uniforme sur [0 ; 100]", m: 50, s: 100 / Math.sqrt(12), draw: function(r){ return 100 * r(); }, f: function(x){ return x >= 0 && x <= 100 ? 0.01 : 0; }},
  expo: {nom: "exponentielle de moyenne 50", m: 50, s: 50, draw: function(r){ return -50 * Math.log(1 - r()); }, f: function(x){ return x >= 0 ? Math.exp(-x / 50) / 50 : 0; }},
  bimodale: {nom: "bimodale (deux sous-populations)", m: 50, s: Math.sqrt(36 + 625), draw: function(r){ return (r() < 0.5 ? 25 : 75) + 6 * gauss(r); }, f: function(x){ return 0.5 * npdf(x, 25, 6) + 0.5 * npdf(x, 75, 6); }}
};
SFA.sim({
  id: "us-c05-tcl", ch: "c05", tag: "Théorème central limite",
  titre: "Distribution des moyennes : quelle que soit la population de départ",
  resume: "Population uniforme, exponentielle ou bimodale : l'histogramme des moyennes devient une cloche quand n grandit.",
  but: "Choisis la population (courbe du haut) et la taille n de l'échantillon, puis tire des centaines d'échantillons : l'histogramme du bas est celui des moyennes.",
  aRetenir: "Pour n assez grand, la moyenne X̄ suit approximativement N(μ ; σ²/n), quelle que soit la population (de variance finie). L'écart-type de X̄ vaut σ/√n. Plus la population est asymétrique, plus n doit être grand (souvent n ≥ 30, davantage si l'asymétrie est forte).",
  piege: "Le théorème central limite concerne la distribution des moyennes, pas celle des valeurs individuelles : les individus gardent la forme de la population, même avec n = 1000.",
  build: function(k, S){
    var c1 = k.canvas(150), c2 = k.canvas(250), r = rng(Date.now() % 100000), means = [];
    var pop = k.select("Population", [["normale", "Normale"], ["uniforme", "Uniforme"], ["expo", "Exponentielle (asymétrique)"], ["bimodale", "Bimodale"]], "expo", function(){ means = []; });
    var n = k.slider("Taille n de l'échantillon", 1, 100, 1, 5, "", function(){ means = []; });
    function tire(m){ var pp = POP[pop.value]; for (var j = 0; j < m; j++){ var t = 0; for (var i = 0; i < n.value; i++) t += pp.draw(Math.random); means.push(t / n.value); } }
    k.button("Tirer 1 échantillon", function(){ tire(1); }, true); k.button("+ 200 échantillons", function(){ tire(200); }); k.button("+ 2000", function(){ tire(2000); }); k.button("Recommencer", function(){ means = []; });
    var ro = k.readouts(["Échantillons tirés", "Moyenne des moyennes", "Écart-type des moyennes", "σ/√n théorique"]);
    var nt = k.note("", "");
    k.draw(function(){
      c1.clear(); c2.clear();
      var pp = POP[pop.value], N = n.value, se = pp.s / Math.sqrt(N);
      var ax1 = S.draw.axes(c1, {x0: 0, x1: 150, y0: 0, y1: pop.value === "uniforme" ? 0.02 : pop.value === "expo" ? 0.025 : 0.045, stepX: 25, stepY: 0.01, b: 26, xl: "population"});
      S.draw.fn(c1, ax1, pp.f, P.violet, 2.6);
      var x0 = Math.max(0, 50 - 4 * se), x1 = 50 + 4 * se, nb = 40, bw = (x1 - x0) / nb, cnt = [], j;
      for (j = 0; j < nb; j++) cnt.push(0);
      means.forEach(function(m){ var b = Math.floor((m - x0) / bw); if (b >= 0 && b < nb) cnt[b]++; });
      var tot = means.length, dmax = Math.max(npdf(50, 50, se), 1e-9);
      var ymax = Math.max(tot ? Math.max.apply(null, cnt) / (tot * bw) : 0, dmax) * 1.15;
      var ax = S.draw.axes(c2, {x0: x0, x1: x1, y0: 0, y1: ymax, stepY: ymax, b: 34});
      S.draw.text(c2, "moyenne X̄ de l'échantillon", c2.W / 2, c2.H - 8, {size: 12});
      cnt.forEach(function(q, b){ var d = tot ? q / (tot * bw) : 0, xa = ax.X(x0 + b * bw), xb = ax.X(x0 + (b + 1) * bw); c2.ctx.fillStyle = "rgba(30,63,143,.55)"; c2.ctx.fillRect(xa + 0.5, ax.Y(d), xb - xa - 1, ax.Y(0) - ax.Y(d)); });
      S.draw.fn(c2, ax, function(x){ return npdf(x, 50, se); }, P.red, 2.6);
      S.draw.text(c2, "courbe rouge : N(50 ; (σ/√n)²)", c2.W - 16, 20, {size: 12, align: "right", color: P.red});
      var mm = 0, sd = 0; if (tot){ means.forEach(function(m){ mm += m; }); mm /= tot; } if (tot > 1){ means.forEach(function(m){ sd += (m - mm) * (m - mm); }); sd = Math.sqrt(sd / (tot - 1)); }
      ro.set(0, tot); ro.set(1, tot ? F(mm, 2) : "—"); ro.set(2, tot > 1 ? F(sd, 2) : "—"); ro.set(3, F(se, 2));
      nt.set("Population " + pp.nom + " : μ = 50, σ = " + F(pp.s, 1) + ". " + (N < 10 && pop.value !== "normale" ? "Avec n = " + N + " petit, la forme de la population se voit encore dans l'histogramme des moyennes." : N >= 30 ? "n ≥ 30 : l'histogramme des moyennes est proche d'une cloche." : "Augmente n pour voir la cloche apparaître."), "ok");
    });
  }
});

/* 2 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c05-erreur-standard", ch: "c05", tag: "Précision",
  titre: "L'erreur standard décroît en 1/√n : le prix d'une précision double",
  resume: "Pour diviser l'erreur par 2, il faut 4 fois plus de sujets ; par 10, il en faut 100 fois plus.",
  but: "Fixe σ puis fais varier n : suis la courbe ES = σ/√n. Un curseur donne l'erreur standard visée et l'effectif nécessaire.",
  aRetenir: "ES = σ/√n. Pour atteindre une ES cible : n = (σ/ES)². Les premiers sujets apportent le plus : au-delà d'un certain effectif, chaque sujet supplémentaire rapporte peu.",
  piege: "L'ES mesure le hasard d'échantillonnage, pas les biais : doubler n ne corrige pas un échantillon non représentatif.",
  build: function(k, S){
    var c = k.canvas(300);
    var sg = k.slider("Écart-type σ de la grandeur", 5, 30, 1, 12, ""), n = k.slider("Effectif n", 2, 500, 1, 36, ""), cb = k.slider("Erreur standard visée", 0.5, 5, 0.1, 1.5, "");
    var ro = k.readouts(["ES actuelle", "ES avec 4n", "ES avec 100n", "n pour l'ES visée"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var s = sg.value, N = n.value, se = s / Math.sqrt(N), need = Math.ceil(Math.pow(s / cb.value, 2) - 1e-9);
      var ax = S.draw.axes(c, {x0: 0, x1: 500, y0: 0, y1: s / Math.sqrt(2) + 1, xl: "n", yl: "erreur standard σ/√n", stepX: 100});
      S.draw.fn(c, ax, function(x){ return s / Math.sqrt(Math.max(x, 2)); }, P.acc, 2.6);
      S.draw.line(c, ax.X(0), ax.Y(cb.value), ax.X(500), ax.Y(cb.value), P.green, 1.5, [5, 4]);
      S.draw.text(c, "ES visée", ax.X(470), ax.Y(cb.value) - 12, {size: 12, color: P.green});
      S.draw.dot(c, ax.X(N), ax.Y(se), 6, P.red);
      if (4 * N <= 500){ S.draw.dot(c, ax.X(4 * N), ax.Y(se / 2), 6, P.amber); S.draw.line(c, ax.X(N), ax.Y(se), ax.X(4 * N), ax.Y(se / 2), P.amber, 1.2, [3, 3]); S.draw.text(c, "4n : ES / 2", ax.X(4 * N), ax.Y(se / 2) - 12, {size: 12, color: P.amber}); }
      ro.set(0, F(se, 2)); ro.set(1, F(se / 2, 2)); ro.set(2, F(se / 10, 2)); ro.set(3, need);
      nt.set(need > 500 ? "Pour une ES de " + F(cb.value, 1) + " avec σ = " + s + ", il faut n = " + need + " sujets : au-delà de l'échelle du graphique, c'est le coût de la précision." : "Pour atteindre ES = " + F(cb.value, 1) + ", il faut au moins n = " + need + " sujets.", need > 500 ? "warn" : "ok");
    });
  }
});

/* 3 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c05-biais-selection", ch: "c05", tag: "Biais",
  titre: "Comment on échantillonne compte plus que combien",
  resume: "Une population de 400 personnes, une proportion à estimer : quatre manières de choisir l'échantillon.",
  but: "La proportion de personnes sportives décroît de gauche (proche de la salle de sport) à droite. Tire un échantillon, puis 400 échantillons, et compare la distribution des estimations à la vraie proportion.",
  aRetenir: "Un échantillon aléatoire est sans biais ; sa précision augmente avec n. Un échantillon de convenance est biaisé : agrandir n ne supprime pas le biais. Un tirage systématique de pas égal à une période de la liste peut aussi être très mauvais.",
  piege: "Pas de formule qui répare un biais de sélection après coup : ce qu'on a oublié de mesurer reste invisible. Modèle simplifié : une population de 400 personnes en grille 20 × 20.",
  build: function(k, S){
    var c1 = k.canvas(250), c2 = k.canvas(200);
    var r0 = rng(3), pop = [], i, j, tot = 0;
    for (j = 0; j < 20; j++) for (i = 0; i < 20; i++){ var t = r0() < 0.75 - 0.5 * i / 19 ? 1 : 0; pop.push(t); tot += t; }
    var pTrue = tot / 400, cur = [], ests = [];
    var me = k.select("Méthode", [["alea", "Aléatoire simple"], ["conv", "De convenance (près de la salle)"], ["syst", "Systématique (1 sur 20)"], ["grap", "Par grappes (4 lignes entières)"]], "alea", function(){ cur = []; ests = []; });
    var n = k.slider("Taille n (aléatoire, convenance)", 10, 100, 5, 40, "", function(){ ests = []; cur = []; });
    function tirage(){
      var idx = [], a, m = n.value;
      if (me.value === "alea"){ a = []; for (i = 0; i < 400; i++) a.push(i); for (i = 0; i < m; i++){ var q = i + Math.floor(Math.random() * (400 - i)); var tmp = a[i]; a[i] = a[q]; a[q] = tmp; idx.push(a[i]); } }
      else if (me.value === "conv"){ var cand = []; for (i = 0; i < 400; i++) cand.push(i); cand.sort(function(u, v){ return (u % 20) - (v % 20) || u - v; }); cand = cand.slice(0, 2 * m); for (i = 0; i < m; i++){ q = i + Math.floor(Math.random() * (cand.length - i)); tmp = cand[i]; cand[i] = cand[q]; cand[q] = tmp; idx.push(cand[i]); } }
      else if (me.value === "syst"){ var st = Math.floor(Math.random() * 20); for (i = st; i < 400; i += 20) idx.push(i); }
      else { a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]; for (i = 0; i < 4; i++){ q = i + Math.floor(Math.random() * (20 - i)); tmp = a[i]; a[i] = a[q]; a[q] = tmp; for (j = 0; j < 20; j++) idx.push(a[i] * 20 + j); } }
      return idx;
    }
    function est(idx){ var s = 0; idx.forEach(function(q){ s += pop[q]; }); return s / idx.length; }
    k.button("Tirer 1 échantillon", function(){ cur = tirage(); ests.push(est(cur)); }, true);
    k.button("Tirer 400 échantillons", function(){ for (var z = 0; z < 400; z++) ests.push(est(tirage())); cur = []; });
    k.button("Recommencer", function(){ cur = []; ests = []; });
    var ro = k.readouts(["Vraie proportion", "Moyenne des estimations", "Biais", "Écart-type des estimations"]);
    var nt = k.note("", "");
    k.draw(function(){
      c1.clear(); c2.clear();
      var cs = Math.min((c1.W - 40) / 20, (c1.H - 20) / 20), x0 = (c1.W - cs * 20) / 2, y0 = 10, sel = {};
      cur.forEach(function(q){ sel[q] = 1; });
      for (var q = 0; q < 400; q++){ var cx = x0 + (q % 20) * cs + cs / 2, cy = y0 + Math.floor(q / 20) * cs + cs / 2; c1.ctx.beginPath(); c1.ctx.arc(cx, cy, cs * 0.32, 0, 6.2832); c1.ctx.fillStyle = pop[q] ? "rgba(46,107,85,.8)" : "rgba(138,149,163,.35)"; c1.ctx.fill(); if (sel[q]){ c1.ctx.lineWidth = 2.5; c1.ctx.strokeStyle = P.red; c1.ctx.stroke(); } }
      S.draw.text(c1, "salle de sport", x0 - 4, 0, {size: 10, color: P.grey, align: "left", base: "top"});
      var ax = S.draw.axes(c2, {x0: 0, x1: 1, y0: 0, y1: 1, xl: "proportion estimée", stepX: 0.1, stepY: 1, b: 34});
      var nb = 40, cnt = [], m;
      for (m = 0; m < nb; m++) cnt.push(0);
      ests.forEach(function(e){ cnt[Math.min(nb - 1, Math.floor(e * nb))]++; });
      var cm = Math.max.apply(null, cnt.concat([1]));
      cnt.forEach(function(v, b){ var xa = ax.X(b / nb), xb = ax.X((b + 1) / nb), h = v / cm * (ax.Y(0) - ax.Y(1)) * 0.9; c2.ctx.fillStyle = "rgba(30,63,143,.6)"; c2.ctx.fillRect(xa + 0.5, ax.Y(0) - h, xb - xa - 1, h); });
      S.draw.line(c2, ax.X(pTrue), ax.Y(0), ax.X(pTrue), ax.Y(1), P.red, 2.4);
      S.draw.text(c2, "vraie proportion " + pct(pTrue, 1), ax.X(pTrue) + 6, ax.Y(1) + 12, {size: 12, color: P.red, align: "left"});
      var mm = 0, sd = 0; if (ests.length){ ests.forEach(function(e){ mm += e; }); mm /= ests.length; } if (ests.length > 1){ ests.forEach(function(e){ sd += (e - mm) * (e - mm); }); sd = Math.sqrt(sd / (ests.length - 1)); }
      ro.set(0, pct(pTrue, 1)); ro.set(1, ests.length ? pct(mm, 1) : "—"); ro.set(2, ests.length ? F((mm - pTrue) * 100, 1) + " pt" : "—"); ro.set(3, ests.length > 1 ? F(sd * 100, 1) + " pt" : "—");
      var biased = ests.length >= 100 && Math.abs(mm - pTrue) > 0.04;
      nt.set(!ests.length ? "Tire un échantillon pour voir les individus choisis (cercles rouges)." : biased ? "Les estimations sont centrées à " + pct(mm, 1) + " au lieu de " + pct(pTrue, 1) + " : biais de " + F((mm - pTrue) * 100, 1) + " points. Augmenter n ne le réduirait pas." : ests.length >= 100 ? "Estimations centrées sur la vraie valeur (biais faible) ; la dispersion mesure la précision." : "Tire 400 échantillons pour voir le biais et la dispersion.", biased ? "bad" : "ok");
    });
  }
});

/* 4 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c05-regression-moyenne", ch: "c05", tag: "Piège classique",
  titre: "Régression vers la moyenne : les extrêmes se « calment » tout seuls",
  resume: "On sélectionne les 10 % de tensions les plus élevées ; à la 2e mesure, elles baissent, sans aucun traitement.",
  but: "Chaque point est un patient mesuré deux fois (tension systolique). Règle la corrélation entre les deux mesures et la part des patients retenus sur la 1re mesure.",
  aRetenir: "Si la corrélation entre deux mesures est ρ < 1, les sujets extrêmes à la 1re mesure sont en moyenne moins extrêmes à la 2e : écart attendu ≈ ρ × (écart à la moyenne à la 1re). Une baisse « avant-après » sans groupe témoin ne prouve pas l'efficacité d'un traitement.",
  piege: "C'est un phénomène statistique, pas un effet du temps ou d'une intervention. Modèle : deux mesures de loi normale (moyenne 125, écart-type 15 mmHg), corrélation ρ.",
  build: function(k, S){
    var c = k.canvas(330);
    var rho = k.slider("Corrélation ρ entre les 2 mesures", 0, 1, 0.05, 0.6, ""), q = k.slider("Part retenue (les plus élevés)", 5, 50, 5, 10, "%");
    var ro = k.readouts(["Moyenne retenus (mesure 1)", "Moyenne retenus (mesure 2)", "Baisse spontanée", "Prévu : 125 + ρ(m1 − 125)"]);
    var nt = k.note("", "");
    var r = rng(8), z1 = [], e = []; for (var i = 0; i < 300; i++){ z1.push(gauss(r)); e.push(gauss(r)); }
    k.draw(function(){
      c.clear();
      var rr = rho.value, pts = z1.map(function(z, j){ return {x: 125 + 15 * z, y: 125 + 15 * (rr * z + Math.sqrt(1 - rr * rr) * e[j])}; });
      var xs = pts.map(function(p){ return p.x; }).sort(function(a, b){ return b - a; }), cut = xs[Math.round(q.value / 100 * 300) - 1];
      var ax = S.draw.axes(c, {x0: 70, x1: 180, y0: 70, y1: 180, xl: "mesure 1 (mmHg)", yl: "mesure 2", stepX: 20, stepY: 20, b: 34});
      var sx = 0, sy = 0, cn = 0;
      pts.forEach(function(p){ var sel = p.x >= cut; if (sel){ sx += p.x; sy += p.y; cn++; } S.draw.dot(c, ax.X(p.x), ax.Y(p.y), sel ? 4 : 3, sel ? "rgba(180,35,24,.8)" : "rgba(30,63,143,.35)"); });
      S.draw.line(c, ax.X(70), ax.Y(70), ax.X(180), ax.Y(180), P.grey, 1.3, [5, 4]);
      S.draw.line(c, ax.X(70), ax.Y(125 + rr * (70 - 125)), ax.X(180), ax.Y(125 + rr * (180 - 125)), P.green, 2.2);
      S.draw.text(c, "y = x (aucun changement)", ax.X(150), ax.Y(172), {size: 11, color: P.grey}); S.draw.text(c, "droite de régression", ax.X(160), ax.Y(125 + rr * 35) + 14, {size: 11, color: P.green});
      var m1 = sx / cn, m2 = sy / cn;
      ro.set(0, F(m1, 1)); ro.set(1, F(m2, 1)); ro.set(2, F(m1 - m2, 1) + " mmHg"); ro.set(3, F(125 + rr * (m1 - 125), 1));
      nt.set(rr > 0.97 ? "Corrélation presque parfaite : la 2e mesure répète la 1re, il n'y a pas de régression vers la moyenne." : rr < 0.03 ? "Mesures indépendantes : les patients retenus retombent en moyenne à 125 mmHg à la 2e mesure." : "Les " + cn + " patients retenus (rouge) passent de " + F(m1, 1) + " à " + F(m2, 1) + " mmHg en moyenne, sans aucun traitement. Un essai sans groupe témoin attribuerait à tort cette baisse au traitement.", "warn");
    });
  }
});
})();
