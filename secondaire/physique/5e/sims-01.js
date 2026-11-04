/* Chapitre 1 · Vecteurs, composition et décomposition des forces */
SFA.sim({
  id: "p5-c01-somme", ch: "c01", tag: "Vecteurs",
  titre: "Somme de deux forces : la règle du parallélogramme",
  resume: "Déplace les pointes de F₁ et F₂ et vois la résultante apparaître.",
  but: "Déplace la pointe des deux flèches (ou utilise les curseurs). Observe la résultante R = F₁ + F₂, ses composantes, et compare ‖R‖ à ‖F₁‖ + ‖F₂‖.",
  aRetenir: "On additionne les forces composante par composante : Rx = F₁x + F₂x et Ry = F₁y + F₂y. La norme de R est toujours inférieure ou égale à la somme des normes.",
  piege: "Additionner les normes (3 N + 4 N = 7 N) n'est vrai que si les deux forces ont la même direction et le même sens. Si elles sont perpendiculaires, ‖R‖ = 5 N.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.64});
    var ax1 = k.slider("F₁ horizontale", -6, 6, 0.5, 3, "N");
    var ay1 = k.slider("F₁ verticale", -4, 4, 0.5, 1, "N");
    var ax2 = k.slider("F₂ horizontale", -6, 6, 0.5, 1, "N");
    var ay2 = k.slider("F₂ verticale", -4, 4, 0.5, 3, "N");
    var tg = k.toggle("Montrer les composantes de R", true);
    k.button("Perpendiculaires (3 N et 4 N)", function(){ ax1.set(3); ay1.set(0); ax2.set(0); ay2.set(4); });
    k.button("Opposées", function(){ ax1.set(3); ay1.set(1); ax2.set(-3); ay2.set(-1); });
    k.button("Alignées", function(){ ax1.set(2); ay1.set(1); ax2.set(4); ay2.set(2); });
    var ro = k.readouts(["‖F₁‖", "‖F₂‖", "‖R‖", "‖F₁‖ + ‖F₂‖", "Rx ; Ry", "Angle de R"]);
    var nt = k.note("", "");
    var f, drag = 0;
    c.pointer(function(type, p){
      if (!f) return;
      var x = P5.clamp(Math.round(f.ix(p.x) * 2) / 2, -6, 6), y = P5.clamp(Math.round(f.iy(p.y) * 2) / 2, -4, 4);
      if (type === "down"){
        var d1 = Math.hypot(p.x - f.X(ax1.value), p.y - f.Y(ay1.value)), d2 = Math.hypot(p.x - f.X(ax2.value), p.y - f.Y(ay2.value));
        drag = d1 <= d2 ? 1 : 2;
      }
      if (type === "down" || type === "drag"){
        if (drag === 1){ ax1.set(x); ay1.set(y); } else if (drag === 2){ ax2.set(x); ay2.set(y); }
        k.redraw();
      }
    });
    k.draw(function(){
      c.clear();
      f = P5.frame(c, {x0: -7, x1: 7, y0: -4.5, y1: 4.5}, {axes: true});
      var x1 = ax1.value, y1 = ay1.value, x2 = ax2.value, y2 = ay2.value, rx = x1 + x2, ry = y1 + y2;
      var X0 = f.X(0), Y0 = f.Y(0), pal = S.draw.palette;
      S.draw.line(c, f.X(x1), f.Y(y1), f.X(rx), f.Y(ry), "#9bb0d8", 1.5, [5, 4]);
      S.draw.line(c, f.X(x2), f.Y(y2), f.X(rx), f.Y(ry), "#e2a29b", 1.5, [5, 4]);
      if (tg.value){
        S.draw.line(c, X0, Y0, f.X(rx), Y0, pal.green, 2, [3, 3]);
        S.draw.line(c, f.X(rx), Y0, f.X(rx), f.Y(ry), pal.green, 2, [3, 3]);
      }
      P5.vec(c, X0, Y0, f.X(x1), f.Y(y1), pal.acc, "F₁");
      P5.vec(c, X0, Y0, f.X(x2), f.Y(y2), pal.red, "F₂");
      P5.vec(c, X0, Y0, f.X(rx), f.Y(ry), pal.green, "R", {w: 3.4});
      S.draw.dot(c, f.X(x1), f.Y(y1), 6, pal.acc); S.draw.dot(c, f.X(x2), f.Y(y2), 6, pal.red);
      S.draw.text(c, "1 carreau = 1 N", c.W - 12, c.H - 12, {align: "right", size: 12, color: pal.grey});
      var n1 = Math.hypot(x1, y1), n2 = Math.hypot(x2, y2), nr = Math.hypot(rx, ry);
      ro.set(0, S.fmt(n1, 2) + " N"); ro.set(1, S.fmt(n2, 2) + " N"); ro.set(2, S.fmt(nr, 2) + " N"); ro.set(3, S.fmt(n1 + n2, 2) + " N");
      ro.set(4, S.fmt(rx, 1) + " ; " + S.fmt(ry, 1));
      ro.set(5, nr < 1e-9 ? "—" : S.fmt(Math.atan2(ry, rx) * 180 / Math.PI, 1) + " °");
      if (nr < 1e-9) nt.set("R = 0 : les deux forces se compensent exactement, le corps serait en équilibre.", "ok");
      else if (Math.abs(nr - (n1 + n2)) < 1e-9 && n1 > 0 && n2 > 0) nt.set("Forces de même direction et de même sens : ici seulement, les normes s'additionnent.", "ok");
      else if (Math.abs(x1 * x2 + y1 * y2) < 1e-9 && n1 > 0 && n2 > 0) nt.set("Forces perpendiculaires : ‖R‖ = √(‖F₁‖² + ‖F₂‖²) (Pythagore).", "ok");
      else nt.set("‖R‖ = " + S.fmt(nr, 2) + " N est plus petit que ‖F₁‖ + ‖F₂‖ = " + S.fmt(n1 + n2, 2) + " N.", "");
    });
  }
});

