/* Chapitre 10 · Poussée d'Archimède, flottaison, fluides en mouvement */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt, G=9.81;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function ln(c,a,b,col,w,dash){ D.line(c,a[0],a[1],b[0],b[1],col||"#3a4a60",w||3,dash); }
function spring(c,x,y0,y1,n,amp,col){ var g=c.ctx; g.save(); g.strokeStyle=col||P.ink; g.lineWidth=2; g.beginPath(); g.moveTo(x,y0); var s=(y1-y0); g.lineTo(x,y0+s*0.1); for (var i=0;i<n;i++){ var t=0.1+0.8*(i+0.5)/n; g.lineTo(x+(i%2?-amp:amp),y0+s*t); } g.lineTo(x,y0+s*0.9); g.lineTo(x,y1); g.stroke(); g.restore(); }
var LQ=[["0.92","Huile (0,92 g/cm³)"],["1.00","Eau douce (1,00 g/cm³)"],["1.03","Eau de mer (1,03 g/cm³)"],["1.24","Mer Morte (≈ 1,24 g/cm³)"],["13.6","Mercure (13,6 g/cm³)"]];
function liqCol(r){ return r>5?"rgba(150,160,175,.6)":r>1.1?"rgba(70,120,200,.42)":r<0.95?"rgba(235,200,60,.42)":"rgba(90,160,240,.32)"; }

