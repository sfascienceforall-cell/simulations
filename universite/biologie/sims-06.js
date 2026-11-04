/* Biologie BA1 · chapitre 6 : métabolisme énergétique */
(function(){
var P = function(S){ return S.draw.palette; };

/* 1. Bilan de l'oxydation complète du glucose */
SFA.sim({
  id:"ub-c06-bilan-glucose", ch:"c06", tag:"Bilan",
  titre:"Bilan ATP d'une molécule de glucose",
  resume:"D'où viennent les 30 à 32 ATP : substrat, NADH, FADH₂, navettes.",
  but:"Choisis la navette des NADH cytosoliques et les rendements ATP par coenzyme, puis regarde d'où vient chaque ATP.",
  aRetenir:"Par glucose : 4 ATP (ou GTP) de phosphorylation au niveau du substrat (2 nets en glycolyse + 2 au cycle de Krebs), 10 NADH et 2 FADH₂. Avec 2,5 ATP/NADH et 1,5 ATP/FADH₂ : 4 + 25 + 3 = 32 ATP (navette malate-aspartate) ; avec la navette glycérol-phosphate, les 2 NADH cytosoliques ne valent plus que 1,5 : 30 ATP. Les anciennes valeurs 3 et 2 donnaient 36 à 38.",
  piege:"Les 2 NADH de la glycolyse sont cytosoliques : ils ne traversent pas la membrane interne, leur rendement dépend de la navette. Et le carbone : 2 CO₂ viennent de la pyruvate déshydrogénase, 4 du cycle de Krebs, 0 de la chaîne respiratoire (l'O₂ finit en H₂O).",
  build:function(k,S){
    var c = k.canvas(330), pal = P(S);
    var nav = k.seg("Navette des NADH cytosoliques", [["ma","Malate-aspartate"],["gp","Glycérol-phosphate"]], "ma");
    var pn = k.slider("ATP par NADH (matrice)", 1.5, 3, 0.1, 2.5, "");
    var pf = k.slider("ATP par FADH₂", 1, 2, 0.1, 1.5, "");
    var ro = k.readouts(["ATP substrat","ATP oxydatif","Total / glucose","CO₂ libérés"]);
    k.draw(function(){
      c.clear();
      var n = pn.value, f = pf.value, gp = nav.value === "gp";
      var cyt = gp ? 2 * f : 2 * n;
      var items = [["Substrat (glycolyse 2 + Krebs 2)", 4, pal.amber], ["NADH glycolyse (×2)", cyt, pal.teal], ["NADH pyruvate DH (×2)", 2 * n, pal.acc], ["NADH Krebs (×6)", 6 * n, pal.violet], ["FADH₂ Krebs (×2)", 2 * f, pal.green]];
      var tot = 0; items.forEach(function(it){ tot += it[1]; });
      var x0 = 20, wmax = c.W - 40, sc = wmax / 40, y = 60, x = x0;
      S.draw.text(c, "Total : " + S.fmt(tot, 1) + " ATP par glucose", c.W / 2, 22, {size:16});
      items.forEach(function(it){
        var w = it[1] * sc; c.ctx.fillStyle = it[2]; c.ctx.fillRect(x, y, w, 46);
        if (w > 26) S.draw.text(c, S.fmt(it[1], 1), x + w / 2, y + 23, {color:"#fff", size:13});
        x += w;
      });
      var ly = 130;
      items.forEach(function(it, i){
        c.ctx.fillStyle = it[2]; c.ctx.fillRect(x0, ly + i * 24, 14, 14);
        S.draw.text(c, it[0] + " : " + S.fmt(it[1], 1) + " ATP", x0 + 22, ly + i * 24 + 7, {align:"left", size:12, weight:600});
      });
      S.draw.text(c, "Carbone : C₆ → 2 pyruvate (C₃) → 2 CO₂ + 2 acétyl (C₂) → 4 CO₂ (Krebs)", c.W / 2, 275, {size:12, weight:600, color:pal.grey});
      S.draw.text(c, "10 NADH + 2 FADH₂ réoxydés par la chaîne respiratoire · bilan : C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O", c.W / 2, 298, {size:11, weight:600, color:pal.grey});
      ro.set(0, "4"); ro.set(1, S.fmt(tot - 4, 1)); ro.set(2, S.fmt(tot, 1)); ro.set(3, "6");
    });
  }
});

/* 2. Chimiosmose */
SFA.sim({
  id:"ub-c06-chimiosmose", ch:"c06", tag:"Chimiosmose",
  titre:"Force protonmotrice et ATP synthase",
  resume:"Δp = ΔΨ + 61,5·ΔpH : assez d'énergie pour fabriquer l'ATP ? Découplant, oligomycine, cyanure.",
  but:"Règle le gradient de la membrane interne, ajoute un inhibiteur ou un découplant, et compare l'énergie fournie par les protons à celle qu'exige la synthèse d'ATP.",
  aRetenir:"Force protonmotrice (37 °C) : Δp = ΔΨ + 2,303·RT/F·ΔpH = ΔΨ + 61,5 mV × ΔpH, avec ΔΨ la valeur absolue du potentiel (matrice négative) et ΔpH = pH matrice − pH espace intermembranaire. Les protons qui rentrent fournissent n·F·Δp par ATP (n ≈ 3,7 H⁺ : ≈ 2,7 pour l'ATP synthase humaine + 1 pour le transport du phosphate). Même pont qu'en chimie avec l'équation de Nernst (électrochimie).",
  piege:"Un découplant (DNP, UCP1) ne bloque pas la chaîne : il la fait tourner plus vite (plus d'O₂ consommé) mais l'énergie part en chaleur. L'oligomycine, elle, bloque l'ATP synthase : Δp monte et la respiration ralentit (contrôle respiratoire). Modèle simplifié : le gradient est imposé, pas calculé à partir des flux.",
  build:function(k,S){
    var c = k.canvas(320), pal = P(S);
    var dph = k.slider("ΔpH (matrice − espace)", 0, 1.2, 0.05, 0.5, "");
    var dpsi = k.slider("ΔΨ (valeur absolue)", 0, 200, 5, 150, "mV");
    var dnp = k.slider("Découplant (fuite de protons)", 0, 100, 5, 0, "%");
    var dg = k.slider("ΔG de synthèse de l'ATP (cellule)", 40, 70, 1, 55, "kJ/mol");
    var cond = k.seg("Condition", [["n","Normale"],["o","Oligomycine"],["c","Cyanure"]], "n");
    var ro = k.readouts(["Δp","n·F·Δp par ATP","Marge","État"]);
    var note = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var d = dnp.value / 100, n = 3.7, F = 96.485;
      var dp = (dpsi.value + 61.5 * dph.value) * (1 - d);
      if (cond.value === "c") dp = 0;
      var E = n * F * dp / 1000, marge = E - dg.value;
      /* schéma de membrane */
      var mx = 30, mw = c.W - 60, my = 120;
      c.ctx.fillStyle = "#fff4e0"; c.ctx.fillRect(mx, 40, mw, my - 40 - 8);
      c.ctx.fillStyle = "#e6f0ff"; c.ctx.fillRect(mx, my + 8, mw, 70);
      c.ctx.fillStyle = pal.grey; c.ctx.fillRect(mx, my - 8, mw, 16);
      S.draw.text(c, "Espace intermembranaire (H⁺ : " + (cond.value === "c" ? "peu" : "beaucoup") + ")", mx + 6, 54, {align:"left", size:11, weight:600});
      S.draw.text(c, "Matrice", mx + 6, my + 70, {align:"left", size:11, weight:600});
      var nH = cond.value === "c" ? 3 : Math.round(8 + 22 * Math.min(1, dp / 250));
      var rnd = 7;
      for (var i = 0; i < nH; i++){ rnd = (rnd * 9301 + 49297) % 233280; var px = mx + 20 + (rnd / 233280) * (mw - 40); rnd = (rnd * 9301 + 49297) % 233280; var py = 62 + (rnd / 233280) * 40; S.draw.text(c, "H⁺", px, py, {size:10, color:pal.red}); }
      var sx = mx + mw * 0.55;
      c.ctx.fillStyle = pal.green; c.ctx.fillRect(sx - 20, my - 8, 40, 16); c.ctx.beginPath(); c.ctx.arc(sx, my + 28, 18, 0, 6.3); c.ctx.fill();
      S.draw.text(c, "ATP synthase", sx, my + 28, {color:"#fff", size:9});
      if (cond.value !== "c") S.draw.arrow(c, sx + 28, my - 30, sx + 28, my + 6, pal.red, 2);
      /* barres d'énergie */
      var by = 235, bw = c.W - 190, sc = bw / 100;
      S.draw.text(c, "Énergie par ATP (kJ/mol)", 20, by - 20, {align:"left", size:12});
      c.ctx.fillStyle = "#e3e7ed"; c.ctx.fillRect(150, by - 8, bw, 16);
      c.ctx.fillStyle = marge >= 0 ? pal.green : pal.red; c.ctx.fillRect(150, by - 8, Math.min(100, E) * sc, 16);
      S.draw.text(c, "fournie", 20, by, {align:"left", size:11, weight:600});
      S.draw.line(c, 150 + dg.value * sc, by - 22, 150 + dg.value * sc, by + 30, pal.ink, 2, [4, 3]);
      S.draw.text(c, "exigée : " + dg.value, 150 + dg.value * sc, by + 40, {size:11});
      var state = cond.value === "o" ? "ATP synthase bloquée" : (marge >= 0 ? "Synthèse d'ATP" : "Synthèse impossible (hydrolyse)");
      ro.set(0, S.fmt(dp, 0) + " mV"); ro.set(1, S.fmt(E, 1) + " kJ"); ro.set(2, S.fmt(marge, 1) + " kJ"); ro.set(3, state);
      if (cond.value === "o") note.set("Oligomycine : les protons ne peuvent plus rentrer par l'ATP synthase. Δp reste élevé, la chaîne se heurte à ce gradient et l'O₂ consommé chute (contrôle respiratoire).", "warn");
      else if (cond.value === "c") note.set("Cyanure : le complexe IV est bloqué, plus de pompage de H⁺ en aval : Δp s'effondre, plus d'ATP mitochondrial.", "warn");
      else if (marge < 0) note.set("Avec cette fuite, n·F·Δp est inférieur au ΔG exigé : l'ATP synthase ne peut plus synthétiser (elle pourrait même hydrolyser l'ATP).", "warn");
      else if (d > 0) note.set("Découplage partiel : la chaîne tourne, le gradient est dissipé ; l'énergie de l'oxydation part en chaleur (thermogenèse).", "warn");
      else note.set("Situation normale : l'énergie des protons dépasse celle exigée pour synthétiser l'ATP.", "ok");
    });
  }
});

