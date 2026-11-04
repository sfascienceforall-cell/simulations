/* Biologie BA1 · chapitre 7 : expression et perpétuation du génome */
(function(){
var CODE = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG", B = "UCAG";
function aaOf(c){ var i = B.indexOf(c[0]), j = B.indexOf(c[1]), l = B.indexOf(c[2]); return (i < 0 || j < 0 || l < 0) ? "?" : CODE[16 * i + 4 * j + l]; }
function codons(s){ var r = []; for (var i = 0; i + 2 < s.length; i += 3) r.push(s.substr(i, 3)); return r; }
function prot(cs){ var r = []; for (var i = 0; i < cs.length; i++){ var a = aaOf(cs[i]); r.push(a); if (a === "*") break; } return r; }
var AA3 = {F:"Phe",L:"Leu",S:"Ser",Y:"Tyr","*":"Stop",C:"Cys",W:"Trp",P:"Pro",H:"His",Q:"Gln",R:"Arg",I:"Ile",M:"Met",T:"Thr",N:"Asn",K:"Lys",V:"Val",A:"Ala",D:"Asp",E:"Glu",G:"Gly"};

/* 1. Traduction et mutations */
SFA.sim({
  id:"ub-c07-traduction-mutations", ch:"c07", tag:"Mutations",
  titre:"Lire le code : mutations ponctuelles et décalage du cadre",
  resume:"Mute un ARNm et classe : silencieuse, faux-sens, non-sens, décalage.",
  but:"Choisis un fragment d'ARNm, une mutation (substitution, insertion, délétion), sa position, et compare les protéines.",
  aRetenir:"Substitution : silencieuse (même acide aminé, code dégénéré), faux-sens (autre acide aminé) ou non-sens (codon stop prématuré). Insertion/délétion d'un nombre de nucléotides non multiple de 3 : décalage du cadre, tout l'aval change. Multiple de 3 : le cadre est conservé (acide aminé en plus ou en moins). Exemple réel : Glu→Val en position 6 de la β-globine (GAG→GUG) = drépanocytose.",
  piege:"Une mutation silencieuse change la séquence d'ADN mais pas la protéine (elle peut cependant affecter l'épissage ou la vitesse de traduction). Une substitution au 3<sup>e</sup> nucléotide d'un codon est le plus souvent silencieuse (dégénérescence), au 2<sup>e</sup> rarement. Le code est lu sur l'ARNm 5'→3' à partir de l'AUG.",
  build:function(k,S){
    var seqs = {
      a:{n:"Peptide fictif", s:"AUGGCUGAACGUAAAUUCGGACCUUGGAAGUGA"},
      b:{n:"Début de β-globine (fragment, stop ajouté)", s:"AUGGUGCACCUGACUCCUGAGGAGAAGUCUUAA"}
    };
    var c = k.canvas(300);
    var sel = k.select("Fragment d'ARNm", [["a",seqs.a.n],["b",seqs.b.n]], "b");
    var typ = k.seg("Mutation", [["s","Substitution"],["i","Insertion"],["d","Délétion"]], "s");
    var pos = k.slider("Position (nucléotide)", 1, 33, 1, 20, "");
    var base = k.select("Nucléotide", ["A","C","G","U"], "U");
    var sz = k.slider("Taille de l'indel", 1, 3, 1, 1, "nt");
    var ro = k.readouts(["Type","Protéine normale","Protéine mutée"]);
    var note = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var s0 = seqs[sel.value].s, p = Math.min(pos.value, s0.length) - 1, t = typ.value, n = sz.value, b = base.value, s1;
      if (t === "s") s1 = s0.slice(0, p) + b + s0.slice(p + 1);
      else if (t === "i") s1 = s0.slice(0, p + 1) + new Array(n + 1).join(b) + s0.slice(p + 1);
      else s1 = s0.slice(0, p) + s0.slice(p + n);
      var c0 = codons(s0), c1 = codons(s1), p0 = prot(c0), p1 = prot(c1);
      var m = Math.max(p0.length, p1.length, 1), w = Math.min(56, (c.W - 70) / m), ctx = c.ctx;
      var rows = [["Normal", c0, p0, 70], ["Muté", c1, p1, 190]];
      rows.forEach(function(r){
        S.draw.text(c, r[0], 6, r[3] - 28, {align:"left", size:12});
        for (var i = 0; i < r[2].length; i++){
          var cdn = r[1][i], other = (r[0] === "Normal" ? c1 : c0)[i], pr = (r[0] === "Normal" ? p1 : p0)[i];
          var diff = cdn !== other, adiff = r[2][i] !== pr;
          ctx.fillStyle = adiff ? "#fdd8d4" : diff ? "#fff0c2" : "#eef2f8";
          ctx.fillRect(10 + i * w, r[3] - 18, w - 3, 66);
          S.draw.text(c, cdn, 10 + i * w + (w - 3) / 2, r[3], {size: w > 40 ? 13 : 10, math:true});
          S.draw.text(c, r[2][i] === "*" ? "Stop" : AA3[r[2][i]], 10 + i * w + (w - 3) / 2, r[3] + 26, {size: w > 40 ? 12 : 9});
        }
      });
      var res;
      if (t === "s"){
        var ci = Math.floor(p / 3), a0 = aaOf(c0[ci]), a1 = aaOf(c1[ci]);
        res = a0 === a1 ? "Silencieuse" : a1 === "*" ? "Non-sens" : a0 === "*" ? "Perte du stop" : "Faux-sens";
        if (s0[p] === b) res = "Aucun changement (même base)";
      } else res = n % 3 === 0 ? "Indel en phase (" + (t === "i" ? "+" : "−") + n / 3 + " acide aminé)" : "Décalage du cadre de lecture";
      var l0 = p0.length - (p0[p0.length - 1] === "*" ? 1 : 0), l1 = p1.length - (p1[p1.length - 1] === "*" ? 1 : 0);
      ro.set(0, res); ro.set(1, l0 + " aa"); ro.set(2, l1 + " aa" + (p1[p1.length - 1] === "*" ? "" : " (pas de stop)"));
      note.set(t !== "s" && n % 3 !== 0 ? "Décalage : tous les codons en aval changent ; un stop apparaît vite par hasard (3 codons stop sur 64)." : res === "Silencieuse" ? "Code dégénéré : plusieurs codons pour le même acide aminé." : res === "Faux-sens" ? "Un acide aminé est remplacé : l'effet dépend de sa position et de sa nature (ex. Glu→Val en β-globine)." : res === "Non-sens" ? "Codon stop prématuré : protéine tronquée, souvent dégradée (NMD)." : "Rouge = acide aminé différent, jaune = codon différent mais même acide aminé.", "ok");
    });
  }
});

