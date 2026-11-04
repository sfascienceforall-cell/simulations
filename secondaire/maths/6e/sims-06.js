/* Chapitre 6 : systèmes linéaires 3×3 */
(function(){
function rank(M){ var m=M.map(function(r){return r.slice();}), r=0, cols=m[0].length;
  for(var c=0;c<cols&&r<m.length;c++){ var p=-1; for(var i=r;i<m.length;i++){ if(Math.abs(m[i][c])>1e-9&&(p<0||Math.abs(m[i][c])>Math.abs(m[p][c]))) p=i; }
    if(p<0) continue; var t=m[p]; m[p]=m[r]; m[r]=t;
    for(i=r+1;i<m.length;i++){ var f=m[i][c]/m[r][c]; for(var j=c;j<cols;j++) m[i][j]-=f*m[r][j]; } r++; }
  return r; }

SFA.sim({
  id:"m6-c06-trois-plans", ch:"c06", tag:"Classique · 3D",
  titre:"Trois plans : point, droite, plan ou rien",
  resume:"Règle le 3e plan : le système a une solution, une infinité ou aucune.",
  but:"Choisis les deux premiers plans, puis modifie a, b, c, d du 3e plan (ax + by + cz = d). La simulation donne le rang, le type de solution et dessine l'ensemble des solutions. Tourne la vue en glissant.",
  aRetenir:"Un système 3×3 est la recherche de l'intersection de trois plans. Trois plans peuvent se couper en un point (solution unique), suivant une droite (indéterminé, une inconnue libre), être confondus (deux inconnues libres) ou n'avoir aucun point commun (impossible). Le système est impossible si le rang de la matrice augmentée dépasse celui de la matrice des coefficients.",
  piege:"Trois équations ne donnent pas toujours une seule solution : si une équation est combinaison des deux autres, il y a une droite de solutions ; et « pas de solution » peut venir de trois plans qui se coupent deux à deux sans point commun (prisme).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85}), v=SFA.V3(c,S);
    var pre=k.select("Plans 1 et 2",[["0","x + y + z = 3  et  2x − y + z = 2"],["1","x − y = 0  et  y − z = 0"],["2","x + y + z = 3  et  2x + 2y + 2z = 6"]],"0");
    var PR=[[[[1,1,1],3],[[2,-1,1],2]],[[[1,-1,0],0],[[0,1,-1],0]],[[[1,1,1],3],[[2,2,2],6]]];
    var a=k.slider("a₃",-3,3,1,1,"",null), b=k.slider("b₃",-3,3,1,-1,"",null), cc=k.slider("c₃",-3,3,1,1,"",null), d=k.slider("d₃",-6,6,1,1,"",null);
    var ro=k.readouts(["Rang (coefficients)","Rang (augmentée)","Nature","Solution"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, pl=PR[parseInt(pre.value,10)].slice(); pl.push([[a.value,b.value,cc.value],d.value]);
      var cols=[["rgba(30,63,143,.16)","#1e3f8f"],["rgba(180,35,24,.14)","#b42318"],["rgba(46,107,85,.16)","#2e6b55"]];
      v.cube();
      pl.forEach(function(p,i){ if(Math.hypot(p[0][0],p[0][1],p[0][2])>0) v.plane(p[0],p[1],cols[i]); });
      var A=pl.map(function(p){return p[0];}), Ag=pl.map(function(p){return p[0].concat([p[1]]);});
      var rA=rank(A), rG=rank(Ag);
      ro.set(0,String(rA)); ro.set(1,String(rG));
      var f=function(z){return S.fmt(z,2);};
      if(rA<rG){ ro.set(2,"impossible"); ro.set(3,"aucune"); nt.set("Le rang de la matrice augmentée ("+rG+") dépasse celui des coefficients ("+rA+") : les équations se contredisent, aucun point commun aux trois plans.","warn"); return; }
      if(rA===3){
        var n1=A[0],n2=A[1],n3=A[2], det=SFA.dot3(n1,SFA.cross3(n2,n3)), c23=SFA.cross3(n2,n3), c31=SFA.cross3(n3,n1), c12=SFA.cross3(n1,n2);
        var X=[0,1,2].map(function(i){return (pl[0][1]*c23[i]+pl[1][1]*c31[i]+pl[2][1]*c12[i])/det;});
        v.dot(X,7,P.ink); ro.set(2,"solution unique"); ro.set(3,"("+X.map(f).join(" ; ")+")");
        nt.set("Déterminant des coefficients = "+S.fmt(det,0)+" ≠ 0 : les trois plans se coupent en un seul point.","ok"); return;
      }
      if(rA===2){
        var pairs=[[0,1],[0,2],[1,2]], q=null; for(var i=0;i<3;i++){ var w=SFA.cross3(A[pairs[i][0]],A[pairs[i][1]]); if(Math.hypot(w[0],w[1],w[2])>0){ q=[pairs[i][0],pairs[i][1],w]; break; } }
        var w2=q[2], ww=SFA.dot3(w2,w2), n1b=A[q[0]], n2b=A[q[1]], c1=SFA.cross3(n2b,w2), c2=SFA.cross3(n1b,w2), d1=pl[q[0]][1], d2=pl[q[1]][1];
        var Y=[0,1,2].map(function(i){return (d1*c1[i]-d2*c2[i])/ww;});
        v.seg(Y,w2,P.ink,3.6); v.dot(Y,5,P.violet);
        ro.set(2,"indéterminé : une droite"); ro.set(3,"point "+"("+Y.map(f).join(" ; ")+") + t·("+w2.map(function(z){return S.fmt(z,0);}).join(" ; ")+")");
        nt.set("Rang 2 sur 3 inconnues : une inconnue reste libre, les solutions forment une droite.","ok"); return;
      }
      ro.set(2,"indéterminé : un plan"); ro.set(3,"tous les points du plan"); nt.set("Rang 1 : les trois équations décrivent le même plan, deux inconnues sont libres.","ok");
    });
    v.drag(k);
  }
});

/* --- élimination de Gauss avec fractions --- */
function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=a%b; a=b; b=t; } return a||1; }
function Fr(n,d){ if(d===undefined) d=1; if(d<0){ n=-n; d=-d; } var g=gcd(n,d); return {n:n/g,d:d/g}; }
function fadd(a,b){ return Fr(a.n*b.d+b.n*a.d,a.d*b.d); }
function fsub(a,b){ return Fr(a.n*b.d-b.n*a.d,a.d*b.d); }
function fmul(a,b){ return Fr(a.n*b.n,a.d*b.d); }
function fdiv(a,b){ return Fr(a.n*b.d,a.d*b.n); }
function fz(a){ return a.n===0; }
function fs(S,a){ var m=a.n<0?"−":""; return m+(a.d===1?String(Math.abs(a.n)):Math.abs(a.n)+"/"+a.d); }

