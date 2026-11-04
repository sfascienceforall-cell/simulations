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

function lround(ps,n){ /* effectifs entiers de somme n (plus grands restes) */
  var raw=ps.map(function(p){ return p*n; }), fl=raw.map(Math.floor), rem=n-fl.reduce(function(a,b){ return a+b; },0), idx=raw.map(function(v,i){ return [v-Math.floor(v),i]; }).sort(function(a,b){ return b[0]-a[0]; });
  for(var i=0;i<rem;i++) fl[idx[i][1]]++; return fl; }
function chiCurve(c,S,stat,df,xmax){
  var P=S.draw.palette, ax=S.draw.axes(c,{x0:0,x1:xmax,y0:0,y1:df<=2?(df===1?0.8:0.55):0.3,xl:"χ²",stepY:0.1});
  var f=function(x){ return Math.min(df===1?0.8:5,ST.chi2pdf(Math.max(x,1e-6),df)); }, crit=ST.chi2ppf(0.95,df);
  ST.fill(c,ax,f,Math.min(crit,xmax),xmax,"rgba(180,35,24,.25)"); if(stat<xmax) ST.fill(c,ax,f,stat,xmax,"rgba(30,63,143,.45)");
  S.draw.fn(c,ax,f,P.ink,2.4);
  S.draw.line(c,ax.X(Math.min(stat,xmax)),ax.T,ax.X(Math.min(stat,xmax)),ax.B,P.acc,2.4);
  S.draw.line(c,ax.X(crit),ax.T,ax.X(crit),ax.B,P.red,1.4,[5,4]);
  S.draw.text(c,"seuil 5 % = "+S.fmt(crit,2),Math.min(ax.X(crit)+4,ax.R-4),ax.T+30,{align:ax.X(crit)>ax.R-110?"right":"left",size:11,color:P.red});
  S.draw.text(c,"χ² observé = "+S.fmt(stat,2),Math.min(ax.X(Math.min(stat,xmax))+(stat>crit?-6:6),ax.R-4),ax.T+12,{align:stat>crit?"right":"left",size:12,color:P.acc});
}
SFA.sim({
  id:"us-c09-chi2-adequation-mendel", ch:"c09", tag:"Classique",
  titre:"χ² d'adéquation : un croisement respecte-t-il 3:1, 1:2:1 ou 9:3:3:1 ?",
  resume:"Compare des effectifs de descendants aux proportions attendues ; lis χ², degrés de liberté et p-valeur.",
  but:"Choisis la proportion théorique et le nombre de descendants, puis éloigne progressivement les effectifs observés de la théorie : le χ² croît, la p-valeur chute.",
  aRetenir:"χ² = Σ (O − E)²/E, avec E = n × proportion théorique. Degrés de liberté = (nombre de classes − 1). On rejette le modèle si χ² dépasse la valeur critique (p &lt; 0,05).",
  piege:"Le test exige des effectifs théoriques ≥ 5 par classe. Un grand n rend le test sensible à des écarts minuscules. « Ne pas rejeter 3:1 » ne prouve pas que 3:1 est vrai.",
  build:function(k,S){
    var c=k.canvas(220), tb=k.canvas(130);
    var sc=k.seg("Proportion théorique",[["31","3:1"],["121","1:2:1"],["9331","9:3:3:1"]],"9331");
    var n=k.slider("Nombre de descendants n",20,2000,10,320,"");
    var e=k.slider("Écart à la théorie (en points de proportion)",0,15,0.5,5,"%");
    var ro=k.readouts(["χ²","Degrés de liberté","p-valeur","Décision (5 %)"]);
    var nt=k.note("","");
    k.draw(function(){
      var P=S.draw.palette, eps=e.value/100, th, ob, names;
      if(sc.value==="31"){ th=[0.75,0.25]; ob=[0.75-eps,0.25+eps]; names=["dominant","récessif"]; }
      else if(sc.value==="121"){ th=[0.25,0.5,0.25]; ob=[0.25+eps/2,0.5-eps,0.25+eps/2]; names=["AA","Aa","aa"]; }
      else { th=[9/16,3/16,3/16,1/16]; ob=[9/16-eps,3/16+eps/3,3/16+eps/3,1/16+eps/3]; names=["A·B·","A·bb","aaB·","aabb"]; }
      var O=lround(ob,n.value), E=th.map(function(p){ return p*n.value; }), chi=0, minE=1e9, contrib=[];
      O.forEach(function(o,i){ var q=Math.pow(o-E[i],2)/E[i]; contrib.push(q); chi+=q; if(E[i]<minE) minE=E[i]; });
      var df=th.length-1, p=1-ST.chi2cdf(chi,df);
      c.clear(); chiCurve(c,S,chi,df,Math.max(12,Math.min(60,chi*1.3+4)));
      tb.clear(); var ctx=tb.ctx, w=(tb.W-40)/th.length, mx=Math.max.apply(null,O.concat(E))*1.15;
      for(var i=0;i<th.length;i++){ var x=20+i*w, h1=O[i]/mx*90, h2=E[i]/mx*90;
        ctx.fillStyle="rgba(30,63,143,.85)"; ctx.fillRect(x+w*0.12,110-h1,w*0.34,h1); ctx.fillStyle="rgba(138,149,163,.7)"; ctx.fillRect(x+w*0.50,110-h2,w*0.34,h2);
        S.draw.text(tb,names[i],x+w/2,122,{size:11,color:"#2c3a4e"}); S.draw.text(tb,String(O[i]),x+w*0.29,110-h1-8,{size:10,color:P.acc}); S.draw.text(tb,S.fmt(E[i],1),x+w*0.67,110-h2-8,{size:10,color:"#5f6b7a"}); }
      S.draw.text(tb,"bleu : observé · gris : attendu",tb.W-8,10,{align:"right",size:11,color:"#5f6b7a"});
      ro.set(0,S.fmt(chi,2)); ro.set(1,df); ro.set(2,ST.pval(p)); ro.set(3,p<0.05?"modèle rejeté":"compatible");
      if(minE<5) nt.set("Effectif théorique minimal = "+S.fmt(minE,1)+" &lt; 5 : le test du χ² n'est plus fiable, regroupe des classes ou augmente n.","warn");
      else nt.set(p<0.05?"Les effectifs observés s'écartent trop du modèle : sous H₀, un tel écart serait rare (p &lt; 5 %).":"Écart compatible avec la fluctuation d'échantillonnage sous le modèle.",p<0.05?"warn":"ok");
    });
  }
});

