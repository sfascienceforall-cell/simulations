/* Chapitre 8 : Pythagore et irrationnels */
SFA.sim({
  id:"m3-c08-carres", ch:"c08", tag:"Géométrie", titre:"Des carrés sur les côtés : quand a² + b² = c² ?",
  resume:"Fais varier l'angle au sommet C : la somme des deux petits carrés égale le grand carré seulement à 90°.",
  but:"Fixe les côtés a et b, puis fais tourner l'angle en C. Cherche l'angle pour lequel les aires s'égalisent.",
  aRetenir:"Si l'angle en C est droit, l'aire du carré de l'hypoténuse c² est égale à a² + b². Si l'angle est aigu, c² < a² + b² ; s'il est obtus, c² > a² + b².",
  piege:"Pythagore ne s'applique qu'aux triangles rectangles. Et c est l'hypoténuse : le côté opposé à l'angle droit, toujours le plus long.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.95}), P=S.draw.palette;
    var a=k.slider("Côté a",2,6,0.5,3,""), b=k.slider("Côté b",2,6,0.5,4,""), g=k.slider("Angle en C",50,130,1,90,"°");
    var ro=k.readouts(["a² + b²","c²","Différence c² − (a² + b²)","Triangle"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, A=a.value,B=b.value,G=g.value*Math.PI/180;
      var C0=[0,0], Pa=[A,0], Pb=[B*Math.cos(G),B*Math.sin(G)];   /* C, point sur CB (longueur a), point sur CA (longueur b) */
      var cc=Math.sqrt(A*A+B*B-2*A*B*Math.cos(G));
      var pts=[C0,Pa,Pb], gx=(pts[0][0]+pts[1][0]+pts[2][0])/3, gy=(pts[0][1]+pts[1][1]+pts[2][1])/3;
      var sc=Math.min(c.W,c.H)/(Math.max(A,B,cc)*2.9);
      var ox=c.W/2-gx*sc, oy=c.H/2+gy*sc;
      function T(p){ return [ox+p[0]*sc, oy-p[1]*sc]; }
      function sq(p,q,col,label){ var dx=q[0]-p[0], dy=q[1]-p[1], nx=-dy, ny=dx, mid=[(p[0]+q[0])/2,(p[1]+q[1])/2];
        if((mid[0]-gx)*nx+(mid[1]-gy)*ny<0){ nx=-nx; ny=-ny; }
        var q1=[q[0]+nx,q[1]+ny], p1=[p[0]+nx,p[1]+ny], pp=[p,q,q1,p1].map(T);
        ctx.beginPath(); ctx.moveTo(pp[0][0],pp[0][1]); for(var i=1;i<4;i++) ctx.lineTo(pp[i][0],pp[i][1]); ctx.closePath(); ctx.fillStyle=col; ctx.globalAlpha=.55; ctx.fill(); ctx.globalAlpha=1; ctx.strokeStyle=col; ctx.lineWidth=1.5; ctx.stroke();
        var m=T([(p[0]+q1[0])/2,(p[1]+q1[1])/2]); S.draw.text(c,label,m[0],m[1],{size:13,color:"#fff"}); }
      sq(C0,Pa,P.acc,"a²"); sq(C0,Pb,P.green,"b²"); sq(Pa,Pb,P.red,"c²");
      var t=pts.map(T); ctx.beginPath(); ctx.moveTo(t[0][0],t[0][1]); ctx.lineTo(t[1][0],t[1][1]); ctx.lineTo(t[2][0],t[2][1]); ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill(); ctx.strokeStyle=P.ink; ctx.lineWidth=2.4; ctx.stroke();
      S.draw.text(c,"C",t[0][0]-(t[1][0]>t[0][0]?10:-10)-0,t[0][1]+12,{size:13});
      var d=cc*cc-(A*A+B*B), right=Math.abs(g.value-90)<0.5;
      ro.set(0,S.fmt(A*A+B*B,2)); ro.set(1,S.fmt(cc*cc,2)); ro.set(2,right?"0":S.fmt(d,2)); ro.set(3,right?"rectangle en C":d<0?"acutangle en C":"obtusangle en C");
      nt.set(right?"Angle droit : c² = a² + b². Ici c = "+S.fmt(Math.sqrt(A*A+B*B),3)+".":d<0?"Angle aigu (< 90°) : c² est plus petit que a² + b².":"Angle obtus (> 90°) : c² est plus grand que a² + b².",right?"ok":"warn");
    });
  }
});
SFA.sim({
  id:"m3-c08-dissection", ch:"c08", tag:"Preuve visuelle", titre:"Preuve sans calcul : quatre triangles qui se déplacent",
  resume:"Un grand carré de côté a + b, quatre triangles identiques : la place libre change de forme mais pas d'aire.",
  but:"Fais glisser le curseur de la position 1 (deux carrés a² et b² libres) à la position 2 (un seul carré c² libre).",
  aRetenir:"Dans les deux positions, la place libre = grand carré − 4 triangles : elle a la même aire. Donc a² + b² = c².",
  piege:"Ce n'est pas un « dessin qui illustre » : c'est une démonstration. Les triangles ne sont que déplacés, jamais déformés.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.92}), P=S.draw.palette;
    var a=k.slider("a",2,8,0.5,3,""), b=k.slider("b",2,8,0.5,5,"");
    var tt=k.slider("Position (1 → 2)",0,1,0.02,0,"");
    var lp=k.loop(function(dt){ var v=tt.value+dt*0.35; if(v>=1){ v=1; lp.pause(); } tt.set(v); k.redraw(); });
    k.button("Animer",function(){ if(tt.value>=1) tt.set(0); lp.play(); },true);
    k.button("Retour",function(){ lp.pause(); tt.set(0); });
    var ro=k.readouts(["a² + b²","c²"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, A=a.value,B=b.value,s=A+B,t=tt.value, u=Math.min(c.W-30,c.H-30)/s, ox=(c.W-s*u)/2, oy=(c.H+s*u)/2;
      function X(x){return ox+x*u;} function Y(y){return oy-y*u;}
      ctx.fillStyle="#fff"; ctx.fillRect(X(0),Y(s),s*u,s*u);
      /* place libre en position 1 : a² et b² ; en position 2 : carré tourné */
      function tri(pts,dx,dy,col){ ctx.beginPath(); pts.forEach(function(p,i){ var x=X(p[0]+dx),y=Y(p[1]+dy); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.closePath(); ctx.fillStyle=col; ctx.fill(); ctx.strokeStyle="#fff"; ctx.lineWidth=1.5; ctx.stroke(); }
      /* positions de départ (A) des 4 triangles, translations vers B */
      var pcs=[{p:[[0,A],[A,A],[0,s]],d:[0,-A],col:P.acc},{p:[[s,0],[s,A],[A,0]],d:[0,0],col:P.green},{p:[[A,s],[0,s],[A,A]],d:[B,0],col:P.amber},{p:[[A,A],[A,0],[s,A]],d:[-A,B],col:P.violet}];
      /* en B : T1 (0,0),(A,0),(0,B) ; on vérifie les translations ci-dessous */
      pcs.forEach(function(q){ tri(q.p,q.d[0]*t,q.d[1]*t,q.col); });
      ctx.strokeStyle=P.ink; ctx.lineWidth=2; ctx.strokeRect(X(0),Y(s),s*u,s*u);
      if(t<0.02){ S.draw.text(c,"a²",X(A/2),Y(A/2),{size:16,color:P.acc}); S.draw.text(c,"b²",X(A+B/2),Y(A+B/2),{size:16,color:P.green}); }
      if(t>0.98) S.draw.text(c,"c²",X(s/2),Y(s/2),{size:16,color:P.red});
      ro.set(0,S.fmt(A*A+B*B,2)); ro.set(1,S.fmt(A*A+B*B,2));
      nt.set(t<0.02?"Position 1 : la place libre est formée du carré a² = "+S.fmt(A*A,2)+" et du carré b² = "+S.fmt(B*B,2)+".":t>0.98?"Position 2 : la place libre est un seul carré, celui de l'hypoténuse c.":"Les triangles glissent : l'aire libre ne change pas.","ok");
    });
  }
});
SFA.sim({
  id:"m3-c08-spirale", ch:"c08", tag:"Racines carrées", titre:"La spirale de Théodore : construire √2, √3, √4…",
  resume:"Chaque nouveau triangle rectangle de côté 1 fabrique la racine carrée suivante.",
  but:"Augmente le nombre de triangles. Lis la longueur de la dernière hypoténuse et repère les carrés parfaits.",
  aRetenir:"Quand les côtés de l'angle droit mesurent √k et 1, l'hypoténuse vaut √(k + 1), car (√k)² + 1² = k + 1. Les longueurs √2, √3, √5… se construisent à la règle et au compas.",
  piege:"√3 ≈ 1,732 n'est pas égal à 1,732 : les décimales de √3 ne s'arrêtent jamais. On l'écrit √3 pour la valeur exacte.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:1}), P=S.draw.palette;
    var n=k.slider("Nombre de triangles",1,16,1,6,"");
    var ro=k.readouts(["Dernière hypoténuse","Valeur approchée","Carré parfait ?"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var N=n.value, ctx=c.ctx, pts=[], phi=0;
      for(var j=1;j<=N+1;j++){ pts.push([Math.sqrt(j)*Math.cos(phi),Math.sqrt(j)*Math.sin(phi)]); phi+=Math.atan(1/Math.sqrt(j)); }
      var R=Math.sqrt(N+1), sc=Math.min(c.W,c.H)/2.5/R, ox=c.W/2, oy=c.H/2;
      function T(p){ return [ox+p[0]*sc, oy-p[1]*sc]; }
      var o=T([0,0]);
      for(var i=0;i<N;i++){ var p=T(pts[i]),q=T(pts[i+1]);
        ctx.beginPath(); ctx.moveTo(o[0],o[1]); ctx.lineTo(p[0],p[1]); ctx.lineTo(q[0],q[1]); ctx.closePath();
        ctx.fillStyle=i===N-1?"rgba(180,35,24,.3)":"rgba(30,63,143,"+(0.05+0.12*(i%2))+")"; ctx.fill(); ctx.strokeStyle=i===N-1?P.red:P.acc; ctx.lineWidth=i===N-1?2.5:1.4; ctx.stroke(); }
      var last=T(pts[N]), prev=T(pts[N-1]);
      S.draw.line(c,o[0],o[1],last[0],last[1],P.red,3);
      S.draw.text(c,"1",(prev[0]+last[0])/2+(last[0]>o[0]?8:-8),(prev[1]+last[1])/2,{size:12,color:P.ink,bg:"rgba(255,255,255,.8)"});
      if(N<=8) for(i=1;i<=N+1;i++){ var pp=T(pts[i-1]); S.draw.text(c,"√"+i,pp[0]+(pp[0]>=o[0]?14:-14),pp[1]-(pp[1]>=o[1]?-10:10),{size:12,color:P.grey}); }
      S.draw.dot(c,o[0],o[1],4,P.ink);
      var m=N+1, rt=Math.round(Math.sqrt(m)), perfect=rt*rt===m;
      ro.set(0,"√"+m); ro.set(1,perfect?S.fmt(rt,0):S.fmt(Math.sqrt(m),4)+"…"); ro.set(2,perfect?"oui : √"+m+" = "+rt:"non : irrationnel");
      nt.set(perfect?"√"+m+" = "+rt+" : un carré parfait, la longueur est un nombre entier.":"√"+m+" ne s'écrit pas avec un nombre fini de décimales : on garde √"+m+" pour la valeur exacte.",perfect?"ok":"");
    });
  }
});
SFA.sim({
  id:"m3-c08-encadrement", ch:"c08", tag:"Irrationnels", titre:"Encadrer une racine carrée décimale par décimale",
  resume:"On resserre l'encadrement de √2 : la précision augmente sans jamais finir ni se répéter.",
  but:"Choisis un nombre et augmente le nombre de décimales. Compare les carrés des bornes avec le nombre de départ.",
  aRetenir:"Un encadrement donne une valeur approchée : par défaut (borne basse) et par excès (borne haute). Pour √2, aucun encadrement ne devient jamais une égalité : √2 est irrationnel.",
  piege:"Une calculatrice affiche 1,41421356… : c'est un arrondi. Jamais « √2 = 1,414 ». Mais attention : √9 = 3 est exact, c'est un carré parfait.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.5}), P=S.draw.palette;
    var N=k.select("Nombre",[[2,"√2"],[3,"√3"],[5,"√5"],[7,"√7"],[10,"√10"],[9,"√9 (carré parfait)"]],2);
    var d=k.slider("Nombre de décimales",0,6,1,2,"");
    var ro=k.readouts(["Borne basse","Borne haute","Carré de la borne basse","Carré de la borne haute"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var n=+N.value, D=d.value, r=Math.sqrt(n), p=Math.pow(10,D), perfect=Math.round(r)*Math.round(r)===n;
      var lo=perfect?r:Math.floor(r*p+1e-9)/p, hi=perfect?r:lo+1/p;
      var w=Math.max(1/p*3,0.02), x0=lo-w, x1=hi+w;
      var X=M3.nline(c,S,{x0:x0,x1:x1,y:c.H*0.62,step:1/p,dec:D,from:lo,to:hi,fo:false,too:false,color:P.red});
      S.draw.text(c,"√"+n+" est ici",c.W/2,c.H*0.2,{size:13,color:P.grey}); S.draw.dot(c,X(r),c.H*0.62,5,P.ink);
      ro.set(0,S.fmt(lo,D)); ro.set(1,S.fmt(hi,D)); ro.set(2,S.fmt(lo*lo,2*D+1)); ro.set(3,S.fmt(hi*hi,2*D+1));
      nt.set(perfect?"√"+n+" = "+S.fmt(r,0)+" exactement : l'encadrement se réduit à un seul nombre.":"Largeur de l'encadrement : "+S.fmt(1/p,D)+". Les carrés des bornes entourent "+n+" sans jamais l'égaler.",perfect?"ok":"");
    });
  }
});
