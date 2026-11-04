/* Chapitre 1 · Mélanges, corps purs et techniques de séparation */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }

/* ---------- 1 · Atelier de séparation ---------- */
var COL = {sable:"#c9a45c", sel:"#9fb4c9", "sel (dissous)":"#9fb4c9", eau:"#6fb1e6", huile:"#e0b832", "éthanol":"#b19cd9", fer:"#555d68"};
function C(n,kind,id,bp){ return {n:n, kind:kind, id:id||"", bp:bp||0}; }
var MIX = {
  a:{t:"Sable + sel de cuisine dissous dans l'eau", make:function(){ return [C("sable","solid"), C("sel (dissous)","diss"), C("eau","liq","aq",100)]; }, hint:"Idée : le sable ne passe pas dans un filtre, le sel dissous oui. Comment récupérer ensuite le sel ?"},
  b:{t:"Huile + eau salée", make:function(){ return [C("huile","liq","org",300), C("eau","liq","aq",100), C("sel (dissous)","diss")]; }, hint:"Idée : l'huile et l'eau ne se mélangent pas. Quelle technique exploite cela ?"},
  c:{t:"Eau + éthanol", make:function(){ return [C("eau","liq","aq",100), C("éthanol","liq","aq",78)]; }, hint:"Idée : les deux liquides se mélangent parfaitement, mais bouillent à des températures différentes."},
  d:{t:"Limaille de fer + sable + sel (poudres sèches)", make:function(){ return [C("fer","mag"), C("sable","solid"), C("sel","sol")]; }, hint:"Idée : un seul des solides est attiré par un aimant, un seul se dissout dans l'eau."}
};
SFA.sim({
  id:"c3-c01-atelier", ch:"c01", tag:"Classique",
  titre:"Atelier de séparation : enchaîne les bonnes techniques",
  resume:"Choisis un mélange puis applique tes techniques dans le bon ordre jusqu'à isoler chaque constituant.",
  but:"Choisis un mélange et clique sur les techniques une à une. Chaque technique ne sépare que ce pour quoi elle est faite : à toi de trouver l'ordre qui isole tous les constituants.",
  aRetenir:"Une technique de séparation exploite une différence de propriété : l'aimant (magnétisme), la filtration (taille des grains / solubilité), la décantation (liquides non miscibles), l'évaporation (un solide dissous reste), la distillation (températures d'ébullition différentes).",
  piege:"Filtrer ne sépare pas un solide dissous de l'eau : le sel dissous traverse le filtre. Et l'évaporation fait perdre le liquide ; seule la distillation le récupère.",
  build:function(k,S){
    var c = k.canvas(330);
    var sel = k.select("Mélange", [["a",MIX.a.t],["b",MIX.b.t],["c",MIX.c.t],["d",MIX.d.t]], "a", function(){ reset(); });
    var st, log, lost;
    var nt = k.note("", "");
    var lg = k.note("", "");
    function reset(){ var m = MIX[sel.value]; st = {cur:m.make(), fr:[]}; log=[]; lost=[]; nt.set(m.hint,""); lg.set("Journal : aucune technique appliquée.",""); }
    function has(arr,f){ return arr.some(f); }
    function act(name){
      var cur = st.cur, out = [];
      var liq = cur.filter(function(x){return x.kind==="liq";});
      var msg = "";
      if (name==="aimant"){ out = cur.filter(function(x){return x.kind==="mag";});
        if(!out.length) msg="L'aimant n'attire rien ici."; else { st.cur = cur.filter(function(x){return x.kind!=="mag";}); st.fr.push({l:"À l'aimant",a:out}); msg="Le fer est attiré et récupéré."; } }
      else if (name==="eau"){
        var sol = cur.filter(function(x){return x.kind==="sol";});
        if(!sol.length) msg="Il n'y a rien à dissoudre.";
        else { sol.forEach(function(x){ x.kind="diss"; x.n="sel (dissous)"; }); if(!has(cur,function(x){return x.n==="eau";})) cur.push(C("eau","liq","aq",100)); msg="Le sel se dissout : il devient invisible mais il est toujours là."; } }
      else if (name==="filtre"){
        if(!liq.length) msg="La filtration a besoin d'un liquide : ajoute d'abord de l'eau.";
        else { out = cur.filter(function(x){return x.kind==="solid";});
          if(!out.length) msg="Le filtre ne retient rien : le sel dissous est passé avec l'eau (filtrat inchangé)."; else { st.cur = cur.filter(function(x){return x.kind!=="solid";}); st.fr.push({l:"Sur le filtre",a:out}); msg="Les solides non dissous restent sur le filtre."; } } }
      else if (name==="decante"){
        var ids = {}; liq.forEach(function(x){ids[x.id]=1;});
        if(Object.keys(ids).length<2) msg="Il n'y a pas deux liquides non miscibles : la décantation ne sépare rien.";
        else { out = cur.filter(function(x){return x.kind==="liq"&&x.id==="org";}); st.cur = cur.filter(function(x){return !(x.kind==="liq"&&x.id==="org");}); st.fr.push({l:"Décanté (dessus)",a:out}); msg="Le liquide le moins dense surnage et est soutiré par le robinet de l'ampoule."; } }
      else if (name==="evap"){
        if(!liq.length) msg="Il n'y a plus de liquide à évaporer.";
        else { liq.forEach(function(x){ lost.push(x.n); }); st.cur = cur.filter(function(x){return x.kind!=="liq";});
          st.cur.forEach(function(x){ if(x.kind==="diss"){ x.kind="sol"; x.n="sel"; } });
          msg="Le liquide part dans l'air (il est perdu) ; les solides dissous cristallisent."; } }
      else if (name==="dist"){
        if(!liq.length) msg="Il n'y a pas de liquide à distiller.";
        else { liq.sort(function(a,b){return a.bp-b.bp;});
          liq.forEach(function(x,i){ st.fr.push({l:"Distillat n°"+(i+1)+" (éb. "+x.bp+" °C)",a:[x]}); });
          st.cur = cur.filter(function(x){return x.kind!=="liq";});
          st.cur.forEach(function(x){ if(x.kind==="diss"){ x.kind="sol"; x.n="sel"; } });
          msg="Les liquides sont recueillis dans l'ordre de leurs températures d'ébullition ; les solides restent dans le ballon."; } }
      log.push(msg); lg.set("<b>Journal.</b> "+log.map(function(x,i){return (i+1)+". "+x;}).join("<br>"), "");
      check();
    }
    function check(){
      var groups = [st.cur].concat(st.fr.map(function(f){return f.a;})), ok = true, all = [];
      groups.forEach(function(g){ if(g.length>1) ok=false; });
      if (ok && st.cur.length+st.fr.length>0 && log.length){
        nt.set("<b>Bravo !</b> Chaque constituant est isolé"+(lost.length?" (le liquide évaporé, <i>"+lost.join(", ")+"</i>, est perdu dans l'air)":"")+". Essaie un autre mélange.","ok");
      } else nt.set("Un groupe contient encore plusieurs constituants : continue.","warn");
    }
    [["Aimant","aimant"],["Ajouter de l'eau","eau"],["Filtration","filtre"],["Décantation","decante"],["Évaporation","evap"],["Distillation","dist"]].forEach(function(p){ k.button(p[0], function(){ act(p[1]); }); });
    k.button("Recommencer", function(){ reset(); }, true);
    function chips(x,y,w,items){
      var g=c.ctx, cx=x, cy=y; g.save(); g.font="700 13px Mulish, system-ui";
      items.forEach(function(it){ var tw=g.measureText(it.n).width+24; if(cx+tw>x+w){cx=x;cy+=24;}
        rr(c,cx,cy,tw,20,"#fff",COL[it.n]||"#999",2,10); g.fillStyle=COL[it.n]||"#999"; g.beginPath(); g.arc(cx+10,cy+10,5,0,6.3); g.fill();
        g.fillStyle="#0f1b2d"; g.textAlign="left"; g.textBaseline="middle"; g.fillText(it.n,cx+19,cy+10); cx+=tw+6; });
      g.restore(); return cy+26-y;
    }
    reset();
    k.draw(function(){
      c.clear(); var W=c.W, y=8;
      var boxes = [{l:"Mélange dans le bécher", a:st.cur, cur:true}].concat(st.fr);
      boxes.forEach(function(b){
        var h = 30 + (function(){ var g=c.ctx; g.save(); g.font="700 13px Mulish, system-ui"; var cx=0, rows=1; b.a.forEach(function(it){ var tw=g.measureText(it.n).width+30; if(cx+tw>W-36){cx=0;rows++;} cx+=tw; }); g.restore(); return rows*24; })();
        if (y+h > c.H-4) return;
        rr(c,8,y,W-16,h,b.cur?"#f3f6fb":"#f2f8f4",b.cur?P.acc:P.green,1.5,10);
        T(c,b.l+(b.a.length>1?"  (mélange)":""),18,y+13,{size:12,color:P.grey,align:"left"});
        if (b.a.length) chips(18,y+24,W-36,b.a); else T(c,"(vide)",18,y+34,{size:13,color:P.grey,align:"left"});
        y += h + 6;
      });
      if (lost.length && y+24 < c.H) T(c,"Perdu dans l'air : "+lost.join(", "),14,y+8,{size:13,color:P.red,align:"left"});
    });
  }
});

