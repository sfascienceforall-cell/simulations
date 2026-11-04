/* Chapitre 3 · Deuxième loi de Newton */
SFA.sim({
  id: "p5-c03-chariot", ch: "c03", tag: "Classique",
  titre: "Le chariot tiré par une masse suspendue",
  resume: "Masse du chariot et masse suspendue → accélération mesurée.",
  but: "Fais varier la masse du chariot M, la masse suspendue m et le frottement. Prévois l'accélération avec ΣF = m·a avant de lâcher le chariot, puis compare au graphe.",
  aRetenir: "Le système (chariot + masse suspendue) est accéléré par la seule force motrice m·g : (M + m)·a = m·g − f. Donc a < g toujours, et plus on ajoute de masse au chariot, plus a diminue.",
  piege: "La tension du fil n'est pas égale à m·g : la masse suspendue accélère, donc T = m·(g − a) < m·g. Elle n'égale m·g que si a = 0.",
  build: function(k, S){
    var c = k.canvas(190), gr = k.canvas(190);
    var M = k.slider("Masse du chariot M", 0.2, 2, 0.1, 1, "kg");
    var m = k.slider("Masse suspendue m", 0.02, 0.5, 0.01, 0.1, "kg");
    var mu = k.slider("Frottement du chariot (μ)", 0, 0.3, 0.01, 0, "");
    var ro = k.readouts(["Force motrice m·g", "Accélération a", "Tension T du fil", "Vitesse v", "a / g"]);
    var nt = k.note("", "");
    var t = 0, x = 0, v = 0, L = 1.2;
    function acc(){ var mg = m.value * P5.g, f = mu.value * M.value * P5.g; return mg > f ? (mg - f) / (M.value + m.value) : 0; }
    var lp = k.loop(function(dt){
      var a = acc(); if (x < L){ v += a * dt; x += v * dt; t += dt; } else lp.pause();
      if (x >= L){ x = L; }
      k.redraw();
    });
    k.button("Lâcher le chariot", function(){ t = 0; x = 0; v = 0; lp.play(); }, true);
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, g = P5.g, a = acc();
      c.clear();
      var X0 = 30, tw = c.W - 100, ty = 90;
      ctx.fillStyle = "#c9a77c"; ctx.fillRect(X0, ty, tw, 10);
      var px = X0 + (x / L) * (tw - 70);
      ctx.fillStyle = "#c9d6f2"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.fillRect(px, ty - 34, 56, 30); ctx.strokeRect(px, ty - 34, 56, 30);
      S.draw.dot(c, px + 12, ty - 2, 5, pal.ink); S.draw.dot(c, px + 44, ty - 2, 5, pal.ink);
      S.draw.text(c, "M", px + 28, ty - 19, {size: 12});
      var pulx = X0 + tw + 14; S.draw.dot(c, pulx, ty - 18, 10, pal.grey);
      S.draw.line(c, px + 56, ty - 18, pulx, ty - 18, pal.ink, 1.5);
      var hang = 56 + (x / L) * 40;
      S.draw.line(c, pulx + 10, ty - 18, pulx + 10, ty + hang, pal.ink, 1.5);
      ctx.fillStyle = "#f2c9c9"; ctx.strokeStyle = pal.red; ctx.fillRect(pulx - 4, ty + hang, 28, 24); ctx.strokeRect(pulx - 4, ty + hang, 28, 24);
      S.draw.text(c, "m", pulx + 10, ty + hang + 12, {size: 12});
      S.draw.text(c, "sol : x = " + S.fmt(x, 2) + " m", 10, c.H - 12, {align: "left", size: 12, color: pal.grey});
      /* graphe a(m) */
      gr.clear();
      var Mv = M.value, mus = mu.value;
      var ax = S.draw.axes(gr, {x0: 0, x1: 0.5, y0: 0, y1: 10, xl: "m (kg)", yl: "a (m/s²)", stepX: 0.1, stepY: 2});
      S.draw.fn(gr, ax, function(mm){ var F = mm * g - mus * Mv * g; return F > 0 ? F / (Mv + mm) : 0; }, pal.acc);
      S.draw.line(gr, ax.X(0), ax.Y(g), ax.X(0.5), ax.Y(g), pal.red, 1.5, [6, 4]); S.draw.text(gr, "g", ax.X(0.49), ax.Y(g) - 9, {color: pal.red, size: 12});
      S.draw.dot(gr, ax.X(m.value), ax.Y(a), 6, pal.green);
      var T = a > 0 ? Mv * (a + mus * g) : m.value * g;
      ro.set(0, S.fmt(m.value * g, 2) + " N"); ro.set(1, S.fmt(a, 2) + " m/s²"); ro.set(2, S.fmt(T, 2) + " N"); ro.set(3, S.fmt(v, 2) + " m/s"); ro.set(4, S.fmt(a / g, 3));
      if (a === 0) nt.set("Le chariot ne démarre pas : la force motrice m·g est inférieure ou égale au frottement μ·M·g.", "warn");
      else nt.set("(M + m)·a = m·g − μ·M·g : a = " + S.fmt(a, 2) + " m/s², soit " + S.fmt(100 * a / g, 0) + " % de g. Le fil tire le chariot avec T = " + S.fmt(T, 2) + " N, moins que m·g = " + S.fmt(m.value * g, 2) + " N.", "");
    });
  }
});

