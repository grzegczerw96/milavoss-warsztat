/* ============================================================
   Mila Voss — GSAP motion
   Timings mirror the reference: loader (1.8 s), hero reveal,
   scrubbed scroll scenes (scrub .8), hover micro-interactions.
   ============================================================ */
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create("osmo", "0.625, 0.05, 0, 1");
gsap.defaults({ overwrite: "auto", ease: "osmo", duration: 0.6 });

/* The reference ignores prefers-reduced-motion (no such condition in its IX3 data), so the page moves the same
   with the system's animations off (decision 15.10.2026; Grzegorz's Windows has them off) */
const reduceMotion = false;
const isTouch = window.matchMedia("(hover: none)").matches;

/* ------------------------------------------------------------
   LENIS SMOOTH SCROLL
   ------------------------------------------------------------ */
let lenis = null;
if (typeof Lenis !== "undefined") {
  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    gestureOrientation: "vertical",
    normalizeWheel: false,
    smoothTouch: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ------------------------------------------------------------
   NAV THEME (IntersectionObserver, same margins as reference)
   ------------------------------------------------------------ */
function initNavTheme() {
  const sections = document.querySelectorAll("[data-nav]");
  const navEls = document.querySelectorAll(".nav-name-word:not(.intro), .nav-link-mobile, .nav-link, .nav-social-link");
  if (!sections.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const peach = entry.target.getAttribute("data-nav") === "peach";
      navEls.forEach((el) => el.classList.toggle("is-peach", peach));
    });
  }, { root: null, rootMargin: "-50px 0px -90% 0px", threshold: 0 });
  sections.forEach((s) => io.observe(s));
}

/* ------------------------------------------------------------
   MONOGRAM ICON (bars bounce in; replays on hover)
   ------------------------------------------------------------ */
