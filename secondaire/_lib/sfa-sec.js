/* SFA · moteur commun des pages de simulations et d'exercices (secondaire et université), novembre 2026.
   Une page = SFA.page({...}) + des SFA.sim({...}) + des SFA.exos(chapitre, [...]).  Voir _lib/GUIDE.md. */
(function(){
"use strict";
var S = window.SFA = {meta:null, sims:[], exos:{}, open:null};

S.page = function(m){ S.meta = m; };
S.sim  = function(d){ S.sims.push(d); };
S.exos = function(ch, list){ (S.exos[ch] = S.exos[ch] || []).push.apply(S.exos[ch], list); };

function el(tag, attrs, html){
  var e = document.createElement(tag);
  if (attrs) for (var k in attrs){ if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
  if (html != null) e.innerHTML = html;
  return e;
}
S.el = el;

/* ---------- format des nombres (virgule décimale belge) ---------- */
S.fmt = function(x, d){
  if (x === null || x === undefined || isNaN(x)) return "—";
  if (!isFinite(x)) return x > 0 ? "+∞" : "−∞";
  if (d === undefined) d = 2;
  var s = Number(x).toFixed(d);
  if (d > 0) s = s.replace(/\.?0+$/, "");
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);   /* évite « −0 » pour un tout petit négatif */
  return s.replace("-", "−").replace(".", ",");
};
S.sci = function(x, d){
  if (!isFinite(x) || x === 0) return S.fmt(x, d);
  var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
  if (e >= -2 && e <= 3) return S.fmt(x, d === undefined ? 3 : d);
  return S.fmt(m, d === undefined ? 2 : d) + "·10<sup>" + String(e).replace("-", "−") + "</sup>";
};
S.stars = function(n){ var s = ""; for (var i = 1; i <= 5; i++) s += i <= n ? "★" : "<i>★</i>"; return '<span class="stars" title="Difficulté ' + n + '/5">' + s + "</span>"; };

/* ---------- kit donné à chaque simulation ---------- */
function Kit(stage, ctrl, panel){
  this.stage = stage; this.ctrl = ctrl; this.panel = panel; this._raf = null; this._alive = true; this._cv = [];
}
Kit.prototype.canvas = function(h, opts){
  /* renvoie {cv, ctx, W, H, clear()} en coordonnées CSS ; redimensionné automatiquement */
  var cv = el("canvas"); this.stage.appendChild(cv);
  var o = {cv:cv, ctx:cv.getContext("2d"), W:0, H:h || 360, ratio:(opts && opts.ratio) || 0};
  var self = this;
  o.resize = function(){
    var w = Math.max(260, cv.parentNode ? cv.parentNode.clientWidth : 600);
    var hh = o.ratio ? Math.round(w * o.ratio) : (h || 360);
    var dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(w * dpr); cv.height = Math.round(hh * dpr);
    cv.style.height = hh + "px";
    o.W = w; o.H = hh; o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (self._draw) self._draw();
  };
  o.clear = function(){ o.ctx.clearRect(0, 0, o.W, o.H); };
  o.resize(); this._cv.push(o);
  /* position du pointeur en coordonnées CSS */
  o.pointer = function(fn){
    var down = false;
    function pos(ev){ var r = cv.getBoundingClientRect(); var t = ev.touches ? ev.touches[0] : ev; return {x:t.clientX - r.left, y:t.clientY - r.top}; }
    cv.addEventListener("pointerdown", function(ev){ down = true; cv.setPointerCapture(ev.pointerId); fn("down", pos(ev)); });
    cv.addEventListener("pointermove", function(ev){ fn(down ? "drag" : "move", pos(ev)); });
    cv.addEventListener("pointerup", function(ev){ down = false; fn("up", pos(ev)); });
  };
  return o;
};
/* fonction de dessin appelée après chaque changement de contrôle et au redimensionnement */
Kit.prototype.draw = function(fn){ this._draw = fn; fn(); };
Kit.prototype.redraw = function(){ if (this._draw) this._draw(); };
Kit.prototype._ctl = function(){ var d = el("div", {"class":"ctl"}); this.ctrl.appendChild(d); return d; };
Kit.prototype.slider = function(label, min, max, step, val, unit, fn){
  var d = this._ctl(), self = this;
  var lab = el("label"); lab.innerHTML = "<span>" + label + "</span>";
  var out = el("output"); lab.appendChild(out);
  var r = el("input", {type:"range", min:min, max:max, step:step, value:val});
  d.appendChild(lab); d.appendChild(r);
  var dec = (String(step).split(".")[1] || "").length;
  /* cur garde la valeur exacte : un <input type=range> arrondit au pas lors d'un r.value = v (animations en pas fins) */
  var cur = parseFloat(r.value);
  var o = {get value(){ return cur; }, set:function(v){ v = Math.max(parseFloat(r.min), Math.min(parseFloat(r.max), parseFloat(v))); cur = v; r.value = v; show(); }, el:r};
  function show(){ out.innerHTML = S.fmt(cur, dec) + (unit ? " " + unit : ""); }
  r.addEventListener("input", function(){ cur = parseFloat(r.value); show(); if (fn) fn(o.value); self.redraw(); });
  show(); return o;
};
Kit.prototype.select = function(label, options, val, fn){
  /* options : ["a","b"] ou [[valeur, texte], ...] */
  var d = this._ctl(), self = this;
  d.appendChild(el("label", null, "<span>" + label + "</span>"));
  var s = el("select");
  options.forEach(function(op){ var v = Array.isArray(op) ? op[0] : op, t = Array.isArray(op) ? op[1] : op; var o = el("option", {value:v}, t); s.appendChild(o); });
  if (val !== undefined) s.value = val;
  d.appendChild(s);
  var o = {get value(){ return s.value; }, set:function(v){ s.value = v; }, el:s};
  s.addEventListener("change", function(){ if (fn) fn(s.value); self.redraw(); });
  return o;
};
Kit.prototype.seg = function(label, options, val, fn){
  var d = this._ctl(), self = this;
  if (label) d.appendChild(el("label", null, "<span>" + label + "</span>"));
  var box = el("div", {"class":"seg"}); d.appendChild(box);
  var cur = val !== undefined ? val : (Array.isArray(options[0]) ? options[0][0] : options[0]);
  var btns = [];
  options.forEach(function(op){
    var v = Array.isArray(op) ? op[0] : op, t = Array.isArray(op) ? op[1] : op;
    var b = el("button", {type:"button"}, t); box.appendChild(b); btns.push([v, b]);
    b.addEventListener("click", function(){ cur = v; paint(); if (fn) fn(v); self.redraw(); });
  });
  function paint(){ btns.forEach(function(p){ p[1].classList.toggle("on", String(p[0]) === String(cur)); }); }
  paint();
  return {get value(){ return cur; }, set:function(v){ cur = v; paint(); }};
};
Kit.prototype.toggle = function(label, val, fn){
  var d = this._ctl(), self = this;
  var lab = el("label", {style:"justify-content:flex-start;gap:8px;cursor:pointer"});
  var c = el("input", {type:"checkbox"}); c.checked = !!val; lab.appendChild(c); lab.appendChild(el("span", null, label));
  d.appendChild(lab);
  c.addEventListener("change", function(){ if (fn) fn(c.checked); self.redraw(); });
  return {get value(){ return c.checked; }, set:function(v){ c.checked = !!v; }};
};
Kit.prototype.input = function(label, val, fn, type){
  var d = this._ctl(), self = this;
  d.appendChild(el("label", null, "<span>" + label + "</span>"));
  var i = el("input", {type:type || "text", value:val}); d.appendChild(i);
  i.addEventListener("input", function(){ if (fn) fn(i.value); self.redraw(); });
  return {get value(){ return i.value; }, set:function(v){ i.value = v; }, el:i};
};
Kit.prototype.button = function(text, fn, primary){
  var last = this.ctrl.lastElementChild, box;
  if (last && last.classList.contains("btns")) box = last; else { box = el("div", {"class":"btns"}); this.ctrl.appendChild(box); }
  var b = el("button", {type:"button", "class":"btn" + (primary ? " pri" : "")}, text); box.appendChild(b);
  var self = this; b.addEventListener("click", function(){ fn(); self.redraw(); });
  return b;
};
Kit.prototype.readouts = function(labels){
  /* labels : ["pH", "Volume"] → objet {set(i, html)} */
  var box = el("div", {"class":"read"}); this.ctrl.appendChild(box);
  var cells = labels.map(function(l){ var r = el("div", {"class":"ro"}, "<small>" + l + "</small><b>—</b>"); box.appendChild(r); return r.querySelector("b"); });
  return {set:function(i, html){ cells[i].innerHTML = html; }};
};
Kit.prototype.note = function(html, kind, where){
  var n = el("div", {"class":"note" + (kind ? " " + kind : "")}, html);
  (where === "stage" ? this.stage : this.ctrl).appendChild(n);
  return {set:function(h, k){ n.innerHTML = h; n.className = "note" + (k ? " " + k : ""); }, el:n};
};
/* boucle d'animation : fn(dt en s, t en s) ; s'arrête quand le panneau est fermé. Renvoie {play(), pause(), running} */
Kit.prototype.loop = function(fn){
  var self = this, last = null, t = 0, st = {running:false};
  function frame(ts){
    if (!self._alive || !st.running) { last = null; return; }
    if (last === null) last = ts;
    var dt = Math.min(0.05, (ts - last) / 1000); last = ts; t += dt;
    fn(dt, t); self._raf = requestAnimationFrame(frame);
  }
  st.play = function(){ if (!st.running){ st.running = true; self._raf = requestAnimationFrame(frame); } };
  st.pause = function(){ st.running = false; };
  st.reset = function(){ t = 0; };
  return st;
};

/* ---------- aides de dessin ---------- */
S.draw = {
  /* repère : {x0,x1,y0,y1, l,r,t,b} → fonctions X(x), Y(y) */
  axes: function(c, opt, opt2){
    if (opt && opt.ctx){ c = opt; opt = opt2; }   /* compat : axes(c, c, opt) */
    opt = opt || {};
    var L = opt.l || 46, R = opt.r || 16, T = opt.t || 16, B = opt.b || 34;
    var W = c.W, H = c.H, ctx = c.ctx;
    if (opt.equal){   /* même échelle en x et en y : on centre la zone de tracé */
      var wpx = W - L - R, hpx = H - T - B, u0 = Math.min(wpx / (opt.x1 - opt.x0), hpx / (opt.y1 - opt.y0));
      var ddx = (wpx - u0 * (opt.x1 - opt.x0)) / 2, ddy = (hpx - u0 * (opt.y1 - opt.y0)) / 2;
      L += ddx; R += ddx; T += ddy; B += ddy;
    }
    var ax = {x0:opt.x0, x1:opt.x1, y0:opt.y0, y1:opt.y1};
    ax.X = function(x){ return L + (x - ax.x0) / (ax.x1 - ax.x0) * (W - L - R); };
    ax.Y = function(y){ return H - B - (y - ax.y0) / (ax.y1 - ax.y0) * (H - T - B); };
    ax.ix = function(px){ return ax.x0 + (px - L) / (W - L - R) * (ax.x1 - ax.x0); };
    ax.iy = function(py){ return ax.y0 + (H - B - py) / (H - T - B) * (ax.y1 - ax.y0); };
    ax.L = L; ax.R = W - R; ax.T = T; ax.B = H - B;
    function nice(span){ var raw = span / 8, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
    var sx = opt.stepX || nice(ax.x1 - ax.x0), sy = opt.stepY || nice(ax.y1 - ax.y0);
    ctx.save(); ctx.lineWidth = 1; ctx.font = "600 11px Mulish, system-ui, sans-serif"; ctx.fillStyle = "#5f6b7a";
    if (opt.grid !== false){
      ctx.strokeStyle = "#edf0f4";
      for (var gx = Math.ceil(ax.x0 / sx) * sx; gx <= ax.x1 + 1e-9; gx += sx){ ctx.beginPath(); ctx.moveTo(ax.X(gx), T); ctx.lineTo(ax.X(gx), H - B); ctx.stroke(); }
      for (var gy = Math.ceil(ax.y0 / sy) * sy; gy <= ax.y1 + 1e-9; gy += sy){ ctx.beginPath(); ctx.moveTo(L, ax.Y(gy)); ctx.lineTo(W - R, ax.Y(gy)); ctx.stroke(); }
    }
    ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2;
    var yx = (ax.y0 <= 0 && ax.y1 >= 0) ? ax.Y(0) : H - B, xy = (ax.x0 <= 0 && ax.x1 >= 0) ? ax.X(0) : L;
    ctx.beginPath(); ctx.moveTo(L, yx); ctx.lineTo(W - R, yx); ctx.moveTo(xy, T); ctx.lineTo(xy, H - B); ctx.stroke();
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (gx = Math.ceil(ax.x0 / sx) * sx; gx <= ax.x1 + 1e-9; gx += sx){ if (Math.abs(gx) < 1e-12 && opt.hideZero) continue; ctx.fillText(S.fmt(gx, 3).replace(/<[^>]+>/g, ""), ax.X(gx), Math.min(H - B, yx) + 4); }
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (gy = Math.ceil(ax.y0 / sy) * sy; gy <= ax.y1 + 1e-9; gy += sy){ if (Math.abs(gy) < 1e-12) continue; ctx.fillText(S.fmt(gy, 3), Math.max(L, xy) - 5, ax.Y(gy)); }
    if (opt.xl){ ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.font = "700 12px Mulish, system-ui"; ctx.fillStyle = "#2c3a4e"; ctx.fillText(opt.xl, W - R, yx - 4); }
    if (opt.yl){ ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = "700 12px Mulish, system-ui"; ctx.fillStyle = "#2c3a4e"; ctx.fillText(opt.yl, xy + 6, T); }
    ctx.restore();
    return ax;
  },
  /* trace y = f(x) dans le repère ax ; gère les discontinuités (sauts > H) */
  fn: function(c, ax, f, color, width, dash){
    var ctx = c.ctx, n = Math.max(200, Math.round(ax.R - ax.L)), started = false, prevY = null;
    ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T - 2, ax.R - ax.L, ax.B - ax.T + 4); ctx.clip();
    ctx.strokeStyle = color || "#1e3f8f"; ctx.lineWidth = width || 2.4; if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    for (var i = 0; i <= n; i++){
      var x = ax.x0 + (ax.x1 - ax.x0) * i / n, y = f(x), py = ax.Y(y);
      if (!isFinite(y) || isNaN(y) || (prevY !== null && Math.abs(py - prevY) > c.H * 1.5)){ started = false; prevY = isFinite(y) ? py : null; continue; }
      if (!started){ ctx.moveTo(ax.X(x), py); started = true; } else ctx.lineTo(ax.X(x), py);
      prevY = py;
    }
    ctx.stroke(); ctx.restore();
  },
  dot: function(c, x, y, r, color){ var ctx = c.ctx; ctx.beginPath(); ctx.arc(x, y, r || 5, 0, 2 * Math.PI); ctx.fillStyle = color || "#13233a"; ctx.fill(); },
  line: function(c, x1, y1, x2, y2, color, w, dash){ var ctx = c.ctx; ctx.save(); ctx.strokeStyle = color || "#13233a"; ctx.lineWidth = w || 2; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); },
  arrow: function(c, x1, y1, x2, y2, color, w){
    var ctx = c.ctx, a = Math.atan2(y2 - y1, x2 - x1), h = 9 + (w || 2) * 1.5;
    ctx.save(); ctx.strokeStyle = ctx.fillStyle = color || "#13233a"; ctx.lineWidth = w || 2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * h * 0.6, y2 - Math.sin(a) * h * 0.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - 0.4), y2 - h * Math.sin(a - 0.4)); ctx.lineTo(x2 - h * Math.cos(a + 0.4), y2 - h * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill(); ctx.restore();
  },
  text: function(c, s, x, y, opt){
    opt = opt || {}; var ctx = c.ctx; ctx.save();
    ctx.font = (opt.weight || 700) + " " + (opt.size || 13) + "px " + (opt.math ? "'STIX Two Text', serif" : "Mulish, system-ui, sans-serif");
    ctx.fillStyle = opt.color || "#0f1b2d"; ctx.textAlign = opt.align || "center"; ctx.textBaseline = opt.base || "middle";
    if (opt.bg){ var w = ctx.measureText(s).width + 8, hh = (opt.size || 13) + 6; var bx = opt.align === "left" ? x - 4 : opt.align === "right" ? x - w + 4 : x - w / 2; ctx.fillStyle = opt.bg; ctx.fillRect(bx, y - hh / 2, w, hh); ctx.fillStyle = opt.color || "#0f1b2d"; }
    ctx.fillText(s, x, y); ctx.restore();
  },
  palette: {acc:"#1e3f8f", red:"#b42318", green:"#2e6b55", violet:"#5B21B6", amber:"#B45309", teal:"#0e7490", ink:"#0f1b2d", grey:"#8a95a3", light:"#e3e7ed", yellow:"#f4c542"}
};