SFA.sim({
  id: "p5-c01-incline", ch: "c01", tag: "Décomposition",
  titre: "Le poids sur un plan incliné",
  resume: "Angle du plan → composantes parallèle et perpendiculaire du poids.",
  but: "Fais varier l'angle α et la masse. Observe comment le poids P se partage en une composante qui fait glisser (P∥) et une qui appuie sur le plan (P⊥). Relève le défi avec le bouton.",
  aRetenir: "Sur un plan incliné d'angle α : P∥ = P·sin α (le long de la pente) et P⊥ = P·cos α (perpendiculaire). Le poids lui-même ne change pas : P = m·g.",
  piege: "Ne confonds pas sin et cos : l'angle α du plan est le même que l'angle entre le poids et la perpendiculaire au plan, donc P⊥ = P·cos α. À 0° tout le poids appuie, à 90° plus rien n'appuie.",
  build: function(k, S){
    var c = k.canvas(340);
    var a = k.slider("Angle α du plan", 0, 90, 1, 30, "°");
    var m = k.slider("Masse m", 1, 10, 0.5, 5, "kg");
    var ro = k.readouts(["Poids P", "Composante parallèle", "Composante perpendiculaire", "Contrôle : √(somme des carrés)"]);
    var dfi = 0, defis = [["la composante P∥ vaut la moitié du poids", "par", 0.5], ["la composante P⊥ vaut la moitié du poids", "perp", 0.5], ["P∥ et P⊥ sont égales", "egal", 1]];
    var tgt = k.note("", "");
    k.button("Nouveau défi", function(){ dfi = (dfi + 1) % defis.length; });
    k.draw(function(){
      c.clear();
      var al = a.value * Math.PI / 180, P = m.value * P5.g, pal = S.draw.palette, ctx = c.ctx;
      var bx = 30, by = c.H - 40, L = Math.min(c.W - 70, 420), Hh = Math.min(L * Math.tan(al), c.H - 100);
      var Lx = Hh === L * Math.tan(al) ? L : Hh / Math.tan(al);
      if (a.value >= 89.5){ Lx = 0.001; Hh = c.H - 100; }
      /* triangle */
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Lx, by); ctx.lineTo(bx + Lx, by - Hh); ctx.closePath();
      ctx.fillStyle = "#e9edf3"; ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 2; ctx.stroke();
      S.draw.text(c, "α", bx + 38, by - 8, {color: pal.ink});
      /* bloc au milieu de la pente */
      var s = Math.hypot(Lx, Hh), ux = Lx / s, uy = -Hh / s;    /* vecteur unitaire le long de la pente (monte) */
      var px0 = bx + Lx * 0.55, py0 = by - Hh * 0.55; if (s < 1) { px0 = bx; py0 = by; }
      var nx = uy, ny = -ux;                                     /* normale sortante (vers le haut-gauche) */
      if (a.value >= 89.5){ ux = 0; uy = -1; nx = -1; ny = 0; px0 = bx; py0 = by - Hh * 0.55; }
      if (a.value === 0){ ux = 1; uy = 0; nx = 0; ny = -1; px0 = bx + L * 0.5; py0 = by; }
      var cx = px0 + nx * 15, cy = py0 + ny * 15;                /* centre du bloc */
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.atan2(uy, ux) * (a.value >= 89.5 ? 0 : 1)); ctx.fillStyle = "#c9d6f2"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.fillRect(-18, -15, 36, 30); ctx.strokeRect(-18, -15, 36, 30); ctx.restore();
      var sc = 105 / 98.1;                                       /* px par newton */
      var Lp = P * sc, Lpar = P * Math.sin(al) * sc, Lper = P * Math.cos(al) * sc;
      P5.vec(c, cx, cy, cx, cy + Lp, pal.ink, "P");
      /* P// vers le bas de la pente (-u), P⊥ vers l'intérieur (-n) */
      var ex = cx - ux * Lpar, ey = cy - uy * Lpar;
      P5.vec(c, cx, cy, ex, ey, pal.red, "P∥");
      P5.vec(c, cx, cy, cx - nx * Lper, cy - ny * Lper, pal.green, "P⊥");
      S.draw.line(c, ex, ey, cx, cy + Lp, "#aab4c3", 1.5, [4, 4]);
      S.draw.line(c, cx - nx * Lper, cy - ny * Lper, cx, cy + Lp, "#aab4c3", 1.5, [4, 4]);
      ro.set(0, S.fmt(P, 1) + " N"); ro.set(1, S.fmt(P * Math.sin(al), 1) + " N"); ro.set(2, S.fmt(P * Math.cos(al), 1) + " N");
      ro.set(3, S.fmt(Math.hypot(P * Math.sin(al), P * Math.cos(al)), 1) + " N");
      var d = defis[dfi], par = Math.sin(al), per = Math.cos(al), ok = false;
      if (d[1] === "par") ok = Math.abs(par - 0.5) < 0.01; else if (d[1] === "perp") ok = Math.abs(per - 0.5) < 0.01; else ok = Math.abs(par - per) < 0.015;
      tgt.set("<b>Défi " + (dfi + 1) + "/3.</b> Règle l'angle pour que " + d[0] + ". " + (ok ? "Réussi : α = " + S.fmt(a.value, 0) + " °. Retrouve-le par le calcul avec sin α ou cos α." : "Pas encore."), ok ? "ok" : "");
      if (a.value === 0) S.draw.text(c, "Plan horizontal : P∥ = 0, P⊥ = P", c.W - 14, 22, {align: "right", color: pal.ink});
      if (a.value >= 89.5) S.draw.text(c, "Plan vertical : P⊥ = 0, le bloc ne s'appuie plus", c.W - 14, 22, {align: "right", color: pal.red});
    });
  }
});

