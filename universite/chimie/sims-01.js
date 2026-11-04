/* Chimie BA1 · c01 · Atome, spectre et radioactivité — contenu SFA original */
(function(){
var HC_EV_NM = 1239.84;      /* h·c en eV·nm */
var E1 = 13.606;             /* énergie d'ionisation de H, eV */

/* couleur approchée d'une longueur d'onde visible */
function wl2rgb(w){
  var r = 0, g = 0, b = 0, f;
  if (w >= 380 && w < 440){ r = -(w - 440) / 60; b = 1; }
  else if (w < 490){ g = (w - 440) / 50; b = 1; }
  else if (w < 510){ g = 1; b = -(w - 510) / 20; }
  else if (w < 580){ r = (w - 510) / 70; g = 1; }
  else if (w < 645){ r = 1; g = -(w - 645) / 65; }
  else if (w <= 750){ r = 1; }
  else return null;
  f = w < 420 ? 0.35 + 0.65 * (w - 380) / 40 : w > 700 ? 0.35 + 0.65 * (750 - w) / 50 : 1;
  return "rgb(" + Math.round(255 * r * f) + "," + Math.round(255 * g * f) + "," + Math.round(255 * b * f) + ")";
}

/* ---------- 1. Spectre de l'hydrogène ---------- */
SFA.sim({
  id:"uc-c01-bohr", ch:"c01", tag:"Atome",
  titre:"Spectre d'émission et d'absorption de l'hydrogène",
  resume:"Choisis deux niveaux de Bohr : l'énergie du photon, sa longueur d'onde et la série (Lyman, Balmer, Paschen) s'affichent.",
  but:"Fais varier le niveau de départ n<sub>i</sub> et le niveau d'arrivée n<sub>f</sub> : observe le diagramme d'énergie, la raie obtenue sur le spectre et sa zone (UV, visible, IR).",
  aRetenir:"ΔE = 13,6·Z²·|1/n<sub>f</sub>² − 1/n<sub>i</sub>²| eV ; λ = hc/ΔE ; 1/λ = R<sub>H</sub>·Z²·|1/n<sub>f</sub>² − 1/n<sub>i</sub>²| avec R<sub>H</sub> = 1,097·10⁷ m⁻¹. Émission : n<sub>i</sub> > n<sub>f</sub> ; absorption : n<sub>i</sub> < n<sub>f</sub> (la raie est à la même longueur d'onde).",
  piege:"Une raie d'absorption occupe la même position qu'une raie d'émission : seule la lumière change (raie noire sur fond continu, ou raie colorée sur fond noir). Le modèle de Bohr n'est exact que pour un seul électron (H, He⁺, Li²⁺).",
  build:function(k, S){
    var c = k.canvas(410);
    var zs = k.select("Espèce à un électron", [[1,"H (Z = 1)"],[2,"He⁺ (Z = 2)"],[3,"Li²⁺ (Z = 3)"]], 1);
    var ni = k.slider("Niveau de départ n<sub>i</sub>", 1, 8, 1, 3, "");
    var nf = k.slider("Niveau d'arrivée n<sub>f</sub>", 1, 8, 1, 2, "");
    var ro = k.readouts(["Nature", "ΔE du photon", "ΔE (J)", "λ", "ν", "Série / zone"]);
    var nt = k.note("", "ok");
    var names = {1:"Lyman", 2:"Balmer", 3:"Paschen", 4:"Brackett", 5:"Pfund"};
    function lam(Z, a, b){ return HC_EV_NM / (E1 * Z * Z * Math.abs(1/(a*a) - 1/(b*b))); }
    k.draw(function(){
      var Z = +zs.value, a = ni.value, b = nf.value, W = c.W, H = c.H, ctx = c.ctx, P = S.draw.palette;
      c.clear();
      /* --- diagramme d'énergie (gauche) --- */
      var xl = 20, xr = Math.min(W * 0.42, 250), y0 = 34, y1 = H - 36;
      /* énergie ∝ −1/n² : 0 en haut (ionisation), −1 en bas (n = 1) */
      function Y(n){ return y1 - (y1 - y0) * (1 - 1/(n*n)); }
      S.draw.text(c, "E (eV)", xl, 12, {size:11, color:P.grey, align:"left"});
      for (var n = 1; n <= 8; n++){
        var yy = Y(n), on = (n === a || n === b);
        S.draw.line(c, xl + 40, yy, xr, yy, on ? P.ink : P.grey, on ? 2.4 : 1.2);
        S.draw.text(c, "n = " + n, xl + 22, yy, {size:11, color:on ? P.ink : P.grey});
        if (n <= 3 || on) S.draw.text(c, S.fmt(-E1 * Z * Z / (n*n), 2) + " eV", xr + 4, yy, {size:10, color:on ? P.acc : P.grey, align:"left"});
      }
      S.draw.line(c, xl + 40, y0, xr, y0, P.red, 1, [4,3]);
      S.draw.text(c, "0 (ionisé)", xl + 22, y0 - 10, {size:10, color:P.red});
      var em = a > b;
      if (a !== b){
        var xa = (xl + 40 + xr) / 2 + (em ? 12 : -12);
        S.draw.arrow(c, xa, Y(a), xa, Y(b), em ? P.red : P.teal, 2.6);
      }
      /* --- spectre (droite) --- */
      var sx0 = Math.min(W * 0.42, 250) + 80, sx1 = W - 16, sy = 118;
      if (sx1 - sx0 < 120){ sx0 = xr + 30; }
      var lo = Math.min(a, b), hi = Math.max(a, b);
      var Llim = HC_EV_NM / (E1 * Z * Z / (lo * lo)), Lfirst = lam(Z, lo, lo + 1);
      var span = Lfirst - Llim, lmin = Math.max(1, Llim - span * 0.12), lmax = Lfirst + span * 0.12;
      function LX(l){ return sx0 + (l - lmin) / (lmax - lmin) * (sx1 - sx0); }
      S.draw.text(c, "Spectre de la série (échelle linéaire de λ, en nm)", (sx0 + sx1) / 2, 14, {size:11, color:P.grey});
      /* bande */
      var top = 40, hh = 70;
      if (em){ ctx.fillStyle = "#0b0f1a"; ctx.fillRect(sx0, top, sx1 - sx0, hh); }
      else {
        ctx.fillStyle = "#e9edf3"; ctx.fillRect(sx0, top, sx1 - sx0, hh);
        var dw = Math.max(0.5, (lmax - lmin) / 200);
        for (var w = Math.max(380, lmin); w <= Math.min(750, lmax); w += dw){ ctx.fillStyle = wl2rgb(w); ctx.fillRect(LX(w), top, LX(w + dw) - LX(w) + 0.8, hh); }
      }
      /* raies de la série */
      for (var m = lo + 1; m <= 12; m++){
        var L = lam(Z, lo, m), col = wl2rgb(L), isSel = (m === hi);
        ctx.strokeStyle = em ? (col || "#9fb0c8") : "#050505";
        ctx.lineWidth = isSel ? 4 : 2;
        ctx.beginPath(); ctx.moveTo(LX(L), top); ctx.lineTo(LX(L), top + hh); ctx.stroke();
        if (isSel){ S.draw.line(c, LX(L), top + hh, LX(L), top + hh + 16, P.red, 2); S.draw.text(c, S.fmt(L, 1) + " nm", LX(L), top + hh + 28, {size:12, color:P.red}); }
      }
      /* limite de série */
      S.draw.line(c, LX(Llim), top - 4, LX(Llim), top + hh + 4, P.amber, 1.5, [3,3]);
      S.draw.text(c, "limite", LX(Llim), top - 12, {size:10, color:P.amber});
      /* axe gradué */
      var stp = Math.pow(10, Math.floor(Math.log10((lmax - lmin) / 4))), mm = (lmax - lmin) / 4 / stp; stp *= mm < 1.5 ? 1 : mm < 3.5 ? 2 : mm < 7.5 ? 5 : 10;
      for (var t = Math.ceil(lmin / stp) * stp; t <= lmax; t += stp){ S.draw.line(c, LX(t), top + hh + 44, LX(t), top + hh + 50, P.grey, 1); S.draw.text(c, String(Math.round(t)), LX(t), top + hh + 60, {size:10, color:P.grey}); }
      var zone0 = lmax < 380 ? "domaine UV" : lmin > 750 ? "domaine IR" : (lmin < 380 && lmax > 750) ? "UV + visible + IR" : lmin < 380 ? "UV + visible" : lmax > 750 ? "visible + IR" : "domaine visible";
      S.draw.text(c, "Série n = " + lo + " : " + zone0, (sx0 + sx1) / 2, top + hh + 82, {size:11, color:P.green});
      S.draw.text(c, em ? "ÉMISSION : raies colorées sur fond noir" : (a === b ? "" : "ABSORPTION : raies noires sur fond continu"), (sx0 + sx1) / 2, top + hh + 106, {size:12, color:P.ink});
      /* grandeurs */
      if (a === b){
        ro.set(0, "—"); ro.set(1, "0"); ro.set(2, "0"); ro.set(3, "—"); ro.set(4, "—"); ro.set(5, "—");
        nt.set("n<sub>i</sub> = n<sub>f</sub> : aucune transition, pas de photon. Choisis deux niveaux différents.", "warn");
        return;
      }
      var dE = E1 * Z * Z * Math.abs(1/(a*a) - 1/(b*b)), L0 = HC_EV_NM / dE;
      var EJ = 6.626e-34 * 2.998e8 / (L0 * 1e-9), nu = 2.998e8 / (L0 * 1e-9);
      var zone = L0 < 380 ? "UV" : L0 <= 750 ? "visible" : "IR";
      ro.set(0, em ? "émission" : "absorption");
      ro.set(1, S.fmt(dE, 3) + " eV");
      ro.set(2, S.sci(EJ, 3) + " J");
      ro.set(3, S.fmt(L0, 1) + " nm");
      ro.set(4, S.sci(nu, 3) + " Hz");
      ro.set(5, (names[lo] || "série " + lo) + " · " + zone);
      nt.set("Série de type " + (names[lo] || ("n = " + lo)) + " (retour vers n = " + lo + "). " + (Z > 1 ? "Pour Z = " + Z + ", toutes les énergies sont multipliées par Z² = " + (Z*Z) + " et les longueurs d'onde divisées par " + (Z*Z) + " : les séries se décalent vers l'UV. " : "") + (a >= 8 || b >= 8 ? "Niveaux élevés : l'écart entre niveaux devient très petit." : ""), zone === "visible" ? "ok" : "warn");
    });
  }
});

/* ---------- 2. Décroissance radioactive et datation ---------- */
SFA.sim({
  id:"uc-c01-decroissance", ch:"c01", tag:"Radioactivité",
  titre:"Décroissance radioactive, demi-vie et datation au carbone 14",
  resume:"N(t) = N₀·2^(−t/T½) : suis la courbe, les noyaux restants, l'activité, puis calcule un âge à partir de la fraction de ¹⁴C restante.",
  but:"Choisis un radionucléide et un temps exprimé en demi-vies, ou passe en mode « Datation » pour retrouver l'âge d'un échantillon.",
  aRetenir:"N = N₀·e<sup>−λt</sup> = N₀·(½)<sup>t/T½</sup> ; λ = ln 2 / T½ ; A = λN ; t = (T½/ln 2)·ln(N₀/N). Après n demi-vies il reste ½ⁿ de noyaux : 50 %, 25 %, 12,5 %, 6,25 %…",
  piege:"« Après deux demi-vies, tout a disparu » est faux : il reste 25 %. La demi-vie ne dépend ni de la quantité présente ni de la température : le processus est aléatoire noyau par noyau, d'ordre 1. La datation au ¹⁴C devient peu fiable au-delà de ≈ 50 000 ans (moins de 0,3 % de ¹⁴C).",
  build:function(k, S){
    var c = k.canvas(400);
    var iso = [
      ["c14","¹⁴C — 5 730 ans", 5730 * 365.25 * 86400],
      ["i131","¹³¹I — 8,02 jours", 8.02 * 86400],
      ["tc99","⁹⁹ᵐTc — 6,01 heures", 6.01 * 3600],
      ["f18","¹⁸F — 109,8 minutes", 109.8 * 60],
      ["p32","³²P — 14,3 jours", 14.3 * 86400],
      ["u238","²³⁸U — 4,468·10⁹ ans", 4.468e9 * 365.25 * 86400]
    ];
    var mode = k.seg("Mode", [["dec","Décroissance"],["dat","Datation ¹⁴C"]], "dec");
    var sel = k.select("Radionucléide", iso.map(function(x){ return [x[0], x[1]]; }), "c14");
    var tn = k.slider("Temps écoulé t (en demi-vies)", 0, 10, 0.1, 2, "T½");
    var fr = k.slider("Fraction de ¹⁴C restante (mode datation)", 0.5, 100, 0.5, 25, "%");
    var ro = k.readouts(["Fraction restante", "Noyaux restants (sur 100)", "Temps écoulé", "Activité relative A/A₀", "λ"]);
    var nt = k.note("", "ok");
    function fmtT(s){
      var a = s / (365.25 * 86400);
      if (a >= 1) return a >= 1e6 ? S.sci(a, 3) + " ans" : S.fmt(a, a < 100 ? 1 : 0) + " ans";
      var d = s / 86400; if (d >= 1) return S.fmt(d, 2) + " jours";
      var h = s / 3600; if (h >= 1) return S.fmt(h, 2) + " heures";
      return S.fmt(s / 60, 1) + " minutes";
    }
    var dots = []; for (var i = 0; i < 100; i++) dots.push((i * 37 % 100) / 100 + (i % 7) * 1e-4);   /* ordre de disparition fixe pseudo-aléatoire */
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, dat = mode.value === "dat";
      var T = iso.filter(function(x){ return x[0] === sel.value; })[0];
      var T12 = dat ? iso[0][2] : T[2];
      var tt, f;
      if (dat){ f = fr.value / 100; tt = Math.log2(1 / f); } else { tt = tn.value; f = Math.pow(0.5, tt); }
      c.clear();
      var gw = Math.min(W * 0.62, W - 150);
      var cv = {ctx:ctx, W:gw, H:H}, ax = S.draw.axes(cv, {x0:0, x1:10, y0:0, y1:1, xl:"t / T½", yl:"N / N₀", stepX:1, stepY:0.25, l:44, r:10, t:16, b:34});
      S.draw.fn(cv, ax, function(x){ return Math.pow(0.5, x); }, P.acc, 2.6);
      for (var n = 1; n <= 4; n++){ S.draw.line(c, ax.X(n), ax.Y(0), ax.X(n), ax.Y(Math.pow(0.5, n)), P.light, 1, [3,3]); S.draw.line(c, ax.L, ax.Y(Math.pow(0.5, n)), ax.X(n), ax.Y(Math.pow(0.5, n)), P.light, 1, [3,3]); S.draw.dot(c, ax.X(n), ax.Y(Math.pow(0.5, n)), 3, P.grey); }
      S.draw.line(c, ax.X(tt), ax.Y(0), ax.X(tt), ax.Y(f), P.red, 1.5, [4,3]);
      S.draw.line(c, ax.L, ax.Y(f), ax.X(tt), ax.Y(f), P.red, 1.5, [4,3]);
      S.draw.dot(c, ax.X(tt), ax.Y(f), 6, P.red);
      /* grille de 100 noyaux */
      var gx = gw + 14, cell = Math.min(15, (W - gx - 8) / 10), left = Math.round(f * 100 + 1e-9);
      S.draw.text(c, "100 noyaux", gx + cell * 5, 18, {size:11, color:P.grey});
      var order = dots.map(function(v, idx){ return [v, idx]; }).sort(function(p, q){ return p[0] - q[0]; });
      var alive = {}; for (var j = 0; j < left; j++) alive[order[j][1]] = 1;
      for (var q = 0; q < 100; q++){
        var cx = gx + (q % 10) * cell + cell / 2, cy = 34 + Math.floor(q / 10) * cell + cell / 2;
        S.draw.dot(c, cx, cy, cell * 0.36, alive[q] ? P.acc : P.light);
      }
      S.draw.text(c, left + " restent", gx + cell * 5, 34 + 10 * cell + 12, {size:12, color:P.acc});
      var tsec = tt * T12, lam = Math.LN2 / T12;
      ro.set(0, S.fmt(f * 100, f < 0.01 ? 3 : 2) + " %");
      ro.set(1, String(left));
      ro.set(2, dat ? fmtT(tsec) : fmtT(tsec));
      ro.set(3, S.fmt(f, 4));
      ro.set(4, S.sci(lam, 3) + " s⁻¹");
      if (dat){
        nt.set("Âge = (T½ / ln 2) · ln(N₀/N) = " + S.fmt(5730 / Math.LN2, 0) + " ans × ln(" + S.fmt(1 / f, 2) + ") = " + fmtT(tsec) + ". " + (fr.value < 1 ? "Moins de 1 % de ¹⁴C : mesure très incertaine (limite pratique vers 50 000 ans)." : "Hypothèse : le rapport ¹⁴C/¹²C initial est celui de l'atmosphère actuelle (modèle simplifié)."), fr.value < 1 ? "warn" : "ok");
      } else {
        nt.set("Après " + S.fmt(tt, 1) + " demi-vies (" + fmtT(tsec) + ") il reste " + S.fmt(f * 100, 2) + " % des noyaux ; chaque seconde, " + S.sci(lam, 2) + " de la population restante se désintègre (A = λN).", tt > 7 ? "warn" : "ok");
      }
    });
  }
});

