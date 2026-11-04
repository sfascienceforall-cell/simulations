/* Chimie 4e · chapitre 2 · La mole et le nombre d'Avogadro */
SFA.sim({
  id:"c4-c02-echelle", ch:"c02", tag:"Échelle",
  titre:"Où se range une mole sur l'échelle des grands nombres ?",
  resume:"Choisis une quantité de matière : le nombre de particules se place sur une échelle logarithmique, face à des repères.",
  but:"Fais glisser n (de 0,001 à 100 mol) et regarde où se place N = n·N_A parmi des nombres que l'on connaît.",
  aRetenir:"1 mol = 6,02·10²³ entités (N_A). N = n · N_A. Une mole est un paquet, comme une douzaine, mais énorme : même une toute petite quantité de matière contient un nombre gigantesque de particules.",
  piege:"Une mole n'est pas une masse : 1 mol d'eau pèse 18 g, 1 mol d'or pèse 197 g. Ce qui est identique, c'est le nombre d'entités.",
  build:function(k, S){
    var c = k.canvas(300), NA = 6.02e23;
    var sub = k.select("Substance", [["H2O","Eau H₂O (molécules)"],["NaCl","Sel NaCl (unités formulaires)"],["Au","Or Au (atomes)"],["O2","Dioxygène O₂ (molécules)"]], "H2O");
    var lg = k.slider("log₁₀ de n (n = 10 puissance …)", -3, 2, 0.1, 0, "");
    var ro = k.readouts(["n", "N = n·N_A", "Masse m"]);
    var nt = k.note("", "ok");
    var marks = [[Math.log10(8e9), "humains sur Terre ≈ 8·10⁹"], [Math.log10(4e13), "cellules du corps humain ≈ 4·10¹³"], [Math.log10(7.5e18), "grains de sable sur Terre ≈ 10¹⁸ (estim.)"], [Math.log10(NA), "1 mole = 6,02·10²³"]];
    k.draw(function(){
      var n = Math.pow(10, lg.value), N = n * NA, e = Math.log10(N), M = C4.M(sub.value), m = n * M;
      c.clear();
      var L = 26, R = c.W - 24, X = function(v){ return L + (v / 26) * (R - L); }, y0 = 230;
      var ctx = c.ctx; ctx.save(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, y0); ctx.lineTo(R, y0); ctx.stroke();
      for (var v = 0; v <= 26; v += 4){ ctx.beginPath(); ctx.moveTo(X(v), y0 - 5); ctx.lineTo(X(v), y0 + 5); ctx.stroke(); C4.label(c, "10" + String(v).replace(/\d/g, function(d){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]; }), X(v), y0 + 20, "#5f6b7a", 12); }
      ctx.restore();
      marks.forEach(function(mk, i){
        var x = X(mk[0]), top = 40 + i * 38;
        S.draw.line(c, x, top + 10, x, y0, "#b8c0cc", 1, [3, 3]); S.draw.dot(c, x, y0, 4, "#8a95a3");
        C4.tag(c, mk[1], x + 4, top, i === 3 ? "#b42318" : "#2c3a4e", 12, x > c.W * 0.55 ? "right" : "left");
      });
      var xs = X(Math.max(0, Math.min(26, e)));
      S.draw.line(c, xs, 20, xs, y0, "#1e3f8f", 2.5); S.draw.dot(c, xs, y0, 7, "#1e3f8f");
      C4.label(c, "N", xs, 14, "#1e3f8f", 14);
      ro.set(0, S.fmt(n, 3) + " mol"); ro.set(1, S.sci(N, 2)); ro.set(2, S.fmt(m, m < 1 ? 3 : 1) + " g");
      var sand = N / 7.5e18;
      nt.set(N < 1e18 ? "N est plus petit que le nombre de grains de sable sur Terre (≈ " + S.sci(7.5e18, 2) + ")." : "N vaut environ " + S.sci(sand, 2) + " fois le nombre estimé de grains de sable sur Terre.", "ok");
    });
  }
});