/* 1 · Plongée d'un objet */
SFA.sim({
  id:"p3-c10-plongee", ch:"c10", tag:"Classique",
  titre:"Plonger un objet : poids, poussée, dynamomètre",
  resume:"Accroche un objet à un dynamomètre et plonge-le : la lecture diminue de la valeur de la poussée.",
  but:"Choisis la masse, le volume de l'objet et le liquide. Descends l'objet dans le liquide et lis le dynamomètre.",
  aRetenir:"Un corps plongé dans un fluide reçoit une poussée verticale, vers le haut, égale au poids du fluide déplacé : Π = ρ<sub>liquide</sub>·V<sub>immergé</sub>·g. Lecture du dynamomètre = P − Π. L'objet flotte si sa masse volumique est inférieure à celle du liquide.",
  piege:"La poussée ne dépend pas du poids de l'objet, mais du volume immergé et du liquide : un gros objet léger flotte, une petite bille de plomb coule. Flotter ne dépend pas de la masse seule, mais du rapport masse / volume.",
  build:function(k,S){
    var c = k.canvas(350);
    var m = k.slider("Masse de l'objet",50,1000,50,200,"g");
    var v = k.slider("Volume de l'objet",20,500,10,150,"cm³");
    var lq = k.select("Liquide",LQ,"1.00");
    var im = k.slider("Immersion de l'objet",0,100,5,0,"%");
    var ro = k.readouts(["Masse volumique de l'objet","Poussée Π","Lecture du dynamomètre","Verdict"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, rl=+lq.value, ro_=m.value/v.value, Pw=m.value/1000*G, f=im.value/100;
      var Pi=rl*v.value*f*G/1000, T_=Pw-Pi, floats=ro_<rl-1e-9, neutral=Math.abs(ro_-rl)<=1e-9, feq=Math.min(1,ro_/rl);
      var cx=W*0.34, top=26, by=H*0.42, bw=W*0.5, bh=H-by-26;
      rect(c,cx-bw/2,by,bw,bh,liqCol(rl),P.ink,2.5,6);
      var hs=Math.max(40,Math.min(90,20+Math.cbrt(v.value)*8)), ytop=by-hs*(1-f);       /* le sommet de l'objet */
      if (f===0) ytop=by-hs-30;
      ln(c,[cx,top-8],[cx,top+20],P.ink,3); spring(c,cx,top+20,Math.min(ytop-6,top+20+40+Math.min(1,Math.max(T_,0)/12)*30),6,8);
      var yb=Math.min(ytop-6,top+20+40+Math.min(1,Math.max(T_,0)/12)*30);
      ln(c,[cx,yb],[cx,ytop],P.ink,2);
      rect(c,cx-hs/2,ytop,hs,hs,ro_>rl?"#8d96a5":"#d9b98a",P.ink,2,3); T(c,F(m.value,0)+" g",cx,ytop+hs/2,{size:12,color:"#fff"});
      c.ctx.save(); c.ctx.fillStyle=liqCol(rl); c.ctx.fillRect(cx-bw/2+1,by,bw-2,Math.max(0,ytop+hs-by)>0?0:0); c.ctx.restore();
      /* forces */
      var s=Math.min(70/Math.max(Pw,0.01), 80); var Plen=Pw*s*0.55, Ilen=Pi*s*0.55;
      D.arrow(c,cx+hs/2+26,ytop+hs/2,cx+hs/2+26,ytop+hs/2+Math.min(90,Plen),P.red,3.5); T(c,"P",cx+hs/2+38,ytop+hs/2+Math.min(90,Plen)*0.7,{size:13,color:P.red,align:"left"});
      if (Pi>0.005){ D.arrow(c,cx+hs/2+56,ytop+hs/2,cx+hs/2+56,ytop+hs/2-Math.min(90,Ilen),P.green,3.5); T(c,"Π",cx+hs/2+68,ytop+hs/2-Math.min(90,Ilen)*0.6,{size:13,color:P.green,align:"left"}); }
      T(c,"Lecture "+(T_>0?F(T_,2):"0")+" N",W*0.8,60,{size:14,color:P.ink});
      ro.set(0,F(ro_,2)+" g/cm³"); ro.set(1,F(Pi,2)+" N"); ro.set(2,T_>0.005?F(T_,2)+" N":"0 N"); ro.set(3,neutral?"entre deux eaux":floats?"flotte":"coule");
      nt.set(neutral?"ρ objet = ρ liquide = "+F(rl,2)+" g/cm³ : la poussée équilibre exactement le poids quand l'objet est entièrement immergé. Il reste <b>entre deux eaux</b>.":floats?"ρ objet = "+F(ro_,2)+" &lt; ρ liquide = "+F(rl,2)+" : l'objet <b>flotte</b>. La lecture tombe à 0 quand "+F(feq*100,0)+" % du volume est immergé (là, Π = P). Si on pousse plus, le dynamomètre ne peut que se détendre : l'objet voudrait remonter.":"ρ objet = "+F(ro_,2)+" &gt; ρ liquide = "+F(rl,2)+" : l'objet <b>coule</b>. Même entièrement immergé, la poussée ("+F(rl*v.value*G/1000,2)+" N) est inférieure au poids ("+F(Pw,2)+" N).","ok");
    });
  }
});

