/* Chapitre 3 · Intensité et tension */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function glow(c,x,y,r,b){ if(b<=0.02) return; var g=c.ctx, R=r*(1.3+Math.min(b,1.6)), gr=g.createRadialGradient(x,y,r*0.3,x,y,R); gr.addColorStop(0,"rgba(255,206,60,"+Math.min(0.9,0.25+0.55*b)+")"); gr.addColorStop(1,"rgba(255,206,60,0)"); g.fillStyle=gr; g.beginPath(); g.arc(x,y,R,0,6.2832); g.fill(); }
function lamp(c,x,y,r,b,lab){ glow(c,x,y,r,b); circ(c,x,y,r,b>0.02?"rgba(255,236,150,"+Math.min(1,0.4+0.6*b)+")":"#f4f6f9",P.ink,2); var g=c.ctx; g.save(); g.strokeStyle=P.ink; g.lineWidth=1.5; g.beginPath(); g.moveTo(x-r*0.7,y-r*0.7); g.lineTo(x+r*0.7,y+r*0.7); g.moveTo(x+r*0.7,y-r*0.7); g.lineTo(x-r*0.7,y+r*0.7); g.stroke(); g.restore(); if(lab) T(c,lab,x,y-r-10,{size:12,color:P.grey}); }
function pilesym(c,x,y,vertical){ var g=c.ctx; g.save(); g.translate(x,y); if(vertical) g.rotate(-Math.PI/2); rect(c,-14,-20,28,40,"#fff"); g.strokeStyle="#3a4a60"; g.lineWidth=2.5; g.beginPath(); g.moveTo(6,-15); g.lineTo(6,15); g.stroke(); g.lineWidth=5; g.beginPath(); g.moveTo(-6,-9); g.lineTo(-6,9); g.stroke(); g.lineWidth=3; g.beginPath(); g.moveTo(-24,0); g.lineTo(-6,0); g.moveTo(6,0); g.lineTo(24,0); g.stroke(); g.restore(); }
function meter(c,x,y,sym,col){ circ(c,x,y,15,"#fff",col||P.ink,2.5); T(c,sym,x,y,{size:15,color:col||P.ink}); }
function ln(c,a,b,col,w){ D.line(c,a[0],a[1],b[0],b[1],col||"#3a4a60",w||3); }

