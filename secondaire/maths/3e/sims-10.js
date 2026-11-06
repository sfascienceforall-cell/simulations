/* Chapitre 10 : trigonométrie du triangle rectangle */
SFA.sim({
  id:"m3-c10-rapports", ch:"c10", tag:"Sinus, cosinus, tangente", titre:"Le rapport ne dépend que de l'angle",
  resume:"Change l'angle et la taille du triangle : sin, cos et tan restent les mêmes quand seule la taille change.",
  but:"Fais glisser le sommet C : l'angle change, les rapports changent. Fais varier la taille seule (curseur) : ils ne bougent pas. Passe de l'angle α à l'angle β pour voir les rôles « opposé » et « adjacent » s'échanger.",
  aRetenir:"sin α = opposé ÷ hypoténuse ; cos α = adjacent ÷ hypoténuse ; tan α = opposé ÷ adjacent. Ces rapports ne dépendent que de α.",
  piege:"« Opposé » et « adjacent » dépendent de l'angle choisi : si tu changes d'angle, les rôles s'échangent. Et sin, cos ne dépassent jamais 1.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:1.05}), P=S.draw.palette, T=S.draw.tint;
    var al=k.slider("Angle α",5,85,1,35,"°"), sz=k.slider("Taille de l'hypoténuse",3,10,0.5,6,"");
    var wh=k.seg("Angle observé",[["a","α (en A)"],["b","β (en C)"]],"a");
    var gh=k.toggle("Montrer des triangles plus petits (même angle)",true);
    var ro=k.readouts(["Opposé","Adjacent","Hypoténuse","sin","cos","tan"]); var geo={};
    M3.drag(c,function(){ return geo.C?[{id:"c",x:geo.C[0],y:geo.C[1],r:34}]:[]; },function(id,p){
      var dx=p.x-geo.o[0], dy=geo.o[1]-p.y; if(dx<1) dx=1; var a=Math.atan2(dy,dx)*180/Math.PI, h=Math.hypot(dx,dy)/geo.sc;
      al.set(M3.snap(a,1,5,85)); sz.set(M3.snap(h,0.5,3,10)); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx=c.ctx, A=al.value*Math.PI/180, H=sz.value, fs=M3.sz(c,13), obs=wh.value;
      var Ad=H*Math.cos(A), Op=H*Math.sin(A);   /* adjacent et opposé à α */
      var sc=Math.min((c.W-140)/10,(c.H-200)/10), ox=74, oy=c.H-128; geo.sc=sc; geo.o=[ox,oy];
      function Tr(x,y){ return [ox+x*sc,oy-y*sc]; }
      function tri(h,col,fill,lw,dash){ var a=Tr(0,0), b=Tr(h*Math.cos(A),0), cc=Tr(h*Math.cos(A),h*Math.sin(A)); ctx.save(); ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.lineTo(cc[0],cc[1]); ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.lineJoin="round"; if(dash) ctx.setLineDash(dash); ctx.stroke(); ctx.restore(); var s=Math.min(11,Math.abs(b[0]-a[0])*0.2); ctx.strokeStyle=col; ctx.lineWidth=1.3; ctx.strokeRect(b[0]-s,b[1]-s,s,s); }
      if(gh.value){ tri(H*0.4,P.grey,"rgba(138,149,163,.10)",1.6,[4,3]); tri(H*0.7,P.grey,"rgba(138,149,163,.10)",1.6,[4,3]); }
      tri(H,P.acc,T(P.acc,0.12),2.8);
      var a=Tr(0,0), b=Tr(Ad,0), cc=Tr(Ad,Op); geo.C=cc;
      var oppN=obs==="a"?"opposé":"adjacent", adjN=obs==="a"?"adjacent":"opposé";
      var cb=obs==="a"?P.amber:P.green, cl=obs==="a"?P.green:P.amber;   /* couleur du côté AB (bas) et BC (vertical) */
      S.draw.line(c,a[0],a[1],b[0],b[1],cl,5); S.draw.line(c,b[0],b[1],cc[0],cc[1],cb,5); S.draw.line(c,a[0],a[1],cc[0],cc[1],P.acc,5);
      S.draw.label(c,adjN,(a[0]+b[0])/2,a[1]+20,{color:cl,size:fs}); S.draw.label(c,oppN,b[0]+(b[0]<c.W-80?42:-42),(b[1]+cc[1])/2,{color:cb,size:fs});
      S.draw.label(c,"hypoténuse",(a[0]+cc[0])/2-8,(a[1]+cc[1])/2-18,{color:P.acc,size:fs,align:"right"});
      /* angle observé */
      var ang=obs==="a"?a:cc;
      ctx.save(); ctx.strokeStyle=P.red; ctx.lineWidth=2.6; ctx.beginPath();
      if(obs==="a") ctx.arc(a[0],a[1],30,0,-A,true); else ctx.arc(cc[0],cc[1],30,Math.PI/2,Math.PI+A,false);
      ctx.stroke(); ctx.restore();
      if(obs==="a") S.draw.text(c,"α",a[0]+46*Math.cos(A/2),a[1]-46*Math.sin(A/2),{size:fs+3,color:P.red,math:true,italic:true}); else S.draw.text(c,"β",cc[0]-8,cc[1]+50,{size:fs+3,color:P.red,math:true,italic:true});
      M3.handle(c,cc[0],cc[1],P.red,false,8);
      /* rapports en barres */
      var O2=obs==="a"?Op:Ad, J2=obs==="a"?Ad:Op, vals=[["sin",O2/H,P.amber],["cos",J2/H,P.green],["tan",O2/J2,P.violet]], by=c.H-84, bw=c.W-120;
      vals.forEach(function(v,i){ var yy=by+i*28; S.draw.text(c,v[0],14,yy+9,{size:fs,color:v[2],align:"left"}); S.draw.rrect(c,54,yy,bw,18,9); ctx.fillStyle="#eef1f5"; ctx.fill();
        var f=Math.min(1,v[1]/(i===2?3:1)); S.draw.rrect(c,54,yy,Math.max(6,bw*f),18,9); ctx.fillStyle=v[2]; ctx.fill();
        S.draw.text(c,S.fmt(v[1],3)+(i===2&&v[1]>3?" (barre coupée)":""),54+bw+8,yy+9,{size:fs,color:P.ink,align:"left",weight:800}); });
      S.draw.text(c,"échelle : sin, cos de 0 à 1 ; tan de 0 à 3",c.W-8,by-10,{size:10.5,color:P.grey,align:"right",weight:600});
      ro.set(0,S.fmt(O2,2)); ro.set(1,S.fmt(J2,2)); ro.set(2,S.fmt(H,1)); ro.set(3,S.fmt(O2/H,3)); ro.set(4,S.fmt(J2/H,3)); ro.set(5,S.fmt(O2/J2,3));
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
    var ro=k.readouts(["cos α","sin α","tan α","sin² + cos²"]); var geo={};
    window.M3.drag(c,function(){ return geo.p?[{id:"p",x:geo.p[0],y:geo.p[1],r:40}]:[]; },function(id,pt){ lp.pause(); al.set(Math.round(Math.max(0,Math.min(89,Math.atan2(geo.o[1]-pt.y,Math.max(1,pt.x-geo.o[0]))*180/Math.PI)))); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx=c.ctx, A=al.value*Math.PI/180, R=Math.min(c.W-70,c.H-60)*0.8, ox=34, oy=c.H-30;
      ctx.strokeStyle=P.light; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(ox,oy,R,0,-Math.PI/2,true); ctx.stroke();
      S.draw.line(c,ox-8,oy,ox+R*1.35,oy,P.grey,1.5); S.draw.line(c,ox,oy+8,ox,oy-R*1.1,P.grey,1.5);
      var px=ox+R*Math.cos(A), py=oy-R*Math.sin(A);
      S.draw.line(c,ox,oy,px,py,P.ink,2.5);
      S.draw.line(c,ox,oy,px,oy,P.green,4); S.draw.line(c,px,oy,px,py,P.amber,4);
      S.draw.line(c,ox+R,oy,ox+R,oy-Math.min(R*Math.tan(A),R*1.0),P.violet,3,[6,3]);
      if(Math.tan(A)<=1.05) S.draw.line(c,px,py,ox+R,oy-R*Math.tan(A),P.violet,1.5,[3,3]);
      geo.p=[px,py]; geo.o=[ox,oy]; window.M3.handle(c,px,py,P.red,false,8);
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
  but:"Fais glisser le bout de la route (ou le curseur, ou un exemple). Compare avec l'angle et le dénivelé sur 1 km. Que vaut 100 % ?",
  aRetenir:"pente (%) = dénivelé ÷ distance horizontale × 100 = tan α × 100. Donc α = arctan(pente ÷ 100). 10 % correspond à environ 5,7°.",
  piege:"100 % n'est pas la verticale : c'est une montée de 100 m pour 100 m en horizontal, soit 45°. La verticale (90°) n'a pas de pente en pourcentage.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.72}), P=S.draw.palette, T=S.draw.tint;
    var pc=k.slider("Pente",0,100,1,10,"%");
    k.button("Rampe d'accès 5 %",function(){ pc.set(5); }); k.button("Route de col 10 %",function(){ pc.set(10); });
    k.button("Mur de Grammont ≈ 20 %",function(){ pc.set(20); }); k.button("45° = 100 %",function(){ pc.set(100); });
    var ro=k.readouts(["Angle α","Dénivelé sur 100 m horizontaux","Dénivelé sur 1 km horizontal","Longueur réelle de route (1 km horizontal)"]); var nt=k.note(""); var geo={};
    M3.drag(c,function(){ return geo.h?[geo.h]:[]; },function(id,p){ pc.set(M3.snap((geo.oy-p.y)/geo.run*100,1,0,100)); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx=c.ctx, p=pc.value/100, A=Math.atan(p), deg=A*180/Math.PI, fs=M3.sz(c,13);
      var ox=26, oy=c.H-34, run=Math.min(c.W-70,(c.H-80)); geo.oy=oy; geo.run=run;
      var g=ctx.createLinearGradient(0,0,0,c.H); g.addColorStop(0,"#dff0fb"); g.addColorStop(1,"#f6fbff"); ctx.fillStyle=g; ctx.fillRect(0,0,c.W,c.H);
      var tx=ox+run, ty=oy-run*p;
      /* terrain */
      ctx.beginPath(); ctx.moveTo(ox,oy); ctx.lineTo(tx,ty); ctx.lineTo(tx,oy+40); ctx.lineTo(ox,oy+40); ctx.closePath(); ctx.fillStyle="#b9d8a8"; ctx.fill();
      /* référence 100 % */
      S.draw.line(c,ox,oy,tx,oy-run,T(P.grey,0.7),1.6,[5,5]); S.draw.text(c,"100 % (45°)",tx-4,oy-run-10,{size:fs-1,color:P.grey,align:"right",weight:600});
      S.draw.line(c,ox,oy,tx,oy,P.grey,2); S.draw.line(c,tx,oy,tx,ty,P.amber,3,[6,4]);
      S.draw.line(c,ox,oy,tx,ty,"#55606f",9); S.draw.line(c,ox,oy,tx,ty,P.red,4);
      ctx.beginPath(); ctx.arc(ox,oy,38,0,-A,true); ctx.strokeStyle=P.red; ctx.lineWidth=2.4; ctx.stroke();
      S.draw.label(c,S.fmt(deg,1)+"°",ox+64,oy-8-Math.min(30,40*Math.sin(A/2)),{color:P.red,size:fs});
      S.draw.label(c,"100 m",ox+run/2,oy+20,{color:P.grey,size:fs}); S.draw.label(c,S.fmt(100*p,1)+" m",tx-(run*p>22?28:0)-4,oy-run*p/2,{color:P.amber,size:fs,align:"right"});
      /* panneau routier */
      var sx=c.W-52, sy=34; ctx.save(); ctx.beginPath(); ctx.moveTo(sx,sy-26); ctx.lineTo(sx+30,sy+24); ctx.lineTo(sx-30,sy+24); ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill(); ctx.lineWidth=5; ctx.strokeStyle=P.red; ctx.lineJoin="round"; ctx.stroke(); ctx.restore();
      S.draw.text(c,S.fmt(pc.value,0)+" %",sx,sy+11,{size:12.5,color:P.ink});
      geo.h={id:"t",x:tx,y:ty,r:34}; M3.handle(c,tx,ty,P.red,false,9);
      ro.set(0,S.fmt(deg,1)+"°"); ro.set(1,S.fmt(100*p,1)+" m"); ro.set(2,S.fmt(1000*p,0)+" m"); ro.set(3,S.fmt(1000*Math.sqrt(1+p*p),0)+" m");
      nt.set(pc.value===100?"100 % = 45° : on monte autant qu'on avance. Ce n'est pas la verticale !":pc.value>=10&&pc.value<=12?"Pente de col typique : "+pc.value+" %, soit seulement "+S.fmt(deg,1)+"°.":"Une pente de "+pc.value+" % correspond à "+S.fmt(deg,1)+"° : l'angle est beaucoup plus petit que le pourcentage.","");
    });
  }
});