/* ---------- 3. Équations nucléaires ---------- */
(function(){
  var EL = "n H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U".split(" ");
  var NUC = [
    ["h3","³H",1,3,"b-"],["c14","¹⁴C",6,14,"b-"],["c11","¹¹C",6,11,"b+"],["f18","¹⁸F",9,18,"b+"],["p32","³²P",15,32,"b-"],
    ["co60","⁶⁰Co",27,60,"b-"],["i123","¹²³I",53,123,"ce"],["i131","¹³¹I",53,131,"b-"],["po210","²¹⁰Po",84,210,"a"],
    ["ra226","²²⁶Ra",88,226,"a"],["u238","²³⁸U",92,238,"a"],["tc99m","⁹⁹ᵐTc",43,99,"g"]
  ];
  var MODES = [["a","α (émission d'un noyau ⁴He)"],["b-","β⁻ (électron + antineutrino)"],["b+","β⁺ (positon + neutrino)"],["ce","Capture électronique"],["g","γ (transition isomérique)"]];
  function sup(n){ return String(n).replace(/\d/g, function(d){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]; }); }
  function sub(n){ return String(n).replace(/\d/g, function(d){ return "₀₁₂₃₄₅₆₇₈₉"[d]; }); }
  function daughter(Z, A, m){
    if (m === "a") return [Z - 2, A - 4];
    if (m === "b-") return [Z + 1, A];
    if (m === "b+" || m === "ce") return [Z - 1, A];
    return [Z, A];
  }
  function stableZ(A){ return A / (1.98 + 0.0155 * Math.pow(A, 2/3)); }
  SFA.sim({
    id:"uc-c01-equation-nucleaire", ch:"c01", tag:"Noyau",
    titre:"Équilibrer une équation nucléaire sur la carte des noyaux",
    resume:"Choisis un noyau et un mode de désintégration : A et Z se conservent, le noyau fils apparaît et se déplace sur la vallée de stabilité.",
    but:"Sélectionne le noyau père puis le mode (α, β⁻, β⁺, capture, γ). Vérifie les bilans de A et de Z et regarde sur la carte N en fonction de Z si le noyau fils se rapproche de la vallée de stabilité.",
    aRetenir:"α : A − 4, Z − 2. β⁻ : n → p + e⁻ + ν̄, Z + 1, A inchangé. β⁺ et capture électronique : p → n, Z − 1, A inchangé. γ : A et Z inchangés. Un noyau trop riche en neutrons émet β⁻ ; trop pauvre, β⁺ ou capture ; très lourd, α.",
    piege:"Le mode choisi doit être celui qui existe réellement : l'équation reste équilibrée même pour un mode impossible. En β⁻ le Z du fils augmente (et non l'inverse). Le neutrino ne porte ni charge ni nombre de masse, mais il doit apparaître dans l'équation complète.",
    build:function(k, S){
      var c = k.canvas(380);
      var ns = k.select("Noyau père", NUC.map(function(n){ return [n[0], n[1] + " (Z = " + n[2] + ")"]; }), "c14");
      var ms = k.select("Mode choisi", MODES, "b-");
      var ro = k.readouts(["Noyau fils", "Bilan A", "Bilan Z", "Mode réel du père"]);
      var nt = k.note("", "ok");
      k.draw(function(){
        var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H;
        var n = NUC.filter(function(x){ return x[0] === ns.value; })[0], Z = n[2], A = n[3], real = n[4], m = ms.value;
        var d = daughter(Z, A, m), Zd = d[0], Ad = d[1];
        var sym = EL[Z], symd = EL[Zd] || "?", iso = (n[0] === "tc99m") ? "m" : "";
        var eq = A + "<sub>" + Z + "</sub>" + sym + (iso ? "ᵐ" : "") + (m === "ce" ? " + e⁻" : "") + " → " + Ad + "<sub>" + Zd + "</sub>" + symd + " + " + {a:"<sup>4</sup><sub>2</sub>He", "b-":"e⁻ + ν̄", "b+":"e⁺ + ν", ce:"ν", g:"γ"}[m];
        /* carte N-Z */
        function nice(v){ var s2 = [10,15,20,30,40,50,75,100,125,150,200]; for (var q = 0; q < s2.length; q++) if (v <= s2[q]) return s2[q]; return 200; }
        var Nmax = nice(Math.max(A - Z, A - Z - (Ad - A)) * 1.25 + 2), Zmax = nice(Z * 1.25 + 2);
        c.clear();
        var ax = S.draw.axes(c, {x0:0, x1:Nmax, y0:0, y1:Zmax, xl:"N (neutrons)", yl:"Z (protons)", stepX:Nmax / 5, stepY:Zmax / 5, l:44, r:16, t:16, b:34});
        S.draw.fn(c, ax, function(N){
          /* vallée : Z stable pour A = N + Z → résolution itérative */
          var z = N * 0.8; for (var i = 0; i < 30; i++) z = (N + z) / (1.98 + 0.0155 * Math.pow(N + z, 2/3)); return z;
        }, P.green, 2.2);
        S.draw.line(c, ax.X(0), ax.Y(0), ax.X(Math.min(Nmax, Zmax)), ax.Y(Math.min(Nmax, Zmax)), P.grey, 1, [4,4]);
        S.draw.text(c, "vallée de stabilité (approx.)", ax.L + 10, ax.T + 10, {size:11, color:P.green, align:"left"});
        S.draw.text(c, "N = Z", ax.X(Math.min(Nmax, Zmax) * 0.82), ax.Y(Math.min(Nmax, Zmax) * 0.82) - 12, {size:11, color:P.grey});
        var Np = A - Z, Nd = Ad - Zd;
        S.draw.arrow(c, ax.X(Np), ax.Y(Z), ax.X(Nd) + (Nd === Np ? 0 : (Nd > Np ? -4 : 4)), ax.Y(Zd) + (Zd === Z ? 0 : (Zd > Z ? 4 : -4)), P.red, 2);
        S.draw.dot(c, ax.X(Np), ax.Y(Z), 7, P.acc);
        S.draw.text(c, n[1], ax.X(Np) + 10, ax.Y(Z) + 12, {size:12, color:P.acc, align:"left"});
        S.draw.dot(c, ax.X(Nd), ax.Y(Zd), 6, P.red);
        S.draw.text(c, sup(Ad) + symd, ax.X(Nd) - 10, ax.Y(Zd) - 12, {size:12, color:P.red, align:"right"});
        /* bilans : à droite, fils + particule(s) ; l'électron capturé compte −1 à gauche */
        var Aright = Ad + ({a:4,"b-":0,"b+":0,ce:0,g:0})[m], Zright = Zd + ({a:2,"b-":-1,"b+":1,ce:0,g:0})[m];
        ro.set(0, sup(Ad) + symd + " (Z = " + Zd + ")");
        ro.set(1, A + " = " + Aright + (A === Aright ? " ✓" : " ✗"));
        ro.set(2, (m === "ce" ? (Z - 1) : Z) + " = " + Zright + ((m === "ce" ? Z - 1 : Z) === Zright ? " ✓" : " ✗"));
        var realName = MODES.filter(function(x){ return x[0] === real; })[0][1].split(" (")[0];
        ro.set(3, realName);
        nt.set("<b>" + eq + "</b><br>Le père est naturellement ou artificiellement " + realName + (m === real ? " : ton choix est le bon." : " : l'équation que tu as choisie est équilibrée, mais ce n'est pas la désintégration observée pour ce noyau."), m === real ? "ok" : "warn");
      });
    }
  });
})();

