/* Chapitre 7 · La réaction chimique : transformation et conservation de la masse */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} }
function rng(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
var SUBD = "₀₁₂₃₄₅₆₇₈₉";
function sub(n){ return String(n).split("").map(function(d){ return SUBD[+d]; }).join(""); }
function gcd(a,b){ return b?gcd(b,a%b):a; }

/* ---------- 1 · Vase clos / vase ouvert ---------- */
SFA.sim({
  id:"c3-c07-lavoisier", ch:"c07", tag:"Expérience",
  titre:"Lavoisier : la masse mesurée, flacon fermé ou ouvert",
  resume:"Bicarbonate + vinaigre : le gaz formé s'échappe ou reste dans un ballon, et la balance le montre.",
  but:"Choisis la masse de bicarbonate, ferme (ballon) ou ouvre le flacon, puis lance la réaction. Lis la balance avant et après.",
  aRetenir:"Dans une transformation chimique, la masse totale se conserve : masse des réactifs consommés = masse des produits formés. Si la balance baisse, c'est qu'un produit gazeux s'est échappé : sa masse est la perte observée. Réaction : NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂.",
  piege:"« La masse a diminué, donc elle n'est pas conservée » est faux : le gaz est parti dans l'air. Les atomes ne sont ni créés ni détruits, ils sont réarrangés. (Dans la simulation, on néglige la poussée d'Archimède du ballon, et le vinaigre est en excès : 100 g de vinaigre à 5 % suffisent jusqu'à 7 g de bicarbonate. Masses molaires arrondies : Na 23, H 1, C 12, O 16.)",
  build:function(k,S){
    var c = k.canvas(330);
    var ms = k.slider("Masse de bicarbonate", 1, 7, 0.5, 4, "g");
    var md = k.seg("Flacon", [["clos","Fermé (ballon)"],["ouvert","Ouvert"]], "clos");
    var ro = k.readouts(["Balance avant","Balance maintenant","CO₂ formé","Avant − après"]);
    var nt = k.note("","");
    var p=0, R=rng(2), bub=[];
    var lp = k.loop(function(dt){ p=Math.min(1,p+dt/5); if(Math.random()<0.7) bub.push({x:R(),y:0,v:25+R()*40,life:1}); bub.forEach(function(b){ b.y+=b.v*dt; b.life-=dt*1.1; }); bub=bub.filter(function(b){return b.life>0;}); if(p>=1){ bub=[]; lp.pause(); } k.redraw(); });
    k.button("Lancer la réaction", function(){ p=0; lp.play(); }, true);
    k.button("Remettre à zéro", function(){ p=0; lp.pause(); bub=[]; });
    ms.el.addEventListener("input", function(){ p=0; });
    md.set && 0;
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, m=ms.value, base=180, M0=base+m, co2=m*44/84, open=md.value==="ouvert";
      var bal = open ? M0 - co2*p : M0;
      var fx=W*0.08, fw=W*0.38, fy=84, fh=H-166;
      // balance
      rr(c,fx-10,H-60,fw+20,36,"#cfd6e0","#6b7686",2,8); rr(c,fx+fw*0.2,H-54,fw*0.6,24,"#1e2a3a",null,0,4); T(c,F(bal,2)+" g",fx+fw/2,H-42,{size:14,color:"#7cf0a5"});
      // erlenmeyer
      g.save(); g.strokeStyle="#556"; g.lineWidth=3; g.beginPath(); g.moveTo(fx+fw*0.38,fy); g.lineTo(fx+fw*0.38,fy+fh*0.35); g.lineTo(fx,fy+fh); g.lineTo(fx+fw,fy+fh); g.lineTo(fx+fw*0.62,fy+fh*0.35); g.lineTo(fx+fw*0.62,fy); g.stroke(); g.restore();
      g.save(); g.beginPath(); g.moveTo(fx+fw*0.1,fy+fh*0.62); g.lineTo(fx+fw*0.9,fy+fh*0.62); g.lineTo(fx+fw*0.98,fy+fh-2); g.lineTo(fx+fw*0.02,fy+fh-2); g.closePath(); g.fillStyle="rgba(240,230,160,0.55)"; g.fill(); g.restore();
      bub.forEach(function(b){ var bx=fx+fw*0.15+b.x*fw*0.7, by=fy+fh*0.9-b.y*1.4; if(by>fy+fh*0.6) circ(c,bx,by,3,"rgba(255,255,255,"+b.life.toFixed(2)+")","#8aa0bf",1); });
      // ballon / gaz
      var vol=co2/44*24*p, r=4+Math.pow(Math.max(vol,0)/2,1/3)*34;
      if(!open){ circ(c,fx+fw/2,fy-6-r,r,"rgba(205,60,60,0.55)","#a33",2); D.line(c,fx+fw/2,fy-6,fx+fw/2,fy,"#a33",3); T(c,"ballon",fx+fw/2,fy-6-r,{size:12,color:"#fff"}); }
      else if(p>0&&p<1){ for(var i=0;i<4;i++){ var yy=fy-10-i*14-((Date.now()/60)%14); T(c,"CO₂",fx+fw/2+Math.sin(i*2+Date.now()/400)*10,yy,{size:12,color:P.grey}); } T(c,"gaz qui s'échappe",fx+fw/2,fy-70,{size:12,color:P.red}); }
      // tableau de bilan
      var tx=W*0.52, rows=[["NaHCO₃ consommé",m],["CH₃COOH consommé",m*60/84],["CH₃COONa formé",m*82/84],["H₂O formée",m*18/84],["CO₂ formé",co2]];
      T(c,"Bilan (masses en g)",tx,16,{size:12,color:P.ink,align:"left"});
      rows.forEach(function(r2,i){ T(c,r2[0],tx,38+i*20+(i>1?10:0),{size:12,color:i>1?P.green:P.acc,align:"left"}); T(c,F(r2[1]*(i===0||i===1?p:p),2),W-8,38+i*20+(i>1?10:0),{size:12,color:i>1?P.green:P.acc,align:"right"}); });
      T(c,"Réactifs : "+F((m+m*60/84)*p,2)+" g",tx,164,{size:12,color:P.ink,align:"left"}); T(c,"Produits : "+F((m*82/84+m*18/84+co2)*p,2)+" g",tx,182,{size:12,color:P.ink,align:"left"});
      T(c,"= masse conservée",tx,202,{size:12,color:P.green,align:"left"});
      ro.set(0,F(M0,2)+" g"); ro.set(1,F(bal,2)+" g"); ro.set(2,F(co2*p,2)+" g"); ro.set(3,F(M0-bal,2)+" g");
      nt.set(open?(p>=1?"Flacon ouvert : le CO₂ est parti dans l'air, la balance a perdu "+F(co2,2)+" g, exactement la masse du gaz formé. La masse totale (flacon + gaz échappé) est conservée.":"Flacon ouvert : le gaz s'échappe, la balance baisse."):"Flacon fermé : le CO₂ reste dans le ballon, la balance indique toujours "+F(M0,2)+" g. Rien n'est perdu.", open&&p>0?"warn":"ok");
    });
  }
});

