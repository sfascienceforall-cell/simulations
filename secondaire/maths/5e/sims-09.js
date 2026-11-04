(function(){
var P = SFA.draw.palette, F = SFA.fmt, PI = Math.PI;
/* --- petit moteur 3D : z vers le haut, observateur du côté y négatif --- */
var V = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]], NM = "ABCDEFGH";
var FACES = [[[0,3,2,1],[0,0,-1]], [[4,5,6,7],[0,0,1]], [[0,1,5,4],[0,-1,0]], [[3,7,6,2],[0,1,0]], [[0,4,7,3],[-1,0,0]], [[1,2,6,5],[1,0,0]]];
var EDGES = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
function rot(p, yaw, pitch){ var x = p[0] - 0.5, y = p[1] - 0.5, z = p[2] - 0.5, cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  var x1 = x * cy - y * sy, y1 = x * sy + y * cy; return [x1, y1 * sp + z * cp, y1 * cp - z * sp]; }   /* [écran x, écran y (haut), profondeur] */
function view(c, yaw, pitch, sc){ sc = sc || Math.min(c.W, c.H) * 0.3; var cx = c.W / 2, cy = c.H / 2;
  var v = {pt:function(p){ var r = rot(p, yaw, pitch); return [cx + r[0] * sc, cy - r[1] * sc, r[2]]; }, sc:sc};
  v.faceVisible = function(n){ var r = rot([n[0] + 0.5, n[1] + 0.5, n[2] + 0.5], yaw, pitch), o = rot([0.5, 0.5, 0.5], yaw, pitch); return (r[2] - o[2]) < 0; };
  return v; }
function drawCube(c, vw, hi){
  var ctx = c.ctx, vis = FACES.map(function(f){ return vw.faceVisible(f[1]); });
  var pts = V.map(vw.pt);
  EDGES.forEach(function(e){ var fa = [], i; FACES.forEach(function(f, fi){ var q = f[0]; for (i = 0; i < 4; i++){ var a = q[i], b = q[(i + 1) % 4]; if ((a === e[0] && b === e[1]) || (a === e[1] && b === e[0])) fa.push(fi); } });
    var visible = fa.some(function(fi){ return vis[fi]; });
    ctx.save(); ctx.strokeStyle = visible ? "#2c3a4e" : "#a9b3c0"; ctx.lineWidth = visible ? 2 : 1.4; if (!visible) ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(pts[e[0]][0], pts[e[0]][1]); ctx.lineTo(pts[e[1]][0], pts[e[1]][1]); ctx.stroke(); ctx.restore(); });
  V.forEach(function(p, i){ var q = pts[i]; SFA.draw.text(c, NM[i], q[0] + (q[0] > c.W / 2 ? 11 : -11), q[1] + (q[1] > c.H / 2 ? 11 : -11), {size:13, color:"#0f1b2d"}); });
  return pts;
}
function seg3(c, vw, a, b, col, w, dash){ var p = vw.pt(a), q = vw.pt(b); SFA.draw.line(c, p[0], p[1], q[0], q[1], col, w, dash); }
function rotCtl(k, c, state){ /* glisser pour tourner */
  var yaw = k.slider("Rotation", -180, 180, 5, state.yaw, "°"), pit = k.slider("Inclinaison", -80, 80, 5, state.pitch, "°");
  var last = null; c.pointer(function(type, p){ if (type === "down") last = p; else if (type === "drag" && last){ var y = yaw.value + (p.x - last.x) * 0.8, q = pit.value + (p.y - last.y) * 0.5; y = ((y + 180) % 360 + 360) % 360 - 180; yaw.set(Math.round(y)); pit.set(Math.max(-80, Math.min(80, Math.round(q)))); last = p; k.redraw(); } else if (type === "up") last = null; });
  return {yaw:function(){ return yaw.value * PI / 180; }, pitch:function(){ return pit.value * PI / 180; }, ys:yaw, ps:pit};
}
var sub = function(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }, cross = function(a, b){ return [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]]; }, dot = function(a, b){ return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }, norm = function(a){ return Math.sqrt(dot(a, a)); };

