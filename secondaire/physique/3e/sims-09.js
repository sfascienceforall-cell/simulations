/* Chapitre 9 · La pression */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt, G=9.81;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function ln(c,a,b,col,w,dash){ D.line(c,a[0],a[1],b[0],b[1],col||"#3a4a60",w||3,dash); }
function fp(p){ return p>=1e5 ? F(p/1e3,0)+" kPa" : p>=1e3 ? F(p/1e3,2)+" kPa" : F(p,0)+" Pa"; }

/* 1 · Brique sur le sable */
var FACES=[["200","Grande face (20 × 10 cm = 200 cm²)"],["100","Face moyenne (20 × 5 cm = 100 cm²)"],["50","Petite face (10 × 5 cm = 50 cm²)"]];
SFA.sim({
  id:"p3-c09-brique", ch:"c09", tag:"Classique",
  titre:"Brique sur le sable : force, surface, pression",
  resume:"Pose une brique sur sa grande ou sa petite face : la force est la même, l'enfoncement non.",
  but:"Change la face de contact, la masse et le nombre de briques empilées. Compare la force, la surface et la pression, et l'enfoncement dans le sable.",
  aRetenir:"La pression est la force pressante par unité de surface : p = F / S. Avec F en newtons et S en m², p est en pascals (1 Pa = 1 N/m²). À force égale, plus la surface est petite, plus la pression est grande : on s'enfonce avec des talons aiguilles, pas avec des skis.",
  piege:"Le poids de la brique est le même, quelle que soit la face posée : ce n'est pas la force qui change, mais la surface sur laquelle elle se répartit. 1 cm² = 0,0001 m² (pas 0,01 m²).",
  build:function(k,S){
    var c = k.canvas(380);
    var face = k.select("Face posée sur le sable",FACES,"200");
    var mb = k.slider("Masse d'une brique",1,3,0.5,2,"kg");
    var nb = k.slider("Nombre de briques empilées",1,4,1,1,"");
    var ro = k.readouts(["Force F = poids","Surface S","Pression (force ÷ surface)","Enfoncement"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, Fn=mb.value*nb.value*G, Sm=+face.value*1e-4, p=Fn/Sm;
      var dep=30*(1-Math.exp(-p/5000));                 /* mm, courbe qualitative */
      var gy=H*0.7, cx=W*0.42, fc=+face.value, u=3.2;
      var bw=(fc===50?10:20)*u, bh=(fc===200?5:fc===100?10:20)*u;
      var dpx=dep*2.4;
      c.ctx.fillStyle="#e8d6a8"; c.ctx.fillRect(10,gy,W-20,H-gy-10);
      /* creux dans le sable */
      c.ctx.fillStyle="#d8c28a"; c.ctx.beginPath(); c.ctx.moveTo(cx-bw/2-12,gy); c.ctx.lineTo(cx-bw/2,gy+dpx); c.ctx.lineTo(cx+bw/2,gy+dpx); c.ctx.lineTo(cx+bw/2+12,gy); c.ctx.closePath(); c.ctx.fill();
      for (var i=0;i<nb.value;i++){ var yy=gy+dpx-bh*(i+1); rect(c,cx-bw/2,yy,bw,bh,"#c9552b",P.ink,2,3); }
      T(c,F(mb.value*nb.value,1)+" kg",cx,gy+dpx-bh*nb.value/2,{size:13,color:"#fff"});
      var topY=gy+dpx-bh*nb.value; D.arrow(c,cx+bw/2+30,topY-26,cx+bw/2+30,topY+4+Math.min(40,Fn*0.8),P.red,3.5); T(c,"F",cx+bw/2+44,topY-10,{size:13,color:P.red,align:"left"});
      D.line(c,10,gy,W-10,gy,"#8a7a4a",1.5,[5,4]);
      T(c,"Enfoncement : "+F(dep,0)+" mm (échelle qualitative)",W/2,H-14,{size:12,color:P.ink});
      ro.set(0,F(Fn,1)+" N"); ro.set(1,F(Sm*1e4,0)+" cm² = "+F(Sm,4)+" m²"); ro.set(2,fp(p)); ro.set(3,F(dep,0)+" mm");
      nt.set("p = "+F(Fn,1)+" N / "+F(Sm,4)+" m² = <b>"+fp(p)+"</b>. "+(fc===200?"Essaie la petite face : même force, surface 4 fois plus petite.":"Par rapport à la grande face (200 cm²), la surface est "+F(200/fc,0)+" fois plus petite : la pression est "+F(200/fc,0)+" fois plus grande."),"ok");
    });
  }
});

