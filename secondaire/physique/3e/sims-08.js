/* Chapitre 8 · Résultante et équilibre */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt, G=9.81;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function ln(c,a,b,col,w,dash){ D.line(c,a[0],a[1],b[0],b[1],col||"#3a4a60",w||3,dash); }
function wheel(c,x,y,r,ph){ circ(c,x,y,r,"#fff",P.ink,2.5); ln(c,[x,y],[x+r*Math.cos(ph),y+r*Math.sin(ph)],P.ink,2); }

/* 1 · Forces colinéaires */
SFA.sim({
  id:"p3-c08-colineaires", ch:"c08", tag:"Classique",
  titre:"Deux forces sur un chariot : la résultante",
  resume:"Règle deux forces de même direction et lance le chariot : repos, accélération, ou vitesse constante ?",
  but:"Règle les forces F₁ et F₂ (positives vers la droite) et la vitesse de départ. Lance le chariot et regarde la vitesse évoluer.",
  aRetenir:"Pour des forces de même direction : on additionne les forces de même sens et on soustrait celles de sens contraires. La résultante R = F₁ + F₂ (en comptant les signes). Si R = 0, la vitesse ne change pas : un chariot lancé continue en ligne droite à vitesse constante, sans qu'aucune force ne soit nécessaire pour « le maintenir ».",
  piege:"« Il faut une force pour maintenir un mouvement » est faux : sans frottement, R = 0 donne une vitesse constante. C'est la résultante non nulle qui change la vitesse (ici : a = R / m, sans frottement).",
  build:function(k,S){
    var c = k.canvas(340);
    var f1 = k.slider("Force F₁ (> 0 : vers la droite)",-40,40,5,20,"N");
    var f2 = k.slider("Force F₂ (> 0 : vers la droite)",-40,40,5,-20,"N");
    var m = k.slider("Masse du chariot",1,10,1,2,"kg");
    var v0 = k.slider("Vitesse de départ",-2,2,0.5,1,"m/s");
    var ro = k.readouts(["Résultante R","Accélération (sans frottement)","Vitesse"]);
    var nt = k.note("","");
    var st={t:0,x:0,v:0,run:false,hist:[]};
    function reset(){ st.t=0; st.x=0; st.v=v0.value; st.hist=[[0,v0.value]]; }
    reset();
    var lp=k.loop(function(dt){
      if (!st.run) return; var a=(f1.value+f2.value)/m.value;
      st.v+=a*dt; st.x+=st.v*dt; st.t+=dt; st.hist.push([st.t,st.v]);
      if (st.t>=6){ st.run=false; }
      k.redraw();
    });
    k.button("Lancer",function(){ reset(); st.run=true; },true);
    k.button("Réinitialiser",function(){ st.run=false; reset(); });
    lp.play();
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, R=f1.value+f2.value, a=R/m.value;
      /* graphique v(t) */
      var vm=Math.max(3,Math.abs(v0.value)+Math.abs(a)*6)*1.1;
      var gh=H*0.42, ax=D.axes({ctx:c.ctx,W:W,H:gh+40},{x0:0,x1:6,y0:-vm,y1:vm,xl:"t (s)",yl:"v (m/s)",stepX:1,l:44,r:14,t:10,b:22});
      c.ctx.save(); c.ctx.strokeStyle=P.acc; c.ctx.lineWidth=2.5; c.ctx.beginPath(); st.hist.forEach(function(p,i){ if(i)c.ctx.lineTo(ax.X(p[0]),ax.Y(p[1])); else c.ctx.moveTo(ax.X(p[0]),ax.Y(p[1])); }); c.ctx.stroke(); c.ctx.restore();
      D.line(c,ax.X(0),ax.Y(v0.value),ax.X(6),ax.Y(v0.value+a*6),"#c9d3e6",1.5,[5,4]);
      /* piste et chariot */
      var gy=H-48, cx=W/2, cw=70;
      ln(c,[10,gy],[W-10,gy],P.grey,2);
      for (var i=-6;i<=6;i++){ var tx=((cx+i*60-st.x*40)%(W+120)+(W+120))%(W+120)-60; ln(c,[tx,gy],[tx,gy+8],P.grey,2); }
      rect(c,cx-cw/2,gy-44,cw,30,"#c4cbd6",P.ink,2.5,4); wheel(c,cx-20,gy-8,8,st.x*3); wheel(c,cx+20,gy-8,8,st.x*3);
      var k2=2.2;
      function arr(Fx,y,col,lab){ if(Math.abs(Fx)<0.1) return; D.arrow(c,cx,y,cx+Fx*k2,y,col,3); T(c,lab+" = "+SFA.fmt(Fx,0)+" N",cx+Fx*k2+(Fx>0?8:-8),y-9,{size:12,color:col,align:Fx>0?"left":"right"}); }
      arr(f1.value,gy-58,P.red,"F₁"); arr(f2.value,gy-72,P.violet,"F₂");
      if (Math.abs(R)>0.1){ D.arrow(c,cx,gy-86,cx+R*k2,gy-86,P.green,4); T(c,"R = "+F(R,0)+" N",cx+R*k2+(R>0?8:-8),gy-95,{size:12,color:P.green,align:R>0?"left":"right"}); }
      else T(c,"R = 0",cx,gy-90,{size:13,color:P.green});
      ro.set(0,F(R,0)+" N"); ro.set(1,F(a,1)+" m/s²"); ro.set(2,F(st.v,1)+" m/s");
      nt.set(R===0?(v0.value===0?"R = 0 et vitesse nulle : le chariot reste <b>au repos</b>.":"R = 0 : la vitesse reste constante ("+F(v0.value,1)+" m/s), le chariot continue <b>en ligne droite à vitesse constante</b>, sans aucune force pour l'entretenir."):"R = "+F(f1.value,0)+" + ("+F(f2.value,0)+") = "+F(R,0)+" N, dirigée vers la "+(R>0?"droite":"gauche")+" : la vitesse varie de "+F(a,1)+" m/s à chaque seconde. (Sans frottement.)","ok");
    });
  }
});

