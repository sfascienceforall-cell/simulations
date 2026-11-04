/* Chapitre 7 · Oxydoréduction : transferts d'électrons */
(function(){
function wrap(c, S, txt, x, y, maxW, opt){
  var ctx = c.ctx, size = opt.size || 13, words = String(txt).split(" "), line = "", lines = [], i;
  ctx.save(); ctx.font = (opt.weight || 700) + " " + size + "px " + (opt.math ? "'STIX Two Text', serif" : "Mulish, system-ui, sans-serif");
  for (i = 0; i < words.length; i++){ var t = line ? line + " " + words[i] : words[i]; if (ctx.measureText(t).width > maxW && line){ lines.push(line); line = words[i]; } else line = t; }
  lines.push(line); ctx.restore();
  lines.forEach(function(l, j){ S.draw.text(c, l, x, y + j * (size + 4), opt); });
  return lines.length;
}
/* métaux : E° du couple M^n+/M (V), masse molaire arrondie (g/mol) */
var MET = [
  {s: "Mg", E: -2.37, n: 2, M: 24, ion: "Mg²⁺", col: [160, 165, 170], ic: null},
  {s: "Al", E: -1.66, n: 3, M: 27, ion: "Al³⁺", col: [175, 180, 185], ic: null},
  {s: "Zn", E: -0.76, n: 2, M: 65, ion: "Zn²⁺", col: [150, 160, 170], ic: null},
  {s: "Fe", E: -0.44, n: 2, M: 56, ion: "Fe²⁺", col: [110, 115, 120], ic: [170, 205, 150]},
  {s: "Pb", E: -0.13, n: 2, M: 207, ion: "Pb²⁺", col: [95, 100, 110], ic: null},
  {s: "Cu", E: 0.34, n: 2, M: 63.5, ion: "Cu²⁺", col: [196, 106, 60], ic: [90, 150, 230]},
  {s: "Ag", E: 0.80, n: 1, M: 108, ion: "Ag⁺", col: [215, 220, 226], ic: null}
];
function gcd(a, b){ return b ? gcd(b, a % b) : a; }
function mixc(c1, c2, t){ return "rgb(" + [0, 1, 2].map(function(i){ return Math.round(c1[i] + (c2[i] - c1[i]) * t); }).join(",") + ")"; }
SFA.sim({
  id: "c6-c07-plaque", ch: "c07", tag: "Classique",
  titre: "Une plaque de métal dans une solution de cations",
  resume: "Plonge un métal dans une solution d'ions : y a-t-il dépôt ? Prévois-le avec les potentiels standards.",
  but: "Choisis le métal de la plaque et le cation en solution. Fais avancer la réaction (50 mL de solution à 0,100 mol/L) et observe la couleur, le dépôt et la variation de masse de la plaque.",
  aRetenir: "La plaque (réducteur M₁) réagit avec le cation (oxydant M₂ⁿ⁺) si E°(M₂ⁿ⁺/M₂) > E°(M₁ⁿ⁺/M₁) : M₁ cède des électrons, M₂ se dépose. Exemples : Zn + Cu²⁺ → Zn²⁺ + Cu ; Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag. Les charges et les atomes doivent être équilibrés : le nombre d'électrons cédés égale le nombre d'électrons captés.",
  piege: "La plaque ne perd pas d'électrons « en plus » : le métal le moins noble (E° le plus bas) s'oxyde. Un métal plus noble ne réagit pas avec le cation d'un métal moins noble (Cu dans Zn²⁺ : rien). Attention : l'aluminium, protégé par sa couche d'oxyde, réagit en pratique très lentement malgré son E° très bas.",
  build: function(k, S){
    var c = k.canvas(300), P = S.draw.palette;
    var pl = k.select("Plaque (réducteur)", MET.map(function(m, i){ return [i, m.s]; }), 2);
    var ca = k.select("Solution de cations (oxydant)", MET.map(function(m, i){ return [i, m.ion]; }), 5);
    var av = k.slider("Avancement (part du cation consommée)", 0, 100, 5, 0, "%");
    var ro = k.readouts(["Réaction ?", "E°(ox) − E°(red)", "Δm de la plaque", "Dépôt"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var A = MET[pl.value], B = MET[ca.value], ok = B.E > A.E && A !== B, f = ok ? av.value / 100 : 0, ctx = c.ctx;
      var n1 = A.n, n2 = B.n, L = n1 * n2 / gcd(n1, n2), a = L / n1, b = L / n2;
      var nc = f * 5.0;                       /* mmol de cation consommé (50 mL × 0,100 mol/L) */
      var dm = nc * B.M - nc * (n2 / n1) * A.M; /* mg : dépôt − dissolution */
      var bx = 30, bw = Math.min(c.W - 60, 360), by = 40, bh = 220;
      var colLiq = B.ic ? mixc(B.ic, A.ic || [235, 240, 245], f) : mixc([235, 240, 245], A.ic || [235, 240, 245], f);
      ctx.fillStyle = colLiq; ctx.globalAlpha = .65; ctx.fillRect(bx, by + 30, bw, bh - 30); ctx.globalAlpha = 1; ctx.strokeStyle = P.ink; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
      var px = bx + bw / 2 - 20, py = by + 6, pw = 40, ph = bh - 14;
      ctx.fillStyle = "rgb(" + A.col.join(",") + ")"; ctx.fillRect(px, py, pw, ph);
      if (f > 0){ ctx.globalAlpha = Math.min(1, f * 1.2); ctx.fillStyle = "rgb(" + B.col.join(",") + ")"; ctx.fillRect(px - 5, py + 40, 5, ph - 60); ctx.fillRect(px + pw, py + 40, 5, ph - 60); ctx.globalAlpha = 1; }
      ctx.strokeStyle = P.ink; ctx.lineWidth = 1.5; ctx.strokeRect(px, py, pw, ph);
      S.draw.text(c, "plaque de " + A.s, px + pw / 2, by + bh + 16, {size: 12, color: P.grey});
      S.draw.text(c, "solution de " + B.ion, bx + 70, by + 60, {size: 13, color: P.ink});
      if (ok){ S.draw.text(c, "E° = " + S.fmt(B.E, 2) + " V", bx + bw - 60, by + 60, {size: 12, color: P.green}); }
      ro.set(0, A === B ? "non (même métal)" : ok ? "oui" : "non"); ro.set(1, S.fmt(B.E - A.E, 2) + " V");
      ro.set(2, ok ? (dm >= 0 ? "+" : "") + S.fmt(dm, 0) + " mg" : "0"); ro.set(3, ok ? S.fmt(nc, 2) + " mmol de " + B.s : "aucun");
      if (A === B) nt.set("Même couple : aucune réaction.", "ok");
      else if (!ok) nt.set(A.s + " est plus noble que " + B.s + " (E° " + S.fmt(A.E, 2) + " V > " + S.fmt(B.E, 2) + " V) : le cation " + B.ion + " n'est pas réduit par " + A.s + ". Aucun dépôt.", "warn");
      else nt.set((a > 1 ? a + " " : "") + A.s + " + " + (b > 1 ? b + " " : "") + B.ion + " → " + (a > 1 ? a + " " : "") + A.ion + " + " + (b > 1 ? b + " " : "") + B.s + "  (" + L + " électron" + (L > 1 ? "s" : "") + " échangé" + (L > 1 ? "s" : "") + ")" + (A.s === "Al" ? ". Dans la réalité, la couche d'oxyde ralentit fortement la réaction." : "."), "ok");
    });
  }
});

/* ---------- équilibreur de demi-équations ---------- */
var CP = [
  {nom: "MnO₄⁻ / Mn²⁺", ox: "MnO₄⁻", rd: "Mn²⁺", a: 1, h: 8, n: 5, b: 1, w: 4, E: 1.51, at: {ox: {Mn: 1, O: 4}, rd: {Mn: 1}, q: [-1, 2]}},
  {nom: "Cr₂O₇²⁻ / Cr³⁺", ox: "Cr₂O₇²⁻", rd: "Cr³⁺", a: 1, h: 14, n: 6, b: 2, w: 7, E: 1.33, at: {ox: {Cr: 2, O: 7}, rd: {Cr: 1}, q: [-2, 3]}},
  {nom: "H₂O₂ / H₂O", ox: "H₂O₂", rd: "H₂O", a: 1, h: 2, n: 2, b: 2, w: 0, E: 1.78, at: {ox: {H: 2, O: 2}, rd: {H: 2, O: 1}, q: [0, 0]}},
  {nom: "O₂ / H₂O", ox: "O₂", rd: "H₂O", a: 1, h: 4, n: 4, b: 2, w: 0, E: 1.23, at: {ox: {O: 2}, rd: {H: 2, O: 1}, q: [0, 0]}},
  {nom: "Cl₂ / Cl⁻", ox: "Cl₂", rd: "Cl⁻", a: 1, h: 0, n: 2, b: 2, w: 0, E: 1.36, at: {ox: {Cl: 2}, rd: {Cl: 1}, q: [0, -1]}},
  {nom: "Ag⁺ / Ag", ox: "Ag⁺", rd: "Ag", a: 1, h: 0, n: 1, b: 1, w: 0, E: 0.80, at: {ox: {Ag: 1}, rd: {Ag: 1}, q: [1, 0]}},
  {nom: "Fe³⁺ / Fe²⁺", ox: "Fe³⁺", rd: "Fe²⁺", a: 1, h: 0, n: 1, b: 1, w: 0, E: 0.77, at: {ox: {Fe: 1}, rd: {Fe: 1}, q: [3, 2]}},
  {nom: "I₂ / I⁻", ox: "I₂", rd: "I⁻", a: 1, h: 0, n: 2, b: 2, w: 0, E: 0.54, at: {ox: {I: 2}, rd: {I: 1}, q: [0, -1]}},
  {nom: "Cu²⁺ / Cu", ox: "Cu²⁺", rd: "Cu", a: 1, h: 0, n: 2, b: 1, w: 0, E: 0.34, at: {ox: {Cu: 1}, rd: {Cu: 1}, q: [2, 0]}},
  {nom: "Sn⁴⁺ / Sn²⁺", ox: "Sn⁴⁺", rd: "Sn²⁺", a: 1, h: 0, n: 2, b: 1, w: 0, E: 0.15, at: {ox: {Sn: 1}, rd: {Sn: 1}, q: [4, 2]}},
  {nom: "S₄O₆²⁻ / S₂O₃²⁻", ox: "S₄O₆²⁻", rd: "S₂O₃²⁻", a: 1, h: 0, n: 2, b: 2, w: 0, E: 0.08, at: {ox: {S: 4, O: 6}, rd: {S: 2, O: 3}, q: [-2, -2]}},
  {nom: "Fe²⁺ / Fe", ox: "Fe²⁺", rd: "Fe", a: 1, h: 0, n: 2, b: 1, w: 0, E: -0.44, at: {ox: {Fe: 1}, rd: {Fe: 1}, q: [2, 0]}},
  {nom: "Zn²⁺ / Zn", ox: "Zn²⁺", rd: "Zn", a: 1, h: 0, n: 2, b: 1, w: 0, E: -0.76, at: {ox: {Zn: 1}, rd: {Zn: 1}, q: [2, 0]}}
];
function term(co, sp){ return (co === 1 ? "" : co + " ") + sp; }
function side(items){ return items.filter(function(x){ return x[0] > 0; }).map(function(x){ return term(x[0], x[1]); }).join(" + "); }
/* équation globale pour deux couples (hi réduit, lo oxydé) et facteurs f1, f2 */
function globale(hi, lo, f1, f2){
  function add(map, sp, k){ map[sp] = (map[sp] || 0) + k; }
  var left = {}, right = {};
  add(left, hi.ox, hi.a * f1); add(left, "H⁺", hi.h * f1); add(right, hi.rd, hi.b * f1); add(right, "H₂O", hi.w * f1);
  add(left, lo.rd, lo.b * f2); add(left, "H₂O", lo.w * f2); add(right, lo.ox, lo.a * f2); add(right, "H⁺", lo.h * f2);
  ["H⁺", "H₂O"].forEach(function(sp){
    var l = left[sp] || 0, r = right[sp] || 0, d = Math.min(l, r); left[sp] = l - d; right[sp] = r - d;
  });
  /* espèces identiques des deux côtés (cas H₂O/H₂O non concerné ici) */
  Object.keys(left).forEach(function(sp){ if (right[sp] !== undefined && sp !== "H⁺" && sp !== "H₂O"){ var d = Math.min(left[sp], right[sp]); left[sp] -= d; right[sp] -= d; } });
  function fmtSide(m){ return Object.keys(m).filter(function(sp){ return m[sp] > 0; }).map(function(sp){ return term(m[sp], sp); }).join(" + "); }
  return fmtSide(left) + " → " + fmtSide(right);
}
SFA.sim({
  id: "c6-c07-demi-equations", ch: "c07", tag: "Défi",
  titre: "Équilibrer une équation d'oxydoréduction",
  resume: "Choisis deux couples : multiplie les demi-équations pour égaliser les électrons, puis lis l'équation globale.",
  but: "Choisis les deux couples. Règle les facteurs f₁ et f₂ pour que les électrons captés égalent les électrons cédés. Coche « solution » pour vérifier.",
  aRetenir: "On écrit chaque demi-équation (a Ox + h H⁺ + n e⁻ ⇌ b Red + w H₂O en milieu acide), on multiplie pour avoir le même nombre d'électrons, on additionne, puis on simplifie H⁺ et H₂O. Toujours vérifier : atomes ET charges. Le couple dont E° est le plus élevé fournit l'oxydant qui réagit.",
  piege: "Équilibrer seulement les atomes ne suffit pas : si les charges totales ne sont pas égales des deux côtés, l'équation est fausse. Ne pas oublier non plus les H⁺ et H₂O en milieu acide. Enfin, une réaction prévue par les potentiels standards est possible, mais pas forcément rapide.",
  _data: CP, _fn: function(h, l, f1, f2){ return globale(h, l, f1, f2); },
  build: function(k, S){
    var c = k.canvas(300), P = S.draw.palette;
    var A = k.select("Couple 1", CP.map(function(p, i){ return [i, p.nom + " (" + S.fmt(p.E, 2) + " V)"]; }), 0);
    var B = k.select("Couple 2", CP.map(function(p, i){ return [i, p.nom + " (" + S.fmt(p.E, 2) + " V)"]; }), 6);
    var f1 = k.slider("Facteur f₁ (couple qui capte)", 1, 12, 1, 1, "");
    var f2 = k.slider("Facteur f₂ (couple qui cède)", 1, 12, 1, 1, "");
    var sol = k.toggle("Afficher l'équation globale", false);
    var ro = k.readouts(["Oxydant qui réagit", "ΔE°", "Électrons captés / cédés"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var a = CP[A.value], b = CP[B.value];
      if (a === b){ S.draw.text(c, "Choisis deux couples différents.", c.W / 2, c.H / 2, {size: 15, color: P.red}); nt.set("Il faut deux couples différents pour une réaction.", "warn"); ro.set(0, "—"); ro.set(1, "—"); ro.set(2, "—"); return; }
      var hi = a.E > b.E ? a : b, lo = a.E > b.E ? b : a;
      var cap = hi.n * f1.value, ced = lo.n * f2.value, ok = cap === ced;
      var y = 40, dy = 34;
      function demi(cp, f, red){
        var l = red ? [[f * cp.a, cp.ox], [f * cp.h, "H⁺"], [f * cp.n, "e⁻"]] : [[f * cp.b, cp.rd], [f * cp.w, "H₂O"]];
        var r = red ? [[f * cp.b, cp.rd], [f * cp.w, "H₂O"]] : [[f * cp.a, cp.ox], [f * cp.h, "H⁺"], [f * cp.n, "e⁻"]];
        return side(l) + " → " + side(r);
      }
      var yy = 26, n1 = wrap(c, S, "× " + f1.value + " :  " + demi(hi, f1.value, true), 14, yy, c.W - 28, {size: 14, math: true, align: "left", color: P.acc});
      yy += n1 * 18 + 12; var n2 = wrap(c, S, "× " + f2.value + " :  " + demi(lo, f2.value, false), 14, yy, c.W - 28, {size: 14, math: true, align: "left", color: P.amber});
      yy += n2 * 18 + 12; S.draw.text(c, "électrons captés : " + cap + "   cédés : " + ced, 14, yy, {size: 14, align: "left", color: ok ? P.green : P.red});
      yy += 30;
      if (ok){ S.draw.line(c, 14, yy - 12, c.W - 14, yy - 12, P.light, 1.2); if (sol.value) wrap(c, S, globale(hi, lo, f1.value, f2.value), 14, yy + 6, c.W - 28, {size: 14, math: true, align: "left", color: P.ink}); else S.draw.text(c, "(équation globale masquée)", 14, yy + 6, {size: 13, align: "left", color: P.grey}); }
      else wrap(c, S, "Égalise les électrons pour obtenir la somme des demi-équations.", 14, yy, c.W - 28, {size: 13, align: "left", color: P.grey});
      ro.set(0, hi.ox); ro.set(1, S.fmt(hi.E - lo.E, 2) + " V"); ro.set(2, cap + " / " + ced);
      var L = hi.n * lo.n / gcd(hi.n, lo.n);
      nt.set(ok ? ((f1.value === L / hi.n && f2.value === L / lo.n) ? "Facteurs minimaux (" + L + " électrons échangés)." : "Électrons égaux, mais les facteurs ne sont pas minimaux (le plus petit commun multiple est " + L + ").") : "Pas encore : il faut " + hi.n + " × f₁ = " + lo.n + " × f₂.", ok ? "ok" : "warn");
    });
  }
});

/* ---------- nombres d'oxydation ---------- */
var ESP = [
  {f: "MnO₄⁻", q: -1, at: [["Mn", 1, null], ["O", 4, -2]], rep: 7},
  {f: "Cr₂O₇²⁻", q: -2, at: [["Cr", 2, null], ["O", 7, -2]], rep: 6},
  {f: "H₂SO₄", q: 0, at: [["H", 2, 1], ["S", 1, null], ["O", 4, -2]], rep: 6},
  {f: "ClO₄⁻", q: -1, at: [["Cl", 1, null], ["O", 4, -2]], rep: 7},
  {f: "HNO₃", q: 0, at: [["H", 1, 1], ["N", 1, null], ["O", 3, -2]], rep: 5},
  {f: "NH₃", q: 0, at: [["N", 1, null], ["H", 3, 1]], rep: -3},
  {f: "CO₂", q: 0, at: [["C", 1, null], ["O", 2, -2]], rep: 4},
  {f: "CH₄", q: 0, at: [["C", 1, null], ["H", 4, 1]], rep: -4},
  {f: "Fe₂O₃", q: 0, at: [["Fe", 2, null], ["O", 3, -2]], rep: 3},
  {f: "H₂O₂", q: 0, at: [["H", 2, 1], ["O", 2, null]], rep: -1},
  {f: "NaH", q: 0, at: [["Na", 1, 1], ["H", 1, null]], rep: -1},
  {f: "S₄O₆²⁻", q: -2, at: [["S", 4, null], ["O", 6, -2]], rep: 2.5, moy: true},
  {f: "CH₃CH₂OH (éthanol)", q: 0, at: [["C", 2, null], ["H", 6, 1], ["O", 1, -2]], rep: -2, moy: true},
  {f: "CH₃CHO (éthanal)", q: 0, at: [["C", 2, null], ["H", 4, 1], ["O", 1, -2]], rep: -1, moy: true},
  {f: "CH₃COOH (acide éthanoïque)", q: 0, at: [["C", 2, null], ["H", 4, 1], ["O", 2, -2]], rep: 0, moy: true},
  {f: "Cl₂", q: 0, at: [["Cl", 2, null]], rep: 0}
];
SFA.sim({
  id: "c6-c07-nombre-oxydation", ch: "c07", tag: "Défi",
  titre: "Trouve le nombre d'oxydation",
  resume: "Règle le n.o. de l'atome inconnu jusqu'à ce que la somme des n.o. égale la charge de l'espèce.",
  but: "Choisis une espèce, puis règle le n.o. de l'atome marqué « ? » avec le curseur. Quand la somme est égale à la charge, c'est bon. Essaie les carbones de l'éthanol, de l'éthanal et de l'acide éthanoïque.",
  aRetenir: "Règles : somme des n.o. = charge de l'espèce ; O = −2 (sauf peroxydes : −1) ; H = +1 (sauf hydrures : −1) ; corps simple : 0. Une oxydation fait augmenter le n.o., une réduction le fait diminuer. Pour la série éthanol → éthanal → acide éthanoïque, le n.o. moyen du carbone passe de −2 à −1 puis à 0 : trois oxydations successives.",
  piege: "Le n.o. n'est pas la charge réelle : dans CO₂, le carbone n'a pas une charge de +4. Un n.o. moyen peut être fractionnaire (S₄O₆²⁻ : +2,5) ; il décrit alors une moyenne sur les atomes équivalents.",
  build: function(k, S){
    var c = k.canvas(250), P = S.draw.palette;
    var es = k.select("Espèce", ESP.map(function(e, i){ return [i, e.f]; }), 0);
    var g = k.slider("n.o. de l'atome « ? »", -4, 8, 0.5, 0, "");
    var ro = k.readouts(["Σ des n.o.", "Charge de l'espèce", "Verdict"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var e = ESP[es.value], i, tot = 0, w = Math.min(100, (c.W - 40) / e.at.length), x0 = (c.W - w * e.at.length) / 2;
      for (i = 0; i < e.at.length; i++){
        var a = e.at[i], no = a[2] === null ? g.value : a[2], x = x0 + i * w + w / 2, unk = a[2] === null;
        tot += a[1] * no;
        c.ctx.fillStyle = unk ? "rgba(244,197,66,.45)" : "rgba(46,107,85,.15)"; c.ctx.beginPath(); c.ctx.arc(x, 90, 34, 0, 7); c.ctx.fill();
        S.draw.text(c, a[0], x, 82, {size: 18, color: P.ink});
        S.draw.text(c, (no > 0 ? "+" : "") + S.fmt(no, 1), x, 104, {size: 14, color: unk ? P.red : P.green});
        S.draw.text(c, "× " + a[1], x, 140, {size: 13, color: P.grey});
        S.draw.text(c, S.fmt(a[1] * no, 1), x, 160, {size: 14, color: P.ink});
      }
      S.draw.text(c, e.f, c.W / 2, 24, {size: 17, math: true});
      var ok = Math.abs(tot - e.q) < 1e-9;
      S.draw.text(c, "Σ = " + S.fmt(tot, 1) + "    charge = " + S.fmt(e.q, 0), c.W / 2, 200, {size: 15, color: ok ? P.green : P.red});
      ro.set(0, S.fmt(tot, 1)); ro.set(1, S.fmt(e.q, 0)); ro.set(2, ok ? "juste" : (tot < e.q ? "trop bas" : "trop haut"));
      nt.set(ok ? "Juste : le n.o. de « ? » vaut " + (e.rep > 0 ? "+" : "") + S.fmt(e.rep, 1) + (e.moy ? " (n.o. moyen)." : ".") : "Ajuste le curseur : la somme doit valoir " + S.fmt(e.q, 0) + ".", ok ? "ok" : "warn");
    });
  }
});

/* ---------- rouille ---------- */
SFA.sim({
  id: "c6-c07-rouille", ch: "c07", tag: "Original",
  titre: "La rouille d'un clou : eau, air, sel, contact",
  resume: "Quelles conditions font rouiller le fer ? Compare un clou seul, dans l'eau salée, au contact du cuivre ou du zinc.",
  but: "Active ou non l'eau, l'oxygène, le sel, puis choisis un métal au contact. Fais passer les jours et suis la quantité de rouille (indice qualitatif).",
  aRetenir: "Il faut du fer, de l'eau et du dioxygène : à l'anode, Fe → Fe²⁺ + 2 e⁻ ; à la cathode, O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻. Le sel rend la solution plus conductrice et accélère la corrosion. Au contact d'un métal moins noble (zinc), c'est ce métal qui s'oxyde à la place du fer, qui est protégé ; au contact d'un métal plus noble (cuivre), le fer est sacrifié et rouille plus vite.",
  piege: "Modèle qualitatif : l'indice de corrosion n'est pas une mesure, seulement un classement relatif (0 à 10). L'eau seule sans dioxygène (eau bouillie sous huile) ne fait pas rouiller le fer, et l'air sec non plus.",
  build: function(k, S){
    var c = k.canvas(290), P = S.draw.palette;
    var tw = k.toggle("Eau liquide", true), to = k.toggle("Dioxygène (air dissous)", true), ts = k.toggle("Sel (NaCl)", false);
    var ct = k.seg("Métal au contact du clou", [["0", "Aucun"], ["cu", "Cuivre"], ["zn", "Zinc"], ["mg", "Magnésium"]], "0");
    var jr = k.slider("Durée", 0, 60, 1, 20, "jours");
    var ro = k.readouts(["Indice de corrosion (0–10)", "Quantité de rouille", "Qui s'oxyde ?"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var idx = 0, ctx = c.ctx, ox = "le fer (Fe → Fe²⁺)";
      if (tw.value && to.value){
        idx = 2 + (ts.value ? 4 : 0);
        if (ct.value === "cu") idx = Math.min(10, idx * 1.6);
        if (ct.value === "zn" || ct.value === "mg"){ idx = 0.1; ox = ct.value === "zn" ? "le zinc (Zn → Zn²⁺) : le fer est protégé" : "le magnésium (Mg → Mg²⁺) : le fer est protégé"; }
      } else ox = "rien : il manque eau ou dioxygène";
      var rust = (tw.value && to.value) ? 1 - Math.exp(-idx * jr.value / 30) : 0;
      /* clou */
      var cx = c.W * 0.42, cy = 40, ch = 190;
      ctx.fillStyle = "#c9ced4"; ctx.fillRect(cx - 12, cy, 24, ch); ctx.beginPath(); ctx.moveTo(cx - 12, cy + ch); ctx.lineTo(cx, cy + ch + 28); ctx.lineTo(cx + 12, cy + ch); ctx.fill();
      ctx.fillStyle = "rgba(160,70,20," + Math.min(0.95, rust * 1.1).toFixed(2) + ")"; ctx.fillRect(cx - 12, cy, 24, ch); ctx.beginPath(); ctx.moveTo(cx - 12, cy + ch); ctx.lineTo(cx, cy + ch + 28); ctx.lineTo(cx + 12, cy + ch); ctx.fill();
      ctx.fillStyle = "#b9c0c8"; ctx.fillRect(cx - 24, cy - 8, 48, 10);
      if (tw.value){ ctx.fillStyle = "rgba(90,160,220,.25)"; ctx.fillRect(cx - 120, cy + 70, 240, ch + 10); ctx.strokeStyle = P.grey; ctx.lineWidth = 1.5; ctx.strokeRect(cx - 120, cy + 70, 240, ch + 10); }
      if (ct.value !== "0"){ var mc = {cu: "#c46a3c", zn: "#9aa5b1", mg: "#c7ccd2"}[ct.value]; ctx.fillStyle = mc; ctx.fillRect(cx + 40, cy + 100, 24, 110); S.draw.line(c, cx + 52, cy + 100, cx + 52, cy + 30, P.ink, 1.6); S.draw.line(c, cx + 52, cy + 30, cx, cy + 30, P.ink, 1.6); S.draw.text(c, {cu: "Cu", zn: "Zn", mg: "Mg"}[ct.value], cx + 52, cy + 222, {size: 13}); S.draw.text(c, "fil", cx + 28, cy + 20, {size: 12, color: P.grey}); }
      S.draw.text(c, "clou en fer", cx - 70, cy + 20, {size: 12, color: P.grey});
      ro.set(0, S.fmt(idx, 1)); ro.set(1, S.fmt(rust * 100, 0) + " %"); ro.set(2, ox);
      nt.set(idx === 0 && !(tw.value && to.value) ? "Sans eau liquide ou sans dioxygène : pas de corrosion." : ct.value === "zn" || ct.value === "mg" ? "Protection cathodique : le métal moins noble est consommé, le clou reste intact." : ct.value === "cu" ? "Le fer est moins noble que le cuivre : il s'oxyde plus vite au contact du cuivre." : ts.value ? "L'eau salée conduit mieux : la corrosion est nettement plus rapide." : "Eau aérée : corrosion lente.", "ok");
      nt.set(nt.el.innerHTML + "<br>Anode : Fe → Fe²⁺ + 2 e⁻ · cathode : O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻ · bilan : 2 Fe + O₂ + 2 H₂O → 2 Fe(OH)₂, puis oxydation en rouille (Fe₂O₃·nH₂O).", "ok");
    });
  }
});
})();
