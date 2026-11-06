/* Mathématiques BA1 · outils communs des simulations (2D, 3D tournable, glisser-déposer) */
(function(){
var D = SFA.draw, F = SFA.fmt;
var C = {blue:"#1e3f8f", red:"#b42318", green:"#2e6b55", violet:"#5B21B6", amber:"#B45309", teal:"#0e7490", grey:"#8a95a3", ink:"#0f1b2d", light:"#e3e7ed", pink:"#be185d"};
function fx(x, d){ return F(x, d == null ? 2 : d); }
function rgba(h, a){ var n = parseInt(h.slice(1), 16); return "rgba(" + (n >> 16) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; }
function cstr(a, b, d){ d = d == null ? 2 : d; var sa = fx(a, d), sb = fx(Math.abs(b), d); if (Math.abs(b) < 5e-10) return sa; if (Math.abs(a) < 5e-10) return (b < 0 ? "−" : "") + (Math.abs(Math.abs(b) - 1) < 5e-10 ? "" : sb) + "i"; return sa + (b < 0 ? " − " : " + ") + (Math.abs(Math.abs(b) - 1) < 5e-10 ? "" : sb) + "i"; }
/* panneau carré à échelle égale dans un canvas : {X,Y,ix,iy,k} ; grille et axes ; r = demi-étendue */
function Pane(c, bx, by, bw, bh, rx, ry, o){
  o = o || {}; ry = ry || rx; var ctx = c.ctx, k = Math.min(bw / (2 * rx), bh / (2 * ry)), cx = bx + bw / 2 + (o.dx || 0) * k, cy = by + bh / 2 + (o.dy || 0) * k;
  var p = {k:k, cx:cx, cy:cy, bx:bx, by:by, bw:bw, bh:bh}; var sx = o.step || (rx > 12 ? 5 : rx > 6 ? 2 : 1);
  p.X = function(x){ return cx + x * k; }; p.Y = function(y){ return cy - y * k; }; p.ix = function(px){ return (px - cx) / k; }; p.iy = function(py){ return (cy - py) / k; };
  ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip();
  if (o.bg !== false){ ctx.fillStyle = o.bg || "#fff"; ctx.fillRect(bx, by, bw, bh); }
  ctx.lineWidth = 1; ctx.strokeStyle = "#edf0f4"; ctx.beginPath();
  var x0 = Math.floor(p.ix(bx) / sx) * sx, x1 = Math.ceil(p.ix(bx + bw) / sx) * sx, y0 = Math.floor(p.iy(by + bh) / sx) * sx, y1 = Math.ceil(p.iy(by) / sx) * sx, v;
  if (o.grid !== false){ for (v = x0; v <= x1 + 1e-9; v += sx){ ctx.moveTo(p.X(v), by); ctx.lineTo(p.X(v), by + bh); } for (v = y0; v <= y1 + 1e-9; v += sx){ ctx.moveTo(bx, p.Y(v)); ctx.lineTo(bx + bw, p.Y(v)); } ctx.stroke(); }
  ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(bx, cy); ctx.lineTo(bx + bw, cy); ctx.moveTo(cx, by); ctx.lineTo(cx, by + bh); ctx.stroke();
  ctx.fillStyle = "#5f6b7a"; ctx.font = "600 11px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
  if (o.ticks !== false){ for (v = x0; v <= x1 + 1e-9; v += sx){ if (Math.abs(v) < 1e-9) continue; var tx = p.X(v); if (tx > bx + 8 && tx < bx + bw - 8) ctx.fillText(F(v, 0), tx, Math.min(by + bh - 14, Math.max(by + 2, cy + 4))); }
    ctx.textAlign = "right"; ctx.textBaseline = "middle"; for (v = y0; v <= y1 + 1e-9; v += sx){ if (Math.abs(v) < 1e-9) continue; var ty = p.Y(v); if (ty > by + 8 && ty < by + bh - 8) ctx.fillText(F(v, 0), Math.max(bx + 22, Math.min(bx + bw - 4, cx - 5)), ty); } }
  ctx.restore(); if (o.xl){ D.text(c, o.xl, bx + bw - 8, Math.min(by + bh - 10, Math.max(by + 12, cy - 12)), {size:12, align:"right", color:"#2c3a4e"}); } if (o.yl){ D.text(c, o.yl, Math.max(bx + 10, Math.min(bx + bw - 30, cx + 8)), by + 12, {size:12, align:"left", color:"#2c3a4e"}); }
  p.clip = function(){ ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip(); }; p.unclip = function(){ ctx.restore(); };
  return p;
}
function vec(c, p, x0, y0, x1, y1, col, w, lab){ D.arrow(c, p.X(x0), p.Y(y0), p.X(x1), p.Y(y1), col, w || 2.4); if (lab){ var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1; D.text(c, lab, p.X(x1) + dx / L * 14 * 1 + (dx >= 0 ? 4 : -4), p.Y(y1) - dy / L * 14 - (dy >= 0 ? 4 : -4), {size:13, color:col}); } }
function pt(c, p, x, y, col, lab, r, dx, dy){ D.dot(c, p.X(x), p.Y(y), r || 5, col); if (lab) D.text(c, lab, p.X(x) + (dx == null ? 12 : dx), p.Y(y) + (dy == null ? -12 : dy), {size:13, color:col}); }
function seg(c, p, x0, y0, x1, y1, col, w, dash){ D.line(c, p.X(x0), p.Y(y0), p.X(x1), p.Y(y1), col, w || 1.6, dash); }
function arc(c, p, x, y, r, a0, a1, col, w){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), r, -a0, -a1, a1 > a0); ctx.stroke(); ctx.restore(); }
function circ(c, p, x, y, r, col, w, dash){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 1.5; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), r * p.k, 0, 7); ctx.stroke(); ctx.restore(); }
/* points déplaçables : pts = [{x,y}] (coordonnées mathématiques), getP() → panneau courant ; on(i) après déplacement */
function dragPts(k, c, getP, pts, on, snap){
  var cur = -1; c.cv.style.touchAction = "none";
  function near(pp){ var P = getP(); if (!P) return -1; var b = 20, r = -1; pts.forEach(function(q, i){ if (q.fixed) return; var d = Math.hypot(P.X(q.x) - pp.x, P.Y(q.y) - pp.y); if (d < b){ b = d; r = i; } }); return r; }
  c.pointer(function(t, pp){
    if (t === "down"){ cur = near(pp); if (cur >= 0) c.cv.style.cursor = "grabbing"; }
    else if (t === "move"){ c.cv.style.cursor = near(pp) >= 0 ? "grab" : "default"; }
    else if (t === "drag" && cur >= 0){ var P = getP(), x = P.ix(pp.x), y = P.iy(pp.y); var s = snap && snap(); if (s){ x = Math.round(x / s) * s; y = Math.round(y / s) * s; } var q = pts[cur]; var lim = q.lim || 1e9; x = Math.max(-lim, Math.min(lim, x)); y = Math.max(-lim, Math.min(lim, y)); q.x = x; q.y = y; if (on) on(cur); k.redraw(); }
    else if (t === "up"){ cur = -1; c.cv.style.cursor = "default"; }
  });
}
/* vue 3D orthographique tournable à la souris (z vers le haut, repère direct) */
function View3(k, c, o){
  o = o || {}; var v = {az:o.az != null ? o.az : 0.75, el:o.el != null ? o.el : 0.5, s:40, ox:o.ox || 0, oy:o.oy || 0, oz:o.oz || 0, range:o.range || 5, yoff:o.yoff || 0, xoff:o.xoff || 0, bx:0, bw:0};
  v.fit = function(){ v.s = Math.min(c.W * 0.5, c.H * 0.5) / v.range; };
  v.p = function(x, y, z){ x -= v.ox; y -= v.oy; z -= v.oz; var ca = Math.cos(v.az), sa = Math.sin(v.az), ce = Math.cos(v.el), se = Math.sin(v.el), X = x * ca - y * sa, Y = x * sa + y * ca; return {x:c.W / 2 + v.xoff + X * v.s, y:c.H / 2 + v.yoff - (z * ce + Y * se) * v.s, d:Y * ce - z * se}; };
  v.attach = function(hook){
    var last = null, own = false; c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    c.pointer(function(t, pp){
      if (t === "down"){ own = !!(hook && hook("down", pp)); last = pp; }
      else if (t === "drag"){ if (own){ hook("drag", pp); k.redraw(); return; } if (last){ v.az += (pp.x - last.x) * 0.01; v.el = Math.max(0.03, Math.min(1.5, v.el + (pp.y - last.y) * 0.01)); last = pp; k.redraw(); } }
      else if (t === "up"){ if (own && hook) hook("up", pp); own = false; last = null; }
      else if (t === "move" && hook) hook("move", pp);
    });
  };
  v.line = function(a, b, col, w, dash){ var A = v.p(a[0], a[1], a[2]), B = v.p(b[0], b[1], b[2]); D.line(c, A.x, A.y, B.x, B.y, col, w || 1.6, dash); };
  v.arrow = function(a, b, col, w, lab){ var A = v.p(a[0], a[1], a[2]), B = v.p(b[0], b[1], b[2]); if (Math.hypot(B.x - A.x, B.y - A.y) < 3) return; D.arrow(c, A.x, A.y, B.x, B.y, col, w || 2.6); if (lab){ var L = Math.hypot(B.x - A.x, B.y - A.y) || 1; D.text(c, lab, B.x + (B.x - A.x) / L * 13, B.y + (B.y - A.y) / L * 13, {size:13, color:col}); } };
  v.dot = function(q, r, col, lab, dx, dy){ var A = v.p(q[0], q[1], q[2]); D.dot(c, A.x, A.y, r || 4.5, col); if (lab) D.text(c, lab, A.x + (dx == null ? 11 : dx), A.y + (dy == null ? -11 : dy), {size:13, color:col}); return A; };
  v.text = function(q, s, col, size){ var A = v.p(q[0], q[1], q[2]); D.text(c, s, A.x, A.y, {size:size || 12, color:col || C.ink}); };
  v.poly = function(pts, fill, stroke, w){ var ctx = c.ctx; ctx.beginPath(); pts.forEach(function(q, i){ var A = v.p(q[0], q[1], q[2]); if (i) ctx.lineTo(A.x, A.y); else ctx.moveTo(A.x, A.y); }); ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = w || 1.2; ctx.stroke(); } };
  v.axes = function(L, names, o2){ o2 = o2 || {}; var nm = names || ["x", "y", "z"]; var Lx = o2.Lx || L, Ly = o2.Ly || L, Lz = o2.Lz || L;
    if (o2.floor !== false){ var st = o2.step || 1; for (var g = -Math.floor(Lx / st) * st; g <= Lx + 1e-9; g += st) v.line([g, -Ly, 0], [g, Ly, 0], "#e9edf2", 1); for (g = -Math.floor(Ly / st) * st; g <= Ly + 1e-9; g += st) v.line([-Lx, g, 0], [Lx, g, 0], "#e9edf2", 1); }
    v.arrow([-Lx, 0, 0], [Lx, 0, 0], "#5f6b7a", 1.4, nm[0]); v.arrow([0, -Ly, 0], [0, Ly, 0], "#5f6b7a", 1.4, nm[1]); v.arrow([0, 0, -Lz], [0, 0, Lz], "#5f6b7a", 1.4, nm[2]); };
  return v;
}
function dot3(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross3(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function norm3(a){ return Math.sqrt(dot3(a, a)); }
function add3(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub3(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function mul3(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
function v3s(a, d){ return "(" + fx(a[0], d) + " ; " + fx(a[1], d) + " ; " + fx(a[2], d) + ")"; }
function rng(seed){ var s = seed >>> 0; return function(){ s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
var UM = {C:C, fx:fx, rgba:rgba, cstr:cstr, Pane:Pane, vec:vec, pt:pt, seg:seg, arc:arc, circ:circ, dragPts:dragPts, View3:View3, dot3:dot3, cross3:cross3, norm3:norm3, add3:add3, sub3:sub3, mul3:mul3, v3s:v3s, rng:rng};
window.UMB = UM;
})();

(function(){
var U = UMB, C = U.C, fx = U.fx;
/* fractions [n, d] */
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b){ var t = a % b; a = b; b = t; } return a || 1; }
function fr(n, d){ if (d < 0){ n = -n; d = -d; } var g = gcd(n, d); return [n / g, d / g]; }
function fadd(a, b){ return fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
function fsub(a, b){ return fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
function fmul(a, b){ return fr(a[0] * b[0], a[1] * b[1]); }
function fdiv(a, b){ return fr(a[0] * b[1], a[1] * b[0]); }
function fs(a){ var s = a[1] === 1 ? String(a[0]) : a[0] + "/" + a[1]; return s.replace("-", "−"); }
function cp(M){ return M.map(function(r){ return r.map(function(x){ return [x[0], x[1]]; }); }); }
function gaussSteps(M0){
  var M = cp(M0), steps = [{M:cp(M), text:"Matrice augmentée [A | b] du système.", hi:[]}], rows = M.length, cols = M[0].length - 1, r = 0, piv = [], c, i, j;
  for (c = 0; c < cols && r < rows; c++){
    var p = -1; for (i = r; i < rows; i++) if (M[i][c][0] !== 0){ p = i; break; }
    if (p < 0) continue;
    if (p !== r){ var tmp = M[p]; M[p] = M[r]; M[r] = tmp; steps.push({M:cp(M), text:"Colonne " + (c + 1) + " : le pivot est nul en ligne " + (r + 1) + ", on échange L" + (r + 1) + " ↔ L" + (p + 1) + ".", hi:[r, p], pv:[r, c]}); }
    var pv = M[r][c]; if (!(pv[0] === 1 && pv[1] === 1)){ for (j = 0; j <= cols; j++) M[r][j] = fdiv(M[r][j], pv); steps.push({M:cp(M), text:"On normalise le pivot : L" + (r + 1) + " ← L" + (r + 1) + " / " + (pv[1] === 1 ? fs(pv) : "(" + fs(pv) + ")") + ".", hi:[r], pv:[r, c]}); }
    for (i = 0; i < rows; i++){ if (i === r || M[i][c][0] === 0) continue; var f = M[i][c]; for (j = 0; j <= cols; j++) M[i][j] = fsub(M[i][j], fmul(f, M[r][j])); steps.push({M:cp(M), text:"On annule la colonne " + (c + 1) + " : L" + (i + 1) + " ← L" + (i + 1) + (f[0] < 0 ? " + " : " − ") + (Math.abs(f[0]) === 1 && f[1] === 1 ? "" : fs(fr(Math.abs(f[0]), f[1])) + "·") + "L" + (r + 1) + ".", hi:[i], pv:[r, c]}); }
    piv.push(c); r++;
  }
  var bad = false; for (i = r; i < rows; i++) if (M[i][cols][0] !== 0) bad = true;
  var names = ["x", "y", "z", "w"], res;
  if (bad) res = {kind:"none", text:"La dernière ligne dit 0 = " + fs(M[r][cols]) + " ≠ 0 : le système est <b>impossible</b> (aucune solution)."};
  else if (piv.length === cols){ res = {kind:"unique", sol:M.map(function(row){ return row[cols]; }).slice(0, cols), text:"Rang " + piv.length + " = nombre d'inconnues : <b>solution unique</b> " + names.slice(0, cols).map(function(n, q){ return n + " = " + fs(M[q][cols]); }).join(", ") + "."}; }
  else {
    var free = []; for (c = 0; c < cols; c++) if (piv.indexOf(c) < 0) free.push(c); var tn = ["t", "s"], parts = [];
    for (c = 0; c < cols; c++){ var k = piv.indexOf(c), s; if (k >= 0){ s = fs(M[k][cols]); free.forEach(function(fc, q){ var co = fmul([-1, 1], M[k][fc]); if (co[0] !== 0) s += (co[0] < 0 ? " − " : " + ") + (Math.abs(co[0]) === 1 && co[1] === 1 ? "" : fs(fr(Math.abs(co[0]), co[1]))) + tn[q]; }); if (s.indexOf("0 + ") === 0) s = s.slice(4); } else s = tn[free.indexOf(c)]; parts.push(names[c] + " = " + s); }
    res = {kind:"inf", text:"Rang " + piv.length + " &lt; " + cols + " inconnues : <b>infinité de solutions</b> (" + free.length + " paramètre" + (free.length > 1 ? "s" : "") + ") : " + parts.join(" ; ") + "."};
  }
  steps.push({M:cp(M), text:"Forme réduite : on lit la réponse.", hi:[], res:res}); return {steps:steps, res:res};
}
var PRE = {
  a:[[1, 1, 1, 6], [2, -1, 1, 3], [1, 2, -1, 2]],
  b:[[0, 2, 1, 7], [1, 1, -1, 0], [2, -1, 1, 1]],
  c:[[1, 1, 1, 3], [1, -1, 1, 1], [2, 0, 2, 4]],
  d:[[1, 1, 1, 3], [1, -1, 1, 1], [2, 0, 2, 5]],
  e:[[1, 1, 1, 10], [2, 1, 4, 19], [0, 2, 3, 16]]
};

/* ---------- 1. système 2×2 : lignes et colonnes ---------- */
SFA.sim({
  id:"um-c08-systeme-2x2", ch:"c08", titre:"Un système 2 × 2 vu en lignes et en colonnes", tag:"Systèmes linéaires",
  resume:"Deux droites qui se coupent, ou deux vecteurs colonnes qui se combinent : une même solution, deux regards.",
  but:"Règle les coefficients de a₁x + b₁y = c₁ et a₂x + b₂y = c₂. Vue « Lignes » : chaque équation est une droite, la solution est leur intersection. Vue « Colonnes » : on cherche x et y tels que x·(a₁ ; a₂) + y·(b₁ ; b₂) = (c₁ ; c₂). Rends les droites parallèles : le déterminant s'annule.",
  aRetenir:"det = a₁b₂ − a₂b₁. Si det ≠ 0 : solution unique x = (c₁b₂ − c₂b₁)/det, y = (a₁c₂ − a₂c₁)/det. Si det = 0 : aucune solution (droites parallèles) ou une infinité (droites confondues).",
  piege:"det = 0 ne veut pas dire « pas de solution » : si les deux équations sont proportionnelles, il y en a une infinité.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.62}), PN;
    var vw = k.seg("Vue", [["l", "Lignes (droites)"], ["c", "Colonnes (combinaison)"]], "l");
    var a1 = k.slider("a₁", -4, 4, 0.5, 1, ""), b1 = k.slider("b₁", -4, 4, 0.5, 2, ""), c1 = k.slider("c₁", -8, 8, 0.5, 5, "");
    var a2 = k.slider("a₂", -4, 4, 0.5, 3, ""), b2 = k.slider("b₂", -4, 4, 0.5, -1, ""), c2 = k.slider("c₂", -8, 8, 0.5, 1, "");
    k.button("Rendre parallèles (det = 0)", function(){ a2.set(a1.value * 2); b2.set(b1.value * 2); if (Math.abs(a1.value) > 2 || Math.abs(b1.value) > 2){ a2.set(a1.value); b2.set(b1.value); } }, true);
    var ro = k.readouts(["Déterminant", "x", "y", "Cas"]); var nt = k.note("", "ok");
    function line(P, a, b, cc, col){ var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(P.bx, P.by, P.bw, P.bh); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.beginPath(); if (Math.abs(b) > 1e-9){ ctx.moveTo(P.X(-9), P.Y((cc + 9 * a) / b)); ctx.lineTo(P.X(9), P.Y((cc - 9 * a) / b)); } else if (Math.abs(a) > 1e-9){ ctx.moveTo(P.X(cc / a), P.Y(-9)); ctx.lineTo(P.X(cc / a), P.Y(9)); } ctx.stroke(); ctx.restore(); }
    k.draw(function(){
      c.clear(); var A1 = a1.value, B1 = b1.value, C1 = c1.value, A2 = a2.value, B2 = b2.value, C2 = c2.value, det = A1 * B2 - A2 * B1, X = null, Y = null, kind;
      if (Math.abs(det) > 1e-9){ X = (C1 * B2 - C2 * B1) / det; Y = (A1 * C2 - A2 * C1) / det; kind = "u"; }
      else { var allz = A1 === 0 && B1 === 0 && A2 === 0 && B2 === 0; var cons = allz ? (C1 === 0 && C2 === 0) : (A1 * C2 - A2 * C1 === 0 && B1 * C2 - B2 * C1 === 0 && !((A1 === 0 && B1 === 0 && C1 !== 0) || (A2 === 0 && B2 === 0 && C2 !== 0))); kind = cons ? "i" : "n"; }
      if (vw.value === "l"){
        PN = U.Pane(c, 0, 0, c.W, c.H, 7.5, 5.4, {xl:"x", yl:"y"}); line(PN, A1, B1, C1, C.blue); line(PN, A2, B2, C2, C.violet);
        S.draw.text(c, "(1) " + fx(A1, 1) + "x + " + fx(B1, 1) + "y = " + fx(C1, 1), 14, 18, {size:12, color:C.blue, align:"left"}); S.draw.text(c, "(2) " + fx(A2, 1) + "x + " + fx(B2, 1) + "y = " + fx(C2, 1), 14, 38, {size:12, color:C.violet, align:"left"});
        if (kind === "u"){ U.circ(c, PN, X, Y, 0.0001, C.red, 1); U.pt(c, PN, X, Y, C.red, "(" + fx(X, 2) + " ; " + fx(Y, 2) + ")", 7, 12, -12); }
      } else {
        PN = U.Pane(c, 0, 0, c.W, c.H, 9.5, 6.9, {xl:"", yl:""});
        U.vec(c, PN, 0, 0, A1, A2, C.blue, 2.8, "colonne 1"); U.vec(c, PN, 0, 0, B1, B2, C.violet, 2.8, "colonne 2"); U.vec(c, PN, 0, 0, C1, C2, C.green, 3.2, "b");
        if (kind === "u"){ U.vec(c, PN, 0, 0, X * A1, X * A2, "rgba(30,63,143,.55)", 2); U.vec(c, PN, X * A1, X * A2, X * A1 + Y * B1, X * A2 + Y * B2, "rgba(91,33,182,.55)", 2); U.seg(c, PN, 0, 0, Y * B1, Y * B2, "rgba(91,33,182,.3)", 1.2, [4, 3]); U.seg(c, PN, Y * B1, Y * B2, X * A1 + Y * B1, X * A2 + Y * B2, "rgba(30,63,143,.3)", 1.2, [4, 3]); }
        S.draw.text(c, kind === "u" ? "b = " + fx(X, 2) + "·col 1 + " + fx(Y, 2) + "·col 2" : "colonnes alignées (det = 0)", 14, 18, {size:12, color:C.green, align:"left"});
      }
      ro.set(0, fx(det, 3)); ro.set(1, kind === "u" ? fx(X, 3) : "—"); ro.set(2, kind === "u" ? fx(Y, 3) : "—"); ro.set(3, kind === "u" ? "solution unique" : kind === "i" ? "infinité de solutions" : "aucune solution");
      nt.set(kind === "u" ? "det ≠ 0 : les deux droites se coupent en un seul point ; les colonnes ne sont pas alignées et peuvent atteindre n'importe quel b." : kind === "i" ? "det = 0 et équations compatibles : les deux droites sont confondues, toute la droite est solution." : "det = 0 et équations incompatibles : droites parallèles distinctes, b n'est pas dans la droite engendrée par les colonnes.", kind === "u" ? "ok" : "warn");
    });
  }
});

/* ---------- 2. Gauss pas à pas ---------- */
SFA.sim({
  id:"um-c08-gauss-pas-a-pas", ch:"c08", titre:"L'élimination de Gauss pas à pas", tag:"Systèmes linéaires",
  resume:"Choisis un système 3 × 3 et déroule l'algorithme : pivots, opérations sur les lignes, lecture de la solution.",
  but:"Clique sur « Étape suivante » pour voir chaque opération sur les lignes (la ligne modifiée est surlignée, le pivot encadré). Compare les cinq systèmes : solution unique, pivot nul à échanger, infinité de solutions, aucune solution, et un problème de mélange. Le bouton « Aléatoire » génère un système avec solution entière.",
  aRetenir:"Trois opérations sur les lignes ne changent pas l'ensemble des solutions : échanger deux lignes, multiplier une ligne par un réel non nul, ajouter à une ligne un multiple d'une autre. Rang = nombre de pivots ; rang = nombre d'inconnues ⇒ solution unique.",
  piege:"Une ligne [0 0 0 | b] avec b ≠ 0 signale un système impossible ; une ligne nulle [0 0 0 | 0] signale un paramètre libre (infinité de solutions), pas une erreur.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.52}), step = 0, G = null, seed = 7, M0 = PRE.a;
    function load(key){ if (key === "r"){ var r = U.rng(seed++), R = function(a, b){ return Math.floor(r() * (b - a + 1)) + a; }, ok = false, A, sol; while (!ok){ A = []; for (var i = 0; i < 3; i++){ A.push([R(-3, 3), R(-3, 3), R(-3, 3)]); } var d = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]); ok = d !== 0; } sol = [R(-3, 3), R(-3, 3), R(-3, 3)]; M0 = A.map(function(row){ return row.concat([row[0] * sol[0] + row[1] * sol[1] + row[2] * sol[2]]); }); } else M0 = PRE[key]; G = gaussSteps(M0.map(function(row){ return row.map(function(x){ return [x, 1]; }); })); step = 0; }
    var sel = k.select("Système", [["a", "Solution unique"], ["b", "Pivot nul à échanger"], ["c", "Infinité de solutions"], ["d", "Aucune solution"], ["e", "Mélange de solutions (labo)"], ["r", "Aléatoire"]], "a", function(v){ load(v); });
    k.button("◀ Étape précédente", function(){ if (step > 0) step--; });
    k.button("Étape suivante ▶", function(){ if (step < G.steps.length - 1) step++; }, true);
    k.button("↺ Recommencer", function(){ step = 0; });
    k.button("⏩ Tout résoudre", function(){ step = G.steps.length - 1; });
    k.button("🎲 Nouveau système aléatoire", function(){ sel.set("r"); load("r"); });
    var nt = k.note("", "ok"); load("a");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, st = G.steps[step], M = st.M, n = M.length, cw = Math.min(70, (W * 0.5) / 5), rh = Math.min(48, H / (n + 2)), x0 = 28, y0 = H / 2 - n * rh / 2;
      ctx.save(); ctx.font = "700 " + Math.round(Math.min(22, cw * 0.32)) + "px 'JetBrains Mono', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (var i = 0; i < n; i++){
        if (st.hi && st.hi.indexOf(i) >= 0){ ctx.fillStyle = "rgba(244,197,66,.28)"; ctx.fillRect(x0 - 6, y0 + i * rh, cw * 4 + 12, rh); }
        for (var j = 0; j <= 3; j++){ if (st.pv && st.pv[0] === i && st.pv[1] === j){ ctx.strokeStyle = C.red; ctx.lineWidth = 2.4; ctx.strokeRect(x0 + j * cw + 2, y0 + i * rh + 4, cw - 4, rh - 8); } ctx.fillStyle = j === 3 ? C.green : C.ink; ctx.fillText(fs(M[i][j]), x0 + j * cw + cw / 2 + (j === 3 ? 8 : 0), y0 + i * rh + rh / 2); }
        ctx.fillStyle = C.grey; ctx.font = "600 12px Mulish, system-ui"; ctx.textAlign = "left"; ctx.fillText("L" + (i + 1), x0 + 4 * cw + 14, y0 + i * rh + rh / 2); ctx.font = "700 " + Math.round(Math.min(22, cw * 0.32)) + "px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
      }
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 - 2, y0 - 4); ctx.lineTo(x0 - 8, y0 - 4); ctx.lineTo(x0 - 8, y0 + n * rh + 4); ctx.lineTo(x0 - 2, y0 + n * rh + 4); ctx.moveTo(x0 + 4 * cw + 8, y0 - 4); ctx.lineTo(x0 + 4 * cw + 12, y0 - 4); ctx.lineTo(x0 + 4 * cw + 12, y0 + n * rh + 4); ctx.lineTo(x0 + 4 * cw + 8, y0 + n * rh + 4); ctx.stroke();
      ctx.strokeStyle = C.grey; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x0 + 3 * cw, y0 - 4); ctx.lineTo(x0 + 3 * cw, y0 + n * rh + 4); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore(); S.draw.text(c, "inconnues  x       y       z   |  b".replace(/ {2,}/g, "    "), x0 + 2 * cw, y0 - 18, {size:11, color:C.grey});
      var tx = x0 + 4 * cw + 70, ty = 26; S.draw.text(c, "Étape " + step + " / " + (G.steps.length - 1), tx, ty, {size:13, color:C.blue, align:"left"});
      var words = st.text.replace(/<[^>]+>/g, "").split(" "), line = "", ly = ty + 26, maxw = W - tx - 12; ctx.save(); ctx.font = "600 13px Mulish, system-ui"; words.forEach(function(w){ var t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxw){ S.draw.text(c, line, tx, ly, {size:13, color:C.ink, align:"left"}); ly += 20; line = w; } else line = t; }); if (line) S.draw.text(c, line, tx, ly, {size:13, color:C.ink, align:"left"}); ctx.restore();
      if (st.res) nt.set(st.res.text, st.res.kind === "none" ? "bad" : st.res.kind === "inf" ? "warn" : "ok"); else nt.set("Rang provisoire : continue les étapes pour atteindre la forme réduite.", "ok");
    });
  }
});

