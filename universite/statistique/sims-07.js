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
  id:"us-c07-test-conformite-moyenne", ch:"c07", tag:"Classique · P1",
  titre:"Test de conformité d'une moyenne : de la donnée à la décision",
  resume:"H₀, H₁, statistique t, p-valeur, région critique et décision, étape par étape.",
  but:"On compare la cholestérolémie moyenne d'un échantillon à la valeur de référence μ₀ = 5,2 mmol/L. Change les données et regarde où tombe la statistique t, et ce que vaut la p-valeur.",
  aRetenir:"t = (x̄ − μ₀)/(s/√n) suit une loi de Student à n − 1 ddl si H₀ est vraie. La p-valeur est la probabilité, sous H₀, d'obtenir un résultat au moins aussi extrême. On rejette H₀ si p ≤ α.",
  piege:"La p-valeur n'est pas la probabilité que H₀ soit vraie. Ne pas rejeter H₀ ne prouve pas que H₀ est vraie.",
  build:function(k,S){
    var MU0=5.2, c=k.canvas(300);
    var xb=k.slider("Moyenne observée x̄",4.5,6.5,0.05,5.5,"mmol/L");
    var s=k.slider("Écart-type s",0.5,2,0.1,1.1,"mmol/L");
    var n=k.slider("Taille n",5,200,1,30,"");
    var al=k.seg("Seuil α",[[0.10,"10 %"],[0.05,"5 %"],[0.01,"1 %"]],0.05);
    var alt=k.seg("Hypothèse alternative",[["bi","μ ≠ μ₀"],["dr","μ > μ₀"],["ga","μ < μ₀"]],"bi");
    var ro=k.readouts(["Statistique de test","Degrés de liberté","p-valeur","Décision"]);
    var nt=k.note("","");
    k.draw(function(){
      var P=S.draw.palette, df=n.value-1, t=(xb.value-MU0)/(s.value/Math.sqrt(n.value));
      var pv= alt.value==="bi" ? 2*(1-ST.tcdf(Math.abs(t),df)) : alt.value==="dr" ? 1-ST.tcdf(t,df) : ST.tcdf(t,df);
      var a=al.value, cr= alt.value==="bi" ? ST.tppf(1-a/2,df) : ST.tppf(1-a,df);
      c.clear(); var xm=Math.max(5,Math.abs(t)+1); xm=Math.min(xm,12);
      var ax=S.draw.axes(c,{x0:-xm,x1:xm,y0:0,y1:0.45,xl:"t",stepY:0.1});
      var f=function(x){ return ST.tpdf(x,df); };
      if(alt.value!=="ga") ST.fill(c,ax,f,Math.min(cr,xm),xm,"rgba(180,35,24,.18)");
      if(alt.value!=="dr") ST.fill(c,ax,f,-xm,-Math.min(cr,xm),"rgba(180,35,24,.18)");
      var tt=Math.max(-xm,Math.min(xm,t));
      if(alt.value==="bi"){ ST.fill(c,ax,f,Math.min(Math.abs(tt),xm),xm,"rgba(30,63,143,.5)"); ST.fill(c,ax,f,-xm,-Math.min(Math.abs(tt),xm),"rgba(30,63,143,.5)"); }
      else if(alt.value==="dr") ST.fill(c,ax,f,tt,xm,"rgba(30,63,143,.5)"); else ST.fill(c,ax,f,-xm,tt,"rgba(30,63,143,.5)");
      S.draw.fn(c,ax,f,P.ink,2.4);
      S.draw.line(c,ax.X(tt),ax.T,ax.X(tt),ax.B,P.acc,2.4); S.draw.text(c,"t observé = "+S.fmt(t,2),ax.X(tt)+(tt>0?-6:6),ax.T+10,{align:tt>0?"right":"left",size:12,color:P.acc});
      S.draw.text(c,"zone bleue = p-valeur ; zone rose = région critique",ax.X(0),ax.Y(0.22),{size:11,color:"#5f6b7a"});
      var rej=pv<=a;
      ro.set(0,S.fmt(t,2)); ro.set(1,df); ro.set(2,ST.pval(pv)); ro.set(3,rej?"rejet de H₀":"H₀ non rejetée");
      nt.set(rej?"p ≤ α : l'écart observé est trop grand pour n'être attribué qu'à la fluctuation d'échantillonnage sous H₀. Reste à juger s'il est cliniquement important.":"p &gt; α : les données sont compatibles avec H₀. Ce n'est pas une preuve que μ = μ₀ : l'échantillon est peut-être trop petit.",rej?"ok":"warn");
    });
  }
});

