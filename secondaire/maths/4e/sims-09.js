(function(){
var P = SFA.draw.palette, F = SFA.fmt, PI=Math.PI, D2R=PI/180;
function snap(v,lo,hi,st){ st=st||1; return Math.max(lo,Math.min(hi,Math.round(v/st)*st)); }
function sg(v,s){ return (v<0?" + ":" − ")+F(Math.abs(v),2); } /* "(x − h)" avec h : v=−h */
function sq(name,h){ return h===0 ? name+"²" : "("+name+(h>0?" − "+F(h,2):" + "+F(-h,2))+")²"; }

/* ---------- médiatrice ---------- */
SFA.sim({
  id:"m4-c09-mediatrice", ch:"c09", tag:"Classique",
  titre:"La médiatrice, lieu des points équidistants",
  resume:"Place un point M : il est équidistant de A et B seulement s'il est sur la médiatrice.",
  but:"Déplace M (ou A et B). Marque plusieurs points M pour lesquels MA = MB : ils s'alignent sur une droite, la médiatrice de [AB]. Les marques vertes sont équidistantes, les rouges non.",
  aRetenir:"La médiatrice de [AB] est le lieu des points M tels que MA = MB. C'est la droite perpendiculaire à [AB] passant par son milieu. Tout point de cette droite est équidistant de A et B, et réciproquement.",
  piege:"Un lieu, c'est TOUS les points qui vérifient la condition (une droite entière), pas seulement quelques points. Et la médiatrice n'est pas la médiane : elle est perpendiculaire à [AB].",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85});
    var A={x:-3,y:-2},B={x:5,y:2},M={x:1,y:5}, marks=[], ax=null, sel=-1;
    k.button("Marquer M",function(){ marks.push({x:M.x,y:M.y}); if(marks.length>60) marks.shift(); },true);
    k.button("Effacer les marques",function(){ marks=[]; });
    var ro=k.readouts(["MA","MB","|MA − MB|","M est…"]);
    var nt=k.note("","");
    var pts=[A,B,M];
    c.pointer(function(t,p){ if(!ax)return;
      if(t==="down"){ var b=-1,bd=1200; pts.forEach(function(q,i){ var d=Math.pow(ax.X(q.x)-p.x,2)+Math.pow(ax.Y(q.y)-p.y,2); if(d<bd){bd=d;b=i;} }); sel=b; }
      if((t==="down"||t==="drag")&&sel>=0){ var st=sel===2?0.5:1; pts[sel].x=snap(ax.ix(p.x),-9,9,st); pts[sel].y=snap(ax.iy(p.y),-9,9,st); k.redraw(); }
      if(t==="up") sel=-1; });
    function eq(P1){ return Math.abs(Math.pow(P1.x-A.x,2)+Math.pow(P1.y-A.y,2)-Math.pow(P1.x-B.x,2)-Math.pow(P1.y-B.y,2))<1e-9; }
    k.draw(function(){
      c.clear(); ax=S.draw.axes(c,{x0:-10,x1:10,y0:-10,y1:10,stepX:2,stepY:2,equal:true});
      var degen=(A.x===B.x&&A.y===B.y);
      if(!degen){ var mx=(A.x+B.x)/2,my=(A.y+B.y)/2, dx=-(B.y-A.y),dy=B.x-A.x, n=Math.hypot(dx,dy); dx/=n; dy/=n;
        var ctx=c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); ctx.clip();
        S.draw.line(c,ax.X(mx-dx*30),ax.Y(my-dy*30),ax.X(mx+dx*30),ax.Y(my+dy*30),P.violet,2.5,[8,5]); ctx.restore();
        S.draw.dot(c,ax.X(mx),ax.Y(my),4,P.violet); }
      S.draw.line(c,ax.X(A.x),ax.Y(A.y),ax.X(B.x),ax.Y(B.y),P.ink,2);
      marks.forEach(function(q){ S.draw.dot(c,ax.X(q.x),ax.Y(q.y),5,eq(q)?P.green:P.red); });
      S.draw.line(c,ax.X(M.x),ax.Y(M.y),ax.X(A.x),ax.Y(A.y),P.amber,1.5,[4,3]); S.draw.line(c,ax.X(M.x),ax.Y(M.y),ax.X(B.x),ax.Y(B.y),P.teal,1.5,[4,3]);
      S.draw.dot(c,ax.X(A.x),ax.Y(A.y),7,P.ink); S.draw.dot(c,ax.X(B.x),ax.Y(B.y),7,P.ink); S.draw.dot(c,ax.X(M.x),ax.Y(M.y),8,eq(M)?P.green:P.acc);
      S.draw.text(c,"A",ax.X(A.x)-12,ax.Y(A.y)+12,{size:14}); S.draw.text(c,"B",ax.X(B.x)+12,ax.Y(B.y)-12,{size:14}); S.draw.text(c,"M",ax.X(M.x)+12,ax.Y(M.y)-12,{size:14,color:P.acc});
      var ma=Math.hypot(M.x-A.x,M.y-A.y), mb=Math.hypot(M.x-B.x,M.y-B.y);
      ro.set(0,F(ma,3)); ro.set(1,F(mb,3)); ro.set(2,F(Math.abs(ma-mb),3)); ro.set(3,degen?"—":(eq(M)?"sur la médiatrice":(ma<mb?"plus près de A":"plus près de B")));
      nt.set(degen?"A et B sont confondus : il n'y a pas de médiatrice. Sépare-les.":(eq(M)?"MA = MB : M est sur la médiatrice de [AB].":"M n'est pas sur la médiatrice : MA ≠ MB. Du côté de "+(ma<mb?"A":"B")+" de la médiatrice."),degen?"warn":(eq(M)?"ok":""));
    });
  }
});