/* ---------- 4. Radiopharmaceutiques : demi-vie effective ---------- */
SFA.sim({
  id:"uc-c01-radiopharma", ch:"c01", tag:"Médecine",
  titre:"Radiotraceurs : demi-vie physique, biologique et effective",
  resume:"Combine T½ physique et T½ biologique : 1/T<sub>eff</sub> = 1/T<sub>p</sub> + 1/T<sub>b</sub>. Compare l'activité restante dans l'organisme.",
  but:"Choisis un radionucléide médical et fais varier la demi-vie biologique (élimination par l'organisme). Observe la décroissance physique seule et la décroissance effective, puis l'activité restante au temps choisi.",
  aRetenir:"Deux processus de premier ordre en parallèle : les constantes s'additionnent, λ<sub>eff</sub> = λ<sub>p</sub> + λ<sub>b</sub>, donc 1/T<sub>eff</sub> = 1/T<sub>p</sub> + 1/T<sub>b</sub> et T<sub>eff</sub> est toujours plus courte que la plus courte des deux demi-vies. Pour l'imagerie, on choisit un T½ de quelques heures (¹⁸F, ⁹⁹ᵐTc) ; pour une thérapie ciblée, un T½ de plusieurs jours (¹³¹I, ¹⁷⁷Lu).",
  piege:"On ne fait pas la moyenne des deux demi-vies. Si T<sub>b</sub> ≫ T<sub>p</sub>, T<sub>eff</sub> ≈ T<sub>p</sub> ; si T<sub>p</sub> ≫ T<sub>b</sub>, T<sub>eff</sub> ≈ T<sub>b</sub>. Les valeurs de T<sub>b</sub> utilisées ici sont des ordres de grandeur pédagogiques : elles varient selon l'organe et le patient.",
  build:function(k, S){
    var c = k.canvas(380);
    var tr = [
      ["tc","⁹⁹ᵐTc (γ, imagerie)", 6.01],
      ["f18","¹⁸F (β⁺, TEP)", 109.77 / 60],
      ["ga68","⁶⁸Ga (β⁺, TEP)", 67.7 / 60],
      ["i123","¹²³I (capture, imagerie thyroïde)", 13.22],
      ["tl","²⁰¹Tl (capture, cœur)", 72.9],
      ["i131","¹³¹I (β⁻, thérapie thyroïde)", 8.02 * 24],
      ["lu","¹⁷⁷Lu (β⁻, thérapie ciblée)", 6.65 * 24]
    ];
    var sel = k.select("Radiotraceur", tr.map(function(x){ return [x[0], x[1] + " — T½ = " + S.fmt(x[2], 2) + " h"]; }), "tc");
    var tb = k.slider("Demi-vie biologique T<sub>b</sub>", 0.5, 400, 0.5, 24, "h");
    var tt = k.slider("Temps après l'injection t", 0, 72, 0.5, 12, "h");
    var ro = k.readouts(["T<sub>p</sub>", "T<sub>eff</sub>", "A/A₀ physique seule", "A/A₀ effective", "Désintégrations totales (rel. au cas sans élimination)"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, T = tr.filter(function(x){ return x[0] === sel.value; })[0], Tp = T[2], Tb = tb.value, Te = Tp * Tb / (Tp + Tb), t = tt.value;
      c.clear();
      var ax = S.draw.axes(c, {x0:0, x1:72, y0:0, y1:1, xl:"t (h)", yl:"A / A₀", stepX:12, stepY:0.25});
      S.draw.fn(c, ax, function(x){ return Math.pow(0.5, x / Tp); }, P.grey, 2.2, [6,4]);
      S.draw.fn(c, ax, function(x){ return Math.pow(0.5, x / Te); }, P.acc, 2.8);
      var f1 = Math.pow(0.5, t / Tp), f2 = Math.pow(0.5, t / Te);
      S.draw.line(c, ax.X(t), ax.Y(0), ax.X(t), ax.Y(1), P.red, 1.2, [4,3]);
      S.draw.dot(c, ax.X(t), ax.Y(f1), 5, P.grey); S.draw.dot(c, ax.X(t), ax.Y(f2), 6, P.acc);
      S.draw.text(c, "physique seule (Tp)", ax.X(40), ax.Y(0.62), {size:12, color:P.grey, align:"left"});
      S.draw.text(c, "effective (Teff)", ax.X(40), ax.Y(0.42), {size:12, color:P.acc, align:"left"});
      ro.set(0, S.fmt(Tp, 2) + " h"); ro.set(1, S.fmt(Te, 2) + " h");
      ro.set(2, S.fmt(f1 * 100, 1) + " %"); ro.set(3, S.fmt(f2 * 100, 1) + " %");
      ro.set(4, S.fmt(Te / Tp * 100, 0) + " %");
      var short = Tp < 3, long = Tp > 48;
      nt.set("1/T<sub>eff</sub> = 1/" + S.fmt(Tp, 2) + " + 1/" + S.fmt(Tb, 1) + " → T<sub>eff</sub> = " + S.fmt(Te, 2) + " h. " + (Tb > 10 * Tp ? "L'élimination est lente devant la décroissance : T<sub>eff</sub> ≈ T<sub>p</sub>." : Tp > 10 * Tb ? "L'élimination domine : T<sub>eff</sub> ≈ T<sub>b</sub>." : "Les deux processus comptent.") + (short ? " T½ très court : examen à faire vite après la préparation du traceur." : "") + (long ? " T½ long : irradiation prolongée, adaptée à la thérapie plus qu'à l'imagerie." : ""), "ok");
    });
  }
});