SFA.sim({
  id:"us-c09-chi2-independance", ch:"c09", tag:"Classique · P1",
  titre:"χ² d'indépendance sur un tableau 2 × 2",
  resume:"Effectifs théoriques, χ², p-valeur et force de l'association, avec ou sans correction de Yates.",
  but:"Un facteur d'exposition (tabagisme) et une maladie. Fixe la taille de l'étude, la part d'exposés et le risque dans chaque groupe : le tableau, les effectifs théoriques et le χ² se mettent à jour.",
  aRetenir:"E<sub>ij</sub> = (total ligne × total colonne)/N ; χ² = Σ (O − E)²/E ; ν = (lignes − 1)(colonnes − 1) = 1 pour un 2 × 2. Le χ² mesure l'écart à l'indépendance ; le coefficient φ = √(χ²/N) mesure la force de l'association.",
  piege:"Un p très petit ne dit pas que l'association est forte (regarde φ ou le risque relatif). Si un effectif théorique est inférieur à 5, utilise le test exact de Fisher.",
  build:function(k,S){
    var c=k.canvas(230);
    var n=k.slider("Effectif total N",40,2000,10,400,"");
    var pe=k.slider("Part d'exposés (fumeurs)",0.1,0.9,0.05,0.4,"");
    var r1=k.slider("Risque chez les exposés",0,0.6,0.01,0.2,"");
    var r0=k.slider("Risque chez les non-exposés",0,0.6,0.01,0.12,"");
    var yt=k.toggle("Correction de continuité de Yates",false);
    var ro=k.readouts(["χ²","p-valeur","Force de l'association (phi)","Effectif théorique minimal"]);
    var tbl=k.note("","");
    var nt=k.note("","");
    k.draw(function(){
      var P=S.draw.palette, N=n.value, nE=Math.round(N*pe.value), nN=N-nE, a=Math.round(nE*r1.value), b=nE-a, cc=Math.round(nN*r0.value), d=nN-cc;
      var R1=a+b, R2=cc+d, C1=a+cc, C2=b+d, E=[[R1*C1/N,R1*C2/N],[R2*C1/N,R2*C2/N]], O=[[a,b],[cc,d]], chi=0, minE=1e9, i, j;
      for(i=0;i<2;i++) for(j=0;j<2;j++){ var dev=Math.abs(O[i][j]-E[i][j]); if(yt.value) dev=Math.max(0,dev-0.5); if(E[i][j]>0) chi+=dev*dev/E[i][j]; minE=Math.min(minE,E[i][j]); }
      var p=1-ST.chi2cdf(chi,1), phi=Math.sqrt(chi/N);
      tbl.set('<table style="border-collapse:collapse;width:100%;font-size:13px;text-align:center"><tr><th></th><th>Malades</th><th>Sains</th><th>Total</th></tr><tr><td><b>Exposés</b></td><td>'+a+' <small>(att. '+S.fmt(E[0][0],1)+')</small></td><td>'+b+' <small>(att. '+S.fmt(E[0][1],1)+')</small></td><td>'+R1+'</td></tr><tr><td><b>Non exposés</b></td><td>'+cc+' <small>(att. '+S.fmt(E[1][0],1)+')</small></td><td>'+d+' <small>(att. '+S.fmt(E[1][1],1)+')</small></td><td>'+R2+'</td></tr><tr><td><b>Total</b></td><td>'+C1+'</td><td>'+C2+'</td><td>'+N+'</td></tr></table>');
      c.clear(); chiCurve(c,S,chi,1,Math.max(10,Math.min(60,chi*1.3+3)));
      ro.set(0,S.fmt(chi,2)); ro.set(1,ST.pval(p)); ro.set(2,S.fmt(phi,3)); ro.set(3,S.fmt(minE,1));
      if(minE<5) nt.set("Effectif théorique &lt; 5 : approximation du χ² douteuse, utilise le test exact de Fisher.","warn");
      else if(p<0.05&&phi<0.1) nt.set("Association statistiquement significative mais faible (φ &lt; 0,1) : l'effectif est grand, l'effet est petit.","warn");
      else nt.set(p<0.05?"Les variables ne sont pas indépendantes (p &lt; 5 %).":"Indépendance non rejetée.",p<0.05?"ok":"");
    });
  }
});

