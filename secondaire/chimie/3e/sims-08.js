/* Chapitre 8 · Formules et nomenclature des corps minéraux */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} }
var SUBD="₀₁₂₃₄₅₆₇₈₉", SUP={"+":"⁺","-":"⁻","2":"²","3":"³"};
function sub(n){ return String(n).split("").map(function(d){ return SUBD[+d]; }).join(""); }
function gcd(a,b){ return b?gcd(b,a%b):a; }
function chg(q){ var a=Math.abs(q); return (a>1?["","","²","³"][a]:"")+(q>0?"⁺":"⁻"); }

/* ions : clé → [formule, nom, charge, polyatomique, nom d'élément pour "de ..."] */
var CAT = {
  H:["H","hydrogène",1,false,"d'hydrogène"], Li:["Li","lithium",1,false,"de lithium"], Na:["Na","sodium",1,false,"de sodium"], K:["K","potassium",1,false,"de potassium"], Ag:["Ag","argent",1,false,"d'argent"], NH4:["NH₄","ammonium",1,true,"d'ammonium"],
  Mg:["Mg","magnésium",2,false,"de magnésium"], Ca:["Ca","calcium",2,false,"de calcium"], Zn:["Zn","zinc",2,false,"de zinc"], Cu:["Cu","cuivre(II)",2,false,"de cuivre(II)"], Fe2:["Fe","fer(II)",2,false,"de fer(II)"],
  Al:["Al","aluminium",3,false,"d'aluminium"], Fe3:["Fe","fer(III)",3,false,"de fer(III)"]
};
var AN = {
  F:["F","fluorure",-1,false], Cl:["Cl","chlorure",-1,false], Br:["Br","bromure",-1,false], OH:["OH","hydroxyde",-1,true], NO3:["NO₃","nitrate",-1,true], HCO3:["HCO₃","hydrogénocarbonate",-1,true],
  O:["O","oxyde",-2,false], S:["S","sulfure",-2,false], SO4:["SO₄","sulfate",-2,true], CO3:["CO₃","carbonate",-2,true], PO4:["PO₄","phosphate",-3,true]
};
var ACIDE = {Cl:["HCl","chlorure d'hydrogène (acide chlorhydrique en solution)"], Br:["HBr","bromure d'hydrogène (acide bromhydrique)"], F:["HF","fluorure d'hydrogène (acide fluorhydrique)"], S:["H₂S","sulfure d'hydrogène"],
  NO3:["HNO₃","acide nitrique"], SO4:["H₂SO₄","acide sulfurique"], CO3:["H₂CO₃","acide carbonique"], HCO3:["H₂CO₃","acide carbonique (H⁺ + HCO₃⁻)"], PO4:["H₃PO₄","acide phosphorique"], OH:["H₂O","eau"], O:["H₂O","eau (oxyde d'hydrogène)"]};
function build(ck,ak){
  var c=CAT[ck], a=AN[ak], q1=Math.abs(c[2]), q2=Math.abs(a[2]), g=gcd(q1,q2), n=q2/g, m=q1/g;
  var res={n:n,m:m,qc:q1,qa:q2};
  if(ck==="H"){ var A=ACIDE[ak]; res.f=A[0]; res.nom=A[1]; res.fam=(ak==="OH"||ak==="O")?"eau":(ak==="Cl"||ak==="Br"||ak==="F"||ak==="S"?"acide (binaire)":"acide"); return res; }
  var cs=c[0], as=a[0];
  var fc = n>1 ? (c[3]?"("+cs+")":cs)+sub(n) : cs, fa = m>1 ? (a[3]?"("+as+")":as)+sub(m) : as;
  res.f=fc+fa;
  res.nom=a[1]+" "+c[4];
  if(ck==="NH4"&&ak==="OH"){ res.f="NH₄OH"; res.nom="hydroxyde d'ammonium (ammoniaque en solution)"; }
  res.fam = ak==="O"?"oxyde":(ak==="OH"?"base (hydroxyde)":"sel");
  return res;
}
function opt(map){ return Object.keys(map).map(function(k){ var v=map[k]; return [k, v[0]+chg(v[2])+" · "+v[1]]; }); }

