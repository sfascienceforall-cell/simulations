/* Chapitre 1 · Alcools, aldéhydes, cétones et acides carboxyliques */
/* ---------- aides de dessin partagées par les simulations de chimie 6e (window.C6) ---------- */
(function(){
var S = window.SFA, P = S.draw.palette, C6 = window.C6 = {};
C6.CPK = {C: "#4a5568", H: "#f4f6fa", O: "#d9382b", N: "#3b6fd6", Br: "#9c2f1a", Cl: "#3aa860", Na: "#8a5cd6", Cu: "#c8743a", Zn: "#8e9db0", Fe: "#7c6a5c", Mn: "#8e3fa8", Ag: "#b9c2cc", F: "#6bbf59", S: "#d9b92b"};
C6.mix = function(a, b, t){ t = Math.max(0, Math.min(1, t)); var r = []; for (var i = 0; i < 3; i++) r.push(Math.round(a[i] + (b[i] - a[i]) * t)); return "rgb(" + r.join(",") + ")"; };
C6.rgba = function(a, al){ return "rgba(" + a[0] + "," + a[1] + "," + a[2] + "," + al + ")"; };
/* fond de scène : léger dégradé arrondi + paillasse facultative */
C6.bg = function(c, opt){
  opt = opt || {}; var ctx = c.ctx, g = ctx.createLinearGradient(0, 0, 0, c.H);
  g.addColorStop(0, opt.top || "#f8fafc"); g.addColorStop(1, opt.bottom || "#e9eef5");
  ctx.save(); S.draw.rrect(c, 0, 0, c.W, c.H, 12); ctx.fillStyle = g; ctx.fill(); ctx.restore();
  if (opt.bench){ var y = opt.bench; ctx.save(); var gb = ctx.createLinearGradient(0, y, 0, c.H); gb.addColorStop(0, "#d9dfe8"); gb.addColorStop(1, "#c9d1dc");
    ctx.beginPath(); ctx.rect(0, y, c.W, c.H - y); ctx.clip(); ctx.fillStyle = gb; ctx.fillRect(0, y, c.W, c.H - y); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(0, y, c.W, 2); ctx.restore(); }
};
/* atome en boule (dégradé radial) */
C6.ball = function(c, x, y, r, col, label, opt){
  opt = opt || {}; var ctx = c.ctx; col = C6.CPK[col] || col;
  ctx.save(); ctx.shadowColor = "rgba(15,27,45,.22)"; ctx.shadowBlur = r * 0.5; ctx.shadowOffsetY = r * 0.18;
  var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, "#ffffff"); g.addColorStop(0.25, col); g.addColorStop(1, shade(col, -0.32));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore();
  if (label) S.draw.text(c, label, x, y + 0.5, {size: opt.size || Math.max(10, r * 0.95), color: opt.color || (col === C6.CPK.H || col === "#f4f6fa" ? P.ink : "#fff"), weight: 800});
};
function shade(col, f){
  var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(col); if (!m) return col;
  var v = [1, 2, 3].map(function(i){ var x = parseInt(m[i], 16); x = f < 0 ? x * (1 + f) : x + (255 - x) * f; return Math.max(0, Math.min(255, Math.round(x))); });
  return "rgb(" + v.join(",") + ")";
}
C6.shade = shade;
/* liaison simple / double / triple */
C6.bond = function(c, x1, y1, x2, y2, order, col, w){
  order = order || 1; w = w || 3; col = col || "#5b6674";
  var dx = x2 - x1, dy = y2 - y1, l = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / l, ny = dx / l, sp = w * 1.6, i;
  for (i = 0; i < order; i++){ var o = (i - (order - 1) / 2) * sp; S.draw.line(c, x1 + nx * o, y1 + ny * o, x2 + nx * o, y2 + ny * o, col, w); }
};
/* récipients : kind = "beaker" | "tube" | "flask" ; opt : {level 0-1, color [r,g,b] ou css, alpha, ticks, label, shine} */
C6.glass = function(c, kind, x, y, w, h, opt){
  opt = opt || {}; var ctx = c.ctx, lv = opt.level == null ? 0.6 : opt.level, i;
  function path(){
    ctx.beginPath();
    if (kind === "tube"){ var r = w / 2; ctx.moveTo(x, y); ctx.lineTo(x, y + h - r); ctx.arc(x + r, y + h - r, r, Math.PI, 0, true); ctx.lineTo(x + w, y); }
    else if (kind === "flask"){ var nw = w * 0.3, nx0 = x + (w - nw) / 2, ny = y + h * 0.32; ctx.moveTo(nx0, y); ctx.lineTo(nx0, ny); ctx.lineTo(x, y + h - 6); ctx.quadraticCurveTo(x, y + h, x + 8, y + h); ctx.lineTo(x + w - 8, y + h); ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - 6); ctx.lineTo(nx0 + nw, ny); ctx.lineTo(nx0 + nw, y); }
    else { ctx.moveTo(x, y); ctx.lineTo(x, y + h - 8); ctx.quadraticCurveTo(x, y + h, x + 8, y + h); ctx.lineTo(x + w - 8, y + h); ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - 8); ctx.lineTo(x + w, y); }
  }
  ctx.save();
  /* verre (fond translucide) */
  path(); ctx.fillStyle = "rgba(255,255,255,.55)"; if (kind !== "beaker" && kind !== "tube") ctx.closePath(); ctx.fill();
  /* liquide */
  if (lv > 0){
    ctx.save(); path(); ctx.clip();
    var top, col = opt.color || [120, 175, 230];
    if (kind === "flask"){ top = y + h - (h * 0.68) * lv - 4; } else top = y + h - (h - 6) * lv;
    var rgb = Array.isArray(col) ? col : null, al = opt.alpha == null ? 0.78 : opt.alpha;
    var g = ctx.createLinearGradient(0, top, 0, y + h);
    if (rgb){ g.addColorStop(0, C6.rgba(rgb, al * 0.85)); g.addColorStop(1, C6.rgba(rgb.map(function(v){ return Math.round(v * 0.8); }), Math.min(1, al + 0.12))); } else { g.addColorStop(0, col); g.addColorStop(1, col); }
    ctx.fillStyle = g; ctx.fillRect(x - 2, top, w + 4, y + h - top + 2);
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(x, top, w, 2);
    if (opt.inside) opt.inside(top);
    ctx.restore();
  }
  /* graduations */
  if (opt.ticks){ ctx.strokeStyle = "rgba(15,27,45,.35)"; ctx.lineWidth = 1; for (i = 1; i <= opt.ticks; i++){ var ty = y + h - (h - 6) * i / (opt.ticks + 1) * (kind === "flask" ? 0.6 : 1) ; if (kind === "flask") continue; ctx.beginPath(); ctx.moveTo(x + w, ty); ctx.lineTo(x + w - (i % 2 ? 9 : 14), ty); ctx.stroke(); } }
  /* contour + reflets */
  path(); ctx.strokeStyle = "#5b6e86"; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.stroke();
  if (opt.shine !== false){ ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath();
    if (kind === "flask"){ ctx.moveTo(x + w * 0.2, y + h * 0.62); ctx.lineTo(x + w * 0.16, y + h * 0.84); } else { ctx.moveTo(x + 7, y + h * 0.2); ctx.lineTo(x + 7, y + h * 0.7); } ctx.stroke(); }
  if (kind === "beaker"){ ctx.strokeStyle = "#5b6e86"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x + w + 4, y); ctx.stroke(); }
  ctx.restore();
  if (opt.label) S.draw.text(c, opt.label, x + w / 2, y + h + 16, {size: 12, color: opt.labelColor || P.grey});
};
/* particule animée : position en fonction du temps, sans état (graine i) */
C6.rnd = function(i, k){ var s = Math.sin(i * 127.1 + (k || 0) * 311.7) * 43758.5453; return s - Math.floor(s); };
/* texte à la ligne */
C6.wrap = function(c, txt, x, y, maxW, opt){
  var ctx = c.ctx, size = opt.size || 13, words = String(txt).split(" "), line = "", lines = [], i;
  ctx.save(); ctx.font = (opt.weight || 700) + " " + size + "px Mulish, system-ui, sans-serif";
  for (i = 0; i < words.length; i++){ var t = line ? line + " " + words[i] : words[i]; if (ctx.measureText(t).width > maxW && line){ lines.push(line); line = words[i]; } else line = t; }
  lines.push(line); ctx.restore();
  lines.forEach(function(l, j){ S.draw.text(c, l, x, y + j * (size + 4), opt); });
  return lines.length;
};
/* échelle de pH (indicateur universel) */
C6.phColor = function(pH){
  var st = [[0, [220, 40, 40]], [3, [235, 110, 40]], [5, [240, 200, 50]], [7, [90, 170, 90]], [9, [60, 150, 170]], [11, [70, 90, 190]], [14, [110, 50, 150]]];
  for (var i = 1; i < st.length; i++) if (pH <= st[i][0]) return C6.mix(st[i - 1][1], st[i][1], (pH - st[i - 1][0]) / (st[i][0] - st[i - 1][0]));
  return C6.mix(st[6][1], st[6][1], 0);
};
})();
(function(){
function wrap(c, S, txt, x, y, maxW, opt){
  var ctx = c.ctx, size = opt.size || 13, words = String(txt).split(" "), line = "", lines = [], i;
  ctx.save(); ctx.font = (opt.weight || 700) + " " + size + "px " + (opt.math ? "'STIX Two Text', serif" : "Mulish, system-ui, sans-serif");
  for (i = 0; i < words.length; i++){ var t = line ? line + " " + words[i] : words[i]; if (ctx.measureText(t).width > maxW && line){ lines.push(line); line = words[i]; } else line = t; }
  lines.push(line); ctx.restore();
  lines.forEach(function(l, j){ S.draw.text(c, l, x, y + j * (size + 4), opt); });
  return lines.length;
}
var RAC = ["", "méth", "éth", "prop", "but", "pent", "hex", "hept"];
function sub(n){ return "<sub>" + n + "</sub>"; }
function canon(p, n){ return Math.min(p, n + 1 - p); }
/* description d'une molécule de la famille choisie */
function mol(fam, n, p){
  var m = {fam: fam, n: n, ok: true, msg: ""};
  if (fam === "alcane"){ m.nom = RAC[n] + "ane"; m.H = 2 * n + 2; m.O = 0; m.fn = "aucune (hydrocarbure saturé)"; m.cl = "—"; }
  if (fam === "alcool"){
    p = Math.max(1, Math.min(n, p)); m.p = p; var q = canon(p, n);
    m.nom = n <= 2 ? RAC[n] + "anol" : RAC[n] + "an-" + q + "-ol"; m.H = 2 * n + 2; m.O = 1; m.fn = "alcool (–OH)";
    m.cl = (p === 1 || p === n) ? "primaire (C–OH lié à 1 seul autre C)" : "secondaire (C–OH lié à 2 autres C)";
  }
  if (fam === "aldehyde"){ m.nom = RAC[n] + "anal"; m.H = 2 * n; m.O = 1; m.fn = "aldéhyde (–CHO, en bout de chaîne)"; m.cl = "—"; }
  if (fam === "cetone"){
    if (n < 3){ m.ok = false; m.msg = "Une cétone a besoin d'au moins 3 carbones : le C=O doit être entouré de deux C."; return m; }
    p = Math.max(2, Math.min(n - 1, p)); m.p = p; var q2 = canon(p, n);
    m.nom = n === 3 ? "propanone" : n === 4 ? "butanone" : RAC[n] + "an-" + q2 + "-one"; m.H = 2 * n; m.O = 1; m.fn = "cétone (C=O au milieu de la chaîne)"; m.cl = "—";
  }
  if (fam === "acide"){ m.nom = "acide " + RAC[n] + "anoïque"; m.H = 2 * n; m.O = 2; m.fn = "acide carboxylique (–COOH, en bout de chaîne)"; m.cl = "—"; }
  m.formule = "C" + sub(n) + "H" + sub(m.H) + (m.O ? "O" + (m.O > 1 ? sub(m.O) : "") : "");
  m.M = 12 * n + m.H + 16 * m.O;
  return m;
}
SFA.sim({
  id: "c6-c01-reconnaitre", ch: "c01", tag: "Classique",
  titre: "Reconnaître et nommer le groupe fonctionnel",
  resume: "Choisis une famille, la longueur de la chaîne et la position du groupe : lis le nom, la formule et la classe.",
  but: "Change la famille, le nombre de carbones et la position du groupe. Active le défi pour deviner le nom avant de le voir.",
  aRetenir: "Le groupe fonctionnel donne le nom : –OH (alcool, suffixe -ol), –CHO (aldéhyde, -al), C=O au milieu (cétone, -one), –COOH (acide, acide …-oïque). On numérote la chaîne pour que le groupe ait le plus petit numéro. Un alcool est primaire, secondaire ou tertiaire selon le nombre de carbones liés au C porteur du –OH.",
  piege: "Le –OH d'un alcool n'est pas la base OH⁻ : l'alcool est une molécule neutre, qui ne libère pas d'ions hydroxyde dans l'eau. Et un aldéhyde (–CHO) est toujours en bout de chaîne, une cétone jamais.",
  build: function(k, S){
    var c = k.canvas(300), P = S.draw.palette;
    var fam = k.seg("Famille", [["alcane","Alcane"],["alcool","Alcool"],["aldehyde","Aldéhyde"],["cetone","Cétone"],["acide","Acide"]], "alcool");
    var nn = k.slider("Carbones dans la chaîne", 2, 7, 1, 4, "");
    var pp = k.slider("Position du groupe (alcool, cétone)", 1, 7, 1, 2, "");
    var hide = k.toggle("Défi : cacher le nom", false);
    var ro = k.readouts(["Nom", "Formule brute", "Masse molaire", "Classe"]);
    var nt = k.note("", "warn");
    function bond(x1, y1, x2, y2, col, dbl){
      if (!dbl){ S.draw.line(c, x1, y1, x2, y2, col || P.ink, 2.4); return; }
      var dx = x2 - x1, dy = y2 - y1, l = Math.sqrt(dx * dx + dy * dy), nx = -dy / l * 3.2, ny = dx / l * 3.2;
      S.draw.line(c, x1 + nx, y1 + ny, x2 + nx, y2 + ny, col || P.ink, 2.4); S.draw.line(c, x1 - nx, y1 - ny, x2 - nx, y2 - ny, col || P.ink, 2.4);
    }
    function atom(txt, x, y){ S.draw.text(c, txt, x, y, {size: 15, color: P.red, bg: "#fbfcfd"}); }
    function halo(x, y, r){ c.ctx.save(); c.ctx.fillStyle = "rgba(244,197,66,.35)"; c.ctx.beginPath(); c.ctx.arc(x, y, r, 0, 7); c.ctx.fill(); c.ctx.restore(); }
    k.draw(function(){
      c.clear();
      var m = mol(fam.value, nn.value, pp.value), n = nn.value;
      var dx = Math.min(62, (c.W - 120) / Math.max(1, n - 1)), a = 22, x0 = Math.max(60, (c.W - dx * (n - 1)) / 2), yc = c.H / 2 + 8;
      var X = function(i){ return x0 + i * dx; }, Y = function(i){ return yc + (i % 2 === 0 ? a : -a); };
      nt.set("", ""); nt.el.style.display = "none";
      if (!m.ok){ nt.set(m.msg, "warn"); nt.el.style.display = ""; S.draw.text(c, "Pas de cétone possible avec cette chaîne.", c.W / 2, c.H / 2, {size: 14, color: P.red}); ro.set(0, "—"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—"); return; }
      var i;
      /* groupe fonctionnel (halo + atomes) */
      if (m.fam === "alcool"){ var j = m.p - 1, s = (j % 2 === 0) ? 1 : -1; halo(X(j), Y(j) + s * 36, 26); }
      if (m.fam === "cetone"){ var jj = m.p - 1, ss = (jj % 2 === 0) ? 1 : -1; halo(X(jj), Y(jj) + ss * 34, 26); }
      if (m.fam === "aldehyde"){ halo(X(0) - dx * 0.9, Y(0) - 24, 28); }
      if (m.fam === "acide"){ halo(X(0) - 8, Y(0) - 8, 44); }
      for (i = 0; i < n - 1; i++) bond(X(i), Y(i), X(i + 1), Y(i + 1));
      if (m.fam === "alcool"){ j = m.p - 1; s = (j % 2 === 0) ? 1 : -1; bond(X(j), Y(j), X(j), Y(j) + s * 38); atom("OH", X(j), Y(j) + s * 50); }
      if (m.fam === "cetone"){ jj = m.p - 1; ss = (jj % 2 === 0) ? 1 : -1; bond(X(jj), Y(jj), X(jj), Y(jj) + ss * 38, P.red, true); atom("O", X(jj), Y(jj) + ss * 50); }
      if (m.fam === "aldehyde"){ bond(X(0), Y(0), X(0) - dx * 0.9, Y(0) - 24, P.red, true); atom("O", X(0) - dx * 0.9 - 4, Y(0) - 34); }
      if (m.fam === "acide"){ bond(X(0), Y(0), X(0) - dx * 0.9, Y(0) - 24, P.red, true); atom("O", X(0) - dx * 0.9 - 4, Y(0) - 34); bond(X(0), Y(0), X(0), Y(0) + 36); atom("OH", X(0), Y(0) + 48); }
      for (i = 0; i < n; i++) S.draw.dot(c, X(i), Y(i), 3, P.grey);
      wrap(c, S, "Chaque sommet de la ligne brisée est un atome de carbone (H sur C non dessinés).", c.W / 2, c.H - 26, c.W - 30, {size: 12, color: P.grey});
      var nom = hide.value ? "? (devine, puis décoche)" : m.nom;
      S.draw.text(c, hide.value ? "Fonction : ?" : m.fn, c.W / 2, 20, {size: 14, color: P.green});
      ro.set(0, nom); ro.set(1, hide.value ? "?" : m.formule); ro.set(2, hide.value ? "?" : S.fmt(m.M, 0) + " g/mol"); ro.set(3, hide.value ? "?" : m.cl);
    });
  }
});

/* ---------- oxydation ménagée ---------- */
var ALC = [
  {nom: "éthanol", cl: "I", ald: "éthanal", cet: null, ac: "acide éthanoïque", f: "C<sub>2</sub>H<sub>6</sub>O"},
  {nom: "propan-1-ol", cl: "I", ald: "propanal", cet: null, ac: "acide propanoïque", f: "C<sub>3</sub>H<sub>8</sub>O"},
  {nom: "butan-1-ol", cl: "I", ald: "butanal", cet: null, ac: "acide butanoïque", f: "C<sub>4</sub>H<sub>10</sub>O"},
  {nom: "propan-2-ol", cl: "II", ald: null, cet: "propanone", ac: null, f: "C<sub>3</sub>H<sub>8</sub>O"},
  {nom: "butan-2-ol", cl: "II", ald: null, cet: "butanone", ac: null, f: "C<sub>4</sub>H<sub>10</sub>O"},
  {nom: "2-méthylpropan-2-ol", cl: "III", ald: null, cet: null, ac: null, f: "C<sub>4</sub>H<sub>10</sub>O"}
];
SFA.sim({
  id: "c6-c01-oxydation", ch: "c01", tag: "Classique",
  titre: "Oxydation ménagée d'un alcool",
  resume: "Primaire, secondaire ou tertiaire ? Défaut ou excès d'oxydant ? Prévois le produit et la couleur du tube.",
  but: "Choisis l'alcool, l'oxydant et les conditions, puis fais avancer la réaction avec le curseur : suis la couleur et le produit formé.",
  aRetenir: "Alcool primaire : aldéhyde (si on l'arrête, par exemple en le distillant) puis acide carboxylique (oxydant en excès). Alcool secondaire : cétone, et elle s'arrête là. Alcool tertiaire : pas d'oxydation ménagée. Le dichromate passe de l'orange (Cr₂O₇²⁻) au vert (Cr³⁺).",
  piege: "Un alcool secondaire ne donne jamais d'acide en oxydation ménagée, et un alcool tertiaire ne réagit pas du tout : pour qu'il y ait oxydation, le carbone qui porte le –OH doit porter au moins un H.",
  build: function(k, S){
    var c = k.canvas(300), P = S.draw.palette;
    var al = k.select("Alcool", ALC.map(function(a, i){ return [i, a.nom + " (" + a.cl + ")"]; }), 0);
    var ox = k.seg("Oxydant (en milieu acide)", [["cr","Dichromate"],["mn","Permanganate"]], "cr");
    var cond = k.seg("Conditions", [["def","Oxydant en défaut, distillation"],["exc","Oxydant en excès, reflux"]], "def");
    var av = k.slider("Avancement de la réaction", 0, 100, 5, 0, "%");
    var ro = k.readouts(["Produit formé", "Couleur du tube", "Test à la liqueur de Fehling"]);
    var nt = k.note("", "ok");
    function mix(c1, c2, t){ var r = []; for (var i = 0; i < 3; i++) r.push(Math.round(c1[i] + (c2[i] - c1[i]) * t)); return "rgb(" + r.join(",") + ")"; }
    function box(x, y, w, h, txt, on, dead){
      var ctx = c.ctx; ctx.save(); ctx.fillStyle = on ? "#e6f3ec" : "#f4f6f9"; ctx.strokeStyle = on ? P.green : P.light; ctx.lineWidth = on ? 2.5 : 1.2;
      ctx.beginPath(); ctx.rect(x, y, w, h); ctx.fill(); ctx.stroke(); ctx.restore();
      S.draw.text(c, txt, x + w / 2, y + h / 2, {size: 12, color: dead ? P.grey : P.ink});
    }
    k.draw(function(){
      c.clear();
      var a = ALC[al.value], t = av.value / 100, ctx = c.ctx;
      var prod = null, kind = "";
      if (a.cl === "I"){ prod = cond.value === "def" ? a.ald : a.ac; kind = cond.value === "def" ? "ald" : "ac"; }
      if (a.cl === "II"){ prod = a.cet; kind = "cet"; }
      var react = a.cl !== "III";
      var c0 = ox.value === "cr" ? [235, 130, 20] : [110, 20, 140], c1 = ox.value === "cr" ? [60, 140, 90] : [245, 238, 240];
      var col = react ? mix(c0, c1, Math.min(1, t * 1.0)) : mix(c0, c0, 0);
      /* tube */
      var tx = Math.max(14, c.W * 0.08), ty = 40, tw = 70, th = 180;
      ctx.save(); ctx.fillStyle = col; ctx.fillRect(tx, ty + 55, tw, th - 55); ctx.strokeStyle = P.ink; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx, ty + th); ctx.lineTo(tx + tw, ty + th); ctx.lineTo(tx + tw, ty); ctx.stroke(); ctx.restore();
      S.draw.text(c, ox.value === "cr" ? "Cr₂O₇²⁻" : "MnO₄⁻", tx + tw / 2, ty + th + 16, {size: 12, color: P.grey});
      /* chaîne de réaction (colonne) */
      var bx = Math.max(tx + tw + 40, c.W * 0.40), bw = c.W - bx - 16, bh = 40, y1 = 44, y2 = 112, y3 = 180;
      var names = [a.nom, a.ald || a.cet || "—", a.ac || "—"];
      var stage = !react ? 0 : (t < 0.15 ? 0 : (kind === "ac" ? (t < 0.55 ? 1 : 2) : 1));
      S.draw.text(c, a.cl === "I" ? "Alcool primaire" : a.cl === "II" ? "Alcool secondaire" : "Alcool tertiaire", bx + bw / 2, 22, {size: 14, color: P.green});
      box(bx, y1, bw, bh, names[0], stage === 0);
      if (a.cl === "I"){
        box(bx, y2, bw, bh, names[1], stage === 1);
        box(bx, y3, bw, bh, names[2], stage === 2, cond.value === "def");
        S.draw.arrow(c, bx + bw / 2, y1 + bh, bx + bw / 2, y2, P.ink, 2); S.draw.arrow(c, bx + bw / 2, y2 + bh, bx + bw / 2, y3, cond.value === "def" ? P.light : P.ink, 2);
        wrap(c, S, cond.value === "def" ? "aldéhyde distillé : l'oxydation s'arrête" : "excès d'oxydant : l'aldéhyde s'oxyde à son tour", bx + bw / 2, y3 + bh + 20, bw, {size: 12, color: P.amber});
      } else if (a.cl === "II"){
        box(bx, y2, bw, bh, names[1], stage === 1); S.draw.arrow(c, bx + bw / 2, y1 + bh, bx + bw / 2, y2, P.ink, 2);
        box(bx, y3, bw, bh, "pas d'acide", false, true); S.draw.text(c, "✕", bx + bw / 2 + 50, (y2 + bh + y3) / 2, {size: 18, color: P.red});
        wrap(c, S, "la cétone ne s'oxyde plus", bx + bw / 2, y3 + bh + 20, bw, {size: 12, color: P.amber});
      } else {
        wrap(c, S, "✕ aucune oxydation ménagée", bx + bw / 2, y2 - 10, bw, {size: 14, color: P.red});
        wrap(c, S, "le C porteur du –OH n'a pas de H", bx + bw / 2, y2 + 34, bw, {size: 12, color: P.amber});
      }
      var colName = !react ? (ox.value === "cr" ? "orange (inchangé)" : "violet (inchangé)") : (t < 0.1 ? (ox.value === "cr" ? "orange" : "violet") : t > 0.9 ? (ox.value === "cr" ? "vert (Cr³⁺)" : "incolore (Mn²⁺)") : "en transition");
      var wait = !react || t < 0.15, cur = (kind === "ac" && t < 0.55) ? "ald" : kind, shown = wait ? "aucun pour l'instant" : (cur === "ald" ? a.ald : prod);
      ro.set(0, shown); ro.set(1, colName);
      ro.set(2, wait ? "—" : (cur === "ald" ? "positif (précipité rouge)" : cur === "cet" ? "négatif" : "négatif (acide : pas d'aldéhyde)"));
      var msg = !react ? "Alcool tertiaire : le mélange reste de la couleur de l'oxydant." : (t < 0.15 ? "Fais avancer la réaction." : "Produit à cet instant : <b>" + shown + "</b>" + (cur === "ald" && kind === "ac" ? " (avec un excès d'oxydant, il va s'oxyder en acide)." : "."));
      nt.set(msg, !react ? "warn" : "ok");
    });
  }
});

/* ---------- températures d'ébullition ---------- */
var TEB = {
  alcane: [-162, -89, -42, -1, 36, 69, 98, 126],
  ald: [-19, 20, 48, 75, 103, 131, 153, 171],
  alcool: [65, 78, 97, 118, 138, 157, 176, 195],
  acide: [101, 118, 141, 164, 186, 205, 223, 239]
};
SFA.sim({
  id: "c6-c01-ebullition", ch: "c01", tag: "Graphes",
  titre: "Températures d'ébullition : l'effet de la liaison hydrogène",
  resume: "Compare alcanes, aldéhydes, alcools et acides de même chaîne et vois l'état physique à la température choisie.",
  but: "Fais varier le nombre de carbones : à chaîne égale, qui bout le plus haut ? Règle ensuite une température pour savoir qui est gazeux ou liquide.",
  aRetenir: "À même longueur de chaîne : alcane < aldéhyde < alcool < acide. Les alcools et les acides forment des liaisons hydrogène entre molécules (–OH), ce qui demande plus d'énergie pour les séparer. Dans une famille, la T d'ébullition augmente avec la longueur de la chaîne.",
  piege: "Ce n'est pas la masse molaire seule qui décide : l'éthanol (46 g/mol) bout à 78 °C alors que le propane (44 g/mol) bout à −42 °C. Valeurs arrondies au degré, à pression atmosphérique, pour les composés à chaîne linéaire.",
  build: function(k, S){
    var c = k.canvas(340), P = S.draw.palette;
    var n = k.slider("Carbones dans la chaîne", 1, 8, 1, 3, "");
    var T = k.slider("Température du laboratoire", 20, 250, 5, 25, "°C");
    var tg = {alcane: k.toggle("Alcane", true), ald: k.toggle("Aldéhyde", true), alcool: k.toggle("Alcool", true), acide: k.toggle("Acide carboxylique", true)};
    var ro = k.readouts(["Alcane", "Aldéhyde", "Alcool", "Acide"]);
    var cols = {alcane: P.grey, ald: P.amber, alcool: P.acc, acide: P.red}, lab = {alcane: "Alcane", ald: "Aldéhyde", alcool: "Alcool", acide: "Acide"};
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0: 0.5, x1: 8.5, y0: -180, y1: 260, stepX: 1, stepY: 50, xl: "n (carbones)", yl: "T éb (°C)"});
      S.draw.line(c, ax.L, ax.Y(T.value), ax.R, ax.Y(T.value), P.green, 1.6, [6, 4]);
      S.draw.text(c, "T lab = " + T.value + " °C", ax.L + 6, ax.Y(T.value) - 9, {size: 12, color: P.green, align: "left"});
      var key, i, ctx = c.ctx;
      for (key in TEB){
        if (!tg[key].value) continue;
        ctx.save(); ctx.strokeStyle = cols[key]; ctx.lineWidth = 2.2; ctx.beginPath();
        for (i = 0; i < 8; i++){ if (i === 0) ctx.moveTo(ax.X(i + 1), ax.Y(TEB[key][i])); else ctx.lineTo(ax.X(i + 1), ax.Y(TEB[key][i])); }
        ctx.stroke(); ctx.restore();
        for (i = 0; i < 8; i++) S.draw.dot(c, ax.X(i + 1), ax.Y(TEB[key][i]), i + 1 === n.value ? 6 : 3, cols[key]);
      }
      var idx = 0;
      for (key in TEB){
        var v = TEB[key][n.value - 1], gaz = T.value >= v;
        ro.set(idx++, tg[key].value ? S.fmt(v, 0) + " °C · " + (gaz ? "gaz" : "liquide") : "—");
      }
      S.draw.line(c, ax.X(n.value), ax.T, ax.X(n.value), ax.B, P.light, 1.2, [3, 3]);
    });
  }
});

