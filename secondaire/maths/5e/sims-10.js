(function(){
var P = SFA.draw.palette, F = SFA.fmt, PI = Math.PI;
function sqAxes(c, R, step){ var L = 46, Rr = 16, T = 16, B = 34, ph = c.H - T - B, pw = c.W - L - Rr, hx = R * pw / ph; return SFA.draw.axes(c, {x0:-hx, x1:hx, y0:-R, y1:R, stepX:step, stepY:step, xl:"x", yl:"y"}); }
function snap(v, s){ return Math.round(v / s) * s; }
function dragTips(c, getAx, tips, onMove){ /* tips : [{x(), y(), set(x,y)}] */
  var cur = -1; c.pointer(function(type, p){ var ax = getAx(); if (!ax) return;
    if (type === "down"){ var best = -1, bd = 34; tips.forEach(function(t, i){ var d = Math.hypot(ax.X(t.x()) - p.x, ax.Y(t.y()) - p.y); if (d < bd){ bd = d; best = i; } }); cur = best; }
    if ((type === "down" || type === "drag") && cur >= 0){ var R = Math.max(Math.abs(ax.y0), Math.abs(ax.y1)); tips[cur].set(Math.max(-5, Math.min(5, snap(ax.ix(p.x), 0.5))), Math.max(-5, Math.min(5, snap(ax.iy(p.y), 0.5)))); onMove(); }
    if (type === "up") cur = -1; });
}
function ang(c, ax, ux, uy, vx, vy, r, col){ var a0 = Math.atan2(uy, ux), a1 = Math.atan2(vy, vx), d = a1 - a0; while (d > PI) d -= 2 * PI; while (d < -PI) d += 2 * PI; var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); var n = 30; for (var i = 0; i <= n; i++){ var a = a0 + d * i / n; var px = ax.X(r * Math.cos(a)), py = ax.Y(r * Math.sin(a)); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); } ctx.stroke(); ctx.restore(); }