SFA.sim({
  id:"us-c09-risque-relatif-odds-ratio", ch:"c09", tag:"Classique · P1",
  titre:"Risque relatif, odds ratio, différence de risques",
  resume:"Trois mesures d'association à partir d'un tableau 2 × 2 : quand l'OR ressemble au RR, et quand il s'en éloigne.",
  but:"Étude de cohorte : règle le risque chez les non-exposés, le risque relatif réel et l'effectif. La courbe montre l'OR correspondant en fonction du risque de base.",
  aRetenir:"RR = (a/(a+b))/(c/(c+d)) ; OR = (a·d)/(b·c) ; DR = p₁ − p₀ ; NNT = 1/DR. OR ≈ RR seulement si la maladie est rare (risque de base inférieur à environ 10 %). Un IC de RR ou d'OR qui contient 1 correspond à une association non significative.",
  piege:"Quand la maladie est fréquente, l'OR exagère l'association par rapport au RR. Dans une étude cas-témoins, seul l'OR est estimable.",
  build:function(k,S){
    var c=k.canvas(250);
    var p0=k.slider("Risque chez les non-exposés",0.01,0.8,0.01,0.1,"");
    var rr=k.slider("Risque relatif réel",0.2,5,0.05,2,"");
    var n=k.slider("Effectif par groupe",50,3000,10,500,"");
    var ro=k.readouts(["RR [IC 95 %]","OR [IC 95 %]","Différence de risques","NNT / NNH"]);
    var tbl=k.note("",""), nt=k.note("","");
    k.draw(function(){
      var P=S.draw.palette, p1=Math.min(0.99,p0.value*rr.value), N=n.value, a=Math.round(N*p1), b=N-a, cc=Math.round(N*p0.value), d=N-cc;
      var RR=(a/N)/(cc/N), OR=(a*d)/(b*cc), seR=Math.sqrt(1/a-1/N+1/cc-1/N), seO=Math.sqrt(1/a+1/b+1/cc+1/d), dr=a/N-cc/N, z=1.96;
      tbl.set('<table style="border-collapse:collapse;width:100%;font-size:13px;text-align:center"><tr><th></th><th>Malades</th><th>Sains</th><th>Risque</th></tr><tr><td><b>Exposés</b></td><td>'+a+'</td><td>'+b+'</td><td>'+S.fmt(100*a/N,1)+' %</td></tr><tr><td><b>Non exposés</b></td><td>'+cc+'</td><td>'+d+'</td><td>'+S.fmt(100*cc/N,1)+' %</td></tr></table>');
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:0.8,y0:0,y1:Math.max(6,rr.value*1.4),xl:"risque de base",yl:"mesure",stepX:0.1});
      var orf=function(x){ var q=Math.min(0.999,x*rr.value); return (q/(1-q))/(x/(1-x)); };
      S.draw.fn(c,ax,function(){ return rr.value; },P.grey,2,[6,4]); S.draw.fn(c,ax,orf,P.acc,2.8);
      S.draw.line(c,ax.L,ax.Y(1),ax.R,ax.Y(1),"#c8d0dc",1.2);
      S.draw.dot(c,ax.X(p0.value),ax.Y(orf(p0.value)),6,P.red);
      S.draw.text(c,"RR réel (constant)",ax.X(0.6),ax.Y(rr.value)-10,{size:11,color:P.grey}); S.draw.text(c,"OR correspondant",ax.X(0.6),ax.Y(Math.min(orf(0.6),ax.y1*0.95))+12,{size:11,color:P.acc});
      if(a>0&&cc>0&&b>0&&d>0){
        ro.set(0,S.fmt(RR,2)+" ["+S.fmt(Math.exp(Math.log(RR)-z*seR),2)+" ; "+S.fmt(Math.exp(Math.log(RR)+z*seR),2)+"]");
        ro.set(1,S.fmt(OR,2)+" ["+S.fmt(Math.exp(Math.log(OR)-z*seO),2)+" ; "+S.fmt(Math.exp(Math.log(OR)+z*seO),2)+"]");
      } else { ro.set(0,"—"); ro.set(1,"—"); }
      ro.set(2,S.fmt(100*dr,1)+" points"); ro.set(3,Math.abs(dr)<1e-9?"—":(dr>0?"NNH ":"NNT ")+S.fmt(1/Math.abs(dr),0));
      if(p0.value*rr.value>0.99) nt.set("Le risque chez les exposés est plafonné à 99 % (un risque ne dépasse pas 1).","warn");
      else if(p0.value<=0.1) nt.set("Maladie rare : l'OR est très proche du RR.","ok");
      else nt.set("Maladie fréquente : l'OR s'éloigne du RR ("+S.fmt(OR,2)+" contre "+S.fmt(RR,2)+") et l'exagère.","warn");
    });
  }
});

