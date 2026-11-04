/* Chapitre 1 · Électrostatique */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function sgn(c,s,x,y,col){ T(c,s,x,y,{size:14,color:col||(s==="+"?P.red:P.acc),math:false}); }

/* 1 · Frottement */
var SERIE = ["Fourrure de lapin","Verre","Laine","Soie","Coton","Ballon de baudruche","Polystyrène","PVC (tuyau)","Téflon"];
var SOPT = SERIE.map(function(n,i){ return [i,n]; });
SFA.sim({
  id:"p3-c01-frottement", ch:"c01", tag:"Classique",
  titre:"Frotter deux matériaux : qui prend les électrons ?",
  resume:"Choisis deux matériaux et une durée de frottement : compte les électrons transférés et regarde les papiers.",
  but:"Frotte deux matériaux l'un contre l'autre. Observe le sens du transfert d'électrons, les charges obtenues et l'effet sur des bouts de papier.",
  aRetenir:"Le frottement ne crée aucune charge : il arrache des électrons à un matériau et les donne à l'autre. Le matériau qui gagne des électrons devient négatif, celui qui en perd devient positif, et la somme des charges reste nulle.",
  piege:"« Frotter crée de l'électricité » est faux : les charges existaient déjà dans les atomes. Le sens du transfert dépend des deux matériaux (série triboélectrique simplifiée ici).",
  build:function(k,S){
    var c = k.canvas(330);
    var A = k.select("Matériau A (frotte)", SOPT, 0);
    var B = k.select("Matériau B (frotté)", SOPT, 7);
    var t = k.slider("Durée du frottement", 0, 10, 0.5, 4, "s");
    var ro = k.readouts(["Électrons transférés","Charge de A","Charge de B","Total A + B"]);
    var nt = k.note("", "");
    var bits = [0.9,0.4,1,0.6,0.3,0.8,0.5,1,0.7];
    k.draw(function(){
      c.clear(); var W=c.W, H=c.H;
      var a=+A.value, b=+B.value, dlt=Math.abs(a-b);
      var frac = (dlt/8)*(1-Math.exp(-t.value/2.5));
      var N = frac*5e10;                                   /* électrons transférés (ordre de grandeur) */
      var q = N*1.602e-10;                                 /* nC */
      var neg = a===b ? 0 : (b>a ? 1 : -1);                /* +1 : B gagne des électrons */
      var qa = -neg*q, qb = neg*q;
      var n = Math.round(frac*12);
      var ya=70, bw=Math.min(150,W*0.3);
      var xa=W*0.2-bw/2, xb=W*0.8-bw/2;
      rect(c,xa,ya,bw,110,"#eef2f8",P.grey,1.5,10); rect(c,xb,ya,bw,110,"#f8efee",P.grey,1.5,10);
      T(c,SERIE[a],xa+bw/2,ya-18,{size:13}); T(c,SERIE[b],xb+bw/2,ya-18,{size:13});
      T(c,"A",xa+bw/2,ya+95,{size:13,color:P.grey}); T(c,"B",xb+bw/2,ya+95,{size:13,color:P.grey});
      for (var i=0;i<12;i++){ var px=(i%4)*(bw/4)+bw/8, py=(Math.floor(i/4))*28+28;     /* atomes neutres : + fixes */
        sgn(c,"+",xa+px,ya+py,"#e7b9b5"); sgn(c,"+",xb+px,ya+py,"#e7b9b5"); }
      for (i=0;i<12;i++){ /* électrons de base */
        T(c,"−",xa+(i%4)*(bw/4)+bw/8+10,ya+Math.floor(i/4)*28+38,{size:14,color:"#b9c6e4"}); T(c,"−",xb+(i%4)*(bw/4)+bw/8+10,ya+Math.floor(i/4)*28+38,{size:14,color:"#b9c6e4"}); }
      /* électrons en excès / manquants */
      var m = Math.min(n,6);
      if (neg){ var gx = neg>0 ? xb : xa, lx = neg>0 ? xa : xb;
        for (i=0;i<m;i++) T(c,"−",gx+10+i*(bw-20)/5,ya+103,{size:16,color:P.acc});
        for (i=0;i<m;i++) T(c,"+",lx+10+i*(bw-20)/5,ya+103,{size:16,color:P.red});
        D.arrow(c, lx+bw/2, ya+135, gx+bw/2, ya+135, P.amber, 2.5);
        T(c,"électrons",W/2,ya+150,{size:12,color:P.amber});
      }
      /* papiers sous B */
      var ground=H-26; rect(c,10,ground,W-20,3,"#cbd2dc");
      var lift = Math.min(1, q/4);
      for (i=0;i<9;i++){ var bx = xb+bw/2-60+i*15; var up = lift*bits[i]*(ground-ya-120)*(neg?1:0);
        rect(c,bx,ground-6-up,10,5,"#fff",P.grey,1); }
      T(c,"papiers sous B",xb+bw/2,ground+14,{size:12,color:P.grey});
      ro.set(0, N<1?"0":S.sci(N,2)); ro.set(1, F(qa,2)+" nC"); ro.set(2, F(qb,2)+" nC"); ro.set(3, "0 nC");
      if (a===b) nt.set("Même matériau : aucun transfert (ordre de grandeur uniquement, modèle simplifié).","warn");
      else nt.set("<b>"+SERIE[neg>0?b:a]+"</b> gagne des électrons et devient négatif ; <b>"+SERIE[neg>0?a:b]+"</b> en perd et devient positif. Plus les deux matériaux sont éloignés dans la série, plus le transfert est grand. Les valeurs sont des ordres de grandeur.","ok");
    });
  }
});

