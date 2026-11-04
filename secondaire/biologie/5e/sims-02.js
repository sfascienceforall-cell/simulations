/* Chapitre 2 · Synapse, réflexe et intégration nerveuse */
(function(){
var REST = -70, THR = -55;

SFA.sim({
  id: "b5-c02-sommation", ch: "c02", tag: "Classique",
  titre: "La synapse additionne : sommation spatiale et temporelle",
  resume: "Nombre de synapses excitatrices/inhibitrices et fréquence → le neurone décharge-t-il ?",
  but: "Un neurone reçoit des messages de plusieurs synapses. Chaque synapse excitatrice ajoute +2 mV, chaque synapse inhibitrice retire 2 mV (la dépolarisation s'efface avec une constante de temps de 10 ms). Trouve une combinaison qui déclenche des potentiels d'action, puis la plus petite fréquence qui y parvient avec 4 synapses.",
  aRetenir: "Un seul message est presque toujours insuffisant. Le neurone additionne les potentiels postsynaptiques : sommation spatiale (plusieurs synapses en même temps) et sommation temporelle (messages rapprochés, qui s'ajoutent avant de s'éteindre). Les synapses inhibitrices éloignent du seuil. Le neurone décharge si le total atteint −55 mV.",
  piege: "Les neurones ne se touchent pas : la fente synaptique (≈ 20 nm) est franchie par un neurotransmetteur, et le message arrivant n'est pas « tout ou rien » au niveau du neurone suivant : les petits potentiels postsynaptiques s'additionnent. Modèle simplifié.",
  build: function(k, S){
    var c = k.canvas(300), pal = S.draw.palette;
    var nE = k.slider("Synapses excitatrices actives", 0, 10, 1, 4, "");
    var nI = k.slider("Synapses inhibitrices actives", 0, 6, 1, 0, "");
    var f = k.slider("Fréquence des PA présynaptiques", 5, 200, 5, 50, "Hz");
    var ro = k.readouts(["Effet d'une salve", "PA postsynaptiques / 200 ms", "Potentiel max."]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var T = 200, J = 2 * (nE.value - nI.value), per = 1000 / f.value, tau = 10, V = REST, vmax = REST, nap = 0, pts = [], spikes = [], pre = [];
      for (var t0 = 5; t0 <= T; t0 += per) pre.push(t0);
      var pi = 0;
      for (var t = 0; t <= T; t += 0.1){
        V = REST + (V - REST) * Math.exp(-0.1 / tau);
        while (pi < pre.length && pre[pi] <= t + 1e-9){ V += J; pi++; }
        if (V < REST - 15) V = REST - 15;
        if (V >= THR - 1e-9){ nap++; spikes.push(t); vmax = Math.max(vmax, THR); V = REST; pts.push([t, 40]); pts.push([t + 0.1, REST]); continue; }
        if (V > vmax) vmax = V;
        pts.push([t, V]);
      }
      var ax = S.draw.axes(c, {x0: 0, x1: T, y0: -90, y1: 50, xl: "t (ms)", yl: "V (mV)", stepX: 20, stepY: 20});
      S.draw.line(c, ax.X(0), ax.Y(THR), ax.X(T), ax.Y(THR), pal.red, 1.5, [6, 4]);
      S.draw.text(c, "seuil −55", ax.X(T) - 4, ax.Y(THR) + 10, {size: 12, color: pal.red, align: "right"});
      pre.forEach(function(p){ S.draw.line(c, ax.X(p), ax.B, ax.X(p), ax.B - 12, pal.amber, 1.5); });
      S.draw.text(c, "PA présynaptiques", ax.L + 4, ax.B - 22, {align: "left", size: 12, color: pal.amber});
      B5.poly(c, ax, pts, pal.violet, 2.2);
      ro.set(0, (J >= 0 ? "+" : "−") + S.fmt(Math.abs(J), 0) + " mV"); ro.set(1, String(nap)); ro.set(2, S.fmt(vmax, 1) + " mV");
      if (nE.value === 0 && nI.value === 0) nt.set("Aucune synapse active : rien ne perturbe le potentiel de repos.", "");
      else if (nap) nt.set("Le total atteint le seuil : " + nap + " potentiels d'action postsynaptiques en 200 ms.", "ok");
      else if (J <= 0) nt.set("Les inhibiteurs compensent ou dépassent les excitateurs : le neurone ne peut pas atteindre le seuil.", "warn");
      else nt.set("Pas de PA : le potentiel maximal (" + S.fmt(vmax, 1) + " mV) reste sous −55 mV. Augmente le nombre de synapses (sommation spatiale) ou la fréquence (sommation temporelle).", "warn");
    });
  }
});

/* ---------- arc réflexe ---------- */
var SIT = {
  rot: {nom: "Réflexe rotulien (genou)", ref: true, d1: 0.5, d2: 0.5, ns: 1, ti: 0},
  main: {nom: "Retrait de la main (brûlure)", ref: true, d1: 0.7, d2: 0.7, ns: 2, ti: 0},
  pied: {nom: "Retrait du pied (clou)", ref: true, d1: 0.9, d2: 0.9, ns: 2, ti: 0},
  vol: {nom: "Action volontaire (lever la main au signal)", ref: false, d1: 0.7, d2: 0.7, ns: 5, ti: 100}
};
function tot(s, v){                  /* ms */
  var dist = 2 * s.d1 + (s.ref ? 0 : 1.0);        /* volontaire : 2 × 0,5 m en plus entre moelle et encéphale */
  return {dist: dist, cond: dist / v * 1000, syn: s.ns, integ: s.ti, total: dist / v * 1000 + s.ns * 1 + s.ti};
}
SFA.sim({
  id: "b5-c02-arc", ch: "c02", tag: "Animation",
  titre: "Arc réflexe contre acte volontaire",
  resume: "Trajet, synapses et intégration → durée totale de la réponse.",
  but: "Choisis une situation et la vitesse de conduction, puis lance l'influx (ralenti ×20). Compare le temps total d'un réflexe et celui d'une action volontaire. Que se passe-t-il si les nerfs sont plus lents ?",
  aRetenir: "Le réflexe est une réponse involontaire, rapide et stéréotypée : le centre nerveux est la moelle épinière (ou le tronc cérébral), pas l'encéphale. Le trajet est court, il y a 1 à 2 synapses ; l'information monte ensuite vers l'encéphale seulement pour information. Un acte volontaire passe par le cortex : trajet plus long, plus de synapses, plus d'intégration.",
  piege: "« Le réflexe passe par le cerveau » est faux. Autre erreur : croire que le message dépend d'un seul neurone : l'arc compte au moins un neurone sensitif et un neurone moteur. Valeurs : ordres de grandeur d'un modèle simplifié (chaque synapse ajoute 1 ms).",
  build: function(k, S){
    var c = k.canvas(300), pal = S.draw.palette;
    var sit = k.select("Situation", [["rot", SIT.rot.nom], ["main", SIT.main.nom], ["pied", SIT.pied.nom], ["vol", SIT.vol.nom]], "main");
    var v = k.slider("Vitesse de conduction des nerfs", 20, 100, 5, 60, "m/s");
    var ro = k.readouts(["Trajet", "Conduction", "Synapses + intégration", "Durée totale"]);
    var nt = k.note("", "");
    var tt = 0, SL = 20;
    var lp = k.loop(function(dt){ tt += dt; var s = SIT[sit.value]; if (tt > (tot(s, v.value).total / 1000) * SL + 0.4){ lp.pause(); } k.redraw(); });
    k.button("Envoyer l'influx (ralenti ×20)", function(){ tt = 0; lp.play(); }, true);
    k.draw(function(){
      c.clear();
      var s = SIT[sit.value], T = tot(s, v.value), W = c.W, H = c.H, ctx = c.ctx;
      var R = {x: W * 0.84, y: H * 0.78}, M = {x: W * 0.5, y: H * 0.52}, E = {x: W * 0.16, y: H * 0.78}, Br = {x: W * 0.5, y: H * 0.14};
      ctx.fillStyle = "#f1ecfb"; ctx.fillRect(M.x - 12, Br.y + 18, 24, M.y - Br.y + 44);
      S.draw.text(c, "moelle épinière", M.x + 18, M.y + 40, {align: "left", size: 12, color: pal.grey});
      B5.circ(c, Br.x, Br.y, 26, "#f1ecfb", pal.violet); S.draw.text(c, "encéphale", Br.x, Br.y, {size: 12});
      B5.circ(c, R.x, R.y, 12, "#fde3d6", pal.red); S.draw.text(c, "récepteur", R.x, R.y + 26, {size: 12});
      B5.circ(c, E.x, E.y, 12, "#dfeee7", pal.green); S.draw.text(c, "muscle", E.x, E.y + 26, {size: 12});
      B5.circ(c, M.x, M.y, 8, pal.violet);
      var path = s.ref ? [R, M, E] : [R, M, Br, M, E];
      var cols = [pal.red, pal.violet, pal.violet, pal.green];
      for (var i = 0; i < path.length - 1; i++) S.draw.line(c, path[i].x, path[i].y, path[i + 1].x, path[i + 1].y, s.ref ? (i ? pal.green : pal.red) : (i < 2 ? pal.red : pal.green), 2.5, i && !s.ref && (i === 1 || i === 2) ? [6, 4] : null);
      /* position du signal : progression au prorata des durées (conduction + délais aux relais) */
      var treal = tt / SL * 1000, segLen = [], total = 0, j;
      for (j = 0; j < path.length - 1; j++){ var dl = Math.hypot(path[j + 1].x - path[j].x, path[j + 1].y - path[j].y); segLen.push(dl); total += dl; }
      var tcond = T.cond, tdelay = T.syn + T.integ, tTotal = T.total;
      if (tt > 0 && treal <= tTotal + 1){
        var frac;
        var cp = tcond / (tcond + tdelay);
        var u = treal / tTotal;
        /* le délai est consommé à la moelle (réflexe) ou à l'encéphale (volontaire) : le point y attend */
        var pause0 = s.ref ? 0.5 : 0.5, wait = tdelay / tTotal;
        var moving = Math.max(0, treal - 0) ;
        var cum = 0, tpos = Math.min(treal, tTotal);
        var mt = tpos <= (tTotal - tdelay) * pause0 ? tpos : (tpos <= (tTotal - tdelay) * pause0 + tdelay ? (tTotal - tdelay) * pause0 : tpos - tdelay);
        frac = (tTotal - tdelay) > 0 ? mt / (tTotal - tdelay) : 0;
        var target = frac * total, px = path[0].x, py = path[0].y; cum = 0;
        for (j = 0; j < segLen.length; j++){ if (target <= cum + segLen[j] + 1e-9){ var q = (target - cum) / segLen[j]; px = path[j].x + q * (path[j + 1].x - path[j].x); py = path[j].y + q * (path[j + 1].y - path[j].y); break; } cum += segLen[j]; px = path[j + 1].x; py = path[j + 1].y; }
        B5.circ(c, px, py, 9, "rgba(180,35,24,.9)");
      }
      S.draw.text(c, "Temps écoulé (réel) : " + S.fmt(Math.min(tt / SL * 1000, tTotal), 0) + " ms", 10, H - 12, {align: "left", size: 12, color: pal.ink});
      S.draw.text(c, s.ref ? "centre nerveux : moelle épinière" : "centre nerveux : cortex cérébral", W - 10, 14, {align: "right", size: 12, color: pal.violet});
      var vol = tot(SIT.vol, v.value);
      var Tv = tot({ref: false, d1: s.d1, d2: s.d2, ns: 5, ti: 100}, v.value);
      ro.set(0, S.fmt(T.dist, 1) + " m"); ro.set(1, S.fmt(T.cond, 0) + " ms"); ro.set(2, S.fmt(T.syn + T.integ, 0) + " ms"); ro.set(3, S.fmt(T.total, 0) + " ms");
      nt.set(s.ref ? "Pour la même zone du corps, une action volontaire durerait " + S.fmt(Tv.total, 0) + " ms : environ " + S.fmt(Tv.total / T.total, 1) + " fois plus. Le réflexe protège (retrait avant même de sentir la douleur)." : "Ici l'intégration corticale (≈ 100 ms) représente " + S.fmt(100 * s.ti / T.total, 0) + " % de la durée totale : le cortex, plus que les nerfs, fait la lenteur d'un acte volontaire.", "ok");
    });
  }
});

/* ---------- drogues ---------- */
SFA.sim({
  id: "b5-c02-drogues", ch: "c02", tag: "Substances",
  titre: "Que font les drogues à la synapse ?",
  resume: "Cocaïne, curare, nicotine : dose → neurotransmetteur, récepteurs occupés, réponse.",
  but: "Après un potentiel d'action, le neurotransmetteur est libéré puis éliminé de la fente. Choisis une substance et une dose. Observe la concentration de neurotransmetteur, la fraction de récepteurs activés et la réponse totale par rapport à la situation normale.",
  aRetenir: "Une substance peut agir à plusieurs niveaux : en bloquant l'élimination du neurotransmetteur (cocaïne : la dopamine reste plus longtemps), en bloquant les récepteurs (curare : le message n'est plus reçu, d'où la paralysie), ou en imitant le neurotransmetteur (nicotine : elle active les récepteurs de l'acétylcholine).",
  piege: "Toutes les drogues n'augmentent pas l'activité : le curare la diminue. Et « stimulant » ne veut pas dire « sans risque ». Modèle de principe : les unités sont arbitraires, aucune donnée de dosage réel.",
  build: function(k, S){
    var c = k.canvas(300), pal = S.draw.palette;
    var dr = k.select("Substance", [["a", "Aucune (témoin)"], ["c", "Cocaïne (bloque la recapture)"], ["u", "Curare (bloque les récepteurs)"], ["n", "Nicotine (agoniste des récepteurs)"]], "c");
    var dose = k.slider("Dose", 0, 100, 5, 60, "%");
    var ro = k.readouts(["Durée du neurotransmetteur", "Récepteurs actifs (pic)", "Réponse totale (témoin = 100 %)"]);
    var nt = k.note("", "");
    var Kd = 0.5, T = 12;
    function curves(drug, d){
      var kk = 1, blk = 0, ag = 0; d = d / 100;
      if (drug === "c") kk = 1 - 0.8 * d; if (drug === "u") blk = d; if (drug === "n") ag = 0.6 * d;
      var nts = [], occ = [], A = 0, n = 0;
      for (var t = 0; t <= T + 1e-9; t += 0.1){
        var N = Math.exp(-kk * t), o = N / (N + Kd);
        o = 1 - (1 - o * (1 - blk)) * (1 - ag * (1 - blk));
        nts.push([t, N]); occ.push([t, o]); A += o * 0.1;
      }
      return {nts: nts, occ: occ, area: A, kk: kk};
    }
    var base = curves("a", 0), Abase = base.area - 0;   /* pour le témoin */
    k.draw(function(){
      c.clear();
      var cu = curves(dr.value, dose.value), pa = c.W < 480;
      var ax = S.draw.axes(c, {x0: 0, x1: T, y0: 0, y1: 1.05, xl: "t (ms)", yl: "relatif", stepX: 2, stepY: 0.25});
      B5.poly(c, ax, base.nts, pal.grey, 1.8, [5, 4]); B5.poly(c, ax, cu.nts, pal.amber, 2.6);
      B5.poly(c, ax, base.occ, "#b9b0d6", 1.8, [5, 4]); B5.poly(c, ax, cu.occ, pal.violet, 2.8);
      B5.leg(c, [["neurotransmetteur", pal.amber], ["récepteurs actifs", pal.violet]], ax.L + 8, ax.T + 38);
      S.draw.text(c, "pointillés : témoin", ax.R - 6, ax.T + 14, {align: "right", size: 12, color: pal.grey});
      var half = Math.LN2 / cu.kk;
      var peak = Math.max.apply(null, cu.occ.map(function(p){ return p[1]; }));
      var rel = cu.area / base.area * 100;
      ro.set(0, "demi-vie " + S.fmt(half, 1) + " ms"); ro.set(1, S.fmt(peak * 100, 0) + " %"); ro.set(2, S.fmt(rel, 0) + " %");
      var msg = {a: "Situation normale : le neurotransmetteur est éliminé en quelques ms, la réponse est brève.",
        c: "La recapture est freinée : le neurotransmetteur reste dans la fente, les récepteurs sont stimulés plus longtemps (réponse × " + S.fmt(rel / 100, 1) + ").",
        u: "Les récepteurs sont occupés par le curare : même avec autant de neurotransmetteur, la réponse tombe à " + S.fmt(rel, 0) + " % (paralysie musculaire si la dose augmente).",
        n: "La nicotine active les récepteurs même quand il n'y a plus de neurotransmetteur : activation persistante (réponse × " + S.fmt(rel / 100, 1) + ")."};
      nt.set(msg[dr.value], dr.value === "u" ? "warn" : "ok");
    });
  }
});

/* ---------- temps de réaction ---------- */
SFA.sim({
  id: "b5-c02-regle", ch: "c02", tag: "Défi",
  titre: "Test de la règle qui tombe : ton temps de réaction",
  resume: "Distance de chute de la règle → temps de réaction de la chaîne nerveuse.",
  but: "Mode « Jouer » : clique sur « Lâcher » puis sur « Attraper ! » dès que la règle bouge, répète plusieurs fois. Mode « Calculer » : choisis la distance de chute et obtiens le temps (d = ½·g·t²). Ton temps est-il dans la fourchette habituelle (0,15 à 0,25 s) ?",
  aRetenir: "La règle tombe d'une hauteur d = ½·g·t², donc t = √(2d/g). Le temps de réaction comprend : détection par la rétine, trajet vers le cortex visuel, décision, trajet vers les muscles de la main, contraction. C'est une action volontaire : bien plus longue qu'un réflexe (≈ 20–30 ms).",
  piege: "Plus la règle tombe de haut, plus la réaction est lente, mais pas proportionnellement : d croît comme t² (une réaction deux fois plus lente fait chuter la règle quatre fois plus loin).",
  build: function(k, S){
    var c = k.canvas(300), pal = S.draw.palette, g = 9.81;
    var mode = k.seg("Mode", [["j", "Jouer"], ["c", "Calculer"]], "j");
    var dd = k.slider("Distance de chute (mode Calculer)", 1, 40, 1, 20, "cm");
    var ro = k.readouts(["Distance", "Temps de réaction", "Moyenne"]);
    var nt = k.note("Mode « Jouer » : lâche la règle, puis attrape-la dès qu'elle bouge.", "");
    var st = "idle", wait = 0, tfall = 0, res = [], dist = 0;
    var lp = k.loop(function(dt){
      if (st === "wait"){ wait -= dt; if (wait <= 0){ st = "fall"; tfall = 0; } }
      else if (st === "fall"){ tfall += dt; var d = 0.5 * g * tfall * tfall * 100; if (d >= 40){ dist = 40; st = "miss"; lp.pause(); nt.set("Raté : la règle est tombée complètement.", "warn"); } }
      k.redraw();
    });
    k.button("Lâcher la règle", function(){ if (st === "wait" || st === "fall") return; st = "wait"; wait = 1 + Math.random() * 2; nt.set("Attention… la règle va tomber.", ""); lp.play(); }, true);
    k.button("Attraper !", function(){
      if (st === "fall"){ dist = 0.5 * g * tfall * tfall * 100; res.push(tfall); if (res.length > 6) res.shift(); st = "done"; lp.pause(); nt.set("Attrapée : " + S.fmt(dist, 1) + " cm, soit " + S.fmt(tfall * 1000, 0) + " ms.", "ok"); }
      else if (st === "wait"){ st = "idle"; lp.pause(); nt.set("Trop tôt : tu as cliqué avant la chute.", "warn"); }
    });
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 40, y0: 0, y1: 0.3, xl: "d (cm)", yl: "t (s)", stepX: 5, stepY: 0.05, l: 52, r: 74});
      var pts = []; for (var d = 0; d <= 40; d += 0.5) pts.push([d, Math.sqrt(2 * d / 100 / g)]);
      c.ctx.fillStyle = "rgba(46,107,85,.12)"; c.ctx.fillRect(ax.X(0), ax.Y(0.25), ax.X(40) - ax.X(0), ax.Y(0.15) - ax.Y(0.25));
      S.draw.text(c, "zone habituelle 0,15 à 0,25 s", ax.L + 8, ax.Y(0.2), {align: "left", size: 12, color: pal.green});
      B5.poly(c, ax, pts, pal.violet, 2.6);
      var calc = mode.value === "c", dshow, tshow;
      if (calc){ dshow = dd.value; tshow = Math.sqrt(2 * dshow / 100 / g); }
      else if (st === "fall" || st === "miss" || st === "done"){ dshow = st === "fall" ? 0.5 * g * tfall * tfall * 100 : dist; tshow = st === "fall" ? tfall : (st === "done" ? res[res.length - 1] : Math.sqrt(2 * 0.4 / g)); }
      else { dshow = null; }
      if (dshow !== null) S.draw.dot(c, ax.X(Math.min(dshow, 40)), ax.Y(tshow), 7, pal.red);
      var mean = res.length ? res.reduce(function(a, b){ return a + b; }, 0) / res.length : null;
      ro.set(0, dshow === null ? "—" : S.fmt(dshow, 1) + " cm"); ro.set(1, dshow === null ? "—" : S.fmt(tshow * 1000, 0) + " ms");
      ro.set(2, mean === null ? "—" : S.fmt(mean * 1000, 0) + " ms (" + res.length + " essais)");
      /* règle dessinée à droite de la zone du graphe */
      var rx = c.W - 52, ry0 = ax.T + 6, h = ax.B - ax.T - 12, fall = (calc ? dd.value : (dshow || 0));
      var scale = h / 80;
      var top = ry0 + (calc || st !== "idle" ? fall * scale : 0);
      c.ctx.fillStyle = "#f4c542"; c.ctx.fillRect(rx, top, 22, 40 * scale); c.ctx.strokeStyle = "#B45309"; c.ctx.strokeRect(rx, top, 22, 40 * scale);
      for (var m = 0; m <= 40; m += 10) S.draw.line(c, rx, top + m * scale, rx + 10, top + m * scale, "#B45309", 1);
      S.draw.line(c, rx - 10, ry0 + 40 * scale, rx + 32, ry0 + 40 * scale, pal.violet, 2, [4, 3]);
      S.draw.text(c, "main", rx - 18, ry0 + 40 * scale, {size: 12, color: pal.violet, align: "right"});
    });
  }
});
})();
