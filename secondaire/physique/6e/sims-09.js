/* Chapitre 9 · Atome, noyau et radioactivité */
SFA.sim({
  id: "p6-c09-bohr", ch: "c09", tag: "Classique",
  titre: "L'atome de Bohr : niveaux d'énergie et photons",
  resume: "E_n = −13,6 eV/n² : un saut d'un niveau à l'autre émet ou absorbe un photon de couleur précise.",
  but: "Choisis le niveau de départ et d'arrivée de l'électron de l'atome d'hydrogène. Si l'électron descend, un photon est émis ; s'il monte, un photon est absorbé. Lis l'énergie, la longueur d'onde et la couleur.",
  aRetenir: "Dans le modèle de Bohr, l'énergie de l'électron de l'hydrogène est quantifiée : E_n = −13,6 eV / n². Lors d'un saut, le photon échangé a l'énergie |ΔE| = h·f = h·c/λ, donc λ = 1 240 eV·nm / |ΔE|. Retour au niveau n = 2 : raies visibles de la série de Balmer ; au niveau n = 1 : ultraviolet (Lyman) ; au niveau n = 3 : infrarouge (Paschen).",
  piege: "Les niveaux sont discrets : l'atome n'absorbe qu'un photon d'énergie exactement égale à un écart entre deux niveaux (pas n'importe quelle couleur). Le modèle de Bohr est une première approche : l'électron n'est pas vraiment sur une orbite ; il n'explique bien que l'hydrogène (et les ions à un électron).",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette;
    var ni = k.slider("Niveau de départ n", 1, 6, 1, 3, "");
    var nf = k.slider("Niveau d'arrivée n'", 1, 6, 1, 2, "");
    var ro = k.readouts(["Énergie de départ", "Énergie d'arrivée", "Énergie du photon", "Longueur d'onde", "Domaine / série"]);
    var nt = k.note("", "ok");
    function E(n){ return -13.6 / (n * n); }
    var t = 0;
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, a = ni.value, b = nf.value, em = a > b;
      /* gauche : orbites */
      var cx = W * 0.27, cy = H / 2 + 6, R = Math.min(W * 0.25, H / 2 - 18), r1 = R / 36;
      for (var n = 1; n <= 6; n++){ var r = Math.max(10, R * n * n / 36); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.strokeStyle = n === a || n === b ? P.acc : "#d5dbe5"; ctx.lineWidth = n === a || n === b ? 2.2 : 1; ctx.stroke(); S.draw.text(c, String(n), cx + r * 0.71 + 6, cy - r * 0.71 - 6, {size: 12, color: P.grey}); }
      S.draw.dot(c, cx, cy, 6, P.red); S.draw.text(c, "p⁺", cx, cy - 14, {size: 12, color: P.red});
      var rr = Math.max(10, R * a * a / 36), ang = t * 1.5;
      if (a !== b){
        /* animation du saut toutes les 3 s */
        var ph = (t % 3) / 3, rsrc = Math.max(10, R * b * b / 36), rcur = rr + (rsrc - rr) * Math.min(1, ph * 2);
        rr = rcur;
        var pc = P6.rgb(Math.max(380, Math.min(780, 1239.84 / Math.abs(13.6 * (1 / (b * b) - 1 / (a * a))))));
        var px = cx + rr * Math.cos(ang), py = cy - rr * Math.sin(ang);
        if (ph > 0.4){ var q = (ph - 0.4) / 0.6, sx = cx + (rsrc * Math.cos(ang) ), sy = cy - rsrc * Math.sin(ang); var dxp = em ? 1 : -1;
          /* photon : flèche ondulée sortant (émission) ou entrant (absorption) */
          var x0 = em ? px : px - 90 * (1 - q) - 10, x1 = em ? px + 120 * q : px; var ptx = em ? px + 14 : px - 14;
          ctx.beginPath(); ctx.strokeStyle = pc; ctx.lineWidth = 3; for (var j = 0; j <= 40; j++){ var xx = (em ? px : px - 80) + j * 2.6 * 1 + (em ? 120 * q * 0 : 0), yy = py + 7 * Math.sin(j * 0.9 + t * 10); if (j) ctx.lineTo(xx + (em ? 40 * q : 0) * 1, yy); else ctx.moveTo(xx + (em ? 40 * q : 0), yy); } ctx.stroke(); }
        S.draw.dot(c, px, py, 7, P.acc);
      } else S.draw.dot(c, cx + rr * Math.cos(ang), cy - rr * Math.sin(ang), 7, P.acc);
      /* droite : diagramme d'énergie */
      var x0d = W * 0.58, x1d = W - 28, yE = function(e){ return 24 + (0 - e) / 13.6 * (H - 60) * 0.98; };
      S.draw.line(c, x0d - 12, yE(0), x1d + 10, yE(0), P.grey, 1, [4, 4]); S.draw.text(c, "0 eV (atome ionisé)", x1d + 6, yE(0) - 10, {size: 12, align: "right", color: P.grey});
      for (n = 1; n <= 6; n++){ var y = yE(E(n)), on = n === a || n === b; S.draw.line(c, x0d, y, x1d, y, on ? P.acc : "#aab3c0", on ? 3 : 1.6); if (on || n <= 3) S.draw.text(c, "n = " + n + "   " + S.fmt(E(n), 2) + " eV", x0d - 6, y, {size: 12, align: "right", color: on ? P.acc : P.grey}); }
      if (a !== b){ var xm = (x0d + x1d) / 2; S.draw.arrow(c, xm, yE(E(a)), xm, yE(E(b)), em ? P.red : P.green, 3); }
      var dE = a === b ? 0 : Math.abs(E(a) - E(b)), lam = dE > 0 ? 1239.84 / dE : NaN;
      var dom = isNaN(lam) ? "—" : lam < 380 ? "ultraviolet" : lam > 750 ? "infrarouge" : "visible";
      var serie = b === 1 || a === 1 ? "Lyman (retour à n = 1)" : b === 2 || a === 2 ? "Balmer (n = 2)" : b === 3 || a === 3 ? "Paschen (n = 3)" : "autres séries (infrarouge)";
      ro.set(0, S.fmt(E(a), 2) + " eV"); ro.set(1, S.fmt(E(b), 2) + " eV"); ro.set(2, dE ? S.fmt(dE, 3) + " eV" : "—"); ro.set(3, dE ? S.fmt(lam, 1) + " nm" : "—"); ro.set(4, dE ? dom + " · " + serie : "—");
      nt.set(a === b ? "Même niveau au départ et à l'arrivée : aucun photon échangé." : em ? "Émission : l'électron descend de n = " + a + " à n = " + b + ", l'atome émet un photon de " + S.fmt(dE, 2) + " eV." : "Absorption : l'atome absorbe un photon de " + S.fmt(dE, 2) + " eV et l'électron monte de n = " + a + " à n = " + b + ". Tout autre photon est ignoré.", "ok");
    });
  }
});

