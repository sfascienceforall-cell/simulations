/* Biologie 4e · chapitre 10 · Cycle cellulaire et mitose */
SFA.sim({
  id:"b4-c10-mitose", ch:"c10", tag:"Animation · défi",
  titre:"Mitose pas à pas : chromosomes, chromatides, ADN",
  resume:"Fais avancer le cycle d'une cellule à 6 chromosomes, glisse sur la frise des phases et relève chromosomes, chromatides et ADN.",
  but:"Anime le cycle ou glisse le curseur rouge sur la frise du bas (ou touche une phase). Relève les compteurs, puis relève les défis.",
  aRetenir:"L'ADN est répliqué pendant la phase S de l'interphase, pas pendant la mitose. Prophase : les chromosomes (à 2 chromatides) se condensent. Métaphase : alignés au centre. Anaphase : les chromatides sœurs se séparent et migrent vers les pôles. Télophase : deux noyaux se reforment, puis la cytocinèse sépare deux cellules filles à 2n chromosomes identiques à la cellule mère.",
  piege:"En anaphase, il y a momentanément 12 chromosomes (chaque chromatide devient un chromosome) dans la cellule, avant la division en deux cellules de 6. Une cellule fille a 2C d'ADN, comme la cellule en G1.",
  build:function(k, S){
    var P = S.draw.palette, c = k.canvas(0, {ratio:.98});
    var ph = k.slider("Avancement du cycle", 0, 6.99, 0.01, 0, "");
    var ro = k.readouts(["Phase", "Chromosomes (dans la cellule)", "Chromatides", "ADN par noyau (2C = quantité en G1)"]);
    var ntD = k.note("", "");
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ var u = ph.value + dt * 0.55; if (u >= 6.99){ ph.set(6.99); lp.pause(); } else ph.set(u); k.redraw(); });
    k.button("▶ Animer le cycle", function(){ if (ph.value >= 6.95) ph.set(0); lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    var GOALS = [
      ["Trouve un moment où la cellule contient 12 chromosomes (et non 6).", function(u){ return u >= 5.05 && u < 6.6; }],
      ["Trouve un moment où il y a 12 chromatides mais seulement 6 chromosomes.", function(u){ return u >= 2 && u < 5; }],
      ["Arrête-toi quand la quantité d'ADN du noyau est en train de doubler.", function(u){ return u >= 1.1 && u < 1.95; }],
      ["Place les chromosomes alignés sur le plan équatorial.", function(u){ return u >= 4.15 && u < 5; }],
      ["Trouve l'instant où une cellule fille a 6 chromosomes et 2C d'ADN.", function(u){ return u >= 6.6; }]
    ], gi = 0;
    k.button("Défi suivant", function(){ gi = (gi + 1) % GOALS.length; });
    var NAMES = ["Interphase : G1", "Interphase : phase S", "Interphase : G2", "Prophase", "Métaphase", "Anaphase", "Télophase et cytocinèse"];
    var SHORT = ["G1", "S", "G2", "P", "M", "A", "T"];
    var TXT = [
      "La cellule croît et fonctionne. Chaque chromosome n'a qu'une chromatide (1 molécule d'ADN) ; la chromatine est étalée dans le noyau.",
      "L'ADN est répliqué (semi-conservatif) : chaque chromosome passe de 1 à 2 chromatides sœurs, jointes au centromère. Le nombre de chromosomes ne change pas.",
      "La réplication est finie, la cellule contrôle son ADN : 6 chromosomes à 2 chromatides = 12 chromatides, 4C.",
      "Les chromosomes se condensent et deviennent visibles ; l'enveloppe nucléaire se désagrège ; le fuseau se forme entre les deux centrosomes.",
      "Les chromosomes, accrochés aux fibres du fuseau par leur centromère, s'alignent dans le plan équatorial.",
      "Les chromatides sœurs se séparent et sont tirées vers les pôles ; chacune est désormais un chromosome : 12 chromosomes, 6 vers chaque pôle.",
      "Deux noyaux se reforment, les chromosomes se décondensent ; la cytocinèse sépare deux cellules filles à 6 chromosomes (2C), identiques à la mère."
    ];
    var LF = [1, 1, 0.82, 0.82, 0.64, 0.64], MAT = "#c0321d", PAT = "#1f4b9e";
    var BASE = [[-.28,-.22],[.22,-.3],[-.34,.12],[.3,.08],[-.05,.3],[.08,-.05]], ANG = [0.4, -0.7, 1.1, 0.2, -0.3, 0.9];
    function ease(x){ x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
    function lerp(a, b, t){ return a + (b - a) * t; }
    /* chromosome à une ou deux chromatides : (x,y) centre, ang, longueur, couleur, condensation, duplication (0→1) */
    function chromo(x, y, ang, L, col, cd, dup, seed){
      var ctx = c.ctx, ca = Math.cos(ang), sa = Math.sin(ang), n = 14, g = lerp(2.2, 3.4, cd), A = (1 - cd) * 4.5 + 0.4;
      ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = col;
      var nch = dup > 0.02 ? 2 : 1;
      for (var s = 0; s < nch; s++){
        var sg = nch === 1 ? 0 : (s ? 1 : -1), lenS = (s === 1 && dup < 1) ? dup : 1;
        ctx.lineWidth = lerp(1.7, 5.2, cd); ctx.globalAlpha = s ? 0.82 : 1; ctx.beginPath();
        for (var q = 0; q <= n; q++){
          var t = q / n * 2 - 1; if (Math.abs(t) > lenS + 0.001 && s === 1) break;
          var tt = s === 1 && dup < 1 ? -1 + (q / n) * 2 * lenS : t;
          var off = sg * g * (cd > 0.3 ? Math.abs(tt) * 0.9 + 0.1 : 0.5) + Math.sin(tt * 4.2 + seed) * A;
          var lx = tt * L / 2, px = x + lx * ca - off * sa, py = y + lx * sa + off * ca;
          q ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();
      if (cd > 0.5 && nch === 2){ ctx.save(); ctx.globalAlpha = (cd - 0.5) * 2; S.draw.dot(c, x, y, 3.2, "#13233a"); ctx.restore(); }
    }
    function vchrom(xc, yc, sg, L, col, cd, seed){      /* chromatide unique, centromère en tête vers le pôle sg */
      var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lerp(2, 5, cd); ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(xc - sg * L * 0.42, yc - L * 0.5 * (cd > 0.3 ? 1 : 0.7)); ctx.lineTo(xc, yc); ctx.lineTo(xc - sg * L * 0.42, yc + L * 0.5 * (cd > 0.3 ? 1 : 0.7)); ctx.stroke(); ctx.restore();
      S.draw.dot(c, xc, yc, 2.8, "#13233a");
    }
    var tl = {};   /* frise cliquable */
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, u = ph.value, p = Math.min(6, Math.floor(u)), f = u - p;
      var hc = H * 0.70, cx = W / 2, cy = hc * 0.5 + 6, R = Math.min(W * 0.34, hc * 0.40);
      /* fond : milieu de culture subtil */
      var bg = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, Math.max(W, hc) * 0.7); bg.addColorStop(0, "#fbf7fb"); bg.addColorStop(1, "#f3eef6");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, hc + 6);
      /* forme de la cellule */
      var rx = R, ry = R, pinch = 0;
      if (p === 5){ rx = R * (1 + 0.36 * ease(f)); ry = R * (1 - 0.1 * ease(f)); }
      if (p === 6){ rx = R * 1.36; ry = R * 0.9; pinch = ease(f * 1.15); }
      if (p === 4){ rx = R * 1; }
      ctx.save();
      ctx.beginPath();
      for (var q = 0; q <= 140; q++){
        var th = q / 140 * 6.2832, xx = Math.cos(th) * rx, yy = Math.sin(th) * ry * (1 - pinch * 0.93 * Math.exp(-Math.pow(xx / (rx * 0.3), 2)));
        q ? ctx.lineTo(cx + xx, cy + yy) : ctx.moveTo(cx + xx, cy + yy);
      }
      ctx.closePath(); var cg = ctx.createRadialGradient(cx - R * .3, cy - R * .3, R * .1, cx, cy, R * 1.5); cg.addColorStop(0, "#fff4f4"); cg.addColorStop(1, "#f9d9dc");
      ctx.fillStyle = cg; ctx.shadowColor = "rgba(15,27,45,.16)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4; ctx.fill(); ctx.shadowColor = "transparent"; ctx.lineWidth = 3; ctx.strokeStyle = "#9f1239"; ctx.stroke(); ctx.restore();
      /* noyau */
      var nuA = p <= 2 ? 1 : p === 3 ? 1 - ease(f * 1.4) : 0;
      if (nuA > 0.02){ ctx.save(); ctx.globalAlpha = nuA; var ng = ctx.createRadialGradient(cx, cy, 2, cx, cy, R * 0.62); ng.addColorStop(0, "#e9f0ff"); ng.addColorStop(1, "#c9d9f7"); ctx.beginPath(); ctx.arc(cx, cy, R * 0.6, 0, 6.2832); ctx.fillStyle = ng; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = P.acc; ctx.stroke(); ctx.restore(); }
      if (p === 6){ [-1, 1].forEach(function(sg){ var nx = cx + sg * rx * 0.5; ctx.save(); ctx.globalAlpha = ease(f * 1.4); ctx.beginPath(); ctx.arc(nx, cy, R * 0.4, 0, 6.2832); ctx.fillStyle = "#dbe6fb"; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = P.acc; ctx.stroke(); ctx.restore(); }); }
      /* pôles / centrosomes */
      var polX = p <= 2 ? 0.22 : p === 3 ? lerp(0.22, 0.88, ease(f)) : 0.88, spA = p <= 2 ? (p === 2 ? f * 0.5 : 0) : 1;
      var pole = (p === 5 ? rx * 0.86 : p === 6 ? 0 : R * polX), showSp = p >= 3 && p <= 5;
      if (p <= 3 || showSp){
        [-1, 1].forEach(function(sg){ if (p === 6) return; var px = cx + sg * pole; ctx.save(); ctx.globalAlpha = p === 3 ? 0.4 + 0.6 * ease(f) : 1; S.draw.glow(c, px, cy, 14, P.amber, 0.45); S.draw.dot(c, px, cy, 4.8, P.amber); ctx.restore(); });
      }
      /* chromosomes */
      var plateSp = R * 0.285;
      for (var i = 0; i < 6; i++){
        var col = i % 2 ? PAT : MAT, L1 = LF[i] * R * 0.62, bx = cx + BASE[i][0] * R * 1.3, by = cy + BASE[i][1] * R * 1.3, py = cy + (i - 2.5) * plateSp;
        if (p <= 2){
          var dup = p === 0 ? 0 : p === 1 ? f : 1;
          chromo(bx, by, ANG[i], L1 * 0.95, col, 0, dup, i * 1.7);
        } else if (p === 3){
          var m = ease(f), x = lerp(bx, cx + BASE[i][0] * R * 0.7, m * 0.6), y = lerp(by, lerp(by, py, 0.5), m * 0.6);
          chromo(x, y, lerp(ANG[i], Math.PI / 2, m * 0.5), L1 * lerp(0.95, 0.5, m), col, m, 1, i * 1.7);
          if (f > 0.35){ S.draw.line(c, cx - pole, cy, x, y, "rgba(95,107,122," + (0.35 * ease((f - 0.35) * 1.5)) + ")", 1); S.draw.line(c, cx + pole, cy, x, y, "rgba(95,107,122," + (0.35 * ease((f - 0.35) * 1.5)) + ")", 1); }
        } else if (p === 4){
          var m2 = ease(f * 1.3), jit = Math.sin(i * 2.3 + u * 6) * (1 - m2) * 4;
          var x4 = lerp(cx + BASE[i][0] * R * 0.7, cx + jit, m2), y4 = lerp(lerp(by, py, 0.5), py, m2);
          S.draw.line(c, cx - pole, cy, x4, y4, "rgba(95,107,122,.38)", 1); S.draw.line(c, cx + pole, cy, x4, y4, "rgba(95,107,122,.38)", 1);
          chromo(x4, y4, lerp(lerp(ANG[i], Math.PI / 2, 0.5), Math.PI / 2, m2), L1 * 0.52, col, 1, 1, i * 1.7);
        } else if (p === 5){
          var e5 = ease(f); [-1, 1].forEach(function(sg){
            var xc = cx + sg * lerp(2, rx * 0.66, e5), yy5 = py * 1 + (cy - py) * (e5 * 0.45) * 0 + (py - cy) * (1 - e5 * 0.3) - (py - cy);
            var ypos = cy + (py - cy) * lerp(1, 0.78, e5);
            S.draw.line(c, cx + sg * pole, cy, xc, ypos, "rgba(95,107,122,.4)", 1);
            if (f < 0.04) chromo(xc, ypos, Math.PI / 2, L1 * 0.52, col, 1, 1, i * 1.7); else vchrom(xc, ypos, sg, L1 * 0.52 * lerp(1, 0.85, e5), col, 1, i);
          });
        } else {
          var e6 = ease(f * 1.2); [-1, 1].forEach(function(sg){
            var xn = cx + sg * rx * 0.5, xp = cx + sg * rx * 0.66, ypos2 = cy + (py - cy) * lerp(0.78, 0.5, e6);
            chromo(lerp(xp, xn + BASE[i][0] * R * 0.55, e6), lerp(ypos2, cy + BASE[i][1] * R * 0.6, e6), lerp(Math.PI / 2, ANG[i], e6), L1 * lerp(0.5, 0.65, e6), col, 1 - e6, 0, i * 1.7);
          });
        }
      }
      /* plan équatorial */
      if (p === 4 && f > 0.4){ ctx.save(); ctx.globalAlpha = Math.min(0.7, (f - 0.4)); S.draw.line(c, cx, cy - R * 0.95, cx, cy + R * 0.95, P.amber, 1.5, [4, 4]); ctx.restore(); S.draw.label(c, "plan équatorial", cx, cy - R - 8, {color:P.amber, size:11}); }
      if (p === 1) S.draw.label(c, "réplication de l'ADN", cx, cy + R * 0.9, {color:P.red});
      if (p === 5 && f > 0.15) S.draw.label(c, "6 chromosomes vers chaque pôle", cx, cy + ry + 14, {color:P.acc});
      if (p === 6 && f > 0.5) S.draw.label(c, "2 cellules filles : 6 chromosomes, 2C", cx, cy + ry + 14, {color:P.green});
      S.draw.label(c, NAMES[p], 10, 16, {color:P.mat, align:"left", size:13});
      /* légende */
      S.draw.legend(c, [[MAT, "chromosome d'origine maternelle"], [PAT, "chromosome d'origine paternelle"]], W - 8, 8, {align:"right"});
      /* frise du cycle + courbe d'ADN */
      var fx0 = 34, fx1 = W - 14, fy0 = hc + 22, fy1 = H - 26, bw = (fx1 - fx0) / 7;
      tl = {x0:fx0, x1:fx1, y0:fy0 - 14, y1:H};
      var bands = ["#dbe7fb", "#fde9c4", "#cfe9de", "#e6dcfa", "#e6dcfa", "#e6dcfa", "#e6dcfa"];
      for (i = 0; i < 7; i++){
        ctx.fillStyle = bands[i]; ctx.globalAlpha = i === p ? 1 : 0.75; ctx.fillRect(fx0 + i * bw, fy0, bw - 1, fy1 - fy0); ctx.globalAlpha = 1;
        S.draw.text(c, SHORT[i], fx0 + (i + 0.5) * bw, fy1 + 11, {size:11, color:i === p ? P.ink : "#5f6b7a", weight:i === p ? 800 : 700});
      }
      S.draw.text(c, "interphase", fx0 + 1.5 * bw, fy0 - 7, {size:10, color:"#5f6b7a"}); S.draw.text(c, "mitose", fx0 + 5 * bw, fy0 - 7, {size:10, color:"#5f6b7a"});
      function Y(v){ return fy1 - (v / 4.4) * (fy1 - fy0); }
      S.draw.text(c, "4C", fx0 - 9, Y(4), {size:10, color:"#5f6b7a"}); S.draw.text(c, "2C", fx0 - 9, Y(2), {size:10, color:"#5f6b7a"});
      ctx.save(); ctx.strokeStyle = P.green; ctx.lineWidth = 2.6; ctx.lineJoin = "round"; ctx.beginPath();
      var pts = [[0, 2], [1, 2], [2, 4], [6, 4], [6.55, 4], [6.99, 2]];
      pts.forEach(function(q, j){ var xq = fx0 + q[0] * bw, yq = Y(q[1]); j ? ctx.lineTo(xq, yq) : ctx.moveTo(xq, yq); }); ctx.stroke(); ctx.restore();
      S.draw.text(c, "ADN par noyau", fx1 - 2, fy0 + 9, {size:10, color:P.green, align:"right"});
      var ux = fx0 + u * bw; S.draw.line(c, ux, fy0 - 3, ux, fy1 + 2, P.red, 2); S.draw.dot(c, ux, fy0 - 3, 5.5, P.red);
      /* compteurs */
      var chr = p < 5 ? 6 : 12, chm = p === 0 ? 6 : p === 1 ? 6 + Math.round(6 * f) : 12, dna = p === 0 ? "2C" : p === 1 ? S.fmt(2 + 2 * f, 1) + "C" : p < 6 ? "4C" : (f < 0.55 ? "4C" : "2C par cellule fille");
      if (p === 6 && f >= 0.55) chr = "6 + 6";
      ro.set(0, NAMES[p]); ro.set(1, chr); ro.set(2, chm === 12 && p >= 5 ? "12 (1 par chromosome)" : chm); ro.set(3, dna);
      var ok = GOALS[gi][1](u);
      ntD.set("<b>Défi " + (gi + 1) + "/" + GOALS.length + ".</b> " + GOALS[gi][0] + (ok ? " <b>Réussi !</b>" : ""), ok ? "ok" : "warn");
      nt.set("<b>" + NAMES[p] + ".</b> " + TXT[p], p === 5 ? "warn" : "");
    });
    c.pointer(function(type, e){
      if (!tl.x0 || e.y < tl.y0 || type === "move") return;
      if (type === "down" || type === "drag"){ lp.pause(); ph.set(Math.max(0, Math.min(6.99, (e.x - tl.x0) / (tl.x1 - tl.x0) * 7))); k.redraw(); }
    });
    c.cv.style.touchAction = "pan-y";
  }
});

