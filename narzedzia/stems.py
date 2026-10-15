"""Grubość pionowej kreski (l, I, H) i wysokość wersalika w px przy font-size 400 px: Goga 400/500/600 (na stronie
oryginału, jego @font-face) i Figtree 400–800 (na naszej, dociągnięte z Google Fonts). Względna grubość = kreska /
wersalik, bo kroje mają inne proporcje."""
import os, sys
sys.path.insert(0, r'C:\Projekty\warsztat-nowy\tools')
os.environ['WARSZTAT_PROJ'] = r'C:\Projekty\milavoss-warsztat'
import _env
from playwright.sync_api import sync_playwright
MEASURE = r"""async ([fam, weights])=>{const out={};
 for(const w of weights){await document.fonts.load(`${w} 400px ${fam}`);
  const c=document.createElement('canvas');c.width=1600;c.height=600;const x=c.getContext('2d');
  const row=(ch)=>{x.clearRect(0,0,1600,600);x.fillStyle='#000';x.font=`${w} 400px ${fam}`;x.textBaseline='alphabetic';x.fillText(ch,100,500);
   const m=x.measureText('H');const cap=Math.round(m.actualBoundingBoxAscent);const y=Math.round(500-cap*0.45);
   const d=x.getImageData(0,y,1600,1).data;let run=0,best=0;for(let i=0;i<1600;i++){if(d[i*4+3]>128){run++;best=Math.max(best,run)}else run=0}
   return [best,cap]};
  const [l,cap]=row('l'),[I]=row('I'),[H]=row('H');
  out[w]={l,I,H,cap,rel:+((l+I+H)/3/cap).toFixed(4),ok:document.fonts.check(`${w} 40px ${fam}`)}}
 return out}"""
with sync_playwright() as p:
    b = _env.launch(p)
    pg = _env.open_page(b, 'https://juanmora.co/', 1440, 900, wait=9000, ours=False)
    print('Goga', pg.evaluate(MEASURE, ['Goga', [400, 500, 600]]))
    pg.context.close()
    pg = _env.open_page(b, _env.page_url(), 1440, 900, wait=3000)
    pg.evaluate("""()=>new Promise(r=>{const l=document.createElement('link');l.rel='stylesheet';
      l.href='https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap';l.onload=r;document.head.appendChild(l)})""")
    print('Figtree', pg.evaluate(MEASURE, ['Figtree', [400, 500, 600, 650, 700, 800]]))
    b.close()
