/* Chimie 4e · chapitre 6 · Calculs stœchiométriques */
SFA.sim({
  id:"c4-c06-guide", ch:"c06", tag:"Classique",
  titre:"Le calculateur guidé en 4 étapes",
  resume:"Choisis une réaction, une espèce connue et une espèce cherchée : les étapes du calcul s'affichent une à une.",
  but:"Règle la masse de départ, puis clique sur « Étape suivante » en essayant de deviner chaque résultat avant qu'il s'affiche.",
  aRetenir:"Méthode : 1) masse → moles (n = m / M) ; 2) rapport des coefficients ; 3) moles de l'espèce cherchée ; 4) moles → masse (m = n · M), ou → volume de gaz (V = n · V_m).",
  piege:"On ne divise jamais directement les masses par les coefficients : il faut toujours passer par les moles.",
  build:function(k, S){
    var c = k.canvas(130);
    var keys = Object.keys(C4.REAC), st = {step:0};
    var rx = k.select("Réaction", keys.map(function(x){ return [x, C4.REAC[x].nom]; }), "ch4", function(){ refill(); st.step = 0; });
    var gv = k.select("Espèce connue", [["0","—"]], "0", function(){ st.step = 0; });
    var wn = k.select("Espèce cherchée", [["0","—"]], "0", function(){ st.step = 0; });
    var m = k.slider("Masse de l'espèce connue", 0.1, 100, 0.1, 16, "g", function(){ st.step = 0; });
    var out = k.note("", "ok", "stage");
    function species(){ var e = C4.REAC[rx.value]; return e.r.concat(e.p); }
    function refill(){
      var sp = species();
      [gv, wn].forEach(function(sel, j){
        sel.el.innerHTML = "";
        sp.forEach(function(t, i){ var o = document.createElement("option"); o.value = i; o.textContent = (i < C4.REAC[rx.value].r.length ? "réactif " : "produit ") + C4.uni(t[1]); sel.el.appendChild(o); });
        sel.el.value = j === 0 ? 0 : sp.length - 1;
      });
    }
    refill();
    k.button("Étape suivante ▶", function(){ st.step = Math.min(5, st.step + 1); }, true); k.button("↺ Recommencer", function(){ st.step = 0; });
    k.draw(function(){
      var sp = species(), g = sp[+gv.value], w = sp[+wn.value], same = gv.value === wn.value;
      c.clear(); var W = c.W, ctx = c.ctx, labs = ["m", "n", "n", "m ou V"], bw = (W - 40) / 4;
      for (var i = 0; i < 4; i++){
        ctx.fillStyle = st.step > i ? "#2e6b55" : "#e3e7ed"; C4.rr(ctx, 10 + i * (bw + 6), 30, bw - 6, 50, 8); ctx.fill();
        C4.label(c, ["m connue", "n connue", "n cherchée", "m cherchée"][i], 10 + i * (bw + 6) + (bw - 6) / 2, 55, st.step > i ? "#fff" : "#5f6b7a", 12);
        if (i < 3) C4.label(c, ["÷ M", "× rapport", "× M"][i], 10 + (i + 1) * (bw + 6) - 3, 100, "#5f6b7a", 12);
      }
      if (same){ out.set("Choisis deux espèces différentes.", "warn"); return; }
      var Mg = C4.M(g[1]), Mw = C4.M(w[1]), n = m.value / Mg, ratio = w[0] / g[0], nw = n * ratio, mw = nw * Mw, gas = C4.GAS[w[1]];
      var h = "";
      h += "<b>Équation :</b> " + C4.eq(rx.value) + "<br>";
      if (st.step >= 1) h += "<b>1.</b> n(" + C4.sub(g[1]) + ") = m / M = " + S.fmt(m.value, 2) + " / " + S.fmt(Mg, 1) + " = <b>" + S.fmt(n, 4) + " mol</b><br>";
      if (st.step >= 2) h += "<b>2.</b> Rapport des coefficients : " + w[0] + " pour " + g[0] + " → n(" + C4.sub(w[1]) + ") / n(" + C4.sub(g[1]) + ") = " + w[0] + " / " + g[0] + " = " + S.fmt(ratio, 3) + "<br>";
      if (st.step >= 3) h += "<b>3.</b> n(" + C4.sub(w[1]) + ") = " + S.fmt(n, 4) + " × " + S.fmt(ratio, 3) + " = <b>" + S.fmt(nw, 4) + " mol</b><br>";
      if (st.step >= 4) h += "<b>4.</b> m(" + C4.sub(w[1]) + ") = n · M = " + S.fmt(nw, 4) + " × " + S.fmt(Mw, 1) + " = <b>" + S.fmt(mw, 2) + " g</b>" + (gas ? " ; ou V = n · V<sub>m</sub> = " + S.fmt(nw, 4) + " × 24 = <b>" + S.fmt(nw * 24, 2) + " L</b> (20 °C, 1 atm)" : "") + "<br>";
      if (st.step >= 5) h += "<b>Réponse :</b> " + S.fmt(m.value, 2) + " g de " + C4.sub(g[1]) + " donnent / nécessitent " + S.fmt(mw, 2) + " g de " + C4.sub(w[1]) + ".";
      if (st.step === 0) h += "<i>Clique sur « Étape suivante ».</i>";
      out.set(h, "ok");
    });
  }
});