SFA.sim({
  id:"us-c07-erreurs-alpha-beta-puissance", ch:"c07", tag:"Classique · P1",
  titre:"Deux cloches : α, β et puissance",
  resume:"Sous H₀ et sous H₁ : déplace l'effet réel, n et le seuil, et lis les erreurs de 1re et 2e espèce.",
  but:"On teste H₀ : μ = μ₀ (σ connu, simplification) ; la vraie moyenne vaut en réalité μ₀ + effet. Les deux courbes sont la distribution de la statistique Z sous H₀ (gris) et sous la vérité (bleu).",
  aRetenir:"α = P(rejeter H₀ | H₀ vraie) ; β = P(ne pas rejeter H₀ | H₁ vraie) ; puissance = 1 − β. Augmenter n ou l'effet réel écarte les cloches et augmente la puissance ; baisser α diminue le risque de faux positif mais fait baisser la puissance.",
  piege:"α et β ne se rapportent pas à la même situation : α suppose H₀ vraie, β suppose H₁ vraie. Ce ne sont pas des probabilités que la décision soit fausse.",
  build:function(k,S){
    var c=k.canvas(320);
    var d=k.slider("Effet réel (en écarts-types σ)",0,1.5,0.05,0.5,"σ");
    var n=k.slider("Taille n",1,200,1,25,"");
    var al=k.seg("Seuil α",[[0.01,"1 %"],[0.05,"5 %"],[0.10,"10 %"]],0.05);
    var bi=k.seg("Test",[["bi","bilatéral"],["un","unilatéral droit"]],"un");
    var ro=k.readouts(["Risque de 1re espèce (α)","Risque de 2e espèce (β)","Puissance (1 − β)","Décalage des cloches"]);
    var nt=k.note("","");
    k.draw(function(){
      var P=S.draw.palette, sh=d.value*Math.sqrt(n.value), a=al.value, bil=bi.value==="bi";
      var zc= bil ? ST.nppf(1-a/2) : ST.nppf(1-a);
      var power= bil ? (1-ST.ncdf(zc-sh))+ST.ncdf(-zc-sh) : 1-ST.ncdf(zc-sh), beta=1-power;
      var x0=-4, x1=Math.max(5,sh+4); c.clear();
      var ax=S.draw.axes(c,{x0:x0,x1:x1,y0:0,y1:0.45,xl:"Z",stepY:0.1});
      var f0=ST.npdf, f1=function(x){ return ST.npdf(x-sh); };
      var lo=bil?-zc:x0, hi=zc;
      ST.fill(c,ax,f1,Math.max(x0,lo),Math.min(x1,hi),"rgba(180,83,9,.30)");
      if(bil) ST.fill(c,ax,f1,x0,Math.max(x0,-zc),"rgba(46,107,85,.35)");
      ST.fill(c,ax,f1,Math.min(x1,hi),x1,"rgba(46,107,85,.35)");
      if(bil){ ST.fill(c,ax,f0,zc,x1,"rgba(180,35,24,.55)"); ST.fill(c,ax,f0,x0,-zc,"rgba(180,35,24,.55)"); } else ST.fill(c,ax,f0,zc,x1,"rgba(180,35,24,.55)");
      S.draw.fn(c,ax,f0,P.grey,2.4); S.draw.fn(c,ax,f1,P.acc,2.6);
      S.draw.line(c,ax.X(zc),ax.T,ax.X(zc),ax.B,P.ink,1.6,[5,4]); if(bil) S.draw.line(c,ax.X(-zc),ax.T,ax.X(-zc),ax.B,P.ink,1.6,[5,4]);
      S.draw.text(c,"H₀",ax.X(0),ax.T+8,{size:13,color:P.grey}); S.draw.text(c,"vérité",ax.X(sh),ax.T+8,{size:13,color:P.acc});
      S.draw.text(c,"rouge : α  ·  orange : β  ·  vert : puissance",ax.L+6,ax.B-14,{align:"left",size:11,color:"#5f6b7a"});
      ro.set(0,S.fmt(100*a,1)+" %"); ro.set(1,S.fmt(100*beta,1)+" %"); ro.set(2,S.fmt(100*power,1)+" %"); ro.set(3,S.fmt(sh,2)+" (en unités de Z)");
      if(d.value===0) nt.set("Effet réel nul : H₀ est vraie. La « puissance » affichée est alors égale à α, c'est le taux de faux positifs.","warn");
      else if(power<0.8) nt.set("Puissance inférieure à 80 % : l'étude risque de manquer un effet réel (erreur de 2e espèce). Augmente n.","warn");
      else nt.set("Puissance d'au moins 80 %, la valeur minimale couramment visée.","ok");
    });
  }
});

