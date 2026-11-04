/* Chapitre 1 : exponentielles et logarithmes */
SFA.sim({
  id:"m6-c01-famille", ch:"c01", tag:"Classique",
  titre:"La famille a^x : croissance ou décroissance ?",
  resume:"Fais varier la base a et regarde la courbe, la pente en 0 et la symétrique de base 1/a.",
  but:"Déplace la base a. Observe quand la courbe monte, quand elle descend, et ce qui ne change jamais : le point (0 ; 1).",
  aRetenir:"Pour a > 0 et a ≠ 1, la courbe de y = a<sup>x</sup> passe toujours par (0 ; 1) et reste au-dessus de l'axe des x. Si a > 1 elle croît, si 0 < a < 1 elle décroît. La pente de la tangente en 0 vaut ln a ; elle vaut exactement 1 pour a = e ≈ 2,718.",
  piege:"a<sup>x</sup> n'est jamais négatif ni nul : l'équation a<sup>x</sup> = −3 n'a aucune solution. Et la base a = 1 donne la droite constante y = 1, ce n'est pas une « vraie » exponentielle.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7});
    var a=k.slider("Base a",0.2,4,0.05,2,"",null);
    var tg=k.toggle("Montrer la tangente en (0 ; 1)",true);
    var sy=k.toggle("Montrer la courbe de base 1/a (symétrique)",false);
    var ee=k.toggle("Comparer avec e^x (a = e)",false);
    var ro=k.readouts(["Sens","Pente en 0 (ln a)","Valeur en x = 2","Valeur en x = −1"]);
    var nt=k.note("","warn");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, A=a.value;
      var ax=S.draw.axes(c,{x0:-3,x1:3,y0:-1,y1:8,xl:"x",yl:"y",stepX:1,stepY:1});
      if(ee.value) S.draw.fn(c,ax,function(x){return Math.exp(x);},P.amber,2,[6,4]);
      if(sy.value && Math.abs(A-1)>1e-9) S.draw.fn(c,ax,function(x){return Math.pow(1/A,x);},P.grey,2,[4,4]);
      S.draw.fn(c,ax,function(x){return Math.pow(A,x);},P.acc,3);
      var m=Math.log(A);
      if(tg.value){ S.draw.fn(c,ax,function(x){return 1+m*x;},P.red,1.8); }
      S.draw.dot(c,ax.X(0),ax.Y(1),6,P.red);
      S.draw.text(c,"(0 ; 1)",ax.X(0)+34,ax.Y(1)+16,{size:12,color:P.red});
      ro.set(0,Math.abs(A-1)<1e-9?"constante":(A>1?"croît":"décroît"));
      ro.set(1,S.fmt(m,3)); ro.set(2,S.fmt(A*A,3)); ro.set(3,S.fmt(1/A,3));
      if(Math.abs(A-1)<0.03) nt.set("Base proche de 1 : la courbe est presque la droite y = 1 et la pente en 0 est presque nulle.","warn");
      else if(Math.abs(A-Math.E)<0.05) nt.set("Tu es près de a = e ≈ 2,718 : la tangente en (0 ; 1) a une pente proche de 1.","ok");
      else nt.set("Trouve la base pour laquelle la pente en 0 vaut 1. Indice : c'est un nombre célèbre, entre 2,6 et 2,8.","warn");
    });
  }
});

