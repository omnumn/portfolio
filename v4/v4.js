/* v4 tape measure.
   X = where the hook is on screen. The reading point R is the middle of the page next to the case
   (the middle of the screen once the case has gone). Rest: the hook sits on R = About.
   Project i is pencilled D[i] from the hook, so it is read when X = R + D[i].
   Drag / sideways scroll / ← → move the tape; on release it is pulled onto the nearest stop.
   Scroll down or click the project to open it: the case slides out, the tape runs edge to edge. */
const $ = (s) => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const app = $("#app"), caseEl = $("#case"), hub = $("#hub"), hubI = hub.querySelector("i");
const rail = $("#rail"), tape = $("#tape"), pull = $("#pull");
const over = $("#over"), detail = $("#detail"), art = $("#art"), mini = $("#mini"), snd = $("#snd"), cue = $("#cue");

const LEN = 4000;
// marks are 10 × 64 apart, so only one shows beside the case. The first sits far enough from the hook
// that the hook stays off screen even when the case has gone and the tape is read from the middle
let D = [];
const layout = () => {
  const d0 = Math.max(640, Math.ceil((innerWidth / 2 + 64) / 64) * 64);
  D = PROJECTS.map((_, i) => d0 + 640 * i);
  marks.forEach((m, i) => { m.style.right = `${D[i]}px`; });
};
const flag = (q) => `<span class="flag">[확인필요: ${q}]</span>`;
const img = (f) => `../assets/${f}`;
PROJECTS.forEach((p) => { new Image().src = img(p.shots[0][0]); });

const marks = PROJECTS.map((p, i) => {
  const m = document.createElement("button");
  m.type = "button";
  m.className = "mk press";
  m.style.setProperty("--c", p.c);
  m.setAttribute("aria-label", p.name);
  m.innerHTML = "<b></b><i></i>";
  m.addEventListener("click", () => { if (!moved) go(i); });
  tape.appendChild(m);
  return m;
});

/* ---------- sound: a ratchet click each time a 32px tick passes, a clack when the hook hits the case ---------- */
let ac = null, noise = null, soundOn = true, lastClick = 0;
function unlock() {
  if (ac) { if (ac.state === "suspended") ac.resume(); return; }
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    const n = Math.floor(ac.sampleRate * 0.025);
    noise = ac.createBuffer(1, n, ac.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 6);
  } catch (e) { ac = null; }
}
function click(speed, dir) {
  if (!soundOn || !ac || ac.state !== "running") return;
  const t = ac.currentTime;
  if (t - lastClick < 0.012) return;
  lastClick = t;
  const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = noise;
  s.playbackRate.value = 0.9 + Math.random() * 0.2;
  f.type = "bandpass";
  f.frequency.value = (dir < 0 ? 3200 : 2300) + Math.random() * 500; // winding in sounds a little higher
  f.Q.value = 4;
  g.gain.value = Math.min(0.3, 0.05 + Math.abs(speed) / 7000);
  s.connect(f); f.connect(g); g.connect(ac.destination);
  s.start(t);
}
function clack() {
  if (!soundOn || !ac || ac.state !== "running") return;
  const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(190, t);
  o.frequency.exponentialRampToValueAtTime(70, t + 0.09);
  g.gain.setValueAtTime(0.3, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  o.connect(g); g.connect(ac.destination);
  o.start(t); o.stop(t + 0.13);
  click(6000, -1);
}
// every button clicks when pressed, the same click (DESIGN §6-2)
document.addEventListener("pointerdown", (e) => { if (e.button === 0 && e.target.closest(".press")) { unlock(); click(1800, 1); } });
snd.addEventListener("click", () => {
  soundOn = !soundOn;
  snd.setAttribute("aria-pressed", soundOn);
  snd.setAttribute("aria-label", soundOn ? "Sound on" : "Sound off");
});
["pointerdown", "keydown"].forEach((t) => addEventListener(t, unlock, { capture: true }));

/* ---------- geometry ---------- */
let vw = innerWidth, caseW = caseEl.offsetWidth, mode = "over";
function geo() { vw = innerWidth; caseW = caseEl.offsetWidth; layout(); }
const R = () => (mode === "detail" ? vw / 2 : (caseW + vw) / 2);
const stop = (i) => R() + (i < 0 ? 0 : D[i]); // i = -1 is About
function nearest(x) {
  let b = -1;
  for (let i = 0; i < D.length; i++) if (Math.abs(x - stop(i)) < Math.abs(x - stop(b))) b = i;
  return b;
}

/* ---------- one spring for the tape ---------- */
const PULL = { k: 160, c: 17 }; // long travel: chewy, a visible overshoot
const SNAP = { k: 520, c: 32 }; // onto a mark: quick
let X = 0, v = 0, target = 0, spring = SNAP, raf = 0, last = 0, lastK = 0, active = -2, goal = -1;
function draw() {
  tape.style.transform = `translate3d(${X - LEN}px,0,0)`;
  pull.style.transform = `translate3d(${X}px,0,0)`;
  hubI.style.transform = `rotate(${X * 0.45}deg)`;
  const k = Math.floor(X / 32);
  if (k !== lastK) { click(v, k - lastK); lastK = k; }
  const i = nearest(X);
  if (i !== active) show(i);
}
function step(t) {
  const dt = Math.min(0.032, (t - last) / 1000);
  last = t;
  const before = X;
  v += (spring.k * (target - X) - spring.c * v) * dt;
  X += v * dt;
  if (goal === -1 && before > target && X <= target && v < -400) clack(); // hook hits the case
  if (Math.abs(target - X) < 0.1 && Math.abs(v) < 2) { X = target; v = 0; raf = 0; draw(); return; }
  draw();
  raf = requestAnimationFrame(step);
}
function animateTo(x, s = SNAP) {
  target = x; spring = s;
  if (reduce) { cancelAnimationFrame(raf); raf = 0; X = x; v = 0; draw(); return; }
  if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); }
}
function halt() { cancelAnimationFrame(raf); raf = 0; }
function go(i, s) {
  i = Math.max(mode === "detail" ? 0 : -1, Math.min(D.length - 1, i));
  const far = Math.abs(i - goal) > 1 || i === -1 || goal === -1;
  goal = i;
  if (mode === "detail") { detail.scrollTop = 0; renderArt(true); }
  animateTo(stop(i), s || (far ? PULL : SNAP));
}

/* ---------- content ---------- */
const lineOf = (p) => (p.line ? p.line.join("<br>") : flag("한 줄 설명"));
const factsOf = (p) => `<dl class="facts">
  <div><dt>Year</dt><dd>${p.year || flag("연도")}</dd></div>
  <div><dt>Contribution</dt><dd>${p.contribution}</dd></div>
  <div><dt>Scope</dt><dd>${p.work}</dd></div></dl>`;