/* ---------- 3. déterminant et volume ---------- */
SFA.sim({
  id:"um-c08-determinant-volume", ch:"c08", titre:"Le déterminant 3 × 3 : un volume algébrique", tag:"Déterminant et inverse",
  resume:"Les trois colonnes de la matrice engendrent un parallélépipède ; |det| est son volume, le signe donne l'orientation.",
  but:"Modifie les colonnes u, v, w (et fais tourner la vue à la souris). Le volume du parallélépipède vaut |det [u v w]|. Passe en configuration « coplanaire » : le solide s'aplatit, det = 0 et la matrice n'est plus inversible. En échangeant deux colonnes, le signe change.",
  aRetenir:"det [u v w] = u·(v × w). |det| = volume ; det = 0 ⇔ colonnes coplanaires ⇔ matrice non inversible ⇔ le système Ax = b n'a pas de solution unique. Échanger deux colonnes change le signe.",
  piege:"det(A + B) ≠ det A + det B en général ; en revanche det(AB) = det A · det B et det(kA) = k³·det A pour une matrice 3 × 3.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.72}), V = U.View3(k, c, {range:5, az:0.85, el:0.5}); V.attach();
    var s = {ux:k.slider("u : x", -3, 3, 0.5, 2, ""), uy:k.slider("u : y", -3, 3, 0.5, 0, ""), uz:k.slider("u : z", -3, 3, 0.5, 0, ""), vx:k.slider("v : x", -3, 3, 0.5, 0.5, ""), vy:k.slider("v : y", -3, 3, 0.5, 2, ""), vz:k.slider("v : z", -3, 3, 0.5, 0, ""), wx:k.slider("w : x", -3, 3, 0.5, 0, ""), wy:k.slider("w : y", -3, 3, 0.5, 0.5, ""), wz:k.slider("w : z", -3, 3, 0.5, 2, "")};
    k.button("Aplatir : w = u + v", function(){ s.wx.set(Math.max(-3, Math.min(3, s.ux.value + s.vx.value))); s.wy.set(Math.max(-3, Math.min(3, s.uy.value + s.vy.value))); s.wz.set(Math.max(-3, Math.min(3, s.uz.value + s.vz.value))); }, true);
    k.button("Échanger u et v", function(){ ["x", "y", "z"].forEach(function(a){ var t = s["u" + a].value; s["u" + a].set(s["v" + a].value); s["v" + a].set(t); }); });
    k.button("Base canonique", function(){ var m = {ux:2, uy:0, uz:0, vx:0, vy:2, vz:0, wx:0, wy:0, wz:2}; for (var q in m) s[q].set(m[q]); });
    var ro = k.readouts(["det [u v w]", "Volume |det|", "Orientation", "Matrice inversible ?"]); var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); V.fit(); var u = [s.ux.value, s.uy.value, s.uz.value], v = [s.vx.value, s.vy.value, s.vz.value], w = [s.wx.value, s.wy.value, s.wz.value], O = [0, 0, 0], d = U.dot3(u, U.cross3(v, w));
      V.axes(4, null, {step:1});
      var uv = U.add3(u, v), uw = U.add3(u, w), vw = U.add3(v, w), uvw = U.add3(uv, w), F = [[O, u, uv, v], [O, u, uw, w], [O, v, vw, w], [w, uw, uvw, vw], [v, uv, uvw, vw], [u, uv, uvw, uw]];
      var col = Math.abs(d) < 1e-9 ? "rgba(138,149,163,.28)" : d > 0 ? "rgba(30,63,143,.2)" : "rgba(180,35,24,.2)", edge = Math.abs(d) < 1e-9 ? "#8a95a3" : d > 0 ? "rgba(30,63,143,.8)" : "rgba(180,35,24,.8)";
      F.map(function(f){ var m = 0; f.forEach(function(q){ m += V.p(q[0], q[1], q[2]).d; }); return {f:f, d:m / 4}; }).sort(function(a, b){ return b.d - a.d; }).forEach(function(o){ V.poly(o.f, col, edge, 1.2); });
      V.arrow(O, u, C.blue, 3, "u"); V.arrow(O, v, C.violet, 3, "v"); V.arrow(O, w, C.green, 3, "w");
      ro.set(0, fx(d, 3)); ro.set(1, fx(Math.abs(d), 3)); ro.set(2, Math.abs(d) < 1e-9 ? "dégénéré" : d > 0 ? "directe (+)" : "indirecte (−)"); ro.set(3, Math.abs(d) < 1e-9 ? "non (det = 0)" : "oui");
      nt.set(Math.abs(d) < 1e-9 ? "Les trois vecteurs sont dans un même plan : volume nul, det = 0. La matrice [u v w] n'est pas inversible." : "det = u·(v × w) = " + fx(d, 2) + " : le volume du parallélépipède est " + fx(Math.abs(d), 2) + (d < 0 ? " (orientation inversée, faces en rouge)." : "."), Math.abs(d) < 1e-9 ? "warn" : "ok");
    });
  }
});

