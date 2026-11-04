/* Biostatistique BA1 · chapitre 3 : Bayes et tests diagnostiques */
(function(){
var P = SFA.draw.palette, F = SFA.fmt;
function Phi(x){ if (x < 0) return 1 - Phi(-x); if (x > 8) return 1; var t = x, s = x, k = 1; for (var i = 0; i < 300; i++){ k += 2; t *= x * x / k; s += t; if (t < 1e-17 * s) break; } return 0.5 + s * Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }
function pct(x, d){ return F(x * 100, d === undefined ? 1 : d) + " %"; }
function vpp(pr, se, sp){ var tp = pr * se, fp = (1 - pr) * (1 - sp); return tp + fp > 0 ? tp / (tp + fp) : 0; }
function vpn(pr, se, sp){ var tn = (1 - pr) * sp, fn = pr * (1 - se); return tn + fn > 0 ? tn / (tn + fn) : 0; }

/* 1 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c03-tableau", ch: "c03", tag: "Fréquences naturelles",
  titre: "Le tableau 2×2 sur 10 000 personnes",
  resume: "Prévalence, sensibilité, spécificité : remplis le tableau et lis les valeurs prédictives.",
  but: "Imagine 10 000 personnes dépistées. Règle la prévalence, la sensibilité et la spécificité ; lis vrais et faux positifs, puis VPP et VPN.",
  aRetenir: "Se = VP/(VP+FN) et Sp = VN/(VN+FP) ne dépendent pas de la prévalence ; VPP = VP/(VP+FP) et VPN = VN/(VN+FN) en dépendent. Raisonne en effectifs : « sur 10 000 personnes… ».",
  piege: "« Test positif » ne veut pas dire « malade à 99 % » : si la maladie est rare, la majorité des positifs peuvent être de faux positifs.",
  build: function(k, S){
    var c = k.canvas(330);
    var pr = k.slider("Prévalence", 0.1, 50, 0.1, 1, "%"), se = k.slider("Sensibilité", 50, 100, 1, 90, "%"), sp = k.slider("Spécificité", 50, 100, 1, 95, "%");
    var ro = k.readouts(["VPP", "VPN", "Faux positifs / vrais positifs", "Positifs au total"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var N = 10000, p = pr.value / 100, s1 = se.value / 100, s2 = sp.value / 100, ctx = c.ctx;
      var M = N * p, Sn = N - M, VP = M * s1, FN = M - VP, VN = Sn * s2, FP = Sn - VN;
      var cw = Math.min(150, (c.W - 140) / 3), rh = 46, tx = 100, ty = 20;
      ctx.save(); ctx.font = "700 13px Mulish, system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = P.grey;
      ctx.fillText("Malades", tx + cw * 0.5, ty); ctx.fillText("Sains", tx + cw * 1.5, ty); ctx.fillText("Total", tx + cw * 2.5, ty);
      ctx.fillStyle = P.ink; ctx.textAlign = "right"; ctx.fillText("Test +", tx - 8, ty + rh); ctx.fillText("Test −", tx - 8, ty + rh * 2); ctx.fillText("Total", tx - 8, ty + rh * 3);
      var cells = [[VP, "rgba(46,107,85,.35)", 0, 1], [FP, "rgba(180,35,24,.35)", 1, 1], [FN, "rgba(180,83,9,.30)", 0, 2], [VN, "rgba(46,107,85,.2)", 1, 2], [M, "#e7ebf2", 0, 3], [Sn, "#e7ebf2", 1, 3], [VP + FP, "#e7ebf2", 2, 1], [FN + VN, "#e7ebf2", 2, 2], [N, "#e7ebf2", 2, 3]];
      cells.forEach(function(q){ ctx.fillStyle = q[1]; ctx.fillRect(tx + cw * q[2] + 2, ty + rh * q[3] - rh / 2 + 2, cw - 4, rh - 4); ctx.fillStyle = P.ink; ctx.textAlign = "center"; ctx.fillText(F(Math.round(q[0]), 0), tx + cw * (q[2] + 0.5), ty + rh * q[3]); });
      ctx.restore();
      S.draw.text(c, "VP", tx + 14, ty + rh - 14, {size: 10, color: P.green}); S.draw.text(c, "FP", tx + cw + 14, ty + rh - 14, {size: 10, color: P.red});
      S.draw.text(c, "FN", tx + 14, ty + rh * 2 - 14, {size: 10, color: P.amber}); S.draw.text(c, "VN", tx + cw + 14, ty + rh * 2 - 14, {size: 10, color: P.green});
      /* barre des positifs */
      var by = ty + rh * 3 + 44, bw = c.W - 60, pos = VP + FP, fv = pos > 0 ? VP / pos : 0;
      S.draw.text(c, "Parmi les " + F(Math.round(pos), 0) + " positifs : vrais positifs (vert) et faux positifs (rouge)", 30, by - 16, {size: 12, align: "left"});
      ctx.fillStyle = "rgba(46,107,85,.75)"; ctx.fillRect(30, by, bw * fv, 30); ctx.fillStyle = "rgba(180,35,24,.75)"; ctx.fillRect(30 + bw * fv, by, bw * (1 - fv), 30);
      S.draw.text(c, "VPP = " + pct(fv, 1), 30 + Math.max(60, bw * fv / 2), by + 15, {size: 13, color: "#fff"});
      var pp = vpp(p, s1, s2), pn = vpn(p, s1, s2);
      ro.set(0, pct(pp)); ro.set(1, pct(pn, 2)); ro.set(2, VP > 0 ? F(FP / VP, 1) + " pour 1" : "—"); ro.set(3, F(Math.round(pos), 0));
      nt.set(pp < 0.5 ? "Avec cette prévalence, plus de la moitié des tests positifs sont de faux positifs : le VPP (" + pct(pp) + ") est inférieur à 50 %. Les effectifs sont arrondis à l'unité dans le tableau." : "Les vrais positifs dominent parmi les positifs (VPP " + pct(pp) + "). Les effectifs sont arrondis à l'unité dans le tableau.", pp < 0.5 ? "warn" : "ok");
    });
  }
});

