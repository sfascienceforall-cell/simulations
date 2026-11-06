/* Biologie BA1 · chapitre 8 : cycle cellulaire, division et embryologie */
(function(){
function glyph(c, x, y, chromatids, col){
  var ctx = c.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = "round";
  if (chromatids === 2){ ctx.beginPath(); ctx.moveTo(x - 5, y - 11); ctx.lineTo(x + 5, y + 11); ctx.moveTo(x + 5, y - 11); ctx.lineTo(x - 5, y + 11); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(x, y - 11); ctx.lineTo(x, y + 11); ctx.stroke(); }
  ctx.restore();
}

/* 1. Mitose contre méiose */
SFA.sim({
  id:"ub-c08-mitose-meiose", ch:"c08", tag:"Piège classique",
  titre:"Mitose contre méiose : chromosomes, chromatides, ADN",
  resume:"À chaque étape : combien de chromosomes, de chromatides, de cellules, quelle quantité d'ADN ?",
  but:"Choisis le type de division et le nombre 2n, avance dans le processus et lis les quatre nombres à chaque étape.",
  aRetenir:"On compte les chromosomes par les centromères. Mitose : 2n → 2n ; l'anaphase double momentanément le nombre de chromosomes (4n) car les chromatides sœurs deviennent des chromosomes. Méiose : l'anaphase I sépare les homologues (le nombre de chromosomes passe de 2n à n par cellule, chaque chromosome garde 2 chromatides), l'anaphase II sépare les chromatides. Quantité d'ADN (c = ADN d'un gamète) : G1 2c ; après S 4c ; après méiose I 2c par cellule ; gamète 1c.",
  piege:"« Une cellule en métaphase II a n chromosomes à 2 chromatides, donc 2c ». À l'anaphase II elle a 2n chromosomes (chromatides séparées), mais toujours 2c d'ADN. Ne confonds pas le nombre de chromosomes (centromères) avec le nombre de chromatides.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette;
    var mode = k.seg("Division", [["mi","Mitose"],["me","Méiose"]], "mi");
    var dn = k.select("Nombre de chromosomes 2n", [["4","4 (modèle)"],["6","6"],["8","8"],["46","46 (humain)"]], "4");
    var av = k.slider("Avancement", 0, 100, 1, 10, "%");
    var ro = k.readouts(["Étape","Chromosomes / cellule","Chromatides / cellule","ADN / cellule","Cellules"]);
    var note = k.note("", "ok");
    /* étapes : [nom, chromosomes (en n), chromatides (en n), ADN (c), cellules, chromatides par chromosome] */
    var MI = [["G1",2,2,"2c",1,1],["Fin de S / G2",2,4,"4c",1,2],["Prophase – métaphase",2,4,"4c",1,2],["Anaphase",4,4,"4c",1,1],["Télophase et cytocinèse (par cellule fille)",2,2,"2c",2,1]];
    var ME = [["G1",2,2,"2c",1,1],["Prophase I (bivalents, crossing-over)",2,4,"4c",1,2],["Métaphase I",2,4,"4c",1,2],["Anaphase I",2,4,"4c",1,2],["Fin de la méiose I (par cellule)",1,2,"2c",2,2],["Métaphase II (par cellule)",1,2,"2c",2,2],["Anaphase II (par cellule)",2,2,"2c",2,1],["Gamètes (par cellule)",1,1,"1c",4,1]];
    k.draw(function(){
      c.clear();
      var L = mode.value === "mi" ? MI : ME, i = Math.min(L.length - 1, Math.floor(av.value / 100 * L.length)), st = L[i], n2 = parseInt(dn.value, 10), nn = n2 / 2;
      var chrs = st[1] * nn, chrt = st[2] * nn, cells = st[4];
      var w = (c.W - 40) / Math.max(cells, 1) , ctx = c.ctx;
      S.draw.text(c, st[0], c.W / 2, 22, {size:15});
      for (var q = 0; q < cells; q++){
        var cx = 20 + q * w + w / 2, cy = 150, r = Math.min(w / 2 - 6, 105);
        ctx.fillStyle = "#eef2f8"; ctx.strokeStyle = pal.grey; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.3); ctx.fill(); ctx.stroke();
        if (chrs <= 16){
          var cols = Math.min(chrs, 4), rows = Math.ceil(chrs / cols);
          for (var j = 0; j < chrs; j++){
            var sxp = Math.min(26, (2 * r - 20) / cols), syp = Math.min(34, (2 * r - 30) / rows), gx = cx + ((j % cols) - (cols - 1) / 2) * sxp, gy = cy + (Math.floor(j / cols) - (rows - 1) / 2) * syp;
            glyph(c, gx, gy, st[5], j % 2 === 0 ? pal.red : pal.acc);
          }
        } else S.draw.text(c, chrs + " chromosomes", cx, cy, {size:13});
      }
      S.draw.text(c, "rouge / bleu = origine maternelle / paternelle (le crossing-over mélange en réalité les segments)", c.W / 2, 282, {size:10, weight:600, color:pal.grey});
      ro.set(0, i + 1 + "/" + L.length); ro.set(1, chrs); ro.set(2, chrt); ro.set(3, st[3]); ro.set(4, cells);
      note.set(mode.value === "mi" ? "Mitose : deux cellules filles génétiquement identiques, 2n chromosomes chacune." : "Méiose : une cellule 2n donne 4 cellules haploïdes (n) génétiquement différentes.", "ok");
    });
  }
});

