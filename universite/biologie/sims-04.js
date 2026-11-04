/* Biologie BA1 · chapitre 4 : communication cellulaire, excitabilité et homéostasie */

SFA.sim({
  id:"ub-c04-potentiel-action", ch:"c04", tag:"Excitabilité · classique",
  titre:"Potentiel d'action : seuil, tout ou rien et période réfractaire",
  resume:"Modèle de Hodgkin-Huxley : un stimulus sous le seuil ne donne rien ; au-dessus, un pic de même taille.",
  but:"Fais varier l'intensité du stimulus, active un second stimulus à intervalle réglable et bloque les canaux Na⁺ (TTX) ou K⁺ (TEA).",
  aRetenir:"Seuil : en dessous, la dépolarisation s'éteint ; au-dessus, un potentiel d'action d'amplitude fixe (≈ 100 mV) se déclenche : loi du tout ou rien. L'intensité est codée par la fréquence, pas par l'amplitude. Phase ascendante : ouverture des canaux Na⁺ voltage-dépendants ; repolarisation : inactivation de Na⁺ et ouverture de K⁺ ; période réfractaire : canaux Na⁺ inactivés. TTX bloque Na⁺ (pas de pic) ; TEA bloque K⁺ (repolarisation retardée).",
  piege:"Un stimulus plus fort ne donne pas un potentiel d'action plus grand, mais éventuellement plus fréquent. Pendant la période réfractaire absolue, aucun stimulus (même très fort) ne déclenche un second potentiel d'action.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(330);
    var I1=k.slider("Intensité du stimulus",0,40,0.5,10,"µA/cm²");
    var du=k.slider("Durée du stimulus",0.2,5,0.1,1,"ms");
    var tw=k.toggle("Second stimulus identique",false);
    var dl=k.slider("Délai du second stimulus",3,24,0.5,6,"ms");
    var dr=k.seg("Toxine",[["none","Aucune"],["ttx","TTX (bloque Na⁺)"],["tea","TEA (bloque K⁺)"]],"none");
    var ro=k.readouts(["Potentiel maximal","Nombre de potentiels d'action","Verdict"]);
    function run(){
      var gNa=120*(dr.value==="ttx"?0:1), gK=36*(dr.value==="tea"?0:1), gL=0.3, ENa=50, EK=-77, EL=-54.387, dt=0.01, V=-65;
      function an(V){var x=V+55;return Math.abs(x)<1e-6?0.1:0.01*x/(1-Math.exp(-x/10));}
      function bn(V){return 0.125*Math.exp(-(V+65)/80);}
      function am(V){var x=V+40;return Math.abs(x)<1e-6?1:0.1*x/(1-Math.exp(-x/10));}
      function bm(V){return 4*Math.exp(-(V+65)/18);}
      function ah(V){return 0.07*Math.exp(-(V+65)/20);}
      function bh(V){return 1/(1+Math.exp(-(V+35)/10));}
      var n=an(V)/(an(V)+bn(V)), m=am(V)/(am(V)+bm(V)), h=ah(V)/(ah(V)+bh(V)), out=[], sp=0, up=false, mx=-100;
      for(var i=0;i<=3000;i++){
        var t=i*dt, I=0;
        if(t>=2&&t<2+du.value) I+=I1.value;
        if(tw.value&&t>=2+dl.value&&t<2+dl.value+du.value) I+=I1.value;
        var dV=I-gNa*m*m*m*h*(V-ENa)-gK*n*n*n*n*(V-EK)-gL*(V-EL);
        m+=dt*(am(V)*(1-m)-bm(V)*m); h+=dt*(ah(V)*(1-h)-bh(V)*h); n+=dt*(an(V)*(1-n)-bn(V)*n); V+=dt*dV;
        if(!isFinite(V)) V=-65;
        if(V>mx) mx=V; if(V>0&&!up){sp++;up=true;} if(V<-20) up=false;
        if(i%10===0) out.push(V);
      }
      return {v:out,sp:sp,mx:mx};
    }
    k.draw(function(){
      c.clear(); var r=run(), ax=S.draw.axes(c,{x0:0,x1:30,y0:-80,y1:50,stepX:5,stepY:20,xl:"temps (ms)",yl:"Vm (mV)"}), ctx=c.ctx;
      /* stimulus */
      ctx.fillStyle="rgba(180,83,9,.18)"; ctx.fillRect(ax.X(2),ax.T,Math.max(2,ax.X(2+du.value)-ax.X(2)),ax.B-ax.T);
      if(tw.value) ctx.fillRect(ax.X(2+dl.value),ax.T,Math.max(2,ax.X(2+dl.value+du.value)-ax.X(2+dl.value)),ax.B-ax.T);
      S.draw.line(c,ax.L,ax.Y(-65),ax.R,ax.Y(-65),"#c8d1de",1,[4,4]);
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip(); ctx.strokeStyle=P.acc; ctx.lineWidth=2.4; ctx.beginPath();
      r.v.forEach(function(v,i){ var x=ax.X(i*0.1), y=ax.Y(v); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke(); ctx.restore();
      S.draw.text(c,"bandes orange : stimulus",ax.R-6,ax.T+10,{size:10,color:P.amber,align:"right"});
      var verdict = dr.value==="ttx"?"aucun pic (Na⁺ bloqué)":r.sp===0?"sous le seuil : pas de potentiel d'action":r.sp===1?"un potentiel d'action":r.sp+" potentiels d'action";
      if(tw.value&&r.sp===1) verdict+=" : le 2ᵉ stimulus tombe en période réfractaire";
      ro.set(0,S.fmt(r.mx,1)+" mV"); ro.set(1,String(r.sp)); ro.set(2,verdict);
    });
    k.note("Modèle d'axone géant de calmar à 6,3 °C (Hodgkin-Huxley, 1952), tension de repos −65 mV. À 37 °C chez les mammifères, tout est beaucoup plus rapide (pic en < 1 ms). Seuil de ≈ 6,5 µA/cm² pour 1 ms.","warn");
  }
});

SFA.sim({
  id:"ub-c04-propagation-myeline", ch:"c04", tag:"Conduction nerveuse",
  titre:"Vitesse de conduction : diamètre, myéline et sclérose en plaques",
  resume:"Course entre une fibre amyélinique et une fibre myélinisée de même diamètre, avec démyélinisation réglable.",
  but:"Règle le diamètre, la distance et le taux de démyélinisation ; lis les vitesses et les latences. Lance la course.",
  aRetenir:"Fibre amyélinique : v ≈ 1,1·√d (m/s, d en µm). Fibre myélinisée : v ≈ 6·d (m/s) : conduction saltatoire de nœud en nœud de Ranvier (≈ 100·d entre deux nœuds). Pour d = 10 µm, ≈ 60 m/s contre 3,5 m/s. La démyélinisation ralentit puis peut bloquer la conduction (sclérose en plaques).",
  piege:"La myéline n'isole pas pour « garder le courant » : elle diminue la capacité de membrane et force les canaux Na⁺ à se concentrer aux nœuds. Gros diamètre = plus rapide, mais la myéline est bien plus rentable en place.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(250);
    var d=k.slider("Diamètre de la fibre d",0.2,20,0.2,10,"µm");
    var L=k.slider("Distance à parcourir",0.05,1.5,0.05,1,"m");
    var dm=k.slider("Démyélinisation",0,100,5,0,"%");
    var ro=k.readouts(["v amyélinique","v myélinisée","Latence amyélinique","Latence myélinisée"]);
    var tA=0;
    var run=k.loop(function(dt,t){ tA=t; if(t>7) run.pause(); k.redraw(); });
    k.button("Lancer la course",function(){ run.reset(); tA=0; run.play(); },true);
    function fmtT(s){ return s<1?S.fmt(s*1000,1)+" ms":S.fmt(s,2)+" s"; }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, vu=1.1*Math.sqrt(d.value), vm=6*d.value, vx=vu+(1-dm.value/100)*(vm-vu);
      var Tu=L.value/vu, Tm=L.value/vx, Tmax=Math.max(Tu,Tm);
      ro.set(0,S.fmt(vu,2)+" m/s"); ro.set(1,S.fmt(vx,1)+" m/s"); ro.set(2,fmtT(Tu)); ro.set(3,fmtT(Tm));
      var tt=Math.min(1,tA/6), x0=40, x1=c.W-30, seg=(x1-x0)/10;
      function prog(T){ return Math.min(1,tt*Tmax/T); }
      [[70,"Amyélinique (v = "+S.fmt(vu,2)+" m/s)",P.amber,prog(Tu),false],[170,"Myélinisée (v = "+S.fmt(vx,1)+" m/s)",P.acc,prog(Tm),true]].forEach(function(o){
        var y=o[0]; S.draw.text(c,o[1],x0,y-36,{size:12,color:o[2],align:"left"});
        S.draw.line(c,x0,y,x1,y,"#c8d1de",o[4]?3:10);
        if(o[4]){ for(var i=0;i<10;i++){ ctx.fillStyle="rgba(46,107,85,"+(0.08+0.55*(1-dm.value/100))+")"; ctx.fillRect(x0+i*seg+10,y-11,seg-20,22); S.draw.dot(c,x0+i*seg+5,y,3,P.red); } S.draw.dot(c,x1,y,3,P.red); }
        var px=o[4]?x0+Math.round(o[3]*10)*seg:x0+o[3]*(x1-x0);
        S.draw.dot(c,px,y,9,o[2]); ctx.save(); ctx.strokeStyle=o[2]; ctx.globalAlpha=0.3; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(px,y,15,0,7); ctx.stroke(); ctx.restore();
      });
      S.draw.text(c,"Vert : myéline · rouge : nœuds de Ranvier · animation : 6 s pour la fibre la plus lente",c.W/2,c.H-12,{size:10,color:P.grey});
    });
    k.note("Lois empiriques approchées (v amyélinique ≈ 1,1·√d ; v myélinisée ≈ 6·d, d = diamètre total) ; l'interpolation linéaire selon le taux de démyélinisation est un modèle qualitatif. Le dessin est schématique : seul le calcul des vitesses est quantitatif.","warn");
  }
});