/* ---------- angle inscrit ---------- */
SFA.sim({
  id:"m4-c09-angle-inscrit", ch:"c09", tag:"Classique",
  titre:"Angle inscrit et angle au centre",
  resume:"M parcourt le cercle : l'angle AMB ne change pas, c'est la moitié de l'angle au centre AOB.",
  but:"Fixe l'angle au centre AOB avec le curseur α, puis déplace M sur le cercle. Que vaut l'angle AMB ? Que se passe-t-il quand M passe de l'autre côté de [AB] ? Mets α = 180° : que vaut l'angle ?",
  aRetenir:"Un angle inscrit vaut la moitié de l'angle au centre qui intercepte le même arc : AMB = ½·AOB. Tous les angles inscrits interceptant le même arc sont égaux. Si [AB] est un diamètre (AOB = 180°), l'angle inscrit vaut 90°.",
  piege:"L'angle inscrit n'est PAS égal à l'angle au centre, il en est la moitié. Et de l'autre côté de [AB], on obtient 180° − ½·AOB (les deux angles sont supplémentaires).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85});
    var al=k.slider("Angle au centre AOB",20,180,5,100,"°");
    var m=k.slider("Position de M sur le cercle",0,359,1,270,"°");
    var ro=k.readouts(["Angle au centre AOB","Angle inscrit AMB","Moitié de AOB","Position de M"]);
    var nt=k.note("","");
    var geo={};
    c.pointer(function(t,p){ if(t==="move"||!geo.r) return; var a=Math.atan2(-(p.y-geo.cy),p.x-geo.cx)/D2R; if(a<0)a+=360; m.set(Math.round(a)%360); k.redraw(); });
    k.draw(function(){
      var W=c.W,H=c.H, r=Math.min(W,H)*0.38, cx=W/2, cy=H/2; geo={cx:cx,cy:cy,r:r}; c.clear(); var ctx=c.ctx;
      var a=al.value, aA=(90+a/2), aB=(90-a/2), mm=m.value;
      var pt=function(deg){ return [cx+r*Math.cos(deg*D2R),cy-r*Math.sin(deg*D2R)]; };
      var Ap=pt(aA),Bp=pt(aB),Mp=pt(mm),O=[cx,cy];
      ctx.strokeStyle=P.acc; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*PI); ctx.stroke();
      S.draw.line(c,Ap[0],Ap[1],O[0],O[1],P.red,2); S.draw.line(c,Bp[0],Bp[1],O[0],O[1],P.red,2);
      S.draw.line(c,Mp[0],Mp[1],Ap[0],Ap[1],P.green,2.2); S.draw.line(c,Mp[0],Mp[1],Bp[0],Bp[1],P.green,2.2);
      S.draw.line(c,Ap[0],Ap[1],Bp[0],Bp[1],P.grey,1.3,[4,3]);
      S.draw.dot(c,O[0],O[1],4,P.ink); [Ap,Bp].forEach(function(q){ S.draw.dot(c,q[0],q[1],6,P.ink); }); S.draw.dot(c,Mp[0],Mp[1],8,P.green);
      S.draw.text(c,"A",Ap[0]-12,Ap[1]-10,{size:14}); S.draw.text(c,"B",Bp[0]+12,Bp[1]-10,{size:14}); S.draw.text(c,"M",Mp[0]+(Mp[0]>=cx?14:-14),Mp[1]+(Mp[1]>=cy?14:-14),{size:14,color:P.green}); S.draw.text(c,"O",O[0]+10,O[1]+12,{size:13,color:P.ink});
      S.draw.text(c,F(a,0)+"°",O[0],O[1]-r*0.35,{size:13,color:P.red});
      var d=((mm-aB)%360+360)%360, onMinor = d>0 && d<a ;   /* M entre B et A sur le petit arc */
      var touch = Math.abs(((mm-aA+540)%360)-180)<0.5 || Math.abs(((mm-aB+540)%360)-180)<0.5;
      var vA=[Ap[0]-Mp[0],Ap[1]-Mp[1]], vB=[Bp[0]-Mp[0],Bp[1]-Mp[1]], nA=Math.hypot(vA[0],vA[1]), nB=Math.hypot(vB[0],vB[1]);
      var onA=(Math.abs(mm-aA%360)<0.5||Math.abs(mm-aA%360+360)<0.5), onB=Math.abs(((mm-aB)%360+360)%360)<0.5, onAA=Math.abs(((mm-aA)%360+360)%360)<0.5;
      if(onB||onAA||nA<2||nB<2){ ro.set(0,F(a,0)+"°"); ro.set(1,"—"); ro.set(2,F(a/2,1)+"°"); ro.set(3,F(mm,0)+"°"); nt.set("M est confondu avec A ou B : l'angle AMB n'est pas défini. Déplace M.","warn"); return; }
      var ang=Math.acos(Math.max(-1,Math.min(1,(vA[0]*vB[0]+vA[1]*vB[1])/(nA*nB))))/D2R;
      ro.set(0,F(a,0)+"°"); ro.set(1,F(ang,1)+"°"); ro.set(2,F(a/2,1)+"°"); ro.set(3,F(mm,0)+"° "+(onMinor?"(petit arc AB)":"(grand arc AB)"));
      nt.set(a===180?"[AB] est un diamètre : l'angle inscrit vaut 90° pour tout M (propriété de Thalès).":(onMinor?"M est sur le petit arc : AMB = 180° − "+F(a/2,1)+"° = "+F(180-a/2,1)+" (supplémentaire).":"M est sur le grand arc : AMB = ½·AOB = "+F(a/2,1)+"°, quelle que soit la position de M."),a===180||!onMinor?"ok":"warn");
    });
  }
});

