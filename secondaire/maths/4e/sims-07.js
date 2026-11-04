(function(){
var P = SFA.draw.palette, F = SFA.fmt, PI=Math.PI, D2R=PI/180;
function gcd(a,b){ return b?gcd(b,a%b):a; }
function radStr(d){
  var n=Math.round(d/15);
  if(Math.abs(d-n*15)<1e-7){ var neg=n<0; n=Math.abs(n); if(n===0) return "0"; var g=gcd(n,12), num=n/g, den=12/g;
    return (neg?"−":"")+(num===1?"":num)+"π"+(den===1?"":"/"+den); }
  return F(d*D2R,3)+" rad";
}
function arcAt(c,cx,cy,r,a0,a1,col,w){ var ctx=c.ctx; ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=w||2; ctx.beginPath(); ctx.arc(cx,cy,r,-a0,-a1,a1>a0); ctx.stroke(); ctx.restore(); }

/* ---------- triangle quelconque ---------- */
SFA.sim({
  id:"m4-c07-triangle", ch:"c07", tag:"Classique",
  titre:"Un triangle quelconque : lois des sinus et des cosinus",
  resume:"Déplace les sommets : côtés, angles, aire et vérification numérique des deux lois.",
  but:"Fais glisser A, B ou C. Observe que a/sin A = b/sin B = c/sin C reste constant (loi des sinus) et que a² = b² + c² − 2bc·cos A (loi des cosinus) est toujours vraie. Quand A = 90°, retrouves-tu Pythagore ?",
  aRetenir:"Loi des sinus : a/sin A = b/sin B = c/sin C. Loi des cosinus : a² = b² + c² − 2bc·cos A. Aire = ½·b·c·sin A. Pour A = 90°, cos A = 0 et la loi des cosinus devient a² = b² + c².",
  piege:"Dans la loi des sinus, chaque côté est divisé par le sinus de l'angle OPPOSÉ (a ↔ A). Et un angle obtus a un sinus positif : sin(180° − A) = sin A.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85});
    var pts=[{x:1,y:1.5},{x:10,y:2},{x:4,y:7.5}], ax=null, sel=-1;
    k.button("Triangle rectangle en A",function(){ pts=[{x:2,y:1.5},{x:9,y:1.5},{x:2,y:6}]; });
    k.button("Remettre",function(){ pts=[{x:1,y:1.5},{x:10,y:2},{x:4,y:7.5}]; });
    var ro=k.readouts(["Côtés a ; b ; c","Angles A ; B ; C","Aire","a/sin A ; b/sin B ; c/sin C","a² et b² + c² − 2bc·cos A"]);
    var nt=k.note("","");
    c.pointer(function(t,p){ if(!ax)return;
      if(t==="down"){ var best=-1,bd=1600; pts.forEach(function(q,i){ var d=Math.pow(ax.X(q.x)-p.x,2)+Math.pow(ax.Y(q.y)-p.y,2); if(d<bd){bd=d;best=i;} }); sel=best; }
      if((t==="down"||t==="drag")&&sel>=0){ pts[sel].x=Math.max(0.5,Math.min(11.5,Math.round(ax.ix(p.x)*2)/2)); pts[sel].y=Math.max(0.5,Math.min(9,Math.round(ax.iy(p.y)*2)/2)); k.redraw(); }
      if(t==="up") sel=-1; });
    k.draw(function(){
      c.clear();
      ax=S.draw.axes(c,{x0:0,x1:12,y0:0,y1:9.6,stepX:2,stepY:2});
      var A=pts[0],B=pts[1],C=pts[2];
      var a=Math.hypot(B.x-C.x,B.y-C.y), b=Math.hypot(A.x-C.x,A.y-C.y), cc=Math.hypot(A.x-B.x,A.y-B.y);
      var ctx=c.ctx; ctx.fillStyle="rgba(30,63,143,.12)"; ctx.beginPath(); ctx.moveTo(ax.X(A.x),ax.Y(A.y)); ctx.lineTo(ax.X(B.x),ax.Y(B.y)); ctx.lineTo(ax.X(C.x),ax.Y(C.y)); ctx.closePath(); ctx.fill();
      S.draw.line(c,ax.X(B.x),ax.Y(B.y),ax.X(C.x),ax.Y(C.y),P.red,2.5); S.draw.line(c,ax.X(A.x),ax.Y(A.y),ax.X(C.x),ax.Y(C.y),P.green,2.5); S.draw.line(c,ax.X(A.x),ax.Y(A.y),ax.X(B.x),ax.Y(B.y),P.amber,2.5);
      var names=["A","B","C"], cols=[P.ink,P.ink,P.ink];
      pts.forEach(function(q,i){ S.draw.dot(c,ax.X(q.x),ax.Y(q.y),8,P.acc); S.draw.text(c,names[i],ax.X(q.x),ax.Y(q.y)-16,{size:14,color:P.acc}); });
      var degen = a<1e-9||b<1e-9||cc<1e-9;
      var area2=Math.abs((B.x-A.x)*(C.y-A.y)-(C.x-A.x)*(B.y-A.y));
      if(degen||area2<1e-9){ ["—","—"].forEach(function(){}); ro.set(0,F(a,2)+" ; "+F(b,2)+" ; "+F(cc,2)); ro.set(1,"—"); ro.set(2,"0 (sommets alignés)"); ro.set(3,"—"); ro.set(4,"—"); nt.set("Les trois points sont alignés : le triangle est aplati (aire nulle).","warn"); return; }
      var cosA=(b*b+cc*cc-a*a)/(2*b*cc), cosB=(a*a+cc*cc-b*b)/(2*a*cc), Ar=Math.acos(cosA), Br=Math.acos(cosB), Cr=PI-Ar-Br;
      var area=0.5*b*cc*Math.sin(Ar);
      ro.set(0,F(a,2)+" ; "+F(b,2)+" ; "+F(cc,2));
      ro.set(1,F(Ar/D2R,1)+"° ; "+F(Br/D2R,1)+"° ; "+F(Cr/D2R,1)+"°");
      ro.set(2,F(area,2)+" u²");
      ro.set(3,F(a/Math.sin(Ar),3)+" ; "+F(b/Math.sin(Br),3)+" ; "+F(cc/Math.sin(Cr),3));
      ro.set(4,F(a*a,2)+" et "+F(b*b+cc*cc-2*b*cc*cosA,2));
      nt.set(Math.abs(Ar/D2R-90)<0.05||Math.abs(Br/D2R-90)<0.05||Math.abs(Cr/D2R-90)<0.05 ? "Triangle rectangle : la loi des cosinus se réduit au théorème de Pythagore." : (Math.max(Ar,Br,Cr)>PI/2+1e-6 ? "Un angle est obtus (> 90°) : cos négatif, donc le terme −2bc·cos A est positif." : "Les trois angles sont aigus."), Math.abs(Ar/D2R-90)<0.05||Math.abs(Br/D2R-90)<0.05||Math.abs(Cr/D2R-90)<0.05?"ok":"");
    });
  }
});

/* ---------- équations trigonométriques ---------- */
SFA.sim({
  id:"m4-c07-equation-trigo", ch:"c07", tag:"Classique",
  titre:"Résoudre sin x = a, cos x = a ou tan x = a",
  resume:"Une droite horizontale coupe la courbe : les abscisses des intersections sont les solutions.",
  but:"Choisis la fonction et la valeur a. Les solutions dans [0 ; 2π[ sont les points rouges sur la courbe et sur le cercle. Combien y en a-t-il ? Quand n'y en a-t-il qu'une ?",
  aRetenir:"sin x = a : deux solutions x₁ et π − x₁ dans [0 ; 2π[ (une seule pour a = ±1, aucune si |a| > 1). cos x = a : x₁ et 2π − x₁. tan x = a : x₁ et x₁ + π. Avec la période, on ajoute 2kπ (ou kπ pour tan).",
  piege:"La calculatrice (arcsin) ne donne qu'UNE solution, l'angle aigu ou négatif. Il faut chercher l'autre sur le cercle. Et mets la calculatrice en radians ou en degrés selon l'unité voulue !",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.62});
    var fn=k.seg("Équation",[["sin","sin x = a"],["cos","cos x = a"],["tan","tan x = a"]],"sin");
    var a=k.slider("Valeur a",-1,1,0.05,0.5,"");
    var ro=k.readouts(["Équation","Solution x₁","Solution x₂","Nombre de solutions"]);
    k.draw(function(){
      var A=Math.round(a.value*100)/100, f=fn.value, W=c.W,H=c.H, r=Math.min(W*0.13,H*0.3), cx=W*0.17, cy=H/2; c.clear(); var ctx=c.ctx;
      ctx.strokeStyle=P.acc; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*PI); ctx.stroke();
      S.draw.line(c,cx-r*1.25,cy,cx+r*1.25,cy,P.grey,1); S.draw.line(c,cx,cy-r*1.25,cx,cy+r*1.25,P.grey,1);
      var gx0=W*0.38, gx1=W-8, gs=(gx1-gx0)/(2*PI), yR=f==="tan"?3:1.3, ys=f==="tan"?(H*0.42)/yR:r, Y=function(v){return cy-v*ys;}, G=function(u){return gx0+u*gs;};
      S.draw.line(c,gx0,cy,gx1,cy,P.grey,1.2); S.draw.line(c,gx0,Y(yR),gx0,Y(-yR),P.grey,1.2);
      [0,0.5,1,1.5,2].forEach(function(m){ S.draw.line(c,G(m*PI),cy-3,G(m*PI),cy+3,P.grey,1); S.draw.text(c,m===0?"0":(m===1?"π":(m===2?"2π":(m===0.5?"π/2":"3π/2"))),G(m*PI),H-10,{size:12,color:P.grey}); });
      var fx=function(u){ return f==="sin"?Math.sin(u):(f==="cos"?Math.cos(u):Math.tan(u)); };
      ctx.save(); ctx.beginPath(); ctx.rect(gx0,Y(yR),gx1-gx0,Y(-yR)-Y(yR)); ctx.clip(); ctx.strokeStyle=P.acc; ctx.lineWidth=2.6; ctx.beginPath(); var st=false;
      for(var u=0;u<=2*PI+1e-9;u+=0.01){ var v=fx(u); if(f==="tan"&&Math.abs(Math.cos(u))<0.02){ st=false; continue; } if(!st){ctx.moveTo(G(u),Y(v));st=true;} else ctx.lineTo(G(u),Y(v)); } ctx.stroke(); ctx.restore();
      S.draw.line(c,gx0,Y(A),gx1,Y(A),P.red,1.8,[5,4]); S.draw.text(c,"y = "+F(A,2),gx1-28,Y(A)-9,{size:12,color:P.red});
      var sols=[], x1;
      if(f==="sin"){ if(Math.abs(A)<=1){ x1=Math.asin(A); sols=[x1,PI-x1]; } }
      else if(f==="cos"){ if(Math.abs(A)<=1){ x1=Math.acos(A); sols=[x1,2*PI-x1]; } }
      else { x1=Math.atan(A); sols=[x1,x1+PI]; }
      sols=sols.map(function(s){ return ((s%(2*PI))+2*PI)%(2*PI); }).sort(function(p,q){return p-q;});
      var uniq=[]; sols.forEach(function(s){ if(!uniq.length||Math.abs(s-uniq[uniq.length-1])>1e-9) uniq.push(s); });
      if(uniq.length===2 && Math.abs(uniq[0]-uniq[1]+2*PI)<1e-9) uniq.pop();
      if(f!=="tan"&&Math.abs(Math.abs(A)-1)<1e-9) uniq=[uniq[0]];
      /* rayons et points sur le cercle */
      if(f==="sin") S.draw.line(c,cx-r*1.1,cy-A*r,cx+r*1.1,cy-A*r,P.red,1.3,[4,3]);
      else if(f==="cos") S.draw.line(c,cx+A*r,cy-r*1.1,cx+A*r,cy+r*1.1,P.red,1.3,[4,3]);
      else { S.draw.line(c,cx+r,cy-r*1.2,cx+r,cy+r*1.2,P.violet,1.2,[4,3]); S.draw.dot(c,cx+r,cy-A*r,4,P.violet); }
      uniq.forEach(function(s){ var px=cx+r*Math.cos(s), py=cy-r*Math.sin(s); S.draw.line(c,cx,cy,px,py,P.red,1.3,[3,3]); S.draw.dot(c,px,py,6,P.red); S.draw.dot(c,G(s),Y(fx(s)),7,P.red); });
      var eqn=f+" x = "+F(A,2);
      ro.set(0,eqn);
      ro.set(1,uniq.length?F(uniq[0]/D2R,1)+"° = "+radStr(uniq[0]/D2R):"aucune");
      ro.set(2,uniq.length>1?F(uniq[1]/D2R,1)+"° = "+radStr(uniq[1]/D2R):(uniq.length?"(identique)":"aucune"));
      ro.set(3,String(uniq.length)+" dans [0 ; 2π[");
    });
  }
});

