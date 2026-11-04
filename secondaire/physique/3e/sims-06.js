/* Chapitre 6 · Puissance, énergie et sécurité */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function ln(c,a,b,col,w,dash){ D.line(c,a[0],a[1],b[0],b[1],col||"#3a4a60",w||3,dash); }

/* 1 · Compteur et facture */
var APP=[["Ampoule LED",9,5],["Ampoule à incandescence",60,0],["Télévision",100,3],["Ordinateur portable",50,4],["Bouilloire",2000,0.3],["Sèche-cheveux",1800,0.1]];
SFA.sim({
  id:"p3-c06-facture", ch:"c06", tag:"Classique",
  titre:"Du watt au kWh : calcule ta facture d'électricité",
  resume:"Règle le temps d'utilisation de chaque appareil : lis l'énergie du mois et le coût.",
  but:"Pour chaque appareil, règle la durée d'utilisation par jour. Observe quels appareils pèsent le plus sur la consommation d'énergie et sur la facture.",
  aRetenir:"Énergie E = P × t. Avec P en kW et t en h, E s'exprime en kWh (1 kWh = 1 kW pendant 1 h = 3,6 MJ). Un appareil puissant utilisé peu de temps peut consommer autant qu'un petit appareil utilisé longtemps.",
  piege:"Le watt est une puissance (un rythme) ; le kWh est une énergie (une quantité) : le compteur mesure des kWh, pas des kW. Prix du kWh réglable : valeur d'exemple, à vérifier sur ta facture.",
  build:function(k,S){
    var c = k.canvas(330);
    var sl = APP.map(function(a){ return k.slider(a[0]+" ("+F(a[1],0)+" W)", 0, a[1]>=1000?3:12, a[1]>=1000?0.1:0.5, a[2], "h/jour"); });
    var pr = k.slider("Prix du kWh (exemple)", 0.15, 0.50, 0.01, 0.30, "€");
    var ro = k.readouts(["Énergie par mois","Coût par mois"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      var E=APP.map(function(a,i){ return a[1]*sl[i].value*30/1000; });
      var tot=E.reduce(function(x,y){return x+y;},0), mx=Math.max(20,Math.max.apply(null,E)*1.15);
      var L=Math.min(170,W*0.45), rowH=(H-50)/APP.length;
      APP.forEach(function(a,i){ var y=20+i*rowH+rowH/2; T(c,a[0],L-8,y,{size:12,align:"right"});
        var w=(W-L-70)*E[i]/mx; rect(c,L,y-9,Math.max(1,w),18,i===4||i===5?P.red:P.acc); T(c,F(E[i],1)+" kWh",L+w+6,y,{size:12,align:"left",color:P.ink}); });
      T(c,"énergie sur 30 jours (kWh)",W/2,H-14,{size:12,color:P.grey});
      ro.set(0,F(tot,1)+" kWh"); ro.set(1,F(tot*pr.value,2)+" €");
      var im=E.indexOf(Math.max.apply(null,E));
      nt.set(tot>0?"Plus gros poste : <b>"+APP[im][0]+"</b> ("+F(E[im],1)+" kWh, soit "+F(E[im]/tot*100,0)+" % du total). Ex. : bouilloire 2 000 W × 0,3 h × 30 = 18 kWh.":"Règle au moins une durée.","ok");
    });
  }
});