SFA.sim({
  id:"c4-c02-sacs", ch:"c02", tag:"Classique",
  titre:"Même nombre de particules, masses différentes",
  resume:"Six « sacs » contiennent chacun la même quantité de matière : compare leurs masses.",
  but:"Choisis n. Chaque sac contient exactement le même nombre d'entités. Regarde comment les masses se répartissent.",
  aRetenir:"À quantité de matière égale, le nombre d'entités est égal, mais la masse dépend de la masse molaire : m = n · M.",
  piege:"« 1 mol d'eau et 1 mol de fer ont la même masse » est faux : 18 g contre 56 g.",
  build:function(k, S){
    var c = k.canvas(330);
    var n = k.slider("Quantité de matière n", 0.1, 3, 0.1, 1, "mol");
    var ro = k.readouts(["N dans chaque sac", "Sac le plus lourd", "Sac le plus léger"]);
    var subs = [["C","carbone"],["H2O","eau"],["Fe","fer"],["NaCl","sel"],["Cu","cuivre"],["Au","or"]];
    var cols = ["#3b4656", "#0e7490", "#8a4b2b", "#7b3fb0", "#b86a2e", "#b8860b"];
    k.draw(function(){
      var nn = n.value, N = nn * 6.02e23; c.clear();
      var W = c.W, bw = (W - 40) / 6, base = 270, sc = 200 / 600;
      subs.forEach(function(s, i){
        var m = nn * C4.M(s[0]), x = 20 + i * bw, h = Math.max(3, m * sc);
        C4.rr(c.ctx, x + 6, base - h, bw - 12, h, 3); c.ctx.fillStyle = cols[i]; c.ctx.fill();
        C4.label(c, S.fmt(m, 1) + " g", x + bw / 2, base - h - 12, "#0f1b2d", 12);
        C4.label(c, C4.uni(s[0]), x + bw / 2, base + 14, "#2c3a4e", 12);
        C4.label(c, s[1], x + bw / 2, base + 30, "#5f6b7a", 11);
      });
      C4.label(c, "Chaque barre : N = " + C4.sciU(N, 2) + " entités", W / 2, 16, "#1e3f8f", 13);
      var ms = subs.map(function(s){ return nn * C4.M(s[0]); });
      ro.set(0, S.sci(N, 2)); ro.set(1, "or : " + S.fmt(Math.max.apply(0, ms), 1) + " g"); ro.set(2, "carbone : " + S.fmt(Math.min.apply(0, ms), 1) + " g");
    });
  }
});