/* 2 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c03-prevalence", ch: "c03", tag: "Dépistage",
  titre: "La valeur prédictive dépend de la prévalence",
  resume: "Un même test, deux populations : la VPP s'effondre quand la maladie devient rare.",
  but: "Fixe sensibilité et spécificité. Fais glisser la prévalence : suis VPP et VPN le long de leurs courbes.",
  aRetenir: "Se et Sp sont des propriétés du test ; VPP et VPN sont des propriétés du test dans une population. VPP augmente avec la prévalence, VPN diminue.",
  piege: "Même un test à 99 % de sensibilité et de spécificité a une VPP faible pour une maladie à 1 pour 10 000.",
  build: function(k, S){
    var c = k.canvas(330);
    var se = k.slider("Sensibilité", 50, 100, 0.5, 95, "%"), sp = k.slider("Spécificité", 50, 100, 0.5, 95, "%");
    var pr = k.slider("Prévalence", 0.1, 100, 0.1, 5, "%");
    var ro = k.readouts(["VPP", "VPN", "RV+", "RV−"]);
    k.draw(function(){
      c.clear();
      var s1 = se.value / 100, s2 = sp.value / 100, p = pr.value / 100;
      var ax = S.draw.axes(c, {x0: 0, x1: 1, y0: 0, y1: 1, xl: "prévalence", yl: "valeur prédictive", stepX: 0.1, stepY: 0.2});
      S.draw.fn(c, ax, function(x){ return vpp(x, s1, s2); }, P.red, 2.6);
      S.draw.fn(c, ax, function(x){ return vpn(x, s1, s2); }, P.green, 2.6);
      S.draw.line(c, ax.X(p), ax.Y(0), ax.X(p), ax.Y(1), P.grey, 1.2, [4, 4]);
      S.draw.dot(c, ax.X(p), ax.Y(vpp(p, s1, s2)), 6, P.red); S.draw.dot(c, ax.X(p), ax.Y(vpn(p, s1, s2)), 6, P.green);
      S.draw.text(c, "VPP", ax.X(0.8), ax.Y(vpp(0.8, s1, s2)) + 16, {color: P.red}); S.draw.text(c, "VPN", ax.X(0.35), ax.Y(vpn(0.35, s1, s2)) - 14, {color: P.green});
      ro.set(0, pct(vpp(p, s1, s2))); ro.set(1, pct(vpn(p, s1, s2), 2));
      ro.set(2, s2 < 1 ? F(s1 / (1 - s2), 1) : "∞"); ro.set(3, s2 > 0 ? F((1 - s1) / s2, 3) : "—");
    });
  }
});

/* 3 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c03-roc", ch: "c03", tag: "Seuil et courbe ROC",
  titre: "Déplacer le seuil : sensibilité contre spécificité",
  resume: "Deux distributions (sains, malades), un seuil, la courbe ROC qui en résulte et son aire.",
  but: "Écarte les deux distributions (Δ) puis fais glisser le seuil : tout test positif au-dessus du seuil. Suis le point sur la courbe ROC.",
  aRetenir: "Abaisser le seuil augmente la sensibilité et diminue la spécificité (et inversement). La courbe ROC trace Se contre 1 − Sp ; l'aire AUC mesure la séparation (0,5 = hasard, 1 = parfait).",
  piege: "Modèle simplifié : deux lois normales de même écart-type. Le « meilleur » seuil dépend du coût d'un faux négatif contre celui d'un faux positif, pas seulement de l'indice de Youden.",
  build: function(k, S){
    var c1 = k.canvas(220), c2 = k.canvas(280);
    var dl = k.slider("Écart Δ entre moyennes (en écarts-types)", 0, 4, 0.1, 2, "σ");
    var th = k.slider("Seuil", -2, 6, 0.1, 1, "");
    var ro = k.readouts(["Sensibilité", "Spécificité", "AUC", "Se + Sp − 1"]);
    var nt = k.note("", "");
    function phi(x){ return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }
    k.draw(function(){
      var D = dl.value, t = th.value, se = 1 - Phi(t - D), sp = Phi(t);
      c1.clear(); c2.clear();
      var ax = S.draw.axes(c1, {x0: -4, x1: 8, y0: 0, y1: 0.45, xl: "valeur du marqueur (unités d'écart-type)", stepX: 1, stepY: 0.1});
      var ctx = c1.ctx;
      ctx.save(); ctx.beginPath(); ctx.moveTo(ax.X(t), ax.Y(0));
      for (var x = t; x <= 8.0001; x += 0.05) ctx.lineTo(ax.X(x), ax.Y(phi(x - D))); ctx.lineTo(ax.X(8), ax.Y(0)); ctx.closePath(); ctx.fillStyle = "rgba(180,35,24,.28)"; ctx.fill();
      ctx.beginPath(); ctx.moveTo(ax.X(-4), ax.Y(0));
      for (x = -4; x <= t + 0.0001; x += 0.05) ctx.lineTo(ax.X(x), ax.Y(phi(x))); ctx.lineTo(ax.X(t), ax.Y(0)); ctx.closePath(); ctx.fillStyle = "rgba(46,107,85,.28)"; ctx.fill(); ctx.restore();
      S.draw.fn(c1, ax, function(x){ return phi(x); }, P.green, 2.4); S.draw.fn(c1, ax, function(x){ return phi(x - D); }, P.red, 2.4);
      S.draw.line(c1, ax.X(t), ax.Y(0), ax.X(t), ax.Y(0.45), P.ink, 2);
      S.draw.text(c1, "sains", ax.X(0), ax.Y(0.4) - 6, {color: P.green}); S.draw.text(c1, "malades", ax.X(D), ax.Y(0.4) - 6, {color: P.red});
      /* ROC */
      var size = Math.min(c2.H - 50, c2.W - 120), mx = (c2.W - size) / 2;
      var bx = S.draw.axes(c2, {x0: 0, x1: 1, y0: 0, y1: 1, xl: "1 − spécificité", yl: "sensibilité", l: mx, r: mx, stepX: 0.2, stepY: 0.2});
      S.draw.line(c2, bx.X(0), bx.Y(0), bx.X(1), bx.Y(1), P.grey, 1.2, [5, 4]);
      S.draw.fn(c2, bx, function(f){ if (f <= 0) return 0; if (f >= 1) return 1; var lo = -9, hi = 9; for (var i = 0; i < 40; i++){ var m = (lo + hi) / 2; if (1 - Phi(m) > f) lo = m; else hi = m; } return 1 - Phi((lo + hi) / 2 - D); }, P.acc, 2.8);
      S.draw.dot(c2, bx.X(1 - sp), bx.Y(se), 7, P.red);
      var auc = Phi(D / Math.SQRT2);
      ro.set(0, pct(se)); ro.set(1, pct(sp)); ro.set(2, F(auc, 3)); ro.set(3, F(se + sp - 1, 3));
      nt.set(D < 0.2 ? "Distributions presque confondues : la courbe ROC colle à la diagonale (AUC ≈ 0,5), le test n'apporte rien." : "Le seuil qui maximise Se + Sp − 1 est ici au milieu des deux moyennes, soit " + F(D / 2, 2) + " (modèle à variances égales). Seuil actuel : " + F(t, 1) + ".", D < 0.2 ? "warn" : "ok");
    });
  }
});

