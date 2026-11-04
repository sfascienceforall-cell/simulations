/* Chapitre 10 · Physique et santé ; climat et énergie */
SFA.sim({
  id: "p6-c10-echographie", ch: "c10", tag: "Imagerie",
  titre: "Échographie : temps d'écho, fréquence et profondeur",
  resume: "Un ultrason part, se réfléchit sur une interface et revient : t = 2d/v. Fréquence plus haute = image plus fine, mais portée plus courte.",
  but: "La sonde envoie une impulsion. Règle la profondeur de l'interface, la nature de ce qu'elle sépare, la fréquence et le gel de contact. Lis le temps d'écho, le niveau de l'écho (dB) et la finesse de l'image.",
  aRetenir: "L'échographie utilise des ultrasons (f > 20 kHz, typiquement 2 à 15 MHz), pas des rayons. La profondeur se déduit du temps d'écho : d = v·t/2, avec v ≈ 1 540 m/s dans les tissus mous. Une interface réfléchit d'autant plus que les impédances acoustiques Z = ρ·v diffèrent. La résolution est de l'ordre de λ = v/f : une fréquence plus élevée donne une image plus fine, mais l'atténuation (≈ 0,5 dB par cm et par MHz dans chaque sens) limite la profondeur.",
  piege: "L'échographie n'utilise ni rayons X ni rayonnement ionisant : ce sont des ondes mécaniques. Sans gel, l'air entre la sonde et la peau réfléchit presque tout : on ne voit rien. L'os et les poumons (air) bloquent les ultrasons. Valeurs d'ordre de grandeur (milieu homogène, interface plane).",
  build: function(k, S){
    var c = k.canvas(260), P = S.draw.palette, V = 1540, Z1 = 1.63;
    var d = k.slider("Profondeur de l'interface", 1, 20, 0.5, 8, "cm");
    var tg = k.select("Ce qui est derrière l'interface", [["gr", "Graisse (Z = 1,38)"], ["mu", "Muscle (Z = 1,70)"], ["os", "Os (Z = 7,8)"], ["ai", "Air / poumon (Z = 0,0004)"]], "gr");
    var f = k.slider("Fréquence de la sonde", 1, 15, 0.5, 5, "MHz");
    var gel = k.toggle("Gel de contact", true);
    var ro = k.readouts(["Temps d'écho t = 2d/v", "Longueur d'onde (≈ résolution)", "Réflexion R de l'interface", "Niveau de l'écho reçu"]);
    var nt = k.note("", "ok");
    var Zs = {gr: 1.38, mu: 1.70, os: 7.8, ai: 0.0004};
    k.draw(function(){
      c.clear(); var W = c.W, H = c.H, t = 2 * (d.value / 100) / V * 1e6, Z2 = Zs[tg.value], R = Math.pow((Z2 - Z1) / (Z2 + Z1), 2);
      var att = f.value * d.value, gelLoss = gel.value ? 0 : 60, lev = 10 * Math.log10(R) - att - gelLoss, lam = V / (f.value * 1e6) * 1000;
      var ax = S.draw.axes(c, {x0: 0, x1: 320, y0: -110, y1: -0.001, xl: "temps (µs)", yl: "niveau (dB)", l: 52, t: 22, stepX: 50, stepY: 25});
      /* émission */
      S.draw.line(c, ax.X(0), ax.Y(-110), ax.X(0), ax.Y(0), P.acc, 4); S.draw.text(c, "émission", ax.X(0) + 6, ax.T + 10, {size: 12, align: "left", color: P.acc});
      var thr = -90; S.draw.line(c, ax.L, ax.Y(thr), ax.R, ax.Y(thr), P.red, 1.5, [6, 4]); S.draw.text(c, "seuil de détection ≈ −90 dB", ax.R - 4, ax.Y(thr) - 9, {size: 12, align: "right", color: P.red});
      var tt = Math.min(t, 320), y = Math.max(-110, lev);
      S.draw.line(c, ax.X(tt), ax.Y(-110), ax.X(tt), ax.Y(y), lev > thr ? P.green : P.grey, 6);
      S.draw.text(c, "écho", ax.X(tt), ax.Y(y) - 12, {size: 12, color: lev > thr ? P.green : P.grey});
      /* échelle de profondeur */
      S.draw.text(c, "profondeur ≈ " + S.fmt(d.value, 1) + " cm", ax.R - 4, ax.T + 10, {size: 12, align: "right"});
      ro.set(0, S.fmt(t, 1) + " µs"); ro.set(1, S.fmt(lam, 2) + " mm"); ro.set(2, R > 0.01 ? S.fmt(R * 100, 1) + " %" : S.fmt(R * 100, 2) + " %"); ro.set(3, S.fmt(lev, 1) + " dB");
      nt.set(!gel.value ? "Sans gel : l'air coincé entre la sonde et la peau réfléchit presque tout, l'écho est perdu dans le bruit." : lev <= thr ? "Écho trop faible : diminue la fréquence (moins d'atténuation) ou rapproche l'interface." : tg.value === "ai" ? "Presque tout est réfléchi : l'air et les poumons empêchent de voir derrière. " : tg.value === "os" ? "L'os réfléchit fortement (~43 %) : écho net, mais on ne voit pas derrière lui." : "Interface visible. Une fréquence plus haute affine l'image mais l'écho s'affaiblit.", (!gel.value || lev <= thr) ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "p6-c10-radiographie", ch: "c10", tag: "Imagerie",
  titre: "Radiographie : atténuation, énergie des rayons X et contraste",
  resume: "I = I₀·e^(−μ·x) : l'os absorbe plus que les tissus, surtout à basse énergie.",
  but: "Des rayons X traversent des tissus mous (équivalent eau) avec ou sans os. Règle l'énergie, l'épaisseur de tissu et l'épaisseur d'os. Compare les images (grises) et lis le contraste.",
  aRetenir: "Un faisceau de rayons X traversant une épaisseur x d'un matériau est atténué : I = I₀·e^(−μ·x). Le coefficient μ dépend du matériau (os > tissus mous > air) et de l'énergie des photons. À basse énergie (30 à 50 keV), l'os absorbe beaucoup plus que les tissus : fort contraste, mais le patient absorbe plus d'énergie. À haute énergie, le faisceau traverse mieux, au prix d'un contraste plus faible. La radiographie utilise un rayonnement ionisant : on applique le principe ALARA (dose aussi basse que raisonnablement possible).",
  piege: "Une zone claire sur un cliché est une zone qui a reçu peu de rayons X (os), pas l'inverse de ce qu'on croit : l'os « blanc » est l'os qui absorbe. Les valeurs de μ sont tirées de tables usuelles (eau et os cortical) ; le modèle ignore la diffusion et le rayonnement secondaire.",
  build: function(k, S){
    var c = k.canvas(250), P = S.draw.palette;
    var en = k.select("Énergie des rayons X", [["30", "30 keV"], ["40", "40 keV"], ["50", "50 keV"], ["60", "60 keV"], ["80", "80 keV"], ["100", "100 keV"]], "60");
    var tis = k.slider("Épaisseur de tissus mous", 5, 25, 1, 15, "cm");
    var os = k.slider("Épaisseur d'os", 0, 4, 0.25, 2, "cm");
    var ro = k.readouts(["Transmission : tissus seuls", "Transmission : tissus + os", "Contraste os / tissus", "Absorbé par les tissus"]);
    var nt = k.note("", "ok");
    var tab = {"30": [0.3756, 1.331], "40": [0.2683, 0.6655], "50": [0.2269, 0.4242], "60": [0.2059, 0.3148], "80": [0.1837, 0.2229], "100": [0.1707, 0.1855]};
    var RHOB = 1.92;
    function tr(e, tcm, ocm){ var t = tab[e]; return {mu1: t[0] * 1.0, mu2: t[1] * RHOB, a: Math.exp(-t[0] * tcm), b: Math.exp(-t[0] * (tcm - ocm) - t[1] * RHOB * ocm)}; }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, T = tr(en.value, tis.value, os.value);
      var x0 = 30, xb = W * 0.55, cy = 96;
      /* tube, corps, détecteur (coupe) */
      S.draw.dot(c, x0, cy, 12, P.amber); S.draw.text(c, "tube", x0, cy + 26, {size: 12});
      ctx.fillStyle = "#f2d3b8"; ctx.fillRect(x0 + 90, 30, 120, 130);
      ctx.fillStyle = "#e9e5df"; ctx.fillRect(x0 + 90, 95 - Math.min(60, os.value * 14) / 2 + 0, 120, Math.min(60, os.value * 14)); S.draw.text(c, "tissus", x0 + 150, 46, {size: 12, color: "#8a5a3a"}); S.draw.text(c, "os", x0 + 150, 95, {size: 12, color: P.ink});
      [-1, 1].forEach(function(s){ S.draw.line(c, x0 + 12, cy, x0 + 90, cy + s * 40, "rgba(244,197,66,.9)", 1.5, [4, 3]); });
      S.draw.arrow(c, x0 + 214, 60, x0 + 262, 60, P.amber, 3); S.draw.arrow(c, x0 + 214, 125, x0 + 262, 125, P.amber, 3);
      /* image du détecteur : deux plages */
      function gray(v){ var g = Math.round(255 * Math.pow(v, 0.35)); return "rgb(" + g + "," + g + "," + g + ")"; }
      var ix = W * 0.62, iw = W - ix - 16;
      ctx.fillStyle = gray(T.a); ctx.fillRect(ix, 30, iw, 62); ctx.fillStyle = gray(T.b); ctx.fillRect(ix, 98, iw, 62);
      ctx.strokeStyle = P.ink; ctx.lineWidth = 1; ctx.strokeRect(ix, 30, iw, 130);
      S.draw.text(c, "image (clair = peu absorbé)", ix + iw / 2, 18, {size: 12});
      S.draw.text(c, "tissus seuls", ix + iw / 2, 61, {size: 12, color: T.a > 0.2 ? "#111" : "#fff"}); S.draw.text(c, "tissus + os", ix + iw / 2, 129, {size: 12, color: T.b > 0.2 ? "#111" : "#fff"});
      var contrast = 1 - T.b / T.a;
      /* barres de transmission */
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(30, 190, W - 60, 12); ctx.fillStyle = P.acc; ctx.fillRect(30, 190, (W - 60) * T.a, 12);
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(30, 220, W - 60, 12); ctx.fillStyle = P.red; ctx.fillRect(30, 220, (W - 60) * T.b, 12);
      S.draw.text(c, "tissus seuls : " + S.sci(T.a * 100) + " %", 30, 182, {size: 12, align: "left"}); S.draw.text(c, "tissus + os : " + S.sci(T.b * 100) + " %", 30, 212, {size: 12, align: "left"});
      ro.set(0, S.sci(T.a * 100) + " %"); ro.set(1, S.sci(T.b * 100) + " %"); ro.set(2, S.fmt(contrast * 100, 0) + " %"); ro.set(3, S.fmt((1 - T.a) * 100, 1) + " %");
      nt.set(os.value === 0 ? "Sans os, les deux plages sont identiques : pas de contraste." : (en.value === "30" || en.value === "40") ? "Basse énergie : l'os absorbe beaucoup plus que les tissus (fort contraste), mais les tissus absorbent aussi plus : dose plus élevée pour le patient." : en.value === "100" ? "Haute énergie : le faisceau traverse presque aussi bien l'os que les tissus : contraste faible." : "Énergie intermédiaire : compromis courant en radiographie.", "ok");
    });
  }
});

SFA.sim({
  id: "p6-c10-doses", ch: "c10", tag: "Niche · Doses",
  titre: "Ma dose annuelle : examens, vols et rayonnement naturel",
  resume: "Compare des doses en mSv : un vol, une radio dentaire, un scanner, le rayonnement naturel de l'année.",
  but: "Compose ton année : choisis le nombre d'examens et de vols. La barre cumule les doses et les compare à la dose naturelle moyenne et aux limites réglementaires. Lis aussi l'équivalent en jours de rayonnement naturel.",
  aRetenir: "La dose efficace se mesure en sievert (Sv), souvent en mSv. Le rayonnement naturel (radon, sol, rayons cosmiques, alimentation) représente en moyenne mondiale ≈ 2,4 mSv par an. Un examen médical a un bénéfice diagnostique : on l'utilise quand il est justifié et avec la plus faible dose raisonnable. Une radio dentaire ou un vol sont de l'ordre de quelques µSv à quelques dizaines de µSv ; un scanner de plusieurs mSv. Limites annuelles (hors médical et naturel) : 1 mSv pour le public, 20 mSv pour les travailleurs exposés.",
  piege: "Toutes les radiations ne se valent pas : on compare des doses efficaces, pas le nombre d'examens. Un scanner n'est pas « 350 radios » à proportion fixe pour tous. Et les limites réglementaires ne s'appliquent pas aux doses médicales (décidées au cas par cas par le médecin). Valeurs : ordres de grandeur moyens (varient selon l'appareil, le patient et le protocole).",
  build: function(k, S){
    var c = k.canvas(190), P = S.draw.palette;
    var items = [
      {id: "den", n: "Radios dentaires", d: 0.005, max: 10, col: "#0e7490"},
      {id: "tho", n: "Radios du thorax", d: 0.02, max: 10, col: "#1e3f8f"},
      {id: "mam", n: "Mammographies", d: 0.4, max: 2, col: "#5B21B6"},
      {id: "sca", n: "Scanners du thorax", d: 7, max: 3, col: "#b42318"},
      {id: "vol", n: "Vols Bruxelles–New York (aller)", d: 0.04, max: 20, col: "#B45309"}
    ];
    var sl = {}; items.forEach(function(it){ sl[it.id] = k.slider(it.n + " (" + S.fmt(it.d, 3) + " mSv chacun)", 0, it.max, 1, it.id === "tho" ? 1 : it.id === "vol" ? 2 : 0, ""); });
    var nat = k.toggle("Ajouter le rayonnement naturel moyen (2,4 mSv/an)", true);
    var ro = k.readouts(["Dose ajoutée par ces actes", "Total de l'année", "Équivalent en jours de rayonnement naturel", "Par rapport à la limite « public » (1 mSv)"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, add = 0, parts = [];
      items.forEach(function(it){ var v = sl[it.id].value * it.d; add += v; if (v > 0) parts.push({v: v, col: it.col, n: it.n}); });
      var base = nat.value ? 2.4 : 0, tot = add + base, mx = tot <= 3 ? 3 : tot <= 5 ? 5 : tot <= 10 ? 10 : tot <= 25 ? 25 : Math.ceil(tot / 10) * 10, x0 = 20, x1 = W - 20;
      function X(v){ return x0 + v / mx * (x1 - x0); }
      ctx.fillStyle = "#e9edf3"; ctx.fillRect(x0, 60, x1 - x0, 30);
      var acc = 0; if (base > 0){ ctx.fillStyle = "#9aa4b2"; ctx.fillRect(X(0), 60, X(base) - X(0), 30); acc = base; S.draw.text(c, "naturel", X(base / 2), 106, {size: 12, color: P.grey}); }
      parts.forEach(function(p){ ctx.fillStyle = p.col; ctx.fillRect(X(acc), 60, Math.max(1.5, X(acc + p.v) - X(acc)), 30); acc += p.v; });
      ctx.strokeStyle = P.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x0, 60, x1 - x0, 30);
      [[1, "limite public : 1 mSv", 20], [20, "limite travailleurs : 20 mSv", 20]].forEach(function(m){ if (m[0] <= mx){ S.draw.line(c, X(m[0]), m[2] + 8, X(m[0]), 96, P.red, 1.5, [4, 3]); S.draw.text(c, m[1], X(m[0]) + 4 > W - 150 ? X(m[0]) - 4 : X(m[0]) + 4, m[2], {size: 12, color: P.red, align: X(m[0]) + 4 > W - 150 ? "right" : "left"}); } });
      parts.forEach(function(p, i){ });
      S.draw.text(c, "0", x0, 122, {size: 12, color: P.grey, align: "left"}); S.draw.text(c, S.fmt(mx, 0) + " mSv", x1, 122, {size: 12, color: P.grey, align: "right"});
      S.draw.text(c, "Total : " + S.fmt(tot, 2) + " mSv", W / 2, 150, {size: 16});
      ro.set(0, S.fmt(add, 3) + " mSv"); ro.set(1, S.fmt(tot, 2) + " mSv"); ro.set(2, S.fmt(add / (2.4 / 365), 0) + " jours"); ro.set(3, S.fmt(add / 1 * 100, 0) + " %");
      nt.set(add === 0 ? "Choisis des examens ou des vols." : add > 20 ? "Au-delà de 20 mSv ajoutés : on dépasse ce que la réglementation admet pour un travailleur exposé (limite hors médical)." : "Ces doses médicales sont décidées au cas par cas : l'examen est justifié quand son bénéfice dépasse le risque.", add > 20 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "p6-c10-effet-serre", ch: "c10", tag: "Climat",
  titre: "L'effet de serre : un modèle à une couche",
  resume: "Sans atmosphère, la Terre serait à −18 °C. Une couche qui absorbe l'infrarouge la réchauffe de plus de 30 °C.",
  but: "Le Soleil apporte 340 W/m² en moyenne ; une partie est réfléchie (albédo). La surface émet de l'infrarouge, que l'atmosphère absorbe en partie (opacité ε) et réémet vers le haut et vers le bas. Règle ε et l'albédo et lis les flux et la température. En bas, une estimation du réchauffement pour une concentration de CO₂ donnée.",
  aRetenir: "À l'équilibre, ce que la Terre reçoit (S/4)·(1 − albédo) ≈ 238 W/m² est égal à ce qu'elle renvoie dans l'espace. Une atmosphère qui absorbe l'infrarouge renvoie une partie de l'énergie vers le sol : la surface doit alors être plus chaude pour évacuer la même puissance. Sans atmosphère : ≈ −18 °C ; avec l'effet de serre naturel : ≈ +15 °C. Augmenter les gaz à effet de serre (CO₂, CH₄…) renforce l'effet de serre et réchauffe le climat.",
  piege: "L'effet de serre n'est pas un « problème » en soi : sans lui, la Terre serait gelée. C'est son renforcement par l'activité humaine qui modifie le climat. Il ne faut pas le confondre avec le trou de la couche d'ozone (UV), phénomène distinct. Modèle simplifié (une seule couche, pas de convection, pas de nuages ni d'océans) : à utiliser pour comprendre, pas pour prévoir.",
  build: function(k, S){
    var c = k.canvas(320), P = S.draw.palette, SIG = 5.670e-8, S0 = 1361;
    var preset = k.select("Atmosphère", [["", "— régler soi-même —"], ["0", "Aucune atmosphère (ε = 0)"], ["0.77", "Terre actuelle (ε ≈ 0,77)"], ["1", "Atmosphère totalement opaque à l'IR (ε = 1)"]], "", function(v){ if (v !== "") eps.set(parseFloat(v)); });
    var eps = k.slider("Opacité infrarouge de l'atmosphère ε", 0, 1, 0.01, 0.77, "");
    var alb = k.slider("Albédo (part réfléchie)", 0.1, 0.5, 0.01, 0.3, "");
    var co2 = k.slider("Concentration en CO₂ (pour l'estimation)", 280, 1120, 10, 420, "ppm");
    var ro = k.readouts(["Température de surface", "Température sans atmosphère", "Effet de serre (écart)", "Émission de la surface σT⁴", "Température de la couche"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, e = eps.value, a = alb.value, inc = S0 / 4, refl = a * inc, abs = inc - refl;
      var surf = abs / (1 - e / 2), Ts = Math.pow(surf / SIG, 0.25), Te = Math.pow(abs / SIG, 0.25), Ta = Ts / Math.pow(2, 0.25);
      var olr = (1 - e / 2) * surf, down = e * surf / 2, gone = (1 - e) * surf, up = e * surf / 2;
      var ySp = 66, yAt = 150, yGr = H - 62, x0c = W < 420 ? 74 : 90, step = (W - x0c - 30) / 4, cols = [0, 1, 2, 3, 4].map(function(q){ return x0c + q * step; });
      ctx.fillStyle = "rgba(14,116,144," + (0.12 + 0.55 * e) + ")"; ctx.fillRect(0, yAt - 16, W, 32);
      S.draw.text(c, "atmosphère", 6, yAt - 6, {size: 12, align: "left"}); S.draw.text(c, S.fmt(Ta - 273.15, 0) + " °C", 6, yAt + 9, {size: 12, align: "left"});
      ctx.fillStyle = "#c9d9b6"; ctx.fillRect(0, yGr, W, 30); S.draw.text(c, "surface", 6, yGr + 8, {size: 12, align: "left"}); S.draw.text(c, S.fmt(Ts - 273.15, 1) + " °C", 6, yGr + 23, {size: 12, align: "left"});
      function fl(x, y1, y2, v, col, lines, where){ if (v < 1) return; var w = 2 + 6 * v / 400; S.draw.arrow(c, x, y1, x, y2, col, w);
        var all = lines.concat([S.fmt(v, 0)]);
        all.forEach(function(t, i){ var yy = where === "top" ? 12 + i * 14 : (y1 + y2) / 2 + (i - (all.length - 1) / 2) * 14; S.draw.text(c, t, x, yy, {size: 12, align: "center", color: col, bg: where === "top" ? undefined : "rgba(255,255,255,.9)"}); }); }
      fl(cols[0], ySp, yGr - 2, abs, P.amber, ["Soleil", "absorbé"], "top");
      fl(cols[1], yGr - 2, ySp, refl, "#d99a14", ["Soleil", "réfléchi"], "top");
      fl(cols[2], yGr - 2, yAt + 18, e * surf, P.red, ["IR", "absorbé"], "mid");
      fl(cols[3], yAt + 18, yGr - 2, down, P.violet, ["retour", "au sol"], "mid");
      fl(cols[4], yAt - 18, ySp, olr, P.red, ["IR vers", "espace"], "top");
      S.draw.text(c, "flux en W/m² · dont " + S.fmt(gone, 0) + " passent sans absorption", W / 2, H - 10, {size: 12, color: P.grey});
      ro.set(0, S.fmt(Ts - 273.15, 1) + " °C (" + S.fmt(Ts, 0) + " K)"); ro.set(1, S.fmt(Te - 273.15, 1) + " °C"); ro.set(2, "+" + S.fmt(Ts - Te, 1) + " K"); ro.set(3, S.fmt(surf, 0) + " W/m²"); ro.set(4, S.fmt(Ta - 273.15, 0) + " °C");
      var dF = 5.35 * Math.log(co2.value / 280), dT = 0.8 * dF;
      nt.set("Estimation indicative (à l'équilibre, autres facteurs fixes) pour " + S.fmt(co2.value, 0) + " ppm de CO₂ : forçage ΔF = 5,35·ln(C/280) = " + S.fmt(dF, 2) + " W/m², soit un réchauffement d'équilibre d'environ 0,8 × ΔF ≈ " + S.fmt(dT, 1) + " °C. Le réchauffement observé est plus faible car les océans mettent des décennies à s'équilibrer et les aérosols refroidissent.", "ok");
    });
  }
});
