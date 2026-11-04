/* Chapitre 5 : droites et plans dans l'espace (petit moteur 3D orthographique commun aux 4 simulations) */
(function(){
var L=5;
function V3(c,S){
  var v={yaw:-0.6,pitch:0.45,c:c,S:S};
  v.rot=function(p){ var cy=Math.cos(v.yaw), sy=Math.sin(v.yaw), x1=p[0]*cy-p[1]*sy, y1=p[0]*sy+p[1]*cy;
    return [x1, p[2]*Math.cos(v.pitch)+y1*Math.sin(v.pitch)]; };
  v.sc=function(){ return Math.min(c.W,c.H)/(2*L*1.25); };
  v.P=function(p){ var r=v.rot(p), s=v.sc(); return {x:c.W/2+r[0]*s, y:c.H/2-r[1]*s}; };
  v.line=function(p,q,col,w,dash){ var a=v.P(p), b=v.P(q); v.S.draw.line(c,a.x,a.y,b.x,b.y,col,w,dash); };
  v.cube=function(){
    var pts=[]; for(var i=0;i<8;i++) pts.push([(i&1?L:-L),(i&2?L:-L),(i&4?L:-L)]);
    for(i=0;i<8;i++) for(var j=i+1;j<8;j++){ var d=(i^j); if(d===1||d===2||d===4) v.line(pts[i],pts[j],"#d9dee7",1); }
    var ax=[[[ -L,0,0],[L,0,0],"x","#b42318"],[[0,-L,0],[0,L,0],"y","#2e6b55"],[[0,0,-L],[0,0,L],"z","#1e3f8f"]];
    ax.forEach(function(a){ v.line(a[0],a[1],a[3],1.6); var e=v.P(a[1]); v.S.draw.text(c,a[2],e.x+9,e.y-9,{color:a[3],size:13}); });
  };
  v.plane=function(n,d,col){
    var pts=[], ed=[[0,1,2],[1,0,2],[2,0,1]];
    ed.forEach(function(e){ var i=e[0],j=e[1],k2=e[2]; if(Math.abs(n[i])<1e-9) return;
      [-L,L].forEach(function(a){ [-L,L].forEach(function(b){ var p=[0,0,0]; p[j]=a; p[k2]=b; p[i]=(d-n[j]*a-n[k2]*b)/n[i]; if(Math.abs(p[i])<=L+1e-9) pts.push(p); }); }); });
    var u=[]; pts.forEach(function(p){ if(!u.some(function(q){return Math.abs(q[0]-p[0])+Math.abs(q[1]-p[1])+Math.abs(q[2]-p[2])<1e-6;})) u.push(p); });
    if(u.length<3) return;
    var ctr=[0,0,0]; u.forEach(function(p){ctr[0]+=p[0]/u.length;ctr[1]+=p[1]/u.length;ctr[2]+=p[2]/u.length;});
    var nn=Math.hypot(n[0],n[1],n[2]), nz=[n[0]/nn,n[1]/nn,n[2]/nn];
    var a=Math.abs(nz[0])<0.9?[1,0,0]:[0,1,0];
    var e1=[nz[1]*a[2]-nz[2]*a[1], nz[2]*a[0]-nz[0]*a[2], nz[0]*a[1]-nz[1]*a[0]], l1=Math.hypot(e1[0],e1[1],e1[2]); e1=[e1[0]/l1,e1[1]/l1,e1[2]/l1];
    var e2=[nz[1]*e1[2]-nz[2]*e1[1], nz[2]*e1[0]-nz[0]*e1[2], nz[0]*e1[1]-nz[1]*e1[0]];
    u.sort(function(p,q){ function ang(r){var x=[r[0]-ctr[0],r[1]-ctr[1],r[2]-ctr[2]]; return Math.atan2(x[0]*e2[0]+x[1]*e2[1]+x[2]*e2[2], x[0]*e1[0]+x[1]*e1[1]+x[2]*e1[2]);} return ang(p)-ang(q); });
    var ctx=c.ctx; ctx.save(); ctx.beginPath();
    u.forEach(function(p,i){ var q=v.P(p); if(i===0) ctx.moveTo(q.x,q.y); else ctx.lineTo(q.x,q.y); });
    ctx.closePath(); ctx.fillStyle=col[0]; ctx.fill(); ctx.strokeStyle=col[1]; ctx.lineWidth=1.6; ctx.stroke(); ctx.restore();
  };
  /* droite P + t·u coupée par le cube */
  v.seg=function(P,u,col,w,dash){
    var t0=-1e9,t1=1e9; for(var i=0;i<3;i++){ if(Math.abs(u[i])<1e-9){ if(Math.abs(P[i])>L) return; } else { var a=(-L-P[i])/u[i], b=(L-P[i])/u[i]; if(a>b){var tt=a;a=b;b=tt;} t0=Math.max(t0,a); t1=Math.min(t1,b); } }
    if(t0>=t1) return;
    v.line([P[0]+t0*u[0],P[1]+t0*u[1],P[2]+t0*u[2]],[P[0]+t1*u[0],P[1]+t1*u[1],P[2]+t1*u[2]],col,w,dash);
  };
  v.dot=function(p,r,col){ var q=v.P(p); v.S.draw.dot(c,q.x,q.y,r,col); };
  v.arrow=function(p,q,col,w){ var a=v.P(p), b=v.P(q); v.S.draw.arrow(c,a.x,a.y,b.x,b.y,col,w); };
  v.drag=function(k){ var last=null; c.pointer(function(type,p){ if(type==="down") last=p; else if(type==="drag"&&last){ v.yaw+=(p.x-last.x)*0.012; v.pitch=Math.max(-1.4,Math.min(1.4,v.pitch+(p.y-last.y)*0.012)); last=p; k.redraw(); } else if(type==="up") last=null; }); };
  return v;
}
function eq(S,a,b,c,d){
  var s="", t=[[a,"x"],[b,"y"],[c,"z"]];
  t.forEach(function(p){ if(p[0]===0) return; var ab=Math.abs(p[0]), co=ab===1?"":S.fmt(ab,0);
    if(s==="") s=(p[0]<0?"−":"")+co+p[1]; else s+=(p[0]<0?" − ":" + ")+co+p[1]; });
  if(s==="") s="0";
  return s+" = "+S.fmt(d,0);
}
function lin(S,A,dd,t){ // coordonnée = A + dd·t
  if(dd===0) return S.fmt(A,0);
  var co=Math.abs(dd)===1?"":S.fmt(Math.abs(dd),0), term=co+"t";
  if(A===0) return (dd<0?"−":"")+term;
  return S.fmt(A,0)+(dd<0?" − ":" + ")+term;
}
function cross(a,b){ return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
function dot(a,b){ return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }

SFA.sim({
  id:"m6-c05-plan-normal", ch:"c05", tag:"Classique · 3D",
  titre:"Un plan, son équation et son vecteur normal",
  resume:"Règle a, b, c, d : le plan tourne, le vecteur normal (a ; b ; c) reste perpendiculaire.",
  but:"Fais varier les coefficients du plan ax + by + cz = d. Glisse sur le dessin pour tourner la vue. La flèche est le vecteur normal n = (a ; b ; c).",
  aRetenir:"Le plan d'équation ax + by + cz = d a pour vecteur normal n = (a ; b ; c) : n est perpendiculaire à tous les vecteurs du plan. Changer d translate le plan sans le tourner. 6 h : la distance de l'origine au plan vaut |d| / ‖n‖, c'est le rayon de la sphère centrée en O tangente au plan.",
  piege:"Le vecteur normal n'est pas un vecteur directeur du plan, c'est le contraire : il est perpendiculaire au plan. Et ax + by = c, sans z, est un plan (parallèle à l'axe z) et non une droite dans l'espace.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85}), v=V3(c,S);
    var a=k.slider("a",-3,3,1,1,"",null), b=k.slider("b",-3,3,1,2,"",null), cc=k.slider("c",-3,3,1,1,"",null), d=k.slider("d",-6,6,1,3,"",null);
    var sp=k.toggle("Montrer la sphère tangente centrée en O (6 h)",false);
    var ro=k.readouts(["Équation","Vecteur normal","Distance de O au plan (6 h)","Pied H de la perpendiculaire"]);
    var nt=k.note("Glisse sur le dessin pour tourner la vue.","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, n=[a.value,b.value,cc.value], D=d.value, nn=Math.hypot(n[0],n[1],n[2]);
      v.cube();
      if(nn===0){ nt.set(D===0?"a = b = c = 0 et d = 0 : 0 = 0 est vrai pour tout point, ce n'est pas un plan.":"a = b = c = 0 : l'équation 0 = d n'a aucune solution, ce n'est pas un plan.","warn"); ro.set(0,"—"); ro.set(1,"(0 ; 0 ; 0)"); ro.set(2,"—"); ro.set(3,"—"); return; }
      v.plane(n,D,["rgba(30,63,143,.18)","#1e3f8f"]);
      var H=[D*n[0]/(nn*nn),D*n[1]/(nn*nn),D*n[2]/(nn*nn)], dist=Math.abs(D)/nn;
      if(sp.value && dist>0){ var o=v.P([0,0,0]), r=dist*v.sc(); var ctx=c.ctx; ctx.save(); ctx.strokeStyle=P.teal; ctx.lineWidth=1.8; ctx.setLineDash([5,4]); ctx.beginPath(); ctx.arc(o.x,o.y,r,0,2*Math.PI); ctx.stroke(); ctx.restore(); }
      v.dot([0,0,0],4,P.ink);
      v.line([0,0,0],H,P.violet,1.6,[4,3]); v.dot(H,5,P.violet);
      var s=2.2/nn; v.arrow(H,[H[0]+n[0]*s,H[1]+n[1]*s,H[2]+n[2]*s],P.red,2.6);
      S.draw.text(c,"n",v.P([H[0]+n[0]*s,H[1]+n[1]*s,H[2]+n[2]*s]).x+10,v.P([H[0]+n[0]*s,H[1]+n[1]*s,H[2]+n[2]*s]).y-8,{color:P.red,size:14});
      ro.set(0,eq(S,n[0],n[1],n[2],D)); ro.set(1,"("+S.fmt(n[0],0)+" ; "+S.fmt(n[1],0)+" ; "+S.fmt(n[2],0)+")");
      ro.set(2,S.fmt(dist,3)+" = "+S.fmt(Math.abs(D),0)+" / "+S.fmt(nn,3)); ro.set(3,"("+S.fmt(H[0],2)+" ; "+S.fmt(H[1],2)+" ; "+S.fmt(H[2],2)+")");
      if(n[0]===0||n[1]===0||n[2]===0) nt.set("Un coefficient nul : le plan est parallèle à l'axe correspondant.","warn");
      else nt.set("Pour vérifier un point (x ; y ; z) : remplace-le dans "+eq(S,n[0],n[1],n[2],D)+".","ok");
      if(Math.abs(D)>0&&nn>0&&dist*1>L) nt.set("Le plan est hors du cube dessiné (|d|/‖n‖ &gt; 5) : on ne le voit plus.","warn");
    });
    v.drag(k);
  }
});

SFA.sim({
  id:"m6-c05-droite-deux-points", ch:"c05", tag:"Classique · 3D",
  titre:"La droite AB : équations paramétriques et cartésiennes",
  resume:"Déplace A et B : le vecteur directeur AB et les équations de la droite se mettent à jour.",
  but:"Choisis les coordonnées de A et B, puis glisse t pour déplacer le point M(t) sur la droite. Tourne la vue en glissant sur le dessin.",
  aRetenir:"La droite AB a pour vecteur directeur AB = (x<sub>B</sub> − x<sub>A</sub> ; y<sub>B</sub> − y<sub>A</sub> ; z<sub>B</sub> − z<sub>A</sub>) et pour équations paramétriques x = x<sub>A</sub> + t·d<sub>x</sub>, y = y<sub>A</sub> + t·d<sub>y</sub>, z = z<sub>A</sub> + t·d<sub>z</sub>. Pour t = 0 on est en A, pour t = 1 en B. Dans l'espace, une droite a besoin de <i>deux</i> équations cartésiennes (intersection de deux plans).",
  piege:"Une droite de l'espace n'a pas d'équation du type y = mx + p. Si une coordonnée du vecteur directeur est nulle, on ne peut pas écrire le quotient correspondant : cette coordonnée reste constante.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.8}), v=V3(c,S);
    var xa=k.slider("x de A",-4,4,1,-2,"",null), ya=k.slider("y de A",-4,4,1,-1,"",null), za=k.slider("z de A",-4,4,1,0,"",null);
    var xb=k.slider("x de B",-4,4,1,2,"",null), yb=k.slider("y de B",-4,4,1,2,"",null), zb=k.slider("z de B",-4,4,1,3,"",null);
    var t=k.slider("Paramètre t du point M",-1,2,0.1,0.5,"",null);
    var ro=k.readouts(["Vecteur directeur AB","M(t)","Paramétriques","Cartésiennes"]);
    var nt=k.note("","warn");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, A=[xa.value,ya.value,za.value], B=[xb.value,yb.value,zb.value], u=[B[0]-A[0],B[1]-A[1],B[2]-A[2]];
      v.cube();
      if(u[0]===0&&u[1]===0&&u[2]===0){ v.dot(A,6,P.red); ro.set(0,"(0 ; 0 ; 0)"); ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); nt.set("A et B sont confondus : il n'y a pas de droite AB. Déplace B.","warn"); return; }
      v.seg(A,u,P.grey,1.5,[6,4]); v.line(A,B,P.acc,3.2);
      v.dot(A,6,P.acc); v.dot(B,6,P.acc);
      var pa=v.P(A), pb=v.P(B); S.draw.text(c,"A",pa.x-12,pa.y-10,{color:P.acc}); S.draw.text(c,"B",pb.x+12,pb.y-10,{color:P.acc});
      var tt=t.value, M=[A[0]+tt*u[0],A[1]+tt*u[1],A[2]+tt*u[2]]; v.dot(M,6,P.red);
      var pm=v.P(M); S.draw.text(c,"M",pm.x+12,pm.y+12,{color:P.red});
      ro.set(0,"("+u.map(function(z){return S.fmt(z,0);}).join(" ; ")+")"); ro.set(1,"("+M.map(function(z){return S.fmt(z,2);}).join(" ; ")+")");
      ro.set(2,"x = "+lin(S,A[0],u[0])+" ; y = "+lin(S,A[1],u[1])+" ; z = "+lin(S,A[2],u[2]));
      var parts=[], fixed=[], nm=["x","y","z"];
      for(var i=0;i<3;i++){ if(u[i]===0) fixed.push(nm[i]+" = "+S.fmt(A[i],0)); else parts.push("("+nm[i]+(A[i]===0?"":(A[i]<0?" + ":" − ")+S.fmt(Math.abs(A[i]),0))+") / "+(u[i]<0?"("+S.fmt(u[i],0)+")":S.fmt(u[i],0))); }
      ro.set(3,parts.join(" = ")+(fixed.length?(parts.length?" ; ":"")+fixed.join(" ; "):""));
      nt.set(u[0]===0||u[1]===0||u[2]===0?"Une coordonnée de AB est nulle : cette coordonnée est constante sur toute la droite (le plan correspondant la contient).":"Vérifie : pour t = 1 on obtient bien B = ("+B.map(function(z){return S.fmt(z,0);}).join(" ; ")+").", u[0]===0||u[1]===0||u[2]===0?"warn":"ok");
    });
    v.drag(k);
  }
});