/* ---------- lieu d'un point mobile ---------- */
SFA.sim({
  id:"m4-c09-lieu", ch:"c09", tag:"Manipuler",
  titre:"Le lieu d'un point mobile",
  resume:"Un point P tourne sur un cercle ; M est construit à partir de P : quel chemin M parcourt-il ?",
  but:"Choisis une construction, déplace P sur le cercle (curseur ou doigt) et active la trace de M. Reconnais la courbe obtenue, puis compare avec le cercle annoncé (centre et rayon).",
  aRetenir:"Le lieu de M est l'ensemble de toutes les positions de M quand P parcourt son cercle. Ici : milieu de [AP] → cercle de rayon R/2 ; M = symétrique de A par rapport à P → cercle de rayon 2R ; pied de la perpendiculaire → cercle de diamètre [OA] (angle droit : Thalès).",
  piege:"Un lieu se décrit complètement : « cercle de centre … et de rayon … », pas juste « une courbe ronde ». Et il faut parfois préciser quelle partie du cercle est atteinte.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.9});
    var cons=k.select("Construction de M",[["mil","M milieu de [AP]"],["sym","M symétrique de A par rapport à P"],["pied","M pied de la perpendiculaire à (AP) issue de O"]],"mil");
    var t=k.slider("Position de P sur le cercle",0,359,1,40,"°");
    var d=k.slider("Distance OA",1,5,0.5,3,"");
    var tr=k.toggle("Afficher la trace de M",true);
    var pr=k.toggle("Afficher le cercle annoncé (pointillés)",false);
    var ro=k.readouts(["Lieu de M","Centre","Rayon"]);
    var geo={};
    c.pointer(function(tt,p){ if(tt==="move"||!geo.ax) return; var X=geo.ax.ix(p.x),Y=geo.ax.iy(p.y); var a=Math.atan2(Y,X)/D2R; if(a<0)a+=360; t.set(Math.round(a)%360); k.redraw(); });
    var R=3;
    function Mof(ang,A,type){ var Pp=[R*Math.cos(ang*D2R),R*Math.sin(ang*D2R)];
      if(type==="mil") return [(Pp[0]+A[0])/2,(Pp[1]+A[1])/2];
      if(type==="sym") return [2*Pp[0]-A[0],2*Pp[1]-A[1]];
      var ux=Pp[0]-A[0], uy=Pp[1]-A[1], n2=ux*ux+uy*uy; /* projection de O sur (AP) : A + s·u avec s = (O−A)·u/|u|² */
      if(n2<1e-12) return [A[0],A[1]];
      var s=((-A[0])*ux+(-A[1])*uy)/n2; return [A[0]+s*ux,A[1]+s*uy]; }
    k.draw(function(){
      c.clear(); var W0=cons.value==='sym'?12:6.5; var ax=S.draw.axes(c,{x0:-W0,x1:W0,y0:-W0,y1:W0,stepX:cons.value==='sym'?2:1,stepY:cons.value==='sym'?2:1,equal:true}); geo.ax=ax; var ctx=c.ctx;
      var A=[d.value,0], ty=cons.value;
      ctx.strokeStyle=P.acc; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(ax.X(0),ax.Y(0),R*(ax.X(1)-ax.X(0)),0,2*PI); ctx.stroke();
      if(tr.value){ ctx.save(); ctx.strokeStyle=P.red; ctx.lineWidth=2.2; ctx.beginPath(); for(var a=0;a<=360;a+=2){ var q=Mof(a,A,ty); if(a===0) ctx.moveTo(ax.X(q[0]),ax.Y(q[1])); else ctx.lineTo(ax.X(q[0]),ax.Y(q[1])); } ctx.stroke(); ctx.restore(); }
      var cen,rad,desc;
      if(ty==="mil"){ cen=[A[0]/2,0]; rad=R/2; desc="cercle de rayon R/2"; }
      else if(ty==="sym"){ cen=[-A[0],0]; rad=2*R; desc="cercle de rayon 2R"; }
      else { cen=[A[0]/2,0]; rad=A[0]/2; desc="cercle de diamètre [OA]"+(A[0]>R?" (seulement un arc est atteint)":""); }
      if(pr.value){ ctx.save(); ctx.strokeStyle=P.green; ctx.lineWidth=2; ctx.setLineDash([6,5]); ctx.beginPath(); ctx.arc(ax.X(cen[0]),ax.Y(cen[1]),rad*(ax.X(1)-ax.X(0)),0,2*PI); ctx.stroke(); ctx.restore(); }
      var Pp=[R*Math.cos(t.value*D2R),R*Math.sin(t.value*D2R)], M=Mof(t.value,A,ty);
      S.draw.line(c,ax.X(A[0]),ax.Y(A[1]),ax.X(Pp[0]),ax.Y(Pp[1]),P.grey,1.5,[4,3]);
      if(ty==="pied") S.draw.line(c,ax.X(0),ax.Y(0),ax.X(M[0]),ax.Y(M[1]),P.amber,1.5,[4,3]);
      S.draw.dot(c,ax.X(0),ax.Y(0),4,P.ink); S.draw.text(c,"O",ax.X(0)-10,ax.Y(0)+12,{size:13});
      S.draw.dot(c,ax.X(A[0]),ax.Y(A[1]),6,P.ink); S.draw.text(c,"A",ax.X(A[0]),ax.Y(A[1])+14,{size:13});
      S.draw.dot(c,ax.X(Pp[0]),ax.Y(Pp[1]),7,P.acc); S.draw.text(c,"P",ax.X(Pp[0])+(Pp[0]>=0?12:-12),ax.Y(Pp[1])-10,{size:13,color:P.acc});
      S.draw.dot(c,ax.X(M[0]),ax.Y(M[1]),7,P.red); S.draw.text(c,"M",ax.X(M[0])+(M[0]>=cen[0]?12:-12),ax.Y(M[1])-10,{size:13,color:P.red});
      ro.set(0,desc); ro.set(1,"("+F(cen[0],2)+" ; 0)"); ro.set(2,F(rad,2));
    });
  }
});