SFA.sim({
  id:"ub-c04-cascade-amplification", ch:"c04", tag:"Transduction",
  titre:"Cascade AMPc : amplification et durée du signal",
  resume:"Un ligand active des centaines de milliers de molécules ; la phosphodiestérase éteint le signal ; caféine et toxine cholérique le modifient.",
  but:"Règle l'amplification de chaque étage, l'intensité du signal, et teste la caféine (inhibe la PDE) ou la toxine cholérique (Gs bloquée active).",
  aRetenir:"Chaque étage d'une cascade multiplie le signal : 1 ligand × n₁ protéines G × n₂ AMPc × n₃ substrats phosphorylés. L'AMPc est dégradé par la phosphodiestérase : [AMPc] suit d[AMPc]/dt = production − k·[AMPc] ; sa demi-vie est ln 2 / k. La caféine ralentit cette dégradation et prolonge le signal ; la toxine cholérique empêche l'arrêt de Gs : production d'AMPc permanente.",
  piege:"Amplifier ne veut pas dire « plus de ligand » : un faible nombre de récepteurs activés peut produire une réponse énorme. Inversement, un signal qui ne s'éteint pas est pathologique (choléra).",
  build:function(k,S){
    var P=S.draw.palette, c1=k.canvas(170), c2=k.canvas(210);
    var n0=k.slider("Molécules de ligand liées",1,1000,1,10,"");
    var n1=k.slider("n₁ : protéines G activées par récepteur",1,100,1,10,"");
    var n2=k.slider("n₂ : AMPc produites par protéine G active",1,500,1,50,"");
    var n3=k.slider("n₃ : substrats phosphorylés par molécule d'AMPc",1,200,1,20,"");
    var du=k.slider("Durée du signal",5,40,1,20,"s");
    var dr=k.seg("Condition",[["none","Normal"],["caf","Caféine"],["cho","Toxine cholérique"]],"none");
    var ro=k.readouts(["Amplification totale","[AMPc] maximale","Demi-vie de l'AMPc"]);
    function sci2(x){ if(x<10000) return S.fmt(x,0); var e=Math.floor(Math.log10(x)), m=x/Math.pow(10,e); return S.fmt(m,1)+"·10"+String(e).split("").map(function(ch){return "⁰¹²³⁴⁵⁶⁷⁸⁹".charAt(+ch);}).join(""); }
    k.draw(function(){
      var ctx;
      c1.clear(); ctx=c1.ctx;
      var st=[["Ligand",n0.value],["Prot. G",n0.value*n1.value],["AMPc",n0.value*n1.value*n2.value],["Substrats phosph.",n0.value*n1.value*n2.value*n3.value]];
      var lo=0, hi=Math.max(7,Math.ceil(Math.log10(st[3][1]))), bw=(c1.W-60)/4;
      st.forEach(function(s,i){ var h=(Math.log10(s[1])+0.1)/(hi+0.1)*(c1.H-60); ctx.fillStyle=[P.violet,P.acc,P.teal,P.green][i]; ctx.fillRect(40+i*bw,c1.H-30-h,bw-14,h); S.draw.text(c1,sci2(s[1]),40+i*bw+(bw-14)/2,c1.H-30-h-9,{size:11,color:P.ink}); S.draw.text(c1,s[0],40+i*bw+(bw-14)/2,c1.H-14,{size:10,color:P.grey}); });
      S.draw.text(c1,"Nombre de molécules (échelle logarithmique)",c1.W/2,12,{size:11,color:P.ink});
      /* cinétique */
      c2.clear();
      var s0=0.3+0.1*Math.log10(n0.value*n1.value*n2.value), kk=dr.value==="caf"?0.1:0.2, T=du.value;
      var sf=function(t){ return t<T? s0 : (dr.value==="cho"? 0.3*s0 : 0); };
      var a=0.05, x=0.05, pts=[[0,x]], mx=x;
      for(var t=0;t<100;t+=0.1){ x+=0.1*(sf(t)-kk*x)+0.1*kk*a; if(x>mx)mx=x; pts.push([t+0.1,x]); }
      var ax=S.draw.axes(c2,{x0:0,x1:100,y0:0,y1:Math.max(6,Math.ceil(mx*1.1)),stepX:10,xl:"temps (s)",yl:"[AMPc] (µmol/L)"});
      ctx=c2.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip(); ctx.strokeStyle=P.teal; ctx.lineWidth=2.6; ctx.beginPath();
      pts.forEach(function(p,i){ var xx=ax.X(p[0]),yy=ax.Y(p[1]); if(i===0)ctx.moveTo(xx,yy); else ctx.lineTo(xx,yy); }); ctx.stroke(); ctx.restore();
      ctx.fillStyle="rgba(180,83,9,.15)"; ctx.fillRect(ax.X(0),ax.T,ax.X(T)-ax.X(0),ax.B-ax.T);
      S.draw.text(c2,"signal (ligand lié)",ax.X(T/2),ax.B-10,{size:10,color:P.amber});
      ro.set(0,S.sci(st[3][1]/st[0][1],2)+" ×"); ro.set(1,S.fmt(mx,2)+" µmol/L"); ro.set(2,S.fmt(Math.LN2/kk,1)+" s");
    });
    k.note("Valeurs numériques pédagogiques (ordres de grandeur) : production d'AMPc croissante avec le signal (loi logarithmique arbitraire), dégradation k = 0,2 s⁻¹ (0,1 s⁻¹ avec caféine). La toxine cholérique est modélisée par une production maintenue à 30 % après la fin du signal.","warn");
  }
});

