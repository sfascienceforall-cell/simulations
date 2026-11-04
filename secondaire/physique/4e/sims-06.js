/* Physique 4e · chapitre 6 · Conservation et dégradation de l'énergie */
(function(){
var G = 9.8;

SFA.sim({
  id:"p4-c06-rebonds", ch:"c06", tag:"Animation",
  titre:"Une balle qui rebondit : où va l'énergie ?",
  resume:"À chaque rebond, la hauteur diminue : l'énergie mécanique devient chaleur, mais le total reste le même.",
  but:"Choisis la hauteur de départ, la masse et la part d'énergie conservée à chaque rebond. Regarde les barres : mécanique + thermique = constante.",
  aRetenir:"L'énergie totale se conserve. À chaque rebond, une partie de l'énergie mécanique est transformée en énergie thermique (balle, sol, air) : on dit que l'énergie se dégrade. La hauteur du n-ième rebond est h<sub>n</sub> = h₀·f<sup>n</sup>.",
  piege:"« La balle perd de l'énergie » : non, elle la cède à l'environnement sous forme de chaleur (très faible ici, mais bien réelle). C'est l'énergie MÉCANIQUE qui diminue, pas l'énergie totale.",
  build:function(k,S){
    var c = k.canvas(280), b = k.canvas(80), st = {t:0};
    var h0 = k.slider("Hauteur de départ", 0.5, 3, 0.5, 2, "m", function(){ st.t = 0; });
    var m = k.slider("Masse de la balle", 0.05, 1, 0.05, 0.2, "kg");
    var f = k.slider("Énergie conservée à chaque rebond", 30, 95, 5, 70, "%", function(){ st.t = 0; });
    var ro = k.readouts(["Énergie totale m·g·h₀", "Énergie mécanique", "Énergie thermique", "Rebonds avant < 1 cm"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t += dt; k.redraw(); });
    k.button("▶ Lâcher", function(){ st.t = 0; lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    function state(t){
      var H = h0.value, F = f.value / 100, t0 = Math.sqrt(2 * H / G);
      if (t < t0) return {y:H - 0.5 * G * t * t, ap:H, n:0};
      var s = t - t0, n = 1, hn = H * F, Tn;
      while (n < 400){
        if (hn < 0.005) return {y:0, ap:0, n:n, rest:true};
        Tn = 2 * Math.sqrt(2 * hn / G);
        if (s < Tn){ var v = Math.sqrt(2 * G * hn); return {y:v * s - 0.5 * G * s * s, ap:hn, n:n}; }
        s -= Tn; n++; hn *= F;
      }
      return {y:0, ap:0, n:n, rest:true};
    }
    k.draw(function(){
      var P = SFA.draw.palette, H = h0.value, M = m.value, F = f.value / 100, s = state(st.t);
      var gnd = c.H - 24, top = 22, sc = (gnd - top) / H;
      c.clear(); var ctx = c.ctx; ctx.fillStyle = "#e3e7ed"; ctx.fillRect(0, gnd, c.W, 10);
      for (var n = 0; n <= 6; n++){ var hn = H * Math.pow(F, n); S.draw.line(c, 20, gnd - hn * sc, c.W - 20, gnd - hn * sc, n === s.n ? P.red : "#c9d1dc", 1.2, [4, 4]); if (hn * sc > 14 || n === 0) P4.label(c, n === 0 ? "départ" : "h" + n + " = " + S.fmt(hn, 2) + " m", c.W - 24, gnd - hn * sc - 8, "#5f6b7a", "right"); }
      S.draw.dot(c, c.W / 2, gnd - s.y * sc - 8, 8, P.red);
      var E0 = M * G * H, Em = M * G * s.ap, Et = E0 - Em;
      P4.bars(b, [{n:"Méc.", v:Em, col:P.acc}, {n:"Therm.", v:Et, col:P.red}], {lo:0, hi:E0, unit:"J", fmt:function(q){ return S.fmt(q, 2); }});
      var n1 = H > 0.01 ? Math.ceil(Math.log(0.01 / H) / Math.log(F)) : 0;
      ro.set(0, S.fmt(E0, 2) + " J"); ro.set(1, S.fmt(Em, 2) + " J"); ro.set(2, S.fmt(Et, 2) + " J"); ro.set(3, n1 + " rebonds");
      nt.set(s.rest ? "La balle est immobile : toute l'énergie de départ (" + S.fmt(E0, 2) + " J) est devenue énergie thermique." : "Mécanique + thermique = " + S.fmt(Em + Et, 2) + " J à tout instant. Rebond n° " + s.n + " : hauteur max. " + S.fmt(s.ap, 2) + " m.", "");
    });
  }
});

SFA.sim({
  id:"p4-c06-pendule-frottement", ch:"c06", tag:"Bilan",
  titre:"Pendule avec frottements : le bilan d'énergie",
  resume:"L'énergie mécanique décroît, l'énergie thermique croît, et leur somme est constante.",
  but:"Règle l'amplitude et le frottement de l'air. Suis les courbes d'énergie au cours du temps. Avec 0 frottement, l'énergie mécanique reste constante.",
  aRetenir:"Avec frottements, E<sub>mécanique</sub> diminue et E<sub>thermique</sub> = E<sub>départ</sub> − E<sub>mécanique</sub> augmente : l'énergie totale est constante. L'énergie thermique dispersée est difficile à récupérer : l'énergie se dégrade.",
  piege:"Quand le pendule s'arrête, son énergie n'a pas « disparu » : l'air, le fil et le support se sont légèrement réchauffés. La conservation concerne l'énergie totale, pas l'énergie mécanique seule.",
  build:function(k,S){
    var c = k.canvas(190), g1 = k.canvas(220), st = {th:0, w:0, t:0, hist:[]};
    var th0, lam, sp;
    function reset(){ st.th = (th0 ? th0.value : 50) * Math.PI / 180; st.w = 0; st.t = 0; st.hist = []; }
    th0 = k.slider("Amplitude de départ", 20, 80, 5, 50, "°", reset);
    lam = k.slider("Frottement de l'air", 0, 1, 0.05, 0.15, "s⁻¹", reset);
    sp = k.seg("Vitesse", [[1,"×1"],[4,"×4"]], 4);
    var ro = k.readouts(["E départ (m = 0,5 kg, L = 1 m)", "E mécanique", "E thermique", "Somme"]);
    var nt = k.note("", "");
    var M = 0.5, L = 1;
    var lp = k.loop(function(dt){
      var tot = dt * sp.value, n = Math.ceil(tot / 0.001), d = tot / n, i;
      for (i = 0; i < n; i++){ st.w += (-G / L * Math.sin(st.th) - lam.value * st.w) * d; st.th += st.w * d; st.t += d; }
      var Em = 0.5 * M * L * L * st.w * st.w + M * G * L * (1 - Math.cos(st.th));
      if (!st.hist.length || st.t - st.hist[st.hist.length - 1][0] > 0.15) st.hist.push([st.t, Em]);
      if (st.t > 30) lp.pause();
      k.redraw();
    });
    k.button("▶ / ❚❚", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    k.button("↺ Relâcher", function(){ reset(); lp.play(); });
    reset(); lp.play();
    k.draw(function(){
      var P = SFA.draw.palette, T0 = th0.value * Math.PI / 180, E0 = M * G * L * (1 - Math.cos(T0));
      var Em = Math.min(E0, 0.5 * M * L * L * st.w * st.w + M * G * L * (1 - Math.cos(st.th))), Et = Math.max(0, E0 - Em);
      c.clear(); var px = c.W / 2, py = 16, r = (c.H - 40), bx = px + r * Math.sin(st.th), by = py + r * Math.cos(st.th);
      S.draw.line(c, px - 50, py, px + 50, py, "#5f6b7a", 4); S.draw.line(c, px, py, bx, by, "#5f6b7a", 2); S.draw.dot(c, bx, by, 11, P.red);
      g1.clear(); var ax = S.draw.axes(g1, {x0:0, x1:30, y0:0, y1:E0 * 1.15, xl:"t (s)", yl:"E (J)", stepX:5});
      S.draw.line(g1, ax.X(0), ax.Y(E0), ax.X(30), ax.Y(E0), "#13233a", 2, [6, 4]); P4.label(g1, "total", ax.X(29), ax.Y(E0) - 10, "#13233a", "right");
      var ctx = g1.ctx, i; ctx.save(); ctx.lineWidth = 3;
      ctx.strokeStyle = P.acc; ctx.beginPath(); st.hist.forEach(function(p, j){ if (j) ctx.lineTo(ax.X(p[0]), ax.Y(Math.min(E0, p[1]))); else ctx.moveTo(ax.X(p[0]), ax.Y(Math.min(E0, p[1]))); }); ctx.stroke();
      ctx.strokeStyle = P.red; ctx.beginPath(); st.hist.forEach(function(p, j){ var q = Math.max(0, E0 - p[1]); if (j) ctx.lineTo(ax.X(p[0]), ax.Y(q)); else ctx.moveTo(ax.X(p[0]), ax.Y(q)); }); ctx.stroke(); ctx.restore();
      P4.label(g1, "mécanique", ax.X(1), ax.Y(E0 * 0.88), P.acc, "left"); P4.label(g1, "thermique", ax.X(29), ax.Y(E0 * 0.1), P.red, "right");
      ro.set(0, S.fmt(E0, 2) + " J"); ro.set(1, S.fmt(Em, 2) + " J"); ro.set(2, S.fmt(Et, 2) + " J"); ro.set(3, S.fmt(Em + Et, 2) + " J");
      nt.set(lam.value === 0 ? "Frottement nul : l'énergie mécanique reste (pratiquement) constante, aucune chaleur n'apparaît." : "t = " + S.fmt(st.t, 1) + " s : " + S.fmt(Et / E0 * 100, 0) + " % de l'énergie de départ est devenue énergie thermique.", "");
    });
  }
});

function gauss(t, m, s){ return Math.exp(-Math.pow((t - m) / s, 2)); }
function demand(t, w){ return 8 + 2.2 * gauss(t, 8.5, 2.2) + 3.2 * gauss(t, 19, 2.5) + 0.8 * gauss(t, 13, 3) - 0.6 * gauss(t, 3.5, 2.5) + (w ? 1.5 : 0); }
function cfSol(t, w){ var r = w ? 8.5 : 5.5, s = w ? 16.5 : 21.5, p = w ? 0.15 : 0.6; return t > r && t < s ? p * Math.pow(Math.sin(Math.PI * (t - r) / (s - r)), 1.3) : 0; }
function cfWind(t, w){ return Math.min(0.95, Math.max(0.04, 0.32 + 0.2 * Math.sin(2 * Math.PI * (t - 9) / 24) + 0.12 * Math.sin(2 * Math.PI * t / 7.3 + 1) + (w ? 0.1 : 0))); }
SFA.sim({
  id:"p4-c06-mix-electrique", ch:"c06", tag:"Jeu de rôle",
  titre:"Le mix électrique d'un pays sur 24 heures",
  resume:"Combine nucléaire, éolien, solaire et gaz pour suivre la demande, sans déficit et avec peu de CO₂.",
  but:"Règle les puissances installées et la saison. L'objectif : que la production couvre la demande (ligne noire) à chaque heure, avec le moins de CO₂.",
  aRetenir:"L'électricité doit être produite au moment où elle est consommée. Le solaire et l'éolien dépendent du temps qu'il fait (intermittence) ; le nucléaire est stable ; le gaz est modulable mais émet du CO₂. Renouvelable ne veut pas dire disponible à toute heure.",
  piege:"Une « puissance installée » n'est pas une production : un panneau solaire de 1 GW donne bien moins de 1 GW en moyenne (nuit, nuages, saison). Valeurs chiffrées : modèle pédagogique très simplifié, pas la Belgique réelle.",
  build:function(k,S){
    var c = k.canvas(300);
    var sea = k.seg("Saison", [[0,"Été"],[1,"Hiver"]], 0);
    var nuc = k.slider("Nucléaire installé", 0, 6, 0.5, 2, "GW");
    var sol = k.slider("Solaire installé", 0, 10, 0.5, 4, "GW");
    var win = k.slider("Éolien installé", 0, 10, 0.5, 4, "GW");
    var gaz = k.slider("Gaz (centrales modulables)", 0, 12, 1, 8, "GW");
    var ro = k.readouts(["Part renouvelable utilisée", "Part sans gaz", "CO₂ émis sur 24 h", "Énergie manquante", "Surplus perdu"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, w = +sea.value, i, tot = {n:0, s:0, w:0, g:0, d:0, def:0, sur:0};
      var rows = [], ymax = 14;
      for (i = 0; i < 24; i++){
        var t = i + 0.5, D = demand(t, w), N = nuc.value * 0.9, Sn = sol.value * cfSol(t, w), W = win.value * cfWind(t, w), nf = N + Sn + W;
        var Gg = Math.min(Math.max(D - nf, 0), gaz.value), def = Math.max(0, D - nf - Gg), sur = Math.max(0, nf - D);
        rows.push({D:D, N:N, S:Sn, W:W, G:Gg, def:def, sur:sur});
        tot.n += N; tot.s += Sn; tot.w += W; tot.g += Gg; tot.d += D; tot.def += def; tot.sur += sur;
        ymax = Math.max(ymax, D + 1, N + Sn + W + Gg);
      }
      c.clear(); var ax = S.draw.axes(c, {x0:0, x1:24, y0:0, y1:Math.ceil(ymax / 2) * 2, xl:"heure", yl:"GW", stepX:4, stepY:2, t:26});
      var bw = (ax.R - ax.L) / 24, ctx = c.ctx;
      rows.forEach(function(r, j){
        var x = ax.X(j), y = 0, parts = [[r.N, P.violet], [r.W, P.teal], [r.S, P.amber], [r.G, "#8a95a3"]];
        parts.forEach(function(p){ ctx.fillStyle = p[1]; ctx.fillRect(x + 1, ax.Y(y + p[0]), bw - 2, ax.Y(y) - ax.Y(y + p[0])); y += p[0]; });
        if (r.def > 0){ ctx.fillStyle = "rgba(180,35,24,.55)"; ctx.fillRect(x + 1, ax.Y(r.D), bw - 2, ax.Y(y) - ax.Y(r.D)); }
        if (r.sur > 0){ ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(x + 1, ax.Y(y), bw - 2, ax.Y(r.D) - ax.Y(y)); ctx.fillRect(x + 1, ax.Y(y), bw - 2, 0); }
      });
      ctx.save(); ctx.strokeStyle = "#0f1b2d"; ctx.lineWidth = 3; ctx.beginPath(); rows.forEach(function(r, j){ var x = ax.X(j) + bw / 2; if (j) ctx.lineTo(x, ax.Y(r.D)); else ctx.moveTo(x, ax.Y(r.D)); }); ctx.stroke(); ctx.restore();
      var key = [["demande", "#0f1b2d"], ["nucléaire", P.violet], ["éolien", P.teal], ["solaire", P.amber], ["gaz", "#8a95a3"]];
      key.forEach(function(q, j){ ctx.fillStyle = q[1]; ctx.fillRect(ax.L + 8 + j * 64, 6, 10, 10); SFA.draw.text(c, q[0], ax.L + 22 + j * 64, 11, {size:12, color:"#2c3a4e", align:"left"}); });
      var co2 = (tot.g * 0.4 + tot.s * 0.04 + tot.w * 0.012 + tot.n * 0.012);   /* GWh × t/MWh = kt */
      ro.set(0, S.fmt(Math.max(0, (tot.s + tot.w) - tot.sur) / (tot.d - tot.def) * 100, 0) + " %"); ro.set(1, S.fmt((tot.d - tot.def - tot.g) / (tot.d - tot.def) * 100, 0) + " %");
      ro.set(2, S.fmt(co2, 1) + " kt"); ro.set(3, S.fmt(tot.def, 1) + " GWh"); ro.set(4, S.fmt(tot.sur, 1) + " GWh");
      nt.set(tot.def > 0.05 ? "Déficit : il manque de la production à certaines heures (zones rouges). Ajoute des centrales modulables ou de la production stable." : tot.sur > 0.05 ? "Surplus : à certaines heures, la production non modulable dépasse la demande (zones claires) : cette énergie est perdue ou doit être stockée." : "La demande est couverte à chaque heure. Regarde maintenant le CO₂ : peux-tu le réduire ?", tot.def > 0.05 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"p4-c06-perpetuel", ch:"c06", tag:"Défi impossible",
  titre:"Perpétuel mobile : le défi impossible",
  resume:"Un moteur alimente une dynamo qui alimente le moteur… peut-il tourner indéfiniment ?",
  but:"Règle les rendements du moteur et de la dynamo (et l'énergie prélevée pour une lampe). Essaie de faire tourner la machine pour toujours.",
  aRetenir:"À chaque transformation, une partie de l'énergie devient chaleur : rendement < 100 %. Après chaque tour il reste moins d'énergie utilisable qu'avant. Un perpétuel mobile de première espèce (qui crée de l'énergie) violerait la conservation ; un perpétuel mobile qui ne perd rien est impossible dès qu'un frottement existe.",
  piege:"Même avec des rendements de 99 %, l'énergie diminue lentement mais sûrement. Ce n'est pas que l'énergie disparaît : elle part en chaleur dans l'air et le support, où on ne peut plus la récupérer pour faire tourner la machine.",
  build:function(k,S){
    var c = k.canvas(160), g1 = k.canvas(220);
    var e1 = k.slider("Rendement du moteur", 50, 99, 1, 90, "%");
    var e2 = k.slider("Rendement de la dynamo", 50, 99, 1, 90, "%");
    var x = k.slider("Énergie prélevée par tour pour une lampe", 0, 50, 5, 0, "%");
    var ro = k.readouts(["Énergie après 1 tour", "Énergie après 10 tours", "Tours pour tomber sous 50 %", "Tours pour tomber sous 1 %"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, a = e1.value / 100, b = e2.value / 100, p = x.value / 100, q = a * b * (1 - p), E0 = 100;
      c.clear(); var ctx = c.ctx, bw = Math.min(110, (c.W - 80) / 2.4), x1 = 20, x2 = c.W - 20 - bw;
      ctx.fillStyle = "#13233a"; ctx.fillRect(x1, 20, bw, 50); ctx.fillRect(x2, 20, bw, 50);
      SFA.draw.text(c, "Moteur", x1 + bw / 2, 38, {size:13, color:"#fff"}); SFA.draw.text(c, S.fmt(a * 100, 0) + " %", x1 + bw / 2, 56, {size:12, color:"#f4c542"});
      SFA.draw.text(c, "Dynamo", x2 + bw / 2, 38, {size:13, color:"#fff"}); SFA.draw.text(c, S.fmt(b * 100, 0) + " %", x2 + bw / 2, 56, {size:12, color:"#f4c542"});
      SFA.draw.arrow(c, x1 + bw, 45, x2, 45, P.acc, 3); P4.label(c, S.fmt(E0 * a, 0) + " J", (x1 + bw + x2) / 2, 32, P.acc);
      S.draw.line(c, x2 + bw / 2, 70, x2 + bw / 2, 110, P.green, 3); SFA.draw.arrow(c, x2 + bw / 2, 100, x2 + bw / 2, 112, P.green, 3); P4.label(c, "lampe " + S.fmt(E0 * a * b * p, 0) + " J", x2 + bw / 2 - 4, 128, P.green, "center");
      SFA.draw.arrow(c, x2 + bw / 2, 140, x1 + bw / 2, 140, P.acc, 3); S.draw.line(c, x1 + bw / 2, 140, x1 + bw / 2, 70, P.acc, 3); SFA.draw.arrow(c, x1 + bw / 2, 80, x1 + bw / 2, 70, P.acc, 3);
      P4.label(c, "retour au moteur : " + S.fmt(E0 * q, 1) + " J (au lieu de 100 J)", c.W / 2, 154, P.acc);
      S.draw.line(c, x1 + bw / 2, 70, x1 + bw / 2, 100, P.red, 3); P4.label(c, "chaleur " + S.fmt(E0 * (1 - a), 0) + " J", x1 + bw / 2 + 4, 100, P.red, "left");
      g1.clear(); var N = 40, ax = S.draw.axes(g1, {x0:0, x1:N, y0:0, y1:105, xl:"tours", yl:"énergie (J)", stepX:5, stepY:20});
      ctx = g1.ctx; ctx.save(); ctx.strokeStyle = P.acc; ctx.lineWidth = 3; ctx.beginPath(); for (var n = 0; n <= N; n++){ var yy = E0 * Math.pow(q, n); if (n) ctx.lineTo(ax.X(n), ax.Y(yy)); else ctx.moveTo(ax.X(n), ax.Y(yy)); } ctx.stroke(); ctx.restore();
      S.draw.line(g1, ax.X(0), ax.Y(100), ax.X(N), ax.Y(100), P.green, 1.5, [6, 4]); P4.label(g1, "« perpétuel » = 100 J à chaque tour", ax.X(N) - 4, ax.Y(100) + 12, P.green, "right");
      var n50 = Math.log(0.5) / Math.log(q), n1 = Math.log(0.01) / Math.log(q);
      ro.set(0, S.fmt(E0 * q, 1) + " J"); ro.set(1, S.fmt(E0 * Math.pow(q, 10), 1) + " J"); ro.set(2, S.fmt(Math.ceil(n50), 0) + " tours"); ro.set(3, S.fmt(Math.ceil(n1), 0) + " tours");
      nt.set("Facteur par tour : " + S.fmt(a, 2) + " × " + S.fmt(b, 2) + (p > 0 ? " × " + S.fmt(1 - p, 2) : "") + " = " + S.fmt(q, 3) + " < 1. Pour tourner indéfiniment, il faudrait un facteur ≥ 1 : impossible, car chaque rendement est inférieur à 1.", "warn");
    });
  }
});
})();
