(function(){
var P = SFA.draw.palette, F = SFA.fmt, PI=Math.PI;
function gcd(a,b){ return b?gcd(b,a%b):a; }
function radStr(d){
  var n=Math.round(d/15);
  if(Math.abs(d-n*15)<1e-9){ var neg=n<0; n=Math.abs(n); if(n===0) return "0"; var g=gcd(n,12), num=n/g, den=12/g;
    return (neg?"−":"")+(num===1?"":num)+"π"+(den===1?"":"/"+den); }
  return F(d*PI/180,3)+" rad";
}
function quad(d){ var m=((d%360)+360)%360; if(m===0||m===90||m===180||m===270) return "sur un axe"; return m<90?"1er quadrant":(m<180?"2e quadrant":(m<270?"3e quadrant":"4e quadrant")); }
function arcAt(c,cx,cy,r,a0,a1,col,w){ var ctx=c.ctx; ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=w||2; ctx.beginPath(); ctx.arc(cx,cy,r,-a0,-a1,a1>a0); ctx.stroke(); ctx.restore(); }

SFA.sim({
  id:"m4-c06-cercle", ch:"c06", tag:"Classique",
  titre:"Le cercle trigonométrique : cos et sin sont des coordonnées",
  resume:"Fais tourner un point sur le cercle de rayon 1 : ses coordonnées sont (cos θ ; sin θ).",
  but:"Fais glisser le point sur le cercle (ou le curseur). Lis cos θ sur l'axe horizontal, sin θ sur l'axe vertical. Quand sin θ vaut-il 1/2 ? Et cos θ ?",
  aRetenir:"Sur le cercle de rayon 1, le point d'angle θ a pour coordonnées (cos θ ; sin θ). Donc cos² θ + sin² θ = 1, et −1 ≤ cos θ, sin θ ≤ 1. La tangente tan θ = sin θ / cos θ se lit sur la droite x = 1.",
  piege:"cos est l'abscisse (horizontal) et sin l'ordonnée (vertical), pas l'inverse. tan θ n'existe pas pour θ = 90° et 270° (cos θ = 0).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.88});
    var th=k.slider("Angle θ",0,360,1,30,"°");
    var tg=k.toggle("Montrer la tangente (droite x = 1)",false);
    var ro=k.readouts(["θ en radians","cos θ","sin θ","tan θ","Quadrant","cos² + sin²"]);
    var geo={};
    c.pointer(function(t,p){ if(t==="move"||!geo.r) return; var a=Math.atan2(-(p.y-geo.cy),p.x-geo.cx)*180/PI; if(a<0)a+=360; th.set(Math.round(a)); k.redraw(); });
    k.draw(function(){
      var d=th.value, a=d*PI/180, W=c.W,H=c.H, r=Math.min(W,H)*0.36, cx=W/2-(tg.value?W*.06:0), cy=H/2; geo={cx:cx,cy:cy,r:r};
      c.clear(); var ctx=c.ctx;
      ctx.strokeStyle="#e3e7ed"; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*PI); ctx.stroke();
      S.draw.line(c,cx-r*1.3,cy,cx+r*1.45,cy,P.grey,1.3); S.draw.line(c,cx,cy-r*1.3,cx,cy+r*1.3,P.grey,1.3);
      ctx.strokeStyle=P.acc; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*PI); ctx.stroke();
      var px=cx+r*Math.cos(a), py=cy-r*Math.sin(a);
      if(tg.value){ S.draw.line(c,cx+r,cy-r*1.3,cx+r,cy+r*1.3,P.violet,1.5,[5,4]);
        if(Math.abs(Math.cos(a))>0.02){ var ty=cy-r*Math.tan(a); if(Math.abs(ty-cy)<r*1.3){ S.draw.line(c,cx,cy,cx+r,ty,P.violet,1.3,[3,3]); S.draw.line(c,cx+r,cy,cx+r,ty,P.violet,3); S.draw.dot(c,cx+r,ty,5,P.violet); } } }
      arcAt(c,cx,cy,r*.22,0,a,P.amber,2.5);
      S.draw.line(c,cx,cy,px,py,P.ink,2);
      S.draw.line(c,px,py,px,cy,P.red,3); S.draw.line(c,cx,cy,px,cy,P.green,3);
      S.draw.dot(c,px,py,7,P.ink);
      S.draw.text(c,"cos",cx+r*Math.cos(a)/2,cy+(Math.sin(a)>=0?14:-14),{size:12,color:P.green});
      S.draw.text(c,"sin",px+(Math.cos(a)>=0?18:-18),(py+cy)/2,{size:12,color:P.red});
      S.draw.text(c,"1",cx+r+8,cy+12,{size:12,color:P.grey}); S.draw.text(c,"1",cx-9,cy-r,{size:12,color:P.grey});
      var cs=Math.cos(a), sn=Math.sin(a); if(Math.abs(cs)<1e-12)cs=0; if(Math.abs(sn)<1e-12)sn=0;
      ro.set(0,radStr(d)+(Math.abs(d-Math.round(d/15)*15)<1e-9?" ("+F(a,3)+")":"")); ro.set(1,F(cs,3)); ro.set(2,F(sn,3));
      ro.set(3,(d%180===90)?"non définie":F(sn/cs,3)); ro.set(4,quad(d)); ro.set(5,F(cs*cs+sn*sn,3));
    });
  }
});

