/* Chapitre 9 · Potentiel, énergie électrique et condensateur */
(function(){
var K = 9.0e9, QE = 1.6e-19, ME = 9.11e-31, MP = 1.67e-27, MA = 6.64e-27, C0 = 3.0e8;

SFA.sim({
  id: "p5-c09-equipotentielles", ch: "c09", tag: "Carte",
  titre: "Carte des équipotentielles et travail entre deux points",
  resume: "Deux charges → potentiel V (couleurs), équipotentielles, et U entre deux points.",
  but: "Règle les deux charges (en nC). Place le point A et le point B (choisis lequel déplacer, puis touche la carte). Lis les potentiels, la tension U<sub>AB</sub> et le travail pour déplacer une charge de A vers B.",
  aRetenir: "Potentiel d'une charge : V = k·q/r (en volts ; zéro à l'infini). La tension U<sub>AB</sub> = V<sub>A</sub> − V<sub>B</sub>. Le travail du champ pour une charge q qui va de A à B vaut W = q·U<sub>AB</sub> : il ne dépend pas du chemin. Les équipotentielles sont perpendiculaires aux lignes de champ.",
  piege: "V = 0 ne veut pas dire E = 0 (entre deux charges opposées, au milieu, V = 0 mais E est maximal). Et le potentiel n'est pas l'énergie potentielle : V = énergie par unité de charge (E<sub>p</sub> = q·V).",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62});
    var q1 = k.slider("Charge q₁ (à gauche)", -5, 5, 0.5, 4, "nC");
    var q2 = k.slider("Charge q₂ (à droite)", -5, 5, 0.5, -4, "nC");
    var qt = k.slider("Charge qui se déplace", -5, 5, 0.5, 1, "nC");
    var who = k.seg("Point à placer", [["A", "A"], ["B", "B"]], "A");
    var ro = k.readouts(["V en A", "V en B", "U_AB = V_A − V_B", "Travail W = q·U_AB", "Champ E en A"]);
    var nt = k.note("", ""), f, A = [-0.4, 0.4], B = [0.6, -0.3];
    function V(x, y){ var s = 0; [[-0.5, q1.value], [0.5, q2.value]].forEach(function(z){ var r = Math.max(Math.hypot(x - z[0], y - 0), 0.03); s += K * z[1] * 1e-9 / r; }); return s; }
    c.pointer(function(type, p){ if (!f || (type !== "down" && type !== "drag")) return; var P = [P5.clamp(f.ix(p.x), -1.55, 1.55), P5.clamp(f.iy(p.y), -0.95, 0.95)]; if (who.value === "A") A = P; else B = P; k.redraw(); });
    k.draw(function(){
      c.clear(); var pal = S.draw.palette, ctx = c.ctx;
      f = P5.frame(c, {x0: -1.6, x1: 1.6, y0: -1, y1: 1}, {grid: false});
      var cs = 5, x0 = f.X(-1.6), x1 = f.X(1.6), y0 = f.Y(1), y1 = f.Y(-1), dV = 20, vs = 150;
      var nx = Math.ceil((x1 - x0) / cs), ny = Math.ceil((y1 - y0) / cs), grid = [];
      for (var j = 0; j < ny; j++){ var row = []; for (var i = 0; i < nx; i++) row.push(V(f.ix(x0 + (i + 0.5) * cs), f.iy(y0 + (j + 0.5) * cs))); grid.push(row); }
      for (j = 0; j < ny; j++) for (i = 0; i < nx; i++){
        var v = grid[j][i], t = Math.tanh(v / vs), a = Math.abs(t) * 0.55;
        ctx.fillStyle = t > 0 ? "rgba(180,35,24," + a + ")" : "rgba(30,63,143," + a + ")"; ctx.fillRect(x0 + i * cs, y0 + j * cs, cs, cs);
      }
      ctx.fillStyle = "rgba(15,27,45,.55)";
      for (j = 0; j < ny - 1; j++) for (i = 0; i < nx - 1; i++){
        var kk = Math.floor(grid[j][i] / dV);
        if (kk !== Math.floor(grid[j][i + 1] / dV) || kk !== Math.floor(grid[j + 1][i] / dV)) ctx.fillRect(x0 + i * cs + 1, y0 + j * cs + 1, 2, 2);
      }
      [[-0.5, q1.value], [0.5, q2.value]].forEach(function(z){ var col = z[1] > 0 ? pal.red : z[1] < 0 ? pal.acc : pal.grey; S.draw.dot(c, f.X(z[0]), f.Y(0), 11, col); S.draw.text(c, z[1] > 0 ? "+" : z[1] < 0 ? "−" : "0", f.X(z[0]), f.Y(0), {color: "#fff", size: 14}); });
      [[A, "A", pal.ink], [B, "B", pal.violet]].forEach(function(z){ S.draw.dot(c, f.X(z[0][0]), f.Y(z[0][1]), 6, z[2]); S.draw.text(c, z[1], f.X(z[0][0]) + 12, f.Y(z[0][1]) - 12, {size: 14, color: z[2], bg: "rgba(255,255,255,.7)"}); });
      S.draw.text(c, "rouge : V > 0 · bleu : V < 0 · traits : toutes les " + dV + " V", 10, c.H - 12, {align: "left", size: 12, color: pal.ink, bg: "rgba(255,255,255,.7)"});
      var VA = V(A[0], A[1]), VB = V(B[0], B[1]), U = VA - VB, h = 0.005, Ex = -(V(A[0] + h, A[1]) - V(A[0] - h, A[1])) / (2 * h), Ey = -(V(A[0], A[1] + h) - V(A[0], A[1] - h)) / (2 * h);
      var W = qt.value * 1e-9 * U;
      P5.vec(c, f.X(A[0]), f.Y(A[1]), f.X(A[0]) + Ex / Math.max(Math.hypot(Ex, Ey), 1) * 40, f.Y(A[1]) - Ey / Math.max(Math.hypot(Ex, Ey), 1) * 40, pal.green, "E", {});
      ro.set(0, S.fmt(VA, 1) + " V"); ro.set(1, S.fmt(VB, 1) + " V"); ro.set(2, S.fmt(U, 1) + " V"); ro.set(3, S.fmt(W * 1e9, 1) + " nJ"); ro.set(4, S.fmt(Math.hypot(Ex, Ey), 0) + " V/m");
      nt.set("W = q·U<sub>AB</sub> = " + S.fmt(qt.value, 1) + " nC × " + S.fmt(U, 1) + " V = " + S.fmt(W * 1e9, 1) + " nJ : " + (W > 0 ? "le champ fournit de l'énergie (la charge est accélérée de A vers B)." : W < 0 ? "il faut fournir de l'énergie pour aller de A à B." : "aucun travail."), "");
    });
  }
});

