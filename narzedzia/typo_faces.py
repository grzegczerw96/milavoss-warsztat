"""Z typo.json: teksty, których grubość z CSS nie ma załadowanej twarzy w oryginale (przeglądarka bierze najbliższą
dostępną wg CSS Fonts: 500 → 400, potem wyżej; 700 → 600 sztucznie pogrubione?), a u nas ma: wtedy u nas inaczej."""
import os, json
OUT = os.path.join(os.environ['LOCALAPPDATA'], 'wir-tools', 'out', 'milavoss-warsztat')
d = json.load(open(os.path.join(OUT, 'typo.json'), encoding='utf8'))

def rendered(w, faces):
    w = int(w); have = sorted(faces)
    if w in have: return w
    if 400 <= w <= 500:   # desired 400–500: lighter weights first (down to 0), then heavier
        lo = [x for x in have if x < w]; hi = [x for x in have if x > w and x <= 500]
        if hi and w == 400: return hi[0]
        if lo: return max(lo)
        return min(x for x in have if x > w)
    if w > 500:
        hi = [x for x in have if x > w]; return min(hi) if hi else max(have)
    lo = [x for x in have if x < w]; return max(lo) if lo else min(have)

for wd in ('1440', '375'):
    o, u = d[f'orig_{wd}'], d[f'ours_{wd}']
    of = {int(f.split()[1]) for f in o['__faces'] if f.startswith('Goga')}
    uf = {int(f.split()[1]) for f in u['__faces'] if f.startswith('Figtree')}
    print(f'== {wd}: Goga {sorted(of)}, Figtree {sorted(uf)}')
    for k in sorted(set(o) & set(u) - {'__faces'}):
        a, c = o[k], u[k]
        ra, rc = rendered(a['w'], of), rendered(c['w'], uf)
        if ra != rc: print(f"  .{k:32s} „{c['text'][:22]}” CSS {a['w']}/{c['w']}: oryginał rysuje {ra}, my {rc}")