SFA.sim({
  id:"m6-c05-droite-plan", ch:"c05", tag:"Intersection",
  titre:"Droite et plan : un point, aucun point, ou toute la droite",
  resume:"Oriente la droite et décale-la : tu obtiens les trois positions relatives possibles.",
  but:"Le plan est choisi dans la liste. La droite passe par Q + s·n (Q est dans le plan) avec la direction u que tu règles. Défi : obtiens une droite parallèle au plan sans y être contenue, puis une droite contenue dans le plan.",
  aRetenir:"On remplace x, y, z de la droite dans l'équation du plan : on obtient (n·u)·t = d − n·P₀. Si n·u ≠ 0 : un seul point. Si n·u = 0 : la droite est parallèle au plan, et elle y est contenue si et seulement si d − n·P₀ = 0, sinon il n'y a aucun point commun.",
  piege:"Une droite parallèle au plan n'a aucune intersection... sauf si elle est <i>dans</i> le plan : alors toute la droite est commune. Il faut tester le point de départ avant de conclure.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85}), v=V3(c,S);
    var pl=k.select("Plan",[["0","x + y + z = 3"],["1","2x − y + z = 2"],["2","x + 2y − z = 2"]],"0");
    var N=[[1,1,1],[2,-1,1],[1,2,-1]], DD=[3,2,2], Q=[1,1,1];
    var ux=k.slider("u : x",-3,3,1,1,"",null), uy=k.slider("u : y",-3,3,1,-2,"",null), uz=k.slider("u : z",-3,3,1,1,"",null);
    var s=k.slider("Décalage s de la droite (le long de n)",-1.5,1.5,0.5,0.5,"",null);
    var ro=k.readouts(["Produit scalaire normale · direction","Équation en t","Position relative","Point d'intersection"]);
    var nt=k.note("","warn");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, i=parseInt(pl.value,10), n=N[i], d=DD[i], u=[ux.value,uy.value,uz.value], ss=s.value;
      v.cube(); v.plane(n,d,["rgba(30,63,143,.18)","#1e3f8f"]);
      var P0=[Q[0]+ss*n[0],Q[1]+ss*n[1],Q[2]+ss*n[2]];
      if(u[0]===0&&u[1]===0&&u[2]===0){ v.dot(P0,6,P.red); ro.set(0,"0"); ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); nt.set("u = (0 ; 0 ; 0) n'est pas un vecteur directeur : choisis une direction non nulle.","warn"); return; }
      v.seg(P0,u,P.red,3);
      var nu=dot(n,u), rhs=d-dot(n,P0);
      ro.set(0,S.fmt(nu,0)); ro.set(1,S.fmt(nu,0)+"·t = "+S.fmt(rhs,2));
      if(nu!==0){ var tt=rhs/nu, X=[P0[0]+tt*u[0],P0[1]+tt*u[1],P0[2]+tt*u[2]]; v.dot(X,7,P.violet);
        ro.set(2,"sécante"); ro.set(3,"("+X.map(function(z){return S.fmt(z,2);}).join(" ; ")+") pour t = "+S.fmt(tt,2));
        nt.set("n·u ≠ 0 : la droite perce le plan en un seul point. Pour la rendre parallèle, cherche u tel que n·u = 0 (u ⊥ n).","ok"); }
      else if(Math.abs(rhs)<1e-9){ ro.set(2,"contenue dans le plan"); ro.set(3,"toute la droite"); nt.set("n·u = 0 et d − n·P₀ = 0 : la droite est dans le plan, tous ses points sont communs.","ok"); }
      else { ro.set(2,"strictement parallèle"); ro.set(3,"aucun"); nt.set("n·u = 0 et d − n·P₀ ≠ 0 : l'équation 0·t = "+S.fmt(rhs,2)+" est impossible, aucun point commun.","warn"); }
    });
    v.drag(k);
  }
});

