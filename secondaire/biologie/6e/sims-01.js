/* Chapitre 1 · Hérédité monohybride : gènes et allèles */
(function(){
var B = window.B6;
function frac(n, d){ var g = B.gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; }
function sortG(a, b){ return a <= b ? a + b : b + a; }   /* "A" < "a" en ASCII : AA, Aa, aa */

SFA.sim({
  id: "b6-c01-echiquier", ch: "c01", tag: "Classique",
  titre: "Échiquier de croisement et descendants tirés au sort",
  resume: "Choisis les génotypes des parents, lis l'échiquier, puis tire au sort des descendants et compare aux proportions attendues.",
  but: "Choisis le génotype des deux parents et le type de dominance. L'échiquier donne les proportions attendues ; avec le curseur, tire au sort des descendants et compare (trait pointillé = attendu).",
  aRetenir: "Chaque parent transmet un seul allèle par gamète, au hasard. L'échiquier donne des probabilités : Aa × Aa donne 1/4 AA, 1/2 Aa, 1/4 aa, soit 3 phénotypes dominants pour 1 récessif en dominance complète, mais 1 : 2 : 1 en dominance incomplète.",
  piege: "« Dominant » ne veut pas dire « le plus fréquent » : c'est l'allèle qui s'exprime chez l'hétérozygote. Et 3 : 1 n'est qu'une probabilité : sur 4 descendants, on peut très bien obtenir 4 : 0.",
  build: function(k, S){
    var c = k.canvas(420), P = S.draw.palette;
    var mode = k.seg("Dominance", [["c", "Complète"], ["i", "Incomplète"]], "c");
    var opts = [["AA", "AA (homozygote dominant)"], ["Aa", "Aa (hétérozygote)"], ["aa", "aa (homozygote récessif)"]];
    var p1 = k.select("Parent 1", opts, "Aa"), p2 = k.select("Parent 2", opts, "Aa");
    var n = k.slider("Descendants tirés au sort", 0, 400, 10, 0, "");
    var seed = 1; k.button("Nouveau tirage", function(){ seed++; });
    var ro = k.readouts(["Attendu", "Observé", "Génotypes attendus"]);
    var colors = {c: ["#c0392b", "#fdfdfd"], i: ["#c0392b", "#f08aa0", "#fdfdfd"]};
    var names = {c: ["rouge", "blanche"], i: ["rouge", "rose", "blanche"]};
    function ph(g){ var nA = (g.match(/A/g) || []).length; if (mode.value === "c") return nA > 0 ? 0 : 1; return 2 - nA; }
    k.draw(function(){
      c.clear(); var m = mode.value, ctx = c.ctx;
      var g1 = p1.value.split(""), g2 = p2.value.split(""), cell = 62, ox = 52, oy = 46;
      S.draw.text(c, "Parent 2 ↓", 6, oy - 28, {size: 12, color: P.grey, align: "left"});
      S.draw.text(c, "Parent 1 →", ox + cell, oy - 28, {size: 12, color: P.grey});
      var cnt = {AA: 0, Aa: 0, aa: 0}, pc = m === "c" ? [0, 0] : [0, 0, 0], cells = [];
      for (var i = 0; i < 2; i++){
        S.draw.text(c, g1[i], ox + cell * (i + 0.5), oy - 10, {size: 15, color: P.acc});
        S.draw.text(c, g2[i], ox - 14, oy + cell * (i + 0.5), {size: 15, color: P.red});
        for (var j = 0; j < 2; j++){
          var g = sortG(g1[j], g2[i]); cnt[g]++; var q = ph(g); pc[q]++; cells.push(q);
          ctx.fillStyle = colors[m][q]; ctx.fillRect(ox + j * cell, oy + i * cell, cell - 2, cell - 2);
          ctx.strokeStyle = "#8a95a3"; ctx.strokeRect(ox + j * cell, oy + i * cell, cell - 2, cell - 2);
          S.draw.text(c, g, ox + j * cell + cell / 2 - 1, oy + i * cell + cell / 2 - 1, {size: 15, color: q === 0 ? "#fff" : P.ink});
        }
      }
      /* légende */
      var lx = ox + 2 * cell + 24;
      for (var q2 = 0; q2 < pc.length; q2++){
        ctx.fillStyle = colors[m][q2]; ctx.fillRect(lx, oy + 6 + q2 * 30, 20, 20); ctx.strokeStyle = "#8a95a3"; ctx.strokeRect(lx, oy + 6 + q2 * 30, 20, 20);
        S.draw.text(c, names[m][q2] + " : " + frac(pc[q2], 4), lx + 28, oy + 16 + q2 * 30, {align: "left", size: 13});
      }
      /* tirage au sort */
      var r = B.rng(seed * 7919 + 13), obs = pc.map(function(){ return 0; });
      for (var t = 0; t < n.value; t++) obs[cells[Math.floor(r() * 4)]]++;
      var items = pc.map(function(v, q3){ var exp = v * 25; return {l: names[m][q3], v: n.value ? obs[q3] / n.value * 100 : exp, e: exp, c: colors[m][q3] === "#fdfdfd" ? "#c8ccd2" : colors[m][q3]}; });
      S.draw.text(c, n.value ? "Pourcentage observé sur " + n.value + " descendants (pointillé = attendu)" : "Pourcentage attendu parmi les descendants", c.W / 2, 238, {size: 13});
      B.bars(c, S, items, 40, 262, c.W - 60, 110, 100, function(v){ return S.fmt(v, 1) + " %"; });
      /* lectures */
      var exTxt = pc.filter(function(v){ return v > 0; }), gg = 0; exTxt.forEach(function(v){ gg = B.gcd(gg, v); });
      ro.set(0, exTxt.map(function(v){ return v / gg; }).join(" : "));
      ro.set(1, n.value ? obs.filter(function(v, q4){ return pc[q4] > 0 || v > 0; }).join(" : ") : "—");
      ro.set(2, ["AA", "Aa", "aa"].filter(function(g){ return cnt[g] > 0; }).map(function(g){ return frac(cnt[g], 4) + " " + g; }).join(" · "));
    });
  }
});

SFA.sim({
  id: "b6-c01-grands-nombres", ch: "c01", tag: "Hasard",
  titre: "Pourquoi 3 : 1 n'apparaît que sur de grands effectifs",
  resume: "30 familles Aa × Aa de taille n : plus n est grand, plus les résultats se resserrent autour de 75 %.",
  but: "Chaque point est une famille (un échantillon) de n descendants d'un croisement Aa × Aa. Il montre le pourcentage de descendants au phénotype dominant. Augmente n et regarde le nuage se resserrer autour de 75 %.",
  aRetenir: "La proportion attendue (75 % de dominants) est une probabilité. Sur n descendants, l'écart typique vaut √(0,75 × 0,25 / n) : il est divisé par 2 quand on multiplie n par 4. Mendel a obtenu ses beaux 3 : 1 en comptant des centaines de plantes.",
  piege: "Avec 4 descendants, obtenir 4 dominants (ou 2 dominants et 2 récessifs) n'infirme pas la loi de Mendel : l'échantillon est simplement trop petit pour que les proportions apparaissent.",
  build: function(k, S){
    var c = k.canvas(380), P = S.draw.palette;
    var n = k.select("Descendants par famille (n)", [4, 8, 16, 32, 64, 128, 256, 512, 1024], 16);
    var seed = 1; k.button("Nouveau tirage de 30 familles", function(){ seed++; });
    var ro = k.readouts(["Famille n° 1 (dominants : récessifs)", "Moyenne des 30 familles", "Écart-type attendu"]);
    k.draw(function(){
      c.clear(); var N = +n.value, r = B.rng(seed * 104729 + N);
      var ax = S.draw.axes(c, {x0: 0, x1: 31, y0: 0, y1: 100, stepX: 5, stepY: 25, xl: "famille", yl: "% de dominants"});
      var sd = Math.sqrt(0.75 * 0.25 / N) * 100, lo = Math.max(0, 75 - 2 * sd), hi = Math.min(100, 75 + 2 * sd), ctx = c.ctx;
      ctx.fillStyle = "rgba(46,107,85,.13)"; ctx.fillRect(ax.L, ax.Y(hi), ax.R - ax.L, ax.Y(lo) - ax.Y(hi));
      S.draw.line(c, ax.L, ax.Y(75), ax.R, ax.Y(75), P.green, 1.6, [6, 4]);
      var sum = 0, out = 0, first = null;
      for (var i = 1; i <= 30; i++){
        var d = B.binom(N, 0.75, r), pc = d / N * 100; sum += pc; if (i === 1) first = d;
        var inside = pc >= lo - 1e-9 && pc <= hi + 1e-9; if (!inside) out++;
        S.draw.dot(c, ax.X(i), ax.Y(pc), i === 1 ? 7 : 5, inside ? P.green : P.red);
      }
      S.draw.text(c, "bande verte : 75 % ± 2 écarts-types", ax.L + 8, ax.T + 10, {align: "left", size: 12, color: P.green});
      ro.set(0, first + " : " + (N - first) + (first < N ? " (≈ " + S.fmt(first / (N - first), 2) + " : 1)" : ""));
      ro.set(1, S.fmt(sum / 30, 1) + " %");
      ro.set(2, "± " + S.fmt(sd, 1) + " points");
    });
  }
});

SFA.sim({
  id: "b6-c01-testcross", ch: "c01", tag: "Niche utile",
  titre: "Test-cross : AA ou Aa ? Combien de descendants faut-il ?",
  resume: "Un individu au phénotype dominant est croisé avec un aa. À partir de combien de descendants peut-on conclure ?",
  but: "Un individu mystère a le phénotype dominant. On le croise avec un individu aa et on observe n descendants. Augmente n et lis la probabilité de se tromper si tous les descendants sont dominants.",
  aRetenir: "Un seul descendant récessif suffit pour prouver que l'individu mystère est Aa (il a donné un allèle a). Par contre, si tous les descendants sont dominants, la conclusion « AA » n'est que probable : un Aa passe inaperçu avec la probabilité (1/2)ⁿ.",
  piege: "Tous les descendants dominants ne prouvent pas que le parent est AA : avec 3 descendants, un Aa se fait passer pour un AA dans 12,5 % des cas.",
  build: function(k, S){
    var c = k.canvas(400), P = S.draw.palette;
    var n = k.slider("Descendants observés (n)", 1, 20, 1, 3, "");
    var seed = 1; k.button("Nouvel individu mystère", function(){ seed++; });
    var rev = k.toggle("Révéler le génotype de l'individu mystère", false);
    var ro = k.readouts(["Descendants récessifs", "Verdict", "Erreur possible si tous dominants"]);
    var note = k.note("", "");
    k.draw(function(){
      c.clear(); var r = B.rng(seed * 6007 + 5), isAa = r() < 0.5, u = [], i;
      for (i = 0; i < 20; i++) u.push(r());
      var ctx = c.ctx, rec = 0, bw = Math.min(30, (c.W - 40) / 10);
      for (i = 0; i < n.value; i++){
        var isRec = isAa && u[i] >= 0.5; if (isRec) rec++;
        var x = 20 + (i % 10) * (bw + 2), y = 14 + Math.floor(i / 10) * (bw + 4);
        ctx.fillStyle = isRec ? "#e0b21c" : "#2e6b55"; ctx.fillRect(x, y, bw, bw);
        S.draw.text(c, isRec ? "aa" : "A–", x + bw / 2, y + bw / 2, {size: 12, color: isRec ? P.ink : "#fff"});
      }
      S.draw.text(c, "Vert = phénotype dominant · Jaune = phénotype récessif", c.W / 2, 94, {size: 12, color: P.grey});
      /* courbe de l'erreur, en échelle logarithmique */
      var L = 56, R = c.W - 16, T = 118, Bm = 352;
      function Y(p){ return Bm - (Math.log10(p) + 7) / 7 * (Bm - T); }   /* de 10⁻⁷ (bas) à 1 = 100 % (haut) */
      ctx.save(); ctx.font = "600 12px Mulish, sans-serif"; ctx.fillStyle = "#5f6b7a"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      [[100, "100 %"], [10, "10 %"], [1, "1 %"], [0.1, "0,1 %"], [0.01, "0,01 %"], [0.001, "0,001 %"], [0.0001, "0,0001 %"], [0.00001, "0,00001 %"]].forEach(function(g){
        ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(L, Y(g[0] / 100)); ctx.lineTo(R, Y(g[0] / 100)); ctx.stroke(); ctx.fillText(g[1], L - 4, Y(g[0] / 100));
      });
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (i = 1; i <= 20; i += (c.W < 420 ? 3 : 1)){ var xx = L + (i - 1) / 19 * (R - L); ctx.fillText(i, xx, Bm + 4); }
      ctx.restore();
      ctx.strokeStyle = P.acc; ctx.lineWidth = 2.4; ctx.beginPath();
      for (i = 1; i <= 20; i++){ var px = L + (i - 1) / 19 * (R - L), py = Y(Math.pow(0.5, i)); if (i === 1) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.stroke();
      var cx = L + (n.value - 1) / 19 * (R - L); S.draw.dot(c, cx, Y(Math.pow(0.5, n.value)), 7, P.red);
      S.draw.text(c, "n = nombre de descendants", (L + R) / 2, Bm + 26, {size: 12, color: P.grey});
      S.draw.text(c, "P(Aa passe pour AA) = (1/2)ⁿ", L + 8, T + 6, {align: "left", size: 12, color: P.acc});
      var err = Math.pow(0.5, n.value) * 100;
      ro.set(0, rec + " sur " + n.value);
      ro.set(1, rec > 0 ? "Aa (certain)" : "AA probable");
      ro.set(2, rec > 0 ? "aucune" : S.fmt(err, err < 0.001 ? 6 : err < 0.1 ? 4 : 2) + " %");
      var txt = rec > 0 ? "Un descendant aa existe : l'individu mystère a forcément donné un allèle a, donc il est Aa." : "Tous dominants : pour être sûr à 99 % (erreur < 1 %), il faut au moins 7 descendants (1/2⁷ = 0,78 %).";
      if (rev.value) txt += " <b>Génotype réel : " + (isAa ? "Aa" : "AA") + ".</b>";
      note.set(txt, rec > 0 ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id: "b6-c01-abo", ch: "c01", tag: "Allèles multiples",
  titre: "Groupes sanguins ABO : codominance et exclusion de paternité",
  resume: "Choisis les génotypes des parents : quels groupes sanguins peuvent avoir leurs enfants, avec quelles probabilités ?",
  but: "Trois allèles (A, B, O) existent pour ce gène. Choisis le génotype de chaque parent, lis les probabilités de chaque groupe chez l'enfant, puis teste si un groupe observé est possible.",
  aRetenir: "A et B sont codominants (un hétérozygote AB exprime les deux) ; A et B sont tous deux dominants sur O. Un individu a seulement 2 allèles, mais la population en compte 3 : le groupe O exige le génotype OO.",
  piege: "Deux parents du groupe A peuvent avoir un enfant du groupe O (AO × AO : 1/4). Un groupe sanguin impossible permet d'exclure une paternité, mais un groupe possible ne la prouve pas.",
  build: function(k, S){
    var c = k.canvas(380), P = S.draw.palette;
    var opts = [["AA", "A (génotype AA)"], ["AO", "A (génotype AO)"], ["BB", "B (génotype BB)"], ["BO", "B (génotype BO)"], ["AB", "AB (génotype AB)"], ["OO", "O (génotype OO)"]];
    var p1 = k.select("Parent 1", opts, "AO"), p2 = k.select("Parent 2", opts, "BO");
    var obs = k.select("Groupe observé chez l'enfant", [["-", "(aucun)"], ["A", "A"], ["B", "B"], ["AB", "AB"], ["O", "O"]], "-");
    var ro = k.readouts(["Groupes possibles", "Génotypes possibles"]);
    var note = k.note("", "");
    var col = {A: "#c0392b", B: "#1e3f8f", AB: "#5B21B6", O: "#8a95a3"};
    function grp(g){ var a = g.indexOf("A") >= 0, b = g.indexOf("B") >= 0; return a && b ? "AB" : a ? "A" : b ? "B" : "O"; }
    function sg(a, b){ var s = [a, b].sort().join(""); return s; }
    k.draw(function(){
      c.clear(); var g1 = p1.value.split(""), g2 = p2.value.split(""), cell = 60, ox = 56, oy = 44, ctx = c.ctx, cnt = {A: 0, B: 0, AB: 0, O: 0}, gens = {};
      for (var i = 0; i < 2; i++){
        S.draw.text(c, g1[i], ox + cell * (i + 0.5), oy - 12, {size: 15, color: P.acc});
        S.draw.text(c, g2[i], ox - 14, oy + cell * (i + 0.5), {size: 15, color: P.red});
        for (var j = 0; j < 2; j++){
          var g = sg(g1[j], g2[i]), q = grp(g); cnt[q]++; gens[g] = (gens[g] || 0) + 1;
          ctx.fillStyle = col[q]; ctx.fillRect(ox + j * cell, oy + i * cell, cell - 2, cell - 2);
          S.draw.text(c, g, ox + j * cell + cell / 2 - 1, oy + i * cell + cell / 2 - 7, {size: 15, color: "#fff"});
          S.draw.text(c, q, ox + j * cell + cell / 2 - 1, oy + i * cell + cell / 2 + 13, {size: 12, color: "#fff", weight: 600});
        }
      }
      var items = ["A", "B", "AB", "O"].map(function(q){ return {l: q, v: cnt[q] * 25, c: col[q]}; });
      var bx = ox + 2 * cell + 40;
      S.draw.text(c, "Probabilité du groupe de l'enfant", Math.max(bx + 80, c.W / 2), 252, {size: 13});
      B.bars(c, S, items, 30, 276, c.W - 50, 90, 100, function(v){ return S.fmt(v, 0) + " %"; });
      ro.set(0, ["A", "B", "AB", "O"].filter(function(q){ return cnt[q] > 0; }).join(", "));
      ro.set(1, Object.keys(gens).map(function(g){ return gens[g] + "/4 " + g; }).join(" · "));
      if (obs.value === "-") note.set("Choisis un groupe observé chez l'enfant pour tester la compatibilité.", "");
      else if (cnt[obs.value] > 0) note.set("Groupe " + obs.value + " possible (probabilité " + (cnt[obs.value] * 25) + " %). Cela ne prouve pas la filiation : d'autres personnes ont aussi ce groupe.", "ok");
      else note.set("Groupe " + obs.value + " impossible avec ces deux parents : ils ne peuvent pas être les parents biologiques de cet enfant (en l'absence de mutation).", "warn");
    });
  }
});
})();