/* ---------- cas ambigu ---------- */
SFA.sim({
  id:"m4-c07-cas-ambigu", ch:"c07", tag:"Piège",
  titre:"Le cas ambigu SSA : 0, 1 ou 2 triangles ?",
  resume:"On connaît b, l'angle A et le côté a : combien de triangles existent ?",
  but:"Fixe l'angle A et le côté b, puis fais varier le côté a. Le côté a est un « balancier » centré en C : il coupe la droite de base 0, 1 ou 2 fois. Trouve la valeur de a qui donne exactement un triangle rectangle.",
  aRetenir:"Avec A aigu et h = b·sin A : a < h → aucun triangle ; a = h → un triangle rectangle ; h < a < b → DEUX triangles ; a ≥ b → un seul triangle. Avec A obtus ou droit : un triangle si a > b, sinon aucun.",
  piege:"Sans l'angle compris entre les deux côtés connus, la loi des sinus donne sin B, donc B ou 180° − B : il faut tester si 180° − B est aussi possible.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.62});
    var Aa=k.slider("Angle A",20,150,1,30,"°");
    var b=k.slider("Côté b = AC",3,8,0.5,5,"");
    var a=k.slider("Côté a = BC",1,10,0.1,3.5,"");
    var ro=k.readouts(["Hauteur h = b·sin A","Nombre de triangles","Angle(s) B possible(s)"]);
    var nt=k.note("","");
    k.draw(function(){
      var Av=Aa.value*D2R, bv=b.value, av=Math.round(a.value*10)/10, W=c.W,H=c.H; c.clear(); var ctx=c.ctx;
      var sc=Math.min((W-20)/22,(H-20)/13), X=function(x){return 10+(x+7)*sc;}, Y=function(y){return H-10-(y+3)*sc;};
      var Cx=bv*Math.cos(Av), Cy=bv*Math.sin(Av), h=bv*Math.sin(Av);
      S.draw.line(c,X(-6),Y(0),X(15),Y(0),P.grey,1.5);
      ctx.save(); ctx.beginPath(); ctx.rect(0,0,W,H); ctx.clip(); ctx.strokeStyle=P.violet; ctx.lineWidth=1.5; ctx.setLineDash([5,4]); ctx.beginPath(); ctx.arc(X(Cx),Y(Cy),av*sc,0,2*PI); ctx.stroke(); ctx.restore();
      S.draw.line(c,X(0),Y(0),X(Cx),Y(Cy),P.green,3);
      arcAt(c,X(0),Y(0),22,0,Av,P.amber,2.5);
      S.draw.dot(c,X(0),Y(0),6,P.ink); S.draw.dot(c,X(Cx),Y(Cy),6,P.ink); S.draw.text(c,"A",X(0)-12,Y(0)+10,{size:13}); S.draw.text(c,"C",X(Cx),Y(Cy)-12,{size:13});
      S.draw.line(c,X(Cx),Y(Cy),X(Cx),Y(0),P.grey,1,[3,3]);
      var sols=[], eps=1e-9, disc=av*av-h*h; if(Math.abs(disc)<1e-9) disc=0;
      if(disc>-eps){ var rt=Math.sqrt(Math.max(0,disc)); [Cx-rt,Cx+rt].forEach(function(x,i){ if(x>1e-9 && !(i===1&&rt<1e-9)) sols.push(x); }); }
      var cols=[P.red,P.teal];
      sols.forEach(function(x,i){ S.draw.line(c,X(Cx),Y(Cy),X(x),Y(0),cols[i],2.5); S.draw.line(c,X(0),Y(0),X(x),Y(0),cols[i],3.5); S.draw.dot(c,X(x),Y(0),7,cols[i]); S.draw.text(c,"B"+(sols.length>1?(i+1):""),X(x),Y(0)+16,{size:13,color:cols[i]}); });
      var Bs=sols.map(function(x){ var cosB=(av*av+x*x-bv*bv)/(2*av*x); return Math.acos(Math.max(-1,Math.min(1,cosB)))/D2R; });
      ro.set(0,F(h,3));
      ro.set(1,String(sols.length));
      ro.set(2,Bs.length?Bs.map(function(v,i){return "B"+(Bs.length>1?(i+1):"")+" ≈ "+F(v,1)+"°";}).join(" ; "):"—");
      var msg,kind="";
      if(Aa.value<90){
        if(Math.abs(av-h)<1e-9){ msg="a = h : un seul triangle, rectangle en B (le cercle est tangent à la base)."; kind="ok"; }
        else if(av<h){ msg="a < h : le cercle de rayon a ne touche pas la base : aucun triangle."; kind="warn"; }
        else if(av<bv){ msg="h < a < b : le cercle coupe la base en deux points : DEUX triangles (cas ambigu). Les angles B valent B et 180° − B."; kind="ok"; }
        else { msg="a ≥ b : un seul triangle (l'autre point serait derrière A)."; kind="ok"; }
      } else { msg = av>bv ? "A obtus : un seul triangle est possible (a > b)." : "A obtus et a ≤ b : aucun triangle (le plus grand côté est opposé au plus grand angle)."; kind=av>bv?"ok":"warn"; }
      nt.set(msg,kind);
    });
  }
});