/* 4 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c03-fagan", ch: "c03", tag: "Probabilité pré- et post-test",
  titre: "Nomogramme de Fagan : du pré-test au post-test",
  resume: "Une droite relie la probabilité avant le test, le rapport de vraisemblance et la probabilité après.",
  but: "Choisis Se, Sp, la probabilité pré-test et le résultat du test. La droite du nomogramme donne la probabilité post-test.",
  aRetenir: "RV+ = Se/(1 − Sp), RV− = (1 − Se)/Sp. Cote post-test = cote pré-test × RV. Un RV+ élevé (> 10) ou un RV− faible (< 0,1) modifie beaucoup la probabilité.",
  piege: "La probabilité pré-test n'est pas la prévalence générale : c'est la probabilité clinique pour ce patient, qui dépend de ses symptômes. Le test ne remplace jamais ce point de départ.",
  build: function(k, S){
    var c = k.canvas(430);
    var se = k.slider("Sensibilité", 50, 99, 1, 90, "%"), sp = k.slider("Spécificité", 50, 99, 1, 90, "%");
    var pre = k.slider("Probabilité pré-test", 1, 99, 1, 20, "%");
    var res = k.seg("Résultat du test", [["+", "Positif"], ["-", "Négatif"]], "+");
    var ro = k.readouts(["RV utilisé", "Cote pré-test", "Cote post-test", "Probabilité post-test"]);
    k.draw(function(){
      c.clear();
      var s1 = se.value / 100, s2 = sp.value / 100, rv = res.value === "+" ? s1 / (1 - s2) : (1 - s1) / s2;
      var p0 = pre.value / 100, o0 = p0 / (1 - p0), o1 = o0 * rv, p1 = o1 / (1 + o1);
      var H = c.H, W = c.W, yc = H / 2, s = (H - 50) / 8, xs = [W * 0.2, W * 0.5, W * 0.8];
      function lo(p){ return Math.log10(p / (1 - p)); }
      var yPre = yc - s * lo(p0), yPost = yc + s * lo(p1), yLR = yc + s * Math.log10(rv) / 2;
      var ctx = c.ctx;
      [xs[0], xs[1], xs[2]].forEach(function(x){ S.draw.line(c, x, 14, x, H - 30, P.grey, 1.5); });
      [0.01, 0.1, 0.5, 1, 2, 5, 10, 20, 50, 80, 90, 95, 99, 99.9, 99.99].forEach(function(pp){ var q = pp / 100, l = lo(q);
        if (Math.abs(l) > 4) return;
        S.draw.line(c, xs[0] - 5, yc - s * l, xs[0] + 5, yc - s * l, P.grey, 1.2); S.draw.text(c, pp + "", xs[0] - 12, yc - s * l, {size: 10, align: "right", color: P.grey, weight: 600});
        S.draw.line(c, xs[2] - 5, yc + s * l, xs[2] + 5, yc + s * l, P.grey, 1.2); S.draw.text(c, pp + "", xs[2] + 12, yc + s * l, {size: 10, align: "left", color: P.grey, weight: 600}); });
      [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100].forEach(function(r){ var y = yc + s * Math.log10(r) / 2; S.draw.line(c, xs[1] - 5, y, xs[1] + 5, y, P.grey, 1.2); if ([0.01, 0.1, 1, 10, 100].indexOf(r) >= 0) S.draw.text(c, F(r, 2) + "", xs[1] + 10, y, {size: 10, align: "left", color: P.grey, weight: 600}); });
      S.draw.text(c, "pré-test (%)", xs[0], H - 12, {size: 12}); S.draw.text(c, "rapport de vraisemblance", xs[1], H - 12, {size: 12}); S.draw.text(c, "post-test (%)", xs[2], H - 12, {size: 12});
      ctx.save(); ctx.beginPath(); ctx.rect(0, 10, W, H - 40); ctx.clip();
      S.draw.line(c, xs[0], yPre, xs[2], yPost, P.red, 3); ctx.restore();
      S.draw.dot(c, xs[0], yPre, 6, P.red); S.draw.dot(c, xs[1], yLR, 6, P.acc); S.draw.dot(c, xs[2], yPost, 6, P.red);
      ro.set(0, F(rv, rv < 1 ? 3 : 1)); ro.set(1, F(o0, 3)); ro.set(2, F(o1, 3)); ro.set(3, pct(p1));
    });
  }
});

/* 5 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c03-tests-successifs", ch: "c03", tag: "Cumuler les résultats",
  titre: "Plusieurs tests positifs d'affilée : à quelles conditions ?",
  resume: "Chaque test positif multiplie la cote par RV+ ; mais seulement si les tests sont indépendants.",
  but: "Règle le test et la prévalence, puis suis la probabilité d'être malade après 0, 1, 2, 3 ou 4 résultats positifs successifs.",
  aRetenir: "Si les tests sont indépendants chez le malade comme chez le sain, la cote est multipliée par RV+ à chaque test positif. Cote finale = cote initiale × RV+ᵏ.",
  piege: "Refaire le même test sur le même échantillon, ou un test qui se trompe pour la même raison (réaction croisée), n'apporte aucune information nouvelle : l'hypothèse d'indépendance est essentielle.",
  build: function(k, S){
    var c = k.canvas(300);
    var pr = k.slider("Prévalence", 0.1, 20, 0.1, 2, "%"), se = k.slider("Sensibilité", 70, 99, 1, 95, "%"), sp = k.slider("Spécificité", 70, 99, 1, 98, "%");
    var dep = k.toggle("Erreurs identiques à chaque test (non indépendants)", false);
    var ro = k.readouts(["RV+", "Après 1 positif", "Après 2 positifs", "Après 3 positifs"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var p0 = pr.value / 100, rv = (se.value / 100) / (1 - sp.value / 100), o0 = p0 / (1 - p0), vals = [];
      for (var j = 0; j <= 4; j++){ var o = dep.value ? (j ? o0 * rv : o0) : o0 * Math.pow(rv, j); vals.push(o / (1 + o)); }
      var ax = S.draw.axes(c, {x0: -0.5, x1: 4.5, y0: 0, y1: 1, xl: "nombre de tests positifs", yl: "P(malade)", stepX: 1, stepY: 0.2});
      vals.forEach(function(v, j){ var xa = ax.X(j - 0.35), xb = ax.X(j + 0.35); c.ctx.fillStyle = "rgba(180,35,24,.6)"; c.ctx.fillRect(xa, ax.Y(v), xb - xa, ax.Y(0) - ax.Y(v)); S.draw.text(c, pct(v, 1), (xa + xb) / 2, ax.Y(v) - 10, {size: 12}); });
      ro.set(0, F(rv, 1)); ro.set(1, pct(vals[1])); ro.set(2, pct(vals[2])); ro.set(3, pct(vals[3]));
      nt.set(dep.value ? "Erreurs identiques : le 2e, 3e… test répète le 1er et n'ajoute rien. La probabilité plafonne à la valeur obtenue après un seul positif." : "Tests indépendants : cote × " + F(rv, 1) + " à chaque positif. Un seul positif ne suffit pas en dépistage de maladie rare ; la confirmation par un test différent est précieuse.", dep.value ? "warn" : "ok");
    });
  }
});
})();
