(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function actY(t){ return t<=35 ? Math.pow(2,(t-35)/10) : Math.max(0,1-Math.pow((t-35)/20,2)); }

/* ===== 1 · Bilan de la respiration ===== */
SFA.sim({
  id:"b3-c06-bilan", ch:"c06", tag:"Classique · tombe souvent",
  titre:"Le bilan de la respiration cellulaire",
  resume:"Glucose + dioxygène → dioxyde de carbone + eau + énergie. Choisis les quantités et lis les produits.",
  but:"Règle la masse de glucose et de dioxygène disponibles. Observe ce qui est consommé, produit, ce qui reste (réactif limitant) et l'énergie libérée.",
  aRetenir:"Respiration cellulaire : glucose + dioxygène → dioxyde de carbone + eau + énergie. Les masses se conservent : 180 g de glucose + 192 g de O₂ donnent 264 g de CO₂ + 108 g d'eau. L'énergie libérée (environ 15,6 kJ par gramme de glucose) est en partie stockée sous forme d'ATP (environ un tiers), le reste est de la chaleur.",
  piege:"L'énergie n'est pas « une matière » qui s'ajoute dans le bilan des masses. Le glucose ne devient pas de l'énergie « stockée telle quelle » : l'énergie de ses liaisons est libérée par réaction avec O₂. Et sans O₂, le glucose n'est pas entièrement dégradé (fermentation). (Valeurs arrondies.)",
  build:function(k,S){
    var c = k.canvas(330);
    var gl = k.slider("Glucose disponible", 0, 180, 5, 90, "g");
    var ox = k.slider("Dioxygène disponible", 0, 250, 2, 96, "g");
    var ro = k.readouts(["Énergie libérée","dont ATP (≈ 32 %)","CO₂ produit","Eau produite","Réactif limitant"]);
    var nt = k.note("","");
    var MG = 180.16, MO = 6*31.998, MC = 6*44.01, MW = 6*18.015;
    k.draw(function(){
      c.clear(); var xi = Math.min(gl.value/MG, ox.value/MO), used_g = xi*MG, used_o = xi*MO, co2 = xi*MC, h2o = xi*MW, left_g = gl.value-used_g, left_o = ox.value-used_o;
      var E = xi*2803, atp = E*.32;
      var sc = 180/Math.max(100,gl.value+ox.value)/1.4, x1 = 20, w1 = 90, x2 = c.W-20-90, y0 = 40, H = 190;
      T(c,"Avant",x1+w1/2,18,{size:13}); T(c,"Après",x2+w1/2,18,{size:13});
      function stack(x,items){ var y = y0+H; items.forEach(function(it){ var h = Math.max(0,it[0]*sc*1.4); if (h>0.5){ y -= h; rect(c,x,y,w1,h,it[1],P.ink,1.2); if (h>16) T(c,it[2]+" "+S.fmt(it[0],0)+" g",x+w1/2,y+h/2,{size:12,color:P.ink}); } }); }
      stack(x1,[[gl.value,"#f4d27a","glucose"],[ox.value,"#bcd3f2","O₂"]]);
      stack(x2,[[left_g,"#f4d27a","glucose"],[left_o,"#bcd3f2","O₂"],[co2,"#cfd4da","CO₂"],[h2o,"#7fc4e8","H₂O"]]);
      D.arrow(c,x1+w1+14,y0+H/2,x2-14,y0+H/2,P.ink,2.5); T(c,"+ énergie",c.W/2,y0+H/2-14,{size:13,color:P.amber});
      T(c,"masses : "+S.fmt(gl.value+ox.value,0)+" g avant, "+S.fmt(left_g+left_o+co2+h2o,0)+" g après",c.W/2,y0+H+22,{size:12,color:P.grey});
      ro.set(0,S.fmt(E,0)+" kJ"); ro.set(1,S.fmt(atp,0)+" kJ"); ro.set(2,S.fmt(co2,0)+" g"); ro.set(3,S.fmt(h2o,0)+" g");
      var rg = gl.value/MG, rox = ox.value/MO, tie = Math.abs(rg-rox) <= .006*Math.max(rg,rox);
      var lim = xi===0 ? "—" : tie ? "aucun (juste)" : (rg<rox ? "glucose" : "dioxygène");
      ro.set(4,lim);
      nt.set(xi===0 ? "Il faut du glucose et du dioxygène pour que la respiration ait lieu." : tie ? "Proportions exactes : tout le glucose et tout le dioxygène sont consommés (180 g de glucose pour 192 g de O₂)." : ox.value/MO<gl.value/MG ? "Il manque du dioxygène : il reste "+S.fmt(left_g,0)+" g de glucose qui ne peut pas être entièrement dégradé par respiration (la cellule passerait à la fermentation)." : "Tout le glucose est consommé, il reste "+S.fmt(left_o,0)+" g de O₂ : le glucose est le réactif limitant.","ok");
    });
  }
});

/* ===== 2 · Levures ===== */
SFA.sim({
  id:"b3-c06-levures", ch:"c06", tag:"Expérience virtuelle",
  titre:"Levures dans un flacon : le ballon qui se gonfle",
  resume:"Sucre, température, temps : combien de CO₂ les levures produisent-elles dans un flacon fermé ?",
  but:"Règle la quantité de sucre et la température. Fais avancer le temps : le ballon se gonfle selon le CO₂ produit.",
  aRetenir:"Les levures libèrent de l'énergie en dégradant le sucre et rejettent du CO₂ qui gonfle le ballon. Sans dioxygène (flacon fermé), c'est une fermentation : glucose → alcool + CO₂ + peu d'énergie. La vitesse dépend de la température (optimum vers 35 °C), et la quantité totale de CO₂ dépend du sucre disponible.",
  piege:"Le ballon ne se gonfle pas plus vite à 60 °C : la chaleur tue les levures. Une température plus basse ralentit la production sans la supprimer. Et sans sucre, il n'y a presque pas de CO₂ : les levures n'ont plus de « carburant ». (Modèle simplifié ; CO₂ dissous négligé.)",
  build:function(k,S){
    var c1 = k.canvas(225), c2 = k.canvas(190);
    var su = k.slider("Sucre au départ", 0, 10, .5, 5, "g");
    var tp = k.slider("Température", 0, 70, 1, 35, "°C");
    var tm = k.slider("Temps écoulé", 0, 120, 5, 60, "min");
    var ro = k.readouts(["CO₂ produit","Sucre restant","Vitesse de production","Levures"]);
    var nt = k.note("","");
    function run(){
      var v = .25*actY(tp.value), s = su.value, out = [], dt = .1, co = 0, Vm = 22.41*(tp.value+273.15)/273.15;
      for (var i=0;i<=1200;i++){
        var r = v*s/(1+s);
        if (i%10===0) out.push([i*dt,co,s,r]);
        var d = Math.min(s,r*dt); s -= d; co += d/180.16*2*Vm*1000;
      }
      return out;
    }
    k.draw(function(){
      var out = run(), cur = out[Math.min(120,Math.round(tm.value))], vmax = su.value/180.16*2*22.41*(tp.value+273.15)/273.15*1000;
      c2.clear(); var ax = D.axes(c2,{x0:0,x1:120,y0:0,y1:Math.max(100,Math.ceil(vmax/100)*100*1.0),xl:"temps (min)",yl:"CO₂ (mL)",stepX:20,l:56});
      D.fn(c2,ax,function(x){ var j = Math.min(119,Math.floor(x)), f = x-j; return out[j][1]+(out[j+1][1]-out[j][1])*f; },P.green,3);
      D.dot(c2,ax.X(tm.value),ax.Y(cur[1]),6,P.violet);
      /* flacon + ballon */
      c1.clear(); var cx = c1.W/2, g = c1.ctx, r = 10 + 38*Math.sqrt(Math.min(1,cur[1]/2900));
      rect(c1,cx-45,128,90,78,"rgba(244,210,122,.6)",P.ink,2.5,10); rect(c1,cx-14,98,28,36,"rgba(255,255,255,.6)",P.ink,2.5);
      for (var j=0;j<14;j++){ var rr = rng(j+3); circ(c1,cx-38+rr()*76,146+rr()*52,2+rr()*2,"#b5651d"); }
      g.save(); g.fillStyle = "rgba(240,140,130,.8)"; g.strokeStyle = "#b8473c"; g.lineWidth = 2; g.beginPath(); g.ellipse(cx,98-r*.9,r*.8,r,0,0,6.2832); g.fill(); g.stroke(); g.restore();
      T(c1,"flacon : eau + sucre + levures",c1.W/2,216,{size:12,color:P.grey});
      ro.set(0,S.fmt(cur[1],0)+" mL"); ro.set(1,S.fmt(cur[2],1)+" g"); ro.set(2,S.fmt(cur[3]/180.16*2*(22.41*(tp.value+273.15)/273.15)*1000,0)+" mL/min");
      ro.set(3, tp.value>=55 ? "mortes" : tp.value<8 ? "très lentes" : "actives");
      nt.set(tp.value>=55 ? "À 55 °C et plus, les levures sont tuées : aucune production de CO₂." : su.value===0 ? "Sans sucre, pas de CO₂ : rien à fermenter." : cur[2]<.05 && tm.value>0 ? "Le sucre est épuisé : le ballon cesse de grossir (la quantité de CO₂ dépend du sucre de départ)." : tp.value<10 ? "Au froid, les levures travaillent très lentement." : "Le ballon se gonfle d'autant plus vite que la température est proche de 35 °C.","ok");
    });
  }
});

/* ===== 3 · Effort et énergie ===== */
SFA.sim({
  id:"b3-c06-effort-energie", ch:"c06", tag:"Chiffré · utile",
  titre:"Combien d'énergie, de O₂ et de glucose pour une activité ?",
  resume:"Du sommeil à la course : dépense d'énergie, dioxygène consommé et équivalent en glucose.",
  but:"Choisis une activité, ta masse et la durée. Compare l'énergie dépensée par les activités et lis le besoin en O₂ et en glucose.",
  aRetenir:"Plus l'activité est intense, plus les cellules musculaires réalisent de respiration cellulaire : elles consomment plus de glucose et de dioxygène et rejettent plus de CO₂ et de chaleur. Même au repos (ou en dormant), les cellules respirent en continu.",
  piege:"Le corps utilise un mélange de glucose et de lipides : l'équivalent en glucose est un repère, pas ce qui est « brûlé » exactement. Et la plus grande part de l'énergie (environ les trois quarts) finit en chaleur, pas en travail mécanique. (Valeurs moyennes, à partir des MET : 1 MET ≈ 1 kcal par kg et par heure.)",
  build:function(k,S){
    var c = k.canvas(300);
    var ac = k.select("Activité", [["0.95","Dormir (0,95 MET)"],["1.3","Assis, faire un devoir (1,3 MET)"],["3.5","Marche à 5 km/h (3,5 MET)"],["4","Vélo tranquille (4 MET)"],["8.3","Jogging à 8 km/h (8,3 MET)"],["9.8","Course à 10 km/h (9,8 MET)"]], "3.5");
    var kg = k.slider("Masse corporelle", 30, 90, 1, 55, "kg");
    var mn = k.slider("Durée", 10, 120, 5, 60, "min");
    var ro = k.readouts(["Énergie dépensée","O₂ consommé","Équivalent glucose","Dont chaleur (≈ 75 %)"]);
    var nt = k.note("","");
    var LIST = [["Dormir",.95],["Devoir",1.3],["Marche",3.5],["Vélo",4],["Jogging",8.3],["Course",9.8]];
    k.draw(function(){
      c.clear(); var met = +ac.value, h = mn.value/60, kJ = met*4.184*kg.value*h, o2 = met*3.5*kg.value*mn.value/1000, glu = kJ/15.6;
      var ymax = 9.8*4.184*kg.value*h*1.08, x0 = 16, w = c.W-32, rowh = 38;
      LIST.forEach(function(q,i){
        var kj = q[1]*4.184*kg.value*h, yy = 16+i*rowh, on = Math.abs(q[1]-met)<.01;
        T(c,q[0],x0,yy,{size:12,align:"left",color:on?P.violet:P.ink}); T(c,S.fmt(kj,0)+" kJ",c.W-16,yy,{size:12,align:"right",color:on?P.violet:P.ink});
        rect(c,x0,yy+9,w,16,"#eef1f5"); rect(c,x0,yy+9,Math.max(2,w*kj/ymax),16,on?P.violet:"#b9c3d3");
      });
      ro.set(0,S.fmt(kJ,0)+" kJ"); ro.set(1,S.fmt(o2,1)+" L"); ro.set(2,S.fmt(glu,0)+" g"); ro.set(3,S.fmt(kJ*.75,0)+" kJ");
      nt.set("Ça équivaut à "+S.fmt(glu/5,0)+" morceaux de sucre de 5 g, ou à "+S.fmt(kJ/2250,2)+" tablette de chocolat de 100 g (≈ 2 250 kJ).","ok");
    });
  }
});

/* ===== 4 · Dette d'oxygène ===== */
SFA.sim({
  id:"b3-c06-dette-oxygene", ch:"c06", tag:"Modèle chiffré",
  titre:"Sprint, dette d'oxygène et acide lactique",
  resume:"Un sprint demande plus de O₂ que ce que le corps peut livrer : le manque est comblé sans O₂ (lactate), puis remboursé.",
  but:"Règle l'intensité et la durée du sprint. Observe la consommation de O₂, le déficit et la concentration de lactate dans le sang.",
  aRetenir:"Quand l'effort dépasse ce que les poumons, le cœur et le sang peuvent apporter en O₂, les muscles produisent une partie de l'énergie sans O₂ (fermentation lactique) : le lactate s'accumule et provoque une fatigue. Après l'effort, la consommation de O₂ reste élevée un moment (la « dette d'oxygène ») : le lactate est éliminé et les réserves sont reconstituées.",
  piege:"Le lactate n'est pas un « déchet qui reste » : il est repris par le foie, le cœur et les muscles. Et la dette d'oxygène n'est pas due à un manque pendant la récupération, mais à ce qui s'est passé pendant l'effort. (Modèle simplifié : on suppose une consommation maximale de O₂ de 3,0 L/min.)",
  build:function(k,S){
    var c1 = k.canvas(190), c2 = k.canvas(170);
    var it = k.slider("Intensité du sprint (100 % = effort juste maximal en O₂)", 110, 250, 10, 200, "%");
    var du = k.slider("Durée du sprint", 10, 120, 5, 40, "s");
    var ro = k.readouts(["Déficit en O₂ (anaérobie)","Lactate maximal","Dette remboursée (O₂ en plus)","Retour du lactate sous 4 mmol/L"]);
    var nt = k.note("","");
    var REST = .3, VMAX = 3.0;
    function run(){
      var dt = .5, out = [], v = REST, def = 0, lac = 1, t0 = 60, t1 = 60 + du.value, Dm = it.value/100*VMAX, tau = 30, tr = null, vEnd = 0, lEnd = 1, rep = 0, capped = false, kl = Math.LN2/20, i;
      for (i=0;i<=2400;i++){
        var t = i*dt, dem = (t>=t0 && t<t1) ? Dm : REST;
        if (t >= t0 && t < t1){
          v += (Math.min(Dm,VMAX)-v)*(1-Math.exp(-dt/tau)); def += Math.max(0,Dm-v)*dt/60;
          if (def > 5){ def = 5; capped = true; } lac = 1 + 3.5*def;
        } else if (t >= t1){
          if (tr === null){ vEnd = v; lEnd = lac; tr = Math.max(.5, def/Math.max(.05,vEnd-REST)); }
          v = REST + (vEnd-REST)*Math.exp(-(t-t1)/60/tr); rep += (v-REST)*dt/60;
          lac = 1 + (lEnd-1)*Math.exp(-kl*(t-t1)/60);
        }
        out.push([t/60,v,lac,dem]);
      }
      var back = lEnd>4 ? Math.log((lEnd-1)/3)/kl : 0;
      return {out:out, def:def, lmax:lEnd, rep:rep, back:back, capped:capped};
    }
    k.draw(function(){
      var r = run(), o = r.out;
      c1.clear(); var a1 = D.axes(c1,{x0:0,x1:20,y0:0,y1:Math.max(4,Math.ceil(it.value/100*VMAX)+.5),xl:"temps (min)",yl:"O₂ (L/min)",stepX:5,l:50,t:30});
      D.fn(c1,a1,function(x){ var j = Math.min(o.length-1,Math.round(x*120)); return o[j][3]; },P.grey,2,[6,4]);
      D.fn(c1,a1,function(x){ var j = Math.min(o.length-1,Math.round(x*120)); return o[j][1]; },P.acc,3);
      T(c1,"pointillé : besoin en O₂ · bleu : O₂ consommé",c1.W/2,10,{size:12,align:"center",color:P.grey});
      c2.clear(); var a2 = D.axes(c2,{x0:0,x1:20,y0:0,y1:Math.max(8,Math.ceil(r.lmax)+1),xl:"temps (min)",yl:"lactate (mmol/L)",stepX:5,l:50});
      D.fn(c2,a2,function(x){ var j = Math.min(o.length-1,Math.round(x*120)); return o[j][2]; },P.red,3);
      D.line(c2,a2.L,a2.Y(4),a2.R,a2.Y(4),P.grey,1.2,[5,4]);
      ro.set(0,S.fmt(r.def,1)+" L"); ro.set(1,S.fmt(r.lmax,1)+" mmol/L"); ro.set(2,S.fmt(r.rep,1)+" L"); ro.set(3, r.back<=0 ? "immédiat" : S.fmt(r.back,0)+" min");
      nt.set(r.capped ? "Déficit maximal atteint (≈ 5 L) : épuisement. Aucun humain ne peut maintenir cette intensité aussi longtemps." : r.lmax>8 ? "Beaucoup de lactate : jambes lourdes, souffle court. La récupération demande plusieurs minutes." : "Effort modéré : peu de lactate, récupération rapide.", r.capped ? "warn" : "ok");
    });
  }
});
})();
