/* Chapitre 4 · Courant alternatif, transformateur et réseau */
SFA.sim({
  id: "p6-c04-oscilloscope", ch: "c04", tag: "Classique",
  titre: "L'oscilloscope : lire une tension alternative",
  resume: "Règle l'écran (ms/div, V/div) et lis l'amplitude, la période, la fréquence et la valeur efficace.",
  but: "Un signal sinusoïdal u(t) = U_max·sin(2π·f·t) s'affiche sur un écran de 10 × 8 divisions. Change le signal et les réglages de l'oscilloscope ; vérifie tes lectures avec les valeurs affichées. Le bouton « Prise belge » charge le réseau.",
  aRetenir: "On lit la période T sur l'axe horizontal (nombre de divisions × base de temps), puis f = 1/T ; on lit l'amplitude U_max sur l'axe vertical (divisions × sensibilité). La valeur efficace est U_eff = U_max/√2 : c'est la tension continue qui chaufferait autant. La prise belge : U_eff = 230 V, U_max ≈ 325 V, f = 50 Hz, T = 20 ms.",
  piege: "Les 230 V d'une prise sont une valeur efficace, pas la valeur maximale (325 V). Le voltmètre indique U_eff, l'oscilloscope montre U_max. Si la sensibilité est trop grande ou la base de temps mal choisie, le signal paraît écrasé ou trop serré : adapte les réglages.",
  build: function(k, S){
    var c = k.canvas(330), P = S.draw.palette;
    var U = k.slider("Tension maximale U_max", 1, 340, 1, 5, "V");
    var f = k.slider("Fréquence f", 5, 1000, 5, 100, "Hz");
    var tb = k.select("Base de temps", [["0.1", "0,1 ms/div"], ["0.2", "0,2 ms/div"], ["0.5", "0,5 ms/div"], ["1", "1 ms/div"], ["2", "2 ms/div"], ["5", "5 ms/div"], ["10", "10 ms/div"], ["20", "20 ms/div"]], "2");
    var sv = k.select("Sensibilité verticale", [["0.5", "0,5 V/div"], ["1", "1 V/div"], ["2", "2 V/div"], ["5", "5 V/div"], ["10", "10 V/div"], ["50", "50 V/div"], ["100", "100 V/div"]], "2");
    var eff = k.toggle("Montrer ±U_eff (pointillés)", false);
    k.button("Prise belge : 230 V, 50 Hz", function(){ U.set(325); f.set(50); tb.set("5"); sv.set("100"); });
    k.button("Signal de départ", function(){ U.set(5); f.set(100); tb.set("2"); sv.set("2"); });
    var ro = k.readouts(["Période T", "Fréquence f", "U_max", "U_eff = U_max/√2", "U crête à crête"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); var ctx = c.ctx, W = c.W, H = c.H, L = 12, R = 12, T = 12, B = 24, gw = (W - L - R) / 10, gh = (H - T - B) / 8;
      var tbv = parseFloat(tb.value), svv = parseFloat(sv.value);
      ctx.fillStyle = "#0f1b2d"; ctx.fillRect(L, T, W - L - R, H - T - B);
      ctx.strokeStyle = "rgba(120,200,160,.28)"; ctx.lineWidth = 1;
      for (var i = 0; i <= 10; i++){ ctx.beginPath(); ctx.moveTo(L + i * gw, T); ctx.lineTo(L + i * gw, T + 8 * gh); ctx.stroke(); }
      for (i = 0; i <= 8; i++){ ctx.beginPath(); ctx.moveTo(L, T + i * gh); ctx.lineTo(L + 10 * gw, T + i * gh); ctx.stroke(); }
      ctx.strokeStyle = "rgba(120,200,160,.6)"; ctx.beginPath(); ctx.moveTo(L, T + 4 * gh); ctx.lineTo(L + 10 * gw, T + 4 * gh); ctx.moveTo(L + 5 * gw, T); ctx.lineTo(L + 5 * gw, T + 8 * gh); ctx.stroke();
      /* trace */
      ctx.save(); ctx.beginPath(); ctx.rect(L, T, 10 * gw, 8 * gh); ctx.clip(); ctx.strokeStyle = "#7CFC9A"; ctx.lineWidth = 2.4; ctx.beginPath();
      var n = Math.round(10 * gw);
      for (i = 0; i <= n; i++){ var t = (i / n * 10 * tbv) / 1000, u = U.value * Math.sin(2 * Math.PI * f.value * t), y = T + 4 * gh - u / svv * gh; if (i) ctx.lineTo(L + i, y); else ctx.moveTo(L, y); }
      ctx.stroke();
      if (eff.value){ ctx.setLineDash([6, 5]); ctx.strokeStyle = "#f4c542"; ctx.lineWidth = 1.8; var ue = U.value / Math.SQRT2; [1, -1].forEach(function(s){ var yy = T + 4 * gh - s * ue / svv * gh; ctx.beginPath(); ctx.moveTo(L, yy); ctx.lineTo(L + 10 * gw, yy); ctx.stroke(); }); }
      ctx.restore();
      ctx.fillStyle = "#5f6b7a"; ctx.font = "600 12px Mulish, system-ui"; ctx.textAlign = "center";
      ctx.fillText("10 divisions × " + S.fmt(tbv, 1) + " ms = " + S.fmt(10 * tbv, 1) + " ms      1 division = " + S.fmt(svv, 1) + " V", W / 2, H - 6);
      var Tms = 1000 / f.value, divT = Tms / tbv, divU = U.value / svv;
      ro.set(0, S.fmt(Tms, Tms < 1 ? 3 : 2) + " ms"); ro.set(1, S.fmt(f.value, 0) + " Hz"); ro.set(2, S.fmt(U.value, 0) + " V");
      ro.set(3, S.fmt(U.value / Math.SQRT2, 1) + " V"); ro.set(4, S.fmt(2 * U.value, 0) + " V");
      var msg = "Une période occupe " + S.fmt(divT, 2) + " div ; l'amplitude occupe " + S.fmt(divU, 2) + " div.", kind = "ok";
      if (divU > 4){ msg += " Le signal dépasse l'écran : augmente la sensibilité (V/div)."; kind = "warn"; }
      else if (divU < 0.4){ msg += " Signal trop petit : diminue la sensibilité (V/div)."; kind = "warn"; }
      if (divT < 0.5){ msg += " Périodes trop serrées : diminue la base de temps (ms/div)."; kind = "warn"; }
      else if (divT > 10){ msg += " Moins d'une période visible : augmente la base de temps (ms/div)."; kind = "warn"; }
      nt.set(msg, kind);
    });
  }
});

