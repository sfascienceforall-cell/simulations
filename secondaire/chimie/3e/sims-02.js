/* Chapitre 2 · Du modèle particulaire aux modèles de l'atome */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} }
function rng(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

/* ---------- 1 · États de la matière ---------- */
var SUBS = {
  eau:{n:"Eau", tm:0, tb:100}, eth:{n:"Éthanol", tm:-114, tb:78}, n2:{n:"Diazote", tm:-210, tb:-196}, hg:{n:"Mercure", tm:-39, tb:357}
};
SFA.sim({
  id:"c3-c02-etats", ch:"c02", tag:"Classique",
  titre:"Solide, liquide, gaz : le modèle particulaire en mouvement",
  resume:"Fais varier la température et observe l'agitation, l'ordre et l'écart entre les particules.",
  but:"Choisis une substance et fais varier sa température. Observe comment les particules s'ordonnent, bougent et s'écartent aux trois états.",
  aRetenir:"Solide : particules serrées, rangées, qui vibrent sur place. Liquide : serrées mais désordonnées, elles glissent les unes sur les autres. Gaz : très écartées, libres et rapides. Quand la température monte, l'agitation augmente ; entre les particules, il n'y a que du vide.",
  piege:"Les particules ne grossissent pas quand on chauffe : c'est l'agitation qui augmente (et la distance moyenne dans un gaz). Les particules sont dessinées comme des disques pour simplifier ; une vraie particule n'est pas un point coloré.",
build:function(k,S){
    var c = k.canvas(330);
    var sb = k.select("Substance", Object.keys(SUBS).map(function(i){return [i,SUBS[i].n+" (fusion "+SUBS[i].tm+" °C, ébullition "+SUBS[i].tb+" °C)"];}), "eau");
    var tp = k.slider("Température", -250, 400, 1, 20, "°C");
    var ro = k.readouts(["État","Température absolue","Agitation relative","Entre les particules"]);
    var nt = k.note("","");
    var DEF=[["eau","l","Amène l'eau à l'état liquide."],["eth","g","Fais bouillir l'éthanol (état gazeux)."],["hg","l","Le mercure est-il liquide à 20 °C ? Mets-le à l'état liquide."],["n2","l","Liquéfie le diazote (entre −210 et −196 °C)."],["eau","s","Solidifie l'eau (glace)."],["hg","g","Vaporise le mercure : jusqu'où faut-il chauffer ?"]];
    var di=0, dn=k.note("<b>Défi :</b> "+DEF[0][2],"warn");
    k.button("Défi suivant", function(){ di=(di+1)%DEF.length; sb.set(DEF[di][0]); }, true);
    var N=48, ps=[], i, R=CH.rng(7), SP=18, RD=8;
    for(i=0;i<N;i++){ ps.push({x:0,y:0,vx:0,vy:0,ph:R()*6.28,gx:i%8,gy:Math.floor(i/8)}); }
    var topB=0, last="", TMIN=-250, TMAX=400, tpix=null;
    function getBox(){ var w=Math.max(170,Math.min(c.W-96,320)); return {x:12,y:30,w:w,h:c.H-48}; }
    function state(){ var s=SUBS[sb.value], t=tp.value; return t<s.tm?"s":(t<s.tb?"l":"g"); }
    function reinit(box,mode){ ps.forEach(function(p){ if(mode==="s"){ p.x=box.x+box.w/2+(p.gx-3.5)*SP; p.y=box.y+box.h-16-(5-p.gy)*SP; } else { p.x=box.x+12+R()*(box.w-24); p.y=box.y+box.h*0.5+R()*box.h*0.45; } var a=R()*6.28; p.vx=Math.cos(a); p.vy=Math.sin(a); }); }
    var lp = k.loop(function(dt,tt){
      var box=getBox(), s=state(), Tk=tp.value+273.15;
      if(s!==last){ if(last===""||last==="s"||s==="s") reinit(box,s); last=s; }
      var sp=5.5*Math.sqrt(Math.max(Tk,5))*(s==="g"?1:0.32);
      var targetTop=s==="g"?box.y:box.y+box.h-SP*6.2; topB+=(targetTop-topB)*Math.min(1,dt*4);
      ps.forEach(function(p){
        if(s==="s"){ var Tm=SUBS[sb.value].tm+273.15, A=0.6+3.2*Math.min(1,Tk/Tm); var hx=box.x+box.w/2+(p.gx-3.5)*SP, hy=box.y+box.h-16-(5-p.gy)*SP; p.x+=((hx+A*Math.sin(tt*9+p.ph))-p.x)*Math.min(1,dt*10); p.y+=((hy+A*Math.cos(tt*8+p.ph*1.3))-p.y)*Math.min(1,dt*10); }
        else { p.vx+=(R()-0.5)*dt*8; p.vy+=(R()-0.5)*dt*8; var m=Math.hypot(p.vx,p.vy)||1; p.vx/=m; p.vy/=m; p.x+=p.vx*sp*dt; p.y+=p.vy*sp*dt;
          var top=topB+RD; if(p.x<box.x+RD){p.x=box.x+RD;p.vx=Math.abs(p.vx);} if(p.x>box.x+box.w-RD){p.x=box.x+box.w-RD;p.vx=-Math.abs(p.vx);} if(p.y<top){p.y=top;p.vy=Math.abs(p.vy);} if(p.y>box.y+box.h-RD){p.y=box.y+box.h-RD;p.vy=-Math.abs(p.vy);} } });
      if(s==="l"){ for(var a=0;a<N;a++)for(var b=a+1;b<N;b++){ var dx=ps[b].x-ps[a].x, dy=ps[b].y-ps[a].y, d=Math.hypot(dx,dy), md=RD*2; if(d<md&&d>0.01){ var f=(md-d)/2/d; ps[a].x-=dx*f; ps[a].y-=dy*f; ps[b].x+=dx*f; ps[b].y+=dy*f; } } }
      k.redraw();
    });
    function Ty(box,t){ return box.y+box.h-(t-TMIN)/(TMAX-TMIN)*box.h; }
    c.pointer(function(type,pt){ if(type==="up"||type==="move"||!tpix) return; if(pt.x>tpix-26){ var box=getBox(); tp.set(Math.round(TMIN+(box.y+box.h-pt.y)/box.h*(TMAX-TMIN))); k.redraw(); } });
    k.draw(function(){
      c.clear(); CH.bg(c); var W=c.W, box=getBox(), s=state(), sub=SUBS[sb.value], t=tp.value, g=c.ctx;
      var col=s==="s"?P.acc:(s==="l"?P.teal:P.red), name=s==="s"?"solide":(s==="l"?"liquide":"gaz");
      CH.title(c,sub.n+" · "+name,col);
      CH.rr(c,box.x,box.y,box.w,box.h,"#fbfcfe","#8996a8",2.4,10);
      if(s==="l"){ g.save(); g.beginPath(); g.rect(box.x+1.2,topB,box.w-2.4,box.y+box.h-topB-1.2); g.fillStyle=D.tint(col,.12); g.fill(); g.restore(); }
      if(s==="s"){ g.save(); CH.rr(c,box.x+box.w/2-4*SP-4,box.y+box.h-16-5*SP-RD-3,8*SP+8,6*SP+6,D.tint(col,.1),null,0,6); g.restore(); }
      ps.forEach(function(p){ CH.ball(c,p.x||box.x+30,p.y||box.y+30,RD,col,"",{lw:1}); });
      if(s==="g"){ var spd=Math.min(14,Math.sqrt(t+273.15)*0.55); for(var q=0;q<8;q++){ var p=ps[q*5]; D.arrow(c,p.x,p.y,p.x+p.vx*spd,p.y+p.vy*spd,"rgba(15,27,45,.5)",1.3); } }
      // thermomètre : zones d'état, curseur déplaçable
      var tx=box.x+box.w+44; tpix=tx; var tw=16, y0=Ty(box,TMAX), y1=Ty(box,TMIN), ym=Ty(box,Math.max(TMIN,Math.min(TMAX,sub.tm))), yb=Ty(box,Math.max(TMIN,Math.min(TMAX,sub.tb)));
      CH.rr(c,tx-tw/2,y0,tw,y1-y0,"#eef2f7","#8996a8",1.6,8);
      g.save(); g.beginPath(); g.rect(tx-tw/2+2,y0+1,tw-4,y1-y0-2); g.clip();
      g.fillStyle=D.tint(P.red,.25); g.fillRect(tx-tw/2,y0,tw,yb-y0); g.fillStyle=D.tint(P.teal,.28); g.fillRect(tx-tw/2,yb,tw,ym-yb); g.fillStyle=D.tint(P.acc,.28); g.fillRect(tx-tw/2,ym,tw,y1-ym);
      g.fillStyle=P.red; g.fillRect(tx-2.5,Ty(box,t),5,y1-Ty(box,t)); g.restore();
      CH.circ(c,tx,Ty(box,t),8,"#fff",col,3);
      [[sub.tm,"fusion"],[sub.tb,"ébullition"]].forEach(function(m){ if(m[0]>=TMIN&&m[0]<=TMAX){ var yy=Ty(box,m[0]); D.line(c,tx-tw/2-6,yy,tx+tw/2+6,yy,P.ink,1.4); D.text(c,m[1]+" "+m[0]+" °C",tx-tw/2-9,yy+(m[1]==="fusion"?9:-9),{size:10.5,color:"#4b586a",align:"right",weight:700}); } });
      D.text(c,F(t,0)+" °C",tx,y0-10,{size:12.5,color:col});
      D.text(c,"glisse",tx,y1+9,{size:10.5,color:P.grey});
      var edge=(Math.abs(t-sub.tm)<0.5)?" (fusion)":(Math.abs(t-sub.tb)<0.5?" (ébullition)":"");
      ro.set(0,name+edge); ro.set(1,F(t+273.15,0)+" K"); ro.set(2,F(Math.sqrt((t+273.15)/293.15)*100,0)+" %"); ro.set(3,"du vide");
      nt.set(s==="s"?"Solide : chaque particule vibre autour d'une position fixe ; plus T monte, plus la vibration est ample.":s==="l"?"Liquide : particules au contact mais désordonnées, qui glissent : le liquide prend la forme du récipient.":"Gaz : particules très éloignées, rapides (flèches = vitesse), qui occupent tout le volume disponible.", "ok");
      var ok=DEF[di][0]===sb.value&&s===DEF[di][1]; dn.set("<b>Défi :</b> "+DEF[di][2]+(ok?" ✓ Réussi !":""), ok?"ok":"warn");
    });
    lp.play();
  }
});

/* ---------- 2 · Expérience de Rutherford ---------- */
var CIBLES = {al:{n:"Aluminium (Z = 13)", z:13}, cu:{n:"Cuivre (Z = 29)", z:29}, ag:{n:"Argent (Z = 47)", z:47}, au:{n:"Or (Z = 79)", z:79}};
SFA.sim({
  id:"c3-c02-rutherford", ch:"c02", tag:"Expérience",
  titre:"L'expérience de Rutherford : tirer sur une feuille d'or",
  resume:"Envoie des particules α sur un atome : avec un noyau minuscule, quelques-unes sont fortement déviées.",
  but:"Compare le modèle de Thomson (charge répartie) et celui de Rutherford (noyau). Tire des particules α sur la cible et compte celles qui sont déviées.",
  aRetenir:"Presque toutes les particules α traversent la feuille sans être déviées : l'atome est surtout du vide. Quelques-unes sont fortement déviées, certaines rebroussent chemin : il existe un noyau minuscule, très dense, chargé positivement. Plus Z est grand, plus les déviations sont fréquentes.",
  piege:"Le noyau est dessiné beaucoup trop gros pour qu'on le voie, et les proportions de particules déviées sont volontairement exagérées (dans l'expérience réelle, environ 1 sur 8 000 rebondit). Les trajectoires sont des hyperboles ; on les a simplifiées en deux segments.",
build:function(k,S){
    var c = k.canvas(350);
    var md = k.seg("Modèle de l'atome", [["th","Thomson"],["ru","Rutherford"]], "ru");
    var cb = k.select("Cible", Object.keys(CIBLES).map(function(i){return [i,CIBLES[i].n];}), "au");
    var ro = k.readouts(["Particules tirées","Quasi tout droit (< 5°)","Déviées (5° à 90°)","Rebroussent chemin (> 90°)"]);
    var nt = k.note("<b>Vise</b> : touche ou glisse dans la scène pour orienter le canon et tirer une particule α. Plus tu vises près du noyau, plus elle est déviée.","");
    var R=CH.rng(11), tally, flies, flashes, aim=0.55, Bm=150;
    function reset(){ tally={n:0,s:0,m:0,b:0}; flies=[]; flashes=[]; }
    reset();
    function geom(){ var W=c.W,H=c.H; return {xn:W*0.46, yc:H*0.52, rs:Math.min(H*0.42,W*0.4), ym:Math.min(H*0.36,130)}; }
    function shot(b, u, anim){
      var th=md.value==="th", z=CIBLES[cb.value].z, ang;
      if(th) ang=(R()-0.5)*0.02; else { var a=0.025*z; ang=2*Math.atan(a/Math.max(Math.abs(b),1e-6)); if(b<0) ang=-ang; }
      var deg=Math.abs(ang)*180/Math.PI; tally.n++; if(deg<5) tally.s++; else if(deg<=90) tally.m++; else tally.b++;
      var gm=geom(), sgn=b>=0?1:-1, y0=gm.yc+sgn*Math.abs(u)*gm.ym, aa=Math.abs(ang), dir=[Math.cos(aa),sgn*Math.sin(aa)];
      var pts=[[24,y0]], s0=30, i, A=[gm.xn-s0,y0], C=[gm.xn,y0], E=[C[0]+dir[0]*s0,C[1]+dir[1]*s0];
      if(th) { pts.push([gm.xn+gm.rs*Math.cos(0),y0+0]); }
      else { for(i=0;i<=10;i++){ var q=i/10; pts.push([(1-q)*(1-q)*A[0]+2*q*(1-q)*C[0]+q*q*E[0],(1-q)*(1-q)*A[1]+2*q*(1-q)*C[1]+q*q*E[1]]); }
        var dx=dir[0], dy=dir[1], px=C[0]-gm.xn, py=C[1]-gm.yc, bq=px*dx+py*dy, cq=px*px+py*py-gm.rs*gm.rs, t2=-bq+Math.sqrt(Math.max(0,bq*bq-cq)); pts.push([C[0]+dx*t2,C[1]+dy*t2]); }
      var end=pts[pts.length-1], ex=th?gm.xn+Math.sqrt(Math.max(0,gm.rs*gm.rs-(y0-gm.yc)*(y0-gm.yc))):end[0]; if(th) end=[ex,y0];
      pts[pts.length-1]=end; var fl={x:end[0],y:end[1],deg:deg};
      if(anim) flies.push({pts:pts,d:0,fl:fl,deg:deg}); else flashes.push({x:fl.x,y:fl.y,a:1,deg:deg});
      if(flashes.length>500) flashes.shift();
    }
    function randShot(){ var u=(R()*2-1), b=u*u*Bm*(u<0?-1:1)*(u<0?1:1); b=Math.abs(u)*Math.abs(u)*Bm*(u<0?-1:1); shot(b,u,false); }
    function fire(n){ for(var i=0;i<n;i++) randShot(); }
    k.button("Tirer 1 (visé)", function(){ var u=aim*2-1; shot(Math.abs(u)*Math.abs(u)*Bm*(u<0?-1:1),u,true); });
    k.button("Tirer 20", function(){ for(var i=0;i<20;i++) setTimeout(randShotAnim,i*45); }, true);
    k.button("Tirer 500", function(){ fire(500); });
    k.button("Effacer", function(){ reset(); });
    function randShotAnim(){ var u=(R()*2-1); shot(Math.abs(u)*Math.abs(u)*Bm*(u<0?-1:1),u,true); k.redraw(); }
    c.pointer(function(type,pt){ if(type==="move"||type==="up") return; var gm=geom(); var u=Math.max(-1,Math.min(1,(pt.y-gm.yc)/gm.ym)); aim=(u+1)/2; if(type==="down"){ shot(Math.abs(u)*Math.abs(u)*Bm*(u<0?-1:1),u,true); } k.redraw(); });
    var lp = k.loop(function(dt){ var any=false; flies.forEach(function(f){ f.d+=dt*520; any=true; });
      flies=flies.filter(function(f){ var L=0,i; for(i=1;i<f.pts.length;i++) L+=Math.hypot(f.pts[i][0]-f.pts[i-1][0],f.pts[i][1]-f.pts[i-1][1]); if(f.d>=L){ flashes.push({x:f.fl.x,y:f.fl.y,a:1,deg:f.deg}); return false; } return true; });
      flashes.forEach(function(f){ if(f.a>0.35) f.a-=dt*0.9; }); if(any||flashes.some(function(f){return f.a>0.36;})) k.redraw(); });
    lp.play();
    function at(f){ var d=f.d,i,p=f.pts; for(i=1;i<p.length;i++){ var l=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]); if(d<=l){ var q=l?d/l:0; return [p[i-1][0]+(p[i][0]-p[i-1][0])*q,p[i-1][1]+(p[i][1]-p[i-1][1])*q,i]; } d-=l; } return [p[p.length-1][0],p[p.length-1][1],p.length-1]; }
    k.draw(function(){
      c.clear(); CH.bg(c); var W=c.W,H=c.H,g=c.ctx, gm=geom(), xn=gm.xn, yc=gm.yc;
      CH.title(c,md.value==="th"?"Modèle de Thomson : charge + répartie":"Modèle de Rutherford : noyau minuscule",md.value==="th"?P.amber:P.red);
      // écran circulaire
      g.save(); g.beginPath(); g.arc(xn,yc,gm.rs,0,6.2832); g.strokeStyle="rgba(46,160,120,.35)"; g.lineWidth=7; g.stroke(); g.restore();
      D.text(c,"écran fluorescent (ZnS)",xn,yc-gm.rs-10,{size:11,color:"#4b586a"});
      // atome
      var ra=Math.min(gm.ym*0.95,70);
      if(md.value==="th"){ CH.circ(c,xn,yc,ra,"rgba(214,87,70,.22)","#c77",1.5); for(var i=0;i<12;i++){ var a=i*2.4, r=ra*.78*Math.sqrt((i+.5)/12); D.text(c,"−",xn+r*Math.cos(a),yc+r*Math.sin(a),{size:17,color:P.acc}); } }
      else { g.save(); g.setLineDash([4,4]); CH.circ(c,xn,yc,ra,null,"#aab4c4",1.4); g.restore(); D.glow(c,xn,yc,26,P.red,.5); CH.ball(c,xn,yc,6,P.red,""); D.text(c,"noyau (+)",xn+10,yc+ra*.45+8,{size:11,color:P.red,align:"left"}); }
      // faisceau visé
      var yaim=yc+(aim*2-1)*gm.ym; D.line(c,40,yaim,xn-ra,yaim,"rgba(31,75,158,.25)",1.2,[3,5]);
      CH.rr(c,6,yaim-9,36,18,"#5b6677",null,0,5); CH.rr(c,38,yaim-4,10,8,"#3c4656",null,0,2); D.text(c,"α",24,yaim+1,{size:12,color:"#fff"});
      flashes.forEach(function(f){ var col=f.deg<5?"46,107,85":f.deg<=90?"180,83,9":"180,35,24"; g.fillStyle="rgba("+col+","+f.a.toFixed(2)+")"; g.beginPath(); g.arc(f.x,f.y,f.a>.9?4:2.4,0,6.3); g.fill(); });
      flies.forEach(function(f){ var p=at(f), col=f.deg<5?"#2e6b55":f.deg<=90?"#b45309":"#b42318"; g.strokeStyle=col; g.lineWidth=1.6; g.globalAlpha=.6; g.beginPath(); g.moveTo(f.pts[0][0],f.pts[0][1]); for(var i=1;i<p[2];i++) g.lineTo(f.pts[i][0],f.pts[i][1]); g.lineTo(p[0],p[1]); g.stroke(); g.globalAlpha=1; CH.circ(c,p[0],p[1],3.8,col,"#fff",1); });
      D.label(c,"vert : < 5°   orange : 5–90°   rouge : > 90°",W-8,H-14,{align:"right",size:10.5,color:"#4b586a"});
      ro.set(0,String(tally.n)); var n=Math.max(1,tally.n);
      ro.set(1,tally.s+" ("+F(100*tally.s/n,0)+" %)"); ro.set(2,tally.m+" ("+F(100*tally.m/n,0)+" %)"); ro.set(3,tally.b+" ("+F(100*tally.b/n,1)+" %)");
    });
  }
});

