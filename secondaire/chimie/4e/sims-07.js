/* Chimie 4e · chapitre 7 · Réactif limitant, excès, rendement */
SFA.sim({
  id:"c4-c07-burger", ch:"c07", tag:"Classique",
  titre:"Le burger chimique",
  resume:"Une recette (2 pains + 1 steak + 2 tranches de fromage) : qui manque en premier, que reste-t-il ?",
  but:"Règle le nombre d'ingrédients. Compare, pour chacun, « combien de burgers il permet » : le plus petit nombre limite.",
  aRetenir:"Le réactif limitant est celui qui permet de faire le moins de « portions » : on divise chaque quantité par son coefficient. Les autres restent en excès.",
  piege:"Le réactif limitant n'est pas forcément celui dont on a le moins : 12 pains et 7 steaks limitent à 6 burgers à cause des pains (12 / 2 = 6), pas des steaks.",
  build:function(k, S){
    var c = k.canvas(300);
    var p = k.slider("Pains", 0, 30, 1, 12, ""), s = k.slider("Steaks", 0, 20, 1, 7, ""), f = k.slider("Tranches de fromage", 0, 30, 1, 20, "");
    var ro = k.readouts(["Burgers possibles", "Limitant", "Reste"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var q = [Math.floor(p.value / 2), s.value, Math.floor(f.value / 2)], B = Math.min.apply(0, q);
      var names = ["pains", "steaks", "fromage"], need = [2, 1, 2], have = [p.value, s.value, f.value], cols = ["#d9a05b", "#7a4a2b", "#f4c542"];
      c.clear(); var W = c.W, ctx = c.ctx, cw = Math.min(16, (W - 130) / 30);
      for (var r = 0; r < 3; r++){
        var y = 24 + r * 36; C4.label(c, names[r] + " (" + need[r] + " par burger)", 8, y - 12, "#2c3a4e", 12, "left");
        for (var i = 0; i < have[r]; i++){ ctx.fillStyle = i < B * need[r] ? cols[r] : "rgba(160,170,185,.35)"; ctx.fillRect(8 + i * (cw + 1), y - 4, cw, 18); if (i >= B * need[r]){ ctx.strokeStyle = cols[r]; ctx.strokeRect(8 + i * (cw + 1) + .5, y - 3.5, cw - 1, 17); } }
        C4.label(c, S.fmt(have[r] / need[r], 1) + " burgers", W - 8, y + 6, q[r] === B ? "#b42318" : "#5f6b7a", 12, "right");
      }
      var by = 160; C4.label(c, "Burgers préparés : " + B, 8, by, "#1e3f8f", 14, "left");
      for (i = 0; i < Math.min(B, 14); i++){ var bx = 14 + (i % 14) * ((W - 28) / 14), by2 = by + 26 + Math.floor(i / 14) * 30; ctx.fillStyle = "#d9a05b"; ctx.fillRect(bx, by2, 14, 5); ctx.fillStyle = "#7a4a2b"; ctx.fillRect(bx, by2 + 5, 14, 5); ctx.fillStyle = "#d9a05b"; ctx.fillRect(bx, by2 + 10, 14, 5); }
      C4.label(c, "équation : 2 P + 1 S + 2 F → 1 B", 8, 260, "#5f6b7a", 12, "left");
      C4.label(c, "gris : ingrédients qui restent", 8, 282, "#5f6b7a", 12, "left");
      var lim = []; q.forEach(function(v, i){ if (v === B) lim.push(names[i]); });
      var rest = [have[0] - 2 * B, have[1] - B, have[2] - 2 * B];
      ro.set(0, B); ro.set(1, lim.join(" et ")); ro.set(2, rest[0] + " p. · " + rest[1] + " s. · " + rest[2] + " f.");
      nt.set(B === 0 ? "Impossible de faire un burger : il manque au moins un ingrédient." : "Il manque d'abord : " + lim.join(" / ") + ". Les autres ingrédients sont « en excès ».", B === 0 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id:"c4-c07-melange", ch:"c07", tag:"Original",
  titre:"Mélange de réactifs : qui est limitant ?",
  resume:"Deux masses de réactifs, une équation : compare n / coefficient pour trouver le limitant et ce qui reste.",
  but:"Choisis une réaction et deux masses. Regarde les barres « n / coefficient » : la plus petite désigne le réactif limitant.",
  aRetenir:"Pour chaque réactif : n = m / M puis n / coefficient. Le plus petit rapport désigne le limitant ; ξ_max est ce rapport. Excès restant : n − coefficient × ξ_max.",
  piege:"Avec 10 g de magnésium et 8 g de dioxygène (2 Mg + O₂), c'est le magnésium le limitant, alors qu'il y a plus de grammes de Mg que de O₂ !",
  build:function(k, S){
    var c = k.canvas(300);
    var keys = ["mgo","eau","nh3","ch4","fe","al","fes","zn","mghcl","acid"];
    var rx = k.select("Réaction", keys.map(function(x){ return [x, C4.REAC[x].nom]; }), "mgo");
    var a = k.slider("Masse du réactif 1", 0.5, 100, 0.5, 10, "g"), b = k.slider("Masse du réactif 2", 0.5, 100, 0.5, 8, "g");
    var ro = k.readouts(["Limitant", "ξ max", "Produit principal", "Excès qui reste"]);
    var nt = k.note("", "");
    k.draw(function(){
      var e = C4.REAC[rx.value], m = [a.value, b.value], M = e.r.map(function(t){ return C4.M(t[1]); }), n = [m[0] / M[0], m[1] / M[1]], rt = [n[0] / e.r[0][0], n[1] / e.r[1][0]];
      var xm = Math.min(rt[0], rt[1]), li = rt[0] <= rt[1] ? 0 : 1, eq = Math.abs(rt[0] - rt[1]) < 1e-9, ex = 1 - li;
      c.clear(); var W = c.W, ctx = c.ctx, mx = Math.max(rt[0], rt[1]);
      C4.label(c, C4.eq(rx.value).replace(/<\/?sub>/g, ""), W / 2, 14, "#2c3a4e", 13);
      C4.label(c, "n / coefficient (mol)", 8, 40, "#5f6b7a", 12, "left");
      e.r.forEach(function(t, i){
        var y = 56 + i * 40, w = (W - 130) * rt[i] / mx; ctx.fillStyle = i === li ? "#b42318" : "#8a95a3"; ctx.fillRect(100, y, Math.max(2, w), 24);
        C4.label(c, C4.uni(t[1]) + " (" + S.fmt(m[i], 1) + " g)", 8, y + 12, "#0f1b2d", 12, "left");
        C4.tag(c, S.fmt(n[i], 3) + " / " + t[0] + " = " + S.fmt(rt[i], 3), 104, y + 12, "#fff", 12, "left");
      });
      /* avant / après en grammes */
      var sp = e.r.map(function(t, i){ return {f:t[1], m0:m[i], m1:(n[i] - t[0] * xm) * M[i]}; }).concat(e.p.map(function(t){ return {f:t[1], m0:0, m1:t[0] * xm * C4.M(t[1])}; }));
      var mxm = Math.max.apply(0, sp.map(function(s){ return Math.max(s.m0, s.m1); })) || 1, cw = (W - 20) / sp.length, base = 262, hs = 100 / mxm;
      sp.forEach(function(s, i){ var x0 = 10 + i * cw;
        ctx.fillStyle = "#dfe4ea"; ctx.fillRect(x0 + cw * 0.1, base - s.m0 * hs, cw * 0.36, s.m0 * hs);
        ctx.fillStyle = i < e.r.length ? "#b42318" : "#2e6b55"; ctx.fillRect(x0 + cw * 0.5, base - s.m1 * hs, cw * 0.36, s.m1 * hs);
        C4.label(c, S.fmt(s.m1, 1), x0 + cw * 0.68, base - s.m1 * hs - 8, "#0f1b2d", 11); C4.label(c, C4.uni(s.f), x0 + cw / 2, base + 14, "#0f1b2d", 12); });
      C4.label(c, "masses (g) : gris = avant, couleur = après", W / 2, 290, "#5f6b7a", 12);
      var pr = e.p[0], mp = pr[0] * xm * C4.M(pr[1]), left = (n[ex] - e.r[ex][0] * xm) * M[ex];
      ro.set(0, eq ? "aucun (proportions exactes)" : C4.sub(e.r[li][1])); ro.set(1, S.fmt(xm, 3) + " mol"); ro.set(2, C4.sub(pr[1]) + " : " + S.fmt(mp, 2) + " g"); ro.set(3, eq ? "0 g" : C4.sub(e.r[ex][1]) + " : " + S.fmt(left, 2) + " g");
      nt.set(eq ? "Les réactifs sont dans les proportions exactes de l'équation : ils sont consommés ensemble." : "Limitant : " + C4.sub(e.r[li][1]) + ". Comparer les grammes ne suffit pas : " + (li === (m[0] <= m[1] ? 0 : 1) ? "ici, le réactif de plus petite masse est aussi le limitant, mais ce n'est pas une règle." : "ici, le limitant n'est pas celui qu'on a en plus petite masse."), "");
    });
  }
});

SFA.sim({
  id:"c4-c07-rendement", ch:"c07", tag:"Rendement",
  titre:"Rendement d'une synthèse d'aspirine",
  resume:"Acide salicylique + anhydride acétique → aspirine + acide acétique : compare ce que tu pèses avec le maximum possible.",
  but:"Choisis les quantités de réactifs, détermine le limitant, puis règle la masse d'aspirine réellement obtenue.",
  aRetenir:"Rendement = masse (ou quantité) obtenue / masse (ou quantité) théorique × 100. La quantité théorique se calcule avec le réactif limitant, comme si la réaction était totale.",
  piege:"Un rendement supérieur à 100 % est impossible : il signale un produit encore humide ou impur. Et un rendement de 70 % ne veut pas dire que 30 % de la masse a disparu : les atomes sont ailleurs (pertes, produits secondaires).",
  build:function(k, S){
    var c = k.canvas(260);
    var ms = k.slider("Acide salicylique C₇H₆O₃", 1, 5, 0.1, 2, "g");
    var va = k.slider("Anhydride acétique C₄H₆O₃", 0.5, 8, 0.5, 5, "mL");
    var mo = k.slider("Aspirine réellement obtenue", 0, 5, 0.05, 1.85, "g");
    var ro = k.readouts(["Limitant", "Théorique", "Rendement"]);
    var nt = k.note("", "");
    k.draw(function(){
      var ns = ms.value / 138, na = va.value * 1.08 / 102, li = ns <= na ? "acide salicylique" : "anhydride acétique", xm = Math.min(ns, na), th = xm * 180, rd = mo.value / th * 100;
      c.clear(); var W = c.W, sc = 200 / Math.max(th, mo.value, 0.01) * 0.85;
      C4.rr(c.ctx, 40, 235 - th * sc, 90, th * sc, 4); c.ctx.fillStyle = "#dfe4ea"; c.ctx.fill(); c.ctx.strokeStyle = "#8a95a3"; c.ctx.stroke();
      C4.rr(c.ctx, 160, 235 - mo.value * sc, 90, Math.max(2, mo.value * sc), 4); c.ctx.fillStyle = rd > 100.5 ? "#b42318" : "#2e6b55"; c.ctx.fill();
      C4.label(c, "théorique", 85, 250, "#2c3a4e", 12); C4.label(c, S.fmt(th, 2) + " g", 85, 230 - th * sc, "#2c3a4e", 13);
      C4.label(c, "obtenu", 205, 250, "#2c3a4e", 12); C4.label(c, S.fmt(mo.value, 2) + " g", 205, 230 - mo.value * sc, "#2c3a4e", 13);
      C4.label(c, S.fmt(rd, 0) + " %", W * 0.78, 110, rd > 100.5 ? "#b42318" : "#1e3f8f", 34);
      C4.label(c, "n(acide sal.) = " + S.fmt(ns * 1000, 1) + " mmol", W * 0.55, 160, "#5f6b7a", 12, "left"); C4.label(c, "n(anhydride) = " + S.fmt(na * 1000, 1) + " mmol", W * 0.55, 180, "#5f6b7a", 12, "left");
      ro.set(0, li); ro.set(1, S.fmt(th, 2) + " g"); ro.set(2, S.fmt(rd, 1) + " %");
      nt.set(rd > 100.5 ? "Rendement > 100 % : impossible. Le produit est sans doute humide ou impur." : rd > 85 ? "Très bon rendement pour une synthèse au laboratoire." : "Les pertes viennent des transferts, de la recristallisation, des produits secondaires.", rd > 100.5 ? "warn" : "");
    });
    k.note("Données : M(acide salicylique) = 138 ; M(anhydride acétique) = 102 ; M(aspirine) = 180 g/mol ; masse volumique de l'anhydride 1,08 g/mL ; équation 1 : 1 → 1.", "");
  }
});

SFA.sim({
  id:"c4-c07-cloche", ch:"c07", tag:"Animation",
  titre:"La flamme sous la cloche",
  resume:"Un brûleur à méthane dans un bocal fermé : la flamme s'éteint quand un réactif est épuisé.",
  but:"Choisis le volume du bocal et la quantité de méthane. Lance la combustion et observe lequel des deux réactifs disparaît en premier.",
  aRetenir:"Quand la réaction cesse, c'est qu'un réactif est épuisé : le limitant. Ici, soit le méthane, soit le dioxygène de l'air du bocal (21 % du volume).",
  piege:"Modèle idéalisé : dans un vrai bocal, la flamme s'éteint dès que la teneur en O₂ tombe vers 15 %, bien avant l'épuisement total. Ce n'est pas un réactif « épuisé » à 100 %, mais l'ordre de grandeur du raisonnement reste valable.",
  build:function(k, S){
    var c = k.canvas(280);
    var V = k.slider("Volume d'air du bocal", 0.5, 5, 0.5, 1, "L");
    var F = k.slider("Méthane brûlé (volume gazeux à 20 °C)", 20, 400, 10, 150, "mL");
    var ro = k.readouts(["n(O₂) initial", "n(CH₄) initial", "Limitant", "CO₂ formé"]);
    var nt = k.note("", "");
    var st = {p:1}, lp = k.loop(function(dt){ st.p = Math.min(1, st.p + dt / 4); if (st.p >= 1) lp.pause(); k.redraw(); });
    [V.el, F.el].forEach(function(e){ e.addEventListener("input", function(){ st.p = 1; }); });
    k.button("▶ Allumer", function(){ st.p = 0; lp.play(); }, true); k.button("↺ Remettre", function(){ lp.pause(); st.p = 0; });
    k.draw(function(){
      var nO = 0.21 * V.value / 24, nC = F.value / 1000 / 24, xm = Math.min(nC, nO / 2), li = nC < nO / 2 ? "CH₄" : nC > nO / 2 ? "O₂" : "aucun", x = xm * st.p;
      c.clear(); var W = c.W, ctx = c.ctx, cx = W * 0.25;
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.fillStyle = "rgba(200,225,240,.3)"; C4.rr(ctx, cx - 62, 30, 124, 190, 14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(cx - 5, 190, 10, 30);
      var alive = st.p < 1 && st.p > 0, fl = alive ? 38 : (st.p === 0 ? 20 : 0), jit = alive ? Math.sin(Date.now() / 90) * 3 : 0;
      if (fl > 0){ ctx.fillStyle = "#f4a640"; ctx.beginPath(); ctx.moveTo(cx - 8, 190); ctx.quadraticCurveTo(cx + jit, 190 - fl * 1.6, cx + 8, 190); ctx.fill(); }
      C4.label(c, st.p === 0 ? "prête" : alive ? "flamme" : "flamme éteinte", cx, 240, alive ? "#b45309" : "#5f6b7a", 13);
      var bx = W * 0.5, bw = (W - bx - 20) / 3, base = 235, hs = 160 / Math.max(nO, nC * 2, 1e-9) / 1.1;
      var vals = [[nO - 2 * x, "O₂", "#1e3f8f", nO], [nC - x, "CH₄", "#b42318", nC], [x, "CO₂", "#2e6b55", 0]];
      vals.forEach(function(v, i){ var xx = bx + i * bw; ctx.fillStyle = "#e6eaf0"; ctx.fillRect(xx + 4, base - v[3] * hs, bw - 14, v[3] * hs); ctx.fillStyle = v[2]; ctx.fillRect(xx + 4, base - Math.max(0, v[0]) * hs, bw - 14, Math.max(0, v[0]) * hs); C4.label(c, v[1], xx + bw / 2 - 3, base + 14, "#0f1b2d", 12); C4.label(c, S.fmt(Math.max(0, v[0]) * 1000, 1), xx + bw / 2 - 3, base - Math.max(0, v[0]) * hs - 9, "#0f1b2d", 11); });
      C4.label(c, "mmol", bx - 2, 50, "#5f6b7a", 12, "left");
      ro.set(0, S.fmt(nO * 1000, 2) + " mmol"); ro.set(1, S.fmt(nC * 1000, 2) + " mmol"); ro.set(2, li); ro.set(3, S.fmt(xm * 1000, 2) + " mmol (" + S.fmt(xm * 24000, 0) + " mL)");
      nt.set(li === "O₂" ? "Il y a plus de méthane que le dioxygène n'en peut brûler : O₂ est limitant, il reste " + S.fmt((nC - xm) * 24000, 0) + " mL de CH₄." : li === "CH₄" ? "Le méthane est limitant : la flamme s'éteint faute de combustible, il reste " + S.fmt((nO - 2 * xm) * 1000, 2) + " mmol de O₂." : "Proportions exactes.", "");
    });
  }
});