/* ---------- éthylotest ---------- */
SFA.sim({
  id: "c6-c01-ethylotest", ch: "c01", tag: "Dans la vraie vie",
  titre: "L'éthylotest à tube : le dichromate vire au vert",
  resume: "Souffle dans le tube : l'orange du dichromate vire au vert d'autant plus loin que tu as soufflé d'éthanol.",
  but: "Règle la concentration d'éthanol de ton haleine et le volume du sac, puis presse « Souffler ». Tu peux aussi faire glisser le doigt sur le tube : jusqu'où faut-il que le vert aille pour dépasser le repère légal ?",
  aRetenir: "L'éthanol réduit le dichromate orange en Cr³⁺ vert : 3 CH₃CH₂OH + 2 Cr₂O₇²⁻ + 16 H⁺ → 3 CH₃COOH + 4 Cr³⁺ + 11 H₂O. La longueur verte est proportionnelle à la quantité d'éthanol soufflée (c × V), pas seulement à la concentration.",
  piege: "Si tu souffles un volume trop petit, le tube sous-estime. De plus, c'est un test de dépistage : en Belgique, la limite est de 0,22 mg d'éthanol par litre d'air expiré (≈ 0,5 g/L de sang, conversion arrondie ×2,3) et seule la mesure d'un appareil homologué fait foi.",
  build: function(k, S){
    var c = k.canvas(380), P = S.draw.palette, H = window.C6;
    var conc = k.slider("Éthanol dans l'air expiré", 0, 1, 0.01, 0.22, "mg/L");
    var vol = k.slider("Volume soufflé", 0.2, 1.5, 0.05, 1, "L");
    k.button("Souffler", function(){ shown = 0; anim.play(); }, true);
    k.button("Souffle limite (0,22 mg/L · 1 L)", function(){ conc.set(0.22); vol.set(1); shown = 0; anim.play(); });
    var ro = k.readouts(["n(éthanol) soufflé", "Cr₂O₇²⁻ consommé", "Partie verte", "Équiv. dans le sang"]);
    var nt = k.note("", "ok");
    var N0 = 0.0080, shown = 0, tgt = 0, tt = 0;
    var anim = k.loop(function(dt, t){ tt = t; var d = tgt - shown; if (Math.abs(d) < 0.002){ shown = tgt; } else shown += d * Math.min(1, dt * 2.6); k.redraw(); if (shown === tgt && t > 0){ anim.pause(); k.redraw(); } });
    var geo = {};
    c.pointer(function(type, p){
      if (type === "down" || type === "drag"){
        var f = Math.max(0, Math.min(1, (p.x - geo.x0) / geo.L));
        conc.set(Math.round(Math.min(1, f * N0 * 1.5 * 46 / vol.value) * 100) / 100); shown = f; k.redraw(); anim.play();
      }
    });
    k.draw(function(){
      c.clear(); H.bg(c, {top: "#fbfcfd", bottom: "#eaf0f6"});
      var ctx = c.ctx, nEt = conc.value * vol.value / 46, nCr = nEt * 2 / 3, f = Math.min(1, nCr / N0);
      if (Math.abs(f - tgt) > 1e-9){ tgt = f; anim.play(); }
      var lim = Math.min(1, (0.22 / 46 * 2 / 3) / N0);
      var small = c.W < 520;
      var bagW = small ? 74 : 104, x0 = 26 + bagW + 30, x1 = c.W - 28, L = x1 - x0, y = Math.round(c.H * 0.38), h = small ? 46 : 54;
      geo.x0 = x0; geo.L = L;
      /* sac / ballon de soufflage : taille proportionnelle au volume */
      var s = 0.55 + 0.45 * vol.value / 1.5, bx = 26 + bagW / 2, by = y + h / 2, rx = bagW / 2 * s, ry = 62 * s;
      var g = ctx.createRadialGradient(bx - rx * 0.3, by - ry * 0.4, 4, bx, by, rx * 1.2); g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#bcd0e6");
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.2)"; ctx.shadowBlur = 10; ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(bx, by, rx, ry, 0, 0, 7); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "#7f97b3"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(bx, by, rx, ry, 0, 0, 7); ctx.stroke();
      S.draw.text(c, S.fmt(vol.value, 2) + " L", bx, by - 4, {size: 15, color: P.acc});
      S.draw.text(c, "air expiré", bx, by + 14, {size: 11, color: P.grey});
      S.draw.line(c, bx + rx, by, x0 - 2, by, "#7f97b3", 6);
      /* tube : verre, orange, vert */
      ctx.save(); S.draw.rrect(c, x0, y, L, h, h / 2); ctx.clip();
      var go = ctx.createLinearGradient(0, y, 0, y + h); go.addColorStop(0, "#f7a64a"); go.addColorStop(.5, "#e8801a"); go.addColorStop(1, "#c8650f");
      ctx.fillStyle = go; ctx.fillRect(x0, y, L, h);
      var gg = ctx.createLinearGradient(0, y, 0, y + h); gg.addColorStop(0, "#6fc08e"); gg.addColorStop(.5, "#3c9a67"); gg.addColorStop(1, "#276f49");
      ctx.fillStyle = gg; ctx.fillRect(x0, y, L * shown, h);
      /* front de réaction : léger fondu */
      var fx = x0 + L * shown; var gf = ctx.createLinearGradient(fx - 10, 0, fx + 10, 0); gf.addColorStop(0, "rgba(60,154,103,0)"); gf.addColorStop(1, "rgba(232,128,26,0)");
      /* grains de gel de silice */
      for (var i = 0; i < 160; i++){ var gx = x0 + H.rnd(i, 1) * L, gy = y + H.rnd(i, 2) * h; ctx.fillStyle = "rgba(255,255,255," + (0.10 + H.rnd(i, 3) * 0.16).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(gx, gy, 1.2 + H.rnd(i, 4) * 1.6, 0, 7); ctx.fill(); }
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(x0, y + 5, L, 5);
      ctx.restore();
      ctx.strokeStyle = "#5b6e86"; ctx.lineWidth = 2.4; S.draw.rrect(c, x0, y, L, h, h / 2); ctx.stroke();
      /* bulles d'air en mouvement pendant l'animation */
      if (anim.running){ for (i = 0; i < 7; i++){ var u = (tt * 0.9 + i / 7) % 1, px = x0 + 10 + u * Math.max(8, L * shown - 10); S.draw.dot(c, px, y + h / 2 + Math.sin(tt * 6 + i * 2) * h * 0.22, 2.6, "rgba(255,255,255,.9)"); } }
      /* repère légal */
      var lx = x0 + L * lim;
      S.draw.line(c, lx, y - 16, lx, y + h + 16, P.red, 2.6);
      S.draw.label(c, "limite légale", lx, y - 28, {color: P.red});
      S.draw.text(c, "0,22 mg/L pour 1 L soufflé", lx, y + h + 30, {size: 11, color: P.red});
      S.draw.text(c, "Tube à dichromate acidifié (modèle : 0,0080 mmol de Cr₂O₇²⁻)", c.W / 2, 22, {size: 13, color: P.ink});
      var over = f > lim + 1e-9;
      S.draw.display(c, S.fmt(conc.value * 2.3, 2) + " g/L", c.W - (small ? 70 : 92), c.H - 50, {w: small ? 116 : 140, h: 54, caption: "équiv. sang (×2,3)", color: over ? P.red : "#13233a", size: 20});
      S.draw.legend(c, [["#3c9a67", "vert : Cr³⁺ formé"], ["#e8801a", "orange : Cr₂O₇²⁻ restant"]], 14, c.H - 62, {});
      S.draw.text(c, "Glisse le doigt sur le tube", c.W / 2, 50, {size: 11, color: P.grey});
      ro.set(0, S.fmt(nEt, 4) + " mmol"); ro.set(1, S.fmt(nCr, 4) + " mmol"); ro.set(2, S.fmt(f * 100, 0) + " %"); ro.set(3, S.fmt(conc.value * 2.3, 2) + " g/L");
      if (f >= 1) nt.set("Tube saturé : tout le dichromate a réagi, on ne peut plus lire plus haut.", "warn");
      else if (over) nt.set("La zone verte dépasse le repère : dépistage positif (au-dessus de 0,22 mg/L pour 1 L soufflé).", "warn");
      else nt.set("La zone verte reste en deçà du repère.", "ok");
    });
  }
});
})();
