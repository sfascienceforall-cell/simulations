/* Chapitre 2 · Force de Lorentz et force de Laplace */
SFA.sim({
  id: "p6-c02-particule-champ", ch: "c02", tag: "Classique",
  titre: "Une charge dans un champ magnétique uniforme",
  resume: "Électron, proton ou noyau d'hélium : trajectoire circulaire, rayon r = m·v/(|q|·B), période indépendante de la vitesse.",
  but: "Choisis la particule, la vitesse et le champ (entrant ⊗ ou sortant ⊙). La force magnétique est toujours perpendiculaire à la vitesse : elle courbe la trajectoire sans changer la vitesse.",
  aRetenir: "F = |q|·v·B·sin θ, perpendiculaire à v et à B (règle de la main droite pour q > 0, sens inversé pour q < 0). Pour v ⟂ B : trajectoire circulaire de rayon r = m·v/(|q|·B). La période T = 2π·m/(|q|·B) ne dépend pas de la vitesse.",
  piege: "La force magnétique ne travaille pas : elle ne peut ni accélérer ni ralentir la particule, seulement la dévier. Une charge immobile (v = 0) ne subit aucune force magnétique. Le rayon est exprimé à l'échelle de la barre : change de particule et regarde l'échelle.",
  build: function(k, S){
    var c = k.canvas(360), P = S.draw.palette;
    var parts = {e: {n: "Électron", m: 9.109e-31, q: -1.602e-19, col: P.acc}, p: {n: "Proton", m: 1.6726e-27, q: 1.602e-19, col: P.red}, a: {n: "Noyau d'hélium (α)", m: 6.6447e-27, q: 3.204e-19, col: P.green}};
    var sel = k.seg("Particule", [["e", "Électron"], ["p", "Proton"], ["a", "Particule α"]], "e");
    var v = k.slider("Vitesse v", 0.5, 10, 0.5, 3, "·10⁶ m/s");
    var B = k.slider("Champ B", 1, 100, 1, 10, "mT");
    var dirB = k.seg("Sens de B", [["in", "⊗ entrant"], ["out", "⊙ sortant"]], "in");
    var ro = k.readouts(["Rayon r", "Période T", "Sens de rotation"]);
    var th = 0, tr = [];
    var lp = k.loop(function(dt){ th += (st.dir) * 1.6 * dt; k.redraw(); });
    var st = {dir: 1};
    lp.play();
    function len(m){ return m >= 1 ? S.fmt(m, 2) + " m" : m >= 0.01 ? S.fmt(m * 100, 1) + " cm" : S.fmt(m * 1000, 2) + " mm"; }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, p = parts[sel.value], W = c.W, H = c.H, cx = W / 2, cy = H / 2;
      var vv = v.value * 1e6, Bt = B.value * 1e-3;
      var r = p.m * vv / (Math.abs(p.q) * Bt), T = 2 * Math.PI * p.m / (Math.abs(p.q) * Bt);
      var ccw = (p.q > 0) === (dirB.value === "in"); st.dir = ccw ? 1 : -1;
      /* symboles du champ */
      for (var gx = 30; gx < W; gx += 46) for (var gy = 26; gy < H; gy += 46){
        ctx.strokeStyle = "#b7c0cc"; ctx.lineWidth = 1.5;
        if (dirB.value === "out"){ ctx.beginPath(); ctx.arc(gx, gy, 6, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(gx, gy, 1.6, 0, 7); ctx.fillStyle = "#b7c0cc"; ctx.fill(); }
        else { ctx.beginPath(); ctx.arc(gx, gy, 6, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(gx - 4, gy - 4); ctx.lineTo(gx + 4, gy + 4); ctx.moveTo(gx - 4, gy + 4); ctx.lineTo(gx + 4, gy - 4); ctx.stroke(); }
      }
      var R = Math.min(W, H) * 0.34, sc = R / r;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.strokeStyle = p.col; ctx.lineWidth = 2; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
      var px = cx + R * Math.cos(th), py = cy - R * Math.sin(th);
      /* vitesse (tangente) et force (centripète) */
      var tx = -Math.sin(th) * st.dir, ty = -Math.cos(th) * st.dir;
      S.draw.arrow(c, px, py, px + tx * 52, py + ty * 52, P.ink, 3);
      S.draw.arrow(c, px, py, px + (cx - px) / R * 46, py + (cy - py) / R * 46, P.amber, 3);
      S.draw.dot(c, px, py, 9, p.col);
      S.draw.text(c, p.q > 0 ? "+" : "−", px, py, {color: "#fff", size: 14});
      S.draw.text(c, "v", px + tx * 62, py + ty * 62, {size: 14, color: P.ink, math: true});
      S.draw.text(c, "F", px + (cx - px) / R * 58, py + (cy - py) / R * 58, {size: 14, color: P.amber, math: true});
      S.draw.dot(c, cx, cy, 3, P.grey);
      /* barre d'échelle */
      var nice = Math.pow(10, Math.floor(Math.log10(r / 2))), mult = [1, 2, 5].filter(function(m){ return m * nice <= r; }).pop() || 1, L = mult * nice;
      var bx = 20, by = H - 20; S.draw.line(c, bx, by, bx + L * sc, by, P.ink, 3);
      S.draw.text(c, len(L), bx, by - 14, {size: 12, align: "left"});
      S.draw.text(c, p.n, W - 12, 18, {size: 13, align: "right", color: p.col});
      ro.set(0, len(r)); ro.set(1, T < 1e-6 ? S.fmt(T * 1e9, 2) + " ns" : S.fmt(T * 1e6, 2) + " µs"); ro.set(2, ccw ? "↺ anti-horaire" : "↻ horaire");
    });
  }
});