/* 2. Cycle cellulaire et points de contrôle */
SFA.sim({
  id:"ub-c08-cycle-controle", ch:"c08", tag:"Cancer",
  titre:"Cycle cellulaire, p53 et accumulation de mutations",
  resume:"Durée des phases, croissance d'une population, rôle du point de contrôle de p53.",
  but:"Règle la durée des phases, la fréquence des lésions de l'ADN et le statut de p53 : compare la croissance et la fraction de cellules mutées.",
  aRetenir:"Cycle = G1 + S + G2 + M. Les points de contrôle (G1/S, G2/M, métaphase-anaphase) arrêtent le cycle tant que l'ADN est lésé ou incomplet : p53 active p21, inhibiteur de CDK, puis réparation ou apoptose. Si p53 est inactivée (mutée dans environ la moitié des cancers), les cellules lésées prolifèrent : les mutations s'accumulent.",
  piege:"Population : N = N₀·2<sup>t/T</sup> sans perte ; l'apoptose réduit le facteur de 2 à 2(1 − δ·a) par cycle. Les phases n'ont pas la même durée : G1 est la plus variable (la phase M ne dure que ≈ 1 h). Modèle très simplifié : δ constant, a = 90 % pour p53 fonctionnelle (hypothèse pédagogique).",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette;
    var g1 = k.slider("G1", 2, 16, 1, 10, "h");
    var s = k.slider("S", 4, 12, 1, 8, "h");
    var g2 = k.slider("G2", 1, 6, 1, 4, "h");
    var m = k.slider("M", 0.5, 2, 0.5, 1, "h");
    var dl = k.slider("Cellules lésées à chaque cycle (δ)", 0, 30, 1, 10, "%");
    var p53 = k.toggle("p53 fonctionnelle", true);
    var ro = k.readouts(["Durée du cycle","Population après 10 j","Cellules à ADN lésé non éliminé après 10 j","Cycles en 10 j"]);
    k.draw(function(){
      c.clear();
      var T = g1.value + s.value + g2.value + m.value, ncyc = 240 / T, d = dl.value / 100;
      var a = p53.value ? 0.9 : 0, fac = 2 * (1 - d * a);
      var mutf = 1 - Math.pow(1 - d * (1 - a), ncyc);
      var Nwt = Math.pow(2 * (1 - d * 0.9), ncyc), N = Math.pow(fac, ncyc), ctx = c.ctx;
      /* anneau des phases */
      var cx = 100, cy = 100, R = 70, ph = [["G1",g1.value,pal.acc],["S",s.value,pal.amber],["G2",g2.value,pal.green],["M",m.value,pal.red]], ang = -Math.PI / 2;
      ph.forEach(function(p){ var da = p[1] / T * 2 * Math.PI; ctx.fillStyle = p[2]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, ang, ang + da); ctx.closePath(); ctx.fill();
        var mid = ang + da / 2; S.draw.text(c, p[0], cx + Math.cos(mid) * (R + 14), cy + Math.sin(mid) * (R + 14), {size:11}); ang += da; });
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy, 34, 0, 6.3); ctx.fill();
      S.draw.text(c, S.fmt(T, 1) + " h", cx, cy, {size:14});
      S.draw.text(c, "Contrôles : G1/S, G2/M, M", 20, 250, {align:"left", size:11, weight:600, color:pal.grey});
      /* barres : population et mutées */
      var bx = 230, bw = c.W - bx - 20;
      var lg = function(v){ return Math.max(0, Math.log10(Math.max(v, 1))); };
      var mx = Math.max(6, lg(Nwt) + 1, lg(N) + 1);
      function bar(y, label, val, col, txt){ S.draw.text(c, label, bx, y - 16, {align:"left", size:11}); ctx.fillStyle = "#e3e7ed"; ctx.fillRect(bx, y - 8, bw, 16); ctx.fillStyle = col; ctx.fillRect(bx, y - 8, val / mx * bw, 16); S.draw.text(c, txt, bx + 4, y, {align:"left", size:10, color:"#fff"}); }
      bar(60, "log₁₀(population), p53 fonctionnelle", lg(Nwt), pal.green, S.sci(Nwt, 2));
      bar(120, "log₁₀(population), statut choisi", lg(N), p53.value ? pal.green : pal.red, S.sci(N, 2));
      S.draw.text(c, "Cellules à ADN lésé, non éliminées : " + S.fmt(mutf * 100, 1) + " %", bx, 170, {align:"left", size:12, color:pal.red});
      S.draw.text(c, "Lésées éliminées par cycle : " + S.fmt(d * a * 100, 1) + " %", bx, 195, {align:"left", size:12, color:pal.green});
      ro.set(0, S.fmt(T, 1) + " h"); ro.set(1, S.sci(N, 2)); ro.set(2, S.fmt(mutf * 100, 1) + " %"); ro.set(3, S.fmt(ncyc, 1));
    });
  }
});