/* ---------- enroulement ---------- */
SFA.sim({
  id:"m4-c06-enroulement", ch:"c06", tag:"Classique",
  titre:"Enrouler la droite réelle autour du cercle",
  resume:"Un nombre t sur la droite devient un arc de longueur t sur le cercle : c'est l'angle en radians.",
  but:"Fais varier t. Sur le cercle de rayon 1, l'arc a pour longueur t. Quand fait-on un demi-tour ? Un tour complet ? Que se passe-t-il pour t négatif ?",
  aRetenir:"1 radian = angle qui intercepte un arc de longueur 1 sur le cercle de rayon 1. Un tour complet mesure 2π rad = 360°, donc π rad = 180° et 1 rad ≈ 57,3°. Le sens positif est antihoraire ; t et t + 2π désignent le même point.",
  piege:"π rad = 180°, pas 3,14°. Pour convertir : degrés = radians × 180/π. Ne confonds pas t = 2 (rad) avec un angle de 2°.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.95});
    var t=k.slider("Nombre t",-7,14,0.05,3.14,"");
    var ro=k.readouts(["t (rad)","Angle en degrés","Nombre de tours","t modulo 2π"]);
    k.draw(function(){
      var T=t.value, W=c.W,H=c.H, r=Math.min(W,H)*0.27, cx=W/2, cy=H*0.34; c.clear(); var ctx=c.ctx;
      ctx.strokeStyle="#e3e7ed"; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*PI); ctx.stroke();
      S.draw.line(c,cx-r*1.25,cy,cx+r*1.25,cy,P.grey,1); S.draw.line(c,cx,cy-r*1.25,cx,cy+r*1.25,P.grey,1);
      var turns=Math.abs(T)/(2*PI);
      for(var i=0;i<Math.ceil(turns);i++){ var rr=r*(1+0.05*i); arcAt(c,cx,cy,rr,0,(T>0?1:-1)*Math.min(Math.abs(T)-2*PI*i,2*PI),P.acc,2.5); }
      var px=cx+r*Math.cos(T), py=cy-r*Math.sin(T); S.draw.line(c,cx,cy,px,py,P.ink,1.5); S.draw.dot(c,px,py,7,P.red);
      /* droite réelle */
      var y=H*0.84, x0=18, x1=W-18, sc=(x1-x0)/21, X=function(v){return x0+(v+7)*sc;};
      S.draw.line(c,x0,y,x1,y,P.ink,2);
      for(var v=-7;v<=14;v++){ S.draw.line(c,X(v),y-4,X(v),y+4,P.ink,1); if(v%2===0) S.draw.text(c,String(v).replace("-","−"),X(v),y+16,{size:12,color:P.grey}); }
      [[PI,"π"],[2*PI,"2π"],[3*PI,"3π"],[4*PI,"4π"],[-PI,"−π"]].forEach(function(m){ S.draw.line(c,X(m[0]),y-9,X(m[0]),y+9,P.amber,2); S.draw.text(c,m[1],X(m[0]),y-18,{size:12,color:P.amber}); });
      S.draw.line(c,X(0),y,X(T),y,P.acc,5); S.draw.dot(c,X(T),y,7,P.red);
      S.draw.text(c,"0",X(0),y+16,{size:12,color:P.grey});
      ro.set(0,F(T,2)); ro.set(1,F(T*180/PI,1)+"°"); ro.set(2,F(T/(2*PI),2)+" tour"+(Math.abs(T/(2*PI))>=2?"s":"")); 
      var m=((T%(2*PI))+2*PI)%(2*PI); ro.set(3,F(m,2)+" ("+F(m*180/PI,1)+"°)");
    });
  }
});