/* 2 · Deux boules suspendues */
SFA.sim({
  id:"p3-c01-deux-boules", ch:"c01", tag:"Interaction",
  titre:"Deux boules chargées suspendues",
  resume:"Règle le signe et la valeur des deux charges : les fils s'écartent, se rapprochent ou se touchent.",
  but:"Change la charge de chaque boule. Observe l'angle des fils. Que se passe-t-il quand elles se touchent ?",
  aRetenir:"Charges de même signe : répulsion. Charges de signes contraires : attraction. La force diminue vite quand la distance augmente. Après un contact, les charges se partagent.",
  piege:"La boule la plus chargée n'exerce pas une force plus grande que l'autre : les deux forces ont la même valeur (action-réaction), même si les charges sont différentes.",
  build:function(k,S){
    var c = k.canvas(340);
    var q1 = k.slider("Charge boule 1", -100, 100, 2.5, 60, "nC");
    var q2 = k.slider("Charge boule 2", -100, 100, 2.5, 60, "nC");
    var ro = k.readouts(["Angle d'un fil","Distance entre les boules","Force électrique"]);
    var nt = k.note("", "");
    k.button("Les boules se touchent : partager les charges", function(){ var m=(q1.value+q2.value)/2; q1.set(m); q2.set(m); });
    var KK=9e9, Mg=0.0005*9.81, L=0.30, s0=0.10, Dm=0.02;
    function solve(a,b){
      var qq = KK*Math.abs(a*b)*1e-18, rep = a*b>0, sg = rep?1:-1;
      if (a*b===0) return {th:0,d:s0,F:0};
      var prev = 0, th=0;
      for (th=0.0005; th<1.45; th+=0.0005){
        var d = s0 + sg*2*L*Math.sin(th);
        if (d<=Dm) return {contact:true,th:Math.asin((s0-Dm)/(2*L)),d:Dm,F:qq/(Dm*Dm)};
        if (Mg*Math.tan(th) - qq/(d*d) >= 0) return {th:th,d:d,F:qq/(d*d)};
      }
      var dd = s0 + sg*2*L*Math.sin(1.45); return {th:sg*1.45,d:dd,F:qq/(dd*dd),lim:true};
    }
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, a=q1.value, b=q2.value;
      var r=solve(a,b), rep=a*b>0, th=r.th, sg=a*b>=0?1:-1;
      var sc=Math.min((W-50)/(s0+2*L), (H-70)/(L+0.02)), cx=W/2, y0=26;
      var x1=cx-s0/2*sc, x2=cx+s0/2*sc;
      var off=L*Math.sin(Math.abs(th))*sc*(a*b===0?0:1), dy=L*Math.cos(th)*sc;
      var bx1, bx2;
      if (a*b===0 && (a!==0||b!==0)){ off=L*Math.sin(0.04)*sc; bx1=x1+off; bx2=x2-off; dy=L*sc; }
      else if (rep || a*b===0){ bx1=x1-off; bx2=x2+off; } else { bx1=x1+off; bx2=x2-off; }
      var by=y0+dy;
      rect(c,x1-25,y0-8,(x2-x1)+50,6,P.grey);
      D.line(c,x1,y0,bx1,by,P.grey,1.5); D.line(c,x2,y0,bx2,by,P.grey,1.5);
      function ball(x,q){ D.dot(c,x,by,13,q>0?"#f6c9c4":q<0?"#c6d4f2":"#e8ebf0"); c.ctx.strokeStyle=q>0?P.red:q<0?P.acc:P.grey; c.ctx.lineWidth=2; c.ctx.beginPath(); c.ctx.arc(x,by,13,0,6.3); c.ctx.stroke(); T(c,q>0?"+":q<0?"−":"0",x,by,{size:15,color:q>0?P.red:q<0?P.acc:P.grey}); }
      ball(bx1,a); ball(bx2,b);
      if (r.F>0){ var len=Math.min(60,12+r.F*3000), o=rep?1:-1;
        D.arrow(c,bx1,by+28,bx1-o*len,by+28,P.red,2.5); D.arrow(c,bx2,by+28,bx2+o*len,by+28,P.red,2.5); }
      T(c,"fils : 30 cm · boules de 0,5 g · points d'attache à 10 cm",W/2,H-10,{size:12,color:P.grey});
      ro.set(0, F(Math.abs(th)*180/Math.PI,1)+"°"); ro.set(1, F((bx2-bx1)/sc*100,1)+" cm"); ro.set(2, r.F>0? S.sci(r.F*1e3,2)+" mN":"0");
      if (a*b===0 && (a!==0||b!==0)){ ro.set(0,"≈ 2° (dessin schématique)"); ro.set(2,"très faible (non calculée)"); }
      if (a===0&&b===0) nt.set("Les deux boules sont neutres : aucune force.","");
      else if (a*b===0) nt.set("Une boule neutre est tout de même attirée par la boule chargée (polarisation, voir la simulation 4). Ici on la dessine à peine attirée sans calcul.","warn");
      else if (r.contact) nt.set("<b>Contact !</b> Les boules attirées se touchent : les charges se partagent (bouton ci-dessous). Chacune porte alors (q₁ + q₂)/2" + ((a+b)===0?" = 0 : elles se neutralisent.":", de même signe : elles se repoussent."),"warn");
      else if (r.lim) nt.set("Fils presque horizontaux : la répulsion est très forte.","warn");
      else nt.set(rep?"Même signe : <b>répulsion</b>. Les deux forces ont la même valeur, même si les charges sont différentes.":"Signes contraires : <b>attraction</b>.", rep?"ok":"ok");
    });
  }
});

