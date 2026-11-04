/* Chapitre 3 · Induction électromagnétique */
SFA.sim({
  id: "p6-c03-aimant-bobine", ch: "c03", tag: "Classique",
  titre: "Un aimant traverse une bobine : la tension induite",
  resume: "e = −N·ΔΦ/Δt : pas de variation de flux, pas de tension. Compare flux et tension au cours du passage.",
  but: "L'aimant traverse la bobine à vitesse constante. En haut, le flux Φ(t) ; en bas, la tension e(t) = −N·dΦ/dt. Change N, la vitesse, le pôle en tête, ou immobilise l'aimant dans la bobine.",
  aRetenir: "Loi de Faraday : e = −N·dΦ/dt. La tension dépend de la vitesse de variation du flux, pas du flux lui-même : elle est maximale là où Φ(t) change le plus vite (pente maximale) et nulle quand Φ est maximal ou constant. Doubler N ou doubler la vitesse double la tension.",
  piege: "Un aimant immobile dans la bobine, même très puissant, n'induit aucune tension : le flux est grand mais constant. Et la tension change de signe pendant le passage : d'abord le flux augmente, ensuite il diminue. Modèle simplifié : aimant ponctuel (dipôle) sur l'axe de la bobine.",
  build: function(k, S){
    var c = k.canvas(250), g = k.canvas(280), P = S.draw.palette;
    var N = k.slider("Nombre de spires N", 50, 500, 50, 200, "");
    var v = k.slider("Vitesse de l'aimant", 0.1, 2, 0.1, 1, "m/s");
    var pole = k.seg("Pôle en tête", [["N", "Nord"], ["S", "Sud"]], "N");
    var rest = k.toggle("Aimant immobile au centre de la bobine", false);
    var ro = k.readouts(["Flux maximal", "Tension max (valeur absolue)", "Tension à l'instant"]);
    var PHI0 = 100e-6, a = 0.02, Z = 0.12;   /* Wb, m, m */
    function phi(z){ return PHI0 * Math.pow(a * a / (a * a + z * z), 1.5); }
    function dphi(z){ return -3 * z * PHI0 * Math.pow(a, 3) / Math.pow(a * a + z * z, 2.5); }
    var tau = 0, Dv = 3;
    var lp = k.loop(function(dt){ tau += dt; if (tau > Dv + 0.5) tau = 0; k.redraw(); });
    lp.play();
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, H = c.H, cy = H / 2;
      var sg = pole.value === "N" ? 1 : -1, tTot = 2 * Z / v.value; Dv = Math.max(1.8, Math.min(4, tTot));
      var u = Math.min(1, tau / Dv), z = rest.value ? 0 : -Z + 2 * Z * u, tReal = u * tTot;
      var cxB = W / 2, px = 150, zx = cxB + z / Z * (W / 2 - 60);
      /* bobine */
      ctx.strokeStyle = P.amber; ctx.lineWidth = 3;
      for (var j = -3; j <= 3; j++){ ctx.beginPath(); ctx.ellipse(cxB + j * 7, cy, 9, 46, 0, 0, 7); ctx.stroke(); }
      /* aimant */
      var mw = 70, mh = 28;
      ctx.fillStyle = sg > 0 ? P.red : P.acc; ctx.fillRect(zx, cy - mh / 2, mw / 2, mh);
      ctx.fillStyle = sg > 0 ? P.acc : P.red; ctx.fillRect(zx - mw / 2, cy - mh / 2, mw / 2, mh);
      ctx.strokeStyle = P.ink; ctx.lineWidth = 1.5; ctx.strokeRect(zx - mw / 2, cy - mh / 2, mw, mh);
      S.draw.text(c, sg > 0 ? "N" : "S", zx + mw / 4, cy, {color: "#fff", size: 14});
      S.draw.text(c, sg > 0 ? "S" : "N", zx - mw / 4, cy, {color: "#fff", size: 14});
      if (!rest.value) S.draw.arrow(c, zx - 20, cy - 52, zx + 30, cy - 52, P.ink, 2);
      /* ampoule : luminosité ∝ |e| */
      var e = rest.value ? 0 : -N.value * sg * dphi(z) * v.value;
      var lum = Math.min(1, Math.abs(e) / 2);
      ctx.beginPath(); ctx.arc(W - 46, cy - 70, 22, 0, 7); ctx.fillStyle = "rgba(244,197,66," + (0.1 + 0.9 * lum) + ")"; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.stroke();
      S.draw.text(c, "lampe", W - 46, cy - 36, {size: 12, color: P.grey});
      S.draw.text(c, "bobine", cxB, cy + 66, {size: 12, color: P.amber});
      /* graphes */
      var tmax = tTot * 1000, ph = function(t){ return sg * phi(-Z + v.value * t / 1000) * 1e6; };
      var emaxCalc = 0.86 * PHI0 / a * v.value * N.value;
      var epk = 0; for (var i = 0; i <= 200; i++){ var zz = -Z + 2 * Z * i / 200; epk = Math.max(epk, Math.abs(N.value * dphi(zz) * v.value)); }
      var Hh = g.H / 2;
      var ax1 = S.draw.axes(g, {x0: 0, x1: tmax, y0: -110, y1: 110, xl: "t (ms)", yl: "Φ (µWb)", l: 52, t: 14, b: 140, stepY: 50});
      var ax2 = null;
      g.ctx.save(); g.ctx.restore();
      S.draw.fn(g, ax1, function(t){ return rest.value ? ph(tmax / 2) : ph(t); }, P.acc);
      S.draw.dot(g, ax1.X(tReal), ax1.Y(rest.value ? ph(tmax / 2) : ph(tReal)), 5, P.ink);
      /* second repère en bas : on redessine avec décalage */
      var sub = {W: g.W, H: g.H, ctx: g.ctx, clear: function(){}};
      var y0 = g.H - 130;
      var emax = Math.max(0.3, Math.ceil(epk * 1.1 * 10) / 10);
      g.ctx.save(); g.ctx.translate(0, 0); g.ctx.restore();
      var ax3 = {L: 52, R: g.W - 16, T: y0 + 14, B: g.H - 22};
      ax3.X = function(t){ return ax3.L + t / tmax * (ax3.R - ax3.L); };
      ax3.Y = function(y){ return ax3.B - (y + emax) / (2 * emax) * (ax3.B - ax3.T); };
      var gc = g.ctx; gc.save(); gc.strokeStyle = "#8a95a3"; gc.lineWidth = 1.2; gc.beginPath(); gc.moveTo(ax3.L, ax3.Y(0)); gc.lineTo(ax3.R, ax3.Y(0)); gc.moveTo(ax3.L, ax3.T); gc.lineTo(ax3.L, ax3.B); gc.stroke();
      gc.fillStyle = "#5f6b7a"; gc.font = "600 12px Mulish, system-ui"; gc.textAlign = "right"; gc.textBaseline = "middle";
      [-emax, 0, emax].forEach(function(y){ gc.fillText(S.fmt(y, 2), ax3.L - 5, ax3.Y(y)); });
      gc.restore();
      S.draw.text(g, "e (V)", ax3.L + 4, ax3.T - 8, {size: 12, align: "left", color: P.red});
      gc.save(); gc.beginPath(); gc.rect(ax3.L, ax3.T - 2, ax3.R - ax3.L, ax3.B - ax3.T + 4); gc.clip(); gc.strokeStyle = P.red; gc.lineWidth = 2.5; gc.beginPath();
      for (i = 0; i <= 240; i++){ var t = tmax * i / 240, zv = -Z + v.value * t / 1000, ev = rest.value ? 0 : -N.value * sg * dphi(zv) * v.value; if (i) gc.lineTo(ax3.X(t), ax3.Y(ev)); else gc.moveTo(ax3.X(t), ax3.Y(ev)); }
      gc.stroke(); gc.restore();
      S.draw.dot(g, ax3.X(tReal), ax3.Y(e), 5, P.ink);
      ro.set(0, rest.value ? S.fmt(PHI0 * 1e6, 0) + " µWb (constant)" : S.fmt(PHI0 * 1e6, 0) + " µWb");
      ro.set(1, rest.value ? "0 V" : S.fmt(epk, 2) + " V"); ro.set(2, S.fmt(e, 2) + " V");
    });
  }
});