/* ---------- rendu de la page ---------- */
function openSim(d, host){
  if (S.open){ S.open.close(); }
  var panel = el("div", {"class":"sim", id:"sim-" + d.id});
  panel.innerHTML = '<div class="sim-h"><div><h4>' + d.titre + "</h4><p>" + (d.but || "") + '</p></div><button class="x" type="button">Fermer ✕</button></div>';
  var body = el("div", {"class":"sim-body"}), stage = el("div", {"class":"stage"}), ctrl = el("div", {"class":"ctrl"});
  body.appendChild(stage); body.appendChild(ctrl); panel.appendChild(body);
  if (d.aRetenir){ panel.appendChild(el("div", {"class":"note ok", style:"margin-top:12px"}, "<b>À retenir.</b> " + d.aRetenir)); }
  if (d.piege){ panel.appendChild(el("div", {"class":"note warn", style:"margin-top:8px"}, "<b>Piège.</b> " + d.piege)); }
  host.parentNode.insertBefore(panel, host.nextSibling);
  var kit = new Kit(stage, ctrl, panel);
  var onResize = function(){ kit._cv.forEach(function(o){ o.resize(); }); };
  window.addEventListener("resize", onResize);
  S.open = {id:d.id, close:function(){ kit._alive = false; if (kit._raf) cancelAnimationFrame(kit._raf); window.removeEventListener("resize", onResize); panel.remove(); S.open = null; try{history.replaceState(null, "", location.pathname + location.search);}catch(e){} }};
  panel.querySelector(".x").addEventListener("click", function(){ S.open && S.open.close(); });
  try { d.build(kit, S); } catch (e){ stage.appendChild(el("div", {"class":"note bad"}, "Erreur dans la simulation : " + e.message)); if (window.console) console.error(e); }
  try{history.replaceState(null, "", "#" + d.id);}catch(e){}
  panel.scrollIntoView({behavior:"smooth", block:"start"});
}
S.openSim = function(id){ var d = S.sims.filter(function(s){ return s.id === id; })[0]; var c = document.querySelector('[data-sim="' + id + '"]'); if (d && c) openSim(d, c.closest(".grid")); };

