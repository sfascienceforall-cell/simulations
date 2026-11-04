/* Chimie 4e · chapitre 10 · Précipitation et oxydoréduction */
(function(){
/* règles de solubilité utilisées (cations en nitrates, anions en sels de sodium) : [statut, couleur, remarque] ; P précipité, S soluble, L peu soluble */
var CATS = [["Ag",1,"nitrate d'argent"],["Pb",2,"nitrate de plomb (II)"],["Ba",2,"nitrate de baryum"],["Ca",2,"nitrate de calcium"],["Cu",2,"nitrate de cuivre (II)"],["Zn",2,"nitrate de zinc"],["Mg",2,"nitrate de magnésium"],["Fe",3,"nitrate de fer (III)"]];
var ANS = [["Cl","chlorure de sodium","NaCl"],["SO4","sulfate de sodium","Na₂SO₄"],["CO3","carbonate de sodium","Na₂CO₃"],["OH","hydroxyde de sodium","NaOH"]];
var T = {
  Ag:{Cl:["P","#f4f4f4","blanc"],SO4:["L","#f4f4f4","blanc, peu soluble"],CO3:["P","#e8e2a8","jaune pâle"],OH:["P","#8b5a3c","brun (en réalité Ag₂O)"]},
  Pb:{Cl:["L","#f4f4f4","blanc, peu soluble (seulement avec des solutions assez concentrées ; se redissout à chaud)"],SO4:["P","#f4f4f4","blanc"],CO3:["P","#f4f4f4","blanc"],OH:["P","#f4f4f4","blanc (se redissout dans un excès de soude)"]},
  Ba:{Cl:["S"],SO4:["P","#f4f4f4","blanc"],CO3:["P","#f4f4f4","blanc"],OH:["S"]},
  Ca:{Cl:["S"],SO4:["L","#f4f4f4","blanc, peu soluble"],CO3:["P","#f4f4f4","blanc"],OH:["L","#f4f4f4","blanc, peu soluble"]},
  Cu:{Cl:["S"],SO4:["S"],CO3:["P","#5fb7a8","bleu-vert (carbonate basique)"],OH:["P","#6fa8dc","bleu pâle"]},
  Zn:{Cl:["S"],SO4:["S"],CO3:["P","#f4f4f4","blanc"],OH:["P","#f4f4f4","blanc (se redissout dans un excès de soude)"]},
  Mg:{Cl:["S"],SO4:["S"],CO3:["P","#f4f4f4","blanc"],OH:["P","#f4f4f4","blanc"]},
  Fe:{Cl:["S"],SO4:["S"],CO3:["X","#a0522d","Fe(OH)₃ brun + CO₂"],OH:["P","#a0522d","brun-rouille"]}
};
var CATCOL = {Ag:"#f4f4f4",Pb:"#f4f4f4",Ba:"#f4f4f4",Ca:"#f4f4f4",Cu:"#9ecbe8",Zn:"#f4f4f4",Mg:"#f4f4f4",Fe:"#f1c76a"};
function ionObj(s, q){ return C4.CAT.filter(function(i){ return i.s === s && i.q === q; })[0]; }
function anObj(s){ return C4.AN.filter(function(i){ return i.s === s; })[0]; }
SFA.sim({
  id:"c4-c10-melange", ch:"c10", tag:"Classique",
  titre:"Mélanger deux solutions : précipité ou pas ?",
  resume:"Un nitrate métallique + un sel de sodium : quel solide se forme ? Quelle est l'équation ionique nette ?",
  but:"Choisis une solution de cation et une solution d'anion, verse-les ensemble et regarde ce qui se forme. Repère les ions spectateurs.",
  aRetenir:"Règles (table simplifiée, pour des solutions d'environ 0,1 mol/L) : les nitrates et les sels de sodium sont solubles. Les chlorures sont solubles sauf AgCl (et PbCl₂, seulement peu soluble) ; les sulfates sauf BaSO₄ et PbSO₄ (CaSO₄ et Ag₂SO₄ sont peu solubles : léger trouble) ; les carbonates et hydroxydes sont peu solubles sauf avec Na⁺ (et quelques autres). Équation nette : on garde seulement les ions qui forment le solide.",
  piege:"Un précipité n'est pas n'importe quel trouble : c'est un solide formé à partir d'ions dissous. Les ions spectateurs (Na⁺, NO₃⁻) restent en solution et ne figurent pas dans l'équation nette.",
  build:function(k, S){
    var c = k.canvas(260);
    var ca = k.select("Solution 1 (cations)", CATS.map(function(x, i){ return [i, x[2] + " (" + x[0] + ["", "⁺", "²⁺", "³⁺"][x[1]] + ")"]; }), 0);
    var an = k.select("Solution 2 (anions)", ANS.map(function(x, i){ return [i, x[1] + " (" + x[2] + ")"]; }), 0);
    var out = k.note("", "ok");
    var st = {p:1}, lp = k.loop(function(dt){ st.p = Math.min(1, st.p + dt / 2.5); if (st.p >= 1) lp.pause(); k.redraw(); });
    [ca.el, an.el].forEach(function(e){ e.addEventListener("change", function(){ st.p = 1; }); });
    k.button("▶ Verser", function(){ st.p = 0; lp.play(); }, true);
    var rnd = C4.rnd(9), P = []; for (var i = 0; i < 40; i++) P.push([rnd(), rnd()]);
    k.draw(function(){
      var cc = CATS[+ca.value], aa = ANS[+an.value], info = T[cc[0]][aa[0]], status = info[0], cat = ionObj(cc[0], cc[1]), anion = anObj(aa[0]);
      c.clear(); var W = c.W, ctx = c.ctx, bw = Math.min(90, W * 0.22);
      var x1 = W * 0.08, x2 = W * 0.38, x3 = W * 0.7;
      C4.beaker(c, x1, 70, bw, 90, 0.6, CATCOL[cc[0]], 0.7); C4.beaker(c, x2, 70, bw, 90, 0.6, "#dfeaf3", 0.6); C4.beaker(c, x3, 70, bw, 90, 0.6 + 0.0, st.p < 1 ? "#e6eef5" : "#e6eef5", 0.65);
      C4.label(c, C4.uni(cc[0] + (cc[1] > 1 ? "" : "")) + (cc[1] === 1 ? "⁺" : cc[1] === 2 ? "²⁺" : "³⁺"), x1 + bw / 2, 190, "#1e3f8f", 14); C4.label(c, C4.uni(aa[2]), x2 + bw / 2, 190, "#b42318", 14);
      C4.label(c, "→", (x2 + bw + x3) / 2 - 4, 120, "#5f6b7a", 22); C4.label(c, "+", (x1 + bw + x2) / 2, 120, "#5f6b7a", 20);
      if (status === "P" || status === "X" || status === "L"){
        var n = status === "L" ? 8 : 40;
        for (var j = 0; j < n; j++){ var fall = Math.min(1, st.p * 1.6); var y = 80 + (P[j][1] * 0.5 + fall * 0.5) * 70, yy = 76 + P[j][1] * 20 * (1 - fall) + fall * (66 + P[j][1] * 8);
          ctx.fillStyle = info[1]; ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(x3 + 8 + P[j][0] * (bw - 16), 76 + (1 - fall) * P[j][1] * 56 + fall * (56 + P[j][1] * 10), 3, 0, 7); ctx.fill(); ctx.stroke(); }
      }
      if (status === "X") for (j = 0; j < 5; j++) S.draw.dot(c, x3 + 12 + j * 14, 130 - ((Date.now() / 30 + j * 13) % 40), 2.5, "rgba(255,255,255,.9)");
      C4.label(c, status === "S" ? "aucun précipité" : status === "L" ? "léger trouble" : "précipité " + info[2].split(" (")[0], x3 + bw / 2, 190, "#2c3a4e", 12);
      var net, form = "";
      if (status === "S"){ net = "Aucune réaction : tous les ions restent dissous."; }
      else {
        var s = C4.salt(cat, anion), pf = s.f, xc = s.x, ya = s.y;
        if (cc[0] === "Ag" && aa[0] === "OH") net = "2 Ag⁺ + 2 OH⁻ → Ag₂O(s) + H₂O";
        else if (status === "X") net = "2 Fe³⁺ + 3 CO₃²⁻ + 3 H₂O → 2 Fe(OH)₃(s) + 3 CO₂(g)";
        else net = (ya > 1 ? ya + " " : "") + C4.uni(cc[0]) + C4.ionUni({s:"", q:cc[1]}, 1).replace(/^/, "") + " + " + (xc > 1 ? xc + " " : "") + C4.ionUni(anion, 0) + " → " + C4.uni(pf) + "(s)";
        /* x et y : s.x = nombre de cations (an.q/g) ; s.y = nombre d'anions */
        net = (s.x > 1 ? s.x + " " : "") + C4.uni(cc[0]) + ["", "⁺", "²⁺", "³⁺"][cc[1]] + " + " + (s.y > 1 ? s.y + " " : "") + C4.ionUni(anion, 0) + " → " + C4.uni(pf) + "(s)";
        if (cc[0] === "Ag" && aa[0] === "OH") net = "2 Ag⁺ + 2 OH⁻ → Ag₂O(s) + H₂O";
        if (status === "X") net = "2 Fe³⁺ + 3 CO₃²⁻ + 3 H₂O → 2 Fe(OH)₃(s) + 3 CO₂(g)";
      }
      var h = "<b>Équation nette :</b> " + net + "<br>";
      if (status === "S") h += "Les quatre ions (" + C4.sub(cc[0]) + C4.sup(cc[1], 1) + ", NO<sub>3</sub><sup>−</sup>, Na<sup>+</sup>, " + C4.ionHtml(anion, 0) + ") restent dissous : tout le monde est spectateur.";
      else h += "<b>Ions spectateurs :</b> NO<sub>3</sub><sup>−</sup> et Na<sup>+</sup> (ils restent dissous et n'apparaissent pas dans l'équation nette)." + (status === "L" ? "<br><i>Ce solide est peu soluble : on observe un trouble léger si les solutions sont concentrées, rien si elles sont diluées.</i>" : "") + "<br>Précipité : " + info[2] + ".";
      out.set(h, status === "S" ? "" : "ok");
    });
  }
});

SFA.sim({
  id:"c4-c10-flacons", ch:"c10", tag:"Enquête",
  titre:"Les trois flacons sans étiquette",
  resume:"Un flacon contient NaCl, un autre Na₂SO₄, le dernier Na₂CO₃ : identifie-les avec deux réactifs.",
  but:"Ajoute du nitrate de baryum ou de l'acide chlorhydrique dilué dans chaque flacon, note les observations et propose une identification.",
  aRetenir:"Ba²⁺ forme un précipité blanc avec SO₄²⁻ et CO₃²⁻ mais pas avec Cl⁻. L'acide dissout le précipité de carbonate en dégageant du CO₂ (bulles) mais pas celui de sulfate. Deux tests bien choisis suffisent.",
  piege:"Si tu ajoutes l'acide AVANT le baryum, le carbonate est déjà détruit (CO₂ dégagé) : plus de précipité BaCO₃. L'ordre des tests compte.",
  build:function(k, S){
    var c = k.canvas(220);
    var NAMES = {Cl:"NaCl", SO4:"Na₂SO₄", CO3:"Na₂CO₃"}, st = {};
    function newGame(){ var a = ["Cl", "SO4", "CO3"].sort(function(){ return Math.random() - 0.5; }); st = {sol:a, ba:[0,0,0], ac:[0,0,0], log:[[],[],[]], tests:0, res:null, carbPresent:[1,1,1]}; }
    newGame();
    var fl = k.seg("Flacon", [[0,"A"],[1,"B"],[2,"C"]], 0);
    var g = [k.select("Je pense que A est", [["Cl","NaCl"],["SO4","Na₂SO₄"],["CO3","Na₂CO₃"]], "Cl"), k.select("Je pense que B est", [["Cl","NaCl"],["SO4","Na₂SO₄"],["CO3","Na₂CO₃"]], "SO4"), k.select("Je pense que C est", [["Cl","NaCl"],["SO4","Na₂SO₄"],["CO3","Na₂CO₃"]], "CO3")];
    var ro = k.readouts(["Tests effectués"]);
    var out = k.note("", "");
    k.button("+ Ba(NO₃)₂", function(){ var i = +fl.value; st.tests++; var s = st.sol[i];
      if (s === "SO4" || (s === "CO3" && st.carbPresent[i])){ st.ba[i] = 1; st.log[i].push("+ Ba(NO₃)₂ : précipité blanc"); } else st.log[i].push("+ Ba(NO₃)₂ : rien" + (s === "CO3" ? " (le carbonate a déjà disparu avec l'acide)" : "")); });
    k.button("+ HCl dilué", function(){ var i = +fl.value; st.tests++; var s = st.sol[i];
      if (s === "CO3" && st.carbPresent[i]){ st.carbPresent[i] = 0; st.ba[i] = 0; st.log[i].push("+ HCl : bulles (effervescence)" + (st.ac[i] === 0 && st.log[i].some(function(l){ return /précipité/.test(l); }) ? ", le précipité disparaît" : "")); } else st.log[i].push("+ HCl : rien d'observable");
      st.ac[i] = 1; });
    k.button("Vérifier mes réponses", function(){ var ok = g.every(function(x, i){ return x.value === st.sol[i]; }); st.res = ok ? "ok" : "ko"; });
    k.button("Nouveau jeu", function(){ newGame(); });
    k.draw(function(){
      c.clear(); var W = c.W, ctx = c.ctx, cw = W / 3;
      for (var i = 0; i < 3; i++){
        var cx = cw * i + cw / 2; ctx.fillStyle = "rgba(200,225,240,.5)"; ctx.fillRect(cx - 32, 80, 64, 100); ctx.strokeStyle = +fl.value === i ? "#1e3f8f" : "#5f6b7a"; ctx.lineWidth = +fl.value === i ? 4 : 2.5; ctx.beginPath(); ctx.moveTo(cx - 32, 50); ctx.lineTo(cx - 32, 180); ctx.lineTo(cx + 32, 180); ctx.lineTo(cx + 32, 50); ctx.stroke();
        if (st.ba[i]){ for (var j = 0; j < 14; j++){ ctx.fillStyle = "#f4f4f4"; ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(cx - 26 + (j * 37 % 52), 172 - (j * 13 % 20), 3.2, 0, 7); ctx.fill(); ctx.stroke(); } }
        C4.label(c, "Flacon " + "ABC"[i], cx, 36, "#0f1b2d", 14);
        var last = st.log[i][st.log[i].length - 1] || ""; if (/bulles/.test(last)) for (j = 0; j < 6; j++) S.draw.dot(c, cx - 22 + j * 9, 150 - ((Date.now() / 25 + j * 21) % 60), 2.4, "rgba(255,255,255,.95)");
        if (st.res){ C4.label(c, C4.uni(NAMES[st.sol[i]]), cx, 205, "#2e6b55", 13); }
      }
      ro.set(0, st.tests);
      var h = "<b>Observations</b><br>" + [0,1,2].map(function(i){ return "<b>" + "ABC"[i] + " :</b> " + (st.log[i].length ? st.log[i].join(" ; ") : "aucun test") ; }).join("<br>");
      if (st.res === "ok") h += "<br>✅ Bravo, identification correcte en " + st.tests + " test(s). Raisonnement : le précipité blanc qui persiste avec l'acide désigne le sulfate, celui qui disparaît en bullant le carbonate, l'absence de précipité le chlorure.";
      if (st.res === "ko") h += "<br>Pas encore : revois tes observations. Un précipité avec Ba²⁺ exclut le chlorure ; l'acide départage sulfate et carbonate.";
      out.set(h, st.res === "ok" ? "ok" : "");
    });
  }
});

SFA.sim({
  id:"c4-c10-zinc", ch:"c10", tag:"Redox",
  titre:"Une lame de zinc dans le sulfate de cuivre",
  resume:"Le zinc cède des électrons aux ions cuivre : le cuivre se dépose, la solution bleue pâlit.",
  but:"Choisis la solution de CuSO₄ et la masse de zinc, puis laisse la réaction avancer. Compare ce qui s'épuise en premier.",
  aRetenir:"Zn → Zn²⁺ + 2 e⁻ (oxydation : Zn est le réducteur) ; Cu²⁺ + 2 e⁻ → Cu (réduction : Cu²⁺ est l'oxydant). Équation : Zn + Cu²⁺ → Zn²⁺ + Cu. La couleur bleue est due aux ions Cu²⁺ : elle pâlit quand ils disparaissent.",
  piege:"Oxydation ne veut pas dire « gain d'oxygène » : c'est une perte d'électrons. Ici, aucun oxygène n'intervient dans l'équation.",
  build:function(k, S){
    var c = k.canvas(250);
    var cc = k.slider("c(CuSO₄)", 0.05, 0.50, 0.05, 0.2, "mol/L");
    var vv = k.slider("Volume de solution", 50, 200, 10, 100, "mL");
    var mz = k.slider("Masse de la lame de zinc", 0.2, 5, 0.1, 2, "g");
    var t = k.slider("Temps", 0, 60, 1, 0, "min");
    var ro = k.readouts(["ξ (mol)", "Cu déposé", "Zn consommé", "c(Cu²⁺) restante"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ t.set(Math.min(60, t.value + dt * 8)); if (t.value >= 60) lp.pause(); k.redraw(); });
    k.button("▶ Plonger la lame", function(){ if (t.value >= 60) t.set(0); lp.play(); }, true); k.button("❚❚ Pause", function(){ lp.pause(); }); k.button("↺ Départ", function(){ lp.pause(); t.set(0); });
    k.draw(function(){
      var nCu = cc.value * vv.value / 1000, nZn = mz.value / 65, xm = Math.min(nCu, nZn), x = xm * (1 - Math.exp(-t.value / 12)), cR = (nCu - x) / (vv.value / 1000);
      c.clear(); var W = c.W, ctx = c.ctx, cx = W * 0.5;
      var inten = Math.min(0.9, 0.04 + cR * 1.6);
      ctx.fillStyle = "rgba(40,110,215," + inten + ")"; ctx.fillRect(cx - 70, 110, 140, 130);
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 70, 80); ctx.lineTo(cx - 70, 240); ctx.lineTo(cx + 70, 240); ctx.lineTo(cx + 70, 80); ctx.stroke();
      var zw = 16, zh = 120; ctx.fillStyle = "#9aa5b4"; ctx.fillRect(cx - zw / 2, 40, zw, zh); var cuh = Math.min(1, x / Math.max(nCu, 1e-9)) * 1;
      ctx.fillStyle = "#b86a2e"; ctx.globalAlpha = Math.min(1, x / 0.004); ctx.fillRect(cx - zw / 2 - 2, 110, zw + 4, 50); ctx.globalAlpha = 1;
      C4.label(c, "lame de Zn", cx, 28, "#5f6b7a", 12);
      if (lp.running) for (var i = 0; i < 4; i++){ var yy = 125 + ((Date.now() / 40 + i * 20) % 60); S.draw.arrow(c, cx - 24, 118 + i * 15, cx - 24 + 18, 118 + i * 15, "#b42318", 2); }
      C4.label(c, "e⁻", cx - 34, 108, "#b42318", 12);
      ro.set(0, S.fmt(x * 1000, 2) + " mmol"); ro.set(1, S.fmt(x * 63.5, 2) + " g"); ro.set(2, S.fmt(x * 65, 2) + " g"); ro.set(3, S.fmt(cR, 3) + " mol/L");
      nt.set(nCu < nZn ? "Les ions Cu²⁺ sont limitants (" + S.fmt(nCu * 1000, 1) + " mmol contre " + S.fmt(nZn * 1000, 1) + " mmol de Zn) : la solution finit par se décolorer, il reste du zinc. Masse de la lame à la fin : " + S.fmt(mz.value - xm * 65 + xm * 63.5, 2) + " g (le cuivre déposé pèse un peu moins que le zinc dissous)." : "Le zinc est limitant : il disparaît avant la fin, la solution reste bleue (il reste " + S.fmt((nCu - nZn) * 1000, 1) + " mmol de Cu²⁺).", "");
    });
    k.note("<b>Demi-équations.</b> Oxydation : Zn → Zn<sup>2+</sup> + 2 e<sup>−</sup> (Zn est le réducteur). Réduction : Cu<sup>2+</sup> + 2 e<sup>−</sup> → Cu (Cu<sup>2+</sup> est l'oxydant). Bilan : Zn + Cu<sup>2+</sup> → Zn<sup>2+</sup> + Cu.", "ok");
    k.note("Cinétique simplifiée : ξ(t) = ξ<sub>max</sub>·(1 − e<sup>−t/12</sup>) ; M(Zn) = 65, M(Cu) = 63,5 g/mol.", "");
  }
});

SFA.sim({
  id:"c4-c10-durete", ch:"c10", tag:"Niche",
  titre:"Dureté de l'eau : quand le savon forme un précipité",
  resume:"Dans une eau calcaire, le savon précipite avec Ca²⁺ avant de mousser : plus l'eau est dure, plus il faut de savon.",
  but:"Choisis la dureté et le volume d'eau, ajoute du savon goutte à goutte et repère le moment où la mousse apparaît.",
  aRetenir:"Ca²⁺ + 2 savon⁻ → (savon)₂Ca (précipité, « écume »). La mousse n'apparaît qu'une fois tous les ions Ca²⁺ précipités. Dureté en degrés français : 1 °f = 0,1 mmol/L d'ions Ca²⁺ (équivalent), soit 10 mg/L de CaCO₃.",
  piege:"Le précipité d'écume n'est pas de la saleté : c'est le savon qui a réagi avec le calcaire. L'eau dure consomme du savon sans nettoyer.",
  build:function(k, S){
    var c = k.canvas(260);
    var h = k.slider("Dureté de l'eau", 0, 60, 1, 30, "°f");
    var v = k.slider("Volume d'eau", 50, 200, 10, 100, "mL");
    var d = k.slider("Gouttes de savon ajoutées (0,05 mmol chacune)", 0, 60, 1, 0, "");
    var ro = k.readouts(["n(Ca²⁺)", "Savon nécessaire", "Gouttes nécessaires", "Mousse ?", "Classe (indicative)"]);
    var nt = k.note("", "");
    k.draw(function(){
      var nCa = h.value * 0.1 * v.value / 1000, soap = d.value * 0.05, need = 2 * nCa, ppt = Math.min(soap / 2, nCa), excess = Math.max(0, soap - need), dn = need / 0.05;
      c.clear(); var W = c.W, ctx = c.ctx, cx = W * 0.5;
      ctx.fillStyle = "rgba(150,200,235,.45)"; ctx.fillRect(cx - 55, 110, 110, 110);
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 55, 60); ctx.lineTo(cx - 55, 220); ctx.lineTo(cx + 55, 220); ctx.lineTo(cx + 55, 60); ctx.stroke();
      var rnd = C4.rnd(4), np = nCa > 0 ? Math.round(60 * ppt / Math.max(nCa, 1e-9)) : 0;
      for (var i = 0; i < np; i++){ ctx.fillStyle = "rgba(245,245,235,.95)"; ctx.beginPath(); ctx.arc(cx - 48 + rnd() * 96, 112 + rnd() * 100, 3.6, 0, 7); ctx.fill(); }
      var nb = Math.min(30, Math.round(excess / 0.05 * 3)); if (nb > 0 && excess > 1e-9){ for (i = 0; i < nb; i++){ ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.strokeStyle = "#b8c0cc"; ctx.beginPath(); ctx.arc(cx - 50 + rnd() * 100, 104 - rnd() * 12, 5 + rnd() * 3, 0, 7); ctx.fill(); ctx.stroke(); } }
      C4.label(c, S.fmt(v.value, 0) + " mL d'eau à " + S.fmt(h.value, 0) + " °f", cx, 240, "#2c3a4e", 12);
      C4.label(c, "Ca²⁺ + 2 savon⁻ → (savon)₂Ca ↓", W / 2, 24, "#0f1b2d", 13);
      var cls = h.value < 7 ? "très douce" : h.value < 15 ? "douce" : h.value < 25 ? "moyennement dure" : h.value < 32 ? "assez dure" : h.value < 42 ? "dure" : "très dure";
      ro.set(0, S.fmt(nCa, 3) + " mmol"); ro.set(1, S.fmt(need, 2) + " mmol"); ro.set(2, S.fmt(dn, 1)); ro.set(3, excess > 1e-9 ? "oui" : "non"); ro.set(4, cls);
      nt.set(h.value === 0 ? "Eau sans calcaire : la mousse apparaît dès la première goutte." : excess > 1e-9 ? "Mousse : tous les ions Ca²⁺ ont précipité, le savon en excès mousse. Dureté retrouvée : " + S.fmt(d.value * 0.05 / 2 / (v.value / 1000) / 0.1, 0) + " °f (au nombre entier de gouttes près)." : "Pas de mousse : le savon est consommé par le calcaire (précipité d'écume). " + (dn - d.value < 1e-9 ? "Tous les Ca²⁺ viennent de précipiter : la prochaine goutte fera mousser." : "Il faut encore " + S.fmt(Math.max(0, dn - d.value), 1) + " goutte(s) pour que tous les Ca²⁺ précipitent."), excess > 1e-9 ? "ok" : "");
    });
    k.note("Modèle simplifié : seul Ca²⁺ cause la dureté (en réalité aussi Mg²⁺) ; chaque goutte apporte 0,05 mmol de savon (anion carboxylate).", "");
  }
});
})();
