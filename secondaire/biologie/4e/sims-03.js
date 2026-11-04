/* Biologie 4e · chapitre 3 · Membrane cellulaire, diffusion et osmose */
SFA.sim({
  id:"b4-c03-diffusion", ch:"c03", tag:"Classique · particules",
  titre:"Diffusion : les particules s'égalisent toutes seules",
  resume:"Des particules agitées traversent des pores : la concentration s'égalise sans aucune énergie fournie.",
  but:"Règle le nombre de particules de chaque côté, la température et la surface de membrane perméable, puis lance. Observe la courbe et le temps pour atteindre l'égalité.",
  aRetenir:"La diffusion est le déplacement net des particules du milieu où elles sont les plus concentrées vers celui où elles le sont le moins, à cause de l'agitation moléculaire. Elle ne demande pas d'énergie, s'arrête quand les concentrations sont égales (les particules continuent pourtant à bouger) et est plus rapide quand la température monte.",
  piege:"À l'équilibre les particules ne s'arrêtent pas : il en passe autant dans un sens que dans l'autre. Les particules ne « veulent » pas s'égaliser : c'est un effet du hasard sur un grand nombre.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.95});
    var st = {p:[], t:0, acc:0, hist:[], eq:null, N:0};
    var nl = k.slider("Particules à gauche", 0, 200, 10, 120, "", function(){ init(); });
    var nr = k.slider("Particules à droite", 0, 200, 10, 20, "", function(){ init(); });
    var T = k.slider("Température", 0, 80, 1, 37, "°C");
    var gap = k.slider("Surface de membrane perméable", 0, 100, 5, 40, "%");
    var ro = k.readouts(["À gauche", "À droite", "Écart", "Égalité (±10 %) atteinte à"]);
    var nt = k.note("", "");
    function init(){
      st.p = []; st.t = 0; st.acc = 0; st.hist = []; st.eq = null; st.N = nl.value + nr.value;
      for (var i = 0; i < nl.value; i++) st.p.push({x:Math.random() * 0.5, y:Math.random(), a:Math.random() * 6.283, o:0});
      for (i = 0; i < nr.value; i++) st.p.push({x:0.5 + Math.random() * 0.5, y:Math.random(), a:Math.random() * 6.283, o:1});
      st.hist.push([0, st.N ? nl.value / st.N * 100 : 50]);
    }
    init();
    var lp = k.loop(function(dt){
      var v = 0.35 * Math.sqrt((T.value + 273.15) / 310.15), g = gap.value / 100, lo = 0.5 - g / 2, hi = 0.5 + g / 2;
      for (var s = 0; s < 2; s++){
        var h = dt / 2;
        st.p.forEach(function(q){
          q.a += (Math.random() - 0.5) * 1.6;
          var px = q.x, nx = q.x + Math.cos(q.a) * v * h, ny = q.y + Math.sin(q.a) * v * h;
          if (ny < 0){ ny = -ny; q.a = -q.a; } if (ny > 1){ ny = 2 - ny; q.a = -q.a; }
          if (nx < 0){ nx = -nx; q.a = Math.PI - q.a; } if (nx > 1){ nx = 2 - nx; q.a = Math.PI - q.a; }
          if ((px - 0.5) * (nx - 0.5) < 0 && !(ny >= lo && ny <= hi)){ nx = px; q.a = Math.PI - q.a; }
          q.x = nx; q.y = ny;
        });
      }
      st.t += dt; st.acc += dt;
      var L = st.p.filter(function(q){ return q.x < 0.5; }).length;
      if (st.acc >= 0.25){ st.acc = 0; st.hist.push([st.t, st.N ? L / st.N * 100 : 50]); if (st.hist.length > 900) st.hist.shift(); }
      if (st.eq === null && st.N > 0 && Math.abs(nl.value - nr.value) > 0.1 * st.N && Math.abs(2 * L - st.N) <= 0.1 * st.N) st.eq = st.t;
      k.redraw();
    });
    lp.play();
    k.button("❚❚ Pause / ▶ Reprendre", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    k.button("↺ Recommencer", function(){ init(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, bh = H * 0.52, bx = 8, bw = W - 16;
      ctx.fillStyle = "#f8fafc"; ctx.fillRect(bx, 8, bw, bh); ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2; ctx.strokeRect(bx, 8, bw, bh);
      var g = gap.value / 100, mx = bx + bw / 2, y0 = 8, y1 = 8 + bh, lo = y0 + (0.5 - g / 2) * bh, hi = y0 + (0.5 + g / 2) * bh;
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(mx, y0); ctx.lineTo(mx, lo); ctx.moveTo(mx, hi); ctx.lineTo(mx, y1); ctx.stroke();
      ctx.setLineDash([4, 4]); ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx, lo); ctx.lineTo(mx, hi); ctx.stroke(); ctx.setLineDash([]);
      var L = 0;
      st.p.forEach(function(q){ if (q.x < 0.5) L++; S.draw.dot(c, bx + q.x * bw, y0 + q.y * bh, 3.6, q.o ? "#B45309" : "#1e3f8f"); });
      var R = st.N - L;
      B4.txt(c, "Gauche : " + L, bx + bw * 0.25, y1 + 14, "#1e3f8f", 13); B4.txt(c, "Droite : " + R, bx + bw * 0.75, y1 + 14, "#B45309", 13);
      var gy0 = y1 + 36, ax = S.draw.axes(c, {x0:0, x1:Math.max(60, st.t), y0:0, y1:100, xl:"t (s)", yl:"% des particules à gauche", stepY:25, t:gy0, l:40});
      S.draw.line(c, ax.L, ax.Y(50), ax.R, ax.Y(50), "#2e6b55", 1.5, [5, 4]);
      var ctx2 = c.ctx; ctx2.save(); ctx2.beginPath(); ctx2.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx2.clip(); ctx2.strokeStyle = B4.pal.acc; ctx2.lineWidth = 2.4; ctx2.beginPath();
      st.hist.forEach(function(h, i){ var x = ax.X(h[0]), y = ax.Y(h[1]); if (i === 0) ctx2.moveTo(x, y); else ctx2.lineTo(x, y); }); ctx2.stroke(); ctx2.restore();
      ro.set(0, L); ro.set(1, R); ro.set(2, Math.abs(L - R)); ro.set(3, st.eq !== null ? S.fmt(st.eq, 0) + " s" : (st.N === 0 ? "—" : "pas encore"));
      if (st.N === 0) nt.set("Ajoute des particules pour observer la diffusion.", "warn");
      else if (gap.value === 0) nt.set("Membrane totalement imperméable : aucune particule ne passe, l'écart reste constant.", "warn");
      else nt.set("Le sens du déplacement net va du côté le plus concentré vers le moins concentré : " + (L > R ? "gauche → droite" : L < R ? "droite → gauche" : "aucun (concentrations égales)") + ". Les particules continuent de traverser dans les deux sens.", "");
    });
  }
});