SFA.sim({
  id: "p6-c09-decroissance", ch: "c09", tag: "Dés virtuels",
  titre: "La décroissance radioactive : hasard et loi exponentielle",
  resume: "Chaque noyau se désintègre au hasard, mais l'ensemble suit N = N₀·2^(−t/T½).",
  but: "Chaque carré est un noyau. À chaque instant, chacun a la même probabilité de se désintégrer. Lance la simulation avec peu puis beaucoup de noyaux, et compare le nombre restant à la loi exponentielle.",
  aRetenir: "Un noyau instable se désintègre de façon aléatoire, sans « horloge » ni mémoire. Sur un grand nombre de noyaux, la loi est régulière : N(t) = N₀·2^(−t/T½), où la demi-vie T½ est la durée au bout de laquelle la moitié des noyaux restants s'est désintégrée. Après 2 T½ il en reste 1/4, après 3 T½ 1/8 : jamais zéro en un temps fini.",
  piege: "Une demi-vie n'est pas « la moitié du temps pour que tout disparaisse ». Au bout de 2 demi-vies, il reste encore 25 % des noyaux, pas 0 %. Et pour un petit nombre de noyaux, le hasard fait fortement dévier la courbe de la loi : la loi n'est précise que pour de grands nombres.",
  build: function(k, S){
    var c = k.canvas(220), g = k.canvas(220), P = S.draw.palette;
    var N0 = k.slider("Nombre de noyaux N₀", 20, 800, 20, 200, "", function(){ reset(); });
    var iso = k.select("Noyau (pour l'échelle de temps)", [["h", "Technétium 99m : T½ = 6,0 heures"], ["d", "Iode 131 : T½ = 8,0 jours"], ["a", "Carbone 14 : T½ = 5 730 ans"], ["u", "Uranium 238 : T½ = 4,47 milliards d'années"]], "a");
    k.button("Recommencer", function(){ reset(); }, true);
    var ro = k.readouts(["Temps écoulé", "Noyaux restants", "Fraction restante", "Prévue par la loi"]);
    var alive, t, hist, lastN, tPer = 3.5;   /* 1 demi-vie = 3,5 s d'animation */
    function reset(){ var n = N0 ? N0.value : 200; alive = []; for (var i = 0; i < n; i++) alive.push(true); t = 0; hist = [[0, n]]; lastN = n; }
    reset();
    var lp = k.loop(function(dt){
      var th = dt / tPer, p = 1 - Math.pow(2, -th);
      if (t < 6){ t += th; var cnt = 0; for (var i = 0; i < alive.length; i++){ if (alive[i] && Math.random() < p) alive[i] = false; if (alive[i]) cnt++; } hist.push([t, cnt]); lastN = cnt; }
      k.redraw();
    });
    lp.play();
    var units = {h: ["h", 6], d: ["jours", 8], a: ["ans", 5730], u: ["Ga", 4.47]};
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, H = c.H, n = alive.length, cols = Math.ceil(Math.sqrt(n * W / H)), rows = Math.ceil(n / cols), cs = Math.min((W - 20) / cols, (H - 20) / rows);
      for (var i = 0; i < n; i++){ var cx = 10 + (i % cols) * cs, cy = 10 + Math.floor(i / cols) * cs; ctx.fillStyle = alive[i] ? P.acc : "#e1e6ee"; ctx.fillRect(cx, cy, cs - 1.5, cs - 1.5); }
      var ax = S.draw.axes(g, {x0: 0, x1: 6, y0: 0, y1: 1.05, xl: "t / T½", yl: "N / N₀", l: 46, t: 14, stepX: 1, stepY: 0.25});
      S.draw.fn(g, ax, function(x){ return Math.pow(2, -x); }, P.red, 2, [6, 4]);
      var gc = g.ctx; gc.save(); gc.beginPath(); gc.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); gc.clip(); gc.strokeStyle = P.acc; gc.lineWidth = 2.4; gc.beginPath();
      hist.forEach(function(h, j){ var X = ax.X(h[0]), Y = ax.Y(h[1] / n); if (j) gc.lineTo(X, Y); else gc.moveTo(X, Y); }); gc.stroke(); gc.restore();
      S.draw.text(g, "pointillés : loi 2^(−t/T½)   trait plein : ta simulation", ax.R - 4, ax.T + 8, {size: 12, align: "right"});
      var u = units[iso.value], tt = t * u[1];
      ro.set(0, S.fmt(t, 2) + " T½ = " + (iso.value === "a" ? S.fmt(tt, 0) : S.fmt(tt, 1)) + " " + u[0]); ro.set(1, lastN + " sur " + n); ro.set(2, S.fmt(lastN / n * 100, 1) + " %"); ro.set(3, S.fmt(Math.pow(2, -t) * n, 1) + " noyaux (" + S.fmt(Math.pow(2, -t) * 100, 1) + " %)");
    });
  }
});

