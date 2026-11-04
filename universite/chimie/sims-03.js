/* Chimie BA1 · c03 · VSEPR et polarité — contenu SFA original */
(function(){
var DEBYE = 3.336e-30, QE = 1.602e-19, KB = 1.381e-23;
var ELCOL = {H:"#d9dee6", C:"#3b4350", O:"#c0392b", N:"#2f5fb3", F:"#5aa469", Cl:"#2e8b57", B:"#d08a3c", Xe:"#7b5cb8", S:"#d4b200", P:"#d17a22", Br:"#8b3a2e"};

/* projection orthographique après rotation autour de y (a) puis de x (b) */
function rot(p, a, b){
  var x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
  var y2 = y * Math.cos(b) - z * Math.sin(b), z2 = y * Math.sin(b) + z * Math.cos(b);
  return [x, y2, z2];
}
function dragger(c, st){
  c.pointer(function(type, p){
    if (type === "down"){ st.lx = p.x; st.ly = p.y; }
    if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.012; st.b += (p.y - st.ly) * 0.012; st.lx = p.x; st.ly = p.y; c.redrawFn(); }
    if (type === "up") st.lx = null;
  });
}

/* ---------- 1. Géométries VSEPR en 3D ---------- */
var UNIT = {
  2:[[0,0,1],[0,0,-1]],
  3:[[1,0,0],[-0.5,0.866,0],[-0.5,-0.866,0]],
  4:[[0.577,0.577,0.577],[0.577,-0.577,-0.577],[-0.577,0.577,-0.577],[-0.577,-0.577,0.577]],
  5:[[0,0,1],[0,0,-1],[1,0,0],[-0.5,0.866,0],[-0.5,-0.866,0]],
  6:[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]
};
var LPIDX = {3:[2], 4:[3,2], 5:[4,3,2], 6:[5,4]};
var GEO = {
  "2,0":["AX₂","linéaire","180°","sp","CO₂, BeCl₂"],
  "3,0":["AX₃","trigonale plane","120°","sp²","BF₃, SO₃"],
  "3,1":["AX₂E","en V (angulaire)","≈ 117–119° (inférieur à 120°)","sp²","SO₂, O₃"],
  "4,0":["AX₄","tétraédrique","109,5°","sp³","CH₄, CCl₄"],
  "4,1":["AX₃E","pyramidale à base triangulaire","≈ 107°","sp³","NH₃, PCl₃"],
  "4,2":["AX₂E₂","en V (angulaire)","≈ 104,5°","sp³","H₂O, H₂S"],
  "5,0":["AX₅","bipyramide trigonale","90° et 120°","sp³d","PCl₅"],
  "5,1":["AX₄E","en bascule (balançoire)","≈ 102° et ≈ 173°","sp³d","SF₄"],
  "5,2":["AX₃E₂","en T","≈ 87,5°","sp³d","ClF₃"],
  "5,3":["AX₂E₃","linéaire","180°","sp³d","XeF₂, I₃⁻"],
  "6,0":["AX₆","octaédrique","90°","sp³d²","SF₆"],
  "6,1":["AX₅E","pyramide à base carrée","≈ 85–90°","sp³d²","BrF₅"],
  "6,2":["AX₄E₂","plan carré","90°","sp³d²","XeF₄"]
};
SFA.sim({
  id:"uc-c03-vsepr-3d", ch:"c03", tag:"Géométrie",
  titre:"VSEPR en 3D : de AXₙEₘ à la forme et à la polarité",
  resume:"Choisis le nombre de domaines et de doublets libres, fais tourner la molécule à la souris : forme, angles, hybridation et polarité.",
  but:"Fixe le nombre total de domaines d'électrons autour de l'atome central, puis le nombre de doublets non liants. Glisse sur le dessin pour tourner la molécule. La polarité est calculée comme somme vectorielle des dipôles de liaison identiques.",
  aRetenir:"Les domaines se placent le plus loin possible les uns des autres ; les doublets non liants, plus répulsifs, se mettent en équatorial (bipyramide trigonale) ou en trans (octaèdre) et compriment les angles de liaison. On décrit la forme avec les atomes seuls (pas avec les doublets) : AX₃E est pyramidale, AX₂E₂ est en V.",
  piege:"Le nombre de domaines compte les doublets liants (un domaine par liaison, simple, double ou triple) et les doublets libres. La forme n'est pas la géométrie des domaines : NH₃ est tétraédrique pour ses domaines mais pyramidale par ses atomes. L'hybridation sp³d et sp³d² pour les hypervalents est une description d'enseignement, la contribution des orbitales d est discutée.",
  build:function(k, S){
    var c = k.canvas(400);
    var st = {a:0.6, b:0.35};
    var sn = k.seg("Domaines d'électrons", [[2,"2"],[3,"3"],[4,"4"],[5,"5"],[6,"6"]], 4);
    var es = k.seg("Doublets non liants E", [[0,"0"],[1,"1"],[2,"2"],[3,"3"]], 0);
    var ro = k.readouts(["Notation", "Forme", "Angles", "Hybridation", "Exemples", "Molécule polaire ?"]);
    var nt = k.note("", "ok");
    c.redrawFn = function(){ k.redraw(); };
    dragger(c, st);
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, n = +sn.value, e = +es.value;
      var maxE = {2:0, 3:1, 4:2, 5:3, 6:2}[n];
      var warn = "";
      if (e > maxE){ e = maxE; warn = "Avec " + n + " domaines, on ne place pas plus de " + maxE + " doublet(s) non liant(s) dans les cas usuels (E = " + maxE + " affiché)."; }
      c.clear();
      var pos = UNIT[n], lp = (LPIDX[n] || []).slice(0, e), sc = Math.min(W, H) * 0.34;
      var items = [];
      pos.forEach(function(p, i){ var isLP = lp.indexOf(i) >= 0, r = rot(p, st.a, st.b); items.push({r:r, lp:isLP, i:i}); });
      items.push({r:[0,0,0], center:true});
      items.sort(function(p, q){ return p.r[2] - q.r[2]; });
      var cx = W / 2, cy = H / 2;
      items.forEach(function(it){
        var x = cx + it.r[0] * sc, y = cy - it.r[1] * sc, d = 0.85 + it.r[2] * 0.15;
        if (!it.center) S.draw.line(c, cx, cy, x, y, it.lp ? "rgba(91,33,182,.0)" : P.ink, it.lp ? 0 : 3);
        if (it.center){ S.draw.dot(c, x, y, 20, P.acc); S.draw.text(c, "A", x, y, {size:14, color:"#fff"}); }
        else if (it.lp){
          ctx.fillStyle = "rgba(91,33,182,.28)"; ctx.beginPath(); ctx.ellipse(x, y, 24 * d, 17 * d, Math.atan2(-(y - cy), x - cx) * -1, 0, 7); ctx.fill();
          ctx.strokeStyle = P.violet; ctx.lineWidth = 1.5; ctx.stroke();
          S.draw.dot(c, x - 4, y, 2.6, P.violet); S.draw.dot(c, x + 4, y, 2.6, P.violet);
        } else { S.draw.dot(c, x, y, 13 * d, P.green); S.draw.text(c, "X", x, y, {size:12 * d, color:"#fff"}); }
      });
      S.draw.text(c, "Glisse pour tourner", 70, H - 12, {size:11, color:P.grey});
      var g = GEO[n + "," + e];
      var sum = [0, 0, 0];
      pos.forEach(function(p, i){ if (lp.indexOf(i) < 0){ sum[0] += p[0]; sum[1] += p[1]; sum[2] += p[2]; } });
      var net = Math.hypot(sum[0], sum[1], sum[2]);
      ro.set(0, g[0]); ro.set(1, g[1]); ro.set(2, g[2]); ro.set(3, g[3]); ro.set(4, g[4]);
      ro.set(5, net < 1e-6 ? "non (dipôles qui s'annulent)" : "oui (somme ≠ 0)");
      nt.set((warn ? warn + " " : "") + "Domaines : " + n + " dont " + e + " non liant(s). Somme vectorielle des " + (n - e) + " dipôles X–A égaux : " + S.fmt(net, 2) + " (en unités d'un dipôle de liaison). Un doublet libre n'est pas ajouté ici : si X est le même partout, la polarité vient de la forme.", warn ? "warn" : "ok");
    });
  }
});

