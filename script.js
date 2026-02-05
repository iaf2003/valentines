const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const message = document.getElementById("message");
const tease = document.getElementById("tease");
const headline = document.getElementById("headline");

let mouseX = 0;
let mouseY = 0;

// Track cursor
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Move NO randomly on screen
function moveNoButton() {
  const padding = 20;
  const rect = noBtn.getBoundingClientRect();

  const maxX = window.innerWidth - rect.width - padding;
  const maxY = window.innerHeight - rect.height - padding;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

// Distance check loop
function dodgeLoop() {
  const rect = noBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const distance = Math.hypot(mouseX - cx, mouseY - cy);

  if (distance < 120) {
    moveNoButton();
  }

  requestAnimationFrame(dodgeLoop);
}

dodgeLoop();

// Extra protection
noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("mousedown", (e) => {
  e.preventDefault();
  moveNoButton();
});
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton();
});

// YES click
yesBtn.addEventListener("click", () => {
  message.classList.remove("hidden");
  yesBtn.disabled = true;
  noBtn.disabled = true;
  tease.textContent = "Reservation vibes for Picanha Steakhouse ✨";
});

// Typewriter headline
const HER_NAME = "Shayira";
function typewriter(text) {
  headline.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    headline.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, 50);
}

typewriter(`${HER_NAME}, will you be my Valentine?`);