function show(i) {
  active = i;
  app.dataset.at = i < 0 ? "about" : "work";
  marks.forEach((m, k) => m.classList.toggle("is-on", k === i));
  if (i < 0) return;
  const p = PROJECTS[i];
  // same order as the detail: name, line, facts, then the picture
  over.innerHTML = `<div class="ov-top"><div><div class="head"><p class="name">${p.name}</p><p class="role serif">${p.role || flag("직무명")}</p></div>
    <p class="desc">${lineOf(p)}</p></div>${factsOf(p)}</div>
    <a class="shot" href="#" data-open aria-label="Open ${p.name}"><img src="${img(p.shots[0][0])}" alt=""></a>`;
  if (!reduce) over.animate([{ opacity: 0.5, filter: "blur(3px)" }, { opacity: 1, filter: "blur(0)" }], { duration: 240, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
}
/* a project told part by part. Each block is staged for scrolling: lines draw to what they point at,
   pinned parts play as you scroll, numbers are read off a tape.
   Numbering: only the parts are numbered (01, 02 … like readings on the tape). Inside a part nothing is
   numbered; order is shown by position, and weight (title over text) does the rest */
const pic = (f, alt = "", r) => `<img src="${img(f)}" alt="${alt}" loading="lazy"${r ? ` style="aspect-ratio:${r}"` : ""}>`;
const md = (s) => (s || "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
const pills = (w) => (w ? `<ul class="pl">${w.map((x) => `<li>${x}</li>`).join("")}</ul>` : "");
const sub = (s) => (s ? `<p class="sg">${s}</p>` : "");
const notes = (n, one) => `<ul class="nt${one ? " one" : ""}">${n.map(([h, t]) => `<li><b>${h}</b><p>${md(t)}</p></li>`).join("")}</ul>`;
const ticks = (n) => `<span class="tk" style="--n:${n}"></span>`;
const pics = (list, alt) => `<div class="duo-p">${list.map(([f, r]) => `<div class="im">${pic(f, alt, r)}</div>`).join("")}</div>`;
function inner(b) {
  if (!b || !Object.keys(b).length) return "";
  if (b.notes && !b.strip) return sub(b.sub) + notes(b.notes, b.one);
  // a lead chip (a gradient, say) takes the left half; the solid colors sit two by two beside it
  if (b.swatches) return `<ul class="sw${b.lead ? " ld" : ""}" data-in>${(b.lead ? [b.lead, ...b.swatches] : b.swatches).map(([n, h, bg], i) => `<li style="--i:${i}"><i style="background:${bg || h}"></i><b>${n}</b><span>${h}</span></li>`).join("")}</ul>`;
  // a face we have no web licence for is shown as a picture of its name
  if (b.type) return `<ul class="ty">${b.type.map(([k, n, f, im]) => `<li><span>${k}</span>${im ? `<img class="ty-img" src="${img(im)}" alt="${n}">` : `<b${f ? ` class="${f}"` : ""}>${n}</b>`}</li>`).join("")}</ul>`;
  if (b.time) {
    const t = b.time;
    return `<div class="tm" data-in>${sub(t.k)}${t.rows.map(([l, v]) => `<div class="tm-r"><div class="tape-s" style="--w:${v / t.max}">${ticks(t.max)}<i></i></div><span>${l}</span></div>`).join("")}
      <div class="st one"><div><b>${t.d}</b><span>${t.dk}</span></div></div></div>`;
  }
  // photos side by side at one height: each takes width by its ratio, so one of another ratio is kept whole
  if (b.imgs) return `<div class="bk ims">${b.imgs.map(([f, r]) => `<div class="im" style="--r:${r.split("/").reduce((w, h) => w / h)}">${pic(f, b.alt, r)}</div>`).join("")}</div>`;
  let s = sub(b.sub) + (b.text ? `<p class="tx">${b.text}</p>` : "") + pills(b.pills);
  if (b.grow) { const m = Math.max(...b.grow.map((g) => g[1])); s += `<div class="gr" data-in>${b.grow.map(([l, v]) => `<div class="tape-s" style="--w:${v / m}">${ticks(6)}<i></i><span>${l}</span></div>`).join("")}</div>`; }
  return s;
}
function block(b) {
  if (b.open) {
    const f = `<figure class="bk bleed op" data-s="view" data-k="open"${b.pos ? ` style="--pos:${b.pos}"` : ""}><div class="im" style="aspect-ratio:${b.ratio}">${pic(b.open, b.alt)}</div></figure>`;
    // a note under the photo (e.g. that it was made with AI) stays in the text column, not out at the bleed
    return b.note ? `<div class="bk">${f}<p class="op-n">${b.note}</p></div>` : f;
  }
  if (b.drift) return `<figure class="bk bleed dr" data-s="view" data-k="drift"><div style="aspect-ratio:${b.ratio}">${pic(b.drift, b.alt)}</div></figure>`;
  if (b.zoom) return `<figure class="bk zm" data-s="view" data-k="zoom"><div class="im" style="aspect-ratio:${b.ratio}">${pic(b.zoom, b.alt)}</div></figure>`;
  if (b.split) return `<div class="bk spl">${b.split.map((x) => `<div>${inner(x)}</div>`).join("")}</div>`;
  // the icons run sideways as the part goes by, and swell a little as they cross the middle
  if (b.notes && b.strip) return `<div class="bk sp">${notes(b.notes)}<div class="bleed sp-w" data-s="view" data-k="strip"><ul class="sp-r">${b.strip.map((f) => `<li>${pic(f)}</li>`).join("")}</ul></div></div>`;
  if (b.notes) return `<div class="bk">${sub(b.sub)}${notes(b.notes, b.one)}</div>`;
  if (b.stats) return `<ul class="bk st" data-in>${b.stats.map(([v, s]) => `<li><b data-n="${v}">${v}</b><span>${s}</span></li>`).join("")}</ul>`;
  if (b.values) return `<ul class="bk vl">${b.values.map(([w, s, x], i) => `<li style="--i:${i}"><b>${w}</b><em>${s}${x ? `<span>${x}</span>` : ""}</em></li>`).join("")}</ul>`;
  if (b.callouts) return `<div class="bk co${b.big ? " big" : ""}${b.mode ? " " + b.mode : ""}${b.lit ? " lit" : ""}${b.full ? " full" : ""}${b.tone ? " " + b.tone : ""}">${b.callouts.map((c) => `<div class="co-c co-s${c.side}${b.full ? " bleed" : ""}">${sub(c.sub)}
    <figure class="co-f" data-in${c.crop ? "" : ` style="aspect-ratio:${c.w} / ${c.h}"`}>${c.crop ? `<div class="co-i" style="aspect-ratio:${c.w} / ${c.h}"><img src="${img(c.img)}" alt="${c.alt}" loading="lazy" style="transform:scale(${c.crop[0]});transform-origin:${c.crop[1]}"></div>`
      : c.extend ? `<div class="co-i co-x" style="aspect-ratio:${c.w} / ${c.h};background:${c.extend}"><img src="${img(c.img)}" alt="${c.alt}" loading="lazy"></div>` : pic(c.img, c.alt)}
    ${c.notes.map(([h, t, x, y, sw, s, at], i) => `<div class="co-n${s ? " " + s : ""}" style="--x:${x}%;--y:${y}%;--i:${i}${at != null ? `;--s:${at}%` : ""}"><i class="co-l"></i><i class="co-d"></i><div class="co-t"><b>${h}</b>${t ? `<p>${t}</p>` : ""}${sw ? `<span class="chip"><i style="background:${sw[1]}"></i>${sw[0] === sw[1] || !sw[1].startsWith("#") ? sw[0] : `${sw[0]} ${sw[1]}`}</span>` : ""}</div></div>`).join("")}</figure></div>`).join("")}</div>`;
  if (b.duo) return `<div class="bk duo" data-s="view" data-k="duo">${b.duo.map((x, i) => `<div class="duo-${i}">${pics(x.imgs, x.alt)}<div class="duo-t">${inner({ sub: x.sub, text: x.text, pills: x.pills })}</div></div>`).join("")}</div>`;
  if (b.reader) {
    const r = b.reader;
    return `<div class="bk rd" data-s="pin" data-k="reader" data-end="${r.end || 1}" data-at="${r.notes.map((x, i) => x[2] ?? i / r.notes.length).join(",")}">
      <div class="rd-in"><div class="rd-f"><img src="${img(r.img)}" alt="${r.alt}" loading="lazy" style="aspect-ratio:${r.w} / ${r.h}"></div>
      <i class="rd-l"></i><ul class="rd-n">${r.notes.map(([h, t], i) => `<li${i ? "" : ' class="on"'}><b>${h}</b><p>${t}</p></li>`).join("")}</ul></div></div>`;
  }
  // the cuts arrive one by one from the left and end side by side
  if (b.row) return `<div class="bk rw" data-s="pin" data-k="row"><div class="rw-in">
    <div class="rw-t" data-at="${b.times.map(([s]) => s / RW_LEN).join(",")}"><i class="rw-f"></i><i class="rw-h"></i>${b.times.map(([s, l]) => `<span style="--t:${s / RW_LEN}">${l}</span>`).join("")}</div>
    ${b.row.map(([f, h, t, q], i) => `<figure style="--i:${i}"><div class="im" style="aspect-ratio:${b.ratio}">${pic(f, h)}</div>
    <figcaption><b>${h}<small>${b.times[i][1]}</small></b><q>${t}</q><p>${q}</p></figcaption></figure>`).join("")}</div></div>`;
  if (b.list) return `<ul class="bk ls">${b.list.map((x) => `<li>${x}</li>`).join("")}</ul>`;
  if (b.lane) return `<div class="bk bleed ln" data-s="view" data-k="lane" data-dir="${b.dir}"><ul>${b.lane.map((f) => `<li class="im" style="aspect-ratio:${b.ratio}">${pic(f, b.alt)}</li>`).join("")}</ul></div>`;
  if (b.cards) return `<div class="bk cd${b.six ? " six" : ""}">${b.cards.map(([f, h, k, t, r]) => `<figure><div class="im">${pic(f, h, r)}</div><figcaption><b>${h}</b>${k ? `<span>${k}</span>` : ""}${t ? `<p>${t}</p>` : ""}</figcaption></figure>`).join("")}</div>`;
  if (b.ab) return `<div class="bk ab" data-in>${b.ab.map(([f, v, out], i) => `<figure${out ? ' class="out"' : ""} style="--i:${i}"><div class="im">${pic(f)}</div>
    <div class="tape-s ab-t" style="--w:1">${ticks(5)}<span class="ab-m" style="--v:${(parseFloat(v.slice(1)) / b.max).toFixed(3)}"><b>${v}</b></span></div></figure>`).join("")}</div>`;
  // before stays small; after grows to full size as you scroll
  if (b.gain) return `<div class="bk gn">${b.gain.map(([a, z, l]) => `<div data-s="view" data-k="gain"><p class="gn-v"><span>${a} →</span><b>${z}</b></p><p class="gn-k">${l}</p></div>`).join("")}</div>`;
  if (b.chart) {
    const c = b.chart, max = Math.max(...c.bars.map((x) => x[1]));
    return `<div class="bk ch" data-in><div class="ch-p">
      ${c.gain ? `<div class="ch-g">${c.gain.map(([a, z, l]) => `<div class="ch-c" data-s="view" data-k="gain"><p class="gn-k">${l}</p><p class="gn-v"><span>${a} →</span><b>${z}</b></p></div>`).join("")}</div>` : ""}
      <p class="ch-y">${c.y}</p><p class="ch-x">${c.x}</p>
      <ol style="--n:${c.bars.length}">${c.bars.map(([m, v], i) => `<li${i >= c.from ? ' class="on"' : ""}${c.note && c.note[0] === i ? ' data-note="' + c.note[1] + '"' : ""} style="--h:${(v / max).toFixed(3)};--i:${i};--u:${(100 / max).toFixed(4)}">
      <div class="sl"><div class="bl"><b>${v.toLocaleString("en")}</b></div></div><span>${m}</span></li>`).join("")}</ol></div></div>`;
  }

  // a funnel read off the tape: three lengths that fill one after another, each a shade deeper
  if (b.path) return `<ol class="bk ph" data-in>${b.path.map(([h, t], i) => `<li style="--i:${i}"><div class="tape-s" style="--w:1">${ticks(4)}<i></i></div><b>${h}</b><p>${t}</p></li>`).join("")}</ol>`;
  // three steps, each with a line drawn down to what it is made of
  if (b.steps) return `<ol class="bk sx" data-in>${b.steps.map(([h, s, t], i) => `<li style="--i:${i}"><b>${h}</b><em>${s}</em><i></i><p>${t}</p></li>`).join("")}</ol>`;
  // three overlapping circles of one size: dashed, outlined, then solid
  if (b.venn) return `<ol class="bk vn" data-in>${b.venn.map(([h, t], i) => `<li style="--i:${i}"><b>${h}</b><p>${t}</p></li>`).join("")}</ol>`;
  // a font shown in itself: label, name, spec, and a line from the real work
  if (b.fonts) return `<div class="bk fo">${b.fonts.map(face).join("")}</div>`;
  // card news as in the PDF: words on the left, the picture unboxed, its font on the right
  if (b.cardnews) {
    const c = b.cardnews;
    return `<div class="bk cn"><div><b class="cn-h">${c.h}</b><p>${c.t}</p></div><figure>${pic(c.img, c.alt, c.ratio)}</figure>${face(c.font)}</div>`;
  }
  // the test loop on the tape: each stop lights up in turn, joined by a line that draws
  if (b.road) return `<ol class="bk rdm" data-in>${b.road.map(([h, t], i) => `<li style="--i:${i}"><i></i><b>${h}</b><p>${t}</p></li>`).join("")}</ol>`;
  // caption: the machine's output is the picture; each part of the caption is pointed at
  if (b.caption) {
    const c = b.caption;
    return `<div class="bk cap"><div class="cap-l"><p class="cap-lead">${c.lead}</p><div class="cap-g"><div class="im">${pic(c.gpts[0], "The caption GPTs", c.gpts[1])}</div><p>${c.note}</p></div></div>
      ${block({ callouts: [c.out] })}</div>`;
  }
  // a/b test, played: one step per stretch of scroll. The stops light up, then the ads answer
  if (b.abplay) {
    const a = b.abplay;
    return `<div class="bk abp" data-s="pin" data-k="abplay" data-step="0"><div class="abp-in">
      <ol class="rdm">${a.steps.map(([h, x], i) => `<li style="--i:${i}"><i></i><b>${h}</b><p>${x}</p></li>`).join("")}</ol>
      <div class="abp-s"><div class="ab">${a.ads.map(([f, n, v, out], i) => `<figure${out ? ' class="out"' : ""} style="--i:${i}"><div class="im">${pic(f, n)}</div>
        <div class="tape-s ab-t" style="--w:1">${ticks(5)}<span class="ab-m" style="--v:${(parseFloat(v.slice(1)) / a.max).toFixed(3)}"><b>${v}</b></span></div></figure>`).join("")}</div>
      <figure class="abp-n"><div class="im">${pic(a.add.img, a.add.alt)}</div><figcaption>${a.add.from.map(([k, s]) => `<span><b>${k}</b> from ${s}</span>`).join("")}</figcaption></figure></div>
    </div></div>`;
  }
  // a survey read off the tape: the top answer large, every answer a length. The keywords sit in a dark box
  if (b.survey) {
    const S = b.survey;
    return `<div class="bk sv" data-in>${S.qs.map(([q, a], k) => `<div class="sv-q" style="--i:${k}"><p class="sv-h">${q}</p>
      <p class="sv-t"><b>${a[0][1]}%</b><span>${a[0][0]}</span></p>
      <ul class="sv-l">${a.map(([l, v], i) => `<li style="--w:${v / 100};--j:${i}"><span>${l}</span><em>${v}%</em><i></i></li>`).join("")}</ul></div>`).join("")}
      ${(typeof S.words[0] === "string" ? [S.words] : S.words).map(([q, w], k) => `<div class="sv-q sv-k" style="--i:${S.qs.length + k}"><p class="sv-h">${q}</p>${pills(w)}</div>`).join("")}
      <p class="sv-n">${S.note}</p></div>`;
  }
  // before and after as the site's circle pair: the outline is what it was, the filled one slides in under it
  if (b.asis) return `<ol class="bk ap" data-in style="--n:${Math.min(b.asis.length, 3)}">${b.asis.map(([h, t, H, T], i) => `<li style="--i:${i}">
    <div class="ap-c ap-a"><small>As-is</small><b>${h}</b><p>${t}</p></div>
    <div class="ap-c ap-b"><small>To-be</small><b>${H}</b><p>${T}</p></div></li>`).join("")}</ol>`;
  // the logo on a pink band to both edges, white as in the work, its specs small beneath it as in the guide. The words about it sit on the page below
  if (b.logo) {
    const L = b.logo;
    return `<div class="bk lg" data-in>
      <div class="lg-f bleed"${L.bg ? ` style="background:${L.bg}"` : ""}>${L.before ? `<figure class="lg-b"><figcaption>Before</figcaption>${pic(L.before, L.alt[0])}</figure>` : ""}
        <div class="lg-m"${L.ratio ? ` style="aspect-ratio:${L.ratio};--c:${L.cols || 12}"` : ""}>${L.guide ? `<img class="lg-g" src="${img(L.guide)}" alt="">` : ""}<img class="lg-w" src="${img(L.mark)}" alt="${L.alt[1]}"></div>
        ${L.subs ? `<ul class="lg-v">${L.subs.map(([f, a], i) => `<li style="--i:${i}"><img src="${img(f)}" alt="${a}"></li>`).join("")}</ul>` : ""}
        ${L.spec ? `<ul class="lg-s">${L.spec.map(([k, v, a, z], i) => `<li style="--i:${i}"><div class="lg-sf">${pic(a, k)}${z ? `<img class="lg-z" src="${img(z)}" alt="">` : ""}</div><p><b>${k}</b>${v}</p></li>`).join("")}</ul>` : ""}</div>
      <div class="lg-n">${L.notes.map(([h, t], i) => `<div style="--i:${i}"><b>${h}</b><p>${md(t)}</p></div>`).join("")}</div></div>`;
  }
  // the slogan set big on the page, the poster beside it as a picture of its own
  if (b.say) {
    if (b.over) return `<figure class="bk bleed sov" data-in><img src="${img(b.img)}" alt="${b.alt}" loading="lazy" style="object-position:${b.pos}">
      <figcaption>${b.say.map((half, k) => `<p class="say">${half.map((l, i) => `<span style="--i:${k * half.length + i}"><i>${l}${b.sub && k === b.say.length - 1 && i === half.length - 1 ? ` <small>${b.sub}</small>` : ""}</i></span>`).join("")}</p>`).join("")}</figcaption></figure>`;
    if (b.apart) return `<div class="bk sl ap2" data-in>${b.say.map((half, k) => `<p class="say say-${k}">${half.map((l, i) => `<span style="--i:${k * half.length + i}"><i>${l}</i></span>`).join("")}</p>`).join("")}
      <figure class="sl-f" style="aspect-ratio:${b.ratio}"><img src="${img(b.img)}" alt="${b.alt}" loading="lazy" style="object-position:${b.pos}"></figure></div>`;
    const words = `<p class="say">${b.say.map((l, i) => `<span style="--i:${i}"><i>${l}</i></span>`).join("")}</p>`;
    return b.img ? `<div class="bk sl" data-in>${words}<figure class="sl-f"><img src="${img(b.img)}" alt="${b.alt}" loading="lazy" style="object-position:${b.pos}"></figure></div>`
      : `<div class="bk sl" data-in>${words}</div>`;
  }
  // typefaces as specimens on paper, next to the card they were set on
  if (b.typeon) {
    const T = b.typeon;
    return `<div class="bk tf" data-in><figure class="tf-f"><img src="${img(T.img)}" alt="${T.alt}" loading="lazy" style="object-position:${T.pos}"></figure>
      <ul class="tf-l">${T.faces.map(([k, n, f, im, d], i) => `<li style="--i:${i}"><span>${k}</span>${im ? `<img src="${img(im)}" alt="${n}">` : `<b class="${f}">${n}</b>`}<p>${d}</p></li>`).join("")}</ul></div>`;
  }
  // the service in line drawings on a dark face: the hardware, then the app in a phone
  if (b.svc) return `<div class="bk svc" data-in>${b.svc.map(([k, ims, t, phone], i) => `<div style="--i:${i}"><p class="sg">${k}</p>
    <div class="svc-i">${ims.map((f) => `<img src="${img(f)}" alt="">`).join("")}${phone ? `<span class="svc-p"><img src="${img(W + "line-phone.svg")}" alt=""><img src="${img(phone)}" alt="Woktok"></span>` : ""}</div><p>${t}</p></div>`).join("")}</div>`;
  // the process as four faces, each with all of its pictures
  if (b.proc) return `<div class="bk prc" data-in>${b.proc.map(([h, t, ims, n, r], i) => `<div class="prc-c" style="--i:${i}"><b>${h}</b><p>${t}</p>
    <ul style="--n:${n}">${ims.map((f) => `<li style="aspect-ratio:${r}">${pic(f, h)}</li>`).join("")}</ul></div>`).join("")}</div>`;
  // app screens held while scrolling: each note points out in turn, and a dashed line shows where a tap leads
  if (b.appf) {
    const A = b.appf, n = Math.max(...A.screens.flatMap(([, , ns, ls, ms]) => [...ns.map((x) => x[4]), ...(ls || []).map((x) => x[2]), ...(ms || []).map((x) => x[2])])) + 1;
    return `<div class="bk af" data-s="pin" data-k="steps" data-n="${n}" style="--n:${n};--lk:${A.link}"><div class="af-in">${A.screens.map(([f, name, ns, ls, ms]) => `<div class="af-g"><p class="af-h">${name}</p><div class="af-b">
      <div class="af-ph"><img src="${img(f)}" alt="${name}" loading="lazy">${(ms || []).map(([m, k, s]) => `<img class="af-sw" data-st="${s}" src="${img(m)}" alt="${k}" loading="lazy">`).join("")}</div>
      ${ms ? `<p class="af-mn">${ms.map(([, k, s]) => `<span data-st="${s}">${k}</span>`).join("")}</p>` : ""}
      ${ns.map(([h, t, x, y, s]) => `<div class="af-n" data-st="${s}" style="--x:${x}%;--y:${y}%"><i class="af-l"></i><i class="af-d"></i><div class="af-t"><b>${h}</b><p>${t}</p></div></div>`).join("")}
      ${(ls || []).map(([x, y, s]) => `<i class="af-k" data-st="${s}" style="--x:${x}%;--y:${y}%"></i>`).join("")}</div></div>`).join("")}</div></div>`;
  }
  // the logo held on its band while scrolling: each point of the drawing comes out in turn
  if (b.lgp) {
    const L = b.lgp, n = L.points.length, id = "lgp" + (lgpN++);
    let k = 0;
    const lines = L.points.map(([, , , ds], i) => ds.map((d) => { const m = `${id}-${k++}`;
      // T in a path is the top of the line: just under the text above the logo, set by fitLines() once laid out
      return `<mask id="${m}" maskUnits="userSpaceOnUse" x="-50" y="-400" width="200" height="600"><path class="lgp-k" data-ln="${i}" data-d="${d}" pathLength="1"/></mask><path data-d="${d}" mask="url(#${m})"/>`; }).join("")).join("");
    return `<div class="bk lgp" data-s="pin" data-k="steps" data-n="${n}" style="--n:${n}"><div class="lgp-in bleed"${L.bg ? ` style="background:${L.bg}"` : ""}>
      ${L.before ? `<figure class="lg-b lgp-b"><figcaption>Before</figcaption>${pic(L.before, L.alt[0])}</figure>` : ""}
      ${L.points.map(([h, t, side], i) => `<div class="lgp-t lgp-${side}" data-st="${i}"><b>${h}</b><p>${md(t)}</p></div>`).join("")}
      <div class="lgp-m" style="aspect-ratio:${L.ratio}">${L.guide ? `<img class="lgp-g" src="${img(L.guide)}" alt="">` : ""}<img src="${img(L.mark)}" alt="${L.alt[1]}">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>
        ${L.points.map(([, , , , rs], i) => rs.map(([x, y]) => `<i class="lgp-o" data-ro="${i}" data-w="${L.points[i][3].length ? 0.6 : 0}" style="--x:${x}%;--y:${y}%"></i>`).join("")).join("")}</div>
      <ul class="lg-s">${L.spec.map(([k, v, a, z], i) => `<li style="--i:${i}"><div class="lg-sf">${pic(a, k)}${z ? `<img class="lg-z" src="${img(z)}" alt="">` : ""}</div><p><b>${k}</b>${v}</p></li>`).join("")}</ul></div></div>`;
  }
  // a set of line icons, drawn across from left to right
  if (b.icons) return `<figure class="bk ics" data-in>${sub(b.sub)}<img src="${img(b.icons)}" alt="${b.alt}" style="aspect-ratio:${b.ratio}"></figure>`;
  // each color as a circle laid over a circle of the fruit it came from, the same size, just overlapping
  if (b.tokens) {
    const pair = ([n, h, f], i) => `<div class="cp-p" style="--i:${i}"><div class="cp-s"><div class="cp-i">${pic(f, n)}</div><i style="background:${h}"></i></div><b>${n}</b><span>${h}</span></div>`;
    return `<div class="bk cp" data-in><div class="cp-m">${pair(b.tokens.main, 0)}</div><div class="cp-r">${b.tokens.rest.map((x, i) => pair(x, i + 1)).join("")}</div></div>`;
  }
  return `<div class="bk">${inner(b)}</div>`;
}
const RW_LEN = 22; // seconds of reel the tape shows: the last cut starts at 20s
const face = ([k, n, s, x, f, im]) => `<div class="face f-${f}"><p class="face-k">${k}</p><b>${n}</b><span>${s}</span><p class="face-x">${x}</p>${im ? pic(im, n) : ""}</div>`;
let multi = false, lgpN = 0;
function flowOf(flow) {
  let out = "", band = "";
  multi = new Set(flow.map((s) => s.g)).size > 1;
  flow.forEach((s, i) => {
    if (s.dark) { band += (s.zone ? `<p class="dkz-h"><i></i>${s.zone}</p>` : "") + part(s, i); return; }
    if (band) { out += `<div class="dkz">${band}</div>`; band = ""; }
    out += part(s, i);
  });
  return out + (band ? `<div class="dkz">${band}</div>` : "");
}
const head = (s, i) => `<header class="pt-h"><p class="pt-n"><b>${String(i + 1).padStart(2, "0")}</b>${multi && s.g ? `<i></i>${s.g}` : ""}</p><h2 class="pt-t">${s.t}</h2>${s.i ? `<p class="pt-i">${md(s.i)}</p>` : ""}</header>`;
function part(s, i) {
  const held = s.blocks.some((b) => b.abplay);
  return `<section class="pt${s.dark ? " dk" : ""}${held ? " held" : ""}">${held ? "" : head(s, i)}
  <div class="pt-b">${s.blocks.map((b) => (b.abplay ? block(b).replace('<div class="abp-in">', `<div class="abp-in">${head(s, i)}`) : block(b))).join("")}</div></section>`;
}

// relative luminance of a hex colour, so text on it stays readable
function onColor(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => { const c = parseInt(hex.slice(i, i + 2), 16) / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5 ? "var(--ink)" : "#fff";
}
function renderArt(fade) {
  const p = PROJECTS[goal], n = PROJECTS[(goal + 1) % PROJECTS.length];
  const body = p.body ? p.body.map((t) => `<p>${t}</p>`).join("") : `<p>${flag("프로젝트 설명")}</p>`;
  art.style.setProperty("--pc", p.c);
  art.style.setProperty("--pc-on", onColor(p.c)); // text on the project colour: white on dark colours, ink on light ones
  if (p.ink) art.style.setProperty("--pc-ink", p.ink); else art.style.removeProperty("--pc-ink"); // a light colour's accent for words on paper
  art.innerHTML = `
    <div class="a-top"><div><header class="a-head"><h1 class="a-name">${p.name}</h1><p class="a-role serif">${p.role || flag("직무명")}</p></header>
    <p class="a-line">${lineOf(p)}</p></div>
    ${factsOf(p).replace('class="facts"', 'class="facts a-facts"')}</div>
    <figure class="a-hero"${p.hero ? ` style="height:auto;aspect-ratio:${p.hero}"` : ""}><img src="${img(p.shots[0][0])}" alt="${p.name} main work"></figure>
    ${p.flow ? flowOf(p.flow) : `
    <section class="a-body"><p class="k">Overview</p><div class="txt">${body}</div></section>
    ${p.nums ? `<ul class="a-nums">${p.nums.map(([b, s]) => `<li><b>${b}</b><span>${s}</span></li>`).join("")}</ul>` : ""}
    ${p.shots.map(([f, cap]) => `<figure class="a-shot"><div><img src="${img(f)}" alt="${p.name} ${cap}" loading="lazy"></div>${cap ? `<figcaption>${cap}</figcaption>` : ""}</figure>`).join("")}`}
    <button class="a-next press" type="button" data-next><small>Next</small>${n.name}</button>
`;
  if (fade && !reduce) art.querySelectorAll(".a-head, .a-line, .a-facts, .a-hero").forEach((el) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }));
  pieces();
  scenesInit();
}

/* the overview's pieces grow into the detail's, and shrink back on close. One move, no fade.
   Text scales by font size; the picture scales to cover the small frame, clipped to it */
const PAIRS = [[".name", ".a-name"], [".role", ".a-role"], [".desc", ".a-line"], [".facts", ".a-facts"], [".shot", ".a-hero"]];
const MORPH = { duration: 720, easing: "cubic-bezier(0.32, 0.72, 0, 1)" }; // same curve and time as the case
function morph(back) {
  const out = [];
  for (const [a, b] of PAIRS) {
    const s = over.querySelector(a), f = art.querySelector(b);
    if (!s || !f) continue;
    const S = s.getBoundingClientRect(), F = f.getBoundingClientRect();
    let from, to;
    if (b === ".a-hero") {
      const k = Math.max(S.width / F.width, S.height / F.height);
      const cx = (F.width - S.width / k) / 2, cy = (F.height - S.height / k) / 2;
      from = { transform: `translate(${S.left - F.left - cx * k}px, ${S.top - F.top - cy * k}px) scale(${k})`, clipPath: `inset(${cy}px ${cx}px round ${20 / k}px)` };
      to = { transform: "translate(0px, 0px) scale(1)", clipPath: "inset(0px 0px round 20px)" };
    } else {
      const k = parseFloat(getComputedStyle(s).fontSize) / parseFloat(getComputedStyle(f).fontSize);
      from = { transform: `translate(${S.left - F.left}px, ${S.top - F.top}px) scale(${k})` };
      to = { transform: "translate(0px, 0px) scale(1)" };
    }
    f.style.transformOrigin = "0 0";
    out.push(f.animate(back ? [to, from] : [from, to], { ...MORPH, fill: back ? "forwards" : "none" }));
  }
  return out;
}

/* below the picture the detail is built from pieces. Each slides in from its own side
   as it scrolls into view, overshoots a hair and clicks into its slot */
const SIDES = [[-56, 40, -1.5], [56, 40, 1.5], [0, 72, 0]];
const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => {
  let n = 0;
  es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, [x, y, r] = SIDES[(+el.dataset.pc || 0) % 3];
    io.unobserve(el);
    el.classList.remove("pc");
    const a = el.animate([{ opacity: 0, transform: `translate(${x}px, ${y}px) rotate(${r}deg)` }, { opacity: 1, transform: "none" }],
      { duration: 480, delay: n++ * 80, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", fill: "backwards" });
    a.finished.then(() => click(1800, 1)).catch(() => {});
  });
}, { root: detail, rootMargin: "0px 0px -10% 0px", threshold: 0.12 }) : null;
function pieces() {
  if (!io || reduce) return;
  io.disconnect();
  art.querySelectorAll(".a-body .k, .a-body .txt, .a-nums li, .a-shot, .pt-h, .pt-b > .bk:not([data-s]):not(.vl), .a-next").forEach((el, i) => {
    el.dataset.pc = i;
    el.classList.add("pc");
    io.observe(el);
  });
}

/* scenes: blocks that play along with the scroll. p runs 0 → 1 while the block passes the screen;
   for a pinned block, while it is held */
const wide = matchMedia("(min-width: 961px)");
const clamp = (v) => Math.max(0, Math.min(1, v));
let scenes = [], ticking = false;
const SCENE = {
  open(el, p) { const k = 1 - clamp(p * 2.4); el.firstElementChild.style.clipPath = `inset(${(k * 6).toFixed(2)}% ${(k * 9).toFixed(2)}% round 20px)`; },
  drift(el, p) { el.firstElementChild.style.transform = `translate3d(${((0.5 - p) * 14).toFixed(2)}%,0,0)`; },
  zoom(el, p) { el.querySelector("img").style.transform = `scale(${(1.08 - 0.08 * clamp(p * 2)).toFixed(4)})`; },
  duo(el, p) { const d = (p - 0.5) * 72; el.children[0].style.transform = `translate3d(0,${d.toFixed(1)}px,0)`; el.children[1].style.transform = `translate3d(0,${(-d).toFixed(1)}px,0)`; },
  lane(el, p) { el.firstElementChild.style.transform = `translate3d(${((p - 0.5) * 10 * el.dataset.dir).toFixed(2)}%,0,0)`; },
  flip(el, p) { const k = Math.min(3, Math.floor(clamp((p - 0.25) / 0.5) * 4)); [...el.children].forEach((im, i) => im.classList.toggle("on", i === k)); },
  // the long page runs up the frame; the part at the reading line is the one being read
  reader(el, p) {
    if (!wide.matches) return;
    const f = el.querySelector(".rd-f"), n = el.querySelectorAll(".rd-n li"), at = el.dataset.at.split(",").map(Number);
    const im = f.firstElementChild, H = im.offsetHeight, shift = p * Math.max(0, +el.dataset.end * H - f.clientHeight);
    im.style.transform = `translate3d(0,${(-shift).toFixed(1)}px,0)`;
    const read = (shift + f.clientHeight / 2) / H; // how far down the page the reading line is
    let k = 0;
    at.forEach((a, i) => { if (read >= a) k = i; });
    if (el._k === k) return;
    el._k = k;
    n.forEach((li, i) => li.classList.toggle("on", i === k));
    const l = el.querySelector(".rd-l");
    l.classList.remove("on"); l.offsetWidth; l.classList.add("on");
    click(1800, 1);
  },
  // the icons run sideways past the middle and swell a little as they cross it
  strip(el, p) {
    const r = el.firstElementChild, shift = p * Math.max(0, r.scrollWidth - el.clientWidth), c = el.clientWidth / 2;
    r.style.transform = `translate3d(${(-shift).toFixed(1)}px,0,0)`;
    [...r.children].forEach((li) => {
      const d = Math.abs(li.offsetLeft - shift + li.offsetWidth / 2 - c);
      li.firstElementChild.style.transform = `scale(${(1 + 0.14 * Math.pow(Math.max(0, 1 - d / 440), 2)).toFixed(4)})`;
    });
  },
  // held in place while the four cuts come in from the left, one per quarter of the hold
  row(el, p) {
    if (!wide.matches) return;
    const head = Math.min(1, p * 1.15); // the playhead runs a little ahead so the last cut lands before the hold ends
    el.style.setProperty("--p", head.toFixed(4));
    const n = el.querySelector(".rw-t").dataset.at.split(",").filter((a) => head >= +a).length;
    if (el._n === n) return;
    el._n = n;
    el.querySelectorAll("figure").forEach((f, i) => f.classList.toggle("on", i < n));
    click(1800, 1);
  },
  abplay(el, p) {
    if (!wide.matches) return;
    const k = String(Math.min(3, Math.floor(p * 4.4)));
    if (el.dataset.step === k) return;
    el.dataset.step = k;
    click(1800, 1);
  },
  // held in place; the marked parts come on one per stretch of scroll
  steps(el, p) {
    el._ln ??= [...el.querySelectorAll(".lgp-k")];
    el._ro ??= [...el.querySelectorAll(".lgp-o")];
    if (!wide.matches) { for (const x of el._ln) x.style.strokeDashoffset = ""; el._k = 0; return; }
    const n = +el.dataset.n, q = clamp(p * 1.15) * n, k = Math.min(n, Math.floor(q) + 1);
    // logo lines draw out with the scroll; each ring comes on once its line has reached it (a ring with no line, once its step starts)
    for (const x of el._ln) x.style.strokeDashoffset = 1 - clamp((q - x.dataset.ln) / 0.6);
    for (const x of el._ro) x.classList.toggle("on", q - x.dataset.ro > +x.dataset.w);
    if (el._k === k) return;
    el._k = k;
    el.querySelectorAll("[data-st]").forEach((x) => x.classList.toggle("on", +x.dataset.st < k));
    click(1800, 1);
  },
  // the after-number grows from the size of the before-number to full size
  gain(el, p) { el.querySelector("b").style.transform = `scale(${(0.36 + 0.64 * clamp((p - 0.15) / 0.4)).toFixed(4)})`; },
};
function tick() {
  ticking = false;
  const vh = detail.clientHeight, max = detail.scrollHeight - vh;
  prog.style.transform = `scaleY(${max > 0 ? clamp(detail.scrollTop / max).toFixed(4) : 0})`;
  tocTick(vh);
  if (reduce) return;
  for (const el of scenes) {
    const r = el.getBoundingClientRect();
    if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) continue;
    const p = el.dataset.s === "pin" && r.height > vh * 1.2 ? clamp(-r.top / (r.height - vh)) : clamp((vh - r.top) / (vh + r.height));
    SCENE[el.dataset.k](el, p);
  }
}
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } };
const prog = document.createElement("div");
prog.className = "prog";
detail.appendChild(prog);
/* the part index: one token per part on the left edge, like marks on the tape.
   The part you are in is filled and named; press a token to go to that part */
