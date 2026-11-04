/* Chapitre 5 · Génie génétique et biotechnologies */
(function(){
var B = window.B6;

SFA.sim({
  id: "b6-c05-pcr", ch: "c05", tag: "Classique",
  titre: "PCR : l'amplification exponentielle de l'ADN",
  resume: "Chaque cycle de 3 étapes double (au mieux) le nombre de copies : 30 cycles multiplient par plus d'un milliard.",
  but: "Choisis le nombre de cycles, l'efficacité de chaque cycle et le nombre de copies de départ. Lance l'animation : le graphe suit les copies cycle après cycle et la température du thermocycleur. Passe en échelle linéaire pour voir la courbe « en crosse de hockey ».",
  aRetenir: "Un cycle = dénaturation (95 °C : les deux brins se séparent), hybridation des amorces (≈ 55 °C), élongation par l'ADN polymérase thermostable (≈ 72 °C). Si l'efficacité est de 100 %, N = N₀ × 2ⁿ ; si elle est de E, N = N₀ × (1 + E)ⁿ. Une petite baisse d'efficacité s'accumule : à 90 %, 30 cycles donnent environ 230 millions de fois plus, et non 1 milliard.",
  piege: "La croissance exponentielle ne dure pas : au-delà de 10¹² copies environ, les réactifs s'épuisent et la courbe plafonne (valeur donnée comme ordre de grandeur). Et une PCR n'amplifie que la région encadrée par les amorces, pas tout le génome.",
  build: function(k, S){
    var c = k.canvas(400), P = S.draw.palette, cur = null;
    var cyc = k.slider("Nombre de cycles", 0, 40, 1, 30, "", function(){ cur = null; lp.pause(); });
    var eff = k.slider("Efficacité par cycle", 70, 100, 1, 95, "%");
    var n0 = k.select("Copies de départ", [1, 10, 100, 1000, 10000], 100);
    var pl = k.toggle("Plateau (réactifs épuisés au-delà de 10¹² copies)", true);
    var sc = k.seg("Échelle verticale", [["l", "Logarithmique"], ["n", "Linéaire"]], "l");
    var lp = k.loop(function(dt){ cur += dt * 4; if (cur >= cyc.value){ cur = null; lp.pause(); } k.redraw(); });
    k.button("Lancer les cycles", function(){ cur = 0; lp.play(); }, true);
    var ro = k.readouts(["Copies après les cycles", "Amplification", "Cycles pour 10⁹ copies"]);
    function N(n){ var v = +n0.value * Math.pow(1 + eff.value / 100, n); return pl.value ? Math.min(v, 1e12) : v; }
    k.draw(function(){
      c.clear(); var E = eff.value / 100, nc = cyc.value, shown = cur === null ? nc : Math.floor(cur), log = sc.value === "l", ctx = c.ctx;
      var nmax = 40, ymax = log ? 14 : 100, ref = N(40);
      var ax = S.draw.axes(c, {x0: 0, x1: 40, y0: 0, y1: ymax, stepX: 5, stepY: log ? 2 : 25, xl: "cycles", yl: log ? "log₁₀(copies)" : "% de la valeur à 40 cycles", t: 14, b: 128, l: 48});
      function yv(n){ return log ? Math.log10(N(n)) : N(n) / ref * 100; }
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      ctx.strokeStyle = "#c6cdd6"; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.beginPath();
      for (var i = 0; i <= 40; i++){ var v = log ? Math.log10(N(i)) : N(i) / ref * 100; if (i === 0) ctx.moveTo(ax.X(i), ax.Y(v)); else ctx.lineTo(ax.X(i), ax.Y(v)); } ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = P.acc; ctx.lineWidth = 3; ctx.beginPath();
      for (i = 0; i <= shown; i++){ var y = yv(i); if (i === 0) ctx.moveTo(ax.X(i), ax.Y(y)); else ctx.lineTo(ax.X(i), ax.Y(y)); } ctx.stroke();
      ctx.restore();
      S.draw.dot(c, ax.X(shown), ax.Y(yv(shown)), 6, P.red);
      if (log) S.draw.line(c, ax.L, ax.Y(9), ax.R, ax.Y(9), P.green, 1.2, [3, 4]);
      if (log) S.draw.text(c, "10⁹", ax.L + 14, ax.Y(9) - 9, {size: 12, color: P.green});
      /* profil de température */
      var py = ax.B + 44, ph = 66, W0 = ax.L, W1 = ax.R, ct = shown;
      S.draw.text(c, "Un cycle du thermocycleur (3 répétitions)", (W0 + W1) / 2, py - 16, {size: 12, color: P.grey});
      var T = [[0, 95, "95 °C"], [0.25, 55, "55 °C"], [0.5, 72, "72 °C"]], pts = [];
      function ty(t){ return py + ph - (t - 40) / 60 * ph; }
      var cw = (W1 - W0) / 3;
      for (var r = 0; r < 3; r++){ T.forEach(function(s, q){ var x = W0 + r * cw + s[0] * cw, nx = W0 + r * cw + (q < 2 ? T[q + 1][0] : 1) * cw; pts.push([x, ty(s[1])], [nx, ty(s[1])]); }); }
      ctx.strokeStyle = P.amber; ctx.lineWidth = 2; ctx.beginPath(); pts.forEach(function(p, q){ if (q === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); }); ctx.stroke();
      var names = ["Dénaturation", "Hybridation", "Élongation"];
      T.forEach(function(s, q){ S.draw.text(c, names[q], W0 + s[0] * cw + (q < 2 ? 0.125 : 0.25) * cw, ty(s[1]) - 10, {size: 12, color: P.ink, weight: 600}); });
      if (cur !== null){ var f = cur - Math.floor(cur), mx = W0 + f * cw; S.draw.line(c, mx, py - 2, mx, py + ph, P.red, 2); S.draw.text(c, "cycle " + (Math.floor(cur) + 1), W1 - 30, py - 16, {size: 12, color: P.red}); }
      var fin = N(shown);
      ro.set(0, S.sci(fin, 3)); ro.set(1, "× " + S.sci(fin / +n0.value, 3));
      var need = Math.ceil(Math.log(1e9 / +n0.value) / Math.log(1 + E) - 1e-9); ro.set(2, need <= 40 ? need + " cycles" : "plus de 40");
    });
  }
});

SFA.sim({
  id: "b6-c05-electrophorese", ch: "c05", tag: "Originale",
  titre: "Électrophorèse : couper l'ADN et lire les bandes",
  resume: "Choisis des enzymes de restriction, lance la migration et estime la taille des fragments avec l'échelle de référence.",
  but: "Un ADN de 6 000 paires de bases (pb) est coupé par une ou plusieurs enzymes. Les fragments migrent vers le pôle + dans le gel : les plus petits vont le plus loin. Touche le gel pour placer un repère et lire la taille estimée grâce à l'échelle de taille (colonne de gauche).",
  aRetenir: "L'ADN, chargé négativement, migre vers le pôle positif ; la distance parcourue est une fonction décroissante du logarithme de la taille : plus un fragment est petit, plus il migre loin. Une enzyme de restriction coupe à des séquences précises : n sites de coupure dans un ADN linéaire donnent n + 1 fragments. Les positions des coupures sont fictives ici.",
  piege: "Deux fragments de même taille forment une seule bande plus intense. Et la taille se lit en comparant à l'échelle de référence (et non en mesurant une distance absolue) : la distance dépend aussi de la tension et du temps de migration.",
  build: function(k, S){
    var c = k.canvas(430), P = S.draw.palette, cursor = null;
    var enz = {E: {n: "EcoRI", s: [1500, 4000]}, Bm: {n: "BamHI", s: [2500]}, H: {n: "HindIII", s: [700, 3300, 5000]}};
    var tE = k.toggle("EcoRI (coupe en 1 500 et 4 000)", true), tB = k.toggle("BamHI (coupe en 2 500)", false), tH = k.toggle("HindIII (coupe en 700, 3 300 et 5 000)", false);
    var V = k.slider("Tension", 50, 200, 10, 100, "V"), T = k.slider("Durée de migration", 0, 60, 5, 30, "min");
    var ro = k.readouts(["Fragments (pb)", "Taille au repère"]);
    var note = k.note("", "");
    var LAD = [10000, 8000, 6000, 5000, 4000, 3000, 2000, 1500, 1000, 500, 250];
    function frags(){ var cuts = []; [[tE, "E"], [tB, "Bm"], [tH, "H"]].forEach(function(t){ if (t[0].value) cuts = cuts.concat(enz[t[1]].s); }); cuts.sort(function(a, b){ return a - b; }); var p = [0].concat(cuts, [6000]), f = []; for (var i = 1; i < p.length; i++) f.push(p[i] - p[i - 1]); return f; }
    function fac(){ return (V.value / 100) * (T.value / 30); }
    function dist(s){ return fac() * (5 - Math.log10(s)) * 95; }
    var geo = function(){ var y0 = 56, h = c.H - y0 - 14; return {y0: y0, h: h, x0: 64, lw: (c.W - 64 - 12) / 3}; };
    c.pointer(function(t, p){ if (t === "up") return; var g = geo(); cursor = Math.max(0, Math.min(g.h, p.y - g.y0)); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, g = geo(), f = frags(), i;
      ctx.fillStyle = "#dfe9f1"; ctx.fillRect(g.x0 - 8, g.y0 - 6, c.W - g.x0 - 4, g.h + 10);
      S.draw.text(c, "pôle −", c.W / 2, 10, {size: 12, color: P.red}); S.draw.text(c, "pôle +", c.W / 2, c.H - 4, {size: 12, color: P.acc});
      ["Échelle", "ADN non coupé", "ADN coupé"].forEach(function(t, q){
        var x = g.x0 + q * g.lw; ctx.fillStyle = "#9db2c4"; ctx.fillRect(x + 6, g.y0 - 6, g.lw - 12, 7); S.draw.text(c, t, x + g.lw / 2, 34, {size: 12});
      });
      function band(q, size, mass, lab){
        var d = dist(size), x = g.x0 + q * g.lw; if (d > g.h){ return false; }
        ctx.fillStyle = "rgba(19,35,58," + Math.min(0.95, 0.25 + mass / 6000 * 0.75) + ")"; ctx.fillRect(x + 8, g.y0 + d - 2, g.lw - 16, 5);
        if (lab && [8000, 5000].indexOf(size) < 0) S.draw.text(c, S.fmt(size, 0), g.x0 - 14, g.y0 + d, {size: 12, color: P.grey, align: "right", weight: 600});
        return true;
      }
      var off = 0; LAD.forEach(function(s){ if (!band(0, s, s, true)) off++; });
      band(1, 6000, 6000, false);
      var seen = {}; f.forEach(function(s){ seen[s] = (seen[s] || 0) + 1; });
      var lost = off; Object.keys(seen).forEach(function(s){ var cnt = seen[s]; if (!band(2, +s, +s * cnt, false)) lost++; });
      if (cursor !== null){
        ctx.strokeStyle = P.red; ctx.lineWidth = 1.5; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(g.x0 - 8, g.y0 + cursor); ctx.lineTo(c.W - 4, g.y0 + cursor); ctx.stroke(); ctx.setLineDash([]);
        var est = Math.pow(10, 5 - cursor / (fac() * 95 || 1)); if (fac() === 0) est = NaN;
        ro.set(1, isNaN(est) || est > 1e6 ? "hors échelle" : "≈ " + S.fmt(est, 0) + " pb");
      } else ro.set(1, "Touche le gel");
      ro.set(0, f.slice().sort(function(a, b){ return b - a; }).join(" · "));
      note.set(f.length === 1 ? "Aucune enzyme choisie : l'ADN reste entier (6 000 pb)." : (f.length - 1) + " site(s) de coupure → " + f.length + " fragments. Somme des tailles : " + f.reduce(function(a, b){ return a + b; }, 0) + " pb." + (Object.keys(seen).length < f.length ? " Des fragments de même taille se superposent en une seule bande plus intense." : "") + (lost ? " <b>Des bandes sont sorties du gel : réduis la durée ou la tension.</b>" : ""), lost ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "b6-c05-plaques", ch: "c05", tag: "Niche utile",
  titre: "Transformation bactérienne : quelles colonies ont le gène ?",
  resume: "Sur trois boîtes de Pétri (LB, LB + ampicilline, LB + ampicilline + X-gal), seules certaines colonies portent le plasmide recombinant.",
  but: "On met en contact 400 bactéries avec des plasmides et on étale. Règle la fréquence de transformation et le succès de la ligature (plasmides contenant l'insert). Compare les trois boîtes.",
  aRetenir: "Le plasmide porte un gène de résistance à l'ampicilline : seules les bactéries transformées survivent sur la boîte avec antibiotique. L'insert (gène d'intérêt, par exemple l'insuline humaine) s'insère dans le gène lacZ : avec X-gal, les colonies à plasmide vide sont bleues, celles à plasmide recombinant sont blanches.",
  piege: "Une colonie blanche porte un plasmide avec un insert, mais il faut encore vérifier que l'insert est le bon et qu'il est exprimé (PCR, séquençage, dosage de la protéine). Aucune étape ne garantit à elle seule qu'une bactérie produit de l'insuline.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62}), P = S.draw.palette;
    var tp = k.slider("Fréquence de transformation", 0.5, 20, 0.5, 5, "%");
    var lg = k.slider("Plasmides avec insert (ligature réussie)", 5, 90, 5, 30, "%");
    var seed = 1; k.button("Nouvelle expérience", function(){ seed++; });
    var ro = k.readouts(["Colonies sur LB", "Colonies sur LB + ampicilline", "Bleues / blanches", "Part de blanches"]);
    var note = k.note("", "");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, r = B.rng(seed * 2741 + 3), NB = 400;
      var T = B.binom(NB, tp.value / 100, r), T1 = B.binom(T, lg.value / 100, r), T0 = T - T1;
      var R = Math.min(c.W / 6.4, c.H / 2 - 20), cy = c.H / 2 - 8, titles = ["LB seul", "LB + ampicilline", "LB + ampi + X-gal"];
      var pos = []; var rp = B.rng(777 + seed); for (var i = 0; i < NB; i++){ var a = rp() * 6.2832, rr = Math.sqrt(rp()) * (R - 6); pos.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
      for (var q = 0; q < 3; q++){
        var cx = c.W * (q + 0.5) / 3; ctx.fillStyle = "#f6efd9"; ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill(); ctx.stroke();
        var cnt = q === 0 ? NB : T;
        for (var j = 0; j < cnt; j++){
          var white = q === 2 && j < T1, blue = q === 2 && !white;
          ctx.fillStyle = blue ? "#2f5fd0" : white ? "#fffdf5" : "#d9b66a"; ctx.strokeStyle = blue ? "#1b3b99" : "rgba(80,60,20,.5)"; ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.arc(cx + pos[j][0], cy + pos[j][1], q === 0 ? 2 : 3.4, 0, 6.2832); ctx.fill(); ctx.stroke();
        }
        S.draw.text(c, titles[q], cx, cy + R + 16, {size: 12}); S.draw.text(c, (q === 0 ? NB : q === 1 ? T : T) + " colonies", cx, cy + R + 33, {size: 12, color: P.grey, weight: 600});
      }
      ro.set(0, NB + " (toutes)"); ro.set(1, T); ro.set(2, T0 + " bleues / " + T1 + " blanches"); ro.set(3, T ? S.fmt(T1 / T * 100, 0) + " %" : "—");
      note.set(T === 0 ? "Aucune bactérie transformée dans cette expérience : augmente la fréquence de transformation." : "Sur " + NB + " bactéries, " + T + " ont pris un plasmide (survivent à l'ampicilline) ; parmi elles, " + T1 + " ont un plasmide recombinant (colonies blanches) à analyser. Les " + (NB - T) + " autres n'ont pas de plasmide et meurent sur la boîte avec ampicilline.", T1 === 0 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "b6-c05-profil", ch: "c05", tag: "Enquête",
  titre: "Profil ADN : combien de marqueurs faut-il pour accuser ?",
  resume: "Compare l'ADN d'une scène de crime avec quatre suspects locus par locus et calcule la probabilité d'une coïncidence.",
  but: "Chaque colonne est un locus (marqueur de répétitions). Augmente le nombre de loci comparés : les suspects dont le profil diffère sont écartés ; la probabilité qu'une personne prise au hasard ait ce profil diminue par produit. Valeurs illustratives, simplifiées.",
  aRetenir: "Un seul marqueur ne suffit jamais : beaucoup de personnes partagent le même génotype. En comparant n marqueurs indépendants, on multiplie les fréquences génotypiques : la probabilité d'une coïncidence chute de façon exponentielle. Une seule différence suffit à exclure une personne ; une concordance ne fait que la maintenir parmi les suspects.",
  piege: "Confusion classique : « la probabilité qu'un innocent ait ce profil est de 1 sur 10 millions » n'est pas « la probabilité que ce suspect soit innocent est de 1 sur 10 millions ». Dans une ville d'un million d'habitants, on attend encore 0,7 coïncidence avec 6 marqueurs : il faut tenir compte de la population concernée et de l'ensemble des preuves. Les apparentés ont des profils proches.",
  build: function(k, S){
    var c = k.canvas(500), P = S.draw.palette;
    var n = k.slider("Marqueurs (loci) comparés", 1, 8, 1, 3, "");
    var pop = k.select("Population concernée", [[1e4, "10 000 personnes"], [1e5, "100 000 personnes"], [1e6, "1 million de personnes"], [1e7, "10 millions de personnes"]], 1e6);
    var ro = k.readouts(["Probabilité d'une coïncidence", "Coïncidences attendues dans la population", "Suspects non exclus"]);
    var note = k.note("", "");
    var FR = [0.09, 0.12, 0.07, 0.11, 0.10, 0.08, 0.13, 0.09];
    var scene = ["14/16", "9/11", "12/12", "8/10", "18/20", "15/15", "7/9", "22/24"];
    var sus = [["Suspect A", scene.slice()], ["Suspect B", ["14/16", "9/11", "12/12", "8/10", "18/20", "15/15", "7/8", "22/23"]],
      ["Suspect C", ["14/16", "9/11", "11/12", "8/10", "18/19", "15/16", "7/9", "21/24"]], ["Suspect D", ["14/15", "9/10", "12/12", "8/9", "17/20", "15/15", "9/9", "22/25"]]];
    k.draw(function(){
      c.clear(); var ctx = c.ctx, nn = n.value, lw = 56, cw = (c.W - lw - 6) / 8, y0 = 24, rh = 38, i, j;
      for (j = 0; j < 8; j++) S.draw.text(c, "L" + (j + 1), lw + cw * (j + 0.5), 12, {size: 12, color: j < nn ? P.ink : P.grey});
      var rows = [["Scène", scene]].concat(sus.map(function(s0, q){ return ["Susp. " + "ABCD"[q], s0[1]]; })), alive = 0;
      rows.forEach(function(rw, q){
        var y = y0 + q * rh, ex = false;
        S.draw.text(c, rw[0], 4, y + rh / 2, {align: "left", size: 12, color: q === 0 ? P.red : P.ink});
        for (j = 0; j < 8; j++){
          var m = q === 0 || rw[1][j] === scene[j], used = j < nn; if (used && !m) ex = true;
          ctx.fillStyle = !used ? "#f1f3f6" : q === 0 ? "#fde8e6" : m ? "#e0f0e6" : "#f6d2cf"; ctx.fillRect(lw + cw * j + 1, y + 1, cw - 2, rh - 2);
          var al = rw[1][j].split("/"); S.draw.text(c, al[0], lw + cw * (j + 0.5), y + rh / 2 - 8, {size: 12, color: used ? P.ink : "#a8b1bd", weight: 600}); S.draw.text(c, al[1], lw + cw * (j + 0.5), y + rh / 2 + 8, {size: 12, color: used ? P.ink : "#a8b1bd", weight: 600});
        }
        if (q > 0){ if (!ex) alive++; }
      });
      var yy = y0 + 5 * rh + 4;
      var prob = 1; for (i = 0; i < nn; i++) prob *= FR[i];
      var exp = prob * pop.value;
      /* courbe des coïncidences attendues */
      var ax = S.draw.axes(c, {x0: 0, x1: 8, y0: -4, y1: 7, stepX: 1, stepY: 2, t: yy + 26, b: 34, yl: "log₁₀(coïncidences attendues)", l: 44});
      S.draw.text(c, "Coïncidences attendues (loci 1 à 8)", c.W / 2, yy + 10, {size: 12, color: P.grey});
      S.draw.line(c, ax.L, ax.Y(0), ax.R, ax.Y(0), P.green, 1.4, [4, 4]); S.draw.text(c, "1 coïncidence", ax.R - 4, ax.Y(0) - 9, {size: 12, color: P.green, align: "right"});
      ctx.strokeStyle = P.acc; ctx.lineWidth = 2.6; ctx.beginPath(); var cp = 1;
      for (i = 0; i <= 8; i++){ if (i > 0) cp *= FR[i - 1]; var v = Math.log10(cp * pop.value); if (i === 0) ctx.moveTo(ax.X(i), ax.Y(v)); else ctx.lineTo(ax.X(i), ax.Y(v)); } ctx.stroke();
      S.draw.dot(c, ax.X(nn), ax.Y(Math.log10(exp)), 6, P.red);
      var inv = 1 / prob; ro.set(0, "1 sur " + (inv < 1e9 ? Math.round(inv).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0") : S.sci(inv, 2))); ro.set(1, exp >= 100 ? S.fmt(exp, 0) : S.sci(exp, 2)); ro.set(2, alive + " sur 4");
      note.set(exp >= 1 ? "Avec " + nn + " marqueur(s), on attend encore environ " + (exp >= 100 ? S.fmt(exp, 0) : S.fmt(exp, 1)) + " personne(s) au même profil dans la population : une concordance prouve très peu." : "Avec " + nn + " marqueurs, on attend moins d'une coïncidence dans cette population : le profil devient très discriminant (sauf pour des apparentés).", exp >= 1 ? "warn" : "ok");
    });
  }
});
})();
