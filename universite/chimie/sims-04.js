/* Chimie BA1 · c04 · Liquides, solides et forces intermoléculaires — contenu SFA original */
(function(){
var R = 8.314, NA = 6.022e23, G = 9.81;
function rot(p, a, b){
  var x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
  return [x, y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
}

/* ---------- 1. Forces intermoléculaires et températures d'ébullition ---------- */
var HYD = {
  "14":{nom:"Groupe 14 (CH₄ … SnH₄)", mol:["CH₄","SiH₄","GeH₄","SnH₄"], t:[-161.5,-111.9,-88.5,-52], hb:false},
  "15":{nom:"Groupe 15 (NH₃ … SbH₃)", mol:["NH₃","PH₃","AsH₃","SbH₃"], t:[-33.3,-87.7,-62.5,-17], hb:true},
  "16":{nom:"Groupe 16 (H₂O … H₂Te)", mol:["H₂O","H₂S","H₂Se","H₂Te"], t:[100,-60.3,-41.3,-2], hb:true},
  "17":{nom:"Groupe 17 (HF … HI)", mol:["HF","HCl","HBr","HI"], t:[19.5,-85,-66.4,-35.4], hb:true}
};
var BARS = {
  chaines:{titre:"Alcanes linéaires CₙH₂ₙ₊₂ : London ↑ avec la taille", items:[["CH₄",-161.5],["C₂H₆",-88.6],["C₃H₈",-42.1],["C₄H₁₀",-0.5],["C₅H₁₂",36.1],["C₆H₁₄",68.7],["C₇H₁₆",98.4],["C₈H₁₈",125.7]], note:"Chaque CH₂ ajoute de la surface de contact : les forces de London augmentent et T<sub>éb</sub> monte (de ≈ 20–35 K par CH₂ ici)."},
  isomeres:{titre:"Isomères de C₅H₁₂ et C₆H₁₄ : forme et surface de contact", items:[["pentane",36.1],["2-méthylbutane",27.8],["2,2-diméthylpropane",9.5],["hexane",68.7],["3-méthylpentane",63.3],["2-méthylpentane",60.3],["2,3-diméthylbutane",58.0],["2,2-diméthylbutane",49.7]], note:"Même formule, même masse : la ramification rend la molécule plus compacte, la surface de contact diminue, les forces de London baissent et T<sub>éb</sub> chute."},
  memeM:{titre:"Masses voisines (≈ 58–60 g/mol), forces différentes", items:[["butane (London)",-0.5],["propanone (dipôle–dipôle)",56],["propan-1-ol (liaison H)",97],["acide éthanoïque (liaisons H, dimère)",118]], note:"À masse comparable, l'ordre est fixé par la nature des forces : London &lt; dipôle–dipôle &lt; liaison hydrogène (un acide carboxylique forme des dimères stables)."}
};
SFA.sim({
  id:"uc-c04-forces-ebullition", ch:"c04", tag:"Forces",
  titre:"Forces intermoléculaires et température d'ébullition",
  resume:"Hydrures du groupe 14 à 17, chaînes alcanes, isomères, masses voisines : la température d'ébullition révèle la force des interactions.",
  but:"Choisis une série. Pour les hydrures, observe l'écart entre le premier hydrure et la tendance linéaire des suivants : il mesure l'effet de la liaison hydrogène (NH₃, H₂O, HF).",
  aRetenir:"London (toutes les molécules, croît avec la taille et la surface de contact) &lt; dipôle–dipôle &lt; liaison hydrogène (X–H···Y avec X, Y = F, O, N). Dans un groupe sans liaison hydrogène, T<sub>éb</sub> croît avec M ; NH₃, H₂O et HF sortent de la série à cause des liaisons H.",
  piege:"H₂O bout à 100 °C alors que la tendance des hydrures suivants prévoit ≈ −90 °C, mais HF (19,5 °C) est plus bas que H₂O bien que sa liaison H soit plus forte : il n'a que 2 liaisons H par molécule (contre 4 pour H₂O, 2 donneurs et 2 accepteurs). Le nombre de liaisons H compte autant que leur force.",
  build:function(k, S){
    var c = k.canvas(360);
    var md = k.seg("Série", [["hyd","Hydrures"],["chaines","Chaînes"],["isomeres","Isomères"],["memeM","Même M"]], "hyd");
    var gp = k.seg("Groupe (hydrures)", [["14","14"],["15","15"],["16","16"],["17","17"]], "16");
    var ex = k.toggle("Tendance extrapolée sans liaison H (périodes 3–5)", true);
    var ro = k.readouts(["T<sub>éb</sub> du 1<sup>er</sup> hydrure", "Tendance extrapolée", "Excès (liaisons H)"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H;
      c.clear();
      if (md.value === "hyd"){
        var ax = S.draw.axes(c, {x0:1.6, x1:5.4, y0:-180, y1:120, xl:"période", yl:"T éb (°C)", stepX:1, stepY:50});
        var cols = {"14":P.green, "15":P.acc, "16":P.red, "17":P.amber};
        Object.keys(HYD).forEach(function(g){
          var h = HYD[g], on = g === gp.value;
          ctx.save(); ctx.strokeStyle = cols[g]; ctx.globalAlpha = on ? 1 : 0.28; ctx.lineWidth = on ? 3 : 1.5; ctx.beginPath();
          h.t.forEach(function(t, i){ var x = ax.X(2 + i), y = ax.Y(t); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke(); ctx.restore();
          h.t.forEach(function(t, i){ ctx.globalAlpha = on ? 1 : 0.3; S.draw.dot(c, ax.X(2 + i), ax.Y(t), on ? 6 : 3.5, cols[g]); ctx.globalAlpha = 1; if (on) S.draw.text(c, h.mol[i], ax.X(2 + i), ax.Y(t) - 14, {size:12, color:cols[g]}); });
        });
        var h = HYD[gp.value], x = [3, 4, 5], y = h.t.slice(1), mx = 4, my = (y[0] + y[1] + y[2]) / 3;
        var sl = ((x[0] - mx) * (y[0] - my) + (x[1] - mx) * (y[1] - my) + (x[2] - mx) * (y[2] - my)) / 2, ex2 = my + sl * (2 - mx);
        if (ex.value){ S.draw.line(c, ax.X(2), ax.Y(ex2), ax.X(5), ax.Y(my + sl * 1), P.grey, 1.8, [6,4]); S.draw.dot(c, ax.X(2), ax.Y(ex2), 5, "#fff"); c.ctx.strokeStyle = P.grey; c.ctx.beginPath(); c.ctx.arc(ax.X(2), ax.Y(ex2), 5, 0, 7); c.ctx.stroke(); }
        ro.set(0, S.fmt(h.t[0], 1) + " °C"); ro.set(1, S.fmt(ex2, 0) + " °C"); ro.set(2, S.fmt(h.t[0] - ex2, 0) + " K");
        nt.set(h.hb ? ("Le premier hydrure bout " + S.fmt(h.t[0] - ex2, 0) + " K au-dessus de la tendance des suivants : liaison hydrogène entre molécules. " + (gp.value === "15" ? "NH₃ : une seule paire libre, un seul doublet pour 3 H : peu de liaisons H par molécule." : gp.value === "17" ? "HF : forte liaison H mais chaînes de molécules seulement." : "H₂O : 2 donneurs et 2 accepteurs, réseau tridimensionnel, excès maximal.")) : "CH₄ n'a pas de liaison H : la tendance extrapolée prédit correctement sa T<sub>éb</sub> (écart " + S.fmt(Math.abs(h.t[0] - ex2), 0) + " K).", h.hb ? "warn" : "ok");
      } else {
        var B = BARS[md.value], n = B.items.length, left = Math.min(200, W * 0.38), top = 30, bh = Math.min(26, (H - top - 10) / n - 6), tmin = -180, tmax = 140;
        S.draw.text(c, B.titre, W / 2, 14, {size:12, color:P.ink});
        var mn = 1e9, mx2 = -1e9;
        B.items.forEach(function(it, i){
          var y = top + i * (bh + 6) + bh / 2, w = (it[1] - tmin) / (tmax - tmin) * (W - left - 70);
          S.draw.text(c, it[0], left - 8, y, {size:11, align:"right"});
          ctx.fillStyle = it[1] < 0 ? "#9fb0c8" : "#e9a3a3"; ctx.fillRect(left, y - bh / 2, Math.max(2, w), bh);
          S.draw.text(c, S.fmt(it[1], 1) + " °C", left + Math.max(2, w) + 6, y, {size:11, align:"left", color:P.ink});
          mn = Math.min(mn, it[1]); mx2 = Math.max(mx2, it[1]);
        });
        ro.set(0, "—"); ro.set(1, "—"); ro.set(2, S.fmt(mx2 - mn, 0) + " K entre extrêmes");
        nt.set(B.note, "ok");
      }
    });
  }
});

/* ---------- 2. Mailles cristallines ---------- */
var MAILLE = {
  cs:{nom:"cubique simple", Z:1, N:6, comp:Math.PI / 6, a:function(r){ return 2 * r; }, pts:[[0,0,0]]},
  cc:{nom:"cubique centrée", Z:2, N:8, comp:Math.PI * Math.sqrt(3) / 8, a:function(r){ return 4 * r / Math.sqrt(3); }, pts:[[0,0,0],[.5,.5,.5]]},
  cfc:{nom:"cubique à faces centrées", Z:4, N:12, comp:Math.PI * Math.sqrt(2) / 6, a:function(r){ return 2 * Math.sqrt(2) * r; }, pts:[[0,0,0],[.5,.5,0],[.5,0,.5],[0,.5,.5]]}
};
var MET = [["Po","polonium (cs)","cs",168,209],["Na","sodium (cc)","cc",186,22.99],["Fe","fer α (cc)","cc",124,55.845],["Al","aluminium (cfc)","cfc",143,26.98],["Cu","cuivre (cfc)","cfc",128,63.546],["Au","or (cfc)","cfc",144,196.97]];
SFA.sim({
  id:"uc-c04-mailles-cubiques", ch:"c04", tag:"Solides",
  titre:"Mailles cubiques : atomes par maille, compacité et masse volumique",
  resume:"Cubique simple, centrée ou à faces centrées : compte les atomes par maille, calcule la compacité et la masse volumique à partir du rayon.",
  but:"Choisis une maille (ou un métal) et ajuste le rayon atomique et la masse molaire. La maille tourne à la souris : repère les atomes aux sommets (1/8), au centre (1) et sur les faces (1/2).",
  aRetenir:"Z = 1 (cs), 2 (cc), 4 (cfc). Contacts selon : arête (cs, a = 2r), grande diagonale (cc, a = 4r/√3), diagonale de face (cfc, a = 2√2·r). Compacité = Z·(4/3)πr³/a³ : 52,4 % (cs), 68,0 % (cc), 74,0 % (cfc). ρ = Z·M/(N<sub>A</sub>·a³).",
  piege:"Un atome de sommet appartient à 8 mailles (1/8), un atome de face à 2 (1/2). Convertis les pm en cm avant de calculer ρ : 1 pm = 10⁻¹⁰ cm. Le modèle des sphères dures donne des rayons « effectifs » : le calcul de ρ à partir du rayon peut s'écarter de quelques % de la valeur mesurée.",
  build:function(k, S){
    var c = k.canvas(360);
    var st = {a:0.6, b:0.4, lx:null, ly:null};
    var tp = k.seg("Maille", [["cs","simple"],["cc","centrée"],["cfc","faces centrées"]], "cfc");
    var rr, mm;
    var ps = k.select("Préréglage métal", MET.map(function(m){ return [m[0], m[0] + " — " + m[1]]; }), "Cu", function(v){
      var m = MET.filter(function(x){ return x[0] === v; })[0]; tp.set(m[2]); rr.set(m[3]); mm.set(m[4]);
    });
    rr = k.slider("Rayon atomique r", 100, 250, 1, 128, "pm");
    mm = k.slider("Masse molaire M", 6, 210, 0.5, 63.5, "g/mol");
    var ro = k.readouts(["Atomes par maille Z", "Coordinence", "Arête a", "Compacité", "Masse volumique"]);
    var nt = k.note("", "ok");
    c.pointer(function(type, p){
      if (type === "down"){ st.lx = p.x; st.ly = p.y; }
      if (type === "drag" && st.lx != null){ st.a += (p.x - st.lx) * 0.012; st.b += (p.y - st.ly) * 0.012; st.lx = p.x; st.ly = p.y; k.redraw(); }
      if (type === "up") st.lx = null;
    });
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, M = MAILLE[tp.value], r = rr.value, a = M.a(r);
      c.clear();
      var sc = Math.min(W, H) * 0.42;
      var corners = []; for (var i = 0; i < 8; i++) corners.push([(i & 1) - 0.5, ((i >> 1) & 1) - 0.5, ((i >> 2) & 1) - 0.5]);
      var edges = [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
      function pr(q){ var t = rot(q, st.a, st.b); return [W / 2 + t[0] * sc, H / 2 - t[1] * sc, t[2]]; }
      var cp = corners.map(pr);
      edges.forEach(function(e){ S.draw.line(c, cp[e[0]][0], cp[e[0]][1], cp[e[1]][0], cp[e[1]][1], P.grey, 1.2); });
      var atoms = [];
      var radius = (r / a) * sc;
      if (tp.value === "cs" || tp.value === "cc" || tp.value === "cfc") corners.forEach(function(q){ atoms.push({p:q, col:P.acc}); });
      if (tp.value === "cc") atoms.push({p:[0,0,0], col:P.red});
      if (tp.value === "cfc") [[0,0,.5],[0,0,-.5],[0,.5,0],[0,-.5,0],[.5,0,0],[-.5,0,0]].forEach(function(q){ atoms.push({p:q, col:P.amber}); });
      atoms.forEach(function(at){ at.pp = pr(at.p); });
      atoms.sort(function(p, q){ return p.pp[2] - q.pp[2]; });
      atoms.forEach(function(at){ ctx.globalAlpha = 0.78; S.draw.dot(c, at.pp[0], at.pp[1], radius * (0.92 + at.pp[2] * 0.06), at.col); ctx.globalAlpha = 1; });
      S.draw.text(c, "Glisse pour tourner · bleu : sommets (1/8) · orange : faces (1/2) · rouge : centre (1)", W / 2, H - 10, {size:10, color:P.grey});
      var rho = M.Z * mm.value / (NA * Math.pow(a * 1e-10, 3));
      ro.set(0, String(M.Z)); ro.set(1, String(M.N)); ro.set(2, S.fmt(a, 1) + " pm"); ro.set(3, S.fmt(M.comp * 100, 1) + " %"); ro.set(4, S.fmt(rho, 2) + " g/cm³");
      nt.set("a = " + S.fmt(a, 1) + " pm = " + S.sci(a * 1e-10, 3) + " cm ; ρ = Z·M/(N<sub>A</sub>·a³) = " + M.Z + " × " + S.fmt(mm.value, 1) + " / (6,022·10²³ × (" + S.sci(a * 1e-10, 3) + ")³) = " + S.fmt(rho, 2) + " g/cm³. Compacité indépendante de r : " + S.fmt(M.comp * 100, 1) + " %.", "ok");
    });
  }
});

/* ---------- 3. Pression de vapeur : Clausius–Clapeyron ---------- */
var LIQ = [["h2o","eau",40.65,373.15],["etoh","éthanol",38.6,351.45],["meoh","méthanol",35.2,337.7],["ace","propanone",29.1,329.2],["eth","éther diéthylique",26.5,307.7],["benz","benzène",30.8,353.2]];
SFA.sim({
  id:"uc-c04-clausius-clapeyron", ch:"c04", tag:"Liquides",
  titre:"Pression de vapeur, ébullition et équation de Clausius–Clapeyron",
  resume:"ln P = −ΔH<sub>vap</sub>/(RT) + C : trouve la température d'ébullition à n'importe quelle pression (altitude, autocuiseur).",
  but:"Choisis un liquide, une température et une pression extérieure. Compare la pression de vapeur à la pression extérieure : le liquide bout quand elles sont égales. Passe en représentation ln P en fonction de 1/T pour voir une droite de pente −ΔH<sub>vap</sub>/R.",
  aRetenir:"ln(P₂/P₁) = −(ΔH<sub>vap</sub>/R)(1/T₂ − 1/T₁). Un liquide bout quand P<sub>vap</sub> = P<sub>ext</sub> : à pression réduite il bout plus bas (en altitude), à pression élevée plus haut (autocuiseur, autoclave). Plus ΔH<sub>vap</sub> est grand, plus la pente de ln P(1/T) est forte.",
  piege:"T en kelvins dans la formule. ΔH<sub>vap</sub> est supposée constante, valeur donnée à la température d'ébullition normale : loin de ce point, l'écart peut atteindre 10–20 % (par exemple l'eau à 25 °C : 3,8 kPa calculés contre 3,17 kPa mesurés).",
  build:function(k, S){
    var c = k.canvas(360);
    var ls = k.select("Liquide", LIQ.map(function(l){ return [l[0], l[1] + " (ΔH = " + S.fmt(l[2], 1) + " kJ/mol, T<sub>éb</sub> = " + S.fmt(l[3] - 273.15, 1) + " °C)"]; }), "h2o");
    var md = k.seg("Représentation", [["pt","P(T)"],["ln","ln P (1/T)"]], "pt");
    var tt = k.slider("Température T", 0, 150, 1, 60, "°C");
    var pp = k.slider("Pression extérieure", 10, 400, 1, 101, "kPa");
    var ro = k.readouts(["P<sub>vap</sub> à T", "T d'ébullition à P<sub>ext</sub>", "État à T", "Pente −ΔH/R"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, L = LIQ.filter(function(x){ return x[0] === ls.value; })[0], dH = L[2] * 1000, T0 = L[3];
      function Pv(T){ return 101.325 * Math.exp(-dH / R * (1 / T - 1 / T0)); }
      var T = tt.value + 273.15, Pe = pp.value, pv = Pv(T), Tb = 1 / (1 / T0 - R * Math.log(Pe / 101.325) / dH);
      c.clear();
      if (md.value === "pt"){
        var ax = S.draw.axes(c, {x0:0, x1:150, y0:0, y1:400, xl:"T (°C)", yl:"P (kPa)", stepX:25, stepY:100});
        S.draw.fn(c, ax, function(x){ return Pv(x + 273.15); }, P.acc, 2.8);
        S.draw.line(c, ax.L, ax.Y(Pe), ax.R, ax.Y(Pe), P.red, 1.5, [5,4]);
        S.draw.text(c, "P ext", ax.R - 6, ax.Y(Pe) - 10, {size:11, color:P.red, align:"right"});
        S.draw.dot(c, ax.X(tt.value), ax.Y(Math.min(pv, 400)), 6, P.acc);
        if (Tb - 273.15 >= 0 && Tb - 273.15 <= 150){ S.draw.dot(c, ax.X(Tb - 273.15), ax.Y(Pe), 7, P.red); S.draw.text(c, S.fmt(Tb - 273.15, 1) + " °C", ax.X(Tb - 273.15), ax.Y(Pe) - 16, {size:12, color:P.red}); }
      } else {
        var xs0 = 1 / 423.15, xs1 = 1 / 273.15, ax2 = S.draw.axes(c, {x0:xs0 * 1000, x1:xs1 * 1000, y0:-1, y1:6, xl:"1000/T (K⁻¹)", yl:"ln(P / kPa)", stepX:0.25, stepY:1});
        S.draw.fn(c, ax2, function(x){ return Math.log(Pv(1000 / x)); }, P.acc, 2.8);
        S.draw.dot(c, ax2.X(1000 / T), ax2.Y(Math.log(Math.max(pv, 1e-6))), 6, P.acc);
        S.draw.line(c, ax2.L, ax2.Y(Math.log(Pe)), ax2.R, ax2.Y(Math.log(Pe)), P.red, 1.5, [5,4]);
        S.draw.text(c, "pente = −ΔH/R = −" + S.fmt(dH / R, 0) + " K", ax2.R - 4, ax2.T + 14, {size:11, color:P.grey, align:"right"});
      }
      var gas = pv >= Pe;
      ro.set(0, S.fmt(pv, pv < 10 ? 2 : 1) + " kPa"); ro.set(1, S.fmt(Tb - 273.15, 1) + " °C"); ro.set(2, gas ? "ébullition (vapeur)" : "liquide"); ro.set(3, S.fmt(-dH / R, 0) + " K");
      nt.set("À " + tt.value + " °C : P<sub>vap</sub> = 101,325·exp[−(" + S.fmt(L[2], 1) + "·10³/8,314)(1/" + S.fmt(T, 1) + " − 1/" + S.fmt(T0, 1) + ")] = " + S.fmt(pv, 2) + " kPa. " + (gas ? "P<sub>vap</sub> ≥ P<sub>ext</sub> : le liquide bout à cette température." : "P<sub>vap</sub> &lt; P<sub>ext</sub> : le liquide ne bout pas ; il s'évapore seulement en surface.") + (Math.abs(T - T0) > 50 ? " Loin de T<sub>éb</sub>, ΔH<sub>vap</sub> varie : résultat approché." : ""), Math.abs(T - T0) > 50 ? "warn" : "ok");
    });
  }
});

/* ---------- 4. Tension superficielle : Jurin et Laplace ---------- */
var SURF = [["eau","eau (25 °C)",0.0720,997,0],["etoh","éthanol",0.0223,789,0],["hg","mercure",0.485,13534,140],["surf","eau + surfactant",0.025,998,0]];
SFA.sim({
  id:"uc-c04-tension-superficielle", ch:"c04", tag:"Liquides",
  titre:"Tension superficielle : capillarité et alvéole pulmonaire",
  resume:"Hauteur capillaire h = 2γ·cos θ/(ρ·g·r) et surpression d'un alvéole ΔP = 2γ/r : le surfactant stabilise le poumon.",
  but:"Mode capillarité : choisis le liquide et le rayon du tube. Mode alvéole : fais varier le rayon et la tension superficielle, puis compare deux alvéoles connectés de rayons différents.",
  aRetenir:"Jurin : h = 2γ·cos θ/(ρ g r) (monte si θ &lt; 90°, descend si θ &gt; 90°, comme le mercure). Laplace pour une bulle ou un alvéole à une seule interface : ΔP = 2γ/r. Plus le rayon est petit, plus la surpression est forte ; le surfactant pulmonaire abaisse γ, donc la pression nécessaire pour gonfler un alvéole.",
  piege:"Deux alvéoles de rayons différents reliés avec la même γ : le petit a la plus grande pression et se vide dans le grand. Le surfactant évite cela car sa concentration en surface augmente quand l'alvéole se rétrécit, ce qui diminue γ. Pour une bulle de savon (deux interfaces), ΔP = 4γ/r.",
  build:function(k, S){
    var c = k.canvas(360);
    var md = k.seg("Mode", [["cap","Capillarité"],["alv","Alvéole"]], "cap");
    var ls = k.select("Liquide (capillarité)", SURF.map(function(s){ return [s[0], s[1] + " (γ = " + S.fmt(s[2] * 1000, 1) + " mN/m)"]; }), "eau");
    var rr = k.slider("Rayon du tube", 0.05, 3, 0.05, 0.5, "mm");
    var ra = k.slider("Rayon de l'alvéole", 20, 300, 5, 100, "µm");
    var ga = k.slider("Tension superficielle γ de l'alvéole", 5, 72, 1, 50, "mN/m");
    var rb = k.slider("Rayon d'un 2ᵉ alvéole relié", 20, 300, 5, 150, "µm");
    var ro = k.readouts(["Résultat 1", "Résultat 2", "Résultat 3"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H;
      c.clear();
      if (md.value === "cap"){
        var s = SURF.filter(function(x){ return x[0] === ls.value; })[0], r = rr.value / 1000, cs = Math.cos(s[4] * Math.PI / 180);
        var h = 2 * s[2] * cs / (s[3] * G * r);
        var cx = W / 2, base = H - 60, sc = Math.min(120, (H - 120) / Math.max(1, Math.abs(h * 1000) / 10)), hp = Math.max(-80, Math.min(base - 40, h * 1000 * 4));
        ctx.fillStyle = "#cfe3f7"; ctx.fillRect(40, base, W - 80, 50);
        S.draw.line(c, 40, base, W - 40, base, P.acc, 2);
        var tw = Math.max(8, r * 1000 * 36);
        ctx.fillStyle = "#dcebfa"; ctx.fillRect(cx - tw / 2, base - hp, tw, hp > 0 ? hp : 0); if (hp < 0) ctx.fillRect(cx - tw / 2, base, tw, -hp);
        ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - tw / 2, base - Math.max(hp, 0) - 40); ctx.lineTo(cx - tw / 2, base + 45); ctx.moveTo(cx + tw / 2, base - Math.max(hp, 0) - 40); ctx.lineTo(cx + tw / 2, base + 45); ctx.stroke();
        S.draw.text(c, "h = " + S.fmt(h * 1000, 1) + " mm", cx + tw / 2 + 12, base - hp / 2 - 4, {size:13, color:P.red, align:"left"});
        S.draw.text(c, "niveau libre", 70, base - 8, {size:11, color:P.grey, align:"left"});
        ro.set(0, S.fmt(h * 1000, 1) + " mm"); ro.set(1, "θ = " + s[4] + "°"); ro.set(2, S.fmt(s[2] * 1000, 1) + " mN/m");
        nt.set("h = 2 × " + S.fmt(s[2], 4) + " × cos " + s[4] + "° / (" + S.fmt(s[3], 0) + " × 9,81 × " + S.sci(r, 2) + ") = " + S.fmt(h * 1000, 1) + " mm. " + (h < 0 ? "Angle de contact &gt; 90° : le liquide ne mouille pas le verre, le niveau descend." : "Le liquide mouille le verre et monte : plus le tube est fin, plus il monte.") + (rr.value > 2 ? " Pour un tube large, la gravité l'emporte sur la capillarité (modèle valable pour r petit devant la longueur capillaire ≈ 2,7 mm pour l'eau)." : ""), rr.value > 2 ? "warn" : "ok");
      } else {
        var Pa = 2 * ga.value / 1000 / (ra.value * 1e-6), Pb = 2 * ga.value / 1000 / (rb.value * 1e-6), cm = 98.07;
        var maxr = 320, y = H / 2;
        [[ra.value, Pa, W * 0.3, P.red], [rb.value, Pb, W * 0.7, P.acc]].forEach(function(al){
          ctx.fillStyle = "rgba(200,220,240,.55)"; ctx.strokeStyle = al[3]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(al[2], y, al[0] / maxr * Math.min(W * 0.22, H * 0.4), 0, 7); ctx.fill(); ctx.stroke();
          S.draw.text(c, "r = " + al[0] + " µm", al[2], y, {size:12, color:al[3]});
          S.draw.text(c, "ΔP = " + S.fmt(al[1], 0) + " Pa", al[2], y + Math.min(W * 0.22, H * 0.4) + 22, {size:12, color:al[3]});
        });
        var dir = Pa > Pb ? "→" : Pa < Pb ? "←" : "=";
        S.draw.text(c, Pa === Pb ? "pressions égales" : "l'air passe " + (Pa > Pb ? "du petit vers le grand" : "du petit (à droite) vers le grand (à gauche)"), W / 2, 22, {size:12, color:P.ink});
        S.draw.arrow(c, W / 2 - (Pa > Pb ? 40 : -40), y, W / 2 + (Pa > Pb ? 40 : -40), y, P.amber, 3);
        ro.set(0, S.fmt(Pa, 0) + " Pa"); ro.set(1, S.fmt(Pa / cm, 1) + " cmH₂O"); ro.set(2, S.fmt(Pb, 0) + " Pa");
        nt.set("ΔP = 2γ/r = 2 × " + S.fmt(ga.value / 1000, 3) + " / " + S.sci(ra.value * 1e-6, 2) + " = " + S.fmt(Pa, 0) + " Pa = " + S.fmt(Pa / cm, 1) + " cmH₂O. " + (Pa > Pb ? "Le petit alvéole est à plus haute pression : il tend à se vider dans le grand (instabilité, atélectasie)." : Pa < Pb ? "Ici le premier alvéole est le plus grand (pression plus basse)." : "") + " Diminuer γ (surfactant) diminue toutes les pressions dans le même rapport.", "ok");
      }
    });
  }
});

/* ---------- 5. Types de solides : le détective ---------- */
var SOL = [
  ["NaCl (sel de cuisine)","ionique","801 °C","non","oui","dur, cassant","très soluble"],
  ["MgO","ionique","2 852 °C","non","oui (fondu)","très dur, cassant","quasi insoluble"],
  ["Diamant","covalent","≈ 3 550 °C (sublime)","non","—","le plus dur","insoluble"],
  ["Quartz SiO₂","covalent","1 713 °C","non","non (liquide visqueux)","dur","insoluble"],
  ["Fer","métallique","1 538 °C","oui","oui","dur, malléable et ductile","insoluble"],
  ["Cuivre","métallique","1 085 °C","oui","oui","malléable, ductile","insoluble"],
  ["Sodium","métallique","98 °C","oui","oui","très mou (coupe au couteau)","réagit avec l'eau"],
  ["Glace H₂O","moléculaire","0 °C","non (très faible)","non","mou, fragile","—"],
  ["Diiode I₂","moléculaire","114 °C (sublime facilement)","non","non","mou","peu soluble dans l'eau"],
  ["Naphtalène","moléculaire","80 °C","non","non","mou","insoluble dans l'eau"],
  ["Saccharose","moléculaire","186 °C (se décompose)","non","non (solution non conductrice)","modérément dur","très soluble"]
];
var TYPES = [["ionique","ionique"],["covalent","covalent (réseau)"],["métallique","métallique"],["moléculaire","moléculaire"]];
var EXPL = {ionique:"réseau d'ions, attraction électrostatique forte : T<sub>f</sub> élevée, cassant, isolant solide mais conducteur fondu ou dissous.", covalent:"réseau de liaisons covalentes sur tout le cristal : T<sub>f</sub> très élevée, très dur, isolant (sauf cas particuliers).", métallique:"cations dans une mer d'électrons : conducteur à l'état solide, malléable, T<sub>f</sub> très variable.", moléculaire:"molécules liées par forces de London, dipôle–dipôle ou liaisons H : T<sub>f</sub> basse, mou, isolant."};
SFA.sim({
  id:"uc-c04-types-solides", ch:"c04", tag:"Solides",
  titre:"Le détective des solides : ionique, covalent, métallique ou moléculaire ?",
  resume:"À partir de la température de fusion, de la conductivité et de la dureté, identifie le type de solide. Un score te dit où tu en es.",
  but:"Un solide mystère apparaît avec ses propriétés. Choisis son type, puis passe au suivant. Les indices sont ceux d'un vrai tableau de propriétés.",
  aRetenir:"Ionique : fond à haute T, conduit fondu/dissous mais pas solide. Réseau covalent : T<sub>f</sub> très haute, très dur, isolant. Métallique : conduit solide, malléable. Moléculaire : T<sub>f</sub> basse, mou, isolant (le sucre se dissout sans conduire).",
  piege:"Une solution qui conduit ne prouve pas un solide ionique à elle seule (il faut aussi qu'il ne conduise pas à l'état solide) ; le graphite, covalent, conduit ; un solide moléculaire polaire peut se dissoudre dans l'eau sans la rendre conductrice (sucre).",
  build:function(k, S){
    var c = k.canvas(300);
    var order = []; for (var i = 0; i < SOL.length; i++) order.push((i * 5 + 3) % SOL.length);
    var st = {i:0, score:0, tried:0, answered:false, last:""};
    var tp = k.seg("Ton choix", TYPES, "ionique", function(v){
      if (st.answered) return;
      var it = SOL[order[st.i]]; st.answered = true; st.tried++; st.last = v;
      if (v === it[1]) st.score++;
    });
    k.button("Solide suivant", function(){ st.i = (st.i + 1) % SOL.length; st.answered = false; st.last = ""; }, true);
    var ro = k.readouts(["Score", "Fusion", "Conduit solide / fondu", "Dureté"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      var P = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, it = SOL[order[st.i]];
      c.clear();
      S.draw.text(c, "Solide mystère n° " + (st.i + 1) + " / " + SOL.length, W / 2, 26, {size:14, color:P.grey});
      var rows = [["Température de fusion", it[2]], ["Conduit à l'état solide ?", it[3]], ["Conduit fondu ou dissous ?", it[4]], ["Dureté", it[5]], ["Dans l'eau", it[6]]];
      rows.forEach(function(r, i){ var y = 60 + i * 38; ctx.fillStyle = i % 2 ? "#f4f6f9" : "#eaeef4"; ctx.fillRect(30, y - 16, W - 60, 32); S.draw.text(c, r[0], 42, y, {size:12, align:"left", color:P.grey}); S.draw.text(c, r[1], W - 42, y, {size:13, align:"right"}); });
      if (st.answered){ var ok = st.last === it[1]; S.draw.text(c, ok ? "Correct : " + it[0] + " est " + it[1] + "." : "Pas tout à fait : " + it[0] + " est " + it[1] + ".", W / 2, 270, {size:14, color:ok ? P.green : P.red}); }
      ro.set(0, st.score + " / " + st.tried); ro.set(1, it[2]); ro.set(2, it[3] + " / " + it[4]); ro.set(3, it[5]);
      nt.set(st.answered ? (it[0] + " : " + EXPL[it[1]]) : "Lis les propriétés ci-dessus, puis choisis le type de solide (un seul essai par solide). Le nom du solide apparaîtra après ta réponse.", st.answered ? (st.last === it[1] ? "ok" : "warn") : "ok");
    });
  }
});
})();
