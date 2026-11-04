/* Chapitre 8 · Champ et force électriques */
(function(){
var K = 9.0e9, QE = 1.6e-19, ME = 9.11e-31, MP = 1.67e-27;

function Efield(ch, x, y){
  var ex = 0, ey = 0;
  ch.forEach(function(c){ var dx = x - c.x, dy = y - c.y, r2 = dx * dx + dy * dy + 1e-9, r = Math.sqrt(r2), q = K * c.q / (r2 * r); ex += q * dx; ey += q * dy; });
  return [ex, ey];
}
/* ligne de champ partant de (x0,y0) ; sens +1 (suit E) ou −1 */
function trace(ch, x0, y0, sgn, bnd){
  var pts = [[x0, y0]], x = x0, y = y0, ds = 0.012;
  for (var i = 0; i < 1200; i++){
    var e = Efield(ch, x, y), n = Math.hypot(e[0], e[1]); if (n < 1e-9) break;
    var mx = x + sgn * e[0] / n * ds / 2, my = y + sgn * e[1] / n * ds / 2, e2 = Efield(ch, mx, my), n2 = Math.hypot(e2[0], e2[1]); if (n2 < 1e-9) break;
    x += sgn * e2[0] / n2 * ds; y += sgn * e2[1] / n2 * ds; pts.push([x, y]);
    if (x < bnd.x0 || x > bnd.x1 || y < bnd.y0 || y > bnd.y1) break;
    var stop = false; ch.forEach(function(c){ if (c.q * sgn < 0 && Math.hypot(x - c.x, y - c.y) < 0.045) stop = true; if (c.q * sgn > 0 && false) stop = false; });
    if (stop) break;
  }
  return pts;
}

SFA.sim({
  id: "p5-c08-deux-charges", ch: "c08", tag: "Classique",
  titre: "Deux charges : force de Coulomb et lignes de champ",
  resume: "Charges et distance → force, attraction ou répulsion, lignes de champ.",
  but: "Règle les deux charges (positives ou négatives) et leur distance, ou fais glisser la charge de droite. Compare la force quand la distance double. Observe où partent et où arrivent les lignes de champ.",
  aRetenir: "Loi de Coulomb : F = k·|q₁·q₂|/d² (k ≈ 9,0·10⁹ N·m²/C²). Charges de même signe : répulsion ; de signes contraires : attraction. Les lignes de champ partent des charges + et arrivent sur les charges −, ne se croisent jamais et sont plus serrées là où le champ est plus intense.",
  piege: "Les lignes de champ ne sont pas des trajectoires : une charge libre qui part du repos suit d'abord une ligne, mais pas ensuite si la ligne est courbe. Et les deux charges subissent des forces de même valeur, même si l'une est plus grande que l'autre.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62});
    var q1 = k.slider("Charge q₁ (à gauche)", -5, 5, 0.5, 3, "µC");
    var q2 = k.slider("Charge q₂ (à droite)", -5, 5, 0.5, -3, "µC");
    var d = k.slider("Distance entre les charges", 0.2, 2, 0.05, 1, "m");
    var ro = k.readouts(["Force sur chaque charge", "Nature", "F si d double", "F si d/2"]);
    var nt = k.note("", ""), f;
    c.pointer(function(type, p){ if (!f || (type !== "down" && type !== "drag")) return; var x = f.ix(p.x); var dd = Math.round((x * 2) * 20) / 20; d.set(P5.clamp(dd, 0.2, 2)); k.redraw(); });
    k.draw(function(){
      c.clear();
      var pal = S.draw.palette, ctx = c.ctx;
      f = P5.frame(c, {x0: -1.6, x1: 1.6, y0: -1, y1: 1}, {grid: false});
      var ch = [{x: -d.value / 2, y: 0, q: q1.value * 1e-6}, {x: d.value / 2, y: 0, q: q2.value * 1e-6}].filter(function(z){ return z.q !== 0; });
      var bnd = {x0: -1.6, x1: 1.6, y0: -1, y1: 1};
      var pos = ch.filter(function(z){ return z.q > 0; }), src = pos.length ? pos : ch, sg = pos.length ? 1 : -1;
      var qmax = 0; ch.forEach(function(z){ qmax = Math.max(qmax, Math.abs(z.q)); });
      ctx.save(); ctx.strokeStyle = "#7d8fb5"; ctx.fillStyle = "#7d8fb5"; ctx.lineWidth = 1.4;
      src.forEach(function(s){
        var n = Math.max(4, Math.round(16 * Math.abs(s.q) / qmax));
        for (var i = 0; i < n; i++){
          var a = 2 * Math.PI * (i + 0.5) / n, pts = trace(ch, s.x + 0.05 * Math.cos(a), s.y + 0.05 * Math.sin(a), sg, bnd);
          ctx.beginPath(); pts.forEach(function(p, j){ if (j === 0) ctx.moveTo(f.X(p[0]), f.Y(p[1])); else ctx.lineTo(f.X(p[0]), f.Y(p[1])); }); ctx.stroke();
          if (pts.length > 8){ var j0 = Math.floor(pts.length / 2), A = pts[j0], B = pts[j0 + 1], ang = Math.atan2(-(B[1] - A[1]), B[0] - A[0]) + (sg < 0 ? Math.PI : 0);
            var X = f.X(A[0]), Y = f.Y(A[1]); ctx.save(); ctx.translate(X, Y); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-4, -4); ctx.lineTo(-4, 4); ctx.closePath(); ctx.fill(); ctx.restore(); }
        }
      });
      ctx.restore();
      [[-d.value / 2, q1.value], [d.value / 2, q2.value]].forEach(function(z){
        var col = z[1] > 0 ? pal.red : z[1] < 0 ? pal.acc : pal.grey;
        S.draw.dot(c, f.X(z[0]), f.Y(0), 14, col); S.draw.text(c, z[1] > 0 ? "+" : z[1] < 0 ? "−" : "0", f.X(z[0]), f.Y(0), {color: "#fff", size: 16});
      });
      var F = K * Math.abs(q1.value * q2.value) * 1e-12 / (d.value * d.value), attr = q1.value * q2.value < 0;
      if (F > 0){
        var L = 20 + 60 * Math.min(1, F / 10), s1 = attr ? 1 : -1;
        P5.vec(c, f.X(-d.value / 2), f.Y(0) + 30, f.X(-d.value / 2) + s1 * L, f.Y(0) + 30, pal.amber, "F", {});
        P5.vec(c, f.X(d.value / 2), f.Y(0) + 30, f.X(d.value / 2) - s1 * L, f.Y(0) + 30, pal.amber, "F", {});
      }
      S.draw.text(c, "glisse la charge de droite pour changer d", c.W / 2, c.H - 12, {size: 12, color: pal.grey});
      ro.set(0, F > 0 ? S.sci(F, 2) + " N" : "0"); ro.set(1, F === 0 ? "—" : attr ? "attraction" : "répulsion");
      ro.set(2, F > 0 ? S.sci(F / 4, 2) + " N" : "0"); ro.set(3, F > 0 ? S.sci(F * 4, 2) + " N" : "0");
      nt.set(F === 0 ? "Une des charges est nulle : aucune force, et seul l'autre charge crée un champ." : "F = k·|q₁·q₂|/d² = 9,0·10⁹ × " + S.fmt(Math.abs(q1.value * q2.value), 2) + "·10⁻¹² / " + S.fmt(d.value * d.value, 2) + " = " + S.sci(F, 2) + " N. " + (Math.abs(q1.value) !== Math.abs(q2.value) ? "Les deux charges sont inégales : il part plus de lignes de la plus grande, mais les forces ont la même valeur." : ""), "");
    });
  }
});

