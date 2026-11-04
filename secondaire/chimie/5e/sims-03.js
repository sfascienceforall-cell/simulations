/* Chapitre 3 · Géométrie des molécules et solides cristallins */
C5.rot = function(v, yaw, pitch){
  var x1 = v[0] * Math.cos(yaw) + v[2] * Math.sin(yaw), z1 = -v[0] * Math.sin(yaw) + v[2] * Math.cos(yaw);
  var y2 = v[1] * Math.cos(pitch) - z1 * Math.sin(pitch), z2 = v[1] * Math.sin(pitch) + z1 * Math.cos(pitch);
  return [x1, y2, z2];
};
C5.drag3d = function(c, st){   /* le pointeur fait tourner la molécule ; st = {yaw, pitch} */
  var last = null;
  c.pointer(function(type, p){
    if (type === "down"){ last = p; }
    else if (type === "drag" && last){ st.yaw += (p.x - last.x) * 0.012; st.pitch = Math.max(-1.4, Math.min(1.4, st.pitch + (p.y - last.y) * 0.012)); last = p; st.dirty = true; }
    else if (type === "up"){ last = null; }
  });
};

SFA.sim({
  id: "c5-c03-vsepr", ch: "c03", tag: "Classique",
  titre: "VSEPR : la forme vient des doublets qui se repoussent",
  resume: "Doublets liants et non liants autour de l'atome central → forme 3D et angles.",
  but: "Choisis le nombre de doublets liants et non liants. Fais tourner la molécule en glissant le doigt ou la souris. Retrouve H₂O (2 liants, 2 non liants), NH₃, CH₄, CO₂…",
  aRetenir: "On compte les doublets autour de l'atome central (liants + non liants) : 2 → linéaire (180°), 3 → triangle (120°), 4 → tétraèdre (109,5°), 5 → bipyramide trigonale, 6 → octaèdre (90°). Les doublets non liants occupent de la place mais ne sont pas « vus » dans le nom de la forme.",
  piege: "Le schéma de Lewis est plat : la molécule, elle, est en 3D. Et la forme de H₂O (coudée) n'est PAS celle des doublets (tétraèdre) : on nomme la forme d'après les atomes seulement. Les doublets non liants repoussent un peu plus fort : les vrais angles (107° pour NH₃, 104,5° pour H₂O) sont un peu plus petits que 109,5°.",
  build: function(k, S){
    var pal = S.draw.palette, st = {yaw: 0.6, pitch: 0.35};
    var TET = [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(function(v){ return v.map(function(x){ return x / Math.sqrt(3); }); });
    var DIR = {2: [[1,0,0],[-1,0,0]], 3: [[1,0,0],[-0.5,0.866,0],[-0.5,-0.866,0]], 4: TET,
      5: [[1,0,0],[-0.5,0.866,0],[-0.5,-0.866,0],[0,0,1],[0,0,-1]], 6: [[0,0,1],[0,0,-1],[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]]};
    var TAB = {
      "2,0": ["linéaire", "180°", "CO₂, BeCl₂"], "3,0": ["triangulaire plane", "120°", "BF₃"], "2,1": ["coudée", "≈ 120° (SO₂ : 119°)", "SO₂"],
      "4,0": ["tétraédrique", "109,5°", "CH₄"], "3,1": ["pyramidale à base triangulaire", "≈ 107° (NH₃)", "NH₃"], "2,2": ["coudée", "≈ 104,5° (H₂O)", "H₂O"],
      "5,0": ["bipyramide trigonale", "90° et 120°", "PCl₅"], "4,1": ["en bascule", "< 90° et < 120°", "SF₄"], "3,2": ["en T", "≈ 90°", "ClF₃"], "2,3": ["linéaire", "180°", "XeF₂"],
      "6,0": ["octaédrique", "90°", "SF₆"], "5,1": ["pyramide à base carrée", "≈ 90°", "BrF₅"], "4,2": ["plane carrée", "90°", "XeF₄"]
    };
    var c = k.canvas(300);
    var b = k.slider("Doublets liants (atomes liés)", 2, 6, 1, 2, "");
    var l = k.slider("Doublets non liants", 0, 3, 1, 2, "");
    var auto = k.toggle("Rotation automatique", true);
    var ro = k.readouts(["Doublets autour de A", "Forme de la molécule", "Angles idéaux", "Exemple"]);
    var nt = k.note("", "");
    C5.drag3d(c, st);
    var lp = k.loop(function(dt){ if (auto.value && !st.dirty) st.yaw += dt * 0.5; st.dirty = false; k.redraw(); }); lp.play();
    k.draw(function(){
      var nb = b.value, nl = l.value, tot = nb + nl, key = nb + "," + nl; c.clear();
      var info = TAB[key];
      if (!info){
        S.draw.text(c, "A", c.W / 2, c.H / 2, {size: 40, math: true});
        ro.set(0, tot); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—");
        nt.set(tot > 6 ? "Plus de 6 doublets autour de l'atome central : non traité à ce niveau." : "Cette combinaison n'est pas courante : elle ne figure pas dans le programme.", "warn"); return;
      }
      var dirs = DIR[tot], R = Math.min(105, c.H / 2 - 30), cx = c.W / 2, cy = c.H / 2, items = [], i;
      for (i = 0; i < tot; i++){
        var v = C5.rot(dirs[i], st.yaw, st.pitch); items.push({v: v, lone: i < nl});
      }
      items.sort(function(p, q){ return p.v[2] - q.v[2]; });
      var drawn = false, ctx = c.ctx;
      function proj(v, f){ var s = 1 / (1 - 0.1 * v[2]); return [cx + R * f * v[0] * s, cy - R * f * v[1] * s, s]; }
      items.forEach(function(it){
        if (!drawn && it.v[2] > 0){ C5.atom(c, cx, cy, 17, "#cfe4d8", "A"); drawn = true; }
        var p = proj(it.v, 1);
        if (it.lone){
          var q = proj(it.v, 0.62), ang = Math.atan2(p[1] - cy, p[0] - cx);
          ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate(ang); ctx.globalAlpha = 0.5; ctx.fillStyle = "#f6c6c6"; ctx.strokeStyle = pal.red; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.ellipse(0, 0, 26 * q[2], 14 * q[2], 0, 0, 2 * Math.PI); ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
          S.draw.dot(c, q[0] - 5 * Math.cos(ang), q[1] - 5 * Math.sin(ang), 2.5, pal.red); S.draw.dot(c, q[0] + 5 * Math.cos(ang), q[1] + 5 * Math.sin(ang), 2.5, pal.red);
        } else {
          S.draw.line(c, cx, cy, p[0], p[1], pal.ink, 3.2);
          C5.atom(c, p[0], p[1], 12 * p[2], "#f6d9a8", "X");
        }
      });
      if (!drawn) C5.atom(c, cx, cy, 17, "#cfe4d8", "A");
      S.draw.text(c, "● doublet non liant  — liaison A–X", 8, c.H - 10, {size: 12, align: "left", color: pal.grey});
      ro.set(0, tot + " (" + nb + " liants + " + nl + " non liants)"); ro.set(1, info[0]); ro.set(2, info[1]); ro.set(3, info[2]);
      nt.set(nl > 0 ? "Les " + nl + " doublet(s) non liant(s) occupent de l'espace (ovales roses) mais on ne les compte pas dans le nom : la forme est celle des atomes X autour de A." : "Aucun doublet non liant : la forme est celle des doublets.", "");
    });
  }
});

SFA.sim({
  id: "c5-c03-polarite", ch: "c03", tag: "3D",
  titre: "Polarité globale : somme de vecteurs",
  resume: "Chaque liaison a un dipôle ; la molécule est polaire seulement si la somme n'est pas nulle.",
  but: "Choisis une molécule et fais-la tourner. Affiche les dipôles de liaison puis la résultante. Compare CO₂ et H₂O, CH₄ et CH₃Cl.",
  aRetenir: "Une molécule est polaire si la somme vectorielle de ses dipôles de liaison n'est pas nulle. Il faut donc ΔEN ≠ 0 ET une géométrie qui ne compense pas les dipôles. CO₂, BF₃, CH₄, CCl₄ : liaisons polaires, molécule apolaire.",
  piege: "« Liaison polaire » ne veut pas dire « molécule polaire ». Remplacer un seul atome dans une molécule symétrique casse la symétrie : CH₄ est apolaire, CH₃Cl est polaire. Ici le dipôle est représenté par ΔEN (unités arbitraires), pas par un vrai moment dipolaire en debye.",
  build: function(k, S){
    var pal = S.draw.palette, EN = C5.EN, st = {yaw: 0.5, pitch: 0.3};
    var TET = [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(function(v){ return v.map(function(x){ return x / Math.sqrt(3); }); });
    function bent(th){ var h = th * Math.PI / 360; return [[Math.cos(h), Math.sin(h), 0], [Math.cos(h), -Math.sin(h), 0]]; }
    function pyr(th){ var s = 2 / Math.sqrt(3) * Math.sin(th * Math.PI / 360), ca = Math.sqrt(1 - s * s), o = []; for (var i = 0; i < 3; i++){ var a = i * 2 * Math.PI / 3; o.push([s * Math.cos(a), s * Math.sin(a), -ca]); } return o; }
    var TRI = [[1,0,0],[-0.5,0.866,0],[-0.5,-0.866,0]];
    function M(name, cen, lig, dirs){ return {name: name, cen: cen, lig: lig, dirs: dirs}; }
    var MOL = {
      CO2: M("CO₂", "C", ["O", "O"], [[1,0,0],[-1,0,0]]),
      H2O: M("H₂O", "O", ["H", "H"], bent(104.5)),
      NH3: M("NH₃", "N", ["H", "H", "H"], pyr(107)),
      BF3: M("BF₃", "B", ["F", "F", "F"], TRI),
      SO2: M("SO₂", "S", ["O", "O"], bent(119)),
      CH4: M("CH₄", "C", ["H", "H", "H", "H"], TET),
      CCl4: M("CCl₄", "C", ["Cl", "Cl", "Cl", "Cl"], TET),
      CH3Cl: M("CH₃Cl", "C", ["H", "H", "H", "Cl"], TET),
      CHCl3: M("CHCl₃", "C", ["H", "Cl", "Cl", "Cl"], TET)
    };
    var c = k.canvas(300);
    var sel = k.select("Molécule", Object.keys(MOL).map(function(x){ return [x, MOL[x].name]; }), "H2O");
    var showB = k.toggle("Montrer les dipôles de liaison", true), showN = k.toggle("Montrer la résultante", true);
    var ro = k.readouts(["Liaisons polaires ?", "Résultante", "Molécule"]);
    var nt = k.note("", "");
    C5.drag3d(c, st);
    var lp = k.loop(function(dt){ if (!st.dirty) st.yaw += dt * 0.35; st.dirty = false; k.redraw(); }); lp.play();
    k.draw(function(){
      var m = MOL[sel.value]; c.clear();
      var cx = c.W / 2, cy = c.H / 2, R = 95, net = [0, 0, 0], items = [], ctx = c.ctx, anyPolar = false;
      m.dirs.forEach(function(u, i){
        var d = EN[m.lig[i]] - EN[m.cen]; if (Math.abs(d) >= 0.5) anyPolar = true;
        net[0] += d * u[0]; net[1] += d * u[1]; net[2] += d * u[2];
        items.push({u: u, d: d, lab: m.lig[i]});
      });
      var mag = Math.hypot(net[0], net[1], net[2]); if (mag < 0.02) mag = 0;
      items.forEach(function(it){ it.v = C5.rot(it.u, st.yaw, st.pitch); });
      items.sort(function(p, q){ return p.v[2] - q.v[2]; });
      function P(v, f){ var s = 1 / (1 - 0.1 * v[2]); return [cx + R * f * v[0] * s, cy - R * f * v[1] * s, s]; }
      var drawnC = false;
      items.forEach(function(it){
        if (!drawnC && it.v[2] > 0){ C5.atom(c, cx, cy, 16, "#cfe4d8", m.cen); drawnC = true; }
        var p = P(it.v, 1); S.draw.line(c, cx, cy, p[0], p[1], pal.ink, 3);
        C5.atom(c, p[0], p[1], 13 * p[2], it.lab === "H" ? "#ffffff" : "#f6d9a8", it.lab);
        if (showB.value && Math.abs(it.d) >= 0.3){   /* flèche : de δ+ vers δ− */
          var a = P(it.v, it.d > 0 ? 0.30 : 0.80), z = P(it.v, it.d > 0 ? 0.80 : 0.30);
          S.draw.arrow(c, a[0], a[1] + 10, z[0], z[1] + 10, pal.acc, 2.6);
        }
      });
      if (!drawnC) C5.atom(c, cx, cy, 16, "#cfe4d8", m.cen);
      if (showN.value && mag > 0){
        var nv = C5.rot([net[0] / mag, net[1] / mag, net[2] / mag], st.yaw, st.pitch), L = 40 + mag * 38;
        S.draw.arrow(c, cx - nv[0] * L * 0.3, cy + nv[1] * L * 0.3 - 0, cx + nv[0] * L, cy - nv[1] * L, pal.red, 4.2);
        S.draw.text(c, "résultante", cx + nv[0] * L, cy - nv[1] * L - 14, {size: 12, color: pal.red});
      } else if (showN.value) S.draw.text(c, "résultante nulle", cx, c.H - 16, {size: 14, color: pal.green});
      S.draw.text(c, "flèche bleue : dipôle de liaison", 6, 12, {size: 12, align: "left", color: pal.grey});
      ro.set(0, anyPolar ? "oui" : "non (ΔEN < 0,5)"); ro.set(1, mag ? S.fmt(mag, 1) + " (unités ΔEN)" : "nulle"); ro.set(2, mag ? "polaire" : "apolaire");
      nt.set(mag ? "Les dipôles ne se compensent pas : un côté est δ⁻, l'autre δ⁺." : (anyPolar ? "Les liaisons sont polaires, mais la symétrie annule la somme : molécule apolaire." : "Presque aucune différence d'électronégativité : molécule apolaire."), mag ? "" : "ok");
    });
  }
});

SFA.sim({
  id: "c5-c03-solides", ch: "c03", tag: "Comparaison",
  titre: "Cinq solides, cinq structures, cinq comportements",
  resume: "NaCl, cuivre, diiode, diamant, graphite : structure → propriétés. Chauffe, frappe, branche.",
  but: "Choisis un solide, regarde sa structure, puis chauffe-le (curseur), frappe-le au marteau et branche une pile. Compare les cinq.",
  aRetenir: "Ionique : dur et cassant, fusion élevée, conduit fondu/dissous. Métallique : malléable, conduit toujours. Moléculaire : mou, fusion basse (forces faibles entre molécules). Covalent réticulaire : très dur, fusion très élevée (diamant), mais le graphite, en couches, est mou et conducteur.",
  piege: "Diamant et graphite sont tous deux du carbone pur : c'est l'arrangement des atomes qui change tout. Ne confonds pas « liaison covalente forte » (dans la molécule I₂ ou le réseau) et « forces faibles » entre les molécules : quand I₂ fond, on ne casse pas les liaisons I–I.",
  build: function(k, S){
    var pal = S.draw.palette;
    var D = {
      NaCl: {n: "Chlorure de sodium NaCl", type: "ionique", mp: 801, bp: 1413, dur: "dur mais cassant", cs: "non", cf: "oui (fondu ou dissous)", sol: "soluble dans l'eau",
             mart: "Le cristal se casse net (clivage) : les ions de même signe se retrouvent face à face.", pile: "Pas de courant : les ions sont bloqués dans le réseau."},
      Cu: {n: "Cuivre Cu", type: "métallique", mp: 1085, bp: 2562, dur: "malléable, ductile", cs: "oui", cf: "oui", sol: "insoluble",
           mart: "Le métal se déforme sans se casser : les cations glissent dans la mer d'électrons.", pile: "Courant : les électrons délocalisés circulent librement."},
      I2: {n: "Diiode I₂", type: "moléculaire", mp: 114, bp: 184, dur: "mou, friable", cs: "non", cf: "non", sol: "très peu soluble dans l'eau",
           mart: "Il s'émiette facilement : seules de faibles forces tiennent les molécules entre elles.", pile: "Pas de courant : pas de charges mobiles."},
      C: {n: "Diamant C", type: "covalent (réseau 3D)", mp: 3500, bp: 99999, dur: "le plus dur des matériaux naturels", cs: "non", cf: "—", sol: "insoluble",
          mart: "Il ne se déforme pas : chaque atome est lié à 4 voisins par des liaisons covalentes fortes.", pile: "Pas de courant : tous les électrons sont engagés dans les liaisons."},
      G: {n: "Graphite C", type: "covalent (couches)", mp: 3500, bp: 99999, dur: "mou (il marque le papier)", cs: "oui, dans les couches", cf: "—", sol: "insoluble",
          mart: "Les couches glissent les unes sur les autres : c'est pourquoi le graphite écrit.", pile: "Un courant passe : un électron par atome est délocalisé dans la couche."}
    };
    var c = k.canvas(250);
    var sel = k.select("Solide", Object.keys(D).map(function(x){ return [x, D[x].n]; }), "NaCl");
    var T = k.slider("Température", 0, 2000, 10, 20, "°C");
    var act = k.seg("Action", [["rien", "Observer"], ["marteau", "Frapper"], ["pile", "Brancher une pile"]], "rien");
    var ro = k.readouts(["Type de solide", "État à cette température", "Dureté", "Fusion", "Conduit (solide)", "Conduit (fondu)"]);
    var nt = k.note("", "");
    var parts = [], i; for (i = 0; i < 40; i++) parts.push({x: Math.random(), y: Math.random(), a: Math.random() * 6.28, i: i});
    var lp = k.loop(function(dt){ parts.forEach(function(p){ p.a += (Math.random() - 0.5) * 2; }); k.redraw(); }); lp.play();
    function stateOf(d, t){ return t < d.mp ? "solide" : t < d.bp ? "liquide" : "gaz"; }
    k.draw(function(){
      var key = sel.value, d = D[key], t = T.value, state = stateOf(d, t), ctx = c.ctx; c.clear();
      var x0 = 24, y0 = 40, w = c.W - 48, h = 190, a = Math.min(44, w / 8);
      ctx.fillStyle = "#f6f8fb"; ctx.fillRect(x0, y0, w, h); ctx.strokeStyle = pal.light; ctx.strokeRect(x0, y0, w, h);
      var amp = state === "solide" ? 1 + t / 700 : 0;
      var rows = 4, cols = Math.floor(w / a) - 1, jx = function(p){ return Math.cos(p.a) * amp; }, jy = function(p){ return Math.sin(p.a) * amp; };
      var offx = x0 + (w - (cols - 1) * a) / 2, offy = y0 + 30;
      if (state === "solide"){
        var n = 0;
        for (var r = 0; r < rows; r++) for (var q = 0; q < cols; q++, n++){
          var p = parts[n % parts.length], X = offx + q * a + jx(p), Y = offy + r * a * 0.95 + jy(p);
          if (key === "NaCl") C5.atom(c, X, Y, a * 0.32, (q + r) % 2 ? "#c6d6f6" : "#f6c6c6", (q + r) % 2 ? "−" : "+");
          else if (key === "Cu"){ C5.atom(c, X, Y, a * 0.3, "#f6c6c6", "+"); S.draw.dot(c, X + a * 0.5 + jx(p) * 2, Y + a * 0.35 + jy(p) * 2, 2.5, pal.acc); }
          else if (key === "I2"){ if (q % 2 === 0){ S.draw.line(c, X, Y, X + a * 0.5, Y, pal.ink, 2); C5.atom(c, X, Y, a * 0.2, "#d8c6f6", ""); C5.atom(c, X + a * 0.5, Y, a * 0.2, "#d8c6f6", ""); } }
          else if (key === "C"){ C5.atom(c, X, Y, a * 0.18, "#555", ""); if (q < cols - 1) S.draw.line(c, X, Y, X + a, Y, pal.ink, 2); if (r < rows - 1){ S.draw.line(c, X, Y, X, Y + a * 0.95, pal.ink, 2); S.draw.line(c, X, Y, X + a, Y + a * 0.95, pal.grey, 1.2); } }
          else if (key === "G"){ C5.atom(c, X, Y, a * 0.16, "#555", ""); if (q < cols - 1 && (q + r) % 2 === 0) S.draw.line(c, X, Y, X + a, Y, pal.ink, 2); if (r < rows - 1 && (q + r) % 2 === 1) S.draw.line(c, X, Y, X, Y + a * 0.95, pal.ink, 2); }
        }
        if (key === "I2") S.draw.text(c, "I–I : liaison covalente ; entre molécules : forces faibles", c.W / 2, y0 + h - 14, {size: 12, color: pal.grey});
        if (key === "G"){ S.draw.line(c, x0 + 6, offy + 1.45 * a, x0 + w - 6, offy + 1.45 * a, pal.red, 1.2, [5, 4]); S.draw.text(c, "plan de glissement (forces faibles entre couches)", c.W / 2, y0 + h - 14, {size: 12, color: pal.red}); }
      } else {
        var nn = 34, sp = state === "liquide" ? 0.45 : 1; var hh = state === "liquide" ? h * 0.55 : h;
        for (var j = 0; j < nn; j++){
          var p2 = parts[j], px = x0 + 10 + ((p2.x * 997 + j * 31 + Math.sin(p2.a * 0.3 + j) * 18 * sp) % 1 + 1) % 1 * (w - 20), py = y0 + h - 12 - (((p2.y * 777 + j * 17) % 1 + 1) % 1) * (hh - 20) + Math.cos(p2.a + j) * 8 * sp;
          C5.atom(c, px, py, 7, key === "NaCl" ? (j % 2 ? "#c6d6f6" : "#f6c6c6") : key === "Cu" ? "#f6c6c6" : "#d8c6f6", "");
        }
      }
      S.draw.text(c, d.n + " — " + state + " à " + t + " °C", c.W / 2, 18, {size: 13});
      var big = d.mp >= 3500;
      var res = act.value === "marteau" ? d.mart : act.value === "pile" ? d.pile : "";
      if (act.value === "pile" && state !== "solide" && key === "NaCl") res = "Fondu : les ions sont libres de se déplacer : le courant passe.";
      if (act.value === "marteau" && state !== "solide") res = "À cette température ce n'est plus un solide : rien à frapper.";
      ro.set(0, d.type); ro.set(1, big ? "solide (jusqu'à ≈ 3 500 °C)" : state); ro.set(2, d.dur); ro.set(3, big ? "≈ 3 500 °C et plus" : d.mp + " °C"); ro.set(4, d.cs); ro.set(5, d.cf);
      nt.set(res || (state === "solide" ? "Chauffe pour voir la fusion : cela dépend des forces qui retiennent les particules." : "Les particules ont quitté leurs positions fixes : on casse les forces qui tiennent le solide."), res ? "" : "");
    });
  }
});

SFA.sim({
  id: "c5-c03-glace", ch: "c03", tag: "Niche utile",
  titre: "Pourquoi la glace flotte-t-elle ?",
  resume: "Densité de l'eau liquide selon T, densité de la glace : combien dépasse du verre ?",
  but: "Plonge un glaçon dans de l'eau douce, de l'eau de mer ou de l'éthanol, à la température de ton choix. Lis la part immergée, puis regarde la vue moléculaire.",
  aRetenir: "Un corps flotte si sa masse volumique est plus petite que celle du liquide. Part immergée = ρ(glaçon) / ρ(liquide). La glace (0,917 g/cm³) est moins dense que l'eau liquide (≈ 1,000 g/cm³) : ses liaisons hydrogène forment un réseau ouvert en hexagones. L'eau liquide est la plus dense à 4 °C.",
  piege: "Presque tous les solides coulent dans leur propre liquide : l'eau est une exception. Dans l'éthanol (0,79 g/cm³) un glaçon coulerait. Ce modèle suppose que le glaçon n'a pas le temps de fondre. Les valeurs sont celles de tables, arrondies.",
  build: function(k, S){
    var pal = S.draw.palette, RHO_ICE = 0.917;
    var TT = [0, 4, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], RR = [0.99984, 0.99997, 0.99970, 0.99821, 0.99565, 0.99222, 0.98803, 0.98320, 0.97778, 0.97182, 0.96535, 0.95835];
    function rhoW(t){ for (var i = 0; i < TT.length - 1; i++) if (t <= TT[i + 1]) return RR[i] + (RR[i + 1] - RR[i]) * (t - TT[i]) / (TT[i + 1] - TT[i]); return RR[RR.length - 1]; }
    var c = k.canvas(220), g = k.canvas(200);
    var liq = k.seg("Liquide", [["eau", "Eau pure"], ["mer", "Eau de mer"], ["eth", "Éthanol"]], "eau");
    var T = k.slider("Température du liquide", 0, 100, 1, 4, "°C");
    var mol = k.toggle("Vue moléculaire à la place du graphe", false);
    var ro = k.readouts(["Masse volumique du liquide", "Masse volumique de la glace", "Part immergée", "Verdict"]);
    var nt = k.note("", "");
    function rho(){ return liq.value === "eau" ? rhoW(T.value) : liq.value === "mer" ? 1.025 : 0.789; }
    k.draw(function(){
      var r = rho(), f = RHO_ICE / r, ctx = c.ctx; c.clear(); g.clear();
      var bx = c.W / 2 - 100, bw = 200, by = 20, bh = 180;
      ctx.fillStyle = liq.value === "eth" ? "#e8f0fb" : "#cfe4f6"; ctx.fillRect(bx, by + 40, bw, bh - 40);
      ctx.strokeStyle = pal.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
      var s = 64, wl = by + 40;   /* niveau de l'eau */
      var cy;
      if (f < 1){ cy = wl - s * (1 - f); } else { cy = by + bh - s - 2; }
      ctx.fillStyle = "rgba(235,246,255,.92)"; ctx.fillRect(c.W / 2 - s / 2, cy, s, s); ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.strokeRect(c.W / 2 - s / 2, cy, s, s);
      S.draw.text(c, "glace", c.W / 2, cy + s / 2, {size: 13, color: pal.acc});
      S.draw.line(c, bx, wl, bx + bw, wl, pal.acc, 1.5, [5, 4]);
      if (f < 1) S.draw.text(c, S.fmt((1 - f) * 100, 1) + " % dépasse", c.W / 2 + s / 2 + 8, wl - 16, {size: 12, align: "left", color: pal.red});
      var ax = S.draw.axes(g, {x0: 0, x1: 100, y0: 0.95, y1: 1.002, xl: "T (°C)", stepX: 10, stepY: 0.01, l: 52, t: 26});
      if (mol.value){
        g.clear(); var ctx2 = g.ctx, gw = g.W / 2;
        S.draw.text(g, "Glace : réseau ouvert", gw / 2, 12, {size: 12}); S.draw.text(g, "Eau liquide : plus compact", gw + gw / 2, 12, {size: 12});
        /* glace : hexagones, 7 molécules par motif ; liquide : même aire, 8 molécules */
        for (var h = 0; h < 2; h++) for (var q = 0; q < 2; q++){
          var hx = gw / 2 - 40 + h * 52 - (q ? 26 : 0) + 20, hy = 56 + q * 46, i2;
          for (i2 = 0; i2 < 6; i2++){ var an = i2 * Math.PI / 3, X = hx + 24 * Math.cos(an), Y = hy + 24 * Math.sin(an), an2 = (i2 + 1) * Math.PI / 3;
            S.draw.line(g, X, Y, hx + 24 * Math.cos(an2), hy + 24 * Math.sin(an2), pal.acc, 1.5, [3, 3]); }
          for (i2 = 0; i2 < 6; i2++) C5.atom(g, hx + 24 * Math.cos(i2 * Math.PI / 3), hy + 24 * Math.sin(i2 * Math.PI / 3), 5, "#c6d6f6", "");
        }
        var pts = [[.15,.3],[.5,.2],[.82,.28],[.3,.52],[.65,.5],[.12,.75],[.45,.82],[.8,.78],[.6,.9],[.28,.95]];
        pts.forEach(function(p){ C5.atom(g, gw + 14 + p[0] * (gw - 28), 30 + p[1] * (g.H - 50), 5, "#c6d6f6", ""); });
        S.draw.text(g, "··· liaison H", gw / 2, g.H - 10, {size: 12, color: pal.acc});
      } else {
        S.draw.fn(g, ax, rhoW, pal.acc, 2.6);
        S.draw.text(g, "ρ de l'eau liquide (g/cm³)", 8, 10, {size: 12, align: "left", color: pal.grey});
        S.draw.dot(g, ax.X(4), ax.Y(rhoW(4)), 5, pal.green); S.draw.text(g, "maximum à 4 °C", ax.X(4) + 8, ax.Y(rhoW(4)) + 16, {size: 12, color: pal.green, align: "left"});
        if (liq.value === "eau") S.draw.dot(g, ax.X(T.value), ax.Y(rhoW(T.value)), 7, pal.red);
        S.draw.text(g, "(glace : 0,917, sous le bas du graphe)", g.W - 8, 10, {size: 12, color: pal.grey, align: "right"});
      }
      ro.set(0, S.fmt(r, liq.value === "eau" ? 5 : 3) + " g/cm³"); ro.set(1, "0,917 g/cm³"); ro.set(2, f < 1 ? S.fmt(f * 100, 1) + " %" : "100 % (coule)"); ro.set(3, f < 1 ? "flotte" : "coule");
      nt.set(f >= 1 ? "Dans l'éthanol, moins dense que la glace, le glaçon coule : un solide qui coule dans son liquide, comme presque tous les solides." : liq.value === "mer" ? "L'eau de mer est plus dense : le glaçon s'enfonce moins (les icebergs de glace d'eau douce flottent très bien)." : T.value === 4 ? "À 4 °C l'eau liquide est à sa masse volumique maximale." : "La part immergée dépend de ρ(glace) / ρ(eau).", "");
    });
  }
});
