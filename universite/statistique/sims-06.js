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

SFA.sim({
  id:"us-c06-ic-100-echantillons", ch:"c06", tag:"Classique · P1",
  titre:"100 intervalles de confiance côte à côte",
  resume:"Cent études sur la même population : combien d'intervalles contiennent la vraie moyenne ?",
  but:"Population de pressions systoliques (μ = 120 mmHg, σ = 15 mmHg). Tire 100 études, compte les intervalles qui contiennent μ, puis cumule 1 000 tirages de plus.",
  aRetenir:"Le niveau de confiance est la proportion d'intervalles qui contiendraient μ si on répétait l'étude : environ 95 % pour un niveau de 95 %. Une fois calculé, un intervalle contient μ ou ne le contient pas.",
  piege:"Avec σ remplacé par s et la loi normale (z) au lieu de Student, les petits échantillons donnent moins de 95 % de réussite : l'intervalle est trop étroit.",
  build:function(k,S){
    var MU=120, SIG=15, c=k.canvas(430);
    var n=k.slider("Taille n de chaque étude",3,100,1,10,"");
    var lev=k.seg("Niveau de confiance",[[0.90,"90 %"],[0.95,"95 %"],[0.99,"99 %"]],0.95);
    var meth=k.seg("Calcul de l'intervalle",[["z","z, σ connu"],["zs","z avec s estimé (erreur)"],["t","t de Student, s estimé"]],"t");
    var seed=7, cum={key:"",hit:0,tot:0};
    var ro=k.readouts(["Contiennent la vraie moyenne","Cumul des tirages","Largeur moyenne"]);
    var nt=k.note("","");
    function key(){ return n.value+"|"+lev.value+"|"+meth.value; }
    function crit(){ var p=(1+lev.value)/2; return meth.value==="t" ? ST.tppf(p,n.value-1) : ST.nppf(p); }
    function one(r,cr){ var nn=n.value, x=[],i; for(i=0;i<nn;i++) x.push(MU+SIG*ST.randn(r)); var m=ST.mean(x), s=meth.value==="z"?SIG:ST.sd(x), h=cr*s/Math.sqrt(nn); return {lo:m-h,hi:m+h,m:m}; }
    k.button("Nouveau tirage de 100 études",function(){ seed++; },true);
    k.button("1 000 tirages de plus (cumul)",function(){ var r=ST.rng(seed*977+13), cr=crit(), i, st; if(cum.key!==key()){cum={key:key(),hit:0,tot:0};}
      for(i=0;i<1000;i++){ st=one(r,cr); cum.tot++; if(st.lo<=MU&&MU<=st.hi) cum.hit++; } });
    k.draw(function(){
      c.clear(); if(cum.key!==key()) cum={key:key(),hit:0,tot:0};
      var r=ST.rng(seed*7919+n.value), cr=crit(), nn=n.value, half=3.4*SIG/Math.sqrt(nn);
      var ax=S.draw.axes(c,{x0:MU-half,x1:MU+half,y0:0,y1:101,xl:"Moyenne (mmHg)",grid:false,stepY:1000});
      var ctx=c.ctx, ok=0, wsum=0, i, st, y, col;
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip();
      for(i=0;i<100;i++){ st=one(r,cr); y=ax.Y(100-i); var hit=st.lo<=MU&&MU<=st.hi; if(hit) ok++; wsum+=st.hi-st.lo;
        col=hit?S.draw.palette.green:S.draw.palette.red; S.draw.line(c,ax.X(st.lo),y,ax.X(st.hi),y,col,hit?1.6:2.4); S.draw.dot(c,ax.X(st.m),y,1.6,col); }
      ctx.restore();
      S.draw.line(c,ax.X(MU),ax.T,ax.X(MU),ax.B,S.draw.palette.ink,1.5,[5,4]);
      S.draw.text(c,"μ = 120",ax.X(MU)+4,ax.T+8,{align:"left",size:12,color:S.draw.palette.ink});
      ro.set(0,ok+" / 100"); ro.set(1,cum.tot?S.fmt(100*cum.hit/cum.tot,1)+" % ("+cum.tot+" études)":"—"); ro.set(2,S.fmt(wsum/100,1)+" mmHg");
      if(meth.value==="zs"&&nn<30) nt.set("z (1,96) avec s estimé et un petit n : l'intervalle est trop étroit, la réussite à long terme est inférieure au niveau choisi. Cumule des tirages pour le voir.","warn");
      else if(meth.value==="zs") nt.set("z avec s estimé : pour n ≥ 30, la perte est faible (t ≈ z), mais Student reste la méthode correcte.","ok");
      else if(meth.value==="t") nt.set("Avec Student, la fréquence de réussite à long terme est égale au niveau choisi, même pour un petit n.","ok");
      else nt.set("σ connu : loi normale exacte, la fréquence de réussite tend vers le niveau choisi.","ok");
    });
  }
});

