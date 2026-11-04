/* Chapitre 1 · Magnétisme et champ magnétique */
SFA.sim({
  id: "p6-c01-aimant-boussoles", ch: "c01", tag: "Classique",
  titre: "Un aimant, des boussoles, des lignes de champ",
  resume: "Tourne l'aimant, déplace une boussole d'essai et vois comment le champ s'affaiblit avec la distance.",
  but: "Fais pivoter l'aimant, glisse la boussole rouge avec la souris ou le doigt : l'aiguille suit la direction du champ. Active les lignes de champ.",
  aRetenir: "Une ligne de champ sort du pôle Nord de l'aimant et rentre par son pôle Sud ; l'aiguille d'une boussole s'oriente le long de la ligne. Là où les lignes sont serrées, le champ est plus intense. Le champ diminue très vite avec la distance (en 1/r³ pour un aimant).",
  piege: "Les lignes de champ ne sont pas des trajectoires de particules : ce sont des lignes tangentes au champ en chaque point. Et un pôle ne se sépare pas : coupe un aimant en deux, tu obtiens deux aimants complets, chacun avec un Nord et un Sud.",
  build: function(k, S){
    var c = k.canvas(380), P = S.draw.palette;
    var ang = k.slider("Orientation de l'aimant", 0, 345, 15, 0, "°");
    var lines = k.toggle("Lignes de champ", true);
    var grid = k.toggle("Grille de boussoles", true);
    var ro = k.readouts(["Angle de l'aiguille", "Distance (centre)", "B relatif"]);
    k.note("B relatif : 100 = valeur sur l'axe de l'aimant à 100 px de son centre. Modèle du dipôle (aimant vu de loin).");
    var comp = {x: 0, y: 0, set: false};
    function field(dx, dy, u){
      var r2 = dx * dx + dy * dy, r = Math.sqrt(r2), rx = dx / r, ry = dy / r, d = u.x * rx + u.y * ry;
      return {x: 3 * d * rx - u.x, y: 3 * d * ry - u.y, r: r};
    }
    function needle(x, y, ux, uy, len, big){
      var ctx = c.ctx;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(uy, ux));
      ctx.fillStyle = P.red; ctx.beginPath(); ctx.moveTo(len, 0); ctx.lineTo(0, -len * 0.28); ctx.lineTo(0, len * 0.28); ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.acc; ctx.beginPath(); ctx.moveTo(-len, 0); ctx.lineTo(0, -len * 0.28); ctx.lineTo(0, len * 0.28); ctx.closePath(); ctx.fill();
      ctx.restore();
      if (big){ S.draw.dot(c, x, y, 3, "#fff"); }
    }
    function pointer(t, p){
      if (t === "move" || t === "up") return;
      comp.x = p.x; comp.y = p.y; comp.set = true; k.redraw();
    }
    c.pointer(pointer);
    k.draw(function(){
      c.clear();
      var W = c.W, H = c.H, cx = W / 2, cy = H / 2, a = ang.value * Math.PI / 180;
      var u = {x: Math.cos(a), y: -Math.sin(a)}, n = {x: -u.y, y: u.x}, ctx = c.ctx;
      if (!comp.set){ comp.x = cx + 130; comp.y = cy - 90; comp.set = true; }
      /* lignes de champ : r = R sin²φ */
      if (lines.value){
        var Rs = [55, 85, 125, 180, 260], sides = [1, -1];
        Rs.forEach(function(R){ sides.forEach(function(sd){
          ctx.beginPath(); ctx.strokeStyle = "rgba(30,63,143,.55)"; ctx.lineWidth = 1.6; var st = false;
          for (var f = 0.04; f < Math.PI - 0.04; f += 0.02){
            var r = R * Math.sin(f) * Math.sin(f), px = cx + r * (Math.cos(f) * u.x + sd * Math.sin(f) * n.x), py = cy + r * (Math.cos(f) * u.y + sd * Math.sin(f) * n.y);
            if (r < 30 && Math.abs(Math.cos(f)) > 0.5) { st = false; continue; }
            if (r < 12) { st = false; continue; }
            if (!st){ ctx.moveTo(px, py); st = true; } else ctx.lineTo(px, py);
          }
          ctx.stroke();
          var fm = Math.PI / 2, rm = R, ax = cx + rm * sd * n.x, ay = cy + rm * sd * n.y;
          var dir = field(ax - cx, ay - cy, u); var dl = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
          if (ax > 14 && ax < W - 14 && ay > 14 && ay < H - 14){ S.draw.arrow(c, ax - dir.x / dl * 6, ay - dir.y / dl * 6, ax + dir.x / dl * 6, ay + dir.y / dl * 6, "rgba(30,63,143,.9)", 2); }
        }); });
      }
      /* grille de boussoles */
      if (grid.value){
        for (var gx = 40; gx < W; gx += 52) for (var gy = 34; gy < H; gy += 52){
          var dx = gx - cx, dy = gy - cy;
          if (Math.abs(dx) < 70 && Math.abs(dy) < 70) continue;
          var fd = field(dx, dy, u), l = Math.sqrt(fd.x * fd.x + fd.y * fd.y);
          needle(gx, gy, fd.x / l, fd.y / l, 10, false);
        }
      }
      /* aimant */
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.atan2(u.y, u.x));
      ctx.fillStyle = P.red; ctx.fillRect(0, -16, 60, 32); ctx.fillStyle = P.acc; ctx.fillRect(-60, -16, 60, 32);
      ctx.strokeStyle = "#13233a"; ctx.lineWidth = 1.5; ctx.strokeRect(-60, -16, 120, 32);
      ctx.restore();
      S.draw.text(c, "N", cx + u.x * 36, cy + u.y * 36, {color: "#fff", size: 15});
      S.draw.text(c, "S", cx - u.x * 36, cy - u.y * 36, {color: "#fff", size: 15});
      /* boussole d'essai */
      var dxx = comp.x - cx, dyy = comp.y - cy;
      var fc = field(dxx, dyy, u), lc = Math.sqrt(fc.x * fc.x + fc.y * fc.y);
      ctx.beginPath(); ctx.arc(comp.x, comp.y, 22, 0, 7); ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.stroke();
      needle(comp.x, comp.y, fc.x / lc, fc.y / lc, 18, true);
      var ang2 = Math.atan2(-fc.y, fc.x) * 180 / Math.PI; if (ang2 < 0) ang2 += 360;
      var rel = 100 * (Math.sqrt(1 + 3 * Math.pow((dxx * u.x + dyy * u.y) / fc.r, 2)) / Math.pow(fc.r, 3)) / (2 / Math.pow(100, 3));
      ro.set(0, S.fmt(ang2, 0) + " °"); ro.set(1, S.fmt(fc.r, 0) + " px");
      ro.set(2, rel > 9999 ? "> 9999" : S.fmt(rel, rel < 10 ? 2 : 0));
    });
  }
});

