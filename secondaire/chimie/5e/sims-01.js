/* Chapitre 1 · Structure électronique et schéma de Lewis */
C5.rgb = function(nm){   /* longueur d'onde (nm) → couleur approximative */
  var r = 0, g = 0, b = 0, f;
  if (nm >= 380 && nm < 440){ r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490){ g = (nm - 440) / 50; b = 1; }
  else if (nm < 510){ g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580){ r = (nm - 510) / 70; g = 1; }
  else if (nm < 645){ r = 1; g = -(nm - 645) / 65; }
  else if (nm <= 780){ r = 1; }
  else return null;
  f = nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : nm > 700 ? 0.3 + 0.7 * (780 - nm) / 80 : 1;
  return "rgb(" + Math.round(255 * r * f) + "," + Math.round(255 * g * f) + "," + Math.round(255 * b * f) + ")";
};
C5.SYM = ["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr"];
C5.NOM = ["hydrogène","hélium","lithium","béryllium","bore","carbone","azote","oxygène","fluor","néon","sodium","magnésium","aluminium","silicium","phosphore","soufre","chlore","argon","potassium","calcium","scandium","titane","vanadium","chrome","manganèse","fer","cobalt","nickel","cuivre","zinc","gallium","germanium","arsenic","sélénium","brome","krypton"];