function buildIcon(el) {
  el.innerHTML = '<span class="bar bar-1"></span><span class="bar bar-2"></span><span class="bar bar-3"></span><span class="dot"></span>';
}
function iconTimeline(el) {
  const bars = el.querySelectorAll(".bar");
  const dot = el.querySelector(".dot");
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(bars, { yPercent: 120, scaleY: 0.4 }, { yPercent: 0, scaleY: 1, duration: 0.9, stagger: 0.08, ease: "elastic.out(1, 0.45)" }, 0)
    .fromTo(dot, { y: -14, scale: 0 }, { y: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" }, 0.45);
  return tl;
}
function initIcons() {
  document.querySelectorAll(".mv-icon").forEach((el) => {
    buildIcon(el);
    const tl = iconTimeline(el);
    el._tl = tl;
    const link = el.closest("a");
    (link || el).addEventListener("mouseenter", () => { tl.progress(0.23).play(); });
  });
}
function playIconsOnLoad() {
  document.querySelectorAll(".mv-icon").forEach((el) => el._tl && el._tl.play());
}

/* ------------------------------------------------------------
   NAV HOVERS (char stagger, dot bounce)
   ------------------------------------------------------------ */
function initNavHovers() {
  if (isTouch) return;
  document.querySelectorAll(".nav-link, .nav-social-link").forEach((link) => {
    const split = new SplitText(link, { type: "chars" });
    link.addEventListener("mouseenter", () => {
      const tl = gsap.timeline();
      tl.to(split.chars, { opacity: 0, y: -2, duration: 0.2, stagger: 0.1, ease: "power3.out" }, 0)
        .to(split.chars, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "power3.out" }, 0.2);
    });
  });

  const name = document.getElementById("navName");
  if (name) {
    const words = name.querySelectorAll(".nav-name-word");
    const dot = name.querySelector(".dot-mv");
    const split = new SplitText(words, { type: "chars" });
    name.addEventListener("mouseenter", () => {
      const tl = gsap.timeline();
      tl.to(split.chars, { opacity: 0, y: -2, duration: 0.2, stagger: 0.1, ease: "power3.out" }, 0)
        .to(split.chars, { opacity: 1, y: 0, duration: 0.2, stagger: 0.1, ease: "power3.out" }, 0.2)
        .to(dot, { y: -10, scale: 1.2, duration: 0.3, ease: "power3.out" }, 0)
        .to(dot, { y: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.3)" }, 0.5);
    });
  }
}

/* ------------------------------------------------------------
   HERO NAME — letters stretch toward the cursor, a project
   window sits between the two words (mouse-X scrubbed).
   ------------------------------------------------------------ */
const nameState = { target: 0.5, current: 0.5, letters: [], ready: false };

function buildName() {
  const stage = document.getElementById("nameStage");
  if (!stage) return;
  const words = stage.querySelectorAll(".name-word");
  words.forEach((w) => {
    w.innerHTML = "";
    [...w.dataset.word].forEach((ch) => {
      const s = document.createElement("span");
      s.className = "name-letter";
      s.textContent = ch;
      w.appendChild(s);
    });
  });
}

function measureName() {
  const stage = document.getElementById("nameStage");
  if (!stage || getComputedStyle(stage).display === "none") { nameState.ready = false; return; }
  const win = document.getElementById("nameWindow");
  const letters = [...stage.querySelectorAll(".name-letter")];
  letters.forEach((l) => (l.style.transform = "none"));
  const stageW = stage.getBoundingClientRect().width;
  const winBase = stageW * 0.26;            /* 26 vw of the stage */
  const gap = stageW * 0.015;
  const natural = letters.map((l) => l.getBoundingClientRect().width);
  const sum = natural.reduce((a, b) => a + b, 0);
  /* size the font so that, at rest, the words + window fill the stage exactly */
  const fs = parseFloat(getComputedStyle(letters[0]).fontSize);
  const k = (stageW - winBase - 2 * gap) / sum;
  letters.forEach((l) => (l.style.fontSize = fs * k + "px"));
  const w = letters.map((l) => l.getBoundingClientRect().width);
  const total = w.reduce((a, b) => a + b, 0);
  /* normalised centre of each letter across the whole name (0..1) */
  let acc = 0;
  const first = document.querySelector('.name-word[data-word]').children.length;
  nameState.letters = letters.map((el, i) => {
    if (i === first) acc += winBase + 2 * gap;
    const x = (acc + w[i] / 2) / stageW;
    acc += w[i];
    return { el, w: w[i], x, r0: gsap.utils.interpolate(0.23, 2.53, x), r60: gsap.utils.interpolate(2.53, 0.23, x) };
  });
  nameState.first = first;
  nameState.stageW = stageW;
  nameState.winBase = winBase;
  nameState.gap = gap;
  nameState.win = win;
  nameState.total = total;
  nameState.ready = true;
  renderName(true);
}

function renderName(force) {
  if (!nameState.ready) return;
  const dt = 1 - Math.pow(1 - 0.1, gsap.ticker.deltaRatio());
  nameState.current += (nameState.target - nameState.current) * dt;
  const f = 1 - nameState.current;                      /* lottie frame fraction: 0 = cursor right */
  const tri = (a, b) => (f < 0.5 ? gsap.utils.interpolate(a, 1, f / 0.5) : gsap.utils.interpolate(1, b, (f - 0.5) / 0.5));
  const winW = nameState.winBase * tri(0.72, 0.72);
  const avail = nameState.stageW - winW - 2 * nameState.gap;
  const scales = nameState.letters.map((L) => tri(L.r0, L.r60));
  const sum = nameState.letters.reduce((a, L, i) => a + L.w * scales[i], 0);
  const k = avail / sum;
  let x = 0;
  nameState.letters.forEach((L, i) => {
    if (i === nameState.first) {
      x += nameState.gap;
      nameState.win.style.transform = `translate3d(${x}px,0,0) scaleX(${winW / nameState.winBase})`;
      x += winW + nameState.gap;
    }
    const s = scales[i] * k;
    L.el.style.transform = `translate3d(${x}px,0,0) scaleX(${s})`;
    x += L.w * s;
  });
  /* 4 project cards, one per quarter of the timeline */
  const idx = Math.min(3, Math.floor(f * 4));
  const order = [1, 3, 0, 2];
  const projs = nameState.win.querySelectorAll(".proj");
  projs.forEach((p, i) => p.classList.toggle("is-on", i === order[idx]));
}

function initName() {
  buildName();
  const hero = document.getElementById("hero");
  if (!hero) return;
  document.fonts.ready.then(measureName);
  window.addEventListener("resize", () => measureName());
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    nameState.target = gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width);
  });
  gsap.ticker.add(() => renderName());
}

/* ------------------------------------------------------------
   LOADER + HERO REVEAL (page-load timeline)
   ------------------------------------------------------------ */
