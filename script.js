/* =========================================================
   SCRIPT.JS (FULL)
   NO IS NEVER HIDDEN.
   It starts next to YES, then runs when you get close.
   ========================================================= */

const noBtn = document.getElementById("noBtn");
const noSlot = document.getElementById("noSlot");
const yesBtn = document.getElementById("yesBtn");

const message = document.getElementById("message");
const tease = document.getElementById("tease");
const confetti = document.getElementById("confetti");
const floaters = document.getElementById("floaters");
const headline = document.getElementById("headline");

const HER_NAME = "Shayira";
const PLAN = "Picanha Steakhouse";

/* ---------------- Typewriter ---------------- */
function typewriter(text, speed = 42) {
  headline.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    headline.textContent += text[i];
    i += 1;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}
typewriter(`${HER_NAME}, will you be my Valentine?`);

/* ---------------- Floaters ---------------- */
function seedFloaters() {
  const icons = ["💗", "💘", "💖", "💕", "🐱", "🎨", "🖌️", "✨"];
  for (let i = 0; i < 22; i++) {
    const s = document.createElement("span");
    s.className = "floater";
    s.textContent = icons[Math.floor(Math.random() * icons.length)];
    s.style.left = Math.random() * 100 + "vw";
    s.style.bottom = -10 - Math.random() * 30 + "vh";
    s.style.animationDuration = 7 + Math.random() * 7 + "s";
    s.style.animationDelay = Math.random() * 6 + "s";
    s.style.fontSize = 16 + Math.random() * 18 + "px";
    floaters.appendChild(s);
  }
}
seedFloaters();

/* ---------------- Confetti ---------------- */
function confettiBurst() {
  confetti.innerHTML = "";
  const colors = ["#ec407a", "#ff77a8", "#ffd1e1", "#ffffff", "#c2185b", "#ffe0eb"];
  const count = 140;

  for (let i = 0; i < count; i++) {
    const c = document.createElement("span");
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = 1.8 + Math.random() * 2.4 + "s";
    c.style.animationDelay = Math.random() * 0.25 + "s";
    c.style.width = 8 + Math.random() * 8 + "px";
    c.style.height = 10 + Math.random() * 12 + "px";
    confetti.appendChild(c);
  }

  setTimeout(() => (confetti.innerHTML = ""), 4200);
}

/* ---------------- Paint splats ---------------- */
function splatBurst() {
  const rect = yesBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const colors = ["#ec407a", "#ff77a8", "#7c4dff", "#26c6da", "#ffd54f", "#66bb6a"];
  const splats = 22;

  for (let i = 0; i < splats; i++) {
    const d = document.createElement("div");
    d.className = "splat";
    d.style.left = cx + "px";
    d.style.top = cy + "px";
    d.style.position = "fixed";
    d.style.background = colors[Math.floor(Math.random() * colors.length)];

    const angle = Math.random() * Math.PI * 2;
    const radius = 18 + Math.random() * 60;

    d.style.setProperty("--dx", `${Math.cos(angle) * radius}px`);
    d.style.setProperty("--dy", `${Math.sin(angle) * radius}px`);

    document.body.appendChild(d);
    setTimeout(() => d.remove(), 800);
  }
}

/* =========================================================
   NO BUTTON
   ========================================================= */

let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let dodges = 0;
let armed = false;
let rafLock = false;

