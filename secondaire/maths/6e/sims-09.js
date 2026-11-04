/* Chapitre 9 : probabilités */
(function(){
function pct(S,x,d){ return S.fmt(x*100,d===undefined?1:d)+" %"; }

SFA.sim({
  id:"m6-c09-grands-nombres", ch:"c09", tag:"Classique",
  titre:"La fréquence se stabilise : loi des grands nombres",
  resume:"Répète une expérience 10, 100, 10 000 fois : la fréquence se rapproche de la probabilité.",
  but:"Choisis une expérience, puis lance-la de plus en plus de fois. La courbe montre la fréquence du succès après chaque lancer (échelle logarithmique en abscisse). La bande grise est l'enveloppe ±2·√(p(1−p)/n).",
  aRetenir:"La probabilité théorique d'un événement est la valeur vers laquelle la fréquence se stabilise quand le nombre d'essais augmente (loi des grands nombres). Les fluctuations diminuent comme 1/√n : pour avoir 10 fois plus de précision, il faut 100 fois plus d'essais.",
  piege:"La loi des grands nombres ne « compense » pas le passé : après 5 piles de suite, la probabilité de pile reste 1/2 (erreur du joueur). C'est la proportion qui se stabilise, pas l'écart absolu entre piles et faces.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.6});
    var EX={
      p:{n:"Pièce : obtenir pile",p:0.5,run:function(){return Math.random()<0.5;}},
      d:{n:"Un dé : obtenir 6",p:1/6,run:function(){return Math.floor(Math.random()*6)===5;}},
      u:{n:"Deux dés : au moins un 6",p:11/36,run:function(){return Math.floor(Math.random()*6)===5||Math.floor(Math.random()*6)===5;}},
      s:{n:"Deux dés : somme égale à 12",p:1/36,run:function(){return Math.floor(Math.random()*6)===5&&Math.floor(Math.random()*6)===5;}}
    };
    var sel=k.select("Expérience",[["p","Pièce : obtenir pile (p = 1/2)"],["d","Un dé : obtenir 6 (p = 1/6)"],["u","Deux dés : au moins un 6 (p = 11/36)"],["s","Deux dés : double six (p = 1/36)"]],"p",function(){ reset(); });
    var env=k.toggle("Montrer l'enveloppe ±2√(p(1−p)/n)",true);
    var n=0,hits=0,freq=[];
    function reset(){ n=0; hits=0; freq=[]; }
    function go(m){ var e=EX[sel.value]; for(var i=0;i<m&&n<20000;i++){ n++; if(e.run()) hits++; freq[n]=hits/n; } }
    k.button("+ 1",function(){go(1);},true); k.button("+ 10",function(){go(10);}); k.button("+ 100",function(){go(100);}); k.button("+ 1 000",function(){go(1000);}); k.button("+ 10 000",function(){go(10000);}); k.button("Remise à zéro",reset);
    var ro=k.readouts(["Essais n","Succès","Fréquence observée","Probabilité théorique"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, e=EX[sel.value], W=c.W,H=c.H,L=46,R=14,T=14,B=34;
      var emax=Math.max(2,Math.ceil(Math.log10(Math.max(100,n)))), X=function(m){ return L+Math.log10(m)/emax*(W-L-R); };
      var ymax=Math.min(1,Math.max(2.2*e.p,0.3)); if(sel.value==="p") ymax=1;
      var Y=function(y){ return H-B-y/ymax*(H-T-B); };
      ctx.save(); ctx.font="600 11px Mulish, sans-serif"; ctx.fillStyle="#5f6b7a"; ctx.strokeStyle="#edf0f4"; ctx.textAlign="center"; ctx.textBaseline="top";
      for(var q=0;q<=emax;q++){ ctx.beginPath(); ctx.moveTo(X(Math.pow(10,q)),T); ctx.lineTo(X(Math.pow(10,q)),H-B); ctx.stroke(); ctx.fillText(S.fmt(Math.pow(10,q),0),X(Math.pow(10,q)),H-B+4); }
      ctx.textAlign="right"; ctx.textBaseline="middle"; for(var yy=0;yy<=ymax+1e-9;yy+=ymax/4){ ctx.beginPath(); ctx.moveTo(L,Y(yy)); ctx.lineTo(W-R,Y(yy)); ctx.stroke(); ctx.fillText(S.fmt(yy,2),L-5,Y(yy)); }
      ctx.strokeStyle="#8a95a3"; ctx.beginPath(); ctx.moveTo(L,T); ctx.lineTo(L,H-B); ctx.lineTo(W-R,H-B); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(L,T,W-L-R,H-T-B); ctx.clip();
      if(env.value){ ctx.fillStyle="rgba(138,149,163,.2)"; ctx.beginPath(); for(var m=1;m<=Math.pow(10,emax);m*=1.12){ var d=2*Math.sqrt(e.p*(1-e.p)/m); if(m===1) ctx.moveTo(X(m),Y(e.p+d)); else ctx.lineTo(X(m),Y(e.p+d)); } for(m=Math.pow(10,emax);m>=1;m/=1.12){ d=2*Math.sqrt(e.p*(1-e.p)/m); ctx.lineTo(X(m),Y(e.p-d)); } ctx.closePath(); ctx.fill(); }
      ctx.strokeStyle=P.red; ctx.lineWidth=2; ctx.setLineDash([6,4]); ctx.beginPath(); ctx.moveTo(L,Y(e.p)); ctx.lineTo(W-R,Y(e.p)); ctx.stroke(); ctx.setLineDash([]);
      if(n>0){ ctx.strokeStyle=P.acc; ctx.lineWidth=2.2; ctx.beginPath(); var step=Math.max(1,Math.floor(n/800)); for(var i=1;i<=n;i+=step){ if(i===1) ctx.moveTo(X(i),Y(freq[i])); else ctx.lineTo(X(i),Y(freq[i])); } ctx.lineTo(X(n),Y(freq[n])); ctx.stroke(); }
      ctx.restore();
      S.draw.text(c,"nombre d'essais n (échelle logarithmique)",W-R,H-6,{size:11,align:"right",color:P.grey}); S.draw.text(c,"p = "+S.fmt(e.p,3),L+8,Y(e.p)-10,{size:12,align:"left",color:P.red});
      ro.set(0,String(n)); ro.set(1,String(hits)); ro.set(2,n?S.fmt(hits/n,4):"—"); ro.set(3,S.fmt(e.p,4));
      nt.set(n===0?"Lance l'expérience pour commencer.":(n<30?"Avec si peu d'essais, la fréquence bouge beaucoup : écart = "+S.fmt(Math.abs(hits/n-e.p),3)+".":"Après "+n+" essais, l'écart entre fréquence et probabilité est "+S.fmt(Math.abs(hits/n-e.p),4)+"."),"ok");
    });
  }
});

SFA.sim({
  id:"m6-c09-arbre", ch:"c09", tag:"Classique",
  titre:"Arbre pondéré : probabilités composées et conditionnelles",
  resume:"Règle P(A), P(B | A) et P(B | non A) : lis P(A ∩ B), P(B) et P(A | B).",
  but:"Règle les trois probabilités de l'arbre. Les branches qui mènent à B sont en gras. Essaie de rendre A et B indépendants.",
  aRetenir:"Sur un arbre, on <i>multiplie</i> le long d'un chemin : P(A ∩ B) = P(A)·P(B | A). On <i>additionne</i> les chemins qui mènent à B (probabilités totales) : P(B) = P(A)·P(B | A) + P(Ā)·P(B | Ā). Alors P(A | B) = P(A ∩ B) / P(B) (formule de Bayes). A et B sont indépendants si P(B | A) = P(B).",
  piege:"P(A | B) et P(B | A) sont deux nombres différents. Et « indépendants » n'est pas « incompatibles » : des événements incompatibles (A ∩ B = ∅) de probabilité non nulle sont au contraire très dépendants.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7});
    var pa=k.slider("P(A)",0,1,0.05,0.3,"",null), pba=k.slider("P(B | A)",0,1,0.05,0.8,"",null), pbn=k.slider("P(B | non A)",0,1,0.05,0.2,"",null);
    var ro=k.readouts(["P(A ∩ B)","P(B)","P(A | B)","P(B | A)"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, W=c.W,H=c.H, A=pa.value, BA=pba.value, BN=pbn.value;
      var x0=40, x1=W*0.42, x2=W-130, yA=H*0.28, yN=H*0.72, ys=[H*0.15,H*0.4,H*0.6,H*0.85];
      var f=function(x){return S.fmt(x,2);};
      function edge(xa,ya,xb,yb,txt,bold,col){ ctx.save(); ctx.strokeStyle=col||"#8a95a3"; ctx.lineWidth=bold?3.6:1.4; ctx.beginPath(); ctx.moveTo(xa,ya); ctx.lineTo(xb,yb); ctx.stroke(); ctx.restore(); S.draw.text(c,txt,(xa+xb)/2,(ya+yb)/2-12,{size:12,color:col||P.ink,bg:"#ffffffdd"}); }
      edge(x0,H/2,x1,yA,f(A),false,P.acc); edge(x0,H/2,x1,yN,f(1-A),false,P.acc);
      edge(x1,yA,x2,ys[0],f(BA),true,P.red); edge(x1,yA,x2,ys[1],f(1-BA),false,P.grey);
      edge(x1,yN,x2,ys[2],f(BN),true,P.red); edge(x1,yN,x2,ys[3],f(1-BN),false,P.grey);
      S.draw.dot(c,x0,H/2,6,P.ink); S.draw.dot(c,x1,yA,6,P.acc); S.draw.dot(c,x1,yN,6,P.acc);
      S.draw.text(c,"A",x1-4,yA-16,{color:P.acc}); S.draw.text(c,"non A",x1-4,yN+16,{color:P.acc});
      var lab=[["A ∩ B",A*BA],["A ∩ non B",A*(1-BA)],["non A ∩ B",(1-A)*BN],["non A ∩ non B",(1-A)*(1-BN)]];
      lab.forEach(function(l,i){ S.draw.dot(c,x2,ys[i],5,i===0||i===2?P.red:P.grey); S.draw.text(c,l[0]+" : "+S.fmt(l[1],3),x2+9,ys[i],{size:12,align:"left",color:(i===0||i===2)?P.red:P.ink}); });
      var pB=A*BA+(1-A)*BN, pAB=A*BA;
      ro.set(0,S.fmt(pAB,3)); ro.set(1,S.fmt(pB,3)); ro.set(2,pB>0?S.fmt(pAB/pB,3):"non défini"); ro.set(3,S.fmt(BA,3));
      if(A===0||A===1) nt.set("P(A) vaut 0 ou 1 : A est certain ou impossible, la notion de dépendance n'a plus d'intérêt.","warn");
      else if(Math.abs(BA-BN)<1e-9) nt.set("P(B | A) = P(B | non A) = "+S.fmt(BA,2)+" : B ne dépend pas de A, les événements sont <b>indépendants</b>, et P(A ∩ B) = P(A)·P(B) = "+S.fmt(A*pB,3)+".","ok");
      else nt.set("P(B | A) ≠ P(B | non A) : A et B sont dépendants. Vérifie : P(A)·P(B) = "+S.fmt(A*pB,3)+" ≠ P(A ∩ B) = "+S.fmt(pAB,3)+".","warn");
    });
  }
});

