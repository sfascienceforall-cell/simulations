/* Biologie BA1 · chapitre 3 : membranes et transports */

SFA.sim({
  id:"ub-c03-diffusion-fick", ch:"c03", tag:"Diffusion · classique",
  titre:"Diffusion à travers la membrane : P = D·K/ε et temps d'équilibration",
  resume:"Perméabilité, flux et temps caractéristique d'une cellule selon la solubilité dans les lipides.",
  but:"Fais varier le coefficient de partage K (solubilité lipidique), l'épaisseur ε et le rayon de la cellule. Lis P, le flux par unité de surface et la courbe de remplissage.",
  aRetenir:"Loi de Fick : J = P·ΔC avec P = D·K/ε. Une molécule liposoluble (K élevé : O₂, CO₂, éthanol) traverse vite ; un ion ou un sucre (K très faible) traverse très lentement sans transporteur. Temps caractéristique d'une cellule sphérique : τ = r/(3P) : il croît avec r (S/V = 3/r). Pont : chimie, diffusion et concentrations.",
  piege:"J est un flux par unité de surface (mol·m⁻²·s⁻¹) ; le flux total vaut J × surface. La diffusion simple ne se sature jamais et va toujours du plus concentré vers le moins concentré.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(320);
    var Dm=k.slider("D dans la membrane",0.1,10,0.1,1,"·10⁻¹² m²/s");
    var lk=k.slider("log₁₀ du coefficient de partage K",-6,1,0.5,0,"");
    var ep=k.slider("Épaisseur ε de la membrane",2,100,1,5,"nm");
    var r=k.slider("Rayon de la cellule",1,30,1,10,"µm");
    var dc=k.slider("ΔC (extérieur − intérieur)",0.1,20,0.1,5,"mmol/L");
    var ro=k.readouts(["K","P (cm/s)","Flux J (mol·m⁻²·s⁻¹)","Flux total entrant","τ = r / 3P"]);
    var nt=k.note("","");
    k.draw(function(){
      c.clear();
      var K=Math.pow(10,lk.value), p=Dm.value*1e-12*K/(ep.value*1e-9);   /* m/s */
      var tau=(r.value*1e-6)/(3*p), J=p*dc.value;   /* mol/m2/s car mmol/L = mol/m3 */
      var A=4*Math.PI*Math.pow(r.value*1e-6,2), Phi=J*A;
      var ax=S.draw.axes(c,{x0:0,x1:5,y0:0,y1:1.05,stepX:1,stepY:0.25,xl:"temps (en unités de τ)",yl:"Ci / Ce"});
      S.draw.fn(c,ax,function(x){return 1-Math.exp(-x);},P.acc,2.6);
      S.draw.line(c,ax.X(1),ax.Y(0),ax.X(1),ax.Y(1-Math.exp(-1)),P.red,1.5,[4,4]);
      S.draw.dot(c,ax.X(1),ax.Y(1-Math.exp(-1)),5,P.red);
      S.draw.text(c,"à t = τ : 63 %",ax.X(1)+8,ax.Y(0.52),{size:11,color:P.red,align:"left"});
      S.draw.text(c,"à t = 3τ : 95 %",ax.X(3),ax.Y(0.95)-14,{size:11,color:P.grey});
      ro.set(0,S.sci(K,2)); ro.set(1,S.sci(p*100,2)); ro.set(2,S.sci(J,2)); ro.set(3,S.sci(Phi*1e15,2)+" fmol/s");
      ro.set(4,tau<1?(tau<1e-3?S.sci(tau*1000,2)+" ms":S.fmt(tau*1000,2)+" ms"):(tau<3600?S.fmt(tau,1)+" s":S.fmt(tau/3600,1)+" h"));
      nt.set("Courbe : Ci(t) = Ce·(1 − e<sup>−t/τ</sup>) si la cellule démarre à 0 (Ce fixe). Ordre de grandeur : "+(tau<0.1?"équilibre quasi instantané (gaz, éthanol).":tau<60?"équilibre en secondes à minutes.":"très lent : un transporteur ou un canal est indispensable."),tau<60?"ok":"warn");
    });
    k.note("Modèle simplifié : membrane homogène, D constant, pas de couche d'eau non agitée, concentration extérieure maintenue constante.","warn");
  }
});

