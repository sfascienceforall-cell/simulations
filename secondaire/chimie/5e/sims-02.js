/* Chapitre 2 · Liaisons covalente, ionique et métallique */
SFA.sim({
  id: "c5-c02-delta-en", ch: "c02", tag: "Classique",
  titre: "ΔEN : quelle liaison entre ces deux atomes ?",
  resume: "Deux atomes au choix : la différence d'électronégativité donne le type de liaison.",
  but: "Choisis deux atomes. Regarde le nuage d'électrons se déplacer vers l'atome le plus électronégatif et lis le type de liaison. Essaie Na–Cl, H–Cl, C–H, Cl–Cl, H–F.",
  aRetenir: "ΔEN < 0,5 : covalente apolaire. 0,5 ≤ ΔEN < 1,7 : covalente polaire (δ⁺ sur l'atome le moins électronégatif, δ⁻ sur l'autre). ΔEN ≥ 1,7 avec un métal : liaison ionique. Deux métaux : liaison métallique.",
  piege: "Les seuils 0,5 et 1,7 sont conventionnels : il n'y a pas deux catégories étanches mais un passage progressif. H–F (ΔEN = 1,8) dépasse 1,7 mais HF est une vraie molécule covalente très polaire, sans ions. Et les valeurs d'électronégativité sont arrondies (échelle de Pauling).",
  build: function(k, S){
    var pal = S.draw.palette, EN = C5.EN;
    var metals = {Li: 1, Be: 1, Na: 1, Mg: 1, Al: 1, K: 1, Ca: 1};
    var names = ["H","Li","Be","B","C","N","O","F","Na","Mg","Al","Si","P","S","Cl","K","Ca","Br","I"];
    var opts = names.map(function(x){ return [x, x + " (" + S.fmt(EN[x], 1) + ")"]; });
    var c = k.canvas(250);
    var a = k.select("Atome A", opts, "Na"), b = k.select("Atome B", opts, "Cl");
    var ro = k.readouts(["EN de A", "EN de B", "ΔEN", "Type de liaison"]);
    var nt = k.note("", "");
    var col = function(x){ return metals[x] ? "#d6dde8" : (EN[x] > 3 ? "#f6c6c6" : "#cfe4d8"); };
    k.draw(function(){
      var A = a.value, B = b.value, eA = EN[A], eB = EN[B], d = Math.round(Math.abs(eA - eB) * 10) / 10;
      var both = metals[A] && metals[B], any = metals[A] || metals[B], type, kind = "";
      if (both) type = "métallique";
      else if (d < 0.5) type = "covalente apolaire";
      else if (d < 1.7) type = "covalente polaire";
      else type = any ? "ionique" : "covalente très polaire";
      c.clear(); var cx = c.W / 2, cy = 110, ctx = c.ctx;
      /* l'atome le plus électronégatif est à droite */
      var left = eA <= eB ? A : B, right = eA <= eB ? B : A, dist = 130, xl = cx - dist / 2, xr = cx + dist / 2;
      if (type === "ionique"){ xl -= 22; xr += 22; }
      var rr = 36;
      C5.atom(c, xl, cy, rr, col(left), left); C5.atom(c, xr, cy, rr, col(right), right);
      if (both){
        for (var i = 0; i < 14; i++){ var px = cx - 70 + (i * 37 % 140), py = cy - 40 + (i * 53 % 80); S.draw.dot(c, px, py, 3, pal.acc); }
        S.draw.text(c, "électrons mis en commun entre tous les atomes", cx, cy + 62, {size: 12, color: pal.grey});
      } else if (type === "ionique"){
        S.draw.text(c, "+", xl + 10, cy - 20, {size: 22, color: pal.red}); S.draw.text(c, "−", xr + 10, cy - 20, {size: 22, color: pal.acc});
        S.draw.arrow(c, xl + rr, cy + 54, xr - rr, cy + 54, pal.acc, 2);
        S.draw.text(c, "électron transféré", cx, cy + 72, {size: 12, color: pal.grey});
      } else {
        var sh = Math.min(1, d / 2.2) * 0.45 * dist;
        ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = pal.acc;
        ctx.beginPath(); ctx.ellipse(cx + sh, cy, dist / 2 + 12, 24, 0, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
        S.draw.dot(c, cx + sh - 6, cy, 3.5, pal.ink); S.draw.dot(c, cx + sh + 6, cy, 3.5, pal.ink);
        if (d >= 0.5){
          S.draw.text(c, "δ⁺", xl, cy - 52, {size: 16, color: pal.red}); S.draw.text(c, "δ⁻", xr, cy - 52, {size: 16, color: pal.acc});
          S.draw.arrow(c, xl, cy + 56, xr, cy + 56, pal.ink, 2); S.draw.text(c, "moment dipolaire", cx, cy + 74, {size: 12, color: pal.grey});
        } else S.draw.text(c, "nuage centré : pas de charges partielles", cx, cy + 62, {size: 12, color: pal.grey});
      }
      /* barre d'échelle */
      var bx0 = 30, bx1 = c.W - 30, by = 205, X = function(v){ return bx0 + v / 3.3 * (bx1 - bx0); };
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(X(0), by, X(0.5) - X(0), 12); ctx.fillStyle = "#cfe4d8"; ctx.fillRect(X(0.5), by, X(1.7) - X(0.5), 12); ctx.fillStyle = "#f6d9a8"; ctx.fillRect(X(1.7), by, X(3.3) - X(1.7), 12);
      S.draw.text(c, "apolaire", (X(0) + X(0.5)) / 2 + 14, by + 28, {size: 12, color: pal.grey}); S.draw.text(c, "polaire", (X(0.5) + X(1.7)) / 2, by + 28, {size: 12, color: pal.grey}); S.draw.text(c, "ionique", (X(1.7) + X(3.3)) / 2, by + 28, {size: 12, color: pal.grey});
      S.draw.dot(c, X(d), by + 6, 8, pal.red); S.draw.text(c, "ΔEN = " + S.fmt(d, 1), Math.min(bx1 - 40, Math.max(bx0 + 40, X(d))), by - 12, {size: 12, color: pal.red});
      ro.set(0, S.fmt(eA, 1)); ro.set(1, S.fmt(eB, 1)); ro.set(2, S.fmt(d, 1)); ro.set(3, type);
      if ((A === "H" && B === "F") || (A === "F" && B === "H")) nt.set("ΔEN = 1,8 ≥ 1,7, mais ce sont deux non-métaux : HF est une molécule covalente très polaire, pas un cristal d'ions.", "warn");
      else if (type === "métallique") nt.set("Deux métaux : les électrons de valence sont délocalisés dans tout le solide.", "");
      else if (type === "ionique") nt.set("Le métal cède son électron, le non-métal le capte : cation + anion, attirés par la force électrique.", "");
      else if (A === B) nt.set("Deux atomes identiques : ΔEN = 0, les électrons sont partagés également (ex. Cl₂, H₂).", "ok");
      else nt.set(type === "covalente apolaire" ? "ΔEN petit : le nuage reste quasi centré." : "Le nuage est attiré vers l'atome le plus électronégatif : charges partielles δ⁺ et δ⁻.", "");
    });
  }
});

SFA.sim({
  id: "c5-c02-energie-liaison", ch: "c02", tag: "Graphe",
  titre: "L'énergie d'une liaison en fonction de la distance",
  resume: "Courbe d'énergie de deux atomes qui se rapprochent : minimum, longueur et énergie de liaison.",
  but: "Déplace la distance entre les deux atomes (curseur ou en glissant sur le graphe). Trouve le minimum d'énergie, puis compare les liaisons simple, double et triple entre carbones.",
  aRetenir: "Il existe une distance où l'énergie est minimale : c'est la longueur de liaison. La profondeur du creux est l'énergie de liaison : c'est l'énergie à FOURNIR pour séparer les atomes. Plus la liaison est multiple, plus elle est courte et plus elle est forte.",
  piege: "Casser une liaison COÛTE de l'énergie (elle ne s'en libère pas) ; c'est la formation d'une liaison qui en libère. L'énergie de liaison n'est pas l'enthalpie d'une réaction. La courbe est un modèle simplifié (type Morse) ; les valeurs de D et r₀ sont des moyennes arrondies.",
  build: function(k, S){
    var pal = S.draw.palette;
    var B = {
      HH: {n: "H–H", r0: 74, D: 436}, ClCl: {n: "Cl–Cl", r0: 199, D: 243}, HCl: {n: "H–Cl", r0: 127, D: 431}, O2: {n: "O=O", r0: 121, D: 498},
      N2: {n: "N≡N", r0: 110, D: 945}, CC: {n: "C–C", r0: 154, D: 348}, CdC: {n: "C=C", r0: 134, D: 614}, CtC: {n: "C≡C", r0: 120, D: 839}
    };
    var c = k.canvas(300), at = k.canvas(70);
    var sel = k.select("Liaison", Object.keys(B).map(function(x){ return [x, B[x].n]; }), "HH");
    var r = k.slider("Distance entre les noyaux r", 30, 400, 1, 200, "pm");
    var cmp = k.toggle("Comparer C–C, C=C et C≡C", false);
    var ro = k.readouts(["Énergie E(r)", "Longueur de liaison", "Énergie de liaison", "Situation"]);
    var nt = k.note("", "");
    var A = 0.02;   /* pm⁻¹ : même paramètre pour toutes les liaisons (modèle simplifié) */
    function E(b, x){ var u = 1 - Math.exp(-A * (x - b.r0)); return b.D * (u * u - 1); }
    var ax0 = null;
    c.pointer(function(type, p){ if ((type === "down" || type === "drag") && ax0){ var v = Math.max(30, Math.min(400, ax0.ix(p.x))); r.set(Math.round(v)); k.redraw(); } });
    k.draw(function(){
      var b = B[sel.value], x = r.value, e = E(b, x); c.clear(); at.clear();
      var ref = cmp.value ? B.CtC : b;
      ax0 = S.draw.axes(c, {x0: 0, x1: 400, y0: -ref.D * 1.2, y1: ref.D * 0.7, xl: "r (pm)", yl: "E (kJ/mol)", stepX: 50, l: 56});
      if (cmp.value){
        [[B.CC, pal.green], [B.CdC, pal.amber], [B.CtC, pal.red]].forEach(function(q){ S.draw.fn(c, ax0, function(t){ return E(q[0], t); }, q[1], 2.4);
          S.draw.text(c, q[0].n, ax0.X(q[0].r0), ax0.Y(-q[0].D) + 14, {size: 12, color: q[1]}); });
      } else {
        S.draw.fn(c, ax0, function(t){ return E(b, t); }, pal.acc, 2.8);
        S.draw.line(c, ax0.X(0), ax0.Y(-b.D), ax0.X(400), ax0.Y(-b.D), pal.light, 1.5, [5, 4]);
        S.draw.line(c, ax0.X(b.r0), ax0.Y(0), ax0.X(b.r0), ax0.Y(-b.D), pal.green, 1.5, [5, 4]);
        S.draw.text(c, "r₀ = " + b.r0 + " pm", ax0.X(b.r0) + 6, ax0.Y(b.D * 0.25), {size: 12, color: pal.green, align: "left"});
        S.draw.text(c, "−D = " + S.fmt(-b.D, 0), ax0.X(400) - 4, ax0.Y(-b.D) - 9, {size: 12, color: pal.grey, align: "right"});
        S.draw.dot(c, ax0.X(x), ax0.Y(Math.max(ax0.y0, Math.min(ax0.y1, e))), 7, pal.red);
      }
      /* atomes */
      var cx = at.W / 2, sc = Math.min(0.6, (at.W - 60) / 420), rad = 16;
      var off = x * sc / 2;
      C5.atom(at, cx - off, 35, rad, "#cfe4d8", ""); C5.atom(at, cx + off, 35, rad, "#cfe4d8", "");
      S.draw.text(at, "r = " + x + " pm", cx, 62, {size: 12, color: pal.grey});
      var rel = x < b.r0 - 3 ? "répulsion dominante" : x > b.r0 + 3 ? "attraction dominante" : "équilibre (minimum)";
      ro.set(0, cmp.value ? "—" : S.fmt(e, 0) + " kJ/mol"); ro.set(1, b.r0 + " pm"); ro.set(2, b.D + " kJ/mol"); ro.set(3, rel);
      nt.set(x > 380 ? "Les atomes sont presque séparés : E tend vers 0." : x < b.r0 - 3 ? "Trop proches : les noyaux se repoussent, l'énergie remonte brutalement." : Math.abs(x - b.r0) <= 3 ? "Minimum d'énergie : c'est la longueur de liaison. Pour séparer les atomes il faut fournir " + b.D + " kJ/mol." : "Plus loin que r₀ : les atomes s'attirent et se rapprochent spontanément.", Math.abs(x - b.r0) <= 3 ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "c5-c02-octet", ch: "c02", tag: "Niche utile",
  titre: "Quand l'octet ne tient plus : XFₙ",
  resume: "Un atome central, n atomes de fluor : l'octet est-il respecté, incomplet ou dépassé ?",
  but: "Choisis l'atome central X et le nombre de liaisons n avec le fluor. Compte les électrons autour de X (liaisons + doublets non liants) et lis le verdict. Essaie BF₃, CF₄, SF₆, PF₅.",
  aRetenir: "Chaque liaison F–X apporte 1 électron de X. Reste (v − n) électrons, soit (v − n)/2 doublets non liants. Électrons autour de X = 2n + (v − n) = n + v. Au-delà de la période 2, l'octet peut être dépassé (SF₆ : 12 électrons) ; en période 2, il ne peut pas l'être.",
  piege: "La règle de l'octet est un guide, pas une loi : BF₃ (6 électrons) et BeF₂ (4) sont incomplets ; PF₅ et SF₆ dépassent l'octet. Mais jamais plus de 8 électrons pour C, N, O, F : il n'y a pas de sous-couche d dans la période 2. Les F gardent, eux, leur octet.",
  build: function(k, S){
    var pal = S.draw.palette;
    var X = {Be: {v: 2, p: 2}, B: {v: 3, p: 2}, C: {v: 4, p: 2}, N: {v: 5, p: 2}, O: {v: 6, p: 2}, P: {v: 5, p: 3}, S: {v: 6, p: 3}};
    var c = k.canvas(300);
    var x = k.select("Atome central X", Object.keys(X).map(function(q){ return [q, q + " (" + X[q].v + " e⁻ de valence)"]; }), "S");
    var n = k.slider("Nombre de liaisons X–F", 1, 6, 1, 6, "");
    var ro = k.readouts(["Doublets non liants", "Électrons autour de X", "Verdict"]);
    var nt = k.note("", "");
    k.draw(function(){
      var xa = x.value, v = X[xa].v, per = X[xa].p, nn = n.value; c.clear();
      var rest = v - nn, e = nn + v, cx = c.W / 2, cy = c.H / 2, R = Math.min(105, c.H / 2 - 40);
      var invalid = rest < 0, radical = !invalid && rest % 2 !== 0, lp = invalid ? 0 : Math.floor(rest / 2);
      var verdict, kind;
      if (invalid){ verdict = "impossible"; kind = "warn"; }
      else if (per === 2 && e > 8){ verdict = "impossible (période 2)"; kind = "warn"; }
      else if (radical){ verdict = "radical (électron seul)"; kind = "warn"; }
      else if (e < 8){ verdict = "octet incomplet"; kind = "warn"; }
      else if (e === 8){ verdict = "octet respecté"; kind = "ok"; }
      else { verdict = "octet dépassé"; kind = "warn"; }
      if (invalid){
        S.draw.text(c, xa + "F" + C5.sub(nn), cx, cy, {size: 30, math: true});
        ro.set(0, "—"); ro.set(1, "—"); ro.set(2, verdict);
        nt.set("X n'a que " + v + " électron(s) de valence à partager : il ne peut pas former " + nn + " liaisons simples (n ≤ v).", "warn"); return;
      }
      /* ligands répartis sur le cercle, doublets non liants sur le reste */
      var slots = nn + lp + (radical ? 1 : 0), ang = [], i;
      for (i = 0; i < nn; i++) ang.push(-Math.PI / 2 + 2 * Math.PI * i / Math.max(nn, 1));
      for (i = 0; i < nn; i++){
        var ax = cx + R * Math.cos(ang[i]), ay = cy + R * Math.sin(ang[i]);
        S.draw.line(c, cx, cy, ax, ay, pal.ink, 3);
        C5.atom(c, ax, ay, 15, "#f6d9a8", "F");
      }
      C5.atom(c, cx, cy, 23, "#cfe4d8", xa);
      /* doublets non liants : placés entre les liaisons, près de X */
      var gap = nn >= 1 ? 2 * Math.PI / Math.max(nn, 1) : 0;
      for (i = 0; i < lp; i++){
        var a2 = nn === 1 ? Math.PI / 2 + i * 0.9 - (lp - 1) * 0.45 : ang[i % nn] + gap / 2;
        var rx = cx + 34 * Math.cos(a2), ry = cy + 34 * Math.sin(a2), pxv = -Math.sin(a2) * 5, pyv = Math.cos(a2) * 5;
        S.draw.dot(c, rx + pxv, ry + pyv, 3.5, pal.red); S.draw.dot(c, rx - pxv, ry - pyv, 3.5, pal.red);
      }
      if (radical) S.draw.dot(c, cx, cy + 40, 3.5, pal.red);
      S.draw.text(c, e + " e⁻ autour de " + xa, c.W - 8, 14, {size: 13, align: "right", color: kind === "ok" ? pal.green : pal.amber});
      S.draw.text(c, xa + "F" + C5.sub(nn), 8, 14, {size: 15, align: "left", math: true});
      ro.set(0, radical ? lp + " + 1 électron seul" : lp); ro.set(1, e); ro.set(2, verdict);
      var msg;
      if (per === 2 && e > 8) msg = "Période 2 : il n'y a que 4 orbitales (2s et 2p), donc 8 électrons au maximum autour de " + xa + ".";
      else if (radical) msg = "Nombre impair d'électrons de valence restants : un électron reste seul (espèce très réactive, un radical).";
      else if (e < 8) msg = xa + " a " + e + " électrons seulement : octet incomplet, " + (xa === "B" ? "typique du bore (BF₃ réagit avidement avec les doublets d'autres molécules)." : xa === "Be" ? "typique du béryllium." : "peu stable.");
      else if (e === 8) msg = "Les " + e + " électrons autour de " + xa + " forment un octet.";
      else msg = "Période 3 : la couche n = 3 possède aussi des orbitales 3d vides ; l'octet peut être dépassé (" + e + " électrons).";
      nt.set(msg, kind);
    });
  }
});

SFA.sim({
  id: "c5-c02-couches", ch: "c02", tag: "Animation",
  titre: "Décaler une couche d'atomes : métal ou cristal ionique ?",
  resume: "On glisse une moitié du cristal sur l'autre : le métal se déforme, le sel se brise. Et le courant ?",
  but: "Glisse la rangée du haut et observe la force entre les couches. Compare métal et cristal ionique, puis branche la pile pour voir si un courant circule.",
  aRetenir: "Métal : les électrons délocalisés « collent » les cations quelle que soit leur position → malléable, ductile, bon conducteur. Cristal ionique : un glissement d'un cran met face à face des ions de même signe → répulsion → fragile ; solide, il ne conduit pas (ions bloqués).",
  piege: "Un cristal ionique n'est pas conducteur à l'état solide : les ions existent, mais ils ne bougent pas. Il conduit fondu ou dissous. Le modèle de cohésion de la simulation (cos de s·π) est qualitatif.",
  build: function(k, S){
    var pal = S.draw.palette;
    var c = k.canvas(270);
    var kind = k.seg("Solide", [["met", "Métal (cuivre)"], ["ion", "Cristal ionique (NaCl)"]], "met");
    var s = k.slider("Glissement de la rangée du haut", 0, 2, 0.05, 0, "ion");
    var pile = k.toggle("Brancher une pile", false);
    var ro = k.readouts(["Force entre les couches", "Courant"]);
    var nt = k.note("", "");
    var els = []; for (var i = 0; i < 16; i++) els.push({x: Math.random(), y: Math.random(), vx: Math.random() - 0.5, vy: Math.random() - 0.5});
    var cols = 7, rows = 4, t0 = 0;
    var lp = k.loop(function(dt){
      els.forEach(function(e){ e.vx += (Math.random() - 0.5) * 0.6 * dt * 8; e.vy += (Math.random() - 0.5) * 0.6 * dt * 8;
        var sp = Math.hypot(e.vx, e.vy); if (sp > 0.5){ e.vx *= 0.5 / sp; e.vy *= 0.5 / sp; }
        e.x += (e.vx + (pile.value && kind.value === "met" ? 0.6 : 0)) * dt * 0.5; e.y += e.vy * dt * 0.5;
        if (e.x > 1) e.x -= 1; if (e.x < 0) e.x += 1; if (e.y < 0 || e.y > 1){ e.vy *= -1; e.y = Math.max(0, Math.min(1, e.y)); } });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      c.clear();
      var a = Math.min(46, (c.W - 90) / (cols + 1)), gx = (c.W - a * (cols - 1)) / 2 - a * 0.5, gy = 70, ion = kind.value === "ion", sh = s.value * a;
      var bx0 = gx - a * 0.6, bw = a * (cols + 0.2);
      for (var r = 0; r < rows; r++){
        for (var q = 0; q < cols; q++){
          var top = r < 2, x = gx + q * a + (top ? sh : 0), y = gy + r * a, sign = ((q + r) % 2 === 0) ? 1 : -1;
          if (!top) {}
          if (ion) C5.atom(c, x, y, a * 0.34, sign > 0 ? "#f6c6c6" : "#c6d6f6", sign > 0 ? "+" : "−");
          else C5.atom(c, x, y, a * 0.3, "#f6c6c6", "+");
        }
      }
      if (!ion){
        c.ctx.save(); c.ctx.beginPath(); c.ctx.rect(gx - a * 0.7, gy - a * 0.7, a * (cols + 0.6), a * (rows + 0.2)); c.ctx.clip();
        els.forEach(function(e){ S.draw.dot(c, gx - a * 0.7 + e.x * a * (cols + 0.6), gy - a * 0.7 + e.y * a * (rows + 0.2), 3.2, pal.acc); });
        c.ctx.restore();
      }
      S.draw.line(c, gx - a * 0.7, gy + a * 1.5, c.W - 10, gy + a * 1.5, pal.grey, 1, [4, 4]);
      S.draw.text(c, "plan de glissement", c.W - 8, gy + a * 1.5 + 12, {size: 12, align: "right", color: pal.grey});
      /* pile */
      if (pile.value){
        S.draw.text(c, "pile branchée → courant " + (ion ? "nul" : "d'électrons vers la droite"), 10, c.H - 14, {size: 13, align: "left", color: ion ? pal.red : pal.green});
        if (!ion) S.draw.arrow(c, c.W - 120, c.H - 16, c.W - 30, c.H - 16, pal.acc, 2.4);
      }
      var coh = ion ? Math.cos(Math.PI * s.value) : 1;
      var bar = c.W - 40; c.ctx.fillStyle = "#e3e7ed"; c.ctx.fillRect(20, 28, bar, 10); c.ctx.fillStyle = coh >= 0 ? pal.green : pal.red;
      c.ctx.fillRect(20 + bar / 2, 28, coh * bar / 2, 10);
      S.draw.text(c, "répulsion", 20, 18, {size: 12, align: "left", color: pal.grey}); S.draw.text(c, "attraction", c.W - 20, 18, {size: 12, align: "right", color: pal.grey});
      var fs = coh > 0.6 ? "forte attraction" : coh > 0 ? "attraction faible" : coh > -0.6 ? "répulsion" : "forte répulsion";
      ro.set(0, ion ? fs : "attraction constante"); ro.set(1, pile.value ? (ion ? "aucun (ions bloqués)" : "oui (électrons libres)") : "—");
      if (ion && coh < 0) nt.set("Des ions de même signe se font face : le cristal éclate (clivage). C'est pour ça qu'un sel est dur mais cassant.", "warn");
      else if (ion && s.value === 0) nt.set("Chaque ion est entouré d'ions de signe contraire : attraction maximale.", "ok");
      else if (ion) nt.set("Glissement partiel : l'attraction diminue, le cristal se contraint.", "warn");
      else nt.set("Les cations glissent les uns sur les autres : le nuage d'électrons suit et garde la cohésion. Le métal se déforme sans se casser.", "ok");
    });
  }
});