/* 2 · Fusible / disjoncteur */
var APP2=[["Lampe",60],["Téléviseur",120],["Aspirateur",1000],["Bouilloire",2200],["Radiateur",2000],["Four",2500]];
SFA.sim({
  id:"p3-c06-disjoncteur", ch:"c06", tag:"Sécurité",
  titre:"Surcharge d'une prise : le disjoncteur déclenche",
  resume:"Branche des appareils sur le même circuit : l'intensité totale monte jusqu'au déclenchement.",
  but:"Allume des appareils sur un même circuit 230 V. Observe l'intensité totale, comparée au calibre du disjoncteur.",
  aRetenir:"Les appareils d'une maison sont en dérivation sous 230 V : leurs intensités s'additionnent, I = P / U pour chacun. Un circuit protégé par un disjoncteur de 16 A supporte au maximum 230 × 16 = 3 680 W. Au-delà, le disjoncteur coupe pour éviter un échauffement dangereux des fils.",
  piege:"Une multiprise ne crée pas de puissance : brancher quatre gros appareils sur un seul circuit provoque la même surcharge. Ne jamais remplacer un fusible par un calibre plus grand ou par un fil : les câbles chaufferaient sans protection.",
  build:function(k,S){
    var c = k.canvas(300);
    var tg = APP2.map(function(a,i){ return k.toggle(a[0]+" ("+F(a[1],0)+" W)", i<2); });
    var cal = k.seg("Calibre du disjoncteur", [["10","10 A"],["16","16 A"],["20","20 A"]], "16");
    var ro = k.readouts(["Puissance totale","Intensité totale","Seuil de coupure"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, Pt=0;
      APP2.forEach(function(a,i){ if (tg[i].value) Pt+=a[1]; });
      var I=Pt/230, C=+cal.value, trip=I>C;
      var x0=40,x1=W-30, y=H/2+20;
      var max=Math.max(25,I*1.1);
      rect(c,x0,y-18,x1-x0,36,"#edf0f4","#d3d9e2",1,8);
      rect(c,x0,y-18,(x1-x0)*Math.min(1,I/max),36,trip?P.red:I>C*0.8?P.amber:P.green,null,0,8);
      var cx=x0+(x1-x0)*C/max; ln(c,[cx,y-36],[cx,y+36],P.ink,3); T(c,"calibre "+C+" A",cx,y-46,{size:12});
      T(c,"0",x0,y+34,{size:12,color:P.grey}); T(c,F(max,0)+" A",x1,y+34,{size:12,color:P.grey,align:"right"});
      var bwid=(x1-x0)*Math.min(1,I/max); if (bwid>70) T(c,F(I,1)+" A",x0+bwid-32,y,{size:14,color:"#fff"}); else T(c,F(I,1)+" A",x0+bwid+32,y,{size:14,color:P.ink});
      /* disjoncteur */
      rect(c,W/2-60,18,120,40,trip?"#fbe1dc":"#ecf6f1",trip?P.red:P.green,2,8);
      T(c,trip?"DISJONCTEUR : COUPÉ":"disjoncteur : fermé",W/2,38,{size:13,color:trip?P.red:P.green});
      ro.set(0,F(Pt,0)+" W"); ro.set(1,F(I,1)+" A"); ro.set(2,F(230*C,0)+" W");
      nt.set(trip?"<b>Surcharge :</b> "+F(I,1)+" A &gt; "+C+" A. Le disjoncteur coupe le circuit. Il faut débrancher des appareils puis le réarmer. (En réalité la coupure peut prendre de quelques secondes à quelques minutes selon le dépassement.)":"Intensité totale : "+F(Pt,0)+" W / 230 V = "+F(I,1)+" A, inférieure à "+C+" A : le circuit fonctionne.",trip?"warn":"ok");
    });
  }
});

