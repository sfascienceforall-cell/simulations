/* Chapitre 4 · Troisième loi de Newton et quantité de mouvement */
SFA.sim({
  id: "p5-c04-chocs", ch: "c04", tag: "Classique",
  titre: "Deux chariots sur un rail : p se conserve, pas toujours Ec",
  resume: "Masses, vitesses, type de choc → p et énergie cinétique avant et après.",
  but: "Règle les masses, les vitesses et le coefficient de restitution e (0 = choc mou, les chariots restent collés ; 1 = choc élastique). Lance et compare p et Ec avant et après.",
  aRetenir: "Dans un système isolé, la quantité de mouvement totale p = m₁v₁ + m₂v₂ se conserve toujours. L'énergie cinétique ne se conserve que dans un choc élastique ; sinon, elle diminue (chaleur, déformation).",
  piege: "« Rien ne se perd » ne veut pas dire que Ec se conserve : dans un choc mou, une partie de l'énergie cinétique est transformée en chaleur et en déformation. La quantité de mouvement, elle, ne change jamais.",
  build: function(k, S){
    var c = k.canvas(170), gr = k.canvas(190);
    var m1 = k.slider("Masse du chariot 1 (bleu)", 0.5, 5, 0.1, 2, "kg");
    var v1 = k.slider("Vitesse du chariot 1", -4, 6, 0.1, 3, "m/s");
    var m2 = k.slider("Masse du chariot 2 (rouge)", 0.5, 5, 0.1, 1, "kg");
    var v2 = k.slider("Vitesse du chariot 2", -4, 4, 0.1, 0, "m/s");
    var e = k.slider("Type de choc : e (0 mou … 1 élastique)", 0, 1, 0.05, 1, "");
    var ro = k.readouts(["Quantité de mvt avant", "Quantité de mvt après", "Ec avant", "Ec après", "Énergie perdue"]);
    var nt = k.note("", ""), t = 0;
    function res(){
      var M1 = m1.value, M2 = m2.value, V1 = v1.value, V2 = v2.value, E = e.value, P = M1 * V1 + M2 * V2;
      var hit = V1 > V2;
      var u1 = hit ? (P + M2 * E * (V2 - V1)) / (M1 + M2) : V1, u2 = hit ? (P + M1 * E * (V1 - V2)) / (M1 + M2) : V2;
      return {P: P, hit: hit, u1: u1, u2: u2};
    }
    function posAt(tm){
      var r = res(), tc = r.hit ? 5 / (v1.value - v2.value) : Infinity, p1, p2;
      if (tm < tc){ p1 = 1 + v1.value * tm; p2 = 7 + v2.value * tm; }
      else { p1 = 1 + v1.value * tc + r.u1 * (tm - tc); p2 = 7 + v2.value * tc + r.u2 * (tm - tc); }
      return [p1, p2];
    }
    var lp = k.loop(function(dt){
      t += dt; var q = posAt(t);
      if (t > 9 || q[0] < -1.8 || q[0] > 12.8 || q[1] < -1.8 || q[1] > 12.8){ t = Math.min(t, 9); lp.pause(); }   /* un chariot va sortir de l'écran : on s'arrête */
      k.redraw();
    });
    k.button("Lancer / rejouer", function(){ t = 0; lp.play(); }, true);
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, r = res(), M1 = m1.value, M2 = m2.value;
      c.clear();
      var X0 = 20, sc = (c.W - 40) / 14, ty = 110;
      ctx.fillStyle = "#c9a77c"; ctx.fillRect(X0, ty, c.W - 40, 6);
      var gap = 5, x1 = 1, x2 = x1 + 1 + gap, tc = r.hit ? gap / (v1.value - v2.value) : Infinity;
      var p1, p2;
      if (t < tc){ p1 = x1 + v1.value * t; p2 = x2 + v2.value * t; }
      else { var xc1 = x1 + v1.value * tc, xc2 = x2 + v2.value * tc; p1 = xc1 + r.u1 * (t - tc); p2 = xc2 + r.u2 * (t - tc); }
      function cart(x, col, lab, w){
        var px = X0 + (x + 2) * sc; ctx.fillStyle = col; ctx.fillRect(px, ty - 30, sc, 26); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 1.5; ctx.strokeRect(px, ty - 30, sc, 26);
        S.draw.dot(c, px + 8, ty - 1, 4, "#13233a"); S.draw.dot(c, px + sc - 8, ty - 1, 4, "#13233a"); S.draw.text(c, lab, px + sc / 2, ty - 17, {size: 12, color: "#fff"});
      }
      cart(p1, pal.acc, S.fmt(M1, 1) + " kg"); cart(p2, pal.red, S.fmt(M2, 1) + " kg");
      var u1 = t >= tc ? r.u1 : v1.value, u2 = t >= tc ? r.u2 : v2.value;
      S.draw.text(c, "chariot 1 : " + S.fmt(u1, 2) + " m/s     chariot 2 : " + S.fmt(u2, 2) + " m/s", c.W / 2, 22, {size: 13});
      S.draw.text(c, t >= tc && r.hit ? "après le choc" : "avant le choc", c.W / 2, 44, {size: 12, color: pal.grey});
      /* barres */
      gr.clear();
      var Eb = 0.5 * M1 * v1.value * v1.value + 0.5 * M2 * v2.value * v2.value, Ea = 0.5 * M1 * r.u1 * r.u1 + 0.5 * M2 * r.u2 * r.u2;
      var pb = r.P, pa = M1 * r.u1 + M2 * r.u2;
      var pm = Math.max(Math.abs(pb), 1), em = Math.max(Eb, 1);
      var W = gr.W, H = gr.H, g = gr.ctx, bw = Math.min(70, W / 8);
      function bars(x0, title, a, b, mx, unit, cola, colb, signed){
        var base = signed ? H - 62 - (H - 120) / 2 : H - 42, sc2 = (H - 120) / (signed ? 2 : 1) / mx;
        S.draw.line(gr, x0 - 10, base, x0 + 2 * bw + 20, base, pal.grey, 1.5);
        [[a, "avant", cola, 0], [b, "après", colb, bw + 10]].forEach(function(z){
          var hh = z[0] * sc2; g.fillStyle = z[2]; g.fillRect(x0 + z[3], base - Math.max(hh, 0), bw, Math.abs(hh));
          S.draw.text(gr, S.fmt(z[0], 1), x0 + z[3] + bw / 2, base - hh - (hh >= 0 ? 12 : -12), {size: 12});
          S.draw.text(gr, z[1], x0 + z[3] + bw / 2, H - 18, {size: 12, color: pal.grey});
        });
        S.draw.text(gr, title + " (" + unit + ")", x0 + bw + 5, 22, {size: 13});
      }
      bars(W * 0.08, "p totale", pb, pa, pm, "kg·m/s", "#9bb0d8", pal.acc, true);
      bars(W * 0.55, "Ec totale", Eb, Ea, em, "J", "#e2b27a", pal.amber, false);
      ro.set(0, S.fmt(pb, 2) + " kg·m/s"); ro.set(1, S.fmt(pa, 2) + " kg·m/s"); ro.set(2, S.fmt(Eb, 2) + " J"); ro.set(3, S.fmt(Ea, 2) + " J");
      ro.set(4, S.fmt(Eb - Ea, 2) + " J");
      if (!r.hit) nt.set("Le chariot 1 n'est pas plus rapide que le chariot 2 (v₁ ≤ v₂) : ils ne se rencontrent pas, rien ne change.", "warn");
      else if (e.value === 1) nt.set("Choc élastique : p et Ec se conservent tous les deux. Les chariots s'éloignent avec la même vitesse relative qu'à l'approche.", "ok");
      else if (e.value === 0) nt.set("Choc mou : les chariots restent collés (même vitesse). p se conserve, mais Ec diminue de " + S.fmt(Eb - Ea, 2) + " J, transformés en chaleur et déformation.", "");
      else nt.set("Choc inélastique : p se conserve toujours ; Ec diminue de " + S.fmt(Eb - Ea, 2) + " J (" + S.fmt(100 * (Eb - Ea) / Math.max(Eb, 1e-9), 0) + " % de l'énergie cinétique initiale).", "");
    });
  }
});

