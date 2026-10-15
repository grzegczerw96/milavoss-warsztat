"""Typografia oryginał vs nasza: dla każdej klasy tekstu obecnej w obu stronach (pierwszy element z własnym tekstem)
krój, grubość, rozmiar, interlinia, odstęp liter (px przy danej szerokości) oraz grubość faktycznie użytej twarzy kroju
(document.fonts: czy Figtree w tej grubości jest załadowany, czy przeglądarka pogrubia sztucznie). 1440 i 375."""
import os, sys, json
sys.path.insert(0, r'C:\Projekty\warsztat-nowy\tools')
os.environ['WARSZTAT_PROJ'] = r'C:\Projekty\milavoss-warsztat'
import _env
from playwright.sync_api import sync_playwright
JS = r"""()=>{const out={};const seen=new Set();
 for(const e of document.querySelectorAll('body *')){
  if(['SCRIPT','STYLE','SVG','PATH'].includes(e.tagName.toUpperCase()))continue;
  const own=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());if(!own)continue;
  const cls=(typeof e.className==='string'?e.className:'').trim().split(/\s+/).filter(c=>c&&!/^(w-|char|word|line)/.test(c)).sort().join('.');
  if(!cls||seen.has(cls))continue;seen.add(cls);
  const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden')continue;
  out[cls]={tag:e.tagName.toLowerCase(),text:e.textContent.trim().slice(0,24),fam:cs.fontFamily.split(',')[0].replace(/"/g,''),
   w:cs.fontWeight,fs:+parseFloat(cs.fontSize).toFixed(1),lh:cs.lineHeight==='normal'?'normal':+parseFloat(cs.lineHeight).toFixed(1),
   ls:cs.letterSpacing==='normal'?0:+parseFloat(cs.letterSpacing).toFixed(2),tr:cs.textTransform,st:cs.fontStyle,
   synth:cs.fontSynthesis}}
 out.__faces=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family.replace(/"/g,'')+' '+f.weight+' '+f.style);
 return out}"""
PAGES = [('orig', 'https://juanmora.co/', 12000, False), ('ours', _env.page_url(), 4500, True)]
res = {}
with sync_playwright() as p:
    b = _env.launch(p, scrollbars=True)
    for w, h in [(1440, 900), (375, 812)]:
        for name, url, load, ours in PAGES:
            pg = _env.open_page(b, url, w, h, None, wait=load, ours=ours)
            H = pg.evaluate('document.documentElement.scrollHeight')
            for y in range(0, H, 700): pg.evaluate(_env.SCROLL, y); pg.wait_for_timeout(120)   # (lazy fonts / SplitText)
            res[f'{name}_{w}'] = pg.evaluate(JS); pg.context.close()
    b.close()
json.dump(res, open(os.path.join(_env.OUT, 'typo.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
for w in (1440, 375):
    o, u = res[f'orig_{w}'], res[f'ours_{w}']
    print(f'== {w}  twarze oryginału: {sorted(set(o.pop("__faces")))}\n   nasze: {sorted(set(u.pop("__faces")))}')
    for k in sorted(set(o) & set(u)):
        a, c = o[k], u[k]; diffs = []
        if a['w'] != c['w']: diffs.append(f"grubość {a['w']}→{c['w']}")
        if abs(a['fs'] - c['fs']) > 0.5: diffs.append(f"rozmiar {a['fs']}→{c['fs']}")
        if a['lh'] != c['lh'] and not (isinstance(a['lh'], float) and isinstance(c['lh'], float) and abs(a['lh'] - c['lh']) <= 0.5):
            diffs.append(f"interlinia {a['lh']}→{c['lh']}")
        if abs(a['ls'] - c['ls']) > 0.1: diffs.append(f"odstęp {a['ls']}→{c['ls']}")
        if a['tr'] != c['tr']: diffs.append(f"wielkość {a['tr']}→{c['tr']}")
        if diffs: print(f"  .{k:34s} „{c['text'][:16]}”: " + '; '.join(diffs))
    print('  tylko w oryginale:', ', '.join(sorted(set(o) - set(u)))[:600])
