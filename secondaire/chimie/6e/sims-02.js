/* Chapitre 2 · Estérification, hydrolyse et saponification */
(function(){
var K = 4;   /* constante d'équilibre d'estérification (alcool primaire), valeur arrondie */
function xeq(a, b, f){
  /* K (a-x)(b-x) = x^2 (1-f)  avec f = fraction de l'eau formée retirée */
  var A = K - (1 - f), B = -K * (a + b), C = K * a * b;
  return (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
}
SFA.sim({
  id: "c6-c02-equilibre", ch: "c02", tag: "Classique",
  titre: "Estérification : une réaction qui s'arrête à un équilibre",
  resume: "Acide + alcool ⇌ ester + eau : regarde le quotient Q rejoindre la constante K = 4 et lis le rendement.",
  but: "Choisis les quantités d'acide et d'alcool, puis relance. Les barres montrent la composition au cours du temps ; Q = K quand l'équilibre est atteint.",
  aRetenir: "L'estérification est limitée (≈ 67 % de rendement avec des quantités égales d'acide et d'alcool primaire) : la réaction inverse, l'hydrolyse, se produit en même temps. À l'équilibre, Q = [ester][eau] / ([acide][alcool]) = K.",
  piege: "Un rendement de 67 % ne veut pas dire que la réaction est « ratée » ou qu'elle s'arrête faute de temps : à l'équilibre, la composition ne change plus parce que les deux réactions se compensent. Un catalyseur (H⁺) accélère, il ne change pas K.",
  build: function(k, S){
    var c = k.canvas(300), P = S.draw.palette, t = 0;
    var a = k.slider("n(acide) au départ", 0.1, 3, 0.1, 1, "mol", function(){ restart(); });
    var b = k.slider("n(alcool) au départ", 0.1, 3, 0.1, 1, "mol", function(){ restart(); });
    function restart(){ t = 0; lp.reset(); lp.play(); }
    k.button("Relancer", restart, true);
    var ro = k.readouts(["Q", "K", "n(ester)", "Rendement"]);
    k.note("Modèle simplifié : volume constant, K = 4 (alcool primaire, 25 °C environ), eau non solvant.");
    var lp = k.loop(function(dt, tt){ t = tt; k.redraw(); if (tt > 7) lp.pause(); });
    lp.play();
    k.draw(function(){
      c.clear();
      var A = a.value, B = b.value, xe = xeq(A, B, 0), x = xe * (1 - Math.exp(-t / 1.4));
      var names = ["acide", "alcool", "ester", "eau"], vals = [A - x, B - x, x, x], cols = [P.red, P.amber, P.green, P.teal];
      var ymax = Math.max(A, B, 0.3) * 1.15, bw = Math.min(54, (c.W - 100) / 4 - 14), base = c.H - 44, top = 28, i;
      S.draw.line(c, 36, base, c.W - 12, base, P.grey, 1.5);
      for (i = 0; i < 4; i++){
        var h = vals[i] / ymax * (base - top), x0 = 56 + i * ((c.W - 90) / 4);
        c.ctx.fillStyle = cols[i]; c.ctx.fillRect(x0, base - h, bw, h);
        S.draw.text(c, S.fmt(vals[i], 2), x0 + bw / 2, base - h - 10, {size: 12});
        S.draw.text(c, names[i], x0 + bw / 2, base + 14, {size: 13, color: P.ink});
      }
      S.draw.text(c, "mol", 22, top - 8, {size: 12, color: P.grey});
      S.draw.text(c, "t = " + S.fmt(t, 1) + " (unités arbitraires)", c.W - 10, 14, {size: 12, color: P.grey, align: "right"});
      var Q = (A - x) * (B - x) > 1e-12 ? x * x / ((A - x) * (B - x)) : 0, lim = Math.min(A, B);
      ro.set(0, S.fmt(Q, 2)); ro.set(1, "4"); ro.set(2, S.fmt(x, 2) + " mol"); ro.set(3, S.fmt(x / lim * 100, 0) + " %");
    });
  }
});

SFA.sim({
  id: "c6-c02-deplacer", ch: "c02", tag: "Défi",
  titre: "Déplacer l'équilibre : excès de réactif et élimination de l'eau",
  resume: "Avec 1 mol d'acide, combien d'alcool en excès ou quelle part d'eau retirée pour atteindre 90 % de rendement ?",
  but: "Fais varier la quantité d'alcool ajoutée (acide fixé à 1,0 mol) et la fraction d'eau éliminée. Défi : atteins 90 % de rendement.",
  aRetenir: "Pour améliorer le rendement d'une estérification : mettre un réactif en excès (en général le moins cher) et/ou éliminer un produit, l'eau (par distillation, Dean-Stark, déshydratant). Dans les deux cas, on déplace l'équilibre vers la droite : K ne change pas.",
  piege: "Le rendement se calcule par rapport au réactif limitant. Si l'alcool est en excès, c'est l'acide qui est limitant ; quand l'alcool est en défaut (moins de 1 mol), c'est lui le limitant.",
  build: function(k, S){
    var c = k.canvas(320), P = S.draw.palette;
    var b = k.slider("n(alcool) ajouté", 0.5, 10, 0.1, 1, "mol");
    var f = k.slider("Eau retirée (fraction de l'eau formée)", 0, 100, 5, 0, "%");
    var ro = k.readouts(["n(ester) obtenu", "Réactif limitant", "Rendement"]);
    var nt = k.note("", "ok");
    function rend(bb, ff){ var x = xeq(1, bb, ff); return x / Math.min(1, bb); }
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 10, y0: 0, y1: 105, stepX: 1, stepY: 20, xl: "n(alcool) / mol", yl: "rendement (%)"});
      S.draw.fn(c, ax, function(x){ return x < 0.5 ? NaN : 100 * rend(x, 0); }, P.grey, 2, [6, 4]);
      S.draw.fn(c, ax, function(x){ return x < 0.5 ? NaN : 100 * rend(x, f.value / 100); }, P.green, 3);
      S.draw.line(c, ax.L, ax.Y(90), ax.R, ax.Y(90), P.amber, 1.4, [4, 4]);
      S.draw.text(c, "objectif 90 %", ax.X(7.2), ax.Y(90) + 12, {size: 12, color: P.amber, align: "left"});
      var r = rend(b.value, f.value / 100) * 100, x = xeq(1, b.value, f.value / 100);
      S.draw.dot(c, ax.X(b.value), ax.Y(r), 6, P.green);
      S.draw.text(c, "- - sans retrait d'eau", ax.X(2.2), ax.Y(45), {size: 12, color: P.grey, align: "left"}); S.draw.text(c, "— avec le retrait réglé", ax.X(2.2), ax.Y(35), {size: 12, color: P.green, align: "left"});
      ro.set(0, S.fmt(x, 2) + " mol"); ro.set(1, b.value < 1 ? "l'alcool" : b.value > 1 ? "l'acide" : "les deux"); ro.set(2, S.fmt(r, 0) + " %");
      if (r >= 90) nt.set("Objectif atteint : " + S.fmt(r, 0) + " % ≥ 90 %. Combien de matière coûteuse as-tu mise en excès ?", "ok");
      else nt.set("Rendement " + S.fmt(r, 0) + " % : augmente l'excès d'alcool ou retire de l'eau.", "warn");
    });
  }
});

