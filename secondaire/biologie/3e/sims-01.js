(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }

/*B3H-KIT*/
window.B3H = (function(){
  var INK = "#2a3340";
  function ell(g,x,y,rx,ry,fill,st,rot){ g.beginPath(); g.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rot||0,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(st){g.strokeStyle=st;g.lineWidth=1.2;g.stroke();} }
  function eye(g,x,y,r){ ell(g,x,y,r,r,"#fff",INK); ell(g,x+r*.2,y,r*.5,r*.5,INK); }
  var A = {};
  /* chaque fonction : (c, x, y, s, dir) ; (x,y) = centre, s = largeur approximative, dir = 1 (regarde à droite) ou -1 */
  A.herbe = function(c,x,y,s){ var g=c.ctx; g.save(); g.translate(x,y+s*.3); g.lineCap="round";
    [[-.36,-.55,"#3a8f4f"],[-.2,-.8,"#2f7a43"],[0,-1,"#47a55c"],[.2,-.78,"#2f7a43"],[.36,-.52,"#3a8f4f"],[-.08,-.7,"#6bbf6f"],[.1,-.62,"#6bbf6f"]].forEach(function(b){
      g.strokeStyle=b[2]; g.lineWidth=Math.max(2,s*.07); g.beginPath(); g.moveTo(b[0]*s*.5,0); g.quadraticCurveTo(b[0]*s*.6,b[1]*s*.5,b[0]*s*1.2,b[1]*s*.75); g.stroke(); });
    g.restore(); };
  A.sauterelle = function(c,x,y,s,d){ d=d||1; var g=c.ctx; g.save(); g.translate(x,y); g.scale(d*s/60,s/60); g.lineCap="round"; g.lineJoin="round";
    g.strokeStyle="#4a6a2a"; g.lineWidth=3; g.beginPath(); g.moveTo(-6,4); g.lineTo(-22,-14); g.lineTo(-34,12); g.stroke(); g.beginPath(); g.moveTo(4,6); g.lineTo(0,18); g.stroke(); g.beginPath(); g.moveTo(12,6); g.lineTo(14,18); g.stroke();
    ell(g,-2,0,26,9,"#8cc152",INK,-.05); ell(g,-6,-4,20,5,"#a6d46a"); ell(g,26,-3,9,7,"#7aae44",INK); eye(g,29,-5,3);
    g.strokeStyle=INK; g.lineWidth=1.2; g.beginPath(); g.moveTo(32,-8); g.quadraticCurveTo(44,-26,56,-24); g.stroke(); g.restore(); };
  A.grenouille = function(c,x,y,s,d){ d=d||1; var g=c.ctx; g.save(); g.translate(x,y); g.scale(d*s/60,s/60); g.lineCap="round";
    ell(g,-18,10,18,8,"#3f9a5a",INK,-.3); ell(g,0,2,26,15,"#52b36e",INK); ell(g,4,9,16,8,"#d9efc4"); ell(g,22,-6,13,10,"#52b36e",INK);
    ell(g,22,-15,5,5,"#52b36e",INK); ell(g,28,-14,5,5,"#52b36e",INK); eye(g,22,-16,3); eye(g,28,-15,3);
    g.strokeStyle=INK; g.lineWidth=1.2; g.beginPath(); g.moveTo(28,-4); g.quadraticCurveTo(33,-2,36,-5); g.stroke();
    ell(g,18,16,10,4,"#3f9a5a",INK); g.restore(); };
  A.souris = function(c,x,y,s,d){ d=d||1; var g=c.ctx; g.save(); g.translate(x,y); g.scale(d*s/60,s/60); g.lineCap="round";
    g.strokeStyle="#c58a8a"; g.lineWidth=2.5; g.beginPath(); g.moveTo(-24,6); g.bezierCurveTo(-40,6,-40,-14,-52,-8); g.stroke();
    ell(g,-2,4,24,15,"#b59a82",INK); ell(g,18,0,14,11,"#c4ab93",INK,.2); ell(g,12,-12,7,7,"#e8b9b9",INK); ell(g,28,3,3,2.6,"#d77");
    eye(g,22,-3,2.6); g.strokeStyle="#7a6552"; g.lineWidth=1; for (var i=-1;i<=1;i++){ g.beginPath(); g.moveTo(28,3); g.lineTo(40,3+i*4); g.stroke(); }
    ell(g,-4,18,8,3,"#9c8068",INK); g.restore(); };
  A.couleuvre = function(c,x,y,s,d){ d=d||1; var g=c.ctx; g.save(); g.translate(x,y); g.scale(d*s/80,s/80); g.lineCap="round"; g.lineJoin="round";
    g.strokeStyle=INK; g.lineWidth=13; g.beginPath(); g.moveTo(-38,8); g.bezierCurveTo(-24,-18,-10,24,6,2); g.bezierCurveTo(18,-12,28,-2,34,-8); g.stroke();
    g.strokeStyle="#7cae5a"; g.lineWidth=10.5; g.stroke();
    g.strokeStyle="#4e7f35"; g.lineWidth=2.5; g.setLineDash([2,7]); g.stroke(); g.setLineDash([]);
    ell(g,37,-9,9,6.5,"#7cae5a",INK,-.4); eye(g,39,-11,2.4); g.strokeStyle="#c0321d"; g.lineWidth=1.3; g.beginPath(); g.moveTo(45,-8); g.lineTo(52,-6); g.lineTo(55,-9); g.moveTo(52,-6); g.lineTo(55,-3); g.stroke(); g.restore(); };
  A.buse = function(c,x,y,s,d){ d=d||1; var g=c.ctx; g.save(); g.translate(x,y); g.scale(d*s/90,s/90); g.lineJoin="round";
    g.fillStyle="#8a6a4a"; g.strokeStyle=INK; g.lineWidth=1.2;
    g.beginPath(); g.moveTo(-6,-4); g.bezierCurveTo(-20,-30,-52,-30,-70,-16); g.lineTo(-58,-10); g.lineTo(-64,-2); g.lineTo(-48,0); g.lineTo(-44,6); g.lineTo(-18,6); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(6,-4); g.bezierCurveTo(20,-30,52,-30,70,-16); g.lineTo(58,-10); g.lineTo(64,-2); g.lineTo(48,0); g.lineTo(44,6); g.lineTo(18,6); g.closePath(); g.fill(); g.stroke();
    ell(g,0,4,13,20,"#a98462",INK); ell(g,0,10,8,12,"#efe3d0"); ell(g,0,-17,8,8,"#a98462",INK); eye(g,-3.5,-18,2.4); eye(g,3.5,-18,2.4);
    g.fillStyle="#f4c542"; g.beginPath(); g.moveTo(-3,-14); g.lineTo(0,-8); g.lineTo(3,-14); g.closePath(); g.fill(); g.stroke();
    g.fillStyle="#6d5238"; g.beginPath(); g.moveTo(-7,22); g.lineTo(0,34); g.lineTo(7,22); g.closePath(); g.fill(); g.stroke(); g.restore(); };
  A.champignon = function(c,x,y,s){ var g=c.ctx; g.save(); g.translate(x,y); g.scale(s/60,s/60);
    g.fillStyle="#f3e8d6"; g.strokeStyle=INK; g.lineWidth=1.2; g.beginPath(); g.moveTo(-6,18); g.quadraticCurveTo(-4,0,-5,-4); g.lineTo(5,-4); g.quadraticCurveTo(4,0,6,18); g.closePath(); g.fill(); g.stroke();
    g.fillStyle="#c9785a"; g.beginPath(); g.moveTo(-26,-3); g.bezierCurveTo(-26,-30,26,-30,26,-3); g.quadraticCurveTo(0,4,-26,-3); g.fill(); g.stroke();
    ell(g,-10,-14,3.2,2.4,"#f6e7d4"); ell(g,6,-19,3,2.2,"#f6e7d4"); ell(g,14,-10,2.6,2,"#f6e7d4"); g.restore(); };
  A.ver = function(c,x,y,s,d){ var g=c.ctx; g.save(); g.translate(x,y); g.scale((d||1)*s/60,s/60); g.lineCap="round";
    g.strokeStyle="#9c5b52"; g.lineWidth=7; g.beginPath(); g.moveTo(-26,4); g.bezierCurveTo(-14,-10,-4,14,8,0); g.bezierCurveTo(16,-8,22,-2,26,-6); g.stroke();
    g.strokeStyle="#d69a8e"; g.lineWidth=4.5; g.stroke(); g.restore(); };
  A.arbre = function(c,x,y,s){ var g=c.ctx; g.save(); g.translate(x,y); g.scale(s/80,s/80);
    g.fillStyle="#7a5a3a"; g.beginPath(); g.moveTo(-6,40); g.lineTo(-4,6); g.lineTo(4,6); g.lineTo(6,40); g.fill();
    [[0,-14,26,"#2f7a43"],[-18,0,18,"#3a8f4f"],[18,0,18,"#3a8f4f"],[0,-2,20,"#47a55c"]].forEach(function(b){ ell(g,b[0],b[1],b[2],b[2]*.9,b[3]); }); g.restore(); };
  A.poisson = function(c,x,y,s,d,col){ d=d||1; var g=c.ctx; g.save(); g.translate(x,y); g.scale(d*s/60,s/60);
    g.fillStyle=col||"#e07a1f"; g.strokeStyle=INK; g.lineWidth=1.2;
    g.beginPath(); g.moveTo(-30,0); g.lineTo(-44,-12); g.lineTo(-44,12); g.closePath(); g.fill(); g.stroke();
    ell(g,-4,0,30,15,col||"#e07a1f",INK); ell(g,2,5,20,6,"rgba(255,255,255,.35)"); eye(g,16,-3,3.2); g.restore(); };
  A.humain = function(c,x,y,s){ var g=c.ctx; g.save(); g.translate(x,y); g.scale(s/60,s/60); g.lineCap="round";
    ell(g,0,-22,9,9,"#f2c9a0",INK); g.fillStyle="#4a7fc1"; g.strokeStyle=INK; g.lineWidth=1.2; g.beginPath(); g.moveTo(-12,-10); g.lineTo(12,-10); g.lineTo(10,16); g.lineTo(-10,16); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle="#3b4a63"; g.lineWidth=6; g.beginPath(); g.moveTo(-5,16); g.lineTo(-5,34); g.moveTo(5,16); g.lineTo(5,34); g.stroke(); g.restore(); };
  /* ciel + prairie */
  A.prairie = function(c,hor){ var g=c.ctx, W=c.W, H=c.H; hor = hor==null ? .62 : hor;
    var s=g.createLinearGradient(0,0,0,H*hor); s.addColorStop(0,"#d6ecfb"); s.addColorStop(1,"#f4fbf2"); g.fillStyle=s; g.fillRect(0,0,W,H*hor+1);
    var p=g.createLinearGradient(0,H*hor,0,H); p.addColorStop(0,"#bfe3a8"); p.addColorStop(1,"#8fcb7e"); g.fillStyle=p; g.fillRect(0,H*hor,W,H*(1-hor)); };
  A.draw = function(name,c,x,y,s,d,col){ if (A[name]) A[name](c,x,y,s,d,col); };
  return A;
})();
/*B3H-END*/