SFA.sim({
  id: "p6-c04-transformateur", ch: "c04", tag: "Transformateur",
  titre: "Le transformateur : tensions, intensités, puissances",
  resume: "U₂/U₁ = N₂/N₁ et I₂/I₁ = N₁/N₂ : la puissance se conserve (aux pertes près).",
  but: "Règle les nombres de spires, la tension d'entrée, la résistance de la charge et le rendement. Compare les barres : la tension monte, l'intensité descend, la puissance ne dépasse jamais celle qu'on fournit.",
  aRetenir: "Transformateur idéal alimenté en alternatif : U₂/U₁ = N₂/N₁. La puissance se conserve : U₁·I₁ = U₂·I₂, donc I₂/I₁ = N₁/N₂ : si la tension est multipliée, l'intensité est divisée. Un transformateur réel a des pertes : P₂ = η·P₁ avec η < 1. Il ne fonctionne qu'en régime variable (alternatif).",
  piege: "Un transformateur ne crée pas d'énergie : si U₂ > U₁, c'est I₂ < I₁. Branché sur une pile (courant continu), il ne donne rien : le flux ne varie pas, donc pas d'induction. Modèle : tensions et intensités efficaces, charge purement résistive.",
  build: function(k, S){
    var c = k.canvas(270), g = k.canvas(130), P = S.draw.palette;
    var N1 = k.slider("Spires du primaire N₁", 100, 2000, 100, 1000, "");
    var N2 = k.slider("Spires du secondaire N₂", 50, 2000, 50, 100, "");
    var U1 = k.slider("Tension du primaire U₁ (efficace)", 10, 400, 10, 230, "V");
    var R = k.slider("Résistance de la charge R", 5, 500, 5, 50, "Ω");
    var eta = k.slider("Rendement η", 80, 100, 1, 100, "%");
    var src = k.seg("Source", [["ac", "Alternatif (prise)"], ["dc", "Continu (pile)"]], "ac");
    var ro = k.readouts(["U₂", "I₂", "I₁", "P₂ (reçue par la charge)", "P₁ (fournie)"]);
    var nt = k.note("", "ok");
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W, H = c.H;
      var m = N2.value / N1.value, ac = src.value === "ac", u2 = ac ? U1.value * m : 0, i2 = u2 / R.value, p2 = u2 * i2, p1 = p2 / (eta.value / 100), i1 = ac ? p1 / U1.value : 0;
      if (!ac){ i1 = U1.value / 1e9; }
      /* noyau */
      var cx = W / 2, cy = H / 2 + 6, cw = 220, ch = 150;
      ctx.lineWidth = 22; ctx.strokeStyle = "#9aa4b2"; ctx.strokeRect(cx - cw / 2, cy - ch / 2, cw, ch); ctx.lineWidth = 1;
      function bob(x, n, col){
        var t = Math.max(3, Math.min(14, Math.round(n / 150)));
        ctx.strokeStyle = col; ctx.lineWidth = 3;
        for (var j = 0; j < t; j++){ var y = cy - 40 + j * 80 / (t - 1 || 1); ctx.beginPath(); ctx.ellipse(x, y, 20, 5, 0, 0, 7); ctx.stroke(); }
      }
      bob(cx - cw / 2, N1.value, P.acc); bob(cx + cw / 2, N2.value, P.red);
      S.draw.text(c, "primaire", cx - cw / 2, cy + ch / 2 - 4 + 22, {size: 12, color: P.acc}); S.draw.text(c, "N₁ = " + N1.value, cx - cw / 2, cy + ch / 2 + 40 - 10, {size: 12, color: P.acc});
      S.draw.text(c, "secondaire", cx + cw / 2, cy + ch / 2 + 18, {size: 12, color: P.red}); S.draw.text(c, "N₂ = " + N2.value, cx + cw / 2, cy + ch / 2 + 30, {size: 12, color: P.red});
      S.draw.text(c, "U₁ = " + S.fmt(U1.value, 0) + " V", cx - cw / 2 - 70, cy - 20, {size: 14, color: P.acc});
      S.draw.text(c, "U₂ = " + S.fmt(u2, 1) + " V", cx + cw / 2 + 74, cy - 20, {size: 14, color: P.red});
      S.draw.text(c, ac ? "~" : "=", cx - cw / 2 - 70, cy + 14, {size: 22, color: P.ink});
      S.draw.text(c, m > 1 ? "élévateur (U₂ > U₁)" : m < 1 ? "abaisseur (U₂ < U₁)" : "rapport 1", cx, 18, {size: 14});
      ro.set(0, S.fmt(u2, 1) + " V"); ro.set(1, S.fmt(i2, 3) + " A"); ro.set(2, ac ? S.fmt(i1, 3) + " A" : "≈ 0 (régime continu)");
      ro.set(3, S.fmt(p2, 2) + " W"); ro.set(4, ac ? S.fmt(p1, 2) + " W" : "0 W");
      nt.set(ac ? "Rapport de transformation m = N₂/N₁ = " + S.fmt(m, 3) + ". I₁/I₂ = " + S.fmt(i2 > 0 ? i1 / i2 : 0, 3) + (eta.value === 100 ? " = m (transformateur idéal)." : " : les pertes augmentent I₁.") + (p2 > 10000 ? " Puissance de " + S.fmt(p2 / 1000, 0) + " kW : bien au-delà d'un transformateur de laboratoire (ordre de grandeur d'un poste de quartier) ; le calcul idéal reste valable mais l'appareil réel chaufferait." : "") : "Sur courant continu, le flux est constant : aucune tension induite au secondaire (après l'instant d'enclenchement).", ac ? (p2 > 10000 ? "warn" : "ok") : "warn");
      /* barres comparées */
      var mx = Math.max(U1.value, u2, 1), items = [["Tension", U1.value, u2, P.acc, "V"], ["Intensité", i1, i2, P.green, "A"], ["Puissance", p1, p2, P.amber, "W"]];
      var bw = (g.W - 40) / 3;
      items.forEach(function(it, j){
        var x0 = 20 + j * bw, big = Math.max(it[1], it[2], 1e-9), h1 = (it[1] / big) * 62, h2 = (it[2] / big) * 62;
        g.ctx.fillStyle = "#c5cedb"; g.ctx.fillRect(x0 + 10, 84 - h1, bw / 2 - 16, h1); g.ctx.fillStyle = it[3]; g.ctx.fillRect(x0 + bw / 2 + 2, 84 - h2, bw / 2 - 16, h2);
        S.draw.text(g, it[0], x0 + bw / 2, 100, {size: 12}); S.draw.text(g, "primaire | secondaire", x0 + bw / 2, 118, {size: 12, color: P.grey});
        S.draw.text(g, S.fmt(it[1], 2), x0 + 10 + (bw / 2 - 16) / 2, 78 - h1 - 6, {size: 12}); S.draw.text(g, S.fmt(it[2], 2), x0 + bw / 2 + 2 + (bw / 2 - 16) / 2, 78 - h2 - 6, {size: 12});
      });
    });
  }
});

