/* Chapitre 6 · Ondes mécaniques */
SFA.sim({
  id: "p6-c06-corde-onde", ch: "c06", tag: "Classique",
  titre: "Une onde sur une corde : v = λ·f",
  resume: "Longueur d'onde, fréquence, célérité : la corde ne bouge que sur place, l'onde avance.",
  but: "Règle la fréquence, la tension et la masse linéique de la corde (v = √(T/μ)). Le point rouge suit une particule de la corde : elle monte et descend sur place alors que l'onde avance. Passe en onde longitudinale pour voir compressions et dilatations.",
  aRetenir: "Une onde progressive transporte de l'énergie sans transporter de matière : chaque point oscille autour de sa position de repos. Relation fondamentale : v = λ·f. La célérité v est fixée par le milieu (ici v = √(T/μ)) ; si on augmente la fréquence, c'est la longueur d'onde qui diminue. Transversale : déformation perpendiculaire à la propagation ; longitudinale : déformation parallèle (son, ressort).",
  piege: "Changer la fréquence ne change pas la vitesse de l'onde dans la corde : λ s'adapte. Et la matière ne voyage pas : suis le point rouge, il reste à sa place. Dessin : l'amplitude verticale est exagérée.",
  build: function(k, S){
    var c = k.canvas(260), P = S.draw.palette;
    var typ = k.seg("Type d'onde", [["tr", "Transversale"], ["lo", "Longitudinale"]], "tr");
    var f = k.slider("Fréquence f", 0.5, 4, 0.1, 1, "Hz");
    var Tn = k.slider("Tension T de la corde", 1, 20, 1, 4, "N");
    var mu = k.slider("Masse linéique μ", 0.05, 0.5, 0.05, 0.2, "kg/m");
    var A = k.slider("Amplitude A", 1, 5, 0.5, 3, "cm");
    var ro = k.readouts(["Célérité v = √(T/μ)", "Longueur d'onde λ = v/f", "Période T = 1/f", "Contrôle λ·f"]);
    var t = 0;
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, cy = H / 2 - 6, Lm = 12, px = (W - 40) / Lm, x0 = 20;
      var v = Math.sqrt(Tn.value / mu.value), lam = v / f.value, a = A.value * 7;
      function ph(x){ return 2 * Math.PI * (f.value * t - x / lam); }
      var x6 = 6;
      if (typ.value === "tr"){
        ctx.beginPath(); ctx.strokeStyle = P.acc; ctx.lineWidth = 3;
        for (var i = 0; i <= 300; i++){ var xm = Lm * i / 300; var y = cy - a * Math.sin(ph(xm)); if (i) ctx.lineTo(x0 + xm * px, y); else ctx.moveTo(x0 + xm * px, y); }
        ctx.stroke();
        S.draw.line(c, x0, cy, x0 + Lm * px, cy, "#c7cdd6", 1, [4, 4]);
        /* crêtes : phase = π/2 mod 2π */
        var xc0 = (((lam * (f.value * t - 0.25)) % lam) + lam) % lam;
        for (var xcr = xc0; xcr <= Lm; xcr += lam){ S.draw.dot(c, x0 + xcr * px, cy - a - 12, 4, P.amber); }
        var yp = cy - a * Math.sin(ph(x6));
        S.draw.line(c, x0 + x6 * px, cy - a - 8, x0 + x6 * px, cy + a + 8, "#e8b4af", 1, [3, 3]);
        S.draw.dot(c, x0 + x6 * px, yp, 7, P.red);
        S.draw.text(c, "particule de la corde", x0 + x6 * px, cy + a + 22, {size: 12, color: P.red});
      } else {
        var N = 100, amp = Math.min(0.14 * lam * px, A.value * 6), g0 = Lm * px / N, Xs = [];
        for (i = 0; i <= N; i++){ var xr = Lm * i / N; Xs.push(x0 + xr * px + amp * Math.sin(ph(xr))); }
        for (i = 0; i < N; i++){
          var ratio = g0 / Math.max(0.5, Xs[i + 1] - Xs[i]);
          ctx.fillStyle = "rgba(180,35,24," + Math.max(0, Math.min(0.6, 0.08 + 0.5 * (ratio - 1))) + ")"; ctx.fillRect(Xs[i], cy + 52, Math.max(1, Xs[i + 1] - Xs[i]) + 0.5, 14);
        }
        for (i = 0; i <= N; i++){ var isP = Math.abs(i - Math.round(x6 / Lm * N)) < 1; ctx.fillStyle = isP ? P.red : "rgba(30,63,143,.8)"; ctx.fillRect(Xs[i] - (isP ? 2 : 1.2), cy - 40, isP ? 4 : 2.4, 80); }
        S.draw.text(c, "zones comprimées (rouge foncé) / dilatées (clair)", x0 + Lm * px / 2, cy + 82, {size: 12, color: P.grey});
        S.draw.text(c, "particule rouge : va et vient sur place", x0 + x6 * px, cy - 52, {size: 12, color: P.red});
      }
      /* flèche de propagation et mesure de λ */
      S.draw.arrow(c, x0 + 4, H - 22, x0 + 74, H - 22, P.ink, 2); S.draw.text(c, "propagation", x0 + 112, H - 22, {size: 12});
      if (lam < Lm) { var lx = x0 + 3 * px; S.draw.line(c, lx, 22, lx + lam * px, 22, P.green, 3); S.draw.text(c, "λ", lx + lam * px / 2, 12, {size: 13, color: P.green, math: true}); }
      ro.set(0, S.fmt(v, 2) + " m/s"); ro.set(1, S.fmt(lam, 2) + " m"); ro.set(2, S.fmt(1 / f.value, 2) + " s"); ro.set(3, S.fmt(lam * f.value, 2) + " m/s");
    });
  }
});

