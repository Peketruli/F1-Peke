const app = document.getElementById('app');
const canvas = document.getElementById('gameCanvas');

// Variables globales para modo piloto
let pilotoSeleccionado = null;
let equipoSeleccionado = null;

// Menú principal
function renderMenu() {
  canvas.style.display = "none";
  app.innerHTML = `
    <div class="menu">
      <h1>F1 Web Game</h1>
      <button class="button" onclick="renderModoPilotoSetup()">Modo Piloto</button>
      <button class="button" onclick="renderModoManager()">Modo Manager</button>
      <button class="button" onclick="renderAjustes()">Ajustes</button>
    </div>
  `;
}

// Setup de equipo/piloto para modo piloto
function renderModoPilotoSetup() {
  canvas.style.display = "none";
  app.innerHTML = `
    <div class="modo">
      <h2>Selecciona tu equipo y piloto</h2>
      <form onsubmit="startModoPiloto(event)">
        <label>Equipo:</label>
        <select id="equipo">
          ${EQUIPOS.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')}
        </select>
        <label>Piloto:</label>
        <select id="piloto">
          <option value="0">Piloto 1</option>
          <option value="1">Piloto 2</option>
        </select>
        <button class="button" type="submit">Empezar carrera</button>
      </form>
      <button class="button" onclick="renderMenu()">Volver</button>
    </div>
  `;
}

// Iniciar modo piloto
function startModoPiloto(event) {
  event.preventDefault();
  const equipoId = parseInt(document.getElementById('equipo').value);
  const pilotoIdx = parseInt(document.getElementById('piloto').value);
  equipoSeleccionado = EQUIPOS.find(e => e.id === equipoId);
  pilotoSeleccionado = equipoSeleccionado.pilotos[pilotoIdx];
  iniciarCarreraPiloto();
}

// Renderiza el canvas y llama a la lógica de carrera
function iniciarCarreraPiloto() {
  app.innerHTML = '';
  canvas.style.display = "block";
  startCarreraPiloto(canvas, pilotoSeleccionado, equipoSeleccionado);
}

// Modo Manager (placeholder)
function renderModoManager() {
  canvas.style.display = "none";
  app.innerHTML = `
    <div class="modo">
      <h2>Modo Manager</h2>
      <p>En desarrollo. Aquí tomarás decisiones estratégicas y verás los resultados de tus pilotos.</p>
      <button class="button" onclick="renderMenu()">Volver al menú principal</button>
    </div>
  `;
}

// Ajustes (placeholder)
function renderAjustes() {
  canvas.style.display = "none";
  app.innerHTML = `
    <div class="ajustes">
      <h2>Ajustes</h2>
      <p>En desarrollo. Pronto podrás configurar dificultad, gráficos, audio y más.</p>
      <button class="button" onclick="renderMenu()">Volver al menú principal</button>
    </div>
  `;
}

// Exponer funciones
window.renderMenu = renderMenu;
window.renderModoPilotoSetup = renderModoPilotoSetup;
window.startModoPiloto = startModoPiloto;
window.renderModoManager = renderModoManager;
window.renderAjustes = renderAjustes;

// Inicia en el menú
renderMenu();
