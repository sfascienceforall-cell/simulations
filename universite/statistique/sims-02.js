/* Biostatistique BA1 · chapitre 2 : probabilités */
(function(){
var P = SFA.draw.palette, F = SFA.fmt;

function frac(num, den){ return num + "/" + den; }

/* 1 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c02-frequence", ch: "c02", tag: "Loi des grands nombres",
  titre: "La fréquence se stabilise : jusqu'à quand les écarts durent-ils ?",
  resume: "Répète une épreuve de probabilité p : la fréquence relative converge, mais lentement et pas de façon monotone.",
  but: "Choisis p (par exemple la probabilité qu'un traitement guérisse), lance 10, 100 ou 1000 essais et observe la fréquence relative et son couloir de fluctuation.",
  aRetenir: "La fréquence relative tend vers p quand n grandit (loi des grands nombres). Les fluctuations sont de l'ordre de √(p(1−p)/n) : 100 fois plus d'essais pour 10 fois moins d'écart.",
  piege: "La loi des grands nombres ne « rattrape » pas les écarts passés : après une série de succès, la probabilité du prochain essai reste p.",
  build: function(k, S){
    var c = k.canvas(320), N = 5000, cum = [0], succ = 0;
    var p = k.slider("Probabilité p de succès", 0.05, 0.95, 0.05, 0.3, "", function(){ reset(); });
    function reset(){ cum = [0]; }
    function run(m){ var pv = p.value; for (var i = 0; i < m && cum.length <= N; i++){ cum.push(cum[cum.length - 1] + (Math.random() < pv ? 1 : 0)); } }
    k.button("+ 10 essais", function(){ run(10); }, true); k.button("+ 100", function(){ run(100); }); k.button("+ 1000", function(){ run(1000); }); k.button("Recommencer", reset);
    var ro = k.readouts(["Essais n", "Succès", "Fréquence f", "|f − p|"]);
    var nt = k.note("Lance des essais avec les boutons (maximum 5000).", "");
    k.draw(function(){
      c.clear();
      var L = 48, R = 16, T = 14, B = 34, W = c.W, H = c.H, ctx = c.ctx, pv = p.value;
      function X(n){ return L + Math.log(Math.max(1, n)) / Math.log(N) * (W - L - R); }
      function Y(f){ return H - B - f * (H - T - B); }
      ctx.save(); ctx.font = "600 11px Mulish, system-ui"; ctx.fillStyle = "#5f6b7a"; ctx.strokeStyle = "#edf0f4"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var g = 0; g <= 1.0001; g += 0.2){ ctx.beginPath(); ctx.moveTo(L, Y(g)); ctx.lineTo(W - R, Y(g)); ctx.stroke(); ctx.fillText(F(g, 1), L - 6, Y(g)); }
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      [1, 10, 100, 1000, 5000].forEach(function(n){ ctx.beginPath(); ctx.moveTo(X(n), T); ctx.lineTo(X(n), H - B); ctx.stroke(); ctx.fillText(n, X(n), H - B + 6); });
      ctx.restore();
      S.draw.text(c, "nombre d'essais n (échelle logarithmique)", W - R, H - 8, {size: 11, align: "right", color: P.grey});
      /* couloir ±2√(p(1−p)/n) */
      ctx.save(); ctx.fillStyle = "rgba(14,116,144,.14)"; ctx.beginPath();
      for (var n = 1; n <= N; n += Math.max(1, Math.floor(n / 40))){ var e = 2 * Math.sqrt(pv * (1 - pv) / n); if (n === 1) ctx.moveTo(X(n), Y(Math.min(1, pv + e))); else ctx.lineTo(X(n), Y(Math.min(1, pv + e))); }
      for (n = N; n >= 1; n -= Math.max(1, Math.floor(n / 40))){ e = 2 * Math.sqrt(pv * (1 - pv) / n); ctx.lineTo(X(n), Y(Math.max(0, pv - e))); if (n === 1) break; }
      ctx.closePath(); ctx.fill(); ctx.restore();
      S.draw.line(c, L, Y(pv), W - R, Y(pv), P.teal, 1.5, [6, 4]);
      var m = cum.length - 1;
      if (m >= 1){ ctx.save(); ctx.strokeStyle = P.red; ctx.lineWidth = 1.8; ctx.beginPath(); var stp = Math.max(1, Math.floor(m / 800));
        for (var i = 1; i <= m; i += stp){ var f = cum[i] / i; if (i === 1) ctx.moveTo(X(i), Y(f)); else ctx.lineTo(X(i), Y(f)); } ctx.lineTo(X(m), Y(cum[m] / m)); ctx.stroke(); ctx.restore(); }
      ro.set(0, m); ro.set(1, m ? cum[m] : "—"); ro.set(2, m ? F(cum[m] / m, 4) : "—"); ro.set(3, m ? F(Math.abs(cum[m] / m - pv), 4) : "—");
      if (m) nt.set("Écart typique attendu : environ " + F(Math.sqrt(pv * (1 - pv) / m), 4) + " (couloir bleuté = ± 2 écarts typiques). Après " + m + " essais, la fréquence est " + F(cum[m] / m, 3) + " pour p = " + F(pv, 2) + ".", "ok");
    });
  }
});

