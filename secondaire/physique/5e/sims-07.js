/* Chapitre 7 · Gravitation universelle et mouvement des astres */
(function(){
var G = 6.674e-11, MT = 5.972e24, RT = 6.371e6, ML = 7.348e22, DL = 3.844e8, GMT = G * MT;
SFA.sim({
  id: "p5-c07-terre-lune", ch: "c07", tag: "Classique",
  titre: "Terre et Lune : la loi de gravitation universelle",
  resume: "Masses et distance → force, vitesse et période.",
  but: "Fais varier la distance entre la Terre et la Lune, puis les masses. Que devient la force quand la distance double ? Les deux astres subissent-ils la même force ? Compare la période obtenue (27 jours) avec les valeurs réelles.",
  aRetenir: "F = G·m₁·m₂/r². Doubler la distance divise la force par 4 ; doubler une masse double la force. Les deux astres exercent l'un sur l'autre des forces de même valeur (troisième loi), mais le plus léger accélère le plus.",
  piege: "La force sur la Lune n'est pas plus petite que sur la Terre : elle est égale. C'est l'accélération (a = F/m) qui est plus grande pour la Lune. Et la loi est en 1/r², pas en 1/r.",
  build: function(k, S){
    var c = k.canvas(260), gr = k.canvas(160);
    var d = k.slider("Distance Terre-Lune (centre à centre)", 50, 800, 1, 384, "·10³ km");
    var fT = k.slider("Masse de la Terre (en masses terrestres)", 0.5, 5, 0.1, 1, "M⊕");
    var fL = k.slider("Masse de la Lune (en masses lunaires)", 0.1, 10, 0.1, 1, "M☾");
    var ro = k.readouts(["Force F (sur chaque astre)", "Accélération de la Lune", "Accélération de la Terre", "Période de révolution", "Vitesse de la Lune"]);
    var nt = k.note("", ""), ph = 0;
    var lp = k.loop(function(dt){ ph += dt * 2 * Math.PI / 9; k.redraw(); }); lp.play();
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, M1 = MT * fT.value, M2 = ML * fL.value, r = d.value * 1e6;
      var F = G * M1 * M2 / (r * r), aL = F / M2, aT = F / M1, T = 2 * Math.PI * Math.sqrt(r * r * r / (G * (M1 + M2))), rL = r * M1 / (M1 + M2), vL = 2 * Math.PI * rL / T;
      c.clear();
      var cx = c.W / 2, cy = 130, sc = Math.min(c.W / 2 - 50, 105) / 800, rr = r / 1e6 * sc;      /* px */
      var rE = rr * (M2 / (M1 + M2)), rM = rr * (M1 / (M1 + M2));
      ctx.strokeStyle = "#cbd3de"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, rM, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
      var ex = cx - rE * Math.cos(ph), ey = cy + rE * Math.sin(ph), mx = cx + rM * Math.cos(ph), my = cy - rM * Math.sin(ph);
      S.draw.dot(c, ex, ey, 20 + 6 * Math.cbrt(fT.value), pal.acc); S.draw.dot(c, mx, my, 6 + 4 * Math.cbrt(fL.value), pal.grey);
      S.draw.line(c, ex, ey, mx, my, "#b6c0cf", 1.5, [3, 3]);
      var ux = (mx - ex) / Math.hypot(mx - ex, my - ey), uy = (my - ey) / Math.hypot(mx - ex, my - ey), La = 46;
      P5.vec(c, mx, my, mx - ux * La, my - uy * La, pal.red, "F", {});
      P5.vec(c, ex, ey, ex + ux * La, ey + uy * La, pal.red, "F", {});
      S.draw.text(c, "tailles et échelle de masse non réalistes ; mouvement accéléré", 10, c.H - 12, {align: "left", size: 12, color: pal.grey});
      S.draw.text(c, "Les deux forces ont la même valeur (3e loi de Newton)", c.W / 2, 20, {size: 13, color: pal.red});
      gr.clear();
      var Fs = function(x){ return G * M1 * M2 / Math.pow(x * 1e6, 2) / 1e20; }, ymax = Fs(50) * 1.05;
      var ax = S.draw.axes(gr, {x0: 0, x1: 800, y0: 0, y1: ymax, xl: "r (10³ km)", yl: "F (10²⁰ N)", stepX: 100, l: 50});
      S.draw.fn(gr, ax, function(x){ return x < 40 ? Infinity : Fs(x); }, pal.red);
      S.draw.dot(gr, ax.X(d.value), ax.Y(F / 1e20), 6, pal.acc);
      ro.set(0, S.sci(F, 2) + " N"); ro.set(1, S.sci(aL, 2) + " m/s²"); ro.set(2, S.sci(aT, 2) + " m/s²");
      ro.set(3, S.fmt(T / 86400, 1) + " jours"); ro.set(4, S.fmt(vL / 1000, 2) + " km/s");
      nt.set("F = G·M·m/r² = " + S.sci(F, 2) + " N. À la distance moyenne réelle (384 000 km, masses réelles), on trouve 1,98·10²⁰ N et 27,3 jours. Période : T = 2π·√(r³/(G·(M + m))).", "");
    });
  }
});