/* ---------- triangulation ---------- */
SFA.sim({
  id:"m4-c07-triangulation", ch:"c07", tag:"Topographie",
  titre:"Mesurer une distance inaccessible",
  resume:"Deux observateurs A et B visent un arbre T de l'autre côté d'une rivière : la loi des sinus donne les distances.",
  but:"Déplace l'arbre T. Les angles α (en A) et β (en B) sont « mesurés » ; la loi des sinus calcule AT et BT. Ajoute une erreur de visée sur α et regarde l'effet sur la distance.",
  aRetenir:"Dans le triangle ABT, l'angle en T vaut 180° − α − β. Loi des sinus : AT = AB·sin β / sin(α + β) et BT = AB·sin α / sin(α + β). Seul AB (la base) est mesuré au mètre ; le reste vient des angles.",
  piege:"Une petite erreur d'angle peut donner une grosse erreur de distance, surtout quand l'angle en T est très petit (arbre loin et base courte). Une base trop courte est un mauvais choix.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.78});
    var d=k.slider("Base AB",40,200,10,100,"m");
    var er=k.slider("Erreur de visée sur α",-3,3,0.5,0,"°");
    var T={x:25,y:90}, geo={};
    var ro=k.readouts(["α (en A) ; β (en B)","Angle en T","AT calculé","BT calculé","AT réel","Erreur sur AT"]);
    var nt=k.note("","");
    c.pointer(function(t,p){ if(t==="move"||!geo.sc) return; if(t==="down"||t==="drag"){ T.x=Math.round((p.x-c.W/2)/geo.sc); T.y=Math.round((c.H-28-p.y)/geo.sc); T.x=Math.max(-150,Math.min(150,T.x)); T.y=Math.max(15,Math.min(185,T.y)); k.redraw(); } });
    k.draw(function(){
      var W=c.W,H=c.H; c.clear(); var ctx=c.ctx, sc=Math.min((W-20)/320,(H-40)/200); geo.sc=sc;
      var X=function(x){return W/2+x*sc;}, Y=function(y){return H-28-y*sc;};
      var dv=d.value, A={x:-dv/2,y:0}, B={x:dv/2,y:0};
      ctx.fillStyle="rgba(14,116,144,.15)"; ctx.fillRect(0,Y(12),W,Y(2)-Y(12)); S.draw.text(c,"rivière",W-34,(Y(12)+Y(2))/2,{size:12,color:P.teal});
      S.draw.line(c,X(-160),Y(0),X(160),Y(0),P.grey,1.5);
      var tA=Math.atan2(T.y-A.y,T.x-A.x), tB=Math.atan2(T.y-B.y,T.x-B.x);
      var alpha=tA/D2R, beta=180-tB/D2R;
      S.draw.line(c,X(A.x),Y(A.y),X(T.x),Y(T.y),P.red,2); S.draw.line(c,X(B.x),Y(B.y),X(T.x),Y(T.y),P.green,2);
      S.draw.line(c,X(A.x),Y(A.y),X(B.x),Y(B.y),P.amber,3.5);
      S.draw.dot(c,X(A.x),Y(A.y),7,P.ink); S.draw.dot(c,X(B.x),Y(B.y),7,P.ink); S.draw.dot(c,X(T.x),Y(T.y),9,P.green);
      S.draw.text(c,"A",X(A.x),Y(0)+16,{size:13}); S.draw.text(c,"B",X(B.x),Y(0)+16,{size:13}); S.draw.text(c,"T (arbre)",X(T.x),Y(T.y)-16,{size:12,color:P.green});
      var am=alpha+er.value, bm=beta, Tm=180-am-bm;
      var truth=Math.hypot(T.x-A.x,T.y-A.y);
      ro.set(0,F(am,1)+"° ; "+F(bm,1)+"°");
      if(Tm<=0.05){ ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); ro.set(4,F(truth,1)+" m"); ro.set(5,"—"); nt.set("Avec cette erreur, les deux visées ne se croisent plus : mesure impossible.","warn"); return; }
      var at=dv*Math.sin(bm*D2R)/Math.sin((am+bm)*D2R), bt=dv*Math.sin(am*D2R)/Math.sin((am+bm)*D2R);
      ro.set(1,F(Tm,1)+"°"); ro.set(2,F(at,1)+" m"); ro.set(3,F(bt,1)+" m"); ro.set(4,F(truth,1)+" m"); ro.set(5,F(at-truth,1)+" m ("+F(100*(at-truth)/truth,1)+" %)");
      nt.set(Math.abs(er.value)<1e-9?"Sans erreur de visée, la loi des sinus redonne exactement la distance réelle AT.":(Tm<20?"L'angle en T est petit : la mesure est très sensible à l'erreur. Allonge la base AB.":"Une erreur de "+F(Math.abs(er.value),1)+"° sur α fausse AT de "+F(Math.abs(at-truth),1)+" m."),Math.abs(er.value)<1e-9?"ok":"");
    });
  }
});