SFA.sim({
  id:"m6-c09-test-medical", ch:"c09", tag:"Bayes · Niche utile",
  titre:"Test positif : suis-je vraiment malade ?",
  resume:"Prévalence, sensibilité, spécificité : la probabilité d'être malade après un test positif peut être faible.",
  but:"Chaque point est une personne parmi 1 000. Règle la prévalence de la maladie, la sensibilité et la spécificité du test. Compare, parmi les positifs, les vrais malades (rouge) et les faux positifs (bleu).",
  aRetenir:"P(malade | test +) = P(M ∩ +) / P(+) = prév·sens / (prév·sens + (1 − prév)·(1 − spéc)). Quand la maladie est rare, les faux positifs (très nombreux sains × petit taux d'erreur) peuvent être plus nombreux que les vrais positifs : un test fiable à 95 % ne signifie pas « 95 % de chances d'être malade ».",
  piege:"La sensibilité P(+ | malade) n'est pas la valeur prédictive P(malade | +). C'est la confusion entre P(A | B) et P(B | A). Les valeurs choisies ici sont des exemples, pas des données d'un vrai test.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.6});
    var prev=k.slider("Prévalence (part de malades)",0.1,30,0.1,1,"%",null), se=k.slider("Sensibilité P(+ | malade)",50,100,1,95,"%",null), sp=k.slider("Spécificité P(− | sain)",50,100,1,95,"%",null);
    var ro=k.readouts(["P(malade | test +)","Vrais positifs / 10 000","Faux positifs / 10 000","P(sain | test −)"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, pr=prev.value/100, s1=se.value/100, s2=sp.value/100;
      var TP=pr*s1, FN=pr*(1-s1), FP=(1-pr)*(1-s2), TN=(1-pr)*s2, pos=TP+FP, neg=FN+TN;
      var N=1000, cols=50, rows=20, W=c.W, H=c.H, cell=Math.min((W-20)/cols,(H-90)/rows), ox=(W-cols*cell)/2, oy=16;
      var nTP=Math.round(TP*N), nFN=Math.round(FN*N), nFP=Math.round(FP*N), nTN=N-nTP-nFN-nFP;
      var seq=[[nTP,"#b42318"],[nFN,"#e8a29a"],[nFP,"#1e3f8f"],[nTN,"#dfe4ec"]], idx=0, ctx=c.ctx;
      seq.forEach(function(sg){ for(var i=0;i<sg[0];i++){ var r=Math.floor(idx/cols), q=idx%cols; ctx.fillStyle=sg[1]; ctx.beginPath(); ctx.arc(ox+q*cell+cell/2,oy+r*cell+cell/2,cell*0.38,0,2*Math.PI); ctx.fill(); idx++; } });
      var ly=oy+rows*cell+16;
      [["Vrais positifs ("+nTP+")","#b42318"],["Faux négatifs ("+nFN+")","#e8a29a"],["Faux positifs ("+nFP+")","#1e3f8f"],["Vrais négatifs ("+nTN+")","#9aa5b5"]].forEach(function(l,i){ var x=10+(i%2)*(W/2), y=ly+Math.floor(i/2)*20; ctx.fillStyle=l[1]; ctx.beginPath(); ctx.arc(x+6,y,6,0,2*Math.PI); ctx.fill(); S.draw.text(c,l[0],x+18,y,{size:12,align:"left"}); });
      ro.set(0,pct(S,TP/pos,1)); ro.set(1,String(Math.round(TP*10000)));
      ro.set(2,String(Math.round(FP*10000))); ro.set(3,pct(S,TN/neg,2));
      nt.set("Parmi 10 000 personnes, "+Math.round(pos*10000)+" sont positives dont seulement "+Math.round(TP*10000)+" malades : "+pct(S,TP/pos,1)+" des positifs sont vraiment malades.", TP/pos<0.5?"warn":"ok");
    });
  }
});