/* 3. Fermentation contre respiration */
SFA.sim({
  id:"ub-c06-fermentation", ch:"c06", tag:"Effort",
  titre:"Fermentation lactique et respiration : le prix de l'anaérobie",
  resume:"Pour un même besoin en ATP, combien de glucose et de lactate selon l'oxygénation.",
  but:"Fixe le besoin en ATP et la part produite sans oxygène ; lis la consommation de glucose et le lactate formé.",
  aRetenir:"Fermentation lactique : 2 ATP par glucose et 2 lactates ; respiration : 30 à 32 ATP par glucose. Si une fraction f de l'ATP vient de la fermentation, la consommation de glucose est multipliée par 1 + (Y/2 − 1)·f, soit 1 + 15·f pour Y = 32. Le lactate formé vaut exactement f × (ATP demandé) en mmol (1 lactate par ATP). Rôle de la fermentation : régénérer le NAD⁺ pour que la glycolyse continue sans O₂.",
  piege:"La fermentation ne produit pas d'ATP par elle-même : c'est la glycolyse qui en fait 2 ; la réduction du pyruvate en lactate sert uniquement à régénérer le NAD⁺. L'acidification du muscle vient surtout de l'hydrolyse de l'ATP qui libère des H⁺ : le lactate est le marqueur, pas la seule cause.",
  build:function(k,S){
    var c = k.canvas(300), pal = P(S);
    var d = k.slider("Besoin en ATP", 10, 200, 10, 100, "mmol/min");
    var f = k.slider("Part d'ATP produite sans O₂", 0, 100, 5, 0, "%");
    var y = k.slider("Rendement aérobie", 30, 32, 1, 32, "ATP/glucose");
    var ro = k.readouts(["Glucose","Lactate","Facteur / aérobie","ATP moyen par glucose"]);
    k.draw(function(){
      c.clear();
      var ff = f.value / 100, D = d.value, Y = y.value;
      var g = D * ((1 - ff) / Y + ff / 2), lac = ff * D, fac = g / (D / Y);
      var ax = S.draw.axes(c, {x0:0, x1:100, y0:0, y1:Y / 2 + 1, xl:"% sans O₂", yl:"× glucose", stepX:10, stepY:Y > 31 ? 4 : 4});
      S.draw.fn(c, ax, function(x){ return 1 + (Y / 2 - 1) * x / 100; }, pal.acc);
      S.draw.dot(c, ax.X(f.value), ax.Y(fac), 6, pal.red);
      S.draw.text(c, "×" + S.fmt(fac, 1), ax.X(f.value) + 10, ax.Y(fac) - 12, {align:"left", color:pal.red});
      ro.set(0, S.fmt(g, 2) + " mmol/min"); ro.set(1, S.fmt(lac, 1) + " mmol/min"); ro.set(2, "×" + S.fmt(fac, 2)); ro.set(3, S.fmt(D / g, 1));
    });
  }
});