SFA.sim({
  id:"us-c09-fisher-effectifs-faibles", ch:"c09", tag:"Original · petits effectifs",
  titre:"Test exact de Fisher contre χ² sur de petits effectifs",
  resume:"Avec quelques patients par case, le χ² peut se tromper ; le test exact calcule la p-valeur sans approximation.",
  but:"Un petit essai : traitement et guérison. Modifie les quatre cases. La p-valeur exacte de Fisher est comparée à celle du χ² (avec et sans Yates).",
  aRetenir:"Les marges étant fixées, le nombre de guéris dans le groupe traité suit une loi hypergéométrique. La p-valeur bilatérale de Fisher additionne les probabilités des tableaux au plus aussi probables que celui observé. Utilise Fisher dès qu'un effectif théorique est inférieur à 5.",
  piege:"Le χ² sans correction a tendance à être trop optimiste sur de petits effectifs ; Yates corrige en partie mais devient conservateur.",
  build:function(k,S){
    var c=k.canvas(250);
    var a=k.slider("Traités guéris",0,25,1,8,"");
    var b=k.slider("Traités non guéris",0,25,1,2,"");
    var cc=k.slider("Témoins guéris",0,25,1,3,"");
    var d=k.slider("Témoins non guéris",0,25,1,7,"");
    var ro=k.readouts(["Fisher exact (bilatéral)","χ² sans correction","χ² avec Yates","Effectif théorique minimal"]);
    var nt=k.note("","");
    function lh(a,b,cc,d){ var n=a+b+cc+d; return ST.lfact(a+b)+ST.lfact(cc+d)+ST.lfact(a+cc)+ST.lfact(b+d)-ST.lfact(n)-ST.lfact(a)-ST.lfact(b)-ST.lfact(cc)-ST.lfact(d); }
    k.draw(function(){
      var P=S.draw.palette, A=a.value,B=b.value,C=cc.value,D=d.value, N=A+B+C+D, R1=A+B,R2=C+D,C1=A+C,C2=B+D;
      if(N===0||R1===0||R2===0||C1===0||C2===0){ c.clear(); nt.set("Une ligne ou une colonne est vide : le test n'est pas défini.","warn"); ro.set(0,"—"); ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); return; }
      var lo=Math.max(0,C1-R2), hi=Math.min(R1,C1), pobs=Math.exp(lh(A,R1-A,C1-A,R2-(C1-A))), pf=0, probs=[], x;
      for(x=lo;x<=hi;x++){ var q=Math.exp(lh(x,R1-x,C1-x,R2-(C1-x))); probs.push(q); if(q<=pobs*(1+1e-9)) pf+=q; }
      pf=Math.min(1,pf);
      var E=[R1*C1/N,R1*C2/N,R2*C1/N,R2*C2/N], O=[A,B,C,D], chi=0, chiY=0, minE=Math.min.apply(null,E);
      for(var i=0;i<4;i++){ chi+=Math.pow(O[i]-E[i],2)/E[i]; chiY+=Math.pow(Math.max(0,Math.abs(O[i]-E[i])-0.5),2)/E[i]; }
      c.clear(); var ax=S.draw.axes(c,{x0:lo-0.5,x1:hi+0.5,y0:0,y1:Math.max.apply(null,probs)*1.2,xl:"traités guéris",yl:"probabilité",stepX:1,stepY:0.05});
      var w=(ax.R-ax.L)/(hi-lo+1);
      probs.forEach(function(q,i){ var xx=lo+i, ex=q<=pobs*(1+1e-9); c.ctx.fillStyle=xx===A?"rgba(30,63,143,.9)":(ex?"rgba(180,35,24,.55)":"rgba(138,149,163,.5)"); c.ctx.fillRect(ax.X(xx-0.5)+2,ax.Y(q),w-4,ax.B-ax.Y(q)); });
      S.draw.text(c,"bleu : tableau observé · rouge : au plus aussi probables (somme = p de Fisher)",ax.R-4,ax.T+24,{align:"right",size:11,color:"#5f6b7a"});
      ro.set(0,ST.pval(pf)); ro.set(1,ST.pval(1-ST.chi2cdf(chi,1))); ro.set(2,ST.pval(1-ST.chi2cdf(chiY,1))); ro.set(3,S.fmt(minE,2));
      nt.set(minE<5?"Effectif théorique minimal &lt; 5 : le χ² n'est pas fiable ici ; retiens la p-valeur de Fisher.":"Effectifs théoriques ≥ 5 : le χ² et Fisher donnent des résultats proches.",minE<5?"warn":"ok");
    });
  }
});