/* 1. Angle et signe du produit scalaire */
SFA.sim({
  id:"m5-c10-angle", ch:"c10", tag:"Classique",
  titre:"Le signe du produit scalaire : aigu, droit, obtus",
  resume:"Déplace les pointes de u et v : u·v change de signe avec l'angle.",
  but:"Glisse la pointe rouge (u) ou bleue (v) à la souris ou au doigt (ou règle les coordonnées). Cherche v perpendiculaire à u : que vaut u·v ?",
  aRetenir:"u·v = u₁v₁ + u₂v₂ = |u|·|v|·cos θ. Angle aigu : u·v > 0 · angle droit : u·v = 0 (vecteurs orthogonaux) · angle obtus : u·v < 0. Le produit scalaire est un nombre, pas un vecteur.",
  piege:"u·v = |u||v| seulement si θ = 0° (même sens). Et u·v = 0 n'oblige pas u ou v à être nul : il suffit qu'ils soient perpendiculaires.",
  build:function(k, S){
    var c = k.canvas(340), ax;
    var ux = k.slider("u₁", -5, 5, 0.5, 4, ""), uy = k.slider("u₂", -5, 5, 0.5, 1, ""), vx = k.slider("v₁", -5, 5, 0.5, 1, ""), vy = k.slider("v₂", -5, 5, 0.5, 3, "");
    var ro = k.readouts(["u·v = u₁v₁ + u₂v₂", "|u|·|v|·cos θ", "Angle θ", "Nature"]); var nt = k.note("", "ok");
    dragTips(c, function(){ return ax; }, [{x:function(){ return ux.value; }, y:function(){ return uy.value; }, set:function(x, y){ ux.set(x); uy.set(y); }}, {x:function(){ return vx.value; }, y:function(){ return vy.value; }, set:function(x, y){ vx.set(x); vy.set(y); }}], function(){ k.redraw(); });
    k.draw(function(){
      c.clear(); ax = sqAxes(c, 6, 1);
      var a = ux.value, b = uy.value, d = vx.value, e = vy.value, nu = Math.hypot(a, b), nv = Math.hypot(d, e), dp = a * d + b * e;
      if (nu === 0 || nv === 0){ S.draw.text(c, "un vecteur est nul : l'angle n'existe pas", c.W / 2, c.H / 2, {size:13}); ro.set(0, F(dp, 2)); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—"); nt.set("Si u ou v est le vecteur nul, u·v = 0 mais l'angle n'est pas défini.", "warn"); return; }
      var cs = dp / (nu * nv), th = Math.acos(Math.max(-1, Math.min(1, cs))) * 180 / PI, col = Math.abs(dp) < 1e-9 ? P.green : dp > 0 ? P.acc : P.red;
      ang(c, ax, a, b, d, e, Math.min(1.2, nu / 2, nv / 2), col);
      S.draw.arrow(c, ax.X(0), ax.Y(0), ax.X(a), ax.Y(b), P.red, 2.6); S.draw.arrow(c, ax.X(0), ax.Y(0), ax.X(d), ax.Y(e), P.acc, 2.6);
      S.draw.dot(c, ax.X(a), ax.Y(b), 7, P.red); S.draw.dot(c, ax.X(d), ax.Y(e), 7, P.acc);
      S.draw.text(c, "u", ax.X(a) + 12, ax.Y(b) - 8, {color:P.red}); S.draw.text(c, "v", ax.X(d) + 12, ax.Y(e) - 8, {color:P.acc});
      var nat = Math.abs(dp) < 1e-9 ? "droit (orthogonaux)" : dp > 0 ? "aigu (u·v > 0)" : "obtus (u·v < 0)";
      ro.set(0, F(dp, 2)); ro.set(1, F(nu * nv * cs, 2)); ro.set(2, F(th, 1) + "°"); ro.set(3, nat);
      nt.set("u = (" + F(a, 1) + " ; " + F(b, 1) + "), v = (" + F(d, 1) + " ; " + F(e, 1) + "). |u| = " + F(nu, 2) + ", |v| = " + F(nv, 2) + ". cos θ = u·v/(|u||v|) = " + F(cs, 3) + ", donc θ ≈ " + F(th, 1) + "°. Angle " + nat + ".", Math.abs(dp) < 1e-9 ? "ok" : "");
    });
  }
});

/* 2. Projection orthogonale */
SFA.sim({
  id:"m5-c10-projection", ch:"c10", tag:"Classique",
  titre:"L'ombre de u sur v : la projection orthogonale",
  resume:"La longueur de l'ombre vaut u·v/|v|.",
  but:"Glisse la pointe de u (rouge). Son ombre sur la droite de v (bleu) est le segment vert. Fais en sorte que la longueur algébrique de l'ombre vaille 3.",
  aRetenir:"La projection orthogonale de u sur v est p = (u·v / |v|²)·v. La longueur algébrique de l'ombre vaut u·v/|v| : positive si l'angle est aigu, négative s'il est obtus, nulle si u ⟂ v.",
  piege:"u·v n'est pas la longueur de l'ombre : il faut diviser par |v|. Et la longueur algébrique peut être négative (ombre dans le sens opposé à v).",
  build:function(k, S){
    var c = k.canvas(340), ax;
    var ux = k.slider("u₁", -5, 5, 0.5, 3, ""), uy = k.slider("u₂", -5, 5, 0.5, 3, ""), vx = k.slider("v₁", -5, 5, 0.5, 4, ""), vy = k.slider("v₂", -5, 5, 0.5, 1, "");
    var ro = k.readouts(["u·v", "|v|", "Ombre algébrique u·v/|v|", "Projection p"]); var nt = k.note("", "ok");
    dragTips(c, function(){ return ax; }, [{x:function(){ return ux.value; }, y:function(){ return uy.value; }, set:function(x, y){ ux.set(x); uy.set(y); }}], function(){ k.redraw(); });
    k.draw(function(){
      c.clear(); ax = sqAxes(c, 6, 1);
      var a = ux.value, b = uy.value, d = vx.value, e = vy.value, nv2 = d * d + e * e, dp = a * d + b * e;
      if (nv2 === 0){ nt.set("v est nul : on ne peut pas projeter sur un vecteur nul.", "warn"); ro.set(0, "—"); ro.set(1, "0"); ro.set(2, "—"); ro.set(3, "—"); return; }
      var nv = Math.sqrt(nv2), t = dp / nv2, px = t * d, py = t * e;
      S.draw.line(c, ax.X(-d * 20), ax.Y(-e * 20), ax.X(d * 20), ax.Y(e * 20), P.light, 1.4, [5, 4]);
      S.draw.line(c, ax.X(a), ax.Y(b), ax.X(px), ax.Y(py), P.grey, 1.6, [4, 4]);
      S.draw.line(c, ax.X(0), ax.Y(0), ax.X(px), ax.Y(py), P.green, 6);
      S.draw.arrow(c, ax.X(0), ax.Y(0), ax.X(d), ax.Y(e), P.acc, 2.6); S.draw.arrow(c, ax.X(0), ax.Y(0), ax.X(a), ax.Y(b), P.red, 2.6);
      S.draw.dot(c, ax.X(a), ax.Y(b), 7, P.red); S.draw.dot(c, ax.X(px), ax.Y(py), 5, P.green);
      S.draw.text(c, "u", ax.X(a) + 12, ax.Y(b) - 8, {color:P.red}); S.draw.text(c, "v", ax.X(d) + 12, ax.Y(e) - 8, {color:P.acc});
      var L = dp / nv; ro.set(0, F(dp, 2)); ro.set(1, F(nv, 2)); ro.set(2, F(L, 2)); ro.set(3, "(" + F(px, 2) + " ; " + F(py, 2) + ")");
      var hit = Math.abs(L - 3) < 0.05;
      nt.set((hit ? "<b>Bravo : l'ombre mesure 3.</b> " : "") + "p = (u·v/|v|²)·v = " + F(t, 3) + "·v. L'ombre a la longueur |p| = " + F(Math.abs(L), 2) + (L < -1e-9 ? ", orientée en sens contraire de v (angle obtus)." : L > 1e-9 ? ", dans le sens de v (angle aigu)." : " : u ⟂ v, l'ombre se réduit à un point."), hit ? "ok" : "");
    });
  }
});

/* 3. Distance d'un point à une droite */
SFA.sim({
  id:"m5-c10-distance", ch:"c10", tag:"Classique",
  titre:"Distance d'un point à une droite",
  resume:"La perpendiculaire donne le plus court chemin : d = |ax₀ + by₀ + c|/√(a² + b²).",
  but:"Choisis la droite ax + by + c = 0 puis glisse P. Déplace aussi Q sur la droite : PQ est-il jamais plus court que PH ?",
  aRetenir:"Le vecteur (a ; b) est normal à la droite ax + by + c = 0. La distance de P(x₀ ; y₀) à la droite vaut |ax₀ + by₀ + c|/√(a² + b²) : c'est la longueur de l'ombre de AP sur le vecteur normal, où A est un point de la droite. Le pied H de la perpendiculaire est le point de la droite le plus proche de P.",
  piege:"Oublier la valeur absolue (une distance est positive) ou la racine du dénominateur. Et (a ; b) est un vecteur normal, pas directeur : un directeur est (−b ; a).",
  build:function(k, S){
    var c = k.canvas(350), ax;
    var a = k.slider("a", -4, 4, 1, 3, ""), b = k.slider("b", -4, 4, 1, -4, ""), cc = k.slider("c", -10, 10, 1, 5, "");
    var px = k.slider("x₀ (point P)", -5, 5, 0.5, 4, ""), py = k.slider("y₀ (point P)", -5, 5, 0.5, 2, ""), tq = k.slider("Position de Q sur la droite", -8, 8, 0.25, 3, "");
    var ro = k.readouts(["ax₀ + by₀ + c", "Distance PH", "Pied H", "PQ"]); var nt = k.note("", "ok");
    dragTips(c, function(){ return ax; }, [{x:function(){ return px.value; }, y:function(){ return py.value; }, set:function(x, y){ px.set(x); py.set(y); }}], function(){ k.redraw(); });
    k.draw(function(){
      c.clear(); ax = sqAxes(c, 6, 1);
      var A = a.value, B = b.value, C = cc.value, X0 = px.value, Y0 = py.value, n2 = A * A + B * B;
      if (n2 === 0){ nt.set("a = b = 0 : ce n'est pas une droite. Choisis a ou b non nul.", "warn"); ro.set(0, "—"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—"); return; }
      var nn = Math.sqrt(n2), val = A * X0 + B * Y0 + C, dist = Math.abs(val) / nn, hx = X0 - val / n2 * A, hy = Y0 - val / n2 * B;
      var q0x = -C / n2 * A, q0y = -C / n2 * B, dx = -B / nn, dy = A / nn, qx = q0x + tq.value * dx, qy = q0y + tq.value * dy;
      S.draw.line(c, ax.X(q0x - 30 * dx), ax.Y(q0y - 30 * dy), ax.X(q0x + 30 * dx), ax.Y(q0y + 30 * dy), P.ink, 2.4);
      S.draw.arrow(c, ax.X(hx), ax.Y(hy), ax.X(hx + A / nn * 1.6), ax.Y(hy + B / nn * 1.6), P.violet, 2);
      S.draw.line(c, ax.X(X0), ax.Y(Y0), ax.X(hx), ax.Y(hy), P.green, 3);
      S.draw.line(c, ax.X(X0), ax.Y(Y0), ax.X(qx), ax.Y(qy), P.amber, 1.6, [5, 4]);
      S.draw.dot(c, ax.X(X0), ax.Y(Y0), 7, P.red); S.draw.dot(c, ax.X(hx), ax.Y(hy), 5, P.green); S.draw.dot(c, ax.X(qx), ax.Y(qy), 5, P.amber);
      S.draw.text(c, "P", ax.X(X0) + 11, ax.Y(Y0) - 9, {color:P.red}); S.draw.text(c, "H", ax.X(hx) + 11, ax.Y(hy) + 9, {color:P.green}); S.draw.text(c, "Q", ax.X(qx) + 11, ax.Y(qy) - 9, {color:P.amber});
      var pq = Math.hypot(X0 - qx, Y0 - qy);
      ro.set(0, F(val, 2)); ro.set(1, F(dist, 3)); ro.set(2, "(" + F(hx, 2) + " ; " + F(hy, 2) + ")"); ro.set(3, F(pq, 3));
      nt.set("Droite " + F(A, 0) + "x " + (B < 0 ? "− " : "+ ") + F(Math.abs(B), 0) + "y " + (C < 0 ? "− " : "+ ") + F(Math.abs(C), 0) + " = 0. d = |" + F(val, 2) + "|/√" + F(n2, 0) + " = " + F(dist, 3) + ". PQ = " + F(pq, 3) + " ≥ PH = " + F(dist, 3) + " : la perpendiculaire est le plus court chemin. (Flèche violette : vecteur normal (" + F(A, 0) + " ; " + F(B, 0) + ").)", "ok");
    });
  }
});

/* 4. Travail d'une force */
SFA.sim({
  id:"m5-c10-travail", ch:"c10", tag:"Animation",
  titre:"Le travail d'une force : W = F·d·cos θ",
  resume:"Pourquoi celui qui porte une valise sur un sol horizontal ne « travaille » pas (au sens physique).",
  but:"Choisis la force, l'angle θ avec le déplacement et la distance. Lance l'animation : le travail se construit. Teste θ = 90° (valise) et θ = 180° (frottement).",
  aRetenir:"Le travail de la force F pour un déplacement d est le produit scalaire W = F·d = ‖F‖·‖d‖·cos θ (en joules, si F en N et d en m). θ < 90° : W > 0 (la force aide) · θ = 90° : W = 0 · θ > 90° : W < 0 (la force freine).",
  piege:"Une grande force ne fournit pas forcément un grand travail : seule la composante de F dans la direction du déplacement compte. Porter une valise à vitesse constante sur un sol plat : θ = 90°, donc W = 0.",
  build:function(k, S){
    var c = k.canvas(215);
    var pre = k.seg("Situation", [["L", "Tirer une luge"], ["V", "Porter une valise"], ["F", "Frottement"], ["X", "Libre"]], "L", function(v){ if (v === "L"){ th.set(30); } else if (v === "V"){ th.set(90); } else if (v === "F"){ th.set(180); } xa = 0; });
    var fo = k.slider("Force F", 0, 100, 5, 60, "N"), th = k.slider("Angle θ (F, déplacement)", 0, 180, 5, 30, "°"), di = k.slider("Déplacement d", 1, 10, 1, 8, "m");
    var ro = k.readouts(["W total", "F·cos θ (composante utile)", "W déjà fourni", "Position"]); var nt = k.note("", "ok");
    var xa = 0;
    var anim = k.loop(function(dt){ xa += dt * 2.5; if (xa >= di.value){ xa = di.value; anim.pause(); } k.redraw(); });
    k.button("▶ Déplacer", function(){ xa = 0; anim.play(); }, true); k.button("↺ Recommencer", function(){ anim.pause(); xa = 0; });
    k.draw(function(){
      c.clear(); var F0 = fo.value, T = th.value * PI / 180, D = di.value, ctx = c.ctx, gy = c.H - 46, sc = (c.W - 100) / 10, x0 = 40;
      if (xa > D) xa = D;
      S.draw.line(c, 20, gy, c.W - 20, gy, P.ink, 3); for (var i = 0; i <= D; i++){ S.draw.line(c, x0 + i * sc, gy, x0 + i * sc, gy + 6, P.grey, 1.5); S.draw.text(c, i + " m", x0 + i * sc, gy + 17, {size:12, color:P.grey}); }
      S.draw.line(c, x0, gy - 14, x0 + D * sc, gy - 14, "rgba(46,107,85,.5)", 2);
      var bx = x0 + xa * sc, by = gy - 28; ctx.fillStyle = P.amber; ctx.fillRect(bx - 22, gy - 38, 44, 36);
      var len = 14 + F0 * 0.9, fx = Math.cos(T), fy = Math.sin(T);
      S.draw.arrow(c, bx, by, bx + fx * len, by - fy * len, P.red, 3);
      S.draw.line(c, bx, by, bx + fx * len, by, P.green, 3, [5, 4]);
      S.draw.text(c, "F", bx + fx * len + 10, by - fy * len - 6, {color:P.red});
      var W = F0 * D * Math.cos(T), Wp = F0 * xa * Math.cos(T), Fu = F0 * Math.cos(T);
      ro.set(0, F(W, 1) + " J"); ro.set(1, F(Fu, 1) + " N"); ro.set(2, F(Wp, 1) + " J"); ro.set(3, F(xa, 1) + " m");
      var sgn = Math.abs(Math.cos(T)) < 1e-9 ? "θ = 90° : F ⟂ d, donc W = 0" : Math.cos(T) > 0 ? "θ < 90° : W > 0, la force aide le mouvement" : "θ > 90° : W < 0, la force s'oppose au mouvement";
      nt.set("W = F·d·cos θ = " + F(F0, 0) + " × " + F(D, 0) + " × cos " + F(th.value, 0) + "° = <b>" + F(W, 1) + " J</b>. Seule la composante F cos θ = " + F(Fu, 1) + " N (flèche verte) agit dans la direction du déplacement. " + sgn + ".", Math.abs(Math.cos(T)) < 1e-9 || Math.cos(T) < 0 ? "warn" : "ok");
    });
  }
});
})();