SFA.sim({
  id: "p5-c01-remorqueurs", ch: "c01", tag: "Application",
  titre: "Deux remorqueurs tirent un cargo",
  resume: "Angle des câbles → force résultante et direction du cargo.",
  but: "Règle les forces et les angles des deux remorqueurs. Défi : fais avancer le cargo tout droit (composante latérale nulle) avec une résultante d'au moins 120 kN.",
  aRetenir: "Seule la composante des forces dans le sens du déplacement fait avancer le cargo ; les composantes latérales se compensent, ou le font dévier. Plus l'angle entre les câbles est grand, plus on gaspille de force.",
  piege: "Deux remorqueurs de 100 kN ne donnent pas 200 kN de traction vers l'avant, sauf si les câbles sont parallèles : R = 2·F·cos(θ) pour deux forces égales à ±θ de l'axe.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62});
    var f1 = k.slider("Force du remorqueur 1", 0, 100, 5, 70, "kN");
    var t1 = k.slider("Angle du câble 1 (à gauche de l'axe)", 0, 80, 1, 30, "°");
    var f2 = k.slider("Force du remorqueur 2", 0, 100, 5, 70, "kN");
    var t2 = k.slider("Angle du câble 2 (à droite de l'axe)", 0, 80, 1, 30, "°");
    var ro = k.readouts(["Avant (Rx)", "Latéral (Ry)", "‖R‖", "F₁ + F₂", "Part utile Rx/(F₁+F₂)"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var pal = S.draw.palette, ctx = c.ctx, cx = 70, cy = c.H / 2, sc = Math.min((c.W - 150) / 110, (c.H / 2 - 30) / 80);
      var a1 = t1.value * Math.PI / 180, a2 = t2.value * Math.PI / 180, F1 = f1.value, F2 = f2.value;
      var rx = F1 * Math.cos(a1) + F2 * Math.cos(a2), ry = F1 * Math.sin(a1) - F2 * Math.sin(a2);   /* ry > 0 : vers le haut de l'écran (remorqueur 1) */
      /* eau et cargo */
      ctx.fillStyle = "#e8f1f8"; ctx.fillRect(0, 0, c.W, c.H);
      ctx.save(); ctx.fillStyle = "#c9d6f2"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - 60, cy - 18); ctx.lineTo(cx, cy - 18); ctx.lineTo(cx + 22, cy); ctx.lineTo(cx, cy + 18); ctx.lineTo(cx - 60, cy + 18); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      S.draw.line(c, cx, cy, c.W - 20, cy, "#9fb3c8", 1, [6, 5]);
      /* câbles et remorqueurs (à longueur fixe 90 px) */
      var Lc = Math.min(130, c.W * 0.28);
      var p1 = [cx + Lc * Math.cos(a1), cy - Lc * Math.sin(a1)], p2 = [cx + Lc * Math.cos(a2), cy + Lc * Math.sin(a2)];
      S.draw.line(c, cx, cy, p1[0], p1[1], "#6b7685", 2); S.draw.line(c, cx, cy, p2[0], p2[1], "#6b7685", 2);
      S.draw.dot(c, p1[0], p1[1], 9, pal.acc); S.draw.dot(c, p2[0], p2[1], 9, pal.red);
      S.draw.text(c, "1", p1[0], p1[1], {color: "#fff", size: 12}); S.draw.text(c, "2", p2[0], p2[1], {color: "#fff", size: 12});
      /* forces au point d'attache */
      P5.vec(c, cx, cy, cx + F1 * Math.cos(a1) * sc, cy - F1 * Math.sin(a1) * sc, pal.acc, "F₁", {dy: -4});
      P5.vec(c, cx, cy, cx + F2 * Math.cos(a2) * sc, cy + F2 * Math.sin(a2) * sc, pal.red, "F₂", {dy: 4});
      P5.vec(c, cx, cy, cx + rx * sc, cy - ry * sc, pal.green, "R", {w: 3.6});
      S.draw.text(c, "100 kN = " + S.fmt(100 * sc, 0) + " px", c.W - 12, c.H - 12, {align: "right", size: 12, color: pal.grey});
      var nr = Math.hypot(rx, ry);
      ro.set(0, S.fmt(rx, 1) + " kN"); ro.set(1, S.fmt(ry, 1) + " kN"); ro.set(2, S.fmt(nr, 1) + " kN"); ro.set(3, S.fmt(F1 + F2, 0) + " kN");
      ro.set(4, F1 + F2 > 0 ? S.fmt(100 * rx / (F1 + F2), 0) + " %" : "—");
      var straight = Math.abs(ry) <= 2;
      if (rx >= 120 && straight) nt.set("Réussi : le cargo avance droit avec " + S.fmt(rx, 1) + " kN vers l'avant (latéral = " + S.fmt(ry, 1) + " kN).", "ok");
      else if (!straight) nt.set("Le cargo dévie vers le " + (ry > 0 ? "haut (remorqueur 1 gagne)" : "bas (remorqueur 2 gagne)") + " : composante latérale " + S.fmt(Math.abs(ry), 1) + " kN. Compense en changeant une force ou un angle.", "warn");
      else nt.set("Le cargo va droit mais Rx = " + S.fmt(rx, 1) + " kN : il en faut au moins 120. Augmente les forces ou rapproche les câbles de l'axe.", "");
    });
  }
});

