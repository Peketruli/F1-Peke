// Dibuja un circuito simple y mueve un coche con las flechas
const canvas = document.getElementById('raceCanvas');
const ctx = canvas.getContext('2d');

// Definimos el circuito como una pista ovalada
function drawTrack() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(400, 300, 300, 200, 0, 0, Math.PI * 2);
  ctx.stroke();
}

// Coche: posición angular en el óvalo
let angle = 0;
let speed = 0.02; // velocidad angular
function drawCar() {
  let x = 400 + 300 * Math.cos(angle);
  let y = 300 + 200 * Math.sin(angle);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = "red";
  ctx.fillRect(-15, -7, 30, 14); // coche
  ctx.restore();
}

// Físicas simplificadas: girar con flechas
document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowRight") angle += speed;
  if (e.key === "ArrowLeft") angle -= speed;
});

function loop() {
  drawTrack();
  drawCar();
  requestAnimationFrame(loop);
}
loop();