const toc = document.createElement("nav");
toc.className = "toc";
toc.setAttribute("aria-label", "Parts");
detail.appendChild(toc);
let tocParts = [], tocAt = -1, tocHide = 0;
function tocBuild() {
  tocParts = [...art.querySelectorAll(".pt")];
  toc.style.setProperty("--pc", art.style.getPropertyValue("--pc"));
  tocAt = -1;
  toc.innerHTML = tocParts.length ? `<ol>${tocParts.map((s, i) => {
    const n = s.querySelector(".pt-n"), g = n ? n.textContent.replace(/^\d+/, "").trim() : "";
    const name = s.querySelector(".pt-t").textContent;
    return `<li><button class="press" type="button" data-i="${i}" aria-label="${name}"><span>${g ? `<em>${g}</em>` : ""}${name}</span></button></li>`;
  }).join("")}</ol>` : "";
}
toc.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const s = tocParts[+b.dataset.i];
  detail.scrollTo({ top: detail.scrollTop + s.getBoundingClientRect().top - 48, behavior: reduce ? "auto" : "smooth" });
});
function tocTick(vh) {
  if (!tocParts.length) return;
  let k = -1;
  tocParts.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * 0.45) k = i; });
  toc.classList.toggle("is-on", k >= 0);
  toc.classList.toggle("is-dark", k >= 0 && !!tocParts[k].closest(".dkz"));
  if (k === tocAt) return;
  tocAt = k;
  toc.querySelectorAll("li").forEach((li, i) => li.classList.toggle("on", i === k));
  // the name shows when the part changes, then steps back so it never sits on the content
  toc.classList.add("is-named");
  clearTimeout(tocHide);
  tocHide = setTimeout(() => toc.classList.remove("is-named"), 1600);
}

