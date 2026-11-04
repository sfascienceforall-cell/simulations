(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function nf(x,d){ var a = F(x,d||0).split(","); a[0] = a[0].replace(/\B(?=(\d{3})+(?!\d))/g," "); return a.join(","); }

/* ===== 1 · Zoom sur l'intestin : plier la paroi ===== */
SFA.sim({
  id:"b3-c04-surface-intestin", ch:"c04", tag:"Classique · tombe souvent",
  titre:"Plis, villosités, microvillosités : la surface d'absorption",
  resume:"Un tube lisse de 4 m offre 0,3 m² : plisse sa paroi à trois échelles et regarde la surface exploser.",
  but:"Règle le facteur de multiplication de chaque niveau de repliement et observe la coupe de la paroi et la surface totale d'échange.",
  aRetenir:"La paroi de l'intestin grêle est repliée à trois échelles : plis, villosités, microvillosités. Les facteurs se multiplient : une longueur modeste devient une très grande surface d'échange (de l'ordre de dizaines à centaines de m² selon les estimations), ce qui permet d'absorber beaucoup de nutriments rapidement.",
  piege:"Ce n'est pas « la surface d'un terrain de tennis » à prendre au pied de la lettre : les mesures varient de 30 à 250 m² selon les méthodes. Retiens l'idée : replier = agrandir la surface sans agrandir le volume. Une villosité n'est pas un poil ni un tube vide : elle contient un capillaire sanguin et un vaisseau chylifère.",
  build:function(k,S){
    var c = k.canvas(330);
    var L = k.slider("Longueur du grêle", 3, 7, .5, 4, "m");
    var f1 = k.slider("Plis (facteur)", 1, 3, .5, 3, "×");
    var f2 = k.slider("Villosités (facteur)", 1, 10, 1, 10, "×");
    var f3 = k.slider("Microvillosités (facteur)", 1, 20, 1, 20, "×");
    var ro = k.readouts(["Tube lisse","Surface avec replis","Multiplication","Équivalent en « peaux »"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var g = c.ctx, W = c.W, yb = 250, x0 = 20, x1 = W-20;
      var a1 = (f1.value-1)/2*34, h2 = (f2.value-1)/9*34, h3 = (f3.value-1)/19*6;
      function yc(x){ return yb - a1*(1-Math.cos(2*Math.PI*(x-x0)/(x1-x0)*3))/2; }
      /* lumière en haut, paroi en bas */
      rect(c,x0,20,x1-x0,yb-20+60,"#fdf3e6");
      g.fillStyle="#f2b9a8"; g.beginPath(); g.moveTo(x0,yb+70); g.lineTo(x0,yc(x0)); 
      var nv = 16, i;
      for (var x=x0; x<=x1; x+=2) g.lineTo(x,yc(x));
      g.lineTo(x1,yb+70); g.closePath(); g.fill();
      g.strokeStyle="#b56a50"; g.lineWidth=2; g.beginPath(); for (x=x0; x<=x1; x+=2){ if (x===x0) g.moveTo(x,yc(x)); else g.lineTo(x,yc(x)); } g.stroke();
      if (f2.value>1){
        for (i=0;i<nv;i++){
          var vx = x0 + (i+.5)*(x1-x0)/nv, vy = yc(vx), vw = 8;
          g.fillStyle="#f2b9a8"; g.strokeStyle="#b56a50"; g.lineWidth=1.6; g.beginPath(); g.moveTo(vx-vw/2,vy+2); g.lineTo(vx-vw/2,vy-h2+vw/2); g.arc(vx,vy-h2+vw/2,vw/2,Math.PI,0); g.lineTo(vx+vw/2,vy+2); g.fill(); g.stroke();
          g.strokeStyle=P.red; g.lineWidth=1.4; g.beginPath(); g.moveTo(vx,vy+2); g.lineTo(vx,vy-h2+2); g.stroke();
          if (h3>.4){ g.strokeStyle="#7a3a28"; g.lineWidth=1; for (var m=-3;m<=3;m++){ var ang = m*.3-Math.PI/2; g.beginPath(); g.moveTo(vx+Math.cos(ang)*(vw/2),vy-h2+vw/2+Math.sin(ang)*(vw/2)); g.lineTo(vx+Math.cos(ang)*(vw/2+h3),vy-h2+vw/2+Math.sin(ang)*(vw/2+h3)); g.stroke(); } }
        }
      }
      T(c,"lumière de l'intestin (aliments digérés)",c.W/2,34,{size:12,color:P.amber});
      T(c,"paroi (coupe schématique)",c.W/2,yb+50,{size:12,color:"#7a3a28"});
      var s0 = Math.PI*.025*L.value, fac = f1.value*f2.value*f3.value, st = s0*fac;
      ro.set(0,S.fmt(s0,2)+" m²"); ro.set(1,st>=10 ? S.fmt(st,0)+" m²" : S.fmt(st,1)+" m²"); ro.set(2,"× "+S.fmt(fac,0)); ro.set(3,S.fmt(st/1.8,0)+" × la peau (1,8 m²)");
      nt.set(fac===1 ? "Paroi lisse : peu de surface. Replie-la !" : "Facteurs : "+S.fmt(f1.value,1)+" × "+f2.value+" × "+f3.value+" = "+S.fmt(fac,0)+". La surface est multipliée sans que le volume de l'intestin change.","ok");
    });
  }
});

/* ===== 2 · Glucose dans le sang ===== */
SFA.sim({
  id:"b3-c04-glycemie", ch:"c04", tag:"Modèle chiffré",
  titre:"Après le repas : la glycémie en montagnes russes",
  resume:"Un repas sucré ou un repas complet : comment le glucose absorbé fait monter puis redescendre la glycémie.",
  but:"Règle la quantité de glucose absorbée et la vitesse d'absorption. Compare un fonctionnement normal et une régulation insuffisante (diabète).",
  aRetenir:"Le glucose absorbé arrive dans le sang (veine porte puis foie). La glycémie monte, puis redescend : le glucose est mis en réserve (glycogène du foie et des muscles) ou utilisé par les cellules, sous l'action de l'insuline du pancréas. Normale : environ 0,7 à 1,1 g/L ; une glycémie à jeun supérieure à 1,26 g/L signale un diabète.",
  piege:"Aliments rapides (boissons sucrées) = pic haut et rapide ; aliments à fibres = montée plus lente et plus basse, pour la même quantité de glucose. Le glucose ne disparaît pas : il est stocké ou consommé. (Modèle simplifié, valeurs indicatives ; l'insuline n'est pas modélisée en détail.)",
  build:function(k,S){
    var c = k.canvas(300);
    var A = k.slider("Glucose absorbé au repas", 0, 100, 5, 50, "g");
    var v = k.seg("Type de repas", [[20,"Rapide (boisson sucrée)"],[60,"Lent (repas à fibres)"]], 20);
    var reg = k.seg("Régulation", [["n","Normale"],["d","Insuffisante (diabète)"]], "n");
    var tm = k.slider("Temps après le repas", 0, 300, 10, 60, "min");
    var ro = k.readouts(["Glycémie à cet instant","Pic de glycémie","Heure du pic","Glucose retiré du sang"]);
    var nt = k.note("","");
    function run(){
      var tau = +v.value, V = 15, G0 = .9, kb = reg.value==="n" ? .02 : .005, be = reg.value==="n" ? .12 : .018, dt = .25, G = G0, cl = 0, out = [], pk = G0, tp = 0;
      for (var i=0;i<=1200;i++){
        var t = i*dt, ra = A.value*t/(tau*tau)*Math.exp(-t/tau), x = G-G0, cc = (kb+be*Math.max(0,x))*x;
        out.push([t,G,cl]); if (G>pk){ pk = G; tp = t; }
        cl += cc*V*dt; G += dt*(ra/V - cc);
      }
      return {out:out,pk:pk,tp:tp};
    }
    k.draw(function(){
      c.clear(); var r = run(), ax = D.axes(c,{x0:0,x1:300,y0:.5,y1:Math.max(2.4,Math.ceil(r.pk*5)/5+.1),xl:"temps (min)",yl:"glycémie (g/L)",stepX:60,stepY:.5,l:50});
      c.ctx.fillStyle = "rgba(46,107,85,.13)"; c.ctx.fillRect(ax.L,ax.Y(1.1),ax.R-ax.L,ax.Y(.7)-ax.Y(1.1));
      T(c,"zone normale",ax.R-4,ax.Y(.78),{size:12,align:"right",color:P.green});
      c.ctx.save(); c.ctx.setLineDash([5,4]); c.ctx.strokeStyle = P.red; c.ctx.beginPath(); c.ctx.moveTo(ax.L,ax.Y(1.26)); c.ctx.lineTo(ax.R,ax.Y(1.26)); c.ctx.stroke(); c.ctx.restore();
      T(c,"1,26 g/L",ax.R-4,ax.Y(1.26)-9,{size:12,align:"right",color:P.red});
      D.fn(c,ax,function(x){ var j = Math.min(1200,Math.round(x*4)); return r.out[j][1]; },P.acc,3);
      var j = Math.min(1200,Math.round(tm.value*4)), cur = r.out[j];
      D.dot(c,ax.X(tm.value),ax.Y(cur[1]),6,P.violet);
      ro.set(0,S.fmt(cur[1],2)+" g/L"); ro.set(1,S.fmt(r.pk,2)+" g/L"); ro.set(2,A.value>0 ? S.fmt(r.tp,0)+" min" : "—"); ro.set(3,S.fmt(cur[2],0)+" g sur "+A.value+" g");
      var last = r.out[1200][1];
      nt.set(reg.value==="d" && last>1.26 ? "Régulation insuffisante : cinq heures après, la glycémie reste au-dessus de 1,26 g/L : le glucose n'est pas rangé assez vite." : r.pk>1.26 && reg.value==="n" ? "Pic au-dessus de 1,26 g/L, mais la glycémie revient dans la zone normale : l'organisme régule." : "Montée modérée puis retour à la normale : le glucose est stocké ou utilisé.", reg.value==="d" && last>1.26 ? "warn" : "ok");
    });
  }
});

/* ===== 3 · Circuit du nutriment ===== */
SFA.sim({
  id:"b3-c04-circuit", ch:"c04", tag:"Animation",
  titre:"Suivre un nutriment de l'intestin aux organes",
  resume:"Glucose ou graisse : deux routes différentes au départ de l'intestin. Qui passe par le foie en premier ?",
  but:"Choisis un nutriment, lance le trajet ou avance étape par étape. Lis la concentration relative à chaque étape.",
  aRetenir:"Glucose et acides aminés traversent la paroi dans les capillaires sanguins, rejoignent la veine porte et passent par le foie avant le cœur : le foie filtre, stocke et régule. Les graisses (acides gras, glycérol) sont reconstituées dans la cellule et empruntent les vaisseaux chylifères puis la lymphe, et rejoignent le sang près du cœur, sans passer d'abord par le foie.",
  piege:"Le sang quittant l'intestin ne va pas directement au cœur : il passe d'abord par le foie (veine porte). Lymphe et sang sont deux liquides circulants différents. (Concentrations relatives indicatives.)",
  build:function(k,S){
    var c = k.canvas(360);
    var nu = k.seg("Nutriment", [["g","Glucose"],["a","Acides aminés"],["l","Lipides (graisses)"]], "g", function(){ st.set(0); lp.pause(); t = 0; });
    var st = k.slider("Étape du trajet", 0, 8, 1, 0, "", function(){ t = st.value; });
    var t = 0;
    var lp = k.loop(function(dt){ t += dt*.7; if (t >= 8){ t = 8; lp.pause(); } st.set(Math.round(t)); k.redraw(); });
    k.button("▶ Lire le trajet", function(){ if (lp.running) lp.pause(); else { if (t>=8) t = 0; lp.play(); } }, true);
    var ro = k.readouts(["Où est le nutriment ?","Concentration relative"]);
    var nt = k.note("","");
    var POS = []; for (var pi=0; pi<9; pi++) POS.push([.5,(pi*38+24)/360]);
    var R = {
      sang:{lab:["Villosité (capillaire)","Veine porte","Foie","Veine cave inférieure","Cœur (droit)","Poumons","Cœur (gauche)","Aorte","Organes"],
        txt:["Le nutriment traverse la paroi intestinale et entre dans un capillaire sanguin de la villosité.","Les veines de l'intestin se réunissent en la veine porte, qui mène directement au foie.","Le foie capte, stocke (glycogène, réserves) et transforme : premier filtre.","Le sang sorti du foie repart par la veine cave inférieure.","Il arrive dans le cœur droit.","Le cœur droit l'envoie aux poumons, où il se recharge en dioxygène.","Retour au cœur gauche.","Le cœur gauche propulse le sang dans l'aorte, vers tout le corps.","Les cellules des organes reçoivent le nutriment et l'utilisent."]},
      lymphe:{lab:["Villosité (chylifère)","Vaisseau lymphatique","Lymphe","Veine sous-clavière","Cœur (droit)","Poumons","Cœur (gauche)","Aorte","Organes"],
        txt:["Les graisses reconstituées sont absorbées dans le chylifère central de la villosité.","Elles gagnent les vaisseaux lymphatiques de l'intestin.","La lymphe laiteuse circule dans les vaisseaux lymphatiques et le canal thoracique.","La lymphe se déverse dans une veine près du cœur (veine sous-clavière).","Le mélange entre dans le cœur droit : pas de passage direct par le foie.","Les poumons.","Cœur gauche.","L'aorte distribue vers tout le corps (le foie reçoit alors sa part par l'artère hépatique).","Les cellules et le tissu adipeux utilisent ou stockent les graisses."]}
    };
    var CONC = {g:[100,100,66,66,66,66,66,66,66], a:[100,100,60,60,60,60,60,60,60], l:[100,100,100,100,100,100,100,100,100]};
    k.draw(function(){
      c.clear(); var g = c.ctx, key = nu.value==="l" ? "lymphe" : "sang", r = R[key], s = Math.round(st.value), col = key==="sang" ? P.red : P.amber, i;
      var bw = Math.min(240, c.W-70), bx = function(j){ return c.W/2+14; }, by = function(j){ return POS[j][1]*c.H; };
      g.save(); g.strokeStyle = col; g.lineWidth = 5; g.lineJoin="round"; g.globalAlpha = .35; g.beginPath(); for (i=0;i<9;i++){ if (i) g.lineTo(bx(i),by(i)); else g.moveTo(bx(i),by(i)); } g.stroke(); g.restore();
      for (i=0;i<9;i++){
        var act = i===s;
        rect(c,bx(i)-bw/2,by(i)-14,bw,28,act?"#efe3ff":"#fff",act?P.violet:(i<s?col:P.grey),act?3:1.5,8);
        T(c,r.lab[i],bx(i),by(i),{size:12,color:i<=s?P.ink:P.grey});
      }
      var a = Math.min(8,Math.floor(t)), b = Math.min(8,a+1), u = t-a, dx, dy;
      if (lp.running){ dx = bx(a)+(bx(b)-bx(a))*u; dy = by(a)+(by(b)-by(a))*u; } else { dx = bx(s)-bw/2-12; dy = by(s); if (dx<10) dx = bx(s)+bw/2+12; }
      circ(c,dx,dy,8,"#fff",P.ink,2.5); circ(c,dx,dy,3.5,col);
      ro.set(0,r.lab[s]); ro.set(1,CONC[nu.value][s]+" %");
      nt.set(r.txt[s], "ok");
    });
  }
});

/* ===== 4 · Chirurgie de l'intestin ===== */
SFA.sim({
  id:"b3-c04-chirurgie", ch:"c04", tag:"Original · niche",
  titre:"Retirer un tronçon d'intestin : quelles carences ?",
  resume:"Chaque nutriment est surtout absorbé dans une zone précise du grêle. Retire un tronçon et vois ce qui manque.",
  but:"Place le début et la longueur du tronçon retiré. Lis, pour chaque nutriment, la part d'absorption qui reste.",
  aRetenir:"L'absorption n'est pas uniforme : le fer et le calcium surtout au début (duodénum), glucose, acides aminés et graisses dans la première partie, la vitamine B12 et les sels biliaires dans la fin (iléon). Selon le tronçon retiré, les carences ne sont pas les mêmes.",
  piege:"Retirer 20 % de l'intestin ne fait pas perdre 20 % de tout : cela dépend de la zone. Le corps compense en partie (adaptation, réserves), mais la fin de l'iléon est irremplaçable pour la vitamine B12. (Cartes d'absorption simplifiées.)",
  build:function(k,S){
    var c = k.canvas(330);
    var s0 = k.slider("Début du tronçon retiré", 0, 90, 5, 30, "% du grêle");
    var ln = k.slider("Longueur retirée", 0, 100, 5, 30, "% du grêle");
    var ro = k.readouts(["Longueur restante (grêle de 5 m)","Plus gros déficit"]);
    var nt = k.note("","");
    var NU = [
      {n:"Fer, calcium", col:"#b5651d", f:function(x){ return Math.exp(-x/.12); }},
      {n:"Glucose, acides aminés", col:"#2e6b55", f:function(x){ return Math.exp(-Math.pow((x-.25)/.2,2)/2); }},
      {n:"Graisses (acides gras)", col:"#d4a017", f:function(x){ return Math.exp(-Math.pow((x-.35)/.28,2)/2); }},
      {n:"Eau, sels", col:"#0e7490", f:function(x){ return 1; }},
      {n:"Vitamine B12, sels biliaires", col:"#5B21B6", f:function(x){ return Math.exp(-Math.pow((x-.92)/.07,2)/2); }}
    ];
    NU.forEach(function(q){ var s=0,i; for (i=0;i<1000;i++) s += q.f((i+.5)/1000); q.tot = s; });
    function kept(q,a,b){ var s=0,i; for (i=0;i<1000;i++){ var x=(i+.5)/1000; if (x<a||x>b) s += q.f(x); } return s/q.tot; }
    k.draw(function(){
      c.clear(); var a = s0.value/100, b = Math.min(1,a+ln.value/100), W = c.W, x0 = 20, x1 = W-20, i;
      T(c,"Duodénum",x0,16,{size:12,align:"left",color:P.grey}); T(c,"Iléon",x1,16,{size:12,align:"right",color:P.grey});
      rect(c,x0,26,x1-x0,26,"#f2b9a8","#b56a50",1.5,13);
      if (b>a) rect(c,x0+(x1-x0)*a,26,(x1-x0)*(b-a),26,"#fff","#b42318",2);
      if (b>a) T(c,"retiré",x0+(x1-x0)*(a+b)/2,39,{size:12,color:P.red});
      var worst = 1, wn = "", y = 74;
      NU.forEach(function(q,j){
        var r = kept(q,a,b), yy = y + j*46;
        T(c,q.n,x0,yy,{size:12,align:"left",color:P.ink}); T(c,S.fmt(r*100,0)+" %",x1,yy,{size:12,align:"right",color:r<.7?P.red:P.ink});
        rect(c,x0,yy+10,x1-x0,14,"#eee",P.grey,1,7); rect(c,x0,yy+10,Math.max(2,(x1-x0)*r),14,r<.7?P.red:q.col,null,0,7);
        if (r<worst){ worst = r; wn = q.n; }
      });
      var rem = 5*(1-(b-a));
      ro.set(0,S.fmt(rem,1)+" m"); ro.set(1, worst<.98 ? wn+" (−"+S.fmt((1-worst)*100,0)+" %)" : "aucun");
      nt.set(rem<2 ? "Moins de 2 m de grêle restant : « syndrome de l'intestin court », nutrition spécialisée nécessaire." : worst<.7 ? "Risque de <b>carence</b> : "+wn+" (moins de 70 % de l'absorption préservée)." : b>a ? "Les carences restent limitées : les zones absorbantes essentielles sont conservées." : "Rien n'est retiré : absorption complète.", rem<2||worst<.7 ? "warn" : "ok");
    });
  }
});
})();
