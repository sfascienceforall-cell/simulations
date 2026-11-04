/* Physique 4e · chapitre 9 · Réfraction, réflexion totale et dispersion */
(function(){
var D2R = Math.PI / 180, R2D = 180 / Math.PI;
var MED = [["air","Air (n = 1,00)",1.00],["eau","Eau (n = 1,33)",1.33],["verre","Verre (n = 1,50)",1.50],["diam","Diamant (n = 2,42)",2.42]];
function nOf(k){ return MED.filter(function(m){ return m[0] === k; })[0][2]; }

SFA.sim({
  id:"p4-c09-snell", ch:"c09", tag:"Classique",
  titre:"Réfraction à la surface de deux milieux",
  resume:"Un rayon qui passe de l'air à l'eau, du verre à l'air… : angle, loi de Snell-Descartes et réflexion totale.",
  but:"Choisis les deux milieux et l'angle d'incidence. Regarde le rayon réfracté, le rayon réfléchi et le graphique de r en fonction de i.",
  aRetenir:"Loi de Snell-Descartes : n₁·sin i = n₂·sin r (angles mesurés par rapport à la NORMALE). Vers un milieu plus réfringent (n plus grand), le rayon se rapproche de la normale ; vers un milieu moins réfringent, il s'en éloigne. Si n₁·sin i > n₂, il n'y a plus de rayon réfracté : réflexion totale.",
  piege:"Le rayon ne se rapproche pas toujours de la normale : cela dépend du sens (n₁ < n₂ ou n₁ > n₂). Et l'angle limite n'existe que dans le sens milieu plus réfringent → moins réfringent (eau → air, verre → air).",
  build:function(k,S){
    var c = k.canvas(250), g1 = k.canvas(230);
    var m1 = k.select("Milieu du haut (n₁)", MED.map(function(m){ return [m[0], m[1]]; }), "air");
    var m2 = k.select("Milieu du bas (n₂)", MED.map(function(m){ return [m[0], m[1]]; }), "eau");
    k.button("⇅ Échanger les milieux", function(){ var a = m1.value; m1.set(m2.value); m2.set(a); });
    var ang = k.slider("Angle d'incidence i", 0, 89, 1, 40, "°");
    var ro = k.readouts(["Angle de réfraction r", "Angle limite", "n₁·sin i", "n₂·sin r"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, n1 = nOf(m1.value), n2 = nOf(m2.value), I = ang.value * D2R, s = n1 * Math.sin(I) / n2, tir = s > 1, ctx = c.ctx;
      var cx = c.W / 2, cy = c.H / 2, L = Math.min(c.W * 0.42, 110);
      c.clear(); ctx.fillStyle = "rgba(30,63,143," + (0.04 + 0.1 * (n1 - 1) / 1.5) + ")"; ctx.fillRect(0, 0, c.W, cy);
      ctx.fillStyle = "rgba(30,63,143," + (0.04 + 0.1 * (n2 - 1) / 1.5) + ")"; ctx.fillRect(0, cy, c.W, c.H - cy);
      S.draw.line(c, 0, cy, c.W, cy, "#13233a", 3); S.draw.line(c, cx, cy - L - 10, cx, cy + L + 10, "#8a95a3", 1.5, [5, 4]);
      P4.label(c, "n₁ = " + S.fmt(n1, 2), 40, 14, "#2c3a4e"); P4.label(c, "n₂ = " + S.fmt(n2, 2), 40, c.H - 14, "#2c3a4e");
      SFA.draw.arrow(c, cx - L * Math.sin(I), cy - L * Math.cos(I), cx, cy, P.amber, 3);
      var wr = tir ? 3 : 1.2; SFA.draw.arrow(c, cx, cy, cx + L * Math.sin(I), cy - L * Math.cos(I), tir ? P.red : "rgba(180,35,24,.55)", wr);
      var R;
      if (!tir){ R = Math.asin(s); SFA.draw.arrow(c, cx, cy, cx + L * Math.sin(R), cy + L * Math.cos(R), P.green, 3); }
      var theta_c = n1 > n2 ? Math.asin(n2 / n1) * R2D : null;
      g1.clear(); var ax = S.draw.axes(g1, {x0:0, x1:90, y0:0, y1:90, xl:"i (°)", yl:"r (°)", stepX:10, stepY:10});
      S.draw.line(g1, ax.X(0), ax.Y(0), ax.X(90), ax.Y(90), "#b8c0cc", 1.5, [5, 4]);
      if (theta_c){ g1.ctx.fillStyle = "rgba(180,35,24,.10)"; g1.ctx.fillRect(ax.X(theta_c), ax.T, ax.X(90) - ax.X(theta_c), ax.B - ax.T); P4.label(g1, "réflexion totale", ax.X((theta_c + 90) / 2), ax.Y(45), P.red); S.draw.line(g1, ax.X(theta_c), ax.B, ax.X(theta_c), ax.T, P.red, 1.5, [4, 3]); }
      S.draw.fn(g1, ax, function(x){ var q = n1 * Math.sin(x * D2R) / n2; return q > 1 ? NaN : Math.asin(q) * R2D; }, P.green, 3);
      if (!tir) S.draw.dot(g1, ax.X(ang.value), ax.Y(R * R2D), 6, P.red);
      ro.set(0, tir ? "aucun" : S.fmt(R * R2D, 1) + " °"); ro.set(1, theta_c ? S.fmt(theta_c, 1) + " °" : "n'existe pas"); ro.set(2, S.fmt(n1 * Math.sin(I), 3)); ro.set(3, tir ? "—" : S.fmt(n2 * Math.sin(R), 3));
      nt.set(tir ? "Réflexion totale : n₁·sin i = " + S.fmt(n1 * Math.sin(I), 2) + " dépasse n₂ = " + S.fmt(n2, 2) + ". Toute la lumière est réfléchie, selon la loi r = i." : n1 === n2 ? "Mêmes milieux : pas de déviation (r = i)." : n2 > n1 ? "Milieu 2 plus réfringent : le rayon se rapproche de la normale (r < i)." : "Milieu 2 moins réfringent : le rayon s'éloigne de la normale (r > i). Au-delà de l'angle limite, plus de rayon réfracté.", tir ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"p4-c09-fenetre-snell", ch:"c09", tag:"Réflexion totale",
  titre:"La fenêtre de Snell : voir le ciel depuis l'eau",
  resume:"Une lampe au fond d'une piscine : seule une zone de la surface la laisse sortir.",
  but:"Choisis la profondeur de la source et le milieu. Les rayons qui frappent la surface avec un angle supérieur à l'angle limite sont totalement réfléchis.",
  aRetenir:"Une source placée sous la surface n'éclaire l'air que dans un disque de rayon R = h·tan θ<sub>c</sub>, avec sin θ<sub>c</sub> = n<sub>air</sub>/n. Pour l'eau, θ<sub>c</sub> ≈ 48,8° : un plongeur voit TOUT le ciel dans un cône d'environ 97° d'ouverture. Hors de ce cercle, la surface se comporte comme un miroir.",
  piege:"Plus la source est profonde, plus le disque est grand, mais l'angle limite ne change pas : il ne dépend que des milieux (eau → air : 48,8° ; verre → air : 41,8° ; diamant → air : 24,4°).",
  build:function(k,S){
    var c = k.canvas(250);
    var md = k.seg("Milieu sous la surface", [["eau","Eau (1,33)"],["verre","Verre (1,50)"],["diam","Diamant (2,42)"]], "eau");
    var h = k.slider("Profondeur de la source", 0.5, 3, 0.1, 2, "m");
    var ro = k.readouts(["Angle limite θ<sub>c</sub>", "Rayon du disque lumineux", "Ouverture du cône vu d'en dessous"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, n = nOf(md.value), H = h.value, tc = Math.asin(1 / n), ctx = c.ctx;
      var sc = (c.W - 30) / 8, cx = c.W / 2, ys = 54, Y = function(d){ return ys + d * sc; };
      c.clear(); ctx.fillStyle = "rgba(30,63,143,.10)"; ctx.fillRect(0, ys, c.W, c.H - ys); S.draw.line(c, 0, ys, c.W, ys, "#13233a", 3);
      P4.label(c, "air", 24, ys - 12, "#5f6b7a"); P4.label(c, md.value === "eau" ? "eau" : md.value === "verre" ? "verre" : "diamant", 30, ys + 18, "#5f6b7a");
      var R = H * Math.tan(tc);
      S.draw.line(c, cx - R * sc, ys, cx + R * sc, ys, P.yellow, 7);
      for (var j = -8; j <= 8; j++){
        var i = j * 10 * D2R, a = Math.abs(i), sx = Math.sin(i), cxs = cx + H * Math.tan(i) * sc; if (Math.abs(i) > 85 * D2R) continue;
        var hit = [cxs, ys + 0], src = [cx, Y(H)];
        if (hit[0] < 4 || hit[0] > c.W - 4) continue;
        var s2 = n * Math.sin(a);
        if (s2 <= 1){ S.draw.line(c, src[0], src[1], hit[0], hit[1], P.amber, 1.6); var r = Math.asin(s2), dx = Math.sign(i) * Math.sin(r), dy = -Math.cos(r); S.draw.line(c, hit[0], hit[1], hit[0] + dx * 60, hit[1] + dy * 60, P.green, 1.8); }
        else { S.draw.line(c, src[0], src[1], hit[0], hit[1], P.red, 1.6); var xr = hit[0] + (hit[0] - src[0]), yr = src[1]; S.draw.line(c, hit[0], hit[1], xr, yr, P.red, 1.6); }
      }
      S.draw.dot(c, cx, Y(H), 7, P.yellow); P4.label(c, "source", cx + 36, Y(H) + 4, "#2c3a4e");
      P4.label(c, "disque lumineux : R = " + S.fmt(R, 2) + " m", cx, 14, "#b45309");
      ro.set(0, S.fmt(tc * R2D, 1) + " °"); ro.set(1, S.fmt(R, 2) + " m (diamètre " + S.fmt(2 * R, 2) + " m)"); ro.set(2, S.fmt(2 * tc * R2D, 1) + " °");
      nt.set("En vert : rayons qui sortent (i < θ<sub>c</sub>). En rouge : réflexion totale (i > θ<sub>c</sub>). Rayon du disque : " + S.fmt(H, 1) + " × tan " + S.fmt(tc * R2D, 1) + "° = " + S.fmt(R, 2) + " m.", "");
    });
  }
});

SFA.sim({
  id:"p4-c09-fibre", ch:"c09", tag:"Technologie",
  titre:"Fibre optique : piéger la lumière",
  resume:"La lumière avance en rebondissant par réflexion totale ; trop inclinée, elle s'échappe.",
  but:"Règle l'indice de la gaine (le cœur a n = 1,50) et l'angle d'entrée du rayon. Observe s'il reste guidé ou s'échappe.",
  aRetenir:"Dans une fibre, le cœur (n₁) est entouré d'une gaine (n₂ < n₁). Si l'angle d'incidence sur la paroi dépasse l'angle limite, il y a réflexion totale : le rayon est guidé, même si la fibre est courbée. Angle d'acceptation : sin α<sub>max</sub> = √(n₁² − n₂²).",
  piege:"Plus l'indice de la gaine est proche de celui du cœur, plus l'angle d'acceptation est petit : la fibre « accepte » moins de lumière. Il faut aussi une gaine : sans elle, une fibre sale ou en contact avec un objet perdrait la lumière.",
  build:function(k,S){
    var c = k.canvas(230);
    var n2s = k.slider("Indice de la gaine n₂", 1.30, 1.49, 0.01, 1.44, "");
    var al = k.slider("Angle du rayon à l'entrée α", 0, 60, 1, 15, "°");
    var ro = k.readouts(["Angle d'acceptation α<sub>max</sub>", "Angle limite cœur/gaine", "Incidence sur la paroi", "État du rayon"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, n1 = 1.5, n2 = n2s.value, A = al.value * D2R, ctx = c.ctx;
      var NA = Math.sqrt(n1 * n1 - n2 * n2), amax = NA >= 1 ? 90 : Math.asin(NA) * R2D, r1 = Math.asin(Math.sin(A) / n1), i2 = Math.PI / 2 - r1, thc = Math.asin(n2 / n1), guided = i2 >= thc - 1e-9;
      var x0 = 40, x1 = c.W - 10, cy = c.H / 2, w = 34;
      c.clear();
      ctx.fillStyle = "#cfd6e0"; ctx.fillRect(x0, cy - w - 10, x1 - x0, 2 * w + 20); ctx.fillStyle = "#edf1f7"; ctx.fillRect(x0, cy - w, x1 - x0, 2 * w);
      P4.label(c, "cœur n₁ = 1,50", (x0 + x1) / 2, cy - w + 14, "#5f6b7a"); P4.label(c, "gaine n₂ = " + S.fmt(n2, 2), (x0 + x1) / 2, cy - w - 18, "#5f6b7a");
      /* le rayon arrive par le bas-gauche avec l'angle α au-dessus de l'axe */
      SFA.draw.arrow(c, x0 - 36, cy + 36 * Math.tan(A), x0, cy, P.amber, 3);
      var slope = Math.tan(r1), x = x0, y = cy, dir = -1;   /* dir = -1 : vers le haut de l'écran */
      var xe;
      for (var it = 0; it < 80 && x < x1; it++){
        var dyTo = dir < 0 ? (y - (cy - w)) : ((cy + w) - y);
        var dx = slope > 1e-6 ? dyTo / slope : 1e9;
        if (x + dx >= x1 || slope < 1e-6){ var xx = Math.min(x1, x + (slope > 1e-6 ? dx : x1 - x)); S.draw.line(c, x, y, xx, y + dir * slope * (xx - x), guided ? P.green : P.amber, 2.5); break; }
        S.draw.line(c, x, y, x + dx, y + dir * dyTo, guided ? P.green : P.amber, 2.5);
        x += dx; y += dir * dyTo;
        if (!guided){
          var e = Math.asin(Math.min(1, n1 * Math.sin(i2) / n2));   /* angle avec la normale (verticale) dans la gaine */
          S.draw.line(c, x, y, x + 70 * Math.sin(e), y + dir * 70 * Math.cos(e), P.red, 2.5, [5, 3]);
          P4.label(c, "fuite", x + 30, y + dir * 50, P.red);
          break;
        }
        dir = -dir;
      }
      ro.set(0, S.fmt(amax, 1) + " °"); ro.set(1, S.fmt(thc * R2D, 1) + " °"); ro.set(2, S.fmt(i2 * R2D, 1) + " °"); ro.set(3, guided ? "guidé" : "perdu");
      nt.set(guided ? "Incidence sur la paroi : " + S.fmt(i2 * R2D, 1) + " ° ≥ angle limite " + S.fmt(thc * R2D, 1) + " ° : réflexion totale à chaque rebond, aucune perte (modèle idéal)." : "Incidence sur la paroi : " + S.fmt(i2 * R2D, 1) + " ° < angle limite " + S.fmt(thc * R2D, 1) + " ° : une partie de la lumière passe dans la gaine et s'échappe. Diminue α (< " + S.fmt(amax, 1) + " °).", guided ? "" : "warn");
    });
  }
});

var VERRES = {crown:[1.5046, 0.0042, "Crown"], flint:[1.600, 0.010, "Flint"], fort:[1.45, 0.035, "Verre à dispersion exagérée"]};
var COUL = [[0.68, "#e11d1d", "rouge"], [0.62, "#f59e0b", "orange"], [0.58, "#e5c800", "jaune"], [0.53, "#16a34a", "vert"], [0.49, "#0ea5e9", "cyan"], [0.45, "#2563eb", "bleu"], [0.41, "#7c3aed", "violet"]];
SFA.sim({
  id:"p4-c09-prisme", ch:"c09", tag:"Dispersion",
  titre:"Le prisme décompose la lumière blanche",
  resume:"L'indice du verre dépend de la couleur : le violet est plus dévié que le rouge.",
  but:"Fais varier l'angle du prisme, l'angle d'incidence et le type de verre. Observe l'écart entre le rouge et le violet à la sortie.",
  aRetenir:"La lumière blanche est un mélange de couleurs. Dans le verre, l'indice n est plus grand pour le violet que pour le rouge : le violet est plus dévié. Le prisme ne colore pas la lumière : il la décompose (dispersion). L'arc-en-ciel est la dispersion de la lumière du Soleil par des gouttes d'eau.",
  piege:"Le prisme n'ajoute pas de couleurs à la lumière blanche : elles y sont déjà. Et si l'angle du prisme est trop grand ou l'incidence trop faible, la lumière peut être totalement réfléchie à l'intérieur et ne pas ressortir. (Modèle de dispersion simplifié : n = a + b/λ².)",
  build:function(k,S){
    var c = k.canvas(300);
    var gl = k.seg("Verre", [["crown","Crown"],["flint","Flint"],["fort","Dispersion exagérée"]], "crown");
    var A = k.slider("Angle au sommet du prisme", 30, 70, 1, 60, "°");
    var i1 = k.slider("Angle d'incidence sur la 1re face", 20, 80, 1, 50, "°");
    var ro = k.readouts(["n rouge / n violet", "Déviation du rouge", "Déviation du violet", "Écart angulaire"]);
    var nt = k.note("", "");
    function nlam(g, lam){ var v = VERRES[g]; return v[0] + v[1] / (lam * lam); }
    function trace(a, I1, n){
      var r1 = Math.asin(Math.sin(I1) / n), i2 = r1 - a, s = n * Math.sin(i2);
      return {r1:r1, tir:Math.abs(s) > 1, e:Math.abs(s) > 1 ? 0 : Math.asin(s), i2:i2};
    }
    k.draw(function(){
      var P = SFA.draw.palette, a = A.value * D2R, I1 = i1.value * D2R, ctx = c.ctx, g = gl.value;
      var L = Math.min(150, c.W * 0.38), apex = [c.W * 0.42, 40], dirL = [-Math.sin(a / 2), -Math.cos(a / 2)], dirR = [Math.sin(a / 2), -Math.cos(a / 2)];
      /* repère mathématique (y vers le haut) → écran */
      var Sx = function(p){ return p[0]; }, Sy = function(p){ return c.H - p[1]; };
      var ap = [apex[0], c.H - apex[1]];
      var P0 = [ap[0], ap[1]];  /* sommet en repère math */
      var vL = [P0[0] + L * dirL[0], P0[1] + L * dirL[1]], vR = [P0[0] + L * dirR[0], P0[1] + L * dirR[1]];
      c.clear();
      ctx.fillStyle = "rgba(30,63,143,.13)"; ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(Sx(P0), Sy(P0)); ctx.lineTo(Sx(vL), Sy(vL)); ctx.lineTo(Sx(vR), Sy(vR)); ctx.closePath(); ctx.fill(); ctx.stroke();
      var t = 0.45, Pin = [P0[0] + t * L * dirL[0], P0[1] + t * L * dirL[1]], phi0 = -a / 2 + I1, d0 = [Math.cos(phi0), Math.sin(phi0)];
      var st = [Pin[0] - 150 * d0[0], Pin[1] - 150 * d0[1]];
      S.draw.line(c, Sx(st), Sy(st), Sx(Pin), Sy(Pin), "#13233a", 3);
      var xs = c.W - 22; S.draw.line(c, xs, 10, xs, c.H - 10, "#8a95a3", 3); P4.label(c, "écran", xs - 6, 12, "#5f6b7a", "right");
      var res = [], lost = [];
      COUL.forEach(function(co){
        var n = nlam(g, co[0]), T = trace(a, I1, n), phi1 = -a / 2 + T.r1, d1 = [Math.cos(phi1), Math.sin(phi1)];
        /* intersection avec la face droite : Pin + u d1 = P0 + s dirR */
        var det = d1[0] * (-dirR[1]) - d1[1] * (-dirR[0]), bx = P0[0] - Pin[0], by = P0[1] - Pin[1];
        var u = (bx * (-dirR[1]) - by * (-dirR[0])) / det, s = (d1[0] * by - d1[1] * bx) / det;
        if (!(u > 0 && s > 0 && s < L)){ lost.push(co[2] + " (sort par la base)"); return; }
        var P2 = [Pin[0] + u * d1[0], Pin[1] + u * d1[1]];
        S.draw.line(c, Sx(Pin), Sy(Pin), Sx(P2), Sy(P2), co[1], 2);
        if (T.tir){ lost.push(co[2] + " (réflexion totale)"); return; }
        var phi2 = a / 2 + T.e, d2 = [Math.cos(phi2), Math.sin(phi2)], tt = (xs - P2[0]) / d2[0];
        if (d2[0] <= 0.01) return;
        var Pe = [xs, P2[1] + tt * d2[1]];
        S.draw.line(c, Sx(P2), Sy(P2), Sx(Pe), Sy(Pe), co[1], 2);
        S.draw.dot(c, Sx(Pe), Sy(Pe), 3.5, co[1]);
        res.push({name:co[2], D:(phi0 - phi2) * R2D, n:n});
      });
      var nr = nlam(g, 0.68), nv = nlam(g, 0.41), Tr = trace(a, I1, nr), Tv = trace(a, I1, nv);
      var Dr = Tr.tir ? NaN : I1 - Tr.e - a, Dv = Tv.tir ? NaN : I1 - Tv.e - a;
      ro.set(0, S.fmt(nr, 3) + " / " + S.fmt(nv, 3)); ro.set(1, isNaN(Dr) ? "—" : S.fmt(Dr * R2D, 1) + " °"); ro.set(2, isNaN(Dv) ? "—" : S.fmt(Dv * R2D, 1) + " °"); ro.set(3, isNaN(Dr) || isNaN(Dv) ? "—" : S.fmt((Dv - Dr) * R2D, 2) + " °");
      nt.set(res.length === 7 && !lost.length ? "Le violet (n plus grand) est plus dévié que le rouge. Rouge : " + S.fmt(Dr * R2D, 1) + " °, violet : " + S.fmt(Dv * R2D, 1) + " °." : lost.length ? "Pas de sortie pour : " + lost.join(", ") + ". Change l'angle du prisme ou l'incidence." : "Peu de couleurs sortent vers l'écran avec ces réglages.", res.length === 7 && !lost.length ? "" : "warn");
    });
  }
});
})();