SFA.sim({
  id: "p6-c01-fil-boussoles", ch: "c01", tag: "Fil",
  titre: "Champ d'un fil et boussoles : l'effet d'Œrsted",
  resume: "Un courant dans un fil dévie les boussoles : calcule B = 2·10⁻⁷·I/r et compare au champ terrestre.",
  but: "Le fil est vu par-dessus, perpendiculaire à la feuille. Change l'intensité, la distance et le sens du courant. Les boussoles montrent la direction du champ total (fil + Terre).",
  aRetenir: "Un fil rectiligne crée des lignes de champ circulaires autour de lui : B = μ₀·I/(2π·r) = 2·10⁻⁷·I/r (SI). Le champ double si I double, il est divisé par 2 si r double. Le sens se trouve avec la règle de la main droite : pouce dans le sens du courant, doigts qui s'enroulent dans le sens du champ.",
  piege: "Le champ du fil n'est pas dirigé vers le fil ni le long du fil : il est tangent à des cercles. Et si le champ du fil est plus faible que celui de la Terre (≈ 19 µT en horizontal chez nous), la boussole ne bascule pas : elle dévie seulement.",
  build: function(k, S){
    var c = k.canvas(330), g = k.canvas(190), P = S.draw.palette;
    var I = k.slider("Intensité I", 0, 20, 0.5, 10, "A");
    var r = k.slider("Distance r au fil", 1, 20, 0.5, 5, "cm");
    var sens = k.seg("Sens du courant", [["out", "⊙ vers toi"], ["in", "⊗ vers la feuille"]], "out");
    var terre = k.toggle("Tenir compte du champ terrestre (≈ 19 µT vers le nord)", true);
    var ro = k.readouts(["B du fil", "Déviation de la boussole nord", "B / B terrestre"]);
    var BH = 19;
    function Bw(i, rr){ return 20 * i / rr; }  /* µT, r en cm */
    k.draw(function(){
      c.clear(); g.clear();
      var ctx = c.ctx, cx = c.W / 2, cy = c.H / 2 + 6, sg = sens.value === "out" ? 1 : -1;
      var scale = Math.min(c.W, c.H) / 2 - 36, rmax = 20, rp = r.value / rmax * (scale - 20) + 20 ;
      /* cercles */
      [1, 2, 3, 4].forEach(function(j){ ctx.beginPath(); ctx.arc(cx, cy, 20 + (scale - 20) * j / 4 * 1, 0, 7); ctx.strokeStyle = "#e3e7ed"; ctx.lineWidth = 1; ctx.stroke(); });
      ctx.beginPath(); ctx.arc(cx, cy, rp, 0, 7); ctx.strokeStyle = "rgba(30,63,143,.7)"; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
      /* fil */
      ctx.beginPath(); ctx.arc(cx, cy, 13, 0, 7); ctx.fillStyle = "#c7cdd6"; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.stroke();
      if (sg > 0){ S.draw.dot(c, cx, cy, 4, P.ink); } else { S.draw.line(c, cx - 6, cy - 6, cx + 6, cy + 6, P.ink, 2.5); S.draw.line(c, cx - 6, cy + 6, cx + 6, cy - 6, P.ink, 2.5); }
      /* boussoles sur le cercle de rayon r */
      var b = Bw(I.value, r.value);
      for (var j = 0; j < 8; j++){
        var th = j * Math.PI / 4 + Math.PI / 2, px = cx + rp * Math.cos(th), py = cy - rp * Math.sin(th);
        /* tangente anti-horaire (vu de dessus, courant vers toi) : (-sin, -cos) en coordonnées écran */
        var tx = -Math.sin(th) * sg * (+1), ty = -Math.cos(th) * sg;
        /* anti-horaire en coordonnées écran avec y vers le bas : tangent = (-sin th, -cos th) car position = (cos, -sin) */
        var vx = tx * b + 0, vy = ty * b;
        if (terre.value){ vy += -BH; }
        var l = Math.sqrt(vx * vx + vy * vy); if (l < 1e-9){ vx = 0; vy = -1; l = 1; }
        ctx.save(); ctx.translate(px, py); ctx.rotate(Math.atan2(vy, vx));
        ctx.fillStyle = P.red; ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(0, -5); ctx.lineTo(0, 5); ctx.closePath(); ctx.fill();
        ctx.fillStyle = P.acc; ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(0, -5); ctx.lineTo(0, 5); ctx.closePath(); ctx.fill(); ctx.restore();
        if (j === 0) { S.draw.text(c, "Nord ↑", px + 34, py - 18, {size: 12, color: P.grey}); }
      }
      var dev = Math.atan(b / BH) * 180 / Math.PI;
      ro.set(0, S.fmt(b, 1) + " µT"); ro.set(1, terre.value ? S.fmt(dev, 0) + " °" : "—"); ro.set(2, S.fmt(b / 48, 2));
      /* graphe B(r) */
      var ymax = Math.max(40, Math.ceil(20 * I.value / 1 / 10) * 10);
      var ax = S.draw.axes(g, {x0: 0, x1: 20, y0: 0, y1: ymax, xl: "r (cm)", yl: "B (µT)", l: 52, t: 22});
      S.draw.fn(g, ax, function(x){ return x < 0.2 ? NaN : Bw(I.value, x); }, P.acc);
      S.draw.line(g, ax.L, ax.Y(BH), ax.R, ax.Y(BH), P.amber, 1.5, [5, 4]);
      S.draw.text(g, "champ terrestre horizontal ≈ 19 µT", ax.R - 4, ax.Y(BH) - 9, {size: 12, color: P.amber, align: "right"});
      S.draw.dot(g, ax.X(r.value), ax.Y(b), 6, P.red);
    });
    k.note("Tangente de la déviation : tan δ = B<sub>fil</sub> / B<sub>horizontal terrestre</sub> (au point situé au nord du fil).");
  }
});

