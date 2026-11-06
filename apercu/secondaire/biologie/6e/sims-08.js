/* Chapitre 8 · Origine de la vie, classification et diversité */
(function(){
var B = window.B6;

SFA.sim({
  id: "b6-c08-miller", ch: "c08", tag: "Classique",
  titre: "L'expérience de Miller : quelles conditions fabriquent des molécules du vivant ?",
  resume: "Étincelles dans un mélange de gaz simulant l'atmosphère primitive : l'indice de production dépend fortement de la nature des gaz.",
  but: "Choisis les gaz (source de carbone, source d'azote, dihydrogène), l'énergie des étincelles et la durée. Le tube en U se colore à mesure que des molécules organiques s'accumulent ; la liste montre ce qui est détecté. L'indice est un repère relatif (modèle qualitatif), pas un pourcentage réel.",
  aRetenir: "En 1953, Miller a soumis à des étincelles un mélange d'eau, de méthane, d'ammoniac et de dihydrogène : après quelques jours, il a obtenu des acides aminés. Cela montre que des molécules organiques peuvent se former à partir de molécules simples sans intervention du vivant. Les gaz réducteurs (CH₄, NH₃, H₂) donnent bien plus de molécules que le CO₂ et le N₂.",
  piege: "Miller n'a pas créé la vie : il a obtenu des briques (acides aminés), pas une cellule. On pense aujourd'hui que l'atmosphère primitive était moins réductrice que celle de Miller, mais des synthèses analogues sont possibles localement (volcans, fontaines hydrothermales) et des acides aminés existent aussi dans des météorites. Indice de la simulation : valeurs pédagogiques.",
  build: function(k, S){
    var c = k.canvas(420), P = S.draw.palette, flash = 0;
    var cs = k.seg("Source de carbone", [["CH4", "Méthane CH₄"], ["CO2", "Dioxyde de carbone CO₂"]], "CH4");
    var ns = k.seg("Source d'azote", [["NH3", "Ammoniac NH₃"], ["N2", "Diazote N₂"]], "NH3");
    var h2 = k.toggle("Dihydrogène H₂ présent", true);
    var en = k.slider("Énergie des étincelles", 0, 10, 1, 5, "");
    var dj = k.slider("Durée", 0, 14, 1, 7, "jours");
    var lp = k.loop(function(dt, t){ flash = (Math.sin(t * 18) > 0.3) ? 1 : 0; k.redraw(); }); lp.play();
    var ro = k.readouts(["Indice de production (0 à 100)", "Molécules détectées"]);
    var note = k.note("", "");
    function Y(d){ var Cf = cs.value === "CH4" ? 1 : 0.04, Nf = ns.value === "NH3" ? 1 : 0.15, Hf = h2.value ? 1 : 0.4, E = en.value / (en.value + 2) * 1.2; return 100 * Cf * Nf * Hf * Math.min(1, E) * (1 - Math.exp(-d / 4)); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, y = Y(dj.value), W = c.W;
      /* appareil */
      ctx.strokeStyle = "#4b5868"; ctx.lineWidth = 3; ctx.fillStyle = "#f4f8fb";
      var fx = 62, fy = 62; ctx.beginPath(); ctx.arc(fx, fy, 42, 0, 6.2832); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(fx + 40, fy - 18); ctx.lineTo(W - 40, fy - 18); ctx.lineTo(W - 40, 150); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W - 56, 150); ctx.lineTo(W - 56, 150); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(fx, fy + 42); ctx.lineTo(fx, 150); ctx.lineTo(fx + 40, 160); ctx.lineTo(W - 70, 160); ctx.lineTo(W - 70, 150); ctx.stroke();
      /* tube en U coloré */
      var col = "rgba(" + Math.round(190 - y * 1.1) + "," + Math.round(215 - y * 1.4) + "," + Math.round(240 - y * 2.2) + ",.9)"; ctx.fillStyle = col; ctx.fillRect(W - 70, 125, 30, 35);
      ctx.strokeStyle = "#4b5868"; ctx.strokeRect(W - 70, 125, 30, 35);
      S.draw.text(c, "H₂O + gaz", fx, fy, {size: 12}); S.draw.text(c, "piège", W - 55, 176, {size: 12, color: P.grey});
      /* étincelles */
      if (en.value > 0 && flash){ ctx.strokeStyle = P.amber; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(fx - 18, fy - 10); ctx.lineTo(fx - 4, fy - 2); ctx.lineTo(fx - 10, fy + 4); ctx.lineTo(fx + 12, fy + 12); ctx.stroke(); }
      ctx.fillStyle = "#13233a"; ctx.fillRect(fx - 20, fy - 14, 5, 6); ctx.fillRect(fx + 10, fy + 10, 5, 6);
      /* graphique de l'indice dans le temps */
      var ax = S.draw.axes(c, {x0: 0, x1: 14, y0: 0, y1: 100, stepX: 2, stepY: 25, t: 196, b: 32, xl: "jours", yl: "indice", l: 40});
      S.draw.fn(c, ax, Y, P.acc, 2.8); S.draw.dot(c, ax.X(dj.value), ax.Y(y), 6, P.red);
      var th = [[3, "HCN, aldéhydes"], [10, "glycine"], [25, "alanine, autres acides aminés"], [45, "acide aspartique, acide glutamique"]], found = th.filter(function(t){ return y >= t[0]; }).map(function(t){ return t[1]; });
      ro.set(0, S.fmt(y, 0)); ro.set(1, found.length ? found.join(" ; ") : "aucune molécule organique notable");
      note.set(cs.value === "CO2" || ns.value === "N2" ? "Avec un gaz peu réducteur (CO₂ ou N₂), l'indice reste faible : les réactions qui forment les acides aminés sont bien moins efficaces." : y > 0 ? "Mélange réducteur : les étincelles (éclairs) transforment CH₄, NH₃ et H₂ en HCN et aldéhydes, qui réagissent dans l'eau (synthèse de Strecker) pour donner des acides aminés." : "Pas d'énergie ou pas de temps : rien ne se forme.", "");
    });
  }
});