SFA.sim({
  id:"m6-c06-gauss", ch:"c06", tag:"Classique · Méthode",
  titre:"L'élimination de Gauss, étape par étape",
  resume:"Avance dans les opérations sur les lignes : le système devient triangulaire puis se lit.",
  but:"Choisis un système, puis avance l'étape. À chaque étape on voit l'opération sur les lignes et la matrice augmentée obtenue.",
  aRetenir:"On élimine x des lignes 2 et 3, puis y de la ligne 3 : le système devient triangulaire et se résout de bas en haut. Une ligne (0 0 0 | 0) signale un système indéterminé ; une ligne (0 0 0 | c) avec c ≠ 0 signale un système impossible. Les opérations « Lᵢ ← Lᵢ − f·Lⱼ » et « Lᵢ ↔ Lⱼ » donnent un système équivalent.",
  piege:"Quand tu modifies une ligne, recopie bien <i>tous</i> les termes, second membre compris. Si le pivot est nul, on échange deux lignes : cela ne change pas les solutions.",
  build:function(k,S){
    var SYS={
      a:{n:"Solution unique",M:[[1,1,1,6],[2,-1,1,3],[1,2,-1,2]]},
      b:{n:"Pivot nul : échange de lignes",M:[[0,1,1,5],[1,1,1,6],[2,1,-1,3]]},
      c:{n:"Indéterminé",M:[[1,1,1,6],[2,-1,1,3],[3,0,2,9]]},
      d:{n:"Impossible",M:[[1,1,1,6],[2,-1,1,3],[3,0,2,10]]}
    };
    var sel=k.select("Système",[["a","Solution unique"],["b","Pivot nul : échange de lignes"],["c","Indéterminé"],["d","Impossible"]],"a");
    var st=k.slider("Étape",0,6,1,0,"",null);
    var box=k.note("","", "stage");
    function build(M0){
      var M=M0.map(function(r){return r.map(function(x){return Fr(x);});}), steps=[{d:"Système de départ",M:M.map(function(r){return r.slice();}),hi:[]}], r=0;
      for(var c=0;c<3&&r<3;c++){
        var p=-1; for(var i=r;i<3;i++){ if(!fz(M[i][c])){ p=i; break; } }
        if(p<0) continue;
        if(p!==r){ var t=M[p]; M[p]=M[r]; M[r]=t; steps.push({d:"L"+(r+1)+" ↔ L"+(p+1)+" (le pivot était nul)",M:M.map(function(q){return q.slice();}),hi:[r,p]}); }
        for(i=r+1;i<3;i++){ if(fz(M[i][c])) continue; var f=fdiv(M[i][c],M[r][c]);
          for(var j=0;j<4;j++) M[i][j]=fsub(M[i][j],fmul(f,M[r][j]));
          var af=Fr(Math.abs(f.n),f.d), coef=(af.n===1&&af.d===1)?"":"("+fs(S,af)+")·";
          steps.push({d:"L"+(i+1)+" ← L"+(i+1)+(f.n<0?" + ":" − ")+coef+"L"+(r+1),M:M.map(function(q){return q.slice();}),hi:[i]}); }
        r++; }
      return steps;
    }
    function reading(M){
      var rows=M.map(function(r){return r.slice();}), bad=false, zero=0;
      rows.forEach(function(r){ if(fz(r[0])&&fz(r[1])&&fz(r[2])){ if(!fz(r[3])) bad=true; else zero++; } });
      if(bad) return "<b>Lecture :</b> une ligne (0 0 0 | "+"c≠0) dit 0 = c : <b>système impossible</b>, aucune solution.";
      if(zero===0){
        var z=fdiv(M[2][3],M[2][2]), y=fdiv(fsub(M[1][3],fmul(M[1][2],z)),M[1][1]), x=fdiv(fsub(fsub(M[0][3],fmul(M[0][2],z)),fmul(M[0][1],y)),M[0][0]);
        return "<b>Lecture, de bas en haut :</b> z = "+fs(S,z)+", puis y = "+fs(S,y)+", puis x = "+fs(S,x)+". <b>Solution unique</b> (x ; y ; z) = ("+fs(S,x)+" ; "+fs(S,y)+" ; "+fs(S,z)+").";
      }
      // une ligne nulle : pivots en colonnes 0 et 1, z = t libre
      var b=M[1][1], yc=fdiv(M[1][3],b), yt=fdiv(fsub(Fr(0),M[1][2]),b);
      var xc=fdiv(fsub(M[0][3],fmul(M[0][1],yc)),M[0][0]), xt=fdiv(fsub(fsub(Fr(0),M[0][2]),fmul(M[0][1],yt)),M[0][0]);
      function ex(c0,t0){ var s=fs(S,c0); if(fz(t0)) return s; var tt=(t0.n<0?" − ":" + ")+(Math.abs(t0.n)===1&&t0.d===1?"":(t0.d===1?String(Math.abs(t0.n)):Math.abs(t0.n)+"/"+t0.d)+"·")+"t"; return (fz(c0)?(t0.n<0?"−":"")+tt.replace(/^ [+−] /,""):s+tt); }
      return "<b>Lecture :</b> la ligne nulle (0 0 0 | 0) est inutile : 2 équations pour 3 inconnues. <b>Système indéterminé</b>. Avec z = t : y = "+ex(yc,yt)+" et x = "+ex(xc,xt)+".";
    }
    k.draw(function(){
      var sy=SYS[sel.value], steps=build(sy.M), nmax=steps.length-1; if(st.value>nmax) st.set(nmax);
      var s=Math.min(st.value,nmax), cur=steps[s];
      var html="<div style='font:700 13px Mulish,sans-serif;margin-bottom:6px'>"+sy.n+" · étape "+s+" sur "+nmax+"</div>";
      html+="<div style='font:600 13px Mulish,sans-serif;margin-bottom:8px;color:#13233a'>"+cur.d+"</div>";
      html+="<table style='border-collapse:collapse;font:600 15px JetBrains Mono,ui-monospace,monospace'>";
      cur.M.forEach(function(r,i){ var hi=cur.hi.indexOf(i)>=0; html+="<tr style='background:"+(hi?"#fff2cc":"transparent")+"'><td style='padding:3px 6px;color:#8a95a3'>L"+(i+1)+"</td>";
        r.forEach(function(x,j){ html+="<td style='padding:3px 10px;text-align:right"+(j===3?";border-left:2px solid #13233a":"")+"'>"+fs(S,x)+"</td>"; }); html+="</tr>"; });
      html+="</table>";
      var first=SYS[sel.value].M, vars=["x","y","z"];
      html+="<div style='margin-top:8px;font:600 13px Mulish,sans-serif;color:#5f6b7a'>Colonnes : coefficients de x, y, z puis second membre.</div>";
      if(s===nmax) html+="<div style='margin-top:10px;font:600 14px Mulish,sans-serif'>"+reading(cur.M)+"</div>";
      else html+="<div style='margin-top:10px;font:600 13px Mulish,sans-serif;color:#5f6b7a'>Fais avancer l'étape pour continuer l'élimination.</div>";
      box.set(html,"");
    });
  }
});

