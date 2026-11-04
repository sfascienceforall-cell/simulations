/* Chapitre 5 · Circuits en série et en dérivation */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function glow(c,x,y,r,b){ if(b<=0.02) return; var g=c.ctx, R=r*(1.3+Math.min(b,1.6)), gr=g.createRadialGradient(x,y,r*0.3,x,y,R); gr.addColorStop(0,"rgba(255,206,60,"+Math.min(0.9,0.25+0.55*b)+")"); gr.addColorStop(1,"rgba(255,206,60,0)"); g.fillStyle=gr; g.beginPath(); g.arc(x,y,R,0,6.2832); g.fill(); }
function lamp(c,x,y,r,b,lab,off){ glow(c,x,y,r,b); circ(c,x,y,r,off?"#e9ecf0":b>0.02?"rgba(255,236,150,"+Math.min(1,0.4+0.6*b)+")":"#f4f6f9",off?P.grey:P.ink,2); var g=c.ctx; g.save(); g.strokeStyle=off?P.grey:P.ink; g.lineWidth=1.5; g.beginPath(); g.moveTo(x-r*0.7,y-r*0.7); g.lineTo(x+r*0.7,y+r*0.7); g.moveTo(x+r*0.7,y-r*0.7); g.lineTo(x-r*0.7,y+r*0.7); g.stroke(); g.restore(); if(lab) T(c,lab,x,y-r-9,{size:12,color:P.grey}); }
function pile(c,x,y){ var g=c.ctx; g.save(); g.translate(x,y); g.rotate(-Math.PI/2); rect(c,-12,-18,24,36,"#fff"); g.strokeStyle="#3a4a60"; g.lineWidth=2.5; g.beginPath(); g.moveTo(6,-14); g.lineTo(6,14); g.stroke(); g.lineWidth=5; g.beginPath(); g.moveTo(-6,-8); g.lineTo(-6,8); g.stroke(); g.restore(); }
function ln(c,a,b,col,w){ D.line(c,a[0],a[1],b[0],b[1],col||"#3a4a60",w||3); }
var RL=10, E=6, PN=3.6;                      /* lampes identiques : 10 Ω, 6 V, 3,6 W nominales */
function bri(I){ return Math.min(1.3, I*I*RL/PN); }

/* 1 · Série vs dérivation */
SFA.sim({
  id:"p3-c05-serie-derivation", ch:"c05", tag:"Classique",
  titre:"Série ou dérivation : ajoute des lampes",
  resume:"Ajoute des lampes identiques et compare l'éclat, la tension et l'intensité dans les deux montages.",
  but:"Choisis le montage, ajoute des lampes et observe la luminosité, la tension aux bornes de chaque lampe et les intensités.",
  aRetenir:"En série : même intensité partout, les tensions se partagent (U = U₁ + U₂ + …) : plus on ajoute de lampes, moins chacune brille. En dérivation : même tension aux bornes de chaque branche, les intensités s'additionnent (I = I₁ + I₂ + …) : chaque lampe brille comme si elle était seule, mais la pile débite davantage.",
  piege:"En dérivation, la tension n'est pas divisée : chaque lampe reçoit toute la tension de la pile. Et l'intensité ne se partage « moitié-moitié » que si les branches sont identiques. (Pile idéale de 6 V ; lampes de 10 Ω.)",
  build:function(k,S){
    var c = k.canvas(330);
    var n = k.slider("Nombre de lampes", 1, 5, 1, 2, "");
    var mt = k.seg("Montage", [["s","En série"],["p","En dérivation"]], "s");
    var ro = k.readouts(["Intensité dans la pile","Tension par lampe","Intensité par lampe","Éclat de chaque lampe"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, N=n.value, ser=mt.value==="s";
      var I = ser ? E/(RL*N) : N*E/RL, Il = ser ? I : E/RL, Ul = ser ? E/N : E, b = bri(Il);
      var x0=W*0.12,x1=W*0.9,y0=70,y1=H-60, cy=(y0+y1)/2;
      ln(c,[x0,y0],[x0,y1]); pile(c,x0,cy); T(c,"6 V",x0+28,cy,{size:12,color:P.grey,align:"left"});
      if (ser){
        ln(c,[x0,y0],[x1,y0]); ln(c,[x1,y0],[x1,y1]); ln(c,[x1,y1],[x0,y1]);
        for (var i=0;i<N;i++){ var lx=x0+(x1-x0)*(i+1)/(N+1); rect(c,lx-18,y0-18,36,36,"#fff"); lamp(c,lx,y0,15,b,"",false); }
        T(c,"mêmes intensités : I",(x0+x1)/2,y1+20,{size:12,color:P.grey});
      } else {
        ln(c,[x0,y0],[x1,y0]); ln(c,[x0,y1],[x1,y1]);
        for (i=0;i<N;i++){ var bx=x0+(x1-x0)*(i+1)/(N+1)+ (N===1?0:0); ln(c,[bx,y0],[bx,y1]); rect(c,bx-18,cy-18,36,36,"#fff"); lamp(c,bx,cy,15,b,"",false); }
        T(c,"même tension U sur chaque branche",(x0+x1)/2,y1+20,{size:12,color:P.grey});
      }
      ro.set(0,F(I,2)+" A"); ro.set(1,F(Ul,2)+" V"); ro.set(2,F(Il,2)+" A"); ro.set(3,F(Math.min(1,b)*100,0)+" %");
      nt.set(ser?"En série avec "+N+" lampe"+(N>1?"s":"")+" : chacune reçoit "+F(E,0)+" / "+N+" = "+F(Ul,2)+" V. Éclat relatif : (U/6)² = "+F(b*100,0)+" %.":"En dérivation : chaque lampe reçoit les 6 V, donc brille à 100 %, mais la pile fournit "+N+" × 0,6 = "+F(I,1)+" A.","ok");
    });
  }
});

