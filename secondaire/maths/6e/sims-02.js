/* Chapitre 2 : dérivation de exp et ln, croissances comparées, étude de fonctions */
SFA.sim({
  id:"m6-c02-exp-derivee", ch:"c02", tag:"Classique",
  titre:"Pourquoi e^x est égale à sa dérivée",
  resume:"Déplace un point sur a^x : la pente de la tangente est-elle égale à la hauteur ?",
  but:"Choisis une base a et déplace le point. Compare la pente de la tangente à la hauteur du point : le rapport pente/hauteur est constant et vaut ln a.",
  aRetenir:"(a<sup>x</sup>)' = ln a · a<sup>x</sup>. Le rapport pente / hauteur vaut ln a en tout point. Il vaut 1 pour a = e : c'est pour cela que (e<sup>x</sup>)' = e<sup>x</sup>. Avec une fonction composée : (e<sup>u(x)</sup>)' = u'(x)·e<sup>u(x)</sup>.",
  piege:"(e<sup>x</sup>)' ≠ x·e<sup>x−1</sup> : la règle des puissances (x<sup>n</sup>)' = n·x<sup>n−1</sup> concerne la variable en bas, pas en exposant.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7});
    var base=k.seg("Base a",[["2","a = 2"],["e","a = e"],["3","a = 3"],["0.5","a = 1/2"]],"e");
    var t=k.slider("Abscisse x du point",-2,2.4,0.05,1,"",null);
    var ro=k.readouts(["Hauteur f(x)","Pente f'(x)","Pente / hauteur","ln a"]);
    function B(){return base.value==="e"?Math.E:parseFloat(base.value);}
    k.draw(function(){
      c.clear(); var P=S.draw.palette, a=B(), x0=t.value, y0=Math.pow(a,x0), m=Math.log(a)*y0;
      var ax=S.draw.axes(c,{x0:-2.5,x1:3.5,y0:-2,y1:16,xl:"x",yl:"y",stepX:1,stepY:2});
      S.draw.fn(c,ax,function(x){return Math.pow(a,x);},P.acc,3);
      S.draw.fn(c,ax,function(x){return y0+m*(x-x0);},P.red,2);
      S.draw.line(c,ax.X(x0),ax.Y(0),ax.X(x0),ax.Y(y0),P.grey,1.2,[4,4]);
      S.draw.dot(c,ax.X(x0),ax.Y(y0),6,P.red);
      S.draw.text(c,"hauteur "+S.fmt(y0,2),ax.X(x0)+6,ax.Y(Math.max(y0/2,0.8)),{size:12,align:"left",color:P.grey});
      ro.set(0,S.fmt(y0,3)); ro.set(1,S.fmt(m,3)); ro.set(2,S.fmt(m/y0,3)); ro.set(3,S.fmt(Math.log(a),3));
      c._ax=ax;
    });
    c.pointer(function(type,p){ if((type==="down"||type==="drag")&&c._ax){ var v=Math.max(-2,Math.min(2.4,c._ax.ix(p.x))); t.set(Math.round(v*20)/20); k.redraw(); } });
  }
});