/* 2. Réplication */
SFA.sim({
  id:"ub-c07-replication", ch:"c07", tag:"Réplication",
  titre:"Réplication : fourches, origines et fragments d'Okazaki",
  resume:"Combien de temps, combien d'origines, combien de fragments pour copier un génome ?",
  but:"Choisis un organisme (ou règle les curseurs) : durée de réplication, origines nécessaires, nombre de fragments d'Okazaki.",
  aRetenir:"Une origine bidirectionnelle = 2 fourches. Durée t = G / (2·N·v), avec G taille répliquée (pb), N origines actives, v vitesse d'une fourche (nt/s). Brin avancé : synthèse continue ; brin retardé : fragments d'Okazaki (≈ 1 000 à 2 000 nt chez les procaryotes, ≈ 100 à 200 nt chez les eucaryotes), chacun amorcé par une amorce d'ARN. E. coli : une origine, ≈ 40 min ; humain : des milliers d'origines.",
  piege:"« Temps minimal » : il suppose que toutes les origines s'activent en même temps ; chez l'humain elles s'activent de façon échelonnée, la phase S dure ≈ 8 h et ≈ 30 000 à 50 000 origines sont utilisées. Les vitesses sont des ordres de grandeur.",
  build:function(k,S){
    var c = k.canvas(260);
    var org = k.seg("Organisme", [["e","E. coli"],["h","Cellule humaine (2n)"]], "e", function(v){
      if (v === "e"){ vit.set(1000); ori.set(1); frag.set(1500); } else { vit.set(50); ori.set(40000); frag.set(200); }
    });
    var vit = k.slider("Vitesse d'une fourche", 10, 1000, 10, 1000, "nt/s");
    var ori = k.slider("Origines actives", 1, 50000, 1, 1, "");
    var frag = k.slider("Taille d'un fragment d'Okazaki", 100, 2000, 100, 1500, "nt");
    var ro = k.readouts(["Durée minimale","Origines pour S = 8 h","Fragments d'Okazaki","Amorces d'ARN"]);
    k.draw(function(){
      c.clear();
      var g = org.value === "e" ? 4.6e6 : 6.4e9, N = ori.value, v = vit.value, L = frag.value;
      var t = g / (2 * N * v), need = g / (2 * v * 28800), nfr = g / L, forks = 2 * N;
      var fmtT = t < 120 ? S.fmt(t, 0) + " s" : t < 7200 ? S.fmt(t / 60, 1) + " min" : S.fmt(t / 3600, 1) + " h";
      /* schéma d'une fourche */
      var y = 70, cx = 90, ctx = c.ctx, pal = S.draw.palette;
      S.draw.line(c, 20, y, cx, y, pal.grey, 3); S.draw.line(c, 20, y + 30, cx, y + 30, pal.grey, 3);
      S.draw.line(c, cx, y, c.W - 30, y - 28, pal.acc, 3); S.draw.line(c, cx, y + 30, c.W - 30, y + 58, pal.acc, 3);
      S.draw.text(c, "ADN parental (double brin) → fourche de réplication", 20, 16, {align:"left", size:11, weight:600});
      S.draw.arrow(c, cx + 8, y - 6, cx + 150, y - 22, pal.green, 2.5);
      S.draw.text(c, "brin avancé (continu)", cx + 155, y - 28, {align:"left", size:11, color:pal.green});
      for (var i = 0; i < 4; i++){ var x0 = cx + 150 - i * 36; S.draw.arrow(c, x0 + 30, y + 40 + (cx + 150 - x0) * 0.1, x0, y + 40 + (cx + 150 - x0) * 0.1 + 3, pal.red, 2.5); }
      S.draw.text(c, "brin retardé : fragments d'Okazaki", cx + 120, y + 78, {size:11, color:pal.red, align:"left"});
      var bw = c.W - 60;
      S.draw.text(c, "Durée comparée à la phase S (8 h = 28 800 s)", 30, 190, {align:"left", size:12});
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(30, 205, bw, 16);
      ctx.fillStyle = t <= 28800 ? pal.green : pal.red; ctx.fillRect(30, 205, Math.min(1, t / 28800) * bw, 16);
      var fr = Math.min(1, t / 28800); S.draw.text(c, (t > 28800 ? "dépasse la phase S : " : "") + fmtT, fr > 0.6 ? 36 : 30 + fr * bw + 6, 213, {align:"left", size:11, color: fr > 0.6 ? "#fff" : "#13233a"});
      S.draw.text(c, "Fourches actives : " + (forks < 1e3 ? forks : S.fmt(forks / 1000, 1) + " mille"), 30, 238, {align:"left", size:12, weight:600});
      ro.set(0, fmtT); ro.set(1, need < 10 ? S.fmt(need, 0) : Math.ceil(need).toLocaleString("fr-BE")); ro.set(2, nfr < 1e5 ? Math.round(nfr).toLocaleString("fr-BE") : S.sci(nfr, 2)); ro.set(3, S.sci(nfr + forks, 2));
    });
  }
});

