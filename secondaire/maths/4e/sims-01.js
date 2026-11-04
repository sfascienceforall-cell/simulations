(function(){
var P = SFA.draw.palette;
var BASE = {
  x:  {n:"f(x) = x",   f:function(u){return u;}},
  sq: {n:"f(x) = x²",  f:function(u){return u*u;}},
  cu: {n:"f(x) = x³",  f:function(u){return u*u*u;}},
  inv:{n:"f(x) = 1/x", f:function(u){return Math.abs(u)<0.02?NaN:1/u;}},
  rt: {n:"f(x) = √x",  f:function(u){return u<0?NaN:Math.sqrt(u);}},
  ab: {n:"f(x) = |x|", f:function(u){return Math.abs(u);}}
};
var OPTS = Object.keys(BASE).map(function(k){return [k, BASE[k].n];});
function arg(h){ return h===0 ? "x" : (h>0 ? "x − "+SFA.fmt(h) : "x + "+SFA.fmt(-h)); }
function cbrt(v){ return v<0 ? -Math.pow(-v,1/3) : Math.pow(v,1/3); }

SFA.sim({
  id:"m4-c01-transformations", ch:"c01", tag:"Classique",
  titre:"Transformer une fonction : a·f(x − h) + k",
  resume:"Choisis une fonction de base et fais varier a, h, k : le graphe, le domaine, l'image et les zéros suivent.",
  but:"Choisis f, puis bouge a, h et k. Observe ce que fait chaque paramètre à la courbe grise (f) pour donner la courbe bleue (g).",
  aRetenir:"g(x) = a·f(x − h) + k : h décale vers la droite (si h > 0), k vers le haut, a étire verticalement et, si a < 0, retourne la courbe par rapport à l'axe des x.",
  piege:"Dans f(x − 2), la courbe se décale de 2 vers la DROITE (on cherche la valeur de x qui redonne l'ancien argument : x − 2 = 0 ⇒ x = 2).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.78});
    var fs=k.select("Fonction de base f",OPTS,"sq");
    var a=k.slider("a (étirement, signe)",-3,3,0.5,1,"");
    var h=k.slider("h (translation horizontale)",-5,5,0.5,0,"");
    var kk=k.slider("k (translation verticale)",-5,5,0.5,0,"");
    var ro=k.readouts(["Équation de g","Domaine","Image","Zéros de g"]);
    k.button("Remettre à zéro",function(){a.set(1);h.set(0);kk.set(0);},false);
    k.draw(function(){
      var B=BASE[fs.value], A=a.value,H=h.value,K=kk.value;
      c.clear();
      var ax=S.draw.axes(c,{x0:-8,x1:8,y0:-6.2,y1:6.2,xl:"x",yl:"y",stepX:2,stepY:2});
      S.draw.fn(c,ax,B.f,P.grey,2,[6,4]);
      S.draw.fn(c,ax,function(x){return A*B.f(x-H)+K;},P.acc,3);
      S.draw.text(c,"f",ax.X(6.2),ax.Y(Math.max(-5.5,Math.min(5.5,B.f(6.2)))) - 10,{color:P.grey,size:13});
      /* équation */
      var ar=arg(H), pre = A===1 ? "" : (A===-1 ? "−" : S.fmt(A)+"·");
      var inner={x:ar, sq:(H===0?"x":"("+ar+")")+"²", cu:(H===0?"x":"("+ar+")")+"³", inv:"1/"+(H===0?"x":"("+ar+")"), rt:"√("+ar+")", ab:"|"+ar+"|"}[fs.value];
      var eq = A===0 ? S.fmt(K) : pre+inner+(K===0?"":(K>0?" + ":" − ")+S.fmt(Math.abs(K)));
      ro.set(0,"g(x) = "+eq);
      var dom = (fs.value==="inv") ? "ℝ \\ {"+S.fmt(H)+"}" : (fs.value==="rt" ? "["+S.fmt(H)+" ; +∞[" : "ℝ");
      if(A===0) dom="ℝ (g est constante)";
      ro.set(1,dom);
      var img;
      if(A===0) img="{"+S.fmt(K)+"}";
      else if(fs.value==="x"||fs.value==="cu") img="ℝ";
      else if(fs.value==="inv") img="ℝ \\ {"+S.fmt(K)+"}";
      else img = A>0 ? "["+S.fmt(K)+" ; +∞[" : "]−∞ ; "+S.fmt(K)+"]";
      ro.set(2,img);
      var z="";
      if(A===0) z = K===0 ? "tout ℝ" : "aucun";
      else {
        var r=-K/A, us=[];
        switch(fs.value){
          case "x": us=[r]; break;
          case "sq": if(r>1e-12) us=[-Math.sqrt(r),Math.sqrt(r)]; else if(Math.abs(r)<1e-12) us=[0]; break;
          case "cu": us=[cbrt(r)]; break;
          case "inv": if(Math.abs(r)>1e-12) us=[1/r]; break;
          case "rt": if(r>=-1e-12) us=[r*r]; break;
          case "ab": if(r>1e-12) us=[-r,r]; else if(Math.abs(r)<1e-12) us=[0]; break;
        }
        z = us.length ? us.map(function(u){return S.fmt(H+u,2);}).join(" ; ") : "aucun";
      }
      ro.set(3,z);
    });
  }
});

/* ---------- lecture de graphe ---------- */
var LG = {
  cub:{n:"Cubique", f:function(x){return (x+2)*(x-1)*(x-3)/4;}, x0:-3.5,x1:4, y0:-12,y1:8, z:"−2 ; 1 ; 3"},
  abs:{n:"Valeur absolue", f:function(x){return Math.abs(x-1)-2;}, x0:-4,x1:6, y0:-4,y1:5, z:"−1 ; 3"},
  par:{n:"Parabole", f:function(x){return -0.5*(x+1)*(x+1)+4;}, x0:-6,x1:4, y0:-8,y1:5, z:"−1 − √8 ≈ −3,83 ; −1 + √8 ≈ 1,83"}
};
SFA.sim({
  id:"m4-c01-lecture", ch:"c01", tag:"Classique",
  titre:"Lire un graphe : un point qui se promène",
  resume:"Déplace un point sur la courbe : coordonnées, signe, croissance et extremum se lisent en direct.",
  but:"Fais glisser le curseur x (ou touche la courbe) et complète : f(x) est-il positif, négatif, nul ? La fonction monte-t-elle ou descend-elle ?",
  aRetenir:"Les zéros sont les abscisses où la courbe coupe l'axe des x. Le signe de f se lit sur la hauteur de la courbe. La fonction est croissante là où la courbe monte quand x augmente.",
  piege:"« Croissante » ne veut pas dire « positive » : une fonction peut monter tout en restant négative. Et f(x) = 0 (zéros) n'est pas f(0) (ordonnée à l'origine).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.72});
    var sel=k.select("Courbe",[["cub","Cubique"],["abs","Valeur absolue"],["par","Parabole"]],"cub",function(){
      var L=LG[sel.value]; xs.el.min=L.x0; xs.el.max=L.x1; xs.set((L.x0+L.x1)/2);
    });
    var xs=k.slider("x",-3.5,4,0.1,-1,"");
    var ro=k.readouts(["Point (x ; f(x))","Signe de f(x)","Variation en ce point","Zéros de f"]);
    var ax=null;
    c.pointer(function(t,p){ if(t==="move"||!ax)return; var L=LG[sel.value]; var v=ax.ix(p.x); v=Math.max(L.x0,Math.min(L.x1,Math.round(v*10)/10)); xs.set(v); k.redraw(); });
    k.draw(function(){
      var L=LG[sel.value], f=L.f, x=Math.max(L.x0,Math.min(L.x1,xs.value));
      c.clear();
      ax=S.draw.axes(c,{x0:L.x0,x1:L.x1,y0:L.y0,y1:L.y1,xl:"x",yl:"y"});
      S.draw.fn(c,ax,f,P.acc,3);
      var y=f(x), px=ax.X(x), py=ax.Y(y), col = y>1e-9?P.green:(y<-1e-9?P.red:P.amber);
      S.draw.line(c,px,ax.Y(0),px,py,col,2,[4,3]);
      S.draw.line(c,ax.L,py,px,py,P.grey,1,[3,3]);
      S.draw.dot(c,px,py,7,col);
      var e=0.02, s=(f(x+e)-f(x-e))/(2*e);
      var t = Math.abs(s)<0.05 ? "extremum ou palier" : (s>0?"croissante ↗":"décroissante ↘");
      var z=Math.abs(y)<1e-9;
      ro.set(0,"("+S.fmt(x,1)+" ; "+S.fmt(y,2)+")");
      ro.set(1, z ? "f(x) = 0 : un zéro" : (y>0?"f(x) > 0":"f(x) < 0"));
      ro.set(2,t);
      ro.set(3,L.z);
    });
  }
});

