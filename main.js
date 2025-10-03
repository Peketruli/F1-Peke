let estado = {
  equipo: null,
  piloto: null,
  circuito: null,
  puntos: 0,
  carreras: [],
};

const app = document.getElementById('app');

function renderMenu() {
  estado = { equipo: null, piloto: null, circuito: null, puntos: 0, carreras: [] };
  document.getElementById('circuito-canvas').style.display = 'none';
  app.innerHTML = `
    <div class="menu">
      <h1>F1 Web - Modo Carrera</h1>
      <button onclick="renderSeleccion()">Jugar Modo Carrera</button>
    </div>
  `;
}

function renderSeleccion() {
  document.getElementById('circuito-canvas').style.display = 'none';
  app.innerHTML = `
    <div class="seleccion">
      <h2>Selecciona tu equipo, piloto y circuito</h2>
      <label>Equipo:</label>
      <select id="equipo-select" onchange="actualizaPilotos()">
        <option value="">-- Elegir --</option>
        ${EQUIPOS.map(e => `<option value="${e.id}">${e.nombre}</option>`).join("")}
      </select>
      <label>Piloto:</label>
      <select id="piloto-select">
        <option value="">-- Elegir equipo primero --</option>
      </select>
      <label>Circuito:</label>
      <select id="circuito-select">
        <option value="">-- Elegir --</option>
        ${CIRCUITOS.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("")}
      </select>
      <br>
      <button onclick="iniciarCarrera()">Empezar carrera</button>
      <button onclick="renderMenu()">Volver</button>
    </div>
  `;
}

function actualizaPilotos() {
  const equipoId = parseInt(document.getElementById('equipo-select').value, 10);
  const pilotoSelect = document.getElementById('piloto-select');
  const equipo = EQUIPOS.find(e => e.id === equipoId);
  if (equipo) {
    pilotoSelect.innerHTML = equipo.pilotos.map((p,i) => `<option value="${i}">${p}</option>`).join("");
  } else {
    pilotoSelect.innerHTML = `<option value="">-- Elegir equipo primero --</option>`;
  }
}

function iniciarCarrera() {
  const equipoId = parseInt(document.getElementById('equipo-select').value, 10);
  const pilotoIdx = parseInt(document.getElementById('piloto-select').value, 10);
  const circuitoId = parseInt(document.getElementById('circuito-select').value, 10);
  const equipo = EQUIPOS.find(e => e.id === equipoId);
  const piloto = equipo ? equipo.pilotos[pilotoIdx] : null;
  const circuito = CIRCUITOS.find(c => c.id === circuitoId);
  if (equipo && piloto != null && circuito) {
    estado.equipo = equipo;
    estado.piloto = piloto;
    estado.circuito = circuito;
    renderCarrera();
  } else {
    alert("Debes seleccionar equipo, piloto y circuito.");
  }
}

function renderCarrera() {
  // Simulación simple: resultado aleatorio para 10 pilotos
  const pilotos = [
    estado.piloto,
    "Piloto A", "Piloto B", "Piloto C", "Piloto D", "Piloto E", "Piloto F", "Piloto G", "Piloto H", "Piloto I"
  ];
  const resultado = pilotos
    .map(p => ({ nombre: p, tiempo: Math.random() }))
    .sort((a,b) => a.tiempo - b.tiempo)
    .map((p,i) => ({ ...p, posicion: i+1, puntos: PUNTOS[i] || 0 }));
  const miResultado = resultado.find(r => r.nombre === estado.piloto);
  estado.puntos += miResultado.puntos;
  estado.carreras.push({
    circuito: estado.circuito.nombre,
    posicion: miResultado.posicion,
    puntos: miResultado.puntos
  });

  app.innerHTML = `
    <div class="carrera">
      <h2>Carrera en ${estado.circuito.nombre}</h2>
      <p>Vueltas: ${estado.circuito.vueltas}</p>
      <canvas id="circuito-canvas" width="700" height="300"></canvas>
      <h3>Resultados</h3>
      <ol>
        ${resultado.map(r => `<li>${r.posicion}. ${r.nombre} (${r.puntos} pts)</li>`).join("")}
      </ol>
      <p>Tu posición: <strong>${miResultado.posicion}</strong>, Puntos ganados: <strong>${miResultado.puntos}</strong></p>
      <button onclick="renderSeleccion()">Siguiente carrera</button>
      <button onclick="renderPuntuacion()">Ver puntuación</button>
      <button onclick="renderMenu()">Menú principal</button>
    </div>
  `;
  dibujaCircuito();
}

function renderPuntuacion() {
  app.innerHTML = `
    <div class="puntuacion">
      <h2>Tu puntuación</h2>
      <ul>
        ${estado.carreras.map(c => `<li>${c.circuito}: posición ${c.posicion}, puntos ${c.puntos}</li>`).join("")}
      </ul>
      <h3>Puntos totales: ${estado.puntos}</h3>
      <button onclick="renderSeleccion()">Continuar temporada</button>
      <button onclick="renderMenu()">Menú principal</button>
    </div>
  `;
  document.getElementById('circuito-canvas').style.display = 'none';
}

function dibujaCircuito() {
  const canvas = document.getElementById('circuito-canvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Dibuja una pista ovalada simple
  ctx.strokeStyle = '#e10600';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(350, 150, 300, 100, 0, 0, 2*Math.PI);
  ctx.stroke();
  // Meta
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(350-300, 150);
  ctx.lineTo(350-300, 150+40);
  ctx.stroke();
  // Texto
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Circuito: " + estado.circuito.nombre, 20, 30);
  ctx.fillText("Vueltas: " + estado.circuito.vueltas, 20, 60);
}

window.renderMenu = renderMenu;
window.renderSeleccion = renderSeleccion;
window.actualizaPilotos = actualizaPilotos;
window.iniciarCarrera = iniciarCarrera;
window.renderCarrera = renderCarrera;
window.renderPuntuacion = renderPuntuacion;

renderMenu();