/* ===== 1 · Construis ton réseau ===== */
SFA.sim({
  id:"b3-c01-reseau", ch:"c01", tag:"Classique · tombe souvent",
  titre:"Construis ton réseau alimentaire",
  resume:"Tape l'être mangé, puis celui qui le mange : la flèche suit la matière. Le programme vérifie le sens.",
  but:"Pose les flèches du réseau d'une prairie. Une flèche va de l'être mangé vers celui qui le mange. Vise toutes les flèches essentielles, sans erreur.",
  aRetenir:"La flèche indique le transfert de matière et d'énergie : elle part de l'être mangé et pointe vers le mangeur (herbe → sauterelle). Les décomposeurs reçoivent la matière morte de tous les êtres vivants et rendent les sels minéraux aux producteurs.",
  piege:"La flèche ne veut pas dire « mange » : écrire sauterelle → herbe est faux. Un animal appartient souvent à plusieurs chaînes, et les décomposeurs ne sont jamais « inutiles ».",
  build:function(k,S){
    var c = k.canvas(410);
    var N = [
      {id:"buse", nom:"Buse", fx:.5, fy:.08, role:"c"},
      {id:"couleuvre", nom:"Couleuvre", fx:.5, fy:.30, role:"c"},
      {id:"grenouille", nom:"Grenouille", fx:.2, fy:.50, role:"c"},
      {id:"souris", nom:"Souris", fx:.8, fy:.50, role:"c"},
      {id:"sauterelle", nom:"Sauterelle", fx:.2, fy:.72, role:"c"},
      {id:"herbe", nom:"Herbe", fx:.5, fy:.72, role:"p"},
      {id:"decomp", nom:"Décomposeurs", fx:.78, fy:.93, role:"d"}
    ];
    var REQ = ["herbe>sauterelle","herbe>souris","sauterelle>grenouille","grenouille>couleuvre","souris>buse","couleuvre>buse","souris>couleuvre"];
    var OPT = ["grenouille>buse"];
    var byId = {}; N.forEach(function(n){ byId[n.id]=n; });
    var edges = [], sel = null;
    function isDecomp(a,b){ return b==="decomp" && a!=="decomp"; }
    function kind(e){
      var key = e[0]+">"+e[1], rev = e[1]+">"+e[0];
      if (REQ.indexOf(key)>=0 || OPT.indexOf(key)>=0) return "ok";
      if (isDecomp(e[0],e[1]) || (e[0]==="decomp" && e[1]==="herbe")) return "ok";
      if (REQ.indexOf(rev)>=0 || OPT.indexOf(rev)>=0 || isDecomp(e[1],e[0])) return "rev";
      return "bad";
    }
    function pos(n){ var hw = 46; return {x:clamp(n.fx*c.W, hw+4, c.W-hw-4), y:n.fy*c.H, hw:n.role==="d"?60:46, hh:15}; }
    function hit(p){ for (var i=0;i<N.length;i++){ var q=pos(N[i]); if (Math.abs(p.x-q.x)<=q.hw && Math.abs(p.y-q.y)<=q.hh+6) return N[i]; } return null; }
    var ro = k.readouts(["Flèches posées","Justes","À retourner","Plus longue chaîne"]);
    var nt = k.note("Tape un <b>être mangé</b>, puis <b>celui qui le mange</b>. Retape les deux pour effacer une flèche.", "");
    c.pointer(function(type,p){
      if (type!=="down") return;
      var n = hit(p); if (!n){ sel = null; k.redraw(); return; }
      if (!sel){ sel = n.id; k.redraw(); return; }
      if (sel===n.id){ sel=null; k.redraw(); return; }
      var i = -1; edges.forEach(function(e,j){ if (e[0]===sel && e[1]===n.id) i=j; });
      if (i>=0) edges.splice(i,1); else edges.push([sel,n.id]);
      sel = null; k.redraw();
    });
    k.button("Retourner les flèches inversées", function(){ edges = edges.map(function(e){ return kind(e)==="rev" ? [e[1],e[0]] : e; }); }, true);
    k.button("Montrer le réseau complet", function(){ edges = REQ.concat(OPT).map(function(s){ return s.split(">"); }); edges.push(["herbe","decomp"],["souris","decomp"],["decomp","herbe"]); });
    k.button("Tout effacer", function(){ edges = []; sel = null; });
    function edgePt(a,b){ var A=pos(a),B=pos(b),dx=B.x-A.x,dy=B.y-A.y,t=Math.min(dx? (A.hw+3)/Math.abs(dx):1e9, dy? (A.hh+3)/Math.abs(dy):1e9), d=Math.sqrt(dx*dx+dy*dy)||1; return [A.x+dx*t - dy/d*5, A.y+dy*t + dx/d*5]; }
    k.draw(function(){
      c.clear(); var g = c.ctx;
      edges.forEach(function(e){
        var a = byId[e[0]], b = byId[e[1]], kd = kind(e);
        var p1 = edgePt(a,b), p2 = edgePt(b,a);
        var col = kd==="ok" ? P.green : kd==="rev" ? P.red : P.amber;
        D.arrow(c,p1[0],p1[1],p2[0],p2[1],col,2.4);
      });
      N.forEach(function(n){
        var q = pos(n), fill = n.role==="p" ? "#dff1e5" : n.role==="d" ? "#efe3d3" : "#e6edfa", st = n.role==="p" ? P.green : n.role==="d" ? "#8a5a2b" : P.acc;
        rect(c, q.x-q.hw, q.y-q.hh, q.hw*2, q.hh*2, fill, sel===n.id ? P.violet : st, sel===n.id ? 3.5 : 1.6, 8);
        T(c, n.nom, q.x, q.y, {size:13, color:P.ink});
      });
      var good=0, rev=0, ids={};
      edges.forEach(function(e){ var kd=kind(e); if (kd==="rev") rev++; });
      REQ.forEach(function(s){ var a=s.split(">"); edges.forEach(function(e){ if (e[0]===a[0]&&e[1]===a[1]) good++; }); });
      /* plus longue chaîne parmi les flèches justes entre êtres vivants */
      var adj = {}; edges.forEach(function(e){ if (kind(e)==="ok" && e[0]!=="decomp" && e[1]!=="decomp"){ (adj[e[0]]=adj[e[0]]||[]).push(e[1]); } });
      function depth(id,seen){ var m=1; (adj[id]||[]).forEach(function(x){ if (seen.indexOf(x)<0) m=Math.max(m,1+depth(x,seen.concat([x]))); }); return m; }
      var L = 0; if (Object.keys(adj).length) N.forEach(function(n){ L=Math.max(L,depth(n.id,[n.id])); });
      ro.set(0,edges.length+""); ro.set(1,good+" / "+REQ.length); ro.set(2,rev+""); ro.set(3,L? L+" maillons":"—");
      var firstRev = null, firstBad = null; edges.forEach(function(e){ var kd=kind(e); if (kd==="rev"&&!firstRev) firstRev=e; if (kd==="bad"&&!firstBad) firstBad=e; });
      if (firstRev) nt.set("Flèche <b>"+byId[firstRev[0]].nom+" → "+byId[firstRev[1]].nom+"</b> : sens inversé. La matière va de l'être mangé vers le mangeur.", "bad");
      else if (firstBad) nt.set("<b>"+byId[firstBad[0]].nom+" → "+byId[firstBad[1]].nom+"</b> : ces deux espèces n'ont pas de relation alimentaire dans ce milieu.", "warn");
      else if (good===REQ.length) nt.set("Bravo : les "+REQ.length+" flèches essentielles sont posées dans le bon sens. Ajoute les décomposeurs pour fermer la boucle.", "ok");
      else nt.set("Tape un <b>être mangé</b>, puis <b>celui qui le mange</b>. Il manque encore "+(REQ.length-good)+" flèche(s) essentielle(s).", "");
    });
  }
});