/* 3. Transcription et maturation */
SFA.sim({
  id:"ub-c07-maturation-arn", ch:"c07", tag:"Épissage",
  titre:"Maturation de l'ARN pré-messager : coiffe, épissage, queue poly(A)",
  resume:"Un gène de 5 exons : saut d'exon, cadre de lecture, stabilité de l'ARNm.",
  but:"Active ou non la coiffe et la queue poly(A), saute des exons (épissage alternatif) et regarde la longueur et le cadre de lecture.",
  aRetenir:"Chez les eucaryotes, le pré-ARNm est coiffé en 5' (7-méthylguanosine), épissé (introns retirés par le splicéosome) et polyadénylé en 3'. Coiffe et queue poly(A) protègent l'ARNm de la dégradation et permettent l'initiation de la traduction. L'épissage alternatif produit plusieurs ARNm (donc protéines) à partir d'un gène ; un exon dont la longueur n'est pas multiple de 3 déplace le cadre de lecture s'il est sauté.",
  piege:"Les introns sont retirés, les exons conservés (« exons = expressed »). Le saut d'un exon de longueur multiple de 3 conserve le cadre ; sinon décalage. Gène didactique : longueurs choisies pour l'exercice, la partie 5' et 3' non traduite n'est pas séparée.",
  build:function(k,S){
    var c = k.canvas(260);
    var ex = [120, 90, 100, 60, 209], intr = [1800, 2500, 900, 3200], pal = S.draw.palette;
    var cap = k.toggle("Coiffe 5'", true);
    var pa = k.slider("Queue poly(A)", 0, 250, 10, 200, "nt");
    var sk = [2, 3, 4].map(function(i){ return k.toggle("Sauter l'exon " + i, false); });
    var ro = k.readouts(["Pré-ARNm","ARNm mature","Cadre de lecture","Stabilité"]);
    var note = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var inc = [true, !sk[0].value, !sk[1].value, !sk[2].value, true], len = 0, i, tot = 0;
      for (i = 0; i < 5; i++){ tot += ex[i]; if (inc[i]) len += ex[i]; }
      for (i = 0; i < 4; i++) tot += intr[i];
      var w = c.W - 40, x = 20, wx = [];
      var sq = ex.map(function(e){ return Math.sqrt(e); }), ssum = sq.reduce(function(a, b){ return a + b; }, 0), gap = 28, avail = w - 4 * gap;
      for (i = 0; i < 5; i++){
        var bw = sq[i] / ssum * avail;
        c.ctx.fillStyle = inc[i] ? pal.acc : "#cfd6e0"; c.ctx.fillRect(x, 60, bw, 36);
        S.draw.text(c, "E" + (i + 1), x + bw / 2, 72, {color:"#fff", size:12});
        S.draw.text(c, ex[i] + " nt", x + bw / 2, 86, {color:"#fff", size:10, weight:600});
        if (i < 4){ S.draw.line(c, x + bw, 78, x + bw + gap, 78, pal.grey, 2, [3, 3]); S.draw.text(c, intr[i] + "", x + bw + gap / 2, 66, {size:9, color:pal.grey}); }
        x += bw + gap;
      }
      S.draw.text(c, "Pré-ARNm : exons (bleu) et introns (pointillés, longueur en nt)", 20, 30, {align:"left", size:12, weight:600});
      S.draw.text(c, "ARNm mature : " + (cap.value ? "coiffe + " : "pas de coiffe + ") + len + " nt + poly(A)" + (pa.value > 0 ? " " + pa.value : " absent"), 20, 140, {align:"left", size:13});
      var ok = len % 3 === 0, stable = cap.value && pa.value >= 30;
      ro.set(0, tot + " nt"); ro.set(1, len + " nt"); ro.set(2, ok ? "conservé (" + (len - 3) / 3 + " aa)" : "décalé"); ro.set(3, !cap.value ? "traduction impossible" : stable ? "stable" : "labile");
      note.set(!ok ? "Longueur non multiple de 3 : décalage du cadre, protéine aberrante probable." : !cap.value ? "Sans coiffe, les ribosomes ne se fixent pas et l'ARNm est vite dégradé par les exonucléases 5'→3'." : pa.value < 30 ? "Queue poly(A) courte : l'ARNm est dégradé rapidement (désadénylation)." : "ARNm complet : traduisible, stable.", ok && stable ? "ok" : "warn");
    });
  }
});

