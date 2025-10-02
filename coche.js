class Coche {
  constructor(x, y, color, nombre, esJugador = false) {
    this.x = x;
    this.y = y;
    this.angulo = -Math.PI/2;
    this.velocidad = 0;
    this.color = color;
    this.nombre = nombre;
    this.esJugador = esJugador;
  }

  actualizar(teclas, coches) {
    if (this.esJugador) {
      // Control jugador
      if (teclas["ArrowUp"]) this.velocidad = Math.min(this.velocidad + 0.2, 5);
      if (teclas["ArrowDown"]) this.velocidad = Math.max(this.velocidad - 0.3, 0);
      if (teclas["ArrowLeft"]) this.angulo -= 0.04;
      if (teclas["ArrowRight"]) this.angulo += 0.04;
    } else {
      // AI básica: velocidad constante y giro aleatorio
      this.velocidad = 4 + Math.random() * 0.5;
      this.angulo += (Math.random() - 0.5) * 0.02;
    }
    this.x += Math.cos(this.angulo) * this.velocidad;
    this.y += Math.sin(this.angulo) * this.velocidad;
    this.velocidad *= 0.98; // fricción
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