// ===== Grab elements =====
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const message = document.getElementById("message");
const tease = document.getElementById("tease");
const confetti = document.getElementById("confetti");
const floaters = document.getElementById("floaters");
const headline = document.getElementById("headline");

// ===== Customize text =====
const HER_NAME = "Shayira";
const PLAN = "Picanha Steakhouse";

// ===== State =====
let dodges = 0;
let noReady = false;

// ===== Typewriter headline =====
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

// ===== Floating emoji background =====
function seedFloaters() {
  const icons = ["💗", "💘", "💖", "💕", "🐱", "🎨", "🖌️", "✨"];
  for (let i = 0; i < 22; i += 1) {
    const s = document.createElement("span");
    s.className = "floater";
    s.textContent = icons[Math.floor(Math.random() * icons.length)];
    s.style.left = `${Math.random() * 100}vw`;
    s.style.bottom = `${-10 - Math.random() * 30}vh`;
    s.style.animationDuration = `${7 + Math.random() * 7}s`;
    s.style.animationDelay = `${Math.random() * 6}s`;
    s.style.fontSize = `${16 + Math.random() * 18}px`;
    floaters.appendChild(s);
  }
}

seedFloaters();

// ===== Confetti burst =====
function confettiBurst() {
  confetti.innerHTML = "";
  const colors = ["#ec407a", "#ff77a8", "#ffd1e1", "#ffffff", "#c2185b", "#ffe0eb"];
  const count = 140;

  for (let i = 0; i < count; i += 1) {
    const c = document.createElement("span");
    c.style.left = `${Math.random() * 100}vw`;
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = `${1.8 + Math.random() * 2.4}s`;
    c.style.animationDelay = `${Math.random() * 0.25}s`;
    c.style.width = `${8 + Math.random() * 8}px`;
    c.style.height = `${10 + Math.random() * 12}px`;
    confetti.appendChild(c);
  }

  setTimeout(() => {
    confetti.innerHTML = "";
  }, 4200);
}

// ===== Paint splat burst around YES =====
function splatBurst() {
  const rect = yesBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const colors = ["#ec407a", "#ff77a8", "#7c4dff", "#26c6da", "#ffd54f", "#66bb6a"];
  const splats = 22;

  for (let i = 0; i < splats; i += 1) {
    const d = document.createElement("div");
    d.className = "splat";
    d.style.left = `${centerX}px`;
    d.style.top = `${centerY}px`;
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

// ===== NO button: ultra dodge =====
const padding = 18;            // keep away from edges
const dodgeRadius = 280;       // keep far from cursor
const yesAvoidRadius = 220;    // also keep away from YES
const triesPerDodge = 80;      // try many times for a safe spot
let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function centerOf(rect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function randomSpot(rect) {
  const maxX = window.innerWidth - rect.width - padding;
  const maxY = window.innerHeight - rect.height - padding;

  const x = Math.random() * (maxX - padding) + padding;
  const y = Math.random() * (maxY - padding) + padding;
  return { x, y };
}

function isSpotSafe(spot, noRect, mouse, yesCenter) {
  const noCenterX = spot.x + noRect.width / 2;
  const noCenterY = spot.y + noRect.height / 2;

  // far from cursor
  const farFromMouse = dist(noCenterX, noCenterY, mouse.x, mouse.y) > dodgeRadius;

  // far from YES
  const farFromYes = dist(noCenterX, noCenterY, yesCenter.x, yesCenter.y) > yesAvoidRadius;

  return farFromMouse && farFromYes;
}

function placeNoAt(x, y) {
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function placeNoNearYes() {
  const yesRect = yesBtn.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  let x = yesRect.right + 22;
  let y = yesRect.top;

  x = clamp(x, padding, window.innerWidth - noRect.width - padding);
  y = clamp(y, padding, window.innerHeight - noRect.height - padding);

  placeNoAt(x, y);
}

function superDodge() {
  dodges += 1;

  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const yesC = centerOf(yesRect);

  // best candidate search
  let best = null;
  let bestScore = -Infinity;

  for (let i = 0; i < triesPerDodge; i += 1) {
    const spot = randomSpot(noRect);

    const noCX = spot.x + noRect.width / 2;
    const noCY = spot.y + noRect.height / 2;

    // score by distance from mouse and YES
    const dMouse = dist(noCX, noCY, lastMouse.x, lastMouse.y);
    const dYes = dist(noCX, noCY, yesC.x, yesC.y);
    const score = dMouse + dYes;

    if (isSpotSafe(spot, noRect, lastMouse, yesC)) {
      // first safe is great, but keep looking for even better
      if (score > bestScore) {
        best = spot;
        bestScore = score;
      }
    } else {
      // still keep a fallback “best effort”
      if (!best && score > bestScore) {
        best = spot;
        bestScore = score;
      }
    }
  }

  if (best) placeNoAt(best.x, best.y);

  if (dodges === 3) {
    tease.textContent = "Hehe… it’s shy 🙈 try the other one";
  } else if (dodges === 6) {
    tease.textContent = `Okay okay ${HER_NAME}… dinner at ${PLAN} is waiting 😌🥩`;
  } else if (dodges >= 9) {
    tease.textContent = "No is not an option today 💖";
  }
}

// Track mouse continuously so dodges always use current cursor location
document.addEventListener("mousemove", (e) => {
  lastMouse = { x: e.clientX, y: e.clientY };
  if (!noReady) return;

  // if cursor gets within radius of NO, dodge immediately
  const rect = noBtn.getBoundingClientRect();
  const c = centerOf(rect);
  if (dist(c.x, c.y, lastMouse.x, lastMouse.y) < dodgeRadius) {
    superDodge();
  }
});

// Start NO beside YES, then enable dodging
window.addEventListener("load", () => {
  placeNoNearYes();
  noReady = true;

  // first dodge to get it away from wherever the cursor is on load
  superDodge();
});

// Keep NO on-screen if the window changes
window.addEventListener("resize", () => {
  if (!noReady) return;
  superDodge();
});

// Extra protection against interaction attempts
noBtn.addEventListener("mouseenter", (e) => {
  e.preventDefault();
  superDodge();
});
noBtn.addEventListener("mousedown", (e) => {
  e.preventDefault();
  superDodge();
});
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  superDodge();
});
noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    superDodge();
  },
  { passive: false }
);

// ===== YES click =====
yesBtn.addEventListener("click", () => {
  message.classList.remove("hidden");
  yesBtn.disabled = true;
  noBtn.disabled = true;

  tease.textContent = `Reservation vibes for ${PLAN} ✨`;
  splatBurst();
  confettiBurst();
});
