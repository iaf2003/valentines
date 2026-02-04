const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const message = document.getElementById("message");
const tease = document.getElementById("tease");
const confetti = document.getElementById("confetti");
const floaters = document.getElementById("floaters");
const headline = document.getElementById("headline");

const HER_NAME = "Shayira";
const PLAN = "Picanha Steakhouse";

let dodges = 0;

// Typewriter headline
function typewriter(text, speed = 42){
  headline.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    headline.textContent += text[i];
    i++;
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

// Confetti burst
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

// Paint splat burst around the YES button
function splatBurst(){
  const rect = yesBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const colors = ["#ec407a","#ff77a8","#7c4dff","#26c6da","#ffd54f","#66bb6a"];
  const splats = 22;

  for(let i=0;i<splats;i++){
    const d = document.createElement("div");
    d.className = "splat";
    d.style.left = centerX + "px";
    d.style.top = centerY + "px";
    d.style.position = "fixed";
    d.style.background = colors[Math.floor(Math.random()*colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const radius = 18 + Math.random()*60;
    d.style.setProperty("--dx", `${Math.cos(angle) * radius}px`);
    d.style.setProperty("--dy", `${Math.sin(angle) * radius}px`);
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 800);
  }
}

// Keep NO button inside the buttons area while dodging
function dodge(){
  dodges++;

  const area = document.querySelector(".buttons");
  const areaRect = area.getBoundingClientRect();

  const maxX = areaRect.width - noBtn.offsetWidth;
  const maxY = areaRect.height - noBtn.offsetHeight;

  const x = Math.max(0, Math.random() * maxX);
  const y = Math.max(0, Math.random() * maxY);

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  if(dodges === 3){
    tease.textContent = "Hehe… it’s shy 🙈 try the other one";
  }
  if(dodges === 6){
    tease.textContent = `Okay okay Shayira… dinner at ${PLAN} is waiting 😌🥩`;
  }
  if(dodges >= 9){
    tease.textContent = "I’m not saying it’s impossible to click No… but I am saying it’s unnecessary 💖";
  }
}

noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  dodge();
}, { passive:false });

// YES click
yesBtn.addEventListener("click", () => {
  message.classList.remove("hidden");
  yesBtn.disabled = true;
  noBtn.disabled = true;

  tease.textContent = `Reservation vibes for ${PLAN} ✨`;
  splatBurst();
  confettiBurst();
});
