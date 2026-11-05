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
