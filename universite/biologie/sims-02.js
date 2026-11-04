/* Biologie BA1 · chapitre 2 : cellule, organites et techniques d'observation */

SFA.sim({
  id:"ub-c02-microscopie", ch:"c02", tag:"Observation · classique",
  titre:"Échelles, grossissement et résolution",
  resume:"Que voit-on avec quel microscope ? Taille réelle sur une image et limite de résolution.",
  but:"Fais varier la longueur d'onde et l'ouverture numérique (NA) : les structures plus petites que la limite de résolution disparaissent. En dessous, convertis une mesure sur image en taille réelle.",
  aRetenir:"Résolution optique : d ≈ 0,61·λ / NA (≈ 0,2-0,3 µm en lumière visible). Le grossissement ne crée pas de détails : au-delà de la résolution, c'est du « grossissement vide ». Taille réelle = taille mesurée sur l'image ÷ grossissement. La microscopie électronique (λ d'électron très petite) résout la fraction de nanomètre à quelques nm en biologie.",
  piege:"Résolution ≠ grossissement. Un ribosome (≈ 25 nm) ne se voit pas en microscopie optique, même à ×10 000 : il se voit en microscopie électronique à transmission.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(330);
    var mode=k.seg("Technique",[["opt","Optique (λ, NA)"],["tem","Électronique à transmission"]],"opt");
    var lam=k.slider("Longueur d'onde λ",400,700,10,550,"nm");
    var na=k.slider("Ouverture numérique NA",0.4,1.4,0.05,1.25,"");
    var img=k.slider("Taille mesurée sur l'image",1,100,1,20,"mm");
    var G=k.select("Grossissement",[[40,"× 40"],[100,"× 100"],[400,"× 400"],[1000,"× 1 000"],[10000,"× 10 000"],[50000,"× 50 000"]],1000);
    var ro=k.readouts(["Résolution d","Taille réelle de l'objet mesuré"]);
    var O=[["ADN (diamètre)",2],["ribosome",25],["virus (≈ 100 nm)",100],["mitochondrie",1000],["bactérie",2000],["globule rouge",7500],["hépatocyte",25000],["ovocyte",120000]];
    k.draw(function(){
      c.clear(); var ctx=c.ctx;
      var d = mode.value==="opt" ? 0.61*lam.value/na.value : 0.5;
      var L0=-0.5,L1=5.3, X=function(nm){ return 30+(Math.log10(nm)-L0)/(L1-L0)*(c.W-50); };
      var y0=200;
      S.draw.line(c,30,y0,c.W-20,y0,"#8a95a3",1.4);
      [[1,"1 nm"],[10,"10 nm"],[100,"100 nm"],[1000,"1 µm"],[10000,"10 µm"],[100000,"100 µm"]].forEach(function(t){ S.draw.line(c,X(t[0]),y0-4,X(t[0]),y0+4,"#8a95a3",1.2); S.draw.text(c,t[1],X(t[0]),y0+16,{size:10,color:P.grey}); });
      ctx.fillStyle="rgba(180,35,24,.10)"; ctx.fillRect(30,40,X(d)-30,y0-40);
      S.draw.line(c,X(d),40,X(d),y0,P.red,2);
      S.draw.text(c,"limite de résolution : "+(d<1?S.fmt(d,1)+" nm":S.fmt(d,0)+" nm"),Math.min(X(d)+6,c.W-170),52,{size:11,color:P.red,align:"left"});
      S.draw.text(c,"non résolu",Math.max(60,X(d)/2+12),68,{size:11,color:P.red});
      O.forEach(function(o,i){ var x=X(o[1]), vis=o[1]>=d; var yy=y0-34-(i%3)*34; S.draw.line(c,x,y0,x,yy+8,vis?P.green:"#c0c8d4",1,[3,3]); S.draw.dot(c,x,y0,5,vis?P.green:P.grey); S.draw.text(c,o[0],x,yy,{size:10,color:vis?P.green:P.grey}); });
      S.draw.text(c,"Échelle logarithmique (nm)",c.W/2,y0+40,{size:11,color:P.ink});
      ro.set(0,d<1?S.fmt(d,2)+" nm":S.fmt(d,0)+" nm");
      var real=img.value*1e6/G.value; /* nm */
      ro.set(1,real>=1000?S.fmt(real/1000,2)+" µm":S.fmt(real,1)+" nm");
      S.draw.text(c,"Vert = taille ≥ résolution (structure distinguable) ; gris = trop petit pour cette technique.",c.W/2,c.H-14,{size:11,color:P.ink});
    });
    k.note("Électronique : valeur indicative de 0,5 nm pour des préparations biologiques (limitée par les aberrations et la préparation, pas par λ). Le critère « taille ≥ d » simplifie : la résolution est la plus petite distance séparant deux points distincts.","warn");
  }
});