SFA.sim({
  id: "p6-c02-rail-laplace", ch: "c02", tag: "Animation",
  titre: "Le rail de Laplace : un courant dans un champ pousse la tige",
  resume: "F = B·I·L·sin θ : change B, I, L, la masse de la tige et le sens du courant, et vois la tige partir.",
  but: "Une tige conductrice posée sur deux rails, dans un champ vertical sortant. Règle les grandeurs : la force, l'accélération et la durée pour parcourir 1 m s'affichent. Le schéma du bas montre l'effet de l'angle θ entre le fil et le champ sur la force (pour les mêmes B, I et L).",
  aRetenir: "La force de Laplace sur un fil rectiligne : F = B·I·L·sin θ. Elle est maximale quand le fil est perpendiculaire au champ (θ = 90°), nulle quand il lui est parallèle. En inversant le courant ou le champ, on inverse la force. C'est le principe des moteurs et des haut-parleurs.",
  piege: "La force n'est ni dans la direction du champ ni dans celle du courant : elle est perpendiculaire aux deux. Dans la simulation il n'y a pas de frottement et le courant est supposé constant (en réalité l'induction le modifie : chapitre suivant). L'animation est ralentie ou accélérée : regarde la durée réelle.",
  build: function(k, S){
    var c = k.canvas(240), g = k.canvas(190), P = S.draw.palette;
    var B = k.slider("Champ B", 0.05, 0.5, 0.05, 0.2, "T");
    var I = k.slider("Intensité I", 0.5, 10, 0.5, 5, "A");
    var L = k.slider("Largeur des rails L", 5, 30, 1, 10, "cm");
    var m = k.slider("Masse de la tige m", 20, 200, 10, 50, "g");
    var th = k.slider("Angle θ fil–champ (schéma du bas)", 0, 90, 5, 90, "°");
    var sg = k.seg("Sens du courant dans la tige", [["up", "vers le haut (↑)"], ["down", "vers le bas (↓)"]], "up");
    var ro = k.readouts(["Force F", "Accélération", "Durée pour 1 m", "Vitesse après 1 m"]);
    var tau = 0, D = 2;
    function calc(){
      var F = B.value * I.value * (L.value / 100), a = F / (m.value / 1000);
      return {F: F, a: a, t1: a > 0 ? Math.sqrt(2 / a) : Infinity, v1: Math.sqrt(2 * a)};
    }
    var lp = k.loop(function(dt){ tau += dt; if (tau > D + 0.6) tau = 0; k.redraw(); });
    lp.play();
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, H = c.H, q = calc(), dir = sg.value === "up" ? 1 : -1;
      D = Math.max(1.5, Math.min(5, q.t1));
      var x0 = 40, x1 = W - 40, top = 40, bot = H - 40, u = Math.min(1, tau / D), pos = u * u * (q.F > 0 ? 1 : 0);
      var xr = x0 + 30 + pos * (x1 - x0 - 60) * (dir > 0 ? 1 : 1);
      /* champ sortant */
      for (var gx = x0 + 20; gx < x1; gx += 50) for (var gy = top + 20; gy < bot; gy += 50){ ctx.strokeStyle = "#cdd4de"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(gx, gy, 5, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(gx, gy, 1.4, 0, 7); ctx.fillStyle = "#cdd4de"; ctx.fill(); }
      S.draw.line(c, x0, top, x1, top, "#6b7686", 5); S.draw.line(c, x0, bot, x1, bot, "#6b7686", 5);
      /* tige : le sens positif du déplacement est vers la droite si F > 0 pour courant ↑ ; inversé sinon */
      var rx = dir > 0 ? xr : (x1 - (xr - x0));
      S.draw.line(c, rx, top, rx, bot, P.amber, 8);
      var fx = dir > 0 ? 1 : -1;
      var fl = 18 + 70 * Math.min(1, q.F / 1.5);
      S.draw.arrow(c, rx, (top + bot) / 2, rx + fx * fl, (top + bot) / 2, P.red, 4);
      S.draw.text(c, "F", rx + fx * (fl + 14), (top + bot) / 2 - 10, {size: 14, color: P.red, math: true});
      if (dir > 0) S.draw.arrow(c, rx + 22, bot - 6, rx + 22, top + 6, P.acc, 2); else S.draw.arrow(c, rx + 22, top + 6, rx + 22, bot - 6, P.acc, 2);
      S.draw.text(c, "I", rx + 36, (top + bot) / 2 + 30, {size: 14, color: P.acc, math: true});
      S.draw.text(c, "B ⊙ (vers toi)", x0 + 4, H - 14, {size: 12, align: "left", color: P.grey});
      S.draw.text(c, "1 m", x1, H - 14, {size: 12, align: "right", color: P.grey});
      ro.set(0, S.fmt(q.F, 3) + " N"); ro.set(1, S.fmt(q.a, 2) + " m/s²");
      ro.set(2, isFinite(q.t1) ? S.fmt(q.t1, 2) + " s" : "∞"); ro.set(3, S.fmt(q.v1, 1) + " m/s");
      /* schéma 2 : angle */
      var cx = g.W * 0.28, cy = g.H / 2, ctx2 = g.ctx, a = th.value * Math.PI / 180;
      for (var j = -1; j <= 1; j++) S.draw.arrow(g, cx - 80, cy + j * 34, cx + 80, cy + j * 34, "#9fb0c8", 2);
      S.draw.text(g, "B", cx + 90, cy, {size: 14, math: true, color: P.acc});
      S.draw.line(g, cx - Math.cos(a) * 60, cy + Math.sin(a) * 60, cx + Math.cos(a) * 60, cy - Math.sin(a) * 60, P.amber, 6);
      S.draw.text(g, "fil", cx + Math.cos(a) * 70, cy - Math.sin(a) * 70 - 8, {size: 12, color: P.amber});
      ctx2.beginPath(); ctx2.arc(cx, cy, 26, 0, -a, true); ctx2.strokeStyle = P.ink; ctx2.lineWidth = 2; ctx2.stroke();
      S.draw.text(g, "θ", cx + 40, cy - 12, {size: 14, math: true});
      var ax = S.draw.axes(g, {x0: 0, x1: 90, y0: 0, y1: 1, xl: "θ (°)", yl: "F / F max", l: 40 + g.W * 0.45, r: 14, t: 16, b: 30, stepX: 30, stepY: 0.5});
      S.draw.fn(g, ax, function(x){ return Math.sin(x * Math.PI / 180); }, P.red);
      S.draw.dot(g, ax.X(th.value), ax.Y(Math.sin(a)), 6, P.ink);
      S.draw.text(g, "F(θ) = " + S.fmt(q.F * Math.sin(a), 3) + " N", ax.X(45), ax.Y(0.2), {size: 12, color: P.ink});
    });
  }
});