SFA.sim({
  id: "p6-c06-cuve-ondes", ch: "c06", tag: "Diffraction · interférences",
  titre: "Cuve à ondes : diffraction et interférences",
  resume: "Une onde plane arrive sur une fente (ou deux) : plus la fente est étroite devant λ, plus l'onde s'étale.",
  but: "Une onde plane traverse un obstacle percé d'une ou de deux fentes. Fais varier λ, la largeur a et la distance d entre les fentes. Les pointillés montrent les directions prévues.",
  aRetenir: "Diffraction : une onde qui franchit une ouverture de largeur a s'étale d'autant plus que a est petit par rapport à λ ; le premier minimum est à sin θ = λ/a. Avec deux fentes, les ondes interfèrent : maxima dans les directions sin θ = m·λ/d, minima entre. Interférence constructive : les ondes arrivent en phase (différence de marche = m·λ).",
  piege: "La diffraction n'est pas un « rebond » sur les bords : toute onde la subit, et elle est importante quand a ≈ λ ou moins. Si a ≫ λ, l'onde passe presque droit. Modèle : somme de sources ponctuelles dans la fente (principe de Huygens), onde 2D sans amortissement, image instantanée animée.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62}), P = S.draw.palette;
    var mode = k.seg("Obstacle", [["1", "Une fente"], ["2", "Deux fentes"]], "1", dirty);
    var lam = k.slider("Longueur d'onde λ", 0.5, 3, 0.25, 1.5, "cm", dirty);
    var a = k.slider("Largeur d'une fente a", 0.5, 6, 0.25, 3, "cm", dirty);
    var d = k.slider("Distance entre fentes d (centre à centre)", 2, 8, 0.5, 5, "cm", dirty);
    var ang = k.toggle("Montrer les directions prévues", true);
    var ro = k.readouts(["Rapport λ/a", "1er minimum (1 fente)", "Maxima (2 fentes) sin θ = m·λ/d"]);
    var nt = k.note("", "ok");
    var cache = null, t = 0, CELL = 5;
    function dirty(){ cache = null; }
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    function compute(){
      var W = c.W, H = c.H, ppc = W / 24, xb = 4 * ppc, cols = Math.floor((W - xb) / CELL), rows = Math.floor(H / CELL), kk = 2 * Math.PI / lam.value;
      var srcs = [], step = Math.min(lam.value / 4, 0.5), centers = mode.value === "1" ? [0] : [-d.value / 2, d.value / 2], aw = a.value;
      if (mode.value === "2") aw = Math.min(aw, Math.max(0.5, d.value - 0.5));
      centers.forEach(function(cc){ var n = Math.max(2, Math.ceil(aw / step) + 1); for (var i = 0; i < n; i++) srcs.push(cc - aw / 2 + aw * i / (n - 1)); });
      var re = new Float32Array(cols * rows), im = new Float32Array(cols * rows), mx = 1e-9;
      for (var j = 0; j < rows; j++) for (var i2 = 0; i2 < cols; i2++){
        var X = (xb + (i2 + 0.5) * CELL - xb) / ppc + 0.1, Y = ((j + 0.5) * CELL - H / 2) / ppc, sr = 0, si = 0;
        for (var s = 0; s < srcs.length; s++){ var dy = Y - srcs[s], r = Math.sqrt(X * X + dy * dy), ph = kk * r, w = 1 / Math.sqrt(r + 0.5); sr += w * Math.cos(ph); si += w * Math.sin(ph); }
        re[j * cols + i2] = sr; im[j * cols + i2] = si; var mg = Math.sqrt(sr * sr + si * si); if (mg > mx && X > 3) mx = mg;
      }
      cache = {re: re, im: im, mx: mx, cols: cols, rows: rows, xb: xb, ppc: ppc, srcs: srcs, aw: aw};
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H;
      if (!cache || cache.cols !== Math.floor((W - 4 * W / 24) / CELL)) compute();
      var cc = cache, w = 2 * Math.PI * t * 0.5, cw = Math.cos(w), sw = Math.sin(w), kk = 2 * Math.PI / lam.value;
      ctx.fillStyle = "#f4f6fa"; ctx.fillRect(0, 0, W, H);
      /* onde plane incidente (gauche) */
      for (var x = 0; x < cc.xb - 2; x += 3){ var v = Math.cos(kk * (x / cc.ppc) - w); ctx.fillStyle = "rgba(30,63,143," + (0.5 + 0.35 * v) * 0.8 + ")"; ctx.fillRect(x, 0, 3, H); }
      /* champ à droite */
      var sc = 1 / (cc.mx * 0.8);
      for (var j = 0; j < cc.rows; j++) for (var i = 0; i < cc.cols; i++){
        var val = (cc.re[j * cc.cols + i] * cw + cc.im[j * cc.cols + i] * sw) * sc; val = Math.max(-1, Math.min(1, val));
        ctx.fillStyle = "rgba(30,63,143," + (0.5 + 0.4 * val) * 0.8 + ")"; ctx.fillRect(cc.xb + i * CELL, j * CELL, CELL + 0.5, CELL + 0.5);
      }
      /* obstacle */
      var cy = H / 2, centers = mode.value === "1" ? [0] : [-d.value / 2, d.value / 2], aw = cc.aw, gaps = centers.map(function(q){ return [cy + (q - aw / 2) * cc.ppc, cy + (q + aw / 2) * cc.ppc]; });
      ctx.fillStyle = "#13233a"; var yy = 0; gaps.sort(function(p, q){ return p[0] - q[0]; });
      gaps.forEach(function(g){ ctx.fillRect(cc.xb - 5, yy, 10, Math.max(0, g[0] - yy)); yy = g[1]; }); ctx.fillRect(cc.xb - 5, yy, 10, H - yy);
      /* directions prévues */
      var r1 = lam.value / cc.aw, r2 = lam.value / d.value, txt1 = r1 < 1 ? S.fmt(Math.asin(r1) * 180 / Math.PI, 0) + " °" : "aucun (λ > a)";
      if (ang.value){
        var ln = W - cc.xb - 6;
        if (mode.value === "1" && r1 < 1){ [1, -1].forEach(function(s){ var th = Math.asin(r1); S.draw.line(c, cc.xb, cy, cc.xb + ln * Math.cos(th), cy - s * ln * Math.sin(th), P.red, 2, [6, 5]); }); }
        if (mode.value === "2"){ for (var m = 0; m * r2 < 1; m++){ [1, -1].forEach(function(s){ if (m === 0 && s === -1) return; var th = Math.asin(m * r2); S.draw.line(c, cc.xb, cy, cc.xb + ln * Math.cos(th), cy - s * ln * Math.sin(th), P.amber, 2, [6, 5]); }); } }
      }
      var maxs = []; for (var mm = 0; mm * r2 <= 1 && mm < 8; mm++) maxs.push(mm === 0 ? "0°" : S.fmt(Math.asin(Math.min(1, mm * r2)) * 180 / Math.PI, 0) + "°");
      ro.set(0, S.fmt(r1, 2)); ro.set(1, txt1); ro.set(2, mode.value === "2" ? "m = 0, 1, 2… : " + maxs.join(", ") : "—");
      nt.set(r1 >= 1 ? "λ ≥ a : l'onde s'étale dans toutes les directions (presque circulaire)." : r1 > 0.3 ? "λ et a du même ordre : diffraction très visible." : "a ≫ λ : l'onde passe presque en ligne droite.", "ok");
      if (mode.value === "2" && a.value > d.value - 0.5) nt.set("Fentes trop larges pour cet écartement : largeur limitée à d − 0,5 cm.", "warn");
    });
  }
});