function initLoader() {
  const loader = document.getElementById("loader");
  const intro = document.getElementById("intro");
  const line = document.getElementById("growLine");
  const heroImg = document.getElementById("heroImg");
  const content = document.getElementById("heroContent");
  const splitWords = new SplitText(content.querySelectorAll(".heading"), { type: "words" });
  const revealItems = [...splitWords.words, document.getElementById("nameStage")];

  if (reduceMotion) {
    loader.style.display = "none";
    document.querySelectorAll(".mv-icon").forEach((el) => el._tl && el._tl.progress(1));
    return;
  }
  gsap.set(revealItems, { opacity: 0, y: 10 });
  gsap.set(heroImg, { opacity: 0.5, height: "120%" });
  if (lenis) lenis.stop();

  const tl = gsap.timeline({
    onComplete: () => { loader.style.display = "none"; if (lenis) lenis.start(); },
  });
  tl.to(line, { width: "100%", duration: 0.6, ease: "power2.inOut" }, 0)
    .to(intro, { backgroundColor: "#ffbc95", duration: 0.54, ease: "power1.in" }, 0.45)
    .to(loader, { height: "0vh", duration: 0.6, ease: "power3.out" }, 1.2)
    .to(heroImg, { opacity: 1, height: "100%", duration: 1.14, ease: "power3.out" }, 1.2)
    .to(revealItems, { opacity: 1, y: 0, duration: 0.8, stagger: { amount: 0.3 }, ease: "power3.out" }, 1.54)
    .add(playIconsOnLoad, 1.3);
}

/* ------------------------------------------------------------
   SCROLL SCENES
   ------------------------------------------------------------ */
function initScrollScenes() {
  /* hero photo: parallax + dim (hero top→bottom of viewport … hero bottom→top) */
  gsap.fromTo("#heroImg", { yPercent: 0 }, {
    yPercent: 30, opacity: 0.6, ease: "none", immediateRender: false,
    scrollTrigger: { trigger: "#hero", start: "clamp(top bottom)", end: "clamp(bottom top)", scrub: 0.8 },
  });

  /* headline colour: peach → grey while it enters */
  gsap.fromTo("#csText", { color: "#ffbc95" }, {
    color: "#96908c", ease: "power1.out", duration: 2, immediateRender: false,
    scrollTrigger: { trigger: "#csWrap", start: "clamp(top 80%)", end: "clamp(top 40%)", scrub: 0.8 },
  });

  /* shapes + scroll lines, scrubbed over the whole section */
  const lines = [...document.querySelectorAll("#llScroll path")];
  lines.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });
  const tl = gsap.timeline({
    defaults: { ease: "power1.out", duration: 1 },
    scrollTrigger: { trigger: "#clickScroll", start: "clamp(top bottom)", end: "clamp(bottom top)", scrub: 0.8 },
  });
  tl.fromTo("#shSquare", { rotation: 70, y: "10vw" }, { rotation: 0, y: "-20vw" }, 0)
    .fromTo("#shPill", { y: "-5vw", rotation: 30 }, { y: "20vw", rotation: 0 }, 0)
    .fromTo(["#shBlueHex", "#shBluePill", "#shBlueCircle"], { y: "0vw", rotation: -160 }, { y: "-10vw", rotation: 60 }, 0)
    .fromTo(["#shCircleL", "#shCircleC"], { rotation: -160 }, { rotation: 60 }, 0)
    .fromTo("#shCirclePlus", { y: "10vw", rotation: 0 }, { y: "-10vw", rotation: 80 }, 0)
    .fromTo("#shHex", { rotation: 0 }, { rotation: 60 }, 0)
    .to(lines, { strokeDashoffset: 0, duration: 0.48, ease: "none" }, 0.3);
}

/* lines start exactly at the two stems of the "ll" in "scroll" */
function placeScrollLines() {
  const ll = document.getElementById("ll");
  const svg = document.getElementById("llScroll");
  const icons = document.getElementById("icons");
  if (!ll || !svg || getComputedStyle(svg).display === "none") return;
  const r = ll.getBoundingClientRect();
  const ir = icons.getBoundingClientRect();
  const fs = parseFloat(getComputedStyle(ll).fontSize);
  const stemL = r.left + r.width * 0.26;
  const stemR = r.left + r.width * 0.76;
  const stemW = fs * 0.115;
  const unit = (stemR - stemL) / 54;              /* 54 viewBox units between stems */
  const svgW = unit * 2880;
  svg.style.width = svgW + "px";
  svg.style.height = unit * 1897 + "px";
  svg.style.left = stemL - unit * 1440 - ir.left + "px";
  svg.style.top = r.top - ir.top + fs * 0.12 + "px";   /* x-height top of the l stems */
  svg.querySelectorAll("path").forEach((p) => p.setAttribute("stroke-width", stemW / unit));
}

