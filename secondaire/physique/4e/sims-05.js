/* Physique 4e · chapitre 5 · Travail, puissance et rendement */
(function(){
var G = 9.8, D2R = Math.PI / 180;

SFA.sim({
  id:"p4-c05-valise", ch:"c05", tag:"Classique",
  titre:"Tirer une valise : le travail W = F·d·cos θ",
  resume:"Seule la partie de la force dans le sens du déplacement travaille.",
  but:"Règle la force, la distance et l'angle de la poignée. Lance l'animation : l'aire sous F·cos θ est le travail.",
  aRetenir:"Le travail d'une force constante est W = F·d·cos θ (joules). Dans le cas simple θ = 0° : W = F·d. Une force perpendiculaire au déplacement (θ = 90°) ne travaille pas. Sans déplacement, pas de travail.",
  piege:"« Plus je me fatigue, plus je travaille » : faux. Tenir une charge immobile fatigue les muscles, mais le travail physique de la force exercée sur la charge est nul (d = 0). Porter horizontalement : la force du bras est verticale, perpendiculaire au déplacement : W = 0.",
  build:function(k,S){
    var sc = k.canvas(160), g1 = k.canvas(220), st = {p:0.5};
    var F = k.slider("Force F exercée", 10, 200, 10, 100, "N");
    var d = k.slider("Distance parcourue d", 1, 20, 1, 10, "m");
    var th = k.slider("Angle θ (force / déplacement)", 0, 90, 5, 30, "°");
    var ro = k.readouts(["Composante utile F·cos θ", "Travail W", "Part de F « perdue »"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.p = Math.min(1, st.p + dt / 3); if (st.p >= 1) lp.pause(); k.redraw(); });
    k.button("▶ Déplacer la valise", function(){ st.p = 0; lp.play(); }, true);
    k.draw(function(){
      var P = SFA.draw.palette, f = F.value, D = d.value, a = th.value, Fx = a === 90 ? 0 : f * Math.cos(a * D2R), Fy = f * Math.sin(a * D2R);
      var W = Fx * D, done = Fx * D * st.p;
      sc.clear(); var gy = 120, x0 = 40, bx = x0 + st.p * (sc.W - 150);
      sc.ctx.fillStyle = "#e3e7ed"; sc.ctx.fillRect(0, gy, sc.W, 10);
      sc.ctx.fillStyle = P.acc; sc.ctx.fillRect(bx, gy - 30, 54, 30); sc.ctx.fillStyle = "#13233a"; [10, 44].forEach(function(q){ sc.ctx.beginPath(); sc.ctx.arc(bx + q, gy, 5, 0, 6.2832); sc.ctx.fill(); });
      var px = bx + 54, py = gy - 22, len = 20 + f * 0.45;
      SFA.draw.arrow(sc, px, py, px + len * Math.cos(a * D2R), py - len * Math.sin(a * D2R), P.red, 3);
      P4.label(sc, "F", px + len * Math.cos(a * D2R) + 12, py - len * Math.sin(a * D2R) - 6, P.red);
      if (a > 0 && a < 90){ S.draw.line(sc, px, py, px + len * Math.cos(a * D2R), py, P.green, 2, [4, 3]); }
      SFA.draw.arrow(sc, x0, 24, sc.W - 30, 24, "#8a95a3", 2); P4.label(sc, "déplacement d", sc.W / 2, 40, "#5f6b7a");
      g1.clear(); var ax = S.draw.axes(g1, {x0:0, x1:20, y0:0, y1:210, xl:"d (m)", yl:"force utile (N)", stepX:2, stepY:50});
      g1.ctx.fillStyle = "rgba(46,107,85,.25)"; g1.ctx.fillRect(ax.X(0), ax.Y(Fx), ax.X(D * st.p) - ax.X(0), ax.Y(0) - ax.Y(Fx));
      S.draw.line(g1, ax.X(0), ax.Y(f), ax.X(D), ax.Y(f), "#b8c0cc", 1.5, [4, 4]); P4.label(g1, "F", ax.X(D) + 10, ax.Y(f), "#8a95a3");
      S.draw.line(g1, ax.X(0), ax.Y(Fx), ax.X(D), ax.Y(Fx), P.green, 3); S.draw.line(g1, ax.X(D), ax.Y(0), ax.X(D), ax.Y(Fx), P.green, 1.5, [3, 3]);
      P4.label(g1, "aire = W = " + S.fmt(done, 0) + " J", ax.X(Math.max(D * 0.5, 4)), ax.Y(Fx / 2 + 12), P.green);
      ro.set(0, S.fmt(Fx, 1) + " N"); ro.set(1, S.fmt(W, 0) + " J"); ro.set(2, S.fmt(Fy, 1) + " N (verticale)");
      nt.set(a === 90 ? "θ = 90° : la force est perpendiculaire au déplacement, son travail est nul." : a === 0 ? "θ = 0° : toute la force sert à avancer, W = F·d = " + S.fmt(f * D, 0) + " J." : "Seule la composante F·cos θ = " + S.fmt(Fx, 1) + " N dans le sens du déplacement travaille. W = " + S.fmt(Fx, 1) + " N × " + D + " m = " + S.fmt(W, 0) + " J.", a === 90 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"p4-c05-plan-incline", ch:"c05", tag:"Machine simple",
  titre:"Plan incliné : moins de force, plus de distance",
  resume:"Monter une charge d'une même hauteur par une rampe douce ou raide : le travail ne change pas.",
  but:"Change l'angle de la rampe, la hauteur à atteindre et la masse. Compare la force à fournir et la longueur de la rampe.",
  aRetenir:"Sans frottement, il faut une force F = m·g·sin α le long de la pente, sur une distance L = h / sin α. Le travail F·L = m·g·h est le même que pour soulever la charge verticalement : une machine simple change la force, pas le travail.",
  piege:"« La rampe me fait gagner de l'énergie » : non, elle me fait gagner de la FORCE en me faisant perdre de la DISTANCE. Avec des frottements, le travail à fournir est même plus grand.",
  build:function(k,S){
    var sc = k.canvas(210), g1 = k.canvas(220);
    var m = k.slider("Masse de la charge", 10, 100, 5, 50, "kg");
    var h = k.slider("Hauteur à atteindre", 0.5, 3, 0.5, 1.5, "m");
    var al = k.slider("Angle de la rampe α", 5, 60, 1, 20, "°");
    var ro = k.readouts(["Force sur la rampe", "Longueur de la rampe", "Travail sur la rampe", "Soulever tout droit"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, M = m.value, H = h.value, A = al.value * D2R, s = Math.sin(A);
      var Fp = M * G * s, L = H / s, Wm = M * G * H, Wp = Fp * L;
      sc.clear(); var base = H / Math.tan(A), scale = Math.min((sc.W - 60) / base, (sc.H - 50) / H), x0 = 30, y0 = sc.H - 24, x1 = x0 + base * scale, y1 = y0 - H * scale;
      var ctx = sc.ctx; ctx.fillStyle = "#e3e7ed"; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      var ux = Math.cos(A), uy = Math.sin(A), bxp = x0 + (x1 - x0) * 0.55, byp = y0 - (y0 - y1) * 0.55;
      ctx.save(); ctx.translate(bxp, byp); ctx.rotate(-A); ctx.fillStyle = P.acc; ctx.fillRect(-16, -22, 32, 22); ctx.restore();
      var cx = bxp - uy * 11, cy = byp - ux * 11;
      SFA.draw.arrow(sc, cx, cy, cx + ux * (14 + Fp * 0.12), cy - uy * (14 + Fp * 0.12), P.red, 3); P4.label(sc, "F", cx + ux * (24 + Fp * 0.12), cy - uy * (24 + Fp * 0.12) - 8, P.red);
      SFA.draw.arrow(sc, cx, cy, cx, cy + 14 + M * G * 0.12, P.amber, 3); P4.label(sc, "P", cx + 12, cy + 18 + M * G * 0.12, P.amber);
      S.draw.line(sc, x1 + 10, y0, x1 + 10, y1, P.green, 2); P4.label(sc, "h", x1 + 22, (y0 + y1) / 2, P.green);
      g1.clear(); var ax = S.draw.axes(g1, {x0:0, x1:65, y0:0, y1:6, xl:"α (°)", yl:"rapports", stepX:10, stepY:1});
      S.draw.fn(g1, ax, function(a){ return Math.sin(a * D2R); }, P.red, 3); S.draw.fn(g1, ax, function(a){ return 1 / Math.sin(a * D2R); }, P.acc, 3);
      S.draw.line(g1, ax.X(0), ax.Y(1), ax.X(65), ax.Y(1), P.green, 2, [6, 4]);
      P4.label(g1, "rouge : F / (m·g) = sin α", ax.X(17), ax.Y(5.55), P.red, "left"); P4.label(g1, "bleu : L / h = 1 / sin α", ax.X(17), ax.Y(4.85), P.acc, "left"); P4.label(g1, "vert : (F·L)/(m·g·h) = 1", ax.X(17), ax.Y(4.15), P.green, "left");
      S.draw.dot(g1, ax.X(al.value), ax.Y(s), 5, P.red); if (1 / s <= 6) S.draw.dot(g1, ax.X(al.value), ax.Y(1 / s), 5, P.acc); else P4.label(g1, "L / h = " + S.fmt(1 / s, 1) + " (hors graphique)", ax.X(al.value) + 8, ax.Y(5.9), P.acc, "left");
      ro.set(0, S.fmt(Fp, 0) + " N"); ro.set(1, S.fmt(L, 2) + " m"); ro.set(2, S.fmt(Wp, 0) + " J"); ro.set(3, S.fmt(M * G, 0) + " N sur " + S.fmt(H, 1) + " m = " + S.fmt(Wm, 0) + " J");
      nt.set("Pente douce : force " + S.fmt(Fp / (M * G) * 100, 0) + " % du poids, rampe " + S.fmt(L / H, 1) + " fois plus longue que la hauteur. Travail identique (sans frottement).", "");
    });
  }
});

SFA.sim({
  id:"p4-c05-puissance-escalier", ch:"c05", tag:"Puissance",
  titre:"Grimper un escalier : énergie ou puissance ?",
  resume:"Monter en 20 s ou en 5 s : même énergie, mais pas la même puissance.",
  but:"Choisis ta masse, la hauteur et le temps de montée. Compare ta puissance à celle d'appareils courants.",
  aRetenir:"Le travail contre la pesanteur est W = m·g·h : il ne dépend pas du temps. La puissance P = W/t mesure la rapidité du transfert (watt = joule par seconde) : monter 2 fois plus vite demande 2 fois plus de puissance.",
  piege:"Énergie (J) et puissance (W) ne sont pas la même chose : un watt, c'est un joule PAR seconde. Le corps humain produit en réalité beaucoup plus de puissance chimique que la puissance utile calculée ici (rendement musculaire d'environ 25 %).",
  build:function(k,S){
    var g1 = k.canvas(250), b = k.canvas(160);
    var m = k.slider("Masse", 40, 100, 5, 65, "kg");
    var h = k.slider("Hauteur à gravir", 3, 30, 1, 9, "m");
    var t = k.slider("Temps de montée", 3, 120, 1, 20, "s");
    var ro = k.readouts(["Énergie fournie W = m·g·h", "Puissance moyenne P", "Équivalent en ampoules de 60 W"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, M = m.value, H = h.value, T = t.value, E = M * G * H, Pw = E / T;
      g1.clear(); var ymax = E / 3 * 1.05, ax = S.draw.axes(g1, {x0:0, x1:120, y0:0, y1:ymax, xl:"t (s)", yl:"P (W)", stepX:20});
      S.draw.fn(g1, ax, function(x){ return x < 3 ? E / 3 : E / x; }, P.acc, 3);
      S.draw.line(g1, ax.X(T), ax.B, ax.X(T), ax.Y(Pw), "#8a95a3", 1.2, [3, 3]); S.draw.line(g1, ax.L, ax.Y(Pw), ax.X(T), ax.Y(Pw), "#8a95a3", 1.2, [3, 3]); S.draw.dot(g1, ax.X(T), ax.Y(Pw), 6, P.red);
      P4.label(g1, "P = E / t (E = " + S.fmt(E, 0) + " J)", ax.X(118), ax.Y(ymax * 0.7), P.acc, "right");
      var ref = [["Toi", Pw, P.red], ["Ampoule", 60, "#8a95a3"], ["Cheval-vapeur", 735, "#8a95a3"], ["Bouilloire", 2000, "#8a95a3"]];
      P4.bars(b, ref.map(function(r){ return {n:r[0], v:r[1], col:r[2]}; }), {lo:0, hi:Math.max(2100, Pw * 1.05), unit:"W", fmt:function(q){ return S.fmt(q, 0); }});
      ro.set(0, S.fmt(E, 0) + " J"); ro.set(1, S.fmt(Pw, 0) + " W"); ro.set(2, S.fmt(Pw / 60, 1) + " ampoules");
      nt.set(Pw > 735 ? "Plus d'un cheval-vapeur (735 W) : c'est un effort de sprint, impossible à tenir longtemps." : Pw < 100 ? "Moins de 100 W : une puissance qu'on peut soutenir des heures." : "Puissance moyenne soutenable seulement quelques minutes.", Pw > 735 ? "warn" : "");
    });
  }
});

var DEV = [
  ["Centrale à gaz (cycle combiné)", 0.55, "électricité", "chaleur rejetée"],
  ["Centrale nucléaire", 0.33, "électricité", "chaleur rejetée"],
  ["Ligne haute tension + transformateurs", 0.93, "électricité livrée", "chaleur (effet Joule)"],
  ["Moteur électrique", 0.90, "énergie mécanique", "chaleur"],
  ["Lampe à incandescence", 0.05, "lumière", "chaleur"],
  ["Lampe LED", 0.40, "lumière", "chaleur"],
  ["Moteur d'une voiture à essence", 0.25, "mouvement", "chaleur"],
  ["Voiture électrique (batterie → roues)", 0.85, "mouvement", "chaleur"],
  ["Chaudière à condensation", 0.95, "chaleur utile", "chaleur perdue (fumées)"],
  ["Panneau solaire", 0.18, "électricité", "chaleur et réflexion"]
];
SFA.sim({
  id:"p4-c05-sankey", ch:"c05", tag:"Diagramme de Sankey",
  titre:"Chaîne énergétique et rendement global",
  resume:"Enchaîne jusqu'à trois appareils : les rendements se multiplient.",
  but:"Choisis des appareils à la suite (le deuxième et le troisième sont facultatifs) et l'énergie de départ. Lis les pertes à chaque étape.",
  aRetenir:"Rendement η = énergie utile / énergie reçue, toujours inférieur à 100 %. Dans une chaîne, les rendements se multiplient : η<sub>total</sub> = η₁ × η₂ × η₃. Les pertes ne disparaissent pas : elles deviennent de l'énergie thermique dispersée.",
  piege:"Le rendement global n'est pas la moyenne des rendements : trois étages à 90 % ne donnent pas 90 % mais 73 %. (Valeurs de rendement : ordres de grandeur typiques, simplifiés.)",
  build:function(k,S){
    var c = k.canvas(300);
    var opts = DEV.map(function(x, i){ return [i, x[0] + " (η = " + S.fmt(x[1] * 100, 0) + " %)"]; });
    var optN = [["-1", "— (aucun)"]].concat(opts);
    var d1 = k.select("Appareil 1", opts, 0), d2 = k.select("Appareil 2", optN, 2), d3 = k.select("Appareil 3", optN, 5);
    var e0 = k.slider("Énergie de départ", 10, 100, 5, 100, "MJ");
    var ro = k.readouts(["Rendement total", "Énergie utile finale", "Énergie dissipée"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, st = [d1.value, d2.value, d3.value].filter(function(v){ return +v >= 0; }).map(function(v){ return DEV[+v]; });
      var E = [e0.value], i; st.forEach(function(s){ E.push(E[E.length - 1] * s[1]); });
      var n = st.length, bw = c.W / (2 * n + 1.2), band = 150, top = 40, sc = band / e0.value;
      c.clear(); var ctx = c.ctx;
      for (i = 0; i <= n; i++){
        var xs = i === 0 ? 4 : bw * 2 * i, xe = i === 0 ? bw : (i === n ? c.W - 4 : bw * (2 * i + 1));
        ctx.fillStyle = "rgba(30,63,143,.55)"; ctx.fillRect(xs, top, xe - xs, E[i] * sc);
        if (i === 0 || i === n){ P4.label(c, S.fmt(E[i], 1) + " MJ", (xs + xe) / 2, top - 12, P.acc); }
      }
      for (i = 0; i < n; i++){
        var bx = bw * (2 * i + 1), loss = E[i] - E[i + 1];
        ctx.fillStyle = "#13233a"; ctx.fillRect(bx, top - 8, bw, band + 16); ctx.fillStyle = "#fff";
        SFA.draw.text(c, "η=" + S.fmt(st[i][1] * 100, 0) + "%", bx + bw / 2, top + band / 2 - 6, {size:12, color:"#fff"});
        SFA.draw.text(c, "n° " + (i + 1), bx + bw / 2, top + band / 2 + 12, {size:12, color:"#fff"});
        var lw = Math.max(2, loss * sc), lx = bx + bw / 2 - lw / 2;
        ctx.fillStyle = "rgba(180,35,24,.6)"; ctx.fillRect(lx, top + band + 8, lw, 40);
        P4.label(c, "−" + S.fmt(loss, 1), bx + bw / 2, top + band + 62, P.red);
        P4.label(c, "chaleur", bx + bw / 2, top + band + 78, P.red);
      }
      P4.label(c, "utile : " + (n ? st[n - 1][2] : ""), c.W - 6, top + E[n] * sc + 14, P.acc, "right");
      var eta = E[n] / E[0];
      ro.set(0, S.fmt(eta * 100, 1) + " %"); ro.set(1, S.fmt(E[n], 1) + " MJ (" + S.fmt(E[n] / 3.6, 2) + " kWh)"); ro.set(2, S.fmt(E[0] - E[n], 1) + " MJ");
      nt.set(n === 0 ? "Choisis au moins un appareil." : "η total = " + st.map(function(s){ return S.fmt(s[1], 2); }).join(" × ") + " = " + S.fmt(eta, 3) + ". Sur " + S.fmt(E[0], 0) + " MJ de départ, " + S.fmt(E[0] - E[n], 1) + " MJ finissent en chaleur dans l'environnement.", "");
    });
  }
});
})();
