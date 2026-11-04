/* Chapitre 2 · Circuit électrique et courant */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function glow(c,x,y,r,b){ if(b<=0.02) return; var g=c.ctx, R=r*(1.3+Math.min(b,1.6)), gr=g.createRadialGradient(x,y,r*0.3,x,y,R); gr.addColorStop(0,"rgba(255,206,60,"+Math.min(0.9,0.25+0.55*b)+")"); gr.addColorStop(1,"rgba(255,206,60,0)"); g.fillStyle=gr; g.beginPath(); g.arc(x,y,R,0,6.2832); g.fill(); }
function lamp(c,x,y,r,b,burnt){ glow(c,x,y,r,b); circ(c,x,y,r,b>0.02?"rgba(255,236,150,"+Math.min(1,0.4+0.6*b)+")":"#f4f6f9",burnt?P.red:P.ink,2); var g=c.ctx; g.save(); g.strokeStyle=burnt?P.red:P.ink; g.lineWidth=1.5; g.beginPath(); g.moveTo(x-r*0.7,y-r*0.7); g.lineTo(x+r*0.7,y+r*0.7); g.moveTo(x+r*0.7,y-r*0.7); g.lineTo(x-r*0.7,y+r*0.7); g.stroke(); g.restore(); }
function ltext(c,s,x,y,ang,col,size){ var g=c.ctx; g.save(); g.translate(x,y); g.rotate(-ang); T(c,s,0,0,{size:size||12,color:col||P.grey}); g.restore(); }
/* dessine un composant dans un repère local horizontal centré en (x,y), tourné de ang ; longueur -24..24 */
function elem(c,type,x,y,ang,b,burnt){
  var g=c.ctx; g.save(); g.translate(x,y); g.rotate(ang); rect(c,-24,-22,48,44,"#fff");
  g.strokeStyle="#3a4a60"; g.lineWidth=3; g.fillStyle="#3a4a60";
  function ln(a,b2){ g.beginPath(); g.moveTo(a,0); g.lineTo(b2,0); g.stroke(); }
  if (type==="fil") ln(-24,24);
  else if (type==="p1"||type==="p2"){ var s=type==="p1"?1:-1; ln(-24,-6*s>0?-6:-6); ln(6,24);
    g.beginPath(); g.moveTo(s*6,-15); g.lineTo(s*6,15); g.lineWidth=2.5; g.stroke(); g.beginPath(); g.moveTo(-s*6,-9); g.lineTo(-s*6,9); g.lineWidth=5; g.stroke();
    g.restore(); var ca=Math.cos(ang), sa=Math.sin(ang); ltext(c,"+",x+ca*s*15-sa*(-14),y+sa*s*15+ca*(-14),ang,P.red,14); return; }
  else if (type==="l"){ ln(-24,-16); ln(16,24); g.restore(); lamp(c,x,y,16,b,burnt); return; }
  else if (type==="so"){ ln(-24,-9); ln(10,24); g.beginPath(); g.moveTo(-9,0); g.lineTo(8,-14); g.stroke(); }
  else if (type==="sf"){ ln(-24,24); g.beginPath(); g.arc(-9,0,3,0,6.3); g.fillStyle="#fff"; g.fill(); g.stroke(); g.beginPath(); g.arc(9,0,3,0,6.3); g.fill(); g.stroke(); }
  else if (type==="is"){ ln(-24,-12); ln(12,24); g.fillStyle="#dfe6ee"; g.strokeStyle=P.grey; g.lineWidth=1.5; g.fillRect(-11,-11,22,22); g.strokeRect(-11,-11,22,22); }
  g.restore();
}
/* position le long d'un circuit rectangulaire fermé (sens horaire), u dans [0,1) */
function onRect(x0,y0,x1,y1,u){ var w=x1-x0,h=y1-y0,per=2*(w+h),s=((u%1)+1)%1*per; if(s<w) return [x0+s,y0,0]; s-=w; if(s<h) return [x1,y0+s,Math.PI/2]; s-=h; if(s<w) return [x1-s,y1,Math.PI]; s-=w; return [x0,y1-s,-Math.PI/2]; }
function arrowhead(c,x,y,ang,col){ var g=c.ctx; g.save(); g.translate(x,y); g.rotate(ang); g.fillStyle=col||P.ink; g.beginPath(); g.moveTo(8,0); g.lineTo(-5,-5.5); g.lineTo(-5,5.5); g.fill(); g.restore(); }