/* one-off: lines draw, tapes pull out and numbers count up the first time they come into view */
function count(el) {
  el.querySelectorAll("b[data-n]").forEach((b) => {
    const s = b.dataset.n, m = s.match(/\d[\d,]*(\.\d+)?/);
    if (!m || s.includes("→")) return;
    const to = parseFloat(m[0].replace(/,/g, "")), dp = m[1] ? m[1].length - 1 : 0, t0 = performance.now();
    const fmt = (v) => (m[0].includes(",") ? Math.round(v).toLocaleString("en") : v.toFixed(dp));
    const f = (t) => { const k = Math.min(1, (t - t0) / 720); b.textContent = s.replace(m[0], fmt(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });
}
const seen = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  seen.unobserve(e.target);
  e.target.classList.add("in");
  count(e.target);
}), { root: detail, rootMargin: "0px 0px -15% 0px", threshold: 0.3 }) : null;
// a logo line starts just under the lowest text above the logo, whatever the width
function fitLines() {
  art.querySelectorAll(".lgp-m").forEach((m) => {
    const r = m.getBoundingClientRect();
    if (!r.height) return;
    const above = [...m.parentNode.querySelectorAll(".lgp-t, .lgp-b")].map((x) => x.getBoundingClientRect().bottom).filter((b) => b <= r.top);
    const top = (((above.length ? Math.max(...above) : r.top - 48) + 16 - r.top) / r.height * 100).toFixed(2);
    m.querySelectorAll("path[data-d]").forEach((x) => x.setAttribute("d", x.dataset.d.replaceAll("T", top)));
  });
}
function scenesInit() {
  scenes = [...art.querySelectorAll("[data-s]")];
  tocBuild();
  if (seen) seen.disconnect();
  art.querySelectorAll("[data-in]").forEach((el) => { if (reduce || !seen) el.classList.add("in"); else seen.observe(el); });
  if (reduce || !wide.matches) art.querySelectorAll(".abp").forEach((el) => { el.dataset.step = "3"; });
  fitLines();
  document.fonts.ready.then(fitLines);
  onScroll();
}