SFA.sim({
  id:"m6-c01-reciproque", ch:"c01", tag:"Classique",
  titre:"Exponentielle et logarithme : deux courbes en miroir",
  resume:"Glisse un point sur y = a^x : son symétrique par rapport à y = x est sur y = log_a(x).",
  but:"Glisse le point P sur la courbe exponentielle (souris ou curseur). Son symétrique Q par rapport à la droite y = x est sur la courbe du logarithme.",
  aRetenir:"y = log<sub>a</sub>(x) signifie a<sup>y</sup> = x. Les courbes de a<sup>x</sup> et de log<sub>a</sub>(x) sont symétriques par rapport à la droite y = x : si P(t ; a<sup>t</sup>) est sur l'une, Q(a<sup>t</sup> ; t) est sur l'autre. Le logarithme n'existe que pour x > 0.",
  piege:"Le domaine de log<sub>a</sub> est ]0 ; +∞[ : on ne peut pas prendre le logarithme d'un nombre négatif ou nul. Et log<sub>a</sub>(x) n'est pas 1/a<sup>x</sup> : c'est la réciproque, pas l'inverse.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85});
    var base=k.select("Base",[["2","a = 2"],["e","a = e (logarithme népérien)"],["10","a = 10 (logarithme décimal)"],["0.5","a = 1/2"]],"2");
    var t=k.slider("Abscisse t de P",-3,3,0.05,1,"",null);
    var ro=k.readouts(["P (t ; a^t)","Q (a^t ; t)","log_a(a^t)","Domaine de log"]);
    function B(){return base.value==="e"?Math.E:parseFloat(base.value);}
    k.draw(function(){
      c.clear(); var P=S.draw.palette, a=B(), T=t.value;
      var half=4.5, L=46,R=16,Tp=16,Bt=34, w=c.W-L-R, h=c.H-Tp-Bt;
      var yspan=2*half*h/w, ax=S.draw.axes(c,{x0:-half+1,x1:half+1,y0:1-yspan/2,y1:1+yspan/2,xl:"x",yl:"y",stepX:1,stepY:1});
      S.draw.line(c,ax.X(-10),ax.Y(-10),ax.X(10),ax.Y(10),P.grey,1.5,[6,5]);
      S.draw.fn(c,ax,function(x){return Math.pow(a,x);},P.acc,3);
      S.draw.fn(c,ax,function(x){return x>0?Math.log(x)/Math.log(a):NaN;},P.green,3);
      var py=Math.pow(a,T);
      S.draw.line(c,ax.X(T),ax.Y(py),ax.X(py),ax.Y(T),P.violet,1.5,[3,3]);
      S.draw.dot(c,ax.X(T),ax.Y(py),6,P.acc); S.draw.dot(c,ax.X(py),ax.Y(T),6,P.green);
      S.draw.text(c,"P",ax.X(T)-10,ax.Y(py)-12,{color:P.acc}); S.draw.text(c,"Q",ax.X(py)+10,ax.Y(T)+12,{color:P.green});
      S.draw.text(c,"a^x",ax.X(-3.7),ax.Y(Math.pow(a,-3.7))-10,{color:P.acc,size:12});
      S.draw.text(c,"y = x",ax.R-24,ax.Y(ax.x1)+12,{color:P.grey,size:12});
      ro.set(0,"("+S.fmt(T,2)+" ; "+S.fmt(py,3)+")"); ro.set(1,"("+S.fmt(py,3)+" ; "+S.fmt(T,2)+")");
      ro.set(2,S.fmt(Math.log(py)/Math.log(a),2)); ro.set(3,"x > 0");
      c._ax=ax;
    });
    c.pointer(function(type,p){ if(type==="down"||type==="drag"){ var ax=c._ax; if(!ax)return; var v=Math.max(-3,Math.min(3,ax.ix(p.x))); t.set(Math.round(v*20)/20); k.redraw(); } });
  }
});

SFA.sim({
  id:"m6-c01-echelle-log", ch:"c01", tag:"Échelle log",
  titre:"Échelle logarithmique : l'exponentielle devient une droite",
  resume:"Bascule l'axe vertical en échelle logarithmique et compare exponentielle et polynôme.",
  but:"Choisis un modèle, puis bascule l'axe vertical entre linéaire et logarithmique. Qui devient une droite ?",
  aRetenir:"Si y = C·b<sup>x</sup>, alors log y = log C + x·log b : en échelle logarithmique verticale, une exponentielle est une droite de pente log b. Une puissance comme x³ n'est jamais une droite dans ce repère. Le temps de doublement vaut ln 2 / ln b.",
  piege:"Sur une échelle logarithmique, des graduations égales signifient des multiplications égales (×10, ×10…), pas des additions égales. Et le zéro n'existe pas sur cet axe.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7});
    var mod=k.seg("Modèle",[["exp","y = 2·b^x"],["pol","y = 2·x³"]],"exp");
    var b=k.slider("Facteur b par unité de x",1.1,3,0.05,1.5,"",null);
    var ech=k.seg("Axe vertical",[["lin","Linéaire"],["log","Logarithmique"]],"lin");
    var ro=k.readouts(["y(10)","Doublement (ln 2/ln b)","Pente log₁₀ b","Rapport y(10)/y(5)"]);
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx;
      function f(x){return mod.value==="exp"?2*Math.pow(b.value,x):2*x*x*x;}
      var N=10, ymax=f(N), L=56,R=16,T=18,B=34, W=c.W,H=c.H;
      var X=function(x){return L+x/N*(W-L-R);};
      var Y, ticks=[], lab=[];
      if(ech.value==="lin"){
        var top=ymax*1.05; Y=function(y){return H-B-y/top*(H-T-B);};
        var st=Math.pow(10,Math.floor(Math.log10(top/4))); st*= (top/st>16?5:(top/st>8?2:1));
        for(var v=0;v<=top;v+=st){ticks.push(v);} 
      } else {
        var lo=Math.log10(1), hi=Math.ceil(Math.log10(ymax*1.05)); if(hi<2)hi=2;
        Y=function(y){return H-B-(Math.log10(Math.max(y,1e-9))-lo)/(hi-lo)*(H-T-B);};
        for(var e=0;e<=hi;e++){ticks.push(Math.pow(10,e));}
      }
      ctx.save(); ctx.font="600 11px Mulish, sans-serif"; ctx.fillStyle="#5f6b7a"; ctx.strokeStyle="#edf0f4"; ctx.textAlign="right"; ctx.textBaseline="middle";
      ticks.forEach(function(v){ctx.beginPath();ctx.moveTo(L,Y(v));ctx.lineTo(W-R,Y(v));ctx.stroke();ctx.fillText(S.fmt(v,0),L-5,Y(v));});
      ctx.textAlign="center"; ctx.textBaseline="top";
      for(var x=0;x<=N;x+=1){ctx.fillText(String(x),X(x),H-B+4);}
      ctx.strokeStyle="#8a95a3"; ctx.beginPath(); ctx.moveTo(L,T); ctx.lineTo(L,H-B); ctx.lineTo(W-R,H-B); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(L,T,W-L-R,H-T-B); ctx.clip(); ctx.strokeStyle=P.acc; ctx.lineWidth=3; ctx.beginPath();
      for(var i=0;i<=200;i++){var xx=N*i/200,yy=f(xx); if(ech.value==="log"&&yy<=0)continue; var px=X(xx),py=Y(yy); if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);} ctx.stroke(); ctx.restore();
      for(var j=0;j<=N;j++){ if(ech.value==="log"&&f(j)<=0)continue; S.draw.dot(c,X(j),Y(f(j)),4,P.red);} 
      S.draw.text(c,ech.value==="lin"?"axe vertical : linéaire":"axe vertical : logarithmique (×10 par graduation)",L+6,T+4,{size:12,align:"left",color:P.ink2});
      S.draw.text(c,"x",W-R-4,H-B-10,{size:12});
      ro.set(0,S.fmt(f(10),1));
      ro.set(1,mod.value==="exp"?S.fmt(Math.log(2)/Math.log(b.value),2)+" unités":"—");
      ro.set(2,mod.value==="exp"?S.fmt(Math.log10(b.value),3):"—");
      ro.set(3,S.fmt(f(10)/f(5),2));
    });
  }
});

