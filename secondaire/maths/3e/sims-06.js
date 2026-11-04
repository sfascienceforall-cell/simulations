/* Chapitre 6 : systèmes de deux équations du premier degré */
window.M3 = window.M3 || {};
M3.eqXY = function(a,b,c,S){
  var s="", f=function(v){return S.fmt(Math.abs(v),2);};
  if(a!==0) s+=(a===1?"":a===-1?"−":S.fmt(a,2))+"x";
  if(b!==0){ if(s==="") s+=(b===1?"":b===-1?"−":S.fmt(b,2))+"y"; else s+=(b<0?" − ":" + ")+(Math.abs(b)===1?"":f(b))+"y"; }
  if(s==="") s="0";
  return s+" = "+S.fmt(c,2);
};
M3.drawXY = function(c,ax,a,b,cc,col,S){
  if(b!==0) S.draw.fn(c,ax,function(x){return (cc-a*x)/b;},col,3);
  else if(a!==0) S.draw.line(c,ax.X(cc/a),ax.T,ax.X(cc/a),ax.B,col,3);
};
M3.solve2 = function(a1,b1,c1,a2,b2,c2){
  var det=a1*b2-a2*b1;
  if(det!==0) return {kind:"one",x:(c1*b2-c2*b1)/det,y:(a1*c2-a2*c1)/det};
  if(a1===0&&b1===0&&c1!==0||a2===0&&b2===0&&c2!==0) return {kind:"none"};
  if(a1===0&&b1===0&&a2===0&&b2===0) return c1===0&&c2===0?{kind:"inf"}:{kind:"none"};
  if(a1===0&&b1===0) return c1===0?{kind:"inf"}:{kind:"none"};
  if(a2===0&&b2===0) return c2===0?{kind:"inf"}:{kind:"none"};
  return (a1*c2===a2*c1&&b1*c2===b2*c1)?{kind:"inf"}:{kind:"none"};
};
SFA.sim({
  id:"m3-c06-intersection", ch:"c06", tag:"Graphique", titre:"Deux droites, un couple solution",
  resume:"Chaque équation est une droite ; la solution du système est leur point commun.",
  but:"Change les coefficients des deux équations. Lis le couple (x ; y) sur le graphique, puis vérifie-le dans les deux équations.",
  aRetenir:"Un couple (x ; y) est solution du système s'il vérifie les deux équations à la fois : c'est le point d'intersection des deux droites.",
  piege:"Une solution est un couple : donner seulement x (ou seulement y) ne suffit pas.",
  build:function(k,S){
    var c=k.canvas(360), P=S.draw.palette;
    var a1=k.slider("Éq. 1 : a₁ (devant x)",-4,4,1,1,""), b1=k.slider("b₁ (devant y)",-4,4,1,1,""), c1=k.slider("c₁",-10,10,1,5,"");
    var a2=k.slider("Éq. 2 : a₂",-4,4,1,1,""), b2=k.slider("b₂",-4,4,1,-1,""), c2=k.slider("c₂",-10,10,1,1,"");
    var ro=k.readouts(["Équation 1","Équation 2","Solution","Vérification"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var A1=a1.value,B1=b1.value,C1=c1.value,A2=a2.value,B2=b2.value,C2=c2.value;
      var ax=S.draw.axes(c,{x0:-10,x1:10,y0:-10,y1:10,xl:"x",yl:"y",stepX:2,stepY:2});
      M3.drawXY(c,ax,A1,B1,C1,P.acc,S); M3.drawXY(c,ax,A2,B2,C2,P.red,S);
      var r=M3.solve2(A1,B1,C1,A2,B2,C2);
      ro.set(0,M3.eqXY(A1,B1,C1,S)); ro.set(1,M3.eqXY(A2,B2,C2,S));
      if(r.kind==="one"){ if(Math.abs(r.x)<=10&&Math.abs(r.y)<=10) S.draw.dot(c,ax.X(r.x),ax.Y(r.y),7,P.green);
        ro.set(2,"("+S.fmt(r.x,2)+" ; "+S.fmt(r.y,2)+")");
        ro.set(3,S.fmt(A1*r.x+B1*r.y,2)+" = "+S.fmt(C1,2)+" ✓ ; "+S.fmt(A2*r.x+B2*r.y,2)+" = "+S.fmt(C2,2)+" ✓");
        nt.set(Math.abs(r.x)>10||Math.abs(r.y)>10?"Le point d'intersection sort du cadre, mais la solution existe bien.":"Le point vert est le seul point commun aux deux droites.","ok"); }
      else if(r.kind==="inf"){ ro.set(2,"infinité"); ro.set(3,"—"); nt.set("Les deux équations décrivent la même droite : une infinité de solutions (système indéterminé).","warn"); }
      else { ro.set(2,"aucune"); ro.set(3,"—"); nt.set("Droites parallèles (ou équation impossible) : aucune solution (système impossible).","warn"); }
    });
  }
});
SFA.sim({
  id:"m3-c06-troiscas", ch:"c06", tag:"Trois cas", titre:"Une solution, aucune, ou une infinité ?",
  resume:"Fixe l'équation 2x + y = 6 et fais varier la seconde : 4x + m·y = k.",
  but:"Fais varier m puis k. Trouve les valeurs qui donnent chacun des trois cas.",
  aRetenir:"Si les droites ont des pentes différentes : une seule solution. Mêmes pentes, ordonnées différentes : aucune solution. Même droite : infinité de solutions.",
  piege:"Un système qui mène à 0 = 5 n'a pas « x = 0 » pour solution : il est impossible.",
  build:function(k,S){
    var c=k.canvas(340), P=S.draw.palette;
    var m=k.slider("m",1,4,1,2,""), kk=k.slider("k",4,16,1,12,"");
    var ro=k.readouts(["Équation 1","Équation 2","Cas"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var M=m.value,K=kk.value;
      var ax=S.draw.axes(c,{x0:-2,x1:8,y0:-10,y1:10,xl:"x",yl:"y",stepX:1,stepY:2});
      M3.drawXY(c,ax,2,1,6,P.acc,S); M3.drawXY(c,ax,4,M,K,P.red,S);
      var r=M3.solve2(2,1,6,4,M,K);
      ro.set(0,M3.eqXY(2,1,6,S)); ro.set(1,M3.eqXY(4,M,K,S));
      if(r.kind==="one"){ if(r.x>=-2&&r.x<=8&&r.y>=-10&&r.y<=10) S.draw.dot(c,ax.X(r.x),ax.Y(r.y),7,P.green); ro.set(2,"1 solution : ("+S.fmt(r.x,2)+" ; "+S.fmt(r.y,2)+")"); nt.set("Pentes différentes : les droites se coupent en un seul point.","ok"); }
      else if(r.kind==="inf"){ ro.set(2,"infinité de solutions"); nt.set("4x + 2y = 12 est l'équation 1 multipliée par 2 : c'est la même droite.","warn"); }
      else { ro.set(2,"aucune solution"); nt.set("4x + 2y = "+S.fmt(K,0)+" : en divisant par 2, on obtient 2x + y = "+S.fmt(K/2,1)+", incompatible avec 2x + y = 6.","warn"); }
    });
  }
});
SFA.sim({
  id:"m3-c06-combinaison", ch:"c06", tag:"Combinaison", titre:"Combinaison : fais disparaître une inconnue",
  resume:"Multiplie les équations puis additionne-les : l'une des inconnues doit s'annuler.",
  but:"Choisis un système, règle les multiplicateurs p et q et trouve ceux qui font disparaître x ou y.",
  aRetenir:"On multiplie les équations pour que les coefficients d'une inconnue soient opposés, puis on additionne : il reste une équation à une inconnue. On remplace ensuite pour trouver l'autre.",
  piege:"Il faut multiplier tous les termes de l'équation, y compris le second membre. Attention aux signes quand on soustrait.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7}), P=S.draw.palette;
    var PRE=[[2,3,13,1,-1,-1],[3,2,16,5,-2,0],[1,2,7,3,-1,0],[4,-3,-1,2,1,7]];
    var ps=k.select("Système",PRE.map(function(p,i){return [i,"{ "+M3.eqXY(p[0],p[1],p[2],S)+"  ;  "+M3.eqXY(p[3],p[4],p[5],S)+" }"];}),0);
    var p=k.slider("Multiplicateur p de l'équation 1",-5,5,1,1,""), q=k.slider("Multiplicateur q de l'équation 2",-5,5,1,3,"");
    var ro=k.readouts(["Somme","Résultat"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var E=PRE[+ps.value], pp=p.value, qq=q.value;
      var A=pp*E[0]+qq*E[3], B=pp*E[1]+qq*E[4], C=pp*E[2]+qq*E[5];
      var L=[["(1)  "+M3.eqXY(E[0],E[1],E[2],S),P.acc],["(2)  "+M3.eqXY(E[3],E[4],E[5],S),P.red],
        ["(1) × "+(pp<0?"("+S.fmt(pp,0)+")":S.fmt(pp,0))+" :  "+M3.eqXY(pp*E[0],pp*E[1],pp*E[2],S),P.acc],["(2) × "+(qq<0?"("+S.fmt(qq,0)+")":S.fmt(qq,0))+" :  "+M3.eqXY(qq*E[3],qq*E[4],qq*E[5],S),P.red],["Somme :  "+M3.eqXY(A,B,C,S),P.ink]];
      L.forEach(function(l,i){ S.draw.text(c,l[0],c.W*0.04,20+i*((c.H-50)/5),{size:14,align:"left",color:l[1],math:true}); });
      var res="", kind="";
      if(A===0&&B===0){ res=C===0?"0 = 0 : tout s'annule":"0 = "+S.fmt(C,0)+" : impossible"; kind="warn"; }
      else if(A===0){ var y=C/B; res="x a disparu : y = "+S.fmt(y,2); kind="ok";
        var x=(E[2]-E[1]*y)/E[0]; res+=", puis x = "+S.fmt(x,2); }
      else if(B===0){ var x2=C/A; res="y a disparu : x = "+S.fmt(x2,2); kind="ok"; var y2=(E[2]-E[0]*x2)/E[1]; res+=", puis y = "+S.fmt(y2,2); }
      else { res="Aucune inconnue n'a disparu : essaie d'autres multiplicateurs."; kind="warn"; }
      S.draw.text(c,res,c.W/2,c.H-14,{size:13,color:kind==="ok"?P.green:P.red});
      ro.set(0,M3.eqXY(A,B,C,S)); ro.set(1,res);
      nt.set(kind==="ok"?"Bien joué : une inconnue a disparu. Vérifie le couple dans les deux équations de départ.":"Cherche p et q pour que les coefficients de x (ou de y) soient opposés.",kind);
    });
  }
});
SFA.sim({
  id:"m3-c06-poules", ch:"c06", tag:"Problème classique", titre:"Poules et lapins : têtes et pattes",
  resume:"Dans une cour, on compte T têtes et P pattes. Combien de poules et de lapins ?",
  but:"Règle T et P. Le système trouve le nombre de lapins ; regarde quand il n'y a pas de réponse possible.",
  aRetenir:"Avec x poules et y lapins : x + y = T et 2x + 4y = P. On trouve y = (P − 2T) ÷ 2 et x = T − y. La solution doit être un entier positif ou nul.",
  piege:"Une solution mathématique n'est pas toujours une solution du problème : on ne peut pas avoir 2,5 lapins ni −3 poules.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85}), P=S.draw.palette;
    var T=k.slider("Têtes T",4,30,1,14,""), Pa=k.slider("Pattes P",8,120,1,40,"");
    var ro=k.readouts(["Poules x","Lapins y","Vérification"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var t=T.value,p=Pa.value, y=(p-2*t)/2, x=t-y, ok=Number.isInteger(y)&&y>=0&&x>=0;
      var ax=S.draw.axes(c,{x0:0,x1:30,y0:0,y1:30,xl:"poules x",yl:"lapins y",stepX:5,stepY:5,t:28,b:34,r:10}), ctx=c.ctx;
      S.draw.fn(c,ax,function(xx){return t-xx;},P.acc,2.6);
      S.draw.fn(c,ax,function(xx){return (p-2*xx)/4;},P.red,2.6);
      S.draw.text(c,"bleu : x + y = "+t+"   rouge : 2x + 4y = "+p,c.W-12,10,{size:12,color:P.ink,align:"right"});
      if(x>=0&&y>=0&&x<=30&&y<=30) S.draw.dot(c,ax.X(x),ax.Y(y),7,ok?P.green:P.amber);
      ro.set(0,S.fmt(x,1)); ro.set(1,S.fmt(y,1)); ro.set(2,ok?S.fmt(x,0)+" + "+S.fmt(y,0)+" = "+t+" ; "+S.fmt(2*x+4*y,0)+" pattes ✓":"—");
      if(ok) nt.set(S.fmt(x,0)+" poules et "+S.fmt(y,0)+" lapins : "+S.fmt(x,0)+" × 2 + "+S.fmt(y,0)+" × 4 = "+S.fmt(p,0)+" pattes.","ok");
      else if(p%2===1) nt.set("P est impair : impossible, car poules et lapins ont un nombre pair de pattes.","warn");
      else if(y<0) nt.set("Pas assez de pattes pour "+t+" têtes : il faudrait un nombre négatif de lapins.","warn");
      else if(x<0) nt.set("Trop de pattes : il faudrait un nombre négatif de poules.","warn");
      else nt.set("Pas de solution entière pour ce couple (T ; P).","warn");
    });
  }
});