/* ---------- 2. Moment dipolaire : somme vectorielle ---------- */
var T = [[0.577,0.577,0.577],[0.577,-0.577,-0.577],[-0.577,0.577,-0.577],[-0.577,-0.577,0.577]];
var cosN = 0.3599, sinN = Math.sqrt(1 - cosN * cosN);
function tetra(sym, which){ /* which = [symboles aux 4 sommets] */
  var at = [[sym, 0, 0, 0]], bd = [];
  which.forEach(function(s, i){ at.push([s, T[i][0] * 1.1, T[i][1] * 1.1, T[i][2] * 1.1]); bd.push([0, i + 1, s === "Cl" ? 1.5 : 0]); });
  return {at:at, bd:bd};
}
function ring(sub){ /* sub = positions des Cl (0..5) */
  var at = [], bd = [];
  for (var i = 0; i < 6; i++){ var a = Math.PI / 2 - i * Math.PI / 3; at.push(["C", Math.cos(a) * 1, Math.sin(a) * 1, 0]); }
  for (var j = 0; j < 6; j++) bd.push([j, (j + 1) % 6, 0]);
  for (var m = 0; m < 6; m++){ var a2 = Math.PI / 2 - m * Math.PI / 3, isCl = sub.indexOf(m) >= 0; at.push([isCl ? "Cl" : "H", Math.cos(a2) * 2, Math.sin(a2) * 2, 0]); bd.push([m, 6 + m, isCl ? 1.5 : 0]); }
  return {at:at, bd:bd};
}
var MOLS = {
  co2:{nom:"CO₂", exp:0, at:[["C",0,0,0],["O",-1.16,0,0],["O",1.16,0,0]], bd:[[0,1,2.3],[0,2,2.3]]},
  h2o:{nom:"H₂O", exp:1.85, at:[["O",0,0,0],["H",-0.757,0.586,0],["H",0.757,0.586,0]], bd:[[1,0,1.51],[2,0,1.51]]},
  nh3:{nom:"NH₃", exp:1.47, at:[["N",0,0,0],["H",sinN,0,-cosN],["H",-sinN/2,sinN*0.866,-cosN],["H",-sinN/2,-sinN*0.866,-cosN]], bd:[[1,0,1.31],[2,0,1.31],[3,0,1.31]]},
  bf3:{nom:"BF₃", exp:0, at:[["B",0,0,0],["F",1.3,0,0],["F",-0.65,1.126,0],["F",-0.65,-1.126,0]], bd:[[0,1,1.5],[0,2,1.5],[0,3,1.5]]},
  ccl4:Object.assign({nom:"CCl₄", exp:0}, tetra("C", ["Cl","Cl","Cl","Cl"])),
  chcl3:Object.assign({nom:"CHCl₃", exp:1.04}, tetra("C", ["H","Cl","Cl","Cl"])),
  ch2cl2:Object.assign({nom:"CH₂Cl₂", exp:1.60}, tetra("C", ["H","H","Cl","Cl"])),
  ch3cl:Object.assign({nom:"CH₃Cl", exp:1.87}, tetra("C", ["H","H","H","Cl"])),
  ch2o:{nom:"H₂C=O (méthanal)", exp:2.33, at:[["C",0,0,0],["O",1.21,0,0],["H",-0.55,0.95,0],["H",-0.55,-0.95,0]], bd:[[0,1,2.3],[0,2,0],[0,3,0]]},
  cis:{nom:"cis-1,2-dichloroéthène", exp:1.90, at:[["C",-0.67,0,0],["C",0.67,0,0],["Cl",-1.5,1.5,0],["Cl",1.5,1.5,0],["H",-1.2,-0.95,0],["H",1.2,-0.95,0]], bd:[[0,1,0],[0,2,1.5],[1,3,1.5],[0,4,0],[1,5,0]]},
  trans:{nom:"trans-1,2-dichloroéthène", exp:0, at:[["C",-0.67,0,0],["C",0.67,0,0],["Cl",-1.5,1.5,0],["Cl",1.5,-1.5,0],["H",-1.2,-0.95,0],["H",1.2,0.95,0]], bd:[[0,1,0],[0,2,1.5],[1,3,1.5],[0,4,0],[1,5,0]]},
  ortho:Object.assign({nom:"ortho-dichlorobenzène", exp:2.50}, ring([0,1])),
  meta:Object.assign({nom:"méta-dichlorobenzène", exp:1.72}, ring([0,2])),
  para:Object.assign({nom:"para-dichlorobenzène", exp:0}, ring([0,3])),
  xef4:{nom:"XeF₄ (plan carré)", exp:0, at:[["Xe",0,0,0],["F",1.95,0,0],["F",-1.95,0,0],["F",0,1.95,0],["F",0,-1.95,0]], bd:[[0,1,1.0],[0,2,1.0],[0,3,1.0],[0,4,1.0]]}
};
SFA.sim({
  id:"uc-c03-moment-dipolaire", ch:"c03", tag:"Polarité",
  titre:"Moment dipolaire : somme vectorielle des dipôles de liaison",
  resume:"Pour 15 molécules, additionne les dipôles de liaison : CO₂ et CCl₄ s'annulent, H₂O et CHCl₃ non. Compare à la valeur mesurée.",
  but:"Choisis une molécule et fais-la tourner. Les flèches orange sont les dipôles de liaison (vers l'atome le plus électronégatif) ; la flèche rouge est leur somme vectorielle. Lis le moment calculé et compare-le à la valeur expérimentale.",
  aRetenir:"μ = Σ des moments de liaison (grandeurs vectorielles) : une molécule est polaire si cette somme n'est pas nulle. Des liaisons polaires peuvent donner une molécule apolaire (CO₂, BF₃, CCl₄, trans-C₂H₂Cl₂, para-C₆H₄Cl₂, XeF₄). Unité : le debye, 1 D = 3,336·10⁻³⁰ C·m.",
  piege:"Le calcul vectoriel de ce simulateur est un modèle simplifié : les liaisons C–H sont prises apolaires, les doublets libres ne sont pas ajoutés, et les moments de liaison sont supposés indépendants (additivité). Il prédit bien polaire/apolaire mais l'ordre de grandeur seulement (CHCl₃ : le modèle surestime). Dans NH₃ et H₂O, le doublet non liant contribue au moment réel.",
  build:function(k, S){
    var c = k.canvas(380);
    var st = {a:0.5, b:0.3};
    var ms = k.select("Molécule", Object.keys(MOLS).map(function(m){ return [m, MOLS[m].nom]; }), "h2o");
    var tg = k.toggle("Montrer les dipôles de liaison", true);
    var ro = k.readouts(["μ calculé (modèle)", "μ expérimental", "Polaire ?"]);
    var nt = k.note("", "ok");
    c.redrawFn = function(){ k.redraw(); };
    dragger(c, st);
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, m = MOLS[ms.value];
      c.clear();
      var sum = [0, 0, 0];
      m.bd.forEach(function(b){
        var a = m.at[b[0]], q = m.at[b[1]], v = [q[1] - a[1], q[2] - a[2], q[3] - a[3]], L = Math.hypot(v[0], v[1], v[2]);
        for (var i = 0; i < 3; i++) sum[i] += b[2] * v[i] / L;
      });
      var net = Math.hypot(sum[0], sum[1], sum[2]); if (net < 1e-9) net = 0;
      var sc = Math.min(W, H) * (m.at.length > 7 ? 0.17 : 0.2);
      var cen = [0, 0, 0]; m.at.forEach(function(a){ cen[0] += a[1]; cen[1] += a[2]; cen[2] += a[3]; }); cen = cen.map(function(v){ return v / m.at.length; });
      function P2(a){ var r = rot([a[1] - cen[0], a[2] - cen[1], a[3] - cen[2]], st.a, st.b); return [W / 2 + r[0] * sc, H / 2 - r[1] * sc, r[2]]; }
      var pr = m.at.map(P2);
      m.bd.forEach(function(b){ S.draw.line(c, pr[b[0]][0], pr[b[0]][1], pr[b[1]][0], pr[b[1]][1], P.grey, 3); });
      var order = m.at.map(function(a, i){ return i; }).sort(function(i, j){ return pr[i][2] - pr[j][2]; });
      order.forEach(function(i){ var a = m.at[i], r = pr[i][2]; S.draw.dot(c, pr[i][0], pr[i][1], (a[0] === "H" ? 9 : 14) * (0.9 + r * 0.06), ELCOL[a[0]] || P.grey); S.draw.text(c, a[0], pr[i][0], pr[i][1], {size:a[0] === "H" ? 10 : 12, color:a[0] === "H" ? P.ink : "#fff"}); });
      if (tg.value) m.bd.forEach(function(b){
        if (!b[2]) return;
        var x1 = pr[b[0]][0], y1 = pr[b[0]][1], x2 = pr[b[1]][0], y2 = pr[b[1]][1];
        var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = (x2 - x1), dy = (y2 - y1), L = Math.hypot(dx, dy) || 1;
        S.draw.arrow(c, mx - dx / L * 14 - dy / L * 9, my - dy / L * 14 + dx / L * 9, mx + dx / L * 14 - dy / L * 9, my + dy / L * 14 + dx / L * 9, P.amber, 2.4);
      });
      if (net > 0){
        var nv = rot(sum, st.a, st.b), nx = nv[0] * 42, ny = -nv[1] * 42;
        S.draw.arrow(c, W / 2 - nx / 2, H - 62 - ny / 2, W / 2 + nx / 2, H - 62 + ny / 2, P.red, 4);
        S.draw.text(c, "μ net", W / 2 + 40, H - 14, {size:12, color:P.red});
      } else S.draw.text(c, "somme vectorielle = 0", W / 2, H - 30, {size:13, color:P.green});
      S.draw.text(c, "Glisse pour tourner", 70, 16, {size:11, color:P.grey});
      ro.set(0, S.fmt(net, 2) + " D"); ro.set(1, S.fmt(m.exp, 2) + " D"); ro.set(2, net > 1e-6 ? "oui" : "non");
      var diff = Math.abs(net - m.exp);
      nt.set(net > 1e-6 ? ("Les dipôles de liaison ne se compensent pas : " + S.fmt(net, 2) + " D (valeur mesurée " + S.fmt(m.exp, 2) + " D)." + (diff > 0.5 ? " L'écart est grand : additivité des moments de liaison, doublets libres et polarisation mutuelle ne sont pas pris en compte." : "")) : "Par symétrie, la somme vectorielle est nulle : molécule apolaire malgré des liaisons polaires.", diff > 0.5 ? "warn" : "ok");
    });
  }
});