SFA.sim({
  id: "p6-c09-carbone14", ch: "c09", tag: "Datation",
  titre: "Datation au carbone 14",
  resume: "Âge = T½ · log₂(N₀/N) : de la fraction de carbone 14 restante à l'âge d'un os, d'un bois, d'un tissu.",
  but: "Choisis un objet célèbre ou règle l'âge (ou la fraction de ¹⁴C restante). La courbe montre la fraction restante en fonction de l'âge ; les demi-vies de 5 730 ans sont repérées.",
  aRetenir: "Les êtres vivants échangent du carbone avec l'atmosphère : leur teneur en ¹⁴C est constante. À leur mort, elle décroît avec la demi-vie de 5 730 ans. En mesurant la fraction restante f = N/N₀, on déduit l'âge : t = T½·log₂(1/f) = 5 730 × ln(1/f)/ln 2. La méthode s'applique à des matières organiques de moins de 50 000 ans environ.",
  piege: "La méthode ne date que la mort de l'organisme, pas la fabrication d'un outil, et elle ne marche pas sur la pierre ou les métaux. Au-delà de ~50 000 ans il reste moins de 0,3 % du ¹⁴C : trop peu pour mesurer. Les âges réels sont corrigés par étalonnage (cernes d'arbres) : modèle simplifié ici.",
  build: function(k, S){
    var c = k.canvas(280), P = S.draw.palette, T = 5730;
    var obj = k.select("Objet (âge approximatif)", [["", "— à régler soi-même —"], ["5300", "Ötzi, l'homme des glaces (≈ 5 300 ans)"], ["4600", "Pyramide de Khéops (≈ 4 600 ans)"], ["2000", "Rouleaux de la mer Morte (≈ 2 000 ans)"], ["17000", "Peintures de Lascaux (≈ 17 000 ans)"], ["40000", "Outil en os du Paléolithique (≈ 40 000 ans)"]], "", function(v){ if (v) { age.set(parseFloat(v)); } });
    var mode = k.seg("Je règle", [["age", "l'âge"], ["frac", "la fraction restante"]], "age");
    var age = k.slider("Âge de l'échantillon", 0, 60000, 100, 5300, "ans");
    var fr = k.slider("Fraction de ¹⁴C restante", 0.1, 100, 0.1, 50, "%");
    var ro = k.readouts(["Fraction restante f", "Âge t", "Nombre de demi-vies", "Reste à mesurer"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var t, f;
      if (mode.value === "age"){ t = age.value; f = Math.pow(2, -t / T); } else { f = fr.value / 100; t = T * Math.log(1 / f) / Math.LN2; }
      var ax = S.draw.axes(c, {x0: 0, x1: 60000, y0: 0, y1: 100, xl: "âge (ans)", yl: "¹⁴C restant (%)", l: 52, t: 18, stepX: 10000, stepY: 25});
      S.draw.fn(c, ax, function(x){ return 100 * Math.pow(2, -x / T); }, P.acc, 3);
      for (var j = 1; j <= 5; j++){ var tj = j * T; S.draw.line(c, ax.X(tj), ax.B, ax.X(tj), ax.Y(100 * Math.pow(2, -j)), P.grey, 1, [3, 4]); S.draw.text(c, j + " T½", ax.X(tj), ax.B - 10, {size: 12, color: P.grey}); }
      S.draw.line(c, ax.X(50000), ax.T, ax.X(50000), ax.B, P.red, 1.5, [6, 4]); S.draw.text(c, "limite pratique ≈ 50 000 ans", ax.X(50000) - 4, ax.T + 10, {size: 12, color: P.red, align: "right"});
      if (t <= 60000){ S.draw.line(c, ax.L, ax.Y(100 * f), ax.X(t), ax.Y(100 * f), P.red, 1.8, [4, 3]); S.draw.line(c, ax.X(t), ax.Y(100 * f), ax.X(t), ax.B, P.red, 1.8, [4, 3]); S.draw.dot(c, ax.X(t), ax.Y(100 * f), 7, P.red); }
      ro.set(0, S.fmt(f * 100, f < 0.01 ? 3 : 2) + " %"); ro.set(1, S.fmt(t, 0) + " ans"); ro.set(2, S.fmt(t / T, 2)); ro.set(3, f < 0.003 ? "moins de 0,3 % : mesure très difficile" : "mesurable");
      nt.set(t > 50000 ? "Au-delà de 50 000 ans, la méthode du carbone 14 n'est plus fiable : on utilise d'autres isotopes (potassium-argon, uranium-plomb…)." : t < 100 ? "Échantillon récent : l'incertitude relative sur l'âge est grande." : "Contrôle : t = 5 730 × log₂(1/f) = " + S.fmt(T, 0) + " × " + S.fmt(Math.log(1 / f) / Math.LN2, 2) + " ans.", t > 50000 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "p6-c09-rayonnements", ch: "c09", tag: "Protection",
  titre: "Rayonnements α, β, γ : temps, distance, écran",
  resume: "Quel écran arrête quel rayonnement ? Et quel rôle joue la distance ?",
  but: "Choisis le type de rayonnement, le matériau et l'épaisseur de l'écran, puis la distance. Les points colorés sont les particules : celles qui sont arrêtées disparaissent. Lis le débit relatif reçu.",
  aRetenir: "α (noyaux d'hélium) : très ionisants mais peu pénétrants (une feuille de papier ou la peau les arrête ; quelques cm dans l'air). β (électrons ou positons) : arrêtés par quelques mm d'aluminium. γ (photons très énergétiques) : très pénétrants, atténués de façon exponentielle par un matériau dense (plomb, béton). Trois moyens de se protéger : limiter le temps, augmenter la distance (la dose varie en 1/d²), interposer un écran.",
  piege: "« Peu pénétrant » ne veut pas « peu dangereux » : un émetteur α avalé ou inhalé (contamination) irradie directement les tissus. Irradiation = exposition à un rayonnement ; contamination = présence de la substance radioactive sur ou dans le corps. Modèle simplifié : source ponctuelle, particules d'énergie de l'ordre du MeV, α : portée 4 cm dans l'air, β : portée 3 m dans l'air.",
  build: function(k, S){
    var c = k.canvas(220), P = S.draw.palette;
    var ty = k.seg("Rayonnement", [["a", "α"], ["b", "β"], ["g", "γ"]], "g");
    var mt = k.select("Écran", [["pa", "Papier / carton"], ["al", "Aluminium"], ["pb", "Plomb"], ["be", "Béton"]], "pb");
    var ep = k.slider("Épaisseur de l'écran", 0, 100, 1, 10, "mm");
    var di = k.slider("Distance source–détecteur", 1, 500, 1, 100, "cm");
    var ro = k.readouts(["Transmission de l'écran", "Débit relatif au détecteur", "Épaisseur de demi-atténuation (γ)"]);
    var nt = k.note("", "ok");
    var mat = {pa: {rho: 0.8, mu: 0.0637, n: "papier"}, al: {rho: 2.7, mu: 0.0615, n: "aluminium"}, pb: {rho: 11.35, mu: 0.0710, n: "plomb"}, be: {rho: 2.3, mu: 0.0637, n: "béton"}};
    var parts = [], t = 0;
    function trans(){
      var m = mat[mt.value], x = ep.value / 10;   /* cm */
      if (ty.value === "a") return x >= 0.01 ? 0 : 1;
      if (ty.value === "b"){ var R = 0.54 / m.rho; return Math.max(0, 1 - x / R); }
      return Math.exp(-m.mu * m.rho * x);
    }
    function rangeAir(){ return ty.value === "a" ? 4 : ty.value === "b" ? 300 : Infinity; }
    var lp = k.loop(function(dt){
      t += dt; var T = trans();
      if (Math.random() < dt * 14){ parts.push({x: 0, y: (Math.random() - 0.5) * 0.6, ok: Math.random() < T, air: Math.random() < 1, dead: false}); }
      parts.forEach(function(p){ p.x += dt * 0.55; });
      parts = parts.filter(function(p){ return p.x < 1.05; });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, cy = H / 2, xs = 30, xd = W - 40, xe = xs + (xd - xs) * 0.5, wE = Math.max(0, Math.min(60, ep.value * 0.6)) ;
      var m = mat[mt.value], T = trans(), inAir = di.value <= rangeAir(), rel = inAir ? T * Math.pow(100 / di.value, 2) : 0;
      ctx.fillStyle = ({pa: "#e8dfc9", al: "#b8c1cf", pb: "#4b5563", be: "#a39a8b"})[mt.value]; if (wE > 0) ctx.fillRect(xe - wE / 2, cy - 70, wE, 140);
      S.draw.dot(c, xs, cy, 10, P.amber); S.draw.text(c, "source", xs, cy + 26, {size: 12}); ctx.fillStyle = P.green; ctx.fillRect(xd, cy - 18, 14, 36); S.draw.text(c, "détecteur", xd + 6, cy + 36, {size: 12, color: P.green});
      /* limite de portée dans l'air */
      var fracAir = Math.min(1, rangeAir() / di.value);
      parts.forEach(function(p){
        var x = p.x, px = xs + (xd - xs) * x;
        if (!p.ok && wE > 0 && x > 0.5) return;
        if (x > fracAir) return;
        ctx.beginPath(); ctx.arc(px, cy + p.y * 160, 3.6, 0, 7); ctx.fillStyle = ty.value === "g" ? "#7c3aed" : ty.value === "b" ? "#0e7490" : "#b42318"; ctx.fill();
      });
      ro.set(0, S.fmt(T * 100, T < 0.01 ? 2 : 1) + " %"); ro.set(1, inAir ? S.fmt(rel * 100, rel * 100 < 1 ? 2 : rel * 100 < 100 ? 1 : 0) + " % (réf. : 100 % à 1 m sans écran)" : "0 % (portée dépassée)");
      ro.set(2, ty.value === "g" ? S.fmt(Math.log(2) / (m.mu * m.rho) * 10, 1) + " mm de " + m.n : "—");
      nt.set(ty.value === "a" ? "α : arrêté par une simple feuille ; portée de 4 cm dans l'air." : ty.value === "b" ? "β : arrêté par quelques mm d'aluminium (portée ≈ 0,54 g/cm² divisée par la masse volumique)." : "γ : jamais complètement arrêté, seulement atténué ; double l'épaisseur de demi-atténuation → intensité ÷ 4.", "ok");
    });
  }
});