/* 2 · Dévisser une lampe */
SFA.sim({
  id:"p3-c05-devisser", ch:"c05", tag:"Interactif",
  titre:"Dévisser une lampe : les autres s'éteignent-elles ?",
  resume:"Clique sur une lampe pour la dévisser, en série puis en dérivation.",
  but:"Clique sur une lampe (ou coche la case) pour la dévisser ou la revisser. Compare les deux montages.",
  aRetenir:"En série, une lampe dévissée coupe toute la boucle : tout s'éteint. En dérivation, chaque branche est indépendante : les autres lampes continuent de briller (c'est le montage des prises et des lampes d'une maison).",
  piege:"En dérivation, quand on dévisse une lampe, les autres ne brillent ni plus ni moins : leur tension est inchangée. Seule l'intensité débitée par la pile diminue.",
  build:function(k,S){
    var c = k.canvas(300);
    var mt = k.seg("Montage", [["s","En série"],["p","En dérivation"]], "s");
    var st=[false,false,false], tg=[];
    for (var i=0;i<3;i++) (function(i){ tg[i]=k.toggle("Lampe "+(i+1)+" dévissée", false, function(v){ st[i]=v; }); })(i);
    var ro = k.readouts(["Intensité dans la pile","Lampes allumées"]);
    var nt = k.note("","");
    var pos=[];
    c.pointer(function(t,p){ if(t!=="down") return; pos.forEach(function(q,i){ if(Math.hypot(p.x-q[0],p.y-q[1])<28){ st[i]=!st[i]; tg[i].set(st[i]); k.redraw(); } }); });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, ser=mt.value==="s";
      var x0=W*0.12,x1=W*0.9,y0=64,y1=H-50,cy=(y0+y1)/2;
      var nOn=st.filter(function(s){return !s;}).length;
      var I, Il=[0,0,0];
      if (ser){ I = nOn===3 ? E/(3*RL) : 0; Il=[I,I,I]; }
      else { I = nOn*E/RL; Il=st.map(function(s){return s?0:E/RL;}); }
      ln(c,[x0,y0],[x0,y1]); pile(c,x0,cy);
      pos=[];
      if (ser){
        ln(c,[x0,y0],[x1,y0]); ln(c,[x1,y0],[x1,y1]); ln(c,[x1,y1],[x0,y1]);
        for (var i=0;i<3;i++){ var lx=x0+(x1-x0)*(i+1)/4; pos.push([lx,y0]); rect(c,lx-20,y0-20,40,40,"#fff"); lamp(c,lx,y0,15,st[i]?0:bri(Il[i]),"L"+(i+1),st[i]); if(st[i]) T(c,"dévissée",lx,y0+30,{size:12,color:P.red}); }
      } else {
        ln(c,[x0,y0],[x1,y0]); ln(c,[x0,y1],[x1,y1]);
        for (i=0;i<3;i++){ var bx=x0+(x1-x0)*(i+1)/4; ln(c,[bx,y0],[bx,y1],st[i]?"#c9d1dc":"#3a4a60"); pos.push([bx,cy]); rect(c,bx-20,cy-20,40,40,"#fff"); lamp(c,bx,cy,15,st[i]?0:bri(Il[i]),"L"+(i+1),st[i]); if(st[i]) T(c,"dévissée",bx,cy+32,{size:12,color:P.red}); }
      }
      ro.set(0,F(I,2)+" A"); ro.set(1,(ser?(I>0?3:0):nOn)+" sur 3");
      nt.set(ser?(nOn<3?"<b>Boucle coupée</b> : plus aucun courant, toutes les lampes sont éteintes.":"Les 3 lampes en série : chacune reçoit 2 V, elles brillent peu ("+F(bri(E/(3*RL))*100,0)+" %)."):(nOn===3?"Les 3 branches fonctionnent, chacune reçoit 6 V : I = 3 × 0,6 = 1,8 A.":"Les branches restantes ne sont pas affectées : elles brillent toujours à 100 %. Le courant total tombe à "+F(I,1)+" A."),"ok");
    });
  }
});