SFA.sim({
  id: "p5-c04-patineurs", ch: "c04", tag: "Action-réaction",
  titre: "Deux patineurs qui se repoussent",
  resume: "Masses → vitesses opposées, forces égales sur des corps différents.",
  but: "Deux patineurs au repos se repoussent pendant une courte durée. Change leurs masses et la force de poussée. Compare les forces, les vitesses et les énergies cinétiques.",
  aRetenir: "Troisième loi : la force de A sur B est égale et opposée à celle de B sur A, mais elles s'exercent sur deux corps différents. Chacun reçoit la même impulsion F·Δt : celui qui a la plus petite masse prend la plus grande vitesse (m₁v₁ = m₂v₂).",
  piege: "Les deux forces sont égales mais les effets ne le sont pas : a = F/m est plus grande pour le plus léger. Et les forces d'une paire action-réaction ne s'annulent jamais, car elles agissent sur des corps différents.",
  build: function(k, S){
    var c = k.canvas(230);
    var m1 = k.slider("Masse du patineur A", 30, 100, 1, 50, "kg");
    var m2 = k.slider("Masse du patineur B", 30, 100, 1, 80, "kg");
    var F = k.slider("Force de poussée", 50, 300, 10, 150, "N");
    var dt = k.slider("Durée de la poussée", 0.2, 1, 0.05, 0.5, "s");
    var ro = k.readouts(["Vitesse de A", "Vitesse de B", "Quantité de mvt de A", "Quantité de mvt de B", "Ec de A", "Ec de B"]);
    var nt = k.note("", ""), t = 0, T = 3;
    var lp = k.loop(function(d){ t += d; if (t > T + 1) lp.pause(); k.redraw(); });
    k.button("Pousser !", function(){ t = 0; lp.play(); }, true);
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, Fo = F.value, d = dt.value, a1 = Fo / m1.value, a2 = Fo / m2.value, vA = a1 * d, vB = a2 * d;
      c.clear();
      ctx.fillStyle = "#e6f2fa"; ctx.fillRect(0, 150, c.W, 80);
      var tt = Math.min(t, T);
      function pos(a, v){ return tt < d ? 0.5 * a * tt * tt : 0.5 * a * d * d + v * (tt - d); }
      var xa = -pos(a1, vA), xb = pos(a2, vB);
      var far = Math.max(Math.abs(0.5 * a1 * d * d + vA * (T - d)), Math.abs(0.5 * a2 * d * d + vB * (T - d)), 0.1);
      var sc = (c.W / 2 - 50) / far, cx = c.W / 2;
      function person(x, col, lab){
        S.draw.dot(c, x, 108, 14, col); S.draw.line(c, x, 122, x, 148, col, 8);
        S.draw.text(c, lab, x, 108, {size: 12, color: "#fff"});
      }
      var ax = cx + xa * sc - 18, bx = cx + xb * sc + 18;
      person(ax, pal.acc, "A"); person(bx, pal.red, "B");
      var pushing = t < d;
      if (pushing){
        var L = 70;
        P5.vec(c, ax + 14, 130, ax + 14 - L, 130, pal.acc, "F sur A", {dy: -14});
        P5.vec(c, bx - 14, 130, bx - 14 + L, 130, pal.red, "F sur B", {dy: -14});
      } else {
        S.draw.text(c, "vA = " + S.fmt(vA, 2) + " m/s", ax, 70, {size: 12, color: pal.acc}); S.draw.text(c, "vB = " + S.fmt(vB, 2) + " m/s", bx, 70, {size: 12, color: pal.red});
      }
      S.draw.text(c, pushing ? "Pendant la poussée : forces égales, sur des corps différents" : "Après la poussée : mouvement rectiligne uniforme (échelle adaptée)", c.W / 2, 22, {size: 13});
      var EA = 0.5 * m1.value * vA * vA, EB = 0.5 * m2.value * vB * vB;
      ro.set(0, S.fmt(-vA, 2) + " m/s"); ro.set(1, S.fmt(vB, 2) + " m/s"); ro.set(2, S.fmt(-m1.value * vA, 1) + " kg·m/s"); ro.set(3, S.fmt(m2.value * vB, 1) + " kg·m/s");
      ro.set(4, S.fmt(EA, 1) + " J"); ro.set(5, S.fmt(EB, 1) + " J");
      nt.set("p total : " + S.fmt(-m1.value * vA + m2.value * vB, 1) + " kg·m/s = 0 (avant aussi). Rapport des vitesses vA/vB = mB/mA = " + S.fmt(vA / vB, 2) + ". L'énergie cinétique totale (" + S.fmt(EA + EB, 1) + " J) vient du travail musculaire : elle n'est pas conservée.", "");
    });
  }
});