/* ===== 2 · Retire une espèce ===== */
SFA.sim({
  id:"b3-c01-retire-espece", ch:"c01", tag:"Modèle chiffré",
  titre:"Retire une espèce : que deviennent les autres ?",
  resume:"Au bout de 10 ans, retire une espèce du réseau et suis les populations des quatre autres.",
  but:"Choisis une espèce et la part qui disparaît. Les courbes montrent la population de chacune en % de sa valeur d'équilibre.",
  aRetenir:"Dans un réseau, tout est relié. Sans producteurs, tout s'effondre. Sans le prédateur de tête, ses proies augmentent d'abord, puis épuisent leurs ressources. Une perte partielle est souvent encaissée : les populations reviennent vers l'équilibre.",
  piege:"« Supprimer le prédateur, c'est bon pour les proies » est faux à long terme. Les effets sont indirects et décalés dans le temps. (Modèle simplifié à 5 espèces, unités arbitraires.)",
  build:function(k,S){
    var c = k.canvas(370);
    var NM = ["Herbe","Sauterelles","Souris","Grenouilles","Buses"], COL = [P.green,P.amber,P.grey,P.teal,P.violet];
    var which = k.seg("Espèce touchée", [[-1,"Aucune"],[0,"Herbe"],[1,"Sauterelles"],[2,"Souris"],[3,"Grenouilles"],[4,"Buses"]], -1);
    var frac = k.slider("Part qui disparaît", 10, 100, 10, 100, "%");
    var ro = k.readouts(NM.map(function(n){ return n+" à 60 ans"; }));
    var nt = k.note("","");
    /* modèle : herbe logistique, deux herbivores, deux prédateurs intermédiaires, un prédateur de tête */
    var Kg=10, r=1, cS=.1, cM=.15, cF=.15, cB1=.3, cB2=.2, e=.6, eB=.5, dS=.09, dM=.24, dF=.03, dB=.35, sS=.03, sM=.03, sF=.05, sB=.1;
    function der(x){ var G=x[0],Sa=x[1],M=x[2],Fr=x[3],B=x[4];
      return [G*(r*(1-G/Kg)-cS*Sa-cM*M), Sa*(e*cS*G-cF*Fr-dS-sS*Sa), M*(e*cM*G-cB1*B-dM-sM*M), Fr*(e*cF*Sa-cB2*B-dF-sF*Fr), B*(eB*(cB1*M+cB2*Fr)-dB-sB*B)]; }
    function add(x,d,h){ return x.map(function(v,i){ return v+d[i]*h; }); }
    function run(){
      var x=[5,2,2,1,.5], x0=x.slice(), dt=.05, out=[], t;
      for (var s=0; s<=1200; s++){
        t = s*dt;
        if (s===200 && which.value>=0) x[which.value] *= 1 - frac.value/100;
        if (s%4===0) out.push([t].concat(x.map(function(v,i){ return 100*v/x0[i]; })));
        var k1=der(x), k2=der(add(x,k1,dt/2)), k3=der(add(x,k2,dt/2)), k4=der(add(x,k3,dt));
        x = x.map(function(v,i){ return Math.max(0, v+dt*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6); });
      }
      return out;
    }
    k.draw(function(){
      c.clear(); var out = run(), ym = 120;
      out.forEach(function(r){ for (var i=1;i<6;i++) ym = Math.max(ym, r[i]); });
      ym = Math.min(600, Math.ceil(ym/50)*50);
      var ax = D.axes(c,{x0:0,x1:60,y0:0,y1:ym,xl:"temps (années)",yl:"% de l'équilibre",stepX:10,l:50,t:50});
      var g = c.ctx; g.save(); g.setLineDash([5,4]); g.strokeStyle=P.grey; g.beginPath(); g.moveTo(ax.X(10),ax.T); g.lineTo(ax.X(10),ax.B); g.stroke(); g.restore();
      T(c,"changement",ax.X(10)+4,ax.B-34,{size:12,color:P.grey,align:"left"});
      for (var i=0;i<5;i++){
        (function(i){ D.fn(c,ax,function(x){ var j=Math.min(out.length-1,Math.max(0,Math.round(x/.2))); return out[j][i+1]; },COL[i],which.value===i?4:2.4,which.value===i?[6,4]:null); })(i);
      }
      var last = out[out.length-1], gone = [];
      for (i=0;i<5;i++){ ro.set(i, last[i+1]<1 ? "disparue" : S.fmt(last[i+1],0)+" %"); if (last[i+1]<15 && i!==which.value) gone.push(NM[i]); }
      var lx = 8; NM.forEach(function(n,i){ var row = i<3?0:1, col = i<3?i:i-3, w = c.W/3; rect(c,6+col*w,8+row*18,10,10,COL[i]); T(c,n,20+col*w,13+row*18,{size:12,align:"left",color:P.ink}); });
      if (which.value<0) nt.set("Rien ne change : l'écosystème est à l'équilibre (les cinq courbes restent à 100 %).","ok");
      else if (gone.length) nt.set("Effet en cascade : <b>"+gone.join(", ")+"</b> disparaî"+(gone.length>1?"ssent":"t")+" aussi (ou "+(gone.length>1?"sont":"est")+" au bord de la disparition), faute de nourriture.","bad");
      else if (frac.value<100 && Math.abs(last[which.value+1]-100)<15) nt.set("L'écosystème a <b>encaissé</b> la perte : l'espèce touchée est revenue près de son équilibre.","ok");
      else nt.set("Les autres espèces se réorganisent : certaines augmentent, d'autres diminuent. Compare les courbes à 100 %.","warn");
    });
  }
});

