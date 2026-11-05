/* SFA · page dédiée à une simulation (même gabarit que les pages de chimie) — novembre 2026.
   Chargée après sfa-sec.js, page.js du cours et le fichier sims-NN.js du chapitre. window.SFA_SIMPAGE = id de la simulation. */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var S = window.SFA, M = S.meta, id = window.SFA_SIMPAGE;
  var d = S.sims.filter(function (s) { return s.id === id; })[0];
  if (!d) { document.body.innerHTML = "<p style='padding:30px'>Simulation introuvable.</p>"; return; }
  var ci = 0; M.chapitres.forEach(function (c, i) { if (c.id === d.ch) ci = i; });
  var c = M.chapitres[ci];
  var mates = S.sims.filter(function (s) { return s.ch === d.ch; });
  var k = mates.indexOf(d), prev = mates[k - 1], next = mates[k + 1];
  function rel(u) { return /^(https?:|\/|#)/.test(u) ? u : "../" + u; }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function strip(t) { return String(t || "").replace(/<[^>]+>/g, ""); }
  document.body.classList.add("m-" + (M.matiere || "maths"));
  document.title = strip(d.titre) + " · " + (M.court || M.titre) + " · SFA";
  var nav = (M.nav || []).map(function (n) { return '<a href="' + rel(n[0]) + '"' + (n[2] ? ' class="on"' : "") + ">" + n[1] + "</a>"; }).join("");
  var prepa = M.prepa || "https://sfascienceforall-cell.github.io/simulations/prepa/";
  document.getElementById("app").innerHTML =
    '<header class="sfa-top"><div class="in"><a class="sfa-logo" href="https://sciencesforall.be"><i>SFA</i>Science For All</a><nav class="sfa-nav">' + nav + '</nav><a class="sfa-cta" href="' + prepa + '">Prépa concours médecine</a></div></header>' +
    '<div class="sfa-page"><nav class="sfa-crumbs" aria-label="Fil d\'Ariane"><a href="../">' + esc(M.court || M.titre) + '</a>›<a href="../#c=' + ci + '">' + esc(c.titre) + "</a>›<b>" + esc(strip(d.titre)) + "</b></nav>" +
    '<div class="sfa-grid"><main style="min-width:0">' +
    '<div class="sfa-titlecard"><div class="sfa-chips"><span class="sfa-chip">' + esc(M.court || M.titre) + " · Ch. " + (ci + 1) + '</span><span class="sfa-chip free">Gratuit</span>' + (d.tag ? '<span class="sfa-chip">' + esc(d.tag) + "</span>" : "") + "</div><h1>" + d.titre + "</h1><p>" + (d.but || d.resume || "") + "</p></div>" +
    '<section class="sfa-sim simhost" id="host"></section>' +
    '<div class="sp-next"><a class="sp-go" href="../#c=' + ci + '&v=theo"><small>Rappel</small><b>Théorie du chapitre</b></a><a class="sp-go ex" href="../#c=' + ci + '&v=list"><small>S\'entraîner</small><b>Exercices du chapitre ★ → ★★★★★</b></a>' +
    (next ? '<a class="sp-go" href="../' + next.id + '/"><small>Simulation suivante</small><b>' + strip(next.titre) + "</b></a>" : "") + "</div>" +
    "</main>" +
    '<aside class="sfa-side"><div class="sfa-list"><h2>' + esc(c.titre) + "<span>" + mates.length + " simulation" + (mates.length > 1 ? "s" : "") + "</span></h2><ol>" +
    mates.map(function (s, j) { return '<li><a href="../' + s.id + '/"' + (s === d ? ' class="on" aria-current="page"' : "") + "><i>" + String(j + 1).padStart(2, "0") + "</i>" + strip(s.titre) + "</a></li>"; }).join("") + "</ol>" +
    '<div class="sp-chap"><a href="../#c=' + ci + '">Tout le chapitre ' + (ci + 1) + " →</a></div></div>" +
    '<div class="sfa-promo"><small>Envie d\'aller plus loin ?</small><b>La prépa concours médecine SFA : le cours complet, les exercices type examen corrigés et le suivi.</b><a href="' + prepa + '">Voir la prépa concours médecine</a></div></aside></div></div>' +
    '<footer class="sfa-foot">Science For All · ' + esc(M.court || M.titre) + "</footer>";
  S.mount(d, document.getElementById("host"));
});
