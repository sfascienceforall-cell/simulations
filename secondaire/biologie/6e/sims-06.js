/* Chapitre 6 · Évolution : sélection naturelle et adaptation */
(function(){
var B = window.B6;

SFA.sim({
  id: "b6-c06-phalenes", ch: "c06", tag: "Classique",
  titre: "Phalènes du bouleau : l'environnement trie les phénotypes",
  resume: "Selon la couleur de l'écorce, les oiseaux mangent plus souvent la forme claire ou la forme foncée : la population évolue génération après génération.",
  but: "Règle le noircissement de l'écorce (suie), l'intensité de la prédation et la proportion initiale de phalènes foncées, puis lance les générations. Le graphe montre la proportion de formes foncées ; les phalènes visibles sur l'écorce sont celles de la génération affichée.",
  aRetenir: "Variation héréditaire (formes claire et foncée) + survie différentielle (les phalènes mal camouflées sont davantage mangées) = changement de la fréquence des formes au fil des générations. Les individus ne changent pas de couleur : c'est la composition de la population qui change. Avec les valeurs par défaut, la forme foncée passe d'environ 1 % à plus de 95 % en une cinquantaine de générations, comme à Manchester au 19e siècle.",
  piege: "La population ne « décide » pas de s'adapter : la sélection ne crée pas la forme foncée, elle trie des formes déjà présentes. Si l'écorce est à moitié noircie (50 %), aucune forme n'est avantagée. Modèle simplifié : un seul gène, grande population, générations séparées.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette, g = 0;
    var t = k.slider("Noircissement de l'écorce (suie)", 0, 100, 5, 100, "%", function(){ g = 0; lp.pause(); showAll = true; });
    var m = k.slider("Intensité de la prédation", 0, 0.6, 0.05, 0.2, "", function(){ showAll = true; });
    var p0 = k.slider("Phalènes foncées au départ", 1, 99, 1, 1, "%", function(){ showAll = true; });
    var showAll = true, GEN = 60;
    var lp = k.loop(function(dt){ g += dt * 6; if (g >= GEN){ g = GEN; lp.pause(); } k.redraw(); });
    k.button("Lancer les générations", function(){ g = 0; showAll = false; lp.play(); }, true);
    var ro = k.readouts(["Survie forme foncée", "Survie forme claire", "% de foncées à la génération affichée", "Générations pour dépasser 50 %"]);
    var note = k.note("", "");
    var pos = [], r = B.rng(99); for (var i = 0; i < 90; i++) pos.push([r(), r()]);
    function moth(x, y, dark){ var ctx = c.ctx; ctx.save(); ctx.translate(x, y); ctx.fillStyle = dark ? "#1f2227" : "#f3efe4"; ctx.strokeStyle = dark ? "#d8d6cf" : "#2c3a4e"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, 0, 8, 4.5, 0, 0, 6.2832); ctx.fill(); ctx.stroke(); ctx.restore(); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, tt = t.value / 100, mm = m.value;
      var wd = 1 - mm * (0.25 + 0.75 * (1 - tt)), wl = 1 - mm * (0.25 + 0.75 * tt), pr = [p0.value / 100], q;
      for (q = 1; q <= GEN; q++){ var pp = pr[q - 1]; pr.push(pp * wd / (pp * wd + (1 - pp) * wl)); }
      var gi = showAll ? GEN : Math.floor(g), pc = pr[gi];
      /* écorce et phalènes */
      var by = 8, bh = 120, lum = Math.round(215 - tt * 165); ctx.fillStyle = "rgb(" + lum + "," + (lum - 3) + "," + (lum - 8) + ")"; ctx.fillRect(10, by, c.W - 20, bh);
      for (q = 0; q < 8; q++){ ctx.strokeStyle = "rgba(0,0,0,.08)"; ctx.beginPath(); ctx.moveTo(10 + q * (c.W - 20) / 8 + 10, by); ctx.lineTo(10 + q * (c.W - 20) / 8 + 3, by + bh); ctx.stroke(); }
      var nd = Math.round(pc * 90); for (q = 0; q < 90; q++) moth(22 + pos[q][0] * (c.W - 44), by + 12 + pos[q][1] * (bh - 24), q < nd);
      S.draw.text(c, "Génération " + gi + " : " + nd + " foncées sur 90", c.W - 14, by + bh + 14, {size: 12, align: "right", color: P.grey});
      var ax = S.draw.axes(c, {x0: 0, x1: GEN, y0: 0, y1: 100, stepX: 10, stepY: 25, t: by + bh + 28, b: 30, xl: "générations", yl: "% de foncées", l: 44});
      ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.beginPath(); for (q = 0; q <= gi; q++){ var X = ax.X(q), Y = ax.Y(pr[q] * 100); if (q === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); } ctx.stroke();
      S.draw.dot(c, ax.X(gi), ax.Y(pc * 100), 6, P.red);
      var n50 = "—"; if (pr[0] < 0.5 && wd > wl){ var pp2 = pr[0], n = 0; while (pp2 < 0.5 && n < 5000){ pp2 = pp2 * wd / (pp2 * wd + (1 - pp2) * wl); n++; } n50 = n >= 5000 ? "plus de 5 000" : n; } else if (pr[0] >= 0.5) n50 = "déjà dépassé";
      ro.set(0, S.fmt(wd * 100, 1) + " %"); ro.set(1, S.fmt(wl * 100, 1) + " %"); ro.set(2, S.fmt(pc * 100, 1) + " %"); ro.set(3, n50);
      note.set(Math.abs(wd - wl) < 1e-9 ? "Les deux formes ont la même chance de survie : la sélection ne favorise aucune forme, la composition reste inchangée." : wd > wl ? "Écorce sombre : la forme foncée, mieux camouflée, survit davantage et devient majoritaire." : "Écorce claire : c'est la forme claire qui est avantagée ; la proportion de foncées diminue.", "");
    });
  }
});