SFA.sim({
  id:"c4-c02-oleique", ch:"c02", tag:"Expérience",
  titre:"Estimer N_A avec un film d'acide oléique",
  resume:"Une goutte d'acide oléique s'étale en une couche d'une seule molécule d'épaisseur : on en déduit un ordre de grandeur de N_A.",
  but:"Règle la masse d'acide et la surface mesurée du film, puis compare l'estimation de N_A avec 6,02·10²³ pour deux modèles de molécule.",
  aRetenir:"Épaisseur du film e = V / S. En comptant le volume occupé par une molécule, N = V / V_molécule puis N_A = N / n avec n = m / M. Même avec un modèle grossier, on trouve un ordre de grandeur de 10²² à 10²⁴.",
  piege:"Un modèle trop simple (molécule « cubique ») donne un résultat 20 à 30 fois trop petit : la molécule est longue et mince, pas cubique. Le résultat dépend fortement de la surface mesurée (au cube dans le modèle cubique).",
  build:function(k, S){
    var c = k.canvas(300), RHO = 0.895, MO = 282;
    var m = k.slider("Masse d'acide dans la goutte", 0.02, 0.10, 0.01, 0.05, "mg");
    var Sf = k.slider("Surface du film mesurée", 100, 800, 10, 220, "cm²");
    var mod = k.seg("Modèle de molécule", [["cube","Cube (arête e)"],["baton","Bâtonnet 0,5 nm × 0,5 nm"]], "baton");
    var ro = k.readouts(["Épaisseur e", "n d'acide oléique", "N molécules", "N_A estimé"]);
    var nt = k.note("", "");
    k.draw(function(){
      var mg = m.value / 1000, V = mg / RHO, Sc = Sf.value, e = V / Sc;      /* cm³, cm */
      var enm = e * 1e7, n = mg / MO, Vnm = V * 1e21, N;
      if (mod.value === "cube") N = Vnm / Math.pow(enm, 3); else N = Vnm / (enm * 0.25);
      var NA = N / n;
      c.clear(); var W = c.W, ctx = c.ctx;
      var cx = W * 0.27, cy = 100, rad = Math.min(80, 20 + Math.sqrt(Sc / 800) * 70);
      ctx.fillStyle = "#cfe3f0"; ctx.fillRect(10, 20, W * 0.5 - 20, 160); ctx.strokeStyle = "#5f6b7a"; ctx.strokeRect(10, 20, W * 0.5 - 20, 160);
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 7); ctx.fillStyle = "rgba(244,197,66,.75)"; ctx.fill(); ctx.strokeStyle = "#b45309"; ctx.stroke();
      C4.label(c, "vue de dessus", cx, 195, "#5f6b7a", 12);
      C4.label(c, "S = " + S.fmt(Sc, 0) + " cm²", cx, cy, "#7a3d00", 13);
      var sx = W * 0.54, sw = W * 0.42, ey = 120, ht = Math.max(4, Math.min(110, enm * 36));
      ctx.fillStyle = "#cfe3f0"; ctx.fillRect(sx, ey, sw, 60); ctx.strokeStyle = "#5f6b7a"; ctx.strokeRect(sx, ey, sw, 60);
      var nb = 9;
      for (var i = 0; i < nb; i++){
        var x = sx + (i + 0.5) * sw / nb, wd = mod.value === "cube" ? ht : Math.max(3, 0.5 * 36 * 0.9);
        ctx.fillStyle = "#b45309"; ctx.fillRect(x - wd / 2 + 1, ey - ht, Math.max(2, wd - 2), ht);
        S.draw.dot(c, x, ey + 2, 3, "#0e7490");
      }
      C4.label(c, "vue de côté : e = " + S.fmt(enm, 2) + " nm", sx + sw / 2, 195, "#5f6b7a", 12);
      C4.label(c, "(échelle dilatée)", sx + sw / 2, 212, "#5f6b7a", 11);
      var ratio = NA / 6.02e23;
      C4.label(c, "Estimation : " + C4.sciU(NA, 2) + " mol⁻¹  (" + S.fmt(100 * ratio, 0) + " % de N_A)", W / 2, 256, "#1e3f8f", 14);
      C4.label(c, "valeur de référence : 6,02·10²³ mol⁻¹", W / 2, 278, "#5f6b7a", 12);
      ro.set(0, S.fmt(enm, 2) + " nm"); ro.set(1, S.sci(n, 3) + " mol"); ro.set(2, S.sci(N, 2)); ro.set(3, S.sci(NA, 2));
      nt.set(ratio > 0.5 && ratio < 2 ? "Bon ordre de grandeur : à un facteur 2 près." : ratio < 0.5 ? "Trop petit : ce modèle sous-estime le nombre de molécules (ou la surface est trop petite)." : "Trop grand : la surface ou le modèle surestime N.", ratio > 0.5 && ratio < 2 ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id:"c4-c02-souffle", ch:"c02", tag:"Niche",
  titre:"Combien de molécules dans un souffle ?",
  resume:"Un volume d'air respiré contient un nombre colossal de molécules : n = V / V_m, puis N = n·N_A.",
  but:"Règle le volume d'air et la température. Observe n, N, la masse et la répartition en N₂, O₂, Ar.",
  aRetenir:"Pour un gaz : n = V / V_m (V_m ≈ 24 L/mol à 20 °C et 1 atm), puis N = n · N_A. L'air contient environ 78 % de N₂, 21 % de O₂ et 1 % d'argon en nombre de molécules.",
  piege:"Même un petit volume de gaz contient un nombre énorme de molécules, mais elles sont très espacées : la mole de gaz occupe 24 L, pas un dé à coudre.",
  build:function(k, S){
    var c = k.canvas(260);
    var V = k.slider("Volume d'air", 0.1, 6, 0.1, 0.5, "L");
    var T = k.slider("Température", 0, 40, 1, 20, "°C");
    var ro = k.readouts(["V_m à cette T", "n", "N molécules", "Masse d'air", "N de O₂", "N de N₂"]);
    var rnd = C4.rnd(7), pts = [];
    for (var i = 0; i < 160; i++) pts.push([rnd(), rnd(), rnd()]);
    k.draw(function(){
      var Vm = 24 * (T.value + 273) / 293, n = V.value / Vm, N = n * 6.02e23, mass = n * 29;
      c.clear(); var W = c.W, ctx = c.ctx;
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 2; C4.rr(ctx, 14, 14, W - 28, 190, 14); ctx.stroke(); ctx.fillStyle = "#f6f9fc"; ctx.fill();
      pts.forEach(function(p){
        var col = p[2] < 0.78 ? "#2f56b3" : p[2] < 0.99 ? "#c23a2f" : "#6c7d90";
        S.draw.dot(c, 26 + p[0] * (W - 52), 26 + p[1] * 166, 3.2, col);
      });
      C4.label(c, "Chaque point ≈ 1/160 du contenu (proportions réelles)", W / 2, 224, "#5f6b7a", 12);
      C4.label(c, "bleu : N₂ (78 %) · rouge : O₂ (21 %) · gris : Ar (1 %)", W / 2, 244, "#2c3a4e", 12);
      ro.set(0, S.fmt(Vm, 1) + " L/mol"); ro.set(1, S.fmt(n, 4) + " mol"); ro.set(2, S.sci(N, 2)); ro.set(3, S.fmt(mass, 2) + " g"); ro.set(4, S.sci(0.21 * N, 2)); ro.set(5, S.sci(0.78 * N, 2));
    });
    k.note("Modèle : V<sub>m</sub> = 24 L/mol à 20 °C, ajusté proportionnellement à la température absolue (gaz parfait) ; masse molaire moyenne de l'air ≈ 29 g/mol.", "");
  }
});
