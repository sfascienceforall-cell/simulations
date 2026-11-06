/* Chapitre 5 · Oscillations et vibrations */
SFA.sim({
  id: "p6-c05-masse-ressort", ch: "c05", tag: "Classique",
  titre: "Masse-ressort : période, graphe et énergie",
  resume: "T = 2π·√(m/k) : la période dépend de m et de k, pas de l'amplitude.",
  but: "Une masse oscille sans frottement au bout d'un ressort. Change m, k et l'amplitude : lis la période sur le graphe x(t) et vois l'énergie passer de cinétique à élastique.",
  aRetenir: "Pour un oscillateur masse-ressort, T = 2π·√(m/k) et f = 1/T. Plus la masse est grande, plus la période augmente ; plus le ressort est raide, plus elle diminue. L'amplitude n'a aucune influence sur T. L'énergie mécanique E = ½·k·A² se conserve : elle passe sans cesse de l'élastique au cinétique.",
  piege: "Doubler l'amplitude ne change pas la période (la masse va plus vite sur un chemin plus long). Pour doubler T, il faut multiplier la masse par 4 (racine carrée !). Modèle : ressort idéal, sans frottement.",
  build: function(k, S){
    var c = k.canvas(150), g = k.canvas(190), eb = k.canvas(70), P = S.draw.palette;
    var m = k.slider("Masse m", 0.1, 2, 0.1, 0.5, "kg", function(){ t = 0; });
    var K = k.slider("Raideur k", 5, 100, 5, 20, "N/m", function(){ t = 0; });
    var A = k.slider("Amplitude A", 2, 20, 1, 10, "cm");
    var ro = k.readouts(["Période T", "Fréquence f", "Vitesse maximale", "Énergie mécanique"]);
    var t = 0;
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); g.clear(); eb.clear(); var ctx = c.ctx, W = c.W;
      var w = Math.sqrt(K.value / m.value), T = 2 * Math.PI / w, Am = A.value / 100, x = Am * Math.cos(w * t), v = -Am * w * Math.sin(w * t);
      var E = 0.5 * K.value * Am * Am, Ep = 0.5 * K.value * x * x, Ec = 0.5 * m.value * v * v;
      var cx = W / 2 + 20, cy = 74, sc = (W / 2 - 60) / 0.2;
      /* mur, ressort, masse */
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(14, cy - 40, 10, 80);
      var xm = cx + x * sc, left = 24;
      ctx.beginPath(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.moveTo(left, cy);
      var nco = 12, wl = (xm - 20 - left) / nco; for (var j = 0; j < nco; j++){ ctx.lineTo(left + (j + 0.25) * wl, cy - 14); ctx.lineTo(left + (j + 0.75) * wl, cy + 14); } ctx.lineTo(xm - 20, cy); ctx.stroke();
      var s = 24 + 14 * m.value; ctx.fillStyle = P.acc; ctx.fillRect(xm - s / 2, cy - s / 2, s, s);
      S.draw.line(c, cx, cy + 46, cx, cy - 46, P.grey, 1, [4, 3]);
      S.draw.text(c, "x = " + S.fmt(x * 100, 1) + " cm", W - 70, 16, {size: 13, color: P.acc});
      S.draw.text(c, "position d'équilibre", cx, c.H - 10, {size: 12, color: P.grey});
      /* graphe x(t) sur 3 périodes */
      var ax = S.draw.axes(g, {x0: 0, x1: 3 * T, y0: -20, y1: 20, xl: "t (s)", yl: "x (cm)", l: 46, t: 18, stepY: 10});
      S.draw.fn(g, ax, function(tt){ return A.value * Math.cos(w * tt); }, P.acc);
      S.draw.line(g, ax.X(T), ax.T, ax.X(T), ax.B, P.amber, 1.5, [5, 4]);
      S.draw.text(g, "T", ax.X(T) + 8, ax.T + 10, {size: 13, color: P.amber, math: true});
      S.draw.dot(g, ax.X(t % (3 * T)), ax.Y(x * 100), 5, P.red);
      /* barres d'énergie */
      var bw = eb.W - 40, ctx2 = eb.ctx;
      ctx2.fillStyle = "#e3e7ed"; ctx2.fillRect(20, 10, bw, 14); ctx2.fillRect(20, 40, bw, 14);
      ctx2.fillStyle = P.green; ctx2.fillRect(20, 10, bw * Ec / E, 14); ctx2.fillStyle = P.amber; ctx2.fillRect(20, 40, bw * Ep / E, 14);
      S.draw.text(eb, "énergie cinétique", 24, 17, {size: 12, align: "left", color: "#fff"}); S.draw.text(eb, "énergie élastique", 24, 47, {size: 12, align: "left", color: "#13233a"});
      ro.set(0, S.fmt(T, 3) + " s"); ro.set(1, S.fmt(1 / T, 2) + " Hz"); ro.set(2, S.fmt(Am * w, 2) + " m/s"); ro.set(3, S.fmt(E * 1000, 1) + " mJ");
    });
  }
});