SFA.sim({
  id:"ub-c03-osmose-gr", ch:"c03", tag:"Osmose · tonicité",
  titre:"Globule rouge : osmolarité contre tonicité",
  resume:"NaCl, glucose, urée : un soluté qui traverse la membrane change l'osmolarité mais pas la tonicité.",
  but:"Compose une solution et lis le volume relatif du globule rouge, d'abord juste après l'immersion, puis à l'équilibre.",
  aRetenir:"L'eau suit l'osmolarité des solutés NON pénétrants : la tonicité efficace = 2·[NaCl] + [glucose] (solutés qui ne traversent pas). Un soluté qui traverse (urée) compte dans l'osmolarité totale, pas dans la tonicité. Volume à l'équilibre : V/V₀ = 300 / tonicité (mOsm/L). Pont : chimie, propriétés colligatives (Π = i·c·R·T).",
  piege:"Une solution d'urée à 300 mmol/L est isoosmotique mais HYPOtonique : l'urée entre, l'eau la suit, la cellule gonfle et éclate. Isoosmotique ≠ isotonique.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(300);
    var na=k.slider("NaCl",0,300,1,154,"mmol/L");
    var gl=k.slider("Glucose (supposé non pénétrant ici)",0,400,1,0,"mmol/L");
    var ur=k.slider("Urée (traverse librement)",0,400,1,0,"mmol/L");
    var tm=k.seg("Moment",[["imm","Juste après l'immersion"],["eq","À l'équilibre"]],"eq");
    var ro=k.readouts(["Osmolarité extérieure (mOsm/L)","Tonicité efficace (mOsm/L)","V / V₀","Verdict"]);
    var nt=k.note("","");
    function cell(cx,cy,V){
      var ctx=c.ctx, r=52*Math.pow(Math.min(V,1.6),1/3);
      if(V>1.5){ ctx.save(); ctx.setLineDash([5,5]); ctx.strokeStyle=P.grey; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,r,0,7); ctx.stroke(); ctx.restore(); for(var i=0;i<14;i++){ var a=i*2.4, rr=10+((i*37)%40); S.draw.dot(c,cx+rr*Math.cos(a),cy+rr*Math.sin(a),3,"#e07a7a"); } S.draw.text(c,"hémolyse",cx,cy+r+14,{size:11,color:P.red}); return; }
      ctx.fillStyle="#e07a7a"; ctx.strokeStyle="#b42318"; ctx.lineWidth=2; ctx.beginPath();
      if(V<0.8){ for(var j=0;j<=32;j++){ var ang=j/32*2*Math.PI, rad=r*(j%2?1.18:0.96); var x=cx+rad*Math.cos(ang), y=cy+rad*Math.sin(ang); if(j===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);} ctx.closePath(); }
      else ctx.arc(cx,cy,r,0,7);
      ctx.fill(); ctx.stroke();
      if(V>0.8&&V<1.1){ ctx.fillStyle="#f3b9b9"; ctx.beginPath(); ctx.arc(cx,cy,r*0.45,0,7); ctx.fill(); }
      S.draw.text(c,V<0.8?"crénelé (rétractation)":V>1.1?"gonflé":"disque biconcave",cx,cy+r+16,{size:11,color:P.ink});
    }
    k.draw(function(){
      c.clear();
      var osm=2*na.value+gl.value+ur.value, ton=2*na.value+gl.value;
      var V = tm.value==="imm" ? (osm>0?300/osm:Infinity) : (ton>0?300/ton:Infinity);
      var Vs = isFinite(V)?V:9; cell(c.W/2-80,130,Vs);
      /* barres osmolarité */
      var x0=c.W/2+60, bw=70, sc=0.45;
      S.draw.line(c,x0-20,250,x0+2*bw+20,250,"#8a95a3",1);
      [["Osmolarité",osm,P.acc],["Tonicité",ton,P.green]].forEach(function(b,i){ var h=Math.min(b[1],600)*sc; c.ctx.fillStyle=b[2]; c.ctx.fillRect(x0+i*bw,250-h,bw-14,h); S.draw.text(c,S.fmt(b[1],0),x0+i*bw+(bw-14)/2,250-h-8,{size:11,color:P.ink}); S.draw.text(c,b[0],x0+i*bw+(bw-14)/2,266,{size:10,color:P.grey}); });
      var y300=250-300*sc; S.draw.line(c,x0-20,y300,x0+2*bw+20,y300,P.red,1.5,[5,4]); S.draw.text(c,"300",x0+2*bw+24,y300,{size:10,color:P.red,align:"left"});
      var ver = !isFinite(V)||V>1.5 ? "lyse" : V<0.8 ? "rétraction (hypertonique)" : V>1.1 ? "gonflement (hypotonique)" : "isotonique";
      ro.set(0,S.fmt(osm,0)); ro.set(1,S.fmt(ton,0)); ro.set(2,isFinite(V)?S.fmt(V,2):"∞"); ro.set(3,ver);
      nt.set(ur.value>0&&tm.value==="imm"?"Juste après l'immersion l'urée n'est pas encore entrée : l'eau suit l'osmolarité TOTALE. Passe à « À l'équilibre » pour voir l'effet de l'entrée d'urée.":"Ligne rouge : intérieur du globule rouge, ≈ 300 mOsm/L de solutés non pénétrants (modèle de l'osmomètre idéal : V = 300/tonicité ; lyse indicative à V > 1,5 V₀).",ver==="isotonique"?"ok":"warn");
    });
    k.note("Modèle d'osmomètre idéal : NaCl dissocié (i = 2), pas de coefficient osmotique, pas de volume non osmotique. Le glucose est supposé non pénétrant par simplification (il est en réalité transporté par GLUT1 puis métabolisé).","warn");
  }
});