/* ---------- 5. Défaut de masse et énergie de liaison ---------- */
(function(){
  var MH = 1.007825, MN = 1.008665, U = 931.494;
  var N = [
    ["h2","²H",1,2,2.014102],["h3","³H",1,3,3.016049],["he3","³He",2,3,3.016029],["he4","⁴He",2,4,4.002603],
    ["li6","⁶Li",3,6,6.015123],["li7","⁷Li",3,7,7.016004],["c12","¹²C",6,12,12.000000],["n14","¹⁴N",7,14,14.003074],
    ["o16","¹⁶O",8,16,15.994915],["ne20","²⁰Ne",10,20,19.992440],["fe56","⁵⁶Fe",26,56,55.934936],["ni62","⁶²Ni",28,62,61.928345],
    ["sn120","¹²⁰Sn",50,120,119.902195],["pb208","²⁰⁸Pb",82,208,207.976652],["u235","²³⁵U",92,235,235.043930],["u238","²³⁸U",92,238,238.050788]
  ];
  function be(n){ var dm = n[2] * MH + (n[3] - n[2]) * MN - n[4]; return {dm:dm, E:dm * U, a:dm * U / n[3]}; }
  SFA.sim({
    id:"uc-c01-defaut-masse", ch:"c01", tag:"Noyau",
    titre:"Défaut de masse et énergie de liaison par nucléon",
    resume:"Calcule Δm = Z·m(¹H) + N·m(n) − M(atome) puis E = Δm·c² et trace la courbe d'Aston : fusion et fission libèrent de l'énergie.",
    but:"Choisis un noyau : le défaut de masse, l'énergie de liaison totale et par nucléon sont calculés à partir des masses atomiques. Active une réaction pour voir l'énergie libérée.",
    aRetenir:"E<sub>L</sub> = Δm·c² avec 1 u = 931,5 MeV/c². La courbe E<sub>L</sub>/A passe par un maximum vers ⁵⁶Fe–⁶²Ni (≈ 8,8 MeV par nucléon) : la fusion des noyaux légers et la fission des noyaux lourds se rapprochent de ce maximum et libèrent de l'énergie.",
    piege:"Utilise des masses atomiques avec des atomes d'hydrogène ¹H (qui contiennent l'électron) pour les protons : les électrons s'annulent. Ne confonds pas énergie de liaison totale (MeV) et énergie par nucléon (MeV/nucléon). Le noyau le plus lié par nucléon n'est pas ⁴He, mais ⁶²Ni (⁵⁶Fe est le plus répandu dans la discussion).",
    build:function(k, S){
      var c = k.canvas(380);
      var ns = k.select("Noyau", N.map(function(n){ return [n[0], n[1] + " (A = " + n[3] + ")"]; }), "he4");
      var rx = k.select("Réaction de comparaison", [["none","aucune"],["dt","²H + ³H → ⁴He + n (fusion D–T)"],["pp","4 ¹H → ⁴He (bilan de la fusion de l'hydrogène)"]], "none");
      var ro = k.readouts(["Δm", "E<sub>L</sub> totale", "E<sub>L</sub>/A", "Réaction : énergie libérée"]);
      var nt = k.note("", "ok");
      k.draw(function(){
        var P = S.draw.palette, sel = N.filter(function(x){ return x[0] === ns.value; })[0], b = be(sel);
        c.clear();
        var ax = S.draw.axes(c, {x0:0, x1:250, y0:0, y1:10, xl:"A", yl:"E_L / A (MeV)", stepX:50, stepY:2});
        N.forEach(function(n){ var q = be(n); S.draw.dot(c, ax.X(n[3]), ax.Y(q.a), n === sel ? 8 : 4, n === sel ? P.red : P.acc); });
        var pts = N.slice().sort(function(p, q){ return p[3] - q[3]; });
        var ctx = c.ctx; ctx.save(); ctx.strokeStyle = P.light; ctx.lineWidth = 1.5; ctx.beginPath();
        pts.forEach(function(n, i){ var x = ax.X(n[3]), y = ax.Y(be(n).a); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke(); ctx.restore();
        S.draw.text(c, sel[1], ax.X(sel[3]), ax.Y(b.a) - 16, {size:13, color:P.red});
        S.draw.text(c, "fusion →", ax.X(25), ax.Y(2.2), {size:11, color:P.green});
        S.draw.text(c, "← fission", ax.X(215), ax.Y(5.2), {size:11, color:P.amber});
        ro.set(0, S.fmt(b.dm, 5) + " u"); ro.set(1, S.fmt(b.E, 1) + " MeV"); ro.set(2, S.fmt(b.a, 3) + " MeV");
        var q = 0, txt = "";
        if (rx.value === "dt"){ q = (2.014102 + 3.016049 - 4.002603 - MN) * U; txt = "Δm = (2,014102 + 3,016049) − (4,002603 + 1,008665) = " + S.fmt(q / U, 6) + " u → Q = " + S.fmt(q, 2) + " MeV"; }
        if (rx.value === "pp"){ q = (4 * MH - 4.002603) * U; txt = "Δm = 4×1,007825 − 4,002603 = " + S.fmt(q / U, 6) + " u → Q = " + S.fmt(q, 1) + " MeV (positons annihilés inclus)"; }
        ro.set(3, rx.value === "none" ? "—" : S.fmt(q, 2) + " MeV");
        nt.set(txt || ("E<sub>L</sub> = Δm·c² = " + S.fmt(b.dm, 5) + " u × 931,494 MeV/u = " + S.fmt(b.E, 1) + " MeV, soit " + S.fmt(b.a, 2) + " MeV par nucléon. " + (sel[3] < 20 ? "Noyau léger : la fusion peut encore le rendre plus lié." : sel[3] > 150 ? "Noyau lourd : la fission le rend plus lié par nucléon." : "Zone proche du maximum de stabilité nucléaire.")), "ok");
      });
    }
  });
})();
})();