SFA.sim({
  id: "p6-c05-pendule", ch: "c05", tag: "Classique",
  titre: "Le pendule simple : qui compte vraiment ?",
  resume: "T ≈ 2π·√(L/g) : longueur et pesanteur comptent ; masse et (petite) amplitude, non.",
  but: "Le pendule oscille vraiment (le mouvement est calculé, pas imposé). Change L, la planète (g), l'angle de départ et la masse. Compare la période mesurée à la formule des petits angles.",
  aRetenir: "Pour les petits angles (moins de ≈ 15°), T = 2π·√(L/g) : indépendant de la masse et de l'amplitude. Il faut une longueur 4 fois plus grande pour doubler T. Sur la Lune (g = 1,62 m/s²), le même pendule bat plus lentement.",
  piege: "La masse n'intervient pas du tout (curseur à essayer !). L'amplitude n'a d'effet qu'aux grands angles : à 60° la vraie période dépasse la formule d'environ 7 %. La formule T = 2π√(L/g) n'est exacte que pour de petits angles.",
  build: function(k, S){
    var c = k.canvas(270), g = k.canvas(170), P = S.draw.palette;
    var L = k.slider("Longueur L", 0.1, 3, 0.1, 1, "m", reset);
    var pl = k.select("Lieu", [["9.81", "Terre (9,81 m/s²)"], ["1.62", "Lune (1,62 m/s²)"], ["3.71", "Mars (3,71 m/s²)"], ["24.8", "Jupiter (24,8 m/s²)"]], "9.81", reset);
    var th0 = k.slider("Angle de départ θ₀", 5, 80, 5, 10, "°", reset);
    var ms = k.slider("Masse du pendule (sans effet !)", 0.1, 2, 0.1, 1, "kg");
    var ro = k.readouts(["T formule (petits angles)", "T réel (grand angle)", "Écart", "Période mesurée"]);
    var th, om, t, hist, lastCross;
    function reset(){ th = th0 ? th0.value * Math.PI / 180 : 0.17; om = 0; t = 0; hist = []; lastCross = null; meas = null; }
    var meas = null, upCross = [];
    function agm(a, b){ for (var i = 0; i < 30; i++){ var an = (a + b) / 2, bn = Math.sqrt(a * b); a = an; b = bn; } return a; }
    reset();
    var lp = k.loop(function(dt){
      var gg = parseFloat(pl.value), l = L.value, n = 20, h = dt / n;
      function acc(x){ return -gg / l * Math.sin(x); }
      for (var i = 0; i < n; i++){
        var k1 = om, a1 = acc(th), k2 = om + 0.5 * h * a1, a2 = acc(th + 0.5 * h * k1), k3 = om + 0.5 * h * a2, a3 = acc(th + 0.5 * h * k2), k4 = om + h * a3, a4 = acc(th + h * k3);
        var thn = th + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4), omn = om + h / 6 * (a1 + 2 * a2 + 2 * a3 + a4);
        /* passage par θ = θ0 maximum à droite : détecte les maxima (om change de signe +→−) */
        if (om > 0 && omn <= 0){ if (lastCross !== null) meas = t - lastCross; lastCross = t; }
        th = thn; om = omn; t += h;
      }
      hist.push([t, th]); while (hist.length && t - hist[0][0] > 8) hist.shift();
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, H = c.H, gg = parseFloat(pl.value), l = L.value;
      var T0 = 2 * Math.PI * Math.sqrt(l / gg), a0 = th0.value * Math.PI / 180, Tr = T0 / agm(1, Math.cos(a0 / 2));
      var px = W / 2, py = 24, R = (H - 60) * (0.25 + 0.75 * l / 3);
      var bx = px + R * Math.sin(th), by = py + R * Math.cos(th);
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(px - 40, py - 12, 80, 8);
      S.draw.line(c, px, py - 4, bx, by, P.ink, 2);
      S.draw.line(c, px, py, px, py + R + 12, P.grey, 1, [4, 4]);
      ctx.beginPath(); ctx.arc(bx, by, 10 + 7 * ms.value, 0, 7); ctx.fillStyle = P.acc; ctx.fill();
      S.draw.text(c, "L = " + S.fmt(l, 1) + " m   g = " + S.fmt(gg, 2), 12, H - 14, {size: 12, align: "left", color: P.grey});
      var ax = S.draw.axes(g, {x0: Math.max(0, t - 8), x1: Math.max(8, t), y0: -90, y1: 90, xl: "t (s)", yl: "θ (°)", l: 46, t: 14, stepY: 45});
      ax.x0 = Math.max(0, t - 8);
      var ctx2 = g.ctx; ctx2.save(); ctx2.beginPath(); ctx2.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx2.clip(); ctx2.strokeStyle = P.red; ctx2.lineWidth = 2.2; ctx2.beginPath();
      hist.forEach(function(p, i){ var X = ax.X(p[0]), Y = ax.Y(p[1] * 180 / Math.PI); if (i) ctx2.lineTo(X, Y); else ctx2.moveTo(X, Y); }); ctx2.stroke(); ctx2.restore();
      ro.set(0, S.fmt(T0, 3) + " s"); ro.set(1, S.fmt(Tr, 3) + " s"); ro.set(2, S.fmt((Tr / T0 - 1) * 100, 1) + " %"); ro.set(3, meas ? S.fmt(meas, 3) + " s" : "…");
    });
  }
});

