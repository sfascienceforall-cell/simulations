/* Chapitre 8 : analyse combinatoire et binôme de Newton */
(function(){
function fact(n){ var r=1; for(var i=2;i<=n;i++) r*=i; return r; }
function A(n,k){ var r=1; for(var i=0;i<k;i++) r*=(n-i); return r; }
function C(n,k){ if(k<0||k>n) return 0; k=Math.min(k,n-k); var r=1; for(var i=1;i<=k;i++) r=r*(n-k+i)/i; return Math.round(r); }
function big(S,x){ return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g," "); }

SFA.sim({
  id:"m6-c08-arbre", ch:"c08", tag:"Classique",
  titre:"L'arbre des choix : compter les chemins",
  resume:"Choisis n objets et k places : l'arbre se déploie et le nombre de feuilles est le nombre de cas.",
  but:"Choisis n, k, avec ou sans répétition. Chaque chemin de l'arbre est une façon de choisir. Si l'ordre ne compte pas, les chemins qui utilisent les mêmes lettres ont la même couleur.",
  aRetenir:"Principe multiplicatif : si on fait des choix successifs, on multiplie les nombres de possibilités. Sans répétition : A(n ; k) = n·(n−1)·…·(n−k+1) arrangements. Si l'ordre ne compte pas, chaque groupe de k lettres est compté k! fois : C(n ; k) = A(n ; k) / k!. Avec répétition : n<sup>k</sup>.",
  piege:"On additionne seulement des cas qui s'excluent (« ou »). Pour des choix qui se suivent (« et »), on multiplie. Et 0! = 1, pas 0.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.85});
    var n=k.slider("Nombre d'objets n",2,5,1,4,"",null), kk=k.slider("Nombre de choix k",1,3,1,2,"",null);
    var rep=k.toggle("Avec répétition (on peut reprendre le même objet)",false);
    var ordre=k.seg("L'ordre compte-t-il ?",[["o","Oui (arrangement)"],["n","Non (combinaison)"]],"o");
    var idx=k.slider("Chemin n° (en gras)",1,60,1,1,"",null);
    var ro=k.readouts(["Nombre de chemins","Calcul","Groupes (ordre ignoré)","Chemin en gras"]);
    var nt=k.note("","ok");
    function paths(N,K,R){ var out=[]; (function rec(cur){ if(cur.length===K){ out.push(cur.slice()); return; } for(var i=0;i<N;i++){ if(!R&&cur.indexOf(i)>=0) continue; cur.push(i); rec(cur); cur.pop(); } })([]); return out; }
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, N=n.value, K=kk.value, R=rep.value;
      if(!R&&K>N){ K=N; kk.set(N); }
      var ps=paths(N,K,R), cnt=ps.length;
      idx.el.max=cnt; if(idx.value>cnt) idx.set(cnt);
      var letters="ABCDE", sel=Math.max(1,Math.min(cnt,idx.value))-1;
      var W=c.W,H=c.H, L=20, Rm=58, T=16, B=16, dx=(W-L-Rm)/K, dy=(H-T-B)/Math.max(1,cnt-1);
      var colorOf={}, ng=0;
      function key(p){ return R?p.join(","):p.slice().sort().join(","); }
      ps.forEach(function(p){ var q=key(p); if(!(q in colorOf)){ colorOf[q]=ng++; } });
      var useGroups=(ordre.value==="n"&&!R);
      function col(p){ if(!useGroups) return P.acc; var h=Math.round(colorOf[key(p)]*360/Math.max(1,ng)); return "hsl("+h+",65%,42%)"; }
      // arbre : un segment par feuille et par niveau
      var drawn={};
      ps.forEach(function(p,j){
        var y=T+(cnt>1?j*dy:(H-T-B)/2);
        for(var lv=1;lv<=K;lv++){
          var pref=p.slice(0,lv).join("-"), ppref=p.slice(0,lv-1).join("-");
          if(!drawn[pref]){ drawn[pref]={ys:[],yp:null}; }
          drawn[pref].ys.push(y);
        }
      });
      function ny(pref){ var d=drawn[pref]; return d.ys.reduce(function(a,b){return a+b;},0)/d.ys.length; }
      ctx.save(); ctx.lineWidth=1.2;
      Object.keys(drawn).forEach(function(pref){
        var arr=pref.split("-").map(Number), lv=arr.length, y1=ny(pref), x1=L+lv*dx, x0=L+(lv-1)*dx, y0=lv===1?(H/2):ny(arr.slice(0,lv-1).join("-"));
        ctx.strokeStyle="#c3ccdb"; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
      });
      ctx.restore();
      // feuilles
      ps.forEach(function(p,j){ var y=T+(cnt>1?j*dy:(H-T-B)/2); S.draw.dot(c,L+K*dx,y,cnt>40?2.5:(cnt>20?3.5:5),col(p)); if(cnt<=24) S.draw.text(c,p.map(function(i){return letters[i];}).join(""),L+K*dx+10,y,{size:12,align:"left",color:col(p)}); });
      // chemin en gras
      var sp=ps[sel], pts=[[L,H/2]]; for(var lv=1;lv<=K;lv++){ pts.push([L+lv*dx,ny(sp.slice(0,lv).join("-"))]); }
      ctx.save(); ctx.strokeStyle=P.red; ctx.lineWidth=3.4; ctx.beginPath(); pts.forEach(function(q,i){ if(i===0) ctx.moveTo(q[0],q[1]); else ctx.lineTo(q[0],q[1]); }); ctx.stroke(); ctx.restore();
      pts.forEach(function(q,i){ if(i>0) S.draw.text(c,letters[sp[i-1]],q[0],q[1]-12,{size:13,color:P.red,bg:"#ffffffcc"}); });
      S.draw.dot(c,L,H/2,6,P.ink); S.draw.text(c,"départ",L+22,H/2-14,{size:12});
      // niveaux
      for(lv=1;lv<=K;lv++) S.draw.text(c,"choix "+lv,L+lv*dx,H-4,{size:12,color:P.grey});
      var calc=[]; for(var i=0;i<K;i++) calc.push(R?N:(N-i)); var total=R?Math.pow(N,K):A(N,K);
      ro.set(0,big(S,cnt)); ro.set(1,calc.join(" × ")+" = "+big(S,total));
      var word=sp.map(function(i){return letters[i];}).join("");
      ro.set(3,word);
      if(R){ ro.set(2,"—"); nt.set(ordre.value==="n"?"Les combinaisons avec répétition ne sont pas traitées ici : l'arbre montre les listes ordonnées, n<sup>k</sup> = "+big(S,total)+".":"Avec répétition, à chaque étape il reste n choix : n<sup>k</sup> = "+N+"<sup>"+K+"</sup> = "+big(S,total)+".","ok"); }
      else { ro.set(2,useGroups?(big(S,C(N,K))+" = "+big(S,total)+" / "+K+"!"):"—");
        nt.set(useGroups?"Même couleur = mêmes lettres dans un autre ordre. Chaque groupe est vu k! = "+fact(K)+" fois : "+big(S,total)+" / "+fact(K)+" = "+big(S,C(N,K))+" combinaisons C("+N+" ; "+K+").":"Sans répétition, le nombre de choix diminue de 1 à chaque étape : A("+N+" ; "+K+") = "+big(S,total)+".","ok"); }
    });
  }
});

