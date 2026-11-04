/* Chapitre 3 : primitives */
SFA.sim({
  id:"m6-c03-famille", ch:"c03", tag:"Classique",
  titre:"Une fonction, une infinité de primitives",
  resume:"Change la constante C : les courbes glissent verticalement, mais les tangentes restent parallèles.",
  but:"Choisis f, puis déplace la constante C. Observe que toutes les primitives ont la même pente à la même abscisse.",
  aRetenir:"Si F est une primitive de f, alors toutes les primitives de f sont F + C (C constante réelle). Elles se déduisent l'une de l'autre par translation verticale, et leurs tangentes en une même abscisse sont parallèles, de pente f(x).",
  piege:"Oublier « + C » : sans la constante, on n'écrit qu'<i>une</i> primitive et pas la famille. Pour vérifier ta primitive, dérive-la : tu dois retrouver f.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7});
    var D={
      a:{lab:"f(x) = 2x",f:function(x){return 2*x;},F:function(x){return x*x;},ex:"x²"},
      b:{lab:"f(x) = x² − 1",f:function(x){return x*x-1;},F:function(x){return x*x*x/3-x;},ex:"x³/3 − x"},
      c:{lab:"f(x) = cos x",f:function(x){return Math.cos(x);},F:function(x){return Math.sin(x);},ex:"sin x"},
      d:{lab:"f(x) = eˣ",f:function(x){return Math.exp(x);},F:function(x){return Math.exp(x);},ex:"eˣ"}
    };
    var sel=k.select("Fonction f",[["a","2x"],["b","x² − 1"],["c","cos x"],["d","eˣ"]],"a");
    var C=k.slider("Constante C",-4,4,0.5,0,"",null);
    var xt=k.slider("Abscisse des tangentes",-2,2,0.1,1,"",null);
    var fam=k.toggle("Montrer d'autres primitives (C = −3 … 3)",true);
    var ro=k.readouts(["Primitive","F(x) en x","Pente = f(x)","Tangentes"]);
    k.draw(function(){
      c.clear(); var P=S.draw.palette, d=D[sel.value], cc=C.value, x0=xt.value;
      var ax=S.draw.axes(c,{x0:-3,x1:3,y0:-6,y1:6,xl:"x",yl:"y",stepX:1,stepY:2});
      if(fam.value){ for(var j=-3;j<=3;j++){ S.draw.fn(c,ax,function(x){return d.F(x)+j;},"#c5cfe6",1.4); } }
      S.draw.fn(c,ax,d.f,P.green,2,[6,4]);
      S.draw.fn(c,ax,function(x){return d.F(x)+cc;},P.acc,3);
      var m=d.f(x0);
      var list=fam.value?[-3,-2,-1,0,1,2,3]:[cc];
      list.forEach(function(j){ var y=d.F(x0)+j; S.draw.line(c,ax.X(x0-0.8),ax.Y(y-0.8*m),ax.X(x0+0.8),ax.Y(y+0.8*m),P.red,1.6); S.draw.dot(c,ax.X(x0),ax.Y(y),4,P.red); });
      S.draw.dot(c,ax.X(x0),ax.Y(d.F(x0)+cc),6,P.acc);
      S.draw.text(c,"f (vert, pointillés)",ax.L+8,ax.T+8,{size:12,align:"left",color:P.green});
      S.draw.text(c,"F + C (bleu)",ax.L+8,ax.T+26,{size:12,align:"left",color:P.acc});
      ro.set(0,"F(x) = "+d.ex+(cc===0?"":(cc>0?" + ":" − ")+S.fmt(Math.abs(cc),1)));
      ro.set(1,S.fmt(d.F(x0)+cc,3)); ro.set(2,S.fmt(m,3)); ro.set(3,fam.value?"parallèles":"une seule");
    });
  }
});

