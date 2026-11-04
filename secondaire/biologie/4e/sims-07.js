/* Biologie 4e · chapitre 7 · ATP et bilan énergétique de la cellule */
SFA.sim({
  id:"b4-c07-cycle", ch:"c07", tag:"Cycle · original",
  titre:"Le cycle ATP–ADP : une monnaie qui tourne",
  resume:"L'ATP stocké ne tient que quelques minutes : bloque sa production et regarde le stock fondre.",
  but:"Règle la dépense énergétique journalière et la voie de production d'ATP. Lance la simulation (1 s = 10 s) et suis la part d'ATP dans le stock.",
  aRetenir:"ATP + H₂O ⇄ ADP + Pi : en se coupant, l'ATP libère l'énergie utilisable par la cellule ; la respiration (ou la fermentation) la régénère. Le stock d'ATP est minuscule (≈ 0,1 mol, ≈ 50 g) mais renouvelé sans cesse : on en recycle l'équivalent de plusieurs dizaines de kg par jour. Une cellule ne peut pas vivre de ce stock plus de quelques minutes.",
  piege:"L'ATP n'est pas une pile ni une réserve à long terme : les réserves sont le glycogène et les lipides. Modèle simplifié : 40 % de l'énergie alimentaire passe par l'ATP, ≈ 50 kJ libérés par mole d'ATP hydrolysée dans la cellule.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.95});
    var E = k.slider("Énergie dépensée par jour", 6000, 16000, 500, 10000, "kJ");
    var src = k.seg("Production d'ATP", [["r","Respiration"],["f","Fermentation seule"],["0","Bloquée (cyanure)"]], "r");
    var ro = k.readouts(["ATP régénéré par jour", "Masse d'ATP par jour", "Recyclages du stock/jour", "Stock tenu sans production"]);
    var nt = k.note("", "");
    var st = {t:0, f:0.9, h:[[0, 90]], acc:0};
    function C(){ return E.value * 0.4 / 50 / 86400; }      /* mol/s */
    function Sy(){ return C() * (src.value === "r" ? 1 : src.value === "f" ? 2 / 30 : 0); }
    var lp = k.loop(function(dt){
      var h = dt * 10;
      st.f = Math.max(0, Math.min(1, st.f + (Sy() - C()) / 0.1 * h)); st.t += h; st.acc += h;
      if (st.acc >= 5){ st.acc = 0; st.h.push([st.t, st.f * 100]); }
      if (st.t >= 300) lp.pause(); k.redraw();
    });
    lp.play();
    k.button("↺ Recommencer", function(){ st.t = 0; st.f = 0.9; st.h = [[0, 90]]; lp.play(); }, true);
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, cons = C(), sy = Sy();
      var bw = W * 0.34, by = 14, bh = H * 0.3;
      B4.rr(c, 10, by, bw, bh, 10, "rgba(220,252,231,.8)", "#2e6b55", 2); B4.rr(c, W - 10 - bw, by, bw, bh, 10, "rgba(254,226,226,.8)", "#9f1239", 2);
      B4.txt(c, "ATP", 10 + bw / 2, by + 14, B4.pal.green, 13); B4.txt(c, "ADP + Pi", W - 10 - bw / 2, by + 14, B4.pal.red, 13);
      var r = B4.rng(3), tot = 40, nA = Math.round(st.f * tot);
      for (var i = 0; i < tot; i++){ var gx = 16 + (i % 8) * (bw - 12) / 8, gy = by + 30 + Math.floor(i / 8) * (bh - 40) / 5; var isA = i < nA; S.draw.dot(c, isA ? gx + 4 : W - 10 - bw + 6 + (i % 8) * (bw - 12) / 8, gy, 5, isA ? B4.pal.green : B4.pal.red); }
      var mid = W / 2;
      S.draw.arrow(c, 10 + bw + 4, by + bh * 0.35, W - 14 - bw, by + bh * 0.35, B4.pal.red, 5); B4.txt(c, "travail", mid, by + bh * 0.35 - 12, B4.pal.red, 11);
      S.draw.arrow(c, W - 14 - bw, by + bh * 0.7, 10 + bw + 4, by + bh * 0.7, B4.pal.green, 0.5 + 4.5 * sy / cons); B4.txt(c, src.value === "r" ? "respiration" : src.value === "f" ? "fermentation" : "bloquée", mid, by + bh * 0.7 + 14, B4.pal.green, 11);
      var ax = S.draw.axes(c, {x0:0, x1:300, y0:0, y1:100, xl:"t (s)", yl:"ATP / (ATP + ADP) en %", stepX:60, stepY:25, t:by + bh + 24, l:44});
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = B4.pal.green; ctx.lineWidth = 2.8; ctx.beginPath(); st.h.forEach(function(p, q){ var x = ax.X(p[0]), y = ax.Y(p[1]); if (q === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); ctx.restore();
      var day = E.value * 0.4 / 50;
      ro.set(0, S.fmt(day, 0) + " mol"); ro.set(1, S.fmt(day * 507 / 1000, 0) + " kg"); ro.set(2, "≈ " + S.fmt(day / 0.1, 0)); ro.set(3, S.fmt(0.09 / cons, 0) + " s");
      nt.set(src.value === "r" ? "Production = consommation : le stock reste stable (≈ 90 % d'ATP), mais chaque molécule d'ATP est recyclée environ " + S.fmt(day / 0.1, 0) + " fois par jour." : src.value === "f" ? "La fermentation ne régénère que 2 ATP par glucose (≈ 7 % du besoin) : le stock s'épuise presque aussi vite que s'il n'y avait aucune production." : "Production bloquée : le stock d'ATP (≈ 0,09 mol) est épuisé en ≈ " + S.fmt(0.09 / cons, 0) + " s : la cellule n'a plus d'énergie utilisable.", src.value === "r" ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id:"b4-c07-mb", ch:"c07", tag:"Calcul · besoins",
  titre:"Métabolisme de base et besoins énergétiques",
  resume:"Calcule le métabolisme de base d'une personne et ses besoins totaux selon son activité.",
  but:"Règle sexe, masse, taille, âge et niveau d'activité. Compare avec la courbe en fonction de la masse.",
  aRetenir:"Le métabolisme de base (MB) est l'énergie dépensée au repos complet, à jeun, pour maintenir les fonctions vitales (cœur, respiration, température, renouvellement cellulaire). Il varie avec la masse, la taille, l'âge et le sexe. Les besoins totaux = MB × niveau d'activité physique. 1 kcal = 4,184 kJ.",
  piege:"Le MB n'est pas la dépense totale : l'activité physique peut l'augmenter de 20 % à 90 %. Formule de Mifflin–St Jeor : valeur moyenne approximative, pas une mesure individuelle.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.75});
    var sx = k.seg("Sexe", [["m","Garçon / homme"],["f","Fille / femme"]], "m");
    var m = k.slider("Masse", 30, 120, 1, 65, "kg");
    var h = k.slider("Taille", 130, 200, 1, 172, "cm");
    var a = k.slider("Âge", 12, 80, 1, 16, "ans");
    var act = k.select("Activité", [["1.2","Sédentaire (×1,2)"],["1.375","Peu active (×1,375)"],["1.55","Modérée (×1,55)"],["1.725","Active (×1,725)"],["1.9","Très active (×1,9)"]], "1.375");
    var ro = k.readouts(["MB", "Besoins totaux", "ATP régénéré par jour", "Part du MB"]);
    var nt = k.note("", "");
    function mb(sex, mm, hh, aa){ return 10 * mm + 6.25 * hh - 5 * aa + (sex === "m" ? 5 : -161); }
    k.draw(function(){
      c.clear(); var B = mb(sx.value, m.value, h.value, a.value), tot = B * parseFloat(act.value);
      var ax = S.draw.axes(c, {x0:30, x1:120, y0:800, y1:2800, xl:"masse (kg)", yl:"MB (kcal/jour)", stepX:10, stepY:400});
      S.draw.fn(c, ax, function(x){ return mb("m", x, h.value, a.value); }, B4.pal.acc, 2.4);
      S.draw.fn(c, ax, function(x){ return mb("f", x, h.value, a.value); }, B4.pal.red, 2.4);
      B4.txt(c, "garçons / hommes", ax.X(120), ax.Y(mb("m", 120, h.value, a.value)) - 12, B4.pal.acc, 12, "right"); B4.txt(c, "filles / femmes", ax.X(120), ax.Y(mb("f", 120, h.value, a.value)) + 16, B4.pal.red, 12, "right");
      S.draw.dot(c, ax.X(m.value), ax.Y(Math.max(800, Math.min(2800, B))), 7, "#13233a");
      B4.txt(c, "à " + S.fmt(h.value, 0) + " cm, " + S.fmt(a.value, 0) + " ans", ax.R - 4, ax.T + 10, "#5f6b7a", 12, "right");
      var kj = tot * 4.184;
      ro.set(0, S.fmt(B, 0) + " kcal (" + S.fmt(B * 4.184, 0) + " kJ)"); ro.set(1, S.fmt(tot, 0) + " kcal (" + S.fmt(kj, 0) + " kJ)"); ro.set(2, S.fmt(kj * 0.4 / 50, 0) + " mol"); ro.set(3, S.fmt(B / tot * 100, 0) + " %");
      nt.set("MB ≈ " + S.fmt(B, 0) + " kcal/jour : c'est ce que dépense le corps pour vivre sans rien faire. Avec l'activité choisie, le besoin passe à ≈ " + S.fmt(tot, 0) + " kcal/jour. Plus la masse (donc plus de cellules à entretenir) est grande, plus le MB est élevé ; il diminue un peu avec l'âge.", "");
    });
  }
});

SFA.sim({
  id:"b4-c07-bilan", ch:"c07", tag:"Bilan · défi",
  titre:"Bilan énergétique du jour",
  resume:"Compose un menu en glucides, lipides et protéines, compare-le à la dépense et projette l'évolution de la masse.",
  but:"Règle les apports et la dépense journalière. Lis l'énergie, les pourcentages, le bilan et la projection sur 90 jours. Défi : équilibrer le bilan à ±300 kJ.",
  aRetenir:"Énergie des nutriments : glucides ≈ 17 kJ/g, protéines ≈ 17 kJ/g, lipides ≈ 37 kJ/g (≈ 4, 4 et 9 kcal/g). Bilan = apports − dépenses ; un bilan positif durable est stocké (surtout en lipides : 1 kg de graisse corporelle ≈ 32 000 kJ), un bilan négatif puise dans les réserves.",
  piege:"Projection simplifiée (le corps s'adapte, la dépense change avec la masse). Les repères de répartition (≈ 50-55 % glucides, 30-35 % lipides, 10-15 % protéines) sont indicatifs.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.9});
    var g = k.slider("Glucides", 0, 600, 10, 300, "g");
    var l = k.slider("Lipides", 0, 200, 5, 80, "g");
    var p = k.slider("Protéines", 0, 250, 5, 80, "g");
    var d = k.slider("Dépense journalière", 6000, 16000, 100, 10000, "kJ");
    var ro = k.readouts(["Apports", "Bilan", "Glucides / Lipides / Protéines", "Variation de masse en 90 jours"]);
    var nt = k.note("", "");
    k.button("Repas équilibré", function(){ g.set(330); l.set(85); p.set(85); d.set(10000); }, true);
    k.button("Excès de lipides", function(){ g.set(250); l.set(170); p.set(90); d.set(10000); });
    k.button("Régime très restrictif", function(){ g.set(100); l.set(30); p.set(60); d.set(10000); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, eg = g.value * 17, el = l.value * 37, ep = p.value * 17, tot = eg + el + ep, bil = tot - d.value;
      var bx = 12, bw = W - 24, by = 34, bh = 26, scale = bw / 18000;
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(bx, by, bw, bh);
      var x = bx; [[eg, "#2e6b55", "glucides"], [el, "#B45309", "lipides"], [ep, "#1e3f8f", "protéines"]].forEach(function(s){ ctx.fillStyle = s[1]; ctx.fillRect(x, by, s[0] * scale, bh); x += s[0] * scale; });
      B4.txt(c, "Apports : " + S.fmt(tot, 0) + " kJ", bx, 14, B4.pal.ink, 12, "left");
      S.draw.line(c, bx + d.value * scale, by - 6, bx + d.value * scale, by + bh + 6, B4.pal.red, 3); B4.txt(c, "dépense " + S.fmt(d.value, 0) + " kJ", W - 12, 14, B4.pal.red, 12, "right");
      B4.txt(c, "vert glucides · orange lipides · bleu protéines", bx, by + bh + 14, "#5f6b7a", 11, "left");
      var dm = bil * 90 / 32000;
      var ax = S.draw.axes(c, {x0:0, x1:90, y0:-8, y1:8, xl:"jours", yl:"variation de masse (kg)", stepX:15, stepY:4, t:by + bh + 34, l:44});
      S.draw.fn(c, ax, function(t){ return bil * t / 32000; }, bil > 0 ? B4.pal.red : B4.pal.acc, 3);
      S.draw.dot(c, ax.X(90), ax.Y(Math.max(-8, Math.min(8, dm))), 6, "#13233a");
      var pg = eg / tot * 100, pl = el / tot * 100, pp = ep / tot * 100;
      ro.set(0, S.fmt(tot, 0) + " kJ (" + S.fmt(tot / 4.184, 0) + " kcal)"); ro.set(1, (bil >= 0 ? "+" : "") + S.fmt(bil, 0) + " kJ"); ro.set(2, tot ? S.fmt(pg, 0) + " / " + S.fmt(pl, 0) + " / " + S.fmt(pp, 0) + " %" : "—"); ro.set(3, (dm >= 0 ? "+" : "") + S.fmt(dm, 1) + " kg");
      var okb = Math.abs(bil) <= 300;
      nt.set((okb ? "Bilan équilibré (±300 kJ) : la masse reste stable. " : bil > 0 ? "Apports supérieurs à la dépense : l'excès est stocké (surtout en lipides), la masse augmente. " : "Dépense supérieure aux apports : le corps puise dans ses réserves, la masse diminue. ") + (tot && (pl > 40 || pg < 35) ? "Répartition éloignée des repères (50-55 % glucides, 30-35 % lipides, 10-15 % protéines)." : tot && pp < 8 ? "Apport en protéines faible." : "Répartition proche des repères."), okb ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id:"b4-c07-plante", ch:"c07", tag:"Jour et nuit · modèle",
  titre:"Une plante sur 24 heures : photosynthèse et respiration",
  resume:"Suis l'O₂ dégagé le jour et consommé la nuit : le bilan net décide si la plante croît.",
  but:"Choisis la durée du jour, l'éclairement maximal et la température. Lance l'horloge et lis le bilan net sur 24 h.",
  aRetenir:"Une plante fait la photosynthèse (anabolisme : fabrication de glucose) seulement à la lumière, mais respire (catabolisme : libération d'énergie) jour et nuit. Elle ne croît que si, sur 24 h, la photosynthèse dépasse la respiration. Des nuits fraîches réduisent la respiration et améliorent le bilan.",
  piege:"Une plante ne « respire pas le jour » est faux : la respiration continue, masquée par la photosynthèse. Modèle simplifié (O₂ en µmol/m²/s, 6 O₂ pour 1 glucose).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.85});
    var dl = k.slider("Durée du jour", 6, 18, 1, 12, "h");
    var im = k.slider("Éclairement maximal", 20, 100, 5, 80, "% du plein soleil");
    var T = k.slider("Température", 5, 35, 1, 20, "°C");
    var ro = k.readouts(["O₂ produit (jour)", "O₂ consommé (24 h)", "Bilan net", "Glucose net"]);
    var nt = k.note("", "");
    var st = {h:6};
    var lp = k.loop(function(dt){ st.h += dt * 3; if (st.h >= 30){ st.h = 6; } k.redraw(); });
    lp.play();
    k.button("❚❚ Pause / ▶ Reprendre", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    function Pf(t){ var r0 = 12 - dl.value / 2; if (t < r0 || t > r0 + dl.value) return 0; var I = im.value * Math.sin(Math.PI * (t - r0) / dl.value); return 15 * I / (I + 25); }
    function R(){ return 2 * Math.pow(2, (T.value - 20) / 10); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, ax = S.draw.axes(c, {x0:0, x1:24, y0:-6, y1:14, xl:"heure", yl:"O₂ (µmol/m²/s)", stepX:3, stepY:4});
      var r0 = 12 - dl.value / 2;
      ctx.fillStyle = "rgba(15,27,45,.07)"; ctx.fillRect(ax.L, ax.T, ax.X(r0) - ax.L, ax.B - ax.T); ctx.fillRect(ax.X(r0 + dl.value), ax.T, ax.R - ax.X(r0 + dl.value), ax.B - ax.T);
      S.draw.fn(c, ax, Pf, B4.pal.green, 2.8); S.draw.line(c, ax.X(0), ax.Y(-R()), ax.X(24), ax.Y(-R()), B4.pal.red, 2.6);
      S.draw.fn(c, ax, function(t){ return Pf(t) - R(); }, B4.pal.ink, 2, [6, 4]);
      B4.txt(c, "photosynthèse", ax.X(18.8), ax.Y(8), B4.pal.green, 12); B4.txt(c, "−respiration", ax.X(21), ax.Y(-R()) + 14, B4.pal.red, 12); B4.txt(c, "net (tirets)", ax.X(4), ax.Y(2), B4.pal.ink, 12);
      var th = st.h % 24; S.draw.line(c, ax.X(th), ax.T, ax.X(th), ax.B, B4.pal.amber, 2.2); S.draw.dot(c, ax.X(th), ax.Y(Pf(th) - R()), 6, B4.pal.amber);
      var prod = 0, cons = R() * 24 * 3.6, i;                       /* mmol/m² : µmol/s × 3600 s/h ÷ 1000 */
      for (i = 0; i < 2400; i++){ prod += Pf(i / 100) * 0.01 * 3.6; }
      var net = prod - cons, glc = net / 6;
      ro.set(0, S.fmt(prod, 0) + " mmol/m²"); ro.set(1, S.fmt(cons, 0) + " mmol/m²"); ro.set(2, (net >= 0 ? "+" : "") + S.fmt(net, 0) + " mmol/m²"); ro.set(3, S.fmt(glc * 0.18, 1) + " g/m²");
      var net_now = Pf(th) - R();
      nt.set("À " + S.fmt(Math.floor(th), 0) + " h : " + (Pf(th) === 0 ? "nuit, seule la respiration agit : échange net " + S.fmt(-R(), 1) + " (consommation d'O₂)." : net_now >= 0 ? "photosynthèse > respiration : dégagement net d'O₂." : "la photosynthèse est encore plus faible que la respiration.") + " Bilan sur 24 h : " + (net > 0 ? "positif, la plante fabrique plus de glucose qu'elle n'en consomme : elle peut croître." : "négatif : la plante consomme ses réserves."), net > 0 ? "ok" : "warn");
    });
  }
});
