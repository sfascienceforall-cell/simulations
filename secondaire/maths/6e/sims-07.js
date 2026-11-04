/* Chapitre 7 : statistique à deux variables */
(function(){
function reg(x,y){
  var n=x.length, mx=0,my=0,i; for(i=0;i<n;i++){mx+=x[i];my+=y[i];} mx/=n; my/=n;
  var sxx=0,sxy=0,syy=0; for(i=0;i<n;i++){ sxx+=(x[i]-mx)*(x[i]-mx); sxy+=(x[i]-mx)*(y[i]-my); syy+=(y[i]-my)*(y[i]-my); }
  var a=sxx>1e-12?sxy/sxx:NaN, b=isNaN(a)?NaN:my-a*mx, r=(sxx>1e-12&&syy>1e-12)?sxy/Math.sqrt(sxx*syy):NaN;
  return {n:n,mx:mx,my:my,sxx:sxx,sxy:sxy,syy:syy,a:a,b:b,r:r};
}
function words(S,r){ if(isNaN(r)) return "non défini"; var a=Math.abs(r), s=a>=0.9?"très forte":a>=0.7?"forte":a>=0.4?"moyenne":a>=0.2?"faible":"quasi nulle"; return s+(a>=0.2?(r>0?" positive":" négative"):""); }

SFA.sim({
  id:"m6-c07-nuage-droite", ch:"c07", tag:"Classique",
  titre:"Nuage de points, droite de régression et coefficient r",
  resume:"Déplace les points à la souris : la droite des moindres carrés et r se recalculent en direct.",
  but:"Glisse un point du nuage. Observe le point moyen G, la droite de régression de y en x et le coefficient de corrélation r. Essaie aussi les nuages prêts à l'emploi, dont la parabole.",
  aRetenir:"La droite de régression de y en x passe par le point moyen G(x̄ ; ȳ) et a pour pente a = s<sub>xy</sub> / s<sub>xx</sub>. Le coefficient de corrélation r est toujours compris entre −1 et 1 : proche de ±1, les points sont presque alignés ; proche de 0, il n'y a pas de relation <i>linéaire</i>. Le signe de r est celui de la pente.",
  piege:"r ≈ 0 ne veut pas dire « aucun lien » : le nuage en parabole a r = 0 alors que y dépend parfaitement de x. Et r n'est pas la pente de la droite.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7});
    var PRE={
      f:{x:[1,2,3,4,5,6,7,8,9],y:[1.8,1.99,3.1,3.9,5.5,5.7,7.1,7.7,8.7]},
      n:{x:[1,2,3,4,5,6,7,8,9],y:[5,2,7,3,6,4,7,2,5]},
      p:{x:[1,2,3,4,5,6,7,8,9],y:[1.8,4.95,7.2,8.55,9,8.55,7.2,4.95,1.8]},
      d:{x:[1,2,3,4,5,6,7,8,9],y:[8.9,8.5,7.6,7.7,6.2,5.5,4.8,3.8,2.9]}
    };
    var X=PRE.f.x.slice(), Y=PRE.f.y.slice(), ax=null, drag=-1;
    function load(key){ X=PRE[key].x.slice(); Y=PRE[key].y.slice(); }
    k.button("Corrélation forte +",function(){load("f");});
    k.button("Corrélation négative",function(){load("d");});
    k.button("Pas de lien",function(){load("n");});
    k.button("Parabole (y dépend de x !)",function(){load("p");});
    var show=k.toggle("Montrer la droite et le point moyen G",true);
    var ro=k.readouts(["Droite y = ax + b","r","Intensité du lien","Point moyen G"]);
    k.draw(function(){
      c.clear(); var P=S.draw.palette, R=reg(X,Y);
      ax=S.draw.axes(c,{x0:0,x1:10,y0:0,y1:10,xl:"x",yl:"y",stepX:1,stepY:1});
      if(show.value&&!isNaN(R.a)){ S.draw.fn(c,ax,function(x){return R.a*x+R.b;},P.red,2.6); S.draw.dot(c,ax.X(R.mx),ax.Y(R.my),7,P.violet); S.draw.text(c,"G",ax.X(R.mx)+12,ax.Y(R.my)-12,{color:P.violet}); }
      X.forEach(function(x,i){ S.draw.dot(c,ax.X(x),ax.Y(Y[i]),7,P.acc); });
      ro.set(0,isNaN(R.a)?"—":"y = "+S.fmt(R.a,2)+"·x "+(R.b<0?"− ":"+ ")+S.fmt(Math.abs(R.b),2)); ro.set(1,S.fmt(R.r,3)); ro.set(2,words(S,R.r)); ro.set(3,"("+S.fmt(R.mx,2)+" ; "+S.fmt(R.my,2)+")");
    });
    c.pointer(function(type,p){
      if(!ax) return;
      if(type==="down"){ var best=-1,bd=1e9; X.forEach(function(x,i){ var d=Math.hypot(ax.X(x)-p.x,ax.Y(Y[i])-p.y); if(d<bd){bd=d;best=i;} }); drag=bd<40?best:-1; }
      if((type==="down"||type==="drag")&&drag>=0){ X[drag]=Math.max(0,Math.min(10,Math.round(ax.ix(p.x)*10)/10)); Y[drag]=Math.max(0,Math.min(10,Math.round(ax.iy(p.y)*10)/10)); k.redraw(); }
      if(type==="up") drag=-1;
    });
  }
});

SFA.sim({
  id:"m6-c07-residus", ch:"c07", tag:"Moindres carrés",
  titre:"Règle toi-même la droite : somme des carrés des écarts",
  resume:"Ajuste pente et ordonnée : la somme des carrés est minimale pour la droite de régression.",
  but:"Pour 8 points fixes, règle la pente m et l'ordonnée p. Chaque carré a pour côté l'écart vertical entre un point et ta droite. Défi : fais descendre la somme des carrés à moins de 105 % de son minimum.",
  aRetenir:"L'écart (résidu) d'un point est e<sub>i</sub> = y<sub>i</sub> − (m·x<sub>i</sub> + p). La droite de régression est celle qui <i>minimise</i> la somme des carrés Σe<sub>i</sub>². Elle passe par le point moyen. Toute autre droite donne une somme plus grande. (6 h : démonstration par le calcul du minimum.)",
  piege:"Avec ton œil, tu minimises plutôt les distances perpendiculaires. La droite de régression minimise les écarts <i>verticaux</i> : régresser y en x et x en y donne deux droites différentes.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7});
    var X=[1,2,3,4,5,6,7,8], Y=[2.1,2.9,4.4,4.8,6.5,6.9,8.4,8.7], R=reg(X,Y);
    var m=k.slider("Pente m",-1,3,0.05,0.5,"",null), p=k.slider("Ordonnée p",-3,6,0.1,3,"",null);
    var sq=k.toggle("Montrer les carrés des écarts",true);
    k.button("Placer la droite des moindres carrés",function(){ m.set(Math.round(R.a*20)/20); p.set(Math.round(R.b*10)/10); },true);
    var ro=k.readouts(["Σ des carrés S(m ; p)","Minimum S<sub>min</sub>","S / S<sub>min</sub>","Droite de régression"]);
    var nt=k.note("","warn");
    var Smin=0; X.forEach(function(x,i){ var e=Y[i]-(R.a*x+R.b); Smin+=e*e; });
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, M=m.value, Pp=p.value;
      var ax=S.draw.axes(c,{x0:0,x1:10,y0:-1,y1:10,xl:"x",yl:"y",stepX:1,stepY:1});
      var Ssum=0;
      X.forEach(function(x,i){ var e=Y[i]-(M*x+Pp); Ssum+=e*e;
        if(sq.value){ var side=Math.abs(ax.Y(e)-ax.Y(0)); ctx.fillStyle="rgba(180,35,24,.16)"; ctx.strokeStyle="rgba(180,35,24,.7)"; ctx.lineWidth=1; var yy=ax.Y(M*x+Pp), yp=ax.Y(Y[i]); ctx.fillRect(ax.X(x),Math.min(yy,yp),side,side); ctx.strokeRect(ax.X(x),Math.min(yy,yp),side,side); }
        S.draw.line(c,ax.X(x),ax.Y(Y[i]),ax.X(x),ax.Y(M*x+Pp),P.red,1.6);
      });
      S.draw.fn(c,ax,function(x){return M*x+Pp;},P.acc,3);
      X.forEach(function(x,i){ S.draw.dot(c,ax.X(x),ax.Y(Y[i]),6,P.ink); });
      var ratio=Ssum/Smin;
      ro.set(0,S.fmt(Ssum,3)); ro.set(1,S.fmt(Smin,3)); ro.set(2,S.fmt(ratio,3)); ro.set(3,"y = "+S.fmt(R.a,3)+"·x + "+S.fmt(R.b,3));
      if(ratio<1.05) nt.set("Bravo : ta droite est à moins de 5 % du minimum. Compare avec y = "+S.fmt(R.a,2)+"x + "+S.fmt(R.b,2)+" : elle passe par G("+S.fmt(R.mx,2)+" ; "+S.fmt(R.my,2)+").","ok");
      else nt.set("S est "+S.fmt(ratio,2)+" fois le minimum. Fais passer ta droite près du point moyen G("+S.fmt(R.mx,2)+" ; "+S.fmt(R.my,2)+") et ajuste la pente.","warn");
    });
  }
});