SFA.sim({
  id: "p6-c05-amortissement", ch: "c05", tag: "Amortissement",
  titre: "Oscillations amorties : trois régimes",
  resume: "Frottement faible, critique ou fort : pseudo-périodique, critique, apériodique.",
  but: "Écarte la masse de 10 cm et lâche-la. Augmente le coefficient de frottement b : l'amplitude décroît en exponentielle, jusqu'à ne plus osciller du tout.",
  aRetenir: "Un frottement fluide −b·v dissipe l'énergie : l'amplitude décroît comme e^(−b·t/2m) (enveloppe en pointillés). Si b est faible (b < 2√(k·m)), le mouvement est pseudo-périodique, de pseudo-période un peu plus grande que T₀. Au-delà, il n'y a plus d'oscillation : régime critique (retour le plus rapide) puis apériodique (retour lent). Les amortisseurs d'une voiture visent le régime critique.",
  piege: "L'amortissement ne fait pas disparaître l'oscillation « d'un coup » : l'amplitude décroît progressivement, et le régime critique est le plus rapide pour revenir à zéro, pas le plus fort frottement. Modèle : frottement proportionnel à la vitesse.",
  build: function(k, S){
    var c = k.canvas(300), P = S.draw.palette;
    var m = k.slider("Masse m", 0.2, 2, 0.1, 0.5, "kg");
    var K = k.slider("Raideur k", 5, 50, 5, 20, "N/m");
    var b = k.slider("Frottement b", 0, 14, 0.2, 1, "kg/s");
    var env = k.toggle("Enveloppe e^(−bt/2m)", true);
    var ro = k.readouts(["Régime", "Pseudo-période", "Temps pour amplitude ÷ 2", "b critique 2√(k·m)"]);
    k.draw(function(){
      c.clear(); var x0 = 10, w0 = Math.sqrt(K.value / m.value), g = b.value / (2 * m.value), bc = 2 * Math.sqrt(K.value * m.value), reg, T = 2 * Math.PI / w0;
      var tm = Math.max(4 * T, 3), f;
      if (g < w0 - 1e-9){ var wd = Math.sqrt(w0 * w0 - g * g); reg = "pseudo-périodique"; f = function(t){ return x0 * Math.exp(-g * t) * (Math.cos(wd * t) + g / wd * Math.sin(wd * t)); }; T = 2 * Math.PI / wd; }
      else if (Math.abs(g - w0) <= 1e-9 || Math.abs(b.value - bc) < 0.11){ reg = "critique (≈)"; var gg = w0; f = function(t){ return x0 * (1 + gg * t) * Math.exp(-gg * t); }; T = NaN; if (g > w0) { /* on traite quand même en apériodique exact */ } }
      else { var s = Math.sqrt(g * g - w0 * w0), l1 = -g + s, l2 = -g - s; reg = "apériodique"; f = function(t){ return x0 * (l2 * Math.exp(l1 * t) - l1 * Math.exp(l2 * t)) / (l2 - l1); }; T = NaN; }
      if (reg.indexOf("critique") === 0 && g > w0){ var s2 = Math.sqrt(g * g - w0 * w0), a1 = -g + s2, a2 = -g - s2; f = function(t){ return x0 * (a2 * Math.exp(a1 * t) - a1 * Math.exp(a2 * t)) / (a2 - a1); }; }
      if (reg === "pseudo-périodique") tm = Math.max(tm, 6 / Math.max(g, 0.4));
      tm = Math.min(tm, 20);
      var ax = S.draw.axes(c, {x0: 0, x1: tm, y0: -11, y1: 11, xl: "t (s)", yl: "x (cm)", l: 46, t: 18, stepY: 5});
      if (env.value && g > 0 && reg === "pseudo-périodique"){ S.draw.fn(c, ax, function(t){ return x0 * Math.exp(-g * t) * Math.sqrt(1 + Math.pow(g / Math.sqrt(w0 * w0 - g * g), 2)); }, P.grey, 1.6, [6, 4]); S.draw.fn(c, ax, function(t){ return -x0 * Math.exp(-g * t) * Math.sqrt(1 + Math.pow(g / Math.sqrt(w0 * w0 - g * g), 2)); }, P.grey, 1.6, [6, 4]); }
      S.draw.fn(c, ax, f, P.acc, 2.8);
      ro.set(0, reg); ro.set(1, isNaN(T) ? "pas d'oscillation" : S.fmt(T, 2) + " s"); var half = Math.log(2) / g;   /* enveloppe e^(−γt) : valable en régime pseudo-périodique */
      if (g > 0 && reg !== "pseudo-périodique"){ var lo = 0, hi = 200; for (var q = 0; q < 60; q++){ var mid = (lo + hi) / 2; if (f(mid) > x0 / 2) lo = mid; else hi = mid; } half = lo; }   /* sans oscillation : on lit le temps où x = x₀/2 */
      ro.set(2, g > 0 ? S.fmt(half, 2) + " s" : "∞ (pas d'amortissement)"); ro.set(3, S.fmt(bc, 2) + " kg/s");
    });
  }
});