SFA.sim({
  id: "p5-c07-satellite", ch: "c07", tag: "Orbites",
  titre: "Satellite : altitude, vitesse, période et satellite géostationnaire",
  resume: "Altitude → g, vitesse orbitale, période. Trouve l'orbite géostationnaire.",
  but: "Change l'altitude du satellite. Repère à quelle altitude sa période est de 24 h : le satellite reste alors au-dessus du même point de l'équateur (point jaune). Remarque la valeur de g en orbite.",
  aRetenir: "Un satellite en orbite circulaire est en chute libre : la gravité est la force centripète, G·M·m/r² = m·v²/r, donc v = √(G·M/r) et T = 2π·√(r³/(G·M)). Plus on est haut, plus on va lentement et plus la période est longue. Géostationnaire : T = 23 h 56 min, h ≈ 35 800 km.",
  piege: "En orbite, la gravité n'est pas nulle : à 400 km d'altitude, g vaut encore ≈ 8,7 m/s² (89 % de sa valeur au sol). Les astronautes flottent parce qu'ils tombent en même temps que leur vaisseau, pas parce qu'il n'y a plus de gravité.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.8});
    var h = k.slider("Altitude du satellite", 200, 60000, 100, 400, "km");
    k.button("Station spatiale (400 km)", function(){ h.set(400); });
    k.button("GPS (20 200 km)", function(){ h.set(20200); });
    k.button("Géostationnaire (35 786 km)", function(){ h.set(35786); });
    var ro = k.readouts(["g à cette altitude", "Vitesse orbitale", "Période", "g / g au sol"]);
    var nt = k.note("", ""), t = 0, Tsid = 86164;
    var lp = k.loop(function(dt){ t += dt * 1800; k.redraw(); }); lp.play();      /* 1 s = 30 min */
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, H = h.value * 1000, r = RT + H, g = GMT / (r * r), v = Math.sqrt(GMT / r), T = 2 * Math.PI * Math.sqrt(r * r * r / GMT);
      c.clear();
      var cx = c.W / 2, cy = c.H / 2, R = Math.min(c.W, c.H) / 2 - 22, rpx = R, epx = Math.max(RT / r * R, 8);
      ctx.strokeStyle = "#cbd3de"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, rpx, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
      var eA = 2 * Math.PI * t / Tsid, sA = 2 * Math.PI * t / T;
      S.draw.dot(c, cx, cy, epx, "#8db3e8");
      ctx.strokeStyle = "#5b82bd"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, epx, 0, 2 * Math.PI); ctx.stroke();
      S.draw.dot(c, cx + epx * Math.cos(eA), cy - epx * Math.sin(eA), 4.5, pal.yellow);
      var sx = cx + rpx * Math.cos(sA), sy = cy - rpx * Math.sin(sA);
      S.draw.line(c, cx, cy, sx, sy, "#e2e7ee", 1);
      S.draw.dot(c, sx, sy, 6, pal.red);
      P5.vec(c, sx, sy, sx + (cx - sx) / rpx * 34, sy + (cy - sy) / rpx * 34, pal.red, "", {w: 2});
      S.draw.text(c, "Terre", cx, cy + epx + 14 > c.H - 8 ? cy : cy, {size: 12, color: "#fff"});
      S.draw.text(c, "point jaune : un lieu de l'équateur", 10, c.H - 12, {align: "left", size: 12, color: pal.grey});
      S.draw.text(c, "1 seconde à l'écran = 30 minutes", 10, 16, {align: "left", size: 12, color: pal.grey});
      ro.set(0, S.fmt(g, 2) + " m/s²"); ro.set(1, S.fmt(v / 1000, 2) + " km/s (" + S.fmt(v * 3.6, 0) + " km/h)"); ro.set(2, S.fmt(T / 3600, 2) + " h (" + S.fmt(T / 60, 0) + " min)"); ro.set(3, S.fmt(100 * g / 9.82, 0) + " %");
      var geo = Math.abs(T - Tsid) < 120;
      nt.set(geo ? "Orbite géostationnaire : T ≈ 24 h (un jour sidéral), le satellite reste au-dessus du même point de l'équateur." : "Le satellite tombe en permanence vers la Terre avec a = g = " + S.fmt(g, 2) + " m/s², mais sa vitesse horizontale est assez grande pour que le sol se « dérobe » : il reste à la même altitude.", geo ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "p5-c07-newton", ch: "c07", tag: "Niche utile",
  titre: "Le canon de Newton : de la chute à l'orbite et à l'évasion",
  resume: "Vitesse de tir depuis une montagne → impact, orbite, évasion.",
  but: "Tire horizontalement depuis une très haute montagne. Augmente la vitesse initiale : repère le moment où le projectile ne retombe plus (orbite) et celui où il s'échappe. Le bouton « Vitesse circulaire » règle la valeur exacte.",
  aRetenir: "À une vitesse horizontale donnée au-dessus d'une planète : v < v_c : le projectile retombe (ou orbite en ellipse s'il évite le sol) ; v = v_c = √(G·M/r) : orbite circulaire ; v_c < v < √2·v_c : ellipse ; v ≥ √2·v_c : évasion. Au niveau du sol terrestre, v_c ≈ 7,9 km/s et v_évasion ≈ 11,2 km/s.",
  piege: "Satelliser, ce n'est pas monter très haut : c'est surtout aller très vite horizontalement. Un projectile en orbite circulaire est en chute libre permanente, et il n'y a pas de limite « d'atmosphère » dans ce modèle (on néglige l'air).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.8});
    var h0 = k.slider("Altitude de la montagne", 0, 1500, 50, 300, "km");
    var v0 = k.slider("Vitesse horizontale de tir", 1, 12, 0.01, 6, "km/s");
    k.button("Vitesse circulaire", function(){ v0.set(Math.round(Math.sqrt(GMT / (RT + h0.value * 1000)) / 10) / 100); });
    k.button("Vitesse d'évasion", function(){ v0.set(Math.min(12, Math.ceil(Math.sqrt(2 * GMT / (RT + h0.value * 1000)) / 10) / 100)); });
    var ro = k.readouts(["Vitesse circulaire v_c", "Vitesse d'évasion", "Résultat", "Altitude min.", "Altitude max."]);
    var nt = k.note("", "");
    function orbit(r0, V){
      var mu = GMT, pts = [], x = r0, y = 0, vx = 0, vy = V, dt = 15, ang = 0, minr = r0, maxr = r0, impact = false, lastA = 0, swept = 0;
      function acc(px, py){ var r = Math.hypot(px, py), q = -mu / (r * r * r); return [q * px, q * py]; }
      for (var i = 0; i < 40000; i++){
        var a1 = acc(x, y), x2 = x + vx * dt / 2, y2 = y + vy * dt / 2, vx2 = vx + a1[0] * dt / 2, vy2 = vy + a1[1] * dt / 2, a2 = acc(x2, y2);
        var x3 = x + vx2 * dt / 2, y3 = y + vy2 * dt / 2, vx3 = vx + a2[0] * dt / 2, vy3 = vy + a2[1] * dt / 2, a3 = acc(x3, y3);
        var x4 = x + vx3 * dt, y4 = y + vy3 * dt, vx4 = vx + a3[0] * dt, vy4 = vy + a3[1] * dt, a4 = acc(x4, y4);
        x += dt / 6 * (vx + 2 * vx2 + 2 * vx3 + vx4); y += dt / 6 * (vy + 2 * vy2 + 2 * vy3 + vy4);
        vx += dt / 6 * (a1[0] + 2 * a2[0] + 2 * a3[0] + a4[0]); vy += dt / 6 * (a1[1] + 2 * a2[1] + 2 * a3[1] + a4[1]);
        var r = Math.hypot(x, y); minr = Math.min(minr, r); maxr = Math.max(maxr, r);
        if (i % 6 === 0) pts.push([x, y]);
        if (r <= RT){ impact = true; pts.push([x, y]); break; }
        var A = Math.atan2(y, x); var dA = A - lastA; if (dA < -Math.PI) dA += 2 * Math.PI; if (dA > Math.PI) dA -= 2 * Math.PI; swept += dA; lastA = A;
        if (r > 6 * r0 + 3e7) break;
        if (Math.abs(swept) > 2 * Math.PI * 1.02) break;
      }
      return {pts: pts, impact: impact, minr: minr, maxr: maxr};
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, r0 = RT + h0.value * 1000, V = v0.value * 1000, vc = Math.sqrt(GMT / r0), ve = Math.SQRT2 * vc;
      var o = orbit(r0, V); c.clear();
      /* périgée / apogée exacts (énergie et moment cinétique conservés) : plus fiables que l'intégration numérique */
      var q = V * V / (vc * vc), rpe = V < vc ? r0 * q / (2 - q) : r0, rap = V >= vc ? (q < 2 ? r0 * q / (2 - q) : Infinity) : r0;
      o.impact = V < vc && rpe <= RT; if (!o.impact){ o.minr = rpe; o.maxr = rap; }
      var half = Math.min(c.W, c.H) / 2 - 12, view = Math.max(r0 * 2.6, 1.6 * Math.min(o.maxr, r0 * 6)), sc = half / (view / 2) * 1.0;
      var cx = c.W / 2, cy = c.H / 2;
      sc = Math.min((c.W / 2 - 14) / (view / 2), (c.H / 2 - 14) / (view / 2));
      S.draw.dot(c, cx, cy, RT * sc, "#8db3e8"); ctx.strokeStyle = "#5b82bd"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, RT * sc, 0, 2 * Math.PI); ctx.stroke();
      ctx.fillStyle = "#a98b63"; ctx.beginPath(); ctx.arc(cx, cy, RT * sc, -1.5707963 - 0.02, -1.5707963 + 0.02); ctx.lineTo(cx + 0, cy - r0 * sc); ctx.fill();
      ctx.strokeStyle = o.impact ? pal.red : pal.acc; ctx.lineWidth = 2.4; ctx.beginPath();
      o.pts.forEach(function(p, i){ var X = cx + p[1] * sc, Y = cy - p[0] * sc; if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }); ctx.stroke();
      S.draw.dot(c, cx, cy - r0 * sc, 5, pal.amber);
      S.draw.text(c, "départ", cx + 8, cy - r0 * sc - 10, {align: "left", size: 12, color: pal.amber});
      var res, kind;
      if (V >= ve - 1) { res = "évasion (trajectoire ouverte)"; kind = "ok"; }
      else if (o.impact) { res = "retombe au sol"; kind = "warn"; }
      else if (Math.abs(V - vc) < 0.012 * 1000) { res = "orbite quasi circulaire"; kind = "ok"; }
      else { res = "orbite elliptique"; kind = "ok"; }
      ro.set(0, S.fmt(vc / 1000, 2) + " km/s"); ro.set(1, S.fmt(ve / 1000, 2) + " km/s"); ro.set(2, res);
      ro.set(3, o.impact ? "0 (impact)" : S.fmt((o.minr - RT) / 1000, 0) + " km"); ro.set(4, V >= ve - 1 ? "∞" : S.fmt((o.maxr - RT) / 1000, 0) + " km");
      nt.set(V >= ve - 1 ? "v ≥ √2·v_c : l'énergie est suffisante pour échapper à l'attraction de la Terre (modèle sans air et sans autres astres)." : o.impact ? "La vitesse est inférieure à v_c : la trajectoire finit par couper le sol. Plus v est grande, plus l'impact est loin." : V < vc ? "v est inférieure à v_c, mais le point le plus bas de l'ellipse reste au-dessus du sol : le projectile tourne autour de la Terre (le point de tir est l'apogée)." : "v est comprise entre v_c et √2·v_c (ou égale à v_c) : le projectile ne touche plus le sol, il tourne autour de la Terre.", kind);
    });
  }
});

