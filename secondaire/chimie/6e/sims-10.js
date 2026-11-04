/* Chapitre 10 · Chimie du quotidien et analyse de substances courantes */
(function(){
function wrap(c, S, txt, x, y, maxW, opt){
  var ctx = c.ctx, size = opt.size || 13, words = String(txt).split(" "), line = "", lines = [], i;
  ctx.save(); ctx.font = (opt.weight || 700) + " " + size + "px " + (opt.math ? "'STIX Two Text', serif" : "Mulish, system-ui, sans-serif");
  for (i = 0; i < words.length; i++){ var t = line ? line + " " + words[i] : words[i]; if (ctx.measureText(t).width > maxW && line){ lines.push(line); line = words[i]; } else line = t; }
  lines.push(line); ctx.restore();
  lines.forEach(function(l, j){ S.draw.text(c, l, x, y + j * (size + 4), opt); });
  return lines.length;
}
function bis(f, lo, hi){ var a = Math.log(lo), b = Math.log(hi), m, i; for (i = 0; i < 90; i++){ m = (a + b) / 2; if (f(Math.exp(m)) > 0) b = m; else a = m; } return Math.exp((a + b) / 2); }
var FN = {
  alcool: "Alcool (–OH)", acide: "Acide carboxylique (–COOH)", ester: "Ester (–COO–)", aldehyde: "Aldéhyde (–CHO)", cetone: "Cétone (C=O)", carboxylate: "Carboxylate (–COO⁻, sel d'acide)"
};
var PROD = [
  {nom: "Limonade", ing: [
    {n: "Eau gazéifiée (H₂O + CO₂)", f: [], role: "solvant et pétillant", M: "18 / 44", txt: "Le CO₂ dissous forme un peu d'acide carbonique H₂CO₃ (pK<sub>a</sub> 6,35) : c'est ce qui donne le picotement."},
    {n: "Saccharose C₁₂H₂₂O₁₁", f: ["alcool"], role: "édulcorant", M: "342", txt: "8 groupes –OH (alcools) : très soluble dans l'eau grâce aux liaisons hydrogène."},
    {n: "Acide citrique (E330) C₆H₈O₇", f: ["acide", "alcool"], role: "acidifiant, goût acidulé", M: "192", txt: "Trois groupes –COOH et un –OH. Naturellement présent dans le citron : la molécule est la même qu'elle soit extraite ou synthétisée."},
    {n: "Benzoate de sodium (E211) C₇H₅NaO₂", f: ["carboxylate"], role: "conservateur", M: "144", txt: "Sel de sodium de l'acide benzoïque (pK<sub>a</sub> 4,2) : efficace surtout en milieu acide, sous forme d'acide benzoïque."},
    {n: "Arôme (mélange d'esters)", f: ["ester"], role: "goût de fruit", M: "variable", txt: "Beaucoup d'arômes de fruits sont des esters (chapitre 2)."}
  ]},
  {nom: "Savon de Marseille", ing: [
    {n: "Oléate / palmitate de sodium", f: ["carboxylate"], role: "tensioactif (lave)", M: "≈ 304 (oléate)", txt: "Obtenu par saponification : tête ionique COO⁻ hydrophile, longue chaîne carbonée hydrophobe."},
    {n: "Glycérol (glycérine) C₃H₈O₃", f: ["alcool"], role: "humectant", M: "92", txt: "Trois –OH : sous-produit de la saponification, conservé dans le savon artisanal."},
    {n: "Chlorure de sodium NaCl", f: [], role: "sel de relargage", M: "58,5", txt: "Utilisé pour séparer le savon de la phase aqueuse lors de la fabrication."},
    {n: "Eau", f: [], role: "solvant", M: "18", txt: "—"}
  ]},
  {nom: "Gel hydroalcoolique", ing: [
    {n: "Éthanol C₂H₆O", f: ["alcool"], role: "désinfectant", M: "46", txt: "Alcool primaire : il dénature les protéines des micro-organismes. Concentration d'environ 60–80 % en volume."},
    {n: "Glycérol C₃H₈O₃", f: ["alcool"], role: "hydratant, limite le dessèchement", M: "92", txt: "Trois –OH : retient l'eau sur la peau."},
    {n: "Peroxyde d'hydrogène H₂O₂", f: [], role: "inactive les spores présentes dans le flacon", M: "34", txt: "Oxydant (couple H₂O₂/H₂O) : pas de fonction organique, mais une réactivité redox."},
    {n: "Eau", f: [], role: "solvant", M: "18", txt: "—"}
  ]},
  {nom: "Dissolvant pour ongles", ing: [
    {n: "Propanone (acétone) C₃H₆O", f: ["cetone"], role: "solvant", M: "58", txt: "Cétone la plus simple, très volatile et inflammable : à manipuler loin de toute flamme."},
    {n: "Éthanoate d'éthyle C₄H₈O₂", f: ["ester"], role: "solvant", M: "88", txt: "Ester d'odeur fruitée (chapitre 2), solvant de nombreuses colles et vernis."},
    {n: "Glycérol C₃H₈O₃", f: ["alcool"], role: "hydratant", M: "92", txt: "Limite le dessèchement des ongles et de la peau."},
    {n: "Parfum", f: [], role: "odeur", M: "variable", txt: "Mélange complexe : composition non précisée sur l'étiquette."}
  ]},
  {nom: "Aspirine (comprimé)", ing: [
    {n: "Acide acétylsalicylique C₉H₈O₄", f: ["acide", "ester"], role: "principe actif (douleur, fièvre)", M: "180", txt: "Possède une fonction acide carboxylique et une fonction ester ; dans l'eau, l'ester peut s'hydrolyser lentement en acide salicylique et acide éthanoïque (odeur de vinaigre d'un vieux comprimé)."},
    {n: "Amidon", f: ["alcool"], role: "excipient (liant, désagrégeant)", M: "polymère", txt: "Polymère du glucose, couvert de groupes –OH."},
    {n: "Cellulose microcristalline", f: ["alcool"], role: "excipient (volume)", M: "polymère", txt: "Autre polymère du glucose."}
  ]},
  {nom: "Extrait de vanille", ing: [
    {n: "Vanilline C₈H₈O₃", f: ["aldehyde"], role: "arôme de vanille", M: "152", txt: "Porte un groupe aldéhyde –CHO, un groupe phénol et un éther. Même molécule dans la gousse de vanille et dans la vanilline synthétique : « naturel » ne veut pas dire « différent »."},
    {n: "Éthanol C₂H₆O", f: ["alcool"], role: "solvant d'extraction", M: "46", txt: "Extrait les arômes de la gousse."},
    {n: "Eau", f: [], role: "solvant", M: "18", txt: "—"}
  ]}
];
SFA.sim({
  id: "c6-c10-etiquette", ch: "c10", tag: "Classique",
  titre: "Lire une étiquette : quelles fonctions chimiques ?",
  resume: "Choisis un produit du quotidien et une fonction : quels ingrédients la portent ? Clique un ingrédient pour son rôle.",
  but: "Choisis le produit, puis la fonction recherchée : les ingrédients qui la contiennent s'allument. Clique sur une ligne (ou sur « suivant ») pour lire la formule et le rôle.",
  aRetenir: "Les ingrédients d'un produit courant se rattachent aux familles du programme : alcools (éthanol, glycérol, sucres), acides carboxyliques (acide citrique), esters (arômes), carboxylates (savons, conservateurs), cétones (acétone). Un additif E… est une substance autorisée dont on connaît la formule et le rôle.",
  piege: "« Naturel » n'est pas synonyme d'« inoffensif », ni « chimique » de « toxique » : tout est chimique, y compris l'eau et le jus de citron ; la dose et la molécule comptent, pas l'origine. Un même additif (acide citrique E330) peut être extrait du citron ou synthétisé : la molécule est identique.",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette, cur = 0;
    var pr = k.select("Produit", PROD.map(function(p, i){ return [i, p.nom]; }), 0, function(){ cur = 0; });
    var fn = k.select("Fonction recherchée", [["", "— aucune —"]].concat(Object.keys(FN).map(function(k2){ return [k2, FN[k2]]; })), "alcool");
    k.button("Ingrédient suivant", function(){ cur = (cur + 1) % PROD[pr.value].ing.length; }, true);
    var ro = k.readouts(["Ingrédients concernés", "M (g/mol)", "Rôle"]);
    var nt = k.note("", "ok");
    var rows = [];
    c.pointer(function(t, p){ if (t !== "down") return; rows.forEach(function(r, i){ if (p.y >= r[0] && p.y <= r[1]) cur = i; }); k.redraw(); });
    k.draw(function(){
      c.clear();
      var pd = PROD[pr.value], ctx = c.ctx, i, y0 = 46, rh = Math.min(48, (c.H - 70) / pd.ing.length), count = 0;
      if (cur >= pd.ing.length) cur = 0;
      rows = [];
      S.draw.text(c, "Étiquette · " + pd.nom, c.W / 2, 20, {size: 14, color: P.ink});
      pd.ing.forEach(function(g, i){
        var hit = fn.value && g.f.indexOf(fn.value) >= 0; if (hit) count++;
        var y = y0 + i * rh; rows.push([y, y + rh - 6]);
        ctx.fillStyle = hit ? "rgba(46,107,85,.2)" : "#f4f6f9"; ctx.fillRect(14, y, c.W - 28, rh - 6);
        ctx.strokeStyle = i === cur ? P.acc : (hit ? P.green : P.light); ctx.lineWidth = i === cur ? 3 : 1.4; ctx.strokeRect(14, y, c.W - 28, rh - 6);
        S.draw.text(c, g.n, 24, y + (rh - 6) / 2, {size: 13, align: "left", color: P.ink});
        if (hit) S.draw.text(c, "✓ " + FN[fn.value].split(" (")[0], c.W - 22, y + (rh - 6) / 2, {size: 12, align: "right", color: P.green});
      });
      var g = pd.ing[cur];
      ro.set(0, fn.value ? count + " sur " + pd.ing.length : "—"); ro.set(1, g.M); ro.set(2, g.role);
      nt.set("<b>" + g.n + "</b> — fonctions : " + (g.f.length ? g.f.map(function(f){ return FN[f].split(" (")[0].toLowerCase(); }).join(", ") : "aucune fonction oxygénée organique du chapitre") + ". " + g.txt, "ok");
    });
  }
});

/* ---------- dosage du vinaigre ---------- */
var VIN = [6.0, 8.0, 5.0, 7.0, 4.5, 9.0];
SFA.sim({
  id: "c6-c10-vinaigre", ch: "c10", tag: "Défi",
  titre: "Doser un vinaigre : trouve le virage de la phénolphtaléine",
  resume: "Verse la soude goutte à goutte, repère l'apparition du rose et déduis le degré du vinaigre.",
  but: "On dose 20,0 mL de vinaigre dilué 10 fois par NaOH à 0,100 mol/L. Fais avancer le volume versé jusqu'au rose persistant, puis lis le degré calculé. Révèle la valeur de l'étiquette pour comparer.",
  aRetenir: "À l'équivalence : n(NaOH) = n(CH₃COOH) soit c<sub>b</sub>·V<sub>éq</sub> = c<sub>a</sub>·V<sub>a</sub>. Pour le vinaigre dilué 10 fois : c(vinaigre) = 10 × c<sub>b</sub>·V<sub>éq</sub>/V<sub>a</sub>. Le degré (g d'acide pour 100 mL) = c × M / 10 avec M = 60 g/mol. La phénolphtaléine, dont la zone de virage (8,2–10) contient le pH d'équivalence (≈ 8,7), convient pour ce titrage.",
  piege: "Il ne faut pas oublier le facteur de dilution (× 10) : sans lui, le vinaigre paraîtrait 10 fois moins acide. Le degré commercial est en réalité exprimé en g pour 100 g (pas 100 mL) : l'écart est faible (densité ≈ 1,01) et on le néglige ici. Le pH d'équivalence est supérieur à 7, pas égal à 7.",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette, idx = 0, shown = false;
    var vb = k.slider("Volume de soude versé", 0, 40, 0.1, 5, "mL");
    k.button("Nouveau vinaigre", function(){ idx = (idx + 1) % VIN.length; shown = false; vb.set(5); }, false);
    k.button("Révéler l'étiquette", function(){ shown = true; }, true);
    var ro = k.readouts(["pH", "Couleur", "Degré calculé si V = V_éq", "Étiquette"]);
    var nt = k.note("", "ok");
    var KA = Math.pow(10, -4.76), KW = 1e-14;
    function ph(ca, V){ var Va = 20, Cb = 0.1, Vt = V, Vtot = Va + Vt, C = ca * Va / Vtot, T = Cb * Vt / Vtot; return -Math.log10(bis(function(h){ return T + h - KW / h - C * KA / (KA + h); }, 1e-15, 20)); }
    k.draw(function(){
      c.clear();
      var D = VIN[idx], ca = D / 60, Veq = ca * 20 / 0.1, ctx = c.ctx;
      var ax = S.draw.axes(c, {x0: 0, x1: 40, y0: 0, y1: 14, stepX: 5, stepY: 2, xl: "V NaOH / mL", yl: "pH"});
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.X(vb.value) - ax.L, ax.B - ax.T); ctx.clip();
      S.draw.fn(c, ax, function(x){ return ph(ca, x); }, P.acc, 3); ctx.restore();
      var p = ph(ca, vb.value), t = Math.max(0, Math.min(1, (p - 8.2) / 1.8));
      S.draw.dot(c, ax.X(vb.value), ax.Y(p), 6, P.red);
      var col = "rgb(" + [255, Math.round(255 - 225 * t), Math.round(255 - 115 * t)].join(",") + ")";
      ctx.fillStyle = col; ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ax.R - 40, ax.T + 44, 26, 0, 7); ctx.fill(); ctx.stroke();
      S.draw.text(c, "bécher", ax.R - 40, ax.T + 82, {size: 12, color: P.grey});
      var deg = vb.value * 0.1 / 20 * 10 * 60 / 10;
      ro.set(0, S.fmt(p, 2)); ro.set(1, t < 0.05 ? "incolore" : t < 0.6 ? "rose pâle" : "rose vif"); ro.set(2, S.fmt(deg, 1) + " g/100 mL"); ro.set(3, shown ? S.fmt(D, 1) + " g/100 mL (V_éq = " + S.fmt(Veq, 1) + " mL)" : "cachée");
      if (shown) nt.set("Erreur de ta mesure : " + S.fmt(Math.abs(deg - D) / D * 100, 1) + " % (à V = " + S.fmt(vb.value, 1) + " mL ; V_éq exact = " + S.fmt(Veq, 2) + " mL).", Math.abs(deg - D) / D < 0.02 ? "ok" : "warn");
      else nt.set(t < 0.05 ? "Pas encore de rose : continue d'ajouter de la soude, plus lentement près de l'équivalence." : "Le rose est apparu : le volume correspondant est ton V_éq (ni avant, ni après). Lis le degré calculé.", "ok");
    });
  }
});

