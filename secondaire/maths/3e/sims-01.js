/* Chapitre 1 : calcul numérique et expressions algébriques */
SFA.sim({
  id:"m3-c01-carre", ch:"c01", tag:"Géométrie", titre:"Le carré de côté a + b",
  resume:"Découpe un carré en quatre morceaux et vois pourquoi (a + b)² contient 2ab.",
  but:"Fais varier a et b. Active « Montrer l'erreur » pour voir ce qui manque quand on écrit a² + b².",
  aRetenir:"(a + b)² = a² + 2ab + b² : le grand carré contient un carré a², un carré b² et deux rectangles a × b.",
  piege:"(a + b)² ≠ a² + b². Il manque toujours les deux rectangles 2ab (sauf si a ou b vaut 0).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85}), P=S.draw.palette;
    var a=k.slider("a",1,8,0.5,3,"cm"), b=k.slider("b",1,8,0.5,2,"cm");
    var err=k.toggle("Montrer l'erreur a² + b²",false);
    var ro=k.readouts(["(a + b)²","a² + b²","2ab","Différence"]);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, A=a.value, B=b.value, s=A+B;
      var u=Math.min(c.W-70,c.H-70)/16, x0=(c.W-s*u)/2+10, y0=30;
      function R(x,y,w,h,f,t){ctx.fillStyle=f;ctx.fillRect(x0+x*u,y0+y*u,w*u,h*u);ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.strokeRect(x0+x*u,y0+y*u,w*u,h*u);
        S.draw.text(c,t,x0+(x+w/2)*u,y0+(y+h/2)*u,{size:13,color:"#fff"});}
      R(0,0,A,A,P.acc,"a²"); R(A,0,B,A,P.amber,"ab"); R(0,A,A,B,P.amber,"ab"); R(A,A,B,B,P.green,"b²");
      if(err.value){ ctx.save(); ctx.strokeStyle=P.red; ctx.lineWidth=3; ctx.setLineDash([6,4]);
        ctx.strokeRect(x0,y0,A*u,A*u); ctx.strokeRect(x0+A*u,y0+A*u,B*u,B*u); ctx.restore();
        S.draw.text(c,"Les deux rectangles ab ne sont pas dans a² + b²",c.W/2,y0+s*u+18,{size:12,color:P.red}); }
      S.draw.text(c,"a",x0+A*u/2,y0-12,{size:13}); S.draw.text(c,"b",x0+(A+B/2)*u,y0-12,{size:13});
      ro.set(0,S.fmt(s*s,2)); ro.set(1,S.fmt(A*A+B*B,2)); ro.set(2,S.fmt(2*A*B,2)); ro.set(3,S.fmt(s*s-A*A-B*B,2));
    });
  }
});
SFA.sim({
  id:"m3-c01-tuiles", ch:"c01", tag:"Factorisation", titre:"Tuiles algébriques : un trinôme devient un rectangle",
  resume:"Construis le rectangle (x + m)(x + n) et lis le trinôme développé.",
  but:"Choisis m et n. Puis relève le défi : trouve les deux nombres pour fabriquer le trinôme demandé.",
  aRetenir:"x² + (m + n)x + mn = (x + m)(x + n). Pour factoriser, cherche deux nombres de somme (m + n) et de produit mn.",
  piege:"Chercher deux nombres de bon produit mais de mauvaise somme : x² + 5x + 6 = (x + 2)(x + 3), pas (x + 1)(x + 6).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.8}), P=S.draw.palette;
    var m=k.slider("m",1,6,1,2,""), n=k.slider("n",1,6,1,3,""), x=k.slider("x (longueur de la tuile)",2,6,0.5,4,"");
    var tg=k.seg("Défi",[[0,"Libre"],[1,"x²+5x+6"],[2,"x²+7x+12"],[3,"x²+6x+8"],[4,"x²+8x+15"]],0);
    var nt=k.note("Mode libre : change m, n et x.");
    var ro=k.readouts(["Forme développée","Forme factorisée","Aire pour ce x"]);
    var T={1:[5,6],2:[7,12],3:[6,8],4:[8,15]};
    k.draw(function(){
      c.clear(); var ctx=c.ctx, M=m.value, N=n.value, X=x.value, W=X+N, H=X+M;
      var u=Math.min(c.W-60,c.H-60)/(6+6+1), x0=(c.W-W*u)/2, y0=34;
      function R(xx,yy,w,h,f,t){ctx.fillStyle=f;ctx.fillRect(x0+xx*u,y0+yy*u,w*u,h*u);ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.strokeRect(x0+xx*u,y0+yy*u,w*u,h*u);S.draw.text(c,t,x0+(xx+w/2)*u,y0+(yy+h/2)*u,{size:12,color:"#fff"});}
      R(0,0,X,X,P.acc,"x²"); R(X,0,N,X,P.amber,N+"x"); R(0,X,X,M,P.amber,M+"x"); R(X,X,N,M,P.green,M*N);
      S.draw.text(c,"x + "+N,x0+W*u/2,y0-14,{size:13}); S.draw.text(c,"x + "+M,x0-26,y0+H*u/2,{size:13});
      ro.set(0,"x² + "+(M+N)+"x + "+(M*N)); ro.set(1,"(x + "+M+")(x + "+N+")"); ro.set(2,S.fmt(W*H,2));
      var d=+tg.value; if(!d){nt.set("Mode libre : change m, n et x.","");}
      else{ var t=T[d]; if(M+N===t[0]&&M*N===t[1]) nt.set("Bravo : "+M+" + "+N+" = "+t[0]+" et "+M+" × "+N+" = "+t[1]+".","ok");
        else nt.set("Il faut m + n = "+t[0]+" et m × n = "+t[1]+". Pour l'instant : "+(M+N)+" et "+(M*N)+".","warn"); }
    });
  }
});
SFA.sim({
  id:"m3-c01-mental", ch:"c01", tag:"Calcul mental", titre:"Calcul mental avec les produits remarquables",
  resume:"47 × 53, 98², 101 × 99 : calcule de tête en choisissant une bonne base.",
  but:"Choisis une base c, un écart d et le type de produit. Compare le calcul astucieux et le calcul direct.",
  aRetenir:"(c − d)(c + d) = c² − d² ; (c + d)² = c² + 2cd + d² ; (c − d)² = c² − 2cd + d².",
  piege:"Dans (c − d)², le terme du milieu est −2cd, et d² est toujours positif.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.5}), P=S.draw.palette;
    var md=k.seg("Produit",[["diff","(c−d)(c+d)"],["plus","(c+d)²"],["moins","(c−d)²"]],"diff");
    var cc=k.slider("Base c",10,100,10,50,""), d=k.slider("Écart d",1,9,1,3,"");
    var ro=k.readouts(["Calcul de tête","Résultat","Calcul direct","Vérification"]);
    k.draw(function(){
      c.clear(); var C=cc.value,D=d.value,t=md.value,txt,res,dir,l1,l2;
      if(t==="diff"){ l1=(C-D)+" × "+(C+D); txt=C+"² − "+D+"²"; res=C*C-D*D; dir=(C-D)*(C+D); l2=S.fmt(C*C,0)+" − "+D*D; }
      else if(t==="plus"){ l1=(C+D)+"²"; txt=C+"² + 2×"+C+"×"+D+" + "+D+"²"; res=C*C+2*C*D+D*D; dir=(C+D)*(C+D); l2=S.fmt(C*C,0)+" + "+2*C*D+" + "+D*D; }
      else { l1=(C-D)+"²"; txt=C+"² − 2×"+C+"×"+D+" + "+D+"²"; res=C*C-2*C*D+D*D; dir=(C-D)*(C-D); l2=S.fmt(C*C,0)+" − "+2*C*D+" + "+D*D; }
      S.draw.text(c,l1,c.W/2,c.H*.18,{size:22,color:P.ink,math:true});
      S.draw.text(c,"= "+txt,c.W/2,c.H*.44,{size:16,color:P.acc,math:true});
      S.draw.text(c,"= "+l2,c.W/2,c.H*.66,{size:16,color:P.amber,math:true});
      S.draw.text(c,"= "+S.fmt(res,0),c.W/2,c.H*.88,{size:22,color:P.green,math:true});
      ro.set(0,txt); ro.set(1,S.fmt(res,0)); ro.set(2,S.fmt(dir,0)); ro.set(3,res===dir?"identique ✓":"différent ✗");
    });
  }
});
SFA.sim({
  id:"m3-c01-priorites", ch:"c01", tag:"Signes", titre:"Priorités et signes : −x² contre (−x)²",
  resume:"Une calculatrice-test qui montre l'ordre des opérations et l'erreur classique.",
  but:"Choisis une expression et une valeur de x. Lis les étapes dans l'ordre, puis compare avec la réponse « piège ».",
  aRetenir:"Les puissances se calculent avant le signe moins devant ; les parenthèses d'abord ; puis × et ÷ ; enfin + et −. Un « − » devant une parenthèse change tous les signes à l'intérieur.",
  piege:"−3² = −9 (et non 9). Pour obtenir 9, il faut écrire (−3)².",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.75}), P=S.draw.palette;
    var E=[
      {n:"−x²",f:function(x){return -x*x},bad:function(x){return x*x},st:function(x){return ["x² = "+S.fmt(x*x,0),"puis le signe − : −"+S.fmt(x*x,0)]},m:"On a calculé (−x)²."},
      {n:"(−x)²",f:function(x){return x*x},bad:function(x){return -x*x},st:function(x){return ["Dans la parenthèse : −x = "+S.fmt(-x,0),"au carré : "+S.fmt(x*x,0)]},m:"On a oublié que la parenthèse est élevée au carré."},
      {n:"2 + 3x",f:function(x){return 2+3*x},bad:function(x){return 5*x},st:function(x){return ["Multiplication d'abord : 3x = "+S.fmt(3*x,0),"puis 2 + "+S.fmt(3*x,0)+" = "+S.fmt(2+3*x,0)]},m:"On a additionné avant de multiplier : (2 + 3)x."},
      {n:"5 − (2x − 3)",f:function(x){return 5-(2*x-3)},bad:function(x){return 5-2*x-3},st:function(x){return ["Le − change tous les signes : 5 − 2x + 3","= 8 − 2x = "+S.fmt(8-2*x,0)]},m:"Le signe − n'a pas été distribué sur le −3."},
      {n:"10 − 4x²",f:function(x){return 10-4*x*x},bad:function(x){return (10-4*x)*(10-4*x)>=0?Math.pow(10-4*x,2):0},st:function(x){return ["x² = "+S.fmt(x*x,0),"4x² = "+S.fmt(4*x*x,0),"10 − "+S.fmt(4*x*x,0)+" = "+S.fmt(10-4*x*x,0)]},m:"On a calculé (10 − 4x)² au lieu de 10 − 4x²."}
    ];
    var e=k.select("Expression",E.map(function(o,i){return [i,o.n];}),0), x=k.slider("x",-5,5,1,-3,"");
    var tg=k.toggle("Montrer la réponse piège",false);
    var ro=k.readouts(["Expression","Valeur correcte","Réponse piège"]);
    k.draw(function(){
      c.clear(); var o=E[+e.value], X=x.value, ST=o.st(X);
      S.draw.text(c,o.n+"  pour x = "+S.fmt(X,0),c.W/2,24,{size:18,color:P.ink,math:true});
      ST.forEach(function(s,i){ S.draw.text(c,(i+1)+". "+s,c.W/2,62+i*34,{size:15,color:P.acc,math:true}); });
      S.draw.text(c,"Résultat : "+S.fmt(o.f(X),0),c.W/2,c.H-62,{size:20,color:P.green});
      if(tg.value){ S.draw.text(c,"Piège : "+S.fmt(o.bad(X),0),c.W/2,c.H-30,{size:13,color:P.red}); S.draw.text(c,o.m,c.W/2,c.H-12,{size:12,color:P.red}); }
      ro.set(0,o.n); ro.set(1,S.fmt(o.f(X),0)); ro.set(2,tg.value?S.fmt(o.bad(X),0):"masquée");
    });
  }
});