/* ===== 3 · Régimes alimentaires ===== */
SFA.sim({
  id:"b3-c01-regimes", ch:"c01", tag:"Classique",
  titre:"Régime alimentaire et niveau trophique",
  resume:"Compose une assiette : herbivore, omnivore ou carnivore ? Calcule le niveau trophique de l'espèce.",
  but:"Règle la part de végétaux, d'animaux herbivores et d'animaux carnivores dans le régime. Lis le niveau trophique et l'énergie qui lui parvient.",
  aRetenir:"Niveau trophique = 1 + niveau moyen des aliments (végétal : 1, herbivore : 2, carnivore : 3). Un herbivore strict est consommateur de 1er ordre (niveau 2) ; plus on mange haut, moins il reste d'énergie des producteurs.",
  piege:"Omnivore ne veut pas dire « niveau 3 » : l'humain omnivore se situe entre les niveaux 2 et 3, selon la part de viande dans son assiette. Les valeurs des animaux sont des ordres de grandeur.",
  build:function(k,S){
    var c = k.canvas(300);
    var pre = k.select("Espèce type", [["x","— à toi de jouer —"],["vache","Vache"],["loup","Loup"],["ours","Ours brun"],["vege","Humain végétarien"],["omni","Humain omnivore"],["inuit","Inuit traditionnel"]], "omni", function(v){
      var T0 = {vache:[100,0], loup:[0,95], ours:[70,25], vege:[100,0], omni:[55,40], inuit:[0,40]};
      if (T0[v]){ pv.set(T0[v][0]); ph.set(T0[v][1]); }
    });
    var pv = k.slider("Végétaux", 0, 100, 5, 55, "%");
    var ph = k.slider("Animaux herbivores (bœuf, lapin, poulet…)", 0, 100, 5, 40, "%");
    var ro = k.readouts(["Part de carnivores mangés","Niveau trophique","Type de régime","Énergie des producteurs qui arrive"]);
    var nt = k.note("","");
    k.draw(function(){
      var v = pv.value, h = Math.min(ph.value, 100 - v), cc = 100 - v - h;
      if (h !== ph.value) ph.set(h);
      c.clear();
      var L = 1 + (v*1 + h*2 + cc*3)/100;
      var bx = 24, bw = c.W - 48, by = 52, bh = 36, x = bx;
      T(c,"Assiette (100 %)",bx,24,{size:13,align:"left"});
      [[v,"#9ccfae","Végétaux"],[h,"#f1c27d","Herbivores"],[cc,"#d98a7a","Carnivores"]].forEach(function(s){
        var w = bw*s[0]/100; if (w>0){ rect(c,x,by,w,bh,s[1],P.ink,1); if (w>58) T(c,s[2],x+w/2,by+bh/2,{size:12}); x += w; }
      });
      var ay = 170;
      T(c,"Niveau trophique",bx,138,{size:13,align:"left"});
      var X = function(l){ return bx + (l-1)/3*bw; };
      D.line(c,X(1),ay,X(4),ay,P.ink,2);
      ["1 producteur","2 cons. I","3 cons. II","4 cons. III"].forEach(function(s,i){ D.line(c,X(i+1),ay-6,X(i+1),ay+6,P.ink,2); T(c,s,clamp(X(i+1),30,c.W-30),ay+22,{size:12,color:P.grey}); });
      D.arrow(c,X(L),ay-48,X(L),ay-8,P.violet,3); T(c,S.fmt(L,2),X(L),ay-58,{size:14,color:P.violet});
      T(c,"aliments : végétal 1 · herbivore 2 · carnivore 3",c.W/2,262,{size:12,color:P.grey});
      var kind = (v>=95) ? "Herbivore" : (v<=5) ? "Carnivore" : "Omnivore";
      var cons = L<=2.05 ? "consommateur I" : L<2.95 ? "entre C I et C II" : L<=3.05 ? "consommateur II" : L<3.95 ? "entre C II et C III" : "consommateur III";
      ro.set(0,cc+" %"); ro.set(1,S.fmt(L,2)+" ("+cons+")"); ro.set(2,kind); ro.set(3,S.fmt(100*Math.pow(.1,L-1),2)+" %");
      nt.set(kind==="Omnivore" ? "Régime omnivore : le niveau trophique tombe <b>entre</b> deux niveaux entiers." : kind==="Herbivore" ? "Herbivore : il est au 2<sup>e</sup> niveau, juste au-dessus des producteurs." : "Carnivore : il se nourrit d'animaux, donc plus haut dans la chaîne.", "ok");
    });
  }
});