SFA.sim({
  id:"ub-c02-surface-volume", ch:"c02", tag:"Taille cellulaire",
  titre:"Rapport surface/volume : pourquoi les cellules sont petites",
  resume:"S/V = 3/r pour une sphère ; microvillosités ; temps de diffusion jusqu'au centre.",
  but:"Fais varier le rayon, le facteur de microvillosités et le coefficient de diffusion. Compare la sphère au cube de même volume et lis le temps de diffusion.",
  aRetenir:"Sphère : S = 4πr², V = 4/3·πr³, S/V = 3/r. Doubler r divise S/V par 2 mais multiplie le temps de diffusion par 4 (t ≈ r²/6D). À volume donné, la sphère a la plus petite surface ; les microvillosités multiplient la surface d'échange sans changer beaucoup le volume.",
  piege:"Une grande cellule n'est pas « impossible » : elle compense (cytoplasme en mouvement, multinucléation, forme aplatie ou allongée, repliements membranaires).",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(320);
    var r=k.slider("Rayon de la cellule sphérique",0.5,60,0.5,10,"µm");
    var mv=k.slider("Facteur de microvillosités (surface ×)",1,30,1,1,"");
    var D=k.slider("Coefficient de diffusion D",10,1000,10,100,"µm²/s");
    var ro=k.readouts(["Surface S","Volume V","S/V sphère","S/V cube de même volume","Temps de diffusion t = r²/6D"]);
    var nt=k.note("","");
    k.draw(function(){
      c.clear(); var ctx=c.ctx;
      var ax=S.draw.axes(c,{x0:0,x1:60,y0:0,y1:6,stepX:10,stepY:1,xl:"rayon (µm)",yl:"S/V (µm⁻¹)"});
      S.draw.fn(c,ax,function(x){return x>0?3/x:NaN;},P.acc,2.4);
      if(mv.value>1) S.draw.fn(c,ax,function(x){return x>0?3/x*mv.value:NaN;},P.green,2,[5,4]);
      [[1,"bactérie"],[4,"lymphocyte"],[12,"hépatocyte"],[60,"ovocyte"]].forEach(function(t){ S.draw.line(c,ax.X(t[0]),ax.T,ax.X(t[0]),ax.B,"#c8d1de",1,[3,3]); S.draw.text(c,t[1],ax.X(t[0])+3,ax.T+10,{size:10,color:P.grey,align:t[0]>50?"right":"left"}); });
      var rv=r.value, sv=3/rv*mv.value;
      S.draw.dot(c,ax.X(rv),ax.Y(Math.min(sv,6)),6,P.red);
      var S0=4*Math.PI*rv*rv, V=4/3*Math.PI*Math.pow(rv,3), a=Math.pow(V,1/3), Sc=6*a*a;
      function dd(x){return x<10?2:x<100?1:0;} ro.set(0,S.fmt(S0*mv.value,dd(S0*mv.value))+" µm²"); ro.set(1,S.fmt(V,dd(V))+" µm³"); ro.set(2,S.fmt(sv,3)+" µm⁻¹"); ro.set(3,S.fmt(Sc/V*mv.value,3)+" µm⁻¹");
      var t=rv*rv/(6*D.value); ro.set(4,t<1?S.fmt(t*1000,1)+" ms":S.fmt(t,2)+" s");
      nt.set("Courbe bleue : sphère ; tirets verts : avec microvillosités (×"+S.fmt(mv.value,0)+"). Le cube de même volume expose "+S.fmt((Sc/S0-1)*100,1)+" % de surface en plus que la sphère (forme moins compacte)."+(sv>6?" Le point rouge est collé en haut du graphique : S/V = "+S.fmt(sv,1)+" µm⁻¹ dépasse l'échelle.":""),t>2?"warn":"ok");
    });
  }
});

