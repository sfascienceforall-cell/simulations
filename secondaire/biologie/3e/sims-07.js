(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function es(T){ return .6108*Math.exp(17.27*T/(T+237.3)); }

/* ===== 1 · Coupe de feuille ===== */
SFA.sim({
  id:"b3-c07-coupe-feuille", ch:"c07", tag:"Classique · tombe souvent",
  titre:"Coupe de feuille : à chaque tissu sa fonction",
  resume:"Touche un tissu de la coupe : nom, rôle, et lumière qui l'atteint.",
  but:"Choisis un tissu (en le touchant ou avec les boutons). Règle l'éclairement et lis la lumière reçue et absorbée dans ce tissu.",
  aRetenir:"Épiderme supérieur transparent (protège, laisse passer la lumière) ; parenchyme palissadique : cellules allongées, riches en chloroplastes, serrées, sous la lumière ; parenchyme lacuneux : cellules lâches séparées par des méats (l'air circule) ; épiderme inférieur : stomates ; nervures : xylème (eau et sels minéraux montent) et phloème (sève élaborée : sucres).",
  piege:"Les stomates ne sont pas des poils : ce sont des ouvertures entre deux cellules de garde. Le xylème amène l'eau (sève brute) vers la feuille ; le phloème emporte les sucres fabriqués. (Épaisseurs et absorption : ordres de grandeur d'une feuille de hêtre.)",
  build:function(k,S){
    var c = k.canvas(350);
    var L = [
      {id:"epi",n:"Épiderme supérieur",y0:0,y1:22,a:.001,col:"#cfe8c2",txt:"Une seule couche de cellules transparentes, recouverte d'une cuticule cireuse imperméable. Elle protège et laisse passer la lumière."},
      {id:"pal",n:"Parenchyme palissadique",y0:22,y1:100,a:.015,col:"#4f9a5c",txt:"Cellules allongées et serrées, très riches en chloroplastes : c'est ici que la photosynthèse est la plus intense. Placées près de la lumière."},
      {id:"lac",n:"Parenchyme lacuneux",y0:100,y1:180,a:.008,col:"#8cc48a",txt:"Cellules arrondies et lâches, séparées par des méats (espaces remplis d'air) : l'air circule jusqu'aux cellules ; elles contiennent moins de chloroplastes."},
      {id:"epb",n:"Épiderme inférieur (stomates)",y0:180,y1:200,a:.001,col:"#cfe8c2",txt:"Percé de stomates : ouvertures bordées de deux cellules de garde, par où entrent et sortent CO₂, O₂ et vapeur d'eau."}
    ];
    var sel = k.seg("Tissu", [["epi","Épiderme sup."],["pal","Palissadique"],["lac","Lacuneux"],["epb","Épiderme inf."]], "pal");
    var ec = k.slider("Éclairement (plein soleil = 100 %)", 10, 100, 5, 100, "%");
    var ro = k.readouts(["Lumière qui arrive au tissu","Lumière absorbée dans le tissu","Lumière qui traverse la feuille"]);
    var nt = k.note("","");
    var Y0 = 40, SC = 1.0;
    function remaining(z){ var I = 1, i; for (i=0;i<L.length;i++){ var a = L[i], len = Math.max(0,Math.min(z,a.y1)-a.y0); I *= Math.exp(-a.a*len); } return I; }
    c.pointer(function(type,p){ if (type!=="down") return; var z = (p.y - Y0)/SC; L.forEach(function(l){ if (z>=l.y0 && z<l.y1){ sel.set(l.id); k.redraw(); } }); });
    k.draw(function(){
      c.clear(); var g = c.ctx, W = c.W, x0 = 30, x1 = W-30, cur = sel.value, i;
      T(c,"lumière",x0+40,12,{size:12,color:P.amber}); for (i=0;i<4;i++){ D.arrow(c,x0+20+(x1-x0-130)*i/3,22,x0+20+(x1-x0-130)*i/3,36,P.yellow,2.5); }
      L.forEach(function(l){
        var ya = Y0 + l.y0*SC, yb = Y0 + l.y1*SC, on = l.id===cur;
        rect(c,x0,ya,x1-x0,yb-ya,l.col,on?P.violet:"#5a7a60",on?3.5:1);
        if (l.id==="pal"){ for (var j=0;j<9;j++){ var cx = x0+14+(x1-x0-28)*(j+.5)/9; rect(c,cx-9,ya+4,18,yb-ya-8,"#6bb273","#2e6b55",1,8); for (var q=0;q<4;q++) circ(c,cx-4+(q%2)*8,ya+16+q*14,2.8,"#1d5a33"); } }
        if (l.id==="lac"){ for (var j2=0;j2<7;j2++){ var cx2 = x0+22+(x1-x0-44)*(j2+.5)/7, cy2 = ya+22+(j2%2)*26; circ(c,cx2,cy2,15,"#a8d4a5","#2e6b55",1); circ(c,cx2-5,cy2,2.5,"#1d5a33"); circ(c,cx2+5,cy2+4,2.5,"#1d5a33"); } }
        if (l.id==="epi"||l.id==="epb"){ for (var j3=0;j3<8;j3++){ rect(c,x0+6+(x1-x0-12)*j3/8,ya+3,(x1-x0-12)/8-3,yb-ya-6,"#e2f2d9","#7fa883",1,3); } }
      });
      rect(c,x0,Y0-4,x1-x0,4,"#e8d9a8");     /* cuticule */
      /* stomate */
      var sx = x0+(x1-x0)*.35, sy = Y0+190*SC; circ(c,sx-7,sy,7,"#4f9a5c","#1d5a33",1.5); circ(c,sx+7,sy,7,"#4f9a5c","#1d5a33",1.5); rect(c,sx-2.5,sy-8,5,16,"#fff");
      /* nervure */
      var nx = x0+(x1-x0)*.78, ny = Y0+105*SC; circ(c,nx,ny,23,"#e8dcc8","#7a6a4a",1.5); circ(c,nx,ny-8,8,"#9ad0f0","#2a6f97",1.2); circ(c,nx,ny+9,7,"#f2c77a","#9a6a1f",1.2);
      T(c,"xylème",nx-30,ny-8,{size:12,align:"right",color:"#2a6f97",bg:"rgba(255,255,255,.85)"}); T(c,"phloème",nx-30,ny+10,{size:12,align:"right",color:"#9a6a1f",bg:"rgba(255,255,255,.85)"}); T(c,"nervure",nx,ny-33,{size:12,color:P.ink,bg:"rgba(255,255,255,.85)"});
      T(c,"stomate",sx,sy+22,{size:12,color:P.ink}); T(c,"cuticule (cire)",x1,Y0-14,{size:12,align:"right",color:P.grey,bg:"#fff"});
      var l = L.filter(function(q){ return q.id===cur; })[0], I0 = ec.value, Iin = remaining(l.y0)*I0, Iout = remaining(l.y1)*I0;
      ro.set(0,S.fmt(Iin,0)+" %"); ro.set(1,S.fmt(Iin-Iout,1)+" %"); ro.set(2,S.fmt(remaining(200)*I0,0)+" %");
      nt.set("<b>"+l.n+".</b> "+l.txt,"ok");
    });
  }
});

/* ===== 2 · Stomates ===== */
SFA.sim({
  id:"b3-c07-stomates", ch:"c07", tag:"Modèle chiffré",
  titre:"Le dilemme du stomate : respirer ou garder son eau",
  resume:"Lumière, humidité, eau du sol : le stomate s'ouvre ou se ferme. Que gagne la feuille, que perd-elle ?",
  but:"Règle la lumière, l'humidité de l'air et l'eau disponible dans le sol. Lis l'ouverture des stomates, le CO₂ qui entre et l'eau qui s'échappe.",
  aRetenir:"Quand les stomates s'ouvrent, le CO₂ entre (nécessaire à la photosynthèse) mais la vapeur d'eau sort (transpiration) : ouvrir, c'est gagner du carbone mais perdre de l'eau. La lumière provoque l'ouverture ; la sécheresse du sol provoque la fermeture, même en plein jour. La nuit, ils sont en général fermés.",
  piege:"Les plantes ne « respirent » pas seulement la nuit : leurs cellules respirent tout le temps. Et fermer les stomates par temps sec protège l'eau mais bloque aussi la photosynthèse (peu de CO₂ entre). (Modèle qualitatif, valeurs relatives.)",
  build:function(k,S){
    var c = k.canvas(300);
    var li = k.slider("Lumière", 0, 100, 5, 80, "%");
    var rh = k.slider("Humidité de l'air", 10, 100, 5, 50, "%");
    var so = k.slider("Eau disponible dans le sol", 0, 100, 5, 80, "%");
    var ro = k.readouts(["Ouverture des stomates","CO₂ qui entre","Eau perdue","CO₂ gagné pour 1 d'eau perdue"]);
    var nt = k.note("","");
    function state(){
      var Lf = Math.min(1,1.25*li.value/(li.value+25)), Wf = so.value>=40 ? 1 : .05+.95*so.value/40, Hf = .75+.25*Math.min(1,(rh.value-10)/60);
      if (li.value===0) Lf = 0;
      var a = Math.max(0,Math.min(1,Lf*Wf*Hf)), vpd = es(25)*(1-rh.value/100), ref = es(25)*.5;
      return {a:a, co2:a*100, h2o:a*vpd/ref*100, vpd:vpd};
    }
    k.draw(function(){
      c.clear(); var st = state(), g = c.ctx, cx = c.W/2, cy = 112, rw = 78;
      var gap = 2 + 20*st.a;
      var R = 68, th = .95;
      [-1,1].forEach(function(sgn){
        var xc = cx + sgn*(gap+12-R); g.save(); g.lineCap = "round";
        [["#1d5a33",30],["#6bb273",25]].forEach(function(q){ g.strokeStyle = q[0]; g.lineWidth = q[1]; g.beginPath(); if (sgn>0) g.arc(xc,cy,R,-th,th); else g.arc(xc,cy,R,Math.PI-th,Math.PI+th); g.stroke(); });
        g.restore();
        for (var q=-2;q<=2;q++){ var an = q*.3, px = xc + sgn*R*Math.cos(an) , py = cy + R*Math.sin(an); circ(c,px,py,3,"#1d5a33"); }
      });
      T(c,"cellules de garde",cx,cy-R-22,{size:12,color:P.grey}); T(c,"pore (ouverture)",cx,cy+R+24,{size:12,color:P.grey});
      /* flux */
      var n1 = Math.round(st.co2/20), n2 = Math.round(st.h2o/25);
      for (var i=0;i<n1;i++) D.arrow(c,cx-110+((i*17)%30),30+ i*20,cx-110+((i*17)%30)+0,52+i*20,P.acc,2.2);
      T(c,"CO₂ ↓",cx-100,16,{size:12,color:P.acc}); T(c,"H₂O ↑",cx+100,16,{size:12,color:P.teal});
      for (var j=0;j<n2;j++) D.arrow(c,cx+100+((j*13)%24),210-j*18,cx+100+((j*13)%24),188-j*18,P.teal,2.2);
      var yb = 250, w = c.W-32;
      [["Ouverture",st.a*100,P.green],["Eau perdue (réf. = 100)",Math.min(st.h2o,200),P.teal]].forEach(function(q,idx){ var yy = yb + idx*0; });
      rect(c,16,238,w,12,"#eee",null,0,6); rect(c,16,238,Math.max(2,w*st.a),12,P.green,null,0,6); T(c,"ouverture "+S.fmt(st.a*100,0)+" %",16,264,{size:12,align:"left",color:P.ink});
      ro.set(0,S.fmt(st.a*100,0)+" %"); ro.set(1,S.fmt(st.co2,0)+" (réf. 100)"); ro.set(2,S.fmt(st.h2o,0)+" (réf. 100)"); ro.set(3, st.h2o>0.5 ? S.fmt(st.co2/st.h2o,2) : "—");
      nt.set(li.value===0 ? "La nuit (pas de lumière), les stomates sont fermés : presque plus d'échanges." : so.value<40 ? "Sol sec : la plante ferme ses stomates pour garder son eau, même en pleine lumière. Elle perd moins d'eau, mais fait moins de photosynthèse." : rh.value<30 ? "Air très sec : l'eau s'échappe vite, la plante risque de se faner. Plus l'air est sec, plus chaque stomate ouvert coûte cher en eau." : rh.value>=95 ? "Air presque saturé de vapeur : très peu d'eau s'échappe, même avec des stomates ouverts. Le CO₂ entre sans coûter d'eau." : st.a>.7 ? "Stomates bien ouverts : beaucoup de CO₂ entre, mais beaucoup d'eau s'échappe aussi." : "Ouverture partielle : compromis entre gain de CO₂ et perte d'eau.","ok");
    });
  }
});

/* ===== 3 · Transpiration ===== */
SFA.sim({
  id:"b3-c07-transpiration", ch:"c07", tag:"Modèle chiffré · potomètre",
  titre:"Transpiration : chaleur, air sec, vent et stomates",
  resume:"Température, humidité, vent, stomates : de combien l'eau perdue par la feuille change-t-elle ? Un potomètre mesure l'absorption.",
  but:"Choisis le facteur à faire varier sur le graphe et règle les autres. Lis l'eau perdue par une feuille et par un grand arbre, et regarde la bulle du potomètre avancer.",
  aRetenir:"La transpiration est l'évaporation de l'eau par les stomates. Elle augmente avec la température, quand l'air est sec et quand il y a du vent (qui emporte la vapeur) ; fermer les stomates la réduit fortement. Elle aspire l'eau depuis les racines par le xylème : c'est le moteur de la montée de sève.",
  piege:"La plante ne « boit » pas par choix : l'eau est aspirée parce qu'elle s'évapore. Presque toute l'eau absorbée (plus de 95 %) est rejetée par transpiration ; une toute petite part sert à la photosynthèse et à la croissance. (Modèle simplifié.)",
  build:function(k,S){
    var c1 = k.canvas(210), c2 = k.canvas(100);
    var fa = k.seg("Facteur sur le graphe", [["T","Température"],["v","Vent"],["h","Humidité"],["o","Stomates"]], "T");
    var T1 = k.slider("Température", 5, 40, 1, 22, "°C");
    var H1 = k.slider("Humidité de l'air", 10, 100, 5, 55, "%");
    var V1 = k.slider("Vitesse du vent", 0, 10, .5, 1, "m/s");
    var O1 = k.slider("Ouverture des stomates", 0, 100, 5, 100, "%");
    var ro = k.readouts(["Eau perdue (par m² de feuille)","Une feuille de 100 cm²","Un arbre (200 m² de feuilles, 10 h)"]);
    var nt = k.note("","");
    function E(T,h,v,o){ var gs = .35*o/100, gb = .5+.9*Math.sqrt(v), gt = (gs>0) ? 1/(1/gs+1/gb) : 0, vpd = es(T)*(1-h/100); return gt*vpd/101.3*1000; }   /* mmol/m²/s */
    var pos = 0;
    var lp = k.loop(function(dt){ pos += E(T1.value,H1.value,V1.value,O1.value)*dt*.012; k.redraw(); });
    lp.play();
    k.draw(function(){
      var e = E(T1.value,H1.value,V1.value,O1.value), by = fa.value;
      c1.clear(); var rng_ = {T:[5,40,"température (°C)",T1.value],v:[0,10,"vent (m/s)",V1.value],h:[10,100,"humidité (%)",H1.value],o:[0,100,"ouverture (%)",O1.value]}[by];
      var fv = function(x){ return E(by==="T"?x:T1.value,by==="h"?x:H1.value,by==="v"?x:V1.value,by==="o"?x:O1.value); };
      var ymax = Math.max(4,Math.ceil(Math.max(fv(rng_[0]),fv(rng_[1]),e)/2)*2+1);
      var ax = D.axes(c1,{x0:rng_[0],x1:rng_[1],y0:0,y1:ymax,xl:rng_[2],yl:"mmol/m²/s",l:50});
      D.fn(c1,ax,fv,P.teal,3.2); D.dot(c1,ax.X(rng_[3]),ax.Y(e),6,P.violet);
      c2.clear(); var g = c2.ctx, x0 = 24, x1 = c2.W-24, yy = 46;
      rect(c2,x0,yy-9,x1-x0,18,"rgba(180,215,240,.5)",P.ink,2,9); T(c2,"potomètre : la bulle avance quand la plante absorbe",c2.W/2,16,{size:12,color:P.grey});
      var bx = x1 - 20 - ((pos*40) % (x1-x0-40)); rect(c2,bx-10,yy-6,20,12,"#fff",P.ink,1.5,6);
       T(c2,"transpiration ↑ = bulle plus rapide",x1,yy+26,{size:12,align:"right",color:P.grey});
      ro.set(0,S.fmt(e,1)+" mmol/m²/s ≈ "+S.fmt(e*64.8,0)+" g/h"); ro.set(1,S.fmt(e*.648,1)+" g/h"); ro.set(2,S.fmt(e*129.6,0)+" L");
      var ref = E(22,55,1,100);
      nt.set(O1.value===0 ? "Stomates fermés : la perte d'eau est presque nulle (il reste un peu de perte par la cuticule, ignorée ici)." : e>ref*1.5 ? "Transpiration forte : "+S.fmt(e/ref,1)+" fois la valeur de référence (22 °C, 55 %, 1 m/s). La plante doit trouver beaucoup d'eau dans le sol." : e<ref*.6 ? "Transpiration faible ("+S.fmt(e/ref,1)+" fois la référence) : air frais, humide, calme ou stomates presque fermés." : "Transpiration proche de la valeur de référence.","ok");
    });
  }
});

/* ===== 4 · Comptage de stomates ===== */
SFA.sim({
  id:"b3-c07-comptage-stomates", ch:"c07", tag:"Original · niche",
  titre:"Empreinte de feuille : compte les stomates",
  resume:"Au microscope, compte les stomates dans un champ, déduis la densité et le total sur la feuille. Plus tu comptes de champs, plus c'est juste.",
  but:"Touche les stomates pour les marquer. Vérifie, puis passe à un autre champ : la densité moyenne se précise. Compare les espèces et les faces.",
  aRetenir:"La densité de stomates = nombre de stomates ÷ aire du champ observé. Elle varie selon l'espèce, la face de la feuille et le milieu : feuille de nénuphar (flottante) : stomates sur la face supérieure ; feuille d'arbre : surtout face inférieure (à l'ombre, moins de pertes d'eau) ; plante des milieux secs : peu de stomates.",
  piege:"Un seul champ ne suffit pas : le nombre varie d'un champ à l'autre par hasard. Il faut moyenner plusieurs champs. N'oublie pas de convertir l'aire du champ en mm² (disque : π × rayon²). (Densités indicatives.)",
  build:function(k,S){
    var c = k.canvas(330);
    var sp = k.select("Espèce", [["n","Nénuphar"],["h","Hêtre"],["c","Chêne"],["t","Tomate"],["k","Cactus (raquette)"]], "h");
    var fa = k.seg("Face observée", [["s","Supérieure"],["i","Inférieure"]], "i");
    var dia = k.slider("Diamètre du champ", .2, .6, .05, .4, "mm");
    var surf = k.slider("Surface de la feuille", 10, 200, 10, 50, "cm²");
    var seed = 1, marks = {}, revealed = false, dens = [];
    var DEN = {n:{s:460,i:0},h:{s:0,i:210},c:{s:0,i:390},t:{s:120,i:200},k:{s:28,i:28}};
    k.button("Vérifier", function(){ revealed = true; }, true);
    k.button("Autre champ", function(){ var d = pts(); dens.push(d.n/(Math.PI*Math.pow(dia.value/2,2))); seed++; marks = {}; revealed = false; });
    k.button("Effacer les moyennes", function(){ dens = []; });
    var ro = k.readouts(["Stomates marqués","Densité d'après ce champ","Densité moyenne (champs vus)","Total sur la feuille"]);
    var nt = k.note("","");
    function rho(){ return DEN[sp.value][fa.value]; }
    function pois(lam,r){ var L_ = Math.exp(-Math.min(lam,700)), p = 1, n = 0; if (lam>50){ var u1 = r(), u2 = r(); return Math.max(0,Math.round(lam + Math.sqrt(lam)*Math.sqrt(-2*Math.log(u1+1e-9))*Math.cos(6.2832*u2))); } do { n++; p *= r(); } while (p > L_); return n-1; }
    function pts(){
      var area = Math.PI*Math.pow(dia.value/2,2), r = rng(seed*977 + (sp.value.charCodeAt(0))*31 + (fa.value==="s"?7:0)), lam = rho()*area, n = pois(lam,r), R = Math.min(c.W,330)/2-12, arr = [], tries = 0;
      while (arr.length < n && tries < 4000){ tries++; var a = r()*6.2832, d = Math.sqrt(r())*(R-8), x = d*Math.cos(a), y = d*Math.sin(a), ok = true; for (var i=0;i<arr.length;i++) if (Math.hypot(arr[i].x-x,arr[i].y-y) < 12) { ok = false; break; } if (ok) arr.push({x:x,y:y,a:r()*3.1416}); }
      return {n:arr.length, p:arr, R:R};
    }
    c.pointer(function(type,q){ if (type!=="down") return; var d = pts(), cx = c.W/2, cy = c.H/2, best = -1, bd = 16; d.p.forEach(function(s,i){ var dd = Math.hypot(cx+s.x-q.x,cy+s.y-q.y); if (dd<bd){ bd = dd; best = i; } }); if (best>=0){ if (marks[best]) delete marks[best]; else marks[best] = 1; k.redraw(); } });
    k.draw(function(){
      c.clear(); var g = c.ctx, d = pts(), cx = c.W/2, cy = c.H/2, area = Math.PI*Math.pow(dia.value/2,2), r0 = rng(seed*13+5);
      g.save(); g.beginPath(); g.arc(cx,cy,d.R,0,6.2832); g.clip(); g.fillStyle = "#e7f2dc"; g.fillRect(cx-d.R,cy-d.R,2*d.R,2*d.R);
      g.strokeStyle = "#b9d4a8"; g.lineWidth = 1; for (var i=-12;i<=12;i++) for (var j=-12;j<=12;j++){ var bx = cx+i*22+(r0()-.5)*8+(j%2)*11, by = cy+j*19+(r0()-.5)*8; g.beginPath(); g.ellipse(bx,by,11,9.5,0,0,6.2832); g.stroke(); }
      g.restore(); g.save(); g.strokeStyle = P.ink; g.lineWidth = 3; g.beginPath(); g.arc(cx,cy,d.R,0,6.2832); g.stroke(); g.restore();
      var cnt = 0; d.p.forEach(function(s,i){
        var on = !!marks[i], miss = revealed && !on;
        g.save(); g.translate(cx+s.x,cy+s.y); g.rotate(s.a); g.fillStyle = on ? "#2e8b57" : miss ? "#f0a030" : "#6a8f5a"; g.strokeStyle = "#1d5a33"; g.lineWidth = 1.2;
        g.beginPath(); g.ellipse(0,-3.5,6.5,3.6,0,0,6.2832); g.fill(); g.stroke(); g.beginPath(); g.ellipse(0,3.5,6.5,3.6,0,0,6.2832); g.fill(); g.stroke(); g.restore();
        if (on) cnt++;
      });
      if (d.n===0) T(c,"Aucun stomate sur cette face",c.W/2,cy,{size:14,color:P.grey,bg:"rgba(255,255,255,.8)"});
      T(c,"champ ø "+S.fmt(dia.value,2)+" mm = "+S.fmt(area,3)+" mm²",c.W/2,c.H-10,{size:12,color:P.grey});
      var dd = cnt/area, mean = dens.length ? dens.reduce(function(a,b){ return a+b; },0)/dens.length : null;
      ro.set(0,cnt+(revealed ? " sur "+d.n : "")); ro.set(1,S.fmt(dd,0)+" /mm²"); ro.set(2, mean===null ? "—" : S.fmt(mean,0)+" /mm² ("+dens.length+" champ"+(dens.length>1?"s":"")+")"); ro.set(3,S.sci(((mean===null?dd:mean))*surf.value*100,2)+" stomates");
      nt.set(revealed ? (cnt===d.n ? "Compte juste : "+d.n+" stomates. Passe à un autre champ pour moyenner." : "Tu en as marqué "+cnt+" sur "+d.n+" (les orange sont oubliés).") : "Touche chaque stomate (paire de cellules de garde) pour le marquer, puis « Vérifier ». Valeur réelle de l'espèce : voir après quelques champs.", revealed && cnt===d.n ? "ok" : "");
    });
  }
});
})();

