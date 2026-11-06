/* Chapitre 7 · Le son */
SFA.sim({
  id: "p6-c07-generateur", ch: "c07", tag: "Classique",
  titre: "Générateur de fréquences : hauteur, intensité, note",
  resume: "La fréquence donne la hauteur, l'amplitude donne l'intensité : deux grandeurs indépendantes.",
  but: "Règle la fréquence (de 20 Hz à 20 kHz) et l'amplitude. L'écran montre toujours 4 périodes. Coche « Écouter » pour entendre le son (volume modéré).",
  aRetenir: "Un son pur est une onde sinusoïdale. Sa fréquence f (en hertz) fixe la hauteur : plus f est grande, plus le son est aigu. Son amplitude fixe l'intensité (le « volume ») : à fréquence égale, une amplitude plus grande donne un son plus fort. Dans l'air, λ = v/f avec v ≈ 340 m/s. L'oreille humaine perçoit environ de 20 Hz à 20 kHz : en dessous, ce sont des infrasons ; au-dessus, des ultrasons.",
  piege: "Fort ne veut pas dire aigu : amplitude et fréquence sont deux réglages indépendants. Doubler l'amplitude n'a aucun effet sur la note. Monter d'une octave, c'est doubler la fréquence (pas ajouter 100 Hz).",
  build: function(k, S){
    var c = k.canvas(250), P = S.draw.palette;
    var gam = k.seg("Gamme", [["1", "20 Hz à 2 kHz"], ["10", "200 Hz à 20 kHz"]], "1");
    var f = k.slider("Fréquence (× gamme)", 20, 2000, 10, 440, "Hz");
    var A = k.slider("Amplitude", 0.1, 1, 0.1, 0.6, "");
    var ear = k.toggle("Écouter (volume modéré)", false, function(on){ audio(on); });
    var ro = k.readouts(["Fréquence réelle", "Période", "Longueur d'onde dans l'air", "Note la plus proche", "Niveau relatif"]);
    var nt = k.note("", "ok");
    var ctxA = null, osc = null, gain = null, timer = null, names = ["do", "do♯", "ré", "ré♯", "mi", "fa", "fa♯", "sol", "sol♯", "la", "la♯", "si"];
    function freq(){ return f.value * parseFloat(gam.value); }
    function audio(on){
      try {
        if (on){
          if (!ctxA) ctxA = new (window.AudioContext || window.webkitAudioContext)();
          if (ctxA.resume) ctxA.resume();
          osc = ctxA.createOscillator(); gain = ctxA.createGain(); osc.type = "sine"; osc.frequency.value = freq(); gain.gain.value = 0.12 * A.value;
          osc.connect(gain); gain.connect(ctxA.destination); osc.start();
          timer = setInterval(function(){ if (!document.body.contains(c.cv)) stopA(); }, 400);
        } else stopA();
      } catch (e) { stopA(); }
    }
    function stopA(){ try { if (osc){ osc.stop(); osc.disconnect(); } if (gain) gain.disconnect(); if (ctxA){ ctxA.close(); ctxA = null; } } catch (e) {} osc = null; gain = null; if (timer){ clearInterval(timer); timer = null; } }
    k.draw(function(){
      c.clear(); var fr = freq(), T = 1 / fr, W = c.W, H = c.H;
      if (osc){ try { osc.frequency.value = fr; gain.gain.value = 0.12 * A.value; } catch (e) {} }
      var ax = S.draw.axes(c, {x0: 0, x1: 4 * T * 1000, y0: -1.2, y1: 1.2, xl: "t (ms)", yl: "amplitude", l: 50, t: 18, stepY: 0.5});
      S.draw.fn(c, ax, function(tm){ return A.value * Math.sin(2 * Math.PI * fr * tm / 1000); }, P.acc, 3);
      var n = Math.round(12 * Math.log(fr / 440) / Math.LN2), fn = 440 * Math.pow(2, n / 12), cents = 1200 * Math.log(fr / fn) / Math.LN2, midi = n + 69;
      var nom = names[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 2);
      ro.set(0, S.fmt(fr, 0) + " Hz"); ro.set(1, S.fmt(T * 1000, T < 0.001 ? 3 : 2) + " ms"); ro.set(2, 340 / fr >= 1 ? S.fmt(340 / fr, 2) + " m" : S.fmt(34000 / fr, 1) + " cm");
      ro.set(3, nom + " (" + S.fmt(fn, 1) + " Hz, " + (cents >= 0 ? "+" : "−") + S.fmt(Math.abs(cents), 0) + " cents)"); ro.set(4, S.fmt(20 * Math.log10(A.value), 1) + " dB");
      nt.set(fr < 20 ? "Infrason : inaudible." : fr > 20000 ? "Ultrason : inaudible." : fr > 16000 ? "Très aigu : beaucoup d'adultes n'entendent plus cette fréquence." : "Fréquence dans le domaine audible. Repère : la₃ = 440 Hz (diapason), do₃ ≈ 262 Hz, voix parlée ≈ 100 à 250 Hz.", fr < 20 || fr > 20000 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "p6-c07-doppler", ch: "c07", tag: "Animation · Doppler",
  titre: "Effet Doppler et mur du son",
  resume: "Une source qui se déplace : fronts d'onde serrés devant, étirés derrière ; au-delà de 340 m/s, cône de Mach. Déplace l'ambulance toi-même.",
  but: "La source (ambulance, avion) émet toujours la même fréquence f₀. Règle sa vitesse ou attrape-la et déplace-la : chaque observateur s'illumine quand un front d'onde l'atteint, et son afficheur donne la fréquence perçue. Dépasse la vitesse du son pour voir le cône de Mach.",
  aRetenir: "Si la source s'approche de l'observateur à la vitesse v_s (< v), il perçoit f' = f₀·v/(v − v_s), plus aiguë ; si elle s'éloigne, f' = f₀·v/(v + v_s), plus grave. La fréquence émise par la source, elle, ne change pas : ce sont les fronts d'onde qui se serrent ou s'étirent. À v_s > v apparaît un cône de Mach, d'angle sin α = v/v_s, avec une onde de choc (le « bang »).",
  piege: "L'ambulance ne change pas de note : elle émet toujours f₀. C'est la perception qui change. Et la formule de Doppler ne s'applique pas à v_s ≥ v : devant la source, il n'y a plus de son avant son arrivée. Dessin : fréquence d'émission très ralentie pour qu'on voie les fronts.",
  build: function(k, S){
    var c = k.canvas(340), P = S.draw.palette, Pm = window.PH6;
    var f0 = k.slider("Fréquence émise f₀", 200, 1000, 10, 500, "Hz");
    var vs = k.slider("Vitesse de la source v_s", 0, 600, 10, 100, "m/s", function(){ man = false; });
    var ro = k.readouts(["Mach (v_s/v)", "Perçue devant (observateur à droite)", "Perçue derrière (à gauche)", "Angle du cône"]);
    var nt = k.note("", "ok");
    var VS = 340, cv = 90, t = 0, ems = [], nextE = 0, xs = 40, man = false, vman = 0, lastX = 0, lastT = 0, dirS = 1, flash = [0, 0], hits = [0, 0], geo = {};
    k.button("Repartir de la gauche", function(){ reset(); }, true);
    function reset(){ t = 0; ems = []; nextE = 0; xs = 40; dirS = 1; man = false; vman = 0; }
    function Msig(){ return man ? Math.max(-3, Math.min(3, vman / cv)) : dirS * vs.value / VS; }
    var lp = k.loop(function(dt){
      var W = c.W, M = Msig(), Te = 110 / f0.value;
      if (!man){ xs += M * cv * dt; if (xs > W - 40 || xs < 40){ if (xs > W - 40) reset(); else xs = 40; } } else vman *= Math.pow(0.02, dt);
      t += dt;
      while (nextE <= t){ ems.push({x: xs, t: nextE}); nextE += Te; }
      var ox = [26, W - 26];
      ems.forEach(function(e){ var rp = cv * (t - dt - e.t), rn = cv * (t - e.t); for (var o = 0; o < 2; o++){ var dd = Math.abs(ox[o] - e.x); if (rp < dd && rn >= dd){ flash[o] = 1; hits[o] = t; } } });
      flash[0] *= Math.pow(0.02, dt); flash[1] *= Math.pow(0.02, dt);
      ems = ems.filter(function(e){ return cv * (t - e.t) < W * 1.3; });
      k.redraw();
    });
    lp.play();
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(tp, p){
      if (tp === "down"){ man = true; lastX = xs; lastT = performance.now(); vman = 0; }
      if ((tp === "down" || tp === "drag") && man){ var nx = Math.max(40, Math.min(c.W - 40, p.x)), now = performance.now(), dtt = Math.max(0.012, (now - lastT) / 1000); vman = 0.6 * vman + 0.4 * (nx - xs) / dtt; xs = nx; lastT = now; }
      if (tp === "up"){ if (Math.abs(vman) < 8) vman = 0; man = false; if (vman !== 0) dirS = vman > 0 ? 1 : -1; }
    });
    k.draw(function(){
      c.clear(); Pm.bg(c, "#f4f7fb", "#e6ecf4"); var ctx = c.ctx, W = c.W, H = c.H, cy = H * 0.42, M = Msig(), aM = Math.abs(M);
      /* route */
      ctx.fillStyle = "#cfd6e0"; ctx.fillRect(0, cy + 18, W, 30); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.moveTo(0, cy + 33); ctx.lineTo(W, cy + 33); ctx.stroke(); ctx.setLineDash([]);
      ems.forEach(function(e){ var r = cv * (t - e.t); if (r <= 0) return; ctx.beginPath(); ctx.arc(e.x, cy, r, 0, 7); ctx.strokeStyle = "rgba(31,75,158," + Math.max(0.12, 0.6 - r / (W * 1.6)) + ")"; ctx.lineWidth = 1.7; ctx.stroke(); });
      if (aM > 1){ var al = Math.asin(1 / aM), L = W * 1.2, sgn = M > 0 ? 1 : -1; ctx.strokeStyle = P.red; ctx.lineWidth = 2.6;
        [1, -1].forEach(function(s2){ ctx.beginPath(); ctx.moveTo(xs, cy); ctx.lineTo(xs - sgn * L * Math.cos(al), cy - s2 * L * Math.sin(al)); ctx.stroke(); }); }
      /* ambulance */
      var dsg = M < 0 ? -1 : 1; ctx.save(); ctx.translate(xs, cy + 22); ctx.scale(dsg, 1);
      Pm.metal(c, -24, -14, 48, 26, 5, "#f6f7f9"); ctx.fillStyle = P.red; ctx.fillRect(-24, -2, 48, 4); ctx.fillStyle = "#9cc3e8"; ctx.fillRect(10, -11, 11, 9);
      var blink = Math.floor(t * 6) % 2; ctx.fillStyle = blink ? P.red : P.blue; ctx.fillRect(-12, -18, 12, 5);
      S.draw.text({ctx: ctx}, "+", -8, -4, {size: 12, color: P.red}); ctx.restore();
      [-13, 13].forEach(function(dx){ S.draw.dot(c, xs + dx, cy + 36, 5.2, "#2a3444"); });
      Pm.glow = Pm.glow; S.draw.glow(c, xs, cy + 8, 26, blink ? P.red : P.blue, 0.3);
      S.draw.arrow(c, xs - dsg * 6, cy - 22, xs + dsg * (6 + Math.min(70, 14 + aM * 90)), cy - 22, P.ink, 2.6);
      if (!man && vs.value === 0) S.draw.label(c, "attrape l'ambulance et déplace-la", W / 2, 16, {color: P.grey, size: 11.5});
      /* observateurs */
      var fd = M < 1 ? f0.value / (1 - M) : null, fb = f0.value / (1 + M);
      if (M < 0){ fd = f0.value / (1 - M); fb = aM < 1 ? f0.value / (1 + M) : null; }
      var ox = [26, W - 26], vals = [fb, fd], names = ["derrière", "devant"];
      for (var o = 0; o < 2; o++){
        var xo = ox[o], yo = cy + 78;
        if (flash[o] > 0.05) S.draw.glow(c, xo, cy + 4, 22 + 14 * flash[o], P.green, 0.55 * flash[o]);
        S.draw.dot(c, xo, cy, 8, P.green); S.draw.line(c, xo, cy + 8, xo, cy + 52, "rgba(36,119,90,.35)", 1.5, [3, 3]);
        var txt = vals[o] === null ? "choc" : S.fmt(vals[o], 0);
        S.draw.display(c, txt, Math.max(52, Math.min(W - 52, xo + (o ? -24 : 24))), yo + 6, {w: 94, h: 46, caption: names[o] + " · Hz", size: 20});
      }
      /* f₀ source */
      S.draw.label(c, "f₀ = " + S.fmt(f0.value, 0) + " Hz (inchangée)", xs, cy - 40, {color: P.red, size: 11.5});
      var Mt = aM;
      ro.set(0, S.fmt(Mt, 2)); ro.set(1, fd === null ? "pas de son avant le passage" : S.fmt(fd, 0) + " Hz" + (M > 0.97 ? " (très aigu)" : "")); ro.set(2, fb === null ? "pas de son avant le passage" : S.fmt(fb, 0) + " Hz"); ro.set(3, Mt > 1 ? S.fmt(Math.asin(1 / Mt) * 180 / Math.PI, 1) + " °" : "—");
      nt.set(Mt < 0.97 ? (Mt < 0.01 ? "Source immobile : fronts concentriques, f perçue = f₀." : "Source subsonique : devant, les fronts se rapprochent (son plus aigu) ; derrière, ils s'écartent (son plus grave).") : Mt < 1 ? "On approche du mur du son : les fronts s'accumulent devant la source." : Mt === 1 ? "Mach 1 : les fronts s'empilent devant la source (mur du son)." : "Supersonique : la source dépasse ses propres ondes, le cône de Mach se forme.", Mt >= 1 ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "p6-c07-decibels", ch: "c07", tag: "Santé auditive",
  titre: "Niveau sonore : décibels, distance et nombre de sources",
  resume: "60 dB + 60 dB ≠ 120 dB : l'échelle logarithmique du décibel, et le temps d'exposition admissible.",
  but: "Une source émet un niveau connu à 1 m. Fais varier ce niveau, la distance et le nombre de sources identiques. Lis le niveau reçu, la durée d'exposition maximale indicative et compare aux repères.",
  aRetenir: "Niveau sonore L = 10·log(I/I₀) avec I₀ = 10⁻¹² W/m². Doubler le nombre de sources identiques ajoute seulement 3 dB ; multiplier par 10 ajoute 10 dB. En champ libre, doubler la distance retire 6 dB (L = L₁ − 20·log r). À partir d'environ 85 dB (A), le risque auditif apparaît : chaque +3 dB divise par deux la durée d'exposition tolérable.",
  piege: "Deux sources de 60 dB ne donnent pas 120 dB mais 63 dB. Le niveau en dB n'est pas proportionnel à l'intensité : +10 dB = intensité ×10. Modèle simplifié : source ponctuelle en champ libre, sans réflexion, dB assimilés à des dB(A) ; la durée limite 8 h × 2^(−(L−85)/3) est une règle indicative.",
  build: function(k, S){
    var c = k.canvas(120), g = k.canvas(220), P = S.draw.palette;
    var L1 = k.slider("Niveau d'une source à 1 m", 50, 120, 1, 90, "dB");
    var r = k.slider("Distance à la source", 1, 100, 1, 10, "m");
    var n = k.slider("Nombre de sources identiques", 1, 64, 1, 1, "");
    var ro = k.readouts(["Niveau reçu L", "Intensité I", "Intensité par rapport à 1 source à 1 m", "Durée d'exposition max (indicatif)"]);
    var nt = k.note("", "ok");
    function Lr(l1, nn, rr){ return l1 + 10 * Math.log10(nn) - 20 * Math.log10(rr); }
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, L = Lr(L1.value, n.value, r.value), lo = 0, hi = 140, x0 = 20, x1 = W - 20;
      function X(v){ return x0 + (v - lo) / (hi - lo) * (x1 - x0); }
      var zones = [[0, 60, "#9ed8b5"], [60, 85, "#f4e29a"], [85, 100, "#f6b26b"], [100, 120, "#ea8a6f"], [120, 140, "#c0392b"]];
      zones.forEach(function(z){ ctx.fillStyle = z[2]; ctx.fillRect(X(z[0]), 40, X(z[1]) - X(z[0]), 18); });
      [[0, "seuil d'audition"], [60, "conversation"], [85, "risque"], [110, "concert"], [130, "douleur"]].forEach(function(m, i){ S.draw.line(c, X(m[0]), 36, X(m[0]), 62, P.ink, 1); S.draw.text(c, m[1], Math.min(Math.max(X(m[0]), 62), W - 50), 78 + (i % 2) * 16, {size: 12}); });
      var Lc = Math.max(0, Math.min(140, L)); ctx.fillStyle = P.ink; ctx.beginPath(); ctx.moveTo(X(Lc), 62); ctx.lineTo(X(Lc) - 7, 74); ctx.lineTo(X(Lc) + 7, 74); ctx.closePath(); ctx.fill();
      S.draw.text(c, S.fmt(L, 1) + " dB", Math.min(Math.max(X(Lc), 36), W - 36), 18, {size: 16, color: P.ink});
      var I = 1e-12 * Math.pow(10, L / 10), t8 = L > 85 ? 8 * 60 * Math.pow(2, -(L - 85) / 3) : null, tx;
      if (t8 === null) tx = "pas de limite pour 8 h"; else if (t8 >= 60) tx = S.fmt(t8 / 60, 1) + " h"; else if (t8 >= 1) tx = S.fmt(t8, 0) + " min"; else tx = S.fmt(t8 * 60, 0) + " s";
      ro.set(0, S.fmt(L, 1) + " dB"); ro.set(1, I >= 0.01 ? S.fmt(I, 3) + " W/m²" : S.sci(I) + " W/m²"); ro.set(2, "× " + S.fmt(Math.pow(10, (L - L1.value) / 10), 3)); ro.set(3, tx);
      nt.set(L > 120 ? "Dangereux : seuil de la douleur, lésions possibles en quelques secondes." : L > 85 ? "Au-dessus de 85 dB : risque pour l'audition si l'exposition dure. Protège-toi ou éloigne-toi." : L < 30 ? "Très calme." : "Niveau sans danger pour une exposition normale.", L > 85 ? "warn" : "ok");
      /* graphe L(r) */
      var ax = S.draw.axes(g, {x0: 0, x1: 100, y0: 20, y1: 140, xl: "distance (m)", yl: "L (dB)", l: 50, t: 20, stepX: 20, stepY: 20});
      S.draw.line(g, ax.L, ax.Y(85), ax.R, ax.Y(85), P.red, 1.5, [6, 4]);
      S.draw.fn(g, ax, function(x){ return x < 1 ? NaN : Lr(L1.value, 1, x); }, P.grey, 2, [5, 4]);
      S.draw.fn(g, ax, function(x){ return x < 1 ? NaN : Lr(L1.value, n.value, x); }, P.acc, 3);
      S.draw.dot(g, ax.X(r.value), ax.Y(Math.max(20, Math.min(140, L))), 6, P.red);
      S.draw.text(g, (n.value === 1 ? "une seule source" : "pointillés : 1 source — trait plein : " + n.value + " sources"), ax.R - 4, ax.T + 6, {size: 12, align: "right", color: P.ink});
    });
  }
});

SFA.sim({
  id: "p6-c07-tuyau", ch: "c07", tag: "Instruments",
  titre: "Tuyau sonore : ouvert ou fermé, fondamental et harmoniques",
  resume: "Flûte, orgue, clarinette : f = n·v/(2L) pour un tuyau ouvert ; f = (2k−1)·v/(4L) pour un tuyau fermé. Étire le tuyau à la main et accorde-le.",
  but: "Choisis le type de tuyau et le mode, puis tire la poignée rouge pour changer la longueur L. Les particules d'air vibrent : ventres de déplacement aux extrémités ouvertes, nœud à l'extrémité fermée. Lance le défi pour accorder le tuyau sur une note.",
  aRetenir: "L'air du tuyau vibre en onde stationnaire. Tuyau ouvert aux deux bouts : ventre de déplacement aux deux bouts, f_n = n·v/(2L), tous les harmoniques. Tuyau fermé à un bout : nœud au bout fermé, f = (2k−1)·v/(4L), harmoniques impairs seulement, fondamental une octave plus bas. La vitesse du son dépend de la température : v ≈ 331 + 0,6·θ (m/s, θ en °C).",
  piege: "À longueur égale, le tuyau fermé est une octave plus grave que l'ouvert. Et un instrument à vent se désaccorde quand il chauffe : v augmente donc f aussi. Modèle : correction de bout négligée (en réalité l'extrémité ouverte se comporte comme un tuyau un peu plus long).",
  build: function(k, S){
    var c = k.canvas(300), P = S.draw.palette, Pm = window.PH6;
    var typ = k.seg("Tuyau", [["o", "Ouvert aux 2 bouts"], ["f", "Fermé à un bout"]], "o");
    var L = k.slider("Longueur L", 0.1, 2, 0.05, 1, "m");
    var th = k.slider("Température de l'air", -10, 40, 1, 20, "°C");
    var md = k.seg("Mode", [["1", "1er"], ["2", "2e"], ["3", "3e"]], "1");
    var goal = null, t = 0, geo = {}, NOTES = [["do₄", 261.63], ["mi₄", 329.63], ["sol₄", 392], ["la₄", 440], ["do₅", 523.25]];
    k.button("Défi : accorde le tuyau sur une note", function(){ goal = NOTES[Math.floor(Math.random() * NOTES.length)]; }, true);
    var ro = k.readouts(["Vitesse du son v", "Fréquence du mode", "Longueur d'onde du mode", "Fondamental"]);
    var nt = k.note("", "ok");
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    function noteName(f){ var NN = ["do", "do♯", "ré", "ré♯", "mi", "fa", "fa♯", "sol", "sol♯", "la", "la♯", "si"], m = Math.round(69 + 12 * Math.log(f / 440) / Math.LN2), cents = Math.round(1200 * Math.log(f / (440 * Math.pow(2, (m - 69) / 12))) / Math.LN2); return NN[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1) + (cents ? " " + (cents > 0 ? "+" : "−") + Math.abs(cents) + "¢" : ""); }
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "ew-resize";
    c.pointer(function(tp, p){ if ((tp === "down" || tp === "drag") && geo.u){ L.set(Math.round(Math.max(0.1, Math.min(2, (p.x - geo.x0) / geo.u)) / 0.05) * 0.05); } });
    k.draw(function(){
      c.clear(); Pm.bg(c); var ctx = c.ctx, W = c.W, H = c.H, v = 331.3 + 0.606 * th.value, open = typ.value === "o", j = parseInt(md.value, 10);
      var n = open ? j : 2 * j - 1, f = open ? n * v / (2 * L.value) : n * v / (4 * L.value), lam = v / f, f1 = open ? v / (2 * L.value) : v / (4 * L.value);
      var x0 = 30, uMax = W - 78, u = uMax / 2.0; geo.u = u; geo.x0 = x0;   /* px par mètre : échelle fixe pour voir la longueur changer */
      var x1 = x0 + L.value * u, cy = 84, h = 30, w = 2 * Math.PI * 0.8 * t;
      /* tube : paroi métallique et intérieur */
      var gi = ctx.createLinearGradient(0, cy - h, 0, cy + h); gi.addColorStop(0, "#eef3fb"); gi.addColorStop(1, "#dbe5f3");
      ctx.fillStyle = gi; ctx.fillRect(x0, cy - h, x1 - x0, 2 * h);
      /* densité (pression) : bandes colorées sous le tube */
      var amp = 13;
      function xi(uu){ return open ? Math.cos(n * Math.PI * uu) : Math.sin(n * Math.PI * uu / 2); }
      function dxi(uu){ return open ? -n * Math.PI * Math.sin(n * Math.PI * uu) : n * Math.PI / 2 * Math.cos(n * Math.PI * uu / 2); }
      var nb = 90; for (var a = 0; a < nb; a++){ var u0 = a / nb, pr = -dxi(u0) * Math.cos(w) * 0.34, al = Math.min(0.55, Math.abs(pr) * 0.55); ctx.fillStyle = pr > 0 ? "rgba(192,50,29," + al + ")" : "rgba(31,75,158," + al + ")"; ctx.fillRect(x0 + u0 * (x1 - x0), cy - h, (x1 - x0) / nb + 0.6, 2 * h); }
      Pm.metal(c, x0 - 2, cy - h - 7, x1 - x0 + 4, 8, 3, "#9aa6b8"); Pm.metal(c, x0 - 2, cy + h - 1, x1 - x0 + 4, 8, 3, "#9aa6b8");
      if (!open) Pm.metal(c, x0 - 10, cy - h - 7, 12, 2 * h + 16, 4, "#6b7686");
      /* particules d'air */
      for (var q = 0; q <= 44; q++){ var uq = q / 44; for (var b = -1; b <= 1; b++){ var px = x0 + uq * (x1 - x0) + amp * xi(uq) * Math.cos(w), py = cy + b * 18; ctx.fillStyle = "rgba(19,35,58,.6)"; ctx.beginPath(); ctx.arc(px, py, 2, 0, 7); ctx.fill(); } }
      /* enveloppe du déplacement */
      ctx.strokeStyle = P.green; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath();
      for (var i = 0; i <= 200; i++){ var uu = i / 200, yy = cy + h + 26 - 18 * Math.abs(xi(uu)); if (i) ctx.lineTo(x0 + uu * (x1 - x0), yy); else ctx.moveTo(x0 + uu * (x1 - x0), yy); } ctx.stroke(); ctx.setLineDash([]);
      S.draw.line(c, x0, cy + h + 26, x1, cy + h + 26, "#d5dce6", 1);
      /* ventres et nœuds */
      for (var m2 = 0; m2 <= (open ? n : n); m2++){ /* repères selon le mode */ }
      var marks = []; for (var s2 = 0; s2 <= 2 * n + 0.001; s2++){ var uu2 = open ? s2 / (2 * n) * 1 : s2 / (2 * n) * 1; if (uu2 > 1.0001) break; var isV = Math.abs(xi(uu2)) > 0.99; marks.push([uu2, isV]); }
      marks.forEach(function(mk){ S.draw.dot(c, x0 + mk[0] * (x1 - x0), cy + h + 26 - (mk[1] ? 18 : 0), 3.6, mk[1] ? P.green : P.red); });
      /* poignée de longueur */
      S.draw.arrow(c, x1 + 4, cy, x1 + 26, cy, P.red, 3); S.draw.arrow(c, x1 - 4, cy, x1 - 26, cy, P.red, 3);
      S.draw.dot(c, x1, cy, 8, P.red);
      S.draw.line(c, x0, cy - h - 20, x1, cy - h - 20, P.ink, 1.5); S.draw.line(c, x0, cy - h - 25, x0, cy - h - 15, P.ink, 1.5); S.draw.line(c, x1, cy - h - 25, x1, cy - h - 15, P.ink, 1.5);
      S.draw.label(c, "L = " + S.fmt(L.value, 2) + " m", (x0 + x1) / 2, cy - h - 20, {color: P.ink, size: 12});
      S.draw.text(c, open ? "ventre" : "nœud (fermé)", x0 + (open ? 0 : 0), cy + h + 54, {size: 11.5, color: open ? P.green : P.red, align: "left"});
      S.draw.text(c, "● ventre de déplacement   ● nœud", W - 10, cy + h + 54, {size: 11, color: P.grey, align: "right"});
      /* afficheur */
      S.draw.display(c, S.fmt(f, 0) + " Hz", 78, H - 50, {w: 128, h: 54, caption: "FRÉQUENCE · " + noteName(f), size: 22});
      if (goal){ var ok = Math.abs(f / goal[1] - 1) < 0.015; S.draw.display(c, S.fmt(goal[1], 0) + " Hz", W - 78, H - 50, {w: 128, h: 54, caption: "CIBLE · " + goal[0], size: 22, color: ok ? P.green : P.ink}); }
      var harm = []; for (var qq = 1; qq <= 4; qq++) harm.push(S.fmt(open ? qq * f1 : (2 * qq - 1) * f1, 0));
      ro.set(0, S.fmt(v, 1) + " m/s"); ro.set(1, S.fmt(f, 1) + " Hz (n = " + n + ")"); ro.set(2, S.fmt(lam, 3) + " m"); ro.set(3, S.fmt(f1, 1) + " Hz");
      if (goal){ var ok2 = Math.abs(f / goal[1] - 1) < 0.015; nt.set("<b>Défi :</b> joue " + goal[0] + " (" + S.fmt(goal[1], 0) + " Hz) à 1,5 % près. " + (ok2 ? "Accordé : L = " + S.fmt(L.value, 2) + " m en " + (open ? "tuyau ouvert" : "tuyau fermé") + ", mode " + md.value + "." : "Pour l'instant : " + S.fmt(f, 0) + " Hz. Astuce : f = n·v/(2L) (ouvert) ou n·v/(4L) (fermé)."), ok2 ? "ok" : "warn"); }
      else nt.set("Quatre premiers modes de ce tuyau : " + harm.join(" ; ") + " Hz." + (open ? "" : " (harmoniques impairs seulement)"), "ok");
    });
  }
});

