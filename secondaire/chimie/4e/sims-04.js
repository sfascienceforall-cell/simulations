/* Chimie 4e · chapitre 4 · Gaz */
SFA.sim({
  id:"c4-c04-piston", ch:"c04", tag:"Animation",
  titre:"Le piston : p, V, T et n",
  resume:"Un gaz dans un cylindre : fais varier V, T et n et regarde la pression et l'agitation des molécules.",
  but:"Modifie le volume, la température et la quantité de gaz. La pression se calcule avec p·V = n·R·T ; la courbe en bas est l'isotherme.",
  aRetenir:"p·V = n·R·T avec T en kelvins (T = θ + 273). À T et n constants, p·V est constant (Boyle) : diviser V par 2 double p.",
  piege:"Dans p·V = n·R·T, la température doit être en kelvins. À 0 °C la température n'est pas nulle : T = 273 K.",
  build:function(k, S){
    var c = k.canvas(190), g = k.canvas(230), R = 8.31;
    var V = k.slider("Volume V", 0.3, 3, 0.1, 1.5, "L");
    var T = k.slider("Température θ", -20, 200, 5, 20, "°C");
    var n = k.slider("Quantité de gaz n", 0.01, 0.10, 0.01, 0.05, "mol");
    var ro = k.readouts(["T absolue", "Pression p", "p·V"]);
    var nt = k.note("", "");
    var rnd = C4.rnd(11), P = [];
    for (var i = 0; i < 100; i++) P.push({x:rnd(), y:rnd(), a:rnd() * 6.28});
    var lp = k.loop(function(dt){
      var sp = 0.35 * Math.sqrt((T.value + 273) / 293), cnt = Math.round(n.value * 1000);
      for (var i = 0; i < cnt; i++){ var q = P[i]; q.x += Math.cos(q.a) * sp * dt; q.y += Math.sin(q.a) * sp * dt * 1.6;
        if (q.x < 0){ q.x = 0; q.a = Math.PI - q.a; } if (q.x > 1){ q.x = 1; q.a = Math.PI - q.a; } if (q.y < 0){ q.y = 0; q.a = -q.a; } if (q.y > 1){ q.y = 1; q.a = -q.a; } }
      k.redraw();
    });
    lp.play();
    function pres(v, Tc, nn){ return nn * R * (Tc + 273) / (v / 1000); }
    k.draw(function(){
      var v = V.value, Tk = T.value + 273, p = pres(v, T.value, n.value);
      c.clear(); var W = c.W, ctx = c.ctx, bw = W - 70, pw = (v / 3) * bw;
      ctx.fillStyle = "#f6f9fc"; ctx.fillRect(20, 20, pw, 130); ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.strokeRect(20, 20, bw, 130);
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(20 + pw, 14, 12, 142); ctx.fillRect(32 + pw, 80, Math.min(40, W - 60 - pw - 12), 6);
      var cnt = Math.round(n.value * 1000);
      for (var i = 0; i < cnt; i++){ var q = P[i]; S.draw.dot(c, 24 + q.x * (pw - 8), 24 + q.y * 122, 3.2, "#1e3f8f"); }
      C4.label(c, "V = " + S.fmt(v, 1) + " L", 20 + pw / 2, 170, "#2c3a4e", 13);
      var gx = S.draw.axes(g, {x0:0, x1:3, y0:0, y1:Math.max(1, pres(0.3, T.value, n.value) * 1.1 / 1000), xl:"V (L)", yl:"p (kPa)", l:48});
      g.clear(); gx = S.draw.axes(g, {x0:0, x1:3, y0:0, y1:Math.max(1, pres(0.3, T.value, n.value) * 1.1 / 1000), xl:"V (L)", yl:"p (kPa)", l:48});
      S.draw.fn(g, gx, function(x){ return x < 0.3 ? NaN : pres(x, T.value, n.value) / 1000; }, "#1e3f8f", 3);
      S.draw.fn(g, gx, function(x){ return x < 0.3 ? NaN : pres(x, 20, n.value) / 1000; }, "#b8c0cc", 1.5, [5, 4]);
      S.draw.dot(g, gx.X(v), gx.Y(p / 1000), 7, "#b42318");
      C4.label(g, "trait gris : isotherme à 20 °C", g.W - 12, gx.T + 24, "#5f6b7a", 11, "right");
      ro.set(0, Tk + " K"); ro.set(1, S.fmt(p / 1000, 1) + " kPa"); ro.set(2, S.fmt(p * v / 1000, 1) + " J");
      nt.set(p > 1000000 ? "Au-delà de 1 000 kPa le modèle du gaz parfait devient peu fiable." : "1 atm = 101,3 kPa. Ici p = " + S.fmt(p / 101300, 2) + " atm.", p > 1000000 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"c4-c04-azote", ch:"c04", tag:"Original",
  titre:"Un ballon dans l'azote liquide",
  resume:"À pression constante, le volume d'un gaz est proportionnel à sa température absolue : Charles.",
  but:"Refroidis ou chauffe le ballon. Compare la formule correcte (en kelvins) avec l'erreur classique (en °C).",
  aRetenir:"À p et n constants : V / T = constante, avec T en kelvins. La droite V(θ) coupe l'axe V = 0 en θ = −273 °C : le zéro absolu.",
  piege:"Utiliser des °C dans V₂ = V₁·T₂/T₁ donne n'importe quoi : à 0 °C on trouverait un volume nul, à −50 °C un volume négatif.",
  build:function(k, S){
    var c = k.canvas(160), g = k.canvas(240), V0 = 2.0;
    var th = k.slider("Température θ", -190, 100, 5, 20, "°C");
    var md = k.seg("Formule utilisée", [["K","Kelvins (correct)"],["C","°C (erreur)"]], "K");
    var ro = k.readouts(["T", "Volume V", "V / V₀"]);
    var nt = k.note("", "");
    k.draw(function(){
      var tc = th.value, Tk = tc + 273, V = V0 * Tk / 293, Vw = V0 * tc / 20, use = md.value === "K" ? V : Vw;
      c.clear(); g.clear(); var W = c.W, ctx = c.ctx;
      var r = Math.cbrt(Math.max(use, 0) * 1000 * 3 / (4 * Math.PI)) * 2.0;
      ctx.fillStyle = md.value === "K" ? "rgba(30,63,143,.22)" : "rgba(180,35,24,.2)"; ctx.strokeStyle = md.value === "K" ? "#1e3f8f" : "#b42318"; ctx.lineWidth = 3;
      if (use > 0.001){ ctx.beginPath(); ctx.ellipse(W * 0.4, 80, r * 1.15, r, 0, 0, 7); ctx.fill(); ctx.stroke(); } else { C4.label(c, "volume nul ou négatif : absurde", W * 0.4, 80, "#b42318", 14); }
      if (tc < -150){ for (var i = 0; i < 12; i++) S.draw.dot(c, W * 0.75 + (i % 4) * 14, 110 + Math.floor(i / 4) * 12, 5, "rgba(140,190,230,.7)"); C4.label(c, "N₂ liquide", W * 0.75 + 20, 150, "#0e7490", 12); }
      var ax = S.draw.axes(g, {x0:-300, x1:120, y0:0, y1:3, xl:"θ (°C)", yl:"V (L)", stepX:50, l:40});
      S.draw.fn(g, ax, function(x){ return V0 * (x + 273) / 293; }, "#1e3f8f", 3);
      if (md.value === "C") S.draw.fn(g, ax, function(x){ return V0 * x / 20; }, "#b42318", 2, [6, 4]);
      S.draw.dot(g, ax.X(-273), ax.Y(0), 5, "#2e6b55"); C4.tag(g, "zéro absolu −273 °C", ax.X(-273) + 8, ax.Y(0) - 14, "#2e6b55", 12);
      S.draw.dot(g, ax.X(tc), ax.Y(Math.max(0, Math.min(3, use))), 7, "#b42318");
      ro.set(0, Tk + " K"); ro.set(1, use > 0 ? S.fmt(use, 2) + " L" : "impossible"); ro.set(2, S.fmt(use / V0, 2));
      if (md.value === "C") nt.set("Avec les °C, la formule ne vaut rien : seul le résultat en kelvins correspond à l'expérience (V = " + S.fmt(V, 2) + " L).", "warn");
      else nt.set(tc < -183 ? "Sous −183 °C le dioxygène de l'air se liquéfie : le modèle du gaz parfait ne s'applique plus (le vrai ballon rétrécit encore davantage)." : "Ballon de " + V0 + " L à 20 °C, pression constante : V = V₀·T/293.", tc < -183 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"c4-c04-hydrogene", ch:"c04", tag:"Expérience",
  titre:"Mesurer le volume d'hydrogène dégagé",
  resume:"Du magnésium dans de l'acide chlorhydrique libère du dihydrogène : prédis le volume avant de le mesurer.",
  but:"Choisis la masse de magnésium, le volume d'acide (1,0 mol/L) et la température. Lance la réaction et lis le volume sur l'éprouvette.",
  aRetenir:"Mg + 2 HCl → MgCl₂ + H₂. n(H₂) = n(Mg) si l'acide est en excès, puis V = n · V_m. Si l'acide manque, c'est lui qui limite : n(H₂) = n(HCl)/2.",
  piege:"Plus de magnésium ne donne pas plus de gaz si l'acide est épuisé : le volume plafonne.",
  build:function(k, S){
    var c = k.canvas(320);
    var m = k.slider("Masse de Mg", 0.05, 0.40, 0.01, 0.20, "g");
    var Va = k.slider("Acide HCl (1,0 mol/L)", 5, 50, 1, 30, "mL");
    var T = k.slider("Température", 10, 30, 1, 20, "°C");
    var ro = k.readouts(["n(Mg)", "n(HCl)", "n(H₂)", "V(H₂)"]);
    var nt = k.note("", "");
    var st = {p:1}, lp = k.loop(function(dt){ st.p = Math.min(1, st.p + dt / 3); if (st.p >= 1) lp.pause(); k.redraw(); });
    [m, Va, T].forEach(function(s){ s.el.addEventListener("input", function(){ st.p = 1; }); });
    k.button("▶ Lancer la réaction", function(){ st.p = 0; lp.play(); }, true);
    k.draw(function(){
      var nMg = m.value / 24, nH = Va.value / 1000 * 1.0, xi = Math.min(nMg, nH / 2), Vm = 24 * (T.value + 273) / 293;
      var Vfin = xi * Vm * 1000, Vnow = Vfin * st.p;
      c.clear(); var W = c.W, ctx = c.ctx, tx = W * 0.62, tw = 60, top = 20, hh = 270, scale = hh / 500;
      /* éprouvette renversée dans la cuve */
      ctx.fillStyle = "rgba(60,150,200,.25)"; ctx.fillRect(10, 200, W - 20, 100);
      ctx.fillStyle = "rgba(60,150,200,.35)"; ctx.fillRect(tx - tw / 2 + 2, top + 4 + Vnow * scale, tw - 4, hh - Vnow * scale - 4);
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx - tw / 2, top + hh); ctx.lineTo(tx - tw / 2, top); ctx.lineTo(tx + tw / 2, top); ctx.lineTo(tx + tw / 2, top + hh); ctx.stroke();
      for (var v = 0; v <= 500; v += 100){ var yy = top + 4 + v * scale; S.draw.line(c, tx + tw / 2, yy, tx + tw / 2 + 8, yy, "#5f6b7a", 1.5); C4.label(c, v + " mL", tx + tw / 2 + 12, yy, "#5f6b7a", 11, "left"); }
      S.draw.line(c, tx - tw / 2 - 8, top + 4 + Vnow * scale, tx + tw / 2, top + 4 + Vnow * scale, "#b42318", 2);
      C4.label(c, "gaz H₂ recueilli", tx - tw / 2 - 12, top + 4 + Vnow * scale / 2, "#2c3a4e", 12, "right");
      /* erlenmeyer */
      var fx = W * 0.17; ctx.fillStyle = "rgba(244,197,66,.25)"; ctx.beginPath(); ctx.moveTo(fx - 12, 215); ctx.lineTo(fx + 12, 215); ctx.lineTo(fx + 34, 290); ctx.lineTo(fx - 34, 290); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#5f6b7a"; ctx.stroke();
      ctx.fillStyle = "#6c7d90"; var ml = 8 + m.value * 60; ctx.fillRect(fx - ml / 2, 272, ml, 6);
      if (st.p < 1) for (var b = 0; b < 6; b++) S.draw.dot(c, fx - 18 + b * 7, 265 - ((st.p * 200 + b * 17) % 50), 2.5, "rgba(255,255,255,.9)");
      S.draw.line(c, fx + 8, 215, fx + 8, 190, "#5f6b7a", 2); S.draw.line(c, fx + 8, 190, tx - 8, 190, "#5f6b7a", 2); S.draw.line(c, tx - 8, 190, tx - 8, top + hh + 16, "#5f6b7a", 2);
      C4.label(c, "Mg + HCl", fx, 305, "#2c3a4e", 12);
      ro.set(0, S.fmt(nMg * 1000, 2) + " mmol"); ro.set(1, S.fmt(nH * 1000, 1) + " mmol"); ro.set(2, S.fmt(xi * 1000, 2) + " mmol"); ro.set(3, S.fmt(Vfin, 0) + " mL");
      nt.set(nMg <= nH / 2 ? "Le magnésium est limitant : tout le Mg disparaît, l'acide est en excès." : "L'acide est limitant : il reste du magnésium. Le volume de H₂ ne dépend plus de la masse de Mg.", "ok");
    });
  }
});

SFA.sim({
  id:"c4-c04-airbag", ch:"c04", tag:"Défi",
  titre:"Airbag : combien d'azoture de sodium ?",
  resume:"2 NaN₃ → 2 Na + 3 N₂ : règle la masse d'azoture pour gonfler un sac de 60 L.",
  but:"Choisis la masse de NaN₃ et la température du gaz. Gonfle le sac et essaie d'atteindre 60 L (± 3 L).",
  aRetenir:"n(N₂) = 1,5 × n(NaN₃) ; puis V = n(N₂) · V_m. Le coefficient 3/2 vient de l'équation 2 NaN₃ → 2 Na + 3 N₂.",
  piege:"Le rapport 3/2 s'applique aux quantités de matière, pas aux masses : 1 g de NaN₃ ne donne pas 1,5 g de N₂. Modèle simplifié : un airbag réel contient d'autres réactifs pour neutraliser le sodium formé.",
  build:function(k, S){
    var c = k.canvas(280);
    var m = k.slider("Masse de NaN₃", 20, 150, 1, 70, "g");
    var T = k.slider("Température du gaz", 20, 100, 5, 20, "°C");
    var ro = k.readouts(["n(NaN₃)", "n(N₂)", "V(N₂)", "Masse de Na formé"]);
    var nt = k.note("", "");
    var st = {p:1}, lp = k.loop(function(dt){ st.p = Math.min(1, st.p + dt / 1.2); if (st.p >= 1) lp.pause(); k.redraw(); });
    [m, T].forEach(function(s){ s.el.addEventListener("input", function(){ st.p = 1; }); });
    k.button("▶ Déclencher", function(){ st.p = 0; lp.play(); }, true);
    k.draw(function(){
      var nA = m.value / 65, nN = 1.5 * nA, Vm = 24 * (T.value + 273) / 293, V = nN * Vm, Vn = V * st.p;
      c.clear(); var W = c.W, ctx = c.ctx, cx = W * 0.4, cy = 135;
      var rt = Math.cbrt(60 * 3 / (4 * Math.PI)) * 22, r = Math.cbrt(Vn * 3 / (4 * Math.PI)) * 22;
      ctx.setLineDash([6, 5]); ctx.strokeStyle = "#2e6b55"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, rt, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      C4.tag(c, "cible : 60 L", cx + rt * 0.72, cy - rt * 0.72, "#2e6b55", 12);
      if (r > 1){ ctx.fillStyle = "rgba(30,63,143,.25)"; ctx.strokeStyle = "#1e3f8f"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.stroke(); }
      C4.label(c, S.fmt(Vn, 0) + " L", cx, cy, "#1e3f8f", 18);
      var bx = W * 0.86, bh = 220; C4.bar(c, bx, 30, 22, bh, 1, "#edf0f4");
      var f = Math.min(1, V / 100); c.ctx.fillStyle = Math.abs(V - 60) <= 3 ? "#2e6b55" : "#1e3f8f"; c.ctx.fillRect(bx, 30 + bh * (1 - f), 22, bh * f);
      S.draw.line(c, bx - 4, 30 + bh * (1 - 0.6), bx + 26, 30 + bh * (1 - 0.6), "#2e6b55", 2);
      C4.label(c, "V (L)", bx + 11, 18, "#5f6b7a", 11); C4.label(c, "0", bx - 8, 30 + bh, "#5f6b7a", 11, "right"); C4.label(c, "100", bx - 8, 34, "#5f6b7a", 11, "right");
      ro.set(0, S.fmt(nA, 2) + " mol"); ro.set(1, S.fmt(nN, 2) + " mol"); ro.set(2, S.fmt(V, 1) + " L"); ro.set(3, S.fmt(nA * 23, 1) + " g");
      var d = V - 60;
      nt.set(Math.abs(d) <= 3 ? "✅ Objectif atteint : " + S.fmt(V, 1) + " L." : d < 0 ? "Sac insuffisamment gonflé (il manque " + S.fmt(-d, 1) + " L). Augmente la masse." : "Trop de gaz (" + S.fmt(d, 1) + " L en trop). Réduis la masse.", Math.abs(d) <= 3 ? "ok" : "warn");
    });
  }
});