SFA.sim({
  id: "p5-c08-charge-essai", ch: "c08", tag: "Défi",
  titre: "Charge d'essai : le champ est une somme de vecteurs",
  resume: "Place la charge d'essai ; vois E₁, E₂, E total, et trouve le point où E = 0.",
  but: "Fais glisser la petite charge d'essai ou règle ses coordonnées. Observe les champs E₁ et E₂ créés par chaque charge et leur somme. Défi : trouve un point où le champ total est nul (avec q₁ et q₂ de même signe).",
  aRetenir: "Le champ en un point est E = F/q (N/C). Chaque charge source crée un champ E = k·|q|/r² (qui s'éloigne d'une charge +, vers une charge −) et on additionne les champs comme des vecteurs. La force sur une charge d'essai q est F = q·E.",
  piege: "Champ ne veut pas dire force : le champ existe même sans charge d'essai. Et un champ nul au point P ne veut pas dire qu'il n'y a pas de charges autour : les contributions peuvent se compenser.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62});
    var q1 = k.slider("Charge source q₁ (à gauche, x = −0,5 m)", -5, 5, 0.5, 3, "µC");
    var q2 = k.slider("Charge source q₂ (à droite, x = +0,5 m)", -5, 5, 0.5, 3, "µC");
    var qt = k.slider("Charge d'essai q", -5, 5, 0.5, 1, "nC");
    var xt = k.slider("Position x de la charge d'essai", -1.5, 1.5, 0.05, 0.2, "m");
    var yt = k.slider("Position y de la charge d'essai", -0.9, 0.9, 0.05, 0.5, "m");
    k.button("Même signe", function(){ q1.set(3); q2.set(3); });
    k.button("Dipôle", function(){ q1.set(3); q2.set(-3); });
    var ro = k.readouts(["E₁", "E₂", "E total", "Direction de E", "Force sur la charge q"]);
    var nt = k.note("", ""), f;
    c.pointer(function(type, p){ if (!f || (type !== "down" && type !== "drag")) return; xt.set(P5.clamp(Math.round(f.ix(p.x) * 20) / 20, -1.5, 1.5)); yt.set(P5.clamp(Math.round(f.iy(p.y) * 20) / 20, -0.9, 0.9)); k.redraw(); });
    k.draw(function(){
      c.clear();
      var pal = S.draw.palette, ctx = c.ctx;
      f = P5.frame(c, {x0: -1.6, x1: 1.6, y0: -1, y1: 1}, {grid: true, axes: true});
      var C1 = {x: -0.5, y: 0, q: q1.value * 1e-6}, C2 = {x: 0.5, y: 0, q: q2.value * 1e-6};
      var e1 = Efield([C1], xt.value, yt.value), e2 = Efield([C2], xt.value, yt.value), et = [e1[0] + e2[0], e1[1] + e2[1]];
      var n1 = Math.hypot(e1[0], e1[1]), n2 = Math.hypot(e2[0], e2[1]), nT = Math.hypot(et[0], et[1]);
      [C1, C2].forEach(function(z){ var col = z.q > 0 ? pal.red : z.q < 0 ? pal.acc : pal.grey; S.draw.dot(c, f.X(z.x), f.Y(z.y), 13, col); S.draw.text(c, z.q > 0 ? "+" : z.q < 0 ? "−" : "0", f.X(z.x), f.Y(z.y), {color: "#fff", size: 15}); });
      var X = f.X(xt.value), Y = f.Y(yt.value), mx = Math.max(n1, n2, nT, 1), sc = 70 / mx;
      P5.vec(c, X, Y, X + e1[0] * sc, Y - e1[1] * sc, pal.acc, "E₁", {w: 2});
      P5.vec(c, X, Y, X + e2[0] * sc, Y - e2[1] * sc, pal.amber, "E₂", {w: 2});
      P5.vec(c, X, Y, X + et[0] * sc, Y - et[1] * sc, pal.green, "E", {w: 3.4});
      S.draw.dot(c, X, Y, 7, qt.value >= 0 ? pal.red : pal.acc);
      S.draw.text(c, "échelle : 70 px = " + S.fmt(mx / 1000, 0) + " kN/C", c.W - 10, c.H - 12, {align: "right", size: 12, color: pal.grey});
      var F = qt.value * 1e-9;
      ro.set(0, S.sci(n1, 2) + " N/C"); ro.set(1, S.sci(n2, 2) + " N/C"); ro.set(2, S.sci(nT, 2) + " N/C");
      ro.set(3, nT < 1 ? "—" : S.fmt(Math.atan2(et[1], et[0]) * 180 / Math.PI, 0) + " °"); ro.set(4, S.sci(Math.abs(F) * nT, 2) + " N");
      var zero = nT < 0.03 * Math.max(n1, n2, 1) && (n1 > 1e4 || n2 > 1e4);
      if (zero) nt.set("E ≈ 0 ici : E₁ et E₂ sont opposés et de même norme. Une charge d'essai placée là ne subirait aucune force (équilibre, instable).", "ok");
      else nt.set("E = E₁ + E₂ (somme vectorielle) ; F = q·E = " + S.sci(Math.abs(F) * nT, 2) + " N, " + (F >= 0 ? "dans le sens de E (q > 0)" : "dans le sens opposé à E (q < 0)") + ". Cherche le point où les deux flèches s'annulent.", "");
    });
  }
});

