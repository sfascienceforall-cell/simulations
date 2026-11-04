/* Chapitre 10 · Électrocinétique : lois de Kirchhoff et générateurs */
SFA.sim({
  id: "p5-c10-deux-mailles", ch: "c10", tag: "Classique",
  titre: "Circuit à deux mailles : lois des nœuds et des mailles",
  resume: "Deux générateurs, trois résistances → intensités calculées avec Kirchhoff.",
  but: "Règle les deux générateurs et les trois résistances. Observe les intensités I₁, I₂, I₃ et vérifie la loi des nœuds et celle des mailles. Défi : trouve des réglages pour lesquels I₂ = 0.",
  aRetenir: "Nœud : I₃ = I₁ + I₂ (ce qui entre = ce qui sort). Mailles (sens de parcours choisi) : E₁ − R₁·I₁ − R₃·I₃ = 0 et E₂ − R₂·I₂ − R₃·I₃ = 0. Un courant trouvé négatif signifie simplement que son sens réel est opposé au sens choisi (le générateur est alors récepteur).",
  piege: "La pile n'impose pas toujours son courant : il dépend du reste du circuit. Et oublier les signes dans la loi des mailles est l'erreur la plus fréquente : un élément parcouru dans le sens du courant (R·I) ou contre la f.é.m. compte négativement.",
  build: function(k, S){
    var c = k.canvas(260);
    var e1 = k.slider("f.é.m. E₁ (à gauche)", 0, 12, 0.5, 9, "V");
    var e2 = k.slider("f.é.m. E₂ (à droite)", 0, 12, 0.1, 6, "V");
    var r1 = k.slider("R₁", 1, 100, 1, 10, "Ω"), r2 = k.slider("R₂", 1, 100, 1, 20, "Ω"), r3 = k.slider("R₃ (au milieu)", 1, 100, 1, 30, "Ω");
    var ro = k.readouts(["I₁ (à travers E₁)", "I₂ (à travers E₂)", "I₃ = I₁ + I₂", "U₃ = R₃·I₃"]);
    var nt = k.note("", ""), eq = k.note("", "");
    function solve(){
      var D = r1.value * r2.value + r1.value * r3.value + r2.value * r3.value;
      var I1 = (e1.value * (r2.value + r3.value) - r3.value * e2.value) / D, I2 = (e2.value * (r1.value + r3.value) - r3.value * e1.value) / D;
      return {I1: I1, I2: I2, I3: I1 + I2, D: D};
    }
    k.draw(function(){
      c.clear(); var pal = S.draw.palette, ctx = c.ctx, s = solve();
      var L = 60, M = c.W / 2, Rr = c.W - 60, T = 40, B = c.H - 40;
      ctx.strokeStyle = "#566176"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(Rr, T); ctx.moveTo(L, B); ctx.lineTo(Rr, B); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.moveTo(M, T); ctx.lineTo(M, B); ctx.moveTo(Rr, T); ctx.lineTo(Rr, B); ctx.stroke();
      function res(x, y, lab){ ctx.fillStyle = "#fff"; ctx.strokeStyle = "#566176"; ctx.lineWidth = 2.5; ctx.fillRect(x - 10, y - 20, 20, 40); ctx.strokeRect(x - 10, y - 20, 20, 40); S.draw.text(c, lab, x + (lab === "R₂" ? -26 : 26), y, {size: 13}); }
      function bat(x, y, lab, v, left){ ctx.fillStyle = "#fff"; ctx.fillRect(x - 14, y - 8, 28, 16); S.draw.line(c, x - 14, y - 4, x + 14, y - 4, pal.red, 4); S.draw.line(c, x - 7, y + 5, x + 7, y + 5, pal.acc, 4); S.draw.text(c, lab + " = " + S.fmt(v, 1) + " V", left ? x - 22 : x + 22, y - 4, {size: 12, align: left ? "right" : "left"}); S.draw.text(c, "+", left ? x + 22 : x - 22, y - 6, {size: 13, color: pal.red}); }
      bat(L, T + 55, "E₁", e1.value); res(L, B - 55, "R₁");
      res(M, (T + B) / 2, "R₃");
      bat(Rr, T + 55, "E₂", e2.value, true); res(Rr, B - 55, "R₂");
      function cur(x, y, I, lab, up){ var d = (I >= 0 ? 1 : -1) * (up ? -1 : 1), L2 = 14 + Math.min(Math.abs(I) * 40, 30); P5.vec(c, x, y - d * L2 / 2, x, y + d * L2 / 2, pal.green, lab, {w: 2.6, dx: -14, dy: 0}); }
      cur(L, (T + B) / 2, s.I1, "I₁", true); cur(Rr, (T + B) / 2, s.I2, "I₂", true); cur(M, T + 30, s.I3, "I₃", false);
      S.draw.text(c, "sens positif : I₁ et I₂ montent, I₃ descend", c.W / 2, c.H - 10, {size: 12, color: pal.grey});
      ro.set(0, S.fmt(s.I1, 3) + " A"); ro.set(1, S.fmt(s.I2, 3) + " A"); ro.set(2, S.fmt(s.I3, 3) + " A"); ro.set(3, S.fmt(r3.value * s.I3, 2) + " V");
      var m1 = e1.value - r1.value * s.I1 - r3.value * s.I3, m2 = e2.value - r2.value * s.I2 - r3.value * s.I3;
      eq.set("Nœud : " + S.fmt(s.I1, 3) + " + " + S.fmt(s.I2, 3) + " = " + S.fmt(s.I3, 3) + " A.<br>Maille 1 : " + S.fmt(e1.value, 1) + " − " + S.fmt(r1.value, 0) + " × " + S.fmt(s.I1, 3) + " − " + S.fmt(r3.value, 0) + " × " + S.fmt(s.I3, 3) + " = " + S.fmt(Math.abs(m1) < 1e-9 ? 0 : m1, 3) + " V ✓<br>Maille 2 : " + S.fmt(e2.value, 1) + " − " + S.fmt(r2.value, 0) + " × " + S.fmt(s.I2, 3) + " − " + S.fmt(r3.value, 0) + " × " + S.fmt(s.I3, 3) + " = " + S.fmt(Math.abs(m2) < 1e-9 ? 0 : m2, 3) + " V ✓", "");
      var ok = Math.abs(s.I2) < 0.01;
      nt.set(ok ? "Défi réussi : I₂ ≈ 0. Le générateur 2 ne débite rien : sa f.é.m. est exactement la tension U₃ = R₃·I₃ = " + S.fmt(r3.value * s.I3, 2) + " V." : (s.I1 < 0 ? "I₁ < 0 : le générateur 1 est traversé en sens inverse (il se recharge)." : s.I2 < 0 ? "I₂ < 0 : le générateur 2 est traversé en sens inverse (il se recharge)." : "Défi : règle E₂, R₁, R₂ ou R₃ pour obtenir I₂ = 0."), ok ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "p5-c10-pile", ch: "c10", tag: "Générateur réel",
  titre: "La pile réelle : f.é.m., résistance interne, tension en charge",
  resume: "Résistance de charge → tension aux bornes, rendement et puissance.",
  but: "Une pile réelle (E, r) alimente une résistance R. Fais varier R : que devient la tension aux bornes ? Trouve la valeur de R qui donne la plus grande puissance dans la charge, et le rendement correspondant.",
  aRetenir: "U = E − r·I : la tension aux bornes baisse quand le courant augmente. I = E/(R + r), rendement η = R/(R + r). La puissance transmise à la charge P = U·I est maximale pour R = r, mais le rendement n'est alors que de 50 %.",
  piege: "La « tension de la pile » (E) n'est mesurée que à vide. En charge, U < E. Et la puissance maximale n'est pas le meilleur rendement : pour un bon rendement, il faut R ≫ r.",
  build: function(k, S){
    var c = k.canvas(190), gr = k.canvas(190);
    var E = k.slider("f.é.m. E", 1.5, 12, 0.5, 9, "V");
    var r = k.slider("Résistance interne r", 0.1, 5, 0.1, 2, "Ω");
    var R = k.slider("Résistance de charge R", 0.1, 50, 0.1, 6, "Ω");
    var ro = k.readouts(["Courant I = E/(R + r)", "Tension U = E − r·I", "Puissance dans R", "Rendement", "Court-circuit E/r"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear(); gr.clear(); var pal = S.draw.palette;
      var Ic = E.value / r.value, I = E.value / (R.value + r.value), U = E.value - r.value * I, P = U * I, eta = R.value / (R.value + r.value);
      var ax = S.draw.axes(c, {x0: 0, x1: Ic, y0: 0, y1: E.value * 1.1, xl: "I (A)", yl: "U (V)", l: 46});
      S.draw.line(c, ax.X(0), ax.Y(E.value), ax.X(Ic), ax.Y(0), pal.acc, 2.6);
      S.draw.line(c, ax.X(0), ax.Y(0), ax.X(Math.min(Ic, E.value * 1.1 / R.value)), ax.Y(Math.min(E.value * 1.1, Ic * R.value)), pal.red, 2, [6, 4]);
      S.draw.dot(c, ax.X(I), ax.Y(U), 7, pal.green);
      S.draw.text(c, "trait bleu : U = E − r·I", ax.X(Ic * 0.98), ax.Y(E.value * 0.42), {size: 12, color: pal.acc, align: "right"}); S.draw.text(c, "pointillés rouges : droite de charge U = R·I", ax.X(Ic * 0.98), ax.Y(E.value * 0.25), {size: 12, color: pal.red, align: "right"});
      /* P(R) et η(R) */
      var Pm = E.value * E.value / (4 * r.value), ax2 = S.draw.axes(gr, {x0: 0, x1: 50, y0: 0, y1: Pm * 1.1, xl: "R (Ω)", yl: "P (W)", l: 50, stepX: 10});
      S.draw.fn(gr, ax2, function(x){ var i = E.value / (x + r.value); return i * i * x; }, pal.red);
      S.draw.dot(gr, ax2.X(R.value), ax2.Y(P), 6, pal.green);
      S.draw.line(gr, ax2.X(r.value), ax2.Y(0), ax2.X(r.value), ax2.Y(Pm), pal.grey, 1.2, [4, 4]); S.draw.text(gr, "R = r", ax2.X(r.value) + 6, ax2.Y(Pm) + 8, {align: "left", size: 12, color: pal.grey});
      var g = gr.ctx; g.strokeStyle = pal.amber; g.lineWidth = 2; g.setLineDash([5, 4]); g.beginPath();
      for (var i = 0; i <= 100; i++){ var x = 50 * i / 100, ee = x / (x + r.value); if (i === 0) g.moveTo(ax2.X(x), ax2.Y(ee * Pm * 1.1)); else g.lineTo(ax2.X(x), ax2.Y(ee * Pm * 1.1)); } g.stroke(); g.setLineDash([]);
      S.draw.text(gr, "pointillés orange : rendement (échelle 0 → 100 %)", gr.W - 10, 14, {align: "right", size: 12, color: pal.amber});
      ro.set(0, S.fmt(I, 3) + " A"); ro.set(1, S.fmt(U, 2) + " V"); ro.set(2, S.fmt(P, 2) + " W"); ro.set(3, S.fmt(100 * eta, 0) + " %"); ro.set(4, S.fmt(Ic, 1) + " A");
      var nearMax = Math.abs(R.value - r.value) < 0.15 * r.value + 0.05;
      nt.set(nearMax ? "R ≈ r : puissance maximale " + S.fmt(Pm, 2) + " W, mais rendement de 50 % seulement (autant de puissance perdue dans la pile)." : (R.value < r.value ? "R < r : forte intensité, la pile chauffe, la tension s'effondre (U = " + S.fmt(U, 2) + " V)." : "R > r : U est plus proche de E, le rendement monte (" + S.fmt(100 * eta, 0) + " %), mais la puissance utile baisse."), nearMax ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "p5-c10-diviseur", ch: "c10", tag: "Diviseur de tension",
  titre: "Le pont diviseur de tension (potentiomètre) et l'effet de la charge",
  resume: "Position du curseur → tension de sortie, avec et sans charge.",
  but: "Un potentiomètre de résistance totale R<sub>tot</sub> est alimenté sous U<sub>e</sub>. Déplace le curseur et lis la tension de sortie. Branche ensuite une charge R<sub>ch</sub> : la tension de sortie change-t-elle ? Quelle règle de choix pour R<sub>ch</sub> ?",
  aRetenir: "Sans charge : U<sub>s</sub> = U<sub>e</sub>·R₂/(R₁ + R₂) : la tension se partage proportionnellement aux résistances. Avec une charge R<sub>ch</sub> en parallèle avec R₂, R₂ est remplacée par R₂·R<sub>ch</sub>/(R₂ + R<sub>ch</sub>) et U<sub>s</sub> baisse. Règle : R<sub>ch</sub> ≥ 10·R₂ pour que l'erreur reste inférieure à environ 10 %.",
  piege: "Le diviseur ne « fixe » la tension de sortie que si rien ne la charge : brancher un appareil de faible résistance fait chuter U<sub>s</sub>. C'est aussi pourquoi un voltmètre doit avoir une résistance très grande.",
  build: function(k, S){
    var c = k.canvas(190), gr = k.canvas(190);
    var ue = k.slider("Tension d'entrée U<sub>e</sub>", 1, 12, 0.5, 9, "V");
    var rt = k.slider("Résistance totale R<sub>tot</sub>", 1, 100, 1, 10, "kΩ");
    var al = k.slider("Position du curseur (fraction de R<sub>tot</sub> en bas)", 0, 1, 0.01, 0.5, "");
    var ld = k.toggle("Brancher une charge", true);
    var rc = k.slider("Résistance de charge R<sub>ch</sub>", 1, 100, 1, 10, "kΩ");
    var ro = k.readouts(["R₁ (haut)", "R₂ (bas)", "U_s sans charge", "U_s avec charge", "Écart"]);
    var nt = k.note("", "");
    function us(a, withLoad){ var R2 = a * rt.value, R1 = (1 - a) * rt.value; if (withLoad && R2 > 0) R2 = R2 * rc.value / (R2 + rc.value); if (R1 + R2 === 0) return 0; return ue.value * R2 / (R1 + R2); }
    k.draw(function(){
      c.clear(); gr.clear(); var pal = S.draw.palette, ctx = c.ctx, a = al.value, R1 = (1 - a) * rt.value, R2 = a * rt.value;
      var x0 = 60, x1 = c.W * 0.55, T = 30, B = c.H - 30, mid = T + (B - T) * (1 - 0.5);
      ctx.strokeStyle = "#566176"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, T); ctx.lineTo(x1, T); ctx.moveTo(x0, B); ctx.lineTo(x1, B); ctx.moveTo(x1, T); ctx.lineTo(x1, B); ctx.stroke();
      S.draw.line(c, x0, T, x0, B, "#566176", 2.5);
      var yc = T + (B - T) * (1 - a);   /* curseur : a = fraction du bas */
      ctx.fillStyle = "#fff"; ctx.fillRect(x1 - 12, T + 18, 24, B - T - 36); ctx.strokeStyle = "#566176"; ctx.strokeRect(x1 - 12, T + 18, 24, B - T - 36);
      var ycc = T + 18 + (B - T - 36) * (1 - a); S.draw.line(c, x1 + 12, ycc, x1 + 36, ycc, pal.red, 3); S.draw.text(c, "curseur", x1 + 46, ycc, {size: 12, align: "left", color: pal.red});
      S.draw.text(c, "R₁ = " + S.fmt(R1, 1) + " kΩ", x1 + 18, (T + ycc) / 2 - 2, {size: 12, align: "left"}); S.draw.text(c, "R₂ = " + S.fmt(R2, 1) + " kΩ", x1 + 18, (B + ycc) / 2 + 2, {size: 12, align: "left"});
      S.draw.text(c, "Ue = " + S.fmt(ue.value, 1) + " V", x0 - 8, (T + B) / 2, {size: 12, align: "right"});
      S.draw.line(c, x1 + 36, ycc, c.W - 40, ycc, pal.red, 2);
      var Us0 = us(a, false), Us1 = us(a, true);
      S.draw.text(c, "Us = " + S.fmt(ld.value ? Us1 : Us0, 2) + " V", c.W - 14, ycc - 14, {size: 14, align: "right", color: pal.red});
      if (ld.value){ ctx.fillStyle = "#fff"; ctx.strokeStyle = "#566176"; ctx.fillRect(c.W - 52, ycc + 8, 22, 36); ctx.strokeRect(c.W - 52, ycc + 8, 22, 36); S.draw.text(c, "R_ch", c.W - 41, ycc + 56, {size: 12}); }
      /* graphe Us(a) */
      var ax = S.draw.axes(gr, {x0: 0, x1: 1, y0: 0, y1: ue.value * 1.05, xl: "position du curseur", yl: "Us (V)", l: 46, stepX: 0.25});
      S.draw.fn(gr, ax, function(x){ return us(x, false); }, pal.grey, 2, [5, 4]);
      if (ld.value) S.draw.fn(gr, ax, function(x){ return us(x, true); }, pal.red);
      S.draw.dot(gr, ax.X(a), ax.Y(ld.value ? Us1 : Us0), 6, pal.green);
      S.draw.text(gr, "pointillés : sans charge", ax.X(0.12), ax.Y(ue.value * 0.95), {align: "left", size: 12, color: pal.grey});
      ro.set(0, S.fmt(R1, 1) + " kΩ"); ro.set(1, S.fmt(R2, 1) + " kΩ"); ro.set(2, S.fmt(Us0, 2) + " V"); ro.set(3, ld.value ? S.fmt(Us1, 2) + " V" : "—"); ro.set(4, ld.value && Us0 > 0 ? S.fmt(100 * (Us0 - Us1) / Us0, 0) + " %" : "—");
      nt.set(ld.value ? (R2 > 0 && rc.value >= 10 * R2 ? "R_ch ≥ 10·R₂ : l'erreur reste faible (" + S.fmt(100 * (Us0 - Us1) / Math.max(Us0, 1e-9), 0) + " %)." : "R_ch est comparable à R₂ : la charge « mange » une grande partie de la tension (écart " + S.fmt(100 * (Us0 - Us1) / Math.max(Us0, 1e-9), 0) + " %).") : "Sans charge : U_s = U_e·R₂/(R₁ + R₂) = " + S.fmt(Us0, 2) + " V, proportionnelle à la position du curseur.", ld.value && R2 > 0 && rc.value < 10 * R2 ? "warn" : "");
    });
  }
});

SFA.sim({
  id: "p5-c10-wheatstone", ch: "c10", tag: "Défi",
  titre: "Le pont de Wheatstone : mesurer une résistance inconnue",
  resume: "Règle la résistance variable jusqu'à l'équilibre du pont, puis calcule R<sub>x</sub>.",
  but: "Une résistance inconnue R<sub>x</sub> est placée dans un pont. Règle la résistance variable R<sub>v</sub> jusqu'à ce que la tension du pont soit nulle (galvanomètre au zéro). Calcule alors R<sub>x</sub> = R₁·R<sub>v</sub>/R₂, puis vérifie avec « Révéler ».",
  aRetenir: "Deux diviseurs de tension en parallèle. Le pont est équilibré (U<sub>AB</sub> = 0, aucun courant dans le galvanomètre) lorsque R₁/R₂ = R<sub>x</sub>/R<sub>v</sub>, donc R<sub>x</sub> = R₁·R<sub>v</sub>/R₂. L'équilibre ne dépend pas de la tension d'alimentation.",
  piege: "À l'équilibre, c'est la tension (et donc le courant) dans le galvanomètre qui est nulle, pas les courants dans les branches. Et la formule R<sub>x</sub> = R₁·R<sub>v</sub>/R₂ suppose que R₁ est du même côté que R<sub>x</sub> (en haut), R₂ du même côté que R<sub>v</sub> (en bas).",
  build: function(k, S){
    var c = k.canvas(250), gr = k.canvas(170);
    var R2s = k.select("R₂ (R₁ = 1 000 Ω)", [[100, "100 Ω"], [1000, "1 000 Ω"], [10000, "10 000 Ω"]], 1000);
    var rv = k.slider("Résistance variable R<sub>v</sub>", 1, 5000, 1, 1500, "Ω");
    var inc = [470, 1200, 220, 3300], ii = 0, show = k.toggle("Révéler R_x", false);
    k.button("Nouvelle résistance inconnue", function(){ ii = (ii + 1) % inc.length; });
    var ro = k.readouts(["Tension du pont U_AB", "V_A", "V_B", "R_x calculée si équilibre"]);
    var nt = k.note("", ""), UE = 10, R1 = 1000;
    k.draw(function(){
      c.clear(); gr.clear(); var pal = S.draw.palette, ctx = c.ctx, Rx = inc[ii], R2 = parseFloat(R2s.value);
      var VA = UE * R2 / (R1 + R2), VB = UE * rv.value / (Rx + rv.value), dV = VA - VB;
      var cx = c.W / 2, cy = c.H / 2, dx = Math.min(c.W / 2 - 90, 150), dy = 85;
      var N = [cx, cy - dy], S2 = [cx, cy + dy], A = [cx - dx, cy], B = [cx + dx, cy];
      function res(p, q, lab){ var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, ang = Math.atan2(q[1] - p[1], q[0] - p[0]); S.draw.line(c, p[0], p[1], q[0], q[1], "#566176", 2.5); ctx.save(); ctx.translate(mx, my); ctx.rotate(ang); ctx.fillStyle = "#fff"; ctx.fillRect(-20, -8, 40, 16); ctx.strokeStyle = "#566176"; ctx.lineWidth = 2.5; ctx.strokeRect(-20, -8, 40, 16); ctx.restore(); S.draw.text(c, lab, mx + (lab[1] === "x" || lab[1] === "v" ? 24 : -24), my + (p[1] < q[1] ? -18 : 18) * (lab === "R₁" || lab === "Rx" ? 1 : -1) * 0 + (lab === "R₁" || lab === "Rx" ? -16 : 16), {size: 12}); }
      res(N, A, "R₁"); res(N, B, "Rx"); res(A, S2, "R₂"); res(B, S2, "Rv");
      S.draw.line(c, A[0], A[1], B[0], B[1], "#566176", 2); S.draw.dot(c, A[0], A[1], 5, pal.ink); S.draw.dot(c, B[0], B[1], 5, pal.ink);
      S.draw.text(c, "A", A[0] - 12, A[1], {size: 13}); S.draw.text(c, "B", B[0] + 12, B[1], {size: 13});
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy, 24, 0, 2 * Math.PI); ctx.fill(); ctx.strokeStyle = "#566176"; ctx.lineWidth = 2.5; ctx.stroke();
      var needle = P5.clamp(dV / 2, -1, 1) * 0.9; S.draw.line(c, cx, cy + 12, cx + Math.sin(needle) * 20 * 1.0 * 3 / 3 * 1, cy + 12 - Math.cos(needle) * 22, pal.red, 2.5); S.draw.text(c, "G", cx, cy - 8, {size: 12});
      S.draw.text(c, "+" + S.fmt(UE, 0) + " V", cx + 10, N[1] - 12, {align: "left", size: 12, color: pal.red}); S.draw.text(c, "0 V", cx + 10, S2[1] + 14, {align: "left", size: 12});
      S.draw.text(c, "R₁ = 1 000 Ω ; R₂ = " + S.fmt(R2, 0) + " Ω ; Rv = " + S.fmt(rv.value, 0) + " Ω" + (show.value ? " ; Rx = " + S.fmt(Rx, 0) + " Ω" : " ; Rx = ?"), c.W / 2, c.H - 10, {size: 12, color: pal.ink});
      /* graphe U_AB(Rv) */
      var ax = S.draw.axes(gr, {x0: 0, x1: 5000, y0: -UE * 0.6, y1: UE * 0.6, xl: "Rv (Ω)", yl: "U_AB (V)", l: 46, stepX: 1000});
      S.draw.fn(gr, ax, function(x){ return VA - UE * x / (Rx + x); }, pal.acc);
      S.draw.dot(gr, ax.X(rv.value), ax.Y(P5.clamp(dV, -UE * 0.6, UE * 0.6)), 6, Math.abs(dV) < 0.02 ? pal.green : pal.red);
      var bal = Math.abs(dV) < 0.02;
      ro.set(0, S.fmt(dV * 1000, 0) + " mV"); ro.set(1, S.fmt(VA, 3) + " V"); ro.set(2, S.fmt(VB, 3) + " V"); ro.set(3, S.fmt(R1 * rv.value / R2, 0) + " Ω");
      nt.set(bal ? "Pont équilibré : V_A = V_B. R_x = R₁·R_v/R₂ = 1000 × " + S.fmt(rv.value, 0) + "/" + S.fmt(R2, 0) + " = " + S.fmt(R1 * rv.value / R2, 0) + " Ω" + (show.value ? " (valeur réelle : " + S.fmt(Rx, 0) + " Ω)." : ". Clique sur « Révéler » pour comparer.") : "Tension du pont : " + S.fmt(dV * 1000, 0) + " mV : " + (dV > 0 ? "V_A > V_B, augmente R_v." : "V_A < V_B, diminue R_v.") + " Cherche U_AB = 0.", bal ? "ok" : "");
    });
  }
});
