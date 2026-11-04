(function(){
var P = SFA.draw.palette, F = SFA.fmt, PI=Math.PI, D2R=PI/180;
function comp(x,y){ return "("+F(x,2)+" ; "+F(y,2)+")"; }
function snap(v,lo,hi){ return Math.max(lo,Math.min(hi,Math.round(v))); }

SFA.sim({
  id:"m4-c08-somme", ch:"c08", tag:"Classique",
  titre:"Somme de deux vecteurs",
  resume:"Déplace les pointes de u et v : la somme se construit en bout à bout ou par le parallélogramme.",
  but:"Fais glisser la pointe de u (rouge) ou de v (vert). Observe la somme u + v, ses composantes (les composantes s'additionnent) et compare les normes ‖u + v‖ et ‖u‖ + ‖v‖.",
  aRetenir:"Si u(a ; b) et v(c ; d), alors u + v a pour composantes (a + c ; b + d). En bout à bout : on place l'origine de v à la pointe de u ; la somme va de l'origine de u à la pointe de v.",
  piege:"Les normes ne s'additionnent pas : ‖u + v‖ ≤ ‖u‖ + ‖v‖, avec égalité seulement si u et v ont la même direction et le même sens.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85});
    var u={x:3,y:1}, v={x:1,y:3}, sel=-1, ax=null;
    var mode=k.seg("Construction",[["par","Parallélogramme"],["bab","Bout à bout"]],"par");
    var ro=k.readouts(["u","v","u + v","‖u‖ ; ‖v‖","‖u + v‖","‖u‖ + ‖v‖"]);
    c.pointer(function(t,p){ if(!ax)return;
      if(t==="down"){ var du=Math.hypot(ax.X(u.x)-p.x,ax.Y(u.y)-p.y), dv=Math.hypot(ax.X(v.x)-p.x,ax.Y(v.y)-p.y); sel=du<=dv?0:1; }
      if((t==="down"||t==="drag")&&sel>=0){ var q=sel===0?u:v; q.x=snap(ax.ix(p.x),-5,5); q.y=snap(ax.iy(p.y),-5,5); k.redraw(); }
      if(t==="up") sel=-1; });
    k.draw(function(){
      c.clear(); ax=S.draw.axes(c,{x0:-10,x1:10,y0:-10,y1:10,stepX:2,stepY:2,equal:true});
      var O=[ax.X(0),ax.Y(0)], U=[ax.X(u.x),ax.Y(u.y)], V=[ax.X(v.x),ax.Y(v.y)], W=[ax.X(u.x+v.x),ax.Y(u.y+v.y)];
      if(mode.value==="par"){ S.draw.line(c,U[0],U[1],W[0],W[1],P.green,1.5,[5,4]); S.draw.line(c,V[0],V[1],W[0],W[1],P.red,1.5,[5,4]); }
      else S.draw.arrow(c,U[0],U[1],W[0],W[1],P.green,2.5);
      S.draw.arrow(c,O[0],O[1],U[0],U[1],P.red,3); S.draw.arrow(c,O[0],O[1],V[0],V[1],P.green,3);
      S.draw.arrow(c,O[0],O[1],W[0],W[1],P.acc,4);
      S.draw.text(c,"u",(O[0]+U[0])/2-10,(O[1]+U[1])/2-10,{size:14,color:P.red}); S.draw.text(c,"v",(O[0]+V[0])/2+10,(O[1]+V[1])/2-10,{size:14,color:P.green}); S.draw.text(c,"u + v",W[0]+4,W[1]-12,{size:13,color:P.acc});
      S.draw.dot(c,U[0],U[1],6,P.red); S.draw.dot(c,V[0],V[1],6,P.green);
      var nu=Math.hypot(u.x,u.y), nv=Math.hypot(v.x,v.y), ns=Math.hypot(u.x+v.x,u.y+v.y);
      ro.set(0,comp(u.x,u.y)); ro.set(1,comp(v.x,v.y)); ro.set(2,comp(u.x+v.x,u.y+v.y)); ro.set(3,F(nu,2)+" ; "+F(nv,2)); ro.set(4,F(ns,2)); ro.set(5,F(nu+nv,2));
    });
  }
});

/* ---------- translation ---------- */
SFA.sim({
  id:"m4-c08-translation", ch:"c08", tag:"Classique",
  titre:"Translation de vecteur t",
  resume:"Un triangle glisse : chaque point est déplacé du même vecteur.",
  but:"Choisis les composantes du vecteur t. Le triangle ABC est translaté en A'B'C'. Vérifie que A' = A + t pour chaque sommet et que les côtés restent parallèles et de même longueur.",
  aRetenir:"La translation de vecteur t(p ; q) envoie M(x ; y) sur M'(x + p ; y + q), c'est-à-dire MM' = t. Elle conserve les longueurs, les angles et le parallélisme : l'image est un triangle identique.",
  piege:"Ne confonds pas le vecteur MM' = (xM' − xM ; yM' − yM) avec (xM − xM' ; …) : la pointe moins l'origine (arrivée − départ).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.9});
    var p=k.slider("p (déplacement horizontal)",-5,5,1,4,"");
    var q=k.slider("q (déplacement vertical)",-5,5,1,3,"");
    var ro=k.readouts(["Vecteur t","A → A'","B → B'","C → C'","Longueur ‖t‖"]);
    k.draw(function(){
      var tp=p.value,tq=q.value; c.clear();
      var ax=S.draw.axes(c,{x0:-10,x1:10,y0:-10,y1:10,stepX:2,stepY:2,equal:true}), ctx=c.ctx;
      var T=[["A",-4,-2],["B",-1,1],["C",-3,-4]];
      function tri(pts,col,fill){ ctx.save(); ctx.beginPath(); pts.forEach(function(q2,i){ var X=ax.X(q2[0]),Y=ax.Y(q2[1]); if(i)ctx.lineTo(X,Y); else ctx.moveTo(X,Y); }); ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); ctx.strokeStyle=col; ctx.lineWidth=2.5; ctx.stroke(); ctx.restore(); }
      var I=T.map(function(m){return [m[1]+tp,m[2]+tq];});
      tri(T.map(function(m){return [m[1],m[2]];}),P.acc,"rgba(30,63,143,.15)");
      tri(I,P.green,"rgba(46,107,85,.15)");
      T.forEach(function(m,i){ if(tp!==0||tq!==0) S.draw.arrow(c,ax.X(m[1]),ax.Y(m[2]),ax.X(I[i][0]),ax.Y(I[i][1]),P.amber,1.8);
        S.draw.dot(c,ax.X(m[1]),ax.Y(m[2]),5,P.acc); S.draw.dot(c,ax.X(I[i][0]),ax.Y(I[i][1]),5,P.green);
        S.draw.text(c,m[0],ax.X(m[1])-12,ax.Y(m[2])+12,{size:13,color:P.acc}); S.draw.text(c,m[0]+"'",ax.X(I[i][0])+14,ax.Y(I[i][1])-10,{size:13,color:P.green}); });
      ro.set(0,comp(tp,tq));
      for(var i=0;i<3;i++) ro.set(i+1,"("+F(T[i][1])+" ; "+F(T[i][2])+") → ("+F(I[i][0])+" ; "+F(I[i][1])+")");
      ro.set(4,F(Math.hypot(tp,tq),2));
    });
  }
});