SFA.sim({
  id: "p6-c04-ligne-ht", ch: "c04", tag: "Réseau",
  titre: "Pourquoi transporter l'énergie sous très haute tension",
  resume: "Pour la même puissance, élever la tension réduit l'intensité et divise les pertes par effet Joule par le carré.",
  but: "Une centrale envoie une puissance P dans une ligne de résistance R. Fais varier la tension de transport : l'intensité et les pertes changent. Observe la courbe des pertes en fonction de U.",
  aRetenir: "Pour transporter P = U·I, l'intensité vaut I = P/U. La ligne dissipe P_perdue = R·I² = R·P²/U² : doubler U divise les pertes par 4. Voilà pourquoi on élève la tension à 150 ou 380 kV pour les longues distances, puis on l'abaisse avec des transformateurs.",
  piege: "Ce ne sont pas les volts qui chauffent la ligne mais l'intensité : les pertes dépendent de I², pas de U. Modèle simplifié : ligne monophasée, facteur de puissance 1 (le réseau réel est triphasé).",
  build: function(k, S){
    var c = k.canvas(150), g = k.canvas(240), P = S.draw.palette;
    var Pw = k.slider("Puissance transportée P", 1, 200, 1, 100, "MW");
    var Rl = k.slider("Résistance de la ligne R", 1, 30, 1, 10, "Ω");
    var Uk = k.slider("Tension de transport U", 10, 400, 10, 380, "kV");
    var ro = k.readouts(["Intensité I = P/U", "Perte R·I²", "Perte relative", "Puissance reçue"]);
    var nt = k.note("", "ok");
    function loss(Pm, R, U){ var I = Pm * 1e6 / (U * 1e3); return R * I * I / 1e6; }   /* en MW */
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, W = c.W;
      var I = Pw.value * 1e6 / (Uk.value * 1e3), lo = loss(Pw.value, Rl.value, Uk.value), pc = lo / Pw.value * 100, impossible = lo >= Pw.value;
      /* schéma : centrale → élévateur → ligne → abaisseur → ville */
      function box(x, w, txt, col){ ctx.fillStyle = col; ctx.fillRect(x, 52, w, 44); ctx.strokeStyle = P.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, 52, w, 44); S.draw.text(c, txt, x + w / 2, 74, {size: 12}); }
      var bw = Math.min(90, W / 5);
      box(10, bw, "centrale", "#dbe7ff"); box(10 + bw + 8, bw * 0.7, "↑ U", "#fde8d0"); box(W - 10 - bw, bw, "ville", "#dff3e6"); box(W - 10 - bw - 8 - bw * 0.7, bw * 0.7, "↓ U", "#fde8d0");
      var xa = 10 + bw + 8 + bw * 0.7, xb = W - 10 - bw - 8 - bw * 0.7, heat = Math.min(1, pc / 20);
      ctx.strokeStyle = "rgb(" + Math.round(90 + 165 * heat) + "," + Math.round(110 - 60 * heat) + "," + Math.round(140 - 100 * heat) + ")"; ctx.lineWidth = 4 + 8 * Math.min(1, I / 5000); ctx.beginPath(); ctx.moveTo(xa, 74); ctx.lineTo(xb, 74); ctx.stroke();
      S.draw.text(c, "ligne : U = " + S.fmt(Uk.value, 0) + " kV, I = " + S.fmt(I, 0) + " A", (xa + xb) / 2, 36, {size: 13});
      S.draw.text(c, "chaleur perdue : " + (impossible ? "tout !" : S.fmt(lo, 2) + " MW"), (xa + xb) / 2, 112, {size: 13, color: P.red});
      ro.set(0, S.fmt(I, 0) + " A"); ro.set(1, impossible ? "> P" : S.fmt(lo, 2) + " MW"); ro.set(2, impossible ? "> 100 %" : S.fmt(pc, 2) + " %"); ro.set(3, impossible ? "0 MW" : S.fmt(Pw.value - lo, 1) + " MW");
      nt.set(impossible ? "Avec ces valeurs, la ligne dissiperait plus que la puissance envoyée : le transport est impossible. Augmente la tension !" : pc > 10 ? "Plus de 10 % de pertes : réseau très peu rentable. Augmente U." : "Les pertes sont raisonnables.", impossible ? "bad" : pc > 10 ? "warn" : "ok");
      /* graphe pertes relatives vs U */
      var ymax = 30, ax = S.draw.axes(g, {x0: 0, x1: 400, y0: 0, y1: ymax, xl: "U (kV)", yl: "pertes (%)", l: 54, t: 22, stepX: 100, stepY: 10});
      S.draw.fn(g, ax, function(U){ return U < 5 ? NaN : Math.min(100, Rl.value * Pw.value * 1e6 / Math.pow(U * 1e3, 2) * 100); }, P.red);
      var yy = Math.min(ymax, pc); S.draw.dot(g, ax.X(Uk.value), ax.Y(yy), 6, P.ink);
      if (pc > ymax) S.draw.text(g, "hors échelle (" + (impossible ? ">100" : S.fmt(pc, 0)) + " %)", ax.X(Uk.value) + 8, ax.Y(ymax) + 14, {size: 12, align: "left", color: P.ink});
    });
  }
});

