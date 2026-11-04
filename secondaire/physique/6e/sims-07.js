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
  resume: "Une source qui se déplace : fronts d'onde serrés devant, étirés derrière ; au-delà de 340 m/s, cône de Mach.",
  but: "La source (ambulance, avion) émet toujours la même fréquence f₀. Règle sa vitesse : compare la fréquence perçue devant et derrière. Dépasse la vitesse du son pour voir le cône de Mach.",
  aRetenir: "Si la source s'approche de l'observateur à la vitesse v_s (< v), il perçoit f' = f₀·v/(v − v_s), plus aiguë ; si elle s'éloigne, f' = f₀·v/(v + v_s), plus grave. La fréquence émise par la source, elle, ne change pas : ce sont les fronts d'onde qui se serrent ou s'étirent. À v_s > v apparaît un cône de Mach, d'angle sin α = v/v_s, avec une onde de choc (le « bang »).",
  piege: "L'ambulance ne change pas de note : elle émet toujours f₀. C'est la perception qui change. Et la formule de Doppler ne s'applique pas à v_s ≥ v : devant la source, il n'y a plus de son avant son arrivée. Dessin : fréquence d'émission très ralentie pour qu'on voie les fronts.",
  build: function(k, S){
    var c = k.canvas(280), P = S.draw.palette;
    var f0 = k.slider("Fréquence émise f₀", 200, 1000, 10, 500, "Hz");
    var vs = k.slider("Vitesse de la source v_s", 0, 600, 10, 100, "m/s", function(){ reset(); });
    var ro = k.readouts(["Mach (v_s/v)", "Perçue devant (observateur à droite)", "Perçue derrière (à gauche)", "Angle du cône"]);
    var nt = k.note("", "ok");
    var VS = 340, cv = 90, t = 0, ems = [], nextE = 0;
    function reset(){ t = 0; ems = []; nextE = 0; }
    var lp = k.loop(function(dt){
      var M = vs.value / VS, spd = M * cv, x0 = 40, W = c.W;
      t += dt; var xs = x0 + spd * t;
      if (xs > W - 40){ reset(); return; }
      while (nextE <= t){ ems.push({x: x0 + spd * nextE, t: nextE}); nextE += 0.22; }
      ems = ems.filter(function(e){ return cv * (t - e.t) < c.W * 1.5; });   /* fronts devenus trop grands : inutile de les garder (source immobile) */
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, cy = H / 2, M = vs.value / VS, spd = M * cv, xs = 40 + spd * t;
      ctx.fillStyle = "#f3f5f9"; ctx.fillRect(0, cy + 40, W, 6);
      ems.forEach(function(e){
        var r = cv * (t - e.t); if (r <= 0) return;
        ctx.beginPath(); ctx.arc(e.x, cy, r, 0, 7); ctx.strokeStyle = "rgba(30,63,143,.5)"; ctx.lineWidth = 1.6; ctx.stroke();
      });
      if (M > 1){ var al = Math.asin(1 / M), L = 400; ctx.strokeStyle = P.red; ctx.lineWidth = 2.4;
        [1, -1].forEach(function(s){ ctx.beginPath(); ctx.moveTo(xs, cy); ctx.lineTo(xs - L * Math.cos(al), cy - s * L * Math.sin(al)); ctx.stroke(); }); }
      /* source */
      ctx.fillStyle = P.red; ctx.fillRect(xs - 16, cy - 10, 32, 20); S.draw.dot(c, xs + 8, cy + 11, 4, P.ink); S.draw.dot(c, xs - 8, cy + 11, 4, P.ink);
      S.draw.arrow(c, xs + 24, cy - 24, xs + 24 + Math.min(70, 20 + spd * 0.5), cy - 24, P.ink, 2.5);
      /* observateurs */
      function obs(x, lab, val){ S.draw.dot(c, x, cy + 70, 8, P.green); S.draw.text(c, lab, x, cy + 90, {size: 12, color: P.green}); S.draw.text(c, val, x, cy + 108, {size: 13, color: P.ink}); }
      var fd = M < 1 ? f0.value / (1 - M) : null, fb = f0.value / (1 + M);
      obs(34, "derrière", S.fmt(fb, 0) + " Hz"); obs(W - 40, "devant", M < 1 ? S.fmt(fd, 0) + " Hz" : (M >= 0.97 ? "choc" : ""));
      ro.set(0, S.fmt(M, 2)); ro.set(1, M < 0.97 ? S.fmt(fd, 0) + " Hz" : M < 1 ? S.fmt(fd, 0) + " Hz (très aigu)" : "pas de son avant le passage"); ro.set(2, S.fmt(fb, 0) + " Hz"); ro.set(3, M > 1 ? S.fmt(Math.asin(1 / M) * 180 / Math.PI, 1) + " °" : "—");
      nt.set(M < 0.97 ? (M === 0 ? "Source immobile : fronts concentriques, f perçue = f₀." : "Source subsonique : devant, les fronts se rapprochent (son plus aigu) ; derrière, ils s'écartent (son plus grave).") : M < 1 ? "On approche du mur du son : les fronts s'accumulent devant la source." : M === 1 ? "Mach 1 : les fronts s'empilent devant la source (mur du son)." : "Supersonique : la source dépasse ses propres ondes, le cône de Mach se forme.", M >= 1 ? "warn" : "ok");
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
  resume: "Flûte, orgue, clarinette : f = n·v/(2L) pour un tuyau ouvert ; f = (2k−1)·v/(4L) pour un tuyau fermé.",
  but: "Choisis le type de tuyau, sa longueur, la température de l'air et le mode. L'onde stationnaire de déplacement de l'air est dessinée : ventres aux extrémités ouvertes, nœud à l'extrémité fermée.",
  aRetenir: "L'air du tuyau vibre en onde stationnaire. Tuyau ouvert aux deux bouts : ventre de déplacement aux deux bouts, f_n = n·v/(2L), tous les harmoniques. Tuyau fermé à un bout : nœud au bout fermé, f = (2k−1)·v/(4L), harmoniques impairs seulement, fondamental une octave plus bas. La vitesse du son dépend de la température : v ≈ 331 + 0,6·θ (m/s, θ en °C).",
  piege: "À longueur égale, le tuyau fermé est une octave plus grave que l'ouvert. Et un instrument à vent se désaccorde quand il chauffe : v augmente donc f aussi. Modèle : correction de bout négligée (en réalité l'extrémité ouverte se comporte comme un tuyau un peu plus long).",
  build: function(k, S){
    var c = k.canvas(220), P = S.draw.palette;
    var typ = k.seg("Tuyau", [["o", "Ouvert aux 2 bouts"], ["f", "Fermé à un bout"]], "o");
    var L = k.slider("Longueur L", 0.1, 2, 0.05, 0.5, "m");
    var th = k.slider("Température de l'air", -10, 40, 1, 20, "°C");
    var md = k.seg("Mode", [["1", "1er"], ["2", "2e"], ["3", "3e"]], "1");
    var ro = k.readouts(["Vitesse du son v", "Fréquence du mode", "Longueur d'onde du mode", "Fondamental"]);
    var nt = k.note("", "ok");
    var t = 0;
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, v = 331.3 + 0.606 * th.value, open = typ.value === "o", j = parseInt(md.value, 10);
      var n = open ? j : 2 * j - 1, f = open ? n * v / (2 * L.value) : n * v / (4 * L.value), lam = v / f, f1 = open ? v / (2 * L.value) : v / (4 * L.value);
      var x0 = 50, x1 = W - 50, cy = H / 2 - 4, h = 46, w = 2 * Math.PI * 0.8 * t;
      ctx.fillStyle = "#e9eef6"; ctx.fillRect(x0, cy - h, x1 - x0, 2 * h);
      ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, cy - h); ctx.lineTo(x1, cy - h); ctx.moveTo(x0, cy + h); ctx.lineTo(x1, cy + h); ctx.stroke();
      if (!open){ ctx.fillStyle = P.ink; ctx.fillRect(x0 - 8, cy - h, 8, 2 * h); }
      /* particules d'air : déplacement ξ(x) */
      var amp = 16;
      function xi(u){ return open ? Math.cos(n * Math.PI * u) : Math.sin(n * Math.PI * u / 2); }   /* u = x/L ∈ [0,1] ; fermé : nœud en u = 0 */
      for (var a = 0; a <= 40; a++){ var u = a / 40; for (var b = -3; b <= 3; b++){         var px = x0 + u * (x1 - x0) + amp * xi(u) * Math.cos(w), py = cy + b * 14; ctx.fillStyle = "rgba(30,63,143,.55)"; ctx.fillRect(px - 1.5, py - 1.5, 3, 3); } }
      /* enveloppe du déplacement */
      ctx.strokeStyle = P.red; ctx.lineWidth = 1.8; ctx.setLineDash([5, 4]);
      ctx.beginPath(); for (var i = 0; i <= 200; i++){ var uu = i / 200, yy = cy - h - 12 - 12 * Math.abs(xi(uu)); if (i) ctx.lineTo(x0 + uu * (x1 - x0), yy); else ctx.moveTo(x0 + uu * (x1 - x0), yy); } ctx.stroke(); ctx.setLineDash([]);
      S.draw.text(c, open ? "ventre" : "nœud (bout fermé)", x0, cy + h + 20, {size: 12, color: open ? P.green : P.red, align: "center"});
      S.draw.text(c, "ventre", x1, cy + h + 20, {size: 12, color: P.green});
      S.draw.text(c, "L = " + S.fmt(L.value, 2) + " m", (x0 + x1) / 2, cy + h + 20, {size: 12});
      var harm = []; for (var q = 1; q <= 4; q++) harm.push(S.fmt(open ? q * f1 : (2 * q - 1) * f1, 0));
      ro.set(0, S.fmt(v, 1) + " m/s"); ro.set(1, S.fmt(f, 1) + " Hz (n = " + n + ")"); ro.set(2, S.fmt(lam, 3) + " m"); ro.set(3, S.fmt(f1, 1) + " Hz");
      nt.set("Quatre premiers modes de ce tuyau : " + harm.join(" ; ") + " Hz." + (open ? "" : " (harmoniques impairs seulement)"), "ok");
    });
  }
});
