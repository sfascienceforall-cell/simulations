/* Chapitre 1 · Neurone, influx nerveux et système nerveux */
(function(){
var REST = -70, THR = -55;
/* forme du potentiel d'action (modèle simplifié), t en ms depuis le franchissement du seuil */
function ap(t){
  if (t < 0) return null;
  if (t < 0.7) return THR + 95 * Math.sin(Math.PI / 2 * t / 0.7);
  if (t < 2.0) return 40 - 120 * (1 - Math.cos(Math.PI * (t - 0.7) / 1.3)) / 2;
  return REST - 10 * Math.exp(-(t - 2.0) / 1.0);
}
function trace(I, t){            /* réponse à un stimulus bref d'intensité I (mV de dépolarisation) à t = 0 */
  if (t < 0) return REST;
  if (I < 15) return REST + I * (t < 0.4 ? t / 0.4 : Math.exp(-(t - 0.4) / 2));
  var tc = 15 * 0.4 / I;
  if (t < tc) return REST + I * t / 0.4;
  return ap(t - tc);
}

SFA.sim({
  id: "b5-c01-seuil", ch: "c01", tag: "Classique",
  titre: "Seuil et loi du tout-ou-rien",
  resume: "Intensité du stimulus → potentiel d'action ou simple réponse locale.",
  but: "Augmente l'intensité du stimulus appliqué à l'axone. Observe à partir de quelle valeur un potentiel d'action apparaît, puis compare la hauteur du potentiel d'action pour deux stimuli très différents. En mode « soutenu », observe ce qui change.",
  aRetenir: "Sous le seuil (−55 mV ici), la réponse est locale et s'éteint. Au-dessus, le potentiel d'action a toujours la même amplitude (tout-ou-rien). Une stimulation plus forte se traduit par une plus grande fréquence de potentiels d'action, pas par un potentiel plus grand.",
  piege: "« Un stimulus plus fort donne un potentiel plus grand » est faux : l'amplitude est fixe, c'est la fréquence qui code l'intensité.",
  build: function(k, S){
    var c = k.canvas(300), pal = S.draw.palette;
    var mode = k.seg("Stimulus", [["b", "Bref"], ["s", "Soutenu (60 ms)"]], "b");
    var I = k.slider("Intensité du stimulus (dépolarisation)", 0, 40, 1, 8, "mV");
    var ro = k.readouts(["Potentiel atteint", "Potentiel d'action ?", "Amplitude du PA", "Fréquence"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var soutenu = mode.value === "s", T = soutenu ? 60 : 8, i = I.value;
      var ax = S.draw.axes(c, {x0: 0, x1: T, y0: -90, y1: 50, xl: "t (ms)", yl: "V (mV)", stepY: 20, stepX: soutenu ? 10 : 1});
      S.draw.line(c, ax.X(0), ax.Y(THR), ax.X(T), ax.Y(THR), pal.red, 1.5, [6, 4]);
      S.draw.text(c, "seuil −55", ax.X(T) - 4, ax.Y(THR) - 9, {color: pal.red, size: 12, align: "right"});
      S.draw.text(c, "repos −70", ax.X(T) - 4, ax.Y(REST) + 10, {color: pal.grey, size: 12, align: "right"});
      var pts = [], vmax = REST, f = 0, n = 0;
      if (!soutenu){
        for (var t = 0; t <= T; t += 0.05){ var v = trace(i, t); pts.push([t, v]); if (v > vmax) vmax = v; }
        f = i >= 15 ? 1 : 0;
      } else {
        f = i < 15 ? 0 : Math.min(400, 20 + 8 * (i - 15));     /* Hz, modèle simplifié */
        var per = f ? 1000 / f : 1e9;
        for (var tt = 0; tt <= T; tt += 0.1){
          var v2 = REST; if (f){ var a1 = ap(tt % per); v2 = a1 === null ? REST : a1; }
          pts.push([tt, v2]); if (v2 > vmax) vmax = v2;
        }
        n = f ? Math.floor(T / per + 1e-9) + 1 : 0;
      }
      B5.poly(c, ax, pts, pal.violet, 2.6);
      var ok = i >= 15;
      ro.set(0, S.fmt(soutenu && ok ? 40 : vmax, 0) + " mV");
      ro.set(1, ok ? "oui" : "non");
      ro.set(2, ok ? "110 mV (toujours)" : (i ? S.fmt(i, 0) + " mV (local)" : "0"));
      ro.set(3, soutenu ? (ok ? S.fmt(f, 0) + " Hz (≈ " + n + " PA en 60 ms)" : "0 Hz") : (ok ? "1 PA" : "0 PA"));
      if (!ok) nt.set(i === 0 ? "Aucun stimulus : le neurone reste au repos (−70 mV)." : "Dépolarisation de " + S.fmt(i, 0) + " mV < 15 mV : on n'atteint pas −55 mV, la réponse locale s'éteint sans se propager.", i ? "warn" : "");
      else nt.set(soutenu ? "Chaque potentiel d'action culmine à +40 mV. À 40 mV de stimulus on a " + S.fmt(f, 0) + " Hz contre 20 Hz au seuil : seule la fréquence change." : "Seuil franchi : un potentiel d'action de 110 mV (de −70 à +40 mV). Essaie 16 puis 40 mV : même hauteur.", "ok");
    });
  }
});

/* ---------- vitesse de conduction ---------- */
function vUnmy(d){ return 1.1 * Math.sqrt(d); }      /* m/s, d en µm (ordre de grandeur) */
function vMy(d){ return 6 * d; }                      /* m/s, d = diamètre total de la fibre en µm */
SFA.sim({
  id: "b5-c01-myeline", ch: "c01", tag: "Course",
  titre: "Course d'influx : fibre myélinisée ou non",
  resume: "Diamètre, longueur, myéline → vitesse et temps de trajet de l'influx.",
  but: "Deux fibres de même diamètre et de même longueur : l'une est nue, l'autre myélinisée. Envoie l'influx (au ralenti) et compare les temps réels. Modifie le diamètre et la longueur.",
  aRetenir: "La myéline isole l'axone : le potentiel d'action « saute » de nœud de Ranvier en nœud de Ranvier (conduction saltatoire). Pour un même diamètre, c'est bien plus rapide : v ≈ 6 m/s par µm de diamètre (fibre myélinisée) contre v ≈ 1,1·√d (fibre nue). Une fibre plus grosse conduit plus vite.",
  piege: "L'influx n'est pas un courant électrique dans un fil (qui irait à plus de 10⁸ m/s) : c'est une onde de potentiel d'action qui se régénère le long de la membrane. Valeurs : ordres de grandeur d'un modèle simplifié.",
  build: function(k, S){
    var c = k.canvas(250), pal = S.draw.palette;
    var d = k.slider("Diamètre de la fibre", 1, 20, 0.5, 10, "µm");
    var L = k.slider("Longueur du trajet", 0.1, 1.5, 0.1, 1, "m");
    var ro = k.readouts(["v fibre nue", "v fibre myélinisée", "Temps (nue)", "Temps (myélinisée)"]);
    var nt = k.note("", "");
    var tt = 0, run = false, slow = 1;
    function tims(){ return {a: L.value / vUnmy(d.value), b: L.value / vMy(d.value)}; }
    var lp = k.loop(function(dt){ tt += dt; var T = tims(); if (tt > Math.max(T.a, T.b) * slow + 0.5){ lp.pause(); run = false; } k.redraw(); });
    k.button("Envoyer l'influx (au ralenti)", function(){ var T = tims(); slow = 4 / Math.max(T.a, T.b); tt = 0; run = true; lp.play(); }, true);
    k.draw(function(){
      c.clear();
      var T = tims(), x0 = 40, x1 = c.W - 20, W = x1 - x0, ctx = c.ctx;
      function fibre(y, my){
        var th = my ? 14 : 8;
        ctx.fillStyle = "#c9b8ea"; ctx.fillRect(x0, y - 3, W, 6);
        if (my){
          var n = 12; for (var i = 0; i < n; i++){ var a = x0 + W * i / n + 3, w = W / n - 8; ctx.fillStyle = "#f4c542"; ctx.fillRect(a, y - th / 2, w, th); ctx.strokeStyle = "#B45309"; ctx.strokeRect(a, y - th / 2, w, th); }
        }
      }
      S.draw.text(c, "Fibre nue (sans myéline)", x0, 28, {align: "left", size: 13, color: pal.ink});
      fibre(62, false);
      S.draw.text(c, "Fibre myélinisée (nœuds de Ranvier entre les manchons)", x0, 128, {align: "left", size: 13, color: pal.ink});
      fibre(162, true);
      var ta = Math.min(tt / slow, T.a), tb = Math.min(tt / slow, T.b);
      if (run || tt > 0){
        var pa = x0 + W * ta / T.a, pb = x0 + W * tb / T.b;
        B5.circ(c, pa, 62, 11, "rgba(180,35,24,.85)");
        var nodes = 12, ib = Math.min(nodes, Math.floor((pb - x0) / (W / nodes) + 1e-9)), nb = x0 + W * ib / nodes;
        B5.circ(c, Math.min(nb + 1, x1), 162, 11, "rgba(180,35,24,.85)");
        if (tb >= T.b) S.draw.text(c, "arrivée", x1 - 4, 190, {align: "right", color: pal.green, size: 12});
        if (ta >= T.a) S.draw.text(c, "arrivée", x1 - 4, 90, {align: "right", color: pal.green, size: 12});
      }
      S.draw.text(c, "départ", x0, 226, {align: "left", size: 12, color: pal.grey}); S.draw.text(c, "arrivée (" + S.fmt(L.value, 1) + " m)", x1, 226, {align: "right", size: 12, color: pal.grey});
      ro.set(0, S.fmt(vUnmy(d.value), 1) + " m/s"); ro.set(1, S.fmt(vMy(d.value), 0) + " m/s");
      ro.set(2, T.a >= 1 ? S.fmt(T.a, 2) + " s" : S.fmt(T.a * 1000, 0) + " ms");
      ro.set(3, S.fmt(T.b * 1000, 0) + " ms");
      nt.set("Rapport des vitesses : fibre myélinisée ≈ " + S.fmt(vMy(d.value) / vUnmy(d.value), 0) + " × plus rapide. Animation ralentie ×" + S.fmt(slow, 0) + " (temps réels dans les cases).", "ok");
    });
  }
});

/* ---------- période réfractaire ---------- */
function thr2(dt){ return dt < 2 ? Infinity : 15 + 60 * Math.exp(-(dt - 2) / 2); }   /* seuil du 2e stimulus (mV) */
SFA.sim({
  id: "b5-c01-refractaire", ch: "c01", tag: "Oscilloscope",
  titre: "Deux stimuli : période réfractaire",
  resume: "Écart entre deux stimuli → le deuxième déclenche-t-il un potentiel d'action ?",
  but: "Deux stimuli sont appliqués au même point de l'axone. Règle l'écart Δt et l'intensité du second. Cherche le plus petit écart pour lequel un second potentiel d'action est possible, puis la fréquence maximale du neurone.",
  aRetenir: "Juste après un potentiel d'action, les canaux Na⁺ sont inactivés : période réfractaire absolue (≈ 2 ms ici), aucun stimulus ne déclenche de PA. Ensuite vient la période réfractaire relative : il faut un stimulus plus fort que d'habitude. Cela impose une fréquence maximale (≈ 1/2 ms = 500 Hz) et force l'influx à avancer dans un seul sens.",
  piege: "La période réfractaire n'est pas de la fatigue du neurone : c'est l'état des canaux ioniques juste après le PA. Valeurs d'un modèle simplifié.",
  build: function(k, S){
    var c1 = k.canvas(190), c2 = k.canvas(190), pal = S.draw.palette;
    var dt = k.slider("Écart Δt entre les deux stimuli", 0.5, 12, 0.5, 6, "ms");
    var I2 = k.slider("Intensité du 2e stimulus", 10, 60, 1, 20, "mV");
    var ro = k.readouts(["Seuil du 2e stimulus", "2e PA ?", "Fréquence max."]);
    var nt = k.note("", "");
    k.draw(function(){
      var d = dt.value, i2 = I2.value, th = thr2(d), ok = i2 >= th;
      c1.clear();
      var ax = S.draw.axes(c1, {x0: 0, x1: 12, y0: 0, y1: 80, xl: "Δt (ms)", yl: "seuil du 2e stimulus (mV)", stepX: 1, stepY: 20});
      var pts = []; for (var x = 2; x <= 12; x += 0.1) pts.push([x, thr2(x)]);
      B5.poly(c1, ax, pts, pal.violet, 2.6);
      c1.ctx.fillStyle = "rgba(138,42,26,.12)"; c1.ctx.fillRect(ax.X(0), ax.T, ax.X(2) - ax.X(0), ax.B - ax.T);
      S.draw.text(c1, "absolue", ax.X(1), ax.T + 14, {size: 12, color: pal.red});
      S.draw.text(c1, "relative", ax.X(4.2), ax.T + 14, {size: 12, color: pal.amber});
      S.draw.dot(c1, ax.X(d), ax.Y(i2), 7, ok ? pal.green : pal.red);
      c2.clear();
      var ax2 = S.draw.axes(c2, {x0: -1, x1: 16, y0: -90, y1: 50, xl: "t (ms)", yl: "V (mV)", stepY: 40, stepX: 2});
      S.draw.line(c2, ax2.X(-1), ax2.Y(THR), ax2.X(16), ax2.Y(THR), pal.red, 1.2, [5, 4]);
      var p2 = [], tc1 = 15 * 0.4 / 40, tcc = 15 * 0.4 / i2;
      for (var t = 0; t <= 16; t += 0.05){
        var v = t < tc1 ? REST + 40 * t / 0.4 : ap(t - tc1);
        if (t >= d){
          var s2 = t - d;
          if (ok) v = s2 < tcc ? v + i2 * s2 / 0.4 : ap(s2 - tcc);
          else v = v + Math.min(i2, 14) * (s2 < 0.4 ? s2 / 0.4 : Math.exp(-(s2 - 0.4) / 2));
        }
        p2.push([t, v]);
      }
      B5.poly(c2, ax2, p2, pal.violet, 2.4);
      S.draw.text(c2, "stimulus 1", ax2.X(0) + 4, ax2.B - 8, {align: "left", size: 12, color: pal.grey});
      S.draw.text(c2, "stimulus 2", ax2.X(d) + 4, ax2.B - 22, {align: "left", size: 12, color: pal.grey});
      ro.set(0, isFinite(th) ? S.fmt(th, 0) + " mV" : "impossible"); ro.set(1, ok ? "oui" : "non"); ro.set(2, "≈ 500 Hz");
      if (d < 2) nt.set("Période réfractaire absolue (Δt < 2 ms) : quelle que soit l'intensité, pas de second PA.", "warn");
      else if (ok) nt.set("Période réfractaire relative : le seuil vaut " + S.fmt(th, 0) + " mV et ton stimulus (" + S.fmt(i2, 0) + " mV) le dépasse : second PA.", "ok");
      else nt.set("Seuil encore relevé à " + S.fmt(th, 0) + " mV : ton stimulus de " + S.fmt(i2, 0) + " mV est insuffisant. Augmente l'intensité ou l'écart.", "warn");
    });
  }
});

/* ---------- anesthésique local / sclérose en plaques ---------- */
SFA.sim({
  id: "b5-c01-blocage", ch: "c01", tag: "Santé",
  titre: "Quand l'influx est bloqué : anesthésique et sclérose en plaques",
  resume: "Canaux Na⁺ bloqués ou myéline abîmée → influx affaibli, ralenti ou arrêté.",
  but: "Choisis la cause. Augmente l'atteinte et observe l'amplitude du potentiel d'action dans la zone touchée, le temps de trajet vers l'encéphale et le moment où le signal n'arrive plus (douleur supprimée ou perte de fonction).",
  aRetenir: "Un anesthésique local bloque les canaux Na⁺ : sans entrée de Na⁺, pas de dépolarisation, donc pas de PA, donc pas de message de douleur. Dans la sclérose en plaques, la myéline est détruite par plaques : l'influx ralentit puis se bloque.",
  piege: "L'anesthésique ne « supprime pas la douleur » : il empêche le message de partir. Le récepteur de douleur est stimulé, mais aucun PA n'arrive à l'encéphale. Modèle très simplifié, valeurs indicatives.",
  build: function(k, S){
    var c = k.canvas(280), pal = S.draw.palette;
    var cause = k.seg("Cause", [["an", "Anesthésique local"], ["ms", "Sclérose en plaques"]], "an");
    var a = k.slider("Atteinte (dose d'anesthésique ou fibre démyélinisée)", 0, 100, 5, 0, "%");
    var ro = k.readouts(["Atteinte", "Amplitude du PA", "Temps de trajet", "Message arrivé ?"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var ctx = c.ctx, an = cause.value === "an", v = a.value;
      var x0 = 30, x1 = c.W - 30, W = x1 - x0;
      var b, amp, time, ok, lab;
      var vm = vMy(10), Ltot = 1;                 /* fibre de 10 µm, trajet de 1 m */
      if (an){
        var C = v / 100 * 12; b = C / (C + 1.5); amp = 110 * (1 - b); ok = amp >= 15;
        time = ok ? Ltot / vm * (1 + 0.1 * b / (1 - b + 0.05)) : Infinity; lab = S.fmt(100 * b, 0) + " % des canaux Na⁺ bloqués";
      } else {
        var x = v / 100; b = x; amp = 110; ok = x < 0.8;
        time = ok ? Ltot / vm * (1 + x * (1 / 0.35 - 1)) : Infinity; lab = S.fmt(100 * x, 0) + " % de la fibre démyélinisée";
      }
      S.draw.text(c, "Nocicepteur (peau)  →  fibre sensitive  →  moelle / encéphale", c.W / 2, 22, {size: 13});
      var y = 100;
      ctx.fillStyle = "#c9b8ea"; ctx.fillRect(x0, y - 4, W, 8);
      var n = 12;
      for (var i = 0; i < n; i++){
        var xa = x0 + W * i / n + 3, w = W / n - 8, seg = (i + 0.5) / n, hit = an ? (seg > 0.4 && seg < 0.6) : (seg < b);
        ctx.fillStyle = hit ? (an ? "#e8b4ac" : "#d9dde3") : "#f4c542"; ctx.fillRect(xa, y - 9, w, 18);
        ctx.strokeStyle = hit ? pal.red : "#B45309"; ctx.strokeRect(xa, y - 9, w, 18);
      }
      if (an){ S.draw.text(c, "zone injectée", x0 + W * 0.5, y + 34, {size: 12, color: pal.red}); }
      else { S.draw.text(c, "manchons de myéline détruits (gris)", x0 + W * 0.3, y + 34, {size: 12, color: pal.grey}); }
      B5.circ(c, x0 - 4, y, 7, pal.red); S.draw.text(c, "stimulus", x0 + 4, y - 26, {align: "left", size: 12, color: pal.red});
      B5.circ(c, x1 + 2, y, 7, ok ? pal.green : pal.grey); S.draw.text(c, ok ? "reçu" : "rien", x1 - 2, y - 26, {align: "right", size: 12, color: ok ? pal.green : pal.grey});
      /* jauge d'amplitude */
      S.draw.text(c, "Amplitude du potentiel d'action dans la zone touchée", x0, 170, {align: "left", size: 12});
      B5.bar(c, x0, 182, W, 16, amp / 110, ok ? pal.violet : pal.red);
      var tx = x0 + W * 15 / 110; S.draw.line(c, tx, 176, tx, 204, pal.red, 1.5, [4, 3]); S.draw.text(c, "minimum pour se propager (15 mV)", tx + 4, 216, {align: "left", size: 12, color: pal.red});
      S.draw.text(c, "temps : " + (isFinite(time) ? S.fmt(time * 1000, 0) + " ms" : "∞"), x0, 250, {align: "left", size: 13, color: pal.ink});
      ro.set(0, lab); ro.set(1, S.fmt(amp, 0) + " mV"); ro.set(2, isFinite(time) ? S.fmt(time * 1000, 0) + " ms" : "pas d'arrivée"); ro.set(3, ok ? "oui" : "non");
      nt.set(ok ? (v === 0 ? "Fibre saine : 17 ms pour 1 m (fibre myélinisée de 10 µm)." : "Le signal passe encore, " + (an ? "avec une marge de sécurité réduite." : "mais il est ralenti.")) : (an ? "Trop de canaux bloqués : l'amplitude (" + S.fmt(amp, 0) + " mV) est sous le minimum, le PA ne se propage plus : pas de douleur ressentie." : "Plus de 80 % de la fibre est démyélinisée : bloc de conduction, perte de la fonction commandée par cette fibre."), ok ? "ok" : "warn");
    });
  }
});
})();
