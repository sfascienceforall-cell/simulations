/* Biologie 4e · chapitre 8 · ADN, chromosomes et réplication */
SFA.sim({
  id:"b4-c08-adn", ch:"c08", tag:"Classique · défi",
  titre:"Construis ton ADN : appariement des bases",
  resume:"Tape une séquence, lis son brin complémentaire, ses liaisons hydrogène et son %GC ; ou joue à compléter le brin.",
  but:"Mode « Analyser » : écris une séquence (A, T, G, C). Mode « Jeu » : complète le brin complémentaire en choisissant les bases.",
  aRetenir:"Dans l'ADN, A s'apparie avec T (2 liaisons hydrogène) et G avec C (3 liaisons). Les deux brins sont complémentaires et antiparallèles. Dans toute molécule d'ADN double brin : %A = %T et %G = %C. Plus il y a de G–C, plus la molécule est stable.",
  piege:"A ne s'apparie jamais avec G ou C. L'ARN remplace T par U (uracile), mais pas l'ADN. Les bactéries ont aussi de l'ADN, même sans noyau.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.62});
    var mode = k.seg("Mode", [["a","Analyser"],["j","Jeu"]], "a");
    var inp = k.input("Séquence du brin 1 (5' → 3')", "ATGCCGTTAGCA", function(){});
    var ro = k.readouts(["Longueur", "%GC", "Liaisons hydrogène", "Brin complémentaire"]);
    var nt = k.note("", "");
    var COMP = {A:"T", T:"A", G:"C", C:"G"}, COL = {A:"#2e6b55", T:"#b42318", G:"#1e3f8f", C:"#B45309"};
    var st = {tpl:[], idx:0, err:0, msg:"", done:false};
    function nouvelle(){ st.tpl = []; for (var i = 0; i < 10; i++) st.tpl.push("ATGC"[Math.floor(Math.random() * 4)]); st.idx = 0; st.err = 0; st.msg = ""; st.done = false; }
    nouvelle();
    function choisir(b){ if (mode.value !== "j" || st.done) return; if (COMP[st.tpl[st.idx]] === b){ st.idx++; st.msg = ""; if (st.idx >= st.tpl.length){ st.done = true; } } else { st.err++; st.msg = b + " ne s'apparie pas avec " + st.tpl[st.idx] + " (" + st.tpl[st.idx] + " ↔ " + COMP[st.tpl[st.idx]] + ")."; } }
    ["A","T","G","C"].forEach(function(b){ k.button("Base " + b, function(){ choisir(b); }); });
    k.button("Nouvelle séquence (jeu)", function(){ nouvelle(); mode.set("j"); }, true);
    function base(x, y, w, b, fill){ B4.rr(c, x + 1, y, w - 2, w - 2, 4, fill ? COL[b] : "#f1f5f9", fill ? null : "#8a95a3", 1.2); if (fill) B4.txt(c, b, x + w / 2, y + (w - 2) / 2, "#fff", Math.min(15, w * 0.6)); else B4.txt(c, "?", x + w / 2, y + (w - 2) / 2, "#8a95a3", Math.min(14, w * 0.55)); }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, game = mode.value === "j", seq, raw = inp.value.toUpperCase(), bad = /[^ATGC]/.test(raw);
      seq = game ? st.tpl.slice() : raw.replace(/[^ATGC]/g, "").slice(0, 24).split("");
      var n = seq.length, cw = Math.min(34, (W - 40) / Math.max(n, 1)), x0 = (W - cw * n) / 2, y1 = H * 0.2, y2 = H * 0.2 + cw * 2.1 + 14;
      B4.txt(c, "5'", x0 - 14, y1 + cw / 2, B4.pal.ink, 12); B4.txt(c, "3'", x0 + cw * n + 14, y1 + cw / 2, B4.pal.ink, 12);
      B4.txt(c, "3'", x0 - 14, y2 + cw / 2, B4.pal.ink, 12); B4.txt(c, "5'", x0 + cw * n + 14, y2 + cw / 2, B4.pal.ink, 12);
      var gc = 0, hb = 0, comp = "";
      seq.forEach(function(b, i){
        var x = x0 + i * cw, filled = !game || i < st.idx;
        base(x, y1, cw, b, true); base(x, y2, cw, COMP[b], filled);
        if (filled){ var mx = x + cw / 2, ya = y1 + cw - 2, yb = y2, hbn = (b === "A" || b === "T") ? 2 : 3; hb += hbn; if (b === "G" || b === "C") gc++; comp += COMP[b];
          for (var q = 0; q < hbn; q++){ var dx = (q - (hbn - 1) / 2) * 5; S.draw.line(c, mx + dx, ya + 2, mx + dx, yb - 1, "#5f6b7a", 1.6, [3, 2]); } }
        if (game && i === st.idx) { S.draw.line(c, x + 2, y1 + cw + 4, x + cw - 2, y1 + cw + 4, B4.pal.red, 3); }
      });
      if (n === 0){ B4.txt(c, "Écris des bases A, T, G ou C", W / 2, H / 2, B4.pal.grey, 14); }
      var cnt = {A:0, T:0, G:0, C:0}; seq.forEach(function(b){ cnt[b]++; });
      var tot2 = n * 2;
      ro.set(0, n + " paires" ); ro.set(1, n ? S.fmt((game ? (function(){ var g = 0; for (var i = 0; i < n; i++) if (seq[i] === "G" || seq[i] === "C") g++; return g; })() : (cnt.G + cnt.C)) / n * 100, 0) + " %" : "—");
      ro.set(2, game ? hb + " (partiel)" : (cnt.A + cnt.T) * 2 + (cnt.G + cnt.C) * 3); ro.set(3, game ? comp + "…" : seq.map(function(b){ return COMP[b]; }).join(""));
      if (game) nt.set(st.done ? "Brin complété avec " + st.err + " erreur(s). Les deux brins sont complémentaires : A↔T (2 liaisons), G↔C (3 liaisons)." : (st.msg ? "<b>Non.</b> " + st.msg + " " : "") + "Quelle base s'apparie avec " + st.tpl[st.idx] + " ? Erreurs : " + st.err + ".", st.done ? "ok" : st.msg ? "warn" : "");
      else nt.set(bad ? "Seules les lettres A, T, G, C sont acceptées dans l'ADN : les autres sont ignorées (le U n'existe que dans l'ARN)." : n === 0 ? "Entre une séquence." : "Le brin 2 est le complément du brin 1 : " + seq.map(function(b){ return COMP[b]; }).join("") + ". Il y a " + (cnt.A + cnt.T) + " paires A–T (2 liaisons chacune) et " + (cnt.G + cnt.C) + " paires G–C (3 liaisons). Sur les deux brins ensemble : A = T = " + (cnt.A + cnt.T) + " et G = C = " + (cnt.G + cnt.C) + " (règle de Chargaff).", bad ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"b4-c08-meselson", ch:"c08", tag:"Expérience · original",
  titre:"Meselson et Stahl : la réplication est semi-conservative",
  resume:"Compare les trois modèles de réplication aux bandes d'ADN observées après centrifugation.",
  but:"Choisis un modèle et une génération : compare les bandes prévues avec les bandes observées, et regarde les brins anciens (rouge) et nouveaux (bleu).",
  aRetenir:"Réplication semi-conservative : chaque molécule fille contient un brin ancien et un brin nouveau. Après n générations dans un milieu « léger » (¹⁴N), on obtient 2ⁿ molécules dont 2 seulement sont hybrides. Seul ce modèle prévoit : 1 bande hybride à la 1re génération, puis 2 bandes (hybride et légère) à la 2e.",
  piege:"Le modèle conservatif est éliminé dès la 1re génération (il prévoirait 2 bandes, lourde et légère) ; le modèle dispersif dès la 2e (il prévoirait une seule bande de plus en plus légère). Ne confonds pas « hybride » (¹⁵N et ¹⁴N) et « mutant ».",
  build:function(k, S){
    var c = k.canvas(0, {ratio:1.0});
    var mod = k.seg("Modèle testé", [["s","Semi-conservatif"],["c","Conservatif"],["d","Dispersif"]], "s");
    var g = k.slider("Génération (dans ¹⁴N) pour le détail", 0, 4, 1, 2, "");
    var ro = k.readouts(["Molécules d'ADN", "Brins anciens (¹⁵N)", "Bandes prévues", "Verdict"]);
    var nt = k.note("", "");
    function bands(model, n){
      /* renvoie une liste de {pos: 0 (léger) à 1 (lourd), frac} */
      if (n === 0) return [{pos:1, frac:1}];
      if (model === "s"){ var h = 2 / Math.pow(2, n); return n === 1 ? [{pos:0.5, frac:1}] : [{pos:0.5, frac:h}, {pos:0, frac:1 - h}]; }
      if (model === "c"){ var f = 1 / Math.pow(2, n); return [{pos:1, frac:f}, {pos:0, frac:1 - f}]; }
      return [{pos:1 / Math.pow(2, n), frac:1}];
    }
    function same(a, b){ if (a.length !== b.length) return false; for (var i = 0; i < a.length; i++){ if (Math.abs(a[i].pos - b[i].pos) > 0.02 || Math.abs(a[i].frac - b[i].frac) > 0.02) return false; } return true; }
    function sortb(a){ return a.slice().sort(function(x, y){ return y.pos - x.pos; }); }
    function tubes(y, hh, model, title, hl){
      var ctx = c.ctx, W = c.W, L = 16, R = 12, cw = (W - L - R) / 5;
      B4.txt(c, title, L, y - 14, B4.pal.ink, 12, "left");
      for (var n = 0; n <= 4; n++){
        var cx = L + (n + 0.5) * cw, bs = bands(model, n);
        B4.rr(c, cx - 13, y, 26, hh, 12, "#f8fafc", n === hl ? B4.pal.red : "#13233a", n === hl ? 3.5 : 1.6);
        bs.forEach(function(b){ var yy = y + hh * (0.88 - 0.7 * b.pos), th = 3 + 9 * b.frac; ctx.fillStyle = b.pos > 0.7 ? "#b42318" : b.pos > 0.3 ? "#5B21B6" : "#1e3f8f"; if (n === 0 || b.frac > 0) ctx.fillRect(cx - 12, yy - th / 2, 24, th); });
        B4.txt(c, "G" + n, cx, y + hh + 12, B4.pal.ink, 11);
      }
    }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, n = g.value, M = mod.value, hh = H * 0.15;
      tubes(32, hh, "s", "Observé (Meselson et Stahl)", n);
      tubes(32 + hh + 52, hh, M, "Prévu : modèle " + (M === "s" ? "semi-conservatif" : M === "c" ? "conservatif" : "dispersif"), n);
      /* molécules à la génération n */
      var my = 32 + 2 * hh + 100, mh = H * 0.14, cnt = Math.pow(2, n), cw = Math.min(34, (W - 24) / cnt);
      B4.txt(c, "Génération " + n + " : " + cnt + " molécule" + (cnt > 1 ? "s" : ""), 12, my - 14, B4.pal.ink, 12, "left"); B4.txt(c, "rouge = brin ancien (¹⁵N) · bleu = brin nouveau (¹⁴N)", 12, my + mh + 18, "#5f6b7a", 11, "left");
      var x0 = (W - cw * cnt) / 2;
      for (var i = 0; i < cnt; i++){
        var xa = x0 + i * cw + cw * 0.3, xb = x0 + i * cw + cw * 0.7;
        function strand(x, kind){
          if (kind === "r") S.draw.line(c, x, my, x, my + mh, "#b42318", 4);
          else if (kind === "b") S.draw.line(c, x, my, x, my + mh, "#1e3f8f", 4);
          else { var seg = 8, f = Math.round(seg / Math.pow(2, n)); for (var q = 0; q < seg; q++) S.draw.line(c, x, my + q * mh / seg, x, my + (q + 1) * mh / seg, (q * 7 % seg) < Math.max(f, n === 0 ? 8 : 0) ? "#b42318" : "#1e3f8f", 4); }
        }
        var ka, kb;
        if (n === 0){ ka = "r"; kb = "r"; }
        else if (M === "s"){ ka = i < 2 ? "r" : "b"; kb = "b"; }
        else if (M === "c"){ ka = i === 0 ? "r" : "b"; kb = i === 0 ? "r" : "b"; }
        else { ka = "m"; kb = "m"; }
        strand(xa, ka); strand(xb, kb);
      }
      var ob = sortb(bands("s", n)), pr = sortb(bands(M, n)), ok = same(ob, pr);
      var old = M === "s" ? (n === 0 ? 2 : 2) : M === "c" ? 2 : 2;
      ro.set(0, cnt); ro.set(1, n === 0 ? "2 (tous)" : (M === "d" ? "dispersés" : "2")); ro.set(2, pr.length + (pr.length > 1 ? " bandes" : " bande")); ro.set(3, ok ? "compatible" : "incompatible");
      nt.set(ok ? (M === "s" ? "Le modèle semi-conservatif prévoit exactement les bandes observées à toutes les générations. " : "À la génération " + n + ", ce modèle prévoit les mêmes bandes que l'observation : il faut regarder une autre génération pour le départager. ") + (n === 0 ? "Génération 0 : une molécule entièrement ancienne (¹⁵N). " : (M === "d" ? "Génération " + n + " : " + cnt + " molécules, toutes mêlant ancien et nouveau. " : "Génération " + n + " : " + cnt + " molécules, dont 2 contiennent un brin ancien. ")) + "(Tubes : bas = ADN lourd ¹⁵N, haut = léger ¹⁴N.)" : "Désaccord avec l'observation à la génération " + n + " : " + (M === "c" ? "ce modèle prévoit une bande lourde et une bande légère (pas de bande hybride)." : "ce modèle prévoit une seule bande de plus en plus légère, alors qu'on observe deux bandes.") + " Il est donc réfuté.", ok ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id:"b4-c08-caryotype", ch:"c08", tag:"Caryotype · comptage",
  titre:"Caryotype : chromosomes, chromatides et molécules d'ADN",
  resume:"Compte chromosomes et chromatides dans des cellules normales ou porteuses d'anomalies, avant et après réplication.",
  but:"Choisis la cellule et le stade (avant ou après réplication de l'ADN). Lis le nombre de chromosomes, de chromatides et de molécules d'ADN.",
  aRetenir:"Une cellule humaine somatique possède 46 chromosomes : 22 paires d'autosomes et 1 paire de chromosomes sexuels (XX ou XY). Les gamètes n'en ont que 23. Avant la réplication, chaque chromosome est formé d'une chromatide (1 molécule d'ADN) ; après, de deux chromatides sœurs : le nombre de chromosomes ne change pas, celui des chromatides double.",
  piege:"Ne confonds pas chromosome (une unité entière) et chromatide (une moitié de chromosome répliqué). 46 chromosomes à deux chromatides = 92 chromatides, pas 92 chromosomes.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.9});
    var cell = k.select("Cellule", [["xx","Cellule de femme (46,XX)"],["xy","Cellule d'homme (46,XY)"],["t21","Trisomie 21 (47,XX,+21)"],["tur","Syndrome de Turner (45,X)"],["kli","Syndrome de Klinefelter (47,XXY)"],["ov","Ovule (23,X)"],["sp","Spermatozoïde (23,Y)"]], "xx");
    var rep = k.seg("Stade", [["0","Avant réplication (G1)"],["1","Après réplication (G2, début de mitose)"]], "0");
    var ro = k.readouts(["Chromosomes", "Chromatides", "Molécules d'ADN", "Quantité d'ADN"]);
    var nt = k.note("", "");
    var LEN = [1, .97, .8, .76, .74, .7, .65, .6, .58, .56, .55, .54, .48, .45, .44, .4, .38, .36, .31, .3, .24, .26];
    var DEF = {xx:{c:[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], sx:"XX", d:"46,XX"}, xy:{sx:"XY", d:"46,XY"}, t21:{sx:"XX", d:"47,XX,+21", extra:20}, tur:{sx:"X", d:"45,X"}, kli:{sx:"XXY", d:"47,XXY"}, ov:{sx:"X", d:"23,X", hap:true}, sp:{sx:"Y", d:"23,Y", hap:true}};
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, d = DEF[cell.value], hap = !!d.hap, r2 = rep.value === "1" && !hap, ncols = 12, cwid = (W - 16) / ncols, rowH = H * 0.44;
      var auto = 0, sexn = d.sx.length;
      function chrom(x, y, len, col){
        var h = len * rowH * 0.62;
        if (r2){ B4.rr(c, x - 5, y, 4, h, 2, col, null, 0); B4.rr(c, x + 1, y, 4, h, 2, col, null, 0); S.draw.dot(c, x, y + h * 0.4, 3, "#13233a"); }
        else { B4.rr(c, x - 2, y, 4, h, 2, col, null, 0); S.draw.dot(c, x, y + h * 0.4, 2.4, "#13233a"); }
      }
      for (var i = 0; i < 22; i++){
        var row = i < 12 ? 0 : 1, col = i < 12 ? i : i - 12, cx = 8 + (col + 0.5) * cwid, y = 14 + row * (rowH + 18), nco = hap ? 1 : (d.extra === i ? 3 : 2);
        for (var q = 0; q < nco; q++) chrom(cx + (q - (nco - 1) / 2) * (r2 ? 12 : 9), y, LEN[i], d.extra === i && q === 2 ? B4.pal.red : "#1e3f8f");
        auto += nco; B4.txt(c, i + 1 + "", cx, y + rowH * 0.62 + 12, "#5f6b7a", 11);
      }
      var sc = 8 + (10 + 0.5) * cwid, sy = 14 + (rowH + 18);
      B4.txt(c, "sexuels", 8 + 11.5 * cwid - 4, sy + rowH * 0.62 + 24, "#5f6b7a", 11);
      for (q = 0; q < sexn; q++){ var ch = d.sx[q]; chrom(8 + (10.2 + q * 0.5) * cwid + 2, sy + (ch === "Y" ? rowH * 0.3 * 0.62 : 0), ch === "X" ? 0.62 : 0.3, B4.pal.green); B4.txt(c, ch, 8 + (10.2 + q * 0.5) * cwid + 2, sy + rowH * 0.62 + 12, B4.pal.green, 12); }
      var nc = auto + sexn, nch = r2 ? 2 * nc : nc, ndna = nch, ploidy = hap ? "n = 23" : "2n";
      ro.set(0, nc); ro.set(1, nch); ro.set(2, ndna); ro.set(3, hap ? "1C (haploïde)" : r2 ? "4C" : "2C");
      var msg = "<b>" + d.d + ".</b> " + nc + " chromosomes";
      msg += hap ? " : un seul exemplaire de chaque (cellule haploïde, n = 23). " : " (" + auto + " autosomes + " + sexn + " sexuels). ";
      if (d.extra !== undefined) msg += "Trois exemplaires du chromosome 21 (en rouge) : trisomie 21. ";
      if (cell.value === "tur") msg += "Un seul chromosome sexuel X : syndrome de Turner. ";
      if (cell.value === "kli") msg += "Deux X et un Y : syndrome de Klinefelter. ";
      if (r2) msg += "Après réplication, chaque chromosome a 2 chromatides sœurs : " + nc + " chromosomes = " + nch + " chromatides = " + nch + " molécules d'ADN.";
      else msg += (hap ? "" : "Avant réplication, une chromatide par chromosome : " + nc + " chromatides.");
      nt.set(msg, d.extra !== undefined || cell.value === "tur" || cell.value === "kli" ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"b4-c08-genome", ch:"c08", tag:"Échelles · original",
  titre:"L'ADN bout à bout : quelle longueur ?",
  resume:"Compare la longueur d'ADN d'une cellule de plusieurs organismes à la taille de son noyau, puis mets-en bout à bout.",
  but:"Choisis un organisme et un nombre de cellules : lis la longueur d'ADN, le facteur de compaction et compare à des distances connues.",
  aRetenir:"Longueur d'ADN = nombre de paires de bases × 0,34 nm. Une cellule humaine contient ≈ 6,2·10⁹ paires de bases (2 jeux de 3,1·10⁹), soit ≈ 2 m d'ADN dans un noyau d'≈ 6 µm : l'ADN est compacté ≈ 350 000 fois, enroulé autour de protéines (histones) puis replié en chromosomes. Bout à bout, l'ADN des cellules d'un corps humain dépasse des centaines de fois la distance Terre–Soleil.",
  piege:"Ordres de grandeur seulement (valeurs arrondies, nombre de cellules du corps ≈ 4·10¹³). La taille du génome ne mesure pas la « complexité » d'un organisme.",
  build:function(k, S){
    var c = k.canvas(0, {ratio:.95});
    var org = k.select("Organisme", [["ec","Bactérie E. coli (1 chromosome)"],["ye","Levure (cellule haploïde)"],["dm","Mouche drosophile (diploïde)"],["hu","Humain (diploïde)"]], "hu");
    var ne = k.slider("Nombre de cellules : 10 puissance", 0, 14, 1, 0, "");
    var ro = k.readouts(["Paires de bases par cellule", "ADN par cellule", "Compaction (ADN ÷ cellule/noyau)", "Longueur d'ADN totale"]);
    var nt = k.note("", "");
    var D = {ec:{n:"E. coli", bp:4.6e6, d:2e-6, lab:"bactérie (2 µm)"}, ye:{n:"levure", bp:1.2e7, d:5e-6, lab:"cellule (5 µm)"}, dm:{n:"drosophile", bp:2.8e8, d:5e-6, lab:"noyau (≈ 5 µm)"}, hu:{n:"humain", bp:6.2e9, d:6e-6, lab:"noyau (6 µm)"}};
    var BM = [["1 m", 1], ["tour de la Terre", 4.0e7], ["Terre–Lune", 3.84e8], ["Terre–Soleil", 1.5e11], ["Soleil–Neptune", 4.5e12]];
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, d = D[org.value], Lc = d.bp * 0.34e-9, N = Math.pow(10, ne.value), Lt = Lc * N;
      var lo = -7, hi = 13, L = 14, Rr = W - 14;
      function PX(m){ return L + (Math.log10(m) - lo) / (hi - lo) * (Rr - L); }
      var ay = H * 0.34;
      S.draw.line(c, L, ay, Rr, ay, B4.pal.ink, 2);
      for (var e = lo; e <= hi; e += 2){ S.draw.line(c, PX(Math.pow(10, e)), ay - 5, PX(Math.pow(10, e)), ay + 5, B4.pal.ink, 1.5); B4.txt(c, "10" + (e < 0 ? "⁻" : "") + String(Math.abs(e)).replace(/\d/g, function(q){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[q]; }), PX(Math.pow(10, e)), ay + 18, "#5f6b7a", 11); }
      B4.txt(c, "longueur (m), échelle logarithmique", W / 2, ay + 38, "#5f6b7a", 12);
      S.draw.dot(c, PX(d.d), ay, 6, B4.pal.teal); B4.txt(c, d.lab, PX(d.d) + 4, ay - 30, B4.pal.teal, 12, "left"); S.draw.line(c, PX(d.d), ay - 24, PX(d.d), ay, B4.pal.teal, 1);
      S.draw.dot(c, PX(Lc), ay, 6, B4.pal.amber); B4.txt(c, "ADN d'une cellule", PX(Lc), ay - 58, B4.pal.amber, 12, Lc > 1e-2 ? "center" : "left"); S.draw.line(c, PX(Lc), ay - 52, PX(Lc), ay, B4.pal.amber, 1);
      S.draw.dot(c, PX(Lt), ay, 8, B4.pal.red); S.draw.line(c, PX(Lt), ay, PX(Lt), ay + 48, B4.pal.red, 2); B4.txt(c, "ADN de " + (N < 10 ? "1 cellule" : "10" + String(ne.value).replace(/\d/g, function(q){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[q]; }) + " cellules"), Math.min(W - 80, Math.max(80, PX(Lt))), ay + 58, B4.pal.red, 12);
      BM.forEach(function(b, i){ S.draw.line(c, PX(b[1]), ay - 4, PX(b[1]), ay + 5, B4.pal.green, 2.5); B4.txt(c, b[0], PX(b[1]), ay + 86 + i * 14, B4.pal.green, 11, i > 2 ? "right" : "left"); });
      var nbp = d.bp, comp = Lc / d.d, ratioSun = Lt / 1.5e11, txt;
      ro.set(0, S.sci(nbp, 2).replace(/<\/?sup>/g, function(t){ return t === "<sup>" ? "^" : ""; })); ro.set(1, B4.len(Lc)); ro.set(2, "× " + S.fmt(comp, 0)); ro.set(3, Lt >= 1e9 ? S.fmt(Lt / 1000, 0).length > 9 ? S.sci(Lt / 1000, 1) + " km" : S.fmt(Lt / 1000, 0) + " km" : B4.len(Lt));
      txt = "Chaque cellule de " + d.n + " renferme " + B4.len(Lc) + " d'ADN dans " + d.lab.replace(/\(.*\)/, "").trim() + " de " + (d.d * 1e6) + " µm : compaction ≈ " + S.fmt(comp, 0) + " fois. ";
      if (Lt > 1.5e11) txt += "Bout à bout, 10^" + ne.value + " cellules donneraient ≈ " + S.fmt(ratioSun, 0) + " fois la distance Terre–Soleil.";
      else if (Lt > 1) txt += "À cette échelle, la longueur dépasse déjà le mètre.";
      nt.set(txt, "");
    });
  }
});
