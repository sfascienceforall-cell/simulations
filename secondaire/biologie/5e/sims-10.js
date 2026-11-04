/* Chapitre 10 · Embryogenèse, développement et grossesse */
(function(){
/* SA : semaines d'aménorrhée (depuis les dernières règles) ; semaine de développement = SA − 2 */
var GROW = [[4, 0.0, 0.0], [8, 1.6, 1], [10, 3.1, 4], [12, 5.4, 14], [14, 8.7, 43], [16, 11.6, 100], [18, 14.2, 190], [20, 25.6, 300], [24, 30, 600], [28, 37.6, 1000], [32, 42.4, 1700], [36, 47.4, 2600], [40, 51.2, 3400]];
var EVT = [[4, "Nidation terminée ; l'embryon est un disque de cellules ; le trophoblaste sécrète l'hCG"], [5, "La plaque neurale se ferme en tube neural (futur système nerveux)"], [6, "Le cœur commence à battre (visible à l'échographie)"], [7, "Bourgeons des bras et des jambes ; ébauches des yeux et des oreilles"], [8, "Les doigts se dessinent ; le squelette cartilagineux apparaît"], [10, "Fin de l'organogenèse : l'embryon devient un fœtus (10 SA)"], [12, "Organes génitaux externes en cours de différenciation ; le fœtus bouge"], [16, "Le squelette est visible à l'échographie ; le fœtus peut sucer son pouce"], [20, "La mère perçoit les mouvements ; peau recouverte de vernix"], [24, "Poumons en maturation : la viabilité devient possible avec soins intensifs"], [28, "Yeux ouverts, réserves de graisse qui s'accumulent"], [32, "Poumons presque matures, prise de poids rapide"], [37, "À terme : tous les organes sont fonctionnels"], [40, "Date prévue de l'accouchement (40 SA)"]];
function grow(sa){ var pts = GROW; return {len: B5.interp(pts.map(function(p){ return [p[0], p[1]]; }), sa), w: B5.interp(pts.map(function(p){ return [p[0], p[2]]; }), sa)}; }
SFA.sim({
  id: "b5-c10-frise", ch: "c10", tag: "Frise",
  titre: "La frise du développement : de la nidation à la naissance",
  resume: "Semaine de grossesse → stade, taille, masse et événements marquants.",
  but: "Déplace le curseur de 4 à 41 semaines d'aménorrhée (SA). Repère le passage d'embryon à fœtus, la croissance en masse (plus de 3 000 fois en 30 semaines) et les grandes étapes. Convertis les SA en semaines de développement.",
  aRetenir: "En Belgique on compte la grossesse en semaines d'aménorrhée (SA), à partir du début des dernières règles : la fécondation a lieu vers 2 SA. L'embryon devient un fœtus à 10 SA, quand l'organogenèse est terminée : après cela, les organes grandissent et mûrissent. La croissance en masse est surtout tardive : environ la moitié du poids de naissance (1 700 g sur 3 400 g) se gagne après 32 SA.",
  piege: "Un embryon n'est pas un « petit adulte » : à 8 SA il mesure 1,6 cm (de la tête au bassin) et pèse environ 1 g. Il ne respire pas par les poumons : le placenta assure les échanges. Valeurs moyennes arrondies ; la taille est mesurée tête–bassin avant 20 SA, tête–talon ensuite.",
  build: function(k, S){
    var c = k.canvas(260), pal = S.draw.palette;
    var sa = k.slider("Semaines d'aménorrhée (SA)", 4, 41, 1, 12, "SA");
    var ro = k.readouts(["Semaines de développement", "Stade", "Taille", "Masse"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var g = grow(Math.min(sa.value, 40)), ax = S.draw.axes(c, {x0: 4, x1: 41, y0: 0, y1: 3500, xl: "SA", yl: "masse (g)", stepX: 4, stepY: 500}), pts = [], x;
      for (x = 4; x <= 40; x += 0.5) pts.push([x, grow(x).w]);
      c.ctx.fillStyle = "rgba(91,33,182,.08)"; c.ctx.fillRect(ax.X(4), ax.T, ax.X(10) - ax.X(4), ax.B - ax.T); S.draw.text(c, "embryon", ax.X(7), ax.T + 14, {size: 12, color: pal.violet});
      S.draw.text(c, "fœtus", ax.X(25), ax.T + 14, {size: 12, color: pal.violet});
      B5.poly(c, ax, pts, pal.violet, 2.8); S.draw.line(c, ax.X(sa.value), ax.T, ax.X(sa.value), ax.B, pal.ink, 1.4, [5, 4]); S.draw.dot(c, ax.X(Math.min(sa.value, 40)), ax.Y(g.w), 6, pal.red);
      /* silhouette proportionnelle à la taille (échelle fixe 0–55 cm) */
      var hpx = (ax.B - ax.T) * 0.9 * g.len / 55, cx = ax.L + 70, base = ax.B - 4;
      B5.rect(c, cx - 7, base - hpx, 14, Math.max(2, hpx), "rgba(180,35,24,.35)", pal.red, 1.2);
      B5.circ(c, cx, base - hpx - 5, Math.max(2, hpx * 0.14), "rgba(180,35,24,.35)", pal.red, 1.2);
      var ev = EVT[0]; EVT.forEach(function(e){ if (sa.value >= e[0]) ev = e; });
      var st = sa.value < 10 ? "embryon" : "fœtus";
      ro.set(0, (sa.value - 2) + " sem."); ro.set(1, st); ro.set(2, S.fmt(g.len, 1) + " cm" + (sa.value < 20 ? " (tête–bassin)" : " (tête–talon)")); ro.set(3, g.w < 10 ? S.fmt(g.w, 1) + " g" : S.fmt(g.w, 0) + " g");
      nt.set(ev[1] + ".", "ok");
    });
  }
});

/* ---------- placenta ---------- */
function sat(P, p50){ var n = 2.7, a = Math.pow(P, n), b = Math.pow(p50, n); return a / (a + b); }
SFA.sim({
  id: "b5-c10-placenta", ch: "c10", tag: "Échanges",
  titre: "Le placenta : diffusion de l'oxygène et hémoglobine fœtale",
  resume: "Surface, épaisseur, PO₂ des sangs, CO → flux d'O₂ et saturation des hémoglobines.",
  but: "Le sang de la mère et celui du fœtus ne se mélangent pas : les gaz diffusent à travers la barrière placentaire. Règle surface, épaisseur et pressions d'O₂ ; compare les courbes de saturation de l'hémoglobine maternelle (HbA) et fœtale (HbF). Observe l'effet du monoxyde de carbone (tabagisme).",
  aRetenir: "Les échanges respectent la loi de diffusion : flux ≈ surface × différence de pression / épaisseur. Plus la surface est grande, la barrière fine, le gradient fort, plus le flux est élevé. L'hémoglobine fœtale a plus d'affinité pour l'O₂ que l'hémoglobine maternelle (courbe décalée vers la gauche) : à PO₂ égale, elle capte davantage d'O₂.",
  piege: "Le sang de la mère et celui du fœtus ne se mélangent pas (ils sont séparés par la barrière placentaire, sauf accident). Le fœtus ne respire pas par ses poumons : le sang oxygéné arrive par la veine ombilicale. Modèle simplifié : P50 = 27 mmHg (HbA) et 19 mmHg (HbF), exposant 2,7.",
  build: function(k, S){
    var c1 = k.canvas(210), c2 = k.canvas(160), pal = S.draw.palette;
    var sf = k.slider("Surface d'échange du placenta", 2, 14, 1, 12, "m²");
    var ep = k.slider("Épaisseur de la barrière", 2, 25, 1, 5, "µm");
    var pm = k.slider("PO₂ du sang maternel (espace intervilleux)", 25, 60, 1, 40, "mmHg");
    var pf = k.slider("PO₂ du sang fœtal à la sortie du placenta", 12, 40, 1, 30, "mmHg");
    var co = k.slider("Monoxyde de carbone (tabagisme) : Hb fœtale occupée", 0, 15, 1, 0, "%");
    var ro = k.readouts(["Flux d'O₂ (référence = 100 %)", "Saturation mère (HbA)", "Saturation fœtus (HbF)", "O₂ transporté (fœtus)"]);
    var nt = k.note("", "");
    k.draw(function(){
      c1.clear();
      var ax = S.draw.axes(c1, {x0: 0, x1: 80, y0: 0, y1: 100, xl: "PO₂ (mmHg)", yl: "saturation (%)", stepX: 10, stepY: 25}), a = [], b = [], x;
      for (x = 0; x <= 80; x += 1){ a.push([x, 100 * sat(x, 27)]); b.push([x, 100 * sat(x, 19)]); }
      B5.poly(c1, ax, a, pal.red, 2.6); B5.poly(c1, ax, b, pal.violet, 2.6);
      B5.leg(c1, [["HbA (mère)", pal.red], ["HbF (fœtus)", pal.violet]], ax.L + 8, ax.T + 34);
      var sM = sat(pm.value, 27), sF = sat(pf.value, 19);
      S.draw.dot(c1, ax.X(pm.value), ax.Y(100 * sM), 7, pal.red); S.draw.dot(c1, ax.X(pf.value), ax.Y(100 * sF), 7, pal.violet);
      var flux = (sf.value / 12) * ((pm.value - pf.value) / 10) / (ep.value / 5) * 100;
      var cM = 1.34 * 12.5 * sM + 0.003 * pm.value, cF = (1.34 * 16 * sF + 0.003 * pf.value) * (1 - co.value / 100);
      c2.clear();
      var W = c2.W, x0 = 14, bw = W - 28;
      S.draw.text(c2, "Flux d'O₂ relatif : " + S.fmt(Math.max(0, flux), 0) + " %", x0, 16, {align: "left", size: 12});
      B5.bar(c2, x0, 26, bw, 16, Math.max(0, flux) / 200, flux < 70 ? pal.red : pal.green); S.draw.line(c2, x0 + bw / 2, 22, x0 + bw / 2, 46, pal.ink, 1.5);
      S.draw.text(c2, "O₂ pour 100 mL de sang :", x0, 62, {align: "left", size: 12});
      S.draw.text(c2, "mère " + S.fmt(cM, 1) + " mL · fœtus " + S.fmt(cF, 1) + " mL", x0, 78, {align: "left", size: 12});
      B5.bar(c2, x0, 90, bw / 2 - 4, 14, cM / 25, pal.red); B5.bar(c2, x0 + bw / 2 + 4, 90, bw / 2 - 4, 14, cF / 25, pal.violet);
      B5.wrap(c2, "(échelle 0 à 25 mL ; Hb mère 12,5 g/dL, Hb fœtus 16 g/dL)", x0, 128, W - 28, 15, {size: 12, color: pal.grey});
      ro.set(0, pm.value > pf.value ? S.fmt(flux, 0) + " %" : "nul ou inversé"); ro.set(1, S.fmt(sM * 100, 0) + " %"); ro.set(2, S.fmt(sF * 100, 0) + " %"); ro.set(3, S.fmt(cF, 1) + " mL / 100 mL");
      if (pm.value <= pf.value) nt.set("Pas de gradient de pression (PO₂ maternelle ≤ fœtale) : l'O₂ ne diffuse plus de la mère vers le fœtus.", "warn");
      else if (flux < 70) nt.set("Flux réduit à " + S.fmt(flux, 0) + " % de la référence : surface trop petite, barrière trop épaisse ou gradient trop faible (hypoxie fœtale possible).", "warn");
      else nt.set("À PO₂ du fœtus de " + pf.value + " mmHg, l'HbF est saturée à " + S.fmt(sF * 100, 0) + " % alors que l'HbA le serait à " + S.fmt(sat(pf.value, 27) * 100, 0) + " % : l'hémoglobine fœtale capte mieux l'O₂ à faible pression.", "ok");
    });
  }
});

/* ---------- tératogènes ---------- */
var ORG = [["Système nerveux", 3, 16, 3, 5], ["Cœur", 3, 8, 4, 6], ["Membres", 4, 8, 4, 6], ["Yeux", 4, 9, 5, 7], ["Oreilles", 4, 9, 5, 8], ["Palais", 6, 12, 6, 9], ["Organes génitaux ext.", 7, 16, 8, 12]];
var AG = {
  a: {nom: "Alcool", w: [1.0, 0.4, 0.1, 0.4, 0.1, 0.3, 0.1], txt: "L'alcool traverse le placenta : le système nerveux reste vulnérable toute la grossesse ; il n'existe pas de dose sûre connue."},
  r: {nom: "Rubéole (infection maternelle)", w: [0.6, 0.9, 0, 1.0, 1.0, 0, 0], txt: "Le virus de la rubéole atteint le fœtus : cataracte, surdité, malformation cardiaque, surtout en début de grossesse. La vaccination prévient."},
  t: {nom: "Thalidomide (médicament)", w: [0.1, 0.5, 1.0, 0.5, 0.7, 0, 0], txt: "Le thalidomide (années 1950–60) a provoqué des malformations des membres : il agit sur une fenêtre étroite du développement."},
  v: {nom: "Rétinoïdes (acné sévère)", w: [0.9, 0.8, 0, 0.5, 0.9, 0.5, 0], txt: "Ces dérivés de la vitamine A, très tératogènes, sont contre-indiqués pendant la grossesse (contraception obligatoire)."}
};
function sens(o, w){ var O = ORG[o]; if (w < O[1] || w > O[2]) return 0; return (w >= O[3] && w <= O[4]) ? 2 : 1; }
SFA.sim({
  id: "b5-c10-teratogenes", ch: "c10", tag: "Périodes critiques",
  titre: "Tératogènes : tout dépend du moment",
  resume: "Agent, dose et semaine d'exposition → organes à risque.",
  but: "Choisis une substance, une dose, et la semaine d'exposition (en semaines après la fécondation). Lis le niveau de risque pour chaque organe et repère sur la carte les périodes où chaque organe est le plus vulnérable.",
  aRetenir: "Un tératogène est un agent qui perturbe le développement de l'embryon. L'effet dépend de la substance, de la dose et surtout du moment : un organe est vulnérable pendant sa formation (organogenèse, surtout entre les semaines 3 et 8 après la fécondation). Avant la nidation (semaines 1–2), c'est le « tout ou rien » : soit la grossesse s'interrompt, soit l'embryon se développe normalement.",
  piege: "« Une petite quantité ne peut pas faire de mal » est faux pour l'alcool (aucune dose sûre connue). Et le tératogène n'a pas le même effet à toutes les semaines : une exposition tardive à un médicament qui malforme le cœur n'a plus cet effet, mais peut affecter d'autres organes. Fenêtres de vulnérabilité simplifiées (d'après des schémas classiques d'embryologie), indices qualitatifs.",
  build: function(k, S){
    var c = k.canvas(345), pal = S.draw.palette;
    var ag = k.select("Agent", [["a", AG.a.nom], ["r", AG.r.nom], ["t", AG.t.nom], ["v", AG.v.nom]], "t");
    var w = k.slider("Semaine d'exposition (après fécondation)", 1, 16, 1, 5, "");
    var dose = k.slider("Intensité de l'exposition", 10, 100, 10, 80, "%");
    var ro = k.readouts(["Organe le plus à risque", "Indice de risque", "Période", "Dose"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var W = c.W, X0 = W < 420 ? 118 : 130, cw = (W - X0 - 14) / 16, rh = 24, Y0 = 46, A = AG[ag.value], i, j, best = -1, bi = -1;
      for (j = 1; j <= 16; j++) if (cw >= 18 || j % 2 === 1 || j === w.value) S.draw.text(c, String(j), X0 + (j - 0.5) * cw, 34, {size: 12, color: j === w.value ? pal.red : pal.grey, maxW: 30});
      S.draw.text(c, "semaines après la fécondation", X0, 12, {align: "left", size: 12, color: pal.grey});
      for (i = 0; i < ORG.length; i++){
        var y = Y0 + i * (rh + 6), wt = A.w[i];
        S.draw.text(c, ORG[i][0], 8, y + rh / 2, {align: "left", size: 12});
        for (j = 1; j <= 16; j++){
          var s = sens(i, j), a = s === 2 ? 0.9 : s === 1 ? 0.4 : 0.07;
          c.ctx.fillStyle = "rgba(91,33,182," + (wt > 0 ? a : a * 0.35) + ")"; c.ctx.fillRect(X0 + (j - 1) * cw + 1, y, cw - 2, rh);
        }
        var sc = sens(i, w.value) * wt * dose.value / 2; if (sc > best){ best = sc; bi = i; }
        var bx = X0 - 14; B5.rect(c, bx, y + 4, 6, rh - 8, sc > 0 ? (sc > 50 ? pal.red : pal.amber) : "#e3e7ed", null);
      }
      var H = Y0 + ORG.length * (rh + 6);
      c.ctx.strokeStyle = pal.red; c.ctx.lineWidth = 2; c.ctx.strokeRect(X0 + (w.value - 1) * cw, Y0 - 4, cw, H - Y0 + 2);
      B5.wrap(c, "Teinte foncée : fenêtre de vulnérabilité maximale ; clair : sensibilité plus faible ; pâle : agent peu actif sur cet organe. La barre à gauche donne l'indice de risque à la semaine choisie.", 8, H + 12, W - 16, 15, {size: 12, color: pal.grey});
      var per = w.value <= 2 ? "tout ou rien (avant et pendant la nidation)" : w.value <= 8 ? "organogenèse : période la plus sensible" : "période fœtale : croissance et maturation";
      ro.set(0, best > 0 ? ORG[bi][0] : "aucun"); ro.set(1, S.fmt(best, 0) + " / 100"); ro.set(2, per); ro.set(3, dose.value + " %");
      nt.set((w.value <= 2 ? "Semaines 1 à 2 : une exposition à cette période a un effet « tout ou rien » : mort de l'embryon ou développement normal. " : "") + A.txt, best > 50 ? "warn" : "ok");
    });
  }
});

/* ---------- jumeaux ---------- */
SFA.sim({
  id: "b5-c10-jumeaux", ch: "c10", tag: "Original",
  titre: "Jumeaux : à quel moment l'embryon se divise-t-il ?",
  resume: "Jour de la division ou deux ovocytes → type de jumeaux, placentas, estimation de Weinberg.",
  but: "Choisis si les jumeaux viennent de deux ovocytes fécondés (dizygotes) ou d'un seul zygote qui se divise (monozygotes), et le jour de la division. Observe le nombre de placentas et de poches amniotiques, puis utilise la proportion de jumeaux monozygotes pour estimer le nombre de paires de sexes différents.",
  aRetenir: "Jumeaux dizygotes (« faux jumeaux ») : deux ovocytes fécondés par deux spermatozoïdes, génétiquement comme des frères et sœurs (50 % en commun), sexes pouvant différer. Jumeaux monozygotes : un zygote qui se divise ; génome identique, même sexe. Le moment de la division détermine placentas et poches : plus la division est tardive, plus les structures sont partagées.",
  piege: "Des jumeaux de sexes différents sont toujours dizygotes ; des jumeaux de même sexe ne sont pas forcément monozygotes (la moitié des dizygotes est du même sexe). Les chiffres sont des ordres de grandeur ; la naissance de jumeaux monozygotes (≈ 3 à 4 pour 1 000 naissances) est quasi constante dans le monde, celle de dizygotes varie.",
  build: function(k, S){
    var c = k.canvas(250), pal = S.draw.palette;
    var typ = k.seg("Origine", [["mz", "Un zygote (monozygotes)"], ["dz", "Deux zygotes (dizygotes)"]], "mz");
    var dj = k.slider("Jour de la division du zygote", 1, 14, 1, 5, "j");
    var pm = k.slider("Part de monozygotes parmi les paires de jumeaux", 10, 60, 1, 33, "%");
    var ro = k.readouts(["Type", "Placentas / poches amniotiques", "Paires de sexes différents (sur 1 000)", "Estimation de Weinberg des monozygotes"]);
    var nt = k.note("", "");
    function struct(){
      if (typ.value === "dz") return {t: "dizygotes", pl: 2, am: 2, gen: "50 % comme des frères et sœurs", st: "dichoriale diamniotique"};
      var d = dj.value;
      if (d <= 3) return {t: "monozygotes", pl: 2, am: 2, gen: "identique", st: "dichoriale diamniotique (≈ 30 %)"};
      if (d <= 8) return {t: "monozygotes", pl: 1, am: 2, gen: "identique", st: "monochoriale diamniotique (≈ 65–70 %)"};
      if (d <= 12) return {t: "monozygotes", pl: 1, am: 1, gen: "identique", st: "monochoriale monoamniotique (≈ 1–2 %)"};
      return {t: "monozygotes", pl: 1, am: 1, gen: "identique, jumeaux conjoints (très rare)", st: "conjoints"};
    }
    k.draw(function(){
      c.clear();
      var s = struct(), W = c.W, cx = W / 2, cy = 82, i, ctx = c.ctx;
      var X0 = 20, TW = W - 40;
      var seg = [[0, 3.5, "#cfe3f1", "di-di"], [3.5, 8.5, "#e6d9f7", "mono-di"], [8.5, 12.5, "#fde3d6", "mono-mono"], [12.5, 16, "#f6c9c9", "conjoints"]];
      seg.forEach(function(g){ B5.rect(c, X0 + TW * g[0] / 16, 20, TW * (g[1] - g[0]) / 16, 22, g[2], "#8a95a3", 1); S.draw.text(c, g[3], X0 + TW * (g[0] + g[1]) / 32, 31, {size: 12}); });
      if (typ.value === "mz"){ S.draw.line(c, X0 + TW * dj.value / 16, 14, X0 + TW * dj.value / 16, 48, pal.red, 2.4); S.draw.text(c, "j" + dj.value, X0 + TW * dj.value / 16, 8, {size: 12, color: pal.red}); }
      S.draw.text(c, "jour de la division après la fécondation (0 à 16)", X0, 58, {align: "left", size: 12, color: pal.grey});
      if (typ.value === "dz" || s.pl === 2){
        [cx - 80, cx + 80].forEach(function(x, j){ B5.circ(c, x, 142, 54, "#faf7ff", pal.violet, 2); B5.circ(c, x, 142, 30, "#fff", pal.teal, 1.5); B5.circ(c, x, 142, 8, typ.value === "dz" ? (j ? pal.amber : pal.red) : pal.red); });
        S.draw.text(c, "2 chorions (2 placentas), 2 amnios", cx, 218, {size: 12});
      } else if (s.am === 2){
        B5.circ(c, cx, 142, 78, "#faf7ff", pal.violet, 2); [cx - 36, cx + 36].forEach(function(x){ B5.circ(c, x, 142, 30, "#fff", pal.teal, 1.5); B5.circ(c, x, 142, 8, pal.red); });
        S.draw.text(c, "1 chorion (1 placenta), 2 amnios", cx, 232, {size: 12});
      } else {
        B5.circ(c, cx, 142, 78, "#faf7ff", pal.violet, 2); B5.circ(c, cx, 142, 52, "#fff", pal.teal, 1.5); B5.circ(c, cx - 14, 142, 8, pal.red); B5.circ(c, cx + 14, 142, 8, pal.red);
        S.draw.text(c, s.st === "conjoints" ? "embryons partiellement séparés" : "1 chorion, 1 amnios : cordons à risque d'enchevêtrement", cx, 232, {size: 12});
      }
      var p = pm.value / 100, ps = 1000 * (1 - p) / 2, same = 1000 * p + 1000 * (1 - p) / 2, ws = (same - ps) / 10;
      ro.set(0, s.t); ro.set(1, s.pl + " / " + s.am); ro.set(2, S.fmt(ps, 0)); ro.set(3, S.fmt(ws, 0) + " %");
      nt.set(typ.value === "dz" ? "Deux ovocytes, deux spermatozoïdes, deux placentas : génétiquement des frères et sœurs nés ensemble. Si 33 % des paires sont monozygotes : " + S.fmt(ps, 0) + " paires sur 1 000 sont de sexes différents (toutes dizygotes)." : "Division au jour " + dj.value + " : " + s.st + ". Génome " + s.gen + ". Estimation de Weinberg : (paires de même sexe − paires de sexes différents) / total = " + S.fmt(ws, 0) + " % de monozygotes, égale à la valeur choisie.", "ok");
    });
  }
});
})();