/* 3 · Résistance équivalente */
SFA.sim({
  id:"p3-c05-equivalente", ch:"c05", tag:"Graphique",
  titre:"Résistance équivalente de deux résistances",
  resume:"Combine R₁ et R₂ en série ou en dérivation et lis la résistance équivalente sur le graphique.",
  but:"Règle R₁ et R₂, choisis le montage. Observe la résistance équivalente et sa courbe en fonction de R₂.",
  aRetenir:"En série : R = R₁ + R₂ (toujours plus grande que chacune). En dérivation : 1/R = 1/R₁ + 1/R₂, soit R = R₁R₂ / (R₁ + R₂) : toujours plus petite que la plus petite des deux.",
  piege:"En dérivation, la résistance équivalente diminue quand on ajoute une branche, même si cette branche a une très grande résistance : on ajoute un chemin de plus pour le courant.",
  build:function(k,S){
    var c = k.canvas(340);
    var r1 = k.slider("R₁", 1, 100, 1, 30, "Ω");
    var r2 = k.slider("R₂", 1, 100, 1, 60, "Ω");
    var mt = k.seg("Montage", [["s","En série"],["p","En dérivation"]], "p");
    var ro = k.readouts(["Résistance équivalente","Intensité sous 12 V","Plus petite des deux"]);
    var nt = k.note("","");
    function req(a,b,ser){ return ser?a+b:a*b/(a+b); }
    k.draw(function(){
      c.clear();
      var ser=mt.value==="s", a=r1.value, b=r2.value;
      var ax=D.axes(c,{x0:0,x1:100,y0:0,y1:200,xl:"R₂ (Ω)",yl:"R équivalente (Ω)",stepX:20,stepY:40,l:50,b:34});
      D.fn(c,ax,function(x){ return req(a,x,true); },P.acc,2.2); D.fn(c,ax,function(x){ return req(a,x,false); },P.red,2.2);
      D.line(c,ax.X(0),ax.Y(a),ax.X(100),ax.Y(a),P.grey,1.2,[5,4]); T(c,"R₁ = "+F(a,0)+" Ω",ax.X(98),ax.Y(a)-9,{size:12,color:P.grey,align:"right"});
      T(c,"série",ax.X(70),ax.Y(a+70)-10,{size:12,color:P.acc}); T(c,"dérivation",ax.X(72),ax.Y(req(a,72,false))+16,{size:12,color:P.red});
      var r=req(a,b,ser); circ(c,ax.X(b),ax.Y(r),7,"#fff",ser?P.acc:P.red,3);
      ro.set(0,F(r,1)+" Ω"); ro.set(1,F(12/r,2)+" A"); ro.set(2,F(Math.min(a,b),0)+" Ω");
      nt.set(ser?"Série : "+F(a,0)+" + "+F(b,0)+" = <b>"+F(r,1)+" Ω</b>, plus grande que chacune.":"Dérivation : "+F(a,0)+" × "+F(b,0)+" / ("+F(a,0)+" + "+F(b,0)+") = <b>"+F(r,1)+" Ω</b>, plus petite que "+F(Math.min(a,b),0)+" Ω. Si R₁ = R₂, on obtient la moitié.","ok");
    });
  }
});