SFA.sim({
  id:"m6-c01-demi-vie", ch:"c01", tag:"Niche utile",
  titre:"Datation : de la demi-vie au « âge » d'un échantillon",
  resume:"Fixe le pourcentage restant d'un noyau radioactif et lis l'âge, avec une marge d'erreur.",
  but:"Choisis un noyau puis le pourcentage de noyaux restants : la simulation résout (1/2)^(t/T) = p avec un logarithme et donne l'âge.",
  aRetenir:"N(t) = N₀·(1/2)<sup>t/T</sup>. Pour trouver t, on prend le logarithme : t = T·log₂(N₀/N) = T·ln(N₀/N)/ln 2. Après 10 demi-vies il reste environ 0,1 % des noyaux.",
  piege:"Avec peu de noyaux restants, une petite erreur de mesure sur le pourcentage donne une grosse erreur sur l'âge. Le carbone 14 ne sert que jusqu'à environ 50 000 ans (≈ 9 demi-vies).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.62});
    var nuc=k.select("Noyau",[["5730","Carbone 14 (T = 5 730 ans)"],["8.02","Iode 131 (T = 8,02 jours)"],["6.01","Technétium 99m (T = 6,01 h)"]],"5730");
    var unit={"5730":"ans","8.02":"jours","6.01":"heures"};
    var p=k.slider("Pourcentage restant p",0.5,100,0.5,25,"%",null);
    var ro=k.readouts(["Demi-vies écoulées","Âge t","Âge si p−1 %","Âge si p+1 %"]);
    var nt=k.note("","warn");
    function age(T,pp){return T*Math.log(100/pp)/Math.log(2);}
    k.draw(function(){
      c.clear(); var P=S.draw.palette, T=parseFloat(nuc.value), u=unit[nuc.value], pp=p.value;
      var ax=S.draw.axes(c,{x0:0,x1:10,y0:0,y1:100,xl:"demi-vies",yl:"% restant",stepX:1,stepY:20});
      S.draw.fn(c,ax,function(n){return 100*Math.pow(0.5,n);},P.acc,3);
      var n=Math.log(100/pp)/Math.log(2);
      S.draw.line(c,ax.X(0),ax.Y(pp),ax.X(n),ax.Y(pp),P.red,1.5,[4,4]);
      S.draw.line(c,ax.X(n),ax.Y(pp),ax.X(n),ax.Y(0),P.red,1.5,[4,4]);
      S.draw.dot(c,ax.X(n),ax.Y(pp),6,P.red);
      S.draw.text(c,"n = "+S.fmt(n,2),ax.X(Math.min(n,8.2))+4,ax.Y(pp)-14,{size:12,color:P.red,align:"left"});
      var t=age(T,pp); var hi=pp-1>0?age(T,pp-1):null; var lo=age(T,Math.min(100,pp+1));
      ro.set(0,S.fmt(n,2)); ro.set(1,S.fmt(t,T>100?0:2)+" "+u);
      ro.set(2,hi===null?"—":S.fmt(hi,T>100?0:2)); ro.set(3,S.fmt(lo,T>100?0:2));
      if(pp<1) nt.set("Moins de 1 % restant : la marge d'erreur explose, la datation n'est plus fiable.","warn");
      else if(n>9) nt.set("Plus de 9 demi-vies : il reste très peu de noyaux, la mesure devient imprécise.","warn");
      else nt.set("Essaie p = 50 % (1 demi-vie), 25 % (2 demi-vies), 12,5 % (3 demi-vies) et regarde l'âge.","ok");
    });
  }
});
