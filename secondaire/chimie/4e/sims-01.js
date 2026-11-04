/* Chimie 4e · bibliothèque commune C4 + chapitre 1 · Nomenclature */
window.C4 = (function(){
  var MM = {H:1,Li:7,C:12,N:14,O:16,F:19,Na:23,Mg:24,Al:27,P:31,S:32,Cl:35.5,K:39,Ca:40,Cr:52,Mn:55,Fe:56,Cu:63.5,Zn:65,Br:80,Ag:108,I:127,Ba:137,Au:197,Pb:207};
  function parseBody(s){
    var i = 0;
    function num(){ var j = i; while (i < s.length && /\d/.test(s[i])) i++; return i > j ? +s.slice(j, i) : 1; }
    function grp(){
      var o = {};
      while (i < s.length){
        var ch = s[i];
        if (ch === "("){ i++; var g = grp(); if (s[i] !== ")") throw 0; i++; var n = num(); for (var k in g) o[k] = (o[k] || 0) + g[k] * n; }
        else if (ch === ")") return o;
        else if (/[A-Z]/.test(ch)){ var el = ch; i++; while (i < s.length && /[a-z]/.test(s[i])){ el += s[i]; i++; } if (!(el in MM)) throw 0; var m = num(); o[el] = (o[el] || 0) + m; }
        else throw 0;
      }
      return o;
    }
    try { var r = grp(); if (i !== s.length || !Object.keys(r).length) return null; return r; } catch (e){ return null; }
  }
  function parse(str){
    str = String(str).replace(/\s+/g, "").replace(/[.•∙]/g, "·");
    var parts = str.split("·"), tot = {};
    for (var p = 0; p < parts.length; p++){
      var m = /^(\d*)(.*)$/.exec(parts[p]), mult = m[1] ? +m[1] : 1, r = parseBody(m[2]);
      if (!r) return null;
      for (var k in r) tot[k] = (tot[k] || 0) + r[k] * mult;
    }
    return tot;
  }
  function M(f){ var c = parse(f); if (!c) return NaN; var s = 0; for (var k in c) s += c[k] * MM[k]; return s; }
  function sub(f){ return String(f).replace(/(\d+)/g, function(m, d, off, s){ return off > 0 && /[A-Za-z)]/.test(s[off - 1]) ? "<sub>" + d + "</sub>" : d; }); }
  var SUBS = "₀₁₂₃₄₅₆₇₈₉";
  function uni(f){ return String(f).replace(/(\d+)/g, function(m, d, off, s){ return off > 0 && /[A-Za-z)]/.test(s[off - 1]) ? d.replace(/\d/g, function(x){ return SUBS[+x]; }) : d; }); }
  function sup(n, plus){ var t = (n > 1 ? String(n) : "") + (plus ? "+" : "−"); return "<sup>" + t.replace("−", "−") + "</sup>"; }
  function gcd(a, b){ return b ? gcd(b, a % b) : a; }
  function lcm(a, b){ return a * b / gcd(a, b); }
  var GAS = {H2:1,O2:1,N2:1,CO2:1,NH3:1,CH4:1,Cl2:1,C3H8:1,C4H10:1,He:1,CO:1};
  /* catalogue de réactions : r = réactifs, p = produits, [coefficient, formule] */
  var REAC = {
    eau:{nom:"synthèse de l'eau", r:[[2,"H2"],[1,"O2"]], p:[[2,"H2O"]]},
    mgo:{nom:"combustion du magnésium", r:[[2,"Mg"],[1,"O2"]], p:[[2,"MgO"]]},
    nh3:{nom:"synthèse de l'ammoniac", r:[[1,"N2"],[3,"H2"]], p:[[2,"NH3"]]},
    ch4:{nom:"combustion du méthane", r:[[1,"CH4"],[2,"O2"]], p:[[1,"CO2"],[2,"H2O"]]},
    c3h8:{nom:"combustion du propane", r:[[1,"C3H8"],[5,"O2"]], p:[[3,"CO2"],[4,"H2O"]]},
    fe:{nom:"rouille du fer", r:[[4,"Fe"],[3,"O2"]], p:[[2,"Fe2O3"]]},
    al:{nom:"oxydation de l'aluminium", r:[[4,"Al"],[3,"O2"]], p:[[2,"Al2O3"]]},
    caco3:{nom:"cuisson du calcaire", r:[[1,"CaCO3"]], p:[[1,"CaO"],[1,"CO2"]]},
    acid:{nom:"calcaire + acide chlorhydrique", r:[[1,"CaCO3"],[2,"HCl"]], p:[[1,"CaCl2"],[1,"H2O"],[1,"CO2"]]},
    zn:{nom:"zinc + acide chlorhydrique", r:[[1,"Zn"],[2,"HCl"]], p:[[1,"ZnCl2"],[1,"H2"]]},
    mghcl:{nom:"magnésium + acide chlorhydrique", r:[[1,"Mg"],[2,"HCl"]], p:[[1,"MgCl2"],[1,"H2"]]},
    fes:{nom:"fer + soufre", r:[[1,"Fe"],[1,"S"]], p:[[1,"FeS"]]},
    azide:{nom:"décomposition de l'azoture de sodium", r:[[2,"NaN3"]], p:[[2,"Na"],[3,"N2"]]},
    gluc:{nom:"combustion du glucose", r:[[1,"C6H12O6"],[6,"O2"]], p:[[6,"CO2"],[6,"H2O"]]}
  };
  function side(a){ return a.map(function(t){ return (t[0] > 1 ? t[0] + " " : "") + sub(t[1]); }).join(" + "); }
  function eq(key){ var e = REAC[key]; return side(e.r) + " → " + side(e.p); }
  function balanced(key){
    var e = REAC[key], L = {}, R = {};
    function add(o, a){ a.forEach(function(t){ var c = parse(t[1]); for (var k in c) o[k] = (o[k] || 0) + c[k] * t[0]; }); }
    add(L, e.r); add(R, e.p);
    var ks = Object.keys(L).concat(Object.keys(R)), ok = true;
    ks.forEach(function(k){ if ((L[k] || 0) !== (R[k] || 0)) ok = false; });
    return ok;
  }
  var COL = {H:"#9aa5b4", C:"#3b4656", N:"#2f56b3", O:"#c23a2f", Na:"#7b3fb0", Cl:"#2e8b57", S:"#c8a600", Fe:"#8a4b2b", Cu:"#b86a2e", Mg:"#5f8f3a", Ca:"#6a8f8f", Zn:"#6c7d90"};
  /* cadres de dessin */
  function label(c, s, x, y, col, size, align, weight){ S_.draw.text(c, s, x, y, {size:size || 12, color:col || "#2c3a4e", align:align || "center", weight:weight}); }
  var S_ = window.SFA;
  function rr(ctx, x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  /* bécher : x,y = coin haut-gauche ; frac = niveau (0..1) ; col = couleur du liquide */
  function beaker(c, x, y, w, h, frac, col, alpha){
    var ctx = c.ctx; ctx.save();
    if (frac > 0){ ctx.globalAlpha = alpha === undefined ? 0.85 : alpha; ctx.fillStyle = col; ctx.fillRect(x + 1.5, y + h * (1 - frac), w - 3, h * frac - 1.5); ctx.globalAlpha = 1; }
    ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x - 4, y - 2); ctx.lineTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y); ctx.lineTo(x + w + 4, y - 2); ctx.stroke();
    ctx.restore();
  }
  function bar(c, x, y, w, h, frac, col, bg){
    var ctx = c.ctx; ctx.save(); ctx.fillStyle = bg || "#edf0f4"; ctx.fillRect(x, y, w, h); ctx.fillStyle = col; ctx.fillRect(x, y, Math.max(0, Math.min(1, frac)) * w, h); ctx.restore();
  }
  function disc(c, x, y, r, col, txt, tcol){ S_.draw.dot(c, x, y, r, col); if (txt) S_.draw.text(c, txt, x, y, {size:Math.max(12, r * 0.9), color:tcol || "#fff"}); }
  function rnd(seed){ var s = seed || 1; return function(){ s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function sci(x, d){ return window.SFA.sci(x, d); }
  var SUP = {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻"};
  function supU(n){ return String(n).replace(/[-0-9]/g, function(ch){ return SUP[ch]; }); }
  function sciU(x, d){
    if (!isFinite(x) || x === 0) return window.SFA.fmt(x, d);
    var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
    if (Math.abs(window.SFA.fmt(m, d === undefined ? 2 : d).replace(",", ".")) >= 10){ m /= 10; e += 1; }
    return window.SFA.fmt(m, d === undefined ? 2 : d) + "·10" + supU(e);
  }
  /* étiquette qui reste dans le canvas : ancrée sur x, déplacée si elle déborde */
  function tag(c, s, x, y, col, size, align){
    var ctx = c.ctx; ctx.save(); ctx.font = "700 " + (size || 12) + "px Mulish, system-ui, sans-serif";
    var w = ctx.measureText(s).width; ctx.restore();
    var left = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
    left = Math.max(6, Math.min(c.W - 6 - w, left));
    S_.draw.text(c, s, left, y, {size:size || 12, color:col || "#2c3a4e", align:"left"});
  }
  return {MM:MM, parse:parse, M:M, sub:sub, uni:uni, sup:sup, gcd:gcd, lcm:lcm, GAS:GAS, REAC:REAC, eq:eq, balanced:balanced, side:side, COL:COL, label:label, rr:rr, tag:tag, sciU:sciU, supU:supU, beaker:beaker, bar:bar, disc:disc, rnd:rnd, sci:sci};
})();

/* ---------- ions ---------- */
C4.CAT = [
  {s:"Na", q:1, nom:"sodium"}, {s:"K", q:1, nom:"potassium"}, {s:"Ag", q:1, nom:"argent"}, {s:"NH4", q:1, nom:"ammonium", poly:1},
  {s:"H", q:1, nom:"hydrogène"},
  {s:"Mg", q:2, nom:"magnésium"}, {s:"Ca", q:2, nom:"calcium"}, {s:"Zn", q:2, nom:"zinc"}, {s:"Ba", q:2, nom:"baryum"},
  {s:"Cu", q:2, nom:"cuivre (II)"}, {s:"Fe", q:2, nom:"fer (II)"}, {s:"Fe", q:3, nom:"fer (III)"}, {s:"Al", q:3, nom:"aluminium"}, {s:"Pb", q:2, nom:"plomb (II)"}
];
C4.AN = [
  {s:"Cl", q:1, nom:"chlorure"}, {s:"OH", q:1, nom:"hydroxyde", poly:1}, {s:"NO3", q:1, nom:"nitrate", poly:1}, {s:"HCO3", q:1, nom:"hydrogénocarbonate", poly:1},
  {s:"O", q:2, nom:"oxyde"}, {s:"S", q:2, nom:"sulfure"}, {s:"SO4", q:2, nom:"sulfate", poly:1}, {s:"SO3", q:2, nom:"sulfite", poly:1}, {s:"CO3", q:2, nom:"carbonate", poly:1},
  {s:"PO4", q:3, nom:"phosphate", poly:1}
];
C4.ionHtml = function(i, plus){ return C4.sub(i.s) + C4.sup(i.q, plus); };
C4.ionUni = function(i, plus){ var t = (i.q > 1 ? ["", "", "²", "³"][i.q] : "") + (plus ? "⁺" : "⁻"); return C4.uni(i.s) + t; };
C4.salt = function(ca, an){
  var g = C4.gcd(ca.q, an.q), x = an.q / g, y = ca.q / g;
  function part(i, n){ if (n === 1) return i.s; return (i.poly ? "(" + i.s + ")" : i.s) + n; }
  var f = part(ca, x) + part(an, y), nom, note = "";
  if (ca.s === "H"){
    var ac = {Cl:"acide chlorhydrique", NO3:"acide nitrique", SO4:"acide sulfurique", SO3:"acide sulfureux", CO3:"acide carbonique", PO4:"acide phosphorique", S:"sulfure d'hydrogène (acide sulfhydrique)", O:"eau (oxyde de dihydrogène)", OH:"eau (oxyde de dihydrogène)", HCO3:"acide carbonique"};
    nom = ac[an.s];
    if (an.s === "OH"){ f = "H2O"; } if (an.s === "HCO3"){ f = "H2CO3"; }
    if (an.s === "Cl") nom += " (chlorure d'hydrogène en solution)";
    note = "Avec H⁺, la formule est celle d'un acide (ou de l'eau).";
  } else {
    var elide = /^[aeiouyéè]/i.test(ca.nom) ? "d'" : "de ";
    nom = an.nom + " " + elide + ca.nom;
  }
  if (ca.s === "NH4" && an.s === "OH"){ note = "NH₄OH n'existe pas vraiment : c'est le gaz NH₃ dissous dans l'eau (ammoniaque)."; }
  if (ca.s === "NH4" && an.s === "O"){ note = "(NH₄)₂O n'existe pas à l'état stable : ce sel est purement théorique."; }
  if (ca.s === "Ag" && an.s === "OH"){ note = "AgOH est instable : il se transforme en oxyde d'argent Ag₂O."; }
  if (ca.s === "Fe" && ca.q === 3 && an.s === "CO3"){ note = "Le carbonate de fer (III) n'existe pas : en solution on obtient plutôt Fe(OH)₃ et du CO₂."; }
  return {f:f, x:x, y:y, nom:nom, note:note, unit:function(){ return f; }};
};

SFA.sim({
  id:"c4-c01-atelier", ch:"c01", tag:"Classique",
  titre:"L'atelier de formules",
  resume:"Associe un cation et un anion : la formule, le nom et la masse molaire apparaissent.",
  but:"Choisis un cation et un anion. Compte les charges + et − : la formule est celle qui rend l'ensemble neutre.",
  aRetenir:"La formule d'un composé ionique se trouve par neutralité : (nombre de cations × charge) = (nombre d'anions × charge). Le nom se lit « anion de cation » : sulfate de calcium.",
  piege:"Les indices de la formule dépendent des charges, pas de l'ordre alphabétique. Un ion polyatomique (SO₄²⁻, OH⁻…) reste un bloc : on met des parenthèses dès qu'il en faut plus d'un, comme dans Ca(OH)₂.",
  build:function(k, S){
    var c = k.canvas(250);
    var ca = k.select("Cation", C4.CAT.map(function(i, n){ return [n, C4.ionUni(i, 1) + " — " + i.nom]; }), 6);
    var an = k.select("Anion", C4.AN.map(function(i, n){ return [n, C4.ionUni(i, 0) + " — " + i.nom]; }), 6);
    var ro = k.readouts(["Formule", "Masse molaire"]);
    var nm = k.note("", "ok");
    k.draw(function(){
      var A = C4.CAT[+ca.value], B = C4.AN[+an.value], s = C4.salt(A, B);
      c.clear();
      var n1 = s.x, n2 = s.y, W = c.W, gap = Math.min(54, (W - 40) / (n1 + n2 + 1)), r = Math.min(22, gap * 0.42);
      var tot = n1 + n2, x0 = W / 2 - (tot - 1) * gap / 2;
      var cc = A.s === "H" ? "#c23a2f" : "#1e3f8f";
      for (var i = 0; i < tot; i++){
        var isCat = i < n1, it = isCat ? A : B;
        C4.disc(c, x0 + i * gap, 70, r, isCat ? "#1e3f8f" : "#b42318", it.q + (isCat ? "+" : "−"));
        C4.label(c, C4.uni(it.s), x0 + i * gap, 70 + r + 14, "#2c3a4e", 12);
      }
      C4.label(c, n1 + " × (" + (isNaN(A.q) ? "" : "+" + A.q) + ") = +" + (n1 * A.q), W * 0.27, 130, "#1e3f8f", 14);
      C4.label(c, n2 + " × (−" + B.q + ") = −" + (n2 * B.q), W * 0.73, 130, "#b42318", 14);
      C4.label(c, "Total des charges : " + (n1 * A.q - n2 * B.q), W / 2, 165, "#2e6b55", 15);
      C4.label(c, C4.uni(s.f), W / 2, 205, "#0f1b2d", 26);
      var m = C4.M(s.f);
      ro.set(0, C4.sub(s.f)); ro.set(1, isNaN(m) ? "—" : S.fmt(m, 1) + " g/mol");
      nm.set("<b>" + s.nom + "</b>" + (s.note ? "<br>" + s.note : ""), s.note && /n'existe|instable/.test(s.note) ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id:"c4-c01-quiz", ch:"c01", tag:"Défi",
  titre:"Nom, formule : juste ou fausse ?",
  resume:"Un quiz sans fin à trois niveaux : retrouve le nom, ou chasse la formule fautive.",
  but:"Choisis un mode et un niveau, puis réponds. Les erreurs te montrent comment la bonne formule se construit.",
  aRetenir:"Pour contrôler une formule : 1) repère les ions, 2) lis leurs charges, 3) vérifie que la somme est nulle et que les indices sont les plus petits possibles.",
  piege:"Ca₂SO₄ ou Al₂SO₄ semblent « normaux » mais les charges ne s'annulent pas. Et Ca₂(SO₄)₂ est neutre, mais pas simplifié : la formule s'écrit CaSO₄.",
  build:function(k, S){
    var c = k.canvas(220), st = {score:0, n:0, q:null, done:false};
    var mode = k.seg("Mode", [["nom","Formule → nom"],["jf","Juste ou fausse ?"]], "nom", function(){ next(); });
    var lev = k.seg("Niveau", [[1,"1"],[2,"2"],[3,"3"]], 1, function(){ next(); });
    var ro = k.readouts(["Score", "Questions"]);
    var fb = k.note("Réponds à la question.", "");
    var btns = [];
    for (var i = 0; i < 4; i++) (function(i){ btns.push(k.button("…", function(){ answer(i); })); })(i);
    function pool(){
      var L = +lev.value;
      var cats = C4.CAT.filter(function(x){ return x.s !== "H" && (L === 1 ? ["Na","K","Mg","Ca","Zn"].indexOf(x.s) >= 0 : L === 2 ? x.s !== "Fe" && x.s !== "Ag" : true); });
      var ans = C4.AN.filter(function(x){ return L === 1 ? ["Cl","O","S","OH"].indexOf(x.s) >= 0 : L === 2 ? ["Cl","O","S","OH","NO3","SO4","CO3"].indexOf(x.s) >= 0 : true; });
      return {cats:cats, ans:ans};
    }
    function ok(a, b){ var s = C4.salt(a, b); return !s.note; }
    function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
    function next(){
      var p = pool(), a, b, tries = 0;
      do { a = pick(p.cats); b = pick(p.ans); tries++; } while (!ok(a, b) && tries < 60);
      var s = C4.salt(a, b);
      st.done = false; st.n0 = a; st.n1 = b; st.s = s;
      if (mode.value === "nom"){
        var opts = [s.nom], guard = 0;
        while (opts.length < 4 && guard++ < 80){
          var a2 = Math.random() < 0.5 ? a : pick(p.cats), b2 = a2 === a ? pick(p.ans) : b;
          if (!ok(a2, b2)) continue;
          var nn = C4.salt(a2, b2).nom; if (opts.indexOf(nn) < 0) opts.push(nn);
        }
        var order = [0,1,2,3].sort(function(){ return Math.random() - 0.5; });
        st.opts = order.map(function(j){ return opts[j]; }); st.good = st.opts.indexOf(s.nom);
        st.shown = s.f;
      } else {
        var wrong = [], x = s.x, y = s.y;
        function mk(xx, yy, par){
          function part(i, n, isc){ if (n === 1) return i.s; return (i.poly && par ? "(" + i.s + ")" : i.s) + n; }
          return part(a, xx) + part(b, yy);
        }
        var cand = [];
        if (x !== y) cand.push(mk(y, x, true));
        if (x !== 1 || y !== 1) cand.push(mk(1, 1, true));
        cand.push(mk(2 * x, 2 * y, true));
        if ((a.poly && x > 1) || (b.poly && y > 1)) cand.push(mk(x, y, false));
        if (a.q === b.q && x === 1) cand.push(mk(1, 2, true));
        cand = cand.filter(function(f){ return f !== s.f; });
        var isTrue = Math.random() < 0.45 || !cand.length;
        st.shown = isTrue ? s.f : pick(cand); st.isTrue = isTrue; st.opts = ["Juste", "Fausse", "", ""]; st.good = isTrue ? 0 : 1;
      }
      draw2(); k.redraw();
    }
    function answer(i){
      if (st.done || !st.opts[i]) return;
      st.done = true; st.n++;
      var good = i === st.good, s = st.s;
      if (good) st.score++;
      if (mode.value === "nom") fb.set((good ? "✅ Juste. " : "❌ Non. ") + "<b>" + C4.sub(s.f) + " = " + s.nom + "</b> (" + s.x + " × " + C4.ionHtml(st.n0, 1) + " et " + s.y + " × " + C4.ionHtml(st.n1, 0) + " : charges +" + (s.x * st.n0.q) + " et −" + (s.y * st.n1.q) + ").", good ? "ok" : "warn");
      else fb.set((good ? "✅ " : "❌ ") + "Le composé « " + s.nom + " » a pour formule <b>" + C4.sub(s.f) + "</b> (" + s.x + " × " + C4.ionHtml(st.n0, 1) + " = +" + (s.x * st.n0.q) + ", " + s.y + " × " + C4.ionHtml(st.n1, 0) + " = −" + (s.y * st.n1.q) + ")." + (st.isTrue ? "" : " La formule proposée « " + C4.sub(st.shown) + " » est fausse."), good ? "ok" : "warn");
      k.redraw();
    }
    function draw2(){ btns.forEach(function(b, i){ b.innerHTML = st.opts[i] || "·"; b.style.display = st.opts[i] ? "" : "none"; }); }
    next();
    k.draw(function(){
      c.clear();
      if (!st.s) return;
      if (mode.value === "nom"){
        C4.label(c, "Quel est le nom de", c.W / 2, 40, "#5f6b7a", 14);
        C4.label(c, C4.uni(st.shown), c.W / 2, 100, "#0f1b2d", 38);
      } else {
        C4.label(c, st.s.nom, c.W / 2, 40, "#2c3a4e", 18);
        C4.label(c, "Formule proposée :", c.W / 2, 74, "#5f6b7a", 13);
        C4.label(c, C4.uni(st.shown), c.W / 2, 124, "#0f1b2d", 38);
      }
      if (st.done) C4.label(c, "Question suivante : change de mode ou de niveau, ou clique sur « Nouvelle »", c.W / 2, 190, "#5f6b7a", 12);
      ro.set(0, st.score + " / " + st.n); ro.set(1, st.n);
    });
    k.button("Nouvelle question", function(){ next(); }, true);
  }
});

SFA.sim({
  id:"c4-c01-charges", ch:"c01", tag:"Équilibre",
  titre:"Équilibrer les charges avec les indices",
  resume:"Règle les indices x et y : la formule est correcte quand les charges s'annulent avec les plus petits entiers.",
  but:"Choisis deux ions, règle le nombre de cations (x) et d'anions (y) et observe la balance des charges.",
  aRetenir:"Neutralité : x · q(cation) = y · q(anion). On prend les plus petits entiers possibles : si x et y ont un diviseur commun, on simplifie.",
  piege:"Ne confonds pas indice et charge : dans Al₂O₃, le « 2 » compte les ions Al³⁺, il ne change pas leur charge.",
  build:function(k, S){
    var c = k.canvas(280);
    var ca = k.select("Cation", C4.CAT.filter(function(i){ return i.s !== "H"; }).map(function(i, n){ return [n, C4.ionUni(i, 1) + " — " + i.nom]; }), 5);
    var cations = C4.CAT.filter(function(i){ return i.s !== "H"; });
    var an = k.select("Anion", C4.AN.map(function(i, n){ return [n, C4.ionUni(i, 0) + " — " + i.nom]; }), 4);
    var X = k.slider("x (nombre de cations)", 1, 6, 1, 1, ""), Y = k.slider("y (nombre d'anions)", 1, 6, 1, 1, "");
    var ro = k.readouts(["Charges +", "Charges −", "Formule écrite"]);
    var nt = k.note("", "");
    k.draw(function(){
      var A = cations[+ca.value], B = C4.AN[+an.value], x = X.value, y = Y.value;
      var P = x * A.q, N = y * B.q, g = C4.gcd(x, y);
      c.clear();
      var base = 230, unit = 24, mx = Math.max(P, N, 1);
      var sc = Math.min(unit, 180 / mx);
      for (var i = 0; i < P; i++) C4.rr(c.ctx, c.W * 0.25 - 30, base - (i + 1) * sc, 60, sc - 2, 3), c.ctx.fillStyle = "#1e3f8f", c.ctx.fill();
      for (i = 0; i < N; i++) C4.rr(c.ctx, c.W * 0.75 - 30, base - (i + 1) * sc, 60, sc - 2, 3), c.ctx.fillStyle = "#b42318", c.ctx.fill();
      C4.label(c, "+" + P, c.W * 0.25, base + 18, "#1e3f8f", 16); C4.label(c, "−" + N, c.W * 0.75, base + 18, "#b42318", 16);
      C4.label(c, x + " × " + C4.ionUni(A, 1), c.W * 0.25, 20, "#1e3f8f", 13); C4.label(c, y + " × " + C4.ionUni(B, 0), c.W * 0.75, 20, "#b42318", 13);
      var neutral = P === N, simplest = g === 1;
      C4.label(c, neutral ? "=" : (P > N ? ">" : "<"), c.W / 2, 140, neutral ? "#2e6b55" : "#b42318", 36);
      var f = (x === 1 ? A.s : (A.poly ? "(" + A.s + ")" : A.s) + x) + (y === 1 ? B.s : (B.poly ? "(" + B.s + ")" : B.s) + y);
      ro.set(0, "+" + P); ro.set(1, "−" + N); ro.set(2, C4.sub(f));
      if (!neutral) nt.set("Les charges ne s'annulent pas : cette formule n'existe pas. Ajuste x ou y.", "warn");
      else if (!simplest) nt.set("Neutre, mais pas simplifié : divise x et y par " + g + ". La formule est " + C4.sub(C4.salt(A, B).f) + ".", "warn");
      else nt.set("✅ Neutre avec les plus petits indices : " + C4.sub(f) + " (" + C4.salt(A, B).nom + ").", "ok");
    });
  }
});

SFA.sim({
  id:"c4-c01-neutralisation", ch:"c01", tag:"Sels",
  titre:"Acide + base → sel + eau",
  resume:"Choisis un acide et une base : le sel formé est nommé et l'équation est équilibrée.",
  but:"Associe un acide et une base. Observe d'où viennent les ions du sel et combien de molécules d'eau se forment.",
  aRetenir:"Acide + base → sel + eau. Le sel garde le cation de la base et l'anion de l'acide. Les coefficients se trouvent en égalant le nombre de H⁺ cédés et de OH⁻ captés.",
  piege:"Le sel n'est pas « neutre » parce qu'il s'appelle sel de table : NaCl n'est que l'un des sels possibles. Et H₂O n'est pas un sel.",
  build:function(k, S){
    var c = k.canvas(250);
    var acids = [["HCl","Cl",1,"acide chlorhydrique"],["HNO3","NO3",1,"acide nitrique"],["H2SO4","SO4",2,"acide sulfurique"],["H3PO4","PO4",3,"acide phosphorique"]];
    var bases = [["NaOH","Na",1,"hydroxyde de sodium"],["KOH","K",1,"hydroxyde de potassium"],["Mg(OH)2","Mg",2,"hydroxyde de magnésium"],["Ca(OH)2","Ca",2,"hydroxyde de calcium"],["Al(OH)3","Al",3,"hydroxyde d'aluminium"]];
    var A = k.select("Acide", acids.map(function(a, i){ return [i, a[0].replace(/(\d)/g, "$1") + " — " + a[3]]; }), 2);
    var B = k.select("Base", bases.map(function(a, i){ return [i, a[0] + " — " + a[3]]; }), 3);
    var ro = k.readouts(["Sel formé", "H₂O formées"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var a = acids[+A.value], b = bases[+B.value], n = a[2], m = b[2], g = C4.gcd(n, m), xa = m / g, yb = n / g;
      var catI = C4.CAT.filter(function(i){ return i.s === b[1] && i.q === m; })[0], anI = C4.AN.filter(function(i){ return i.s === a[1]; })[0];
      var sel = C4.salt(catI, anI), water = xa * n;
      c.clear();
      function t(co, f){ return (co > 1 ? co + " " : "") + C4.uni(f); }
      var parts = [t(xa, a[0]), "+", t(yb, b[0]), "→", t(1, sel.f), "+", t(water, "H2O")];
      var s = parts.join("  "), fs = c.W < 480 ? 17 : 22;
      C4.label(c, s, c.W / 2, 40, "#0f1b2d", fs);
      C4.label(c, "acide", c.W * 0.14, 76, "#b42318", 12); C4.label(c, "base", c.W * 0.36, 76, "#1e3f8f", 12);
      /* comptage des ions H+ et OH- */
      var H = xa * n, O = yb * m;
      C4.label(c, H + " H⁺ cédés par l'acide", c.W / 2, 112, "#b42318", 15);
      C4.label(c, O + " OH⁻ apportés par la base", c.W / 2, 136, "#1e3f8f", 15);
      var cols = Math.min(H, 12);
      for (var i = 0; i < H; i++) C4.disc(c, c.W / 2 - (H - 1) * 14 + i * 28, 178, 10, "#b42318", "H+", "#fff");
      for (i = 0; i < O; i++) C4.disc(c, c.W / 2 - (O - 1) * 14 + i * 28, 214, 10, "#1e3f8f", "OH", "#fff");
      ro.set(0, C4.sub(sel.f)); ro.set(1, water);
      nt.set("<b>" + sel.nom.charAt(0).toUpperCase() + sel.nom.slice(1) + "</b> : " + H + " H⁺ + " + O + " OH⁻ → " + water + " H₂O. Les " + (xa) + " anion(s) " + C4.ionHtml(anI, 0) + " et les " + yb + " cation(s) " + C4.ionHtml(catI, 1) + " restent dans le sel.", "ok");
    });
  }
});