/* 2 · Parallélogramme */
SFA.sim({
  id:"p3-c08-parallelogramme", ch:"c08", tag:"Géométrie",
  titre:"Composer deux forces : le parallélogramme",
  resume:"Fais varier l'angle entre deux forces : la résultante est la diagonale du parallélogramme.",
  but:"Règle F₁, F₂ et l'angle α entre elles (ou glisse la pointe de F₂ à la souris). Compare la valeur de la résultante.",
  aRetenir:"La résultante de deux forces appliquées au même point est la diagonale du parallélogramme construit sur elles. Sa valeur dépend de l'angle : elle est maximale (F₁ + F₂) quand les forces ont même sens, minimale (|F₁ − F₂|) quand elles sont opposées. À 90° : R² = F₁² + F₂².",
  piege:"On ne peut pas additionner les valeurs « simplement » : 30 N + 40 N ne donnent 70 N que si les forces ont même direction et même sens. À 90°, on obtient 50 N.",
  build:function(k,S){
    var c = k.canvas(340);
    var f1 = k.slider("F₁",0,100,5,30,"N"), f2 = k.slider("F₂",0,100,5,40,"N"), al = k.slider("Angle α entre F₁ et F₂",0,180,5,90,"°");
    var eq = k.toggle("Montrer la force équilibrante",false);
    var ro = k.readouts(["Résultante R","Angle de R avec F₁","Cas particulier"]);
    var nt = k.note("","");
    var O=[0,0], sc=1, frozen=null, Ofr=null;
    c.pointer(function(t,p){ if (t==="down"){ frozen=sc; Ofr=O.slice(); } if (t==="up"){ frozen=null; Ofr=null; k.redraw(); return; } if (t==="down"||t==="drag"){ var dx=p.x-O[0], dy=O[1]-p.y; var L=Math.hypot(dx,dy)/sc; var a=Math.atan2(dy,dx)*180/Math.PI; a=Math.max(0,Math.min(180,a)); f2.set(Math.max(0,Math.min(100,Math.round(L/5)*5))); al.set(Math.round(a/5)*5); k.redraw(); } });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, a=al.value*Math.PI/180, A=f1.value, B=f2.value;
      var rx=A+B*Math.cos(a), ry=B*Math.sin(a), R=Math.hypot(rx,ry), beta=Math.atan2(ry,rx)*180/Math.PI;
      var xs=[0,A,B*Math.cos(a),rx].concat(eq.value?[-rx]:[]), mnx=Math.min.apply(null,xs), mxx=Math.max.apply(null,xs), mxy=Math.max(10,ry,B*Math.sin(a));
      sc=Math.min(4,(W-90)/Math.max(30,mxx-mnx),(H-80)/Math.max(30,mxy+(eq.value?ry:0))); O=[(W-(mxx-mnx)*sc)/2-mnx*sc,H-36-(eq.value?ry*sc:0)]; if (frozen){ sc=frozen; O=Ofr; }
      function pt(x,y){ return [O[0]+x*sc,O[1]-y*sc]; }
      ln(c,[10,O[1]],[W-10,O[1]],"#e1e6ee",1.5);
      var p1=pt(A,0), p2=pt(B*Math.cos(a),B*Math.sin(a)), pr=pt(rx,ry);
      D.line(c,p1[0],p1[1],pr[0],pr[1],P.grey,1.5,[5,4]); D.line(c,p2[0],p2[1],pr[0],pr[1],P.grey,1.5,[5,4]);
      if (eq.value) D.arrow(c,O[0],O[1],O[0]-rx*sc,O[1]+ry*sc,P.amber,3);
      D.arrow(c,O[0],O[1],p1[0],p1[1],P.red,3.5); D.arrow(c,O[0],O[1],p2[0],p2[1],P.violet,3.5); D.arrow(c,O[0],O[1],pr[0],pr[1],P.green,4.5);
      circ(c,O[0],O[1],6,P.ink); circ(c,p2[0],p2[1],7,"rgba(91,33,182,.15)",P.violet,1.5);
      T(c,"F₁",p1[0]+10,p1[1]-10,{size:13,color:P.red}); T(c,"F₂",p2[0]-12,p2[1]-10,{size:13,color:P.violet}); T(c,"R",pr[0]+10,pr[1]-8,{size:14,color:P.green});
      if (eq.value) T(c,"F₃ = −R",O[0]-rx*sc-8,O[1]+ry*sc+14,{size:12,color:P.amber});
      /* arc de l'angle */
      c.ctx.save(); c.ctx.strokeStyle=P.grey; c.ctx.lineWidth=1.5; c.ctx.beginPath(); c.ctx.arc(O[0],O[1],26,-a,0); c.ctx.stroke(); c.ctx.restore(); T(c,"α",O[0]+34,O[1]-12,{size:12,color:P.grey});
      T(c,"flèches proportionnelles aux valeurs (échelle ajustée à l'écran)",W/2,14,{size:12,color:P.grey});
      var cas = al.value===0?"même sens : R = F₁ + F₂":al.value===180?"sens opposés : R = |F₁ − F₂|":al.value===90?"angle droit : R² = F₁² + F₂²":"—";
      ro.set(0,F(R,1)+" N"); ro.set(1,R<0.05?"— (R = 0)":F(beta,0)+"°"); ro.set(2,cas);
      nt.set("R = "+F(R,1)+" N. Somme des valeurs F₁ + F₂ = "+F(A+B,0)+" N : "+(Math.abs(R-(A+B))<0.05?"égales car même sens.":"R est plus petite, car les forces ne sont pas alignées dans le même sens.")+" Glisse la pointe violette pour changer F₂ et α.","ok");
    });
  }
});

