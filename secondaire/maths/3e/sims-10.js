/* Chapitre 10 : trigonométrie du triangle rectangle */
SFA.sim({
  id:"m3-c10-rapports", ch:"c10", tag:"Sinus, cosinus, tangente", titre:"Le rapport ne dépend que de l'angle",
  resume:"Change l'angle et la taille du triangle : sin, cos et tan restent les mêmes quand seule la taille change.",
  but:"Fais varier l'angle α : les rapports changent. Fais varier la taille : ils ne bougent pas.",
  aRetenir:"sin α = opposé ÷ hypoténuse ; cos α = adjacent ÷ hypoténuse ; tan α = opposé ÷ adjacent. Ces rapports ne dépendent que de α.",
  piege:"« Opposé » et « adjacent » dépendent de l'angle choisi : si tu changes d'angle, les rôles s'échangent. Et sin, cos ne dépassent jamais 1.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.78}), P=S.draw.palette;
    var al=k.slider("Angle α",5,85,1,35,"°"), sz=k.slider("Taille de l'hypoténuse",3,10,0.5,6,"");
    var gh=k.toggle("Montrer un triangle plus petit (même angle)",true);
    var ro=k.readouts(["Opposé","Adjacent","Hypoténuse","sin α","cos α","tan α"]);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, A=al.value*Math.PI/180, H=sz.value, O=H*Math.sin(A), J=H*Math.cos(A);
      var sc=Math.min((c.W-70)/10,(c.H-70)/10), ox=28, oy=c.H-30;
      function Tr(x,y){ return [ox+x*sc, oy-y*sc]; }
      function tri(h,col,fill,lw){ var a=Tr(0,0), b=Tr(h*Math.cos(A),0), cc=Tr(h*Math.cos(A),h*Math.sin(A)); ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.lineTo(cc[0],cc[1]); ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.stroke(); var s=Math.min(11,Math.abs(b[0]-a[0])*0.2); ctx.strokeStyle=col; ctx.lineWidth=1.2; ctx.strokeRect(b[0]-s*(b[0]>a[0]?1:0),b[1]-s,s,s); }
      if(gh.value) tri(H*0.55,P.grey,"rgba(138,149,163,.12)",1.8);
      tri(H,P.acc,"rgba(30,63,143,.12)",2.6);
      var a=Tr(0,0), b=Tr(J,0), cc=Tr(J,O);
      ctx.beginPath(); ctx.arc(a[0],a[1],26,0,-A,true); ctx.strokeStyle=P.red; ctx.lineWidth=2.5; ctx.stroke(); S.draw.text(c,"α",a[0]+40*Math.cos(A/2),a[1]-40*Math.sin(A/2),{size:14,color:P.red});
      S.draw.text(c,"adjacent",(a[0]+b[0])/2,a[1]+14,{size:12,color:P.green}); S.draw.text(c,"opposé",b[0]+(b[0]<c.W-60?34:-34),(b[1]+cc[1])/2,{size:12,color:P.amber});
      S.draw.text(c,"hypoténuse",(a[0]+cc[0])/2-6,(a[1]+cc[1])/2-16,{size:12,color:P.acc,align:"right"});
      ro.set(0,S.fmt(O,2)); ro.set(1,S.fmt(J,2)); ro.set(2,S.fmt(H,1)); ro.set(3,S.fmt(O/H,3)); ro.set(4,S.fmt(J/H,3)); ro.set(5,S.fmt(O/J,3));
    });
  }
});
SFA.sim({
  id:"m3-c10-clinometre", ch:"c10", tag:"Mesure", titre:"Le clinomètre : vise le sommet et calcule la hauteur",
  resume:"Place-toi à une distance connue, vise le sommet, lis l'angle : hauteur = distance × tan α + hauteur des yeux.",
  but:"Choisis une cible, ta distance, puis règle l'angle jusqu'à ce que le rayon touche le sommet.",
  aRetenir:"Dans le triangle rectangle formé par ton œil, le pied et le sommet : tan α = (hauteur au-dessus des yeux) ÷ distance. Donc H = d × tan α + hauteur des yeux.",
  piege:"N'oublie pas d'ajouter la hauteur de tes yeux (ici 1,6 m) : le triangle commence à la hauteur de l'œil, pas au sol.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.6}), P=S.draw.palette;
    var tg=k.select("Cible",[[12,"Arbre (hauteur cachée)"],[24,"Clocher"],[36,"Tour"]],12);
    var d=k.slider("Distance d",10,50,5,30,"m"), al=k.slider("Angle de visée α",5,80,1,20,"°");
    var ro=k.readouts(["Hauteur au-dessus des yeux","Hauteur estimée H","Résultat"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, HT=+tg.value, D=d.value, A=al.value*Math.PI/180, eye=1.6;
      var sc=Math.min((c.W-50)/(D+4),(c.H-50)/(Math.max(HT,D*Math.tan(A)+eye)+2)), ox=22, oy=c.H-24;
      S.draw.line(c,ox-10,oy,c.W-8,oy,P.grey,2);
      var tx=ox+D*sc;
      ctx.fillStyle="#7a5c3a"; ctx.fillRect(tx-5,oy-HT*sc,10,HT*sc); S.draw.dot(c,tx,oy-HT*sc,5,P.green);
      ctx.fillStyle=P.ink; ctx.fillRect(ox-3,oy-eye*sc,6,eye*sc);
      var ex=ox, ey=oy-eye*sc, hit=D*Math.tan(A)+eye;
      S.draw.line(c,ex,ey,tx,oy-hit*sc,P.red,2.5);
      S.draw.line(c,ex,ey,tx,ey,P.grey,1.5,[5,4]);
      S.draw.dot(c,tx,oy-hit*sc,5,P.red);
      ctx.beginPath(); ctx.arc(ex,ey,30,0,-A,true); ctx.strokeStyle=P.red; ctx.lineWidth=2; ctx.stroke(); S.draw.text(c,S.fmt(al.value,0)+"°",ex+46,ey-10,{size:12,color:P.red});
      var tol=D*(Math.tan(A+0.00873)-Math.tan(A-0.00873))/2+0.15, ok=Math.abs(hit-HT)<=tol;
      ro.set(0,S.fmt(D,0)+" × tan "+S.fmt(al.value,0)+"° = "+S.fmt(D*Math.tan(A),2)+" m"); ro.set(1,S.fmt(D*Math.tan(A),2)+" + 1,6 = "+S.fmt(hit,2)+" m"); ro.set(2,ok?"sommet atteint ✓":(hit<HT?"trop bas":"trop haut"));
      nt.set(ok?"Le rayon touche le sommet : la hauteur est H ≈ "+S.fmt(hit,1)+" m (la vraie hauteur est de "+S.fmt(HT,0)+" m : l'écart vient de l'angle arrondi au degré).":(hit<HT?"Le rayon passe sous le sommet : augmente l'angle.":"Le rayon passe au-dessus du sommet : diminue l'angle."),ok?"ok":"warn");
    });
  }
});
SFA.sim({
  id:"m3-c10-cercle", ch:"c10", tag:"Cercle de rayon 1", titre:"Dans le cercle de rayon 1 : sin et cos sont des coordonnées",
  resume:"Un rayon tourne : sa hauteur est sin α, sa projection horizontale cos α, et tan α se lit sur la tangente.",
  but:"Fais tourner le rayon ou lance l'animation. Compare sin² + cos² avec 1.",
  aRetenir:"Dans un cercle de rayon 1, le point du cercle a pour coordonnées (cos α ; sin α). Comme le rayon est 1, Pythagore donne sin² α + cos² α = 1.",
  piege:"sin α et cos α ne dépassent jamais 1 (ce sont des coordonnées sur un cercle de rayon 1), alors que tan α peut devenir très grand quand α approche 90°.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85}), P=S.draw.palette;
    var al=k.slider("Angle α",0,89,1,40,"°");
    var lp=k.loop(function(dt){ var v=al.value+dt*20; if(v>=89){ v=0; } al.set(Math.round(v*10)/10); k.redraw(); });
    k.button("Animer / pause",function(){ if(lp.running) lp.pause(); else lp.play(); },true);
    var ro=k.readouts(["cos α","sin α","tan α","sin² + cos²"]);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, A=al.value*Math.PI/180, R=Math.min(c.W-70,c.H-60)*0.8, ox=34, oy=c.H-30;
      ctx.strokeStyle=P.light; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(ox,oy,R,0,-Math.PI/2,true); ctx.stroke();
      S.draw.line(c,ox-8,oy,ox+R*1.35,oy,P.grey,1.5); S.draw.line(c,ox,oy+8,ox,oy-R*1.1,P.grey,1.5);
      var px=ox+R*Math.cos(A), py=oy-R*Math.sin(A);
      S.draw.line(c,ox,oy,px,py,P.ink,2.5);
      S.draw.line(c,ox,oy,px,oy,P.green,4); S.draw.line(c,px,oy,px,py,P.amber,4);
      S.draw.line(c,ox+R,oy,ox+R,oy-Math.min(R*Math.tan(A),R*1.0),P.violet,3,[6,3]);
      if(Math.tan(A)<=1.05) S.draw.line(c,px,py,ox+R,oy-R*Math.tan(A),P.violet,1.5,[3,3]);
      S.draw.dot(c,px,py,6,P.red);
      ctx.beginPath(); ctx.arc(ox,oy,24,0,-A,true); ctx.strokeStyle=P.red; ctx.lineWidth=2; ctx.stroke();
      S.draw.text(c,"cos",ox+(px-ox)/2,oy+14,{size:12,color:P.green}); S.draw.text(c,"sin",px+(px>ox+R*0.8?-18:16),(py+oy)/2,{size:12,color:P.amber});
      var t=Math.tan(A);
      ro.set(0,S.fmt(Math.cos(A),3)); ro.set(1,S.fmt(Math.sin(A),3)); ro.set(2,S.fmt(t,3)); ro.set(3,S.fmt(Math.cos(A)*Math.cos(A)+Math.sin(A)*Math.sin(A),3));
    });
  }
});
SFA.sim({
  id:"m3-c10-pente", ch:"c10", tag:"Pente d'une route", titre:"Pente en % et angle en degrés : pas la même chose",
  resume:"Une route à 10 % monte de 10 m pour 100 m en horizontal. Quel angle cela fait-il ?",
  but:"Règle la pente en pourcentage. Compare avec l'angle et le dénivelé sur 1 km. Que vaut 100 % ?",
  aRetenir:"pente (%) = dénivelé ÷ distance horizontale × 100 = tan α × 100. Donc α = arctan(pente ÷ 100). 10 % correspond à environ 5,7°.",
  piege:"100 % n'est pas la verticale : c'est une montée de 100 m pour 100 m en horizontal, soit 45°. La verticale (90°) n'a pas de pente en pourcentage.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.5}), P=S.draw.palette;
    var pc=k.slider("Pente",0,100,1,10,"%");
    var ro=k.readouts(["Angle α","Dénivelé sur 100 m horizontaux","Dénivelé sur 1 km horizontal","Longueur réelle de route (1 km horizontal)"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, p=pc.value/100, A=Math.atan(p), deg=A*180/Math.PI;
      var ox=22, oy=c.H-26, W=c.W-50, H=c.H-50, sc=Math.min(W,H/Math.max(p,0.001)/1);
      var run=W, rise=Math.min(H,W*p);
      var rx=run; if(W*p>H) rx=H/p;
      S.draw.line(c,ox,oy,ox+rx,oy,P.grey,2);
      S.draw.line(c,ox+rx,oy,ox+rx,oy-rx*p,P.amber,3,[6,3]);
      S.draw.line(c,ox,oy,ox+rx,oy-rx*p,P.red,4);
      ctx.beginPath(); ctx.arc(ox,oy,34,0,-A,true); ctx.strokeStyle=P.red; ctx.lineWidth=2; ctx.stroke();
      S.draw.text(c,S.fmt(deg,1)+"°",ox+50,oy+12,{size:13,color:P.red});
      S.draw.text(c,"100 m",ox+rx/2,oy+14,{size:12,color:P.grey});
      S.draw.text(c,S.fmt(100*p,1)+" m",ox+rx+(rx>c.W-90?-30:26),oy-rx*p/2,{size:12,color:P.amber});
      ro.set(0,S.fmt(deg,1)+"°"); ro.set(1,S.fmt(100*p,1)+" m"); ro.set(2,S.fmt(1000*p,0)+" m"); ro.set(3,S.fmt(1000*Math.sqrt(1+p*p),0)+" m");
      nt.set(pc.value===100?"100 % = 45° : on monte autant qu'on avance. Ce n'est pas la verticale !":pc.value>=10&&pc.value<=12?"Pente de col typique : "+pc.value+" %, soit seulement "+S.fmt(deg,1)+"°.":"Une pente de "+pc.value+" % correspond à "+S.fmt(deg,1)+"° : l'angle est beaucoup plus petit que le pourcentage.","");
    });
  }
});
