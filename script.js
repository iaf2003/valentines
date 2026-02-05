console.log("script.js loaded ✅");

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

if (!noBtn || !noSlot || !yesBtn) {
  console.error("Missing #noBtn, #noSlot, or #yesBtn. Check your index.html IDs.");
}

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
    s.style.bottom = (-10 - Math.random() * 30) + "vh";
    s.style.animationDuration = (7 + Math.random() * 7) + "s";
    s.style.animationDelay = Math.random() * 6 + "s";
    s.style.fontSize = (16 + Math.random() * 18) + "px";
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
    c.style.animationDuration = (1.8 + Math.random() * 2.4) + "s";
    c.style.animationDelay = Math.random() * 0.25 + "s";
    c.style.width = (8 + Math.random() * 8) + "px";
    c.style.height = (10 + Math.random() * 12) + "px";
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
   NO BUTTON RUNNER
   ========================================================= */

let dodges = 0;
let lastPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

const PADDING = 16;
const TRIGGER_RADIUS = 230;     // when cursor gets this close, it runs
const MIN_CURSOR_GAP = 360;     // new spot must be at least this far from cursor
const MIN_YES_GAP = 240;        // new spot must be this far from YES button
const ATTEMPTS = 220;           // higher = smarter placements

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function rectCenter(r) {
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function snapNoToSlot() {
  const slot = noSlot.getBoundingClientRect();
  noBtn.style.left = `${slot.left}px`;
  noBtn.style.top = `${slot.top}px`;
}

function pickBestSpot() {
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

    const dMouse = dist(cx, cy, lastPointer.x, lastPointer.y);
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

  return best;
}

function runAway() {
  dodges += 1;

  const spot = pickBestSpot();
  if (spot) {
    noBtn.style.left = `${spot.x}px`;
    noBtn.style.top = `${spot.y}px`;
  }

  if (dodges === 3) tease.textContent = "Hehe… it’s shy 🙈 try the other one";
  if (dodges === 6) tease.textContent = `Okay okay ${HER_NAME}… dinner at ${PLAN} is waiting 😌🥩`;
  if (dodges >= 9) tease.textContent = "No is not an option today 💖";
}

/* Track pointer (mouse + trackpad) */
window.addEventListener("pointermove", (e) => {
  lastPointer = { x: e.clientX, y: e.clientY };
});

/* Always check proximity (this is the key improvement) */
function tick() {
  const r = noBtn.getBoundingClientRect();
  const c = rectCenter(r);

  if (dist(c.x, c.y, lastPointer.x, lastPointer.y) < TRIGGER_RADIUS) {
    runAway();

    // extra safety: if it still landed close, run again immediately
    const r2 = noBtn.getBoundingClientRect();
    const c2 = rectCenter(r2);
    if (dist(c2.x, c2.y, lastPointer.x, lastPointer.y) < TRIGGER_RADIUS) {
      runAway();
    }
  }

  requestAnimationFrame(tick);
}

noBtn.addEventListener("pointerenter", (e) => { e.preventDefault(); runAway(); });
noBtn.addEventListener("pointerdown", (e) => { e.preventDefault(); runAway(); });
noBtn.addEventListener("click", (e) => { e.preventDefault(); runAway(); });

window.addEventListener("load", () => {
  snapNoToSlot();

  // start the runner loop
  requestAnimationFrame(tick);

  // if your pointer is already near the buttons, flee once right away
  setTimeout(runAway, 120);
});

window.addEventListener("resize", () => {
  setTimeout(runAway, 80);
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