/* ------------------------------------------------------------
   "click" PILL — hover + click
   ------------------------------------------------------------ */
function initClickPill() {
  const btn = document.getElementById("contClick");
  const word = document.getElementById("clickWord");
  const pill = document.getElementById("hoverPill");
  const text = document.getElementById("hoverText");
  if (!btn || isTouch) return;
  const split = new SplitText(word, { type: "chars" });

  const hover = gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
  hover.to(split.chars, { y: "-9vw", duration: 0.5, stagger: { amount: 0.2, from: "end" }, ease: "power2.inOut" }, 0)
       .to(pill, { y: "-9vw", scale: 1.6, duration: 0.4, ease: "expo.out" }, 0.25);

  btn.addEventListener("mouseenter", () => {
    hover.play();
    text.innerText = "Who's feeling curious?";
    gsap.fromTo(text, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.3, overwrite: true });
  });
  btn.addEventListener("mouseleave", () => {
    hover.reverse();
    gsap.to(text, { opacity: 0, duration: 0.3, overwrite: true });
  });
  btn.addEventListener("click", () => {
    text.innerText = "One more click!";
    const s = new SplitText(text, { type: "chars" });
    gsap.from(s.chars, { opacity: 0, stagger: 0.05, duration: 0.05, ease: "power2.out", overwrite: "auto" });
  });
}

/* ------------------------------------------------------------
   SECTION 3 — SERVICES (IX3 timelines t-1f21872a, t-63aaf3ca,
   t-cda553ee, t-6d9588ef, t-6db6fef5). All scrubbed, scrub .8,
   start/end wrapped in clamp() (Webflow clamp:!0).
   Durations missing in IX3 = its DEFAULTS.DURATION (.5 s).
   ------------------------------------------------------------ */
const scrubST = (trigger, start, end) => ({
  trigger, start: `clamp(${start})`, end: `clamp(${end})`, scrub: 0.8,
});
/* no invalidateOnRefresh: GSAP keeps vw units in the transform, and invalidating would drop
   the from-state of staggered tweens that have not started yet (centre mask showed flat) */

function initServices() {
  const peach = "#ffbc95";   /* IX3: #ffbc95 / hsla(22.08,100%,73.56%) */
  const grey = "#96908c";    /* IX3: hsla(20,4.11%,57.06%) */

  /* headline: words peach → grey, opacity .7 → 1 (t-1f21872a) */
  document.querySelectorAll(".service-headline").forEach((el) => {
    const split = new SplitText(el, { type: "words", wordsClass: "word" });
    if (reduceMotion) return;
    gsap.timeline({ scrollTrigger: scrubST(el, "top 95%", "top 45%") })
      .fromTo(split.words, { opacity: 0.7, color: peach }, {
        opacity: 1, color: grey, duration: 2, stagger: { each: 1, from: "start" }, ease: "expo.in",
      }, 0);
  });

  /* service titles: words peach → grey, opacity .3 → 1, scale .99 → 1 (t-63aaf3ca) */
  document.querySelectorAll(".service-h2").forEach((el) => {
    const split = new SplitText(el, { type: "words", wordsClass: "word" });
    if (reduceMotion) return;
    gsap.timeline({ scrollTrigger: scrubST(el, "top 80%", "top 50%") })
      .fromTo(split.words, { opacity: 0.3, scale: 0.99, color: peach }, {
        opacity: 1, scale: 1, color: grey, duration: 0.5, stagger: { each: 0.2, from: "start" }, ease: "power2.out",
      }, 0);
  });
  if (reduceMotion) return;

  /* text block drifts down 7vw while the service passes (t-cda553ee) */
  document.querySelectorAll(".cont-text-service").forEach((el) => {
    gsap.timeline({ scrollTrigger: scrubST(el, "top bottom", "bottom top") })
      .to(el, { y: "7vw", duration: 2, ease: "none" }, 0);
  });

  /* image masks flip up from the edges inwards (t-6d9588ef) */
  document.querySelectorAll(".cont-imgs-service").forEach((row) => {
    const masks = row.querySelectorAll(".mask-img-service");
    if (!masks.length) return;
    gsap.timeline({ scrollTrigger: scrubST(row, "top bottom", "top center") })
      .fromTo(masks, { y: "8vw", rotationX: 110, scale: 1.1 }, {
        y: "0vw", rotationX: 0, scale: 1, duration: 2.5, stagger: { amount: 0.7, from: "edges", grid: "auto" }, ease: "power1.out",
      }, 0);
  });

  /* tool frames float up in front of "Webflow & Framer" (t-6db6fef5) */
  document.querySelectorAll(".cont-title-service.webflow").forEach((el) => {
    const wf = el.querySelector(".webflow-frame");
    const fr = el.querySelector(".framer-frame");
    gsap.set(wf, { z: 83 });
    gsap.set(fr, { z: 79 });
    gsap.timeline({ scrollTrigger: scrubST(el, "top bottom", "bottom top") })
      .fromTo([wf, fr], { yPercent: 15 }, { yPercent: -5, duration: 0.5, ease: "none" }, 0);
  });
}