/* ---------- Quel domaine ? ---------- */
var FEAT = [["noyau", "Noyau délimité par une membrane", {B: "non", A: "non", E: "oui"}], ["paroi", "Peptidoglycane dans la paroi", {B: "oui", A: "non", E: "non"}], ["ribo", "Ribosomes", {B: "70S", A: "70S", E: "80S"}], ["lip", "Liaison des lipides de membrane", {B: "ester", A: "éther", E: "ester"}], ["hist", "Histones associées à l'ADN", {B: "non", A: "oui", E: "oui"}], ["adn", "Chromosome", {B: "circulaire", A: "circulaire", E: "linéaires"}], ["mito", "Mitochondries", {B: "non", A: "non", E: "oui"}]];
var DOMN = {B: "Bactéries", A: "Archées", E: "Eucaryotes"};
var MYST = [["B", "Une cellule de 2 µm vivant dans l'intestin, capable de doubler toutes les 20 minutes."], ["A", "Une cellule vivant dans la vase sans oxygène, produisant du méthane."], ["E", "Une cellule de 8 µm qui fait lever la pâte à pain."], ["A", "Une cellule vivant dans un lac saturé de sel."], ["B", "Une cellule en chaînes, qui réalise la photosynthèse."], ["E", "Une cellule de 100 µm qui se déplace en émettant des pseudopodes."]];
SFA.sim({
  id: "b6-c08-domaine", ch: "c08", tag: "Défi",
  titre: "Cellule mystère : bactérie, archée ou eucaryote ?",
  resume: "Révèle les critères un par un, élimine des domaines et identifie la cellule avec le moins d'indices possible.",
  but: "Une cellule mystère est tirée au sort. Révèle ses caractéristiques une à une : le tableau grise les domaines incompatibles. Dès que tu penses savoir, donne ta réponse. Essaie d'utiliser le moins d'indices possible.",
  aRetenir: "Les trois domaines du vivant : Bactéries, Archées (procaryotes sans noyau) et Eucaryotes (cellules à noyau). Les archées ressemblent aux bactéries par l'organisation (pas de noyau, chromosome circulaire) mais aux eucaryotes par certains processus moléculaires (histones, machinerie de lecture de l'ADN). Les critères les plus décisifs : le noyau, la paroi, les ribosomes et les lipides.",
  piege: "Un critère isolé est rarement suffisant : « pas de noyau » ne départage pas bactéries et archées. « Procaryote » n'est pas un groupe de parenté : archées et eucaryotes sont plus proches entre eux que chacun ne l'est des bactéries. Tableau simplifié : il existe des exceptions (par exemple, certaines parois ou membranes atypiques).",
  build: function(k, S){
    var c = k.canvas(410), P = S.draw.palette, seed = 1, shown = [], done = false, msg = "";
    var guess = k.seg("Ma réponse", [["B", "Bactérie"], ["A", "Archée"], ["E", "Eucaryote"]], "", function(v){
      if (done) return; var m = MYST[(seed - 1) % MYST.length]; if (v === m[0]){ done = true; msg = "Bravo : c'est bien " + (v === "E" ? "un " : v === "A" ? "une " : "une ") + DOMN[v].toLowerCase().replace(/s$/, "") + ", trouvée avec " + shown.length + " indice(s)."; ok = true; } else { msg = "Non : " + DOMN[v].toLowerCase() + " est incompatible avec au moins un indice. Révèle un critère de plus ou réfléchis."; ok = false; } });
    var ok = true;
    k.button("Révéler un critère", function(){ if (shown.length < FEAT.length && !done){ var order = FEAT.map(function(f, i){ return i; }), r = B.rng(seed * 31 + 7); for (var i = order.length - 1; i > 0; i--){ var j = Math.floor(r() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; } shown.push(order[shown.length]); } }, true);
    k.button("Nouvelle cellule", function(){ seed++; shown = []; done = false; msg = ""; });
    var ro = k.readouts(["Indices révélés", "Domaines encore possibles"]);
    var note = k.note("", "");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, m = MYST[(seed - 1) % MYST.length], keys = ["B", "A", "E"], i, j;
      var words = m[1].split(" "), line = "", ly = 14, maxc = Math.floor((c.W - 16) / 6.6);
      words.forEach(function(w){ if ((line + " " + w).length > maxc){ S.draw.text(c, line, 8, ly, {align: "left", size: 12, color: P.ink}); ly += 17; line = w; } else line = line ? line + " " + w : w; });
      S.draw.text(c, line, 8, ly, {align: "left", size: 12, color: P.ink});
      var x0 = 6, y0 = 66, cw = (c.W - 12) / 3, rh = 44;
      keys.forEach(function(d, q){ S.draw.text(c, DOMN[d], x0 + cw * (q + 0.5), y0, {size: 12, color: P.acc}); });
      var alive = {B: 1, A: 1, E: 1};
      shown.forEach(function(fi){ keys.forEach(function(d){ if (FEAT[fi][2][d] !== FEAT[fi][2][m[0]]) alive[d] = 0; }); });
      FEAT.forEach(function(f, r){
        var y = y0 + 12 + r * rh, rev = shown.indexOf(r) >= 0; ctx.fillStyle = rev ? "#fff7e0" : "#f3f5f8"; ctx.fillRect(4, y, c.W - 8, rh - 3);
        S.draw.text(c, f[1], 8, y + 10, {align: "left", size: 12, color: rev ? P.ink : P.grey, weight: rev ? 800 : 600});
        keys.forEach(function(d, q){ var match = f[2][d] === f[2][m[0]]; S.draw.text(c, rev ? f[2][d] : "?", x0 + cw * (q + 0.5), y + 28, {size: 13, color: !rev ? "#9aa6b5" : match ? P.green : P.red}); });
      });
      keys.forEach(function(d, q){ if (!alive[d]){ ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(x0 + cw * q + 2, y0 - 12, cw - 4, 14 + FEAT.length * rh); S.draw.text(c, "exclu", x0 + cw * (q + 0.5), y0 + 12 + FEAT.length * rh - 14, {size: 12, color: P.red}); } });
      ro.set(0, shown.length + " / " + FEAT.length); var left = keys.filter(function(d){ return alive[d]; }); ro.set(1, left.map(function(d){ return DOMN[d]; }).join(", "));
      note.set(msg || (shown.length === 0 ? "Appuie sur « Révéler un critère »." : left.length === 1 ? "Un seul domaine reste possible : tu peux répondre." : left.length + " domaines restent possibles : continue."), done ? "ok" : ok ? "" : "warn");
    });
  }
});