/* 3 · Effet Joule */
SFA.sim({
  id:"p3-c06-joule", ch:"c06", tag:"Chaleur",
  titre:"L'effet Joule : un fil qui chauffe",
  resume:"Fais varier l'intensité, la résistance et le temps : la température du fil monte.",
  but:"Règle l'intensité I, la résistance R du fil et la durée. Observe la puissance dissipée P = R·I², l'énergie et l'échauffement d'un fil de cuivre de 10 g.",
  aRetenir:"Un courant dans un conducteur dégage de la chaleur : P = R·I² (effet Joule), E = R·I²·t. Doubler l'intensité multiplie la chaleur par 4. C'est utile (bouilloire, grille-pain) mais dangereux dans un câble trop fin ou surchargé.",
  piege:"La chaleur dépend du carré de I : 20 A chauffent 4 fois plus que 10 A, pas 2 fois. Modèle simplifié : toute la chaleur reste dans le fil (aucune perte vers l'air), valable seulement quelques secondes.",
  build:function(k,S){
    var c = k.canvas(300);
    var I = k.slider("Intensité", 0, 20, 0.5, 10, "A");
    var R = k.slider("Résistance du fil", 0.1, 5, 0.1, 1, "Ω");
    var t = k.slider("Durée", 0, 60, 1, 10, "s");
    var ro = k.readouts(["Puissance dissipée","Énergie dissipée","Température du fil"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      var Pw=R.value*I.value*I.value, Q=Pw*t.value, dT=Q/(0.010*385), Tf=20+dT, melt=Tf>=1085;
      var Tc=Math.min(Tf,1085);
      /* couleur du fil : gris -> rouge sombre -> orange -> jaune */
      var col = Tc<300?"#8a95a3":Tc<550?"#9a6b64":Tc<750?"#b4302a":Tc<950?"#ee6a1f":"#ffc83d";
      var y=H/2-10, x0=40, x1=W-40;
      if (Tc>500){ var gr=c.ctx.createLinearGradient(0,y-40,0,y+40); gr.addColorStop(0,"rgba(255,120,40,0)"); gr.addColorStop(.5,"rgba(255,120,40,"+Math.min(0.5,(Tc-500)/1000)+")"); gr.addColorStop(1,"rgba(255,120,40,0)"); c.ctx.fillStyle=gr; c.ctx.fillRect(x0-10,y-40,x1-x0+20,80); }
      c.ctx.save(); c.ctx.strokeStyle=col; c.ctx.lineWidth=7; c.ctx.lineCap="round"; c.ctx.beginPath();
      if (melt){ c.ctx.moveTo(x0,y); c.ctx.lineTo((x0+x1)/2-14,y); c.ctx.moveTo((x0+x1)/2+14,y+8); c.ctx.lineTo(x1,y+8); }
      else { c.ctx.moveTo(x0,y); for (var i=0;i<=40;i++){ var xx=x0+(x1-x0)*i/40; c.ctx.lineTo(xx,y+Math.sin(i*0.9)*8); } }
      c.ctx.stroke(); c.ctx.restore();
      if (melt) T(c,"le fil a fondu",W/2,y+36,{size:13,color:P.red});
      /* thermomètre */
      var bx=W-24; rect(c,x0,H-52,x1-x0,12,"#e9edf2"); rect(c,x0,H-52,(x1-x0)*Math.min(1,Tc/1085),12,Tc>750?P.red:P.amber);
      T(c,"température du fil : 20 °C → 1 085 °C (fusion du cuivre)",W/2,H-26,{size:12,color:P.grey});
      ro.set(0,F(Pw,0)+" W"); ro.set(1,F(Q,0)+" J"); ro.set(2,melt?"≥ 1 085 °C":F(Tf,0)+" °C");
      nt.set(Pw===0?"Aucun courant, aucune chaleur.":"Chaleur dégagée : E = R·I²·t = "+F(R.value,1)+" × "+F(I.value,1)+"² × "+F(t.value,0)+" = "+F(Q,0)+" J. Pour échauffer 10 g de cuivre (385 J/kg/K) : ΔT = E / (m·c) "+(melt?"dépasserait "+F(1085-20,0)+" °C : le cuivre atteint 1 085 °C et fond (le calcul n'est plus valable après la fusion). Un fusible fonctionne ainsi.":"= "+F(dT,0)+" °C."),melt?"warn":"ok");
    });
  }
});