/* ---------- 1 · Boîte à ions ---------- */
SFA.sim({
  id:"c3-c08-ions", ch:"c08", tag:"Classique",
  titre:"Boîte à ions : associe un cation et un anion",
  resume:"Choisis un cation et un anion : le simulateur neutralise les charges, écrit la formule et donne le nom.",
  but:"Choisis un cation et un anion. Regarde combien de chaque ion il faut pour que la somme des charges soit nulle, puis lis la formule et le nom.",
  aRetenir:"La formule d'un composé ionique est neutre : (nombre de cations × charge +) + (nombre d'anions × charge −) = 0. On écrit le cation d'abord. L'indice d'un ion est la valeur absolue de la charge de l'autre (« croisement » des charges), simplifié par leur plus grand diviseur commun. Un ion polyatomique (OH, SO₄, NO₃…) s'écrit entre parenthèses quand il y en a plus d'un. Le nom commence par l'anion : « chlorure de sodium ».",
  piege:"Les charges ne sont pas des indices dans la formule finale (Al³⁺ + O²⁻ → Al₂O₃, pas Al³O²). N'oublie pas les parenthèses : Ca(OH)₂ ≠ CaOH₂. Pour Fe et Cu, la charge est indiquée par un chiffre romain dans le nom : fer(II) ou fer(III).",
  build:function(k,S){
    var c = k.canvas(300);
    var ca = k.select("Cation (charge +)", opt(CAT), "Ca");
    var an = k.select("Anion (charge −)", opt(AN), "OH");
    var ro = k.readouts(["Formule","Nom","Famille","Bilan des charges"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, r=build(ca.value,an.value), C=CAT[ca.value], A=AN[an.value];
      var maxn=Math.max(r.n,r.m), size=Math.min(52,(W-40)/Math.max(2*maxn+1,3)), gap=6;
      // cations (rangée haute) et anions (rangée basse)
      function row(n,y,label,fill,stroke,col){ var tw=n*(size+gap)-gap, x0=(W-tw)/2; for(var i=0;i<n;i++){ rr(c,x0+i*(size+gap),y,size,size,fill,stroke,2,size/2); T(c,label,x0+i*(size+gap)+size/2,y+size/2,{size:Math.max(12,Math.min(15,size*0.3)),color:col}); } }
      T(c,"cations",W/2,14,{size:12,color:P.acc}); row(r.n,24,C[0]+chg(C[2]),"#e2ecfa",P.acc,P.acc);
      T(c,"anions",W/2,24+size+22,{size:12,color:P.green}); row(r.m,24+size+30,A[0]+chg(A[2]),"#dcf1e6",P.green,P.green);
      var y3=24+2*size+72;
      T(c,r.n+" × (+"+r.qc+")  +  "+r.m+" × (−"+r.qa+")  =  "+(r.n*r.qc)+" − "+(r.m*r.qa)+"  =  0",W/2,y3,{size:14,color:P.ink});
      T(c,r.f,W/2,y3+34,{size:24,color:P.red,math:true});
      var hp=C[3]||A[3];
      ro.set(0,r.f); ro.set(1,r.nom); ro.set(2,r.fam); ro.set(3,r.n+"×(+"+r.qc+") + "+r.m+"×(−"+r.qa+") = 0");
      nt.set((ca.value==="H"?"L'ion H⁺ associé à un anion donne un <b>acide</b>. ":"")+"Croisement des charges : "+C[0]+chg(C[2])+" a une charge de "+r.qc+", "+A[0]+chg(A[2])+" une charge de "+r.qa+". Indices : "+(r.m>1||r.n>1?"cation × "+r.n+", anion × "+r.m+" (après simplification par "+gcd(r.qc,r.qa)+").":"1 pour chacun.")+((r.n>1&&C[3])||(r.m>1&&A[3])?" Les parenthèses sont nécessaires pour l'ion polyatomique répété.":""),"");
    });
  }
});

