/* Chimie BA1 · compléments · chapitre 9 : additions sur les alcènes */
(function(){
var P = function(){ return SFA.draw.palette; };

/* ---------- 1. Addition électrophile : produits et carbocations ---------- */
var ALK = {
  pr:{n:"propène",f:"CH₃–CH=CH₂",maj:"2°",mino:"1°",s:"CH₃–CH⁺–CH₃ (secondaire) plutôt que CH₃–CH₂–CH₂⁺ (primaire)"},
  ib:{n:"2-méthylpropène",f:"(CH₃)₂C=CH₂",maj:"3°",mino:"1°",s:"(CH₃)₃C⁺ (tertiaire) plutôt que (CH₃)₂CH–CH₂⁺ (primaire)"},
  b1:{n:"but-1-ène",f:"CH₃CH₂–CH=CH₂",maj:"2°",mino:"1°",s:"CH₃CH₂–CH⁺–CH₃ (secondaire) plutôt que primaire"},
  ch:{n:"cyclohexène",f:"C₆H₁₀ (cycle)",maj:"2°",mino:"2°",s:"cation secondaire des deux côtés : aucune régiosélectivité à discuter"},
  mb2:{n:"2-méthylbut-2-ène",f:"(CH₃)₂C=CH–CH₃",maj:"3°",mino:"2°",s:"(CH₃)₂C⁺–CH₂CH₃ (tertiaire) plutôt que (CH₃)₂CH–CH⁺–CH₃ (secondaire)"},
  mb1:{n:"3-méthylbut-1-ène",f:"(CH₃)₂CH–CH=CH₂",maj:"2°",mino:"1°",s:"cation secondaire (CH₃)₂CH–CH⁺–CH₃, qui peut se transposer en tertiaire par glissement d’hydrure"}
};
var RES = {
  pr:{hbr:["2-bromopropane","1-bromopropane (traces)"],h2o:["propan-2-ol","propan-1-ol (traces)"],br2:["1,2-dibromopropane (racémique)",""],rad:["1-bromopropane","2-bromopropane (traces)"],h2:["propane",""]},
  ib:{hbr:["2-bromo-2-méthylpropane","1-bromo-2-méthylpropane (traces)"],h2o:["2-méthylpropan-2-ol","2-méthylpropan-1-ol (traces)"],br2:["1,2-dibromo-2-méthylpropane (achiral)",""],rad:["1-bromo-2-méthylpropane","2-bromo-2-méthylpropane (traces)"],h2:["2-méthylpropane",""]},
  b1:{hbr:["2-bromobutane (racémique)","1-bromobutane (traces)"],h2o:["butan-2-ol (racémique)","butan-1-ol (traces)"],br2:["1,2-dibromobutane (racémique)",""],rad:["1-bromobutane","2-bromobutane (traces)"],h2:["butane",""]},
  ch:{hbr:["bromocyclohexane",""],h2o:["cyclohexanol",""],br2:["trans-1,2-dibromocyclohexane (racémique)","cis : pas observé"],rad:["bromocyclohexane (aucune régiosélectivité)",""],h2:["cyclohexane",""]},
  mb2:{hbr:["2-bromo-2-méthylbutane","2-bromo-3-méthylbutane (traces)"],h2o:["2-méthylbutan-2-ol","3-méthylbutan-2-ol (traces)"],br2:["2,3-dibromo-2-méthylbutane (racémique)",""],rad:["2-bromo-3-méthylbutane (racémique)","2-bromo-2-méthylbutane (traces)"],h2:["2-méthylbutane",""]},
  mb1:{hbr:["2-bromo-2-méthylbutane (après transposition d’hydrure)","2-bromo-3-méthylbutane (minoritaire, sans transposition)"],h2o:["2-méthylbutan-2-ol (après transposition d’hydrure)","3-méthylbutan-2-ol (minoritaire)"],br2:["1,2-dibromo-3-méthylbutane (racémique ; pas de transposition : ion bromonium)",""],rad:["1-bromo-3-méthylbutane","2-bromo-3-méthylbutane (traces)"],h2:["2-méthylbutane",""]}
};
var REAG = {
  hbr:{t:"HBr (ionique)",m:"Étape 1 (lente) : la liaison π attaque H⁺ → carbocation. Étape 2 (rapide) : Br⁻ attaque le cation. Règle de Markovnikov : H va sur le carbone qui en porte le plus, car le cation le plus substitué est le plus stable."},
  h2o:{t:"H₂O / H⁺ (hydratation)",m:"Protonation de la liaison π → carbocation ; H₂O attaque le cation, puis perte de H⁺ (catalyseur régénéré). Même régiosélectivité de Markovnikov ; transposition possible. Équilibre : l’hydratation se fait dans l’eau, la déshydratation à chaud en milieu acide concentré."},
  br2:{t:"Br₂ (CCl₄)",m:"Le Br₂ polarisé donne un ion bromonium cyclique (pas de carbocation libre, donc pas de transposition) ; Br⁻ attaque par la face opposée : addition ANTI, stéréospécifique."},
  rad:{t:"HBr + peroxydes (ROOR)",m:"Mécanisme radicalaire en chaîne : Br· s’additionne sur le carbone le moins substitué pour former le radical le plus stable ; anti-Markovnikov. Valable avec HBr seulement (pas HCl ni HI)."},
  h2:{t:"H₂ / Pd, Pt ou Ni",m:"Hydrogénation catalytique : les deux H arrivent sur la même face de la liaison double, adsorbée sur le métal : addition SYN. Produit : l’alcane."}
};
var LEV = {"3°":70,"2°":120,"1°":190};
SFA.sim({
  id:"uc-c09-addition-electrophile", ch:"c09", tag:"Markovnikov",
  titre:"Additions sur un alcène : produit, cation et mécanisme",
  resume:"HBr, H₂O/H⁺, Br₂, HBr/peroxydes, H₂ : le produit majoritaire, le carbocation et la stéréochimie.",
  but:"Choisis un alcène et un réactif. Le profil montre pourquoi le cation le plus substitué se forme le plus vite ; le panneau donne le produit, le mécanisme et la stéréochimie.",
  aRetenir:"Cation : 3° &gt; 2° &gt; 1° (hyperconjugaison, effet inductif donneur). Markovnikov : le nucléophile se fixe sur le carbone le plus substitué. Br₂ : anti ; H₂/Pd : syn ; HBr + ROOR : anti-Markovnikov. Un carbocation peut se transposer (hydrure, méthyle) vers un cation plus stable.",
  piege:"Appliquer Markovnikov à HBr/peroxydes ou à Br₂. Oublier de vérifier si une transposition produit un cation plus stable. Dire que Br₂ donne un cation (il donne un ion bromonium).",
  build:function(k,S){
    var c = k.canvas(280);
    var al = k.select("Alcène",[["pr","propène"],["ib","2-méthylpropène"],["b1","but-1-ène"],["ch","cyclohexène"],["mb2","2-méthylbut-2-ène"],["mb1","3-méthylbut-1-ène"]],"pr");
    var re = k.select("Réactif",[["hbr","HBr"],["h2o","H₂O / H⁺"],["br2","Br₂"],["rad","HBr + ROOR"],["h2","H₂ / Pd"]],"hbr");
    var nt = k.note("","");
    var nt2 = k.note("","ok");
    k.draw(function(){
      var a=ALK[al.value], r=RES[al.value][re.value], ctx=c.ctx; c.clear();
      var ion=(re.value==="hbr"||re.value==="h2o");
      var X=function(t){ return 50+t*(c.W-90); }, Y=function(e){ return c.H-34-(e+30)/300*(c.H-60); };
      ctx.save(); ctx.strokeStyle="#8a95a3"; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(40,8); ctx.lineTo(40,c.H-26); ctx.lineTo(c.W-10,c.H-26); ctx.stroke(); ctx.restore();
      S.draw.text(c,"énergie (qualitative)",44,12,{size:11,align:"left",color:P().grey});
      S.draw.text(c,"coordonnée de réaction",c.W-12,c.H-10,{size:11,align:"right",color:P().grey});
      function hill(t0,e0,t1,e1,top,col,w,dash){ ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=w; if (dash) ctx.setLineDash(dash); ctx.beginPath(); for (var i=0;i<=40;i++){ var u=i/40,t=t0+(t1-t0)*u, e=e0+(e1-e0)*(3*u*u-2*u*u*u)+(top-(e0+e1)/2)*Math.sin(Math.PI*u); if (i===0) ctx.moveTo(X(t),Y(e)); else ctx.lineTo(X(t),Y(e)); } ctx.stroke(); ctx.restore(); }
      if (ion){
        var eM=LEV[a.maj], em=LEV[a.mino];
        hill(0,20,0.55,eM,eM+45,P().acc,3); hill(0.55,eM,1,-30,eM+25,P().acc,3);
        if (a.mino!==a.maj) hill(0,20,0.55,em,em+45,P().red,2,[5,4]);
        S.draw.text(c,"cation "+a.maj+" (voie majoritaire)",X(0.55),Y(eM)+16,{size:11,color:P().acc});
        if (a.mino!==a.maj) S.draw.text(c,"cation "+a.mino+" (voie minoritaire)",X(0.55),Y(em)-30,{size:11,color:P().red});
        S.draw.text(c,"alcène + "+(re.value==="hbr"?"HBr":"H₂O/H⁺"),X(0),Y(20)+16,{size:11,align:"left"}); S.draw.text(c,"produit",X(1),Y(-30)-12,{size:11,align:"right"});
        if (al.value==="mb1" ){ S.draw.text(c,"puis glissement d’hydrure : cation 2° → 3°",X(0.55),Y(120)-14,{size:11,color:P().green}); }
      } else {
        var step={br2:["alcène + Br₂","ion bromonium (pont Br)","attaque anti de Br⁻","dibromure vicinal"],rad:["Br· + alcène","radical le plus stable (tertiaire > secondaire > primaire)","H· pris à HBr","bromoalcane anti-Markovnikov"],h2:["alcène + H₂ adsorbés sur Pd","addition syn des 2 H","désorption","alcane"]}[re.value];
        var xs=[0.12,0.38,0.64,0.9];
        ctx.save(); ctx.font="700 12px Mulish, system-ui"; ctx.fillStyle="#0f1b2d"; ctx.textAlign="center";
        xs.forEach(function(t,i){ var bx=X(t)-70, by=60+i*0, w=140; ctx.fillStyle="rgba(30,63,143,.09)"; ctx.fillRect(bx,by,w,70); ctx.strokeStyle="#1e3f8f"; ctx.strokeRect(bx,by,w,70); ctx.fillStyle="#0f1b2d"; var parts=wrap(step[i],17); parts.forEach(function(p,j){ ctx.fillText(p,X(t),by+28+j*16-(parts.length-1)*7); }); if (i<3) S.draw.arrow(c,bx+w+2,by+35,X(xs[i+1])-72,by+35,P().acc,2); });
        ctx.restore();
      }
      nt.set("<b>"+REAG[re.value].t+" sur le "+a.n+"</b> ("+a.f+")<br>"+REAG[re.value].m+(ion?"<br><b>Cations possibles :</b> "+a.s+".":""),"");
      nt2.set("<b>Produit majoritaire :</b> "+r[0]+(r[1]?"<br><b>Autre :</b> "+r[1]:""),"ok");
    });
    function wrap(s,n){ var w=s.split(" "), out=[], cur=""; w.forEach(function(x){ if ((cur+" "+x).trim().length>n){ out.push(cur.trim()); cur=x; } else cur+=" "+x; }); out.push(cur.trim()); return out; }
  }
});

/* ---------- 2. Stabilité des alcènes : chaleurs d’hydrogénation ---------- */
var HYD = {
  c4:[["but-1-ène",-127,"monosubstitué"],["cis-but-2-ène",-120,"disubstitué cis"],["2-méthylpropène",-119,"disubstitué gem"],["trans-but-2-ène",-116,"disubstitué trans"]],
  sub:[["éthène",-137,"non substitué"],["propène",-125,"monosubstitué"],["2-méthylbut-2-ène",-113,"trisubstitué"],["2,3-diméthylbut-2-ène",-111,"tétrasubstitué"]],
  conj:[["cyclohexène",-120,"1 C=C"],["cyclohexa-1,4-diène",-240,"2 C=C isolées"],["cyclohexa-1,3-diène",-232,"2 C=C conjuguées"],["benzène",-208,"aromatique"]]
};
SFA.sim({
  id:"uc-c09-stabilite-hydrogenation", ch:"c09", tag:"Thermochimie",
  titre:"Chaleur d’hydrogénation et stabilité des alcènes",
  resume:"Moins la chaleur d’hydrogénation est exothermique, plus l’alcène est stable : substitution, cis/trans, conjugaison, benzène.",
  but:"Compare des alcènes qui donnent le même alcane : plus leur ΔH est petit en valeur absolue, plus ils sont stables. Pour le benzène, calcule l’énergie de résonance.",
  aRetenir:"Alcènes qui donnent le même alcane : ΔH°(hydrogénation) mesure la stabilité relative. Stabilité : tétrasubstitué &gt; trisubstitué &gt; disubstitué &gt; monosubstitué &gt; éthène ; trans &gt; cis (gêne stérique). La conjugaison stabilise (≈ 15 kJ/mol) ; le benzène l’est bien plus (≈ 150 kJ/mol).",
  piege:"Comparer des alcènes qui ne donnent pas le même alcane (leur ΔH ne se comparent alors pas directement). Confondre « plus stable » et « moins réactif » dans le sens de la vitesse.",
  build:function(k,S){
    var c = k.canvas(300);
    var se = k.seg("Série",[["c4","Isomères C₄H₈ → butane (sauf iso)"],["sub","Degré de substitution"],["conj","Conjugaison et benzène"]],"c4");
    var ro = k.readouts(["Plus stable","Écart avec le moins stable"]);
    var nt = k.note("","");
    k.draw(function(){
      var arr=HYD[se.value]; c.clear(); var ctx=c.ctx;
      var min=-260, max=0, n=arr.length, bw=Math.min(90,(c.W-80)/n-14), x0=60;
      var Y=function(v){ return 20+(v-max)/(min-max)*(c.H-70); };
      ctx.save(); ctx.strokeStyle="#8a95a3"; ctx.beginPath(); ctx.moveTo(50,Y(0)); ctx.lineTo(c.W-10,Y(0)); ctx.stroke(); ctx.restore();
      S.draw.text(c,"ΔH°(hydrogénation) en kJ/mol",54,12,{size:11,align:"left",color:P().grey});
      var lo=Math.max.apply(null,arr.map(function(a){ return a[1]; }));
      arr.forEach(function(a,i){ var x=x0+i*((c.W-80)/n)+7; ctx.save(); ctx.fillStyle=a[1]===lo&&se.value!=="conj"?P().green:P().acc; if (se.value==="conj"&&i>0) ctx.fillStyle=[P().acc,P().amber,P().violet,P().teal][i]; ctx.fillRect(x,Y(0),bw,Y(a[1])-Y(0)); ctx.restore();
        S.draw.text(c,String(a[1]).replace("-","−"),x+bw/2,Y(a[1])+12,{size:12,color:"#fff"}); S.draw.text(c,a[0],x+bw/2,c.H-26,{size:10.5,color:P().ink}); S.draw.text(c,a[2],x+bw/2,c.H-10,{size:10,color:P().grey}); });
      var vals=arr.map(function(a){ return a[1]; }), best=arr[vals.indexOf(Math.max.apply(null,vals))], worst=arr[vals.indexOf(Math.min.apply(null,vals))];
      if (se.value==="conj"){
        ro.set(0,"—"); ro.set(1,"—");
        nt.set("<b>Énergie de résonance du benzène :</b> 3 × ΔH(cyclohexène) = 3 × (−120) = −360 kJ/mol attendus pour trois C=C isolées ; mesuré −208 kJ/mol ; stabilisation ≈ <b>152 kJ/mol</b>.<br><b>Conjugaison :</b> 2 × (−120) = −240 attendus pour 2 C=C isolées ; cyclohexa-1,3-diène (−232) est stabilisé d’≈ 8 kJ/mol par rapport au cyclohexa-1,4-diène (−240).","ok");
      } else {
        ro.set(0,best[0]); ro.set(1,S.fmt(Math.max.apply(null,vals)-Math.min.apply(null,vals),0)+" kJ/mol");
        nt.set(se.value==="c4"?"Les quatre isomères C₄H₈ ne donnent pas tous le butane : l’isobutène donne l’isobutane. Les trois autres (but-1-ène, cis et trans-but-2-ène) donnent le même butane : leurs ΔH se comparent directement (trans la plus stable).":"Plus la liaison double est substituée, moins l’hydrogénation dégage d’énergie : l’alcène de départ est déjà plus stable (hyperconjugaison avec les C–H voisins). Les alcanes formés ne sont pas identiques : la comparaison est indicative.","");
      }
    });
    k.note("Valeurs expérimentales approchées en phase gazeuse (arrondies au kJ/mol) ; l’ordre est solide, les chiffres peuvent différer de 1 à 3 kJ/mol selon les sources.","");
  }
});

/* ---------- 3. Stéréochimie de l’addition ---------- */
SFA.sim({
  id:"uc-c09-stereochimie-addition", ch:"c09", tag:"Stéréospécificité",
  titre:"Addition syn ou anti : méso ou racémique ?",
  resume:"Br₂ (anti) et dihydroxylation (syn) sur un alcène cis ou trans : quel stéréoisomère obtient-on ?",
  but:"Choisis la géométrie de l’alcène, le mode d’addition et la probabilité d’attaque par la face supérieure. Lis la nature du produit et l’excès énantiomérique.",
  aRetenir:"Alcène cis + addition anti → racémique (R,R + S,S) ; trans + anti → méso (R,S). Alcène cis + addition syn → méso ; trans + syn → racémique. La réaction est stéréospécifique : l’alcène (Z ou E) détermine le stéréoisomère. Un mélange racémique est optiquement inactif (ee = 0) ; un méso aussi (plan de symétrie interne).",
  piege:"Dire que « méso = racémique » : le méso est UNE molécule achirale, le racémique est un mélange 50/50 de deux énantiomères. Une face d’attaque ne donne un excès que si les deux faces ne sont pas équivalentes (réactif chiral) : sans cela p = 50 % et ee = 0.",
  build:function(k,S){
    var c = k.canvas(280);
    var al = k.seg("Alcène",[["cis","cis-but-2-ène"],["trans","trans-but-2-ène"],["cy","cyclohexène"]],"cis");
    var mo = k.seg("Addition",[["anti","anti (Br₂)"],["syn","syn (OsO₄ ou KMnO₄ froid : diol)"]],"anti");
    var p = k.slider("Probabilité d’attaque par la face supérieure",0,100,5,50,"%");
    var ro = k.readouts(["Produit","Pouvoir rotatoire","Excès énantiomérique"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, cisLike=(al.value!=="trans"), anti=mo.value==="anti";
      /* alcène vu de dessus : deux carbones, substituants dans le plan */
      var cx=c.W/2, cy=150, d=60;
      var C1=[cx-d/2,cy], C2=[cx+d/2,cy];
      S.draw.line(c,C1[0],C1[1],C2[0],C2[1],P().ink,3); S.draw.line(c,C1[0],C1[1]-4,C2[0],C2[1]-4,P().ink,3);
      var up=cisLike?-1:1;
      function sub(cx0,cy0,dx,dy,l){ S.draw.line(c,cx0,cy0,cx0+dx,cy0+dy,P().ink,2.2); S.draw.text(c,l,cx0+dx*1.3,cy0+dy*1.3,{size:12}); }
      var big=al.value==="cy"?"CH₂":"CH₃";
      sub(C1[0],C1[1],-34,-26,big); sub(C1[0],C1[1],-34,26,"H");
      sub(C2[0],C2[1],34,up*26,big); sub(C2[0],C2[1],34,-up*26,"H");
      /* flèches de faces */
      var reag=anti?"Br":"OH";
      S.draw.arrow(c,C1[0]-4,cy-110,C1[0]-4,cy-30,P().acc,2.5); S.draw.text(c,reag+" (face du dessus)",C1[0]-4,cy-120,{size:12,color:P().acc});
      if (anti){ S.draw.arrow(c,C2[0]+4,cy+110,C2[0]+4,cy+30,P().red,2.5); S.draw.text(c,reag+" (face du dessous)",C2[0]+4,cy+122,{size:12,color:P().red}); }
      else { S.draw.arrow(c,C2[0]+4,cy-110,C2[0]+4,cy-30,P().acc,2.5); S.draw.text(c,reag+" (même face)",C2[0]+4,cy-120,{size:12,color:P().acc}); }
      var racemic=(cisLike===anti); /* cis+anti ou trans+syn → racémique */
      var pf=p.value/100, ee=racemic?Math.abs(2*pf-1):0;
      var prod=racemic?"racémique (R,R) + (S,S)":"méso (R,S)";
      if (al.value==="cy"&&anti) prod="trans-1,2-dibromocyclohexane : racémique (R,R) + (S,S)";
      if (al.value==="cy"&&!anti) prod="cis-cyclohexane-1,2-diol : méso (R,S)";
      if (al.value==="cy"&&anti) prod=prod;
      ro.set(0,prod); ro.set(1,racemic?(ee<0.001?"nul (mélange 50/50)":"non nul"):"nul (méso, achiral)");
      ro.set(2,racemic?S.fmt(ee*100,0)+" %":"sans objet");
      var what=anti?"dibromure":"diol";
      nt.set(racemic?("Les deux faces sont équivalentes pour l’alcène plan : les deux énantiomères se forment dans les proportions "+S.fmt(p.value,0)+" % / "+S.fmt(100-p.value,0)+" %. Avec un réactif et un milieu achiraux, p = 50 % : produit racémique."+(p.value!==50?" Un excès ne serait possible qu’avec un réactif ou un catalyseur chiral.":"")):("Le "+what+" obtenu est la forme méso, quel que soit le côté de l’attaque : les deux « faces » donnent la même molécule (plan de symétrie interne). Le curseur n’a pas d’effet."),racemic?"":"ok");
    });
    k.note("Dessin : l’alcène est vu de dessus (les substituants sont dans le plan de la page) ; le réactif approche de la face du dessus ou du dessous.","");
  }
});

/* ---------- 4. Entraîneur de prédiction ---------- */
var QB = [
  {q:"HBr + propène (sans peroxyde)",c:["1-bromopropane","2-bromopropane","1,2-dibromopropane","propane"],b:1,e:"Markovnikov : le cation secondaire se forme préférentiellement ; Br⁻ attaque le carbone 2."},
  {q:"H₂O / H⁺ + 2-méthylbut-2-ène",c:["3-méthylbutan-2-ol","2-méthylbutan-1-ol","2-méthylbutan-2-ol","pentan-2-ol"],b:2,e:"Protonation sur C3 (le CH) pour donner le cation tertiaire en C2 ; H₂O attaque C2 : alcool tertiaire."},
  {q:"Br₂ + cyclohexène",c:["cis-1,2-dibromocyclohexane","trans-1,2-dibromocyclohexane (racémique)","1,1-dibromocyclohexane","3-bromocyclohexène"],b:1,e:"Ion bromonium puis attaque anti de Br⁻ : trans, racémique (les deux faces sont équivalentes)."},
  {q:"HBr + peroxydes (ROOR) + propène",c:["2-bromopropane","1-bromopropane","propan-1-ol","1,2-dibromopropane"],b:1,e:"Mécanisme radicalaire : Br· va sur le C le moins substitué, formant le radical secondaire : anti-Markovnikov."},
  {q:"HBr + 3-méthylbut-1-ène (produit majoritaire)",c:["1-bromo-3-méthylbutane","2-bromo-3-méthylbutane","2-bromo-2-méthylbutane","2-bromopentane"],b:2,e:"Le cation secondaire se transpose par glissement d’hydrure en cation tertiaire, plus stable ; Br⁻ attaque ce dernier."},
  {q:"HBr + 1-méthylcyclohexène",c:["1-bromo-1-méthylcyclohexane","2-bromo-1-méthylcyclohexane","(bromométhyl)cyclohexane","3-bromo-1-méthylcyclohexène"],b:0,e:"H sur le carbone le plus hydrogéné (C2), le cation tertiaire sur C1 est attaqué par Br⁻."},
  {q:"1) BH₃·THF puis 2) H₂O₂, NaOH + propène",c:["propan-2-ol","propan-1-ol","propane-1,2-diol","propanal"],b:1,e:"Hydroboration-oxydation : anti-Markovnikov, addition syn, sans carbocation ni transposition."},
  {q:"1) Hg(OAc)₂, H₂O puis 2) NaBH₄ + 3,3-diméthylbut-1-ène",c:["2,3-diméthylbutan-2-ol (transposition)","3,3-diméthylbutan-2-ol","3,3-diméthylbutan-1-ol","2,2-diméthylbutane"],b:1,e:"L’oxymercuration-démercuration est de Markovnikov et sans transposition (ion mercurinium). L’hydratation acide, elle, donnerait l’alcool transposé."},
  {q:"Br₂ + trans-but-2-ène (addition anti)",c:["(2R,3R)-2,3-dibromobutane seul","mélange racémique","2,3-dibromobutane méso","1,2-dibromobutane"],b:2,e:"Anti sur trans : on obtient la forme méso (R,S), achirale."},
  {q:"H₂, Pd/C + but-1-ène",c:["butane","but-2-ène","butan-1-ol","1,2-dibromobutane"],b:0,e:"Hydrogénation catalytique : l’alcane correspondant, addition syn des deux H sur la même face."}
];
SFA.sim({
  id:"uc-c09-entraineur-additions", ch:"c09", tag:"Entraînement",
  titre:"Entraîneur : prédire le produit (10 questions)",
  resume:"Dix cas de type examen : Markovnikov, anti-Markovnikov, transposition, stéréochimie.",
  but:"Lis la question, choisis A, B, C ou D, puis lis l’explication. Le score se cumule ; une question suivante te propose un autre cas.",
  aRetenir:"Avant de répondre : (1) cation ou pas de cation ? (2) transposition possible ? (3) mode syn ou anti ? (4) régiochimie de Markovnikov ou inverse ?",
  piege:"Appliquer « Markovnikov » partout. Les peroxydes n’inversent que HBr. L’hydroboration et l’oxymercuration évitent les transpositions.",
  build:function(k,S){
    var i=0, ok=0, tot=0, done=false;
    var q = k.note("","","stage");
    var fb = k.note("","");
    var ans = k.seg("Ta réponse",[["0","A"],["1","B"],["2","C"],["3","D"]],undefined,function(v){
      if (done) return; done=true; tot++; var qq=QB[i]; var good=Number(v)===qq.b; if (good) ok++;
      fb.set((good?"✅ <b>Bonne réponse.</b> ":"❌ <b>Pas tout à fait.</b> Bonne réponse : "+"ABCD"[qq.b]+". ")+qq.e,good?"ok":"warn"); upd();
    });
    ans.set(null);
    var ro = k.readouts(["Bonnes réponses","Questions traitées"]);
    k.button("Question suivante",function(){ i=(i+1)%QB.length; done=false; fb.set("","" ); ans.set(undefined); show(); },true);
    function upd(){ ro.set(0,String(ok)); ro.set(1,String(tot)); }
    function show(){ var qq=QB[i]; q.set("<b>Question "+(i+1)+" / "+QB.length+" : "+qq.q+"</b><br>"+qq.c.map(function(x,j){ return "<b>"+"ABCD"[j]+".</b> "+x; }).join("<br>"),""); upd(); }
    k.draw(function(){ show(); });
  }
});

/* ---------- 5. Indice d’iode ---------- */
var TG = {sat:{n:"saturés (tripalmitine)",M:807.32,d:0},ole:{n:"trioléine (acide oléique, 1 C=C)",M:885.43,d:3},lin:{n:"trilinoléine (acide linoléique, 2 C=C)",M:879.38,d:6},lnc:{n:"trilinolénine (acide linolénique, 3 C=C)",M:873.33,d:9}};
var MI2=253.81;
function iv(key){ return 100*MI2*TG[key].d/TG[key].M; }
var PRESETS={coco:[92,6,2,0],olive:[15,75,9,1],tournesol:[10,25,64,1],lin:[10,20,15,55]};
SFA.sim({
  id:"uc-c09-indice-iode", ch:"c09", tag:"Lipides",
  titre:"Indice d’iode : mesurer l’insaturation d’une huile",
  resume:"Fixation de I₂ sur les C=C d’un mélange de triglycérides : l’indice d’iode et l’hydrogénation d’une margarine.",
  but:"Compose une huile (fraction massique de chaque triglycéride) ou choisis un exemple. L’indice d’iode (g de I₂ fixés par 100 g de matière grasse) mesure le nombre de liaisons C=C ; en déduis le volume de H₂ à fixer pour la durcir.",
  aRetenir:"I₂ s’additionne sur C=C comme Br₂ : 1 mol de I₂ par mole de C=C. Indice d’iode = 100 × n(C=C) × M(I₂)/M(graisse) (par 100 g). Trioléine ≈ 86 ; trilinoléine ≈ 173 ; trilinolénine ≈ 262. Les huiles liquides (insaturées) ont un indice élevé ; les graisses solides (saturées), un indice faible.",
  piege:"Compter les C=C par triglycéride (3 chaînes !) : la trioléine a 3 C=C, pas 1. Confondre indice d’iode (g I₂/100 g) et quantité de matière. Modèle simplifié : on ignore les chaînes autres que ces 4 types et les isomères trans.",
  build:function(k,S){
    var c = k.canvas(280);
    var pr = k.select("Exemple",[["","personnalisé"],["coco","coco (saturée)"],["olive","olive"],["tournesol","tournesol"],["lin","lin"]],"",function(v){ if (PRESETS[v]){ PRESETS[v].forEach(function(x,i){ sl[i].set(x); }); } });
    var sl=[ k.slider("Saturés",0,100,1,15,"%"), k.slider("Trioléine (C18:1)",0,100,1,75,"%"), k.slider("Trilinoléine (C18:2)",0,100,1,9,"%"), k.slider("Trilinolénine (C18:3)",0,100,1,1,"%") ];
    var ro = k.readouts(["Indice d’iode","C=C pour 100 g","H₂ pour 100 g (25 °C, 1 atm)"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, keys=["sat","ole","lin","lnc"];
      var w=sl.map(function(s){ return s.value; }), tot=w[0]+w[1]+w[2]+w[3];
      if (tot<=0){ ro.set(0,"—"); ro.set(1,"—"); ro.set(2,"—"); nt.set("Mets au moins un composant.","warn"); return; }
      var f=w.map(function(x){ return x/tot; }), IV=0, nCC=0;
      keys.forEach(function(key,i){ IV+=f[i]*iv(key); nCC+=f[i]*100/TG[key].M*TG[key].d; });
      var VH=nCC*0.0821*298;
      /* barres des composants et échelle de l'indice */
      var ax=S.draw.axes(c,{x0:0,x1:4,y0:0,y1:280,xl:"",yl:"indice d’iode",stepX:100,hideZero:true,stepY:50,l:50});
      var cols=[P().grey,P().acc,P().amber,P().violet], nm=["saturés","trioléine","trilinoléine","trilinolénine"];
      keys.forEach(function(key,i){ var x0=ax.X(i+0.15), x1=ax.X(i+0.85); ctx.save(); ctx.fillStyle=cols[i]; ctx.globalAlpha=0.35; ctx.fillRect(x0,ax.Y(iv(key)),x1-x0,ax.Y(0)-ax.Y(iv(key))); ctx.restore(); S.draw.text(c,nm[i]+" : "+S.fmt(iv(key),0),(x0+x1)/2,ax.Y(iv(key))-9,{size:11,color:cols[i]}); });
      S.draw.line(c,ax.L,ax.Y(IV),ax.R,ax.Y(IV),P().red,2.4,[6,4]); S.draw.text(c,"mélange : "+S.fmt(IV,0),ax.R-6,ax.Y(IV)-10,{align:"right",size:12,color:P().red});
      ro.set(0,S.fmt(IV,0)+" g I₂/100 g"); ro.set(1,S.fmt(nCC*1000,0)+" mmol"); ro.set(2,S.fmt(VH,2)+" L");
      nt.set(IV<20?"Graisse solide à température ambiante (très saturée).":IV<100?"Huile peu à moyennement insaturée (type olive, indice ≈ 75 – 90).":IV<150?"Huile très insaturée (type tournesol).":"Huile « siccative » très insaturée : s’oxyde et durcit à l’air (type lin).","");
    });
    k.note("M(I₂) = 253,81 g/mol. Indices de référence par triglycéride homogène : 0 ; 86,0 ; 173,2 ; 261,6.","");
  }
});
})();
