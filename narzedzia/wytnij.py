"""Wycięcie postaci (u2net_human_seg, lokalnie, onnxruntime): py -I cutout.py wejście.jpg wyjście.webp [podgląd.jpg]
Wynik: ten sam rozmiar co wejście, kanał alfa z maski modelu (miękkie krawędzie włosów)."""
import os, sys
T = os.path.join(os.environ['LOCALAPPDATA'], 'wir-tools')
sys.path.insert(0, os.path.join(T, 'rembg')); sys.path.insert(0, os.path.join(T, 'pw'))
import numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
x = np.asarray(im.resize((320, 320), Image.LANCZOS), dtype=np.float32) / 255.0
x = (x - np.array([0.485, 0.456, 0.406], np.float32)) / np.array([0.229, 0.224, 0.225], np.float32)
x = x.transpose(2, 0, 1)[None]
sess = ort.InferenceSession(os.path.join(T, 'rembg', 'models', 'u2net_human_seg.onnx'), providers=['CPUExecutionProvider'])
m = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
m = (m - m.min()) / (m.max() - m.min() + 1e-8)
a = Image.fromarray((m * 255).astype(np.uint8)).resize(im.size, Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.2))
# (a bit firmer core, soft fringe: hair strands stay translucent instead of a hard polygon edge)
a = a.point(lambda v: 0 if v < 18 else min(255, int((v - 18) * 1.25)))
# background bleed: the model keeps the cool blue-grey window light between the hair ends; light pixels with more
# blue than red lose their alpha (the hair, skin and sweater are warm or dark and stay)
px = np.asarray(im, dtype=np.float32); al = np.asarray(a, dtype=np.float32)
cool = np.clip((px[..., 2] - px[..., 0] - 3) / 12, 0, 1)
light = np.clip((px.mean(axis=2) - 115) / 50, 0, 1)
keep = 1 - cool * light
keep = np.asarray(Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.5)), dtype=np.float32) / 255
a = Image.fromarray((al * keep).astype(np.uint8))
out = im.copy(); out.putalpha(a)
out.save(dst, 'WEBP', quality=82, method=6)
print(dst, os.path.getsize(dst), 'B', im.size)
if len(sys.argv) > 3:  # podgląd na jasnym i ciemnym tle obok siebie
    w, h = im.size; prev = Image.new('RGB', (w * 2, h), (40, 30, 26)); prev.paste((235, 220, 205), (0, 0, w, h))
    prev.paste(out, (0, 0), out); prev.paste(out, (w, 0), out)
    prev.resize((w, h // 2)).save(sys.argv[3], quality=85); print(sys.argv[3])