/* ------------------------------------------------------------
   SECTION 4 — WORK CTA (t-fe1c6370, t-9ea9222f, hover
   t-b98265b6 + t-e2221d1b). t-9c935436 has no actions.
   ------------------------------------------------------------ */
function initWorkCta() {
  const wrap = document.getElementById("workCta");
  const content = document.getElementById("workCtaContent");
  const folder = document.getElementById("folder");
  const big = document.getElementById("workBig");
  if (!wrap || !content || !folder || !big) return;

  const bigSplit = new SplitText(big, { type: "chars", charsClass: "char" });
  const copySplit = new SplitText(content.querySelectorAll(".body-copy"), { type: "words", wordsClass: "word" });
  if (reduceMotion) return;

  /* content block parallax 5vw → -5vw across the whole wrapper */
  gsap.timeline({ scrollTrigger: scrubST(wrap, "top bottom", "bottom top") })
    .fromTo(content, { y: "5vw" }, { y: "-5vw", duration: 0.5, ease: "none" }, 0);

  /* copy lines appear word by word */
  gsap.timeline({ scrollTrigger: scrubST(content, "top 80%", "top 40%") })
    .fromTo(copySplit.words, { opacity: 0 }, {
      opacity: 1, duration: 0.1, stagger: { each: 0.1 }, ease: "power1.out",
    }, 0);

  if (isTouch) return;
  const front = folder.querySelector(".front-folder");
  const sheets = folder.querySelector(".projects-folder");
  const icon = document.querySelector(".cursor-mv-icon");
  gsap.set(front, { rotationX: -20, transformOrigin: "50% 100%" });

  /* folder opens: front tilts to -35deg (elastic), sheets pop, "Work" letters brighten */
  const hover = gsap.timeline({ paused: true });
  hover.to(front, { rotationX: -35, duration: 0.68, ease: "elastic.out(0.7, 0.3)" }, 0)
       .to(sheets, { y: "2.4vw", scaleY: 1.8, duration: 0.23, ease: "power3.out" }, 0)
       .fromTo(bigSplit.chars, { opacity: 0.3 }, {
         opacity: 0.6, duration: 0.2, stagger: { each: 0.1, from: "start" }, ease: "power1.out",
       }, 0.11);
  /* cursor arrow bubble (t-e2221d1b: opacity 0 → 1, .3 s, no ease → page default) */
  const cursorTl = gsap.timeline({ paused: true });
  if (icon) cursorTl.fromTo(icon, { opacity: 0 }, { opacity: 1, duration: 0.3 });

  folder.addEventListener("mouseenter", () => { hover.play(); cursorTl.play(); });
  folder.addEventListener("mouseleave", () => { hover.reverse(); cursorTl.reverse(); });
  folder.addEventListener("click", (e) => e.preventDefault());
}

/* ------------------------------------------------------------
   CUSTOM CURSOR (reference initCursorFollow: lerp .09 on the
   gsap ticker). Shared: section 4 shows its icon, the email CTA
   (section 5) can use .text-mv-cursor.
   ------------------------------------------------------------ */
function initCursor() {
  const cursor = document.getElementById("cursorMv");
  if (!cursor || isTouch) return;
  const mouse = { x: 0, y: 0 };
  const pos = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  gsap.ticker.add(() => {
    const dt = reduceMotion ? 1 : 1 - Math.pow(1 - 0.09, gsap.ticker.deltaRatio());
    pos.x += (mouse.x - pos.x) * dt;
    pos.y += (mouse.y - pos.y) * dt;
    gsap.set(cursor, { x: pos.x, y: pos.y });
  });
}