SFA.sim({
  id: "c5-c01-remplissage", ch: "c01", tag: "Classique",
  titre: "Remplir les sous-couches, électron par électron",
  resume: "Choisis Z de 1 à 36 : les cases se remplissent et la configuration s'écrit.",
  but: "Déplace Z et regarde dans quel ordre les électrons occupent les sous-couches. Relève ensuite les électrons de valence, puis relève le défi.",
  aRetenir: "Ordre de remplissage : 1s 2s 2p 3s 3p 4s 3d 4p. Une sous-couche s accueille 2 électrons, p 6, d 10. Les électrons de valence sont ceux de la couche de plus grand n ; la période est ce plus grand n.",
  piege: "La sous-couche 4s se remplit AVANT la 3d (elle est plus basse en énergie dans l'atome neutre). Le chrome (Z = 24) et le cuivre (Z = 29) sont des exceptions : 4s¹ 3d⁵ et 4s¹ 3d¹⁰.",
  build: function(k, S){
    var ORDER = [[1,0],[2,0],[2,1],[3,0],[3,1],[4,0],[3,2],[4,1]], LET = "spd";
    var pal = S.draw.palette;
    var c = k.canvas(340);
    var zs = k.slider("Numéro atomique Z", 1, 36, 1, 8, "");
    var ro = k.readouts(["Élément", "Configuration électronique", "Période", "Électrons de valence"]);
    var nt = k.note("", "");
    var defis = [
      {t: "Trouve l'élément de la période 3 qui a 5 électrons de valence.", ok: function(z){ return z === 15; }},
      {t: "Trouve le gaz noble de la période 2.", ok: function(z){ return z === 10; }},
      {t: "Trouve l'élément de la période 3 qui a 2 électrons de valence.", ok: function(z){ return z === 12; }},
      {t: "Trouve l'élément dont la configuration se termine par 4s¹ 3d¹⁰.", ok: function(z){ return z === 29; }}
    ], di = 0, defiOn = false;
    var dn = k.note("", "");
    k.button("Défi suivant", function(){ defiOn = true; di = (di + 1) % defis.length; }, true);
    function config(Z){
      var left = Z, out = [];
      ORDER.forEach(function(o){ var cap = 2 * (2 * o[1] + 1), e = Math.min(left, cap); left -= e; out.push({n: o[0], l: o[1], e: e}); });
      if (Z === 24){ out[5].e = 1; out[6].e = 5; }
      if (Z === 29){ out[5].e = 1; out[6].e = 10; }
      return out.filter(function(s){ return s.e > 0; });
    }
    k.draw(function(){
      var Z = zs.value, cf = config(Z), ctx = c.ctx; c.clear();
      var nmax = 0; cf.forEach(function(s){ nmax = Math.max(nmax, s.n); });
      var val = 0; cf.forEach(function(s){ if (s.n === nmax) val += s.e; });
      var rows = ORDER.length, rh = (c.H - 24) / rows, bx = 30;
      S.draw.text(c, "énergie ↑", 8, 10, {size: 12, align: "left", color: pal.grey});
      for (var i = 0; i < rows; i++){
        var o = ORDER[i], y = c.H - 14 - (i + 0.5) * rh, nb = 2 * o[1] + 1;
        var s = cf.filter(function(q){ return q.n === o[0] && q.l === o[1]; })[0], e = s ? s.e : 0;
        S.draw.text(c, o[0] + LET[o[1]], 6, y, {size: 13, align: "left", color: o[0] === nmax ? pal.red : pal.ink});
        for (var j = 0; j < nb; j++){
          var x = 50 + j * (bx + 4), up = e > j, dn2 = e > nb + j;
          ctx.strokeStyle = o[0] === nmax && e > 0 ? pal.red : pal.grey; ctx.lineWidth = 1.5; ctx.strokeRect(x, y - 13, bx, 26);
          if (up) S.draw.text(c, "↑", x + bx / 2 - 6, y, {size: 18, color: pal.acc});
          if (dn2) S.draw.text(c, "↓", x + bx / 2 + 6, y, {size: 18, color: pal.acc});
        }
        if (e > 0) S.draw.text(c, e + " e⁻", 50 + nb * (bx + 4) + 6, y, {size: 12, align: "left", color: pal.grey});
      }
      var str = cf.map(function(q){ return q.n + LET[q.l] + "<sup>" + q.e + "</sup>"; }).join(" ");
      ro.set(0, C5.SYM[Z - 1] + " · " + C5.NOM[Z - 1]); ro.set(1, str); ro.set(2, nmax); ro.set(3, val);
      if (Z === 24 || Z === 29) nt.set("<b>Exception.</b> Une sous-couche d à moitié pleine (d⁵) ou pleine (d¹⁰) est particulièrement stable : un électron passe de 4s vers 3d.", "warn");
      else if (Z === 2 || Z === 10 || Z === 18 || Z === 36) nt.set("Gaz noble : la sous-couche p de la dernière couche est pleine (ou 1s² pour l'hélium). Très peu réactif.", "ok");
      else nt.set("La couche externe (rouge) porte les électrons de valence.", "");
      if (defiOn){ var d = defis[di]; var good = d.ok(Z); dn.set("<b>Défi.</b> " + d.t + (good ? " ✔ Bravo : Z = " + Z + ", c'est " + C5.NOM[Z - 1] + "." : ""), good ? "ok" : ""); }
      else dn.set("Appuie sur « Défi suivant » pour une mission.", "");
    });
  }
});

