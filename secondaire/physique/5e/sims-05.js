/* Chapitre 5 · Frottements, plan incliné et projectiles */
SFA.sim({
  id: "p5-c05-incline-frott", ch: "c05", tag: "Classique",
  titre: "Plan incliné avec frottement : glisse ou ne glisse pas ?",
  resume: "Angle, μ → le bloc reste immobile ou glisse ; accélération et forces.",
  but: "Augmente doucement l'angle du plan. À quel angle le bloc se met-il à glisser ? Compare avec arctan(μ<sub>s</sub>). Change la masse : l'angle limite change-t-il ?",
  aRetenir: "Le bloc reste immobile tant que tan α ≤ μ<sub>s</sub> : le frottement statique vaut alors exactement P·sin α. Ensuite il glisse avec a = g·(sin α − μ<sub>c</sub>·cos α). La réaction normale vaut N = m·g·cos α (pas m·g).",
  piege: "Le frottement n'est pas toujours μ·N : au repos, il vaut exactement ce qu'il faut pour équilibrer (jusqu'à μ<sub>s</sub>·N). Et il ne dépend pas de la surface de contact, ni de la masse pour l'angle limite.",
  build: function(k, S){
    var c = k.canvas(260), gr = k.canvas(170);
    var al = k.slider("Angle α du plan", 0, 60, 1, 25, "°");
    var ms = k.slider("Coefficient statique μs", 0.1, 1, 0.05, 0.5, "");
    var mk = k.slider("Coefficient cinétique μc", 0.05, 1, 0.05, 0.3, "");
    var m = k.slider("Masse du bloc", 1, 10, 0.5, 4, "kg");
    var ro = k.readouts(["Réaction normale N", "Frottement", "Composante parallèle du poids", "Accélération", "Angle limite (arctan μs)"]);
    var nt = k.note("", ""), t = 0, sPos = 0;
    var lp = k.loop(function(dt){ t += dt; var a = st().a; sPos = 0.5 * a * t * t; if (sPos > 2.2){ lp.pause(); } k.redraw(); });
    k.button("Lâcher le bloc", function(){ t = 0; sPos = 0; lp.play(); }, true);
    function st(){
      var A = al.value * Math.PI / 180, g = P5.g, mkE = Math.min(mk.value, ms.value);
      var N = m.value * g * Math.cos(A), Pp = m.value * g * Math.sin(A), slide = Math.tan(A) > ms.value + 1e-9;
      return {N: N, Pp: Pp, slide: slide, f: slide ? mkE * N : Pp, a: slide ? g * (Math.sin(A) - mkE * Math.cos(A)) : 0, mkE: mkE};
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, s = st(), A = al.value * Math.PI / 180;
      c.clear();
      var bx = 24, by = c.H - 28, L = Math.min(c.W - 60, 400);
      var Hh = L * Math.sin(A), Lx = L * Math.cos(A);
      if (Hh > c.H - 70){ L = (c.H - 70) / Math.sin(A); Hh = L * Math.sin(A); Lx = L * Math.cos(A); }
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Lx, by); ctx.lineTo(bx + Lx, by - Hh); ctx.closePath(); ctx.fillStyle = "#e9edf3"; ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 2; ctx.stroke();
      var ux = Math.cos(A), uy = -Math.sin(A), nx = uy, ny = -ux;
      var sp = 0.15 * L + sPos / 2.2 * L * 0.6;
      var px = bx + ux * sp * 1 + Lx * 0.0, py = by + uy * sp;
      /* position sur la pente : on part près du haut ? on part en haut puis on descend */
      var start = L * 0.75, dpos = Math.max(L * 0.15, start - sPos / 2.2 * L * 0.6);
      px = bx + ux * dpos; py = by + uy * dpos;
      var cx = px + nx * 14, cy = py + ny * 14;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-A); ctx.fillStyle = "#c9d6f2"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.fillRect(-18, -14, 36, 28); ctx.strokeRect(-18, -14, 36, 28); ctx.restore();
      var sc = 90 / (m.value * P5.g * 1.0 + 1e-9) * 1;     /* poids = 90 px */
      var P = m.value * P5.g;
      P5.vec(c, cx, cy, cx, cy + P * sc, pal.ink, "P", {dx: 12});
      P5.vec(c, cx, cy, cx + nx * s.N * sc, cy + ny * s.N * sc, pal.green, "N", {dx: -6});
      if (s.f > 0.01) P5.vec(c, cx, cy, cx + ux * s.f * sc, cy + uy * s.f * sc, pal.red, "f", {dx: 4, dy: -4});
      S.draw.text(c, "α = " + S.fmt(al.value, 0) + " °", bx + 56, by - 8, {size: 12, color: pal.ink});
      S.draw.text(c, s.slide ? "Le bloc GLISSE" : "Le bloc reste IMMOBILE", c.W - 14, 22, {align: "right", size: 14, color: s.slide ? pal.red : pal.green});
      /* graphe f(α) */
      gr.clear();
      var ms2 = ms.value, mk2 = s.mkE, M = m.value * P5.g;
      var ax = S.draw.axes(gr, {x0: 0, x1: 60, y0: 0, y1: Math.ceil(M * 1.0 / 10) * 10, xl: "α (°)", yl: "frottement (N)", stepX: 10, l: 56});
      function fr(x){ var r = x * Math.PI / 180; return Math.tan(r) > ms2 ? mk2 * M * Math.cos(r) : M * Math.sin(r); }
      S.draw.fn(gr, ax, fr, pal.red);
      S.draw.line(gr, ax.X(Math.atan(ms2) * 180 / Math.PI), ax.Y(0), ax.X(Math.atan(ms2) * 180 / Math.PI), ax.Y(ax.y1), pal.grey, 1.5, [4, 4]);
      S.draw.dot(gr, ax.X(al.value), ax.Y(s.f), 6, pal.acc);
      ro.set(0, S.fmt(s.N, 1) + " N"); ro.set(1, S.fmt(s.f, 1) + " N" + (s.slide ? " (cinétique)" : " (statique)")); ro.set(2, S.fmt(s.Pp, 1) + " N");
      ro.set(3, S.fmt(s.a, 2) + " m/s²"); ro.set(4, S.fmt(Math.atan(ms.value) * 180 / Math.PI, 1) + " °");
      if (mk.value > ms.value) nt.set("On a pris μc = μs (en pratique, μc ≤ μs). ", "warn");
      else if (s.slide) nt.set("tan α = " + S.fmt(Math.tan(A), 2) + " > μs = " + S.fmt(ms.value, 2) + " : le bloc glisse. a = g·(sin α − μc·cos α) = " + S.fmt(s.a, 2) + " m/s², et f = μc·N = " + S.fmt(s.f, 1) + " N.", "");
      else nt.set("tan α = " + S.fmt(Math.tan(A), 2) + " ≤ μs = " + S.fmt(ms.value, 2) + " : équilibre. Le frottement statique compense exactement P∥ : f = " + S.fmt(s.f, 1) + " N (maximum possible : " + S.fmt(ms.value * s.N, 1) + " N).", "ok");
    });
  }
});