/* 2 · Bateau en pâte à modeler */
SFA.sim({
  id:"p3-c10-bateau", ch:"c10", tag:"Défi",
  titre:"100 g de pâte à modeler : boule ou bateau ?",
  resume:"La même pâte, deux formes : la boule coule, la coque flotte. Combien peut-elle porter ?",
  but:"La pâte (masse volumique 1,6 g/cm³) est modelée en une coque carrée de côté L et de hauteur H. Cherche une coque qui flotte, puis ajoute une cargaison jusqu'au naufrage.",
  aRetenir:"Un objet flotte si la poussée qu'il peut recevoir, ρ·g·V<sub>immergé</sub>, équilibre son poids. Une coque creuse déplace beaucoup d'eau pour peu de matière : sa masse volumique moyenne (matière + air) devient inférieure à celle de l'eau. L'eau salée porte davantage que l'eau douce.",
  piege:"Ce n'est pas la matière qui change, mais le volume d'eau déplacé. Une boule de 100 g de pâte ne déplace que 62,5 cm³ d'eau, soit 62,5 g : elle coule. Modèle : coque en forme de pavé à parois fines, sans chavirage.",
  build:function(k,S){
    var c = k.canvas(330);
    var L = k.slider("Côté de la base L",2,12,0.5,6,"cm");
    var Hh = k.slider("Hauteur des bords H",0,6,0.5,3,"cm");
    var ch = k.slider("Cargaison",0,200,10,0,"g");
    var lq = k.seg("Liquide",[["1.00","Eau douce"],["1.03","Eau de mer"]],"1.00");
    var ro = k.readouts(["Masse totale à porter","Poussée maximale (coque pleine d'air)","Tirant d'eau","Franc-bord (bord – eau)"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, rl=+lq.value, M=100+ch.value;
      var Pmax=rl*L.value*L.value*Hh.value, d=M/(rl*L.value*L.value), floats=Hh.value>0 && d<=Hh.value+1e-9, fb=Hh.value-d;
      var e=62.5/(L.value*L.value+4*L.value*Hh.value)*10;      /* mm */
      var sc=Math.min(14,(W*0.6)/12), wl=H*0.5, tw=W*0.8, cx=W*0.5;
      rect(c,cx-tw/2,wl,tw,H-wl-14,liqCol(rl),null,0);
      var hw=L.value*sc, hh=Hh.value*sc, dd=floats?d*sc:Math.min(Hh.value,d)*sc;
      var yb = floats ? wl+dd : H-14;                             /* bas de la coque */
      if (Hh.value===0){ circ(c,cx,H-26,Math.cbrt(62.5*3/(4*Math.PI))*sc,"#c9854a",P.ink,2); T(c,"boule de pâte",cx,H-52,{size:12,color:P.grey}); }
      else {
        rect(c,cx-hw/2,yb-hh,hw,hh,"rgba(201,133,74,.55)","#8c5a22",3,2);
        if (ch.value>0){ rect(c,cx-hw*0.3,yb-Math.min(hh*0.8,d*sc+6+ch.value/20),hw*0.6,Math.min(hh*0.8,6+ch.value/20),"#6d7a8c",P.ink,1.5,2); }
        if (!floats){ T(c,"coule : l'eau entre dans la coque",cx,wl-20,{size:12,color:P.red}); }
      }
      ln(c,[cx-tw/2,wl],[cx+tw/2,wl],P.acc,2,[6,4]);
      ro.set(0,F(M,0)+" g ("+F(M*G/1000,2)+" N)"); ro.set(1,F(Pmax/1000*G*1,2)+" N"); ro.set(2,Hh.value>0?F(d,2)+" cm":"—"); ro.set(3,Hh.value>0?(fb>=0?F(fb,2)+" cm":"< 0 : l'eau entre"):"—");
      var msg;
      if (Hh.value===0) msg="Sans bords, la pâte ne déplace que son propre volume : 62,5 cm³ d'eau soit 62,5 g &lt; 100 g. <b>Elle coule.</b> Relève les bords !";
      else if (!floats) msg="<b>Naufrage.</b> Pour flotter, il faudrait déplacer "+F(M/rl,0)+" cm³ de liquide, mais la coque ne peut en déplacer que "+F(L.value*L.value*Hh.value,0)+" cm³ au maximum (L²·H). Agrandis la coque ou retire de la cargaison.";
      else msg="<b>Elle flotte.</b> Elle déplace M/ρ = "+F(M/rl,0)+" cm³, soit un tirant d'eau de "+F(d,2)+" cm. Marge restante : "+F(rl*L.value*L.value*Hh.value-M,0)+" g de cargaison en plus. Épaisseur des parois ≈ "+F(e,1)+" mm.";
      nt.set(msg,floats?"ok":"warn");
    });
  }
});

