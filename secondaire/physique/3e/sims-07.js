/* Chapitre 7 · Forces, poids et masse */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function ln(c,a,b,col,w,dash){ D.line(c,a[0],a[1],b[0],b[1],col||"#3a4a60",w||3,dash); }
function spring(c,x,y0,y1,n,amp,col){ var g=c.ctx; g.save(); g.strokeStyle=col||P.ink; g.lineWidth=2.2; g.beginPath(); g.moveTo(x,y0); var s=(y1-y0); g.lineTo(x,y0+s*0.08); for (var i=0;i<n;i++){ var t=0.08+0.84*(i+0.5)/n; g.lineTo(x+(i%2?-amp:amp),y0+s*t); } g.lineTo(x,y0+s*0.92); g.lineTo(x,y1); g.stroke(); g.restore(); }

var ASTRES=[["terre","Terre",9.81],["lune","Lune",1.62],["mars","Mars",3.71],["venus","Vénus",8.87],["jup","Jupiter",24.79]];
/* 1 · Dynamomètre */
SFA.sim({
  id:"p3-c07-dynamometre", ch:"c07", tag:"Classique",
  titre:"Le dynamomètre : le poids change, la masse non",
  resume:"Accroche une masse et change d'astre : le poids varie, la masse reste la même.",
  but:"Choisis une masse et un astre. Lis le poids sur le dynamomètre (en N) et compare à la masse (en kg).",
  aRetenir:"La masse m (en kg) mesure la quantité de matière : elle ne change pas d'un astre à l'autre. Le poids P (en N) est la force d'attraction de l'astre : P = m·g, où g est l'intensité de la pesanteur (en N/kg). Sur la Lune, g est environ 6 fois plus petit que sur Terre.",
  piege:"Sur la Lune, on ne « perd » pas de masse : on pèse moins. Le poids se mesure avec un dynamomètre (en newtons), la masse avec une balance (en kilogrammes). Le kilogramme n'est pas une unité de poids.",
  build:function(k,S){
    var c = k.canvas(340);
    var m = k.slider("Masse accrochée",100,2000,50,500,"g");
    var as = k.select("Astre",ASTRES.map(function(a){return [a[0],a[1]+" (g = "+F(a[2],2)+" N/kg)"];}),"terre");
    var ro = k.readouts(["Masse","Poids (en N)","Rapport au poids sur Terre"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      var g=ASTRES.filter(function(a){return a[0]===as.value;})[0], mk=m.value/1000, Pw=mk*g[2];
      var x=W*0.3, top=30, tube=150, maxN=50;
      /* dynamomètre */
      rect(c,x-22,top,44,tube,"#fff",P.ink,2.5,8);
      for (var i=0;i<=5;i++){ var yy=top+14+i*(tube-28)/5; ln(c,[x+22,yy],[x+10,yy],P.ink,1.5); T(c,String(i*10),x+34,yy,{size:12,color:P.grey,align:"left"}); }
      var ind=top+14+Math.min(1,Pw/maxN)*(tube-28); rect(c,x-22,ind-2,44,4,P.red); T(c,"N",x-34,top+8,{size:12,color:P.grey});
      /* tige + ressort + masse */
      var s0=top+tube, s1=s0+30+Math.min(1,Pw/maxN)*40; ln(c,[x,top-10],[x,top],P.ink,3); spring(c,x,s0,s1,6,9);
      var sz=18+Math.sqrt(mk)*14; rect(c,x-sz/2,s1,sz,sz,"#c4cbd6",P.ink,2,4); T(c,F(mk,2)+" kg",x,s1+sz/2,{size:12});
      /* flèche de poids */
      var alen=Math.min(120,Pw*2.6); D.arrow(c,x+60,s1+sz/2,x+60,s1+sz/2+alen,P.red,3.5); T(c,"P",x+74,s1+sz/2+alen*0.5,{size:14,color:P.red});
      /* barres de comparaison */
      var bx=W*0.55, bw=W*0.4; T(c,"Poids de cette masse sur chaque astre (N)",bx+bw/2,24,{size:12,color:P.grey});
      ASTRES.forEach(function(a,j){ var yy=52+j*40, p=mk*a[2], w=bw*Math.min(1,p/50); T(c,a[1],bx-4,yy,{size:12,align:"right"}); rect(c,bx,yy-10,w,20,a[0]===as.value?P.red:"#9db0d4"); T(c,F(p,1)+" N",bx+w+5,yy,{size:12,align:"left"}); });
      ro.set(0,F(mk,2)+" kg"); ro.set(1,F(Pw,1)+" N"); ro.set(2,F(g[2]/9.81,2)+" ×");
      nt.set("Masse : "+F(mk,2)+" kg sur tous les astres. Poids : "+F(mk,2)+" × "+F(g[2],2)+" = <b>"+F(Pw,2)+" N</b> sur "+g[1]+".","ok");
    });
  }
});

