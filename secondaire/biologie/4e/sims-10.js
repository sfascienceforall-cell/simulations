/* Biologie 4e · chapitre 10 · Cycle cellulaire et mitose */
SFA.sim({
  id:"b4-c10-mitose", ch:"c10", tag:"Classique · animation",
  titre:"Mitose pas à pas : chromosomes, chromatides, ADN",
  resume:"Parcours le cycle d'une cellule à 6 chromosomes et suis le nombre de chromosomes, de chromatides et la quantité d'ADN.",
  but:"Déplace le curseur de phase (ou lance l'animation) et lis les compteurs. Repère l'étape où l'ADN est répliqué et celle où les chromatides se séparent.",
  aRetenir:"L'ADN est répliqué pendant la phase S de l'interphase, pas pendant la mitose. Prophase : les chromosomes (à 2 chromatides) se condensent. Métaphase : alignés au centre. Anaphase : les chromatides sœurs se séparent et migrent vers les pôles. Télophase : deux noyaux se reforment, puis la cytocinèse sépare deux cellules filles à 2n chromosomes identiques à la cellule mère.",
  piege:"En anaphase, il y a momentanément 12 chromosomes (chaque chromatide devient un chromosome) dans la cellule, avant la division en deux cellules de 6. Une cellule fille a 2C d'ADN, comme la cellule en G1.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.8});
    var ph = k.slider("Phase", 0, 6, 1, 0, "");
    var ro = k.readouts(["Phase", "Chromosomes (dans la cellule)", "Chromatides", "ADN par noyau (2C = quantité en G1)"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t += dt; if (st.t > 1.6){ st.t = 0; var n = ph.value + 1; if (n > 6){ lp.pause(); return; } ph.set(n); k.redraw(); } });
    var st = {t:0};
    k.button("▶ Animer le cycle", function(){ if (ph.value >= 6) ph.set(0); st.t = 0; lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    var NAMES = ["Interphase : G1", "Interphase : phase S", "Interphase : G2", "Prophase", "Métaphase", "Anaphase", "Télophase et cytocinèse"];
    var DATA = [[6, 6, "2C"], [6, "6 → 12", "2C → 4C"], [6, 12, "4C"], [6, 12, "4C"], [6, 12, "4C"], [12, 12, "4C (2 lots de 2C)"], ["12 (6 + 6)", "12 (6 + 6)", "2C dans chaque noyau"]];
    var TXT = [
      "La cellule est en G1 : elle croît et fonctionne. Chaque chromosome n'a qu'une chromatide (1 molécule d'ADN) ; la chromatine est étalée dans le noyau.",
      "Phase S : l'ADN est répliqué (semi-conservative). Les chromosomes passent de 1 à 2 chromatides sœurs, jointes au centromère ; le nombre de chromosomes ne change pas.",
      "G2 : la réplication est finie, la cellule contrôle son ADN et se prépare : 6 chromosomes à 2 chromatides (12 chromatides, 4C).",
      "Prophase : les chromosomes se condensent et deviennent visibles ; l'enveloppe nucléaire se désagrège ; le fuseau de division se forme entre les deux centrosomes.",
      "Métaphase : les chromosomes, rattachés aux fibres du fuseau par leur centromère, s'alignent dans le plan équatorial.",
      "Anaphase : les chromatides sœurs se séparent et sont tirées vers les pôles ; chacune est désormais un chromosome : 12 chromosomes, 6 vers chaque pôle.",
      "Télophase : deux noyaux se reforment, les chromosomes se décondensent ; la cytocinèse sépare deux cellules filles à 6 chromosomes (2C), identiques à la cellule mère."
    ];
    var COL = ["#1e3f8f", "#b42318", "#2e6b55"], LEN = [0.30, 0.30, 0.22, 0.22, 0.15, 0.15];
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, p = ph.value, cx = W / 2, cy = H / 2, R = Math.min(W * 0.4, H * 0.44), r = B4.rng(21);
      function cell(){
        if (p < 5){ B4.ell(c, cx, cy, R, R, "rgba(254,242,242,.8)", "#9f1239", 3); }
        else if (p === 5){ B4.ell(c, cx, cy, R * 1.25, R * 0.85, "rgba(254,242,242,.8)", "#9f1239", 3); }
        else { B4.ell(c, cx - R * 0.55, cy, R * 0.68, R * 0.68, "rgba(254,242,242,.8)", "#9f1239", 3); B4.ell(c, cx + R * 0.55, cy, R * 0.68, R * 0.68, "rgba(254,242,242,.8)", "#9f1239", 3); }
      }
      function col(i){ return COL[Math.floor(i / 2)]; }
      function chroma(x0, y0, rad, doubled, n){
        for (var i = 0; i < 6; i++){
          var a = i / 6 * 6.283 + 0.4, rr = rad * (0.25 + r() * 0.5), x = x0 + Math.cos(a) * rr, y = y0 + Math.sin(a) * rr, L = LEN[i] * R * 1.6;
          for (var d = 0; d < (doubled > i ? 2 : 1); d++){
            ctx.save(); ctx.strokeStyle = col(i); ctx.globalAlpha = i % 2 ? 0.7 : 1; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x - L / 2, y + d * 3);
            for (var q = 1; q <= 8; q++) ctx.lineTo(x - L / 2 + q * L / 8, y + d * 3 + Math.sin(q * 1.7 + i) * 5); ctx.stroke(); ctx.restore();
          }
        }
      }
      cell();
      if (p <= 2){
        B4.ell(c, cx, cy, R * 0.6, R * 0.6, "rgba(191,219,254,.45)", B4.pal.acc, 2.5);
        chroma(cx, cy, R * 0.5, p === 0 ? 0 : p === 1 ? 3 : 6);
        if (p === 1) B4.txt(c, "réplication en cours", cx, cy + R * 0.82, B4.pal.red, 12);
      }
      var pole1 = cx - R * 0.95, pole2 = cx + R * 0.95;
      function xchrom(x, y, L, i, vert){
        ctx.save(); ctx.strokeStyle = col(i); ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.globalAlpha = i % 2 ? 0.75 : 1;
        if (vert){ ctx.beginPath(); ctx.moveTo(x - 3, y - L / 2); ctx.lineTo(x - 3, y + L / 2); ctx.moveTo(x + 3, y - L / 2); ctx.lineTo(x + 3, y + L / 2); ctx.stroke(); }
        else { ctx.beginPath(); ctx.moveTo(x - L / 2, y - 3); ctx.lineTo(x + L / 2, y - 3); ctx.moveTo(x - L / 2, y + 3); ctx.lineTo(x + L / 2, y + 3); ctx.stroke(); }
        ctx.restore(); S.draw.dot(c, x, y, 3.2, "#13233a");
      }
      if (p === 3){
        ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = B4.pal.acc; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R * 0.62, 0, 6.283); ctx.stroke(); ctx.restore();
        for (var i = 0; i < 6; i++){ var a = i / 6 * 6.283 + 0.3, rr = R * 0.35; xchrom(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, LEN[i] * R * 1.3, i, i % 2 === 0); }
        S.draw.dot(c, pole1, cy, 5, B4.pal.amber); S.draw.dot(c, pole2, cy, 5, B4.pal.amber);
        for (i = 0; i < 4; i++){ S.draw.line(c, pole1, cy, cx - R * 0.45, cy - R * 0.45 + i * R * 0.3, "rgba(95,107,122,.35)", 1); S.draw.line(c, pole2, cy, cx + R * 0.45, cy - R * 0.45 + i * R * 0.3, "rgba(95,107,122,.35)", 1); }
      }
      if (p === 4){
        S.draw.dot(c, pole1, cy, 5, B4.pal.amber); S.draw.dot(c, pole2, cy, 5, B4.pal.amber);
        for (i = 0; i < 6; i++){ var y = cy + (i - 2.5) * R * 0.28; S.draw.line(c, pole1, cy, cx, y, "rgba(95,107,122,.5)", 1); S.draw.line(c, pole2, cy, cx, y, "rgba(95,107,122,.5)", 1); }
        for (i = 0; i < 6; i++) xchrom(cx, cy + (i - 2.5) * R * 0.28, LEN[i] * R * 1.0, i, false);
        S.draw.line(c, cx, cy - R * 0.9, cx, cy + R * 0.9, "rgba(180,83,9,.4)", 1.5, [4, 4]);
      }
      if (p === 5){
        S.draw.dot(c, cx - R * 1.15, cy, 5, B4.pal.amber); S.draw.dot(c, cx + R * 1.15, cy, 5, B4.pal.amber);
        for (i = 0; i < 6; i++){ var y2 = cy + (i - 2.5) * R * 0.26, L = LEN[i] * R * 0.9;
          [-1, 1].forEach(function(sg){ var xc = cx + sg * R * 0.62; S.draw.line(c, cx + sg * R * 1.15, cy, xc, y2, "rgba(95,107,122,.5)", 1); ctx.save(); ctx.strokeStyle = col(i); ctx.lineWidth = 3.5; ctx.lineCap = "round"; ctx.globalAlpha = i % 2 ? 0.75 : 1; ctx.beginPath(); ctx.moveTo(xc - sg * L * 0.7, y2 - L * 0.5); ctx.lineTo(xc, y2); ctx.lineTo(xc - sg * L * 0.7, y2 + L * 0.5); ctx.stroke(); ctx.restore(); }); }
      }
      if (p === 6){
        [-1, 1].forEach(function(sg){ var nx = cx + sg * R * 0.55; B4.ell(c, nx, cy, R * 0.38, R * 0.38, "rgba(191,219,254,.45)", B4.pal.acc, 2.5); chroma(nx, cy, R * 0.32, 0); });
        S.draw.line(c, cx, cy - R * 0.45, cx, cy + R * 0.45, "#9f1239", 3, [3, 3]);
      }
      var d0 = DATA[p];
      ro.set(0, NAMES[p]); ro.set(1, d0[0]); ro.set(2, d0[1]); ro.set(3, d0[2]);
      nt.set("<b>" + NAMES[p] + ".</b> " + TXT[p], p === 5 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"b4-c10-adn", ch:"c10", tag:"Graphes · comptage",
  titre:"Le cycle et la quantité d'ADN : courbe, histogramme, comptage",
  resume:"Règle la durée de chaque phase : la courbe d'ADN, la répartition d'une population et l'indice mitotique s'ajustent.",
  but:"Choisis la durée de G1, S, G2 et M. Observe la quantité d'ADN au cours du temps, puis compte 200 cellules sur une « lame » pour retrouver les durées.",
  aRetenir:"La quantité d'ADN par noyau passe de 2C à 4C pendant la phase S (réplication), reste à 4C en G2 et en mitose, puis retombe à 2C après la division. Dans une population de cellules non synchronisées, la proportion de cellules dans une phase est proportionnelle à la durée de cette phase : indice mitotique = durée de M ÷ durée du cycle.",
  piege:"Ce n'est pas la mitose qui double l'ADN : c'est la phase S. La mitose est la phase la plus courte (≈ 1 h sur un cycle de 24 h), d'où peu de cellules en mitose sur une lame. Un comptage de 200 cellules donne une estimation avec une marge d'erreur.",
  build:function(k, S){
    var c1 = k.canvas(190), c2 = k.canvas(190), c3 = k.canvas(120);
    var g1 = k.slider("Durée de G1", 4, 16, 1, 10, "h");
    var s = k.slider("Durée de S", 4, 12, 1, 8, "h");
    var g2 = k.slider("Durée de G2", 2, 8, 1, 4, "h");
    var m = k.slider("Durée de M (mitose)", 0.5, 2, 0.5, 1, "h");
    var ro = k.readouts(["Durée du cycle", "Cellules en G1", "Cellules en mitose (indice mitotique)", "Estimation de M par comptage"]);
    var nt = k.note("", "");
    var st = {cnt:null};
    k.button("Compter 200 cellules sur la lame", function(){ var T = g1.value + s.value + g2.value + m.value, d = [g1.value, s.value, g2.value, m.value], cnt = [0, 0, 0, 0]; for (var i = 0; i < 200; i++){ var u = Math.random() * T, q = 0; while (q < 3 && u >= d[q]){ u -= d[q]; q++; } cnt[q]++; } st.cnt = cnt; }, true);
    k.button("Effacer le comptage", function(){ st.cnt = null; });
    k.draw(function(){
      var d = [g1.value, s.value, g2.value, m.value], T = d[0] + d[1] + d[2] + d[3], fr = d.map(function(x){ return x / T; });
      c1.clear(); var ax = S.draw.axes(c1, {x0:0, x1:T, y0:0, y1:5, xl:"temps (h)", stepX:T > 30 ? 10 : 5, stepY:1, l:50});
      function dna(t){ if (t < d[0]) return 2; if (t < d[0] + d[1]) return 2 + 2 * (t - d[0]) / d[1]; if (t < d[0] + d[1] + d[2] + d[3] - 1e-9) return 4; return 2; }
      S.draw.fn(c1, ax, function(t){ return dna(t); }, B4.pal.acc, 3);
      var cum = 0, nm = ["G1", "S", "G2", "M"], cols = ["#cbd5e1", "#fde68a", "#bbf7d0", "#fecaca"];
      for (var i = 0; i < 4; i++){ var xa = ax.X(cum), xb = ax.X(cum + d[i]); c1.ctx.fillStyle = cols[i]; c1.ctx.globalAlpha = 0.5; c1.ctx.fillRect(xa, ax.T, xb - xa, ax.B - ax.T); c1.ctx.globalAlpha = 1; B4.txt(c1, nm[i], (xa + xb) / 2, ax.T + 10 + (i === 3 ? 14 : 0), B4.pal.ink, 12); cum += d[i]; }
      B4.txt(c1, "ADN par noyau (en C)", ax.L + 6, ax.Y(0.6), "#5f6b7a", 12, "left");
      S.draw.fn(c1, ax, function(t){ return dna(t); }, B4.pal.acc, 3);
      /* histogramme d'ADN d'une population */
      c2.clear(); var bx = S.draw.axes(c2, {x0:1.5, x1:4.5, y0:0, y1:1, xl:"ADN par cellule (C)", stepX:0.5, stepY:0.25, l:50});
      function dens(x){ var gs = function(mu){ return Math.exp(-Math.pow((x - mu) / 0.09, 2) / 2) / (0.09 * 2.5066); }; return fr[0] * gs(2) + (fr[2] + fr[3]) * gs(4) + fr[1] * (x > 2 && x < 4 ? 0.5 : 0); }
      var ctx2 = c2.ctx; ctx2.save(); ctx2.beginPath(); ctx2.moveTo(bx.X(1.5), bx.B);
      var maxd = 0; for (x = 1.5; x <= 4.5; x += 0.01) maxd = Math.max(maxd, dens(x));
      for (var x = 1.5; x <= 4.5; x += 0.01) ctx2.lineTo(bx.X(x), bx.Y(dens(x) / Math.max(1.2, maxd) * 0.95)); ctx2.lineTo(bx.X(4.5), bx.B); ctx2.closePath(); ctx2.fillStyle = "rgba(30,63,143,.25)"; ctx2.fill(); ctx2.strokeStyle = B4.pal.acc; ctx2.lineWidth = 2.4; ctx2.stroke(); ctx2.restore();
      B4.txt(c2, "G1 : " + S.fmt(fr[0] * 100, 0) + " %", bx.X(2), bx.Y(0.95) - 8, B4.pal.ink, 12); B4.txt(c2, "S : " + S.fmt(fr[1] * 100, 0) + " %", bx.X(3), bx.Y(0.3), B4.pal.ink, 12);  B4.txt(c2, "G2 + M : " + S.fmt((fr[2] + fr[3]) * 100, 0) + " %", bx.X(4), bx.Y(0.95) - 8, B4.pal.ink, 12);
      /* comptage */
      c3.clear(); var cnt = st.cnt, estM = null;
      B4.txt(c3, cnt ? "Comptage de 200 cellules (trait noir : proportion réelle)" : "Clique sur « Compter 200 cellules sur la lame »", 10, 12, "#5f6b7a", 12, "left");
      if (cnt){
        var w = (c3.W - 40) / 4;
        for (i = 0; i < 4; i++){ var h = cnt[i] / 200 * 80; c3.ctx.fillStyle = ["#94a3b8", "#f59e0b", "#22c55e", "#ef4444"][i]; c3.ctx.fillRect(20 + i * w + 10, 105 - h, w - 20, h); S.draw.line(c3, 20 + i * w + 6, 105 - fr[i] * 80, 20 + i * w + w - 6, 105 - fr[i] * 80, "#13233a", 2); B4.txt(c3, nm[i] + " : " + cnt[i], 20 + i * w + w / 2, 115, B4.pal.ink, 12); }
        estM = cnt[3] / 200 * T;
      }
      ro.set(0, S.fmt(T, 1) + " h"); ro.set(1, S.fmt(fr[0] * 100, 0) + " %"); ro.set(2, S.fmt(fr[3] * 100, 1) + " %"); ro.set(3, cnt ? S.fmt(estM, 1) + " h (réel : " + S.fmt(d[3], 1) + " h)" : "—");
      nt.set(cnt ? "Sur 200 cellules, " + cnt[3] + " en mitose : durée de M ≈ " + cnt[3] + " ÷ 200 × " + S.fmt(T, 1) + " h = " + S.fmt(estM, 1) + " h. L'estimation varie d'un comptage à l'autre : plus on compte de cellules, plus elle est précise." : "Plus une phase dure longtemps, plus on y trouve de cellules. À T = " + S.fmt(T, 1) + " h, la mitose (" + S.fmt(d[3], 1) + " h) ne représente que " + S.fmt(fr[3] * 100, 1) + " % des cellules.", "");
    });
  }
});

SFA.sim({
  id:"b4-c10-cancer", ch:"c10", tag:"Contrôle du cycle · modèle",
  titre:"Perdre le contrôle du cycle : naissance d'une tumeur",
  resume:"Compare un tissu normal en équilibre et une population où un gène est altéré : division accrue ou mort cellulaire réduite.",
  but:"Règle la durée du cycle, la part de cellules qui se divisent et la mort cellulaire. Essaie les 4 scénarios et regarde le temps pour atteindre 10⁹ cellules (≈ 1 cm³).",
  aRetenir:"Dans un tissu normal, divisions et mort cellulaire (apoptose) s'équilibrent. Un oncogène activé pousse davantage de cellules à se diviser ; un gène suppresseur de tumeur muté (comme p53) supprime les freins : les cellules anormales ne s'arrêtent plus ni ne meurent. Quand les divisions dépassent la mort, la population croît exponentiellement, d'abord sans symptôme.",
  piege:"Une cellule cancéreuse ne se divise pas forcément plus vite : souvent c'est la proportion de cellules qui continuent à se diviser, ou qui échappent à la mort, qui change. Modèle simplifié : croissance exponentielle sans limite ni évolution. Une tumeur demande des années pour devenir détectable.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.8});
    var T = k.slider("Durée du cycle", 12, 96, 6, 48, "h");
    var g = k.slider("Cellules qui se divisent", 0, 100, 1, 10, "%");
    var d = k.slider("Mort cellulaire (apoptose)", 0, 30, 0.5, 3.5, "% par jour");
    var ro = k.readouts(["Naissances", "Morts", "Croissance nette", "Temps pour 10⁹ cellules"]);
    var nt = k.note("", "");
    k.button("Tissu normal", function(){ T.set(48); g.set(10); d.set(3.5); }, true);
    k.button("Oncogène activé", function(){ T.set(48); g.set(30); d.set(3.5); });
    k.button("Suppresseur de tumeur muté", function(){ T.set(48); g.set(10); d.set(1); });
    k.button("Les deux altérations", function(){ T.set(48); g.set(30); d.set(1); });
    k.draw(function(){
      var b = g.value / 100 * Math.LN2 * 24 / T.value, dd = d.value / 100, r = b - dd;
      c.clear(); var ax = S.draw.axes(c, {x0:0, x1:1000, y0:0, y1:12, xl:"jours", yl:"log₁₀ (nombre de cellules)", stepX:200, stepY:3, l:50});
      S.draw.line(c, ax.L, ax.Y(9), ax.R, ax.Y(9), B4.pal.red, 1.5, [5, 4]); B4.txt(c, "10⁹ cellules : tumeur détectable", ax.R - 4, ax.Y(9) - 9, B4.pal.red, 12, "right");
      S.draw.line(c, ax.L, ax.Y(0), ax.R, ax.Y(0), "#b8c0cc", 2, [4, 4]);
      S.draw.fn(c, ax, function(t){ return Math.min(12, r * t / Math.LN10); }, B4.pal.red, 3);
      B4.txt(c, "départ : 1 cellule modifiée", ax.L + 8, ax.Y(0) - 10, "#5f6b7a", 12, "left");
      var tt = r > 0 ? 9 * Math.LN10 / r : Infinity;
      ro.set(0, S.fmt(b * 100, 1) + " % / jour"); ro.set(1, S.fmt(dd * 100, 1) + " % / jour"); ro.set(2, (r >= 0 ? "+" : "") + S.fmt(r * 100, 1) + " % / jour");
      ro.set(3, r <= 0.0005 ? "jamais" : S.fmt(tt, 0) + " jours (≈ " + S.fmt(tt / 365, 1) + " an)");
      if (isFinite(tt) && tt < 1000) S.draw.dot(c, ax.X(tt), ax.Y(9), 7, "#13233a");
      nt.set(r > 0.0005 ? "Naissances (" + S.fmt(b * 100, 1) + " %/jour) > morts (" + S.fmt(dd * 100, 1) + " %/jour) : la population double tous les " + S.fmt(Math.LN2 / r, 0) + " jours. Une cellule modifiée atteint 10⁹ cellules en ≈ " + S.fmt(tt, 0) + " jours, sans symptôme tout ce temps." : r >= -0.0005 ? "Naissances ≈ morts : le tissu reste en équilibre (c'est le cas d'un tissu normal)." : "Les morts dépassent les naissances : la population diminue.", r > 0.0005 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id:"b4-c10-chimio", ch:"c10", tag:"Médecine · modèle",
  titre:"Chimiothérapie : cibler les cellules qui se divisent",
  resume:"Un médicament antimitotique frappe les cellules en division : tumeur, mais aussi moelle, intestin, poils.",
  but:"Règle la dose, l'intervalle entre deux cures et le nombre de cures. Compare l'effet sur la tumeur et sur les tissus sains qui se renouvellent.",
  aRetenir:"Un médicament antimitotique atteint surtout les cellules qui se divisent : cellules cancéreuses, mais aussi cellules saines à renouvellement rapide (moelle osseuse, muqueuse intestinale, follicules pileux), d'où fatigue, nausées, perte de cheveux. Les cellules qui ne se divisent pas (neurones) sont peu touchées. On espace les cures pour laisser les tissus sains se régénérer.",
  piege:"Modèle illustratif en échelles relatives : les valeurs numériques ne sont pas celles d'un traitement réel. Aucune conclusion médicale à en tirer.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.9});
    var dose = k.slider("Dose du médicament", 10, 100, 5, 70, "%");
    var dt = k.slider("Intervalle entre deux cures", 7, 28, 7, 21, "jours");
    var n = k.slider("Nombre de cures", 1, 8, 1, 4, "");
    var ro = k.readouts(["Tumeur à la fin", "Moelle osseuse (minimum)", "Intestin (minimum)", "Follicules pileux (minimum)"]);
    var nt = k.note("", "");
    var TIS = [
      {n:"Tumeur", g:0.8, col:"#b42318", tumor:true},
      {n:"Moelle osseuse", g:0.5, h:0.15, col:"#5B21B6"},
      {n:"Muqueuse intestinale", g:0.4, h:0.12, col:"#B45309"},
      {n:"Follicules pileux", g:0.5, h:0.06, col:"#0e7490"},
      {n:"Neurones", g:0, h:0.1, col:"#8a95a3"}
    ];
    function sim(ti, TM){
      var E = dose.value / (dose.value + 10), a = 1, out = [[0, 1]], tm = 1, next = 0, cnt = 0, h = 0.25;
      for (var t = 0; t <= TM + 1e-9; t += h){
        if (cnt < n.value && t >= next - 1e-9){ a *= 1 - ti.g * E; cnt++; next += dt.value; }
        if (ti.tumor) a *= Math.exp(0.03 * h); else a += ti.h * (1 - a) * h;
        if (Math.abs(t / 2 - Math.round(t / 2)) < 1e-9) out.push([t, a]); tm = Math.min(tm, a);
      }
      return {pts:out, min:tm, end:a};
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, TM = Math.max(140, Math.ceil(((n.value - 1) * dt.value + 70) / 10) * 10), ax = S.draw.axes(c, {x0:0, x1:TM, y0:-2, y1:0.4, xl:"jours", yl:"log₁₀ (taille relative)", stepX:TM > 200 ? 50 : 20, stepY:0.5, l:50});
      S.draw.line(c, ax.L, ax.Y(0), ax.R, ax.Y(0), "#b8c0cc", 1.5, [4, 4]);
      for (var q = 0; q < n.value; q++){ var xt = ax.X(q * dt.value); if (q * dt.value <= TM){ S.draw.line(c, xt, ax.B, xt, ax.B - 12, B4.pal.ink, 3); } }
      var res = TIS.map(function(ti){ var r = sim(ti, TM); ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = ti.col; ctx.lineWidth = ti.tumor ? 3.2 : 2.2; ctx.beginPath(); r.pts.forEach(function(p, i){ var x = ax.X(p[0]), y = ax.Y(Math.log10(Math.max(1e-4, p[1]))); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); ctx.restore(); return r; });
      TIS.forEach(function(ti, i){ B4.txt(c, ti.n, ax.R - 4, ax.B - 10 - (4 - i) * 14, ti.col, 12, "right"); });
      B4.txt(c, "traits noirs : cures", ax.L + 6, ax.B - 22, "#5f6b7a", 11, "left");
      ro.set(0, S.fmt(res[0].end * 100, 0) + " % du départ"); ro.set(1, S.fmt(res[1].min * 100, 0) + " %"); ro.set(2, S.fmt(res[2].min * 100, 0) + " %"); ro.set(3, S.fmt(res[3].min * 100, 0) + " %");
      var msg = "La tumeur (80 % de cellules en cycle) subit l'effet le plus fort ; les neurones, qui ne se divisent pas, ne sont pas touchés. ";
      if (res[1].min < 0.45) msg += "Moelle osseuse très atteinte (" + S.fmt(res[1].min * 100, 0) + " %) : moins de globules blancs, risque d'infection. ";
      if (res[0].end < 0.05) msg += "La tumeur est fortement réduite."; else if (res[0].end > 1) msg += "La tumeur est repartie au-delà de sa taille de départ : traitement insuffisant."; else msg += "La tumeur régresse mais subsiste.";
      nt.set(msg, res[1].min < 0.45 ? "warn" : "");
    });
  }
});