/* 1 · Multimètre virtuel */
SFA.sim({
  id:"p3-c03-multimetre", ch:"c03", tag:"Classique",
  titre:"Le multimètre : bien le brancher, bien le régler",
  resume:"Ampèremètre en série, voltmètre en dérivation : teste les bons et les mauvais branchements.",
  but:"Choisis l'appareil, son branchement et son calibre. Observe la lecture, l'état de la lampe et les messages (surcharge, fusible).",
  aRetenir:"L'ampèremètre se place EN SÉRIE (il laisse passer le courant) ; le voltmètre se place EN DÉRIVATION aux bornes du dipôle. Il faut choisir un calibre plus grand que la valeur à mesurer, puis descendre.",
  piege:"Un ampèremètre en dérivation est un court-circuit (fusible grillé). Un voltmètre en série indique à peu près la tension de la pile mais la lampe s'éteint : il ne laisse presque pas passer le courant.",
  build:function(k,S){
    var c = k.canvas(300);
    var fn = k.seg("Appareil", [["A","Ampèremètre (A)"],["V","Voltmètre (V)"]], "A");
    var br = k.seg("Branchement", [["s","En série"],["d","En dérivation aux bornes de la lampe"]], "s");
    var ca = k.select("Calibre ampèremètre", [["0.2","200 mA"],["2","2 A"],["10","10 A"]], "2");
    var cv = k.select("Calibre voltmètre", [["2","2 V"],["20","20 V"],["200","200 V"]], "20");
    var ro = k.readouts(["Lecture affichée","Lampe"]);
    var nt = k.note("","");
    var E=4.5, R=15;
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      var isA=fn.value==="A", ser=br.value==="s";
      var cal = +(isA?ca.value:cv.value), val=0, disp="", lampB=1, msg="", kind="ok", dec=isA?(cal<1?3:cal<5?3:2):(cal<5?3:cal<50?2:1);
      if (isA && ser){ val=E/R; }
      else if (isA && !ser){ val=NaN; }
      else if (!isA && ser){ val=E; lampB=0; }
      else val=E;
      if (isA && !ser){ disp="FUSIBLE"; lampB=0; msg="<b>Fusible de l'ampèremètre grillé !</b> Branché en dérivation, l'ampèremètre (résistance presque nulle) court-circuite la lampe : courant énorme. À ne jamais faire : il se place en série."; kind="warn"; }
      else if (val>cal){ disp="OL"; msg="<b>Dépassement de calibre (OL)</b> : "+F(val,3)+(isA?" A":" V")+" dépasse "+(isA?(cal<1?"200 mA":cal+" A"):cal+" V")+". Choisis un calibre plus grand."; kind="warn"; }
      else { disp=F(val,dec)+(isA?" A":" V"); 
        if (isA) msg="Ampèremètre en série : il mesure l'intensité qui traverse la lampe ("+F(E/R,2)+" A = U/R avec U = 4,5 V et R = 15 Ω)."+(cal===10?" Calibre trop grand : peu de chiffres significatifs.":"");
        else if (ser) { msg="<b>Voltmètre en série</b> : il indique à peu près la tension de la pile ("+F(E,1)+" V) car il se trouve seul dans la boucle, mais il a une très grande résistance : le courant est quasi nul et la lampe reste éteinte. Mauvais branchement."; kind="warn"; }
        else msg="Voltmètre en dérivation aux bornes de la lampe : il mesure la tension de la lampe, "+F(E,1)+" V."+(cal===200?" Calibre trop grand : peu précis.":""); }
      /* dessin */
      var x0=W*0.14,x1=W*0.86,y0=64,y1=H-52;
      var lx=(x0+x1)/2; 
      ln(c,[x0,y0],[x1,y0]); ln(c,[x1,y0],[x1,y1]); ln(c,[x1,y1],[x0,y1]); ln(c,[x0,y1],[x0,y0]);
      pilesym(c,x0,(y0+y1)/2,true); T(c,"4,5 V",x0+34,(y0+y1)/2,{size:12,color:P.grey,align:"left"});
      lamp(c,x1,(y0+y1)/2,16,lampB*0.9,"lampe");
      D.line(c,x1,(y0+y1)/2-16,x1,(y0+y1)/2-30,"#3a4a60",3); D.line(c,x1,(y0+y1)/2+16,x1,(y0+y1)/2+30,"#3a4a60",3);
      if (isA && ser){ rect(c,lx-24,y0-14,48,28,"#fff"); ln(c,[lx-40,y0],[lx-15,y0]); ln(c,[lx+15,y0],[lx+40,y0]); meter(c,lx,y0,"A",P.red); }
      else if (!isA && ser){ rect(c,lx-24,y0-14,48,28,"#fff"); meter(c,lx,y0,"V",P.acc); }
      else { var my=(y0+y1)/2; var xm=x1-70, yt=(y0+y1)/2-30, yb=(y0+y1)/2+30; var col=isA?P.red:P.acc;
        ln(c,[x1,yt],[xm,yt],col,2.5); ln(c,[x1,yb],[xm,yb],col,2.5); ln(c,[xm,yt],[xm,my-15],col,2.5); ln(c,[xm,yb],[xm,my+15],col,2.5); meter(c,xm,my,isA?"A":"V",col); }
      /* afficheur */
      rect(c,W/2-62,H-44,124,30,"#e8f1e0","#7a8f6a",2,6); T(c,disp,W/2,H-29,{size:17,color:"#243018",math:false});
      T(c,"calibre "+(isA?(cal<1?"200 mA":cal+" A"):cal+" V"),W/2+0,H-8,{size:12,color:P.grey});
      ro.set(0,disp); ro.set(1,lampB>0.1?"allumée":"éteinte");
      nt.set(msg,kind);
    });
  }
});

