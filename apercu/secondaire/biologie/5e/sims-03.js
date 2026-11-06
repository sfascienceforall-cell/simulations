/* Chapitre 3 · Hormones, rétrocontrôle et glycémie */
(function(){
/* Modèle simplifié glycémie-insuline-glucagon (type « modèle minimal ») : unités arbitraires pour l'insuline.
   G en g/L ; apport par un repas ; insuline sécrétée si G > 1,0 g/L ; glucagon relevé si G < 0,85 g/L. */
var P1 = 0.012, P2 = 0.03, P3 = 1.6e-4, IB = 8, GB = 0.9, NN = 0.12, GAM = 0.008, HH = 1.0, VG = 8;
var EGP = (P1 + P3 * IB / P2) * GB;
function run(meals, res, cap, T, tau, inj, st){
  var G = st[0], I = st[1], X = st[2], A = st[3], out = {G: [], I: [], A: [], X: []};
  for (var t = 0; t < T; t++){
    var Ra = 0;
    for (var m = 0; m < meals.length; m++){ var s = t - meals[m][0]; if (s > 0) Ra += (meals[m][1] * 0.9 / VG) * (s / (tau * tau)) * Math.exp(-s / tau); }
    var sec = cap * (NN * IB + GAM * Math.max(0, G - HH) * 1000);
    var dG = EGP - (P1 + X) * G + Ra + 0.0035 * (A - 1);
    var dX = -P2 * X + P3 * (1 - res) * I;
    var dI = -NN * I + sec + (inj ? inj(t) : 0);
    A += -0.1 * (A - (1 + 6 * Math.max(0, 0.85 - G) / 0.3));
    G = Math.min(Math.max(G + dG, 0.15), 6); X += dX; I = Math.max(I + dI, 0);
    out.G.push(G); out.I.push(I); out.A.push(A); out.X.push(X);
  }
  return out;
}
function gluco(o){
  var res = o.res || 0, cap = o.cap === undefined ? 1 : o.cap, tau = o.tau || 35, base = o.base || 0;
  var pre = run([], res, cap, 3000, tau, function(){ return base; }, [GB, IB * cap + (base / NN), P3 * (1 - res) * (IB * cap + base / NN) / P2, 1]);
  var l = pre.G.length - 1;
  return run(o.meals || [], res, cap, o.T || 480, tau, o.inj, [pre.G[l], pre.I[l], pre.X[l], pre.A[l]]);
}
var TAU = {h: 25, m: 35, b: 60};

SFA.sim({
  id: "b5-c03-repas", ch: "c03", tag: "Classique",
  titre: "Un repas : glycémie, insuline et glucagon",
  resume: "Glucides ingérés et type d'aliment → montée de la glycémie et réponse hormonale.",
  but: "Fais varier la quantité de glucides et la vitesse d'absorption. Observe le pic de glycémie, le retour à la valeur de départ, et la courbe d'insuline qui suit la glycémie. Cherche une quantité de glucides qui garde la glycémie sous 1,4 g/L.",
  aRetenir: "La glycémie (≈ 0,7–1,1 g/L à jeun) est réglée par rétrocontrôle négatif : si elle monte, le pancréas sécrète de l'insuline, qui fait entrer le glucose dans les cellules et stocker le glycogène dans le foie et les muscles ; la glycémie redescend, la sécrétion d'insuline diminue. Si elle baisse trop, le glucagon fait libérer du glucose par le foie.",
  piege: "L'insuline ne fait pas monter la glycémie : elle la fait baisser. Et la sécrétion n'est pas « arrêtée définitivement » : elle s'ajuste en continu. Modèle simplifié, insuline en unités arbitraires ; pour de très gros repas rapides (plus de 100 g), le pic du modèle est exagéré : chez une personne en bonne santé, il dépasse rarement 1,6 à 1,8 g/L.",
  build: function(k, S){
    var c1 = k.canvas(200), c2 = k.canvas(130), c3 = k.canvas(110), pal = S.draw.palette;
    var D = k.slider("Glucides ingérés", 0, 150, 5, 50, "g");
    var ali = k.seg("Aliment", [["h", "IG élevé"], ["m", "IG moyen"], ["b", "IG bas"]], "m");
    var ro = k.readouts(["Pic de glycémie", "Moment du pic", "Retour sous 1,1 g/L", "Pic d'insuline"]);
    var nt = k.note("", "");
    k.draw(function(){
      var r = gluco({meals: [[30, D.value]], tau: TAU[ali.value], T: 360});
      var G = r.G, pk = 0, ip = 0, i;
      for (i = 0; i < G.length; i++) if (G[i] > pk){ pk = G[i]; ip = i; }
      var back = -1; if (pk > 1.1) for (i = ip; i < G.length; i++) if (G[i] <= 1.1){ back = i; break; }
      c1.clear();
      var ax = S.draw.axes(c1, {x0: 0, x1: 360, y0: 0, y1: 3, xl: "t (min)", yl: "glycémie (g/L)", stepX: 60, stepY: 0.5});
      c1.ctx.fillStyle = "rgba(46,107,85,.12)"; c1.ctx.fillRect(ax.X(0), ax.Y(1.1), ax.X(360) - ax.X(0), ax.Y(0.7) - ax.Y(1.1));
      S.draw.text(c1, "zone normale 0,7–1,1", ax.R - 6, ax.Y(0.9), {align: "right", size: 12, color: pal.green});
      B5.poly(c1, ax, G.map(function(g, t){ return [t, g]; }), pal.violet, 2.8);
      S.draw.line(c1, ax.X(30), ax.T, ax.X(30), ax.B, pal.amber, 1.5, [5, 4]); S.draw.text(c1, "repas", ax.X(30) + 4, ax.T + 10, {align: "left", size: 12, color: pal.amber});
      c2.clear();
      var maxI = Math.max.apply(null, r.I), maxA = Math.max.apply(null, r.A);
      var ax2 = S.draw.axes(c2, {x0: 0, x1: 360, y0: 0, y1: Math.max(40, Math.ceil(maxI / 20) * 20), xl: "t (min)", yl: "insuline (u.a.)", stepX: 60, grid: true});
      B5.poly(c2, ax2, r.I.map(function(v, t){ return [t, v]; }), pal.red, 2.6);
      B5.leg(c2, [["insuline", pal.red]], ax2.L + 8, ax2.T + 34);
      c3.clear();
      var ax3 = S.draw.axes(c3, {x0: 0, x1: 360, y0: 0, y1: 4, xl: "t (min)", yl: "glucagon (base = 1)", stepX: 60, stepY: 1});
      B5.poly(c3, ax3, r.A.map(function(a, t){ return [t, Math.min(a, 4)]; }), pal.amber, 2.6);
      ro.set(0, S.fmt(pk, 2) + " g/L"); ro.set(1, D.value && ip >= 30 ? S.fmt(ip - 30, 0) + " min après le début" : "—");
      ro.set(2, D.value === 0 || pk <= 1.1 ? "pas de dépassement" : back < 0 ? "> 5 h" : S.fmt(back - 30, 0) + " min après le début"); ro.set(3, S.fmt(maxI, 0) + " u.a. (repos : 8)");
      if (D.value === 0) nt.set("Pas de repas : la glycémie reste à 0,9 g/L, l'insuline à sa valeur de base.", "");
      else if (pk > 1.4) nt.set("Pic à " + S.fmt(pk, 2) + " g/L (> 1,4) : plus l'absorption est rapide (IG élevé) et la quantité grande, plus le pic est haut, et plus la sécrétion d'insuline est forte.", "warn");
      else nt.set("Pic modéré (" + S.fmt(pk, 2) + " g/L) : l'insuline absorbe la hausse.", "ok");
    });
  }
});

/* ---------- diabètes ---------- */
SFA.sim({
  id: "b5-c03-diabete", ch: "c03", tag: "Comparaison",
  titre: "Diabète de type 1, de type 2, ou bien portant ?",
  resume: "Sécrétion d'insuline et sensibilité des cellules → glycémie après le repas.",
  but: "Choisis un profil ou règle toi-même la sécrétion d'insuline et la résistance des cellules. Compare la glycémie à jeun et la réponse à un repas de 60 g de glucides à celle d'une personne en bonne santé (pointillés).",
  aRetenir: "Type 1 : les cellules β du pancréas sont détruites (maladie auto-immune) : plus ou presque plus d'insuline, la glycémie s'envole. Type 2 : l'insuline est présente mais les cellules cibles y répondent mal (résistance) et la sécrétion finit par s'épuiser. Critère OMS : glycémie à jeun ≥ 1,26 g/L (à confirmer) = diabète.",
  piege: "Le diabète n'est pas « trop de sucre mangé ». Dans le type 1, il n'y a pas assez d'insuline ; dans le type 2, les cellules cibles n'obéissent plus. Le type 1 n'est pas causé par l'alimentation. Valeurs d'un modèle simplifié, non diagnostiques.",
  build: function(k, S){
    var c1 = k.canvas(210), c2 = k.canvas(150), pal = S.draw.palette;
    var res, cap;
    var pr = k.select("Profil", [["n", "En bonne santé"], ["1", "Diabète de type 1 (non traité)"], ["2", "Diabète de type 2"], ["p", "Prédiabète"], ["x", "Réglage libre"]], "2", function(v){
      var m = {n: [0, 100], 1: [0, 0], 2: [70, 40], p: [60, 70]}[v]; if (m){ res.set(m[0]); cap.set(m[1]); }
    });
    res = k.slider("Résistance à l'insuline", 0, 90, 5, 70, "%");
    cap = k.slider("Capacité de sécrétion d'insuline", 0, 100, 5, 40, "%");
    var ro = k.readouts(["Glycémie à jeun", "Pic après repas", "2 h après le repas", "Verdict (à jeun)"]);
    var nt = k.note("", "");
    k.draw(function(){
      var a = gluco({meals: [[30, 60]], res: 0, cap: 1, T: 300}), b = gluco({meals: [[30, 60]], res: res.value / 100, cap: cap.value / 100, T: 300});
      var pk = Math.max.apply(null, b.G), fast = b.G[0], two = b.G[150];
      c1.clear();
      var ax = S.draw.axes(c1, {x0: 0, x1: 300, y0: 0, y1: 6, xl: "t (min)", yl: "glycémie (g/L)", stepX: 60, stepY: 1});
      c1.ctx.fillStyle = "rgba(180,35,24,.08)"; c1.ctx.fillRect(ax.X(0), ax.T, ax.X(300) - ax.X(0), ax.Y(1.26) - ax.T);
      S.draw.line(c1, ax.X(0), ax.Y(1.26), ax.X(300), ax.Y(1.26), pal.red, 1.2, [5, 4]); S.draw.text(c1, "1,26", ax.X(300) - 4, ax.Y(1.26) - 8, {align: "right", size: 12, color: pal.red});
      B5.poly(c1, ax, a.G.map(function(g, t){ return [t, g]; }), pal.grey, 2, [6, 4]);
      B5.poly(c1, ax, b.G.map(function(g, t){ return [t, g]; }), pal.violet, 2.8);
      c2.clear();
      var ymax = Math.max(40, Math.ceil(Math.max.apply(null, b.I) / 20) * 20);
      var ax2 = S.draw.axes(c2, {x0: 0, x1: 300, y0: 0, y1: ymax, xl: "t (min)", yl: "insuline (u.a.)", stepX: 60});
      B5.poly(c2, ax2, a.I.map(function(v, t){ return [t, v]; }), pal.grey, 2, [6, 4]); B5.poly(c2, ax2, b.I.map(function(v, t){ return [t, v]; }), pal.red, 2.6);
      var verdict = fast >= 1.26 ? "≥ 1,26 : diabète" : fast >= 1.10 ? "1,10–1,25 : anormale" : "normale";
      ro.set(0, S.fmt(fast, 2) + " g/L"); ro.set(1, S.fmt(pk, 2) + " g/L"); ro.set(2, S.fmt(two, 2) + " g/L"); ro.set(3, verdict);
      var comp = res.value >= 50 && cap.value >= 70;
      if (cap.value === 0) nt.set("Sans insuline : le glucose ne peut pas entrer dans les cellules, la glycémie s'envole (modèle plafonné à 6 g/L). C'est le diabète de type 1 non traité.", "warn");
      else if (fast >= 1.26) nt.set(comp ? "Les cellules sont très résistantes : même avec beaucoup d'insuline, la glycémie à jeun reste ≥ 1,26 g/L (critère de diabète). Les cellules β finissent par s'épuiser." : "Hyperglycémie à jeun persistante : critère de diabète. Insuline présente mais inefficace ou insuffisante.", "warn");
      else if (fast >= 1.10) nt.set("Glycémie à jeun anormale (1,10 à 1,25 g/L) : " + (comp ? "le pancréas compense par une forte sécrétion d'insuline, mais la régulation est déjà moins efficace (prédiabète). Les cellules β peuvent s'épuiser." : "la régulation est moins efficace (prédiabète), à surveiller."), "warn");
      else if (comp) nt.set("Les cellules sont résistantes mais le pancréas compense : très forte insuline, glycémie encore proche de la normale. Les cellules β finissent par s'épuiser.", "warn");
      else nt.set("Régulation efficace : la glycémie revient vers la valeur de base.", "ok");
    });
  }
});

/* ---------- thermostat ---------- */
SFA.sim({
  id: "b5-c03-thermostat", ch: "c03", tag: "Original",
  titre: "Le thermostat : un rétrocontrôle négatif pas à pas",
  resume: "Consigne, perturbation et gain → la grandeur réglée revient-elle à la consigne ?",
  but: "Une pièce chauffée par un radiateur : à t = 30 min, la température extérieure change. Compare la pièce sans régulation (pointillés) et avec un thermostat dont tu règles la sensibilité (gain). Cherche le gain pour lequel l'écart à la consigne reste sous 0,5 °C.",
  aRetenir: "Un système de régulation comprend un capteur, un centre qui compare à la consigne, un effecteur. Le rétrocontrôle négatif corrige l'écart dans le sens opposé à la perturbation. Plus la réponse est sensible, plus la valeur reste proche de la consigne. La glycémie, la température du corps, la calcémie sont réglées ainsi.",
  piege: "Un rétrocontrôle négatif ne ramène pas toujours exactement à la consigne (écart résiduel, surtout si le gain est faible) et ne « stabilise » pas si l'effecteur est saturé (chauffage au maximum). Modèle d'analogie : ni la pièce ni un humain ne sont aussi simples.",
  build: function(k, S){
    var c = k.canvas(300), pal = S.draw.palette;
    var Ts = k.slider("Consigne du thermostat", 20, 26, 0.5, 22, "°C");
    var Te = k.slider("Température extérieure après t = 30 min", -10, 30, 1, 0, "°C");
    var g = k.slider("Gain (sensibilité du thermostat)", 0, 2, 0.05, 0.5, "");
    var ro = k.readouts(["T finale (avec thermostat)", "Écart à la consigne", "T finale (sans régulation)", "Chauffage final"]);
    var nt = k.note("", "");
    k.draw(function(){
      var a = 0.05, b = 1.5, dt = 0.1, T1 = Ts.value, T2 = Ts.value, u0 = Math.max(0, a * (Ts.value - 20) / b), pts1 = [], pts2 = [], uu = 0, N = 120;
      for (var t = 0; t <= N + 1e-9; t += dt){
        var Tx = t < 30 ? 20 : Te.value;
        uu = Math.min(1, Math.max(0, g.value * (Ts.value - T1)));
        T1 += (-a * (T1 - Tx) + b * uu) * dt;
        T2 += (-a * (T2 - Tx) + b * u0) * dt;
        pts1.push([t, T1]); pts2.push([t, T2]);
      }
      c.clear();
      var ymin = Math.floor(Math.min(Te.value, Ts.value, T1, T2) / 2) * 2 - 2, ymax = Math.ceil(Math.max(Ts.value, 22, Te.value, T1, T2) / 2) * 2 + 2;
      ymin = Math.min(ymin, 14);
      var ax = S.draw.axes(c, {x0: 0, x1: N, y0: ymin, y1: ymax, xl: "t (min)", yl: "T (°C)", stepX: 20, stepY: 4});
      S.draw.line(c, ax.X(0), ax.Y(Ts.value), ax.X(N), ax.Y(Ts.value), pal.green, 1.6, [6, 4]); S.draw.text(c, "consigne", ax.X(N) - 4, ax.Y(Ts.value) - 9, {align: "right", size: 12, color: pal.green});
      S.draw.line(c, ax.X(30), ax.T, ax.X(30), ax.B, pal.amber, 1.5, [5, 4]); S.draw.text(c, "perturbation", ax.X(30) + 4, ax.B - 10, {align: "left", size: 12, color: pal.amber});
      B5.poly(c, ax, pts2, pal.grey, 2.2, [6, 4]); B5.poly(c, ax, pts1, pal.violet, 2.8);
      B5.leg(c, [["avec thermostat", pal.violet], ["sans régulation", pal.grey]], ax.L + 8, ax.T + 34);
      ro.set(0, S.fmt(T1, 1) + " °C"); ro.set(1, S.fmt(T1 - Ts.value, 1) + " °C"); ro.set(2, S.fmt(T2, 1) + " °C"); ro.set(3, S.fmt(uu * 100, 0) + " % de la puissance");
      if (g.value === 0) nt.set("Gain nul : le thermostat ne commande rien, c'est comme s'il n'y avait pas de régulation (la pièce suit l'extérieur).", "warn");
      else if (uu <= 0.001 && T1 - Ts.value > 0.5) nt.set("Chauffage à l'arrêt (0 %) : la pièce est plus chaude que la consigne et ce thermostat ne sait que chauffer, il ne peut pas refroidir. La température dérive vers celle de l'extérieur.", "warn");
      else if (uu >= 0.999 && Math.abs(T1 - Ts.value) > 0.5) nt.set("Chauffage saturé à 100 % : la perturbation est trop forte, la consigne ne peut plus être tenue.", "warn");
      else if (Math.abs(T1 - Ts.value) <= 0.5) nt.set("Écart de " + S.fmt(Math.abs(T1 - Ts.value), 1) + " °C seulement : la régulation compense bien, alors que sans régulation on dérive de " + S.fmt(Math.abs(T2 - Ts.value), 1) + " °C.", "ok");
      else nt.set("Écart de " + S.fmt(Math.abs(T1 - Ts.value), 1) + " °C : correction partielle. Augmente le gain pour réduire l'écart.", "warn");
    });
  }
});

/* ---------- pompe à insuline ---------- */
SFA.sim({
  id: "b5-c03-pompe", ch: "c03", tag: "Défi",
  titre: "Pompe à insuline : tiens la glycémie 24 h",
  resume: "Débit de base, ratio insuline/glucides, avance du bolus → temps passé dans la cible.",
  but: "Une personne avec un diabète de type 1 mange trois repas. Règle le débit de base, la dose de bolus (1 unité pour X g de glucides) et l'avance du bolus. Objectif : au moins 90 % du temps entre 0,7 et 1,8 g/L, sans hypoglycémie (< 0,7 g/L).",
  aRetenir: "Dans le diabète de type 1, on remplace la sécrétion de base par un débit basal continu et la réponse aux repas par un bolus calculé sur les glucides. Trop d'insuline provoque une hypoglycémie (danger : malaise), trop peu une hyperglycémie. Prendre le bolus un peu avant le repas suit mieux la montée du glucose.",
  piege: "Plus d'insuline n'est pas toujours mieux : une dose trop forte fait chuter la glycémie sous 0,7 g/L. Simulation pédagogique et non outil médical : ne sert pas à régler un vrai traitement.",
  build: function(k, S){
    var c = k.canvas(300), pal = S.draw.palette;
    var basal = k.slider("Débit de base", 0, 2, 0.1, 0.6, "U/h");
    var icr = k.slider("1 unité d'insuline pour…", 4, 30, 1, 25, "g de glucides");
    var adv = k.slider("Bolus pris avant le repas", 0, 30, 5, 0, "min");
    var m1 = k.slider("Petit-déjeuner (8 h)", 20, 100, 5, 60, "g");
    var m2 = k.slider("Déjeuner (12 h 30)", 20, 100, 5, 70, "g");
    var m3 = k.slider("Dîner (19 h)", 20, 100, 5, 80, "g");
    var ro = k.readouts(["Temps dans la cible", "Glycémie min / max", "Hypo (< 0,7)", "Hyper (> 1,8)"]);
    var nt = k.note("", "");
    k.draw(function(){
      var meals = [[480, m1.value], [750, m2.value], [1140, m3.value]];
      var inj = function(t){
        var r = basal.value * 0.96;
        meals.forEach(function(m){ var s = t - (m[0] - adv.value); if (s > 0) r += (m[1] / icr.value) * 40 * (s / 1600) * Math.exp(-s / 40); });
        return r;
      };
      var r = gluco({meals: meals, res: 0, cap: 0, base: basal.value * 0.96, T: 1440, inj: inj});
      var G = r.G, inr = 0, hypo = 0, hyper = 0, mn = 9, mx = 0;
      G.forEach(function(g){ if (g >= 0.7 && g <= 1.8) inr++; if (g < 0.7) hypo++; if (g > 1.8) hyper++; mn = Math.min(mn, g); mx = Math.max(mx, g); });
      c.clear();
      var ax = S.draw.axes(c, {x0: 0, x1: 24, y0: 0, y1: 4, xl: "heure", yl: "g/L", stepX: 4, stepY: 1});
      c.ctx.fillStyle = "rgba(46,107,85,.12)"; c.ctx.fillRect(ax.X(0), ax.Y(1.8), ax.X(24) - ax.X(0), ax.Y(0.7) - ax.Y(1.8));
      S.draw.text(c, "cible 0,7–1,8", ax.R - 6, ax.Y(1.25), {align: "right", size: 12, color: pal.green});
      meals.forEach(function(m, i){ S.draw.line(c, ax.X(m[0] / 60), ax.T, ax.X(m[0] / 60), ax.B, pal.amber, 1.3, [4, 4]); S.draw.text(c, ["matin", "midi", "soir"][i], ax.X(m[0] / 60) + 3, ax.T + 10, {align: "left", size: 12, color: pal.amber}); });
      B5.poly(c, ax, G.map(function(g, t){ return [t / 60, g]; }), pal.violet, 2.8);
      var pc = 100 * inr / 1440;
      ro.set(0, S.fmt(pc, 0) + " %"); ro.set(1, S.fmt(mn, 2) + " / " + S.fmt(mx, 2) + " g/L"); ro.set(2, S.fmt(hypo / 60, 1) + " h"); ro.set(3, S.fmt(hyper / 60, 1) + " h");
      if (hypo > 0) nt.set("Hypoglycémie : " + S.fmt(hypo / 60, 1) + " h sous 0,7 g/L (minimum " + S.fmt(mn, 2) + "). Dose trop forte : réduis le bolus ou le débit de base.", "warn");
      else if (pc >= 90) nt.set("Objectif atteint : " + S.fmt(pc, 0) + " % du temps dans la cible, sans hypoglycémie.", "ok");
      else nt.set("Encore " + S.fmt(hyper / 60, 1) + " h au-dessus de 1,8 g/L : augmente le débit de base ou le bolus, ou prends-le plus tôt.", "warn");
    });
  }
});
})();
