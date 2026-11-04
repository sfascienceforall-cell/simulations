/* Chapitre 4 : intégrale définie, aires et volumes */
SFA.sim({
  id:"m6-c04-riemann", ch:"c04", tag:"Classique",
  titre:"Sommes de Riemann : des rectangles vers l'aire exacte",
  resume:"Augmente le nombre de rectangles : la somme se rapproche de l'intégrale calculée avec une primitive.",
  but:"Choisis une fonction, une méthode (gauche, droite, milieu) et le nombre n de rectangles. Compare la somme à la valeur exacte.",
  aRetenir:"∫<sub>a</sub><sup>b</sup> f(x) dx est la limite des sommes de rectangles quand n → +∞. Elle se calcule par F(b) − F(a) avec F une primitive de f. Pour une fonction croissante, la somme à gauche sous-estime et celle de droite surestime.",
  piege:"« À gauche » ne veut pas dire « trop petit » en général : cela dépend de la monotonie de f (pour une fonction décroissante, c'est l'inverse).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.62});
    var D={
      a:{lab:"x² sur [0 ; 3]",f:function(x){return x*x;},F:function(x){return x*x*x/3;},a:0,b:3,y1:10},
      b:{lab:"eˣ sur [0 ; 2]",f:function(x){return Math.exp(x);},F:function(x){return Math.exp(x);},a:0,b:2,y1:8},
      c:{lab:"sin x sur [0 ; π]",f:function(x){return Math.sin(x);},F:function(x){return -Math.cos(x);},a:0,b:Math.PI,y1:1.3},
      d:{lab:"1/x sur [1 ; 4]",f:function(x){return 1/x;},F:function(x){return Math.log(x);},a:1,b:4,y1:1.3}
    };
    var sel=k.select("Fonction",[["a","x² sur [0 ; 3]"],["b","eˣ sur [0 ; 2]"],["c","sin x sur [0 ; π]"],["d","1/x sur [1 ; 4]"]],"a");
    var met=k.seg("Hauteur des rectangles",[["g","gauche"],["m","milieu"],["d","droite"]],"g");
    var n=k.slider("Nombre de rectangles n",1,100,1,4,"",null);
    var ro=k.readouts(["Somme de Riemann","Intégrale exacte (par primitive)","Erreur","Largeur Δx"]);
    k.draw(function(){
      c.clear(); var P=S.draw.palette, d=D[sel.value], N=n.value, dx=(d.b-d.a)/N, ctx=c.ctx;
      var ax=S.draw.axes(c,{x0:Math.min(0,d.a-0.3),x1:d.b+0.3,y0:0,y1:d.y1,xl:"x",yl:"y"});
      var sum=0;
      for(var i=0;i<N;i++){
        var xl=d.a+i*dx, xr=xl+dx, xe=met.value==="g"?xl:(met.value==="d"?xr:(xl+xr)/2), h=d.f(xe); sum+=h*dx;
        ctx.fillStyle="rgba(30,63,143,.22)"; ctx.strokeStyle=P.acc; ctx.lineWidth=N>40?0.6:1.2;
        ctx.fillRect(ax.X(xl),ax.Y(h),ax.X(xr)-ax.X(xl),ax.Y(0)-ax.Y(h)); ctx.strokeRect(ax.X(xl),ax.Y(h),ax.X(xr)-ax.X(xl),ax.Y(0)-ax.Y(h));
      }
      S.draw.fn(c,ax,d.f,P.red,2.6);
      var ex=d.F(d.b)-d.F(d.a);
      ro.set(0,S.fmt(sum,4)); ro.set(1,S.fmt(ex,4)); ro.set(2,S.fmt(sum-ex,4)); ro.set(3,S.fmt(dx,3));
    });
  }
});

