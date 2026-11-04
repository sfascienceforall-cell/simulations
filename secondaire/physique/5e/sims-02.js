/* Chapitre 2 · Équilibre statique et première loi de Newton */
SFA.sim({
  id: "p5-c02-palet", ch: "c02", tag: "Inertie",
  titre: "Le palet sur la glace : sans frottement, pas de force nécessaire",
  resume: "Règle le frottement et regarde la vitesse du palet évoluer.",
  but: "Lance le palet à une vitesse initiale. Fais varier le coefficient de frottement μ : à μ = 0, que devient la vitesse ? Change la masse : change-t-elle l'accélération ?",
  aRetenir: "Sans résultante de forces, la vitesse reste constante (principe d'inertie) : un mouvement rectiligne uniforme n'a pas besoin de force. Avec frottement, a = −μ·g, indépendante de la masse.",
  piege: "« Si ça avance, il y a une force dans le sens du mouvement » est faux. C'est le frottement, une force opposée au mouvement, qui arrête le palet ; sans lui, il continue indéfiniment.",
  build: function(k, S){
    var c = k.canvas(190), gr = k.canvas(200);
    var mu = k.slider("Coefficient de frottement μ", 0, 0.3, 0.01, 0.05, "");
    var v0 = k.slider("Vitesse initiale", 1, 8, 0.5, 4, "m/s");
    var m = k.slider("Masse du palet", 0.2, 5, 0.1, 1, "kg");
    var sp = k.seg("Temps", [[1, "Réel"], [5, "×5"]], 5);
    var ro = k.readouts(["Temps écoulé", "Vitesse v", "Force de frottement", "Distance parcourue", "ΣF"]);
    var nt = k.note("", "");
    var T = 0, x = 0, v = 0, hist = [];
    function reset(){ T = 0; x = 0; v = v0.value; hist = [[0, v]]; lp.play(); }
    var lp = k.loop(function(dt){
      var h = dt * sp.value, a = -mu.value * P5.g, n = Math.max(1, Math.ceil(h / 0.01));
      for (var i = 0; i < n; i++){
        var d = h / n; if (v <= 0){ v = 0; break; }
        var vn = Math.max(0, v + a * d); x += (v + vn) / 2 * d; v = vn; T += d;
        if (T - hist[hist.length - 1][0] > 0.2) hist.push([T, v]);
      }
      if (v <= 0 && mu.value > 0) lp.pause();
      if (T > 60) lp.pause();
      k.redraw();
    });
    k.button("Lancer / relancer", reset, true);
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx;
      if (!hist.length){ v = v0.value; hist = [[0, v]]; }
      if (!lp.running){ if (T === 0) v = v0.value; }
      c.clear();
      ctx.fillStyle = "#e6f2fa"; ctx.fillRect(0, 60, c.W, c.H - 60);
      /* repères défilants tous les 1 m (échelle 40 px/m) */
      var off = (x * 40) % 40;
      for (var i = -1; i < c.W / 40 + 2; i++){
        var px = c.W * 0.3 + i * 40 - off; S.draw.line(c, px, 60, px, 66, pal.grey, 2);
      }
      S.draw.text(c, "repères tous les 1 m", c.W - 10, c.H - 10, {align: "right", size: 12, color: pal.grey});
      var cx = c.W * 0.3, cy = 52; ctx.fillStyle = "#13233a"; ctx.fillRect(cx - 22, cy - 14, 44, 14);
      var F = mu.value * m.value * P5.g;
      if (v > 0 && F > 0) P5.vec(c, cx, cy - 7, cx - Math.min(F * 8, 120) - 4, cy - 7, pal.red, "f", {dy: -14});
      if (v > 0) P5.vec(c, cx + 22, cy - 7, cx + 22 + v * 14, cy - 7, pal.acc, "v", {dy: -14});
      /* graphe v(t) */
      gr.clear();
      var tmax = 60, ax = S.draw.axes(gr, {x0: 0, x1: tmax, y0: 0, y1: 8.5, xl: "t (s)", yl: "v (m/s)", stepX: 10, stepY: 2});
      ctx = gr.ctx; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2.5; ctx.beginPath();
      hist.forEach(function(p, i){ if (i === 0) ctx.moveTo(ax.X(p[0]), ax.Y(p[1])); else ctx.lineTo(ax.X(p[0]), ax.Y(p[1])); });
      ctx.lineTo(ax.X(T), ax.Y(v)); ctx.stroke(); S.draw.dot(gr, ax.X(T), ax.Y(v), 5, pal.red);
      ro.set(0, S.fmt(T, 1) + " s"); ro.set(1, S.fmt(v, 2) + " m/s"); ro.set(2, S.fmt(F, 2) + " N"); ro.set(3, S.fmt(x, 1) + " m");
      ro.set(4, v > 0 ? S.fmt(-F, 2) + " N" : "0 N");
      if (mu.value === 0) nt.set("μ = 0 : ΣF = 0 et la vitesse reste " + S.fmt(v0.value, 1) + " m/s. Le palet continue tout seul, sans aucune force vers l'avant.", "ok");
      else nt.set("a = −μ·g = " + S.fmt(-mu.value * P5.g, 2) + " m/s² ; arrêt après " + S.fmt(v0.value / (mu.value * P5.g), 1) + " s et " + S.fmt(v0.value * v0.value / (2 * mu.value * P5.g), 1) + " m. La masse n'intervient pas dans a.", "");
    });
  }
});

