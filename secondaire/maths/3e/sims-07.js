/* Chapitre 7 : angles et isométrie */
window.M3 = window.M3 || {};
M3.wedge = function(c,cx,cy,startDeg,sweepDeg,r,fill,stroke){
  var ctx=c.ctx, a0=-startDeg*Math.PI/180, a1=-(startDeg+sweepDeg)*Math.PI/180;
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,a0,a1,true); ctx.closePath();
  if(fill){ ctx.fillStyle=fill; ctx.fill(); } if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=1.5; ctx.stroke(); }
};
SFA.sim({
  id:"m3-c07-paralleles", ch:"c07", tag:"Parallèles et sécante", titre:"Deux parallèles et une sécante : quels angles sont égaux ?",
  resume:"Huit angles, mais seulement deux valeurs : θ et 180° − θ. Sauf si les droites ne sont pas parallèles !",
  but:"Choisis un type de paire d'angles et incline la sécante. Puis incline la 2e droite pour voir ce qui se perd quand elle n'est plus parallèle.",
  aRetenir:"Avec deux parallèles : les angles opposés par le sommet, correspondants, alternes-internes et alternes-externes sont égaux ; les angles co-internes sont supplémentaires (somme 180°).",
  piege:"Les égalités entre correspondants et alternes-internes ne sont vraies que si les droites sont parallèles. Seuls les angles opposés par le sommet sont toujours égaux.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.8}), P=S.draw.palette;
    var tp=k.seg("Paire d'angles",[["opp","Opposés par le sommet"],["corr","Correspondants"],["ai","Alternes-internes"],["ae","Alternes-externes"],["ci","Co-internes"]],"corr");
    var th=k.slider("Inclinaison θ de la sécante",40,140,1,65,"°"), ep=k.slider("Inclinaison de la 2e droite",-20,20,1,0,"°");
    var ro=k.readouts(["Angle 1","Angle 2","Relation"]);
    var nt=k.note("");
    var PAIRS={opp:[[1,"NE"],[1,"SW"]],corr:[[1,"NE"],[2,"NE"]],ai:[[1,"SW"],[2,"NE"]],ae:[[1,"NW"],[2,"SE"]],ci:[[1,"SE"],[2,"NE"]]};
    function sector(sec,lam,T){ var v=T-lam; return {NE:[lam,v],NW:[T,180-v],SW:[lam+180,v],SE:[T+180,180-v]}[sec]; }
    k.draw(function(){
      c.clear(); var ctx=c.ctx, T=th.value, E=ep.value, W=c.W, H=c.H, y1=H*0.32, y2=H*0.68, Dl=y2-y1, tr=T*Math.PI/180;
      var s=Dl/Math.sin(tr), x1=W/2+s*Math.cos(tr)/2, x2=x1-s*Math.cos(tr);
      var L=W*0.46, er=E*Math.PI/180;
      S.draw.line(c,x1-L,y1,x1+L,y1,P.ink,2.5); S.draw.line(c,x2-L*Math.cos(er),y2+L*Math.sin(er),x2+L*Math.cos(er),y2-L*Math.sin(er),P.ink,2.5);
      var dx=Math.cos(tr), dy=-Math.sin(tr), ext=H*0.5/Math.sin(tr);
      S.draw.line(c,x1+dx*(Dl*0.5/Math.sin(tr)+0)*0+dx*(-ext*0.45)*-1,y1+dy*(-ext*0.45)*-1,x2-dx*ext*0.45,y2-dy*ext*0.45,P.grey,2.5);
      var pts={1:[x1,y1,0],2:[x2,y2,E]}, pr=PAIRS[tp.value], cols=[P.red,P.acc], vals=[];
      [1,2].forEach(function(id){ ["NE","NW","SW","SE"].forEach(function(sec){ var sc=sector(sec,pts[id][2],T); M3.wedge(c,pts[id][0],pts[id][1],sc[0],sc[1],26,"rgba(138,149,163,.18)"); }); });
      pr.forEach(function(p,i){ var q=pts[p[0]], sc=sector(p[1],q[2],T); vals.push(sc[1]);
        M3.wedge(c,q[0],q[1],sc[0],sc[1],36,i?"rgba(30,63,143,.45)":"rgba(180,35,24,.45)",cols[i]);
        var mid=(sc[0]+sc[1]/2)*Math.PI/180; S.draw.text(c,S.fmt(sc[1],0)+"°",q[0]+Math.cos(mid)*54,q[1]-Math.sin(mid)*54,{size:13,color:cols[i],bg:"rgba(255,255,255,.85)"}); });
      var v1=vals[0],v2=vals[1], rel=Math.abs(v1-v2)<0.01?"égaux":Math.abs(v1+v2-180)<0.01?"supplémentaires":"ni égaux ni supplémentaires";
      ro.set(0,S.fmt(v1,0)+"°"); ro.set(1,S.fmt(v2,0)+"°"); ro.set(2,rel);
      if(tp.value==="opp") nt.set("Opposés par le sommet : toujours égaux, même si les droites ne sont pas parallèles.","ok");
      else if(E!==0) nt.set("Les droites ne sont plus parallèles : la propriété "+(tp.value==="ci"?"« somme 180° » ":"d'égalité ")+"est perdue ("+rel+").","warn");
      else nt.set(tp.value==="ci"?"Droites parallèles : les angles co-internes valent θ et 180° − θ, leur somme fait 180°.":"Droites parallèles : ces deux angles sont égaux.","ok");
    });
  }
});
SFA.sim({
  id:"m3-c07-somme", ch:"c07", tag:"À la souris", titre:"La somme des angles d'un triangle : arrache les coins",
  resume:"Déforme le triangle, puis réaligne ses trois coins sur une droite : ils forment un angle plat.",
  but:"Glisse les sommets du triangle. Puis fais glisser le curseur pour déplacer les trois angles sur la droite du bas.",
  aRetenir:"Dans tout triangle, la somme des angles vaut 180°. Les trois coins mis côte à côte forment un angle plat.",
  piege:"Ne mesure pas à l'œil : une figure dessinée n'est jamais une preuve. C'est la propriété qui donne 180°, pas le dessin.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:1.15}), P=S.draw.palette;
    var V=[[0.2,0.3],[0.82,0.22],[0.45,0.04]]; V[2]=[0.5,0.05]; var sel=-1;
    var tt=k.slider("Réaligner les coins",0,1,0.05,0,"");
    k.button("Triangle quelconque",function(){ V[0]=[0.15,0.28];V[1]=[0.85,0.2];V[2]=[0.4,0.04]; });
    k.button("Triangle obtus",function(){ V[0]=[0.1,0.25];V[1]=[0.9,0.25];V[2]=[0.18,0.05]; });
    var ro=k.readouts(["Angle A","Angle B","Angle C","Somme"]); var nt=k.note("");
    function pos(){ var W=c.W,H=c.H; return V.map(function(v){ return [v[0]*W, 36+v[1]*H*0.9]; }); }
    c.pointer(function(t,p){
      var ps=pos();
      if(t==="down"){ var best=-1,bd=34; ps.forEach(function(q,i){ var d=Math.hypot(p.x-q[0],p.y-q[1]); if(d<bd){bd=d;best=i;} }); sel=best; }
      if((t==="down"||t==="drag")&&sel>=0){ V[sel]=[Math.max(0.03,Math.min(0.97,p.x/c.W)),Math.max(0,Math.min(0.42,(p.y-36)/(c.H*0.9)))]; k.redraw(); }
      if(t==="up") sel=-1;
    });
    function angleAt(ps,i){ var A=ps[i],B=ps[(i+1)%3],C=ps[(i+2)%3];
      var dB=Math.atan2(-(B[1]-A[1]),B[0]-A[0])*180/Math.PI, dC=Math.atan2(-(C[1]-A[1]),C[0]-A[0])*180/Math.PI;
      var df=((dC-dB)%360+360)%360, st,sw; if(df<=180){st=dB;sw=df;}else{st=dC;sw=360-df;} return {start:st,sweep:sw}; }
    k.draw(function(){
      c.clear(); var ps=pos(), t=tt.value, ctx=c.ctx, cols=[P.red,P.acc,P.green], names=["A","B","C"];
      ctx.beginPath(); ctx.moveTo(ps[0][0],ps[0][1]); ctx.lineTo(ps[1][0],ps[1][1]); ctx.lineTo(ps[2][0],ps[2][1]); ctx.closePath(); ctx.fillStyle="rgba(30,63,143,.07)"; ctx.fill(); ctx.strokeStyle=P.ink; ctx.lineWidth=2.4; ctx.stroke();
      var yb=c.H*0.82, qx=c.W/2; S.draw.line(c,qx-c.W*0.4,yb,qx+c.W*0.4,yb,P.grey,2);
      var cum=0, tot=0, ang=[];
      for(var i=0;i<3;i++){ var a=angleAt(ps,i); ang.push(a); tot+=a.sweep; }
      for(i=0;i<3;i++){ var a2=ang[i], r=Math.min(40,c.W*0.12), tgtStart=cum;
        var d=(((tgtStart-a2.start)%360)+540)%360-180, st=a2.start+d*t;
        var cx=ps[i][0]+(qx-ps[i][0])*t, cy=ps[i][1]+(yb-ps[i][1])*t;
        M3.wedge(c,cx,cy,st,a2.sweep,r,cols[i],"#fff");
        var mid=(st+a2.sweep/2)*Math.PI/180; S.draw.text(c,names[i],cx+Math.cos(mid)*(r+12),cy-Math.sin(mid)*(r+12),{size:13,color:cols[i]});
        cum+=a2.sweep; }
      ps.forEach(function(q,i){ S.draw.dot(c,q[0],q[1],5,P.ink); });
      if(t<0.01) S.draw.text(c,"Glisse les sommets",c.W/2,16,{size:12,color:P.grey});
      var flat=false; for(i=0;i<3;i++){ var q1=ps[i], q2=ps[(i+1)%3]; if(Math.hypot(q1[0]-q2[0],q1[1]-q2[1])<4) flat=true; }
      var area2=Math.abs((ps[1][0]-ps[0][0])*(ps[2][1]-ps[0][1])-(ps[2][0]-ps[0][0])*(ps[1][1]-ps[0][1])); if(area2<6) flat=true;
      if(flat){ for(i=0;i<3;i++) ro.set(i,"—"); ro.set(3,"—"); nt.set("Triangle aplati (sommets confondus ou alignés) : les angles ne sont pas définis. Écarte les sommets.","warn"); return; }
      for(i=0;i<3;i++) ro.set(i,S.fmt(ang[i].sweep,1)+"°");
      ro.set(3,S.fmt(tot,1)+"°");
      nt.set(t>0.95?"Les trois coins forment ensemble un angle plat : 180°.":"Déforme le triangle : la somme reste 180° (au dixième de degré près).","ok");
    });
  }
});
SFA.sim({
  id:"m3-c07-construction", ch:"c07", tag:"Isométrie", titre:"Constructeur de triangles : combien de triangles possibles ?",
  resume:"CCC, CAC, ACA : un seul triangle. AAA et CCA (côté, côté, angle non compris) : pas toujours !",
  but:"Choisis un cas, règle les données (la note dit quelles données sont utilisées) et regarde combien de triangles existent.",
  aRetenir:"Deux triangles sont isométriques (superposables) si CCC, CAC ou ACA. Trois angles (AAA) ne suffisent pas : on obtient des triangles semblables de tailles différentes.",
  piege:"Deux côtés et un angle NON compris entre eux (CCA) peuvent donner 0, 1 ou 2 triangles : ce n'est pas un cas d'isométrie.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7}), P=S.draw.palette;
    var md=k.seg("Cas",[["ccc","CCC"],["cac","CAC"],["aca","ACA"],["aaa","AAA"],["ssa","CCA"]],"ccc");
    var u=k.slider("Longueur u",1,10,0.5,6,""), v=k.slider("Longueur v",1,10,0.5,5,""), w=k.slider("Longueur w",1,10,0.5,4,"");
    var al=k.slider("Angle α",20,150,1,50,"°"), be=k.slider("Angle β",20,150,1,60,"°");
    var ro=k.readouts(["Données utilisées","Triangles possibles"]); var nt=k.note("");
    var HELP={ccc:"u, v, w : les trois côtés.",cac:"u et v : deux côtés ; α : l'angle compris entre eux.",aca:"α et β : deux angles ; u : le côté entre eux.",aaa:"α et β : deux angles (le 3e se déduit) ; u : taille choisie.",ssa:"u : côté opposé à α ; v : côté adjacent à α ; α : angle non compris entre u et v."};
    function tri(){
      var m=md.value, U=u.value,Vv=v.value,Wd=w.value,A=al.value*Math.PI/180,B=be.value*Math.PI/180,res=[];
      if(m==="ccc"){ if(U+Vv>Wd&&U+Wd>Vv&&Vv+Wd>U){ var a=U,b=Vv,cc=Wd, x=(a*a+cc*cc-b*b)/(2*a), y=Math.sqrt(Math.max(0,cc*cc-x*x)); res.push([[0,0],[a,0],[x,y]]); } }
      if(m==="cac"){ res.push([[0,0],[Vv,0],[U*Math.cos(A),U*Math.sin(A)]]); }
      if(m==="aca"){ if(al.value+be.value<180){ var sA=Math.sin(Math.PI-A-B); var ab=U*Math.sin(B)/sA; res.push([[0,0],[U,0],[ab*Math.cos(A),ab*Math.sin(A)]]); } }
      if(m==="aaa"){ if(al.value+be.value<180){ [U,U*1.6].forEach(function(sc){ var sA=Math.sin(Math.PI-A-B), ab=sc*Math.sin(B)/sA; res.push([[0,0],[sc,0],[ab*Math.cos(A),ab*Math.sin(A)]]); }); } }
      if(m==="ssa"){ var disc=U*U-Vv*Vv*Math.sin(A)*Math.sin(A), h=Vv*Math.sin(A);
        if(Math.abs(U-h)<1e-9){ if(Vv*Math.cos(A)>1e-9) res.push([[0,0],[Vv,0],[Vv*Math.cos(A)*Math.cos(A)/1*1,Vv*Math.cos(A)*Math.sin(A)]]); }
        else if(disc>0){ [1,-1].forEach(function(sg){ var t=Vv*Math.cos(A)+sg*Math.sqrt(disc); if(t>1e-9) res.push([[0,0],[Vv,0],[t*Math.cos(A),t*Math.sin(A)]]); }); } }
      return res;
    }
    k.draw(function(){
      c.clear(); var T=tri(), m=md.value, ctx=c.ctx, names=["A","B","C"];
      var all=[]; T.forEach(function(t){ t.forEach(function(p){all.push(p);}); });
      if(m==="ssa"&&T.length){ all.push([0,0]); }
      var sc;
      if(all.length){ var mx=Math.max.apply(null,all.map(function(p){return p[0];})), mn=Math.min.apply(null,all.map(function(p){return p[0];})), my=Math.max.apply(null,all.map(function(p){return p[1];}));
        sc=Math.min((c.W-50)/Math.max(0.1,mx-mn),(c.H-60)/Math.max(0.1,my)); var ox=25-mn*sc, oy=c.H-28;
        T.forEach(function(t,i){ ctx.beginPath(); t.forEach(function(p,j){ var X=ox+p[0]*sc,Y=oy-p[1]*sc; if(j===0) ctx.moveTo(X,Y); else ctx.lineTo(X,Y); }); ctx.closePath();
          ctx.fillStyle=i===0?"rgba(30,63,143,.18)":"rgba(180,35,24,.14)"; ctx.fill(); ctx.strokeStyle=i===0?P.acc:P.red; ctx.lineWidth=2.4; ctx.stroke();
          if(i===0) t.forEach(function(p,j){ S.draw.text(c,names[j],ox+p[0]*sc+(j===0?-12:j===1?12:0),oy-p[1]*sc+(j===2?-12:12),{size:13}); }); });
      } else S.draw.text(c,"Aucun triangle ne convient",c.W/2,c.H/2,{size:15,color:P.red});
      ro.set(0,HELP[m]); 
      var n=T.length, txt;
      if(m==="aaa") txt=al.value+be.value<180?"une infinité (tailles différentes)":"aucun (α + β ≥ 180°)";
      else txt=n===0?"aucun":n===1?"un seul":"deux";
      ro.set(1,txt);
      if(m==="ccc") nt.set(n?"Un seul triangle (à isométrie près).":"Impossible : il faut que chaque côté soit plus petit que la somme des deux autres.",n?"ok":"warn");
      else if(m==="cac") nt.set("Toujours un seul triangle : l'angle est compris entre les deux côtés.","ok");
      else if(m==="aca") nt.set(n?"Un seul triangle : le côté est compris entre les deux angles.":"Impossible : α + β doit être inférieur à 180°.",n?"ok":"warn");
      else if(m==="aaa") nt.set(al.value+be.value<180?"Les deux triangles ont les mêmes angles mais pas les mêmes côtés : ils sont semblables, pas isométriques.":"Impossible : α + β doit être inférieur à 180°.","warn");
      else if(al.value>=90) nt.set("α est droit ou obtus : il n'y a un triangle que si u > v ("+S.fmt(u.value,1)+(u.value>v.value?" > ":" ≤ ")+S.fmt(v.value,1)+" : "+(n?"un seul triangle":"aucun triangle")+"). Pour α aigu, on peut en avoir deux : CCA n'est donc pas un cas d'isométrie.","warn");
      else nt.set("Hauteur de v : "+S.fmt(v.value*Math.sin(al.value*Math.PI/180),2)+". Si u est plus petit que la hauteur : aucun triangle ; si u est égal à la hauteur : un seul (rectangle) ; entre la hauteur et v : deux triangles ; si u ≥ v : un seul. CCA n'est donc pas un cas d'isométrie.",n===2?"warn":"ok");
    });
  }
});
SFA.sim({
  id:"m3-c07-pavage", ch:"c07", tag:"Pavage", titre:"Quels polygones recouvrent le plan ?",
  resume:"Autour d'un sommet, il faut que les angles des polygones totalisent 360°.",
  but:"Choisis un polygone régulier (nombre de côtés n) et le nombre de copies autour d'un sommet. Cherche les cas sans trou ni recouvrement.",
  aRetenir:"L'angle intérieur d'un polygone régulier à n côtés vaut 180° × (n − 2) ÷ n. Il pave le plan à lui seul seulement si un nombre entier de copies fait exactement 360° : triangle, carré, hexagone.",
  piege:"Trois pentagones laissent un trou de 36° ; quatre se chevauchent. Un pentagone régulier ne pave pas le plan.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85}), P=S.draw.palette;
    var n=k.slider("Nombre de côtés n",3,12,1,6,""), q=k.slider("Copies autour du sommet",1,8,1,3,"");
    var ro=k.readouts(["Angle intérieur","Total autour du sommet","Écart avec 360°"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var N=n.value, K=q.value, ctx=c.ctx, al=180*(N-2)/N, ex=360/N, s=0.45*Math.min(c.W,c.H)*Math.sin(Math.PI/N);
      var cx=c.W/2, cy=c.H/2, cols=["#1e3f8f","#2e6b55","#B45309","#5B21B6","#0e7490","#b42318","#8a95a3","#f4c542"];
      for(var i=0;i<K;i++){ var th=i*al, X=cx, Y=cy; ctx.beginPath(); ctx.moveTo(X,Y);
        for(var j=0;j<N;j++){ var r=(th+j*ex)*Math.PI/180; X+=s*Math.cos(r); Y-=s*Math.sin(r); ctx.lineTo(X,Y); }
        ctx.closePath(); ctx.fillStyle=cols[i%8]; ctx.globalAlpha=0.5; ctx.fill(); ctx.globalAlpha=1; ctx.strokeStyle="#fff"; ctx.lineWidth=2; ctx.stroke(); }
      var tot=K*al, gap=360-tot;
      if(gap>0.01){ M3.wedge(c,cx,cy,K*al,gap,s*0.55,"rgba(180,35,24,.12)"); ctx.save(); ctx.setLineDash([5,4]); ctx.strokeStyle=P.red; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,s*0.55,-(K*al)*Math.PI/180,-360*Math.PI/180,true); ctx.stroke(); ctx.restore(); }
      S.draw.dot(c,cx,cy,5,P.ink);
      ro.set(0,S.fmt(al,2)+"°"); ro.set(1,S.fmt(tot,2)+"°"); ro.set(2,Math.abs(gap)<0.01?"0° : parfait":gap>0?"trou de "+S.fmt(gap,2)+"°":"recouvrement de "+S.fmt(-gap,2)+"°");
      if(Math.abs(gap)<0.01) nt.set(K+" copies × "+S.fmt(al,2)+"° = 360° : ces polygones se raccordent sans trou ni chevauchement autour du sommet.","ok");
      else if(gap>0) nt.set("Il reste un trou de "+S.fmt(gap,2)+"° : essaie une copie de plus (ou un autre polygone).","warn");
      else nt.set("Les polygones se chevauchent de "+S.fmt(-gap,2)+"° : il y en a trop.","warn");
    });
  }
});
