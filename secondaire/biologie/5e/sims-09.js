/* Chapitre 9 · Cycle menstruel, fécondation et contraception */
(function(){
var g = B5.g;
/* niveaux relatifs (0 à 1) des hormones, ovulation au jour o = L − 14 ; modèle qualitatif */
function hormones(d, L){
  var o = L - 14;
  var fsh = 0.15 + 0.45 * g(d, 3, 3) + 0.35 * g(d, o, 1.0);
  var lh = 0.12 + 0.88 * g(d, o - 0.2, 0.7);
  var e2 = 0.1 + 0.9 * g(d, o - 1, 3.0) + 0.5 * g(d, o + 7, 3.5);
  var p = d > o - 0.5 ? 0.05 + 0.95 * g(d, o + 7, 3.5) : 0.05;
  return {fsh: fsh, lh: lh, e2: Math.min(1, e2), p: p};
}
function endo(d, L){ var o = L - 14; return B5.interp([[1, 4], [3, 2], [5, 2.5], [o, 9], [o + 7, 12], [L - 1, 10], [L, 6], [40, 6]], d); }
function folliculeMm(d, L){ var o = L - 14; if (d <= o) return 4 + 16 * Math.pow(Math.max(0, d - 1) / Math.max(1, o - 1), 2.2); return B5.interp([[o, 20], [o + 7, 16], [L, 8]], d); }
function phase(d, L){ var o = L - 14; if (d <= 5) return "phase menstruelle"; if (d < o) return "phase folliculaire (proliférative)"; if (d === o) return "ovulation"; return "phase lutéale (sécrétoire)"; }
SFA.sim({
  id: "b5-c09-cycle", ch: "c09", tag: "Classique",
  titre: "Le cycle menstruel : hormones, follicule, endomètre",
  resume: "Jour du cycle et durée du cycle → quatre hormones, follicule, endomètre, température.",
  but: "Déplace le jour du cycle et observe les quatre hormones, la taille du follicule, l'épaisseur de l'endomètre. Puis change la durée du cycle (21 à 35 jours) : repère le jour de l'ovulation. Quelle phase dure toujours environ 14 jours ?",
  aRetenir: "Un cycle commence le 1er jour des règles. La FSH fait mûrir un follicule, qui sécrète des œstrogènes ; leur pic provoque un pic de LH (rétrocontrôle positif), qui déclenche l'ovulation. Le corps jaune sécrète ensuite progestérone et œstrogènes, qui préparent l'endomètre à la nidation. Sans fécondation, le corps jaune dégénère et les règles surviennent. La phase lutéale dure toujours ≈ 14 jours : l'ovulation a lieu environ 14 jours avant les règles suivantes.",
  piege: "L'ovulation n'a pas toujours lieu le 14e jour : dans un cycle de 35 jours, c'est vers le 21e jour ; dans un cycle de 21 jours, vers le 7e. Seule la phase lutéale (≈ 14 jours) est constante. Courbes qualitatives, niveaux relatifs.",
  build: function(k, S){
    var c1 = k.canvas(210), c2 = k.canvas(150), pal = S.draw.palette;
    var L = k.slider("Durée du cycle", 21, 35, 1, 28, "jours");
    var dd = k.slider("Jour du cycle", 1, 35, 1, 14, "");
    var ro = k.readouts(["Phase", "Jour de l'ovulation", "Follicule / corps jaune", "Endomètre"]);
    var nt = k.note("", "");
    k.draw(function(){
      var l = L.value, d = Math.min(dd.value, l), o = l - 14, hs = hormones(d, l), x;
      c1.clear();
      var ax = S.draw.axes(c1, {x0: 1, x1: l, y0: 0, y1: 1.05, xl: "jour du cycle", yl: "niveau relatif", stepX: l > 28 ? 5 : 4, stepY: 0.25});
      var P = {fsh: [], lh: [], e2: [], p: []};
      for (x = 1; x <= l + 0.01; x += 0.25){ var h = hormones(x, l); P.fsh.push([x, h.fsh]); P.lh.push([x, h.lh]); P.e2.push([x, h.e2]); P.p.push([x, h.p]); }
      c1.ctx.fillStyle = "rgba(180,35,24,.10)"; c1.ctx.fillRect(ax.X(1), ax.T, ax.X(5.5) - ax.X(1), ax.B - ax.T);
      B5.poly(c1, ax, P.fsh, pal.amber, 2.4); B5.poly(c1, ax, P.lh, pal.teal, 2.4); B5.poly(c1, ax, P.e2, pal.red, 2.4); B5.poly(c1, ax, P.p, pal.violet, 2.4);
      B5.leg(c1, [["FSH", pal.amber], ["LH", pal.teal], ["œstrogènes", pal.red], ["progestérone", pal.violet]], ax.L + 8, ax.T + 34);
      S.draw.line(c1, ax.X(d), ax.T, ax.X(d), ax.B, pal.ink, 1.4, [5, 4]);
      S.draw.line(c1, ax.X(o), ax.T, ax.X(o), ax.B, pal.green, 1.2, [3, 4]); S.draw.text(c1, "ovulation", ax.X(o), ax.B - 10, {size: 12, color: pal.green});
      c2.clear();
      var ax2 = S.draw.axes(c2, {x0: 1, x1: l, y0: 0, y1: 22, xl: "jour du cycle", yl: "mm", stepX: l > 28 ? 5 : 4, stepY: 5});
      var pf = [], pe = []; for (x = 1; x <= l + 0.01; x += 0.5){ pf.push([x, folliculeMm(x, l)]); pe.push([x, endo(x, l)]); }
      B5.poly(c2, ax2, pf, pal.red, 2.4); B5.poly(c2, ax2, pe, pal.violet, 2.4);
      B5.leg(c2, [["follicule", pal.red], ["endomètre", pal.violet]], ax2.L + 8, ax2.T + 34);
      S.draw.line(c2, ax2.X(d), ax2.T, ax2.X(d), ax2.B, pal.ink, 1.4, [5, 4]);
      ro.set(0, phase(d, l)); ro.set(1, "jour " + o); ro.set(2, S.fmt(folliculeMm(d, l), 0) + " mm"); ro.set(3, S.fmt(endo(d, l), 0) + " mm");
      var dom = d <= 5 ? "Les œstrogènes et la progestérone sont au plus bas : l'endomètre se détache (règles)." : d < o - 1 ? "La FSH fait grandir des follicules ; le follicule dominant sécrète de plus en plus d'œstrogènes, qui épaississent l'endomètre." : d <= o ? "Pic d'œstrogènes puis pic de LH : l'ovulation a lieu environ 24 à 36 h après le début du pic de LH." : "Le corps jaune sécrète progestérone et œstrogènes : l'endomètre se prépare à la nidation. Sans fécondation, ils chutent et les règles reviennent.";
      nt.set(dom + (l !== 28 ? " Dans un cycle de " + l + " jours, l'ovulation a lieu le jour " + o + ", pas le 14e." : ""), "ok");
    });
  }
});

/* ---------- pilule ---------- */
function pilule(m, pos){
  var days = 84, taken = [], i;
  for (i = 1; i <= days; i++){ var pk = (i - 1) % 28; taken[i] = pk < 21; }
  var s, e;
  if (m > 0){
    if (pos === "d"){ s = 29; } else if (pos === "m"){ s = 36; } else { s = 49 - m + 1; }
    for (i = s; i < s + m && i <= 49; i++) taken[i] = false;
  }
  var F = 4, out = [], free = 0, runMax = 0, run = 0, ov = -1;
  for (i = 1; i <= days; i++){
    if (taken[i]){ F = Math.max(4, F - 1.5); run = 0; } else { F += 1.3; run++; runMax = i >= 25 && i <= 60 ? Math.max(runMax, run) : runMax; }
    if (F >= 18 && ov < 0 && i >= 29 && i <= 70) ov = i;
    out.push([i, F]);
  }
  return {taken: taken, F: out, run: runMax, ov: ov};
}
SFA.sim({
  id: "b5-c09-pilule", ch: "c09", tag: "Contraception",
  titre: "La pilule combinée : pourquoi un oubli peut compter",
  resume: "Comprimés oubliés et position de l'oubli → jours sans hormone et croissance du follicule.",
  but: "La pilule combinée (21 comprimés puis 7 jours de pause) contient des hormones synthétiques qui bloquent le cycle. Choisis combien de comprimés sont oubliés et à quel moment de la plaquette. Observe le nombre de jours consécutifs sans hormone et la croissance du follicule dans ce modèle.",
  aRetenir: "La pilule apporte œstrogène et progestatif de synthèse : par rétrocontrôle négatif, FSH et LH restent bas, le follicule ne mûrit pas, il n'y a pas de pic de LH, donc pas d'ovulation ; la glaire cervicale est épaisse et l'endomètre mince. Ce qui compte, c'est la durée sans hormone : un oubli au début ou à la fin d'une plaquette allonge la pause et laisse un follicule croître.",
  piege: "La pilule n'agit pas seulement comme une « barrière » : elle empêche surtout l'ovulation. Cette simulation est pédagogique : les chiffres sont des illustrations, pas des règles. En cas d'oubli réel, il faut suivre la notice ou demander conseil à un médecin ou un pharmacien. La pilule ne protège pas des infections sexuellement transmissibles.",
  build: function(k, S){
    var c = k.canvas(300), pal = S.draw.palette;
    var m = k.slider("Comprimés oubliés (2e plaquette)", 0, 7, 1, 2, "");
    var pos = k.seg("Où dans la plaquette ?", [["d", "début"], ["m", "milieu"], ["f", "fin"]], "d");
    var ro = k.readouts(["Jours sans hormone d'affilée", "Taille max du follicule", "Ovulation possible ?", "Effet sur FSH et LH"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var r = pilule(m.value, pos.value), W = c.W, i;
      var x0 = 14, cw = (W - 28) / 28;
      S.draw.text(c, "vert : pris · rouge : oublié · gris : pause (jours 29 à 56)", x0, 18, {align: "left", size: 12, color: pal.grey});
      for (i = 29; i <= 56; i++){
        var x = x0 + (i - 29) * cw, col = r.taken[i] ? pal.green : (((i - 1) % 28) >= 21 ? "#c8ceda" : pal.red);
        B5.rect(c, x + 1, 40, cw - 2, 22, col, null);
      }
      var ax = S.draw.axes(c, {x0: 29, x1: 56, y0: 0, y1: 24, xl: "jour", yl: "follicule (mm)", stepX: 3, stepY: 6, t: 76, l: 46});
      c.ctx.fillStyle = "rgba(180,35,24,.08)"; c.ctx.fillRect(ax.X(29), ax.Y(24), ax.X(56) - ax.X(29), ax.Y(18) - ax.Y(24));
      S.draw.line(c, ax.X(29), ax.Y(18), ax.X(56), ax.Y(18), pal.red, 1.4, [5, 4]); S.draw.text(c, "18 mm : ovulation possible", ax.R - 4, ax.Y(18) + 10, {align: "right", size: 12, color: pal.red});
      var pts = r.F.filter(function(p){ return p[0] >= 29 && p[0] <= 56; });
      B5.poly(c, ax, pts, pal.violet, 3);
      var mx = Math.max.apply(null, pts.map(function(p){ return p[1]; }));
      ro.set(0, r.run + " j"); ro.set(1, S.fmt(mx, 1) + " mm"); ro.set(2, mx >= 18 ? "oui (dans ce modèle)" : "non"); ro.set(3, r.run <= 7 ? "supprimées" : (mx >= 18 ? "échappent au freinage" : "freinage affaibli"));
      if (r.run <= 7) nt.set("Pause de 7 jours maximum : le freinage hormonal est repris avant que le follicule ne mûrisse. Les règles de privation viennent de la chute d'hormones pendant la pause.", "ok");
      else if (mx >= 18) nt.set(r.run + " jours sans hormone : le follicule atteint " + S.fmt(mx, 1) + " mm dans ce modèle, une ovulation devient possible. En pratique, un oubli demande de suivre la notice (comprimé à prendre dès que possible, précautions supplémentaires) et parfois la contraception d'urgence.", "warn");
      else nt.set(r.run + " jours sans hormone d'affilée (au lieu de 7 au maximum) : le follicule grandit jusqu'à " + S.fmt(mx, 1) + " mm : risque non négligeable. Demande conseil (notice, pharmacien).", "warn");
    });
  }
});

/* ---------- fenêtre de fertilité ---------- */
var CONC = {"-5": 0.10, "-4": 0.16, "-3": 0.14, "-2": 0.27, "-1": 0.31, "0": 0.33};
var EVT = [[0, "Ovulation : l'ovocyte II quitte l'ovaire et entre dans la trompe"], [0.5, "Fécondation dans l'ampoule de la trompe : le zygote a 46 chromosomes"], [1.5, "1ʳᵉ division : 2 cellules (segmentation)"], [3, "Morula (≈ 16 cellules), qui arrive dans l'utérus"], [5, "Blastocyste (≈ 100 cellules) : le massif embryonnaire et le trophoblaste se distinguent"], [7, "Nidation : le blastocyste s'implante dans l'endomètre"], [10, "Nidation terminée : sécrétion d'hCG (détectable dans le sang)"]];
SFA.sim({
  id: "b5-c09-fenetre", ch: "c09", tag: "Calendrier",
  titre: "La fenêtre de fertilité : quels jours risquent une fécondation ?",
  resume: "Durée du cycle et jour du rapport → probabilité de conception ; jours suivant l'ovulation.",
  but: "Choisis la durée du cycle et le jour d'un rapport non protégé. Lis la probabilité de conception et repère la fenêtre fertile (6 jours). Déplace ensuite le curseur du temps après l'ovulation pour suivre les étapes de la fécondation à la nidation.",
  aRetenir: "L'ovocyte reste fécondable environ 12 à 24 h, mais les spermatozoïdes peuvent survivre jusqu'à 5 jours dans les voies génitales féminines : la fenêtre fertile compte donc les 5 jours avant l'ovulation et le jour de l'ovulation. Fécondation (dans la trompe) et nidation (dans l'utérus, vers 6 à 10 jours) sont deux événements différents.",
  piege: "Fécondation et nidation ne sont pas la même chose ; l'ovulation n'est pas le 14e jour de tous les cycles ; et la méthode du calendrier (ou « Ogino ») est peu fiable comme contraception parce que le jour de l'ovulation varie d'un cycle à l'autre. Probabilités : ordre de grandeur d'études d'observation (couples cherchant une grossesse).",
  build: function(k, S){
    var c = k.canvas(210), pal = S.draw.palette;
    var L = k.slider("Durée du cycle", 21, 35, 1, 28, "jours");
    var d = k.slider("Jour du rapport", 1, 35, 1, 12, "");
    var t = k.slider("Temps écoulé depuis l'ovulation", 0, 10, 0.5, 0, "jours");
    var ro = k.readouts(["Jour de l'ovulation", "Fenêtre fertile", "Probabilité de conception (ce jour)", "Étape"]);
    var nt = k.note("", "");
    k.draw(function(){
      var l = L.value, o = l - 14, dj = Math.min(d.value, l), rel = dj - o;
      c.clear();
      var ax = S.draw.axes(c, {x0: 0.5, x1: l + 0.5, y0: 0, y1: 0.4, xl: "jour du cycle", yl: "probabilité", stepX: l > 28 ? 5 : 4, stepY: 0.1});
      var bw = (ax.X(1) - ax.X(0)) * 0.7, i;
      for (i = 1; i <= l; i++){
        var r = i - o, p = CONC[String(r)] || 0;
        if (p > 0){ c.ctx.fillStyle = (i === dj) ? "rgba(180,35,24,.8)" : "rgba(91,33,182,.5)"; c.ctx.fillRect(ax.X(i) - bw / 2, ax.Y(p), bw, ax.Y(0) - ax.Y(p)); }
      }
      S.draw.line(c, ax.X(14), ax.T, ax.X(14), ax.B, pal.grey, 1.3, [4, 4]); S.draw.text(c, "J14", ax.X(14) + 3, ax.T + 34, {align: "left", size: 12, color: pal.grey});
      S.draw.line(c, ax.X(dj), ax.T, ax.X(dj), ax.B, pal.red, 1.8, [5, 4]); S.draw.text(c, "rapport", ax.X(dj) + 3, ax.T + 50, {align: "left", size: 12, color: pal.red});
      S.draw.text(c, "ovulation", ax.X(o), ax.B - 8, {size: 12, color: pal.green});
      var p0 = CONC[String(rel)] || 0, ev = EVT[0];
      EVT.forEach(function(e){ if (t.value >= e[0]) ev = e; });
      ro.set(0, "jour " + o); ro.set(1, "jours " + (o - 5) + " à " + o); ro.set(2, p0 > 0 ? S.fmt(p0 * 100, 0) + " %" : "≈ 0 %"); ro.set(3, ev[1]);
      nt.set(p0 > 0 ? "Rapport " + (rel < 0 ? Math.abs(rel) + " jour" + (rel < -1 ? "s" : "") + " avant" : "le jour de") + " l'ovulation : environ " + S.fmt(p0 * 100, 0) + " % de chances de conception pour ce rapport (ordre de grandeur). Un rapport 2 jours avant l'ovulation est le plus favorable avec celui de la veille et du jour même." : "Hors de la fenêtre fertile : la probabilité de conception est très faible dans ce modèle, mais l'estimation du jour d'ovulation reste incertaine d'un cycle à l'autre.", p0 > 0 ? "ok" : "warn");
    });
  }
});

/* ---------- test de grossesse ---------- */
function hcg(d){ return d < 8 ? 0 : Math.min(1e5, 4 * Math.pow(2, (d - 9) / 1.8)); }
SFA.sim({
  id: "b5-c09-hcg", ch: "c09", tag: "Biologie médicale",
  titre: "Test de grossesse : l'hCG double tous les 2 jours",
  resume: "Jours après l'ovulation et sensibilité du test → hCG, bande test positive ou non.",
  but: "Déplace le jour après l'ovulation et choisis la sensibilité du test (seuil de détection). Repère le premier jour où la bande « T » apparaît, et compare avec le jour attendu des règles (14 jours après l'ovulation).",
  aRetenir: "L'hCG est sécrétée par le trophoblaste de l'embryon après la nidation. Elle augmente d'environ le double tous les 2 jours au début : on la détecte dans le sang vers 8 à 10 jours après l'ovulation, et dans l'urine par un test dès le jour du retard de règles (seuil ≈ 25 mUI/mL). Elle maintient le corps jaune, qui continue de sécréter la progestérone.",
  piege: "Un test négatif très tôt ne prouve pas l'absence de grossesse (faux négatif) : l'hCG n'a pas encore atteint le seuil. Un test positif doit être confirmé par un médecin. Courbe : moyenne théorique, la variation individuelle est grande.",
  build: function(k, S){
    var c = k.canvas(240), pal = S.draw.palette;
    var d = k.slider("Jours après l'ovulation", 0, 42, 1, 14, "j");
    var th = k.seg("Sensibilité du test", [["10", "10 mUI/mL"], ["25", "25 mUI/mL"], ["50", "50 mUI/mL"]], "25");
    var ro = k.readouts(["hCG estimée", "Test", "Semaines d'aménorrhée (SA)", "Premier jour positif"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var T = parseInt(th.value, 10), h = hcg(d.value), W = c.W;
      var ax = S.draw.axes(c, {x0: 0, x1: 42, y0: 0, y1: 5.5, xl: "jours après l'ovulation", yl: "log₁₀ hCG (mUI/mL)", stepX: 7, stepY: 1, r: 150});
      var pts = []; for (var x = 8; x <= 42; x += 0.5) pts.push([x, Math.log10(Math.max(1, hcg(x)))]);
      B5.poly(c, ax, pts, pal.violet, 2.8);
      S.draw.line(c, ax.X(0), ax.Y(Math.log10(T)), ax.X(42), ax.Y(Math.log10(T)), pal.red, 1.5, [5, 4]); S.draw.text(c, "seuil " + T, ax.X(0) + 4, ax.Y(Math.log10(T)) - 9, {align: "left", size: 12, color: pal.red});
      S.draw.line(c, ax.X(14), ax.T, ax.X(14), ax.B, pal.green, 1.2, [3, 4]); S.draw.text(c, "règles attendues", ax.X(14) + 3, ax.B - 10, {align: "left", size: 12, color: pal.green});
      S.draw.line(c, ax.X(d.value), ax.T, ax.X(d.value), ax.B, pal.ink, 1.4, [5, 4]);
      if (h > 0) S.draw.dot(c, ax.X(d.value), ax.Y(Math.log10(Math.max(1, h))), 6, pal.red);
      var pos = h >= T;
      /* bandelette */
      var bx = ax.R + 24, by = ax.T + 6, bw = 90, bh = 150;
      B5.rect(c, bx, by, bw, bh, "#fdfdfd", "#8a95a3", 1.5);
      S.draw.text(c, "C", bx + 12, by + 28, {size: 12, color: pal.grey}); S.draw.text(c, "T", bx + 12, by + 88, {size: 12, color: pal.grey});
      c.ctx.fillStyle = "#c2185b"; c.ctx.fillRect(bx + 28, by + 22, 52, 7);
      if (pos){ var inten = Math.min(1, 0.25 + 0.75 * Math.log10(h / T + 1) / 2); c.ctx.globalAlpha = inten; c.ctx.fillRect(bx + 28, by + 82, 52, 7); c.ctx.globalAlpha = 1; }
      S.draw.text(c, pos ? "positif" : "négatif", bx + bw / 2, by + bh + 20, {size: 12, color: pos ? pal.red : pal.grey});
      var first = null; for (var j = 8; j <= 42; j++) if (hcg(j) >= T){ first = j; break; }
      ro.set(0, h > 0 ? S.fmt(h, h < 10 ? 1 : 0) + " mUI/mL" : "indétectable (avant nidation)"); ro.set(1, pos ? "positif" : "négatif"); ro.set(2, S.fmt((14 + d.value) / 7, 1) + " SA (cycle de 28 j)"); ro.set(3, "jour " + first + " après l'ovulation");
      nt.set(pos ? "hCG ≥ seuil : la bande T apparaît. Valeur moyenne ; doublement toutes les ≈ 2 jours au début." : (d.value < 8 ? "Avant la nidation, il n'y a pas d'hCG : un test est forcément négatif, même en cas de fécondation." : "Test encore négatif : l'hCG (" + S.fmt(h, 1) + " mUI/mL) est sous le seuil. Un test négatif trop précoce peut être un faux négatif : refaire 2 à 3 jours plus tard."), pos ? "ok" : "warn");
    });
  }
});
})();
