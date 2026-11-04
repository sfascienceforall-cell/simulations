/* Biologie 4e · chapitre 9 · Du gène à la protéine */
(function(){
  var BASES = "UCAG", AAS = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
  var NAMES = {F:"Phe", L:"Leu", S:"Ser", Y:"Tyr", "*":"Stop", C:"Cys", W:"Trp", P:"Pro", H:"His", Q:"Gln", R:"Arg", I:"Ile", M:"Met", T:"Thr", N:"Asn", K:"Lys", V:"Val", A:"Ala", D:"Asp", E:"Glu", G:"Gly"};
  B4.aa = function(cod){ /* cod : 3 lettres ARN */
    var i = BASES.indexOf(cod[0]) * 16 + BASES.indexOf(cod[1]) * 4 + BASES.indexOf(cod[2]); return AAS[i];
  };
  B4.aaName = function(a){ return NAMES[a] || "?"; };
  B4.GENES = {
    hbb:{n:"β-globine (début du gène)", s:"ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTTAA"},
    art:{n:"Gène court n° 1", s:"ATGAAATTTGGCTAA"},
    art2:{n:"Gène court n° 2", s:"ATGCCCTGGAGCGACTGA"}
  };
  /* traduit un brin codant (ADN) ; commence au 1er codon, qui doit être ATG ; renvoie {aa:[...], stop:bool, started:bool} */
  B4.translate = function(dna){
    var rna = dna.replace(/T/g, "U"), out = [], stop = false;
    if (rna.slice(0, 3) !== "AUG") return {aa:[], stop:false, started:false};
    for (var i = 0; i + 3 <= rna.length; i += 3){ var a = B4.aa(rna.slice(i, i + 3)); if (a === "*"){ stop = true; break; } out.push(a); }
    return {aa:out, stop:stop, started:true};
  };
  B4.comp = {A:"T", T:"A", G:"C", C:"G"};
})();

