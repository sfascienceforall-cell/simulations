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
