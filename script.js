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

/* -------- typewriter -------- */
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

/* -------- floaters -------- */
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

/* -------- confetti -------- */
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

/* -------- splat burst -------- */
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

/* -------- NO runner logic -------- */
let lastMouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
let dodges = 0;

const padding = 18;
const avoidCursor = 320;     // how far away NO must be from cursor
const avoidYes = 220;        // how far away NO must be from YES
const attempts = 140;        // random tries per move

function dist(ax, ay, bx, by){ return Math.hypot(ax - bx, ay - by); }

function rectCenter(r){ return { x: r.left + r.width/2, y: r.top + r.height/2 }; }

function snapNoToSlot(){
  const slotRect = noSlot.getBoundingClientRect();
  noBtn.style.left = `${slotRect.left}px`;
  noBtn.style.top = `${slotRect.top}px`;
}

function pickSafeSpot(){
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const yesC = rectCenter(yesRect);

  const maxX = window.innerWidth - noRect.width - padding;
  const maxY = window.innerHeight - noRect.height - padding;

  let best = null;
  let bestScore = -Infinity;

  for(let i=0;i<attempts;i++){
    const x = padding + Math.random() * (maxX - padding);
    const y = padding + Math.random() * (maxY - padding);

    const cx = x + noRect.width/2;
    const cy = y + noRect.height/2;

    const dMouse = dist(cx, cy, lastMouse.x, lastMouse.y);
    const dYes = dist(cx, cy, yesC.x, yesC.y);

    const safe = (dMouse >= avoidCursor) && (dYes >= avoidYes);
    const score = dMouse + dYes;

    if(safe && score > bestScore){
      best = { x, y };
      bestScore = score;
    }

    if(!best && score > bestScore){
      best = { x, y };
      bestScore = score;
    }
  }

  return best;
}

function moveNo(){
  dodges += 1;

  const spot = pickSafeSpot();
  if(spot){
    noBtn.style.left = `${spot.x}px`;
    noBtn.style.top = `${spot.y}px`;
  }

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
  const r = noBtn.getBoundingClientRect();
  const c = rectCenter(r);

  if(dist(c.x, c.y, lastMouse.x, lastMouse.y) < avoidCursor){
    moveNo();
  }
});

noBtn.addEventListener("mouseenter", (e) => { e.preventDefault(); moveNo(); });
noBtn.addEventListener("mousedown", (e) => { e.preventDefault(); moveNo(); });
noBtn.addEventListener("click", (e) => { e.preventDefault(); moveNo(); });
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); moveNo(); }, { passive:false });

window.addEventListener("load", () => {
  snapNoToSlot();
  // move once after paint to prove it works
  setTimeout(moveNo, 150);
});

window.addEventListener("resize", () => {
  setTimeout(moveNo, 80);
});

/* -------- YES click -------- */
yesBtn.addEventListener("click", () => {
  message.classList.remove("hidden");
  yesBtn.disabled = true;
  noBtn.disabled = true;

  tease.textContent = `Reservation vibes for ${PLAN} ✨`;
  splatBurst();
  confettiBurst();
});
/* -------- RESET position on reload -------- */
window.addEventListener("beforeunload", () => {
  noBtn.style.left = "";
  noBtn.style.top = "";
});   
/* -------- END -------- */