/* ---------- 2 · Équilibrage ---------- */
var RX = [
 {n:"Synthèse de l'eau", sp:[["H₂",{H:2}],["O₂",{O:2}],["H₂O",{H:2,O:1}]], nr:2, sol:[2,1,2]},
 {n:"Synthèse de l'ammoniac", sp:[["N₂",{N:2}],["H₂",{H:2}],["NH₃",{N:1,H:3}]], nr:2, sol:[1,3,2]},
 {n:"Combustion du méthane", sp:[["CH₄",{C:1,H:4}],["O₂",{O:2}],["CO₂",{C:1,O:2}],["H₂O",{H:2,O:1}]], nr:2, sol:[1,2,1,2]},
 {n:"Combustion du propane", sp:[["C₃H₈",{C:3,H:8}],["O₂",{O:2}],["CO₂",{C:1,O:2}],["H₂O",{H:2,O:1}]], nr:2, sol:[1,5,3,4]},
 {n:"Rouille du fer", sp:[["Fe",{Fe:1}],["O₂",{O:2}],["Fe₂O₃",{Fe:2,O:3}]], nr:2, sol:[4,3,2]},
 {n:"Oxydation de l'aluminium", sp:[["Al",{Al:1}],["O₂",{O:2}],["Al₂O₃",{Al:2,O:3}]], nr:2, sol:[4,3,2]},
 {n:"Combustion du magnésium", sp:[["Mg",{Mg:1}],["O₂",{O:2}],["MgO",{Mg:1,O:1}]], nr:2, sol:[2,1,2]},
 {n:"Décomposition du chlorate de potassium", sp:[["KClO₃",{K:1,Cl:1,O:3}],["KCl",{K:1,Cl:1}],["O₂",{O:2}]], nr:1, sol:[2,2,3]},
 {n:"Sodium dans l'eau", sp:[["Na",{Na:1}],["H₂O",{H:2,O:1}],["NaOH",{Na:1,O:1,H:1}],["H₂",{H:2}]], nr:2, sol:[2,2,2,1]},
 {n:"Aluminium dans l'acide chlorhydrique", sp:[["Al",{Al:1}],["HCl",{H:1,Cl:1}],["AlCl₃",{Al:1,Cl:3}],["H₂",{H:2}]], nr:2, sol:[2,6,2,3]},
 {n:"Calcaire et acide chlorhydrique", sp:[["CaCO₃",{Ca:1,C:1,O:3}],["HCl",{H:1,Cl:1}],["CaCl₂",{Ca:1,Cl:2}],["H₂O",{H:2,O:1}],["CO₂",{C:1,O:2}]], nr:2, sol:[1,2,1,1,1]}
];
var ELC = {H:"#b6c4d8",O:"#f19a8f",N:"#8fb0f2",C:"#7f8794",Fe:"#c97b4f",Al:"#a9b4c1",Mg:"#b7d8a0",Na:"#a9a0e6",K:"#d6a0e6",Cl:"#7ed1a8",Ca:"#e6d28a"};
SFA.sim({
  id:"c3-c07-equilibrage", ch:"c07", tag:"Classique",
  titre:"Équilibrer une équation : compter les atomes de chaque côté",
  resume:"Ajuste les coefficients : le nombre d'atomes de chaque élément doit être le même avant et après la flèche.",
  but:"Choisis une réaction et règle les coefficients stœchiométriques. Les barres comptent les atomes à gauche et à droite : équilibre-les avec les plus petits coefficients entiers.",
  aRetenir:"Une équation est équilibrée quand chaque élément a le même nombre d'atomes à gauche et à droite : les atomes se conservent. On ajuste uniquement les <b>coefficients</b> placés devant les formules, avec les plus petits nombres entiers possibles.",
  piege:"On ne change jamais les <b>indices</b> d'une formule : H₂O est de l'eau, H₂O₂ est un autre corps. Un coefficient multiplie toute la formule : 3 H₂O contient 6 atomes H et 3 atomes O. Une équation équilibrée avec des coefficients ayant un diviseur commun (4, 2, 4) n'est pas minimale.",
  build:function(k,S){
    var c = k.canvas(0,{ratio:0.8});
    var rx = k.select("Réaction", RX.map(function(r,i){return [i,r.n];}), 0, function(){ setup(); });
    var sl=[]; for(var i=0;i<5;i++) sl.push(k.slider("Coefficient "+(i+1),1,8,1,1,""));
    var ro = k.readouts(["Équation","Bilan"]);
    var nt = k.note("","");
    function setup(){ var r=RX[+rx.value]; sl.forEach(function(s,i){ var d=s.el.parentNode; d.style.display=i<r.sp.length?"":"none"; var lab=d.querySelector("label span"); if(lab) lab.textContent="Coefficient devant "+(r.sp[i]?r.sp[i][0]:""); s.set(1); }); }
    setup();
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, r=RX[+rx.value], co=r.sp.map(function(s,i){ return sl[i].value; });
      var els=[]; r.sp.forEach(function(s){ Object.keys(s[1]).forEach(function(e){ if(els.indexOf(e)<0) els.push(e); }); });
      var L={},Rr={}; els.forEach(function(e){ L[e]=0; Rr[e]=0; });
      r.sp.forEach(function(s,i){ Object.keys(s[1]).forEach(function(e){ if(i<r.nr) L[e]+=co[i]*s[1][e]; else Rr[e]+=co[i]*s[1][e]; }); });
      var mx=1; els.forEach(function(e){ mx=Math.max(mx,L[e],Rr[e]); });
      var rowH=Math.min(40,(H-50)/els.length), x0=40, bw=(W-x0-14-40)/2-10, unit=Math.min(18,bw/Math.max(mx,6)), ok=true;
      T(c,"avant (réactifs)",x0+bw/2,12,{size:12,color:P.acc}); T(c,"après (produits)",x0+bw+36+bw/2,12,{size:12,color:P.green});
      els.forEach(function(e,j){ var y=30+j*rowH, eq=L[e]===Rr[e]; if(!eq) ok=false;
        T(c,e,18,y+rowH/2-4,{size:15,color:"#0f1b2d"}); 
        for(var u=0;u<L[e];u++) rr(c,x0+u*unit,y,unit-2,rowH-12,ELC[e]||"#aaa",null,0,3);
        for(u=0;u<Rr[e];u++) rr(c,x0+bw+36+u*unit,y,unit-2,rowH-12,ELC[e]||"#aaa",null,0,3);
        T(c,String(L[e])+(eq?" =":" ≠"),x0+bw+2,y+rowH/2-6,{size:13,color:eq?P.green:P.red,align:"left"});
        T(c,String(Rr[e]),x0+bw+36+Rr[e]*unit+4,y+rowH/2-6,{size:13,color:eq?P.green:P.red,align:"left"}); });
      var g0=co.reduce(function(a,b){return gcd(a,b);},0), min=g0===1;
      var cs=function(i){ return (co[i]===1?"":co[i]+" ")+r.sp[i][0]; };
      var eqn=r.sp.slice(0,r.nr).map(function(s,i){return cs(i);}).join(" + ")+" → "+r.sp.slice(r.nr).map(function(s,i){return cs(i+r.nr);}).join(" + ");
      ro.set(0,eqn); ro.set(1,ok?(min?"équilibrée ✓":"équilibrée, mais pas minimale (÷ "+g0+")"):"pas équilibrée");
      nt.set(ok?(min?"<b>Équation équilibrée</b> avec les plus petits coefficients entiers. Les atomes se conservent : rien ne se perd, rien ne se crée.":"Les atomes sont conservés, mais les coefficients ont un diviseur commun ("+g0+") : divise-les pour obtenir l'équation minimale."):"Compare les barres : "+els.filter(function(e){return L[e]!==Rr[e];}).map(function(e){return "<b>"+e+"</b> ("+L[e]+" ≠ "+Rr[e]+")";}).join(", ")+". Change un coefficient (pas un indice !).", ok&&min?"ok":"warn");
    });
  }
});