/* 2 · Dessiner la force */
var SCEN=[
 {n:"Poids d'une caisse de 4 kg posée sur le sol (g = 9,81 N/kg)", sc:10, F:4*9.81, ang:90, org:function(b){return [b.cx,b.cy];}, lab:"centre de gravité de la caisse"},
 {n:"Réaction du sol sur la même caisse (au repos)", sc:10, F:4*9.81, ang:-90, org:function(b){return [b.cx,b.by];}, lab:"point de contact avec le sol"},
 {n:"Une personne tire un traîneau avec une corde horizontale : force de 25 N vers la droite", sc:10, F:25, ang:0, org:function(b){return [b.rx,b.cy];}, lab:"point d'attache de la corde"},
 {n:"Poids de la même caisse de 4 kg sur la Lune (g = 1,62 N/kg)", sc:2, F:4*1.62, ang:90, org:function(b){return [b.cx,b.cy];}, lab:"centre de gravité de la caisse"}
];
SFA.sim({
  id:"p3-c07-dessiner-force", ch:"c07", tag:"Géométrie",
  titre:"Représente la force : point, direction, sens, valeur",
  resume:"Trace à la souris (ou au doigt) la flèche qui représente la force, avec la bonne échelle.",
  but:"Lis la situation. Appuie sur le point d'application, glisse pour dessiner la flèche, relâche, puis vérifie les quatre caractéristiques.",
  aRetenir:"Une force est un vecteur : on la représente par une flèche qui indique son point d'application (où elle s'exerce), sa direction (la droite), son sens et sa valeur (longueur de la flèche selon l'échelle, par exemple 1 cm pour 10 N).",
  piege:"Le poids s'applique au centre de gravité et pointe vers le bas ; la réaction du support s'applique au contact et pointe vers le haut. Sur un objet au repos, ces deux forces ont la même valeur : une flèche trop courte ou trop longue est une erreur de valeur.",
  build:function(k,S){
    var c = k.canvas(340);
    var sel = k.select("Situation",SCEN.map(function(s,i){return [i,"Situation "+(i+1)];}),0);
    var res = k.note("","");
    k.button("Effacer la flèche", function(){ ar=null; ok=null; });
    k.button("Vérifier", function(){ check(); }, true);
    var ar=null, ok=null, box={};
    function sc(){ return SCEN[+sel.value]; }
    var CM=36;                                  /* pixels pour 1 cm */
    c.pointer(function(t,p){ if (t==="down"){ ar={x0:p.x,y0:p.y,x1:p.x,y1:p.y}; ok=null; } else if (t==="drag"&&ar){ ar.x1=p.x; ar.y1=p.y; k.redraw(); } else if (t==="up"&&ar){ ar.x1=p.x; ar.y1=p.y; k.redraw(); } });
    function check(){
      var s=sc(); if(!ar||Math.hypot(ar.x1-ar.x0,ar.y1-ar.y0)<8){ ok={msg:"Dessine d'abord une flèche.",kind:"warn"}; return; }
      var o=s.org(box), dx=ar.x1-ar.x0, dy=ar.y1-ar.y0, len=Math.hypot(dx,dy)/CM*s.sc;
      var ang=Math.atan2(dy,dx)*180/Math.PI;                       /* y vers le bas : 90 = vers le bas */
      var okPt=Math.hypot(ar.x0-o[0],ar.y0-o[1])<24;
      var diff=Math.abs(((ang-s.ang)%360+540)%360-180);                /* écart angulaire 0..180 */
      var okDir2=diff<=10||diff>=170, okSens=diff<=10, okVal=Math.abs(len-s.F)/s.F<=0.12;
      var ms=[];
      ms.push((okPt?"✓":"✗")+" point d'application"+(okPt?"":" : cherche le "+s.lab));
      ms.push((okDir2?"✓":"✗")+" direction"+(okDir2?"":" : la force est "+(s.ang===0?"horizontale":"verticale")));
      ms.push((okSens?"✓":"✗")+" sens");
      ms.push((okVal?"✓":"✗")+" valeur : ta flèche représente "+F(len,1)+" N, attendu "+F(s.F,1)+" N ("+F(s.F/s.sc,1)+" cm)");
      ok={msg:ms.join("<br>"),kind:(okPt&&okDir2&&okSens&&okVal)?"ok":"warn"};
    }
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, s=sc();
      var gy=H*0.68; rect(c,10,gy,W-20,H-gy-10,"#eef1f5"); ln(c,[10,gy],[W-10,gy],P.grey,2);
      var bw=Math.min(110,W*0.28), bx=W/2-bw/2-(+sel.value===2?W*0.12:0);
      box={cx:bx+bw/2,cy:gy-bw/2,by:gy,rx:bx+bw};
      if (+sel.value===2){ rect(c,bx,gy-bw*0.45,bw*1.2,bw*0.45,"#c9a36b",P.ink,2,4); box.rx=bx+bw*1.2; box.cy=gy-bw*0.225; T(c,"traîneau",bx+bw*0.6,box.cy,{size:12}); ln(c,[box.rx,box.cy],[box.rx+34,box.cy],P.grey,2,[4,3]); }
      else { rect(c,bx,gy-bw,bw,bw,"#d9b98a",P.ink,2,4); T(c,"4 kg",bx+bw/2,gy-bw/2,{size:13}); }
      T(c,"Échelle : 1 cm ↔ "+s.sc+" N (1 cm = "+CM+" px)",W/2,18,{size:12,color:P.grey});
      T(c,s.n,W/2,40,{size:12,color:P.ink});
      /* règle 1 cm */
      D.line(c,16,H-26,16+CM,H-26,P.grey,2); T(c,"1 cm",16+CM/2,H-12,{size:12,color:P.grey});
      if (ar){ circ(c,ar.x0,ar.y0,4,P.red); if (Math.hypot(ar.x1-ar.x0,ar.y1-ar.y0)>6) D.arrow(c,ar.x0,ar.y0,ar.x1,ar.y1,P.red,3); }
      res.set(ok?ok.msg:"Appuie, glisse, relâche : la flèche part de l'endroit où tu appuies. Longueur attendue = valeur ÷ échelle.",ok?ok.kind:"");
    });
  }
});

