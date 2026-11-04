/* Chimie BA1 · compléments · chapitre 10 : alcools, carbonyles, acides et dérivés */
(function(){
var P = function(){ return SFA.draw.palette; };

/* ---------- 1. Alcools : oxydation, déshydratation, substitution ---------- */
var ALC = {
  et:{n:"éthanol",c:"primaire",no:-1,ox:["éthanal","acide éthanoïque"],de:["éthène","E1/E2 : à 170 °C ; à 140 °C : éther (CH₃CH₂)₂O"],hx:["bromoéthane","SN2 (H⁺ protonne OH, Br⁻ déplace H₂O)"]},
  p1:{n:"propan-1-ol",c:"primaire",no:-1,ox:["propanal","acide propanoïque"],de:["propène","E1/E2 à chaud, H₂SO₄ concentré"],hx:["1-bromopropane","SN2"]},
  p2:{n:"propan-2-ol",c:"secondaire",no:0,ox:["propanone (acétone)",null],de:["propène","E1 (cation secondaire)"],hx:["2-bromopropane","SN1/SN2 mixte"]},
  b2:{n:"butan-2-ol",c:"secondaire",no:0,ox:["butanone",null],de:["but-2-ène (majoritaire, Zaitsev, surtout trans) + but-1-ène","E1 : alcène le plus substitué favorisé"],hx:["2-bromobutane (racémique)","SN1/SN2 : mélange des deux énantiomères"]},
  cy:{n:"cyclohexanol",c:"secondaire",no:0,ox:["cyclohexanone",null],de:["cyclohexène","E1"],hx:["bromocyclohexane","SN1/SN2"]},
  t:{n:"2-méthylpropan-2-ol",c:"tertiaire",no:1,ox:[null,null],de:["2-méthylpropène","E1 : cation tertiaire, très facile (déjà à ≈ 50 °C avec H₂SO₄ dilué)"],hx:["2-bromo-2-méthylpropane","SN1 : le plus rapide (cation tertiaire), à froid"]}
};
SFA.sim({
  id:"uc-c10-alcools-reactivite", ch:"c10", tag:"Alcools",
  titre:"Alcools primaire, secondaire, tertiaire : qui réagit comment ?",
  resume:"Oxydation douce ou forte, déshydratation, substitution par HBr : produit et nombre d’oxydation du carbone.",
  but:"Choisis un alcool et un réactif. L’échelle d’oxydation montre où le carbone portant OH s’arrête ; la classe de l’alcool (nombre de H sur ce carbone) décide de tout.",
  aRetenir:"Primaire : alcool → aldéhyde (PCC, ménagé) → acide (oxydant fort). Secondaire : alcool → cétone, s’arrête. Tertiaire : pas d’oxydation (pas de H sur C–OH). Déshydratation (H₂SO₄, chaleur) : Zaitsev, E1. HBr : 3° par SN1 (rapide), 1° par SN2.",
  piege:"Oxyder un alcool tertiaire. Croire qu’un oxydant fort s’arrête à l’aldéhyde (il va à l’acide, car l’aldéhyde s’hydrate et s’oxyde plus vite). Oublier que les produits de substitution/élimination d’un cation sont en compétition.",
  build:function(k,S){
    var c = k.canvas(220);
    var al = k.select("Alcool",[["et","éthanol (1°)"],["p1","propan-1-ol (1°)"],["p2","propan-2-ol (2°)"],["b2","butan-2-ol (2°)"],["cy","cyclohexanol (2°)"],["t","2-méthylpropan-2-ol (3°)"]],"et");
    var re = k.select("Réactif",[["pcc","PCC (oxydation ménagée)"],["jones","CrO₃/H₂SO₄ ou KMnO₄ chaud (oxydation forte)"],["de","H₂SO₄ concentré, chaleur"],["hx","HBr concentré"]],"pcc");
    var nt = k.note("","");
    var nt2 = k.note("","ok");
    k.draw(function(){
      var a=ALC[al.value], r=re.value; c.clear(); var ctx=c.ctx;
      var names, nos;
      if (a.c==="primaire"){ names=["alcool primaire","aldéhyde","acide carboxylique"]; nos=[-1,1,3]; }
      else if (a.c==="secondaire"){ names=["alcool secondaire","cétone","(rupture C–C : hors sujet)"]; nos=[0,2,null]; }
      else { names=["alcool tertiaire","—","—"]; nos=[1,null,null]; }
      var reach=0;
      if (r==="pcc") reach=a.c==="primaire"?1:a.c==="secondaire"?1:0;
      if (r==="jones") reach=a.c==="primaire"?2:a.c==="secondaire"?1:0;
      var bw=Math.min(180,(c.W-60)/3-20), x0=30;
      for (var i=0;i<3;i++){
        var x=x0+i*(bw+30), y=70, ok=(nos[i]!==null);
        ctx.save(); ctx.fillStyle=!ok?"#f3f4f6":(i<=reach&&(r==="pcc"||r==="jones")?"rgba(46,107,85,.18)":"rgba(30,63,143,.07)"); ctx.fillRect(x,y,bw,86); ctx.strokeStyle=!ok?"#cbd1d9":(i===reach&&(r==="pcc"||r==="jones")?P().green:"#1e3f8f"); ctx.lineWidth=(i===reach&&(r==="pcc"||r==="jones"))?3:1.5; ctx.strokeRect(x,y,bw,86); ctx.restore();
        S.draw.text(c,names[i],x+bw/2,y+26,{size:12,color:ok?P().ink:P().grey});
        if (ok) S.draw.text(c,"n.o. de C : "+String(nos[i]>0?"+"+nos[i]:nos[i]).replace("-","−"),x+bw/2,y+58,{size:12,color:P().acc});
        if (i<2){ var arrowOk=(nos[i+1]!==null)&&(r==="pcc"||r==="jones")&&i<reach; S.draw.arrow(c,x+bw+2,y+43,x+bw+28,y+43,arrowOk?P().green:"#cbd1d9",3); }
      }
      S.draw.text(c,"Échelle d’oxydation du carbone portant OH (plus le n.o. augmente, plus il est oxydé)",c.W/2,28,{size:12,color:P().grey});
      if (r==="pcc"||r==="jones"){
        var pr=a.ox[Math.min(reach,1)];
        var what=reach===0&&a.c==="tertiaire"?"Aucune réaction : le carbone porte OH mais pas de H, il faudrait rompre une liaison C–C.":("Produit : <b>"+(a.c==="primaire"&&r==="jones"?a.ox[1]:a.ox[0])+"</b>.");
        nt2.set(what,a.c==="tertiaire"?"warn":"ok");
        nt.set(r==="pcc"?"<b>PCC (ou Swern) :</b> oxydation ménagée en milieu anhydre : le primaire s’arrête à l’aldéhyde, le secondaire donne la cétone."+(a.c==="primaire"?" Le Δn.o. de C est +2 (−I → +I).":""):"<b>Oxydant fort en milieu aqueux :</b> le primaire passe par l’aldéhyde (qui s’hydrate en gem-diol) puis donne l’acide ; le secondaire s’arrête à la cétone ; le tertiaire ne réagit pas. Cr(VI) orange → Cr(III) vert (test d’alcoolémie).","");
      } else if (r==="de"){
        nt.set("<b>Déshydratation :</b> H₂SO₄ protone OH (qui devient le bon groupe partant H₂O), puis perte de H⁺ voisin. Réactivité 3° &gt; 2° &gt; 1° (stabilité du carbocation). "+a.de[1]+".","");
        nt2.set("Produit : <b>"+a.de[0]+"</b>.","ok");
      } else {
        nt.set("<b>Substitution par HBr :</b> OH est un mauvais groupe partant ; H⁺ le transforme en H₂O⁺. "+a.hx[1]+". Réactivité 3° &gt; 2° &gt; 1° pour SN1, et 1° &gt; 2° pour SN2.","");
        nt2.set("Produit : <b>"+a.hx[0]+"</b>.","ok");
      }
    });
  }
});

/* ---------- 2. Acidité des acides carboxyliques et pH ---------- */
var ACI = [["hco","acide méthanoïque (formique)",3.75],["ac","acide éthanoïque (acétique)",4.76],["pro","acide propanoïque",4.87],["but","acide butanoïque",4.82],["cl4","acide 4-chlorobutanoïque",4.52],["cl3","acide 3-chlorobutanoïque",4.06],["cl2","acide 2-chlorobutanoïque",2.84],["clac","acide chloroéthanoïque",2.87],["dclac","acide dichloroéthanoïque",1.35],["tclac","acide trichloroéthanoïque",0.66],["benz","acide benzoïque",4.20],["asp","aspirine (acide acétylsalicylique)",3.5],["ibu","ibuprofène",4.4],["phe","phénol (pas un acide carboxylique)",10.0],["eth","éthanol (pas un acide carboxylique)",16.0]];
SFA.sim({
  id:"uc-c10-acidite-carboxylique", ch:"c10", tag:"pKa et structure",
  titre:"Acidité des acides carboxyliques et ionisation selon le pH",
  resume:"Effet inductif et résonance du carboxylate ; % ionisé dans l’estomac, l’intestin et le sang.",
  but:"Choisis un acide et un pH. Compare son pKa à celui des autres : les atomes électroattracteurs (Cl) rapprochés du COOH renforcent l’acide. La courbe donne la fraction ionisée.",
  aRetenir:"Carboxylate = résonance sur 2 O (délocalisation) : acide carboxylique (pKa ≈ 4–5) ≫ phénol (≈ 10) ≫ alcool (≈ 16). Un substituant électroattracteur proche stabilise RCOO⁻ (effet inductif −I) et abaisse le pKa ; l’effet s’atténue avec la distance (2-Cl : 2,84 ; 3-Cl : 4,06 ; 4-Cl : 4,52). % ionisé = 1/(1 + 10<sup>pKa − pH</sup>).",
  piege:"Confondre pKa bas et base forte. Penser qu’un acide « faible » est peu ionisé à tout pH : au pH sanguin 7,4, tous les acides carboxyliques usuels sont ≥ 99 % ionisés. Seule la forme neutre traverse facilement les membranes.",
  build:function(k,S){
    var c = k.canvas(300);
    var sel = k.select("Composé",ACI.map(function(a){ return [a[0],a[1]+" (pKa "+String(a[2]).replace(".",",")+")"]; }),"ac");
    var ph = k.slider("pH",0,14,0.1,7.4,"");
    var ro = k.readouts(["pKa","% ionisé à ce pH","% neutre","% ionisé à pH 1,5 (estomac)"]);
    var nt = k.note("","");
    function pk(){ return ACI.filter(function(a){ return a[0]===sel.value; })[0][2]; }
    function alpha(p,h){ return 1/(1+Math.pow(10,p-h)); }
    k.draw(function(){
      c.clear(); var p=pk();
      var ax=S.draw.axes(c,{x0:0,x1:14,y0:0,y1:100,xl:"pH",yl:"% ionisé (RCOO⁻)",stepX:2,stepY:25,l:52});
      S.draw.fn(c,ax,function(h){ return 100*alpha(4.76,h); },P().grey,1.6,[5,4]);
      S.draw.fn(c,ax,function(h){ return 100*alpha(p,h); },P().acc,3);
      S.draw.line(c,ax.X(p),ax.B,ax.X(p),ax.Y(50),P().amber,1.6,[4,4]); S.draw.text(c,"pH = pKa : 50 %",ax.X(p),ax.Y(50)-12,{size:11,color:P().amber,bg:"#fff"});
      [[1.5,"estomac"],[7.4,"sang"]].forEach(function(z){ S.draw.line(c,ax.X(z[0]),ax.T,ax.X(z[0]),ax.B,"#cbd1d9",1.2,[2,4]); S.draw.text(c,z[1],ax.X(z[0]),ax.T+8,{size:10.5,color:P().grey}); });
      var a=alpha(p,ph.value); S.draw.dot(c,ax.X(ph.value),ax.Y(100*a),6,P().red);
      ro.set(0,S.fmt(p,2)); ro.set(1,S.fmt(100*a,a>0.99||a<0.01?3:1)+" %"); ro.set(2,S.fmt(100*(1-a),a>0.99||a<0.01?3:1)+" %"); ro.set(3,S.fmt(100*alpha(p,1.5),2)+" %");
      nt.set(p<2?"Acide fort : carboxylate fortement stabilisé par l’effet inductif des atomes électronégatifs.":p<6?"Acide carboxylique typique : résonance du carboxylate + éventuel effet inductif.":p<12?"Phénol : l’anion est stabilisé par résonance dans le cycle, mais la charge reste sur O avec une délocalisation moins efficace.":"Alcool : l’alcoolate n’a aucune stabilisation par résonance, d’où un pKa proche de celui de l’eau.","");
    });
    k.note("Courbe grise : acide éthanoïque (référence). Les pKa sont des valeurs usuelles à 25 °C ; l’effet des solvants et de la température n’est pas modélisé.","");
  }
});

/* ---------- 3. Estérification : un équilibre ---------- */
SFA.sim({
  id:"uc-c10-esterification-equilibre", ch:"c10", tag:"Équilibre",
  titre:"Estérification de Fischer : rendement et déplacement de l’équilibre",
  resume:"Acide + alcool ⇌ ester + eau : K ≈ 4, excès d’alcool, élimination de l’eau, hydrolyse et saponification.",
  but:"Fais varier l’excès d’alcool, l’élimination de l’eau et la constante K. Compare au cas de la saponification, qui est totale car le carboxylate formé ne réagit plus.",
  aRetenir:"RCOOH + R′OH ⇌ RCOOR′ + H₂O, K ≈ 4 (acide acétique + éthanol, 25 °C) : avec des quantités équimolaires, rendement 2/3 ≈ 67 %. Le catalyseur acide accélère mais ne change pas K. On déplace l’équilibre (Le Chatelier) par un excès d’un réactif ou en retirant l’eau (Dean-Stark). Saponification (RCOOR′ + OH⁻ → RCOO⁻ + R′OH) : quasi totale.",
  piege:"Croire que le catalyseur améliore le rendement. Confondre rendement (≤ 67 % à l’équilibre en proportions stœchiométriques) et vitesse. Appliquer le même raisonnement à la saponification : sa constante d’équilibre est immense.",
  build:function(k,S){
    var c = k.canvas(300);
    var mode = k.seg("Réaction",[["est","Estérification"],["hyd","Hydrolyse acide"],["sap","Saponification (NaOH)"]],"est");
    var K = k.slider("Constante K",1,20,0.5,4,"");
    var eq = k.slider("Équivalents d’alcool (ou d’eau en hydrolyse)",0.5,10,0.5,1,"");
    var f = k.slider("Fraction de l’eau retirée (Dean-Stark)",0,95,5,0,"%");
    var ro = k.readouts(["Rendement à l’équilibre","Ester","Acide","Eau"]);
    var nt = k.note("","");
    function yieldX(Kv,b,fr){ var a=1, A=Kv-(1-fr), Bq=-Kv*(a+b), C=Kv*a*b; if (Math.abs(A)<1e-9) return -C/Bq; var d=Bq*Bq-4*A*C; var x1=(-Bq-Math.sqrt(d))/(2*A), x2=(-Bq+Math.sqrt(d))/(2*A); var lim=Math.min(a,b); var x=x1; if (!(x>=0&&x<=lim)) x=x2; return Math.max(0,Math.min(lim,x)); }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, fr=f.value/100, b=eq.value, x;
      if (mode.value==="sap") x=1;
      else if (mode.value==="est") x=yieldX(K.value,b,fr);
      else { /* hydrolyse : (K−1)x² + (1+b)x − b = 0 */
        var A2=K.value-1, B2=1+b, C2=-b; x=Math.abs(A2)<1e-9?-C2/B2:(-B2+Math.sqrt(B2*B2-4*A2*C2))/(2*A2); x=Math.max(0,Math.min(1,x)); }
      var comp;
      if (mode.value==="est"){ comp=[x,1-x,b-x,x*(1-fr)]; }
      else if (mode.value==="hyd"){ comp=[1-x,x,x,eq.value-x]; }
      else comp=[0,1,0,0];
      /* courbe rendement contre équivalents (estérification) */
      var ax=S.draw.axes(c,{x0:0,x1:10,y0:0,y1:100,xl:"équivalents d’alcool",yl:"rendement (%)",stepX:2,stepY:25,l:52});
      S.draw.fn(c,ax,function(bb){ return 100*yieldX(K.value,Math.max(bb,0.01),fr); },P().acc,2.6);
      S.draw.fn(c,ax,function(bb){ return 100*yieldX(K.value,Math.max(bb,0.01),0); },P().grey,1.4,[5,4]);
      S.draw.line(c,ax.L,ax.Y(66.7),ax.R,ax.Y(66.7),P().amber,1.2,[3,4]); S.draw.text(c,"67 % (K = 4, équimolaire)",ax.R-6,ax.Y(66.7)-9,{size:10.5,color:P().amber,align:"right"});
      if (mode.value==="est") S.draw.dot(c,ax.X(b),ax.Y(100*x),7,P().red);
      if (mode.value==="sap") S.draw.text(c,"Saponification : ≈ 100 % (irréversible)",ax.X(5),ax.Y(50),{size:14,color:P().green});
      if (mode.value==="hyd") S.draw.text(c,"Hydrolyse : rendement en acide = "+S.fmt(x*100,0)+" %",ax.X(5),ax.Y(40),{size:13,color:P().violet});
      var main=mode.value==="est"?x:mode.value==="hyd"?x:1;
      ro.set(0,S.fmt(main*100,0)+" %");
      ro.set(1,S.fmt(comp[0],2)+" mol");
      ro.set(2,S.fmt(comp[1],2)+" mol");
      ro.set(3,S.fmt(comp[3],2)+" mol");
      nt.set(mode.value==="est"?"Pour 1 mol d’acide et "+S.fmt(b,1)+" mol d’alcool, avec K = "+S.fmt(K.value,1)+" : "+S.fmt(x*100,0)+" % d’ester. Courbe grise : sans retrait d’eau. Un excès d’alcool OU le retrait de l’eau déplace l’équilibre.":mode.value==="hyd"?"Hydrolyse acide de 1 mol d’ester avec "+S.fmt(eq.value,1)+" mol d’eau : c’est l’estérification à l’envers (même K). Un grand excès d’eau est nécessaire pour hydrolyser largement.":"En milieu basique, RCOOH formé est immédiatement déprotoné en RCOO⁻ (pKa ≈ 4–5 contre ≈ 16 pour l’alcool) : la réaction est déplacée irréversiblement. C’est le principe du savon (saponification d’un triglycéride).","");
    });
    k.note("Dans l’affichage de l’hydrolyse, « Ester » désigne l’ester restant, « Acide » l’acide formé ; en saponification, la ligne « Ester » est nulle et « Acide » désigne le carboxylate formé (1 mol).","");
  }
});