SFA.sim({
  id: "p6-c06-stationnaire", ch: "c06", tag: "Ondes stationnaires",
  titre: "Ondes stationnaires : nœuds, ventres et harmoniques",
  resume: "Une corde fixée aux deux bouts ne vibre bien qu'à certaines fréquences : f_n = n·v/(2L).",
  but: "Choisis l'harmonique n, la longueur de la corde et la célérité. Observe les nœuds (rouges) qui ne bougent jamais et les ventres (verts). Affiche les deux ondes progressives qui se superposent.",
  aRetenir: "Sur une corde de longueur L fixée aux deux extrémités, l'onde se réfléchit et se superpose à elle-même : seules les fréquences f_n = n·v/(2L) donnent une onde stationnaire, avec n fuseaux, n + 1 nœuds (bouts compris) et longueur d'onde λ_n = 2L/n. Le fondamental est n = 1. Raccourcir la corde (ou la tendre) rend le son plus aigu.",
  piege: "Dans une onde stationnaire, l'énergie ne se propage pas : les nœuds restent immobiles. La distance entre deux nœuds voisins est λ/2, pas λ. Animation ralentie : la fréquence réelle est donnée dans les mesures.",
  build: function(k, S){
    var c = k.canvas(260), P = S.draw.palette;
    var n = k.slider("Harmonique n", 1, 8, 1, 3, "");
    var L = k.slider("Longueur L de la corde", 0.5, 2, 0.05, 0.65, "m");
    var v = k.slider("Célérité v des ondes", 50, 300, 10, 120, "m/s");
    var comp = k.toggle("Montrer les deux ondes progressives", true);
    var ro = k.readouts(["Fréquence f_n", "Longueur d'onde λ_n = 2L/n", "Nœuds (bouts compris)", "Fondamental f₁"]);
    var t = 0;
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, cy = H / 2, x0 = 30, x1 = W - 30, a = 52, w = 2 * Math.PI * 0.7 * t;
      function Y(x){ return 2 * Math.sin(n.value * Math.PI * x) * Math.cos(w); }
      if (comp.value){ [1, -1].forEach(function(s){ ctx.beginPath(); ctx.strokeStyle = s > 0 ? "rgba(46,107,85,.45)" : "rgba(180,35,24,.4)"; ctx.lineWidth = 2; for (var i = 0; i <= 300; i++){ var x = i / 300, y = Math.sin(n.value * Math.PI * x - s * w) ; var X = x0 + x * (x1 - x0); if (i) ctx.lineTo(X, cy - a * y); else ctx.moveTo(X, cy - a * y); } ctx.stroke(); }); }
      ctx.beginPath(); ctx.strokeStyle = P.acc; ctx.lineWidth = 3.4;
      for (var i = 0; i <= 300; i++){ var x = i / 300, X = x0 + x * (x1 - x0), y = cy - a * Y(x); if (i) ctx.lineTo(X, y); else ctx.moveTo(X, y); } ctx.stroke();
      /* enveloppe */
      ctx.beginPath(); ctx.strokeStyle = "rgba(30,63,143,.25)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
      [1, -1].forEach(function(s){ ctx.beginPath(); for (var i2 = 0; i2 <= 300; i2++){ var x2 = i2 / 300, y2 = cy - s * 2 * a * Math.abs(Math.sin(n.value * Math.PI * x2)); if (i2) ctx.lineTo(x0 + x2 * (x1 - x0), y2); else ctx.moveTo(x0, y2); } ctx.stroke(); }); ctx.setLineDash([]);
      for (var q = 0; q <= n.value; q++) S.draw.dot(c, x0 + q / n.value * (x1 - x0), cy, 6, P.red);
      for (q = 0; q < n.value; q++){ var xv = x0 + (q + 0.5) / n.value * (x1 - x0); S.draw.dot(c, xv, cy - 2 * a * Math.sin((q + 0.5) * Math.PI) * Math.cos(w), 5, P.green); }
      ctx.fillStyle = "#6b7686"; ctx.fillRect(x0 - 8, cy - 22, 8, 44); ctx.fillRect(x1, cy - 22, 8, 44);
      S.draw.text(c, "points rouges : nœuds   points verts : ventres", W / 2, H - 14, {size: 12, color: P.grey});
      S.draw.text(c, "λ/2", x0 + (x1 - x0) / (2 * n.value), cy + a + 18, {size: 13, color: P.amber, math: true});
      S.draw.line(c, x0, cy + a + 8, x0 + (x1 - x0) / n.value, cy + a + 8, P.amber, 2);
      var fn = n.value * v.value / (2 * L.value);
      ro.set(0, S.fmt(fn, 1) + " Hz"); ro.set(1, S.fmt(2 * L.value / n.value, 3) + " m"); ro.set(2, String(n.value + 1)); ro.set(3, S.fmt(v.value / (2 * L.value), 1) + " Hz");
    });
  }
});

