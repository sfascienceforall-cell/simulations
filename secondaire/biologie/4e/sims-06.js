/* Biologie 4e · chapitre 6 · Respiration cellulaire et fermentation */
SFA.sim({
  id:"b4-c06-bilan", ch:"c06", tag:"Classique · bilan",
  titre:"Respiration ou fermentation : le bilan en ATP",
  resume:"Un même glucose rapporte ≈ 30 ATP avec dioxygène, 2 ATP sans : règle l'oxygène et compare.",
  but:"Choisis le nombre de glucoses, la part qui peut être respirée (oxygène disponible) et le type de fermentation. Lis ATP, CO₂, O₂ et rendement.",
  aRetenir:"La glycolyse (cytoplasme) donne toujours 2 ATP nets par glucose. Avec dioxygène, les mitochondries poursuivent (Krebs, chaîne respiratoire) : ≈ 30 ATP au total et 6 CO₂ + 6 H₂O. Sans dioxygène, le pyruvate subit une fermentation (lactique ou alcoolique) : seulement 2 ATP, et l'énergie reste dans le lactate ou l'éthanol.",
  piege:"Les manuels comptent souvent 36 ou 38 ATP (anciens comptages) ; les mesures actuelles donnent ≈ 30 à 32 : on utilise 30. Rendement = énergie des ATP (≈ 30,5 kJ/mol) ÷ énergie du glucose (≈ 2 870 kJ/mol).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.2});
    var n = k.slider("Glucose consommé", 1, 10, 1, 1, "molécules");
    var f = k.slider("Part respirée (dioxygène disponible)", 0, 100, 5, 100, "%");
    var fe = k.seg("Fermentation de la part restante", [["l","Lactique"],["a","Alcoolique"]], "l");
    var ro = k.readouts(["ATP produits", "CO₂ libéré", "O₂ consommé", "Rendement énergétique"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, ff = f.value / 100, N = n.value, resp = N * ff, ferm = N * (1 - ff);
      var atpG = 2 * N, atpR = 28 * resp, atp = atpG + atpR;
      var co2 = 6 * resp + (fe.value === "a" ? 2 * ferm : 0), o2 = 6 * resp;
      var eff = atp * 30.5 / (N * 2870) * 100;
      var bw = (W - 40) / 3;
      function box(x, y, w, h, t1, t2, col){ B4.rr(c, x, y, w, h, 8, col, "#13233a", 1.5); B4.txt(c, t1, x + w / 2, y + 16, B4.pal.ink, 12); if (t2) B4.txt(c, t2, x + w / 2, y + 34, B4.pal.ink, 12); }
      box(W / 2 - 55, 8, 110, 42, "Glucose", S.fmt(N, 0) + " (C₆H₁₂O₆)", "rgba(254,243,199,.8)");
      S.draw.arrow(c, W / 2, 50, W / 2, 70, B4.pal.ink, 2.5);
      box(W / 2 - 110, 72, 220, 44, "Glycolyse (cytoplasme)", "+ " + S.fmt(atpG, 0) + " ATP · " + S.fmt(2 * N, 0) + " pyruvates", "rgba(219,234,254,.8)");
      S.draw.arrow(c, W * 0.3, 116, W * 0.2, 140, B4.pal.green, 2.5); S.draw.arrow(c, W * 0.7, 116, W * 0.8, 140, B4.pal.red, 2.5);
      B4.txt(c, "avec O₂ (" + S.fmt(f.value, 0) + " %)", W * 0.17, 132, B4.pal.green, 11); B4.txt(c, "sans O₂ (" + S.fmt(100 - f.value, 0) + " %)", W * 0.83, 132, B4.pal.red, 11);
      box(8, 142, W * 0.46, 76, "Mitochondrie", "+ " + S.fmt(atpR, 0) + " ATP", "rgba(220,252,231,.8)"); B4.txt(c, S.fmt(6 * resp, 0) + " CO₂ · " + S.fmt(6 * resp, 0) + " O₂ consommé", 8 + W * 0.23, 196, B4.pal.ink, 11);
      box(W * 0.52, 142, W * 0.46 - 8, 76, fe.value === "l" ? "Lactate" : "Éthanol + CO₂", "+ 0 ATP", "rgba(254,226,226,.8)"); B4.txt(c, fe.value === "l" ? S.fmt(2 * ferm, 0) + " lactates" : S.fmt(2 * ferm, 0) + " éthanols, " + S.fmt(2 * ferm, 0) + " CO₂", W * 0.52 + (W * 0.46 - 8) / 2, 196, B4.pal.ink, 11);
      var ax = S.draw.axes(c, {x0:0, x1:100, y0:0, y1:N * 32, xl:"part respirée (%)", yl:"ATP", stepX:25, stepY:N * 10, t:244, b:30, l:44});
      S.draw.fn(c, ax, function(x){ return N * (2 + 28 * x / 100); }, B4.pal.acc, 2.6);
      S.draw.dot(c, ax.X(f.value), ax.Y(atp), 7, B4.pal.red);
      ro.set(0, S.fmt(atp, 0) + " ATP"); ro.set(1, S.fmt(co2, 0)); ro.set(2, S.fmt(o2, 0)); ro.set(3, S.fmt(eff, 0) + " %");
      nt.set(f.value === 0 ? "Fermentation seule : 2 ATP par glucose (≈ 2 % de l'énergie récupérée). Il faut consommer beaucoup plus de glucose pour la même énergie." : f.value === 100 ? "Respiration complète : ≈ 30 ATP par glucose (≈ 32 % de l'énergie du glucose dans l'ATP), le reste part en chaleur." : "Régime mixte : " + S.fmt(resp, 1) + " glucose respiré(s), " + S.fmt(ferm, 1) + " fermenté(s). Même glucose, bilan bien meilleur quand le dioxygène est disponible.", f.value === 100 ? "ok" : "");
    });
  }
});

