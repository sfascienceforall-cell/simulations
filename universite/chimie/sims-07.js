/* Chimie BA1 · compléments · chapitre 7 : cinétique et mécanismes */
(function(){
var P = function(){ return SFA.draw.palette; };
var R = 8.314;

/* ---------- 1. Vitesses initiales : ordres partiels ---------- */
var SCEN = {
  A:{m:1,n:1,k:0.50,u:"L/(mol·s)"},
  B:{m:2,n:1,k:12,u:"L²/(mol²·s)"},
  C:{m:1,n:0,k:0.030,u:"s⁻¹"},
  D:{m:0,n:2,k:0.80,u:"L/(mol·s)"}
};
var EXP = [[0.10,0.10],[0.20,0.10],[0.10,0.30],[0.30,0.20]];
var NOISE = [1.000,1.012,0.991,1.007];
SFA.sim({
  id:"uc-c07-vitesses-initiales", ch:"c07", tag:"Méthode des vitesses initiales",
  titre:"Trouver les ordres partiels dans un tableau d’expériences",
  resume:"Quatre expériences, une loi de vitesse cachée : double une concentration, regarde v, déduis l’ordre.",
  but:"Choisis une réaction. Compare les expériences deux à deux (une seule concentration change) pour trouver les ordres, puis vérifie ta loi sur les 4 expériences et lis k.",
  aRetenir:"Quand [A] est multipliée par r et [B] ne change pas, v est multipliée par r<sup>m</sup> : m = log(v₂/v₁)/log r. L’ordre se lit dans le tableau, JAMAIS dans l’équation bilan. k se calcule ensuite : k = v/([A]<sup>m</sup>[B]<sup>n</sup>).",
  piege:"Erreurs classiques : comparer deux expériences où DEUX concentrations ont changé (comme 1 et 4), ou déduire l’ordre des coefficients stœchiométriques. Une vitesse insensible à [B] signifie ordre 0 en B (pas « ordre 1 »).",
  build:function(k,S){
    var c = k.canvas(300);
    var sc = k.seg("Réaction",[["A","A"],["B","B"],["C","C"],["D","D"]],"A");
    var gm = k.seg("Ordre supposé en A",[[0,"0"],[1,"1"],[2,"2"]],1);
    var gn = k.seg("Ordre supposé en B",[[0,"0"],[1,"1"],[2,"2"]],1);
    var meth = k.toggle("Montrer la méthode des rapports",false);
    var ro = k.readouts(["k calculé","Écart maximal prédiction/mesure"]);
    var nt = k.note("","");
    function vexp(i){ var s=SCEN[sc.value]; return s.k*Math.pow(EXP[i][0],s.m)*Math.pow(EXP[i][1],s.n)*NOISE[i]; }
    k.draw(function(){
      c.clear(); var s=SCEN[sc.value], ctx=c.ctx, W=c.W;
      var cols=[W*0.07,W*0.2,W*0.37,W*0.6,W*0.84], y0=26, dy=32;
      var heads=["Exp.","[A] (mol/L)","[B] (mol/L)","v mesurée (mol/(L·s))","v prédite"];
      ctx.save(); ctx.fillStyle="#eef2f8"; ctx.fillRect(4,y0-16,W-8,32); ctx.restore();
      heads.forEach(function(h,j){ S.draw.text(c,h,cols[j],y0,{size:11.5,color:P().acc}); });
      var maxerr=0, kk=[];
      for (var i=0;i<4;i++){
        var y=y0+dy*(i+1), v=vexp(i), pred=Math.pow(EXP[i][0],gm.value)*Math.pow(EXP[i][1],gn.value);
        kk.push(v/pred);
        S.draw.text(c,String(i+1),cols[0],y,{size:12});
        S.draw.text(c,S.fmt(EXP[i][0],2),cols[1],y,{size:12,math:true});
        S.draw.text(c,S.fmt(EXP[i][1],2),cols[2],y,{size:12,math:true});
        S.draw.text(c,S.sci(v,3),cols[3],y,{size:12,math:true});
      }
      var kbar=kk[0]; /* k calculé à partir de l'exp. 1 */
      for (i=0;i<4;i++){ var v2=vexp(i), pr=kbar*Math.pow(EXP[i][0],gm.value)*Math.pow(EXP[i][1],gn.value); var e=Math.abs(pr-v2)/v2; maxerr=Math.max(maxerr,e); S.draw.text(c,S.sci(pr,3),cols[4],y0+dy*(i+1),{size:12,math:true,color:e<0.03?P().green:P().red}); }
      if (meth.value){
        var r1=vexp(1)/vexp(0), r2=vexp(2)/vexp(0);
        S.draw.text(c,"Exp. 2 / exp. 1 : [A] ×2, [B] constante, v ×"+S.fmt(r1,2)+"  ⟹  2^m = "+S.fmt(r1,2)+"  ⟹  m ≈ "+S.fmt(Math.log(r1)/Math.log(2),2),W/2,y0+dy*5+4,{size:12,color:P().violet});
        S.draw.text(c,"Exp. 3 / exp. 1 : [B] ×3, [A] constante, v ×"+S.fmt(r2,2)+"  ⟹  3^n = "+S.fmt(r2,2)+"  ⟹  n ≈ "+S.fmt(Math.log(r2)/Math.log(3),2),W/2,y0+dy*5+30,{size:12,color:P().violet});
      } else S.draw.text(c,"Compare les expériences 1 et 2 (A change seul), puis 1 et 3 (B change seul).",W/2,y0+dy*5+10,{size:12,color:P().grey});
      ro.set(0,S.sci(kbar,3)+" (unité adaptée)"); ro.set(1,S.fmt(maxerr*100,1)+" %");
      if (maxerr<0.03) nt.set("Ta loi v = k[A]<sup>"+gm.value+"</sup>[B]<sup>"+gn.value+"</sup> reproduit les 4 mesures (écart &lt; 3 %, bruit expérimental ≈ 1 %). Ordre global = "+(gm.value+gn.value)+".","ok");
      else nt.set("Ta loi ne reproduit pas toutes les mesures : revois l’ordre d’un des deux réactifs.","warn");
    });
  }
});

/* ---------- 2. Mécanismes et étape déterminante ---------- */
var MECA = {
  no:{ bilan:"2 NO + O₂ → 2 NO₂", s1:"2 NO ⇌ N₂O₂", s2:"N₂O₂ + O₂ → 2 NO₂", xs:[["NO",2],["O₂",1]],
       l1:"v = k₁[NO]²  (étape 1 lente : l’O₂ n’intervient pas)", l2:"v = k₂K[NO]²[O₂]  (pré-équilibre rapide, K = k₁/k₋₁)",
       f1:function(a){ return a.NO*a.NO; }, f2:function(a){ return a.NO*a.NO*a.O2; }, i:"N₂O₂" },
  o3:{ bilan:"2 O₃ → 3 O₂", s1:"O₃ ⇌ O₂ + O", s2:"O + O₃ → 2 O₂", xs:[["O₃",1],["O₂",1]],
       l1:"v = k₁[O₃]  (étape 1 lente et irréversible)", l2:"v = k₂K[O₃]²/[O₂]  (pré-équilibre ; O₂ est un inhibiteur)",
       f1:function(a){ return a.O3; }, f2:function(a){ return a.O3*a.O3/a.O2; }, i:"O" },
  sn:{ bilan:"(CH₃)₃CBr + OH⁻ → (CH₃)₃COH + Br⁻", s1:"(CH₃)₃CBr ⇌ (CH₃)₃C⁺ + Br⁻", s2:"(CH₃)₃C⁺ + OH⁻ → (CH₃)₃COH", xs:[["RBr",1],["OH⁻",1]],
       l1:"v = k₁[RBr]  (SN1 : ionisation lente, [OH⁻] sans effet)", l2:"v = k₂K[RBr][OH⁻]/[Br⁻]  (cas hypothétique : si l’attaque du carbocation était lente, Br⁻ ralentirait la réaction ; ce n’est PAS une SN2, qui se fait en une seule étape concertée et donne v = k[RBr][OH⁻])",
       f1:function(a){ return a.RBr; }, f2:function(a){ return a.RBr*a.OH/a.Br; }, i:"(CH₃)₃C⁺" }
};
SFA.sim({
  id:"uc-c07-mecanisme-etape-lente", ch:"c07", tag:"Mécanismes",
  titre:"Mécanisme en deux étapes : quelle est l’étape lente ?",
  resume:"La loi de vitesse expérimentale dépend de l’étape déterminante ; lis-la sur le profil d’énergie.",
  but:"Choisis un mécanisme et l’étape lente : le profil énergétique, la loi de vitesse et l’effet d’un changement de concentration s’affichent. Vérifie que la somme des étapes redonne le bilan.",
  aRetenir:"La loi de vitesse est celle de l’étape LENTE (plus haute barrière). Un intermédiaire n’apparaît ni dans le bilan ni dans la loi finale : on l’élimine par un pré-équilibre rapide. Les ordres du mécanisme doivent concorder avec l’expérience.",
  piege:"Lire les ordres dans les coefficients du bilan (2 NO + O₂ → ordre 3 ?) : un bilan n’est pas une étape élémentaire. Un mécanisme n’est jamais « prouvé », seulement compatible avec la loi de vitesse mesurée.",
  build:function(k,S){
    var c = k.canvas(260);
    var m = k.seg("Mécanisme",[["no","NO + O₂"],["o3","Ozone"],["sn","SN1 (bromure de tert-butyle)"]],"no");
    var sl = k.seg("Étape lente",[["1","Étape 1"],["2","Étape 2"]],"2");
    var fa = k.slider("Facteur sur la 1<sup>re</sup> concentration",0.5,4,0.5,2,"×");
    var fb = k.slider("Facteur sur la 2<sup>e</sup> concentration",0.5,4,0.5,1,"×");
    var ro = k.readouts(["v / v₀"]);
    var nt = k.note("","");
    k.draw(function(){
      var d=MECA[m.value]; c.clear();
      var slow=sl.value, W=c.W, ctx=c.ctx;
      /* profil : réactifs 0, I niveau 25, produits -20 ; barrières selon l'étape lente */
      var e1 = slow==="1"?90:45, e2 = slow==="2"?95:40;
      var pts=[[0,0],[1,e1],[2,25],[3,25+e2],[4,-20]];
      var X=function(t){ return 50+t/4*(W-80); }, Y=function(e){ return c.H-40-(e+25)/150*(c.H-70); };
      ctx.save(); ctx.strokeStyle="#8a95a3"; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(40,10); ctx.lineTo(40,c.H-30); ctx.lineTo(W-14,c.H-30); ctx.stroke(); ctx.restore();
      S.draw.text(c,"énergie",42,12,{size:11,align:"left",color:P().grey}); S.draw.text(c,"coordonnée de réaction",W-14,c.H-12,{size:11,align:"right",color:P().grey});
      /* tracé propre par segments (2 collines) */
      ctx.save(); ctx.strokeStyle=P().acc; ctx.lineWidth=2.8; ctx.beginPath();
      function hill(xa,ya,xb,yb,top){ for (var i=0;i<=40;i++){ var u=i/40, x=xa+(xb-xa)*u, y=ya+(yb-ya)*(3*u*u-2*u*u*u)+(top-(ya+yb)/2)*Math.sin(Math.PI*u); var px=X(x), py=Y(y); if (i===0&&xa===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); } }
      hill(0,0,2,25,e1); hill(2,25,4,-20,25+e2);
      ctx.stroke(); ctx.restore();
      S.draw.text(c,"réactifs",X(0)+16,Y(0)+14,{size:11,color:P().ink}); S.draw.text(c,"intermédiaire "+d.i,X(2),Y(25)+16,{size:11,color:P().ink}); S.draw.text(c,"produits",X(4)-18,Y(-20)+14,{size:11,color:P().ink});
      S.draw.text(c,slow==="1"?"état de transition 1 : le plus haut, étape LENTE":"état de transition 1",X(1),Y(e1)-12,{size:11,color:slow==="1"?P().red:P().grey});
      S.draw.text(c,slow==="2"?"état de transition 2 : le plus haut, étape LENTE":"état de transition 2",X(3),Y(25+e2)-12,{size:11,color:slow==="2"?P().red:P().grey});
      var a = m.value==="o3" ? {O3:fa.value,O2:fb.value} : m.value==="sn" ? {RBr:fa.value,OH:fb.value,Br:1} : {NO:fa.value,O2:fb.value};
      var ratio = slow==="1" ? d.f1(a) : d.f2(a);
      ro.set(0,"× "+S.fmt(ratio,2));
      var first=m.value==="no"?"[NO]":m.value==="o3"?"[O₃]":"[RBr]", second=m.value==="no"?"[O₂]":m.value==="o3"?"[O₂]":"[OH⁻]";
      nt.set("<b>Bilan :</b> "+d.bilan+"<br><b>Étape 1 :</b> "+d.s1+"<br><b>Étape 2 :</b> "+d.s2+"<br><b>Somme :</b> les étapes s’additionnent et l’intermédiaire "+d.i+" disparaît.<br><b>Loi :</b> "+(slow==="1"?d.l1:d.l2)+"<br>Tu as multiplié "+first+" par "+S.fmt(fa.value,1)+" et "+second+" par "+S.fmt(fb.value,1)+".","");
    });
  }
});

/* ---------- 3. Arrhenius linéaire ---------- */
SFA.sim({
  id:"uc-c07-arrhenius-lineaire", ch:"c07", tag:"Énergie d’activation",
  titre:"Arrhenius : la droite ln k contre 1/T",
  resume:"Pente = −Ea/R. Compare k à deux températures, avec ou sans catalyseur.",
  but:"Règle Ea, le facteur de fréquence et deux températures : ln k est une droite en 1/T. Le catalyseur abaisse Ea (donc relève la droite à pente moins raide).",
  aRetenir:"k = A·e<sup>−Ea/RT</sup> ; ln k = ln A − (Ea/R)(1/T) ; ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂). Une grande Ea rend la vitesse très sensible à T.",
  piege:"Ea en kJ/mol mais R en J/(mol·K) : convertir. T en kelvins. « Ça double tous les 10 K » n’est qu’une règle empirique (valable pour Ea ≈ 50 kJ/mol vers 300 K).",
  build:function(k,S){
    var c = k.canvas(310);
    var ea = k.slider("Énergie d’activation Ea",20,200,5,60,"kJ/mol");
    var la = k.slider("log₁₀ A",5,16,0.5,10,"");
    var t1 = k.slider("Température T₁",270,400,5,298,"K");
    var t2 = k.slider("Température T₂",270,400,5,310,"K");
    var cat = k.toggle("Catalyseur (Ea − 30 kJ/mol)",false);
    var ro = k.readouts(["k(T₁)","k(T₂)","k₂/k₁","× par +10 K à T₁"]);
    function E(){ return Math.max(5,ea.value-(cat.value?30:0)); }
    function lnk(T){ return la.value*Math.LN10-E()*1000/(R*T); }
    k.draw(function(){
      c.clear();
      var ends=[lnk(270),lnk(400),lnk(270)-0,lnk(400)];
      var lo=Math.floor(Math.min(ends[0],ends[1])-1), hi=Math.ceil(Math.max(ends[0],ends[1])+1);
      var ax=S.draw.axes(c,{x0:2.4,x1:3.8,y0:Math.min(lo,-30),y1:Math.max(hi,30),xl:"1000/T (K⁻¹)",yl:"ln k",stepX:0.2,l:50});
      S.draw.fn(c,ax,function(u){ return lnk(1000/u); },cat.value?P().green:P().acc,2.8);
      if (cat.value){ var e0=ea.value; S.draw.fn(c,ax,function(u){ return la.value*Math.LN10-e0*1000/(R*1000/u); },P().grey,1.6,[5,4]); }
      [[t1.value,P().red,"T₁"],[t2.value,P().amber,"T₂"]].forEach(function(p){ S.draw.dot(c,ax.X(1000/p[0]),ax.Y(lnk(p[0])),6,p[1]); S.draw.text(c,p[2],ax.X(1000/p[0]),ax.Y(lnk(p[0]))-13,{size:11,color:p[1]}); });
      S.draw.text(c,"pente = −Ea/R = "+S.fmt(-E()*1000/R/1000,2)+" ·10³ K",ax.R-10,ax.T+10,{align:"right",size:12,color:P().acc});
      var k1=Math.exp(lnk(t1.value)), k2=Math.exp(lnk(t2.value)), k3=Math.exp(lnk(t1.value+10));
      ro.set(0,S.sci(k1,2)); ro.set(1,S.sci(k2,2)); ro.set(2,"× "+S.sci(k2/k1,2)); ro.set(3,"× "+S.fmt(k3/k1,2));
    });
    k.note("k est affichée dans l’unité propre à l’ordre de la réaction (ici, valeur numérique seule). Courbe grise en pointillés : sans catalyseur.","");
  }
});

/* ---------- 4. Pharmacocinétique : doses répétées ---------- */
SFA.sim({
  id:"uc-c07-pharmacocinetique", ch:"c07", tag:"Cinétique d’ordre 1 et médecine",
  titre:"Doses répétées : accumulation et état d’équilibre",
  resume:"Élimination d’ordre 1, accumulation, plateau après ≈ 5 demi-vies, dose de charge.",
  but:"Règle la dose, l’intervalle, la demi-vie et le volume de distribution. Compare C<sub>max</sub> et C<sub>min</sub> à l’état d’équilibre à la fenêtre thérapeutique ; teste une dose de charge.",
  aRetenir:"k = ln 2/t<sub>½</sub>. Après n doses IV rapides : C = (D/V)Σ e<sup>−k(t−tᵢ)</sup>. À l’état d’équilibre : C<sub>max</sub> = (D/V)/(1 − e<sup>−kτ</sup>) et C<sub>min</sub> = C<sub>max</sub>·e<sup>−kτ</sup>. Facteur d’accumulation 1/(1 − e<sup>−kτ</sup>) ; plateau après ≈ 4 à 5 t<sub>½</sub>.",
  piege:"Modèle monocompartimental, injection IV instantanée, élimination d’ordre 1 (pas de saturation). Un médicament éliminé selon un ordre 0 (alcool, phénytoïne à forte dose) s’accumule de façon bien plus dangereuse.",
  build:function(k,S){
    var c = k.canvas(320);
    var D = k.slider("Dose D",100,1000,50,500,"mg");
    var V = k.slider("Volume de distribution V",10,100,5,40,"L");
    var th = k.slider("Demi-vie t½",1,24,0.5,6,"h");
    var tau = k.slider("Intervalle τ",2,24,1,8,"h");
    var minS = k.slider("Seuil d’efficacité",1,20,0.5,8,"mg/L");
    var maxS = k.slider("Seuil de toxicité",10,60,1,25,"mg/L");
    var load = k.toggle("Dose de charge (1<sup>re</sup> dose × facteur d’accumulation)",false);
    var ro = k.readouts(["C<sub>max</sub> équilibre","C<sub>min</sub> équilibre","Facteur d’accumulation","Plateau atteint vers"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear();
      var kk=Math.LN2/th.value, e=Math.exp(-kk*tau.value), Rr=1/(1-e);
      var nd=Math.min(16,Math.max(6,Math.ceil(5*th.value/tau.value)+2)), Tm=nd*tau.value;
      function C(t){ var s=0; for (var i=0;i<nd;i++){ var ti=i*tau.value; if (t>=ti){ var d=(i===0&&load.value)?D.value*Rr:D.value; s+=d/V.value*Math.exp(-kk*(t-ti)); } } return s; }
      var cmaxss=D.value/V.value*Rr, cminss=cmaxss*e;
      var ymax=Math.max(maxS.value*1.15,cmaxss*1.15,(load.value?D.value*Rr/V.value*1.1:0));
      var ax=S.draw.axes(c,{x0:0,x1:Tm,y0:0,y1:ymax,xl:"t (h)",yl:"C (mg/L)",l:50});
      var ctx=c.ctx; ctx.save(); ctx.fillStyle="rgba(46,107,85,.10)"; ctx.fillRect(ax.L,ax.Y(maxS.value),ax.R-ax.L,ax.Y(minS.value)-ax.Y(maxS.value)); ctx.restore();
      S.draw.line(c,ax.L,ax.Y(minS.value),ax.R,ax.Y(minS.value),P().green,1.6,[5,4]); S.draw.line(c,ax.L,ax.Y(maxS.value),ax.R,ax.Y(maxS.value),P().red,1.6,[5,4]);
      S.draw.text(c,"fenêtre thérapeutique",ax.R-8,ax.Y(maxS.value)+11,{size:11,color:P().green,align:"right"});
      S.draw.fn(c,ax,C,P().acc,2.4);
      ro.set(0,S.fmt(cmaxss,1)+" mg/L"); ro.set(1,S.fmt(cminss,1)+" mg/L"); ro.set(2,"× "+S.fmt(Rr,2)); ro.set(3,S.fmt(4.5*th.value,0)+" h");
      var m="";
      if (cmaxss>maxS.value && cminss<minS.value) m="Fenêtre trop étroite : Cmax dépasse le seuil toxique ET Cmin passe sous le seuil d’efficacité. Fractionner la dose (τ plus court, D plus petite).";
      else if (cmaxss>maxS.value) m="Cmax à l’équilibre dépasse le seuil de toxicité : réduire la dose ou espacer les prises.";
      else if (cminss<minS.value) m="Cmin à l’équilibre sous le seuil d’efficacité : augmenter la dose ou raccourcir τ ; une dose de charge accélère l’entrée dans la fenêtre.";
      else m="Les valeurs d’équilibre restent dans la fenêtre thérapeutique.";
      nt.set(m,(cmaxss>maxS.value||cminss<minS.value)?"warn":"ok");
    });
  }
});

/* ---------- 5. Michaelis-Menten et inhibition ---------- */
SFA.sim({
  id:"uc-c07-michaelis-menten", ch:"c07", tag:"Enzymes",
  titre:"Michaelis-Menten et inhibiteurs",
  resume:"v en fonction de [S], saturation, Km, inhibition compétitive ou non compétitive, double inverse.",
  but:"Fais varier [S], Vmax, Km et l’inhibiteur. Compare la courbe directe et le tracé de Lineweaver-Burk : un inhibiteur compétitif change la pente mais pas l’ordonnée à l’origine.",
  aRetenir:"v = Vmax[S]/(Km + [S]). v = Vmax/2 quand [S] = Km. Compétitif : Km apparent = Km(1 + [I]/Ki), Vmax inchangée. Non compétitif : Vmax apparent = Vmax/(1 + [I]/Ki), Km inchangé. Lineweaver-Burk : 1/v = (Km/Vmax)(1/[S]) + 1/Vmax.",
  piege:"Vmax n’est jamais « atteinte » : v tend vers Vmax. Le tracé 1/v amplifie l’erreur des faibles concentrations. Pour [S] ≪ Km, la cinétique est d’ordre 1 ; pour [S] ≫ Km, d’ordre 0.",
  build:function(k,S){
    var c = k.canvas(320);
    var mode = k.seg("Tracé",[["d","v contre [S]"],["i","1/v contre 1/[S]"]],"d");
    var vm = k.slider("Vmax",10,100,5,60,"µmol/(L·min)");
    var km = k.slider("Km",0.2,10,0.2,2,"mmol/L");
    var s = k.slider("[S]",0.1,30,0.1,4,"mmol/L");
    var inh = k.seg("Inhibiteur",[["0","aucun"],["c","compétitif"],["n","non compétitif"]],"0");
    var ci = k.slider("[I] (Ki = 1 mmol/L)",0,5,0.25,2,"mmol/L");
    var ro = k.readouts(["v à cette [S]","v / Vmax","Km apparent","Vmax apparent"]);
    function par(){ var a=inh.value==="0"?0:ci.value; var kma=km.value*(inh.value==="c"?1+a:1), vma=vm.value/(inh.value==="n"?1+a:1); return {km:kma,vm:vma}; }
    k.draw(function(){
      c.clear(); var p=par();
      if (mode.value==="d"){
        var ax=S.draw.axes(c,{x0:0,x1:30,y0:0,y1:vm.value*1.1,xl:"[S] (mmol/L)",yl:"v",stepX:5,l:50});
        S.draw.fn(c,ax,function(x){ return vm.value*x/(km.value+x); },P().grey,1.8,[5,4]);
        S.draw.fn(c,ax,function(x){ return p.vm*x/(p.km+x); },P().acc,2.8);
        S.draw.line(c,ax.L,ax.Y(p.vm/2),ax.X(p.km),ax.Y(p.vm/2),P().amber,1.4,[3,4]); S.draw.line(c,ax.X(p.km),ax.Y(p.vm/2),ax.X(p.km),ax.B,P().amber,1.4,[3,4]);
        S.draw.text(c,"Km apparent",ax.X(p.km),ax.B-10,{size:11,color:P().amber,bg:"#fff"});
        S.draw.dot(c,ax.X(s.value),ax.Y(p.vm*s.value/(p.km+s.value)),6,P().red);
      } else {
        var ln0=function(x){ return km.value/vm.value*x+1/vm.value; }, ln1=function(x){ return p.km/p.vm*x+1/p.vm; };
        var x0=-1.3/km.value, x1=5;
        var yy0=Math.min(ln0(x0),ln1(x0),0), yy1=Math.max(ln0(x1),ln1(x1))*1.1;
        var ax2=S.draw.axes(c,{x0:x0,x1:x1,y0:yy0*1.1,y1:yy1,xl:"1/[S] (L/mmol)",yl:"1/v",l:56});
        S.draw.fn(c,ax2,function(x){ return km.value/vm.value*x+1/vm.value; },P().grey,1.8,[5,4]);
        S.draw.fn(c,ax2,function(x){ return p.km/p.vm*x+1/p.vm; },P().acc,2.8);
        S.draw.dot(c,ax2.X(0),ax2.Y(1/p.vm),5,P().green); S.draw.text(c,"1/Vmax",ax2.X(0)+30,ax2.Y(1/p.vm)+12,{size:11,color:P().green});
        S.draw.dot(c,ax2.X(-1/p.km),ax2.Y(0),5,P().amber); S.draw.text(c,"−1/Km",ax2.X(-1/p.km),ax2.Y(0)-12,{size:11,color:P().amber});
        S.draw.dot(c,ax2.X(1/s.value),ax2.Y(1/(p.vm*s.value/(p.km+s.value))),6,P().red);
      }
      var v=p.vm*s.value/(p.km+s.value);
      ro.set(0,S.fmt(v,1)+" µmol/(L·min)"); ro.set(1,S.fmt(v/vm.value*100,0)+" %"); ro.set(2,S.fmt(p.km,2)+" mmol/L"); ro.set(3,S.fmt(p.vm,1));
    });
    k.note("Courbe grise en pointillés : enzyme sans inhibiteur. Modèle simplifié (conditions de Michaelis-Menten, état quasi stationnaire).","");
  }
});
})();