SFA.sim({
  id:"m6-c06-parametre", ch:"c06", tag:"Paramètre · 6 h",
  titre:"Un paramètre m : quand le système change de nature",
  resume:"Fais glisser m : déterminant, solution unique, droite de solutions ou système impossible.",
  but:"Système : x + y + z = 1 ; x + m·y + z = 2 ; x + y + m²·z = 1. Fais glisser m et repère les valeurs critiques où le déterminant s'annule.",
  aRetenir:"Le déterminant des coefficients vaut D(m) = (m − 1)²(m + 1). Si D(m) ≠ 0 : une seule solution, ici ((m − 2)/(m − 1) ; 1/(m − 1) ; 0). Aux valeurs critiques m = 1 et m = −1, il faut <i>étudier</i> le système : pour m = 1 il est impossible, pour m = −1 il est indéterminé (une droite de solutions). Discussion à paramètre : extension 6 h.",
  piege:"D(m) = 0 ne veut pas dire « pas de solution » : cela veut dire « pas de solution <i>unique</i> ». Il faut vérifier chaque valeur critique séparément, avec le second membre.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.6});
    var m=k.slider("Paramètre m",-3,3,0.25,0,"",null);
    var ro=k.readouts(["Déterminant D","Nature","Solution (x ; y ; z)"]);
    var nt=k.note("","ok");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, M=m.value;
      var D=function(x){return (x-1)*(x-1)*(x+1);};
      var ax=S.draw.axes(c,{x0:-3,x1:3,y0:-35,y1:20,xl:"m",yl:"D(m)",stepX:1,stepY:10});
      S.draw.fn(c,ax,D,P.acc,3);
      [-1,1].forEach(function(r){ S.draw.dot(c,ax.X(r),ax.Y(0),6,P.amber); S.draw.text(c,"m = "+S.fmt(r,0),ax.X(r),ax.Y(0)+(r<0?-16:16),{size:12,color:P.amber}); });
      S.draw.dot(c,ax.X(M),ax.Y(D(M)),7,P.red); S.draw.line(c,ax.X(M),ax.Y(0),ax.X(M),ax.Y(D(M)),P.red,1.4,[4,4]);
      ro.set(0,S.fmt(D(M),3));
      if(Math.abs(M-1)<1e-9){ ro.set(1,"impossible"); ro.set(2,"aucune"); nt.set("m = 1 : les deux premières équations deviennent x + y + z = 1 et x + y + z = 2 : contradiction.","warn"); }
      else if(Math.abs(M+1)<1e-9){ ro.set(1,"indéterminé (droite)"); ro.set(2,"(3/2 − t ; −1/2 ; t)"); nt.set("m = −1 : les équations 1 et 3 sont identiques (x + y + z = 1) ; avec la 2e on trouve y = −1/2 et x + z = 3/2 : une droite de solutions.","ok"); }
      else { var y=1/(M-1), x=(M-2)/(M-1); ro.set(1,"solution unique"); ro.set(2,"("+S.fmt(x,3)+" ; "+S.fmt(y,3)+" ; 0)"); nt.set("D(m) ≠ 0 : une seule solution. Vérifie avec la 2e équation : x + m·y + z = "+S.fmt(x+M*y,3)+".","ok"); }
    });
  }
});