/* 4. Opéron lac */
SFA.sim({
  id:"ub-c07-operon-lac", ch:"c07", tag:"Régulation",
  titre:"L'opéron lactose : induction, répression, mutants",
  resume:"Lactose, glucose et mutants lacI, lacO, lacP, lacZ : niveau d'expression.",
  but:"Choisis la souche, la présence de lactose et de glucose, puis lis le niveau de β-galactosidase.",
  aRetenir:"Le répresseur LacI se fixe à l'opérateur et bloque l'ARN polymérase ; l'allolactose (dérivé du lactose) l'inactive : induction. Le complexe CAP–AMPc, présent quand le glucose manque, stimule la transcription : répression catabolique. Expression maximale = lactose présent ET glucose absent. Mutants : lacI⁻ constitutif ; lacI<sup>s</sup> (super-répresseur, insensible à l'allolactose) jamais induit ; lacO<sup>c</sup> constitutif (cis-dominant) ; lacP⁻ jamais exprimé.",
  piege:"Le lactose ne se fixe pas directement sur le répresseur : c'est l'allolactose. Glucose + lactose : l'opéron n'est que faiblement exprimé. Niveaux donnés en unités relatives qualitatives (répression ≈ 1, induction maximale ≈ 100).",
  build:function(k,S){
    var c = k.canvas(280), pal = S.draw.palette;
    var st = k.select("Souche", [["wt","Sauvage"],["I-","lacI⁻ (répresseur inactif)"],["Is","lacIˢ (super-répresseur)"],["Oc","lacOᶜ (opérateur muté)"],["P-","lacP⁻ (promoteur muté)"],["Z-","lacZ⁻ (gène de la β-galactosidase muté)"]], "wt");
    var lac = k.toggle("Lactose présent", true);
    var glu = k.toggle("Glucose présent", false);
    var ro = k.readouts(["Répresseur sur l'opérateur","CAP–AMPc","β-galactosidase"]);
    var note = k.note("", "ok");
    k.draw(function(){
      c.clear();
      var m = st.value, rep, bound, cap = !glu.value, lev;
      /* répresseur actif et opérateur fonctionnel */
      var repActive = (m === "I-") ? false : (m === "Is") ? true : !lac.value;
      var opOk = m !== "Oc";
      bound = repActive && opOk;
      var tr = (m === "P-") ? 0 : bound ? 1 : (cap ? 100 : 5);
      lev = m === "Z-" ? 0 : tr;
      var x = 30, y = 120, ctx = c.ctx;
      var parts = [["lacI",60,"#8a95a3"],["P",36,m === "P-" ? pal.red : pal.amber],["O",36,m === "Oc" ? pal.red : pal.violet],["lacZ",70,m === "Z-" ? pal.red : pal.green],["lacY",60,pal.teal],["lacA",60,pal.teal]];
      x = Math.max(10, (c.W - 330) / 2);
      parts.forEach(function(p){ ctx.fillStyle = p[2]; ctx.fillRect(x, y, p[1], 30); S.draw.text(c, p[0], x + p[1] / 2, y + 15, {color:"#fff", size:11}); p[3] = x; x += p[1] + 4; });
      var ox = parts[2][3] + 18;
      if (bound){ ctx.fillStyle = pal.red; ctx.beginPath(); ctx.arc(ox, y - 14, 17, 0, 6.3); ctx.fill(); S.draw.text(c, "LacI", ox, y - 14, {color:"#fff", size:10}); S.draw.text(c, "bloque", ox + 40, y - 40, {size:11, color:pal.red}); }
      else if (tr > 0){ var px = parts[1][3] + 18; S.draw.arrow(c, px, y + 52, parts[3][3] + 100, y + 52, pal.acc, 3); S.draw.text(c, tr > 5 ? "transcription forte" : "transcription faible", px + 10, y + 70, {align:"left", size:11, color:pal.acc}); }
      if (cap && m !== "P-") S.draw.text(c, "CAP–AMPc fixé au promoteur", parts[1][3] + 18, y + 96, {align:"left", size:11, color:pal.green});
      S.draw.text(c, "Opéron lac (non à l'échelle)", 20, 24, {align:"left", size:12, weight:600});
      var bw = c.W - 60; ctx.fillStyle = "#e3e7ed"; ctx.fillRect(30, 240, bw, 16); ctx.fillStyle = lev > 20 ? pal.green : lev > 0 ? pal.amber : pal.grey; ctx.fillRect(30, 240, lev / 100 * bw, 16);
      S.draw.text(c, "β-galactosidase : " + S.fmt(lev, 0) + " / 100", 30, 230, {align:"left", size:12});
      ro.set(0, bound ? "oui" : "non"); ro.set(1, cap && m !== "P-" ? "oui (glucose absent)" : "non"); ro.set(2, S.fmt(lev, 0) + " / 100");
      note.set(m === "Z-" ? "lacZ⁻ : l'opéron est transcrit comme chez le sauvage, mais la β-galactosidase est inactive (la perméase lacY et la transacétylase lacA peuvent encore être faites)." : m === "P-" ? "lacP⁻ : l'ARN polymérase ne reconnaît pas le promoteur, aucune expression." : lev === 100 ? "Lactose présent ET glucose absent : induction maximale." : lev === 5 ? "Pas de répression par LacI, mais sans CAP–AMPc (glucose présent) la transcription reste faible." : "Opérateur occupé par le répresseur : expression basale.", "ok");
    });
  }
});

