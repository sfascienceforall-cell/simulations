/* Chapitre 10 : variables aléatoires, loi binomiale, loi normale, TCL */
(function(){
var LF=[0]; function lf(n){ while(LF.length<=n) LF.push(LF[LF.length-1]+Math.log(LF.length)); return LF[n]; }
function pmf(n,k,p){ if(k<0||k>n) return 0; if(p<=0) return k===0?1:0; if(p>=1) return k===n?1:0; return Math.exp(lf(n)-lf(k)-lf(n-k)+k*Math.log(p)+(n-k)*Math.log(1-p)); }
function cdfB(n,k,p){ var s=0; for(var i=0;i<=Math.min(k,n);i++) s+=pmf(n,i,p); return Math.min(1,s); }
function poisson(l,k){ return Math.exp(-l+k*Math.log(l)-lf(k)); }
function erf(x){ var s=x<0?-1:1, a=Math.abs(x); if(a>6) return s;
  if(a<=3){ var t=a, sum=a, n=0; for(n=1;n<80;n++){ t*=-a*a/n; sum+=t/(2*n+1); } return s*2/Math.sqrt(Math.PI)*sum; }
  var e=Math.exp(-a*a)/(a*Math.sqrt(Math.PI)), ser=1-1/(2*a*a)+3/(4*a*a*a*a)-15/(8*Math.pow(a,6)); return s*(1-e*ser); }
function Phi(z){ return 0.5*(1+erf(z/Math.SQRT2)); }
function phi(z){ return Math.exp(-z*z/2)/Math.sqrt(2*Math.PI); }
SFA.Phi=Phi;
function pc(S,x,d){ return S.fmt(x*100,d===undefined?2:d)+" %"; }

SFA.sim({
  id:"m6-c10-binomiale", ch:"c10", tag:"Classique",
  titre:"La loi binomiale B(n ; p) en bâtons",
  resume:"Fais varier n et p : le diagramme, l'espérance np et l'écart-type √(npq) suivent.",
  but:"Règle n (nombre d'essais) et p (probabilité de succès). Choisis une valeur k pour lire P(X = k) et P(X ≤ k). Active la comparaison avec la loi de Poisson quand p est petit.",
  aRetenir:"X = nombre de succès en n essais indépendants de probabilité p : P(X = k) = C(n ; k)·p<sup>k</sup>·(1−p)<sup>n−k</sup>. L'espérance (valeur moyenne à long terme) vaut E(X) = np et l'écart-type σ = √(np(1−p)). Pour n grand et p petit, B(n ; p) ressemble à la loi de Poisson de paramètre λ = np.",
  piege:"L'espérance n'est pas la valeur « certaine » : avec n = 10 et p = 0,5, E(X) = 5 mais P(X = 5) n'est que 24,6 %. Et P(X ≥ k) = 1 − P(X ≤ k − 1), pas 1 − P(X ≤ k).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.62});
    var n=k.slider("Nombre d'essais n",1,60,1,10,"",null), p=k.slider("Probabilité de succès p",0.01,0.99,0.01,0.5,"",null), kk=k.slider("Valeur k",0,60,1,5,"",null);
    var po=k.toggle("Comparer avec la loi de Poisson (λ = np)",false);
    var ro=k.readouts(["Espérance E(X) = np","Écart-type","Probabilité P(X = k)","Cumul P(X ≤ k) ; P(X ≥ k)"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, N=n.value, pp=p.value, K=Math.min(kk.value,N), mu=N*pp, sg=Math.sqrt(N*pp*(1-pp));
      var vals=[],mx=0; for(var i=0;i<=N;i++){ vals.push(pmf(N,i,pp)); if(vals[i]>mx) mx=vals[i]; }
      if(po.value){ for(i=0;i<=N;i++) mx=Math.max(mx,poisson(Math.max(mu,1e-9),i)); }
      mx*=1.15; var W=c.W,H=c.H,L=48,R=14,T=14,B=34, bw=(W-L-R)/(N+1);
      var Y=function(y){return H-B-y/mx*(H-T-B);};
      ctx.save(); ctx.font="600 11px Mulish, sans-serif"; ctx.fillStyle="#5f6b7a"; ctx.strokeStyle="#edf0f4"; ctx.textAlign="right"; ctx.textBaseline="middle";
      for(var j=0;j<=4;j++){ var v=mx*j/4; ctx.beginPath(); ctx.moveTo(L,Y(v)); ctx.lineTo(W-R,Y(v)); ctx.stroke(); ctx.fillText(S.fmt(v,2),L-5,Y(v)); }
      ctx.restore();
      ctx.save(); ctx.fillStyle="rgba(46,107,85,.12)"; var xa=L+(mu-sg+0.5)*bw, xb=L+(mu+sg+0.5)*bw; ctx.fillRect(Math.max(L,xa),T,Math.min(W-R,xb)-Math.max(L,xa),H-T-B); ctx.restore();
      var step=N>30?5:(N>15?2:1);
      for(i=0;i<=N;i++){ var x=L+i*bw, h=(H-T-B)*vals[i]/mx; ctx.fillStyle=(i===K)?P.red:(i<K?"#7f9bd8":"#b6c6ea"); ctx.fillRect(x+1,H-B-h,Math.max(1,bw-2),h); if(i%step===0) S.draw.text(c,String(i),x+bw/2,H-B+14,{size:12}); }
      if(po.value){ for(i=0;i<=N;i++) S.draw.dot(c,L+i*bw+bw/2,Y(poisson(Math.max(mu,1e-9),i)),Math.max(3,Math.min(5,bw/3)),P.amber); S.draw.text(c,"points : Poisson(λ = "+S.fmt(mu,2)+")",W-R-4,T+10,{size:12,align:"right",color:P.amber}); }
      S.draw.line(c,L+(mu+0.5)*bw,T,L+(mu+0.5)*bw,H-B,P.green,2,[5,4]); S.draw.text(c,"E(X)",L+(mu+0.5)*bw+4,T+8,{size:12,align:"left",color:P.green});
      S.draw.line(c,L,H-B,W-R,H-B,"#8a95a3",1.2);
      var cum=cdfB(N,K,pp), ge=1-(K>0?cdfB(N,K-1,pp):0);
      ro.set(0,S.fmt(mu,2)); ro.set(1,S.fmt(sg,3)); ro.set(2,pc(S,vals[K],2)); ro.set(3,pc(S,cum,1)+" ; "+pc(S,ge,1));
      if(po.value) nt.set(pp<=0.1&&N>=20?"p est petit et n grand : Poisson(np) est une bonne approximation de B(n ; p) (barres et points presque confondus).":"Ici p n'est pas petit ou n est trop petit : la loi de Poisson s'écarte nettement de la binomiale.", pp<=0.1&&N>=20?"ok":"warn");
      else nt.set("Bande verte : E(X) ± σ. Barres foncées : k de 0 à "+K+" (P(X ≤ k)).","ok");
    });
  }
});

SFA.sim({
  id:"m6-c10-normale", ch:"c10", tag:"Classique",
  titre:"La loi normale : cloche, μ, σ et aires",
  resume:"Fais varier μ et σ, choisis un intervalle : l'aire colorée est la probabilité.",
  but:"Règle la moyenne μ et l'écart-type σ. Choisis les bornes a et b (ou un bouton μ ± σ, 2σ, 3σ) : l'aire sous la cloche entre a et b est P(a ≤ X ≤ b).",
  aRetenir:"Pour X de loi N(μ ; σ), la courbe est une cloche symétrique centrée en μ ; σ mesure l'étalement. Règle 68-95-99,7 : P(|X − μ| ≤ σ) ≈ 68,3 % ; ≤ 2σ ≈ 95,4 % ; ≤ 3σ ≈ 99,7 %. On centre-réduit : Z = (X − μ)/σ suit N(0 ; 1), ce qui ramène tout calcul à la table (ou à la calculatrice).",
  piege:"La hauteur de la courbe n'est pas une probabilité : c'est la densité. La probabilité d'une valeur précise est nulle ; seule l'aire sur un intervalle compte. Et si σ double, la cloche s'aplatit mais l'aire totale reste 1.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.6});
    var mu=k.slider("Moyenne μ",-5,5,0.5,0,"",null), sg=k.slider("Écart-type σ",0.5,4,0.1,1.5,"",null);
    var a=k.slider("Borne a",-12,12,0.1,-1.5,"",null), b=k.slider("Borne b",-12,12,0.1,1.5,"",null);
    var seg=k.seg("Raccourci",[[1,"μ ± σ"],[2,"μ ± 2σ"],[3,"μ ± 3σ"]],1,function(m){ a.set(Math.round((mu.value-m*sg.value)*10)/10); b.set(Math.round((mu.value+m*sg.value)*10)/10); });
    var ro=k.readouts(["P(a ≤ X ≤ b)","z de a","z de b","Densité en μ"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, M=mu.value, s=sg.value, A=Math.min(a.value,b.value), Bv=Math.max(a.value,b.value);
      var ax=S.draw.axes(c,{x0:-12,x1:12,y0:0,y1:0.85,xl:"x",yl:"densité",stepX:2,stepY:0.2});
      var f=function(x){return phi((x-M)/s)/s;};
      ctx.save(); ctx.beginPath(); ctx.moveTo(ax.X(A),ax.Y(0)); for(var i=0;i<=120;i++){ var x=A+(Bv-A)*i/120; ctx.lineTo(ax.X(x),ax.Y(f(x))); } ctx.lineTo(ax.X(Bv),ax.Y(0)); ctx.closePath(); ctx.fillStyle="rgba(30,63,143,.25)"; ctx.fill(); ctx.restore();
      S.draw.fn(c,ax,f,P.acc,3);
      S.draw.line(c,ax.X(M),ax.Y(0),ax.X(M),ax.Y(f(M)),P.green,1.6,[5,4]);
      S.draw.line(c,ax.X(A),ax.Y(0),ax.X(A),ax.Y(f(A)),P.red,1.6); S.draw.line(c,ax.X(Bv),ax.Y(0),ax.X(Bv),ax.Y(f(Bv)),P.red,1.6);
      var pr=Phi((Bv-M)/s)-Phi((A-M)/s);
      ro.set(0,pc(S,pr,2)); ro.set(1,S.fmt((A-M)/s,2)); ro.set(2,S.fmt((Bv-M)/s,2)); ro.set(3,S.fmt(f(M),3));
      nt.set("P("+S.fmt(A,1)+" ≤ X ≤ "+S.fmt(Bv,1)+") = Φ("+S.fmt((Bv-M)/s,2)+") − Φ("+S.fmt((A-M)/s,2)+") = "+S.fmt(Phi((Bv-M)/s),4)+" − "+S.fmt(Phi((A-M)/s),4)+" = "+S.fmt(pr,4)+".","ok");
    });
  }
});