/* ---------- tangentes ---------- */
SFA.sim({
  id:"m4-c09-tangentes", ch:"c09", tag:"Manipuler",
  titre:"Tangentes à un cercle depuis un point extérieur",
  resume:"Déplace P : les deux tangentes ont toujours la même longueur et sont perpendiculaires aux rayons.",
  but:"Fais glisser P (ou règle le cercle). Compare les longueurs PT₁ et PT₂, vérifie que le rayon OT est perpendiculaire à la tangente PT, et lis l'équation du cercle.",
  aRetenir:"La tangente en T est perpendiculaire au rayon OT. Depuis un point P extérieur (OP > R), il y a deux tangentes de même longueur √(OP² − R²) (Pythagore dans le triangle OTP rectangle en T). L'équation du cercle de centre (h ; k) et de rayon R est (x − h)² + (y − k)² = R².",
  piege:"Si P est sur le cercle, il n'y a qu'une tangente ; si P est à l'intérieur, il n'y en a aucune. Et le signe de h et k dans l'équation est inversé : centre (2 ; −1) donne (x − 2)² + (y + 1)².",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85});
    var R=k.slider("Rayon R",1,5,0.5,3,"");
    var h=k.slider("Centre : h",-3,3,1,0,"");
    var kk=k.slider("Centre : k",-3,3,1,0,"");
    var Pp={x:7,y:3}, ax=null;
    var ro=k.readouts(["Équation du cercle","OP","Longueur PT₁ = PT₂","Angle T₁PT₂"]);
    var nt=k.note("","");
    c.pointer(function(t,p){ if(!ax||t==="move")return; Pp.x=snap(ax.ix(p.x),-9,9,0.5); Pp.y=snap(ax.iy(p.y),-9,9,0.5); k.redraw(); });
    k.draw(function(){
      c.clear(); ax=S.draw.axes(c,{x0:-10,x1:10,y0:-10,y1:10,stepX:2,stepY:2,equal:true}); var ctx=c.ctx;
      var H=h.value,K=kk.value,Rr=R.value, u=ax.X(1)-ax.X(0);
      ctx.strokeStyle=P.acc; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(ax.X(H),ax.Y(K),Rr*u,0,2*PI); ctx.stroke();
      S.draw.dot(c,ax.X(H),ax.Y(K),4,P.ink); S.draw.text(c,"O",ax.X(H)-10,ax.Y(K)+12,{size:13});
      var dx=Pp.x-H, dy=Pp.y-K, d=Math.hypot(dx,dy);
      S.draw.dot(c,ax.X(Pp.x),ax.Y(Pp.y),8,P.red); S.draw.text(c,"P",ax.X(Pp.x)+12,ax.Y(Pp.y)-10,{size:14,color:P.red});
      ro.set(0,sq("x",H)+" + "+sq("y",K)+" = "+F(Rr*Rr,2)); ro.set(1,F(d,3));
      if(d<Rr-1e-9){ ro.set(2,"—"); ro.set(3,"—"); nt.set("P est à l'intérieur du cercle (OP < R) : aucune tangente.","warn"); return; }
      if(d<1e-9){ return; }
      if(Math.abs(d-Rr)<1e-9){ ro.set(2,"0"); ro.set(3,"180°"); nt.set("P est sur le cercle : une seule tangente, perpendiculaire à OP en P.","warn"); return; }
      var phi=Math.atan2(dy,dx), beta=Math.acos(Rr/d), L=Math.sqrt(d*d-Rr*Rr), T=[[H+Rr*Math.cos(phi+beta),K+Rr*Math.sin(phi+beta)],[H+Rr*Math.cos(phi-beta),K+Rr*Math.sin(phi-beta)]];
      T.forEach(function(q,i){ S.draw.line(c,ax.X(Pp.x),ax.Y(Pp.y),ax.X(q[0]),ax.Y(q[1]),P.green,2.5); S.draw.line(c,ax.X(H),ax.Y(K),ax.X(q[0]),ax.Y(q[1]),P.amber,2,[4,3]); S.draw.dot(c,ax.X(q[0]),ax.Y(q[1]),6,P.green); S.draw.text(c,"T"+(i+1),ax.X(q[0])+(q[0]>=H?14:-14),ax.Y(q[1])+(q[1]>=K?-12:12),{size:13,color:P.green}); });
      S.draw.line(c,ax.X(H),ax.Y(K),ax.X(Pp.x),ax.Y(Pp.y),P.grey,1,[2,4]);
      ro.set(2,F(L,3)); ro.set(3,F(2*Math.asin(Rr/d)/D2R,1)+"°");
      nt.set("Les deux tangentes mesurent "+F(L,3)+" = √("+F(d*d,2)+" − "+F(Rr*Rr,2)+"). Les rayons OT sont perpendiculaires aux tangentes (triangle OTP rectangle en T).","ok");
    });
  }
});

