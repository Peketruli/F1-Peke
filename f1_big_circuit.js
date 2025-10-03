const canvas = document.getElementById('raceCanvas');
const ctx = canvas.getContext('2d');

// Circuito grande: óvalo de 2400x1200 píxeles
const TRACK = {
  center: { x: 1200, y: 600 },
  outer: { rx: 1100, ry: 500 },
  inner: { rx: 900, ry: 300 }
};

const CAR = {
  w: 50,
  h: 28,
  maxSpeed: 12,      // píxeles/frame
  acc: 0.35,
  friction: 0.15,
  rotSpeed: 0.055
};

// Estado del coche
let car = {
  x: TRACK.center.x + TRACK.outer.rx - 70,
  y: TRACK.center.y,
  angle: Math.PI,
  speed: 0
};

// Teclas
let keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

// Dibuja el circuito desplazado según la posición del coche (la cámara lo sigue)
function drawTrack(offsetX, offsetY) {
  // Césped
  ctx.fillStyle = "#090";
  ctx.fillRect(-offsetX, -offsetY, 2400, 1200);

  ctx.save();
  ctx.translate(TRACK.center.x - offsetX, TRACK.center.y - offsetY);

  // Bordes exteriores
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 24;
  ctx.beginPath();
  ctx.ellipse(0, 0, TRACK.outer.rx, TRACK.outer.ry, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Pista asfalto
  ctx.strokeStyle = "#444";
  ctx.lineWidth = TRACK.outer.rx - TRACK.inner.rx;
  ctx.beginPath();
  ctx.ellipse(0, 0, (TRACK.outer.rx + TRACK.inner.rx) / 2, (TRACK.outer.ry + TRACK.inner.ry) / 2, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Bordes interiores
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.ellipse(0, 0, TRACK.inner.rx, TRACK.inner.ry, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Línea de meta
  ctx.save();
  ctx.rotate(-Math.PI / 2);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(TRACK.outer.rx, 0);
  ctx.lineTo(TRACK.inner.rx, 0);
  ctx.stroke();
  ctx.restore();

  // Detalles: pianos en curvas
  ctx.strokeStyle = "#f00";
  ctx.lineWidth = 6;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
    ctx.beginPath();
    ctx.arc(TRACK.outer.rx * Math.cos(a), TRACK.outer.ry * Math.sin(a), 28, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// Dibuja el coche siempre centrado en pantalla
function drawCar() {
  const screenX = canvas.width / 2;
  const screenY = canvas.height / 2;

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(car.angle);
  ctx.fillStyle = "#e10600";
  ctx.fillRect(-CAR.w / 2, -CAR.h / 2, CAR.w, CAR.h);
  // Cabina
  ctx.fillStyle = "#fff";
  ctx.fillRect(-CAR.w / 5, -CAR.h / 4, CAR.w / 2.2, CAR.h / 2);
  // Sombra
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.ellipse(0, CAR.h / 2, CAR.w / 2, CAR.h / 3, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

// Físicas básicas: aceleración, giro, fricción
function updateCar() {
  // Acelerar/frenar
  if (keys["ArrowUp"]) car.speed += CAR.acc;
  if (keys["ArrowDown"]) car.speed -= CAR.acc;
  // Fricción
  car.speed *= (1 - CAR.friction);
  // Limitar velocidad
  car.speed = Math.max(-CAR.maxSpeed, Math.min(CAR.maxSpeed, car.speed));
  // Girar
  if (keys["ArrowLeft"]) car.angle -= CAR.rotSpeed * (car.speed >= 0 ? 1 : -1);
  if (keys["ArrowRight"]) car.angle += CAR.rotSpeed * (car.speed >= 0 ? 1 : -1);

  // Mover
  car.x += Math.cos(car.angle) * car.speed;
  car.y += Math.sin(car.angle) * car.speed;

  // Evitar salirse del circuito (colisión básica)
  if (!isOnTrack(car.x, car.y)) {
    // Penalización por fuera: reduce velocidad
    car.speed *= 0.75;
    // Opcional: rebote hacia dentro
    // car.x -= Math.cos(car.angle) * car.speed;
    // car.y -= Math.sin(car.angle) * car.speed;
  }
}

// Determina si el coche está dentro de la pista
function isOnTrack(x, y) {
  let dx = x - TRACK.center.x;
  let dy = y - TRACK.center.y;
  let angle = Math.atan2(dy * TRACK.outer.rx, dx * TRACK.outer.ry);
  let rx = Math.abs(Math.sqrt(dx*dx + dy*dy * TRACK.outer.ry*TRACK.outer.ry/TRACK.outer.rx/TRACK.outer.rx));
  // Aproximación: elipse
  let dOuter = (dx*dx)/(TRACK.outer.rx*TRACK.outer.rx) + (dy*dy)/(TRACK.outer.ry*TRACK.outer.ry);
  let dInner = (dx*dx)/(TRACK.inner.rx*TRACK.inner.rx) + (dy*dy)/(TRACK.inner.ry*TRACK.inner.ry);
  return dInner >= 1 && dOuter <= 1;
}

// HUD info
function drawHUD() {
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText(`Velocidad: ${(car.speed * 14).toFixed(0)} km/h`, 30, 40);
  ctx.fillText(`Posición: X=${car.x.toFixed(0)} Y=${car.y.toFixed(0)}`, 30, 80);
  ctx.restore();
}

// Main loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateCar();

  // Offset del circuito: cámara sigue al coche
  let offsetX = car.x - canvas.width / 2;
  let offsetY = car.y - canvas.height / 2;

  drawTrack(offsetX, offsetY);
  drawCar();
  drawHUD();

  requestAnimationFrame(loop);
}
loop();