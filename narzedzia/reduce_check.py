"""Oryginał i nasza z prefers-reduced-motion: reduce (jak Chrome Grzegorza przy wyłączonych animacjach w Windows):
kolor słów nagłówka usług w dwóch położeniach przewijania. Inny kolor = ruch działa."""
import os, sys
sys.path.insert(0, r'C:\Projekty\warsztat-nowy\tools')
os.environ['WARSZTAT_PROJ'] = r'C:\Projekty\milavoss-warsztat'
import _env
from playwright.sync_api import sync_playwright

PAGES = [('oryginał', 'https://juanmora.co/', 9000), ('nasza', _env.page_url(), 4000)]
JS = """()=>{const h=document.querySelector('.service-headline');const ws=[...h.querySelectorAll('div,span')].filter(e=>e.children.length===0&&e.textContent.trim());
 const t=h.getBoundingClientRect().top;return {top:Math.round(t), first:getComputedStyle(ws[0]||h).color, last:getComputedStyle(ws[ws.length-1]||h).color,
 reduce:matchMedia('(prefers-reduced-motion: reduce)').matches}}"""
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', args=['--use-gl=angle'])  # bez --force-prefers-no-reduced-motion
    for name, url, load in PAGES:
        ctx = b.new_context(viewport={'width': 1440, 'height': 900}, reduced_motion='reduce'); pg = ctx.new_page()
        pg.goto(url, wait_until='load', timeout=90000); pg.wait_for_timeout(load)
        y0 = pg.evaluate("()=>document.querySelector('.service-headline').getBoundingClientRect().top+scrollY")
        for frac in (0.9, 0.6):
            pg.mouse.move(700, 450)
            target = y0 - 900 * frac
            for _ in range(40):
                cur = pg.evaluate('scrollY')
                if abs(cur - target) < 60: break
                pg.mouse.wheel(0, max(-400, min(400, target - cur))); pg.wait_for_timeout(120)
            pg.wait_for_timeout(1800)
            print(name, f'nagłówek {int(frac*100)}% ekranu:', pg.evaluate(JS))
        ctx.close()
    b.close()