SFA.sim({
  id: "p6-c03-alternateur", ch: "c03", tag: "Alternateur",
  titre: "Spire tournante : flux, tension et alternateur",
  resume: "Φ = B·A·cos(ωt) donne e = N·B·A·ω·sin(ωt) : un générateur de tension alternative.",
  but: "Une bobine tourne dans un champ uniforme. Observe le flux (bleu) et la tension (rouge) sur deux périodes. Règle B, N, l'aire et la fréquence ; atteins la tension du réseau.",
  aRetenir: "Une bobine de N spires d'aire A tournant à la vitesse angulaire ω = 2π·f dans un champ B produit e(t) = N·B·A·ω·sin(ω·t). La tension est maximale quand le flux est nul (variation la plus rapide) et nulle quand le flux est maximal. Valeur maximale : N·B·A·ω ; valeur efficace : N·B·A·ω/√2.",
  piege: "La tension est maximale quand le flux est nul, pas quand il est maximal. L'animation de la bobine est ralentie (0,5 tour par seconde) pour qu'on la voie tourner ; les graphiques utilisent la fréquence réelle choisie.",
  build: function(k, S){
    var c = k.canvas(200), g = k.canvas(300), P = S.draw.palette;
    var B = k.slider("Champ B", 0.05, 0.5, 0.05, 0.1, "T");
    var N = k.slider("Nombre de spires N", 10, 300, 10, 100, "");
    var A = k.slider("Aire d'une spire", 50, 200, 10, 100, "cm²");
    var f = k.slider("Fréquence de rotation f", 1, 60, 1, 50, "Hz");
    var ro = k.readouts(["e max = N·B·A·ω", "e efficace", "Période T"]);
    var ang = 0;
    var lp = k.loop(function(dt){ ang += dt * Math.PI; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, cx = c.W / 2, cy = c.H / 2, a = ang % (2 * Math.PI);
      var w = 2 * Math.PI * f.value, Ar = A.value * 1e-4, em = N.value * B.value * Ar * w, T = 1 / f.value, tm = 2 * T * 1000;
      /* champ vers la droite */
      for (var j = -2; j <= 2; j++){ S.draw.arrow(c, cx - 190, cy + j * 36, cx - 90, cy + j * 36, "#b5c3da", 2); S.draw.arrow(c, cx + 90, cy + j * 36, cx + 190, cy + j * 36, "#b5c3da", 2); }
      S.draw.text(c, "B", cx - 205, cy - 10, {size: 14, math: true, color: P.acc});
      /* vue de bout : la spire est un segment dont la normale fait l'angle a avec B */
      var hx = 66 * Math.sin(a), hy = 66 * Math.cos(a);
      S.draw.line(c, cx - hx, cy - hy, cx + hx, cy + hy, P.amber, 6);
      S.draw.dot(c, cx - hx, cy - hy, 7, P.ink); S.draw.dot(c, cx + hx, cy + hy, 7, P.ink);
      S.draw.arrow(c, cx, cy, cx + 44 * Math.cos(a), cy - 44 * Math.sin(a), P.green, 3);
      S.draw.text(c, "normale", cx + 62 * Math.cos(a), cy - 62 * Math.sin(a) - 4, {size: 12, color: P.green});
      S.draw.dot(c, cx, cy, 4, P.ink);
      S.draw.text(c, "Φ = B·A·cos(ωt) = " + S.fmt(B.value * Ar * Math.cos(a) * 1000, 2) + " mWb", cx, c.H - 12, {size: 12, color: P.acc});
      /* graphes sur deux périodes : Φ (haut) et e (bas) */
      var phm = B.value * Ar, y0 = 150;
      var a1 = {L: 56, R: g.W - 14, T: 12, B: 138}, a2 = {L: 56, R: g.W - 14, T: 166, B: g.H - 24};
      [a1, a2].forEach(function(q, idx){
        var m = idx ? em : phm;
        q.X = function(t){ return q.L + t / tm * (q.R - q.L); }; q.Y = function(y){ return q.B - (y + m) / (2 * m) * (q.B - q.T); };
        var gc = g.ctx; gc.save(); gc.strokeStyle = "#8a95a3"; gc.lineWidth = 1.2; gc.beginPath(); gc.moveTo(q.L, q.Y(0)); gc.lineTo(q.R, q.Y(0)); gc.moveTo(q.L, q.T); gc.lineTo(q.L, q.B); gc.stroke();
        gc.strokeStyle = "#edf0f4"; for (var p = 1; p <= 4; p++){ var xx = q.L + p / 4 * (q.R - q.L); gc.beginPath(); gc.moveTo(xx, q.T); gc.lineTo(xx, q.B); gc.stroke(); }
        gc.fillStyle = "#5f6b7a"; gc.font = "600 12px Mulish, system-ui"; gc.textAlign = "right"; gc.textBaseline = "middle";
        [-m, 0, m].forEach(function(y){ gc.fillText(idx ? S.fmt(y, 1) : S.fmt(y * 1000, 2), q.L - 5, q.Y(y)); });
        gc.textAlign = "center"; gc.textBaseline = "top"; if (idx){ for (p = 0; p <= 4; p++) gc.fillText(S.fmt(tm * p / 4, 1), q.L + p / 4 * (q.R - q.L), q.B + 4); }
        gc.restore();
        gc.save(); gc.strokeStyle = idx ? P.red : P.acc; gc.lineWidth = 2.6; gc.beginPath();
        for (var i = 0; i <= 300; i++){ var t = tm * i / 300, val = idx ? em * Math.sin(w * t / 1000) : phm * Math.cos(w * t / 1000); if (i) gc.lineTo(q.X(t), q.Y(val)); else gc.moveTo(q.X(t), q.Y(val)); }
        gc.stroke(); gc.restore();
      });
      S.draw.text(g, "Φ (mWb)", a1.L + 4, a1.T + 8, {size: 12, align: "left", color: P.acc});
      S.draw.text(g, "e (V)", a2.L + 4, a2.T + 8, {size: 12, align: "left", color: P.red});
      S.draw.text(g, "t (ms)", a2.R, a2.B + 14, {size: 12, align: "right"});
      /* cercle repère position instantanée (même phase que la bobine) */
      var tcur = (a / w) * 1000 * (w / (2 * Math.PI)) / f.value * f.value; /* t tel que ωt = a */
      tcur = a / w * 1000;
      S.draw.dot(g, a1.X(tcur), a1.Y(phm * Math.cos(a)), 5, P.ink); S.draw.dot(g, a2.X(tcur), a2.Y(em * Math.sin(a)), 5, P.ink);
      ro.set(0, S.fmt(em, 1) + " V"); ro.set(1, S.fmt(em / Math.SQRT2, 1) + " V"); ro.set(2, S.fmt(T * 1000, 1) + " ms");
    });
    k.note("Défi : réseau belge, tension efficace 230 V (maximum 325 V) à 50 Hz. Quels réglages de N, B et A donnent e max ≈ 325 V ?");
  }
});