SFA.sim({
  id:"m6-c04-aire-entre-courbes", ch:"c04", tag:"Classique",
  titre:"Aire entre deux courbes",
  resume:"Déplace la parabole g : trouve les intersections, la courbe du dessus et l'aire.",
  but:"La courbe f(x) = 4 − x² est fixe. Règle g(x) = x² + p·x + q : l'aire colorée est calculée avec une primitive de f − g entre les abscisses d'intersection.",
  aRetenir:"Aire = ∫<sub>a</sub><sup>b</sup> (courbe du dessus − courbe du dessous) dx, où a et b sont les abscisses d'intersection. On trouve a et b en résolvant f(x) = g(x). Pour p = −2 et q = 0, les courbes se coupent en x = −1 et x = 2 et l'aire vaut 9.",
  piege:"Si tu inverses les courbes (dessous − dessus), tu obtiens un résultat négatif : une aire géométrique n'est jamais négative. Et on n'intègre pas f seule moins g seule sans regarder laquelle est au-dessus.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.72});
    var p=k.slider("p (g(x) = x² + p·x + q)",-3,3,0.1,-2,"",null);
    var q=k.slider("q",-4,2,0.1,0,"",null);
    var ro=k.readouts(["Abscisses d'intersection","∫ (f − g)","∫ (g − f)","Aire géométrique"]);
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, pp=p.value, qq=q.value;
      var disc=pp*pp-8*(qq-4); var sq=Math.sqrt(disc), r1=(-pp-sq)/4, r2=(-pp+sq)/4;
      var f=function(x){return 4-x*x;}, g=function(x){return x*x+pp*x+qq;};
      var ax=S.draw.axes(c,{x0:-3.5,x1:3.5,y0:-6,y1:6,xl:"x",yl:"y",stepX:1,stepY:2});
      ctx.save(); ctx.beginPath(); ctx.moveTo(ax.X(r1),ax.Y(f(r1)));
      for(var i=0;i<=80;i++){ var x=r1+(r2-r1)*i/80; ctx.lineTo(ax.X(x),ax.Y(f(x))); }
      for(i=80;i>=0;i--){ x=r1+(r2-r1)*i/80; ctx.lineTo(ax.X(x),ax.Y(g(x))); }
      ctx.closePath(); ctx.fillStyle="rgba(46,107,85,.25)"; ctx.fill(); ctx.restore();
      S.draw.fn(c,ax,f,P.acc,3); S.draw.fn(c,ax,g,P.red,3);
      S.draw.text(c,"f",ax.X(0.15),ax.Y(4)-12,{color:P.acc}); S.draw.text(c,"g",ax.X(3.2),ax.Y(g(3.2))-12,{color:P.red});
      [r1,r2].forEach(function(r){ S.draw.dot(c,ax.X(r),ax.Y(f(r)),6,P.violet); S.draw.line(c,ax.X(r),ax.Y(f(r)),ax.X(r),ax.Y(0),P.violet,1,[3,3]); });
      var H=function(x){return -2*x*x*x/3-pp*x*x/2+(4-qq)*x;};
      var I=H(r2)-H(r1);
      ro.set(0,S.fmt(r1,3)+" et "+S.fmt(r2,3)); ro.set(1,S.fmt(I,3)); ro.set(2,S.fmt(-I,3)); ro.set(3,S.fmt(Math.abs(I),3));
    });
  }
});

SFA.sim({
  id:"m6-c04-aire-algebrique", ch:"c04", tag:"Aire algébrique",
  titre:"L'intégrale compte les aires sous l'axe en négatif",
  resume:"Fais glisser la borne b : l'intégrale et l'aire géométrique ne sont pas la même chose.",
  but:"Fais glisser b. En haut, l'aire algébrique de 0 à b (vert au-dessus de l'axe, rouge en dessous). En bas, la fonction A(b) = ∫₀ᵇ f : sa pente en b est f(b).",
  aRetenir:"∫<sub>a</sub><sup>b</sup> f est une aire <i>algébrique</i> : positive au-dessus de l'axe, négative en dessous. Pour l'aire géométrique, on découpe aux zéros de f et on prend les valeurs absolues. De plus A(b) = ∫₀ᵇ f est une primitive de f : A'(b) = f(b) (théorème fondamental, démontré en 6 h).",
  piege:"Une intégrale nulle ne veut pas dire que l'aire est nulle : pour f(x) = x(x − 2)(x − 4), ∫<sub>0</sub><sup>4</sup> f = 0 car les deux bosses se compensent, mais l'aire géométrique vaut 8.",
  build:function(k,S){
    var cf=k.canvas(210), cA=k.canvas(170);
    var sel=k.seg("Fonction",[["p","f(x) = x(x − 2)(x − 4)"],["s","f(x) = sin x"]],"p");
    var b=k.slider("Borne b",0,4,0.05,2.5,"",null);
    var ro=k.readouts(["∫₀ᵇ f","Aire géométrique","f(b)","Pente de A en b"]);
    function f(x){return sel.value==="p"?x*(x-2)*(x-4):Math.sin(x);}
    function A(x){return sel.value==="p"?x*x*x*x/4-2*x*x*x+4*x*x:1-Math.cos(x);}
    function geo(x){ var n=Math.max(1,Math.round(x/0.002)), h=x/n, s=0; for(var i=0;i<n;i++){ s+=Math.abs(f((i+0.5)*h))*h; } return s; }
    k.draw(function(){
      var P=S.draw.palette, B=b.value, X1=sel.value==="p"?4.3:4.3, ctx=cf.ctx;
      cf.clear(); var ymax=sel.value==="p"?3.5:1.3;
      var ax=S.draw.axes(cf,{x0:-0.2,x1:X1,y0:-ymax,y1:ymax,xl:"x",yl:"f(x)",stepX:1,stepY:sel.value==="p"?1:0.5});
      var N=Math.max(2,Math.round(B/0.02));
      for(var i=0;i<N;i++){ var x0=B*i/N, x1=B*(i+1)/N, y=f((x0+x1)/2); ctx.fillStyle=y>=0?"rgba(46,107,85,.35)":"rgba(180,35,24,.3)"; ctx.fillRect(ax.X(x0),Math.min(ax.Y(0),ax.Y(y)),ax.X(x1)-ax.X(x0)+0.6,Math.abs(ax.Y(y)-ax.Y(0))); }
      S.draw.fn(cf,ax,f,P.acc,3); S.draw.line(cf,ax.X(B),ax.Y(0),ax.X(B),ax.Y(f(B)),P.ink,1.5); S.draw.dot(cf,ax.X(B),ax.Y(f(B)),6,P.ink);
      cA.clear(); var ax2=S.draw.axes(cA,{x0:-0.2,x1:X1,y0:sel.value==="p"?-1:-0.3,y1:sel.value==="p"?5:2.3,xl:"b",yl:"A(b)",stepX:1,stepY:sel.value==="p"?1:0.5});
      S.draw.fn(cA,ax2,function(x){return x>=0?A(x):NaN;},P.violet,3);
      var m=f(B); S.draw.line(cA,ax2.X(B-0.5),ax2.Y(A(B)-0.5*m),ax2.X(B+0.5),ax2.Y(A(B)+0.5*m),P.red,1.8);
      S.draw.dot(cA,ax2.X(B),ax2.Y(A(B)),6,P.red);
      ro.set(0,S.fmt(A(B),3)); ro.set(1,S.fmt(geo(B),3)); ro.set(2,S.fmt(m,3)); ro.set(3,S.fmt(m,3));
    });
  }
});