/* 2 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c02-venn", ch: "c02", tag: "Événements",
  titre: "Union, intersection, incompatibles ou indépendants ?",
  resume: "Un carré d'aire 1 : règle d'addition, probabilité conditionnelle et test d'indépendance.",
  but: "Règle P(A), P(B) et P(A∩B). Le carré est découpé en 4 zones d'aires égales aux probabilités ; lis P(A∪B), P(A|B) et le verdict d'indépendance.",
  aRetenir: "P(A∪B) = P(A) + P(B) − P(A∩B). Incompatibles : P(A∩B) = 0. Indépendants : P(A∩B) = P(A)·P(B), c'est-à-dire P(A|B) = P(A).",
  piege: "Incompatibles et indépendants sont presque l'opposé : deux événements incompatibles de probabilités non nulles sont dépendants (si A arrive, B n'arrive pas).",
  build: function(k, S){
    var c = k.canvas(330);
    var pa = k.slider("P(A)", 0.05, 0.95, 0.05, 0.4, ""), pb = k.slider("P(B)", 0.05, 0.95, 0.05, 0.5, "");
    var pab = k.slider("P(A∩B)", 0, 0.95, 0.01, 0.2, "");
    k.button("Rendre A et B indépendants", function(){ pab.set(Math.round(pa.value * pb.value * 100) / 100); }, true);
    k.button("Rendre A et B incompatibles", function(){ pab.set(0); });
    var ro = k.readouts(["P(A∪B)", "P(A|B)", "P(B|A)", "P(A)·P(B)"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var a = pa.value, b = pb.value, lo = Math.max(0, a + b - 1), hi = Math.min(a, b), x = Math.min(hi, Math.max(lo, pab.value));
      var size = Math.min(c.W - 40, c.H - 40), X0 = (c.W - size) / 2, Y0 = 16, ctx = c.ctx;
      var wA = a * size;
      /* colonne A (gauche) : B en haut, hauteur x/a ; colonne non-A : B en haut, hauteur (b−x)/(1−a) */
      function rect(xx, yy, w, h, col, lab){ ctx.fillStyle = col; ctx.fillRect(xx, yy, w, h); if (lab && w > 30 && h > 16) S.draw.text(c, lab, xx + w / 2, yy + h / 2, {size: 12, color: P.ink}); }
      var hA = x / a * size, hN = (b - x) / (1 - a) * size;
      rect(X0, Y0, wA, hA, "rgba(124,58,237,.55)", "A∩B " + F(x, 2));
      rect(X0, Y0 + hA, wA, size - hA, "rgba(30,63,143,.40)", "A seul " + F(a - x, 2));
      rect(X0 + wA, Y0, size - wA, hN, "rgba(180,35,24,.40)", "B seul " + F(b - x, 2));
      rect(X0 + wA, Y0 + hN, size - wA, size - hN, "rgba(138,149,163,.25)", "ni A ni B " + F(1 - a - b + x, 2));
      ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.strokeRect(X0, Y0, size, size); S.draw.line(c, X0 + wA, Y0, X0 + wA, Y0 + size, P.ink, 2);
      S.draw.text(c, "A", X0 + wA / 2, Y0 + size + 14, {size: 13, color: P.acc}); S.draw.text(c, "non A", X0 + wA + (size - wA) / 2, Y0 + size + 14, {size: 13, color: P.grey});
      var indep = Math.abs(x - a * b) < 0.005;
      ro.set(0, F(a + b - x, 3)); ro.set(1, F(x / b, 3)); ro.set(2, F(x / a, 3)); ro.set(3, F(a * b, 3));
      var msg = "";
      if (x !== pab.value) msg += "P(A∩B) ramené dans l'intervalle permis [" + F(lo, 2) + " ; " + F(hi, 2) + "]. ";
      if (x === 0) nt.set(msg + "Incompatibles : A et B ne peuvent pas arriver ensemble. Ils sont dépendants, car P(A|B) = 0 ≠ P(A).", "warn");
      else if (indep) nt.set(msg + "Indépendants : P(A|B) = P(A) = " + F(a, 2) + ". La fraction de B dans la colonne A et hors de A est identique.", "ok");
      else nt.set(msg + "Dépendants : P(A|B) = " + F(x / b, 2) + (x / b > a ? " > " : " < ") + "P(A) = " + F(a, 2) + " (B " + (x / b > a ? "favorise" : "défavorise") + " A).", "warn");
    });
  }
});