SFA.sim({
  id: "p5-c05-tir", ch: "c05", tag: "Projectile",
  titre: "Tir oblique : x(t) uniforme, y(t) uniformément accéléré",
  resume: "Angle, vitesse, hauteur → trajectoire, portée, flèche. Atteins la cible.",
  but: "Règle l'angle et la vitesse, puis tire. Atteins la cible (à ± 2 m). Essaie deux angles complémentaires (par exemple 30° et 60°) : que remarques-tu sur la portée ? Regarde les deux petits graphes de vitesse.",
  aRetenir: "Sans frottement : v<sub>x</sub> = v₀·cos α reste constante ; v<sub>y</sub> = v₀·sin α − g·t varie linéairement. Portée (départ au sol) R = v₀²·sin(2α)/g, maximale à 45°. Flèche H = v₀²·sin²α/(2g).",
  piege: "À une vitesse de départ donnée, α et 90° − α donnent la même portée (si le départ est au sol), mais pas la même flèche ni la même durée. Au sommet, v<sub>y</sub> = 0 mais v<sub>x</sub> ≠ 0 : la vitesse n'est pas nulle.",
  build: function(k, S){
    var c = k.canvas(290), gr = k.canvas(150);
    var al = k.slider("Angle de tir", 5, 85, 1, 45, "°");
    var v0 = k.slider("Vitesse initiale", 5, 40, 1, 25, "m/s");
    var h0 = k.slider("Hauteur de départ", 0, 20, 1, 0, "m");
    var cp = k.toggle("Montrer l'angle complémentaire (90° − α)", false);
    var ro = k.readouts(["Portée", "Flèche (hauteur max)", "Durée du vol", "Vitesse à l'arrivée", "vₓ (constante)"]);
    var cibles = [25, 45, 70, 100], ci = 0, nt = k.note("", "");
    k.button("Nouvelle cible", function(){ ci = (ci + 1) % cibles.length; });
    var tt = 0, lp = k.loop(function(dt){ tt += dt; if (tt > calc(al.value).T + 0.3) lp.pause(); k.redraw(); });
    k.button("Tirer", function(){ tt = 0; lp.play(); }, true);
    function calc(a){
      var A = a * Math.PI / 180, g = P5.g, vy = v0.value * Math.sin(A), vx = v0.value * Math.cos(A), H = h0.value;
      var T = (vy + Math.sqrt(vy * vy + 2 * g * H)) / g;
      return {vx: vx, vy: vy, T: T, R: vx * T, Hm: H + vy * vy / (2 * g), vend: Math.sqrt(v0.value * v0.value + 2 * g * H)};
    }
    function nice(x){ var p = Math.pow(10, Math.floor(Math.log10(x))), m = x / p; return (m <= 1.5 ? 1 : m <= 3.5 ? 2 : m <= 7.5 ? 5 : 10) * p; }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, g = P5.g, r = calc(al.value), r2 = calc(90 - al.value);
      c.clear();
      var xm = Math.max(r.R, cp.value ? r2.R : 0, cibles[ci], 20) * 1.1, ym = Math.max(r.Hm, cp.value ? r2.Hm : 0, 8) * 1.15;
      var L = 40, B = 34, u = Math.min((c.W - L - 16) / xm, (c.H - B - 16) / ym);
      function X(x){ return L + x * u; } function Y(y){ return c.H - B - y * u; }
      var step = nice(xm / 6);
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(L, c.H - B); ctx.lineTo(c.W - 8, c.H - B); ctx.stroke();
      ctx.fillStyle = "#5f6b7a"; ctx.font = "600 12px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var gx = 0; gx <= xm; gx += step){ S.draw.line(c, X(gx), c.H - B, X(gx), c.H - B + 5, pal.grey, 1.2); ctx.fillText(S.fmt(gx, 0), X(gx), c.H - B + 8); }
      S.draw.text(c, "x (m)", c.W - 14, c.H - 10, {size: 12, color: pal.grey, align: "right"});
      S.draw.text(c, "y max = " + S.fmt(ym, 0) + " m", L + 4, 14, {size: 12, color: pal.grey, align: "left"});
      if (h0.value > 0){ ctx.fillStyle = "#c9a77c"; ctx.fillRect(L - 14, Y(h0.value), 14, h0.value * u); }
      function path(rr, aa, col, dash){
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.4; if (dash) ctx.setLineDash(dash); ctx.beginPath();
        for (var i = 0; i <= 120; i++){ var t = rr.T * i / 120, x = rr.vx * t, y = h0.value + rr.vy * t - 0.5 * g * t * t; if (i === 0) ctx.moveTo(X(x), Y(y)); else ctx.lineTo(X(x), Y(Math.max(y, 0))); }
        ctx.stroke(); ctx.restore();
      }
      path(r, al.value, pal.acc); if (cp.value) path(r2, 90 - al.value, pal.red, [6, 4]);
      /* cible */
      var D = cibles[ci]; ctx.fillStyle = "rgba(46,107,85,.35)"; ctx.fillRect(X(D - 2), c.H - B - 8, X(D + 2) - X(D - 2), 8); S.draw.line(c, X(D), c.H - B, X(D), c.H - B - 30, pal.green, 3);
      S.draw.text(c, "cible " + D + " m", X(D), c.H - B - 40, {size: 12, color: pal.green});
      /* balle */
      var t = Math.min(tt, r.T), bx = r.vx * t, by = h0.value + r.vy * t - 0.5 * g * t * t;
      S.draw.dot(c, X(bx), Y(Math.max(by, 0)), 7, pal.amber);
      if (tt > 0 && tt < r.T) P5.vec(c, X(bx), Y(by), X(bx) + r.vx * 2.2, Y(by), pal.green, "", {w: 2});
      if (tt > 0 && tt < r.T) P5.vec(c, X(bx), Y(by), X(bx), Y(by) - (r.vy - g * t) * 2.2, pal.red, "", {w: 2});
      /* graphe vitesses */
      gr.clear();
      var vm = Math.max(v0.value, Math.abs(r.vy - g * r.T), 10) * 1.05, ax = S.draw.axes(gr, {x0: 0, x1: Math.max(r.T, 1), y0: -vm, y1: vm, xl: "t (s)", yl: "v (m/s)", l: 46});
      S.draw.line(gr, ax.X(0), ax.Y(r.vx), ax.X(r.T), ax.Y(r.vx), pal.green, 2.4);
      S.draw.line(gr, ax.X(0), ax.Y(r.vy), ax.X(r.T), ax.Y(r.vy - g * r.T), pal.red, 2.4);
      S.draw.text(gr, "vₓ", ax.X(r.T) - 6, ax.Y(r.vx) - 10, {size: 12, color: pal.green}); S.draw.text(gr, "v_y", ax.X(r.T) - 6, ax.Y(r.vy - g * r.T) + 12, {size: 12, color: pal.red});
      if (tt > 0) S.draw.dot(gr, ax.X(t), ax.Y(r.vy - g * t), 5, pal.red);
      ro.set(0, S.fmt(r.R, 1) + " m"); ro.set(1, S.fmt(r.Hm, 1) + " m"); ro.set(2, S.fmt(r.T, 2) + " s"); ro.set(3, S.fmt(r.vend, 1) + " m/s"); ro.set(4, S.fmt(r.vx, 1) + " m/s");
      var ok = Math.abs(r.R - D) <= 2;
      nt.set("<b>Cible à " + D + " m.</b> " + (ok ? "Touché : portée " + S.fmt(r.R, 1) + " m. Y a-t-il un second angle qui marche aussi ?" : "Portée actuelle : " + S.fmt(r.R, 1) + " m (" + (r.R < D ? "trop court" : "trop long") + ")."), ok ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "p5-c05-blocs", ch: "c05", tag: "Course",
  titre: "Course de blocs sur une pente : quel matériau gagne ?",
  resume: "Choisis les matériaux de trois blocs : qui part, qui arrive en premier ?",
  but: "Trois blocs sont posés sur la même pente. Choisis la nature des surfaces de chacun et règle l'angle. Certains ne démarrent pas ! Teste aussi la face étroite : change-t-elle quelque chose ?",
  aRetenir: "Un bloc glisse seulement si tan α > μs ; alors a = g·(sin α − μc·cos α) et le temps de descente vaut t = √(2L/a). Plus μc est petit, plus a est grand. La surface de contact ne compte pas dans le modèle du frottement sec.",
  piege: "Un bloc qui ne démarre pas n'est pas « sans force » : le frottement statique équilibre P∥. Et le coefficient dépend du couple de matériaux (pas d'un seul), les valeurs données ici sont des ordres de grandeur arrondis.",
  build: function(k, S){
    var mats = [["rub", "Caoutchouc sur béton (μs 1,0 ; μc 0,8)"], ["bois", "Bois sur bois (μs 0,5 ; μc 0,3)"], ["acier", "Acier sur acier sec (μs 0,7 ; μc 0,5)"], ["tef", "Téflon sur acier (μs 0,05 ; μc 0,04)"], ["glace", "Acier sur glace (μs 0,03 ; μc 0,02)"]];
    var val = {rub: [1.0, 0.8], bois: [0.5, 0.3], acier: [0.7, 0.5], tef: [0.05, 0.04], glace: [0.03, 0.02]};
    var c = k.canvas(300);
    var al = k.slider("Angle de la pente", 5, 50, 1, 30, "°");
    var s1 = k.select("Bloc 1 (bleu)", mats, "bois"), s2 = k.select("Bloc 2 (rouge)", mats, "tef"), s3 = k.select("Bloc 3 (vert)", mats, "rub");
    var etr = k.toggle("Bloc 1 posé sur sa face étroite (surface ÷ 4)", false);
    var ro = k.readouts(["Bloc 1", "Bloc 2", "Bloc 3"]);
    var nt = k.note("", ""), t = 0, Lm = 3;
    var lp = k.loop(function(dt){ t += dt; if (t > 4) lp.pause(); k.redraw(); });
    k.button("Départ !", function(){ t = 0; lp.play(); }, true);
    function res(sel){
      var A = al.value * Math.PI / 180, g = P5.g, v = val[sel.value], slide = Math.tan(A) > v[0], a = slide ? g * (Math.sin(A) - v[1] * Math.cos(A)) : 0;
      return {slide: slide, a: a, T: slide ? Math.sqrt(2 * Lm / a) : Infinity, v: v};
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, A = al.value * Math.PI / 180, R = [res(s1), res(s2), res(s3)], cols = [pal.acc, pal.red, pal.green];
      c.clear();
      var bx = 24, by = c.H - 24, L = Math.min(c.W - 60, 440), Hh = L * Math.sin(A);
      if (Hh > c.H - 90){ L = (c.H - 90) / Math.sin(A); Hh = L * Math.sin(A); }
      var Lx = L * Math.cos(A), ux = Math.cos(A), uy = -Math.sin(A), nx = uy, ny = -ux;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Lx, by); ctx.lineTo(bx + Lx, by - Hh); ctx.closePath(); ctx.fillStyle = "#e9edf3"; ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 2; ctx.stroke();
      for (var i = 0; i < 3; i++){
        var o = i * 24 + 2;
        S.draw.line(c, bx + nx * o, by + ny * o, bx + ux * L + nx * o, by + uy * L + ny * o, "#b8c2d0", 2);
      }
      for (i = 0; i < 3; i++){
        var r = R[i], dist = r.slide ? Math.min(0.5 * r.a * t * t, Lm) : 0, d = L * 0.92 - (dist / Lm) * L * 0.8, off = 2 + i * 24;
        var w = (i === 0 && etr.value) ? 11 : 22, h = (i === 0 && etr.value) ? 22 : 11;
        var px = bx + ux * d + nx * (off + h / 2), py = by + uy * d + ny * (off + h / 2);
        ctx.save(); ctx.translate(px, py); ctx.rotate(-A); ctx.fillStyle = cols[i]; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.restore();
      }
      /* arrivée */
      var fx = bx + ux * L * 0.12, fy = by + uy * L * 0.12; S.draw.line(c, fx, fy, fx + nx * 70, fy + ny * 70, pal.ink, 2, [4, 3]);
      S.draw.text(c, "arrivée", fx + 8, fy + 14, {size: 12, color: pal.ink, align: "left"});
      for (var j0 = 0; j0 < 3; j0++) ro.set(j0, R[j0].slide ? "t = " + S.fmt(R[j0].T, 2) + " s (a = " + S.fmt(R[j0].a, 2) + " m/s²)" : "ne démarre pas");
      var best = -1, bt = 1e9; R.forEach(function(r, j){ if (r.T < bt){ bt = r.T; best = j; } });
      var names = ["bleu", "rouge", "vert"];
      nt.set(best < 0 ? "Aucun bloc ne glisse : tan α = " + S.fmt(Math.tan(A), 2) + " est inférieur ou égal à tous les μs. Augmente l'angle." : "Gagnant (pente de " + S.fmt(Lm, 0) + " m) : bloc " + names[best] + " en " + S.fmt(bt, 2) + " s. Seuil de glissement : tan α = " + S.fmt(Math.tan(A), 2) + (etr.value ? ". Le bloc 1 sur la face étroite a exactement les mêmes valeurs." : "."), best < 0 ? "warn" : "");
    });
  }
});