SFA.sim({
  id:"us-c06-ic-largeur", ch:"c06", tag:"Classique",
  titre:"Largeur d'un intervalle : n, niveau et dispersion",
  resume:"Marge = t × s / √n : ce qui l'élargit, ce qui la resserre, et le coût d'une précision double.",
  but:"Une pression moyenne observée de 120 mmHg. Modifie n, le niveau de confiance et l'écart-type s, et lis la marge d'erreur.",
  aRetenir:"Marge = t<sub>1−α/2 ; n−1</sub> · s/√n. Pour diviser la marge par 2, il faut multiplier n par 4. Un niveau plus élevé ou une dispersion plus grande élargit l'intervalle.",
  piege:"Un intervalle étroit ne prouve pas que l'échantillon est bien choisi : l'IC ne corrige aucun biais de sélection.",
  build:function(k,S){
    var a=k.canvas(110), c=k.canvas(270);
    var n=k.slider("Taille n",5,400,1,25,"");
    var s=k.slider("Écart-type s",5,40,1,15,"mmHg");
    var lev=k.seg("Niveau",[[0.90,"90 %"],[0.95,"95 %"],[0.99,"99 %"]],0.95);
    var ro=k.readouts(["Quantile t","Marge d'erreur","Intervalle","n pour diviser la marge par 2"]);
    function marge(nn,l,ss){ return ST.tppf((1+l)/2,nn-1)*ss/Math.sqrt(nn); }
    k.draw(function(){
      var m=marge(n.value,lev.value,s.value), P=S.draw.palette, x0=60, x1=180, ctx=a.ctx;
      a.clear(); var L=40,R=a.W-20, X=function(v){ return L+(v-x0)/(x1-x0)*(R-L); };
      S.draw.line(a,L,70,R,70,"#8a95a3",1.2);
      for(var v=60;v<=180;v+=20){ S.draw.line(a,X(v),66,X(v),74,"#8a95a3",1.2); S.draw.text(a,String(v),X(v),86,{size:11,color:"#5f6b7a",weight:600}); }
      S.draw.line(a,X(120-m),38,X(120+m),38,P.acc,5); S.draw.line(a,X(120-m),30,X(120-m),46,P.acc,3); S.draw.line(a,X(120+m),30,X(120+m),46,P.acc,3);
      S.draw.dot(a,X(120),38,6,P.red); S.draw.text(a,"x̄ = 120",X(120),16,{size:12,color:P.red});
      S.draw.text(a,S.fmt(120-m,1),X(120-m),56,{size:11,color:P.acc}); S.draw.text(a,S.fmt(120+m,1),X(120+m),56,{size:11,color:P.acc});
      c.clear(); var ymax=Math.max(10,marge(5,lev.value,s.value)*1.05);
      var ax=S.draw.axes(c,{x0:0,x1:400,y0:0,y1:ymax,xl:"n",yl:"marge (mmHg)",stepX:50});
      [0.90,0.95,0.99].forEach(function(l){ S.draw.fn(c,ax,function(x){ return marge(Math.max(5,x),l,s.value); },l===lev.value?P.acc:"#c8d0dc",l===lev.value?2.8:1.6); });
      S.draw.dot(c,ax.X(n.value),ax.Y(m),6,P.red);
      S.draw.text(c,"90 %",ax.X(300),ax.Y(marge(300,0.90,s.value))+10,{size:11,color:"#5f6b7a"}); S.draw.text(c,"99 %",ax.X(300),ax.Y(marge(300,0.99,s.value))-10,{size:11,color:"#5f6b7a"});
      ro.set(0,S.fmt(ST.tppf((1+lev.value)/2,n.value-1),3)); ro.set(1,"± "+S.fmt(m,2)+" mmHg");
      ro.set(2,"["+S.fmt(120-m,1)+" ; "+S.fmt(120+m,1)+"]"); var n2=n.value; while(n2<100000&&marge(n2,lev.value,s.value)>m/2) n2++; ro.set(3,n2+" (≈ 4n = "+(4*n.value)+")");
    });
  }
});

