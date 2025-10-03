// --- CONFIGURACIÓN DE CIRCUITO Y COCHES ---
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const pista = {
  // Array de puntos que forman el circuito (ovalado grande)
  puntos: [],
  ancho: 70,
};

// Generar puntos ovalados para la pista
function generaPista() {
  const cx = 0, cy = 0;
  const radioX = 400, radioY = 200;
  const numPuntos = 200;
  pista.puntos = [];
  for (let i = 0; i < numPuntos; i++) {
    const ang = (2 * Math.PI * i) / numPuntos;
    pista.puntos.push({
      x: cx + radioX * Math.cos(ang),
      y: cy + radioY * Math.sin(ang),
    });
  }
}
generaPista();

// --- COCHE DEL JUGADOR E IA ---
class Coche {
  constructor(color, nombre, isPlayer = false) {
    this.x = pista.puntos[0].x;
    this.y = pista.puntos[0].y;
    this.angulo = 0;
    this.velocidad = 0;
    this.maxVel = 7;
    this.nombre = nombre;
    this.color = color;
    this.isPlayer = isPlayer;
    this.target = 1; // Siguiente punto a seguir en la pista
    this.lap = 0;
  }

  update(controles) {
    if (this.isPlayer) {
      // Control manual: flechas/WASD
      if (controles.up) this.velocidad = Math.min(this.velocidad + 0.2, this.maxVel);
      else this.velocidad *= 0.98; // fricción
      if (controles.left) this.angulo -= 0.05 * (this.velocidad/4+1);
      if (controles.right) this.angulo += 0.05 * (this.velocidad/4+1);
    } else {
      // IA: sigue puntos de la pista
      const targetPt = pista.puntos[this.target];
      const dx = targetPt.x - this.x;
      const dy = targetPt.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const angTarget = Math.atan2(dy, dx);
      let diffAng = angTarget - this.angulo;
      // Normaliza ángulo entre -PI y PI
      diffAng = Math.atan2(Math.sin(diffAng), Math.cos(diffAng));
      this.angulo += diffAng * 0.08;
      this.velocidad = this.maxVel * 0.9;
      if (dist < 32) {
        this.target = (this.target + 1) % pista.puntos.length;
        if (this.target === 0) this.lap++;
      }
    }
    // Mueve el coche
    this.x += Math.cos(this.angulo) * this.velocidad;
    this.y += Math.sin(this.angulo) * this.velocidad;
  }

  draw(camX, camY) {
    ctx.save();
    ctx.translate(this.x-camX+canvas.width/2, this.y-camY+canvas.height/2);
    ctx.rotate(this.angulo);
    ctx.fillStyle = this.color;
    ctx.fillRect(-18, -10, 36, 20);
    ctx.fillStyle = "#fff";
    ctx.fillRect(10, -8, 12, 16); // "cabina"
    ctx.restore();
  }
}

// --- JUEGO ---
const player = new Coche("#e10600", "Jugador", true);
const rivales = [
  new Coche("#0af", "IA 1"),
  new Coche("#0f3", "IA 2"),
  new Coche("#ff0", "IA 3"),
];

let controles = { up: false, left: false, right: false };

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") controles.up = true;
  if (e.key === "ArrowLeft" || e.key === "a") controles.left = true;
  if (e.key === "ArrowRight" || e.key === "d") controles.right = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") controles.up = false;
  if (e.key === "ArrowLeft" || e.key === "a") controles.left = false;
  if (e.key === "ArrowRight" || e.key === "d") controles.right = false;
});

// --- BUCLE PRINCIPAL ---
function drawCircuito(camX, camY) {
  // Pista base
  ctx.save();
  ctx.translate(canvas.width/2-camX, canvas.height/2-camY);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = pista.ancho;
  ctx.beginPath();
  pista.puntos.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.closePath();
  ctx.stroke();
  // Línea meta
  ctx.strokeStyle = "#e10600";
  ctx.lineWidth = 6;
  ctx.beginPath();
  const meta = pista.puntos[0], meta2 = pista.puntos[5];
  ctx.moveTo(meta.x, meta.y);
  ctx.lineTo(meta2.x, meta2.y);
  ctx.stroke();
  ctx.restore();
}

function drawHUD() {
  ctx.fillStyle="#222d";
  ctx.fillRect(0,0,220,100);
  ctx.fillStyle="#fff";
  ctx.font="20px Segoe UI";
  ctx.fillText("Vueltas: "+(player.lap+1), 30, 40);
  ctx.fillText("Posición: "+getPosicionJugador(), 30, 70);
}

function getPosicionJugador() {
  // Ordenar por vueltas y target (avance en pista)
  const todos = [player, ...rivales];
  todos.sort((a,b) => b.lap - a.lap || b.target - a.target);
  return todos.indexOf(player)+1;
}

function gameLoop() {
  // Cámara sigue al jugador
  const camX = player.x, camY = player.y;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawCircuito(camX, camY);
  player.update(controles);
  player.draw(camX, camY);
  rivales.forEach(riv => {
    riv.update();
    riv.draw(camX, camY);
  });
  drawHUD();
  requestAnimationFrame(gameLoop);
}

gameLoop();