SFA.sim({
  id:"m6-c02-croissance", ch:"c02", tag:"Modèle · Niche utile",
  titre:"y' = k·y : croissance exponentielle, puis logistique",
  resume:"Ajuste k pour coller à des données, puis découvre la courbe en S et son point d'inflexion à K/2.",
  but:"Mode exponentiel : règle y₀ et k pour que la courbe passe près des 7 points mesurés. Mode logistique : règle k, y₀ et la capacité K et repère le point d'inflexion.",
  aRetenir:"Si la vitesse y' est proportionnelle à y, alors y(t) = y₀·e<sup>kt</sup>. Dans le modèle logistique y' = k·y·(1 − y/K) (modèle simplifié), la population tend vers K et la croissance est la plus rapide quand y = K/2 : c'est le point d'inflexion de la courbe en S.",
  piege:"Une croissance « exponentielle » ne dure jamais indéfiniment dans la réalité : les ressources sont limitées. Le modèle logistique est simplifié lui aussi (K constante, pas de variations aléatoires).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.66});
    var mod=k.seg("Modèle",[["exp","Exponentiel"],["log","Logistique"]],"exp");
    var kk=k.slider("Taux k",-0.5,1,0.01,0.2,"",null);
    var y0=k.slider("Valeur initiale y₀",1,10,0.1,2,"",null);
    var K=k.slider("Capacité K (logistique)",20,100,5,60,"",null);
    var ro=k.readouts(["Somme des carrés d'écart","y(6)","Vitesse y'(6)","Inflexion"]);
    var nt=k.note("","warn");
    var noise=[0.03,-0.04,0.02,-0.02,0.04,-0.03,0.01], data=[];
    for(var i=0;i<=6;i++) data.push(3*Math.exp(0.4*i)*(1+noise[i]));
    k.draw(function(){
      c.clear(); var P=S.draw.palette, m=mod.value, r=kk.value, Y0=y0.value, KK=K.value;
      function f(t){ return m==="exp" ? Y0*Math.exp(r*t) : KK/(1+((KK-Y0)/Y0)*Math.exp(-r*t)); }
      function fp(t){ return m==="exp" ? r*f(t) : r*f(t)*(1-f(t)/KK); }
      var T1=m==="exp"?6.5:20, Ytop=m==="exp"?40:KK*1.1;
      var ax=S.draw.axes(c,{x0:0,x1:T1,y0:0,y1:Ytop,xl:"t",yl:"y"});
      S.draw.fn(c,ax,f,P.acc,3);
      if(m==="exp"){
        var sce=0; data.forEach(function(d,i){S.draw.dot(c,ax.X(i),ax.Y(d),5,P.red); sce+=Math.pow(d-f(i),2);});
        ro.set(0,S.fmt(sce,2)); ro.set(3,"—");
        if(sce<2) nt.set("Bravo : la courbe colle aux données. Les mesures viennent de y = 3·e<sup>0,4t</sup>, avec un peu de bruit.","ok");
        else nt.set("Rapproche la courbe des points rouges. Indice : le premier point est proche de y₀ ; la croissance entre deux points est un facteur e<sup>k</sup>.","warn");
      } else {
        ro.set(0,"—");
        S.draw.line(c,ax.X(0),ax.Y(KK),ax.X(T1),ax.Y(KK),P.grey,1.2,[5,4]);
        S.draw.text(c,"K = "+S.fmt(KK,0),ax.X(T1)-6,ax.Y(KK)-10,{size:12,align:"right",color:P.grey});
        if(Y0<KK/2 && r>0){
          var ts=Math.log((KK-Y0)/Y0)/r;
          S.draw.line(c,ax.X(0),ax.Y(KK/2),ax.X(Math.min(ts,T1)),ax.Y(KK/2),P.red,1.4,[4,4]);
          if(ts<=T1){ S.draw.dot(c,ax.X(ts),ax.Y(KK/2),6,P.red); S.draw.text(c,"inflexion",ax.X(ts)+8,ax.Y(KK/2)+14,{size:12,align:"left",color:P.red}); }
          ro.set(3,"t = "+S.fmt(ts,2)+", y = "+S.fmt(KK/2,1));
          nt.set("Au point d'inflexion, y = K/2 et la vitesse y' = kK/4 = "+S.fmt(r*KK/4,2)+" est maximale.","ok");
        } else { ro.set(3,"hors du graphique"); nt.set(r<=0?"Avec k ≤ 0 la population ne croît pas.":"Ici y₀ ≥ K/2 : on est déjà après l'inflexion, la courbe est concave dès le départ.","warn"); }
      }
      ro.set(1,S.fmt(f(6),2)); ro.set(2,S.fmt(fp(6),2));
    });
  }
});

SFA.sim({
  id:"m6-c02-comparees", ch:"c02", tag:"Croissances comparées",
  titre:"Qui gagne à l'infini : e^x, x^n ou ln x ?",
  resume:"Trace x^n/e^x ou ln x/x et vois le quotient s'effondrer vers 0.",
  but:"Choisis le quotient puis fais grandir x. Même pour n = 5, l'exponentielle finit toujours par écraser la puissance.",
  aRetenir:"lim x<sup>n</sup>/e<sup>x</sup> = 0 quand x → +∞ (pour tout n) ; lim ln x / x<sup>n</sup> = 0 ; lim x<sup>n</sup>·e<sup>−x</sup> = 0. Ordre de croissance : ln x ≪ x<sup>n</sup> ≪ e<sup>x</sup>. Mais pour x petit, une puissance peut très bien être plus grande que e<sup>x</sup>.",
  piege:"Le quotient peut d'abord monter très haut avant de redescendre (pour n = 5 il vaut déjà 21 en x = 5). Dire « elle finit par gagner » ne veut pas dire « elle gagne tout de suite ».",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.62});
    var q=k.seg("Quotient",[["pe","x^n / e^x"],["lx","ln x / x^n"]],"pe");
    var n=k.slider("Exposant n",1,5,1,3,"",null);
    var x=k.slider("x",1,40,0.5,10,"",null);
    var ro=k.readouts(["Numérateur","Dénominateur","Quotient","x où le quotient est maximal"]);
    k.draw(function(){
      c.clear(); var P=S.draw.palette, N=n.value, X=x.value, mode=q.value;
      function num(v){return mode==="pe"?Math.pow(v,N):Math.log(v);} function den(v){return mode==="pe"?Math.exp(v):Math.pow(v,N);}
      function r(v){return num(v)/den(v);}
      var xmaxPt = mode==="pe"?N:Math.exp(1/N);
      var ymax = mode==="pe"?r(N)*1.15:r(xmaxPt)*1.2;
      var ax=S.draw.axes(c,{x0:0,x1:40,y0:0,y1:ymax,xl:"x",yl:"quotient",stepX:5});
      S.draw.fn(c,ax,function(v){return v>0?r(v):NaN;},P.acc,3);
      S.draw.line(c,ax.X(X),ax.Y(0),ax.X(X),ax.Y(Math.max(0,r(X))),P.red,1.4,[4,4]);
      S.draw.dot(c,ax.X(X),ax.Y(Math.max(0,r(X))),6,P.red);
      ro.set(0,S.sci(num(X))); ro.set(1,S.sci(den(X))); ro.set(2,S.sci(r(X),3)); ro.set(3,S.fmt(xmaxPt,2));
    });
  }
});