/* 3 · Ludion */
SFA.sim({
  id:"p3-c10-ludion", ch:"c10", tag:"Animation",
  titre:"Le ludion : presser la bouteille, plonger le plongeur",
  resume:"En pressant la bouteille, la bulle d'air du ludion se comprime : la poussée diminue, il descend.",
  but:"Appuie sur la bouteille (pression supplémentaire) et regarde le volume d'air, la poussée, le poids et le mouvement du ludion.",
  aRetenir:"Le ludion est une petite pipette qui contient de l'air et un peu d'eau. En pressant la bouteille, on augmente la pression dans l'eau, qui comprime la bulle d'air : de l'eau entre dans la pipette : le ludion (eau comprise) devient plus lourd alors que son volume extérieur, donc la poussée (constante ici, 13,7 mN), ne change pas : il coule. On relâche : la bulle se détend, il remonte. C'est le principe du sous-marin et de la vessie natatoire des poissons.",
  piege:"La poussée d'Archimède ne vient pas de l'air de la bouteille, mais du volume d'eau déplacé par la pipette (verre + bulle). Une fois descendu un peu, le ludion s'enfonce de plus en plus vite : plus la pression est grande en profondeur, plus la bulle rétrécit. (Modèle simplifié, air = gaz parfait à température constante.)",
  build:function(k,S){
    var c = k.canvas(350);
    var dp = k.slider("Pression de la main (en plus)",0,60,2,0,"kPa");
    var ro = k.readouts(["Volume d'air dans la pipette","Poids du ludion","Poussée d'Archimède","Bilan"]);
    var nt = k.note("","");
    var Vg=0.40, mg=0.90, Vc=1.00, Va0=0.62, p0=101.3, y=0, rho=1;       /* cm³, g, cm³, cm³, kPa */
    k.button("Replacer le ludion en haut",function(){ y=0; });
    function calc(){ var p=p0+dp.value+rho*G*y*1000/1000*1; var pk=p0+dp.value+9.81*y; var Va=Va0*p0/pk; if (Va>Vc) Va=Vc; var Vw=Vc-Va; var Pw=(mg+rho*Vw)*G, Pi=rho*(Vg+Vc)*G; return {Va:Va,Pw:Pw,Pi:Pi,net:Pi-Pw}; }
    var lp=k.loop(function(dt){ var r=calc(); var v=Math.max(-0.12,Math.min(0.12,-r.net*0.01*10)); /* m/s, négatif = monte */ y+=v*dt*(r.net<0?1:1); if (y<0) y=0; if (y>0.20) y=0.20; k.redraw(); });
    lp.play();
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, r=calc();
      var bx=W*0.14, bw=W*0.3, top=24, bh=H-60, sc=bh/0.24;
      /* bouteille */
      rect(c,bx,top,bw,bh,"rgba(90,160,240,.28)",P.ink,2.5,14); rect(c,bx+bw*0.3,top-12,bw*0.4,14,"#fff",P.ink,2,3);
      ln(c,[bx+8,top+bh*0.06],[bx+bw-8,top+bh*0.06],P.acc,1.5,[5,4]);
      /* main qui presse */
      if (dp.value>0){ var al=Math.min(1,dp.value/60); D.arrow(c,bx-34,top+bh*0.5,bx-4,top+bh*0.5,P.red,2+al*3); D.arrow(c,bx+bw+34,top+bh*0.5,bx+bw+4,top+bh*0.5,P.red,2+al*3); T(c,F(dp.value,0)+" kPa",bx+bw/2,top+bh+14,{size:12,color:P.red}); }
      /* ludion */
      var lx=bx+bw/2, ly=top+bh*0.06+8+y*sc;
      rect(c,lx-8,ly,16,38,"rgba(255,255,255,.7)",P.ink,2,6);                // pipette
      var ah=38*(r.Va/Vc); rect(c,lx-6,ly+2,12,ah-2,"#eaf3ff",null,0,4); rect(c,lx-6,ly+ah,12,38-ah-2,"rgba(90,160,240,.7)",null,0,3);
      T(c,"air",lx+34,ly+ah*0.4,{size:12,color:P.grey}); T(c,"eau",lx+34,ly+ah+(38-ah)*0.5,{size:12,color:P.grey});
      /* diagramme des forces */
      var gx=W*0.62, gy=H*0.5; T(c,"Forces sur le ludion (mN)",gx+60,24,{size:12,color:P.grey});
      var s=3.2; D.arrow(c,gx+30,gy,gx+30,gy+r.Pw*s,P.red,3.5); T(c,"P",gx+44,gy+r.Pw*s*0.5,{size:13,color:P.red,align:"left"});
      D.arrow(c,gx+90,gy,gx+90,gy-r.Pi*s+ (0),P.green,3.5); T(c,"Π",gx+104,gy-r.Pi*s*0.5,{size:13,color:P.green,align:"left"});
      T(c,F(r.Pw,2),gx+30,gy+r.Pw*s+14,{size:12,color:P.red}); T(c,F(r.Pi,2),gx+90,gy-r.Pi*s-10,{size:12,color:P.green});
      ro.set(0,F(r.Va,3)+" cm³"); ro.set(1,F(r.Pw,2)+" mN"); ro.set(2,F(r.Pi,2)+" mN"); ro.set(3,r.net>0.005?"monte":r.net<-0.005?"descend":"équilibre");
      nt.set(Math.abs(r.net)<=0.005?"Poussée et poids s'équilibrent ("+F(r.Pi,2)+" mN) : le ludion reste immobile (équilibre instable : la moindre variation de pression le fait monter ou descendre).":r.net>0?"Poussée "+F(r.Pi,2)+" mN &gt; poids "+F(r.Pw,2)+" mN : le ludion remonte vers la surface.":"Le poids ("+F(r.Pw,2)+" mN) dépasse la poussée ("+F(r.Pi,2)+" mN) : il descend. Relâche la pression : la bulle se détend et il remonte (le seuil est vers 24 kPa).","ok");
    });
  }
});