/* 3 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c02-arbre", ch: "c02", tag: "Arbre",
  titre: "Arbre de probabilités : avec ou sans remise",
  resume: "Deux tirages dans une urne : les branches et la multiplication le long du chemin.",
  but: "Choisis le contenu de l'urne (boules rouges et bleues) et le mode de tirage ; lis les probabilités de chaque branche et de chaque chemin.",
  aRetenir: "Le long d'un chemin, on multiplie les probabilités conditionnelles ; entre chemins, on additionne. Sans remise, la 2e probabilité dépend du 1er résultat.",
  piege: "Sans remise, la probabilité que la 2e boule soit rouge vaut quand même R/(R+B) avant d'avoir regardé la 1re : par symétrie, l'ordre ne compte pas.",
  build: function(k, S){
    var c = k.canvas(340);
    var R = k.slider("Boules rouges R", 1, 10, 1, 5, ""), B = k.slider("Boules bleues B", 1, 10, 1, 3, "");
    var rem = k.toggle("Avec remise", false);
    var ro = k.readouts(["P(2 rouges)", "P(1 de chaque)", "P(2 bleues)", "P(2e rouge)"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var r = R.value, b = B.value, n = r + b, wr = rem.value;
      var n2 = wr ? n : n - 1, rr = wr ? r : r - 1, bb = wr ? b : b - 1;
      var W = c.W, H = c.H, ctx = c.ctx, x0 = 50, x1 = W * 0.38, x2 = W * 0.66, yy = [H * 0.27, H * 0.73];
      var leaves = [[H * 0.14, "RR", r / n * rr / n2, frac(r, n) + " × " + frac(rr, n2)], [H * 0.36, "RB", r / n * (n2 - rr) / n2, frac(r, n) + " × " + frac(n2 - rr, n2)],
        [H * 0.64, "BR", b / n * (n2 - bb) / n2, frac(b, n) + " × " + frac(n2 - bb, n2)], [H * 0.86, "BB", b / n * bb / n2, frac(b, n) + " × " + frac(bb, n2)]];
      var cols = [P.red, P.acc];
      yy.forEach(function(y, i){ S.draw.line(c, x0, H / 2, x1, y, cols[i], 2.5); S.draw.dot(c, x1, y, 6, cols[i]); S.draw.text(c, i ? frac(b, n) : frac(r, n), (x0 + x1) / 2 - 4, (H / 2 + y) / 2 + (i ? 14 : -14), {size: 12, color: cols[i], bg: "#fff"}); });
      S.draw.dot(c, x0, H / 2, 6, P.ink);
      leaves.forEach(function(l, i){
        var y1 = yy[i < 2 ? 0 : 1], col = (i === 0 || i === 2) ? P.red : P.acc, lab = i === 0 ? frac(rr, n2) : i === 1 ? frac(n2 - rr, n2) : i === 2 ? frac(n2 - bb, n2) : frac(bb, n2);
        S.draw.line(c, x1, y1, x2, l[0], (i === 0 || i === 2) ? P.red : P.acc, 2.5); S.draw.dot(c, x2, l[0], 6, col);
        S.draw.text(c, lab, (x1 + x2) / 2, (y1 + l[0]) / 2 + (i % 2 ? 12 : -12), {size: 12, color: col, bg: "#fff"});
        S.draw.text(c, l[1] + " : " + l[3] + " = " + F(l[2], 4), x2 + 12, l[0], {size: 12, align: "left", color: P.ink});
      });
      var pRR = leaves[0][2], pMix = leaves[1][2] + leaves[2][2], pBB = leaves[3][2];
      ro.set(0, F(pRR, 4)); ro.set(1, F(pMix, 4)); ro.set(2, F(pBB, 4)); ro.set(3, F(leaves[0][2] + leaves[2][2], 4));
      nt.set(wr ? "Avec remise : les deux tirages sont indépendants, P(2 rouges) = (R/N)² = " + F(Math.pow(r / n, 2), 4) + "." : "Sans remise : après une rouge il reste " + rr + " rouge(s) sur " + n2 + ". Les tirages sont dépendants. Vérifie que P(2e rouge) = " + frac(r, n) + " = " + F(r / n, 4) + ".", wr ? "ok" : "warn");
      ctx.save(); ctx.restore();
    });
  }
});

/* 4 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c02-contingence", ch: "c02", tag: "Tableau de contingence",
  titre: "Dépendance ou indépendance dans un tableau 2×2",
  resume: "Exposition et maladie : compare P(M|E), P(M|non E) et les effectifs attendus sous indépendance.",
  but: "Règle les effectifs et les risques dans les deux groupes. Quand les deux risques sont égaux, les effectifs observés coïncident avec ceux attendus sous indépendance.",
  aRetenir: "Indépendance : P(M|E) = P(M|non E) = P(M). Effectif attendu = (total de la ligne × total de la colonne) / N. Plus l'observé s'écarte de l'attendu, plus la dépendance est marquée.",
  piege: "P(M|E) et P(E|M) sont deux probabilités différentes : parmi les malades, 80 % d'exposés ne signifie pas que 80 % des exposés tombent malades.",
  build: function(k, S){
    var c = k.canvas(330);
    var nE = k.slider("Effectif des exposés", 50, 500, 10, 200, ""), nN = k.slider("Effectif des non-exposés", 50, 500, 10, 300, "");
    var rE = k.slider("Risque chez les exposés", 1, 60, 1, 30, "%"), rN = k.slider("Risque chez les non-exposés", 1, 60, 1, 10, "%");
    var ro = k.readouts(["P(M|E)", "P(M|non E)", "P(M)", "Risque relatif"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var a = Math.round(nE.value * rE.value / 100), b = nE.value - a, cc = Math.round(nN.value * rN.value / 100), d = nN.value - cc, N = nE.value + nN.value, nm = a + cc;
      var pE = a / nE.value, pN = cc / nN.value, pM = nm / N, ctx = c.ctx, W = c.W;
      /* tableau */
      var tx = 20, ty = 14, cw = Math.min(110, (W - 40) / 6), rh = 34;
      var head = ["", "Malades", "Sains", "Total"], rows = [["Exposés", a, b, nE.value], ["Non-exposés", cc, d, nN.value], ["Total", nm, N - nm, N]];
      ctx.save(); ctx.font = "700 12px Mulish, system-ui"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
      head.forEach(function(h, j){ ctx.fillStyle = P.grey; ctx.fillText(h, tx + cw * (j + 0.5) + (j ? 20 : 0) - (j ? 0 : 0), ty + rh / 2); });
      rows.forEach(function(r, i){ ctx.fillStyle = i < 2 ? "#f2f5fa" : "#e7ebf2"; ctx.fillRect(tx + cw * 1 - 4 + 20 - 20, ty + rh * (i + 1), cw * 3 + 0, rh - 2); ctx.fillStyle = P.ink; ctx.textAlign = "left"; ctx.fillText(r[0], tx, ty + rh * (i + 1) + rh / 2); ctx.textAlign = "center"; for (var j = 1; j < 4; j++) ctx.fillText(r[j], tx + cw * (j + 0.5) + 20, ty + rh * (i + 1) + rh / 2); });
      ctx.restore();
      /* effectifs attendus */
      var ex = [nE.value * nm / N, nE.value * (N - nm) / N, nN.value * nm / N, nN.value * (N - nm) / N];
      S.draw.text(c, "Attendus sous indépendance : " + F(ex[0], 1) + " | " + F(ex[1], 1) + " | " + F(ex[2], 1) + " | " + F(ex[3], 1), 20, ty + rh * 4 + 10, {size: 12, align: "left", color: P.teal});
      /* barres de risque */
      var by = 190, bh = c.H - by - 36, bw = 70, base = by + bh;
      function bar(x, p, col, lab){ var h = p / 0.7 * bh; ctx.fillStyle = col; ctx.fillRect(x, base - h, bw, h); S.draw.text(c, F(p * 100, 1) + " %", x + bw / 2, base - h - 10, {size: 12, color: col}); S.draw.text(c, lab, x + bw / 2, base + 14, {size: 12, color: P.ink}); }
      bar(40, pE, P.red, "P(M|E)"); bar(150, pN, P.acc, "P(M|non E)"); bar(260, pM, P.grey, "P(M)");
      S.draw.line(c, 30, base, 350, base, P.grey, 1.5);
      ro.set(0, F(pE, 3)); ro.set(1, F(pN, 3)); ro.set(2, F(pM, 3)); ro.set(3, F(pE / pN, 2));
      var same = Math.abs(pE - pN) < 0.005;
      nt.set(same ? "Risques égaux : les effectifs observés coïncident avec les attendus. M et E sont indépendants (aux arrondis près)." : "Les risques diffèrent (RR = " + F(pE / pN, 2) + ") : l'observé s'écarte de l'attendu (" + a + " observés contre " + F(ex[0], 1) + " attendus chez les exposés malades). M et E sont dépendants dans cet échantillon ; savoir si l'écart est dû au hasard relève d'un test (chapitre 9).", same ? "ok" : "warn");
    });
  }
});