/* ---------- 3. Pourcentage ionique à partir de μ mesuré ---------- */
var HX = [["hf","HF",1.83,91.7,1.78],["hcl","HCl",1.11,127.4,0.96],["hbr","HBr",0.83,141.4,0.76],["hi","HI",0.45,160.9,0.46],["lif","LiF (gaz)",6.33,156.4,3.00],["nacl","NaCl (gaz)",9.00,236.1,2.23],["kcl","KCl (gaz)",10.27,266.7,2.34]];
SFA.sim({
  id:"uc-c03-pourcentage-ionique", ch:"c03", tag:"Polarité",
  titre:"Caractère ionique d'une liaison : μ = δ·e·d",
  resume:"De μ mesuré et de la longueur de liaison, déduis la charge partielle δ et le pourcentage ionique ; compare à la formule de Pauling.",
  but:"Choisis une molécule diatomique : règle le pourcentage ionique pour retrouver le moment dipolaire mesuré. La charge partielle exacte correspond à μ<sub>exp</sub> = δ·e·d.",
  aRetenir:"μ = q·d avec q = δ·e. Pour une liaison 100 % ionique, μ = e·d (≈ 4,8 D par Å). Pourcentage ionique = μ<sub>exp</sub>/(e·d) × 100. Le caractère ionique grandit avec Δχ, mais la formule de Pauling 100·(1 − e<sup>−Δχ²/4</sup>) n'est qu'une tendance.",
  piege:"Ne confonds pas un moment dipolaire élevé (grand μ, peut venir d'une grande longueur) et un caractère ionique élevé (δ proche de 1). HI est moins polaire que HF mais pas parce que d est plus petit : parce que δ est plus faible. Les valeurs des sels sont des molécules isolées en phase gazeuse, pas des cristaux.",
  build:function(k, S){
    var c = k.canvas(340);
    var ms = k.select("Molécule diatomique", HX.map(function(h){ return [h[0], h[1] + " (Δχ = " + S.fmt(h[4], 2) + ")"]; }), "hcl");
    var sl = k.slider("Pourcentage ionique supposé", 0, 100, 1, 50, "%");
    var ro = k.readouts(["μ expérimental", "e·d (100 % ionique)", "% ionique réel", "% ionique (Pauling)", "μ calculé avec ton %"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, h = HX.filter(function(x){ return x[0] === ms.value; })[0];
      c.clear();
      var mu = h[2], d = h[3] * 1e-12, ed = QE * d / DEBYE, real = mu / ed * 100, paul = 100 * (1 - Math.exp(-h[4] * h[4] / 4));
      var mc = sl.value / 100 * ed;
      /* graphe : % ionique en fonction de Δχ */
      var ax = S.draw.axes(c, {x0:0, x1:3.5, y0:0, y1:100, xl:"Δχ", yl:"% ionique", stepX:0.5, stepY:20});
      S.draw.fn(c, ax, function(x){ return 100 * (1 - Math.exp(-x * x / 4)); }, P.grey, 2, [6,4]);
      HX.forEach(function(q){ var rr = q[2] / (QE * q[3] * 1e-12 / DEBYE) * 100; S.draw.dot(c, ax.X(q[4]), ax.Y(rr), q[0] === h[0] ? 8 : 4, q[0] === h[0] ? P.red : P.acc); S.draw.text(c, q[1].split(" ")[0], ax.X(q[4]) + 6, ax.Y(rr) + 12, {size:10, color:P.acc, align:"left"}); });
      S.draw.line(c, ax.L, ax.Y(sl.value), ax.R, ax.Y(sl.value), P.amber, 1.5, [3,3]);
      S.draw.text(c, "courbe de Pauling", ax.X(2.6), ax.Y(97), {size:11, color:P.grey});
      ro.set(0, S.fmt(mu, 2) + " D"); ro.set(1, S.fmt(ed, 2) + " D"); ro.set(2, S.fmt(real, 0) + " %"); ro.set(3, S.fmt(paul, 0) + " %"); ro.set(4, S.fmt(mc, 2) + " D");
      var err = Math.abs(mc - mu) / mu;
      nt.set("Charge partielle δ = " + S.fmt(real / 100, 2) + " e sur le pôle négatif. Avec ton choix (" + sl.value + " %), μ = " + S.fmt(mc, 2) + " D" + (err < 0.03 ? " : tu retrouves la valeur mesurée." : " ; écart avec la mesure : " + S.fmt(err * 100, 0) + " %.") + " La formule de Pauling donne " + S.fmt(paul, 0) + " % : écart de " + S.fmt(Math.abs(paul - real), 0) + " points avec la valeur déduite de μ.", err < 0.03 ? "ok" : "warn");
    });
  }
});