/* 1. Cube : relations de deux droites */
var LN = {AB:[0,1], BC:[1,2], CD:[2,3], DA:[3,0], EF:[4,5], FG:[5,6], GH:[6,7], HE:[7,4], AE:[0,4], BF:[1,5], CG:[2,6], DH:[3,7], AC:[0,2], BD:[1,3], EG:[4,6], FH:[5,7], AF:[0,5], AG:[0,6], BH:[1,7], CE:[2,4]};
function relation(l1, l2){
  var p1 = V[LN[l1][0]], d1 = sub(V[LN[l1][1]], p1), p2 = V[LN[l2][0]], d2 = sub(V[LN[l2][1]], p2), cr = cross(d1, d2), w = sub(p2, p1);
  if (norm(cr) < 1e-9){ var same = norm(cross(w, d1)) < 1e-9; return same ? "conf" : "para"; }
  return Math.abs(dot(w, cr)) < 1e-9 ? "sec" : "gauches";
}
SFA.sim({
  id:"m5-c09-cube-droites", ch:"c09", tag:"Classique",
  titre:"Cube tournant : parallèles, sécantes ou gauches ?",
  resume:"Choisis deux droites du cube et fais-le tourner : leur position relative est exacte.",
  but:"Choisis les droites d₁ (rouge) et d₂ (bleue), puis fais tourner le cube (glisse à la souris ou au doigt). Sur le dessin, elles peuvent paraître sécantes sans l'être.",
  aRetenir:"Deux droites de l'espace sont soit coplanaires (parallèles ou sécantes), soit <b>gauches</b> (aucun plan ne les contient). Deux droites sans point commun ne sont pas forcément parallèles. Les droites sont prolongées à l'infini.",
  piege:"Sur un dessin, deux droites peuvent se croiser sans se couper : seul le raisonnement (ou une rotation) lève le doute. « Pas de point commun » ne veut pas dire « parallèles ».",
  build:function(k, S){
    var c = k.canvas(340), keys = Object.keys(LN), opts = keys.map(function(q){ return [q, "(" + q + ")"]; });
    var s1 = k.select("Droite d₁", opts, "AB"), s2 = k.select("Droite d₂", opts, "CG");
    var rt = rotCtl(k, c, {yaw:-30, pitch:25});
    var auto = k.loop(function(dt){ rt.ys.set(((rt.ys.value + dt * 40 + 180) % 360) - 180); k.redraw(); });
    k.button("▶ Faire tourner", function(){ auto.play(); }, true); k.button("Arrêter", function(){ auto.pause(); });
    var ro = k.readouts(["Relation"]); var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var vw = view(c, rt.yaw(), rt.pitch());
      drawCube(c, vw);
      [[s1.value, P.red], [s2.value, P.acc]].forEach(function(q){ var a = V[LN[q[0]][0]], b = V[LN[q[0]][1]], d = sub(b, a), e0 = [a[0] - 0.6*d[0], a[1] - 0.6*d[1], a[2] - 0.6*d[2]], e1 = [b[0] + 0.6*d[0], b[1] + 0.6*d[1], b[2] + 0.6*d[2]]; seg3(c, vw, e0, e1, q[1], 2.6, [7, 4]); seg3(c, vw, a, b, q[1], 4); });
      var r = relation(s1.value, s2.value);
      var txt = {conf:"confondues (même droite)", para:"parallèles (distinctes)", sec:"sécantes (un seul point commun)", gauches:"gauches (non coplanaires)"}[r];
      ro.set(0, txt);
      var msg = {conf:"Ce sont deux noms pour la même droite.", para:"Même direction, aucun point commun : elles sont dans un même plan et ne se coupent pas.", sec:"Elles sont dans un même plan et se coupent en un point.", gauches:"Directions différentes, aucun point commun : aucun plan ne contient les deux droites. Fais tourner le cube : sur le dessin elles peuvent sembler se couper, mais ce n'est qu'un effet de perspective."}[r];
      nt.set("(" + s1.value + ") et (" + s2.value + ") : <b>" + txt + "</b>. " + msg, r === "gauches" ? "warn" : "ok");
    });
  }
});

