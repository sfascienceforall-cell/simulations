/* Chapitre 5 · Défenses de l'organisme et immunité */
(function(){
var LN2 = Math.LN2;

/* ---------- infection : courbes de charge et d'anticorps (modèle phénoménologique en log10) ---------- */
function infection(o){
  var g = o.r * (1 - o.eps), ta = Math.max(5, 11 - o.lp0), lp = o.lp0, dt = 0.05, T = 40, load = [], ab = [], an = 0, cleared = -1, i;
  for (var t = 0; t <= T + 1e-9; t += dt){
    an = o.ad ? 1 / (1 + Math.exp(-(t - ta) / 1.2)) : 0;
    load.push([t, lp]);
    var d = g * (1 - lp / 9) - 1.2 * an;
    if (lp > 0) lp = Math.min(9, lp + d * dt);
    if (lp <= 0){ lp = 0; if (cleared < 0 && t > 1) cleared = t; }
  }
  for (i = 0; i < load.length; i++){
    var tt = load[i][0], a = o.ad ? 3 / (1 + Math.exp(-(tt - ta - 2) / 2.5)) : 0;
    if (cleared >= 0 && tt > cleared + 7) a *= Math.exp(-(tt - cleared - 7) * LN2 / 25);
    ab.push([tt, a]);
  }
  return {load: load, ab: ab, ta: ta, cleared: cleared};
}
SFA.sim({
  id: "b5-c05-infection", ch: "c05", tag: "Classique",
  titre: "Une infection : innée d'abord, adaptative ensuite",
  resume: "Dose, vitesse de multiplication, efficacité innée → charge en pathogènes et anticorps.",
  but: "Règle la dose de départ, la vitesse de multiplication du pathogène et l'efficacité de la défense innée. Observe quand l'immunité adaptative démarre, jusqu'où monte le pathogène, et ce qui se passe sans immunité adaptative (immunodéficience).",
  aRetenir: "La réponse innée (barrières, phagocytes, inflammation) est immédiate mais non spécifique : elle ralentit le pathogène sans l'éliminer. La réponse adaptative est lente (≈ 1 semaine) car il faut sélectionner et multiplier les lymphocytes B et T spécifiques de l'antigène ; elle élimine le pathogène et laisse des cellules mémoire.",
  piege: "Les antibiotiques n'agissent pas sur les virus. Et la fièvre n'est pas « la maladie » : c'est une réponse de défense. Modèle simplifié : charge en log10 (unités arbitraires).",
  build: function(k, S){
    var c1 = k.canvas(220), c2 = k.canvas(150), pal = S.draw.palette;
    var lp = k.slider("Dose de départ (log10)", 1, 6, 0.5, 3, "");
    var r = k.slider("Vitesse de multiplication du pathogène (log10 par jour)", 0.3, 1.2, 0.1, 0.8, "");
    var eps = k.slider("Efficacité de la défense innée", 0, 80, 10, 40, "%");
    var ad = k.toggle("Immunité adaptative fonctionnelle", true);
    var ro = k.readouts(["Pic de charge (log10)", "Début adaptative", "Élimination", "Jours symptomatiques"]);
    var nt = k.note("", "");
    k.draw(function(){
      var m = infection({lp0: lp.value, r: r.value, eps: eps.value / 100, ad: ad.value});
      var pk = 0, tp = 0, sym = 0, i;
      m.load.forEach(function(p){ if (p[1] > pk){ pk = p[1]; tp = p[0]; } if (p[1] >= 4) sym += 0.05; });
      c1.clear();
      var ax = S.draw.axes(c1, {x0: 0, x1: 40, y0: 0, y1: 9, xl: "jours", yl: "pathogènes (log10)", stepX: 5, stepY: 3});
      c1.ctx.fillStyle = "rgba(180,35,24,.08)"; c1.ctx.fillRect(ax.X(0), ax.Y(9), ax.X(40) - ax.X(0), ax.Y(4) - ax.Y(9));
      S.draw.text(c1, "symptômes (≥ 4)", ax.R - 6, ax.Y(8.2), {align: "right", size: 12, color: pal.red});
      if (ad.value){ S.draw.line(c1, ax.X(m.ta), ax.T, ax.X(m.ta), ax.B, pal.green, 1.6, [5, 4]); S.draw.text(c1, "adaptative", ax.X(m.ta) + 4, ax.B - 10, {align: "left", size: 12, color: pal.green}); }
      B5.poly(c1, ax, m.load, pal.red, 2.8);
      c2.clear();
      var ax2 = S.draw.axes(c2, {x0: 0, x1: 40, y0: 0, y1: 3, xl: "jours", yl: "anticorps (log10)", stepX: 5, stepY: 1});
      B5.poly(c2, ax2, m.ab, pal.violet, 2.8);
      var amax = Math.max.apply(null, m.ab.map(function(p){ return p[1]; }));
      ro.set(0, S.fmt(pk, 1)); ro.set(1, ad.value ? "jour " + S.fmt(m.ta, 0) : "jamais"); ro.set(2, m.cleared >= 0 ? "jour " + S.fmt(m.cleared, 0) : "pas éliminé");
      ro.set(3, S.fmt(sym, 0) + " j");
      var last = m.load[m.load.length - 1][1];
      if (!ad.value) nt.set("Sans immunité adaptative, la défense innée seule ne suffit pas : le pathogène atteint " + S.fmt(last, 1) + " (log10) à 40 jours et ne régresse pas. C'est l'immunodéficience (VIH : voir la dernière simulation du chapitre).", "warn");
      else if (pk >= 7) nt.set("Pic très élevé : l'infection est grave. Une dose forte ou une multiplication rapide laissent peu de temps à l'immunité adaptative.", "warn");
      else if (sym > 0) nt.set("Symptômes pendant " + S.fmt(sym, 0) + " jours : le pathogène dépasse le seuil avant que les anticorps (apparus le jour " + S.fmt(m.ta, 0) + ") ne le maîtrisent.", "warn");
      else nt.set("La défense innée suffit à tenir la charge sous le seuil de symptômes jusqu'à l'arrivée des anticorps.", "ok");
    });
  }
});

/* ---------- vaccin ou sérum ---------- */
function titre(t, dose2, mode, serumHL){       /* log10 du titre d'anticorps spécifique (0 = non détectable) */
  if (mode === "s"){ return t < 0 ? 0 : Math.max(0, 2.0 - t * Math.log10(2) / serumHL); }
  var L1 = 0.5, L2 = 1.3, v = 0;
  function dose(t0, peak, lag, rise, floor){
    var s = t - t0; if (s < 0) return 0;
    if (s < lag) return 0; if (s < lag + rise) return peak * (s - lag) / rise;
    return floor + (peak - floor) * Math.pow(2, -(s - lag - rise) / 25);
  }
  v = dose(0, 2.0, 5, 10, L1);
  if (t >= dose2) v = Math.max(dose(dose2, 3.5, 2, 5, L2), t < dose2 + 7 ? v : 0);
  return v;
}
SFA.sim({
  id: "b5-c05-vaccin", ch: "c05", tag: "Comparaison",
  titre: "Vaccin ou sérum : deux protections différentes",
  resume: "Dose de rappel, contact avec le pathogène → anticorps au fil des mois.",
  but: "Compare deux protections : le vaccin (antigène inoffensif qui fait fabriquer ses propres anticorps, 2e dose au jour choisi) et le sérum (anticorps tout faits injectés). Choisis le jour d'un contact avec le pathogène et vérifie si la personne est protégée.",
  aRetenir: "Vaccin : protection retardée (une dizaine de jours) mais durable, grâce aux cellules mémoire : le 2e contact déclenche une réponse secondaire plus rapide (2 jours) et plus forte. Sérum : protection immédiate mais brève (les anticorps injectés disparaissent en quelques semaines ou mois), sans mémoire. Le sérum soigne, le vaccin prévient.",
  piege: "Confondre vaccin et sérum est l'erreur classique. Autre piège : croire qu'un taux d'anticorps bas signifie « pas protégé » : les cellules mémoire peuvent produire une réponse secondaire rapide. Modèle qualitatif, valeurs indicatives.",
  build: function(k, S){
    var c = k.canvas(300), pal = S.draw.palette;
    var d2 = k.slider("2e dose de vaccin (jour)", 14, 180, 7, 28, "j");
    var te = k.slider("Contact avec le pathogène (jour)", 1, 365, 1, 100, "j");
    var hl = k.slider("Demi-vie des anticorps du sérum", 7, 28, 7, 21, "j");
    var ro = k.readouts(["Protection vaccin (titre ≥ 10)", "Protection sérum", "Au contact : vaccin", "Au contact : sérum"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 365, y0: 0, y1: 4, xl: "jours", yl: "titre (log10)", stepX: 60, stepY: 1});
      S.draw.line(c, ax.X(0), ax.Y(1), ax.X(365), ax.Y(1), pal.red, 1.5, [6, 4]); S.draw.text(c, "seuil de protection", ax.R - 6, ax.Y(1) - 9, {align: "right", size: 12, color: pal.red});
      var pv = [], ps = [], t, vacDays = 0, serDays = 0, vacStart = null;
      for (t = 0; t <= 365; t += 1){ var a = titre(t, d2.value, "v"), b = titre(t, d2.value, "s", hl.value); pv.push([t, a]); ps.push([t, b]); if (a >= 1){ vacDays++; if (vacStart === null) vacStart = t; } if (b >= 1) serDays++; }
      B5.poly(c, ax, ps, pal.amber, 2.6); B5.poly(c, ax, pv, pal.violet, 2.8);
      S.draw.text(c, "2e dose", ax.X(d2.value) + 4, ax.B - 10, {align: "left", size: 12, color: pal.violet});
      B5.leg(c, [["vaccin", pal.violet], ["sérum", pal.amber]], ax.L + 8, ax.T + 34);
      S.draw.line(c, ax.X(te.value), ax.T, ax.X(te.value), ax.B, pal.ink, 1.5, [5, 4]); S.draw.text(c, "contact", ax.X(te.value) + 4, ax.T + 10, {align: "left", size: 12});
      var tv = titre(te.value, d2.value, "v"), ts = titre(te.value, d2.value, "s", hl.value);
      var memV = te.value >= 5 ? (te.value >= d2.value ? 2 : 1) : 0;
      var rv = tv >= 1 ? "protégé (anticorps présents)" : (memV >= 1 && te.value > 15 ? "réponse secondaire rapide (mémoire)" : "non protégé"), rs = ts >= 1 ? "protégé (anticorps injectés)" : "non protégé";
      ro.set(0, vacStart === null ? "jamais" : "dès le jour " + vacStart + ", " + vacDays + " j sur 365"); ro.set(1, "dès le jour 0, " + serDays + " j sur 365"); ro.set(2, rv); ro.set(3, rs);
      nt.set("Au jour " + te.value + " : titre vaccin " + S.fmt(tv, 1) + " (log10), titre sérum " + S.fmt(ts, 1) + ". " + (ts >= 1 && tv < 1 ? "Le sérum protège seul à ce moment-là." : (tv >= 1 && ts < 1 ? "Seul le vaccin protège encore : le sérum s'est éliminé." : (tv >= 1 ? "Les deux protègent." : "Ni l'un ni l'autre n'atteint le seuil, sauf mémoire éventuelle du vaccin."))), "ok");
    });
  }
});

