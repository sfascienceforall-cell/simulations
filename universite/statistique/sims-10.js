(function(){
/* Outils statistiques locaux (aucune dépendance externe) */
var ST = (function(){
  var T = {};
  T.rng = function(seed){ var a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  T.randn = function(r){ var u = 0, v = 0; while (u === 0) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  T.erf = function(x){ var s = x < 0 ? -1 : 1; x = Math.abs(x); var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
  T.lgam = function(x){ var c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    var y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); var s = 1.000000000190015; for (var j = 0; j < 6; j++) s += c[j] / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
  /* loi normale : cdf précise (fraction continue / série de Cody simplifiée via erfc de haute précision) */
  T.erfc = function(x){ var z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; };
  T.ncdf = function(x){ return 0.5 * T.erfc(-x / Math.SQRT2); };
  T.npdf = function(x){ return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); };
  T.nppf = function(p){ var lo = -10, hi = 10; for (var i = 0; i < 80; i++){ var m = (lo + hi) / 2; if (T.ncdf(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
  function betacf(a, b, x){ var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; var h = d;
    for (var m = 1; m <= 300; m++){ var m2 = 2 * m, aa = m * (b - m) * x / ((qam + m2) * (a + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; var del = d * c; h *= del; if (Math.abs(del - 1) < 3e-14) break; } return h; }
  T.betai = function(a, b, x){ if (x <= 0) return 0; if (x >= 1) return 1; var bt = Math.exp(T.lgam(a + b) - T.lgam(a) - T.lgam(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b; };
  T.tcdf = function(t, df){ var x = df / (df + t * t), p = 0.5 * T.betai(df / 2, 0.5, x); return t > 0 ? 1 - p : p; };
  T.tpdf = function(t, df){ return Math.exp(T.lgam((df + 1) / 2) - T.lgam(df / 2)) / Math.sqrt(df * Math.PI) * Math.pow(1 + t * t / df, -(df + 1) / 2); };
  T.tppf = function(p, df){ var lo = -200, hi = 200; for (var i = 0; i < 100; i++){ var m = (lo + hi) / 2; if (T.tcdf(m, df) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
  T.gammp = function(a, x){ if (x <= 0) return 0; if (x < a + 1){ var ap = a, sum = 1 / a, del = sum; for (var n = 0; n < 500; n++){ ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; } return sum * Math.exp(-x + a * Math.log(x) - T.lgam(a)); }
    var b = x + 1 - a, c = 1 / 1e-30, d = 1 / b, h = d; for (var i = 1; i < 500; i++){ var an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-30) d = 1e-30; c = b + an / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; var dl = d * c; h *= dl; if (Math.abs(dl - 1) < 1e-15) break; }
    return 1 - Math.exp(-x + a * Math.log(x) - T.lgam(a)) * h; };
  T.chi2cdf = function(x, k){ return T.gammp(k / 2, x / 2); };
  T.chi2pdf = function(x, k){ if (x <= 0) return 0; return Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.log(2) - T.lgam(k / 2)); };
  T.chi2ppf = function(p, k){ var lo = 0, hi = 500; for (var i = 0; i < 100; i++){ var m = (lo + hi) / 2; if (T.chi2cdf(m, k) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
  T.fcdf = function(f, d1, d2){ if (f <= 0) return 0; return T.betai(d1 / 2, d2 / 2, d1 * f / (d1 * f + d2)); };
  T.fpdf = function(f, d1, d2){ if (f <= 0) return 0; return Math.exp(T.lgam((d1 + d2) / 2) - T.lgam(d1 / 2) - T.lgam(d2 / 2) + (d1 / 2) * Math.log(d1 / d2) + (d1 / 2 - 1) * Math.log(f) - ((d1 + d2) / 2) * Math.log(1 + d1 * f / d2)); };
  T.mean = function(a){ var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s / a.length; };
  T.sd = function(a){ var m = T.mean(a), s = 0; for (var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m); return Math.sqrt(s / (a.length - 1)); };
  T.lfact = function(n){ return T.lgam(n + 1); };
  T.pval = function(p){ return p < 0.0001 ? "&lt; 0,0001" : S_fmt(p, 4); };
  function S_fmt(x, d){ return SFA.fmt(x, d); }
  /* remplissage sous une courbe entre xa et xb */
  T.fill = function(c, ax, f, xa, xb, color){ var ctx = c.ctx, n = 120; ctx.save(); ctx.beginPath(); ctx.moveTo(ax.X(xa), ax.Y(0));
    for (var i = 0; i <= n; i++){ var x = xa + (xb - xa) * i / n; ctx.lineTo(ax.X(x), ax.Y(f(x))); } ctx.lineTo(ax.X(xb), ax.Y(0)); ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.restore(); };
  return T;
})();

function corr(x,y){ var mx=ST.mean(x), my=ST.mean(y), sxy=0, sxx=0, syy=0; for(var i=0;i<x.length;i++){ sxy+=(x[i]-mx)*(y[i]-my); sxx+=(x[i]-mx)*(x[i]-mx); syy+=(y[i]-my)*(y[i]-my); } return sxy/Math.sqrt(sxx*syy); }
function ols(x,y){ var mx=ST.mean(x), my=ST.mean(y), sxy=0, sxx=0; for(var i=0;i<x.length;i++){ sxy+=(x[i]-mx)*(y[i]-my); sxx+=(x[i]-mx)*(x[i]-mx); } var a=sxy/sxx; return {a:a,b:my-a*mx}; }
function stdz(v){ var m=ST.mean(v), s=ST.sd(v); return v.map(function(t){ return (t-m)/s; }); }

SFA.sim({
  id:"us-c10-nuage-coefficient-r", ch:"c10", tag:"Classique · P1",
  titre:"Nuage de points et coefficient de corrélation r",
  resume:"Quel r pour quel nuage ? Un lien très net peut donner r ≈ 0 s'il n'est pas linéaire.",
  but:"Choisis la forme du nuage, augmente le bruit et lis r. Observe les formes qui ont un r proche de 0 alors que les deux variables sont fortement liées.",
  aRetenir:"r ∈ [−1 ; 1] mesure uniquement la force du lien linéaire ; r² est la part de variance de y expliquée par la droite. r = 0 n'implique pas l'indépendance.",
  piege:"Un seul point extrême peut créer ou détruire une corrélation. Mélanger deux sous-groupes peut inverser le signe de r.",
  build:function(k,S){
    var c=k.canvas(340);
    var sh=k.select("Forme du nuage",[["lin","Relation linéaire"],["neg","Relation linéaire décroissante"],["u","Parabole (relation en U)"],["circ","Cercle"],["grp","Deux sous-groupes"],["out","Linéaire + un point extrême"]],"lin");
    var bz=k.slider("Bruit",0,1,0.05,0.3,"");
    var n=k.slider("Nombre de points",10,200,5,60,"");
    var ro=k.readouts(["r","r²","Pente de la droite"]);
    var nt=k.note("","");
    k.draw(function(){
      var P=S.draw.palette, N=n.value, r=ST.rng(777+N), x=[], y=[], i, t, g;
      for(i=0;i<N;i++){ var e1=ST.randn(r), e2=ST.randn(r), u=r()*2-1;
        if(sh.value==="lin"){ x.push(u); y.push(u+bz.value*e1); }
        else if(sh.value==="neg"){ x.push(u); y.push(-u+bz.value*e1); }
        else if(sh.value==="u"){ x.push(u); y.push(2*u*u-0.7+bz.value*0.5*e1); }
        else if(sh.value==="circ"){ t=r()*2*Math.PI; x.push(Math.cos(t)+bz.value*0.3*e1); y.push(Math.sin(t)+bz.value*0.3*e2); }
        else if(sh.value==="grp"){ g=i%2; x.push((g?0.8:-0.8)+0.45*e1*(0.4+bz.value)); y.push((g?0.8:-0.8)-0.5*(x[i]-(g?0.8:-0.8))+0.45*e2*(0.4+bz.value)); }
        else { x.push(u); y.push(u+bz.value*e1); }
      }
      if(sh.value==="out"){ x[0]=1.9; y[0]=-2.6; }
      var rr=corr(x,y), f=ols(x,y);
      c.clear(); var ax=S.draw.axes(c,{x0:-2.5,x1:2.5,y0:-3,y1:3,xl:"x",yl:"y",stepX:1,stepY:1});
      S.draw.fn(c,ax,function(xx){ return f.a*xx+f.b; },P.red,2.2,[6,4]);
      for(i=0;i<N;i++) S.draw.dot(c,ax.X(x[i]),ax.Y(y[i]),i===0&&sh.value==="out"?6:3.8,i===0&&sh.value==="out"?P.red:P.acc);
      S.draw.text(c,"r = "+S.fmt(rr,2),ax.R-8,ax.T+14,{align:"right",size:16,color:P.ink});
      ro.set(0,S.fmt(rr,3)); ro.set(1,S.fmt(rr*rr,3)); ro.set(2,S.fmt(f.a,2));
      if(Math.abs(rr)<0.2&&(sh.value==="u"||sh.value==="circ")) nt.set("r proche de 0 alors que y est une fonction nette de x : r ne détecte que les liens linéaires.","warn");
      else if(sh.value==="grp") nt.set("Chaque sous-groupe a une pente négative, l'ensemble est lié positivement : r global ne dit rien des sous-groupes.","warn");
      else if(sh.value==="out") nt.set("Le point rouge à lui seul fait chuter r. Calcule toujours r avec et sans les valeurs extrêmes.","warn");
      else nt.set("Plus le bruit est grand, plus r s'éloigne de ±1.","ok");
    });
  }
});

SFA.sim({
  id:"us-c10-droite-moindres-carres", ch:"c10", tag:"Classique · P1",
  titre:"Ajuster la droite à la main : les moindres carrés",
  resume:"Règle pente et ordonnée à l'origine, vois les carrés des résidus, et compare à la droite optimale.",
  but:"Dix patients : dose d'un médicament (x, mg) et baisse de pression (y, mmHg). Place la droite pour minimiser la somme des carrés des résidus (aires des carrés).",
  aRetenir:"La droite des moindres carrés minimise Σ(y<sub>i</sub> − ŷ<sub>i</sub>)². Pente a = s<sub>xy</sub>/s<sub>x</sub>² = r·s<sub>y</sub>/s<sub>x</sub> ; ordonnée b = ȳ − a·x̄ ; la droite passe par (x̄ ; ȳ).",
  piege:"La droite ne doit pas être utilisée hors de l'étendue des x observés (extrapolation). La pente de y sur x n'est pas l'inverse de la pente de x sur y.",
  build:function(k,S){
    var X=[2,4,5,7,8,10,11,13,14,16], Y=[3.1,5.9,5.2,9.4,8.1,12.6,11.0,15.2,14.8,18.9];
    var c=k.canvas(340), f=ols(X,Y), rr=corr(X,Y);
    var a=k.slider("Pente a",0,2,0.02,0.5,"mmHg/mg");
    var b=k.slider("Ordonnée à l'origine b",-5,10,0.1,3,"mmHg");
    var sq=k.toggle("Afficher les carrés des résidus",true);
    k.button("Droite optimale",function(){ a.set(Math.round(f.a*100)/100); b.set(Math.round(f.b*10)/10); },true);
    var ro=k.readouts(["Σ des carrés (ta droite)","Σ des carrés (minimum)","Droite optimale","r"]);
    var nt=k.note("","");
    var ssMin=0; X.forEach(function(x,i){ ssMin+=Math.pow(Y[i]-(f.a*x+f.b),2); });
    k.draw(function(){
      var P=S.draw.palette, ss=0, i;
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:18,y0:0,y1:22,xl:"dose (mg)",yl:"baisse (mmHg)",stepX:2,stepY:4});
      S.draw.fn(c,ax,function(x){ return f.a*x+f.b; },"rgba(46,107,85,.55)",2,[6,4]);
      for(i=0;i<X.length;i++){ var yh=a.value*X[i]+b.value, e=Y[i]-yh; ss+=e*e;
        if(sq.value){ var side=Math.abs(ax.Y(0)-ax.Y(e))*(ax.X(1)-ax.X(0))/(ax.X(1)-ax.X(0)); var sw=Math.abs(ax.Y(yh)-ax.Y(Y[i])); c.ctx.fillStyle="rgba(180,35,24,.22)"; c.ctx.fillRect(ax.X(X[i]),Math.min(ax.Y(yh),ax.Y(Y[i])),sw,sw); }
        S.draw.line(c,ax.X(X[i]),ax.Y(yh),ax.X(X[i]),ax.Y(Y[i]),P.red,1.6); }
      S.draw.fn(c,ax,function(x){ return a.value*x+b.value; },P.acc,2.8);
      for(i=0;i<X.length;i++) S.draw.dot(c,ax.X(X[i]),ax.Y(Y[i]),4.5,P.ink);
      ro.set(0,S.fmt(ss,1)); ro.set(1,S.fmt(ssMin,1)); ro.set(2,"ŷ = "+S.fmt(f.a,3)+" x + "+S.fmt(f.b,2)); ro.set(3,S.fmt(rr,3));
      nt.set(ss<=ssMin+0.5?"Presque optimal : tu as retrouvé la droite des moindres carrés.":"Σ = "+S.fmt(ss,1)+" contre "+S.fmt(ssMin,1)+" au minimum : ajuste pente et ordonnée (la droite doit passer près du point moyen).",ss<=ssMin+0.5?"ok":"warn");
    });
  }
});

SFA.sim({
  id:"us-c10-quatre-jeux-memes-statistiques", ch:"c10", tag:"Original · P1",
  titre:"Quatre jeux, mêmes statistiques, structures différentes",
  resume:"Mêmes moyennes, mêmes écarts-types, même r, même droite : mais un nuage linéaire, une courbe, un point aberrant et un point à fort effet de levier.",
  but:"Passe d'un jeu à l'autre : tous les chiffres restent identiques. Retire ensuite le point influent des jeux 3 et 4 et regarde les statistiques s'effondrer.",
  aRetenir:"Les indicateurs numériques ne remplacent jamais le graphique : regarde toujours le nuage de points. Un point à fort effet de levier ou aberrant peut déterminer à lui seul la droite et r.",
  piege:"r = 0,82 dans les quatre cas ne signifie pas que la droite convient aux quatre. Le jeu 2 est une courbe (la droite est inadaptée) ; les jeux 3 et 4 dépendent d'un seul point.",
  build:function(k,S){
    var c=k.canvas(340), R=0.82, MX=9, SX=3.2, MY=7.5, SY=2;
    var xs=[[3,4,5,6,7,8,9,10,11,12,13],[3,4,5,6,7,8,9,10,11,12,13],[3,4,5,6,7,8,9,10,11,12,13],[7,7,7,7,7,7,7,7,7,7,17]];
    var rw=[[0.9,-0.3,0.6,-1.1,0.2,0.8,-0.5,1.0,-0.8,0.4,-0.2],null,null,[0.5,-0.9,0.3,1.2,-0.4,0.8,-1.1,0.1,-0.6,1.0,0]];
    var raw=[], i, j;
    raw[0]=xs[0].map(function(x,j){ return 0.8*(x-8)+rw[0][j]*1.2; });
    raw[1]=xs[1].map(function(x){ return -Math.pow(x-8,2)/4; });
    raw[2]=xs[2].map(function(x,j){ return 0.8*(x-8)+[0.2,-0.1,0.15,-0.2,0.1,0,-0.1,0.2,-0.15,0.05,0][j]+(j===8?5.5:0); });
    raw[3]=xs[3].map(function(x,j){ return j===10?10:rw[3][j]*1.2; });
    var ds=[];
    for(i=0;i<4;i++){ var zx=stdz(xs[i]), f=ols(xs[i],raw[i]), res=xs[i].map(function(x,j){ return raw[i][j]-(f.a*x+f.b); }), zr=stdz(res);
      ds.push({x:zx.map(function(z){ return MX+SX*z; }), y:zx.map(function(z,j){ return MY+SY*(R*z+Math.sqrt(1-R*R)*zr[j]); })}); }
    var which=k.seg("Jeu de données",[["0","Jeu 1"],["1","Jeu 2"],["2","Jeu 3"],["3","Jeu 4"]],"0");
    var rm=k.toggle("Retirer le point influent (jeux 3 et 4)",false);
    var ro=k.readouts(["Moyenne de x ; de y","Écart-type de x ; de y","r","Droite ŷ = a·x + b"]);
    var nt=k.note("","");
    var infl=[-1,-1,8,10];
    k.draw(function(){
      var P=S.draw.palette, w=+which.value, d=ds[w], x=d.x.slice(), y=d.y.slice(), removed=rm.value&&infl[w]>=0, pi=infl[w];
      var xr=x.slice(), yr=y.slice(); if(removed){ xr.splice(pi,1); yr.splice(pi,1); }
      var f0=ols(x,y), degen=ST.sd(xr)<1e-6, f=degen?{a:0,b:0}:ols(xr,yr), rr=degen?NaN:corr(xr,yr);
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:22,y0:0,y1:14,xl:"x",yl:"y",stepX:2,stepY:2});
      S.draw.fn(c,ax,function(t){ return f0.a*t+f0.b; },"rgba(138,149,163,.9)",2,[6,4]);
      if(removed&&!degen) S.draw.fn(c,ax,function(t){ return f.a*t+f.b; },P.acc,2.8);
      x.forEach(function(v,j){ var isI=(removed&&j===pi); S.draw.dot(c,ax.X(v),ax.Y(y[j]),isI?6:4.5,isI?P.red:P.ink); });
      ro.set(0,S.fmt(ST.mean(xr),2)+" ; "+S.fmt(ST.mean(yr),2)); ro.set(1,S.fmt(ST.sd(xr),2)+" ; "+S.fmt(ST.sd(yr),2)); ro.set(2,degen?"—":S.fmt(rr,3)); ro.set(3,degen?"—":S.fmt(f.a,3)+" x + "+S.fmt(f.b,2));
      if(degen) nt.set("Sans le point influent, tous les x sont identiques : aucune droite ni aucun r ne peuvent être calculés. Toute la « corrélation » du jeu 4 venait d'un seul sujet.","warn"); else nt.set(w===0?"Nuage linéaire raisonnable : la droite résume bien.":w===1?"Relation courbe : la droite est inadaptée, malgré r = 0,82.":removed?"Sans le point influent, les statistiques changent : r et la droite dépendaient d'un seul sujet (pointillé : droite avec tous les points).":"Un point (en 11e position) dicte la droite et r. Coche « retirer » pour voir ce qui reste.",w===0?"ok":"warn");
    });
  }
});

SFA.sim({
  id:"us-c10-correlation-contre-causalite", ch:"c10", tag:"Original · confusion",
  titre:"Corrélation n'est pas causalité : la variable cachée",
  resume:"Café et risque cardiaque corrélés… à cause du tabac. Stratifier sur la variable cachée fait disparaître le lien.",
  but:"Un facteur Z (tabagisme) influence à la fois X (tasses de café) et Y (score de risque cardiaque). Règle les liens et compare la corrélation brute à la corrélation ajustée sur Z.",
  aRetenir:"Une corrélation observée entre X et Y peut provenir d'une variable de confusion Z qui agit sur les deux. Ajuster sur Z (stratifier, régression multiple) ou randomiser permet d'isoler l'effet propre de X.",
  piege:"Ajuster sur toutes les variables n'est pas toujours la solution : ajuster sur un médiateur ou un collisionneur crée des biais. Seul un plan d'étude (randomisation) élimine la confusion.",
  build:function(k,S){
    var c=k.canvas(340);
    var a=k.slider("Effet de Z sur X",0,0.95,0.05,0.7,"");
    var b=k.slider("Effet de Z sur Y",0,0.95,0.05,0.7,"");
    var d=k.slider("Effet direct réel de X sur Y",0,0.6,0.05,0,"");
    var n=k.slider("Nombre de sujets",50,400,10,200,"");
    var st=k.toggle("Stratifier sur Z (3 niveaux)",false);
    var ro=k.readouts(["r brut (X, Y)","r ajusté sur Z","Pente brute","Pente ajustée sur Z"]);
    var nt=k.note("","");
    k.draw(function(){
      var P=S.draw.palette, N=n.value, r=ST.rng(31415+N), z=[], x=[], y=[], i;
      for(i=0;i<N;i++){ var zz=ST.randn(r), xx=a.value*zz+Math.sqrt(1-a.value*a.value)*ST.randn(r), yy=b.value*zz+d.value*xx+0.7*ST.randn(r); z.push(zz); x.push(xx); y.push(yy); }
      var rxy=corr(x,y), rxz=corr(x,z), ryz=corr(y,z), pr=(rxy-rxz*ryz)/Math.sqrt((1-rxz*rxz)*(1-ryz*ryz));
      var f=ols(x,y);
      /* régression multiple y ~ x + z (2 variables centrées) */
      var mx=ST.mean(x), my=ST.mean(y), mz=ST.mean(z), sxx=0, szz=0, sxz=0, sxy=0, szy=0;
      for(i=0;i<N;i++){ var dx=x[i]-mx, dz=z[i]-mz, dy=y[i]-my; sxx+=dx*dx; szz+=dz*dz; sxz+=dx*dz; sxy+=dx*dy; szy+=dz*dy; }
      var adj=(sxy*szz-sxz*szy)/(sxx*szz-sxz*sxz);
      var q1=-0.43, q2=0.43, cols=[P.teal,P.amber,P.red];
      c.clear(); var ax=S.draw.axes(c,{x0:-3.5,x1:3.5,y0:-4,y1:4,xl:"X : café (écarts réduits)",yl:"Y : risque cardiaque",stepX:1,stepY:1});
      for(i=0;i<N;i++){ var g=z[i]<q1?0:(z[i]<q2?1:2); S.draw.dot(c,ax.X(x[i]),ax.Y(y[i]),3.6,st.value?cols[g]:P.acc); }
      if(!st.value) S.draw.fn(c,ax,function(t){ return f.a*t+f.b; },P.ink,2.6);
      else [0,1,2].forEach(function(g){ var xg=[], yg=[]; for(i=0;i<N;i++){ if((z[i]<q1?0:(z[i]<q2?1:2))===g){ xg.push(x[i]); yg.push(y[i]); } } if(xg.length>3){ var fg=ols(xg,yg); S.draw.fn(c,ax,function(t){ return fg.a*t+fg.b; },cols[g],2.4); } });
      if(st.value) S.draw.text(c,"vert : Z bas · orange : Z moyen · rouge : Z élevé",ax.R-6,ax.T+10,{align:"right",size:11,color:"#5f6b7a"});
      ro.set(0,S.fmt(rxy,2)); ro.set(1,S.fmt(pr,2)); ro.set(2,S.fmt(f.a,2)); ro.set(3,S.fmt(adj,2));
      if(d.value===0&&Math.abs(rxy)>0.25) nt.set("X n'a aucun effet direct sur Y, pourtant r = "+S.fmt(rxy,2)+" : la corrélation vient entièrement de Z. Après ajustement, le lien disparaît.","warn");
      else if(d.value>0) nt.set("Il existe un vrai effet direct de X : la pente ajustée le retrouve, la pente brute le mélange avec l'effet de Z.","ok");
      else nt.set("Peu de confusion : les liens avec Z sont faibles.","ok");
    });
  }
});

SFA.sim({
  id:"us-c10-regression-logistique", ch:"c10", tag:"Option · introduction",
  titre:"Régression logistique : probabilité, odds et courbe en S",
  resume:"Expliquer un événement oui/non (complication) par une variable continue : p = 1/(1 + e^−(β₀ + β₁x)).",
  but:"40 patients : concentration d'un biomarqueur (x) et survenue d'une complication (0/1). Règle β₀ et β₁, ou cherche l'ajustement optimal, et lis la probabilité, les odds et l'odds ratio.",
  aRetenir:"ln(odds) = β₀ + β₁x. e<sup>β₁</sup> est l'odds ratio pour une augmentation de x d'une unité. La probabilité vaut 50 % en x = −β₀/β₁. Les coefficients se trouvent par maximum de vraisemblance, pas par moindres carrés.",
  piege:"Une droite ajustée sur des 0/1 prédit des « probabilités » hors de [0 ; 1] ; la sigmoïde reste entre 0 et 1. Un OR de e<sup>β₁</sup> concerne les odds, pas la probabilité.",
  build:function(k,S){
    var c=k.canvas(330), r=ST.rng(2), X=[], Y=[], i;
    for(i=0;i<40;i++){ var x=0.25+i*0.25; X.push(x); Y.push(r()<1/(1+Math.exp(-(-3.5+0.7*x)))?1:0); }
    function ll(b0,b1){ var s=0; for(var j=0;j<40;j++){ var p=1/(1+Math.exp(-(b0+b1*X[j]))); p=Math.min(1-1e-12,Math.max(1e-12,p)); s+=Y[j]?Math.log(p):Math.log(1-p); } return s; }
    function fit(){ var b0=0,b1=0,j; for(var it=0;it<50;it++){ var g0=0,g1=0,h00=0,h01=0,h11=0; for(j=0;j<40;j++){ var p=1/(1+Math.exp(-(b0+b1*X[j]))), w=p*(1-p); g0+=Y[j]-p; g1+=(Y[j]-p)*X[j]; h00+=w; h01+=w*X[j]; h11+=w*X[j]*X[j]; }
      var det=h00*h11-h01*h01; b0+=(h11*g0-h01*g1)/det; b1+=(-h01*g0+h00*g1)/det; } return [b0,b1]; }
    var best=fit();
    var b0=k.slider("β₀ (ordonnée)",-10,2,0.1,-1,"");
    var b1=k.slider("β₁ (effet du biomarqueur)",-0.5,2.5,0.05,0.2,"");
    var x0=k.slider("Biomarqueur x pour lire la probabilité",0,10,0.25,6,"");
    k.button("Ajustement optimal (maximum de vraisemblance)",function(){ b0.set(Math.round(best[0]*10)/10); b1.set(Math.round(best[1]*100)/100); },true);
    var ro=k.readouts(["Probabilité en x","Odds en x","OR pour +1 unité","x où p = 50 %","Log-vraisemblance (max : "+S.fmt(ll(best[0],best[1]),1)+")"]);
    k.draw(function(){
      var P=S.draw.palette;
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:10.5,y0:-0.1,y1:1.1,xl:"biomarqueur x",yl:"p",stepX:1,stepY:0.25});
      S.draw.fn(c,ax,function(x){ return 1/(1+Math.exp(-(b0.value+b1.value*x))); },P.acc,3);
      for(i=0;i<40;i++) S.draw.dot(c,ax.X(X[i]),ax.Y(Y[i]),3.6,Y[i]?P.red:P.grey);
      var p=1/(1+Math.exp(-(b0.value+b1.value*x0.value)));
      S.draw.line(c,ax.X(x0.value),ax.Y(0),ax.X(x0.value),ax.Y(p),P.green,1.6,[4,4]); S.draw.line(c,ax.L,ax.Y(p),ax.X(x0.value),ax.Y(p),P.green,1.6,[4,4]); S.draw.dot(c,ax.X(x0.value),ax.Y(p),6,P.green);
      ro.set(0,S.fmt(100*p,1)+" %"); ro.set(1,p>0.9999?"> 10 000":S.fmt(p/(1-p),2)); ro.set(2,S.fmt(Math.exp(b1.value),2)); ro.set(3,b1.value===0?"—":S.fmt(-b0.value/b1.value,2)); ro.set(4,S.fmt(ll(b0.value,b1.value),1));
    });
  }
});
})();