SFA.sim({
  id:"m6-c04-revolution", ch:"c04", tag:"Volumes",
  titre:"Solide de révolution : des disques empilés",
  resume:"Fais tourner une courbe autour de l'axe des x : le volume est une somme de disques.",
  but:"Choisis une courbe, la borne b et le nombre de disques n. La somme des volumes des disques s'approche de V = π∫ f(x)² dx.",
  aRetenir:"Le volume engendré par la rotation de y = f(x) autour de l'axe des x, de a à b, vaut V = π ∫<sub>a</sub><sup>b</sup> [f(x)]² dx : on empile des disques de rayon f(x) et d'épaisseur dx. Contrôle : pour f(x) = x/2 sur [0 ; 6], on retrouve le cône de rayon 3 et de hauteur 6 : V = ⅓π·3²·6 = 18π.",
  piege:"Le rayon est f(x), mais on intègre π·f(x)² : le carré est sur f, pas sur l'intégrale. Le carré de l'intégrale (∫f)² est autre chose.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.62});
    var D={
      a:{f:function(x){return x/2;},V:function(b){return Math.PI*b*b*b/12;},n:"cône : f(x) = x/2",ym:3},
      b:{f:function(x){return Math.sqrt(x);},V:function(b){return Math.PI*b*b/2;},n:"f(x) = √x",ym:2.4},
      c:{f:function(x){return Math.sin(x);},V:function(b){return Math.PI*(b/2-Math.sin(2*b)/4);},n:"f(x) = sin x",ym:1.4},
      d:{f:function(x){return x*x/4;},V:function(b){return Math.PI*Math.pow(b,5)/80;},n:"f(x) = x²/4",ym:4.2}
    };
    var sel=k.select("Courbe",[["a","cône : f(x) = x/2"],["b","f(x) = √x"],["c","f(x) = sin x"],["d","f(x) = x²/4"]],"a");
    var b=k.slider("Borne b",0.5,4,0.1,3,"",null);
    var n=k.slider("Nombre de disques n",1,40,1,6,"",null);
    var ro=k.readouts(["Somme des disques","Volume exact V","Erreur","Rayon en b"]);
    k.draw(function(){
      c.clear(); var P=S.draw.palette, d=D[sel.value], B=b.value, N=n.value, ctx=c.ctx, dx=B/N;
      var ax=S.draw.axes(c,{x0:-0.3,x1:4.4,y0:-d.ym,y1:d.ym,xl:"x",yl:"y",stepX:1,stepY:d.ym>3?1:0.5});
      var sum=0;
      for(var i=0;i<N;i++){
        var xm=(i+0.5)*dx, r=d.f(xm); sum+=Math.PI*r*r*dx;
        ctx.fillStyle="rgba(30,63,143,.16)"; ctx.strokeStyle="rgba(30,63,143,.55)"; ctx.lineWidth=N>25?0.5:1;
        ctx.fillRect(ax.X(i*dx),ax.Y(r),ax.X((i+1)*dx)-ax.X(i*dx),ax.Y(-r)-ax.Y(r)); ctx.strokeRect(ax.X(i*dx),ax.Y(r),ax.X((i+1)*dx)-ax.X(i*dx),ax.Y(-r)-ax.Y(r));
      }
      var xs=ax.X(B), ry=Math.abs(ax.Y(d.f(B))-ax.Y(0)); ctx.save(); ctx.strokeStyle=P.violet; ctx.lineWidth=2; ctx.beginPath(); ctx.ellipse(xs,ax.Y(0),Math.max(3,ry*0.28),ry,0,0,2*Math.PI); ctx.stroke(); ctx.restore();
      S.draw.fn(c,ax,d.f,P.red,3); S.draw.fn(c,ax,function(x){return -d.f(x);},P.red,3,[5,4]);
      var V=d.V(B);
      ro.set(0,S.fmt(sum,3)); ro.set(1,S.fmt(V,3)); ro.set(2,S.fmt(sum-V,3)); ro.set(3,S.fmt(d.f(B),3));
    });
  }
});