/* ---------- angles associés ---------- */
SFA.sim({
  id:"m4-c06-angles-associes", ch:"c06", tag:"Symétries",
  titre:"Angles associés : π − x, π + x, −x, π/2 − x",
  resume:"Choisis un angle aigu x : ses quatre symétriques apparaissent avec leurs cos et sin.",
  but:"Fais varier x entre 0° et 90°. Les points orange, vert, violet et turquoise sont les images de x par des symétries. Compare leurs coordonnées à celles de x.",
  aRetenir:"cos(π − x) = −cos x et sin(π − x) = sin x ; cos(π + x) = −cos x et sin(π + x) = −sin x ; cos(−x) = cos x et sin(−x) = −sin x ; cos(π/2 − x) = sin x et sin(π/2 − x) = cos x.",
  piege:"sin(π − x) = + sin x (et pas −sin x) : les deux angles ont la même ordonnée. Et sin(π + x) = −sin x. Dessine toujours le point avant d'écrire le signe.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.82});
    var x=k.slider("Angle x",5,85,1,30,"°");
    var nt=k.note("","");
    k.draw(function(){
      var X=x.value*PI/180, W=c.W,H=c.H, r=Math.min(W,H)*0.38, cx=W/2, cy=H/2; c.clear(); var ctx=c.ctx;
      ctx.strokeStyle=P.acc; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*PI); ctx.stroke();
      S.draw.line(c,cx-r*1.2,cy,cx+r*1.2,cy,P.grey,1.2); S.draw.line(c,cx,cy-r*1.2,cx,cy+r*1.2,P.grey,1.2);
      var L=[["x",X,P.red,"x"],["π − x",PI-X,P.amber,"π − x"],["π + x",PI+X,P.violet,"π + x"],["−x",-X,P.green,"−x"],["π/2 − x",PI/2-X,P.teal,"π/2 − x"]];
      var rows="<table style='width:100%;border-collapse:collapse;font-size:13px'><tr style='text-align:left;color:#5f6b7a'><th>Angle</th><th>cos</th><th>sin</th><th>Lien avec x</th></tr>";
      var rel=["—","cos = −cos x ; sin = sin x","cos = −cos x ; sin = −sin x","cos = cos x ; sin = −sin x","cos = sin x ; sin = cos x"];
      L.forEach(function(p,i){ var px=cx+r*Math.cos(p[1]), py=cy-r*Math.sin(p[1]);
        S.draw.line(c,cx,cy,px,py,p[2],1.6,i?[4,3]:null); S.draw.dot(c,px,py,6,p[2]);
        S.draw.text(c,p[3],px+(Math.cos(p[1])>=0?16:-16)+(Math.abs(Math.cos(p[1]))<0.3?0:0),py+(Math.sin(p[1])>=0?-13:13),{size:12,color:p[2]});
        rows+="<tr><td style='color:"+p[2]+";font-weight:700'>"+p[0]+"</td><td>"+F(Math.cos(p[1]),3)+"</td><td>"+F(Math.sin(p[1]),3)+"</td><td>"+rel[i]+"</td></tr>"; });
      rows+="</table>";
      nt.set(rows,"");
    });
  }
});