SFA.sim({
  id: "p6-c01-solenoide", ch: "c01", tag: "Bobine",
  titre: "Le solénoïde : B = μ₀·N·I/L et le noyau de fer",
  resume: "Spires, courant, longueur, noyau de fer : une bobine devient un électroaimant.",
  but: "Règle N, I et L, puis ajoute un noyau de fer doux. Le graphe compare B(I) avec et sans noyau.",
  aRetenir: "À l'intérieur d'un long solénoïde, le champ est quasi uniforme : B = μ₀·(N/L)·I avec μ₀ = 4π·10⁻⁷ T·m/A. Un noyau de fer doux multiplie B par plusieurs centaines (jusqu'à saturation) : c'est le principe de l'électroaimant. La face qui, vue de face, est parcourue dans le sens anti-horaire est un pôle Nord.",
  piege: "B dépend du nombre de spires par mètre (N/L), pas de N seul : 200 spires étalées sur 40 cm font deux fois moins de champ que sur 20 cm. Modèle simplifié : solénoïde long, la saturation du fer est représentée par un plafond lisse vers 1,6 T.",
  build: function(k, S){
    var c = k.canvas(250), g = k.canvas(220), P = S.draw.palette, MU0 = 4 * Math.PI * 1e-7;
    var N = k.slider("Nombre de spires N", 50, 1000, 50, 400, "");
    var I = k.slider("Intensité I", 0, 5, 0.1, 2, "A");
    var L = k.slider("Longueur L", 10, 40, 1, 20, "cm");
    var fer = k.toggle("Noyau de fer doux (μr ≈ 300)", false);
    var sens = k.seg("Vu de la droite, le courant tourne", [["ccw", "↺ anti-horaire"], ["cw", "↻ horaire"]], "ccw");
    var ro = k.readouts(["Spires par mètre", "B au centre", "B ÷ champ terrestre (≈ 0,05 mT)"]);
    function B(i, n, l, iron){
      var b0 = MU0 * (n / (l / 100)) * i;
      if (!iron) return b0;
      var bs = 1.6; return bs * Math.tanh(300 * b0 / bs);
    }
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, H = c.H, cy = H / 2;
      var len = (W - 140) * (L.value / 40) * 0.6 + (W - 140) * 0.4, x0 = (W - len) / 2, x1 = x0 + len, h = 44;
      var turns = Math.min(40, Math.round(N.value / 25));
      if (fer.value){ ctx.fillStyle = "#b8bec8"; ctx.fillRect(x0 - 6, cy - h * 0.55, len + 12, h * 1.1); }
      ctx.strokeStyle = P.amber; ctx.lineWidth = 3;
      for (var t = 0; t < turns; t++){ var x = x0 + (t + 0.5) * len / turns; ctx.beginPath(); ctx.ellipse(x, cy, 6, h, 0, 0, 7); ctx.stroke(); }
      var b = B(I.value, N.value, L.value, fer.value);
      /* lignes de champ : intérieur + boucles extérieures */
      var north = sens.value === "ccw" ? 1 : -1; /* +1 : pôle Nord à droite */
      var xin0 = north > 0 ? x0 : x1, xin1 = north > 0 ? x1 : x0;
      if (I.value > 0){
        [-0.5, 0, 0.5].forEach(function(f){ S.draw.arrow(c, xin0 + (xin1 - xin0) * 0.25, cy + f * h * 0.8, xin0 + (xin1 - xin0) * 0.72, cy + f * h * 0.8, "rgba(30,63,143,.9)", 2); });
        [1, -1].forEach(function(sd){ [70, 100].forEach(function(R){
          ctx.beginPath(); ctx.strokeStyle = "rgba(30,63,143,.4)"; ctx.lineWidth = 1.5;
          ctx.moveTo(xin1, cy + sd * h * 0.4); ctx.bezierCurveTo(xin1 + north * R * 0.9, cy + sd * R * 1.1, xin0 - north * R * 0.9, cy + sd * R * 1.1, xin0, cy + sd * h * 0.4); ctx.stroke(); });
        });
      }
      S.draw.text(c, "N", north > 0 ? x1 + 22 : x0 - 22, cy, {size: 18, color: P.red});
      S.draw.text(c, "S", north > 0 ? x0 - 22 : x1 + 22, cy, {size: 18, color: P.acc});
      S.draw.text(c, "L = " + S.fmt(L.value, 0) + " cm", (x0 + x1) / 2, H - 14, {size: 12, color: P.grey});
      ro.set(0, S.fmt(N.value / (L.value / 100), 0) + " m⁻¹");
      ro.set(1, b >= 0.1 ? S.fmt(b, 2) + " T" : S.fmt(b * 1000, 2) + " mT");
      ro.set(2, S.fmt(b / 48e-6, 0));
      /* graphe B(I) */
      var bmax = Math.max(0.01, B(5, N.value, L.value, fer.value) * 1.05, B(5, N.value, L.value, false) * 1.05);
      var ax = S.draw.axes(g, {x0: 0, x1: 5, y0: 0, y1: bmax * 1000, xl: "I (A)", yl: "B (mT)", l: 54, t: 22});
      S.draw.fn(g, ax, function(i){ return B(i, N.value, L.value, false) * 1000; }, P.acc);
      if (fer.value) S.draw.fn(g, ax, function(i){ return B(i, N.value, L.value, true) * 1000; }, P.red, 2, [6, 4]);
      S.draw.text(g, fer.value ? "bleu : sans noyau   rouge pointillé : avec noyau de fer" : "bleu : sans noyau (coche le noyau pour comparer)", ax.R - 6, ax.B - 12, {size: 12, align: "right", color: P.ink});
      S.draw.dot(g, ax.X(I.value), ax.Y(b * 1000), 6, fer.value ? P.red : P.acc);
    });
  }
});

