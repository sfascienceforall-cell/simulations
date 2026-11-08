"""Génère kit/search-index.js pour la recherche globale (physique + chimie). Usage : python3 kit/build_search_index.py"""
import re, json, os, html
out = []
def strip(t): return html.unescape(re.sub(r'<[^>]+>', '', t or '')).strip()
def cards(page, base, m, sec):
    s = open(page, encoding='utf-8').read()
    for mm in re.finditer(r'<a class="card[^"]*" href="([^"]+)"[^>]*>(.*?)</a>', s, re.S):
        u, body = mm.group(1), mm.group(2)
        b = re.search(r'<b>(.*?)</b>', body, re.S); sp = re.search(r'<span>(.*?)</span>', body, re.S); sm = re.search(r'<small>(.*?)</small>', body, re.S)
        if not b: continue
        u = re.sub(r'^https://sfascienceforall-cell\.github\.io/simulations/', '', u)
        if u.startswith('http'): out.append({"k": "simulation", "t": strip(re.sub(r"<(em|i|span|small)[^>]*>.*?</\1>", "", b.group(1))), "s": sec + (" · " + strip(sm.group(1)) if sm else ""), "u": u, "m": m}); continue
        out.append({"k": "simulation", "t": strip(re.sub(r"<(em|i|span|small)[^>]*>.*?</\1>", "", b.group(1))), "s": sec + (" · " + strip(sm.group(1)) if sm else ""), "u": os.path.normpath(os.path.join(base, u)).lstrip('./') + ('/' if u.endswith('/') else ''), "m": m})
    for a, t in re.findall(r'<section id="([A-Za-z0-9_-]+)"><h2>([^<]*)', s):
        out.append({"k": "chapitre", "t": strip(t), "s": sec, "u": (base + '/' if base != '.' else '') + '#' + a, "m": m})
out += [{"k": "cours", "t": "Simulations de physique", "s": "Université · BA1", "u": "", "m": "physique"},
        {"k": "cours", "t": "Exercices et QCM de physique", "s": "★ → ★★★★★", "u": "exercices/", "m": "physique"},
        {"k": "cours", "t": "Prépa concours médecine", "s": "SFA", "u": "prepa/", "m": ""},
        {"k": "cours", "t": "SFA · Science For All", "s": "Qui sommes-nous", "u": "sfa/", "m": ""}]
cards('index.html', '.', 'physique', 'Physique')
import subprocess
for r in json.loads(subprocess.run(['node', 'kit/build_course_index.js'], capture_output=True, text=True).stdout or '[]'):
    r['m'] = 'chimie'; out.append(r)
meta = open('universite/chimie/course-meta.js', encoding='utf-8').read()
for e in json.loads(re.search(r'"ext": (\[.*?\])\}', meta, re.S).group(1)):
    out.append({"k": "simulation", "t": e['titre'], "s": "Chimie BA1", "u": 'chimie/' + e['href'].split('chimie/', 1)[1], "m": "chimie"})
seen = set(); res = []
for r in out:
    key = (r['t'], r['u'])
    if key in seen: continue
    seen.add(key); res.append(r)
open('kit/search-index.js', 'w', encoding='utf-8').write('/* généré par kit/build_search_index.py */\nwindow.SFA_INDEX=' + json.dumps(res, ensure_ascii=False) + ';\n')
print(len(res), 'entrées')