/* ---------- 4. Dipôle dans un champ électrique ---------- */
var DIP = [["h2o","H₂O",1.85],["hcl","HCl",1.08],["nh3","NH₃",1.47],["chcl3","CHCl₃",1.04],["co2","CO₂ (apolaire)",0],["ch4","CH₄ (apolaire)",0]];
SFA.sim({
  id:"uc-c03-dipole-champ", ch:"c03", tag:"Polarité",
  titre:"Molécules polaires dans un champ électrique : orientation et agitation",
  resume:"Fais varier le champ et la température : l'orientation moyenne ⟨cos θ⟩ = coth x − 1/x, avec x = μE/(kT).",
  but:"Choisis une molécule, règle l'intensité du champ (échelle logarithmique) et la température : les flèches (molécules) s'alignent plus ou moins sur le champ vertical. Lis x et le degré d'alignement.",
  aRetenir:"L'orientation résulte d'une compétition entre l'énergie d'orientation μE et l'agitation thermique kT : x = μE/(kT). Si x ≪ 1, l'alignement est faible (⟨cos θ⟩ ≈ x/3) ; si x ≫ 1, il est quasi total. Une molécule apolaire (μ = 0) ne s'oriente pas : c'est pourquoi les micro-ondes chauffent l'eau mais pas le CO₂ ou les graisses apolaires.",
  piege:"Modèle simplifié : molécules indépendantes (gaz dilué), sans polarisabilité ni interactions entre molécules. Dans l'eau liquide, la liaison hydrogène limite fortement l'orientation et la constante diélectrique (≈ 78) vient aussi de la corrélation entre molécules. Les champs usuels de laboratoire (≈ 10⁵ V/m) donnent x ≈ 10⁻⁴ : orientation infime.",
  build:function(k, S){
    var c = k.canvas(360);
    var ms = k.select("Molécule", DIP.map(function(d){ return [d[0], d[1] + (d[2] ? " (μ = " + S.fmt(d[2], 2) + " D)" : "")]; }), "h2o");
    var ef = k.slider("Champ E (10<sup>p</sup> V/m) : p", 3, 10, 0.1, 8, "");
    var tt = k.slider("Température T", 100, 500, 5, 298, "K");
    var ro = k.readouts(["E", "x = μE/(kT)", "⟨cos θ⟩", "Énergie d'orientation / kT"]);
    var nt = k.note("", "ok");
    var us = [], ph = []; for (var i = 0; i < 80; i++){ us.push(((i * 61 + 17) % 80 + 0.5) / 80); ph.push(((i * 37 + 5) % 80) / 80 * 2 * Math.PI); }
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, d = DIP.filter(function(q){ return q[0] === ms.value; })[0];
      var E = Math.pow(10, ef.value), mu = d[2] * DEBYE, T = tt.value, x = mu * E / (KB * T);
      var avg = x < 1e-3 ? x / 3 : (1 / Math.tanh(x) - 1 / x);
      c.clear();
      S.draw.text(c, "Champ E ↑", 44, 14, {size:12, color:P.red});
      S.draw.arrow(c, 24, H - 20, 24, 30, P.red, 3);
      var cols = 10, rows = 8, cw = (W - 80) / cols, ch = (H - 50) / rows, cnt = 0;
      for (var r = 0; r < rows; r++) for (var q = 0; q < cols; q++){
        var idx = r * cols + q, u = us[idx], cs;
        if (x < 1e-6 || d[2] === 0) cs = 2 * u - 1; else cs = Math.log(Math.exp(-x) + u * (Math.exp(x) - Math.exp(-x))) / x;
        if (!isFinite(cs)) cs = x > 0 ? 1 : 2 * u - 1;
        cs = Math.max(-1, Math.min(1, cs));
        var sn = Math.sqrt(1 - cs * cs), vx = sn * Math.cos(ph[idx]), vy = cs;
        var cx = 60 + q * cw + cw / 2, cy = 30 + r * ch + ch / 2, L = Math.min(cw, ch) * 0.42;
        S.draw.dot(c, cx - vx * L, cy + vy * L, 4, P.red);
        S.draw.arrow(c, cx - vx * L, cy + vy * L, cx + vx * L, cy - vy * L, d[2] ? P.acc : P.grey, 1.8);
        S.draw.text(c, "δ−", cx + vx * L + 3, cy - vy * L - 6, {size:8, color:P.acc, align:"left"});
      }
      ro.set(0, S.sci(E, 2) + " V/m"); ro.set(1, d[2] ? S.sci(x, 2) : "0"); ro.set(2, d[2] ? S.fmt(avg, 3) : "0"); ro.set(3, d[2] ? S.sci(x * avg, 2) : "0");
      nt.set(d[2] === 0 ? "μ = 0 : aucune orientation, quel que soit le champ (modèle sans polarisation induite)." : (x < 0.1 ? "x ≪ 1 : l'agitation thermique domine, orientation moyenne très faible (⟨cos θ⟩ ≈ x/3 = " + S.fmt(x / 3, 3) + ")." : x > 5 ? "x ≫ 1 : champ très intense ou température basse, molécules presque toutes alignées." : "Régime intermédiaire : alignement partiel."), "ok");
    });
  }
});

