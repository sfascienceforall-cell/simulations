(function(){
var P = SFA.draw.palette;
function pv(v,d){ return v<0 ? "("+SFA.fmt(v,d===undefined?3:d)+")" : SFA.fmt(v,d===undefined?3:d); }
function term(v,sym,first){
  if(Math.abs(v)<1e-12) return "";
  var a=Math.abs(v), s = first ? (v<0?"−":"") : (v<0?" − ":" + ");
  var num = (a===1 && sym) ? "" : SFA.fmt(a,3);
  return s+num+sym;
}
function eq(a,b,c){ var s=term(a,"x²",true); s+=term(b,"x",s===""); s+=term(c,"",s===""); return (s||"0")+" = 0"; }

SFA.sim({
  id:"m4-c04-delta", ch:"c04", tag:"Classique",
  titre:"Δ, le nombre de solutions et la parabole",
  resume:"Fais monter ou descendre la parabole : Δ change de signe en même temps que le nombre de points sur l'axe x.",
  but:"Fais varier c (et essaie a, b). Observe Δ = b² − 4ac, le nombre de solutions et les points d'intersection avec l'axe x. Défi : règle c pour obtenir Δ = 0.",
  aRetenir:"Δ > 0 : deux solutions (la parabole coupe l'axe x deux fois). Δ = 0 : une solution double (le sommet est sur l'axe x). Δ < 0 : aucune solution réelle (la parabole ne touche pas l'axe).",
  piege:"Dans Δ = b² − 4ac, b² est toujours positif : (−3)² = 9, et non −9. Fais attention au signe de c et de a dans le produit 4ac.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.78});
    var a=k.slider("a",-3,3,0.5,1,"");
    var b=k.slider("b",-6,6,1,-2,"");
    var cc=k.slider("c",-8,8,0.5,-3,"");
    var ro=k.readouts(["Équation","Δ = b² − 4ac","Nombre de solutions","Solutions"]);
    var nt=k.note("","");
    k.draw(function(){
      var A=a.value,B=b.value,C=cc.value;
      c.clear();
      var ax=S.draw.axes(c,{x0:-8,x1:8,y0:-8,y1:8,xl:"x",yl:"y",stepX:2,stepY:2});
      var f=function(x){return A*x*x+B*x+C;};
      S.draw.fn(c,ax,f,P.acc,3);
      ro.set(0,"y = "+eq(A,B,C).replace(" = 0",""));
      if(A===0){ ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"a = 0 : équation du 1er degré"); nt.set("Pour a = 0, on n'a plus une équation du 2e degré : bx + c = 0.","warn"); return; }
      var D=B*B-4*A*C;
      ro.set(1,S.fmt(D,2));
      if(D>0){ var r=Math.sqrt(D), x1=(-B-r)/(2*A), x2=(-B+r)/(2*A); [x1,x2].forEach(function(x){ S.draw.dot(c,ax.X(x),ax.Y(0),7,P.green); });
        ro.set(2,"2 (Δ > 0)"); ro.set(3,S.fmt(Math.min(x1,x2),3)+" et "+S.fmt(Math.max(x1,x2),3)); nt.set("Δ > 0 : la parabole coupe l'axe x en deux points.","ok"); }
      else if(D===0){ var x0=-B/(2*A); S.draw.dot(c,ax.X(x0),ax.Y(0),8,P.amber); ro.set(2,"1 (solution double)"); ro.set(3,"x = "+S.fmt(x0,3)); nt.set("Δ = 0 : la parabole touche l'axe x en son sommet.","warn"); }
      else { ro.set(2,"0 (Δ < 0)"); ro.set(3,"aucune dans ℝ"); nt.set("Δ < 0 : la parabole ne rencontre pas l'axe x.","warn"); }
    });
  }
});