SFA.sim({
  id: "p5-c09-accelerateur", ch: "c09", tag: "Accélérateur",
  titre: "Accélérateur de particules : de la tension à la vitesse",
  resume: "Tension → énergie cinétique et vitesse ; limite de la formule classique.",
  but: "Choisis une particule et règle la tension d'accélération (U = 10<sup>x</sup> volts). Compare la vitesse « classique » √(2qU/m) avec la vitesse réelle. À partir de quelle tension l'électron pose-t-il problème ?",
  aRetenir: "Une charge q accélérée depuis le repos par une tension U gagne l'énergie cinétique E<sub>c</sub> = q·U, donc v = √(2qU/m) (formule classique). Un électron accéléré par 1 V gagne 1 eV = 1,6·10⁻¹⁹ J. À grande tension, la vitesse approche celle de la lumière sans jamais l'atteindre.",
  piege: "Doubler U ne double pas v : v ∝ √U (il faut 4 fois plus de tension pour doubler la vitesse). Et la formule ½mv² = qU ne marche plus au-delà de quelques dizaines de kV pour un électron (vitesse proche de c) : la vitesse réelle est inférieure.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.62});
    var part = k.seg("Particule", [["e", "Électron"], ["p", "Proton"], ["a", "Particule α"]], "e");
    var x = k.slider("Exposant x : U = 10^x volts", 1, 6.3, 0.05, 3, "");
    var ro = k.readouts(["Tension U", "Énergie cinétique", "Vitesse (formule classique)", "Vitesse réelle", "v / c (réelle)"]);
    var nt = k.note("", "");
    function P(){ return part.value === "e" ? {m: ME, q: QE, n: "électron"} : part.value === "p" ? {m: MP, q: QE, n: "proton"} : {m: MA, q: 2 * QE, n: "particule α"}; }
    function vcl(p, U){ return Math.sqrt(2 * p.q * U / p.m); }
    function vrel(p, U){ var g = 1 + p.q * U / (p.m * C0 * C0); return C0 * Math.sqrt(1 - 1 / (g * g)); }
    k.draw(function(){
      c.clear(); var pal = S.draw.palette, ctx = c.ctx, p = P(), U = Math.pow(10, x.value);
      var ax = S.draw.axes(c, {x0: 1, x1: 6.3, y0: 0, y1: 1.5, xl: "x (U = 10^x V)", yl: "v / c", stepX: 1, stepY: 0.25, l: 52});
      S.draw.fn(c, ax, function(xx){ return vcl(p, Math.pow(10, xx)) / C0; }, pal.red, 2.2, [6, 4]);
      S.draw.fn(c, ax, function(xx){ return vrel(p, Math.pow(10, xx)) / C0; }, pal.acc);
      S.draw.line(c, ax.X(1), ax.Y(1), ax.X(6.3), ax.Y(1), pal.amber, 1.5, [3, 3]); S.draw.text(c, "c", ax.X(6.2), ax.Y(1) - 10, {size: 13, color: pal.amber});
      S.draw.text(c, "pointillés rouges : formule classique", ax.X(1.1), ax.Y(1.42), {align: "left", size: 12, color: pal.red}); S.draw.text(c, "trait bleu : vitesse réelle", ax.X(1.1), ax.Y(1.3), {align: "left", size: 12, color: pal.acc});
      var vc = vcl(p, U), vr = vrel(p, U);
      S.draw.line(c, ax.X(x.value), ax.Y(0), ax.X(x.value), ax.Y(1.5), pal.grey, 1.2, [4, 4]);
      if (vc / C0 < 1.5) S.draw.dot(c, ax.X(x.value), ax.Y(vc / C0), 5, pal.red);
      S.draw.dot(c, ax.X(x.value), ax.Y(vr / C0), 6, pal.acc);
      var EcJ = p.q * U;
      ro.set(0, U >= 1000 ? S.fmt(U / 1000, 1) + " kV" : S.fmt(U, 0) + " V"); ro.set(1, S.sci(EcJ, 2) + " J (" + S.sci(EcJ / QE, 2) + " eV)");
      ro.set(2, S.fmt(vc / 1000, 0) + " km/s" + (vc > C0 ? " (impossible !)" : "")); ro.set(3, S.fmt(vr / 1000, 0) + " km/s"); ro.set(4, S.fmt(vr / C0, 4));
      if (vc > C0) nt.set("La formule classique donne une vitesse supérieure à c : elle n'est plus valable. La vitesse réelle reste inférieure à c (relativité).", "bad");
      else if (vc > 0.1 * C0) nt.set("Vitesse supérieure à 10 % de c : l'écart entre la formule classique (" + S.fmt(vc / 1000, 0) + " km/s) et la valeur réelle (" + S.fmt(vr / 1000, 0) + " km/s) devient sensible.", "warn");
      else nt.set("Domaine classique : E<sub>c</sub> = q·U = ½·m·v², avec v ≈ " + S.fmt(vc / 1000, 0) + " km/s pour un " + p.n + " accéléré par " + S.fmt(U, 0) + " V. Les deux formules coïncident à moins de 1 %.", "ok");
    });
  }
});