/* 1 · Atelier de montage */
SFA.sim({
  id:"p3-c02-atelier", ch:"c02", tag:"Classique",
  titre:"Atelier de montage : la lampe s'allume-t-elle ?",
  resume:"Place pile, lampe, interrupteur, fil ou isolant sur les 4 côtés d'un circuit et observe.",
  but:"Choisis ce qui se trouve sur chacun des quatre côtés. Observe la lampe, le sens conventionnel du courant (flèches noires) et le sens de déplacement des électrons (points bleus).",
  aRetenir:"Pour qu'une lampe s'allume il faut une boucle fermée, sans coupure, contenant un générateur. Le sens conventionnel va de la borne + vers la borne − à l'extérieur de la pile ; les électrons circulent en sens inverse.",
  piege:"Deux piles montées en opposition s'annulent. Et une pile reliée à une lampe par un seul fil ne suffit pas : il faut une boucle complète.",
  build:function(k,S){
    var c = k.canvas(330);
    var OPT=[["fil","Fil"],["p1","Pile 1,5 V (sens ↻)"],["p2","Pile 1,5 V (sens ↺)"],["l","Lampe 3 V – 0,3 A"],["so","Interrupteur ouvert"],["sf","Interrupteur fermé"],["is","Morceau de plastique"]];
    var s0=k.select("Côté du haut",OPT,"p1"), s1=k.select("Côté de droite",OPT,"l"), s2=k.select("Côté du bas",OPT,"sf"), s3=k.select("Côté de gauche",OPT,"fil");
    var ro=k.readouts(["Tension du générateur","Intensité","Éclat de la lampe"]);
    var nt=k.note("","");
    var ph=0, lp=k.loop(function(dt){ ph=(ph+dt*0.3)%1; k.redraw(); });
    function ana(){
      var el=[s0.value,s1.value,s2.value,s3.value], E=0, nl=0, np=0, open=false;
      el.forEach(function(e){ if(e==="p1"){E+=1.5;np++;} else if(e==="p2"){E-=1.5;np++;} else if(e==="l") nl++; else if(e==="so"||e==="is") open=true; });
      var o={el:el,E:E,nl:nl,np:np,open:open,I:0,b:0,msg:"",kind:"warn"};
      if (np===0){ o.msg="Aucun générateur dans le circuit : rien ne met les charges en mouvement."; return o; }
      if (open){ o.msg="Le circuit est <b>ouvert</b> : une coupure (interrupteur ouvert ou isolant) empêche tout courant."; return o; }
      if (E===0){ o.msg="Les deux piles sont montées en opposition : leurs effets s'annulent, aucun courant."; return o; }
      if (nl===0){ o.I=99; o.sc=true; o.msg="<b>Court-circuit !</b> La pile est reliée par des fils sans aucun récepteur : très grand courant, la pile chauffe. À ne jamais faire."; o.kind="warn"; return o; }
      o.I=Math.abs(E)/(10*nl); o.b=Math.pow(o.I/0.3,2);
      if (o.I>0.4){ o.burnt=true; o.msg="Tension trop élevée pour la lampe : <b>elle grille</b> (I = "+F(o.I,2)+" A pour une lampe prévue pour 0,3 A)."; o.kind="warn"; }
      else if (o.b>0.8) { o.msg="Circuit fermé : la lampe brille normalement. Le courant (sens conventionnel) sort de la borne +."; o.kind="ok"; }
      else { o.msg="Circuit fermé, mais la tension est trop faible pour "+(nl>1?"ces lampes":"la lampe")+" : elle brille <b>peu</b>."; o.kind="ok"; }
      return o;
    }
    lp.play();
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, a=ana();
      var x0=W*0.15,x1=W*0.85,y0=62,y1=H-58, cxm=(x0+x1)/2, cym=(y0+y1)/2;
      var base=[[x0,y0,x1,y0],[x1,y0,x1,y1],[x1,y1,x0,y1],[x0,y1,x0,y0]];
      base.forEach(function(w){ D.line(c,w[0],w[1],w[2],w[3],"#3a4a60",3); });
      var mids=[[cxm,y0,0],[x1,cym,Math.PI/2],[cxm,y1,Math.PI],[x0,cym,-Math.PI/2]];
      a.el.forEach(function(e,i){ elem(c,e,mids[i][0],mids[i][1],mids[i][2],a.b,a.burnt); });
      if (a.I>0){
        var sg=a.E>0?1:-1;
        for (var j=0;j<6;j++){ var p=onRect(x0,y0,x1,y1,sg*(ph+j/6)); arrowhead(c,p[0],p[1],p[2]+(sg<0?Math.PI:0),P.ink); }
        if (!a.sc) for (j=0;j<16;j++){ var q=onRect(x0,y0,x1,y1,-sg*(ph*2+j/16)); circ(c,q[0],q[1],3.2,"#4a74d9"); }
        T(c,"▶ sens conventionnel",cxm,cym-8,{size:12,color:P.ink}); T(c,"● électrons (sens inverse)",cxm,cym+10,{size:12,color:"#4a74d9"});
      }
      ro.set(0,F(Math.abs(a.E),1)+" V"); ro.set(1,a.sc?"très grande":F(a.I,2)+" A"); ro.set(2,a.burnt?"grillée":a.b>0.02?F(Math.min(a.b,1)*100,0)+" %":"éteinte");
      nt.set(a.msg,a.kind);
    });
  }
});

