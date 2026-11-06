/* Mathématiques BA1 · aides de dessin pour la théorie et les devantures (préfixe umb_) */
function umb_clamp(p, a, b){ return Math.max(0, Math.min(1, (p - a) / (b - a))); }
function umb_pl(xr, yr, o){
  o = o || {}; var ox = o.ox != null ? o.ox : W / 2, oy = o.oy != null ? o.oy : H / 2 + (o.dy || 0);
  var k = o.k || Math.min((W - 24) / (2 * xr), (H - 22) / (2 * yr)), m = {k:k, ox:ox, oy:oy, X:function(x){ return ox + x * k; }, Y:function(y){ return oy - y * k; }};
  if (o.grid !== false){ ctx.strokeStyle = '#eceef1'; ctx.lineWidth = 1; var st = o.step || 1, i;
    for (i = Math.ceil(-ox / k / st) * st; ox + i * k < W; i += st){ ctx.beginPath(); ctx.moveTo(ox + i * k, 0); ctx.lineTo(ox + i * k, H); ctx.stroke(); }
    for (i = Math.ceil(-(H - oy) / k / st) * st; oy - i * k > 0; i += st){ ctx.beginPath(); ctx.moveTo(0, oy - i * k); ctx.lineTo(W, oy - i * k); ctx.stroke(); } }
  LN(8, oy, W - 8, oy, '#9aa0a6', 1.4); LN(ox, H - 6, ox, 6, '#9aa0a6', 1.4);
  if (o.xl !== false) T(o.xl || 'Re', W - 18, oy - 8, GREY, 12); if (o.yl !== false) T(o.yl || 'Im', ox + 16, 14, GREY, 12);
  if (o.lab){ var s2 = o.step || 1; ctx.font = '10px Mulish,system-ui,sans-serif'; ctx.fillStyle = GREY; ctx.textAlign = 'center';
    for (var v = Math.ceil(-ox / k / s2) * s2; ox + v * k < W - 20; v += s2){ if (v) ctx.fillText(String(v), ox + v * k, oy + 13); }
    ctx.textAlign = 'right'; for (v = Math.ceil(-(H - oy) / k / s2) * s2; oy - v * k > 14; v += s2){ if (v) ctx.fillText(String(v), ox - 5, oy - v * k + 4); } }
  return m;
}
function umb_vec(m, x, y, col, lab, w, x0, y0){ x0 = x0 || 0; y0 = y0 || 0; var vx = (x - x0) * m.k, vy = -(y - y0) * m.k; A(m.X(x0), m.Y(y0), vx, vy, col, lab || '', w || 2.6); }
function umb_pt(m, x, y, col, lab, dx, dy, r, sz){ DOT(m.X(x), m.Y(y), r || 5, col); if (lab) umb_TB(lab, m.X(x) + (dx == null ? 12 : dx), m.Y(y) + (dy == null ? -9 : dy), col === GREEN ? DGREEN : col === BLUE ? BLUE_D : col === RED ? DRED : col, sz || 11); }
function umb_seg(m, x1, y1, x2, y2, col, w, dash){ LN(m.X(x1), m.Y(y1), m.X(x2), m.Y(y2), col || INK, w || 1.6, dash); }
function umb_arc(m, r, a0, a1, col, w, cx, cy){ ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.beginPath(); ctx.arc(m.X(cx || 0), m.Y(cy || 0), r, -a0, -a1, a1 > a0); ctx.stroke(); }
function umb_circ(m, r, col, w, dash, cx, cy){ ctx.strokeStyle = col; ctx.lineWidth = w || 1.5; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.arc(m.X(cx || 0), m.Y(cy || 0), r * m.k, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
function umb_note(txt, x, y, col, size, al){ umb_TB(txt, x, y, col || INK, size || 13, al || 'center'); }
function umb_panel(lines, x, y, size, col, lh){ lines.forEach(function(s, i){ umb_TB(s, x, y + i * (lh || size * 1.5) * umb_FS * .9, col || INK, size, 'left'); }); }
/* 3D : o = {cx, cy, s, az, el} ; z vers le haut */
function umb_P(o, x, y, z){ x -= o.tx || 0; y -= o.ty || 0; z -= o.tz || 0; var ca = Math.cos(o.az), sa = Math.sin(o.az), ce = Math.cos(o.el), se = Math.sin(o.el), X = x * ca - y * sa, Y = x * sa + y * ca; return {x:o.cx + X * o.s, y:o.cy - (z * ce + Y * se) * o.s, d:Y * ce - z * se}; }
function umb_L3(o, a, b, col, w, dash){ var p = umb_P(o, a[0], a[1], a[2]), q = umb_P(o, b[0], b[1], b[2]); LN(p.x, p.y, q.x, q.y, col, w || 1.6, dash); }
function umb_A3(o, a, b, col, lab, w){ var p = umb_P(o, a[0], a[1], a[2]), q = umb_P(o, b[0], b[1], b[2]); A(p.x, p.y, q.x - p.x, q.y - p.y, col, lab || '', w || 2.6); }
function umb_D3(o, a, col, lab, r){ var p = umb_P(o, a[0], a[1], a[2]); DOT(p.x, p.y, r || 5, col); if (lab) TB(lab, p.x + 11, p.y - 9, col, 13); }
function umb_ax3(o, L, names){ var n = names || ['x', 'y', 'z'], g;
  for (g = -L; g <= L; g++){ umb_L3(o, [g, -L, 0], [g, L, 0], '#e9edf2', 1); umb_L3(o, [-L, g, 0], [L, g, 0], '#e9edf2', 1); }
  umb_A3(o, [0, 0, 0], [L, 0, 0], '#8a95a3', n[0], 1.4); umb_A3(o, [0, 0, 0], [0, L, 0], '#8a95a3', n[1], 1.4); umb_A3(o, [0, 0, 0], [0, 0, L], '#8a95a3', n[2], 1.4); }
function umb_poly3(o, pts, fill, stroke){ ctx.beginPath(); pts.forEach(function(q, i){ var p = umb_P(o, q[0], q[1], q[2]); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); } }
function umb_v3(s, dy, t){ t = t || [0, 0, 0]; return {cx:W / 2, cy:H / 2 + (dy || 0), s:s, az:0.7 + 0.35 * Math.sin(tG / 110), el:0.5, tx:t[0], ty:t[1], tz:t[2]}; }
function umb_o3(s, dy, t){ t = t || [0, 0, 0]; return {cx:W / 2, cy:H / 2 + (dy || 0), s:s, az:ORB.a, el:Math.max(.1, Math.min(1.3, ORB.b)), tx:t[0], ty:t[1], tz:t[2]}; }

var umb_FS = 1.28;
function umb_TB(t, x, y, c, sz, al){ TB(t, x, y, c, Math.round((sz || 12) * umb_FS), al); }

function umb_cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function umb_dotv(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function umb_pp(o, n, d, L, fill, stroke){ var nn = umb_dotv(n, n), p0 = [n[0] * d / nn, n[1] * d / nn, n[2] * d / nn], h = Math.abs(n[2]) > .9 * Math.sqrt(nn) ? [1, 0, 0] : [0, 0, 1], e1 = umb_cross(n, h), l1 = Math.sqrt(umb_dotv(e1, e1)); e1 = e1.map(function(x){ return x / l1; });
  var e2 = umb_cross(n, e1), l2 = Math.sqrt(umb_dotv(e2, e2)); e2 = e2.map(function(x){ return x / l2; });
  function Q(a, b){ return [p0[0] + e1[0] * a * L + e2[0] * b * L, p0[1] + e1[1] * a * L + e2[1] * b * L, p0[2] + e1[2] * a * L + e2[2] * b * L]; }
  umb_poly3(o, [Q(-1, -1), Q(1, -1), Q(1, 1), Q(-1, 1)], fill || 'rgba(29,158,117,.16)', stroke || 'rgba(15,110,86,.7)'); }


function umb_f(x){ return nfmt(Math.round(x * 100) / 100); }
var UM10_ST = [[68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]];
function um10_cm(u, br){ u = Math.max(0, Math.min(1, u)); var x = u * 4, i = Math.min(3, Math.floor(x)), t = x - i, a = UM10_ST[i], b = UM10_ST[i + 1], k = br || 1; return 'rgb(' + Math.min(255, Math.round((a[0] + (b[0] - a[0]) * t) * k)) + ',' + Math.min(255, Math.round((a[1] + (b[1] - a[1]) * t) * k)) + ',' + Math.min(255, Math.round((a[2] + (b[2] - a[2]) * t) * k)) + ')'; }
/* surface z = f(x, y) en facettes triées ; o = repère 3D (umb_P), [x0,x1]×[y0,y1], zr = [zmin, zmax] */
function um10_surf(o, f, x0, x1, y0, y1, n, zr, zs, zc){ var G = [], Q = [], i, j; zs = zs || 1; zc = zc || 0;
  for (i = 0; i <= n; i++){ G.push([]); for (j = 0; j <= n; j++){ var x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * j / n, z = f(x, y); G[i].push({x:x, y:y, z:z, p:umb_P(o, x, y, (z - zc) * zs)}); } }
  for (i = 0; i < n; i++) for (j = 0; j < n; j++) Q.push([i, j, G[i][j].p.d + G[i + 1][j + 1].p.d]);
  Q.sort(function(a, b){ return b[2] - a[2]; });
  Q.forEach(function(q){ var a = G[q[0]][q[1]], b = G[q[0] + 1][q[1]], c = G[q[0] + 1][q[1] + 1], d = G[q[0]][q[1] + 1], zm = (a.z + b.z + c.z + d.z) / 4, sh = 0.72 + 0.3 * Math.max(0, Math.min(1, 0.5 + ((b.z - a.z) + (c.z - d.z)) * 0.05 * -1));
    ctx.beginPath(); ctx.moveTo(a.p.x, a.p.y); ctx.lineTo(b.p.x, b.p.y); ctx.lineTo(c.p.x, c.p.y); ctx.lineTo(d.p.x, d.p.y); ctx.closePath(); ctx.fillStyle = um10_cm((zm - zr[0]) / (zr[1] - zr[0]), sh); ctx.fill(); ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = .7; ctx.stroke(); }); }
/* lignes de niveau d'une fonction dans un repère 2D m = {X, Y} (marching squares) */
function um10_cont(m, f, xr, yr, levels, col, w, n){ n = n || 56; var Z = [], i, j; for (i = 0; i <= n; i++){ Z.push([]); for (j = 0; j <= n; j++) Z[i].push(f(-xr + 2 * xr * i / n, -yr + 2 * yr * j / n)); }
  ctx.strokeStyle = col; ctx.lineWidth = w || 1.4; ctx.beginPath();
  levels.forEach(function(lev){ for (i = 0; i < n; i++) for (j = 0; j < n; j++){ var xa = -xr + 2 * xr * i / n, xb = -xr + 2 * xr * (i + 1) / n, ya = -yr + 2 * yr * j / n, yb = -yr + 2 * yr * (j + 1) / n, a = Z[i][j], b = Z[i + 1][j], c = Z[i + 1][j + 1], d = Z[i][j + 1], P = [];
      function ip(u, v, x1, y1, x2, y2){ var t = (lev - u) / (v - u); P.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]); }
      if ((a < lev) !== (b < lev)) ip(a, b, xa, ya, xb, ya); if ((b < lev) !== (c < lev)) ip(b, c, xb, ya, xb, yb); if ((d < lev) !== (c < lev)) ip(d, c, xa, yb, xb, yb); if ((a < lev) !== (d < lev)) ip(a, d, xa, ya, xa, yb);
      if (P.length === 2){ ctx.moveTo(m.X(P[0][0]), m.Y(P[0][1])); ctx.lineTo(m.X(P[1][0]), m.Y(P[1][1])); } else if (P.length === 4){ ctx.moveTo(m.X(P[0][0]), m.Y(P[0][1])); ctx.lineTo(m.X(P[3][0]), m.Y(P[3][1])); ctx.moveTo(m.X(P[1][0]), m.Y(P[1][1])); ctx.lineTo(m.X(P[2][0]), m.Y(P[2][1])); } } }); ctx.stroke(); }
function um10_clip(x, y, w, h){ ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); }

