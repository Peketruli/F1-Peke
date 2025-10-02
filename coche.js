class Coche {
  constructor(x, y, color, nombre, esJugador = false) {
    this.x = x;
    this.y = y;
    this.angulo = -Math.PI/2;
    this.velocidad = 0;
    this.color = color;
    this.nombre = nombre;
    this.esJugador = esJugador;
    this.waypointIdx = 0;
  }

  actualizar(teclas, coches) {
    if (this.esJugador) {
      // Control jugador
      if (teclas["ArrowUp"]) this.velocidad = Math.min(this.velocidad + 0.15, 5);
      if (teclas["ArrowDown"]) this.velocidad = Math.max(this.velocidad - 0.3, 0);
      if (teclas["ArrowLeft"]) this.angulo -= 0.04 * (this.velocidad/2);
      if (teclas["ArrowRight"]) this.angulo += 0.04 * (this.velocidad/2);

      // Penalización si se sale de pista
      const distToTrack = this.distanciaAPista();
      if (distToTrack > 50) this.velocidad *= 0.92; // penaliza fuera de pista
    } else {
      // IA: busca siguiente waypoint
      const wp = CIRCUITO[this.waypointIdx];
      const dx = wp.x - this.x;
      const dy = wp.y - this.y;
      const anguloObjetivo = Math.atan2(dy, dx);
      let delta = anguloObjetivo - this.angulo;
      // Normaliza el ángulo entre -PI y PI
      while (delta > Math.PI) delta -= 2 * Math.PI;
      while (delta < -Math.PI) delta += 2 * Math.PI;
      this.angulo += Math.max(-0.04, Math.min(0.04, delta));
      this.velocidad = 4 + Math.random() * 0.5;
      this.x += Math.cos(this.angulo) * this.velocidad;
      this.y += Math.sin(this.angulo) * this.velocidad;

      // Si está cerca del waypoint, avanza al siguiente
      if (Math.hypot(dx, dy) < 30) {
        this.waypointIdx = (this.waypointIdx + 1) % CIRCUITO.length;
      }
    }
    // Movimiento para ambos
    if (this.esJugador) {
      this.x += Math.cos(this.angulo) * this.velocidad;
      this.y += Math.sin(this.angulo) * this.velocidad;
      this.velocidad *= 0.98; // fricción
    }
  }

  distanciaAPista() {
    // Encuentra la distancia mínima a la línea del circuito (simplificada)
    let minDist = Infinity;
    for (const p of CIRCUITO) {
      const d = Math.hypot(this.x - p.x, this.y - p.y);
      if (d < minDist) minDist = d;
    }
    return minDist;
  }

  dibujar(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angulo);
    ctx.fillStyle = this.color;
    ctx.fillRect(-12, -6, 24, 12);
    ctx.restore();
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.fillText(this.nombre, this.x - 20, this.y - 16);
  }
}
