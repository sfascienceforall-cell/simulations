/* Chapitre 4 · Résistance et loi d'Ohm */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function glow(c,x,y,r,b){ if(b<=0.02) return; var g=c.ctx, R=r*(1.3+Math.min(b,1.6)), gr=g.createRadialGradient(x,y,r*0.3,x,y,R); gr.addColorStop(0,"rgba(255,206,60,"+Math.min(0.9,0.25+0.55*b)+")"); gr.addColorStop(1,"rgba(255,206,60,0)"); g.fillStyle=gr; g.beginPath(); g.arc(x,y,R,0,6.2832); g.fill(); }
function fmtR(r){ return r>=1e6 ? F(r/1e6,2)+" MΩ" : r>=1e3 ? F(r/1e3,2)+" kΩ" : F(r,2)+" Ω"; }

/* 1 · Caractéristique d'un conducteur ohmique */
SFA.sim({
  id:"p3-c04-caracteristique", ch:"c04", tag:"Classique",
  titre:"Caractéristique d'un conducteur ohmique",
  resume:"Mesure plusieurs points (I, U) : ils s'alignent sur une droite dont la pente est la résistance.",
  but:"Choisis une résistance, règle la tension, ajoute des points de mesure. Change de résistance et compare les pentes.",
  aRetenir:"Pour un conducteur ohmique, U = R·I : la caractéristique U = f(I) est une droite passant par l'origine, de pente R (en Ω = V/A). Le rapport U/I est constant, la résistance ne dépend ni de U ni de I.",
  piege:"Si on double la tension, l'intensité double aussi, mais R reste la même. Une résistance plus grande donne une droite plus raide (pente plus forte), pas plus plate.",
  build:function(k,S){
    var c = k.canvas(340);
    var R = k.slider("Résistance du dipôle", 20, 200, 10, 60, "Ω");
    var U = k.slider("Tension appliquée", 0, 12, 0.5, 6, "V");
    var pen = k.toggle("Montrer le triangle de pente", false);
    var ro = k.readouts(["Intensité I","Rapport U / I","Pente de la droite"]);
    var nt = k.note("","");
    var pts = [], cols=[P.acc,P.red,P.green,P.violet,P.amber,P.teal,P.grey,"#8a2a1a"];
    k.button("Ajouter le point de mesure", function(){ if (U.value>0) pts.push({U:U.value,I:U.value/R.value,R:R.value}); }, true);
    k.button("Effacer les points", function(){ pts=[]; });
    k.draw(function(){
      c.clear();
      var ax = D.axes(c,{x0:0,x1:0.6,y0:0,y1:12,xl:"I (A)",yl:"U (V)",stepX:0.1,stepY:2,l:44,b:34});
      var r=R.value;
      D.fn(c,ax,function(i){ return r*i; },P.acc,2.5);
      pts.forEach(function(p){ var ci=cols[Math.round(p.R/10)%cols.length]; circ(c,ax.X(p.I),ax.Y(p.U),5,ci,"#fff",1.5); });
      var I=U.value/r;
      circ(c,ax.X(I),ax.Y(U.value),6.5,"#fff",P.red,3);
      D.line(c,ax.X(I),ax.Y(U.value),ax.X(I),ax.Y(0),P.red,1.2,[4,3]); D.line(c,ax.X(I),ax.Y(U.value),ax.X(0),ax.Y(U.value),P.red,1.2,[4,3]);
      if (pen.value){ var i1=Math.min(0.3,10.5/r), i0=i1/3, y0=r*i0, y1=r*i1;
        D.line(c,ax.X(i0),ax.Y(y0),ax.X(i1),ax.Y(y0),P.green,2); D.line(c,ax.X(i1),ax.Y(y0),ax.X(i1),ax.Y(y1),P.green,2);
        T(c,"ΔI = "+F(i1-i0,2)+" A",ax.X((i0+i1)/2),ax.Y(y0)+14,{size:12,color:P.green}); T(c,"ΔU = "+F(y1-y0,1)+" V",ax.X(i1)+6,ax.Y((y0+y1)/2),{size:12,color:P.green,align:"left"}); }
      var iL=Math.min(0.49,10.5/r); T(c,"R = "+F(r,0)+" Ω",ax.X(iL),ax.Y(r*iL)-16,{size:13,color:P.acc});
      ro.set(0,F(I*1000,0)+" mA"); ro.set(1,U.value>0?F(U.value/I,0)+" Ω":"—"); ro.set(2,F(r,0)+" V/A");
      nt.set(pts.length>1?"Tous les points d'une même résistance sont alignés avec l'origine : U/I = "+F(r,0)+" Ω. Les couleurs distinguent les résistances.":"Ajoute plusieurs points avec des tensions différentes, puis change la résistance.","ok");
    });
  }
});