/* 3 · Ressort */
SFA.sim({
  id:"p3-c07-ressort", ch:"c07", tag:"Mesure",
  titre:"Allongement d'un ressort : la loi de Hooke",
  resume:"Accroche des masses : l'allongement est proportionnel à la force, jusqu'à la limite d'élasticité.",
  but:"Choisis un ressort, accroche des masses, note les mesures et observe que le graphe F = f(allongement) est une droite.",
  aRetenir:"Pour un ressort élastique, la force F est proportionnelle à l'allongement Δℓ : F = k·Δℓ, où k est la raideur (en N/m). C'est le principe du dynamomètre. Au-delà de la limite d'élasticité (ici 4,5 N), le ressort ne revient plus à sa longueur initiale et la proportionnalité n'est plus vraie.",
  piege:"On proportionne la force à l'allongement (longueur en plus), pas à la longueur totale du ressort. Un ressort plus raide (k plus grand) s'allonge moins pour la même force.",
  build:function(k,S){
    var c = k.canvas(340);
    var kk = k.select("Ressort",[["20","Ressort mou : k = 20 N/m"],["40","Ressort moyen : k = 40 N/m"],["80","Ressort raide : k = 80 N/m"]],"40");
    var m = k.slider("Masse accrochée",0,600,50,200,"g");
    var ro = k.readouts(["Force exercée (poids)","Allongement","Raideur (force ÷ allongement)"]);
    var nt = k.note("","");
    var pts=[];
    k.button("Noter la mesure",function(){ if (m.value>0 && m.value*0.00981<=4.5) pts.push({F:m.value*0.00981,k:+kk.value}); },true);
    k.button("Effacer les mesures",function(){ pts=[]; });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, K=+kk.value, Fn=m.value/1000*9.81, dl=Fn/K, over=Fn>4.5;
      /* ressort à gauche */
      var x=Math.min(70,W*0.16), top=20, L0=70, sc=Math.min(260-0,(H-top-60)/(0.10+0.30))*1; /* px par m */
      var pxm=(H-top-70)/0.40, y1=top+(0.10+dl)*pxm;
      ln(c,[x-24,top],[x+24,top],P.ink,4); spring(c,x,top,y1,9,12);
      var sz=16+Math.sqrt(m.value/1000)*22; if (m.value>0){ rect(c,x-sz/2,y1,sz,sz,"#c4cbd6",P.ink,2,4); T(c,F(m.value,0)+" g",x,y1+sz/2,{size:12}); }
      D.line(c,x+30,top+0.10*pxm,x+50,top+0.10*pxm,P.grey,1.5,[3,3]); if (W>=500) T(c,"longueur à vide : 10 cm",x+54,top+0.10*pxm-8,{size:12,color:P.grey,align:"left"});
      if (dl>0.002){ D.arrow(c,x+40,top+0.10*pxm,x+40,y1,P.green,2); T(c,"Δℓ = "+F(dl*100,1)+" cm",x+48,(top+0.10*pxm+y1)/2+14,{size:12,color:P.green,align:"left"}); }
      /* graphe */
      var gx=Math.max(W*0.42,150), ax=D.axes({ctx:c.ctx,W:W,H:H},{x0:0,x1:0.30,y0:0,y1:6,xl:"Δℓ (m)",yl:"F (N)",stepX:0.1,stepY:1,l:gx+30,r:12,t:16,b:34});
      D.fn(c,ax,function(x2){ return K*x2; },P.acc,2.4);
      D.fn(c,ax,function(x2){ return x2>4.5/K ? K*x2 : NaN; },P.red,2.4,[5,4]);
      T(c,"limite 4,5 N",ax.X(4.5/K)-8,ax.Y(4.5)-10,{size:12,color:P.red,align:"right"});
      pts.forEach(function(p){ circ(c,ax.X(p.F/p.k),ax.Y(p.F),5,p.k===K?P.acc:P.grey,"#fff",1.5); });
      circ(c,ax.X(dl),ax.Y(Fn),6.5,"#fff",over?P.red:P.acc,3);
      ro.set(0,F(Fn,2)+" N"); ro.set(1,F(dl*100,1)+" cm"); ro.set(2,Fn>0?F(Fn/dl,0)+" N/m":"—");
      nt.set(over?"<b>Limite d'élasticité dépassée</b> (F &gt; 4,5 N) : le ressort s'étire de façon permanente, la formule F = k·Δℓ n'est plus valable. Le trait en pointillé est hors modèle.":"F = "+F(Fn,2)+" N ; Δℓ = F / k = "+F(dl*100,1)+" cm. Les points mesurés (ressort choisi en bleu) sont alignés avec l'origine.",over?"warn":"ok");
    });
  }
});