SFA.sim({
  id: "p6-c01-boussole-terre", ch: "c01", tag: "Niche · Terre",
  titre: "Une boussole qui plonge : l'inclinaison du champ terrestre",
  resume: "Déplace-toi du pôle à l'équateur : le champ magnétique terrestre s'incline, de 90° à 0°.",
  but: "Choisis la latitude magnétique : l'aiguille (rouge = pôle Nord de l'aiguille) montre la direction du champ terrestre, avec son inclinaison par rapport au sol.",
  aRetenir: "La Terre agit comme un énorme aimant. Aux pôles le champ est vertical (inclinaison 90°), à l'équateur il est horizontal (0°). Dans le modèle du dipôle : tan I = 2·tan φ. Chez nous, I ≈ 66° : une boussole ordinaire ne montre que la composante horizontale.",
  piege: "Le « pôle Nord magnétique » situé près du pôle Nord géographique est, physiquement, un pôle SUD d'aimant : c'est lui qui attire le pôle Nord de l'aiguille. Modèle du dipôle centré simplifié : le champ réel est irrégulier et les pôles se déplacent.",
  build: function(k, S){
    var c = k.canvas(380), P = S.draw.palette;
    var lat = k.slider("Latitude magnétique φ", -90, 90, 1, 50, "°");
    var ro = k.readouts(["Inclinaison I", "Champ total", "Composante horizontale"]);
    k.note("Valeurs en µT avec B<sub>équateur</sub> ≈ 31 µT (ordre de grandeur réel). Inclinaison positive = l'aiguille plonge vers le sol.");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, cx = W / 2, cy = H / 2, Re = Math.min(W, H) * 0.2;
      var l = lat.value * Math.PI / 180;
      function pt(r, la){ return [cx + r * Math.cos(la), cy - r * Math.sin(la)]; }
      /* lignes de champ fixes (r = r0 cos²λ) */
      [1.6, 2.4, 3.6].forEach(function(r0){ [1, -1].forEach(function(sd){
        ctx.beginPath(); var started = false;
        for (var la = -1.5; la <= 1.5; la += 0.02){ var r = r0 * Re * Math.cos(la) * Math.cos(la); if (r < Re) continue; var p = pt(r, la); if (sd < 0) p[0] = 2 * cx - p[0]; if (!started){ ctx.moveTo(p[0], p[1]); started = true; } else ctx.lineTo(p[0], p[1]); }
        ctx.strokeStyle = "rgba(30,63,143,.28)"; ctx.lineWidth = 1.5; ctx.stroke();
      }); });
      /* Terre */
      var gr = ctx.createLinearGradient(0, cy - Re, 0, cy + Re); gr.addColorStop(0, "#cfe3f5"); gr.addColorStop(1, "#d8e8d0");
      ctx.beginPath(); ctx.arc(cx, cy, Re, 0, 7); ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.stroke();
      S.draw.line(c, cx - Re * 1.1, cy, cx + Re * 1.1, cy, P.grey, 1, [4, 4]);
      S.draw.text(c, "Nord géographique", cx, cy - Re - 14, {size: 12});
      S.draw.text(c, "pôle S de l'aimant", cx, cy - Re - 30, {size: 12, color: P.acc});
      S.draw.text(c, "pôle N de l'aimant", cx, cy + Re + 14, {size: 12, color: P.red});
      /* ligne de champ passant par le point de latitude λ */
      var absl = Math.abs(l);
      if (absl > 0.12 && absl < 1.55){
        var r0 = Re / (Math.cos(l) * Math.cos(l));
        ctx.beginPath(); var st = false;
        for (var la = -absl; la <= absl + 1e-9; la += 0.01){ var r = r0 * Math.cos(la) * Math.cos(la); var p = pt(r, la); if (!st){ ctx.moveTo(p[0], p[1]); st = true; } else ctx.lineTo(p[0], p[1]); }
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
        ctx.strokeStyle = P.acc; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
      }
      /* point et aiguille */
      var pp = pt(Re, l), er = [Math.cos(l), -Math.sin(l)], eN = [Math.sin(l), -Math.cos(l)]; /* écran (y vers le bas) : nord local = (−sinλ, +cosλ) en maths → (−sin, −cos) ; ici nord = +θ */
      eN = [-Math.sin(l), -Math.cos(l)];
      var Br = -2 * Math.sin(l), Bn = Math.cos(l);
      var vx = Br * er[0] + Bn * eN[0], vy = Br * er[1] + Bn * eN[1], vl = Math.sqrt(vx * vx + vy * vy);
      var ux = vx / vl, uy = vy / vl, nl = 52;
      /* horizontale locale = direction du nord */
      S.draw.line(c, pp[0] - eN[0] * 40, pp[1] - eN[1] * 40, pp[0] + eN[0] * 40, pp[1] + eN[1] * 40, P.grey, 1.5, [3, 3]);
      var tx0 = pp[0] - ux * nl * 0.5, ty0 = pp[1] - uy * nl * 0.5, tx1 = pp[0] + ux * nl * 0.5, ty1 = pp[1] + uy * nl * 0.5;
      S.draw.line(c, tx0, ty0, pp[0], pp[1], P.acc, 5);
      S.draw.arrow(c, pp[0], pp[1], tx1, ty1, P.red, 5);
      S.draw.dot(c, pp[0], pp[1], 4, "#fff");
      var incl = Math.atan(2 * Math.tan(l)) * 180 / Math.PI; if (Math.abs(lat.value) === 90) incl = lat.value > 0 ? 90 : -90;
      var bt = 31 * Math.sqrt(1 + 3 * Math.sin(l) * Math.sin(l)), bh = 31 * Math.cos(l);
      ro.set(0, S.fmt(incl, 1) + " °"); ro.set(1, S.fmt(bt, 1) + " µT"); ro.set(2, S.fmt(bh, 1) + " µT");
      S.draw.text(c, "φ = " + S.fmt(lat.value, 0) + " °", pp[0] + (pp[0] > cx ? 38 : -38), pp[1] - 24, {size: 13, color: P.acc});
    });
  }
});