SFA.sim({
  id: "p5-c05-golf", ch: "c05", tag: "Réaliste",
  titre: "Balle de golf : trajectoire idéale et trajectoire avec l'air",
  resume: "Active la résistance de l'air et compare à la parabole du vide.",
  but: "Frappe une balle de golf. Compare la parabole idéale (pointillés) à la trajectoire avec résistance de l'air (trait plein). Trouve l'angle qui donne la plus grande portée dans chaque cas.",
  aRetenir: "Sans frottement, la portée maximale s'obtient à 45° et la trajectoire est une parabole symétrique. Avec la résistance de l'air, la portée est nettement plus petite, la trajectoire est dissymétrique (descente plus raide) et l'angle optimal est inférieur à 45°.",
  piege: "Les formules du tir oblique (portée = v₀²·sin 2α/g) sont des modèles du vide : à 65 m/s, une balle de golf perd souvent 40 à 60 % de sa portée à cause de l'air. Ce modèle ne contient pas la rotation de la balle (backspin), qui la fait voler plus loin dans la réalité.",
  build: function(k, S){
    var c = k.canvas(280);
    var v0 = k.slider("Vitesse initiale", 20, 80, 1, 65, "m/s");
    var al = k.slider("Angle de tir", 5, 80, 1, 20, "°");
    var air = k.toggle("Résistance de l'air (trajectoire réelle)", true);
    var ro = k.readouts(["Portée idéale (vide)", "Portée avec l'air", "Flèche avec l'air", "Durée avec l'air", "Angle optimal avec l'air", "Perte de portée"]);
    var nt = k.note("", "");
    var KD = 0.5 * 1.2 * 0.25 * 1.432e-3 / 0.0459;     /* m^-1 : 1/2·ρ·Cd·A/m (modèle simplifié, Cd = 0,25) */
    function fly(V, aDeg, kd){
      var a = aDeg * Math.PI / 180, x = 0, y = 0, vx = V * Math.cos(a), vy = V * Math.sin(a), dt = 0.01, t = 0, pts = [[0, 0]], hm = 0, g = P5.g;
      function f(s){ var v = Math.hypot(s[2], s[3]); return [s[2], s[3], -kd * v * s[2], -g - kd * v * s[3]]; }
      var s = [x, y, vx, vy];
      for (var i = 0; i < 4000; i++){
        var k1 = f(s), s2 = s.map(function(z, j){ return z + k1[j] * dt / 2; }), k2 = f(s2), s3 = s.map(function(z, j){ return z + k2[j] * dt / 2; }), k3 = f(s3), s4 = s.map(function(z, j){ return z + k3[j] * dt; }), k4 = f(s4);
        var n = s.map(function(z, j){ return z + dt / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]); });
        t += dt; if (n[1] < 0){ var fr = s[1] / (s[1] - n[1]); pts.push([s[0] + (n[0] - s[0]) * fr, 0]); return {pts: pts, R: s[0] + (n[0] - s[0]) * fr, H: hm, T: t - dt + dt * fr}; }
        s = n; hm = Math.max(hm, s[1]); if (i % 5 === 0) pts.push([s[0], s[1]]);
      }
      return {pts: pts, R: s[0], H: hm, T: t};
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, g = P5.g;
      var vac = fly(v0.value, al.value, 0), real = fly(v0.value, al.value, KD);
      c.clear();
      var xm = Math.max(vac.R, 30) * 1.05, ym = Math.max(vac.H, 10) * 1.15, L = 40, B = 34, u = Math.min((c.W - L - 14) / xm, (c.H - B - 14) / ym);
      function X(x){ return L + x * u; } function Y(y){ return c.H - B - y * u; }
      ctx.fillStyle = "#e3f1e3"; ctx.fillRect(L, c.H - B, c.W - L - 8, B - 10);
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(L, c.H - B); ctx.lineTo(c.W - 8, c.H - B); ctx.stroke();
      var st = xm > 300 ? 100 : xm > 150 ? 50 : 25;
      ctx.fillStyle = "#5f6b7a"; ctx.font = "600 12px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var gx = 0; gx <= xm; gx += st){ S.draw.line(c, X(gx), c.H - B, X(gx), c.H - B + 5, pal.grey, 1.2); ctx.fillText(S.fmt(gx, 0), X(gx), c.H - B + 8); }
      S.draw.text(c, "x (m) — hauteur max affichée : " + S.fmt(ym, 0) + " m", c.W - 12, 14, {align: "right", size: 12, color: pal.grey});
      function draw(pts, col, dash){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.6; if (dash) ctx.setLineDash(dash); ctx.beginPath(); pts.forEach(function(p, i){ if (i === 0) ctx.moveTo(X(p[0]), Y(p[1])); else ctx.lineTo(X(p[0]), Y(p[1])); }); ctx.stroke(); ctx.restore(); }
      draw(vac.pts, pal.grey, [7, 5]); if (air.value) draw(real.pts, pal.acc);
      S.draw.text(c, "idéale", X(vac.R / 2), Y(vac.H) - 12, {size: 12, color: pal.grey});
      if (air.value) S.draw.text(c, "avec l'air", X(real.R * 0.5), Y(real.H) - 12, {size: 12, color: pal.acc});
      /* angle optimal avec l'air */
      var best = 5, bR = 0; for (var a = 5; a <= 60; a += 1){ var rr = fly(v0.value, a, KD).R; if (rr > bR){ bR = rr; best = a; } }
      ro.set(0, S.fmt(vac.R, 1) + " m"); ro.set(1, air.value ? S.fmt(real.R, 1) + " m" : "—"); ro.set(2, air.value ? S.fmt(real.H, 1) + " m" : "—"); ro.set(3, air.value ? S.fmt(real.T, 2) + " s" : "—");
      ro.set(4, air.value ? S.fmt(best, 0) + " ° (idéal : 45 °)" : "45 °"); ro.set(5, air.value ? S.fmt(100 * (1 - real.R / vac.R), 0) + " %" : "—");
      if (air.value) nt.set("Avec l'air : portée " + S.fmt(real.R, 0) + " m au lieu de " + S.fmt(vac.R, 0) + " m. Modèle simplifié : force de traînée F = k·v² (Cd constant = 0,25), sans portance due à la rotation.", "");
      else nt.set("Sans frottement : parabole parfaite, portée v₀²·sin(2α)/g = " + S.fmt(vac.R, 1) + " m. Active la résistance de l'air pour voir la trajectoire réelle (simplifiée).", "ok");
    });
  }
});