/* 4 · Balances en orbite */
var LIEUX=[["terre","Sur la Terre",9.81,false],["lune","Sur la Lune",1.62,false],["iss","Dans la station spatiale (400 km)",8.69,true],["loin","Très loin de tout astre",0.0,true]];
var INSTR=[["pese","Pèse-personne à ressort (étalonné sur Terre)"],["dyn","Dynamomètre"],["plat","Balance à plateaux"],["iner","Balance d'inertie (oscillations)"]];
SFA.sim({
  id:"p3-c07-balance-orbite", ch:"c07", tag:"Niche utile",
  titre:"Peser un astronaute : quelle balance fonctionne où ?",
  resume:"Même astronaute, quatre lieux, quatre instruments : que lit-on ?",
  but:"Choisis un lieu, un instrument et une masse. Compare la lecture avec la vraie masse et le poids.",
  aRetenir:"La masse ne change jamais. Un pèse-personne ou un dynamomètre mesurent la force exercée sur eux : sur la Lune, un pèse-personne étalonné sur Terre indique 6 fois trop peu de « kilogrammes ». Dans la station spatiale, tout tombe en même temps (chute libre) : les instruments qui utilisent le poids n'indiquent rien. Seule la balance d'inertie marche partout.",
  piege:"Dans la station, l'astronaute n'est pas « sans pesanteur » : la Terre l'attire presque autant qu'au sol (g ≈ 8,7 N/kg). Il flotte parce qu'il est en chute libre avec la station, pas parce que l'attraction a disparu.",
  build:function(k,S){
    var c = k.canvas(320);
    var lieu = k.select("Lieu",LIEUX.map(function(l){return [l[0],l[1]];}),"terre");
    var ins = k.select("Instrument",INSTR,"pese");
    var m = k.slider("Masse de l'astronaute",20,100,5,70,"kg");
    var ro = k.readouts(["Attraction de l'astre","Lecture de l'instrument","Vraie masse"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      var L=LIEUX.filter(function(l){return l[0]===lieu.value;})[0], mk=m.value, att=mk*L[2], fall=L[3];
      var read="", kind="ok", msg="";
      if (ins.value==="pese"){ read=fall?"0 kg":F(att/9.81,1)+" kg"; msg=fall?"En chute libre, l'astronaute n'appuie plus sur le pèse-personne : il indique 0.":(L[0]==="terre"?"Sur Terre, l'étalonnage est bon : lecture = masse.":"Le pèse-personne mesure la force d'appui puis la convertit avec g = 9,81 N/kg : sur la Lune il indique "+F(att/9.81,1)+" kg, pas la vraie masse."); kind=L[0]==="terre"?"ok":"warn"; }
      else if (ins.value==="dyn"){ read=fall?"0 N":F(att,0)+" N"; msg=fall?"Le dynamomètre mesure la force de traction : en chute libre, rien ne tire sur lui.":"Le dynamomètre indique le poids : "+F(mk,0)+" kg × "+F(L[2],2)+" N/kg = "+F(att,0)+" N."; }
      else if (ins.value==="plat"){ read=fall?"ne fonctionne pas":F(mk,0)+" kg"; msg=fall?(L[0]==="loin"?"Sans attraction, rien ne pèse : aucune force ne fait pencher la balance. Impossible de comparer.":"Plateaux et masses marquées tombent ensemble : aucune force ne fait pencher la balance. Impossible de comparer."):"Elle compare l'astronaute à des masses marquées : l'astre attire les deux de la même façon, donc la lecture ("+F(mk,0)+" kg) est bonne partout où il y a du poids."; kind=fall?"warn":"ok"; }
      else { read=F(mk,0)+" kg"; msg="La balance d'inertie mesure la période d'oscillation d'un siège ressort : elle dépend de la masse, pas du poids. Elle fonctionne même en apesanteur : c'est l'instrument utilisé dans la station."; }
      /* dessin */
      var cx=W*0.32, cy=H*0.5, gy=H-50;
      if (!fall){ rect(c,10,gy,W-20,H-gy-10,L[0]==="lune"?"#d0d0d0":"#cfe3c8"); ln(c,[10,gy],[W-10,gy],P.grey,2); T(c,L[0]==="lune"?"sol lunaire":"sol terrestre",W-14,gy+22,{size:12,color:P.grey,align:"right"}); }
      else { rect(c,10,10,W-20,H-20,L[0]==="iss"?"#eaf0fb":"#10172a",null,0,12); if (L[0]==="loin") for (var i=0;i<24;i++) circ(c,(i*97)%(W-30)+15,(i*53)%(H-30)+15,1.4,"#fff"); }
      var col=L[0]==="loin"?"#fff":P.ink;
      var astroY=fall?H*0.35:gy-62; circ(c,cx,astroY-18,12,"#f3d6b8",P.ink,2); ln(c,[cx,astroY-6],[cx,astroY+34],col==="#fff"?"#fff":P.ink,4);
      ln(c,[cx,astroY],[cx-16,astroY+16],col==="#fff"?"#fff":P.ink,3); ln(c,[cx,astroY],[cx+16,astroY+16],col==="#fff"?"#fff":P.ink,3);
      if (att>0.5){ D.arrow(c,cx+34,astroY+10,cx+34,astroY+10+Math.min(70,att/12),P.red,3); T(c,"attraction",cx+40,astroY+30+Math.min(70,att/12),{size:12,color:P.red,align:"left"}); }
      if (fall) T(c,L[0]==="iss"?"chute libre avec la station":"loin de tout : attraction ≈ 0",cx,astroY+60,{size:12,color:col==="#fff"?"#fff":P.grey});
      /* afficheur */
      var dx=W*0.62; rect(c,dx,H*0.28,W*0.32,H*0.34,"#e8f1e0","#7a8f6a",2,8); T(c,INSTR.filter(function(q){return q[0]===ins.value;})[0][1].split(" (")[0],dx+W*0.16,H*0.28+16,{size:12,color:"#243018"}); T(c,read,dx+W*0.16,H*0.28+W*0.0+H*0.17,{size:read.length>8?14:20,color:"#243018"});
      ro.set(0,fall&&L[0]==="loin"?"≈ 0 N":F(att,0)+" N"); ro.set(1,read); ro.set(2,F(mk,0)+" kg");
      nt.set(msg,kind);
    });
  }
});
})();