/* 3 · Électroscope */
SFA.sim({
  id:"p3-c01-electroscope", ch:"c01", tag:"Mesure",
  titre:"L'électroscope à feuilles",
  resume:"Approche une tige chargée, touche le chapeau, relie à la terre : suis les charges et l'écartement.",
  but:"Approche la tige sans toucher, puis touche, puis relie à la terre. Observe les feuilles et les charges.",
  aRetenir:"Sans contact, la tige repousse ou attire les électrons mobiles du métal (influence) : l'électroscope reste neutre au total, mais ses feuilles s'écartent. Avec un contact, il reçoit de la charge du même signe que la tige. Relier à la terre permet de charger par influence avec le signe contraire.",
  piege:"Des feuilles écartées ne disent pas le signe de la charge ! Pour le connaître, il faut voir si l'écartement augmente ou diminue quand on approche un objet de signe connu. (Modèle simplifié : charges ramenées aux feuilles et au chapeau.)",
  build:function(k,S){
    var c = k.canvas(360);
    var qr = k.slider("Charge de la tige", -4, 4, 0.5, 3, "u");
    var dist = k.slider("Distance tige – chapeau", 0, 12, 0.5, 12, "cm");
    var terre = k.toggle("Relier l'électroscope à la terre (doigt)", false);
    var ro = k.readouts(["Charge totale électroscope","Charge des feuilles","Écartement"]);
    var nt = k.note("", "");
    var Q = 0;
    k.button("Toucher le chapeau avec la tige", function(){ var tr=qr.value/2; Q+=tr; qr.set(qr.value-tr); dist.set(12); });
    k.button("Tout remettre à zéro", function(){ Q=0; qr.set(3); dist.set(12); terre.set(false); });
    function ind(){ return 0.8*Math.abs(qr.value)/(1+Math.pow(dist.value/4,2)); }
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, s=Math.sign(qr.value);
      var ID=ind();
      if (terre.value) Q = -s*ID;
      var leaf = Q + s*ID, cap = -s*ID;
      var th = (leaf===0?0:75*(1-Math.exp(-Math.abs(leaf)/2.5)))*Math.PI/180;
      var cx=W*0.42, top=70, jarT=130, jarB=H-30;
      rect(c,cx-70,jarT,140,jarB-jarT,"rgba(220,232,245,.35)","#9bb0c9",2,12);
      D.line(c,cx,top+16,cx,jarT+60,P.ink,5);
      D.dot(c,cx,top+8,15,"#d9dee6"); c.ctx.strokeStyle=P.grey; c.ctx.lineWidth=2; c.ctx.beginPath(); c.ctx.arc(cx,top+8,15,0,6.3); c.ctx.stroke();
      var ly=jarT+60, ll=70;
      D.line(c,cx,ly,cx-ll*Math.sin(th),ly+ll*Math.cos(th),P.amber,5); D.line(c,cx,ly,cx+ll*Math.sin(th),ly+ll*Math.cos(th),P.amber,5);
      function signs(val,x,y,spread){ var n=Math.min(6,Math.round(Math.abs(val)*1.5)); for(var i=0;i<n;i++) T(c,val>0?"+":"−",x+(i-(n-1)/2)*spread,y,{size:15,color:val>0?P.red:P.acc}); }
      signs(cap, cx, top-14, 11);
      if (th>0.01){ signs(leaf/2, cx-ll*Math.sin(th)*0.55-14, ly+ll*Math.cos(th)*0.55, 0.01); signs(leaf/2, cx+ll*Math.sin(th)*0.55+14, ly+ll*Math.cos(th)*0.55, 0.01); }
      else if (Math.abs(leaf)>0.01) signs(leaf,cx,ly+30,12);
      /* tige */
      var rx = cx + 40 + dist.value/12*(W-cx-110), ry = top-30;
      if (qr.value!==0){
        rect(c,rx,ry-8,Math.min(110,W-rx-6),16,qr.value>0?"#f6c9c4":"#c6d4f2",qr.value>0?P.red:P.acc,2,8);
        T(c,qr.value>0?"+":"−",rx+14,ry,{size:16,color:qr.value>0?P.red:P.acc});
        T(c,"tige "+(qr.value>0?"+":"−"),rx+Math.min(110,W-rx-6)/2+8,ry-22,{size:12,color:P.grey});
      } else T(c,"tige neutre",rx+30,ry,{size:12,color:P.grey});
      if (terre.value){ D.line(c,cx,jarT+60,cx,jarB+8,P.green,2,[4,3]); T(c,"terre",cx+28,H-8,{size:12,color:P.green}); }
      ro.set(0, F(Q,2)+" u"); ro.set(1, F(leaf,2)+" u"); ro.set(2, F(th*180/Math.PI,0)+"° / feuille");
      var msg;
      if (qr.value===0 && Q===0) msg = "Rien n'est chargé : les feuilles pendent.";
      else if (Math.abs(leaf)<0.05) msg = terre.value ? "Les électrons ont fui vers la terre (ou en viennent) : feuilles retombées, mais l'électroscope va rester chargé du signe contraire à la tige quand on coupe la terre puis qu'on éloigne la tige." : "Feuilles fermées.";
      else if (Math.abs(Q)<0.05) msg = "Électroscope <b>neutre</b> au total mais feuilles écartées : les charges mobiles se sont déplacées (influence).";
      else msg = "Électroscope <b>chargé "+(Q>0?"positivement":"négativement")+"</b> : la charge est restée sur le métal.";
      nt.set(msg,"ok");
    });
  }
});