SFA.sim({
  id: "p5-c02-poutre", ch: "c02", tag: "Moments",
  titre: "La bascule : équilibre de rotation",
  resume: "Positions et masses → moments, et la poutre bascule ou reste en équilibre.",
  but: "Place deux masses sur une poutre légère (sa masse est négligée) posée sur un pivot. Trouve les positions pour lesquelles la poutre reste horizontale, puis déplace le pivot.",
  aRetenir: "Équilibre d'un solide : ΣF = 0 (le support compense le poids total) ET Σ des moments = 0. Moment = force × bras de levier : M = F·d.",
  piege: "L'équilibre ne dépend pas seulement des masses mais aussi des distances au pivot : une petite masse loin du pivot équilibre une grande masse proche.",
  build: function(k, S){
    var c = k.canvas(300);
    var m1 = k.slider("Masse 1 (bleue)", 1, 20, 1, 6, "kg");
    var x1 = k.slider("Position de la masse 1", 0, 10, 0.1, 2, "m");
    var m2 = k.slider("Masse 2 (rouge)", 1, 20, 1, 3, "kg");
    var x2 = k.slider("Position de la masse 2", 0, 10, 0.1, 8, "m");
    var xp = k.slider("Position du pivot", 2, 8, 0.1, 5, "m");
    var ro = k.readouts(["Moment gauche (↺)", "Moment droit (↻)", "Σ moments", "Force du pivot"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var pal = S.draw.palette, ctx = c.ctx, g = P5.g;
      var mo1 = m1.value * g * (x1.value - xp.value), mo2 = m2.value * g * (x2.value - xp.value);   /* >0 : horaire */
      var net = mo1 + mo2, balanced = Math.abs(net) < 0.05;
      var tilt = balanced ? 0 : 0.22 * Math.tanh(net / 60);
      var L = c.W - 80, ux = 40, px = ux + xp.value / 10 * L, py = c.H - 90;
      /* pivot */
      ctx.fillStyle = "#8a95a3"; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 24, py + 60); ctx.lineTo(px + 24, py + 60); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.translate(px, py); ctx.rotate(tilt);
      ctx.fillStyle = "#d7dde6"; ctx.fillRect(ux - px, -6, L, 12); ctx.strokeStyle = "#6b7685"; ctx.strokeRect(ux - px, -6, L, 12);
      function mass(xm, mm, col, lab){
        var X = ux + xm / 10 * L - px, w = 18 + mm * 1.2;
        ctx.fillStyle = col; ctx.fillRect(X - w / 2, -6 - w, w, w);
        ctx.fillStyle = "#fff"; ctx.font = "700 12px Mulish, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(mm + "", X, -6 - w / 2);
      }
      mass(x1.value, m1.value, pal.acc); mass(x2.value, m2.value, pal.red);
      ctx.restore();
      /* règle graduée */
      for (var i = 0; i <= 10; i++){ var gx = ux + i / 10 * L; S.draw.line(c, gx, c.H - 22, gx, c.H - 16, pal.grey, 1.5); S.draw.text(c, i + "", gx, c.H - 8, {size: 12, color: pal.grey}); }
      S.draw.text(c, "position (m)", c.W - 10, c.H - 28, {align: "right", size: 12, color: pal.grey});
      var N = (m1.value + m2.value) * g;
      ro.set(0, S.fmt(Math.abs(Math.min(mo1, 0)) + Math.abs(Math.min(mo2, 0)), 1) + " N·m");
      ro.set(1, S.fmt(Math.max(mo1, 0) + Math.max(mo2, 0), 1) + " N·m");
      ro.set(2, S.fmt(net, 1) + " N·m"); ro.set(3, S.fmt(N, 1) + " N");
      if (balanced) nt.set("Équilibre : les moments se compensent (Σ ≈ 0) et le pivot porte (m₁ + m₂)·g = " + S.fmt(N, 1) + " N.", "ok");
      else nt.set("La poutre bascule vers le " + (net > 0 ? "côté droit (sens horaire)" : "côté gauche (sens anti-horaire)") + " : les moments ne se compensent pas (Σ = " + S.fmt(net, 1) + " N·m). Même si ΣF = 0, elle tourne.", "warn");
    });
  }
});