/* 3 · Objet suspendu à deux fils */
SFA.sim({
  id:"p3-c08-deux-fils", ch:"c08", tag:"Surprenant",
  titre:"Un objet suspendu à deux fils : la tension explose",
  resume:"Écarte les fils : la tension de chaque fil dépasse vite le poids de l'objet.",
  but:"Règle la masse et l'angle entre les deux fils. Observe la tension de chaque fil et le triangle de forces. Jusqu'où les fils résistent-ils ?",
  aRetenir:"L'objet est en équilibre : la résultante des deux tensions compense le poids. Chaque fil porte T = P / (2·cos(α/2)) : à 0°, T = P/2 ; à 120°, T = P ; au-delà, T dépasse P. Plus les fils sont écartés, plus la tension est grande, et il est impossible de tendre les fils parfaitement horizontaux.",
  piege:"Deux fils ne portent pas « la moitié chacun » en général : seulement quand ils sont verticaux. Un fil presque horizontal supporte une tension bien supérieure au poids.",
  build:function(k,S){
    var c = k.canvas(340);
    var m = k.slider("Masse suspendue",0.5,10,0.5,3,"kg");
    var al = k.slider("Angle entre les deux fils",10,170,5,90,"°");
    var tm = k.select("Résistance maximale de chaque fil",[["30","30 N"],["60","60 N"],["100","100 N"]],"60");
    var ro = k.readouts(["Poids P","Tension T de chaque fil","T / P"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, Pw=m.value*G, a=al.value*Math.PI/180, Tn=Pw/(2*Math.cos(a/2)), brk=Tn>(+tm.value);
      var cx=W*0.36, top=34, Lw=Math.min(H*0.5,170);
      rect(c,10,top-14,W*0.62,10,"#c9cfd9"); var yk=top+Lw*Math.cos(a/2), xl=cx-Lw*Math.sin(a/2), xr=cx+Lw*Math.sin(a/2);
      if (yk>H-90){ }
      var kx=cx, ky=yk;
      ln(c,[xl,top-4],[kx,ky],brk?P.red:"#3a4a60",3,brk?[6,4]:null); ln(c,[xr,top-4],[kx,ky],brk?P.red:"#3a4a60",3,brk?[6,4]:null);
      circ(c,kx,ky,5,P.ink); rect(c,kx-18,ky+8,36,32,"#c4cbd6",P.ink,2,4); T(c,F(m.value,1)+" kg",kx,ky+24,{size:12});
      /* forces au nœud */
      var s=Math.min(2.6,(H*0.36)/Math.max(Pw,Tn)); 
      D.arrow(c,kx,ky,kx,ky+Pw*s,P.red,3); T(c,"P",kx+12,ky+Pw*s*0.6,{size:13,color:P.red,align:"left"});
      D.arrow(c,kx,ky,kx-Tn*s*Math.sin(a/2),ky-Tn*s*Math.cos(a/2),P.violet,3); D.arrow(c,kx,ky,kx+Tn*s*Math.sin(a/2),ky-Tn*s*Math.cos(a/2),P.violet,3);
      T(c,"T₁",kx-Tn*s*Math.sin(a/2)-8,ky-Tn*s*Math.cos(a/2)-8,{size:12,color:P.violet}); T(c,"T₂",kx+Tn*s*Math.sin(a/2)+8,ky-Tn*s*Math.cos(a/2)-8,{size:12,color:P.violet});
      /* triangle de forces bout à bout */
      var bx=W*0.78, by=H*0.3, s2=Math.min(1.6,(H*0.3)/Math.max(Tn,1)/1.1*1);
      T(c,"Triangle des forces",bx,16,{size:12,color:P.grey});
      var tx=Tn*s2*Math.sin(a/2), ty=Tn*s2*Math.cos(a/2);
      D.arrow(c,bx,by,bx,by+2*ty,P.red,2.5); D.arrow(c,bx,by+2*ty,bx-tx,by+ty,P.violet,2.5); D.arrow(c,bx-tx,by+ty,bx,by,P.violet,2.5);
      T(c,"P",bx+10,by+ty,{size:12,color:P.red,align:"left"}); T(c,"T₁",bx-tx-12,by+ty+ty*0.5,{size:12,color:P.violet}); T(c,"T₂",bx-tx*0.5-12,by+ty*0.4,{size:12,color:P.violet});
      T(c,"P + T₁ + T₂ = 0 : la boucle se ferme",bx,by+2*ty+22,{size:12,color:P.grey});
      ro.set(0,F(Pw,1)+" N"); ro.set(1,F(Tn,1)+" N"); ro.set(2,F(Tn/Pw,2));
      nt.set(brk?"<b>Les fils cassent !</b> T = "+F(Tn,1)+" N dépasse "+tm.value+" N. Diminue l'angle ou la masse.":"Équilibre : T = "+F(Pw,1)+" / (2 cos "+F(al.value/2,0)+"°) = "+F(Tn,1)+" N.",brk?"warn":"ok");
    });
  }
});