SFA.sim({
  id:"b4-c06-levures", ch:"c06", tag:"Pain et bière · animation",
  titre:"Levures : sucre, température et bulles de CO₂",
  resume:"Une pâte ou un moût en fermentation : suis le sucre, l'éthanol et le CO₂ dégagé au cours du temps.",
  but:"Choisis la quantité de sucre, la température et la présence d'O₂, puis lance. Compare avec l'équation C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂.",
  aRetenir:"En l'absence de dioxygène, les levures font une fermentation alcoolique : glucose → 2 éthanol + 2 CO₂ (+ 2 ATP). Les bulles de CO₂ font lever la pâte ; l'éthanol fait la bière. Par gramme de glucose : 0,51 g d'éthanol et 0,49 g de CO₂. La vitesse dépend de la température, avec un optimum vers 35 °C ; au-delà de ≈ 55 °C les levures meurent.",
  piege:"Avec du dioxygène, les levures respirent : plus de CO₂ par sucre (6 par glucose), mais pas d'éthanol. Modèle simplifié : même vitesse de consommation du sucre dans les deux cas, 1 s de simulation = 5 min.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.0});
    var g = k.slider("Sucre au départ", 2, 40, 2, 20, "g");
    var T = k.slider("Température", 0, 60, 1, 30, "°C");
    var ox = k.toggle("Dioxygène présent (récipient ouvert, agité)", false);
    var ro = k.readouts(["Sucre restant", "Éthanol formé", "CO₂ dégagé", "Temps écoulé"]);
    var nt = k.note("", "");
    var st = {t:0, G:g.value, h:[], bub:[]};
    function fT(t){ if (t > 55) return 0; return t < 35 ? Math.exp(-Math.pow((t - 35) / 15, 2)) : Math.exp(-Math.pow((t - 35) / 8, 2)); }
    function rst(){ st.t = 0; st.G = g.value; st.h = [[0, g.value, 0, 0]]; st.cum = 0; }
    g.el.addEventListener("input", rst);
    var lp = k.loop(function(dt){
      var h = dt * 5;       /* min */
      for (var s = 0; s < 5; s++){ var hh = h / 5, d = Math.min(st.G, 1.2 * fT(T.value) * st.G / (st.G + 3) * hh); st.G -= d; st.cum += d; }
      st.t += h;
      if (!st.last || st.t - st.last >= 2){ st.last = st.t; var ge = st.cum, e = ox.value ? 0 : ge * 0.511, co = ge * (ox.value ? 264 / 180 : 88 / 180); st.h.push([st.t, st.G, e, co]); }
      if (Math.random() < Math.min(0.9, d * 6 + 0.02) && d > 1e-6) st.bub.push({x:0.2 + Math.random() * 0.6, y:1, v:0.3 + Math.random() * 0.4});
      st.bub.forEach(function(b){ b.y -= b.v * dt; }); st.bub = st.bub.filter(function(b){ return b.y > 0.05; });
      if (st.t >= 180) lp.pause(); k.redraw();
    });
    rst(); lp.play();
    k.button("↺ Recommencer", function(){ rst(); lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, fh = H * 0.27, fw = 90, fx = (W - fw) / 2;
      /* flacon */
      var ge = st.cum || 0, eth = ox.value ? 0 : ge * 0.511, co2g = ge * (ox.value ? 264 / 180 : 88 / 180), vol = co2g / 44 * 0.082057 * (273.15 + T.value) * 1000;
      ctx.save(); ctx.fillStyle = "rgba(253,230,138,.55)"; ctx.fillRect(fx, 24, fw, fh - 10); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2.5; ctx.strokeRect(fx, 12, fw, fh + 2); ctx.restore();
      st.bub.forEach(function(b){ var bx = fx + b.x * fw, by = 24 + b.y * (fh - 14); ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.beginPath(); ctx.arc(bx, by, 3.2, 0, 6.3); ctx.fill(); ctx.strokeStyle = "#b45309"; ctx.stroke(); });
      B4.txt(c, "levures + sucre, " + S.fmt(T.value, 0) + " °C", W / 2, fh + 24, B4.pal.ink, 12);
      var ax = S.draw.axes(c, {x0:0, x1:180, y0:0, y1:Math.max(10, Math.ceil(g.value / 5) * 5), xl:"t (min)", yl:"g", stepX:30, t:fh + 40, l:40});
      var pal = [B4.pal.amber, B4.pal.red, B4.pal.teal];
      [[1, pal[0], "sucre (g)"], [2, pal[1], "éthanol (g)"], [3, pal[2], "CO₂ (g)"]].forEach(function(s, q){
        ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = s[1]; ctx.lineWidth = 2.6; ctx.beginPath();
        st.h.forEach(function(p, i){ var x = ax.X(p[0]), y = ax.Y(p[s[0]]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); ctx.restore(); B4.txt(c, s[2], ax.R - 6, ax.T + 10 + q * 15, s[1], 12, "right"); });
      ro.set(0, S.fmt(st.G, 1) + " g"); ro.set(1, S.fmt(eth, 1) + " g"); ro.set(2, S.fmt(vol, 0) + " mL"); ro.set(3, S.fmt(st.t, 0) + " min");
      nt.set(T.value > 55 ? "Au-dessus de 55 °C, les levures sont tuées : plus de fermentation (la pâte ne lève pas)." : T.value < 8 ? "Très froid : les enzymes des levures sont presque inactives, la fermentation est très lente." : ox.value ? "Avec dioxygène, les levures respirent : beaucoup de CO₂ (264 g pour 180 g de glucose), pas d'éthanol." : "Fermentation alcoolique : pour 180 g de glucose, 92 g d'éthanol et 88 g de CO₂. Volume de CO₂ calculé à " + S.fmt(T.value, 0) + " °C sous 1 atm.", T.value > 55 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"b4-c06-effort", ch:"c06", tag:"Muscle · modèle",
  titre:"Effort : quand le muscle passe à l'anaérobie",
  resume:"Fais varier la puissance demandée et l'entraînement : le lactate s'accumule dès que la respiration ne suffit plus.",
  but:"Règle la puissance et la capacité aérobie. Lance l'effort et surveille le lactate : jusqu'à quand peux-tu tenir ?",
  aRetenir:"Tant que la demande reste sous la capacité aérobie, le muscle couvre ses besoins par la respiration (≈ 30 ATP par glucose) et le lactate reste bas. Au-delà, il complète par la fermentation lactique (2 ATP par glucose), le lactate s'accumule et l'effort devient insoutenable. L'entraînement augmente la capacité aérobie.",
  piege:"Le lactate n'est pas un « poison » à l'origine des courbatures du lendemain. Modèle simplifié en unités arbitraires : l'allure des courbes compte plus que les valeurs.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.85});
    var P = k.slider("Puissance demandée", 50, 400, 10, 220, "W");
    var A = k.slider("Capacité aérobie (entraînement)", 100, 300, 10, 160, "W");
    var ro = k.readouts(["Apport aérobie", "Apport par fermentation", "Glucose consommé / s (relatif)", "Tenue de l'effort"]);
    var nt = k.note("", "");
    var st = {t:0, L:1, h:[[0, 1]], run:false};
    function stepL(L, dt){ var prod = 0.06 * Math.max(0, P.value - A.value); return L + (prod - 0.4 * (L - 1)) * dt; }
    var lp = k.loop(function(dt){
      var h = dt * 1;      /* 1 s réelle = 1 min */
      for (var s = 0; s < 5; s++) st.L = stepL(st.L, h / 5);
      st.t += h; st.h.push([st.t, st.L]); if (st.t >= 10 || st.L >= 12) lp.pause(); k.redraw();
    });
    k.button("▶ Lancer l'effort", function(){ st.t = 0; st.L = 1; st.h = [[0, 1]]; lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.button("↺ Repos", function(){ lp.pause(); st.t = 0; st.L = 1; st.h = [[0, 1]]; });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, aer = Math.min(P.value, A.value), fer = Math.max(0, P.value - A.value), gl = aer / 30 + fer / 2, gl0 = P.value / 30;
      var hh = H * 0.28, bx = 10, bw = W - 20, tot = 400;
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(bx, 10, bw, 22);
      ctx.fillStyle = B4.pal.green; ctx.fillRect(bx, 10, bw * aer / tot, 22); ctx.fillStyle = B4.pal.red; ctx.fillRect(bx + bw * aer / tot, 10, bw * fer / tot, 22);
      B4.txt(c, "vert : aérobie · rouge : lactique · " + S.fmt(P.value, 0) + " W", bx, 46, B4.pal.ink, 12, "left");
      var ax = S.draw.axes(c, {x0:0, x1:10, y0:0, y1:16, xl:"t (min)", yl:"lactate (mmol/L)", stepX:2, stepY:4, t:62, l:46});
      S.draw.line(c, ax.L, ax.Y(12), ax.R, ax.Y(12), B4.pal.red, 1.5, [5, 4]); B4.txt(c, "épuisement (≈ 12)", ax.R - 4, ax.Y(12) - 9, B4.pal.red, 12, "right");
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = B4.pal.violet; ctx.lineWidth = 2.8; ctx.beginPath(); st.h.forEach(function(p, i){ var x = ax.X(p[0]), y = ax.Y(p[1]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); ctx.restore();
      /* lactate d'équilibre */
      var Leq = 1 + 0.06 * fer / 0.4;
      ro.set(0, S.fmt(aer, 0) + " W"); ro.set(1, S.fmt(fer, 0) + " W"); ro.set(2, "× " + S.fmt(gl / gl0, 1) + " (vs tout aérobie)");
      var held = fer === 0 ? "durable" : Leq < 12 ? "stabilisée (lactate ≈ " + S.fmt(Leq, 1) + ")" : "limitée (épuisement)";
      ro.set(3, held);
      var m = st.L >= 12 ? "Épuisement atteint à t ≈ " + S.fmt(st.t, 1) + " min : le lactate dépasse 12 mmol/L." : fer === 0 ? "Puissance sous la capacité aérobie : le lactate reste proche de 1 mmol/L, l'effort peut durer longtemps." : Leq < 12 ? "Au-dessus de la capacité aérobie, le lactate monte puis se stabilise vers " + S.fmt(Leq, 1) + " mmol/L : effort difficile mais tenable." : "Le lactate monte sans se stabiliser avant l'épuisement (équilibre prévu ≈ " + S.fmt(Leq, 0) + " mmol/L) : l'effort ne peut pas durer. À la même puissance, la fermentation consomme " + S.fmt(15, 0) + " fois plus de glucose par ATP.";
      nt.set(m, st.L >= 12 ? "warn" : fer === 0 ? "ok" : "");
    });
  }
});

SFA.sim({
  id:"b4-c06-etapes", ch:"c06", tag:"Étapes · original",
  titre:"Où le CO₂ est-il libéré ? Où le dioxygène est-il consommé ?",
  resume:"Touche chaque étape de la respiration : bilan en ATP, CO₂ et O₂, puis bloque la chaîne respiratoire.",
  but:"Touche une étape sur le schéma pour la lire. Active ou non le dioxygène et le cyanure, et observe l'effet sur chaque étape.",
  aRetenir:"Glycolyse (cytoplasme) : 2 ATP, pas de CO₂, pas d'O₂. Décarboxylation du pyruvate et cycle de Krebs (matrice) : 6 CO₂ en tout, 2 ATP. Chaîne respiratoire (membrane interne) : c'est là que O₂ est consommé (il devient H₂O) et que ≈ 26 ATP sont produits. Total : ≈ 30 ATP, 6 CO₂, 6 O₂ par glucose.",
  piege:"L'O₂ n'est pas utilisé dans la glycolyse : il est consommé à la toute fin, dans la chaîne respiratoire. Si cette chaîne est bloquée (cyanure, absence d'O₂), tout l'aval s'arrête et la cellule se rabat sur la fermentation (2 ATP).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.85});
    var n = k.slider("Glucose consommé", 1, 10, 1, 1, "molécules");
    var ox = k.toggle("Dioxygène disponible", true);
    var cn = k.toggle("Cyanure présent (bloque la chaîne respiratoire)", false);
    var ro = k.readouts(["ATP total", "CO₂ libéré", "O₂ consommé", "Lactate formé"]);
    var nt = k.note("", "");
    var st = {sel:0}, boxes = [];
    var STG = [
      {n:"Glycolyse", lieu:"cytoplasme", atp:2, co2:0, o2:0, txt:"Un glucose (6 C) est coupé en 2 pyruvates (3 C). Bilan : 2 ATP nets, 2 NADH. Aucun CO₂, aucun O₂ : elle fonctionne aussi sans dioxygène."},
      {n:"Pyruvate + Krebs", lieu:"matrice", atp:2, co2:6, o2:0, txt:"Les pyruvates perdent chacun un CO₂, puis le cycle de Krebs en libère 4 de plus : 6 CO₂ par glucose, 2 ATP et beaucoup de NADH et FADH₂. Le cycle a besoin que la chaîne respiratoire régénère NAD⁺ : sans elle, il s'arrête."},
      {n:"Chaîne respiratoire", lieu:"membrane interne", atp:26, co2:0, o2:6, txt:"NADH et FADH₂ cèdent leurs électrons à une chaîne de protéines ; l'accepteur final est O₂, qui devient H₂O (6 O₂ → 12 H₂O). L'énergie libérée sert à fabriquer ≈ 26 ATP."}
    ];
    c.pointer(function(type, p){ if (type !== "down") return; boxes.forEach(function(b, i){ if (p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) st.sel = i; }); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, N = n.value, run = ox.value && !cn.value;
      var bh = 74, gap = 14, bw = W - 20; boxes = [];
      for (var i = 0; i < 3; i++){
        var s = STG[i], on = i === 0 ? true : run, y = 8 + i * (bh + gap), sel = st.sel === i;
        boxes.push({x:10, y:y, w:bw, h:bh});
        B4.rr(c, 10, y, bw, bh, 10, on ? ["rgba(219,234,254,.9)", "rgba(220,252,231,.9)", "rgba(254,243,199,.9)"][i] : "rgba(226,232,240,.9)", sel ? B4.pal.red : "#13233a", sel ? 4 : 1.5);
        B4.txt(c, (i + 1) + ". " + s.n + " (" + s.lieu + ")", 20, y + 16, B4.pal.ink, 12, "left");
        var a = on ? s.atp * N : 0, cc = on ? s.co2 * N : 0, oo = on ? s.o2 * N : 0;
        B4.txt(c, "ATP : " + S.fmt(a, 0) + "   CO₂ : " + S.fmt(cc, 0) + "   O₂ : " + S.fmt(oo, 0), 20, y + 38, on ? B4.pal.ink : "#8a95a3", 13, "left");
        B4.txt(c, on ? "en fonctionnement" : "ARRÊTÉE", 20, y + 58, on ? B4.pal.green : B4.pal.red, 12, "left");
        if (i < 2) S.draw.arrow(c, W / 2, y + bh, W / 2, y + bh + gap, "#13233a", 2.5);
      }
      var atp = 2 * N + (run ? (2 + 26) * N : 0), co2 = run ? 6 * N : 0, o2 = run ? 6 * N : 0, lac = run ? 0 : 2 * N;
      ro.set(0, S.fmt(atp, 0) + " ATP"); ro.set(1, S.fmt(co2, 0)); ro.set(2, S.fmt(o2, 0)); ro.set(3, lac ? S.fmt(lac, 0) : "0");
      var s2 = STG[st.sel];
      nt.set("<b>" + s2.n + ".</b> " + s2.txt + (run ? "" : (cn.value ? " <b>Cyanure :</b> la chaîne respiratoire est bloquée, NADH ne se régénère plus : Krebs s'arrête. La cellule fait de la fermentation lactique : seulement 2 ATP par glucose, " : " <b>Sans dioxygène :</b> la chaîne n'a plus d'accepteur final : mêmes conséquences, ") + "ici " + S.fmt(2 * N, 0) + " ATP pour " + S.fmt(N, 0) + " glucose(s) au lieu de " + S.fmt(30 * N, 0) + "."), run ? "" : "warn");
    });
  }
});
