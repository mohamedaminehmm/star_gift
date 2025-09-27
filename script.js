let last = {
  starTimestamp: Date.now(),
  starPosition: { x: 0, y: 0 },
  mousePosition: { x: 0, y: 0 }
};

const config = {
  starAnimationDuration: 1300,
  minimumTimeBetweenStars: 150,
  minimumDistanceBetweenStars: 30,
  glowDuration: 100,
  maximumGlowPointSpacing: 13,
  colors: ["255 255 255", "255 223 0", "255 180 80", "255 240 150"], // white & golden shades
  sizes: ["1.8rem", "1.4rem", "1rem", "0.6rem"],
  animations: ["fall-1","fall-2","fall-3"],
  starsPerBurst: 3 // how many stars per move
};

let count = 0;

const px = v => `${v}px`;
const rand = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
const selectRandom = arr => arr[rand(0,arr.length-1)];

const calcDistance = (a,b) => Math.hypot(b.x-a.x,b.y-a.y);
const starContainer = document.getElementById("star-container");
const append = el => starContainer.appendChild(el);
const remove = (el,delay) => setTimeout(()=>el.parentNode&&el.parentNode.removeChild(el), delay);

// Create a star ✨
const createStar = pos => {
  const star = document.createElement("span");
  const color = selectRandom(config.colors);

  star.className = "star";
  star.textContent = "★"; // Unicode sparkle star
  star.style.left = px(pos.x + rand(-20,20)); // random offset
  star.style.top = px(pos.y + rand(-20,20));
  star.style.fontSize = selectRandom(config.sizes);
  star.style.color = `rgb(${color})`;
  star.style.textShadow = `0 0 1.5rem rgb(${color} / 0.8)`;
  star.style.animationName = config.animations[count++ % config.animations.length];
  star.style.animationDuration = `${config.starAnimationDuration}ms`;

  append(star);
  remove(star, config.starAnimationDuration);
};

// Glow effect 🟡
const createGlow = (lastPos,currentPos) => {
  const distance = calcDistance(lastPos,currentPos);
  const quantity = Math.max(Math.floor(distance/config.maximumGlowPointSpacing),1);
  const dx = (currentPos.x-lastPos.x)/quantity;
  const dy = (currentPos.y-lastPos.y)/quantity;

  for(let i=0;i<quantity;i++){
    const glow = document.createElement("div");
    glow.className = "glow-point";
    glow.style.left = px(lastPos.x + dx*i);
    glow.style.top = px(lastPos.y + dy*i);
    append(glow);
    remove(glow,config.glowDuration);
  }
};

// Mouse move handler
const handleMove = e => {
  const mouse = { x:e.clientX, y:e.clientY };
  if(last.mousePosition.x===0 && last.mousePosition.y===0) last.mousePosition = mouse;

  const now = Date.now();
  const movedEnough = calcDistance(last.starPosition,mouse)>=config.minimumDistanceBetweenStars;
  const timeEnough = now-last.starTimestamp>config.minimumTimeBetweenStars;

  if(movedEnough||timeEnough){
    for(let i=0;i<config.starsPerBurst;i++){
      createStar(mouse);
    }
    last.starTimestamp = now;
    last.starPosition = mouse;
  }

  createGlow(last.mousePosition,mouse);
  last.mousePosition = mouse;
};

window.onmousemove = handleMove;
window.ontouchmove = e => handleMove(e.touches[0]);
document.body.onmouseleave = () => last.mousePosition={x:0,y:0};
// Assume your <audio id="bgmusic"> is already playing
const audio = document.getElementById("bgmusic");

// Total duration of the text sequence
const totalTextDuration = (5000 + 1500) * sentences.length / 1000; // seconds
const targetTime = totalTextDuration; // 32.5 seconds

localStorage.setItem("audioStartTime", targetTime);

window.location.href = "index2.html"; // redirect after sequence