SFA.sim({
  id:"ub-c04-synapse-sommation", ch:"c04", tag:"Synapse · sommation",
  titre:"Sommation spatiale et temporelle de potentiels post-synaptiques",
  resume:"Des synapses excitatrices et inhibitrices s'additionnent ; le neurone décharge si le seuil est atteint.",
  but:"Choisis le nombre de synapses excitatrices et inhibitrices, leur fréquence et la constante de temps de la membrane : suis Vm et les potentiels d'action.",
  aRetenir:"Le neurone intègre : chaque PPSE (+) ou PPSI (−) décroît avec la constante de temps τ ; ils s'additionnent dans l'espace (plusieurs synapses simultanées) et dans le temps (arrivées rapprochées). Dépolarisation moyenne ≈ (Σ n·f·a)·τ. Seuil ≈ −55 mV depuis −70 mV (15 mV).",
  piege:"Un seul PPSE de 1 mV est loin d'un seuil de 15 mV : c'est la sommation qui compte. Une synapse inhibitrice ne « bloque » pas : elle soustrait.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(320);
    var ne=k.slider("Synapses excitatrices",0,30,1,24,"");
    var fe=k.slider("Fréquence de chaque synapse excitatrice",1,100,1,60,"Hz");
    var ae=k.slider("Amplitude d'un PPSE",0.2,3,0.1,1,"mV");
    var ni=k.slider("Synapses inhibitrices",0,15,1,0,"");
    var fi=k.slider("Fréquence de chaque synapse inhibitrice",1,100,1,40,"Hz");
    var tau=k.slider("Constante de temps τ",2,30,1,10,"ms");
    var ro=k.readouts(["Dépolarisation moyenne prévue","Potentiels d'action (200 ms)","Fréquence de décharge"]);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, rest=-70, th=-55, dt=0.1, T=200;
      var ev=[]; /* événements : [temps, amplitude] */
      for(var i=0;i<ne.value;i++){ var per=1000/fe.value, ph=((i*0.618034)%1)*per; for(var t=ph;t<T;t+=per) ev.push([t,ae.value]); }
      for(var j=0;j<ni.value;j++){ var per2=1000/fi.value, ph2=((j*0.381966+0.17)%1)*per2; for(var t2=ph2;t2<T;t2+=per2) ev.push([t2,-ae.value]); }
      ev.sort(function(a,b){return a[0]-b[0];});
      var V=rest, ei=0, ref=0, sp=[], tr=[];
      for(var s=0;s<=T/dt;s++){ var t=s*dt; V=rest+(V-rest)*Math.exp(-dt/tau.value);
        while(ei<ev.length&&ev[ei][0]<=t){ if(ref<=0) V+=ev[ei][1]; ei++; }
        ref-=dt; if(V>=th&&ref<=0){ sp.push(t); V=rest; ref=3; tr.push(0); } else tr.push(V); }
      var ax=S.draw.axes(c,{x0:0,x1:T,y0:-80,y1:10,stepX:25,stepY:10,xl:"temps (ms)",yl:"Vm (mV)"});
      S.draw.line(c,ax.L,ax.Y(th),ax.R,ax.Y(th),P.red,1.5,[6,4]); S.draw.text(c,"seuil −55 mV",ax.R-4,ax.Y(th)-8,{size:10,color:P.red,align:"right"});
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip(); ctx.strokeStyle=P.acc; ctx.lineWidth=1.8; ctx.beginPath();
      tr.forEach(function(v,i){ var x=ax.X(i*dt), y=ax.Y(v); if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke(); ctx.restore();
      sp.forEach(function(t){ S.draw.line(c,ax.X(t),ax.Y(th),ax.X(t),ax.Y(0),P.green,2.5); });
      var mean=(ne.value*fe.value*ae.value-ni.value*fi.value*ae.value)/1000*tau.value;
      ro.set(0,(mean>=0?"+":"")+S.fmt(mean,1).replace("−","−")+" mV"); ro.set(1,String(sp.length)); ro.set(2,S.fmt(sp.length/(T/1000),0)+" Hz");
    });
    k.note("Modèle d'intégrateur à fuite : Vm = −70 mV au repos, seuil −55 mV, retour à −70 mV après un potentiel d'action, réfractaire 3 ms. Trains réguliers déphasés ; les potentiels d'action (traits verts) sont symboliques.","warn");
  }
});

