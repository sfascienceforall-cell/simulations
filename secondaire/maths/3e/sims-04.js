/* Chapitre 4 : équations du premier degré */
SFA.sim({
  id:"m3-c04-balance", ch:"c04", tag:"Balance", titre:"La balance : fais la même chose des deux côtés",
  resume:"Applique des opérations à l'équation. Si tu n'en fais qu'à gauche, la balance penche !",
  but:"Choisis une opération et où l'appliquer. Isole x pour que l'équation devienne x = …",
  aRetenir:"Une équation est une balance en équilibre : ajouter, retrancher, multiplier ou diviser par un nombre non nul des deux côtés conserve la solution.",
  piege:"« Changer de côté en changeant de signe » veut dire : on a ajouté ou retiré la même chose des deux côtés. Ne multiplie jamais un seul membre.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.62}), P=S.draw.palette;
    var PRE=[[3,5,1,11],[2,-4,5,8],[4,1,2,-7],[5,-2,2,10]];
    var e, xs;
    function sol(p){ return (p[3]-p[1])/(p[0]-p[2]); }
    var ps=k.select("Équation de départ",PRE.map(function(p,i){return [i,fmtEq(p)];}),0,function(){ reset(); });
    var op=k.seg("Opération",[["cst","+ k"],["x","+ k·x"],["mul","× k"],["div","÷ k"]],"cst");
    var kk=k.slider("k",-10,10,1,-5,"");
    var tg=k.seg("Appliquer à",[["both","Les deux membres"],["L","Gauche seulement"],["R","Droite seulement"]],"both");
    k.button("Appliquer",function(){ apply(); },true);
    k.button("Recommencer",function(){ reset(); });
    var ro=k.readouts(["Équation actuelle","Solution de départ"]);
    var nt=k.note("");
    function side(a,b){ var s=""; if(a!==0) s+=(a===1?"":a===-1?"−":S.fmt(a,2))+"x"; if(b!==0||a===0){ if(s==="") s=S.fmt(b,2); else s+=(b>0?" + ":" − ")+S.fmt(Math.abs(b),2); } return s; }
    function fmtEq(p){ return side(p[0],p[1])+" = "+side(p[2],p[3]); }
    function reset(){ e=PRE[+ps.value].slice(); xs=sol(e); nt.set("Isole x : le but est d'obtenir « x = "+S.fmt(xs,0)+" ».",""); k.redraw(); }
    function apply(){
      var K=kk.value, o=op.value, t=tg.value, L=t!=="R", R=t!=="L";
      if((o==="mul"||o==="div")&&K===0){ nt.set("On ne multiplie ni ne divise jamais par 0 : choisis un autre k.","warn"); return; }
      if(o==="div"){ var all=e.every(function(v){return Number.isInteger(v/K);}); if(!all&&t==="both"){ nt.set("Cette division ne tombe pas juste sur tous les coefficients : choisis un autre k.","warn"); return; } }
      if(o==="cst"){ if(L) e[1]+=K; if(R) e[3]+=K; }
      if(o==="x"){ if(L) e[0]+=K; if(R) e[2]+=K; }
      if(o==="mul"){ if(L){e[0]*=K;e[1]*=K;} if(R){e[2]*=K;e[3]*=K;} }
      if(o==="div"){ if(L){e[0]/=K;e[1]/=K;} if(R){e[2]/=K;e[3]/=K;} }
      var d=(e[0]*xs+e[1])-(e[2]*xs+e[3]);
      if(Math.abs(d)>1e-9) nt.set("La balance penche : tu n'as pas traité les deux membres de la même façon, l'équation n'a plus la même solution.","bad");
      else if(e[0]===1&&e[1]===0&&e[2]===0) nt.set("Gagné ! x = "+S.fmt(e[3],2)+". Vérifie en remplaçant dans l'équation de départ.","ok");
      else nt.set("Balance en équilibre : l'équation est équivalente à la précédente.","ok");
    }
    k.draw(function(){
      if(!e){ e=PRE[0].slice(); xs=sol(e); }
      c.clear(); var ctx=c.ctx, d=(e[0]*xs+e[1])-(e[2]*xs+e[3]), den=Math.abs(e[0]*xs+e[1])+Math.abs(e[2]*xs+e[3])+1;
      var ang=Math.max(-0.28,Math.min(0.28,d/den*0.6)), cx=c.W/2, py=c.H*0.42, hw=Math.min(c.W*0.4,170);
      var lx=cx-hw*Math.cos(ang), ly=py+hw*Math.sin(ang), rx=cx+hw*Math.cos(ang), ry=py-hw*Math.sin(ang);
      ctx.fillStyle=P.grey; ctx.beginPath(); ctx.moveTo(cx,py); ctx.lineTo(cx-18,c.H-20); ctx.lineTo(cx+18,c.H-20); ctx.closePath(); ctx.fill();
      S.draw.line(c,lx,ly,rx,ry,P.ink,5); S.draw.dot(c,cx,py,7,P.ink);
      function pan(x,y,txt,col){ S.draw.line(c,x,y,x-34,y+44,P.grey,1.5); S.draw.line(c,x,y,x+34,y+44,P.grey,1.5);
        var w=Math.max(70,txt.length*9+16); ctx.fillStyle=col; ctx.fillRect(x-w/2,y+44,w,34); S.draw.text(c,txt,x,y+61,{size:15,color:"#fff",math:true}); }
      pan(lx,ly,side(e[0],e[1]),P.acc); pan(rx,ry,side(e[2],e[3]),P.green);
      S.draw.text(c,Math.abs(d)<1e-9?"Équilibre":"Déséquilibre",cx,20,{size:14,color:Math.abs(d)<1e-9?P.green:P.red});
      ro.set(0,fmtEq(e)); ro.set(1,"x = "+S.fmt(xs,0));
    });
    reset();
  }
});
SFA.sim({
  id:"m3-c04-graphe", ch:"c04", tag:"Lien avec les droites", titre:"Résoudre ax + b = cx + d avec deux droites",
  resume:"La solution d'une équation est l'abscisse du point où deux droites se croisent.",
  but:"Règle a, b, c et d. Observe le croisement, puis fabrique une équation impossible et une équation toujours vraie.",
  aRetenir:"Résoudre ax + b = cx + d, c'est chercher le x où y = ax + b et y = cx + d ont la même valeur : le point d'intersection. Même pente et ordonnées différentes : pas de solution. Droites confondues : tous les x.",
  piege:"« Pas de solution » ne se note pas x = 0 : c'est l'ensemble vide, il n'y a aucun x qui convienne.",
  build:function(k,S){
    var c=k.canvas(360), P=S.draw.palette;
    var a=k.slider("a",-4,4,1,2,""), b=k.slider("b",-6,6,1,1,""), cc=k.slider("c",-4,4,1,-1,""), d=k.slider("d",-6,6,1,7,"");
    var ro=k.readouts(["Équation","Solution"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var A=a.value,B=b.value,C=cc.value,D=d.value;
      var ax=S.draw.axes(c,{x0:-8,x1:8,y0:-12,y1:12,xl:"x",yl:"y",stepX:2,stepY:4});
      S.draw.fn(c,ax,function(x){return A*x+B;},P.acc,3); S.draw.fn(c,ax,function(x){return C*x+D;},P.red,3);
      function s(a2,b2){ var t=""; if(a2!==0) t+=(a2===1?"":a2===-1?"−":S.fmt(a2,0))+"x"; if(b2!==0||a2===0){ t+= t===""?S.fmt(b2,0):(b2>0?" + ":" − ")+S.fmt(Math.abs(b2),0);} return t; }
      ro.set(0,s(A,B)+" = "+s(C,D));
      if(A===C&&B===D){ ro.set(1,"tous les x"); nt.set("Les deux droites sont confondues : l'équation est vraie pour tout x.","ok"); }
      else if(A===C){ ro.set(1,"aucune"); nt.set("Droites parallèles : "+S.fmt(B,0)+" = "+S.fmt(D,0)+" est faux, aucune solution (ensemble vide).","warn"); }
      else { var x=(D-B)/(A-C); ro.set(1,"x = "+S.fmt(x,2));
        if(Math.abs(x)<=8&&Math.abs(A*x+B)<=12){ S.draw.dot(c,ax.X(x),ax.Y(A*x+B),7,P.green); S.draw.line(c,ax.X(x),ax.Y(A*x+B),ax.X(x),ax.Y(0),P.green,1.5,[4,3]); }
        if(Math.abs(x)<=8&&Math.abs(A*x+B)<=12) nt.set("Au croisement, y = "+S.fmt(A*x+B,2)+" pour les deux droites : x = "+S.fmt(x,2)+" est la solution.","ok");
        else nt.set("Le croisement existe (x = "+S.fmt(x,2)+", y = "+S.fmt(A*x+B,2)+") mais il sort du cadre : la solution est bien x = "+S.fmt(x,2)+".","warn"); }
    });
  }
});
SFA.sim({
  id:"m3-c04-magie", ch:"c04", tag:"Tour de magie", titre:"« Pense à un nombre » : pourquoi ça marche",
  resume:"Un nombre de départ, quatre opérations… et le résultat ne dépend pas du nombre. Pourquoi ?",
  but:"Change le nombre de départ n. Active ou coupe la dernière étape et regarde si le résultat dépend de n.",
  aRetenir:"(2n + 2k) ÷ 2 − n = k : n s'annule, on obtient une identité. Sans la dernière étape, on obtient n + k, qui dépend de n : trouver n pour un résultat donné est une équation.",
  piege:"Tester avec un seul nombre ne prouve rien : il faut une lettre (n) pour montrer que ça marche pour tous les nombres.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7}), P=S.draw.palette;
    var n=k.slider("Nombre de départ n",-20,20,1,7,""), kk=k.slider("Nombre magique k",1,10,1,5,"");
    var last=k.toggle("Retirer à la fin le nombre de départ",true);
    var tg=k.slider("Résultat voulu (si la dernière étape est coupée)",-10,30,1,12,"");
    var ro=k.readouts(["Résultat","Dépend de n ?","n pour le résultat voulu"]);
    k.draw(function(){
      c.clear(); var N=n.value,K=kk.value,L=last.value;
      var s1=2*N, s2=s1+2*K, s3=s2/2, s4=L?s3-N:s3;
      var lines=[["Pense à n = "+S.fmt(N,0),"n"],["Multiplie par 2 : "+S.fmt(s1,0),"2n"],["Ajoute "+2*K+" : "+S.fmt(s2,0),"2n + "+2*K],["Divise par 2 : "+S.fmt(s3,0),"n + "+K]];
      if(L) lines.push(["Retire n : "+S.fmt(s4,0),K+""]);
      lines.forEach(function(l,i){ var y=26+i*(c.H-44)/5; S.draw.text(c,l[0],c.W*0.05,y,{size:14,align:"left",color:P.ink}); S.draw.text(c,l[1],c.W*0.95,y,{size:15,align:"right",color:i===4?P.green:P.acc,math:true}); });
      S.draw.text(c,L?"Résultat : "+S.fmt(s4,0)+" pour tout n":"Résultat : "+S.fmt(s4,0)+" (change avec n)",c.W/2,c.H-14,{size:15,color:L?P.green:P.amber});
      ro.set(0,S.fmt(s4,0)); ro.set(1,L?"non : toujours "+K:"oui : n + "+K); ro.set(2,L?"tous les n (si résultat = "+K+")":S.fmt(tg.value-K,0));
    });
  }
});
SFA.sim({
  id:"m3-c04-levier", ch:"c04", tag:"Physique et équations", titre:"Le levier : une équation du 1er degré",
  resume:"Deux masses sur une barre : l'équilibre donne m₁·d₁ = m₂·d₂.",
  but:"Règle les masses et la distance d₁, puis déplace d₂ jusqu'à l'équilibre. Vérifie avec l'équation.",
  aRetenir:"À l'équilibre, m₁ × d₁ = m₂ × d₂. Si on connaît m₁, d₁ et m₂, on trouve d₂ = m₁ × d₁ ÷ m₂ : c'est une équation du 1er degré.",
  piege:"Une masse plus lourde se place plus près du pivot, pas plus loin : le produit masse × distance doit être égal des deux côtés.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.55}), P=S.draw.palette;
    var m1=k.slider("Masse m₁",1,10,1,3,"kg"), d1=k.slider("Distance d₁",1,5,0.5,4,"m"), m2=k.slider("Masse m₂",1,10,1,2,"kg"), d2=k.slider("Distance d₂",0.5,6,0.5,3,"m");
    var ro=k.readouts(["m₁ × d₁","m₂ × d₂","d₂ pour l'équilibre"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, M1=m1.value,D1=d1.value,M2=m2.value,D2=d2.value, t1=M1*D1, t2=M2*D2;
      var ang=Math.max(-0.22,Math.min(0.22,(t2-t1)/(t1+t2)*0.5)), cx=c.W/2, py=c.H*0.55, u=(c.W/2-20)/6.2;
      function P2(dist,side){ return {x:cx+side*dist*u*Math.cos(ang), y:py+side*dist*u*Math.sin(ang)}; }
      ctx.fillStyle=P.grey; ctx.beginPath(); ctx.moveTo(cx,py); ctx.lineTo(cx-16,c.H-12); ctx.lineTo(cx+16,c.H-12); ctx.closePath(); ctx.fill();
      var a=P2(6.2,-1), b=P2(6.2,1); S.draw.line(c,a.x,a.y,b.x,b.y,P.ink,6);
      for(var i=1;i<=6;i++){ var q=P2(i,-1), r=P2(i,1); S.draw.line(c,q.x,q.y-4,q.x,q.y+4,P.light,1.5); S.draw.line(c,r.x,r.y-4,r.x,r.y+4,P.light,1.5); }
      S.draw.dot(c,cx,py,7,P.ink);
      var p1=P2(D1,-1), p2=P2(D2,1);
      function box(p,m,col){ var s=16+m*3; ctx.fillStyle=col; ctx.fillRect(p.x-s/2,p.y-s-3,s,s); S.draw.text(c,m+" kg",p.x,p.y-s/2-3,{size:12,color:"#fff"}); }
      box(p1,M1,P.acc); box(p2,M2,P.red);
      var need=t1/M2;
      ro.set(0,S.fmt(t1,1)); ro.set(1,S.fmt(t2,1)); ro.set(2,S.fmt(need,2)+" m");
      if(Math.abs(t1-t2)<1e-9) nt.set("Équilibre : "+S.fmt(M1,0)+" × "+S.fmt(D1,1)+" = "+S.fmt(M2,0)+" × "+S.fmt(D2,1)+" = "+S.fmt(t1,1)+".","ok");
      else nt.set((t1>t2?"Ça penche à gauche : ":"Ça penche à droite : ")+S.fmt(t1,1)+" ≠ "+S.fmt(t2,1)+". Équation à résoudre : "+S.fmt(M1,0)+" × "+S.fmt(D1,1)+" = "+S.fmt(M2,0)+" × d, donc d = "+S.fmt(need,2)+(need>6?" (hors de la barre : essaie une autre masse).":"."),"warn");
    });
  }
});