/* 4. Photosynthèse */
SFA.sim({
  id:"ub-c06-photosynthese", ch:"c06", tag:"Photosynthèse",
  titre:"Réactions claires et cycle de Calvin : quel facteur limite ?",
  resume:"3 ATP + 2 NADPH par CO₂ fixé : équilibrer ATP/NADPH, lumière, CO₂.",
  but:"Fais varier la lumière, le flux cyclique et le CO₂ disponible : le cycle de Calvin est freiné par le plus rare des trois.",
  aRetenir:"Calvin : chaque CO₂ fixé coûte 3 ATP et 2 NADPH (soit 18 ATP + 12 NADPH par glucose). Le flux linéaire d'électrons donne ≈ 1,3 ATP par NADPH (valeur théorique ≈ 1,29 pour des ATP synthases à 14 sous-unités c) : il manque ≈ 0,2 ATP/NADPH, comblé en partie par le flux cyclique autour du photosystème I (ATP sans NADPH ni O₂).",
  piege:"L'O₂ vient de l'eau (photolyse), pas du CO₂. La phase « sombre » n'est pas indépendante de la lumière : elle consomme l'ATP et le NADPH des réactions claires. Modèle simplifié : pas de photorespiration ni de régulation stomatique.",
  build:function(k,S){
    var c = k.canvas(300), pal = P(S);
    var L = k.slider("Lumière (NADPH produit)", 0, 10, 0.5, 6, "u/s");
    var cy = k.slider("ATP cyclique ajouté", 0, 0.6, 0.05, 0.2, "ATP/NADPH");
    var co = k.slider("CO₂ disponible", 0, 6, 0.25, 6, "u/s");
    var ro = k.readouts(["ATP produit","ATP/NADPH","CO₂ fixé","Facteur limitant"]);
    k.draw(function(){
      c.clear();
      var nadph = L.value, atp = L.value * (1.29 + cy.value);
      var a = nadph / 2, b = atp / 3, cc = co.value, v = Math.min(a, b, cc);
      var names = ["NADPH (÷2)","ATP (÷3)","CO₂ présent"], vals = [a, b, cc], cols = [pal.acc, pal.amber, pal.green];
      var mx = Math.max(5.5, a, b, cc), bw = c.W - 190, i, lim = -1, mn = Math.min(a, b, cc);
      for (i = 0; i < 3; i++) if (Math.abs(vals[i] - mn) < 1e-9 && lim < 0) lim = i;
      var ties = vals.filter(function(x){ return Math.abs(x - mn) < 1e-9; }).length;
      for (i = 0; i < 3; i++){
        var y = 50 + i * 60;
        S.draw.text(c, names[i], 20, y, {align:"left", size:12});
        c.ctx.fillStyle = "#e3e7ed"; c.ctx.fillRect(130, y - 12, bw, 24);
        c.ctx.fillStyle = Math.abs(vals[i] - mn) < 1e-9 ? pal.red : cols[i]; c.ctx.fillRect(130, y - 12, vals[i] / mx * bw, 24);
        S.draw.text(c, S.fmt(vals[i], 2), 136 + vals[i] / mx * bw, y, {align:"left", size:11});
      }
      S.draw.text(c, "CO₂ fixables par seconde = le plus petit des trois (en rouge)", 20, 240, {align:"left", size:12, weight:600, color:pal.grey});
      S.draw.text(c, "Glucose équivalent : " + S.fmt(v / 6, 2) + " u/s (6 CO₂ par glucose)", 20, 266, {align:"left", size:12, weight:600});
      ro.set(0, S.fmt(atp, 2)); ro.set(1, nadph > 0 ? S.fmt(atp / nadph, 2) : "—"); ro.set(2, S.fmt(v, 2));
      ro.set(3, nadph === 0 ? "pas de lumière" : ties > 1 ? "équilibre ATP/NADPH/CO₂" : ["NADPH","ATP","CO₂"][lim]);
    });
  }
});