SFA.sim({
  id:"m6-c02-etude", ch:"c02", tag:"Étude guidée",
  titre:"Étude complète d'une fonction, étape par étape",
  resume:"Domaine, asymptotes, signe de f', extremum, inflexion : la courbe se construit à chaque étape.",
  but:"Choisis une fonction puis fais avancer les étapes. À chaque étape, la liste dit ce qu'il faut calculer et le graphique montre le résultat.",
  aRetenir:"Checklist : 1) domaine ; 2) limites aux bornes et asymptotes ; 3) f' et son signe ; 4) tableau de variation et extremum ; 5) f'' (6 h : concavité et inflexion) ; 6) courbe. On n'oublie jamais de vérifier le domaine avant de dériver un logarithme.",
  piege:"Une asymptote horizontale n'empêche pas la courbe de la couper. Et ln x / x tend vers 0 en +∞ : l'axe des x est asymptote, mais la courbe reste positive après x = 1.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.72});
    var E=Math.E;
    var F={
      A:{n:"f(x) = x·e^(−x)",f:function(x){return x*Math.exp(-x);},x0:-1.5,x1:7,y0:-1,y1:1,dom:"D = ℝ",
         lim:"lim(+∞) = 0 (croissances comparées) : asymptote y = 0. lim(−∞) = −∞ : pas d'asymptote.",
         der:"f'(x) = (1 − x)·e^(−x). Signe de 1 − x : f' &gt; 0 si x &lt; 1, f' &lt; 0 si x &gt; 1.",
         ext:"Maximum en x = 1 : f(1) = 1/e ≈ 0,368.",
         inf:"f''(x) = (x − 2)·e^(−x) : inflexion en x = 2, f(2) = 2/e² ≈ 0,271.",
         asv:null,ash:0,extx:1,infx:2,incr:[-1.5,1]},
      B:{n:"f(x) = ln(x) / x",f:function(x){return x>0?Math.log(x)/x:NaN;},x0:-0.5,x1:10,y0:-2,y1:0.6,dom:"D = ]0 ; +∞[",
         lim:"lim(0⁺) = −∞ : asymptote verticale x = 0. lim(+∞) = 0 : asymptote horizontale y = 0.",
         der:"f'(x) = (1 − ln x) / x². f' &gt; 0 si ln x &lt; 1, c'est-à-dire x &lt; e ; f' &lt; 0 si x &gt; e.",
         ext:"Maximum en x = e ≈ 2,718 : f(e) = 1/e ≈ 0,368.",
         inf:"f''(x) = (2 ln x − 3) / x³ : inflexion en x = e<sup>1,5</sup> ≈ 4,482, f ≈ 0,335.",
         asv:0,ash:0,extx:E,infx:Math.exp(1.5),incr:[0,E]},
      C:{n:"f(x) = x − ln(x)",f:function(x){return x>0?x-Math.log(x):NaN;},x0:-0.5,x1:6,y0:-0.5,y1:6,dom:"D = ]0 ; +∞[",
         lim:"lim(0⁺) = +∞ : asymptote verticale x = 0. En +∞, f(x) − x = −ln x → −∞ : pas d'asymptote oblique y = x ; f(x)/x → 1 mais la courbe s'éloigne de la droite.",
         der:"f'(x) = 1 − 1/x = (x − 1)/x. f' &lt; 0 si x &lt; 1 ; f' &gt; 0 si x &gt; 1.",
         ext:"Minimum en x = 1 : f(1) = 1.",
         inf:"f''(x) = 1/x² &gt; 0 : la courbe est convexe partout, pas d'inflexion.",
         asv:0,ash:null,extx:1,infx:null,incr:[1,6]},
      D:{n:"f(x) = e^x / x",f:function(x){return x!==0?Math.exp(x)/x:NaN;},x0:-4,x1:4,y0:-2,y1:12,dom:"D = ℝ \\ {0}",
         lim:"lim(0⁻) = −∞ ; lim(0⁺) = +∞ : asymptote verticale x = 0. lim(−∞) = 0⁻ : asymptote y = 0. lim(+∞) = +∞.",
         der:"f'(x) = e^x (x − 1) / x². Signe de x − 1 : f' &lt; 0 si x &lt; 1 (x ≠ 0), f' &gt; 0 si x &gt; 1.",
         ext:"Minimum local en x = 1 : f(1) = e ≈ 2,718.",
         inf:"f''(x) = e^x (x² − 2x + 2) / x³ : le trinôme est toujours positif, donc f'' a le signe de x : pas d'inflexion (x = 0 est hors du domaine).",
         asv:0,ash:0,extx:1,infx:null,incr:[1,4]}
    };
    var sel=k.select("Fonction",[["A","x·e^(−x)"],["B","ln(x) / x"],["C","x − ln(x)"],["D","e^x / x"]],"A");
    var st=k.slider("Étape (1 à 6)",1,6,1,1,"",null);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, d=F[sel.value], s=st.value;
      var ax=S.draw.axes(c,{x0:d.x0,x1:d.x1,y0:d.y0,y1:d.y1,xl:"x",yl:"y"});
      var col = s>=3 ? P.grey : P.acc;
      S.draw.fn(c,ax,d.f,col,3);
      if(s>=3){
        var ctx=c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip();
        function seg(a,b,color){ ctx.strokeStyle=color; ctx.lineWidth=4; ctx.beginPath(); var on=false; for(var i=0;i<=300;i++){var x=a+(b-a)*i/300,y=d.f(x); if(!isFinite(y)||Math.abs(ax.Y(y))>1e5){on=false;continue;} if(!on){ctx.moveTo(ax.X(x),ax.Y(y));on=true;}else ctx.lineTo(ax.X(x),ax.Y(y));} ctx.stroke(); }
        var lo=Math.max(d.x0,(sel.value==="B"||sel.value==="C")?1e-6:d.x0);
        // croissante en vert, décroissante en rouge
        var sw=d.extx;
        if(sel.value==="A"){ seg(d.x0,sw,P.green); seg(sw,d.x1,P.red); }
        else if(sel.value==="B"){ seg(0.0001,sw,P.green); seg(sw,d.x1,P.red); }
        else if(sel.value==="C"){ seg(0.0001,sw,P.red); seg(sw,d.x1,P.green); }
        else { seg(d.x0,-1e-6,P.red); seg(1e-6,sw,P.red); seg(sw,d.x1,P.green); }
        ctx.restore();
      }
      if(s>=2){ if(d.asv!==null) S.draw.line(c,ax.X(d.asv),ax.T,ax.X(d.asv),ax.B,P.amber,1.6,[6,4]); if(d.ash!==null) S.draw.line(c,ax.L,ax.Y(d.ash),ax.R,ax.Y(d.ash),P.amber,1.6,[6,4]); }
      if(s>=4){ var ey=d.f(d.extx); S.draw.dot(c,ax.X(d.extx),ax.Y(ey),7,P.violet); S.draw.text(c,"extremum",ax.X(d.extx)+8,ax.Y(ey)-14,{size:12,color:P.violet,align:"left"}); }
      if(s>=5 && d.infx!==null){ var iy=d.f(d.infx); S.draw.dot(c,ax.X(d.infx),ax.Y(iy),7,P.teal); S.draw.text(c,"inflexion",ax.X(d.infx)+8,ax.Y(iy)-14,{size:12,color:P.teal,align:"left"}); }
      S.draw.text(c,d.n,ax.L+8,ax.T+10,{size:13,align:"left",color:P.ink});
      var steps=["<b>1. Domaine.</b> "+d.dom+".","<b>2. Limites et asymptotes.</b> "+d.lim,"<b>3. Dérivée et signe.</b> "+d.der+" Vert = croissante, rouge = décroissante.","<b>4. Extremum.</b> "+d.ext,"<b>5. Dérivée seconde (6 h).</b> "+d.inf,"<b>6. Courbe complète.</b> Tu peux maintenant la tracer sans calculatrice : domaine, asymptotes, variations, extremum"+(d.infx!==null?", inflexion":"")+"."];
      var txt=""; for(var i=0;i<s;i++) txt+=(i?"<br>":"")+steps[i];
      nt.set(txt,"ok");
    });
  }
});