SFA.sim({
  id:"ub-c02-centrifugation", ch:"c02", tag:"Technique · fractionnement",
  titre:"Centrifugation différentielle : qui sédimente à quelle vitesse ?",
  resume:"Choisis l'accélération et la durée : vois quels organites forment un culot et lesquels restent en surnageant.",
  but:"Modèle de Stokes pour des particules sphériques dans du saccharose 0,25 M (ρ = 1,03 g/mL, η = 2,0 mPa·s). Un organite « culotte » s'il parcourt au moins 6 cm (hauteur du tube).",
  aRetenir:"Vitesse de sédimentation (Stokes) : v = 2r²(ρ<sub>p</sub> − ρ<sub>m</sub>)·a / 9η, avec a = RCF × 9,81. Elle croît avec le carré du rayon : noyaux d'abord (≈ 1 000 g), puis mitochondries (≈ 10 000-20 000 g), puis microsomes (≈ 100 000 g), enfin ribosomes (> 100 000 g, plusieurs heures). Le surnageant final contient le cytosol.",
  piege:"Le modèle suppose une particule isolée et diluée, une accélération constante sur tout le tube (en réalité elle varie avec la distance à l'axe) et des organites sphériques. Les valeurs réelles de protocole dépendent du rotor.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(320);
    var g=k.select("Accélération relative (RCF)",[[1000,"1 000 g"],[5000,"5 000 g"],[10000,"10 000 g"],[20000,"20 000 g"],[100000,"100 000 g"],[150000,"150 000 g"]],10000);
    var t=k.slider("Durée",1,240,1,20,"min");
    var ro=k.readouts(["Organites en culot","Organites en surnageant"]);
    var O=[["Noyaux",3,1.30,P.violet],["Mitochondries",0.4,1.19,P.red],["Lysosomes",0.25,1.12,P.amber],["Microsomes",0.05,1.15,P.teal],["Ribosomes",0.0125,1.60,P.green]];
    k.draw(function(){
      c.clear(); var ctx=c.ctx, a=parseFloat(g.value)*9.81, T=t.value*60, eta=2.0e-3, rm=1030;
      var left=120, right=c.W-20, lo=-4, hi=2, X=function(cm){ return left+(Math.log10(cm)-lo)/(hi-lo)*(right-left); };
      var pel=[],sup=[];
      S.draw.text(c,"Distance parcourue en "+t.value+" min à "+g.value+" g (échelle log, cm)",c.W/2,16,{size:12,color:P.ink});
      O.forEach(function(o,i){
        var v=2*Math.pow(o[1]*1e-6,2)*(o[2]*1000-rm)*a/(9*eta), dcm=v*T*100, y=56+i*46;
        var ok=dcm>=6; (ok?pel:sup).push(o[0]);
        S.draw.text(c,o[0],8,y,{size:12,color:o[3],align:"left"});
        ctx.fillStyle=ok?o[3]:"#c8d1de"; var w=Math.max(2,X(Math.max(dcm,1e-4))-left); ctx.fillRect(left,y-10,Math.min(w,right-left),20);
        var lab=(dcm<0.01?dcm.toExponential(1).replace(".",",").replace("e-","·10^-"):dcm>=1000?dcm.toExponential(1).replace(".",",").replace("e+","·10^"):S.fmt(dcm,dcm<1?2:1))+" cm"; var wc=Math.min(w,right-left);
        if(wc>110) S.draw.text(c,lab,left+wc-6,y,{size:11,color:ok?"#fff":P.ink,align:"right"}); else S.draw.text(c,lab,left+wc+6,y,{size:11,color:P.ink,align:"left"});
      });
      S.draw.line(c,X(6),40,X(6),c.H-20,P.red,1.8,[5,4]); S.draw.text(c,"6 cm = fond du tube",X(6)-4,c.H-12,{size:10,color:P.red,align:"right"});
      ro.set(0,pel.length?pel.join(", "):"aucun"); ro.set(1,sup.length?sup.join(", "):"aucun");
    });
    k.note("Valeurs choisies pour l'exercice : noyau r = 3 µm, ρ = 1,30 ; mitochondrie r = 0,4 µm, ρ = 1,19 ; lysosome r = 0,25 µm, ρ = 1,12 ; microsome r = 50 nm, ρ = 1,15 ; ribosome r = 12,5 nm, ρ = 1,60 g/mL. Ordres de grandeur, pas des mesures.","warn");
  }
});