SFA.sim({
  id:"us-c07-taille-echantillon-puissance", ch:"c07", tag:"Planifier une étude",
  titre:"Combien de sujets faut-il inclure ?",
  resume:"La taille n qui atteint la puissance visée, selon l'effet à détecter et le seuil α.",
  but:"Choisis l'effet à détecter (différence divisée par l'écart-type), α et la puissance visée. La courbe montre la puissance en fonction de n ; le point rouge est la taille minimale.",
  aRetenir:"Une moyenne contre une référence : n = ((z<sub>1−α/2</sub> + z<sub>1−β</sub>)/d)². Deux groupes indépendants : n par groupe = 2·((z<sub>1−α/2</sub> + z<sub>1−β</sub>)/d)². Diviser l'effet par 2 multiplie n par 4.",
  piege:"Formule approchée (loi normale) : avec Student, il faut quelques sujets de plus pour les petits n. L'effet d doit être fixé avant l'étude, d'après ce qui est cliniquement important.",
  build:function(k,S){
    var c=k.canvas(310);
    var d=k.slider("Effet à détecter d = différence/σ",0.1,1.5,0.05,0.5,"");
    var al=k.seg("Seuil α (bilatéral)",[[0.01,"1 %"],[0.05,"5 %"],[0.10,"10 %"]],0.05);
    var pw=k.seg("Puissance visée",[[0.8,"80 %"],[0.9,"90 %"],[0.95,"95 %"]],0.8);
    var pl=k.seg("Plan",[["1","un échantillon"],["2","deux groupes"]],"2");
    var ro=k.readouts(["n minimal","Total de sujets","n si l'effet est 2 fois plus petit"]);
    function power(nn,dd,a,pln){ var z=ST.nppf(1-a/2), sh=dd*Math.sqrt(pln==="2"?nn/2:nn); return 1-ST.ncdf(z-sh)+ST.ncdf(-z-sh); }
    function nreq(dd,a,pwr,pln){ var f=(ST.nppf(1-a/2)+ST.nppf(pwr))/dd; return Math.ceil((pln==="2"?2:1)*f*f); }
    k.draw(function(){
      var P=S.draw.palette, N=nreq(d.value,al.value,pw.value,pl.value), xmax=Math.max(20,Math.ceil(N*1.8/10)*10);
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:xmax,y0:0,y1:1,xl:pl.value==="2"?"n par groupe":"n",yl:"puissance"});
      S.draw.fn(c,ax,function(x){ return power(Math.max(x,1),d.value,al.value,pl.value); },P.acc,2.8);
      S.draw.line(c,ax.L,ax.Y(pw.value),ax.R,ax.Y(pw.value),P.red,1.3,[5,4]);
      S.draw.line(c,ax.X(N),ax.Y(pw.value),ax.X(N),ax.B,P.red,1.3,[5,4]); S.draw.dot(c,ax.X(N),ax.Y(power(N,d.value,al.value,pl.value)),6,P.red);
      S.draw.text(c,"n = "+N,ax.X(N)+8,ax.Y(pw.value)+16,{align:"left",size:13,color:P.red});
      var N2=nreq(d.value/2,al.value,pw.value,pl.value);
      ro.set(0,N+(pl.value==="2"?" par groupe":"")); ro.set(1,pl.value==="2"?2*N:N); ro.set(2,N2);
    });
  }
});