SFA.sim({
  id:"us-c06-ic-proportion-sondage", ch:"c06", tag:"Classique · marge d'erreur",
  titre:"Une proportion : marge d'erreur et taille d'enquête",
  resume:"Intervalle d'une proportion (Wald et Wilson) et taille d'échantillon pour une marge voulue.",
  but:"Dans un échantillon de n personnes, une proportion p̂ présente le caractère (par exemple une allergie). Observe l'intervalle et la taille nécessaire pour une marge fixée.",
  aRetenir:"Marge de Wald : z·√(p̂(1−p̂)/n), maximale pour p̂ = 0,5. Taille requise pour une marge m : n = z²·p(1−p)/m² ; avec p = 0,5 on est sûr d'être large.",
  piege:"L'intervalle de Wald est peu fiable quand n·p̂ ou n·(1−p̂) est inférieur à 10 : il peut sortir de [0 ; 1]. L'intervalle de Wilson reste cohérent.",
  build:function(k,S){
    var a=k.canvas(110), c=k.canvas(260);
    var p=k.slider("Proportion observée p̂",0.01,0.99,0.01,0.35,"");
    var n=k.slider("Taille n",10,3000,10,400,"");
    var lev=k.seg("Niveau",[[0.90,"90 %"],[0.95,"95 %"],[0.99,"99 %"]],0.95);
    var mm=k.slider("Marge visée",1,10,0.5,3,"points de %");
    var ro=k.readouts(["Wald","Wilson","Marge de Wald","n requis (avec la proportion observée)","n requis (cas le plus défavorable)"]);
    var nt=k.note("","");
    function wald(pp,nn,z){ var h=z*Math.sqrt(pp*(1-pp)/nn); return [pp-h,pp+h]; }
    function wilson(pp,nn,z){ var d=1+z*z/nn, ce=(pp+z*z/(2*nn))/d, h=z*Math.sqrt(pp*(1-pp)/nn+z*z/(4*nn*nn))/d; return [ce-h,ce+h]; }
    function pc(v){ return S.fmt(100*v,1)+" %"; }
    k.draw(function(){
      var z=ST.nppf((1+lev.value)/2), P=S.draw.palette, w=wald(p.value,n.value,z), wi=wilson(p.value,n.value,z);
      a.clear(); var L=40,R=a.W-20, X=function(v){ return L+v*(R-L); };
      S.draw.line(a,L,86,R,86,"#8a95a3",1.2);
      for(var v=0;v<=1.0001;v+=0.2){ S.draw.line(a,X(v),82,X(v),90,"#8a95a3",1.2); S.draw.text(a,Math.round(v*100)+" %",X(v),101,{size:11,color:"#5f6b7a",weight:600}); }
      var lo=Math.max(0,w[0]),hi=Math.min(1,w[1]);
      S.draw.line(a,X(lo),30,X(hi),30,P.acc,5); S.draw.text(a,"Wald",L-4,30,{align:"right",size:11,color:P.acc});
      S.draw.line(a,X(wi[0]),58,X(wi[1]),58,P.teal,5); S.draw.text(a,"Wilson",L-4,58,{align:"right",size:11,color:P.teal});
      S.draw.dot(a,X(p.value),44,6,P.red);
      c.clear(); var m0=z*Math.sqrt(0.25/20); var ax=S.draw.axes(c,{x0:0,x1:3000,y0:0,y1:Math.min(0.25,m0*1.05)*100,xl:"n",yl:"marge (points de %)",stepX:500});
      S.draw.fn(c,ax,function(x){ return 100*z*Math.sqrt(0.25/Math.max(x,20)); },P.acc,2.6);
      S.draw.fn(c,ax,function(x){ return 100*z*Math.sqrt(p.value*(1-p.value)/Math.max(x,20)); },P.teal,2,[6,4]);
      S.draw.line(c,ax.L,ax.Y(mm.value),ax.R,ax.Y(mm.value),P.red,1.4,[4,4]);
      S.draw.dot(c,ax.X(n.value),ax.Y(100*z*Math.sqrt(p.value*(1-p.value)/n.value)),6,P.red);
      S.draw.text(c,"p = 0,5",ax.X(1500),ax.Y(100*z*Math.sqrt(0.25/1500))-12,{size:11,color:P.acc});
      S.draw.text(c,"p = p̂",ax.X(2300),ax.Y(100*z*Math.sqrt(p.value*(1-p.value)/2300))-12,{size:11,color:P.teal});
      ro.set(0,"["+pc(w[0])+" ; "+pc(w[1])+"]"); ro.set(1,"["+pc(wi[0])+" ; "+pc(wi[1])+"]"); ro.set(2,"± "+S.fmt(100*z*Math.sqrt(p.value*(1-p.value)/n.value),2)+" pts");
      var mr=mm.value/100; ro.set(3,Math.ceil(z*z*p.value*(1-p.value)/(mr*mr))); ro.set(4,Math.ceil(z*z*0.25/(mr*mr)));
      if(n.value*Math.min(p.value,1-p.value)<10) nt.set("n·min(p̂ ; 1−p̂) &lt; 10 : l'intervalle de Wald n'est pas fiable"+(w[0]<0||w[1]>1?" (il dépasse [0 ; 1])":"")+". Préfère Wilson.","warn");
      else nt.set("Conditions d'approximation normale respectées (n·p̂ et n·(1−p̂) ≥ 10). Les deux intervalles sont proches.","ok");
    });
  }
});