/* 2 · Pression dans un liquide */
var LIQ=[["1000","Eau douce (1 000 kg/m³)"],["1030","Eau de mer (1 030 kg/m³)"],["920","Huile d'olive (920 kg/m³)"],["13600","Mercure (13 600 kg/m³)"]];
SFA.sim({
  id:"p3-c09-liquide", ch:"c09", tag:"Interaction",
  titre:"Pression dans un liquide : profondeur et jets",
  resume:"Plonge une sonde dans un bidon percé : la pression augmente avec la profondeur, pas avec la forme.",
  but:"Descends la sonde de pression. Compare les liquides. Observe la portée des trois jets du bidon percé.",
  aRetenir:"Dans un liquide au repos, la pression augmente avec la profondeur h et avec la masse volumique ρ du liquide : Δp = ρ·g·h. Elle s'exerce dans toutes les directions et ne dépend pas de la forme du récipient. La pression totale s'obtient en ajoutant la pression atmosphérique.",
  piege:"La pression ne dépend ni de la quantité de liquide, ni de la largeur du récipient, seulement de la profondeur. Les jets ont la même portée quel que soit le liquide : leur vitesse ne dépend que de la profondeur du trou.",
  build:function(k,S){
    var c = k.canvas(340);
    var lq = k.select("Liquide",LIQ,"1000");
    var h = k.slider("Profondeur de la sonde",0,40,1,20,"cm");
    var ro = k.readouts(["Pression due au liquide","Pression totale (avec l'air)","Pression en plus à 5 m de profondeur"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, rho=+lq.value, hm=h.value/100, dp=rho*G*hm, pt=101325+dp;
      var Dc=40, bx=W*0.06, bw=W*0.34, sc=Math.min(5.2,(H-90)/Dc,(W-bx-bw-14)/40), by=H-40-Dc*sc;     /* by : surface du liquide */
      var gy=H-40;
      rect(c,bx,by,bw,Dc*sc,rho>5000?"rgba(150,160,175,.55)":rho>1020?"rgba(70,130,210,.35)":rho<950?"rgba(235,200,60,.4)":"rgba(90,160,240,.32)",P.ink,2.5,0);
      ln(c,[8,gy],[W-8,gy],"#8a6d3b",3);
      /* jets : trous à 5, 15, 30 cm de profondeur */
      [5,15,30].forEach(function(hh){ var yy=by+hh*sc; circ(c,bx+bw,yy,3,P.ink); c.ctx.save(); c.ctx.strokeStyle="#3f7fd1"; c.ctx.lineWidth=2.5; c.ctx.beginPath(); c.ctx.moveTo(bx+bw,yy);
        var xr=2*Math.sqrt(hh*(Dc-hh)); for (var s=0;s<=xr+0.01;s+=0.5){ var drop=s*s/(4*hh); c.ctx.lineTo(bx+bw+s*sc,yy+drop*sc); } c.ctx.stroke(); c.ctx.restore();
        T(c,F(xr,0)+" cm",bx+bw+xr*sc,gy+(hh===15?24:12),{size:12,color:P.acc}); });
      /* sonde */
      var py=by+h.value*sc, sx=bx+bw*0.45; ln(c,[sx,by-24],[sx,py],P.ink,2); circ(c,sx,py,8,"#fff",P.red,3);
      /* flèches de pression dans toutes les directions */
      var L=Math.min(34,6+dp/1500*34); [[1,0],[-1,0],[0,1],[0,-1],[.7,.7],[-.7,.7]].forEach(function(d){ D.arrow(c,sx+d[0]*12,py+d[1]*12,sx+d[0]*(12+L),py+d[1]*(12+L),P.red,2); });
      T(c,"niveau "+Dc+" cm",bx+bw/2,by-8,{size:12,color:P.grey}); T(c,"h = "+h.value+" cm",sx+16,py+2,{size:12,color:P.red,align:"left"});
      ro.set(0,fp(dp)); ro.set(1,fp(pt)); ro.set(2,fp(rho*G*5));
      nt.set("Δp = ρ·g·h = "+F(rho,0)+" × 9,81 × "+F(hm,2)+" = <b>"+fp(dp)+"</b>. "+(rho>5000?"Le mercure est 13,6 fois plus dense que l'eau : même profondeur, pression 13,6 fois plus grande.":"Dans l'eau, la pression augmente d'environ 1 bar (100 kPa) tous les 10 m."),"ok");
    });
  }
});