/* ---------- open / close the detail ---------- */
let topAt = 0, winding = false, lastTop = 0;
let seq = 0;
function open() {
  if (active < 0 || mode === "detail") return;
  seq++;
  goal = active;
  mode = "detail";
  renderArt(false);
  detail.scrollTop = 0;
  rail.style.transform = "";
  topAt = performance.now();
  app.classList.remove("is-leaving");
  app.classList.add("is-detail");
  if (!reduce) morph(false);
  animateTo(stop(goal), PULL);
}
function close() {
  if (mode !== "detail") return;
  const id = ++seq;
  mode = "over";
  winding = false;
  mini.classList.remove("is-winding");
  rail.style.transform = "";
  // the detail stays up while its pieces shrink back into the overview, then they swap
  app.classList.add("is-leaving");
  app.classList.remove("is-detail");
  animateTo(stop(goal), PULL);
  const swap = () => {
    if (id !== seq) return;
    over.style.transition = "none";
    app.classList.remove("is-leaving");
    art.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    over.offsetWidth;
    over.style.transition = "";
  };
  if (reduce) { swap(); return; }
  [...art.children].forEach((el) => { if (!el.matches(".a-top, .a-hero")) el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" }); });
  Promise.all(morph(true).map((a) => a.finished)).then(swap, swap);
}
/* back to top: wind the page up (ticking like the tape), then the case comes back */
function rewindTop() {
  if (detail.scrollTop < 4) { close(); return; }
  winding = true;
  mini.classList.add("is-winding");
  detail.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}
detail.addEventListener("scroll", () => {
  const y = detail.scrollTop;
  rail.style.transform = `translate3d(0,${-y}px,0)`;
  onScroll();
  if (winding && Math.floor(y / 48) !== Math.floor(lastTop / 48)) click(3000, -1);
  if (y <= 0 && lastTop > 0) topAt = performance.now();
  lastTop = y;
  if (winding && y < 2) close();
}, { passive: true });

over.addEventListener("click", (e) => { if (e.target.closest("[data-open]")) { e.preventDefault(); if (!moved) open(); } });
art.addEventListener("click", (e) => { if (e.target.closest("[data-next]")) go((goal + 1) % PROJECTS.length, PULL); });
mini.addEventListener("click", rewindTop);
if (cue) cue.addEventListener("click", open);
hub.addEventListener("click", () => { if (active >= 0) go(-1, PULL); });
pull.addEventListener("click", () => { if (!moved) go(0); });

/* ---------- drag ---------- */
function resist(raw) {
  const lo = stop(-1), hi = stop(D.length - 1);
  if (raw < lo) return lo - (lo - raw) * 0.3;
  if (raw > hi) return hi + (raw - hi) * 0.3;
  return raw;
}
let drag = null, moved = false;
app.addEventListener("pointerdown", (e) => {
  if (mode === "detail" || e.button !== 0 || e.target.closest("#hub, #snd, #mini, #cue, .about a")) return;
  drag = { id: e.pointerId, x: e.clientX, raw: X, t: performance.now(), vel: 0 };
  moved = false;
});
app.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const d = e.clientX - drag.x;
  if (!moved && Math.abs(d) < 5) return;
  if (!moved) { moved = true; app.setPointerCapture(drag.id); app.classList.add("is-drag"); halt(); }
  const now = performance.now();
  drag.vel = 0.8 * (d / Math.max(1, now - drag.t)) * 1000 + 0.2 * drag.vel;
  drag.raw += d; drag.x = e.clientX; drag.t = now;
  v = drag.vel;
  X = resist(drag.raw); target = X;
  draw();
});
function release() {
  if (!drag) return;
  const was = moved;
  drag = null;
  app.classList.remove("is-drag");
  if (!was) return;
  const i = nearest(X + v * 0.15); // where a flick would carry it
  goal = i;
  animateTo(stop(i), SNAP);
  setTimeout(() => { moved = false; }, 0);
}
app.addEventListener("pointerup", release);
app.addEventListener("pointercancel", release);