/* ---------- Chasles ---------- */
SFA.sim({
  id:"m4-c08-chasles", ch:"c08", tag:"Manipuler",
  titre:"La relation de Chasles : AB + BC + CD = AD",
  resume:"Quatre points mobiles : la chaîne de vecteurs aboutit toujours au vecteur direct AD.",
  but:"Déplace A, B, C, D. Le trajet A → B → C → D donne la même somme que le saut direct A → D, quelle que soit la forme du chemin. Vérifie avec les composantes.",
  aRetenir:"Relation de Chasles : AB + BC = AC, et plus généralement AB + BC + CD = AD. Les composantes de AB sont (xB − xA ; yB − yA) : arrivée moins départ. BA = −AB.",
  piege:"Les points « intermédiaires » doivent s'enchaîner : la fin d'un vecteur est le début du suivant. AB + CB n'est pas égal à AC : il faut écrire AB + BC.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85});
    var pts=[{x:-5,y:-2},{x:-1,y:4},{x:3,y:2},{x:5,y:-4}], sel=-1, ax=null, nm=["A","B","C","D"];
    k.button("Remettre",function(){ pts=[{x:-5,y:-2},{x:-1,y:4},{x:3,y:2},{x:5,y:-4}]; });
    var ro=k.readouts(["AB","BC","CD","AB + BC + CD","AD","BA"]);
    c.pointer(function(t,p){ if(!ax)return;
      if(t==="down"){ var b=-1,bd=900; pts.forEach(function(q,i){ var d=Math.pow(ax.X(q.x)-p.x,2)+Math.pow(ax.Y(q.y)-p.y,2); if(d<bd){bd=d;b=i;} }); sel=b; }
      if((t==="down"||t==="drag")&&sel>=0){ pts[sel].x=snap(ax.ix(p.x),-9,9); pts[sel].y=snap(ax.iy(p.y),-9,9); k.redraw(); }
      if(t==="up") sel=-1; });
    k.draw(function(){
      c.clear(); ax=S.draw.axes(c,{x0:-10,x1:10,y0:-10,y1:10,stepX:2,stepY:2,equal:true});
      var cols=[P.red,P.green,P.amber];
      for(var i=0;i<3;i++){ var a=pts[i],b=pts[i+1]; if(a.x!==b.x||a.y!==b.y) S.draw.arrow(c,ax.X(a.x),ax.Y(a.y),ax.X(b.x),ax.Y(b.y),cols[i],2.8); }
      var A=pts[0],D=pts[3]; if(A.x!==D.x||A.y!==D.y) S.draw.arrow(c,ax.X(A.x),ax.Y(A.y),ax.X(D.x),ax.Y(D.y),P.violet,4);
      pts.forEach(function(q,i){ S.draw.dot(c,ax.X(q.x),ax.Y(q.y),7,P.ink); S.draw.text(c,nm[i],ax.X(q.x),ax.Y(q.y)-16,{size:14,color:P.ink}); });
      var v=function(a,b){return [b.x-a.x,b.y-a.y];}, ab=v(pts[0],pts[1]), bc=v(pts[1],pts[2]), cd=v(pts[2],pts[3]), ad=v(pts[0],pts[3]);
      ro.set(0,comp(ab[0],ab[1])); ro.set(1,comp(bc[0],bc[1])); ro.set(2,comp(cd[0],cd[1]));
      ro.set(3,comp(ab[0]+bc[0]+cd[0],ab[1]+bc[1]+cd[1])); ro.set(4,comp(ad[0],ad[1])); ro.set(5,comp(-ab[0],-ab[1]));
    });
  }
});

