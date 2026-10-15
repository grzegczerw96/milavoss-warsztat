"""Łamanie wierszy: każdy element z własnym tekstem, liczba wierszy (Range.getClientRects) i szerokość najdłuższego
wiersza; poprzednia wersja (HEAD) vs bieżąca, na 1440, ekranie Grzegorza i 375. Wypisuje tylko zmiany liczby wierszy
oraz zmiany szerokości > 3%."""
import os, sys
sys.path.insert(0, r'C:\Projekty\warsztat-nowy\tools')
os.environ['WARSZTAT_PROJ'] = r'C:\Projekty\milavoss-warsztat'
import _env
from playwright.sync_api import sync_playwright
JS = r"""()=>{const out={};let i=0;
 for(const e of document.querySelectorAll('body *')){
  const own=[...e.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim());if(!own.length)continue;
  const cs=getComputedStyle(e);if(cs.display==='none')continue;
  const r=document.createRange();r.selectNodeContents(e);const rects=[...r.getClientRects()].filter(q=>q.width>1);
  const tops=new Map();for(const q of rects){const t=Math.round(q.top/4);tops.set(t,(tops.get(t)||0)+q.width)}
  const key=(e.id?'#'+e.id:e.tagName.toLowerCase()+'.'+(typeof e.className==='string'?e.className.trim().split(/\s+/)[0]:''))+':'+(i++);
  out[key]={t:e.textContent.trim().slice(0,28),lines:tops.size,w:Math.round(Math.max(0,...tops.values()))}}
 return out}"""
with sync_playwright() as p:
    b = _env.launch(p, scrollbars=True)
    head = _env.snapshot('HEAD')
    for w, h, d in [(1440, 900, None), (1536, 742, 1.25), (375, 812, None)]:
        res = []
        for root in (head, None):
            pg = _env.open_page(b, _env.page_url(root), w, h, d, wait=4500); res.append(pg.evaluate(JS)); pg.context.close()
        a, c = res; n = 0
        print(f'== {w}x{h}')
        for k in a:
            if k not in c: continue
            x, y = a[k], c[k]
            if x['lines'] != y['lines']: print(f"  ! wiersze {x['lines']}→{y['lines']}  {k}  „{x['t']}”"); n += 1
            elif x['w'] and abs(y['w'] - x['w']) / x['w'] > 0.03: print(f"  szer {x['w']}→{y['w']}  {k}  „{x['t']}”"); n += 1
        print('  zmian:', n)
    b.close()
