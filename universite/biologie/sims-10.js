/* Biologie BA1 · chapitre 10 : populations (évolution, génétique des populations, écologie) */
(function(){
function erfc(x){ var z = Math.abs(x), t = 1 / (1 + 0.5 * z); var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; }
function rng(seed){ var a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* 1. Hardy-Weinberg */
SFA.sim({
  id:"ub-c10-hardy-weinberg", ch:"c10", tag:"Génétique des populations",
  titre:"Hardy-Weinberg : porteurs, incidence et test d'équilibre",
  resume:"De l'incidence d'une maladie récessive à la fréquence des porteurs ; test χ² d'équilibre.",
  but:"Prédis les fréquences génotypiques à partir de q ou de l'incidence, puis teste un échantillon observé contre l'équilibre.",
  aRetenir:"À l'équilibre (population grande, panmixie, sans mutation, migration ni sélection) : p + q = 1 ; fréquences AA = p², Aa = 2pq, aa = q². Incidence q² → q = √incidence. Les porteurs sont bien plus nombreux que les malades : rapport 2pq / q² = 2p/q. Mucoviscidose (incidence ≈ 1/2 500) : q = 0,02, porteurs 2pq ≈ 3,9 % (≈ 1 sur 25,5). Test d'équilibre : χ² sur 3 classes avec 1 degré de liberté (3 classes − 1 − 1 paramètre estimé), seuil à 5 % = 3,84.",
  piege:"Ne pas confondre q (fréquence de l'allèle) et q² (fréquence des malades). Les attendus se calculent avec les fréquences alléliques estimées sur l'échantillon, d'où 1 seul degré de liberté. L'équilibre n'est pas une preuve d'absence de sélection : il est atteint en une génération de panmixie.",
  build:function(k,S){
    var c = k.canvas(290), pal = S.draw.palette;
    var mode = k.seg("Prédiction à partir de", [["q","q"],["i","L'incidence 1/N"]], "i");
    var qs = k.slider("q (si choisi)", 0.005, 0.5, 0.005, 0.02, "");
    var ns = k.slider("Incidence : 1 sur N", 100, 10000, 100, 2500, "");
    var a1 = k.slider("Échantillon : AA", 0, 1000, 10, 640, "");
    var a2 = k.slider("Échantillon : Aa", 0, 1000, 10, 310, "");
    var a3 = k.slider("Échantillon : aa", 0, 1000, 10, 50, "");
    var ro = k.readouts(["q","Porteurs 2pq","Porteurs / malades","χ² (échantillon)","p"]);
    var note = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var q = mode.value === "q" ? qs.value : Math.sqrt(1 / ns.value), p = 1 - q, f = [p * p, 2 * p * q, q * q], ctx = c.ctx, pal2 = [pal.green, pal.amber, pal.red], nm = ["AA","Aa (porteurs)","aa (malades)"];
      S.draw.text(c, "Équilibre prédit", 20, 18, {align:"left", size:12, weight:600});
      f.forEach(function(v, i){ var y = 36 + i * 28; ctx.fillStyle = "#e3e7ed"; ctx.fillRect(110, y, c.W - 190, 18); ctx.fillStyle = pal2[i]; ctx.fillRect(110, y, Math.max(1, v * (c.W - 190)), 18);
        S.draw.text(c, nm[i], 14, y + 9, {align:"left", size:11}); S.draw.text(c, S.fmt(v * 100, 2) + " %", c.W - 76, y + 9, {align:"left", size:11}); });
      var n = a1.value + a2.value + a3.value, chi = NaN, pv = NaN;
      S.draw.text(c, "Échantillon observé (attendus avec p̂ estimé)", 20, 140, {align:"left", size:12, weight:600});
      if (n > 0){
        var ph = (2 * a1.value + a2.value) / (2 * n), qh = 1 - ph, ex = [ph * ph * n, 2 * ph * qh * n, qh * qh * n], ob = [a1.value, a2.value, a3.value], i;
        chi = 0; for (i = 0; i < 3; i++) if (ex[i] > 0) chi += Math.pow(ob[i] - ex[i], 2) / ex[i];
        pv = erfc(Math.sqrt(chi / 2));
        var mx = Math.max.apply(null, ob.concat(ex)) * 1.1 || 1, bw = (c.W - 60) / 3;
        for (i = 0; i < 3; i++){ var x = 30 + i * bw, h1 = ob[i] / mx * 90, h2 = ex[i] / mx * 90;
          ctx.fillStyle = pal.acc; ctx.fillRect(x + 6, 250 - h1, bw / 2 - 10, h1); ctx.fillStyle = "#cfd6e0"; ctx.fillRect(x + bw / 2 - 2, 250 - h2, bw / 2 - 10, h2);
          S.draw.text(c, nm[i].split(" ")[0], x + bw / 2 - 2, 266, {size:11}); S.draw.text(c, ob[i] + "", x + bw / 4 + 1, 250 - h1 - 8, {size:10, color:pal.acc}); S.draw.text(c, S.fmt(ex[i], 0), x + 3 * bw / 4 - 7, 250 - h2 - 8, {size:10, color:pal.grey}); }
      }
      ro.set(0, S.fmt(q, 4)); ro.set(1, S.fmt(2 * p * q * 100, 2) + " % (1/" + S.fmt(1 / (2 * p * q), 1) + ")"); ro.set(2, S.fmt(2 * p / q, 1));
      ro.set(3, isNaN(chi) ? "—" : S.fmt(chi, 2)); ro.set(4, isNaN(pv) ? "—" : (pv < 0.001 ? "&lt; 0,001" : S.fmt(pv, 3)));
      note.set(isNaN(chi) ? "Choisis un échantillon non vide." : chi > 3.841 ? "χ² &gt; 3,84 (1 ddl) : écart significatif à l'équilibre (p &lt; 0,05)." : "χ² ≤ 3,84 : échantillon compatible avec l'équilibre de Hardy-Weinberg.", chi > 3.841 ? "warn" : "ok");
    });
  }
});

/* 2. Dérive génétique */
SFA.sim({
  id:"ub-c10-derive", ch:"c10", tag:"Dérive",
  titre:"Dérive génétique : le hasard dans les petites populations",
  resume:"20 populations simulées : fixation, perte d'allèle, goulot d'étranglement.",
  but:"Fais varier l'effectif et la fréquence initiale ; ajoute un goulot et compte les populations où l'allèle se fixe ou disparaît.",
  aRetenir:"Dérive : variation aléatoire des fréquences alléliques due à l'échantillonnage des gamètes, d'autant plus forte que l'effectif N est petit (variance ≈ p(1−p)/2N par génération). Sans sélection, la probabilité de fixation d'un allèle égale sa fréquence initiale ; l'hétérozygotie décroît comme H<sub>t</sub> = H<sub>0</sub>(1 − 1/2N)<sup>t</sup>. Effet fondateur et goulot d'étranglement : réduction brutale et aléatoire de la diversité.",
  piege:"La dérive ne favorise pas l'allèle « le plus adapté » : elle est aveugle. Ce n'est pas de la sélection. Des populations identiques au départ divergent. Modèle de Wright-Fisher simplifié : effectif constant (sauf goulot), générations séparées, pas de sélection ni de mutation.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette, seed = 4242;
    var N = k.slider("Effectif N (individus diploïdes)", 5, 300, 5, 50, "");
    var p0 = k.slider("Fréquence initiale p₀", 0.1, 0.9, 0.05, 0.5, "");
    var gob = k.toggle("Goulot d'étranglement (générations 40 à 50 : N = 5)", false);
    k.button("Nouveau tirage", function(){ seed += 1013; }, true);
    var ro = k.readouts(["Fixées (p = 1)","Perdues (p = 0)","H observée moyenne","H théorique (sans goulot)"]);
    k.draw(function(){
      c.clear();
      var G = 100, R = 20, rnd = rng(seed + N.value * 7 + Math.round(p0.value * 100)), runs = [], r, g, i, fix = 0, lost = 0, hsum = 0;
      for (r = 0; r < R; r++){
        var p = p0.value, tr = [p];
        for (g = 1; g <= G; g++){ var n2 = 2 * ((gob.value && g >= 40 && g < 50) ? 5 : N.value), cnt = 0; if (p > 0 && p < 1){ for (i = 0; i < n2; i++) if (rnd() < p) cnt++; p = cnt / n2; } tr.push(p); }
        runs.push(tr); if (p >= 1) fix++; else if (p <= 0) lost++; hsum += 2 * p * (1 - p);
      }
      var ax = S.draw.axes(c, {x0:0, x1:G, y0:0, y1:1, xl:"générations", yl:"p", stepX:20, stepY:0.25});
      var cols = [pal.acc, pal.red, pal.green, pal.violet, pal.amber, pal.teal];
      runs.forEach(function(tr, j){ c.ctx.save(); c.ctx.strokeStyle = cols[j % 6]; c.ctx.globalAlpha = 0.75; c.ctx.lineWidth = 1.6; c.ctx.beginPath(); tr.forEach(function(v, t){ if (t === 0) c.ctx.moveTo(ax.X(t), ax.Y(v)); else c.ctx.lineTo(ax.X(t), ax.Y(v)); }); c.ctx.stroke(); c.ctx.restore(); });
      if (gob.value){ c.ctx.fillStyle = "rgba(180,35,24,.08)"; c.ctx.fillRect(ax.X(40), ax.T, ax.X(50) - ax.X(40), ax.B - ax.T); }
      ro.set(0, fix + " / " + R); ro.set(1, lost + " / " + R); ro.set(2, S.fmt(hsum / R, 3)); ro.set(3, S.fmt(2 * p0.value * (1 - p0.value) * Math.pow(1 - 1 / (2 * N.value), G), 3));
    });
  }
});