SFA.sim({
  id: "c5-c01-spectre", ch: "c01", tag: "Graphe",
  titre: "Spectre d'émission de l'hydrogène",
  resume: "Un électron redescend d'un niveau n à un niveau plus bas : un photon, une raie.",
  but: "Choisis le niveau d'arrivée (série) puis le niveau de départ nᵢ (curseur, ou touche un niveau sur le schéma). Lis l'énergie du photon et sa longueur d'onde.",
  aRetenir: "E(n) = −13,6 eV / n². Le photon émis a l'énergie ΔE = E(départ) − E(arrivée) et la longueur d'onde λ = 1240 / ΔE (λ en nm, ΔE en eV). Les raies de la série de Balmer (arrivée n = 2) sont dans le visible.",
  piege: "Il y a des raies et pas un arc-en-ciel continu : seules certaines différences d'énergie existent, parce que les niveaux sont quantifiés. Et l'électron doit descendre : il faut nᵢ > n_f pour émettre.",
  build: function(k, S){
    var pal = S.draw.palette, c = k.canvas(270), sp = k.canvas(120);
    var nf = k.seg("Niveau d'arrivée n_f", [[1, "1 (UV)"], [2, "2 (visible)"], [3, "3 (IR)"]], 2);
    var ni = k.slider("Niveau de départ nᵢ", 2, 7, 1, 3, "");
    var ro = k.readouts(["Énergie du photon ΔE", "Longueur d'onde λ", "Domaine", "Série"]);
    var nt = k.note("", "");
    var E = function(n){ return -13.6 / (n * n); };
    var X0 = 60, lastLevels = [];
    c.pointer(function(type, p){ if (type !== "down" && type !== "drag") return;
      var best = 7, bd = 1e9; lastLevels.forEach(function(l){ var d = Math.abs(l.y - p.y); if (d < bd){ bd = d; best = l.n; } });
      if (best >= 2) ni.set(best); k.redraw(); });
    function lam(a, b){ return 1240 / (13.6 * (1 / (b * b) - 1 / (a * a))); }
    k.draw(function(){
      var f = parseInt(nf.value, 10), i = ni.value; c.clear(); sp.clear();
      var yTop = 26, yBot = c.H - 22; lastLevels = [];
      function Y(n){ return n === 0 ? yTop : yBot - (n - 1) / 7 * (yBot - yTop); }   /* schéma : niveaux régulièrement espacés (pas à l'échelle) */
      for (var n = 1; n <= 7; n++){
        var y = Y(n); lastLevels.push({n: n, y: y});
        S.draw.line(c, X0, y, c.W - 90, y, n === f ? pal.green : pal.grey, n === f || n === i ? 3 : 2);
        S.draw.text(c, "n = " + n, X0 - 8, y, {align: "right", size: 12});
        S.draw.text(c, S.fmt(E(n), 2) + " eV", c.W - 86, y, {align: "left", size: 12, color: pal.grey});
      }
      S.draw.line(c, X0, Y(0), c.W - 90, Y(0), pal.light, 1.5, [4, 4]); S.draw.text(c, "n → ∞ : 0 eV", X0 + 6, Y(0) - 10, {align: "left", size: 12, color: pal.grey});
      S.draw.text(c, "(niveaux non à l'échelle)", c.W - 6, 10, {align: "right", size: 12, color: pal.grey});
      var ok = i > f;
      if (ok){
        S.draw.arrow(c, X0 + 90, Y(i), X0 + 90, Y(f) - 2, pal.red, 3);
        var nm = lam(i, f), col = C5.rgb(nm);
        S.draw.text(c, S.fmt(nm, 0) + " nm", X0 + 104, (Y(i) + Y(f)) / 2, {align: "left", size: 13, color: col || pal.red, bg: "#ffffff"});
      }
      /* spectre */
      var x0 = 14, x1 = sp.W - 14, L0 = 90, L1 = 2000, lx = function(l){ return x0 + (Math.log(l) - Math.log(L0)) / (Math.log(L1) - Math.log(L0)) * (x1 - x0); };
      var ctx = sp.ctx; ctx.fillStyle = "#111"; ctx.fillRect(x0, 34, x1 - x0, 44);
      for (var l = 380; l <= 780; l += 4){ ctx.fillStyle = C5.rgb(l); ctx.globalAlpha = 0.22; ctx.fillRect(lx(l), 34, Math.max(1, lx(l + 4) - lx(l)), 44); ctx.globalAlpha = 1; }
      S.draw.text(sp, "visible", (lx(380) + lx(780)) / 2, 24, {size: 12, color: pal.grey});
      [100, 200, 400, 700, 1000, 2000].forEach(function(t){ S.draw.line(sp, lx(t), 78, lx(t), 84, pal.grey, 1); S.draw.text(sp, t + "", lx(t), 97, {size: 12, color: pal.grey}); });
      S.draw.text(sp, "λ (nm, échelle logarithmique)", sp.W / 2, 113, {size: 12, color: pal.grey});
      for (var m = f + 1; m <= 7; m++){
        var w = lam(m, f), col2 = C5.rgb(w) || "#ffffff";
        ctx.strokeStyle = m === i ? "#ffffff" : col2; ctx.lineWidth = m === i ? 3.5 : 2; ctx.beginPath(); ctx.moveTo(lx(w), 34); ctx.lineTo(lx(w), 78); ctx.stroke();
      }
      if (ok){
        var dE = 13.6 * (1 / (f * f) - 1 / (i * i)), w2 = lam(i, f);
        ro.set(0, S.fmt(dE, 2) + " eV"); ro.set(1, S.fmt(w2, 0) + " nm");
        ro.set(2, w2 < 380 ? "ultraviolet" : w2 > 780 ? "infrarouge" : "visible");
        ro.set(3, f === 1 ? "Lyman" : f === 2 ? "Balmer" : "Paschen");
        nt.set("Une seule transition = une seule raie. Les autres raies de la série sont les autres valeurs de nᵢ (traits colorés).", "");
      } else { ro.set(0, "—"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—"); nt.set("Pas d'émission : nᵢ doit être plus grand que n_f (l'électron redescend).", "warn"); }
    });
  }
});

SFA.sim({
  id: "c5-c01-lewis", ch: "c01", tag: "Classique",
  titre: "Le schéma de Lewis d'un atome et d'un ion",
  resume: "Choisis un élément (H à Ar) et une charge : les électrons de valence se placent en points.",
  but: "Choisis un élément, puis fais varier la charge de l'ion. Compte les électrons de valence, les électrons célibataires et les doublets.",
  aRetenir: "Nombre d'électrons de valence = numéro de la colonne (groupe 1, 2, 13 à 18 : 1, 2, 3 … 8). On met d'abord un point par côté, puis on apparie. Les électrons célibataires indiquent le nombre de liaisons covalentes que l'atome peut former (8 − valence, ou 2 − valence pour H).",
  piege: "Un cation a PERDU des électrons : Na⁺ n'a plus d'électron de valence « propre », sa couche externe est celle du néon (8 e⁻). On écrit [Na]⁺ sans points. Un anion en a GAGNÉ : Cl⁻ a 8 points.",
  build: function(k, S){
    var pal = S.draw.palette, c = k.canvas(260);
    var opts = []; for (var z = 1; z <= 18; z++) opts.push([z, z + " · " + C5.SYM[z - 1] + " " + C5.NOM[z - 1]]);
    var el = k.select("Élément", opts, 8);
    var q = k.slider("Charge de l'ion", -3, 3, 1, 0, "");
    var ro = k.readouts(["Électrons au total", "Électrons de valence", "Célibataires", "Doublets"]);
    var nt = k.note("", "");
    function valence(Z){ return Z <= 2 ? Z : Z <= 10 ? Z - 2 : Z - 10; }
    k.draw(function(){
      var Z = parseInt(el.value, 10), ch = q.value, v = valence(Z), per = Z <= 2 ? 1 : Z <= 10 ? 2 : 3;
      var tot = Z - ch, vi = v - ch, duet = per === 1, bad = false, shown = vi, cat = false;
      c.clear();
      if (tot < 0){ bad = true; }
      if (vi <= 0){ cat = true; shown = per === 2 ? 2 : per === 3 ? 8 : 0; }
      if (!duet && !cat && vi > 8) bad = true;
      if (duet && !cat && vi > 2) bad = true;
      var cx = c.W / 2, cy = c.H / 2, sy = C5.SYM[Z - 1];
      var capMax = (duet || (cat && per === 2)) ? 2 : 8;
      if (bad || tot <= 0){
        S.draw.text(c, sy + (ch ? (Math.abs(ch) > 1 ? C5.sup(Math.abs(ch)) : "") + (ch > 0 ? "⁺" : "⁻") : ""), cx, cy, {size: 44, math: true});
        ro.set(0, tot > 0 ? tot : "—"); ro.set(1, "—"); ro.set(2, "—"); ro.set(3, "—");
        nt.set("Cet ion n'existe pas dans la pratique : on ne peut pas retirer ou ajouter autant d'électrons à la couche de valence.", "warn"); return;
      }
      /* points : un par côté, puis on apparie */
      var sides = [[0, -1], [1, 0], [0, 1], [-1, 0]], cnt = [0, 0, 0, 0], m = shown, i;
      if (capMax === 2){ cnt[0] = m; }
      else { for (i = 0; i < m; i++) cnt[i % 4]++; }
      var d = 38;
      sides.forEach(function(sd, idx){
        for (var j = 0; j < cnt[idx]; j++){
          var off = cnt[idx] === 2 ? (j === 0 ? -7 : 7) : 0;
          var px = cx + sd[0] * d + (sd[0] === 0 ? off : 0), py = cy + sd[1] * d + (sd[1] === 0 ? off : 0);
          S.draw.dot(c, px, py, 5, pal.red);
        }
      });
      var brack = ch !== 0;
      S.draw.text(c, sy, cx, cy, {size: 44, math: true});
      if (brack){
        var ctx = c.ctx; ctx.strokeStyle = pal.ink; ctx.lineWidth = 2.5;
        var bw = 78, bh = 78;
        ctx.beginPath(); ctx.moveTo(cx - bw + 10, cy - bh); ctx.lineTo(cx - bw, cy - bh); ctx.lineTo(cx - bw, cy + bh); ctx.lineTo(cx - bw + 10, cy + bh); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + bw - 10, cy - bh); ctx.lineTo(cx + bw, cy - bh); ctx.lineTo(cx + bw, cy + bh); ctx.lineTo(cx + bw - 10, cy + bh); ctx.stroke();
        S.draw.text(c, (Math.abs(ch) > 1 ? Math.abs(ch) : "") + (ch > 0 ? "+" : "−"), cx + bw + 14, cy - bh + 6, {size: 18, color: pal.red});
      }
      var unp, pairs;
      if (capMax === 2){ unp = shown === 1 ? 1 : 0; pairs = shown === 2 ? 1 : 0; }
      else { pairs = Math.max(0, shown - 4); unp = shown - 2 * pairs; }
      ro.set(0, tot); ro.set(1, cat ? shown + " (couche inférieure)" : shown); ro.set(2, unp); ro.set(3, pairs);
      var iso = tot === 2 ? "He" : tot === 10 ? "Ne" : tot === 18 ? "Ar" : "";
      if (ch === 0) nt.set("Atome neutre. Il peut former " + (capMax === 2 ? 2 - v : 8 - v) + " liaison(s) covalente(s) pour compléter sa couche (" + (capMax === 2 ? "duet" : "octet") + ").", "");
      else nt.set("Ion " + (ch > 0 ? "positif" : "négatif") + " : " + tot + " électrons." + (iso ? " Même configuration que le gaz noble " + iso + " (très stable)." : " Cette configuration n'est pas celle d'un gaz noble : l'ion est peu probable."), iso ? "ok" : "warn");
    });
  }
});