SFA.sim({
  id:"us-c06-student-contre-normale", ch:"c06", tag:"Classique",
  titre:"Student contre normale : l'effet des petits effectifs",
  resume:"La loi t a des queues plus lourdes que la normale ; elle s'en rapproche quand le nombre de degrés de liberté augmente.",
  but:"Fais varier les degrés de liberté ν = n − 1 et compare les quantiles t et z qui encadrent 90, 95 ou 99 % de l'aire.",
  aRetenir:"ν = n − 1 pour une moyenne. t<sub>0,975</sub> = 12,71 pour ν = 1, 2,26 pour ν = 9, 2,04 pour ν = 30, tend vers 1,96. Pour n ≥ 30, la différence entre t et z est faible, mais elle existe.",
  piege:"Utiliser z (1,96) avec s estimé sur un petit échantillon sous-estime la marge d'erreur.",
  build:function(k,S){
    var c=k.canvas(330);
    var df=k.slider("Degrés de liberté ν",1,100,1,5,"");
    var lev=k.seg("Niveau",[[0.90,"90 %"],[0.95,"95 %"],[0.99,"99 %"]],0.95);
    var ro=k.readouts(["t critique","z critique","t / z","Largeur supplémentaire"]);
    k.draw(function(){
      var P=S.draw.palette, p=(1+lev.value)/2, tc=ST.tppf(p,df.value), zc=ST.nppf(p);
      c.clear(); var ax=S.draw.axes(c,{x0:-6,x1:6,y0:0,y1:0.45,xl:"x",stepX:1,stepY:0.1});
      var ft=function(x){ return ST.tpdf(x,df.value); }, fz=ST.npdf;
      var xm=Math.min(6,tc);
      ST.fill(c,ax,ft,-xm,xm,"rgba(30,63,143,.12)"); ST.fill(c,ax,ft,-6,-xm,"rgba(180,35,24,.35)"); ST.fill(c,ax,ft,xm,6,"rgba(180,35,24,.35)");
      S.draw.fn(c,ax,fz,P.grey,2.2,[6,4]); S.draw.fn(c,ax,ft,P.acc,2.8);
      [-1,1].forEach(function(sg){ S.draw.line(c,ax.X(sg*zc),ax.T,ax.X(sg*zc),ax.B,P.grey,1.2,[3,4]); if(tc<=6) S.draw.line(c,ax.X(sg*tc),ax.T,ax.X(sg*tc),ax.B,P.red,1.6); });
      S.draw.text(c,"normale (pointillé)",ax.X(3.4),ax.Y(0.30),{size:12,color:P.grey}); S.draw.text(c,"t de Student, ν = "+df.value,ax.X(3.4),ax.Y(0.34),{size:12,color:P.acc});
      S.draw.text(c,S.fmt(100*(1-lev.value)/2,1)+" % de chaque côté",ax.X(0),ax.Y(0.05),{size:12,color:P.red});
      ro.set(0,S.fmt(tc,3)); ro.set(1,S.fmt(zc,3)); ro.set(2,S.fmt(tc/zc,3)); ro.set(3,"+ "+S.fmt(100*(tc/zc-1),1)+" %");
    });
  }
});