SFA.sim({
  id:"m6-c10-binom-normale", ch:"c10", tag:"Approximation",
  titre:"De la binomiale à la cloche, avec correction de continuité",
  resume:"Augmente n : les bâtons épousent la courbe normale ; compare le calcul exact et les approximations.",
  but:"Règle n et p, puis k. Le tableau compare P(X ≤ k) exact, l'approximation normale sans correction et avec correction de continuité (on utilise k + 0,5).",
  aRetenir:"Si np ≥ 5 et n(1−p) ≥ 5, B(n ; p) est bien approchée par N(np ; √(np(1−p))). Comme X est entier et la loi normale continue, on corrige : P(X ≤ k) ≈ Φ((k + 0,5 − np)/σ). Le « +0,5 » représente la demi-largeur du bâton en k.",
  piege:"Hors des conditions (np ou n(1−p) petit), la cloche est trompeuse : la loi binomiale est alors asymétrique. Et oublier la correction de continuité fait perdre une précision qui compte pour n modéré.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.62});
    var n=k.slider("Nombre d'essais n",5,200,1,30,"",null), p=k.slider("Probabilité p",0.05,0.95,0.05,0.4,"",null), kk=k.slider("Valeur k",0,200,1,12,"",null);
    var ro=k.readouts(["P(X ≤ k) exact","Normale sans correction","Normale avec correction","Conditions d'approximation"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, N=n.value, pp=p.value, mu=N*pp, sg=Math.sqrt(N*pp*(1-pp)), K=Math.min(kk.value,N);
      var lo=Math.max(0,Math.floor(mu-4.2*sg)), hi=Math.min(N,Math.ceil(mu+4.2*sg)); if(hi-lo<6){ lo=Math.max(0,lo-2); hi=Math.min(N,hi+2); }
      var ymax=0; for(var i=lo;i<=hi;i++) ymax=Math.max(ymax,pmf(N,i,pp)); ymax=Math.max(ymax,phi(0)/sg)*1.15;
      var W=c.W,H=c.H,L=48,R=14,T=14,B=34, cnt=hi-lo+1, bw=(W-L-R)/cnt;
      var X=function(v){return L+(v-lo+0.5)*bw;}, Y=function(y){return H-B-y/ymax*(H-T-B);};
      ctx.save(); ctx.font="600 11px Mulish, sans-serif"; ctx.fillStyle="#5f6b7a"; ctx.strokeStyle="#edf0f4"; ctx.textAlign="right"; ctx.textBaseline="middle";
      for(var j=0;j<=4;j++){ var v=ymax*j/4; ctx.beginPath(); ctx.moveTo(L,Y(v)); ctx.lineTo(W-R,Y(v)); ctx.stroke(); ctx.fillText(S.fmt(v,3),L-5,Y(v)); } ctx.restore();
      var st=cnt>30?5:(cnt>15?2:1);
      for(i=lo;i<=hi;i++){ var h=(H-T-B)*pmf(N,i,pp)/ymax; ctx.fillStyle=(i<=K)?"#7f9bd8":"#c5d2ee"; ctx.fillRect(X(i)-bw/2+1,H-B-h,Math.max(1,bw-2),h); if(i%st===0) S.draw.text(c,String(i),X(i),H-B+14,{size:12}); }
      ctx.save(); ctx.beginPath(); ctx.rect(L,T,W-L-R,H-T-B); ctx.clip(); ctx.strokeStyle=P.red; ctx.lineWidth=2.6; ctx.beginPath();
      for(var q=0;q<=240;q++){ var x=lo-0.5+(cnt)*q/240, y=phi((x-mu)/sg)/sg; if(q===0) ctx.moveTo(L+(x-lo+0.5)*bw+0*0,Y(y)); else ctx.lineTo(L+(x-lo+0.5)*bw,Y(y)); } ctx.stroke(); ctx.restore();
      var xk=L+(K+0.5-lo+0.5)*bw; S.draw.line(c,xk,T,xk,H-B,P.violet,1.8,[5,4]); S.draw.text(c,"k + 0,5",xk+4,T+8,{size:12,align:"left",color:P.violet});
      S.draw.line(c,L,H-B,W-R,H-B,"#8a95a3",1.2);
      var ex=cdfB(N,K,pp), a1=Phi((K-mu)/sg), a2=Phi((K+0.5-mu)/sg), okc=(mu>=5&&N*(1-pp)>=5);
      ro.set(0,S.fmt(ex,4)); ro.set(1,S.fmt(a1,4)+" (écart "+S.fmt(a1-ex,4)+")"); ro.set(2,S.fmt(a2,4)+" (écart "+S.fmt(a2-ex,4)+")"); ro.set(3,"np = "+S.fmt(mu,1)+" ; nq = "+S.fmt(N*(1-pp),1)+(okc?" ✓":" ✗"));
      nt.set(okc?"Conditions remplies : l'approximation avec correction est la plus proche de la valeur exacte.":"np ou n(1−p) est inférieur à 5 : la cloche approche mal la binomiale (asymétrique). N'utilise pas cette approximation.", okc?"ok":"warn");
    });
  }
});