SFA.sim({
  id: "p6-c04-redressement", ch: "c04", tag: "Niche · Électronique",
  titre: "Redresser et lisser : du réseau au continu",
  resume: "Diode, pont de diodes, condensateur : comment transformer l'alternatif en (quasi) continu.",
  but: "La tension d'entrée (bleue) passe par une diode ou un pont ; la sortie est en rouge. Ajoute un condensateur de lissage et vois l'ondulation diminuer quand C ou R augmentent.",
  aRetenir: "Une diode ne laisse passer le courant que dans un sens. Avec une diode, on ne garde que les alternances positives (valeur moyenne U_max/π) ; avec un pont de 4 diodes, on garde les deux alternances en valeur absolue (valeur moyenne 2·U_max/π). Un condensateur en parallèle sur la charge se recharge au sommet de chaque alternance et se décharge dans R entre deux sommets : plus R·C est grand devant la période, plus la tension est lisse.",
  piege: "Redressé ne veut pas dire continu : la tension reste pulsée. Et la valeur moyenne d'un signal redressé n'est pas U_eff. Modèle : diodes idéales (en vrai, chute d'environ 0,6 à 0,7 V par diode passante), source de 50 Hz sans résistance interne.",
  build: function(k, S){
    var c = k.canvas(300), P = S.draw.palette;
    var Um = k.slider("Tension maximale U_max", 5, 20, 1, 12, "V");
    var type = k.seg("Redressement", [["none", "Aucun"], ["half", "Une diode (simple alternance)"], ["full", "Pont de 4 diodes"]], "full");
    var lis = k.toggle("Condensateur de lissage", true);
    var C = k.slider("Capacité C", 100, 5000, 100, 1000, "µF");
    var R = k.slider("Charge R", 50, 500, 10, 100, "Ω");
    var ro = k.readouts(["Valeur moyenne (sortie)", "Ondulation (max − min)", "Constante R·C", "Période du signal"]);
    k.draw(function(){
      c.clear(); var f = 50, Tp = 1 / f, dt = 5e-5, tw = 3 * Tp, tau = R.value * C.value * 1e-6, vc = 0;
      function rect(u){ return type.value === "half" ? Math.max(u, 0) : type.value === "full" ? Math.abs(u) : u; }
      var warm = 12 * Tp, steps = Math.round((warm + tw) / dt), pts = [], sum = 0, cnt = 0, mn = 1e9, mx = -1e9, ins = [];
      for (var i = 0; i <= steps; i++){
        var t = i * dt, u = Um.value * Math.sin(2 * Math.PI * f * t), r = rect(u), out;
        if (lis.value && type.value !== "none"){ if (r >= vc) vc = r; else vc *= Math.exp(-dt / tau); out = vc; } else out = r;
        if (t >= warm){ pts.push(out); ins.push(u); if (t >= warm + 2 * Tp){ sum += out; cnt++; mn = Math.min(mn, out); mx = Math.max(mx, out); } }
      }
      var ax = S.draw.axes(c, {x0: 0, x1: tw * 1000, y0: -Um.value * 1.1, y1: Um.value * 1.1, xl: "t (ms)", yl: "U (V)", l: 46, t: 20, stepX: 10});
      S.draw.fn(c, ax, function(tm){ var j = Math.min(ins.length - 1, Math.round(tm / 1000 / dt)); return ins[j]; }, "rgba(30,63,143,.55)", 1.8, [5, 4]);
      S.draw.fn(c, ax, function(tm){ var j = Math.min(pts.length - 1, Math.round(tm / 1000 / dt)); return pts[j]; }, P.red, 2.8);
      S.draw.text(c, "entrée (pointillés bleus)   sortie (rouge)", ax.R - 4, ax.T + 6, {size: 12, align: "right"});
      var th = type.value === "half" ? Um.value / Math.PI : type.value === "full" ? 2 * Um.value / Math.PI : 0;
      var moy = sum / cnt;
      ro.set(0, S.fmt(moy, 2) + " V" + ((!lis.value || type.value === "none") ? " (théorie : " + S.fmt(th, 2) + " V)" : ""));
      ro.set(1, S.fmt(mx - mn, 2) + " V"); ro.set(2, S.fmt(tau * 1000, 0) + " ms"); ro.set(3, "20 ms");
    });
  }
});
