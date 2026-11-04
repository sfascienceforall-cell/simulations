(function(){
var P = SFA.draw.palette;
function sgn(v,first){ var a=Math.abs(v); if(first) return (v<0?"−":""); return v<0?" − ":" + "; }
/* écrit un polynôme à partir de coefficients du plus haut degré au plus bas */
function poly(co){
  var n=co.length-1, s="", first=true;
  for(var i=0;i<=n;i++){
    var v=co[i], d=n-i; if(Math.abs(v)<1e-12) continue;
    var a=Math.abs(v), t;
    if(d===0) t=SFA.fmt(a);
    else { t=(a===1?"":SFA.fmt(a)) + "x" + (d===1?"":(d===2?"²":"³")); }
    s += sgn(v,first) + t; first=false;
  }
  return s||"0";
}
function sup(v){ return v; }

SFA.sim({
  id:"m4-c02-ruffini", ch:"c02", tag:"Classique",
  titre:"Le schéma de Horner (Ruffini) pas à pas",
  resume:"Choisis un polynôme du 3e degré et une racine candidate : le tableau se remplit, avec quotient et reste.",
  but:"Règle les coefficients et le nombre r. Avance étape par étape (ou clique sur « Animer ») : on recopie, on multiplie par r, on additionne. Le dernier nombre est le reste P(r).",
  aRetenir:"Diviser P(x) par x − r : le reste vaut P(r). Si le reste est 0, x − r est un facteur de P et r est une racine. Les nombres de la ligne du bas, sauf le dernier, sont les coefficients du quotient.",
  piege:"Pour diviser par x + 2, il faut prendre r = −2. Et n'oublie jamais un coefficient nul : x³ + 1 s'écrit 1 ; 0 ; 0 ; 1.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.6});
    var a3=k.slider("coefficient de x³",1,3,1,1,"");
    var a2=k.slider("coefficient de x²",-6,6,1,-2,"");
    var a1=k.slider("coefficient de x",-6,6,1,-5,"");
    var a0=k.slider("terme constant",-9,9,1,6,"");
    var r=k.slider("r (division par x − r)",-4,4,1,1,"");
    var st=k.slider("étape",0,4,1,4,"");
    var tm=k.loop(function(dt,t){ var v=Math.min(4,Math.floor(t/0.9)); if(v!==st.value){ st.set(v); k.redraw(); } if(t>4*0.9+1) tm.pause(); });
    k.button("Animer",function(){ tm.reset(); st.set(0); tm.play(); },true);
    var ro=k.readouts(["P(x)","Quotient Q(x)","Reste = P(r)"]);
    var nt=k.note("","");
    k.draw(function(){
      var co=[a3.value,a2.value,a1.value,a0.value], R=r.value, step=st.value;
      var sums=[co[0]], prods=[null];
      for(var j=1;j<4;j++){ prods[j]=R*sums[j-1]; sums[j]=co[j]+prods[j]; }
      c.clear();
      var W=c.W,H=c.H, x0=Math.min(90,W*.2), cw=(W-x0-10)/4, y1=H*.28, y2=H*.5, y3=H*.78;
      var ctx=c.ctx;
      var heads=["x³","x²","x","1"];
      for(var j=0;j<4;j++) S.draw.text(c,heads[j],x0+cw*(j+.5),H*.08,{color:P.grey,size:13});
      S.draw.line(c,x0,H*.16,x0,H*.9,P.ink,2);
      S.draw.line(c,6,y2-H*.11+4,W-6,y2-H*.11+4,P.ink,2);
      S.draw.line(c,x0+cw*3,H*.16,x0+cw*3,H*.9,P.light,1.5);
      S.draw.text(c,"r = "+S.fmt(R),x0/2,(y1+y2)/2-10,{color:P.red,size:15});
      for(var j=0;j<4;j++){
        S.draw.text(c,S.fmt(co[j]),x0+cw*(j+.5),y1,{size:17,color:P.ink});
        if(j>=1 && j<=step) S.draw.text(c,(R<0?"×("+S.fmt(R)+")":"×"+S.fmt(R))+" = "+S.fmt(prods[j]),x0+cw*(j+.5),y2,{size:13,color:P.amber});
        if(j===0 && step>=0) S.draw.text(c,S.fmt(sums[0]),x0+cw*.5,y3,{size:17,color:P.acc});
        if(j>=1 && j<=step) S.draw.text(c,S.fmt(sums[j]),x0+cw*(j+.5),y3,{size:17,color:j===3?(sums[3]===0?P.green:P.red):P.acc});
      }
      if(step>=1) for(var j=1;j<=step&&j<4;j++) S.draw.arrow(c,x0+cw*(j-.5)+6,y3-14,x0+cw*(j+.5)-30,y2+12,P.amber,1.3);
      ro.set(0,poly(co));
      var Q=[sums[0],sums[1],sums[2]];
      ro.set(1, step>=3 ? poly(Q) : "…");
      ro.set(2, step>=3 ? S.fmt(sums[3]) : "…");
      if(step>=3){
        if(sums[3]===0) nt.set("Reste 0 : x "+(R<0?"+ "+S.fmt(-R):(R>0?"− "+S.fmt(R):""))+" divise P. On a P(x) = (x "+(R<0?"+ "+S.fmt(-R):(R>0?"− "+S.fmt(R):"+ 0"))+")·("+poly(Q)+").","ok");
        else nt.set("Reste "+S.fmt(sums[3])+" ≠ 0 : "+S.fmt(R)+" n'est pas une racine (P("+S.fmt(R)+") = "+S.fmt(sums[3])+").","warn");
      } else nt.set("Continue : avance de curseur « étape ».","");
    });
  }
});

/* ---------- racine carrée et aire ---------- */
function simp(n){ var out=1,rest=n; for(var f=2;f*f<=rest;f++){ while(rest%(f*f)===0){ rest/=f*f; out*=f; } } return [out,rest]; }
SFA.sim({
  id:"m4-c02-racine-aire", ch:"c02", tag:"Classique",
  titre:"Racine carrée = côté d'un carré",
  resume:"L'aire d'un carré grandit : son côté √A, sa forme simplifiée et la meilleure fraction pour l'approcher.",
  but:"Choisis l'aire A (entier). Observe le côté √A, sa forme simplifiée a√b, puis cherche une fraction p/q dont le carré tombe pile sur A en augmentant q.",
  aRetenir:"√A est le côté d'un carré d'aire A. On simplifie en sortant les carrés parfaits : √72 = √(36×2) = 6√2. Si A n'est pas un carré parfait, √A est irrationnel : aucune fraction n'a un carré égal à A.",
  piege:"√(a + b) n'est pas √a + √b : √(9 + 16) = 5, alors que √9 + √16 = 7.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.7});
    var A=k.slider("Aire A du carré",1,100,1,72,"u²");
    var q=k.slider("Dénominateur q de la fraction p/q",1,30,1,7,"");
    var ro=k.readouts(["Côté √A","Forme simplifiée","Meilleure fraction p/q","(p/q)² comparé à A"]);
    var nt=k.note("","");
    k.draw(function(){
      var a=A.value, s=Math.sqrt(a), sp=simp(a), Q=q.value, p=Math.round(s*Q);
      c.clear();
      var ctx=c.ctx, W=c.W,H=c.H, u=Math.min((W-30)/11,(H-30)/11);
      var ox=(W-u*10)/2, oy=(H-u*10)/2+6;
      ctx.strokeStyle="#edf0f4"; ctx.lineWidth=1;
      for(var i=0;i<=10;i++){ S.draw.line(c,ox+i*u,oy,ox+i*u,oy+10*u,"#e3e7ed",1); S.draw.line(c,ox,oy+i*u,ox+10*u,oy+i*u,"#e3e7ed",1); }
      ctx.fillStyle="rgba(30,63,143,.22)"; ctx.fillRect(ox,oy+(10-s)*u,s*u,s*u);
      ctx.strokeStyle=P.acc; ctx.lineWidth=2.5; ctx.strokeRect(ox,oy+(10-s)*u,s*u,s*u);
      S.draw.text(c,"côté = "+S.fmt(s,3),ox+s*u/2,oy+(10-s)*u-10,{color:P.acc,size:13});
      S.draw.text(c,"aire = "+a,ox+s*u/2,oy+(10-s)*u+s*u/2,{color:P.ink,size:14});
      var perfect = sp[0]*sp[0]===a;
      ro.set(0,S.fmt(s,4)+(perfect?"":"…"));
      ro.set(1, perfect ? "√"+a+" = "+sp[0] : (sp[0]===1 ? "√"+a+" (déjà simplifié)" : "√"+a+" = "+sp[0]+"√"+sp[1]));
      ro.set(2, p+"/"+Q+" = "+S.fmt(p/Q,4));
      var sq=p*p/(Q*Q);
      ro.set(3, S.fmt(sq,4)+" (écart "+S.fmt(sq-a,4)+")");
      if(perfect) nt.set(a+" est un carré parfait : √"+a+" = "+sp[0]+" est un entier.","ok");
      else nt.set("Même avec q = 30, (p/q)² reste différent de "+a+" : √"+a+" est irrationnel (développement décimal infini non périodique).","warn");
    });
  }
});