/* ---------- forces concourantes ---------- */
SFA.sim({
  id:"m4-c07-forces", ch:"c07", tag:"Niche",
  titre:"Deux forces, une résultante : tir à la corde",
  resume:"Deux forces F₁ et F₂ avec un angle φ entre elles : la résultante se calcule avec la loi des cosinus.",
  but:"Règle F₁, F₂ et l'angle φ entre les deux cordes. Observe la résultante R (diagonale du parallélogramme). Pour quel angle R est-elle maximale ? Minimale ? Nulle ?",
  aRetenir:"R² = F₁² + F₂² + 2·F₁·F₂·cos φ (loi des cosinus dans le triangle des forces, où l'angle opposé à R vaut 180° − φ). R est maximale (F₁ + F₂) pour φ = 0° et minimale (|F₁ − F₂|) pour φ = 180°. Pour φ = 90°, c'est Pythagore.",
  piege:"R n'est pas F₁ + F₂ sauf si les forces sont alignées (φ = 0°). On additionne des vecteurs, pas des normes.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.72});
    var f1=k.slider("Force F₁",50,500,10,300,"N");
    var f2=k.slider("Force F₂",50,500,10,400,"N");
    var ph=k.slider("Angle φ entre F₁ et F₂",0,180,1,60,"°");
    var ro=k.readouts(["R = √(F₁² + F₂² + 2F₁F₂cos φ)","Angle de R avec F₁","F₁ + F₂ (somme des normes)"]);
    var nt=k.note("","");
    k.draw(function(){
      var A=f1.value,B=f2.value,p=ph.value*D2R, W=c.W,H=c.H; c.clear(); var ctx=c.ctx;
      var sc=Math.min((W*.68)/1000,(H*.55)/500), ox=W*.28, oy=H*.78;
      var f1p={x:ox+A*sc,y:oy}, f2p={x:ox+B*sc*Math.cos(p),y:oy-B*sc*Math.sin(p)};
      var Rx=A+B*Math.cos(p), Ry=B*Math.sin(p), R=Math.hypot(Rx,Ry), rp={x:ox+Rx*sc,y:oy-Ry*sc};
      ctx.save(); ctx.strokeStyle=P.grey; ctx.lineWidth=1.2; ctx.setLineDash([4,4]); ctx.beginPath(); ctx.moveTo(f1p.x,f1p.y); ctx.lineTo(rp.x,rp.y); ctx.lineTo(f2p.x,f2p.y); ctx.stroke(); ctx.restore();
      S.draw.arrow(c,ox,oy,f1p.x,f1p.y,P.red,3); S.draw.arrow(c,ox,oy,f2p.x,f2p.y,P.green,3);
      if(R>1e-6) S.draw.arrow(c,ox,oy,rp.x,rp.y,P.acc,4);
      S.draw.dot(c,ox,oy,5,P.ink);
      S.draw.text(c,"F₁ = "+F(A,0)+" N",f1p.x,f1p.y+16,{size:12,color:P.red,align:"center"});
      S.draw.text(c,"F₂ = "+F(B,0)+" N",f2p.x,f2p.y-14,{size:12,color:P.green});
      if(R>1e-6) S.draw.text(c,"R = "+F(R,0)+" N",rp.x+(Rx>=0?0:0),rp.y-14-(Ry<1e-6?-30:0),{size:13,color:P.acc});
      arcAt(c,ox,oy,26,0,p,P.amber,2); S.draw.text(c,"φ",ox+38,oy-8,{size:12,color:P.amber});
      var ang=Math.atan2(Ry,Rx)/D2R;
      ro.set(0,F(R,1)+" N"); ro.set(1,R<1e-6?"—":F(ang,1)+"°"); ro.set(2,F(A+B,0)+" N");
      var msg;
      if(ph.value===0) msg="φ = 0° : forces alignées dans le même sens. R = F₁ + F₂, c'est le tir à la corde d'une même équipe.";
      else if(ph.value===180) msg="φ = 180° : forces opposées. R = |F₁ − F₂| = "+F(Math.abs(A-B),0)+" N"+(A===B?" : équilibre, R = 0.":" : l'équipe la plus forte l'emporte.");
      else if(ph.value===90) msg="φ = 90° : R² = F₁² + F₂² (théorème de Pythagore).";
      else msg="R < F₁ + F₂ : les forces « se gênent » dès qu'elles ne sont pas alignées.";
      nt.set(msg,ph.value===0?"ok":"");
    });
  }
});
})();