/*B3D-LIB*/
window.B3D = window.B3D || (function(){
  var B = {}, BG = [244,246,251];
  B.hex = function(h){ h = h.replace("#",""); return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)]; };
  B.mix = function(a,b,t){ return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]; };
  B.css = function(a,al){ return "rgba("+Math.round(a[0])+","+Math.round(a[1])+","+Math.round(a[2])+","+(al===undefined?1:al)+")"; };
  B.cam = function(yaw,pitch,dist){ return {yaw:yaw, pitch:pitch, dist:dist||7, auto:true, hold:false}; };
  B.rot = function(cam,x,y,z){
    var cy=Math.cos(cam.yaw), sy=Math.sin(cam.yaw), cp=Math.cos(cam.pitch), sp=Math.sin(cam.pitch);
    var x1=cy*x+sy*z, z1=-sy*x+cy*z, y1=cp*y+sp*z1, z2=-sp*y+cp*z1; return [x1,y1,z2];
  };
  /* glisser = tourner (souris et doigt) */
  B.drag = function(c, cam, redraw){
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    var lx=0, ly=0, dn=false;
    c.pointer(function(t,p){
      if (t==="down"){ dn=true; lx=p.x; ly=p.y; cam.hold=true; c.cv.style.cursor="grabbing"; }
      else if (t==="drag" && dn){ cam.yaw -= (p.x-lx)*0.012; cam.pitch += (p.y-ly)*0.01; cam.pitch = Math.max(-1.45, Math.min(1.45, cam.pitch)); lx=p.x; ly=p.y; if (redraw) redraw(); }
      else if (t==="up"){ dn=false; cam.hold=false; c.cv.style.cursor="grab"; }
    });
  };
  B.spin = function(cam, dt, speed){ if (cam.auto && !cam.hold) cam.yaw += dt*(speed||0.35); };
  B.background = function(c){
    var ctx=c.ctx, g=ctx.createLinearGradient(0,0,0,c.H); g.addColorStop(0,"#fbfcff"); g.addColorStop(1,"#e9eef7");
    ctx.fillStyle=g; ctx.fillRect(0,0,c.W,c.H);
  };
  B.hint = function(c, txt){
    var ctx=c.ctx; ctx.save(); ctx.font="600 11px Mulish,system-ui,sans-serif"; ctx.fillStyle="#8a95a3"; ctx.textAlign="left"; ctx.textBaseline="alphabetic";
    ctx.fillText(txt || "Glisse pour tourner la vue en 3D", 10, c.H-10); ctx.restore();
  };
  B.scene = function(c, cam, scale, fogD){
    var items=[], labels=[], ctx=c.ctx, fd=fogD||4;
    var S = {};
    S.P = function(p){ var r=B.rot(cam,p[0],p[1],p[2]); var k=cam.dist/(cam.dist+r[2]); return {x:c.W/2+r[0]*k*scale, y:c.H/2-r[1]*k*scale, z:r[2], k:k}; };
    function fog(z){ return Math.max(0, Math.min(1, (z+fd)/(2*fd)))*0.5; }
    S.sphere = function(p, r, col, al, ring){
      var q=S.P(p), rr=r*q.k*scale; if (rr<0.4) return;
      items.push({z:q.z, f:function(){
        var base=B.mix(col, BG, fog(q.z));
        var g=ctx.createRadialGradient(q.x-.35*rr,q.y-.4*rr,rr*.08,q.x,q.y,rr);
        g.addColorStop(0,B.css(B.mix(base,[255,255,255],.6))); g.addColorStop(.5,B.css(base)); g.addColorStop(1,B.css(B.mix(base,[0,0,20],.42)));
        ctx.globalAlpha = al===undefined?1:al; ctx.fillStyle=g; ctx.beginPath(); ctx.arc(q.x,q.y,rr,0,6.2832); ctx.fill();
        if (ring){ ctx.strokeStyle=ring; ctx.lineWidth=Math.max(1,rr*.12); ctx.stroke(); }
        ctx.globalAlpha=1; }});
      return q;
    };
    S.line = function(a, b, w, col, al, dash){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=w*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round"; ctx.strokeStyle=B.css(B.mix(col,BG,fog(z)));
        if (dash) ctx.setLineDash(dash);
        ctx.lineWidth=Math.max(.6,wd); ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1; }});
    };
    /* cylindre ombré entre a et b (rayon r) */
    S.tube = function(a, b, r, col, al){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=2*r*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round";
        var ws=[1,.7,.4,.18], cs=[B.mix(base,[0,0,20],.4), B.mix(base,[0,0,20],.12), base, B.mix(base,[255,255,255],.5)];
        var dx=(q.x-p.x), dy=(q.y-p.y), L=Math.sqrt(dx*dx+dy*dy)||1, nx=-dy/L, ny=dx/L;
        for (var i=0;i<4;i++){ var off=(i>=2? -0.18:0)*wd/2; ctx.strokeStyle=B.css(cs[i]); ctx.lineWidth=Math.max(.6,wd*ws[i]);
          ctx.beginPath(); ctx.moveTo(p.x+nx*off,p.y+ny*off); ctx.lineTo(q.x+nx*off,q.y+ny*off); ctx.stroke(); }
        ctx.globalAlpha=1; }});
    };
    /* face plane (liste de points 3D), normale n (3D), ombrage de Lambert */
    S.poly = function(pts, col, n, al, stroke, back){
      var ps=pts.map(S.P), z=0; ps.forEach(function(p){ z+=p.z; }); z/=ps.length; if (back) z=99;
      var sh=0.75;
      if (n){ var r=B.rot(cam,n[0],n[1],n[2]), L=Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2])||1; var d=(-0.35*r[0]+0.55*r[1]-0.75*r[2])/L; sh=0.55+0.45*Math.abs(d); }
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); base=B.mix([0,0,20],base,Math.min(1,sh)); if (sh>1) base=B.mix(base,[255,255,255],sh-1);
        ctx.globalAlpha=al===undefined?1:al; ctx.fillStyle=B.css(base); ctx.beginPath(); ctx.moveTo(ps[0].x,ps[0].y);
        for (var i=1;i<ps.length;i++) ctx.lineTo(ps[i].x,ps[i].y); ctx.closePath(); ctx.fill();
        if (stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=.8; ctx.stroke(); } ctx.globalAlpha=1; }});
    };
    S.label = function(p, txt, col, size, dx, dy, align){ labels.push({q:S.P(p), t:txt, c:col||"#0f1b2d", s:size||12, dx:dx||0, dy:dy||0, a:align||"center"}); };
    S.flush = function(){
      items.sort(function(a,b){ return b.z-a.z; });
      for (var i=0;i<items.length;i++) items[i].f();
      ctx.save(); ctx.textBaseline="middle";
      labels.forEach(function(l){ ctx.font="700 "+l.s+"px Mulish,system-ui,sans-serif"; ctx.textAlign=l.a;
        var w=ctx.measureText(l.t).width, x=l.q.x+l.dx, y=l.q.y+l.dy;
        ctx.fillStyle="rgba(255,255,255,.82)"; var bx = l.a==="center"? x-w/2 : (l.a==="left"? x : x-w); ctx.fillRect(bx-3,y-l.s*.62,w+6,l.s*1.25);
        ctx.fillStyle=l.c; ctx.fillText(l.t,x,y); });
      ctx.restore();
    };
    return S;
  };
  return B;
})();
/*B3D-LIB-END*/

