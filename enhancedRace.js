const canvas = document.getElementById('raceCanvas');
const ctx = canvas.getContext('2d');

const TRACK_CENTER = { x: 0, y: 0 }; // Usamos coordenadas relativas
const OUTER_RADIUS_X = 500;
const OUTER_RADIUS_Y = 300;
const INNER_RADIUS_X = 400;
const INNER_RADIUS_Y = 200;
const CAR_SIZE = { w: 40, h: 20 };

let angle = Math.PI / 2; // posición angular del coche
let speed = 0;
let maxSpeed = 0.06;
let acc = 0.002;
let friction = 0.001;
let lap = 1;

// El coche siempre estará centrado en pantalla (cámara)
function worldToScreen(wx, wy) {
  const screenX = canvas.width / 2 + wx;
  const screenY = canvas.height / 2 + wy;
  return [screenX, screenY];
}

// Dibuja césped, pista, bordes, salida/meta, detalles
function drawTrack() {
  // Césped
  ctx.fillStyle = "#080";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bordes exteriores
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.ellipse(TRACK_CENTER.x, TRACK_CENTER.y, OUTER_RADIUS_X, OUTER_RADIUS_Y, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Pista asfalto
  ctx.strokeStyle = "#444";
  ctx.lineWidth = OUTER_RADIUS_X - INNER_RADIUS_X;
  ctx.beginPath();
  ctx.ellipse(TRACK_CENTER.x, TRACK_CENTER.y, (OUTER_RADIUS_X + INNER_RADIUS_X) / 2, (OUTER_RADIUS_Y + INNER_RADIUS_Y) / 2, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Bordes interiores
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(TRACK_CENTER.x, TRACK_CENTER.y, INNER_RADIUS_X, INNER_RADIUS_Y, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Línea de meta
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  const metaAngle = Math.PI / 2;
  const x1 = OUTER_RADIUS_X * Math.cos(metaAngle);
  const y1 = OUTER_RADIUS_Y * Math.sin(metaAngle);
  const x2 = INNER_RADIUS_X * Math.cos(metaAngle);
  const y2 = INNER_RADIUS_Y * Math.sin(metaAngle);
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Detalles: puntos de frenada (marcas)
  ctx.strokeStyle = "#ff0";
  ctx.lineWidth = 2;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
    let bx = OUTER_RADIUS_X * Math.cos(a);
    let by = OUTER_RADIUS_Y * Math.sin(a);
    ctx.beginPath();
    ctx.arc(bx, by, 20, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawCar() {
  // Coordenadas del coche sobre el circuito
  let x = (OUTER_RADIUS_X + INNER_RADIUS_X) / 2 * Math.cos(angle);
  let y = (OUTER_RADIUS_Y + INNER_RADIUS_Y) / 2 * Math.sin(angle);

  // El coche está centrado en pantalla, el circuito se mueve
  const [screenX, screenY] = worldToScreen(0, 0);

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(angle);
  ctx.fillStyle = "#e10600";
  ctx.fillRect(-CAR_SIZE.w / 2, -CAR_SIZE.h / 2, CAR_SIZE.w, CAR_SIZE.h);
  // Detalles del coche
  ctx.fillStyle = "#fff";
  ctx.fillRect(-CAR_SIZE.w / 4, -CAR_SIZE.h / 4, CAR_SIZE.w / 2, CAR_SIZE.h / 2);
  ctx.restore();

  // Dibuja sombra debajo del coche
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.ellipse(screenX, screenY + 10, CAR_SIZE.w / 2, CAR_SIZE.h / 2, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.restore();

  // Dibuja el circuito movido
  ctx.save();
  ctx.translate(screenX - x, screenY - y);
  drawTrack();
  ctx.restore();
}

// Controles: aceleración y giro
document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowRight") angle += 0.05;
  if (e.key === "ArrowLeft") angle -= 0.05;
  if (e.key === "ArrowUp") speed += acc;
  if (e.key === "ArrowDown") speed -= acc;
});

function updatePhysics() {
  // Fricción
  if (speed > 0) speed -= friction;
  if (speed < 0) speed += friction;
  // Limitador
  speed = Math.max(-maxSpeed, Math.min(maxSpeed, speed));
  angle += speed;

  // Detección de paso por meta (simplificado)
  if (Math.abs(angle % (2 * Math.PI) - Math.PI / 2) < 0.05 && speed > 0) {
    lap++;
  }
}

function drawHUD() {
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.fillText(`Velocidad: ${(speed * 100).toFixed(0)} km/h`, 20, 30);
  ctx.fillText(`Vuelta: ${lap}`, 20, 60);
  ctx.restore();
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePhysics();
  drawCar();
  drawHUD();
  requestAnimationFrame(loop);
}
loop();