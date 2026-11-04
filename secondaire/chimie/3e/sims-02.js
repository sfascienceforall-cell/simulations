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
    var c = k.canvas(300);
    var sb = k.select("Substance", Object.keys(SUBS).map(function(i){return [i,SUBS[i].n+" (fusion "+SUBS[i].tm+" °C, ébullition "+SUBS[i].tb+" °C)"];}), "eau");
    var tp = k.slider("Température", -250, 400, 1, 20, "°C");
    var ro = k.readouts(["État","Température absolue","Agitation relative","Entre les particules"]);
    var nt = k.note("","");
    var N=48, ps=[], i, R=rng(7);
    function getBox(){ var w=Math.min(c.W-24,280); return {x:(c.W-w)/2,y:10,w:w,h:c.H-20}; }
    for(i=0;i<N;i++){ ps.push({x:0,y:0,vx:0,vy:0,ph:R()*6.28,gx:i%8,gy:Math.floor(i/8),init:false}); }
    var topB = 0, last="";
    function state(){ var s=SUBS[sb.value], t=tp.value; return t<s.tm?"s":(t<s.tb?"l":"g"); }
    function reinit(box,mode){
      ps.forEach(function(p,j){ if(mode==="s"){ p.x=box.x+box.w*0.5+(p.gx-3.5)*22; p.y=box.y+box.h-20-(5-p.gy)*22; } else { p.x=box.x+12+R()*(box.w-24); p.y=box.y+box.h*0.5+R()*box.h*0.45; }
        var a=R()*6.28; p.vx=Math.cos(a); p.vy=Math.sin(a); });
    }
    var lp = k.loop(function(dt,tt){
      var box=getBox(), s=state(), Tk=tp.value+273.15;
      if(s!==last){ if(last==="" || last==="s" || s==="s") reinit(box,s); last=s; }
      var sp = 5.5*Math.sqrt(Math.max(Tk,5)) * (s==="g"?1:0.32);
      var targetTop = s==="g" ? box.y : box.y+box.h-66; topB += (targetTop-topB)*Math.min(1,dt*4);
      ps.forEach(function(p,j){
        if(s==="s"){ var Tm=SUBS[sb.value].tm+273.15, A=1+3.5*Math.min(1,Tk/Tm); var hx=box.x+box.w*0.5+(p.gx-3.5)*22, hy=box.y+box.h-20-(5-p.gy)*22; p.x+=((hx+A*Math.sin(tt*9+p.ph))-p.x)*Math.min(1,dt*10); p.y+=((hy+A*Math.cos(tt*8+p.ph*1.3))-p.y)*Math.min(1,dt*10); }
        else { p.vx+=(R()-0.5)*dt*8; p.vy+=(R()-0.5)*dt*8; var m=Math.hypot(p.vx,p.vy)||1; p.vx=p.vx/m; p.vy=p.vy/m; p.x+=p.vx*sp*dt; p.y+=p.vy*sp*dt;
          var top=topB+8; if(p.x<box.x+8){p.x=box.x+8;p.vx=Math.abs(p.vx);} if(p.x>box.x+box.w-8){p.x=box.x+box.w-8;p.vx=-Math.abs(p.vx);} if(p.y<top){p.y=top;p.vy=Math.abs(p.vy);} if(p.y>box.y+box.h-8){p.y=box.y+box.h-8;p.vy=-Math.abs(p.vy);} }
      });
      if(s==="l"){ for(var a=0;a<N;a++)for(var b=a+1;b<N;b++){ var dx=ps[b].x-ps[a].x, dy=ps[b].y-ps[a].y, d=Math.hypot(dx,dy), md=17; if(d<md&&d>0.01){ var f=(md-d)/2/d; ps[a].x-=dx*f; ps[a].y-=dy*f; ps[b].x+=dx*f; ps[b].y+=dy*f; } } }
      k.redraw();
    });
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H, box=getBox(), s=state(), sub=SUBS[sb.value], t=tp.value;
      rr(c,box.x,box.y,box.w,box.h,"#fbfcfe","#b8c2d0",2,10);
      var col = s==="s"?P.acc:(s==="l"?P.teal:P.red);
      ps.forEach(function(p){ circ(c,p.x||box.x+30,p.y||box.y+30,7.5,col,"#fff",1); });
      var name = s==="s"?"solide":(s==="l"?"liquide":"gaz");
      var edge = (Math.abs(t-sub.tm)<0.5)?" (fusion : solide ⇄ liquide)":(Math.abs(t-sub.tb)<0.5?" (ébullition : liquide ⇄ gaz)":"");
      T(c,name.toUpperCase(),W/2,box.y+16,{size:13,color:col});
      ro.set(0,name+(edge?" / changement d'état":"")); ro.set(1,F(t+273.15,0)+" K"); ro.set(2,F(Math.sqrt((t+273.15)/293.15)*100,0)+" %");
      ro.set(3,"du vide");
      nt.set(s==="s"?"Solide : chaque particule vibre autour d'une position fixe ; plus T monte, plus la vibration est ample.":s==="l"?"Liquide : particules au contact mais désordonnées, qui glissent : le liquide prend la forme du récipient.":"Gaz : particules très éloignées, rapides, qui occupent tout le volume disponible.", "ok");
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
    var c = k.canvas(330);
    var md = k.seg("Modèle de l'atome", [["th","Thomson"],["ru","Rutherford"]], "ru");
    var cb = k.select("Cible", Object.keys(CIBLES).map(function(i){return [i,CIBLES[i].n];}), "au");
    var ro = k.readouts(["Particules tirées","Quasi tout droit (< 5°)","Déviées (5° à 90°)","Rebroussent chemin (> 90°)"]);
    var R=rng(11), tally, tracks;
    function reset(){ tally={n:0,s:0,m:0,b:0}; tracks=[]; }
    reset();
    var Bm=150;
    function shot(){
      var th=md.value==="th", z=CIBLES[cb.value].z, b=(R()*2-1)*Bm, ang;
      if(th){ ang=(R()-0.5)*0.01; }
      else { var a=0.025*z; ang=2*Math.atan(a/Math.max(Math.abs(b),1e-6)); if(b<0) ang=-ang; }
      var deg=Math.abs(ang)*180/Math.PI;
      tally.n++; if(deg<5) tally.s++; else if(deg<=90) tally.m++; else tally.b++;
      tracks.push({b:b,ang:ang,th:th}); if(tracks.length>40) tracks.shift();
    }
    function fire(n){ for(var i=0;i<n;i++) shot(); }
    k.button("Tirer 1", function(){ fire(1); });
    k.button("Tirer 20", function(){ fire(20); }, true);
    k.button("Tirer 500", function(){ fire(500); });
    k.button("Effacer", function(){ reset(); });
    md.set && 0;
    k.draw(function(){
      c.clear(); var W=c.W,H=c.H,g=c.ctx, xn=W*0.5, yc=H/2, ys=(H*0.45)/Bm;
      // cloud
      if(md.value==="th"){ var rr0=H*0.3; g.save(); g.fillStyle="rgba(214,87,70,0.18)"; g.beginPath(); g.arc(xn,yc,rr0,0,6.28); g.fill(); g.restore();
        for(var i=0;i<14;i++){ var a=i*2.4, r=rr0*0.8*Math.sqrt((i+1)/14); T(c,"−",xn+r*Math.cos(a),yc+r*Math.sin(a),{size:16,color:P.acc}); }
        T(c,"charge + répartie",xn,yc+rr0+14,{size:12,color:P.grey}); }
      else { g.save(); g.strokeStyle="#c3ccd8"; g.setLineDash([4,4]); g.beginPath(); g.arc(xn,yc,H*0.3,0,6.28); g.stroke(); g.restore(); circ(c,xn,yc,6,P.red); T(c,"noyau (+) : pas à l'échelle",xn,yc+H*0.3+14,{size:12,color:P.grey}); }
      // faisceau
      D.arrow(c,10,yc,40,yc,P.grey,2); T(c,"α",22,yc-12,{size:14,color:P.grey});
      tracks.forEach(function(t,i){
        var y0=yc+t.b*ys, alpha=0.25+0.75*(i+1)/tracks.length, dg=Math.abs(t.ang)*180/Math.PI, col=dg<5?"rgba(46,107,85,"+alpha+")":dg<=90?"rgba(180,83,9,"+alpha+")":"rgba(180,35,24,"+alpha+")";
        g.save(); g.strokeStyle=col; g.lineWidth=1.6; g.beginPath(); g.moveTo(8,y0); g.lineTo(xn,y0);
        var L=W, dx=Math.cos(t.ang), dy=-Math.sin(t.ang)*(t.b>=0?-1:-1);
        // l'angle est signé comme b : déviation s'éloignant du noyau
        var sgn=t.b>=0?1:-1, ex=xn+L*Math.cos(Math.abs(t.ang)), ey=y0+sgn*L*Math.sin(Math.abs(t.ang));
        g.lineTo(ex,ey); g.stroke(); g.restore();
      });
      // écran de comptage
      D.line(c,W-8,6,W-8,H-6,P.grey,3);
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
  {t:"Construis un atome neutre qui a le même nombre d'électrons que Ne mais un autre élément : Na⁺ ne compte pas, il faut un atome neutre ! Trouve plutôt : l'atome neutre de néon 20.", f:function(p,n,e){ return p===10&&n===10&&e===10; }}
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