/* ---------- 5. Charges formelles et hypervalence ---------- */
var FC = [["so4","Sulfate SO₄²⁻","S",6,-2],["po4","Phosphate PO₄³⁻","P",5,-3],["clo4","Perchlorate ClO₄⁻","Cl",7,-1]];
SFA.sim({
  id:"uc-c03-charge-formelle", ch:"c03", tag:"Lewis",
  titre:"Charges formelles : octet respecté ou liaisons doubles ?",
  resume:"Pour SO₄²⁻, PO₄³⁻ et ClO₄⁻, change le nombre de liaisons doubles : les charges formelles se redistribuent.",
  but:"Choisis un oxo-anion et le nombre de liaisons doubles A=O. Observe la charge formelle de l'atome central et des oxygènes. La somme vaut toujours la charge de l'ion.",
  aRetenir:"Charge formelle = électrons de valence − électrons non liants − (électrons liants)/2. La meilleure structure de Lewis minimise les charges formelles (SO₄²⁻ : 2 doubles liaisons, charge de S = 0 ; PO₄³⁻ : 1 ; ClO₄⁻ : 3). Les longueurs expérimentales sont toutes égales : on utilise en pratique plusieurs structures limites équivalentes.",
  piege:"La charge formelle n'est pas la charge réelle, et la règle de l'octet est préservée par la structure sans liaison double (k = 0) : sa légitimité est discutée (les orbitales d ne participent guère). Ne dis pas « la liaison S=O est une vraie double » : ce sont des liaisons très polaires, plus justement décrites par des charges séparées.",
  build:function(k, S){
    var c = k.canvas(340);
    var sp = k.select("Espèce", FC.map(function(f){ return [f[0], f[1]]; }), "so4");
    var kd = k.slider("Nombre de liaisons doubles A=O", 0, 4, 1, 2, "");
    var ro = k.readouts(["Liaisons autour de A", "e⁻ autour de A", "FC de A", "FC de chaque O simple", "FC de chaque O double", "Somme des FC"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, f = FC.filter(function(x){ return x[0] === sp.value; })[0], kk = kd.value;
      c.clear();
      var V = f[3], bonds = 4 + kk, fcA = V - bonds, fcS = 6 - 6 - 1, fcD = 6 - 4 - 2, sum = fcA + (4 - kk) * fcS + kk * fcD;
      var cx = W * 0.4, cy = H / 2, R = Math.min(W * 0.28, H * 0.34);
      var ang = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
      for (var i = 0; i < 4; i++){
        var dbl = i < kk, x = cx + Math.cos(ang[i]) * R, y = cy + Math.sin(ang[i]) * R, nx = -Math.sin(ang[i]) * 4, ny = Math.cos(ang[i]) * 4;
        if (dbl){ S.draw.line(c, cx + nx, cy + ny, x + nx, y + ny, P.ink, 2.5); S.draw.line(c, cx - nx, cy - ny, x - nx, y - ny, P.ink, 2.5); }
        else S.draw.line(c, cx, cy, x, y, P.ink, 2.5);
        S.draw.dot(c, x, y, 17, P.red); S.draw.text(c, "O", x, y, {size:14, color:"#fff"});
        S.draw.text(c, dbl ? "0" : "−", x + Math.cos(ang[i]) * 32, y + Math.sin(ang[i]) * 32, {size:14, color:dbl ? P.green : P.acc});
      }
      S.draw.dot(c, cx, cy, 22, P.acc); S.draw.text(c, f[2], cx, cy, {size:15, color:"#fff"});
      S.draw.text(c, (fcA > 0 ? "+" : fcA < 0 ? "−" : "") + Math.abs(fcA), cx + 30, cy - 28, {size:14, color:fcA === 0 ? P.green : P.red});
      var sx = W * 0.72;
      S.draw.text(c, "Meilleur choix : FC(" + f[2] + ") = 0", sx, 50, {size:12, color:P.green});
      S.draw.text(c, "k = " + (V - 4) + " double(s) liaison(s)", sx, 70, {size:12, color:P.green});
      ro.set(0, String(bonds)); ro.set(1, String(2 * bonds)); ro.set(2, S.fmt(fcA, 0)); ro.set(3, kk < 4 ? "−1" : "—"); ro.set(4, kk > 0 ? "0" : "—"); ro.set(5, S.fmt(sum, 0) + " (attendu " + f[4] + ")");
      nt.set("Autour de " + f[2] + " : " + bonds + " liaisons, donc " + 2 * bonds + " électrons" + (2 * bonds > 8 ? " (octet dépassé : hypervalence formelle)" : " (octet respecté)") + ". FC(" + f[2] + ") = " + V + " − " + bonds + " = " + fcA + ". Somme des FC = " + sum + " = charge de l'ion ✓.", kk === V - 4 ? "ok" : "warn");
    });
  }
});
})();