SFA.sim({
  id: "p5-c04-canon", ch: "c04", tag: "Niche utile",
  titre: "Le recul du canon : même p, énergies très différentes",
  resume: "Masse du projectile → vitesse de recul et répartition de l'énergie.",
  but: "Tire un projectile avec un canon libre de reculer. Fais varier les masses et la vitesse de sortie : compare la quantité de mouvement et l'énergie cinétique du projectile et du canon.",
  aRetenir: "Système canon + projectile initialement immobile : p total = 0, donc M·V = m·v (recul V opposé). L'énergie cinétique se répartit en sens inverse des masses : Ec(canon)/Ec(projectile) = m/M, très petit pour un canon lourd.",
  piege: "Même quantité de mouvement ne veut pas dire même énergie : Ec = p²/(2m) est bien plus grande pour la petite masse. C'est pourquoi le canon recule lentement alors que le projectile emporte presque toute l'énergie.",
  build: function(k, S){
    var c = k.canvas(210), gr = k.canvas(170);
    var M = k.slider("Masse du canon M", 50, 2000, 10, 500, "kg");
    var m = k.slider("Masse du projectile m", 0.5, 20, 0.5, 5, "kg");
    var v = k.slider("Vitesse du projectile v", 100, 800, 10, 400, "m/s");
    var ro = k.readouts(["Vitesse de recul V", "Quantité de mvt du projectile", "Quantité de mvt du canon", "Ec projectile", "Ec canon", "Ec canon / Ec proj."]);
    var nt = k.note("", ""), t = -1;
    var lp = k.loop(function(d){ t += d; if (t > 2.5) lp.pause(); k.redraw(); });
    k.button("Tirer !", function(){ t = 0; lp.play(); }, true);
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, V = m.value * v.value / M.value, Ep = 0.5 * m.value * v.value * v.value, Ec = 0.5 * M.value * V * V;
      c.clear();
      ctx.fillStyle = "#e9edf3"; ctx.fillRect(0, 140, c.W, 70);
      var tt = Math.max(t, 0), cx = c.W / 2 - 60;
      var ccx = cx - Math.min(tt, 2.5) * 22 * Math.min(1, V / 2) - (t >= 0 ? 0 : 0);
      ctx.fillStyle = "#566176"; ctx.fillRect(ccx - 50, 100, 90, 34); ctx.fillRect(ccx + 40, 110, 50, 12);
      S.draw.dot(c, ccx - 25, 138, 12, pal.ink); S.draw.dot(c, ccx + 15, 138, 12, pal.ink);
      if (t >= 0){ var bx = ccx + 90 + tt * 140 * 1; S.draw.dot(c, Math.min(bx, c.W - 10), 116, 5 + m.value / 4, pal.red); }
      var Lp = Math.min(110, c.W / 2 - 60);
      P5.vec(c, c.W / 2, 62, c.W / 2 + Lp, 62, pal.red, "p proj.", {dy: -2, dx: 14});
      P5.vec(c, c.W / 2, 62, c.W / 2 - Lp, 62, pal.acc, "p canon", {dy: -2, dx: -14});
      S.draw.text(c, "recul V = " + S.fmt(V, 2) + " m/s · p égales et opposées", c.W / 2, 22, {size: 13});
      S.draw.text(c, "(vitesses à l'écran sur des échelles différentes)", c.W / 2, 42, {size: 12, color: pal.grey});
      /* barres d'énergie */
      gr.clear();
      var g = gr.ctx, tot = Ep + Ec, W = gr.W, H = gr.H, bw = W - 160;
      g.fillStyle = pal.red; g.fillRect(60, 60, bw * Ep / tot, 34); g.fillStyle = pal.acc; g.fillRect(60 + bw * Ep / tot, 60, Math.max(bw * Ec / tot, 1.5), 34);
      S.draw.text(gr, "Énergie cinétique totale : " + S.fmt(tot / 1000, 1) + " kJ", W / 2, 26, {size: 13});
      S.draw.text(gr, "projectile : " + S.fmt(100 * Ep / tot, 1) + " %", 60, 120, {align: "left", size: 13, color: pal.red});
      S.draw.text(gr, "canon : " + S.fmt(100 * Ec / tot, 2) + " %", 60, 146, {align: "left", size: 13, color: pal.acc});
      ro.set(0, S.fmt(V, 3) + " m/s"); ro.set(1, S.fmt(m.value * v.value, 0) + " kg·m/s"); ro.set(2, S.fmt(-M.value * V, 0) + " kg·m/s");
      ro.set(3, S.fmt(Ep / 1000, 1) + " kJ"); ro.set(4, S.fmt(Ec / 1000, 2) + " kJ"); ro.set(5, S.fmt(Ec / Ep, 4));
      nt.set("M·V = m·v donne V = " + S.fmt(V, 3) + " m/s. Le rapport des énergies vaut m/M = " + S.fmt(m.value / M.value, 4) + " : le projectile emporte presque toute l'énergie. (Modèle simplifié : on néglige les gaz et le frottement.)" + (V > 20 ? " Recul de " + S.fmt(V, 0) + " m/s : un canon aussi léger serait projeté vers l'arrière, le modèle reste valable mais n'a plus rien de réaliste." : ""), V > 20 ? "warn" : "");
    });
  }
});