/* 3. Brassage génétique */
SFA.sim({
  id:"ub-c08-brassage", ch:"c08", tag:"Combinatoire",
  titre:"Brassage génétique : combien de gamètes différents ?",
  resume:"2ⁿ gamètes par brassage interchromosomique ; le crossing-over multiplie encore.",
  but:"Choisis le nombre de paires de chromosomes n et combien d'entre elles ont un crossing-over entre deux locus hétérozygotes.",
  aRetenir:"Brassage interchromosomique : n paires → 2<sup>n</sup> gamètes ; humain (n = 23) : 2²³ = 8 388 608. Chaque paire avec un crossing-over entre deux locus hétérozygotes fournit 4 types de chromatides au lieu de 2 : gamètes = 2<sup>n+c</sup>. Fécondation : (2<sup>n+c</sup>)² zygotes possibles, soit (2²³)² ≈ 7·10¹³ sans crossing-over.",
  piege:"« 2ⁿ » suppose que chaque paire est hétérozygote pour au moins un gène : le nombre réel de gamètes différents dépend de l'hétérozygotie. Le crossing-over n'a d'effet de brassage que s'il se produit entre deux locus hétérozygotes. Deux frères ont une probabilité (1/2)ⁿ de recevoir le même gamète d'un parent.",
  build:function(k,S){
    var c = k.canvas(290), pal = S.draw.palette;
    var n = k.slider("Paires de chromosomes n", 1, 23, 1, 3, "");
    var cc = k.slider("Paires avec un crossing-over informatif c", 0, 23, 1, 0, "");
    var ro = k.readouts(["Gamètes différents","Zygotes possibles","Probabilité d'un gamète « tout maternel »"]);
    var note = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var nn = n.value, ct = Math.min(cc.value, nn);
      var ax = S.draw.axes(c, {x0:0, x1:23, y0:0, y1:15, xl:"n", yl:"log₁₀(gamètes)", stepX:5, stepY:3});
      S.draw.fn(c, ax, function(x){ return x * Math.log10(2); }, pal.acc);
      S.draw.fn(c, ax, function(x){ return 2 * x * Math.log10(2); }, pal.red, 2, [5, 4]);
      S.draw.text(c, "n paires (c = 0)", ax.X(14), ax.Y(14 * 0.301) + 14, {size:11, color:pal.acc});
      S.draw.text(c, "toutes les paires avec crossing-over (c = n)", ax.X(8), ax.Y(16 * 0.301) - 12, {size:11, color:pal.red});
      S.draw.dot(c, ax.X(nn), ax.Y((nn + ct) * Math.log10(2)), 6, pal.ink);
      var g = Math.pow(2, nn + ct);
      ro.set(0, g < 1e6 ? Math.round(g).toLocaleString("fr-BE") : S.sci(g, 2)); ro.set(1, S.sci(g * g, 2)); ro.set(2, "1/" + (Math.pow(2, nn) < 1e6 ? Math.pow(2, nn).toLocaleString("fr-BE") : S.sci(Math.pow(2, nn), 2)));
      note.set(cc.value > nn ? "Il ne peut pas y avoir plus de paires avec crossing-over que de paires de chromosomes : c est ramené à n = " + nn + "." : nn === 23 && ct === 0 ? "Humain sans crossing-over : 2²³ = 8 388 608 gamètes possibles par individu." : "Seules les paires hétérozygotes comptent ; 4<sup>c</sup>·2<sup>n−c</sup> = 2<sup>n+c</sup>.", "ok");
    });
  }
});

/* 4. Non-disjonction et caryotype */
SFA.sim({
  id:"ub-c08-caryotype", ch:"c08", tag:"Anomalies",
  titre:"Non-disjonction : trisomie 21, syndromes de Turner et de Klinefelter",
  resume:"Quels gamètes, quels caryotypes selon la méiose touchée et le parent ?",
  but:"Choisis la paire concernée, le parent, la division où la non-disjonction se produit, et lis les gamètes et les caryotypes obtenus avec un gamète normal.",
  aRetenir:"Non-disjonction en méiose I : les 4 gamètes sont anormaux (2 avec n+1, 2 avec n−1). En méiose II : 2 gamètes normaux, 1 n+1, 1 n−1. Après fécondation par un gamète normal : trisomie (2n+1) ou monosomie (2n−1). Monosomie autosomique : non viable ; syndrome de Turner 45,X ; Klinefelter 47,XXY ; trisomie 21 : 47,+21.",
  piege:"Le gamète n+1 d'une non-disjonction en méiose I contient les deux homologues (parfois différents : mère-père) ; en méiose II il contient deux chromatides sœurs identiques. Une monosomie 45,Y (sans X) n'est pas viable : le X porte des gènes essentiels.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette;
    var pr = k.seg("Paire", [["a","Chromosome 21"],["g","Paire sexuelle"]], "a");
    var pa = k.seg("Parent qui subit l'erreur", [["m","Mère (XX)"],["p","Père (XY)"]], "m");
    var dv = k.seg("Division", [["1","Méiose I"],["2","Méiose II"]], "1");
    var xy = k.seg("Père, méiose II : cellule II portant", [["X","X"],["Y","Y"]], "X");
    var ro = k.readouts(["Gamètes anormaux sur 4","Syndrome(s) viable(s)"]);
    var note = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var g;
      /* gamètes du parent : [libellé, nombre sur 4, nature (n normal, + excès, - manque), composition] */
      if (pr.value === "a") g = dv.value === "1" ? [["21 + 21",2,"+","21"],["aucun 21",2,"-",""]] : [["21 + 21 (chromatides sœurs)",1,"+","21"],["aucun 21",1,"-",""],["21 (normal)",2,"n","21"]];
      else if (pa.value === "m") g = dv.value === "1" ? [["XX",2,"+","XX"],["O (sans X)",2,"-",""]] : [["XX (sœurs)",1,"+","XX"],["O",1,"-",""],["X (normal)",2,"n","X"]];
      else if (dv.value === "1") g = [["XY",2,"+","XY"],["O",2,"-",""]];
      else g = xy.value === "X" ? [["XX (sœurs)",1,"+","XX"],["O",1,"-",""],["Y (normal)",2,"n","Y"]] : [["YY (sœurs)",1,"+","YY"],["O",1,"-",""],["X (normal)",2,"n","X"]];
      var partners = pr.value === "a" ? [["21",1]] : pa.value === "m" ? [["X",.5],["Y",.5]] : [["X",1]];
      var rows = [], viab = {};
      g.forEach(function(gm){
        partners.forEach(function(pt){
          var res;
          if (pr.value === "a"){
            if (gm[2] === "n") res = "46 normal"; else if (gm[2] === "+"){ res = "47,+21 : trisomie 21"; viab[res] = 1; } else res = "45,−21 : monosomie 21 (non viable)";
          } else {
            var comb = (gm[3] + pt[0]).split("").sort().join("");
            var tbl = {"XX":"46,XX normal","XY":"46,XY normal","XXX":"47,XXX (triple X)","XXY":"47,XXY : Klinefelter","XYY":"47,XYY","X":"45,X : Turner","Y":"45,Y (non viable)"};
            res = tbl[comb] || comb; if (/Turner|Klinefelter|triple|XYY/.test(res)) viab[res] = 1;
          }
          rows.push([gm[0] + " (×" + gm[1] + "/4) + " + pt[0], res]);
        });
      });
      S.draw.text(c, "Gamètes du parent touché, puis zygote avec un gamète normal de l'autre parent", 20, 20, {align:"left", size:12, weight:600});
      rows.forEach(function(r, j){
        var y = 54 + j * 30; S.draw.text(c, r[0], 20, y, {align:"left", size:12, weight:600});
        S.draw.text(c, "→  " + r[1], c.W / 2 - 10, y, {align:"left", size:12, color: /non viable/.test(r[1]) ? pal.red : /normal/.test(r[1]) ? pal.green : pal.amber});
      });
      var anorm = g.filter(function(x){ return x[2] !== "n"; }).reduce(function(a, b){ return a + b[1]; }, 0);
      ro.set(0, anorm + " / 4"); ro.set(1, Object.keys(viab).join(" ; ") || "—");
      note.set(dv.value === "1" ? "Méiose I : les homologues restent ensemble, TOUS les gamètes sont anormaux." : "Méiose II : seuls les gamètes issus de la cellule II touchée sont anormaux : 2 normaux sur 4.", "ok");
    });
  }
});

