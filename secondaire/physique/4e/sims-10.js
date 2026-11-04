/* Physique 4e · chapitre 10 · Lentilles, œil et couleurs */
(function(){
SFA.sim({
  id:"p4-c10-banc-optique", ch:"c10", tag:"Classique",
  titre:"Banc d'optique : l'image par une lentille convergente",
  resume:"Déplace l'objet et change la focale : image réelle ou virtuelle, renversée ou droite, agrandie ou réduite.",
  but:"Glisse l'objet (flèche rouge) le long de l'axe, ou utilise les curseurs. Les trois rayons particuliers construisent l'image. Essaie de cacher la moitié de la lentille. (Échelle verticale agrandie 4,5 fois.)",
  aRetenir:"Trois rayons particuliers : parallèle à l'axe → passe par le foyer image F′ ; passant par le centre → non dévié ; passant par le foyer objet F → ressort parallèle. Relation de conjugaison : 1/f = 1/p + 1/q ; grandissement γ = −q/p. Objet au-delà de F : image réelle renversée ; entre F et la lentille : image virtuelle, droite, agrandie (loupe).",
  piege:"L'image ne se forme pas « sur la lentille » mais à la distance q. Cacher la moitié de la lentille ne coupe pas la moitié de l'image : l'image reste entière, mais moins lumineuse. Et si on retire l'écran, l'image réelle existe toujours dans l'air (on ne la voit que si on la reçoit sur un écran ou dans l'œil).",
  build:function(k,S){
    var c = k.canvas(290), st = {drag:false};
    var f = k.slider("Distance focale f", 5, 30, 1, 12, "cm");
    var p = k.slider("Distance objet – lentille p", 3, 85, 1, 30, "cm");
    var h = k.slider("Hauteur de l'objet", 1, 6, 1, 3, "cm");
    var mk = k.toggle("Cacher la moitié haute de la lentille", false);
    var ro = k.readouts(["Distance image q", "Grandissement γ", "Nature de l'image", "Vergence C = 1/f", "Luminosité de l'image"]);
    var nt = k.note("", "");
    var XR = 90, sx, sy, X, Y, cy;
    function setup(){ sx = (c.W - 20) / (2 * XR); sy = sx * 4.5; cy = c.H / 2; X = function(x){ return c.W / 2 + x * sx; }; Y = function(y){ return cy - y * sy; }; }
    c.pointer(function(type, pt){ setup(); if (type === "down"){ st.drag = Math.abs(pt.x - X(-p.value)) < 40; } if ((type === "down" || type === "drag") && st.drag){ var v = Math.round(-(pt.x - c.W / 2) / sx); v = Math.max(3, Math.min(85, v)); p.set(v); k.redraw(); } if (type === "up") st.drag = false; });
    k.draw(function(){
      setup(); var P = SFA.draw.palette, F = f.value, Pp = p.value, H = h.value, ctx = c.ctx, masked = mk.value;
      var none = Math.abs(Pp - F) < 1e-9, q = none ? Infinity : F * Pp / (Pp - F), gam = none ? NaN : -q / Pp, Hi = gam * H, real = q > 0;
      var Hl = (c.H / 2 - 8) / sy;
      c.clear(); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, c.W, c.H); ctx.clip();
      S.draw.line(c, 0, cy, c.W, cy, "#c9d1dc", 1.5);
      for (var t = -80; t <= 80; t += 20){ S.draw.line(c, X(t), cy - 4, X(t), cy + 4, "#8a95a3", 1); if (t) P4.label(c, String(t), X(t), cy + 14, "#8a95a3"); }
      [-F, F].forEach(function(xf, i){ S.draw.dot(c, X(xf), cy, 4, P.violet); P4.label(c, i ? "F′" : "F", X(xf), cy - 12, P.violet); });
      S.draw.line(c, X(0), Y(Hl), X(0), Y(-Hl), "#13233a", 3);
      SFA.draw.arrow(c, X(0), Y(Hl - 2), X(0), Y(Hl), "#13233a", 3); SFA.draw.arrow(c, X(0), Y(-Hl + 2), X(0), Y(-Hl), "#13233a", 3);
      if (masked){ ctx.fillStyle = "rgba(95,107,122,.35)"; ctx.fillRect(X(0) - 6, Y(Hl), 12, cy - Y(Hl)); }
      var T = [-Pp, H], rayCol = ["rgba(180,83,9,.95)", "rgba(46,107,85,.95)", "rgba(30,63,143,.95)"];
      function seg(x1, y1, x2, y2, col, dash, w){ S.draw.line(c, X(x1), Y(y1), X(x2), Y(y2), col, w || 2, dash); }
      function ext(x1, y1, x2, y2, L){ var dx = x2 - x1, dy = y2 - y1; return [x2 + dx * L, y2 + dy * L]; }
      function lensRay(yl, col, w){
        /* rayon issu du sommet de l'objet qui traverse la lentille à la hauteur yl */
        seg(T[0], T[1], 0, yl, col, null, w);
        if (none){ var s2 = (yl - T[1]) / (0 - T[0]); seg(0, yl, XR, yl + s2 * XR, col, null, w); }
        else if (real){ var far = Math.max(1, (XR + 5) / q); seg(0, yl, q * far, yl + (Hi - yl) * far, col, null, w); }
        else { var dx = 0 - q, dy = yl - Hi; seg(0, yl, dx * 4, yl + dy * 4, col, null, w); seg(0, yl, q, Hi, col, [4, 4], 1.2); }
      }
      if (!masked){
        /* rayon 1 : parallèle puis par F' ; rayon 2 : par le centre ; rayon 3 : par F puis parallèle */
        seg(T[0], T[1], 0, H, rayCol[0]); seg(0, H, XR, H - H * XR / F, rayCol[0]);
        if (!real && !none) seg(0, H, q, Hi, rayCol[0], [4, 4], 1.2);
        var sl2 = H / (-Pp); seg(T[0], T[1], XR, sl2 * XR, rayCol[1]);
        if (!real && !none) seg(0, 0, q, Hi, rayCol[1], [4, 4], 1.2);
        if (!none){ var y3 = -H * F / (Pp - F); if (Math.abs(y3) < Hl){ seg(T[0], T[1], 0, y3, rayCol[2]); seg(0, y3, XR, y3, rayCol[2]); if (!real) seg(0, y3, q, Hi, rayCol[2], [4, 4], 1.2); } }
      } else {
        [-0.9, -0.65, -0.4, -0.15].forEach(function(r){ lensRay(r * Math.min(Hl, 14), "rgba(30,63,143,.9)", 1.8); });
        seg(T[0], T[1], 0, 0, "rgba(46,107,85,.95)");
        if (!none) seg(0, 0, real ? q * Math.max(1, (XR + 5) / q) : q * -4, real ? Hi * Math.max(1, (XR + 5) / q) : Hi * -4, "rgba(46,107,85,.95)", null);
      }
      SFA.draw.arrow(c, X(-Pp), Y(0), X(-Pp), Y(H), P.red, 4);
      if (!none && Math.abs(q) <= XR){ if (real) SFA.draw.arrow(c, X(q), Y(0), X(q), Y(Hi), P.acc, 4); else { ctx.save(); ctx.setLineDash([5, 4]); SFA.draw.arrow(c, X(q), Y(0), X(q), Y(Hi), "rgba(30,63,143,.6)", 3); ctx.restore(); } }
      ctx.restore();
      ro.set(0, none ? "à l'infini" : (real ? S.fmt(q, 1) + " cm" : S.fmt(q, 1) + " cm (côté objet)")); ro.set(1, none ? "—" : S.fmt(gam, 2)); ro.set(3, S.fmt(100 / F, 1) + " δ");
      ro.set(2, none ? "pas d'image (rayons parallèles)" : (real ? "réelle, renversée" : "virtuelle, droite") + (Math.abs(gam) > 1.005 ? ", agrandie" : Math.abs(gam) < 0.995 ? ", réduite" : ", même taille"));
      ro.set(4, masked ? "50 %" : "100 %");
      nt.set(none ? "p = f : l'objet est au foyer, les rayons ressortent parallèles : l'image est « à l'infini »." : Math.abs(q) > XR ? "L'image est trop loin pour tenir dans le schéma (q = " + S.fmt(q, 0) + " cm)." : masked ? "Moitié de la lentille cachée : l'image est TOUJOURS complète, mais deux fois moins lumineuse (moins de rayons)." : "1/f = 1/p + 1/q : 1/" + F + " = 1/" + Pp + " + 1/" + S.fmt(q, 1) + (real ? "." : " (q négatif : image virtuelle, située du même côté que l'objet)."), "");
    });
  }
});

var EYE = {normal:{d:20.0, n:"Œil normal"}, myope:{d:21.5, n:"Œil myope (trop long)"}, hyper:{d:18.5, n:"Œil hypermétrope (trop court)"}};
SFA.sim({
  id:"p4-c10-oeil-lunettes", ch:"c10", tag:"Santé",
  titre:"L'œil et ses lunettes : myopie et hypermétropie",
  resume:"Le cristallin accommode, mais un œil trop long ou trop court ne forme pas l'image sur la rétine sans lunettes.",
  but:"Choisis un type d'œil, la distance de l'objet et la vergence des lunettes (en dioptries). L'image doit se former exactement sur la rétine pour être nette.",
  aRetenir:"L'œil est une lentille convergente (cristallin) qui forme l'image sur la rétine ; il accommode en augmentant sa vergence pour voir de près. Myopie : image en avant de la rétine, corrigée par une lentille DIVERGENTE (vergence négative). Hypermétropie : image en arrière, corrigée par une lentille CONVERGENTE. Vergence C = 1/f (en dioptries δ).",
  piege:"Une lentille divergente rend le faisceau plus divergent : elle recule l'image, utile pour le myope (image trop avant). Les lunettes ne « grossissent » pas l'œil : elles changent la vergence totale. (Modèle d'œil réduit simplifié : lentille unique de 50 δ au repos et rétine à 20 mm (l'œil réel fait ≈ 60 δ pour ≈ 17 mm), pupille de 6 mm.)",
  build:function(k,S){
    var c = k.canvas(210);
    var ty = k.seg("Œil", [["normal","Normal"],["myope","Myope"],["hyper","Hypermétrope"]], "myope");
    var ac = k.seg("Accommodation", [[8,"Jeune (8 δ)"],[1,"Presbyte (1 δ)"]], 8);
    var inf = k.toggle("Objet très lointain (∞)", true);
    var dp = k.slider("Distance de l'objet (si non lointain)", 0.1, 5, 0.05, 1, "m");
    var cc = k.slider("Lunettes : vergence C", -6, 6, 0.25, 0, "δ");
    var ro = k.readouts(["Image sur la rétine ?", "Accommodation utilisée", "Verre pour voir net à l'infini", "Plage de vision nette"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, ctx = c.ctx, E = EYE[ty.value], d = E.d / 1000, Am = +ac.value, C0 = 50, Cc = cc.value, invP = inf.value ? 0 : 1 / dp.value;
      var need = invP + 1 / d - C0 - Cc, a = Math.max(0, Math.min(Am, need)), Ceff = C0 + a + Cc, V = Ceff - invP;   /* V = 1/q */
      var excess = Math.abs(a - need), sharp = excess <= 0.25;
      var qmm = V > 1e-3 ? 1000 / V : Infinity;
      var s = 9, xL = 84, cy = c.H / 2, xR = xL + E.d * s, r = 3;
      c.clear();
      ctx.fillStyle = "rgba(244,197,66,.14)"; ctx.beginPath(); ctx.ellipse(xL + 95, cy, 100, 46, 0, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xR, cy - 44); ctx.quadraticCurveTo(xR + 14, cy, xR, cy + 44); ctx.stroke();
      P4.label(c, "rétine", xR + 4, cy + 56, "#5f6b7a");
      S.draw.line(c, xL, cy - 30, xL, cy + 30, "#13233a", 4); P4.label(c, "cristallin", xL, cy - 40, "#13233a");
      if (Math.abs(Cc) > 0.01){ var xg = xL - 40; S.draw.line(c, xg, cy - 32, xg, cy + 32, P.teal, 3); P4.label(c, "lunettes", xg, cy - 42, P.teal); }
      [-1, 1].forEach(function(sg){
        var ex = 6, h0 = r * s * (1 + (xL - ex) / (inf.value ? 1e9 : dp.value * 1000 * s));
        S.draw.line(c, ex, cy + sg * h0, xL, cy + sg * r * s, P.amber, 1.8);
        var xEnd = Math.min(c.W - 6, isFinite(qmm) ? xL + qmm * s : c.W - 6);
        var yAt = function(x){ return cy + sg * r * s * (1 - (x - xL) / (isFinite(qmm) ? qmm * s : 1e9)); };
        S.draw.line(c, xL, cy + sg * r * s, xEnd, yAt(xEnd), sharp ? P.green : P.red, 1.8);
      });
      if (isFinite(qmm) && xL + qmm * s < c.W - 6) S.draw.dot(c, xL + qmm * s, cy, 4, sharp ? P.green : P.red);
      var blurPx = Math.min(40, Math.abs(a - need) * 6);
      ctx.fillStyle = sharp ? "rgba(46,107,85,.6)" : "rgba(180,35,24,.35)"; ctx.beginPath(); ctx.ellipse(xR, cy, 3 + (sharp ? 0 : blurPx * 0.35), 3 + (sharp ? 0 : blurPx), 0, 0, 6.2832); ctx.fill();
      var cinf = 1 / d - C0, far = C0 + Cc - 1 / d, near = Am + C0 + Cc - 1 / d;
      var farTxt = far > 1e-9 ? S.fmt(100 / far, 0) + " cm" : "∞", nearTxt = near > 1e-9 ? S.fmt(100 / near, 0) + " cm" : "∞";
      ro.set(0, sharp ? "NETTE" : (need < 0 ? "floue : image devant la rétine" : "floue : image derrière la rétine")); ro.set(1, S.fmt(a, 2) + " δ (max " + Am + ")"); ro.set(2, S.fmt(cinf, 2) + " δ"); ro.set(3, near < -1e-9 ? "aucune (même à l'infini, image derrière la rétine)" : near < 1e-9 ? "à l'infini seulement" : "de " + nearTxt + " à " + farTxt);
      nt.set(E.n + ". " + (sharp ? "L'image se forme sur la rétine : vision nette." : need < 0 ? "Le cristallin ne peut pas se « relâcher » davantage : trop convergent pour cet œil. Essaie une lentille divergente (C < 0)." : "Le cristallin ne peut pas accommoder assez : manque de convergence. Essaie une lentille convergente (C > 0)."), sharp ? "" : "warn");
    });
  }
});

var OBJ = [["rouge",[1,0,0]],["vert",[0,1,0]],["bleu",[0,0,1]],["jaune",[1,1,0]],["cyan",[0,1,1]],["magenta",[1,0,1]],["blanc",[1,1,1]]];
SFA.sim({
  id:"p4-c10-couleurs", ch:"c10", tag:"Couleurs",
  titre:"Mélanger les couleurs : lumières, pigments et objets éclairés",
  resume:"Synthèse additive (lumières), soustractive (pigments, filtres) et couleur d'un objet sous une lumière colorée.",
  but:"Choisis le mode. Additif : règle les intensités R, V, B. Soustractif : règle C, M, J. Objet éclairé : choisis la couleur de l'objet et la lumière. Essaie les défis.",
  aRetenir:"Lumières (additif) : rouge + vert = jaune, vert + bleu = cyan, rouge + bleu = magenta, R + V + B = blanc. Pigments et filtres (soustractif) : cyan + jaune = vert, magenta + jaune = rouge, cyan + magenta = bleu, C + M + J ≈ noir. Un objet n'a la couleur que de la lumière qu'il renvoie.",
  piege:"Ne mélange pas les deux synthèses : le jaune est « rouge + vert » en lumière mais c'est une couleur primaire en peinture. Un objet rouge n'est pas « rouge » sous une lumière verte : il paraît noir, car il n'a aucune lumière rouge à renvoyer. (Pigments idéaux.)",
  build:function(k,S){
    var c = k.canvas(260);
    var md = k.seg("Mode", [["add","Lumières (additif)"],["sub","Pigments (soustractif)"],["obj","Objet éclairé"]], "add");
    var a = k.slider("Rouge (R) / Cyan (C)", 0, 100, 5, 100, "%");
    var b = k.slider("Vert (V) / Magenta (M)", 0, 100, 5, 100, "%");
    var d = k.slider("Bleu (B) / Jaune (J)", 0, 100, 5, 0, "%");
    var ob = k.select("Couleur de l'objet (mode « Objet éclairé »)", OBJ.map(function(o){ return [o[0], o[0]]; }), "rouge");
    var defi = k.select("Défi", [["0","Aucun"],["j","Obtenir du JAUNE en lumières"],["w","Obtenir du BLANC en lumières"],["v","Obtenir du VERT avec des pigments"],["k","Obtenir du NOIR avec des pigments"],["n","Faire paraître un objet rouge NOIR (mode objet)"]], "0");
    var ro = k.readouts(["Résultat au centre"]);
    var nt = k.note("", "");
    function rgb(v){ return "rgb(" + v.map(function(x){ return Math.round(255 * Math.max(0, Math.min(1, x))); }).join(",") + ")"; }
    k.draw(function(){
      var P = SFA.draw.palette, ctx = c.ctx, A = a.value / 100, B = b.value / 100, D = d.value / 100, m = md.value, cx = c.W / 2, cy = c.H / 2 + 14, R = Math.min(c.W, c.H) * 0.25, off = R * 0.62, res, i;
      c.clear();
      var pos = [[cx, cy - off * 0.9], [cx - off, cy + off * 0.6], [cx + off, cy + off * 0.6]];
      if (m === "add"){
        ctx.fillStyle = "#000"; ctx.fillRect(0, 0, c.W, c.H); ctx.globalCompositeOperation = "lighter";
        [[A, 0, 0], [0, B, 0], [0, 0, D]].forEach(function(v, j){ ctx.fillStyle = rgb(v); ctx.beginPath(); ctx.arc(pos[j][0], pos[j][1], R, 0, 6.2832); ctx.fill(); });
        ctx.globalCompositeOperation = "source-over"; res = [A, B, D];
        SFA.draw.text(c, "R", pos[0][0], pos[0][1] - R - 10, {size:13, color:"#fff"}); SFA.draw.text(c, "V", pos[1][0] - R - 8, pos[1][1], {size:13, color:"#fff"}); SFA.draw.text(c, "B", pos[2][0] + R + 8, pos[2][1], {size:13, color:"#fff"});
      } else if (m === "sub"){
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.W, c.H); ctx.globalCompositeOperation = "multiply";
        [[1 - A, 1, 1], [1, 1 - B, 1], [1, 1, 1 - D]].forEach(function(v, j){ ctx.fillStyle = rgb(v); ctx.beginPath(); ctx.arc(pos[j][0], pos[j][1], R, 0, 6.2832); ctx.fill(); });
        ctx.globalCompositeOperation = "source-over"; res = [(1 - A), (1 - B), (1 - D)];
        SFA.draw.text(c, "C", pos[0][0], pos[0][1] - R - 10, {size:13, color:"#13233a"}); SFA.draw.text(c, "M", pos[1][0] - R - 8, pos[1][1], {size:13, color:"#13233a"}); SFA.draw.text(c, "J", pos[2][0] + R + 8, pos[2][1], {size:13, color:"#13233a"});
      } else {
        var o = OBJ.filter(function(q){ return q[0] === ob.value; })[0][1], L = [A, B, D];
        res = [L[0] * o[0], L[1] * o[1], L[2] * o[2]];
        ctx.fillStyle = "#1a1f2b"; ctx.fillRect(0, 0, c.W, c.H);
        ctx.fillStyle = rgb(L); ctx.beginPath(); ctx.arc(cx - R * 1.4, cy - R * 0.3, R * 0.55, 0, 6.2832); ctx.fill(); SFA.draw.text(c, "lumière reçue", cx - R * 1.4, cy + R * 0.5, {size:12, color:"#fff"});
        ctx.fillStyle = rgb(o); ctx.fillRect(cx - R * 0.1, cy - R * 0.8, R * 0.9, R * 1.0); SFA.draw.text(c, "objet (" + ob.value + " en lumière blanche)", cx + R * 0.35, cy + R * 0.45, {size:12, color:"#fff"});
        ctx.fillStyle = rgb(res); ctx.beginPath(); ctx.arc(cx + R * 1.35, cy - R * 0.3, R * 0.55, 0, 6.2832); ctx.fill(); SFA.draw.text(c, "ce qu'on voit", cx + R * 1.35, cy + R * 0.5, {size:12, color:"#fff"});
        SFA.draw.arrow(c, cx - R * 0.8, cy - R * 0.3, cx - R * 0.15, cy - R * 0.3, "#fff", 2); SFA.draw.arrow(c, cx + R * 0.85, cy - R * 0.3, cx + R * 0.75, cy - R * 0.3, "#fff", 2);
      }
      ro.set(0, '<span style="display:inline-block;width:18px;height:18px;vertical-align:middle;border:1px solid #8a95a3;background:' + rgb(res) + '"></span> ' + res.map(function(x){ return Math.round(x * 100); }).join(" / ") + " %");
      var df = defi.value, msg = "", ok = false;
      if (df === "j"){ ok = m === "add" && A > 0.95 && B > 0.95 && D < 0.05; msg = "Défi jaune (lumières) : il faut R et V à fond, B à 0. " + (ok ? "Réussi !" : "Pas encore. Passe en mode additif."); }
      else if (df === "w"){ ok = m === "add" && A > 0.95 && B > 0.95 && D > 0.95; msg = "Défi blanc (lumières) : R + V + B à fond. " + (ok ? "Réussi !" : "Pas encore."); }
      else if (df === "v"){ ok = m === "sub" && A > 0.95 && B < 0.05 && D > 0.95; msg = "Défi vert (pigments) : cyan + jaune, sans magenta. " + (ok ? "Réussi !" : "Pas encore. Passe en mode soustractif."); }
      else if (df === "k"){ ok = m === "sub" && A > 0.95 && B > 0.95 && D > 0.95; msg = "Défi noir (pigments) : C + M + J à fond. " + (ok ? "Réussi ! (en vrai on obtient plutôt un brun foncé : les pigments ne sont pas idéaux)" : "Pas encore."); }
      else if (df === "n"){ ok = m === "obj" && ob.value === "rouge" && A < 0.05 && (B > 0.5 || D > 0.5); msg = "Défi : objet rouge qui paraît noir : éclaire-le sans lumière rouge (R = 0), avec du vert ou du bleu. " + (ok ? "Réussi !" : "Pas encore."); }
      else msg = m === "add" ? "Lumières : plus on ajoute de lumière, plus c'est clair. Les trois à fond donnent du blanc." : m === "sub" ? "Pigments : chaque couche absorbe une partie de la lumière. Plus on en ajoute, plus c'est sombre." : "Un objet renvoie seulement les couleurs qu'il contient : lumière reçue × couleur de l'objet.";
      nt.set(msg, df !== "0" && !ok ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"p4-c10-sthenope-lentille", ch:"c10", tag:"Comparaison",
  titre:"Sténopé ou lentille : netteté et lumière",
  resume:"Un trou d'épingle est net mais sombre ; une lentille est lumineuse mais n'est nette qu'à la bonne distance.",
  but:"Règle le diamètre du sténopé, l'ouverture de la lentille (f = 50 mm) et la distance de mise au point. Compare le flou d'un point lumineux à différentes distances.",
  aRetenir:"Sténopé : un point de l'objet donne une tache de diamètre ≈ celui du trou, à toute distance (netteté partout, mais très peu de lumière). Lentille : un point donne un point sur le capteur, mais seulement pour la distance de mise au point ; ailleurs, tache de flou. Plus l'ouverture est grande, plus il y a de lumière et moins la profondeur de champ est grande.",
  piege:"Un grand trou de sténopé donne une image floue, pas plus lumineuse « utilement ». Et une lentille grande ouverte n'est nette que dans une plage étroite de distances (faible profondeur de champ). (Optique géométrique : la diffraction est négligée.)",
  build:function(k,S){
    var g1 = k.canvas(260), f = 50;
    var A = k.slider("Ouverture de la lentille", 2, 25, 1, 12, "mm");
    var a = k.slider("Diamètre du sténopé", 0.1, 3, 0.1, 1, "mm");
    var p0 = k.slider("Mise au point de la lentille", 0.5, 10, 0.5, 2, "m");
    var po = k.slider("Distance de l'objet", 0.3, 10, 0.1, 5, "m");
    var ro = k.readouts(["Flou du sténopé", "Flou de la lentille", "Lumière lentille / sténopé", "Lentille nette (< 0,15 mm) de… à…"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, d = 1 / (1 / f - 1 / (p0.value * 1000)), Ap = A.value, ap = a.value;
      var lens = function(pm){ var q = 1 / (1 / f - 1 / (pm * 1000)); return Ap * Math.abs(d - q) / q; };
      var pin = function(pm){ return ap * (1 + d / (pm * 1000)); };
      var ymax = Math.max(1.6 * ap, 1);
      g1.clear(); var ax = S.draw.axes(g1, {x0:0.3, x1:10, y0:0, y1:ymax, xl:"distance (m)", yl:"flou (mm)", stepX:1});
      S.draw.fn(g1, ax, pin, P.red, 3); S.draw.fn(g1, ax, lens, P.acc, 3);
      S.draw.line(g1, ax.L, ax.Y(0.15), ax.R, ax.Y(0.15), P.green, 1.5, [5, 4]); P4.label(g1, "0,15 mm : net", ax.X(3.4), ax.Y(0.15) - 9, P.green, "left");
      P4.label(g1, "sténopé", ax.X(9.8), ax.Y(pin(9.8)) - 10, P.red, "right"); P4.label(g1, "lentille", ax.X(0.9), ax.Y(Math.min(ymax * 0.9, lens(0.9))) + 14, P.acc, "left");
      S.draw.line(g1, ax.X(po.value), ax.B, ax.X(po.value), ax.T, "#b8c0cc", 1.2, [3, 3]); S.draw.dot(g1, ax.X(po.value), ax.Y(Math.min(ymax, pin(po.value))), 5, P.red); S.draw.dot(g1, ax.X(po.value), ax.Y(Math.min(ymax, lens(po.value))), 5, P.acc);
      S.draw.line(g1, ax.X(p0.value), ax.B, ax.X(p0.value), ax.B - 10, P.acc, 3);
      var lo = null, hi = null; for (var pm = 0.3; pm <= 10.001; pm += 0.05){ if (lens(pm) <= 0.15){ if (lo === null) lo = pm; hi = pm; } }
      ro.set(0, S.fmt(pin(po.value), 2) + " mm"); ro.set(1, S.fmt(lens(po.value), 2) + " mm"); ro.set(2, "× " + S.fmt(Math.pow(Ap / ap, 2), 0)); ro.set(3, lo === null ? "nulle part" : S.fmt(lo, 1) + " m à " + (hi >= 9.95 ? "∞" : S.fmt(hi, 1) + " m"));
      nt.set("Objet à " + S.fmt(po.value, 1) + " m : sténopé → tache de " + S.fmt(pin(po.value), 2) + " mm ; lentille → tache de " + S.fmt(lens(po.value), 2) + " mm. La lentille capte " + S.fmt(Math.pow(Ap / ap, 2), 0) + " fois plus de lumière que ce sténopé.", "");
    });
  }
});
})();