/* 2. Section plane d'un cube */
function sectionPoly(n, d){
  var pts = [];
  EDGES.forEach(function(e){ var p0 = V[e[0]], p1 = V[e[1]], dv = sub(p1, p0), den = dot(n, dv), num = d - dot(n, p0);
    if (Math.abs(den) < 1e-12){ if (Math.abs(num) < 1e-9){ pts.push(p0, p1); } return; }
    var t = num / den; if (t >= -1e-9 && t <= 1 + 1e-9) pts.push([p0[0] + t*dv[0], p0[1] + t*dv[1], p0[2] + t*dv[2]]); });
  var u = []; pts.forEach(function(p){ if (!u.some(function(q){ return norm(sub(p, q)) < 1e-6; })) u.push(p); });
  if (u.length < 3) return u;
  var cen = [0, 0, 0]; u.forEach(function(p){ cen = [cen[0] + p[0]/u.length, cen[1] + p[1]/u.length, cen[2] + p[2]/u.length]; });
  var nn = norm(n), nu = [n[0]/nn, n[1]/nn, n[2]/nn], ax = Math.abs(nu[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e1 = cross(nu, ax), l1 = norm(e1); e1 = [e1[0]/l1, e1[1]/l1, e1[2]/l1]; var e2 = cross(nu, e1);
  u.sort(function(a, b){ var da = sub(a, cen), db = sub(b, cen); return Math.atan2(dot(da, e2), dot(da, e1)) - Math.atan2(dot(db, e2), dot(db, e1)); });
  return u;
}
SFA.sim({
  id:"m5-c09-section", ch:"c09", tag:"Classique",
  titre:"Section d'un cube par un plan",
  resume:"Fais glisser un plan à travers un cube : triangle, carré, pentagone ou hexagone ?",
  but:"Choisis l'orientation du plan (nx, ny, nz) puis fais-le glisser avec d. Combien de côtés a la section ? Quand est-elle régulière ?",
  aRetenir:"La section d'un cube (arête 1) par le plan nx·x + ny·y + nz·z = d est un polygone dont chaque côté est dans une face. Il a au plus 6 côtés (un par face). Les côtés situés dans des faces parallèles sont parallèles. Un plan perpendiculaire à la grande diagonale AG passant par le centre donne un hexagone régulier.",
  piege:"Un plan ne coupe pas forcément toutes les faces : le nombre de côtés dépend de l'orientation et de la position. Et une section peut être réduite à un point, un segment ou une face entière.",
  build:function(k, S){
    var c = k.canvas(350);
    var nx = k.slider("nx", 0, 3, 1, 1, ""), ny = k.slider("ny", 0, 3, 1, 1, ""), nz = k.slider("nz", 0, 3, 1, 1, "");
    var dd = k.slider("d (position du plan)", 0, 9, 0.05, 1.5, "");
    var rt = rotCtl(k, c, {yaw:45, pitch:30});
    var ro = k.readouts(["Sommets de la section", "Nature", "Côtés égaux ?", "d autorisé"]); var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var n = [nx.value, ny.value, nz.value], vw = view(c, rt.yaw(), rt.pitch());
      if (n[0] === 0 && n[1] === 0 && n[2] === 0){ drawCube(c, vw); nt.set("Choisis au moins une composante non nulle : un plan a besoin d'une direction normale.", "warn"); return; }
      var dmax = n[0] + n[1] + n[2], d = Math.min(dd.value, dmax), poly = sectionPoly(n, d);
      drawCube(c, vw);
      var ctx = c.ctx;
      if (poly.length >= 3){ var q = poly.map(vw.pt); ctx.save(); ctx.fillStyle = "rgba(180,35,24,.28)"; ctx.strokeStyle = P.red; ctx.lineWidth = 2.6; ctx.beginPath(); q.forEach(function(p, i){ if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); q.forEach(function(p){ SFA.draw.dot(c, p[0], p[1], 4, P.red); }); }
      else if (poly.length) poly.map(vw.pt).forEach(function(p){ SFA.draw.dot(c, p[0], p[1], 5, P.red); });
      var m = poly.length, nat = "—", eq = "—";
      if (m < 3) nat = m === 0 ? "le plan ne coupe pas le cube" : m === 1 ? "un point (sommet)" : "un segment (arête)";
      else {
        var sd = poly.map(function(p, i){ return norm(sub(poly[(i + 1) % m], p)); }), alleq = sd.every(function(x){ return Math.abs(x - sd[0]) < 1e-6; });
        eq = alleq ? "oui" : "non";
        if (m === 3) nat = alleq ? "triangle équilatéral" : "triangle";
        else if (m === 4){ var rect = Math.abs(dot(sub(poly[1], poly[0]), sub(poly[2], poly[1]))) < 1e-6, par = Math.abs(sd[0] - sd[2]) < 1e-6 && Math.abs(sd[1] - sd[3]) < 1e-6; nat = rect ? (alleq ? "carré" : "rectangle") : par ? (alleq ? "losange" : "parallélogramme") : "trapèze"; }
        else if (m === 5) nat = "pentagone";
        else nat = alleq && (n[0] === n[1] && n[1] === n[2]) ? "hexagone régulier" : "hexagone" + (alleq ? " (côtés égaux)" : "");
      }
      ro.set(0, String(m)); ro.set(1, nat); ro.set(2, eq); ro.set(3, "0 à " + F(dmax, 0));
      nt.set("Plan " + n[0] + "x + " + n[1] + "y + " + n[2] + "z = " + F(d, 2) + ". " + (m >= 3 ? "La section a " + m + " côtés : " + nat + ". Les côtés appartenant à deux faces opposées sont parallèles." : "Section dégénérée : " + nat + ".") + (n[0] === n[1] && n[1] === n[2] && Math.abs(d - dmax / 2) < 1e-6 ? " Plan perpendiculaire à la grande diagonale, passant par le centre : c'est l'hexagone régulier." : ""), "ok");
    });
  }
});

/* 3. Perspective cavalière */
SFA.sim({
  id:"m5-c09-cavaliere", ch:"c09", tag:"Représentation",
  titre:"La perspective cavalière déforme (et conserve)",
  resume:"Règle l'angle de fuite et le coefficient de réduction : qu'est-ce qui est conservé ?",
  but:"Modifie l'angle α et le coefficient k. Compare l'angle apparent et la longueur apparente aux vraies mesures (cube d'arête 4 cm).",
  aRetenir:"En perspective cavalière : la face de devant est en vraie grandeur ; les arêtes de profondeur sont dessinées à l'angle α avec la horizontale et réduites du coefficient k ; les droites parallèles restent parallèles, les milieux restent des milieux, les rapports de longueurs sur une même direction sont conservés.",
  piege:"Les angles droits et les longueurs des fuyantes ne sont pas conservés : l'angle B̂AA′ est droit dans la réalité mais mesure α sur le dessin. On ne mesure pas au rapporteur sur une perspective.",
  build:function(k, S){
    var c = k.canvas(330);
    var al = k.slider("Angle de fuite α", 15, 75, 5, 45, "°"), kc = k.slider("Coefficient k", 0.3, 1, 0.1, 0.5, "");
    var ro = k.readouts(["Angle apparent (AB, AA′)", "Angle réel", "Arête de profondeur : dessin", "Diagonale BG′ : dessin / réelle"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var a = al.value * PI / 180, K = kc.value, s = Math.min(c.W * 0.4, (c.H - 56) / (1 + K * Math.sin(a)), (c.W - 80) / (1 + K * Math.cos(a))), ox = 34, oy = c.H - 30, dx = K * s * Math.cos(a), dy = K * s * Math.sin(a);
      var pt = function(x, y, z){ return [ox + x * s + z * dx, oy - y * s - z * dy]; };
      /* arêtes cachées : celles qui partent du sommet arrière-bas-gauche (0,0,1) ici A' */
      var edge = function(p, q, hid){ SFA.draw.line(c, p[0], p[1], q[0], q[1], hid ? "#a9b3c0" : "#2c3a4e", hid ? 1.4 : 2.2, hid ? [4, 4] : null); };
      /* convention : x droite, y haut, z fuyant ; face avant z = 0 */
      var Fv = [pt(0,0,0), pt(1,0,0), pt(1,1,0), pt(0,1,0)], Bk = [pt(0,0,1), pt(1,0,1), pt(1,1,1), pt(0,1,1)];
      c.ctx.save(); c.ctx.fillStyle = "rgba(30,63,143,.10)"; c.ctx.beginPath(); Fv.forEach(function(p, i){ if (i) c.ctx.lineTo(p[0], p[1]); else c.ctx.moveTo(p[0], p[1]); }); c.ctx.closePath(); c.ctx.fill(); c.ctx.restore();
      edge(Bk[0], Bk[1], true); edge(Bk[0], Bk[3], true); edge(Fv[0], Bk[0], true);
      edge(Bk[1], Bk[2], false); edge(Bk[3], Bk[2], false);
      for (var i = 0; i < 4; i++){ edge(Fv[i], Fv[(i + 1) % 4], false); edge(Fv[i], Bk[i], i !== 0); }
      var M = pt(0, 0, 0.5); SFA.draw.dot(c, M[0], M[1], 5, P.red);
      S.draw.text(c, "A", Fv[0][0] - 10, Fv[0][1] + 12, {size:13}); S.draw.text(c, "B", Fv[1][0] + 10, Fv[1][1] + 12, {size:13}); S.draw.text(c, "D", Fv[3][0] - 10, Fv[3][1] - 8, {size:13});
      S.draw.text(c, "A′", Bk[0][0] - 10, Bk[0][1] - 10, {size:13}); S.draw.text(c, "M", M[0] - 11, M[1] + 2, {size:13, color:P.red}); S.draw.text(c, "G′", Bk[2][0] + 12, Bk[2][1] - 6, {size:13});
      S.draw.line(c, Fv[0][0], Fv[0][1], Bk[0][0], Bk[0][1], P.red, 3);
      var diagApp = Math.sqrt(Math.pow(Bk[2][0] - Fv[1][0], 2) + Math.pow(Bk[2][1] - Fv[1][1], 2)) / s * 4;
      ro.set(0, F(al.value, 0) + "°"); ro.set(1, "90°"); ro.set(2, F(4 * K, 1) + " cm (vraie : 4 cm)");
      /* diagonale B -> G' : B=(1,0,0), G'=(1,1,1) : réelle 4√2 */
      var diagReal = 4 * Math.SQRT2; ro.set(3, F(diagApp, 2) + " cm / " + F(diagReal, 2) + " cm");
      nt.set("Le point M, milieu de [AA′], est dessiné au milieu de [AA′] : le milieu est conservé. Mais AA′ (arête vraie : 4 cm) est dessinée " + F(4 * K, 1) + " cm, et l'angle B̂AA′ (90° en réalité) est dessiné " + F(al.value, 0) + "°.", "ok");
    });
  }
});

/* 4. Droites gauches */
SFA.sim({
  id:"m5-c09-gauches", ch:"c09", tag:"Niche utile",
  titre:"De sécantes à gauches à parallèles",
  resume:"d₁ est fixe, d₂ glisse : à quel moment passe-t-on de sécantes à gauches ?",
  but:"d₁ (rouge) est l'axe horizontal du sol. d₂ (bleue) est à la hauteur h et tourne d'un angle φ. Trouve les valeurs de h et φ qui rendent les droites sécantes, gauches, puis parallèles.",
  aRetenir:"Si h = 0, d₂ est dans le plan du sol, comme d₁ : sécantes (φ ≠ 0) ou parallèles (φ = 0). Si h ≠ 0 et φ ≠ 0, aucun plan ne contient les deux droites : gauches, à distance h l'une de l'autre. Si h ≠ 0 et φ = 0, elles sont parallèles dans deux plans horizontaux.",
  piege:"Gauches ne veut pas dire « loin » : pour h très petit mais non nul, les droites restent gauches. Et il suffit que h = 0 pour les rendre coplanaires.",
  build:function(k, S){
    var c = k.canvas(340);
    var h = k.slider("Hauteur h de d₂", 0, 2, 0.25, 1, ""), ph = k.slider("Angle φ de d₂", 0, 90, 15, 45, "°");
    var rt = rotCtl(k, c, {yaw:-35, pitch:35});
    var ro = k.readouts(["Relation", "Distance entre les droites"]); var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var H = h.value, f = ph.value * PI / 180, vw = view(c, rt.yaw(), rt.pitch(), Math.min(c.W, c.H) * 0.13), ctx = c.ctx;
      var R = 2.6, Ppl = function(z){ return [[-R, -R, z], [R, -R, z], [R, R, z], [-R, R, z]]; };
      [[0, "rgba(138,149,163,.18)"], [H, "rgba(30,63,143,.10)"]].forEach(function(q){ if (q[0] === 0 || H > 0){ var pp = Ppl(q[0]).map(function(p){ return vw.pt([p[0] + 0.5, p[1] + 0.5, p[2] + 0.5]); }); ctx.save(); ctx.fillStyle = q[1]; ctx.beginPath(); pp.forEach(function(p, i){ if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath(); ctx.fill(); ctx.restore(); } });
      var off = function(p){ return [p[0] + 0.5, p[1] + 0.5, p[2] + 0.5]; };
      seg3(c, vw, off([-R, 0, 0]), off([R, 0, 0]), P.red, 3.5);
      var p0 = [0, 1, H], dv = [Math.cos(f), Math.sin(f), 0];
      seg3(c, vw, off([p0[0] - 3 * dv[0], p0[1] - 3 * dv[1], H]), off([p0[0] + 3 * dv[0], p0[1] + 3 * dv[1], H]), P.acc, 3.5);
      var para = Math.abs(Math.sin(f)) < 1e-9, rel = para ? "parallèles" : H === 0 ? "sécantes" : "gauches";
      var dist = para ? Math.sqrt(1 + H * H) : H;
      ro.set(0, rel); ro.set(1, rel === "sécantes" ? "0 (point commun)" : F(dist, 2));
      nt.set(rel === "sécantes" ? "h = 0 : d₂ est dans le plan du sol avec d₁ ; sa direction diffère (φ ≠ 0) : elles se coupent au point d'abscisse " + F(-Math.cos(f) / Math.sin(f), 2) + "." : rel === "gauches" ? "h > 0 et φ ≠ 0 : pas de point commun, pas parallèles, aucun plan commun. La distance entre les droites est h (mesurée verticalement)." : "Même direction : parallèles. Elles sont dans un même plan, à distance " + F(dist, 2) + ".", rel === "gauches" ? "warn" : "ok");
    });
  }
});
})();