/* 4 · Portance d'une aile */
function CL(a){ return a<=14 ? 0.1*(a+2) : Math.max(0.5,1.6-0.12*(a-14)); }
SFA.sim({
  id:"p3-c10-aile", ch:"c10", tag:"Fluides en mouvement",
  titre:"Une aile d'avion : angle d'attaque, vitesse, décrochage",
  resume:"Incline l'aile et change la vitesse de l'air : la portance équilibre le poids, ou l'aile décroche.",
  but:"Règle l'angle d'attaque et la vitesse. Compare la portance au poids de l'avion (1 000 kg). Augmente l'angle jusqu'au décrochage.",
  aRetenir:"Un fluide en mouvement exerce des forces. Autour d'une aile inclinée, l'air est dévié vers le bas et accéléré au-dessus : où l'air va plus vite, la pression est plus basse. La différence de pression crée une force vers le haut, la portance, qui augmente avec la vitesse (≈ v²) et avec l'angle d'attaque, jusqu'au décrochage.",
  piege:"Un angle plus grand n'est pas toujours mieux : au-delà d'environ 14°, l'écoulement se détache de l'aile (turbulences) et la portance chute : c'est le décrochage. L'explication « l'air doit faire le même temps dessus et dessous » est fausse. (Modèle simplifié, allure des valeurs.)",
  build:function(k,S){
    var c = k.canvas(340);
    var al = k.slider("Angle d'attaque",-4,25,1,6,"°");
    var vv = k.slider("Vitesse de l'air",20,90,2,50,"m/s");
    var ro = k.readouts(["Coefficient de portance","Portance","Poids de l'avion","Vitesse de décrochage"]);
    var nt = k.note("","");
    var ph=0, dots=[]; for (var i=0;i<40;i++) dots.push([Math.random(),Math.random()]);
    var lp=k.loop(function(dt){ ph+=dt*vv.value/90*0.6; k.redraw(); }); lp.play();
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, a=al.value, v=vv.value, cl=CL(a), Wt=1000*G, Lift=0.5*1.225*v*v*16*cl, stall=a>14;
      var cx=W*0.4, cy=H*0.5, ch=Math.min(W*0.42,170);
      /* lignes de courant */
      c.ctx.save(); c.ctx.strokeStyle=stall?"#c9d3e6":"#9db8e0"; c.ctx.lineWidth=1.5;
      for (var j=-5;j<=5;j++){ if(j===0) continue; var y0=cy+j*18, up=j<0; c.ctx.beginPath();
        for (var x=10;x<=W-10;x+=6){ var u=(x-cx)/(ch*0.55); var bump=Math.exp(-u*u)*(up?(34-Math.abs(j)*3)*(0.6+0.05*(a+4)):10); var yy=y0+(up?-bump:bump*0.6); if (stall&&up&&u>0.2) yy+=Math.sin(x*0.15+ph*8+j)*5*Math.min(1,u); if(x===10) c.ctx.moveTo(x,yy); else c.ctx.lineTo(x,yy); }
        c.ctx.stroke(); }
      c.ctx.restore();
      /* aile (ellipse inclinée) */
      c.ctx.save(); c.ctx.translate(cx,cy); c.ctx.rotate(-a*Math.PI/180); c.ctx.fillStyle="#d3dae6"; c.ctx.strokeStyle=P.ink; c.ctx.lineWidth=2.5;
      c.ctx.beginPath(); c.ctx.ellipse(0,0,ch/2,13,0,0,6.2832); c.ctx.fill(); c.ctx.stroke(); c.ctx.restore();
      /* particules */
      for (var q=0;q<dots.length;q++){ var px=((dots[q][0]+ph*(q%3===0?1.25:1))%1)*(W-20)+10, row=Math.floor(dots[q][1]*10)-5; if(row===0) row=5; var y0b=cy+row*18, up2=row<0, u2=(px-cx)/(ch*0.55);
        var by=Math.exp(-u2*u2)*(up2?(34-Math.abs(row)*3)*(0.6+0.05*(a+4)):10), py=y0b+(up2?-by:by*0.6); circ(c,px,py,2.2,up2&&Math.abs(u2)<1&&!stall?P.red:"#4a74d9"); }
      /* portance */
      var ll=Math.min(110,Lift/Wt*60); if (Lift>50) D.arrow(c,cx,cy,cx,cy-ll,P.green,5); T(c,"portance",cx+10,cy-ll-6,{size:12,color:P.green,align:"left"});
      D.arrow(c,cx+50,cy,cx+50,cy+60,P.red,4); T(c,"poids",cx+58,cy+66,{size:12,color:P.red,align:"left"});
      T(c,W<460?"pression plus basse dessus":"pression plus basse au-dessus (air plus rapide)",cx,cy-62,{size:12,color:P.grey}); T(c,"vent relatif →  "+F(v,0)+" m/s",70,18,{size:12,color:P.acc});
      var vs=Math.sqrt(2*Wt/(1.225*16*1.6))*1;
      ro.set(0,F(cl,2)+(stall?" (décroché)":"")); ro.set(1,F(Lift/1000,1)+" kN"); ro.set(2,F(Wt/1000,1)+" kN"); ro.set(3,F(vs*3.6,0)+" km/h");
      var msg=stall?"<b>Décrochage :</b> au-delà de 14° l'écoulement se détache au-dessus de l'aile, la portance s'effondre (CL = "+F(cl,2)+").":Lift>Wt*1.02?"Portance ("+F(Lift/1000,1)+" kN) &gt; poids ("+F(Wt/1000,1)+" kN) : l'avion monte.":Lift<Wt*0.98?"Portance ("+F(Lift/1000,1)+" kN) &lt; poids : l'avion perd de l'altitude. Augmente la vitesse ou l'angle.":"Portance ≈ poids : vol en palier.";
      nt.set(msg,stall||Lift<Wt*0.98?"warn":"ok");
    });
  }
});
})();