SFA.sim({
  id:"b4-c10-adn", ch:"c10", tag:"Graphes · comptage",
  titre:"Le cycle et la quantité d'ADN : courbe, histogramme, comptage",
  resume:"Règle la durée de chaque phase : la courbe d'ADN, la répartition d'une population et l'indice mitotique s'ajustent.",
  but:"Choisis la durée de G1, S, G2 et M. Observe la quantité d'ADN au cours du temps, puis compte 200 cellules sur une « lame » pour retrouver les durées.",
  aRetenir:"La quantité d'ADN par noyau passe de 2C à 4C pendant la phase S (réplication), reste à 4C en G2 et en mitose, puis retombe à 2C après la division. Dans une population de cellules non synchronisées, la proportion de cellules dans une phase est proportionnelle à la durée de cette phase : indice mitotique = durée de M ÷ durée du cycle.",
  piege:"Ce n'est pas la mitose qui double l'ADN : c'est la phase S. La mitose est la phase la plus courte (≈ 1 h sur un cycle de 24 h), d'où peu de cellules en mitose sur une lame. Un comptage de 200 cellules donne une estimation avec une marge d'erreur.",
  build:function(k, S){
    var c1 = k.canvas(190), c2 = k.canvas(190), c3 = k.canvas(120);
    var g1 = k.slider("Durée de G1", 4, 16, 1, 10, "h");
    var s = k.slider("Durée de S", 4, 12, 1, 8, "h");
    var g2 = k.slider("Durée de G2", 2, 8, 1, 4, "h");
    var m = k.slider("Durée de M (mitose)", 0.5, 2, 0.5, 1, "h");
    var ro = k.readouts(["Durée du cycle", "Cellules en G1", "Cellules en mitose (indice mitotique)", "Estimation de M par comptage"]);
    var nt = k.note("", "");
    var st = {cnt:null};
    k.button("Compter 200 cellules sur la lame", function(){ var T = g1.value + s.value + g2.value + m.value, d = [g1.value, s.value, g2.value, m.value], cnt = [0, 0, 0, 0]; for (var i = 0; i < 200; i++){ var u = Math.random() * T, q = 0; while (q < 3 && u >= d[q]){ u -= d[q]; q++; } cnt[q]++; } st.cnt = cnt; }, true);
    k.button("Effacer le comptage", function(){ st.cnt = null; });
    k.draw(function(){
      var d = [g1.value, s.value, g2.value, m.value], T = d[0] + d[1] + d[2] + d[3], fr = d.map(function(x){ return x / T; });
      c1.clear(); var ax = S.draw.axes(c1, {x0:0, x1:T, y0:0, y1:5, xl:"temps (h)", stepX:T > 30 ? 10 : 5, stepY:1, l:50});
      function dna(t){ if (t < d[0]) return 2; if (t < d[0] + d[1]) return 2 + 2 * (t - d[0]) / d[1]; if (t < d[0] + d[1] + d[2] + d[3] - 1e-9) return 4; return 2; }
      S.draw.fn(c1, ax, function(t){ return dna(t); }, B4.pal.acc, 3);
      var cum = 0, nm = ["G1", "S", "G2", "M"], cols = ["#cbd5e1", "#fde68a", "#bbf7d0", "#fecaca"];
      for (var i = 0; i < 4; i++){ var xa = ax.X(cum), xb = ax.X(cum + d[i]); c1.ctx.fillStyle = cols[i]; c1.ctx.globalAlpha = 0.5; c1.ctx.fillRect(xa, ax.T, xb - xa, ax.B - ax.T); c1.ctx.globalAlpha = 1; B4.txt(c1, nm[i], (xa + xb) / 2, ax.T + 10 + (i === 3 ? 14 : 0), B4.pal.ink, 12); cum += d[i]; }
      B4.txt(c1, "ADN par noyau (en C)", ax.L + 6, ax.Y(0.6), "#5f6b7a", 12, "left");
      S.draw.fn(c1, ax, function(t){ return dna(t); }, B4.pal.acc, 3);
      /* histogramme d'ADN d'une population */
      c2.clear(); var bx = S.draw.axes(c2, {x0:1.5, x1:4.5, y0:0, y1:1, xl:"ADN par cellule (C)", stepX:0.5, stepY:0.25, l:50});
      function dens(x){ var gs = function(mu){ return Math.exp(-Math.pow((x - mu) / 0.09, 2) / 2) / (0.09 * 2.5066); }; return fr[0] * gs(2) + (fr[2] + fr[3]) * gs(4) + fr[1] * (x > 2 && x < 4 ? 0.5 : 0); }
      var ctx2 = c2.ctx; ctx2.save(); ctx2.beginPath(); ctx2.moveTo(bx.X(1.5), bx.B);
      var maxd = 0; for (x = 1.5; x <= 4.5; x += 0.01) maxd = Math.max(maxd, dens(x));
      for (var x = 1.5; x <= 4.5; x += 0.01) ctx2.lineTo(bx.X(x), bx.Y(dens(x) / Math.max(1.2, maxd) * 0.95)); ctx2.lineTo(bx.X(4.5), bx.B); ctx2.closePath(); ctx2.fillStyle = "rgba(30,63,143,.25)"; ctx2.fill(); ctx2.strokeStyle = B4.pal.acc; ctx2.lineWidth = 2.4; ctx2.stroke(); ctx2.restore();
      B4.txt(c2, "G1 : " + S.fmt(fr[0] * 100, 0) + " %", bx.X(2), bx.Y(0.95) - 8, B4.pal.ink, 12); B4.txt(c2, "S : " + S.fmt(fr[1] * 100, 0) + " %", bx.X(3), bx.Y(0.3), B4.pal.ink, 12);  B4.txt(c2, "G2 + M : " + S.fmt((fr[2] + fr[3]) * 100, 0) + " %", bx.X(4), bx.Y(0.95) - 8, B4.pal.ink, 12);
      /* comptage */
      c3.clear(); var cnt = st.cnt, estM = null;
      B4.txt(c3, cnt ? "Comptage de 200 cellules (trait noir : proportion réelle)" : "Clique sur « Compter 200 cellules sur la lame »", 10, 12, "#5f6b7a", 12, "left");
      if (cnt){
        var w = (c3.W - 40) / 4;
        for (i = 0; i < 4; i++){ var h = cnt[i] / 200 * 80; c3.ctx.fillStyle = ["#94a3b8", "#f59e0b", "#22c55e", "#ef4444"][i]; c3.ctx.fillRect(20 + i * w + 10, 105 - h, w - 20, h); S.draw.line(c3, 20 + i * w + 6, 105 - fr[i] * 80, 20 + i * w + w - 6, 105 - fr[i] * 80, "#13233a", 2); B4.txt(c3, nm[i] + " : " + cnt[i], 20 + i * w + w / 2, 115, B4.pal.ink, 12); }
        estM = cnt[3] / 200 * T;
      }
      ro.set(0, S.fmt(T, 1) + " h"); ro.set(1, S.fmt(fr[0] * 100, 0) + " %"); ro.set(2, S.fmt(fr[3] * 100, 1) + " %"); ro.set(3, cnt ? S.fmt(estM, 1) + " h (réel : " + S.fmt(d[3], 1) + " h)" : "—");
      nt.set(cnt ? "Sur 200 cellules, " + cnt[3] + " en mitose : durée de M ≈ " + cnt[3] + " ÷ 200 × " + S.fmt(T, 1) + " h = " + S.fmt(estM, 1) + " h. L'estimation varie d'un comptage à l'autre : plus on compte de cellules, plus elle est précise." : "Plus une phase dure longtemps, plus on y trouve de cellules. À T = " + S.fmt(T, 1) + " h, la mitose (" + S.fmt(d[3], 1) + " h) ne représente que " + S.fmt(fr[3] * 100, 1) + " % des cellules.", "");
    });
  }
});