function renderExo(x, i, ch){
  var box = el("div", {"class":"exo", "data-s":x.s || 1});
  var kind = x.choix ? "QCM" : "Exercice";
  box.innerHTML = '<div class="exo-h">' + S.stars(x.s || 1) + "<b>" + kind + " " + ch + "." + (i + 1) + (x.t ? " · " + x.t : "") + "</b></div>" + '<div class="st">' + x.enonce + "</div>";
  if (x.choix){
    var q = el("div", {"class":"qcm"}), fb = el("div", {"class":"fb"}); var done = false;
    x.choix.forEach(function(c, j){
      var b = el("button", {type:"button"}, "<b>" + "ABCDEF"[j] + ".</b> " + c); q.appendChild(b);
      b.addEventListener("click", function(){
        if (done) return; done = true;
        var ok = j === x.bonne;
        b.classList.add(ok ? "good" : "badc");
        if (!ok) q.children[x.bonne].classList.add("good");
        var why = x.pourquoi && x.pourquoi[j] ? x.pourquoi[j] : "";
        fb.innerHTML = (ok ? "✅ <b>Bonne réponse.</b> " : "❌ <b>Pas tout à fait.</b> " + (why ? why + " " : "")) + (x.corrige ? "<br>" + x.corrige : "");
      });
    });
    box.appendChild(q); box.appendChild(fb);
    var again = el("button", {type:"button", "class":"x", style:"margin-top:4px"}, "Recommencer");
    again.addEventListener("click", function(){ done = false; fb.innerHTML = ""; Array.prototype.forEach.call(q.children, function(b){ b.className = ""; }); });
    box.appendChild(again);
  } else {
    if (x.indice) box.appendChild(el("details", null, "<summary>Indice</summary><div>" + x.indice + "</div>"));
    box.appendChild(el("details", null, "<summary>Corrigé pas à pas</summary><div>" + (x.corrige || "") + (x.reponse ? '<p><b>Réponse : ' + x.reponse + "</b></p>" : "") + "</div>"));
  }
  return box;
}