/* ---------- 2 · Courbe de chauffe ---------- */
var SUBS = {
  eau:{n:"Eau pure (glace à −20 °C)", pure:true, segs:function(m){ return [[m*2.1*20,-20,0,"solide"],[m*334,0,0,"fusion"],[m*4.18*100,0,100,"liquide"],[m*2260,100,100,"ébullition"],[m*2.0*40,100,140,"gaz"]]; }},
  eth:{n:"Éthanol pur (liquide à 20 °C)", pure:true, segs:function(m){ return [[m*2.44*58,20,78,"liquide"],[m*850,78,78,"ébullition"],[m*1.7*30,78,108,"gaz"]]; }},
  mel:{n:"Mélange eau + éthanol 50/50 (liquide à 20 °C)", pure:false, segs:function(m){ return [[m*3.3*59,20,79,"liquide"],[m*1550,79,97,"ébullition"]]; }},
  sal:{n:"Eau salée à 10 % (liquide à 20 °C)", pure:false, segs:function(m){ return [[m*3.8*81,20,101,"liquide"],[m*0.9*2260,101,108,"ébullition"]]; }}
};
SFA.sim({
  id:"c3-c01-courbe-chauffe", ch:"c01", tag:"Classique",
  titre:"Courbe de chauffe : palier ou pas palier ?",
  resume:"Chauffe un corps pur ou un mélange à puissance constante : seul le corps pur garde sa température pendant le changement d'état.",
  but:"Choisis une substance, une masse et une puissance de chauffe, puis déplace le curseur du temps. Repère les paliers de température.",
  aRetenir:"Un corps pur change d'état à température constante (palier) : cette température est une constante physique qui permet de l'identifier (eau : 0 °C et 100 °C ; éthanol : 78 °C à l'ébullition). Un mélange n'a pas de palier net : sa température continue de monter pendant le changement d'état.",
  piege:"Pendant un palier, on continue à fournir de l'énergie : elle sert à changer l'état (écarter les particules), pas à augmenter la température. Les valeurs d'énergie sont des données de référence arrondies ; l'allure des mélanges est simplifiée.",
  build:function(k,S){
    var c = k.canvas(330);
    var sb = k.select("Substance", Object.keys(SUBS).map(function(i){return [i,SUBS[i].n];}), "eau");
    var m = k.slider("Masse", 50, 200, 10, 100, "g");
    var p = k.slider("Puissance de chauffe", 100, 1000, 50, 500, "W");
    var tc = k.slider("Moment observé", 0, 100, 1, 40, "% de la courbe");
    var ro = k.readouts(["Temps","Température","État","Énergie reçue"]);
    var nt = k.note("","");
    function build(){
      var s = SUBS[sb.value], segs = s.segs(m.value), Q=0, arr=[];
      segs.forEach(function(g){ arr.push({q0:Q,q1:Q+g[0],T0:g[1],T1:g[2],ph:g[3]}); Q+=g[0]; });
      return {segs:arr, Qt:Q, pure:s.pure};
    }
    function TofQ(M,q){ for(var i=0;i<M.segs.length;i++){ var s=M.segs[i]; if(q<=s.q1+1e-9){ var f=s.q1>s.q0?(q-s.q0)/(s.q1-s.q0):1; return {T:s.T0+(s.T1-s.T0)*f, ph:s.ph, plateau:s.T0===s.T1}; } } var l=M.segs[M.segs.length-1]; return {T:l.T1,ph:l.ph,plateau:false}; }
    k.draw(function(){
      c.clear(); var M=build(), tEnd=M.Qt/p.value;
      var ax = D.axes(c,{x0:0,x1:tEnd*1.04,y0:-30,y1:150,xl:"t (s)",yl:"T (°C)",stepY:30});
      var pts=[],n=300; for(var i=0;i<=n;i++){ var q=M.Qt*i/n; pts.push([q/p.value, TofQ(M,q).T]); }
      var g=c.ctx; g.save(); g.strokeStyle=P.acc; g.lineWidth=2.6; g.beginPath(); pts.forEach(function(a,i){ if(i) g.lineTo(ax.X(a[0]),ax.Y(a[1])); else g.moveTo(ax.X(a[0]),ax.Y(a[1])); }); g.stroke(); g.restore();
      var q=M.Qt*tc.value/100, r=TofQ(M,q), t=q/p.value;
      D.line(c,ax.X(t),ax.Y(-30),ax.X(t),ax.Y(r.T),P.red,1.5,[5,4]); D.line(c,ax.L,ax.Y(r.T),ax.X(t),ax.Y(r.T),P.red,1.5,[5,4]); D.dot(c,ax.X(t),ax.Y(r.T),6,P.red);
      var ph = r.ph; if(!M.pure && /ébullition/.test(ph)) ph="ébullition (T qui monte)";
      if (M.pure && r.plateau && tc.value>0) ph = ph==="fusion"?"fusion (palier)":ph==="ébullition"?"ébullition (palier)":ph;
      ro.set(0,F(t,0)+" s"); ro.set(1,F(r.T,1)+" °C"); ro.set(2,ph); ro.set(3,F(q/1000,1)+" kJ");
      nt.set(M.pure ? "Corps pur : cherche les paliers horizontaux — leur température est une constante physique." : "Mélange : la température monte sans palier net pendant l'ébullition. Compare avec l'éthanol pur.", M.pure?"ok":"warn");
    });
  }
});