SFA.sim({
  id: "p6-c06-ola", ch: "c06", tag: "Niche · Stade",
  titre: "L'ola : une onde qui traverse la foule sans déplacer personne",
  resume: "Chaque spectateur se lève avec un retard sur son voisin : l'onde avance à v = distance entre sièges / retard.",
  but: "Une rangée de spectateurs se lève l'un après l'autre. Règle le retard entre voisins et la durée debout. Suis le spectateur numéro 10 (en rouge) : il ne quitte jamais son siège.",
  aRetenir: "Une onde est la propagation d'une perturbation de proche en proche. Ici, la vitesse de l'onde est v = (distance entre sièges) / (retard entre voisins), sans que personne ne se déplace. Le nombre de personnes debout en même temps vaut (durée debout) / (retard), et la « longueur » de la bosse est v × durée debout.",
  piege: "On confond souvent la vitesse de l'onde (plusieurs m/s) avec celle des spectateurs (ils font juste un aller-retour vertical). Une onde transporte de l'information et de l'énergie, pas de la matière.",
  build: function(k, S){
    var c = k.canvas(230), P = S.draw.palette;
    var dl = k.slider("Retard entre voisins", 0.04, 0.5, 0.02, 0.1, "s");
    var du = k.slider("Durée debout", 0.3, 1.5, 0.1, 0.8, "s");
    var ro = k.readouts(["Vitesse de l'onde", "Personnes debout en même temps", "Largeur de la bosse", "Mouvement horizontal d'un spectateur"]);
    var t = 0, N = 30, d = 0.5;
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, base = H - 60, step = (W - 40) / (N - 1), cycle = N * dl.value + du.value + 1.2, tt = t % cycle;
      for (var i = 0; i < N; i++){
        var s = tt - i * dl.value, up = (s >= 0 && s <= du.value) ? Math.sin(Math.PI * s / du.value) : 0, x = 20 + i * step, h = 22 + 34 * up;
        var col = i === 9 ? P.red : (up > 0 ? P.amber : P.acc);
        ctx.fillStyle = "#dfe5ee"; ctx.fillRect(x - step * 0.4, base + 14, step * 0.8, 6);
        S.draw.line(c, x, base + 12, x, base + 12 - h, col, 3.5);
        S.draw.dot(c, x, base + 6 - h, 5.5, col);
        if (up > 0){ S.draw.line(c, x, base + 12 - h * 0.7, x - 7, base + 12 - h * 0.9 - 6, col, 2.5); S.draw.line(c, x, base + 12 - h * 0.7, x + 7, base + 12 - h * 0.9 - 6, col, 2.5); }
      }
      S.draw.text(c, "spectateur n° 10 (reste à sa place)", 20 + 9 * step, base + 40, {size: 12, color: P.red});
      var v = d / dl.value, nb = du.value / dl.value;
      S.draw.arrow(c, 20, 26, Math.min(W - 20, 20 + 120), 26, P.ink, 2); S.draw.text(c, "sens de l'onde", 20 + 170, 26, {size: 12});
      ro.set(0, S.fmt(v, 1) + " m/s (" + S.fmt(v * 3.6, 0) + " km/h)"); ro.set(1, S.fmt(Math.min(nb, N), 1) + (nb > N ? " (toute la rangée de " + N + " : la bosse déborde)" : "")); ro.set(2, S.fmt(v * du.value, 1) + " m" + (v * du.value > (N - 1) * d ? " (plus longue que la rangée de " + S.fmt((N - 1) * d, 1) + " m)" : "")); ro.set(3, "0 m");
    });
    k.note("On suppose 0,50 m entre deux spectateurs voisins. Dans un vrai stade, l'ola avance à environ 10 à 12 m/s, soit 20 à 25 sièges par seconde.");
  }
});