/* 5. Régulation : nourri / jeûne */
SFA.sim({
  id:"ub-c06-jeune", ch:"c06", tag:"Régulation",
  titre:"De l'état nourri au jeûne : glycogène puis néoglucogenèse",
  resume:"Qui fournit le glucose du foie au fil des heures ? Modèle qualitatif, ordres de grandeur.",
  but:"Déplace le curseur du temps et regarde la bascule glycogénolyse → néoglucogenèse, avec les hormones.",
  aRetenir:"Après les repas, l'insuline domine : stockage (glycogène, lipides). Le jeûne court fait monter le glucagon : le foie libère du glucose par glycogénolyse, puis, quand le glycogène hépatique (≈ 80 à 100 g) s'épuise, par néoglucogenèse (lactate, glycérol, acides aminés). Au-delà de 1 à 2 jours, les corps cétoniques épargnent le glucose au cerveau.",
  piege:"Le glycogène musculaire n'alimente pas la glycémie (pas de glucose-6-phosphatase dans le muscle). Les acides gras ne donnent pas de glucose net chez l'être humain (pas de conversion nette de l'acétyl-CoA en oxaloacétate). Les valeurs du modèle sont des ordres de grandeur, pas des mesures individuelles.",
  build:function(k,S){
    var c = k.canvas(320), pal = P(S);
    var t = k.slider("Temps depuis la fin de la digestion", 0, 72, 1, 12, "h");
    var g0 = k.slider("Glycogène hépatique initial", 50, 120, 10, 90, "g");
    var ro = k.readouts(["Glycogène restant","Glycogénolyse","Néoglucogenèse","Hormones"]);
    k.draw(function(){
      c.clear();
      var dt = 0.05, G = g0.value, ts = [], gl = [], ng = [], Gs = [], cur = null;
      for (var x = 0; x <= 72.0001; x += dt){
        var D = x <= 24 ? 8.4 : 8.4 - 3.4 * (x - 24) / 48;
        var s = D * G / (G + 30); if (s * dt > G) s = G / dt;
        ts.push(x); gl.push(s); ng.push(D - s); Gs.push(G);
        if (cur === null && x >= t.value - 1e-9) cur = ts.length - 1;
        G -= s * dt;
      }
      if (cur === null) cur = ts.length - 1;
      var ax = S.draw.axes(c, {x0:0, x1:72, y0:0, y1:10, xl:"h", yl:"g de glucose/h", stepX:12, stepY:2});
      var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      ctx.fillStyle = "rgba(180,83,9,.35)"; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0));
      for (var i = 0; i < ts.length; i += 4) ctx.lineTo(ax.X(ts[i]), ax.Y(gl[i])); ctx.lineTo(ax.X(72), ax.Y(0)); ctx.fill();
      ctx.fillStyle = "rgba(30,63,143,.35)"; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(gl[0]));
      for (i = 0; i < ts.length; i += 4) ctx.lineTo(ax.X(ts[i]), ax.Y(gl[i] + ng[i]));
      for (i = ts.length - 1; i >= 0; i -= 4) ctx.lineTo(ax.X(ts[i]), ax.Y(gl[i])); ctx.fill();
      ctx.restore();
      S.draw.line(c, ax.X(ts[cur]), ax.T, ax.X(ts[cur]), ax.B, pal.red, 2, [4, 3]);
      S.draw.text(c, "glycogénolyse", ax.X(6), ax.Y(2), {color:pal.amber, size:11});
      S.draw.text(c, "néoglucogenèse", ax.X(48), ax.Y(3), {color:pal.acc, size:11});
      var out = gl[cur] + ng[cur];
      ro.set(0, S.fmt(Gs[cur], 0) + " g"); ro.set(1, S.fmt(gl[cur], 1) + " g/h (" + S.fmt(100 * gl[cur] / out, 0) + " %)"); ro.set(2, S.fmt(ng[cur], 1) + " g/h (" + S.fmt(100 * ng[cur] / out, 0) + " %)");
      ro.set(3, ts[cur] < 6 ? "glucagon↑ / insuline↓" : ts[cur] < 24 ? "glucagon↑, cortisol" : "glucagon↑↑, corps cétoniques");
    });
  }
});
})();