/* ---------- polynôme et graphe ---------- */
SFA.sim({
  id:"m4-c02-polynome-graphe", ch:"c02", tag:"Graphique",
  titre:"Racines, graphe et factorisation d'un polynôme",
  resume:"Déplace trois racines : le graphe, la forme factorisée et la forme développée se mettent à jour.",
  but:"Fais glisser les racines r₁, r₂, r₃ (même deux fois la même !). Regarde comment la courbe touche l'axe des x et comment les coefficients se calculent.",
  aRetenir:"P(x) = a(x − r₁)(x − r₂)(x − r₃) : les racines sont les abscisses où la courbe coupe l'axe. Une racine double fait seulement « toucher » l'axe sans le traverser.",
  piege:"Un facteur x − r a pour racine +r : (x + 2) correspond à la racine −2.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.75});
    var a=k.slider("coefficient dominant a",-2,2,1,1,"");
    var r1=k.slider("racine r₁",-4,4,1,-2,"");
    var r2=k.slider("racine r₂",-4,4,1,1,"");
    var r3=k.slider("racine r₃",-4,4,1,3,"");
    var ro=k.readouts(["Forme factorisée","Forme développée","P(0)"]);
    var nt=k.note("","");
    function fac(r){ return r===0?"x":(r>0?"(x − "+SFA.fmt(r)+")":"(x + "+SFA.fmt(-r)+")"); }
    k.draw(function(){
      var A=a.value||1, R=[r1.value,r2.value,r3.value];
      if(a.value===0){ A=1; }
      var s1=R[0]+R[1]+R[2], s2=R[0]*R[1]+R[0]*R[2]+R[1]*R[2], s3=R[0]*R[1]*R[2];
      var f=function(x){return A*(x-R[0])*(x-R[1])*(x-R[2]);};
      var mx=0; for(var x=-5;x<=5;x+=.1) mx=Math.max(mx,Math.abs(f(x)));
      var ym=Math.max(6,Math.ceil(mx*1.1/5)*5);
      c.clear();
      var ax=S.draw.axes(c,{x0:-5,x1:5,y0:-ym,y1:ym,xl:"x",yl:"y",stepX:1});
      S.draw.fn(c,ax,f,P.acc,3);
      R.forEach(function(r){ S.draw.dot(c,ax.X(r),ax.Y(0),6,P.red); });
      var fs=(A===1?"":(A===-1?"−":SFA.fmt(A)))+R.map(fac).join("");
      ro.set(0,"P(x) = "+fs);
      ro.set(1,"P(x) = "+poly([A,-A*s1,A*s2,-A*s3]));
      ro.set(2,S.fmt(-A*s3));
      var d=(R[0]===R[1])+(R[0]===R[2])+(R[1]===R[2]);
      nt.set(a.value===0?"Le coefficient dominant doit être non nul : on prend a = 1.":(d===3?"Racine triple : la courbe traverse l'axe en l'aplatissant (type x³).":(d>=1?"Racine double : la courbe touche l'axe sans le traverser.":"Trois racines distinctes : la courbe traverse l'axe trois fois.")),a.value===0?"warn":"");
    });
  }
});