/* ------------------------------------------------------------
   SECTIONS 5–7 helpers. Scrubbed timelines are built from IX3
   (positions/durations in timeline seconds; a scrubbed timeline is
   stretched over its scroll range). With reduced motion the same
   timeline is built paused and jumped to its end state.
   ------------------------------------------------------------ */
function scrubTimeline(trigger, start, end, scrub) {
  if (reduceMotion) return gsap.timeline({ paused: true });
  return gsap.timeline({
    scrollTrigger: { trigger, start: `clamp(${start})`, end: `clamp(${end})`, scrub },
  });
}
const finishIfReduced = (...tls) => { if (reduceMotion) tls.forEach((tl) => tl.progress(1)); };

/* ------------------------------------------------------------
   SECTION 5 — BENEFITS
   IX3: t-3bf46393 (.benefits-main-wrapper top 71% → top -40%, scrub .76)
        t-5adf0923 (.benefits-height-1step top bottom → bottom bottom, scrub .76)
        t-1654fd8f (.benefits-height-2step top 125% → bottom 110%, scrub .8)
        — these three: conditionalPlayback "dont-animate" on small/tiny (≤767)
        t-ce162241 (.benefits-main-wrapper top bottom → top top, scrub .8)
        t-f23dc8ae (.main-cta-wrapper top bottom → top top, scrub .8)
   ------------------------------------------------------------ */
function initBenefits() {
  const wrap = document.getElementById("benefits");
  if (!wrap) return;
  const good = document.getElementById("benGood");
  const takes = document.getElementById("benTakes");
  const saves = document.getElementById("benSaves");
  const line1 = document.getElementById("benLine");
  const head2 = document.getElementById("benHead");
  const dark = document.getElementById("benDark");
  const sil = document.getElementById("benSil");
  const light = document.getElementById("benLight");
  const step1 = document.getElementById("benStep1");
  const step2 = document.getElementById("benStep2");
  const lineStep2 = wrap.querySelector(".line-step2");
  const lineBenefits = wrap.querySelectorAll(".line-benefit");
  const checks = wrap.querySelectorAll(".check-icon");
  const ctaWrap = wrap.querySelector(".cont-cta-benefitc");

  /* photo parallax: dark photo + cut-out come down 3vw while the section enters (t-ce162241, tt:1 = from) */
  const tlPhoto = scrubTimeline(wrap, "top bottom", "top top", 0.8);
  tlPhoto.fromTo([sil, dark], { y: "-3vw" }, { y: "0vw", duration: 0.5, ease: "none" }, 0);
  /* light photo drifts 10vw down while the CTA covers it (t-f23dc8ae) */
  const tlLight = scrubTimeline(document.getElementById("mainCta"), "top bottom", "top top", 0.8);
  tlLight.to(light, { y: "10vw", duration: 0.5, ease: "none" }, 0);
  finishIfReduced(tlPhoto, tlLight);

  const mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    const sGood = new SplitText(good, { type: "words", wordsClass: "word" });
    const sTakes = new SplitText(takes, { type: "words", wordsClass: "word" });
    const sSaves = new SplitText(saves, { type: "words", wordsClass: "word" });
    const sStep2 = new SplitText([head2, ...wrap.querySelectorAll(".he-bulltet")], { type: "words", wordsClass: "word" });

    /* t-3bf46393 — headline lines slide against each other, line draws, last line fades in word by word (length 13.86) */
    const tlIn = scrubTimeline(wrap, "top 71%", "top -40%", 0.76);
    tlIn.fromTo(good, { xPercent: 18 }, { xPercent: -22, duration: 9.97, ease: "none" }, 0)
        .fromTo(takes, { xPercent: -33 }, { xPercent: 0, duration: 9.97, ease: "none" }, 0)
        .fromTo(line1, { width: "0%" }, { width: "100%", duration: 5.43, ease: "power2.out" }, 6.57)
        .fromTo(sSaves.words, { opacity: 0 }, { opacity: 1, duration: 1.05, stagger: { each: 0.8 }, ease: "none" }, 8.81);

    /* t-5adf0923 — step 1 fades out word by word ("takes time" first, IX3 target order), light photo fades in.
       IX3 uses tt:0 (to); fromTo + immediateRender:false keeps the fade-in above from being overwritten */
    const tlOut = scrubTimeline(step1, "top bottom", "bottom bottom", 0.76);
    tlOut.fromTo([...sTakes.words, ...sGood.words, ...sSaves.words, line1], { opacity: 1 }, {
            opacity: 0, duration: 0.2, stagger: { amount: 0.8, from: "start" }, ease: "power1.out", immediateRender: false,
          }, 0)
         .fromTo(light, { opacity: 0 }, { opacity: 1, duration: 0.83, ease: "power1.out", immediateRender: false }, 0.17);

    /* t-1654fd8f — step 2: words appear one by one (61 words → length 12.2), lines draw, checks + button drop in */
    const tlStep2 = scrubTimeline(step2, "top 125%", "bottom 110%", 0.8);
    tlStep2.fromTo(sStep2.words, { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: { each: 0.2 }, ease: "none" }, 0)
           .fromTo(lineBenefits, { width: "0%" }, { width: "100%", duration: 1.19, stagger: { each: 0.6 }, ease: "none" }, 3)
           .fromTo(lineStep2, { width: "0%" }, { width: "100%", duration: 2.26, ease: "power2.out" }, 1.99)
           .fromTo([...checks, ctaWrap], { opacity: 0, y: "-5px" }, {
             opacity: 1, y: "0px", duration: 1.18, stagger: { each: 1.5 }, ease: "power1.out",
           }, 3);
    finishIfReduced(tlIn, tlOut, tlStep2);

    return () => { sGood.revert(); sTakes.revert(); sSaves.revert(); sStep2.revert(); };
  });
}