SFA.sim({
  id:"m6-c08-pascal", ch:"c08", tag:"Classique",
  titre:"Le triangle de Pascal et le binôme de Newton",
  resume:"Clique sur une case : elle est la somme des deux cases au-dessus, et ses voisines donnent (a + b)ⁿ.",
  but:"Clique sur une case du triangle (ligne n, colonne k). Les deux cases du dessus s'allument et la ligne n donne les coefficients du développement de (a + b)ⁿ.",
  aRetenir:"C(n ; k) = C(n−1 ; k−1) + C(n−1 ; k). Les valeurs C(n ; k) = n! / (k!·(n−k)!) sont les coefficients de (a + b)<sup>n</sup> = Σ C(n ; k)·a<sup>n−k</sup>·b<sup>k</sup>. La somme de la ligne n vaut 2<sup>n</sup> et le triangle est symétrique : C(n ; k) = C(n ; n−k).",
  piege:"La première ligne est la ligne n = 0 (et la première colonne k = 0) : C(4 ; 2) = 6 est dans la 5e ligne si on compte à partir de 1. Et (a + b)² ≠ a² + b² : il y a le terme 2ab.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.78});
    var nrow=k.slider("Ligne n du binôme",0,9,1,4,"",null);
    var ro=k.readouts(["Case choisie","Valeur","Somme de la ligne n","(a + b)ⁿ développé"]);
    var sel={n:4,k:2}, geo=null;
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, rows=10, W=c.W, H=c.H, cw=Math.min(54,(W-72)/rows), rh=(H-30)/rows;
      var X=function(n,kk){ return W/2+(kk-n/2)*cw; }, Y=function(n){ return 22+n*rh; };
      geo={X:X,Y:Y,cw:cw,rh:rh,rows:rows};
      if(sel.n>=0) { /* parents */ }
      for(var n=0;n<rows;n++){ for(var kk=0;kk<=n;kk++){
        var v=C(n,kk), inRow=(n===nrow.value), isSel=(n===sel.n&&kk===sel.k), par=(n===sel.n-1&&(kk===sel.k||kk===sel.k-1));
        ctx.fillStyle=isSel?"#1e3f8f":par?"#f4c542":inRow?"#dfe8fb":"#f4f6fa"; ctx.strokeStyle=isSel?"#13233a":"#d3d9e2";
        var bw=cw-3,bh=rh-3; ctx.fillRect(X(n,kk)-bw/2,Y(n)-bh/2,bw,bh); ctx.strokeRect(X(n,kk)-bw/2,Y(n)-bh/2,bw,bh);
        S.draw.text(c,String(v),X(n,kk),Y(n),{size:cw<34?12:13,color:isSel?"#ffffff":P.ink});
      } S.draw.text(c,"n="+n,6,Y(n),{size:12,align:"left",color:P.grey}); }
      var N=nrow.value, terms=[];
      for(var j=0;j<=N;j++){ var co=C(N,j), a=N-j, b=j, t=(co===1?"":co)+(a>0?"a"+(a>1?"<sup>"+a+"</sup>":""):"")+(b>0?"b"+(b>1?"<sup>"+b+"</sup>":""):""); if(t==="") t="1"; terms.push(t); }
      ro.set(0,"n = "+sel.n+", k = "+sel.k); ro.set(1,"C("+sel.n+" ; "+sel.k+") = "+C(sel.n,sel.k)+(sel.n>0&&sel.k>0&&sel.k<sel.n?" = "+C(sel.n-1,sel.k-1)+" + "+C(sel.n-1,sel.k):""));
      ro.set(2,"2<sup>"+N+"</sup> = "+Math.pow(2,N)); ro.set(3,"(a + b)<sup>"+N+"</sup> = "+terms.join(" + "));
    });
    c.pointer(function(type,p){ if(type==="down"&&geo){ var best=null,bd=1e9; for(var n=0;n<geo.rows;n++) for(var kk=0;kk<=n;kk++){ var d=Math.hypot(geo.X(n,kk)-p.x,geo.Y(n)-p.y); if(d<bd){bd=d;best={n:n,k:kk};} } if(best&&bd<geo.cw){ sel=best; nrow.set(best.n); k.redraw(); } } });
  }
});