SFA.sim({
  id:"ub-c03-transporteur-saturation", ch:"c03", tag:"Transports",
  titre:"Diffusion simple contre transporteur : saturation et compétition",
  resume:"Le flux d'un transporteur plafonne à Jmax ; la diffusion simple reste linéaire. Un compétiteur change Km.",
  but:"Compare les deux flux selon la concentration extérieure. Ajoute un inhibiteur compétitif et observe Km apparent.",
  aRetenir:"Diffusion simple : J = k·C (droite, jamais saturée). Transport facilité (uniport, symport) : J = Jmax·C / (Km + C), saturable et spécifique ; un compétiteur augmente Km apparent (Km·(1 + I/Ki)) sans changer Jmax. Un canal ou un transporteur facilité va dans le sens du gradient ; seul le transport actif (pompe) travaille CONTRE le gradient, au prix d'ATP (Na⁺/K⁺ : 3 Na⁺ sortent, 2 K⁺ entrent par ATP).",
  piege:"Le transport facilité est PASSIF : il n'utilise pas d'ATP et s'arrête à l'équilibre. Saturé ne veut pas dire actif.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(330);
    var jm=k.slider("Jmax (nombre de transporteurs × vitesse)",20,200,5,100,"µmol/min");
    var km=k.slider("Km du transporteur",0.5,10,0.5,2,"mmol/L");
    var kd=k.slider("Constante de diffusion simple k",0,10,0.1,2,"µmol/min par mmol/L");
    var I=k.slider("Concentration du compétiteur I",0,20,0.5,0,"mmol/L");
    var Ki=k.slider("Ki du compétiteur",0.5,10,0.5,2,"mmol/L");
    var C=k.slider("Concentration extérieure C",0,20,0.5,5,"mmol/L");
    var ro=k.readouts(["Km apparent","Flux facilité","Flux diffusion simple","Saturation C/(Km'+C)","C pour 50 % de saturation"]);
    k.draw(function(){
      c.clear();
      var kma=km.value*(1+I.value/Ki.value), ax=S.draw.axes(c,{x0:0,x1:20,y0:0,y1:210,stepX:5,stepY:50,xl:"C (mmol/L)",yl:"flux (µmol/min)"});
      S.draw.fn(c,ax,function(x){return kd.value*x;},P.grey,2,[5,4]);
      S.draw.fn(c,ax,function(x){return jm.value*x/(km.value+x);},P.acc,1.8);
      if(I.value>0) S.draw.fn(c,ax,function(x){return jm.value*x/(kma+x);},P.red,2.6);
      S.draw.line(c,ax.L,ax.Y(jm.value),ax.R,ax.Y(jm.value),P.green,1,[3,4]); S.draw.text(c,"Jmax",ax.R-4,ax.Y(jm.value)-8,{size:10,color:P.green,align:"right"});
      var cv=C.value, jf=jm.value*cv/(kma+cv), jd=kd.value*cv;
      S.draw.dot(c,ax.X(cv),ax.Y(jf),6,P.red); S.draw.dot(c,ax.X(cv),ax.Y(jd),5,P.ink);
      S.draw.text(c,"bleu : transporteur · rouge : avec compétiteur · tirets : diffusion simple",c.W/2,c.H-12,{size:10,color:P.grey});
      ro.set(0,S.fmt(kma,2)+" mmol/L"); ro.set(1,S.fmt(jf,1)+" µmol/min"); ro.set(2,S.fmt(jd,1)+" µmol/min"); ro.set(3,S.fmt(cv/(kma+cv)*100,0)+" %"); ro.set(4,S.fmt(kma,2)+" mmol/L");
    });
  }
});

