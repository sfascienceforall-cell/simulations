/* Chapitre 4 · Eau, polarité, liaison hydrogène et solubilité */
C5.water = function(c, x, y, phi, sc){   /* phi : direction O → milieu des H (côté δ+) */
  var S = window.SFA, k = sc || 1;
  var h1 = [x + 11 * k * Math.cos(phi + 0.9), y + 11 * k * Math.sin(phi + 0.9)], h2 = [x + 11 * k * Math.cos(phi - 0.9), y + 11 * k * Math.sin(phi - 0.9)];
  S.draw.line(c, x, y, h1[0], h1[1], "#8a95a3", 1.5); S.draw.line(c, x, y, h2[0], h2[1], "#8a95a3", 1.5);
  C5.atom(c, h1[0], h1[1], 3.8 * k, "#ffffff"); C5.atom(c, h2[0], h2[1], 3.8 * k, "#ffffff");
  C5.atom(c, x, y, 6 * k, "#f19a9a");
  return [h1, h2];
};
C5.rng = function(seed){ var s = seed; return function(){ s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };

SFA.sim({
  id: "c5-c04-dissolution", ch: "c04", tag: "Niveau moléculaire",
  titre: "Dissolution à l'échelle des molécules",
  resume: "NaCl, glucose, huile dans l'eau : qui se dissout, et qui entoure qui ?",
  but: "Choisis un soluté et fais avancer le curseur « temps ». Regarde comment les molécules d'eau s'orientent autour des ions (δ⁻ vers Na⁺, δ⁺ vers Cl⁻) ou accrochent le glucose. Puis essaie l'huile.",
  aRetenir: "L'eau est polaire (O : δ⁻, H : δ⁺). Elle entoure les ions (interaction ion–dipôle) et fait des liaisons hydrogène avec les molécules polaires comme le glucose : c'est la solvatation (hydratation). L'huile, apolaire, ne peut pas s'y accrocher : « qui se ressemble s'assemble ».",
  piege: "Dissoudre n'est pas faire disparaître : les ions Na⁺ et Cl⁻ existent toujours, séparés et entourés d'eau. Et l'huile ne flotte pas parce qu'elle serait « plus légère » : elle ne se mélange pas parce que les molécules d'eau préfèrent rester liées entre elles. (Schéma simplifié : pas à l'échelle, peu de molécules.)",
  build: function(k, S){
    var pal = S.draw.palette;
    var c = k.canvas(310);
    var sol = k.seg("Soluté", [["nacl", "Sel NaCl (ionique)"], ["glu", "Glucose (polaire)"], ["huile", "Huile (apolaire)"]], "nacl");
    var p = k.slider("Avancement de la dissolution", 0, 100, 1, 40, "%");
    var ro = k.readouts(["Particules dissoutes", "Interaction avec l'eau"]);
    var nt = k.note("", "");
    var r = C5.rng(7), N = 12, tx = [], ty = [], wx = [], wy = [], wp = [], i;
    for (i = 0; i < N; i++){ tx.push(0.36 + r() * 0.6); ty.push(0.1 + r() * 0.8); }
    for (i = 0; i < 26; i++){ wx.push(r()); wy.push(r()); wp.push(r() * 6.28); }
    var tm = 0, lp = k.loop(function(dt, t){ tm = t; k.redraw(); }); lp.play();
    k.draw(function(){
      var W = c.W, H = c.H, ctx = c.ctx, kind = sol.value, prog = p.value / 100; c.clear();
      ctx.fillStyle = "#e8f2fb"; ctx.fillRect(8, 24, W - 16, H - 34); ctx.strokeStyle = pal.grey; ctx.strokeRect(8, 24, W - 16, H - 34);
      S.draw.text(c, "eau (les « H₂O » flottent et tournent)", 14, 12, {size: 12, align: "left", color: pal.grey});
      var cx0 = 52, cy0 = H / 2 - 20, sp = 22, cols = 3, rows = 4, ranks = [], ions = [], j;
      var regX = function(f){ return 20 + f * (W - 40); }, regY = function(f){ return 40 + f * (H - 80); };
      var dissolved = 0, hb = 0;
      if (kind === "nacl"){
        for (j = 0; j < N; j++){ var qx = j % cols, qy = Math.floor(j / cols); ions.push({x: cx0 + qx * sp, y: cy0 + qy * sp, q: ((qx + qy) % 2 ? -1 : 1), rank: Math.hypot(qx - 1, qy - 1.5)}); }
        var order = ions.map(function(o, ix){ return ix; }).sort(function(a, b){ return ions[b].rank - ions[a].rank; });
        order.forEach(function(ix, pos){ ions[ix].pos = pos; });
        ions.forEach(function(o, ix){
          var t = Math.max(0, Math.min(1, prog * (N + 1) - o.pos)), tgx = regX(0.3 + tx[ix] * 0.7), tgy = regY(ty[ix]);
          var x = o.x + (tgx - o.x) * t, y = o.y + (tgy - o.y) * t + Math.sin(tm * 1.3 + ix) * 2 * t;
          o.t = t; o.dx = x; o.dy = y; if (t >= 1) dissolved++;
        });
        ions.forEach(function(o){
          if (o.t >= 1){   /* cortège d'eau : 4 molécules */
            for (var a = 0; a < 4; a++){
              var ang = a * Math.PI / 2 + 0.6 + Math.sin(tm + a) * 0.15, wx2 = o.dx + 24 * Math.cos(ang), wy2 = o.dy + 24 * Math.sin(ang);
              C5.water(c, wx2, wy2, o.q > 0 ? ang : ang + Math.PI, 0.9);
            }
          }
        });
        ions.forEach(function(o){ C5.atom(c, o.dx, o.dy, 9, o.q > 0 ? "#f6c6c6" : "#c6d6f6", o.q > 0 ? "+" : "−"); });
        S.draw.text(c, "+ Na⁺    − Cl⁻", W - 12, H - 20, {size: 12, align: "right", color: pal.grey});
        ro.set(0, dissolved + " ions sur " + N); ro.set(1, "ion–dipôle (hydratation)");
        nt.set(prog < 0.02 ? "Cristal intact. Avance le curseur : l'eau arrache les ions de la surface." : prog >= 1 ? "Tous les ions sont séparés et entourés d'eau : la solution conduit le courant." : "Les O (δ⁻) se tournent vers Na⁺, les H (δ⁺) vers Cl⁻.", "");
      } else if (kind === "glu"){
        var mols = [];
        for (j = 0; j < 6; j++){ var gx = cx0 + (j % 2) * 28, gy = cy0 + Math.floor(j / 2) * 26; mols.push({x: gx, y: gy, pos: 5 - j}); }
        mols.forEach(function(o, ix){ var t = Math.max(0, Math.min(1, prog * 7 - o.pos)), tgx = regX(0.3 + tx[ix] * 0.7), tgy = regY(ty[ix]); o.dx = o.x + (tgx - o.x) * t; o.dy = o.y + (tgy - o.y) * t + Math.sin(tm * 1.1 + ix) * 2 * t; o.t = t; if (t >= 1) dissolved++; });
        mols.forEach(function(o){
          if (o.t >= 1){ for (var a = 0; a < 3; a++){ var ang = a * 2.1 + 0.4, X = o.dx + 28 * Math.cos(ang), Y = o.dy + 28 * Math.sin(ang), hs = C5.water(c, X, Y, ang + Math.PI, 0.9);
            S.draw.line(c, o.dx + 12 * Math.cos(ang), o.dy + 12 * Math.sin(ang), hs[0][0], hs[0][1], pal.acc, 1.5, [2, 3]); hb++; } }
        });
        mols.forEach(function(o){ ctx.fillStyle = "#f6d9a8"; ctx.strokeStyle = pal.amber; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(o.dx, o.dy, 13, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); S.draw.text(c, "OH", o.dx, o.dy, {size: 12}); });
        S.draw.text(c, "··· liaison hydrogène", W - 12, H - 20, {size: 12, align: "right", color: pal.acc});
        ro.set(0, dissolved + " molécules sur 6"); ro.set(1, "liaisons hydrogène avec les groupes –OH (" + hb + " tracées)");
        nt.set("Le glucose est neutre mais porte des groupes –OH polaires : l'eau s'y accroche par liaisons hydrogène. Il se dissout sans former d'ions : la solution ne conduit pas le courant.", "");
      } else {
        for (j = 0; j < 8; j++){ var ox = cx0 + (j % 4) * 26 - 6 + Math.sin(tm + j) * 1.5, oy = cy0 + 20 + Math.floor(j / 4) * 20; ctx.fillStyle = "#f4e08c"; ctx.strokeStyle = pal.amber; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(ox, oy, 12, 6, -0.3, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); }
        S.draw.text(c, "gouttelette d'huile (reste groupée)", cx0 + 36, cy0 + 56, {size: 12, color: pal.amber});
        ro.set(0, "0 % : aucune"); ro.set(1, "aucune : pas de liaison possible avec l'eau");
        nt.set("Les molécules d'huile (apolaires) n'ont ni δ⁺ ni δ⁻ à offrir. Pour les insérer, l'eau devrait rompre ses propres liaisons hydrogène sans rien gagner : elle les garde. L'avancement du curseur ne change rien.", "warn");
      }
      /* eau libre (au-delà de l'hydratation) */
      for (i = 0; i < wx.length; i++){
        var wxp = 20 + wx[i] * (W - 40), wyp = 36 + wy[i] * (H - 76);
        if (kind !== "huile" && wxp < 110 && wyp > cy0 - 30 && wyp < cy0 + 100) continue;
        if (kind === "huile" && wxp < 140 && wyp > cy0 - 10 && wyp < cy0 + 70) continue;
        C5.water(c, wxp + Math.sin(tm + wp[i]) * 3, wyp + Math.cos(tm * 0.8 + wp[i]) * 3, wp[i] + tm * 0.4, 0.8);
      }
    });
  }
});

SFA.sim({
  id: "c5-c04-ebullition", ch: "c04", tag: "Graphe",
  titre: "Les températures d'ébullition qui trahissent la liaison H",
  resume: "Hydrures des colonnes 14 à 17 : H₂O, HF et NH₃ sont anormalement élevés.",
  but: "Choisis une famille, lis les températures d'ébullition de la période 5 à la période 2, puis affiche la tendance attendue sans liaison hydrogène. Mesure l'écart pour l'eau.",
  aRetenir: "Dans une famille, la température d'ébullition augmente avec la masse molaire (forces de van der Waals plus fortes). Quand on arrive à H₂O, HF et NH₃, le point d'ébullition est BEAUCOUP plus haut que prévu : les liaisons hydrogène entre molécules sont à surmonter pour les séparer.",
  piege: "La liaison hydrogène est une interaction entre molécules, bien plus faible qu'une liaison covalente O–H : on ne la rompt pas quand l'eau bout (les molécules H₂O restent intactes). L'extrapolation est linéaire sur trois points : c'est un repère, pas une loi. Masses molaires arrondies.",
  build: function(k, S){
    var pal = S.draw.palette;
    var G = {
      "14": {n: "CH₄, SiH₄, GeH₄, SnH₄", m: ["CH₄", "SiH₄", "GeH₄", "SnH₄"], M: [16, 32, 77, 123], t: [-162, -112, -88, -52], col: pal.green},
      "15": {n: "NH₃, PH₃, AsH₃, SbH₃", m: ["NH₃", "PH₃", "AsH₃", "SbH₃"], M: [17, 34, 78, 125], t: [-33, -88, -62, -17], col: pal.violet},
      "16": {n: "H₂O, H₂S, H₂Se, H₂Te", m: ["H₂O", "H₂S", "H₂Se", "H₂Te"], M: [18, 34, 81, 130], t: [100, -60, -41, -2], col: pal.acc},
      "17": {n: "HF, HCl, HBr, HI", m: ["HF", "HCl", "HBr", "HI"], M: [20, 36.5, 81, 128], t: [20, -85, -67, -35], col: pal.red}
    };
    var c = k.canvas(300);
    var fam = k.seg("Famille (colonne)", [["14", "14"], ["15", "15"], ["16", "16"], ["17", "17"]], "16");
    var per = k.slider("Période observée", 2, 5, 1, 2, "");
    var ext = k.toggle("Montrer la tendance attendue sans liaison H", true), all = k.toggle("Superposer les 4 familles", false);
    var ro = k.readouts(["Composé", "Masse molaire", "T d'ébullition réelle", "Tendance attendue", "Écart"]);
    var nt = k.note("", "");
    function fit(g){   /* droite par moindres carrés sur les périodes 3, 4, 5 */
      var xs = [3, 4, 5], ys = [g.t[1], g.t[2], g.t[3]], mx = 4, my = (ys[0] + ys[1] + ys[2]) / 3, num = 0, den = 0;
      for (var i = 0; i < 3; i++){ num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) * (xs[i] - mx); }
      var a = num / den; return {a: a, b: my - a * mx};
    }
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0: 1.5, x1: 5.5, y0: -180, y1: 120, stepX: 100, stepY: 40, l: 54, t: 22, b: 30});
      for (var pp = 2; pp <= 5; pp++) S.draw.text(c, "période " + pp, ax.X(pp), c.H - 12, {size: 12, color: pal.grey});
      S.draw.text(c, "T d'ébullition (°C)", 6, 10, {size: 12, align: "left", color: pal.ink});
      var keys = all.value ? ["14", "15", "16", "17"] : [fam.value];
      keys.forEach(function(q){
        var g = G[q], pts = [];
        for (var i = 0; i < 4; i++) pts.push([ax.X(i + 2), ax.Y(g.t[i])]);
        for (i = 0; i < 3; i++) S.draw.line(c, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], g.col, 2.2);
        if (ext.value){ var f = fit(g); S.draw.line(c, ax.X(2), ax.Y(f.a * 2 + f.b), ax.X(5), ax.Y(f.a * 5 + f.b), g.col, 1.6, [6, 5]); S.draw.dot(c, ax.X(2), ax.Y(f.a * 2 + f.b), 5, "#ffffff"); c.ctx.strokeStyle = g.col; c.ctx.beginPath(); c.ctx.arc(ax.X(2), ax.Y(f.a * 2 + f.b), 5, 0, 6.3); c.ctx.stroke(); }
        for (i = 0; i < 4; i++){ S.draw.dot(c, pts[i][0], pts[i][1], 5.5, g.col); if (!all.value) S.draw.text(c, g.m[i], pts[i][0] + (i === 0 ? 10 : 0), pts[i][1] + (i === 0 ? 0 : -14), {size: 12, color: g.col, align: i === 0 ? "left" : "center"}); }
        if (all.value){ S.draw.text(c, "col. " + q, pts[1][0] + 4, pts[1][1] + (q === "14" ? 14 : -12), {size: 12, color: g.col}); }
      });
      var g2 = G[fam.value], pi = per.value - 2, f2 = fit(g2);
      S.draw.line(c, ax.X(per.value), ax.T, ax.X(per.value), ax.B, pal.light, 1.5, [3, 3]);
      var pred = f2.a * per.value + f2.b, real = g2.t[pi];
      ro.set(0, g2.m[pi] + " (période " + per.value + ")"); ro.set(1, S.fmt(g2.M[pi], 1) + " g/mol"); ro.set(2, S.fmt(real, 0) + " °C"); ro.set(3, S.fmt(pred, 0) + " °C");
      ro.set(4, S.fmt(real - pred, 0) + " °C");
      var anom = per.value === 2 && real - pred > 60;
      nt.set(anom ? g2.m[0] + " bout " + S.fmt(real - pred, 0) + " °C plus haut que la tendance : liaisons hydrogène entre molécules." : (per.value === 2 && fam.value === "14") ? "CH₄ suit la tendance (écart faible) : pas de liaison hydrogène, car C n'est pas assez électronégatif." : "Sur les périodes 3 à 5 la tendance est régulière (plus de masse → plus de forces de van der Waals).", anom ? "warn" : "");
    });
  }
});

