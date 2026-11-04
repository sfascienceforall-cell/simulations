/* Chapitre 5 : inéquations du premier degré */
window.M3 = window.M3 || {};
/* résout (a x + b) op (c x + d) ; renvoie {all,none,op,bound} */
M3.solveIneq = function(a,b,c,d,op){
  var m=a-c, r=d-b, flip={"<":">","≤":"≥",">":"<","≥":"≤"};
  if(m===0){ var t={"<":b<d,"≤":b<=d,">":b>d,"≥":b>=d}[op]; return t?{all:true}:{none:true}; }
  return {op:m>0?op:flip[op], bound:r/m};
};
M3.interval = function(sol,S){
  if(sol.all) return "ℝ (tous les nombres)"; if(sol.none) return "∅ (aucun nombre)";
  var v=S.fmt(sol.bound,2);
  return {"<":"]−∞ ; "+v+"[","≤":"]−∞ ; "+v+"]",">":"]"+v+" ; +∞[","≥":"["+v+" ; +∞["}[sol.op];
};
M3.nline = function(c,S,o){
  /* droite numérique horizontale : o = {x0,x1,y,from,to,fo,to_o,mark,step} ; from/to = ±Infinity possibles */
  var ctx=c.ctx, L=26, R=c.W-26, y=o.y, P=S.draw.palette;
  function X(v){ return L+(v-o.x0)/(o.x1-o.x0)*(R-L); }
  ctx.save(); ctx.strokeStyle=P.grey; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(L-8,y); ctx.lineTo(R+8,y); ctx.stroke();
  ctx.font="600 11px Mulish, system-ui"; ctx.fillStyle="#5f6b7a"; ctx.textAlign="center"; ctx.textBaseline="top";
  var st=o.step||1; for(var v=Math.ceil(o.x0/st)*st; v<=o.x1+1e-9; v+=st){ ctx.beginPath(); ctx.moveTo(X(v),y-5); ctx.lineTo(X(v),y+5); ctx.stroke(); ctx.fillText(S.fmt(v,o.dec===undefined?2:o.dec),X(v),y+9); }
  if(o.from!==undefined){ var a=Math.max(o.x0,Math.min(o.x1,o.from)), b=Math.max(o.x0,Math.min(o.x1,o.to));
    if(b>=a&&!(o.to<o.x0)&&!(o.from>o.x1)){ ctx.strokeStyle=o.color||P.green; ctx.lineWidth=7; ctx.lineCap="butt"; ctx.beginPath(); ctx.moveTo(X(a),y); ctx.lineTo(X(b),y); ctx.stroke(); }
    [[o.from,o.fo],[o.to,o.too]].forEach(function(p){ if(isFinite(p[0])&&p[0]>=o.x0&&p[0]<=o.x1){ ctx.beginPath(); ctx.arc(X(p[0]),y,7,0,7); ctx.fillStyle=p[1]?"#fff":(o.color||P.green); ctx.fill(); ctx.strokeStyle=o.color||P.green; ctx.lineWidth=3; ctx.stroke(); } });
  }
  if(o.mark!==undefined){ S.draw.dot(c,X(o.mark),y,6,o.markColor||P.red); S.draw.text(c,S.fmt(o.mark,2),X(o.mark),y-18,{size:12,color:o.markColor||P.red}); }
  ctx.restore(); return X;
};
M3.range = function(sol,x0,x1){
  if(sol.all) return {from:x0-1,to:x1+1,fo:true,too:true};
  if(sol.none) return null;
  if(sol.op==="<"||sol.op==="≤") return {from:-Infinity,to:sol.bound,fo:true,too:sol.op==="<"};
  return {from:sol.bound,to:Infinity,fo:sol.op===">",too:true};
};
SFA.sim({
  id:"m3-c05-test", ch:"c05", tag:"Curseur-test", titre:"Teste un nombre : vrai ou faux ?",
  resume:"Fais glisser x sur la droite numérique et vois quand l'inéquation devient vraie.",
  but:"Choisis une inéquation, déplace x et repère la frontière. Compare avec l'intervalle trouvé par le calcul.",
  aRetenir:"La solution d'une inéquation est un ensemble de nombres, pas un seul. La frontière est incluse (crochet fermé) pour ≤ et ≥, exclue (crochet ouvert) pour < et >.",
  piege:"On écrit la réponse comme x < 4 ou ]−∞ ; 4[, jamais x = 4. Et au bord (x = 4), < est faux mais ≤ est vrai.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.45}), P=S.draw.palette;
    var PRE=[[3,-2,1,6,"<"],[3,-2,1,6,"≤"],[-2,1,0,5,"≥"],[2,3,2,7,">"],[1,4,3,-2,">"]];
    function side(a,b){ var s=""; if(a!==0) s+=(a===1?"":a===-1?"−":S.fmt(a,0))+"x"; if(b!==0||a===0){ s+= s===""?S.fmt(b,0):(b>0?" + ":" − ")+S.fmt(Math.abs(b),0);} return s; }
    var ps=k.select("Inéquation",PRE.map(function(p,i){return [i,side(p[0],p[1])+" "+p[4]+" "+side(p[2],p[3])];}),0);
    var x=k.slider("x",-10,10,0.5,0,"");
    var ro=k.readouts(["Membre gauche","Membre droit","Vrai ou faux ?","Solution"]);
    var nt=k.note("");
    k.draw(function(){
      c.clear(); var p=PRE[+ps.value], X=x.value, l=p[0]*X+p[1], r=p[2]*X+p[3];
      var ok={"<":l<r,"≤":l<=r,">":l>r,"≥":l>=r}[p[4]];
      var sol=M3.solveIneq(p[0],p[1],p[2],p[3],p[4]), rg=M3.range(sol,-10,10);
      var o={x0:-10,x1:10,y:c.H*0.62,mark:X,markColor:ok?P.green:P.red,color:P.green}; if(rg){o.from=rg.from;o.to=rg.to;o.fo=rg.fo;o.too=rg.too;}
      M3.nline(c,S,o);
      S.draw.text(c,ok?"VRAI":"FAUX",c.W/2,c.H*0.2,{size:24,color:ok?P.green:P.red});
      ro.set(0,S.fmt(l,2)); ro.set(1,S.fmt(r,2)); ro.set(2,ok?"vrai ✓":"faux ✗"); ro.set(3,M3.interval(sol,S));
      nt.set(sol.all?"Les x disparaissent et il reste une inégalité vraie : tous les nombres conviennent.":sol.none?"Les x disparaissent et il reste une inégalité fausse : aucun nombre ne convient.":"Zone verte : tous les x qui rendent l'inéquation vraie. Le rond est "+(sol.op==="<"||sol.op===">"?"vide (borne exclue)":"plein (borne incluse)")+".",sol.none?"warn":"ok");
    });
  }
});
SFA.sim({
  id:"m3-c05-graphe", ch:"c05", tag:"Graphique", titre:"f(x) > g(x) : où la courbe est-elle au-dessus ?",
  resume:"Deux droites : la solution est la partie de l'axe où l'une passe au-dessus de l'autre.",
  but:"Règle les droites et le sens, puis lis la zone solution colorée sur l'axe des x.",
  aRetenir:"Résoudre f(x) > g(x), c'est trouver les x où la droite de f est strictement au-dessus de celle de g. Le point d'intersection fournit la frontière.",
  piege:"La solution est une valeur de x (axe horizontal), pas une valeur de y.",
  build:function(k,S){
    var c=k.canvas(360), P=S.draw.palette;
    var a=k.slider("a (f : y = ax + b)",-3,3,0.5,1,""), b=k.slider("b",-6,6,1,-1,""), cc=k.slider("c (g : y = cx + d)",-3,3,0.5,-1,""), d=k.slider("d",-6,6,1,3,"");
    var op=k.seg("Inéquation",[[">","f(x) > g(x)"],["<","f(x) < g(x)"]],">");
    var ro=k.readouts(["Frontière","Solution"]);
    k.draw(function(){
      c.clear(); var A=a.value,B=b.value,C=cc.value,D=d.value;
      var ax=S.draw.axes(c,{x0:-8,x1:8,y0:-12,y1:12,xl:"x",yl:"y",stepX:2,stepY:4}), ctx=c.ctx;
      var sol=M3.solveIneq(A,B,C,D,op.value);
      var rg=M3.range(sol,-8,8);
      if(rg){ var f=Math.max(-8,rg.from), t=Math.min(8,rg.to);
        ctx.fillStyle="rgba(46,107,85,.16)"; ctx.fillRect(ax.X(f),ax.T,ax.X(t)-ax.X(f),ax.B-ax.T);
        ctx.strokeStyle=P.green; ctx.lineWidth=7; ctx.beginPath(); ctx.moveTo(ax.X(f),ax.Y(0)); ctx.lineTo(ax.X(t),ax.Y(0)); ctx.stroke(); }
      S.draw.fn(c,ax,function(x){return A*x+B;},P.acc,3); S.draw.fn(c,ax,function(x){return C*x+D;},P.red,3);
      function cl(y){ return Math.max(ax.T+10,Math.min(ax.B-10,y)); }
      S.draw.text(c,"f",ax.X(7)-4,cl(ax.Y(A*7+B)-10),{size:13,color:P.acc}); S.draw.text(c,"g",ax.X(7)-4,cl(ax.Y(C*7+D)+12),{size:13,color:P.red});
      if(A!==C){ var xs=(D-B)/(A-C); if(Math.abs(xs)<=8&&Math.abs(A*xs+B)<=12) S.draw.dot(c,ax.X(xs),ax.Y(A*xs+B),7,P.ink); ro.set(0,"x = "+S.fmt(xs,2)); } else ro.set(0,"droites parallèles");
      ro.set(1,M3.interval(sol,S));
    });
  }
});
SFA.sim({
  id:"m3-c05-signe", ch:"c05", tag:"Pourquoi le sens change", titre:"Multiplier par un négatif retourne l'ordre",
  resume:"Deux nombres p < q : que devient l'ordre quand on les multiplie ou qu'on ajoute k ?",
  but:"Place p et q, choisis ajouter ou multiplier, puis fais varier k. Regarde les positions et le signe < ou >.",
  aRetenir:"Ajouter ou soustraire un même nombre, ou multiplier par un nombre positif, conserve le sens. Multiplier (ou diviser) par un nombre négatif inverse le sens de l'inégalité.",
  piege:"−2x > 6 donne x < −3 (et non x > −3) : on divise par −2, donc on inverse.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.6}), P=S.draw.palette;
    var p=k.slider("p",-5,5,1,-2,""), q=k.slider("q",-5,5,1,3,"");
    var md=k.seg("Opération",[["add","Ajouter k"],["mul","Multiplier par k"]],"mul");
    var kk=k.slider("k",-4,4,1,-2,"");
    var ro=k.readouts(["Avant","Après"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var Pp=p.value,Q=q.value,K=kk.value,add=md.value==="add";
      var f=function(v){return add?v+K:v*K;};
      var lo=Math.min(Pp,Q,f(Pp),f(Q)), hi=Math.max(Pp,Q,f(Pp),f(Q)), m=Math.max(Math.abs(lo),Math.abs(hi),5);
      var x0=-Math.ceil(m/5)*5-0, x1=-x0; 
      M3.nline(c,S,{x0:x0,x1:x1,y:c.H*0.3,step:x1>=10?5:1,mark:Pp,markColor:P.acc});
      var X=M3.nline(c,S,{x0:x0,x1:x1,y:c.H*0.3,step:x1>=10?5:1});
      S.draw.dot(c,X(Q),c.H*0.3,6,P.red); S.draw.text(c,S.fmt(Q,0),X(Q),c.H*0.3-18,{size:12,color:P.red});
      M3.nline(c,S,{x0:x0,x1:x1,y:c.H*0.78,step:x1>=10?5:1,mark:f(Pp),markColor:P.acc});
      var X2=M3.nline(c,S,{x0:x0,x1:x1,y:c.H*0.78,step:x1>=10?5:1});
      S.draw.dot(c,X2(f(Q)),c.H*0.78,6,P.red); S.draw.text(c,S.fmt(f(Q),0),X2(f(Q)),c.H*0.78-18,{size:12,color:P.red});
      S.draw.text(c,"p (bleu) et q (rouge)",c.W/2,10,{size:12,color:P.grey}); S.draw.text(c,"après l'opération",c.W/2,c.H*0.55,{size:12,color:P.grey});
      var sb=Pp<Q?"<":Pp>Q?">":"=", sa=f(Pp)<f(Q)?"<":f(Pp)>f(Q)?">":"=";
      ro.set(0,S.fmt(Pp,0)+" "+sb+" "+S.fmt(Q,0)); ro.set(1,S.fmt(f(Pp),0)+" "+sa+" "+S.fmt(f(Q),0));
      if(sb!==sa&&sb!=="="&&sa!=="=") nt.set("Le sens est inversé : "+sb+" est devenu "+sa+" parce qu'on a multiplié par un négatif.","warn");
      else if(!add&&K===0) nt.set("Multiplier par 0 écrase tout sur 0 : on ne le fait jamais dans une inéquation.","warn");
      else nt.set("Le sens est conservé.","ok");
    });
  }
});
SFA.sim({
  id:"m3-c05-tolerance", ch:"c05", tag:"Tolérance", titre:"Pièce usinée : dans la tolérance ?",
  resume:"Une tige doit mesurer 10 mm à ± t près. Mesure-la : conforme ou rebut ?",
  but:"Règle la tolérance t et la mesure. Vérifie que « conforme » correspond à l'intervalle 10 − t ≤ x ≤ 10 + t.",
  aRetenir:"Une double inégalité 10 − t ≤ x ≤ 10 + t décrit un intervalle fermé [10 − t ; 10 + t]. Les bornes sont incluses : une pièce exactement à 10,05 mm est conforme si t = 0,05.",
  piege:"« À ±0,05 près » ne signifie pas « entre 0 et 0,05 » : la mesure peut être plus petite ou plus grande que 10.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.5}), P=S.draw.palette;
    var t=k.slider("Tolérance t",0.05,0.30,0.05,0.1,"mm"), x=k.slider("Mesure x",9.6,10.4,0.05,10.15,"mm");
    var ro=k.readouts(["Intervalle conforme","Mesure"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var T=t.value,X=x.value, lo=Math.round((10-T)*100)/100, hi=Math.round((10+T)*100)/100, ok=X>=lo-1e-9&&X<=hi+1e-9;
      M3.nline(c,S,{x0:9.6,x1:10.4,y:c.H*0.62,step:0.1,from:lo,to:hi,fo:false,too:false,mark:X,markColor:ok?P.green:P.red,color:P.green});
      S.draw.text(c,ok?"CONFORME":"REBUT",c.W/2,c.H*0.18,{size:24,color:ok?P.green:P.red});
      ro.set(0,"["+S.fmt(lo,2)+" ; "+S.fmt(hi,2)+"]"); ro.set(1,S.fmt(X,2)+" mm");
      nt.set(ok?S.fmt(lo,2)+" ≤ "+S.fmt(X,2)+" ≤ "+S.fmt(hi,2)+" : les deux inégalités sont vraies.":(X<lo?S.fmt(X,2)+" < "+S.fmt(lo,2)+" : trop petite.":S.fmt(X,2)+" > "+S.fmt(hi,2)+" : trop grande."),ok?"ok":"warn");
    });
  }
});
