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