SFA.sim({
  id:"m6-c05-plans-secants", ch:"c05", tag:"Intersection",
  titre:"Deux plans : la droite d'intersection",
  resume:"Change le deuxième plan : la droite commune a pour direction n₁ × n₂, ou les plans sont parallèles.",
  but:"Choisis le premier plan, puis règle le deuxième (a, b, c, d). La droite rouge est leur intersection. Fais apparaître les cas parallèles et confondus.",
  aRetenir:"Deux plans non parallèles se coupent suivant une droite dont un vecteur directeur est perpendiculaire aux deux normales : n₁ × n₂ (produit vectoriel, vu comme outil ; on peut aussi résoudre le système de deux équations). Les plans sont parallèles si leurs normales sont proportionnelles ; confondus si en plus d est dans la même proportion.",
  piege:"Deux équations de plans dont les normales sont proportionnelles ne sont pas forcément équivalentes : x + y + z = 3 et 2x + 2y + 2z = 5 sont parallèles <i>distincts</i>.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85}), v=V3(c,S);
    var p1=k.select("Plan 1",[["0","x + y + z = 3"],["1","2x − y + z = 2"],["2","x + 2y − z = 2"]],"0");
    var N=[[1,1,1],[2,-1,1],[1,2,-1]], DD=[3,2,2];
    var a=k.slider("a₂",-3,3,1,2,"",null), b=k.slider("b₂",-3,3,1,-1,"",null), cc=k.slider("c₂",-3,3,1,3,"",null), d=k.slider("d₂",-6,6,1,5,"",null);
    var ro=k.readouts(["Plan 2","n₁ × n₂","Position relative","Un point commun / direction"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, i=parseInt(p1.value,10), n1=N[i], d1=DD[i], n2=[a.value,b.value,cc.value], d2=d.value;
      v.cube(); v.plane(n1,d1,["rgba(30,63,143,.16)","#1e3f8f"]);
      var z2=n2[0]===0&&n2[1]===0&&n2[2]===0;
      if(z2){ ro.set(0,"pas un plan"); ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); nt.set("(a₂ ; b₂ ; c₂) = (0 ; 0 ; 0) : ce n'est pas un plan. Change un coefficient.","warn"); return; }
      v.plane(n2,d2,["rgba(180,35,24,.14)","#b42318"]);
      var w=cross(n1,n2), ww=dot(w,w);
      ro.set(0,eq(S,n2[0],n2[1],n2[2],d2)); ro.set(1,"("+w.map(function(z){return S.fmt(z,0);}).join(" ; ")+")");
      if(ww===0){
        var lam=Math.abs(n1[0])>0?n2[0]/n1[0]:(Math.abs(n1[1])>0?n2[1]/n1[1]:n2[2]/n1[2]);
        if(Math.abs(d2-lam*d1)<1e-9){ ro.set(2,"confondus"); ro.set(3,"tous les points"); nt.set("Les normales sont proportionnelles (facteur "+S.fmt(lam,2)+") et d₂ = "+S.fmt(lam,2)+"×d₁ : c'est le même plan.","ok"); }
        else { ro.set(2,"parallèles distincts"); ro.set(3,"aucun"); nt.set("Les normales sont proportionnelles mais pas les seconds membres : aucun point commun.","warn"); }
        return;
      }
      var c1=cross(n2,w), c2=cross(n1,w), X=[(d1*c1[0]-d2*c2[0])/ww,(d1*c1[1]-d2*c2[1])/ww,(d1*c1[2]-d2*c2[2])/ww];
      v.seg(X,w,P.ink,3.4); v.dot(X,5,P.violet);
      ro.set(2,"sécants suivant une droite"); ro.set(3,"("+X.map(function(z){return S.fmt(z,2);}).join(" ; ")+") ; d = ("+w.map(function(z){return S.fmt(z,0);}).join(" ; ")+")");
      nt.set("Vérification : n₁·X = "+S.fmt(dot(n1,X),2)+" (= d₁ = "+S.fmt(d1,0)+") et n₂·X = "+S.fmt(dot(n2,X),2)+" (= d₂ = "+S.fmt(d2,0)+").","ok");
    });
    v.drag(k);
  }
});
SFA.V3=V3; SFA.eq3=eq; SFA.cross3=cross; SFA.dot3=dot;
})();
