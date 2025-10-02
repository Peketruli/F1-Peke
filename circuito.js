// Array de puntos (waypoints) que forman el circuito
const CIRCUITO = [
  {x: 400, y: 520},
  {x: 700, y: 500},
  {x: 700, y: 300},
  {x: 600, y: 180},
  {x: 400, y: 120},
  {x: 200, y: 180},
  {x: 100, y: 300},
  {x: 100, y: 500},
  {x: 400, y: 520}
];

// Dibuja el circuito conectando los waypoints
function dibujarCircuitoWaypoints(ctx) {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 8;
  ctx.beginPath();
  for (let i = 0; i < CIRCUITO.length; i++) {
    const p = CIRCUITO[i];
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // Opcional: dibuja los puntos de control
  ctx.fillStyle = "#44f";
  CIRCUITO.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
    ctx.fill();
  });
}