SFA.sim({
  id: "p6-c02-moteur-cc", ch: "c02", tag: "Moteur",
  titre: "Le moteur à courant continu et son commutateur",
  resume: "Une spire dans un champ : le couple change avec l'angle. Pourquoi le commutateur est indispensable.",
  but: "Vue de bout : la spire a deux côtés actifs (⊙ et ⊗) qui subissent des forces opposées. Compare avec et sans commutateur ; le graphe montre le couple en fonction de l'angle.",
  aRetenir: "Une spire de N tours, d'aire A, dans un champ B : couple Γ = N·B·I·A·cos α (α = angle entre le plan de la spire et B). Sans commutateur, le couple s'inverse après 90° et la spire se stabilise (plan perpendiculaire à B). Le commutateur inverse le courant à chaque demi-tour : le couple garde le même sens, la spire tourne.",
  piege: "Le couple n'est pas constant : il s'annule quand le plan de la spire est perpendiculaire au champ (« point mort »). Un vrai moteur utilise plusieurs bobines décalées pour lisser le couple. Le mouvement de la spire sans commutateur est schématique (oscillation amortie).",
  build: function(k, S){
    var c = k.canvas(260), g = k.canvas(190), P = S.draw.palette;
    var N = k.slider("Nombre de spires N", 20, 200, 10, 100, "");
    var B = k.slider("Champ B", 0.05, 0.5, 0.05, 0.1, "T");
    var I = k.slider("Intensité I", 0.5, 5, 0.5, 2, "A");
    var comm = k.seg("Collecteur", [["avec", "Avec commutateur"], ["sans", "Sans commutateur"]], "avec", function(){ t = 0; });
    var ro = k.readouts(["Couple maximal", "Couple moyen sur un tour", "Couple à l'instant"]);
    var A = 0.01, t = 0, alpha = 0;
    var lp = k.loop(function(dt){
      t += dt;
      if (comm.value === "avec") alpha = (t * 2.2) % (2 * Math.PI);
      else alpha = Math.PI / 2 * (1 - Math.exp(-t / 1.6) * Math.cos(t * 3.2));
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, cx = c.W / 2, cy = c.H / 2, w = 70, tm = N.value * B.value * I.value * A;
      var cosA = Math.cos(alpha), avec = comm.value === "avec";
      var sgn = avec ? (cosA >= 0 ? 1 : -1) : 1;   /* le commutateur inverse le courant à chaque demi-tour */
      /* champ horizontal */
      for (var j = -3; j <= 3; j++) if (j) S.draw.arrow(c, cx - 190, cy + j * 34, cx - 100, cy + j * 34, "#b5c3da", 2), S.draw.arrow(c, cx + 100, cy + j * 34, cx + 190, cy + j * 34, "#b5c3da", 2);
      S.draw.text(c, "B", cx - 205, cy - 8, {size: 14, math: true, color: P.acc});
      /* aimants */
      ctx.fillStyle = "rgba(180,35,24,.15)"; ctx.fillRect(cx - 230, cy - 120, 20, 240); ctx.fillStyle = "rgba(30,63,143,.15)"; ctx.fillRect(cx + 210, cy - 120, 20, 240);
      S.draw.text(c, "N", cx - 220, cy, {size: 14, color: P.red}); S.draw.text(c, "S", cx + 220, cy, {size: 14, color: P.acc});
      /* spire : plan à l'angle alpha de B */
      var x1 = cx + w * Math.cos(alpha), y1 = cy - w * Math.sin(alpha), x2 = 2 * cx - x1, y2 = 2 * cy - y1;
      S.draw.line(c, x1, y1, x2, y2, P.amber, 5);
      /* courants (alternent avec commutateur) : côté 1 sortant si sgn>0 */
      function sym(x, y, out){ ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.stroke();
        if (out) S.draw.dot(c, x, y, 3.5, P.ink); else { S.draw.line(c, x - 5, y - 5, x + 5, y + 5, P.ink, 2); S.draw.line(c, x - 5, y + 5, x + 5, y - 5, P.ink, 2); } }
      sym(x1, y1, sgn > 0); sym(x2, y2, sgn < 0);
      /* forces : côté sortant → vers le haut */
      var fl = 46 * (0.35 + 0.65 * Math.min(1, tm / 5));
      S.draw.arrow(c, x1, y1 - 14, x1, y1 - 14 - (sgn > 0 ? fl : -fl) * 1, P.red, 3);
      S.draw.arrow(c, x2, y2 + 14, x2, y2 + 14 + (sgn > 0 ? fl : -fl) * 1, P.red, 3);
      S.draw.dot(c, cx, cy, 4, P.ink);
      S.draw.text(c, "α = " + S.fmt(alpha * 180 / Math.PI, 0) + "°", cx, c.H - 14, {size: 13});
      var inst = tm * cosA * sgn;
      var mean = avec ? 2 / Math.PI * tm : 0;
      ro.set(0, S.fmt(tm, 3) + " N·m"); ro.set(1, avec ? S.fmt(mean, 3) + " N·m" : "0 (sur un tour)"); ro.set(2, S.fmt(inst, 3) + " N·m");
      /* graphe couple/angle */
      var ax = S.draw.axes(g, {x0: 0, x1: 360, y0: -tm * 1.1, y1: tm * 1.1, xl: "α (°)", yl: "Γ (N·m)", l: 56, t: 18, stepX: 90});
      S.draw.fn(g, ax, function(x){ return tm * Math.cos(x * Math.PI / 180); }, P.acc, 2.2, [6, 4]);
      S.draw.fn(g, ax, function(x){ return tm * Math.abs(Math.cos(x * Math.PI / 180)); }, P.red, 2.8);
      var ad = alpha * 180 / Math.PI;
      S.draw.dot(g, ax.X(ad), ax.Y(inst), 6, P.ink);
      S.draw.text(g, "rouge : avec commutateur   bleu pointillé : sans", ax.R - 4, ax.T + 8, {size: 12, align: "right", color: P.ink});
    });
  }
});