/* ---------- 3 · Constructeur d'atomes ---------- */
var EL = [null,["H","hydrogène"],["He","hélium"],["Li","lithium"],["Be","béryllium"],["B","bore"],["C","carbone"],["N","azote"],["O","oxygène"],["F","fluor"],["Ne","néon"],["Na","sodium"],["Mg","magnésium"],["Al","aluminium"],["Si","silicium"],["P","phosphore"],["S","soufre"],["Cl","chlore"],["Ar","argon"],["K","potassium"],["Ca","calcium"]];
var STAB = [null,[1,2],[3,4],[6,7],[9],[10,11],[12,13],[14,15],[16,17,18],[19],[20,21,22],[23],[24,25,26],[27],[28,29,30],[31],[32,33,34,36],[35,37],[36,38,40],[39,41],[40,42,43,44,46]];
var DEFIS = [
  {t:"Construis l'ion sodium Na⁺.", f:function(p,n,e){ return p===11&&e===10; }},
  {t:"Construis l'ion chlorure Cl⁻.", f:function(p,n,e){ return p===17&&e===18; }},
  {t:"Construis l'atome neutre de carbone 14 (radioactif, utilisé pour la datation).", f:function(p,n,e){ return p===6&&n===8&&e===6; }},
  {t:"Construis l'ion aluminium Al³⁺.", f:function(p,n,e){ return p===13&&e===10; }},
  {t:"Construis l'ion oxyde O²⁻.", f:function(p,n,e){ return p===8&&e===10; }},
  {t:"Construis l'atome neutre de lithium 7.", f:function(p,n,e){ return p===3&&n===4&&e===3; }},
  {t:"Construis l'atome neutre de néon 20.", f:function(p,n,e){ return p===10&&n===10&&e===10; }}
];
SFA.sim({
  id:"c3-c02-atome", ch:"c02", tag:"Classique",
  titre:"Constructeur d'atomes et d'ions",
  resume:"Ajoute des protons, des neutrons et des électrons : l'élément, la charge et la stabilité se mettent à jour.",
  but:"Règle le nombre de protons, de neutrons et d'électrons. Regarde quel élément tu obtiens, sa charge, et réalise les défis.",
  aRetenir:"Le nombre de protons Z définit l'élément. Le nombre de masse est A = Z + N. Un atome est neutre quand e⁻ = Z. Si e⁻ ≠ Z, on a un ion : changer le nombre d'électrons ne change jamais l'élément.",
  piege:"Pour fabriquer un ion, on ajoute ou on retire des électrons, jamais des protons (ce serait un autre élément). Le « noyau stable connu » concerne les isotopes naturels des 20 premiers éléments.",
  build:function(k,S){
    var c = k.canvas(340);
    var p = k.slider("Protons (Z)", 1, 20, 1, 6, "");
    var n = k.slider("Neutrons (N)", 0, 24, 1, 6, "");
    var e = k.slider("Électrons", 0, 20, 1, 6, "");
    var ro = k.readouts(["Élément","Noyau","Particule","Charge","Nombre de masse A"]);
    var nt = k.note("","");
    var di = 0, dn = k.note("<b>Défi :</b> "+DEFIS[0].t,"warn");
    k.button("Défi suivant", function(){ di=(di+1)%DEFIS.length; }, true);
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, cx=W/2, cy=H/2, R=Math.min(W,H)/2-8, Z=p.value, N=n.value, E=e.value;
      var shells=[2,8,8,2], rem=E, ring=[];
      shells.forEach(function(cap){ var m=Math.min(cap,rem); ring.push(m); rem-=m; });
      [0.28,0.5,0.72,0.93].forEach(function(f,i){ if(ring[i]>0||i===0) { c.ctx.save(); c.ctx.strokeStyle="#cfd6e0"; c.ctx.setLineDash([3,4]); c.ctx.beginPath(); c.ctx.arc(cx,cy,R*f,0,6.28); c.ctx.stroke(); c.ctx.restore(); } });
      var tot=Z+N, ra=Math.max(2.6,Math.min(5,26/Math.sqrt(Math.max(tot,1))*1.05));
      for(var i=0;i<tot;i++){ var r=ra*1.75*Math.sqrt(i+0.5), a=i*2.39996; circ(c,cx+r*Math.cos(a),cy+r*Math.sin(a),ra,i<Z?P.red:"#8e98a6","#fff",0.8); }
      ring.forEach(function(m,j){ for(var q=0;q<m;q++){ var a=-1.57+q*6.2832/m+j*0.4; circ(c,cx+R*[0.28,0.5,0.72,0.93][j]*Math.cos(a),cy+R*[0.28,0.5,0.72,0.93][j]*Math.sin(a),5,P.acc,"#fff",1); } });
      var el=EL[Z], A=Z+N, q=Z-E;
      var stable=STAB[Z].indexOf(A)>=0;
      var qs = q===0?"":("<sup>"+(Math.abs(q)===1?"":Math.abs(q))+(q>0?"+":"−")+"</sup>");
      ro.set(0,el[1]+" ("+el[0]+")"); ro.set(1,"<sup>"+A+"</sup><sub>"+Z+"</sub>"+el[0]); ro.set(2,el[0]+qs+(q===0?" (atome)":q>0?" (cation)":" (anion)"));
      ro.set(3,q===0?"0 (neutre)":(q>0?"+"+q:"−"+Math.abs(q))); ro.set(4,String(A));
      var outer = ring[3]>0?ring[3]:(ring[2]>0?ring[2]:(ring[1]>0?ring[1]:ring[0]));
      nt.set((stable?"Ce noyau existe naturellement et est <b>stable</b>. ":"Ce noyau est <b>instable (radioactif)</b> ou n'existe pas dans la nature. ")+"Couche externe : "+outer+" électron"+(outer>1?"s":"")+". "+(q!==0?"Ce n'est pas un atome neutre : c'est un ion (les protons n'ont pas bougé).":"Atome neutre : autant de charges + que de charges −."), stable?"ok":"warn");
      var ok=DEFIS[di].f(Z,N,E);
      dn.set("<b>Défi :</b> "+DEFIS[di].t+(ok?" ✓ Réussi ! Passe au défi suivant.":""), ok?"ok":"warn");
    });
  }
});