/* ---------- 2 · Du nom à la formule (quiz) ---------- */
function rnd(n){ return Math.floor(Math.random()*n); }
function shuffle(a){ for(var i=a.length-1;i>0;i--){ var j=rnd(i+1), t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
var LV = {
  1:{cat:["Li","Na","K","Mg","Ca","Al","Zn","Ag"], an:["F","Cl","Br","O","S"]},
  2:{cat:["Li","Na","K","Mg","Ca","Al","Zn","Ag","NH4"], an:["Cl","O","S","OH","NO3","SO4","CO3","PO4"]},
  3:{cat:["Na","K","Mg","Ca","Al","Zn","Cu","Fe2","Fe3","NH4"], an:["Cl","O","S","OH","NO3","SO4","CO3","PO4","HCO3"]}
};
SFA.sim({
  id:"c3-c08-quiz", ch:"c08", tag:"Jeu",
  titre:"Du nom à la formule : entraînement progressif",
  resume:"Trois niveaux : formules de composés simples, avec ions polyatomiques, puis avec fer et cuivre. Score et explication à chaque réponse.",
  but:"Lis la question, choisis la bonne réponse dans la liste et valide. L'explication détaille l'équilibre des charges. Monte de niveau quand tu es à l'aise.",
  aRetenir:"Méthode en 3 étapes : 1) écrire les ions avec leurs charges ; 2) trouver le plus petit nombre d'ions de chaque sorte qui rend la somme des charges nulle ; 3) écrire la formule (cation d'abord, parenthèses si ion polyatomique répété). Dans l'autre sens : lire l'anion (-ure, -ate, hydroxyde, oxyde), puis le cation.",
  piege:"Les erreurs fréquentes sont proposées parmi les réponses : indices inversés, parenthèses oubliées, charges non équilibrées (formule 1 pour 1 par réflexe). Chlorure ≠ chlorate : -ure = anion simple (Cl⁻), -ate = anion avec oxygène.",
  build:function(k,S){
    var c = k.canvas(190);
    var lv = k.seg("Niveau", [[1,"1 · ions simples"],[2,"2 · polyatomiques"],[3,"3 · Fe, Cu…"]], 1, function(){ next(); });
    var ch = k.select("Ta réponse", [["","— choisis —"]], "");
    var ro = k.readouts(["Score","Série en cours","Questions"]);
    var nt = k.note("","");
    var Q=null, score=0, streak=0, nq=0, answered=false;
    function optsFor(q){
      var out=[q.ans], c0=q.ck, a0=q.ak, r=q.r, set={};
      set[q.ans]=1;
      function add(x){ if(x&&!set[x]){ set[x]=1; out.push(x); } }
      if(q.dir==="f"){
        var cs=CAT[c0][0], as=AN[a0][0];
        add(((r.m>1?(CAT[c0][3]?"("+cs+")":cs)+sub(r.m):cs))+((r.n>1?(AN[a0][3]?"("+as+")":as)+sub(r.n):as)));   /* indices inversés */
        add(cs+as);                                                                                              /* 1 pour 1 par réflexe */
        if(AN[a0][3]&&r.m>1) add(cs+sub(r.n)+as+sub(r.m));                                                       /* parenthèses oubliées */
        else add(cs+(r.n>1?sub(r.n+1):"")+as);
        if(r.qc>1||r.qa>1) add(cs+sub(r.qc)+as+sub(r.qa)); else add(cs+as+sub(2));                                                                          /* charges en indices */
        add(cs+sub(r.m+1)+as); add(cs+sub(r.n+1)+as+sub(r.m+1));
      } else {
        var names=[]; Object.keys(AN).forEach(function(x){ if(LV[lv.value].an.indexOf(x)>=0&&x!==a0) names.push(build(c0,x).nom); }); Object.keys(CAT).forEach(function(x){ if(LV[lv.value].cat.indexOf(x)>=0&&x!==c0) names.push(build(x,a0).nom); });
        shuffle(names).forEach(function(x){ if(out.length<4) add(x); });
      }
      return shuffle(out.slice(0,5));
    }
    function next(){
      var L=LV[lv.value], ck=L.cat[rnd(L.cat.length)], ak=L.an[rnd(L.an.length)], r=build(ck,ak), dir=(lv.value>1&&Math.random()<0.4)?"n":"f";
      Q={ck:ck,ak:ak,r:r,dir:dir,ans:dir==="f"?r.f:r.nom};
      var op=optsFor(Q); var s=ch.el; s.innerHTML=""; var o0=document.createElement("option"); o0.value=""; o0.textContent="— choisis —"; s.appendChild(o0);
      op.forEach(function(x){ var o=document.createElement("option"); o.value=x; o.textContent=x; s.appendChild(o); }); s.value="";
      answered=false; nt.set("Choisis une réponse puis clique sur « Valider ».",""); k.redraw();
    }
    k.button("Valider", function(){
      if(answered||!ch.value) return; answered=true; nq++;
      var ok=ch.value===Q.ans, C=CAT[Q.ck], A=AN[Q.ak], r=Q.r;
      if(ok){ score++; streak++; } else streak=0;
      nt.set((ok?"<b>Correct !</b> ":"<b>Pas tout à fait.</b> Bonne réponse : <b>"+Q.ans+"</b>. ")+"Ions : "+C[0]+chg(C[2])+" et "+A[0]+chg(A[2])+". "+r.n+" × (+"+r.qc+") + "+r.m+" × (−"+r.qa+") = 0, donc "+(r.n>1?r.n+" cation(s) ":"1 cation ")+"et "+(r.m>1?r.m+" anions":"1 anion")+" → <b>"+r.f+"</b> ("+r.nom+").", ok?"ok":"warn");
    }, true);
    k.button("Question suivante", function(){ next(); });
    next();
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H;
      if(!Q) return;
      T(c,"Question "+(nq+(answered?0:1)),W/2,20,{size:12,color:P.grey});
      if(Q.dir==="f"){ T(c,"Quelle est la formule de",W/2,60,{size:14,color:P.ink}); T(c,Q.r.nom+" ?",W/2,98,{size:Math.min(22,W/ (Q.r.nom.length*0.52)),color:P.acc}); }
      else { T(c,"Quel est le nom de",W/2,60,{size:14,color:P.ink}); T(c,Q.r.f+" ?",W/2,106,{size:28,color:P.acc,math:true}); }
      T(c,"niveau "+lv.value,W/2,H-16,{size:12,color:P.grey});
      ro.set(0,score+" / "+nq); ro.set(1,String(streak)); ro.set(2,String(nq));
    });
  }
});