/* 5. PCR et électrophorèse */
SFA.sim({
  id:"ub-c07-pcr-gel", ch:"c07", tag:"Technique",
  titre:"PCR et gel d'agarose",
  resume:"Copies après n cycles, efficacité, plateau, position de la bande sur un gel.",
  but:"Règle le nombre de cycles, l'efficacité et la taille de l'amplicon : lis le nombre de copies et la position de la bande sur le gel.",
  aRetenir:"Si l'efficacité vaut E (1 = 100 %), N<sub>n</sub> = N<sub>0</sub>(1 + E)<sup>n</sup> ; à E = 1, N<sub>n</sub> = N<sub>0</sub>·2<sup>n</sup> (30 cycles ≈ 10<sup>9</sup> fois). Un cycle : dénaturation (≈ 95 °C), hybridation des amorces, élongation par une polymérase thermostable. Sur gel, les fragments migrent vers le pôle + (ADN chargé −) ; la distance parcourue est approximativement linéaire en log(taille) : les petits fragments migrent le plus loin.",
  piege:"La PCR amplifie exponentiellement au début, puis atteint un plateau (réactifs limitants) : on ne peut pas retrouver la quantité de départ à partir d'une bande au plateau. Contamination : de très petites quantités d'ADN étranger sont amplifiées. Modèle simplifié, plateau fixé à 10<sup>12</sup> copies.",
  build:function(k,S){
    var c = k.canvas(300), pal = S.draw.palette;
    var n0 = k.slider("Copies initiales (puissance de 10)", 0, 6, 1, 3, "");
    var cy = k.slider("Nombre de cycles", 0, 40, 1, 30, "");
    var ef = k.slider("Efficacité", 70, 100, 5, 100, "%");
    var sz = k.slider("Taille de l'amplicon", 100, 2000, 100, 500, "pb");
    var ro = k.readouts(["Copies après n cycles","Facteur d'amplification","Bande visible ?"]);
    k.draw(function(){
      c.clear();
      var N0 = Math.pow(10, n0.value), E = ef.value / 100, plat = 1e12, N = N0, i, hist = [N0];
      for (i = 0; i < cy.value; i++){ N = N + E * N * (1 - N / plat); hist.push(N); }
      var gx = 20, gw = 110, ctx = c.ctx;
      ctx.fillStyle = "#13233a"; ctx.fillRect(gx, 20, gw, 260);
      var ladder = [100, 200, 300, 500, 750, 1000, 1500, 2000, 3000];
      function ypos(s){ return 30 + (Math.log10(3000) - Math.log10(s)) / (Math.log10(3000) - Math.log10(100)) * 230; }
      ladder.forEach(function(s){ var y = ypos(s); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fillRect(gx + 8, y, 30, 3); S.draw.text(c, s + "", gx + 44, y + 1, {align:"left", size:9, color:"#9fb3c8", weight:600}); });
      var vis = N > 1e10, br = Math.min(1, Math.max(0, (Math.log10(Math.max(N, 1)) - 8) / 4));
      S.draw.text(c, "échelle", gx + 24, 12, {size:10, color:pal.grey}); S.draw.text(c, "PCR", gx + 82, 12, {size:10, color:pal.grey});
      if (N > 1e8){ ctx.fillStyle = "rgba(255,170,60," + (0.15 + 0.85 * br) + ")"; ctx.fillRect(gx + 68, ypos(sz.value), 34, 5); }
      S.draw.text(c, "−", gx + gw + 8, 30, {size:14}); S.draw.text(c, "+", gx + gw + 8, 270, {size:14});
      var ax = S.draw.axes(c, {x0:0, x1:40, y0:0, y1:12, l:190, xl:"cycles", yl:"log₁₀(copies)", stepX:10, stepY:2, t:16, b:34});
      c.ctx.save(); c.ctx.beginPath(); c.ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); c.ctx.clip();
      c.ctx.strokeStyle = pal.acc; c.ctx.lineWidth = 2.5; c.ctx.beginPath();
      hist.forEach(function(h, j){ var X = ax.X(j), Y = ax.Y(Math.log10(Math.max(h, 1))); if (j === 0) c.ctx.moveTo(X, Y); else c.ctx.lineTo(X, Y); });
      c.ctx.stroke(); c.ctx.restore();
      S.draw.dot(c, ax.X(cy.value), ax.Y(Math.log10(Math.max(N, 1))), 5, pal.red);
      ro.set(0, S.sci(N, 2)); ro.set(1, N0 > 0 ? "×" + S.sci(N / N0, 2) : "—"); ro.set(2, vis ? "oui (> 10¹⁰ copies)" : "non");
    });
  }
});
})();