SFA.sim({
  id: "p5-c04-airbag", ch: "c04", tag: "Impulsion",
  titre: "Airbag et crash test : la durée du choc change tout",
  resume: "Durée de l'arrêt → force moyenne subie par le passager.",
  but: "Un passager de masse m roulant à la vitesse v s'arrête complètement. Fais varier la durée Δt de l'arrêt (pare-brise, ceinture, airbag) et observe la force moyenne.",
  aRetenir: "Impulsion : F·Δt = Δp = m·Δv. Pour le même changement de quantité de mouvement, augmenter la durée Δt de l'arrêt diminue la force moyenne : F = m·v/Δt. Airbags, zones de déformation et casques allongent Δt.",
  piege: "L'airbag ne diminue pas la quantité de mouvement à absorber (m·v est le même) : il la répartit sur une durée plus longue. Et F est ici une force moyenne : le pic peut être plus grand.",
  build: function(k, S){
    var c = k.canvas(250);
    var v = k.slider("Vitesse avant l'impact", 20, 130, 5, 50, "km/h");
    var m = k.slider("Masse du passager", 40, 110, 5, 75, "kg");
    var dt = k.slider("Durée de l'arrêt Δt", 5, 300, 5, 100, "ms");
    k.button("Pare-brise rigide (10 ms)", function(){ dt.set(10); });
    k.button("Ceinture seule (60 ms)", function(){ dt.set(60); });
    k.button("Ceinture + airbag (120 ms)", function(){ dt.set(120); });
    var ro = k.readouts(["Quantité de mouvement m·v", "Force moyenne F", "F / poids", "Décélération", "Distance d'arrêt"]);
    var nt = k.note("", "");
    k.draw(function(){
      var pal = S.draw.palette, g = P5.g, V = v.value / 3.6, T = dt.value / 1000, p = m.value * V, F = p / T, a = V / T, d = V * T / 2;
      c.clear();
      var yK = F / 1000;
      var ymax = Math.max(20, Math.ceil(yK * 1.4 / 10) * 10);   /* l'axe s'adapte au point choisi */
      var ax = S.draw.axes(c, {x0: 0, x1: 300, y0: 0, y1: ymax, xl: "Δt (ms)", yl: "F moyenne (kN)", stepX: 50, l: 54});
      S.draw.fn(c, ax, function(x){ return p / (Math.max(x, 1) / 1000) / 1000; }, pal.acc);
      S.draw.line(c, ax.X(0), ax.Y(m.value * g / 1000), ax.X(300), ax.Y(m.value * g / 1000), pal.grey, 1.5, [4, 4]);
      S.draw.text(c, "poids du passager", ax.X(180), ax.Y(m.value * g / 1000) - 12, {align: "right", size: 12, color: pal.grey});
      S.draw.dot(c, ax.X(dt.value), ax.Y(yK), 7, a / g > 40 ? pal.red : a / g > 15 ? pal.amber : pal.green);
      S.draw.text(c, S.fmt(yK, 1) + " kN", ax.X(dt.value) + 10, ax.Y(yK) - 12, {align: "left", size: 13});
      ro.set(0, S.fmt(p, 0) + " kg·m/s"); ro.set(1, S.fmt(yK, 1) + " kN"); ro.set(2, S.fmt(F / (m.value * g), 1) + " ×"); ro.set(3, S.fmt(a / g, 1) + " g"); ro.set(4, S.fmt(d * 100, 0) + " cm");
      var ag = a / g;
      nt.set("F = m·v/Δt = " + S.fmt(p, 0) + " / " + S.fmt(T, 3) + " = " + S.fmt(yK, 1) + " kN, soit " + S.fmt(F / (m.value * g), 0) + " fois le poids. " + (ag > 40 ? "Décélération supérieure à ≈ 40 g : ordre de grandeur où les blessures graves deviennent probables." : ag > 15 ? "Décélération élevée, difficile à supporter sans blessure sans retenue adaptée." : "Décélération raisonnable : bien mieux supportée."), ag > 40 ? "bad" : ag > 15 ? "warn" : "ok");
    });
  }
});