/* ---------- 4. produit de matrices ---------- */
var TR = {rot:["Rotation d'angle θ", "θ (°)", -180, 180, 1, 40], she:["Cisaillement horizontal", "k", -2, 2, 0.1, 1], str:["Étirement selon x", "k", -2, 3, 0.1, 2], ref:["Symétrie par rapport à l'axe x", "", 0, 0, 1, 0], pro:["Projection sur l'axe x", "", 0, 0, 1, 0], hom:["Homothétie de rapport k", "k", -2, 2, 0.1, 1.5]};
function tmat(t, p){ if (t === "rot"){ var a = p * Math.PI / 180; return [[Math.cos(a), -Math.sin(a)], [Math.sin(a), Math.cos(a)]]; } if (t === "she") return [[1, p], [0, 1]]; if (t === "str") return [[p, 0], [0, 1]]; if (t === "ref") return [[1, 0], [0, -1]]; if (t === "pro") return [[1, 0], [0, 0]]; return [[p, 0], [0, p]]; }
function mm(A, B){ return [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]]; }
function ms(M, d){ return "[" + fx(M[0][0], d) + " " + fx(M[0][1], d) + " ; " + fx(M[1][0], d) + " " + fx(M[1][1], d) + "]"; }
var FSH = [[0, 0], [0.5, 0], [0.5, 0.9], [1.3, 0.9], [1.3, 1.35], [0.5, 1.35], [0.5, 2.1], [1.5, 2.1], [1.5, 2.6], [0, 2.6]];
SFA.sim({
  id:"um-c08-composition-matrices", ch:"c08", titre:"Le produit de matrices : composer, c'est multiplier (et l'ordre compte)", tag:"Calcul matriciel",
  resume:"Applique deux transformations dans l'ordre A puis B, puis dans l'ordre B puis A : les résultats diffèrent.",
  but:"Choisis deux transformations A et B (rotation, cisaillement, étirement, symétrie, projection, homothétie) et leurs paramètres. Le « F » montre l'effet de chacune ; fais glisser le curseur d'animation. À gauche : on applique d'abord A, puis B (matrice BA). À droite : d'abord B, puis A (matrice AB).",
  aRetenir:"Appliquer A puis B revient à multiplier par la matrice BA (le produit se lit de droite à gauche). En général AB ≠ BA. det(AB) = det A · det B : les aires se multiplient.",
  piege:"Le produit de matrices n'est pas commutatif : une rotation puis un cisaillement ne donne pas la même figure qu'un cisaillement puis une rotation. Les dimensions doivent être compatibles : (m × n)(n × p) = (m × p).",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.56}), opts = Object.keys(TR).map(function(q){ return [q, TR[q][0]]; });
    var sa = k.select("Transformation A", opts, "rot", function(v){ setP(pa, v); }), pa = k.slider("Paramètre de A", -180, 180, 1, 40, "");
    var sb = k.select("Transformation B", opts, "she", function(v){ setP(pb, v); }), pb = k.slider("Paramètre de B", -2, 2, 0.1, 1, "");
    var at = k.slider("Animation (0 → 1 : première, 1 → 2 : seconde)", 0, 2, 0.02, 2, "");
    var lp = k.loop(function(dt){ var v = at.value + 0.6 * dt; if (v > 2) v = 0; at.set(v); k.redraw(); }); k.button("▶ Animer", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    function setP(sl, v){ var T = TR[v]; sl.el.min = T[2]; sl.el.max = T[3]; sl.el.step = T[4]; sl.set(T[5]); }
    var ro = k.readouts(["Matrice A", "Matrice B", "BA (A puis B)", "AB (B puis A)", "BA = AB ?", "det BA = det A · det B"]);
    function img(M, f){ return f.map(function(p){ return [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]]; }); }
    function lerp(I, M, t){ return [[I[0][0] + (M[0][0] - I[0][0]) * t, I[0][1] + (M[0][1] - I[0][1]) * t], [I[1][0] + (M[1][0] - I[1][0]) * t, I[1][1] + (M[1][1] - I[1][1]) * t]]; }
    k.draw(function(){
      c.clear(); var W = c.W, H = c.H, A = tmat(sa.value, pa.value), B = tmat(sb.value, pb.value), I = [[1, 0], [0, 1]], BA = mm(B, A), AB = mm(A, B), t = at.value, half = W / 2 - 3, ctx = c.ctx;
      [[A, B, BA, "A puis B", 0], [B, A, AB, "B puis A", 1]].forEach(function(q){
        var first = q[0], second = q[1], tot = q[2], P = U.Pane(c, q[4] * (half + 6), 0, half, H, 5.2 * half / H * 0.62 + 0.1, 5.2 * 0.62 + 0.1, {ticks:false, dy:-1.3});
        var M = t <= 1 ? lerp(I, first, t) : lerp(first, tot, t - 1);
        var poly = function(pts, fill, stroke, w, dash){ ctx.beginPath(); pts.forEach(function(p, i){ if (i) ctx.lineTo(P.X(p[0]), P.Y(p[1])); else ctx.moveTo(P.X(p[0]), P.Y(p[1])); }); ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } ctx.strokeStyle = stroke; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.stroke(); ctx.setLineDash([]); };
        P.clip(); poly(FSH, "rgba(138,149,163,.12)", "#8a95a3", 1.2, [4, 3]); poly(img(M, FSH), q[4] ? "rgba(91,33,182,.22)" : "rgba(30,63,143,.22)", q[4] ? C.violet : C.blue, 2.4);
        U.vec(c, P, 0, 0, M[0][0], M[1][0], C.red, 2.4, ""); U.vec(c, P, 0, 0, M[0][1], M[1][1], C.green, 2.4, ""); P.unclip();
        S.draw.text(c, q[3] + " : matrice " + (q[4] ? "AB" : "BA") + " = " + ms(tot, 2), q[4] * (half + 6) + half / 2, 14, {size:12, color:q[4] ? C.violet : C.blue});
      });
      var same = Math.abs(BA[0][0] - AB[0][0]) + Math.abs(BA[0][1] - AB[0][1]) + Math.abs(BA[1][0] - AB[1][0]) + Math.abs(BA[1][1] - AB[1][1]) < 1e-9, dt = function(M){ return M[0][0] * M[1][1] - M[0][1] * M[1][0]; };
      ro.set(0, ms(A, 2)); ro.set(1, ms(B, 2)); ro.set(2, ms(BA, 2)); ro.set(3, ms(AB, 2)); ro.set(4, same ? "oui (ici elles commutent)" : "non"); ro.set(5, fx(dt(BA), 3) + " = " + fx(dt(A), 2) + " × " + fx(dt(B), 2));
    });
  }
});