/* ---------- engrais NPK ---------- */
var CUL = [
  {nom: "Blé d'hiver", N: 180, P: 70, K: 90},
  {nom: "Pommes de terre", N: 150, P: 80, K: 200},
  {nom: "Maïs fourrager", N: 160, P: 70, K: 100},
  {nom: "Prairie", N: 120, P: 50, K: 120}
];
SFA.sim({
  id: "c6-c10-engrais", ch: "c10", tag: "Dans la vraie vie",
  titre: "Engrais N-P-K : couvrir les besoins sans excès",
  resume: "Compose un engrais (% de N, P₂O₅, K₂O) et une dose : vois les apports par rapport aux besoins d'une culture.",
  but: "Choisis la culture, la composition de l'engrais et la dose par hectare. Équilibre les trois apports et surveille l'excès d'azote.",
  aRetenir: "Un engrais « 15-5-10 » contient 15 % de N, 5 % de P₂O₅ et 10 % de K₂O (en masse). Les besoins s'expriment en kg d'éléments par hectare. Pour passer de P₂O₅ à P : × 0,437 (62/142) ; de K₂O à K : × 0,830 (78/94). Apport (kg/ha) = dose (kg/ha) × teneur / 100.",
  piege: "La teneur en P et K est exprimée sous forme d'oxydes (P₂O₅, K₂O) par convention, pas en phosphore et potassium élémentaires. Un excès d'azote n'est pas absorbé : il est lessivé sous forme de nitrates vers les eaux (eutrophisation). Les besoins des cultures ci-dessous sont des valeurs illustratives, pas des recommandations agronomiques.",
  build: function(k, S){
    var c = k.canvas(300), P = S.draw.palette;
    var cu = k.select("Culture", CUL.map(function(x, i){ return [i, x.nom]; }), 0);
    var n = k.slider("Azote N dans l'engrais", 0, 30, 1, 15, "%");
    var ph = k.slider("P₂O₅ dans l'engrais", 0, 30, 1, 5, "%");
    var kk = k.slider("K₂O dans l'engrais", 0, 30, 1, 10, "%");
    var d = k.slider("Dose épandue", 0, 1500, 10, 800, "kg/ha");
    var ro = k.readouts(["N apporté", "P₂O₅ apporté", "K₂O apporté", "Dose pour couvrir N"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var q = CUL[cu.value], ctx = c.ctx, ap = [n.value * d.value / 100, ph.value * d.value / 100, kk.value * d.value / 100], bs = [q.N, q.P, q.K], nm = ["N", "P₂O₅", "K₂O"], col = [P.green, P.amber, P.violet];
      var mx = Math.max(250, ap[0], ap[1], ap[2], bs[0], bs[1], bs[2]) * 1.1, bw = c.W - 130, x0 = 70, i;
      for (i = 0; i < 3; i++){
        var y = 40 + i * 70;
        S.draw.text(c, nm[i], 14, y + 16, {size: 14, align: "left", color: col[i]});
        ctx.fillStyle = "#eef1f5"; ctx.fillRect(x0, y, bw, 22); ctx.fillStyle = col[i]; ctx.fillRect(x0, y, bw * Math.min(ap[i], mx) / mx, 22);
        S.draw.line(c, x0 + bw * bs[i] / mx, y - 6, x0 + bw * bs[i] / mx, y + 28, P.red, 2.4);
        S.draw.text(c, "apport " + S.fmt(ap[i], 0) + " · besoin " + bs[i] + " kg/ha", x0, y + 40, {size: 12, align: "left", color: P.ink});
      }
      S.draw.text(c, "Trait rouge : besoin (valeurs illustratives)", c.W / 2, c.H - 12, {size: 12, color: P.grey});
      var dN = n.value > 0 ? q.N / (n.value / 100) : null;
      ro.set(0, S.fmt(ap[0], 0) + " kg/ha"); ro.set(1, S.fmt(ap[1], 0) + " kg/ha"); ro.set(2, S.fmt(ap[2], 0) + " kg/ha"); ro.set(3, dN === null ? "— (pas d'azote)" : S.fmt(dN, 0) + " kg/ha");
      var msgs = [], warn = false;
      if (ap[0] > bs[0] * 1.05){ msgs.push("excès d'azote de " + S.fmt(ap[0] - bs[0], 0) + " kg/ha (risque de lessivage des nitrates)"); warn = true; }
      else if (ap[0] < bs[0] * 0.9) msgs.push("azote en déficit");
      if (ap[1] < bs[1] * 0.9) msgs.push("phosphore en déficit");
      if (ap[2] < bs[2] * 0.9) msgs.push("potassium en déficit");
      nt.set(msgs.length ? "À corriger : " + msgs.join(" ; ") + "." : "Apports équilibrés (écart < 10 % pour chaque élément). Soit P ≈ " + S.fmt(ap[1] * 0.437, 0) + " kg/ha et K ≈ " + S.fmt(ap[2] * 0.830, 0) + " kg/ha en éléments.", msgs.length ? "warn" : "ok");
    });
  }
});

