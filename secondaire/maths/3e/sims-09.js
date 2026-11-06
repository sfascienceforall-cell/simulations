/* Chapitre 9 : Thalès, rapports et similitude */
SFA.sim({
  id:"m3-c09-thales", ch:"c09", tag:"Thalès", titre:"La parallèle glissante : les rapports restent égaux",
  resume:"Fais glisser DE parallèlement à BC et compare AD/AB, AE/AC et DE/BC.",
  but:"Déplace D. Puis « casse » le parallélisme avec le second curseur et regarde ce que deviennent les rapports.",
  aRetenir:"Si (DE) // (BC) : AD/AB = AE/AC = DE/BC. Les rapports des segments correspondants sont égaux.",
  piege:"Thalès ne marche que si les droites sont parallèles. Et il faut mettre en rapport des segments qui se correspondent : AD avec AB (pas avec DB).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85}), P=S.draw.palette;
    var ab=k.slider("AB (cm)",6,12,1,10,""), ac=k.slider("AC (cm)",5,11,1,8,"");
    var t=k.slider("Position de D : AD ÷ AB",0.1,0.9,0.1,0.4,""), sh=k.slider("Décalage de E (0 = parallèle)",-0.3,0.3,0.1,0,"");
    var ro=k.readouts(["AD ÷ AB","AE ÷ AC","DE ÷ BC","Droites"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, AB=ab.value, AC=ac.value, T=t.value, SH=sh.value, ang=Math.PI/3;
      var A=[0,0], B=[AB,0], C=[AC*Math.cos(ang),AC*Math.sin(ang)];
      var D=[T*AB,0], te=Math.max(0.02,Math.min(1,T+SH)), E=[te*C[0],te*C[1]];
      var xs=[A[0],B[0],C[0]], ys=[A[1],B[1],C[1]], sc=Math.min((c.W-60)/(Math.max.apply(null,xs)-Math.min.apply(null,xs)),(c.H-70)/(Math.max.apply(null,ys)));
      var ox=30-Math.min.apply(null,xs)*sc, oy=c.H-34;
      function Tr(p){ return [ox+p[0]*sc, oy-p[1]*sc]; }
      var a=Tr(A),b=Tr(B),cc=Tr(C),d=Tr(D),e=Tr(E);
      ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.lineTo(cc[0],cc[1]); ctx.closePath(); ctx.fillStyle="rgba(30,63,143,.06)"; ctx.fill(); ctx.strokeStyle=P.ink; ctx.lineWidth=2.4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(d[0],d[1]); ctx.lineTo(e[0],e[1]); ctx.closePath(); ctx.fillStyle="rgba(180,35,24,.12)"; ctx.fill();
      S.draw.line(c,d[0],d[1],e[0],e[1],Math.abs(SH)<1e-9?P.green:P.red,3.5);
      [["A",a,0,-14],["B",b,10,12],["C",cc,10,-6],["D",d,0,14],["E",e,-12,-4]].forEach(function(q){ S.draw.dot(c,q[1][0],q[1][1],4,P.ink); S.draw.text(c,q[0],q[1][0]+q[2],q[1][1]+q[3],{size:14}); });
      var AD=T*AB, AE=te*AC, DE=Math.hypot(D[0]-E[0],D[1]-E[1]), BC=Math.hypot(B[0]-C[0],B[1]-C[1]);
      ro.set(0,S.fmt(AD,2)+" ÷ "+S.fmt(AB,0)+" = "+S.fmt(AD/AB,3)); ro.set(1,S.fmt(AE,2)+" ÷ "+S.fmt(AC,0)+" = "+S.fmt(AE/AC,3)); ro.set(2,S.fmt(DE,2)+" ÷ "+S.fmt(BC,2)+" = "+S.fmt(DE/BC,3));
      var par=Math.abs(SH)<1e-9; ro.set(3,par?"(DE) // (BC)":"non parallèles");
      nt.set(par?"Les trois rapports sont égaux : Thalès fonctionne.":"(DE) n'est plus parallèle à (BC) : les rapports ne sont plus égaux, Thalès ne s'applique pas.",par?"ok":"warn");
    });
  }
});
SFA.sim({
  id:"m3-c09-ombre", ch:"c09", tag:"Mesure indirecte", titre:"La hauteur d'un arbre grâce aux ombres",
  resume:"Un bâton et un arbre, deux ombres : la hauteur de l'arbre se calcule avec une proportion.",
  but:"Fais glisser le soleil (ou le curseur) : les ombres changent, mais pas la hauteur calculée. Active l'arrondi pour voir l'effet d'une mesure imprécise.",
  aRetenir:"Le bâton et l'arbre forment avec leurs ombres deux triangles semblables : hauteur de l'arbre ÷ hauteur du bâton = ombre de l'arbre ÷ ombre du bâton.",
  piege:"Il faut mesurer les deux ombres en même temps (même position du soleil). Et plus l'ombre du bâton est courte, plus une petite erreur de mesure fausse la hauteur.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.66}), P=S.draw.palette, T=S.draw.tint;
    var hb=k.slider("Hauteur du bâton",1,2,0.5,1.5,"m"), ha=k.slider("Hauteur de l'arbre (inconnue)",5,25,1,12,"m"), so=k.slider("Hauteur du soleil",20,75,5,40,"°");
    var rd=k.toggle("Mesurer les ombres au décimètre près",false);
    var ro=k.readouts(["Ombre du bâton","Ombre de l'arbre","Hauteur calculée"]); var nt=k.note(""); var geo={};
    M3.drag(c,function(){ return [{id:"s",x:geo.sx||30,y:geo.sy||40,r:9999}]; },function(id,p){ var f=(geo.gy-20-p.y)/(geo.gy-60); so.set(M3.snap(20+f*55,5,20,75)); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx=c.ctx, HB=hb.value, HA=ha.value, th=so.value*Math.PI/180, fs=M3.sz(c,13);
      var sb=HB/Math.tan(th), sa=HA/Math.tan(th), mb=rd.value?Math.round(sb*10)/10:sb, ma=rd.value?Math.round(sa*10)/10:sa, calc=HB*ma/mb;
      var gy=c.H-34, sc=Math.min((c.W-130)/(sa+sb+5),(gy-60)/Math.max(HA,10)), xt=96, xb=xt+sc*(sa+2.5);
      /* ciel et sol */
      var g=ctx.createLinearGradient(0,0,0,gy); g.addColorStop(0,"#dbeafe"); g.addColorStop(1,"#f7fbff"); ctx.fillStyle=g; ctx.fillRect(0,0,c.W,gy);
      ctx.fillStyle="#cfe3c6"; ctx.fillRect(0,gy,c.W,c.H-gy); S.draw.line(c,0,gy,c.W,gy,"#8fb085",2);
      /* soleil */
      var sy=gy-20-(so.value-20)/55*(gy-60), sx=30; geo.sx=sx; geo.sy=sy; geo.gy=gy;
      S.draw.glow(c,sx,sy,44,P.yellow,0.7); S.draw.dot(c,sx,sy,13,P.yellow); M3.handle(c,sx,sy,P.amber,false,6);
      S.draw.text(c,S.fmt(so.value,0)+"°",sx+30,sy+22,{size:fs,color:P.amber});
      /* ombres */
      ctx.fillStyle="rgba(40,55,70,.35)"; ctx.fillRect(xt,gy-3,sa*sc,6); ctx.fillRect(xb,gy-3,sb*sc,6);
      /* triangles semblables */
      ctx.beginPath(); ctx.moveTo(xt,gy-HA*sc); ctx.lineTo(xt,gy); ctx.lineTo(xt+sa*sc,gy); ctx.closePath(); ctx.fillStyle=T(P.green,0.14); ctx.fill();
      ctx.beginPath(); ctx.moveTo(xb,gy-HB*sc); ctx.lineTo(xb,gy); ctx.lineTo(xb+sb*sc,gy); ctx.closePath(); ctx.fillStyle=T(P.amber,0.22); ctx.fill();
      S.draw.line(c,xt,gy-HA*sc,xt+sa*sc,gy,P.amber,2,[5,4]); S.draw.line(c,xb,gy-HB*sc,xb+sb*sc,gy,P.amber,2,[5,4]);
      /* arbre et bâton */
      ctx.fillStyle="#7a5c3a"; ctx.fillRect(xt-4,gy-HA*sc*0.6,8,HA*sc*0.6);
      ctx.beginPath(); ctx.arc(xt,gy-HA*sc*0.72,Math.min(34,Math.max(12,HA*sc*0.2)),0,7); ctx.fillStyle="#3f8f68"; ctx.fill();
      ctx.beginPath(); ctx.arc(xt,gy-HA*sc,4,0,7); ctx.fillStyle=P.red; ctx.fill();
      ctx.fillStyle=P.amber; ctx.fillRect(xb-2.5,gy-HB*sc,5,HB*sc);
      M3.dim(c,xt-18,gy-HA*sc,xt-18,gy,"?",P.green); M3.dim(c,xb-14,gy-HB*sc,xb-14,gy,S.fmt(HB,1)+" m",P.amber);
      S.draw.label(c,S.fmt(ma,2)+" m",xt+sa*sc/2,gy+18,{color:"#3b4a5a",size:fs-1}); S.draw.label(c,S.fmt(mb,2)+" m",xb+Math.max(sb*sc/2,16),gy+18,{color:"#3b4a5a",size:fs-1});
      S.draw.label(c,"arbre ÷ "+S.fmt(HB,1)+" = "+S.fmt(ma,2)+" ÷ "+S.fmt(mb,2),c.W-14,18,{color:P.acc,size:fs,align:"right"});
      ro.set(0,S.fmt(mb,2)+" m"); ro.set(1,S.fmt(ma,2)+" m"); ro.set(2,S.fmt(HB,1)+" × "+S.fmt(ma,2)+" ÷ "+S.fmt(mb,2)+" = "+S.fmt(calc,2)+" m");
      nt.set(rd.value?(Math.abs(calc-HA)<0.005?"Même avec l'arrondi, le résultat est juste ici.":"Avec l'arrondi des ombres, on obtient "+S.fmt(calc,2)+" m au lieu de "+S.fmt(HA,0)+" m : l'erreur vient des mesures."):"Les deux triangles sont semblables : "+S.fmt(calc,2)+" m = hauteur de l'arbre, quelle que soit la hauteur du soleil.",rd.value&&Math.abs(calc-HA)>0.005?"warn":"ok");
    });
  }
});
SFA.sim({
  id:"m3-c09-echelle", ch:"c09", tag:"Facteur d'échelle", titre:"Agrandir ou réduire : k pour les longueurs, k² pour les aires",
  resume:"Quand les longueurs sont multipliées par k, le périmètre est multiplié par k, mais l'aire par k².",
  but:"Fais glisser le coin de l'image (ou le curseur) pour changer k. Compte combien de copies de la figure de départ recouvrent l'image. Essaie les boutons A4 → A3 et A3 → A4.",
  aRetenir:"Rapport k de similitude : longueurs et périmètres × k ; aires × k². Pour doubler l'aire, il faut multiplier les longueurs par √2 ≈ 1,414 (141 %).",
  piege:"Agrandir à 200 % ne double pas l'aire : elle est multipliée par 4. Un agrandissement de 141 % double l'aire (A4 → A3).",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.7}), P=S.draw.palette, T=S.draw.tint;
    var kk=k.slider("Rapport k",0.5,3,0.1,2,"");
    k.button("A4 → A3 (141 %)",function(){ kk.set(1.4); });
    k.button("A3 → A4 (71 %)",function(){ kk.set(0.7); });
    k.button("200 %",function(){ kk.set(2); });
    var ro=k.readouts(["Périmètre","Aire","Rapport des aires"]); var nt=k.note(""); var geo={};
    M3.drag(c,function(){ return geo.h?[geo.h]:[]; },function(id,p){ kk.set(M3.snap((p.x-geo.X2)/(3*geo.u),0.1,0.5,3)); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx=c.ctx, K=kk.value, w=3, h=2, fs=M3.sz(c,13);
      var u=Math.min((c.W-50)/(w+w*3+1),(c.H-70)/(h*3)), ox=18, oy=c.H-28, X2=ox+w*u+u, ww=w*K*u, hh=h*K*u; geo.u=u; geo.X2=X2;
      S.draw.rrect(c,ox,oy-h*u,w*u,h*u,3); ctx.fillStyle=T(P.acc,0.28); ctx.fill();
      ctx.strokeStyle="#fff"; ctx.lineWidth=1; for(var i=1;i<w;i++){ ctx.beginPath(); ctx.moveTo(ox+i*u,oy-h*u); ctx.lineTo(ox+i*u,oy); ctx.stroke(); } for(var j=1;j<h;j++){ ctx.beginPath(); ctx.moveTo(ox,oy-j*u); ctx.lineTo(ox+w*u,oy-j*u); ctx.stroke(); }
      ctx.strokeStyle=P.acc; ctx.lineWidth=2.6; ctx.strokeRect(ox,oy-h*u,w*u,h*u);
      /* image : k² copies de la figure de départ, teintes alternées */
      ctx.save(); ctx.beginPath(); ctx.rect(X2,oy-hh,ww,hh); ctx.clip();
      for(var a=0;a<Math.ceil(K);a++) for(var b=0;b<Math.ceil(K);b++){ ctx.fillStyle=T((a+b)%2?P.red:P.orange,0.3); ctx.fillRect(X2+a*w*u,oy-(b+1)*h*u,w*u,h*u); ctx.strokeStyle="#fff"; ctx.lineWidth=2; ctx.strokeRect(X2+a*w*u,oy-(b+1)*h*u,w*u,h*u); }
      ctx.restore(); ctx.strokeStyle=P.red; ctx.lineWidth=2.6; ctx.strokeRect(X2,oy-hh,ww,hh);
      S.draw.text(c,"k² = "+S.fmt(K*K,2)+" copies",X2+ww/2,oy-hh/2,{size:Math.max(fs,Math.min(20,ww/7)),color:P.red,bg:"rgba(255,255,255,.8)"});
      geo.h={id:"k",x:X2+ww,y:oy-hh,r:30}; M3.handle(c,X2+ww,oy-hh,P.red,false,8);
      S.draw.label(c,"départ",ox+w*u/2,oy-h*u-16,{color:P.acc,size:fs}); S.draw.label(c,"image (× "+S.fmt(K,1)+")",X2+ww/2,Math.max(16,oy-hh-18),{color:P.red,size:fs});
      var per=2*(w+h)*K;
      ro.set(0,S.fmt(2*(w+h),0)+" → "+S.fmt(per,1)+"  (×"+S.fmt(K,1)+")"); ro.set(1,S.fmt(w*h,0)+" → "+S.fmt(w*h*K*K,2)+"  (×"+S.fmt(K*K,2)+")"); ro.set(2,"k² = "+S.fmt(K,1)+"² = "+S.fmt(K*K,2));
      nt.set(Math.abs(K*K-2)<0.1?"Quasi doublement de l'aire : k ≈ √2 ≈ 1,414. C'est le passage A4 → A3.":Math.abs(K*K-0.5)<0.05?"Aire divisée par 2 : réduction A3 → A4 (k ≈ 0,707).":"Longueurs ×"+S.fmt(K,1)+", aire ×"+S.fmt(K*K,2)+".",Math.abs(K*K-2)<0.1||Math.abs(K*K-0.5)<0.05?"ok":"");
    });
  }
});
SFA.sim({
  id:"m3-c09-semblables", ch:"c09", tag:"Cas AA", titre:"Triangles semblables : deux angles suffisent",
  resume:"Deux triangles ayant les mêmes angles ont leurs côtés proportionnels.",
  but:"Règle les angles α et β et le rapport k. Puis modifie un angle du second triangle pour casser la ressemblance.",
  aRetenir:"Deux triangles qui ont deux angles égaux (cas AA) sont semblables : leurs côtés correspondants sont dans le même rapport k, et leurs angles sont égaux.",
  piege:"Semblables ne veut pas dire isométriques : même forme, pas forcément même taille. Les côtés correspondants sont ceux situés face aux angles égaux.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7}), P=S.draw.palette;
    var al=k.slider("Angle α (A)",30,80,5,55,"°"), be=k.slider("Angle β (B)",30,80,5,65,"°"), kk=k.slider("Rapport k",0.5,2,0.1,1.5,"");
    var dl=k.slider("Changer β' du 2e triangle de",-20,20,5,0,"°");
    var ro=k.readouts(["Côté c'/c","Côté a'/a","Côté b'/b","Angles"]); var nt=k.note("");
    function tri(base,A,B){ var C=Math.PI-A-B, ab=base, ac=ab*Math.sin(B)/Math.sin(C), cp=[ac*Math.cos(A),ac*Math.sin(A)]; return {A:[0,0],B:[base,0],C:cp,a:Math.hypot(base-cp[0],cp[1]),b:ac,c:base}; }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, A=al.value*Math.PI/180, B=be.value*Math.PI/180, K=kk.value, D=dl.value, B2=(be.value+D)*Math.PI/180;
      if(A+B>=Math.PI-0.05||A+B2>=Math.PI-0.05){ for(var q=0;q<4;q++) ro.set(q,"—"); nt.set("α + β (ou α + β') atteint 180° : le triangle n'existe plus. Diminue un angle.","warn"); return; }
      var T1=tri(4,A,B), T2=tri(4*K,A,B2);
      var maxX=Math.max(T1.B[0],T2.B[0],T1.C[0],T2.C[0]), maxY=Math.max(T1.C[1],T2.C[1]), sc=Math.min((c.W-60)/maxX,(c.H-60)/maxY), ox=28, oy=c.H-28;
      function Tr(p){ return [ox+p[0]*sc, oy-p[1]*sc]; }
      function draw(T,col,fill){ var a=Tr(T.A),b=Tr(T.B),cc=Tr(T.C); ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.lineTo(cc[0],cc[1]); ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); ctx.strokeStyle=col; ctx.lineWidth=2.6; ctx.stroke(); }
      draw(T2,P.red,"rgba(180,35,24,.08)"); draw(T1,P.acc,"rgba(30,63,143,.2)");
      var a=Tr([0,0]); S.draw.text(c,"A",a[0]-12,a[1]+12,{size:13}); var b=Tr(T1.B); S.draw.text(c,"B",b[0]+4,b[1]+14,{size:13,color:P.acc}); var b2=Tr(T2.B); S.draw.text(c,"B'",b2[0]+4,b2[1]+14,{size:13,color:P.red});
      ro.set(0,S.fmt(T2.c/T1.c,2)); ro.set(1,S.fmt(T2.a/T1.a,2)); ro.set(2,S.fmt(T2.b/T1.b,2));
      var simil=D===0;
      ro.set(3,simil?"A, B égaux : "+S.fmt(180-al.value-be.value,0)+"° pour C aussi":"β ≠ β' : "+be.value+"° et "+(be.value+D)+"°");
      nt.set(simil?"Trois rapports égaux à k = "+S.fmt(K,1)+" : les triangles sont semblables.":"Les rapports ne sont plus égaux : les triangles ne sont plus semblables (il leur manque un angle égal).",simil?"ok":"warn");
    });
  }
});