/* ---------- 3 · Familles de composés ---------- */
var FAM = [
 {f:"CaO", c:"Ca²⁺", a:"O²⁻", fam:"oxyde"}, {f:"CO₂", c:"C", a:"O (×2)", fam:"oxyde", ex:"Un non-métal associé à l'oxygène : c'est aussi un oxyde (dioxyde de carbone)."}, {f:"Fe₂O₃", c:"Fe³⁺", a:"O²⁻", fam:"oxyde"}, {f:"MgO", c:"Mg²⁺", a:"O²⁻", fam:"oxyde"}, {f:"Al₂O₃", c:"Al³⁺", a:"O²⁻", fam:"oxyde"}, {f:"SO₂", c:"S", a:"O (×2)", fam:"oxyde", ex:"Dioxyde de soufre : un non-métal et l'oxygène seulement."},
 {f:"HCl", c:"H⁺", a:"Cl⁻", fam:"acide"}, {f:"HNO₃", c:"H⁺", a:"NO₃⁻", fam:"acide"}, {f:"H₂SO₄", c:"H⁺ (×2)", a:"SO₄²⁻", fam:"acide"}, {f:"H₃PO₄", c:"H⁺ (×3)", a:"PO₄³⁻", fam:"acide"}, {f:"H₂CO₃", c:"H⁺ (×2)", a:"CO₃²⁻", fam:"acide"},
 {f:"NaOH", c:"Na⁺", a:"OH⁻", fam:"base"}, {f:"Ca(OH)₂", c:"Ca²⁺", a:"OH⁻ (×2)", fam:"base"}, {f:"KOH", c:"K⁺", a:"OH⁻", fam:"base"}, {f:"Mg(OH)₂", c:"Mg²⁺", a:"OH⁻ (×2)", fam:"base"}, {f:"Al(OH)₃", c:"Al³⁺", a:"OH⁻ (×3)", fam:"base"},
 {f:"NaCl", c:"Na⁺", a:"Cl⁻", fam:"sel"}, {f:"CaCO₃", c:"Ca²⁺", a:"CO₃²⁻", fam:"sel"}, {f:"KNO₃", c:"K⁺", a:"NO₃⁻", fam:"sel"}, {f:"CuSO₄", c:"Cu²⁺", a:"SO₄²⁻", fam:"sel"}, {f:"MgCl₂", c:"Mg²⁺", a:"Cl⁻ (×2)", fam:"sel"}, {f:"Na₂SO₄", c:"Na⁺ (×2)", a:"SO₄²⁻", fam:"sel"}, {f:"AgCl", c:"Ag⁺", a:"Cl⁻", fam:"sel"}, {f:"(NH₄)₂SO₄", c:"NH₄⁺ (×2)", a:"SO₄²⁻", fam:"sel"}
];
var FRULE = {
  oxyde:"<b>Oxyde</b> : l'oxygène est le seul non-métal ou le seul anion présent (O²⁻), associé à un seul autre élément.",
  acide:"<b>Acide</b> : la formule commence par H (ion H⁺) suivi d'un anion ; ce n'est pas H₂O.",
  base:"<b>Base (hydroxyde)</b> : contient l'ion hydroxyde OH⁻ associé à un métal.",
  sel:"<b>Sel</b> : un cation (métal ou NH₄⁺) et un anion qui n'est ni O²⁻ ni OH⁻."
};
SFA.sim({
  id:"c3-c08-familles", ch:"c08", tag:"Classification",
  titre:"Oxyde, acide, base ou sel ? Reconnaître la famille d'une formule",
  resume:"Une formule s'affiche : classe-la dans la bonne famille et vois comment on la découpe en ions.",
  but:"Pour chaque formule, clique sur la famille : oxyde, acide, base ou sel. La formule est découpée en cation et anion pour t'aider à reconnaître la règle.",
  aRetenir:"Oxyde : un élément + oxygène. Acide : H⁺ + anion (la formule commence par H). Base : OH⁻ + cation métallique. Sel : un cation (métal ou NH₄⁺) + un anion qui n'est ni O²⁻ ni OH⁻. On regarde d'abord le premier et le dernier ion de la formule.",
  piege:"NaOH est une base (OH⁻), pas un sel. H₂O n'est pas un acide. CO₂ est un oxyde même s'il n'y a pas de métal. Un sel n'est pas forcément du sel de cuisine : CaCO₃ (calcaire) et CuSO₄ sont des sels.",
  build:function(k,S){
    var c = k.canvas(190);
    var ro = k.readouts(["Score","Série","Question"]);
    var nt = k.note("","");
    var order=shuffle(FAM.map(function(x,i){return i;})), idx=0, score=0, tot=0, streak=0, answered=false, last="";
    function cur(){ return FAM[order[idx%order.length]]; }
    function ans(f){ if(answered) return; answered=true; tot++; var q=cur(), ok=f===q.fam; if(ok){ score++; streak++; } else streak=0; last=ok?"ok":"bad";
      nt.set((ok?"<b>Correct.</b> ":"<b>Ce n'est pas "+f+".</b> C'est un(e) <b>"+q.fam+"</b>. ")+FRULE[q.fam]+(q.ex?" "+q.ex:"")+" Ici : "+q.c+" + "+q.a+".", ok?"ok":"warn"); k.redraw(); }
    ["oxyde","acide","base","sel"].forEach(function(f){ k.button(f.charAt(0).toUpperCase()+f.slice(1), function(){ ans(f); }); });
    k.button("Formule suivante", function(){ idx++; answered=false; last=""; nt.set("Classe cette formule.",""); }, true);
    nt.set("Classe cette formule.","");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, q=cur();
      T(c,"À quelle famille appartient",W/2,28,{size:13,color:P.grey}); T(c,q.f,W/2,86,{size:Math.min(40,W/(q.f.length*0.62)),color:last==="ok"?P.green:(last==="bad"?P.red:P.ink),math:true});
      if(answered){ T(c,q.c+"   +   "+q.a,W/2,134,{size:15,color:P.ink}); T(c,"cation / première partie + anion / deuxième partie",W/2,158,{size:12,color:P.grey}); }
      ro.set(0,score+" / "+tot); ro.set(1,String(streak)); ro.set(2,((idx%order.length)+1)+" / "+order.length);
    });
  }
});