SFA.sim({
  id: "p5-c02-train", ch: "c02", tag: "Référentiels",
  titre: "Le pendule dans un train qui accélère",
  resume: "Accélération du train → inclinaison du fil.",
  but: "Fais accélérer ou freiner le train. Observe l'angle du fil, puis change la masse : l'angle change-t-il ? Relève le défi pour retrouver l'accélération à partir de l'angle.",
  aRetenir: "Vu du quai (référentiel galiléen), la boule accélère avec le train : T + P = m·a, d'où tan θ = a/g. L'angle ne dépend pas de la masse. La tension vaut T = m·√(g² + a²).",
  piege: "Dans le train, on dit « une force pousse la boule vers l'arrière » : c'est une force d'inertie, apparente, qui n'existe que dans un référentiel qui accélère. Dans un référentiel galiléen, aucune force ne pousse vers l'arrière.",
  build: function(k, S){
    var c = k.canvas(280);
    var a = k.slider("Accélération du train (+ : accélère, − : freine)", -6, 6, 0.1, 2, "m/s²");
    var m = k.slider("Masse de la boule", 0.1, 2, 0.1, 0.5, "kg");
    var seg = k.seg("Vue", [["quai", "Vue du quai"], ["train", "Vue du train"]], "quai");
    var ro = k.readouts(["Angle avec la verticale", "Tangente de l'angle (= a/g)", "Tension du fil", "Poids de la boule", "ΣF = m·a"]);
    var tg = [8, 18, 25], di = 0, nt = k.note("", "");
    k.button("Nouveau défi", function(){ di = (di + 1) % tg.length; });
    k.draw(function(){
      c.clear();
      var pal = S.draw.palette, ctx = c.ctx, g = P5.g, A = a.value, th = Math.atan(A / g);   /* th > 0 : fil incliné vers l'arrière */
      var cx = c.W / 2, top = 70, wx = 150, wy = 100;
      /* wagon */
      ctx.fillStyle = "#eef3fa"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.fillRect(cx - 210, 40, 420, 190); ctx.strokeRect(cx - 210, 40, 420, 190);
      S.draw.dot(c, cx - 150, 238, 12, pal.ink); S.draw.dot(c, cx + 150, 238, 12, pal.ink);
      S.draw.text(c, "sens de marche →", cx + 200, 28, {align: "right", size: 12, color: pal.grey});
      /* pendule */
      var len = 130, bx = cx - Math.sin(th) * len, by = top + Math.cos(th) * len;
      S.draw.line(c, cx, top, cx, top + len + 10, "#aab4c3", 1.5, [4, 4]);
      S.draw.line(c, cx, top, bx, by, pal.ink, 2.5);
      S.draw.dot(c, cx, top, 4, pal.ink); S.draw.dot(c, bx, by, 14, pal.amber);
      var sc = 40 / g * 1.0;   /* 1 N par kg -> px */
      var P = m.value * g, T = m.value * Math.sqrt(g * g + A * A), s = 70 / P;
      P5.vec(c, bx, by, bx, by + P * s, pal.ink, "P", {dx: 12});
      var Tx = -Math.sin(th) * -1;   /* direction vers le point d'attache : (cx-bx, top-by) */
      var dxu = (cx - bx) / len, dyu = (top - by) / len;
      P5.vec(c, bx, by, bx + dxu * T * s, by + dyu * T * s, pal.red, "T", {dx: -12});
      if (seg.value === "quai"){
        P5.vec(c, bx, by, bx + m.value * A * s, by, pal.green, "m·a", {dy: 18});
        S.draw.text(c, "Vue du quai : T + P = m·a (somme vers l'avant)", cx, 252, {size: 12, color: pal.green});
      } else {
        P5.vec(c, bx, by, bx - m.value * A * s, by, pal.violet, "−m·a (inertie)", {dy: 18, dx: -20});
        S.draw.text(c, "Vue du train : la boule est immobile, T + P + (−m·a) = 0", cx, 252, {size: 12, color: pal.violet});
      }
      if (A !== 0) P5.vec(c, cx - 190, 60, cx - 190 + A * 12, 60, pal.green, "", {w: 3});
      S.draw.text(c, "a", cx - 190, 76, {size: 12, color: pal.green});
      var deg = th * 180 / Math.PI;
      ro.set(0, S.fmt(Math.abs(deg), 1) + " °" + (A > 0 ? " vers l'arrière" : A < 0 ? " vers l'avant" : "")); ro.set(1, S.fmt(Math.abs(A / g), 3));
      ro.set(2, S.fmt(T, 2) + " N"); ro.set(3, S.fmt(P, 2) + " N"); ro.set(4, S.fmt(m.value * A, 2) + " N");
      var d = Math.abs(deg), ok = Math.abs(d - tg[di]) < 0.6;
      nt.set("<b>Défi " + (di + 1) + "/3.</b> Règle l'accélération pour que le fil fasse " + tg[di] + " ° avec la verticale. " + (ok ? "Réussi : a = g·tan θ = " + S.fmt(g * Math.tan(tg[di] * Math.PI / 180), 2) + " m/s² (calcule-le).": "Pas encore."), ok ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "p5-c02-nappe", ch: "c02", tag: "Niche utile",
  titre: "Le tour de la nappe : inertie en action",
  resume: "Plus on tire fort et vite, plus le verre reste en place.",
  but: "Tire la nappe sous le verre avec une accélération réglable. Trouve à partir de quelle accélération le verre ne tombe pas de la table. Que se passe-t-il quand on tire doucement ?",
  aRetenir: "Le verre n'est entraîné que par le frottement, une force limitée (μ·m·g) qui agit pendant très peu de temps si on tire vite. Son déplacement diminue quand A augmente : D = μ₁·g·d·(1 + μ₁/μ₂) / (A − μ₁·g).",
  piege: "Ce n'est pas « il n'y a pas de force sur le verre » : il y a du frottement. L'inertie signifie qu'une force brève ne change presque pas la vitesse d'un objet.",
  build: function(k, S){
    var c = k.canvas(270);
    var A = k.slider("Accélération de la nappe A", 1, 200, 1, 5, "m/s²");
    var mu1 = k.slider("Frottement verre/nappe μ₁", 0.1, 0.8, 0.05, 0.4, "");
    var ro = k.readouts(["Distance verre - bord de la nappe", "Résultat", "Accélération maximale due au frottement", "Déplacement D (formule)"]);
    var nt = k.note("", "");
    var MU2 = 0.3, d0 = 0.20, w0 = 0.35, g = P5.g;
    var fr = null, tp = 0, scale = 1;
    function run(){
      var a1 = A.value, m1 = mu1.value, xe = 0, ve = 0, xg = d0, vg = 0, t = 0, dt = 0.001, out = [], fall = 0, yg = 0, vy = 0, edge = d0 + w0;
      var guard = 0;
      while (guard++ < 40000){
        var slip = a1 > m1 * g, under = xe < xg;
        var ag;
        if (fall) ag = 0; else if (under) ag = slip ? m1 * g : a1; else ag = vg > 0 ? -MU2 * g : 0;
        if (!fall){ vg = Math.max(0, vg + ag * dt); if (!under && vg === 0) { out.push([t, xe, xg, yg]); break; } xg += vg * dt; }
        ve += a1 * dt; xe += ve * dt; t += dt;
        if (xg > edge && !fall) fall = 1;
        if (fall){ vy += g * dt; yg += vy * dt; xg += vg * dt; if (yg > 0.5) { out.push([t, xe, xg, yg]); break; } }
        if (guard % 20 === 0) out.push([t, xe, xg, yg]);
      }
      fr = {frames: out, fell: !!fall, shift: xg - d0};
      tp = 0; scale = Math.max(1, out[out.length - 1][0] / 4);   /* ralenti ×scale (durée visible ≈ 4 s) */
      lp.play();
    }
    var lp = k.loop(function(dt){
      tp += dt * (1 / scale); k.redraw();
      if (tp > fr.frames[fr.frames.length - 1][0] + 0.8) lp.pause();
    });
    /* on interprète scale comme ralenti : temps simulé = temps réel / ralenti */
    k.button("Tirer la nappe !", run, true);
    function frameAt(t){
      var F = fr.frames; if (!F.length) return [0, 0, d0, 0];
      var i = 0; while (i < F.length - 1 && F[i][0] < t) i++;
      return F[i];
    }
    k.draw(function(){
      c.clear();
      var pal = S.draw.palette, ctx = c.ctx, g = P5.g, a1 = A.value, m1 = mu1.value;
      var X = function(x){ return 20 + x / 0.8 * (c.W - 40); }, ty = 150;
      var st = fr ? frameAt(tp) : [0, 0, d0, 0];
      var xe = st[1], xg = st[2], yg = st[3];
      /* table */
      ctx.fillStyle = "#c9a77c"; ctx.fillRect(X(0), ty, X(d0 + w0) - X(0), 14);
      ctx.fillStyle = "#a98b63"; ctx.fillRect(X(d0 + w0) - 12, ty + 14, 12, 70);
      /* nappe */
      ctx.fillStyle = "#e9a1a1"; ctx.fillRect(Math.max(X(xe), X(0)), ty - 5, Math.max(0, X(1.0) - Math.max(X(xe), X(0))), 5);
      /* verre */
      var surf = (xg > 0 && xe < xg) ? ty - 5 : ty;
      var gy = surf - 34 + yg * 120;
      ctx.fillStyle = "rgba(100,160,220,.55)"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.fillRect(X(xg) - 12, gy, 24, 34); ctx.strokeRect(X(xg) - 12, gy, 24, 34);
      S.draw.text(c, "bord de la table", X(d0 + w0), ty + 92, {size: 12, color: pal.grey});
      S.draw.line(c, X(d0 + w0), ty - 40, X(d0 + w0), ty + 14, pal.grey, 1.5, [4, 4]);
      S.draw.text(c, "nappe →", X(Math.min(xe + 0.25, 0.9)), ty - 30, {size: 12, color: "#a94a4a"});
      if (fr && fr.fell && yg > 0.02) S.draw.text(c, "Le verre tombe !", c.W / 2, 30, {color: pal.red, size: 16});
      else if (fr && tp >= fr.frames[fr.frames.length - 1][0]) S.draw.text(c, "Le verre reste sur la table", c.W / 2, 30, {color: pal.green, size: 16});
      var slip = a1 > m1 * g, D = slip ? m1 * g * d0 * (1 + m1 / MU2) / (a1 - m1 * g) : Infinity;
      ro.set(0, S.fmt(d0 * 100, 0) + " cm"); ro.set(2, S.fmt(m1 * g, 2) + " m/s²");
      ro.set(1, fr ? (fr.fell ? "tombe" : "reste") : "—");
      ro.set(3, slip ? S.fmt(D * 100, 1) + " cm (marge : " + S.fmt(w0 * 100, 0) + " cm)" : "la nappe l'entraîne");
      if (!slip) nt.set("A ≤ μ₁·g = " + S.fmt(m1 * g, 2) + " m/s² : le frottement suffit à entraîner le verre avec la nappe, sans glissement : il tombe.", "warn");
      else nt.set(D > w0 ? "Prévision : D = " + S.fmt(D * 100, 1) + " cm dépasse la marge de " + S.fmt(w0 * 100, 0) + " cm : le verre ira au bord et tombera." : "Prévision : D = " + S.fmt(D * 100, 1) + " cm est inférieur à la marge de " + S.fmt(w0 * 100, 0) + " cm : le verre s'arrête sur la table.", D > w0 ? "warn" : "ok");
      S.draw.text(c, fr ? "Ralenti ×" + S.fmt(scale, 1) : "Appuie sur « Tirer la nappe ! »", 12, c.H - 14, {align: "left", size: 12, color: pal.grey});
    });
  }
});