SFA.sim({
  id:"m6-c03-reconstruire", ch:"c03", tag:"Classique",
  titre:"Dessine f, la primitive F se construit toute seule",
  resume:"Déplace les points de la courbe f : F monte quand f est positive, descend quand f est négative.",
  but:"Fais glisser les points rouges verticalement (en haut). En bas, la primitive F (de valeur initiale réglable) se recalcule instantanément.",
  aRetenir:"F'(x) = f(x) : F augmente là où f &gt; 0, diminue là où f &lt; 0, et possède un extremum là où f change de signe. La valeur F(b) − F(a) est l'aire algébrique entre f et l'axe de a à b.",
  piege:"Le signe de f donne le <i>sens de variation</i> de F, pas le signe de F. F peut être négative alors que f est positive (si F part de très bas).",
  build:function(k,S){
    var cf=k.canvas(190), cF=k.canvas(190);
    var F0=k.slider("Valeur initiale F(0)",-3,3,0.5,0,"",null);
    var ro=k.readouts(["F(6)","Aire algébrique de 0 à 6","Extremums de F"]);
    var ys=[1,2,2,0.5,-1,-2,-1];
    var drag=-1, axf=null, axF=null;
    function f(x){ var i=Math.min(5,Math.max(0,Math.floor(x))); var t=x-i; return ys[i]*(1-t)+ys[i+1]*t; }
    var FS=[];
    function build(){ var h=0.05, s=F0.value; FS=[s]; for(var i=0;i<120;i++){ s+=(f(i*h)+f((i+1)*h))/2*h; FS.push(s); } }
    function Fv(x){ return FS[Math.max(0,Math.min(120,Math.round(x/0.05)))]; }
    k.draw(function(){
      var P=S.draw.palette; build();
      cf.clear(); axf=S.draw.axes(cf,{x0:0,x1:6,y0:-3,y1:3,xl:"x",yl:"f(x)",stepX:1,stepY:1});
      for(var i=0;i<6;i++){ S.draw.line(cf,axf.X(i),axf.Y(ys[i]),axf.X(i+1),axf.Y(ys[i+1]),P.green,3); }
      ys.forEach(function(y,i){ S.draw.dot(cf,axf.X(i),axf.Y(y),8,P.red); });
      cF.clear(); var fl=Math.min.apply(null,FS), fh=Math.max.apply(null,FS), fpad=(fh-fl)*0.1+0.5;
      axF=S.draw.axes(cF,{x0:0,x1:6,y0:Math.min(-2,fl-fpad),y1:Math.max(2,fh+fpad),xl:"x",yl:"F(x)",stepX:1});
      var ext=[], prev=null;
      S.draw.fn(cF,axF,function(x){return Fv(x);},P.acc,3);
      for(var j=0;j<6;j++){ var a=ys[j],b=ys[j+1]; if(a*b<0){ var z=j+a/(a-b); ext.push({x:z,y:Fv(z),mx:a>0}); } else if(a===0&&j>0&&ys[j-1]*b<0){ ext.push({x:j,y:Fv(j),mx:ys[j-1]>0}); } }
      ext.forEach(function(e){ S.draw.dot(cF,axF.X(e.x),axF.Y(e.y),7,P.violet); S.draw.text(cF,e.mx?"max":"min",axF.X(e.x)+6,axF.Y(e.y)-12,{size:12,color:P.violet,align:"left"}); });
      var area=Fv(6)-F0.value;
      ro.set(0,S.fmt(Fv(6),2)); ro.set(1,S.fmt(area,2)); ro.set(2,ext.length?ext.map(function(e){return (e.mx?"max ":"min ")+"en x ≈ "+S.fmt(e.x,2);}).join(" ; "):"aucun");
    });
    cf.pointer(function(type,p){
      if(!axf) return;
      if(type==="down"){ var best=-1,bd=1e9; ys.forEach(function(y,i){ var d=Math.abs(axf.X(i)-p.x); if(d<bd){bd=d;best=i;} }); drag=best; }
      if((type==="down"||type==="drag")&&drag>=0){ var v=Math.max(-3,Math.min(3,axf.iy(p.y))); ys[drag]=Math.round(v*10)/10; k.redraw(); }
      if(type==="up") drag=-1;
    });
  }
});

