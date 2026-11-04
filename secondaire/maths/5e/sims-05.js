(function(){
var P = SFA.draw.palette, F = SFA.fmt;
function line(c, ax, x0, y0, m, col, dash, w){ var L = ax.x0, R = ax.x1; SFA.draw.line(c, ax.X(L), ax.Y(y0 + m * (L - x0)), ax.X(R), ax.Y(y0 + m * (R - x0)), col, w || 2, dash); }
function clipped(c, ax, fn){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); fn(); ctx.restore(); }

/* 1. Sécante -> tangente */
var FN = {
  a:{n:"f(x) = x²", f:function(x){ return x*x; }, d:function(x){ return 2*x; }, lo:-2, hi:2, a:1, w:[-3, 3, -1, 9]},
  b:{n:"f(x) = x³ − 2x", f:function(x){ return x*x*x - 2*x; }, d:function(x){ return 3*x*x - 2; }, lo:-2, hi:2, a:1, w:[-3, 3, -6, 6]},
  c:{n:"f(x) = 1/x", f:function(x){ return 1/x; }, d:function(x){ return -1/(x*x); }, lo:2.1, hi:5, a:3, w:[0, 7, -1, 4]},
  d:{n:"f(x) = √x", f:function(x){ return Math.sqrt(x); }, d:function(x){ return 0.5/Math.sqrt(x); }, lo:2.1, hi:6, a:3, w:[0, 8, -0.5, 3.5]}
};
SFA.sim({
  id:"m5-c05-secante", ch:"c05", tag:"Classique",
  titre:"La sécante devient tangente",
  resume:"Rapproche le deuxième point : la pente de la sécante tend vers f′(a).",
  but:"Fixe a, puis fais diminuer h : regarde la sécante (rouge) se coucher sur la tangente (verte) et le taux d'accroissement tendre vers f′(a).",
  aRetenir:"Le taux d'accroissement (f(a + h) − f(a))/h est la pente de la sécante. Sa limite quand h → 0 est le nombre dérivé f′(a), pente de la tangente : f′(a) = lim (f(a + h) − f(a))/h.",
  piege:"Sécante ≠ tangente : la tangente est la position limite des sécantes. Et le nombre dérivé est la pente de la tangente, pas la valeur f(a).",
  build:function(k, S){
    var c = k.canvas(350);
    var sel = k.select("Fonction", Object.keys(FN).map(function(q){ return [q, FN[q].n]; }), "a", function(){ var d = FN[sel.value]; a.el.min = d.lo; a.el.max = d.hi; a.set(d.a); });
    var a = k.slider("a", -2, 2, 0.1, 1, "");
    var z = k.slider("Rapprochement z (h = 10^−z)", -0.3, 3, 0.1, 0, "");
    var sg = k.seg("Côté du 2e point", [["1", "À droite (h > 0)"], ["-1", "À gauche (h < 0)"]], "1");
    var ro = k.readouts(["h", "Pente de la sécante", "f′(a) (tangente)", "Écart"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var d = FN[sel.value], w = d.w; c.clear();
      var ax = S.draw.axes(c, {x0:w[0], x1:w[1], y0:w[2], y1:w[3], xl:"x", yl:"y"});
      var A = a.value, h = Number(sg.value) * Math.pow(10, -z.value), B = A + h;
      S.draw.fn(c, ax, d.f, P.acc, 2.6);
      var fa = d.f(A), fb = d.f(B);
      if (!isFinite(fb) || !isFinite(fa)){ nt.set("a + h sort du domaine de f : choisis une autre valeur.", "warn"); return; }
      var slope = (fb - fa) / h, t = d.d(A);
      clipped(c, ax, function(){ line(c, ax, A, fa, t, P.green, [6, 5], 2); line(c, ax, A, fa, slope, P.red, null, 2); });
      S.draw.dot(c, ax.X(A), ax.Y(fa), 6, P.acc); S.draw.dot(c, ax.X(B), ax.Y(fb), 6, P.red);
      S.draw.text(c, "A", ax.X(A) - 10, ax.Y(fa) - 10, {color:P.acc}); S.draw.text(c, "B", ax.X(B) + 10, ax.Y(fb) - 10, {color:P.red});
      ro.set(0, F(h, 4)); ro.set(1, F(slope, 4)); ro.set(2, F(t, 4)); ro.set(3, F(slope - t, 4));
      nt.set("Sécante AB : pente (f(" + F(B, 3) + ") − f(" + F(A, 2) + ")) / " + F(h, 4) + " = <b>" + F(slope, 4) + "</b>. Tangente : f′(" + F(A, 2) + ") = <b>" + F(t, 4) + "</b>. Équation de la tangente : y = " + F(t, 3) + "(" + (A < 0 ? "x + " + F(-A, 2) : "x − " + F(A, 2)) + ") + " + F(fa, 3) + ".", "ok");
    });
    sel.el.dispatchEvent(new Event("change"));
  }
});

/* 2. Courbe de la dérivée */
var DF = {
  a:{n:"f(x) = x³/3 − x", f:function(x){ return x*x*x/3 - x; }, d:function(x){ return x*x - 1; }, wf:[-3.5, 3.5], wd:[-2, 6.5], ds:"f′(x) = x² − 1"},
  b:{n:"f(x) = x⁴/4 − x²", f:function(x){ return Math.pow(x, 4)/4 - x*x; }, d:function(x){ return x*x*x - 2*x; }, wf:[-2.5, 5], wd:[-14, 14], ds:"f′(x) = x³ − 2x"},
  c:{n:"f(x) = |x|", f:function(x){ return Math.abs(x); }, d:function(x){ return Math.abs(x) < 1e-9 ? NaN : (x > 0 ? 1 : -1); }, wf:[-0.5, 3], wd:[-1.5, 1.5], ds:"f′(x) = −1 si x < 0, +1 si x > 0, n'existe pas en 0"},
  d:{n:"f(x) = 2/x (x > 0)", f:function(x){ return x > 0 ? 2/x : NaN; }, d:function(x){ return x > 0 ? -2/(x*x) : NaN; }, wf:[-0.5, 6], wd:[-6, 1], ds:"f′(x) = −2/x²", lo:0.4}
};
SFA.sim({
  id:"m5-c05-courbe-derivee", ch:"c05", tag:"Classique",
  titre:"La courbe de f′ se dessine pendant que tu glisses",
  resume:"Un point sur f, sa tangente ; en dessous, le point (x ; f′(x)).",
  but:"Glisse le point sur la courbe de f (souris, doigt, curseur). En bas, le point (x ; f′(x)) trace la courbe dérivée. Où f′ s'annule-t-elle ? Que voit-on sur f ?",
  aRetenir:"f′(x) est la pente de la tangente en x. Quand la tangente est horizontale, f′ = 0. Quand f monte, f′ > 0 ; quand f descend, f′ < 0. Une pointe comme |x| en 0 : pas de tangente, f′ n'existe pas.",
  piege:"Une fonction continue n'est pas toujours dérivable : |x| est continue en 0 mais n'a pas de tangente (pointe).",
  build:function(k, S){
    var c1 = k.canvas(220), c2 = k.canvas(200);
    var sel = k.select("Fonction", Object.keys(DF).map(function(q){ return [q, DF[q].n]; }), "a", function(){ x.set(1); });
    var x = k.slider("Abscisse x", -2.5, 2.5, 0.05, 1, "");
    var ro = k.readouts(["f(x)", "f′(x)", "Tangente"]);
    var nt = k.note("", "ok"), ax1, ax2;
    function drag(type, p){ if (type === "down" || type === "drag"){ var v = Math.round(ax1.ix(p.x) / 0.05) * 0.05, d = DF[sel.value]; x.set(Math.max(d.lo || -2.5, Math.min(2.5, v))); k.redraw(); } }
    c1.pointer(drag); c2.pointer(function(t, p){ if (t === "down" || t === "drag"){ drag(t, {x:p.x}); } });
    k.draw(function(){
      var d = DF[sel.value], X = Math.max(d.lo || -2.5, x.value); c1.clear(); c2.clear();
      var dom = d.lo ? d.lo : d.wf[0];
      ax1 = S.draw.axes(c1, {x0:-3, x1:3, y0:d.wf[0], y1:d.wf[1], xl:"x", yl:"f", stepX:1, b:26});
      ax2 = S.draw.axes(c2, {x0:-3, x1:3, y0:d.wd[0], y1:d.wd[1], xl:"x", yl:"f′", stepX:1, b:26});
      S.draw.fn(c1, ax1, d.f, P.acc, 2.6); S.draw.fn(c2, ax2, d.d, "rgba(180,35,24,.35)", 2.2);
      var y = d.f(X), m = d.d(X);
      S.draw.line(c1, ax1.X(X), ax1.T, ax1.X(X), ax1.B, P.light, 1, [3, 3]); S.draw.line(c2, ax2.X(X), ax2.T, ax2.X(X), ax2.B, P.light, 1, [3, 3]);
      if (isFinite(m)){ clipped(c1, ax1, function(){ line(c1, ax1, X, y, m, P.green, null, 2); }); S.draw.dot(c2, ax2.X(X), ax2.Y(m), 6, P.red); }
      else S.draw.text(c2, "f′(0) n'existe pas", ax2.X(X) + 8, ax2.Y(0) - 12, {align:"left", color:P.red});
      S.draw.dot(c1, ax1.X(X), ax1.Y(y), 6, P.acc);
      if (isFinite(m)) S.draw.line(c2, ax2.X(X), ax2.Y(0), ax2.X(X), ax2.Y(m), P.red, 1.5);
      ro.set(0, F(y, 3)); ro.set(1, isFinite(m) ? F(m, 3) : "n'existe pas");
      ro.set(2, !isFinite(m) ? "pointe : aucune" : Math.abs(m) < 0.03 ? "horizontale" : m > 0 ? "monte" : "descend");
      nt.set(d.ds + ". En x = " + F(X, 2) + " : pente " + (isFinite(m) ? F(m, 3) : "indéfinie") + (isFinite(m) && Math.abs(m) < 0.03 ? " : tangente horizontale, f′ s'annule." : "."), "ok");
    });
    sel.el.dispatchEvent(new Event("change"));
  }
});

/* 3. Règles de dérivation */
var LB = {
  a:{n:"x²", f:function(x){ return x*x; }, d:function(x){ return 2*x; }, s:"2x"},
  b:{n:"x³", f:function(x){ return x*x*x; }, d:function(x){ return 3*x*x; }, s:"3x²"},
  c:{n:"√x", f:function(x){ return Math.sqrt(x); }, d:function(x){ return 0.5/Math.sqrt(x); }, s:"1/(2√x)"},
  d:{n:"1/x", f:function(x){ return 1/x; }, d:function(x){ return -1/(x*x); }, s:"−1/x²"},
  e:{n:"2x + 1", f:function(x){ return 2*x + 1; }, d:function(x){ return 2; }, s:"2"}
};
SFA.sim({
  id:"m5-c05-regles", ch:"c05", tag:"Vérification",
  titre:"Produit, quotient, composée : la bonne règle et la fausse",
  resume:"Compare la bonne formule, la valeur numérique et la règle « naïve ».",
  but:"Choisis f, g et l'opération. La tangente correcte (verte) suit la courbe ; la tangente de la règle naïve (rouge pointillée) s'en écarte.",
  aRetenir:"(f·g)′ = f′g + fg′ · (f/g)′ = (f′g − fg′)/g² · (f∘g)′ = f′(g(x))·g′(x) (on n'oublie pas la dérivée intérieure). Somme : (f + g)′ = f′ + g′, la seule règle « naïve » qui est juste.",
  piege:"(f·g)′ ≠ f′·g′ et (f/g)′ ≠ f′/g′. Pour une composée, dériver seulement « l'extérieur » oublie le facteur g′(x).",
  build:function(k, S){
    var c = k.canvas(330);
    var fs = k.select("f", Object.keys(LB).map(function(q){ return [q, LB[q].n]; }), "a");
    var gs = k.select("g", Object.keys(LB).map(function(q){ return [q, LB[q].n]; }), "e");
    var op = k.seg("Opération", [["P", "f·g"], ["Q", "f/g"], ["C", "f(g(x))"]], "P");
    var x = k.slider("x", 0.5, 3, 0.1, 1.5, "");
    var ro = k.readouts(["h′(x) par la règle", "Pente numérique", "Règle naïve", "Écart naïf"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var f = LB[fs.value], g = LB[gs.value], X = x.value, o = op.value, h, good, naive, rule, nrule;
      if (o === "P"){ h = function(t){ return f.f(t) * g.f(t); }; good = f.d(X) * g.f(X) + f.f(X) * g.d(X); naive = f.d(X) * g.d(X); rule = "f′g + fg′"; nrule = "f′·g′"; }
      else if (o === "Q"){ h = function(t){ return f.f(t) / g.f(t); }; good = (f.d(X) * g.f(X) - f.f(X) * g.d(X)) / (g.f(X) * g.f(X)); naive = f.d(X) / g.d(X); rule = "(f′g − fg′)/g²"; nrule = "f′/g′"; }
      else { h = function(t){ return f.f(g.f(t)); }; good = f.d(g.f(X)) * g.d(X); naive = f.d(g.f(X)); rule = "f′(g(x))·g′(x)"; nrule = "f′(g(x)) seul"; }
      var num = (h(X + 1e-6) - h(X - 1e-6)) / 2e-6, y = h(X), lo = Infinity, hi = -Infinity, t;
      for (t = 0.2; t <= 3.5; t += 0.05){ var v = h(t); if (isFinite(v)){ lo = Math.min(lo, v); hi = Math.max(hi, v); } }
      var pad = (hi - lo) * 0.15 + 0.2, ax = S.draw.axes(c, {x0:0, x1:3.5, y0:lo - pad, y1:hi + pad, xl:"x", yl:"h", stepX:0.5});
      S.draw.fn(c, ax, h, P.acc, 2.6);
      clipped(c, ax, function(){ line(c, ax, X, y, good, P.green, null, 2.2); line(c, ax, X, y, naive, P.red, [6, 5], 2); });
      S.draw.dot(c, ax.X(X), ax.Y(y), 6, P.acc);
      ro.set(0, F(good, 4)); ro.set(1, F(num, 4)); ro.set(2, F(naive, 4)); ro.set(3, F(naive - good, 4));
      var hn = o === "P" ? f.n + "·" + g.n : o === "Q" ? f.n + " / " + g.n : "f(g(x)) avec f = " + f.n + ", g = " + g.n;
      nt.set("h(x) = " + hn + ". Règle exacte : " + rule + " = <b>" + F(good, 4) + "</b>, et la limite numérique donne " + F(num, 4) + " (identiques). Règle naïve (" + nrule + ") : " + F(naive, 4) + (Math.abs(naive - good) < 1e-6 ? " : égale ici par hasard, ne généralise pas." : " : fausse."), "ok");
    });
  }
});

/* 4. Vitesse instantanée */
SFA.sim({
  id:"m5-c05-vitesse", ch:"c05", tag:"Animation",
  titre:"Vitesse moyenne, vitesse instantanée",
  resume:"Une bille tombe : s(t) = 4,9·t². Rétrécis l'intervalle de temps.",
  but:"Lance la chute (▶). Puis choisis t₀ et diminue Δt : la vitesse moyenne sur [t₀ ; t₀ + Δt] tend vers la vitesse instantanée s′(t₀).",
  aRetenir:"Vitesse moyenne = Δs/Δt = pente de la sécante. Vitesse instantanée = s′(t₀) = limite de la vitesse moyenne quand Δt → 0 : pente de la tangente à la courbe s(t). Ici s′(t) = 9,8·t (m/s), sans frottements.",
  piege:"La vitesse moyenne entre 0 et t₀ (s(t₀)/t₀ = 4,9·t₀) vaut la moitié de la vitesse instantanée à t₀, car la bille accélère.",
  build:function(k, S){
    var c = k.canvas(360);
    var t0 = k.slider("t₀", 0.5, 3, 0.1, 2, "s");
    var z = k.slider("Rapprochement z (Δt = 10^−z s)", -0.3, 3, 0.1, 0, "");
    var ro = k.readouts(["Vitesse moyenne", "Vitesse instantanée", "Écart", "Vit. moy. [0 ; t₀]"]);
    var tt = 0;
    var anim = k.loop(function(dt){ tt += dt * 0.8; if (tt > 3.2){ tt = 3.2; anim.pause(); } k.redraw(); });
    k.button("▶ Lancer la chute", function(){ tt = 0; anim.play(); }, true);
    k.button("Arrêter", function(){ anim.pause(); });
    k.draw(function(){
      c.clear(); var s = function(t){ return 4.9 * t * t; }, T0 = t0.value, dT = Math.pow(10, -z.value);
      var ax = S.draw.axes(c, {x0:0, x1:3.5, y0:0, y1:60, l:46, r:116, xl:"t (s)", yl:"s (m)", stepX:0.5, stepY:10});
      S.draw.fn(c, ax, s, P.acc, 2.6);
      var vm = (s(T0 + dT) - s(T0)) / dT, vi = 9.8 * T0;
      clipped(c, ax, function(){ line(c, ax, T0, s(T0), vm, P.red, null, 2); line(c, ax, T0, s(T0), vi, P.green, [6, 5], 2); });
      S.draw.dot(c, ax.X(T0), ax.Y(s(T0)), 6, P.acc); S.draw.dot(c, ax.X(T0 + dT), ax.Y(s(T0 + dT)), 5, P.red);
      var cx = c.W - 58, top = ax.T + 6, bot = ax.B - 6;
      S.draw.line(c, cx, top, cx, bot, P.light, 3);
      var yy = top + (bot - top) * (s(tt) / 60);
      S.draw.dot(c, cx, yy, 9, P.amber); S.draw.dot(c, ax.X(tt), ax.Y(s(tt)), 4, P.amber);
      S.draw.text(c, "t = " + F(tt, 2) + " s", cx, bot + 4, {size:12, base:"top"});
      ro.set(0, F(vm, 3) + " m/s"); ro.set(1, F(vi, 3) + " m/s"); ro.set(2, F(vm - vi, 3) + " m/s"); ro.set(3, F(4.9 * T0, 2) + " m/s (moy.)");
    });
  }
});
})();