SFA.sim({
  id:"m6-c09-monty-hall", ch:"c09", tag:"Paradoxe",
  titre:"Monty Hall : faut-il changer de porte ?",
  resume:"Joue plusieurs parties, puis simule 1 000 parties : changer double les chances de gagner.",
  but:"Derrière une porte : une voiture ; derrière les deux autres : des chèvres. Choisis une porte, l'animateur en ouvre une avec une chèvre, puis tu gardes ou tu changes. Ensuite lance une simulation de 1 000 parties.",
  aRetenir:"Au départ, ta porte a 1 chance sur 3 d'être la bonne et les deux autres ensemble 2 chances sur 3. L'animateur sait où est la voiture et ouvre toujours une chèvre : ces 2/3 se concentrent sur la porte restante. Garder gagne dans 1/3 des cas, changer dans 2/3 des cas.",
  piege:"Ce n'est pas du 50/50 : les deux portes restantes ne sont pas équiprobables, parce que l'animateur n'ouvre pas une porte au hasard. L'information qu'il donne n'est pas symétrique.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.5});
    var st={phase:0,car:0,pick:-1,open:-1,final:-1}, rec={sw:[0,0],kp:[0,0]};
    function newGame(){ st={phase:0,car:Math.floor(Math.random()*3),pick:-1,open:-1,final:-1}; }
    newGame();
    function choose(i){ if(st.phase!==0) return; st.pick=i; var opts=[0,1,2].filter(function(j){return j!==i&&j!==st.car;}); st.open=opts[Math.floor(Math.random()*opts.length)]; st.phase=1; }
    function decide(sw){ if(st.phase!==1) return; var other=[0,1,2].filter(function(j){return j!==st.pick&&j!==st.open;})[0]; st.final=sw?other:st.pick; st.phase=2; var win=st.final===st.car; if(sw){ rec.sw[1]++; if(win) rec.sw[0]++; } else { rec.kp[1]++; if(win) rec.kp[0]++; } }
    k.button("Porte 1",function(){choose(0);}); k.button("Porte 2",function(){choose(1);}); k.button("Porte 3",function(){choose(2);});
    k.button("Garder ma porte",function(){decide(false);}); k.button("Changer de porte",function(){decide(true);}); k.button("Nouvelle partie",function(){newGame();},true);
    k.button("Simuler 1 000 parties",function(){ for(var g=0;g<1000;g++){ var car=Math.floor(Math.random()*3), pick=Math.floor(Math.random()*3); rec.kp[1]++; if(pick===car) rec.kp[0]++; rec.sw[1]++; if(pick!==car) rec.sw[0]++; } });
    k.button("Remettre les scores à zéro",function(){ rec={sw:[0,0],kp:[0,0]}; });
    var ro=k.readouts(["Parties « garder »","Victoires « garder »","Parties « changer »","Victoires « changer »"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, W=c.W,H=c.H, dw=Math.min(120,(W-40)/3.4), gap=(W-3*dw)/4;
      for(var i=0;i<3;i++){ var x=gap+i*(dw+gap), y=20, h=H-70, open=(st.open===i)||(st.phase===2);
        ctx.fillStyle=open?"#e9edf4":"#1e3f8f"; ctx.fillRect(x,y,dw,h); ctx.strokeStyle="#13233a"; ctx.lineWidth=st.pick===i?5:2; ctx.strokeRect(x,y,dw,h);
        if(open){ var isCar=(st.car===i); S.draw.text(c,isCar?"voiture":"chèvre",x+dw/2,y+h/2,{size:16,color:isCar?P.green:P.red}); }
        else S.draw.text(c,String(i+1),x+dw/2,y+h/2,{size:34,color:"#ffffff"});
        if(st.final===i&&st.phase===2) S.draw.text(c,"choix final",x+dw/2,y+h+16,{size:12,color:P.amber});
        else if(st.pick===i) S.draw.text(c,"ton choix",x+dw/2,y+h+16,{size:12,color:P.amber});
      }
      ro.set(0,String(rec.kp[1])); ro.set(1,rec.kp[1]?rec.kp[0]+" ("+pct(S,rec.kp[0]/rec.kp[1],0)+")":"—"); ro.set(2,String(rec.sw[1])); ro.set(3,rec.sw[1]?rec.sw[0]+" ("+pct(S,rec.sw[0]/rec.sw[1],0)+")":"—");
      if(st.phase===0) nt.set("Étape 1 : choisis une porte (boutons Porte 1, 2, 3).","ok");
      else if(st.phase===1) nt.set("L'animateur a ouvert la porte "+(st.open+1)+" (chèvre). Garder ou changer ?","ok");
      else nt.set(st.final===st.car?"Gagné ! La voiture était derrière la porte "+(st.car+1)+".":"Perdu : la voiture était derrière la porte "+(st.car+1)+".","ok");
    });
  }
});
})();