SFA.sim({
  id:"b4-c03-osmose", ch:"c03", tag:"Classique · modèle",
  titre:"Osmose : l'eau va vers le plus concentré",
  resume:"Deux compartiments séparés par une membrane perméable à l'eau seulement : suis le niveau de chaque côté.",
  but:"Choisis la concentration en saccharose de chaque côté et lance. Compare le niveau final à la valeur prévue, puis rends la membrane perméable au sucre.",
  aRetenir:"L'osmose est le passage de l'eau, à travers une membrane perméable à l'eau mais pas au soluté, du compartiment le moins concentré (hypotonique) vers le plus concentré (hypertonique). Elle s'arrête quand les concentrations sont égales (isotoniques).",
  piege:"L'eau n'est pas « attirée par le sel » et elle ne va pas du plus concentré vers le moins concentré en soluté : c'est l'inverse. Modèle simplifié : pression hydrostatique négligée, volume limité entre 10 et 190 mL par compartiment.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.8});
    var st = {VL:100, nL:0, nR:0, t:0, seed:7};
    var cl = k.slider("Concentration à gauche", 0, 1, 0.05, 0.6, "mol/L", function(){ rst(); });
    var cr = k.slider("Concentration à droite", 0, 1, 0.05, 0.2, "mol/L", function(){ rst(); });
    var sol = k.toggle("Membrane perméable aussi au sucre (diffusion)", false, function(){ rst(); });
    var ro = k.readouts(["Volume gauche", "Volume droite", "Conc. gauche", "Conc. droite"]);
    var nt = k.note("", "");
    function rst(){ st.VL = 100; st.nL = cl.value * 100; st.nR = cr.value * 100; st.cL = cl.value; st.cR = cr.value; st.t = 0; lp.pause(); }
    var lp = k.loop(function(dt){
      for (var s = 0; s < 5; s++){
        var h = dt / 5;
        if (sol.value){ var d = st.cL - st.cR; st.cL -= 0.5 * d * h; st.cR += 0.5 * d * h; }
        else {
          var VR = 200 - st.VL, cL = st.nL / st.VL, cR = st.nR / VR, flux = 40 * (cL - cR) * h;
          var nv = Math.max(10, Math.min(190, st.VL + flux)); st.VL = nv;
        }
      }
      st.t += dt; k.redraw();
    });
    rst();
    k.button("▶ Lancer", function(){ lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.button("↺ Remettre à zéro", function(){ rst(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, VR = 200 - st.VL;
      var cL = sol.value ? st.cL : (st.nL / st.VL), cR = sol.value ? st.cR : (st.nR / VR);
      var vL = sol.value ? 100 : st.VL, vR = sol.value ? 100 : VR;
      var top = 20, bot = H - 36, hh = bot - top, wi = (W - 60) / 2, xL = 20, xR = 40 + wi;
      function hgt(v){ return v / 200 * hh * 1.0; }
      function dots(x0, vol, conc, seed){
        var r = B4.rng(seed), n = Math.round(conc * 100 * 0.5), hw = hgt(vol), y0 = bot - hw;
        for (var i = 0; i < n; i++) S.draw.dot(c, x0 + 6 + r() * (wi - 12), y0 + 6 + r() * Math.max(1, hw - 12), 3, "#B45309");
      }
      [[xL, vL, cL, 3], [xR, vR, cR, 5]].forEach(function(a){
        ctx.fillStyle = "rgba(147,197,253,.5)"; ctx.fillRect(a[0], bot - hgt(a[1]), wi, hgt(a[1]));
        dots(a[0], a[1], a[2], a[3]);
        ctx.strokeStyle = "#13233a"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(a[0], top); ctx.lineTo(a[0], bot); ctx.lineTo(a[0] + wi, bot); ctx.lineTo(a[0] + wi, top); ctx.stroke();
      });
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = "#2e6b55"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W / 2, top); ctx.lineTo(W / 2, bot); ctx.stroke(); ctx.restore();
      B4.txt(c, "membrane", W / 2, top - 8, "#2e6b55", 12);
      B4.txt(c, S.fmt(vL, 0) + " mL", xL + wi / 2, bot - hgt(vL) - 10, B4.pal.ink, 13); B4.txt(c, S.fmt(vR, 0) + " mL", xR + wi / 2, bot - hgt(vR) - 10, B4.pal.ink, 13);
      /* niveau final prévu */
      var tot = cl.value + cr.value, eq = sol.value ? 100 : (tot === 0 ? 100 : Math.max(10, Math.min(190, 200 * cl.value / tot)));
      S.draw.line(c, xL - 6, bot - hgt(eq), xL + 16, bot - hgt(eq), B4.pal.red, 2, [4, 3]); S.draw.line(c, xR + wi - 16, bot - hgt(200 - eq), xR + wi + 6, bot - hgt(200 - eq), B4.pal.red, 2, [4, 3]);
      B4.txt(c, "tirets rouges : niveau final prévu", W / 2, H - 12, B4.pal.red, 12);
      if (!sol.value && Math.abs(cL - cR) > 0.01 && st.t > 0.1) { var dir = cL > cR ? 1 : -1; S.draw.arrow(c, W / 2 - dir * 22, (top + bot) / 2, W / 2 + dir * 22, (top + bot) / 2, B4.pal.acc, 4); B4.txt(c, "eau", W / 2, (top + bot) / 2 - 14, B4.pal.acc, 12); }
      ro.set(0, S.fmt(vL, 0) + " mL"); ro.set(1, S.fmt(vR, 0) + " mL"); ro.set(2, S.fmt(cL, 2) + " mol/L"); ro.set(3, S.fmt(cR, 2) + " mol/L");
      var eqp = Math.abs(cL - cR) < 0.01;
      if (cl.value === cr.value && !sol.value) nt.set("Concentrations égales : milieux isotoniques, aucun mouvement net d'eau.", "ok");
      else if (sol.value) nt.set("Si le sucre peut passer, il diffuse du côté concentré vers le côté dilué jusqu'à égaliser les concentrations : le volume d'eau de chaque côté ne change pas (pas d'osmose).", "");
      else if (cl.value === 0 && cr.value > 0 || cr.value === 0 && cl.value > 0) nt.set("Un côté sans soluté : l'eau passe vers le côté sucré jusqu'à la limite du dispositif (10 mL).", "warn");
      else nt.set((cl.value > cr.value ? "Gauche hypertonique, droite hypotonique" : "Droite hypertonique, gauche hypotonique") + " : l'eau passe du côté le moins concentré vers le plus concentré. Niveau final prévu à gauche : " + S.fmt(eq, 0) + " mL (volume total 200 mL, concentrations égales). " + (eqp ? "Équilibre atteint." : ""), "");
    });
  }
});

SFA.sim({
  id:"b4-c03-bain", ch:"c03", tag:"Classique · graphe",
  titre:"Une cellule dans un bain : gonfler, éclater, plasmolyser",
  resume:"Fais varier la concentration en sel du bain et observe un globule rouge puis une cellule végétale.",
  but:"Choisis le type de cellule et déplace la concentration du bain (en % de NaCl). Lis le volume relatif et le comportement de la cellule.",
  aRetenir:"Cellule animale : milieu hypotonique → elle gonfle et peut éclater (hémolyse) ; isotonique (≈ 0,9 % de NaCl, sérum physiologique) → volume stable ; hypertonique → elle se déshydrate et se ratatine. Cellule végétale : la paroi empêche l'éclatement (turgescence) ; en milieu hypertonique, la membrane se décolle de la paroi (plasmolyse).",
  piege:"Modèle simplifié (cellule à concentration interne 0,9 %, volume non osmotique de 25 %). Éclater dans l'eau pure ne vaut que pour les cellules sans paroi : une cellule végétale ne « explose » pas, elle devient turgescente.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.85});
    var typ = k.seg("Cellule", [["a","Animale (globule rouge)"],["v","Végétale"]], "a");
    var cb = k.slider("Concentration du bain (NaCl)", 0, 3, 0.05, 0.9, "%");
    var ro = k.readouts(["Bain par rapport à la cellule", "Volume relatif V/V₀", "Sens net de l'eau", "État"]);
    var nt = k.note("", "");
    k.button("Eau distillée", function(){ cb.set(0); });
    k.button("Sérum physiologique", function(){ cb.set(0.9); });
    k.button("Eau de mer (≈ 3 %)", function(){ cb.set(3); });
    var CI = 0.9, B = 0.25, LY = 1.6;
    function vol(cc, animal){
      if (cc < 0.02) cc = 0.02;
      var v = B + (1 - B) * CI / cc;
      return animal ? v : Math.min(v, 1.1);
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, animal = typ.value === "a", cc = cb.value, v = vol(cc, animal);
      var gh = H * 0.5;
      var cx = W / 2, cy = gh / 2 + 6, r0 = Math.min(W * 0.2, gh * 0.34);
      ctx.fillStyle = cc < CI - 0.04 ? "rgba(186,230,253,.45)" : cc > CI + 0.04 ? "rgba(253,230,138,.5)" : "rgba(220,252,231,.6)"; ctx.fillRect(6, 6, W - 12, gh);
      ctx.strokeStyle = "#cbd5e1"; ctx.strokeRect(6, 6, W - 12, gh);
      var lyse = animal && v >= LY, r = r0 * Math.sqrt(Math.min(v, LY));
      if (animal){
        if (lyse){ for (var i = 0; i < 12; i++){ var an = i * 0.52; B4.ell(c, cx + Math.cos(an) * r * 1.15, cy + Math.sin(an) * r * 1.15, 5, 3, "rgba(180,40,40,.6)", null, 0, an); } B4.txt(c, "éclatée !", cx, cy, B4.pal.red, 14); }
        else if (v < 0.85){
          ctx.beginPath(); for (i = 0; i <= 48; i++){ var a2 = i / 48 * 6.283, rr = r * (1 + 0.13 * Math.sin(a2 * 10)); var px = cx + Math.cos(a2) * rr, py = cy + Math.sin(a2) * rr; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
          ctx.closePath(); ctx.fillStyle = "rgba(190,40,40,.5)"; ctx.fill(); ctx.strokeStyle = B4.pal.red; ctx.lineWidth = 2; ctx.stroke();
        } else { B4.ell(c, cx, cy, r, r, "rgba(190,40,40,.5)", B4.pal.red, 2.5); if (v < 1.2) B4.ell(c, cx, cy, r * 0.4, r * 0.4, "rgba(255,255,255,.45)"); }
      } else {
        var wR = r0 * 1.12; B4.rr(c, cx - wR, cy - wR, wR * 2, wR * 2, 8, null, "#2e6b55", 5);
        var rin = r0 * Math.sqrt(v / 1.1) * 1.05; if (v >= 1) rin = wR - 3;
        B4.rr(c, cx - rin, cy - rin, rin * 2, rin * 2, 10, "rgba(167,243,208,.6)", B4.pal.teal, 2.5);
        B4.txt(c, v < 0.995 ? "plasmolyse" : v > 1.005 ? "turgescente" : "à l'équilibre", cx, cy, B4.pal.ink, 12);
      }
      var dirw = cc < CI - 0.04 ? "entre" : cc > CI + 0.04 ? "sort" : null;
      if (dirw){ for (i = 0; i < 3; i++){ var ay = cy - 24 + i * 24; if (dirw === "entre") S.draw.arrow(c, cx - r0 * 1.9, ay, cx - r * 1.25, ay, B4.pal.acc, 2.5); else S.draw.arrow(c, cx - r * 1.25, ay, cx - r0 * 1.9, ay, B4.pal.acc, 2.5); } B4.txt(c, "eau", cx - r0 * 1.7, cy + 50, B4.pal.acc, 12); }
      var ax = S.draw.axes(c, {x0:0, x1:3, y0:0, y1:2, xl:"bain (% NaCl)", yl:"V/V₀", stepX:0.5, stepY:0.5, t:gh + 24, l:40});
      S.draw.fn(c, ax, function(x){ return Math.min(2, vol(x, true)); }, B4.pal.red, 2.4);
      S.draw.fn(c, ax, function(x){ return vol(x, false); }, B4.pal.green, 2.4, [6, 4]);
      S.draw.line(c, ax.X(0), ax.Y(LY), ax.X(3), ax.Y(LY), "#8a95a3", 1.2, [3, 3]); B4.txt(c, "éclatement (animale) V/V₀ = 1,6", ax.X(1.9), ax.Y(LY) - 8, "#5f6b7a", 11);
      B4.txt(c, "animale", ax.X(2.5), ax.Y(0.85), B4.pal.red, 12); B4.txt(c, "végétale (tirets)", ax.X(2.2), ax.Y(1.18), B4.pal.green, 12);
      S.draw.dot(c, ax.X(cc), ax.Y(Math.min(2, v)), 7, "#13233a");
      var rel = cc < CI - 0.04 ? "hypotonique" : cc > CI + 0.04 ? "hypertonique" : "isotonique";
      var etat = animal ? (lyse ? "éclatée (hémolyse)" : v > 1.2 ? "gonflée" : v >= 0.85 ? "normale" : "ratatinée") : (v > 1.005 ? "turgescente" : v >= 0.995 ? "équilibre (flasque)" : "plasmolysée");
      ro.set(0, rel); ro.set(1, S.fmt(Math.min(v, 9.99), 2)); ro.set(2, dirw === "entre" ? "vers l'intérieur" : dirw === "sort" ? "vers l'extérieur" : "nul"); ro.set(3, etat);
      nt.set(rel === "isotonique" ? "Concentrations égales : pas de mouvement net d'eau, volume inchangé." : rel === "hypotonique" ? "Bain moins concentré que la cellule : l'eau entre (vers le plus concentré)." + (animal && lyse ? " Sans paroi, la membrane cède : hémolyse." : !animal ? " La paroi résiste : la cellule devient turgescente mais n'éclate pas." : "") : "Bain plus concentré que la cellule : l'eau sort." + (animal ? " La cellule se ratatine." : " La membrane se décolle de la paroi : plasmolyse."), lyse ? "bad" : rel === "isotonique" ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id:"b4-c03-pompe", ch:"c03", tag:"Transport actif · original",
  titre:"Pompe Na⁺/K⁺ : l'ATP maintient le gradient",
  resume:"Coupe l'ATP d'une cellule et regarde le sodium envahir l'intérieur, puis rends-lui l'énergie.",
  but:"Règle l'ATP disponible et la fuite passive, puis lance : suis [Na⁺] et [K⁺] à l'intérieur de la cellule au cours du temps.",
  aRetenir:"Les ions fuient en permanence par diffusion, selon leurs gradients. La pompe Na⁺/K⁺ utilise l'ATP pour renvoyer 3 Na⁺ vers l'extérieur et faire entrer 2 K⁺ : c'est un transport actif, contre le gradient. Sans ATP (cyanure, manque d'oxygène) le gradient s'effondre.",
  piege:"Modèle très simplifié (concentrations en mmol/L, temps en minutes, cinétique de saturation). Ne retiens pas les valeurs exactes, mais le principe : fuite passive vs pompage actif.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.95});
    var atp = k.slider("ATP disponible", 0, 100, 5, 100, "%");
    var leak = k.slider("Fuite passive (canaux)", 0.5, 3, 0.1, 1, "×");
    var ro = k.readouts(["[Na⁺] intérieur", "[K⁺] intérieur", "Na⁺ pompés", "Équilibre visé [Na⁺]"]);
    var nt = k.note("", "");
    var NAO = 145, KO = 5, LK = 0.1, LKK = 0.0659, KM = 15, PM = 30;
    var st = {na:12, k:140, t:0, h:[[0, 12, 140]], acc:0};
    function pumpRate(na){ return PM * atp.value / 100 * na / (na + KM); }
    function steady(){
      var lo = 0, hi = NAO, f = function(n){ return LK * leak.value * (NAO - n) - pumpRate(n); };
      for (var i = 0; i < 60; i++){ var m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; } return (lo + hi) / 2;
    }
    var lp = k.loop(function(dt){
      var min = dt * 2;                    /* 1 s de simulation = 2 min */
      for (var s = 0; s < 10; s++){
        var h = min / 10, p = pumpRate(st.na);
        st.na += (LK * leak.value * (NAO - st.na) - p) * h;
        st.k += (p * 2 / 3 - LKK * leak.value * (st.k - KO)) * h;
        st.na = Math.max(0, Math.min(NAO, st.na)); st.k = Math.max(KO, st.k);
      }
      st.t += min; st.acc += min; if (st.acc >= 1){ st.acc = 0; st.h.push([st.t, st.na, st.k]); if (st.h.length > 400) st.h.shift(); }
      if (st.t >= 120) lp.pause(); k.redraw();
    });
    k.button("▶ Lancer", function(){ if (st.t >= 120){ st.na = 12; st.k = 140; st.t = 0; st.h = [[0, 12, 140]]; } lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    k.button("↺ Cellule saine", function(){ lp.pause(); st.na = 12; st.k = 140; st.t = 0; st.h = [[0, 12, 140]]; });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, mh = H * 0.44, my = mh * 0.5 + 6;
      var p = pumpRate(st.na);
      ctx.fillStyle = "rgba(254,243,199,.6)"; ctx.fillRect(6, 6, W - 12, mh * 0.34); ctx.fillStyle = "rgba(220,252,231,.7)"; ctx.fillRect(6, 6 + mh * 0.66, W - 12, mh * 0.34);
      ctx.fillStyle = "#cbd5e1"; ctx.fillRect(6, 6 + mh * 0.34, W - 12, mh * 0.32);
      B4.txt(c, "Extérieur : Na⁺ 145 · K⁺ 5", 12, 18, B4.pal.ink, 12, "left");
      B4.txt(c, "Intérieur : Na⁺ " + S.fmt(st.na, 0) + " · K⁺ " + S.fmt(st.k, 0), 12, 6 + mh - 10, B4.pal.ink, 12, "left");
      B4.txt(c, "membrane", 12, 6 + mh * 0.5, "#475569", 12, "left");
      var xp = W * 0.78; B4.rr(c, xp - 20, 6 + mh * 0.3, 40, mh * 0.4, 8, "#5B21B6", null, 0); B4.txt(c, "pompe", xp, 6 + mh * 0.5, "#fff", 11);
      var wp = 2 + 8 * p / PM;
      S.draw.arrow(c, xp - 8, 6 + mh * 0.3, xp - 8, 6 + mh * 0.2, B4.pal.amber, wp); B4.txt(c, "3 Na⁺", xp - 36, 6 + mh * 0.2, B4.pal.amber, 12);
      S.draw.arrow(c, xp + 8, 6 + mh * 0.7, xp + 8, 6 + mh * 0.8, B4.pal.green, wp * 0.66); B4.txt(c, "2 K⁺", xp + 32, 6 + mh * 0.8, B4.pal.green, 12);
      var wl = 1 + 5 * Math.min(1, LK * leak.value * (NAO - st.na) / 15);
      S.draw.arrow(c, W * 0.5, 6 + mh * 0.2, W * 0.5, 6 + mh * 0.8, B4.pal.red, wl); B4.txt(c, "fuite Na⁺", W * 0.5 + 38, 6 + mh * 0.3, B4.pal.red, 12);
      var ax = S.draw.axes(c, {x0:0, x1:120, y0:0, y1:160, xl:"t (min)", yl:"mmol/L (intérieur)", stepX:20, stepY:40, t:mh + 20, l:40});
      var series = [[1, B4.pal.amber, "[Na⁺]"], [2, B4.pal.green, "[K⁺]"]];
      series.forEach(function(s){ ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip(); ctx.strokeStyle = s[1]; ctx.lineWidth = 2.6; ctx.beginPath(); st.h.forEach(function(h, i){ var x = ax.X(h[0]), y = ax.Y(h[s[0]]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); ctx.restore(); });
      B4.txt(c, "[Na⁺]", ax.X(112), ax.Y(st.na) - 12, B4.pal.amber, 12); B4.txt(c, "[K⁺]", ax.X(112), ax.Y(st.k) - 12, B4.pal.green, 12);
      var sNa = steady();
      ro.set(0, S.fmt(st.na, 0) + " mmol/L"); ro.set(1, S.fmt(st.k, 0) + " mmol/L"); ro.set(2, S.fmt(p, 1) + " mmol/L/min"); ro.set(3, S.fmt(sNa, 0) + " mmol/L");
      nt.set(atp.value === 0 ? "Sans ATP : plus de pompage. Le Na⁺ entre par fuite jusqu'à égaliser avec l'extérieur (≈ 145) et le K⁺ s'échappe : le gradient disparaît." : st.na > 40 ? "Le gradient s'effondre : la pompe n'arrive plus à compenser la fuite." : "La pompe compense la fuite : le gradient se maintient (équilibre dynamique, avec dépense d'ATP).", atp.value === 0 || st.na > 40 ? "bad" : "ok");
    });
  }
});
