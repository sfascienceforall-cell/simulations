/* Chapitre 7 · Vitesse d'une réaction et catalyse */
C5.profile = function(c, S, opt){   /* profil énergétique d'une réaction : dessine et renvoie la fonction */
  var pal = S.draw.palette, sm = function(x){ return x * x * (3 - 2 * x); };
  function mk(e, d){
    var peak = function(a){ var m = -1e9; for (var i = 0; i <= 100; i++){ var x = i / 100, v = d * sm(x) + a * 4 * x * (1 - x); if (v > m) m = v; } return m; };
    var lo = 0, hi = 20 * (e + Math.abs(d) + 10); for (var it = 0; it < 60; it++){ var mid = (lo + hi) / 2; if (peak(mid) < e) lo = mid; else hi = mid; }
    var A = (lo + hi) / 2; return function(x){ return d * sm(x) + A * 4 * x * (1 - x); };
  }
  return mk(opt.e, opt.d);
};

SFA.sim({
  id: "c5-c07-collisions", ch: "c07", tag: "Animation",
  titre: "Théorie des collisions : seuls les chocs assez violents réagissent",
  resume: "Particules A et B qui se heurtent dans une boîte : température, concentration, Eₐ, catalyseur.",
  but: "Lance la simulation et compte les chocs efficaces. Double le nombre de particules, puis monte la température, puis abaisse Eₐ (ou ajoute le catalyseur). Dans quel cas la réaction va-t-elle le plus vite ?",
  aRetenir: "Une réaction a lieu quand deux particules se rencontrent (choc) avec une énergie au moins égale à Eₐ (choc efficace) et une orientation convenable. Plus de particules → plus de chocs. Plus chaud → chocs plus fréquents ET plus violents → bien plus de chocs efficaces. Un catalyseur abaisse Eₐ.",
  piege: "Tous les chocs ne sont pas efficaces : la plupart rebondissent sans réaction. Et élever T de 10 K ne multiplie pas par deux le nombre de chocs, mais le nombre de chocs EFFICACES, d'où le doublement. Simulation en 2D, sans orientation, résultats statistiques : ils varient d'un lancement à l'autre.",
  build: function(k, S){
    var pal = S.draw.palette, S300 = 45, R = 6;
    var c = k.canvas(250), g = k.canvas(150);
    var N = k.slider("Particules A et B (de chaque sorte)", 5, 40, 1, 20, "", function(){ init(); });
    var T = k.slider("Température", 250, 500, 10, 300, "K");
    var Ea = k.slider("Énergie d'activation Eₐ", 0.5, 6, 0.1, 2.5, "×kT(300 K)");
    var cat = k.toggle("Catalyseur (Eₐ − 40 %)", false);
    k.button("Relancer", function(){ init(); }, true);
    var ro = k.readouts(["Chocs A–B (5 dernières s)", "Dont efficaces", "Part efficace (mesurée)", "Part efficace théorique", "Réactifs restants"]);
    var nt = k.note("", "");
    var ps = [], hist = [], ev = [], tt = 0, prod = 0;
    function gauss(){ var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    function init(){
      ps = []; hist = []; ev = []; tt = 0; prod = 0;
      var W = c.W, H = c.H;
      for (var i = 0; i < 2 * N.value; i++) ps.push({x: 20 + Math.random() * (W - 40), y: 20 + Math.random() * (H - 40), ux: gauss(), uy: gauss(), s: i < N.value ? "A" : "B", on: true});
    }
    var lp = k.loop(function(dt){
      var W = c.W, H = c.H, sc = S300 * Math.sqrt(T.value / 300), thr = Ea.value * (cat.value ? 0.6 : 1), i, j;
      var steps = 2, h = dt / steps;
      for (var st = 0; st < steps; st++){
        ps.forEach(function(p){ if (!p.on) return; p.x += p.ux * sc * h; p.y += p.uy * sc * h;
          if (p.x < R){ p.x = R; p.ux = Math.abs(p.ux); } if (p.x > W - R){ p.x = W - R; p.ux = -Math.abs(p.ux); }
          if (p.y < R){ p.y = R; p.uy = Math.abs(p.uy); } if (p.y > H - R){ p.y = H - R; p.uy = -Math.abs(p.uy); } });
        for (i = 0; i < ps.length; i++){ var a = ps[i]; if (!a.on || a.s !== "A") continue;
          for (j = 0; j < ps.length; j++){ var b = ps[j]; if (!b.on || b.s !== "B") continue;
            var dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
            if (d2 < 4 * R * R){
              var rvx = (b.ux - a.ux), rvy = (b.uy - a.uy), appr = rvx * dx + rvy * dy;
              if (appr >= 0) continue;   /* ils s'éloignent déjà */
              var dd0 = Math.sqrt(d2) || 1, vnn = Math.abs(rvx * dx + rvy * dy) / dd0, relE = vnn * vnn / 4 * (T.value / 300), eff = relE >= thr;   /* énergie le long de la ligne des centres, en unités de kT(300 K) */
              ev.push({t: tt, eff: eff});
              if (eff){ a.s = "P"; b.on = false; prod++; a.flash = 0.4; }
              else { var d = Math.sqrt(d2) || 1, nx = dx / d, ny = dy / d, vn = rvx * nx + rvy * ny; a.ux += vn * nx; a.uy += vn * ny; b.ux -= vn * nx; b.uy -= vn * ny; }
            }
          }
        }
        tt += h;
      }
      while (ev.length && ev[0].t < tt - 5) ev.shift();
      if (hist.length === 0 || tt - hist[hist.length - 1][0] >= 0.5){ hist.push([tt, ps.filter(function(p){ return p.on && p.s === "A"; }).length]); if (hist.length > 160) hist.shift(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      c.clear(); g.clear();
      c.ctx.strokeStyle = pal.grey; c.ctx.lineWidth = 2; c.ctx.strokeRect(1, 1, c.W - 2, c.H - 2);
      ps.forEach(function(p){ if (!p.on) return;
        C5.atom(c, p.x, p.y, R, p.s === "A" ? "#9db8ee" : p.s === "B" ? "#f2a3a3" : "#8fd0a8", "");
        if (p.flash > 0){ c.ctx.strokeStyle = pal.amber; c.ctx.lineWidth = 2; c.ctx.beginPath(); c.ctx.arc(p.x, p.y, R + 5, 0, 6.3); c.ctx.stroke(); p.flash -= 0.02; } });
      S.draw.text(c, "A", 14, 12, {size: 12, color: "#4a6fc7", align: "left"}); S.draw.text(c, "B", 30, 12, {size: 12, color: "#c44", align: "left"}); S.draw.text(c, "produit", 62, 12, {size: 12, color: pal.green, align: "left"});
      var nA = ps.filter(function(p){ return p.on && p.s === "A"; }).length, nA0 = N.value;
      var x1 = Math.max(60, tt * 1.05), ax = S.draw.axes(g, {x0: 0, x1: x1, y0: 0, y1: nA0, xl: "t (s)", l: 40, t: 20});
      S.draw.text(g, "nombre de A restants", 46, 10, {size: 12, align: "left", color: pal.grey});
      for (var i = 1; i < hist.length; i++) S.draw.line(g, ax.X(hist[i - 1][0]), ax.Y(hist[i - 1][1]), ax.X(hist[i][0]), ax.Y(hist[i][1]), pal.acc, 2.4);
      var tot = ev.length, ef = ev.filter(function(e){ return e.eff; }).length, win = Math.min(5, Math.max(tt, 0.1));
      var th = Math.exp(-Ea.value * (cat.value ? 0.6 : 1) / (T.value / 300));
      ro.set(0, S.fmt(tot / win, 1) + " /s"); ro.set(1, S.fmt(ef / win, 2) + " /s"); ro.set(2, tot ? S.fmt(ef / tot * 100, 0) + " %" : "—"); ro.set(3, S.fmt(th * 100, 1) + " %"); ro.set(4, nA + " sur " + nA0);
      nt.set(nA === 0 ? "Tous les réactifs ont réagi. Relance et change un paramètre." : "La part théorique de chocs efficaces est e^(−Eₐ/kT) : elle dépend de T et de Eₐ, pas du nombre de particules (qui ne change que la fréquence des chocs).", "");
    });
    init();
  }
});

SFA.sim({
  id: "c5-c07-effervescent", ch: "c07", tag: "Classique",
  titre: "Le comprimé effervescent : surface de contact et température",
  resume: "Coupe le comprimé en morceaux, chauffe l'eau : en combien de temps disparaît-il ?",
  but: "Choisis combien de coupes (par arête) tu fais dans le comprimé et la température de l'eau. Lis le temps de disparition. Relève le défi : moins de 5 s.",
  aRetenir: "Une réaction entre un solide et un liquide a lieu à la surface du solide : plus la surface de contact est grande (poudre, petits morceaux), plus la réaction est rapide. Couper un cube en n×n×n petits cubes multiplie la surface totale par n. La température, elle, accélère la réaction : ordre de grandeur, × 2 environ par 10 K.",
  piege: "Couper en morceaux ne change pas la quantité de gaz produit au total : seulement le temps nécessaire. La règle « × 2 pour 10 K » est empirique (vraie pour beaucoup de réactions à température ordinaire, pas une loi exacte). Le temps de référence (60 s) est une valeur choisie pour la simulation.",
  build: function(k, S){
    var pal = S.draw.palette, T0 = 60;
    var c = k.canvas(220), g = k.canvas(190);
    var n = k.slider("Coupes par arête n (n³ morceaux)", 1, 10, 1, 1, "");
    var T = k.slider("Température de l'eau", 5, 80, 1, 20, "°C");
    var ro = k.readouts(["Nombre de morceaux n³", "Surface totale", "Facteur de température", "Temps de disparition"]);
    var nt = k.note("", "");
    var tm = 0, lp = k.loop(function(dt, t){ tm = t; k.redraw(); }); lp.play();
    function tEnd(nn, TT){ return T0 / (nn * Math.pow(2, (TT - 20) / 10)); }
    k.draw(function(){
      c.clear(); g.clear();
      var te = tEnd(n.value, T.value), fT = Math.pow(2, (T.value - 20) / 10), ctx = c.ctx;
      var bx = 20, bw = c.W - 40;
      ctx.fillStyle = "#e3f0fa"; ctx.fillRect(bx, 40, bw, 170); ctx.strokeStyle = pal.ink; ctx.lineWidth = 2.5; ctx.strokeRect(bx, 40, bw, 170);
      /* progression en boucle de 6 s */
      var p = (tm % 6) / 6, rem = Math.pow(Math.max(0, 1 - p), 3), side = 70 * Math.pow(rem, 1 / 3), nn = n.value, each = side / nn;
      var ox = c.W / 2 - side / 2, oy = 150 - side / 2;
      for (var i = 0; i < nn; i++) for (var j = 0; j < nn; j++){
        var gap = nn > 1 ? 2 : 0; ctx.fillStyle = "#f4f0e6"; ctx.strokeStyle = pal.amber; ctx.lineWidth = 1;
        ctx.fillRect(ox + i * each + gap / 2, oy + j * each + gap / 2, Math.max(0, each - gap), Math.max(0, each - gap));
        ctx.strokeRect(ox + i * each + gap / 2, oy + j * each + gap / 2, Math.max(0, each - gap), Math.max(0, each - gap)); }
      var nb = Math.min(50, Math.round(6 * n.value * fT / 3));
      for (var b = 0; b < nb; b++){ var ph = (tm * (0.8 + (b % 5) * 0.2) + b * 0.37) % 1, bxp = bx + 14 + ((b * 53) % 100) / 100 * (bw - 28), byp = 190 - ph * 140; if (rem > 0.02) S.draw.dot(c, bxp, byp, 2.5 + (b % 3), "rgba(80,120,200,.5)"); }
      S.draw.text(c, "animation : 6 s ↔ disparition complète", c.W / 2, 18, {size: 12, color: pal.grey});
      var xmax = 70, ax = S.draw.axes(g, {x0: 0, x1: xmax, y0: 0, y1: 1, xl: "t (s)", yl: "masse restante", stepX: 10, stepY: 0.25, l: 52});
      S.draw.fn(g, ax, function(t){ return Math.pow(Math.max(0, 1 - t / T0), 3); }, pal.grey, 1.8, [5, 4]);
      S.draw.fn(g, ax, function(t){ return Math.pow(Math.max(0, 1 - t / te), 3); }, pal.acc, 2.8);
      S.draw.text(g, "pointillés : n = 1, 20 °C (60 s)", ax.X(xmax) - 4, ax.Y(0.8), {size: 12, color: pal.grey, align: "right"});
      S.draw.dot(g, ax.X(Math.min(te, xmax)), ax.Y(0), 6, pal.red);
      ro.set(0, Math.pow(n.value, 3)); ro.set(1, "× " + n.value); ro.set(2, "× " + S.fmt(fT, 2)); ro.set(3, S.fmt(te, te < 10 ? 2 : 1) + " s");
      nt.set(te <= 5 ? "Défi réussi : moins de 5 s. Surface ×" + n.value + " et température ×" + S.fmt(fT, 1) + " se multiplient." : "Défi : fais descendre le temps sous 5 s (agis sur n ET sur T).", te <= 5 ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "c5-c07-profil-catalyseur", ch: "c07", tag: "Graphe",
  titre: "Profil énergétique : ce que fait (et ne fait pas) un catalyseur",
  resume: "Le catalyseur abaisse la barrière sans changer ΔH. Combien de fois plus vite ?",
  but: "Règle Eₐ, ΔH et la température. Active le catalyseur et abaisse la barrière. Compare le facteur d'accélération et vérifie que les niveaux des réactifs et produits n'ont pas bougé.",
  aRetenir: "Un catalyseur offre un autre chemin réactionnel avec une Eₐ plus basse : la réaction va plus vite, dans les deux sens. Il n'est pas consommé, ne change ni ΔH ni les quantités finales. Facteur d'accélération : k_cat/k = e^((Eₐ − Eₐ')/RT).",
  piege: "Le catalyseur ne « donne pas d'énergie » et ne rend pas la réaction plus exothermique : ΔH est identique. Il ne change pas non plus le rendement final. Et une petite baisse de Eₐ a un effet énorme (exponentielle). R = 8,31 J/(mol·K), valeurs arrondies.",
  build: function(k, S){
    var pal = S.draw.palette, R = 8.31;
    var c = k.canvas(280);
    var Ea = k.slider("Eₐ sans catalyseur", 30, 150, 5, 80, "kJ/mol");
    var dH = k.slider("ΔH", -100, 60, 5, -40, "kJ/mol");
    var T = k.slider("Température", 250, 600, 10, 300, "K");
    var cat = k.toggle("Ajouter un catalyseur", true);
    var dEa = k.slider("Abaissement de Eₐ par le catalyseur", 0, 100, 5, 30, "kJ/mol");
    var ro = k.readouts(["Eₐ directe", "Eₐ avec catalyseur", "Part de chocs efficaces e^(−Eₐ/RT)", "Facteur d'accélération", "Pour comparaison : +10 K donne"]);
    var nt = k.note("", "");
    k.draw(function(){
      var e = Math.max(Ea.value, Math.max(0, dH.value) + 10), d = dH.value, dd = cat.value ? Math.min(dEa.value, e - Math.max(0, d) - 5) : 0, e2 = e - dd; c.clear();
      var lo = Math.min(0, d) - 20, hi = e + 25;
      var ax = S.draw.axes(c, {x0: 0, x1: 1, y0: lo, y1: hi, yl: "H (kJ/mol)", stepX: 5, l: 54, b: 24});
      S.draw.fn(c, ax, C5.profile(c, S, {e: e, d: d}), pal.acc, 3);
      if (dd > 0) S.draw.fn(c, ax, C5.profile(c, S, {e: e2, d: d}), pal.green, 3, [7, 5]);
      S.draw.line(c, ax.X(0), ax.Y(0), ax.X(0.3), ax.Y(0), pal.grey, 1.5, [4, 3]); S.draw.line(c, ax.X(0.7), ax.Y(d), ax.X(1), ax.Y(d), pal.grey, 1.5, [4, 3]);
      S.draw.text(c, "réactifs", ax.X(0.02), ax.Y(0) + 12, {size: 12, align: "left", color: pal.grey}); S.draw.text(c, "produits", ax.X(0.98), ax.Y(d) + (d >= 0 ? -12 : 14), {size: 12, align: "right", color: pal.grey});
      S.draw.arrow(c, ax.X(0.2), ax.Y(0), ax.X(0.2), ax.Y(e), pal.acc, 2.4); S.draw.text(c, "Eₐ = " + e, ax.X(0.2) - 6, ax.Y(e / 2), {size: 12, color: pal.acc, align: "right"});
      if (dd > 0){ S.draw.arrow(c, ax.X(0.34), ax.Y(0), ax.X(0.34), ax.Y(e2), pal.green, 2.4); S.draw.text(c, "Eₐ' = " + e2, ax.X(0.34) + 6, ax.Y(e2 / 2) + 6, {size: 12, color: pal.green, align: "left"}); }
      var frac = Math.exp(-(cat.value ? e2 : e) * 1000 / (R * T.value)), acc = dd > 0 ? Math.exp(dd * 1000 / (R * T.value)) : 1, f10 = Math.exp(e * 1000 / R * (1 / T.value - 1 / (T.value + 10)));
      ro.set(0, e + " kJ/mol"); ro.set(1, dd > 0 ? e2 + " kJ/mol" : "—"); ro.set(2, S.sci(frac)); ro.set(3, dd > 0 ? "× " + S.sci(acc) : "× 1 (pas de catalyseur)"); ro.set(4, "× " + S.fmt(f10, 2) + " (sans catalyseur)");
      nt.set(dd > 0 ? "ΔH reste " + d + " kJ/mol : le catalyseur ne change que la hauteur de la barrière (vitesse), pas l'écart entre réactifs et produits." : "Sans catalyseur : seul un chauffage (ou plus de concentration) accélère la réaction.", dd > 0 ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "c5-c07-horloge-iode", ch: "c07", tag: "Niche utile",
  titre: "L'horloge à iode : le virage qui arrive d'un coup",
  resume: "Un mélange incolore devient bleu-noir soudainement : le délai dépend de la vitesse.",
  but: "Choisis les concentrations et la température, lance l'horloge et attends le virage. Double [I⁻] : le délai est-il divisé par 2 ? Relève le défi : un virage en 30 s (± 3 s).",
  aRetenir: "S₂O₈²⁻ + 2 I⁻ → 2 SO₄²⁻ + I₂ produit I₂ à vitesse v = k[S₂O₈²⁻][I⁻]. Tant qu'il reste du thiosulfate, I₂ est détruit aussitôt : rien ne se voit. Quand tout le thiosulfate est consommé, I₂ s'accumule et colore l'amidon. Délai t = [S₂O₃²⁻] / (2v) : il est inversement proportionnel à la vitesse.",
  piege: "L'instant du virage n'est pas la fin de la réaction : celle-ci a commencé dès le premier instant, mais elle était « cachée » par le thiosulfate. Le modèle suppose une vitesse constante pendant le délai et une règle « × 2 par 10 K » pour k (k(25 °C) = 5·10⁻³ L/(mol·s), valeur de la simulation).",
  build: function(k, S){
    var pal = S.draw.palette, K25 = 5e-3;
    var c = k.canvas(180), g = k.canvas(190);
    var s2 = k.slider("[S₂O₈²⁻] dans le mélange", 0.02, 0.10, 0.01, 0.04, "mol/L");
    var iod = k.slider("[I⁻] dans le mélange", 0.02, 0.20, 0.01, 0.08, "mol/L");
    var thio = k.slider("[S₂O₃²⁻] (thiosulfate)", 0.001, 0.005, 0.001, 0.002, "mol/L");
    var T = k.slider("Température", 5, 50, 1, 25, "°C");
    var clk = 0, running = false;
    k.button("Lancer l'horloge", function(){ clk = 0; running = true; }, true);
    k.button("Défi : virage à 30 s", function(){ s2.set(0.04); iod.set(0.08); thio.set(0.001); T.set(25); defi = true; });
    var defi = false;
    var ro = k.readouts(["Vitesse de formation de I₂", "Délai avant virage", "Horloge"]);
    var nt = k.note("", "");
    function par(){ var kk = K25 * Math.pow(2, (T.value - 25) / 10), v = kk * s2.value * iod.value, td = thio.value / (2 * v); return {k: kk, v: v, td: td}; }
    var lp = k.loop(function(dt){ if (running){ var P = par(); clk += dt * Math.max(1, P.td / 8); if (clk > P.td * 1.5){ running = false; clk = P.td * 1.5; } k.redraw(); } });
    lp.play();
    k.draw(function(){
      var P = par(), td = P.td; c.clear(); g.clear();
      var blue = clk >= td, ctx = c.ctx, bx = c.W / 2 - 70;
      var inten = blue ? Math.min(1, (clk - td) / (td * 0.3) + 0.35) : 0;
      ctx.fillStyle = blue ? "rgba(" + Math.round(40 - 30 * inten) + "," + Math.round(40 - 30 * inten) + "," + Math.round(120 - 60 * inten) + "," + (0.35 + 0.6 * inten) + ")" : "#eef6fb";
      ctx.beginPath(); ctx.moveTo(bx, 20); ctx.lineTo(bx + 8, 160); ctx.lineTo(bx + 132, 160); ctx.lineTo(bx + 140, 20); ctx.closePath(); ctx.fill(); ctx.strokeStyle = pal.ink; ctx.lineWidth = 2.5; ctx.stroke();
      S.draw.text(c, blue ? "bleu-noir !" : clk > 0 ? "incolore…" : "prêt", c.W / 2, 90, {size: 16, color: blue ? "#fff" : pal.grey});
      S.draw.text(c, "t = " + S.fmt(clk, 0) + " s", c.W - 10, 14, {size: 13, align: "right"});
      var xmax = td * 1.6, ax = S.draw.axes(g, {x0: 0, x1: xmax, y0: 0, y1: P.v * td * 1.6 * 1000 + 1e-9, xl: "t (s)", l: 50});
      S.draw.text(g, "[I₂] en mmol/L", 54, 10, {size: 12, align: "left", color: pal.grey});
      S.draw.fn(g, ax, function(t){ return P.v * t * 1000; }, pal.grey, 1.8, [5, 4]);
      S.draw.fn(g, ax, function(t){ return Math.max(0, P.v * t - thio.value / 2) * 1000; }, pal.acc, 3);
      S.draw.line(g, ax.X(td), ax.T, ax.X(td), ax.B, pal.red, 1.5, [4, 4]); S.draw.text(g, "virage", ax.X(td) + 4, ax.B - 12, {size: 12, color: pal.red, align: "left"});
      S.draw.text(g, "I₂ formé (total)", ax.X(xmax) - 4, ax.Y(P.v * xmax * 1000) + 12, {size: 12, color: pal.grey, align: "right"}); S.draw.text(g, "I₂ libre", ax.X(xmax) - 4, ax.Y(Math.max(0, P.v * xmax - thio.value / 2) * 1000) + 24, {size: 12, color: pal.acc, align: "right"});
      ro.set(0, S.sci(P.v) + " mol/(L·s)"); ro.set(1, S.fmt(td, td < 10 ? 1 : 0) + " s"); ro.set(2, running ? "en cours (accéléré)" : blue ? "terminé" : "non lancée");
      var okd = Math.abs(td - 30) <= 3;
      nt.set(defi ? (okd ? "Défi réussi : délai = " + S.fmt(td, 1) + " s." : "Défi : ajuste les concentrations pour un délai de 30 s ± 3 s (actuellement " + S.fmt(td, 1) + " s). Pense : délai ∝ [S₂O₃²⁻] / ([S₂O₈²⁻][I⁻]).") : "Si [I⁻] ou [S₂O₈²⁻] double, la vitesse double et le délai est divisé par 2 ; plus de thiosulfate retarde le virage.", okd && defi ? "ok" : "");
    });
  }
});