SFA.sim({
  id:"us-c06-interpretation-ic", ch:"c06", tag:"Original · piège d'interprétation",
  titre:"Que signifie vraiment « 95 % » ?",
  resume:"Un seul intervalle observé, puis des milliers d'études répétées : la part qui retombe dans l'intervalle n'est pas 95 %.",
  but:"Réalise une étude (σ connu = 15 mmHg, μ = 120). Observe son intervalle, puis 3 000 études répétées : où tombent leurs moyennes ? et les individus ?",
  aRetenir:"95 % décrit la procédure (95 % des intervalles contiennent μ), pas la probabilité que cet intervalle-ci contienne μ. Les moyennes d'une étude répétée retombent dans l'intervalle environ 83 % du temps en moyenne.",
  piege:"« 95 % des patients ont une valeur dans l'IC » est faux : l'IC concerne la moyenne, pas les individus. Il est bien plus étroit que l'étendue des valeurs individuelles.",
  build:function(k,S){
    var MU=120, SIG=15, c=k.canvas(330);
    var n=k.slider("Taille n",5,200,1,25,"");
    var lev=k.seg("Niveau",[[0.90,"90 %"],[0.95,"95 %"],[0.99,"99 %"]],0.95);
    var seed=3;
    var ro=k.readouts(["Intervalle observé","Vraie moyenne dans l'intervalle ?","Moyennes répétées dans l'intervalle","Individus dans l'intervalle"]);
    k.button("Nouvelle étude",function(){ seed++; },true);
    k.draw(function(){
      var P=S.draw.palette, nn=n.value, se=SIG/Math.sqrt(nn), z=ST.nppf((1+lev.value)/2);
      var r=ST.rng(seed*104729+nn), x=[],i; for(i=0;i<nn;i++) x.push(MU+SIG*ST.randn(r)); var m=ST.mean(x), lo=m-z*se, hi=m+z*se;
      var rr=ST.rng(seed*31+5), reps=[], inN=0; for(i=0;i<3000;i++){ var mm=MU+se*ST.randn(rr); reps.push(mm); if(mm>=lo&&mm<=hi) inN++; }
      var indiv=ST.ncdf((hi-MU)/SIG)-ST.ncdf((lo-MU)/SIG);
      c.clear(); var h=4*SIG/Math.sqrt(Math.min(nn,25))+2*SIG/Math.sqrt(nn);
      var ax=S.draw.axes(c,{x0:MU-4.3*se,x1:MU+4.3*se,y0:0,y1:1,xl:"mmHg",grid:false,stepY:5});
      var bins=48, b=new Array(bins).fill(0), w=(ax.x1-ax.x0)/bins, mx=1;
      reps.forEach(function(v){ var j=Math.floor((v-ax.x0)/w); if(j>=0&&j<bins) b[j]++; }); b.forEach(function(v){ if(v>mx) mx=v; });
      for(i=0;i<bins;i++){ var xa=ax.x0+i*w, inside=(xa+w/2>=lo&&xa+w/2<=hi); c.ctx.fillStyle=inside?"rgba(46,107,85,.55)":"rgba(138,149,163,.45)";
        var hh=b[i]/mx*(ax.B-ax.T-70); c.ctx.fillRect(ax.X(xa)+0.5,ax.B-hh,Math.max(1,ax.X(xa+w)-ax.X(xa)-1),hh); }
      S.draw.line(c,ax.X(MU),ax.T+40,ax.X(MU),ax.B,P.ink,1.5,[5,4]); S.draw.text(c,"μ",ax.X(MU),ax.T+32,{size:13,color:P.ink,math:true});
      S.draw.line(c,ax.X(lo),ax.T+16,ax.X(hi),ax.T+16,P.acc,5); S.draw.dot(c,ax.X(m),ax.T+16,6,P.red);
      S.draw.text(c,"IC de cette étude",ax.X(m),ax.T+2,{size:11,color:P.acc});
      S.draw.text(c,"histogramme de 3 000 moyennes d'études répétées",ax.R-4,ax.B-ax.T>0?ax.B-(ax.B-ax.T-70)-8:0,{align:"right",size:11,color:P.grey});
      var ok=lo<=MU&&MU<=hi;
      ro.set(0,"["+S.fmt(lo,1)+" ; "+S.fmt(hi,1)+"]"); ro.set(1,ok?"oui":"non"); ro.set(2,S.fmt(100*inN/3000,1)+" %"); ro.set(3,S.fmt(100*indiv,1)+" %");
    });
  }
});
})();