/* ---------- 3 · Combustion du magnésium ---------- */
SFA.sim({
  id:"c3-c07-magnesium", ch:"c07", tag:"Expérience",
  titre:"Combustion du magnésium : pourquoi la poudre blanche est plus lourde",
  resume:"Le magnésium brûle dans l'air : la masse du creuset augmente car il fixe du dioxygène.",
  but:"Règle la masse de magnésium, choisis un creuset ouvert ou une enceinte fermée contenant un volume d'air donné, puis fais avancer la combustion. Suis les masses de Mg, de O₂ et de MgO.",
  aRetenir:"2 Mg + O₂ → 2 MgO. Les masses se conservent : 3 g de magnésium fixent 2 g de dioxygène et donnent 5 g d'oxyde de magnésium. Dans un creuset ouvert, la masse mesurée augmente (le dioxygène venait de l'air). Dans une enceinte fermée, la masse totale est constante, et la combustion s'arrête quand le dioxygène est épuisé.",
  piege:"« La masse augmente, donc de la matière a été créée » est faux : le dioxygène de l'air est entré dans la matière solide. Modèle simplifié (M(Mg) = 24 g/mol, M(O) = 16 g/mol : rapport 3 : 2 : 5) ; l'air contient environ 0,28 g de dioxygène par litre à 20 °C.",
  build:function(k,S){
    var c = k.canvas(340);
    var ms = k.slider("Masse de magnésium", 0.5, 6, 0.5, 3, "g");
    var md = k.seg("Dispositif", [["ouvert","Creuset ouvert"],["clos","Enceinte fermée"]], "ouvert");
    var vs = k.slider("Volume d'air dans l'enceinte (si fermée)", 0.5, 5, 0.5, 2, "L");
    var av = k.slider("Avancement de la combustion", 0, 100, 1, 0, "%");
    var ro = k.readouts(["Mg qui brûle","O₂ consommé","MgO formé","Mg restant"]);
    var nt = k.note("","");
    var lp = k.loop(function(dt){ var v=av.value+dt*30; if(v>=100){ v=100; lp.pause(); } av.set(v); k.redraw(); });
    k.button("Enflammer", function(){ av.set(0); lp.play(); }, true);
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, m=ms.value, open=md.value==="ouvert", o2av=0.28*vs.value, mb=open?m:Math.min(m,1.5*o2av), p=av.value/100;
      var mgNow=m-mb*p, o2c=2/3*mb*p, mgo=5/3*mb*p, left=m-mb;
      // barres
      var bx=40, by=H-60, bh=H-110, mxv=Math.max(m*5/3,m+o2c,1)*1.05, sc=bh/mxv, bw=Math.min(40,(W*0.5)/3-10);
      D.line(c,bx-8,by,W-10,by,"#8a95a3",1.4);
      var bars=[["Mg",mgNow,"#9aa7ba"],["O₂ pris à l'air",o2c,"#f19a8f"],["MgO",mgo,"#e8e8e8"]];
      bars.forEach(function(b,i){ var x=bx+6+i*(bw+16); rr(c,x,by-b[1]*sc,bw,b[1]*sc,b[2],"#6b7686",1.5,3); T(c,F(b[1],2)+" g",x+bw/2,by-b[1]*sc-10,{size:12,color:P.ink}); T(c,b[0].replace(" pris à l'air",""),x+bw/2,by+14,{size:12,color:P.grey}); });
      // creuset / enceinte
      var cx=W*0.78, cy=H*0.5;
      g.save(); g.strokeStyle="#556"; g.lineWidth=3; if(open){ g.beginPath(); g.moveTo(cx-44,cy-34); g.lineTo(cx-32,cy); g.lineTo(cx+32,cy); g.lineTo(cx+44,cy-34); g.stroke(); } else { g.strokeRect(cx-48,cy-70,96,70); g.fillStyle="rgba(150,190,230,0.15)"; g.fillRect(cx-47,cy-69,94,68); }
      g.restore();
      T(c,open?"creuset (air libre)":"enceinte "+F(vs.value,1)+" L d'air",cx,cy+14,{size:12,color:P.grey});
      if(p>0.03&&p<0.97&&mb>0){ var gl=g; gl.save(); var gr=gl.createRadialGradient(cx,cy-16,2,cx,cy-16,46); gr.addColorStop(0,"rgba(255,255,255,0.95)"); gr.addColorStop(1,"rgba(255,255,255,0)"); gl.fillStyle=gr; gl.fillRect(cx-60,cy-80,120,90); gl.restore(); }
      else { circ(c,cx,cy-14,7+Math.min(15,(m*(1-p)+mgo*p)*1.5),p>0.5?"#f3f3f3":"#a8b3c2","#7b8592",1); }
      var reading = open ? m+o2c : m+o2av;  /* ouvert : creuset ; fermé : total enceinte (solide + air) */
      T(c,(open?"Masse du creuset : ":"Masse totale de l'enceinte : ")+F(open?m+o2c:m+o2av,2)+" g",W/2,14,{size:13,color:P.ink});
      ro.set(0,F(mb*p,2)+" g"); ro.set(1,F(o2c,2)+" g"); ro.set(2,F(mgo,2)+" g"); ro.set(3,F(mgNow,2)+" g");
      nt.set(open?"Creuset ouvert : "+F(m,2)+" g de Mg + "+F(o2c,2)+" g de O₂ = <b>"+F(m+o2c,2)+" g</b> dans le creuset. La masse a augmenté de "+F(o2c,2)+" g : c'est le dioxygène de l'air.":"Enceinte fermée : l'air contient "+F(o2av,2)+" g de O₂, ce qui permet de brûler au plus "+F(1.5*o2av,2)+" g de Mg. "+(left>0.001?"Il reste "+F(left,2)+" g de Mg : le dioxygène est épuisé, la combustion s'arrête. ":"Tout le Mg brûle. ")+"La masse totale reste <b>"+F(m+o2av,2)+" g</b>.", open?"ok":(left>0.001?"warn":"ok"));
    });
  }
});