SFA.sim({
  id:"m6-c03-condition-initiale", ch:"c03", tag:"Condition initiale",
  titre:"Une seule primitive passe par ton point",
  resume:"Clique pour choisir un point : la constante C est calculée et une seule courbe est retenue.",
  but:"Choisis f, puis clique ou glisse sur le graphique pour placer le point A(x₀ ; y₀). La primitive F qui passe par A est tracée en gras.",
  aRetenir:"Pour trouver la primitive qui vérifie F(x₀) = y₀ : 1) trouve une primitive G ; 2) écris F = G + C ; 3) résous G(x₀) + C = y₀, donc C = y₀ − G(x₀). Il y a toujours une seule solution quand f est continue sur un intervalle.",
  piege:"Pour f(x) = 1/x, la primitive est ln|x| + C : sur ]0 ; +∞[ on écrit ln x + C. Ici la simulation reste sur x &gt; 0.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7});
    var D={
      a:{lab:"2x + 1",F:function(x){return x*x+x;},ex:"x² + x",x0:-3,x1:3,y0:-6,y1:8},
      b:{lab:"cos x",F:function(x){return Math.sin(x);},ex:"sin x",x0:-3,x1:3,y0:-4,y1:4},
      c:{lab:"e^(−x)",F:function(x){return -Math.exp(-x);},ex:"−e^(−x)",x0:-1,x1:4,y0:-5,y1:3},
      d:{lab:"1/x (x &gt; 0)",F:function(x){return Math.log(x);},ex:"ln x",x0:0,x1:6,y0:-4,y1:4}
    };
    var sel=k.select("Fonction f",[["a","2x + 1"],["b","cos x"],["c","e^(−x)"],["d","1/x (x > 0)"]],"a");
    var ro=k.readouts(["Point A","Primitive G","Constante C","F(x) complète"]);
    var pt={x:1,y:1}, ax=null, nt=k.note("Clique dans le graphique pour déplacer A.","ok");
    k.button("Placer A en (0 ; 0)",function(){ pt.x=sel.value==="d"?1:0; pt.y=0; });
    k.draw(function(){
      c.clear(); var P=S.draw.palette, d=D[sel.value];
      ax=S.draw.axes(c,{x0:d.x0,x1:d.x1,y0:d.y0,y1:d.y1,xl:"x",yl:"y"});
      if(sel.value==="d"&&pt.x<=0.05) pt.x=0.05;
      pt.x=Math.max(d.x0+(sel.value==="d"?0.05:0),Math.min(d.x1,pt.x)); pt.y=Math.max(d.y0,Math.min(d.y1,pt.y));
      for(var j=-8;j<=8;j++){ S.draw.fn(c,ax,function(x){return d.F(x)+j;},"#c9d2e8",1.3); }
      var C=pt.y-d.F(pt.x);
      S.draw.fn(c,ax,function(x){return d.F(x)+C;},P.acc,3.4);
      S.draw.dot(c,ax.X(pt.x),ax.Y(pt.y),7,P.red);
      S.draw.text(c,"A",ax.X(pt.x)+12,ax.Y(pt.y)-12,{color:P.red});
      var sg=C<0?" − ":" + ", Cs=S.fmt(Math.abs(C),2);
      ro.set(0,"("+S.fmt(pt.x,2)+" ; "+S.fmt(pt.y,2)+")"); ro.set(1,d.ex); ro.set(2,S.fmt(C,3));
      ro.set(3,"F(x) = "+d.ex+(Math.abs(C)<0.005?"":sg+Cs));
      nt.set("Vérification : G(x₀) + C = "+S.fmt(d.F(pt.x),3)+" "+(C<0?"−":"+")+" "+S.fmt(Math.abs(C),3)+" = "+S.fmt(d.F(pt.x)+C,3)+" = y₀ ✓","ok");
    });
    c.pointer(function(type,p){ if((type==="down"||type==="drag")&&ax){ var d=D[sel.value]; pt.x=Math.round(ax.ix(p.x)*10)/10; pt.y=Math.round(ax.iy(p.y)*10)/10; if(sel.value==="d"&&pt.x<0.1) pt.x=0.1; pt.x=Math.max(d.x0,Math.min(d.x1,pt.x)); pt.y=Math.max(d.y0,Math.min(d.y1,pt.y)); k.redraw(); } });
  }
});

