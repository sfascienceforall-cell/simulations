/* Biostatistique BA1 · chapitre 4 : lois binomiale, de Poisson et normale */
(function(){
var P = SFA.draw.palette, F = SFA.fmt;
function Phi(x){ if (x < 0) return 1 - Phi(-x); if (x > 8) return 1; var t = x, s = x, k = 1; for (var i = 0; i < 300; i++){ k += 2; t *= x * x / k; s += t; if (t < 1e-17 * s) break; } return 0.5 + s * Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }
function rng(seed){ var s = seed >>> 0; return function(){ s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gauss(r){ var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
var LF = [0]; for (var i = 1; i <= 700; i++) LF.push(LF[i - 1] + Math.log(i));
function binom(n, p, k){ if (k < 0 || k > n) return 0; if (p <= 0) return k === 0 ? 1 : 0; if (p >= 1) return k === n ? 1 : 0; return Math.exp(LF[n] - LF[k] - LF[n - k] + k * Math.log(p) + (n - k) * Math.log(1 - p)); }
function pois(l, k){ return k < 0 ? 0 : Math.exp(-l + k * Math.log(l) - LF[k]); }
function pct(x, d){ return F(x * 100, d === undefined ? 1 : d) + " %"; }
function bars(c, ax, vals, k0, col, hi, hcol){
  vals.forEach(function(v, i){ var k = k0 + i, xa = ax.X(k - 0.4), xb = ax.X(k + 0.4); c.ctx.fillStyle = (hi && hi(k)) ? hcol : col; c.ctx.fillRect(xa, ax.Y(v), xb - xa, ax.Y(0) - ax.Y(v)); });
}

/* 1 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c04-binomiale", ch: "c04", tag: "Loi binomiale",
  titre: "Binomiale B(n ; p) : forme, espérance, variance",
  resume: "n épreuves indépendantes de probabilité de succès p : lis P(X = k), P(X ≤ k) et la forme de la loi.",
  but: "Fais varier n et p, puis choisis k : les barres colorées sont les valeurs X ≤ k.",
  aRetenir: "E(X) = np ; Var(X) = np(1 − p) ; P(X = k) = C(n,k)·pᵏ·(1 − p)ⁿ⁻ᵏ. La loi est symétrique si p = 0,5 et s'étire à droite si p est petit.",
  piege: "La binomiale suppose des épreuves indépendantes et un même p : tirer sans remise dans une petite population la fausse (loi hypergéométrique).",
  build: function(k, S){
    var c = k.canvas(300);
    var n = k.slider("n (nombre d'épreuves)", 1, 60, 1, 20, ""), p = k.slider("p (probabilité de succès)", 0.01, 0.99, 0.01, 0.25, ""), kk = k.slider("k", 0, 60, 1, 5, "");
    var ro = k.readouts(["P(X = k)", "P(X ≤ k)", "P(X ≥ k)", "E(X) ; σ"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var N = n.value, q = p.value, K = Math.min(kk.value, N), v = [], j;
      for (j = 0; j <= N; j++) v.push(binom(N, q, j));
      var ymax = Math.max.apply(null, v) * 1.15;
      var ax = S.draw.axes(c, {x0: -1, x1: N + 1, y0: 0, y1: ymax, xl: "k", yl: "P(X = k)", stepX: N > 30 ? 5 : N > 12 ? 2 : 1});
      bars(c, ax, v, 0, "rgba(30,63,143,.5)", function(t){ return t <= K; }, "rgba(180,35,24,.65)");
      var le = 0; for (j = 0; j <= K; j++) le += v[j];
      var eq = v[K];
      ro.set(0, F(eq, 4)); ro.set(1, F(le, 4)); ro.set(2, F(1 - le + eq, 4)); ro.set(3, F(N * q, 2) + " ; " + F(Math.sqrt(N * q * (1 - q)), 2));
      nt.set(kk.value > N ? "k ramené à n = " + N + " (X ne peut pas dépasser n). " : "" + "P(X ≤ k) est la somme des barres rouges.", kk.value > N ? "warn" : "ok");
    });
  }
});

/* 2 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c04-poisson", ch: "c04", tag: "Événements rares",
  titre: "Poisson : comptages rares et approximation de la binomiale",
  resume: "Nombre de colonies, de désintégrations, de mutations : Poisson(λ) contre binomiale(n ; λ/n).",
  but: "Fais varier λ (nombre moyen d'événements) puis superpose la binomiale de même moyenne avec n croissant.",
  aRetenir: "P(X = k) = e^(−λ)·λᵏ/k! ; E(X) = Var(X) = λ. La binomiale B(n ; p) tend vers Poisson(np) quand n est grand et p petit.",
  piege: "Poisson impose variance = moyenne. Si la variance observée est bien plus grande que la moyenne (agrégats, contagion), le modèle de Poisson ne convient pas.",
  build: function(k, S){
    var c = k.canvas(300);
    var lam = k.slider("λ (événements attendus)", 0.2, 15, 0.1, 3, ""), tg = k.toggle("Superposer la binomiale B(n ; λ/n)", true), n = k.slider("n de la binomiale", 20, 500, 10, 40, "");
    var ro = k.readouts(["P(X = 0)", "P(X ≥ 1)", "Écart max Poisson–binomiale", "σ"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var l = lam.value, N = n.value, kmax = Math.ceil(l + 4.5 * Math.sqrt(l) + 4), vp = [], vb = [], j, md = 0;
      for (j = 0; j <= kmax; j++){ vp.push(pois(l, j)); vb.push(binom(N, l / N, j)); md = Math.max(md, Math.abs(vp[j] - vb[j])); }
      var ymax = Math.max(Math.max.apply(null, vp), Math.max.apply(null, vb)) * 1.15;
      var ax = S.draw.axes(c, {x0: -1, x1: kmax + 1, y0: 0, y1: ymax, xl: "k", yl: "P(X = k)", stepX: kmax > 24 ? 4 : 2});
      bars(c, ax, vp, 0, "rgba(14,116,144,.55)");
      if (tg.value){ vb.forEach(function(v, i){ var xa = ax.X(i - 0.4), xb = ax.X(i + 0.4); c.ctx.strokeStyle = P.red; c.ctx.lineWidth = 2; c.ctx.strokeRect(xa, ax.Y(v), xb - xa, ax.Y(0) - ax.Y(v)); }); }
      S.draw.text(c, "barres : Poisson(λ)   contours rouges : binomiale", c.W - 20, 20, {size: 12, align: "right", color: P.grey});
      ro.set(0, F(Math.exp(-l), 4)); ro.set(1, F(1 - Math.exp(-l), 4)); ro.set(2, tg.value ? F(md, 4) : "—"); ro.set(3, F(Math.sqrt(l), 2));
      nt.set(tg.value ? (md < 0.005 ? "Les deux lois sont presque identiques (écart maximal " + F(md, 4) + ") : n grand et p petit." : "L'écart est visible : p = λ/n = " + F(l / N, 3) + " n'est pas assez petit. Augmente n.") : "E(X) = Var(X) = λ = " + F(l, 1) + ".", "ok");
    });
  }
});

/* 3 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c04-normale", ch: "c04", tag: "Loi normale",
  titre: "Loi normale : aires, scores z et règle 68–95–99,7",
  resume: "Une glycémie N(μ ; σ²) : choisis deux bornes, lis l'aire (proportion) et les scores z.",
  but: "Règle la moyenne μ et l'écart-type σ de la glycémie à jeun (mg/dL), puis les bornes a et b : la zone colorée est la proportion d'individus entre a et b.",
  aRetenir: "z = (x − μ)/σ ramène à la loi N(0 ; 1). À peu près 68 % des valeurs sont à moins de 1σ de μ, 95 % à moins de 2σ (exactement 1,96σ), 99,7 % à moins de 3σ.",
  piege: "Pour une loi continue, P(X = a) = 0 : seules les aires entre deux bornes ont un sens. La règle 68–95–99,7 n'est valable que pour une distribution (approximativement) normale.",
  build: function(k, S){
    var c = k.canvas(300);
    var mu = k.slider("Moyenne μ", 70, 120, 1, 90, "mg/dL"), sg = k.slider("Écart-type σ", 4, 20, 1, 8, "mg/dL");
    var a = k.slider("Borne a", 40, 160, 1, 82, "mg/dL"), b = k.slider("Borne b", 40, 160, 1, 106, "mg/dL");
    var bd = k.toggle("Montrer μ ± 1σ, 2σ, 3σ", false);
    var ro = k.readouts(["z(a)", "z(b)", "Proportion entre a et b", "Hors de [a ; b]"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var m = mu.value, s = sg.value, lo = Math.min(a.value, b.value), hi = Math.max(a.value, b.value);
      function f(x){ return Math.exp(-0.5 * Math.pow((x - m) / s, 2)) / (s * Math.sqrt(2 * Math.PI)); }
      var ax = S.draw.axes(c, {x0: 40, x1: 160, y0: 0, y1: 0.11, xl: "glycémie (mg/dL)", stepX: 10, stepY: 0.02});
      var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.moveTo(ax.X(lo), ax.Y(0));
      for (var x = lo; x <= hi + 0.01; x += 0.5) ctx.lineTo(ax.X(Math.min(x, hi)), ax.Y(f(Math.min(x, hi))));
      ctx.lineTo(ax.X(hi), ax.Y(0)); ctx.closePath(); ctx.fillStyle = "rgba(30,63,143,.3)"; ctx.fill(); ctx.restore();
      if (bd.value){ [1, 2, 3].forEach(function(q, i){ [-1, 1].forEach(function(sgn){ S.draw.line(c, ax.X(m + sgn * q * s), ax.Y(0), ax.X(m + sgn * q * s), ax.Y(f(m + sgn * q * s)), P.amber, 1.5, [4, 3]); }); S.draw.text(c, q + "σ", ax.X(m + q * s), ax.Y(0) - 12, {size: 11, color: P.amber}); }); }
      S.draw.fn(c, ax, f, P.acc, 2.6);
      S.draw.line(c, ax.X(m), ax.Y(0), ax.X(m), ax.Y(f(m)), P.ink, 1.5, [4, 3]);
      var za = (lo - m) / s, zb = (hi - m) / s, area = Phi(zb) - Phi(za);
      ro.set(0, F(za, 2)); ro.set(1, F(zb, 2)); ro.set(2, pct(area, 2)); ro.set(3, pct(1 - area, 2));
      nt.set(Math.abs(za + 1.96) < 0.03 && Math.abs(zb - 1.96) < 0.03 ? "Bornes à ±1,96σ : 95 % des valeurs sont à l'intérieur." : "Aire sous la courbe entre a et b = proportion de la population. Calcul : Φ(" + F(zb, 2) + ") − Φ(" + F(za, 2) + ").", "ok");
    });
  }
});

/* 4 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c04-approx-normale", ch: "c04", tag: "Approximation",
  titre: "Approcher la binomiale par une normale : avec ou sans correction de continuité",
  resume: "Compare P(X ≤ k) exacte, approchée par la normale, avec et sans correction de continuité.",
  but: "Choisis n, p et k. Vérifie quand la courbe normale épouse les barres et quelle valeur (k ou k + 0,5) donne la meilleure approximation.",
  aRetenir: "B(n ; p) ≈ N(np ; np(1 − p)) si np et n(1 − p) sont suffisamment grands (règle usuelle ≥ 5, parfois ≥ 10). Correction de continuité : P(X ≤ k) ≈ Φ((k + 0,5 − np)/σ).",
  piege: "Sans correction, on perd une demi-barre : l'erreur est surtout visible pour n petit. Si p est proche de 0 ou 1, la normale est inadaptée : utilise la loi exacte ou Poisson.",
  build: function(k, S){
    var c = k.canvas(300);
    var n = k.slider("n", 5, 200, 1, 40, ""), p = k.slider("p", 0.02, 0.98, 0.01, 0.3, ""), kk = k.slider("k", 0, 200, 1, 10, "");
    var ro = k.readouts(["Exacte P(X ≤ k)", "Normale sans correction", "Normale avec correction", "Erreur avec correction"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var N = n.value, q = p.value, K = Math.min(kk.value, N), m = N * q, s = Math.sqrt(N * q * (1 - q)), v = [], j, ex = 0;
      for (j = 0; j <= N; j++){ v.push(binom(N, q, j)); if (j <= K) ex += v[j]; }
      var x0 = Math.max(-1, m - 4.2 * s), x1 = Math.min(N + 1, m + 4.2 * s);
      var dens = function(x){ return Math.exp(-0.5 * Math.pow((x - m) / s, 2)) / (s * Math.sqrt(2 * Math.PI)); };
      var ymax = Math.max(Math.max.apply(null, v), dens(m)) * 1.15;
      var ax = S.draw.axes(c, {x0: x0, x1: x1, y0: 0, y1: ymax, xl: "k", yl: "P(X = k)", stepX: Math.max(1, Math.round((x1 - x0) / 10))});
      bars(c, ax, v, 0, "rgba(30,63,143,.4)", function(t){ return t <= K; }, "rgba(180,35,24,.55)");
      S.draw.fn(c, ax, dens, P.green, 2.6);
      S.draw.line(c, ax.X(K + 0.5), ax.Y(0), ax.X(K + 0.5), ax.Y(ymax), P.ink, 1.5, [5, 4]);
      S.draw.text(c, "k + 0,5", ax.X(K + 0.5), ax.Y(ymax) + 6, {size: 11});
      var a1 = Phi((K - m) / s), a2 = Phi((K + 0.5 - m) / s);
      ro.set(0, F(ex, 4)); ro.set(1, F(a1, 4)); ro.set(2, F(a2, 4)); ro.set(3, F(a2 - ex, 4));
      var okk = m >= 5 && N * (1 - q) >= 5;
      nt.set(okk ? "np = " + F(m, 1) + " et n(1 − p) = " + F(N * (1 - q), 1) + " : conditions usuelles remplies. La correction (k + 0,5) rapproche presque toujours de la valeur exacte." : "np = " + F(m, 1) + " ou n(1 − p) = " + F(N * (1 - q), 1) + " est inférieur à 5 : la loi est asymétrique, l'approximation normale est médiocre.", okk ? "ok" : "warn");
    });
  }
});

/* 5 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c04-log-qq", ch: "c04", tag: "Normalité",
  titre: "Reconnaître l'asymétrie : histogramme, droite de Henry, logarithme",
  resume: "Un dosage biologique à queue droite : la transformation logarithmique le rend (presque) normal.",
  but: "300 valeurs de type log-normal (dosage). Augmente l'asymétrie puis active le logarithme : l'histogramme se symétrise et la droite de Henry se redresse.",
  aRetenir: "Dans un diagramme quantile–quantile (droite de Henry), des points alignés indiquent une loi normale ; une courbure en « banane » indique une asymétrie. Le logarithme corrige une asymétrie à droite quand les valeurs sont positives.",
  piege: "Ces données sont simulées pour être log-normales : en pratique, aucun jeu de données n'est parfaitement normal ; on juge l'écart à l'œil, avec la taille de l'échantillon en tête. Pour des valeurs nulles, le logarithme n'est pas défini.",
  build: function(k, S){
    var c1 = k.canvas(220), c2 = k.canvas(230);
    var sg = k.slider("Dispersion de ln(X)", 0.1, 1, 0.05, 0.7, "");
    var lg = k.toggle("Appliquer le logarithme", false);
    var ro = k.readouts(["Moyenne", "Médiane", "Asymétrie (g₁)", "Échelle"]);
    var nt = k.note("", "");
    var r = rng(21), zs = []; for (var i = 0; i < 300; i++) zs.push(gauss(r));
    zs.sort(function(a, b){ return a - b; });
    var nz = []; for (i = 0; i < 300; i++) nz.push(zs[i]);
    /* ordre mélangé non nécessaire : on garde les valeurs triées pour la droite de Henry */
    k.draw(function(){
      c1.clear(); c2.clear();
      var s = sg.value, mu0 = Math.log(8), d = zs.map(function(z){ var x = Math.exp(mu0 + s * z); return lg.value ? Math.log(x) : x; });
      var n = d.length, mn = d.reduce(function(a, b){ return a + b; }, 0) / n, m2 = 0, m3 = 0;
      d.forEach(function(x){ m2 += Math.pow(x - mn, 2); m3 += Math.pow(x - mn, 3); }); m2 /= n; m3 /= n;
      var g1 = m3 / Math.pow(m2, 1.5), md = (d[149] + d[150]) / 2, sd = Math.sqrt(m2 * n / (n - 1));
      var lo = lg.value ? -1 : 0, hi = lg.value ? 5.5 : 80, nb = 26, cnt = [], j;
      for (j = 0; j < nb; j++) cnt.push(0);
      d.forEach(function(x){ var b = Math.floor((x - lo) / (hi - lo) * nb); if (b >= 0 && b < nb) cnt[b]++; });
      var ymax = Math.max(40, Math.ceil(Math.max.apply(null, cnt) * 1.1 / 10) * 10);
      var ax = S.draw.axes(c1, {x0: lo, x1: hi, y0: 0, y1: ymax, xl: lg.value ? "ln(concentration)" : "concentration (mg/L)", yl: "effectif", stepX: lg.value ? 1 : 10, b: 34});
      cnt.forEach(function(q, b){ var xa = ax.X(lo + b * (hi - lo) / nb), xb = ax.X(lo + (b + 1) * (hi - lo) / nb); c1.ctx.fillStyle = "rgba(30,63,143,.55)"; c1.ctx.fillRect(xa + 0.5, ax.Y(q), xb - xa - 1, ax.Y(0) - ax.Y(q)); });
      S.draw.line(c1, ax.X(mn), ax.Y(0), ax.X(mn), ax.Y(ymax), P.red, 2); S.draw.line(c1, ax.X(md), ax.Y(0), ax.X(md), ax.Y(ymax), P.green, 2);
      S.draw.text(c1, "moyenne (rouge) · médiane (verte)", c1.W - 16, 22, {size: 12, align: "right", color: P.grey});
      /* droite de Henry : valeurs standardisées contre quantiles théoriques */
      var bx = S.draw.axes(c2, {x0: -3, x1: 3, y0: -3, y1: 5, xl: "quantile théorique z", yl: "valeur standardisée", stepX: 1, stepY: 1, b: 34});
      S.draw.line(c2, bx.X(-3), bx.Y(-3), bx.X(3), bx.Y(3), P.grey, 1.2, [5, 4]);
      var invp = function(p){ var a = -9, b = 9; for (var q = 0; q < 50; q++){ var t = (a + b) / 2; if (Phi(t) < p) a = t; else b = t; } return (a + b) / 2; };
      for (j = 0; j < n; j += 3){ S.draw.dot(c2, bx.X(invp((j + 0.5) / n)), bx.Y((d[j] - mn) / sd), 3, P.acc); }
      ro.set(0, F(mn, 2)); ro.set(1, F(md, 2)); ro.set(2, F(g1, 2)); ro.set(3, lg.value ? "ln(mg/L)" : "mg/L");
      nt.set(Math.abs(g1) > 0.7 ? "Asymétrie nette (g₁ = " + F(g1, 2) + ") : la moyenne dépasse la médiane et les points de la droite de Henry s'écartent en courbe de la diagonale. Essaie le logarithme." : "Asymétrie faible (g₁ = " + F(g1, 2) + ") : histogramme presque symétrique, points proches de la diagonale. Une moyenne ± écart-type est alors un résumé raisonnable.", Math.abs(g1) > 0.7 ? "warn" : "ok");
    });
  }
});
})();