/* 5 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c02-anniversaire", ch: "c02", tag: "Contre-intuitif",
  titre: "Le paradoxe des anniversaires",
  resume: "Dans un groupe de 23 personnes, deux d'entre elles partagent un anniversaire une fois sur deux. Et pour le tien ?",
  but: "Fais varier la taille du groupe et compare P(deux personnes quelconques partagent un anniversaire) à P(quelqu'un partage le tien).",
  aRetenir: "P(au moins un doublon) = 1 − (365·364·…·(365−n+1)) / 365ⁿ. On compte le nombre de paires, n(n−1)/2, pas le nombre de personnes. Même logique : le risque d'un « faux positif » parmi de nombreuses comparaisons croît vite.",
  piege: "« Au moins deux » ≠ « quelqu'un a mon anniversaire » : le second exige 253 autres personnes pour dépasser 50 %. On suppose ici 365 jours équiprobables, indépendants (modèle simplifié).",
  build: function(k, S){
    var c = k.canvas(320);
    var n = k.slider("Taille du groupe n", 2, 80, 1, 23, "personnes");
    var ro = k.readouts(["Paires", "P(un doublon)", "P(quelqu'un a le tien)", "n minimal pour 50 %"]);
    function pd(m){ var q = 1; for (var i = 0; i < m; i++) q *= (365 - i) / 365; return 1 - q; }
    function pm(m){ return 1 - Math.pow(364 / 365, m - 1); }
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 80, y0: 0, y1: 1, xl: "n", yl: "probabilité", stepX: 10, stepY: 0.2});
      S.draw.fn(c, ax, function(x){ x = Math.max(1, Math.round(x)); return pd(x); }, P.red, 2.6);
      S.draw.fn(c, ax, function(x){ x = Math.max(1, Math.round(x)); return pm(x); }, P.acc, 2.6);
      S.draw.line(c, ax.X(0), ax.Y(0.5), ax.X(80), ax.Y(0.5), P.grey, 1, [4, 4]);
      var m = n.value; S.draw.dot(c, ax.X(m), ax.Y(pd(m)), 6, P.red); S.draw.dot(c, ax.X(m), ax.Y(pm(m)), 6, P.acc);
      S.draw.text(c, "deux personnes quelconques", ax.X(40), ax.Y(pd(40)) - 14, {size: 12, color: P.red}); S.draw.text(c, "quelqu'un a TON anniversaire", ax.X(62), ax.Y(pm(62)) + 16, {size: 12, color: P.acc});
      ro.set(0, m * (m - 1) / 2); ro.set(1, F(pd(m) * 100, 1) + " %"); ro.set(2, F(pm(m) * 100, 1) + " %"); ro.set(3, "23");
    });
  }
});
})();