/* ---------- balayage de formule ---------- */
SFA.sim({
  id:"m4-c04-formule", ch:"c04", tag:"Méthode",
  titre:"La formule pas à pas, avec tes valeurs",
  resume:"Change a, b, c : chaque étape (Δ, √Δ, x₁, x₂, vérification) se recalcule.",
  but:"Choisis a, b et c. Lis les étapes de résolution : elles montrent où se glissent les erreurs de signe. Vérifie que les solutions annulent bien le trinôme.",
  aRetenir:"x = (−b ± √Δ) / (2a) avec Δ = b² − 4ac. On calcule Δ d'abord, puis √Δ, puis les deux solutions. On vérifie toujours en remplaçant dans l'équation.",
  piege:"Le dénominateur est 2a pour TOUT le numérateur, pas seulement pour √Δ. Et −b change le signe de b : si b = −3, alors −b = 3.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.5});
    var a=k.slider("a",-4,4,1,2,"");
    var b=k.slider("b",-9,9,1,-3,"");
    var cc=k.slider("c",-9,9,1,-5,"");
    var nt=k.note("","");
    k.draw(function(){
      var A=a.value,B=b.value,C=cc.value;
      c.clear();
      var ax=S.draw.axes(c,{x0:-6,x1:6,y0:-8,y1:8,xl:"x",yl:"y",stepX:2,stepY:4});
      if(A===0){ nt.set("a = 0 n'est pas permis pour une équation du 2e degré. Choisis a ≠ 0.","warn"); S.draw.fn(c,ax,function(x){return B*x+C;},P.acc,3); return; }
      S.draw.fn(c,ax,function(x){return A*x*x+B*x+C;},P.acc,3);
      var D=B*B-4*A*C, h="<b>Équation : "+eq(A,B,C)+"</b><br>";
      h+="<b>1.</b> Δ = b² − 4ac = "+pv(B)+"² − 4×"+pv(A)+"×"+pv(C)+" = "+S.fmt(B*B)+" − ("+S.fmt(4*A*C)+") = <b>"+S.fmt(D)+"</b><br>";
      var kind="ok";
      if(D<0){ h+="<b>2.</b> Δ < 0 : pas de racine carrée dans ℝ, donc <b>aucune solution réelle</b>."; kind="warn"; }
      else {
        var r=Math.sqrt(D), exact=Number.isInteger(r), x1=(-B-r)/(2*A), x2=(-B+r)/(2*A);
        h+="<b>2.</b> √Δ "+(exact?"= ":"≈ ")+S.fmt(r,3)+"<br>";
        if(D===0){ h+="<b>3.</b> Δ = 0 : x = −b/(2a) = "+S.fmt(-B)+"/"+S.fmt(2*A)+" = <b>"+S.fmt(x1,3)+"</b> (solution double)."; kind="warn"; S.draw.dot(c,ax.X(x1),ax.Y(0),7,P.amber); }
        else {
          h+="<b>3.</b> x₁ = (−b − √Δ)/(2a) = ("+S.fmt(-B)+" − "+S.fmt(r,3)+")/"+S.fmt(2*A)+" "+(exact?"= ":"≈ ")+"<b>"+S.fmt(x1,3)+"</b><br>";
          h+="<b>4.</b> x₂ = (−b + √Δ)/(2a) = ("+S.fmt(-B)+" + "+S.fmt(r,3)+")/"+S.fmt(2*A)+" "+(exact?"= ":"≈ ")+"<b>"+S.fmt(x2,3)+"</b><br>";
          var v1=A*x1*x1+B*x1+C, v2=A*x2*x2+B*x2+C;
          h+="Vérification : a·x₁² + b·x₁ + c ≈ "+S.fmt(Math.abs(v1)<1e-9?0:v1,3)+" et a·x₂² + b·x₂ + c ≈ "+S.fmt(Math.abs(v2)<1e-9?0:v2,3)+".";
          S.draw.dot(c,ax.X(x1),ax.Y(0),7,P.green); S.draw.dot(c,ax.X(x2),ax.Y(0),7,P.green);
        }
      }
      nt.set(h,kind);
    });
  }
});