SFA.sim({
  id:"c4-c06-methane", ch:"c06", tag:"Graphe",
  titre:"Combustion du méthane : proportionnalité",
  resume:"Plus on brûle de méthane, plus on consomme d'air et on rejette de CO₂ et d'eau, proportionnellement.",
  but:"Fais varier la masse de CH₄ et lis les masses de produits et le volume d'air nécessaire sur les droites.",
  aRetenir:"CH₄ + 2 O₂ → CO₂ + 2 H₂O. Toutes les masses sont proportionnelles à la masse de CH₄ : m(CO₂) = 2,75 × m(CH₄) ; m(H₂O) = 2,25 × m(CH₄) ; m(O₂) = 4 × m(CH₄).",
  piege:"L'air ne contient que 21 % de dioxygène en volume : il faut environ 5 fois plus d'air que de O₂, soit 9,5 fois le volume de CH₄ à même T et p.",
  build:function(k, S){
    var c = k.canvas(280);
    var m = k.slider("Masse de CH₄ brûlé", 1, 200, 1, 16, "g");
    var ro = k.readouts(["O₂ nécessaire", "Air nécessaire", "CO₂ émis", "H₂O formée"]);
    var nt = k.note("", "");
    k.draw(function(){
      var x = m.value, n = x / 16;
      c.clear();
      var ax = S.draw.axes(c, {x0:0, x1:200, y0:0, y1:820, xl:"m(CH₄) en g", yl:"masse en g", l:48});
      S.draw.line(c, ax.X(0), ax.Y(0), ax.X(200), ax.Y(800), "#1e3f8f", 2.5); S.draw.line(c, ax.X(0), ax.Y(0), ax.X(200), ax.Y(550), "#b42318", 2.5); S.draw.line(c, ax.X(0), ax.Y(0), ax.X(200), ax.Y(450), "#2e6b55", 2.5);
      C4.tag(c, "O₂ (×4)", ax.X(120), ax.Y(480) - 10, "#1e3f8f", 12); C4.tag(c, "CO₂ (×2,75)", ax.X(140), ax.Y(385) - 12, "#b42318", 12); C4.tag(c, "H₂O (×2,25)", ax.X(150), ax.Y(337) + 14, "#2e6b55", 12);
      [[4 * x, "#1e3f8f"], [2.75 * x, "#b42318"], [2.25 * x, "#2e6b55"]].forEach(function(p){ S.draw.dot(c, ax.X(x), ax.Y(p[0]), 6, p[1]); });
      S.draw.line(c, ax.X(x), ax.Y(0), ax.X(x), ax.Y(4 * x), "#b8c0cc", 1, [3, 3]);
      ro.set(0, S.fmt(2 * n * 24, 1) + " L"); ro.set(1, S.fmt(2 * n * 24 / 0.21, 0) + " L"); ro.set(2, S.fmt(44 * n, 1) + " g"); ro.set(3, S.fmt(36 * n, 1) + " g");
      nt.set("n(CH₄) = " + S.fmt(n, 3) + " mol. Volumes à 20 °C et 1 atm (V<sub>m</sub> = 24 L/mol) ; l'eau est supposée liquide ; air = 21 % de O₂ en volume.", "");
    });
  }
});

