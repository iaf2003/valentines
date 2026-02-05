/* =========================================================
   script.js (FULL FILE)
   - Typewriter headline
   - Floaters + confetti + paint splats
   - YES shows message + effects
   - NO sits next to YES, but jumps away when your cursor gets close
   - Slideshow with dots + autoplay (make sure image paths match /images/)
   ========================================================= */

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const noSlot = document.getElementById("noSlot");

function snapNoToSlot(){
  const slot = noSlot.getBoundingClientRect();
  const row = document.querySelector(".buttons").getBoundingClientRect();
  noBtn.style.left = `${slot.left - row.left}px`;
  noBtn.style.top  = `${slot.top - row.top}px`;
  noBtn.style.transform = "none";
}

window.addEventListener("load", () => {
  snapNoToSlot();   // start perfectly aligned next to YES
});


const message = document.getElementById("message");
const tease = document.getElementById("tease");
const confetti = document.getElementById("confetti");
const floaters = document.getElementById("floaters");
const headline = document.getElementById("headline");

/* ---------------- Customize text ---------------- */
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
   NO BUTTON (CENTERED START, THEN ALWAYS MOVES AFTER FIRST DODGE)
   ========================================================= */

let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

const ARM_DISTANCE_FIRST = 90;
const ARM_DISTANCE_AFTER = 140;
const ATTEMPTS = 90;

let hasDodged = false;

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function rectCenter(r) {
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function pickSpotInsideButtons() {
  const buttons = document.querySelector(".buttons");
  const area = buttons.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const yesC = rectCenter(yesRect);

  const PAD = 8;

  const minX = PAD;
  const maxX = area.width - noRect.width - PAD;
  const minY = PAD;
  const maxY = area.height - noRect.height - PAD;

  let best = { x: maxX, y: (area.height - noRect.height) / 2 };
  let bestScore = -Infinity;

  for (let i = 0; i < ATTEMPTS; i++) {
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);

    const cx = area.left + x + noRect.width / 2;
    const cy = area.top + y + noRect.height / 2;

    const dMouse = dist(cx, cy, lastMouse.x, lastMouse.y);
    const dYes = dist(cx, cy, yesC.x, yesC.y);

    const score = dMouse + dYes * 0.6;

    if (score > bestScore) {
      bestScore = score;
      best = { x, y };
    }
  }

  best.x = clamp(best.x, minX, maxX);
  best.y = clamp(best.y, minY, maxY);
  return best;
}

function moveNo() {
  const spot = pickSpotInsideButtons();
  noBtn.style.left = `${spot.x}px`;
  noBtn.style.top = `${spot.y}px`;
  noBtn.style.transform = "none";
  hasDodged = true;
}

document.addEventListener("mousemove", (e) => {
  lastMouse = { x: e.clientX, y: e.clientY };

  const r = noBtn.getBoundingClientRect();
  const c = rectCenter(r);

  const armDistance = hasDodged ? ARM_DISTANCE_AFTER : ARM_DISTANCE_FIRST;

  if (dist(c.x, c.y, lastMouse.x, lastMouse.y) <= armDistance) {
    moveNo();
  }
});

noBtn.addEventListener("mouseenter", (e) => {
  e.preventDefault();
  moveNo();
});

noBtn.addEventListener("mousedown", (e) => {
  e.preventDefault();
  moveNo();
});

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNo();
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

/* =========================================================
   SLIDESHOW (FULL)
   IMPORTANT: keep paths consistent with your HTML:
   <img src="images/IMG_1057.jpeg" />
   So the JS should also use "images/..."
   ========================================================= */

const slideImg = document.getElementById("slideImg");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const slideDots = document.getElementById("slideDots");

const slides = [
  "images/IMG_1057.jpeg",
  "images/IMG_1260.jpeg",
  "images/IMG_4157.jpeg",
  "images/IMG_2240.jpeg",
  "images/IMG_3608.jpeg",
  "images/IMG_0449.jpeg",
];

let current = 0;
let slideTimer = null;

function renderDots() {
  slideDots.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.index = i;
    if (i === current) b.classList.add("active");
    b.addEventListener("click", () => {
      goTo(i);
      resetTimer();
    });
    slideDots.appendChild(b);
  });
}

function goTo(i) {
  current = (i + slides.length) % slides.length;
  slideImg.src = slides[current];
  const dots = slideDots.querySelectorAll("button");
  dots.forEach((d) => d.classList.remove("active"));
  if (dots[current]) dots[current].classList.add("active");
}

function next() {
  goTo(current + 1);
}

function prev() {
  goTo(current - 1);
}

function resetTimer() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(next, 4200);
}

prevSlide.addEventListener("click", () => {
  prev();
  resetTimer();
});

nextSlide.addEventListener("click", () => {
  next();
  resetTimer();
});

document.querySelector(".slideshow").addEventListener("mouseenter", () => {
  if (slideTimer) clearInterval(slideTimer);
});

document.querySelector(".slideshow").addEventListener("mouseleave", () => {
  resetTimer();
});

// init slideshow
renderDots();
goTo(0);
resetTimer();