SFA.sim({
  id:"m6-c08-arrangement-combinaison", ch:"c08", tag:"Arrangement ou combinaison ?",
  titre:"Podium ou comité : l'ordre change tout",
  resume:"Compare A(n ; k) et C(n ; k) : le rapport est exactement k!.",
  but:"Choisis n personnes et k places. En mode « podium » l'ordre compte (arrangement), en mode « comité » il ne compte pas (combinaison). Le graphique montre C(n ; k) pour tous les k.",
  aRetenir:"A(n ; k) = n! / (n−k)! quand l'ordre compte ; C(n ; k) = n! / (k!·(n−k)!) quand il ne compte pas ; A(n ; k) = k!·C(n ; k). Les permutations de n objets : n! = A(n ; n). La valeur maximale de C(n ; k) se trouve au milieu (k ≈ n/2).",
  piege:"Pour savoir si l'ordre compte, imagine d'échanger deux choisis : si la situation change (1er et 2e d'un podium), c'est un arrangement ; si elle reste la même (membres d'un comité), c'est une combinaison.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.6});
    var n=k.slider("n (personnes)",1,12,1,10,"",null), kk=k.slider("k (places)",0,12,1,3,"",null);
    var mode=k.seg("Situation",[["p","Podium (ordre)"],["c","Comité (sans ordre)"]],"p");
    var ro=k.readouts(["Réponse","A(n ; k)","C(n ; k)","k! = A / C"]);
    var nt=k.note("","warn");
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, N=n.value, K=kk.value;
      if(K>N){ kk.set(N); K=N; }
      var vals=[]; for(var i=0;i<=N;i++) vals.push(C(N,i)); var mx=Math.max.apply(null,vals);
      var W=c.W,H=c.H,L=44,Rm=14,T=26,B=34, bw=(W-L-Rm)/(N+1);
      ctx.save(); ctx.strokeStyle="#8a95a3"; ctx.beginPath(); ctx.moveTo(L,T); ctx.lineTo(L,H-B); ctx.lineTo(W-Rm,H-B); ctx.stroke(); ctx.restore();
      vals.forEach(function(v,i){ var h=(H-T-B)*v/mx, x=L+i*bw; ctx.fillStyle=(i===K)?P.red:"#9fb4e3"; ctx.fillRect(x+2,H-B-h,bw-4,h); S.draw.text(c,String(i),x+bw/2,H-B+14,{size:12}); if(bw>30||i===K) S.draw.text(c,big(S,v),x+bw/2,H-B-h-9,{size:11,color:i===K?P.red:P.grey}); });
      S.draw.text(c,"C("+N+" ; k) pour k = 0 … "+N,L+4,12,{size:12,align:"left"}); S.draw.text(c,"k",W-Rm,H-B+14,{size:12,align:"right"});
      var a=A(N,K), cc=C(N,K);
      ro.set(0,mode.value==="p"?big(S,a)+" podiums":big(S,cc)+" comités"); ro.set(1,big(S,a)); ro.set(2,big(S,cc)); ro.set(3,String(fact(K))+" = "+big(S,a)+" / "+big(S,cc));
      if(K===N) nt.set("k = n : A(n ; n) = n! est le nombre de permutations ; il n'y a qu'un seul comité (tout le monde).","warn");
      else if(K===0) nt.set("k = 0 : une seule façon de ne rien choisir (A = C = 1), car 0! = 1.","warn");
      else nt.set(mode.value==="p"?"Podium : "+N+" × "+(N>1&&K>1?(N-1)+(K>2?" × … ":""):"")+"= "+big(S,a)+". Si on ignore l'ordre, chaque groupe est compté "+fact(K)+" fois.":"Comité : on divise les arrangements par k! = "+fact(K)+" : "+big(S,a)+" / "+fact(K)+" = "+big(S,cc)+".","ok");
    });
  }
});