SFA.sim({
  id: "p5-c09-rc", ch: "c09", tag: "Charge et décharge",
  titre: "Charge et décharge d'un condensateur : la constante de temps RC",
  resume: "R, C, E → courbes U(t) et I(t), constante de temps τ = RC.",
  but: "Charge puis décharge le condensateur à travers la résistance. Regarde la tension et le courant. Que vaut la tension après un temps τ = RC ? Change R ou C : qu'est-ce qui change dans la courbe ?",
  aRetenir: "Charge : U<sub>C</sub> = E·(1 − e<sup>−t/τ</sup>), le courant I = (E − U<sub>C</sub>)/R décroît ; décharge : U<sub>C</sub> = U₀·e<sup>−t/τ</sup>. τ = R·C : à t = τ, on a atteint 63 % de la charge (ou il reste 37 %). Au bout de 5τ, on est à moins de 1 % de la valeur finale. Charge stockée Q = C·U ; énergie ½·C·U².",
  piege: "Le condensateur ne « se remplit » pas instantanément, et le courant n'est pas constant : il est maximal au début et tend vers 0. Et τ n'est pas la durée totale de charge : il faut environ 5τ.",
  build: function(k, S){
    var c = k.canvas(190), gr = k.canvas(150);
    var R = k.slider("Résistance R", 1, 100, 1, 10, "kΩ");
    var C = k.slider("Capacité C", 10, 1000, 10, 100, "µF");
    var E = k.slider("Tension du générateur E", 1, 12, 0.5, 9, "V");
    var ro = k.readouts(["Constante de temps (R × C)", "Tension U_C", "Courant I", "Charge Q = C·U_C", "Énergie ½·C·U_C²"]);
    var nt = k.note("", ""), Uc = 0, tt = 0, mode = "charge", hist = [[0, 0, 0]];
    function reset(m){ mode = m; tt = 0; hist = [[0, Uc, 0]]; lp.play(); }
    k.button("Charger (interrupteur sur E)", function(){ reset("charge"); }, true);
    k.button("Décharger (court-circuit)", function(){ reset("decharge"); });
    var lp = k.loop(function(dt){
      var tau = R.value * 1e3 * C.value * 1e-6, ts = dt * tau;     /* 1 s à l'écran = τ */
      var Ef = mode === "charge" ? E.value : 0; Uc = Ef + (Uc - Ef) * Math.exp(-ts / tau); tt += ts;
      hist.push([tt, Uc, (Ef - Uc) / (R.value * 1e3)]); if (tt > 6 * tau) lp.pause(); k.redraw();
    });
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, tau = R.value * 1e3 * C.value * 1e-6; c.clear(); gr.clear();
      var Ef = mode === "charge" ? E.value : 0;
      var Ee = E.value, I = (Ef - Uc) / (R.value * 1e3), Imax = Ee / (R.value * 1e3);
      var ax = S.draw.axes(c, {x0: 0, x1: 5 * tau, y0: 0, y1: Ee * 1.1, xl: "t (s)", yl: "U_C (V)", l: 46, stepX: tau});
      ctx.strokeStyle = pal.acc; ctx.lineWidth = 2.6; ctx.beginPath(); hist.forEach(function(p, i){ if (p[0] > 5 * tau) return; if (i === 0) ctx.moveTo(ax.X(p[0]), ax.Y(p[1])); else ctx.lineTo(ax.X(p[0]), ax.Y(p[1])); }); ctx.stroke();
      S.draw.line(c, ax.X(0), ax.Y(Ee), ax.X(5 * tau), ax.Y(Ee), pal.grey, 1, [4, 4]);
      S.draw.line(c, ax.X(tau), ax.Y(0), ax.X(tau), ax.Y(Ee * 1.1), pal.amber, 1.2, [4, 4]); S.draw.text(c, "τ", ax.X(tau) + 8, ax.T + 8, {size: 13, color: pal.amber});
      S.draw.dot(c, ax.X(Math.min(tt, 5 * tau)), ax.Y(Uc), 5, pal.red);
      var Im = Imax * 1000, ax2 = S.draw.axes(gr, {x0: 0, x1: 5 * tau, y0: -Im * 1.1, y1: Im * 1.1, xl: "t (s)", yl: "I (mA)", l: 46, stepX: tau, stepY: Im / 2});
      gr.ctx.strokeStyle = pal.red; gr.ctx.lineWidth = 2.6; gr.ctx.beginPath(); hist.forEach(function(p, i){ if (p[0] > 5 * tau) return; if (i === 0) gr.ctx.moveTo(ax2.X(p[0]), ax2.Y(p[2] * 1000)); else gr.ctx.lineTo(ax2.X(p[0]), ax2.Y(p[2] * 1000)); }); gr.ctx.stroke();
      S.draw.text(gr, "1 s à l'écran = τ", gr.W - 10, gr.H - 8, {align: "right", size: 12, color: pal.grey});
      ro.set(0, S.fmt(tau, 3) + " s"); ro.set(1, S.fmt(Uc, 2) + " V"); ro.set(2, S.fmt(I * 1000, 2) + " mA"); ro.set(3, S.fmt(C.value * 1e-6 * Uc * 1e3, 2) + " mC"); ro.set(4, S.fmt(0.5 * C.value * 1e-6 * Uc * Uc * 1e3, 2) + " mJ");
      nt.set(mode === "charge" ? "Charge : à t = τ, U_C = 63 % de E = " + S.fmt(0.632 * Ee, 2) + " V ; à 5τ, 99,3 %. Courant initial E/R = " + S.fmt(Imax * 1000, 2) + " mA." : "Décharge : à t = τ il reste 37 % de la tension initiale. Le courant est négatif : il circule en sens inverse du courant de charge.", "");
    });
  }
});