/* "Learn more about me" — reference initCtaHovers, 1:1 */
function initCtaHovers() {
  document.querySelectorAll(".main-cont-button").forEach((link) => {
    const firstIcon = link.querySelector(".icon-wrapper-cta-first");
    const lastIcon = link.querySelector(".icon-wrapper-cta");
    link.addEventListener("mouseenter", () => {
      gsap.to(firstIcon, { width: "2.8rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.5, 0.3)", overwrite: true });
      gsap.to(lastIcon, { width: "0rem", rotation: -90, opacity: 0, duration: 0.2, ease: "power2.out", overwrite: true });
    });
    link.addEventListener("mouseleave", () => {
      gsap.to(firstIcon, { width: "0rem", rotation: -90, opacity: 0, duration: 0.3, ease: "power2.inOut", overwrite: true });
      gsap.to(lastIcon, { width: "2.8rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.6, 0.3)", overwrite: true });
    });
    link.addEventListener("click", (e) => e.preventDefault());
  });
}

/* ------------------------------------------------------------
   SECTION 6 — MAIN CTA
   IX3: t-f62c9b2b (.content-cta-wrapper top bottom → top 40%, scrub .8)
        t-8e774265 (hover .cta-button-wrapper, reverse on mouseleave)
   Cursor text + copy-to-clipboard: reference initCursorInteractions.
   ------------------------------------------------------------ */
function initMainCta() {
  const content = document.getElementById("ctaContent");
  const btn = document.getElementById("ctaBtn");
  if (!content || !btn) return;

  const sHead = new SplitText(content.querySelectorAll(".heading-cta"), { type: "words", wordsClass: "word" });
  const sBody = new SplitText(content.querySelector(".body-copy-cta"), { type: "words", wordsClass: "word" });
  const tl = scrubTimeline(content, "top bottom", "top 40%", 0.8);
  tl.fromTo(sHead.words, { opacity: 0 }, { opacity: 1, duration: 0.15, stagger: { each: 0.1 }, ease: "power2.out" }, 0)
    .fromTo(sBody.words, { opacity: 0 }, { opacity: 1, duration: 0.15, stagger: { each: 0.1 }, ease: "power2.out" }, 0.04);
  finishIfReduced(tl);

  /* hover: grey fill rises from the bottom, email types in over it (IX3 email action has no ease → page default) */
  const sEmail = new SplitText(btn.querySelector(".email-cta"), { type: "chars", charsClass: "char" });
  const hover = gsap.timeline({ paused: true });
  hover.to(btn.querySelector(".hover-main-cta"), { height: "100%", duration: 0.6, ease: "power2.out" }, 0)
       .fromTo(sEmail.chars, { opacity: 0 }, { opacity: 1, duration: 0.05, stagger: { each: 0.03 } }, 0.08);
  btn.addEventListener("mouseenter", () => hover.play());
  btn.addEventListener("mouseleave", () => hover.reverse());
}