/* ---------- 3 · Chromatographie ---------- */
var RFD = {
  eau:{n:"Eau", rf:{jaune:0.80, rouge:0.55, bleu:0.25}},
  mix:{n:"Eau + éthanol (1 : 1)", rf:{jaune:0.90, rouge:0.70, bleu:0.45}},
  eth:{n:"Éthanol", rf:{jaune:0.95, rouge:0.85, bleu:0.65}}
};
var ENC = [
  {id:"vert", n:"Feutre vert", comp:["jaune","bleu"]},
  {id:"violet", n:"Feutre violet", comp:["rouge","bleu"]},
  {id:"noir", n:"Feutre noir", comp:["jaune","rouge","bleu"]},
  {id:"orange", n:"Feutre orange", comp:["jaune","rouge"]},
  {id:"inc", n:"Encre inconnue", comp:["jaune","rouge"]}
];
var CC = {jaune:"#e8c20a", rouge:"#d33a2c", bleu:"#2058d6"};
SFA.sim({
  id:"c3-c01-chromato", ch:"c01", tag:"Mesure",
  titre:"Chromatographie : fais monter le solvant et mesure Rf",
  resume:"Un solvant monte dans le papier et entraîne les colorants plus ou moins vite : mesure le rapport frontal.",
  but:"Fais monter le front du solvant. Mesure la distance parcourue par une tache et par le solvant, calcule Rf, puis identifie l'encre inconnue en la comparant aux autres.",
  aRetenir:"Rf = distance parcourue par la tache ÷ distance parcourue par le solvant (depuis la ligne de dépôt). Rf ne dépend pas de la hauteur atteinte par le front, mais du colorant, du solvant et du papier : c'est une carte d'identité.",
  piege:"Les distances se mesurent à partir de la ligne de dépôt, pas du bas du papier. Et deux taches de même couleur ne sont pas forcément le même colorant : compare les Rf avec le même solvant.",
  build:function(k,S){
    var c = k.canvas(340);
    var sv = k.select("Solvant", Object.keys(RFD).map(function(i){return [i,RFD[i].n];}), "eau");
    var fr = k.slider("Distance parcourue par le solvant", 0, 8, 0.5, 6, "cm");
    var en = k.select("Encre à mesurer", ENC.map(function(e){return [e.id,e.n];}), "noir");
    var col = k.select("Tache à mesurer", [["jaune","jaune"],["rouge","rouge"],["bleu","bleu"]], "rouge");
    var ro = k.readouts(["Distance du solvant","Distance de la tache","Rf"]);
    var rv = k.toggle("Révéler la composition de l'inconnue", false);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var W=c.W, H=c.H, g=c.ctx, rf=RFD[sv.value].rf;
      var top=26, bot=H-40, cm=(bot-top)/10, y0=bot-1.5*cm, left=44, sw=(W-left-10)/ENC.length;
      rr(c,left-4,top,W-left-6,bot-top,"#fbf7ec","#d8cfb8",1.5,4);
      // règle
      for(var i=0;i<=10;i++){ var yy=bot-i*cm; D.line(c,left-10,yy,left-4,yy,P.grey,1); if(i%2===0) T(c,String(i),left-18,yy,{size:12,color:P.grey}); }
      T(c,"cm",14,top-10,{size:12,color:P.grey});
      D.line(c,left-4,y0,W-6,y0,P.grey,1.2,[4,3]); T(c,"dépôt",left+14,y0+10,{size:12,color:P.grey});
      var yf=y0-fr.value*cm; D.line(c,left-4,yf,W-6,yf,P.acc,2); T(c,"front",W-24,yf-9,{size:12,color:P.acc});
      var cur=ENC.filter(function(e){return e.id===en.value;})[0];
      ENC.forEach(function(e,j){
        var cx=left+sw*(j+0.5);
        if (e.id==="inc"&&false) return;
        g.save(); g.fillStyle="#2f3b4d"; g.beginPath(); g.arc(cx,y0,3,0,6.3); g.fill(); g.restore();
        e.comp.forEach(function(cl){
          var d=rf[cl]*fr.value, y=y0-d*cm;
          g.save(); g.fillStyle=CC[cl]; g.globalAlpha=0.85; g.beginPath(); g.ellipse(cx,y,Math.min(15,sw*0.28),5+fr.value*0.4,0,0,6.3); g.fill(); g.restore();
        });
        T(c,e.id==="inc"?"?":e.n.replace("Feutre ",""),cx,bot+14,{size:12,color:e.id==="inc"?P.red:P.ink});
      });
      // repère de la tache mesurée
      var dm=rf[col.value]*fr.value, ym=y0-dm*cm;
      if (cur.comp.indexOf(col.value)>=0){ var j=ENC.indexOf(cur), cx=left+sw*(j+0.5);
        g.save(); g.strokeStyle=P.ink; g.lineWidth=1.5; g.setLineDash([3,3]); g.beginPath(); g.moveTo(left-4,ym); g.lineTo(cx-12,ym); g.stroke(); g.restore(); }
      T(c,"Solvant : "+RFD[sv.value].n,left+4,H-8,{size:12,color:P.grey,align:"left"});
      var has=cur.comp.indexOf(col.value)>=0;
      ro.set(0,F(fr.value,1)+" cm");
      ro.set(1,has?F(dm,2)+" cm":"pas de tache");
      ro.set(2,has&&fr.value>0?F(dm/fr.value,2):"—");
      if (!has) nt.set("Cette encre ne contient pas de colorant "+col.value+" : choisis une autre tache.","warn");
      else if (fr.value===0) nt.set("Le solvant n'a pas encore bougé : fais-le monter.","warn");
      else nt.set("Rf = "+F(dm,2)+" ÷ "+F(fr.value,1)+" = <b>"+F(dm/fr.value,2)+"</b>. Change la distance du solvant : Rf ne bouge pas. Change de solvant : il change.","ok");
      if (rv.value){ nt.set(nt.el.innerHTML+"<br><b>Composition de l'inconnue :</b> "+ENC[4].comp.join(" + ")+" → elle est identique au feutre orange.","ok"); }
    });
  }
});

