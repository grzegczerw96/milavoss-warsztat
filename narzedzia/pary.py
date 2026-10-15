"""Pary oryginał | nasza z dwóch folderów ref.py: py -I pary.py <out> <size> s1_p2 s3_p3 ..."""
import os, sys
sys.path.insert(0, os.path.join(os.environ['LOCALAPPDATA'], 'wir-tools', 'pw'))
from PIL import Image, ImageDraw

out, size, keys = sys.argv[1], sys.argv[2], sys.argv[3:]
dst = os.path.join(out, 'pary'); os.makedirs(dst, exist_ok=True)
for k in keys:
    s, p = k.split('_')
    a = Image.open(os.path.join(out, 'ref_orig', f'sek_{size}_{s}_{p}.jpg'))
    b = Image.open(os.path.join(out, 'ref_ours', f'sek_{size}_{s}_{p}.jpg'))
    w = 1100 if a.width > a.height else 420
    a = a.resize((w, round(a.height * w / a.width))); b = b.resize((w, round(b.height * w / b.width)))
    im = Image.new('RGB', (2 * w + 10, max(a.height, b.height) + 24), 'white')
    im.paste(a, (0, 24)); im.paste(b, (w + 10, 24))
    d = ImageDraw.Draw(im); d.text((4, 4), f'ORYGINAŁ {size} {s} {p}', fill='red'); d.text((w + 14, 4), 'NASZA', fill='red')
    im.save(os.path.join(dst, f'{size}_{s}_{p}.jpg'), quality=85)
    print(os.path.join(dst, f'{size}_{s}_{p}.jpg'))