/* ---------- ellipse ---------- */
SFA.sim({
  id:"m4-c09-ellipse", ch:"c09", tag:"Prolongement",
  titre:"Le jardinier et sa ficelle : l'ellipse",
  resume:"Deux piquets (foyers), une ficelle de longueur fixe : le point M trace une ellipse. Prolongement : les coniques sont étudiées en 6e (6 h).",
  but:"Règle la longueur de la ficelle et la distance entre les piquets F₁ et F₂. Déplace M : la somme MF₁ + MF₂ reste égale à la longueur de la ficelle. Que devient l'ellipse quand les foyers se rapprochent ?",
  aRetenir:"L'ellipse est le lieu des points M tels que MF₁ + MF₂ = L (constante). Avec foyers (±c ; 0) et L = 2a : b² = a² − c², équation x²/a² + y²/b² = 1. Si c = 0, c'est un cercle de rayon a.",
  piege:"Il faut L > F₁F₂ pour que la ficelle puisse être tendue. Si L = F₁F₂, le lieu est le segment [F₁F₂] ; si L est plus petit, il n'y a aucun point.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85});
    var L=k.slider("Longueur de la ficelle L = MF₁ + MF₂",6,18,0.5,10,"");
    var f=k.slider("Distance entre les foyers F₁F₂ = 2c",0,12,0.5,6,"");
    var t=k.slider("Position de M",0,359,1,50,"°");
    var ro=k.readouts(["MF₁","MF₂","MF₁ + MF₂","Équation","Excentricité e = c/a"]);
    var nt=k.note("","");
    k.draw(function(){
      c.clear(); var ax=S.draw.axes(c,{x0:-10,x1:10,y0:-10,y1:10,stepX:2,stepY:2,equal:true}), ctx=c.ctx;
      var Lv=L.value, cv=f.value/2, a=Lv/2;
      S.draw.dot(c,ax.X(-cv),ax.Y(0),7,P.ink); S.draw.dot(c,ax.X(cv),ax.Y(0),7,P.ink); S.draw.text(c,"F₁",ax.X(-cv),ax.Y(0)+16,{size:13}); S.draw.text(c,"F₂",ax.X(cv),ax.Y(0)+16,{size:13});
      if(cv>=a-1e-9){ ro.set(0,"—"); ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); ro.set(4,"—"); nt.set(cv>a+1e-9?"La ficelle est plus courte que la distance entre les piquets : impossible, aucun point.":"L = F₁F₂ : la ficelle est tendue en ligne droite, le lieu est le segment [F₁F₂].","warn"); if(Math.abs(cv-a)<1e-9) S.draw.line(c,ax.X(-cv),ax.Y(0),ax.X(cv),ax.Y(0),P.red,3); return; }
      var b=Math.sqrt(a*a-cv*cv);
      ctx.strokeStyle=P.acc; ctx.lineWidth=2.8; ctx.beginPath(); for(var i=0;i<=360;i+=2){ var X=a*Math.cos(i*D2R), Y=b*Math.sin(i*D2R); if(i===0) ctx.moveTo(ax.X(X),ax.Y(Y)); else ctx.lineTo(ax.X(X),ax.Y(Y)); } ctx.closePath(); ctx.stroke();
      var Mx=a*Math.cos(t.value*D2R), My=b*Math.sin(t.value*D2R), d1=Math.hypot(Mx+cv,My), d2=Math.hypot(Mx-cv,My);
      S.draw.line(c,ax.X(-cv),ax.Y(0),ax.X(Mx),ax.Y(My),P.red,2); S.draw.line(c,ax.X(cv),ax.Y(0),ax.X(Mx),ax.Y(My),P.green,2);
      S.draw.dot(c,ax.X(Mx),ax.Y(My),8,P.amber); S.draw.text(c,"M",ax.X(Mx)+12,ax.Y(My)-12,{size:14,color:P.amber});
      ro.set(0,F(d1,3)); ro.set(1,F(d2,3)); ro.set(2,F(d1+d2,3)+" = L");
      ro.set(3,"x²/"+F(a*a,2)+" + y²/"+F(b*b,2)+" = 1"); ro.set(4,F(cv/a,3));
      nt.set(cv<1e-9?"Foyers confondus : l'ellipse devient un cercle de rayon "+F(a,2)+".":"b² = a² − c² = "+F(a*a,2)+" − "+F(cv*cv,2)+" = "+F(b*b,2)+". La somme des distances est constante : "+F(Lv,1)+".","ok");
    });
  }
});
})();