SFA.sim({
  id:"m6-c07-anscombe", ch:"c07", tag:"Quatuor d'Anscombe",
  titre:"Mêmes statistiques, quatre nuages très différents",
  resume:"Quatre jeux de données ont la même droite et le même r. Regarde-les avant de te fier au chiffre.",
  but:"Passe d'un jeu de données à l'autre. Les moyennes, la droite de régression et r sont presque identiques, mais les nuages n'ont rien à voir.",
  aRetenir:"Un coefficient r ne remplace jamais le graphique. Ici les quatre jeux ont r ≈ 0,816 et la droite y ≈ 0,5x + 3. Pourtant : (I) lien linéaire correct ; (II) courbe, la droite est inadaptée ; (III) alignement parfait gâché par un point aberrant ; (IV) un seul point éloigné crée toute la corrélation. Toujours dessiner le nuage.",
  piege:"Un r élevé ne prouve pas que la relation est linéaire, ni que la droite est un bon modèle. Un seul point peut fabriquer ou détruire la corrélation.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7});
    var X123=[10,8,13,9,11,14,6,4,12,7,5];
    var D={
      I:{x:X123,y:[8.04,6.95,7.58,8.81,8.33,9.96,7.24,4.26,10.84,4.82,5.68],t:"Jeu I : nuage presque linéaire"},
      II:{x:X123,y:[9.14,8.14,8.74,8.77,9.26,8.10,6.13,3.10,9.13,7.26,4.74],t:"Jeu II : relation en courbe"},
      III:{x:X123,y:[7.46,6.77,12.74,7.11,7.81,8.84,6.08,5.39,8.15,6.42,5.73],t:"Jeu III : un point aberrant"},
      IV:{x:[8,8,8,8,8,8,8,19,8,8,8],y:[6.58,5.76,7.71,8.84,8.47,7.04,5.25,12.5,5.56,7.91,6.89],t:"Jeu IV : tout dépend d'un seul point"}
    };
    var sel=k.seg("Jeu de données",[["I","I"],["II","II"],["III","III"],["IV","IV"]],"I");
    var res=k.toggle("Montrer les écarts à la droite",false);
    var ro=k.readouts(["x̄ ; ȳ","Droite y = ax + b","r","Σ des carrés des écarts"]);
    k.draw(function(){
      c.clear(); var P=S.draw.palette, d=D[sel.value], R=reg(d.x,d.y);
      var ax=S.draw.axes(c,{x0:2,x1:20,y0:2,y1:14,xl:"x",yl:"y",stepX:2,stepY:2});
      S.draw.fn(c,ax,function(x){return R.a*x+R.b;},P.red,2.6);
      var S2=0; d.x.forEach(function(x,i){ var e=d.y[i]-(R.a*x+R.b); S2+=e*e; if(res.value) S.draw.line(c,ax.X(x),ax.Y(d.y[i]),ax.X(x),ax.Y(R.a*x+R.b),P.amber,1.6); S.draw.dot(c,ax.X(x),ax.Y(d.y[i]),6,P.acc); });
      S.draw.text(c,d.t,ax.L+8,ax.T+10,{size:13,align:"left"});
      ro.set(0,S.fmt(R.mx,2)+" ; "+S.fmt(R.my,2)); ro.set(1,"y = "+S.fmt(R.a,2)+"x + "+S.fmt(R.b,2)); ro.set(2,S.fmt(R.r,3)); ro.set(3,S.fmt(S2,2));
    });
  }
});