SFA.theo("c10", {
  icon: function(){
    ctx.fillStyle = '#f6f7fb'; ctx.fillRect(0, 0, W, H);
    var o = {cx:W * .3, cy:H * .58, s:H * .1, az:.75, el:.55}; um10_surf(o, function(x, y){ return 2.4 * Math.exp(-(x * x + y * y) / 2.2); }, -3, 3, -3, 3, 22, [0, 2.4], 1.1, 1.0);
    TB('f(x ; y)', W * .6, H * .28, BLUE_D, 28, 'left'); TB('∂f/∂x   ∂f/∂y', W * .6, H * .5, DRED, 20, 'left'); TB('∇f', W * .6, H * .7, DGREEN, 26, 'left'); TB('z = f(x ; y)', W * .6, H * .88, ORANGE, 16, 'left');
  },
  anim: function(t){
    var o = {cx:W * .3, cy:H * .6, s:Math.min(W * .055, H * .12), az:.6 + .5 * Math.sin(t * .008), el:.55}; var cz = .5 + .5 * Math.sin(t * .02), c = .3 + 1.9 * cz, f = function(x, y){ return 2.4 * Math.exp(-(x * x + y * y) / 2.2); };
    um10_surf(o, f, -3.4, 3.4, -3.4, 3.4, 22, [0, 2.4], 1.1, 1.0); var zc = (c - 1.0) * 1.1, i;
    umb_poly3(o, [[-3.4, -3.4, zc], [3.4, -3.4, zc], [3.4, 3.4, zc], [-3.4, 3.4, zc]], 'rgba(226,75,74,.14)', 'rgba(226,75,74,.55)');
    var r = Math.sqrt(2.2 * Math.log(2.4 / c)); ctx.strokeStyle = RED; ctx.lineWidth = 3.2; ctx.beginPath(); for (i = 0; i <= 80; i++){ var q = i / 80 * 2 * Math.PI, p = umb_P(o, r * Math.cos(q), r * Math.sin(q), zc); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); } ctx.stroke();
    var x0 = W * .6; umb_TB('plan z = c, c = ' + umb_f(c), x0, H * .14, DRED, 12, 'left'); umb_TB('courbe de niveau :', x0, H * .32, INK, 12, 'left'); umb_TB('cercle de rayon ' + umb_f(r), x0, H * .46, DRED, 12, 'left');
    var m = {X:function(x){ return x0 + 62 + x * 18; }, Y:function(y){ return H * .78 - y * 18; }}; ctx.strokeStyle = '#d8dce3'; ctx.strokeRect(x0 + 62 - 3.4 * 18, H * .78 - 3.4 * 18, 6.8 * 18, 6.8 * 18);
    for (i = 1; i < 6; i++){ var rr = Math.sqrt(2.2 * Math.log(2.4 / (.4 * i))); ctx.strokeStyle = 'rgba(15,27,45,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(m.X(0), m.Y(0), rr * 18, 0, 7); ctx.stroke(); } ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(m.X(0), m.Y(0), r * 18, 0, 7); ctx.stroke(); umb_note('Fais tourner la scène à la souris', W * .3, H * .08, GREY, 10);
  },
  th: '<div class="tcard"><b class="h">1. Fonctions de deux variables, graphe et niveaux</b><p>Une fonction f : D ⊂ ℝ² → ℝ associe un réel z = f(x ; y) à chaque point du domaine D (à déterminer : dénominateur ≠ 0, radicande ≥ 0, argument du logarithme > 0). Son <b>graphe</b> est la surface z = f(x ; y) de ℝ³. Une <b>courbe de niveau</b> c est l\'ensemble {(x ; y) : f(x ; y) = c} : une coupe de la surface par le plan horizontal z = c, vue de dessus. Courbes serrées = pente forte.</p><p>Exemples : x² + y² (paraboloïde, niveaux = cercles), x² − y² (selle, niveaux = hyperboles), √(9 − x² − y²) (demi-sphère sur un disque de rayon 3).</p></div>' +
    '<div class="tcard"><b class="h">2. Dérivées partielles et plan tangent</b><p><b>∂f/∂x</b> = dérivée de f par rapport à x en <b>gardant y constant</b> (pente de la coupe y = cte) ; de même ∂f/∂y. Définition : ∂f/∂x(a ; b) = lim [f(a + h ; b) − f(a ; b)]/h. Toutes les règles à une variable s\'appliquent (produit, chaîne). Exemple : f = x²y³ donne f_x = 2xy³, f_y = 3x²y².</p><p><b>Plan tangent</b> en (a ; b) : z = f(a ; b) + f_x(a ; b)(x − a) + f_y(a ; b)(y − b). Il donne l\'approximation linéaire f(a + h ; b + k) ≈ f(a ; b) + f_x h + f_y k. Dérivées secondes : f_xx, f_yy, f_xy = f_yx (théorème de Schwarz si elles sont continues).</p></div>' +
    '<div class="tcard"><b class="h">3. Gradient et dérivée directionnelle</b><p>Le <b>gradient</b> ∇f = (f_x ; f_y) est un vecteur du plan (x ; y). La dérivée de f dans la direction du vecteur <b>unitaire</b> u est <b>D_u f = ∇f · u = ‖∇f‖ cos α</b> (α = angle entre u et ∇f). Donc : la croissance est la plus rapide dans la direction de ∇f (pente ‖∇f‖), la décroissance la plus rapide dans celle de −∇f, et f est constante (D_u f = 0) dans les directions perpendiculaires, c\'est-à-dire le long de la courbe de niveau : <b>∇f ⟂ courbe de niveau</b>.</p><p>Exemple : f = x² + 3xy en (1 ; 2) : ∇f = (8 ; 3) ; avec u = (3 ; 4)/5, D_u f = 7,2 ; pente maximale √73 ≈ 8,54.</p></div>' +
    '<div class="tcard"><b class="h">4. Extrema libres : points critiques et hessienne</b><p>Un extremum local à l\'intérieur du domaine est un <b>point critique</b> : ∇f = 0. Pour le classer, on calcule la hessienne H = [[f_xx ; f_xy] ; [f_xy ; f_yy]] et D = det H = f_xx f_yy − f_xy². <b>D > 0 et f_xx > 0</b> : minimum local ; <b>D > 0 et f_xx < 0</b> : maximum local ; <b>D < 0</b> : point-selle (col) ; D = 0 : on ne peut pas conclure.</p><p>Méthode : (1) résoudre f_x = f_y = 0 ; (2) calculer D en chaque point ; (3) conclure ; (4) sur un domaine fermé borné, comparer aussi aux valeurs sur le bord. Exemple : f = x³ + y³ − 3xy a un col en (0 ; 0) et un minimum local en (1 ; 1).</p></div>' +
    '<div class="tcard"><b class="h">5. Extrema liés : multiplicateurs de Lagrange</b><p>Pour optimiser f sous une contrainte g(x ; y) = c, on cherche les points où <b>∇f = λ∇g</b> et g = c : la courbe de niveau de f est <b>tangente</b> à la contrainte (gradients parallèles). Système de trois équations à trois inconnues (x, y, λ) ; on compare ensuite les valeurs de f aux candidats. Sur une courbe fermée et bornée, f continue atteint son maximum et son minimum.</p><p>Exemple : maximiser x²y sur x² + y² = 3 : 2xy = 2λx, x² = 2λy donnent y = ±1, x² = 2 ; maximum 2 en (±√2 ; 1), minimum −2 en (±√2 ; −1). Application : boîte de volume donné de surface minimale.</p></div>'
});