const PADDING = 16;
const ARM_DISTANCE = 140;      // activates when cursor gets this close
const SAFE_FROM_CURSOR = 260;  // once activated, runs if cursor comes within this radius
const MIN_CURSOR_GAP = 340;    // new spot must be far from cursor
const MIN_YES_GAP = 240;       // new spot must be far from YES
const ATTEMPTS = 180;

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function rectCenter(r) {
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function snapNoToSlot() {
  const slotRect = noSlot.getBoundingClientRect();
  noBtn.style.left = `${slotRect.left}px`;
  noBtn.style.top = `${slotRect.top}px`;
}

function pickSpot() {
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const yesC = rectCenter(yesRect);

  const maxX = window.innerWidth - noRect.width - PADDING;
  const maxY = window.innerHeight - noRect.height - PADDING;

  let best = null;
  let bestScore = -Infinity;

  for (let i = 0; i < ATTEMPTS; i++) {
    const x = PADDING + Math.random() * (maxX - PADDING);
    const y = PADDING + Math.random() * (maxY - PADDING);

    const cx = x + noRect.width / 2;
    const cy = y + noRect.height / 2;

    const dMouse = dist(cx, cy, lastMouse.x, lastMouse.y);
    const dYes = dist(cx, cy, yesC.x, yesC.y);

    const safe = dMouse >= MIN_CURSOR_GAP && dYes >= MIN_YES_GAP;
    const score = dMouse + dYes;

    if (safe && score > bestScore) {
      best = { x, y };
      bestScore = score;
    }
    if (!best && score > bestScore) {
      best = { x, y };
      bestScore = score;
    }
  }

  if (!best) return null;

  best.x = clamp(best.x, PADDING, maxX);
  best.y = clamp(best.y, PADDING, maxY);

  return best;
}

function setNoPosition(x, y) {
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function runAway() {
  dodges += 1;

  const spot = pickSpot();
  if (spot) setNoPosition(spot.x, spot.y);

  if (dodges === 2) tease.textContent = "Hehe… nope 🙈";
  if (dodges === 5) tease.textContent = `Okay okay ${HER_NAME}… dinner at ${PLAN} is waiting 😌🥩`;
  if (dodges >= 8) tease.textContent = "No is not an option today 💖";
}

function runAwaySoon() {
  if (rafLock) return;
  rafLock = true;
  requestAnimationFrame(() => {
    rafLock = false;
    runAway();
  });
}

function armIfClose() {
  if (armed) return;

  const r = noBtn.getBoundingClientRect();
  const c = rectCenter(r);
  const d = dist(c.x, c.y, lastMouse.x, lastMouse.y);

  if (d <= ARM_DISTANCE) {
    armed = true;
    runAwaySoon();
  }
}

/* Make sure CSS can move it even if style.css didn't load */
function forceMovableStyles() {
  noBtn.style.position = "fixed";
  noBtn.style.zIndex = "9999";
}

document.addEventListener("mousemove", (e) => {
  lastMouse = { x: e.clientX, y: e.clientY };

  armIfClose();
  if (!armed) return;

  const r = noBtn.getBoundingClientRect();
  const c = rectCenter(r);

  if (dist(c.x, c.y, lastMouse.x, lastMouse.y) < SAFE_FROM_CURSOR) {
    runAwaySoon();
  }
});

/* if they get on it at all, it runs */
noBtn.addEventListener("mouseenter", (e) => {
  e.preventDefault();
  armed = true;
  runAwaySoon();
});
noBtn.addEventListener("mousedown", (e) => {
  e.preventDefault();
  armed = true;
  runAwaySoon();
});
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  armed = true;
  runAwaySoon();
});
noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    armed = true;
    runAwaySoon();
  },
  { passive: false }
);

/* IMPORTANT: run after layout is ready */
window.addEventListener("load", () => {
  forceMovableStyles();
  snapNoToSlot();
});

/* if you use a cache, DOMContentLoaded helps too */
document.addEventListener("DOMContentLoaded", () => {
  forceMovableStyles();
  snapNoToSlot();
});

window.addEventListener("resize", () => {
  setTimeout(() => {
    forceMovableStyles();
    if (!armed) snapNoToSlot();
    else runAwaySoon();
  }, 80);
});

/* ---------------- YES click ---------------- */
yesBtn.addEventListener("click", () => {
  message.classList.remove("hidden");
  yesBtn.disabled = true;
  noBtn.disabled = true;

  tease.textContent = `Reservation vibes for ${PLAN} ✨`;
  splatBurst();
  confettiBurst();
});