SFA.sim({
  id:"b4-c09-transcription", ch:"c09", tag:"Classique · animation",
  titre:"Transcription : de l'ADN à l'ARN messager",
  resume:"Fais avancer l'ARN polymérase : le brin matrice est copié en ARNm, où T devient U.",
  but:"Choisis un gène et déplace la position de l'ARN polymérase. Lis les trois brins : codant, matrice et ARNm.",
  aRetenir:"L'ARN polymérase lit le brin matrice de l'ADN (3' → 5') et fabrique un ARN messager complémentaire (5' → 3'), avec U à la place de T. L'ARNm a donc la même séquence que le brin codant (non transcrit), U au lieu de T. L'ARNm quitte ensuite le noyau par les pores.",
  piege:"L'ARN contient de l'uracile (U), jamais de thymine (T). La transcription copie un seul des deux brins (le brin matrice), sur la région du gène seulement, pas tout l'ADN.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.7});
    var gene = k.select("Gène", [["hbb","β-globine (début du gène)"],["art","Gène court n° 1"],["art2","Gène court n° 2"]], "hbb");
    var pos = k.slider("Position de l'ARN polymérase", 0, 39, 1, 8, "bases");
    var showT = k.toggle("Afficher le brin matrice", true);
    var ro = k.readouts(["Bases transcrites", "ARNm déjà formé", "Brin lu par l'enzyme"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ var n = B4.GENES[gene.value].s.length; var v = Math.min(n, pos.value + dt * 4); pos.set(Math.round(v * 10) / 10); if (v >= n) lp.pause(); k.redraw(); });
    k.button("▶ Animer", function(){ if (pos.value >= B4.GENES[gene.value].s.length) pos.set(0); lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    var COL = {A:"#2e6b55", T:"#b42318", G:"#1e3f8f", C:"#B45309", U:"#5B21B6"};
    k.draw(function(){
      c.clear(); var W = c.W, H = c.H, cs = B4.GENES[gene.value].s, n = cs.length, p = Math.min(n, Math.floor(pos.value + 1e-6)), vis = 13, cw = Math.min(30, (W - 30) / vis);
      var off = Math.max(0, Math.min(n - vis, p - 8)), x0 = (W - cw * vis) / 2;
      var y1 = H * 0.14, y2 = y1 + cw + 10, y3 = H * 0.62;
      function cell(x, y, b, fill){ B4.rr(c, x + 1, y, cw - 2, cw - 2, 4, fill ? COL[b] : "#f1f5f9", fill ? null : "#cbd5e1", 1); if (fill) B4.txt(c, b, x + cw / 2, y + (cw - 2) / 2, "#fff", Math.min(15, cw * 0.55)); }
      B4.txt(c, "Brin codant (non transcrit) 5' → 3'", x0, y1 - 12, "#5f6b7a", 12, "left");
      if (showT.value) B4.txt(c, "Brin matrice (transcrit) 3' → 5'", x0, y2 + cw + 12, "#5f6b7a", 12, "left");
      B4.txt(c, "ARNm en cours de formation 5' → 3'", x0, y3 - 14, B4.pal.violet, 12, "left");
      for (var i = 0; i < vis; i++){
        var j = off + i; if (j >= n) break; var b = cs[j], x = x0 + i * cw;
        cell(x, y1, b, true); if (showT.value) cell(x, y2, B4.comp[b], true);
        if (showT.value) S.draw.line(c, x + cw / 2, y1 + cw - 2, x + cw / 2, y2, "#cbd5e1", 1.5);
        cell(x, y3, b === "T" ? "U" : b, j < p);
      }
      var rx = x0 + (Math.min(Math.max(p - off, 0), vis)) * cw;
      B4.ell(c, rx, y1 + cw + 4, cw * 1.1, cw * 1.5, "rgba(244,197,66,.3)", B4.pal.amber, 2.5);
      B4.txt(c, "ARN polymérase ↑", Math.max(60, Math.min(W - 60, rx)), y3 + cw + 12, B4.pal.amber, 12);
      var m = cs.slice(0, p).replace(/T/g, "U");
      ro.set(0, p + " / " + n); ro.set(1, p ? (m.length > 16 ? "…" + m.slice(-16) : m) : "—"); ro.set(2, "matrice (3' → 5')");
      nt.set(p === 0 ? "L'ARN polymérase est au début du gène. Elle va lire le brin matrice." : p >= n ? "Fin de la transcription : l'ARNm " + m + " est identique au brin codant, avec U à la place de T. Il quitte le noyau." : "Chaque base du brin matrice est lue : A→U, T→A, G→C, C→G. L'ARNm formé : " + m + ". Compare-le au brin codant (même séquence, U au lieu de T).", p >= n ? "ok" : "");
    });
    gene.el.addEventListener("change", function(){ pos.el.max = B4.GENES[gene.value].s.length; pos.set(Math.min(pos.value, pos.el.max)); k.redraw(); });
  }
});

SFA.sim({
  id:"b4-c09-traduction", ch:"c09", tag:"Classique · code génétique",
  titre:"Traduction : le ribosome lit l'ARNm codon par codon",
  resume:"Avance le ribosome sur l'ARNm : à chaque codon, un ARNt apporte l'acide aminé correspondant.",
  but:"Choisis un gène et avance le ribosome. Le tableau du code génétique surligne le codon lu ; la chaîne d'acides aminés s'allonge.",
  aRetenir:"Le ribosome lit l'ARNm par groupes de 3 bases (codons). Chaque codon correspond à un acide aminé (code génétique), amené par un ARNt dont l'anticodon est complémentaire. La traduction commence au codon AUG (Met) et s'arrête à un codon stop (UAA, UAG, UGA). Le code est redondant : plusieurs codons pour un même acide aminé, mais jamais un codon pour deux acides aminés.",
  piege:"Un codon = 3 bases d'ARNm ; un anticodon = 3 bases de l'ARNt, complémentaires du codon. Les codons stop ne codent aucun acide aminé.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.62}), tb = k.canvas(272);
    var gene = k.select("Gène", [["hbb","β-globine (début du gène)"],["art","Gène court n° 1"],["art2","Gène court n° 2"]], "hbb");
    var pos = k.slider("Codon lu", 0, 12, 1, 3, "");
    var ro = k.readouts(["Codon", "Anticodon de l'ARNt", "Acide aminé", "Chaîne en cours"]);
    var nt = k.note("", "");
    gene.el.addEventListener("change", function(){ pos.el.max = B4.GENES[gene.value].s.length / 3 - 1; pos.set(Math.min(pos.value, pos.el.max)); k.redraw(); });
    var COL = {A:"#2e6b55", U:"#5B21B6", G:"#1e3f8f", C:"#B45309"};
    k.draw(function(){
      var rna = B4.GENES[gene.value].s.replace(/T/g, "U"), nc = rna.length / 3, p = Math.min(nc - 1, pos.value);
      c.clear(); var W = c.W, H = c.H, vis = 5, cw = Math.min(64, (W - 20) / vis), off = Math.max(0, Math.min(nc - vis, p - 2)), x0 = (W - cw * vis) / 2, y = H * 0.18;
      for (var i = 0; i < vis; i++){
        var j = off + i; if (j >= nc) break; var cod = rna.slice(3 * j, 3 * j + 3), x = x0 + i * cw, cur = j === p;
        B4.rr(c, x + 2, y, cw - 4, 34, 6, cur ? "rgba(244,197,66,.5)" : "#f1f5f9", cur ? B4.pal.red : "#cbd5e1", cur ? 3 : 1.2);
        for (var q = 0; q < 3; q++) B4.txt(c, cod[q], x + cw * (0.2 + 0.3 * q), y + 17, COL[cod[q]], 15);
      }
      B4.txt(c, "ARNm (5' → 3')", x0, y - 12, "#5f6b7a", 12, "left");
      var rx = x0 + (p - off) * cw + cw / 2;
      B4.ell(c, rx, H * 0.6, cw * 0.8, cw * 0.4, "rgba(148,163,184,.55)", "#475569", 2.5); B4.txt(c, "ribosome", rx, H * 0.6, B4.pal.ink, 11);
      var cod0 = rna.slice(3 * p, 3 * p + 3), a0 = B4.aa(cod0), ant = cod0.split("").map(function(b){ return {A:"U", U:"A", G:"C", C:"G"}[b]; }).join("");
      B4.rr(c, rx - 22, H * 0.42, 44, 26, 6, "rgba(190,242,100,.6)", "#4d7c0f", 2); B4.txt(c, a0 === "*" ? "stop" : B4.aaName(a0), rx, H * 0.42 + 13, B4.pal.ink, 12);
      S.draw.line(c, rx, y + 36, rx, H * 0.42, "#8a95a3", 1.5, [3, 3]);
      /* chaîne */
      var chain = []; for (i = 0; i <= p; i++){ var a = B4.aa(rna.slice(3 * i, 3 * i + 3)); if (a === "*") break; chain.push(B4.aaName(a)); }
      B4.txt(c, "Chaîne : " + (chain.length ? chain.join("–") : "—"), 8, H * 0.88, B4.pal.acc, 12, "left");
      /* tableau du code génétique */
      tb.clear(); var ctx = tb.ctx, TW = tb.W, cwd = (TW - 40) / 4, ch = 56, bases = "UCAG";
      B4.txt(tb, "2e base →", 28 + 2 * cwd, 9, "#5f6b7a", 11);
      for (var b2 = 0; b2 < 4; b2++) B4.txt(tb, bases[b2], 28 + (b2 + 0.5) * cwd, 22, COL[bases[b2]], 12);
      for (var b1 = 0; b1 < 4; b1++){
        B4.txt(tb, bases[b1], 12, 30 + (b1 + 0.5) * (ch - 2) + 4, COL[bases[b1]], 12);
        for (b2 = 0; b2 < 4; b2++){
          var cx = 28 + b2 * cwd, cy = 30 + b1 * (ch - 2);
          ctx.strokeStyle = "#cbd5e1"; ctx.strokeRect(cx, cy, cwd - 2, ch - 4);
          for (var b3 = 0; b3 < 4; b3++){
            var code = bases[b1] + bases[b2] + bases[b3], aa = B4.aa(code), hl = code === cod0;
            if (hl){ ctx.fillStyle = "rgba(244,197,66,.65)"; ctx.fillRect(cx + 1, cy + 1 + b3 * 12.6, cwd - 4, 12.6); }
            B4.txt(tb, bases[b3] + " " + (aa === "*" ? "stop" : B4.aaName(aa)), cx + 6, cy + 8 + b3 * 12.6, hl ? B4.pal.red : B4.pal.ink, 11, "left");
          }
        }
      }
      B4.txt(tb, "1re base ↓ · 3e base = lettre dans chaque case", TW / 2, 264, "#5f6b7a", 11);
      ro.set(0, cod0); ro.set(1, ant); ro.set(2, a0 === "*" ? "aucun (stop)" : B4.aaName(a0)); ro.set(3, chain.length + " aa");
      nt.set(a0 === "*" ? "Codon stop " + cod0 + " : la traduction s'arrête, la chaîne (" + chain.length + " acides aminés) est libérée." : p === 0 ? "AUG est le codon d'initiation : il code la méthionine (Met), premier acide aminé." : "Codon " + cod0 + " lu par l'ARNt d'anticodon " + ant + " : acide aminé " + B4.aaName(a0) + ". Le code est redondant : regarde combien de codons donnent le même acide aminé dans le tableau.", a0 === "*" ? "ok" : "");
    });
  }
});