SFA.sim({
  id: "p5-c09-flash", ch: "c09", tag: "Niche utile",
  titre: "Le flash d'un appareil photo : énergie ½·C·U²",
  resume: "Capacité et tension → énergie, puissance de l'éclair, comparaisons.",
  but: "Règle la capacité et la tension de charge du condensateur du flash, puis la durée de la décharge. Compare l'énergie stockée à celle d'une pile AA ou à la hauteur dont elle soulèverait un kilogramme. Que se passe-t-il quand U double ?",
  aRetenir: "Un condensateur de capacité C chargé sous la tension U stocke Q = C·U et l'énergie E = ½·C·U². Doubler U multiplie l'énergie par 4, doubler C la multiplie par 2. Lâchée en un temps très court Δt, elle donne une puissance P = E/Δt énorme.",
  piege: "Ce n'est pas E = C·U² (oubli du ½) ni E = Q·U : la tension baisse pendant la décharge, donc le travail moyen est ½·Q·U. Et attention : un condensateur de flash garde sa charge longtemps, il peut être dangereux à ouvrir.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.55});
    var C = k.slider("Capacité C", 50, 1000, 10, 120, "µF");
    var U = k.slider("Tension de charge U", 50, 450, 10, 300, "V");
    var dt = k.slider("Durée de l'éclair Δt", 0.1, 5, 0.1, 1, "ms");
    var ro = k.readouts(["Charge Q = C·U", "Énergie ½·C·U²", "Puissance E/Δt", "Pile AA (≈ 13 kJ)", "Soulève 1 kg de"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear(); var pal = S.draw.palette, ctx = c.ctx, Cf = C.value * 1e-6;
      var Ef = function(u){ return 0.5 * Cf * u * u; }, ymax = 0.5 * 1000e-6 * 450 * 450;
      var ax = S.draw.axes(c, {x0: 0, x1: 450, y0: 0, y1: ymax, xl: "U (V)", yl: "E (J)", stepX: 50, l: 50});
      S.draw.fn(c, ax, Ef, pal.acc);
      S.draw.fn(c, ax, function(u){ return 0.5 * 1000e-6 * u * u; }, "#cbd3de", 1.6, [5, 4]);
      S.draw.fn(c, ax, function(u){ return 0.5 * 50e-6 * u * u; }, "#cbd3de", 1.6, [5, 4]);
      S.draw.text(c, "C = 1000 µF", ax.X(300), ax.Y(0.5 * 1e-3 * 300 * 300) - 10, {size: 12, color: pal.grey}); S.draw.text(c, "C = 50 µF", ax.X(430), ax.Y(0.5 * 50e-6 * 430 * 430) - 10, {size: 12, color: pal.grey, align: "right"});
      var E1 = Ef(U.value), E2 = Ef(U.value / 2);
      S.draw.dot(c, ax.X(U.value), ax.Y(E1), 7, pal.red); S.draw.dot(c, ax.X(U.value / 2), ax.Y(E2), 6, pal.amber);
      S.draw.text(c, S.fmt(E1, 2) + " J", ax.X(U.value) - 8, ax.Y(E1) - 12, {align: "right", size: 13, color: pal.red});
      S.draw.text(c, "U/2 : " + S.fmt(E2, 2) + " J (÷ 4)", ax.X(U.value / 2) + 10, ax.Y(E2) + 14, {align: "left", size: 12, color: pal.amber});
      var P = E1 / (dt.value * 1e-3), h = E1 / (1 * P5.g);
      ro.set(0, S.fmt(Cf * U.value * 1e3, 1) + " mC"); ro.set(1, S.fmt(E1, 2) + " J"); ro.set(2, P >= 1000 ? S.fmt(P / 1000, 1) + " kW" : S.fmt(P, 0) + " W");
      ro.set(3, S.fmt(E1 / 13500 * 100, 3) + " % de l'énergie"); ro.set(4, S.fmt(h * 100, 0) + " cm");
      nt.set("E = ½·" + S.fmt(C.value, 0) + "·10⁻⁶ × " + S.fmt(U.value, 0) + "² = " + S.fmt(E1, 2) + " J, libérés en " + S.fmt(dt.value, 1) + " ms : " + (P >= 1000 ? S.fmt(P / 1000, 1) + " kW" : S.fmt(P, 0) + " W") + ", soit environ " + S.fmt(P / 60, 0) + " fois une lampe de 60 W, mais pendant très peu de temps.", "");
    });
  }
});
})();