/* ---------- colinéarité ---------- */
SFA.sim({
  id:"m4-c08-colinearite", ch:"c08", tag:"Défi",
  titre:"Vecteurs colinéaires : le déterminant s'annule",
  resume:"Deux vecteurs sont colinéaires quand a·d − b·c = 0 : le parallélogramme devient plat.",
  but:"Règle u(a ; b) et v(c ; d). Observe l'aire (en couleur) du parallélogramme construit sur u et v. Défi : choisis v colinéaire à u, sans que v soit égal à u.",
  aRetenir:"u(a ; b) et v(c ; d) sont colinéaires ⇔ a·d − b·c = 0 ⇔ v = k·u (ou u = 0). L'aire du parallélogramme vaut |a·d − b·c| : elle est nulle quand les vecteurs sont sur la même droite.",
  piege:"Colinéaires ne veut pas dire égaux : v = 2u ou v = −u sont colinéaires à u mais différents. Le sens peut même être opposé (k < 0).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85});
    var a=k.slider("a (composante x de u)",-5,5,1,2,"");
    var b=k.slider("b (composante y de u)",-5,5,1,1,"");
    var cx=k.slider("c (composante x de v)",-5,5,1,-1,"");
    var d=k.slider("d (composante y de v)",-5,5,1,3,"");
    var ro=k.readouts(["u","v","Déterminant a·d − b·c","Colinéaires ?"]);
    var nt=k.note("","");
    k.draw(function(){
      var A=a.value,B=b.value,C=cx.value,D=d.value; c.clear();
      var ax=S.draw.axes(c,{x0:-10,x1:10,y0:-10,y1:10,stepX:2,stepY:2,equal:true}), ctx=c.ctx;
      var det=A*D-B*C;
      ctx.save(); ctx.beginPath(); ctx.moveTo(ax.X(0),ax.Y(0)); ctx.lineTo(ax.X(A),ax.Y(B)); ctx.lineTo(ax.X(A+C),ax.Y(B+D)); ctx.lineTo(ax.X(C),ax.Y(D)); ctx.closePath(); ctx.fillStyle=det===0?"rgba(180,35,24,.15)":"rgba(30,63,143,.15)"; ctx.fill(); ctx.restore();
      if(A!==0||B!==0) S.draw.arrow(c,ax.X(0),ax.Y(0),ax.X(A),ax.Y(B),P.red,3.2);
      if(C!==0||D!==0) S.draw.arrow(c,ax.X(0),ax.Y(0),ax.X(C),ax.Y(D),P.green,3.2);
      S.draw.text(c,"u",ax.X(A)+(A>=0?10:-10),ax.Y(B)-10,{size:14,color:P.red}); S.draw.text(c,"v",ax.X(C)+(C>=0?10:-10),ax.Y(D)-10,{size:14,color:P.green});
      ro.set(0,comp(A,B)); ro.set(1,comp(C,D)); ro.set(2,F(A,0)+"×"+F(D,0).replace("−","(−")+(D<0?")":"")+" − "+F(B,0).replace("−","(−")+(B<0?")":"")+"×"+(C<0?"(":"")+F(C,0)+(C<0?")":"")+" = "+F(det,0)); ro.set(3,det===0?"oui":"non");
      var uz=(A===0&&B===0), vz=(C===0&&D===0), msg, kind="";
      if(det===0){
        if(uz||vz) msg="Le vecteur nul est colinéaire à tout vecteur.";
        else { var kk=A!==0?C/A:D/B; msg="Colinéaires : v = "+F(kk,2)+"·u"+(kk===1?" (v = u : égaux, essaie un autre v !)":(kk<0?" (sens opposé)":"")); kind=kk===1?"warn":"ok"; }
      } else msg="Déterminant ≠ 0 : u et v ne sont pas colinéaires, le parallélogramme a une aire de "+F(Math.abs(det),0)+".";
      nt.set(msg,kind);
    });
  }
});