/* 3 · Presse hydraulique */
SFA.sim({
  id:"p3-c09-presse", ch:"c09", tag:"Pascal",
  titre:"La presse hydraulique : multiplier une force",
  resume:"Un petit piston que l'on pousse, un grand piston qui soulève : la force est multipliée, la course divisée.",
  but:"Règle les surfaces des pistons et la force sur le petit piston. Observe la force sur le grand piston, puis enfonce le petit piston d'une distance donnée.",
  aRetenir:"Principe de Pascal : une pression exercée sur un liquide enfermé se transmet intégralement dans tout le liquide. Donc F₁/S₁ = F₂/S₂, soit F₂ = F₁·S₂/S₁. Mais le liquide est incompressible : le grand piston monte moins que le petit ne descend, d₂ = d₁·S₁/S₂ : le travail reste le même (F₁d₁ = F₂d₂).",
  piege:"La presse ne « crée » pas d'énergie : on gagne en force mais on perd en distance. Modèle idéal (sans frottement ni fuite).",
  build:function(k,S){
    var c = k.canvas(340);
    var s1 = k.slider("Surface du petit piston S₁",1,10,1,2,"cm²");
    var s2 = k.slider("Surface du grand piston S₂",10,200,10,100,"cm²");
    var f1 = k.slider("Force sur le petit piston F₁",10,200,10,100,"N");
    var d1 = k.slider("Enfoncement du petit piston d₁",0,20,1,10,"cm");
    var mc = k.slider("Masse à soulever",100,3000,100,300,"kg");
    var ro = k.readouts(["Pression dans le liquide","Force sur le grand piston","Montée du grand piston","Travail du petit puis du grand piston"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      var p=f1.value/(s1.value*1e-4), F2=f1.value*s2.value/s1.value, d2=d1.value*s1.value/s2.value, W1=f1.value*d1.value/100, W2=F2*d2/100;
      var w1=14+s1.value*4, w2=14+Math.sqrt(s2.value)*9, gy=H-50, x1=W*0.2, x2=W*0.62, base=gy-50;
      var a=d1.value*3, b=d2*3;
      /* liquide */
      c.ctx.fillStyle="rgba(90,160,240,.4)"; c.ctx.fillRect(x1-w1/2,base+a,w1,gy-base-a); c.ctx.fillRect(x2-w2/2,base-b,w2,gy-base+b); c.ctx.fillRect(x1-w1/2,gy-28,x2-x1+w2/2+w1/2,28);
      c.ctx.strokeStyle=P.ink; c.ctx.lineWidth=2.5; c.ctx.strokeRect(x1-w1/2,base-30,w1,gy-base+30); c.ctx.strokeRect(x2-w2/2,base-60,w2,gy-base+60); c.ctx.strokeRect(x1-w1/2,gy-28,x2-x1+w2/2+w1/2,28);
      rect(c,x1-w1/2-2,base+a-8,w1+4,8,"#8a95a3",P.ink,1.5); rect(c,x2-w2/2-2,base-b-8,w2+4,8,"#8a95a3",P.ink,1.5);
      D.arrow(c,x1,base+a-60,x1,base+a-10,P.red,3.5); T(c,"F₁ = "+F(f1.value,0)+" N",x1,base+a-72,{size:12,color:P.red});
      var mw=Math.min(w2*0.9,40+Math.sqrt(mc.value)*1.3); rect(c,x2-mw/2,base-b-8-34,mw,34,F2>=mc.value*G?"#9fc9a5":"#d4a5a0",P.ink,2,4); T(c,F(mc.value,0)+" kg",x2,base-b-8-17,{size:12});
      T(c,"S₁ = "+F(s1.value,0)+" cm²",x1,gy+18,{size:12,color:P.grey}); T(c,"S₂ = "+F(s2.value,0)+" cm²",x2,gy+18,{size:12,color:P.grey});
      ro.set(0,fp(p)); ro.set(1,F(F2,0)+" N"); ro.set(2,F(d2,2)+" cm"); ro.set(3,F(W1,1)+" J = "+F(W2,1)+" J");
      var lifts=F2>=mc.value*G;
      nt.set("F₂ = F₁ × S₂/S₁ = "+F(f1.value,0)+" × "+F(s2.value/s1.value,0)+" = <b>"+F(F2,0)+" N</b>. Poids de la charge : "+F(mc.value*G,0)+" N : "+(lifts?"la charge est soulevée.":"la force est insuffisante, elle ne bouge pas.")+" Pour monter de "+F(d2,2)+" cm, il faut descendre de "+F(d1.value,0)+" cm.", lifts?"ok":"warn");
    });
  }
});