SFA.sim({
  id: "p5-c01-cables", ch: "c01", tag: "Niche utile",
  titre: "Pourquoi un câble ne peut jamais être tendu à l'horizontale",
  resume: "Une charge au milieu de deux câbles : la tension explose quand l'angle diminue.",
  but: "Accroche une charge au milieu de deux câbles. Diminue l'angle α avec l'horizontale et surveille la tension : jusqu'où peux-tu tendre le câble sans le rompre ?",
  aRetenir: "Chaque câble porte T = m·g / (2·sin α). Quand α → 0, sin α → 0 et T devient immense : un câble parfaitement horizontal est impossible avec une charge au milieu.",
  piege: "La tension n'est pas égale à la moitié du poids : elle ne vaut m·g/2 que si les câbles sont verticaux (α = 90°). Plus ils sont tendus, plus chacun porte.",
  build: function(k, S){
    var c = k.canvas(250), g2 = k.canvas(200);
    var al = k.slider("Angle α de chaque câble avec l'horizontale", 3, 90, 1, 30, "°");
    var m = k.slider("Masse suspendue", 20, 1000, 10, 200, "kg");
    var lim = k.slider("Résistance maximale d'un câble", 2, 40, 1, 10, "kN");
    var ro = k.readouts(["Poids", "Tension T (chaque câble)", "Composante horizontale", "Angle minimal permis"]);
    var nt = k.note("", "");
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, A = al.value * Math.PI / 180, W = m.value * P5.g, T = W / (2 * Math.sin(A));
      var Tmax = lim.value * 1000, ratio = W / (2 * Tmax);
      var amin = ratio <= 1 ? Math.asin(ratio) * 180 / Math.PI : null;
      var broke = T > Tmax;
      /* scène */
      c.clear();
      var span = c.W - 120, mx = c.W / 2, top = 40, sag = Math.min(c.H - 80, (span / 2) * Math.tan(A));
      S.draw.line(c, 60, top - 20, 60, top + 30, pal.grey, 8); S.draw.line(c, c.W - 60, top - 20, c.W - 60, top + 30, pal.grey, 8);
      var col = broke ? pal.red : pal.acc;
      S.draw.line(c, 60, top, mx, top + sag, col, 3); S.draw.line(c, c.W - 60, top, mx, top + sag, col, 3);
      ctx.fillStyle = "#c9d6f2"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.fillRect(mx - 20, top + sag, 40, 34); ctx.strokeRect(mx - 20, top + sag, 40, 34);
      S.draw.text(c, S.fmt(m.value, 0) + " kg", mx, top + sag + 17, {size: 12});
      var Ls = Math.min(sag * 0.7 + 25, 85);
      P5.vec(c, mx, top + sag, mx - Ls * Math.cos(A), top + sag - Ls * Math.sin(A), pal.red, "T", {dx: -2});
      P5.vec(c, mx, top + sag, mx + Ls * Math.cos(A), top + sag - Ls * Math.sin(A), pal.red, "T", {dx: 2});
      P5.vec(c, mx, top + sag + 34, mx, top + sag + 34 + 28, pal.ink, "", {});
      S.draw.text(c, "α", 60 + 46 * Math.cos(A / 2) * 1, top + 46 * Math.sin(A / 2) + 4, {color: pal.ink, size: 12});
      if (broke) S.draw.text(c, "RUPTURE : T > " + S.fmt(lim.value, 0) + " kN", c.W / 2, c.H - 14, {color: pal.red, size: 14});
      /* graphe T(α) */
      g2.clear();
      var Tm = Math.max(lim.value * 1000 * 1.6, 1);
      var ax = S.draw.axes(g2, {x0: 0, x1: 90, y0: 0, y1: Tm / 1000, xl: "α (°)", yl: "T (kN)", stepX: 15});
      S.draw.fn(g2, ax, function(x){ return W / (2 * Math.sin(Math.max(x, 0.3) * Math.PI / 180)) / 1000; }, pal.acc);
      S.draw.line(g2, ax.X(0), ax.Y(lim.value), ax.X(90), ax.Y(lim.value), pal.red, 1.8, [6, 4]);
      S.draw.text(g2, "limite", ax.X(88), ax.Y(lim.value) - 10, {align: "right", color: pal.red, size: 12});
      if (T / 1000 <= ax.y1) S.draw.dot(g2, ax.X(al.value), ax.Y(T / 1000), 6, broke ? pal.red : pal.green);
      ro.set(0, S.fmt(W / 1000, 2) + " kN"); ro.set(1, S.fmt(T / 1000, 2) + " kN"); ro.set(2, S.fmt(T * Math.cos(A) / 1000, 2) + " kN");
      ro.set(3, amin === null ? "aucun" : S.fmt(amin, 1) + " °");
      if (amin === null) nt.set("Même câbles verticaux, chacun porterait " + S.fmt(W / 2000, 1) + " kN, au-delà de sa limite : ce câble ne convient pas.", "bad");
      else if (broke) nt.set("T = " + S.fmt(T / 1000, 1) + " kN dépasse la limite de " + S.fmt(lim.value, 0) + " kN. Il faut α ≥ " + S.fmt(amin, 1) + " °.", "warn");
      else nt.set("Le câble tient : T = " + S.fmt(T / 1000, 2) + " kN pour une limite de " + S.fmt(lim.value, 0) + " kN. Tu peux descendre jusqu'à α = " + S.fmt(amin, 1) + " °.", "ok");
    });
  }
});