SFA.sim({
  id:"ub-c03-nernst", ch:"c03", tag:"Potentiel d'équilibre",
  titre:"Équation de Nernst : le potentiel d'équilibre de K⁺, Na⁺, Cl⁻, Ca²⁺",
  resume:"E = (RT/zF)·ln([X]ₒ/[X]ᵢ) : lis E pour chaque ion et le sens du flux net à un Vm donné.",
  but:"Choisis l'ion, modifie les concentrations (facteurs) et la température. Place le potentiel membranaire Vm et lis la force motrice.",
  aRetenir:"À 37 °C : E = (61,5 mV / z)·log₁₀([X]ₒ/[X]ᵢ). Valeurs usuelles (neurone) : E(K⁺) ≈ −89 mV, E(Na⁺) ≈ +67 mV, E(Cl⁻) ≈ −64 mV, E(Ca²⁺) ≈ +132 mV. Un ion circule si Vm ≠ E : le flux net est sortant si z(Vm − E) > 0, entrant si z(Vm − E) < 0. Pont : chimie ch. 14, pile de concentration (Nernst).",
  piege:"Le signe de E dépend de z : pour un anion, il faut inverser le rapport (ou changer le signe). À l'équilibre électrochimique (Vm = E), il y a des flux, mais ils sont égaux et opposés (flux net nul).",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(330);
    var ION={K:["K⁺",1,140,5],Na:["Na⁺",1,12,145],Cl:["Cl⁻",-1,10,110],Ca:["Ca²⁺",2,1e-4,2]};
    var ion=k.seg("Ion",[["K","K⁺"],["Na","Na⁺"],["Cl","Cl⁻"],["Ca","Ca²⁺"]],"K");
    var fo=k.slider("Facteur sur [X] extérieur",0.1,10,0.1,1,"×");
    var fi=k.slider("Facteur sur [X] intérieur",0.1,10,0.1,1,"×");
    var T=k.slider("Température",20,42,1,37,"°C");
    var vm=k.slider("Potentiel membranaire Vm",-100,60,1,-70,"mV");
    var ro=k.readouts(["[X] intérieur / extérieur (mmol/L)","E (mV)","Force motrice Vm − E","Flux net de l'ion"]);
    k.draw(function(){
      c.clear();
      var d=ION[ion.value], z=d[1], Ci=d[2]*fi.value, Co=d[3]*fo.value, Tk=T.value+273.15, F=96485, R=8.314;
      var E=1000*R*Tk/(z*F)*Math.log(Co/Ci), unit=1000*R*Tk/F*Math.LN10;
      var ax=S.draw.axes(c,{x0:-3,x1:3,y0:-150,y1:150,stepX:1,stepY:50,xl:"log₁₀([X]ₒ/[X]ᵢ)",yl:"E (mV)"});
      [[1,P.acc,"z = +1"],[2,P.violet,"z = +2"],[-1,P.teal,"z = −1"]].forEach(function(o){ S.draw.fn(c,ax,function(x){return unit/o[0]*x;},o[1],o[0]===z?2.8:1.4); S.draw.text(c,o[2],ax.X(2.3),ax.Y(unit/o[0]*2.3)-(o[0]===-1?-10:10),{size:10,color:o[1]}); });
      var lx=Math.log10(Co/Ci); S.draw.dot(c,ax.X(Math.max(-3,Math.min(3,lx))),ax.Y(Math.max(-150,Math.min(150,E))),7,P.red);
      S.draw.line(c,ax.L,ax.Y(vm.value),ax.R,ax.Y(vm.value),P.amber,1.6,[6,4]); S.draw.text(c,"Vm",ax.L+4,ax.Y(vm.value)-8,{size:11,color:P.amber,align:"left"});
      var fm=vm.value-E, dir=Math.abs(fm)<0.5?"nul (équilibre)":(z*fm>0?"sortant":"entrant");
      ro.set(0,S.sci(Ci,2)+" / "+S.sci(Co,2)); ro.set(1,S.fmt(E,1)+" mV"); ro.set(2,S.fmt(fm,1)+" mV"); ro.set(3,d[0]+" : "+dir);
    });
    k.note("Concentrations de départ typiques de cellule excitable de mammifère (en mmol/L) : K⁺ 140 / 5 ; Na⁺ 12 / 145 ; Cl⁻ 10 / 110 ; Ca²⁺ libre 0,0001 / 2. Elles varient selon le type cellulaire.","warn");
  }
});