/* ---------- 4. Réactivité des carbonyles : réducteurs, Grignard, cyanhydrine ---------- */
var SUB = {
  pal:{n:"propanal",t:"aldéhyde",e:5},
  pon:{n:"propanone",t:"cétone",e:4},
  bal:{n:"benzaldéhyde",t:"aldéhyde aromatique",e:4},
  est:{n:"éthanoate d’éthyle",t:"ester",e:2},
  aci:{n:"acide propanoïque",t:"acide carboxylique",e:1}
};
var RCT = {
  nabh4:{t:"NaBH₄ (EtOH, H₂O)",note:"Réducteur doux, utilisable dans l’alcool ou l’eau. Réduit seulement aldéhydes et cétones (et chlorures d’acyle)."},
  lah:{t:"LiAlH₄ (éther anhydre) puis H₃O⁺",note:"Réducteur puissant : tous les carbonyles. Réagit violemment avec l’eau : solvant anhydre obligatoire."},
  mg:{t:"CH₃MgBr (éther) puis H₃O⁺",note:"Le carbanion CH₃⁻ (Grignard) forme une liaison C–C ; aussi une base très forte (détruit tout H acide : eau, alcool, acide)."},
  hcn:{t:"HCN / CN⁻ (cat.)",note:"Addition nucléophile de CN⁻ sur un aldéhyde ou une cétone : cyanhydrine (liaison C–C). Équilibre favorable pour les aldéhydes, plus défavorable pour les cétones encombrées."}
};
var OUT = {
  pal:{nabh4:["propan-1-ol","alcool primaire"],lah:["propan-1-ol","alcool primaire"],mg:["butan-2-ol","alcool secondaire (nouvelle liaison C–C)"],hcn:["2-hydroxybutanenitrile (cyanhydrine)","alcool + nitrile"]},
  pon:{nabh4:["propan-2-ol","alcool secondaire"],lah:["propan-2-ol","alcool secondaire"],mg:["2-méthylpropan-2-ol","alcool tertiaire"],hcn:["2-hydroxy-2-méthylpropanenitrile (cyanhydrine de l’acétone)","alcool tertiaire + nitrile"]},
  bal:{nabh4:["phénylméthanol (alcool benzylique)","alcool primaire"],lah:["phénylméthanol (alcool benzylique)","alcool primaire"],mg:["1-phényléthan-1-ol","alcool secondaire"],hcn:["2-hydroxy-2-phényléthanenitrile (mandélonitrile)","alcool secondaire + nitrile"]},
  est:{nabh4:[null,"pas de réaction dans les conditions usuelles (ester peu électrophile)"],lah:["éthanol (2 équivalents)","2 alcools primaires : l’acyle donne CH₃CH₂OH et l’alcool de l’ester donne aussi éthanol"],mg:["2-méthylpropan-2-ol + éthanol","alcool tertiaire : 2 CH₃ s’additionnent (il faut 2 équivalents)"],hcn:[null,"pas de réaction"]},
  aci:{nabh4:[null,"pas de réduction : NaBH₄ déprotone l’acide (H₂ + carboxylate)"],lah:["propan-1-ol","alcool primaire (après H⁺ ; 1ᵉʳ équivalent consommé par la réaction acide-base)"],mg:[null,"réaction acide-base : CH₄ + carboxylate ; pas d’addition sur C=O"],hcn:[null,"pas de réaction"]}
};
SFA.sim({
  id:"uc-c10-reactivite-carbonyles", ch:"c10", tag:"Carbonyles",
  titre:"Carbonyles : réduction, Grignard et cyanhydrine",
  resume:"Aldéhyde, cétone, ester ou acide face à NaBH₄, LiAlH₄, CH₃MgBr, HCN : produit, classe de l’alcool, limites.",
  but:"Choisis un substrat et un réactif. L’électrophilie de C=O diminue de l’aldéhyde à l’acide : NaBH₄ ne voit que les plus électrophiles, LiAlH₄ presque tous.",
  aRetenir:"Électrophilie de C=O : aldéhyde &gt; cétone &gt; ester &gt; acide / amide. NaBH₄ : aldéhydes et cétones → alcools. LiAlH₄ : tous (ester → 2 alcools primaires, acide → alcool primaire). Grignard sur aldéhyde → alcool 2° ; cétone → 3° ; ester → 3° (2 additions identiques). HCN → cyanhydrine (liaison C–C).",
  piege:"Utiliser LiAlH₄ dans l’eau. Faire réagir un Grignard avec un composé portant un H acide (OH, COOH, NH). Oublier que l’ester réagit deux fois avec RMgX.",
  build:function(k,S){
    var c = k.canvas(220);
    var su = k.select("Substrat",[["pal","propanal (aldéhyde)"],["pon","propanone (cétone)"],["bal","benzaldéhyde"],["est","éthanoate d’éthyle (ester)"],["aci","acide propanoïque"]],"pal");
    var rg = k.select("Réactif",[["nabh4","NaBH₄"],["lah","LiAlH₄"],["mg","CH₃MgBr"],["hcn","HCN / CN⁻"]],"nabh4");
    var nt = k.note("","");
    var nt2 = k.note("","");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, s=SUB[su.value], o=OUT[su.value][rg.value];
      var keys=["pal","pon","bal","est","aci"], bw=(c.W-90)/5;
      S.draw.text(c,"Électrophilie du carbone C=O (qualitative)",c.W/2,16,{size:12,color:P().grey});
      keys.forEach(function(kk,i){ var x=40+i*bw+6, h=SUB[kk].e*24, y=190-h; ctx.save(); ctx.fillStyle=kk===su.value?P().acc:"rgba(30,63,143,.22)"; ctx.fillRect(x,y,bw-12,h); ctx.restore(); S.draw.text(c,SUB[kk].n.replace("éthanoate d’éthyle","éthanoate d’Et").replace("acide propanoïque","ac. propanoïque"),x+(bw-12)/2,203,{size:10.5,color:kk===su.value?P().acc:P().grey}); });
      var reacts=o[0]!==null;
      nt.set("<b>"+RCT[rg.value].t+"</b><br>"+RCT[rg.value].note,"");
      nt2.set(reacts?"<b>"+s.n+" → "+o[0]+"</b><br>"+o[1]:"<b>"+s.n+" + "+RCT[rg.value].t+" : "+o[1]+"</b>",reacts?"ok":"warn");
    });
  }
});