SFA.sim({
  id:"m6-c10-tcl", ch:"c10", tag:"Théorème central limite",
  titre:"La moyenne de beaucoup de tirages devient normale",
  resume:"Quelle que soit la loi de départ, la distribution des moyennes d'échantillons devient une cloche.",
  but:"Choisis une loi de départ et la taille m des échantillons. Chaque simulation calcule la moyenne de m tirages ; l'histogramme montre la distribution de ces moyennes, comparée à la cloche N(μ ; σ/√m).",
  aRetenir:"Si on moyenne m tirages indépendants d'une même loi (moyenne μ, écart-type σ), la moyenne a pour espérance μ et pour écart-type σ/√m ; et pour m grand sa distribution est proche d'une loi normale, quelle que soit la loi de départ (théorème central limite, admis). Il faut quadrupler m pour diviser l'écart-type de la moyenne par 2.",
  piege:"Le théorème porte sur la distribution des <i>moyennes</i>, pas sur les données individuelles : les tirages eux-mêmes restent asymétriques. Et pour une loi très asymétrique il faut un m plus grand pour que la cloche apparaisse.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.62});
    var D={
      d:{n:"Dé équilibré (1 à 6)",v:[[1,1/6],[2,1/6],[3,1/6],[4,1/6],[5,1/6],[6,1/6]]},
      a:{n:"Loi très asymétrique",v:[[0,0.5],[1,0.3],[2,0.12],[5,0.06],[12,0.02]]},
      b:{n:"Pile ou face très biaisé (1 avec p = 0,1)",v:[[0,0.9],[1,0.1]]}
    };
    var sel=k.select("Loi de départ",[["d","Dé équilibré (1 à 6)"],["a","Loi très asymétrique"],["b","Pile ou face biaisé : 1 avec p = 0,1"]],"d",function(){ reset(); });
    var m=k.slider("Taille m de l'échantillon",1,100,1,1,"",function(){ reset(); });
    var means=[];
    function reset(){ means=[]; }
    function draw1(d){ var u=Math.random(),s=0; for(var i=0;i<d.v.length;i++){ s+=d.v[i][1]; if(u<s) return d.v[i][0]; } return d.v[d.v.length-1][0]; }
    function sim(N){ var d=D[sel.value], mm=m.value; for(var i=0;i<N;i++){ var s=0; for(var j=0;j<mm;j++) s+=draw1(d); means.push(s/mm); } }
    k.button("+ 100 échantillons",function(){ sim(100); },true); k.button("+ 2 000 échantillons",function(){ sim(2000); }); k.button("Remise à zéro",reset);
    var ro=k.readouts(["Échantillons","Moyenne des moyennes","Écart-type observé","Écart-type théorique"]);
    var nt=k.note("Lance des échantillons pour voir l'histogramme.","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, d=D[sel.value], mm=m.value;
      var mu=0; d.v.forEach(function(q){mu+=q[0]*q[1];}); var va=0; d.v.forEach(function(q){va+=q[1]*Math.pow(q[0]-mu,2);}); var sg=Math.sqrt(va), sm=sg/Math.sqrt(mm);
      var lo=mu-4.2*sm, hi=mu+4.2*sm, vmin=d.v[0][0], vmax=d.v[d.v.length-1][0]; lo=Math.max(vmin-0.3,lo); hi=Math.min(vmax+0.3,hi); if(mm===1){ lo=vmin-0.5; hi=vmax+0.5; }
      var nb=mm===1?(vmax-vmin+1):40, bw=(hi-lo)/nb, cnt=new Array(nb).fill(0);
      means.forEach(function(x){ var i=Math.floor((x-lo)/bw); if(i>=0&&i<nb) cnt[i]++; });
      var tot=means.length, dens=cnt.map(function(q){return tot?q/(tot*bw):0;}), top=Math.max.apply(null,dens.concat([phi(0)/sm]))*1.12;
      var ax=S.draw.axes(c,{x0:lo,x1:hi,y0:0,y1:top,xl:"moyenne",yl:"densité"});
      for(var i2=0;i2<nb;i2++){ ctx.fillStyle="rgba(30,63,143,.4)"; ctx.fillRect(ax.X(lo+i2*bw)+0.5,ax.Y(dens[i2]),Math.max(1,ax.X(lo+(i2+1)*bw)-ax.X(lo+i2*bw)-1),ax.Y(0)-ax.Y(dens[i2])); }
      S.draw.fn(c,ax,function(x){return phi((x-mu)/sm)/sm;},P.red,2.6);
      S.draw.text(c,"courbe rouge : N(μ ; σ/√m)",ax.R-6,ax.T+10,{size:12,align:"right",color:P.red});
      var mo=0; means.forEach(function(x){mo+=x;}); mo=tot?mo/tot:0; var so=0; means.forEach(function(x){so+=(x-mo)*(x-mo);}); so=tot>1?Math.sqrt(so/(tot-1)):0;
      ro.set(0,String(tot)); ro.set(1,tot?S.fmt(mo,3)+" (μ = "+S.fmt(mu,3)+")":"—"); ro.set(2,tot>1?S.fmt(so,3):"—"); ro.set(3,S.fmt(sm,3));
      nt.set(mm===1?"m = 1 : l'histogramme reproduit la loi de départ (ici "+d.n.toLowerCase()+"), qui n'est pas une cloche.":(mm<10?"m est encore petit : la cloche est approximative, surtout si la loi de départ est asymétrique.":"m = "+mm+" : la distribution des moyennes est déjà proche de la cloche N("+S.fmt(mu,2)+" ; "+S.fmt(sm,2)+")."),"ok");
    });
  }
});
})();