SFA.sim({
  id:"c4-c06-chaux", ch:"c06", tag:"Pureté",
  titre:"Produire de la chaux : calcaire pur ou impur",
  resume:"CaCO₃ → CaO + CO₂ : l'impureté du calcaire change la masse de chaux obtenue et le CO₂ rejeté.",
  but:"Règle la masse de pierre et sa pureté. Observe la masse de chaux vive CaO et de CO₂ libéré.",
  aRetenir:"Masse de CaCO₃ pur = pureté × masse de pierre. n(CaO) = n(CaCO₃) ; m(CaO) = n · 56. Avec 1 tonne de CaCO₃ pur : 560 kg de CaO et 440 kg de CO₂.",
  piege:"Les impuretés (supposées inertes) ne réagissent pas : elles restent dans le solide final. 1 t de pierre à 80 % ne donne pas 560 kg de CaO, mais 448 kg.",
  build:function(k, S){
    var c = k.canvas(260);
    var m = k.slider("Masse de pierre", 100, 2000, 50, 1000, "kg");
    var p = k.slider("Pureté en CaCO₃", 60, 100, 1, 85, "%");
    var obj = k.slider("Objectif : masse de CaO voulue", 50, 1000, 10, 100, "kg");
    var ro = k.readouts(["CaCO₃ pur", "CaO obtenu", "CO₂ libéré", "Pierre pour l'objectif"]);
    k.draw(function(){
      var mi = m.value, pr = p.value / 100, mp = mi * pr, imp = mi - mp, nmol = mp / 100, mcao = nmol * 56, mco2 = nmol * 44;
      c.clear(); var W = c.W, hs = 190 / Math.max(mi, 1), base = 225;
      function col(x, parts){ var y = base; parts.forEach(function(q){ var h = q[0] * hs; c.ctx.fillStyle = q[2]; c.ctx.fillRect(x, y - h, 90, h); if (h > 16) C4.label(c, q[1] + " " + S.fmt(q[0], 0) + " kg", x + 45, y - h / 2, "#fff", 12); y -= h; }); }
      col(W * 0.1, [[mp, "CaCO₃", "#1e3f8f"], [imp, "impuretés", "#8a95a3"]]);
      C4.label(c, "avant", W * 0.1 + 45, base + 16, "#2c3a4e", 12); C4.label(c, "→ chaleur →", W * 0.5, 120, "#b45309", 13);
      col(W * 0.6, [[mcao, "CaO", "#2e6b55"], [imp, "impuretés", "#8a95a3"]]);
      C4.label(c, "solide après", W * 0.6 + 45, base + 16, "#2c3a4e", 12);
      var hc = mco2 * hs; c.ctx.fillStyle = "rgba(14,116,144,.6)"; c.ctx.fillRect(W * 0.6 + 96, base - hc, 40, hc); C4.label(c, "CO₂", W * 0.6 + 116, base - hc - 10, "#0e7490", 12);
      ro.set(0, S.fmt(mp, 0) + " kg"); ro.set(1, S.fmt(mcao, 0) + " kg"); ro.set(2, S.fmt(mco2, 0) + " kg"); ro.set(3, S.fmt(obj.value / 0.56 / pr, 0) + " kg");
    });
    k.note("Impuretés supposées inertes. 56 = M(CaO) ; 100 = M(CaCO₃) ; 44 = M(CO₂) en g/mol. « Pierre pour l'objectif » = masse de calcaire à cette pureté qu'il faut chauffer pour obtenir la masse de CaO choisie.", "");
  }
});

