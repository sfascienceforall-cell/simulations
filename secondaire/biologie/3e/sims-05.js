(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }

/* ===== 1 · Thorax-modèle ===== */
SFA.sim({
  id:"b3-c05-thorax-modele", ch:"c05", tag:"Classique · tombe souvent",
  titre:"Le thorax-modèle : abaisse le diaphragme",
  resume:"Une cloche, un ballon, une membrane : pourquoi l'air entre quand le volume augmente ?",
  but:"Tire la membrane (diaphragme) vers le bas. Compare le modèle avec ballon, l'air enfermé sans ballon (loi de Boyle) et la cloche percée.",
  aRetenir:"Quand le diaphragme descend (et les côtes montent), le volume de la cage thoracique augmente : la pression qui y règne diminue, devient plus faible que la pression atmosphérique et l'air entre dans les poumons, qui se gonflent. À l'expiration, le volume diminue et l'air sort. Pour une quantité d'air fixée : pression × volume = constante (loi de Boyle).",
  piege:"Les poumons ne se gonflent pas « tout seuls » ni par des muscles à l'intérieur : ils suivent le volume du thorax. Si la cage thoracique est percée (pneumothorax), l'air entre dans l'espace autour du poumon et celui-ci ne suit plus le mouvement. (Modèle simplifié, ordres de grandeur.)",
  build:function(k,S){
    var c = k.canvas(340);
    var mode = k.seg("Modèle", [["b","Cloche + ballon"],["s","Air enfermé, sans ballon"],["p","Cloche percée"]], "b");
    var dv = k.slider("Volume gagné par la cloche (membrane tirée)", 0, .6, .05, 0, "L");
    var tt = 0, lp = k.loop(function(dt){ tt += dt; dv.set(Math.round(.3*(1-Math.cos(2*Math.PI*tt/4))/.05)*.05); k.redraw(); });
    k.button("▶ Respirer / pause", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    var ro = k.readouts(["Pression dans la cloche","Pression atmosphérique","Volume du ballon"]);
    var nt = k.note("","");
    var P0 = 101.3, Vj0 = 1.0, E = .5;
    function solve(d){
      var lo = 0, hi = d, i;
      if (d <= 0) return 0;
      for (i=0;i<60;i++){ var x = (lo+hi)/2, f = P0*(1 - Vj0/(Vj0+d-x)) - E*x; if (f > 0) lo = x; else hi = x; }
      return (lo+hi)/2;
    }
    k.draw(function(){
      c.clear(); var g = c.ctx, d = dv.value, m = mode.value, x = 0, pj = P0;
      if (m==="b"){ x = solve(d); pj = P0 - E*x; }
      else if (m==="s"){ pj = P0*Vj0/(Vj0+d); }
      var cx = c.W/2, jw = Math.min(200,c.W-120), jt = 70, jb = 250, jl = cx-jw/2, jr = cx+jw/2;
      /* cloche */
      g.save(); g.strokeStyle = P.ink; g.lineWidth = 3; g.fillStyle = "rgba(190,215,240,.35)";
      g.beginPath(); g.moveTo(jl,jb); g.lineTo(jl,jt+30); g.quadraticCurveTo(jl,jt,cx-20,jt); g.lineTo(cx+20,jt); g.quadraticCurveTo(jr,jt,jr,jt+30); g.lineTo(jr,jb); g.fill(); g.stroke(); g.restore();
      /* tube en Y */
      D.line(c,cx,jt-34,cx,jt+36,P.ink,5);
      T(c,"air extérieur",cx,jt-46,{size:12,color:P.grey});
      /* ballon */
      if (m==="b"){ var r = 10 + 105*Math.sqrt(x/.6)*.55; r = Math.min(r,(jw/2)-8); ctxBalloon(c,cx,jt+36+r*.8,r,x); }
      else if (m==="p"){ D.line(c,jl,jt+90,jl-30,jt+90,P.red,4); T(c,"trou",jl-32,jt+76,{size:12,color:P.red,align:"right"}); ctxBalloon(c,cx,jt+36+11*.8,11,0); }
      /* membrane / diaphragme */
      var dy = d/.6*40;
      g.save(); g.strokeStyle = "#b56a50"; g.lineWidth = 6; g.beginPath(); g.moveTo(jl,jb); g.quadraticCurveTo(cx,jb+dy*1.3,jr,jb); g.stroke(); g.restore();
      D.line(c,cx,jb+dy*.65,cx,jb+dy*.65+28,P.ink,3); circ(c,cx,jb+dy*.65+32,5,P.ink);
      T(c,"membrane (diaphragme)",cx,jb+66+10,{size:12,color:"#b56a50"});
      if (d>0.01 && m!=="s"){ D.arrow(c,cx,jt-22,cx,jt+6,P.acc,3); }
      ro.set(0,S.fmt(pj,m==="s"?1:2)+" kPa"); ro.set(1,S.fmt(P0,1)+" kPa"); ro.set(2,m==="b" ? S.fmt(x,2)+" L" : m==="p" ? "0 L" : "pas de ballon");
      nt.set(m==="s" ? "Air enfermé : P × V = constante. Volume ×"+S.fmt((Vj0+d)/Vj0,2)+" donc pression ÷ "+S.fmt((Vj0+d)/Vj0,2)+". Dans un vrai thorax, cette baisse de pression fait entrer l'air." : m==="p" ? "Cloche percée : l'air entre aussi autour du ballon, la pression est la même partout : le ballon ne se gonfle plus." : d<=0 ? "Membrane au repos : pas de gonflement." : "La pression dans la cloche baisse de "+S.fmt(P0-pj,2)+" kPa : l'air entre par le tube et gonfle le ballon de "+S.fmt(x,2)+" L.","ok");
    });
    function ctxBalloon(c,x,y,r,v){ var g = c.ctx; g.save(); g.fillStyle = "rgba(242,150,140,.75)"; g.strokeStyle = "#b8473c"; g.lineWidth = 2.5; g.beginPath(); g.ellipse(x,y,r*.82,r,0,0,6.2832); g.fill(); g.stroke(); g.restore(); }
  }
});

/* ===== 2 · Échanges alvéolaires ===== */
SFA.sim({
  id:"b3-c05-air-inspire-expire", ch:"c05", tag:"Comparaison",
  titre:"Air inspiré, air expiré : ce que les poumons changent",
  resume:"Compare la composition de l'air entré et sorti, au repos et à l'effort : combien de dioxygène est prélevé ?",
  but:"Règle l'intensité de l'effort. Lis les pourcentages de O₂ et de CO₂ dans l'air expiré et les volumes échangés par minute.",
  aRetenir:"L'air inspiré contient environ 21 % de O₂ et 0,04 % de CO₂ ; l'air expiré environ 16 à 17 % de O₂ et 3,5 à 5 % de CO₂ (et de la vapeur d'eau). On n'expire donc pas que du CO₂ : on n'a utilisé qu'une petite partie du dioxygène inspiré. À l'effort, on ventile plus et on prélève plus de O₂.",
  piege:"L'air expiré contient encore beaucoup de dioxygène (environ 16 %) : c'est pourquoi le bouche-à-bouche fonctionne. Et le diazote (≈ 78 %) n'est pas utilisé par le corps. (Composition en air sec, valeurs moyennes simplifiées.)",
  build:function(k,S){
    var c = k.canvas(280);
    var ef = k.slider("Intensité de l'effort", 0, 100, 5, 0, "%");
    var ro = k.readouts(["Ventilation","O₂ consommé","CO₂ produit","Quotient CO₂ / O₂"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var E = ef.value/100, o2e = 17.0 - 1.1*E, co2e = 3.5 + 1.6*E, vent = 6 + 54*E;
      var vo2 = vent*(20.93-o2e)/100, vco2 = vent*(co2e-.04)/100;
      function bars(y,title,vin,vout,vmax,col,unit){
        T(c,title,16,y,{size:13,align:"left",color:P.ink});
        var x0 = 16, w = c.W-32, h = 22;
        [["Inspiré",vin,y+16],["Expiré",vout,y+16+h+6]].forEach(function(q,i){
          rect(c,x0,q[2],w,h,"#eef1f5",P.light); rect(c,x0,q[2],Math.max(2,w*q[1]/vmax),h,col,null);
          T(c,q[0]+" : "+S.fmt(q[1],q[1]<1?2:1)+" "+unit,x0+8,q[2]+h/2,{size:12,align:"left",color:P.ink,bg:"rgba(255,255,255,.75)"});
        });
        var xr = x0 + w*vout/vmax; 
      }
      bars(18,"Dioxygène (O₂)",20.93,o2e,25,P.acc,"%");
      bars(140,"Dioxyde de carbone (CO₂)",.04,co2e,6,P.amber,"%");
      ro.set(0,S.fmt(vent,0)+" L/min"); ro.set(1,S.fmt(vo2,2)+" L/min"); ro.set(2,S.fmt(vco2,2)+" L/min"); ro.set(3,S.fmt(vco2/vo2,2));
      nt.set(E===0 ? "Au repos : on inspire environ 6 L d'air par minute et on prélève environ un quart de litre de O₂." : "À l'effort : "+S.fmt(vent/6,1)+" fois plus d'air brassé, et "+S.fmt(vo2/(6*(20.93-17)/100),1)+" fois plus de O₂ prélevé qu'au repos.","ok");
    });
  }
});

/* ===== 3 · Effort physique ===== */
SFA.sim({
  id:"b3-c05-effort", ch:"c05", tag:"Défi",
  titre:"À l'effort : respiration et cœur s'emballent",
  resume:"Cœur, fréquence respiratoire, débits et O₂ consommé quand l'intensité augmente. Place ton cœur dans la zone d'endurance.",
  but:"Règle l'intensité de l'effort et l'âge. Les barres bougent avec un temps de réaction. Défi : amener la fréquence cardiaque entre 60 et 70 % de la fréquence maximale.",
  aRetenir:"À l'effort, les muscles consomment plus de dioxygène et produisent plus de CO₂ : la fréquence cardiaque, la fréquence respiratoire et le volume d'air inspiré augmentent ensemble. Poumons et cœur forment un système : l'air n'apporte du O₂ qu'à condition que le sang le transporte jusqu'aux muscles.",
  piege:"La fréquence cardiaque maximale diminue avec l'âge (environ 220 − âge, valeur moyenne approximative). Le cœur bat plus vite, mais chaque battement envoie aussi plus de sang (volume d'éjection plus grand). (Valeurs moyennes simplifiées.)",
  build:function(k,S){
    var c = k.canvas(330);
    var it = k.slider("Intensité de l'effort", 0, 100, 5, 20, "%");
    var ag = k.slider("Âge", 12, 60, 1, 15, "ans");
    var ro = k.readouts(["Fréquence cardiaque","Fréquence respiratoire","Air brassé","Débit cardiaque","O₂ consommé"]);
    var nt = k.note("","");
    var cur = null;
    function target(){
      var I = it.value/100, fcmax = 220 - ag.value, fc = 70 + (fcmax-70)*I, fr = 14 + 26*I, vt = .5 + 1.5*I, q = fc*(70+50*I)/1000, vo2 = q*(50+100*I)/1000;
      return {fc:fc, fr:fr, vt:vt, vent:fr*vt, q:q, vo2:vo2, fcmax:fcmax};
    }
    var lp = k.loop(function(dt){
      var tg = target(); if (!cur) cur = {fc:70,fr:14,vt:.5,vent:7,q:4.9,vo2:.245};
      var a = 1-Math.exp(-dt*8/20);   /* temps accéléré ×8, constante ≈ 20 s */
      ["fc","fr","vt","vent","q","vo2"].forEach(function(n){ cur[n] += (tg[n]-cur[n])*a; });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      c.clear(); var tg = target(); if (!cur) cur = {fc:70,fr:14,vt:.5,vent:7,q:4.9,vo2:.245};
      var items = [["Fréq. cardiaque (bpm)",cur.fc,tg.fcmax,P.red,0],["Fréq. respiratoire (/min)",cur.fr,45,P.acc,0],["Air brassé (L/min)",cur.vent,90,P.teal,1],["Débit cardiaque (L/min)",cur.q,28,P.violet,1],["O₂ consommé (L/min)",cur.vo2,4,P.green,2]];
      var y = 18, h = 24, x0 = 16, w = c.W-32;
      items.forEach(function(q,i){
        var yy = y + i*54; T(c,q[0],x0,yy,{size:12,align:"left",color:P.ink});
        rect(c,x0,yy+10,w,h,"#eef1f5",P.light); rect(c,x0,yy+10,Math.max(2,w*Math.min(1,q[1]/q[2])),h,q[3],null);
        T(c,S.fmt(q[1],q[4]),x0+8,yy+10+h/2,{size:13,align:"left",color:"#fff",bg:"rgba(0,0,0,.35)"});
      });
      var z0 = .6*tg.fcmax, z1 = .7*tg.fcmax;
      c.ctx.save(); c.ctx.fillStyle = "rgba(46,107,85,.35)"; c.ctx.fillRect(x0+w*z0/tg.fcmax,y+10,w*(z1-z0)/tg.fcmax,h); c.ctx.restore();
      T(c,"zone d'endurance",Math.min(x0+w*z0/tg.fcmax,c.W-112),y+10+h+9,{size:12,align:"left",color:P.green});
      ro.set(0,S.fmt(tg.fc,0)+" bpm"); ro.set(1,S.fmt(tg.fr,0)+" /min"); ro.set(2,S.fmt(tg.vent,0)+" L/min"); ro.set(3,S.fmt(tg.q,1)+" L/min"); ro.set(4,S.fmt(tg.vo2,2)+" L/min");
      var pc = tg.fc/tg.fcmax*100;
      nt.set(pc>=60&&pc<=70 ? "Zone d'endurance atteinte ("+S.fmt(pc,0)+" % de la fréquence maximale de "+tg.fcmax+" bpm). Défi réussi." : pc<60 ? "À "+S.fmt(pc,0)+" % de ta fréquence maximale ("+tg.fcmax+" bpm) : augmente l'effort pour entrer dans la zone d'endurance (60 à 70 %)." : "À "+S.fmt(pc,0)+" % de ta fréquence maximale : effort intense, au-dessus de la zone d'endurance.", pc>=60&&pc<=70 ? "ok" : "warn");
    });
  }
});

/* ===== 4 · Altitude, tabac et hémoglobine ===== */
SFA.sim({
  id:"b3-c05-altitude", ch:"c05", tag:"Original · niche",
  titre:"Altitude et monoxyde de carbone : le sang transporte moins de O₂",
  resume:"En montagne la pression d'O₂ chute. L'hémoglobine se sature moins. Et la fumée de cigarette occupe aussi l'hémoglobine.",
  but:"Règle l'altitude, l'acclimatation et la part d'hémoglobine occupée par le monoxyde de carbone. Lis la saturation du sang et la quantité de O₂ transportée.",
  aRetenir:"La proportion d'O₂ dans l'air reste 21 %, mais la pression de l'air diminue avec l'altitude : il y a moins de molécules de O₂ à chaque inspiration. L'hémoglobine (globules rouges) fixe O₂ ; sa saturation baisse quand la pression de O₂ baisse. Le monoxyde de carbone se fixe à la place de O₂ et réduit la quantité transportée, à toute altitude.",
  piege:"« Moins d'oxygène en altitude » ne veut pas dire que l'air contient moins de O₂ en pourcentage, mais qu'il y en a moins par litre d'air. Et le fumeur n'a pas besoin d'altitude pour manquer d'oxygène. (Modèle simplifié : atmosphère standard, courbe de saturation de l'hémoglobine moyenne.)",
  build:function(k,S){
    var c = k.canvas(300);
    var h = k.slider("Altitude", 0, 8800, 100, 0, "m");
    var ac = k.slider("Acclimatation (respiration plus rapide)", 0, 100, 10, 0, "%");
    var co = k.slider("Monoxyde de carbone dans le sang (tabac)", 0, 10, 1, 0, "%");
    var ro = k.readouts(["Pression atmosphérique","Pression de O₂ dans les alvéoles","Saturation de l'hémoglobine","O₂ transporté par litre de sang"]);
    var nt = k.note("","");
    function state(){
      var hh = h.value, A = ac.value/100, Patm = 101.325*Math.pow(1-2.25577e-5*hh,5.25588), pio2 = .2093*(Patm-6.3);
      var z = hh/8848, paco2 = 5.3-2.0*z-2.0*A*Math.pow(z,.7), pao2 = pio2 - paco2/.8, p50 = 3.5 - .5*A;
      var s = pao2>0 ? Math.pow(pao2,2.7)/(Math.pow(p50,2.7)+Math.pow(pao2,2.7)) : 0;
      return {patm:Patm, pao2:pao2, p50:p50, s:s, cont:201*(1-co.value/100)*s};
    }
    k.draw(function(){
      c.clear(); var st = state();
      var ax = D.axes(c,{x0:0,x1:15,y0:0,y1:100,xl:"pression de O₂ dans les alvéoles (kPa)",yl:"saturation (%)",stepX:3,stepY:25,l:52});
      D.fn(c,ax,function(x){ return 100*Math.pow(x,2.7)/(Math.pow(st.p50,2.7)+Math.pow(x,2.7)); },P.red,3.2);
      D.fn(c,ax,function(x){ return 100*Math.pow(x,2.7)/(Math.pow(3.5,2.7)+Math.pow(x,2.7)); },P.grey,1.5,[5,4]);
      var xp = Math.max(0,Math.min(15,st.pao2));
      D.line(c,ax.X(xp),ax.B,ax.X(xp),ax.Y(st.s*100),P.violet,1.5,[4,4]); D.line(c,ax.L,ax.Y(st.s*100),ax.X(xp),ax.Y(st.s*100),P.violet,1.5,[4,4]);
      D.dot(c,ax.X(xp),ax.Y(st.s*100),7,P.violet);
      T(c,"pointillé gris : courbe de référence",ax.R-4,ax.Y(40),{size:12,align:"right",color:P.grey});
      ro.set(0,S.fmt(st.patm,0)+" kPa"); ro.set(1,st.pao2>0 ? S.fmt(st.pao2,1)+" kPa" : "≈ 0 kPa"); ro.set(2,S.fmt(st.s*100,0)+" %"); ro.set(3,S.fmt(st.cont,0)+" mL");
      var base = 201*.972;
      nt.set(st.pao2<=0 ? "Sans acclimatation, à cette altitude, la pression de O₂ devient trop faible : perte de conscience en quelques minutes. L'acclimatation (hyperventilation) est indispensable." : st.s<.75 ? "Saturation inférieure à 75 % : hypoxie sévère. Les alpinistes de très haute altitude utilisent de l'oxygène en bouteille." : st.s<.9 ? "Saturation inférieure à 90 % : hypoxie, essoufflement, maux de tête (mal des montagnes)." : co.value>=5 ? "Même au niveau de la mer, "+co.value+" % de monoxyde de carbone dans le sang réduisent le O₂ transporté de "+S.fmt(100*(1-st.cont/base),0)+" %." : "Saturation normale : l'hémoglobine est presque entièrement chargée en O₂.", st.pao2<=0||st.s<.9 ? "warn" : "ok");
    });
  }
});
})();
