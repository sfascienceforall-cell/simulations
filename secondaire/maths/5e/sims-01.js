(function(){
var P = SFA.draw.palette, F = SFA.fmt;
function wrap(u){ return /[ +−\/·√]/.test(u) ? "(" + u + ")" : u; }
function sqAxes(c, R, step){
  var L = 46, Rr = 16, T = 16, B = 34, ph = c.H - T - B, pw = c.W - L - Rr, hx = R * pw / ph;
  return SFA.draw.axes(c, {x0:-hx, x1:hx, y0:-R, y1:R, stepX:step, stepY:step, xl:"x", yl:"y"});
}
function curve(c, ax, pt, t0, t1, col, dash, w){
  var ctx = c.ctx, n = 300; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
  ctx.strokeStyle = col; ctx.lineWidth = w || 2.4; if (dash) ctx.setLineDash(dash); ctx.beginPath();
  for (var i = 0; i <= n; i++){ var t = t0 + (t1 - t0) * i / n, p = pt(t); if (i) ctx.lineTo(ax.X(p[0]), ax.Y(p[1])); else ctx.moveTo(ax.X(p[0]), ax.Y(p[1])); }
  ctx.stroke(); ctx.restore();
}
function clipRect(c, ax, fn){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); fn(); ctx.restore(); }

/* 1. Machine composée */
var LIB = {
  a:{n:"2x + 1", f:function(x){ return 2*x + 1; }, s:function(u){ return "2·" + wrap(u) + " + 1"; }},
  b:{n:"x²", f:function(x){ return x*x; }, s:function(u){ return wrap(u) + "²"; }},
  c:{n:"√x", f:function(x){ return x >= 0 ? Math.sqrt(x) : NaN; }, s:function(u){ return "√" + (u === "x" ? "x" : "(" + u + ")"); }},
  d:{n:"1/x", f:function(x){ return x !== 0 ? 1/x : NaN; }, s:function(u){ return "1/" + wrap(u); }},
  e:{n:"x − 3", f:function(x){ return x - 3; }, s:function(u){ return u + " − 3"; }},
  g:{n:"3 − x", f:function(x){ return 3 - x; }, s:function(u){ return "3 − " + wrap(u); }}
};
var OPTS = Object.keys(LIB).map(function(k){ return [k, LIB[k].n]; });
SFA.sim({
  id:"m5-c01-composee", ch:"c01", tag:"Classique",
  titre:"La machine à composer f∘g",
  resume:"Un nombre traverse g puis f. Compare f∘g et g∘f, vois le domaine.",
  but:"Choisis f et g, déplace x : suis le nombre dans les deux machines et compare les deux compositions.",
  aRetenir:"f∘g(x) = f(g(x)) : on applique g d'abord. En général f∘g ≠ g∘f. Le domaine de f∘g : x doit être dans le domaine de g, et g(x) dans celui de f.",
  piege:"« f∘g = g∘f » est faux en général. Exemple : f(x) = x², g(x) = x − 3 donne (x − 3)² d'un côté, x² − 3 de l'autre.",
  build:function(k, S){
    var c = k.canvas(360);
    var sf = k.select("f", OPTS, "c"), sg = k.select("g", OPTS, "e");
    var x = k.slider("x", -6, 6, 0.25, 4, "");
    var both = k.toggle("Montrer aussi g∘f (rouge, pointillé)", true);
    var ro = k.readouts(["g(x)", "f(g(x))", "g(f(x))"]);
    var nt = k.note("", "");
    function f(v){ return LIB[sf.value].f(v); } function g(v){ return LIB[sg.value].f(v); }
    k.draw(function(){
      c.clear(); var ax = S.draw.axes(c, {x0:-6, x1:6, y0:-6, y1:6, stepX:1, stepY:1, xl:"x", yl:"y"});
      S.draw.line(c, ax.X(-6), ax.Y(-6), ax.X(6), ax.Y(6), P.light, 1);
      S.draw.fn(c, ax, function(t){ return f(g(t)); }, P.acc, 2.6);
      if (both.value) S.draw.fn(c, ax, function(t){ return g(f(t)); }, P.red, 2.2, [6, 5]);
      var gx = g(x.value), fg = f(gx), gf = g(f(x.value));
      S.draw.line(c, ax.X(x.value), ax.Y(0), ax.X(x.value), ax.B, P.grey, 1, [3, 3]);
      if (isFinite(fg)){ S.draw.dot(c, ax.X(x.value), ax.Y(fg), 6, P.acc); }
      if (both.value && isFinite(gf)){ S.draw.dot(c, ax.X(x.value), ax.Y(gf), 5, P.red); }
      ro.set(0, isFinite(gx) ? F(gx, 3) : "indéfini");
      ro.set(1, isFinite(fg) ? F(fg, 3) : "indéfini");
      ro.set(2, isFinite(gf) ? F(gf, 3) : "indéfini");
      var diff = 0, cnt = 0;
      for (var t = -6; t <= 6; t += 0.05){ var u = f(g(t)), v = g(f(t)); if (isFinite(u) && isFinite(v)){ cnt++; if (Math.abs(u - v) > 1e-9) diff++; } }
      var txt = "<b>f∘g(x) = " + LIB[sf.value].s(LIB[sg.value].s("x")) + "</b> &nbsp; · &nbsp; <b>g∘f(x) = " + LIB[sg.value].s(LIB[sf.value].s("x")) + "</b><br>";
      if (!isFinite(gx)) txt += "x = " + F(x.value, 2) + " n'est pas dans le domaine de g : f∘g n'est pas définie ici.";
      else if (!isFinite(fg)) txt += "g(x) = " + F(gx, 3) + " n'est pas dans le domaine de f : f∘g n'est pas définie en ce x.";
      else txt += "Le nombre " + F(x.value, 2) + " devient " + F(gx, 3) + " après g, puis " + F(fg, 3) + " après f.";
      txt += cnt && !diff ? "<br>Sur [−6 ; 6], f∘g et g∘f coïncident partout où elles sont définies." : "<br>Ici f∘g et g∘f diffèrent : l'ordre compte.";
      nt.set(txt, diff ? "warn" : "ok");
    });
  }
});

/* 2. Symétrie des réciproques */
var RC = {
  a:{n:"f(x) = 2x − 3", f:function(x){ return 2*x - 3; }, g:function(x){ return (x + 3)/2; }, gs:"f⁻¹(x) = (x + 3)/2", lo:-1.5, hi:4.5},
  b:{n:"f(x) = x³", f:function(x){ return x*x*x; }, g:function(x){ return x < 0 ? -Math.pow(-x, 1/3) : Math.pow(x, 1/3); }, gs:"f⁻¹(x) = ∛x", lo:-1.8, hi:1.8},
  c:{n:"f(x) = √x", f:function(x){ return x >= 0 ? Math.sqrt(x) : NaN; }, g:function(x){ return x >= 0 ? x*x : NaN; }, gs:"f⁻¹(x) = x² (x ≥ 0)", lo:0, hi:6},
  d:{n:"f(x) = x² + 1 (x ≥ 0)", f:function(x){ return x >= 0 ? x*x + 1 : NaN; }, g:function(x){ return x >= 1 ? Math.sqrt(x - 1) : NaN; }, gs:"f⁻¹(x) = √(x − 1)", lo:0, hi:2.2},
  e:{n:"f(x) = 1/x", f:function(x){ return x !== 0 ? 1/x : NaN; }, g:function(x){ return x !== 0 ? 1/x : NaN; }, gs:"f⁻¹(x) = 1/x (f est sa propre réciproque)", lo:-6, hi:6}
};
SFA.sim({
  id:"m5-c01-symetrie-reciproque", ch:"c01", tag:"Classique",
  titre:"La réciproque, symétrique par rapport à y = x",
  resume:"Fais glisser P sur f : son symétrique Q est sur f⁻¹.",
  but:"Glisse le point P sur la courbe de f (souris, doigt ou curseur) : regarde Q = (f(a) ; a) sur la courbe de f⁻¹.",
  aRetenir:"Si (a ; b) est sur le graphe de f, alors (b ; a) est sur celui de f⁻¹ : les deux courbes sont symétriques par rapport à la droite y = x.",
  piege:"f⁻¹(x) n'est pas 1/f(x). Par exemple, pour f(x) = 2x − 3, f⁻¹(5) = 4 alors que 1/f(5) = 1/7.",
  build:function(k, S){
    var c = k.canvas(380);
    var sel = k.select("Fonction", Object.keys(RC).map(function(q){ return [q, RC[q].n]; }), "a", function(){ var r = RC[sel.value]; a.el.min = r.lo; a.el.max = r.hi; a.set(Math.max(r.lo, Math.min(r.hi, r.lo === 0 ? 1 : (r.lo + r.hi)/2 + 0.5))); });
    var a = k.slider("a (abscisse de P)", -3, 3, 0.05, 1, "");
    var ro = k.readouts(["P = (a ; f(a))", "Q = (f(a) ; a)", "f⁻¹(f(a))"]);
    var nt = k.note("", "ok");
    var ax;
    c.pointer(function(type, p){ if (type === "down" || type === "drag"){ var r = RC[sel.value], v = Math.round(ax.ix(p.x) / 0.05) * 0.05; a.set(Math.max(r.lo, Math.min(r.hi, v))); k.redraw(); } });
    k.draw(function(){
      var r = RC[sel.value]; c.clear(); ax = sqAxes(c, 6, 1);
      S.draw.line(c, ax.X(-20), ax.Y(-20), ax.X(20), ax.Y(20), P.grey, 1.6, [6, 5]);
      S.draw.fn(c, ax, r.f, P.acc, 2.6); S.draw.fn(c, ax, r.g, P.green, 2.6);
      var av = a.value, b = r.f(av);
      if (!isFinite(b)){ nt.set("a = 0 est interdit pour 1/x : f n'est pas définie.", "warn"); ro.set(0, "indéfini"); ro.set(1, "indéfini"); ro.set(2, "—"); return; }
      var out = Math.abs(av) > 6 || Math.abs(b) > 6;
      S.draw.line(c, ax.X(av), ax.Y(b), ax.X(b), ax.Y(av), P.amber, 1.5, [3, 3]);
      S.draw.dot(c, ax.X(av), ax.Y(b), 6, P.acc); S.draw.dot(c, ax.X(b), ax.Y(av), 6, P.green);
      S.draw.text(c, "P", ax.X(av) + 10, ax.Y(b) - 10, {color:P.acc}); S.draw.text(c, "Q", ax.X(b) + 10, ax.Y(av) - 10, {color:P.green});
      S.draw.text(c, "f", ax.R - 14, ax.T + 12, {color:P.acc, size:13}); S.draw.text(c, "f⁻¹", ax.R - 30, ax.T + 28, {color:P.green, size:13});
      ro.set(0, "(" + F(av, 2) + " ; " + F(b, 2) + ")"); ro.set(1, "(" + F(b, 2) + " ; " + F(av, 2) + ")"); ro.set(2, F(r.g(b), 2));
      if (out){ nt.set("<b>" + r.gs + "</b>. P ou Q sort du cadre (|coordonnée| > 6) : les valeurs affichées restent justes, rapproche P de l'origine pour voir les deux points.", "warn"); return; }
      nt.set("<b>" + r.gs + "</b>. P et Q sont symétriques par rapport à y = x : le segment PQ est perpendiculaire à la droite et son milieu y est situé.", "ok");
    });
    sel.el.dispatchEvent(new Event("change"));
  }
});

/* 3. Restriction de domaine */
SFA.sim({
  id:"m5-c01-restriction", ch:"c01", tag:"Domaine",
  titre:"Restreindre pour pouvoir inverser",
  resume:"La parabole n'est pas injective ; une branche l'est.",
  but:"Pour f(x) = (x − h)², trace la droite horizontale y = c : combien d'intersections ? Restreins le domaine et regarde apparaître la réciproque.",
  aRetenir:"f admet une réciproque seulement si chaque valeur de y est atteinte au plus une fois (f injective). Pour la parabole, on garde une branche : x ≥ h donne f⁻¹(x) = h + √x ; x ≤ h donne f⁻¹(x) = h − √x.",
  piege:"« La réciproque de x² est √x » n'est vrai que sur x ≥ 0. Sur x ≤ 0, c'est −√x. Sans restriction, il n'y a pas de réciproque : la symétrique de la parabole n'est pas une fonction.",
  build:function(k, S){
    var c = k.canvas(380);
    var h = k.slider("h (sommet en x = h)", -3, 3, 0.5, 0, "");
    var dom = k.seg("Domaine de f", [["R", "ℝ entier"], ["p", "x ≥ h"], ["m", "x ≤ h"]], "R");
    var cc = k.slider("c (droite y = c)", -1, 8, 0.25, 4, "");
    var ro = k.readouts(["Solutions de f(x) = c", "f injective ?", "f⁻¹(c)"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear(); var ax = sqAxes(c, 8, 2), H = h.value, C = cc.value, d = dom.value;
      S.draw.line(c, ax.X(-30), ax.Y(-30), ax.X(30), ax.Y(30), P.grey, 1.2, [6, 5]);
      var inDom = function(x){ return d === "R" || (d === "p" && x >= H - 1e-9) || (d === "m" && x <= H + 1e-9); };
      curve(c, ax, function(t){ return [t, (t - H)*(t - H)]; }, H - 4, H + 4, P.light, null, 2.4);
      var t0 = d === "p" ? H : H - 4, t1 = d === "m" ? H : H + 4;
      curve(c, ax, function(t){ return [t, (t - H)*(t - H)]; }, t0, t1, P.acc, null, 3);
      curve(c, ax, function(t){ return [(t - H)*(t - H), t]; }, t0, t1, d === "R" ? P.red : P.green, d === "R" ? [6, 5] : null, 2.6);
      S.draw.line(c, ax.L, ax.Y(C), ax.R, ax.Y(C), P.amber, 1.6);
      var sols = [];
      if (C >= 0){ var r = Math.sqrt(C); [H + r, H - r].forEach(function(x, i){ if ((i === 0 || r > 1e-12) && inDom(x)) sols.push(x); }); }
      sols.forEach(function(x){ S.draw.dot(c, ax.X(x), ax.Y(C), 6, P.amber); });
      ro.set(0, String(sols.length)); var inj = d !== "R"; ro.set(1, inj ? "oui" : "non");
      ro.set(2, inj && C >= 0 ? F(d === "p" ? H + Math.sqrt(C) : H - Math.sqrt(C), 2) : "—");
      if (d === "R") nt.set("Sur ℝ, la droite y = c coupe la parabole <b>deux fois</b> (si c > 0) : un même c aurait deux antécédents. La courbe rouge (symétrique) n'est pas le graphe d'une fonction : elle a deux points pour un même x.", "warn");
      else nt.set("Domaine restreint : au plus <b>une</b> intersection. Le symétrique (vert) est le graphe de f⁻¹ : f⁻¹(x) = " + (d === "p" ? "h + √x" : "h − √x") + ", défini pour x ≥ 0." + (C < 0 ? " Ici c < 0 : aucun antécédent." : ""), "ok");
    });
  }
});

/* 4. Homographique */
SFA.sim({
  id:"m5-c01-homographique", ch:"c01", tag:"Niche utile",
  titre:"La fonction homographique f(x) = (ax + b)/(cx + d)",
  resume:"Asymptotes, centre de symétrie et sens de variation selon a, b, c, d.",
  but:"Modifie a, b, c, d : retrouve les deux asymptotes et le centre de symétrie. Déplace P : son symétrique par rapport au centre est encore sur la courbe.",
  aRetenir:"Pour c ≠ 0 et ad − bc ≠ 0 : asymptote verticale x = −d/c, horizontale y = a/c, centre de symétrie leur point d'intersection. Si ad − bc > 0 chaque branche monte ; si ad − bc < 0, elle descend.",
  piege:"Si ad − bc = 0, la fraction se simplifie : f est constante (avec un trou en x = −d/c), il n'y a plus d'asymptote.",
  build:function(k, S){
    var c = k.canvas(380);
    var a = k.slider("a", -5, 5, 1, 2, ""), b = k.slider("b", -5, 5, 1, 1, ""), cc = k.slider("c", -5, 5, 1, 1, ""), d = k.slider("d", -5, 5, 1, -1, "");
    var u = k.slider("u (P à la distance u du centre)", -6, 6, 0.25, 2, "");
    var ro = k.readouts(["Asympt. verticale", "Asympt. horizontale", "ad − bc"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear(); var ax = S.draw.axes(c, {x0:-8, x1:8, y0:-8, y1:8, stepX:2, stepY:2, xl:"x", yl:"y"});
      var A = a.value, B = b.value, C = cc.value, D = d.value, det = A*D - B*C;
      var f = function(x){ return C*x + D === 0 ? NaN : (A*x + B)/(C*x + D); };
      ro.set(2, F(det, 0));
      if (C === 0){
        S.draw.fn(c, ax, function(x){ return D === 0 ? NaN : (A*x + B)/D; }, P.acc, 2.6);
        ro.set(0, "aucune"); ro.set(1, "aucune");
        nt.set(D === 0 ? "c = 0 et d = 0 : dénominateur nul, f n'est pas définie." : "c = 0 : f(x) = (a/d)·x + b/d est une fonction du premier degré, pas une homographique.", "warn"); return;
      }
      var xc = -D/C, yc = A/C;
      if (det === 0){
        S.draw.fn(c, ax, function(x){ return Math.abs(x - xc) < 1e-9 ? NaN : yc; }, P.acc, 2.6);
        S.draw.dot(c, ax.X(xc), ax.Y(yc), 6, "#fff"); c.ctx.beginPath(); c.ctx.arc(ax.X(xc), ax.Y(yc), 6, 0, 7); c.ctx.strokeStyle = P.acc; c.ctx.lineWidth = 2; c.ctx.stroke();
        ro.set(0, "aucune"); ro.set(1, "aucune");
        nt.set("ad − bc = 0 : la fraction se simplifie, f(x) = " + F(yc, 2) + " pour x ≠ " + F(xc, 2) + ". Une droite avec un <b>trou</b> en x = " + F(xc, 2) + " (rond vide), pas d'asymptote.", "warn"); return;
      }
      S.draw.line(c, ax.X(xc), ax.T, ax.X(xc), ax.B, P.red, 1.5, [6, 5]); S.draw.line(c, ax.L, ax.Y(yc), ax.R, ax.Y(yc), P.red, 1.5, [6, 5]);
      S.draw.fn(c, ax, f, P.acc, 2.6);
      S.draw.dot(c, ax.X(xc), ax.Y(yc), 5, P.red);
      var x1 = xc + u.value, x2 = xc - u.value;
      if (Math.abs(u.value) > 1e-9){
        var y1 = f(x1), y2 = 2*yc - y1;
        S.draw.line(c, ax.X(x1), ax.Y(y1), ax.X(x2), ax.Y(y2), P.amber, 1.4, [3, 3]);
        S.draw.dot(c, ax.X(x1), ax.Y(y1), 6, P.acc); S.draw.dot(c, ax.X(x2), ax.Y(y2), 6, P.green);
        S.draw.text(c, "P", ax.X(x1) + 10, ax.Y(y1) - 10, {color:P.acc}); S.draw.text(c, "P′", ax.X(x2) + 12, ax.Y(y2) - 10, {color:P.green});
        nt.set("Centre de symétrie (" + F(xc, 2) + " ; " + F(yc, 2) + "). P = (" + F(x1, 2) + " ; " + F(y1, 2) + "), son symétrique P′ = (" + F(x2, 2) + " ; " + F(y2, 2) + ") vérifie f(" + F(x2, 2) + ") = " + F(f(x2), 2) + (det > 0 ? ". ad − bc > 0 : f croissante sur chaque branche." : ". ad − bc < 0 : f décroissante sur chaque branche."), "ok");
      } else nt.set("u = 0 : P serait sur l'asymptote verticale. Choisis u ≠ 0.", "warn");
      ro.set(0, "x = " + F(xc, 2)); ro.set(1, "y = " + F(yc, 2));
    });
  }
});
})();