SFA.sim({
  id: "p6-c02-spectrometre", ch: "c02", tag: "Niche · Chimie",
  titre: "Spectromètre de masse : trier des isotopes",
  resume: "Des ions accélérés puis déviés par B se posent à 2r du point d'entrée : r = (1/B)·√(2·m·U/q).",
  but: "Choisis un élément. La tension U accélère les ions, le champ B les fait tourner en demi-cercle. Plus l'ion est lourd, plus il tombe loin. Observe le spectre de masse en bas.",
  aRetenir: "Accélération : q·U = ½·m·v². Déviation : r = m·v/(q·B). D'où r = (1/B)·√(2·m·U/q). À U et B fixés, r est proportionnel à √m : les isotopes lourds tombent plus loin. La hauteur des pics donne l'abondance de chaque isotope.",
  piege: "La tension U ne trie pas les isotopes : à U fixée, tous les ions de même charge reçoivent la même énergie cinétique, les plus lourds vont simplement moins vite. Le tri vient de la déviation dans B : l'ion le plus lourd a la plus grande quantité de mouvement, donc le plus grand rayon. Modèle : ions simplement chargés (q = +e), dans le vide, sans relativité.",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette, u = 1.66054e-27, e = 1.60218e-19;
    var els = {
      Ne: {n: "Néon", iso: [[20, 19.99244, 90.5], [22, 21.99139, 9.5]]},
      Cl: {n: "Chlore", iso: [[35, 34.96885, 75.8], [37, 36.96590, 24.2]]},
      Mg: {n: "Magnésium", iso: [[24, 23.98504, 79.0], [25, 24.98584, 10.0], [26, 25.98259, 11.0]]},
      Cu: {n: "Cuivre", iso: [[63, 62.92960, 69.2], [65, 64.92779, 30.8]]}
    };
    var el = k.select("Élément", [["Ne", "Néon (²⁰Ne, ²²Ne)"], ["Cl", "Chlore (³⁵Cl, ³⁷Cl)"], ["Mg", "Magnésium (²⁴Mg, ²⁵Mg, ²⁶Mg)"], ["Cu", "Cuivre (⁶³Cu, ⁶⁵Cu)"]], "Ne");
    var U = k.slider("Tension d'accélération U", 200, 5000, 100, 2000, "V");
    var B = k.slider("Champ B", 0.05, 0.5, 0.01, 0.2, "T");
    var ro = k.readouts(["Rayon (isotope léger)", "Rayon (isotope lourd)", "Écart entre les impacts"]);
    var cols = [P.acc, P.red, P.green];
    function rad(mu){ return Math.sqrt(2 * mu * u * U.value / e) / B.value; }
    function len(m){ return m >= 1 ? S.fmt(m, 2) + " m" : S.fmt(m * 100, 1) + " cm"; }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, E = els[el.value], iso = E.iso;
      var rs = iso.map(function(i){ return rad(i[1]); }), rmax = Math.max.apply(null, rs);
      var yd = H - 90, x0 = 50, avail = W - 90, sc = Math.min(avail / (2 * rmax), (yd - 30) / rmax);
      /* champ entrant (croix) */
      for (var gx = 30; gx < W; gx += 40) for (var gy = 20; gy < yd - 6; gy += 40){ ctx.strokeStyle = "#cdd4de"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(gx, gy, 5, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(gx, gy, 1.4, 0, 7); ctx.fillStyle = "#cdd4de"; ctx.fill(); }
      S.draw.line(c, 20, yd, W - 20, yd, P.ink, 3);
      S.draw.text(c, "plaque détectrice", W - 20, yd + 14, {size: 12, align: "right", color: P.grey});
      S.draw.text(c, "B ⊙ (sortant)", 24, 14, {size: 12, align: "left", color: P.grey});
      /* trajectoires : demi-cercles posés sur yd, départ en x0 */
      iso.forEach(function(i, j){
        var R = rs[j] * sc;
        ctx.beginPath(); ctx.arc(x0 + R, yd, R, Math.PI, 2 * Math.PI); ctx.strokeStyle = cols[j]; ctx.lineWidth = 2.6; ctx.stroke();
        S.draw.dot(c, x0 + 2 * R, yd, 5, cols[j]);
        S.draw.text(c, i[0] + el.value, x0 + 2 * R, yd - 14 - j * 14, {size: 12, color: cols[j]});
      });
      S.draw.dot(c, x0, yd, 6, P.ink); S.draw.text(c, "source", x0, yd + 14, {size: 12});
      /* spectre (positions relatives) */
      var sy = H - 28, spec = [];
      S.draw.line(c, x0, sy, x0 + 2 * rmax * sc, sy, P.grey, 1);
      iso.forEach(function(i, j){ var X = x0 + 2 * rs[j] * sc, hgt = 36 * i[2] / 100; ctx.fillStyle = cols[j]; ctx.fillRect(X - 3, sy - hgt - 4, 6, hgt + 4); S.draw.text(c, S.fmt(i[2], 1) + " %", X, sy - hgt - 12, {size: 12, color: cols[j]}); });
      ro.set(0, len(rs[0])); ro.set(1, len(rs[rs.length - 1]));
      ro.set(2, S.fmt((2 * rs[rs.length - 1] - 2 * rs[0]) * 1000, 1) + " mm");
    });
  }
});