/* 2 · Matériaux testeurs */
var MAT=[
 ["cuivre","Cuivre (fil)",1,"c","des électrons libres"],["alu","Aluminium (papier alu)",1,"c","des électrons libres"],["fer","Fer (clou)",0.95,"c","des électrons libres"],
 ["graph","Graphite (mine de crayon)",0.8,"c","des électrons libres"],["sel","Eau salée",0.35,"c","des ions (Na⁺ et Cl⁻) qui se déplacent"],["robi","Eau du robinet",0.04,"c","quelques ions dissous seulement"],
 ["dist","Eau distillée (très pure)",0,"i","presque aucune charge mobile"],["plast","Plastique (règle)",0,"i","aucune charge mobile"],["verre","Verre",0,"i","aucune charge mobile"],
 ["bois","Bois sec",0,"i","aucune charge mobile"],["rub","Caoutchouc",0,"i","aucune charge mobile"],["air","Air sec",0,"i","aucune charge mobile"]];
SFA.sim({
  id:"p3-c02-materiaux", ch:"c02", tag:"Expérience",
  titre:"Testeur de conducteurs et d'isolants",
  resume:"Mets un objet dans le circuit du testeur : conduit-il, et grâce à quoi ?",
  but:"Choisis un matériau, fais un pronostic, puis regarde si la lampe s'allume.",
  aRetenir:"Un matériau conduit s'il possède des charges mobiles : des électrons libres dans les métaux et le graphite, des ions dans l'eau salée. Un isolant n'en possède (presque) pas.",
  piege:"« L'eau conduit » est incomplet : l'eau très pure conduit à peine, c'est le sel dissous (les ions) qui fait conduire. Et ce ne sont pas des électrons qui traversent l'eau salée.",
  build:function(k,S){
    var c = k.canvas(280);
    var sel = k.select("Objet testé", MAT.map(function(m){ return [m[0],m[1]]; }), "cuivre");
    var pr = k.seg("Ton pronostic", [["c","Conducteur"],["i","Isolant"]], "c");
    var ro = k.readouts(["Lampe","Charges mobiles"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, m=MAT.filter(function(x){return x[0]===sel.value;})[0];
      var x0=W*0.1,x1=W*0.9,y0=70,y1=H-60;
      D.line(c,x0,y0,x1,y0,"#3a4a60",3); D.line(c,x1,y0,x1,y1,"#3a4a60",3); D.line(c,x1,y1,x0,y1,"#3a4a60",3); D.line(c,x0,y1,x0,y0,"#3a4a60",3);
      elem(c,"p1",x0,(y0+y1)/2,-Math.PI/2,0);
      var b=Math.pow(m[2],2)*1.0; elem(c,"l",(x0+x1)/2,y0,0,m[2]*1,false);
      /* zone de test en bas */
      var tx=(x0+x1)/2; rect(c,tx-45,y1-20,90,40,"#fff"); D.line(c,x0,y1,tx-45,y1,"#3a4a60",3); D.line(c,tx+45,y1,x1,y1,"#3a4a60",3);
      circ(c,tx-45,y1,5,P.ink); circ(c,tx+45,y1,5,P.ink);
      var col = m[3]==="c"? (m[4].indexOf("ions")>=0||m[4].indexOf("quelques")>=0 ? "rgba(120,170,230,.55)" : "#c9a36b") : "#e3e7ed";
      rect(c,tx-40,y1-9,80,18,col,P.grey,1.5,4);
      T(c,m[1],tx,y1+34,{size:12});
      T(c,"lampe",(x0+x1)/2,y0-32,{size:12,color:P.grey});
      ro.set(0, m[2]>0.9?"brille fort":m[2]>0.6?"brille":m[2]>0.15?"brille faiblement":m[2]>0.01?"à peine visible":"éteinte");
      ro.set(1, m[4]);
      var good = pr.value===m[3];
      nt.set((good?"<b>Bien vu.</b> ":"<b>Pas tout à fait.</b> ")+(m[3]==="c"?"Ce matériau est un <b>conducteur</b> : il contient "+m[4]+".":"Ce matériau est un <b>isolant</b> : il ne contient "+m[4]+".")+(m[0]==="sel"||m[0]==="robi"?" Lampe moins brillante car le courant est plus faible : la solution gêne davantage le passage des charges.":""), good?"ok":"warn");
    });
  }
});