/* 4 · Pression atmosphérique */
function patm(p0,h){ return p0*Math.pow(1-2.25577e-5*h,5.25588); }
SFA.sim({
  id:"p3-c09-atmosphere", ch:"c09", tag:"Expérience",
  titre:"Le baromètre de Torricelli et l'altitude",
  resume:"Monte en altitude : la colonne de mercure descend. Avec de l'eau, il faudrait un tube de plus de 10 m !",
  but:"Règle l'altitude et la pression au niveau de la mer (météo). Lis la hauteur de la colonne de mercure ou d'eau.",
  aRetenir:"L'air a un poids : il exerce une pression, environ 101 300 Pa (1 013 hPa) au niveau de la mer. Ce n'est pas le vide qui « aspire » le mercure : la pression de l'air sur la cuvette pousse le liquide dans le tube, jusqu'à ce que ρ·g·h équilibre la pression atmosphérique : 760 mm de mercure ou 10,3 m d'eau. La pression diminue avec l'altitude.",
  piege:"1 013 hPa, ce sont environ 10 tonnes sur chaque m² ! On ne les sent pas car la pression s'exerce dans toutes les directions et de l'intérieur de notre corps. (Pression de l'air calculée avec un modèle d'atmosphère standard.)",
  build:function(k,S){
    var c = k.canvas(340);
    var alt = k.slider("Altitude",0,9000,100,0,"m");
    var p0 = k.slider("Pression au niveau de la mer (météo)",980,1040,1,1013,"hPa");
    var lq = k.seg("Liquide du baromètre",[["13595","Mercure"],["1000","Eau"]],"13595");
    var ro = k.readouts(["Pression atmosphérique","Hauteur de la colonne","Force de l'air sur 1 dm²"]);
    var nt = k.note("","");
    k.button("Botrange (≈ 700 m)",function(){ alt.set(700); }); k.button("Mont Blanc (≈ 4 800 m)",function(){ alt.set(4800); }); k.button("Everest (≈ 8 800 m)",function(){ alt.set(8800); });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, rho=+lq.value, p=patm(p0.value*100,alt.value), col=p/(rho*9.80665);
      var Hmax=rho>5000?1.0:12, top=26, bot=H-70, sc=(bot-top)/Hmax;
      var cx=W*0.3, tw=26;
      /* cuvette */
      rect(c,cx-70,bot,140,36,rho>5000?"rgba(150,160,175,.6)":"rgba(90,160,240,.35)",P.ink,2.5,6);
      /* tube */
      rect(c,cx-tw/2,top,tw,bot-top+10,"rgba(255,255,255,.35)",P.ink,2.5,0);
      rect(c,cx-tw/2+1,bot-col*sc,tw-2,col*sc+10,rho>5000?"rgba(150,160,175,.85)":"rgba(90,160,240,.55)");
      T(c,"vide",cx,top+Math.max(10,(bot-col*sc-top)/2),{size:12,color:P.grey});
      /* flèches de la pression de l'air sur la cuvette */
      [-45,0,45].forEach(function(dx){ D.arrow(c,cx+dx+ (dx===0?60:0),bot-30,cx+dx+(dx===0?60:0),bot-4,P.red,2.5); });
      T(c,"pression de l'air",cx+100,bot-34,{size:12,color:P.red,align:"left"});
      ln(c,[cx+tw/2,bot-col*sc],[cx+90,bot-col*sc],P.green,1.5,[4,3]); T(c,"h = "+(col<2?F(col*1000,0)+" mm":F(col,2)+" m"),cx+96,bot-col*sc,{size:13,color:P.green,align:"left"});
      /* échelle d'altitude à droite */
      var mx=W*0.8, my0=40, my1=H-40; ln(c,[mx,my1],[mx,my0],P.grey,2); var ay=my1-(my1-my0)*alt.value/9000;
      D.arrow(c,mx-26,ay,mx-6,ay,P.acc,2.5); T(c,F(alt.value,0)+" m",mx-30,ay,{size:12,color:P.acc,align:"right"});
      T(c,"9 000 m",mx+8,my0,{size:12,color:P.grey,align:"left"}); T(c,"0 m",mx+8,my1,{size:12,color:P.grey,align:"left"});
      ro.set(0,F(p/100,0)+" hPa"); ro.set(1,col<2?F(col*1000,0)+" mm":F(col,2)+" m"); ro.set(2,F(p*0.01,0)+" N");
      nt.set("p = ρ·g·h : h = "+F(p,0)+" / ("+F(rho,0)+" × 9,81) = <b>"+(col<2?F(col*1000,0)+" mm":F(col,2)+" m")+"</b> de "+(rho>5000?"mercure":"eau")+"."+(lq.value==="1000"?" Un tube de 11 m serait nécessaire : c'est pourquoi on utilise le mercure, 13,6 fois plus dense.":" À "+F(alt.value,0)+" m d'altitude, la pression a diminué de "+F((1-p/(p0.value*100))*100,0)+" % par rapport au niveau de la mer."),"ok");
    });
  }
});
})();
