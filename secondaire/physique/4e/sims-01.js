/* Physique 4e · chapitre 1 · Mouvement et vitesse */
SFA.sim({
  id:"p4-c01-voiture", ch:"c01", tag:"Graphes",
  titre:"La voiture et son graphique x(t)",
  resume:"Fais rouler une voiture : la position et la vitesse se lisent sur le graphique.",
  but:"Choisis la vitesse et la position de départ, lance l'animation, puis regarde comment la droite x(t) change.",
  aRetenir:"Pour un MRU, x(t) est une droite et sa pente est la vitesse : v = Δx/Δt. Pour passer de m/s à km/h, on multiplie par 3,6.",
  piege:"La pente du graphique donne la vitesse, pas la position. Deux droites parallèles = même vitesse, même si elles ne démarrent pas au même endroit.",
  build:function(k,S){
    var road = k.canvas(120), g = k.canvas(280), st = {t:0};
    var v = k.slider("Vitesse v", -20, 30, 1, 10, "m/s");
    var x0 = k.slider("Position de départ x₀", -40, 40, 5, -20, "m");
    var ts = k.slider("Instant t", 0, 10, 0.1, 0, "s", function(val){ st.t = val; });
    var ro = k.readouts(["Position x(t)", "v en m/s", "v en km/h", "Δx entre 6 s et 8 s"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t = Math.min(10, st.t + dt); ts.set(st.t); if (st.t >= 10) lp.pause(); k.redraw(); });
    k.button("▶ Lancer", function(){ if (st.t >= 10){ st.t = 0; ts.set(0); } lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.button("↺ Départ", function(){ lp.pause(); st.t = 0; ts.set(0); });
    k.draw(function(){
      var V = v.value, X0 = x0.value, T = st.t, X = X0 + V * T, xe = X0 + V * 10;
      var lo = Math.min(X0, xe) - 10, hi = Math.max(X0, xe) + 10;
      if (hi - lo < 60){ var m = (hi + lo) / 2; lo = m - 30; hi = m + 30; }
      lo = Math.floor(lo / 10) * 10; hi = Math.ceil(hi / 10) * 10;
      var pad = 30, RX = function(x){ return pad + (x - lo) / (hi - lo) * (road.W - 2 * pad); };
      road.clear(); var cx = road.ctx;
      cx.fillStyle = "#e3e7ed"; cx.fillRect(0, 78, road.W, 14);
      var step = P4.nice((hi - lo) / 6);
      for (var q = Math.ceil(lo / step) * step; q <= hi + 1e-9; q += step){
        SFA.draw.line(road, RX(q), 78, RX(q), 96, "#8a95a3", 1); P4.label(road, S.fmt(q, 0), RX(q), 108, "#5f6b7a");
      }
      P4.car(road, RX(X), 78, 44, SFA.draw.palette.acc, V < 0 ? -1 : 1);
      if (V !== 0) SFA.draw.arrow(road, RX(X), 22, RX(X) + (V > 0 ? 1 : -1) * Math.min(80, 12 + Math.abs(V) * 3), 22, SFA.draw.palette.red, 3);
      P4.label(road, "x (m)", road.W - 24, 62, "#2c3a4e");
      g.clear();
      var ax = S.draw.axes(g, {x0:0, x1:10, y0:lo, y1:hi, xl:"t (s)", yl:"x (m)", stepX:1});
      S.draw.line(g, ax.X(0), ax.Y(X0), ax.X(10), ax.Y(xe), SFA.draw.palette.acc, 3);
      var a = X0 + V * 6, b = X0 + V * 8;
      S.draw.line(g, ax.X(6), ax.Y(a), ax.X(8), ax.Y(a), SFA.draw.palette.amber, 2, [5, 4]);
      S.draw.line(g, ax.X(8), ax.Y(a), ax.X(8), ax.Y(b), SFA.draw.palette.amber, 2, [5, 4]);
      S.draw.text(g, "Δt = 2 s", ax.X(7), ax.Y(a) + (V >= 0 ? 12 : -12), {size:12, color:SFA.draw.palette.amber});
      S.draw.text(g, "Δx", ax.X(8) + 6, (ax.Y(a) + ax.Y(b)) / 2, {size:12, color:SFA.draw.palette.amber, align:"left"});
      S.draw.line(g, ax.X(T), ax.B, ax.X(T), ax.Y(X), "#b8c0cc", 1, [3, 3]);
      S.draw.dot(g, ax.X(T), ax.Y(X), 6, SFA.draw.palette.red);
      ro.set(0, S.fmt(X, 1) + " m"); ro.set(1, S.fmt(V, 0)); ro.set(2, S.fmt(V * 3.6, 1)); ro.set(3, S.fmt(2 * V, 0) + " m");
      nt.set(V === 0 ? "v = 0 : la voiture est immobile, la droite est horizontale." : V < 0 ? "v < 0 : la voiture recule (vers les x négatifs), la droite descend." : "v > 0 : la voiture avance, la droite monte. Plus v est grand, plus la droite est raide.", V === 0 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"p4-c01-rattrapage", ch:"c01", tag:"Rencontre",
  titre:"Le rattrapage : où et quand se croisent-ils ?",
  resume:"Deux mobiles, une avance, deux vitesses : trouve l'instant et le lieu de la rencontre.",
  but:"Le mobile A part avec une avance sur B. Règle les vitesses et l'avance, puis cherche le point où les deux droites se coupent.",
  aRetenir:"Ils se rencontrent quand leurs positions sont égales : d + v<sub>A</sub>·t = v<sub>B</sub>·t, donc t = d/(v<sub>B</sub> − v<sub>A</sub>). Si v<sub>B</sub> ≤ v<sub>A</sub>, B ne rattrape jamais A.",
  piege:"Ce qui compte pour rattraper, c'est la DIFFÉRENCE des vitesses (la vitesse relative), pas les vitesses séparément.",
  build:function(k,S){
    var road = k.canvas(130), g = k.canvas(280), st = {f:0};
    var d = k.slider("Avance de A sur B", 0, 200, 10, 100, "m");
    var vA = k.slider("Vitesse de A", 0, 30, 1, 10, "m/s");
    var vB = k.slider("Vitesse de B", 0, 40, 1, 20, "m/s");
    var fs = k.slider("Film (0 à 100 % de la durée affichée)", 0, 100, 1, 0, "%", function(val){ st.f = val; });
    var ro = k.readouts(["Instant de rencontre", "Lieu de la rencontre", "Écart à l'instant choisi"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.f = Math.min(100, st.f + dt * 20); fs.set(st.f); if (st.f >= 100) lp.pause(); k.redraw(); });
    k.button("▶ Lancer", function(){ if (st.f >= 100){ st.f = 0; fs.set(0); } lp.play(); }, true);
    k.button("↺ Départ", function(){ lp.pause(); st.f = 0; fs.set(0); });
    k.draw(function(){
      var D = d.value, a = vA.value, b = vB.value, rel = b - a;
      var meet = rel > 0 && D > 0 ? D / rel : null;
      var tmax = meet !== null ? [10,20,30,50,100,200,300].filter(function(z){ return z >= 1.3 * meet; })[0] || 300 : 30;
      var T = tmax * st.f / 100, xA = D + a * T, xB = b * T;
      var ymax = Math.max(D + a * tmax, b * tmax, 20) * 1.05;
      var pad = 30, RX = function(x){ return pad + x / ymax * (road.W - 2 * pad); };
      road.clear(); road.ctx.fillStyle = "#e3e7ed"; road.ctx.fillRect(0, 84, road.W, 14);
      P4.car(road, RX(xA), 84, 38, SFA.draw.palette.red, 1); P4.label(road, "A", RX(xA), 30, SFA.draw.palette.red);
      P4.car(road, RX(xB), 84 + 0, 38, SFA.draw.palette.acc, 1); P4.label(road, "B", RX(xB), 46, SFA.draw.palette.acc);
      P4.label(road, "0", RX(0), 118, "#5f6b7a"); P4.label(road, S.fmt(ymax, 0) + " m", road.W - 36, 118, "#5f6b7a");
      g.clear();
      var ax = S.draw.axes(g, {x0:0, x1:tmax, y0:0, y1:ymax, xl:"t (s)", yl:"x (m)"});
      S.draw.line(g, ax.X(0), ax.Y(D), ax.X(tmax), ax.Y(D + a * tmax), SFA.draw.palette.red, 3);
      S.draw.line(g, ax.X(0), ax.Y(0), ax.X(tmax), ax.Y(b * tmax), SFA.draw.palette.acc, 3);
      P4.label(g, "A", ax.X(tmax) - 10, ax.Y(D + a * tmax) - 12, SFA.draw.palette.red);
      P4.label(g, "B", ax.X(tmax) - 10, ax.Y(b * tmax) + 12, SFA.draw.palette.acc);
      if (meet !== null){
        S.draw.line(g, ax.X(meet), ax.B, ax.X(meet), ax.Y(b * meet), "#8a95a3", 1.5, [4, 4]);
        S.draw.dot(g, ax.X(meet), ax.Y(b * meet), 7, SFA.draw.palette.amber);
      }
      S.draw.line(g, ax.X(T), ax.B, ax.X(T), ax.T, "#b8c0cc", 1, [3, 3]);
      S.draw.dot(g, ax.X(T), ax.Y(xA), 5, SFA.draw.palette.red); S.draw.dot(g, ax.X(T), ax.Y(xB), 5, SFA.draw.palette.acc);
      if (meet !== null){ ro.set(0, S.fmt(meet, 1) + " s"); ro.set(1, S.fmt(b * meet, 0) + " m"); }
      else { ro.set(0, D === 0 ? "dès le départ" : "jamais"); ro.set(1, D === 0 ? "0 m" : "—"); }
      ro.set(2, S.fmt(xA - xB, 0) + " m (t = " + S.fmt(T, 1) + " s)");
      if (D === 0) nt.set("Avance nulle : A et B partent du même point. Ils ne sont ensemble qu'à t = 0 (puis B devance A si v<sub>B</sub> > v<sub>A</sub>).", "warn");
      else if (meet === null) nt.set("v<sub>B</sub> ≤ v<sub>A</sub> : l'écart ne se réduit pas, B ne rattrape jamais A. Les droites ne se coupent pas (pour t > 0).", "bad");
      else nt.set("Vitesse relative : " + S.fmt(rel, 0) + " m/s. L'écart de " + S.fmt(D, 0) + " m diminue de " + S.fmt(rel, 0) + " m chaque seconde : " + S.fmt(D, 0) + " / " + S.fmt(rel, 0) + " = " + S.fmt(meet, 1) + " s.", "");
    });
  }
});

SFA.sim({
  id:"p4-c01-moyenne", ch:"c01", tag:"Piège",
  titre:"Aller à 60, retour à 120 : vitesse moyenne ?",
  resume:"Pourquoi la vitesse moyenne n'est pas la moyenne des vitesses.",
  but:"Choisis la vitesse à l'aller et au retour sur la même distance. Compare la vraie vitesse moyenne avec la moyenne arithmétique, puis essaie le cas « même durée ».",
  aRetenir:"v<sub>moy</sub> = distance totale / durée totale. Sur des distances égales, on passe plus de temps à la vitesse lente : v<sub>moy</sub> = 2·v₁·v₂/(v₁ + v₂) (moyenne harmonique), toujours plus petite que (v₁ + v₂)/2.",
  piege:"« (60 + 120)/2 = 90 km/h » est faux pour un aller-retour de même distance : la vraie valeur est 80 km/h. La moyenne arithmétique n'est correcte que si les DURÉES sont égales.",
  build:function(k,S){
    var g = k.canvas(300);
    var mode = k.seg("Les deux trajets ont…", [["d","même distance"],["t","même durée"]], "d");
    var v1 = k.slider("Vitesse 1 (aller)", 20, 150, 5, 60, "km/h");
    var v2 = k.slider("Vitesse 2 (retour)", 20, 150, 5, 120, "km/h");
    var dd = k.slider("Distance de chaque trajet", 60, 300, 20, 120, "km");
    var ro = k.readouts(["Durée totale", "Distance totale", "Vitesse moyenne", "Moyenne arithmétique"]);
    var nt = k.note("", "");
    k.draw(function(){
      var A = v1.value, B = v2.value, m = mode.value, D = dd.value, d1, d2, t1, t2;
      if (m === "d"){ d1 = D; d2 = D; t1 = D / A; t2 = D / B; }
      else { t1 = D / A; t2 = t1; d1 = A * t1; d2 = B * t2; }   /* même durée : celle du trajet 1 */
      var T = t1 + t2, Dt = d1 + d2, vm = Dt / T, va = (A + B) / 2;
      g.clear();
      var ax = S.draw.axes(g, {x0:0, x1:T * 1.05, y0:0, y1:Math.max(Dt, va * T) * 1.08, xl:"t (h)", yl:"distance parcourue (km)"});
      S.draw.line(g, ax.X(0), ax.Y(0), ax.X(T), ax.Y(Dt), SFA.draw.palette.green, 2.5, [7, 5]);
      S.draw.line(g, ax.X(0), ax.Y(0), ax.X(T), ax.Y(va * T), SFA.draw.palette.amber, 2, [2, 4]);
      var ctx = g.ctx; ctx.save(); ctx.strokeStyle = SFA.draw.palette.acc; ctx.lineWidth = 3.5; ctx.beginPath();
      ctx.moveTo(ax.X(0), ax.Y(0)); ctx.lineTo(ax.X(t1), ax.Y(d1)); ctx.lineTo(ax.X(T), ax.Y(Dt)); ctx.stroke(); ctx.restore();
      S.draw.dot(g, ax.X(t1), ax.Y(d1), 5, SFA.draw.palette.acc);
      P4.label(g, "trajet réel", ax.X(t1) - 6, ax.Y(d1) - 14, SFA.draw.palette.acc, "right");
      P4.label(g, "pente = v moyenne", ax.X(T) - 4, ax.Y(Dt) + 14, SFA.draw.palette.green, "right");
      P4.label(g, "pente = (v₁+v₂)/2", ax.X(T) - 4, ax.Y(va * T) + (Math.abs(va - vm) < 4 ? 30 : 14), SFA.draw.palette.amber, "right");
      ro.set(0, S.fmt(T, 2) + " h"); ro.set(1, S.fmt(Dt, 0) + " km"); ro.set(2, S.fmt(vm, 1) + " km/h"); ro.set(3, S.fmt(va, 1) + " km/h");
      if (m === "d") nt.set("Même distance : t₁ = " + S.fmt(t1, 2) + " h, t₂ = " + S.fmt(t2, 2) + " h. On reste plus longtemps à la vitesse lente, donc v<sub>moy</sub> (" + S.fmt(vm, 1) + ") est plus proche de la plus petite." + (A === B ? " Ici v₁ = v₂ : les deux valeurs coïncident." : ""), A === B ? "" : "warn");
      else nt.set("Même durée (" + S.fmt(t1, 2) + " h chacun) : les distances sont " + S.fmt(d1, 0) + " km et " + S.fmt(d2, 0) + " km. Cette fois v<sub>moy</sub> est bien la moyenne arithmétique.", "");
    });
  }
});

SFA.sim({
  id:"p4-c01-referentiel", ch:"c01", tag:"Référentiel",
  titre:"Dans le train : quelle vitesse, par rapport à quoi ?",
  resume:"Un passager marche dans un train : sa vitesse change selon le référentiel choisi.",
  but:"Règle la vitesse du train et celle du passager (marche dans le train). Change de référentiel : quai ou train.",
  aRetenir:"Une vitesse n'a de sens que par rapport à un référentiel. Si tout se passe sur une même droite : v(passager/quai) = v(train/quai) + v(passager/train).",
  piege:"Marcher vers l'arrière du train : la vitesse du passager par rapport au quai est v<sub>train</sub> − v<sub>marche</sub>. Il peut même être immobile par rapport au quai !",
  build:function(k,S){
    var c = k.canvas(250), st = {off:0};
    var vt = k.slider("Vitesse du train / quai", 0, 30, 1, 20, "m/s");
    var w = k.slider("Marche du passager / train", -5, 5, 0.5, 1.5, "m/s");
    var ref = k.seg("Référentiel", [["q","Quai"],["t","Train"]], "q");
    var ro = k.readouts(["Train / quai", "Passager / train", "Passager / quai", "Quai / train"]);
    var nt = k.note("", "");
    var T = {x:0, p:0};   /* positions en m : train/quai et passager/train */
    var lp = k.loop(function(dt){ T.x += vt.value * dt; T.p += w.value * dt; if (T.p > 8) T.p -= 16; if (T.p < -8) T.p += 16; k.redraw(); });
    k.button("▶ / ❚❚", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    k.button("↺ Départ", function(){ T.x = 0; T.p = 0; });
    lp.play();
    k.draw(function(){
      var VT = vt.value, W = w.value, S8 = 8, qx = c.W;
      c.clear(); var ctx = c.ctx, ground = 190;
      var R = ref.value;
      var off = R === "q" ? 0 : -T.x;           /* décalage du monde (m) selon le référentiel */
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(0, ground, c.W, 8);
      var span = 40, i, Lm = span * (Math.ceil(c.W / (span * S8)) + 1);
      for (i = 0; i < Lm / span; i++){
        var xm = (((i * span + off) % Lm) + Lm) % Lm, xp = xm * S8 - 20;
        if (xp > -20 && xp < c.W + 20){ ctx.fillStyle = "#8a95a3"; ctx.fillRect(xp - 2, ground - 38, 4, 38); ctx.fillStyle = "#b42318"; ctx.fillRect(xp - 5, ground - 44, 10, 6); }
      }
      var trainX = R === "q" ? ((T.x * S8) % (c.W + 240)) - 120 + 0 : c.W / 2 - 80;
      ctx.fillStyle = "#1e3f8f"; ctx.fillRect(trainX, ground - 76, 160, 64);
      ctx.fillStyle = "#dbe7ff"; for (i = 0; i < 4; i++) ctx.fillRect(trainX + 12 + i * 38, ground - 68, 26, 18);
      ctx.fillStyle = "#13233a"; [24, 136].forEach(function(dx){ ctx.beginPath(); ctx.arc(trainX + dx, ground - 10, 8, 0, 6.2832); ctx.fill(); });
      var px = trainX + 80 + T.p * S8;
      ctx.fillStyle = "#f4c542"; ctx.beginPath(); ctx.arc(px, ground - 40, 7, 0, 6.2832); ctx.fill(); ctx.fillRect(px - 3, ground - 33, 6, 18);
      var vPass = R === "q" ? VT + W : W, vTr = R === "q" ? VT : 0;
      var arrow = function(x, y, v, col, lab){ if (v === 0){ P4.label(c, lab + " : 0", x, y, col); return; } SFA.draw.arrow(c, x, y, x + (v > 0 ? 1 : -1) * Math.min(90, 8 + Math.abs(v) * 3), y, col, 3); P4.label(c, lab, x + (v > 0 ? 1 : -1) * 50, y - 12, col); };
      arrow(trainX + 80, 40, vTr, SFA.draw.palette.acc, "train");
      arrow(px, 70, vPass, SFA.draw.palette.amber, "passager");
      P4.label(c, "Référentiel : " + (R === "q" ? "le quai (poteaux fixes)" : "le train (poteaux qui défilent)"), 8, 14, "#2c3a4e", "left");
      ro.set(0, S.fmt(VT, 1) + " m/s"); ro.set(1, S.fmt(W, 1) + " m/s"); ro.set(2, S.fmt(VT + W, 1) + " m/s = " + S.fmt((VT + W) * 3.6, 0) + " km/h"); ro.set(3, S.fmt(-VT, 1) + " m/s");
      nt.set("Échelle : 1 m = 8 px. Ici le passager va à " + S.fmt(vPass, 1) + " m/s dans ce référentiel." + (VT + W === 0 ? " Par rapport au quai il est immobile (sa marche annule celle du train)." : ""), VT + W === 0 ? "warn" : "");
    });
  }
});