SFA.sim({
  id:"m6-c03-vitesse-trajet", ch:"c03", tag:"Niche utile",
  titre:"Du compteur de vitesse à la distance parcourue",
  resume:"La distance parcourue est la primitive de la vitesse : anime le trajet et lis l'aire sous v(t).",
  but:"Choisis un profil de vitesse et lance le trajet. L'aire colorée sous v(t) est la distance parcourue. Défi : arrête le temps quand la voiture a parcouru 100 m.",
  aRetenir:"Position s(t) = primitive de la vitesse v(t) : s'(t) = v(t), et la distance entre t₁ et t₂ est s(t₂) − s(t₁) = aire sous la courbe de v. La vitesse est elle-même la dérivée de la position.",
  piege:"Un compteur de vitesse qui n'affiche jamais de valeur négative cache le sens du déplacement : ici v ≥ 0 donc la distance parcourue égale le déplacement. Avec une vitesse algébrique, les deux peuvent différer.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.64});
    var prof=k.select("Profil de vitesse",[["p1","Démarrage puis arrêt : v = 0,04·t·(30 − t)"],["p2","Vitesse constante puis freinage"],["p3","Trafic fluide : v = 8 + 4·sin(2πt/30)"]],"p1");
    var t=k.slider("Temps t",0,30,0.1,0,"s",null);
    var ro=k.readouts(["v(t)","Distance s(t)","Distance totale à 30 s","Reste à 100 m"]);
    var nt=k.note("","warn");
    var run=k.loop(function(dt){ var v=t.value+dt*3; if(v>=30){ v=30; run.pause(); } t.set(Math.round(v*10)/10); k.redraw(); });
    k.button("Lancer / pause",function(){ if(run.running) run.pause(); else { if(t.value>=30) t.set(0); run.play(); } },true);
    function v(tt){ var p=prof.value; if(p==="p1") return 0.04*tt*(30-tt); if(p==="p2") return tt<=15?10:10-(tt-15)*10/15; return 8+4*Math.sin(2*Math.PI*tt/30); }
    function s(tt){ var n=Math.max(1,Math.round(tt/0.02)), h=tt/n, a=0; for(var i=0;i<n;i++){ a+=(v(i*h)+v((i+1)*h))/2*h; } return a; }
    k.draw(function(){
      c.clear(); var P=S.draw.palette, T=t.value, ctx=c.ctx;
      var ax=S.draw.axes(c,{x0:0,x1:30,y0:0,y1:14,xl:"t (s)",yl:"v (m/s)",stepX:5,stepY:2});
      ctx.save(); ctx.beginPath(); ctx.moveTo(ax.X(0),ax.Y(0));
      for(var i=0;i<=120;i++){ var tt=T*i/120; ctx.lineTo(ax.X(tt),ax.Y(v(tt))); }
      ctx.lineTo(ax.X(T),ax.Y(0)); ctx.closePath(); ctx.fillStyle="rgba(30,63,143,.18)"; ctx.fill(); ctx.restore();
      S.draw.fn(c,ax,v,P.acc,3);
      S.draw.line(c,ax.X(T),ax.Y(0),ax.X(T),ax.Y(v(T)),P.red,1.6);
      S.draw.dot(c,ax.X(T),ax.Y(v(T)),6,P.red);
      var st=s(T), tot=s(30);
      // petite voiture sur la piste du bas
      var tw=tot>0?st/tot:0, cx=ax.L+20+(ax.R-ax.L-60)*tw;
      ctx.fillStyle=P.amber; ctx.fillRect(cx,ax.B-22,34,14); ctx.fillStyle=P.ink; ctx.fillRect(cx+4,ax.B-27,18,6);
      S.draw.dot(c,cx+8,ax.B-8,4,P.ink); S.draw.dot(c,cx+26,ax.B-8,4,P.ink);
      ro.set(0,S.fmt(v(T),2)+" m/s"); ro.set(1,S.fmt(st,1)+" m"); ro.set(2,S.fmt(tot,0)+" m"); ro.set(3,tot>=100?S.fmt(100-st,1)+" m":"100 m non atteints");
      if(tot<100) nt.set("Avec ce profil, la voiture ne parcourt que "+S.fmt(tot,0)+" m.","warn");
      else if(Math.abs(st-100)<1) nt.set("Tu y es : s(t) ≈ 100 m à t ≈ "+S.fmt(T,1)+" s.","ok");
      else nt.set("Défi : arrête t quand s(t) = 100 m (à 1 m près).","warn");
    });
  }
});