SFA.sim({
  id:"ub-c02-voie-secretion", ch:"c02", tag:"Endomembranes · niche",
  titre:"Voie de sécrétion : où va ma protéine ? (et si ça casse)",
  resume:"Suis une protéine du ribosome à sa destination et teste une mutation ou un inhibiteur.",
  but:"Choisis la protéine et une perturbation, puis avance étape par étape. Le trajet affiché s'arrête là où la protéine reste bloquée.",
  aRetenir:"Les protéines sécrétées, membranaires et lysosomales sont synthétisées sur le RE rugueux (peptide signal), puis Golgi (maturation, adressage), puis vésicules. Les protéines cytosoliques, mitochondriales et nucléaires sont synthétisées par des ribosomes libres ; les deux dernières sont importées après traduction grâce à un signal (présequence, signal de localisation nucléaire).",
  piege:"Une mutation du peptide signal d'une protéine sécrétée la laisse dans le cytosol (dégradée), pas dans le RE. L'absence de mannose-6-phosphate ne bloque pas l'enzyme lysosomale : elle est sécrétée par défaut.",
  build:function(k,S){
    var P=S.draw.palette, c=k.canvas(330);
    var prot=k.select("Protéine",[["sec","Hormone sécrétée (ex. insuline)"],["mem","Protéine de la membrane plasmique"],["lyso","Enzyme lysosomale"],["cyt","Enzyme cytosolique"],["mit","Protéine mitochondriale"],["nuc","Protéine nucléaire"]],"sec");
    var per=k.select("Perturbation",[["none","Aucune"],["bfa","Inhibiteur du transport RE → Golgi (brefeldine A)"],["sig","Mutation du signal d'adressage"],["m6p","Absence de l'étiquette mannose-6-phosphate"]],"none");
    var st=k.slider("Étape",0,4,1,0,"");
    var ro=k.readouts(["Compartiment actuel","Destination finale"]);
    var nt=k.note("","");
    var NODE={cyt:["Ribosome libre\net cytosol",0,0],rer:["RE rugueux",1,0],gol:["Golgi",2,0],ves:["Vésicule\nde sécrétion",3,0],ext:["Membrane /\nextérieur",4,0],end:["Endosome\ntardif",3,1],lys:["Lysosome",4,1],mit:["Mitochondrie",1,2],nuc:["Noyau",2,2],deg:["Protéasome\n(dégradation)",0,1]};
    var TXT={cyt:"Traduction : si un peptide signal du RE apparaît, le ribosome est amené sur le RE (cotraductionnel).",rer:"Translocation dans le RE rugueux ; repliement, glycosylation initiale.",gol:"Maturation dans le Golgi ; triage, ajout de mannose-6-phosphate pour les enzymes lysosomales.",ves:"Bourgeonnement de vésicules de sécrétion.",ext:"Exocytose (ou insertion dans la membrane).",end:"Fusion avec l'endosome tardif (pH plus acide).",lys:"Lysosome : hydrolases actives (pH ≈ 5).",mit:"Import post-traductionnel par les translocases des membranes mitochondriales.",nuc:"Entrée par les pores nucléaires (signal de localisation nucléaire).",deg:"Protéine mal adressée : ubiquitinée puis dégradée par le protéasome."};
    function route(){
      var p=prot.value, q=per.value, r;
      var base={sec:["cyt","rer","gol","ves","ext"],mem:["cyt","rer","gol","ves","ext"],lyso:["cyt","rer","gol","end","lys"],cyt:["cyt"],mit:["cyt","mit"],nuc:["cyt","nuc"]}[p].slice(), note="";
      var dest={sec:"sécrétée dans le milieu extracellulaire",mem:"insérée dans la membrane plasmique",lyso:"dans la lumière du lysosome",cyt:"reste dans le cytosol",mit:"importée dans la mitochondrie",nuc:"importée dans le noyau"}[p];
      if(q==="bfa" && (p==="sec"||p==="mem"||p==="lyso")){ base=["cyt","rer"]; dest="bloquée dans le RE (le Golgi se désorganise, le transport antérograde cesse)"; note="Conséquence : accumulation dans le RE, plus de sécrétion."; }
      else if(q==="sig" && p!=="cyt"){ base=["cyt","deg"]; dest="restée dans le cytosol puis dégradée (signal d'adressage absent)"; note="Sans signal, la protéine n'est pas adressée au bon compartiment."; }
      else if(q==="m6p" && p==="lyso"){ base=["cyt","rer","gol","ves","ext"]; dest="sécrétée hors de la cellule (voie par défaut) : le lysosome en manque"; note="Absence d'étiquette M6P : les enzymes lysosomales sont sécrétées ; les lysosomes se chargent de substrats non digérés (type maladie à inclusions)."; }
      else if(q!=="none"){ note="Cette perturbation n'affecte pas cette protéine : trajet inchangé."; }
      return {path:base,dest:dest,note:note};
    }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, R=route(), W=c.W, cw=W/5, bh=54;
      st.el.max=Math.max(0,R.path.length-1); if(st.value>st.el.max) st.set(st.el.max);
      function pos(id){ var n=NODE[id]; return [cw*(n[1]+0.5), 62+n[2]*100]; }
      for(var id in NODE){ var p=pos(id), act=R.path.indexOf(id)>=0 && R.path.indexOf(id)<=st.value; var cur=R.path[st.value]===id;
        ctx.fillStyle=cur?P.acc:(act?"#bcd0f3":"#eef1f6"); ctx.strokeStyle=cur?P.acc:"#c8d1de"; ctx.lineWidth=1.5; var w=cw-14;
        ctx.beginPath(); ctx.roundRect?ctx.roundRect(p[0]-w/2,p[1]-bh/2,w,bh,8):ctx.rect(p[0]-w/2,p[1]-bh/2,w,bh); ctx.fill(); ctx.stroke();
        NODE[id][0].split("\n").forEach(function(line,li,arr){ S.draw.text(c,line,p[0],p[1]+(li-(arr.length-1)/2)*13,{size:Math.max(9,Math.min(11,cw/9)),color:cur?"#fff":P.ink}); }); }
      for(var i=0;i<R.path.length-1;i++){ var a=pos(R.path[i]), b=pos(R.path[i+1]); var on=i<st.value; var dx=b[0]-a[0], dy=b[1]-a[1], len=Math.hypot(dx,dy), ux=dx/len, uy=dy/len;
        var hw=(cw-14)/2, tt=Math.min(ux?hw/Math.abs(ux):1e9,uy?(bh/2)/Math.abs(uy):1e9)+3;
        S.draw.arrow(c,a[0]+ux*tt,a[1]+uy*tt,b[0]-ux*tt,b[1]-uy*tt,on?P.acc:"#9aa6b6",on?3:2); }
      S.draw.text(c,"Ligne du bas : import post-traductionnel (ribosomes libres).",c.W/2,c.H-14,{size:10,color:P.grey});
      var cur=R.path[st.value]; ro.set(0,NODE[cur][0].replace("\n"," ")); ro.set(1,st.value===R.path.length-1?R.dest:"…");
      nt.set(TXT[cur]+(st.value===R.path.length-1&&R.note?" <b>"+R.note+"</b>":""),st.value===R.path.length-1&&R.note?"warn":"ok");
    });
  }
});