/* ---------- wheel: sideways moves the tape, down opens, up steps back ---------- */
let lock = 0, settle = 0;
addEventListener("wheel", (e) => {
  if (mode === "detail") {
    if (detail.scrollTop <= 0 && e.deltaY < -4 && performance.now() - topAt > 350) close();
    return;
  }
  e.preventDefault();
  const now = performance.now();
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    halt();
    v = e.deltaX * 60;
    X = resist(X + e.deltaX); target = X;
    draw();
    clearTimeout(settle);
    settle = setTimeout(() => { goal = nearest(X); animateTo(stop(goal), SNAP); }, 140);
    return;
  }
  if (now < lock || Math.abs(e.deltaY) < 4) return;
  lock = now + 650;
  if (e.deltaY > 0) { if (active < 0) go(0); else open(); }
  else if (active >= 0) go(active - 1);
}, { passive: false });

/* ---------- keys ---------- */
addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") { e.preventDefault(); go((mode === "detail" ? goal : active) + 1); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); go((mode === "detail" ? goal : active) - 1); }
  else if (mode !== "detail" && (e.key === "ArrowDown" || e.key === "Enter") && !e.target.closest("button, a")) { e.preventDefault(); open(); }
  else if (mode === "detail" && e.key === "Escape") rewindTop();
});

addEventListener("resize", () => { fitLines(); onScroll(); geo(); halt(); X = target = stop(goal); v = 0; draw(); });

/* start: tape wound in, hook on the reading point, About showing */
geo();
X = target = stop(-1);
lastK = Math.floor(X / 32);
draw();
