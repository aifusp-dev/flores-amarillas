// === Contenido de la carta ===
// Sustituye estos párrafos por el mensaje real.
const LETTER_PARAGRAPHS = [
  "Hola, Draw.",
  "Hoy es 21 de septiembre, el día de las flores amarillas, y aunque la distancia siga siendo la distancia, no quería que este día pasara sin que supieras que estoy pensando en ti.",
  " Tengo entendido que las flores amarillas se dan cuando sabes que querés pasar el resto de tu vida con una persona, y por eso cada año que pasemos vas a recibir las tuyas, porque cada día reafirmo que te tengo en mi corazón. Siento que esto se queda corto con lo que siento, porque mi amor aún a la distancia es inmenso y aunque no estemos físicamente  no puedo enumerar todos los sitios en los que siento que estas conmigo.",
  "No pude tenerlas en mis manos para dártelas, pero hice esto con las mías para que al menos sepas que, aunque estemos lejos, sigues siendo de las cosas que más me importan.",
  "Gracias por aguantar la distancia conmigo, por las llamadas, por seguir eligiéndonos aunque no sea fácil. Cada día que sigo pensando en ti es un día que valió la pena.",
  "Feliz día de las flores amarillas, Draw. Cuenta los días conmigo, que pronto se acortan.",
];

// === Animación de flores cayendo ===
const canvas = document.getElementById("flowers");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const FLOWER_COUNT = window.innerWidth < 600 ? 18 : 30;

function drawFlower(x, y, size, rotation, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = opacity;

  const petals = 5;
  ctx.fillStyle = "#f5c518";
  for (let i = 0; i < petals; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / petals);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.6, size * 0.35, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = "#e0a800";
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

class Flower {
  constructor() {
    this.reset(true);
  }
  reset(initial) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : -20;
    this.size = 10 + Math.random() * 14;
    this.speed = 0.4 + Math.random() * 1.1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.drift = (Math.random() - 0.5) * 0.6;
    this.opacity = 0.5 + Math.random() * 0.5;
  }
  update() {
    this.y += this.speed;
    this.x += this.drift;
    this.rotation += this.rotationSpeed;
    if (this.y > canvas.height + 20) this.reset(false);
  }
  draw() {
    drawFlower(this.x, this.y, this.size, this.rotation, this.opacity);
  }
}

const flowers = Array.from({ length: FLOWER_COUNT }, () => new Flower());

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  flowers.forEach((f) => {
    f.update();
    f.draw();
  });
  requestAnimationFrame(animate);
}
animate();

// === Mecánica de la carta ===
const introScreen = document.getElementById("intro");
const letterScreen = document.getElementById("letter");
const openBtn = document.getElementById("open-letter");
const nextBtn = document.getElementById("next-line");
const letterTextEl = document.getElementById("letter-text");
const signatureEl = document.getElementById("signature");

let paragraphIndex = 0;
let typing = false;

function typeParagraph(text) {
  typing = true;
  nextBtn.disabled = true;
  letterTextEl.textContent = "";
  let i = 0;
  const speed = 28;

  function tick() {
    if (i <= text.length) {
      letterTextEl.textContent = text.slice(0, i);
      i++;
      setTimeout(tick, speed);
    } else {
      typing = false;
      nextBtn.disabled = false;
      if (paragraphIndex >= LETTER_PARAGRAPHS.length) {
        nextBtn.classList.add("hidden");
        signatureEl.classList.remove("hidden");
      }
    }
  }
  tick();
}

function showNextParagraph() {
  if (typing) return;
  if (paragraphIndex < LETTER_PARAGRAPHS.length) {
    typeParagraph(LETTER_PARAGRAPHS[paragraphIndex]);
    paragraphIndex++;
  }
}

openBtn.addEventListener("click", () => {
  introScreen.classList.add("hidden");
  letterScreen.classList.remove("hidden");
  showNextParagraph();
  startMusic();
});

nextBtn.addEventListener("click", showNextParagraph);

// === Música de fondo con control de volumen ===
const music = document.getElementById("bg-music");
const musicControl = document.getElementById("music-control");
const muteToggle = document.getElementById("mute-toggle");
const volumeSlider = document.getElementById("volume-slider");

const DEFAULT_VOLUME = 0.4; // las webs suelen sonar muy fuerte, arrancamos bajo
const savedVolume = parseFloat(localStorage.getItem("flores-volume"));
music.volume = Number.isFinite(savedVolume) ? savedVolume : DEFAULT_VOLUME;
volumeSlider.value = music.volume;
updateMuteIcon();

function startMusic() {
  musicControl.classList.remove("hidden");
  music.play().catch(() => {});
}

volumeSlider.addEventListener("input", () => {
  music.volume = parseFloat(volumeSlider.value);
  music.muted = music.volume === 0;
  localStorage.setItem("flores-volume", music.volume);
  updateMuteIcon();
});

muteToggle.addEventListener("click", () => {
  music.muted = !music.muted;
  updateMuteIcon();
});

function updateMuteIcon() {
  muteToggle.textContent = music.muted || music.volume === 0 ? "🔇" : "🔊";
}