/* ---------- parité ---------- */
var PA = {
  sq:{n:"x²", f:function(x){return x*x;}},
  cu:{n:"x³", f:function(x){return x*x*x;}},
  mix:{n:"x² + x", f:function(x){return x*x+x;}},
  ab:{n:"|x|", f:function(x){return Math.abs(x);}},
  cx:{n:"x³ − 3x", f:function(x){return x*x*x-3*x;}},
  q4:{n:"x⁴ − 3x² + 1", f:function(x){return x*x*x*x-3*x*x+1;}},
  inv:{n:"1/x", f:function(x){return 1/x;}},
  sh:{n:"x² + 2", f:function(x){return x*x+2;}},
  sx:{n:"(x − 1)²", f:function(x){return (x-1)*(x-1);}}
};
SFA.sim({
  id:"m4-c01-parite", ch:"c01", tag:"Symétries",
  titre:"Pair, impair ou ni l'un ni l'autre ?",
  resume:"Compare f(a) et f(−a), puis regarde la courbe se refléter par rapport à l'axe y ou à l'origine.",
  but:"Choisis une fonction et un nombre a. Compare f(a) et f(−a). Active les symétries : la courbe pointillée se superpose-t-elle à la courbe pleine ?",
  aRetenir:"f est paire si f(−x) = f(x) pour tout x (courbe symétrique par rapport à l'axe y). f est impaire si f(−x) = −f(x) (symétrique par rapport à l'origine).",
  piege:"Un seul x qui « marche » ne prouve rien : il faut f(−x) = f(x) (ou −f(x)) pour TOUS les x du domaine. Et la plupart des fonctions ne sont ni paires ni impaires.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.75});
    var sel=k.select("Fonction",Object.keys(PA).map(function(i){return [i,"f(x) = "+PA[i].n];}),"cx");
    var av=k.slider("a",0.2,3,0.1,1.5,"");
    var t1=k.toggle("Symétrique par rapport à l'axe y (pointillé orange)",true);
    var t2=k.toggle("Symétrique par rapport à l'origine (pointillé vert)",false);
    var ro=k.readouts(["f(a)","f(−a)","−f(a)","Verdict"]);
    k.draw(function(){
      var f=PA[sel.value].f, a=av.value;
      c.clear();
      var ax=S.draw.axes(c,{x0:-4,x1:4,y0:-6,y1:6,xl:"x",yl:"y",stepX:1,stepY:2});
      if(t1.value) S.draw.fn(c,ax,function(x){return f(-x);},P.amber,2.2,[5,4]);
      if(t2.value) S.draw.fn(c,ax,function(x){return -f(-x);},P.green,2.2,[2,4]);
      S.draw.fn(c,ax,f,P.acc,3);
      var fa=f(a), fm=f(-a);
      S.draw.dot(c,ax.X(a),ax.Y(fa),6,P.acc); S.draw.dot(c,ax.X(-a),ax.Y(fm),6,P.red);
      var even=true,odd=true;
      for(var x=0.25;x<=4;x+=0.25){ if(Math.abs(f(x)-f(-x))>1e-9) even=false; if(Math.abs(f(x)+f(-x))>1e-9) odd=false; }
      ro.set(0,S.fmt(fa,2)); ro.set(1,S.fmt(fm,2)); ro.set(2,S.fmt(-fa,2));
      ro.set(3, even ? "paire" : (odd ? "impaire" : "ni paire ni impaire"));
    });
  }
});