/* 4 · Polarisation */
SFA.sim({
  id:"p3-c01-polarisation", ch:"c01", tag:"Niche utile",
  titre:"Pourquoi un objet neutre est attiré",
  resume:"Un bâton chargé attire un petit objet neutre : regarde les charges se réorganiser à l'intérieur.",
  but:"Approche le bâton chargé d'une boule neutre. Change le signe du bâton et le matériau de la boule (isolant ou conducteur).",
  aRetenir:"Un objet neutre n'est pas « sans charges » : il contient autant de + que de −. Près d'un objet chargé, les charges se déplacent un peu : le côté proche prend le signe contraire du bâton, il est plus proche, donc plus attiré que le côté éloigné repoussé. Résultat : toujours une attraction, quel que soit le signe du bâton.",
  piege:"Si une boule est attirée, elle n'est pas forcément chargée : elle peut être neutre. Seule une répulsion prouve qu'elle est chargée.",
  build:function(k,S){
    var c = k.canvas(300);
    var sgnSel = k.seg("Signe du bâton", [["1","+"],["-1","−"]], "1");
    var mat = k.seg("Matériau de la boule", [["iso","Isolant"],["cond","Conducteur"]], "iso");
    var d = k.slider("Distance bâton – boule", 3, 20, 0.5, 4, "cm");
    var ro = k.readouts(["Force sur la boule"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, s=+sgnSel.value, cy=H/2-10, R=34;
      var bx = W-R-34, maxp = Math.max(40, bx-R-90-12-10);
      var dpx = 10 + (d.value-3)/17*maxp, rx = bx-R-dpx;
      var F0 = Math.pow(3/d.value,5), shift = Math.min(14, 14*Math.sqrt(F0)), bxx = bx - shift;
      rx = Math.min(rx, bxx-R-4);
      rect(c,rx-90,cy-14,90,28,s>0?"#f6c9c4":"#c6d4f2",s>0?P.red:P.acc,2,10);
      for (var i=0;i<3;i++) T(c,s>0?"+":"−",rx-76+i*30,cy,{size:17,color:s>0?P.red:P.acc});
      var sep = mat.value==="cond" ? 1 : 0.35;
      var dsep = sep*R*0.55*Math.min(1,0.25+F0*1.2);
      D.dot(c,bxx,cy,R,"#eef1f5"); c.ctx.strokeStyle=P.grey; c.ctx.lineWidth=2; c.ctx.beginPath(); c.ctx.arc(bxx,cy,R,0,6.3); c.ctx.stroke();
      var pn = [[-14,-18],[0,-22],[14,-18],[-18,0],[0,0],[18,0],[-14,18],[0,22],[14,18]];
      var mv = (s>0 ? -1 : 1) * dsep * 0.6;
      pn.forEach(function(p){ T(c,"+",bxx+p[0],cy+p[1],{size:14,color:P.red}); T(c,"−",bxx+p[0]+9+mv,cy+p[1]+7,{size:14,color:P.acc}); });
      D.arrow(c,bxx,cy+R+20,bxx-26-Math.min(26,F0*26),cy+R+20,P.green,3);
      T(c,"attraction",bxx-30,cy+R+40,{size:12,color:P.green});
      var lvl = F0>1?"forte":F0>0.15?"moyenne":F0>0.02?"faible":"négligeable";
      ro.set(0, lvl+" (attraction)");
      var m1 = s>0 ? "Bâton <b>+</b> : les électrons de la boule sont attirés vers le bâton ; le côté proche devient <b>−</b>, le côté éloigné <b>+</b>." : "Bâton <b>−</b> : les électrons de la boule sont repoussés ; le côté proche devient <b>+</b>. Attraction aussi !";
      var m2 = mat.value==="cond" ? " Dans un conducteur, les électrons se déplacent beaucoup : la séparation est grande." : " Dans un isolant, les électrons restent liés à leur atome : on a seulement de petites déformations.";
      nt.set(m1+m2+" (Échelle de la force : qualitative ; elle diminue très vite avec la distance.)","ok");
    });
  }
});
})();
