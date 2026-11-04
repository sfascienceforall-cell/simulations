/* Chimie 4e · chapitre 8 · Concentration, dilution */
SFA.sim({
  id:"c4-c08-preparation", ch:"c08", tag:"Classique",
  titre:"Préparer une solution dans une fiole jaugée",
  resume:"Pèse un soluté, dissous-le, complète jusqu'au trait : la concentration se déduit de n et du volume de la fiole.",
  but:"Choisis un soluté, une masse et une fiole jaugée. Regarde la concentration molaire et massique, et la couleur de la solution.",
  aRetenir:"c = n / V avec n = m / M et V le volume de la solution (celui de la fiole). Concentration massique c_m = m / V = c · M.",
  piege:"Le volume de la fiole est le volume de la solution, pas celui de l'eau versée : on dissout dans un peu d'eau, puis on complète jusqu'au trait de jauge. Pense aussi à convertir les mL en L.",
  build:function(k, S){
    var c = k.canvas(260);
    var SO = {NaCl:["NaCl",58.5,"sel de cuisine",null,360], CuSO4:["CuSO4.5H2O",249.5,"sulfate de cuivre hydraté",[30,110,210],320], KMnO4:["KMnO4",158,"permanganate de potassium",[130,20,160],64], glu:["C6H12O6",180,"glucose",null,900]};
    var so = k.select("Soluté", Object.keys(SO).map(function(x){ return [x, SO[x][2]]; }), "CuSO4");
    var m = k.slider("Masse de soluté pesée", 0.1, 20, 0.1, 6.2, "g");
    var fi = k.seg("Fiole jaugée", [[50,"50 mL"],[100,"100 mL"],[250,"250 mL"],[500,"500 mL"],[1000,"1 L"]], 250);
    var ro = k.readouts(["n", "c (mol/L)", "c_m (g/L)"]);
    var nt = k.note("", "");
    k.draw(function(){
      var s = SO[so.value], Mm = s[1], V = +fi.value / 1000, n = m.value / Mm, cm = n / V, cg = m.value / V;
      c.clear(); var W = c.W, ctx = c.ctx, cx = W * 0.28;
      var col = s[3] ? "rgba(" + s[3].join(",") + "," + Math.min(0.9, 0.08 + cm * 0.9 / (so.value === "KMnO4" ? 0.1 : 0.4)) + ")" : "rgba(200,225,240,.45)";
      ctx.fillStyle = col; ctx.fillRect(cx - 34, 120, 68, 90); ctx.beginPath(); ctx.arc(cx, 210, 50, 0, Math.PI); ctx.fill();
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 12, 14); ctx.lineTo(cx - 12, 110); ctx.bezierCurveTo(cx - 12, 130, cx - 60, 140, cx - 60, 205); ctx.arc(cx, 210, 60, Math.PI, 0, true); ctx.moveTo(cx + 12, 14); ctx.lineTo(cx + 12, 110); ctx.bezierCurveTo(cx + 12, 130, cx + 60, 140, cx + 60, 205); ctx.stroke();
      ctx.fillStyle = "#b42318"; ctx.fillRect(cx - 18, 118, 36, 3); C4.label(c, "trait de jauge", cx + 28, 119, "#b42318", 11, "left");
      C4.label(c, S.fmt(V * 1000, 0) + " mL", cx, 245, "#2c3a4e", 13);
      var bx = W * 0.58;
      C4.tag(c, "m = " + S.fmt(m.value, 1) + " g", bx, 40, "#2c3a4e", 13, "left"); C4.tag(c, "M = " + S.fmt(Mm, 1) + " g/mol", bx, 66, "#2c3a4e", 13, "left");
      C4.tag(c, "n = m / M = " + S.fmt(n, 4) + " mol", bx, 100, "#1e3f8f", 13, "left"); C4.tag(c, "c = n / V = " + S.fmt(cm, 3) + " mol/L", bx, 126, "#1e3f8f", 14, "left");
      C4.tag(c, "(" + C4.uni(s[0].replace(".", "·")) + ")", bx, 160, "#5f6b7a", 12, "left");
      ro.set(0, S.fmt(n, 4) + " mol"); ro.set(1, S.fmt(cm, 3) + " mol/L"); ro.set(2, S.fmt(cg, 1) + " g/L");
      nt.set(cg > s[4] ? "Au-delà de la solubilité (≈ " + s[4] + " g/L à 20 °C) : tout le soluté ne se dissoudrait pas." : "Solubilité approximative à 20 °C : ≈ " + s[4] + " g/L ; tu es en dessous, tout se dissout.", cg > s[4] ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"c4-c08-dilution", ch:"c08", tag:"Animation",
  titre:"Diluer : la quantité de soluté ne change pas",
  resume:"Prélève un volume de solution mère et complète : la solution fille est plus pâle, mais contient les mêmes particules.",
  but:"Règle la concentration de la mère, celle de la fille et le volume voulu. Lis le volume à prélever et le facteur de dilution.",
  aRetenir:"n(mère prélevée) = n(fille) : c₁ · V₁ = c₂ · V₂. Facteur de dilution F = c₁ / c₂ = V₂ / V₁. Concentration divisée par F, mêmes particules, volume multiplié par F.",
  piege:"Il faut compléter jusqu'au trait de jauge, pas ajouter V₂ d'eau : V₂ est le volume total de la solution fille.",
  build:function(k, S){
    var c = k.canvas(280);
    var c1 = k.slider("c₁ (solution mère)", 1, 5, 0.5, 2, "mol/L");
    var c2 = k.slider("c₂ (solution fille voulue)", 0.05, 1, 0.05, 0.2, "mol/L");
    var v2 = k.slider("V₂ (volume de fille)", 50, 1000, 50, 250, "mL");
    var ro = k.readouts(["V₁ à prélever", "Facteur F", "n transféré"]);
    var nt = k.note("", "");
    var rnd = C4.rnd(5), P = []; for (var i = 0; i < 80; i++) P.push([rnd(), rnd()]);
    k.draw(function(){
      var C1 = c1.value, C2 = c2.value, V2 = v2.value, V1 = C2 * V2 / C1, F = C1 / C2, n = C2 * V2 / 1000;
      c.clear(); var W = c.W, ctx = c.ctx;
      var dk = 0.0016;   /* densité de points : proportionnelle à la concentration (points par px² et par mol/L) */
      function vessel(x, w, h, frac, conc, label, nn){
        ctx.fillStyle = "rgba(30,110,210," + Math.min(0.85, 0.06 + conc * 0.3) + ")"; ctx.fillRect(x, 230 - h * frac, w, h * frac);
        ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 230 - h); ctx.lineTo(x, 230); ctx.lineTo(x + w, 230); ctx.lineTo(x + w, 230 - h); ctx.stroke();
        for (var j = 0; j < nn; j++){ S.draw.dot(c, x + 6 + P[j][0] * (w - 12), 230 - 6 - P[j][1] * (h * frac - 12), 3, "#1e3f8f"); }
        C4.label(c, label, x + w / 2, 250, "#2c3a4e", 12);
      }
      var mw = W * 0.2, fw = W * 0.38, gx = 14, fx = W * 0.52;
      var nM = Math.max(2, Math.min(80, Math.round(dk * C1 * (mw - 12) * (140 * 0.8 - 12)))), nF = Math.max(1, Math.min(80, Math.round(dk * C2 * (fw - 12) * (160 * 0.9 - 12)))), nP = Math.max(1, Math.min(30, Math.round(dk * C1 * 10 * 44)));
      vessel(gx, mw, 140, 0.8, C1, "mère " + S.fmt(C1, 1) + " mol/L", nM);
      /* prélèvement : montrer les particules transférées (en rouge) dans la pipette */
      ctx.fillStyle = "rgba(30,110,210," + Math.min(0.85, 0.06 + C1 * 0.3) + ")"; ctx.fillRect(gx + mw + 20, 100, 16, 50); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 2; ctx.strokeRect(gx + mw + 20, 60, 16, 130);
      for (var j = 0; j < nP; j++) S.draw.dot(c, gx + mw + 23 + P[j][0] * 10, 103 + P[j][1] * 44, 2.6, "#b42318");
      C4.label(c, "pipette", gx + mw + 28, 52, "#5f6b7a", 12); C4.label(c, S.fmt(V1, 1) + " mL", gx + mw + 28, 205, "#b42318", 12);
      vessel(fx, fw, 160, 0.9, C2, "fille " + S.fmt(C2, 2) + " mol/L", nF);
      C4.label(c, "● rouge : particules dans la pipette (densité ∝ concentration, schéma qualitatif)", W / 2, 270, "#b42318", 12);
      ro.set(0, S.fmt(V1, 2) + " mL"); ro.set(1, S.fmt(F, 1)); ro.set(2, S.fmt(n * 1000, 1) + " mmol");
      nt.set(C2 >= C1 ? "c₂ ≥ c₁ : ce n'est pas une dilution (on ne peut pas diluer pour concentrer)." : V1 > V2 ? "Volume à prélever supérieur à V₂ : impossible." : "Prélève " + S.fmt(V1, 2) + " mL de mère, place-les dans une fiole de " + S.fmt(V2, 0) + " mL et complète jusqu'au trait avec de l'eau. Il y a " + S.fmt(F, 1) + " fois moins de particules par litre.", C2 >= C1 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"c4-c08-teinte", ch:"c08", tag:"Étalonnage",
  titre:"Échelle de teinte : trouver une concentration inconnue",
  resume:"Une solution bleue de concentration cachée : compare sa couleur et son absorbance à celles d'une gamme étalon.",
  but:"Observe la gamme étalon et l'absorbance de l'inconnue. Déplace le curseur sur la droite d'étalonnage pour lire sa concentration, puis vérifie.",
  aRetenir:"Dans le domaine de linéarité, l'absorbance est proportionnelle à la concentration : A = k · c (loi de Beer-Lambert). On lit c sur la droite d'étalonnage à l'absorbance mesurée.",
  piege:"Modèle simplifié (A = 10 L/mol × c pour 1 cm de cuve) : au-delà de A ≈ 1, la proportionnalité n'est plus fiable, il vaut mieux diluer l'échantillon.",
  build:function(k, S){
    var c = k.canvas(330), K = 10, st = {cx:0.05, rev:false};
    var cl = k.slider("Concentration lue sur la droite", 0, 0.12, 0.001, 0.05, "mol/L");
    var ro = k.readouts(["A de l'inconnue", "A à la valeur lue", "c lue"]);
    var nt = k.note("Place le curseur pour que l'absorbance de la droite égale celle de l'inconnue.", "");
    k.button("Révéler", function(){ st.rev = true; }, true); k.button("Nouvelle inconnue", function(){ st.cx = Math.round((0.012 + Math.random() * 0.08) * 1000) / 1000; st.rev = false; cl.set(0.05); });
    st.cx = 0.047;
    function colr(A){ var f = Math.min(1, A / 1.2); return "rgb(" + Math.round(255 - f * 215) + "," + Math.round(255 - f * 125) + "," + Math.round(255 - f * 40) + ")"; }
    k.draw(function(){
      var Ax = K * st.cx, cc = cl.value, Ac = K * cc;
      c.clear(); var W = c.W, ctx = c.ctx, ref = [0, 0.02, 0.04, 0.06, 0.08, 0.10], tw = (W - 40) / 7;
      ref.concat([null]).forEach(function(v, i){
        var x = 14 + i * (tw + 2), A = v === null ? Ax : K * v;
        ctx.fillStyle = colr(A); ctx.fillRect(x, 30, tw - 8, 70); ctx.strokeStyle = v === null ? "#b42318" : "#5f6b7a"; ctx.lineWidth = v === null ? 3 : 2; ctx.strokeRect(x, 30, tw - 8, 70);
        C4.label(c, v === null ? "?" : S.fmt(v, 2), x + (tw - 8) / 2, 114, v === null ? "#b42318" : "#2c3a4e", 12);
      });
      C4.label(c, "gamme étalon (mol/L) et solution inconnue", W / 2, 14, "#5f6b7a", 12);
      var g = {x0:0, x1:0.12, y0:0, y1:1.2}, L = 48, R = W - 16, T = 140, B = 300;
      var X = function(x){ return L + x / g.x1 * (R - L); }, Y = function(y){ return B - y / g.y1 * (B - T); };
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
      for (var a = 0; a <= 1.2; a += 0.2){ C4.label(c, S.fmt(a, 1), L - 5, Y(a), "#5f6b7a", 11, "right"); }
      for (var q = 0; q <= 0.12; q += 0.02){ C4.label(c, S.fmt(q, 2), X(q), B + 12, "#5f6b7a", 11); }
      C4.label(c, "c (mol/L)", R, B + 26, "#2c3a4e", 12, "right"); C4.label(c, "A", L + 6, T - 8, "#2c3a4e", 12, "left");
      S.draw.line(c, X(0), Y(0), X(0.12), Y(1.2), "#1e3f8f", 2.5);
      ref.forEach(function(v){ S.draw.dot(c, X(v), Y(K * v), 5, "#1e3f8f"); });
      S.draw.line(c, L, Y(Ax), R, Y(Ax), "#b42318", 1.5, [5, 4]); C4.tag(c, "A inconnue = " + S.fmt(Ax, 3), R, Y(Ax) - 10, "#b42318", 12, "right");
      S.draw.line(c, X(cc), B, X(cc), Y(Ac), "#2e6b55", 2); S.draw.dot(c, X(cc), Y(Ac), 6, "#2e6b55");
      ro.set(0, S.fmt(Ax, 3)); ro.set(1, S.fmt(Ac, 3)); ro.set(2, S.fmt(cc, 3) + " mol/L");
      if (st.rev) nt.set("Concentration réelle : " + S.fmt(st.cx, 3) + " mol/L. Ton résultat : " + S.fmt(cc, 3) + " mol/L (écart " + S.fmt(Math.abs(cc - st.cx) / st.cx * 100, 1) + " %).", Math.abs(cc - st.cx) / st.cx < 0.05 ? "ok" : "warn");
      else nt.set(Ax > 1 ? "Absorbance trop élevée (> 1) : dilue l'échantillon avant de mesurer." : "Place le curseur vert pour que A(curseur) = A(inconnue), puis clique sur « Révéler ».", Ax > 1 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"c4-c08-mer", ch:"c08", tag:"Niche",
  titre:"Évaporer l'eau de mer : une saumure de plus en plus concentrée",
  resume:"Quand l'eau s'évapore, le sel reste : la concentration augmente jusqu'à la saturation, puis le sel cristallise.",
  but:"Fais s'évaporer une part de 10 L d'eau de mer (35 g/L de sel) et regarde c, la limite de solubilité et les cristaux.",
  aRetenir:"La masse de sel dissous ne change pas tant que rien ne cristallise : c = m(sel) / V, donc c augmente quand V diminue. Au-delà de la solubilité (≈ 360 g/L pour NaCl à 20 °C), l'excès cristallise.",
  piege:"Modèle simplifié : on suppose que seul NaCl est dissous (35 g/L, M = 58,5 g/mol). Dans la vraie eau de mer, d'autres sels existent et cristallisent à d'autres moments (c'est pourquoi les marais salants se font par étapes).",
  build:function(k, S){
    var c = k.canvas(280), V0 = 10, c0 = 35, SAT = 360;
    var f = k.slider("Part de l'eau évaporée", 0, 95, 1, 0, "%");
    var ro = k.readouts(["Volume restant", "c dissous", "c (mol/L)", "Sel cristallisé"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ f.set(Math.min(95, f.value + dt * 12)); if (f.value >= 95) lp.pause(); k.redraw(); });
    k.button("▶ Évaporer", function(){ if (f.value >= 95) f.set(0); lp.play(); }, true); k.button("❚❚ Pause", function(){ lp.pause(); }); k.button("↺ Départ", function(){ lp.pause(); f.set(0); });
    k.draw(function(){
      var fr = f.value / 100, V = V0 * (1 - fr), cmax = c0 * V0 / V, cd = Math.min(cmax, SAT), cr = Math.max(0, c0 * V0 - SAT * V);
      c.clear(); var W = c.W, ctx = c.ctx, cx = W * 0.22, hf = 150 * V / V0 + 4;
      ctx.fillStyle = "rgba(60,150,200," + Math.min(0.9, 0.2 + cd / 500) + ")"; ctx.fillRect(cx - 50, 200 - hf, 100, hf);
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 50, 40); ctx.lineTo(cx - 50, 200); ctx.lineTo(cx + 50, 200); ctx.lineTo(cx + 50, 40); ctx.stroke();
      var nc = Math.round(Math.min(60, cr / 5)); var rnd = C4.rnd(3); for (var i = 0; i < nc; i++){ ctx.fillStyle = "#f4f7fb"; ctx.fillRect(cx - 46 + rnd() * 88, 192 - rnd() * 8, 6, 6); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1; }
      if (f.value > 0 && f.value < 95) for (i = 0; i < 4; i++){ S.draw.dot(c, cx - 30 + i * 20, 30 - ((Date.now() / 25 + i * 17) % 22), 3, "rgba(120,170,210,.5)"); }
      C4.label(c, S.fmt(V, 1) + " L", cx, 222, "#2c3a4e", 13);
      var gx = W * 0.5, gw = W * 0.45, gb = 220;
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(gx, 40); ctx.lineTo(gx, gb); ctx.lineTo(gx + gw, gb); ctx.stroke();
      var Y = function(y){ return gb - y / 450 * (gb - 40); }, X = function(p){ return gx + p / 95 * gw; };
      S.draw.line(c, gx, Y(SAT), gx + gw, Y(SAT), "#b42318", 1.5, [5, 4]); C4.tag(c, "saturation ≈ 360 g/L", gx + 4, Y(SAT) - 10, "#b42318", 12, "left");
      ctx.strokeStyle = "#1e3f8f"; ctx.lineWidth = 3; ctx.beginPath(); for (var p = 0; p <= 95; p += 1){ var vv = V0 * (1 - p / 100), cc = Math.min(c0 * V0 / vv, SAT); if (p) ctx.lineTo(X(p), Y(cc)); else ctx.moveTo(X(p), Y(cc)); } ctx.stroke();
      S.draw.dot(c, X(f.value), Y(cd), 6, "#b42318");
      C4.label(c, "c dissous (g/L)", gx + 4, 30, "#2c3a4e", 12, "left"); C4.label(c, "% évaporé →", gx + gw, gb + 18, "#2c3a4e", 12, "right");
      ro.set(0, S.fmt(V, 2) + " L"); ro.set(1, S.fmt(cd, 0) + " g/L"); ro.set(2, S.fmt(cd / 58.5, 2) + " mol/L"); ro.set(3, S.fmt(cr, 0) + " g");
      nt.set(cr > 0 ? "Saturation atteinte : le sel en excès cristallise (" + S.fmt(cr, 0) + " g sur 350 g). Sans cristallisation, c vaudrait " + S.fmt(cmax, 0) + " g/L." : "Rien ne cristallise encore : c = 350 g / " + S.fmt(V, 2) + " L = " + S.fmt(cmax, 0) + " g/L.", "");
    });
  }
});