function initCursorInteractions() {
  const cta = document.getElementById("ctaBtn");
  const cursorText = document.querySelector(".text-mv-cursor");
  const myEmail = "hello@milavoss.co";
  if (!cta || !cursorText) return;
  cursorText.innerText = "Copy my Email";
  cta.addEventListener("mouseenter", () => {
    cursorText.innerText = "Copy my Email";
    gsap.to(cursorText, { opacity: 1, duration: 0.5, overwrite: true });
  });
  cta.addEventListener("mouseleave", () => {
    gsap.to(cursorText, { opacity: 0, duration: 0.3, overwrite: true });
  });
  const copied = () => {
    cursorText.innerText = "Nice! Email copied";
    const split = new SplitText(cursorText, { type: "chars" });
    gsap.from(split.chars, { opacity: 0, stagger: 0.05, duration: 0.05, ease: "back.out(1.7)", overwrite: true });
  };
  /* fallback for contexts without the async Clipboard API (e.g. some file:// or http previews) */
  const legacyCopy = () => {
    const ta = document.createElement("textarea");
    ta.value = myEmail;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  };
  cta.addEventListener("click", (e) => {
    e.preventDefault();
    const p = navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(myEmail) : Promise.reject();
    p.then(copied, () => { if (legacyCopy()) copied(); });
  });
}

/* ------------------------------------------------------------
   SECTION 7 — FOOTER
   IX3: t-a2e3350e (.main-cta-wrapper bottom 105% → bottom top): footer y -20vw → 0
        t-8e9bebbf (.main-cta-wrapper bottom center → bottom top): name words rise 10vw in masks
   ------------------------------------------------------------ */
function initFooter() {
  const footer = document.getElementById("footer");
  const cta = document.getElementById("mainCta");
  if (!footer || !cta) return;
  const tlReveal = scrubTimeline(cta, "bottom 105%", "bottom top", 0.8);
  tlReveal.fromTo(footer, { y: "-20vw" }, { y: "0vw", duration: 1, ease: "none" }, 0);

  const names = footer.querySelectorAll(".name-footer");
  const sNames = new SplitText(names, { type: "words", mask: "words", wordsClass: "word" });
  const tlNames = scrubTimeline(cta, "bottom center", "bottom top", 0.8);
  tlNames.fromTo(sNames.words, { y: "10vw" }, { y: "0vw", duration: 2, stagger: { amount: 0.2 }, ease: "power1.out" }, 0);
  finishIfReduced(tlReveal, tlNames);
  initFooterMila(footer);
}

/* Mila behind the monitor: a slow head sway, a small nod to the music, blinks, eyes reading across the screen and the
   screen light flickering on her face. Plays only while the footer is on screen. */
function initFooterMila(footer) {
  const svg = document.getElementById("fsMila");
  if (!svg) return;
  const q = (s) => svg.querySelectorAll(s);
  const tl = gsap.timeline({ paused: true });
  tl.to(q(".m-head"), { rotation: 2.2, svgOrigin: "100 170", duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true }, 0)
    .to(q(".m-head"), { y: 1.6, duration: 0.46, ease: "sine.inOut", repeat: -1, yoyo: true }, 0)
    .to(q(".m-body"), { y: 0.8, duration: 0.46, ease: "sine.inOut", repeat: -1, yoyo: true }, 0.08)
    .to(q(".m-eye, .m-glint"), { scaleY: 0.12, transformOrigin: "50% 50%", duration: 0.07, ease: "power1.in",
      repeat: -1, yoyo: true, repeatDelay: 3.4 }, 1.2)
    .to(q(".m-eyes"), { x: 2.4, duration: 1.6, ease: "steps(4)", repeat: -1, yoyo: true, repeatDelay: 0.5 }, 0)
    .to(q(".m-light"), { opacity: 0.45, duration: 0.9, ease: "sine.inOut", repeat: -1, yoyo: true }, 0)
    .to(q(".m-led"), { opacity: 0.2, duration: 0.8, ease: "steps(1)", repeat: -1, yoyo: true }, 0);
  ScrollTrigger.create({
    trigger: footer, start: "top bottom", end: "bottom top",
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });
}

/* ------------------------------------------------------------
   BOOT
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  initIcons();
  initNavTheme();
  initName();
});

window.addEventListener("load", () => {
  document.fonts.ready.then(() => {
    placeScrollLines();
    initLoader();
    initNavHovers();
    initClickPill();
    initScrollScenes();
    initServices();
    initWorkCta();
    initCursor();
    initBenefits();
    initCtaHovers();
    initMainCta();
    initCursorInteractions();
    initFooter();
    ScrollTrigger.refresh();
  });
});
window.addEventListener("resize", () => { placeScrollLines(); ScrollTrigger.refresh(); });