/* 3 · Vue microscopique */
SFA.sim({
  id:"p3-c02-microscope", ch:"c02", tag:"Originale",
  titre:"Dans le fil : la dérive lente des électrons",
  resume:"Ferme l'interrupteur : tous les électrons partent en même temps, mais avancent très lentement.",
  but:"Observe les électrons d'un fil de cuivre : agitation désordonnée + lente dérive d'ensemble quand le circuit est fermé. Change l'intensité et la section.",
  aRetenir:"Le courant est un mouvement d'ensemble : tous les électrons du fil démarrent presque en même temps (la lampe s'allume tout de suite), mais chacun avance à une vitesse de dérive de l'ordre du dixième de millimètre par seconde.",
  piege:"Les électrons ne « courent » pas de la pile à la lampe en un instant : ceux qui allument la lampe étaient déjà dans le filament. Sur le dessin, la dérive est volontairement très exagérée.",
  build:function(k,S){
    var c = k.canvas(300);
    var I = k.slider("Intensité du courant", 0.1, 5, 0.1, 1, "A");
    var Sx = k.slider("Section du fil de cuivre", 0.5, 4, 0.5, 1, "mm²");
    var sw = k.seg("Interrupteur", [["0","Ouvert"],["1","Fermé"]], "0");
    var ro = k.readouts(["Vitesse de dérive","Temps pour 1 m de fil","Signal électrique"]);
    var nt = k.note("","");
    var N=70, el=[], i;
    for (i=0;i<N;i++) el.push({x:Math.random(),y:Math.random(),vx:0,vy:0});
    var lp = k.loop(function(dt){
      var on = sw.value==="1", dr = on ? (14+10*Math.sqrt(I.value/Sx.value))/Math.max(260,c.W) : 0;
      el.forEach(function(e){ e.x += dr*dt*8 + (Math.random()-0.5)*0.015; e.y += (Math.random()-0.5)*0.03; if(e.x>1)e.x-=1; if(e.x<0)e.x+=1; if(e.y<0.04)e.y=0.04; if(e.y>0.96)e.y=0.96; });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, on=sw.value==="1";
      var n=8.5e28, e=1.602e-19, v=I.value/(n*e*Sx.value*1e-6);         /* m/s */
      var wy=60, wh=H-130;
      rect(c,10,wy,W-20,wh,"#f5e7d3","#b88a52",2,10);
      /* ions fixes */
      for (var gx=0;gx<9;gx++) for (var gy=0;gy<3;gy++){ var X=20+gx*(W-40)/8, Y=wy+20+gy*(wh-40)/2; circ(c,X,Y,9,"#e9b7b0","#c9776c",1.5); T(c,"+",X,Y,{size:12,color:"#8a2a1a"}); }
      el.forEach(function(q){ circ(c,10+q.x*(W-20),wy+q.y*wh,3.4,"#2f56c4"); });
      T(c,"fil de cuivre : ions + fixes, électrons libres −",W/2,wy-18,{size:12,color:P.grey});
      /* lampe à droite et pile */
      lamp(c,W-34,H-42,14,on?1:0,false); T(c,on?"lampe allumée (presque tout de suite)":"lampe éteinte",W-60,H-42,{size:12,align:"right",color:on?P.amber:P.grey});
      if (on){ D.arrow(c,30,H-42,110,H-42,P.ink,2); T(c,"dérive (sens inverse du courant conv.)",118,H-42,{size:12,align:"left",color:P.grey}); }
      ro.set(0, S.sci(v*1e3,2)+" mm/s"); ro.set(1, v>0? (1/v>=3600? F(1/v/3600,1)+" h" : F(1/v/60,0)+" min") : "—"); ro.set(2,"≈ 2·10<sup>8</sup> m/s");
      nt.set(on?"Courant établi : <b>chaque électron</b> avance lentement ("+S.sci(v*1e3,2)+" mm/s), mais comme tous partent ensemble, l'effet est immédiat. Pour un même courant, une section plus grande donne une dérive plus faible.":"Interrupteur ouvert : les électrons s'agitent dans tous les sens, sans mouvement d'ensemble : aucun courant.","ok");
    });
  }
});