/* ---------- 4 · Produits ménagers et mélanges dangereux ---------- */
var PROD = {
  javel:{n:"Eau de Javel", f:"NaClO (hypochlorite de sodium) dans l'eau", fam:"sel en solution, basique", ph:"≈ 12", col:"#e8e08a", pic:["corrosif","irritant","environnement"], tag:"jav"},
  vin:{n:"Vinaigre blanc", f:"CH₃COOH (acide éthanoïque) ≈ 5-8 %", fam:"acide faible", ph:"≈ 2,5", col:"#f4efe0", pic:[], tag:"acid"},
  wc:{n:"Détartrant WC", f:"HCl (acide chlorhydrique) en solution", fam:"acide fort", ph:"< 1", col:"#bfe3c9", pic:["corrosif","irritant"], tag:"acid"},
  soude:{n:"Déboucheur (soude)", f:"NaOH (hydroxyde de sodium)", fam:"base forte", ph:"≈ 14", col:"#cfd8f0", pic:["corrosif"], tag:"base"},
  nh3:{n:"Ammoniaque ménagère", f:"NH₃ dans l'eau (NH₄OH)", fam:"base", ph:"≈ 11,5", col:"#d9e8f5", pic:["corrosif","irritant","environnement"], tag:"nh3"},
  bic:{n:"Bicarbonate de soude", f:"NaHCO₃ (hydrogénocarbonate de sodium)", fam:"sel (basique faible)", ph:"≈ 8,3", col:"#f5f5f5", pic:[], tag:"bic"},
  sel:{n:"Sel de cuisine", f:"NaCl (chlorure de sodium)", fam:"sel", ph:"7", col:"#fafafa", pic:[], tag:"sel"},
  h2o2:{n:"Eau oxygénée (3 %)", f:"H₂O₂ (peroxyde d'hydrogène)", fam:"oxydant", ph:"≈ 4", col:"#e6f2fb", pic:["irritant"], tag:"ox"}
};
var PICL = {corrosif:"CORROSIF", irritant:"IRRITANT", environnement:"MILIEU AQUATIQUE"};
function mix(a,b){
  var A=PROD[a], B=PROD[b], t=[A.tag,B.tag].sort().join("+");
  if(a===b) return ["ok","Même produit : rien ne se passe."];
  if(t==="acid+jav") return ["bad","DANGER : avec l'acide chlorhydrique, NaClO + 2 HCl → Cl₂ + NaCl + H₂O ; avec le vinaigre (acide plus faible), le dégagement est plus lent mais possible aussi. L'acide libère du dichlore, un gaz jaune-vert toxique. Ne mélange jamais l'eau de Javel avec un détartrant ou un acide."];
  if(t==="jav+nh3") return ["bad","DANGER : l'eau de Javel et l'ammoniaque forment des chloramines, des gaz toxiques et irritants pour les poumons."];
  if(t==="jav+ox") return ["bad","DANGER : réaction vive avec dégagement de dioxygène et risque de projections (mousse corrosive)."];
  if(t==="acid+ox" && (a==="wc"||b==="wc")) return ["warn","L'eau oxygénée peut oxyder l'acide chlorhydrique en dichlore Cl₂ (gaz toxique) : H₂O₂ + 2 HCl → Cl₂ + 2 H₂O. À éviter."];
  if(t==="acid+ox") return ["warn","L'eau oxygénée et le vinaigre forment de l'acide peracétique, corrosif et irritant. À éviter."];
  if(t==="acid+base") return ["warn","Neutralisation : H⁺ + OH⁻ → H₂O, très exothermique avec une base ou un acide forts : chaleur et projections possibles. Jamais dans un flacon fermé."];
  if(t==="acid+bic") return ["ok","Effervescence : le CO₂ se dégage (HCO₃⁻ + H⁺ → H₂O + CO₂). Pas dangereux, mais les deux produits s'annulent : on perd leurs effets nettoyants."];
  if(t==="base+jav") return ["warn","Aucune réaction dangereuse (deux solutions basiques), mais le mélange est très corrosif pour la peau et les yeux."];
  if(t==="base+nh3") return ["warn","Aucune réaction notable, mais deux bases corrosives : le mélange irrite fortement. Inutile et risqué."];
  if(t==="base+ox") return ["warn","L'eau oxygénée se décompose plus vite en milieu basique (dégagement de O₂). À éviter."];
  if(t==="acid+nh3") return ["warn","Neutralisation : NH₃ + H⁺ → NH₄⁺. Dégagement de chaleur et, avec un acide concentré, fumées irritantes de sel d'ammonium. À éviter."];
  if(t==="bic+jav"||t==="bic+nh3") return ["ok","Aucune réaction dangereuse connue à ce niveau."];
  return ["ok","Aucune réaction dangereuse connue à ce niveau pour ce mélange. (On ne mélange tout de même jamais des produits ménagers sans connaître leur composition.)"];
}
SFA.sim({
  id:"c3-c08-menage", ch:"c08", tag:"Vie courante",
  titre:"Étiquettes de la maison : noms usuels, formules et mélanges à ne jamais faire",
  resume:"Associe un nom usuel à sa formule et sa famille, puis teste ce qui se passe si on mélange deux produits.",
  but:"Choisis deux produits ménagers. Lis leur formule, leur famille, leur pH et leurs pictogrammes. Le simulateur annonce si leur mélange est sans danger, déconseillé ou dangereux.",
  aRetenir:"Les noms usuels (soude, javel, vinaigre) correspondent à des formules précises : NaOH, NaClO, CH₃COOH. Connaître la famille (acide, base, sel, oxydant) permet de prévoir les risques. Règle d'or : on ne mélange jamais deux produits ménagers, surtout l'eau de Javel avec un acide ou de l'ammoniaque.",
  piege:"« Naturel » ne veut pas dire sans danger : le vinaigre est un acide, le bicarbonate un sel basique. Et « acide » ne veut pas dire « dangereux » : le vinaigre se mange. La dangerosité dépend de la substance et de sa concentration. Les valeurs de pH sont des ordres de grandeur.",
  build:function(k,S){
    var c = k.canvas(250);
    var A = k.select("Produit A", Object.keys(PROD).map(function(i){return [i,PROD[i].n];}), "javel");
    var B = k.select("Produit B", Object.keys(PROD).map(function(i){return [i,PROD[i].n];}), "vin");
    var ro = k.readouts(["Produit A","Produit B","Verdict"]);
    var nt = k.note("","");
    function bottle(x,y,w,h,col,name,pics){
      var g=c.ctx; g.save(); g.fillStyle=col; g.strokeStyle="#556"; g.lineWidth=2.5; g.beginPath(); g.moveTo(x+w*0.3,y); g.lineTo(x+w*0.7,y); g.lineTo(x+w*0.7,y+h*0.18); g.lineTo(x+w,y+h*0.3); g.lineTo(x+w,y+h); g.lineTo(x,y+h); g.lineTo(x,y+h*0.3); g.lineTo(x+w*0.3,y+h*0.18); g.closePath(); g.fill(); g.stroke(); g.restore();
      pics.forEach(function(p,i){ var cx=x+w/2, cy=y+h*0.52+i*22, g2=c.ctx; g2.save(); g2.translate(cx,cy); g2.rotate(Math.PI/4); g2.strokeStyle=P.red; g2.lineWidth=2; g2.fillStyle="#fff"; g2.fillRect(-9,-9,18,18); g2.strokeRect(-9,-9,18,18); g2.restore(); T(c,p==="corrosif"?"C":(p==="irritant"?"!":"~"),cx,cy,{size:12,color:P.red}); });
    }
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, a=PROD[A.value], b=PROD[B.value], v=mix(A.value,B.value), colV=v[0]==="bad"?P.red:(v[0]==="warn"?P.amber:P.green);
      var bw=Math.min(80,W*0.22), bh=H*0.58, by=34;
      bottle(W*0.1,by,bw,bh,a.col,a.n,a.pic); bottle(W*0.9-bw,by,bw,bh,b.col,b.n,b.pic);
      T(c,a.n,W*0.1+bw/2,by-14,{size:12,color:P.ink}); T(c,b.n,W*0.9-bw/2,by-14,{size:12,color:P.ink});
      T(c,"+",W/2,by+bh*0.5,{size:30,color:P.grey});
      rr(c,12,H-70,W-24,56,v[0]==="bad"?"#fdecea":(v[0]==="warn"?"#fff4e0":"#e8f6ee"),colV,2,10);
      T(c,v[0]==="bad"?"DANGER : ne jamais mélanger":(v[0]==="warn"?"À éviter":"Pas de danger notable"),W/2,H-42,{size:15,color:colV});
      ro.set(0,a.f.split(" (")[0]); ro.set(1,b.f.split(" (")[0]); ro.set(2,v[0]==="bad"?"dangereux":(v[0]==="warn"?"déconseillé":"sans danger notable"));
      function card(p){ return "<b>"+p.n+"</b> : "+p.f+" · "+p.fam+" · pH "+p.ph+" · pictogrammes : "+(p.pic.length?p.pic.map(function(x){return PICL[x];}).join(", "):"aucun"); }
      nt.set(card(a)+"<br>"+card(b)+"<br><b>Mélange :</b> "+v[1], v[0]==="bad"?"bad":(v[0]==="warn"?"warn":"ok"));
    });
  }
});
})();