SFA.sim({
  id: "p5-c03-forces", ch: "c03", tag: "Défi",
  titre: "Diagramme de forces : trouve la résultante et l'accélération",
  resume: "Règle les forces horizontales et le frottement ; atteins l'accélération demandée.",
  but: "Un bloc est tiré vers la droite et vers la gauche, avec un frottement. Calcule ΣF et a, puis relève les défis : fais en sorte que l'accélération vaille la valeur demandée.",
  aRetenir: "On additionne les forces avec leur signe (droite +, gauche −), on obtient ΣF, puis a = ΣF/m. Le poids et la réaction normale se compensent ici (mouvement horizontal) : ils n'interviennent pas dans a.",
  piege: "Le frottement s'oppose au mouvement, il ne le crée pas, et il ne peut pas retourner le bloc : si les forces appliquées sont plus faibles que le frottement maximal, le bloc reste immobile et a = 0 (pas d'accélération négative).",
  build: function(k, S){
    var c = k.canvas(230);
    var m = k.slider("Masse du bloc", 0.5, 10, 0.5, 4, "kg");
    var fd = k.slider("Force vers la droite", 0, 50, 1, 20, "N");
    var fg = k.slider("Force vers la gauche", 0, 50, 1, 5, "N");
    var fr = k.slider("Frottement maximal", 0, 30, 1, 3, "N");
    var ro = k.readouts(["Forces appliquées (→ +)", "Frottement actif", "ΣF", "Accélération a", "v après 5 s"]);
    var tg = [2, 0.5, 4, 0], di = 0, nt = k.note("", "");
    k.button("Nouveau défi", function(){ di = (di + 1) % tg.length; });
    var xo = 0, v = 0, lp = k.loop(function(dt){ v += st().a * dt; xo += v * dt; k.redraw(); });
    k.button("Animer / réinitialiser", function(){ xo = 0; v = 0; lp.play(); });
    function st(){
      var app = fd.value - fg.value, f = 0, a = 0;
      if (Math.abs(app) <= fr.value && Math.abs(v) < 1e-9){ f = -app; a = 0; }
      else { var s = (Math.abs(v) > 1e-9 ? Math.sign(v) : Math.sign(app)); f = -s * fr.value; a = (app + f) / m.value; }
      return {app: app, f: f, a: a, net: app + f};
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, s = st(); c.clear();
      var ty = 130, cx = c.W / 2;
      ctx.fillStyle = "#e6edf5"; ctx.fillRect(0, ty + 20, c.W, c.H - ty - 20);
      var off = (xo * 30) % 40; for (var i = -1; i < c.W / 40 + 2; i++) S.draw.line(c, i * 40 - off, ty + 20, i * 40 - off, ty + 28, pal.grey, 2);
      ctx.fillStyle = "#c9d6f2"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.fillRect(cx - 35, ty - 40, 70, 60); ctx.strokeRect(cx - 35, ty - 40, 70, 60);
      S.draw.text(c, S.fmt(m.value, 1) + " kg", cx, ty - 10, {size: 13});
      var sc = 2.4, P = m.value * P5.g;
      if (fd.value > 0) P5.vec(c, cx + 35, ty - 10, cx + 35 + fd.value * sc, ty - 10, pal.acc, "F₁", {dy: -2});
      if (fg.value > 0) P5.vec(c, cx - 35, ty - 10, cx - 35 - fg.value * sc, ty - 10, pal.red, "F₂", {dy: -2});
      if (Math.abs(s.f) > 0) P5.vec(c, cx, ty + 12, cx + s.f * sc, ty + 12, pal.amber, "f", {dy: 12});
            S.draw.text(c, "P = N = " + S.fmt(P, 1) + " N (se compensent)", cx, 22, {size: 12, color: pal.grey});
      ro.set(0, S.fmt(s.app, 1) + " N"); ro.set(1, S.fmt(s.f, 1) + " N"); ro.set(2, S.fmt(s.net, 1) + " N"); ro.set(3, S.fmt(s.a, 2) + " m/s²");
      ro.set(4, S.fmt(s.a * 5, 1) + " m/s");
      var ok = Math.abs(s.a - tg[di]) < 0.03;
      nt.set("<b>Défi " + (di + 1) + "/4.</b> Obtiens a = " + S.fmt(tg[di], 1) + " m/s²" + (tg[di] === 0 ? " (sans utiliser des forces égales à zéro)" : "") + ". " + (ok ? "Réussi : ΣF = m·a = " + S.fmt(m.value * tg[di], 1) + " N." : "Pas encore : il te faut ΣF = m·a = " + S.fmt(m.value * tg[di], 1) + " N."), ok ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "p5-c03-fusee", ch: "c03", tag: "Niche utile",
  titre: "La fusée : masse qui diminue, accélération qui augmente",
  resume: "Poussée, masse et débit de carburant → accélération, vitesse et altitude.",
  but: "Règle la poussée, la masse à vide et le carburant. Trouve des réglages où la fusée décolle, puis cherche l'altitude maximale. Observe l'accélération pendant la combustion.",
  aRetenir: "ΣF = F − m·g = m·a, donc a = F/m − g. Comme la masse m diminue (le carburant brûle) alors que F reste constante, l'accélération augmente pendant la poussée. La fusée ne décolle que si F > m·g.",
  piege: "Une poussée égale au poids ne fait pas « monter lentement » : la résultante est nulle et la fusée reste au sol (ou à vitesse constante). Après la fin de la poussée, la fusée monte encore (elle garde sa vitesse), puis retombe : seule la gravité agit.",
  build: function(k, S){
    var sc1 = k.canvas(250), gr = k.canvas(170);
    var F = k.slider("Poussée F", 200, 3000, 50, 1200, "N");
    var m0 = k.slider("Masse à vide", 5, 40, 1, 20, "kg");
    var mc = k.slider("Masse de carburant", 2, 30, 1, 12, "kg");
    var q = k.slider("Débit de carburant", 0.5, 5, 0.1, 2, "kg/s");
    var ro = k.readouts(["a au départ", "a avant l'extinction", "Durée de poussée", "Vitesse max", "Altitude max"]);
    var nt = k.note("", ""), tr = null, tp = 0;
    function simulate(){
      var g = P5.g, dt = 0.02, t = 0, h = 0, v = 0, fuel = mc.value, out = [[0, 0, 0, 0]], vmax = 0, hmax = 0, tb = mc.value / q.value, launched = F.value > (m0.value + mc.value) * g;
      if (!launched) return {pts: out, tb: tb, vmax: 0, hmax: 0, launched: false, T: 0};
      var amax0 = F.value / (m0.value + mc.value) - g;
      while (t < 400){
        var burn = fuel > 1e-9, m = m0.value + Math.max(fuel, 0), a = (burn ? F.value : 0) / m - g;
        v += a * dt; h += v * dt; if (burn){ fuel -= q.value * dt; } t += dt;
        if (h <= 0){ h = 0; out.push([t, 0, v, a]); break; }
        vmax = Math.max(vmax, v); hmax = Math.max(hmax, h);
        out.push([t, h, v, a]);
      }
      return {pts: out, tb: tb, vmax: vmax, hmax: hmax, launched: true, T: t};
    }
    var lp = k.loop(function(dt){ tp += dt * 2; if (tr && tp > tr.T + 1) lp.pause(); k.redraw(); });
    k.button("Lancer (temps ×2)", function(){ tr = simulate(); tp = 0; lp.play(); }, true);
    k.draw(function(){
      var pal = S.draw.palette, ctx = sc1.ctx, g = P5.g, mt = m0.value + mc.value;
      var R = simulate0();
      function simulate0(){ return tr = tr && tr.key === key() ? tr : (function(){ var r = simulate(); r.key = key(); return r; })(); }
      function key(){ return [F.value, m0.value, mc.value, q.value].join("|"); }
      sc1.clear(); gr.clear();
      var pts = R.pts, hmax = Math.max(R.hmax, 10), T = Math.max(R.T, 5);
      var ax = S.draw.axes(sc1, {x0: 0, x1: T * 1.02, y0: 0, y1: hmax * 1.1, xl: "t (s)", yl: "altitude (m)", l: 60});
      ctx.strokeStyle = pal.acc; ctx.lineWidth = 2.5; ctx.beginPath(); var cur = null;
      pts.forEach(function(p, i){ if (p[0] > tp && !cur){ cur = p; } if (p[0] <= tp || !R.launched){ if (i === 0) ctx.moveTo(ax.X(p[0]), ax.Y(p[1])); else ctx.lineTo(ax.X(p[0]), ax.Y(p[1])); } });
      ctx.stroke();
      var idx = 0; while (idx < pts.length - 1 && pts[idx][0] < tp) idx++; var pc = pts[idx];
      if (R.launched){ S.draw.dot(sc1, ax.X(pc[0]), ax.Y(pc[1]), 7, pal.red); }
      if (R.launched) S.draw.line(sc1, ax.X(R.tb), ax.Y(0), ax.X(R.tb), ax.Y(hmax * 1.1), pal.amber, 1.5, [5, 4]);
      if (R.launched) S.draw.text(sc1, "fin de poussée", ax.X(R.tb) + 4, ax.T + 10, {align: "left", size: 12, color: pal.amber});
      var ax2 = S.draw.axes(gr, {x0: 0, x1: T * 1.02, y0: -12, y1: Math.max(F.value / (m0.value) - g, 10) * 1.05, xl: "t (s)", yl: "a (m/s²)", l: 60});
      if (R.launched){
        ctx = gr.ctx; ctx.strokeStyle = pal.green; ctx.lineWidth = 2.5; ctx.beginPath();
        pts.forEach(function(p, i){ if (p[0] > tp) return; if (i === 0) ctx.moveTo(ax2.X(p[0]), ax2.Y(p[3])); else ctx.lineTo(ax2.X(p[0]), ax2.Y(p[3])); }); ctx.stroke();
      }
      var a0 = F.value / mt - g, a1 = F.value / m0.value - g;
      ro.set(0, S.fmt(a0, 2) + " m/s²"); ro.set(1, S.fmt(a1, 2) + " m/s²"); ro.set(2, S.fmt(mc.value / q.value, 1) + " s");
      ro.set(3, R.launched ? S.fmt(R.vmax, 1) + " m/s" : "0"); ro.set(4, R.launched ? S.fmt(R.hmax, 0) + " m" : "0 m");
      if (!R.launched) nt.set("F = " + S.fmt(F.value, 0) + " N ≤ m·g = " + S.fmt(mt * g, 0) + " N : la résultante n'est pas positive, la fusée reste au sol (le sol compense la différence).", "warn");
      else nt.set("Poussée " + S.fmt(F.value, 0) + " N pour un poids initial de " + S.fmt(mt * g, 0) + " N. L'accélération passe de " + S.fmt(a0, 1) + " à " + S.fmt(a1, 1) + " m/s² pendant la combustion (modèle simplifié : g constant, pas de frottement de l'air).", "");
    });
  }
});

SFA.sim({
  id: "p5-c03-ascenseur", ch: "c03", tag: "Poids apparent",
  titre: "L'ascenseur et la balance : le poids apparent",
  resume: "Accélération de la cabine → indication de la balance.",
  but: "Place une personne sur une balance dans une cabine et fais varier l'accélération de la cabine. Que lit la balance au démarrage en montée, à vitesse constante, et si le câble casse (a = −g) ?",
  aRetenir: "La balance mesure la réaction normale N : N − m·g = m·a, donc N = m·(g + a) (a positif vers le haut). a > 0 : plus lourd ; a = 0 : poids normal ; a = −g : N = 0, impondérabilité.",
  piege: "La balance ne donne pas la vitesse : monter ou descendre à vitesse constante donne la même lecture. C'est le signe de l'accélération qui compte (monter en freinant donne a < 0, comme descendre en accélérant).",
  build: function(k, S){
    var c = k.canvas(260), gr = k.canvas(170);
    var a = k.slider("Accélération de la cabine (+ : vers le haut)", -12, 6, 0.1, 2, "m/s²");
    var m = k.slider("Masse de la personne", 40, 100, 1, 70, "kg");
    k.button("Démarrage en montée", function(){ a.set(2); });
    k.button("Vitesse constante", function(){ a.set(0); });
    k.button("Câble rompu", function(){ a.set(-9.81); });
    var ro = k.readouts(["Poids réel m·g", "Réaction N", "La balance indique", "N / (m·g)"]);
    var nt = k.note("", "");
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, g = P5.g, A = a.value;
      var N = Math.max(0, m.value * (g + A)), P = m.value * g;
      c.clear();
      var cw = 150, cx = c.W / 2 - cw / 2;
      ctx.fillStyle = "#eef3fa"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.fillRect(cx, 20, cw, 210); ctx.strokeRect(cx, 20, cw, 210);
      ctx.fillStyle = "#13233a"; ctx.fillRect(cx + 40, 214, 70, 8);
      S.draw.dot(c, cx + 75, 152, 13, pal.amber); S.draw.line(c, cx + 75, 165, cx + 75, 210, pal.ink, 5);
      S.draw.text(c, "La balance indique " + S.fmt(N / g, 1) + " kg", cx + 75, 247, {size: 13, color: pal.ink});
      var sc = 45 / P;
      P5.vec(c, cx + 95, 152, cx + 95, 152 + P * sc, pal.ink, "P", {dx: 14});
      P5.vec(c, cx + 55, 152, cx + 55, 152 - N * sc, pal.red, "N", {dx: -14});
      if (A !== 0) P5.vec(c, cx - 40, 125, cx - 40, 125 - A * 7, pal.green, "a", {dx: -10});
      
      /* graphe N(a) */
      gr.clear();
      var ax = S.draw.axes(gr, {x0: -12, x1: 6, y0: 0, y1: m.value * (g + 6) * 1.05 / 1, xl: "a (m/s²)", yl: "N (N)", stepX: 3, l: 56});
      S.draw.fn(gr, ax, function(x){ return Math.max(0, m.value * (g + x)); }, pal.acc);
      S.draw.dot(gr, ax.X(A), ax.Y(N), 6, pal.red);
      S.draw.line(gr, ax.X(-g), ax.Y(0), ax.X(-g), ax.Y(ax.y1 * 0.3), pal.amber, 1.5, [4, 4]); S.draw.text(gr, "−g", ax.X(-g) + 4, ax.Y(ax.y1 * 0.33), {align: "left", size: 12, color: pal.amber});
      ro.set(0, S.fmt(P, 0) + " N"); ro.set(1, S.fmt(N, 0) + " N"); ro.set(2, S.fmt(N / g, 1) + " kg"); ro.set(3, S.fmt(N / P, 2));
      if (Math.abs(A + g) < 0.06) nt.set("a ≈ −g : chute libre, N ≈ 0 : la personne et la balance tombent ensemble, la balance indique ≈ 0 kg (impondérabilité).", "warn");
      else if (A < -g) nt.set("a < −g : la cabine descend plus vite qu'en chute libre ; la personne est plaquée au plafond et la balance indique 0 (N = 0 sur la balance).", "bad");
      else if (A > 0) nt.set("a > 0 (vers le haut) : la balance indique " + S.fmt(N / g, 1) + " kg, plus que " + S.fmt(m.value, 0) + " kg : la cabine monte en accélérant ou descend en freinant.", "");
      else if (A < 0) nt.set("a < 0 (vers le bas) : la balance indique " + S.fmt(N / g, 1) + " kg : la cabine monte en freinant ou descend en accélérant.", "");
      else nt.set("a = 0 : N = m·g, la balance indique la masse " + S.fmt(m.value, 0) + " kg, que la cabine soit à l'arrêt, monte ou descende à vitesse constante.", "ok");
    });
  }
});