SFA.sim({
  id:"us-c07-pvaleur-grands-echantillons", ch:"c07", tag:"Original · significatif ≠ pertinent",
  titre:"Significatif… mais utile ? Le poids de n",
  resume:"Un effet cliniquement négligeable devient « hautement significatif » quand n devient énorme.",
  but:"Un médicament baisse la pression de Δ mmHg en moyenne (σ = 15 mmHg). Fais croître n : la p-valeur chute alors que l'effet ne change pas. Compare avec le seuil de pertinence clinique.",
  aRetenir:"p dépend de l'effet ET de n (statistique z = Δ√n/σ). La significativité statistique ne dit rien de l'importance de l'effet : il faut lire l'estimation de l'effet et son intervalle de confiance.",
  piege:"« p &lt; 0,001 » ne signifie pas « effet important ». À l'inverse, un effet important peut être non significatif si n est trop petit.",
  build:function(k,S){
    var SIG=15, c=k.canvas(300);
    var dl=k.slider("Effet réel Δ",0.2,10,0.1,1,"mmHg");
    var ln=k.slider("log₁₀ n  (n de 10 à 100 000)",1,5,0.05,2,"");
    var cl=k.slider("Seuil de pertinence clinique",1,10,0.5,5,"mmHg");
    var ro=k.readouts(["n","z","p-valeur","IC 95 % de l'effet","Verdict"]);
    k.draw(function(){
      var P=S.draw.palette, n=Math.round(Math.pow(10,ln.value)), z=dl.value*Math.sqrt(n)/SIG, p=2*(1-ST.ncdf(z)), h=1.96*SIG/Math.sqrt(n);
      c.clear(); var ax=S.draw.axes(c,{x0:1,x1:5,y0:0,y1:8,xl:"log₁₀ n",yl:"−log₁₀ p",stepX:1,stepY:1});
      S.draw.fn(c,ax,function(x){ var zz=dl.value*Math.sqrt(Math.pow(10,x))/SIG, pp=2*(1-ST.ncdf(zz)); return Math.min(8,-Math.log10(Math.max(pp,1e-300))); },P.acc,2.8);
      S.draw.line(c,ax.L,ax.Y(-Math.log10(0.05)),ax.R,ax.Y(-Math.log10(0.05)),P.red,1.4,[5,4]); S.draw.text(c,"p = 0,05",ax.R-4,ax.Y(1.3)-9,{align:"right",size:11,color:P.red});
      S.draw.dot(c,ax.X(ln.value),ax.Y(Math.min(8,-Math.log10(Math.max(p,1e-300)))),6,P.red);
      var sig=p<0.05, rel=dl.value>=cl.value;
      ro.set(0,n.toLocaleString("fr-BE")); ro.set(1,S.fmt(z,2)); ro.set(2,ST.pval(p)); ro.set(3,"["+S.fmt(dl.value-h,2)+" ; "+S.fmt(dl.value+h,2)+"]");
      ro.set(4,(sig?"significatif":"non significatif")+", "+(rel?"pertinent":"négligeable"));
    });
  }
});