SFA.sim({
  id: "p5-c08-condensateur", ch: "c08", tag: "Champ uniforme",
  titre: "Entre deux plaques : champ uniforme et déviation d'une particule",
  resume: "Tension, distance, vitesse → champ E = U/d et trajectoire d'une particule chargée.",
  but: "Une particule traverse deux plaques chargées. Règle la tension et la distance entre les plaques, la vitesse d'entrée, et compare un électron et un proton. À partir de quelle tension la particule touche-t-elle une plaque ?",
  aRetenir: "Entre deux plaques : E = U/d (uniforme). Force constante F = q·E : la particule suit une parabole (comme un projectile) : a = q·E/m et y = ½·a·t² avec t = x/v₀. La déviation est d'autant plus grande que E est grand et v₀ petite.",
  piege: "Le champ uniforme n'est valable qu'entre les plaques (loin des bords). L'électron est dévié vers la plaque +, le proton vers la plaque −. À même champ, le proton, 1 836 fois plus massif, est bien moins dévié (modèle sans pesanteur, qui est négligeable ici).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.55});
    var U = k.slider("Tension entre les plaques U", 10, 300, 5, 100, "V");
    var d = k.slider("Distance entre les plaques d", 1, 5, 0.5, 3, "cm");
    var v0 = k.slider("Vitesse d'entrée v₀", 5, 30, 1, 15, "·10⁶ m/s");
    var part = k.seg("Particule", [["e", "Électron (−)"], ["p", "Proton (+)"]], "e");
    var pol = k.seg("Plaque du haut", [[1, "+"], [-1, "−"]], 1);
    var ro = k.readouts(["Champ E = U/d", "Accélération a", "Durée dans les plaques", "Déviation à la sortie", "Résultat"]);
    var nt = k.note("", "");
    var Lcm = 4;
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx; c.clear();
      var E = U.value / (d.value / 100), mass = part.value === "e" ? ME : MP, q = (part.value === "e" ? -1 : 1) * QE * pol.value;   /* q·pol : >0 => force vers le haut */
      var a = Math.abs(q) * E / mass, V0 = v0.value * 1e6, T = Lcm / 100 / V0;
      var dirUp = (part.value === "e" ? 1 : -1) * pol.value > 0 ? 1 : -1;   /* +1 : force vers le haut (électron attiré par la plaque +) */
      var yL = 0.5 * a * T * T, hit = yL > d.value / 200, tHit = hit ? Math.sqrt(d.value / 100 / a) : T, xHit = V0 * tHit;
      var u = Math.min((c.W - 120) / (Lcm * 1.9), (c.H - 90) / 5.2), x0 = 40, ym = c.H / 2;
      function X(xcm){ return x0 + xcm * u; } function Y(ycm){ return ym - ycm * u; }
      /* plaques */
      var hd = d.value / 2;
      ctx.fillStyle = pol.value > 0 ? pal.red : pal.acc; ctx.fillRect(X(0), Y(hd) - 8, Lcm * u, 8);
      ctx.fillStyle = pol.value > 0 ? pal.acc : pal.red; ctx.fillRect(X(0), Y(-hd), Lcm * u, 8);
      S.draw.text(c, pol.value > 0 ? "+" : "−", X(Lcm) + 14, Y(hd) - 4, {size: 16, color: pol.value > 0 ? pal.red : pal.acc}); S.draw.text(c, pol.value > 0 ? "−" : "+", X(Lcm) + 14, Y(-hd) + 4, {size: 16, color: pol.value > 0 ? pal.acc : pal.red});
      for (var i = 1; i < 6; i++){ var xx = X(Lcm * i / 6); P5.vec(c, xx, pol.value > 0 ? Y(hd) + 2 : Y(-hd) - 2, xx, pol.value > 0 ? Y(-hd) - 4 : Y(hd) + 4, "#b6c0cf", "", {w: 1.2}); }
      S.draw.text(c, "E (de + vers −)", X(Lcm / 2), Y(hd) - 22, {size: 12, color: pal.grey});
      /* trajectoire (cm) */
      ctx.strokeStyle = pal.amber; ctx.lineWidth = 3; ctx.beginPath();
      var n = 60, ended = false;
      for (i = 0; i <= n; i++){
        var tt = tHit * i / n, xcm = V0 * tt * 100, ycm = 100 * 0.5 * a * tt * tt * dirUp;
        if (i === 0) ctx.moveTo(X(xcm), Y(ycm)); else ctx.lineTo(X(xcm), Y(ycm));
      }
      ctx.stroke();
      if (!hit){
        var yo = yL * 100 * dirUp, slope = a * T / V0 * dirUp, xs = Lcm + 3.5;
        ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(X(Lcm), Y(yo)); ctx.lineTo(X(xs), Y(yo + slope * 3.5)); ctx.stroke(); ctx.setLineDash([]);
        S.draw.line(c, X(xs), Y(-4), X(xs), Y(4), pal.grey, 3); S.draw.text(c, "écran", X(xs), Y(-4) + 14, {size: 12, color: pal.grey});
        S.draw.dot(c, X(xs), Y(yo + slope * 3.5), 5, pal.red);
      } else S.draw.dot(c, X(xHit * 100), Y(hd * dirUp), 6, pal.red);
      S.draw.dot(c, X(0), Y(0), 6, pal.amber);
      P5.vec(c, X(0) - 34, Y(0), X(0) - 4, Y(0), pal.green, "v₀", {dy: -12});
      ro.set(0, S.fmt(E, 0) + " V/m"); ro.set(1, S.sci(a, 2) + " m/s²"); ro.set(2, S.sci(T, 2) + " s");
      ro.set(3, hit ? "—" : S.fmt(yL * 1000, part.value === "e" ? 1 : 3) + " mm"); ro.set(4, hit ? "touche une plaque" : "sort des plaques");
      nt.set(hit ? "La particule touche la plaque (déviation " + S.fmt(yL * 1000, 1) + " mm > d/2 = " + S.fmt(d.value * 5, 1) + " mm). Diminue U, augmente d ou v₀." : "E = U/d = " + S.fmt(E, 0) + " V/m ; la particule est déviée vers la plaque " + (part.value === "e" ? "positive" : "négative") + ". Force électrique ≫ poids (négligé).", hit ? "warn" : "");
    });
  }
});