/* ---------- hominisation ---------- */
var HOM = [
  ["Sahelanthropus", 7.0, 360, 7, 6, 0], ["Ardipithecus ramidus", 4.4, 325, 5.8, 4.4, 0], ["A. afarensis", 3.2, 450, 3.9, 2.9, 0], ["A. africanus", 2.5, 460, 3.3, 2.1, 0],
  ["P. boisei", 2.0, 520, 2.3, 1.2, 1], ["H. habilis", 1.9, 610, 2.4, 1.4, 2], ["H. erectus", 1.2, 950, 1.9, 0.1, 2], ["H. naledi", 0.3, 560, 0.335, 0.236, 2],
  ["H. heidelbergensis", 0.4, 1200, 0.7, 0.3, 2], ["H. neanderthalensis", 0.08, 1500, 0.4, 0.04, 2], ["H. floresiensis", 0.06, 420, 0.1, 0.05, 2], ["H. sapiens", 0.01, 1350, 0.3, 0, 2]
];
SFA.sim({
  id: "b6-c08-hominisation", ch: "c08", tag: "Données",
  titre: "Hominisation : volume crânien et buisson des hominidés",
  resume: "Volume crânien en fonction de l'âge, et espèces qui coexistaient : l'évolution humaine n'est pas une file indienne.",
  but: "Chaque point est une espèce d'hominine (valeurs moyennes arrondies, ordres de grandeur). Filtre les genres, touche un point pour lire ses données, active la droite de tendance pour le genre Homo. Le curseur de temps montre combien d'espèces coexistaient.",
  aRetenir: "En moyenne, le volume crânien augmente quand on se rapproche du présent, surtout dans le genre Homo (environ 450 cm³ chez les australopithèques à plus de 1 300 cm³ chez Homo sapiens et Neandertal). Mais à presque toutes les époques, plusieurs espèces d'hominines coexistaient : l'évolution humaine ressemble à un buisson ramifié, pas à une file indienne.",
  piege: "Une droite de tendance résume une tendance moyenne, pas une loi : Homo floresiensis, très récente, avait un petit cerveau ; Neandertal avait un cerveau en moyenne aussi grand que le nôtre. Et l'espèce humaine ne descend pas d'un chimpanzé actuel : humains et chimpanzés ont un ancêtre commun.",
  build: function(k, S){
    var c = k.canvas(470), P = S.draw.palette, pick = null;
    var fl = k.seg("Espèces affichées", [["a", "Toutes"], ["h", "Genre Homo"], ["o", "Autres"]], "a");
    var tr = k.toggle("Droite de tendance (genre Homo)", false);
    var tm = k.slider("Il y a… (temps)", 0, 7, 0.1, 2, "Ma");
    var ro = k.readouts(["Espèce touchée", "Espèces qui coexistaient à cette date", "Pente de la droite (Homo)"]);
    var note = k.note("", ""), pts = [];
    var col = ["#8a95a3", "#b45309", "#1e3f8f"];
    c.pointer(function(t, p){ if (t !== "down") return; var best = null, bd = 400; pts.forEach(function(q){ var d = Math.pow(q.x - p.x, 2) + Math.pow(q.y - p.y, 2); if (d < bd){ bd = d; best = q.i; } }); pick = best; k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx;
      var ax = S.draw.axes(c, {x0: 7.5, x1: -0.3, y0: 200, y1: 1700, stepX: 1, stepY: 300, t: 14, b: 214, yl: "volume crânien (cm³)", l: 54});
      /* axes X inversés : ax.X est correct car x0 > x1 */
      for (var tk = 0; tk <= 7; tk++){ S.draw.line(c, ax.X(tk), ax.T, ax.X(tk), ax.B, "#edf0f4", 1); S.draw.text(c, String(tk), ax.X(tk), ax.B + 12, {size: 12, color: "#5f6b7a", weight: 600}); }
      pts = []; var hx = [], hy = [];
      HOM.forEach(function(h, i){ var show = fl.value === "a" || (fl.value === "h" && h[5] === 2) || (fl.value === "o" && h[5] !== 2); if (h[5] === 2){ hx.push(h[1]); hy.push(h[2]); } if (!show) return; var X = ax.X(h[1]), Y = ax.Y(h[2]); pts.push({x: X, y: Y, i: i}); S.draw.dot(c, X, Y, pick === i ? 8 : 5.5, col[h[5]]); if (pick === i) S.draw.text(c, h[0], Math.min(c.W - 70, Math.max(70, X)), Y - 16, {size: 12, color: P.ink, bg: "rgba(255,255,255,.85)"}); });
      var sl = 0;
      if (tr.value){ var n = hx.length, mx = hx.reduce(function(a, b){ return a + b; }, 0) / n, my = hy.reduce(function(a, b){ return a + b; }, 0) / n, sxy = 0, sxx = 0; for (var i = 0; i < n; i++){ sxy += (hx[i] - mx) * (hy[i] - my); sxx += Math.pow(hx[i] - mx, 2); } sl = sxy / sxx; var b0 = my - sl * mx; S.draw.line(c, ax.X(2.3), ax.Y(b0 + sl * 2.3), ax.X(0), ax.Y(b0), P.red, 2, [6, 4]); }
      S.draw.line(c, ax.X(tm.value), ax.T, ax.X(tm.value), ax.B, P.green, 1.6, [4, 3]);
      /* chronologie des espèces */
      var by = ax.B + 40, rh = 13; S.draw.text(c, "Barres : périodes d'existence (Ma)", c.W / 2, by - 8, {size: 12, color: P.grey});
      var alive = [];
      HOM.forEach(function(h, i){ var y = by + 4 + i * rh, x1 = ax.X(h[3]), x2 = ax.X(Math.max(h[4], 0)); ctx.fillStyle = col[h[5]]; ctx.globalAlpha = 0.85; ctx.fillRect(x1, y, Math.max(3, x2 - x1), rh - 3); ctx.globalAlpha = 1; if (tm.value <= h[3] && tm.value >= h[4]) alive.push(h[0]); });
      S.draw.line(c, ax.X(tm.value), by, ax.X(tm.value), by + 4 + HOM.length * rh, P.green, 1.6, [4, 3]);
      ro.set(0, pick !== null ? HOM[pick][0] + " : ≈ " + HOM[pick][2] + " cm³, ≈ " + (HOM[pick][1] < 0.05 ? "actuel" : S.fmt(HOM[pick][1], HOM[pick][1] < 1 ? 2 : 1) + " Ma") : "Touche un point");
      ro.set(1, alive.length + (alive.length ? " : " + alive.join(", ") : "")); ro.set(2, tr.value ? S.fmt(-sl, 0) + " cm³ de plus par million d'années" : "—");
      note.set(alive.length > 1 ? "À cette date, " + alive.length + " espèces d'hominines coexistaient : un buisson, pas une file." : alive.length === 1 ? "À cette date, une seule espèce de la liste est connue." : "Aucune espèce de la liste n'est connue à cette date.", "");
    });
  }
});