SFA.sim({
  id:"us-c07-tests-multiples-p-hacking", ch:"c07", tag:"Original · P1",
  titre:"20 tests, 1 découverte : les faux positifs s'accumulent",
  resume:"Quand toutes les hypothèses nulles sont vraies, tester beaucoup de critères produit presque toujours un résultat « significatif ».",
  but:"Aucun critère n'est réellement associé à l'issue (H₀ vraie partout). Simule une étude qui teste m critères : chaque case est une p-valeur. Compare avec la correction de Bonferroni.",
  aRetenir:"Pour m tests indépendants au seuil α, P(au moins un faux positif) = 1 − (1 − α)<sup>m</sup> ; pour m = 20 et α = 5 %, elle vaut 64 %. Bonferroni teste chaque critère au seuil α/m, ce qui ramène ce risque à environ α (au prix d'une puissance moindre).",
  piege:"Annoncer seulement le critère « significatif » parmi 20 testés (p-hacking) est trompeur : il faut déclarer tous les tests effectués, ou corriger.",
  build:function(k,S){
    var g=k.canvas(190), c=k.canvas(250);
    var m=k.slider("Nombre de tests m",1,100,1,20,"");
    var al=k.seg("Seuil α",[[0.01,"1 %"],[0.05,"5 %"],[0.10,"10 %"]],0.05);
    var bf=k.toggle("Correction de Bonferroni (seuil α/m)",false);
    var seed=22, cum={key:"",fp:0,tot:0};
    var ro=k.readouts(["Seuil appliqué à chaque test","Tests « significatifs » ici","Risque d'au moins 1 faux positif","Observé sur 2 000 études"]);
    k.button("Nouvelle étude",function(){ seed++; },true);
    function thr(){ return bf.value ? al.value/m.value : al.value; }
    k.draw(function(){
      var P=S.draw.palette, M=m.value, th=thr(), r=ST.rng(seed*65537+M), i, np=0;
      g.clear(); var cols=Math.min(M,10), rows=Math.ceil(M/cols), cw=(g.W-20)/cols, ch=Math.min(30,(g.H-20)/rows);
      for(i=0;i<M;i++){ var p=r(), x=10+(i%cols)*cw, y=10+Math.floor(i/cols)*ch, hit=p<th; if(hit) np++;
        g.ctx.fillStyle=hit?"rgba(180,35,24,.85)":"rgba(138,149,163,.30)"; g.ctx.fillRect(x+1,y+1,cw-2,ch-2);
        if(cw>26&&ch>13){ S.draw.text(g,S.fmt(p,2),x+cw/2,y+ch/2,{size:9,color:hit?"#fff":"#5f6b7a",weight:600}); } }
      var key=M+"|"+th; if(cum.key!==key){ var rr=ST.rng(99991+M), j, q, any, tot=2000, fp=0; for(j=0;j<tot;j++){ any=false; for(q=0;q<M;q++){ if(rr()<th){ any=true; break; } } if(any) fp++; } cum={key:key,fp:fp,tot:tot}; }
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:100,y0:0,y1:1,xl:"m",yl:"P(≥ 1 faux positif)",stepX:10,stepY:0.2});
      S.draw.fn(c,ax,function(x){ return 1-Math.pow(1-al.value,x); },P.red,2.6);
      S.draw.fn(c,ax,function(x){ return 1-Math.pow(1-al.value/Math.max(x,1),x); },P.green,2.6);
      S.draw.text(c,"sans correction",ax.X(70),ax.Y(1-Math.pow(1-al.value,70))-12,{size:11,color:P.red}); S.draw.text(c,"Bonferroni",ax.X(70),ax.Y(al.value)-12,{size:11,color:P.green});
      var risk=1-Math.pow(1-th,M); S.draw.dot(c,ax.X(M),ax.Y(1-Math.pow(1-(bf.value?al.value/M:al.value),M)),6,P.ink);
      ro.set(0,S.fmt(th,4)); ro.set(1,np+" sur "+M); ro.set(2,S.fmt(100*risk,1)+" %"); ro.set(3,S.fmt(100*cum.fp/cum.tot,1)+" %");
    });
  }
});
})();