/* ---------- immunité collective (SIR) ---------- */
function sir(R0, cov, ve, days){
  var gam = 0.2, bet = R0 * gam, s0 = 1 - cov * ve, S = s0 - 1e-4, I = 1e-4, R = 0, dt = 0.1, out = [], Im = 0, tm = 0;
  for (var t = 0; t <= days + 1e-9; t += dt){
    out.push([t, S, I, R]);
    if (I > Im){ Im = I; tm = t; }
    var nI = bet * S * I * dt, nR = gam * I * dt;
    S -= nI; I += nI - nR; R += nR;
  }
  return {out: out, Im: Im, tm: tm, s0: s0, fin: 1 - cov * ve - S};
}
SFA.sim({
  id: "b5-c05-collective", ch: "c05", tag: "Épidémie",
  titre: "Immunité collective : combien faut-il vacciner ?",
  resume: "R₀, couverture vaccinale, efficacité → courbe épidémique et nombre de personnes touchées.",
  but: "Une population de 400 personnes (chaque point). Choisis la contagiosité (R₀), la proportion de vaccinés et l'efficacité du vaccin. Déplace le jour ou lance l'animation : qui est protégé, infecté, guéri ? Trouve la couverture qui empêche l'épidémie.",
  aRetenir: "Une épidémie ne démarre que si chaque cas en infecte plus d'un autre : R₀ × (part de personnes sensibles) > 1. Il suffit donc que la proportion de personnes immunisées dépasse 1 − 1/R₀ pour protéger aussi les non-vaccinés (immunité collective). Pour une maladie très contagieuse (R₀ = 12–18, comme la rougeole), il faut environ 92–95 % de la population immunisée.",
  piege: "L'immunité collective protège ceux qui ne peuvent pas être vaccinés seulement si la couverture est suffisante. Et elle dépend de R₀ : le seuil n'est pas le même pour toutes les maladies. Modèle SIR simplifié (période infectieuse 5 jours, population homogène).",
  build: function(k, S){
    var c = k.canvas(190), g = k.canvas(250), pal = S.draw.palette;
    var R0 = k.slider("R₀ (nombre moyen de personnes infectées par un cas)", 1, 18, 0.5, 3, "");
    var cov = k.slider("Couverture vaccinale", 0, 100, 1, 40, "%");
    var ve = k.slider("Efficacité du vaccin", 50, 100, 5, 95, "%");
    var day = k.slider("Jour", 0, 200, 1, 40, "j");
    var ro = k.readouts(["Seuil d'immunité collective", "Part immunisée", "Pic d'infectés", "Total infectés"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ day.set(Math.min(200, day.value + dt * 25)); if (day.value >= 200) lp.pause(); k.redraw(); });
    k.button("Lecture / pause", function(){ if (lp.running) lp.pause(); else { if (day.value >= 200) day.set(0); lp.play(); } }, true);
    var order = null;
    k.draw(function(){
      var m = sir(R0.value, cov.value / 100, ve.value / 100, 200), pc = (1 - 1 / R0.value) / (ve.value / 100);
      var imm = cov.value / 100 * ve.value / 100;
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 200, y0: 0, y1: Math.max(10, Math.min(100, Math.ceil(m.Im * 100 / 10) * 10 + 10)), xl: "jours", yl: "% infectés", stepX: 40});
      B5.poly(c, ax, m.out.filter(function(p, i){ return i % 5 === 0; }).map(function(p){ return [p[0], p[2] * 100]; }), pal.red, 2.8);
      S.draw.line(c, ax.X(day.value), ax.T, ax.X(day.value), ax.B, pal.ink, 1.4, [5, 4]);
      /* grille des 400 personnes */
      g.clear();
      var N = 400, cols = 40, rows = 10, cw = (g.W - 20) / cols, ch = 14, idx = Math.min(m.out.length - 1, Math.round(day.value * 10)), row = m.out[idx];
      if (!order){ var rnd = B5.rng(7), a = []; for (var i = 0; i < N; i++) a.push(i); for (i = N - 1; i > 0; i--){ var j = Math.floor(rnd() * (i + 1)), tmp = a[i]; a[i] = a[j]; a[j] = tmp; } order = a; }
      var nImm = Math.round(imm * N), nI = Math.round(row[2] * N), nR = Math.round(row[3] * N + 0), pos = {}, q;
      for (q = 0; q < N; q++){
        var who = order[q], color;
        if (q < nImm) color = pal.green; else { var r2 = q - nImm; color = r2 < nR ? "#2f6fd6" : (r2 < nR + nI ? pal.red : "#c8ceda"); }
        var X = 10 + (who % cols) * cw + cw / 2, Y = 12 + Math.floor(who / cols) * (ch + 7);
        B5.circ(g, X, Y, Math.min(cw, ch) / 2 - 1, color);
      }
      B5.leg(g, [["immunisés (vaccin)", pal.green], ["sensibles", "#c8ceda"], ["infectés", pal.red], ["guéris", "#2f6fd6"]], 10, 236);
      ro.set(0, R0.value <= 1 ? "pas d'épidémie (R₀ ≤ 1)" : S.fmt(100 * (1 - 1 / R0.value), 0) + " % immunisés"); ro.set(1, S.fmt(imm * 100, 0) + " %"); ro.set(2, S.fmt(m.Im * 100, 1) + " %"); ro.set(3, S.fmt(m.fin * 100, 1) + " %");
      var eff = R0.value * (1 - imm);
      if (eff <= 1) nt.set("R effectif = R₀ × (1 − part immunisée) = " + S.fmt(eff, 2) + " ≤ 1 : chaque cas infecte moins d'une personne, l'épidémie ne décolle pas : immunité collective atteinte.", "ok");
      else nt.set("R effectif = " + S.fmt(eff, 2) + " > 1 : l'épidémie démarre. Il faudrait " + S.fmt(100 * pc, 0) + " % de vaccinés (avec cette efficacité) pour la bloquer" + (pc > 1 ? " : impossible avec ce vaccin seul." : "."), "warn");
    });
  }
});