/* ---------- 5. inverse et résolution Ax = b ---------- */
SFA.sim({
  id:"um-c08-inverse-resolution", ch:"c08", titre:"Inverse d'une matrice : défaire la transformation pour résoudre Ax = b", tag:"Déterminant et inverse",
  resume:"Déplace x à gauche : b = Ax apparaît à droite. Déplace b : l'inverse retrouve x. Quand det = 0, la grille s'écrase et l'inverse n'existe plus.",
  but:"Règle la matrice A = [a b ; c d]. À gauche (espace de départ) glisse le point bleu x ; à droite (espace d'arrivée) on voit b = Ax sur la grille déformée. Glisse aussi le point rouge b pour résoudre Ax = b : x = A⁻¹b. Amène det vers 0 : la grille s'aplatit sur une droite.",
  aRetenir:"A⁻¹ = (1/det)·[d −b ; −c a] pour une 2 × 2, et Ax = b ⇒ x = A⁻¹b. A est inversible ⇔ det A ≠ 0 ⇔ la transformation est bijective. L'aire est multipliée par |det A|.",
  piege:"A⁻¹ n'est pas la matrice des inverses des coefficients : [a b ; c d]⁻¹ ≠ [1/a 1/b ; 1/c 1/d].",
  build:function(k, S){
    var c = k.canvas(0, {ratio:0.5}), PL, PR, X = {x:1, y:1}, Bv = {x:3, y:4, lim:9};
    var sa = k.slider("a", -3, 3, 0.1, 2, "", function(){ sync(); }), sb = k.slider("b", -3, 3, 0.1, 1, "", function(){ sync(); }), sc = k.slider("c", -3, 3, 0.1, 1, "", function(){ sync(); }), sd = k.slider("d", -3, 3, 0.1, 3, "", function(){ sync(); });
    var ro = k.readouts(["det A", "A⁻¹", "x", "b = Ax"]); var nt = k.note("", "ok");
    function sync(){ var A = [[sa.value, sb.value], [sc.value, sd.value]]; Bv.x = A[0][0] * X.x + A[0][1] * X.y; Bv.y = A[1][0] * X.x + A[1][1] * X.y; }
    function inv(){ var det = sa.value * sd.value - sb.value * sc.value; return Math.abs(det) < 0.02 ? null : [[sd.value / det, -sb.value / det], [-sc.value / det, sa.value / det]]; }
    sync();
    k.draw(function(){
      c.clear(); var W = c.W, H = c.H, ctx = c.ctx, half = W / 2 - 3, a = sa.value, b = sb.value, cc = sc.value, d = sd.value, det = a * d - b * cc;
      PL = U.Pane(c, 0, 0, half, H, 5 * half / H * 0.5, 5 * 0.5 + 0.3, {xl:"x₁", yl:"x₂", step:1}); PR = U.Pane(c, half + 6, 0, half, H, 9 * half / H * 0.5, 9 * 0.5 + 0.3, {xl:"b₁", yl:"b₂", step:2});
      PL.clip(); ctx.lineWidth = 1; for (var g = -6; g <= 6; g++){ ctx.strokeStyle = g === 0 ? "#8a95a3" : "rgba(30,63,143,.25)"; ctx.beginPath(); ctx.moveTo(PL.X(g), PL.Y(-6)); ctx.lineTo(PL.X(g), PL.Y(6)); ctx.stroke(); ctx.strokeStyle = g === 0 ? "#8a95a3" : "rgba(180,35,24,.22)"; ctx.beginPath(); ctx.moveTo(PL.X(-6), PL.Y(g)); ctx.lineTo(PL.X(6), PL.Y(g)); ctx.stroke(); } PL.unclip();
      PR.clip(); for (g = -8; g <= 8; g++){ ctx.strokeStyle = "rgba(30,63,143,.4)"; ctx.beginPath(); ctx.moveTo(PR.X(a * g + b * -8), PR.Y(cc * g + d * -8)); ctx.lineTo(PR.X(a * g + b * 8), PR.Y(cc * g + d * 8)); ctx.stroke(); ctx.strokeStyle = "rgba(180,35,24,.35)"; ctx.beginPath(); ctx.moveTo(PR.X(a * -8 + b * g), PR.Y(cc * -8 + d * g)); ctx.lineTo(PR.X(a * 8 + b * g), PR.Y(cc * 8 + d * g)); ctx.stroke(); }
      ctx.fillStyle = "rgba(15,27,45,.06)"; ctx.beginPath(); ctx.moveTo(PR.X(0), PR.Y(0)); ctx.lineTo(PR.X(a), PR.Y(cc)); ctx.lineTo(PR.X(a + b), PR.Y(cc + d)); ctx.lineTo(PR.X(b), PR.Y(d)); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "rgba(15,27,45,.5)"; ctx.lineWidth = 1.4; ctx.stroke();
      U.vec(c, PR, 0, 0, a, cc, C.blue, 2.4, ""); U.vec(c, PR, 0, 0, b, d, C.red, 2.4, ""); PR.unclip();
      U.vec(c, PL, 0, 0, 1, 0, C.blue, 2, ""); U.vec(c, PL, 0, 0, 0, 1, C.red, 2, "");
      U.pt(c, PL, X.x, X.y, C.blue, "x", 7, 12, -12); U.pt(c, PR, Bv.x, Bv.y, C.red, "b", 7, 12, -12);
      S.draw.text(c, "espace de départ (x)", half / 2, 14, {size:12, color:C.blue}); S.draw.text(c, "espace d'arrivée (b = Ax)", half + 6 + half / 2, 14, {size:12, color:C.red});
      var Ai = inv(); ro.set(0, fx(det, 3)); ro.set(1, Ai ? ms(Ai, 3) : "n'existe pas"); ro.set(2, "(" + fx(X.x, 2) + " ; " + fx(X.y, 2) + ")"); ro.set(3, "(" + fx(Bv.x, 2) + " ; " + fx(Bv.y, 2) + ")");
      nt.set(Ai ? "A est inversible : l'aire du carré unité devient |det| = " + fx(Math.abs(det), 2) + ". Pour chaque b il y a exactement un x." : "det ≈ 0 : la grille est écrasée sur une droite (ou un point). A n'est pas inversible : certains b n'ont aucun antécédent, d'autres en ont une infinité.", Ai ? "ok" : "warn");
    });
    U.dragPts(k, c, function(){ return null; }, [], null);
    var cur = 0; c.pointer(function(t, p){ var W = c.W, half = W / 2 - 3;
      if (t === "down"){ cur = 0; var dl = Math.hypot(PL.X(X.x) - p.x, PL.Y(X.y) - p.y), dr = Math.hypot(PR.X(Bv.x) - p.x, PR.Y(Bv.y) - p.y); if (dl < 24 && dl <= dr) cur = 1; else if (dr < 24) cur = 2; }
      else if (t === "drag" && cur){ if (cur === 1){ X.x = Math.max(-5, Math.min(5, PL.ix(p.x))); X.y = Math.max(-5, Math.min(5, PL.iy(p.y))); sync(); } else { var Ai = inv(); if (Ai){ var bx = Math.max(-14, Math.min(14, PR.ix(p.x))), by = Math.max(-9, Math.min(9, PR.iy(p.y))); X.x = Ai[0][0] * bx + Ai[0][1] * by; X.y = Ai[1][0] * bx + Ai[1][1] * by; X.x = Math.max(-5, Math.min(5, X.x)); X.y = Math.max(-5, Math.min(5, X.y)); sync(); } } k.redraw(); }
      else if (t === "up") cur = 0; });
  }
});

})();