SFA.sim({
  id:"ub-c03-goldman", ch:"c03", tag:"Potentiel de repos",
  titre:"Goldman : le potentiel de repos selon les perméabilités ioniques",
  resume:"Vm tend vers le potentiel d'équilibre de l'ion le plus perméant. Hyperkaliémie et pic du potentiel d'action.",
  but:"Choisis la perméabilité relative au sodium (pNa/pK) et au chlorure, puis fais varier [K⁺] extérieur. Compare avec E(K⁺).",
  aRetenir:"GHK à 37 °C : Vm = 61,5·log₁₀[(pK·Kₒ + pNa·Naₒ + pCl·Clᵢ) / (pK·Kᵢ + pNa·Naᵢ + pCl·Clₒ)]. Au repos pK ≫ pNa : Vm ≈ −68 mV, proche de E(K⁺) = −89 mV mais plus positif. Quand pNa/pK passe à ≈ 20 (canaux Na⁺ ouverts), Vm vire vers E(Na⁺) (≈ +67 mV) : phase ascendante du potentiel d'action. Hyperkaliémie : Kₒ augmente, E(K⁺) devient moins négatif : la cellule se dépolarise.",
  piege:"Vm au repos n'est PAS égal à E(K⁺) : un peu de Na⁺ entre en permanence (pNa/pK ≈ 0,04), compensé par la pompe Na⁺/K⁺. Le potentiel de repos n'est pas un équilibre, c'est un état stationnaire.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(330);
    var pn=k.select("Perméabilité relative pNa/pK",[[0.01,"0,01 (très faible)"],[0.04,"0,04 (repos)"],[0.2,"0,2 (dépolarisé)"],[1,"1"],[20,"20 (pic du potentiel d'action)"]],0.04);
    var pcl=k.slider("pCl/pK",0,1,0.05,0,"");
    var ko=k.slider("[K⁺] extérieur",1,40,0.5,5,"mmol/L");
    var ro=k.readouts(["Vm (mV)","E(K⁺) (mV)","E(Na⁺) (mV)","Vm − E(K⁺)"]);
    var Ki=140,Nai=12,Nao=145,Cli=10,Clo=110, U=61.54;
    function vmf(K,pNa,pCl){ return U*Math.log10((1*K+pNa*Nao+pCl*Cli)/(1*Ki+pNa*Nai+pCl*Clo)); }
    k.draw(function(){
      c.clear();
      var pN=parseFloat(pn.value), pC=pcl.value;
      var ax=S.draw.axes(c,{x0:1,x1:40,y0:-100,y1:80,stepX:5,stepY:20,xl:"[K⁺] extérieur (mmol/L)",yl:"Vm (mV)"});
      S.draw.fn(c,ax,function(x){return U*Math.log10(x/Ki);},P.grey,1.6,[5,4]);
      S.draw.fn(c,ax,function(x){return vmf(x,pN,pC);},P.acc,2.8);
      S.draw.text(c,"tirets : E(K⁺) seul",ax.X(25),ax.Y(U*Math.log10(25/Ki))+14,{size:10,color:P.grey});
      var v=vmf(ko.value,pN,pC); S.draw.dot(c,ax.X(ko.value),ax.Y(v),7,P.red);
      S.draw.text(c,S.fmt(v,1)+" mV",ax.X(ko.value)+10,ax.Y(v)-12,{size:12,color:P.red,align:"left"});
      var EK=U*Math.log10(ko.value/Ki), ENa=U*Math.log10(Nao/Nai);
      ro.set(0,S.fmt(v,1)); ro.set(1,S.fmt(EK,1)); ro.set(2,S.fmt(ENa,1)); ro.set(3,S.fmt(v-EK,1)+" mV");
    });
    k.note("Concentrations utilisées (mmol/L) : K⁺ᵢ = 140 ; Na⁺ᵢ = 12 ; Na⁺ₒ = 145 ; Cl⁻ᵢ = 10 ; Cl⁻ₒ = 110. Modèle à champ constant (GHK) ; 61,54 mV = 2,303·RT/F à 37 °C.","warn");
  }
});