SFA.sim({
  id: "c5-c04-miscibilite", ch: "c04", tag: "Expérience virtuelle",
  titre: "Miscible ou non ? Le tube à essais",
  resume: "Deux liquides, un tube : ils se mélangent ou ils se séparent, et le plus dense est dessous.",
  but: "Choisis deux liquides et la proportion de B, puis appuie sur « Agiter ». Observe si le mélange devient homogène, ou quelle couche est dessus. Essaie eau + huile, eau + éthanol, huile + cyclohexane.",
  aRetenir: "Qui se ressemble s'assemble : deux liquides polaires se mélangent (eau, éthanol, glycérol), deux liquides apolaires aussi (huile, cyclohexane) ; un polaire et un apolaire non. Quand ils ne se mélangent pas, le plus DENSE se place au fond.",
  piege: "La couche du dessus n'est pas toujours l'huile : le glycérol (1,26 g/cm³) tombe au fond sous l'eau et le cyclohexane (0,78) flotte sur tout. L'éthanol a une partie apolaire (–C₂H₅) : sa miscibilité avec l'huile ou le cyclohexane n'est que partielle et dépend de la température (simplification ici).",
  build: function(k, S){
    var pal = S.draw.palette;
    var L = {
      eau: {n: "Eau", pol: 1, rho: 1.00, col: [120, 170, 235]}, glyc: {n: "Glycérol", pol: 1, rho: 1.26, col: [120, 205, 150]},
      eth: {n: "Éthanol", pol: 1, rho: 0.79, col: [200, 160, 235]}, huile: {n: "Huile végétale", pol: 0, rho: 0.92, col: [240, 205, 70]}, cyc: {n: "Cyclohexane", pol: 0, rho: 0.78, col: [240, 150, 110]}
    };
    var opts = Object.keys(L).map(function(x){ return [x, L[x].n]; });
    var c = k.canvas(290);
    var A = k.select("Liquide A", opts, "eau"), B = k.select("Liquide B", opts, "huile");
    var vb = k.slider("Part de B dans le mélange", 10, 90, 10, 40, "%");
    var shaken = false, tm = 0, shakeT = 99;
    k.button("Agiter", function(){ shaken = true; shakeT = 0; }, true);
    k.button("Remettre à zéro", function(){ shaken = false; shakeT = 99; });
    var ro = k.readouts(["Nature de A", "Nature de B", "Résultat", "Couche du haut"]);
    var nt = k.note("", "");
    function result(a, b){
      if (a === b) return "même liquide";
      var A1 = L[a], B1 = L[b];
      if (A1.pol === B1.pol) return "miscibles";
      if (a === "eth" || b === "eth") return "partiellement";
      return "non miscibles";
    }
    var lp = k.loop(function(dt, t){ tm = t; if (shaken && shakeT < 3) shakeT += dt; k.redraw(); }); lp.play();
    A.el.addEventListener("change", function(){ shaken = false; shakeT = 99; }); B.el.addEventListener("change", function(){ shaken = false; shakeT = 99; });
    k.draw(function(){
      var a = A.value, b = B.value, la = L[a], lb = L[b], res = result(a, b), ctx = c.ctx; c.clear();
      var tw = 90, tx = 26, ty = 20, th = 230, fb = vb.value / 100, fa = 1 - fb;
      var heavyA = la.rho >= lb.rho, bot = heavyA ? la : lb, top = heavyA ? lb : la, fBot = heavyA ? fa : fb, fTop = 1 - fBot;
      var rgb = function(col, al){ return "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + al + ")"; };
      var mixed = shaken && shakeT >= 2.2 && (res === "miscibles" || res === "même liquide");
      var mixing = shaken && shakeT < 2.2, y0 = ty + 10, hh = th - 20;
      ctx.save(); ctx.beginPath(); ctx.rect(tx, ty, tw, th - 4); ctx.clip();
      if (mixed){
        var mc = [Math.round(la.col[0] * fa + lb.col[0] * fb), Math.round(la.col[1] * fa + lb.col[1] * fb), Math.round(la.col[2] * fa + lb.col[2] * fb)];
        ctx.fillStyle = rgb(mc, 0.7); ctx.fillRect(tx, y0, tw, hh);
      } else if (mixing || (shaken && res === "partiellement" && shakeT < 3)){
        ctx.fillStyle = rgb(top.col, 0.3); ctx.fillRect(tx, y0, tw, hh);
        for (var i = 0; i < 40; i++){ var dx = tx + ((Math.sin(i * 12.9 + tm * 6) * 0.5 + 0.5) * tw), dy = y0 + ((Math.cos(i * 7.7 + tm * 5) * 0.5 + 0.5) * hh); ctx.fillStyle = rgb(i % 2 ? bot.col : top.col, 0.85); ctx.beginPath(); ctx.arc(dx, dy, 6, 0, 6.3); ctx.fill(); }
      } else {
        ctx.fillStyle = rgb(top.col, 0.6); ctx.fillRect(tx, y0, tw, hh * fTop);
        ctx.fillStyle = rgb(bot.col, 0.75); ctx.fillRect(tx, y0 + hh * fTop, tw, hh * fBot);
        if (shaken && res === "partiellement"){ ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(tx, y0 + hh * fTop - 8, tw, 16); }
      }
      ctx.restore();
      ctx.strokeStyle = pal.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx, ty + th - 14); ctx.arc(tx + tw / 2, ty + th - 14, tw / 2, Math.PI, 0, true); ctx.lineTo(tx + tw, ty); ctx.stroke();
      var splitView = !(mixed || mixing);
      if (splitView){
        S.draw.text(c, top.n + " (" + S.fmt(top.rho, 2) + ")", tx + tw + 12, y0 + hh * fTop / 2, {size: 12, align: "left"});
        S.draw.text(c, bot.n + " (" + S.fmt(bot.rho, 2) + ")", tx + tw + 12, y0 + hh * fTop + hh * fBot / 2, {size: 12, align: "left"});
      } else if (mixed) S.draw.text(c, "mélange homogène", tx + tw + 12, c.H / 2, {size: 12, align: "left", color: pal.green});
      S.draw.text(c, "ρ en g/cm³", 10, 12, {size: 12, align: "left", color: pal.grey});
      ro.set(0, la.pol ? "polaire" : "apolaire"); ro.set(1, lb.pol ? "polaire" : "apolaire");
      var shown = shaken && shakeT >= 2.2 ? res : (shaken ? "en cours…" : "à tester (agite)");
      ro.set(2, shown); ro.set(3, splitView || res === "non miscibles" ? top.n : "— (homogène)");
      var msg = res === "même liquide" ? "Tu as choisi deux fois le même liquide." : res === "miscibles" ? "Même nature (" + (la.pol ? "polaire" : "apolaire") + ") : les molécules se mélangent." : res === "partiellement" ? "L'éthanol se dissout un peu dans les deux : mélange partiel, trouble (modèle simplifié)." : "Nature différente : les molécules polaires préfèrent rester entre elles. Le plus dense (" + bot.n + ") est au fond.";
      nt.set(msg, res === "miscibles" ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "c5-c04-tension", ch: "c04", tag: "Niche utile",
  titre: "L'aiguille qui coule dès qu'on ajoute du savon",
  resume: "La tension superficielle de l'eau porte l'aiguille ; le savon la fait chuter.",
  but: "Pose l'aiguille sur l'eau : elle flotte grâce à la tension superficielle. Augmente la concentration en savon jusqu'à ce qu'elle coule. Trouve la concentration minimale pour une aiguille donnée.",
  aRetenir: "Les liaisons hydrogène tirent chaque molécule de surface vers l'intérieur : la surface se comporte comme une peau tendue de tension γ (eau pure à 20 °C : 72,8 mN/m). Une aiguille légère est portée si son poids est inférieur à 2·γ·L (deux lignes de contact). Le savon fait chuter γ (≈ 38 mN/m au-delà de la CMC).",
  piege: "L'aiguille d'acier est 8 fois plus dense que l'eau : ce n'est PAS la poussée d'Archimède qui la porte mais la tension superficielle. Le modèle F = 2·γ·L est une borne idéale (angle de contact ignoré) ; une vraie aiguille coule un peu avant. La courbe γ(c) est un modèle simplifié.",
  build: function(k, S){
    var pal = S.draw.palette, G = 9.81, CMC = 8;
    var c = k.canvas(220), g = k.canvas(170);
    var Ls = k.slider("Longueur de l'aiguille", 1, 6, 0.5, 3, "cm");
    var ms = k.slider("Masse de l'aiguille", 0.02, 0.6, 0.01, 0.3, "g");
    var cs = k.slider("Savon dissous", 0, 12, 0.5, 0, "mmol/L");
    var ro = k.readouts(["Tension superficielle γ", "Force max 2·γ·L", "Poids de l'aiguille", "Verdict"]);
    var nt = k.note("", "");
    function gam(x){ var cc = Math.min(x, CMC); return 72.8 - 35 * (1 - Math.exp(-cc / 2)) / (1 - Math.exp(-CMC / 2)); }
    var y = 0, v = 0, sunk = false;
    var lp = k.loop(function(dt){
      var gm = gam(cs.value) / 1000, Fm = 2 * gm * Ls.value / 100, Wt = ms.value / 1000 * G;
      if (Wt > Fm){ sunk = true; }
      else if (Wt < Fm * 0.7){ sunk = false; }
      if (sunk){ v += 400 * dt; y = Math.min(110, y + v * dt * 0.25); if (y >= 110) v = 0; } else { y = Math.max(0, y - 200 * dt); v = 0; }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      var gm = gam(cs.value), Fm = 2 * gm / 1000 * Ls.value / 100, Wt = ms.value / 1000 * G, floats = Wt <= Fm, ctx = c.ctx; c.clear(); g.clear();
      var bx = 20, bw = c.W - 40, wl = 70;
      ctx.fillStyle = "#cfe4f6"; ctx.fillRect(bx, wl, bw, 140); ctx.strokeStyle = pal.ink; ctx.lineWidth = 2.5; ctx.strokeRect(bx, 20, bw, 190);
      var ncx = c.W / 2, nh = 6, dent = floats ? Math.min(14, 14 * Wt / Fm) : 0, ny = wl - 4 + (floats ? dent * 0.4 : y);
      if (floats || y < 6){   /* creux de la surface */
        ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, wl);
        ctx.quadraticCurveTo(ncx - 60, wl, ncx - 30, wl + dent); ctx.lineTo(ncx + 30, wl + dent); ctx.quadraticCurveTo(ncx + 60, wl, bx + bw, wl); ctx.stroke();
      } else { S.draw.line(c, bx, wl, bx + bw, wl, pal.acc, 2); }
      var nl = Math.min(150, 28 * Ls.value);
      ctx.fillStyle = "#7a8594"; ctx.fillRect(ncx - nl / 2, ny, nl, nh); ctx.strokeStyle = pal.ink; ctx.lineWidth = 1; ctx.strokeRect(ncx - nl / 2, ny, nl, nh);
      S.draw.text(c, floats ? "l'aiguille flotte" : "elle coule", ncx, 34, {size: 13, color: floats ? pal.green : pal.red});
      var ax = S.draw.axes(g, {x0: 0, x1: 12, y0: 0, y1: 80, xl: "savon (mmol/L)", yl: "γ (mN/m)", stepX: 2, stepY: 20, l: 50});
      S.draw.fn(g, ax, gam, pal.acc, 2.6); S.draw.line(g, ax.X(CMC), ax.T, ax.X(CMC), ax.B, pal.grey, 1, [4, 4]); S.draw.text(g, "CMC ≈ 8", ax.X(CMC) + 4, ax.T + 14, {size: 12, color: pal.grey, align: "left"});
      S.draw.dot(g, ax.X(cs.value), ax.Y(gm), 7, pal.red);
      ro.set(0, S.fmt(gm, 1) + " mN/m"); ro.set(1, S.fmt(Fm * 1000, 2) + " mN"); ro.set(2, S.fmt(Wt * 1000, 2) + " mN"); ro.set(3, floats ? "flotte (marge " + S.fmt((Fm / Wt - 1) * 100, 0) + " %)" : "coule");
      nt.set(floats ? "Il faut que le poids reste sous 2·γ·L. Ajoute du savon pour faire baisser γ." : "Le poids dépasse la force de tension superficielle maximale : l'aiguille perce la surface. Retire du savon pour qu'elle remonte (avec une aiguille plus légère).", floats ? "ok" : "warn");
    });
  }
});