SFA.sim({
  id:"b4-c10-cancer", ch:"c10", tag:"Contrôle du cycle · modèle",
  titre:"Perdre le contrôle du cycle : naissance d'une tumeur",
  resume:"Compare un tissu normal en équilibre et une population où un gène est altéré : division accrue ou mort cellulaire réduite.",
  but:"Règle la durée du cycle, la part de cellules qui se divisent et la mort cellulaire. Essaie les 4 scénarios et regarde le temps pour atteindre 10⁹ cellules (≈ 1 cm³).",
  aRetenir:"Dans un tissu normal, divisions et mort cellulaire (apoptose) s'équilibrent. Un oncogène activé pousse davantage de cellules à se diviser ; un gène suppresseur de tumeur muté (comme p53) supprime les freins : les cellules anormales ne s'arrêtent plus ni ne meurent. Quand les divisions dépassent la mort, la population croît exponentiellement, d'abord sans symptôme.",
  piege:"Une cellule cancéreuse ne se divise pas forcément plus vite : souvent c'est la proportion de cellules qui continuent à se diviser, ou qui échappent à la mort, qui change. Modèle simplifié : croissance exponentielle sans limite ni évolution. Une tumeur demande des années pour devenir détectable.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.8});
    var T = k.slider("Durée du cycle", 12, 96, 6, 48, "h");
    var g = k.slider("Cellules qui se divisent", 0, 100, 1, 10, "%");
    var d = k.slider("Mort cellulaire (apoptose)", 0, 30, 0.5, 3.5, "% par jour");
    var ro = k.readouts(["Naissances", "Morts", "Croissance nette", "Temps pour 10⁹ cellules"]);
    var nt = k.note("", "");
    k.button("Tissu normal", function(){ T.set(48); g.set(10); d.set(3.5); }, true);
    k.button("Oncogène activé", function(){ T.set(48); g.set(30); d.set(3.5); });
    k.button("Suppresseur de tumeur muté", function(){ T.set(48); g.set(10); d.set(1); });
    k.button("Les deux altérations", function(){ T.set(48); g.set(30); d.set(1); });
    k.draw(function(){
      var b = g.value / 100 * Math.LN2 * 24 / T.value, dd = d.value / 100, r = b - dd;
      c.clear(); var ax = S.draw.axes(c, {x0:0, x1:1000, y0:0, y1:12, xl:"jours", yl:"log₁₀ (nombre de cellules)", stepX:200, stepY:3, l:50});
      S.draw.line(c, ax.L, ax.Y(9), ax.R, ax.Y(9), B4.pal.red, 1.5, [5, 4]); B4.txt(c, "10⁹ cellules : tumeur détectable", ax.R - 4, ax.Y(9) - 9, B4.pal.red, 12, "right");
      S.draw.line(c, ax.L, ax.Y(0), ax.R, ax.Y(0), "#b8c0cc", 2, [4, 4]);
      S.draw.fn(c, ax, function(t){ return Math.min(12, r * t / Math.LN10); }, B4.pal.red, 3);
      B4.txt(c, "départ : 1 cellule modifiée", ax.L + 8, ax.Y(0) - 10, "#5f6b7a", 12, "left");
      var tt = r > 0 ? 9 * Math.LN10 / r : Infinity;
      ro.set(0, S.fmt(b * 100, 1) + " % / jour"); ro.set(1, S.fmt(dd * 100, 1) + " % / jour"); ro.set(2, (r >= 0 ? "+" : "") + S.fmt(r * 100, 1) + " % / jour");
      ro.set(3, r <= 0.0005 ? "jamais" : S.fmt(tt, 0) + " jours (≈ " + S.fmt(tt / 365, 1) + " an)");
      if (isFinite(tt) && tt < 1000) S.draw.dot(c, ax.X(tt), ax.Y(9), 7, "#13233a");
      nt.set(r > 0.0005 ? "Naissances (" + S.fmt(b * 100, 1) + " %/jour) > morts (" + S.fmt(dd * 100, 1) + " %/jour) : la population double tous les " + S.fmt(Math.LN2 / r, 0) + " jours. Une cellule modifiée atteint 10⁹ cellules en ≈ " + S.fmt(tt, 0) + " jours, sans symptôme tout ce temps." : r >= -0.0005 ? "Naissances ≈ morts : le tissu reste en équilibre (c'est le cas d'un tissu normal)." : "Les morts dépassent les naissances : la population diminue.", r > 0.0005 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id:"b4-c10-chimio", ch:"c10", tag:"Médecine · modèle",
  titre:"Chimiothérapie : cibler les cellules qui se divisent",
  resume:"Un médicament antimitotique frappe les cellules en division : tumeur, mais aussi moelle, intestin, poils.",
  but:"Règle la dose, l'intervalle entre deux cures et le nombre de cures. Compare l'effet sur la tumeur et sur les tissus sains qui se renouvellent.",
  aRetenir:"Un médicament antimitotique atteint surtout les cellules qui se divisent : cellules cancéreuses, mais aussi cellules saines à renouvellement rapide (moelle osseuse, muqueuse intestinale, follicules pileux), d'où fatigue, nausées, perte de cheveux. Les cellules qui ne se divisent pas (neurones) sont peu touchées. On espace les cures pour laisser les tissus sains se régénérer.",
  piege:"Modèle illustratif en échelles relatives : les valeurs numériques ne sont pas celles d'un traitement réel. Aucune conclusion médicale à en tirer.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.9});
    var dose = k.slider("Dose du médicament", 10, 100, 5, 70, "%");
    var dt = k.slider("Intervalle entre deux cures", 7, 28, 7, 21, "jours");
    var n = k.slider("Nombre de cures", 1, 8, 1, 4, "");
    var ro = k.readouts(["Tumeur à la fin", "Moelle osseuse (minimum)", "Intestin (minimum)", "Follicules pileux (minimum)"]);
    var nt = k.note("", "");
    var TIS = [
      {n:"Tumeur", g:0.8, col:"#b42318", tumor:true},
      {n:"Moelle osseuse", g:0.5, h:0.15, col:"#5B21B6"},
      {n:"Muqueuse intestinale", g:0.4, h:0.12, col:"#B45309"},
      {n:"Follicules pileux", g:0.5, h:0.06, col:"#0e7490"},
      {n:"Neurones", g:0, h:0.1, col:"#8a95a3"}
    ];
    function sim(ti, TM){
      var E = dose.value / (dose.value + 10), a = 1, out = [[0, 1]], tm = 1, next = 0, cnt = 0, h = 0.25;
      for (var t = 0; t <= TM + 1e-9; t += h){
        if (cnt < n.value && t >= next - 1e-9){ a *= 1 - ti.g * E; cnt++; next += dt.value; }
        if (ti.tumor) a *= Math.exp(0.03 * h); else a += ti.h * (1 - a) * h;
        if (Math.abs(t / 2 - Math.round(t / 2)) < 1e-9) out.push([t, a]); tm = Math.min(tm, a);
      }
      return {pts:out, min:tm, end:a};
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, TM = Math.max(140, Math.ceil(((n.value - 1) * dt.value + 70) / 10) * 10), ax = S.draw.axes(c, {x0:0, x1:TM, y0:-2, y1:0.4, xl:"jours", yl:"log₁₀ (taille relative)", stepX:TM > 200 ? 50 : 20, stepY:0.5, l:50});
      S.draw.line(c, ax.L, ax.Y(0), ax.R, ax.Y(0), "#b8c0cc", 1.5, [4, 4]);
      for (var q = 0; q < n.value; q++){ var xt = ax.X(q * dt.value); if (q * dt.value <= TM){ S.draw.line(c, xt, ax.B, xt, ax.B - 12, B4.pal.ink, 3); } }
      var res = TIS.map(function(ti){ var r = sim(ti, TM); ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = ti.col; ctx.lineWidth = ti.tumor ? 3.2 : 2.2; ctx.beginPath(); r.pts.forEach(function(p, i){ var x = ax.X(p[0]), y = ax.Y(Math.log10(Math.max(1e-4, p[1]))); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); ctx.restore(); return r; });
      TIS.forEach(function(ti, i){ B4.txt(c, ti.n, ax.R - 4, ax.B - 10 - (4 - i) * 14, ti.col, 12, "right"); });
      B4.txt(c, "traits noirs : cures", ax.L + 6, ax.B - 22, "#5f6b7a", 11, "left");
      ro.set(0, S.fmt(res[0].end * 100, 0) + " % du départ"); ro.set(1, S.fmt(res[1].min * 100, 0) + " %"); ro.set(2, S.fmt(res[2].min * 100, 0) + " %"); ro.set(3, S.fmt(res[3].min * 100, 0) + " %");
      var msg = "La tumeur (80 % de cellules en cycle) subit l'effet le plus fort ; les neurones, qui ne se divisent pas, ne sont pas touchés. ";
      if (res[1].min < 0.45) msg += "Moelle osseuse très atteinte (" + S.fmt(res[1].min * 100, 0) + " %) : moins de globules blancs, risque d'infection. ";
      if (res[0].end < 0.05) msg += "La tumeur est fortement réduite."; else if (res[0].end > 1) msg += "La tumeur est repartie au-delà de sa taille de départ : traitement insuffisant."; else msg += "La tumeur régresse mais subsiste.";
      nt.set(msg, res[1].min < 0.45 ? "warn" : "");
    });
  }
});