/* 4 · Court-circuit */
SFA.sim({
  id:"p3-c02-court-circuit", ch:"c02", tag:"Danger",
  titre:"Le court-circuit : un fil en dérivation sur la lampe",
  resume:"Branche un fil aux bornes de la lampe : elle s'éteint, mais la pile débite énormément.",
  but:"Ajoute un fil en parallèle de la lampe et change sa résistance. Observe qui reçoit le courant.",
  aRetenir:"Un court-circuit offre au courant un chemin presque sans résistance : la lampe n'est plus parcourue par du courant, mais l'intensité dans la pile devient très grande et la pile (ou le fil) chauffe fortement.",
  piege:"Lampe éteinte ne veut pas dire « pas de courant » : en court-circuit, le courant dans le circuit est maximal. Cause fréquente d'incendies.",
  build:function(k,S){
    var c = k.canvas(300);
    var on = k.toggle("Ajouter le fil de court-circuit", false);
    var Rf = k.slider("Résistance du fil", 0.05, 20, 0.05, 0.1, "Ω");
    var ro = k.readouts(["Intensité dans la pile","Intensité dans la lampe","Intensité dans le fil","Chaleur dans la pile"]);
    var nt = k.note("","");
    var E=4.5, r=1.5, Rl=15;
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      var Rp = on.value ? Rl*Rf.value/(Rl+Rf.value) : Rl, I=E/(r+Rp), U=I*Rp, Il=U/Rl, If=on.value?U/Rf.value:0, Pj=r*I*I;
      var x0=W*0.12,x1=W*0.88,y0=60,y1=H-60;
      D.line(c,x0,y0,x1,y0,"#3a4a60",3); D.line(c,x1,y0,x1,y1,"#3a4a60",3); D.line(c,x1,y1,x0,y1,"#3a4a60",3); D.line(c,x0,y1,x0,y0,"#3a4a60",3);
      elem(c,"p1",x0,(y0+y1)/2,-Math.PI/2,0);
      /* lampe en haut à droite, fil de dérivation en parallèle */
      var lx=x1-(x1-x0)*0.30;
      elem(c,"l",lx,y0,0,Math.pow(Il/0.3,2)*0.9+0,false);
      var yb=(y0+y1)/2+10;
      if (on.value){ D.line(c,lx-40,y0,lx-40,yb,P.red,3+Math.min(5,If*1.5)); D.line(c,lx-40,yb,lx+40,yb,P.red,3+Math.min(5,If*1.5)); D.line(c,lx+40,yb,lx+40,y0,P.red,3+Math.min(5,If*1.5)); T(c,"fil de court-circuit",lx,yb+16,{size:12,color:P.red}); }
      var bw=Math.min(1,I/3)*120; rect(c,W/2-60,H-26,120,10,"#e3e7ed"); rect(c,W/2-60,H-26,bw,10,I>1?P.red:P.acc); T(c,"intensité dans la pile (échelle jusqu'à 3 A)",W/2,H-8,{size:12,color:P.grey});
      ro.set(0,F(I,2)+" A"); ro.set(1,F(Il*1000,0)+" mA"); ro.set(2,F(If,2)+" A"); ro.set(3,F(Pj,1)+" W");
      if (!on.value) nt.set("Sans le fil : la lampe est parcourue par "+F(Il*1000,0)+" mA et brille. (Pile 4,5 V avec une petite résistance interne de 1,5 Ω, lampe de 15 Ω : modèle simplifié.)","ok");
      else if (Pj>5) nt.set("<b>Court-circuit :</b> la lampe est éteinte (seulement "+F(Il*1000,0)+" mA) mais la pile débite "+F(I,1)+" A et dégage "+F(Pj,0)+" W de chaleur dans sa propre résistance : elle s'échauffe dangereusement.","warn");
      else nt.set("Le fil a une résistance assez grande ("+F(Rf.value,2)+" Ω) : le courant se partage entre la lampe et le fil. Diminue la résistance du fil pour voir le court-circuit.","warn");
    });
  }
});
})();