/* 4 · Chasse à la panne */
var ELEM=["Lampe 1","Interrupteur","Lampe 2","Fil de liaison","Lampe 3"];
SFA.sim({
  id:"p3-c05-panne", ch:"c05", tag:"Jeu d'enquête",
  titre:"Chasse à la panne : trouve la coupure en peu de mesures",
  resume:"Un circuit en série ne marche pas : un élément est coupé. Localise-le avec un voltmètre.",
  but:"Un élément du circuit est coupé. Place le voltmètre entre deux points et note le résultat. Trouve la panne avec le moins de mesures possible, puis donne ton diagnostic.",
  aRetenir:"Dans une boucle en série interrompue, la tension de la pile apparaît entièrement aux bornes de la coupure et nulle part ailleurs (les éléments sains n'ont pas de courant, donc pas de tension). Un voltmètre qui affiche 6 V entoure donc la panne : on coupe le circuit en deux (recherche par dichotomie).",
  piege:"Un élément sain en circuit coupé affiche 0 V : ce n'est pas lui qui est en cause. Ne conclus pas sur la lampe qui ne brille pas : aucune lampe ne brille quand la boucle est coupée.",
  build:function(k,S){
    var c = k.canvas(280);
    var opt=[0,1,2,3,4,5].map(function(i){ return [i,"Point "+i]; });
    var a = k.select("Voltmètre : borne 1",opt,0), b = k.select("Voltmètre : borne 2",opt,5);
    var res = k.note("Aucune mesure pour l'instant.","");
    var dg = k.select("Mon diagnostic : l'élément coupé est…",ELEM.map(function(e,i){return [i,e];}),0);
    var ro = k.readouts(["Mesures effectuées","Dernière lecture"]);
    var fault=Math.floor(Math.random()*5), n=0, last="—", log=[], solved=false;
    k.button("Mesurer entre les deux points", function(){
      var i=+a.value, j=+b.value; if (i===j){ last="0 V (même point)"; return; }
      var lo=Math.min(i,j), hi=Math.max(i,j); n++;
      var v = (fault>=lo && fault<hi) ? E : 0; last=F(v,1)+" V";
      log.push("n°"+n+" : points "+lo+"–"+hi+" → "+F(v,1)+" V");
    }, true);
    k.button("Proposer ce diagnostic", function(){ solved=true; });
    k.button("Nouvelle panne", function(){ fault=Math.floor(Math.random()*5); n=0; last="—"; log=[]; solved=false; });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      var x0=34,x1=W-24, step=(x1-x0)/5, y=100, py=170;
      /* pile à gauche, chaîne au-dessus, retour en bas */
      ln(c,[x0,y],[x1,y]); ln(c,[x0,y],[x0,py]); ln(c,[x1,y],[x1,py]); ln(c,[x0,py],[x1,py]); pile(c,W/2,py); T(c,"pile 6 V",W/2,py+26,{size:12,color:P.grey});
      for (var i=0;i<5;i++){ var mx=x0+step*(i+0.5), t=(i===0||i===2||i===4)?"l":i===1?"s":"f";
        rect(c,mx-17,y-17,34,34,"#fff");
        if (t==="l") lamp(c,mx,y,13,0,"",false);
        else if (t==="s"){ ln(c,[mx-16,y],[mx-6,y]); ln(c,[mx+16,y],[mx+8,y]); ln(c,[mx-6,y],[mx+8,y-10],"#3a4a60",3); D.dot(c,mx-6,y,3,"#fff"); }
        else ln(c,[mx-16,y],[mx+16,y]);
        T(c,step<62?["L1","Int.","L2","Fil","L3"][i]:ELEM[i],mx,y-30,{size:12,color:P.grey});
        if (solved && i===fault){ circ(c,mx,y,22,null,P.red,3); T(c,"coupure",mx,y+34,{size:12,color:P.red}); }
      }
      for (i=0;i<6;i++){ var px=x0+step*i; circ(c,px,y,5,(i===+a.value||i===+b.value)?P.acc:"#fff",P.grey,2); T(c,String(i),px,y+20,{size:12,color:P.ink}); }
      /* sondes */
      var pa=x0+step*(+a.value), pb=x0+step*(+b.value);
      D.line(c,pa,y,pa,y-52,P.red,2); D.line(c,pb,y,pb,y-52,P.acc,2); rect(c,Math.min(pa,pb)+4,y-68,Math.abs(pb-pa)-8>20?Math.abs(pb-pa)-8:20,16,"#e8f1e0","#7a8f6a",1.5,4);
      T(c,"V",(Math.min(pa,pb)+Math.max(pa,pb))/2,y-60,{size:12,color:"#243018"});
      ro.set(0,String(n)); ro.set(1,last);
      var m=log.slice(-4).join("<br>");
      var verdict="";
      if (solved){ var ok=+dg.value===fault; verdict=ok?"<br><b>Bien joué : "+ELEM[fault]+" est coupé.</b> "+(n<=3?"Maximum d'efficacité : "+n+" mesures.":"Trouvé en "+n+" mesures (3 suffisent avec la dichotomie)."):"<br><b>Ce n'est pas "+ELEM[+dg.value]+".</b> La coupure était sur : "+ELEM[fault]+"."; }
      res.set((log.length?m:"Aucune mesure pour l'instant.")+verdict, solved?(+dg.value===fault?"ok":"warn"):"");
    });
  }
});
})();