/* 3. Sélection naturelle */
SFA.sim({
  id:"ub-c10-selection", ch:"c10", tag:"Sélection",
  titre:"Sélection naturelle : avantage de l'hétérozygote",
  resume:"Évolution de p selon les valeurs sélectives ; drépanocytose et paludisme.",
  but:"Règle les valeurs sélectives des trois génotypes, suis p génération après génération et compare à l'équilibre prévu.",
  aRetenir:"Valeur sélective (fitness) w : survie et reproduction relatives. p' = (p²·w<sub>AA</sub> + p·q·w<sub>Aa</sub>) / w̄ avec w̄ = p²w<sub>AA</sub> + 2pq·w<sub>Aa</sub> + q²w<sub>aa</sub>. Si w<sub>Aa</sub> est supérieur aux deux homozygotes, un équilibre stable polymorphe existe : p̂ = (w<sub>Aa</sub> − w<sub>aa</sub>) / (2w<sub>Aa</sub> − w<sub>AA</sub> − w<sub>aa</sub>). Drépanocytose : l'hétérozygote HbAS est protégé du paludisme grave, l'homozygote SS est très défavorisé : l'allèle S se maintient dans les régions impaludées.",
  piege:"Contre un allèle récessif létal (w<sub>aa</sub> = 0), la fréquence de a diminue lentement quand a est rare (les hétérozygotes l'abritent) : q<sub>t</sub> = q₀ / (1 + t·q₀). Les valeurs de w de la drépanocytose sont des exemples pédagogiques ordre de grandeur, variables selon l'environnement.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette;
    var wA, wH, wa, p0, gens;
    var pre = k.select("Situation type", [["c","Personnalisée"],["s","Drépanocytose en zone impaludée (HbA = A, HbS = a)"],["l","Contre un allèle récessif létal"],["d","Avantage de l'allèle dominant A"],["n","Neutre (dérive absente)"]], "s", function(v){
      var P = {s:[0.85,1,0.2], l:[1,1,0], d:[1,1,0.7], n:[1,1,1]}[v];
      if (P){ wA.set(P[0]); wH.set(P[1]); wa.set(P[2]); }
    });
    wA = k.slider("w(AA)", 0, 1, 0.05, 0.85, "");
    wH = k.slider("w(Aa)", 0, 1, 0.05, 1, "");
    wa = k.slider("w(aa)", 0, 1, 0.05, 0.2, "");
    p0 = k.slider("p₀ (fréquence de A)", 0.01, 0.99, 0.01, 0.9, "");
    gens = k.slider("Générations", 10, 200, 10, 100, "");
    var ro = k.readouts(["p final","p̂ d'équilibre","w̄ final","Régime"]);
    k.draw(function(){
      c.clear();
      var p = p0.value, tr = [p], g, wb;
      for (g = 0; g < gens.value; g++){ var q = 1 - p; wb = p * p * wA.value + 2 * p * q * wH.value + q * q * wa.value; if (wb > 0) p = (p * p * wA.value + p * q * wH.value) / wb; tr.push(p); }
      var q2 = 1 - p; wb = p * p * wA.value + 2 * p * q2 * wH.value + q2 * q2 * wa.value;
      var ax = S.draw.axes(c, {x0:0, x1:gens.value, y0:0, y1:1, xl:"générations", yl:"p(A)", stepX:gens.value > 100 ? 50 : 20, stepY:0.25});
      S.draw.fn(c, ax, function(x){ var i = Math.min(tr.length - 1, Math.round(x)); return tr[i]; }, pal.acc, 2.6);
      var den = 2 * wH.value - wA.value - wa.value, ph = NaN, regime;
      if (wH.value > wA.value && wH.value > wa.value){ ph = (wH.value - wa.value) / den; regime = "Avantage de l'hétérozygote : polymorphisme stable"; }
      else if (wH.value < wA.value && wH.value < wa.value){ ph = (wH.value - wa.value) / den; regime = "Désavantage de l'hétérozygote : équilibre instable"; }
      else if (wA.value === wH.value && wH.value === wa.value) regime = "Neutre";
      else regime = (wA.value >= wa.value) ? "Sélection directionnelle : A tend à se fixer" : "Sélection directionnelle : a tend à se fixer";
      if (!isNaN(ph) && ph >= 0 && ph <= 1) S.draw.line(c, ax.L, ax.Y(ph), ax.R, ax.Y(ph), pal.red, 1.5, [5, 4]);
      ro.set(0, S.fmt(p, 3)); ro.set(1, isNaN(ph) ? "—" : S.fmt(ph, 3)); ro.set(2, S.fmt(wb, 3)); ro.set(3, regime);
    });
  }
});