/* 2 · Analogie hydraulique */
SFA.sim({
  id:"p3-c03-hydraulique", ch:"c03", tag:"Analogie",
  titre:"L'analogie hydraulique : tension, intensité, résistance",
  resume:"Une pompe, des tuyaux, un rétrécissement : visualise I = U / R comme un débit.",
  but:"Règle la « pression » de la pompe (la tension), le rétrécissement du tuyau (la résistance) et la vanne (l'interrupteur). Compare le débit d'eau et l'intensité.",
  aRetenir:"Tension = « pression » que fournit la pile ; intensité = débit de charges ; résistance = rétrécissement qui freine. Pour une même tension, plus la résistance est grande, plus l'intensité est faible : I = U / R.",
  piege:"L'eau (les charges) n'est pas consommée dans le rétrécissement : le débit est le même avant et après. Seule l'énergie est transférée. Et la tension ne « circule » pas : elle existe entre deux points, même quand la vanne est fermée.",
  build:function(k,S){
    var c = k.canvas(300);
    var U = k.slider("Tension de la pile (pression de la pompe)", 1.5, 12, 0.5, 6, "V");
    var R = k.slider("Résistance (rétrécissement)", 1, 50, 1, 10, "Ω");
    var sw = k.seg("Interrupteur (vanne)", [["1","Fermé"],["0","Ouvert"]], "1");
    var ro = k.readouts(["Intensité I = U / R","Tension aux bornes de la vanne","Tension aux bornes de R"]);
    var nt = k.note("","");
    var u=0, lp=k.loop(function(dt){ var I=sw.value==="1"?U.value/R.value:0; u=(u+dt*I*0.22)%1; k.redraw(); });
    lp.play();
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, on=sw.value==="1", I=on?U.value/R.value:0;
      var x0=W*0.12,x1=W*0.88,y0=60,y1=H-60, th=14;
      function pipe(a,b){ D.line(c,a[0],a[1],b[0],b[1],"#d6e4f2",th+10); D.line(c,a[0],a[1],b[0],b[1],"#9bb7d4",th+10,[]); D.line(c,a[0],a[1],b[0],b[1],"#eaf2fa",th+6); }
      pipe([x0,y0],[x1,y0]); pipe([x1,y0],[x1,y1]); pipe([x1,y1],[x0,y1]); pipe([x0,y1],[x0,y0]);
      /* rétrécissement : sur le côté droit, étranglement proportionnel à R */
      var cy=(y0+y1)/2, nar=Math.max(2,th*(1-Math.min(0.92,R.value/52)));
      c.ctx.fillStyle="#9bb7d4"; c.ctx.fillRect(x1-th/2-4,cy-30,th+8,30-nar/2); c.ctx.fillRect(x1-th/2-4,cy+nar/2,th+8,30-nar/2);
      T(c,"résistance",x1-6,cy+48,{size:12,color:P.grey,align:"right"});
      /* pompe */
      rect(c,x0-20,(y0+y1)/2-24,40,48,"#f3dcd8",P.red,2,8); T(c,"pompe",x0,(y0+y1)/2+36,{size:12,color:P.grey}); T(c,F(U.value,1)+" V",x0,(y0+y1)/2,{size:12,color:P.red});
      /* vanne en haut */
      var vx=(x0+x1)/2; rect(c,vx-16,y0-16,32,32,"#fff",P.ink,2,4); if(on){ D.line(c,vx-10,y0,vx+10,y0,P.ink,4); } else { D.line(c,vx,y0-12,vx,y0+12,P.red,5); }
      T(c,"vanne",vx,y0-26,{size:12,color:P.grey});
      /* particules d'eau */
      var path=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
      var per=2*((x1-x0)+(y1-y0));
      for (var i=0;i<36;i++){
        var s=((i/36)+u)%1*per, p;
        if (s<x1-x0) p=[x0+s,y0]; else if ((s-=x1-x0)<y1-y0) p=[x1,y0+s]; else if ((s-=y1-y0)<x1-x0) p=[x1-s,y1]; else { s-=x1-x0; p=[x0,y1-s]; }
        circ(c,p[0],p[1],3,"#3f7fd1");
      }
      ro.set(0,F(I,2)+" A"); ro.set(1,on?"0 V":F(U.value,1)+" V"); ro.set(2,on?F(U.value,1)+" V":"0 V");
      nt.set(on?"Débit : "+F(I,2)+" A. Doubler la résistance divise l'intensité par 2 ; doubler la tension la multiplie par 2.":"Vanne fermée : plus de débit (I = 0), mais la pression de la pompe est bien là : on mesure U = "+F(U.value,1)+" V aux bornes de l'interrupteur ouvert.","ok");
    });
  }
});