SFA.sim({
  id:"us-c09-paradoxe-de-simpson", ch:"c09", tag:"Original · confusion",
  titre:"Paradoxe de Simpson : un traitement meilleur partout, moins bon au total",
  resume:"Un traitement qui gagne dans chaque stratum de gravité peut perdre dans l'ensemble, si les deux groupes n'ont pas la même gravité.",
  but:"Le traitement A réussit mieux que B chez les cas légers (92 % contre 88 %) et chez les cas graves (60 % contre 55 %). Fais varier la proportion de cas graves dans chaque groupe et regarde le taux global.",
  aRetenir:"Quand la gravité influence à la fois le choix du traitement et le résultat, c'est une variable de confusion : comparer les groupes globalement est trompeur. On stratifie ou on randomise.",
  piege:"Les taux globaux sont des moyennes pondérées par la composition des groupes. Si A reçoit surtout des cas graves, son taux global baisse même s'il est meilleur à gravité égale.",
  build:function(k,S){
    var c=k.canvas(300);
    var sa=k.slider("Cas graves parmi les patients du traitement A",0.1,0.9,0.05,0.7,"");
    var sb=k.slider("Cas graves parmi les patients du traitement B",0.1,0.9,0.05,0.2,"");
    var ro=k.readouts(["Succès global A","Succès global B","Légers : A − B","Graves : A − B"]);
    var nt=k.note("","");
    var rL={A:0.92,B:0.88}, rG={A:0.60,B:0.55};
    k.draw(function(){
      var P=S.draw.palette, gA=(1-sa.value)*rL.A+sa.value*rG.A, gB=(1-sb.value)*rL.B+sb.value*rG.B;
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:3,y0:0,y1:1.12,yl:"taux de succès",stepX:100,hideZero:true,stepY:0.2,l:50});
      var cats=[["Cas légers",rL.A,rL.B],["Cas graves",rG.A,rG.B],["Ensemble",gA,gB]];
      cats.forEach(function(ct,i){ var cx=ax.X(i+0.5), w=(ax.X(1)-ax.X(0))*0.28;
        c.ctx.fillStyle="rgba(30,63,143,.85)"; c.ctx.fillRect(cx-w-3,ax.Y(ct[1]),w,ax.B-ax.Y(ct[1])); c.ctx.fillStyle="rgba(138,149,163,.85)"; c.ctx.fillRect(cx+3,ax.Y(ct[2]),w,ax.B-ax.Y(ct[2]));
        S.draw.text(c,S.fmt(100*ct[1],0)+" %",cx-w/2-3,ax.Y(ct[1])-9,{size:11,color:P.acc}); S.draw.text(c,S.fmt(100*ct[2],0)+" %",cx+w/2+3,ax.Y(ct[2])-9,{size:11,color:"#5f6b7a"});
        S.draw.text(c,ct[0],cx,ax.B+20,{size:12,color:"#2c3a4e"}); });
      S.draw.text(c,"A (bleu)  ·  B (gris)",ax.R-4,ax.T+8,{align:"right",size:12,color:"#5f6b7a"});
      ro.set(0,S.fmt(100*gA,1)+" %"); ro.set(1,S.fmt(100*gB,1)+" %"); ro.set(2,"+ "+S.fmt(100*(rL.A-rL.B),0)+" points"); ro.set(3,"+ "+S.fmt(100*(rG.A-rG.B),0)+" points");
      if(gA<gB) nt.set("Paradoxe : A est meilleur dans les deux strates mais son taux global ("+S.fmt(100*gA,1)+" %) est inférieur à celui de B ("+S.fmt(100*gB,1)+" %). La gravité est un facteur de confusion.","warn");
      else nt.set("Les groupes ont des compositions proches : le taux global reflète la supériorité de A.","ok");
    });
  }
});
})();