/* ---------- 4 · Chimie en cuisine : le ballon ---------- */
var CIBLES = [0.5,1,1.5,2,3];
SFA.sim({
  id:"c3-c07-ballon", ch:"c07", tag:"Défi",
  titre:"Chimie en cuisine : gonfler un ballon avec du bicarbonate et du vinaigre",
  resume:"La quantité de gaz formé dépend du réactif qui s'épuise en premier.",
  but:"Règle la masse de bicarbonate et le volume de vinaigre. Observe le volume de CO₂ formé, le réactif qui s'épuise et celui qui reste. Relève le défi : gonfler le ballon au volume demandé.",
  aRetenir:"Les réactifs sont consommés dans des proportions fixes (NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂). Quand l'un des deux est épuisé, la réaction s'arrête : c'est le réactif limitant ; l'autre reste en excès. Le volume de gaz dépend du réactif limitant, pas du réactif en excès.",
  piege:"Mettre plus de vinaigre ne donne pas plus de gaz si le bicarbonate est épuisé (et réciproquement). Hypothèses : vinaigre à 5 % (masse d'acide = 5 % de la masse de vinaigre, 1 mL ≈ 1 g), gaz à 20 °C et 1 atm (24 L par mole), masses molaires arrondies (NaHCO₃ : 84 ; acide éthanoïque : 60 g/mol).",
  build:function(k,S){
    var c = k.canvas(320);
    var mb = k.slider("Masse de bicarbonate", 0, 20, 0.25, 3.5, "g");
    var vv = k.slider("Volume de vinaigre (5 %)", 50, 500, 10, 100, "mL");
    var ro = k.readouts(["CO₂ formé","Volume de gaz","Réactif limitant","Reste"]);
    var nt = k.note("","");
    var ci=0, dn = k.note("","warn");
    k.button("Défi suivant", function(){ ci=(ci+1)%CIBLES.length; }, true);
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, nb=mb.value/84, na=0.05*vv.value/60, n=Math.min(nb,na), V=24*n, mco2=44*n;
      var lim = Math.abs(nb-na)<1e-9?"les deux":(nb<na?"bicarbonate":"vinaigre (acide)");
      var rest = nb<na ? "acide : "+F((na-nb)*60,1)+" g" : (nb>na ? "bicarbonate : "+F((nb-na)*84,1)+" g" : "rien");
      // flacon
      var fx=W*0.1, fw=W*0.28, fy=H*0.48, fh=H*0.42;
      g.save(); g.strokeStyle="#556"; g.lineWidth=3; g.beginPath(); g.moveTo(fx+fw*0.36,fy); g.lineTo(fx+fw*0.36,fy+fh*0.3); g.lineTo(fx,fy+fh); g.lineTo(fx+fw,fy+fh); g.lineTo(fx+fw*0.64,fy+fh*0.3); g.lineTo(fx+fw*0.64,fy); g.stroke(); g.restore();
      g.save(); g.fillStyle="rgba(240,230,160,0.55)"; g.beginPath(); g.moveTo(fx+fw*0.08,fy+fh*0.7); g.lineTo(fx+fw*0.92,fy+fh*0.7); g.lineTo(fx+fw*0.99,fy+fh-2); g.lineTo(fx+fw*0.01,fy+fh-2); g.closePath(); g.fill(); g.restore();
      var r=3+Math.pow(V/ (4/3*Math.PI*0.001),1/3)*0.0; /* rayon en cm via V (L) : V = 4/3 π r³ (r en dm) */
      var rcap=Math.min(W*0.17,H*0.34), ppd=rcap/1.11, rdm=Math.pow(3*V/(4*Math.PI),1/3), rpx=rdm*ppd; 
      circ(c,fx+fw/2+W*0.17,fy-4-rpx*0.6,Math.max(rpx,3),"rgba(205,60,60,0.5)","#a33",2);
      D.line(c,fx+fw/2,fy,fx+fw/2+W*0.17-rpx*0.3,fy-6,"#a33",3);
      T(c,F(V,2)+" L",fx+fw/2+W*0.17,fy-4-rpx*0.6,{size:13,color:"#fff"});
      // cible
      var tg=CIBLES[ci], ok=Math.abs(V-tg)<=0.04;
      var tr=Math.pow(3*tg/(4*Math.PI),1/3)*ppd; g.save(); g.setLineDash([5,4]); g.strokeStyle=P.green; g.lineWidth=2; g.beginPath(); g.arc(fx+fw/2+W*0.17,fy-4-rpx*0.6,Math.max(tr,3),0,6.28); g.stroke(); g.restore();
      T(c,"cible "+F(tg,1)+" L",W-10,16,{size:12,color:P.green,align:"right"});
      // barres de quantités
      var bx=W*0.64, bwid=W*0.32, bh=14, mx=Math.max(nb,na,0.01)*1.1;
      T(c,"quantités (relatif)",bx+bwid/2,H*0.30,{size:12,color:P.grey});
      rr(c,bx,H*0.42,bwid*nb/mx,bh,P.acc,null,0,3); T(c,"NaHCO₃",bx,H*0.42-8,{size:12,color:P.acc,align:"left"});
      rr(c,bx,H*0.60,bwid*na/mx,bh,P.amber,null,0,3); T(c,"CH₃COOH",bx,H*0.60-8,{size:12,color:P.amber,align:"left"});
      ro.set(0,F(mco2,2)+" g"); ro.set(1,F(V,2)+" L"); ro.set(2,mb.value===0?"—":lim); ro.set(3,mb.value===0?"—":rest);
      nt.set(mb.value===0?"Ajoute du bicarbonate.":"n(bicarbonate) = "+F(mb.value,2)+" ÷ 84 = "+F(nb,4)+" mol ; n(acide) = 0,05 × "+vv.value+" ÷ 60 = "+F(na,4)+" mol. Le plus petit est limitant : "+F(n,4)+" mol de CO₂ × 24 L/mol = <b>"+F(V,2)+" L</b>.","");
      dn.set("<b>Défi :</b> gonfle le ballon à <b>"+F(tg,1)+" L</b> (±0,04 L)."+(ok?" ✓ Réussi !"+(Math.abs(nb-na)/Math.max(nb,na)>0.15?" (Mais il reste beaucoup de réactif inutile : essaie de limiter le gaspillage.)":""):""), ok?"ok":"warn");
    });
  }
});
})();