SFA.sim({
  id:"m6-c08-galton", ch:"c08", tag:"Animation · Pascal",
  titre:"La planche de Galton : le triangle de Pascal fait tomber des billes",
  resume:"Chaque bille choisit gauche ou droite à chaque clou : les compartiments suivent les coefficients du binôme.",
  but:"Lâche des billes. À chaque clou, une bille part à droite avec la probabilité p. Compare les compartiments obtenus (barres) à la prévision C(8 ; j)·p<sup>j</sup>·(1−p)<sup>8−j</sup> (points violets).",
  aRetenir:"Pour arriver au compartiment j (j déplacements à droite sur 8), il y a C(8 ; j) chemins : ce sont les nombres du triangle de Pascal. Avec p = 1/2, la proportion théorique vaut C(8 ; j) / 2<sup>8</sup>. Plus on lâche de billes, plus les barres épousent la prévision (loi des grands nombres) et dessinent une cloche.",
  piege:"Avec peu de billes, le hasard fait ce qu'il veut : les barres ne suivent pas la prévision. Elles ne la suivent que sur un grand nombre d'essais, et jamais exactement.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.95});
    var ROWS=8, p=k.slider("Probabilité d'aller à droite, p",0.1,0.9,0.05,0.5,"",null);
    var counts=[0,0,0,0,0,0,0,0,0], total=0, balls=[], queue=0, t0=0;
    function spawn(){ var path=[],j=0; for(var i=0;i<ROWS;i++){ var r=Math.random()<p.value?1:0; path.push(r); j+=r; } balls.push({path:path,j:j,age:0}); }
    var loop=k.loop(function(dt){
      var rate=Math.max(1,Math.min(40,queue/2)); t0+=dt*rate;
      while(t0>=1&&queue>0){ spawn(); queue--; t0-=1; }
      balls.forEach(function(b){ b.age+=dt*(queue>20?2.5:1.4); });
      balls=balls.filter(function(b){ if(b.age>=ROWS+0.2){ counts[b.j]++; total++; return false; } return true; });
      k.redraw(); if(queue===0&&balls.length===0) loop.pause();
    });
    function add(m){ queue+=m; loop.play(); }
    k.button("Lâcher 1 bille",function(){ add(1); },true);
    k.button("Lâcher 20 billes",function(){ add(20); });
    k.button("Lâcher 200 billes",function(){ add(200); });
    k.button("Vider",function(){ counts=[0,0,0,0,0,0,0,0,0]; total=0; balls=[]; queue=0; });
    var ro=k.readouts(["Billes tombées","Compartiment le plus rempli","Proportion observée","Proportion prévue"]);
    k.draw(function(){
      c.clear(); var P=S.draw.palette, ctx=c.ctx, W=c.W,H=c.H, top=18, pegH=(H*0.5)/ROWS, cw=Math.min(46,(W-20)/9);
      var X=function(row,pos){ return W/2+(pos-row/2)*cw; }, Y=function(row){ return top+row*pegH; };
      for(var r=0;r<ROWS;r++) for(var q=0;q<=r;q++) S.draw.dot(c,X(r,q),Y(r)+pegH*0.2,2.8,"#8a95a3");
      var binY=Y(ROWS)+pegH*0.35, binH=H-binY-24;
      var th=[]; for(var j=0;j<=ROWS;j++) th.push(C(ROWS,j)*Math.pow(p.value,j)*Math.pow(1-p.value,ROWS-j));
      var mc=Math.max(1,Math.max.apply(null,counts)), mt=Math.max.apply(null,th)*Math.max(1,total);
      var scale=binH/Math.max(mc,mt,1)*0.92;
      for(j=0;j<=ROWS;j++){ var x=X(ROWS,j), h=counts[j]*scale; ctx.fillStyle="rgba(30,63,143,.55)"; ctx.fillRect(x-cw/2+2,binY+binH-h,cw-4,h); ctx.strokeStyle="#d3d9e2"; ctx.strokeRect(x-cw/2+2,binY,cw-4,binH); S.draw.text(c,String(j),x,H-10,{size:12}); if(total>0) S.draw.text(c,String(counts[j]),x,binY+binH-h-8,{size:11,color:P.acc}); if(total>0) S.draw.dot(c,x,binY+binH-th[j]*total*scale,5,P.violet); }
      balls.forEach(function(b){ var row=Math.min(ROWS,b.age), ri=Math.floor(Math.min(b.age,ROWS-1e-9)), fr=Math.min(b.age,ROWS)-ri, pos0=0; for(var i=0;i<ri;i++) pos0+=b.path[i]; var pos1=pos0+(ri<ROWS?b.path[ri]:0);
        var x0=X(ri,pos0), y0=Y(ri)+pegH*0.2, x1=X(ri+1,pos1), y1=(ri+1<=ROWS?Y(ri+1)+pegH*0.2:binY); if(ri+1===ROWS) y1=binY;
        S.draw.dot(c,x0+(x1-x0)*fr,y0+(y1-y0)*fr,5,P.amber); });
      var best=0; for(j=1;j<=ROWS;j++) if(counts[j]>counts[best]) best=j;
      ro.set(0,String(total)); ro.set(1,total?("n° "+best+" ("+counts[best]+")"):"—"); ro.set(2,total?S.fmt(counts[best]/total,3):"—"); ro.set(3,S.fmt(th[total?best:Math.round(ROWS*p.value)],3));
    });
  }
});
})();