/* 5. Gamétogenèse et développement précoce */
SFA.sim({
  id:"ub-c08-gametogenese-embryon", ch:"c08", tag:"Embryologie",
  titre:"Gamétogenèse et premiers jours du développement",
  resume:"Spermatogenèse, ovogenèse (blocages) et chronologie de la fécondation à la gastrulation.",
  but:"Choisis une filière et fais avancer le curseur : ploïdie, quantité d'ADN, nombre de cellules et événements.",
  aRetenir:"Spermatogenèse : 1 spermatocyte I → 4 spermatozoïdes. Ovogenèse : 1 ovocyte I → 1 ovule + 2 ou 3 globules polaires (selon que le 1<sup>er</sup> se divise ou non) ; l'ovocyte I est bloqué en prophase I jusqu'à l'ovulation, puis l'ovocyte II en métaphase II jusqu'à la fécondation. Segmentation : divisions rapides sans croissance (blastomères de plus en plus petits), morula vers J4, blastocyste vers J5, implantation vers J6–7, gastrulation en 3<sup>e</sup> semaine : ectoderme, mésoderme, endoderme.",
  piege:"L'ovule « achève » sa méiose II seulement à la fécondation : l'ovocyte II ovulé n'est pas un gamète mûr. Les jours donnés sont des ordres de grandeur (J0 = fécondation, développement humain) et le nombre de cellules après J5 n'est pas une puissance de 2 exacte.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette;
    var mode = k.seg("Filière", [["sp","Spermatogenèse"],["ov","Ovogenèse"],["em","Embryon précoce"]], "sp");
    var av = k.slider("Avancement", 0, 100, 1, 0, "%");
    var ro = k.readouts(["Stade","Ploïdie","ADN","Cellules"]);
    var note = k.note("", "ok");
    var SP = [["Spermatogonie (puberté : mitoses)","2n","2c",1,"Réserve de cellules souches, divisions mitotiques."],["Spermatocyte I (après S)","2n","4c",1,"Prophase I : bivalents, crossing-over."],["Spermatocytes II (fin méiose I)","n","2c",2,"Chaque cellule a n chromosomes à 2 chromatides."],["Spermatides (fin méiose II)","n","1c",4,"Quatre cellules haploïdes, ensuite spermiogenèse."],["Spermatozoïdes","n","1c",4,"Cellules mobiles, flagelle, acrosome."]];
    var OV = [["Ovogonie (vie fœtale : mitoses)","2n","2c",1,"Multiplication avant la naissance."],["Ovocyte I (bloqué en prophase I)","2n","4c",1,"Bloqué depuis la vie fœtale jusqu'à la puberté."],["Ovocyte II + 1<sup>er</sup> globule polaire (ovulation)","n","2c",2,"Méiose I achevée à l'ovulation ; blocage en métaphase II."],["Fécondation : ovule + 2<sup>e</sup> globule polaire","n","1c",2,"La méiose II s'achève sous l'effet de la fécondation (+ éventuel 1<sup>er</sup> globule divisé)."],["Zygote (J0)","2n","2c",1,"Rencontre des pronoyaux n + n."]];
    var EM = [["J0 · Zygote","2n","2c",1,"Fécondation dans l'ampoule de la trompe."],["J1 · 2 blastomères","2n","2c",2,"Segmentation : cellules plus petites, sans croissance."],["J2 · 4 blastomères","2n","2c",4,""],["J3 · 8 à 16 cellules","2n","2c",8,"Compaction vers 8 cellules."],["J4 · Morula (≈ 16–32)","2n","2c",16,"Boule pleine de cellules."],["J5 · Blastocyste (≈ 100)","2n","2c",64,"Bouton embryonnaire et trophoblaste."],["J6–7 · Implantation","2n","2c",64,"Nidation dans l'endomètre."],["Semaine 2 · Disque bilaminaire","2n","2c",64,"Épiblaste et hypoblaste."],["Semaine 3 · Gastrulation","2n","2c",64,"Ectoderme, mésoderme, endoderme."]];
    k.draw(function(){
      c.clear();
      var L = mode.value === "sp" ? SP : mode.value === "ov" ? OV : EM, i = Math.min(L.length - 1, Math.floor(av.value / 100 * L.length)), st = L[i];
      var N = st[3], ctx = c.ctx, cx = c.W / 2, cy = 130;
      S.draw.text(c, st[0].replace(/<[^>]+>/g, ""), cx, 24, {size:14});
      var rr = mode.value === "em" ? 14 : 26;
      if (N <= 8 && mode.value !== "em"){
        for (var q = 0; q < N; q++){ var x = cx + (q - (N - 1) / 2) * 70; ctx.fillStyle = mode.value === "ov" && q > 0 ? "#cfd6e0" : "#dbe6ff"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, cy, mode.value === "ov" && q > 0 ? 14 : rr + 8, 0, 6.3); ctx.fill(); ctx.stroke(); }
      } else {
        var cnt = Math.min(N, 64), R = i < 5 ? 55 : 70;
        ctx.strokeStyle = pal.grey; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R + 12, 0, 6.3); ctx.stroke();
        var sizeC = Math.max(5, Math.min(24, 120 / Math.sqrt(cnt)));
        for (var j = 0; j < cnt; j++){
          var ang = j * 2.399963, rad = cnt === 1 ? 0 : Math.sqrt((j + 0.5) / cnt) * (R - sizeC / 2);
          ctx.fillStyle = (i >= 8 && j % 3 === 0) ? "#fdd8d4" : (i >= 8 && j % 3 === 1) ? "#d6efe2" : "#dbe6ff"; ctx.strokeStyle = pal.acc; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, sizeC, 0, 6.3); ctx.fill(); ctx.stroke();
        }
      }
      S.draw.text(c, st[4].replace(/<[^>]+>/g, ""), cx, 250, {size:12, weight:600, color:pal.grey});
      S.draw.text(c, "Étape " + (i + 1) + " sur " + L.length, cx, 276, {size:11, weight:600, color:pal.grey});
      ro.set(0, st[0].replace(/<[^>]+>/g, "").split("(")[0]); ro.set(1, st[1]); ro.set(2, st[2]); ro.set(3, mode.value === "em" && i >= 5 ? "≈ 100 et plus" : N);
      note.set(mode.value === "ov" ? "Un seul gamète fonctionnel : le cytoplasme est conservé dans l'ovule, les globules polaires dégénèrent." : mode.value === "sp" ? "Quatre gamètes par cellule initiale, production continue après la puberté." : "Le nombre de cellules double à chaque division, mais l'embryon ne grossit pas avant l'implantation.", "ok");
    });
  }
});
})();