SFA.sim({
  id: "b6-c06-antibiotiques", ch: "c06", tag: "Santé",
  titre: "Résistance aux antibiotiques : traiter trop court ou trop peu ?",
  resume: "Une infection contient quelques bactéries déjà résistantes : l'antibiotique tue les autres et leur laisse la place.",
  but: "À partir de 10⁸ bactéries au moment du diagnostic, règle la durée du traitement, l'efficacité de l'antibiotique et la fraction initiale de bactéries résistantes. Observe les deux populations (sensible, résistante) et le résultat final.",
  aRetenir: "L'antibiotique ne crée pas la résistance : des bactéries résistantes existent déjà (mutations aléatoires) et sont sélectionnées quand les sensibles disparaissent. Plus il y a de bactéries au départ, plus il y a de chances d'en trouver une résistante. Le système immunitaire peut éliminer un petit nombre de bactéries résistantes, mais pas un grand nombre.",
  piege: "Arrêter trop tôt n'est pas toujours « meilleur pour la flore » : si des bactéries sensibles survivent, elles repoussent. Et prolonger à l'infini n'aide pas contre les résistantes : seul un antibiotique différent agit. Modèle simplifié : croissance ×4 par jour, coût de la résistance 5 %, immunité efficace sous 1 000 bactéries (valeurs pédagogiques).",
  build: function(k, S){
    var c = k.canvas(380), P = S.draw.palette;
    var D = k.slider("Durée du traitement", 0, 14, 1, 5, "jours");
    var kl = k.slider("Efficacité (log₁₀ de sensibles tuées par jour)", 1, 4, 0.5, 2, "log");
    var f0 = k.select("Fraction initiale de résistantes", [[1e-8, "1 sur 100 millions"], [1e-7, "1 sur 10 millions"], [1e-6, "1 sur 1 million"], [1e-5, "1 sur 100 000"], [1e-4, "1 sur 10 000"]], 1e-6);
    var ro = k.readouts(["Résistantes au départ", "Résultat", "Au jour 30 : résistantes / total"]);
    var note = k.note("", "");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, Sn = 1e8 * (1 - +f0.value), R = 1e8 * +f0.value, g = 4, cost = 0.05, K = 1e10, DAYS = 30, i;
      var sa = [Sn], ra = [R], cleared = -1;
      for (i = 1; i <= DAYS; i++){
        if (cleared >= 0){ sa.push(0); ra.push(0); continue; }
        Sn = Sn * g * (i <= D.value ? Math.pow(10, -kl.value) : 1); R = R * g * (1 - cost);
        var tot = Sn + R; if (tot > K){ Sn *= K / tot; R *= K / tot; }
        if (Sn + R < 1000){ Sn = 0; R = 0; cleared = i; }
        sa.push(Sn); ra.push(R);
      }
      var ax = S.draw.axes(c, {x0: 0, x1: DAYS, y0: 0, y1: 10, stepX: 5, stepY: 2, xl: "jours", yl: "log₁₀(nombre de bactéries)", l: 46});
      var lg = function(v){ return v < 1 ? 0 : Math.log10(v); };
      if (D.value > 0){ ctx.fillStyle = "rgba(30,63,143,.09)"; ctx.fillRect(ax.X(0), ax.T, ax.X(D.value) - ax.X(0), ax.B - ax.T); S.draw.text(c, "traitement", ax.X(D.value / 2), ax.B - 12, {size: 12, color: P.acc}); }
      S.draw.line(c, ax.L, ax.Y(3), ax.R, ax.Y(3), P.green, 1.2, [4, 4]); S.draw.text(c, "seuil d'élimination par l'immunité (10³)", ax.R - 4, ax.Y(3) - 9, {size: 12, color: P.green, align: "right"});
      [[sa, P.acc, "sensibles"], [ra, P.red, "résistantes"]].forEach(function(s){
        ctx.strokeStyle = s[1]; ctx.lineWidth = 2.8; ctx.beginPath(); s[0].forEach(function(v, q){ var X = ax.X(q), Y = ax.Y(lg(v)); if (q === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }); ctx.stroke();
      });
      S.draw.text(c, "sensibles", ax.X(22), ax.T + 44, {size: 12, color: P.acc}); S.draw.text(c, "résistantes", ax.X(22), ax.T + 62, {size: 12, color: P.red});
      var R0 = 1e8 * +f0.value; ro.set(0, R0 < 1.5 ? "1 bactérie" : S.sci(R0, 2) + " bactéries");
      var tot30 = sa[DAYS] + ra[DAYS], res = cleared >= 0 ? "Éliminée au jour " + cleared : (ra[DAYS] > sa[DAYS] ? "Échec : souche résistante" : "Infection persistante (sensibles)");
      ro.set(1, res); ro.set(2, cleared >= 0 ? "0" : S.fmt(ra[DAYS] / tot30 * 100, 1) + " %");
      note.set(cleared >= 0 ? "Les bactéries sensibles ont été éliminées par l'antibiotique et les rares résistantes sont maîtrisées par le système immunitaire : guérison." : ra[DAYS] > sa[DAYS] ? "Les résistantes, sans concurrence des sensibles, se sont multipliées pendant le traitement et ont dépassé ce que l'immunité sait éliminer : elles repartent, l'antibiotique n'a plus d'effet." : "Des bactéries sensibles ont survécu ou sont revenues après l'arrêt du traitement : l'infection persiste.", cleared >= 0 ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id: "b6-c06-derive", ch: "c06", tag: "Hasard",
  titre: "Dérive génétique : le hasard seul fait évoluer les fréquences",
  resume: "Plusieurs populations identiques au départ : sans aucune sélection, leurs allèles dérivent au hasard, surtout quand elles sont petites.",
  but: "Chaque courbe est une population de N individus (2N copies du gène) suivie pendant 100 générations. Compare petites et grandes populations. Avec « s », tu peux ajouter une sélection en faveur de l'allèle A et voir quand elle l'emporte sur le hasard.",
  aRetenir: "La dérive est la variation aléatoire des fréquences alléliques due à l'échantillonnage des gamètes. Elle est d'autant plus forte que la population est petite. Elle fait fixer ou disparaître des allèles sans qu'ils soient avantageux ou désavantageux. La diversité génétique diminue en moyenne d'un facteur (1 − 1/2N) à chaque génération.",
  piege: "Fréquence moyenne inchangée ≠ aucune évolution : en moyenne sur beaucoup de populations la fréquence reste p₀ (trait noir), mais chaque population individuelle s'en éloigne. La dérive n'a pas de direction, contrairement à la sélection.",
  build: function(k, S){
    var c = k.canvas(400), P = S.draw.palette, cur = null;
    var N = k.select("Individus par population (N)", [5, 10, 20, 50, 100, 250, 500], 20, function(){ cur = null; });
    var s = k.slider("Avantage sélectif de l'allèle A (s)", 0, 10, 1, 0, "%", function(){ cur = null; });
    var p0 = k.slider("Fréquence initiale de A", 10, 90, 10, 50, "%", function(){ cur = null; });
    var seed = 1; var lp = k.loop(function(dt){ cur += dt * 25; if (cur >= 100){ cur = null; lp.pause(); } k.redraw(); });
    k.button("Nouvelles populations", function(){ seed++; cur = null; });
    k.button("Rejouer l'animation", function(){ cur = 0; lp.play(); }, true);
    var ro = k.readouts(["A fixé (100 %)", "A perdu (0 %)", "Encore variable", "Diversité moyenne (observée / attendue)"]);
    var REP = 16, GEN = 100;
    k.draw(function(){
      c.clear(); var ctx = c.ctx, M = 2 * +N.value, r = B.rng(seed * 6151 + M * 7 + s.value), runs = [], i, g;
      for (i = 0; i < REP; i++){ var p = p0.value / 100, a = [p]; for (g = 1; g <= GEN; g++){ var pe = p * (1 + s.value / 100) / (1 + s.value / 100 * p); p = B.binom(M, pe, r) / M; a.push(p); } runs.push(a); }
      var ax = S.draw.axes(c, {x0: 0, x1: GEN, y0: 0, y1: 100, stepX: 20, stepY: 25, xl: "générations", yl: "% de l'allèle A", l: 44});
      var upto = cur === null ? GEN : Math.floor(cur);
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      runs.forEach(function(a, q){ ctx.strokeStyle = "hsl(" + (q * 360 / REP) + ",65%,45%)"; ctx.globalAlpha = 0.8; ctx.lineWidth = 1.6; ctx.beginPath(); for (var j = 0; j <= upto; j++){ var X = ax.X(j), Y = ax.Y(a[j] * 100); if (j === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); } ctx.stroke(); });
      ctx.globalAlpha = 1; ctx.strokeStyle = "#000"; ctx.lineWidth = 3; ctx.setLineDash([6, 4]); ctx.beginPath();
      for (g = 0; g <= upto; g++){ var mean = 0; runs.forEach(function(a){ mean += a[g]; }); mean /= REP; if (g === 0) ctx.moveTo(ax.X(g), ax.Y(mean * 100)); else ctx.lineTo(ax.X(g), ax.Y(mean * 100)); } ctx.stroke(); ctx.restore();
      S.draw.text(c, "pointillé noir = moyenne des " + REP + " populations", ax.R - 6, ax.T + 30, {size: 12, align: "right", color: P.ink, bg: "rgba(255,255,255,.85)"});
      var fx = 0, lo = 0, H = 0; runs.forEach(function(a){ var e = a[upto]; if (e >= 1) fx++; else if (e <= 0) lo++; H += 2 * e * (1 - e); }); H /= REP;
      var H0 = 2 * (p0.value / 100) * (1 - p0.value / 100), He = H0 * Math.pow(1 - 1 / M, upto);
      ro.set(0, fx + " sur " + REP); ro.set(1, lo + " sur " + REP); ro.set(2, (REP - fx - lo) + " sur " + REP); ro.set(3, S.fmt(H, 2) + " / " + (s.value === 0 ? S.fmt(He, 2) : "—"));
    });
  }
});

SFA.sim({
  id: "b6-c06-selection-dirigee", ch: "c06", tag: "Quantitatif",
  titre: "Sélection d'un caractère : la réponse dépend de l'héritabilité",
  resume: "On ne garde pour reproducteurs qu'une fraction des individus : de combien la moyenne avance-t-elle à chaque génération ?",
  but: "Un caractère varie de façon continue (longueur de bec, en mm). Choisis la proportion d'individus retenus comme reproducteurs et l'héritabilité h² (part de la variation due aux gènes). Fais défiler les générations ou lance l'animation.",
  aRetenir: "Réponse à la sélection : R = h² × S, où S est l'écart entre la moyenne des reproducteurs choisis et la moyenne de la population. Plus on est sélectif, plus S est grand ; plus le caractère est héritable (h² proche de 1), plus la descendance ressemble aux reproducteurs. Si h² = 0, la sélection n'a aucun effet évolutif.",
  piege: "Le caractère doit être héréditaire : un bec large dû uniquement à l'alimentation ne se transmet pas (h² = 0). La moyenne ne progresse pas indéfiniment dans la réalité : la variation génétique s'épuise et le milieu impose des limites. Modèle idéalisé : écart-type constant, distribution normale.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette;
    var h2 = k.slider("Héritabilité h²", 0, 1, 0.05, 0.5, "");
    var pr = k.slider("Proportion de reproducteurs retenus", 5, 90, 5, 20, "%");
    var stop = k.slider("Dernière génération de reproducteurs triés", 0, 20, 1, 20, "");
    var gen = k.slider("Génération affichée", 0, 20, 1, 0, "");
    var lp = k.loop(function(dt, t){ acc += dt * 3; if (acc >= 1){ acc = 0; if (gen.value < 20) gen.set(gen.value + 1); else lp.pause(); } k.redraw(); }), acc = 0;
    k.button("Jouer les générations", function(){ gen.set(0); lp.play(); }, true);
    var ro = k.readouts(["Valeur z du seuil", "Écart sélectionné S (mm)", "Réponse R = h²·S (mm/génération)", "Moyenne affichée (mm)"]);
    var mu0 = 10, sd = 0.6;
    function zq(p){ var lo = -6, hi = 6; for (var i = 0; i < 60; i++){ var mid = (lo + hi) / 2; if (1 - B.Phi(mid) > p) lo = mid; else hi = mid; } return (lo + hi) / 2; }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, p = pr.value / 100, z = zq(p), i_ = B.phi(z) / p, Sd = i_ * sd, R = h2.value * Sd, G = gen.value;
      var mean = function(g){ return mu0 + R * Math.min(g, stop.value); };
      var top = mean(20), XM = Math.max(16, Math.ceil(top + 3 * sd + 0.5)), YM = Math.max(14, Math.ceil(top + 1));   /* axes adaptés : la moyenne peut dépasser 30 mm si la sélection est forte */
      var m = mean(G), ax = S.draw.axes(c, {x0: 6, x1: XM, y0: 0, y1: 0.8, stepX: XM > 26 ? 4 : 2, stepY: 0.2, xl: "longueur du bec (mm)", yl: "fréquence relative", t: 14, b: 190, l: 44});
      var f = function(x, mu){ return B.phi((x - mu) / sd) / sd; };
      if (G <= stop.value){ var thr = m + z * sd; ctx.fillStyle = "rgba(180,35,24,.25)"; ctx.beginPath(); ctx.moveTo(ax.X(thr), ax.Y(0)); for (var x = thr; x <= XM; x += 0.05) ctx.lineTo(ax.X(x), ax.Y(f(x, m))); ctx.lineTo(ax.X(XM), ax.Y(0)); ctx.closePath(); ctx.fill(); S.draw.line(c, ax.X(thr), ax.T, ax.X(thr), ax.B, P.red, 1.6, [5, 4]); S.draw.text(c, "reproducteurs", ax.X(Math.min(thr + 1.8, XM - 1.2)), ax.T + 14, {size: 12, color: P.red}); }
      S.draw.fn(c, ax, function(x){ return f(x, mu0); }, "#9aa6b5", 1.8, [5, 4]);
      S.draw.fn(c, ax, function(x){ return f(x, m); }, P.acc, 3);
      S.draw.line(c, ax.X(m), ax.Y(f(m, m)), ax.X(m), ax.B, P.acc, 1.4, [3, 3]);
      /* moyenne selon les générations */
      var ay = S.draw.axes(c, {x0: 0, x1: 20, y0: 8, y1: YM, stepX: 5, stepY: YM > 28 ? 8 : 4, xl: "générations", yl: "moyenne (mm)", t: ax.B + 46, b: 34, l: 44});
      ctx.strokeStyle = P.green; ctx.lineWidth = 2.6; ctx.beginPath(); for (var g = 0; g <= 20; g++){ var X = ay.X(g), Y = ay.Y(mean(g)); if (g === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); } ctx.stroke();
      S.draw.dot(c, ay.X(G), ay.Y(m), 6, P.red);
      ro.set(0, S.fmt(z, 2)); ro.set(1, S.fmt(Sd, 2)); ro.set(2, S.fmt(R, 2)); ro.set(3, S.fmt(m, 2));
    });
  }
});
})();