/* ---------- 4 · Distillation fractionnée ---------- */
SFA.sim({
  id:"c3-c01-distillation", ch:"c01", tag:"Original",
  titre:"Distillation fractionnée eau – éthanol",
  resume:"Chauffe un mélange eau-éthanol et recueille cinq fractions : la première est la plus riche en éthanol.",
  but:"Choisis la teneur en éthanol du mélange puis lance le chauffage. Regarde la température en tête de colonne et la composition de chaque tube recueilli.",
  aRetenir:"Le liquide qui bout le plus facilement (éthanol, 78 °C) passe en premier, mais jamais de façon parfaitement pure : on recueille des fractions successives de plus en plus riches en eau. La température en tête monte pendant que le mélange s'appauvrit en éthanol.",
  piege:"Une distillation simple ne donne pas de l'éthanol pur : il reste de l'eau dans la première fraction (limite vers 96 % en réalité). Modèle simplifié : proportions en volume, valeurs qualitatives mais de bon ordre de grandeur.",
  build:function(k,S){
    var c = k.canvas(340);
    var ph0 = k.slider("Éthanol dans le mélange de départ", 10, 70, 5, 30, "%");
    var sp = k.slider("Vitesse de la simulation", 1, 4, 1, 2, "×");
    var ro = k.readouts(["Température en tête","Dans le ballon","Distillat recueilli","Éthanol du tube 1"]);
    var nt = k.note("Lance le chauffage, puis compare la couleur et le pourcentage des tubes.","");
    var V0=200, alpha=7, st;
    function yOf(x){ return Math.min(0.96, alpha*x/(1+(alpha-1)*x)); }
    function bp(x){ return 100-22*(1-Math.pow(1-x,3)); }
    function init(){ var e=V0*ph0.value/100; st={E:e, V:V0, col:0, tubes:[0,0,0,0,0], vol:[0,0,0,0,0], done:false, head:bp(ph0.value/100)}; }
    init();
    function step(dv){ var x=st.E/st.V, y=yOf(x); if(dv>st.V-5) dv=st.V-5; if(dv<=0){st.done=true;return;}
      var ti=Math.min(4,Math.floor(st.col/20)); st.tubes[ti]+=y*dv; st.vol[ti]+=dv; st.E-=y*dv; st.V-=dv; st.col+=dv; st.head=bp(x); }
    var lp = k.loop(function(dt){ if(st.done){ lp.pause(); return; }
      var tot=4*dt*sp.value, n=Math.ceil(tot/0.25); for(var i=0;i<n;i++){ step(tot/n); if(st.col>=100){ st.done=true; break; } }
      k.redraw(); if(st.done) lp.pause(); });
    k.button("Chauffer / pause", function(){ if(st.done) return; if(lp.running) lp.pause(); else lp.play(); }, true);
    k.button("Recommencer", function(){ lp.pause(); init(); });
    ph0.el.addEventListener("input", function(){ lp.pause(); init(); k.redraw(); });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx;
      var x=st.V>0?st.E/st.V:0;
      // ballon
      var bx=W*0.16, by=H*0.62, br=Math.min(48,W*0.12);
      g.save(); g.strokeStyle="#556"; g.lineWidth=2; g.beginPath(); g.arc(bx,by,br,0,6.3); g.stroke();
      g.beginPath(); g.moveTo(bx-br*0.3,by-br*0.95); g.lineTo(bx-br*0.3,by-br*1.9); g.lineTo(bx+br*0.3,by-br*1.9); g.lineTo(bx+br*0.3,by-br*0.95); g.stroke(); g.restore();
      var lvl=st.V/V0; g.save(); g.beginPath(); g.arc(bx,by,br-2,0,6.3); g.clip(); g.fillStyle="rgba(120,90,200,"+(0.15+0.5*x).toFixed(2)+")"; g.fillRect(bx-br,by+br-2*br*lvl*0.92,2*br,2*br); g.restore();
      T(c,"ballon",bx,by+br+14,{size:12,color:P.grey});
      // thermomètre
      var tx=bx+br*0.85, ty=by-br*1.9; D.line(c,bx+br*0.3,ty+6,tx+10,ty+6,"#556",2);
      T(c,F(st.head,1)+" °C",tx+14,ty-8,{size:14,color:P.red,align:"left"});
      // condenseur
      var cx0=bx+br*0.3, cy0=ty+6, cx1=W*0.56, cy1=H*0.42;
      D.line(c,cx0,cy0,cx1,cy1,"#556",3); D.line(c,cx1,cy1,cx1+10,cy1+30,"#556",3);
      T(c,"condenseur",(cx0+cx1)/2+10,(cy0+cy1)/2+18,{size:12,color:P.grey});
      // tubes
      var tw=Math.min(36,(W-cx1-30)/5-6), th=H*0.5, tx0=cx1-6+(W-cx1-6-(5*(tw+8)))/2+4;
      for(var i=0;i<5;i++){ var xx=tx0+i*(tw+8), yy=H*0.34, yb=yy+th; rr(c,xx,yy,tw,th,"#fff","#556",1.5,4);
        var v=st.vol[i], f=v/20; if(v>0){ var e=st.tubes[i]/v; var hh=th*Math.min(1,f); g.save(); g.fillStyle="rgba(120,90,200,"+(0.12+0.7*e).toFixed(2)+")"; g.fillRect(xx+1,yb-hh,tw-2,hh-1); g.restore();
          T(c,Math.round(e*100)+" %",xx+tw/2,yb+13,{size:12,color:P.violet}); } else T(c,"—",xx+tw/2,yb+13,{size:12,color:P.grey});
        T(c,String(i+1),xx+tw/2,yy-9,{size:12,color:P.grey}); }
      T(c,"fractions de 20 mL (violet = éthanol)",cx1+(W-cx1)/2-2,H-10,{size:12,color:P.grey});
      ro.set(0,F(st.head,1)+" °C"); ro.set(1,F(st.V,0)+" mL ("+F(x*100,0)+" % éth.)"); ro.set(2,F(st.col,0)+" mL");
      ro.set(3,st.vol[0]>0?F(st.tubes[0]/st.vol[0]*100,0)+" %":"—");
      if (st.done) nt.set("Terminé : le tube 1 contient "+F(st.tubes[0]/st.vol[0]*100,0)+" % d'éthanol, le tube 5 seulement "+F(st.tubes[4]/Math.max(st.vol[4],1e-9)*100,0)+" %. La température en tête est passée de plus bas à "+F(st.head,0)+" °C.","ok");
    });
  }
});
})();
