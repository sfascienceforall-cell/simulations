/* Chapitre 6 · Excrétion : reins et bilan hydrique */
(function(){
var TM = 225;     /* mg/min : transport maximal du glucose (seuil rénal ≈ 1,8 g/L pour un DFG de 125 mL/min) */

SFA.sim({
  id: "b5-c06-nephron", ch: "c06", tag: "Classique",
  titre: "Le néphron : filtrer, réabsorber, excréter",
  resume: "Débit de filtration, réabsorption de l'eau, glycémie → urine et bilan par jour.",
  but: "Le glomérule filtre le plasma ; le tubule réabsorbe presque tout. Fais varier le débit de filtration, la part d'eau réabsorbée et la glycémie. Cherche à partir de quelle glycémie le glucose apparaît dans l'urine, et ce que devient l'urée quand la filtration chute.",
  aRetenir: "Chaque jour environ 180 litres de filtrat se forment (DFG ≈ 125 mL/min) et plus de 99 % de l'eau est réabsorbée : il reste 1 à 2 L d'urine. Le glucose est filtré puis entièrement réabsorbé tant que la glycémie reste sous le seuil rénal (≈ 1,8 g/L) : au-delà, les transporteurs sont saturés et le glucose passe dans l'urine. L'urée n'est réabsorbée qu'en partie.",
  piege: "Excrétion ≠ défécation : excréter, c'est éliminer des déchets du métabolisme (urée, CO₂, eau en excès) du milieu intérieur ; les reins ne « fabriquent » pas l'urée (le foie la forme). Valeurs moyennes d'un modèle simplifié.",
  build: function(k, S){
    var c1 = k.canvas(245), c2 = k.canvas(170), pal = S.draw.palette;
    var dfg = k.slider("Débit de filtration glomérulaire (DFG)", 20, 180, 5, 125, "mL/min");
    var rw = k.slider("Eau réabsorbée", 95, 99.9, 0.1, 99.2, "%");
    var gly = k.slider("Glycémie", 0.5, 4, 0.1, 1, "g/L");
    var ro = k.readouts(["Filtrat par jour", "Urine par jour", "Glucose dans l'urine", "Urée du sang à l'équilibre"]);
    var nt = k.note("", "");
    k.draw(function(){
      var F = dfg.value * 1.44, U = F * (1 - rw.value / 100);
      var load = gly.value * dfg.value, ex = Math.max(0, load - TM), gj = ex * 1.44;   /* mg/min × 1,44 = g/jour */
      var urea = 0.3 * 125 / dfg.value;
      c1.clear();
      var x0 = 16, W = c1.W - 32, ctx = c1.ctx;
      S.draw.text(c1, "Eau : " + S.fmt(F, 0) + " L filtrés → " + S.fmt(U, 1) + " L excrétés", x0, 18, {align: "left", size: 13});
      B5.bar(c1, x0, 28, W, 18, rw.value / 100, pal.green, pal.red);
      S.draw.text(c1, "vert : réabsorbé (" + S.fmt(rw.value, 1) + " %) · rouge : excrété", x0, 60, {align: "left", size: 12, color: pal.grey});
      S.draw.text(c1, "Glucose : filtré " + S.fmt(load * 1.44, 0) + " g/j → urine " + S.fmt(gj, 0) + " g/j", x0, 92, {align: "left", size: 13});
      B5.bar(c1, x0, 102, W, 18, Math.min(1, TM / Math.max(load, 1)), pal.green, pal.red);
      S.draw.text(c1, "seuil rénal pour ce DFG : " + S.fmt(TM / dfg.value, 2) + " g/L", x0, 134, {align: "left", size: 12, color: pal.grey});
      S.draw.text(c1, "Urée : 54 g/j filtrés → 27 g/j excrétés", x0, 166, {align: "left", size: 13});
      B5.bar(c1, x0, 176, W, 18, 0.5, pal.green, pal.red);
      S.draw.text(c1, "production constante : l'urée s'accumule si le DFG baisse", x0, 208, {align: "left", size: 12, color: pal.grey});
      c2.clear();
      var ax = S.draw.axes(c2, {x0: 95, x1: 100, y0: 0, y1: 14, xl: "eau réabsorbée (%)", yl: "urine (L/j)", stepX: 1, stepY: 2});
      var pts = []; for (var x = 95; x <= 100; x += 0.05) pts.push([x, dfg.value * 1.44 * (1 - x / 100)]);
      B5.poly(c2, ax, pts, pal.violet, 2.6); S.draw.dot(c2, ax.X(rw.value), ax.Y(U), 6, pal.red);
      ro.set(0, S.fmt(F, 0) + " L"); ro.set(1, S.fmt(U, 2) + " L"); ro.set(2, gj > 0 ? S.fmt(gj, 0) + " g/j" : "aucun"); ro.set(3, S.fmt(urea, 2) + " g/L");
      if (dfg.value < 60) nt.set("DFG < 60 mL/min : insuffisance rénale. L'urée du sang monte (" + S.fmt(urea, 2) + " g/L au lieu de 0,30), car les reins n'éliminent plus assez.", "warn");
      else if (gj > 0) nt.set("Glycémie au-dessus du seuil rénal : le glucose dépasse la capacité de réabsorption (" + S.fmt(TM, 0) + " mg/min) et apparaît dans l'urine (glycosurie), signe possible de diabète.", "warn");
      else if (U > 3) nt.set("Urine > 3 L/j : polyurie. Une réabsorption réduite de l'eau (peu d'ADH) laisse passer beaucoup d'eau.", "warn");
      else if (U < 0.5) nt.set("Urine < 0,5 L/j : oligurie. Les déchets ne peuvent plus être éliminés avec assez d'eau.", "warn");
      else nt.set("Fonctionnement normal : " + S.fmt(100 * (1 - U / F), 1) + " % du filtrat est réabsorbé ; l'urine est un petit volume très concentré.", "ok");
    });
  }
});

/* ---------- hydratation et ADH ---------- */
SFA.sim({
  id: "b5-c06-adh", ch: "c06", tag: "Bilan hydrique",
  titre: "Boire, transpirer : l'ADH règle l'urine",
  resume: "Apports et pertes d'eau → volume d'urine, concentration, ADH, bilan.",
  but: "Règle ce que l'on boit et la sueur perdue sur une journée. Observe le volume et la concentration de l'urine, le niveau d'ADH, et la limite où les reins ne peuvent plus compenser (déshydratation).",
  aRetenir: "Les reins doivent éliminer environ 600 mOsm de déchets par jour. Avec peu d'eau, l'ADH (hormone antidiurétique) augmente la réabsorption d'eau : l'urine est peu abondante et concentrée (jusqu'à 1 200 mOsm/L). Avec beaucoup d'eau, moins d'ADH : urine abondante et diluée (jusqu'à 50 mOsm/L). Bilan : entrées = sorties.",
  piege: "L'urine « jaune foncé » n'est pas un déchet « en plus » : c'est la même quantité de déchets dissoute dans moins d'eau. Quand la concentration maximale est atteinte, boire moins ne réduit plus l'urine : l'organisme se déshydrate. Valeurs moyennes simplifiées.",
  build: function(k, S){
    var c1 = k.canvas(190), c2 = k.canvas(170), pal = S.draw.palette;
    var inp = k.slider("Eau absorbée (boissons + aliments)", 0.5, 6, 0.1, 2, "L/j");
    var sw = k.slider("Sueur", 0, 3, 0.1, 0.3, "L/j");
    var ro = k.readouts(["Urine", "Concentration de l'urine", "ADH", "Bilan de l'eau"]);
    var nt = k.note("", "");
    function calc(i, s){
      var bal = i + 0.3 - 0.9 - 0.1 - s, V = Math.max(0.5, bal), deficit = Math.max(0, 0.5 - bal), uo = Math.min(1200, 600 / V);
      return {bal: bal, V: V, deficit: deficit, uo: Math.max(50, uo), adh: Math.min(1, Math.max(0, (Math.max(50, uo) - 50) / 1150))};
    }
    k.draw(function(){
      var r = calc(inp.value, sw.value);
      c1.clear();
      var ax = S.draw.axes(c1, {x0: 0.5, x1: 6, y0: 0, y1: 6, xl: "eau absorbée (L/j)", yl: "urine (L/j)", stepX: 1, stepY: 1});
      var p1 = [], p2 = [], x;
      for (x = 0.5; x <= 6.0001; x += 0.1){ var q = calc(x, sw.value); p1.push([x, q.V]); }
      B5.poly(c1, ax, p1, pal.amber, 2.8); S.draw.dot(c1, ax.X(inp.value), ax.Y(r.V), 6, pal.red);
      var yel = Math.min(1, (r.uo - 50) / 1150), col = "rgb(" + Math.round(255 - 40 * yel) + "," + Math.round(240 - 100 * yel) + "," + Math.round(160 - 140 * yel) + ")";
      B5.circ(c1, ax.R - 28, ax.T + 34, 22, col, "#8a95a3"); S.draw.text(c1, "urine", ax.R - 28, ax.T + 66, {size: 12, color: pal.grey});
      c2.clear();
      var ax2 = S.draw.axes(c2, {x0: 0.5, x1: 6, y0: 0, y1: 1300, xl: "eau absorbée (L/j)", yl: "mOsm/L", stepX: 1, stepY: 300});
      for (x = 0.5; x <= 6.0001; x += 0.1) p2.push([x, calc(x, sw.value).uo]);
      B5.poly(c2, ax2, p2, pal.violet, 2.8); S.draw.dot(c2, ax2.X(inp.value), ax2.Y(r.uo), 6, pal.red);
      S.draw.line(c2, ax2.X(0.5), ax2.Y(1200), ax2.X(6), ax2.Y(1200), pal.red, 1.2, [5, 4]); S.draw.text(c2, "maximum 1 200", ax2.R - 4, ax2.Y(1200) + 10, {align: "right", size: 12, color: pal.red});
      ro.set(0, S.fmt(r.V, 1) + " L/j"); ro.set(1, S.fmt(r.uo, 0) + " mOsm/L"); ro.set(2, S.fmt(r.adh * 100, 0) + " %"); ro.set(3, r.deficit > 0 ? "− " + S.fmt(r.deficit, 1) + " L/j" : "équilibré");
      if (r.deficit > 0) nt.set("Déshydratation : même avec l'urine la plus concentrée possible (0,5 L/j), il manque " + S.fmt(r.deficit, 1) + " L par jour, soit " + S.fmt(100 * r.deficit / 70, 1) + " % de la masse d'un adulte de 70 kg.", "warn");
      else if (r.uo <= 50.5) nt.set("Urine la plus diluée possible (50 mOsm/L) : ADH quasi nulle ; l'eau en excès est éliminée.", "ok");
      else nt.set("Le rein ajuste la concentration de l'urine pour maintenir le bilan : " + S.fmt(r.V, 1) + " L à " + S.fmt(r.uo, 0) + " mOsm/L, ADH à " + S.fmt(r.adh * 100, 0) + " %.", "ok");
    });
  }
});

/* ---------- analyse d'urine ---------- */
SFA.sim({
  id: "b5-c06-bandelette", ch: "c06", tag: "Diagnostic",
  titre: "La bandelette urinaire : lire une analyse",
  resume: "Glycémie, filtre abîmé, infection, hydratation → résultats de la bandelette.",
  but: "Règle quatre paramètres de la personne et lis les six cases de la bandelette. Retrouve quelle cause explique quelle anomalie : glucose, protéines, leucocytes, nitrites, sang, densité.",
  aRetenir: "Une urine normale ne contient ni glucose, ni protéines en quantité notable, ni leucocytes. Du glucose indique que la glycémie dépasse le seuil rénal ; des protéines, que le filtre glomérulaire est abîmé ; des leucocytes et des nitrites, une infection urinaire. La densité renseigne sur l'hydratation.",
  piege: "Une anomalie ne fait pas un diagnostic : la bandelette oriente, un médecin confirme. Par exemple une urine concentrée avec une trace de protéines n'est pas forcément une maladie. Seuils indicatifs d'un modèle simplifié.",
  build: function(k, S){
    var c = k.canvas(230), pal = S.draw.palette;
    var gly = k.slider("Glycémie", 0.5, 4, 0.1, 1, "g/L");
    var les = k.slider("Atteinte du filtre glomérulaire", 0, 100, 5, 0, "%");
    var inf = k.slider("Infection urinaire", 0, 100, 5, 0, "%");
    var hyd = k.slider("Hydratation", 0, 100, 5, 60, "%");
    var ro = k.readouts(["Glucose urinaire", "Protéines", "Leucocytes", "Densité"]);
    var nt = k.note("", "");
    var ramp = ["#cfe3f1", "#f0dc86", "#e4a257", "#9e3f2a"], lab = ["négatif", "+", "++", "+++"];
    function lvl(v, c1, c2, c3){ return v < c1 ? 0 : v < c2 ? 1 : v < c3 ? 2 : 3; }
    k.draw(function(){
      var gj = Math.max(0, gly.value * 125 - TM) * 1.44, x = les.value / 100, prot = 0.1 + 8 * x * x, y = inf.value / 100, leu = 5 + 600 * y * y;
      var nit = y >= 0.3, sang = x >= 0.6 || y >= 0.6, dens = 1.030 - 0.027 * hyd.value / 100;
      var L = [lvl(gj, 0.5, 5, 20), lvl(prot, 0.15, 0.5, 2), lvl(leu, 10, 100, 400), nit ? 2 : 0, sang ? (x >= 0.8 || y >= 0.8 ? 2 : 1) : 0];
      var names = ["Glucose", "Protéines", "Leucocytes", "Nitrites", "Sang"], i;
      c.clear();
      var pw = (c.W - 40) / 6, x0 = 20;
      for (i = 0; i < 5; i++){
        B5.rect(c, x0 + i * pw + 4, 40, pw - 8, 90, ramp[L[i]], "#8a95a3", 1.5);
        S.draw.text(c, names[i], x0 + i * pw + pw / 2, 24, {size: 12});
        S.draw.text(c, i === 3 ? (nit ? "positif" : "négatif") : lab[Math.min(3, L[i])], x0 + i * pw + pw / 2, 148, {size: 12});
      }
      var cc = 1 - hyd.value / 100, dc = "rgb(" + Math.round(255 - 55 * cc) + "," + Math.round(245 - 95 * cc) + "," + Math.round(190 - 150 * cc) + ")";
      B5.rect(c, x0 + 5 * pw + 4, 40, pw - 8, 90, dc, "#8a95a3", 1.5);
      S.draw.text(c, "Densité", x0 + 5 * pw + pw / 2, 24, {size: 12}); S.draw.text(c, dens.toFixed(3).replace(".", ","), x0 + 5 * pw + pw / 2, 148, {size: 12});
      S.draw.text(c, "Lire la bandelette : plus la case est foncée, plus le résultat est positif.", c.W / 2, 190, {size: 12, color: pal.grey});
      S.draw.text(c, "Densité normale : 1,003 à 1,030", c.W / 2, 212, {size: 12, color: pal.grey});
      ro.set(0, gj > 0 ? S.fmt(gj, 0) + " g/j" : "0"); ro.set(1, S.fmt(prot, 2) + " g/24 h"); ro.set(2, S.fmt(leu, 0) + " /µL"); ro.set(3, dens.toFixed(3).replace(".", ","));
      var dg = [];
      if (gj > 0) dg.push("glycosurie : glycémie au-dessus du seuil rénal, évoque un diabète sucré (à confirmer)");
      if (prot >= 0.5) dg.push("protéinurie " + (prot > 3.5 ? "massive" : "marquée") + " : filtre glomérulaire abîmé");
      if (nit || leu >= 100) dg.push("leucocytes ± nitrites : évoque une infection urinaire");
      if (prot >= 0.15 && prot < 0.5) dg.push("trace de protéines : sans gravité si elle est isolée (effort, urine concentrée), à recontrôler");
      if (leu >= 10 && leu < 100 && !nit) dg.push("quelques leucocytes : à recontrôler, pas encore une infection nette");
      if (sang && !(nit || leu >= 100)) dg.push("sang dans l'urine : atteinte du filtre ou lésion des voies urinaires");
      nt.set(dg.length ? "Hypothèses : " + dg.join(" ; ") + "." : "Bandelette normale pour ces valeurs (densité " + dens.toFixed(3).replace(".", ",") + ").", dg.length ? "warn" : "ok");
    });
  }
});

/* ---------- dialyse ---------- */
function dialyse(n, dur, Qb, G){
  var days = {2: [0, 3], 3: [0, 2, 4], 4: [0, 2, 3, 5], 5: [0, 1, 2, 3, 4]}[n], K = 0.7 * Qb * 60 / 1000, V = 40, C = 0.5, dt = 0.05, out = [], w, st, t, on, j;
  for (w = 0; w < 6; w++){
    for (st = 0; st < 7 * 24 / dt; st++){
      t = st * dt; on = false;
      for (j = 0; j < days.length; j++){ var s = days[j] * 24 + 8; if (t >= s && t < s + dur) on = true; }
      C += (G / 24 / V - (on ? K / V * C : 0)) * dt;
      if (w === 5) out.push([t / 24, C, on]);
    }
  }
  return {out: out, K: K, days: days, ktv: K * dur / V};
}
SFA.sim({
  id: "b5-c06-dialyse", ch: "c06", tag: "Technique",
  titre: "Hémodialyse : épurer le sang d'un rein défaillant",
  resume: "Débit du sang, durée et fréquence des séances → urée sur une semaine.",
  but: "Un patient n'élimine plus l'urée par ses reins. Une machine filtre son sang à travers une membrane. Règle le débit du sang, la durée des séances et leur nombre par semaine, et observe la courbe d'urée sur une semaine. Objectif : Kt/V ≥ 1,2 par séance et une urée qui monte peu entre deux séances.",
  aRetenir: "Dans le dialyseur, le sang et le liquide de dialyse circulent de part et d'autre d'une membrane semi-perméable : l'urée et les petites molécules diffusent vers le liquide de dialyse, mais les cellules et les grosses protéines restent dans le sang. Entre les séances, l'urée s'accumule à nouveau : il faut en général trois séances par semaine.",
  piege: "La dialyse remplace seulement une partie de la fonction du rein (épuration, bilan en eau) : elle ne produit pas les hormones rénales ni la régulation fine. La séance fait baisser l'urée de 60 à 70 % mais pas à 0. Modèle à un compartiment, valeurs indicatives.",
  build: function(k, S){
    var c = k.canvas(280), pal = S.draw.palette;
    var n = k.slider("Séances par semaine", 2, 5, 1, 3, "");
    var dur = k.slider("Durée d'une séance", 2, 6, 0.5, 4, "h");
    var qb = k.slider("Débit du sang dans le dialyseur", 200, 400, 25, 300, "mL/min");
    var G = k.slider("Production d'urée (apport en protéines)", 8, 25, 1, 15, "g/j");
    var ro = k.readouts(["Kt/V par séance", "Baisse d'urée par séance", "Urée max (avant séance)", "Urée moyenne"]);
    var nt = k.note("", "");
    k.draw(function(){
      var m = dialyse(n.value, dur.value, qb.value, G.value), o = m.out;
      c.clear();
      var mx = Math.max.apply(null, o.map(function(p){ return p[1]; })), mn = Math.min.apply(null, o.map(function(p){ return p[1]; })), mean = o.reduce(function(a, p){ return a + p[1]; }, 0) / o.length;
      var ax = S.draw.axes(c, {x0: 0, x1: 7, y0: 0, y1: Math.max(2, Math.ceil(mx * 2) / 2 + 0.5), xl: "jour", yl: "urée (g/L)", stepX: 1, stepY: 0.5});
      c.ctx.fillStyle = "rgba(46,107,85,.12)"; c.ctx.fillRect(ax.X(0), ax.Y(0.45), ax.X(7) - ax.X(0), ax.Y(0.15) - ax.Y(0.45));
      S.draw.text(c, "valeurs normales", ax.R - 6, ax.Y(0.3), {align: "right", size: 12, color: pal.green});
      m.days.forEach(function(d){ c.ctx.fillStyle = "rgba(91,33,182,.14)"; c.ctx.fillRect(ax.X(d + 8 / 24), ax.T, ax.X(d + 8 / 24 + dur.value / 24) - ax.X(d + 8 / 24), ax.B - ax.T); });
      B5.poly(c, ax, o.filter(function(p, i){ return i % 4 === 0; }).map(function(p){ return [p[0], p[1]]; }), pal.violet, 2.8);
      var urr = 1 - Math.exp(-m.ktv);
      ro.set(0, S.fmt(m.ktv, 2)); ro.set(1, S.fmt(urr * 100, 0) + " %"); ro.set(2, S.fmt(mx, 2) + " g/L"); ro.set(3, S.fmt(mean, 2) + " g/L");
      if (m.ktv >= 1.2) nt.set("Dose de dialyse atteinte (Kt/V ≥ 1,2). L'urée remonte entre deux séances de " + S.fmt(mx - mn, 2) + " g/L au plus.", "ok");
      else nt.set("Kt/V = " + S.fmt(m.ktv, 2) + " < 1,2 : épuration insuffisante par séance. Allonge la séance, augmente le débit du sang ou le nombre de séances.", "warn");
    });
  }
});
})();