SFA.sim({
  id: "p6-c03-lenz", ch: "c03", tag: "Sens du courant",
  titre: "La loi de Lenz : le courant induit s'oppose à la cause",
  resume: "Approche ou éloigne un pôle : quelle face de la bobine devient Nord, dans quel sens tourne le courant ?",
  but: "Choisis le pôle qui fait face à la bobine et le mouvement (approche, éloigne, arrêt). Le schéma indique la face induite, le sens du courant (vu du côté de l'aimant) et la force sur l'aimant.",
  aRetenir: "Le courant induit a un sens tel que ses effets s'opposent à la variation de flux qui lui donne naissance. Si on approche un pôle Nord, la face de la bobine qui lui fait face devient Nord (répulsion) ; si on l'éloigne, elle devient Sud (attraction). Dans les deux cas, il faut fournir un travail : c'est l'énergie qui devient électrique.",
  piege: "« S'opposer » ne signifie pas « s'opposer au champ de l'aimant » : la bobine s'oppose à la VARIATION du flux. Si on éloigne l'aimant, le courant crée un champ de même sens que celui de l'aimant (il cherche à maintenir le flux). Sans mouvement, pas de courant.",
  build: function(k, S){
    var c = k.canvas(300), P = S.draw.palette;
    var pole = k.seg("Pôle de l'aimant tourné vers la bobine", [["N", "Nord"], ["S", "Sud"]], "N");
    var mv = k.seg("Mouvement de l'aimant", [["app", "Il s'approche"], ["stop", "Il est immobile"], ["eloi", "Il s'éloigne"]], "app");
    var ro = k.readouts(["Face de la bobine tournée vers l'aimant", "Courant (vu de l'aimant)", "Force sur l'aimant"]);
    var ph = 0;
    var lp = k.loop(function(dt){ ph += dt; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, cy = H / 2 - 10, cx = W * 0.62;
      var m = mv.value, nearN = pole.value === "N";
      var d = m === "stop" ? 0 : (m === "app" ? 1 : -1);
      var off = 110;
      if (d === 1) off = 160 - ((ph * 60) % 90); else if (d === -1) off = 70 + ((ph * 60) % 90);
      /* bobine : vue de côté */
      ctx.strokeStyle = P.amber; ctx.lineWidth = 3; for (var j = -2; j <= 2; j++){ ctx.beginPath(); ctx.ellipse(cx + j * 8, cy, 10, 50, 0, 0, 7); ctx.stroke(); }
      /* aimant à gauche de la bobine : sa face droite est tournée vers la bobine */
      var mx = cx - off - 40, mw = 80, mh = 30;
      ctx.fillStyle = nearN ? P.acc : P.red; ctx.fillRect(mx - mw / 2, cy - mh / 2, mw / 2, mh);
      ctx.fillStyle = nearN ? P.red : P.acc; ctx.fillRect(mx, cy - mh / 2, mw / 2, mh);
      ctx.strokeStyle = P.ink; ctx.lineWidth = 1.5; ctx.strokeRect(mx - mw / 2, cy - mh / 2, mw, mh);
      S.draw.text(c, nearN ? "S" : "N", mx - mw / 4, cy, {color: "#fff", size: 14}); S.draw.text(c, nearN ? "N" : "S", mx + mw / 4, cy, {color: "#fff", size: 14});
      if (d === 1) S.draw.arrow(c, mx - 30, cy - 46, mx + 20, cy - 46, P.ink, 3); if (d === -1) S.draw.arrow(c, mx + 20, cy - 46, mx - 30, cy - 46, P.ink, 3);
      /* face induite */
      var faceN = d === 0 ? null : ((d === 1) === nearN);   /* approche : même pôle ; éloigne : pôle contraire */
      var label = d === 0 ? "aucune" : (faceN ? "Nord" : "Sud");
      if (d !== 0){
        ctx.fillStyle = faceN ? "rgba(180,35,24,.25)" : "rgba(30,63,143,.25)"; ctx.fillRect(cx - 24, cy - 58, 14, 116);
        S.draw.text(c, faceN ? "N" : "S", cx - 17, cy - 70, {size: 15, color: faceN ? P.red : P.acc});
      }
      /* force sur l'aimant */
      if (d === 1) S.draw.arrow(c, mx - 40, cy + 54, mx - 90, cy + 54, P.red, 4);
      if (d === -1) S.draw.arrow(c, mx - 40, cy + 54, mx + 10, cy + 54, P.red, 4);
      /* sens du courant vu de l'aimant : face Nord ⇒ anti-horaire */
      var fx = W * 0.14, fy = cy + 8;
      if (d !== 0){
        var ccw = faceN, ts = -1.2, te = ccw ? ts - 5.2 : ts + 5.2;
        ctx.strokeStyle = P.green; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(fx, fy, 38, ts, te, ccw); ctx.stroke();
        var ex = fx + 38 * Math.cos(te), ey = fy + 38 * Math.sin(te), tx = ccw ? Math.sin(te) : -Math.sin(te), ty = ccw ? -Math.cos(te) : Math.cos(te);
        S.draw.arrow(c, ex - tx * 10, ey - ty * 10, ex + tx * 4, ey + ty * 4, P.green, 4);
        S.draw.text(c, "vue de l'aimant", fx, fy + 58, {size: 12, color: P.grey});
      }
      var cur = d === 0 ? "aucun" : (faceN ? "↺ anti-horaire" : "↻ horaire");
      var frc = d === 0 ? "aucune" : (d === 1 ? "répulsion (freine l'approche)" : "attraction (freine l'éloignement)");
      ro.set(0, label); ro.set(1, cur); ro.set(2, frc);
      S.draw.text(c, d === 0 ? "Flux constant : pas de courant" : (d === 1 ? "Flux croissant : la bobine s'y oppose" : "Flux décroissant : la bobine le maintient"), W / 2, H - 14, {size: 13, color: P.ink});
    });
  }
});