S.render = function(){
  var m = S.meta; if (!m) return;
  document.body.classList.add("m-" + (m.matiere || "maths"));
  document.title = m.titre + " · SFA";
  var root = document.getElementById("app") || document.body;
  var base = m.base || "../../";
  var nav = (m.nav || [
    ["https://sciencesforall.be", "Site SFA"],
    [base + "../", "Simulations de physique"],
    [base + "../chimie/", "Chimie"],
    [base, "Secondaire", true],
    [base + "../universite/", "Université"],
    [base + "../prepa/", "Prépa concours médecine"]
  ]).map(function(n){ return '<a href="' + n[0] + '"' + (n[2] ? ' class="on"' : "") + ">" + n[1] + "</a>"; }).join("");
  var nS = S.sims.length, nE = 0, nQ = 0;
  Object.keys(S.exos).forEach(function(k){ if (typeof S.exos[k] === "object" && S.exos[k].forEach) S.exos[k].forEach(function(x){ if (x.choix) nQ++; else nE++; }); });
  var html = '<header class="top"><a class="logo" href="https://sciencesforall.be"><i>SFA</i>Science For All</a><nav>' + nav + "</nav></header>";
  html += '<main class="wrap"><div class="hero"><span class="kicker">' + (m.kicker || "") + "</span><h1>" + m.titre + "</h1><p>" + (m.intro || "") + "</p>";
  html += '<div class="counts"><span><b>' + m.chapitres.length + "</b> chapitres</span><span><b>" + nS + "</b> simulations</span><span><b>" + nE + "</b> exercices corrigés</span><span><b>" + nQ + "</b> QCM</span></div></div>";
  html += '<nav class="chips">' + m.chapitres.map(function(c){ var k = S.sims.filter(function(s){ return s.ch === c.id; }).length; return '<a href="#ch-' + c.id + '">' + c.num + ". " + c.titre + "<span>" + k + "</span></a>"; }).join("") + "</nav>";
  html += '<div class="filt">Filtrer les exercices : <span class="seg" id="fstar"></span></div><div id="chs"></div>';
  html += '<div class="foot">' + (m.pied || "Contenu SFA original. Chaque simulation et chaque exercice ont été relus par un professeur de la matière.") + "</div></main>";
  root.innerHTML = html;
  var chs = root.querySelector("#chs");
  m.chapitres.forEach(function(c){
    var sec = el("section", {"class":"ch", id:"ch-" + c.id});
    sec.innerHTML = '<div class="ch-h"><span class="n">' + c.num + "</span><h2>" + c.titre + "</h2></div>" + '<div class="ch-intro">' + (c.resume || "") + (c.attendus ? '<div class="attendus"><b>Au programme :</b> ' + c.attendus + "</div>" : "") + "</div>";
    var sims = S.sims.filter(function(s){ return s.ch === c.id; });
    if (sims.length){
      sec.appendChild(el("h3", {"class":"sub"}, "Simulations"));
      var g = el("div", {"class":"grid"});
      sims.forEach(function(d){
        var b = el("button", {"class":"card", type:"button", "data-sim":d.id}, (d.tag ? '<span class="tag">' + d.tag + "</span>" : "") + "<b>" + d.titre + "</b><small>" + (d.resume || d.but || "") + '</small><span class="go">Lancer la simulation →</span>');
        b.addEventListener("click", function(){ openSim(d, g); });
        g.appendChild(b);
      });
      sec.appendChild(g);
    }
    var ex = (S.exos[c.id] || []).slice().sort(function(a, b){ return (a.s || 1) - (b.s || 1); });
    if (ex.length){
      sec.appendChild(el("h3", {"class":"sub"}, "Exercices et QCM · du ★ au ★★★★★"));
      var list = el("div", {"class":"exos"});
      ex.forEach(function(x, i){ list.appendChild(renderExo(x, i, c.num)); });
      sec.appendChild(list);
    }
    chs.appendChild(sec);
  });
  /* filtre par étoiles */
  var fs = root.querySelector("#fstar"), cur = 0;
  [[0, "Tous"], [1, "★"], [2, "★★"], [3, "★★★"], [4, "★★★★"], [5, "★★★★★"]].forEach(function(p){
    var b = el("button", {type:"button"}, p[1]); if (p[0] === 0) b.className = "on"; fs.appendChild(b);
    b.addEventListener("click", function(){ cur = p[0]; Array.prototype.forEach.call(fs.children, function(x){ x.className = ""; }); b.className = "on";
      Array.prototype.forEach.call(document.querySelectorAll(".exo"), function(e){ e.style.display = (!cur || +e.getAttribute("data-s") === cur) ? "" : "none"; }); });
  });
  var h = location.hash.slice(1);
  if (h && !/^ch-/.test(h)) setTimeout(function(){ S.openSim(h); }, 50);
};
document.addEventListener("DOMContentLoaded", function(){ S.render(); });
})();