/* ---------- somme et produit ---------- */
SFA.sim({
  id:"m4-c04-somme-produit", ch:"c04", tag:"Manipuler",
  titre:"Somme et produit des racines",
  resume:"Place deux racines sur l'axe : la somme S, le produit P et l'équation x² − Sx + P = 0 en découlent.",
  but:"Déplace les racines r₁ et r₂ (curseurs ou en touchant l'axe). Vérifie que S = r₁ + r₂ = −b/a et P = r₁·r₂ = c/a. Défi : trouve deux nombres de somme 5 et de produit 6.",
  aRetenir:"Si r₁ et r₂ sont les racines de ax² + bx + c = 0 : r₁ + r₂ = −b/a et r₁ · r₂ = c/a. Inversement, x² − Sx + P = 0 admet les racines de somme S et de produit P.",
  piege:"La somme vaut −b/a (avec le signe moins) : pour x² − 7x + 10 = 0, S = +7 et P = +10, pas −7.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.72});
    var r1=k.slider("racine r₁",-6,6,0.5,-1,"");
    var r2=k.slider("racine r₂",-6,6,0.5,4,"");
    var am=k.seg("Coefficient a",[[1,"1"],[2,"2"],[-1,"−1"],[3,"3"]],1);
    var ro=k.readouts(["Somme S","Produit P","Équation (a)(x² − Sx + P) = 0"]);
    var nt=k.note("","");
    var ax=null, sel=0;
    c.pointer(function(t,p){ if(!ax)return; var x=Math.max(-6,Math.min(6,Math.round(ax.ix(p.x)*2)/2));
      if(t==="down"){ sel = Math.abs(x-r1.value)<=Math.abs(x-r2.value)?0:1; }
      if(t==="down"||t==="drag"){ (sel===0?r1:r2).set(x); k.redraw(); } });
    k.draw(function(){
      var R1=r1.value,R2=r2.value,A=Number(am.value), Ss=R1+R2, Pp=R1*R2;
      c.clear();
      ax=S.draw.axes(c,{x0:-8,x1:8,y0:-10,y1:20,xl:"x",yl:"y",stepX:2,stepY:5});
      S.draw.fn(c,ax,function(x){return A*(x-R1)*(x-R2);},P.acc,3);
      S.draw.dot(c,ax.X(R1),ax.Y(0),8,P.red); S.draw.dot(c,ax.X(R2),ax.Y(0),8,P.green);
      S.draw.text(c,"r₁",ax.X(R1),ax.Y(0)+16,{color:P.red,size:12}); S.draw.text(c,"r₂",ax.X(R2),ax.Y(0)+16,{color:P.green,size:12});
      ro.set(0,S.fmt(Ss,2)+" = −b/a = "+S.fmt(-(-A*Ss)/A,2)); ro.set(1,S.fmt(Pp,2)+" = c/a = "+S.fmt(A*Pp/A,2));
      ro.set(2,eq(A,-A*Ss,A*Pp));
      nt.set(Ss===5&&Pp===6?"Défi réussi : S = 5 et P = 6 donnent x² − 5x + 6 = 0, de racines 2 et 3.":"Défi : trouve deux nombres de somme 5 et de produit 6.",Ss===5&&Pp===6?"ok":"");
    });
  }
});

/* ---------- bicarrée ---------- */
SFA.sim({
  id:"m4-c04-bicarree", ch:"c04", tag:"Original",
  titre:"Équation bicarrée : x⁴ + bx² + c = 0",
  resume:"On pose X = x² : une équation du 2e degré en X, puis on revient à x. 0, 2 ou 4 solutions !",
  but:"Fais varier b et c. Lis les valeurs de X, élimine celles qui sont négatives (un carré ne peut pas être négatif), puis compte les solutions x sur le graphe de y = x⁴ + bx² + c.",
  aRetenir:"Substitution X = x² (X ≥ 0). On résout X² + bX + c = 0 ; chaque X > 0 donne deux solutions x = ±√X, X = 0 donne x = 0, et X < 0 est rejeté.",
  piege:"Ne t'arrête pas aux valeurs de X : il faut revenir à x, et rejeter X < 0. Une équation bicarrée peut avoir 0, 1, 2, 3 ou 4 solutions.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.75});
    var b=k.slider("b",-10,10,1,-5,"");
    var cc=k.slider("c",-12,12,1,-6,"");
    var ro=k.readouts(["Équation en X","Δ","Valeurs de X","Solutions x"]);
    var nt=k.note("","");
    k.draw(function(){
      var B=b.value,C=cc.value, D=B*B-4*C;
      c.clear();
      var ax=S.draw.axes(c,{x0:-5,x1:5,y0:-14,y1:24,xl:"x",yl:"y",stepX:1,stepY:10});
      S.draw.fn(c,ax,function(x){return Math.pow(x,4)+B*x*x+C;},P.acc,3);
      ro.set(0,"X² "+(B<0?"− "+S.fmt(-B):(B>0?"+ "+S.fmt(B):"+ 0"))+"X "+(C<0?"− "+S.fmt(-C):"+ "+S.fmt(C))+" = 0 (X = x²)");
      ro.set(1,S.fmt(D));
      var Xs=[], xs=[];
      if(D>0){ Xs=[(-B-Math.sqrt(D))/2,(-B+Math.sqrt(D))/2]; } else if(D===0){ Xs=[-B/2]; }
      var txt=Xs.map(function(X){ return S.fmt(X,3)+(X<0?" (rejeté)":""); }).join(" ; ");
      Xs.forEach(function(X){ if(X>1e-12){ xs.push(-Math.sqrt(X),Math.sqrt(X)); } else if(Math.abs(X)<=1e-12) xs.push(0); });
      xs.sort(function(p,q){return p-q;});
      xs.forEach(function(x){ S.draw.dot(c,ax.X(x),ax.Y(0),7,P.green); });
      ro.set(2, Xs.length?txt:"aucune (Δ < 0)");
      ro.set(3, xs.length ? xs.map(function(x){return S.fmt(x,3);}).join(" ; ") : "aucune");
      nt.set(xs.length===0?"Aucune solution réelle : la courbe ne touche pas l'axe x.":(xs.length+" solution"+(xs.length>1?"s":"")+" réelle"+(xs.length>1?"s":"")+" : la courbe coupe l'axe x en "+xs.length+" point"+(xs.length>1?"s":"")+"."),xs.length===0?"warn":"ok");
    });
  }
});