/*B3D-ADD:b3-3d-feuille*/
SFA.sim({
  id:"b3-3d-feuille", ch:"c07", tag:"3D · feuille",
  titre:"Une feuille en 3D : un bloc découpé et ses stomates qui s'ouvrent",
  resume:"Un bloc de feuille que tu tournes et coupes : tissus, stomates et échanges de gaz (CO₂, O₂, vapeur d'eau) selon la lumière et l'eau.",
  but:"Fais glisser le curseur « Coupe » pour ouvrir le bloc et surligne chaque tissu. Règle la lumière et l'eau du sol : les stomates s'ouvrent ou se ferment, les gaz circulent. Retourne la feuille pour voir les stomates côté inférieur.",
  aRetenir:"De haut en bas : épiderme supérieur (protège, cuticule cireuse), tissu palissadique (cellules allongées, riches en chloroplastes : l'essentiel de la photosynthèse), tissu lacuneux (cellules arrondies séparées par des lacunes d'air : circulation des gaz), épiderme inférieur avec les stomates. Les nervures contiennent le xylème (eau et sels minéraux montent) et le phloème (sucres). Les stomates laissent entrer le CO₂ et sortir O₂ et vapeur d'eau : ouverts, la feuille photosynthétise mais perd de l'eau.",
  piege:"Les stomates ne sont pas des trous permanents : ce sont deux cellules de garde qui s'ouvrent ou se ferment. Fermés, ils économisent l'eau mais arrêtent l'entrée de CO₂, donc la photosynthèse. Et ils se trouvent surtout sous la feuille, pas dessus.",
  build:function(k, S){
    var B = window.B3D, c = k.canvas(440), cam = B.cam(0.55, 0.4, 8);
    var cut = k.slider("Coupe", 0, 100, 5, 45, "%");
    var tis = k.select("Surligner un tissu", [["all","Tous les tissus"],["epi","Épiderme supérieur"],["pal","Tissu palissadique"],["lac","Tissu lacuneux"],["ner","Nervure (xylème et phloème)"],["inf","Épiderme inférieur et stomates"]], "all");
    var lum = k.slider("Lumière", 0, 100, 5, 80, "%");
    var eau = k.slider("Eau disponible dans le sol", 0, 100, 5, 70, "%");
    var rot = k.toggle("Rotation automatique", false, function(v){ cam.auto = v; });
    k.button("Retourner la feuille", function(){ flip = !flip; }, true);
    var ro = k.readouts(["Ouverture des stomates", "CO₂ entrant", "O₂ produit", "Vapeur d'eau perdue"]);
    var nt = k.note("", "");
    cam.auto = false;
    var flip = false, apS = 0.5, parts = [], T = 0, spawn = {a:0, b:0, c:0};
    var X0 = -1.6, X1 = 1.6, Z1 = 1.2;
    var Y = {epi:[0.55, 0.68], pal:[0.12, 0.55], lac:[-0.35, 0.12], inf:[-0.48, -0.35]};
    var COL = {epi:B.hex("#d9ecd2"), pal:B.hex("#6fbf5a"), lac:B.hex("#a9d98e"), inf:B.hex("#d9ecd2")};
    var NAMES = {epi:"épiderme supérieur", pal:"tissu palissadique", lac:"tissu lacuneux", inf:"épiderme inférieur", ner:"nervure"};
    var FUNC = {all:"", epi:"Épiderme supérieur : une seule couche de cellules transparentes recouvertes d'une cuticule cireuse. Il protège et laisse passer la lumière.",
      pal:"Tissu palissadique : cellules allongées serrées, pleines de chloroplastes, juste sous la lumière. C'est là que se fait l'essentiel de la photosynthèse.",
      lac:"Tissu lacuneux : cellules arrondies avec de grands espaces d'air (lacunes). Les gaz y circulent vers et depuis les stomates ; il fait aussi un peu de photosynthèse.",
      ner:"Nervure : le xylème (bleu) amène l'eau et les sels minéraux depuis la racine ; le phloème (jaune) transporte les sucres fabriqués vers le reste de la plante.",
      inf:"Épiderme inférieur : il porte la plupart des stomates. Chaque stomate est formé de deux cellules de garde qui règlent l'ouverture."};
    var seed = 7; function rr(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var LAC = []; for (var i = 0; i < 12; i++) for (var j = 0; j < 3; j++) LAC.push([X0 + 0.14 + i * 0.27 + (rr() - 0.5) * 0.08, -0.3 + j * 0.15 + (rr() - 0.5) * 0.05, rr()]);
    var STS = [[-1.1, 0.5], [0.8, 0.4], [-0.2, 0.9], [1.2, -0.1], [-1.2, -0.5], [0.3, -0.6]];
    function zc(){ return -1.2 + cut.value / 100 * 2.3; }
    B.drag(c, cam, function(){ render(); });
    function box(x0, x1, y0, y1, z0, z1, col, al){
      var z = z0;
      sc.poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], col, [0, 1, 0], al);
      sc.poly([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], col, [0, -1, 0], al);
      sc.poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], col, [0, 0, 1], al);
      sc.poly([[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], col, [-1, 0, 0], al);
      sc.poly([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], col, [1, 0, 0], al);
      sc.poly([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], col, [0, 0, -1], al, "rgba(60,90,50,.5)", true);
    }
    var sc;
    function al(t){ return tis.value === "all" || tis.value === t ? 1 : 0.22; }
    function step(dt){
      T += dt;
      var light = lum.value / 100, water = eau.value / 100, target = (light > 0.08 ? Math.min(1, light / 0.55) : 0) * Math.min(1, water / 0.5);
      apS += (target - apS) * Math.min(1, dt * 1.6);
      var zcut = zc(), sts = STS.filter(function(s){ return s[1] >= zcut + 0.1; }).concat([[0.3, zcut + 0.0]]);
      spawn.a += dt * 3.5 * apS; spawn.b += dt * 3.5 * apS * light; spawn.c += dt * 4 * apS;
      while (spawn.a >= 1){ spawn.a -= 1; var s = sts[Math.floor(Math.random() * sts.length)]; parts.push({t:"co2", x:s[0], z:s[1], u:0}); }
      while (spawn.b >= 1){ spawn.b -= 1; var s2 = sts[Math.floor(Math.random() * sts.length)]; parts.push({t:"o2", x:s2[0], z:s2[1], u:0}); }
      while (spawn.c >= 1){ spawn.c -= 1; var s3 = sts[Math.floor(Math.random() * sts.length)]; parts.push({t:"h2o", x:s3[0], z:s3[1], u:0}); }
      parts.forEach(function(p){ p.u += dt * 0.45; });
      parts = parts.filter(function(p){ return p.u < 1 && p.z >= zcut - 0.01; });
    }
    function pos(p){
      var u = p.u, x = p.x, z = p.z;
      if (p.t === "co2"){ return u < 0.5 ? [x, -1.4 + (-0.42 + 1.4) * (u / 0.5), z] : [x + 0.1 * (u - 0.5) * 2, -0.42 + (0.3 + 0.42) * ((u - 0.5) / 0.5), z]; }
      if (p.t === "o2"){ return u < 0.5 ? [x + 0.1 - 0.1 * (u / 0.5), 0.3 + (-0.42 - 0.3) * (u / 0.5), z] : [x, -0.42 + (-1.4 + 0.42) * ((u - 0.5) / 0.5), z]; }
      return u < 0.4 ? [x - 0.1 + 0.1 * (u / 0.4), -0.1 + (-0.42 + 0.1) * (u / 0.4), z] : [x, -0.42 + (-1.3 + 0.42) * ((u - 0.4) / 0.6), z];
    }
    function render(){
      B.background(c);
      var tgt = flip ? -0.95 : 0.4; if (Math.abs(cam.pitch - tgt) > 0.02 && !cam.hold) cam.pitch += (tgt - cam.pitch) * 0.12;
      sc = B.scene(c, cam, Math.min(c.W / 4.2, c.H / 3.6), 4);
      var zcut = zc(), x0 = X0, x1 = X1;
      ["epi", "pal", "lac", "inf"].forEach(function(t){ box(x0, x1, Y[t][0], Y[t][1], zcut, Z1, COL[t], al(t)); });
      /* cuticule */
      sc.poly([[x0, 0.69, zcut], [x1, 0.69, zcut], [x1, 0.69, Z1], [x0, 0.69, Z1]], B.hex("#7dd3fc"), [0, 1, 0], 0.35 * al("epi"));
      /* face de coupe : cellules */
      var zf = zcut - 0.005, a;
      for (a = 0; a < 11; a++){ var xa = x0 + a * 0.29 + 0.01; sc.poly([[xa, 0.57, zf], [xa + 0.27, 0.57, zf], [xa + 0.27, 0.66, zf], [xa, 0.66, zf]], B.hex("#eaf5e5"), null, al("epi"), "#7aa36d"); }
      for (a = 0; a < 16; a++){ var xp = x0 + a * 0.2 + 0.02; sc.poly([[xp, 0.14, zf], [xp + 0.17, 0.14, zf], [xp + 0.17, 0.53, zf], [xp, 0.53, zf]], B.hex("#9bd67f"), null, al("pal"), "#4d8a3a");
        for (var q = 0; q < 3; q++) sc.sphere([xp + 0.085, 0.22 + q * 0.12, zf - 0.02], 0.035, B.hex("#15803d"), al("pal")); }
      LAC.forEach(function(L){ sc.sphere([L[0], L[1], zf - 0.03], 0.1, B.hex("#bfe3a3"), al("lac"), "#5e9f46"); if (L[2] > 0.4) sc.sphere([L[0] + 0.02, L[1], zf - 0.06], 0.03, B.hex("#15803d"), al("lac")); });
      var open = apS;
      for (a = 0; a < 11; a++){ var xi = x0 + a * 0.29 + 0.01, isSt = Math.abs(xi + 0.135 - 0.3) < 0.2; if (isSt) continue; sc.poly([[xi, -0.47, zf], [xi + 0.27, -0.47, zf], [xi + 0.27, -0.36, zf], [xi, -0.36, zf]], B.hex("#eaf5e5"), null, al("inf"), "#7aa36d"); }
      /* stomate coupé : deux cellules de garde */
      var gw = 0.025 + 0.05 * open; sc.sphere([0.3 - gw - 0.06, -0.415, zf - 0.03], 0.075, B.hex("#2f9e44"), al("inf"), "#14532d"); sc.sphere([0.3 + gw + 0.06, -0.415, zf - 0.03], 0.075, B.hex("#2f9e44"), al("inf"), "#14532d");
      /* nervure */
      sc.tube([-0.55, -0.02, zcut], [-0.55, -0.02, Z1], 0.16, B.hex("#cbd5e1"), 0.5 * al("ner") + 0.5 * (tis.value === "ner" ? 1 : 0));
      sc.tube([-0.55, 0.02, zcut], [-0.55, 0.02, Z1], 0.07, B.hex("#60a5fa"), al("ner")); sc.tube([-0.55, -0.1, zcut], [-0.55, -0.1, Z1], 0.05, B.hex("#fbbf24"), al("ner"));
      sc.sphere([-0.55, 0.02, zcut - 0.01], 0.07, B.hex("#60a5fa"), al("ner")); sc.sphere([-0.55, -0.1, zcut - 0.01], 0.05, B.hex("#fbbf24"), al("ner"));
      /* stomates à la surface inférieure */
      STS.forEach(function(s){ if (s[1] < zcut + 0.1) return; var g = 0.02 + 0.05 * open; sc.sphere([s[0] - g - 0.05, -0.49, s[1]], 0.06, B.hex("#2f9e44"), al("inf"), "#14532d"); sc.sphere([s[0] + g + 0.05, -0.49, s[1]], 0.06, B.hex("#2f9e44"), al("inf"), "#14532d"); });
      /* rayons de lumière */
      var li = lum.value / 100; for (a = 0; a < 5; a++){ var lx = -1.3 + a * 0.65, off = (T * 0.8 + a * 0.3) % 1; sc.line([lx, 1.9 - 0.2 * off, 0.3], [lx, 1.0 - 0.2 * off, 0.3], 0.06, B.hex("#facc15"), 0.15 + 0.8 * li); }
      /* gaz */
      var GC = {co2:B.hex("#475569"), o2:B.hex("#ef4444"), h2o:B.hex("#38bdf8")};
      parts.forEach(function(p){ sc.sphere(pos(p), p.t === "o2" ? 0.065 : 0.06, GC[p.t]); });
      sc.label([1.5, 1.95, 0.3], "lumière", "#a16207", 10, 0, 0);
      if (tis.value !== "all" && tis.value !== "ner") sc.label([x1 + 0.05, (Y[tis.value][0] + Y[tis.value][1]) / 2, zcut], NAMES[tis.value], "#14532d", 10, 6, 0, "left");
      if (tis.value === "ner") sc.label([-0.55, 0.3, zcut], "xylème / phloème", "#1d4ed8", 10, 0, -4);
      sc.flush(); B.hint(c);
      var ctx = c.ctx; ctx.save(); ctx.font = "700 11px Mulish,system-ui,sans-serif"; ctx.textBaseline = "middle";
      [["CO₂ (entre)", "#475569"], ["O₂ (sort)", "#ef4444"], ["vapeur d'eau (sort)", "#38bdf8"]].forEach(function(q, n){ ctx.fillStyle = q[1]; ctx.beginPath(); ctx.arc(14, 16 + n * 17, 5, 0, 6.3); ctx.fill(); ctx.fillStyle = "#0f1b2d"; ctx.fillText(q[0], 24, 16 + n * 17); }); ctx.restore();
      var light = lum.value / 100;
      ro.set(0, S.fmt(apS * 100, 0) + " %"); ro.set(1, S.fmt(apS * 100, 0) + " %"); ro.set(2, S.fmt(apS * light * 100, 0) + " %"); ro.set(3, S.fmt(apS * 100, 0) + " %");
      var msg = FUNC[tis.value], kind = "";
      if (!msg){ msg = "Sous la lumière, les cellules de garde se gonflent et ouvrent le stomate : le CO₂ entre, l'O₂ et la vapeur d'eau sortent."; }
      if (light < 0.08){ msg = "Dans l'obscurité, les stomates se ferment : pas de photosynthèse, donc ni entrée de CO₂ ni production d'O₂. " + (tis.value === "all" ? "" : FUNC[tis.value]); kind = "warn"; }
      else if (eau.value < 25){ msg = "Sol sec : les stomates se ferment pour économiser l'eau. Bonne nouvelle pour l'eau, mauvaise pour la photosynthèse (plus de CO₂ qui entre). C'est le dilemme de la feuille. " + (tis.value === "all" ? "" : FUNC[tis.value]); kind = "warn"; }
      nt.set(msg, kind);
    }
    k.draw(render);
    var L = k.loop(function(dt){ B.spin(cam, dt, 0.25); step(dt); render(); });
    L.play();
  }
});
/*B3D-ADD-END:b3-3d-feuille*/