/* 2 · Fil résistif */
var MATF=[["cuivre","Cuivre",0.0172],["alu","Aluminium",0.0282],["fer","Fer",0.10],["const","Constantan",0.49],["nich","Nichrome",1.10]];
SFA.sim({
  id:"p3-c04-fil", ch:"c04", tag:"Défi",
  titre:"La résistance d'un fil : longueur, section, matériau",
  resume:"Règle le fil pour atteindre une résistance cible. R = ρ·L / S.",
  but:"Fais varier la longueur L, la section S et le matériau. Relève R. Relève ensuite un défi : atteins la résistance demandée à 5 % près.",
  aRetenir:"La résistance d'un fil est proportionnelle à sa longueur, inversement proportionnelle à sa section, et dépend du matériau (résistivité ρ) : R = ρ·L / S. Un fil long et fin résiste beaucoup ; un fil gros et court, très peu.",
  piege:"La résistance diminue quand la section augmente (comme un tuyau plus large). Doubler le diamètre multiplie la section par 4, pas par 2.",
  build:function(k,S){
    var c = k.canvas(300);
    var m = k.select("Matériau",MATF.map(function(x){return [x[0],x[1]+" (ρ = "+F(x[2],4)+" Ω·mm²/m)"];}),"cuivre");
    var L = k.slider("Longueur L",1,20,1,5,"m");
    var Sx = k.slider("Section S",0.1,4,0.1,1,"mm²");
    var ro = k.readouts(["Résistance du fil","Par rapport à 1 m de cuivre de 1 mm²"]);
    var tg = {v:0};
    function newTarget(){ var l=[1,2,5,10,20,50]; tg.v=l[Math.floor(Math.random()*l.length)]*(1+Math.floor(Math.random()*2)*0.5); }
    newTarget();
    k.button("Nouveau défi", function(){ newTarget(); });
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      var rho=MATF.filter(function(x){return x[0]===m.value;})[0][2], r=rho*L.value/Sx.value;
      var th=2+Math.sqrt(Sx.value)*5, len=(W-80)*L.value/20;
      var cy=H/2-20;
      rect(c,20,cy-th/2,len,th,"#c98b4a","#8c5a22",1.5,th/2);
      D.arrow(c,20,cy-26,20+len,cy-26,P.grey,1.5); D.arrow(c,20+len,cy-26,20,cy-26,P.grey,1.5); T(c,"L = "+F(L.value,0)+" m",20+len/2,cy-40,{size:12,color:P.grey});
      /* section agrandie */
      var sr=6+Math.sqrt(Sx.value)*10; circ(c,W-50,cy+55,sr,"#c98b4a","#8c5a22",2); T(c,"section S = "+F(Sx.value,1)+" mm²",W-50,cy+55+sr+16,{size:12,color:P.grey});
      /* barre R */
      var bw=Math.min(1,r/60)*(W-80); rect(c,20,H-48,W-80,14,"#e9edf2"); rect(c,20,H-48,bw,14,r>60?P.red:P.acc);
      T(c,"R = "+fmtR(r)+(r>60?" (au-delà de l'échelle)":"")+"    échelle : 0 → 60 Ω",20,H-22,{size:12,align:"left",color:P.ink});
      ro.set(0,fmtR(r)); ro.set(1,"× "+S.sci(r/0.0172,3));
      var d=Math.abs(r-tg.v)/tg.v;
      nt.set("<b>Défi :</b> atteins R = "+F(tg.v,1)+" Ω (±5 %). "+(d<=0.05?"<b>Réussi !</b> R = "+F(r,2)+" Ω.":"Pour l'instant R = "+F(r,2)+" Ω ("+(r<tg.v?"trop petite : allonge ou affine le fil, ou change de matériau":"trop grande : raccourcis ou épaissis le fil")+")."),d<=0.05?"ok":"warn");
    });
  }
});