/* 3 · Intensité en plusieurs points */
SFA.sim({
  id:"p3-c03-points", ch:"c03", tag:"Interactif",
  titre:"Intensité en différents points d'un circuit en série",
  resume:"Clique sur le circuit pour déplacer l'ampèremètre : la valeur change-t-elle ?",
  but:"Clique près d'un des points A, B, C, D pour y placer l'ampèremètre. Modifie les résistances des lampes.",
  aRetenir:"Dans un circuit en série, l'intensité est la même en tout point : le courant ne « s'use » pas. Ce sont les tensions qui se répartissent entre les lampes, et leur somme vaut la tension de la pile.",
  piege:"Une lampe ne consomme pas de courant : elle reçoit de l'énergie grâce au courant, mais la même intensité ressort de la lampe.",
  build:function(k,S){
    var c = k.canvas(320);
    var r1=k.slider("Résistance lampe 1",5,40,1,10,"Ω"), r2=k.slider("Résistance lampe 2",5,40,1,20,"Ω"), r3=k.slider("Résistance lampe 3",5,40,1,30,"Ω");
    var pos=k.select("Position de l'ampèremètre",[["0","A : après le + de la pile"],["1","B : entre lampe 1 et lampe 2"],["2","C : entre lampe 2 et lampe 3"],["3","D : avant le − de la pile"]],"0");
    var ro=k.readouts(["Lecture de l'ampèremètre","U₁","U₂","U₃"]);
    var nt=k.note("","");
    var E=6, pts=[];
    c.pointer(function(t,p){ if(t!=="down"&&t!=="drag") return; var b=-1,bd=1e9; pts.forEach(function(q,i){ var d=Math.hypot(q[0]-p.x,q[1]-p.y); if(d<bd){bd=d;b=i;} }); if(b>=0&&bd<60){ pos.set(String(b)); k.redraw(); } });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, Rt=r1.value+r2.value+r3.value, I=E/Rt, p=+pos.value;
      var x0=W*0.14,x1=W*0.86,y0=64,y1=H-60, cy=(y0+y1)/2;
      pts=[[x0,y0+8],[x1,y0+8],[x1,y1-8],[x0,y1-8]];
      ln(c,[x0,y0],[x1,y0]); ln(c,[x1,y0],[x1,y1]); ln(c,[x1,y1],[x0,y1]); ln(c,[x0,y1],[x0,y0]);
      pilesym(c,x0,cy,true); T(c,"6 V",x0+30,cy,{size:12,color:P.grey,align:"left"});
      var R=[r1.value,r2.value,r3.value], B=[0,0,0];
      var lp=[[(x0+x1)/2,y0],[x1,cy],[(x0+x1)/2,y1]];
      rect(c,lp[0][0]-22,y0-20,44,40,"#fff"); rect(c,x1-20,cy-22,40,44,"#fff"); rect(c,lp[2][0]-22,y1-20,44,40,"#fff");
      var bl=[0,1,2].map(function(j){ return Math.min(1.3,Math.pow(I/0.3,2)*(R[j]/10)*0.6); });
      lamp(c,lp[0][0],lp[0][1],16,bl[0],"L1"); lamp(c,lp[1][0],lp[1][1],16,bl[1],"L2"); lamp(c,lp[2][0],lp[2][1],16,bl[2],"L3");
      /* repères A..D */
      var lab=["A","B","C","D"];
      pts.forEach(function(q,i){ circ(c,q[0],q[1],i===p?0:6,"#fff",P.grey,2); T(c,lab[i],q[0]+(i===0||i===3?-18:18),q[1]+(i<2?-4:4),{size:13,color:P.grey}); });
      var q=pts[p]; meter(c,q[0],q[1],"A",P.red);
      D.arrow(c,W/2-30,cy+2,W/2+30,cy+2,P.ink,2); T(c,"sens conventionnel",W/2,cy+18,{size:12,color:P.grey});
      var Us=R.map(function(r){return I*r;});
      ro.set(0,F(I*1000,0)+" mA"); ro.set(1,F(Us[0],2)+" V"); ro.set(2,F(Us[1],2)+" V"); ro.set(3,F(Us[2],2)+" V");
      nt.set("En A, B, C ou D : <b>"+F(I*1000,0)+" mA</b>, toujours la même. Tensions : "+F(Us[0],2)+" + "+F(Us[1],2)+" + "+F(Us[2],2)+" = "+F(Us[0]+Us[1]+Us[2],2)+" V = tension de la pile.","ok");
    });
  }
});