/* ---------- rectangle d'or ---------- */
SFA.sim({
  id:"m4-c04-nombre-or", ch:"c04", tag:"Niche",
  titre:"Le rectangle d'or et une équation du 2e degré",
  resume:"Retire un carré d'un rectangle : à quel rapport a/b le petit rectangle restant est-il semblable au grand ?",
  but:"Règle le rapport r = a/b. On retire un carré de côté b : il reste un rectangle de rapport 1/(r − 1). Cherche r pour que ce rapport soit égal à r (rectangle d'or).",
  aRetenir:"Le rectangle restant est semblable au premier si r = 1/(r − 1), soit r² − r − 1 = 0. Δ = 5 et r = (1 + √5)/2 ≈ 1,618 (nombre d'or φ). L'autre solution (1 − √5)/2 ≈ −0,618 est négative : rejetée pour un rapport de longueurs.",
  piege:"Une équation du 2e degré peut avoir une solution sans signification géométrique : un rapport de longueurs est positif, donc on rejette (1 − √5)/2.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.66});
    var r=k.slider("Rapport r = a/b",1.2,2.2,0.001,1.4,"");
    var ro=k.readouts(["Rapport du petit rectangle","r² − r − 1","Écart"]);
    var nt=k.note("","");
    var PHI=(1+Math.sqrt(5))/2;
    k.draw(function(){
      var R=r.value; c.clear();
      var W=c.W,H=c.H, ctx=c.ctx;
      var w=Math.min(W-20,(H-20)*R), h=w/R;
      var x=(W-w)/2, y=(H-h)/2, cw=w, ch=h;
      var cols=["rgba(30,63,143,.22)","rgba(180,83,9,.22)","rgba(46,107,85,.22)","rgba(91,33,182,.20)"];
      var X=x,Y=y,Wd=cw,Ht=ch;
      ctx.strokeStyle=P.ink; ctx.lineWidth=2; ctx.strokeRect(x,y,cw,ch);
      for(var i=0;i<7;i++){
        var s=Math.min(Wd,Ht); if(s<4) break;
        var sx,sy;
        if(Wd>=Ht){ if(i%4===0){ sx=X; sy=Y; X+=s; } else { sx=X+Wd-s; sy=Y; } Wd-=s; if(i%4!==0){} }
        else { if(i%4===1){ sx=X; sy=Y; Y+=s; } else { sx=X; sy=Y+Ht-s; } Ht-=s; }
        ctx.fillStyle=cols[i%4]; ctx.fillRect(sx,sy,s,s); ctx.strokeStyle=P.ink; ctx.lineWidth=1.2; ctx.strokeRect(sx,sy,s,s);
      }
      ctx.strokeStyle=P.red; ctx.lineWidth=3; ctx.setLineDash([6,4]); ctx.strokeRect(x+ch,y,cw-ch,ch); ctx.setLineDash([]);
      var rp=1/(R-1), g=R*R-R-1;
      ro.set(0,S.fmt(rp,3)+" (grand : "+S.fmt(R,3)+")"); ro.set(1,S.fmt(g,4)); ro.set(2,S.fmt(Math.abs(R-PHI),4));
      nt.set(Math.abs(R-PHI)<0.0015 ? "Rectangle d'or : r ≈ 1,618 ! Le petit rectangle (pointillés) est semblable au grand, et le motif se répète à l'infini." : (R<PHI?"r trop petit : le petit rectangle est trop allongé (son rapport dépasse r).":"r trop grand : le petit rectangle est trop trapu (son rapport est inférieur à r)."), Math.abs(R-PHI)<0.0015?"ok":"");
    });
  }
});
})();