/* ---------- VIH ---------- */
SFA.sim({
  id: "b5-c05-vih", ch: "c05", tag: "Santé",
  titre: "VIH : les lymphocytes CD4 et le traitement",
  resume: "Charge virale de base et début du traitement → évolution des CD4.",
  but: "Le VIH détruit progressivement les lymphocytes T CD4, coordinateurs de la réponse immunitaire. Choisis la charge virale de base et, éventuellement, l'année de début d'un traitement antirétroviral. Cherche l'année où les CD4 passent sous 200/µL (stade SIDA) et l'effet d'un traitement précoce.",
  aRetenir: "Le VIH infecte les lymphocytes T CD4 : leur nombre baisse lentement (en moyenne, sur des années) puis l'organisme n'est plus protégé : infections opportunistes (SIDA). Un traitement antirétroviral bloque la multiplication du virus : la charge virale devient indétectable, les CD4 remontent, et la personne ne transmet plus le virus.",
  piege: "Être séropositif n'est pas être au stade SIDA : c'est pendant des années sans symptômes. Et il n'existe pas de vaccin ni de guérison pour le VIH : le traitement est à vie. Valeurs moyennes d'un modèle simplifié ; l'évolution individuelle varie beaucoup.",
  build: function(k, S){
    var c1 = k.canvas(200), c2 = k.canvas(140), pal = S.draw.palette;
    var vl = k.slider("Charge virale de base (log10 copies/mL)", 3, 5.5, 0.5, 4.5, "");
    var art = k.toggle("Traitement antirétroviral", true);
    var ts = k.slider("Début du traitement (année)", 1, 15, 1, 6, "");
    var yr = k.slider("Année observée", 0, 20, 1, 8, "");
    var ro = k.readouts(["CD4 à l'année observée", "Charge virale", "Stade", "Année du stade SIDA sans traitement"]);
    var nt = k.note("", "");
    function cd4(t){
      var rate = 40 * (vl.value - 2), base = Math.max(0, 1000 - rate * t);
      if (!art.value || t <= ts.value) return base;
      var c0 = Math.max(0, 1000 - rate * ts.value);
      return c0 < 900 ? 900 + (c0 - 900) * Math.exp(-0.2 * (t - ts.value)) : c0;
    }
    function vload(t){ if (!art.value || t <= ts.value) return vl.value; return 1.7 + (vl.value - 1.7) * Math.exp(-(t - ts.value) / 0.2); }
    k.draw(function(){
      var a = [], b = [], t;
      for (t = 0; t <= 20; t += 0.25){ a.push([t, cd4(t)]); b.push([t, vload(t)]); }
      c1.clear();
      var ax = S.draw.axes(c1, {x0: 0, x1: 20, y0: 0, y1: 1200, xl: "années", yl: "CD4 (/µL)", stepX: 4, stepY: 200});
      c1.ctx.fillStyle = "rgba(180,35,24,.10)"; c1.ctx.fillRect(ax.X(0), ax.Y(200), ax.X(20) - ax.X(0), ax.Y(0) - ax.Y(200));
      S.draw.text(c1, "SIDA (< 200)", ax.R - 6, ax.Y(100), {align: "right", size: 12, color: pal.red});
      B5.poly(c1, ax, a, pal.violet, 2.8);
      if (art.value) S.draw.line(c1, ax.X(ts.value), ax.T, ax.X(ts.value), ax.B, pal.green, 1.5, [5, 4]);
      S.draw.line(c1, ax.X(yr.value), ax.T, ax.X(yr.value), ax.B, pal.ink, 1.4, [5, 4]);
      c2.clear();
      var ax2 = S.draw.axes(c2, {x0: 0, x1: 20, y0: 1, y1: 6, xl: "années", yl: "charge virale (log10)", stepX: 4, stepY: 1});
      B5.poly(c2, ax2, b, pal.red, 2.6);
      S.draw.line(c2, ax2.X(0), ax2.Y(1.7), ax2.X(20), ax2.Y(1.7), pal.green, 1.3, [5, 4]); S.draw.text(c2, "indétectable (< 50)", ax2.R - 6, ax2.Y(1.7) - 8, {align: "right", size: 12, color: pal.green});
      var C = cd4(yr.value), V = vload(yr.value);
      var tsida = 20 / (vl.value - 2);
      var stade = C < 200 ? "SIDA (< 200)" : C < 500 ? "immunodéficience modérée" : "CD4 ≥ 500";
      ro.set(0, S.fmt(C, 0) + " /µL"); ro.set(1, V <= 1.7 + 1e-6 || V < 1.75 ? "indétectable" : "10<sup>" + S.fmt(V, 1) + "</sup>"); ro.set(2, stade); ro.set(3, tsida <= 20 ? S.fmt(tsida, 1) + " ans" : "> 20 ans");
      if (art.value && cd4(0) > 0 && Math.min.apply(null, a.map(function(p){ return p[1]; })) >= 200) nt.set("Avec un traitement commencé l'année " + ts.value + ", les CD4 ne passent jamais sous 200 /µL et la personne vit avec un système immunitaire fonctionnel.", "ok");
      else if (art.value) nt.set("Les CD4 sont passés sous 200 /µL avant le début du traitement (année " + ts.value + ") : infections opportunistes possibles. Le traitement les fait remonter, mais lentement.", "warn");
      else nt.set("Sans traitement : CD4 sous 200 /µL à partir de l'année " + S.fmt(tsida, 1) + " (en moyenne, dans ce modèle). Plus la charge virale de base est élevée, plus c'est rapide.", "warn");
    });
  }
});
})();