SFA.sim({
  id: "c6-c02-saponification", ch: "c02", tag: "Dans la vraie vie",
  titre: "Saponification : fabriquer du savon",
  resume: "Triglycéride + soude → savon + glycérol : trouve la masse de soude juste nécessaire pour une masse d'huile.",
  but: "Choisis la masse d'huile et la masse de soude. Observe quel réactif limite et ce qui reste. Défi : aucun réactif en reste.",
  aRetenir: "Triglycéride + 3 NaOH → 3 savon (carboxylate de sodium) + glycérol. Il faut 3 mol de soude par mole d'huile : environ 13,6 g de NaOH pour 100 g de trioléine. La masse se conserve : masse des réactifs consommés = masse du savon + du glycérol.",
  piege: "Un excès de soude donne un savon agressif pour la peau (la soude reste libre), un défaut laisse de l'huile non saponifiée. Le savon fabriqué à la maison est volontairement un peu « surgraissé ». Modèle : huile = trioléine pure, M = 884 g/mol.",
  build: function(k, S){
    var c = k.canvas(290), P = S.draw.palette;
    var mh = k.slider("Masse d'huile", 50, 500, 10, 200, "g");
    var mn = k.slider("Masse de soude NaOH", 5, 80, 1, 27, "g");
    var ro = k.readouts(["Réactif limitant", "Savon formé", "Glycérol formé", "Reste"]);
    var nt = k.note("", "ok");
    var MH = 884, MN = 40, MS = 304, MG = 92;
    k.draw(function(){
      c.clear();
      var nh = mh.value / MH, nn = mn.value / MN, xi = Math.min(nh, nn / 3);
      var sav = 3 * xi * MS, gly = xi * MG, oilLeft = (nh - xi) * MH, naLeft = (nn - 3 * xi) * MN;
      var ax = S.draw.axes(c, {x0: 0, x1: 80, y0: 0, y1: 600, stepX: 10, stepY: 100, xl: "m(NaOH) / g", yl: "m(savon) / g"});
      S.draw.fn(c, ax, function(x){ var q = Math.min(nh, x / MN / 3); return 3 * q * MS; }, P.green, 3);
      var st = 3 * nh * MN;
      S.draw.line(c, ax.X(st), ax.B, ax.X(st), ax.T, P.amber, 1.4, [4, 4]);
      S.draw.text(c, "juste assez : " + S.fmt(st, 1) + " g", ax.X(st) + 4, ax.T + 30, {size: 12, color: P.amber, align: "left"});
      S.draw.dot(c, ax.X(mn.value), ax.Y(sav), 6, P.green);
      var exact = Math.abs(nn / (3 * nh) - 1) < 0.02;   /* tolérance de 2 % sur la masse de soude */
      var lim = exact ? "aucun (proportions exactes à 2 % près)" : (nn / 3 > nh ? "l'huile" : "la soude");
      ro.set(0, lim); ro.set(1, S.fmt(sav, 0) + " g"); ro.set(2, S.fmt(gly, 0) + " g");
      ro.set(3, exact ? "rien (à 2 % près)" : oilLeft > 0.5 ? S.fmt(oilLeft, 0) + " g d'huile" : naLeft > 0.05 ? S.fmt(naLeft, 1) + " g de soude" : "rien");
      if (exact) nt.set("Proportions exactes (à 2 % près). Vérification : " + S.fmt(xi * MH + 3 * xi * MN, 0) + " g de réactifs consommés → " + S.fmt(sav + gly, 0) + " g de produits (la masse se conserve).", "ok");
      else if (naLeft > 0.05) nt.set("Soude en excès : " + S.fmt(naLeft, 1) + " g restent libres. Ce savon serait caustique.", "warn");
      else if (oilLeft > 0.5) nt.set("Huile en excès : " + S.fmt(oilLeft, 0) + " g non saponifiés (savon « surgraissé »).", "warn");
      else nt.set("Proportions exactes. Vérification : " + S.fmt(xi * MH + 3 * xi * MN, 0) + " g de réactifs consommés → " + S.fmt(sav + gly, 0) + " g de produits.", "ok");
    });
  }
});

