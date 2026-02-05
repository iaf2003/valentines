const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const noSlot = document.getElementById("noSlot");

const message = document.getElementById("message");
const tease = document.getElementById("tease");
const confetti = document.getElementById("confetti");
const floaters = document.getElementById("floaters");
const headline = document.getElementById("headline");

const HER_NAME = "Shayira";
const PLAN = "Picanha Steakhouse";

let dodges = 0;
let noReady = false;
let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

const padding = 18;
const dodgeRadius = 300;
const yesAvoidRadius = 220;
const triesPerDodge = 120;

function typewriter(text, speed = 42){
  headline.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    headline.textContent += text[i];
    i += 1;
    if(i >= text.length) clearInterval(timer);
  }, speed);
}
typewriter(`${HER_NAME}, will you be my Valentine?`);

function seedFloaters(){
  const icons = ["💗","💘","💖","💕","🐱","🎨","🖌️","✨"];
  for(let i=0;i<22;i++){
    const s = document.createElement("span");
    s.className = "floater";
    s.textContent = icons[Math.floor(Math.random()*icons.length)];
    s.style.left = Math.random()*100 + "vw";
    s.style.bottom = (-10 - Math.random()*30) + "vh";
    s.style.animationDuration = (7 + Math.random()*7) + "s";
    s.style.animationDelay = (Math.random()*6) + "s";
    s.style.fontSize = (16 + Math.random()*18) + "px";
    floaters.appendChild(s);
  }
}
seedFloaters();

function confettiBurst(){
  confetti.innerHTML = "";
  const colors = ["#ec407a","#ff77a8","#ffd1e1","#ffffff","#c2185b","#ffe0eb"];
  const count = 140;

  for(let i=0;i<count;i++){
    const c = document.createElement("span");
    c.style.left = Math.random()*100 + "vw";
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.animationDuration = (1.8 + Math.random()*2.4) + "s";
    c.style.animationDelay = (Math.random()*0.25) + "s";
    c.style.width = (8 + Math.random()*8) + "px";
    c.style.height = (10 + Math.random()*12) + "px";
    confetti.appendChild(c);
  }
  setTimeout(() => (confetti.innerHTML = ""), 4200);
}

function splatBurst(){
  const rect = yesBtn.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;

  const colors = ["#ec407a","#ff77a8","#7c4dff","#26c6da","#ffd54f","#66bb6a"];
  const splats = 22;

  for(let i=0;i<splats;i++){
    const d = document.createElement("div");
    d.className = "splat";
    d.style.left = cx + "px";
    d.style.top = cy + "px";
    d.style.position = "fixed";
    d.style.background = colors[Math.floor(Math.random()*colors.length)];

    const angle = Math.random() * Math.PI * 2;
    const radius = 18 + Math.random()*60;

    d.style.setProperty("--dx", `${Math.cos(angle)*radius}px`);
    d.style.setProperty("--dy", `${Math.sin(angle)*radius}px`);

    document.body.appendChild(d);
    setTimeout(() => d.remove(), 800);
  }
}

function centerOfRect(r){
  return { x: r.left + r.width/2, y: r.top + r.height/2 };
}
function dist(ax, ay, bx, by){
  return Math.hypot(ax - bx, ay - by);
}
function placeNoAt(x, y){
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}
function snapNoToSlot(){
  const slotRect = noSlot.getBoundingClientRect();
  placeNoAt(slotRect.left, slotRect.top);
}
function randomSpot(noRect){
  const maxX = window.innerWidth - noRect.width - padding;
  const maxY = window.innerHeight - noRect.height - padding;

  const x = Math.random() * (maxX - padding) + padding;
  const y = Math.random() * (maxY - padding) + padding;
  return { x, y };
}

function superDodge(){
  dodges += 1;

  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const yesC = centerOfRect(yesRect);

  let best = null;
  let bestScore = -Infinity;

  for(let i=0;i<triesPerDodge;i++){
    const spot = randomSpot(noRect);

    const noCX = spot.x + noRect.width/2;
    const noCY = spot.y + noRect.height/2;

    const dMouse = dist(noCX, noCY, lastMouse.x, lastMouse.y);
    const dYes = dist(noCX, noCY, yesC.x, yesC.y);

    const safe = (dMouse > dodgeRadius) && (dYes > yesAvoidRadius);
    const score = dMouse + dYes;

    if(safe && score > bestScore){
      best = spot;
      bestScore = score;
    }
    if(!best && score > bestScore){
      best = spot;
      bestScore = score;
    }
  }

  if(best) placeNoAt(best.x, best.y);

  if(dodges === 3){
    tease.textContent = "Hehe… it’s shy 🙈 try the other one";
  } else if(dodges === 6){
    tease.textContent = `Okay okay ${HER_NAME}… dinner at ${PLAN} is waiting 😌🥩`;
  } else if(dodges >= 9){
    tease.textContent = "No is not an option today 💖";
  }
}

document.addEventListener("mousemove", (e) => {
  lastMouse = { x: e.clientX, y: e.clientY };
  if(!noReady) return;

  const rect = noBtn.getBoundingClientRect();
  const c = centerOfRect(rect);

  if(dist(c.x, c.y, lastMouse.x, lastMouse.y) < dodgeRadius){
    superDodge();
  }
});

window.addEventListener("load", () => {
  snapNoToSlot();
  noReady = true;
  setTimeout(() => superDodge(), 120);
});

window.addEventListener("resize", () => {
  if(!noReady) return;
  setTimeout(() => superDodge(), 50);
});

noBtn.addEventListener("mouseenter", (e) => { e.preventDefault(); superDodge(); });

yesBtn.addEventListener("click", () => {
  message.classList.remove("hidden");
  yesBtn.disabled = true;
  noBtn.disabled = true;

  tease.textContent = `Reservation vibes for ${PLAN} ✨`;
  splatBurst();
  confettiBurst();
});