/* ---------- résolution graphique ---------- */
SFA.sim({
  id:"m4-c01-resolution", ch:"c01", tag:"Graphique",
  titre:"Résoudre f(x) = g(x) et f(x) > g(x) sur le graphique",
  resume:"La parabole f(x) = 0,5x² − 2 et la droite g(x) = m·x + p : les solutions apparaissent là où elles se croisent.",
  but:"Fais varier la pente m et l'ordonnée p de la droite. Les solutions de f(x) = g(x) sont les abscisses des points d'intersection ; la zone verte sur l'axe x donne f(x) > g(x).",
  aRetenir:"Résoudre f(x) = g(x) : lire les abscisses des intersections. Résoudre f(x) > g(x) : lire où la courbe de f est au-dessus de celle de g.",
  piege:"La solution est l'abscisse (x) du point d'intersection, pas son ordonnée. Et selon la droite, il y a 0, 1 ou 2 solutions.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.78});
    var m=k.slider("m (pente de g)",-3,3,0.5,1,"");
    var p=k.slider("p (ordonnée à l'origine de g)",-6,4,0.5,0,"");
    var ro=k.readouts(["Équation f(x) = g(x)","Solutions","f(x) > g(x) pour"]);
    var nt=k.note("","");
    k.draw(function(){
      var M=m.value,Pp=p.value;
      var f=function(x){return 0.5*x*x-2;}, g=function(x){return M*x+Pp;};
      c.clear();
      var ax=S.draw.axes(c,{x0:-6,x1:6,y0:-5,y1:7,xl:"x",yl:"y",stepX:1,stepY:2});
      /* zones f>g sur l'axe x */
      var D=M*M+2*(2+Pp);   /* 0,5x² − Mx − (2+p) = 0  <=>  x² − 2Mx − 2(2+p) = 0 ; Δ/4 = M² + 2(2+p) */
      var txt, sols;
      c.ctx.save(); c.ctx.fillStyle="rgba(46,107,85,.25)";
      var yb=ax.Y(0)-0, h0=ax.B;
      function band(x1,x2){ var a1=Math.max(x1,ax.x0), a2=Math.min(x2,ax.x1); if(a2>a1) c.ctx.fillRect(ax.X(a1),ax.T,ax.X(a2)-ax.X(a1),ax.B-ax.T); }
      if(D>1e-9){ var r=Math.sqrt(D), x1=M-r, x2=M+r; band(-1e9,x1); band(x2,1e9); sols="x₁ ≈ "+S.fmt(x1,2)+" et x₂ ≈ "+S.fmt(x2,2); txt="]−∞ ; "+S.fmt(x1,2)+"[ ∪ ]"+S.fmt(x2,2)+" ; +∞["; }
      else if(Math.abs(D)<=1e-9){ band(-1e9,M); band(M,1e9); sols="x = "+S.fmt(M,2)+" (tangente)"; txt="tout réel sauf "+S.fmt(M,2); }
      else { band(-1e9,1e9); sols="aucune"; txt="tout réel ℝ"; }
      c.ctx.restore();
      S.draw.fn(c,ax,f,P.acc,3); S.draw.fn(c,ax,g,P.red,2.6);
      if(D>=-1e-9){ var rr=Math.sqrt(Math.max(0,D)); [M-rr,M+rr].forEach(function(x,i){ if(i===1&&rr<1e-6)return; if(x>=ax.x0&&x<=ax.x1&&g(x)>=ax.y0&&g(x)<=ax.y1){ S.draw.dot(c,ax.X(x),ax.Y(g(x)),6,P.ink); S.draw.line(c,ax.X(x),ax.Y(g(x)),ax.X(x),ax.Y(0),P.ink,1,[3,3]); } }); }
      S.draw.text(c,"f",ax.X(-5),ax.Y(0.5*25-2)+12,{color:P.acc}); 
      S.draw.text(c,"g",ax.X(5.4),ax.Y(Math.max(-4.5,Math.min(6.5,g(5.4))))-10,{color:P.red});
      var rhs = M===0 ? S.fmt(Pp) : ((M===1?"":(M===-1?"−":S.fmt(M)))+"x"+(Pp===0?"":(Pp<0?" − "+S.fmt(-Pp):" + "+S.fmt(Pp))));
      ro.set(0,"0,5x² − 2 = "+rhs);
      ro.set(1,sols); ro.set(2,txt);
      nt.set(D>1e-9 ? "Deux points d'intersection : deux solutions." : (Math.abs(D)<=1e-9 ? "La droite est tangente à la parabole : une seule solution." : "La droite passe sous la parabole sans la toucher : aucune solution."), D>1e-9?"ok":(Math.abs(D)<=1e-9?"warn":"bad"));
    });
  }
});