/* 4. Croissance de population */
SFA.sim({
  id:"ub-c10-logistique", ch:"c10", tag:"Écologie",
  titre:"Croissance exponentielle et logistique ; instabilité du modèle discret",
  resume:"Capacité de charge K, taux r, point d'inflexion, cycles et chaos du modèle de Ricker.",
  but:"Compare la croissance exponentielle à la logistique, puis passe au modèle discret et augmente r pour voir apparaître des oscillations.",
  aRetenir:"Exponentielle : dN/dt = rN. Logistique : dN/dt = rN(1 − N/K), N(t) = K / (1 + ((K − N₀)/N₀)·e<sup>−rt</sup>). Vitesse maximale rK/4 pour N = K/2 (point d'inflexion). Modèle discret de Ricker N<sub>t+1</sub> = N<sub>t</sub>·e<sup>r(1−N<sub>t</sub>/K)</sup> : équilibre stable si r &lt; 2, cycles de période 2 puis 4 au-delà, comportement chaotique vers r ≈ 2,7.",
  piege:"K n'est pas un maximum « absolu » : c'est l'équilibre dépendant des ressources. Le taux r de croissance par individu diminue avec la densité (rétroaction négative), la population totale accélère puis ralentit. Dans le modèle discret, un grand r déstabilise : la population dépasse K puis s'effondre.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette;
    var mode = k.seg("Modèle", [["c","Continu (logistique)"],["d","Discret (Ricker)"]], "c");
    var r = k.slider("r", 0.1, 3, 0.05, 0.5, "");
    var K = k.slider("K", 100, 1000, 50, 500, "");
    var n0 = k.slider("N₀", 1, 200, 1, 10, "");
    var T = k.slider("Durée", 20, 100, 10, 40, "");
    var ro = k.readouts(["Vitesse max rK/4","N = K/2 atteint à","Temps de doublement initial","Comportement"]);
    k.draw(function(){
      c.clear();
      var ymax = Math.max(K.value * 1.6, 200), ax = S.draw.axes(c, {x0:0, x1:T.value, y0:0, y1:ymax, xl:"t", yl:"N", stepX:T.value > 50 ? 20 : 10});
      var N0 = Math.min(n0.value, K.value * 1.5), beh = "";
      S.draw.line(c, ax.L, ax.Y(K.value), ax.R, ax.Y(K.value), pal.grey, 1.5, [5, 4]); S.draw.text(c, "K", ax.L + 8, ax.Y(K.value) - 9, {size:12, color:pal.grey});
      if (mode.value === "c"){
        S.draw.fn(c, ax, function(t){ return N0 * Math.exp(r.value * t); }, pal.red, 1.8, [4, 4]);
        S.draw.fn(c, ax, function(t){ return K.value / (1 + (K.value - N0) / N0 * Math.exp(-r.value * t)); }, pal.acc, 2.6);
        beh = "Convergence vers K";
      } else {
        var N = N0, ctx = c.ctx, mn = 1e9, mxv = 0; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = pal.acc; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(N));
        for (var t = 1; t <= T.value; t++){ N = N * Math.exp(r.value * (1 - N / K.value)); ctx.lineTo(ax.X(t), ax.Y(N)); if (t > T.value / 2){ mn = Math.min(mn, N); mxv = Math.max(mxv, N); } }
        ctx.stroke(); ctx.fillStyle = pal.acc; N = N0; for (t = 0; t <= T.value; t++){ ctx.beginPath(); ctx.arc(ax.X(t), ax.Y(N), 2.6, 0, 6.3); ctx.fill(); N = N * Math.exp(r.value * (1 - N / K.value)); } ctx.restore();
        beh = r.value < 2 ? "Équilibre stable" : r.value < 2.52 ? "Cycle de période 2" : r.value < 2.69 ? "Cycles de période ≥ 4" : "Chaotique";
      }
      var inf = N0 < K.value / 2 ? Math.log((K.value - N0) / N0) / r.value : 0;
      ro.set(0, S.fmt(r.value * K.value / 4, 1) + " ind./unité"); ro.set(1, N0 < K.value / 2 ? "t = " + S.fmt(inf, 1) : "déjà dépassé"); ro.set(2, S.fmt(Math.LN2 / r.value, 2)); ro.set(3, beh);
    });
  }
});