/* BIO3D-BEGIN:s_c08_mitose.js */
(function(){
var P = function(S){ return S.draw.palette; };
/* --- moteur 3D maison (projection perspective, tri en profondeur, rotation à la souris) --- */
function hx(h){ var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function sh(h, f, a){ var q = hx(h); return "rgba(" + q.map(function(v){ return Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f); }).join(",") + "," + (a === undefined ? 1 : a) + ")"; }
function V3(c, S, o){
  o = o || {};
  var v = {yaw:o.yaw === undefined ? 0.5 : o.yaw, pit:o.pit === undefined ? 0.3 : o.pit, D:o.D || 8, sc:o.sc || 60, ox:0, oy:0, auto:o.auto !== false, q:[], moved:false}, last = null, d0 = null;
  c.pointer(function(t, p){
    if (t === "down"){ last = p; d0 = p; v.auto = false; v.moved = false; }
    else if (t === "drag" && last){ if (Math.abs(p.x - d0.x) + Math.abs(p.y - d0.y) > 5) v.moved = true; v.yaw += (p.x - last.x) * 0.01; v.pit = Math.max(-1.45, Math.min(1.45, v.pit + (p.y - last.y) * 0.01)); last = p; }
    else if (t === "up"){ last = null; if (!v.moved && v.onclick) v.onclick(p); }
  });
  v.P = function(x, y, z){
    var cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pit), sp = Math.sin(v.pit);
    var X = x * cy + z * sy, Z = -x * sy + z * cy, Y = y * cp - Z * sp; Z = y * sp + Z * cp;
    var f = v.D / (v.D - Z);
    return {x:c.W / 2 + v.ox + X * f * v.sc, y:c.H / 2 + v.oy - Y * f * v.sc, z:Z, f:f};
  };
  v.add = function(z, fn){ v.q.push([z, fn]); };
  v.flush = function(){ v.q.sort(function(a, b){ return a[0] - b[0]; }); for (var i = 0; i < v.q.length; i++) v.q[i][1](); v.q = []; };
  v.ball = function(x, y, z, r, col, al){
    var p = v.P(x, y, z), R = Math.max(1, r * p.f * v.sc);
    v.add(p.z, function(){
      var g = c.ctx.createRadialGradient(p.x - R * 0.35, p.y - R * 0.35, R * 0.1, p.x, p.y, R);
      g.addColorStop(0, sh(col, 0.55, al)); g.addColorStop(0.55, sh(col, 0, al)); g.addColorStop(1, sh(col, -0.4, al));
      c.ctx.fillStyle = g; c.ctx.beginPath(); c.ctx.arc(p.x, p.y, R, 0, 6.2832); c.ctx.fill();
    });
    p.R = R; return p;
  };
  v.seg = function(a, b, w, col, al, dash){
    var p = v.P(a[0], a[1], a[2]), q = v.P(b[0], b[1], b[2]);
    v.add((p.z + q.z) / 2 - 0.001, function(){
      var x = c.ctx; x.lineCap = "round"; x.strokeStyle = sh(col, 0, al); x.lineWidth = Math.max(1, w * (p.f + q.f) / 2 * v.sc);
      if (dash) x.setLineDash(dash);
      x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke();
      if (!dash && w * v.sc > 6){ x.strokeStyle = sh(col, 0.5, al); x.lineWidth = x.lineWidth * 0.35; x.beginPath(); x.moveTo(p.x - 1, p.y - 1); x.lineTo(q.x - 1, q.y - 1); x.stroke(); }
      if (dash) x.setLineDash([]);
    });
  };
  v.label = function(txt, x, y, z, col, size, bg){
    var p = v.P(x, y, z);
    v.add(p.z + 50, function(){ S.draw.text(c, txt, p.x, p.y, {size:size || 11, color:col || "#0f1b2d", weight:700, bg:bg}); });
  };
  v.spin = function(dt){ if (v.auto) v.yaw += dt * 0.35; };
  return v;
}

SFA.sim({
  id:"ub-c08-3d-mitose-fuseau", ch:"c08", tag:"Mitose · 3D",
  titre:"La mitose en 3D : chromosomes, fuseau et cytocinèse",
  resume:"Une cellule 2n = 6 qui se divise, avec son fuseau, ses kinétochores et la séparation des chromatides : joue la division, bloque-la, fais-la rater.",
  but:"Fais défiler la division avec le curseur (ou en lecture), tourne la cellule, puis teste le nocodazole (poison du fuseau) ou une non-disjonction : compte les chromosomes de chaque cellule fille.",
  aRetenir:"Prophase : condensation, rupture de l'enveloppe nucléaire (en fin de prophase), centrosomes aux pôles. Prométaphase : les microtubules du fuseau s'attachent aux kinétochores. Métaphase : alignement sur la plaque. Anaphase : la séparase coupe la cohésine, les chromatides sœurs migrent vers les pôles. Télophase : décondensation, enveloppes nucléaires, cytocinèse. Quantité d'ADN : 4c de la fin de S à l'anaphase (2n = 6 chromosomes à 2 chromatides), 2c dans chaque cellule fille (6 chromosomes à 1 chromatide).",
  piege:"Le nombre de chromosomes ne double pas en anaphase « en réalité » : on compte un chromosome par centromère, donc il passe de 6 à 12 chromosomes dans la cellule entière, alors que la quantité d'ADN reste 4c jusqu'à la cytocinèse. Les chromatides sœurs sont identiques (sauf mutation) : ce n'est pas le brassage de la méiose. Le point de contrôle du fuseau empêche l'anaphase tant que tous les kinétochores ne sont pas attachés. Taille des chromosomes et durée très schématiques.",
  build:function(k,S){
    var c = k.canvas(420), pal = P(S), v = V3(c, S, {yaw:0.35, pit:0.3, D:11, sc:50});
    var prog = k.slider("Progression de la division", 0, 100, 0.5, 4, "%");
    var cond = k.seg("Condition", [["n","Normale"],["m","Nocodazole"],["d","Non-disjonction"]], "n");
    var fib = k.toggle("Montrer le fuseau", true);
    var spd = k.slider("Vitesse de lecture", 0.2, 3, 0.1, 1, "×");
    var ro = k.readouts(["Phase", "Chromosomes", "Chromatides", "ADN par cellule"]);
    var info = k.note("", "ok");
    var playing = true, tt = 0, seed = 21;
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    function ss(a, b, u){ var x = Math.max(0, Math.min(1, (u - a) / (b - a))); return x * x * (3 - 2 * x); }
    var SZ = [1.0, 1.0, 0.8, 0.8, 0.55, 0.55], COL = ["#2563eb", "#dc2626", "#2563eb", "#dc2626", "#2563eb", "#dc2626"];
    var chr = [];
    for (var i = 0; i < 6; i++){
      var a = rnd() * 6.28, b = Math.acos(2 * rnd() - 1), rr = 0.35 + rnd() * 0.4;
      var a2 = rnd() * 6.28, b2 = Math.acos(2 * rnd() - 1), r2 = 0.5 + rnd() * 1.1, ea = rnd() * 6.28, eb = Math.acos(2 * rnd() - 1);
      var ph = i / 6 * 6.2832, rp = (i % 2) ? 0.95 : 0.5;
      chr.push({S:[rr * Math.sin(b) * Math.cos(a) * 0.9, rr * Math.cos(b), rr * Math.sin(b) * Math.sin(a)], W:[r2 * Math.sin(b2) * Math.cos(a2) * 1.3, r2 * Math.cos(b2), r2 * Math.sin(b2) * Math.sin(a2)],
        M:[0, rp * Math.cos(ph), rp * Math.sin(ph)], E0:[Math.sin(eb) * Math.cos(ea), Math.cos(eb), Math.sin(eb) * Math.sin(ea)], R:[0, Math.cos(ph), Math.sin(ph)], ph:rnd() * 6.28});
    }
    function norm(a){ var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
    function phase(u){
      return u < 0.1 ? "Interphase (G2)" : u < 0.27 ? "Prophase" : u < 0.42 ? "Prométaphase" : u < 0.56 ? "Métaphase" : u < 0.7 ? "Anaphase" : u < 0.82 ? "Télophase" : "Cytocinèse";
    }
    function R(){
      c.clear(); v.sc = Math.min(56, c.W / 8.2);
      var cd = cond.value, u0 = prog.value / 100, u = cd === "m" ? Math.min(u0, 0.40) : u0;
      var cnd = ss(0.08, 0.28, u) * (1 - 0.8 * ss(0.74, 0.92, u));
      var A = ss(0.57, 0.67, u), Bv = ss(0.62, 0.76, u), Tel = ss(0.76, 0.95, u), Pinch = ss(0.74, 0.97, u);
      var Px = 0.35 + 1.65 * ss(0.06, 0.4, u) + 0.7 * Bv, aC = 2.9 + 0.9 * Bv;
      /* cellule : maillage ellipsoïdal pincé au milieu */
      var rad = function(x){ var q = 1 - (x / aC) * (x / aC); if (q <= 0) return 0; return 2.05 * Math.sqrt(q) * (1 - 0.85 * Pinch * Math.exp(-(x * x) / 0.35)); };
      var NX = 14, th, j;
      for (var ix = 1; ix < NX; ix++){ var x = -aC + 2 * aC * ix / NX, r = rad(x); for (j = 0; j < 20; j++){ var t1 = j / 20 * 6.2832, t2 = (j + 1) / 20 * 6.2832; v.seg([x, r * Math.cos(t1), r * Math.sin(t1)], [x, r * Math.cos(t2), r * Math.sin(t2)], 0.02, "#16a34a", 0.3); } }
      for (j = 0; j < 8; j++){ th = j / 8 * 6.2832; for (ix = 0; ix < 20; ix++){ var xa = -aC + 2 * aC * (ix + 0.02) / 20, xb = -aC + 2 * aC * (ix + 0.98) / 20, ra = rad(xa), rb = rad(xb); v.seg([xa, ra * Math.cos(th), ra * Math.sin(th)], [xb, rb * Math.cos(th), rb * Math.sin(th)], 0.02, "#16a34a", 0.3); } }
      /* enveloppes nucléaires */
      function env(cx, rr, al, col){ if (al < 0.03) return; for (var q = 0; q < 3; q++){ for (var m = 0; m < 22; m++){ var t1 = m / 22 * 6.2832, t2 = (m + 1) / 22 * 6.2832, yy = (q - 1) * rr * 0.6, r3 = Math.sqrt(rr * rr - yy * yy);
        v.seg([cx + r3 * Math.cos(t1), yy, r3 * Math.sin(t1)], [cx + r3 * Math.cos(t2), yy, r3 * Math.sin(t2)], 0.03, col, al);
        v.seg([cx + yy, r3 * Math.cos(t1), r3 * Math.sin(t1)], [cx + yy, r3 * Math.cos(t2), r3 * Math.sin(t2)], 0.02, col, al * 0.6); } } }
      env(0, 1.15, 1 - ss(0.18, 0.30, u), "#3b5fc0");
      env(-1.9 - 0.4 * Bv, 0.95, Tel, "#3b5fc0"); env(1.9 + 0.4 * Bv, 0.95, Tel, "#3b5fc0");
      /* centrosomes + asters */
      [-1, 1].forEach(function(sg){
        var px = sg * Px; v.ball(px, 0, 0, 0.16, "#7c3aed");
        if (u > 0.2) for (var q = 0; q < 7; q++){ var aa = q / 7 * 6.2832, bb = 0.8 + q * 0.4; v.seg([px, 0, 0], [px + sg * 0.35, 0.35 * Math.cos(aa), 0.35 * Math.sin(aa)], 0.015, "#a78bfa", 0.6); }
      });
      var fiberOn = fib.value && cd !== "m" && u > 0.27 && u < 0.78;
      var attach = ss(0.28, 0.46, u), nd = 0, left = 0, right = 0;
      /* chromosomes */
      chr.forEach(function(ch, i){
        var sz = SZ[i], base, e, sep = 0;
        var go = ss(0.28, 0.52, u), bump = Math.sin(Math.PI * go);
        if (cd === "m") go = ss(0.28, 0.42, u) * 0.12 + 0;
        base = [ch.S[0] * (1 - go) + ch.M[0] * go + ch.W[0] * bump * 0.5, ch.S[1] * (1 - go) + ch.M[1] * go + ch.W[1] * bump * 0.5, ch.S[2] * (1 - go) + ch.M[2] * go + ch.W[2] * bump * 0.5];
        if (cd === "m" && u > 0.28){ var f0 = ss(0.28, 0.4, u); base = [ch.S[0] * (1 - f0) + ch.W[0] * f0 * 1.1, ch.S[1] * (1 - f0) + ch.W[1] * f0 * 1.1, ch.S[2] * (1 - f0) + ch.W[2] * f0 * 1.1]; }
        var pg = ss(0.34, 0.5, u); e = norm([ch.E0[0] * (1 - pg) + ch.R[0] * pg, ch.E0[1] * (1 - pg) + ch.R[1] * pg, ch.E0[2] * (1 - pg) + ch.R[2] * pg]);
        var L = 1.45 * sz, nondisj = (cd === "d" && i === 2);
        var sc = 1 - 0.35 * A - 0.2 * Tel;
        for (var s2 = -1; s2 <= 1; s2 += 2){
          var pole = nondisj ? 1 : s2;
          var Kx = base[0] + (A > 0 ? pole * (0.14 + 1.25 * A + 0.35 * Bv + 0.3 * Tel) : 0), off = (A > 0 && !nondisj) ? 0 : s2 * 0.07 * (u > 0.1 ? 1 : 0.5);
          if (nondisj && A > 0) off = s2 * 0.09;
          var K = [Kx + off, base[1] * (A > 0 ? sc : 1), base[2] * (A > 0 ? sc : 1)], V = A * 0.85 * (1 - 0.5 * Tel);
          var prev = null, w = 0.04 + 0.09 * cnd, wob = (1 - cnd) * 0.3;
          for (var q = 0; q <= 6; q++){
            var t = -0.35 * L + q / 6 * L, at = Math.abs(t);
            var P0 = [K[0] + (-pole) * at * V + (A > 0 ? 0 : s2 * 0.1 * at / L * cnd) + wob * Math.sin(t * 6 + ch.ph + tt * 1.3) * 0.5, K[1] + e[1] * t * (1 - V) + wob * Math.sin(t * 5 + ch.ph * 2 + tt) * 0.5, K[2] + e[2] * t * (1 - V) + wob * Math.cos(t * 4 + ch.ph + tt * 1.1) * 0.5];
            if (prev) v.seg(prev, P0, w, COL[i], 0.95);
            prev = P0;
          }
          v.ball(K[0], K[1], K[2], 0.1, "#f59e0b");
          if (fiberOn && attach > i * 0.14 + 0.05 && !(cd === "m")) v.seg([pole * Px, 0, 0], K, 0.022, "#7c3aed", 0.6);
          if (A > 0.6) { if (K[0] > 0) right++; else left++; }
        }
      });
      v.flush();
      /* lecture des résultats */
      var ph = phase(u), nChr = u < 0.57 ? 6 : 12, nChd = u < 0.57 ? 12 : 12, dna = u < 0.85 ? "4c" : "2c (par fille)";
      var msg = "";
      if (u >= 0.85){
        if (cd === "d") { nChr = "7 et 5"; nChd = "7 et 5"; dna = "≈ 2,3c et 1,7c"; msg = "Non-disjonction : les deux chromatides du chromosome 3 sont parties vers le même pôle : une fille a 7 chromosomes (trisomie), l'autre 5 (monosomie) : aneuploïdie."; }
        else { nChr = "6 + 6"; nChd = "6 + 6"; msg = "Deux cellules filles identiques à la cellule mère : 2n = 6 chromosomes, 2c d'ADN chacune."; }
      }
      if (cd === "m" && u0 > 0.4) { ph = "Prométaphase (bloquée)"; nChr = 6; nChd = 12; dna = "4c"; msg = "Nocodazole : le fuseau ne se forme pas, les kinétochores ne s'attachent pas, le point de contrôle du fuseau bloque la cellule avant l'anaphase (c'est le principe de certaines chimiothérapies)."; }
      if (!msg) msg = u < 0.1 ? "Les chromosomes sont répliqués (2 chromatides sœurs chacun) mais décondensés : on ne les voit pas distinctement. Les centrosomes sont dupliqués." : u < 0.27 ? "Les chromosomes se condensent ; les deux centrosomes migrent vers les pôles ; l'enveloppe nucléaire se désagrège." : u < 0.42 ? "Les microtubules du fuseau capturent les kinétochores (un par chromatide), chaque chromosome est attaché aux deux pôles." : u < 0.56 ? "Tous les chromosomes sont alignés sur la plaque équatoriale, sous tension : le point de contrôle est satisfait." : u < 0.7 ? "La séparase clive la cohésine : les chromatides sœurs deviennent des chromosomes fils et sont tirées vers les pôles (anaphase A) ; les pôles s'écartent (anaphase B)." : "Décondensation, nouvelles enveloppes nucléaires, l'anneau d'actine-myosine pince la cellule (cytocinèse).";
      ro.set(0, ph); ro.set(1, nChr); ro.set(2, nChd); ro.set(3, dna);
      info.set(msg, cd === "m" && u0 > 0.4 ? "warn" : cd === "d" && u >= 0.85 ? "bad" : "ok");
    }
    k.button("Lecture / pause", function(){ playing = !playing; }, true);
    k.button("Recommencer", function(){ prog.set(4); playing = true; });
    k.draw(R);
    var lp = k.loop(function(dt){
      tt += dt; if (v.auto) v.yaw = 0.35 + 0.55 * Math.sin(tt * 0.35);
      if (playing){ var cur = prog.value + dt * 5.5 * spd.value; if (cur >= 100) { cur = 100; playing = false; } prog.set(cur); }
      R();
    }); lp.play();
  }
});

})();
/* BIO3D-END:s_c08_mitose.js */