/* 3 · Code couleur */
var CHIF=[["noir","#111",0],["marron","#7b4a20",1],["rouge","#d1342b",2],["orange","#f08a1c",3],["jaune","#f2d21b",4],["vert","#3aa655",5],["bleu","#2f62d6",6],["violet","#8a3fc4",7],["gris","#8e949c",8],["blanc","#fafafa",9]];
var MULT=[["noir","#111",1],["marron","#7b4a20",10],["rouge","#d1342b",100],["orange","#f08a1c",1e3],["jaune","#f2d21b",1e4],["vert","#3aa655",1e5],["bleu","#2f62d6",1e6],["or","#cda434",0.1],["argent","#c3c7cc",0.01]];
var TOL=[["marron","#7b4a20",1],["rouge","#d1342b",2],["or","#cda434",5],["argent","#c3c7cc",10]];
SFA.sim({
  id:"p3-c04-code-couleur", ch:"c04", tag:"Défi",
  titre:"Lire le code couleur d'une résistance",
  resume:"Choisis les 4 bagues : lis la valeur et la tolérance, ou relève le défi.",
  but:"Choisis la couleur de chaque bague. Les deux premières donnent les chiffres, la troisième le multiplicateur, la quatrième la tolérance. Relève le défi : reproduis la valeur demandée.",
  aRetenir:"Valeur = (chiffre 1, chiffre 2) × multiplicateur. Ex. : marron-noir-rouge = 10 × 100 = 1 000 Ω = 1 kΩ. La tolérance (or = ±5 %) donne l'intervalle dans lequel se trouve la vraie valeur.",
  piege:"La troisième bague n'est pas un chiffre : c'est le nombre de zéros (multiplicateur). Rouge en 3e position = ×100, pas « + 2 ».",
  build:function(k,S){
    var c = k.canvas(220);
    var opt=function(a){ return a.map(function(x,i){ return [i,x[0]]; }); };
    var b1=k.select("Bague 1 (chiffre)",opt(CHIF),1), b2=k.select("Bague 2 (chiffre)",opt(CHIF),0), b3=k.select("Bague 3 (multiplicateur)",opt(MULT),2), b4=k.select("Bague 4 (tolérance)",opt(TOL),2);
    var ro=k.readouts(["Valeur","Tolérance","Intervalle"]);
    var nt=k.note("","");
    var tg=null;
    function newT(){ var d1=1+Math.floor(Math.random()*9), d2=Math.floor(Math.random()*10), mi=Math.floor(Math.random()*7); tg={v:(d1*10+d2)*MULT[mi][2]}; }
    k.button("Défi : nouvelle valeur à reproduire", function(){ newT(); });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      var v=(CHIF[+b1.value][2]*10+CHIF[+b2.value][2])*MULT[+b3.value][2], t=TOL[+b4.value][2];
      var cy=H/2-6, bw=Math.min(260,W-100), x0=W/2-bw/2;
      D.line(c,x0-40,cy,x0,cy,P.grey,4); D.line(c,x0+bw,cy,x0+bw+40,cy,P.grey,4);
      rect(c,x0,cy-24,bw,48,"#e9cf9b","#a58645",2,18);
      [[CHIF[+b1.value][1],0.17],[CHIF[+b2.value][1],0.34],[MULT[+b3.value][1],0.51],[TOL[+b4.value][1],0.82]].forEach(function(b){ rect(c,x0+bw*b[1],cy-24,10,48,b[0],"#555",1); });
      T(c,"1",x0+bw*0.17+5,cy+40,{size:12,color:P.grey}); T(c,"2",x0+bw*0.34+5,cy+40,{size:12,color:P.grey}); T(c,"×",x0+bw*0.51+5,cy+40,{size:12,color:P.grey}); T(c,"±",x0+bw*0.82+5,cy+40,{size:12,color:P.grey});
      ro.set(0,fmtR(v)); ro.set(1,"± "+t+" %"); ro.set(2,fmtR(v*(1-t/100))+" à "+fmtR(v*(1+t/100)));
      var msg="Lecture : ("+CHIF[+b1.value][2]+CHIF[+b2.value][2]+") × "+S.sci(MULT[+b3.value][2],3)+" = "+fmtR(v)+".";
      if (tg){ var ok=Math.abs(v-tg.v)<tg.v*1e-6; msg="<b>Défi :</b> reproduis "+fmtR(tg.v)+". "+(ok?"<b>Réussi !</b>":"Ta valeur : "+fmtR(v)+".")+" "+msg; }
      nt.set(msg,"ok");
    });
  }
});