/* 5. Lotka-Volterra */
SFA.sim({
  id:"ub-c10-lotka-volterra", ch:"c10", tag:"Dynamique",
  titre:"Proies et prédateurs : oscillations de Lotka-Volterra",
  resume:"Deux populations couplées : cycles, équilibre, effet d'une capacité de charge des proies.",
  but:"Modifie les taux, les effectifs de départ et ajoute (ou non) une capacité de charge des proies ; compare la série temporelle et le portrait de phase.",
  aRetenir:"dx/dt = αx − βxy (proies x), dy/dt = δxy − γy (prédateurs y). Équilibre : x* = γ/δ, y* = α/β. Autour de l'équilibre, la période est ≈ 2π/√(αγ). Le pic des prédateurs suit celui des proies (décalage ≈ 1/4 de période). Avec une capacité de charge K pour les proies, les oscillations s'amortissent vers l'équilibre.",
  piege:"Les oscillations de la version de base sont neutres (l'amplitude dépend des conditions de départ) : modèle idéal, sans capacité de charge ni refuge ni stochasticité. Dans une vraie population, de petits effectifs mènent à l'extinction. Les prédateurs ne « causent » pas seuls les cycles : le modèle montre une rétroaction négative couplée.",
  build:function(k,S){
    var c1 = k.canvas(200), c2 = k.canvas(200), pal = S.draw.palette;
    var al = k.slider("α (croissance des proies)", 0.2, 1.2, 0.05, 0.6, "");
    var be = k.slider("β (prédation)", 0.01, 0.05, 0.005, 0.025, "");
    var ga = k.slider("γ (mortalité des prédateurs)", 0.2, 1, 0.05, 0.5, "");
    var de = k.slider("δ (conversion)", 0.005, 0.02, 0.001, 0.01, "");
    var x0 = k.slider("Proies initiales", 10, 100, 5, 40, "");
    var y0 = k.slider("Prédateurs initiaux", 5, 60, 5, 15, "");
    var kk = k.toggle("Proies : capacité de charge K", false);
    var Ks = k.slider("K", 60, 400, 10, 150, "");
    var ro = k.readouts(["Équilibre proies x*","Équilibre prédateurs y*","Période ≈ 2π/√(αγ)","Max proies"]);
    k.draw(function(){
      c1.clear(); c2.clear();
      var dt = 0.02, T = 60, steps = T / dt, x = x0.value, y = y0.value, X = [x], Y = [y], i, useK = kk.value, K = Ks.value;
      function f(x, y){ return [al.value * x * (useK ? (1 - x / K) : 1) - be.value * x * y, de.value * x * y - ga.value * y]; }
      for (i = 0; i < steps; i++){
        var a = f(x, y), b = f(x + dt / 2 * a[0], y + dt / 2 * a[1]), cc = f(x + dt / 2 * b[0], y + dt / 2 * b[1]), d = f(x + dt * cc[0], y + dt * cc[1]);
        x += dt / 6 * (a[0] + 2 * b[0] + 2 * cc[0] + d[0]); y += dt / 6 * (a[1] + 2 * b[1] + 2 * cc[1] + d[1]); x = Math.max(x, 1e-6); y = Math.max(y, 1e-6);
        if (i % 5 === 4){ X.push(x); Y.push(y); }
      }
      var mx = Math.max.apply(null, X), my = Math.max.apply(null, Y), top = Math.max(mx, my) * 1.1;
      var ax = S.draw.axes(c1, {x0:0, x1:T, y0:0, y1:top, xl:"t", yl:"effectifs", stepX:10, t:14, b:28});
      var ctx = c1.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      [[X, pal.green], [Y, pal.red]].forEach(function(s){ ctx.strokeStyle = s[1]; ctx.lineWidth = 2; ctx.beginPath(); s[0].forEach(function(v, j){ var t = j * 5 * dt; if (j === 0) ctx.moveTo(ax.X(t), ax.Y(v)); else ctx.lineTo(ax.X(t), ax.Y(v)); }); ctx.stroke(); }); ctx.restore();
      S.draw.text(c1, "proies", ax.R - 50, ax.T + 8, {size:11, color:pal.green}); S.draw.text(c1, "prédateurs", ax.R - 50, ax.T + 28, {size:11, color:pal.red});
      var ax2 = S.draw.axes(c2, {x0:0, x1:mx * 1.1, y0:0, y1:my * 1.1, xl:"proies", yl:"prédateurs", t:14, b:28});
      var xs = de.value > 0 ? ga.value / de.value : 0, ys = useK ? al.value * (1 - xs / K) / be.value : al.value / be.value;
      c2.ctx.save(); c2.ctx.beginPath(); c2.ctx.rect(ax2.L, ax2.T, ax2.R - ax2.L, ax2.B - ax2.T); c2.ctx.clip(); c2.ctx.strokeStyle = pal.acc; c2.ctx.lineWidth = 1.8; c2.ctx.beginPath();
      X.forEach(function(v, j){ if (j === 0) c2.ctx.moveTo(ax2.X(v), ax2.Y(Y[j])); else c2.ctx.lineTo(ax2.X(v), ax2.Y(Y[j])); }); c2.ctx.stroke(); c2.ctx.restore();
      if (ys > 0) S.draw.dot(c2, ax2.X(xs), ax2.Y(ys), 5, pal.ink);
      ro.set(0, S.fmt(xs, 1)); ro.set(1, ys > 0 ? S.fmt(ys, 1) : "0 (K ≤ x*)"); ro.set(2, S.fmt(2 * Math.PI / Math.sqrt(al.value * ga.value), 1)); ro.set(3, S.fmt(mx, 0));
    });
  }
});
})();