/* ---------- navigation ---------- */
SFA.sim({
  id:"m4-c08-navigation", ch:"c08", tag:"Niche",
  titre:"Bateau et courant : vitesse propre + courant = vitesse sol",
  resume:"Règle le cap, la vitesse et le courant : la route réelle est la somme de deux vecteurs.",
  but:"Un bateau avance à vitesse propre vₚ dans la direction de son cap. Le courant le pousse. Défi : avec un courant vers l'est, règle le cap pour que la route réelle soit plein nord (0°) malgré la dérive.",
  aRetenir:"Vitesse par rapport au sol = vitesse propre + vitesse du courant (somme de vecteurs). Pour un cap θ mesuré depuis le nord vers l'est : composantes (v·sin θ ; v·cos θ). La route est la direction de la vitesse sol ; la dérive est l'écart entre route et cap.",
  piege:"Le bateau ne va pas dans la direction où il pointe : le courant le déporte. On ne soustrait ni n'additionne les normes : on additionne les composantes.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85});
    var vp=k.slider("Vitesse propre vₚ",4,12,1,8,"km/h");
    var cap=k.slider("Cap (depuis le nord, sens horaire)",0,359,1,0,"°");
    var vc=k.slider("Vitesse du courant",0,8,1,3,"km/h");
    var dc=k.slider("Direction du courant (vers…)",0,355,5,90,"°");
    var ro=k.readouts(["Vitesse propre","Courant","Vitesse sol","Route (depuis le nord)","Dérive"]);
    var nt=k.note("","");
    function vec(n,a){ return [n*Math.sin(a*D2R), n*Math.cos(a*D2R)]; }
    k.draw(function(){
      var V=vec(vp.value,cap.value), Cc=vec(vc.value,dc.value), G=[V[0]+Cc[0],V[1]+Cc[1]], ng=Math.hypot(G[0],G[1]);
      c.clear(); var W=c.W,H=c.H, sc=(Math.min(W,H)/2-18)/21, ox=W/2, oy=H/2;
      var X=function(x){return ox+x*sc;}, Y=function(y){return oy-y*sc;};
      S.draw.line(c,X(-21),Y(0),X(21),Y(0),P.light,1); S.draw.line(c,X(0),Y(-21),X(0),Y(21),P.light,1);
      S.draw.text(c,"N",X(0)+10,Y(20),{size:13,color:P.grey}); S.draw.text(c,"E",X(20),Y(0)-10,{size:13,color:P.grey});
      S.draw.arrow(c,X(0),Y(0),X(V[0]),Y(V[1]),P.red,3);
      S.draw.arrow(c,X(V[0]),Y(V[1]),X(G[0]),Y(G[1]),P.teal,3);
      if(ng>0.01) S.draw.arrow(c,X(0),Y(0),X(G[0]),Y(G[1]),P.acc,4.5);
      S.draw.dot(c,X(0),Y(0),5,P.ink);
      S.draw.text(c,"cap",X(V[0]/2)-18,Y(V[1]/2),{size:12,color:P.red}); S.draw.text(c,"courant",X(V[0]+Cc[0]/2)+(Cc[0]>=0?24:-24),Y(V[1]+Cc[1]/2)-8,{size:12,color:P.teal});
      var route=ng<0.01?NaN:((Math.atan2(G[0],G[1])/D2R)+360)%360, der=isNaN(route)?NaN:(((route-cap.value+540)%360)-180);
      ro.set(0,F(vp.value,0)+" km/h, cap "+F(cap.value,0)+"°"); ro.set(1,F(vc.value,0)+" km/h vers "+F(dc.value,0)+"°");
      ro.set(2,F(ng,2)+" km/h"); ro.set(3,isNaN(route)?"—":F(route,1)+"°"); ro.set(4,isNaN(der)?"—":F(der,1)+"°");
      var north = !isNaN(route)&&(route<1.5||route>358.5);
      nt.set(isNaN(route)?"Vitesse sol nulle : le bateau fait du sur-place.":(north?(vc.value===0?"Pas de courant : la route est égale au cap, plein nord.":"Route plein nord ! Le cap compense le courant : la composante vers l'est de la vitesse sol est nulle ("+F(G[0],2)+" km/h)."):"Pour aller plein nord, la composante vers l'est de la vitesse sol doit être nulle : vₚ·sin θ + (courant vers l'est) = 0."+(vc.value>vp.value&&(dc.value===90||dc.value===270)?" Ici le courant est plus fort que la vitesse propre : aucun cap ne permet d'aller plein nord.":"")),north?"ok":"");
    });
  }
});
})();