SFA.sim({
  id:"m6-c07-variable-cachee", ch:"c07", tag:"Corrélation ≠ causalité · Niche utile",
  titre:"Glaces et noyades : la variable cachée",
  resume:"Les ventes de glaces et les noyades sont corrélées. Retire l'effet de la température : la corrélation disparaît.",
  but:"Chaque point est un mois (données fictives). Les couleurs montrent la température. Active « Retirer l'effet de la température » : que devient la relation entre glaces et noyades ?",
  aRetenir:"Une forte corrélation entre deux variables ne prouve pas que l'une cause l'autre : une troisième variable (ici la température) peut agir sur les deux. Quand on neutralise cette variable cachée (on regarde les écarts à la droite de régression sur T), la corrélation entre glaces et noyades devient ≈ 0.",
  piege:"« Les glaces provoquent des noyades » est une conclusion fausse tirée d'une vraie corrélation. Pour prouver une causalité, il faut une expérience contrôlée ou une explication par un mécanisme, pas seulement un r élevé. (Données fictives, construites pour l'exemple.)",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.72});
    var T=[3,4,8,12,16,20,23,22,18,13,7,4], eG=[0.4,-0.6,0.5,-0.3,0.7,-0.5,0.2,0.6,-0.4,-0.2,0.3,-0.7], eN=[0.35,-0.5,-0.2,0.5,0.1,0.2,-0.3,0.4,0.5,0.3,-0.6,-0.4];
    var G=T.map(function(t,i){return 2+0.9*t+eG[i];}), N=T.map(function(t,i){return 1+0.35*t+eN[i];});
    var corr=k.toggle("Retirer l'effet de la température",false);
    var ro=k.readouts(["r (glaces, noyades)","Pente a","r avec température (glaces)","r avec température (noyades)"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, xs=G, ys=N, xl="Glaces vendues (centaines/jour)", yl="Noyades (par mois)";
      var rg=reg(T,G), rn=reg(T,N);
      if(corr.value){ xs=G.map(function(g,i){return g-(rg.a*T[i]+rg.b);}); ys=N.map(function(n,i){return n-(rn.a*T[i]+rn.b);}); }
      var R=reg(xs,ys);
      var ax=corr.value?S.draw.axes(c,{x0:-2,x1:2,y0:-2,y1:2,xl:"écart glaces",yl:"écart noyades",stepX:1,stepY:1}):S.draw.axes(c,{x0:0,x1:25,y0:0,y1:10,xl:"glaces",yl:"noyades",stepX:5,stepY:2});
      S.draw.fn(c,ax,function(x){return R.a*x+R.b;},P.red,2.6);
      xs.forEach(function(x,i){ var t=(T[i]-3)/20, col="rgb("+Math.round(30+200*t)+","+Math.round(63-20*t)+","+Math.round(143-110*t)+")"; S.draw.dot(c,ax.X(x),ax.Y(ys[i]),7,col); });
      S.draw.text(c,"bleu = mois froid, rouge = mois chaud",ax.L+8,ax.T+10,{size:12,align:"left",color:P.ink});
      ro.set(0,S.fmt(R.r,3)); ro.set(1,S.fmt(R.a,3)); ro.set(2,S.fmt(reg(T,G).r,3)); ro.set(3,S.fmt(reg(T,N).r,3));
      if(corr.value) nt.set("Une fois la température neutralisée, r ≈ "+S.fmt(R.r,2)+" : glaces et noyades n'ont plus de lien. La température expliquait tout.","ok");
      else nt.set("r = "+S.fmt(R.r,2)+" : très forte corrélation, mais ce sont les mois chauds (rouge) qui concentrent glaces ET noyades.","warn");
    });
  }
});
})();
