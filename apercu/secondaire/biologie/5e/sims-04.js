/* Chapitre 4 · Homéostasie et thermorégulation */
(function(){
var CORE_C = 245;       /* kJ/K : 70 kg × 3,5 kJ/(kg·K) */
function dTh(net){ return net * 3600 / (CORE_C * 1000); }     /* K/h pour un bilan net en W */
/* bilan thermique d'un adulte au repos (modèle simplifié) */
function thermo(Ta, iso){
  var K = 14, loss0 = K * (33 - Ta) / (1 + 0.8 * iso), P0 = 80, o = {loss0: loss0, vc: 0, vd: 0, shiv: 0, E: 0, net: 0, loss: loss0, regime: ""};
  if (loss0 <= 0){ o.E = P0 - loss0; o.vd = 1; o.loss = loss0; o.regime = "chaud"; }
  else {
    var lC = loss0 * 0.65, lD = loss0 * 1.6;
    if (lC > P0){ o.vc = 1; o.shiv = Math.min(240, lC - P0); o.loss = lC; o.net = P0 + o.shiv - lC; o.regime = "froid"; }
    else if (lD >= P0){ var f = P0 / loss0; o.loss = P0; if (f < 1) o.vc = (1 - f) / 0.35; else o.vd = (f - 1) / 0.6; o.regime = "neutre"; }
    else { o.vd = 1; o.loss = lD; o.E = P0 - lD; o.regime = "chaud"; }
  }
  if (o.E > 700){ o.net = o.E - 700; o.E = 700; }
  o.prod = P0 + o.shiv; o.sweat = o.E / 0.675;
  return o;
}
SFA.sim({
  id: "b5-c04-temperature", ch: "c04", tag: "Classique",
  titre: "De −10 à 40 °C : les réponses du corps",
  resume: "Température extérieure et vêtements → vasomotricité, frissons, sudation.",
  but: "Fais varier la température de l'air et l'épaisseur des vêtements. Repère les zones où le corps règle sa température par la peau seule, puis par les frissons, puis par la sueur, et la limite où la régulation est dépassée (température du corps qui dérive).",
  aRetenir: "La température du corps (≈ 37 °C) dépend du bilan chaleur produite − chaleur perdue. Quand il fait froid : vasoconstriction (moins de chaleur perdue par la peau), puis frissons (plus de chaleur produite). Quand il fait chaud : vasodilatation, puis sudation (l'évaporation refroidit). Le centre de régulation est l'hypothalamus.",
  piege: "La température du corps ne suit pas celle de l'extérieur tant que la régulation fonctionne. Et le froid « ne donne pas » la grippe : les infections sont dues à des virus. Valeurs d'un adulte au repos, modèle simplifié (chaleur produite au repos : 80 W).",
  build: function(k, S){
    var c1 = k.canvas(230), c2 = k.canvas(130), pal = S.draw.palette;
    var Ta = k.slider("Température de l'air", -10, 40, 1, 10, "°C");
    var iso = k.slider("Vêtements (0 = nu, 1 = habits légers, 2 = tenue chaude)", 0, 2, 0.25, 1, "");
    var ro = k.readouts(["Production de chaleur", "Chaleur perdue", "Sudation", "Température du corps après 1 h"]);
    var nt = k.note("", "");
    k.draw(function(){
      var r = thermo(Ta.value, iso.value), T, a = [], b = [], cc = [];
      for (T = -10; T <= 40; T += 1){ var q = thermo(T, iso.value); a.push([T, q.vc * 100]); b.push([T, q.shiv / 240 * 100]); cc.push([T, Math.max(q.vd * 0 + q.E / 700 * 100, 0)]); }
      c1.clear();
      var ax = S.draw.axes(c1, {x0: -10, x1: 40, y0: 0, y1: 100, xl: "T air (°C)", yl: "% du maximum", stepX: 10, stepY: 25});
      B5.poly(c1, ax, a, pal.teal, 2.4); B5.poly(c1, ax, b, pal.red, 2.4); B5.poly(c1, ax, cc, pal.amber, 2.4);
      B5.leg(c1, [["vasoconstriction", pal.teal], ["frissons", pal.red], ["sudation", pal.amber]], ax.L + 8, ax.T + 34);
      S.draw.line(c1, ax.X(Ta.value), ax.T, ax.X(Ta.value), ax.B, pal.ink, 1.6, [5, 4]);
      c2.clear();
      var pr = r.prod, lo = Math.max(0, r.loss) + r.E, xs = 24, W = c2.W - 2 * xs;
      S.draw.text(c2, "Production : " + S.fmt(pr, 0) + " W", xs, 20, {align: "left", size: 12, color: pal.red});
      B5.bar(c2, xs, 30, W, 18, pr / 400, pal.red);
      S.draw.text(c2, "Pertes (peau + évaporation) : " + S.fmt(lo, 0) + " W", xs, 72, {align: "left", size: 12, color: pal.teal});
      B5.bar(c2, xs, 82, W, 18, lo / 400, pal.teal);
      S.draw.text(c2, "échelle : 0 à 400 W", c2.W - xs, 118, {align: "right", size: 12, color: pal.grey});
      var dT = dTh(r.net);
      ro.set(0, S.fmt(pr, 0) + " W"); ro.set(1, S.fmt(Math.max(0, r.loss), 0) + " W"); ro.set(2, S.fmt(r.sweat, 0) + " g/h"); ro.set(3, S.fmt(37 + dT, 1) + " °C");
      if (dT < -0.05) nt.set("Régulation dépassée : malgré 4 fois la production de repos (frissons maximaux), le corps perd plus qu'il ne produit : hypothermie (≈ " + S.fmt(dT, 1) + " °C par heure).", "warn");
      else if (dT > 0.05) nt.set("Évaporation maximale dépassée dans ce modèle : la température du corps monte de " + S.fmt(dT, 1) + " °C par heure.", "warn");
      else if (r.regime === "froid") nt.set("Froid : vasoconstriction maximale puis frissons (" + S.fmt(r.shiv, 0) + " W supplémentaires) : la température se maintient à 37 °C.", "warn");
      else if (r.regime === "chaud") nt.set("Chaud : vasodilatation maximale puis sudation (" + S.fmt(r.sweat, 0) + " g/h d'eau évaporée) : 37 °C maintenus.", "warn");
      else nt.set("Zone de régulation par la seule circulation de la peau : vasoconstriction " + S.fmt(r.vc * 100, 0) + " %, vasodilatation " + S.fmt(r.vd * 100, 0) + " %.", "ok");
    });
  }
});

/* ---------- coup de chaleur ---------- */
function ps(T){ return 0.6112 * Math.exp(17.62 * T / (243.12 + T)); }    /* kPa */
SFA.sim({
  id: "b5-c04-chaleur", ch: "c04", tag: "Sécurité",
  titre: "Coup de chaleur : humidité, effort, température",
  resume: "Air chaud et humide + effort → la sueur peut-elle s'évaporer assez ?",
  but: "Règle la température, l'humidité et l'intensité de l'effort. Observe si l'évaporation possible couvre l'évaporation nécessaire. Sinon la chaleur s'accumule : cherche le temps avant d'atteindre 40 °C au centre du corps.",
  aRetenir: "Pour rester à 37 °C quand il fait chaud, le corps doit évaporer de la sueur. Mais l'évaporation est limitée par l'humidité de l'air : à 100 % d'humidité, la sueur ne s'évapore plus et ruisselle sans refroidir. L'effort produit de la chaleur (plusieurs centaines de watts). Au-delà de 40 °C : coup de chaleur, urgence vitale.",
  piege: "Boire ne suffit pas : si l'air est saturé d'eau, la sueur ne refroidit plus. Et le thermomètre de l'air seul ne dit rien : c'est la combinaison température, humidité et effort qui compte. Valeurs d'un modèle simplifié, non utilisables pour juger un risque réel.",
  build: function(k, S){
    var c1 = k.canvas(220), c2 = k.canvas(190), pal = S.draw.palette;
    var Ta = k.slider("Température de l'air", 20, 45, 1, 33, "°C");
    var RH = k.slider("Humidité relative", 10, 100, 5, 70, "%");
    var P = k.slider("Production de chaleur (effort)", 80, 800, 20, 400, "W");
    var ro = k.readouts(["Évaporation nécessaire", "Évaporation possible", "Chaleur stockée", "Temps avant 40 °C"]);
    var nt = k.note("", "");
    function emax(T, rh){ return Math.max(0, 74 * 1.8 * (ps(35) - rh / 100 * ps(T))); }
    k.draw(function(){
      var dry = 14 * (35 - Ta.value), Ereq = P.value - dry, Em = Math.min(emax(Ta.value, RH.value), 1000);
      var E = Math.max(0, Math.min(Ereq, Em)), stor = Ereq > 0 ? Math.max(0, Ereq - Em) : 0 - Math.max(0, -Ereq);
      var rate = dTh(stor);
      c1.clear();
      var ax = S.draw.axes(c1, {x0: 0, x1: 120, y0: 36, y1: 42, xl: "t (min)", yl: "T corps (°C)", stepX: 20, stepY: 1});
      c1.ctx.fillStyle = "rgba(180,35,24,.10)"; c1.ctx.fillRect(ax.X(0), ax.Y(42), ax.X(120) - ax.X(0), ax.Y(40) - ax.Y(42));
      S.draw.text(c1, "coup de chaleur (≥ 40 °C)", ax.R - 6, ax.Y(41), {align: "right", size: 12, color: pal.red});
      var pts = []; for (var t = 0; t <= 120; t += 2){ pts.push([t, Math.min(42, Math.max(37, 37 + (rate > 0 ? rate * t / 60 : 0)))]); }
      B5.poly(c1, ax, pts, pal.violet, 3);
      c2.clear();
      var ax2 = S.draw.axes(c2, {x0: 10, x1: 100, y0: 0, y1: 1000, xl: "humidité (%)", yl: "W", stepX: 10, stepY: 250});
      var pe = []; for (var h = 10; h <= 100; h += 2) pe.push([h, Math.min(1000, emax(Ta.value, h))]);
      B5.poly(c2, ax2, pe, pal.teal, 2.6);
      var ev = Math.max(0, Math.min(1000, Ereq));
      S.draw.line(c2, ax2.X(10), ax2.Y(ev), ax2.X(100), ax2.Y(ev), pal.red, 2, [6, 4]);
      B5.leg(c2, [["évaporation possible", pal.teal], ["nécessaire", pal.red]], ax2.L + 8, ax2.T + 34);
      S.draw.dot(c2, ax2.X(RH.value), ax2.Y(Math.min(1000, emax(Ta.value, RH.value))), 6, pal.ink);
      var tmin = rate > 0.001 ? 3 / rate * 60 : Infinity;
      ro.set(0, S.fmt(Math.max(0, Ereq), 0) + " W"); ro.set(1, S.fmt(Em, 0) + " W"); ro.set(2, S.fmt(Math.max(0, stor), 0) + " W"); ro.set(3, isFinite(tmin) ? S.fmt(tmin, 0) + " min" : "jamais (régulation efficace)");
      if (Ereq <= 0) nt.set("L'air est assez frais pour que la peau perde la chaleur sans sudation : aucun risque de surchauffe.", "ok");
      else if (stor > 0) nt.set("L'air ne peut absorber que " + S.fmt(Em, 0) + " W de sueur pour " + S.fmt(Ereq, 0) + " W nécessaires : " + S.fmt(stor, 0) + " W s'accumulent, soit + " + S.fmt(rate, 1) + " °C par heure. Arrêter l'effort et se mettre à l'ombre !", "warn");
      else nt.set("Sudation de " + S.fmt(Ereq / 0.675, 0) + " g/h (≈ " + S.fmt(Ereq / 0.675 / 1000, 2) + " L/h) : suffisante, mais il faut boire pour compenser.", "ok");
    });
  }
});

/* ---------- lézard et mammifère ---------- */
SFA.sim({
  id: "b5-c04-ectotherme", ch: "c04", tag: "Comparaison",
  titre: "Lézard (ectotherme) contre mammifère (endotherme)",
  resume: "Température ambiante → température du corps, dépense d'énergie et activité.",
  but: "Compare deux animaux selon la température de l'air. Observe qui garde sa température, qui dépense le plus d'énergie, et quand le lézard peut courir. Active le bain de soleil pour voir comment un ectotherme régule son comportement.",
  aRetenir: "Un endotherme produit sa chaleur : température constante, mais forte dépense d'énergie (surtout au froid). Un ectotherme dépend de la température extérieure : très économe, mais son activité dépend du milieu. Il règle sa température par son comportement (soleil, ombre).",
  piege: "Ectotherme ne veut pas dire « sang froid » : un lézard au soleil peut avoir un corps à 35 °C. Et endotherme ne veut pas dire « plus évolué » : chaque stratégie a des coûts et des avantages. Valeurs en unités arbitraires.",
  build: function(k, S){
    var c1 = k.canvas(190), c2 = k.canvas(190), pal = S.draw.palette;
    var Ta = k.slider("Température de l'air", 0, 45, 1, 20, "°C");
    var sun = k.toggle("Le lézard prend un bain de soleil (+ 10 °C, max 36 °C)", false);
    var ro = k.readouts(["T corps lézard", "Activité du lézard", "Énergie mammifère", "Énergie lézard"]);
    var nt = k.note("", "");
    function tbL(T, s){ return s && T < 36 ? Math.min(T + 10, 36) : T; }
    function mrM(T){ return T < 28 ? 100 * (1 + 0.07 * (28 - T)) : (T > 35 ? 100 + 10 * (T - 35) : 100); }
    function mrL(Tb){ return 15 * Math.pow(2, (Tb - 37) / 10); }
    function perf(Tb){ return Tb < 8 || Tb > 42 ? 0 : Math.exp(-Math.pow((Tb - 35) / 8, 2)); }
    k.draw(function(){
      var T, a = [], b = [], m = [], l = [], s = sun.value;
      for (T = 0; T <= 45; T += 1){ a.push([T, 37]); b.push([T, tbL(T, s)]); m.push([T, mrM(T)]); l.push([T, mrL(tbL(T, s))]); }
      c1.clear();
      var ax = S.draw.axes(c1, {x0: 0, x1: 45, y0: 0, y1: 45, xl: "T air (°C)", yl: "T corps (°C)", stepX: 5, stepY: 10});
      B5.poly(c1, ax, a, pal.red, 2.6); B5.poly(c1, ax, b, pal.green, 2.6);
      B5.leg(c1, [["mammifère", pal.red], ["lézard", pal.green]], ax.L + 8, ax.T + 34);
      S.draw.line(c1, ax.X(Ta.value), ax.T, ax.X(Ta.value), ax.B, pal.ink, 1.4, [5, 4]);
      c2.clear();
      var ax2 = S.draw.axes(c2, {x0: 0, x1: 45, y0: 0, y1: 320, xl: "T air (°C)", yl: "énergie (u.a.)", stepX: 5, stepY: 80});
      B5.poly(c2, ax2, m, pal.red, 2.6); B5.poly(c2, ax2, l, pal.green, 2.6);
      S.draw.line(c2, ax2.X(Ta.value), ax2.T, ax2.X(Ta.value), ax2.B, pal.ink, 1.4, [5, 4]);
      var tb = tbL(Ta.value, s), pf = perf(tb), em = mrM(Ta.value), el = mrL(tb);
      ro.set(0, S.fmt(tb, 0) + " °C"); ro.set(1, S.fmt(pf * 100, 0) + " %"); ro.set(2, S.fmt(em, 0)); ro.set(3, S.fmt(el, 1) + " (÷ " + S.fmt(em / el, 0) + ")");
      if (tb > 42) nt.set("Au-dessus de 42 °C, le lézard est en danger (température critique) : il doit chercher l'ombre.", "warn");
      else if (pf < 0.2) nt.set("Trop froid pour être actif (" + S.fmt(pf * 100, 0) + " % de ses performances) : le lézard est engourdi. Le mammifère reste actif mais brûle " + S.fmt(em / el, 0) + " fois plus d'énergie.", "warn");
      else nt.set("Le lézard est actif à " + S.fmt(pf * 100, 0) + " % de ses performances, avec " + S.fmt(em / el, 0) + " fois moins d'énergie dépensée que le mammifère.", "ok");
    });
  }
});

/* ---------- fièvre ---------- */
SFA.sim({
  id: "b5-c04-fievre", ch: "c04", tag: "Original",
  titre: "La fièvre : l'hypothalamus remonte la consigne",
  resume: "Dose de pyrogène, antipyrétique → consigne, température et sensations au fil des heures.",
  but: "Une infection libère des pyrogènes à partir de la 2e heure et jusqu'à la 14e. Choisis leur intensité et déplace le curseur du temps. Observe comment la température du corps suit la consigne, quelles sensations apparaissent au début et à la fin, et l'effet d'un antipyrétique pris à la 8e heure.",
  aRetenir: "Dans la fièvre, la consigne de l'hypothalamus est relevée : le corps se comporte comme s'il avait froid (frissons, vasoconstriction) jusqu'à atteindre la nouvelle consigne. Quand la consigne revient à 37 °C, il se comporte comme s'il avait chaud (sueurs, vasodilatation). La thermorégulation fonctionne toujours : c'est la consigne qui change.",
  piege: "La fièvre n'est pas un dérèglement de la thermorégulation (contrairement au coup de chaleur) et n'est pas « la maladie » : c'est une réponse. Un antipyrétique abaisse la consigne, il ne soigne pas l'infection. Modèle simplifié.",
  build: function(k, S){
    var c = k.canvas(280), pal = S.draw.palette;
    var lev = k.slider("Quantité de pyrogènes", 0, 100, 5, 60, "%");
    var anti = k.toggle("Antipyrétique pris à la 8e heure (effet 4 h)", false);
    var tm = k.slider("Instant observé", 0, 24, 0.5, 6, "h");
    var ro = k.readouts(["Consigne à cet instant", "T du corps", "Phase", "Maximum atteint"]);
    var nt = k.note("", "");
    function setp(t){ var s = 37 + 3.5 * lev.value / 100; if (t < 2 || t >= 14) return 37; if (anti.value && t >= 8 && t < 12) return 37; return s; }
    k.draw(function(){
      var T = 37, dt = 1 / 60, pts = [], sp = [], at = {}, mx = 37, t, i;
      for (t = 0; t <= 24 + 1e-9; t += dt){
        var s = setp(t), r = Math.max(-1, Math.min(1.5, 0.9 * (s - T)));
        T += r * dt; if (T > mx) mx = T;
        if (i === undefined) i = 0;
        pts.push([t, T]); sp.push([t, s]);
      }
      var idx = Math.round(tm.value * 60), Tn = pts[idx][1], Sn = sp[idx][1];
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 24, y0: 36, y1: 41, xl: "heure", yl: "T (°C)", stepX: 4, stepY: 1});
      c.ctx.fillStyle = "rgba(180,35,24,.08)"; c.ctx.fillRect(ax.X(0), ax.Y(41), ax.X(24) - ax.X(0), ax.Y(40) - ax.Y(41));
      B5.poly(c, ax, sp.filter(function(p, j){ return j % 2 === 0; }), pal.green, 2, [6, 4]); B5.poly(c, ax, pts, pal.violet, 3);
      B5.leg(c, [["T du corps", pal.violet], ["consigne", pal.green]], ax.L + 8, ax.T + 34);
      S.draw.line(c, ax.X(tm.value), ax.T, ax.X(tm.value), ax.B, pal.ink, 1.4, [5, 4]); S.draw.dot(c, ax.X(tm.value), ax.Y(Tn), 6, pal.red);
      var d = Sn - Tn, ph = d > 0.3 ? "froid (frissons)" : d < -0.3 ? "chaud (sueurs)" : "plateau";
      ro.set(0, S.fmt(Sn, 1) + " °C"); ro.set(1, S.fmt(Tn, 1) + " °C"); ro.set(2, ph); ro.set(3, S.fmt(mx, 1) + " °C");
      if (mx >= 40) nt.set("Fièvre très élevée (≥ 40 °C) : consulter. La limite de danger est 41 °C et plus.", "warn");
      else if (lev.value === 0) nt.set("Sans pyrogène : la consigne reste à 37 °C et la température aussi.", "");
      else nt.set("Fièvre de " + S.fmt(mx, 1) + " °C au maximum. Pendant la montée on grelotte alors que le corps est déjà chaud : l'écart consigne − température commande les frissons.", "ok");
    });
  }
});
})();
