# Refonte des simulations — nuit du 5 au 6 novembre 2026

Branche de travail : `refonte-2026-11-06` (rien sur main avant validation d'Enzo).

Nouvelle structure (kit/) : chaque cours = une page `index.html` → chapitres → {Simulations (vignettes → page dédiée), Théorie animée, Exercices avec devanture ★→★★★★★}.
- kit/course-engine.js, course-helpers.js, course.css, sim-page.js, legacy-chimie.js, thumbs.py, check-course.py, GUIDE-COURS.md
- /home/claude/build_course.py <cours> <racine> régénère index.html + pages de simulation. course-meta.js = navigation de chaque cours.
- Université : chimie fusionnée (19 chapitres : 22 simulations existantes + 50 nouvelles, exercices existants + nouveaux), biologie, statistique, maths (à créer).

| Heure | Phase | État |
|---|---|---|
| 01:25 | Phase 0 : kit + structure + 19 pages de cours générées + vignettes | fait |
| 01:30 | Phase 1 : théorie animée + devantures (19 agents) · designer moteur · maths unif · expériences célèbres · biologie 3D · chimie BA1 + | en cours |
| — | Phase 2 : inspecteurs qualité des simulations (par cours) | à faire |
| — | Phase 3 : contrôle, vignettes, hubs, push, aperçu, rapport | à faire |
| 01:40 | Lancés (20 agents, limite atteinte) : designer, maths unif A/B, expériences, bio 3D unif + secondaire, chimie BA1 +12, théorie maths 3e-6e, chimie unif, statistique, physique 3e-6e, chimie 3e-5e | en cours |
| — | EN ATTENTE de place : théorie chimie 6e, biologie 3e, 4e, 5e, 6e, biologie unif (briefs dans /home/claude/briefs2/theo-*.md) | à lancer |
| 06/11 10:05 | Reprise (la nuit s'est arrêtée vers 1 h 15, limite d'utilisation ; réveils non repris). Commit 753d45d. Relance de 18 agents EN ARRIÈRE-PLAN : designer, umaths-A/B, experiences, bio3d-s/u, chimieplus, théorie bio 3e-6e, chimie 6e, u-biologie, compléments théorie (maths 3e+6e+stat, chimie 3e+5e, physique 3e+4e, physique 5e+6e, u-chimie) | en cours |
| — | Phase 2 : inspecteurs (inspecteur.md) par cours après le designer | à faire |
| — | Reprises programmées : 14 h 45, 19 h 45 | — |
| 10:04 | Bio BA1 3D : les 10 visualisations étaient déjà écrites cette nuit ; 0 erreur JS, 1 sur 10 regardée → à inspecter (phase 2) | fait |
| 10:06 | Bio secondaire 3D : 10 visualisations (9 de la nuit + paysage adaptatif 3D), 0 erreur JS ; 1 sur 10 regardée → inspecteurs | fait |
| 10:10 | Expériences maths (c11 maths unif) : 20 simulations + 14 exercices + théorie, 0 erreur JS | fait |
| 10:17 | Chimie BA1 +12 (L01, L06, L08, L12, L15, L18) : 62 simulations dans le cours, 0 erreur JS ; 8 de la nuit non relues → inspecteur | fait |
| 10:21 | Théorie physique 5e + 6e complète (6e/index.html ne chargeait pas les theo : corrigé). Outil /home/claude/tools/figtest.py (rend devantures à p=0..1) | fait |
| 10:22 | Maths BA1 c01-c05 complets (25 sims, 70 ex.). maths 5e : index reconstruit (ne chargeait pas les theo). À FAIRE à la fin : build_course.py sur TOUS les cours | fait |
| 10:22 | Théorie physique 3e + 4e complète (index corrigés, _t4e/_t6e supprimés) | fait |
| 10:22 | Théorie chimie BA1 : 19 chapitres OK (theo-L.js pour L01-L18), _tchimie supprimé | fait |
| 10:23 | Théorie biologie 3e complète (10 chapitres, 0 erreur) | fait |
| 10:23 | Théorie maths 3e + 6e + statistique complètes (index corrigés) | fait |
| 10:25 | Designer terminé (moteur embelli, ~75 pages en échec réparées, navigation précédent/suivant/clavier). Phase 2 lancée : inspecteurs | fait |
| 11:00 | Enzo a arrêté les inspecteurs (lancés à 11 en partie), puis demande des VAGUES DE 6. Tous les cours reconstruits, théorie chargée partout, 938 pages de simulation 0 échec, check-course 0 erreur sur 20 cours. Commit d7dcae2 | fait |
| — | Vagues d'inspecteurs (brief /home/claude/briefs2/insp-*.md, « reprise : retouches partielles possibles ») : V1 maths 3e-6e + physique 3e, 4e · V2 physique 5e, 6e + chimie 3e-6e · V3 biologie 3e-6e + u-biologie + u-chimie · V4 u-statistique + u-maths. Lancer la vague suivante quand la précédente est finie. | V1 en cours |
| — | Ensuite : reconstruire tous les cours, scanall + check-course, vignettes, hubs, push, aperçu artefact, copie SSD, rapport | à faire |
| 11:19 | V1 maths 6e inspecté : 40 sims OK, 5 fichiers retouchés, vignettes refaites | fait |
| 11:32 | V1 physique 4e inspecté : 12 refaites en profondeur (éclipses, phases, œil, Snell, prisme…), 0 erreur | fait |
| 11:35 | V1 maths 5e inspecté : 14 retouchées (poignées à glisser, défis), 0 erreur | fait |
| 11:36 | V1 maths 4e inspecté : 16 refaites (lecture de graphe, cercle trigo, ellipse, médiatrice, histogramme…), 0 erreur | fait |
| 11:38 | V1 maths 3e inspecté : 14 refaites (vase, pavage, spirale, cercle, clinomètre…), 0 erreur | fait |
| 11:38 | V1 physique 3e inspecté : ch. 6-10 réécrits (20 sims). VAGUE 1 TERMINÉE. À la fin : vignettes avec kit/thumbs_fit.py (garde toute la scène). V2 lancée | fait |
| 14:48 | V2 lancée à ~12:50 puis arrêtée (« par l'utilisateur ») ; retouches partielles dans 4 fichiers, 938 pages 0 échec. Reprise 14:45 reçue : EN ATTENTE de l'accord d'Enzo avant de relancer V2 | en attente |
| 14:59 | Enzo demande de lancer à 19 h : agents V2 arrêtés, reprise programmée à 19 h 00 (celle de 19 h 45 supprimée) | en attente |
