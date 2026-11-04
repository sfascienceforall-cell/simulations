/* Physique 4e · chapitre 3 · Chute libre et graphes du mouvement */
(function(){
var G = 9.8;
function lnch(u){ u = Math.abs(u); return u + Math.log1p(Math.exp(-2 * u)) - Math.LN2; }
/* chute avec résistance de l'air : v = vt·tanh(g·t/vt) ; x = (vt²/g)·ln cosh(g·t/vt). vt = Infinity : chute libre. */
function posFall(vt, t){ return isFinite(vt) ? vt * vt / G * lnch(G * t / vt) : 0.5 * G * t * t; }
function velFall(vt, t){ return isFinite(vt) ? vt * Math.tanh(G * t / vt) : G * t; }
function timeFall(vt, h){
  if (!isFinite(vt)) return Math.sqrt(2 * h / G);
  var lo = 0, hi = Math.sqrt(2 * h / G) + h / Math.max(0.01, vt) * 2 + 1, i;
  for (i = 0; i < 80; i++){ var m = (lo + hi) / 2; if (posFall(vt, m) < h) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
window.P4chute = {posFall:posFall, velFall:velFall, timeFall:timeFall};

var OBJ = {
  acier:{n:"Bille d'acier", vt:120, r:8, col:"#5f6b7a"},
  tennis:{n:"Balle de tennis", vt:25, r:11, col:"#a3b81a"},
  papier:{n:"Feuille de papier à plat", vt:3, r:0, col:"#8a95a3", shape:"sheet"},
  boule:{n:"Feuille froissée", vt:12, r:7, col:"#b8c0cc"},
  plume:{n:"Plume", vt:1.5, r:0, col:"#b45309", shape:"feather"}
};
function drawObj(c, o, x, y){
  var ctx = c.ctx; ctx.save(); ctx.fillStyle = o.col; ctx.strokeStyle = "#13233a"; ctx.lineWidth = 1.5;
  if (o.shape === "sheet"){ ctx.fillRect(x - 16, y - 12, 32, 4); ctx.strokeRect(x - 16, y - 12, 32, 4); }
  else if (o.shape === "feather"){ ctx.beginPath(); ctx.ellipse(x, y - 11, 4, 13, 0.5, 0, 6.2832); ctx.fill(); ctx.stroke(); }
  else { ctx.beginPath(); ctx.arc(x, y - o.r, o.r, 0, 6.2832); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}

SFA.sim({
  id:"p4-c03-tube-vide", ch:"c03", tag:"Classique",
  titre:"Tube à vide : qui tombe le premier ?",
  resume:"Lâche deux objets dans un tube dont tu règles la quantité d'air.",
  but:"Choisis deux objets, la hauteur et la pression de l'air dans le tube (100 % = air normal, 0 % = vide). Lance la chute et compare.",
  aRetenir:"Dans le vide, tous les objets tombent avec la même accélération g ≈ 9,8 m/s², quelle que soit leur masse. Dans l'air, la résistance dépend de la forme et de la surface : elle ralentit surtout les objets légers et « étalés ».",
  piege:"Ce n'est pas la masse qui fait tomber plus vite : dans le vide, la plume et la bille arrivent ensemble. (Les vitesses limites utilisées ici sont des ordres de grandeur pour un modèle simplifié.)",
  build:function(k,S){
    var c = k.canvas(330), st = {t:0};
    var opts = Object.keys(OBJ).map(function(i){ return [i, OBJ[i].n]; });
    var selA = k.select("Objet A (à gauche)", opts, "acier"), selB = k.select("Objet B (à droite)", opts, "plume");
    var h = k.slider("Hauteur de chute", 2, 50, 1, 10, "m");
    var p = k.slider("Air dans le tube", 0, 100, 10, 100, "%");
    var sp = k.seg("Animation", [[1,"×1"],[3,"×3"]], 1);
    var ro = k.readouts(["Temps de A", "Temps de B", "Vitesse au sol de A", "Vitesse au sol de B"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t += dt * sp.value; k.redraw(); });
    k.button("▶ Lâcher", function(){ st.t = 0; lp.play(); }, true);
    k.button("↺ Remettre en haut", function(){ lp.pause(); st.t = 0; });
    function vtOf(o){ var pp = p.value / 100; return pp <= 0 ? Infinity : o.vt / Math.sqrt(pp); }
    k.draw(function(){
      var P = SFA.draw.palette, H = h.value, oA = OBJ[selA.value], oB = OBJ[selB.value], vA = vtOf(oA), vB = vtOf(oB);
      var tA = timeFall(vA, H), tB = timeFall(vB, H), top = 40, gnd = c.H - 36, sc = (gnd - top - 6) / H;
      var ya = top + Math.min(H, posFall(vA, st.t)) * sc, yb = top + Math.min(H, posFall(vB, st.t)) * sc;
      if (st.t > Math.max(tA, tB) + 0.5) lp.pause();
      c.clear(); var ctx = c.ctx;
      ctx.fillStyle = "rgba(30,63,143," + (0.14 * p.value / 100) + ")"; ctx.fillRect(10, top - 14, c.W - 20, gnd - top + 14);
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 2; ctx.strokeRect(10, top - 14, c.W - 20, gnd - top + 14);
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(0, gnd, c.W, 10);
      var xa = c.W * 0.3, xb = c.W * 0.7;
      drawObj(c, oA, xa, ya + 0); drawObj(c, oB, xb, yb + 0);
      P4.label(c, oA.n, xa, 14, P.acc); P4.label(c, oB.n, xb, 14, P.acc);
      if (st.t >= tA) P4.label(c, S.fmt(tA, 2) + " s", xa, gnd + 22, P.red); else P4.label(c, S.fmt(st.t, 2) + " s", xa, gnd + 22, "#2c3a4e");
      if (st.t >= tB) P4.label(c, S.fmt(tB, 2) + " s", xb, gnd + 22, P.red); else P4.label(c, S.fmt(st.t, 2) + " s", xb, gnd + 22, "#2c3a4e");
      P4.label(c, p.value === 0 ? "vide" : "air : " + p.value + " %", c.W / 2, top + 6, "#2c3a4e");
      ro.set(0, S.fmt(tA, 2) + " s"); ro.set(1, S.fmt(tB, 2) + " s");
      ro.set(2, S.fmt(velFall(vA, tA), 1) + " m/s"); ro.set(3, S.fmt(velFall(vB, tB), 1) + " m/s");
      var d = Math.abs(tA - tB);
      if (p.value === 0) nt.set("Vide : t = √(2h/g) = " + S.fmt(Math.sqrt(2 * H / G), 2) + " s pour tout le monde. Même accélération, même temps.", "");
      else if (d < 0.02) nt.set("Arrivée simultanée (à 0,02 s près) : la résistance de l'air est négligeable pour ces deux objets sur cette hauteur.", "");
      else nt.set((tA < tB ? oA.n : oB.n) + " arrive en premier (écart " + S.fmt(d, 2) + " s). Réduis l'air dans le tube : l'écart diminue.", "warn");
    });
  }
});

SFA.sim({
  id:"p4-c03-lancer-vertical", ch:"c03", tag:"Graphes",
  titre:"Lancer vertical : montée, sommet, descente",
  resume:"Une balle lancée vers le haut : hauteur max., durée de vol et graphiques.",
  but:"Choisis la vitesse de lancer. Observe la balle et les graphiques y(t) et v(t). Défi : choisis la cible et atteins-la.",
  aRetenir:"Pendant tout le vol (montée, sommet, descente), l'accélération vaut −g (vers le bas). Au sommet, v = 0 mais a ≠ 0. h<sub>max</sub> = v₀²/(2g) ; durée de vol = 2·v₀/g ; on repasse au sol à la même vitesse (en sens inverse).",
  piege:"« Au sommet, l'accélération est nulle » : FAUX. C'est la vitesse qui est nulle un instant, pas l'accélération. Sans air, la montée dure autant que la descente.",
  build:function(k,S){
    var sc = k.canvas(200), gy = k.canvas(170), gv = k.canvas(170), st = {t:0.8};
    var v0 = k.slider("Vitesse de lancer", 1, 40, 1, 15, "m/s");
    var tgt = k.select("Défi : hauteur max. visée", [[0,"Libre"],[10,"10 m"],[20,"20 m"],[40,"40 m"]], 0);
    var ts = k.slider("Instant t", 0, 8.2, 0.05, 0.8, "s", function(val){ st.t = val; });
    var ro = k.readouts(["Hauteur max.", "Durée de vol", "y(t)", "v(t)"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t += dt; var tv = 2 * v0.value / G; if (st.t >= tv){ st.t = tv; lp.pause(); } ts.set(st.t); k.redraw(); });
    k.button("▶ Lancer", function(){ st.t = 0; ts.set(0); lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.draw(function(){
      var P = SFA.draw.palette, V0 = v0.value, tv = 2 * V0 / G, hm = V0 * V0 / (2 * G), T = Math.min(st.t, tv);
      var y = V0 * T - 0.5 * G * T * T, v = V0 - G * T;
      sc.clear(); var ctx = sc.ctx, gnd = sc.H - 24, top = 20, scl = (gnd - top) / (hm * 1.1);
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(0, gnd, sc.W, 10);
      S.draw.line(sc, 30, gnd - hm * scl, sc.W - 30, gnd - hm * scl, P.green, 1.5, [5, 4]); P4.label(sc, "h max = " + S.fmt(hm, 1) + " m", sc.W - 34, gnd - hm * scl - 10, P.green, "right");
      var tg = +tgt.value; if (tg > 0){ S.draw.line(sc, 30, gnd - tg * scl, sc.W - 30, gnd - tg * scl, P.red, 2, [2, 4]); P4.label(sc, "cible " + tg + " m", 34, gnd - tg * scl - 10, P.red, "left"); }
      S.draw.dot(sc, sc.W / 2, gnd - y * scl - 8, 8, P.acc);
      if (Math.abs(v) > 0.05) SFA.draw.arrow(sc, sc.W / 2 + 26, gnd - y * scl - 8, sc.W / 2 + 26, gnd - y * scl - 8 - Math.sign(v) * Math.min(60, 8 + Math.abs(v) * 1.5), P.amber, 3);
      SFA.draw.arrow(sc, sc.W / 2 - 26, gnd - y * scl - 8, sc.W / 2 - 26, gnd - y * scl - 8 + 28, P.red, 3);
      P4.label(sc, "v", sc.W / 2 + 40, gnd - y * scl - 8, P.amber); P4.label(sc, "a = g", sc.W / 2 - 44, gnd - y * scl - 8, P.red);
      gy.clear(); var a1 = S.draw.axes(gy, {x0:0, x1:tv, y0:0, y1:hm * 1.15, yl:"y (m)"});
      S.draw.fn(gy, a1, function(t){ return V0 * t - 0.5 * G * t * t; }, P.acc, 3); S.draw.dot(gy, a1.X(T), a1.Y(y), 6, P.red);
      S.draw.dot(gy, a1.X(V0 / G), a1.Y(hm), 4, P.green);
      gv.clear(); var a2 = S.draw.axes(gv, {x0:0, x1:tv, y0:-V0 * 1.1, y1:V0 * 1.1, xl:"t (s)", yl:"v (m/s)"});
      S.draw.line(gv, a2.X(0), a2.Y(V0), a2.X(tv), a2.Y(-V0), P.green, 3); S.draw.dot(gv, a2.X(T), a2.Y(v), 6, P.red);
      P4.label(gv, "pente = −g", a2.X(tv * 0.72), a2.Y(V0 * 0.35), P.green);
      ro.set(0, S.fmt(hm, 1) + " m"); ro.set(1, S.fmt(tv, 2) + " s"); ro.set(2, S.fmt(y, 1) + " m"); ro.set(3, S.fmt(v, 1) + " m/s");
      if (tg > 0) nt.set(Math.abs(hm - tg) < 0.5 ? "Cible atteinte : h max = " + S.fmt(hm, 1) + " m. Vitesse de lancer nécessaire : √(2·g·h) = " + S.fmt(Math.sqrt(2 * G * tg), 1) + " m/s." : "h max = " + S.fmt(hm, 1) + " m : " + (hm < tg ? "trop bas, lance plus vite." : "trop haut, lance moins vite."), Math.abs(hm - tg) < 0.5 ? "" : "warn");
      else nt.set(Math.abs(v) < 0.2 ? "Sommet : v ≈ 0, mais a = −g ≠ 0." : v > 0 ? "Montée : v > 0 et diminue de 9,8 m/s chaque seconde." : "Descente : v < 0, |v| augmente de 9,8 m/s chaque seconde.", "");
    });
  }
});

var ASTRES = [["Lune", 1.62, "#8a95a3"], ["Mars", 3.71, "#b45309"], ["Vénus", 8.87, "#b8860b"], ["Terre", 9.8, "#1e3f8f"], ["Jupiter", 24.8, "#b42318"]];
SFA.sim({
  id:"p4-c03-astres", ch:"c03", tag:"Comparaison",
  titre:"Chute sur d'autres astres",
  resume:"Le même objet lâché sur la Lune, Mars, Vénus, la Terre et Jupiter.",
  but:"Lâche un objet de la même hauteur sur cinq astres. Change sa masse : le temps de chute ne bouge pas, son poids oui.",
  aRetenir:"L'accélération de chute g dépend de l'astre (Lune 1,6 ; Terre 9,8 ; Jupiter 24,8 m/s²), pas de l'objet. Le temps de chute est t = √(2h/g). Masse (kg) et poids (N, P = m·g) sont deux grandeurs différentes.",
  piege:"La masse ne change pas d'un astre à l'autre ; le poids, si. Un objet de 10 kg reste de 10 kg sur la Lune mais pèse environ six fois moins. (Chute sans atmosphère, modèle simplifié.)",
  build:function(k,S){
    var c = k.canvas(320), st = {t:0};
    var h = k.slider("Hauteur de chute", 2, 100, 1, 20, "m");
    var m = k.slider("Masse de l'objet", 1, 100, 1, 10, "kg");
    var sel = k.select("Astre étudié", ASTRES.map(function(a){ return [a[0], a[0] + " (g = " + S.fmt(a[1], 2) + ")"]; }), "Terre");
    var ro = k.readouts(["g de l'astre", "Temps de chute", "Vitesse à l'arrivée", "Poids de l'objet"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t += dt; k.redraw(); });
    k.button("▶ Lâcher", function(){ st.t = 0; lp.play(); }, true);
    k.button("↺ Remettre en haut", function(){ lp.pause(); st.t = 0; });
    k.draw(function(){
      var P = SFA.draw.palette, H = h.value, top = 44, gnd = c.H - 56, scl = (gnd - top) / H, tmax = 0;
      c.clear(); var ctx = c.ctx; ctx.fillStyle = "#e3e7ed"; ctx.fillRect(0, gnd, c.W, 8);
      ASTRES.forEach(function(a, i){
        var g = a[1], tf = Math.sqrt(2 * H / g), x = c.W * (i + 0.5) / 5, d = Math.min(H, 0.5 * g * st.t * st.t);
        tmax = Math.max(tmax, tf);
        var on = a[0] === sel.value; S.draw.dot(c, x, top + d * scl - 0, on ? 10 : 8, on ? P.red : a[2]);
        P4.label(c, a[0], x, 14, on ? P.red : "#2c3a4e"); P4.label(c, S.fmt(g, 1), x, 30, "#5f6b7a");
        P4.label(c, S.fmt(Math.min(st.t, tf), 2) + " s", x, gnd + 24, st.t >= tf ? P.red : "#2c3a4e"); P4.label(c, S.fmt(tf, 2) + " s", x, gnd + 42, "#5f6b7a");
      });
      if (st.t > tmax + 0.5) lp.pause();
      var g0 = ASTRES.filter(function(a){ return a[0] === sel.value; })[0][1], t0 = Math.sqrt(2 * H / g0);
      ro.set(0, S.fmt(g0, 2) + " m/s²"); ro.set(1, S.fmt(t0, 2) + " s"); ro.set(2, S.fmt(g0 * t0, 1) + " m/s"); ro.set(3, S.fmt(m.value * g0, 1) + " N");
      nt.set("Masse : " + m.value + " kg partout. Rapport Terre/" + sel.value + " pour le poids : " + S.fmt(9.8 / g0, 2) + ". Temps de chute indépendant de la masse.", "");
    });
  }
});

SFA.sim({
  id:"p4-c03-parachute", ch:"c03", tag:"Vitesse limite",
  titre:"Le parachutiste et la vitesse limite",
  resume:"La vitesse augmente, puis plafonne : v(t) tend vers une vitesse limite.",
  but:"Change la surface qui freine (corps groupé, bras écartés, parachute) et la masse. Compare avec la chute sans air (pointillés).",
  aRetenir:"Avec l'air, la résistance grandit avec la vitesse. Quand elle égale le poids, a = 0 et la vitesse reste constante : c'est la vitesse limite v<sub>lim</sub>. Une plus grande surface donne une vitesse limite plus faible.",
  piege:"« Vitesse limite » ne veut pas dire « le parachutiste s'arrête de tomber » : il continue de tomber à vitesse constante. Et plus la masse est grande, plus v<sub>lim</sub> est grande. (Modèle simplifié : v<sub>lim</sub> = √(2·m·g/(ρ·S)) avec ρ = 1,2 kg/m³, S = surface efficace.)",
  build:function(k,S){
    var g1 = k.canvas(290), st = {t:6};
    var A = k.slider("Surface efficace S", 0.5, 30, 0.5, 0.7, "m²");
    var m = k.slider("Masse (avec équipement)", 50, 120, 5, 80, "kg");
    var ts = k.slider("Instant t", 0, 30, 0.5, 6, "s", function(val){ st.t = val; });
    var ro = k.readouts(["Vitesse limite", "v(t)", "a(t)", "Temps pour 95 % de v lim"]);
    var nt = k.note("Repères : S ≈ 0,7 m² (corps groupé), 1 m² (bras écartés), 25 m² (parachute ouvert).", "");
    var lp = k.loop(function(dt){ st.t = Math.min(30, st.t + dt * 2); ts.set(st.t); if (st.t >= 30) lp.pause(); k.redraw(); });
    k.button("▶ Lancer", function(){ st.t = 0; ts.set(0); lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.draw(function(){
      var P = SFA.draw.palette, vt = Math.sqrt(2 * m.value * G / (1.2 * A.value)), T = st.t, v = velFall(vt, T);
      var ymax = Math.max(vt * 1.2, 20);
      g1.clear(); var ax = S.draw.axes(g1, {x0:0, x1:30, y0:0, y1:ymax, xl:"t (s)", yl:"v (m/s)", stepX:5});
      S.draw.fn(g1, ax, function(t){ return G * t; }, "#b8c0cc", 2, [6, 5]);
      S.draw.line(g1, ax.X(0), ax.Y(vt), ax.X(30), ax.Y(vt), P.red, 1.8, [7, 4]); P4.label(g1, "v lim = " + S.fmt(vt, 1) + " m/s", ax.X(30) - 4, ax.Y(vt) - 11, P.red, "right");
      S.draw.fn(g1, ax, function(t){ return velFall(vt, t); }, P.acc, 3.2);
      S.draw.dot(g1, ax.X(T), ax.Y(v), 6, P.amber);
      P4.label(g1, "sans air : v = g·t", ax.X(1.5), ax.Y(Math.min(ymax * 0.95, G * 4.6)), "#8a95a3", "left");
      var a = G * (1 - (v / vt) * (v / vt));
      ro.set(0, S.fmt(vt, 1) + " m/s = " + S.fmt(vt * 3.6, 0) + " km/h"); ro.set(1, S.fmt(v, 1) + " m/s"); ro.set(2, S.fmt(a, 2) + " m/s²");
      ro.set(3, S.fmt(1.8318 * vt / G, 1) + " s");
      nt.set(a < 0.05 * G ? "a ≈ 0 : la résistance de l'air équilibre le poids. La vitesse ne change presque plus." : "À cet instant a = " + S.fmt(a, 1) + " m/s² : plus petite que g = 9,8 m/s², car l'air freine déjà.", "");
    });
  }
});
})();