/* ---------- coefficients indéterminés ---------- */
var TG = {
  t1:{n:"x³ + 2x² − 5x − 6", c:[2,-5,-6]},
  t2:{n:"x³ − 2x² + 2x + 5", c:[-2,2,5]},
  t3:{n:"x³ + 3x − 4", c:[0,3,-4]}
};
SFA.sim({
  id:"m4-c02-identification", ch:"c02", tag:"Défi",
  titre:"Coefficients indéterminés : (x + m)(x² + px + q)",
  resume:"Trouve m, p, q pour que le produit soit égal au polynôme cible, en lisant le système coefficient par coefficient.",
  but:"Choisis un polynôme cible. Règle m, p et q : les trois égalités (x², x, constante) passent au vert quand elles sont vérifiées.",
  aRetenir:"Deux polynômes sont égaux si et seulement si leurs coefficients de même degré sont égaux. (x + m)(x² + px + q) = x³ + (p + m)x² + (q + mp)x + mq.",
  piege:"Plusieurs triplets peuvent convenir : chaque racine entière de la cible donne une factorisation différente.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.62});
    var sel=k.select("Polynôme cible",Object.keys(TG).map(function(i){return [i,TG[i].n];}),"t1");
    var m=k.slider("m",-6,6,1,0,"");
    var p=k.slider("p",-6,6,1,0,"");
    var q=k.slider("q",-9,9,1,0,"");
    var nt=k.note("","");
    k.draw(function(){
      var T=TG[sel.value].c, M=m.value,Pp=p.value,Q=q.value;
      var got=[Pp+M, Q+M*Pp, M*Q];
      c.clear();
      var W=c.W,H=c.H;
      S.draw.text(c,"(x "+(M<0?"− "+S.fmt(-M):"+ "+S.fmt(M))+")(x² "+(Pp<0?"− "+S.fmt(-Pp):"+ "+S.fmt(Pp))+"x "+(Q<0?"− "+S.fmt(-Q):"+ "+S.fmt(Q))+")",W/2,H*.1,{size:15,math:true});
      S.draw.text(c,"= x³ + "+"(p + m)x² + (q + mp)x + mq",W/2,H*.2,{size:13,color:P.grey});
      var lab=["x²","x","constante"], form=["p + m","q + m·p","m·q"];
      var all=true;
      for(var i=0;i<3;i++){
        var ok=got[i]===T[i]; if(!ok) all=false;
        var y=H*(.36+i*.2);
        c.ctx.fillStyle = ok?"rgba(46,107,85,.18)":"rgba(180,35,24,.10)"; c.ctx.fillRect(10,y-H*.08,W-20,H*.16);
        S.draw.text(c,lab[i]+" :  "+form[i]+" = "+S.fmt(got[i])+(ok?"  =  ":"  ≠  ")+S.fmt(T[i]),W/2,y,{size:14,color:ok?P.green:P.red});
      }
      nt.set(all ? "Identification réussie : "+TG[sel.value].n+" = (x "+(M<0?"− "+S.fmt(-M):"+ "+S.fmt(M))+")(x² "+(Pp<0?"− "+S.fmt(-Pp):"+ "+S.fmt(Pp))+"x "+(Q<0?"− "+S.fmt(-Q):"+ "+S.fmt(Q))+"). Ici x = "+S.fmt(-M)+" est une racine." : "Fais passer les trois lignes au vert. Astuce : p + m est le coefficient de x² de la cible.",all?"ok":"");
    });
  }
});
})();