SFA.sim({
  id: "p6-c05-resonance", ch: "c05", tag: "Résonance",
  titre: "Résonance : trouve la fréquence qui fait tout bouger",
  resume: "Un oscillateur excité à sa fréquence propre atteint une grande amplitude, d'autant plus que l'amortissement est faible.",
  but: "Un moteur secoue le support à la fréquence f. Balaye f et observe l'amplitude de la masse (jauge et courbe de résonance). Change la masse (donc f₀) et l'amortissement. Au-delà de 20 cm la structure cède !",
  aRetenir: "Quand la fréquence de l'excitation f est proche de la fréquence propre f₀ = (1/2π)·√(k/m), l'amplitude est maximale : c'est la résonance. Moins il y a d'amortissement, plus le pic est haut et étroit. En-dessous de f₀ la masse suit le moteur ; au-dessus, elle ne suit presque plus. La phase du mouvement par rapport à l'excitation passe de 0° à 180° en traversant f₀.",
  piege: "La résonance « casse » seulement si l'amplitude dépasse ce que la structure supporte et si l'amortissement est faible. Le pont de Tacoma (1940), souvent cité en exemple, s'est surtout effondré par un flottement aéroélastique (le vent entretenait les oscillations), pas par une simple excitation à fréquence fixe. Modèle : régime permanent.",
  build: function(k, S){
    var c = k.canvas(200), g = k.canvas(200), P = S.draw.palette, KK = 80, F0 = 2;
    var f = k.slider("Fréquence d'excitation f", 0.2, 4, 0.05, 0.5, "Hz");
    var m = k.slider("Masse m (k = 80 N/m)", 0.5, 2, 0.1, 0.5, "kg");
    var qs = k.seg("Amortissement", [["10", "Faible (Q = 10)"], ["3", "Moyen (Q = 3)"], ["1.2", "Fort (Q = 1,2)"]], "10");
    var ro = k.readouts(["Fréquence propre f₀", "Amplitude de la masse", "Amplitude ÷ statique", "Phase (retard)"]);
    var nt = k.note("", "ok");
    var t = 0;
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    function amp(fr, mm, Q){
      var w0 = Math.sqrt(KK / mm), w = 2 * Math.PI * fr, b = Math.sqrt(KK * mm) / Q;
      var d = Math.sqrt(Math.pow(w0 * w0 - w * w, 2) + Math.pow(b * w / mm, 2));
      return {A: (F0 / mm) / d, ph: Math.atan2(b * w / mm, w0 * w0 - w * w)};
    }
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, Q = parseFloat(qs.value), f0 = Math.sqrt(KK / m.value) / (2 * Math.PI);
      var r = amp(f.value, m.value, Q), As = F0 / KK, Acm = r.A * 100, broken = Acm > 20;
      var w = 2 * Math.PI * f.value, cy = 100, sc = (W / 2 - 50) / 0.25;
      var xd = 0.02 * Math.sin(w * t), xm = r.A * Math.sin(w * t - r.ph);
      /* support (moteur) et masse */
      ctx.fillStyle = "#b8c1cf"; ctx.fillRect(20 + xd * sc * 0, cy + 38, W - 40, 10);
      var cx0 = W / 2, mx = cx0 + Math.max(-0.26, Math.min(0.26, xm)) * sc, dx = cx0 - 140 + xd * sc;
      ctx.fillStyle = P.amber; ctx.fillRect(dx - 12, cy - 30, 24, 60); S.draw.text(c, "moteur", dx, cy + 62, {size: 12, color: P.amber});
      ctx.beginPath(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.moveTo(dx + 12, cy); var nco = 14, x1 = mx - 22, wl = (x1 - dx - 12) / nco;
      for (var j = 0; j < nco; j++){ ctx.lineTo(dx + 12 + (j + 0.25) * wl, cy - 12); ctx.lineTo(dx + 12 + (j + 0.75) * wl, cy + 12); } ctx.lineTo(x1, cy); ctx.stroke();
      ctx.fillStyle = broken ? P.red : P.acc; var s = 24 + 14 * m.value; ctx.fillRect(mx - s / 2, cy - s / 2, s, s);
      if (broken) S.draw.text(c, "STRUCTURE EN DANGER", W / 2, 20, {size: 15, color: P.red});
      /* courbe de résonance */
      var ymax = 30, ax = S.draw.axes(g, {x0: 0, x1: 4, y0: 0, y1: ymax, xl: "f (Hz)", yl: "amplitude (cm)", l: 52, t: 20, stepX: 0.5, stepY: 10});
      S.draw.line(g, ax.L, ax.Y(20), ax.R, ax.Y(20), P.red, 1.5, [6, 4]); S.draw.text(g, "limite 20 cm", ax.R - 4, ax.Y(20) - 9, {size: 12, color: P.red, align: "right"});
      S.draw.fn(g, ax, function(fr){ return fr < 0.01 ? NaN : amp(fr, m.value, Q).A * 100; }, P.acc, 2.6);
      S.draw.line(g, ax.X(f0), ax.T, ax.X(f0), ax.B, P.green, 1.5, [4, 4]); S.draw.text(g, "f₀", ax.X(f0) + 8, ax.T + 10, {size: 13, color: P.green});
      S.draw.dot(g, ax.X(f.value), ax.Y(Math.min(ymax, Acm)), 6, P.red);
      ro.set(0, S.fmt(f0, 2) + " Hz"); ro.set(1, S.fmt(Acm, 1) + " cm"); ro.set(2, "× " + S.fmt(r.A / As, 1)); ro.set(3, S.fmt(r.ph * 180 / Math.PI, 0) + " °");
      nt.set(Math.abs(f.value - f0) < 0.1 * f0 ? "Tu es à la résonance : la masse accumule l'énergie de chaque poussée." : f.value < f0 ? "Excitation lente : la masse suit le moteur sans amplification." : "Excitation rapide : la masse n'a pas le temps de suivre, l'amplitude chute.", broken ? "bad" : "ok");
    });
  }
});