/* 4 · Équilibre horizontal et frottement */
var SURF=[["0.03","Acier sur glace (μ = 0,03)"],["0.4","Bois sur bois (μ = 0,40)"],["0.8","Caoutchouc sur béton (μ = 0,80)"]];
SFA.sim({
  id:"p3-c08-equilibre-plan", ch:"c08", tag:"Animation",
  titre:"Tirer une caisse : quand bouge-t-elle ?",
  resume:"Augmente la force de traction : le frottement s'oppose jusqu'à une valeur maximale.",
  but:"Règle la force de traction, la masse et la surface. Regarde les quatre forces et la résultante : la caisse reste immobile tant que la résultante est nulle.",
  aRetenir:"Une caisse immobile est en équilibre : poids et réaction du sol se compensent verticalement, traction et frottement se compensent horizontalement. Elle ne démarre que si la traction dépasse le frottement maximal f<sub>max</sub> = μ·m·g. Ensuite, la résultante n'est plus nulle : sa vitesse augmente.",
  piege:"Tant que la caisse ne bouge pas, le frottement vaut exactement la traction (il s'adapte) ; il ne vaut pas toujours μ·m·g. Modèle simplifié : frottement en mouvement = frottement maximal.",
  build:function(k,S){
    var c = k.canvas(330);
    var ft = k.slider("Force de traction F",0,100,1,0,"N");
    var m = k.slider("Masse de la caisse",1,10,1,5,"kg");
    var su = k.select("Surface",SURF,"0.4");
    var ro = k.readouts(["Frottement f","Résultante horizontale","État"]);
    var nt = k.note("","");
    var st={x:0,v:0};
    var lp=k.loop(function(dt){
      var N=m.value*G, fm=+su.value*N, Fv=ft.value;
      if (st.v<=1e-6 && Fv<=fm){ st.v=0; } else { var a=(Fv-fm)/m.value; st.v=Math.max(0,st.v+a*dt); }
      st.x+=st.v*dt; k.redraw();
    });
    k.button("Arrêter la caisse",function(){ st.v=0; });
    lp.play();
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, N=m.value*G, fm=+su.value*N, Fv=ft.value;
      var moving=st.v>1e-6, f=moving?fm:Math.min(Fv,fm), Rh=Fv-f;
      var gy=H-60, cx=W*0.4, bw=60+m.value*5, bh=46+m.value*3;
      ln(c,[10,gy],[W-10,gy],P.grey,2);
      for (var i=-8;i<=8;i++){ var tx=((cx+i*50-st.x*30)%(W+100)+(W+100))%(W+100)-50; ln(c,[tx,gy],[tx,gy+8],P.grey,2); }
      rect(c,cx-bw/2,gy-bh,bw,bh,"#d9b98a",P.ink,2.5,4); T(c,F(m.value,0)+" kg",cx,gy-bh/2,{size:13});
      var ks=0.75;   /* même échelle pour toutes les forces : 1 N ↔ 0,75 px */
      D.arrow(c,cx,gy-bh/2,cx,gy-bh/2+N*ks,P.red,3); T(c,"P",cx+10,gy-bh/2+N*ks*0.6,{size:12,color:P.red,align:"left"});
      D.arrow(c,cx+bw*0.2,gy,cx+bw*0.2,gy-N*ks,P.green,3); T(c,"N",cx+bw*0.2+10,gy-N*ks*0.6,{size:12,color:P.green,align:"left"});
      var ky=gy-bh/2-4; if (Fv>0){ D.arrow(c,cx+bw/2,ky,cx+bw/2+Fv*ks,ky,P.violet,3.5); T(c,"F",cx+bw/2+Fv*ks,ky-12,{size:12,color:P.violet}); }
      if (f>0){ D.arrow(c,cx-bw/2,gy-3,cx-bw/2-f*ks,gy-3,P.amber,3.5); T(c,"f",cx-bw/2-f*ks,gy-15,{size:12,color:P.amber}); }
      ro.set(0,F(f,1)+" N"); ro.set(1,F(Rh,1)+" N"); ro.set(2,moving?"en mouvement":(Fv>fm?"va démarrer":"à l'arrêt (équilibre)"));
      nt.set(moving?"Résultante = "+F(Fv,0)+" − "+F(fm,1)+" = "+F(Rh,1)+" N : "+(Rh>0.05?"la vitesse augmente.":Rh<-0.05?"la vitesse diminue : la caisse va s'arrêter.":"la vitesse reste constante."):(Fv<=fm?"Équilibre : f = F = "+F(Fv,0)+" N ≤ f<sub>max</sub> = μ·m·g = "+F(fm,1)+" N. Résultante nulle, la caisse ne bouge pas.":"F dépasse f<sub>max</sub> = "+F(fm,1)+" N : la caisse démarre."),"ok");
    });
  }
});
})();