/* ---------- sinusoïde ---------- */
SFA.sim({
  id:"m4-c06-sinusoide", ch:"c06", tag:"Animation",
  titre:"La sinusoïde naît du cercle",
  resume:"Un point tourne : sa hauteur trace la courbe de sin θ. La période est 2π.",
  but:"Lance l'animation ou bouge θ. À gauche, le point tourne sur le cercle ; à droite, sa hauteur (sin θ) est reportée en fonction de θ. Active cos pour comparer.",
  aRetenir:"La courbe de sin θ se répète tous les 2π (période 2π) ; ses valeurs restent entre −1 et 1. cos a la même forme, décalée de π/2 : cos θ = sin(θ + π/2).",
  piege:"Ne confonds pas l'angle (axe horizontal du graphe, en radians) et la valeur sin θ (axe vertical). La période se lit sur l'axe des angles : 2π ≈ 6,28.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.6});
    var th=k.slider("Angle θ",0,720,1,40,"°");
    var tc=k.toggle("Afficher aussi cos θ (vert)",false);
    var ro=k.readouts(["θ (rad)","sin θ","cos θ","Période"]);
    var lp=k.loop(function(dt){ var v=th.value+60*dt; if(v>720) v=0; th.set(v); k.redraw(); });
    k.button("Animer / pause",function(){ if(lp.running) lp.pause(); else lp.play(); },true);
    k.draw(function(){
      var d=th.value, a=d*PI/180, W=c.W,H=c.H, r=Math.min(W*0.15,H*0.32), cx=W*0.19, cy=H/2; c.clear(); var ctx=c.ctx;
      ctx.strokeStyle=P.acc; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*PI); ctx.stroke();
      S.draw.line(c,cx-r*1.25,cy,cx+r*1.25,cy,P.grey,1); S.draw.line(c,cx,cy-r*1.25,cx,cy+r*1.25,P.grey,1);
      var gx0=W*0.40, gx1=W-10, gs=(gx1-gx0)/(4*PI), Y=function(v){return cy-v*r;};
      S.draw.line(c,gx0,cy,gx1,cy,P.grey,1.2); S.draw.line(c,gx0,cy-r*1.25,gx0,cy+r*1.25,P.grey,1.2);
      [0,1,2,3,4].forEach(function(m){ var xx=gx0+m*PI*gs; S.draw.line(c,xx,cy-3,xx,cy+3,P.grey,1); S.draw.text(c,m===0?"0":(m===1?"π":m+"π"),xx,cy+r*1.25+10,{size:12,color:P.grey}); });
      S.draw.text(c,"1",gx0-8,Y(1),{size:12,color:P.grey}); S.draw.text(c,"−1",gx0-10,Y(-1),{size:12,color:P.grey});
      S.draw.line(c,gx0+2*PI*gs,Y(1.2),gx0+2*PI*gs,Y(-1.2),P.amber,1,[3,3]); S.draw.text(c,"période 2π",gx0+PI*gs*1.5,Y(-1.25)-2,{size:12,color:P.amber});
      function plot(fn,col){ ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=2.6; ctx.beginPath(); for(var u=0;u<=a+1e-9;u+=0.02){ var xx=gx0+u*gs, yy=Y(fn(u)); if(u===0) ctx.moveTo(xx,yy); else ctx.lineTo(xx,yy); } ctx.lineTo(gx0+a*gs,Y(fn(a))); ctx.stroke(); ctx.restore(); }
      if(tc.value) plot(Math.cos,P.green);
      plot(Math.sin,P.red);
      var px=cx+r*Math.cos(a), py=Y(Math.sin(a));
      S.draw.line(c,cx,cy,px,py,P.ink,1.6); S.draw.dot(c,px,py,6,P.ink);
      S.draw.line(c,px,py,gx0+a*gs,py,P.red,1.2,[4,3]); S.draw.dot(c,gx0+a*gs,py,6,P.red);
      if(tc.value){ S.draw.dot(c,gx0+a*gs,Y(Math.cos(a)),5,P.green); }
      ro.set(0,F(a,2)); ro.set(1,F(Math.sin(a),3)); ro.set(2,F(Math.cos(a),3)); ro.set(3,"2π ≈ 6,283");
    });
  }
});

