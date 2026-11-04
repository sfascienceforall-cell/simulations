/* Chapitre 2 : fonctions, graphiques, tableaux, formules */
SFA.sim({
  id:"m3-c02-machine", ch:"c02", tag:"Image et antécédent", titre:"La machine à fonctions",
  resume:"Entre x, lis f(x). Puis fais l'inverse : cherche les antécédents d'une valeur.",
  but:"Choisis une fonction, déplace x et regarde le point. Active la recherche d'antécédents et déplace la droite horizontale.",
  aRetenir:"L'image de x est f(x) : on part de x et on lit y. Un antécédent de y est un x qui donne cette valeur y : il peut y en avoir 0, 1, 2 ou plus.",
  piege:"Le point (3 ; −1) signifie f(3) = −1 : 3 est l'abscisse (antécédent), −1 est l'ordonnée (image). Ne les inverse pas.",
  build:function(k,S){
    var c=k.canvas(380), P=S.draw.palette;
    var F=[
      {n:"f(x) = 2x − 1",f:function(x){return 2*x-1},ant:function(y){return [(y+1)/2]}},
      {n:"f(x) = x² − 4",f:function(x){return x*x-4},ant:function(y){return y+4<0?[]:(y+4===0?[0]:[-Math.sqrt(y+4),Math.sqrt(y+4)])}},
      {n:"f(x) = 6 / x",f:function(x){return x===0?NaN:6/x},ant:function(y){return y===0?[]:[6/y]}}
    ];
    var fs=k.select("Fonction",F.map(function(o,i){return [i,o.n];}),0);
    var x=k.slider("x",-6,6,0.5,2,"");
    var tg=k.toggle("Chercher les antécédents d'une valeur y",false);
    var y=k.slider("y cherché",-8,8,0.5,3,"");
    var tb=k.toggle("Montrer le tableau",false);
    var ro=k.readouts(["x","Image f(x)","Antécédents de y"]);
    var nt=k.note("");
    k.draw(function(){
      c.clear(); var o=F[+fs.value], X=x.value, Y=o.f(X), ctx=c.ctx;
      var top=tb.value?58:16;
      var ax=S.draw.axes(c,{x0:-6,x1:6,y0:-8,y1:8,xl:"x",yl:"y",stepX:1,stepY:2,t:top});
      S.draw.fn(c,ax,o.f,P.acc,2.6);
      if(isFinite(Y)){
        S.draw.line(c,ax.X(X),ax.Y(0),ax.X(X),ax.Y(Y),P.amber,1.5,[4,4]);
        S.draw.line(c,ax.X(0),ax.Y(Y),ax.X(X),ax.Y(Y),P.amber,1.5,[4,4]);
        S.draw.dot(c,ax.X(X),ax.Y(Y),6,P.red);
      }
      var A=o.ant(y.value), as="—";
      if(tg.value){
        S.draw.line(c,ax.L,ax.Y(y.value),ax.R,ax.Y(y.value),P.green,1.5,[6,4]);
        A.forEach(function(a){ if(a>=-6&&a<=6){ S.draw.dot(c,ax.X(a),ax.Y(y.value),6,P.green); S.draw.line(c,ax.X(a),ax.Y(y.value),ax.X(a),ax.Y(0),P.green,1.5,[3,3]); } });
        as=A.length?A.map(function(a){return S.fmt(a,2);}).join(" ; "):"aucun";
      }
      if(tb.value){
        var w=(c.W-20)/7;
        for(var i=0;i<7;i++){ var xv=i-3, yv=o.f(xv), cx=10+w*i+w/2;
          ctx.strokeStyle=P.light; ctx.strokeRect(10+w*i,8,w,22); ctx.strokeRect(10+w*i,30,w,22);
          S.draw.text(c,S.fmt(xv,0),cx,19,{size:12,color:P.grey}); S.draw.text(c,isFinite(yv)?S.fmt(yv,1):"—",cx,41,{size:12,color:P.ink}); }
      }
      ro.set(0,S.fmt(X,1)); ro.set(1,isFinite(Y)?S.fmt(Y,2):"n'existe pas"); ro.set(2,as);
      if(!isFinite(Y)) nt.set("x = 0 est interdit pour 6/x : on ne divise pas par zéro. Le nombre 0 n'a donc pas d'image.","warn");
      else if(tg.value&&!A.length) nt.set("Aucun antécédent pour y = "+S.fmt(y.value,1)+" : la droite verte ne touche pas la courbe.","warn");
      else if(tg.value) nt.set(A.length+" antécédent(s) pour y = "+S.fmt(y.value,1)+" : tous les x où la droite verte coupe la courbe.","ok");
      else nt.set("Le point rouge a pour coordonnées ("+S.fmt(X,1)+" ; "+S.fmt(Y,2)+").","");
    });
  }
});
SFA.sim({
  id:"m3-c02-vase", ch:"c02", tag:"Histoire-graphe", titre:"Le vase qui se remplit",
  resume:"Un robinet à débit constant remplit des vases différents : quel graphique hauteur–temps ?",
  but:"Choisis la forme du vase, lance le remplissage et regarde la courbe se tracer. Où le niveau monte-t-il le plus vite ? (Modèle simplifié : vase vu de face, de profondeur constante, donc la largeur dessinée est proportionnelle à la section.)",
  aRetenir:"Le niveau monte vite là où le vase est étroit, lentement là où il est large. La pente de la courbe hauteur–temps lit cette vitesse.",
  piege:"Le graphique n'est pas une photo du vase : c'est la hauteur de l'eau en fonction du temps, pas la forme du récipient.",
  build:function(k,S){
    var c=k.canvas(320), P=S.draw.palette;
    var W={cyl:function(h){return 0.6;},evase:function(h){return 0.25+0.75*h;},effile:function(h){return 1-0.75*h;},sab:function(h){return 0.9-1.4*Math.min(h,1-h);}};
    var N=400, cum={};
    Object.keys(W).forEach(function(n){ var a=[0]; for(var i=1;i<=N;i++){ a.push(a[i-1]+(W[n]((i-.5)/N))/N); } cum[n]=a; });
    function level(n,t){ var a=cum[n], tgt=a[N]*t/10, lo=0; for(var i=0;i<=N;i++){ if(a[i]>=tgt){ lo=i; break; } lo=i; }
      if(lo===0) return 0; var f=(tgt-a[lo-1])/(a[lo]-a[lo-1]); return (lo-1+f)/N; }
    var sh=k.seg("Forme du vase",[["cyl","Cylindre"],["evase","Large en haut"],["effile","Étroit en haut"],["sab","Sablier"]],"cyl");
    var t=k.slider("Temps t",0,10,0.1,0,"s");
    var lp=k.loop(function(dt){ var v=t.value+dt*1.5; if(v>=10){ v=10; lp.pause(); } t.set(v); k.redraw(); });
    k.button("Lancer / pause",function(){ if(t.value>=10) t.set(0); if(lp.running) lp.pause(); else lp.play(); },true);
    k.button("Remettre à zéro",function(){ lp.pause(); t.set(0); });
    var ro=k.readouts(["Hauteur h (sur 1)","Largeur à ce niveau","Montée relative"]);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, n=sh.value, T=t.value, h=level(n,T);
      var vw=Math.min(c.W*0.3,120), vx=14+vw/2, vb=c.H-30, vh=c.H-60;
      function path(){ ctx.beginPath(); for(var i=0;i<=40;i++){ ctx.lineTo(vx-W[n](i/40)*vw/2, vb-i/40*vh); } for(i=40;i>=0;i--){ ctx.lineTo(vx+W[n](i/40)*vw/2, vb-i/40*vh); } ctx.closePath(); }
      path(); ctx.fillStyle="#f3f6fb"; ctx.fill();
      ctx.save(); path(); ctx.clip(); ctx.fillStyle="rgba(30,63,143,.55)"; ctx.fillRect(0,vb-h*vh,c.W,h*vh+2); ctx.restore();
      path(); ctx.strokeStyle=P.ink; ctx.lineWidth=2; ctx.stroke();
      var L=vx+vw/2+46, ax=S.draw.axes(c,{x0:0,x1:10,y0:0,y1:1,xl:"t (s)",yl:"h",stepX:2,stepY:0.5,l:L,t:16,b:30});
      var pts=[]; S.draw.fn(c,ax,function(tt){return level(n,tt);},"#c9d3e6",2);
      ctx.save(); ctx.strokeStyle=P.acc; ctx.lineWidth=3; ctx.beginPath(); for(var s=0;s<=T+1e-9;s+=0.1){ var px=ax.X(s),py=ax.Y(level(n,s)); if(s===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); } ctx.stroke(); ctx.restore();
      S.draw.dot(c,ax.X(T),ax.Y(h),6,P.red);
      var w=W[n](h); ro.set(0,S.fmt(h,2)); ro.set(1,S.fmt(w,2)+" (max 1)"); ro.set(2,"×"+S.fmt(0.6/w,2));
    });
  }
});
SFA.sim({
  id:"m3-c02-verticale", ch:"c02", tag:"Est-ce une fonction ?", titre:"Le test de la droite verticale",
  resume:"Fais glisser une droite verticale sur une courbe et compte les points d'intersection.",
  but:"Choisis une courbe, déplace la droite verticale (ou balaye-la) et note combien de points elle touche.",
  aRetenir:"Une courbe est le graphique d'une fonction si chaque droite verticale la coupe en 0 ou 1 point : un x a au plus une image.",
  piege:"Une droite verticale qui ne touche pas la courbe ne contredit rien : le nombre x n'est simplement pas dans le domaine (comme 0 pour 4/x).",
  build:function(k,S){
    var c=k.canvas(340), P=S.draw.palette;
    var C=[
      {n:"y = x²/2 − 2",fn:true,ys:function(x){return [x*x/2-2];},d:function(y){return null;}},
      {n:"Cercle x² + y² = 9",fn:false,ys:function(x){return Math.abs(x)>3?[]:(Math.abs(x)===3?[0]:[-Math.sqrt(9-x*x),Math.sqrt(9-x*x)]);}},
      {n:"Parabole couchée x = y²/2 − 2",fn:false,ys:function(x){return x<-2?[]:(x===-2?[0]:[-Math.sqrt(2*(x+2)),Math.sqrt(2*(x+2))]);}},
      {n:"y = |x| − 1",fn:true,ys:function(x){return [Math.abs(x)-1];}},
      {n:"y = 4 / x",fn:true,ys:function(x){return x===0?[]:[4/x];}}
    ];
    var cs=k.select("Courbe",C.map(function(o,i){return [i,o.n];}),0);
    var x0=k.slider("Droite verticale x =",-5,5,0.5,0,"");
    var lp=k.loop(function(dt){ var v=x0.value+dt*1.2*dir; if(v>=5){v=5;dir=-1;} if(v<=-5){v=-5;dir=1;} x0.set(v); k.redraw(); }), dir=1;
    k.button("Balayer / pause",function(){ if(lp.running) lp.pause(); else lp.play(); },true);
    var ro=k.readouts(["Valeur de x","Points d'intersection"]);
    var nt=k.note("");
    k.draw(function(){
      c.clear(); var o=C[+cs.value], X=x0.value;
      var ax=S.draw.axes(c,{x0:-5,x1:5,y0:-5,y1:5,xl:"x",yl:"y",stepX:1,stepY:1}), ctx=c.ctx;
      var i=+cs.value;
      if(i===0) S.draw.fn(c,ax,function(x){return x*x/2-2;},P.acc,2.6);
      if(i===1){ ctx.strokeStyle=P.acc; ctx.lineWidth=2.6; ctx.beginPath(); ctx.ellipse(ax.X(0),ax.Y(0),ax.X(3)-ax.X(0),ax.Y(0)-ax.Y(3),0,0,7); ctx.stroke(); }
      if(i===2){ ctx.strokeStyle=P.acc; ctx.lineWidth=2.6; ctx.beginPath(); for(var y=-5;y<=5.001;y+=0.05){ var px=ax.X(y*y/2-2),py=ax.Y(y); if(y===-5) ctx.moveTo(px,py); else ctx.lineTo(px,py);} ctx.stroke(); }
      if(i===3) S.draw.fn(c,ax,function(x){return Math.abs(x)-1;},P.acc,2.6);
      if(i===4) S.draw.fn(c,ax,function(x){return x===0?NaN:4/x;},P.acc,2.6);
      S.draw.line(c,ax.X(X),ax.T,ax.X(X),ax.B,P.red,2,[6,4]);
      var Y=o.ys(X); Y.forEach(function(y){ if(y>=-5&&y<=5) S.draw.dot(c,ax.X(X),ax.Y(y),6,P.red); });
      var inside=Y.filter(function(y){return y>=-5&&y<=5;}).length;
      ro.set(0,S.fmt(X,1)); ro.set(1,Y.length+(Y.length&&inside<Y.length?" (certains hors du cadre)":""));
      if(Y.length>=2) nt.set("Pour x = "+S.fmt(X,1)+" il y a "+Y.length+" valeurs de y : un même x aurait deux images. Ce n'est pas une fonction.","bad");
      else if(Y.length===0) nt.set("Aucun point : "+S.fmt(X,1)+" n'a pas d'image (hors du domaine). Cela n'empêche pas d'être une fonction.","warn");
      else nt.set("Un seul point : pour l'instant, rien n'empêche que ce soit une fonction. Essaie d'autres x.","ok");
    });
  }
});
SFA.sim({
  id:"m3-c02-parking", ch:"c02", tag:"Fonction en escalier", titre:"Tarif de parking : une fonction qui saute",
  resume:"Gratuit 30 minutes, puis 1,50 € par heure entamée, plafonné à 9 €. Où la courbe saute-t-elle ?",
  but:"Fais varier la durée. Cherche la plus longue durée pour payer exactement 4,50 €.",
  aRetenir:"Une heure entamée est due en entier : le prix est constant sur chaque palier puis saute. Sur le graphique, un rond plein marque la valeur prise, un rond vide la valeur non prise.",
  piege:"On ne relie pas les paliers par des segments obliques : il n'y a pas de prix intermédiaire entre 1,50 € et 3 €.",
  build:function(k,S){
    var c=k.canvas(330), P=S.draw.palette;
    function prix(d){ var D=Math.round(d*10), e=D-5; if(e<=0) return 0; return Math.min(9, 1.5*Math.ceil(e/10)); }
    var d=k.slider("Durée de stationnement",0,10,0.1,1,"h");
    var ro=k.readouts(["Durée","Prix à payer","Prix 6 min plus tard"]);
    var nt=k.note("Défi : trouve la durée maximale pour payer 4,50 €.");
    k.draw(function(){
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:10,y0:0,y1:10,xl:"durée (h)",yl:"prix (€)",stepX:1,stepY:1}), D=d.value, pr=prix(D);
      for(var j=0;j<=7;j++){
        var xa=j===0?0:0.5+j-1, xb=0.5+j, v=j===0?0:Math.min(9,1.5*j);
        if(j===7){ xa=6.5; xb=10; v=9; }
        S.draw.line(c,ax.X(xa),ax.Y(v),ax.X(xb),ax.Y(v),P.acc,3);
        if(j>0&&j<7){ var ctx=c.ctx; ctx.beginPath(); ctx.arc(ax.X(xa),ax.Y(v),4,0,7); ctx.fillStyle="#fff"; ctx.fill(); ctx.strokeStyle=P.acc; ctx.lineWidth=2; ctx.stroke(); }
        if(j<7) S.draw.dot(c,ax.X(xb),ax.Y(v),4,P.acc);
      }
      S.draw.dot(c,ax.X(D),ax.Y(pr),7,P.red);
      ro.set(0,S.fmt(D,1)+" h"); ro.set(1,S.fmt(pr,2)+" €"); ro.set(2,S.fmt(prix(D+0.1),2)+" €");
      if(pr===4.5&&prix(D+0.1)>4.5) nt.set("Exactement : "+S.fmt(D,1)+" h (3 h 30) est la durée maximale pour 4,50 €. Six minutes de plus et le prix saute à 6 €.","ok");
      else if(pr===4.5) nt.set("Tu paies 4,50 €, mais tu peux encore rester un peu plus sans payer davantage.","warn");
      else nt.set("Défi : trouve la durée maximale pour payer 4,50 €.","");
    });
  }
});