/* ---------- 5. Liaison amide et peptides ---------- */
var AA = [["gly","glycine (Gly)",75.07],["ala","alanine (Ala)",89.09],["ser","sérine (Ser)",105.09],["val","valine (Val)",117.15],["leu","leucine (Leu)",131.17],["phe","phénylalanine (Phe)",165.19],["asp","acide aspartique (Asp)",133.10],["lys","lysine (Lys)",146.19]];
SFA.sim({
  id:"uc-c10-liaison-peptidique", ch:"c10", tag:"Amides",
  titre:"La liaison peptidique : résonance, planéité et dipeptides",
  resume:"Pourquoi la liaison amide est plane et rigide, quelle masse a un dipeptide, combien de séquences existent.",
  but:"Tourne la liaison C–N d’un peptide : l’énergie monte jusqu’à ≈ 80 kJ/mol à 90°, car la résonance du doublet de N avec C=O est rompue. Compose ensuite un dipeptide et compte les séquences possibles.",
  aRetenir:"Amide : le doublet du N se délocalise sur C=O (N–C(=O) ↔ N⁺=C–O⁻) : liaison C–N partielle double (≈ 1,33 Å), atomes O=C–N–H coplanaires, forme trans (ω = 180°) favorisée, barrière de rotation ≈ 80 kJ/mol. L’amide est peu basique (le doublet N est engagé). Dipeptide : M = M(AA₁) + M(AA₂) − M(H₂O). Deux acides différents donnent 2 dipeptides distincts (Gly-Ala ≠ Ala-Gly).",
  piege:"Dessiner la liaison C–N d’un amide comme une simple liaison libre à tourner. Oublier que l’eau est perdue (18 g/mol) à chaque liaison. Une séquence se lit du N-terminal vers le C-terminal.",
  build:function(k,S){
    var c = k.canvas(260);
    var om = k.slider("Angle de torsion ω autour de C–N",0,180,5,180,"°");
    var T = k.slider("Température",280,330,1,298,"K");
    var a1 = k.select("1<sup>er</sup> acide aminé (N-terminal)",AA.map(function(a){ return [a[0],a[1]]; }),"gly");
    var a2 = k.select("2<sup>e</sup> acide aminé (C-terminal)",AA.map(function(a){ return [a[0],a[1]]; }),"ala");
    var ro = k.readouts(["E(ω) relative","Demi-vie de la rotation (barrière 80 kJ/mol)","Dipeptide","Masse molaire"]);
    var nt = k.note("","");
    var R=8.314;
    function En(w){ var r=w*Math.PI/180; return 37.5*(1-Math.cos(2*r))+5*(1+Math.cos(r)); }
    function mm(id){ return AA.filter(function(a){ return a[0]===id; })[0]; }
    k.draw(function(){
      c.clear();
      var ax=S.draw.axes(c,{x0:0,x1:180,y0:0,y1:100,xl:"ω (°)",yl:"E (kJ/mol)",stepX:30,stepY:25,l:52});
      S.draw.fn(c,ax,En,P().acc,3);
      var E=En(om.value); S.draw.dot(c,ax.X(om.value),ax.Y(E),7,P().red);
      S.draw.text(c,"trans (ω = 180°) : minimum",ax.X(170),ax.Y(0)-16,{size:11,color:P().green,align:"right"}); S.draw.text(c,"cis (ω = 0°) : +10",ax.X(0)+8,ax.Y(10)-12,{size:11,color:P().amber,align:"left"}); S.draw.text(c,"90° : barrière ≈ 80",ax.X(90),ax.Y(80)-12,{size:11,color:P().red});
      var barrier=80-0; var kk=1e13*Math.exp(-barrier*1000/(R*T.value)), t12=Math.LN2/kk;
      var p1=mm(a1.value), p2=mm(a2.value), M=p1[2]+p2[2]-18.015;
      var s1=p1[1].match(/\((.*)\)/)[1], s2=p2[1].match(/\((.*)\)/)[1];
      ro.set(0,S.fmt(E,1)+" kJ/mol"); ro.set(1,S.fmt(t12,t12<100?1:0)+" s"); ro.set(2,"H₂N–"+s1+"–"+s2+"–COOH"); ro.set(3,S.fmt(M,2)+" g/mol");
      var same=a1.value===a2.value;
      nt.set("Avec ces deux acides aminés, "+(same?"un seul dipeptide (même acide aminé répété) : "+s1+"-"+s2+".":"on peut former 2 dipeptides différents : "+s1+"-"+s2+" et "+s2+"-"+s1+" (isomères de constitution, même masse).")+" Avec 20 acides aminés : 20² = 400 dipeptides, 20³ = 8 000 tripeptides. Demi-vie : k = A·e<sup>−Ea/RT</sup>, A ≈ 10<sup>13</sup> s<sup>−1</sup> (ordre de grandeur), Ea ≈ 80 kJ/mol : la rotation est lente à l’échelle moléculaire mais pas figée (secondes à minutes).","");
    });
    k.note("Courbe d’énergie : modèle simplifié E = 37,5·(1 − cos 2ω) + 5·(1 + cos ω) (kJ/mol). Le cis est ≈ 10 kJ/mol au-dessus du trans pour un résidu ordinaire (la proline fait exception). Masses molaires moyennes en g/mol.","");
  }
});
})();