/* ---------- manège ---------- */
SFA.sim({
  id:"m4-c06-manege", ch:"c06", tag:"Niche",
  titre:"Manège : vitesse angulaire, arc et hauteur",
  resume:"Une nacelle tourne à ω rad/s : angle θ = ωt, arc s = R·θ, hauteur h(t) = R(1 − cos θ).",
  but:"Règle la vitesse angulaire ω et le rayon R, puis lance le manège. Observe l'angle en radians, la longueur d'arc parcourue et la hauteur de la nacelle au cours du temps.",
  aRetenir:"Angle θ = ω·t (en rad). Longueur de l'arc s = R·θ (θ en radians !). Vitesse linéaire v = ω·R. Période T = 2π/ω. Hauteur au-dessus du point bas : h = R(1 − cos θ).",
  piege:"La formule s = R·θ n'est vraie qu'avec θ en radians. Avec θ en degrés, il faut d'abord convertir : s = R·θ·π/180.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:1.1});
    var w=k.slider("Vitesse angulaire ω",0.2,3,0.1,1,"rad/s");
    var R=k.slider("Rayon R",2,8,1,5,"m");
    var t=k.slider("Temps t",0,20,0.1,0,"s");
    var lp=k.loop(function(dt){ var v=t.value+dt; if(v>20) v=0; t.set(v); k.redraw(); });
    k.button("Lancer / pause",function(){ if(lp.running) lp.pause(); else lp.play(); },true);
    var ro=k.readouts(["θ = ωt","Arc s = R·θ","Vitesse v = ω·R","Période T = 2π/ω","Hauteur h"]);
    k.draw(function(){
      var Om=w.value,Rr=R.value,T=t.value, th=Om*T, W=c.W,H=c.H; c.clear(); var ctx=c.ctx;
      var rp=Math.min(W*.3,H*.2), cx=W/2, cy=H*.24;
      ctx.strokeStyle=P.acc; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(cx,cy,rp,0,2*PI); ctx.stroke();
      S.draw.line(c,cx-rp*1.3,cy+rp,cx+rp*1.3,cy+rp,P.grey,1.5);
      /* angle mesuré depuis le point bas, sens antihoraire */
      var a=th-PI/2; var px=cx+rp*Math.cos(a), py=cy-rp*Math.sin(a)*-1; /* sin(a) sens écran */
      px=cx+rp*Math.sin(th); py=cy+rp*Math.cos(th);
      var thm=th%(2*PI); ctx.save(); ctx.strokeStyle=P.amber; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(cx,cy,rp,PI/2,PI/2-thm,true); ctx.stroke(); ctx.restore();
      S.draw.line(c,cx,cy,px,py,P.ink,1.5); S.draw.dot(c,px,py,8,P.red);
      S.draw.text(c,"point bas",cx,cy+rp+14,{size:12,color:P.grey});
      /* graphe h(t) */
      var ax=S.draw.axes(c,{x0:0,x1:20,y0:0,y1:2*Rr*1.1,xl:"t (s)",yl:"h (m)",t:H*.5,b:30,stepX:5});
      S.draw.fn(c,ax,function(u){return Rr*(1-Math.cos(Om*u));},P.acc,2.4);
      var h=Rr*(1-Math.cos(th)); S.draw.dot(c,ax.X(T),ax.Y(h),7,P.red);
      ro.set(0,F(th,2)+" rad"); ro.set(1,F(Rr*th,1)+" m"); ro.set(2,F(Om*Rr,2)+" m/s"); ro.set(3,F(2*PI/Om,2)+" s"); ro.set(4,F(h,2)+" m");
    });
  }
});
})();