/* ---------- Horloge de la Terre ---------- */
var EV = [["Formation de la Terre", 4.54], ["Premiers océans (≈)", 4.3], ["Premières traces de vie", 3.5], ["Photosynthèse (O₂)", 2.7], ["Oxygène dans l'atmosphère", 2.4], ["Premiers eucaryotes", 1.8], ["Animaux pluricellulaires", 0.57], ["Explosion cambrienne", 0.54], ["Plantes terrestres", 0.47], ["Vertébrés terrestres", 0.37], ["Premiers dinosaures", 0.23], ["Fin des dinosaures non aviens", 0.066], ["Genre Homo", 0.0028], ["Homo sapiens", 0.0003]];
SFA.sim({
  id: "b6-c08-horloge", ch: "c08", tag: "Échelle",
  titre: "L'histoire de la Terre ramenée à une année",
  resume: "4,54 milliards d'années en 365 jours : à quelle date apparaissent les eucaryotes, les dinosaures, l'espèce humaine ?",
  but: "Fais glisser le curseur pour remonter dans le temps : les événements déjà survenus s'allument. Compare l'échelle linéaire (où presque tout est écrasé à la fin) et l'échelle logarithmique (où chaque événement est lisible).",
  aRetenir: "Sur une échelle linéaire ramenée à une année, la vie existe depuis le printemps, mais les animaux pluricellulaires n'apparaissent que vers la mi-novembre, les dinosaures vers la mi-décembre et Homo sapiens environ une demi-heure avant la fin de l'année. L'histoire de la vie est surtout une histoire de micro-organismes. Les dates sont des ordres de grandeur, parfois discutées.",
  piege: "Les dates anciennes sont incertaines (les premiers océans, les premières traces de vie : certains indices sont encore débattus). Et une échelle de temps réduite à une année ne dit pas que l'évolution est « allée vers » l'espèce humaine : elle n'a pas de but.",
  build: function(k, S){
    var c = k.canvas(440), P = S.draw.palette;
    var sc = k.seg("Échelle du temps", [["l", "Linéaire"], ["g", "Logarithmique"]], "l");
    var ag = k.slider("Il y a…", 0, 4.54, 0.01, 4.54, "Ga");
    var ro = k.readouts(["Date dans l'année terrestre", "Événements déjà survenus"]);
    var note = k.note("", "");
    var MON = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"], ML = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function dateOf(a){ var d = Math.min(365 - 1e-6, (4.54 - a) / 4.54 * 365), day = Math.floor(d), m = 0;   /* aujourd'hui = 31 décembre, 23 h 59 */ while (m < 11 && day >= ML[m]){ day -= ML[m]; m++; } var hh = (d - Math.floor(d)) * 24, h = Math.floor(hh), mn = Math.floor((hh - h) * 60); return (day + 1) + " " + MON[m] + (a < 0.02 ? ", " + h + " h " + (mn < 10 ? "0" : "") + mn : ""); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, lx = 178, L = c.W - 16, W = L - lx, a0 = ag.value, past = 0;
      function pos(a){ return sc.value === "l" ? lx + (4.54 - a) / 4.54 * W : lx + (Math.log10(4.54) - Math.log10(Math.max(a, 0.0002))) / (Math.log10(4.54) - Math.log10(0.0002)) * W; }
      var rh = 28; EV.forEach(function(e, i){
        var y = 18 + i * rh, on = e[1] <= a0 + 1e-9; if (!on) {} 
        var happened = e[1] >= a0 - 1e-9; if (happened) past++;
        ctx.fillStyle = i % 2 ? "#f6f8fa" : "#fff"; ctx.fillRect(4, y - 12, c.W - 8, rh);
        S.draw.text(c, e[0], 8, y, {align: "left", size: 12, color: happened ? P.ink : "#a8b1bd", weight: 700});
        ctx.strokeStyle = "#dfe4ea"; ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(L, y); ctx.stroke();
        S.draw.dot(c, pos(e[1]), y, 6, happened ? P.red : "#c3cbd5");
      });
      var xc = pos(Math.max(a0, 0.0002)); S.draw.line(c, xc, 4, xc, 18 + EV.length * rh - 8, P.green, 2, [5, 3]);
      S.draw.text(c, sc.value === "l" ? "← Terre formée          aujourd'hui →" : "← 4,5 Ga        échelle log        10 000 ans →", (lx + L) / 2 + 6, 18 + EV.length * rh + 6, {size: 12, color: P.grey});
      ro.set(0, dateOf(a0)); ro.set(1, past + " sur " + EV.length);
      note.set(sc.value === "l" ? "Échelle linéaire : les événements récents (cambrien, plantes, dinosaures, humains) se superposent à l'extrême droite : les 13 derniers % de l'histoire contiennent presque tout ce que l'on voit des animaux." : "Échelle logarithmique : chaque événement est lisible, mais les intervalles de temps ne sont plus proportionnels : ne compare pas les distances.", "");
    });
  }
});
})();