SFA.sim({
  id: "p5-c08-millikan", ch: "c08", tag: "Expérience",
  titre: "Les gouttelettes de Millikan : mesurer la charge élémentaire",
  resume: "Règle la tension pour immobiliser la gouttelette, puis calcule sa charge.",
  but: "Une gouttelette d'huile chargée est entre deux plaques distantes de 1,0 cm. Règle la tension jusqu'à ce qu'elle reste immobile. Alors q·E = m·g : calcule q, puis q/e. Fais-le pour les quatre gouttelettes : que remarques-tu ?",
  aRetenir: "À l'équilibre : q·E = m·g avec E = U/d, donc q = m·g·d/U. En mesurant plusieurs gouttelettes, Millikan a trouvé des charges toujours multiples entiers d'une même valeur : la charge élémentaire e = 1,6·10⁻¹⁹ C.",
  piege: "Si la tension est trop faible, la gouttelette descend ; trop forte, elle monte (vitesse limite due aux frottements de l'air). On ne mesure q que lorsqu'elle est immobile : sinon le calcul q = m·g·d/U donne des valeurs non entières en multiples de e.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.6});
    var gouttes = {A: {r: 1.0, n: 4}, B: {r: 1.2, n: 6}, C: {r: 0.8, n: 2}, D: {r: 1.5, n: 11}};
    var sel = k.seg("Gouttelette", [["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"]], "A");
    var U = k.slider("Tension U entre les plaques", 0, 800, 1, 300, "V");
    var tg = k.toggle("Révéler le nombre de charges élémentaires n (triche !)", false);
    var ro = k.readouts(["Rayon r", "Masse m", "Vitesse de dérive", "q = m·g·d/U", "q / e"]);
    var nt = k.note("", ""), y = 0, G = 9.81, RHO = 875, ETA = 1.8e-5, D = 0.01;
    var lp = k.loop(function(dt){ var g = gouttes[sel.value], m = 4 / 3 * Math.PI * Math.pow(g.r * 1e-6, 3) * RHO, qE = g.n * QE * U.value / D, vd = (m * G - qE) / (6 * Math.PI * ETA * g.r * 1e-6); y += vd * 1e6 * 3 * dt; var H = 100; if (y > H) y -= 2 * H; if (y < -H) y += 2 * H; k.redraw(); });
    lp.play();
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, g = gouttes[sel.value]; c.clear();
      var m = 4 / 3 * Math.PI * Math.pow(g.r * 1e-6, 3) * RHO, q = g.n * QE, Ueq = m * G * D / q, qE = q * U.value / D, vd = (m * G - qE) / (6 * Math.PI * ETA * g.r * 1e-6);
      var px0 = 60, pw = c.W - 120, top = 36, bot = c.H - 36;
      ctx.fillStyle = pal.red; ctx.fillRect(px0, top - 8, pw, 8); ctx.fillStyle = pal.acc; ctx.fillRect(px0, bot, pw, 8);
      S.draw.text(c, "plaque + (haut)", px0 + 6, top - 20, {align: "left", size: 12, color: pal.red}); S.draw.text(c, "plaque − (bas)", px0 + 6, bot + 22, {align: "left", size: 12, color: pal.acc});
      var cx = c.W / 2, cy = (top + bot) / 2 + y * ((bot - top) / 2 - 12) / 100;
      S.draw.dot(c, cx, cy, 6 + g.r * 4, "#b5842f");
      var s = 40 / (m * G);
      P5.vec(c, cx + 20, cy, cx + 20, cy + m * G * s, pal.ink, "m·g", {dx: 14});
      if (qE > 0) P5.vec(c, cx - 20, cy, cx - 20, cy - qE * s, pal.red, "q·E", {dx: -14});
      var near = Math.abs(U.value - Ueq) / Ueq < 0.01;
      S.draw.text(c, near ? "Immobile : équilibre !" : vd > 0 ? "La gouttelette descend" : "La gouttelette monte", c.W - 14, 22, {align: "right", size: 14, color: near ? pal.green : pal.red});
      var qm = U.value > 0 ? m * G * D / U.value : NaN;
      ro.set(0, S.fmt(g.r, 1) + " µm"); ro.set(1, S.sci(m, 2) + " kg"); ro.set(2, S.fmt(Math.abs(vd) * 1e6, 1) + " µm/s " + (near ? "(≈ 0)" : vd > 0 ? "↓" : "↑"));
      ro.set(3, U.value > 0 ? S.sci(qm, 3) + " C" : "—"); ro.set(4, U.value > 0 ? S.fmt(qm / QE, 2) : "—");
      nt.set(near ? "Équilibre : U = " + S.fmt(U.value, 0) + " V → q = m·g·d/U = " + S.sci(qm, 3) + " C = " + S.fmt(qm / QE, 1) + " · e" + (tg.value ? " (n = " + g.n + ")" : ". Arrondis à l'entier le plus proche !") : "Pas à l'équilibre : la valeur de q/e est quelconque. Ajuste U pour immobiliser la gouttelette (la poussée d'Archimède de l'air est négligée ; modèle simplifié).", near ? "ok" : "");
    });
  }
});
})();