/* 4 · Lampe vs résistance */
function lampR(U){ return 1.2+10.8*Math.pow(U/6,0.45); }
SFA.sim({
  id:"p3-c04-lampe-resistance", ch:"c04", tag:"Comparaison",
  titre:"Résistance ou lampe : qui est ohmique ?",
  resume:"Compare la caractéristique d'une résistance (droite) et celle d'une lampe à filament (courbe).",
  but:"Augmente la tension de 0 à 6 V. Compare les courbes et le rapport U/I de chaque dipôle.",
  aRetenir:"Un dipôle est ohmique si sa caractéristique est une droite passant par l'origine : R constante. Le filament d'une lampe n'est pas ohmique : en chauffant (jusqu'à plus de 2 000 °C), sa résistance augmente, la courbe s'incurve.",
  piege:"Calculer « R = U/I » pour une lampe donne une valeur qui dépend de la tension : ce n'est pas une constante du dipôle. (Modèle simplifié : R passe d'environ 1,2 Ω à froid à 12 Ω sous 6 V.)",
  build:function(k,S){
    var c = k.canvas(340);
    var U = k.slider("Tension appliquée",0,6,0.1,3,"V");
    var ro = k.readouts(["Résistance fixe 12 Ω : I","Lampe : I","Lampe : U / I"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      var ax=D.axes(c,{x0:0,x1:0.6,y0:0,y1:6,xl:"I (A)",yl:"U (V)",stepX:0.1,stepY:1,l:44,b:34});
      D.fn(c,ax,function(i){ return 12*i; },P.acc,2.5);
      var g=c.ctx; g.save(); g.beginPath(); g.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); g.clip(); g.strokeStyle=P.red; g.lineWidth=2.5; g.beginPath();
      for (var u=0.02;u<=6.001;u+=0.05){ var i=u/lampR(u); if (u<0.03) g.moveTo(ax.X(i),ax.Y(u)); else g.lineTo(ax.X(i),ax.Y(u)); } g.stroke(); g.restore();
      T(c,"résistance",ax.X(0.47),ax.Y(5.9)-4,{size:12,color:P.acc}); T(c,"lampe",ax.X(0.2),ax.Y(5.5)-0,{size:12,color:P.red});
      var Ir=U.value/12, Il=U.value>0?U.value/lampR(U.value):0;
      circ(c,ax.X(Ir),ax.Y(U.value),6,"#fff",P.acc,3); circ(c,ax.X(Il),ax.Y(U.value),6,"#fff",P.red,3);
      D.line(c,ax.L,ax.Y(U.value),ax.R,ax.Y(U.value),"#cdd5e0",1,[4,3]);
      /* lampe dessinée */
      var br=Math.pow(U.value/6,1.6); glow(c,W-40,50,16,br*1.2); circ(c,W-40,50,16,"rgba(255,236,150,"+(0.3+0.7*br)+")",P.ink,2);
      ro.set(0,F(Ir*1000,0)+" mA"); ro.set(1,F(Il*1000,0)+" mA"); ro.set(2,U.value>0?F(lampR(U.value),1)+" Ω":"—");
      nt.set(U.value>0?"À "+F(U.value,1)+" V : la résistance fixe vaut toujours 12 Ω ; la lampe vaut <b>"+F(lampR(U.value),1)+" Ω</b> : plus la tension est grande, plus le filament est chaud et plus sa résistance est grande.":"Règle une tension non nulle.","ok");
    });
  }
});
})();