/* ---------- devine la fonction ---------- */
SFA.sim({
  id:"m4-c01-devine", ch:"c01", tag:"Défi",
  titre:"Devine la courbe cachée",
  resume:"Une courbe cachée (pointillés) : ajuste a, h, k pour la recouvrir parfaitement.",
  but:"Une courbe cible est tracée en pointillé orange. Choisis la bonne fonction de base puis règle a, h et k jusqu'à ce que ta courbe bleue la recouvre. Objectif : écart nul.",
  aRetenir:"Méthode : repère d'abord le sommet ou le point de départ (h ; k), puis regarde si la courbe monte ou descend (signe de a), puis ajuste l'ouverture (valeur de a).",
  piege:"Si ta courbe est symétrique de la cible, tu as le mauvais signe de a ; si elle est décalée de l'autre côté, vérifie le signe de h dans f(x − h).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.78});
    var T={f:"sq",a:2,h:1,k:-2};
    var fs=k.select("Fonction de base",[["sq","x²"],["ab","|x|"],["rt","√x"],["cu","x³"]],"sq");
    var a=k.slider("a",-3,3,0.5,1,"");
    var h=k.slider("h",-4,4,0.5,0,"");
    var kk=k.slider("k",-4,4,0.5,0,"");
    var ro=k.readouts(["Écart moyen","Statut"]);
    var nt=k.note("Règle les trois paramètres.","");
    var shown=false;
    function rnd(arr){return arr[Math.floor(Math.random()*arr.length)];}
    function neu(){ T={f:rnd(["sq","ab","rt","cu"]),a:rnd([-2,-1.5,-1,-0.5,0.5,1,1.5,2]),h:rnd([-3,-2,-1,0,1,2,3]),k:rnd([-3,-2,-1,0,1,2,3])}; shown=false; }
    k.button("Nouvelle courbe",function(){neu();},true);
    k.button("Montrer la solution",function(){ shown=true; });
    var F={sq:function(u){return u*u;},ab:Math.abs,rt:function(u){return u<0?NaN:Math.sqrt(u);},cu:function(u){return u*u*u;}};
    neu();
    k.draw(function(){
      c.clear();
      var ax=S.draw.axes(c,{x0:-8,x1:8,y0:-6.2,y1:6.2,xl:"x",yl:"y",stepX:2,stepY:2});
      var tg=function(x){return T.a*F[T.f](x-T.h)+T.k;}, mine=function(x){return a.value*F[fs.value](x-h.value)+kk.value;};
      S.draw.fn(c,ax,tg,P.amber,4,[7,5]);
      S.draw.fn(c,ax,mine,P.acc,2.4);
      var s=0,n=0;
      for(var x=-6;x<=6.001;x+=0.25){ var u=tg(x),v=mine(x); if(isNaN(u)&&isNaN(v))continue; if(isNaN(u)||isNaN(v)){s+=3;n++;continue;} s+=Math.min(3,Math.abs(u-v)); n++; }
      var err=s/n;
      ro.set(0,S.fmt(err,2));
      var ok = err<0.005;
      ro.set(1, ok ? "Bravo !" : (err<0.5?"Presque":"Continue"));
      if(shown){ nt.set("Solution : g(x) = "+S.fmt(T.a)+"·f(x − "+S.fmt(T.h)+") + "+S.fmt(T.k)+" avec f(x) = "+({sq:"x²",ab:"|x|",rt:"√x",cu:"x³"})[T.f]+".","warn"); }
      else nt.set(ok?"Les deux courbes sont confondues : tu as trouvé a, h, k et la bonne fonction de base.":"Astuce : commence par le sommet / point de départ (h ; k).",ok?"ok":"");
    });
  }
});
})();
