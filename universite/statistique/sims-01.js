/* Biostatistique BA1 · chapitre 1 : statistique descriptive */
(function(){
var P = SFA.draw.palette, F = SFA.fmt;

function Phi(x){ if (x < 0) return 1 - Phi(-x); if (x > 8) return 1; var t = x, s = x, k = 1; for (var i = 0; i < 300; i++){ k += 2; t *= x * x / k; s += t; if (t < 1e-17 * s) break; } return 0.5 + s * Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }
function invPhi(p){ var lo = -9, hi = 9; for (var i = 0; i < 60; i++){ var m = (lo + hi) / 2; if (Phi(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; }
function rng(seed){ var s = seed >>> 0; return function(){ s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gauss(r){ var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function med(a){ var n = a.length, m = n >> 1; return n % 2 ? a[m] : (a[m - 1] + a[m]) / 2; }
/* quartiles : médiane des deux moitiés (médiane exclue si n impair) */
function quart(s){ var n = s.length, h = n >> 1; return [med(s.slice(0, h)), med(s), med(s.slice(n % 2 ? h + 1 : h))]; }
function mean(a){ var t = 0; a.forEach(function(x){ t += x; }); return t / a.length; }
function sd(a){ var m = mean(a), t = 0; a.forEach(function(x){ t += (x - m) * (x - m); }); return Math.sqrt(t / (a.length - 1)); }
function haxis(c, x0, x1, L, R, y, step, lab){
  var ctx = c.ctx; ctx.save(); ctx.strokeStyle = "#8a95a3"; ctx.fillStyle = "#5f6b7a"; ctx.font = "600 11px Mulish, system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top";
  ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(c.W - R, y); ctx.stroke();
  for (var v = Math.ceil(x0 / step) * step; v <= x1 + 1e-9; v += step){ var X = L + (v - x0) / (x1 - x0) * (c.W - L - R); ctx.beginPath(); ctx.moveTo(X, y); ctx.lineTo(X, y + 4); ctx.stroke(); ctx.fillText(F(v, 3), X, y + 6); }
  ctx.restore(); if (lab) SFA.draw.text(c, lab, c.W - R, y + 28, {size: 12, align: "right"});
}
var TQ = [12.706,4.303,3.182,2.776,2.571,2.447,2.365,2.306,2.262,2.228,2.201,2.179,2.160,2.145,2.131,2.120,2.110,2.101,2.093,2.086,2.080,2.074,2.069,2.064,2.060,2.056,2.052,2.048,2.045,2.042];
function tq(df){ if (df <= 30) return TQ[df - 1]; var z = 1.959964, d = df; return z + (Math.pow(z, 3) + z) / (4 * d) + (5 * Math.pow(z, 5) + 16 * Math.pow(z, 3) + 3 * z) / (96 * d * d); }

/* 1 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c01-aberrante", ch: "c01", tag: "Centre et dispersion",
  titre: "Une valeur extrême : qui bouge, qui résiste ?",
  resume: "Déplace une seule valeur et regarde la moyenne, la médiane et l'écart-type réagir.",
  but: "Neuf temps d'attente aux urgences (en minutes) sont fixés. Fais glisser le dixième : la moyenne le suit, la médiane non.",
  aRetenir: "La médiane et l'intervalle interquartile sont résistants à une valeur extrême ; la moyenne et l'écart-type ne le sont pas. Distribution asymétrique ou valeurs atypiques : médiane [Q1 ; Q3].",
  piege: "Moyenne et médiane proches ne prouvent pas que la distribution soit symétrique, mais un grand écart entre elles est un signal d'asymétrie.",
  build: function(k, S){
    var c = k.canvas(280);
    var base = [32, 35, 38, 40, 42, 45, 47, 50, 55];
    var v = k.slider("Dixième valeur", 20, 300, 1, 60, "min");
    var ro = k.readouts(["Moyenne", "Médiane", "Écart-type s", "Q1 – Q3"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var d = base.concat([v.value]).sort(function(a, b){ return a - b; });
      var m = mean(d), q = quart(d), s = sd(d);
      var L = 30, R = 24, x0 = 0, x1 = 320, y = c.H - 60;
      function X(t){ return L + (t - x0) / (x1 - x0) * (c.W - L - R); }
      haxis(c, x0, x1, L, R, y, 40, "temps d'attente (min)");
      d.forEach(function(t){ S.draw.dot(c, X(t), y - 14, 5, t === v.value ? P.red : P.acc); });
      /* moyenne : triangle rouge au-dessus ; médiane : trait vert */
      var ctx = c.ctx; ctx.fillStyle = P.red; ctx.beginPath(); ctx.moveTo(X(m), y - 28); ctx.lineTo(X(m) - 8, y - 48); ctx.lineTo(X(m) + 8, y - 48); ctx.closePath(); ctx.fill();
      S.draw.text(c, "moyenne", X(m) + 12, y - 58, {color: P.red, size: 12, align: "left"});
      S.draw.line(c, X(q[1]), y - 100, X(q[1]), y - 28, P.green, 3);
      S.draw.text(c, "médiane", X(q[1]), y - 110, {color: P.green, size: 12});
      S.draw.line(c, X(q[0]), y + 0, X(q[2]), y + 0, P.amber, 5);
      ro.set(0, F(m, 1) + " min"); ro.set(1, F(q[1], 1) + " min"); ro.set(2, F(s, 1) + " min"); ro.set(3, F(q[0], 1) + " – " + F(q[2], 1));
      var ecart = m - q[1];
      if (v.value > 100) nt.set("Une seule personne attend " + v.value + " min : la moyenne dépasse la médiane de " + F(ecart, 1) + " min et l'écart-type vaut " + F(s, 1) + " min. La médiane (" + F(q[1], 1) + " min) et les quartiles n'ont presque pas bougé. Quartiles : médiane de chaque moitié (barre orange).", "warn");
      else nt.set("Sans valeur extrême, moyenne (" + F(m, 1) + ") et médiane (" + F(q[1], 1) + ") sont proches. Quartiles : médiane de chaque moitié (barre orange).", "ok");
    });
  }
});

/* 2 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c01-histogramme", ch: "c01", tag: "Représenter",
  titre: "Histogramme : la forme dépend du découpage",
  resume: "Largeur de classe et origine : la même série de 150 durées de séjour prend des allures différentes.",
  but: "Change la largeur des classes puis le point de départ de la première classe : la forme de la distribution change, les données non.",
  aRetenir: "Une classe trop étroite montre du bruit, une classe trop large écrase la forme. Vérifie qu'une forme (asymétrie, deux bosses) résiste à un changement d'origine avant de l'interpréter.",
  piege: "L'aire des barres (pas leur hauteur) représente la fréquence quand les classes ont des largeurs inégales : ici les classes sont égales, la hauteur suffit.",
  build: function(k, S){
    var c = k.canvas(320);
    var r = rng(11), data = [];
    for (var i = 0; i < 150; i++){ data.push(Math.round((1.5 + Math.exp(1.1 + 0.55 * gauss(r))) * 10) / 10); }
    data.sort(function(a, b){ return a - b; });
    var mn = data[0], mx = data[data.length - 1];
    var w = k.slider("Largeur de classe", 0.5, 8, 0.5, 2, "jours");
    var o = k.slider("Décalage de la 1re borne", 0, 1, 0.1, 0, "× largeur");
    var ro = k.readouts(["Classes", "Classe modale", "Effectif max", "Moyenne / médiane"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var W = w.value, start = Math.floor(mn / W) * W - o.value * W, nb = Math.ceil((mx - start) / W + 1e-9), cnt = [], j;
      for (j = 0; j < nb; j++) cnt.push(0);
      data.forEach(function(t){ var b = Math.floor((t - start) / W + 1e-9); if (b >= nb) b = nb - 1; if (b < 0) b = 0; cnt[b]++; });
      var cm = Math.max.apply(null, cnt), ymax = Math.ceil(cm * 1.15 / 5) * 5;
      var x1 = start + nb * W;
      var ax = S.draw.axes(c, {x0: start, x1: x1, y0: 0, y1: ymax, xl: "durée de séjour (jours)", yl: "effectif", stepX: W >= 2 ? W : undefined, b: 38});
      var best = 0;
      cnt.forEach(function(n, b){ if (n > cnt[best]) best = b; var xa = ax.X(start + b * W), xb = ax.X(start + (b + 1) * W); c.ctx.fillStyle = b === best ? "rgba(30,63,143,.85)" : "rgba(30,63,143,.55)"; });
      cnt.forEach(function(n, b){ var xa = ax.X(start + b * W), xb = ax.X(start + (b + 1) * W); c.ctx.fillStyle = (b === best) ? "rgba(180,35,24,.75)" : "rgba(30,63,143,.6)"; c.ctx.fillRect(xa + 0.5, ax.Y(n), xb - xa - 1, ax.Y(0) - ax.Y(n)); });
      var mo = mean(data), me = med(data);
      ro.set(0, nb); ro.set(1, F(start + best * W, 1) + " – " + F(start + (best + 1) * W, 1)); ro.set(2, cm); ro.set(3, F(mo, 1) + " / " + F(me, 1) + " j");
      if (W <= 1) nt.set("Classes très étroites : beaucoup de barres de 0 ou 1 individu, la forme se perd dans le bruit.", "warn");
      else if (W >= 6) nt.set("Classes très larges : presque tout tombe dans une ou deux barres, l'asymétrie disparaît.", "warn");
      else nt.set("Asymétrie à droite : la moyenne (" + F(mo, 1) + ") dépasse la médiane (" + F(me, 1) + "). Déplace la 1re borne : la barre modale (en rouge) peut changer de classe.", "ok");
    });
  }
});

/* 3 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c01-boite", ch: "c01", tag: "Quartiles",
  titre: "Boîte à moustaches : lire, comparer, repérer l'atypique",
  resume: "Deux groupes de 40 : décale, élargis, ajoute une valeur extrême et lis la boîte.",
  but: "Le groupe A est fixé (moyenne 100, écart-type 15). Modifie le groupe B et regarde comment la boîte, les moustaches et les points isolés réagissent.",
  aRetenir: "Boîte = de Q1 à Q3 (50 % des valeurs), trait = médiane. Moustaches : jusqu'à la dernière valeur dans [Q1 − 1,5·EIQ ; Q3 + 1,5·EIQ]. Au-delà : valeur atypique (point isolé).",
  piege: "Des boîtes qui se chevauchent ne permettent pas de conclure à « pas de différence » : cela dépend aussi de n. Et un point isolé est atypique, pas forcément une erreur de mesure.",
  build: function(k, S){
    var c = k.canvas(260);
    function grp(m, s){ var a = []; for (var i = 0; i < 40; i++) a.push(m + s * invPhi((i + 0.5) / 40)); return a; }
    var A = grp(100, 15);
    var mb = k.slider("Moyenne de B", 70, 140, 1, 115, "");
    var sb = k.slider("Écart-type de B", 5, 35, 1, 15, "");
    var tg = k.toggle("Ajouter une valeur au groupe B", false);
    var ex = k.slider("Valeur ajoutée", 40, 260, 1, 200, "");
    var ro = k.readouts(["Q1 de B", "Médiane de B", "Q3 de B", "Atypiques B"]);
    var nt = k.note("", "");
    function stats(d){
      var s = d.slice().sort(function(a, b){ return a - b; }), q = quart(s), e = q[2] - q[0], lf = q[0] - 1.5 * e, hf = q[2] + 1.5 * e;
      var inn = s.filter(function(t){ return t >= lf && t <= hf; }), out = s.filter(function(t){ return t < lf || t > hf; });
      return {q: q, lo: inn[0], hi: inn[inn.length - 1], out: out, iqr: e};
    }
    k.draw(function(){
      c.clear();
      var B = grp(mb.value, sb.value); if (tg.value) B.push(ex.value);
      var L = 70, R = 20, x0 = 30, x1 = 270, y = c.H - 52;
      function X(t){ return L + (t - x0) / (x1 - x0) * (c.W - L - R); }
      haxis(c, x0, x1, L, R, y, 20, "valeur du paramètre");
      function box(st, yc, col, name){
        S.draw.line(c, X(st.lo), yc, X(st.hi), yc, col, 2);
        S.draw.line(c, X(st.lo), yc - 8, X(st.lo), yc + 8, col, 2); S.draw.line(c, X(st.hi), yc - 8, X(st.hi), yc + 8, col, 2);
        c.ctx.fillStyle = col + "33"; c.ctx.strokeStyle = col; c.ctx.lineWidth = 2;
        c.ctx.fillRect(X(st.q[0]), yc - 20, X(st.q[2]) - X(st.q[0]), 40); c.ctx.strokeRect(X(st.q[0]), yc - 20, X(st.q[2]) - X(st.q[0]), 40);
        S.draw.line(c, X(st.q[1]), yc - 20, X(st.q[1]), yc + 20, col, 4);
        st.out.forEach(function(t){ c.ctx.strokeStyle = col; c.ctx.lineWidth = 2; c.ctx.beginPath(); c.ctx.arc(X(t), yc, 5, 0, 6.2832); c.ctx.stroke(); });
        S.draw.text(c, name, 34, yc, {size: 14, color: col});
      }
      var sa = stats(A), sb2 = stats(B);
      box(sa, 62, P.acc, "A"); box(sb2, 142, P.red, "B");
      ro.set(0, F(sb2.q[0], 1)); ro.set(1, F(sb2.q[1], 1)); ro.set(2, F(sb2.q[2], 1)); ro.set(3, sb2.out.length);
      var ov = sb2.q[0] < sa.q[2] && sa.q[0] < sb2.q[2];
      nt.set((sb2.out.length ? "Le groupe B a " + sb2.out.length + " valeur(s) atypique(s) (cercles) : au-delà de 1,5 fois l'écart interquartile (" + F(sb2.iqr, 1) + ") hors de la boîte. " : "") + (ov ? "Les deux boîtes se chevauchent : à vue, la différence de niveau est modérée, un test est nécessaire pour conclure." : "Les boîtes ne se chevauchent pas : les centres sont nettement séparés."), sb2.out.length ? "warn" : "ok");
    });
  }
});

/* 4 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c01-et-contre-es", ch: "c01", tag: "Barres d'erreur",
  titre: "Écart-type, erreur standard, IC : trois barres, trois messages",
  resume: "Quand n augmente, l'écart-type reste, l'erreur standard fond. Ne confonds pas les barres d'erreur d'un graphique.",
  but: "Fixe l'écart-type σ de la population et fais varier n : compare la dispersion des individus à la précision de la moyenne.",
  aRetenir: "Écart-type = dispersion des individus (ne dépend pas de n). Erreur standard = s/√n = précision de la moyenne (diminue avec n). IC 95 % ≈ moyenne ± t·ES.",
  piege: "Une barre d'erreur « ± ES » est toujours plus courte qu'une barre « ± ET » : elle fait paraître les données moins dispersées qu'elles ne le sont. Lis toujours la légende.",
  build: function(k, S){
    var c = k.canvas(330);
    var sg = k.slider("Écart-type σ de la population", 5, 30, 1, 15, "");
    var nn = k.slider("Effectif n", 2, 400, 1, 25, "");
    var ro = k.readouts(["Écart-type", "Erreur standard", "Demi-largeur IC 95 %", "t(0,975 ; n−1)"]);
    var nt = k.note("", "");
    var rr = rng(5), jit = [], zs = [];
    for (var i = 0; i < 400; i++){ jit.push(rr()); zs.push(gauss(rr)); }
    k.draw(function(){
      c.clear();
      var n = nn.value, s = sg.value, se = s / Math.sqrt(n), t = tq(n - 1), mu = 100;
      var L = 52, T = 14, B = 34, y0 = 20, y1 = 180;
      function Y(v){ return T + (y1 - v) / (y1 - y0) * (c.H - T - B); }
      var ctx = c.ctx; ctx.save(); ctx.strokeStyle = "#edf0f4"; ctx.fillStyle = "#5f6b7a"; ctx.font = "600 11px Mulish, system-ui"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var g = 20; g <= 180; g += 20){ ctx.beginPath(); ctx.moveTo(L, Y(g)); ctx.lineTo(c.W - 10, Y(g)); ctx.stroke(); ctx.fillText(g, L - 6, Y(g)); } ctx.restore();
      var zone = (c.W - L - 10) * 0.5;
      /* individus : valeurs z fixes, échelle σ */
      var tot = 0, sumsq = 0; for (var j = 0; j < n; j++){ tot += zs[j]; }
      for (j = 0; j < n; j++){ var v = mu + s * zs[j], px = L + 14 + jit[j] * (zone - 28); if (v > y0 && v < y1) S.draw.dot(c, px, Y(v), 3, "rgba(30,63,143,.55)"); }
      S.draw.text(c, "n = " + n + " individus", L + zone / 2, c.H - 14, {size: 12, color: P.grey});
      S.draw.line(c, L, Y(mu), c.W - 10, Y(mu), P.grey, 1, [4, 4]);
      var bars = [["± ET", s, P.acc], ["± ES", se, P.green], ["IC 95 %", t * se, P.red]], bx = L + zone + (c.W - L - 10 - zone) / 6;
      bars.forEach(function(b, q){
        var x = L + zone + (c.W - L - 10 - zone) * (q + 0.5) / 3;
        S.draw.line(c, x, Y(mu - b[1]), x, Y(mu + b[1]), b[2], 4);
        S.draw.line(c, x - 10, Y(mu - b[1]), x + 10, Y(mu - b[1]), b[2], 4); S.draw.line(c, x - 10, Y(mu + b[1]), x + 10, Y(mu + b[1]), b[2], 4);
        S.draw.dot(c, x, Y(mu), 5, P.ink);
        S.draw.text(c, b[0], x, c.H - 14, {size: 12, color: b[2]});
        S.draw.text(c, "± " + F(b[1], 1), x, Y(mu + b[1]) - 12, {size: 12, color: b[2]});
      });
      ro.set(0, F(s, 1)); ro.set(1, F(se, 2)); ro.set(2, F(t * se, 2)); ro.set(3, F(t, 3));
      nt.set(n < 10 ? "Petit n : l'IC utilise le quantile de Student (" + F(t, 2) + ") et non 1,96." : "Avec n = " + n + ", l'ES (" + F(se, 2) + ") est " + F(s / se, 1) + " fois plus petite que l'écart-type : une barre ± ES donne une impression de faible dispersion.", n < 10 ? "warn" : "ok");
    });
  }
});
})();