/* 4 · Défaut à la terre */
SFA.sim({
  id:"p3-c06-terre", ch:"c06", tag:"Niche utile",
  titre:"Défaut d'isolement : terre et différentiel",
  resume:"Un fil de phase touche le boîtier métallique d'un appareil : que se passe-t-il selon la protection ?",
  but:"Un défaut met le boîtier sous tension. Active ou non le fil de terre, le disjoncteur différentiel 30 mA, et fais toucher (ou non) le boîtier. Regarde la tension, le courant dans le corps, le déclenchement.",
  aRetenir:"Le fil de terre relie le boîtier au sol : en cas de défaut, un courant de fuite s'écoule par la terre et le disjoncteur différentiel (30 mA) le détecte et coupe en moins de 0,3 s. Avec une prise de terre ordinaire (quelques dizaines d'ohms), ni fusible ni disjoncteur classique ne déclenchent : seul le différentiel protège. Plus de 30 mA dans le corps humain est dangereux.",
  piege:"Le fil de terre seul ne coupe pas l'alimentation : le boîtier peut rester dangereusement sous tension. Un fusible ou disjoncteur classique (16 A) ne protège pas des personnes : une fuite de 0,1 A ne le fait pas déclencher. (Modèle simplifié d'une installation belge ; valeurs d'ordre de grandeur.)",
  build:function(k,S){
    var c = k.canvas(320);
    var terre = k.toggle("Fil de terre relié au boîtier", true);
    var diff = k.toggle("Disjoncteur différentiel 30 mA", false);
    var touch = k.toggle("Une personne touche le boîtier", true);
    var peau = k.seg("Peau", [["3000","Sèche (≈ 3 kΩ)"],["1000","Mouillée (≈ 1 kΩ)"]], "3000");
    var ra = k.slider("Résistance de la prise de terre", 5, 100, 5, 30, "Ω");
    var ro = k.readouts(["Tension du boîtier","Courant dans le corps","Courant de fuite total","Différentiel"]);
    var nt = k.note("","");
    var U=230, RB=2;
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      var Rb=+peau.value, Ra=ra.value, t=touch.value, e=terre.value;
      var Rpar, Itot, Uc, Ib;
      if (e && t){ Rpar=Ra*Rb/(Ra+Rb); Itot=U/(RB+Rpar); Uc=Itot*Rpar; Ib=Uc/Rb; }
      else if (e){ Itot=U/(RB+Ra); Uc=Itot*Ra; Ib=0; }
      else if (t){ Itot=U/(RB+Rb); Uc=Itot*Rb; Ib=Itot; }
      else { Itot=0; Uc=U; Ib=0; }
      var tripD = diff.value && Itot>=0.03;
      var tripF = Itot>16;
      var cut = tripD||tripF;
      /* dessin */
      var gy=H-50; ln(c,[20,gy],[W-20,gy],"#8a6d3b",4); T(c,"sol",W-30,gy+16,{size:12,color:P.grey});
      var bx=W*0.18, bw=W*0.30, by=60, bh=130;
      rect(c,bx,by,bw,bh,"#dde3ec",P.ink,2.5,10); T(c,"lave-linge",bx+bw/2,by+bh/2+10,{size:12,color:P.grey}); T(c,"boîtier métallique",bx+bw/2,by-10,{size:12,color:P.grey});
      /* défaut */
      ln(c,[bx-30,by+30],[bx+10,by+30],P.red,3); T(c,"phase 230 V",bx-30,by+16,{size:12,color:P.red,align:"left"}); T(c,"⚡ défaut",bx+30,by+30,{size:12,color:P.red,align:"left"});
      if (e){ ln(c,[bx+bw/2,by+bh],[bx+bw/2,gy],P.green,3,[6,4]); T(c,"terre",bx+bw/2+22,by+bh+30,{size:12,color:P.green}); }
      /* personne */
      if (t){ var px=W*0.72; circ(c,px,by+60,12,"#f3d6b8",P.ink,2); ln(c,[px,by+72],[px,by+130],P.ink,3); ln(c,[px,by+130],[px-14,gy],P.ink,3); ln(c,[px,by+130],[px+14,gy],P.ink,3); ln(c,[px,by+85],[bx+bw,by+90],P.ink,3); }
      /* différentiel */
      rect(c,W*0.52,16,110,32,diff.value?(cut?"#fbe1dc":"#ecf6f1"):"#eef0f3",diff.value?(cut?P.red:P.green):P.grey,2,6);
      T(c,diff.value?(tripD?"différentiel : COUPÉ":"différentiel 30 mA"):"pas de différentiel",W*0.52+55,32,{size:12,color:diff.value?(tripD?P.red:P.green):P.grey});
      var tc = cut?"0 V (coupé)":F(Uc,0)+" V";
      ro.set(0,cut?(tripD?"coupé en < 0,3 s":"coupé (disjoncteur)"):tc); ro.set(1,Ib>0?F(Ib*1000,0)+" mA":"0 mA"); ro.set(2,Itot>0?(Itot>1?F(Itot,1)+" A":F(Itot*1000,0)+" mA"):"0"); ro.set(3,diff.value?(Itot>=0.03?"déclenche":"ne déclenche pas"):"absent");
      var msg, kind;
      if (tripD){ msg="Le différentiel mesure une fuite de "+(Itot>1?F(Itot,1)+" A":F(Itot*1000,0)+" mA")+" (≥ 30 mA) et <b>coupe</b> en moins de 0,3 s : la personne n'est pas en danger prolongé."; kind="ok"; }
      else if (tripF){ msg="Le courant de défaut ("+F(Itot,1)+" A) dépasse 16 A : le disjoncteur ordinaire coupe aussi, grâce à une prise de terre de faible résistance."; kind="ok"; }
      else if (Ib>0.03){ msg="<b>Danger de mort :</b> "+F(Ib*1000,0)+" mA traversent le corps (&gt; 30 mA) et aucune protection ne coupe"+(e?" (le fil de terre dérive une partie du courant mais le boîtier reste à "+F(Uc,0)+" V ; le courant de défaut, "+F(Itot,1)+" A, est inférieur à 16 A : le disjoncteur ordinaire ne déclenche pas)":"")+"."; kind="warn"; }
      else if (!t && !e){ msg="Le boîtier est à 230 V mais aucun courant ne circule : le danger est <b>caché</b>, il se déclenchera au premier contact."; kind="warn"; }
      else if (!t && e){ msg="Sans personne : un courant de défaut de "+F(Itot,1)+" A passe par la terre, le boîtier reste à "+F(Uc,0)+" V, et le disjoncteur ordinaire (16 A) ne coupe pas. Il faut un différentiel."; kind="warn"; }
      else { msg="Courant dans le corps : "+F(Ib*1000,0)+" mA."; kind="warn"; }
      nt.set(msg,kind);
    });
  }
});
})();
