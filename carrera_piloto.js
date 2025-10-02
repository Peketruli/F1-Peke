function startCarreraPiloto(canvas, pilotoNombre, equipo) {
  const ctx = canvas.getContext("2d");
  const ancho = canvas.width, alto = canvas.height;

  // Configuración de coches
  const NUM_AI = 9;
  const coches = [];

  // Coche del jugador
  const cocheJugador = new Coche(CIRCUITO[0].x, CIRCUITO[0].y, "#e10600", pilotoNombre, true);
  coches.push(cocheJugador);

  // IA en la salida
  for (let i = 0; i < NUM_AI; i++) {
    const pilotoAI = equipo.pilotos[i % 2] + " (IA " + (i + 1) + ")";
    coches.push(new Coche(CIRCUITO[0].x + (i - 4) * 30, CIRCUITO[0].y + 30, "#aaa", pilotoAI));
  }

  // Control teclado
  const teclas = {};
  document.addEventListener("keydown", e => teclas[e.key] = true);
  document.addEventListener("keyup", e => teclas[e.key] = false);

  // Loop principal
  function loop() {
    ctx.clearRect(0, 0, ancho, alto);
    dibujarCircuitoWaypoints(ctx);

    // Actualizar y dibujar coches
    coches.forEach(coche => {
      coche.actualizar(teclas, coches);
      coche.dibujar(ctx);
    });

    requestAnimationFrame(loop);
  }
  loop();
}