var ACI = [["méthan", 1], ["éthan", 2], ["propan", 3], ["butan", 4]];
var ALC = [["méthyle", 1, "méthanol"], ["éthyle", 2, "éthanol"], ["propyle", 3, "propan-1-ol"], ["butyle", 4, "butan-1-ol"], ["pentyle", 5, "pentan-1-ol"], ["octyle", 8, "octan-1-ol"]];
var ODEUR = {"4_1": "pomme / ananas", "4_2": "ananas", "4_5": "abricot", "2_5": "banane", "2_8": "orange", "1_2": "framboise", "2_2": "solvant fruité (dissolvant)"};
function fb(n, H, O){ return "C" + (n > 1 ? "<sub>" + n + "</sub>" : "") + "H" + (H > 1 ? "<sub>" + H + "</sub>" : "") + (O ? "O" + (O > 1 ? "<sub>" + O + "</sub>" : "") : ""); }
SFA.sim({
  id: "c6-c02-aromes", ch: "c02", tag: "Défi",
  titre: "Arômes d'esters : choisis l'acide et l'alcool",
  resume: "Combine un acide et un alcool pour obtenir l'ester qui sent la banane, l'ananas ou l'orange.",
  but: "Choisis l'acide et l'alcool : lis le nom de l'ester, son équation et son odeur. Défi : fabrique l'ester d'un arôme demandé.",
  aRetenir: "Nom d'un ester : [acide → -oate] de [alcool → -yle] (éthanoate de pentyle). L'équation conserve les atomes : M(ester) = M(acide) + M(alcool) − 18 g/mol (l'eau formée). Beaucoup d'arômes de fruits sont des esters.",
  piege: "La pièce de l'alcool devient le « de … yle » et celle de l'acide le « …oate » : l'éthanoate de méthyle et le méthanoate d'éthyle sont deux esters différents. Odeurs : indications usuelles, la perception varie d'une personne à l'autre ; pour les couples non listés, l'odeur n'est pas retenue ici.",
  build: function(k, S){
    var c = k.canvas(230), P = S.draw.palette;
    var ac = k.select("Acide carboxylique", ACI.map(function(a, i){ return [i, "acide " + a[0] + "oïque"]; }), 1);
    var al = k.select("Alcool", ALC.map(function(a, i){ return [i, a[2]]; }), 4);
    var cib = k.select("Défi : arôme à fabriquer", [["", "— libre —"], ["banane", "banane"], ["ananas", "ananas"], ["orange", "orange"], ["abricot", "abricot"], ["framboise", "framboise"]], "");
    var ro = k.readouts(["Ester", "Formule brute", "Masse molaire", "Odeur"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var A = ACI[ac.value], B = ALC[al.value], na = A[1], nb = B[1], ne = na + nb;
      var nom = A[0] + "oate de " + B[0], key = na + "_" + nb, od = ODEUR[key] || "peu caractéristique (non retenue)";
      var Ma = 14 * na + 32 - 0, Mb = 14 * nb + 18;   /* acide CnH2nO2 ; alcool CnH2n+2O */
      var Me = 14 * ne + 32;
      var items = [fb(na, 2 * na, 2), fb(nb, 2 * nb + 2, 1), fb(ne, 2 * ne, 2), "H<sub>2</sub>O"];
      var labs = ["acide", "alcool", "ester", "eau"], cols = [P.red, P.amber, P.green, P.teal], i;
      var ctx = c.ctx, sym = items.map(function(t){ return t.replace(/<sub>(\d+)<\/sub>/g, function(m, d){ return d.split("").map(function(z){ return "₀₁₂₃₄₅₆₇₈₉"[+z]; }).join(""); }); });
      var Ms = [Ma, Mb, Me, 18], ops = ["", "+", "⇌", "+"];
      if (c.W >= 520){
        var w = (c.W - 40) / 5;
        for (i = 0; i < 4; i++){
          var x = 20 + i * w * 1.2 + w * 0.1, wid = w * 0.95;
          ctx.save(); ctx.fillStyle = cols[i]; ctx.globalAlpha = .13; ctx.fillRect(x, 70, wid, 70); ctx.globalAlpha = 1; ctx.strokeStyle = cols[i]; ctx.lineWidth = 2; ctx.strokeRect(x, 70, wid, 70); ctx.restore();
          S.draw.text(c, labs[i], x + wid / 2, 56, {size: 12, color: cols[i]}); S.draw.text(c, sym[i], x + wid / 2, 105, {size: 14, math: true}); S.draw.text(c, S.fmt(Ms[i], 0) + " g/mol", x + wid / 2, 160, {size: 12, color: P.grey});
          if (i > 0) S.draw.text(c, ops[i], x - w * 0.1 - 4, 105, {size: 22});
        }
        S.draw.text(c, "Bilan des masses : " + (Ma + Mb) + " = " + Me + " + 18", c.W / 2, 205, {size: 13, color: P.ink});
      } else {
        for (i = 0; i < 4; i++){
          var y = 8 + i * 46;
          ctx.save(); ctx.fillStyle = cols[i]; ctx.globalAlpha = .13; ctx.fillRect(14, y, c.W - 28, 38); ctx.globalAlpha = 1; ctx.strokeStyle = cols[i]; ctx.lineWidth = 2; ctx.strokeRect(14, y, c.W - 28, 38); ctx.restore();
          S.draw.text(c, (i === 0 ? "" : ops[i] + " ") + labs[i], 22, y + 19, {size: 12, color: cols[i], align: "left"}); S.draw.text(c, sym[i], c.W / 2 + 10, y + 19, {size: 14, math: true}); S.draw.text(c, S.fmt(Ms[i], 0) + " g/mol", c.W - 22, y + 19, {size: 12, color: P.grey, align: "right"});
        }
        S.draw.text(c, "Bilan des masses : " + (Ma + Mb) + " = " + Me + " + 18", c.W / 2, 208, {size: 13, color: P.ink});
      }
      ro.set(0, nom); ro.set(1, fb(ne, 2 * ne, 2)); ro.set(2, Me + " g/mol"); ro.set(3, od);
      if (cib.value){
        if (ODEUR[key] && ODEUR[key].indexOf(cib.value) >= 0) nt.set("Réussi : " + nom + " sent la " + cib.value.replace(/^(banane|orange|framboise|ananas|abricot)$/, "$1") + ". Quelle serait l'équation de sa formation ?", "ok");
        else nt.set("Pas encore : « " + nom + " » → " + od + ". Essaie une autre combinaison.", "warn");
      } else nt.set("Choisis un arôme dans le défi, ou explore librement.", "ok");
    });
  }
});
})();