/* ===== 4 · Décomposeurs ===== */
SFA.sim({
  id:"b3-c01-decomposeurs", ch:"c01", tag:"Original · niche",
  titre:"Les décomposeurs au travail",
  resume:"Une feuille morte, un cadavre ou une branche : quelle masse reste-t-il après quelques jours, selon la température et l'humidité ?",
  but:"Choisis la matière, la température et l'humidité. Fais glisser le temps et lis la masse restante. Puis retire les décomposeurs.",
  aRetenir:"Les décomposeurs (bactéries, champignons, vers) transforment la matière morte en CO₂, eau et sels minéraux, réutilisables par les producteurs. Ils vont plus vite quand il fait chaud et humide. Sans eux, la matière morte s'accumulerait et les sols s'appauvriraient.",
  piege:"Le froid et la sécheresse ralentissent les décomposeurs, mais ne les rendent pas inutiles. Trop d'eau (sol saturé, marais) les ralentit aussi, faute de dioxygène. (Modèle simplifié, valeurs indicatives.)",
  build:function(k,S){
    var c = k.canvas(320);
    var mat = k.select("Matière morte", [["f","Feuilles de hêtre"],["s","Cadavre de souris"],["b","Branche de chêne"]], "f");
    var tt = k.slider("Température", 0, 35, 1, 15, "°C");
    var hh = k.slider("Humidité du milieu", 0, 100, 5, 60, "%");
    var dd = k.toggle("Décomposeurs présents", true);
    var day = k.slider("Jour", 0, 365, 5, 90, "j");
    var ro = k.readouts(["Masse restante","Matière rendue au milieu","Temps pour perdre la moitié"]);
    var nt = k.note("","");
    var K20 = {f:.0033, s:.05, b:.0004};
    function kk(){
      var f = Math.pow(2,(tt.value-20)/10), w = hh.value, hf = w<=60 ? w/60 : 1 - .5*(w-60)/40;
      return dd.value ? K20[mat.value]*f*hf : 0;
    }
    k.draw(function(){
      c.clear(); var kv = kk();
      var ax = D.axes(c,{x0:0,x1:365,y0:0,y1:100,xl:"jour",yl:"masse restante (%)",stepX:50,stepY:20,l:50});
      D.fn(c,ax,function(x){ return 100*Math.exp(-kv*x); },P.green,3.2);
      var m = 100*Math.exp(-kv*day.value);
      D.line(c,ax.X(day.value),ax.B,ax.X(day.value),ax.Y(m),P.grey,1.5,[4,4]); D.line(c,ax.L,ax.Y(m),ax.X(day.value),ax.Y(m),P.grey,1.5,[4,4]);
      D.dot(c,ax.X(day.value),ax.Y(m),6,P.violet);
      ro.set(0,S.fmt(m,1)+" %"); ro.set(1,S.fmt(100-m,1)+" %");
      var half = kv>0 ? Math.log(2)/kv : Infinity;
      ro.set(2, kv>0 ? (half<2 ? S.fmt(half*24,0)+" h" : half<1000 ? S.fmt(half,0)+" jours" : "plusieurs années") : "jamais");
      if (!dd.value) nt.set("Sans décomposeurs, rien ne se décompose : la matière s'accumule et ses sels minéraux restent bloqués. Les producteurs finiraient par manquer de minéraux.","bad");
      else if (tt.value<=3 || hh.value<=10) nt.set("Trop froid ou trop sec : les décomposeurs sont presque à l'arrêt. C'est pourquoi on conserve des aliments au frigo ou séchés.","warn");
      else if (hh.value>=95) nt.set("Sol saturé d'eau : peu de dioxygène, décomposition lente (tourbières).","warn");
      else nt.set("La matière restituée ("+S.fmt(100-m,0)+" %) repart en CO₂, eau et sels minéraux : le cycle est bouclé.","ok");
    });
  }
});
})();