SFA.sim({
  id:"m6-c06-melange", ch:"c06", tag:"Modélisation · Niche utile",
  titre:"Fabriquer un alliage avec trois fournisseurs",
  resume:"Place ton alliage cible dans le triangle : les quantités à mélanger sont les coordonnées barycentriques.",
  but:"Un alliage contient du cuivre, du zinc et de l'étain. Trois alliages sources A, B, C sont disponibles. Place le point cible dans le triangle (souris ou curseurs) : le système 3×3 donne les kilogrammes de A, B et C à mélanger.",
  aRetenir:"Mettre en équation : une équation par métal (cuivre, zinc, étain) et trois inconnues (kg de A, de B, de C). La solution doit être positive pour être réalisable : on ne peut pas « retirer » du A. Graphiquement, c'est possible seulement si la cible est à l'intérieur du triangle ABC.",
  piege:"Une solution mathématique n'est pas toujours une solution physique : si une inconnue est négative, le système est résolu mais le problème est impossible.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.82});
    var cu=k.slider("Cuivre dans la cible",5,90,1,35,"%",null), zn=k.slider("Zinc dans la cible",5,90,1,30,"%",null);
    var mass=k.slider("Masse à fabriquer",50,200,10,100,"kg",null);
    var ro=k.readouts(["Étain (calculé)","Alliage A","Alliage B","Alliage C"]);
    var nt=k.note("","ok");
    var Al=[[0.6,0.3,0.1],[0.2,0.5,0.3],[0.1,0.2,0.7]], nm=["A","B","C"]; // composition (Cu,Zn,Sn) de chaque alliage
    var geo=null;
    function pt(g,f){ return {x:f[0]*g.vc.x+f[1]*g.vz.x+f[2]*g.vs.x, y:f[0]*g.vc.y+f[1]*g.vz.y+f[2]*g.vs.y}; }
    function geom(){ var W=c.W,H=c.H; return {vc:{x:W/2,y:34},vz:{x:44,y:H-40},vs:{x:W-44,y:H-40}}; }
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, g=geom(); geo=g;
      var cuf=cu.value/100, znf=zn.value/100, snf=1-cuf-znf;
      ctx.save(); ctx.strokeStyle="#c9d2e8"; ctx.lineWidth=1;
      for(var i=1;i<5;i++){ var f=i/5; [[0,1,2],[1,2,0],[2,0,1]].forEach(function(p){ var a=[0,0,0],b=[0,0,0]; a[p[0]]=f; a[p[1]]=1-f; b[p[0]]=f; b[p[2]]=1-f; var A=pt(g,a),B=pt(g,b); ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke(); }); }
      ctx.strokeStyle="#13233a"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(g.vc.x,g.vc.y); ctx.lineTo(g.vz.x,g.vz.y); ctx.lineTo(g.vs.x,g.vs.y); ctx.closePath(); ctx.stroke(); ctx.restore();
      S.draw.text(c,"100 % cuivre",g.vc.x,g.vc.y-14,{size:12}); S.draw.text(c,"100 % zinc",g.vz.x+10,g.vz.y+18,{size:12}); S.draw.text(c,"100 % étain",g.vs.x-10,g.vs.y+18,{size:12});
      var pa=Al.map(function(f){return pt(g,f);});
      ctx.save(); ctx.beginPath(); ctx.moveTo(pa[0].x,pa[0].y); ctx.lineTo(pa[1].x,pa[1].y); ctx.lineTo(pa[2].x,pa[2].y); ctx.closePath(); ctx.fillStyle="rgba(46,107,85,.18)"; ctx.fill(); ctx.strokeStyle=P.green; ctx.lineWidth=1.6; ctx.stroke(); ctx.restore();
      pa.forEach(function(p,i){ S.draw.dot(c,p.x,p.y,6,P.green); S.draw.text(c,nm[i],p.x+(i===1?-12:(i===2?12:0)),p.y+(i===0?-14:12),{color:P.green}); });
      var ok=snf>=-1e-9;
      var T=ok?pt(g,[cuf,znf,snf]):null;
      // résolution M x = t (M colonnes = alliages)
      var M=[[Al[0][0],Al[1][0],Al[2][0]],[Al[0][1],Al[1][1],Al[2][1]],[Al[0][2],Al[1][2],Al[2][2]]], t=[cuf*mass.value,znf*mass.value,snf*mass.value];
      function det3(m){ return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]); }
      var D=det3(M), x=[0,1,2].map(function(j){ var Mj=M.map(function(r,i){ var rr=r.slice(); rr[j]=t[i]; return rr; }); return det3(Mj)/D; });
      ro.set(0,S.fmt(snf*100,0)+" %");
      if(!ok){ ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); nt.set("Cuivre + zinc dépassent 100 % : l'étain serait négatif. Diminue l'un des deux.","warn"); return; }
      S.draw.dot(c,T.x,T.y,8,P.red); S.draw.text(c,"cible",T.x+26,T.y-12,{size:12,color:P.red});
      for(i=0;i<3;i++) ro.set(i+1,"<span style='color:"+(x[i]<-1e-9?"#b42318":"inherit")+"'>"+S.fmt(x[i],1)+" kg</span>");
      var neg=x.some(function(z){return z<-1e-9;});
      if(neg) nt.set("Une quantité est négative : la cible est en dehors du triangle ABC, ce mélange est impossible avec ces trois alliages.","warn");
      else nt.set("Réalisable : A + B + C = "+S.fmt(x[0]+x[1]+x[2],1)+" kg. Vérifie le cuivre : "+S.fmt(0.6*x[0]+0.2*x[1]+0.1*x[2],1)+" kg = "+S.fmt(t[0],1)+" kg ✓","ok");
    });
    c.pointer(function(type,p){ if((type==="down"||type==="drag")&&geo){ var g=geo, den=(g.vz.y-g.vs.y)*(g.vc.x-g.vs.x)+(g.vs.x-g.vz.x)*(g.vc.y-g.vs.y);
      var a=((g.vz.y-g.vs.y)*(p.x-g.vs.x)+(g.vs.x-g.vz.x)*(p.y-g.vs.y))/den, b=((g.vs.y-g.vc.y)*(p.x-g.vs.x)+(g.vc.x-g.vs.x)*(p.y-g.vs.y))/den, cc2=1-a-b;
      a=Math.max(0.05,Math.min(0.9,a)); b=Math.max(0.05,Math.min(0.9,b)); if(a+b>0.95){ var s=0.95/(a+b); a*=s; b*=s; }
      cu.set(Math.round(a*100)); zn.set(Math.round(b*100)); k.redraw(); } });
  }
});
})();
