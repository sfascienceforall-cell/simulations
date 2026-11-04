(function(){
var P = SFA.draw.palette, F = SFA.fmt;
function money(x){ return F(Math.round(x * 100) / 100, 2).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

/* 1. Escalier et boule de neige */
SFA.sim({
  id:"m5-c02-escalier-boule", ch:"c02", tag:"Classique",
  titre:"L'escalier et la boule de neige",
  resume:"Suite arithmétique (on ajoute r) ou géométrique (on multiplie par q).",
  but:"Choisis le type de suite, u₀ et la raison : regarde les points (n ; uₙ) former une droite ou une courbe qui s'envole.",
  aRetenir:"Arithmétique : uₙ = u₀ + n·r, somme de u₀ à u_N = (N + 1)(u₀ + u_N)/2. Géométrique : uₙ = u₀·qⁿ, somme = u₀(q^(N+1) − 1)/(q − 1) si q ≠ 1.",
  piege:"De u₀ à u_N il y a N + 1 termes mais seulement N raisons. « Augmente de 5 % » signifie q = 1,05, pas q = 5.",
  build:function(k, S){
    var c = k.canvas(340);
    var type = k.seg("Suite", [["A", "Arithmétique"], ["G", "Géométrique"], ["B", "Les deux"]], "B");
    var u0 = k.slider("u₀", -5, 10, 1, 3, "");
    var r = k.slider("r (raison arithmétique)", -5, 5, 0.5, 2, "");
    var q = k.slider("q (raison géométrique)", 0.5, 1.8, 0.05, 1.2, "");
    var N = k.slider("N (dernier indice)", 3, 15, 1, 10, "");
    var ro = k.readouts(["u_N arithmétique", "Somme arith.", "u_N géométrique", "Somme géom."]);
    var nt = k.note("", "ok");
    function ua(n){ return u0.value + n * r.value; } function ug(n){ return u0.value * Math.pow(q.value, n); }
    function sa(n){ return (n + 1) * (u0.value + ua(n)) / 2; }
    function sg(n){ return Math.abs(q.value - 1) < 1e-9 ? (n + 1) * u0.value : u0.value * (Math.pow(q.value, n + 1) - 1) / (q.value - 1); }
    k.draw(function(){
      c.clear(); var n = N.value, t = type.value, lo = 0, hi = 0.5, i;
      for (i = 0; i <= n; i++){ if (t !== "G"){ lo = Math.min(lo, ua(i)); hi = Math.max(hi, ua(i)); } if (t !== "A"){ lo = Math.min(lo, ug(i)); hi = Math.max(hi, ug(i)); } }
      var pad = (hi - lo) * 0.1 + 0.5;
      var ax = S.draw.axes(c, {x0:-0.7, x1:n + 0.7, y0:lo - pad, y1:hi + pad, stepX:n > 10 ? 2 : 1, xl:"n", yl:"uₙ"});
      for (i = 0; i <= n; i++){
        if (t !== "G"){ if (i) S.draw.line(c, ax.X(i - 1), ax.Y(ua(i - 1)), ax.X(i), ax.Y(ua(i)), "rgba(30,63,143,.25)", 1.5); S.draw.dot(c, ax.X(i), ax.Y(ua(i)), 5, P.acc); }
        if (t !== "A"){ if (i) S.draw.line(c, ax.X(i - 1), ax.Y(ug(i - 1)), ax.X(i), ax.Y(ug(i)), "rgba(180,35,24,.25)", 1.5); S.draw.dot(c, ax.X(i), ax.Y(ug(i)), 5, P.red); }
      }
      ro.set(0, F(ua(n), 2)); ro.set(1, F(sa(n), 2)); ro.set(2, F(ug(n), 2)); ro.set(3, F(sg(n), 2));
      var msg = "Bleu : arithmétique (points alignés). Rouge : géométrique (rapport constant).";
      if (Math.abs(q.value - 1) < 1e-9) msg += " Avec q = 1, la suite géométrique est constante.";
      else if (q.value < 1) msg += " Avec q < 1, la suite géométrique tend vers 0 : elle converge.";
      nt.set(msg + " (" + (n + 1) + " termes de u₀ à u_" + n + ")", "ok");
    });
  }
});

/* 2. Intérêts simples et composés */
SFA.sim({
  id:"m5-c02-interets", ch:"c02", tag:"Classique",
  titre:"Intérêts simples ou composés ?",
  resume:"Deux placements, un seul diverge vraiment vite.",
  but:"Règle le capital, le taux et la durée. Puis fais en sorte que le capital double : combien d'années en simple ? en composé ?",
  aRetenir:"Simple : Cₙ = C₀(1 + t·n), suite arithmétique. Composé : Cₙ = C₀(1 + t)ⁿ, suite géométrique de raison 1 + t. Le composé gagne parce que les intérêts rapportent eux-mêmes des intérêts.",
  piege:"Un taux de 3 % par an ne donne pas 3 % × 5 = 15 % de gain en 5 ans avec des intérêts composés : 1,03⁵ ≈ 1,1593, soit 15,93 %.",
  build:function(k, S){
    var c = k.canvas(340);
    var cap = k.slider("Capital C₀", 100, 5000, 100, 1000, "€");
    var tx = k.slider("Taux annuel t", 1, 10, 0.5, 4, "%");
    var dur = k.slider("Durée n", 0, 40, 1, 20, "ans");
    var ro = k.readouts(["Simple Cₙ", "Composé Cₙ", "Écart", "Doublement"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var C0 = cap.value, t = tx.value / 100, n = dur.value;
      var cs = function(x){ return C0 * (1 + t * x); }, cc = function(x){ return C0 * Math.pow(1 + t, x); };
      var hi = Math.max(cs(40), cc(40), 1), nmax = 40;
      var ax = S.draw.axes(c, {x0:0, x1:nmax, y0:0, y1:Math.max(cs(nmax), cc(nmax)) * 1.05, l:58, xl:"années", stepX:5});
      S.draw.fn(c, ax, cs, P.acc, 2.4); S.draw.fn(c, ax, cc, P.red, 2.4);
      S.draw.line(c, ax.X(n), ax.B, ax.X(n), ax.Y(cc(n)), P.grey, 1, [3, 3]);
      S.draw.dot(c, ax.X(n), ax.Y(cs(n)), 5, P.acc); S.draw.dot(c, ax.X(n), ax.Y(cc(n)), 5, P.red);
      S.draw.line(c, ax.L, ax.Y(2 * C0), ax.R, ax.Y(2 * C0), P.light, 1, [4, 4]);
      var dS = 1 / t, dC = Math.log(2) / Math.log(1 + t);
      ro.set(0, money(cs(n)) + " €"); ro.set(1, money(cc(n)) + " €"); ro.set(2, money(cc(n) - cs(n)) + " €");
      ro.set(3, F(dS, 1) + " / " + F(dC, 1) + " ans");
      nt.set("Bleu : simple (droite, +" + money(C0 * t) + " € par an). Rouge : composé (×" + F(1 + t, 3) + " par an). Le capital double après " + F(dS, 1) + " ans en simple, après " + F(dC, 1) + " ans en composé." + (n === 0 ? " À n = 0, les deux valent C₀." : ""), "ok");
    });
  }
});

/* 3. Somme de Gauss généralisée */
SFA.sim({
  id:"m5-c02-gauss", ch:"c02", tag:"Preuve visuelle",
  titre:"La somme de Gauss en rectangle",
  resume:"Deux copies de la suite forment un rectangle : S = n(u₁ + uₙ)/2.",
  but:"Choisis u₁, la raison et n : la suite (bleu) et sa copie retournée (orange) forment un rectangle de hauteur constante u₁ + uₙ.",
  aRetenir:"Chaque colonne du rectangle vaut u₁ + uₙ, il y a n colonnes : 2S = n(u₁ + uₙ), donc S = n(u₁ + uₙ)/2. Pour 1 + 2 + … + n, cela donne n(n + 1)/2.",
  piege:"On divise par 2 parce qu'on a compté la somme deux fois. Et n est le nombre de termes, pas le dernier indice si la suite commence à u₀.",
  build:function(k, S){
    var c = k.canvas(340);
    var u1 = k.slider("u₁ (premier terme)", 1, 10, 1, 1, "");
    var r = k.slider("r (raison)", 0, 4, 1, 1, "");
    var n = k.slider("n (nombre de termes)", 2, 12, 1, 8, "");
    var ro = k.readouts(["uₙ", "u₁ + uₙ", "Somme S"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var N = n.value, a = u1.value, d = r.value, un = a + (N - 1) * d, h = a + un;
      var ctx = c.ctx, L = 40, Rr = 16, T = 24, B = 30, w = (c.W - L - Rr) / N, sc = (c.H - T - B) / h, i;
      for (i = 1; i <= N; i++){
        var v = a + (i - 1) * d, x = L + (i - 1) * w, y0 = c.H - B;
        ctx.fillStyle = "rgba(30,63,143,.85)"; ctx.fillRect(x + 1, y0 - v * sc, w - 2, v * sc);
        ctx.fillStyle = "rgba(180,83,9,.8)"; ctx.fillRect(x + 1, y0 - h * sc, w - 2, (h - v) * sc);
        S.draw.text(c, F(v, 0), x + w/2, y0 - v * sc/2, {color:"#fff", size:12});
        S.draw.text(c, F(h - v, 0), x + w/2, y0 - v * sc - (h - v) * sc/2, {color:"#fff", size:12});
        S.draw.text(c, String(i), x + w/2, y0 + 14, {size:12, color:P.grey});
      }
      S.draw.text(c, "u₁ + uₙ = " + F(h, 0) + " pour chaque colonne", L, 12, {align:"left", size:12, color:P.amber});
      ro.set(0, F(un, 0)); ro.set(1, F(h, 0)); ro.set(2, F(N * h / 2, 1));
      var s = 0; for (i = 1; i <= N; i++) s += a + (i - 1) * d;
      nt.set("Rectangle : " + N + " × " + F(h, 0) + " = " + F(N * h, 0) + " cases, soit deux fois la somme. S = " + F(N * h, 0) + " / 2 = " + F(N * h / 2, 1) + ". Vérification en additionnant terme à terme : " + F(s, 0) + ".", "ok");
    });
  }
});

/* 4. Crédit et amortissement */
SFA.sim({
  id:"m5-c02-credit", ch:"c02", tag:"Finance",
  titre:"Rembourser un crédit : où vont les paiements ?",
  resume:"Annuités constantes : la part d'intérêts diminue chaque année.",
  but:"Règle le prêt, le taux et la durée. Fais glisser l'année k : combien d'intérêts, combien de capital remboursé, combien reste dû ?",
  aRetenir:"Avec une annuité constante A, la dette suit D_k = D_{k−1}(1 + t) − A. Les intérêts sont calculés sur ce qui reste dû : ils diminuent, la part de capital augmente. A = K·t / (1 − (1 + t)^(−n)).",
  piege:"Modèle simplifié : un seul paiement par an (les vrais crédits sont mensuels). Un crédit plus long a une annuité plus faible, mais un coût total en intérêts plus élevé.",
  build:function(k, S){
    var c = k.canvas(340);
    var K = k.slider("Capital emprunté", 5000, 50000, 1000, 20000, "€");
    var tx = k.slider("Taux annuel", 0, 10, 0.5, 5, "%");
    var n = k.slider("Durée", 1, 20, 1, 10, "ans");
    var kk = k.slider("Année k à examiner", 1, 20, 1, 1, "");
    var ro = k.readouts(["Annuité A", "Intérêts totaux", "Intérêts année k", "Capital remboursé", "Dette après k"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var cap = K.value, t = tx.value / 100, N = n.value, i;
      var A = t === 0 ? cap / N : cap * t / (1 - Math.pow(1 + t, -N));
      var D = cap, rows = [], tot = 0;
      for (i = 1; i <= N; i++){ var it = D * t, cp = A - it; D = D - cp; rows.push({i:it, c:cp, d:Math.max(0, Math.abs(D) < 1e-6 ? 0 : D)}); tot += it; }
      var sel = Math.min(kk.value, N), ctx = c.ctx, L = 56, Rr = 12, T = 18, B = 30, w = (c.W - L - Rr) / N, sc = (c.H - T - B) / (A * 1.08);
      var ax = S.draw.axes(c, {x0:0, x1:N, y0:0, y1:A * 1.08, l:56, xl:"année", stepX:N > 10 ? 2 : 1, grid:false});
      for (i = 0; i < N; i++){
        var x = L + i * w, y0 = c.H - B, hc = rows[i].c * sc, hi = rows[i].i * sc;
        ctx.fillStyle = (i + 1 === sel) ? P.green : "rgba(46,107,85,.6)"; ctx.fillRect(x + 1, y0 - hc, w - 2, hc);
        ctx.fillStyle = (i + 1 === sel) ? P.red : "rgba(180,35,24,.6)"; ctx.fillRect(x + 1, y0 - hc - hi, w - 2, hi);
      }
      S.draw.text(c, "vert : capital remboursé · rouge : intérêts", c.W - Rr, T - 4, {align:"right", size:12, color:P.ink});
      var rw = rows[sel - 1];
      ro.set(0, money(A) + " €"); ro.set(1, money(tot) + " €"); ro.set(2, money(rw.i) + " €"); ro.set(3, money(rw.c) + " €"); ro.set(4, money(rw.d) + " €");
      nt.set("Tu rembourses " + money(A * N) + " € au total pour " + money(cap) + " € empruntés. En année " + sel + ", " + F(rw.i / A * 100, 0) + " % de l'annuité sont des intérêts" + (kk.value > N ? " (k limité à la durée " + N + ")." : "."), "ok");
    });
  }
});
})();