SFA.sim({
  id: "p5-c07-kepler", ch: "c07", tag: "Kepler",
  titre: "Lois de Kepler : ellipse, aires égales et T² = a³",
  resume: "Excentricité, distance moyenne, masse de l'étoile → trajectoire et période.",
  but: "Règle le demi-grand axe a, l'excentricité e et la masse de l'étoile. Observe que la planète va plus vite près de l'étoile (secteurs d'aires égales). Cherche comment T dépend de a.",
  aRetenir: "1) Orbite elliptique dont l'étoile occupe un foyer ; 2) aires balayées égales en durées égales (plus rapide près de l'étoile) ; 3) T²/a³ est constant pour un même astre central : T² = a³/M (T en années, a en UA, M en masses solaires).",
  piege: "Ce n'est pas la distance qui fixe la période seule : elle dépend de a (demi-grand axe) et de la masse centrale, pas de l'excentricité. Et l'étoile est au foyer, pas au centre de l'ellipse.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.7});
    var a = k.slider("Demi-grand axe a", 0.4, 5, 0.1, 1, "UA");
    var e = k.slider("Excentricité e", 0, 0.8, 0.01, 0.5, "");
    var M = k.slider("Masse de l'étoile", 0.5, 2, 0.1, 1, "M☉");
    var sp = k.seg("Vitesse du temps", [[0.25, "0,25 an/s"], [0.1, "0,1 an/s"]], 0.25);
    var secs = k.toggle("Montrer des secteurs d'aires égales (durées égales)", true);
    var ro = k.readouts(["Période T", "T²/a³ (an²/UA³)", "Distance mini", "Distance maxi", "Vitesse au périhélie", "Vitesse à l'aphélie"]);
    var nt = k.note("", ""), t = 0;
    var lp = k.loop(function(dt){ t += dt * sp.value; k.redraw(); }); lp.play();
    function kep(Mm, ee){ var E = Mm; for (var i = 0; i < 30; i++){ E = E - (E - ee * Math.sin(E) - Mm) / (1 - ee * Math.cos(E)); } return E; }
    function pos(aa, ee, E){ return [aa * (Math.cos(E) - ee), aa * Math.sqrt(1 - ee * ee) * Math.sin(E)]; }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, A = a.value, ee = e.value, T = Math.sqrt(A * A * A / M.value); c.clear();
      var rmax = A * (1 + ee), rmin = A * (1 - ee), bb = A * Math.sqrt(1 - ee * ee), xr0 = -rmax, xr1 = A * (1 + ee) , yr = Math.max(bb, 0.3);
      var wU = (A * (1 + ee)) + A * (1 + ee) * 0 + A;      /* largeur utile : de −A(1+e) à +A(1−e)… on centre */
      var xmin = -A * (1 + ee), xmax = A * (1 - ee) * 1 + 0, span = Math.max(A * 2 + 0.01, 1), u = Math.min((c.W - 40) / (2 * A + 2 * A * ee * 0 + 0.001) , (c.H - 40) / (2 * bb + 0.001));
      /* Étoile à l'origine du repère (foyer) ; périhélie à droite : x de −A(1+e)… A(1−e)  (ellipse centre à (−A·e, 0)) */
      var ox = c.W / 2 + A * ee * u, oy = c.H / 2;
      function X(x){ return ox + x * u; } function Y(y){ return oy - y * u; }
      ctx.strokeStyle = "#aab4c3"; ctx.lineWidth = 1.5; ctx.beginPath();
      for (var i = 0; i <= 200; i++){ var E = i / 200 * 2 * Math.PI, p = pos(A, ee, E); if (i === 0) ctx.moveTo(X(p[0]), Y(p[1])); else ctx.lineTo(X(p[0]), Y(p[1])); }
      ctx.stroke();
      if (secs.value){
        var n = 12, tm = (t % T) / T * n, cur = Math.floor(tm);
        for (var s = 0; s < n; s++){
          var E0 = kep(2 * Math.PI * s / n, ee), E1 = kep(2 * Math.PI * (s + 1) / n, ee);
          ctx.beginPath(); ctx.moveTo(X(0), Y(0));
          for (var j = 0; j <= 12; j++){ var EE = E0 + (E1 - E0) * j / 12, p2 = pos(A, ee, EE); ctx.lineTo(X(p2[0]), Y(p2[1])); }
          ctx.closePath(); ctx.fillStyle = s === cur ? "rgba(180,83,9,.45)" : (s % 2 ? "rgba(30,63,143,.12)" : "rgba(30,63,143,.26)"); ctx.fill();
        }
      }
      var Ec = kep(2 * Math.PI * ((t % T) / T), ee), pp = pos(A, ee, Ec);
      S.draw.dot(c, X(0), Y(0), 10, pal.yellow); ctx.strokeStyle = pal.amber; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(0), Y(0), 10, 0, 2 * Math.PI); ctx.stroke();
      S.draw.dot(c, X(pp[0]), Y(pp[1]), 7, pal.acc);
      var rnow = A * (1 - ee * Math.cos(Ec)), vnow = 29.78 * Math.sqrt(M.value * (2 / rnow - 1 / A));
      S.draw.text(c, "étoile au foyer", X(0), Y(0) + 22, {size: 12, color: pal.amber});
      S.draw.text(c, "r = " + S.fmt(rnow, 2) + " UA ; v = " + S.fmt(vnow, 1) + " km/s", 10, 16, {align: "left", size: 12, color: pal.ink});
      var vp = 29.78 * Math.sqrt(M.value * (2 / rmin - 1 / A)), va = 29.78 * Math.sqrt(M.value * (2 / rmax - 1 / A));
      ro.set(0, S.fmt(T, 2) + " ans"); ro.set(1, S.fmt(T * T / (A * A * A), 2) + " = 1/M"); ro.set(2, S.fmt(rmin, 2) + " UA"); ro.set(3, S.fmt(rmax, 2) + " UA");
      ro.set(4, S.fmt(vp, 1) + " km/s"); ro.set(5, S.fmt(va, 1) + " km/s");
      nt.set("T² = a³/M : T = " + S.fmt(T, 2) + " ans. Les 12 secteurs ont la même aire : plus la planète est proche de l'étoile, plus elle est rapide (" + S.fmt(vp / va, 1) + " fois plus au périhélie qu'à l'aphélie). Avec M = 1 et a = 1, on retrouve la Terre : 1 an, 29,8 km/s.", "");
    });
  }
});
})();