SFA.sim({
  id:"c4-c06-fuite", ch:"c06", tag:"Sécurité",
  titre:"Neutraliser une fuite d'acide",
  resume:"Combien de base faut-il pour neutraliser un acide répandu ? Une quantité exacte, ni trop, ni trop peu.",
  but:"Choisis l'acide, la base et la masse d'acide répandue. Verse la base et surveille la couleur de l'indicateur.",
  aRetenir:"On neutralise quand n(H⁺ apportés) = n(H⁺ captés). Le calcul passe par les moles : n(base) = n(acide) × (rapport des coefficients). Les masses à utiliser sont différentes selon la base choisie.",
  piege:"Avec le bicarbonate (NaHCO₃), du CO₂ se dégage et mousse : on verse lentement. Un excès de base laisse une solution basique, elle aussi dangereuse. Dans la réalité, suivre les consignes de sécurité du laboratoire.",
  build:function(k, S){
    var c = k.canvas(250);
    var A = [["HCl",1,"HCl",36.5],["H2SO4",2,"H₂SO₄",98],["HNO3",1,"HNO₃",63]];
    var B = [["NaOH",1,"NaOH","Na",1,0],["Ca(OH)2",2,"Ca(OH)₂","Ca",2,0],["NaHCO3",1,"NaHCO₃","Na",1,1]];
    var a = k.select("Acide répandu", A.map(function(x, i){ return [i, x[2]]; }), 1);
    var b = k.select("Base de neutralisation", B.map(function(x, i){ return [i, x[2]]; }), 0);
    var m = k.slider("Masse d'acide pur répandu", 0.1, 20, 0.1, 4.9, "kg");
    var v = k.slider("Base versée (en % de la quantité exacte)", 0, 150, 5, 50, "%");
    var ro = k.readouts(["n(acide)", "Base nécessaire", "Base versée", "État"]);
    var nt = k.note("", "");
    k.draw(function(){
      var ac = A[+a.value], ba = B[+b.value], n = ac[1], mm = ba[1], g = C4.gcd(n, mm), xa = mm / g, yb = n / g;
      var nA = m.value * 1000 / ac[3], nB = nA * yb / xa, mB = nB * C4.M(ba[0]) / 1000, f = v.value / 100, state = f < 0.995 ? 0 : f > 1.005 ? 2 : 1;
      var salt = C4.salt(C4.CAT.filter(function(i){ return i.s === ba[3] && i.q === ba[4]; })[0], C4.AN.filter(function(i){ return i.s === (ac[0] === "HCl" ? "Cl" : ac[0] === "H2SO4" ? "SO4" : "NO3"); })[0]).f;
      c.clear(); var W = c.W, ctx = c.ctx, cx = W * 0.3;
      var colr = ["#e5484d", "#46a758", "#3e63dd"][state];
      ctx.fillStyle = colr; ctx.globalAlpha = 0.5; ctx.fillRect(cx - 60, 90, 120, 110); ctx.globalAlpha = 1; ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 62, 70); ctx.lineTo(cx - 62, 202); ctx.lineTo(cx + 62, 202); ctx.lineTo(cx + 62, 70); ctx.stroke();
      if (ba[5] && f > 0 && f < 1.5) for (var i = 0; i < 8; i++) S.draw.dot(c, cx - 50 + i * 14, 190 - ((i * 23 + f * 90) % 80), 3, "rgba(255,255,255,.9)");
      C4.label(c, ["milieu acide", "neutre", "milieu basique"][state], cx, 230, colr, 14);
      C4.label(c, "indicateur universel", cx, 56, "#5f6b7a", 12);
      var bx = W * 0.62, bw = W * 0.34;
      C4.label(c, "Équation :", bx, 40, "#2c3a4e", 13, "left");
      var eq = (xa > 1 ? xa + " " : "") + C4.uni(ac[0]) + " + " + (yb > 1 ? yb + " " : "") + C4.uni(ba[0]);
      C4.tag(c, eq, bx, 62, "#0f1b2d", 13, "left"); C4.tag(c, "→ " + C4.uni(salt) + " + " + xa * n + " H₂O" + (ba[5] ? " + " + xa * n + " CO₂" : ""), bx, 84, "#0f1b2d", 13, "left");
      C4.tag(c, "Rapport : " + yb + " base pour " + xa + " acide", bx, 120, "#1e3f8f", 12, "left");
      ro.set(0, S.fmt(nA, 1) + " mol"); ro.set(1, S.fmt(mB, 2) + " kg"); ro.set(2, S.fmt(mB * f, 2) + " kg"); ro.set(3, ["acide restant", "neutralisé", "base en excès"][state]);
      nt.set(state === 1 ? "✅ Neutralisation exacte : tout l'acide a réagi, il ne reste ni acide ni base." : state === 0 ? "Il reste " + S.fmt(nA * (1 - f), 1) + " mol d'acide non neutralisé." : "Excès de base : " + S.fmt(nB * (f - 1), 1) + " mol de base en trop. Mieux vaut doser que verser trop.", state === 1 ? "ok" : "warn");
    });
  }
});