/* ---------- chimie verte ---------- */
var PRO = [
  {nom: "Estérification directe (éthanoate d'éthyle)", eq: "CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O", reac: 106, prod: 88, dech: "eau (18)", pn: "éthanoate d'éthyle"},
  {nom: "Via le chlorure d'éthanoyle (même ester)", eq: "CH₃COCl + C₂H₅OH → CH₃COOC₂H₅ + HCl", reac: 124.5, prod: 88, dech: "HCl (36,5)", pn: "éthanoate d'éthyle"},
  {nom: "Hydratation de l'éthène (éthanol)", eq: "C₂H₄ + H₂O → C₂H₅OH", reac: 46, prod: 46, dech: "aucun", pn: "éthanol"},
  {nom: "Substitution : C₂H₅Br + NaOH (éthanol)", eq: "C₂H₅Br + NaOH → C₂H₅OH + NaBr", reac: 149, prod: 46, dech: "NaBr (103)", pn: "éthanol"},
  {nom: "Fermentation du glucose (éthanol)", eq: "C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂", reac: 180, prod: 92, dech: "CO₂ (88)", pn: "éthanol"},
  {nom: "Hydrogénation de l'éthène (éthane)", eq: "C₂H₄ + H₂ → C₂H₆", reac: 30, prod: 30, dech: "aucun", pn: "éthane"}
];
SFA.sim({
  id: "c6-c10-chimie-verte", ch: "c10", tag: "Original",
  titre: "Chimie verte : économie d'atomes et déchets",
  resume: "Compare deux procédés pour la même molécule : quelle part des atomes des réactifs finit dans le produit ?",
  but: "Choisis deux procédés et leur rendement. Compare l'économie d'atomes et le facteur E (kg de déchets par kg de produit).",
  aRetenir: "Économie d'atomes = M(produit voulu) / Σ M(réactifs, coefficients inclus) × 100. Une addition (ex. hydratation de l'éthène) conserve tous les atomes (100 %) ; une substitution rejette un sous-produit. Facteur E = (masse de réactifs − masse de produit obtenu) / masse de produit obtenu : il tient aussi compte du rendement. La chimie verte cherche à les réduire, avec peu de déchets et sans solvants toxiques.",
  piege: "Économie d'atomes et rendement sont deux choses différentes : un procédé à rendement de 100 % peut jeter plus de la moitié de la masse des réactifs (fermentation du glucose : 51 %). Un déchet comme l'eau est inoffensif, d'autres non : on ne compare pas uniquement les masses. Modèle simplifié : solvants et catalyseurs ignorés.",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette;
    var a = k.select("Procédé A", PRO.map(function(p, i){ return [i, p.nom]; }), 2);
    var ra = k.slider("Rendement de A", 40, 100, 5, 90, "%");
    var b = k.select("Procédé B", PRO.map(function(p, i){ return [i, p.nom]; }), 3);
    var rb = k.slider("Rendement de B", 40, 100, 5, 90, "%");
    var ro = k.readouts(["Économie d'atomes A", "Économie d'atomes B", "Facteur E de A", "Facteur E de B"]);
    var nt = k.note("", "ok");
    function calc(p, r){ var ea = p.prod / p.reac * 100, mp = r / 100 * p.prod, E = (p.reac - mp) / mp; return {ea: ea, E: E}; }
    k.draw(function(){
      c.clear();
      var A = PRO[a.value], B = PRO[b.value], ca = calc(A, ra.value), cb = calc(B, rb.value), ctx = c.ctx;
      function bar(y, lab, val, mx, col, unit){ var bwid = (c.W - 130) * Math.min(val, mx) / mx, txt = S.fmt(val, unit === "%" ? 0 : 2) + (unit === "%" ? " %" : ""); ctx.fillStyle = "#eef1f5"; ctx.fillRect(110, y, c.W - 130, 22); ctx.fillStyle = col; ctx.fillRect(110, y, bwid, 22); S.draw.text(c, lab, 14, y + 11, {size: 12, align: "left", color: P.ink}); if (bwid > 60) S.draw.text(c, txt, 116, y + 11, {size: 12, align: "left", color: "#fff"}); else S.draw.text(c, txt, 110 + bwid + 6, y + 11, {size: 12, align: "left", color: P.ink}); }
      S.draw.text(c, "Économie d'atomes (↑ mieux)", c.W / 2, 18, {size: 13, color: P.green});
      bar(30, "Procédé A", ca.ea, 100, P.green, "%"); bar(60, "Procédé B", cb.ea, 100, P.acc, "%");
      S.draw.text(c, "Facteur E : déchets/produit (↓ mieux)", c.W / 2, 118, {size: 13, color: P.red});
      var mxE = Math.max(2, ca.E, cb.E) * 1.05;
      bar(130, "Procédé A", ca.E, mxE, P.amber, "E"); bar(160, "Procédé B", cb.E, mxE, P.violet, "E");
      var n1 = wrap(c, S, "A : " + A.eq, 14, 206, c.W - 28, {size: 12, align: "left", color: P.ink}); S.draw.text(c, "Déchet : " + A.dech, 14, 206 + n1 * 16 + 4, {size: 12, align: "left", color: P.grey});
      var n2 = wrap(c, S, "B : " + B.eq, 14, 262, c.W - 28, {size: 12, align: "left", color: P.ink}); S.draw.text(c, "Déchet : " + B.dech, 14, 262 + n2 * 16 + 4, {size: 12, align: "left", color: P.grey});
      ro.set(0, S.fmt(ca.ea, 1) + " %"); ro.set(1, S.fmt(cb.ea, 1) + " %"); ro.set(2, S.fmt(ca.E, 2)); ro.set(3, S.fmt(cb.E, 2));
      if (A.pn !== B.pn) nt.set("Ces deux procédés ne fabriquent pas la même molécule (" + A.pn + " et " + B.pn + ") : choisis deux procédés du même produit pour une comparaison pertinente.", "warn");
      else nt.set(ca.ea === cb.ea && ca.E === cb.E ? "Procédés équivalents." : "Le meilleur facteur E est celui du procédé " + (ca.E < cb.E ? "A" : "B") + ". À rendement égal, le meilleur est celui qui a la plus haute économie d'atomes.", "ok");
    });
  }
});
})();