SFA.sim({
  id:"b4-c09-mutation", ch:"c09", tag:"Mutations · défi",
  titre:"Une base change, la protéine aussi ? Classer les mutations",
  resume:"Modifie une base du gène de la β-globine et lis l'effet sur la protéine : silencieuse, faux-sens, non-sens, décalage.",
  but:"Choisis le type de mutation, la position et la base. Compare la protéine normale et la protéine mutée. Teste le bouton « Drépanocytose ».",
  aRetenir:"Substitution silencieuse : même acide aminé (code redondant). Faux-sens : un autre acide aminé. Non-sens : apparition d'un codon stop, protéine tronquée. Insertion ou délétion d'une base : décalage du cadre de lecture, tous les codons suivants changent. Toutes les mutations ne sont pas nocives ; la drépanocytose vient d'un seul acide aminé changé (Glu → Val).",
  piege:"Une mutation de l'ADN n'a pas toujours d'effet sur la protéine (silencieuse), et n'est pas toujours nocive. Une mutation dans le codon d'initiation ATG supprime le démarrage de la traduction.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.78});
    var ty = k.seg("Type", [["s","Substitution"],["i","Insertion"],["d","Délétion"]], "s");
    var pos = k.slider("Position de la mutation", 1, 39, 1, 20, "");
    var nb = k.seg("Nouvelle base", [["A","A"],["T","T"],["G","G"],["C","C"]], "T");
    var ro = k.readouts(["Type de mutation", "Acides aminés modifiés ou perdus", "Taille de la protéine", "Conséquence"]);
    var nt = k.note("", "");
    var ORIG = B4.GENES.hbb.s;
    k.button("Drépanocytose (GAG → GTG)", function(){ ty.set("s"); pos.set(20); nb.set("T"); }, true);
    k.button("Mutation silencieuse (CCT → CCC)", function(){ ty.set("s"); pos.set(18); nb.set("C"); });
    k.button("Non-sens (GAG → TAG)", function(){ ty.set("s"); pos.set(19); nb.set("T"); });
    k.draw(function(){
      var p = pos.value - 1, mut, T = ty.value, b = nb.value;
      if (T === "s") mut = ORIG.slice(0, p) + b + ORIG.slice(p + 1);
      else if (T === "i") mut = ORIG.slice(0, p + 1) + b + ORIG.slice(p + 1);
      else mut = ORIG.slice(0, p) + ORIG.slice(p + 1);
      var A = B4.translate(ORIG), Bm = B4.translate(mut);
      c.clear(); var W = c.W, H = c.H, cw = Math.min(14, (W - 30) / 41);
      function seqrow(s, y, ref, label){
        B4.txt(c, label, 8, y - 14, "#5f6b7a", 12, "left");
        for (var i = 0; i < s.length; i++){ var x = 10 + i * cw, diff = ref && (ref[i] !== s[i] || false); var cod = Math.floor(i / 3); B4.rr(c, x, y, cw - 1, 22, 2, cod % 2 ? "#eef2f7" : "#dbe4f0", diff ? B4.pal.red : null, 1.6); B4.txt(c, s[i], x + cw / 2, y + 11, B4.pal.ink, Math.max(11, cw - 2)); }
      }
      seqrow(ORIG, H * 0.12, null, "Gène normal (brin codant)"); seqrow(mut, H * 0.34, T === "s" ? ORIG : null, "Gène muté");
      /* protéines */
      var bw = Math.min(30, (W - 16) / 14);
      function prot(aa, y, ref, label, started){
        B4.txt(c, label, 8, y - 14, "#5f6b7a", 12, "left");
        if (!started){ B4.txt(c, "aucune protéine (pas de codon initiateur)", 8, y + 10, B4.pal.red, 12, "left"); return; }
        for (var i = 0; i < Math.min(aa.length, 13); i++){ var diff = ref && ref[i] !== aa[i]; B4.rr(c, 8 + i * bw, y, bw - 2, 24, 4, diff ? "rgba(254,202,202,.9)" : "rgba(220,252,231,.9)", diff ? B4.pal.red : "#2e6b55", diff ? 2.2 : 1); B4.txt(c, B4.aaName(aa[i]), 8 + i * bw + (bw - 2) / 2, y + 12, B4.pal.ink, Math.max(11, bw * 0.38)); }
        if (aa.length > 13) B4.txt(c, "…", 8 + 13 * bw + 4, y + 12, B4.pal.ink, 13);
      }
      prot(A.aa, H * 0.6, null, "Protéine normale (acides aminés)", true); prot(Bm.aa, H * 0.84, A.aa, "Protéine mutée", Bm.started);
      var nchg = 0, L = Math.max(A.aa.length, Bm.aa.length); for (var i = 0; i < L; i++) if (A.aa[i] !== Bm.aa[i]) nchg++;
      var cls, cons;
      if (!Bm.started){ cls = "perte du démarrage"; cons = "pas de protéine"; }
      else if (T !== "s"){ cls = "décalage du cadre de lecture"; cons = nchg ? "protéine très altérée à partir du codon " + (Math.floor(p / 3) + 1) : "sans effet visible"; }
      else if (nchg === 0){ cls = "silencieuse"; cons = "protéine identique"; }
      else if (A.stop && !Bm.stop){ cls = "perte du codon stop"; cons = "plus de codon stop : la lecture continue et la protéine est allongée"; }
      else if (Bm.aa.length < A.aa.length){ cls = "non-sens"; cons = "protéine tronquée (" + Bm.aa.length + " aa au lieu de " + A.aa.length + ")"; }
      else { cls = "faux-sens"; cons = "1 acide aminé remplacé"; }
      ro.set(0, cls); ro.set(1, nchg); ro.set(2, Bm.started ? Bm.aa.length + " aa" : "—"); ro.set(3, cons);
      var extra = (T === "s" && p === 19 && b === "T") ? " C'est la mutation de la drépanocytose : Glu → Val dans la β-globine, l'hémoglobine S forme des fibres et déforme les globules rouges en faucille." : "";
      nt.set("<b>" + cls.charAt(0).toUpperCase() + cls.slice(1) + ".</b> " + (T === "s" && ORIG[p] === b ? "Tu as « remplacé » la base par elle-même : aucune mutation. " : "") + cons + "." + (cls === "silencieuse" ? " Le code est redondant : le nouveau codon code le même acide aminé." : cls === "faux-sens" ? " Les conséquences dépendent de l'acide aminé et de sa place dans la protéine." : cls === "non-sens" ? " Un codon stop apparaît trop tôt." : cls === "décalage du cadre de lecture" ? " Tous les codons situés après la mutation sont lus différemment." : "") + extra, cls === "silencieuse" ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id:"b4-c09-polysome", ch:"c09", tag:"Polysome · animation",
  titre:"Polysome : plusieurs ribosomes sur un même ARNm",
  resume:"Charge plusieurs ribosomes sur un ARNm et calcule le nombre de protéines produites.",
  but:"Règle la longueur du gène, la vitesse des ribosomes, leur nombre et la durée de vie de l'ARNm. Regarde les chaînes s'allonger et le compteur de protéines.",
  aRetenir:"Plusieurs ribosomes lisent le même ARNm en même temps (polysome). Une protéine de L acides aminés demande un temps L ÷ v. Avec N ribosomes, il sort une protéine toutes les (L ÷ v) ÷ N secondes : débit = N·v ÷ L. Plus l'ARNm vit longtemps, plus il donne de protéines.",
  piege:"Les ribosomes ne peuvent pas se chevaucher : environ un ribosome par 10 codons au maximum. Vitesses d'ordre de grandeur : ≈ 20 aa/s chez les bactéries, ≈ 5 aa/s chez les eucaryotes. Régime établi supposé.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.8});
    var L = k.slider("Longueur de la protéine", 50, 500, 10, 200, "acides aminés");
    var v = k.slider("Vitesse du ribosome", 2, 20, 1, 5, "aa/s");
    var N = k.slider("Ribosomes sur l'ARNm", 1, 50, 1, 5, "");
    var T = k.slider("Durée de vie de l'ARNm", 30, 1800, 30, 300, "s");
    var ro = k.readouts(["Temps pour 1 protéine", "Débit", "Protéines produites", "Ribosomes maximum"]);
    var nt = k.note("", "");
    var st = {t:0, done:0, ph:0};
    var lp = k.loop(function(dt){ var Nn = Math.min(N.value, Math.floor(L.value / 10)); st.ph += dt * v.value / L.value; if (st.ph >= 1){ st.ph -= 1; } st.t += dt; st.done = Math.floor(st.t * Nn * v.value / L.value); k.redraw(); });
    lp.play();
    k.button("↺ Remettre à zéro", function(){ st.t = 0; st.ph = 0; st.done = 0; }, true);
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, Lc = L.value, vv = v.value, Nmax = Math.floor(Lc / 10), Nn = Math.min(N.value, Nmax);
      var x0 = 20, x1 = W - 20, y0 = H * 0.3, hh = H * 0.34;
      S.draw.line(c, x0, y0 + hh, x1, y0 + hh, B4.pal.violet, 5); B4.txt(c, "5'", x0 - 8, y0 + hh, B4.pal.violet, 12); B4.txt(c, "3'", x1 + 8, y0 + hh, B4.pal.violet, 12);
      B4.txt(c, "ARNm (" + Lc * 3 + " nucléotides)", x0, y0 + hh + 22, B4.pal.violet, 12, "left");
      for (var i = 0; i < Nn; i++){
        var f = (st.ph + i / Nn) % 1, x = x0 + f * (x1 - x0);
        B4.ell(c, x, y0 + hh - 7, 9, 7, "rgba(148,163,184,.8)", "#475569", 1.5);
        S.draw.line(c, x, y0 + hh - 13, x - 4 - 14 * f, y0 + hh - 13 - hh * 0.9 * f - 4, B4.pal.green, 2.5);
      }
      B4.txt(c, "chaînes d'acides aminés de plus en plus longues →", W / 2, 14, B4.pal.green, 12);
      var t1 = Lc / vv, rate = Nn * vv / Lc, tot = Math.max(0, (T.value - t1)) * rate + 0;
      var lifeT = T.value, n1 = Math.floor(Math.max(0, lifeT - t1) * rate);
      B4.txt(c, "Protéines terminées depuis le début : " + st.done, W / 2, H - 14, B4.pal.ink, 13);
      ro.set(0, S.fmt(t1, 0) + " s"); ro.set(1, S.fmt(rate * 60, 1) + " / min"); ro.set(2, "≈ " + S.fmt(n1, 0) + " pendant " + S.fmt(lifeT, 0) + " s"); ro.set(3, Nmax);
      nt.set((N.value > Nmax ? "Trop de ribosomes pour cette longueur : un ribosome occupe ≈ 10 codons, seuls " + Nmax + " tiennent. " : "") + "Un ribosome met " + S.fmt(t1, 0) + " s (= " + Lc + " ÷ " + vv + "). Avec " + Nn + " ribosomes, une protéine est libérée toutes les " + S.fmt(t1 / Nn, 1) + " s. Sur la durée de vie de l'ARNm : ≈ " + S.fmt(n1, 0) + " protéines" + (lifeT <= t1 ? " : aucune, l'ARNm est dégradé avant la fin de la 1re protéine." : "."), lifeT <= t1 ? "warn" : "");
    });
  }
});
