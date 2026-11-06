/* Chimie BA1 · compléments · chapitre 8 : oxydoréduction, piles et électrolyse */
(function(){
var P = function(){ return SFA.draw.palette; };
var F = 96485, R = 8.314;

/* ---------- 1. Équilibrage redox par demi-équations ---------- */
function T(n, lab, atoms, q){ return {n:n, l:lab, a:atoms, q:q}; }
var RX = {
  fe:{ nom:"MnO₄⁻ + Fe²⁺ (acide)", basic:false, mult:[1,5],
    red:["MnO₄⁻ → Mn²⁺","MnO₄⁻ → Mn²⁺ + 4 H₂O","MnO₄⁻ + 8 H⁺ → Mn²⁺ + 4 H₂O","MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O"],
    ox:["Fe²⁺ → Fe³⁺","Fe²⁺ → Fe³⁺ (ni O ni H à équilibrer)","Fe²⁺ → Fe³⁺ (ni O ni H à équilibrer)","Fe²⁺ → Fe³⁺ + e⁻"],
    L:[T(1,"MnO₄⁻",{Mn:1,O:4},-1),T(5,"Fe²⁺",{Fe:1},2),T(8,"H⁺",{H:1},1)], Rt:[T(1,"Mn²⁺",{Mn:1},2),T(5,"Fe³⁺",{Fe:1},3),T(4,"H₂O",{H:2,O:1},0)] },
  cr:{ nom:"Cr₂O₇²⁻ + Fe²⁺ (acide)", basic:false, mult:[1,6],
    red:["Cr₂O₇²⁻ → 2 Cr³⁺","Cr₂O₇²⁻ → 2 Cr³⁺ + 7 H₂O","Cr₂O₇²⁻ + 14 H⁺ → 2 Cr³⁺ + 7 H₂O","Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ → 2 Cr³⁺ + 7 H₂O"],
    ox:["Fe²⁺ → Fe³⁺","Fe²⁺ → Fe³⁺ (ni O ni H à équilibrer)","Fe²⁺ → Fe³⁺ (ni O ni H à équilibrer)","Fe²⁺ → Fe³⁺ + e⁻"],
    L:[T(1,"Cr₂O₇²⁻",{Cr:2,O:7},-2),T(6,"Fe²⁺",{Fe:1},2),T(14,"H⁺",{H:1},1)], Rt:[T(2,"Cr³⁺",{Cr:1},3),T(6,"Fe³⁺",{Fe:1},3),T(7,"H₂O",{H:2,O:1},0)] },
  h2o2:{ nom:"MnO₄⁻ + H₂O₂ (acide)", basic:false, mult:[2,5],
    red:["MnO₄⁻ → Mn²⁺","MnO₄⁻ → Mn²⁺ + 4 H₂O","MnO₄⁻ + 8 H⁺ → Mn²⁺ + 4 H₂O","MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O"],
    ox:["H₂O₂ → O₂","H₂O₂ → O₂ (O déjà équilibré)","H₂O₂ → O₂ + 2 H⁺","H₂O₂ → O₂ + 2 H⁺ + 2 e⁻"],
    L:[T(2,"MnO₄⁻",{Mn:1,O:4},-1),T(5,"H₂O₂",{H:2,O:2},0),T(6,"H⁺",{H:1},1)], Rt:[T(2,"Mn²⁺",{Mn:1},2),T(5,"O₂",{O:2},0),T(8,"H₂O",{H:2,O:1},0)] },
  i:{ nom:"MnO₄⁻ + I⁻ (basique)", basic:true, mult:[2,3],
    red:["MnO₄⁻ → MnO₂","MnO₄⁻ → MnO₂ + 2 H₂O","MnO₄⁻ + 4 H⁺ → MnO₂ + 2 H₂O","MnO₄⁻ + 4 H⁺ + 3 e⁻ → MnO₂ + 2 H₂O","MnO₄⁻ + 2 H₂O + 3 e⁻ → MnO₂ + 4 OH⁻"],
    ox:["2 I⁻ → I₂","2 I⁻ → I₂ (ni O ni H)","2 I⁻ → I₂ (ni O ni H)","2 I⁻ → I₂ + 2 e⁻","2 I⁻ → I₂ + 2 e⁻ (pas de H⁺ : rien à neutraliser)"],
    L:[T(2,"MnO₄⁻",{Mn:1,O:4},-1),T(6,"I⁻",{I:1},-1),T(4,"H₂O",{H:2,O:1},0)], Rt:[T(2,"MnO₂",{Mn:1,O:2},0),T(3,"I₂",{I:2},0),T(8,"OH⁻",{O:1,H:1},-1)] },
  cl:{ nom:"Cl₂ + OH⁻ : eau de Javel (basique)", basic:true, mult:[1,1],
    red:["Cl₂ → 2 Cl⁻","Cl₂ → 2 Cl⁻ (pas d’O ni de H)","Cl₂ → 2 Cl⁻ (pas d’O ni de H)","Cl₂ + 2 e⁻ → 2 Cl⁻","Cl₂ + 2 e⁻ → 2 Cl⁻ (pas de H⁺)"],
    ox:["Cl₂ → 2 ClO⁻","Cl₂ + 2 H₂O → 2 ClO⁻","Cl₂ + 2 H₂O → 2 ClO⁻ + 4 H⁺","Cl₂ + 2 H₂O → 2 ClO⁻ + 4 H⁺ + 2 e⁻","Cl₂ + 4 OH⁻ → 2 ClO⁻ + 2 H₂O + 2 e⁻"],
    L:[T(2,"Cl₂",{Cl:2},0),T(4,"OH⁻",{O:1,H:1},-1)], Rt:[T(2,"Cl⁻",{Cl:1},-1),T(2,"ClO⁻",{Cl:1,O:1},-1),T(2,"H₂O",{H:2,O:1},0)],
    note:"Dismutation : le même élément (Cl) est oxydé ET réduit. Bilan simplifié par 2 : Cl₂ + 2 OH⁻ → Cl⁻ + ClO⁻ + H₂O." }
};
function side(arr){ var at={}, q=0; arr.forEach(function(t){ for (var e in t.a) at[e]=(at[e]||0)+t.n*t.a[e]; q+=t.n*t.q; }); return {at:at,q:q}; }
function eqs(arr){ return arr.map(function(t){ return (t.n>1?t.n+" ":"")+t.l; }).join(" + "); }
SFA.sim({
  id:"uc-c08-equilibrage-redox", ch:"c08", tag:"Équilibrage",
  titre:"Équilibrer une réaction redox, étape par étape",
  resume:"Demi-équations en milieu acide puis basique : O, H, charges, électrons, somme.",
  but:"Choisis une réaction et avance étape par étape : les termes ajoutés s'allument, et le contrôle des atomes et des charges passe du rouge au vert quand chaque demi-équation est équilibrée.",
  aRetenir:"Ordre : (1) éléments autres que O et H, (2) O avec H₂O, (3) H avec H⁺, (4) charges avec e⁻, (5) égaliser les e⁻, (6) additionner. En milieu basique, on ajoute autant de OH⁻ que de H⁺ des deux côtés puis H⁺ + OH⁻ → H₂O.",
  piege:"Équilibrer les charges avant les atomes d’O et de H. Laisser des e⁻ dans le bilan final. Écrire des H⁺ dans une réaction en milieu basique.",
  build:function(k,S){
    var c = k.canvas(400);
    var sel = k.select("Réaction",[["fe","MnO₄⁻ + Fe²⁺ (acide)"],["cr","Cr₂O₇²⁻ + Fe²⁺ (acide)"],["h2o2","MnO₄⁻ + H₂O₂ (acide)"],["i","MnO₄⁻ + I⁻ (basique)"],["cl","Cl₂ + OH⁻ (basique)"]],"fe");
    var st = k.slider("Étape",1,7,1,1,"/ 6 ou 7");
    k.button("Étape suivante ▶", function(){ st.set(Math.min(7, Math.round(st.value) + 1)); }, true);
    k.button("Recommencer", function(){ st.set(1); });
    var ro = k.readouts(["Atomes","Charges"]);
    var out = k.note("","");
    var tt = 0, lp = k.loop(function(dt, t){ tt = t; k.redraw(); }); lp.play();
    var SUBS = "₀₁₂₃₄₅₆₇₈₉", SUPS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    function toInt(sx, tab){ var s = ""; for (var i = 0; i < sx.length; i++){ var j = tab.indexOf(sx[i]); s += j >= 0 ? j : ""; } return s === "" ? 1 : parseInt(s, 10); }
    function parseTerm(t){
      var m = /^\s*(\d+)?\s*(.+?)\s*$/.exec(t), n = m[1] ? +m[1] : 1, sp = m[2], q = 0, at = {};
      var cm = /([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/.exec(sp);
      if (cm){ q = (cm[2] === "⁺" ? 1 : -1) * (cm[1] ? toInt(cm[1], SUPS) : 1); sp = sp.slice(0, cm.index); }
      if (sp === "e") return {n:n, at:{}, q:q * 1, sp:t};
      var re = /([A-Z][a-z]?)([₀-₉]*)/g, mm; while ((mm = re.exec(sp))) at[mm[1]] = (at[mm[1]] || 0) + (mm[2] ? toInt(mm[2], SUBS) : 1);
      return {n:n, at:at, q:q, sp:t};
    }
    function parseEq(str){
      str = str.replace(/\([^)]*\)/g, "").replace(/\s+×.*$/, "");
      var p = str.split("→"); if (p.length < 2) return null;
      return [p[0].split(" + "), p[1].split(" + ")].map(function(side){ return side.map(function(t){ return t.trim(); }).filter(Boolean); });
    }
    function tally(terms){ var at = {}, q = 0; terms.forEach(function(t){ var o = parseTerm(t); for (var e in o.at) at[e] = (at[e] || 0) + o.n * o.at[e]; q += o.n * o.q; }); return {at:at, q:q}; }
    function fmtq(q){ return q === 0 ? "0" : (q > 0 ? "+" + q : "−" + Math.abs(q)); }
    function eqLayout(ctx, sides, size, prevTerms){
      var parts = []; sides[0].forEach(function(t, i){ if (i) parts.push({s:" + ", sep:true}); parts.push({s:t, nw:prevTerms ? prevTerms.indexOf(t) < 0 : false}); });
      parts.push({s:"  →  ", sep:true}); sides[1].forEach(function(t, i){ if (i) parts.push({s:" + ", sep:true}); parts.push({s:t, nw:prevTerms ? prevTerms.indexOf(t) < 0 : false}); });
      ctx.font = "700 " + size + "px 'STIX Two Text', 'Cambria Math', serif"; var w = 0; parts.forEach(function(p){ p.w = ctx.measureText(p.s).width + (p.sep ? 0 : 8); w += p.w; });
      return {parts:parts, w:w};
    }
    function drawEq(sides, prevSides, x0, y, maxW, base){
      var ctx = c.ctx, size = base, prevT = prevSides ? prevSides[0].concat(prevSides[1]) : null, lay = eqLayout(ctx, sides, size, prevT);
      while (lay.w > maxW && size > 10){ size -= 0.5; lay = eqLayout(ctx, sides, size, prevT); }
      var x = x0 + (maxW - lay.w) / 2;
      lay.parts.forEach(function(p){
        if (p.nw){ ctx.save(); ctx.fillStyle = "rgba(244,197,66,.45)"; S.draw.rrect(c, x - 1, y - size * 0.75, p.w - 2, size * 1.5, 6); ctx.fill(); ctx.restore(); }
        ctx.save(); ctx.font = "700 " + size + "px 'STIX Two Text', 'Cambria Math', serif"; ctx.fillStyle = p.sep ? "#64748b" : "#0f1b2d"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(p.s, x + (p.sep ? 0 : 3), y); ctx.restore();
        x += p.w;
      });
    }
    function chips(sides, x0, y, W2){
      var ctx = c.ctx, a = tally(sides[0]), b = tally(sides[1]), els = {}, e, all = [];
      for (e in a.at) els[e] = 1; for (e in b.at) els[e] = 1;
      var ord = Object.keys(els).sort(function(p, q){ var r = {O:1, H:2}; return (r[p] || 9) - (r[q] || 9) || (p < q ? -1 : 1); });
      ord.forEach(function(e2){ all.push({l:e2, a:a.at[e2] || 0, b:b.at[e2] || 0}); });
      all.push({l:"charge", a:a.q, b:b.q, q:true});
      var cw = Math.min(86, (W2 - 4 * (all.length - 1)) / all.length), ok = true;
      all.forEach(function(ch, i){
        var good = ch.a === ch.b; if (!good) ok = false; var x = x0 + i * (cw + 4);
        ctx.save(); ctx.fillStyle = good ? "rgba(36,119,90,.12)" : "rgba(192,50,29,.12)"; ctx.strokeStyle = good ? "#24775a" : "#c0321d"; ctx.lineWidth = 1.6; S.draw.rrect(c, x, y, cw, 36, 8); ctx.fill(); ctx.stroke(); ctx.restore();
        S.draw.text(c, ch.l, x + cw / 2, y + 10, {size:10.5, color:"#64748b", weight:700});
        S.draw.text(c, (ch.q ? fmtq(ch.a) + " | " + fmtq(ch.b) : ch.a + " | " + ch.b) + (good ? " ✓" : " ✗"), x + cw / 2, y + 25, {size:11.5, color:good ? "#24775a" : "#c0321d", weight:800});
      });
      return ok;
    }
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, d = RX[sel.value], n = Math.round(st.value), B = d.basic, ph = W < 420;
      UC.bg(c, "#f6f9fc", "#ffffff");
      var titles = ["Écrire les demi-équations (éléments autres que O et H)","Équilibrer O avec H₂O","Équilibrer H avec H⁺","Équilibrer les charges avec des électrons"];
      if (B) titles.push("Milieu basique : ajouter des OH⁻ de chaque côté (H⁺ + OH⁻ → H₂O)");
      titles.push("Égaliser le nombre d’électrons échangés","Additionner : les électrons disparaissent");
      var tot = titles.length; if (n > tot) n = tot;
      S.draw.label(c, "Étape " + n + " / " + tot, 12, 18, {color:P.mat, align:"left", size:12.5});
      S.draw.text(c, titles[n - 1], 12, 42, {size:ph ? 11.5 : 13, align:"left", color:P.ink, weight:800});
      var idx = Math.min(n - 1, d.red.length - 1), halfPhase = n <= d.red.length, margin = 12, pw = W - 2 * margin;
      function panel(y, h, title, col){ ctx.save(); ctx.fillStyle = UC.rgba(col, 0.07); ctx.strokeStyle = UC.rgba(col, 0.55); ctx.lineWidth = 1.6; S.draw.rrect(c, margin, y, pw, h, 12); ctx.fill(); ctx.stroke(); ctx.restore(); S.draw.text(c, title, margin + 10, y + 14, {size:11, align:"left", color:col, weight:800}); }
      var y1 = 58, ph1 = 112;
      if (halfPhase){
        var redS = parseEq(d.red[idx]), oxS = parseEq(d.ox[idx]), pr = idx > 0 ? parseEq(d.red[idx - 1]) : null, po = idx > 0 ? parseEq(d.ox[idx - 1]) : null, okAll = true;
        panel(y1, ph1, "RÉDUCTION (gain d'électrons)", "#1f4b9e"); drawEq(redS, pr, margin + 6, y1 + 44, pw - 12, ph ? 15 : 18); var o1 = chips(redS, margin + 10, y1 + 66, pw - 20);
        panel(y1 + ph1 + 10, ph1, "OXYDATION (perte d'électrons)", "#c0321d"); drawEq(oxS, po, margin + 6, y1 + ph1 + 54, pw - 12, ph ? 15 : 18); var o2 = chips(oxS, margin + 10, y1 + ph1 + 76, pw - 20);
        okAll = o1 && o2; ro.set(0, o1 && o2 ? "équilibrés ✔" : "à équilibrer"); ro.set(1, o1 && o2 ? "équilibrées ✔" : "à équilibrer");
        out.set(n === 1 ? "On écrit chaque couple séparément et on équilibre l'élément qui change (Mn, Cr, Fe, I, Cl…)." : n < d.red.length ? "Regarde le contrôle : les cases rouges disent ce qu'il reste à équilibrer (O, puis H, puis charges)." : "Les deux demi-équations sont équilibrées en atomes et en charges (cases vertes). Reste à égaliser les électrons.", n === d.red.length ? "ok" : "");
      } else if (n === d.red.length + 1){
        var rs = parseEq(d.red[d.red.length - 1]), os = parseEq(d.ox[d.ox.length - 1]), eR = 0, eO = 0;
        rs[0].concat(rs[1]).forEach(function(t){ var o = parseTerm(t); if (o.sp.indexOf("e⁻") >= 0) eR = o.n; }); os[0].concat(os[1]).forEach(function(t){ var o = parseTerm(t); if (o.sp.indexOf("e⁻") >= 0) eO = o.n; });
        panel(y1, ph1, "RÉDUCTION × " + d.mult[0], "#1f4b9e"); drawEq(rs, null, margin + 6, y1 + 44, pw - 12, ph ? 15 : 18); S.draw.label(c, d.mult[0] + " × " + eR + " e⁻ = " + (d.mult[0] * eR) + " e⁻ captés", W / 2, y1 + 86, {color:"#1f4b9e", size:12.5});
        panel(y1 + ph1 + 10, ph1, "OXYDATION × " + d.mult[1], "#c0321d"); drawEq(os, null, margin + 6, y1 + ph1 + 54, pw - 12, ph ? 15 : 18); S.draw.label(c, d.mult[1] + " × " + eO + " e⁻ = " + (d.mult[1] * eO) + " e⁻ cédés", W / 2, y1 + ph1 + 96, {color:"#c0321d", size:12.5});
        /* électrons qui circulent de l'oxydation vers la réduction */
        for (var q = 0; q < 6; q++){ var u = ((q / 6) + tt * 0.35) % 1, ex = W - 36, ey = y1 + ph1 + 4 - (ph1 + 4) * u; S.draw.dot(c, ex, y1 + ph1 + 5 - u * (ph1 + 0), 3, "#b45309"); }
        S.draw.text(c, "e⁻", W - 20, y1 + ph1 + 5, {size:11, color:"#b45309", weight:800});
        ro.set(0, "—"); ro.set(1, d.mult[0] * eR === d.mult[1] * eO ? "e⁻ égaux (" + d.mult[0] * eR + ") ✔" : "e⁻ différents ✘");
        out.set("Les deux demi-équations échangent le même nombre d’électrons.", "");
      } else {
        var L = d.L.map(function(t){ return (t.n > 1 ? t.n + " " : "") + t.l; }), R2 = d.Rt.map(function(t){ return (t.n > 1 ? t.n + " " : "") + t.l; });
        panel(y1, 2 * ph1 + 10, "BILAN : LES ÉLECTRONS ONT DISPARU", "#24775a");
        drawEq([L, R2], null, margin + 6, y1 + 66, pw - 12, ph ? 15 : 19);
        var okF = chips([L, R2], margin + 10, y1 + 110, pw - 20);
        S.draw.text(c, B ? "Milieu basique : aucun H⁺ dans le bilan." : "Milieu acide : les H⁺ restent dans le bilan.", W / 2, y1 + 172, {size:12, color:P.ink, weight:700});
        if (d.note) S.draw.text(c, "Dismutation : Cl est oxydé ET réduit.", W / 2, y1 + 194, {size:11.5, color:P.grey, weight:700});
        var a2 = side(d.L), b2 = side(d.Rt), okA = true, els2 = {}, e3; for (e3 in a2.at) els2[e3] = 1; for (e3 in b2.at) els2[e3] = 1; for (e3 in els2) if (a2.at[e3] !== b2.at[e3]) okA = false;
        ro.set(0, okA ? "équilibrés ✔" : "✘"); ro.set(1, a2.q === b2.q ? "conservées ✔ (" + fmtq(a2.q) + ")" : "✘");
        out.set("<b>Bilan :</b> " + eqs(d.L) + " → " + eqs(d.Rt) + "<br>" + (B ? "Milieu basique : aucun H⁺ dans le bilan." : "Milieu acide : les H⁺ restent dans le bilan.") + (d.note ? "<br>" + d.note : ""), "ok");
      }
      /* frise de progression */
      for (var s = 1; s <= tot; s++){ var bx = margin + (s - 1) * (pw / tot); ctx.fillStyle = s <= n ? P.mat : "#e3e7ed"; S.draw.rrect(c, bx + 1, H - 18, pw / tot - 3, 7, 3.5); ctx.fill(); }
    });
  }
});

/* ---------- 2. Nernst et ΔG ---------- */
var MET = {Zn:{e:-0.76,n:2,ion:"Zn²⁺"},Fe:{e:-0.44,n:2,ion:"Fe²⁺"},Ni:{e:-0.26,n:2,ion:"Ni²⁺"},Pb:{e:-0.13,n:2,ion:"Pb²⁺"},Cu:{e:0.34,n:2,ion:"Cu²⁺"},Ag:{e:0.80,n:1,ion:"Ag⁺"}};
function gcd(a,b){ return b?gcd(b,a%b):a; }
SFA.sim({
  id:"uc-c08-nernst-deltag", ch:"c08", tag:"Nernst",
  titre:"Pile : E°, Nernst, ΔG et constante d’équilibre",
  resume:"Choisis anode et cathode, change les concentrations, lis E, ΔG et K. Pile de concentration incluse.",
  but:"Anode = métal oxydé, cathode = ion réduit. Fais glisser les concentrations : E suit la droite de Nernst en log Q et s’annule à l’équilibre (Q = K), où la pile est « à plat ».",
  aRetenir:"E = E° − (RT/nF) ln Q ; à 25 °C : E = E° − (0,0592/n) log Q. ΔG = −nFE ; ΔG° = −nFE° = −RT ln K, donc log K = nE°/0,0592. E &gt; 0 : spontané. Même métal des deux côtés : E° = 0, seule la dilution fait la pile.",
  piege:"Multiplier E° par les coefficients (E° est intensif). Oublier n dans ΔG = −nFE. Q = [anode]/[cathode] pour des ions de même charge (ion de l’anode au numérateur).",
  build:function(k,S){
    var c = k.canvas(300);
    var an = k.select("Anode (oxydation)",[["Zn","Zn"],["Fe","Fe"],["Ni","Ni"],["Pb","Pb"],["Cu","Cu"],["Ag","Ag"]],"Zn");
    var ca = k.select("Cathode (réduction)",[["Zn","Zn²⁺/Zn"],["Fe","Fe²⁺/Fe"],["Ni","Ni²⁺/Ni"],["Pb","Pb²⁺/Pb"],["Cu","Cu²⁺/Cu"],["Ag","Ag⁺/Ag"]],"Cu");
    var la = k.slider("log₁₀ [ion de l’anode]",-4,0.5,0.1,-1,"");
    var lc = k.slider("log₁₀ [ion de la cathode]",-4,0.5,0.1,0,"");
    var tt = k.slider("Température",273,333,5,298,"K");
    var ro = k.readouts(["E° de la pile","Q","E","ΔG","log K (298 K)"]);
    var nt = k.note("","");
    function calc(){
      var A=MET[an.value], C=MET[ca.value], n=A.n*C.n/gcd(A.n,C.n);
      var pa=n/A.n, pc=n/C.n, E0=C.e-A.e;
      var lq=pa*la.value-pc*lc.value;
      var E=E0-(R*tt.value/(n*F))*Math.LN10*lq;
      return {A:A,C:C,n:n,E0:E0,lq:lq,E:E};
    }
    k.draw(function(){
      var r=calc(); c.clear();
      var half=Math.max(0.6,Math.abs(r.E0)+0.4);
      var ax=S.draw.axes(c,{x0:-12,x1:12,y0:-half,y1:half,xl:"log Q",yl:"E (V)",stepX:4,l:52,stepY:half>1?0.5:0.2});
      S.draw.fn(c,ax,function(x){ return r.E0-(R*tt.value/(r.n*F))*Math.LN10*x; },P().acc,2.8);
      S.draw.line(c,ax.L,ax.Y(0),ax.R,ax.Y(0),P().grey,1,[3,4]);
      var x=Math.max(-12,Math.min(12,r.lq)), y=Math.max(-half,Math.min(half,r.E));
      S.draw.dot(c,ax.X(x),ax.Y(y),7,r.E>=0?P().green:P().red);
      var lk=r.n*r.E0/(R*298/F*Math.LN10);
      if (Math.abs(lk)<=12){ S.draw.dot(c,ax.X(lk),ax.Y(0),5,P().amber); S.draw.text(c,"Q = K : pile à plat",ax.X(lk),ax.Y(0)+(r.E0>0?-12:14),{size:11,color:P().amber}); }
      ro.set(0,S.fmt(r.E0,2)+" V"); ro.set(1,"10<sup>"+S.fmt(r.lq,1)+"</sup>"); ro.set(2,S.fmt(r.E,3)+" V"); ro.set(3,S.fmt(-r.n*F*r.E/1000,1)+" kJ/mol"); ro.set(4,S.fmt(lk,1));
      if (an.value===ca.value) nt.set("Pile de concentration : E° = 0, E = (RT/nF)·ln([cathode]/[anode]). C’est le principe du potentiel de membrane. n = "+r.n+" électrons.","");
      else if (r.E0<0) nt.set("E° &lt; 0 : avec ce choix d’électrodes, la réaction écrite est défavorable dans les conditions standard ; échange anode et cathode. n = "+r.n+" électrons.","warn");
      else { var pa=r.n/r.A.n, pc=r.n/r.C.n; var cf=function(x){ return x>1?x+" ":""; };
        nt.set("Bilan : "+cf(pa)+an.value+" + "+cf(pc)+MET[ca.value].ion+" → "+cf(pa)+MET[an.value].ion+" + "+cf(pc)+ca.value+" ; n = "+r.n+" électrons échangés. "+(r.E>0?"E &gt; 0 : spontanée, ΔG &lt; 0.":"E ≤ 0 : pour ces concentrations, la réaction va dans l’autre sens."),r.E>0?"ok":"warn"); }
    });
    k.note("E° (V, 25 °C) : Zn²⁺/Zn −0,76 ; Fe²⁺/Fe −0,44 ; Ni²⁺/Ni −0,26 ; Pb²⁺/Pb −0,13 ; Cu²⁺/Cu +0,34 ; Ag⁺/Ag +0,80. E° pris constant avec T (modèle simplifié). F = 96 485 C/mol.","");
  }
});

/* ---------- 3. Dosage redox ---------- */
SFA.sim({
  id:"uc-c08-dosage-redox", ch:"c08", tag:"Dosage",
  titre:"Dosage du fer(II) par le permanganate ou le dichromate",
  resume:"Courbe E contre V, point équivalent, calcul de la concentration inconnue.",
  but:"Verse le titrant goutte à goutte (curseur). Avant l’équivalence E suit le couple Fe³⁺/Fe²⁺, après l’équivalence le couple du titrant. Le point équivalent donne la concentration de Fe²⁺.",
  aRetenir:"MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O : n(Fe²⁺) = 5 n(MnO₄⁻). Avec Cr₂O₇²⁻ : n(Fe²⁺) = 6 n(Cr₂O₇²⁻). À la demi-équivalence E = E°(Fe³⁺/Fe²⁺). Le permanganate violet est son propre indicateur.",
  piege:"Oublier le facteur 5 (ou 6). L’équivalence n’est pas à E = moyenne simple des E° : E<sub>éq</sub> = (E°₁ + 5E°₂)/6 pour MnO₄⁻ à pH 0 : pondérée par le nombre d’électrons (valeur simplifiée pour Cr₂O₇²⁻).",
  build:function(k,S){
    var c = k.canvas(300);
    var ti = k.seg("Titrant",[["mn","KMnO₄ 0,0200 mol/L"],["cr","K₂Cr₂O₇ 0,0167 mol/L"]],"mn");
    var cf = k.slider("[Fe²⁺] à doser",0.02,0.20,0.01,0.10,"mol/L");
    var v0 = k.slider("Volume de la prise",10,50,5,20,"mL");
    var vv = k.slider("Volume de titrant versé",0,60,0.5,10,"mL");
    var ro = k.readouts(["Équivalence V<sub>éq</sub>","E à ce volume","[Fe²⁺] déduite (V<sub>éq</sub>)"]);
    var nt = k.note("","");
    function calc(V){
      var mn=ti.value==="mn", ct=mn?0.0200:1/60, nu=mn?5:6, n0=cf.value*v0.value/1000, nt_=ct*V/1000, Ve=n0/nu/ct*1000;
      var E, Vt=(v0.value+V)/1000;
      if (V<=0) return {E:null,Ve:Ve,nu:nu};
      var nFe3=Math.min(nt_*nu,n0), nFe2=n0-nFe3;
      if (nt_<n0/nu-1e-12){ E=0.77+0.05916*Math.log10(nFe3/nFe2); }
      else if (Math.abs(nt_-n0/nu)<1e-12){ E=mn?(0.77+5*1.51)/6:(0.77+6*1.33)/7; }
      else if (mn){ var ex=nt_-n0/nu, red=n0/nu; E=1.51+0.05916/5*Math.log10(ex/red); }
      else { var ex2=nt_-n0/nu, cr3=2*n0/nu/Vt, cc=ex2/Vt; E=1.33+0.05916/6*Math.log10(cc/(cr3*cr3)); }
      return {E:E,Ve:Ve,nu:nu};
    }
    k.draw(function(){
      c.clear(); var r0=calc(0), Ve=r0.Ve, Vmax=Math.max(60,Ve*1.6);
      var ax=S.draw.axes(c,{x0:0,x1:Vmax,y0:0.5,y1:1.6,xl:"V titrant (mL)",yl:"E (V)",l:50,stepY:0.2});
      S.draw.fn(c,ax,function(x){ var r=calc(Math.max(x,1e-6)); return r.E; },P().acc,2.8);
      S.draw.line(c,ax.X(Ve),ax.B,ax.X(Ve),ax.T,P().amber,1.6,[5,4]);
      S.draw.text(c,"équivalence "+S.fmt(Ve,1)+" mL",ax.X(Ve)+6,ax.T+10,{size:11,color:P().amber,align:"left"});
      var r=calc(vv.value);
      if (r.E!==null){ S.draw.dot(c,ax.X(vv.value),ax.Y(Math.max(0.5,Math.min(1.6,r.E))),7,P().red); }
      var past=vv.value>Ve+0.05;
      var mnT=ti.value==="mn", col=mnT?(past?"#b5179e":"#e8d9a8"):(vv.value>0?"#2e6b55":"#e8d9a8");
      var ctx=c.ctx; ctx.save(); ctx.fillStyle=col; ctx.globalAlpha=0.55; ctx.fillRect(c.W-70,c.H-170,46,58); ctx.restore();
      ctx.save(); ctx.strokeStyle="#13233a"; ctx.lineWidth=2; ctx.strokeRect(c.W-70,c.H-180,46,68); ctx.restore();
      /* KMnO₄ : violet persistant après l'équivalence ; K₂Cr₂O₇ : le vert de Cr³⁺ apparaît dès le début et l'excès orangé se voit mal, d'où un indicateur redox */
      S.draw.text(c,mnT?(past?"violet persistant":"jaune pâle"):(past?"virage peu visible : indicateur redox":(vv.value>0?"vert (Cr³⁺ formé)":"jaune pâle")),c.W-47,c.H-98,{size:11});
      ro.set(0,S.fmt(Ve,2)+" mL"); ro.set(1,r.E===null?"—":S.fmt(r.E,3)+" V");
      var nu=r.nu, ct=ti.value==="mn"?0.0200:1/60;
      ro.set(2,S.fmt(nu*ct*Ve/v0.value,3)+" mol/L");
      nt.set(Math.abs(vv.value-Ve)<=0.3?"Tu es à l’équivalence : saut de potentiel vertical.":past?"Après l’équivalence : titrant en excès, E suit le couple du titrant.":"Avant l’équivalence : mélange Fe²⁺/Fe³⁺, E varie lentement (tampon redox).","");
    });
    k.note("Modèle idéal : milieu à pH 0 (H⁺ = 1 mol/L), E° = Fe³⁺/Fe²⁺ 0,77 V ; MnO₄⁻/Mn²⁺ 1,51 V ; Cr₂O₇²⁻/Cr³⁺ 1,33 V ; activités ignorées. La courbe réelle est plus arrondie.","");
  }
});

/* ---------- 4. Électrolyse et Faraday ---------- */
var ELY = {
  cu:{nom:"CuSO₄(aq), électrodes inertes",cat:{p:"Cu(s)",z:2,M:63.55,solid:true,why:"Cu²⁺ (E° = +0,34 V) est réduit avant H₂O (≈ −0,41 V à pH 7)."},an:{p:"O₂(g)",z:4,M:32.0,why:"H₂O est oxydée (SO₄²⁻ est déjà au degré maximal et ne réagit pas)."}},
  ag:{nom:"AgNO₃(aq), électrodes inertes",cat:{p:"Ag(s)",z:1,M:107.87,solid:true,why:"Ag⁺ (E° = +0,80 V) est réduit en premier."},an:{p:"O₂(g)",z:4,M:32.0,why:"H₂O est oxydée ; NO₃⁻ ne réagit pas."}},
  nacl:{nom:"NaCl(aq) concentré, électrodes inertes",cat:{p:"H₂(g)",z:2,M:2.016,why:"Na⁺ (E° = −2,71 V) n’est pas réduit dans l’eau : c’est H₂O qui l’est, d’où OH⁻."},an:{p:"Cl₂(g)",z:2,M:70.9,why:"Cl⁻ est oxydé à la place de H₂O (surtension sur O₂) : procédé chlore-soude."}},
  eau:{nom:"H₂SO₄ dilué (électrolyse de l’eau)",cat:{p:"H₂(g)",z:2,M:2.016,why:"Réduction de H⁺ (ou de H₂O)."},an:{p:"O₂(g)",z:4,M:32.0,why:"Oxydation de H₂O : 2 H₂O → O₂ + 4 H⁺ + 4 e⁻."}},
  nacl_f:{nom:"NaCl fondu",cat:{p:"Na(l)",z:1,M:22.99,solid:true,why:"Sans eau, Na⁺ est le seul cation : il est réduit."},an:{p:"Cl₂(g)",z:2,M:70.9,why:"Cl⁻ est le seul anion."}}
};
SFA.sim({
  id:"uc-c08-electrolyse-faraday", ch:"c08", tag:"Électrolyse",
  titre:"Électrolyse : qui réagit, combien se forme ?",
  resume:"Compétition ion contre eau à chaque électrode, puis masses et volumes par la loi de Faraday.",
  but:"Choisis l’électrolyte, l’intensité et la durée. La simulation désigne les produits et calcule charge, quantité d’électrons, masses et volumes de gaz.",
  aRetenir:"Q = I·t ; n(e⁻) = Q/F ; n(produit) = n(e⁻)/z, avec z = nombre d’électrons par molécule ou atome formé (Cu : 2 ; Ag : 1 ; H₂ : 2 ; O₂ : 4 ; Cl₂ : 2). Gaz : V = nRT/P.",
  piege:"Confondre mol de e⁻ et mol de produit. Oublier que dans l’eau Na⁺ n’est pas réduit. z(O₂) = 4, pas 2. Convertir les minutes en secondes.",
  build:function(k,S){
    var c = k.canvas(260);
    var el = k.select("Électrolyte",[["cu","CuSO₄(aq)"],["ag","AgNO₃(aq)"],["nacl","NaCl(aq) concentré"],["eau","H₂SO₄ dilué (eau)"],["nacl_f","NaCl fondu"]],"cu");
    var I = k.slider("Intensité I",0.1,10,0.1,2,"A");
    var t = k.slider("Durée t",1,180,1,30,"min");
    var ro = k.readouts(["Charge Q","n(e⁻)","Cathode (−)","Anode (+)"]);
    var nt = k.note("","");
    k.draw(function(){
      var d=ELY[el.value]; c.clear(); var ctx=c.ctx;
      var Q=I.value*t.value*60, ne=Q/F;
      var nc=ne/d.cat.z, na=ne/d.an.z;
      function fmtp(p,n,Mm,solid){ if (solid) return S.fmt(n*Mm,n*Mm<1?3:2)+" g de "+p; var v=n*0.0821*298; return S.fmt(v,v<1?3:2)+" L de "+p+" (25 °C, 1 atm)"; }
      ro.set(0,S.fmt(Q,0)+" C"); ro.set(1,S.sci(ne,3)+" mol");
      ro.set(2,fmtp(d.cat.p,nc,d.cat.M,d.cat.solid)); ro.set(3,fmtp(d.an.p,na,d.an.M,d.an.solid));
      /* schéma */
      var bx=c.W/2-110, by=40, bw=220, bh=170;
      ctx.save(); ctx.strokeStyle="#13233a"; ctx.lineWidth=2; ctx.strokeRect(bx,by,bw,bh); ctx.fillStyle="rgba(30,63,143,.10)"; ctx.fillRect(bx+1,by+30,bw-2,bh-31); ctx.restore();
      ctx.save(); ctx.fillStyle="#3b4757"; ctx.fillRect(bx+45,by-20,12,150); ctx.fillRect(bx+bw-57,by-20,12,150); ctx.restore();
      if (d.cat.solid){ var th=Math.min(14,2+nc*d.cat.M*3); ctx.save(); ctx.fillStyle="#b87333"; if (el.value==="ag") ctx.fillStyle="#c0c0c0"; if (el.value==="nacl_f") ctx.fillStyle="#9aa5b1"; ctx.fillRect(bx+45-th,by+60,th,60); ctx.restore(); }
      var nb=Math.min(14,Math.round(Math.log10(1+na*50)*6)); for (var i=0;i<nb;i++){ S.draw.dot(c,bx+bw-51+((i*37)%30)-15,by+110-((i*23)%80),3+(i%3),"rgba(30,63,143,.45)"); }
      if (!d.cat.solid){ var nb2=Math.min(14,Math.round(Math.log10(1+nc*50)*6)); for (i=0;i<nb2;i++){ S.draw.dot(c,bx+51+((i*29)%30)-15,by+110-((i*31)%80),3+(i%3),"rgba(180,35,24,.45)"); } }
      S.draw.text(c,"cathode (−) : réduction",bx+51,by-30,{size:11,color:P().red}); S.draw.text(c,"anode (+) : oxydation",bx+bw-51,by-30,{size:11,color:P().acc});
      S.draw.text(c,d.nom,c.W/2,by+bh+22,{size:12,color:P().ink});
      nt.set("<b>Cathode :</b> "+d.cat.why+"<br><b>Anode :</b> "+d.an.why,"");
    });
  }
});

/* ---------- 5. Potentiel de membrane (Nernst et Goldman) ---------- */
SFA.sim({
  id:"uc-c08-potentiel-membrane", ch:"c08", tag:"Nernst en biologie",
  titre:"Potentiel de membrane : Nernst et Goldman",
  resume:"Pile de concentration biologique : E des ions K⁺, Na⁺, Cl⁻, Ca²⁺ et potentiel de repos selon les perméabilités.",
  but:"Fais varier la kaliémie extracellulaire et les perméabilités de la membrane. Compare les potentiels d’équilibre de chaque ion et le potentiel de repos qui en résulte.",
  aRetenir:"E<sub>ion</sub> = (RT/zF) ln([ion]<sub>ext</sub>/[ion]<sub>int</sub>) (≈ 61,5/z·log₁₀ à 37 °C, en mV). Potentiel de repos (Goldman) = moyenne des E<sub>ion</sub> pondérée par les perméabilités : proche de E<sub>K</sub> au repos car P(K) domine. Hyperkaliémie : E<sub>K</sub> monte, la cellule se dépolarise.",
  piege:"Nernst : z porte son signe (Cl⁻ : z = −1). On met l’extérieur au numérateur pour la convention « potentiel intérieur − extérieur ». Un ion à l’équilibre de Nernst n’a plus de flux net, mais le potentiel de repos réel n’est pas à l’équilibre de chaque ion.",
  build:function(k,S){
    var c = k.canvas(310);
    var ko = k.slider("[K⁺] extracellulaire",1,20,0.5,4.5,"mmol/L");
    var T = k.slider("Température",290,315,1,310,"K");
    var pna = k.slider("P(Na⁺) relative à P(K⁺) = 1",0.01,1,0.01,0.04,"");
    var pcl = k.slider("P(Cl⁻) relative à P(K⁺) = 1",0,1,0.05,0.45,"");
    var ro = k.readouts(["E<sub>K</sub>","E<sub>Na</sub>","E<sub>Cl</sub>","E<sub>Ca</sub>","Potentiel de repos"]);
    var ION={K:{i:140,z:1,c:P().acc},Na:{i:12,z:1,c:P().amber},Cl:{i:4,z:-1,c:P().green},Ca:{i:0.0001,z:2,c:P().violet}};
    var oute={Na:145,Cl:110,Ca:2};
    k.draw(function(){
      c.clear(); var rt=R*T.value/F*1000, ctx=c.ctx;
      var o={K:ko.value,Na:145,Cl:110,Ca:2}, E={};
      for (var n in ION) E[n]=rt/ION[n].z*Math.log(o[n]/ION[n].i);
      var Vr=rt*Math.log((ko.value+pna.value*145+pcl.value*4)/(140+pna.value*12+pcl.value*110));
      var ax=S.draw.axes(c,{x0:0,x1:5,y0:-120,y1:150,yl:"mV",stepX:100,hideZero:true,stepY:30,l:50});
      var names=["K⁺","Na⁺","Cl⁻","Ca²⁺"], keys=["K","Na","Cl","Ca"];
      ctx.save(); ctx.font="700 12px Mulish, system-ui"; ctx.textAlign="center";
      keys.forEach(function(kk,j){ var x0=ax.X(j+0.2), x1=ax.X(j+0.8); ctx.fillStyle=ION[kk].c; var y=ax.Y(E[kk]), y0=ax.Y(0); ctx.fillRect(x0,Math.min(y,y0),x1-x0,Math.abs(y-y0)); ctx.fillStyle="#0f1b2d"; ctx.fillText(names[j]+" "+S.fmt(E[kk],0),(x0+x1)/2,E[kk]>=0?y-6:y+16); });
      ctx.restore();
      S.draw.line(c,ax.L,ax.Y(Vr),ax.R,ax.Y(Vr),P().red,2.4,[6,4]);
      S.draw.text(c,"repos : "+S.fmt(Vr,0)+" mV",ax.R-8,ax.Y(Vr)-10,{align:"right",size:12,color:P().red});
      ro.set(0,S.fmt(E.K,1)+" mV"); ro.set(1,S.fmt(E.Na,1)+" mV"); ro.set(2,S.fmt(E.Cl,1)+" mV"); ro.set(3,S.fmt(E.Ca,0)+" mV"); ro.set(4,S.fmt(Vr,1)+" mV");
    });
    k.note("Valeurs typiques (mmol/L, int. / ext.) : K⁺ 140 / 4,5 ; Na⁺ 12 / 145 ; Cl⁻ 4 / 110 ; Ca²⁺ 0,0001 / 2. Le curseur de [K⁺] ext. part de 4,5 (normale). Modèle de Goldman à champ constant, pompes ignorées (leur rôle est de maintenir les gradients).","");
  }
});
})();
