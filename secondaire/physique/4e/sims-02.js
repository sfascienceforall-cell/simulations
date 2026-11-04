/* Physique 4e · chapitre 2 · Accélération et MRUA */
SFA.sim({
  id:"p4-c02-trois-graphes", ch:"c02", tag:"Graphes",
  titre:"Trois graphiques synchronisés : a, v et x",
  resume:"Fais varier l'accélération et vois l'aire sous la courbe devenir la vitesse, puis la distance.",
  but:"Règle la vitesse de départ et l'accélération, puis déplace l'instant t (ou lance l'animation). L'aire colorée sous a(t) donne Δv ; l'aire sous v(t) donne le déplacement.",
  aRetenir:"MRUA : v = v₀ + a·t et x = v₀·t + ½·a·t². Pente de v(t) = accélération. Aire sous v(t) = déplacement. Aire sous a(t) = variation de vitesse.",
  piege:"a = 0 ne veut pas dire « à l'arrêt » (c'est un MRU). Et a < 0 ne veut pas toujours dire « ça ralentit » : si v est aussi négative, le mobile accélère vers l'arrière.",
  build:function(k,S){
    var ga = k.canvas(150), gv = k.canvas(170), gx = k.canvas(170), st = {t:4};
    var v0 = k.slider("Vitesse de départ v₀", -20, 30, 1, 0, "m/s");
    var a = k.slider("Accélération a", -6, 6, 0.5, 3, "m/s²");
    var ts = k.slider("Instant t", 0, 10, 0.1, 4, "s", function(val){ st.t = val; });
    var ro = k.readouts(["a", "v(t)", "x(t) (position)", "Δv = a·t"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t = Math.min(10, st.t + dt); ts.set(st.t); if (st.t >= 10) lp.pause(); k.redraw(); });
    k.button("▶ Lancer", function(){ if (st.t >= 10){ st.t = 0; ts.set(0); } lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.button("↺ t = 0", function(){ lp.pause(); st.t = 0; ts.set(0); });
    k.draw(function(){
      var A = a.value, V0 = v0.value, T = st.t, P = SFA.draw.palette;
      var vf = function(t){ return V0 + A * t; }, xf = function(t){ return V0 * t + 0.5 * A * t * t; };
      var ve = vf(10), vlo = Math.min(0, V0, ve), vhi = Math.max(0, V0, ve); if (vhi - vlo < 10){ vhi += 5; vlo -= 5; }
      var xs = [0, xf(10), xf(5)]; if (A !== 0) xs.push(xf(-V0 / A >= 0 && -V0 / A <= 10 ? -V0 / A : 0));
      var xlo = Math.min.apply(null, xs), xhi = Math.max.apply(null, xs); if (xhi - xlo < 10){ xhi += 5; xlo -= 5; }
      var m = (xhi - xlo) * 0.08; xlo -= m; xhi += m;
      ga.clear(); var ax1 = S.draw.axes(ga, {x0:0, x1:10, y0:-7, y1:7, yl:"a (m/s²)", stepX:1, stepY:2});
      P4.area(ga, ax1, function(){ return A; }, 0, T, "rgba(180,83,9,.30)");
      S.draw.line(ga, ax1.X(0), ax1.Y(A), ax1.X(10), ax1.Y(A), P.amber, 3);
      P4.label(ga, "aire = Δv = " + S.fmt(A * T, 1) + " m/s", ax1.X(5), ax1.Y(A) + (A >= 0 ? -12 : 14), P.amber);
      gv.clear(); var ax2 = S.draw.axes(gv, {x0:0, x1:10, y0:vlo - 3, y1:vhi + 3, yl:"v (m/s)", stepX:1});
      P4.area(gv, ax2, vf, 0, T, "rgba(46,107,85,.28)", "rgba(180,35,24,.22)");
      S.draw.fn(gv, ax2, vf, P.green, 3);
      S.draw.line(gv, ax2.X(T), ax2.Y(0), ax2.X(T), ax2.Y(vf(T)), "#8a95a3", 1, [3, 3]); S.draw.dot(gv, ax2.X(T), ax2.Y(vf(T)), 5, P.red);
      P4.label(gv, "aire = déplacement = " + S.fmt(xf(T), 1) + " m", ax2.X(5), ax2.Y(vhi + 3) + 14, P.green);
      gx.clear(); var ax3 = S.draw.axes(gx, {x0:0, x1:10, y0:xlo, y1:xhi, xl:"t (s)", yl:"x (m)", stepX:1});
      S.draw.fn(gx, ax3, xf, P.acc, 3); S.draw.dot(gx, ax3.X(T), ax3.Y(xf(T)), 6, P.red);
      ro.set(0, S.fmt(A, 1) + " m/s²"); ro.set(1, S.fmt(vf(T), 1) + " m/s (" + S.fmt(vf(T) * 3.6, 0) + " km/h)"); ro.set(2, S.fmt(xf(T), 1) + " m"); ro.set(3, S.fmt(A * T, 1) + " m/s");
      var turn = A !== 0 ? -V0 / A : -1;
      if (A === 0) nt.set("a = 0 : la vitesse reste constante (MRU). v(t) est horizontale, x(t) est une droite.", "warn");
      else if (turn > 0 && turn < 10) nt.set("La vitesse change de signe à t = " + S.fmt(turn, 1) + " s : le mobile s'arrête, puis repart en sens inverse. L'aire sous v(t) est alors comptée négative (en rouge).", "warn");
      else nt.set(V0 * A > 0 || (V0 === 0) ? "v et a ont le même signe : le mobile accélère (|v| augmente)." : "v et a de signes opposés : le mobile ralentit.", "");
    });
  }
});

SFA.sim({
  id:"p4-c02-profil", ch:"c02", tag:"Défi",
  titre:"Dessine la vitesse, le mobile suit",
  resume:"Tire les points du graphique v(t) : l'aire sous la courbe est la distance. Atteins la distance cible.",
  but:"Glisse les 5 points du graphique (au doigt ou à la souris). Le mobile suit ce profil de vitesse. Défi : parcourir exactement la distance cible en 8 s.",
  aRetenir:"Pente d'un segment de v(t) = accélération de ce segment. Aire sous v(t) = distance parcourue. Deux profils différents peuvent donner la même distance.",
  piege:"Un segment horizontal n'est pas un arrêt : c'est une vitesse constante non nulle (a = 0). L'arrêt, c'est v = 0.",
  build:function(k,S){
    var road = k.canvas(100), g = k.canvas(300), st = {t:0, v:[0, 10, 20, 20, 10], drag:-1};
    var tgt = k.select("Distance cible", [[60,"60 m"],[100,"100 m"],[150,"150 m"],[0,"Libre (pas de cible)"]], 100);
    var ro = k.readouts(["Distance totale (aire)", "Vitesse moyenne", "a max (en valeur)", "Écart à la cible"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t = Math.min(8, st.t + dt); if (st.t >= 8) lp.pause(); k.redraw(); });
    k.button("▶ Lancer le mobile", function(){ st.t = 0; lp.play(); }, true);
    k.button("↺ Profil par défaut", function(){ st.v = [0, 10, 20, 20, 10]; st.t = 8; });
    var YMAX = 30;
    function xAt(T){   /* position exacte : intégrale d'une fonction affine par morceaux */
      var x = 0, i, s, a, seg;
      for (i = 0; i < 4; i++){ seg = 2; s = Math.min(seg, Math.max(0, T - 2 * i)); if (s <= 0) break; a = (st.v[i + 1] - st.v[i]) / 2; x += st.v[i] * s + 0.5 * a * s * s; }
      return x;
    }
    var ax;
    function ptPix(i){ return {x:ax.X(2 * i), y:ax.Y(st.v[i])}; }
    g.pointer(function(type, p){
      if (!ax) return;
      if (type === "down"){ var best = -1, bd = 30; for (var i = 0; i < 5; i++){ var q = ptPix(i), dd = Math.hypot(q.x - p.x, q.y - p.y); if (dd < bd){ bd = dd; best = i; } } st.drag = best; }
      if ((type === "down" || type === "drag") && st.drag >= 0){ st.v[st.drag] = Math.max(0, Math.min(YMAX, Math.round(ax.iy(p.y)))); st.t = 8; k.redraw(); }
      if (type === "up") st.drag = -1;
    });
    k.draw(function(){
      var P = SFA.draw.palette, T = st.t, tot = xAt(8), x = xAt(T), i;
      var vAt = function(t){ var j = Math.min(3, Math.floor(t / 2)); return st.v[j] + (st.v[j + 1] - st.v[j]) * (t - 2 * j) / 2; };
      var xmax = 240, pad = 24, RX = function(m){ return pad + Math.min(m, xmax) / xmax * (road.W - 2 * pad); };
      road.clear(); road.ctx.fillStyle = "#e3e7ed"; road.ctx.fillRect(0, 66, road.W, 12);
      for (i = 0; i <= 240; i += 40){ S.draw.line(road, RX(i), 66, RX(i), 82, "#8a95a3", 1); P4.label(road, i + "", RX(i), 92, "#5f6b7a"); }
      var T0 = +tgt.value; if (T0 > 0){ S.draw.line(road, RX(T0), 20, RX(T0), 66, P.green, 3, [4, 3]); P4.label(road, "cible " + T0 + " m", RX(T0), 12, P.green); }
      P4.car(road, RX(x), 66, 38, P.acc, 1);
      g.clear(); ax = S.draw.axes(g, {x0:0, x1:8, y0:0, y1:YMAX + 2, xl:"t (s)", yl:"v (m/s)", stepX:1, stepY:5});
      var ctx = g.ctx; ctx.save(); ctx.fillStyle = "rgba(30,63,143,.16)"; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0));
      for (i = 0; i < 5; i++) ctx.lineTo(ax.X(2 * i), ax.Y(st.v[i])); ctx.lineTo(ax.X(8), ax.Y(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.save(); ctx.strokeStyle = P.acc; ctx.lineWidth = 3; ctx.beginPath(); for (i = 0; i < 5; i++){ if (i) ctx.lineTo(ax.X(2 * i), ax.Y(st.v[i])); else ctx.moveTo(ax.X(0), ax.Y(st.v[0])); } ctx.stroke(); ctx.restore();
      for (i = 0; i < 5; i++){ S.draw.dot(g, ax.X(2 * i), ax.Y(st.v[i]), 9, "#fff"); S.draw.dot(g, ax.X(2 * i), ax.Y(st.v[i]), 6, P.acc); }
      for (i = 0; i < 4; i++){ var aa = (st.v[i + 1] - st.v[i]) / 2; P4.label(g, "a = " + S.fmt(aa, 1), ax.X(2 * i + 1), ax.Y(YMAX + 0.5) , aa > 0 ? P.green : aa < 0 ? P.red : P.grey); }
      S.draw.line(g, ax.X(T), ax.B, ax.X(T), ax.Y(vAt(T)), "#8a95a3", 1, [3, 3]); S.draw.dot(g, ax.X(T), ax.Y(vAt(T)), 5, P.red);
      var amax = 0; for (i = 0; i < 4; i++) amax = Math.max(amax, Math.abs(st.v[i + 1] - st.v[i]) / 2);
      ro.set(0, S.fmt(tot, 1) + " m"); ro.set(1, S.fmt(tot / 8, 2) + " m/s"); ro.set(2, S.fmt(amax, 1) + " m/s²");
      if (T0 > 0){ var e = tot - T0; ro.set(3, (e > 0 ? "+" : "") + S.fmt(e, 1) + " m");
        nt.set(Math.abs(e) < 0.5 ? "Bravo : tu as parcouru " + S.fmt(tot, 1) + " m, la cible est atteinte !" : e > 0 ? "Trop loin de " + S.fmt(e, 1) + " m : baisse un point (aire plus petite)." : "Il manque " + S.fmt(-e, 1) + " m : monte un point (aire plus grande).", Math.abs(e) < 0.5 ? "" : "warn"); }
      else { ro.set(3, "—"); nt.set("Mode libre : tire les points et observe la distance.", ""); }
    });
  }
});

SFA.sim({
  id:"p4-c02-freinage", ch:"c02", tag:"Sécurité routière",
  titre:"Distance de freinage et d'arrêt",
  resume:"Réaction + freinage : pourquoi doubler la vitesse multiplie le freinage par 4.",
  but:"Choisis la vitesse, l'état de la route et le temps de réaction. Un obstacle est placé devant toi : évite-le, ou vois à quelle vitesse tu le heurtes.",
  aRetenir:"Distance d'arrêt = distance de réaction (v·t<sub>r</sub>) + distance de freinage (v²/2a). La distance de freinage est proportionnelle à v² : vitesse ×2, freinage ×4.",
  piege:"On croit que « 10 km/h de plus » est sans conséquence. Mais la distance de freinage grandit avec le carré de la vitesse. Les valeurs de a sont des ordres de grandeur (modèle simplifié, freinage constant).",
  build:function(k,S){
    var g = k.canvas(230), road = k.canvas(120);
    var kmh = k.slider("Vitesse initiale", 30, 130, 5, 50, "km/h");
    var surf = k.seg("Route", [[7,"Sèche"],[4,"Mouillée"],[2,"Neige"],[1,"Verglas"]], 7);
    var tr = k.slider("Temps de réaction", 0.2, 2, 0.1, 1, "s");
    var ob = k.slider("Obstacle à", 10, 300, 5, 60, "m");
    var ro = k.readouts(["Distance de réaction", "Distance de freinage", "Distance d'arrêt", "Résultat"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, v = kmh.value / 3.6, a = +surf.value, t = tr.value, O = ob.value;
      var dr = v * t, db = v * v / (2 * a), dtot = dr + db, tb = v / a, T = t + tb;
      g.clear(); var ax = S.draw.axes(g, {x0:0, x1:T * 1.05, y0:0, y1:v * 1.12, xl:"t (s)", yl:"v (m/s)"});
      var vf = function(s){ return s <= t ? v : Math.max(0, v - a * (s - t)); };
      P4.area(g, ax, function(s){ return s <= t ? v : 0; }, 0, t, "rgba(180,83,9,.30)");
      P4.area(g, ax, vf, t, T, "rgba(30,63,143,.22)");
      S.draw.fn(g, ax, vf, P.acc, 3);
      P4.label(g, "réaction", ax.X(t / 2), ax.Y(v / 2), P.amber); P4.label(g, "freinage", ax.X(t + tb / 2), ax.Y(v / 3), P.acc);
      var xmax = Math.max(dtot, O) * 1.12, pad = 24, RX = function(m){ return pad + m / xmax * (road.W - 2 * pad); };
      road.clear(); var cx = road.ctx; cx.fillStyle = "#e3e7ed"; cx.fillRect(0, 70, road.W, 14);
      cx.fillStyle = "rgba(180,83,9,.45)"; cx.fillRect(RX(0), 56, RX(dr) - RX(0), 12);
      cx.fillStyle = "rgba(30,63,143,.45)"; cx.fillRect(RX(dr), 56, RX(dtot) - RX(dr), 12);
      cx.fillStyle = "#b42318"; cx.fillRect(RX(O) - 4, 38, 8, 44); P4.label(road, "obstacle " + O + " m", Math.min(road.W - 50, RX(O)), 26, P.red);
      P4.car(road, RX(0) + 16, 70, 30, P.acc, 1);
      P4.label(road, "arrêt à " + S.fmt(dtot, 0) + " m", Math.min(road.W - 40, Math.max(40, RX(dtot))), 104, "#2c3a4e");
      ro.set(0, S.fmt(dr, 1) + " m"); ro.set(1, S.fmt(db, 1) + " m"); ro.set(2, S.fmt(dtot, 1) + " m");
      if (dtot <= O){ ro.set(3, "Arrêt à " + S.fmt(O - dtot, 1) + " m de l'obstacle"); nt.set("Tu t'arrêtes avant l'obstacle (il reste " + S.fmt(O - dtot, 1) + " m).", ""); }
      else {
        var vi2 = O <= dr ? v * v : v * v - 2 * a * (O - dr), vi = Math.sqrt(Math.max(0, vi2));
        ro.set(3, "Choc à " + S.fmt(vi * 3.6, 0) + " km/h"); nt.set(O <= dr ? "Tu n'as même pas commencé à freiner quand tu atteins l'obstacle : choc à pleine vitesse." : "Collision : à l'obstacle, il reste " + S.fmt(vi * 3.6, 0) + " km/h (v² = v₀² − 2·a·d<sub>freinage</sub>).", "warn");
      }
    });
  }
});

SFA.sim({
  id:"p4-c02-dragsters", ch:"c02", tag:"Comparaison",
  titre:"Course de dragsters : qui gagne dépend de la distance",
  resume:"Une voiture démarre fort, l'autre va plus vite à fond : l'ordre d'arrivée change avec la longueur de la course.",
  but:"Chaque voiture accélère uniformément jusqu'à sa vitesse maximale, puis garde cette vitesse. Change la longueur de la course et regarde le vainqueur.",
  aRetenir:"Une forte accélération gagne les courses courtes ; une grande vitesse maximale gagne les courses longues. Le graphique x(t) montre les courbes qui se croisent.",
  piege:"Avoir la plus grande accélération ne garantit pas de gagner, et la plus grande vitesse maximale non plus. Il faut comparer les durées pour une distance donnée.",
  build:function(k,S){
    var road = k.canvas(120), g = k.canvas(260), st = {t:0};
    var aA = k.slider("Voiture A : accélération", 2, 10, 0.5, 8, "m/s²");
    var vA = k.slider("Voiture A : vitesse max.", 20, 60, 5, 30, "m/s");
    var aB = k.slider("Voiture B : accélération", 2, 10, 0.5, 4, "m/s²");
    var vB = k.slider("Voiture B : vitesse max.", 20, 60, 5, 50, "m/s");
    var L = k.slider("Longueur de la course", 50, 1000, 10, 100, "m");
    var ro = k.readouts(["Temps de A", "Temps de B", "Vainqueur"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t += dt * 2; k.redraw(); });
    k.button("▶ Départ", function(){ st.t = 0; lp.play(); }, true);
    k.button("↺ Remise à zéro", function(){ lp.pause(); st.t = 0; });
    function pos(a, vm, t){ var ta = vm / a; return t <= ta ? 0.5 * a * t * t : vm * vm / (2 * a) + vm * (t - ta); }
    function dur(a, vm, D){ var da = vm * vm / (2 * a); return D <= da ? Math.sqrt(2 * D / a) : vm / a + (D - da) / vm; }
    k.draw(function(){
      var P = SFA.draw.palette, D = L.value, tA = dur(aA.value, vA.value, D), tB = dur(aB.value, vB.value, D), tm = Math.max(tA, tB) * 1.1, T = Math.min(st.t, Math.max(tA, tB) + 1);
      if (st.t > Math.max(tA, tB) + 3) lp.pause();
      var xa = Math.min(D, pos(aA.value, vA.value, T)), xb = Math.min(D, pos(aB.value, vB.value, T)), pad = 30;
      var RX = function(m){ return pad + m / D * (road.W - 2 * pad - 20); };
      road.clear(); road.ctx.fillStyle = "#e3e7ed"; road.ctx.fillRect(0, 40, road.W, 12); road.ctx.fillRect(0, 88, road.W, 12);
      S.draw.line(road, RX(D) + 10, 20, RX(D) + 10, 104, P.green, 3, [4, 3]); P4.label(road, "arrivée " + D + " m", road.W - 50, 12, P.green);
      P4.car(road, RX(xa), 52, 34, P.red, 1); P4.car(road, RX(xb), 100, 34, P.acc, 1);
      P4.label(road, "A", 12, 32, P.red); P4.label(road, "B", 12, 80, P.acc);
      g.clear(); var ax = S.draw.axes(g, {x0:0, x1:tm, y0:0, y1:D * 1.08, xl:"t (s)", yl:"x (m)"});
      S.draw.fn(g, ax, function(t){ return pos(aA.value, vA.value, t); }, P.red, 3); S.draw.fn(g, ax, function(t){ return pos(aB.value, vB.value, t); }, P.acc, 3);
      S.draw.line(g, ax.X(0), ax.Y(D), ax.X(tm), ax.Y(D), P.green, 1.5, [5, 4]);
      S.draw.dot(g, ax.X(tA), ax.Y(D), 5, P.red); S.draw.dot(g, ax.X(tB), ax.Y(D), 5, P.acc);
      ro.set(0, S.fmt(tA, 2) + " s"); ro.set(1, S.fmt(tB, 2) + " s");
      var diff = Math.abs(tA - tB); ro.set(2, diff < 0.005 ? "égalité" : (tA < tB ? "A de " : "B de ") + S.fmt(diff, 2) + " s");
      nt.set(diff < 0.005 ? "Égalité parfaite." : (tA < tB ? "A" : "B") + " gagne. Change la longueur : le classement peut s'inverser. (Modèle simplifié : accélération constante puis vitesse constante.)", "");
    });
  }
});