SFA.sim({
  id:"ub-c04-homeostasie-retroaction", ch:"c04", tag:"Homéostasie",
  titre:"Rétroaction négative et positive : gain et erreur résiduelle",
  resume:"Perturbation d'une variable réglée : plus le gain est grand, plus l'erreur est petite. Une rétroaction positive emballe le système.",
  but:"Choisis la variable (glycémie ou température), le type de rétroaction et le gain. Observe l'écart à la consigne au cours du temps.",
  aRetenir:"Rétroaction négative : x' = D − a(1 + G)·x. À l'équilibre, l'écart vaut D / [a(1 + G)] : l'erreur est réduite d'un facteur 1 + G par rapport à l'absence de régulation, et la correction est plus rapide (constante de temps 1/[a(1 + G)]). Il reste toujours un petit écart. Rétroaction positive : x' = D + a(G − 1)·x : si G ≥ 1, emballement (accouchement, coagulation, potentiel d'action).",
  piege:"« Homéostasie » ne veut pas dire valeur constante : il reste une erreur résiduelle, et la consigne elle-même peut changer (fièvre).",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(330);
    var sc=k.seg("Variable",[["gly","Glycémie (g/L)"],["tmp","Température (°C)"]],"gly");
    var md=k.seg("Rétroaction",[["neg","Négative"],["pos","Positive"]],"neg");
    var G=k.slider("Gain G (effecteurs / perturbation)",0,20,0.5,4,"");
    var tmp=k.toggle("Perturbation temporaire (s'arrête à t = 30)",false);
    var ro=k.readouts(["Écart final (ou pic)","Réduction de l'erreur","Constante de temps"]);
    var nt=k.note("","");
    k.draw(function(){
      c.clear(); var g=G.value, a=0.1, isG=sc.value==="gly", D=isG?0.06:0.4, set=isG?1.0:37, pos=md.value==="pos";
      var Gp=g; var x=0, pts=[], cap=10*D/a, runaway=false, mx=0;
      for(var t=0;t<=60;t+=0.1){ var d=(t>=5&&(!tmp.value||t<30))?D:0; var rate=pos? d+a*(Gp-1)*x : d-a*(1+g)*x; x+=0.1*rate; if(x>cap){ x=cap; runaway=true; } pts.push(x); if(Math.abs(x)>mx) mx=Math.abs(x); }
      var ymax=pos?cap*1.05:D/a*1.2, ax=S.draw.axes(c,{x0:0,x1:60,y0:-ymax*0.05,y1:ymax,xl:"temps (min)",yl:"écart à la consigne ("+(isG?"g/L":"°C")+")"});
      S.draw.line(c,ax.L,ax.Y(D/a),ax.R,ax.Y(D/a),P.grey,1.4,[5,4]); S.draw.text(c,"sans régulation : "+S.fmt(D/a,2),ax.R-4,ax.Y(D/a)-8,{size:10,color:P.grey,align:"right"});
      var ctx=c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip(); ctx.strokeStyle=pos?P.red:P.acc; ctx.lineWidth=2.6; ctx.beginPath();
      pts.forEach(function(p,i){ var xx=ax.X(i*0.1), yy=ax.Y(p); if(i===0)ctx.moveTo(xx,yy); else ctx.lineTo(xx,yy); }); ctx.stroke(); ctx.restore();
      S.draw.text(c,"consigne : "+S.fmt(set,1)+(isG?" g/L":" °C")+" (écart = 0)",ax.L+10,ax.B-12,{size:11,color:P.ink,align:"left"});
      var fin=pts[pts.length-1];
      if(!pos){ ro.set(0,S.fmt(D/(a*(1+g)),3)); ro.set(1,"÷ "+S.fmt(1+g,1)); ro.set(2,S.fmt(1/(a*(1+g)),1)+" min");
        nt.set("Valeur finale : "+S.fmt(set+D/(a*(1+g)),3)+(isG?" g/L":" °C")+" (sans régulation : "+S.fmt(set+D/a,2)+").","ok"); }
      else { ro.set(0,runaway?"emballement (plafonné)":S.fmt(D/(a*(1-Gp)),3)); ro.set(1,Gp<1?"× "+S.fmt(1/(1-Gp),2)+" (amplifié)":"aucune"); ro.set(2,Gp<1?S.fmt(1/(a*(1-Gp)),1)+" min":"exponentielle");
        nt.set(Gp>=1?"G ≥ 1 : la perturbation s'auto-amplifie jusqu'à ce qu'un événement externe l'arrête (ex. expulsion du fœtus). Courbe plafonnée à "+S.fmt(cap,1)+" pour l'affichage.":"G < 1 : la rétroaction positive amplifie l'écart sans emballement, ce qui reste un mauvais régulateur.","warn"); }
    });
    k.note("Modèle linéaire à une variable (perturbation constante, a = 0,1 min⁻¹). La glycémie et la température sont des illustrations de la même logique ; les vraies boucles font intervenir plusieurs hormones ou effecteurs.","warn");
  }
});
