/* Physique 4e · chapitre 7 · Lumière : sources, ombres et éclipses */
(function(){
var D2R = Math.PI / 180;

SFA.sim({
  id:"p4-c07-ombre", ch:"c07", tag:"Géométrie",
  titre:"Ombre et pénombre : source ponctuelle ou étendue",
  resume:"Une source qui a une taille donne une ombre nette au centre et une pénombre floue autour.",
  but:"Règle la taille de la source (0 = ponctuelle), la taille de l'objet et les distances. Mesure l'ombre et la pénombre sur l'écran. (Les échelles horizontale et verticale sont différentes.)",
  aRetenir:"La lumière se propage en ligne droite dans un milieu homogène. Source ponctuelle : ombre nette de largeur h·D/d₁. Source étendue : ombre (aucune lumière) entourée d'une pénombre (une partie de la source est visible). Largeur de l'ombre : (h·D − s·d₂)/d₁.",
  piege:"Plus l'écran est loin de l'objet, plus l'ombre est grande, mais plus la pénombre devient large et floue : l'ombre nette peut même disparaître (cas des éclipses annulaires).",
  build:function(k,S){
    var c = k.canvas(300);
    var d1 = k.slider("Distance source – objet d₁", 40, 200, 10, 80, "cm");
    var d2 = k.slider("Distance objet – écran d₂", 20, 200, 10, 80, "cm");
    var h = k.slider("Taille de l'objet h", 5, 40, 5, 20, "cm");
    var s = k.slider("Taille de la source s (0 = ponctuelle)", 0, 40, 5, 10, "cm");
    var ro = k.readouts(["Largeur de l'ombre", "Largeur ombre + pénombre", "Rapport D/d₁"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, D1 = d1.value, D2 = d2.value, H = h.value, Sz = s.value, D = D1 + D2;
      var pen = (H * D + Sz * D2) / D1, umb = (H * D - Sz * D2) / D1, ymax = Math.max(pen / 2, Sz / 2, H / 2) * 1.12;
      var X0 = 30, sx = (c.W - 70) / D, cy = c.H / 2, sy = (c.H / 2 - 18) / ymax, X = function(x){ return X0 + x * sx; }, Y = function(y){ return cy - y * sy; };
      c.clear(); var ctx = c.ctx;
      var Ph = pen / 2, U = umb / 2;
      ctx.fillStyle = "rgba(15,27,45,.12)"; ctx.beginPath(); ctx.moveTo(X(D1), Y(H / 2)); ctx.lineTo(X(D), Y(Ph)); ctx.lineTo(X(D), Y(-Ph)); ctx.lineTo(X(D1), Y(-H / 2)); ctx.closePath(); ctx.fill();
      var xstar = Sz > H ? Sz * D1 / (Sz - H) : Infinity;
      ctx.fillStyle = "rgba(15,27,45,.45)"; ctx.beginPath(); ctx.moveTo(X(D1), Y(H / 2));
      if (U > 0){ ctx.lineTo(X(D), Y(U)); ctx.lineTo(X(D), Y(-U)); } else { var xe = Math.min(D, xstar); ctx.lineTo(X(xe), Y(0)); }
      ctx.lineTo(X(D1), Y(-H / 2)); ctx.closePath(); ctx.fill();
      [[Sz / 2, H / 2, P.amber], [Sz / 2, -H / 2, P.amber], [-Sz / 2, H / 2, P.amber], [-Sz / 2, -H / 2, P.amber]].forEach(function(r){
        var ys = r[0], yo = r[1]; if (Sz === 0 && ys !== 0) return;
        S.draw.line(c, X(0), Y(ys), X(D), Y(ys + (yo - ys) * D / D1), "rgba(244,197,66,.85)", 1.2);
      });
      if (Sz === 0){ S.draw.line(c, X(0), Y(0), X(D), Y(0), "rgba(244,197,66,.0)", 1); [H / 2, -H / 2].forEach(function(yo){ S.draw.line(c, X(0), Y(0), X(D), Y(yo * D / D1), "rgba(244,197,66,.85)", 1.2); }); }
      ctx.fillStyle = P.yellow; if (Sz === 0) S.draw.dot(c, X(0), Y(0), 6, P.yellow); else ctx.fillRect(X(0) - 4, Y(Sz / 2), 8, Math.max(2, Sz * sy));
      ctx.fillStyle = "#13233a"; ctx.fillRect(X(D1) - 3, Y(H / 2), 6, H * sy);
      S.draw.line(c, X(D), Y(ymax), X(D), Y(-ymax), "#5f6b7a", 3);
      S.draw.line(c, X(D) + 2, Y(Ph), X(D) + 2, Y(-Ph), "rgba(15,27,45,.35)", 7);
      if (U > 0) S.draw.line(c, X(D) + 2, Y(U), X(D) + 2, Y(-U), "#0f1b2d", 7);
      P4.label(c, "source", X(0) + 18, 12, "#5f6b7a"); P4.label(c, "objet", X(D1), 12, "#5f6b7a"); P4.label(c, "écran", X(D) - 14, 12, "#5f6b7a");
      ro.set(0, U > 0 ? S.fmt(umb, 1) + " cm" : "aucune ombre totale"); ro.set(1, S.fmt(pen, 1) + " cm"); ro.set(2, S.fmt(D / D1, 2));
      nt.set(Sz === 0 ? "Source ponctuelle : pas de pénombre, ombre de " + S.fmt(pen, 1) + " cm = " + H + " × " + S.fmt(D / D1, 2) + "." : U > 0 ? "Pénombre de " + S.fmt((pen - umb) / 2, 1) + " cm de chaque côté de l'ombre (s·d₂/d₁)." : "L'écran est trop loin : l'ombre se referme avant l'écran (à " + S.fmt(xstar, 0) + " cm de la source). Il ne reste qu'une pénombre : comme dans une éclipse annulaire.", U > 0 || Sz === 0 ? "" : "warn");
    });
  }
});

SFA.sim({
  id:"p4-c07-eclairement", ch:"c07", tag:"Loi en 1/d²",
  titre:"Éclairement : pourquoi 1/d² ?",
  resume:"Éloigne la lampe : la lumière se répartit sur une surface qui grandit avec le carré de la distance.",
  but:"Choisis l'intensité de la source et déplace le luxmètre. Compare l'éclairement à d et à 2d.",
  aRetenir:"L'éclairement E (en lux) d'une petite source d'intensité I à la distance d est E = I/d² (surface perpendiculaire aux rayons). Distance × 2 : surface × 4, éclairement ÷ 4. Distance × 3 : éclairement ÷ 9.",
  piege:"L'éclairement ne diminue pas proportionnellement à la distance (1/d) mais au carré (1/d²). Ce modèle vaut pour une source quasi ponctuelle et une surface perpendiculaire aux rayons.",
  build:function(k,S){
    var c = k.canvas(170), g1 = k.canvas(230);
    var I = k.slider("Intensité de la source", 10, 300, 10, 100, "cd");
    var d = k.slider("Distance du luxmètre", 0.5, 4, 0.1, 1, "m");
    var ro = k.readouts(["Éclairement à d", "Éclairement à 2d", "Rapport E(d)/E(2d)"]);
    var nt = k.note("Repères : pleine lune ≈ 0,3 lx ; rue éclairée ≈ 10 lx ; lecture confortable ≈ 500 lx ; plein soleil ≈ 100 000 lx.", "");
    k.draw(function(){
      var P = SFA.draw.palette, Ii = I.value, dd = d.value, E = Ii / (dd * dd), E2 = Ii / (4 * dd * dd);
      c.clear(); var ctx = c.ctx, cy = 85, x0 = 24, sx = (c.W - 40 - x0) / 4, xp = x0 + dd * sx, half = Math.tan(14 * D2R);
      ctx.fillStyle = "rgba(244,197,66,.22)"; ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(c.W - 16, cy - (c.W - 16 - x0) * half); ctx.lineTo(c.W - 16, cy + (c.W - 16 - x0) * half); ctx.closePath(); ctx.fill();
      S.draw.dot(c, x0, cy, 8, P.yellow);
      var side = (xp - x0) * half;
      ctx.fillStyle = "rgba(180,83,9,.45)"; ctx.fillRect(xp - 2, cy - side, 4, 2 * side);
      var x2 = x0 + 2 * dd * sx; if (x2 < c.W - 16){ var s2 = (x2 - x0) * half; ctx.fillStyle = "rgba(95,107,122,.35)"; ctx.fillRect(x2 - 2, cy - s2, 4, 2 * s2); P4.label(c, "2d : surface ×4", x2, cy + s2 + 14, "#5f6b7a"); }
      P4.label(c, "d", xp, cy + side + 14, P.amber); P4.label(c, "lampe", x0 + 8, 20, "#5f6b7a", "left");
      g1.clear(); var ymax = Ii / 0.25 * 1.05, ax = S.draw.axes(g1, {x0:0.5, x1:4, y0:0, y1:ymax, xl:"d (m)", yl:"E (lx)", stepX:0.5});
      S.draw.fn(g1, ax, function(x){ return Ii / (x * x); }, P.acc, 3);
      if (500 < ymax){ S.draw.line(g1, ax.L, ax.Y(500), ax.R, ax.Y(500), P.green, 1.5, [5, 4]); P4.label(g1, "500 lx : lecture", ax.R - 4, ax.Y(500) - 9, P.green, "right"); }
      S.draw.dot(g1, ax.X(dd), ax.Y(E), 6, P.red); if (2 * dd <= 4) S.draw.dot(g1, ax.X(2 * dd), ax.Y(E2), 6, "#5f6b7a");
      ro.set(0, S.fmt(E, E < 10 ? 1 : 0) + " lx"); ro.set(1, 2 * dd <= 4 ? S.fmt(E2, E2 < 10 ? 1 : 0) + " lx" : S.fmt(E2, 1) + " lx (hors graphique)"); ro.set(2, "4");
    });
  }
});

SFA.sim({
  id:"p4-c07-eclipses", ch:"c07", tag:"Astronomie",
  titre:"Éclipses : pourquoi pas tous les mois ?",
  resume:"Une éclipse exige un alignement presque parfait : la Lune doit être près du plan de l'orbite terrestre.",
  but:"Choisis la nouvelle lune ou la pleine lune, puis la hauteur de la Lune au-dessus du plan de l'orbite de la Terre (en rayons terrestres). Observe si les ombres atteignent la cible. Schéma non à l'échelle.",
  aRetenir:"Éclipse de Soleil : Lune entre Soleil et Terre (nouvelle lune). Éclipse de Lune : Terre entre Soleil et Lune (pleine lune). L'orbite de la Lune est inclinée d'environ 5° sur l'orbite de la Terre : la plupart du temps, la Lune passe trop haut ou trop bas, donc pas d'éclipse chaque mois.",
  piege:"Toutes les nouvelles lunes ne donnent pas d'éclipse de Soleil, et toutes les pleines lunes ne donnent pas d'éclipse de Lune. Les ombres sont aussi bien plus petites que la Terre (ombre de la Lune ≈ quelques centaines de km de large sur la Terre).",
  build:function(k,S){
    var c = k.canvas(300);
    var typ = k.seg("Phase", [["pl","Pleine lune"],["nl","Nouvelle lune"]], "pl");
    var z = k.slider("Hauteur de la Lune au-dessus du plan", -6, 6, 0.1, 0.3, "R<sub>T</sub>");
    k.button("Orbite sans inclinaison (z = 0)", function(){ z.set(0); });
    var ro = k.readouts(["Latitude de la Lune", "Résultat"]);
    var nt = k.note("Repère : avec l'inclinaison réelle de 5°, z varie entre −5,4 et +5,4 R<sub>T</sub> au cours d'un mois (1 R<sub>T</sub> = rayon de la Terre).", "");
    k.draw(function(){
      var P = SFA.draw.palette, Z = z.value, T = typ.value, a = Math.abs(Z), RE = 20, cx = c.W * 0.5, cy = c.H / 2, md = Math.min(150, c.W * 0.36), rm = 6;
      c.clear(); var ctx = c.ctx, res = "";
      S.draw.dot(c, T === "pl" ? 26 : 26, cy, 18, P.yellow); P4.label(c, "Soleil", 26, cy - 28, "#5f6b7a");
      if (T === "pl"){
        var xm = cx + md, ym = cy - Z * RE;
        ctx.fillStyle = "rgba(15,27,45,.12)"; ctx.beginPath(); ctx.moveTo(cx, cy - RE); ctx.lineTo(xm, cy - RE * 1.28); ctx.lineTo(xm, cy + RE * 1.28); ctx.lineTo(cx, cy + RE); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(15,27,45,.35)"; ctx.beginPath(); ctx.moveTo(cx, cy - RE); ctx.lineTo(xm, cy - RE * 0.72); ctx.lineTo(xm, cy + RE * 0.72); ctx.lineTo(cx, cy + RE); ctx.closePath(); ctx.fill();
        S.draw.dot(c, cx, cy, RE, P.acc); P4.label(c, "Terre", cx, cy + RE + 14, P.acc);
        S.draw.dot(c, xm, ym, rm, "#8a95a3"); P4.label(c, "Lune", xm, ym - 14, "#2c3a4e");
        res = a + 0.2725 <= 0.72 ? "Éclipse TOTALE de Lune" : a < 0.72 + 0.2725 ? "Éclipse PARTIELLE de Lune" : a < 1.28 + 0.2725 ? "Éclipse de Lune par la pénombre (peu visible)" : "Pas d'éclipse de Lune";
        P4.label(c, "ombre", (cx + xm) / 2, cy + RE * 0.9 + 14, "#5f6b7a");
      } else {
        var xl = cx - md, yl = cy - Z * RE;
        ctx.fillStyle = "rgba(15,27,45,.12)"; ctx.beginPath(); ctx.moveTo(xl, yl - rm); ctx.lineTo(cx, yl - 12); ctx.lineTo(cx, yl + 12); ctx.lineTo(xl, yl + rm); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(15,27,45,.5)"; ctx.beginPath(); ctx.moveTo(xl, yl - rm); ctx.lineTo(cx, yl); ctx.lineTo(xl, yl + rm); ctx.closePath(); ctx.fill();
        S.draw.dot(c, cx, cy, RE, P.acc); P4.label(c, "Terre", cx, cy + RE + 14, P.acc);
        S.draw.dot(c, xl, yl, rm, "#5f6b7a"); P4.label(c, "Lune", xl, yl - 14, "#2c3a4e");
        res = a <= 1.0 ? "Éclipse CENTRALE de Soleil (totale ou annulaire)" : a < 1.55 ? "Éclipse PARTIELLE de Soleil" : "Pas d'éclipse de Soleil";
      }
      S.draw.line(c, 44, cy, c.W - 10, cy, "#c9d1dc", 1, [3, 4]);
      var lat = Math.asin(Math.max(-1, Math.min(1, Z / 60.3))) / D2R;
      ro.set(0, S.fmt(lat, 1) + " °"); ro.set(1, res);
      nt.set(res.indexOf("Pas") === 0 ? "La Lune passe trop haut ou trop bas : son ombre (ou la Terre) la manque. C'est la situation de la plupart des mois." : "Alignement suffisant : l'ombre ou la pénombre atteint la cible.", res.indexOf("Pas") === 0 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"p4-c07-phases", ch:"c07", tag:"Astronomie",
  titre:"Les phases de la Lune",
  resume:"La Lune est toujours à moitié éclairée par le Soleil ; selon sa position, on en voit plus ou moins.",
  but:"Fais tourner la Lune autour de la Terre (curseur ou animation). Regarde la vue d'en haut et ce qu'on voit depuis la Terre.",
  aRetenir:"Le Soleil éclaire toujours une moitié de la Lune. Les phases dépendent de l'angle Soleil–Terre–Lune : on voit de face la face éclairée à la pleine lune, de dos à la nouvelle lune. Le cycle dure environ 29,5 jours.",
  piege:"Les phases ne sont PAS dues à l'ombre de la Terre ! Cette ombre n'intervient que lors d'une éclipse de Lune. Active l'option pour voir qu'à la pleine lune, la Lune est « derrière » la Terre, mais en général pas dans son ombre.",
  build:function(k,S){
    var c = k.canvas(260), m = k.canvas(150), st = {a:60};
    var al = k.slider("Angle Soleil – Terre – Lune", 0, 360, 5, 60, "°", function(v){ st.a = v; });
    var sh = k.toggle("Montrer l'ombre de la Terre (schéma non à l'échelle)", false);
    var ro = k.readouts(["Âge de la Lune (jours)", "Partie éclairée visible", "Phase"]);
    var lp = k.loop(function(dt){ st.a = (st.a + dt * 40) % 360; al.set(st.a); k.redraw(); });
    k.button("▶ / ❚❚ Un mois en accéléré", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    function nom(a){ return a < 10 || a > 350 ? "Nouvelle lune" : a < 80 ? "Premier croissant" : a <= 100 ? "Premier quartier" : a < 170 ? "Gibbeuse croissante" : a <= 190 ? "Pleine lune" : a < 260 ? "Gibbeuse décroissante" : a <= 280 ? "Dernier quartier" : "Dernier croissant"; }
    k.draw(function(){
      var P = SFA.draw.palette, a = st.a, ar = a * D2R, cx = c.W * 0.55, cy = c.H / 2, Ro = Math.min(90, c.H / 2 - 30), Rm = 11, ctx;
      c.clear(); ctx = c.ctx;
      for (var i = -3; i <= 3; i++) SFA.draw.arrow(c, 8, cy + i * 28, 40, cy + i * 28, "rgba(244,197,66,.9)", 2);
      P4.label(c, "Soleil", 28, 14, "#b45309");
      if (sh.value){ ctx.fillStyle = "rgba(15,27,45,.18)"; ctx.fillRect(cx, cy - 20, c.W - cx, 40); P4.label(c, "ombre de la Terre", c.W - 60, cy - 30, "#5f6b7a"); }
      ctx.strokeStyle = "#c9d1dc"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, Ro, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]);
      S.draw.dot(c, cx, cy, 20, P.acc); P4.label(c, "Terre", cx, cy, "#fff");
      var mx = cx - Ro * Math.cos(ar), my = cy + Ro * Math.sin(ar);
      ctx.fillStyle = "#33415a"; ctx.beginPath(); ctx.arc(mx, my, Rm + 0.5, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#f4f1e4"; ctx.beginPath(); ctx.arc(mx, my, Rm, Math.PI / 2, 3 * Math.PI / 2); ctx.closePath(); ctx.fill();
      P4.label(c, "Lune", mx + (mx < cx ? -22 : 24), my + (my < cy ? -14 : 14), "#2c3a4e");
      /* vue depuis la Terre */
      m.clear(); ctx = m.ctx; var R = 54, mx2 = m.W / 2, my2 = m.H / 2 - 4, wax = a <= 180, aa = wax ? ar : (360 - a) * D2R, ck = Math.cos(aa), sgn = wax ? 1 : -1;
      ctx.fillStyle = "#33415a"; ctx.beginPath(); ctx.arc(mx2, my2, R, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#f4f1e4"; ctx.beginPath();
      var n = 60, j, y, xr;
      for (j = 0; j <= n; j++){ y = -R + 2 * R * j / n; xr = Math.sqrt(Math.max(0, R * R - y * y)); ctx[j ? "lineTo" : "moveTo"](mx2 + sgn * xr, my2 + y); }
      for (j = n; j >= 0; j--){ y = -R + 2 * R * j / n; xr = Math.sqrt(Math.max(0, R * R - y * y)); ctx.lineTo(mx2 + sgn * ck * xr, my2 + y); }
      ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(mx2, my2, R, 0, 6.2832); ctx.stroke();
      P4.label(m, "Vue depuis la Terre (hémisphère nord)", m.W / 2, m.H - 10, "#5f6b7a");
      var frac = (1 - Math.cos(ar)) / 2;
      ro.set(0, S.fmt(a / 360 * 29.53, 1) + " j"); ro.set(1, S.fmt(frac * 100, 0) + " %"); ro.set(2, nom(a));
    });
  }
});
})();