SFA.sim({
  id: "p6-c03-aimant-tube", ch: "c03", tag: "Niche · Foucault",
  titre: "Un aimant dans un tube de cuivre : la chute ralentie",
  resume: "Des courants de Foucault freinent la chute : compare cuivre, aluminium, laiton et plastique.",
  but: "Deux aimants identiques tombent de 60 cm : l'un dans un tube, l'autre en chute libre. Choisis le matériau, l'épaisseur du tube et la masse de l'aimant : la vitesse limite et la durée de chute s'affichent.",
  aRetenir: "Dans le tube conducteur, l'aimant en mouvement fait varier le flux : des courants induits (courants de Foucault) apparaissent et, selon Lenz, s'opposent au mouvement. La force de freinage augmente avec la vitesse jusqu'à compenser le poids : l'aimant atteint une vitesse limite constante. L'énergie potentielle perdue se transforme en chaleur dans le tube.",
  piege: "Un tube en plastique ne freine pas : il isole, aucun courant ne circule. Le freinage n'est pas dû au magnétisme du tube (le cuivre n'est pas attiré par un aimant) mais à l'induction. Modèle simplifié : force de freinage proportionnelle à la vitesse, k ∝ conductivité × épaisseur (ordre de grandeur).",
  build: function(k, S){
    var c = k.canvas(360), P = S.draw.palette, g = 9.81, H = 0.6;
    var mat = k.select("Matériau du tube", [["cu", "Cuivre"], ["al", "Aluminium"], ["lt", "Laiton"], ["pl", "Plastique (isolant)"]], "cu", function(){ t = 0; });
    var ep = k.slider("Épaisseur du tube", 1, 5, 0.5, 2, "mm", function(){ t = 0; });
    var ms = k.slider("Masse de l'aimant", 5, 50, 5, 10, "g", function(){ t = 0; });
    k.button("Rejouer la chute", function(){ t = 0; }, true);
    var ro = k.readouts(["Vitesse limite", "Durée dans le tube", "Durée en chute libre", "Énergie transformée en chaleur"]);
    var sig = {cu: 1, al: 0.63, lt: 0.25, pl: 0}, t = 0, hold = 0;
    function model(){
      var m = ms.value / 1000, kk = 0.5 * sig[mat.value] * ep.value, free = kk === 0;
      var vt = free ? Infinity : m * g / kk, tau = free ? Infinity : m / kk;
      function x(tt){ return free ? 0.5 * g * tt * tt : vt * tt - vt * tau * (1 - Math.exp(-tt / tau)); }
      var lo = 0, hi = 200; for (var i = 0; i < 60; i++){ var mid = (lo + hi) / 2; if (x(mid) < H) lo = mid; else hi = mid; }
      var tf = Math.sqrt(2 * H / g), tt = lo, vend = free ? g * tt : vt * (1 - Math.exp(-tt / tau));
      return {m: m, vt: vt, tau: tau, free: free, x: x, tt: tt, tf: tf, Q: m * g * H - 0.5 * m * vend * vend};
    }
    var lp = k.loop(function(dt){ t += dt; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, Hc = c.H, M = model();
      var top = 34, bot = Hc - 40, sc = (bot - top) / H, x1 = W * 0.30, x2 = W * 0.70, tw = 34;
      /* tube */
      ctx.fillStyle = mat.value === "pl" ? "rgba(160,190,220,.35)" : (mat.value === "cu" ? "rgba(200,120,60,.55)" : mat.value === "al" ? "rgba(170,175,185,.6)" : "rgba(205,170,70,.55)");
      ctx.fillRect(x1 - tw, top, 8 + ep.value * 1.5, bot - top); ctx.fillRect(x1 + tw - 8 - ep.value * 1.5, top, 8 + ep.value * 1.5, bot - top);
      ctx.strokeStyle = P.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x1 - tw, top, 2 * tw, bot - top);
      S.draw.text(c, "avec tube", x1, 16, {size: 13}); S.draw.text(c, "chute libre", x2, 16, {size: 13});
      S.draw.line(c, x2 - tw, bot, x2 + tw, bot, P.ink, 2);
      var tt = Math.min(t, 1000), y1 = Math.min(H, M.x(tt)), y2 = Math.min(H, 0.5 * g * tt * tt);
      function mag(x, y){ ctx.fillStyle = P.red; ctx.fillRect(x - 12, top + y * sc, 24, 14); ctx.fillStyle = P.acc; ctx.fillRect(x - 12, top + y * sc + 14, 24, 14); ctx.strokeStyle = P.ink; ctx.strokeRect(x - 12, top + y * sc, 24, 28); }
      mag(x1, Math.min(H - 0.03, y1)); mag(x2, Math.min(H - 0.03, y2));
      /* chronomètres */
      S.draw.text(c, S.fmt(Math.min(tt, M.tt), 2) + " s", x1, bot + 22, {size: 14, color: P.acc});
      S.draw.text(c, S.fmt(Math.min(tt, M.tf), 2) + " s", x2, bot + 22, {size: 14, color: P.acc});
      S.draw.text(c, "0,6 m", 14, (top + bot) / 2, {size: 12, color: P.grey, align: "left"});
      ro.set(0, M.free ? "pas de limite" : S.fmt(M.vt * 100, 1) + " cm/s"); ro.set(1, S.fmt(M.tt, 2) + " s"); ro.set(2, S.fmt(M.tf, 2) + " s");
      ro.set(3, S.fmt(M.Q * 1000, 1) + " mJ sur " + S.fmt(M.m * g * H * 1000, 1) + " mJ");
    });
  }
});