/* ---------- 4 · Évolution des modèles ---------- */
var MOD = {
  dalton:{y:"1803", n:"Dalton", e:"Lois de conservation de la masse et des proportions en chimie.", ok:"Explique pourquoi les masses se conservent : les atomes sont indestructibles et se réarrangent.", lim:"Ne dit rien des charges électriques : il n'explique pas l'électricité statique ni les éclairs."},
  thomson:{y:"1897-1904", n:"Thomson", e:"Rayons cathodiques : découverte de l'électron, particule négative très légère.", ok:"Explique que la matière contient des électrons et que l'atome est neutre.", lim:"Prévoit que les particules α traversent l'atome en étant à peine déviées : faux pour quelques-unes."},
  ruth:{y:"1911", n:"Rutherford", e:"Feuille d'or bombardée de particules α : quelques-unes rebondissent.", ok:"Explique les fortes déviations : noyau minuscule, dense, positif ; atome surtout vide.", lim:"Ne dit pas pourquoi les électrons ne tombent pas sur le noyau ni pourquoi les atomes émettent des couleurs précises."},
  bohr:{y:"1913", n:"Bohr", e:"Spectres de raies : un atome n'émet que certaines couleurs.", ok:"Explique les couches (niveaux d'énergie) et les couleurs émises.", lim:"Ne marche bien que pour l'hydrogène : l'électron n'a pas de trajectoire circulaire précise."},
  nuage:{y:"1926 →", n:"Modèle du nuage électronique", e:"Mécanique quantique : on ne peut que calculer la probabilité de trouver l'électron.", ok:"Modèle actuel : noyau + nuage de probabilité ; électrons répartis en couches.", lim:"Plus abstrait : c'est un modèle mathématique, lui-même susceptible d'évoluer."}
};
SFA.sim({
  id:"c3-c02-modeles", ch:"c02", tag:"Histoire",
  titre:"Cinq modèles de l'atome, cinq expériences",
  resume:"Parcours Dalton, Thomson, Rutherford, Bohr et le nuage électronique, avec l'expérience qui motive chaque modèle.",
  but:"Choisis un modèle, change le nombre d'électrons et lis quelle observation il explique… et laquelle il ne sait pas expliquer.",
  aRetenir:"Un modèle n'est pas une photo de la réalité : c'est une représentation qui explique des observations. Quand une expérience le contredit (Rutherford contre Thomson), on le remplace. Le noyau est environ 100 000 fois plus petit que l'atome : si l'atome mesurait 100 m, le noyau ferait 1 mm.",
  piege:"Les modèles anciens ne sont pas « faux et inutiles » : celui de Dalton suffit pour comprendre la conservation de la masse. Chaque modèle est valable dans son domaine. Les échelles ne sont pas respectées dans les dessins.",
  build:function(k,S){
    var c = k.canvas(320);
    var md = k.seg("Modèle", [["dalton","Dalton"],["thomson","Thomson"],["ruth","Rutherford"],["bohr","Bohr"],["nuage","Nuage"]], "ruth");
    var ne = k.slider("Électrons", 1, 11, 1, 3, "");
    var nt = k.note("","");
    var R=rng(3), pts=[];
    for(var i=0;i<400;i++){ var u=R(), a=R()*6.28; pts.push([u,a]); }
    var lp = k.loop(function(){ k.redraw(); });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx,cx=W/2,cy=H/2-6,Ra=Math.min(W,H)*0.36, t=Date.now()/1000, E=ne.value, m=md.value;
      if(m==="dalton"){ circ(c,cx,cy,Ra*0.8,"#9aa6b6","#6b7686",2); T(c,"sphère pleine, indivisible",cx,cy,{size:13,color:"#fff"}); }
      else if(m==="thomson"){ circ(c,cx,cy,Ra,"rgba(214,87,70,0.22)","#c77",1.5); for(var i=0;i<E;i++){ var a=i*2.4, r=Ra*0.75*Math.sqrt((i+0.5)/E); T(c,"−",cx+r*Math.cos(a),cy+r*Math.sin(a),{size:20,color:P.acc}); } T(c,"charge + répartie",cx,cy+Ra+16,{size:12,color:P.grey}); }
      else if(m==="ruth"){ circ(c,cx,cy,5,P.red); for(var j=0;j<E;j++){ var rj=Ra*(0.45+0.5*((j*7)%E)/E), aj=t*(1.5/ (0.5+rj/Ra))+j*2.1; g.save(); g.strokeStyle="#e1e6ee"; g.beginPath(); g.arc(cx,cy,rj,0,6.28); g.stroke(); g.restore(); circ(c,cx+rj*Math.cos(aj),cy+rj*Math.sin(aj),4.5,P.acc); } T(c,"noyau minuscule, beaucoup de vide",cx,cy+Ra+16,{size:12,color:P.grey}); }
      else if(m==="bohr"){ var sh=[2,8,8,8], rem=E; circ(c,cx,cy,7,P.red); sh.forEach(function(cap,jj){ var q=Math.min(cap,rem); rem-=q; var rj=Ra*(0.3+0.23*jj); if(q>0||jj===0){ g.save(); g.strokeStyle="#cdd5e2"; g.beginPath(); g.arc(cx,cy,rj,0,6.28); g.stroke(); g.restore(); } for(var u=0;u<q;u++){ var aj=t*(0.9-0.15*jj)+u*6.2832/q; circ(c,cx+rj*Math.cos(aj),cy+rj*Math.sin(aj),4.5,P.acc); } }); T(c,"niveaux d'énergie (couches)",cx,cy+Ra+16,{size:12,color:P.grey}); }
      else { var sh2=[2,8,8], rem2=E, cum=[]; sh2.forEach(function(cap,jj){ var q=Math.min(cap,rem2); rem2-=q; cum.push(q); });
        pts.forEach(function(pt,ii){ var which=ii%Math.max(1,E); var shell=which<cum[0]?0:(which<cum[0]+cum[1]?1:2); var mu=Ra*(0.3+0.25*shell), r=Math.abs(mu+ (pt[0]-0.5)*Ra*0.28*(1+shell*0.3)); var a=pt[1]+t*0.3*(ii%3-1)*0.2; if(ii<60*E/ (E+0.001)+40){ g.fillStyle="rgba(30,63,143,0.35)"; g.fillRect(cx+r*Math.cos(a)-1.2,cy+r*Math.sin(a)-1.2,2.4,2.4); } });
        circ(c,cx,cy,4,P.red); T(c,"nuage de probabilité (pas de trajectoire)",cx,cy+Ra+16,{size:12,color:P.grey}); }
      T(c,MOD[m].n+" · "+MOD[m].y,10,14,{size:14,color:P.acc,align:"left"});
      nt.set("<b>Expérience / observation :</b> "+MOD[m].e+"<br><b>Ce que le modèle explique :</b> "+MOD[m].ok+"<br><b>Sa limite :</b> "+MOD[m].lim,"");
    });
    lp.play();
  }
});
})();