SFA.sim({
  id: "c5-c01-flamme", ch: "c01", tag: "Niche utile",
  titre: "Test de flamme : quel métal brûle de cette couleur ?",
  resume: "Chaque métal colore la flamme : le lien avec les niveaux d'énergie, et un sel mystère à identifier.",
  but: "Passe un sel dans la flamme. Lis la longueur d'onde dominante et l'énergie du photon. Puis passe en mode « Mystère » et identifie le métal à sa couleur.",
  aRetenir: "Dans la flamme, les électrons du métal sont excités puis retombent en émettant des photons dont l'énergie ΔE = 1240 / λ est propre à chaque élément. La couleur est une signature du métal, pas du chlorure.",
  piege: "Les valeurs données sont celles de la raie principale, arrondies : une flamme est un mélange de raies (le jaune du sodium masque facilement les autres couleurs). Et c'est bien le métal, pas l'anion, qui colore.",
  build: function(k, S){
    var pal = S.draw.palette;
    var M = {
      Li: {n: "lithium (LiCl)", l: 671, d: "rouge carmin", col: "#e0214a"},
      Na: {n: "sodium (NaCl)", l: 589, d: "jaune-orangé", col: "#ffb81c"},
      K: {n: "potassium (KCl)", l: 404, d: "violet / lilas", col: "#b07ae6"},
      Ca: {n: "calcium (CaCl₂)", l: 622, d: "orange-rouge brique", col: "#e8541e"},
      Ba: {n: "baryum (BaCl₂)", l: 524, d: "vert pomme", col: "#8fd24a"},
      Cu: {n: "cuivre (CuCl₂)", l: 520, d: "vert-bleu", col: "#2fc7a0"}
    };
    var keys = Object.keys(M);
    var c = k.canvas(300);
    var mode = k.seg("Mode", [["obs", "Observer"], ["mys", "Mystère"]], "obs");
    var sel = k.select("Sel dans la flamme", keys.map(function(x){ return [x, M[x].n]; }), "Na");
    var amount = k.slider("Quantité de sel", 0.2, 1, 0.1, 0.7, "");
    var guess = k.select("Ma réponse", keys.map(function(x){ return [x, M[x].n]; }), "Li");
    var mys = "Ca", verdict = "";
    k.button("Nouveau mystère", function(){ mys = keys[Math.floor(Math.random() * keys.length)]; verdict = ""; mode.set("mys"); }, false);
    k.button("Vérifier ma réponse", function(){ verdict = guess.value === mys ? "ok" : "warn"; }, true);
    var ro = k.readouts(["Raie principale", "Énergie du photon", "Couleur"]);
    var nt = k.note("", "");
    var t0 = 0, lp = k.loop(function(dt, t){ t0 = t; k.redraw(); });
    lp.play();
    k.draw(function(){
      var m = mode.value === "mys" ? mys : sel.value, d = M[m]; c.clear();
      var ctx = c.ctx, cx = c.W / 2, base = c.H - 40;
      /* bec */
      ctx.fillStyle = "#4a5568"; ctx.fillRect(cx - 14, base, 28, 40); ctx.fillStyle = "#2d3748"; ctx.fillRect(cx - 22, base + 34, 44, 6);
      /* flamme */
      var a = amount.value;
      for (var i = 0; i < 26; i++){
        var ph = t0 * 2.2 + i * 1.7, fx = cx + Math.sin(ph) * (4 + i * 0.5), fy = base - i * 7.5;
        var r = (26 - i) * 0.95 + 3;
        ctx.beginPath(); ctx.arc(fx, fy, r, 0, 2 * Math.PI);
        ctx.fillStyle = i < 5 ? "rgba(70,110,255,.45)" : d.col; ctx.globalAlpha = i < 5 ? 0.45 : (0.1 + 0.28 * a) * (1 - i / 34);
        ctx.fill(); ctx.globalAlpha = 1;
      }
      S.draw.text(c, mode.value === "mys" ? "Sel mystère" : d.n, cx, 16, {size: 14});
      var dE = 1240 / d.l;
      if (mode.value === "mys" && !verdict){
        ro.set(0, "?"); ro.set(1, "?"); ro.set(2, d.d);
        nt.set("Regarde la couleur de la flamme, choisis le métal puis appuie sur « Vérifier ».", "");
      } else {
        ro.set(0, d.l + " nm"); ro.set(1, S.fmt(dE, 2) + " eV"); ro.set(2, d.d);
        if (mode.value === "mys") nt.set(verdict === "ok" ? "Bravo : c'est " + M[mys].n + ", λ = " + M[mys].l + " nm." : "Ce n'est pas " + M[guess.value].n + ". Compare avec la couleur de sa fiche en mode « Observer ».", verdict);
        else nt.set("Plus l'énergie du photon est grande, plus on va vers le violet : " + S.fmt(dE, 2) + " eV ↔ " + d.l + " nm.", "");
      }
    });
  }
});
