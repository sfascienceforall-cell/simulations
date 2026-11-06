(function(){
var P = SFA.draw.palette, F = SFA.fmt, D = SFA.draw, PI = Math.PI;
function simpson(f, a, b, n){ n = n || 600; if (n % 2) n++; var h = (b - a) / n, s = f(a) + f(b); for (var i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; }
function dd(f, x, h){ h = h || 1e-5; return (f(x + h) - f(x - h)) / (2 * h); }
function cl(x, a, b){ return Math.max(a, Math.min(b, x)); }
function lab(c, s, x, y, col, size, al, bg){ D.text(c, s, x, y, {color: col || P.ink, size: size || 13, align: al || "center", math: true, weight: 600, bg: bg}); }
function pt(c, ax, x, y, col, r){ var ctx = c.ctx, X = ax.X(x), Y = ax.Y(y); ctx.beginPath(); ctx.arc(X, Y, (r || 5) + 2, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.beginPath(); ctx.arc(X, Y, r || 5, 0, 7); ctx.fillStyle = col; ctx.fill(); }
function vl(c, ax, x, col, dash, w){ D.line(c, ax.X(x), ax.T, ax.X(x), ax.B, col, w || 1.5, dash || [5, 4]); }
function hl(c, ax, y, col, dash, w){ D.line(c, ax.L, ax.Y(y), ax.R, ax.Y(y), col, w || 1.5, dash || [5, 4]); }
function curve(c, ax, fx, fy, t0, t1, col, w, dash, n){ var ctx = c.ctx; n = n || 500; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T - 2, ax.R - ax.L, ax.B - ax.T + 4); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = w || 2.4; if (dash) ctx.setLineDash(dash); ctx.beginPath(); var st = false; for (var i = 0; i <= n; i++){ var t = t0 + (t1 - t0) * i / n, x = fx(t), y = fy(t); if (!isFinite(x) || !isFinite(y)){ st = false; continue; } if (!st){ ctx.moveTo(ax.X(x), ax.Y(y)); st = true; } else ctx.lineTo(ax.X(x), ax.Y(y)); } ctx.stroke(); ctx.restore(); }
function fillArea(c, ax, f, g, a, b, col){ var ctx = c.ctx, n = 240; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.fillStyle = col; ctx.beginPath(); for (var i = 0; i <= n; i++){ var x = a + (b - a) * i / n; ctx.lineTo(ax.X(x), ax.Y(f(x))); } for (i = n; i >= 0; i--){ x = a + (b - a) * i / n; ctx.lineTo(ax.X(x), ax.Y(g(x))); } ctx.closePath(); ctx.fill(); ctx.restore(); }
/* Mathématiques BA1 · chapitre 4 : intégrales */
/* 1 ---- Riemann ---- */
var R1 = {
  x2: {n: "f(x) = x² sur [0 ; 3]", f: function(x){ return x * x; }, a: 0, b: 3, I: 9, y1: 10},
  sin: {n: "f(x) = sin x sur [0 ; π]", f: Math.sin, a: 0, b: PI, I: 2, y1: 1.4},
  exp: {n: "f(x) = eˣ sur [0 ; 2]", f: Math.exp, a: 0, b: 2, I: Math.exp(2) - 1, y1: 8},
  inv: {n: "f(x) = 1/x sur [1 ; 5]", f: function(x){ return 1 / x; }, a: 1, b: 5, I: Math.log(5), y1: 1.3},
  sqrt: {n: "f(x) = √x sur [0 ; 4]", f: Math.sqrt, a: 0, b: 4, I: 16 / 3, y1: 2.5}
};
SFA.sim({
  id: "um-c04-riemann", ch: "c04", tag: "Sommes de Riemann",
  titre: "L'intégrale comme limite de sommes de rectangles",
  resume: "Coupe [a ; b] en n bandes : la somme des aires des rectangles (gauche, droite, milieu) ou des trapèzes converge vers l'intégrale.",
  but: "Choisis la fonction, la méthode et le nombre n de rectangles. Compare la somme à la valeur exacte et regarde l'erreur diminuer quand n grandit.",
  aRetenir: "∫<sub>a</sub><sup>b</sup> f(x) dx = lim<sub>n→∞</sub> Σ f(xᵢ)Δx avec Δx = (b − a)/n. Pour une fonction croissante, la somme de gauche sous-estime et celle de droite surestime ; la méthode du point milieu et celle des trapèzes convergent plus vite (erreur en 1/n²).",
  piege: "L'intégrale est une aire algébrique : la partie sous l'axe Ox compte négativement. Une aire (positive) s'obtient avec ∫|f|.",
  build: function(k, S){
    var c = k.canvas(370), fs = k.select("Fonction", [["x2", "x² sur [0 ; 3]"], ["sin", "sin x sur [0 ; π]"], ["exp", "eˣ sur [0 ; 2]"], ["inv", "1/x sur [1 ; 5]"], ["sqrt", "√x sur [0 ; 4]"]], "x2");
    var md = k.seg("Méthode", [["g", "Gauche"], ["d", "Droite"], ["m", "Milieu"], ["t", "Trapèzes"]], "g"), n = k.slider("Nombre n de bandes", 1, 100, 1, 6, "");
    var ro = k.readouts(["Somme Sₙ", "Intégrale exacte", "Erreur Sₙ − I", "Erreur relative"]), nt = k.note("", "");
    function sum(T, m, N){ var h = (T.b - T.a) / N, s = 0; for (var i = 0; i < N; i++){ var x0 = T.a + i * h, x1 = x0 + h; s += m === "g" ? T.f(x0) : m === "d" ? T.f(x1) : m === "m" ? T.f(x0 + h / 2) : (T.f(x0) + T.f(x1)) / 2; } return s * h; }
    k.draw(function(){
      c.clear(); var T = R1[fs.value], N = n.value, h = (T.b - T.a) / N, ctx = c.ctx, ax = D.axes(c, {x0: T.a - (T.b - T.a) * 0.06, x1: T.b + (T.b - T.a) * 0.06, y0: -T.y1 * 0.06, y1: T.y1, xl: "x", yl: "y"});
      ctx.save(); ctx.fillStyle = "rgba(180,83,9,.25)"; ctx.strokeStyle = P.amber; ctx.lineWidth = N > 40 ? 0.6 : 1.4;
      for (var i = 0; i < N; i++){ var x0 = T.a + i * h, x1 = x0 + h; ctx.beginPath();
        if (md.value === "t"){ ctx.moveTo(ax.X(x0), ax.Y(0)); ctx.lineTo(ax.X(x0), ax.Y(T.f(x0))); ctx.lineTo(ax.X(x1), ax.Y(T.f(x1))); ctx.lineTo(ax.X(x1), ax.Y(0)); ctx.closePath(); }
        else { var y = md.value === "g" ? T.f(x0) : md.value === "d" ? T.f(x1) : T.f(x0 + h / 2); ctx.rect(ax.X(x0), ax.Y(y), ax.X(x1) - ax.X(x0), ax.Y(0) - ax.Y(y)); }
        ctx.fill(); ctx.stroke(); }
      ctx.restore(); D.fn(c, ax, T.f, P.acc, 3);
      var s = sum(T, md.value, N); ro.set(0, F(s, 5)); ro.set(1, F(T.I, 5)); ro.set(2, S.sci(s - T.I)); ro.set(3, F(Math.abs(s - T.I) / T.I * 100, 3) + " %");
      nt.set(md.value === "g" || md.value === "d" ? (T.f(T.a) < T.f(T.b) ? (md.value === "g" ? "f croissante : la somme de gauche sous-estime l'aire." : "f croissante : la somme de droite surestime l'aire.") : (md.value === "g" ? "f décroissante : la somme de gauche surestime l'aire." : "f décroissante : la somme de droite sous-estime l'aire.")) : "Le point milieu et les trapèzes compensent en partie les erreurs : très bonne précision dès n = 10.", "");
    });
  }
});

/* 2 ---- théorème fondamental ---- */
var F2 = {
  cos: {n: "f(x) = cos x", f: Math.cos, a: 0, x1: 2 * PI, yf: 1.6, yF: 1.6, G: "F(x) = sin x"},
  quad: {n: "f(x) = x² − 1", f: function(x){ return x * x - 1; }, a: 0, x1: 3, yf: 9, yF: 7, G: "F(x) = x³/3 − x"},
  gauss: {n: "f(x) = e^(−x²)", f: function(x){ return Math.exp(-x * x); }, a: 0, x1: 3, yf: 1.2, yF: 1, G: "pas de primitive élémentaire (loi normale !)"},
  arct: {n: "f(x) = 1/(1 + x²)", f: function(x){ return 1 / (1 + x * x); }, a: 0, x1: 5, yf: 1.2, yF: 1.6, G: "F(x) = arctan x"}
};
SFA.sim({
  id: "um-c04-theoreme-fondamental", ch: "c04", tag: "Théorème fondamental",
  titre: "Aire accumulée et pente : le théorème fondamental du calcul",
  resume: "Fais glisser x : l'aire sous f de a à x (en haut) est l'ordonnée de F (en bas), et la pente de F en x est exactement f(x).",
  but: "Choisis f et déplace x. En haut, l'aire hachurée A(x) = ∫ₐˣ f ; en bas, la courbe de A. La tangente de A en x a pour pente f(x) : vérifie-le dans la lecture chiffrée.",
  aRetenir: "Si F(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt, alors F′(x) = f(x) : F est une primitive de f. Conséquence : ∫<sub>a</sub><sup>b</sup> f = G(b) − G(a) pour n'importe quelle primitive G. Là où f > 0, F croît ; là où f < 0, F décroît.",
  piege: "Les primitives sont définies à une constante près : F(x) = x³/3 − x + C. Et certaines fonctions continues (e^(−x²)) n'ont pas de primitive exprimable avec les fonctions usuelles, mais F existe quand même.",
  build: function(k, S){
    var c1 = k.canvas(190), c2 = k.canvas(190), fs = k.select("Fonction", [["cos", "cos x"], ["quad", "x² − 1"], ["gauss", "e^(−x²)"], ["arct", "1/(1 + x²)"]], "cos", function(){ xs.el.max = F2[fs.value].x1; xs.set(Math.min(F2[fs.value].x1 * 0.4, F2[fs.value].x1)); });
    var xs = k.slider("Position x", 0.05, 2 * PI, 0.01, 1.8, ""); var ro = k.readouts(["Aire F(x) = ∫₀ˣ f", "f(x)", "Pente de F en x", "Primitive"]);
    c1.pointer(function(t, p){ if ((t === "down" || t === "drag") && c1._ax){ xs.set(c1._ax.ix(p.x)); k.redraw(); } });
    k.draw(function(){
      c1.clear(); c2.clear(); var T = F2[fs.value], X = Math.min(xs.value, T.x1), Fx = function(x){ return simpson(T.f, 0, x, 300); }, ctx = c1.ctx;
      var ymin = fs.value === "quad" ? -2 : fs.value === "cos" ? -1.6 : -0.2;
      var ax1 = D.axes(c1, {x0: -0.2, x1: T.x1, y0: ymin, y1: T.yf, hideZero: false, yl: "f"}); c1._ax = ax1; fillArea(c1, ax1, T.f, function(){ return 0; }, 0, X, "rgba(180,83,9,.30)"); D.fn(c1, ax1, T.f, P.acc, 3); vl(c1, ax1, X, P.amber, [5, 4], 1.5); pt(c1, ax1, X, T.f(X), P.red, 5);
      var ymin2 = fs.value === "quad" ? -1.5 : fs.value === "cos" ? -1.6 : -0.2, ax2 = D.axes(c2, {x0: -0.2, x1: T.x1, y0: ymin2, y1: T.yF, hideZero: false, yl: "F"}); D.fn(c2, ax2, function(x){ return x < 0 ? NaN : Fx(x); }, P.amber, 3); vl(c2, ax2, X, P.amber, [5, 4], 1.5);
      var fx = T.f(X), Fv = Fx(X); pt(c2, ax2, X, Fv, P.red, 6); var dx = (ax2.x1 - ax2.x0) * 0.14; D.fn(c2, ax2, function(x){ return Fv + fx * (x - X); }, P.red, 2, [6, 4]);
      var sl = (Fx(X + 1e-3) - Fx(X - 1e-3)) / 2e-3; ro.set(0, F(Fv, 4)); ro.set(1, F(fx, 4)); ro.set(2, F(sl, 4)); ro.set(3, T.G);
    });
  }
});

/* 3 ---- aire entre courbes ---- */
var C3 = {
  par: {n: "x² et x + 2", f: function(x){ return x * x; }, g: function(x){ return x + 2; }, x0: -2, x1: 3, y0: -1, y1: 6, a: -1, b: 2, ex: 4.5},
  rac: {n: "√x et x²", f: function(x){ return Math.sqrt(x); }, g: function(x){ return x * x; }, x0: -0.2, x1: 1.4, y0: -0.2, y1: 1.5, a: 0, b: 1, ex: 1 / 3},
  sc: {n: "sin x et cos x", f: Math.sin, g: Math.cos, x0: -0.3, x1: 6.5, y0: -1.4, y1: 1.4, a: PI / 4, b: 5 * PI / 4, ex: 2 * Math.SQRT2},
  cub: {n: "x et x³", f: function(x){ return x; }, g: function(x){ return x * x * x; }, x0: -1.6, x1: 1.6, y0: -1.8, y1: 1.8, a: -1, b: 1, ex: 0.5}
};
SFA.sim({
  id: "um-c04-aire-entre-courbes", ch: "c04", tag: "Aire entre deux courbes",
  titre: "Aire entre deux courbes : intégrale algébrique contre aire géométrique",
  resume: "Deux courbes se croisent : l'aire est ∫|f − g|. Si on oublie la valeur absolue, les morceaux au-dessus et en dessous se compensent.",
  but: "Choisis un couple de courbes et ajuste les bornes a et b. Le vert marque f au-dessus de g, le rouge g au-dessus de f. Compare ∫(f − g) et l'aire.",
  aRetenir: "Aire = ∫<sub>a</sub><sup>b</sup> |f(x) − g(x)| dx : on découpe aux points d'intersection (solutions de f = g) et on intègre « haut − bas » sur chaque morceau. Si f ≥ g sur [a ; b], l'aire est ∫(f − g).",
  piege: "∫(x − x³) dx sur [−1 ; 1] vaut 0 (les deux boucles se compensent) alors que l'aire vaut 1/2.",
  build: function(k, S){
    var c = k.canvas(380), fs = k.select("Couple de courbes", [["par", "x² et x + 2"], ["rac", "√x et x²"], ["sc", "sin x et cos x"], ["cub", "x et x³"]], "par", function(v){ var T = C3[v]; a.el.min = T.x0; a.el.max = T.x1; b.el.min = T.x0; b.el.max = T.x1; a.set(T.a); b.set(T.b); });
    var a = k.slider("Borne a", -2, 3, 0.01, -1, ""), b = k.slider("Borne b", -2, 3, 0.01, 2, ""); var ro = k.readouts(["∫(f − g) (algébrique)", "Aire géométrique ∫|f − g|", "Aire exacte (a, b intersections)", "Écart"]), nt = k.note("", "");
    k.draw(function(){
      c.clear(); var T = C3[fs.value], A = Math.min(a.value, b.value), B = Math.max(a.value, b.value), ax = D.axes(c, {x0: T.x0, x1: T.x1, y0: T.y0, y1: T.y1, xl: "x", yl: "y"});
      var d = function(x){ return T.f(x) - T.g(x); }, ctx = c.ctx;
      var n = 400; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      for (var i = 0; i < n; i++){ var x0 = A + (B - A) * i / n, x1 = A + (B - A) * (i + 1) / n, xm = (x0 + x1) / 2; ctx.fillStyle = d(xm) >= 0 ? "rgba(46,107,85,.30)" : "rgba(180,35,24,.28)"; ctx.beginPath(); ctx.moveTo(ax.X(x0), ax.Y(T.f(x0))); ctx.lineTo(ax.X(x1), ax.Y(T.f(x1))); ctx.lineTo(ax.X(x1), ax.Y(T.g(x1))); ctx.lineTo(ax.X(x0), ax.Y(T.g(x0))); ctx.closePath(); ctx.fill(); }
      ctx.restore(); D.fn(c, ax, T.f, P.acc, 3); D.fn(c, ax, T.g, P.violet, 3); vl(c, ax, A, "#8a95a3", [4, 4], 1.2); vl(c, ax, B, "#8a95a3", [4, 4], 1.2);
      var alg = simpson(d, A, B, 800), geo = simpson(function(x){ return Math.abs(d(x)); }, A, B, 4000);
      lab(c, "f = " + T.n.split(" et ")[0], ax.L + 8, ax.T + 12, P.acc, 13, "left"); lab(c, "g = " + T.n.split(" et ")[1], ax.L + 8, ax.T + 30, P.violet, 13, "left");
      ro.set(0, F(alg, 4)); ro.set(1, F(geo, 4)); ro.set(2, F(T.ex, 4)); ro.set(3, F(geo - alg, 4));
      nt.set(Math.abs(alg - geo) > 1e-3 ? "Attention : les deux signes se compensent partiellement. L'intégrale algébrique " + F(alg, 3) + " ne donne pas l'aire " + F(geo, 3) + "." : "f ≥ g (ou g ≥ f) partout sur [a ; b] : l'intégrale et l'aire coïncident.", Math.abs(alg - geo) > 1e-3 ? "warn" : "ok");
    });
  }
});

/* 4 ---- volumes de révolution (3D) ---- */
var S4 = {
  cone: {n: "Cône : f(x) = x sur [0 ; 3]", f: function(x){ return x; }, a: 0, b: 3, V: 9 * PI, nm: "cône", fm: "π∫₀³ x² dx = 9π"},
  sph: {n: "Sphère de rayon 3 : f(x) = √(9 − x²)", f: function(x){ return Math.sqrt(Math.max(0, 9 - x * x)); }, a: -3, b: 3, V: 36 * PI, nm: "sphère", fm: "π∫₋₃³ (9 − x²) dx = 36π = 4πr³/3"},
  par: {n: "Paraboloïde : f(x) = √x sur [0 ; 4]", f: function(x){ return Math.sqrt(x); }, a: 0, b: 4, V: 8 * PI, nm: "paraboloïde", fm: "π∫₀⁴ x dx = 8π"},
  vase: {n: "Vase : f(x) = 1 + 0,6·sin(1,5x) sur [0 ; 4]", f: function(x){ return 1 + 0.6 * Math.sin(1.5 * x); }, a: 0, b: 4, V: null, nm: "vase", fm: "π∫₀⁴ f(x)² dx (intégrale numérique)"}
};
SFA.sim({
  id: "um-c04-volumes-revolution", ch: "c04", tag: "Volumes de révolution (3D)",
  titre: "Volume d'un solide de révolution : empiler des disques",
  resume: "Fais tourner la courbe autour de l'axe Ox : le solide est une pile de disques d'aire πf(x)². Tourne la vue à la souris et fais varier le nombre de disques.",
  but: "Fais glisser la souris sur la vue 3D pour tourner. Choisis le solide, déplace le disque orange et augmente le nombre de disques empilés : le volume approché converge vers π∫f².",
  aRetenir: "V = π ∫<sub>a</sub><sup>b</sup> [f(x)]² dx (méthode des disques). Cône de rayon r et hauteur h : V = πr²h/3. Sphère : V = 4πr³/3. Chaque tranche d'épaisseur dx est un disque de volume πf(x)²dx.",
  piege: "On élève f au carré, pas la primitive : π(∫f)² ≠ π∫f². Et le résultat est en unités de longueur au cube (cm³).",
  build: function(k, S){
    var c = k.canvas(330), c2 = k.canvas(130), st = {az: 0.55, el: 0.35, drag: false, lx: 0, ly: 0};
    var fs = k.select("Solide", [["cone", "Cône"], ["sph", "Sphère"], ["par", "Paraboloïde"], ["vase", "Vase"]], "cone", function(v){ var T = S4[v]; sx.el.min = T.a; sx.el.max = T.b; sx.set((T.a + T.b) / 2 + (T.b - T.a) * 0.15); });
    var sx = k.slider("Position du disque x", 0, 4, 0.01, 1.5, ""), nd = k.slider("Nombre de disques empilés", 1, 40, 1, 8, ""), show = k.toggle("Afficher la pile de disques", true);
    var ro = k.readouts(["Rayon f(x)", "Aire du disque πf(x)²", "Volume exact", "Volume de la pile"]);
    var lp = k.loop(function(dt){ if (!st.drag) st.az += dt * 0.25; k.redraw(); }); lp.play();
    c.pointer(function(t, p){ if (t === "down"){ st.drag = true; st.lx = p.x; st.ly = p.y; } else if (t === "drag"){ st.az += (p.x - st.lx) * 0.012; st.el = cl(st.el + (p.y - st.ly) * 0.01, -1.2, 1.2); st.lx = p.x; st.ly = p.y; k.redraw(); } else if (t === "up"){ st.drag = false; } });
    function proj(x, y, z, cx, cy, s){ var ca = Math.cos(st.az), sa = Math.sin(st.az), ce = Math.cos(st.el), se = Math.sin(st.el), X = x * ca - y * sa, Y = x * sa + y * ca; return [cx + s * X, cy - s * (z * ce + Y * se)]; }
    k.draw(function(){
      c.clear(); c2.clear(); var T = S4[fs.value], ctx = c.ctx, a = T.a, b = T.b, mid = (a + b) / 2, rmax = 0; for (var i = 0; i <= 60; i++) rmax = Math.max(rmax, T.f(a + (b - a) * i / 60));
      var s = Math.min(c.W * 0.8 / (b - a + 1), c.H * 0.8 / (2 * rmax + 0.5) * 1.1), cx = c.W / 2, cy = c.H / 2, X0 = mid;
      function ring(x, r, col, w, fill){ ctx.beginPath(); for (var j = 0; j <= 48; j++){ var th = 2 * PI * j / 48, p = proj(x - X0, r * Math.cos(th), r * Math.sin(th), cx, cy, s); j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } if (fill){ ctx.fillStyle = fill; ctx.fill(); } ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); }
      var ax0 = proj(a - X0 - 0.4, 0, 0, cx, cy, s), ax1 = proj(b - X0 + 0.5, 0, 0, cx, cy, s); D.line(c, ax0[0], ax0[1], ax1[0], ax1[1], "#9aa5b4", 1.5, [4, 4]); lab(c, "x", ax1[0] + 8, ax1[1], "#6b7380", 13);
      var N = 22; for (i = 0; i <= N; i++){ var x = a + (b - a) * i / N; ring(x, T.f(x), "rgba(30,63,143,.28)", 1); }
      for (var m = 0; m < 10; m++){ var th = 2 * PI * m / 10; ctx.beginPath(); for (i = 0; i <= 60; i++){ x = a + (b - a) * i / 60; var p = proj(x - X0, T.f(x) * Math.cos(th), T.f(x) * Math.sin(th), cx, cy, s); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.strokeStyle = "rgba(30,63,143,.22)"; ctx.lineWidth = 1; ctx.stroke(); }
      if (show.value){ var n = nd.value, h = (b - a) / n; for (i = 0; i < n; i++){ var xl = a + i * h, xm = xl + h / 2, r = T.f(xm); ring(xl, r, "rgba(180,83,9,.85)", 1.3); ring(xl + h, r, "rgba(180,83,9,.85)", 1.3, i === n - 1 ? "rgba(180,83,9,.10)" : null); } }
      var X = sx.value; ring(X, T.f(X), P.red, 2.6, "rgba(180,35,24,.22)");
      var pr = proj(X - X0, 0, 0, cx, cy, s); D.dot(c, pr[0], pr[1], 3.5, P.red);
      lab(c, T.nm, 10, 14, P.ink, 14, "left");
      var ax = D.axes(c2, {x0: a - 0.2, x1: b + 0.2, y0: -rmax * 1.15, y1: rmax * 1.15, hideZero: false, yl: "profil"}); D.fn(c2, ax, T.f, P.acc, 2.6); D.fn(c2, ax, function(x){ return -T.f(x); }, "rgba(30,63,143,.35)", 1.6, [4, 3]); vl(c2, ax, X, P.red, [4, 3], 1.6);
      var Vex = T.V === null ? PI * simpson(function(x){ var v = T.f(x); return v * v; }, a, b, 600) : T.V, nn = nd.value, hh = (b - a) / nn, Vs = 0; for (i = 0; i < nn; i++){ var rr = T.f(a + (i + 0.5) * hh); Vs += PI * rr * rr * hh; }
      ro.set(0, F(T.f(X), 3)); ro.set(1, F(PI * T.f(X) * T.f(X), 3)); ro.set(2, F(Vex, 3) + " (" + (T.V === null ? "num." : "exact") + ")"); ro.set(3, show.value ? F(Vs, 3) + " (n = " + nn + ")" : "—");
    });
  }
});

/* 5 ---- AUC pharmacocinétique + valeur moyenne ---- */
SFA.sim({
  id: "um-c04-auc-pharmaco", ch: "c04", tag: "Aire sous la courbe, valeur moyenne",
  titre: "Aire sous la courbe de concentration (AUC) et concentration moyenne",
  resume: "Après une prise orale, la concentration monte puis redescend. L'intégrale donne l'exposition totale (AUC) ; divisée par la durée, elle donne la concentration moyenne.",
  but: "Fais varier la dose, la vitesse d'absorption k_a, d'élimination k_e et le volume V ; choisis l'horizon T. Le rectangle orange a la même aire que la courbe : sa hauteur est la valeur moyenne.",
  aRetenir: "C(t) = [D·kₐ/(V(kₐ − kₑ))]·(e<sup>−kₑt</sup> − e<sup>−kₐt</sup>). AUC(0 → T) = ∫₀ᵀ C dt ; AUC(0 → ∞) = D/(V·kₑ) = D/Cl (clairance Cl = V·kₑ). Valeur moyenne de C sur [0 ; T] : (1/T) ∫₀ᵀ C(t) dt = AUC/T. Intégrale impropre : ∫₀^∞ e<sup>−kt</sup> dt = 1/k.",
  piege: "L'AUC dépend de la dose et de la clairance, pas de la vitesse d'absorption : changer kₐ modifie le pic mais pas D/(V·kₑ).",
  build: function(k, S){
    var c = k.canvas(360), Dd = k.slider("Dose D", 100, 1000, 50, 500, "mg"), ka = k.slider("Absorption kₐ", 0.3, 3, 0.1, 1.2, "h⁻¹"), ke = k.slider("Élimination kₑ", 0.05, 0.6, 0.01, 0.2, "h⁻¹"), V = k.slider("Volume V", 20, 80, 5, 40, "L"), T = k.slider("Horizon T", 1, 24, 0.5, 12, "h");
    var mv = k.toggle("Montrer le rectangle de valeur moyenne", true);
    var ro = k.readouts(["C max (à t max)", "AUC(0 → T)", "AUC(0 → ∞) = D/(V·kₑ)", "Concentration moyenne sur [0 ; T]"]), nt = k.note("", "");
    k.draw(function(){
      c.clear(); var d = Dd.value, a = ka.value, e = ke.value, v = V.value, TT = T.value; if (Math.abs(a - e) < 0.03) a = e + 0.03;
      var A = d * a / (v * (a - e)), C = function(t){ return t < 0 ? 0 : A * (Math.exp(-e * t) - Math.exp(-a * t)); }, tm = Math.log(a / e) / (a - e), Cm = C(tm);
      var auc = A * ((1 - Math.exp(-e * TT)) / e - (1 - Math.exp(-a * TT)) / a), aucInf = d / (v * e), moy = auc / TT;
      var ax = D.axes(c, {x0: 0, x1: 24, y0: 0, y1: Math.max(10, Math.ceil(Cm * 1.25)), stepX: 2, xl: "t (h)", yl: "C (mg/L)"});
      fillArea(c, ax, C, function(){ return 0; }, 0, TT, "rgba(30,63,143,.22)"); if (mv.value){ var ctx = c.ctx; ctx.fillStyle = "rgba(180,83,9,.16)"; ctx.fillRect(ax.X(0), ax.Y(moy), ax.X(TT) - ax.X(0), ax.Y(0) - ax.Y(moy)); hl(c, ax, moy, P.amber, [6, 4], 1.8); lab(c, "moyenne " + F(moy, 2), ax.X(TT) + 6, ax.Y(moy) - 10, P.amber, 12, TT > 18 ? "right" : "left"); }
      D.fn(c, ax, C, P.acc, 3.2); vl(c, ax, TT, "#8a95a3", [4, 4], 1.3); pt(c, ax, tm, Cm, P.red, 5);
      ro.set(0, F(Cm, 2) + " mg/L (t = " + F(tm, 2) + " h)"); ro.set(1, F(auc, 2) + " mg·h/L"); ro.set(2, F(aucInf, 2) + " mg·h/L"); ro.set(3, F(moy, 3) + " mg/L");
      nt.set("À l'horizon T = " + F(TT, 1) + " h, " + F(auc / aucInf * 100, 1) + " % de l'exposition totale est déjà intégrée. Les 24 h affichées donnent " + F((A * ((1 - Math.exp(-e * 24)) / e - (1 - Math.exp(-a * 24)) / a)) / aucInf * 100, 1) + " %.", "");
    });
  }
});
})();
