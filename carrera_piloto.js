function startCarreraPiloto(canvas, pilotoNombre, equipo) {
  const ctx = canvas.getContext("2d");
  const ancho = canvas.width, alto = canvas.height;

  // Configuración de coches
  const NUM_AI = 9; // 1 jugador + 9 IA (10 en total)
  const coches = [];

  // Coche del jugador
  const cocheJugador = new Coche(400, 500, "#e10600", pilotoNombre, true);
  coches.push(cocheJugador);

  // IA
  for (let i = 0; i < NUM_AI; i++) {
    const pilotoAI = equipo.pilotos[i % 2] + " (IA " + (i + 1) + ")";
    coches.push(new Coche(400 + (i - 4) * 30, 550, "#aaa", pilotoAI));
  }

  // Control teclado
  const teclas = {};
  document.addEventListener("keydown", e => teclas[e.key] = true);
  document.addEventListener("keyup", e => teclas[e.key] = false);

  // Loop principal
  function loop() {
    ctx.clearRect(0, 0, ancho, alto);
    dibujarCircuito(ctx, ancho, alto);

    // Actualizar y dibujar coches
    coches.forEach(coche => {
      coche.actualizar(teclas, coches);
      coche.dibujar(ctx);
    });

    requestAnimationFrame(loop);
  }
  loop();
}

// Circuito simple (rectángulo con curva)
function dibujarCircuito(ctx, ancho, alto) {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(ancho-100, 100);
  ctx.lineTo(ancho-100, alto-100);
  ctx.lineTo(100, alto-100);
  ctx.closePath();
  ctx.stroke();
}