/* 4 · Pile citron */
var METAL=[["Cu","Cuivre",0],["Fe","Fer (clou)",0.55],["Zn","Zinc (clou galvanisé)",0.95],["Mg","Magnésium (ruban)",1.6]];
SFA.sim({
  id:"p3-c03-pile-citron", ch:"c03", tag:"Niche utile",
  titre:"Une pile avec un citron : tension, montage, DEL",
  resume:"Choisis les métaux, le nombre de fruits et le montage : la DEL s'allume-t-elle ?",
  but:"Plante deux électrodes dans chaque fruit. Mesure la tension et vois si une DEL rouge (il lui faut environ 1,8 V) s'allume.",
  aRetenir:"La tension d'un fruit dépend des deux métaux (le plus réactif est le pôle −), pas de la taille du fruit. En série, les tensions s'additionnent ; en dérivation, la tension reste celle d'un seul fruit (mais l'intensité disponible augmente).",
  piege:"Deux électrodes identiques ne donnent aucune tension. Mettre les fruits en dérivation n'augmente pas la tension : la DEL ne s'allume pas. Valeurs : ordres de grandeur d'expériences en classe (± 0,2 V), pas des mesures exactes.",
  build:function(k,S){
    var c = k.canvas(310);
    var e1=k.select("Électrode 1 (reliée à la DEL, côté +)",METAL.map(function(m){return [m[0],m[1]];}),"Cu");
    var e2=k.select("Électrode 2",METAL.map(function(m){return [m[0],m[1]];}),"Zn");
    var n=k.slider("Nombre de fruits",1,6,1,3,"");
    var mt=k.seg("Montage",[["s","En série"],["p","En dérivation"]],"s");
    var fr=k.seg("Fruit",[["c","Citron"],["p","Pomme de terre"]],"c");
    var ro=k.readouts(["Tension disponible","Intensité dans la DEL","DEL rouge"]);
    var nt=k.note("","");
    function sc(id){ return METAL.filter(function(m){return m[0]===id;})[0][2]; }
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, N=n.value, ser=mt.value==="s", cit=fr.value==="c";
      var d=sc(e2.value)-sc(e1.value);                  /* >0 : l'électrode 1 est le pôle + */
      var v=Math.abs(d)*(cit?1:0.9), rc=cit?1000:2500;
      var V=ser?N*v:v, r=ser?N*rc:rc/N;
      var ok=d>0, I=ok?Math.max(0,(V-1.8)/(r+60)):0;
      var lit = I>2e-4?2:I>5e-5?1:0;
      /* fruits */
      var gap=Math.min(70,(W-80)/N), sx=W/2-(N-1)*gap/2, fy=H/2+30, rr=Math.min(26,gap*0.4), ey=fy-rr-16, lx=W-34, ly=H-38;
      var W1=function(pts,col){ for (var q=0;q<pts.length-1;q++) D.line(c,pts[q][0],pts[q][1],pts[q+1][0],pts[q+1][1],col||"#3a4a60",2); };
      for (var i=0;i<N;i++){ var fx=sx+i*gap;
        circ(c,fx,fy,rr,cit?"#f5e27a":"#d2b48c",cit?"#c9a900":"#a1795a",2);
        rect(c,fx-rr*0.5-3,ey,6,rr+8,"#c9cdd3",P.grey,1,2); rect(c,fx+rr*0.5-3,ey,6,rr+8,"#d89a6b",P.grey,1,2);
        T(c,e1.value+" | "+e2.value,fx,fy+rr+13,{size:12,color:P.grey}); }
      var xa=function(i){ return sx+i*gap-rr*0.5; }, xb=function(i){ return sx+i*gap+rr*0.5; };
      if (ser){
        for (i=0;i<N-1;i++) W1([[xb(i),ey],[xb(i),ey-14],[xa(i+1),ey-14],[xa(i+1),ey]]);
        W1([[xa(0),ey],[xa(0),ey-26],[10,ey-26],[10,ly],[lx-14,ly]]);
        W1([[xb(N-1),ey],[xb(N-1),ey-38],[W-8,ey-38],[W-8,ly],[lx+14,ly]]);
      } else {
        for (i=0;i<N;i++){ W1([[xa(i),ey],[xa(i),ey-14]]); W1([[xb(i),ey],[xb(i),ey-30]]); }
        W1([[xa(0),ey-14],[xa(N-1),ey-14]]); W1([[xb(0),ey-30],[xb(N-1),ey-30]]);
        W1([[xa(0),ey-14],[10,ey-14],[10,ly],[lx-14,ly]]);
        W1([[xb(N-1),ey-30],[W-8,ey-30],[W-8,ly],[lx+14,ly]]);
      }
      /* DEL */
      circ(c,lx,ly,14,lit?(lit===2?"#ff6b5a":"#e9a9a1"):"#f1d7d4",P.red,2); T(c,"DEL",lx,ly,{size:12,color:P.red});
      if (lit) glow(c,lx,ly,14,lit===2?1.2:0.35);
      T(c,"fruits en "+(ser?"série":"dérivation"),W/2,H-12,{size:12,color:P.grey});
      ro.set(0,F(V,2)+" V"); ro.set(1,F(I*1000,2)+" mA"); ro.set(2,lit===2?"allumée":lit===1?"à peine lumineuse":"éteinte");
      var msg;
      if (d===0) msg="Électrodes identiques : <b>aucune tension</b>. Il faut deux métaux différents.";
      else if (!ok) msg="Branchement inversé : le pôle + est l'électrode <b>"+METAL.filter(function(m){return m[0]===e2.value;})[0][1].split(" ")[0]+"</b> (le moins réactif). La DEL est montée à l'envers et ne laisse pas passer le courant.";
      else if (V<1.8) msg="La tension disponible ("+F(V,2)+" V) est inférieure à environ 1,8 V : la DEL ne peut pas s'allumer."+(ser?" Ajoute des fruits en série.":" Les montages en dérivation n'augmentent pas la tension : passe en série.");
      else msg="Tension suffisante ("+F(V,2)+" V). Le courant est très faible car chaque fruit a une grande résistance interne (environ "+(cit?"1 kΩ":"2,5 kΩ")+") : lueur faible.";
      nt.set(msg,lit?"ok":"warn");
    });
  }
});
})();
